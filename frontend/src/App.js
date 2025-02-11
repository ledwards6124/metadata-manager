import './App.css';
import { useState } from 'react';

import SongUpload from './SongUpload';
import Song from "./Song";


function App() {

  const [songs, setSongs] = useState([]);

  const addSong = (song) => {
    if (songs.includes(song)) {
      return;
    }
    setSongs([...songs, song]);
  }

  const clearSongs = () => {
    setSongs([]);
  }


  return (
    <>
    <h1>Metadata Manager</h1>
    <SongUpload addSong={addSong} />
      {songs.length > 0 && songs.map((song, idx) => <Song key={idx} name={song.name} />)}
    </>
  );
}

export default App;
