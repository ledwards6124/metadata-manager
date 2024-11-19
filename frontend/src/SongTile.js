import React, { useState, useEffect, useCallback } from 'react';
import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';

const SongTile = ({ path }) => {
  const [formData, setFormData] = useState({});
  const [artwork, setArtwork] = useState('');
  const [open, setOpen] = useState(false);

  const pythonHash = async (file) => {
    // buffer the file
      const buffer = await file.arrayBuffer();

      // create sha-256 hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

      // convert hash buffer to byte array
      const hashArr = Array.from(new Uint8Array(hashBuffer));

      //convert byte array to hex
      const hashHex = hashArr.map(byte => byte.toString(16).padStart(2, '0')).join('');

      //parse string to int
      return parseInt(hashHex);
  }
  

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

  const updateFile = async () => {
    const file = await path.getFile();
    const key = file.name;
    const metadata = {
      TT2: formData.TT2?.data || 'null',
      TP1: formData.TP1?.data || 'null',
      TAL: formData.TAL?.data || 'null',
      TCO: formData.TCO?.data || 'null',
      TP2: formData.TP2?.data || 'null',
      TYE: formData.TYE?.data || 'null',
      TRK: formData.TRK?.data.replace(/\/.*/, '') || 'null',
      TID: formData.TID?.data || 'null',
      key: key
    };

    try {
      fetch('http://localhost:5000/files', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata)
    }).then(response => {
      if (response.status === 200) {
        return response.json();
      }
    }).then(jData => {
      if (jData) {
        console.log(jData);
      }
    })
    } catch (error) {
      console.error(error);
    }
  }

  const downloadFile = async () => {
    const key = path.name;
    fetch(`http://localhost:5000/files?key=${key}`, {
      method: 'GET'
    }).then(response => {
      if (response.status === 200) {
        return response.blob();
      }
    }).then(buffer => {
      const blob = new Blob([buffer], { type: 'audio/*' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `modified_${key}`
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    })

  }

  const uploadFile = async () => {


      const file = await path.getFile();
  
      const metadata = {
        TT2: formData.TT2?.data || 'null',
        TP1: formData.TP1?.data || 'null',
        TAL: formData.TAL?.data || 'null',
        TCO: formData.TCO?.data || 'null',
        TP2: formData.TP2?.data || 'null',
        TYE: formData.TYE?.data || 'null',
        TRK: formData.TRK?.data.replace(/\/.*/, '') || 'null',
        TID: formData.TID?.data || 'null',
      };
  
      const form = new FormData();
      form.append('file', file);
      form.append('metadata', JSON.stringify(metadata));

      try {
        fetch ('http://127.0.0.1:5000/files', {
          method: 'POST',
          body: form
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
        }).then(jData => {
          console.log(jData);
        })

      } catch (error) {
        console.error(error);
      }
      
  }
  

  const setModal = () => {
    uploadFile();
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
        <div>
            <input
            type='button'
            value='Submit'
            onClick={updateFile}
            />
            <input
            type='button'
            value='Download'
            onClick={downloadFile}
            />
        </div>
      </form>}
    </div>
  );
};

export default SongTile;