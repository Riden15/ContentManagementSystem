import { React, useContext, useState, useEffect } from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import PageList from './PageList.jsx';
import MessageContext from './MessageCtx.js';
import API from '../API';
import {Link, Outlet} from "react-router-dom";


function MainLayout(props) {

    const [dirty, setDirty] = useState(true);
    const {handleErrors} = useContext(MessageContext);

    const deletePage = (pageId) => {
        API.deletePage(pageId)
            .then(() => {setDirty(true);})
            .catch(err => {handleErrors(err);})
    }

    return (
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

//todo da modificare, magari mettendoci uno spinner
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