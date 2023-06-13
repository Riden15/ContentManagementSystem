import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'

import { React, useState, useEffect } from 'react';
import { Container, Toast } from 'react-bootstrap/'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Navigation } from './components/Navigation';
import {LoadingLayout, MainLayout, NotFoundLayout,} from './components/MainLayout.jsx';
import {LoginForm} from "./components/LoginForm.jsx";
import MessageContext from './components/MessageCtx.js';
import API from './API';
import {ComponentsList} from "./components/ComponentsList.jsx";
import PageForm from "./components/PageForm.jsx";
import AddLayout from "./components/AddLayout.jsx";
import EditLayout from "./components/EditLayout.jsx";


function App() {

  const [loading, setLoading] = useState(true);  // This state is used for displaying a LoadingLayout while we are waiting an answer from the server.
  const [dirty, setDirty] = useState(true);
  const [message, setMessage] = useState('');

  const [pages, setPages] = useState([[]]);
  const [user, setUser] = useState({});


    useEffect(()=> {
        if(dirty)
        {
            API.getCurrentSession().then(user_withPages => {
                const user = {id: user_withPages.id, name: user_withPages.name, email: user_withPages.email, admin: user_withPages.admin}
                setUser(user);
                setPages(user_withPages.pagine)
                setLoading(false);
                setDirty(false);
            }).catch(err => {
                API.getPages().then(pages => {
                    setPages(pages);
                    setLoading(false);
                    setDirty(false);
                }).catch(e => { handleErrors(e); } )
            });
        }
    }, [dirty])

    const loginSuccessful = (user_withPages) => {
        const user = {id: user_withPages.id, name: user_withPages.name, email: user_withPages.email, admin: user_withPages.admin}
        setUser(user);
        setPages(user_withPages.pagine)
        setLoading(false);
    }

    const doLogOut = async () => {
        await API.logOut();
        setUser(undefined);
        /* set state to empty if appropriate */
    }

    // If an error occurs, the error message will be shown in a toast.
    const handleErrors = (err) => { //todo da rifare, magari mettendo un toast
        let msg = '';
        if (err.error) msg = err.error;
        else if (String(err) === "string") msg = String(err);
        else msg = "Unknown Error";
        setMessage(msg); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
    }

    // todo fare la route per back office front office
  return (
    <BrowserRouter>
      <MessageContext.Provider value={{handleErrors}}>
        <Container fluid className={'App'}>
          <Navigation logOut={doLogOut} user={user}/>
            <Routes>
                <Route path="/" element={loading ? <LoadingLayout/> :<MainLayout pages={pages} setPages={setPages} setDirty={setDirty}/> }/>
                <Route path="add" element={<AddLayout setDirty={setDirty} user={user}/>}/>
                <Route path="edit/:pageId" element={<EditLayout pages={pages} setPages={setPages} setDirty={setDirty} user={user}/>}/>
                <Route path="components/:pageId" element={<ComponentsList pages={pages}/>}/>
                <Route path="/login" element={<LoginForm loginSuccessful={loginSuccessful} setLoading={setLoading}/> } />
                <Route path="*" element={<NotFoundLayout />} />
            </Routes>
          <Toast show={message !== ''} onClose={() => setMessage('')} delay={4000} autohide>
            <Toast.Body>{ message }</Toast.Body>
          </Toast>
        </Container>
      </MessageContext.Provider>
    </BrowserRouter>
  )
}

export default App
