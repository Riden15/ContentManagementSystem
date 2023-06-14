import {useContext, useEffect, useState} from "react";
import MessageContext from "./MessageCtx.js";
import {useParams} from "react-router-dom";
import PageForm from "./PageForm.jsx";
import API from "../API.js";


function EditLayout(props) {

    const setDirty = props.setDirty;
    const {handleErrors} = useContext(MessageContext);
    const { pageId } = useParams();

    const pagina = props.page.filter((p) => p.id ===pageId);

    // update a film into the list
    const editPage = (page) => {
        API.updatePage(page)
            .then(() => { setDirty(true); })
            .catch(e => handleErrors(e));
    }

    return (
        pagina ? <PageForm page={pagina} editPage={editPage} /> : <></>
    );

}

export default EditLayout;