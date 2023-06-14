import {React, useContext, useState, useEffect} from 'react';
import {Row, Col, Button, Spinner, Table} from 'react-bootstrap';
import MessageContext from './MessageCtx.js';
import API from '../API';
import {Link, Outlet, useLocation} from "react-router-dom";
import dayjs from "dayjs";


function BackOffice(props) {

    const {handleErrors} = useContext(MessageContext);
    const user = props.user;

    const deletePage = (pageId) => {
        API.deletePage(pageId)
            .then(() => {
                props.setDirty(true);
            })
            .catch(err => {
                handleErrors(err);
            })
    }

    // todo da aggiunge il controllo se l'utente è admin, il tasto add non ci deve essere
    return (
        <>
            <h1 className="below-nav">Lista delle pagine: Back Office</h1>
            <PageListBackOffice pages={props.pages} deletePage={deletePage} user={user}/>
            <Link className="btn btn-primary btn-lg fixed-right-bottom" to="/add"
                  state={{nextpage: location.pathname}}> &#43; </Link>
            <Link className="btn btn-primary btn-lg" to="/"> Go back to Front Office </Link>

        </>
    );
}

function PageListBackOffice(props) {

    const pageList = props.pages;
    const user = props.user;

    return (
        <>
            <Table striped bordered>
                <thead>
                <tr>
                    <th>Titolo</th>
                    <th>Autore</th>
                    <th>Data di creazione</th>
                    <th>Data di pubblicazione</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {pageList.map((page) => <PageRow key={page.id} pageData={page} user={user}/>)}
                </tbody>
            </Table>

        </>
    );
}

function PageRow(props) {
    const formatWatchDate = (dayJsDate, format) => {
        return dayJsDate ? dayJsDate.format(format) : '';
    }

    const location = useLocation();

    let statusClass = null;

    switch (props.pageData.status) {
        case 'added':
            statusClass = 'table-success';
            break;
        case 'deleted':
            statusClass = 'table-danger';
            break;
        case 'updated':
            statusClass = 'table-warning';
            break;
        default:
            break;
    }

    return (
        <tr className={statusClass}>
            <td>
                <p className={"favorite"}>{props.pageData.title}</p>
            </td>
            <td>
                <p>{props.pageData.user.name}</p>
            </td>
            <td>
                <p>{formatWatchDate(props.pageData.creationDate, 'MMMM D, YYYY')}</p>
            </td>
            <td>
                <p>{formatWatchDate(props.pageData.publicationDate, 'MMMM D, YYYY')}</p>
            </td>
            <td>
                <Link className="btn btn-primary" to={"/edit/" + props.pageData.id}
                      state={{nextpage: location.pathname}}>
                    <i className="bi bi-pencil-square"/>
                </Link>
                &nbsp;
                <Button variant='danger' onClick={() => props.deletePage(props.pageData.id)}>
                    <i className="bi bi-trash"/>
                </Button>
                &nbsp;
                <Link className="btn btn-primary" to={"/components/" + props.pageData.id}
                      state={{nextpage: location.pathname}}>
                    <i className="bi bi-eye"></i>
                </Link>

            </td>
        </tr>
    );
}

function NotFoundLayout() {
    return (
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
        <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}


export {BackOffice, NotFoundLayout, LoadingLayout};