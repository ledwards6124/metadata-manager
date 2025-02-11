import React, { useState } from 'react';

const path = require('path');
const id3 = require('node-id3tag');

function Song(props) {




    const [name, setName] = useState(props.name);

    const metaSong = id3.read(path.resolve(name));



    return (
        <>
            <p>{name}</p>
            {metaSong.image && (
                <img src={metaSong.image} alt={metaSong.album + "artwork"} />
            )}
        </>
    );
}

export default Song;