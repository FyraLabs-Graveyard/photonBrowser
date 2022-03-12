import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import { platform } from "os";
import { EngineWindowManager } from "@getskye/engine";
import path from "path";
import loadTabEvents from "./events/tabs";
import { RendererEvents } from "../utils/constants";
import loadSearchEvents from "./events/search";

app.once("ready", async () => {
  const windowManager = new EngineWindowManager();
  const win = windowManager.createWindow({
    offset: {
      top: 48,
      bottom: 0,
      left: 0,
      right: 0,
    },
    trafficLightPosition: {
      x: 15,
      y: 16,
    },
    minWidth: 900,
    minHeight: 250,
    width: 950,
    height: 700,
    titleBarStyle: "hiddenInset",
    ui: {
      url: "http://localhost:3000/pages/navigation/index.html",
    },
    webPreferences: {
      preload: path.join(__dirname, "..", "preloads", "navigation.js"),
    },
    waitForLoad: true,
  });

  win.tabManager.on("activeTabChanged", (tab) => {
    win.browserWindow.webContents.send(RendererEvents.TAB_FOCUSED, tab.id);
  });

  win.browserWindow.webContents.openDevTools({
    mode: "detach",
  });

  const tabEvents = loadTabEvents(windowManager);
  loadSearchEvents(windowManager);

  tabEvents(win);

  const window = new BrowserWindow({
    show: false,
    minHeight: 50,
    minWidth: 600,
    width: 600,
    maxWidth: 600,
    height: 50,
    vibrancy: "light",

    resizable: false,
    maximizable: true,
    minimizable: false,
    skipTaskbar: true,
    frame: false,
  });
  window.setVisibleOnAllWorkspaces(true);
  window.setAlwaysOnTop(true, "floating", 1);
  window.setFullScreenable(false);

  window.loadURL("http://localhost:3000/pages/search/index.html");

  window.on("blur", () => {
    window.hide();
  });
  globalShortcut.register("Command+P", () => {
    window.show();
  });
});

app.on("window-all-closed", () => {
  if (platform() !== "darwin") {
    app.quit();
  }
});
