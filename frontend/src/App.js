import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    if (window.Electron) {
      window.Electron.ipcRenderer.send('page-rendered');
    }
  }, []);

  return (
    <>
    <h1>Metadata Manager</h1>
    </>
  );
}

export default App;
