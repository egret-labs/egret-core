

module egret.web {

    /**
     * @private
     */
    export class WebMotion extends EventDispatcher implements Motion {

        /**
         * @private
         * 
         */
        start() {
            window.addEventListener("devicemotion", this.onChange);
        }

        /**
         * @private
         * 
         */
        stop() {
            window.removeEventListener("devicemotion", this.onChange);
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
    }
    egret.Motion = egret.web.WebMotion;
}
