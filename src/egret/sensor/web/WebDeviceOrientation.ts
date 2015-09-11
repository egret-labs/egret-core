module egret.web {

    /**
     * @private
     */
    export class WebDeviceOrientation extends EventDispatcher {

        
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static get isSupport(): boolean {
            var hasOrientation = 'DeviceOrientationEvent' in window;
            return hasOrientation;
        }

        /**
         * @private
         */
        protected onChange = (e: DeviceOrientationEvent) => {
            var event = new OrientationEvent(Event.CHANGE);
            event.beta = e.beta;
            event.gamma = e.gamma;
            event.alpha = e.alpha;
            this.dispatchEvent(event);
        }
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
            if (type == Event.CHANGE && !this.hasEventListener(Event.CHANGE)) {
                window.addEventListener("deviceorientation", this.onChange);
            }
            super.addEventListener(type, listener, thisObject, useCapture, priority);
        }


        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void {
            super.removeEventListener(type, listener, thisObject, useCapture);
            if (type == Event.CHANGE && !this.hasEventListener(Event.CHANGE)) {
                window.removeEventListener("deviceorientation", this.onChange);
            }
        }
    }
}

egret.DeviceOrientation = egret.web.WebDeviceOrientation;