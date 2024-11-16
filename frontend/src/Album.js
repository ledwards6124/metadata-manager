import React, { useState, useEffect } from "react";
import SongTile from "./SongTile";

const Album = ({ item }) => {
  const [songs, setSongs] = useState([]);
  const [open, setOpen] = useState(false);




    useEffect(() => {
        const fetchSongs = async () => {
            const files = [];
            for await (const [name, handle] of item.entries()) {
                if (handle.kind === 'file') {
                    files.push(handle);
                }
            }
            setSongs(files);
        }

        fetchSongs();
    }, [item])

    const setModal = () => {
        setOpen(!open);
    }

  return (
    <div className="album" >
        <h2 onClick={setModal}>{item.name}</h2>
      <div className="univ-info">
        {open && !open}
      </div>
      {open && songs.length > 0 &&
        songs.map((song, index) => {
          return <SongTile key={index} path={song} />;
        })}
    </div>
  );
};

export default Album;
