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

async function logIn(credentials) {
    let response = await fetch(SERVER_URL + 'sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        return await response.json();
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

const API = { getPages, logIn };
export default API;