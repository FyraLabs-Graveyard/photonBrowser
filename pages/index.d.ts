import { SearchRendererEvents } from "../utils/constants";
import { RendererEvents } from "../utils/constants";

export {};
declare global {
  interface Window {
    skye: {
      fetchTabs: () => Promise<
        [
          {
            id: string;
            title?: string;
            color?: string;
            active: boolean;
            url: string;
          }
        ]
      >;
      updateSearchQuery: (query: string) => void;
      showSearch: () => void;
      hideSearch: () => void;
      createTab: () => void;
      deleteTab: (tabID: string) => void;
      focusTab: (tabID: string) => void;
      reloadTab: (tabID: string) => void;
      navigateBackward: (tabID: string) => void;
      navigateForward: (tabID: string) => void;
      cancelTabNavigation: (tabID: string) => void;
      loadURL: (url: string) => void;
      on: (
        event: RendererEvents | SearchRendererEvents,
        callback: (...args: any[]) => void
      ) => void;
    };
  }
}
