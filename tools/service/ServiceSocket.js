/// <reference path="../lib/types.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events = require("events");
var ServiceSocket = (function (_super) {
    __extends(ServiceSocket, _super);
    function ServiceSocket(socket) {
        var _this = this;
        _super.call(this);
        this.larkMessageParser = new LarkMessageBody();
        this.socket = socket;
        socket.setEncoding("utf-8");
        socket.on("data", function (msg) { return _this.onData(msg); });
        socket.on("end", function () { return _this.emit("end"); });
        socket.on("close", function () { return _this.emit("close"); });
    }
    ServiceSocket.prototype.send = function (object) {
        var msg = LarkMessageBody.toMessage(object);
        try {
            this.socket.write(msg);
        }
        catch (e) {
            console.error("ServiceSocket.send:", e);
        }
    };
    ServiceSocket.prototype.end = function (object) {
        if (object)
            this.send(object);
        this.socket.end();
    };
    ServiceSocket.prototype.onData = function (text) {
        var _this = this;
        this.larkMessageParser.pushData(text, function (data) { return _this.onGotMessage(data); });
    };
    ServiceSocket.prototype.onGotMessage = function (data) {
        this.emit("message", data);
    };
    return ServiceSocket;
})(events.EventEmitter);
var LarkMessageBody = (function () {
    function LarkMessageBody() {
    }
    LarkMessageBody.toMessage = function (data) {
        var json = JSON.stringify(data);
        var length = json.length;
        var header = LarkMessageBody.LARKHEADER + ":" + length + "\n";
        var msg = header + json;
        return msg;
    };
    LarkMessageBody.prototype.pushData = function (text, msgCallback) {
        if (text.indexOf(LarkMessageBody.LARKHEADER) == 0) {
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
        if (length == this.length) {
            this.data = JSON.parse(this.text);
            msgCallback(this.data);
        }
    };
    LarkMessageBody.LARKHEADER = "LARK-MSG";
    return LarkMessageBody;
})();
module.exports = ServiceSocket;

//# sourceMappingURL=../service/ServiceSocket.js.map