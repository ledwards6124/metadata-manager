import React, { useState, useEffect, useCallback } from 'react';
import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';

const SongTile = ({ path }) => {
  const [formData, setFormData] = useState({});
  const [artwork, setArtwork] = useState('');
  const [open, setOpen] = useState(false);


  const readTags = async () => {
    try {
      const file = await path.getFile();  // Use the FileSystemFileHandle's getFile method
      new jsmediatags.Reader(file)
        .read({
          onSuccess: (tag) => {
            setFormData(tag.tags);
            if (tag.tags.picture) {
                const artData = tag.tags.picture.data;
                const imgBlob = new Blob([new Uint8Array(artData)], {type: 'image/png'});
                const imgURL = URL.createObjectURL(imgBlob);
                setArtwork(imgURL);
            }
          },
          onError: (error) => {
            console.error(error);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    readTags(); // Fetch when it mounts
    getAudio(); //fetch when mounts
  }, [path]); // Run if path changes

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setFormData((prevData) => {
      // Clone the existing data
      const updatedData = { ...prevData };
  
      // Update the relevant nested field
      if (updatedData[name]) {
        updatedData[name].data = value;
      } else {
        // Handle cases where the field might not exist
        updatedData[name] = { data: value };
      }
  
      return updatedData;
    });
  };
  

  const setModal = () => {
    setOpen(!open);
  }

  const getAudio = async () => {
    const file = await path.getFile();
    const url = URL.createObjectURL(file);
    new jsmediatags.Reader(file)
      .read({
        onSuccess: (tag) => {
          const audio = document.getElementsByClassName(`player-${formData.TT2?.data}`)[0];
          if (audio) {
            audio.src = url;
          }
          
        },
        onError: (error) => {
          console.error(error);
        }
      })
  }
  

  return (
    <div className='song'>
        <label>
            <img onClick={setModal}
             style={{
                width: 100,
                height: 100,
                objectFit: 'contain'
            }} src={artwork} alt={'Artwork for ' + formData.TAL?.data}/>
            <h2>{!open && formData.TRK?.data.replace(/\/.*/, '') +  '.'} {!open && formData.TT2?.data}</h2>
            <audio className={`player-${formData.TT2?.data}`} controls>
              <source></source>
            </audio>
        </label>
     {open && <form className='song-info'>
        <label>Title:
        <input
          type="text"
          name="TT2"
          value={formData.TT2?.data || ''}
          onChange={handleInputChange}
        />
        </label>
        <label>Artist:
            <input
            type='text'
            name='TP1'
            value={formData.TP1?.data || ''}
            onChange={handleInputChange}
            />
        </label>
        <label>Album:
            <input
            type='text'
            name='TAL'
            value={formData.TAL?.data || ''}
            onChange={handleInputChange}
            />
        </label>
        <label>Genre:
            <input
            type='text'
            name='TCO'
            value={formData.TCO?.data || ''}
            onChange={handleInputChange}
            />
        </label>
        
        <label>Album Artist:
            <input
            type='text'
            name='TP2'
            value={formData.TP2?.data || ''}
            onChange={handleInputChange}
            />
        </label>

        <label>Release Date:
            <input
            type='number'
            min={1900}
            name='TYE'
            value={formData.TYE?.data || ''}
            onChange={handleInputChange}
            />
        </label>
        <label>Track:
            <input
            type='number'
            min={1}
            name='TRK'
            value={formData.TRK?.data.replace(/\/.*/, '') || ''}
            onChange={handleInputChange}
            />
        </label>
        <input
        type='button'
        value='Submit'
        />
      </form>}
    </div>
  );
};

export default SongTile;