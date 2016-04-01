
/// <reference path="../lib/types.d.ts" />


import net = require("net");
import events = require("events");

class ServiceSocket extends events.EventEmitter {
    socket:net.Socket;
    larkMessageParser:LarkMessageBody = new LarkMessageBody();
    constructor(socket: net.Socket) {
        super();
        this.socket = socket;
        socket.setEncoding("utf-8");
        socket.on("data", msg=> this.onData(msg));
        socket.on("end", () => this.emit("end"));
        socket.on("close", () => this.emit("close"));
    }

    send(object:any){
        var msg = LarkMessageBody.toMessage(object);
        try {
            this.socket.write(msg);
        }
        catch (e) {
            console.error("ServiceSocket.send:", e);
        }
    }

    end(object?: any) {
        if (object) this.send(object);
        this.socket.end();
    }

    private onData(text:string){
        this.larkMessageParser.pushData(text, data=> this.onGotMessage(data));
    }

    private onGotMessage(data:any){
        this.emit("message",data);
    }
}

export = ServiceSocket;

class LarkMessageBody{
    static LARKHEADER = "LARK-MSG";
    private length:number;
    private text:string;

    public data:any;

    static toMessage(data){
        var json = JSON.stringify(data);
        var length = json.length;
        var header = LarkMessageBody.LARKHEADER + ":" + length+"\n";
        var msg = header+json;
        return msg;
    }

    pushData(text: string, msgCallback: Function) {
        if(text.indexOf(LarkMessageBody.LARKHEADER)==0)
        {
            var lines = text.split('\n');
            var header = lines[0];
            var lengthStr = /\d+/.exec(header)[0];
            this.length = parseInt(lengthStr);
            this.text = lines[1];
            this.data = null;
        }
        else
            this.text += text;

        var length = this.text.length;
        if(length==this.length){
            this.data = JSON.parse(this.text);
            msgCallback(this.data);
        }
    }
}
