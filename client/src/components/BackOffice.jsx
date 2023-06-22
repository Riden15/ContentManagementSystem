import {React, useContext} from 'react';
import {Button, Spinner, Table} from 'react-bootstrap';
import MessageContext from './MessageCtx.js';
import API from '../API';
import {Link, useLocation, useNavigate} from "react-router-dom";


function BackOffice(props) {

    const {handleErrors} = useContext(MessageContext);
    const navigate = useNavigate();
    const location = useLocation();
    const user = props.user;

    const deletePage = (pageId) => {
        API.deletePage(pageId)
            .then(() => {
                props.setPages(oldPages => {
                    return oldPages.map(p => {
                        if (pageId === p.id)
                            return {...p, status: "deleted"}
                        else return p;
                    })
                })

                props.setDirty(true);
            })
            .catch(err => {
                handleErrors(err);
            })
    }

    return (
        <>
            <h1 className="below-nav">Lista delle pagine: Back Office</h1>
            <PageListBackOffice pages={props.pages} deletePage={deletePage} user={user}/>
            <Link className="btn btn-primary btn btn-primary btn-lg fixed-right-bottom"
                     state={{nextpage: location.pathname}} to={"/add"} size="lg">
                &#43;
            </Link>
            <Link className="btn btn-primary btn-lg" to="/"> Go to Front Office </Link>
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
                {pageList.map((page, index) => <PageRow key={index} deletePage={props.deletePage} pageData={page} user={user}/>)}
                </tbody>
            </Table>

        </>
    );
}

function PageRow(props) {
    const navigate = useNavigate();
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
                <p>{props.pageData.publicationDate.isValid() ? formatWatchDate(props.pageData.publicationDate, 'MMMM D, YYYY') : ''}</p>
            </td>
            <td>
                <Link className= {props.user.admin!==1 && props.pageData.user.id !== props.user.id || props.pageData.status ? "btn btn-primary disabled" : "btn btn-primary"}
                      state={{nextpage: location.pathname}} to={("/edit/" + props.pageData.id)}>
                    <i className="bi bi-pencil-square" />
                </Link>
                &nbsp;
                <Button variant='danger' disabled={props.user.admin!==1 && props.pageData.user.id !== props.user.id || props.pageData.status} onClick={() =>props.deletePage(props.pageData.id)}>
                    <i className="bi bi-trash"/>
                </Button>
                &nbsp;
                <Link className={props.pageData.status ? "btn btn-primary disabled" : "btn btn-primary"} state={{nextpage: location.pathname}} to={("/components/" + props.pageData.id)}>
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