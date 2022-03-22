import { action, autorun, makeObservable, observable } from "mobx";
import normalizeUrl from "normalize-url";
import { isURL } from "../../../utils/url";

class Tab {
  id: string = "";
  title?: string = undefined;
  color?: string = undefined;
  favicon?: string = undefined;
  url: URL = new URL("about:empty");

  muted?: boolean = false;
  playing?: boolean = false;
  pinned?: boolean = false;
  loading?: boolean = true;

  canNavigateBackward: boolean = false;
  canNavigateForward: boolean = false;

  input?: string = undefined;

  constructor(options: {
    id: string;
    title?: string;
    color?: string;
    url: string;
    loading?: boolean;
  }) {
    makeObservable(this, {
      id: observable,
      url: observable,
      pinned: observable,
      title: observable,
      color: observable,
      loading: observable,
      favicon: observable,
      input: observable,
      canNavigateBackward: observable,
      canNavigateForward: observable,
      setTitle: action,
      setColor: action,
      setInput: action,
      setFavicon: action,
      setLoading: action,
      setCanNavigateBackward: action,
      setCanNavigateForward: action,
      load: action,
      setURL: action,
    });

    this.id = options.id;
    this.title = options.title;
    this.color = options.color;
    this.loading = options.loading;
    this.url = new URL(options.url);
  }

  updateSearchQuery = (query: string) => {
    if (!query?.length) return window.skye.hideSearch();
    window.skye.updateSearchQuery(query);
  };

  load(input: string) {
    this.loading = true;
    if (isURL(input)) {
      const url = normalizeUrl(input);
      this.url = new URL(url);
      this.input = normalizeUrl(input, {
        stripProtocol: true,
        stripHash: true,
        stripWWW: true,
        stripTextFragment: true,
        removeQueryParameters: true,
      });
      window.skye.loadURL(url);
    } else {
      const url = normalizeUrl(
        `https://duckduckgo.com/?q=${encodeURIComponent(input)}`
      );
      this.url = new URL(url);
      this.input = input;
      window.skye.loadURL(url);
    }
    window.skye.hideSearch();
  }

  setInput(input: string) {
    this.input = input;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setTitle(title?: string) {
    this.title = title;
  }

  setColor(color?: string) {
    this.color = color;
  }

  setFavicon(favicon: string) {
    this.favicon = favicon;
  }

  setCanNavigateBackward(value: boolean) {
    this.canNavigateBackward = value;
  }

  setCanNavigateForward(value: boolean) {
    this.canNavigateForward = value;
  }

  setURL(url: string) {
    this.url = new URL(url);
    this.input = normalizeUrl(url.toString(), {
      stripProtocol: true,
      stripHash: true,
      stripWWW: true,
      stripTextFragment: true,
      removeQueryParameters: true,
    });
  }

  close = () => {
    window.skye.deleteTab(this.id);
  };

  focus = () => {
    window.skye.focusTab(this.id);
  };

  reload() {
    window.skye.reloadTab(this.id);
  }

  cancel() {
    window.skye.cancelTabNavigation(this.id);
  }

  navigateForward() {
    window.skye.navigateForward(this.id);
  }

  navigateBackward() {
    window.skye.navigateBackward(this.id);
  }
}

export default Tab;
