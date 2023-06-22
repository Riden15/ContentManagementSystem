import React, {useContext, useEffect, useState} from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Button} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import API from "../API.js";
import MessageContext from "./MessageCtx.js";

const Navigation = (props) => {
    const navigate = useNavigate();
    const {handleErrors} = useContext(MessageContext);
    const name = props.user && props.user.name;
    const role = props.user && props.user.admin===1 ? 'Administrator' : 'User'
    const [title, setTitle] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [dirtyTitle, setDirtyTitle] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const changeTitle = (title) => {
        const newT = {title: title};
        API.setTitle(newT).then(() => {
            setTitle(title);
            setDirtyTitle(true);
        }).catch(err => {handleErrors(err)})
    }

    useEffect(() => {
        if(dirtyTitle)
        {
            API.getTitle().then(title => {
                setTitle(title.title);
                setNewTitle('')
                setDirtyTitle(false);
            }).catch(e => {handleErrors(e);})
        }
    }, [dirtyTitle])

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
                                    {"Signed in as: "+name + ", Role: "+role}
                                </Navbar.Text>
                                <Button className='mx-2' variant='danger' onClick={props.logOut}>Logout</Button>
                            </> :
                            <Button className='mx-2' onClick={() => navigate('/login')}>Sign In</Button>
                        }


                    </Nav.Link>

                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export { Navigation };