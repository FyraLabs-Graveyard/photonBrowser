import { app, BrowserWindow, globalShortcut, protocol } from "electron";
import { EngineSession, EngineWindowManager } from "@fyralabs/photon-engine";
import path from "path";
import loadTabEvents from "./events/tabs";
import { RendererEvents } from "../utils/constants";
import loadSearchEvents from "./events/search";
import { BASE_SKYE_URL } from "./constants";
import * as Sentry from "@sentry/electron";

// TODO:https://github.com/karaggeorge/electron-builder-notarize/pull/15

if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: "https://ebbd115c83bb410b9b1faf3c9a7c44cb@o271654.ingest.sentry.io/6267288",
  });
}

app.once("ready", async () => {
  const rootPath = path.resolve(path.join(app.getAppPath(), "./dist"));

  if (process.env.NODE_ENV !== "development") {
    protocol.registerFileProtocol("photon", (request, callback) => {
      const pathname = new URL(request.url).pathname;

      if (pathname.indexOf("\0") !== -1) {
        return callback({
          statusCode: 404,
        });
      }

      const filename = path.join(rootPath, pathname);

      if (filename.indexOf(rootPath) !== 0) {
        return callback({
          statusCode: 404,
        });
      }

      return callback({
        path: filename,
      });
    });
  }

  const defaultSession = new EngineSession({
    id: "default",
    persist: true,
    cache: true,
    storageProvider: {
      get: async <undefined>(key: string) => {
        return undefined;
      },
      set: async <undefined>(key: string, value: any) => {},
      remove: async (key: string) => {},
    },
  });
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
      url: BASE_SKYE_URL + "/pages/navigation/index.html",
    },
    webPreferences: {
      preload: path.join(app.getAppPath(), "preloads", "navigation.js"),
    },
    waitForLoad: true,
    session: defaultSession,
  });

  win.tabManager.on("activeTabChanged", (tab) => {
    win.browserWindow.webContents.send(RendererEvents.TAB_FOCUSED, tab.id);
  });

  if (process.env.NODE_ENV === "development") {
    win.browserWindow.webContents.openDevTools({
      mode: "detach",
    });
  }

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

  window.loadURL(BASE_SKYE_URL + "/pages/search/index.html");

  window.on("blur", () => {
    window.hide();
  });
  globalShortcut.register("Command+P", () => {
    // window.show();
  });
});

app.on("window-all-closed", () => {
  // TODO: Fix reactivation of app on macOS
  // if (platform() !== "darwin") {
  app.quit();
  // }
});
