const fs = require('fs');
const id3 = require('node-id3');

const path = '..\\data\\flowers.mp3'


export function readMP3(path) {
    const tags = id3.read(path);
    return tags;
}

readMP3(path);