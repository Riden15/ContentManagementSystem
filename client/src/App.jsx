import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'

import { React, useState, useEffect } from 'react';
import { Container, Toast } from 'react-bootstrap/'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Navigation } from './components/Navigation';
import {MainLayout, NotFoundLayout} from './components/MainLayout.jsx';
import MessageContext from './components/MessageCtx.js';
import API from './API';


function App() {
  const [message, setMessage] = useState('');
  const [pages, setPages] = useState([]);


  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => { //todo da rifare, magari mettendo un toast
    let msg = '';
    if (err.error) msg = err.error;
    else if (String(err) === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  }

  return (
    <BrowserRouter>
      <MessageContext.Provider value={{handleErrors}}>
        <Container fluid className={'App'}>
          <Navigation/>
            <Routes>
                <Route path="/" element={ <MainLayout pages={pages} setPages={setPages}/>}>
                <Route path="add" element={<MainLayout pages={pages} setPages={setPages}/>}/>
                <Route path="edit/:pageId" element={<MainLayout pages={pages} setPages={setPages}/>}/>
                <Route path="components/:pageId" element={<MainLayout pages={pages} setPages={setPages}/>}/>
                <Route path="*" element={<NotFoundLayout />} />
              </Route>
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
