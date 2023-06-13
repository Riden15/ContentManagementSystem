import {Link, useParams} from "react-router-dom";
import {Button, Card, Carousel, ListGroup} from "react-bootstrap";
import CarouselItem from 'react-bootstrap/CarouselItem'
import pageList from "./PageList.jsx";
import {React, useState} from "react";


//todo layout da abbellire un po, posizionare bene i bottoni ma soprattutto gestire l'ordine dei blocchi

function ComponentsList(props) {
    const { pageId } = useParams();
    const blocks = props.pages.find(b => b.id === parseInt(pageId)).blocks;

    const [currentBlock, setCurrentBlock]=useState(blocks.find(b=>b.order===1));

    const handleClickLeft=(order)=> {
        const newIndex = order===1 ? order=blocks.length : order-=1
        setCurrentBlock(blocks.find(b=>b.order===newIndex));
    }
    const handleClickRight=(order)=> {
        const newIndex = order===blocks.length ? order=1 : order+=1
        setCurrentBlock(blocks.find(b=>b.order===newIndex));
    }

    return (
        <>

            {blocks.sort((a,b) => a.order - b.order).map((blocco) => <SingleBlock key={blocco.id} blocco={blocco} first={blocco.order}/>)}
            <Link className="btn btn-danger text-center" to={'/'}> Main Page </Link>
        </>

    );
}

function SingleBlock(props) {
    const currentBlock=props.blocco;
    const SERVER_URL = 'http://localhost:3001/';

    return (
        <>
            <Card  className={ props.first===1? 'below-nav text-center' : 'text-center' }  >
                <Card.Body>
                    <Card.Title>{currentBlock.blockType}</Card.Title>
                    {
                        currentBlock.blockType==='immagine' ?
                            <Card.Img style={{ width: '18rem', marginLeft:'auto', marginRight:'auto'}} variant="top" src= {SERVER_URL + currentBlock.content}></Card.Img>
                            : <></>
                    }
                    <Card.Text>
                        {currentBlock.blockType!=='immagine'? currentBlock.content : ''}
                    </Card.Text>
                </Card.Body>
            </Card>
            <br/>
        </>

    );
}

export { ComponentsList };