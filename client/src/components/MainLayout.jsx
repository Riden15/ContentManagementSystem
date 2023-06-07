import { React, useContext, useState, useEffect } from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import PageList from './PageList.jsx';
import MessageContext from './MessageCtx.js';
import API from '../API';
import {Link, Outlet} from "react-router-dom";


function MainLayout(props) {
    const [loading, setLoading] = useState(true);  // This state is used for displaying a LoadingLayout while we are waiting an answer from the server.
    const [dirty, setDirty] = useState(true);
    const {handleErrors} = useContext(MessageContext);

    // todo capire come funziona sta funzione
    const innerJoin = (xs, ys, sel) =>
        xs.reduce((zs, x) =>
            ys.reduce((zs, y) =>        // cartesian product - all combinations
                    zs.concat(sel(x, y) || []), // filter out the rows and columns you want
                zs), []);

    // useEffect che riempie lo stato dove ci sono le pagine
    useEffect(() => {
            API.getPages()
                .then(pages => {
                    API.getUsers()
                        .then(users => {
                        const result = innerJoin(users, pages, ({id: uid, name}, {id, title, authorId, creationDate, publicationDate }) =>
                            authorId === uid && {id, title, name, creationDate, publicationDate});
                        props.setPages(result);
                        }).catch(err => {handleErrors(err);})
                    setLoading(false);
                }).catch(err => {
                handleErrors(err);
            });
    }, []);

    const deletePage = (pageId) => {
        API.deletePage(pageId)
            .then(() => {setDirty(true);})
            .catch(err => {handleErrors(err);})
    }

    return (
        loading ? <LoadingLayout /> :
            <>
                <h1 className="below-nav">Lista delle pagine</h1>
                <PageList pages={props.pages} deletePage={deletePage}/>
                <Link className="btn btn-primary btn-lg fixed-right-bottom" to="/add" state={{nextpage: location.pathname}}> &#43; </Link>
            </>
    );
}



function NotFoundLayout() {
    return(
        <>
            <h2>This is not the route you are looking for!</h2>
            <Link to="/">
                <Button variant="primary">Go Home!</Button>
            </Link>
        </>
    );
}
function LoadingLayout() {
    return (
        <Row className="vh-100">
            <Col md={4} bg="light" className="below-nav" id="left-sidebar">
            </Col>
            <Col md={8} className="below-nav">
                <h1>Loading...</h1>
            </Col>
        </Row>
    )
}


export { MainLayout, LoadingLayout , NotFoundLayout};