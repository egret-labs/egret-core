import events = require('events');

export declare function createMonitor(root: string, options: WatchOption, cb: (monitor: Monitor) => void): void;
export interface WatchOption {
    filter?: (file: string, stat: any) => boolean;
    ignoreDirectoryPattern?: RegExp;
    ignoreDotFiles?: boolean;
    ignoreUnreadableDir?: boolean;
    [other:string]:any;
}

export interface Monitor extends events.EventEmitter {
}