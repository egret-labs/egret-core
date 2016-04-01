export interface Element {
    type: string;
    name: string;
    attribs: any;
    raw: string;
    text: string;
    data: string;
    children: Element[];
}

export declare class DefaultHandler {
    constructor(callback: (err, dom) => void);
    dom: Element[];
}

export declare class Parser {
    constructor(handler: DefaultHandler);
    parseComplete(html: string);
}