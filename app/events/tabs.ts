import { RendererEvents } from "./../../utils/constants";
import { EngineWindow, EngineWindowManager } from "@getskye/engine";
import { ipcMain, nativeTheme } from "electron";
import { TabEvents } from "../../utils/constants";

const resetBounds = (win: EngineWindow) => {
  if (win.tabManager.tabs.length === 1) {
    win.offset = {
      top: 48,
      bottom: 0,
      left: 0,
      right: 0,
    };
  } else {
    win.offset = {
      top: 88,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }
};

const loadTabEvents = (windowManager: EngineWindowManager) => {
  const handlers: Record<
    string,
    Record<
      | "titleChanged"
      | "themeColorChange"
      | "finishLoad"
      | "loadStart"
      | "loadStop"
      | "navigationStateChanged",
      Function
    >
  > = {};

  const createTab =
    (win: EngineWindow) =>
    (url: string, active: boolean = true) => {
      const { tab } = win.tabManager.createTab({
        backgroundColor: nativeTheme.shouldUseDarkColors
          ? "#000000"
          : "#ffffff",
        webpage: {
          url,
        },
        active,
      });

      tab.browserView.webContents.setWindowOpenHandler((details) => {
        // TODO: Add to browser engine, when Lea is not high
        switch (details.disposition) {
          case "new-window": {
            // TODO: You know what? Fuck creating new windows.
          }
          case "background-tab": {
            const tab = createTab(win)(details.url, false);
            win.browserWindow.webContents.send(RendererEvents.TAB_CREATED, {
              id: tab.id,
              title: tab.title,
              color: tab.color,
              active: win.tabManager.activeTab === tab,
            });
            return {
              action: "deny",
            };
          }
          case "foreground-tab": {
            const tab = createTab(win)(details.url);
            win.browserWindow.webContents.send(RendererEvents.TAB_CREATED, {
              id: tab.id,
              title: tab.title,
              color: tab.color,
              active: win.tabManager.activeTab === tab,
            });
            return {
              action: "deny",
            };
          }
        }

        return {
          action: "allow",
        };
      });

      const loadStartHandler = () => {
        win.browserWindow.webContents.send(
          RendererEvents.TAB_LOAD_START,
          tab.id
        );
      };

      const loadStopHandler = () => {
        win.browserWindow.webContents.send(
          RendererEvents.TAB_LOAD_STOP,
          tab.id
        );
      };

      const titleChangeHandler = (title: string | undefined) => {
        win.browserWindow.webContents.send(RendererEvents.TAB_TITLE_CHANGED, {
          id: tab.id,
          title: title,
        });
      };

      const themeColorChangeHandler = (color: string | undefined) => {
        win.browserWindow.webContents.send(
          RendererEvents.TAB_THEME_COLOR_CHANGED,
          {
            id: tab.id,
            color: color,
          }
        );
      };

      const finishLoadHandler = () => {
        win.browserWindow.webContents.send(RendererEvents.FINISH_LOAD, tab.id);
      };

      const navigationStateChangedHandler = (state: {
        canNavigateBackward: boolean;
        canNavigateForward: boolean;
      }) => {
        win.browserWindow.webContents.send(
          RendererEvents.TAB_NAVIGATION_STATE_CHANGED,
          {
            id: tab.id,
            ...state,
          }
        );
      };

      tab.addListener("loadStart", loadStartHandler);
      tab.addListener("loadStop", loadStopHandler);
      tab.addListener("titleChanged", titleChangeHandler);
      tab.addListener("themeColorChange", themeColorChangeHandler);
      tab.addListener("finishLoad", finishLoadHandler);
      tab.addListener("navigationStateChanged", navigationStateChangedHandler);

      handlers[tab.id] = {
        loadStart: loadStartHandler,
        loadStop: loadStopHandler,
        titleChanged: titleChangeHandler,
        themeColorChange: themeColorChangeHandler,
        finishLoad: finishLoadHandler,
        navigationStateChanged: navigationStateChangedHandler,
      };

      return tab;
    };

  ipcMain.handle(TabEvents.NAVIGATE_TAB_FORWARD, (event, tabID: string) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win) return;

    const tab = win.tabManager.getTab(tabID);
    if (!tab) return;

    tab.navigateForward();
  });

  ipcMain.handle(TabEvents.NAVIGATE_TAB_BACKWARD, (event, tabID: string) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win) return;

    const tab = win.tabManager.getTab(tabID);
    if (!tab) return;

    tab.navigateBackward();
  });

  ipcMain.handle(TabEvents.CANCEL_TAB_NAVIGATION, (event, tabID: string) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win) return;

    const tab = win.tabManager.getTab(tabID);
    if (!tab) return;

    tab.cancelNavigation();
  });

  ipcMain.handle(TabEvents.RELOAD_TAB, (event, tabID: string) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win) return;

    const tab = win.tabManager.getTab(tabID);
    if (!tab) return;

    tab.reload();
  });

  ipcMain.handle(TabEvents.CREATE_TAB, (event) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win) return;

    const tab = createTab(win)("https://duckduckgo.com");

    event.sender.send(RendererEvents.TAB_CREATED, {
      id: tab.id,
      title: tab.title,
      color: tab.color,
      active: win.tabManager.activeTab === tab,
    });
  });

  ipcMain.handle(TabEvents.DELETE_TAB, (event, tabID: string) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win) return;

    const tab = win.tabManager.getTab(tabID);
    if (!tab) return;

    Object.entries(handlers[tabID] ?? {}).forEach(([event, handler]) =>
      tab.off(event as any, handler)
    );

    delete handlers[tabID];

    win.tabManager.deleteTab(tabID);

    event.sender.send(RendererEvents.TAB_DELETED, tabID);
  });

  ipcMain.handle(TabEvents.FOCUS_TAB, (event, tabID: string) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win) return;

    win.tabManager.setActiveTab(tabID);

    event.sender.send(RendererEvents.TAB_FOCUSED, tabID);
  });

  ipcMain.handle(TabEvents.FETCH_TABS, (event) => {
    const win = windowManager.fromWebContents(event.sender);
    if (!win) return;
    const activeTab = win.tabManager.activeTab;

    return win.tabManager.tabs.map((tab) => ({
      id: tab.id,
      title: tab.title,
      color: tab.color,
      url: tab.url,
      active: tab === activeTab,
      loading: tab.loading,
    }));
  });

  return (win: EngineWindow) => {
    win.tabManager.addListener("tabAdded", () => {
      resetBounds(win);
    });

    win.tabManager.addListener("tabRemoved", () => {
      resetBounds(win);
    });

    createTab(win)("https://duckduckgo.com");
  };
};

export default loadTabEvents;
