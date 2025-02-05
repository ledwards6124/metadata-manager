import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {

  const [text, setText] = useState('');

  const path = '..\\data\\flowers.mp3'


  const call = () => {
    
    fetch('http://localhost:5000/mp3?path=' + path, {
      method: 'GET'
    }).then(res => {
      return res.text();
    }).then(jData => {
      console.log(jData);
      setText(jData);
    })
  }

  return (
    <>
    <h1>Metadata Manager</h1>
    <button onClick={call}>Click me</button>
    <p>{text}</p>
    </>
  );
}

export default App;
