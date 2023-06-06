'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const dayjs = require('dayjs');
const db = require('./database');

// get all pagine
exports.listPages = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM pages';
      db.all(sql, [], (err, rows) => {
         if (err) {
             reject(err);
             return;
         }
         const pagine = rows.map((pagina) => ({id: pagina.id, authorId: pagina.authorId, creationDate: dayjs(pagina.creationDate), publicationDate: dayjs(pagina.publicationDate)}));
         resolve(pagine);
      });
    });
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
                const pagina = { id: row.id, authorId: row.authorId, creationDate: dayjs(row.creationDate), publicationDate: dayjs(row.publicationDate)};
                resolve(pagina);
            }
        });
    });
};