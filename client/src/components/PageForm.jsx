import {useContext, useEffect, useState} from "react";
import dayjs from "dayjs";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Button, Col, Form, FormGroup, InputGroup, Row} from "react-bootstrap";
import API from "../API.js";
import MessageContext from "./MessageCtx.js";


function PageForm(props) {

    // todo l'autore e il creation Date non deve essere modificabile
    // todo controllare consistenza tra le date, sia nel client che nel server


    const [title, setTitle] = useState(props.page ? props.page.title : '');
    const [author, setAuthor] = useState( props.user ? props.user.name: '');
    const [creationDate, setCreationDate] = useState(props.page ? props.page.creationDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const [publicationDate, setPublicationDate] = useState(props.page ? props.page.publicationDate.format('YYYY-MM-DD') : '')
    const [arrayBlocks, setArrayBlocks] = useState([]);
    const [imagesUrl, setImagesUrl] = useState([])

    const {handleErrors} = useContext(MessageContext);

    // useNavigate hook is necessary to change page
    const navigate = useNavigate();
    const location = useLocation();
    const nextpage = location.state?.nextpage || '/';

    const addBlockHeader = () => {

        const block = {
            blockType: 'header',
            content: '',
            order: arrayBlocks.length +1
        }
        setArrayBlocks((oldList) => [...oldList, block]);
    }
    const addBlockParagraph = () => {
        const block = {
            blockType: 'paragrafo',
            content: '',
            order: arrayBlocks.length +1
        }
        setArrayBlocks((oldList) => [...oldList, block]);
    }
    const addBlockImage = () => {
        const block = {
            blockType: 'immagine',
            content: '',
            order: arrayBlocks.length +1
        }
        setArrayBlocks((oldList) => [...oldList, block]);
    }
    function goUpOrder(order) {
        setArrayBlocks((oldList) => oldList.map((b) => {
            if(order!==1)
            {
                if (b.order === order)
                {
                    return {
                        blockType: b.blockType,
                        content: b.content,
                        order: b.order-1
                    }
                }
                else if(b.order === order-1)
                {
                    return {
                        blockType: b.blockType,
                        content: b.content,
                        order: b.order+1
                    }
                }
                else return b
            }
            else return b;
        }));
    }
    function goDownOrder(order) {
        setArrayBlocks((oldList) => oldList.map((b) => {
            if(order!==arrayBlocks.length+1)
            {
                if (b.order === order)
                {
                    return {
                        blockType: b.blockType,
                        content: b.content,
                        order: b.order+1
                    }
                }
                else if(b.order === order+1)
                {
                    return {
                        blockType: b.blockType,
                        content: b.content,
                        order: b.order-1
                    }
                }
                else return b
            }
            else return b;
        }));
    }
    function changeContent(order, content) {
        setArrayBlocks((oldList) => oldList.map((b) => {
            if(b.order === order) {
                return {
                    blockType: b.blockType,
                    content: content,
                    order: b.order
                }
            }
            else return b
        }));
    }
    function deleteBlock(order) {
        setArrayBlocks((oldList) => oldList.filter((b) => b.order !==order)
            .map((b) => {
                if (b.order>order)
                {
                    return {
                        blockType: b.blockType,
                        content: b.content,
                        order: b.order-1
                    }
                }
                else return b;
                }
            ))}

    useEffect(() => {
        API.getImages()
            .then(urls => {
                setImagesUrl(urls);
            }).catch(e => {handleErrors(e)})
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();

        // String.trim() method is used for removing leading and ending whitespaces from the title.
        const film = {"title": title.trim(), "favorite": favorite, "rating": rating, "watchDate": watchDate }

        /* In this solution validations are executed through HTML.
           If you prefer JavaScript validations, this is the right place for coding them. */

        if(props.film) {
            film.id = props.film.id;
            props.editFilm(film);
        }
        else
            props.addFilm(film);

        navigate('/');
    }


    return (
        <>
        <div className={'below-nav'}>
            <h1>Inserisci i dati di una pagina</h1>
        <Form className="block-example border border-primary rounded mb-0 form-padding " onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control type="text" value={author} disabled={true}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Creation Date</Form.Label>
                <Form.Control type="date" required={true} value={creationDate} disabled={true}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Publication Date</Form.Label>
                <Form.Control type="date" required={true} value={publicationDate} onChange={event => setPublicationDate(event.target.value)}/>
            </Form.Group>

            <br/>

            {arrayBlocks.sort((a,b) => a.order - b.order).map((b) => <BlockForm
                blocco={b} key={b.order} images={imagesUrl}
                sali={goUpOrder} scendi={goDownOrder}
                editBlock={changeContent} deleteBlock={deleteBlock}/> )}

            <Button className="mb-3" variant="primary" onClick={addBlockHeader}>Aggiungi blocco Header</Button>
            &nbsp;
            <Button className="mb-3" variant="primary" onClick={addBlockParagraph} >Aggiungi blocco Paragrafo</Button>
            &nbsp;
            <Button className="mb-3" variant="primary" onClick={addBlockImage}>Aggiungi blocco Immagine</Button>
            <br/>
            <Button className="mb-3" variant="primary" >Save</Button>
            &nbsp;
            <Link className="btn btn-danger mb-3" to={nextpage}> Cancel </Link>
        </Form>

        </div>
        </>
    )
}

function BlockForm(props) {
    const b = props.blocco;
    const images = props.images;

    return(
        <>
            { b.blockType==='header' ?
                <>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">Header</InputGroup.Text>
                        <Form.Control onChange={event => props.editBlock(b.order, event.target.value)}
                            aria-label="Username"
                            value={b.content}
                            aria-describedby="basic-addon1"
                            required={true}
                            type="text"
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={() => props.sali(b.order)}><i className="bi bi-arrow-up-circle"></i></Button>
                        <Button variant="outline-secondary" id="button-addon2" onClick={() => props.scendi(b.order)}><i className="bi bi-arrow-down-circle"></i></Button>
                        <Button variant="danger" id="button-addon2" onClick={() => props.deleteBlock(b.order)}><i className="bi bi-trash3"></i></Button>
                    </InputGroup>
                </>

                : b.blockType==='paragrafo' ?
                    <>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Paragrafo</InputGroup.Text>
                            <Form.Control onChange={event => props.editBlock(b.order, event.target.value)}
                                aria-label="Username"
                                value={b.content}
                                aria-describedby="basic-addon1"
                                required={true}
                                type="text"
                            />
                            <Button variant="outline-secondary" id="button-addon2" onClick={() => props.sali(b.order)}><i className="bi bi-arrow-up-circle"></i></Button>
                            <Button variant="outline-secondary" id="button-addon2" onClick={() => props.scendi(b.order)}><i className="bi bi-arrow-down-circle"></i></Button>
                            <Button variant="danger" id="button-addon2" onClick={() => props.deleteBlock(b.order)}><i className="bi bi-trash3"></i></Button>
                        </InputGroup>
                    </> :
                    <Row className="mb-3">
                        <FormGroup className="mb-3">
                        {images.map((i) => (
                        <>
                                <Form.Check onChange={event => props.editBlock(b.order, event.target.id)}
                                            inline
                                            name="group1"
                                            type='radio'
                                            id={i.url}
                                />
                                <img src={i.url} alt={''}/>
                        </>
                        )
                        )}
                            <Button variant="outline-secondary" id="button-addon2" onClick={() => props.sali(b.order)}><i className="bi bi-arrow-up-circle"></i></Button>
                            <Button variant="outline-secondary" id="button-addon2" onClick={() => props.scendi(b.order)}><i className="bi bi-arrow-down-circle"></i></Button>
                            <Button variant="danger" id="button-addon2" onClick={() => props.deleteBlock(b.order)}><i className="bi bi-trash3"></i></Button>
                        </FormGroup>
                    </Row>

            }
            <br/>
        </>


    )
}

export default PageForm;