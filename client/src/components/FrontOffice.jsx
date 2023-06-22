import {React, useContext, useState, useEffect} from 'react';
import {Row, Col, Button, Spinner, Table} from 'react-bootstrap';
import MessageContext from './MessageCtx.js';
import API from '../API';
import {Link, Outlet, useLocation} from "react-router-dom";
import * as PropTypes from "prop-types";
import dayjs from "dayjs";


function FrontOffice(props) {

    const user = props.user;

    return (
        <>
            <h1 className="below-nav">Lista delle pagine: Front Office</h1>
            <PageListFrontOffice pages={props.pages} user={user}/>
            {user ?
                <Link className="btn btn-primary btn-lg" to="backOffice"> Go to Back Office </Link> :
                <></>
            }
        </>
    );
}

function PageListFrontOffice(props) {

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
                {
                    user ?
                        pageList.filter((page) => ( page.publicationDate.isValid() && !page.publicationDate.isAfter(dayjs()))).map((page) =>
                            <PageRow key={page.id} pageData={page} user={user}/>) :
                        pageList.map((page) => <PageRow key={page.id} pageData={page} user={user}/>)
                }
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
                <Link className="btn btn-primary" to={"/components/" + props.pageData.id}
                      state={{nextpage: location.pathname}}>
                    <i className="bi bi-eye"></i>
                </Link>
            </td>
        </tr>
    );
}

export {FrontOffice};