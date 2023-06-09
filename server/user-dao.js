'use strict';
/* Data Access Object (DAO) module for accessing users */

const crypto = require('crypto');
const db = require('./database');


exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({error: 'User not found.'});
            else {
                // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
                const user = {id: row.id, email: row.email, name: row.name, admin: row.admin}
                resolve(user);
            }
        });
    });
};

exports.getUser = (email, password) => {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
                const user = {id: row.id, email: row.email, name: row.name, admin: row.admin};

                const salt = row.salt;

                // 32 è il numero di caratteri per l'hash della password
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                    if (err) reject(err);

                    const passwordHex = Buffer.from(row.password, 'hex');

                    if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
                        resolve(false);
                    else resolve(user);
                });
            }
        });
    });
};