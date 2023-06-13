import 'dayjs';

import { Table } from 'react-bootstrap/'
import {Link, useLocation} from "react-router-dom";
import {Button} from "react-bootstrap";

function PageList(props) {

    const pageList = props.pages;

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
            { pageList.map((page) => <PageRow key={page.id} pageData={page}/>) }
            </tbody>
        </Table>

        </>
    );
}

function PageRow(props) {
    const formatWatchDate = (dayJsDate, format) => {
        return dayJsDate ? dayJsDate.format(format) : '';
    }
    // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
    const location = useLocation();

    let statusClass = null;

    switch(props.pageData.status) {
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

    return(
        <tr className={statusClass}>
            <td>
                <p className={"favorite"} >{props.pageData.title}</p>
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
                <Link className="btn btn-primary" to={"/edit/" + props.pageData.id} state={{nextpage: location.pathname}}>
                    <i className="bi bi-pencil-square"/>
                </Link>
                &nbsp;
                <Button variant='danger' onClick={() => props.deletePage(props.pageData.id)}>
                    <i className="bi bi-trash"/>
                </Button>
                &nbsp;
                <Link className="btn btn-primary" to={"/components/" + props.pageData.id} state={{nextpage: location.pathname}} >
                    <i className="bi bi-eye"></i>
                </Link>
            </td>
        </tr>
    );
}

export default PageList;
