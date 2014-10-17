module egret {
    export class TextEvent extends Event {

        public constructor(type: string, bubbles: boolean = true, cancelable: boolean = true) {
            super(type, bubbles, cancelable);
        }

        public static TEXT_INPUT: string = "textInput";

        public text: string;

        public clone(): TextEvent {
            var newEvent = new TextEvent(this._type, this._bubbles, this.cancelable);
            newEvent.text = this.text;
            return newEvent;
        }
    }
} 