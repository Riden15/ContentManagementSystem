import API from "../API.js";
import {useContext} from "react";
import MessageContext from "./MessageCtx.js";
import PageForm from "./PageForm.jsx";

function AddLayout(props) {
    const {handleErrors} = useContext(MessageContext);
    const setDirty = props.setDirty;
    // add a film into the list

    const addPage = (page) => {
        API.addPage(page)
            .then(() => {setDirty(true);})
            .catch(e => handleErrors(e));
    }

    return (
        <PageForm addPage={addPage} user={props.user}/>
    );
}

export default AddLayout;