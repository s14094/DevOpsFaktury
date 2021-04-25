import React, {useState, useEffect} from "react"
import axios from "axios";

const Post = (props) => {
    const [posts, setPosts] = useState([]);
    const [number, setNumber] = useState(-1);
    const mainUrl = 'https://jsonplaceholder.typicode.com';

    useEffect(() => {
        axios.get(mainUrl + '/posts')
            .then(response => setPosts(response.data))
            .catch(error => console.error(error))
    }, []);

    const handlePostClick = (event) => {
        console.log(event.target)
    };

    const handleNumberChange = (event) => {
        setNumber(event.target.value);
        props.changeParentHandler(event.target.value);
    };

    return (
        <>
            <div>
                {posts
                    //.filter(post => post.title.startsWith("a"))
                    .slice(0, props.numberPosts)
                    .map(post => (<div key={post.id} onClick={handlePostClick}>{post.title}</div>))}
            </div>
            <div>
                <div>Number {number}</div>
                <input onChange={handleNumberChange}/>
            </div>
        </>
    )
};

export default Post;
