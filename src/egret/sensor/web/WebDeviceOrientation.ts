module egret.web {

    /**
     * @private
     */
    export class WebDeviceOrientation extends EventDispatcher implements DeviceOrientation {

        /**
         * @private
         * 
         */
        start() {
            window.addEventListener("deviceorientation", this.onChange);
        }

        /**
         * @private
         * 
         */
        stop() {
            window.removeEventListener("deviceorientation", this.onChange);
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
    }
}

egret.DeviceOrientation = egret.web.WebDeviceOrientation;