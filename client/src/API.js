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
async function getPages() {
    return getJson(fetch(SERVER_URL + 'pages')
    ).then( json => {
        return json.map((pagina) =>
            ({id: pagina.id,
                title:pagina.title,
                creationDate: dayjs(pagina.creationDate),
                publicationDate: dayjs(pagina.publicationDate),
                user: {id: pagina.user.id, name: pagina.user.name, admin: pagina.user.admin},
                blocks: pagina.blocks.map((blocco)=>
                    ({id: blocco.id, blockType: blocco.blockType, content: blocco.content, order: blocco.order}))
            }));
    })}

async function getPage(id) {
    return getJson(fetch(SERVER_URL + 'pages/' + id, { credentials: 'include' })
    ).then( pagina => {
        return {
                id: pagina.id,
                title:pagina.title,
                authorId: pagina.authorId,
                creationDate: dayjs(pagina.creationDate),
                publicationDate: dayjs(pagina.publicationDate),
                blocks: pagina.blocks.map((blocco)=>
                    ({id: blocco.id, blockType: blocco.blockType, content: blocco.content, order: blocco.order}))
            };
    })
}

async function addPage(page) {
    return getJson(fetch(SERVER_URL + 'pages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(page)
    }))
}

async function getImages() {
    return getJson(fetch(SERVER_URL + 'images',{ credentials: 'include' }))
}


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
        const object = await response.json();
        return {
            id: object.id,
            name: object.name,
            email: object.email,
            admin: object.admin,
            pagine: object.pagine.map((pagina) => ({
                id: pagina.id,
                title: pagina.title,
                creationDate: dayjs(pagina.creationDate),
                publicationDate: dayjs(pagina.publicationDate),
                user: {id: pagina.user.id, name: pagina.user.name, admin: pagina.user.admin},
                blocks: pagina.blocks.map((blocco) =>
                    ({id: blocco.id, blockType: blocco.blockType, content: blocco.content, order: blocco.order}))
            }))
        };
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getCurrentSession()  {
    const response = await fetch(SERVER_URL+'sessions/current', {
        credentials: 'include'
    });
    if (response.ok) {
        const object = await response.json();
        return {
            id: object.id,
            name: object.name,
            email: object.email,
            admin: object.admin,
            pagine: object.pagine.map((pagina) => ({
                id: pagina.id,
                title: pagina.title,
                authorId: pagina.authorId,
                creationDate: dayjs(pagina.creationDate),
                publicationDate: dayjs(pagina.publicationDate),
                user: {id: pagina.user.id, name: pagina.user.name, admin: pagina.user.admin},
                blocks: pagina.blocks.map((blocco) =>
                    ({id: blocco.id, blockType: blocco.blockType, pageId: blocco.pageId, content: blocco.content, order:blocco.order}))
            }))
        };
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch(SERVER_URL+'sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
}

const API = { getPages, logIn, logOut, getCurrentSession, getPage, getImages ,addPage};
export default API;