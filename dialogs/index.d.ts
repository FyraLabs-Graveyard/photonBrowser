import { SearchRendererEvents } from "../utils/constants";
import { RendererEvents } from "../utils/constants";

export {};
declare global {
  interface Window {
    skye: {
      loadURL: (url: string) => void;
      resize: (height: number) => void;
      on: (
        event: RendererEvents | SearchRendererEvents,
        callback: (...args: any[]) => void
      ) => void;
    };
  }
}
