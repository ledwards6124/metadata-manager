"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the necessary Electron components.
const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;
const ipc = {
    render: {
        send: [],
        receive: [],
        sendReceive: []
    }
};
// Exposed protected methods in the render process.
contextBridge.exposeInMainWorld('ipcRender', {
    send: (channel, args) => {
        const validChannels = ipc.render.send;
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, args);
        }
    },
    receive: (channel, listener) => {
        const validChannels = ipc.render.receive;
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => listener(args));
        }
    },
    invoke: (channel, args) => {
        const validChannels = ipc.render.sendReceive;
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, args);
        }
        else {
            throw new Error(`Invalid channel: ${channel}`);
        }
    }
});
