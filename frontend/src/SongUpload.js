import React, { useState } from 'react';

const { channels } = require('./constants');
const { ipcRenderer } = window.require('electron');

function SongUpload(props) {

    const [song, setSong] = useState(null);


    const handleChange = (e) => {
        setSong(e.target.files[0]);
    }

    const handleUpload = () => {
        ipcRenderer.send(channels.GET_SONG, song);
        props.addSong(song);
    }

    return (
        <>
            <input type='file' onChange={handleChange} />
            <input type='button' value={"Upload"} onClick={handleUpload}/>
        </>
    );
}

export default SongUpload;