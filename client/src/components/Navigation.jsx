import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Button} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';

const Navigation = (props) => {
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
    }
    const name = props.user && props.user.name;

    return (
        <Navbar bg="primary" expand="sm" variant="dark" fixed="top" className="navbar-padding">
            <Link to="/">
                <Navbar.Brand>
                    <i className="bi bi-kanban"></i> Content Management system
                </Navbar.Brand>
            </Link>
            <Form className="my-2 my-lg-0 mx-auto d-sm-block" action="#" role="search" aria-label="Quick search" onSubmit={handleSubmit}>
                <Form.Control className="mr-sm-2" type="search" placeholder="Search" aria-label="Search query" />
            </Form>
            <Nav className="ml-md-auto">
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