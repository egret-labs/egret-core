module egret {

    export class FrameLabel extends EventDispatcher
    {
        private _name: string;
        private _frame: number /*int*/;

        constructor (name: string, frame: number /*int*/)
        {
            super();
            this._name = name;
            this._frame = frame | 0;
        }

        public get name(): string {
            return this._name;
        }
        public get frame(): number /*int*/ {
            return this._frame;
        }

        public clone() {
            return new FrameLabel(this._name, this._frame);
        }
    }

}


