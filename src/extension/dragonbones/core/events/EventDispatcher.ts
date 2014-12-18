module dragonBones {
    export class EventDispatcher {
        private _listenersMap:Object;

        constructor() {
        }

        public hasEventListener(type:string):boolean {
            if(this._listenersMap && this._listenersMap[type]) {
                return true;
            }
            return false;
        }

        public addEventListener(type:string, listener:Function):void {
            if (type && listener) {
                if (!this._listenersMap) {
                    this._listenersMap = {};
                }
                var listeners:Array<Function> = this._listenersMap[type];
                if (listeners) {
                    this.removeEventListener(type, listener);
                }
                if (listeners) {
                    listeners.push(listener);
                }
                else {
                    this._listenersMap[type] = [listener];
                }
            }
        }

        public removeEventListener(type:string, listener:Function):void {
            if (!this._listenersMap || !type || !listener) {
                return;
            }
            var listeners:Array<Function> = this._listenersMap[type];
            if (listeners) {
                var length:number = listeners.length;
                for (var i:number = 0; i < length; i++) {
                    if (listeners[i] == listener) {
                        if (length == 1) {
                            listeners.length = 0;
                            delete this._listenersMap[type];
                        }
                        else {
                            listeners.splice(i, 1);
                        }
                    }
                }
            }
        }

        public removeAllEventListeners(type:string):void {
            if (type) {
                delete this._listenersMap[type];
            }
            else {
                this._listenersMap = null;
            }
        }

        public dispatchEvent(event:Event):void {
            if (event) {
                var listeners:Array<Function> = this._listenersMap[event.type];
                if (listeners) {
                    event.target = this;
                    var listenersCopy:Array<Function> = listeners.concat();
                    var length:number = listeners.length;
                    for (var i:number = 0; i < length; i++) {
                        listenersCopy[i](event);
                    }
                }
            }
        }
    }
}