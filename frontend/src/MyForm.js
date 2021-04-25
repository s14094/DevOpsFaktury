import React, {useState, useEffect} from "react"
import axios from "axios";


const MyForm = (props) => {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const handleSubmit = (event) => {
        console.log(`Dane do wyslania ${title} ${body}`);
        event.preventDefault();

        axios.post('https://jsonplaceholder.typicode.com/posts', {
            title: title,
            body: body,
            userId: 1
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.error(error);
            });
    };

    return (
        <>
            <input type='text' value={title} onChange={event => setTitle(event.target.value)}/>
            <br/>
            <input type='text' value={body} onChange={event => setBody(event.target.value)}/>

            <input type='submit' value='ok' onClick={handleSubmit}/>
        </>
    );
};


export default MyForm;
