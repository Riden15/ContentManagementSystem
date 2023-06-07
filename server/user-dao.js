'use strict';
/* Data Access Object (DAO) module for accessing users */

const crypto = require('crypto');
const db = require('./database');

// get the list of users (just name and id)
exports.listUsers = () => {
    return new Promise((resolve, reject) => {
       const sql = 'SELECT id, name FROM users';
       db.all(sql, [], (err, rows) => {
           if(err) {
               reject(err);
               return;
           }
           const users = rows.map((user) => ({id: user.id, name:user.name}));
       resolve(users);
       });
    });
}