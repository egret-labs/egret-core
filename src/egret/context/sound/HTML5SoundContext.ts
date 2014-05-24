/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="SoundContext.ts"/>
/// <reference path="../../utils/TextureCache.ts"/>

module ns_egret{
	/**
	 * @class ns_egret.HTML5SoundContext
	 * @classdesc
	 * @extends ns_egret.SoundContext
	 */
    export class HTML5SoundContext extends SoundContext{
        private _soundList = {};
        private _capabilities;
        private _soundSupported:boolean;
        private _canPlay:boolean = true;
        private _supportedFormat = [];
        private _playingMusicName:string;

        constructor() {
            super();
            this._capabilities = {"mp3": false, "ogg": false, "wav": false, "mp4": false, "m4a": false};
            var locCapabilities = this._capabilities;
            this._checkCanPlay(locCapabilities);

            for (var key in locCapabilities) {
                if (locCapabilities[key]) {
                    this._soundSupported = true;
                    break;
                }
            }

            var ua = navigator.userAgent;
            if (/Mobile/.test(ua) && (/iPhone OS/.test(ua) || /iPad/.test(ua) || /Firefox/.test(ua)) || /MSIE/.test(ua)) {
                this._canPlay = false;
            }
            this._getSupportedAudioFormat();
        }

        private _checkCanPlay(capabilities) {
            var au = document.createElement('audio');
            if (au.canPlayType) {
                var _check = function (typeStr) {
                    var result = au.canPlayType(typeStr);
                    return result != "no" && result != "";
                };

                capabilities["mp3"] = _check("audio/mpeg");
                capabilities["mp4"] = _check("audio/mp4");
                capabilities["m4a"] = _check("audio/x-m4a") || _check("audio/aac");
                capabilities["ogg"] = _check('audio/ogg; codecs="vorbis"');
                capabilities["wav"] = _check('audio/wav; codecs="1"');
            }
        }

		/**
		 * @method ns_egret.HTML5SoundContext#preloadSound
		 * @param pat {any} 
		 */
        public preloadSound(path) {
            if (this._soundSupported) {
                var extName = this._getExtFromFullPath(path);
                if (this.isFormatSupported(extName) && !this._soundList.hasOwnProperty(path)) {
                    if (this._canPlay) {
                        var audio = new Audio(TextureCache.getInstance().prefix + path);
                        audio.preload = 'auto';
                        var soundPreloadCanplayHandler = function (e) {
                            this.removeEventListener('canplaythrough', soundPreloadCanplayHandler, false);
                            this.removeEventListener('error', soundPreloadErrorHandler, false);
                        };
                        var soundPreloadErrorHandler = function (e) {
                            this.removeEventListener('canplaythrough', soundPreloadCanplayHandler, false);
                            this.removeEventListener('error', soundPreloadErrorHandler, false);
                        };
                        audio.addEventListener('canplaythrough', soundPreloadCanplayHandler, false);
                        audio.addEventListener("error", soundPreloadErrorHandler, false);

                        this._soundList[path] = audio;
                        audio.load();
                        return;
                    }
                }
            }
        }

        private _getSupportedAudioFormat() {
            // check for sound support by the browser
            if (!this._soundSupported) {
                return;
            }

            var formats = ["ogg", "mp3", "wav", "mp4", "m4a"];
            for (var idx in formats) {
                var name = formats[idx];
                if (this._capabilities[name]) {
                    this._supportedFormat.push(name);
                }
            }
        }

        private isFormatSupported(ext) {
            var locSupportedFormat = this._supportedFormat;
            for (var idx in locSupportedFormat) {
                if (ext === locSupportedFormat[idx])
                    return true;
            }
            return false;
        }

        private _getExtFromFullPath(fullpath):string {
            var startPos = fullpath.lastIndexOf(".");
            if (startPos !== -1) {
                return fullpath.substring(startPos + 1, fullpath.length);
            }
            return "";
        }

		/**
		 * @method ns_egret.HTML5SoundContext#playMusic
		 * @param path {any} 
		 * @param loop {any} 
		 */
        public playMusic(path, loop = true) {
            if (!this._soundSupported)
                return;
            var audio;
            var locSoundList = this._soundList;
            if (locSoundList.hasOwnProperty(this._playingMusicName)) {
                locSoundList[this._playingMusicName].pause();
            }
            this._playingMusicName = path;
            if (locSoundList.hasOwnProperty(this._playingMusicName)) {
                audio = locSoundList[this._playingMusicName];
            } else {
                audio = new Audio(TextureCache.getInstance().prefix + path);
                audio.preload = 'auto';
                locSoundList[path] = audio;
                audio.load();
            }
            audio.addEventListener("pause", function (){
                SoundContext.isMusicPlaying = false;
                this.removeEventListener('pause', arguments.callee, false);
                if(this)
                {

                }
            } , false);
            if(!isNaN(audio.duration))
            {
                audio.currentTime = 0;
            }
            audio.loop = loop;
            audio.play();
            SoundContext.isMusicPlaying = true;
        }

		/**
		 * @method ns_egret.HTML5SoundContext#stopMusic
		 * @param releaseDat {any} 
		 */
        public stopMusic(releaseData) {
            var locSoundList = this._soundList, locPlayingMusic = this._playingMusicName;
            if (locSoundList.hasOwnProperty(locPlayingMusic)) {
                var audio = locSoundList[locPlayingMusic];
                audio.pause();
                audio.currentTime = audio.duration;
                if (releaseData) {
                    delete locSoundList[locPlayingMusic];
                }
                SoundContext.isMusicPlaying = false;
            }
        }
    }
}