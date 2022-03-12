import { RendererEvents } from "./../../../utils/constants";
import { action, autorun, makeObservable, observable } from "mobx";
import { createContext, useContext } from "react";
import Tab from "./tab";

class NavigationStore {
  public tabs: Tab[] = [];
  public focusedTabID?: string = undefined;

  constructor() {
    makeObservable(this, {
      focusedTabID: observable,
      tabs: observable,
      focusTab: action,
      addTab: action,
      removeTab: action,
      loadTabs: action,
      setTabs: action,
    });

    (async () => {
      const tabs = await window.skye.fetchTabs();
      this.loadTabs(tabs);
    })();

    window.skye.on(
      RendererEvents.TAB_CREATED,
      ({
        id,
        title,
        color,
        active,
      }: {
        id: string;
        title?: string;
        color?: string;
        active: boolean;
      }) => {
        if (active) this.focusTab(id);

        this.addTab(
          new Tab({
            url: "https://duckduckgo.com",
            id,
            title,
            color,
          })
        );
      }
    );

    window.skye.on(
      RendererEvents.TAB_TITLE_CHANGED,
      ({ id, title }: { id: string; title: string | undefined }) => {
        this.findTab(id)?.setTitle(title);
      }
    );

    window.skye.on(
      RendererEvents.TAB_THEME_COLOR_CHANGED,
      ({ id, color }: { id: string; color: string | undefined }) => {
        this.findTab(id)?.setColor(color);
      }
    );

    window.skye.on(RendererEvents.TAB_DELETED, (id: string) => {
      this.removeTab(id);
    });

    window.skye.on(RendererEvents.TAB_FOCUSED, (id: string) => {
      this.focusTab(id);
    });

    window.skye.on(RendererEvents.TAB_LOAD_START, (id: string) => {
      this.findTab(id)?.setLoading(true);
    });

    window.skye.on(RendererEvents.TAB_LOAD_STOP, (id: string) => {
      this.findTab(id)?.setLoading(false);
    });

    window.skye.on(
      RendererEvents.TAB_NAVIGATION_STATE_CHANGED,
      (state: {
        id: string;
        canNavigateBackward: boolean;
        canNavigateForward: boolean;
      }) => {
        const tab = this.findTab(state.id);

        tab?.setCanNavigateBackward(state.canNavigateBackward);
        tab?.setCanNavigateForward(state.canNavigateForward);
      }
    );

    autorun(() => {
      this.focusedTab;
      window.skye.hideSearch();
    });
  }

  get focusedTab() {
    return this.focusedTabID ? this.findTab(this.focusedTabID) : null;
  }

  loadTabs(
    tabs: {
      id: string;
      title?: string;
      color?: string;
      active: boolean;
      url: string;
    }[]
  ) {
    this.tabs = tabs.map((tab) => {
      if (tab.active) this.focusTab(tab.id);
      return new Tab({
        ...tab,
        url: tab.url,
      });
    });
  }

  focusTab(tabID: string) {
    this.focusedTabID = tabID;
  }

  removeTab(tabID: string) {
    this.tabs = this.tabs.filter((tab) => tab.id !== tabID);
  }

  addTab(tab: Tab) {
    this.tabs.push(tab);
  }

  findTab(tabID: string) {
    return this.tabs.find((tab) => tab.id === tabID);
  }

  // TODO: This is for reorder, we probably want to send the event to the main process as well
  setTabs(tabs: Tab[]) {
    this.tabs = tabs;
  }
}

export const NavigationContext = createContext<NavigationStore>(
  new NavigationStore()
);
export const useNavigation = () => useContext(NavigationContext);

export default NavigationStore;
