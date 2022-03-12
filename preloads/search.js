const { contextBridge, ipcRenderer } = require("electron");

const tabWhitelist = ["SEARCH_QUERY_UPDATED"];

(async () => {
  contextBridge.exposeInMainWorld("skye", {
    loadURL: (url) => ipcRenderer.invoke("LOAD_URL", url),
    on: async (channel, callback) => {
      if (tabWhitelist.includes(channel))
        ipcRenderer.on(channel, (_, ...args) => callback(...args));
    },
  });
})();
