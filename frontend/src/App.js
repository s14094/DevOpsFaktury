import logo from './logo.svg';
import './App.css';
import React, {useState} from "react";
import Post from "./Post";
import MyForm from "./MyForm";


function App() {

  const [initialValue, setInitialValue] = useState(1);

  const handleInitialValue = (event) => {
    setInitialValue(event.target.value);
  };

  return (
      <div>
        {initialValue}
        <br/>
        <input onChange={handleInitialValue}/>

        <Post numberPosts={initialValue} changeParentHandler={setInitialValue}/>

        <MyForm/>
      </div>
  );

}

export default App;
