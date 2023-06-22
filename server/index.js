'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult, body} = require('express-validator'); // validation middleware
const pagesDao = require('./pages-dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const cors = require('cors');

const session = require("express-session");
const {deletePage} = require("./pages-dao");
const LocalStrategy = require("passport-local").Strategy;

// init express
const app = new express();

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

app.use('/images', express.static('images')) // serve per far tornare dal server le immagini

const answerDelay = 300; //todo alla fine togliere il delay


/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
};


/*** Set Up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function(username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if(user)
            {return done (null, user);}
            else     {return done(null, false, { status: 401, message: 'Incorrect username and/or password.' });}
        }).catch(() => /* db error */ {return done(null, false, {status:500, message: "Database error"});})
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
        done(err, null);
    });
});

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'sdfojnsjifbshubfvuiysabflisdf',   //personalize this random string, should be a secret value
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
        return next();
    return res.status(401).json({ error: 'Not authenticated'});
}

/***   PAGES APIs    ***/

/*
    1. GET /api/pages
    ritorna la lista delle pagine che hanno lo stato 'pubblicato' cioè che la data è prima della data odierna (per utenti non autenticati)
 */
app.get('/api/pages', async (req, res) => {
    try {
        const pagine = await pagesDao.listPages('published');
        setTimeout(() => res.json(pagine), answerDelay);
    } catch {
        res.status(503).json({errors: ["Database error"]});
    }
});

/*
    2. GET /api/pages/<id>
    ritorna una pagina specifica identificata da <id>
*/
app.get('/api/pages/:id', isLoggedIn, [check('id').isInt({min:1})],
    async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
    }
    try {
        const result = await pagesDao.getPage(req.params.id);
        if(result.error)
            res.status(404).json(result);
        else
            setTimeout(()=>res.json(result), answerDelay);
    } catch(err) {
        res.status(503).json({errors: ["Database error"]});
    }
});

/*
    3. POST /api/pages
    crea una nuova pagina provvedendo tutte le informazioni necessarie
 */
app.post('/api/pages', isLoggedIn,
    [
        check('title').isLength({min:1}).withMessage("Title can't be less that one character"),
        check('creationDate').isDate({format: "YYYY-MM-DD"}).withMessage("Date must be of format YYYY-MM-DD"),
        check('blocks.*.blockType').isIn(["Header", "Paragrafo", "Immagine"]),
        check("blocks").custom( b => {
            let header=false, par=false, image=false;
            header = b.filter((e) => e.blockType==="Header").length>0;
            par = b.filter((e) => e.blockType==="Paragrafo").length>0;
            image = b.filter((e) => e.blockType==="Immagine").length>0;
            return header && (par || image);
        }).withMessage("You must insert at least one header and one between paragraph or image"),
        check("blocks.*.content").notEmpty().withMessage("Content must be specified"),
        check("blocks.*.order").notEmpty().withMessage("Order must be specified").isNumeric().withMessage("Order must be a number")
    ],
    async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter); // format error message
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
        }
        const pagina = {
            title: req.body.title,
            authorId: req.user.id,
            creationDate: req.body.creationDate,
            publicationDate: req.body.publicationDate
        }
        try{
            const pageId = await pagesDao.createPage(pagina);
            for (const block of req.body.blocks) {
                await pagesDao.createBlocks(block, pageId);
            }
            const newPage = await pagesDao.getPage(pageId);
            res.json(newPage);
        } catch (err) {
            res.status(503).json({ error: `Database error during the creation of new page and related blocks: ${err}` });
        }
    }
);


/*
    4. PUT /api/pages
    Modifica una pagina dando tutte le informazioni necessarie
 */
app.put('/api/pages/:id', isLoggedIn,
    [
        check('title').isLength({min:1}).withMessage("Title can't be less that one character"),
        check('blocks.*.blockType').isIn(["Header", "Paragrafo", "Immagine"]),
        check("blocks").custom( b => {
            let header=false, par=false, image=false;
            header = b.filter((e) => e.blockType==="Header").length>0;
            par = b.filter((e) => e.blockType==="Paragrafo").length>0;
            image = b.filter((e) => e.blockType==="Immagine").length>0;
            return header && (par || image);
        }).withMessage("You must insert at least one header and one between paragraph or image"),
        check("blocks.*.content").notEmpty().withMessage("Content must be specified"),
        check("blocks.*.order").notEmpty().withMessage("Order must be specified").isNumeric().withMessage("Order must be a number")
    ],
    async (req, res) => {
        const errors = validationResult(req).formatWith(errorFormatter); // format error message
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
        }
        // Is the id in the body equal to the id in the url?
        if (req.body.id !== Number(req.params.id)) {
            return res.status(422).json({ error: 'URL and body id mismatch' });
        }

        let pagina = {}
        if(req.user.admin ===1)
        {
            pagina = {
                id: req.body.id,
                title: req.body.title,
                publicationDate: req.body.publicationDate,
                authorId: req.body.authorId}
        }
        else {
            pagina = {
                id: req.body.id,
                title: req.body.title,
                publicationDate: req.body.publicationDate}
        }

        const owner = await pagesDao.getOwner(req.params.id);
        if(!owner) return res.status(404).json({ error: 'Page id not valid' });

        if(req.user.admin ===1 || req.user.id === owner.authorId)
        {
            await pagesDao.updatePage(pagina, req.user.admin, req.user.id);
            await pagesDao.deleteBlocks(pagina.id);
            for (const block of req.body.blocks) {
                await pagesDao.createBlocks(block, pagina.id);
            }
            const newPage = await pagesDao.getPage(req.body.id);
            res.json(newPage);
        }
        else {
            return res.status(422).json({ error: 'The User is not the author of the selected page' });
        }
        try{

        } catch (err) {
            res.status(503).json({ error: `Database error during the creation of new page and related blocks: ${err}` });
        }
    }
);


/*
    5. DELETE /api/pages/id
    dato l'id di una pagina elimina dal database la pagina corrispondente e i suoi relativi blocchi
 */
app.delete('/api/pages/:id', isLoggedIn,
    [ check('id').isInt() ],
    async (req, res) => {
        try {

            const owner = await pagesDao.getOwner(req.params.id);
            if(!owner) return res.status(404).json({ error: 'Page id not valid' });

            if(req.user.admin ===1 || req.user.id === owner.authorId)
            {
                await pagesDao.deletePage(req.params.id, req.user.admin, req.user.id);
                await pagesDao.deleteBlocks(req.params.id);
            }
            else {
                return res.status(422).json({ error: 'The User is not the author of the selected page' });
            }
            res.status(200).json({});
        } catch (err) {
            res.status(503).json({ error: `Database error during the deletion of page ${req.params.id}: ${err} ` });
        }
    }
);

/*
    6. GET /api/images
    ritorna la lista completa delle immagini del server (gli url)\
*/
app.get('/api/images', async (req, res) => {
    try {
        const immagini = await pagesDao.listImages();
        res.json(immagini)
    } catch {
        res.status(503).json({errors: ["Database error"]});
    }
});

/*
    7. GET /api/title
    ritorna il titolo della pagina
*/
app.get('/api/title', async (req, res) => {
    try {
        const title = await pagesDao.getTitle();
        res.json(title)
    } catch {
        res.status(503).json({errors: ["Database error"]});
    }
});

/*
    8. PUT /api/title
    cambia il titolo del sito
*/
app.put('/api/title', isLoggedIn, async (req, res) => {
    try {
        if (req.user.admin !== 1)
        {
            return res.status(422).json({errors: ["Only an admin can change the title"]})
        }
        else{
            await pagesDao.setTitle(req.body.title);
            setTimeout(() => res.status(200).json({}), answerDelay);
        }
    } catch {
        res.status(503).json({errors: ["Database error"]});
    }
});


/***   USERS APIs    ***/

/*
    1. POST /api/sessions
    login
    ritorna la lista completa delle pagine (per darla agli utenti autenticati)
*/
app.post('/api/sessions',
    body("username", "username is not a valid email").isEmail(),
    body("password", "password must be a non-empty string").isString().notEmpty(),
    function(req, res, next) {
        // check if validation is ok
        const err = validationResult(req);
        const errList=[];
        if (!err.isEmpty()) {
            errList.push(...err.errors.map(e => e.msg));
            return res.status(422).json({errors: errList});
        }

        // actual authentication
        passport.authenticate('local', (err, user, info) => {
            if (err)
                res.status(err.status).json({errors: [err.msg]});
            else{
                // success, perform the login
                req.login(user, async (err) => {
                    if (err) return next(err);
                    else {
                        try {
                            const pagine = await pagesDao.listPages();
                            setTimeout(() => res.json({id: req.user.id, name: req.user.name, email: req.user.email, admin:req.user.admin, pagine}), answerDelay);
                        } catch {
                            res.status(503).json({errors: ["Database error"]});
                        }
                    }
                });
            }
        })(req, res, next);
    });

/**
    2. Logout
 */
app.delete("/api/sessions/current", isLoggedIn, (req, res) => {
    req.logout(() => res.end());
});

/*
    3. GET api/sessions/current
    controlla se l'utente è loggato o no
    in caso di risposta positiva ritorna la lista completa di pagine
*/
app.get('/api/sessions/current', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const pagine = await pagesDao.listPages();
            setTimeout(() => res.json({id: req.user.id, name: req.user.name, email: req.user.email, admin:req.user.admin, pagine}), answerDelay);
        } catch {
            res.status(503).json({errors: ["Database error"]});
        }
    } else
        res.status(401).json({error: 'Unauthenticated user!'});

});

/*
    4. GET /api/users
    ritorna la lista completa di utenti (solo il nome e l'id)
 */

app.get('/api/users', isLoggedIn, async (req, res) => {
    try {
        if (req.user.admin !== 1)
        {
            return res.status(422).json({errors: ["Only an admin can have the list of users"]})
        }
        const title = await userDao.getUsers();
        res.json(title)
    } catch {
        res.status(503).json({errors: ["Database error"]});
    }
});



/***    Other express-related instructions     ***/

// Activate the server
const port = 3001;
app.listen(port, () => {
    console.log(`react-qa-server listening at http://localhost:${port}`);
});
