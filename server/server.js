'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const cors = require('cors');

// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

const answerDelay = 300; //todo alla fine togliere il delay


/*** Utility Functions ***/

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
};


/***    APIs    ***/

// GET /api/pages
app.get('/api/pages', (req, res) => {
    dao.listPages()
        .then(pagine => setTimeout(()=>res.json(pagine), answerDelay))
        .catch(() => res.status(500).end())
});

// GET /api/pages/<id>
app.get('/api/pages/:id', [check('id').isInt({min:1})],
    async (req, res) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
    }
    try {
        const result = await dao.getPage(req.params.id);
        if(result.error)
            res.status(404).json(result);
        else
            setTimeout(()=>res.json(result), answerDelay);
    } catch(err) {
        res.status(500).end();
    }
});

/***    Other express-related instructions     ***/

// Activate the server
app.listen(port, () => {
    console.log(`react-qa-server listening at http://localhost:${port}`);
});
