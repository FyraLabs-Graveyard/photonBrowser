const { contextBridge, ipcRenderer } = require("electron");

const tabWhitelist = ["SEARCH_QUERY_UPDATED"];

(async () => {
  contextBridge.exposeInMainWorld("photon", {
    loadURL: (url) => ipcRenderer.invoke("LOAD_URL", url),
    resize: (height) => ipcRenderer.invoke("RESIZE", height),
    on: async (channel, callback) => {
      if (tabWhitelist.includes(channel))
        ipcRenderer.on(channel, (_, ...args) => callback(...args));
    },
  });
})();
