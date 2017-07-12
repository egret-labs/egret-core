import net = require("net");
import events = require("events");

class ServiceSocket extends events.EventEmitter {
    socket: net.Socket;
    constructor(socket: net.Socket) {
        super();
        this.socket = socket;
        socket.setEncoding("utf-8");
        socket.on("data", msg => this.onData(msg.toString()));
        socket.on("end", () => this.emit("end"));
        socket.on("close", () => this.emit("close"));
    }

    send(object: any) {
        var msg = MessageBody.stringify(object);
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

    private onData(text: string) {
        let data = MessageBody.parse(text);
        this.onGotMessage(data)
    }

    private onGotMessage(data: any) {
        this.emit("message", data);
    }
}

export = ServiceSocket;


namespace MessageBody {

    const HEADER = "LARK-MSG";

    export function stringify(data) {
        var json = JSON.stringify(data);
        var length = json.length;
        var header = HEADER + ":" + length + "\n";
        var msg = header + json;
        return msg;
    }

    export function parse(text: string) {
        let data = null;
        if (text.indexOf(HEADER) == 0) {
            var lines = text.split('\n');
            var header = lines[0];
            var lengthStr = /\d+/.exec(header)[0];
            let telength = parseInt(lengthStr);
            text = lines[1];
            var length = text.length;
            if (length == telength) {
                data = JSON.parse(text);
            }
        }
        return data;
    }
}
