import {useContext, useEffect, useState} from "react";
import dayjs from "dayjs";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Alert, Button, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import API from "../API.js";
import MessageContext from "./MessageCtx.js";


function PageForm(props) {


    const [title, setTitle] = useState(props.page ? props.page.title : '');
    const [author, setAuthor] = useState(props.page ? {id: props.page.user.id, name: props.page.user.name} : {id: props.user.id, name: props.user.name});
    const [creationDate, setCreationDate] = useState(props.page ? props.page.creationDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const [publicationDate, setPublicationDate] = useState(props.page && props.page.publicationDate.isValid() ? props.page.publicationDate.format('YYYY-MM-DD') : '')
    const [arrayBlocks, setArrayBlocks] = useState(props.page ? props.page.blocks : []);
    const [imagesUrl, setImagesUrl] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('') ;

    const {handleErrors} = useContext(MessageContext);

    // useNavigate hook is necessary to change page
    const navigate = useNavigate();
    const location = useLocation();
    const nextpage = location.state?.nextpage || '/';

    const addBlockHeader = () => {

        const block = {
            blockType: 'Header',
            content: '',
            order: arrayBlocks.length +1
        }
        setArrayBlocks((oldList) => [...oldList, block]);
    }
    const addBlockParagraph = () => {
        const block = {
            blockType: 'Paragrafo',
            content: '',
            order: arrayBlocks.length +1
        }
        setArrayBlocks((oldList) => [...oldList, block]);
    }
    const addBlockImage = () => {
        const block = {
            blockType: 'Immagine',
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
                        id: b.id,
                        order: b.order-1
                    }
                }
                else if(b.order === order-1)
                {
                    return {
                        blockType: b.blockType,
                        content: b.content,
                        id: b.id,
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
                        id: b.id,
                        order: b.order+1
                    }
                }
                else if(b.order === order+1)
                {
                    return {
                        blockType: b.blockType,
                        content: b.content,
                        id: b.id,
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
                    order: b.order,
                    id: b.id
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
    if(props.user.admin ===1) {
        API.getUsers()
            .then(users => {
                const autore = users.find(obj => obj.id===author.id)
                users.splice(users.indexOf(autore), 1);
                users.unshift(autore)
                setUsersList(users);
            }).catch(e => {handleErrors(e)})
    }
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        let valid = true;
        let publication_Date = dayjs(publicationDate);
        let creation_Date = dayjs(creationDate);
        if(publication_Date.isValid() && creation_Date.diff(publication_Date) > 0){
            setErrorMessage("Publication Date can't be before the creation Date");
            valid = false;
        }
        if (arrayBlocks.length<2){
            setErrorMessage("You must insert at least one header and one between paragraph or image");
            valid = false;
        }
        else{
            let numHeaders=0,numPar=0,numImg=0;
            let headInvalid=false,parInvalid=false,imgInvalid=false;
            arrayBlocks.forEach((el) => {
                if(el.blockType==="Header"){
                    numHeaders++;
                    if(el.content === "")
                        headInvalid=true;
                }
                else if(el.blockType==="Paragrafo"){
                    numPar++;
                    if(el.content === "")
                        parInvalid=true;
                }
                else{
                    numImg++;
                    if(el.content === "")
                        imgInvalid=true;
                }
            });
            if(numHeaders===0){
                setErrorMessage("You must insert at least one header");
                valid = false;
            }
            if(numPar===0 && numImg===0){
                setErrorMessage("You must insert at least one between paragraph or image");
                valid = false;
            }
        }

        if(valid) {
            if(props.page) {
                const pagina = {
                    id: props.page.id,
                    title: title.trim(),
                    publicationDate: publicationDate,
                    authorId: author.id,
                    blocks: arrayBlocks
                }
                console.log(pagina);
                console.log(author.id);
                props.editPage(pagina);
            }
            else{
                const pagina = {
                    title: title.trim(),
                    publicationDate: publicationDate,
                    creationDate: creationDate,
                    blocks: arrayBlocks,
                    user: {name: author.name, id:author.id}
                }
                props.addPage(pagina);
            }
            navigate(nextpage);
        }

    }

    return (
        <>
        <div className={'below-nav'}>
            <h1>Inserisci i dati di una pagina</h1>
        <Form className="block-example border border-primary rounded mb-0 form-padding " onSubmit={handleSubmit}>
            {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>

                { props.user.admin ===1 ?
                    <Form.Select aria-label="Default select example" disabled={props.user.admin!==1} required={true} onChange={event => setAuthor({id: event.target.value, name: event.target.name})}>
                        {
                            usersList.map((user, index) => (
                                <option key={index} value={user.id}>{user.name}</option>
                            ))
                        }
                    </Form.Select> :
                    <Form.Control type="text" required={true} value={props.user.name} disabled={true}/>

                }

            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Creation Date</Form.Label>
                <Form.Control type="date" required={true} value={creationDate} disabled={true}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Publication Date</Form.Label>
                <Form.Control type="date" value={publicationDate} onChange={event => setPublicationDate(event.target.value)}/>
            </Form.Group>

            <br/>

            {arrayBlocks.sort((a,b) => a.order - b.order).map((b, index) => <BlockForm
                blocco={b} key={index} images={imagesUrl}
                sali={goUpOrder} scendi={goDownOrder}
                editBlock={changeContent} deleteBlock={deleteBlock}/> )}

            <Button className="mb-3" variant="primary" onClick={addBlockHeader}>Aggiungi blocco Header</Button>
            &nbsp;
            <Button className="mb-3" variant="primary" onClick={addBlockParagraph} >Aggiungi blocco Paragrafo</Button>
            &nbsp;
            <Button className="mb-3" variant="primary" onClick={addBlockImage}>Aggiungi blocco Immagine</Button>
            <br/>
            <Button className="mb-3" variant="primary" type="submit" >Save</Button>
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
            { b.blockType==='Header' ?
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

                : b.blockType==='Paragrafo' ?
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
                        {images.map((option, index) => (
                                    <Col key={index}>
                                     <Card className="text-center" border={b.content===option.url? "danger" : ""}
                                           onClick={event => props.editBlock(b.order, option.url)}>
                                         <Card.Body>
                                             <Card.Img src={option.url} className={"cardImg"}/>
                                             {
                                                 b.content === option.url?
                                                     <Card.Text>Selected</Card.Text> : false
                                             }
                                         </Card.Body>

                                     </Card>
                                    </Col>
                                )
                            )}
                        <Col><Button variant="outline-secondary" id="button-addon2" onClick={() => props.sali(b.order)}><i className="bi bi-arrow-up-circle"></i></Button></Col>
                        <Col><Button variant="outline-secondary" id="button-addon2" onClick={() => props.scendi(b.order)}><i className="bi bi-arrow-down-circle"></i></Button></Col>
                        <Col><Button variant="danger" id="button-addon2" onClick={() => props.deleteBlock(b.order)}><i className="bi bi-trash3"></i></Button></Col>
                    </Row>

            }
            <br/>
        </>


    )
}

export default PageForm;