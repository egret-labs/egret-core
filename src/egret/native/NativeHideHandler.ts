module egret.native {
    export class NativeHideHandler extends HashObject {
        constructor(stage:Stage) {
            super();

            egret_native.pauseApp = function () {
                //console.log("pauseApp");
                stage.dispatchEvent(new Event(Event.DEACTIVATE));
                egret_native.Audio.pauseBackgroundMusic();
                egret_native.Audio.pauseAllEffects();
            };

            egret_native.resumeApp = function () {
                //console.log("resumeApp");
                stage.dispatchEvent(new Event(Event.ACTIVATE));
                egret_native.Audio.resumeBackgroundMusic();
                egret_native.Audio.resumeAllEffects();
            };
        }
    }
}