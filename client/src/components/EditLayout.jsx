import {useContext, useEffect, useState} from "react";
import MessageContext from "./MessageCtx.js";
import {useParams} from "react-router-dom";
import PageForm from "./PageForm.jsx";
import API from "../API.js";


function EditLayout(props) {

    const setDirty = props.setDirty;
    const {handleErrors} = useContext(MessageContext);

    const { pageId } = useParams();
    const [page, setPage] = useState(null);

    // todo togliere la useEffect visto che la pagina il client la ha già

    useEffect(() => {
        API.getPage(pageId)
            .then(film => {
                setPage(film);
            })
            .catch(e => {
                handleErrors(e);
            });
    }, [pageId]);

    // update a film into the list
    const editPage = (page) => {
        API.updatePage(page)
            .then(() => { setDirty(true); })
            .catch(e => handleErrors(e));
    }

    return (
        page ? <PageForm page={page} editPage={editPage} /> : <></>
    );

}

export default EditLayout;