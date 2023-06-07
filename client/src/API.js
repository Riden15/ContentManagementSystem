'use strict';

import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> }
    return new Promise((resolve, reject) => {
        httpResponsePromise
            .then((response) => {
                if (response.ok) {
                    // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
                    response.json()
                        .then( json => resolve(json) )
                        .catch( err => reject({ error: "Cannot parse server response" }))
                } else {
                    // analyzing the cause of error
                    response.json()
                        .then(obj =>
                            reject(obj)
                        ) // error msg in the response body
                        .catch(err => reject({ error: "Cannot parse server response" })) // something else
                }
            })
            .catch(err => reject({ error: "Cannot communicate"  })
            ) // connection error
    });
}

/*
Getting from the server side the list of pages.
 */
const getPages = async () => {
    return getJson(fetch(SERVER_URL + 'pages')
    ).then( json => {
        return json.map((pagina) => ({id: pagina.id, title:pagina.title, authorId: pagina.authorId, creationDate: dayjs(pagina.creationDate), publicationDate: dayjs(pagina.publicationDate)}))
    })};



/*
Getting from the server the list of users (just name and id)
 */
const getUsers = async () => {
    return getJson(fetch(SERVER_URL + 'users'))
        .then(json => {
            return json.map((user) => ({id: user.id, name:user.name}));
        });
}

const API = { getPages, getUsers };
export default API;