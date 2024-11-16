import logo from './logo.svg';
import './App.css';
import SongTile from './SongTile';
import { useState } from 'react';
import Album from './Album';

function App() {

  const [dirName, setDirName] = useState('');
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);


  const browseDir = async () => {
    try {
      const dir = await window.showDirectoryPicker(); 
      setDirName(dir.name);

      const files = [];
      const folders = [];
      for await (const [name, handle] of dir.entries()) {
        if (handle.kind === 'file') {
          files.push(handle);
        } else {
          folders.push(handle);
        }
      }

      setFiles(files);
      setFolders(folders);
    } catch (error) {
      console.error(error);
    }
  } 

  const browseFile = async () => {
    try {
      const file = await window.showOpenFilePicker({
        types: [
          {description: 'Audio files',
            accept: {
              'audio/*': ['.mp3', '.m4a', '.wav', '.ogg', '.oga', '.flac', '.aac', '.m4b']
            }
          }
        ]
      });
      setFiles([...files, ...file])

    } catch (error) {
      console.error(error);
    }
  }

  const setModal = () => {
    setOpen(!open);
}



  return (
    <>
      <input type='button' onClick={browseDir} value='Browse Directory'/>
      <input type='button' onClick={browseFile} value='Browse File' />

      {dirName && <h1>Current Directory: {dirName}</h1>}

      <div className="rogue-files">
        <h2 onClick={setModal}>Files found in {dirName}:</h2>
        {open && files.length > 0 && files.map((item, index) => {
            return <SongTile key={index} path={item} />
        })}
      </div>
      <div className='folders'>
        {folders.length > 0 && folders.map((item, index) => {
            return <Album key={index} item={item} />
        })}
      </div>
    </>
  );
}

export default App;
