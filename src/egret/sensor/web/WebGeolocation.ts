
interface BrowerGeolocation extends Geolocation { }

module egret.web {
    /**
     * @private
     */
    export class WebGeolocation extends EventDispatcher implements Geolocation {
        /**
         * @private
         */
        private geolocation: BrowerGeolocation;
        /**
         * @private
         */
        private watchId: number;
        /**
         * @private
         */
        constructor(option?: PositionOptions) {
            super();
            this.geolocation = navigator.geolocation;
        }

        /**
         * @private
         * 
         */
        public start() {
            var geo = this.geolocation;
            if (geo)
                this.watchId = geo.watchPosition(this.onUpdate, this.onError);
            else
                this.onError({
                    code: 2,
                    message: egret.sys.tr(3004),
                    PERMISSION_DENIED: 1,
                    POSITION_UNAVAILABLE:2
                });
        }

        /**
         * @private
         * 
         */
        public stop() {
            var geo = this.geolocation;
            geo.clearWatch(this.watchId);
        }

        /**
         * @private
         */
        private onUpdate = (position: Position) => {
            var event = new GeolocationEvent(Event.CHANGE);
            var coords = position.coords;
            event.altitude = coords.altitude;
            event.heading = coords.heading;
            event.accuracy  = coords.accuracy;
            event.latitude = coords.latitude;
            event.longitude = coords.longitude;
            event.speed = coords.speed;
            event.altitudeAccuracy = coords.altitudeAccuracy;
            this.dispatchEvent(event);
        };

        /**
         * @private
         */
        private onError = (error: { code: number; message: string; PERMISSION_DENIED:number; POSITION_UNAVAILABLE:number} ) => {

            var errorType = GeolocationEvent.UNAVAILABLE;
            if (error.code == error.PERMISSION_DENIED)
                errorType = GeolocationEvent.PERMISSION_DENIED;

            var event = new GeolocationEvent(IOErrorEvent.IO_ERROR);
            event.errorType = errorType;
            event.errorMessage = error.message;
            this.dispatchEvent(event);
        };
    }
    egret.Geolocation = egret.web.WebGeolocation;
}
