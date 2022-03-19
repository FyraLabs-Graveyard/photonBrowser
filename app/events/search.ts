import zod from "zod";
import { SearchEvents, SearchRendererEvents } from "./../../utils/constants";
import { app, ipcMain } from "electron";
import { EngineWindow, EngineWindowManager } from "@getskye/engine";
import { EngineOverlay } from "@getskye/engine/dist/models/overlay";
import path from "path";
import { ddg } from "@getskye/suggest";
import { BASE_SKYE_URL } from "../constants";

const generateSearch = (win: EngineWindow, onDelete: () => void) => {
  const search = win.createOverlay({
    top: true,
    ui: { url: BASE_SKYE_URL + "/dialogs/search/index.html" },
    backgroundColor: "#00000000",
    resize: {
      width: false,
      height: false,
      horizontal: false,
      vertical: false,
    },
    webPreferences: {
      preload: path.join(app.getAppPath(), "preloads", "search.js"),
    },
    bounds: {
      x: Math.floor(win.browserWindow.getBounds().width / 2 - 460 / 2),
      y: 48,
      width: 460,
      height: 520,
    },
  });
  win.browserWindow.on("resize", () => {
    if (!search) return;
    win.deleteOverlay(search);
    onDelete();
  });
  return search;
};

const loadSearchEvents = (windowManager: EngineWindowManager) => {
  let search: EngineOverlay | undefined;

  ipcMain.handle(SearchEvents.SHOW_SEARCH, (event) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win) return;

    if (search) return;
    search = generateSearch(win, () => {
      search = undefined;
    });
  });

  ipcMain.handle(SearchEvents.HIDE_SEARCH, (event) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win || !search) return;
    if (search.browserView.webContents.isFocused()) return;
    win.deleteOverlay(search);
    search = undefined;
  });

  ipcMain.handle(SearchEvents.UPDATE_SEARCH_QUERY, async (event, query) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win || !query?.length) return;
    if (!search) {
      search = generateSearch(win, () => {
        search = undefined;
      });
    }
    const suggestions = await ddg(encodeURIComponent(query));
    if (suggestions.suggestions.length > 5) suggestions.suggestions.length = 5;
    search?.browserView?.webContents?.send(
      SearchRendererEvents.SEARCH_QUERY_UPDATED,
      query,
      suggestions
    );
  });

  ipcMain.handle(SearchEvents.LOAD_URL, (event, url) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win || !win.tabManager.activeTab) return;
    if (search) {
      win.deleteOverlay(search);
      search = undefined;
    }
    if (zod.string().url().safeParse(url))
      win.tabManager.activeTab.browserView.webContents.loadURL(url);
  });

  ipcMain.handle(SearchEvents.RESIZE, (event, height) => {
    if (!search) return;

    search.bounds = {
      ...search.bounds,
      height,
    };
  });
};

export default loadSearchEvents;
