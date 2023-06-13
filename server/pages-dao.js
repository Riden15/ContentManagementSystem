'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const dayjs = require('dayjs');
const db = require('./database');
const {Dayjs} = require("dayjs");

/**
 * Wrapper around db.all
 */
const dbAllAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else     resolve(rows);
    });
});

/**
 * Wrapper around db.run
 */
const dbRunAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, err => {
        if (err) reject(err);
        else     resolve();
    });
});

/**
 * Wrapper around db.get
 */
const dbGetAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else     resolve(row);
    });
});

// get all pagine
exports.listPages = async (filter='') => {
    let pages = []
    if (filter === 'published')
    {
        pages = (await dbAllAsync(db, `select * from pages where publicationDate<= '${dayjs().format('YYYY-MM-DD')}' order by publicationDate`)).map(p => ({...p, user:{}, blocks:[]}));
    }
    else {
        pages = (await dbAllAsync(db, "select * from pages order by publicationDate")).map(p => ({...p, user:{}, blocks:[]}));
    }
    const users = (await dbAllAsync(db, "select id, name, admin from users"));
    const blocks = (await  dbAllAsync(db, "select * from blocks"));

    for (const object of pages) {
        const foundBlocks = blocks.filter(b=> b.pageId === object.id);
        const foundUser = users.find(u => u.id === object.authorId);
        if(!foundUser && !foundBlocks) throw "DB inconsistent";
        object.user = foundUser;
        delete object.authorId; // non serve perchè viene ritornato direttamente l'oggetto user
        for (const element of foundBlocks)
        {
            if (foundBlocks.length) object.blocks.push(element);
            delete element.pageId // non serve perchè un blocco viene ritornato collegato alla sua pagina
        }
    }
    return pages;
};

// get the page identified by {id}
exports.getPage = async (id) => {

    const pagina = await dbGetAsync(db, 'SELECT * FROM pages WHERE id=?', [id])
    const blocchi = await dbAllAsync(db, 'SELECT * FROM blocks WHERE pageId=?', [id])
    if(!pagina) return {error: 'Pagina non trovata.'};
    else if(blocchi.length)
    {
        pagina.blocks=[];
        for (const element of blocchi) {
            if (blocchi.length) pagina.blocks.push(element);
            delete element.pageId // non serve perchè un blocco viene ritornato collegato alla sua pagina
        }
        return pagina;
    }
    else return pagina;
};

exports.createPage = async (pagina) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO pages (title, authorId, creationDate, publicationDate) VALUES(?, ?, ?, ?)'
        db.run(sql, [pagina.title, pagina.authorId, pagina.creationDate, pagina.publicationDate], function (err) {
            if(err) {
                reject(err);
            }
            resolve(this.lastID)
        }
        )
    })
}

exports.createBlocks = async (block, pageId) => {
    console.log(block);
    console.log(pageId);
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO blocks (blockType, pageId, content, order) VALUES(?, ?, ?, ?)'
        db.run(sql, [block.blockType, pageId, block.content, block.order], function (err) {
                if(err) {
                    reject(err);
                }
                resolve()
            }
        )
    })
}

exports.listImages = async () => {
    return (await dbAllAsync(db, 'SELECT url FROM images'))
}
