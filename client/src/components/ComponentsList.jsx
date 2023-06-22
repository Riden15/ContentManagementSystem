import {Link, useLocation, useParams} from "react-router-dom";
import {Card} from "react-bootstrap";
import {React} from "react";



function ComponentsList(props) {
    const { pageId } = useParams();
    const location = useLocation();
    const nextpage = location.state?.nextpage || '/';
    const blocks = props.pages.find(b => b.id === parseInt(pageId)).blocks;
    const page = props.pages.find(b => b.id === parseInt(pageId))

    return (
        <>
            <h1 className="below-nav">{"Titolo: " + page.title + ", Autore: " + page.user.name}</h1>
            {blocks.sort((a,b) => a.order - b.order).map((blocco) => <SingleBlock key={blocco.id} blocco={blocco} first={blocco.order}/>)}
            <Link className="btn btn-danger text-center" to={nextpage}> Main Page </Link>
        </>

    );
}

function SingleBlock(props) {
    const currentBlock=props.blocco;
    return (
        <>
            <Card  className={ props.first===1? 'text-center' : 'text-center' }  style={{ width: '50rem' }} >
                <Card.Body>
                    <Card.Title>{currentBlock.blockType}</Card.Title>
                    {
                        currentBlock.blockType==='Immagine' ?
                            <Card.Img style={{ width: '10rem', marginLeft:'auto', marginRight:'auto'}} variant="top" src= {currentBlock.content}></Card.Img>
                            : <></>
                    }
                    <Card.Text>
                        {currentBlock.blockType!=='Immagine'? currentBlock.content : ''}
                    </Card.Text>
                </Card.Body>
            </Card>
            <br/>
        </>

    );
}

export { ComponentsList };


