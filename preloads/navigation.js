const { contextBridge, ipcRenderer } = require("electron");

const tabWhitelist = [
  "TAB_LOAD_START",
  "TAB_LOAD_STOP",
  "TAB_CREATED",
  "TAB_DELETED",
  "TAB_FOCUSED",
  "FINISH_LOAD",
  "TAB_TITLE_CHANGED",
  "TAB_THEME_COLOR_CHANGED",
  "TAB_NAVIGATION_STATE_CHANGED",
];

(async () => {
  contextBridge.exposeInMainWorld("photon", {
    loadURL: (url) => ipcRenderer.invoke("LOAD_URL", url),
    fetchTabs: () => ipcRenderer.invoke("FETCH_TABS"),
    showSearch: () => ipcRenderer.invoke("SHOW_SEARCH"),
    hideSearch: () => ipcRenderer.invoke("HIDE_SEARCH"),
    updateSearchQuery: (query) =>
      ipcRenderer.invoke("UPDATE_SEARCH_QUERY", query),
    createTab: () => ipcRenderer.invoke("CREATE_TAB"),
    deleteTab: (tabID) => ipcRenderer.invoke("DELETE_TAB", tabID),
    focusTab: (tabID) => ipcRenderer.invoke("FOCUS_TAB", tabID),
    reloadTab: (tabID) => ipcRenderer.invoke("RELOAD_TAB", tabID),
    navigateForward: (tabID) =>
      ipcRenderer.invoke("NAVIGATE_TAB_FORWARD", tabID),
    navigateBackward: (tabID) =>
      ipcRenderer.invoke("NAVIGATE_TAB_BACKWARD", tabID),
    cancelTabNavigation: (tabID) =>
      ipcRenderer.invoke("CANCEL_TAB_NAVIGATION", tabID),
    on: async (channel, callback) => {
      if (tabWhitelist.includes(channel))
        ipcRenderer.on(channel, (_, ...args) => callback(...args));
    },
  });
})();
