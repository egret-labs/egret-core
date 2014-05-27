/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/// <reference path="SoundContext.ts"/>
/// <reference path="../../utils/TextureCache.ts"/>

module egret{
	/**
	 * @class egret.HTML5SoundContext
	 * @classdesc
	 * @extends egret.SoundContext
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
		 * @method egret.HTML5SoundContext#preloadSound
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
		 * @method egret.HTML5SoundContext#playMusic
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
		 * @method egret.HTML5SoundContext#stopMusic
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