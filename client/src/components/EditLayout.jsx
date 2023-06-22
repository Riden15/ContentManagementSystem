import {useContext} from "react";
import MessageContext from "./MessageCtx.js";
import {useParams} from "react-router-dom";
import PageForm from "./PageForm.jsx";
import API from "../API.js";


function EditLayout(props) {

    const setDirty = props.setDirty;
    const {handleErrors} = useContext(MessageContext);
    const { pageId } = useParams();

    const pagina = props.pages.find((p) => p.id === parseInt(pageId));

    // update a film into the list
    const editPage = (page) => {
        API.editPage(page)
            .then(() => {
                props.setPages(oldPages => {
                    return oldPages.map(p => {
                        if (page.id === p.id)
                            return {...p, status: "updated"}
                        else return p;
                    })
                })
                setDirty(true);
            })
            .catch(e => {
                handleErrors(e)});
    }

    return (
        pagina ? <PageForm page={pagina} editPage={editPage} user={props.user}/> : <></>
    );

}

export default EditLayout;