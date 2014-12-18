module dragonBones {
    export class Event {
        public type:string;
        public target:EventDispatcher;

        constructor(type:string) {
            this.type = type;
        }
    }
}