export module egretbridge {
    export function $error(code:number,arg1?:any,arg2?:any,arg3?:any,arg4?:any){
        console.error.apply(null,arguments);
    }
    export function $warn(code:number,text?:string,arg1?:any,arg2?:any,arg3?:any,arg4?:any){
        console.warn.apply(null,arguments);
    }
    export interface XMLNode {
        nodeType:number;
        parent: XML;
    }
    export interface XML extends XMLNode {
        attributes:any;
        children:XMLNode[];
        name:string;
        prefix: string;
        localName:string;
        namespace: string;
    }
    export interface XMLText extends XMLNode {
        text:string;
    }
    export var XML:{
        parse(text:string):XML;
    };
}