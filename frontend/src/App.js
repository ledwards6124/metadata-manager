/* eslint-ignore */

import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  useEffect(() => {
    if (window.Electron) {
      window.Electron.ipcRenderer.send('page-rendered');
    }
  }, []);

  const [text, setText] = useState('');


  const call = () => {
    fetch('http://localhost:5000/', {
      method: 'GET'
    }).then((response) => {
      return response.json();
    }).then((jData) => {
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
