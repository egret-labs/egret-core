

module egret.web {

    /**
     * @private
     */
    export class WebMotion extends EventDispatcher {


        /**
         * @inheritDoc
         * @version Egret 2.0
         * @platform Web,Native
         */
        public static get isSupport(): boolean {
            var geolocation = 'DeviceMotionEvent' in window;
            return geolocation;
        }

        /**
         * @private
         */
        protected onChange = (e: DeviceMotionEvent) => {
            var event = new MotionEvent(Event.CHANGE);
            var acceleration: egret.DeviceAcceleration = {
                x: e.acceleration.x,
                y: e.acceleration.y,
                z: e.acceleration.z
            };
            var accelerationIncludingGravity: egret.DeviceAcceleration = {
                x: e.accelerationIncludingGravity.x,
                y: e.accelerationIncludingGravity.y,
                z: e.accelerationIncludingGravity.z
            };
            var rotation: egret.DeviceRotationRate = {
                alpha: e.rotationRate.alpha,
                beta: e.rotationRate.beta,
                gamma: e.rotationRate.gamma
            };
            event.acceleration = acceleration;
            event.accelerationIncludingGravity = accelerationIncludingGravity;
            event.rotationRate = rotation;
            this.dispatchEvent(event);
        }


        /**
         * @inheritDoc
         * @version Egret 2.0
         * @platform Web,Native
         */
        public addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
            if (type == Event.CHANGE && !this.hasEventListener(Event.CHANGE)) {
                window.addEventListener("devicemotion", this.onChange);
            }
            super.addEventListener(type, listener, thisObject, useCapture, priority);
        }


        /**
         * @inheritDoc
         * @version Egret 2.0
         * @platform Web,Native
         */
        public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void {
            super.removeEventListener(type, listener, thisObject, useCapture);
            if (type == Event.CHANGE && !this.hasEventListener(Event.CHANGE)) {
                window.removeEventListener("devicemotion", this.onChange);
            }
        }
    }
    egret.Motion = egret.web.WebMotion;
}
