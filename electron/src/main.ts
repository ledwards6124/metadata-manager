import {app, BrowserWindow } from 'electron';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, //for node-id3
            contextIsolation: false,
            preload: path.join(__dirname, '/dist/preload.js')
        },
    });

    const url: string = process.env.REACT_URL as string;

    window.loadURL(url);
}

app.whenReady().then(createWindow);