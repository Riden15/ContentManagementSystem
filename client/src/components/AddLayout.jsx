import API from "../API.js";
import {useContext} from "react";
import MessageContext from "./MessageCtx.js";
import PageForm from "./PageForm.jsx";
import dayjs from "dayjs";

function AddLayout(props) {
    const {handleErrors} = useContext(MessageContext);
    const setDirty = props.setDirty;
    // add a film into the list

    const addPage = (page) => {
        API.addPage(page)
            .then(() => {
                props.setPages(oldPages =>  [...oldPages,
                    {
                    title:page.title,
                    status: "added",
                    creationDate: dayjs(page.creationDate),
                    publicationDate: dayjs(page.publicationDate),
                    user: {id: page.user.id, name: page.user.name},
                    blocks: page.blocks.map((blocco)=>
                        ({blockType: blocco.blockType, content: blocco.content, order: blocco.order}))}]);
                setDirty(true);})
            .catch(e => handleErrors(e));
    }

    return (
        <PageForm addPage={addPage} user={props.user}/>
    );
}

export default AddLayout;