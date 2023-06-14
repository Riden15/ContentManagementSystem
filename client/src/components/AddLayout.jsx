import API from "../API.js";
import {useContext} from "react";
import MessageContext from "./MessageCtx.js";
import PageForm from "./PageForm.jsx";

function AddLayout(props) {
    const {handleErrors} = useContext(MessageContext);
    const setDirty = props.setDirty;
    const setLoading = props.setLoading;
    // add a film into the list

    const addPage = (page) => {
        API.addPage(page)
            .then(() => {
                setDirty(true);
                setLoading(true);})
            .catch(e => handleErrors(e));
    }

    return (
        <PageForm addPage={addPage} user={props.user}/>
    );
}

export default AddLayout;