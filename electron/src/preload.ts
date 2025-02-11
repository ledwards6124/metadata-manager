import { IpcRenderer } from "electron";

// Import the necessary Electron components.
const contextBridge = require('electron').contextBridge;
const ipcRenderer: IpcRenderer = require('electron').ipcRenderer;

// White-listed channels.
interface IpcChannels {
  render: {
    send: string[];
    receive: string[];
    sendReceive: string[];
  };
}

const ipc: IpcChannels = {
  render: {
    send: [],
    receive: [],
    sendReceive: []
  }
};

// Exposed protected methods in the render process.
contextBridge.exposeInMainWorld(
  'ipcRender', {
    send: (channel: string, args: any[]) => {
      const validChannels = ipc.render.send;
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, args);
      }
    },
    receive: (channel: string, listener: (args: any[]) => void) => {
      const validChannels = ipc.render.receive;
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => listener(args));
      }
    },
    invoke: (channel: string, args: any[]): Promise<any> => {
      const validChannels = ipc.render.sendReceive;
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, args);
      } else {
        throw new Error(`Invalid channel: ${channel}`);
      }
    }
  }
);