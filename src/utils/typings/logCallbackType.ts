import type { LogTypes } from "./logTypes";

export type LogCallbackType = {
    listenType: LogTypes | "*";
    callback: Function;
};
