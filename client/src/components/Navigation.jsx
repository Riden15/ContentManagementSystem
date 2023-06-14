import React, {useContext, useState} from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Button} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import API from "../API.js";
import MessageContext from "./MessageCtx.js";

const Navigation = (props) => {
    const navigate = useNavigate();
    const {handleErrors} = useContext(MessageContext);
    const name = props.user && props.user.name;
    const title = props.title;
    const [newTitle, setNewTitle] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const changeTitle = (title) => {
        const newT = {title: title};
        API.setTitle(newT).then(() => {
            props.setTitle(title);
            props.setDirty(true);
        }).catch(err => {handleErrors(err)})
    }

    return (
        <Navbar bg="primary" expand="sm" variant="dark" fixed="top" className="navbar-padding">
            <Link to="/">
                <Navbar.Brand>
                    <i className="bi bi-kanban"></i> {title}
                </Navbar.Brand>
            </Link>
            { props.user && props.user.admin===1 ?
                <>
                    <Form className="my-lg-1" action="#" role="search" aria-label="Quick search" onSubmit={handleSubmit}>
                        <Form.Control className="mr-sm-2" type="search" placeholder="New Title" aria-label="Search query"
                        onChange={event => setNewTitle(event.target.value)}/>
                    </Form>
                    <Button className="btn btn-primary" onClick={()=>changeTitle(newTitle)}>
                        <i className="bi bi-pencil-square"/>
                    </Button>
                </> : <></>
            }
            <Nav className="ml-md-auto ms-auto">
                <Nav.Item>
                    <Nav.Link>
                        <i className="bi bi-person-circle icon-size"/>
                        { name? <>
                                <Navbar.Text className='fs-5'>
                                    {"Signed in as: "+name}
                                </Navbar.Text>
                                <Button className='mx-2' variant='danger' onClick={props.logOut}>Logout</Button>
                            </> :
                            <Navbar.Text className='fs-5' onClick={() => navigate('/login')}>
                                {"Sign in"}
                            </Navbar.Text> }

                    </Nav.Link>

                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export { Navigation };