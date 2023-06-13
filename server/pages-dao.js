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
        else     resolve(this.lastID);
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
        const findedBlocks = blocks.filter(b=> b.pageId === object.id);
        const findedUser = users.find(u => u.id === object.authorId);
        if(!findedUser && !findedBlocks) throw "DB inconsistent";
        object.user = findedUser;
        delete object.authorId; // non serve perchè viene ritornato direttamente l'oggetto user
        for (const element of findedBlocks)
        {
            if (findedBlocks.length) object.blocks.push(element);
            delete element.pageId // non serve perchè un blocco viene ritornato collegato alla sua pagina
        }
    }
    return pages;
};

// get the page identified by {id}
exports.getPage = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages WHERE id=?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                resolve({error: 'Pagina non trovata.'});
            } else {
                const pagina = { id: row.id, title:row.title, authorId: row.authorId, creationDate: dayjs(row.creationDate), publicationDate: dayjs(row.publicationDate)};
                resolve(pagina);
            }
        });
    });
};

exports.createPage_blocks = async (pagina, blocchi) => {
    const newPageID = await dbRunAsync(db,
        'INSERT INTO pages (title, authorId, creationDate, publicationDate) VALUES(?, ?, ?, ?)',
        [pagina.title, pagina.authorId, pagina.creationDate, pagina.publicationDate]);

    if (blocchi.length > 0) {
        for (const element of blocchi) {
            const sql = await dbRunAsync(db,
                'INSERT INTO blocks (blockType, pageId, content, order) VALUES(?, ?, ?, ?)',
                [element.blockType, newPageID, element.content, element.order]);
        }
    }
    return newPageID;
}