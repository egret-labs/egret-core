//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
// There is no HTMLDivElement in webkit for air
if (DEBUG && window['HTMLVideoElement'] == undefined) {
    window['HTMLVideoElement'] = HTMLDivElement;
}
var egret;
(function (egret) {
    var web;
    (function (web) {
        var className = "egret.BitmapData";
        egret.registerClass(HTMLImageElement, className);
        egret.registerClass(HTMLCanvasElement, className);
        egret.registerClass(HTMLVideoElement, className);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    /**
     * 转换 Image，Canvas，Video 为 Egret 框架内使用的 BitmapData 对象。
     * @param data 需要转换的对象，包括HTMLImageElement|HTMLCanvasElement|HTMLVideoElement
     */
    function $toBitmapData(data) {
        data["hashCode"] = data["$hashCode"] = egret.$hashCount++;
        return data;
    }
    egret.$toBitmapData = $toBitmapData;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebExternalInterface = (function () {
            function WebExternalInterface() {
            }
            var d = __define,c=WebExternalInterface,p=c.prototype;
            /**
             * @private
             * @param functionName
             * @param value
             */
            WebExternalInterface.call = function (functionName, value) {
            };
            /**
             * @private
             * @param functionName
             * @param listener
             */
            WebExternalInterface.addCallback = function (functionName, listener) {
            };
            return WebExternalInterface;
        }());
        web.WebExternalInterface = WebExternalInterface;
        egret.registerClass(WebExternalInterface,'egret.web.WebExternalInterface',["egret.ExternalInterface"]);
        egret.ExternalInterface = WebExternalInterface;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var localStorage;
    (function (localStorage) {
        var web;
        (function (web) {
            /**
             * @private
             *
             * @param key
             * @returns
             */
            function getItem(key) {
                return window.localStorage.getItem(key);
            }
            /**
             * @private
             *
             * @param key
             * @param value
             * @returns
             */
            function setItem(key, value) {
                try {
                    window.localStorage.setItem(key, value);
                    return true;
                }
                catch (e) {
                    egret.$warn(1018, key, value);
                    return false;
                }
            }
            /**
             * @private
             *
             * @param key
             */
            function removeItem(key) {
                window.localStorage.removeItem(key);
            }
            /**
             * @private
             *
             */
            function clear() {
                window.localStorage.clear();
            }
            localStorage.getItem = getItem;
            localStorage.setItem = setItem;
            localStorage.removeItem = removeItem;
            localStorage.clear = clear;
        })(web = localStorage.web || (localStorage.web = {}));
    })(localStorage = egret.localStorage || (egret.localStorage = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var HtmlSound = (function (_super) {
            __extends(HtmlSound, _super);
            /**
             * @private
             * @inheritDoc
             */
            function HtmlSound() {
                _super.call(this);
                /**
                 * @private
                 */
                this.loaded = false;
            }
            var d = __define,c=HtmlSound,p=c.prototype;
            d(p, "length"
                ,function () {
                    if (this.originAudio) {
                        return this.originAudio.duration;
                    }
                    throw new Error("sound not loaded!");
                    //return 0;
                }
            );
            /**
             * @inheritDoc
             */
            p.load = function (url) {
                var self = this;
                this.url = url;
                if (DEBUG && !url) {
                    egret.$error(3002);
                }
                var audio = new Audio(url);
                audio.addEventListener("canplaythrough", onAudioLoaded);
                audio.addEventListener("error", onAudioError);
                var ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("firefox") >= 0) {
                    audio.autoplay = !0;
                    audio.muted = true;
                }
                audio.load();
                this.originAudio = audio;
                HtmlSound.$recycle(this.url, audio);
                function onAudioLoaded() {
                    removeListeners();
                    if (ua.indexOf("firefox") >= 0) {
                        audio.pause();
                        audio.muted = false;
                    }
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    removeListeners();
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
                function removeListeners() {
                    audio.removeEventListener("canplaythrough", onAudioLoaded);
                    audio.removeEventListener("error", onAudioError);
                }
            };
            /**
             * @inheritDoc
             */
            p.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (DEBUG && this.loaded == false) {
                    egret.$error(3001);
                }
                var audio = HtmlSound.$pop(this.url);
                if (audio == null) {
                    audio = this.originAudio.cloneNode();
                }
                else {
                }
                audio.autoplay = true;
                var channel = new web.HtmlSoundChannel(audio);
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$startTime = startTime;
                channel.$play();
                egret.sys.$pushSoundChannel(channel);
                return channel;
            };
            /**
             * @inheritDoc
             */
            p.close = function () {
                if (this.loaded == false && this.originAudio)
                    this.originAudio.src = "";
                if (this.originAudio)
                    this.originAudio = null;
                HtmlSound.$clear(this.url);
            };
            HtmlSound.$clear = function (url) {
                var array = HtmlSound.audios[url];
                if (array) {
                    array.length = 0;
                }
            };
            HtmlSound.$pop = function (url) {
                var array = HtmlSound.audios[url];
                if (array && array.length > 0) {
                    return array.pop();
                }
                return null;
            };
            HtmlSound.$recycle = function (url, audio) {
                var array = HtmlSound.audios[url];
                if (HtmlSound.audios[url] == null) {
                    array = HtmlSound.audios[url] = [];
                }
                array.push(audio);
            };
            /**
             * @language en_US
             * Background music
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 背景音乐
             * @version Egret 2.4
             * @platform Web,Native
             */
            HtmlSound.MUSIC = "music";
            /**
             * @language en_US
             * EFFECT
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 音效
             * @version Egret 2.4
             * @platform Web,Native
             */
            HtmlSound.EFFECT = "effect";
            /**
             * @private
             */
            HtmlSound.audios = {};
            return HtmlSound;
        }(egret.EventDispatcher));
        web.HtmlSound = HtmlSound;
        egret.registerClass(HtmlSound,'egret.web.HtmlSound',["egret.Sound"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var HtmlSoundChannel = (function (_super) {
            __extends(HtmlSoundChannel, _super);
            /**
             * @private
             */
            function HtmlSoundChannel(audio) {
                var _this = this;
                _super.call(this);
                /**
                 * @private
                 */
                this.$startTime = 0;
                /**
                 * @private
                 */
                this.audio = null;
                //声音是否已经播放完成
                this.isStopped = false;
                this.canPlay = function () {
                    _this.audio.removeEventListener("canplay", _this.canPlay);
                    try {
                        _this.audio.currentTime = _this.$startTime;
                    }
                    catch (e) {
                    }
                    finally {
                        _this.audio.play();
                    }
                };
                /**
                 * @private
                 */
                this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    /////////////
                    //this.audio.load();
                    _this.$play();
                };
                audio.addEventListener("ended", this.onPlayEnd);
                this.audio = audio;
            }
            var d = __define,c=HtmlSoundChannel,p=c.prototype;
            p.$play = function () {
                if (this.isStopped) {
                    egret.$error(1036);
                    return;
                }
                try {
                    //this.audio.pause();
                    this.audio.currentTime = this.$startTime;
                }
                catch (e) {
                    this.audio.addEventListener("canplay", this.canPlay);
                    return;
                }
                this.audio.play();
            };
            /**
             * @private
             * @inheritDoc
             */
            p.stop = function () {
                if (!this.audio)
                    return;
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
                var audio = this.audio;
                audio.pause();
                audio.removeEventListener("ended", this.onPlayEnd);
                this.audio = null;
                web.HtmlSound.$recycle(this.$url, audio);
            };
            d(p, "volume"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    if (!this.audio)
                        return 1;
                    return this.audio.volume;
                }
                /**
                 * @inheritDoc
                 */
                ,function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                    if (!this.audio)
                        return;
                    this.audio.volume = value;
                }
            );
            d(p, "position"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    if (!this.audio)
                        return 0;
                    return this.audio.currentTime;
                }
            );
            return HtmlSoundChannel;
        }(egret.EventDispatcher));
        web.HtmlSoundChannel = HtmlSoundChannel;
        egret.registerClass(HtmlSoundChannel,'egret.web.HtmlSoundChannel',["egret.SoundChannel","egret.IEventDispatcher"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var QQSound = (function (_super) {
            __extends(QQSound, _super);
            /**
             * @private
             * @inheritDoc
             */
            function QQSound() {
                _super.call(this);
                /**
                 * @private
                 */
                this.loaded = false;
            }
            var d = __define,c=QQSound,p=c.prototype;
            /**
             * @inheritDoc
             */
            p.load = function (url) {
                var self = this;
                this.url = url;
                if (DEBUG && !url) {
                    egret.$error(3002);
                }
                QZAppExternal.preloadSound(function (data) {
                    if (data.code == 0) {
                        self.loaded = true;
                        self.dispatchEventWith(egret.Event.COMPLETE);
                    }
                    else {
                        self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                    }
                }, {
                    bid: -1,
                    url: web.Html5Capatibility._QQRootPath + url,
                    refresh: 1
                });
            };
            d(p, "length"
                ,function () {
                    throw new Error("qq sound not supported!");
                    //return 0;
                }
            );
            /**
             * @inheritDoc
             */
            p.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (DEBUG && this.loaded == false) {
                    egret.$error(3001);
                }
                var channel = new web.QQSoundChannel();
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$type = this.type;
                channel.$startTime = startTime;
                channel.$play();
                egret.sys.$pushSoundChannel(channel);
                return channel;
            };
            /**
             * @inheritDoc
             */
            p.close = function () {
            };
            /**
             * @language en_US
             * Background music
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 背景音乐
             * @version Egret 2.4
             * @platform Web,Native
             */
            QQSound.MUSIC = "music";
            /**
             * @language en_US
             * EFFECT
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 音效
             * @version Egret 2.4
             * @platform Web,Native
             */
            QQSound.EFFECT = "effect";
            return QQSound;
        }(egret.EventDispatcher));
        web.QQSound = QQSound;
        egret.registerClass(QQSound,'egret.web.QQSound',["egret.Sound"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var QQSoundChannel = (function (_super) {
            __extends(QQSoundChannel, _super);
            /**
             * @private
             */
            function QQSoundChannel() {
                var _this = this;
                _super.call(this);
                /**
                 * @private
                 */
                this.$startTime = 0;
                //声音是否已经播放完成
                this.isStopped = false;
                /**
                 * @private
                 */
                this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    /////////////
                    _this.$play();
                };
                /**
                 * @private
                 */
                this._startTime = 0;
            }
            var d = __define,c=QQSoundChannel,p=c.prototype;
            p.$play = function () {
                if (this.isStopped) {
                    egret.$error(1036);
                    return;
                }
                var self = this;
                this._startTime = Date.now();
                var loop = 0;
                if (self.$loops > 0) {
                    loop = self.$loops - 1;
                }
                else {
                    loop = -1;
                }
                if (this.$type == egret.Sound.EFFECT) {
                    QZAppExternal.playLocalSound(function (data) {
                        //self.onPlayEnd();
                        //alert(JSON.stringify(data));
                    }, {
                        bid: -1,
                        url: self.$url,
                        loop: loop //默认为0播放一次，背景音乐和音效同时最多各为一个
                    });
                }
                else {
                    QZAppExternal.playLocalBackSound(function (data) {
                        //self.onPlayEnd();
                        //alert(JSON.stringify(data));
                    }, {
                        bid: -1,
                        url: self.$url,
                        loop: loop //默认为0  播放一次，-1为循环播放。背景音乐和音效同时最多各为一个
                    });
                }
            };
            /**
             * @private
             * @inheritDoc
             */
            p.stop = function () {
                if (this.$type == egret.Sound.EFFECT) {
                    QZAppExternal.stopSound();
                }
                else {
                    QZAppExternal.stopBackSound();
                }
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
            };
            d(p, "volume"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    return 1;
                }
                /**
                 * @inheritDoc
                 */
                ,function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                }
            );
            d(p, "position"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    return (Date.now() - this._startTime) / 1000;
                }
            );
            return QQSoundChannel;
        }(egret.EventDispatcher));
        web.QQSoundChannel = QQSoundChannel;
        egret.registerClass(QQSoundChannel,'egret.web.QQSoundChannel',["egret.SoundChannel","egret.IEventDispatcher"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebAudioDecode = (function () {
            function WebAudioDecode() {
            }
            var d = __define,c=WebAudioDecode,p=c.prototype;
            /**
             * @private
             *
             */
            WebAudioDecode.decodeAudios = function () {
                if (WebAudioDecode.decodeArr.length <= 0) {
                    return;
                }
                if (WebAudioDecode.isDecoding) {
                    return;
                }
                WebAudioDecode.isDecoding = true;
                var decodeInfo = WebAudioDecode.decodeArr.shift();
                WebAudioDecode.ctx.decodeAudioData(decodeInfo["buffer"], function (audioBuffer) {
                    decodeInfo["self"].audioBuffer = audioBuffer;
                    if (decodeInfo["success"]) {
                        decodeInfo["success"]();
                    }
                    WebAudioDecode.isDecoding = false;
                    WebAudioDecode.decodeAudios();
                }, function () {
                    alert("sound decode error: " + decodeInfo["url"] + "！\nsee http://edn.egret.com/cn/docs/page/156");
                    if (decodeInfo["fail"]) {
                        decodeInfo["fail"]();
                    }
                    WebAudioDecode.isDecoding = false;
                    WebAudioDecode.decodeAudios();
                });
            };
            /**
             * @private
             */
            WebAudioDecode.canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
            /**
             * @private
             */
            WebAudioDecode.ctx = WebAudioDecode.canUseWebAudio ? new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])() : undefined;
            /**
             * @private
             */
            WebAudioDecode.decodeArr = [];
            /**
             * @private
             */
            WebAudioDecode.isDecoding = false;
            return WebAudioDecode;
        }());
        web.WebAudioDecode = WebAudioDecode;
        egret.registerClass(WebAudioDecode,'egret.web.WebAudioDecode');
        /**
         * @private
         * @inheritDoc
         */
        var WebAudioSound = (function (_super) {
            __extends(WebAudioSound, _super);
            /**
             * @private
             * @inheritDoc
             */
            function WebAudioSound() {
                _super.call(this);
                /**
                 * @private
                 */
                this.loaded = false;
            }
            var d = __define,c=WebAudioSound,p=c.prototype;
            d(p, "length"
                ,function () {
                    if (this.audioBuffer) {
                        return this.audioBuffer.duration;
                    }
                    throw new Error("sound not loaded!");
                    //return 0;
                }
            );
            /**
             * @inheritDoc
             */
            p.load = function (url) {
                var self = this;
                this.url = url;
                if (DEBUG && !url) {
                    egret.$error(3002);
                }
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";
                console.log("loadWebAudio");
                request.onload = function () {
                    self._arrayBuffer = request.response;
                    WebAudioDecode.decodeArr.push({
                        "buffer": self._arrayBuffer,
                        "success": onAudioLoaded,
                        "fail": onAudioError,
                        "self": self,
                        "url": self.url
                    });
                    WebAudioDecode.decodeAudios();
                };
                request.send();
                function onAudioLoaded() {
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
            };
            /**
             * @inheritDoc
             */
            p.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (DEBUG && this.loaded == false) {
                    egret.$error(3001);
                }
                var channel = new web.WebAudioSoundChannel();
                channel.$url = this.url;
                channel.$loops = loops;
                channel.$audioBuffer = this.audioBuffer;
                channel.$startTime = startTime;
                channel.$play();
                egret.sys.$pushSoundChannel(channel);
                return channel;
            };
            /**
             * @inheritDoc
             */
            p.close = function () {
            };
            /**
             * @language en_US
             * Background music
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 背景音乐
             * @version Egret 2.4
             * @platform Web,Native
             */
            WebAudioSound.MUSIC = "music";
            /**
             * @language en_US
             * EFFECT
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 音效
             * @version Egret 2.4
             * @platform Web,Native
             */
            WebAudioSound.EFFECT = "effect";
            return WebAudioSound;
        }(egret.EventDispatcher));
        web.WebAudioSound = WebAudioSound;
        egret.registerClass(WebAudioSound,'egret.web.WebAudioSound',["egret.Sound"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var WebAudioSoundChannel = (function (_super) {
            __extends(WebAudioSoundChannel, _super);
            /**
             * @private
             */
            function WebAudioSoundChannel() {
                var _this = this;
                _super.call(this);
                /**
                 * @private
                 */
                this.$startTime = 0;
                /**
                 * @private
                 */
                this.bufferSource = null;
                /**
                 * @private
                 */
                this.context = web.WebAudioDecode.ctx;
                //声音是否已经播放完成
                this.isStopped = false;
                /**
                 * @private
                 */
                this._currentTime = 0;
                /**
                 * @private
                 */
                this._volume = 1;
                /**
                 * @private
                 */
                this.onPlayEnd = function () {
                    if (_this.$loops == 1) {
                        _this.stop();
                        _this.dispatchEventWith(egret.Event.SOUND_COMPLETE);
                        return;
                    }
                    if (_this.$loops > 0) {
                        _this.$loops--;
                    }
                    /////////////
                    _this.$play();
                };
                /**
                 * @private
                 */
                this._startTime = 0;
                if (this.context["createGain"]) {
                    this.gain = this.context["createGain"]();
                }
                else {
                    this.gain = this.context["createGainNode"]();
                }
            }
            var d = __define,c=WebAudioSoundChannel,p=c.prototype;
            p.$play = function () {
                if (this.isStopped) {
                    egret.$error(1036);
                    return;
                }
                if (this.bufferSource) {
                    this.bufferSource.onended = null;
                    this.bufferSource = null;
                }
                var context = this.context;
                var gain = this.gain;
                var bufferSource = context.createBufferSource();
                this.bufferSource = bufferSource;
                bufferSource.buffer = this.$audioBuffer;
                bufferSource.connect(gain);
                gain.connect(context.destination);
                bufferSource.onended = this.onPlayEnd;
                this._startTime = Date.now();
                this.gain.gain.value = this._volume;
                bufferSource.start(0, this.$startTime);
                this._currentTime = 0;
            };
            p.stop = function () {
                if (this.bufferSource) {
                    var sourceNode = this.bufferSource;
                    if (sourceNode.stop) {
                        sourceNode.stop(0);
                    }
                    else {
                        sourceNode.noteOff(0);
                    }
                    this.bufferSource.disconnect();
                    this.bufferSource = null;
                    this.$audioBuffer = null;
                }
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
            };
            d(p, "volume"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    return this._volume;
                }
                /**
                 * @inheritDoc
                 */
                ,function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                    this._volume = value;
                    this.gain.gain.value = value;
                }
            );
            d(p, "position"
                /**
                 * @private
                 * @inheritDoc
                 */
                ,function () {
                    if (this.bufferSource) {
                        return (Date.now() - this._startTime) / 1000 + this.$startTime;
                    }
                    return 0;
                }
            );
            return WebAudioSoundChannel;
        }(egret.EventDispatcher));
        web.WebAudioSoundChannel = WebAudioSoundChannel;
        egret.registerClass(WebAudioSoundChannel,'egret.web.WebAudioSoundChannel',["egret.SoundChannel","egret.IEventDispatcher"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * @inheritDoc
         */
        var WebVideo = (function (_super) {
            __extends(WebVideo, _super);
            /**
             * @inheritDoc
             */
            function WebVideo(url) {
                var _this = this;
                _super.call(this);
                /**
                 * @private
                 */
                this.loaded = false;
                /**
                 * @private
                 */
                this.closed = false;
                /**
                 * @private
                 */
                this.heightSet = NaN;
                /**
                 * @private
                 */
                this.widthSet = NaN;
                this.isPlayed = false;
                this.screenChanged = function (e) {
                    var isfullscreen = !!_this.video['webkitDisplayingFullscreen'];
                    if (!isfullscreen) {
                        _this.checkFullScreen(false);
                    }
                };
                this._fullscreen = true;
                /**
                 * @private
                 *
                 */
                this.onVideoLoaded = function () {
                    _this.video.removeEventListener("canplay", _this.onVideoLoaded);
                    var video = _this.video;
                    _this.loaded = true;
                    video.pause();
                    if (_this.posterData) {
                        _this.posterData.width = _this.getPlayWidth();
                        _this.posterData.height = _this.getPlayHeight();
                    }
                    video.width = video.videoWidth;
                    video.height = video.videoHeight;
                    _this.$invalidateContentBounds();
                    _this.dispatchEventWith(egret.Event.COMPLETE);
                };
                this.$renderNode = new egret.sys.BitmapNode();
                this.src = url;
                this.once(egret.Event.ADDED_TO_STAGE, this.loadPoster, this);
                if (url) {
                    this.load();
                }
            }
            var d = __define,c=WebVideo,p=c.prototype;
            /**
             * @inheritDoc
             */
            p.load = function (url) {
                var _this = this;
                url = url || this.src;
                this.src = url;
                if (DEBUG && !url) {
                    egret.$error(3002);
                }
                if (this.video && this.video.src == url)
                    return;
                var video = document.createElement("video");
                video.controls = null;
                video.src = url; //
                video.setAttribute("autoplay", "autoplay");
                video.setAttribute("webkit-playsinline", "true");
                video.addEventListener("canplay", this.onVideoLoaded);
                video.addEventListener("error", function () { return _this.onVideoError(); });
                video.addEventListener("ended", function () { return _this.onVideoEnded(); });
                video.load();
                video.play();
                video.style.position = "absolute";
                video.style.top = "0px";
                video.style.zIndex = "-88888";
                video.style.left = "0px";
                video.height = 1;
                video.width = 1;
                window.setTimeout(function () { return video.pause(); }, 16);
                this.video = video;
            };
            d(p, "length"
                ,function () {
                    if (this.video) {
                        return this.video.duration;
                    }
                    throw new Error("Video not loaded!");
                    //return 0;
                }
            );
            /**
             * @inheritDoc
             */
            p.play = function (startTime, loop) {
                var _this = this;
                if (loop === void 0) { loop = false; }
                if (this.loaded == false) {
                    this.load(this.src);
                    this.once(egret.Event.COMPLETE, function (e) { return _this.play(startTime, loop); }, this);
                    return;
                }
                this.isPlayed = true;
                var video = this.video;
                if (startTime != undefined)
                    video.currentTime = +startTime || 0;
                video.loop = !!loop;
                if (egret.Capabilities.isMobile) {
                    video.style.zIndex = "-88888"; //移动端，就算设置成最小，只要全屏，都会在最上层，而且在自动退出去后，不担心挡住canvas
                }
                else {
                    video.style.zIndex = "9999";
                }
                video.style.position = "absolute";
                video.style.top = "0px";
                video.style.left = "0px";
                video.height = video.videoHeight;
                video.width = video.videoWidth;
                this.checkFullScreen(this._fullscreen);
            };
            p.checkFullScreen = function (playFullScreen) {
                var video = this.video;
                if (playFullScreen) {
                    if (video.parentElement == null) {
                        video.removeAttribute("webkit-playsinline");
                        video.style.width = "100%";
                        video.style.height = "100%";
                        document.body.appendChild(video);
                    }
                    egret.stopTick(this.markDirty, this);
                    this.setFullScreenMonitor(true);
                }
                else {
                    if (video.parentElement != null) {
                        video.parentElement.removeChild(video);
                    }
                    video.setAttribute("webkit-playsinline", "true");
                    this.setFullScreenMonitor(false);
                    if (!egret.Capabilities.isMobile) {
                        egret.startTick(this.markDirty, this);
                    }
                }
                video.play();
            };
            p.setFullScreenMonitor = function (use) {
                var video = this.video;
                if (use) {
                    video.addEventListener("mozfullscreenchange", this.screenChanged);
                    video.addEventListener("webkitfullscreenchange", this.screenChanged);
                    video.addEventListener("webkitfullscreenerror", this.screenError);
                    video.addEventListener("webkitfullscreenerror", this.screenError);
                }
                else {
                    video.removeEventListener("mozfullscreenchange", this.screenChanged);
                    video.removeEventListener("webkitfullscreenchange", this.screenChanged);
                    video.removeEventListener("webkitfullscreenerror", this.screenError);
                    video.removeEventListener("webkitfullscreenerror", this.screenError);
                }
            };
            p.screenError = function () {
                egret.$error(3103);
            };
            p.exitFullscreen = function () {
                //退出全屏
                if (document['exitFullscreen']) {
                    document['exitFullscreen']();
                }
                else if (document['msExitFullscreen']) {
                    document['msExitFullscreen']();
                }
                else if (document['mozCancelFullScreen']) {
                    document['mozCancelFullScreen']();
                }
                else if (document['oCancelFullScreen']) {
                    document['oCancelFullScreen']();
                }
                else if (document['webkitExitFullscreen']) {
                    document['webkitExitFullscreen']();
                }
                else {
                }
            };
            /**
             * @private
             *
             */
            p.onVideoEnded = function () {
                var video = this.video;
                if (video.parentElement != null) {
                    video.parentElement.removeChild(video);
                }
                this.pause();
                this.isPlayed = false;
                if (!this._fullscreen) {
                    this.$invalidateContentBounds();
                }
                this.dispatchEventWith(egret.Event.ENDED);
            };
            /**
             * @private
             *
             */
            p.onVideoError = function () {
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };
            /**
             * @inheritDoc
             */
            p.close = function () {
                var _this = this;
                this.closed = true;
                this.video.removeEventListener("canplay", this.onVideoLoaded);
                this.video.removeEventListener("error", function () { return _this.onVideoError(); });
                this.video.removeEventListener("ended", function () { return _this.onVideoEnded(); });
                this.pause();
                if (this.loaded == false && this.video)
                    this.video.src = "";
                if (this.video && this.video.parentElement) {
                    this.video.parentElement.removeChild(this.video);
                    this.video = null;
                }
                this.loaded = false;
            };
            /**
             * @inheritDoc
             */
            p.pause = function () {
                if (this.video) {
                    this.video.pause();
                }
                egret.stopTick(this.markDirty, this);
                this.$invalidate();
            };
            d(p, "volume"
                /**
                 * @inheritDoc
                 */
                ,function () {
                    if (!this.video)
                        return 1;
                    return this.video.volume;
                }
                /**
                 * @inheritDoc
                 */
                ,function (value) {
                    if (!this.video)
                        return;
                    this.video.volume = value;
                }
            );
            d(p, "position"
                /**
                 * @inheritDoc
                 */
                ,function () {
                    if (!this.video)
                        return 0;
                    return this.video.currentTime;
                }
                /**
                 * @inheritDoc
                 */
                ,function (value) {
                    if (!this.video)
                        return;
                    this.video.currentTime = value;
                }
            );
            d(p, "fullscreen"
                /**
                 * @inheritDoc
                 */
                ,function () {
                    return this._fullscreen;
                }
                /**
                 * @inheritDoc
                 */
                ,function (value) {
                    this._fullscreen = !!value;
                    if (this.video && this.video.paused == false) {
                        this.checkFullScreen(this._fullscreen);
                    }
                }
            );
            d(p, "bitmapData"
                /**
                 * @inheritDoc
                 */
                ,function () {
                    if (!this.video || !this.loaded)
                        return null;
                    if (!this._bitmapData) {
                        this.video.width = this.video.videoWidth;
                        this.video.height = this.video.videoHeight;
                        this._bitmapData = egret.$toBitmapData(this.video);
                    }
                    return this._bitmapData;
                }
            );
            p.loadPoster = function () {
                var _this = this;
                var poster = this.poster;
                if (!poster)
                    return;
                var imageLoader = new egret.ImageLoader();
                imageLoader.once(egret.Event.COMPLETE, function (e) {
                    var posterData = imageLoader.data;
                    _this.posterData = imageLoader.data;
                    _this.posterData.width = _this.getPlayWidth();
                    _this.posterData.height = _this.getPlayHeight();
                    _this.$invalidateContentBounds();
                }, this);
                imageLoader.load(poster);
            };
            /**
             * @private
             */
            p.$measureContentBounds = function (bounds) {
                var bitmapData = this.bitmapData;
                var posterData = this.posterData;
                if (bitmapData) {
                    bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
                }
                else if (posterData) {
                    bounds.setTo(0, 0, this.getPlayWidth(), this.getPlayHeight());
                }
                else {
                    bounds.setEmpty();
                }
            };
            p.getPlayWidth = function () {
                if (!isNaN(this.widthSet)) {
                    return this.widthSet;
                }
                if (this.bitmapData) {
                    return this.bitmapData.width;
                }
                if (this.posterData) {
                    return this.posterData.width;
                }
                return NaN;
            };
            p.getPlayHeight = function () {
                if (!isNaN(this.heightSet)) {
                    return this.heightSet;
                }
                if (this.bitmapData) {
                    return this.bitmapData.height;
                }
                if (this.posterData) {
                    return this.posterData.height;
                }
                return NaN;
            };
            /**
             * @private
             */
            p.$render = function () {
                var node = this.$renderNode;
                var bitmapData = this.bitmapData;
                var posterData = this.posterData;
                var width = this.getPlayWidth();
                var height = this.getPlayHeight();
                if (width <= 0 || height <= 0) {
                    return;
                }
                if ((!this.isPlayed || egret.Capabilities.isMobile) && posterData) {
                    node.image = posterData;
                    node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
                }
                else if (this.isPlayed && bitmapData && !this._fullscreen && !egret.Capabilities.isMobile) {
                    node.image = bitmapData;
                    node.drawImage(0, 0, bitmapData.width, bitmapData.height, 0, 0, width, height);
                }
            };
            p.markDirty = function () {
                this.$invalidate();
                return true;
            };
            /**
             * @private
             * 设置显示高度
             */
            p.$setHeight = function (value) {
                this.heightSet = +value || 0;
                this.$invalidate();
                this.$invalidateContentBounds();
                return _super.prototype.$setHeight.call(this, value);
            };
            /**
             * @private
             * 设置显示宽度
             */
            p.$setWidth = function (value) {
                this.widthSet = +value || 0;
                this.$invalidate();
                this.$invalidateContentBounds();
                return _super.prototype.$setWidth.call(this, value);
            };
            d(p, "paused"
                ,function () {
                    if (this.video) {
                        return this.video.paused;
                    }
                    return true;
                }
            );
            return WebVideo;
        }(egret.DisplayObject));
        web.WebVideo = WebVideo;
        egret.registerClass(WebVideo,'egret.web.WebVideo',["egret.Video"]);
        egret.Video = WebVideo;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebHttpRequest = (function (_super) {
            __extends(WebHttpRequest, _super);
            /**
             * @private
             */
            function WebHttpRequest() {
                _super.call(this);
                /**
                 * @private
                 */
                this._url = "";
                this._method = "";
            }
            var d = __define,c=WebHttpRequest,p=c.prototype;
            d(p, "response"
                /**
                 * @private
                 * 本次请求返回的数据，数据类型根据responseType设置的值确定。
                 */
                ,function () {
                    if (!this._xhr) {
                        return null;
                    }
                    if (this._xhr.response != undefined) {
                        return this._xhr.response;
                    }
                    if (this._responseType == "text") {
                        return this._xhr.responseText;
                    }
                    if (this._responseType == "arraybuffer" && /msie 9.0/i.test(navigator.userAgent)) {
                        var w = window;
                        return w.convertResponseBodyToText(this._xhr.responseBody);
                    }
                    if (this._responseType == "document") {
                        return this._xhr.responseXML;
                    }
                    /*if (this._xhr.responseXML) {
                        return this._xhr.responseXML;
                    }
                    if (this._xhr.responseText != undefined) {
                        return this._xhr.responseText;
                    }*/
                    return null;
                }
            );
            d(p, "responseType"
                /**
                 * @private
                 * 设置返回的数据格式，请使用 HttpResponseType 里定义的枚举值。设置非法的值或不设置，都将使用HttpResponseType.TEXT。
                 */
                ,function () {
                    return this._responseType;
                }
                ,function (value) {
                    this._responseType = value;
                }
            );
            d(p, "withCredentials"
                /**
                 * @private
                 * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。(这个标志不会影响同站的请求)
                 */
                ,function () {
                    return this._withCredentials;
                }
                ,function (value) {
                    this._withCredentials = value;
                }
            );
            /**
             * @private
             *
             * @returns
             */
            p.getXHR = function () {
                if (window["XMLHttpRequest"]) {
                    return new window["XMLHttpRequest"]();
                }
                else {
                    return new ActiveXObject("MSXML2.XMLHTTP");
                }
            };
            /**
             * @private
             * 初始化一个请求.注意，若在已经发出请求的对象上调用此方法，相当于立即调用abort().
             * @param url 该请求所要访问的URL该请求所要访问的URL
             * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
             */
            p.open = function (url, method) {
                if (method === void 0) { method = "GET"; }
                this._url = url;
                this._method = method;
                if (this._xhr) {
                    this._xhr.abort();
                    this._xhr = null;
                }
                this._xhr = this.getXHR(); //new XMLHttpRequest();
                this._xhr.onreadystatechange = this.onReadyStateChange.bind(this);
                this._xhr.onprogress = this.updateProgress.bind(this);
                this._xhr.open(this._method, this._url, true);
            };
            /**
             * @private
             * 发送请求.
             * @param data 需要发送的数据
             */
            p.send = function (data) {
                if (this._responseType != null) {
                    this._xhr.responseType = this._responseType;
                }
                if (this._withCredentials != null) {
                    this._xhr.withCredentials = this._withCredentials;
                }
                if (this.headerObj) {
                    for (var key in this.headerObj) {
                        this._xhr.setRequestHeader(key, this.headerObj[key]);
                    }
                }
                this._xhr.send(data);
            };
            /**
             * @private
             * 如果请求已经被发送,则立刻中止请求.
             */
            p.abort = function () {
                if (this._xhr) {
                    this._xhr.abort();
                }
            };
            /**
             * @private
             * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
             */
            p.getAllResponseHeaders = function () {
                if (!this._xhr) {
                    return null;
                }
                var result = this._xhr.getAllResponseHeaders();
                return result ? result : "";
            };
            /**
             * @private
             * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
             * @param header 将要被赋值的请求头名称.
             * @param value 给指定的请求头赋的值.
             */
            p.setRequestHeader = function (header, value) {
                if (!this.headerObj) {
                    this.headerObj = {};
                }
                this.headerObj[header] = value;
            };
            /**
             * @private
             * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
             * @param header 要返回的响应头名称
             */
            p.getResponseHeader = function (header) {
                if (!this._xhr) {
                    return null;
                }
                var result = this._xhr.getResponseHeader(header);
                return result ? result : "";
            };
            /**
             * @private
             */
            p.onReadyStateChange = function () {
                var xhr = this._xhr;
                if (xhr.readyState == 4) {
                    var ioError = (xhr.status >= 400 || xhr.status == 0);
                    var url = this._url;
                    var self = this;
                    window.setTimeout(function () {
                        if (ioError) {
                            if (DEBUG && !self.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                                egret.$error(1011, url);
                            }
                            self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                        }
                        else {
                            self.dispatchEventWith(egret.Event.COMPLETE);
                        }
                    }, 0);
                }
            };
            /**
             * @private
             */
            p.updateProgress = function (event) {
                if (event.lengthComputable) {
                    egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.PROGRESS, event.loaded, event.total);
                }
            };
            return WebHttpRequest;
        }(egret.EventDispatcher));
        web.WebHttpRequest = WebHttpRequest;
        egret.registerClass(WebHttpRequest,'egret.web.WebHttpRequest',["egret.HttpRequest"]);
        egret.HttpRequest = WebHttpRequest;
        if (DEBUG) {
            egret.$markReadOnly(WebHttpRequest, "response");
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var winURL = window["URL"] || window["webkitURL"];
        /**
         * @private
         * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
         */
        var WebImageLoader = (function (_super) {
            __extends(WebImageLoader, _super);
            function WebImageLoader() {
                _super.apply(this, arguments);
                /**
                 * @private
                 * 使用 load() 方法加载成功的 BitmapData 图像数据。
                 */
                this.data = null;
                /**
                 * @private
                 * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
                 * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
                 */
                this._crossOrigin = null;
                /**
                 * @private
                 * 标记crossOrigin有没有被设置过,设置过之后使用设置的属性
                 */
                this._hasCrossOriginSet = false;
                /**
                 * @private
                 */
                this.currentImage = null;
                /**
                 * @private
                 */
                this.request = null;
            }
            var d = __define,c=WebImageLoader,p=c.prototype;
            d(p, "crossOrigin"
                ,function () {
                    return this._crossOrigin;
                }
                ,function (value) {
                    this._hasCrossOriginSet = true;
                    this._crossOrigin = value;
                }
            );
            /**
             * @private
             * 启动一次图像加载。注意：若之前已经调用过加载请求，重新调用 load() 将终止先前的请求，并开始新的加载。
             * @param url 要加载的图像文件的地址。
             */
            p.load = function (url) {
                if (web.Html5Capatibility._canUseBlob
                    && url.indexOf("wxLocalResource:") != 0 //微信专用不能使用 blob
                    && url.indexOf("data:") != 0
                    && url.indexOf("http:") != 0
                    && url.indexOf("https:") != 0) {
                    var request = this.request;
                    if (!request) {
                        request = this.request = new egret.web.WebHttpRequest();
                        request.addEventListener(egret.Event.COMPLETE, this.onBlobLoaded, this);
                        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onBlobError, this);
                        request.responseType = "blob";
                    }
                    if (DEBUG) {
                        this.currentURL = url;
                    }
                    request.open(url);
                    request.send();
                }
                else {
                    this.loadImage(url);
                }
            };
            /**
             * @private
             */
            p.onBlobLoaded = function (event) {
                var blob = this.request.response;
                this.loadImage(winURL.createObjectURL(blob));
            };
            /**
             * @private
             */
            p.onBlobError = function (event) {
                this.dispatchIOError(this.currentURL);
            };
            /**
             * @private
             */
            p.loadImage = function (src) {
                var image = new Image();
                this.data = null;
                this.currentImage = image;
                if (this._hasCrossOriginSet) {
                    if (this._crossOrigin) {
                        image.crossOrigin = this._crossOrigin;
                    }
                }
                else {
                    if (WebImageLoader.crossOrigin) {
                        image.crossOrigin = WebImageLoader.crossOrigin;
                    }
                }
                /*else {
                    if (image.hasAttribute("crossOrigin")) {//兼容猎豹
                        image.removeAttribute("crossOrigin");
                    }
                }*/
                image.onload = this.onImageComplete.bind(this);
                image.onerror = this.onLoadError.bind(this);
                image.src = src;
            };
            /**
             * @private
             */
            p.onImageComplete = function (event) {
                var image = this.getImage(event);
                if (!image) {
                    return;
                }
                this.data = egret.$toBitmapData(image);
                var self = this;
                window.setTimeout(function () {
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }, 0);
            };
            /**
             * @private
             */
            p.onLoadError = function (event) {
                var image = this.getImage(event);
                if (!image) {
                    return;
                }
                this.dispatchIOError(image.src);
            };
            p.dispatchIOError = function (url) {
                var self = this;
                window.setTimeout(function () {
                    if (DEBUG && !self.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                        egret.$error(1011, url);
                    }
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }, 0);
            };
            /**
             * @private
             */
            p.getImage = function (event) {
                var image = event.target;
                var url = image.src;
                if (url.indexOf("blob:") == 0) {
                    try {
                        winURL.revokeObjectURL(image.src);
                    }
                    catch (e) {
                        egret.$warn(1037);
                    }
                }
                image.onerror = null;
                image.onload = null;
                if (this.currentImage !== image) {
                    return null;
                }
                this.currentImage = null;
                return image;
            };
            /**
             * @private
             * 指定是否启用跨域资源共享,如果ImageLoader实例有设置过crossOrigin属性将使用设置的属性
             */
            WebImageLoader.crossOrigin = null;
            return WebImageLoader;
        }(egret.EventDispatcher));
        web.WebImageLoader = WebImageLoader;
        egret.registerClass(WebImageLoader,'egret.web.WebImageLoader',["egret.ImageLoader"]);
        egret.ImageLoader = WebImageLoader;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @classdesc
         * @extends egret.StageText
         * @private
         */
        var HTML5StageText = (function (_super) {
            __extends(HTML5StageText, _super);
            /**
             * @private
             */
            function HTML5StageText() {
                _super.call(this);
                /**
                 * @private
                 */
                this._isNeedShow = false;
                /**
                 * @private
                 */
                this.inputElement = null;
                /**
                 * @private
                 */
                this.inputDiv = null;
                /**
                 * @private
                 */
                this._gscaleX = 0;
                /**
                 * @private
                 */
                this._gscaleY = 0;
                /**
                 * @private
                 */
                this._isNeesHide = false;
                /**
                 * @private
                 */
                this.textValue = "";
                /**
                 * @private
                 */
                this.colorValue = 0xffffff;
                /**
                 * @private
                 */
                this._styleInfoes = {};
            }
            var d = __define,c=HTML5StageText,p=c.prototype;
            /**
             * @private
             *
             * @param textfield
             */
            p.$setTextField = function (textfield) {
                this.$textfield = textfield;
                return true;
            };
            /**
             * @private
             *
             */
            p.$addToStage = function () {
                this.htmlInput = egret.web.$getTextAdapter(this.$textfield);
            };
            /**
             * @private
             *
             */
            p._initElement = function () {
                var point = this.$textfield.localToGlobal(0, 0);
                var x = point.x;
                var y = point.y;
                var m = this.$textfield.$renderNode.renderMatrix;
                var cX = m.a;
                var cY = m.d;
                var scaleX = this.htmlInput.$scaleX;
                var scaleY = this.htmlInput.$scaleY;
                this.inputDiv.style.left = x * scaleX + "px";
                this.inputDiv.style.top = y * scaleY + "px";
                if (this.$textfield.multiline && this.$textfield.height > this.$textfield.size) {
                    this.inputDiv.style.top = (y) * scaleY + "px";
                    this.inputElement.style.top = (-this.$textfield.lineSpacing / 2) * scaleY + "px";
                }
                else {
                    this.inputDiv.style.top = y * scaleY + "px";
                    this.inputElement.style.top = 0 + "px";
                }
                this._gscaleX = scaleX * cX;
                this._gscaleY = scaleY * cY;
            };
            /**
             * @private
             *
             */
            p.$show = function () {
                if (!this.htmlInput.isCurrentStageText(this)) {
                    this.inputElement = this.htmlInput.getInputElement(this);
                    this.inputDiv = this.htmlInput._inputDIV;
                }
                else {
                    this.inputElement.onblur = null;
                }
                this.htmlInput._needShow = true;
                //标记当前文本被选中
                this._isNeedShow = true;
                this._initElement();
            };
            /**
             * @private
             *
             */
            p.onBlurHandler = function () {
                this.htmlInput.clearInputElement();
                window.scrollTo(0, 0);
            };
            /**
             * @private
             *
             */
            p.executeShow = function () {
                var self = this;
                //打开
                this.inputElement.value = this.$getText();
                if (this.inputElement.onblur == null) {
                    this.inputElement.onblur = this.onBlurHandler.bind(this);
                }
                this.$resetStageText();
                if (this.$textfield.maxChars > 0) {
                    this.inputElement.setAttribute("maxlength", this.$textfield.maxChars);
                }
                else {
                    this.inputElement.removeAttribute("maxlength");
                }
                this.inputElement.selectionStart = this.inputElement.value.length;
                this.inputElement.selectionEnd = this.inputElement.value.length;
                this.inputElement.focus();
            };
            /**
             * @private
             *
             */
            p.$hide = function () {
                //标记当前点击其他地方关闭
                this._isNeesHide = true;
                if (this.htmlInput && egret.web.Html5Capatibility._System_OS == egret.web.SystemOSType.IOS) {
                    this.htmlInput.disconnectStageText(this);
                }
            };
            /**
             * @private
             *
             * @returns
             */
            p.$getText = function () {
                if (!this.textValue) {
                    this.textValue = "";
                }
                return this.textValue;
            };
            /**
             * @private
             *
             * @param value
             */
            p.$setText = function (value) {
                this.textValue = value;
                this.resetText();
                return true;
            };
            /**
             * @private
             *
             */
            p.resetText = function () {
                if (this.inputElement) {
                    this.inputElement.value = this.textValue;
                }
            };
            p.$setColor = function (value) {
                this.colorValue = value;
                this.resetColor();
                return true;
            };
            /**
             * @private
             *
             */
            p.resetColor = function () {
                if (this.inputElement) {
                    this.setElementStyle("color", egret.toColorString(this.colorValue));
                }
            };
            p.$onBlur = function () {
                if (web.Html5Capatibility._System_OS == web.SystemOSType.WPHONE) {
                    egret.Event.dispatchEvent(this, "updateText", false);
                }
            };
            /**
             * @private
             *
             */
            p._onInput = function () {
                var self = this;
                if (web.Html5Capatibility._System_OS == web.SystemOSType.WPHONE) {
                    var values = this.$textfield.$TextField;
                    if (values[35 /* restrictAnd */] == null && values[36 /* restrictNot */] == null) {
                        self.textValue = self.inputElement.value;
                        egret.Event.dispatchEvent(self, "updateText", false);
                    }
                    else {
                        window.setTimeout(function () {
                            if (self.inputElement) {
                                if (self.inputElement.selectionStart && self.inputElement.selectionEnd) {
                                    if (self.inputElement.selectionStart == self.inputElement.selectionEnd) {
                                        self.textValue = self.inputElement.value;
                                        egret.Event.dispatchEvent(self, "updateText", false);
                                    }
                                }
                            }
                        }, 0);
                    }
                }
                else {
                    window.setTimeout(function () {
                        if (self.inputElement.selectionStart == self.inputElement.selectionEnd) {
                            self.textValue = self.inputElement.value;
                            egret.Event.dispatchEvent(self, "updateText", false);
                        }
                    }, 0);
                }
            };
            p.setAreaHeight = function () {
                var textfield = this.$textfield;
                if (textfield.multiline) {
                    var textheight = egret.TextFieldUtils.$getTextHeight(textfield);
                    if (textfield.height <= textfield.size || textfield.height < textheight) {
                        this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                        this.setElementStyle("padding", "0px");
                        this.setElementStyle("lineHeight", (textfield.size) * this._gscaleY + "px");
                    }
                    else {
                        this.setElementStyle("height", (textheight + textfield.lineSpacing) * this._gscaleY + "px");
                        var rap = (textfield.height - textheight) * this._gscaleY;
                        var valign = egret.TextFieldUtils.$getValign(textfield);
                        var top = rap * valign;
                        var bottom = rap - top;
                        this.setElementStyle("padding", top + "px 0px " + bottom + "px 0px");
                        this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
                    }
                }
            };
            /**
             * @private
             *
             * @param e
             */
            p._onClickHandler = function (e) {
                if (this._isNeedShow) {
                    e.stopImmediatePropagation();
                    //e.preventDefault();
                    this._isNeedShow = false;
                    this.executeShow();
                    this.dispatchEvent(new egret.Event("focus"));
                }
            };
            /**
             * @private
             *
             */
            p._onDisconnect = function () {
                this.inputElement = null;
                this.dispatchEvent(new egret.Event("blur"));
            };
            /**
             * @private
             *
             * @param style
             * @param value
             */
            p.setElementStyle = function (style, value) {
                if (this.inputElement) {
                    if (this._styleInfoes[style] != value) {
                        this.inputElement.style[style] = value;
                    }
                }
            };
            /**
             * @private
             *
             */
            p.$removeFromStage = function () {
                if (this.inputElement) {
                    this.htmlInput.disconnectStageText(this);
                }
            };
            /**
             * 修改位置
             * @private
             */
            p.$resetStageText = function () {
                if (this.inputElement) {
                    var textfield = this.$textfield;
                    this.setElementStyle("fontFamily", textfield.fontFamily);
                    this.setElementStyle("fontStyle", textfield.italic ? "italic" : "normal");
                    this.setElementStyle("fontWeight", textfield.bold ? "bold" : "normal");
                    this.setElementStyle("textAlign", textfield.textAlign);
                    this.setElementStyle("fontSize", textfield.size * this._gscaleY + "px");
                    this.setElementStyle("color", egret.toColorString(textfield.textColor));
                    if (textfield.stage) {
                        var tw = textfield.localToGlobal(0, 0).x;
                        tw = Math.min(textfield.width, textfield.stage.stageWidth - tw);
                    }
                    else {
                        tw = textfield.width;
                    }
                    this.setElementStyle("width", tw * this._gscaleX + "px");
                    this.setElementStyle("verticalAlign", textfield.verticalAlign);
                    if (textfield.multiline) {
                        this.setAreaHeight();
                    }
                    else {
                        this.setElementStyle("lineHeight", (textfield.size) * this._gscaleY + "px");
                        if (textfield.height < textfield.size) {
                            this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                            var bottom = (textfield.size / 2) * this._gscaleY;
                            this.setElementStyle("padding", "0px 0px " + bottom + "px 0px");
                        }
                        else {
                            this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                            var rap = (textfield.height - textfield.size) * this._gscaleY;
                            var valign = egret.TextFieldUtils.$getValign(textfield);
                            var top = rap * valign;
                            var bottom = rap - top;
                            if (bottom < textfield.size / 2 * this._gscaleY) {
                                bottom = textfield.size / 2 * this._gscaleY;
                            }
                            this.setElementStyle("padding", top + "px 0px " + bottom + "px 0px");
                        }
                    }
                    this.inputDiv.style.clip = "rect(0px " + (textfield.width * this._gscaleX) + "px " + (textfield.height * this._gscaleY) + "px 0px)";
                    this.inputDiv.style.height = textfield.height * this._gscaleY + "px";
                    this.inputDiv.style.width = tw * this._gscaleX + "px";
                }
            };
            return HTML5StageText;
        }(egret.EventDispatcher));
        web.HTML5StageText = HTML5StageText;
        egret.registerClass(HTML5StageText,'egret.web.HTML5StageText',["egret.StageText"]);
        egret.StageText = HTML5StageText;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var HTMLInput = (function () {
            function HTMLInput() {
                /**
                 * @private
                 */
                this._needShow = false;
                /**
                 * @private
                 */
                this.$scaleX = 1;
                /**
                 * @private
                 */
                this.$scaleY = 1;
            }
            var d = __define,c=HTMLInput,p=c.prototype;
            /**
             * @private
             *
             * @returns
             */
            p.isInputOn = function () {
                return this._stageText != null;
            };
            /**
             * @private
             *
             * @param stageText
             * @returns
             */
            p.isCurrentStageText = function (stageText) {
                return this._stageText == stageText;
            };
            /**
             * @private
             *
             * @param dom
             */
            p.initValue = function (dom) {
                dom.style.position = "absolute";
                dom.style.left = "0px";
                dom.style.top = "0px";
                dom.style.border = "none";
                dom.style.padding = "0";
            };
            /**
             * @private
             *
             */
            p.$updateSize = function () {
                if (!this.canvas) {
                    return;
                }
                var stageW = this.canvas.width;
                var stageH = this.canvas.height;
                var screenW = this.canvas.style.width.split("px")[0];
                var screenH = this.canvas.style.height.split("px")[0];
                this.$scaleX = screenW / stageW;
                this.$scaleY = screenH / stageH;
                this.StageDelegateDiv.style.left = this.canvas.style.left;
                this.StageDelegateDiv.style.top = this.canvas.style.top;
                var transformKey = egret.web.getPrefixStyleName("transform");
                this.StageDelegateDiv.style[transformKey] = this.canvas.style[transformKey];
                this.StageDelegateDiv.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
            };
            /**
             * @private
             *
             * @param container
             * @param canvas
             * @returns
             */
            p._initStageDelegateDiv = function (container, canvas) {
                this.canvas = canvas;
                var self = this;
                var stageDelegateDiv;
                if (!stageDelegateDiv) {
                    stageDelegateDiv = document.createElement("div");
                    this.StageDelegateDiv = stageDelegateDiv;
                    stageDelegateDiv.id = "StageDelegateDiv";
                    container.appendChild(stageDelegateDiv);
                    self.initValue(stageDelegateDiv);
                    self._inputDIV = document.createElement("div");
                    self.initValue(self._inputDIV);
                    self._inputDIV.style.width = "0px";
                    self._inputDIV.style.height = "0px";
                    self._inputDIV.style.left = 0 + "px";
                    self._inputDIV.style.top = "-100px";
                    self._inputDIV.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
                    stageDelegateDiv.appendChild(self._inputDIV);
                    this.canvas.addEventListener("click", function (e) {
                        if (self._needShow) {
                            self._needShow = false;
                            self._stageText._onClickHandler(e);
                            self.show();
                        }
                        else {
                            if (self._inputElement) {
                                self.clearInputElement();
                                self._inputElement.blur();
                                self._inputElement = null;
                            }
                        }
                    });
                    self.initInputElement(true);
                    self.initInputElement(false);
                }
            };
            //初始化输入框
            p.initInputElement = function (multiline) {
                var self = this;
                //增加1个空的textarea
                var inputElement;
                if (multiline) {
                    inputElement = document.createElement("textarea");
                    inputElement.style["resize"] = "none";
                    self._multiElement = inputElement;
                    inputElement.id = "egretTextarea";
                }
                else {
                    inputElement = document.createElement("input");
                    self._simpleElement = inputElement;
                    inputElement.id = "egretInput";
                }
                inputElement.type = "text";
                self._inputDIV.appendChild(inputElement);
                inputElement.setAttribute("tabindex", "-1");
                inputElement.style.width = "1px";
                inputElement.style.height = "12px";
                self.initValue(inputElement);
                inputElement.style.outline = "thin";
                inputElement.style.background = "none";
                inputElement.style.overflow = "hidden";
                inputElement.style.wordBreak = "break-all";
                //隐藏输入框
                inputElement.style.opacity = 0;
                inputElement.oninput = function () {
                    if (self._stageText) {
                        self._stageText._onInput();
                    }
                };
            };
            /**
             * @private
             *
             */
            p.show = function () {
                var self = this;
                var inputElement = self._inputElement;
                //隐藏输入框
                egret.$callAsync(function () {
                    inputElement.style.opacity = 1;
                }, self);
            };
            /**
             * @private
             *
             * @param stageText
             */
            p.disconnectStageText = function (stageText) {
                if (this._stageText == null || this._stageText == stageText) {
                    this.clearInputElement();
                    if (this._inputElement) {
                        this._inputElement.blur();
                    }
                }
            };
            /**
             * @private
             *
             */
            p.clearInputElement = function () {
                var self = this;
                if (self._inputElement) {
                    self._inputElement.value = "";
                    self._inputElement.onblur = null;
                    self._inputElement.style.width = "1px";
                    self._inputElement.style.height = "12px";
                    self._inputElement.style.left = "0px";
                    self._inputElement.style.top = "0px";
                    self._inputElement.style.opacity = 0;
                    var otherElement;
                    if (self._simpleElement == self._inputElement) {
                        otherElement = self._multiElement;
                    }
                    else {
                        otherElement = self._simpleElement;
                    }
                    otherElement.style.display = "block";
                    self._inputDIV.style.left = 0 + "px";
                    self._inputDIV.style.top = "-100px";
                    self._inputDIV.style.height = 0 + "px";
                    self._inputDIV.style.width = 0 + "px";
                }
                if (self._stageText) {
                    self._stageText._onDisconnect();
                    self._stageText = null;
                    this.canvas['userTyping'] = false;
                }
            };
            /**
             * @private
             *
             * @param stageText
             * @returns
             */
            p.getInputElement = function (stageText) {
                var self = this;
                self.clearInputElement();
                self._stageText = stageText;
                this.canvas['userTyping'] = true;
                if (self._stageText.$textfield.multiline) {
                    self._inputElement = self._multiElement;
                }
                else {
                    self._inputElement = self._simpleElement;
                }
                var otherElement;
                if (self._simpleElement == self._inputElement) {
                    otherElement = self._multiElement;
                }
                else {
                    otherElement = self._simpleElement;
                }
                otherElement.style.display = "none";
                return self._inputElement;
            };
            return HTMLInput;
        }());
        web.HTMLInput = HTMLInput;
        egret.registerClass(HTMLInput,'egret.web.HTMLInput');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        var stageToTextLayerMap = {};
        var stageToCanvasMap = {};
        var stageToContainerMap = {};
        /**
         * @private
         * 获取
         */
        function $getTextAdapter(textfield) {
            var stageHash = textfield.stage ? textfield.stage.$hashCode : 0;
            var adapter = stageToTextLayerMap[stageHash];
            var canvas = stageToCanvasMap[stageHash];
            var container = stageToContainerMap[stageHash];
            if (canvas && container) {
                //adapter._initStageDelegateDiv(container, canvas);
                //adapter.$updateSize();
                delete stageToCanvasMap[stageHash];
                delete stageToContainerMap[stageHash];
            }
            return adapter;
        }
        web.$getTextAdapter = $getTextAdapter;
        /**
         * @private
         */
        function $cacheTextAdapter(adapter, stage, container, canvas) {
            adapter._initStageDelegateDiv(container, canvas);
            stageToTextLayerMap[stage.$hashCode] = adapter;
            stageToCanvasMap[stage.$hashCode] = canvas;
            stageToContainerMap[stage.$hashCode] = container;
        }
        web.$cacheTextAdapter = $cacheTextAdapter;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var context = null;
        /**
         * @private
         */
        var fontCache = {};
        /**
         * 测量文本在指定样式下的宽度。
         * @param text 要测量的文本内容。
         * @param fontFamily 字体名称
         * @param fontSize 字体大小
         * @param bold 是否粗体
         * @param italic 是否斜体
         */
        function measureText(text, fontFamily, fontSize, bold, italic) {
            if (!context) {
                createContext();
            }
            var font = "";
            if (italic)
                font += "italic ";
            if (bold)
                font += "bold ";
            font += (fontSize || 12) + "px ";
            font += (fontFamily || "Arial");
            var width = 0;
            var cache = fontCache[font] || (fontCache[font] = {});
            context.font = font;
            var length = text.length;
            for (var i = 0; i < length; i++) {
                var letter = text.charCodeAt(i);
                var w = cache[letter] || (cache[letter] = context.measureText(text.charAt(i)).width);
                width += w;
            }
            return width;
        }
        /**
         * @private
         */
        function createContext() {
            if (egret.Capabilities.renderMode == "canvas") {
                context = egret.sys.hitTestBuffer.context;
            }
            else {
                var canvas = document.createElement("canvas");
                context = canvas.getContext("2d");
            }
            context.textAlign = "left";
            context.textBaseline = "middle";
        }
        egret.sys.measureText = measureText;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * 创建一个canvas。
         */
        function createCanvas(width, height) {
            var canvas = document.createElement("canvas");
            if (!isNaN(width) && !isNaN(height)) {
                canvas.width = width;
                canvas.height = height;
            }
            egret.$toBitmapData(canvas);
            var context = canvas.getContext("2d");
            if (context["imageSmoothingEnabled"] === undefined) {
                var keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
                for (var i = keys.length - 1; i >= 0; i--) {
                    var key = keys[i];
                    if (context[key] !== void 0) {
                        break;
                    }
                }
                try {
                    Object.defineProperty(context, "imageSmoothingEnabled", {
                        get: function () {
                            return this[key];
                        },
                        set: function (value) {
                            this[key] = value;
                        }
                    });
                }
                catch (e) {
                    context["imageSmoothingEnabled"] = context[key];
                }
            }
            return canvas;
        }
        var sharedCanvas;
        /**
         * @private
         * Canvas2D渲染缓冲
         */
        var CanvasRenderBuffer = (function () {
            function CanvasRenderBuffer(width, height) {
                this.surface = createCanvas(width, height);
                this.context = this.surface.getContext("2d");
            }
            var d = __define,c=CanvasRenderBuffer,p=c.prototype;
            d(p, "width"
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                ,function () {
                    return this.surface.width;
                }
            );
            d(p, "height"
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                ,function () {
                    return this.surface.height;
                }
            );
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            p.resize = function (width, height, useMaxSize) {
                var surface = this.surface;
                if (useMaxSize) {
                    var change = false;
                    if (surface.width < width) {
                        surface.width = width;
                        change = true;
                    }
                    if (surface.height < height) {
                        surface.height = height;
                        change = true;
                    }
                    //尺寸没有变化时,将绘制属性重置
                    if (!change) {
                        this.context.globalCompositeOperation = "source-over";
                        this.context.setTransform(1, 0, 0, 1, 0, 0);
                        this.context.globalAlpha = 1;
                    }
                }
                else {
                    if (surface.width != width) {
                        surface.width = width;
                    }
                    if (surface.height != height) {
                        surface.height = height;
                    }
                }
                this.clear();
            };
            /**
             * 改变渲染缓冲为指定大小，但保留原始图像数据
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
             * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
             */
            p.resizeTo = function (width, height, offsetX, offsetY) {
                if (!sharedCanvas) {
                    sharedCanvas = createCanvas();
                }
                var oldContext = this.context;
                var oldSurface = this.surface;
                var newSurface = sharedCanvas;
                var newContext = newSurface.getContext("2d");
                sharedCanvas = oldSurface;
                this.context = newContext;
                this.surface = newSurface;
                newSurface.width = Math.max(width, 257);
                newSurface.height = Math.max(height, 257);
                newContext.setTransform(1, 0, 0, 1, 0, 0);
                newContext.drawImage(oldSurface, offsetX, offsetY);
                oldSurface.height = 1;
                oldSurface.width = 1;
            };
            p.setDirtyRegionPolicy = function (state) {
            };
            /**
             * 清空并设置裁切
             * @param regions 矩形列表
             * @param offsetX 矩形要加上的偏移量x
             * @param offsetY 矩形要加上的偏移量y
             */
            p.beginClip = function (regions, offsetX, offsetY) {
                offsetX = +offsetX || 0;
                offsetY = +offsetY || 0;
                var context = this.context;
                context.save();
                context.beginPath();
                context.setTransform(1, 0, 0, 1, offsetX, offsetY);
                var length = regions.length;
                for (var i = 0; i < length; i++) {
                    var region = regions[i];
                    context.clearRect(region.minX, region.minY, region.width, region.height);
                    context.rect(region.minX, region.minY, region.width, region.height);
                }
                context.clip();
            };
            /**
             * 取消上一次设置的clip。
             */
            p.endClip = function () {
                this.context.restore();
            };
            /**
             * 获取指定坐标的像素
             */
            p.getPixel = function (x, y) {
                return this.context.getImageData(x, y, 1, 1).data;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            p.toDataURL = function (type, encoderOptions) {
                return this.surface.toDataURL(type, encoderOptions);
            };
            /**
             * 清空缓冲区数据
             */
            p.clear = function () {
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.context.clearRect(0, 0, this.surface.width, this.surface.height);
            };
            /**
             * 销毁绘制对象
             */
            p.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            return CanvasRenderBuffer;
        }());
        web.CanvasRenderBuffer = CanvasRenderBuffer;
        egret.registerClass(CanvasRenderBuffer,'egret.web.CanvasRenderBuffer',["egret.sys.RenderBuffer"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided this the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebTouchHandler = (function (_super) {
            __extends(WebTouchHandler, _super);
            /**
             * @private
             */
            function WebTouchHandler(stage, canvas) {
                var _this = this;
                _super.call(this);
                /**
                 * @private
                 */
                this.onTouchBegin = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchBegin(location.x, location.y, event.identifier);
                };
                /**
                 * @private
                 */
                this.onTouchMove = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchMove(location.x, location.y, event.identifier);
                };
                /**
                 * @private
                 */
                this.onTouchEnd = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchEnd(location.x, location.y, event.identifier);
                };
                /**
                 * @private
                 */
                this.scaleX = 1;
                /**
                 * @private
                 */
                this.scaleY = 1;
                /**
                 * @private
                 */
                this.rotation = 0;
                this.canvas = canvas;
                this.touch = new egret.sys.TouchHandler(stage);
                this.addListeners();
            }
            var d = __define,c=WebTouchHandler,p=c.prototype;
            /**
             * @private
             * 添加事件监听
             */
            p.addListeners = function () {
                var _this = this;
                if (window.navigator.msPointerEnabled) {
                    this.canvas.addEventListener("MSPointerDown", function (event) {
                        event.identifier = event.pointerId;
                        _this.onTouchBegin(event);
                        _this.prevent(event);
                    }, false);
                    this.canvas.addEventListener("MSPointerMove", function (event) {
                        event.identifier = event.pointerId;
                        _this.onTouchMove(event);
                        _this.prevent(event);
                    }, false);
                    this.canvas.addEventListener("MSPointerUp", function (event) {
                        event.identifier = event.pointerId;
                        _this.onTouchEnd(event);
                        _this.prevent(event);
                    }, false);
                }
                else {
                    if (!egret.Capabilities.$isMobile) {
                        this.addMouseListener();
                    }
                    this.addTouchListener();
                }
            };
            /**
             * @private
             *
             */
            p.addMouseListener = function () {
                this.canvas.addEventListener("mousedown", this.onTouchBegin);
                this.canvas.addEventListener("mousemove", this.onTouchMove);
                this.canvas.addEventListener("mouseup", this.onTouchEnd);
            };
            /**
             * @private
             *
             */
            p.addTouchListener = function () {
                var _this = this;
                this.canvas.addEventListener("touchstart", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchBegin(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
                this.canvas.addEventListener("touchmove", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchMove(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
                this.canvas.addEventListener("touchend", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchEnd(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
                this.canvas.addEventListener("touchcancel", function (event) {
                    var l = event.changedTouches.length;
                    for (var i = 0; i < l; i++) {
                        _this.onTouchEnd(event.changedTouches[i]);
                    }
                    _this.prevent(event);
                }, false);
            };
            /**
             * @private
             */
            p.prevent = function (event) {
                event.stopPropagation();
                if (event["isScroll"] != true && !this.canvas['userTyping']) {
                    event.preventDefault();
                }
            };
            /**
             * @private
             */
            p.getLocation = function (event) {
                event.identifier = +event.identifier || 0;
                var doc = document.documentElement;
                var box = this.canvas.getBoundingClientRect();
                var left = box.left + window.pageXOffset - doc.clientLeft;
                var top = box.top + window.pageYOffset - doc.clientTop;
                var x = event.pageX - left, newx = x;
                var y = event.pageY - top, newy = y;
                if (this.rotation == 90) {
                    newx = y;
                    newy = box.width - x;
                }
                else if (this.rotation == -90) {
                    newx = box.height - y;
                    newy = x;
                }
                newx = newx / this.scaleX;
                newy = newy / this.scaleY;
                return egret.$TempPoint.setTo(Math.round(newx), Math.round(newy));
            };
            /**
             * @private
             * 更新屏幕当前的缩放比例，用于计算准确的点击位置。
             * @param scaleX 水平方向的缩放比例。
             * @param scaleY 垂直方向的缩放比例。
             */
            p.updateScaleMode = function (scaleX, scaleY, rotation) {
                this.scaleX = scaleX;
                this.scaleY = scaleY;
                this.rotation = rotation;
            };
            /**
             * @private
             * 更新同时触摸点的数量
             */
            p.$updateMaxTouches = function () {
                this.touch.$initMaxTouches();
            };
            return WebTouchHandler;
        }(egret.HashObject));
        web.WebTouchHandler = WebTouchHandler;
        egret.registerClass(WebTouchHandler,'egret.web.WebTouchHandler');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebHideHandler = (function (_super) {
            __extends(WebHideHandler, _super);
            /**
             * @private
             */
            function WebHideHandler(stage) {
                _super.call(this);
                /**
                 * @private
                 */
                this.isActivate = true;
                this.stage = stage;
                this.registerListener();
            }
            var d = __define,c=WebHideHandler,p=c.prototype;
            /**
             * @private
             *
             */
            p.registerListener = function () {
                var self = this;
                //失去焦点
                var onBlurHandler = function () {
                    if (!self.isActivate) {
                        return;
                    }
                    self.isActivate = false;
                    self.stage.dispatchEvent(new egret.Event(egret.Event.DEACTIVATE));
                };
                //激活
                var onFocusHandler = function () {
                    if (self.isActivate) {
                        return;
                    }
                    self.isActivate = true;
                    self.stage.dispatchEvent(new egret.Event(egret.Event.ACTIVATE));
                };
                var handleVisibilityChange = function () {
                    if (!document[hidden]) {
                        onFocusHandler();
                    }
                    else {
                        onBlurHandler();
                    }
                };
                window.addEventListener("focus", onFocusHandler, false);
                window.addEventListener("blur", onBlurHandler, false);
                var hidden, visibilityChange;
                if (typeof document.hidden !== "undefined") {
                    hidden = "hidden";
                    visibilityChange = "visibilitychange";
                }
                else if (typeof document["mozHidden"] !== "undefined") {
                    hidden = "mozHidden";
                    visibilityChange = "mozvisibilitychange";
                }
                else if (typeof document["msHidden"] !== "undefined") {
                    hidden = "msHidden";
                    visibilityChange = "msvisibilitychange";
                }
                else if (typeof document["webkitHidden"] !== "undefined") {
                    hidden = "webkitHidden";
                    visibilityChange = "webkitvisibilitychange";
                }
                else if (typeof document["oHidden"] !== "undefined") {
                    hidden = "oHidden";
                    visibilityChange = "ovisibilitychange";
                }
                if ("onpageshow" in window && "onpagehide" in window) {
                    window.addEventListener("pageshow", onFocusHandler, false);
                    window.addEventListener("pagehide", onBlurHandler, false);
                }
                if (hidden && visibilityChange) {
                    document.addEventListener(visibilityChange, handleVisibilityChange, false);
                }
                var ua = navigator.userAgent;
                var isWX = /micromessenger/gi.test(ua);
                var isQQBrowser = /mqq/ig.test(ua);
                var isQQ = /mobile.*qq/gi.test(ua);
                if (isQQ || isWX) {
                    isQQBrowser = false;
                }
                if (isQQBrowser) {
                    var browser = window["browser"] || {};
                    browser.execWebFn = browser.execWebFn || {};
                    browser.execWebFn.postX5GamePlayerMessage = function (event) {
                        var eventType = event.type;
                        if (eventType == "app_enter_background") {
                            onBlurHandler();
                        }
                        else if (eventType == "app_enter_foreground") {
                            onFocusHandler();
                        }
                    };
                    window["browser"] = browser;
                }
            };
            return WebHideHandler;
        }(egret.HashObject));
        web.WebHideHandler = WebHideHandler;
        egret.registerClass(WebHideHandler,'egret.web.WebHideHandler');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var AudioType = (function () {
            function AudioType() {
            }
            var d = __define,c=AudioType,p=c.prototype;
            /**
             * @private
             */
            AudioType.QQ_AUDIO = 1;
            /**
             * @private
             */
            AudioType.WEB_AUDIO = 2;
            /**
             * @private
             */
            AudioType.HTML5_AUDIO = 3;
            return AudioType;
        }());
        web.AudioType = AudioType;
        egret.registerClass(AudioType,'egret.web.AudioType');
        /**
         * @private
         */
        var SystemOSType = (function () {
            function SystemOSType() {
            }
            var d = __define,c=SystemOSType,p=c.prototype;
            /**
             * @private
             */
            SystemOSType.WPHONE = 1;
            /**
             * @private
             */
            SystemOSType.IOS = 2;
            /**
             * @private
             */
            SystemOSType.ADNROID = 3;
            return SystemOSType;
        }());
        web.SystemOSType = SystemOSType;
        egret.registerClass(SystemOSType,'egret.web.SystemOSType');
        /**
         * html5兼容性配置
         * @private
         */
        var Html5Capatibility = (function (_super) {
            __extends(Html5Capatibility, _super);
            /**
             * @private
             */
            function Html5Capatibility() {
                _super.call(this);
            }
            var d = __define,c=Html5Capatibility,p=c.prototype;
            /**
             * @private
             *
             */
            Html5Capatibility._init = function () {
                var ua = navigator.userAgent.toLowerCase();
                Html5Capatibility.ua = ua;
                egret.Capabilities.$isMobile = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
                Html5Capatibility._canUseBlob = false;
                Html5Capatibility._audioType = AudioType.HTML5_AUDIO;
                Html5Capatibility._AudioClass = egret.web.HtmlSound;
                Html5Capatibility._audioMustLoad = true;
                if (ua.indexOf("windows phone") >= 0) {
                    Html5Capatibility._System_OS = SystemOSType.WPHONE;
                    Html5Capatibility._audioMustLoad = false;
                    egret.Capabilities.$os = "Windows Phone";
                }
                else if (ua.indexOf("android") >= 0) {
                    Html5Capatibility._System_OS = SystemOSType.ADNROID;
                    if (ua.indexOf("ucbrowser") >= 0) {
                        Html5Capatibility._audioMustLoad = false;
                    }
                    egret.Capabilities.$os = "Android";
                    Html5Capatibility._System_OS = SystemOSType.ADNROID;
                    if (window.hasOwnProperty("QZAppExternal") && ua.indexOf("qzone") >= 0) {
                        Html5Capatibility._audioType = AudioType.QQ_AUDIO;
                        Html5Capatibility._AudioClass = egret.web.QQSound;
                        var bases = document.getElementsByTagName('base');
                        if (bases && bases.length > 0) {
                            Html5Capatibility._QQRootPath = bases[0]["baseURI"];
                        }
                        else {
                            var endIdx = window.location.href.indexOf("?");
                            if (endIdx == -1) {
                                endIdx = window.location.href.length;
                            }
                            var url = window.location.href.substring(0, endIdx);
                            url = url.substring(0, url.lastIndexOf("/"));
                            Html5Capatibility._QQRootPath = url + "/";
                        }
                    }
                }
                else if (ua.indexOf("iphone") >= 0 || ua.indexOf("ipad") >= 0 || ua.indexOf("ipod") >= 0) {
                    egret.Capabilities.$os = "iOS";
                    Html5Capatibility._System_OS = SystemOSType.IOS;
                    if (Html5Capatibility.getIOSVersion() >= 7) {
                        Html5Capatibility._canUseBlob = true;
                        Html5Capatibility._AudioClass = egret.web.WebAudioSound;
                        Html5Capatibility._audioType = AudioType.WEB_AUDIO;
                    }
                }
                else {
                    if (ua.indexOf("windows nt") != -1) {
                        egret.Capabilities.$os = "Windows PC";
                    }
                    else if (ua.indexOf("mac os") != -1) {
                        egret.Capabilities.$os = "Mac OS";
                    }
                }
                var winURL = window["URL"] || window["webkitURL"];
                if (!winURL) {
                    Html5Capatibility._canUseBlob = false;
                }
                var canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
                if (!canUseWebAudio && Html5Capatibility._audioType == AudioType.WEB_AUDIO) {
                    Html5Capatibility._audioType = AudioType.HTML5_AUDIO;
                    Html5Capatibility._AudioClass = egret.web.HtmlSound;
                }
                egret.Sound = Html5Capatibility._AudioClass;
            };
            /**
             * @private
             * 获取ios版本
             * @returns {string}
             */
            Html5Capatibility.getIOSVersion = function () {
                var value = Html5Capatibility.ua.toLowerCase().match(/cpu [^\d]*\d.*like mac os x/)[0];
                return parseInt(value.match(/\d(_\d)*/)[0]) || 0;
            };
            /**
             * @private
             *
             */
            Html5Capatibility.checkHtml5Support = function () {
                var language = (navigator.language || navigator.browserLanguage).toLowerCase();
                var strings = language.split("-");
                if (strings.length > 1) {
                    strings[1] = strings[1].toUpperCase();
                }
                egret.Capabilities.$language = strings.join("-");
            };
            //当前浏览器版本是否支持blob
            Html5Capatibility._canUseBlob = false;
            //当前浏览器版本是否支持webaudio
            Html5Capatibility._audioType = 0;
            Html5Capatibility._audioMustLoad = false;
            /**
             * @private
             */
            Html5Capatibility._QQRootPath = "";
            /**
             * @private
             */
            Html5Capatibility._System_OS = 0;
            /**
             * @private
             */
            Html5Capatibility.ua = "";
            return Html5Capatibility;
        }(egret.HashObject));
        web.Html5Capatibility = Html5Capatibility;
        egret.registerClass(Html5Capatibility,'egret.web.Html5Capatibility');
        Html5Capatibility._init();
        /**
         * @private
         */
        var currentPrefix = null;
        /**
         * @private
         */
        function getPrefixStyleName(name, element) {
            var header = "";
            if (element != null) {
                header = getPrefix(name, element);
            }
            else {
                if (currentPrefix == null) {
                    var tempStyle = document.createElement('div').style;
                    currentPrefix = getPrefix("transform", tempStyle);
                }
                header = currentPrefix;
            }
            if (header == "") {
                return name;
            }
            return header + name.charAt(0).toUpperCase() + name.substring(1, name.length);
        }
        web.getPrefixStyleName = getPrefixStyleName;
        /**
         * @private
         */
        function getPrefix(name, element) {
            if (name in element) {
                return "";
            }
            name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
            var transArr = ["webkit", "ms", "Moz", "O"];
            for (var i = 0; i < transArr.length; i++) {
                var tempStyle = transArr[i] + name;
                if (tempStyle in element) {
                    return transArr[i];
                }
            }
            return "";
        }
        web.getPrefix = getPrefix;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * 刷新所有Egret播放器的显示区域尺寸。仅当使用外部JavaScript代码动态修改了Egret容器大小时，需要手动调用此方法刷新显示区域。
         * 当网页尺寸发生改变时此方法会自动被调用。
         */
        function updateAllScreens() {
            if (!isRunning) {
                return;
            }
            var containerList = document.querySelectorAll(".egret-player");
            var length = containerList.length;
            for (var i = 0; i < length; i++) {
                var container = containerList[i];
                var player = container["egret-player"];
                player.updateScreenSize();
            }
        }
        var isRunning = false;
        /**
         * @private
         * 网页加载完成，实例化页面中定义的Egret标签
         */
        function runEgret(options) {
            if (isRunning) {
                return;
            }
            isRunning = true;
            if (!options) {
                options = {};
            }
            setRenderMode(options.renderMode);
            var ticker = egret.sys.$ticker;
            startTicker(ticker);
            if (options.screenAdapter) {
                egret.sys.screenAdapter = options.screenAdapter;
            }
            else if (!egret.sys.screenAdapter) {
                egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
            }
            var list = document.querySelectorAll(".egret-player");
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var container = list[i];
                var player = new web.WebPlayer(container, options);
                container["egret-player"] = player;
            }
        }
        /**
         * 设置渲染模式。"auto","webgl","canvas"
         * @param renderMode
         */
        function setRenderMode(renderMode) {
            if (renderMode == "webgl" && web.WebGLUtils.checkCanUseWebGL()) {
                egret.sys.RenderBuffer = web.WebGLRenderBuffer;
                egret.sys.systemRenderer = new web.WebGLRenderer();
                egret.sys.hitTestBuffer = new web.WebGLRenderBuffer(3, 3);
                //屏蔽掉cacheAsBitmap,webgl模式不能有太多的RenderContext
                egret.DisplayObject.prototype.$setHasDisplayList = function () { };
                egret.Capabilities.renderMode = "webgl";
            }
            else {
                egret.sys.RenderBuffer = web.CanvasRenderBuffer;
                egret.sys.systemRenderer = new egret.CanvasRenderer();
                egret.sys.hitTestBuffer = new web.CanvasRenderBuffer(3, 3);
                egret.Capabilities.renderMode = "canvas";
            }
        }
        /**
         * @private
         * 启动心跳计时器。
         */
        function startTicker(ticker) {
            var requestAnimationFrame = window["requestAnimationFrame"] ||
                window["webkitRequestAnimationFrame"] ||
                window["mozRequestAnimationFrame"] ||
                window["oRequestAnimationFrame"] ||
                window["msRequestAnimationFrame"];
            if (!requestAnimationFrame) {
                requestAnimationFrame = function (callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            }
            requestAnimationFrame.call(window, onTick);
            function onTick() {
                ticker.update();
                requestAnimationFrame.call(window, onTick);
            }
        }
        //覆盖原生的isNaN()方法实现，在不同浏览器上有2~10倍性能提升。
        window["isNaN"] = function (value) {
            value = +value;
            return value !== value;
        };
        egret.runEgret = runEgret;
        egret.updateAllScreens = updateAllScreens;
        var resizeTimer = NaN;
        function doResize() {
            resizeTimer = NaN;
            egret.updateAllScreens();
        }
        window.addEventListener("resize", function () {
            if (isNaN(resizeTimer)) {
                resizeTimer = window.setTimeout(doResize, 300);
            }
        });
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
if (DEBUG) {
    var language = navigator.language || navigator.browserLanguage || "en_US";
    language = language.replace("-", "_");
    if (language in egret.$locale_strings)
        egret.$language = language;
}
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebCapability = (function () {
            function WebCapability() {
            }
            var d = __define,c=WebCapability,p=c.prototype;
            /**
             * @private
             * 检测系统属性
             */
            WebCapability.detect = function () {
                var capabilities = egret.Capabilities;
                var ua = navigator.userAgent.toLowerCase();
                capabilities.$isMobile = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
                if (capabilities.$isMobile) {
                    if (ua.indexOf("windows") < 0 && (ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 || ua.indexOf("ipod") != -1)) {
                        capabilities.$os = "iOS";
                    }
                    else if (ua.indexOf("android") != -1 && ua.indexOf("linux") != -1) {
                        capabilities.$os = "Android";
                    }
                    else if (ua.indexOf("windows") != -1) {
                        capabilities.$os = "Windows Phone";
                    }
                }
                else {
                    if (ua.indexOf("windows nt") != -1) {
                        capabilities.$os = "Windows PC";
                    }
                    else if (ua.indexOf("mac os") != -1) {
                        capabilities.$os = "Mac OS";
                    }
                }
                var language = (navigator.language || navigator.browserLanguage).toLowerCase();
                var strings = language.split("-");
                if (strings.length > 1) {
                    strings[1] = strings[1].toUpperCase();
                }
                capabilities.$language = strings.join("-");
                WebCapability.injectUIntFixOnIE9();
            };
            WebCapability.injectUIntFixOnIE9 = function () {
                if (/msie 9.0/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                    var IEBinaryToArray_ByteStr_Script = "<!-- IEBinaryToArray_ByteStr -->\r\n" +
                        "<script type='text/vbscript' language='VBScript'>\r\n" +
                        "Function IEBinaryToArray_ByteStr(Binary)\r\n" +
                        "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n" +
                        "End Function\r\n" +
                        "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n" +
                        "   Dim lastIndex\r\n" +
                        "   lastIndex = LenB(Binary)\r\n" +
                        "   if lastIndex mod 2 Then\r\n" +
                        "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n" +
                        "   Else\r\n" +
                        "       IEBinaryToArray_ByteStr_Last = " + '""' + "\r\n" +
                        "   End If\r\n" +
                        "End Function\r\n" + "<\/script>\r\n" +
                        "<!-- convertResponseBodyToText -->\r\n" +
                        "<script>\r\n" +
                        "var convertResponseBodyToText = function (binary) {\r\n" +
                        "   var byteMapping = {};\r\n" +
                        "   for ( var i = 0; i < 256; i++ ) {\r\n" +
                        "       for ( var j = 0; j < 256; j++ ) {\r\n" +
                        "           byteMapping[ String.fromCharCode( i + j * 256 ) ] =\r\n" +
                        "           String.fromCharCode(i) + String.fromCharCode(j);\r\n" +
                        "       }\r\n" +
                        "   }\r\n" +
                        "   var rawBytes = IEBinaryToArray_ByteStr(binary);\r\n" +
                        "   var lastChr = IEBinaryToArray_ByteStr_Last(binary);\r\n" +
                        "   return rawBytes.replace(/[\\s\\S]/g," +
                        "                           function( match ) { return byteMapping[match]; }) + lastChr;\r\n" +
                        "};\r\n" +
                        "<\/script>\r\n";
                    document.write(IEBinaryToArray_ByteStr_Script);
                }
            };
            return WebCapability;
        }());
        web.WebCapability = WebCapability;
        egret.registerClass(WebCapability,'egret.web.WebCapability');
        WebCapability.detect();
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        function getOption(key) {
            if (window.location) {
                var search = location.search;
                if (search == "") {
                    return "";
                }
                search = search.slice(1);
                var searchArr = search.split("&");
                var length = searchArr.length;
                for (var i = 0; i < length; i++) {
                    var str = searchArr[i];
                    var arr = str.split("=");
                    if (arr[0] == key) {
                        return arr[1];
                    }
                }
            }
            return "";
        }
        web.getOption = getOption;
        egret.getOption = getOption;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebPlayer = (function (_super) {
            __extends(WebPlayer, _super);
            function WebPlayer(container, options) {
                _super.call(this);
                this.init(container, options);
                this.initOrientation();
            }
            var d = __define,c=WebPlayer,p=c.prototype;
            p.init = function (container, options) {
                var option = this.readOption(container, options);
                var stage = new egret.Stage();
                stage.$screen = this;
                stage.$scaleMode = option.scaleMode;
                stage.$orientation = option.orientation;
                stage.$maxTouches = option.maxTouches;
                stage.frameRate = option.frameRate;
                stage.textureScaleFactor = option.textureScaleFactor;
                var buffer = new egret.sys.RenderBuffer();
                var canvas = buffer.surface;
                this.attachCanvas(container, canvas);
                var webTouch = new web.WebTouchHandler(stage, canvas);
                var player = new egret.sys.Player(buffer, stage, option.entryClassName);
                var webHide = new egret.web.WebHideHandler(stage);
                var webInput = new web.HTMLInput();
                player.showPaintRect(option.showPaintRect);
                if (option.showFPS || option.showLog) {
                    player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
                }
                this.playerOption = option;
                this.container = container;
                this.canvas = canvas;
                this.stage = stage;
                this.stage = stage;
                this.player = player;
                this.webTouchHandler = webTouch;
                this.webInput = webInput;
                this.webHide = webHide;
                egret.web.$cacheTextAdapter(webInput, stage, container, canvas);
                this.updateScreenSize();
                this.updateMaxTouches();
                player.start();
            };
            p.initOrientation = function () {
                var self = this;
                window.addEventListener("orientationchange", function () {
                    window.setTimeout(function () {
                        egret.StageOrientationEvent.dispatchStageOrientationEvent(self.stage, egret.StageOrientationEvent.ORIENTATION_CHANGE);
                    }, 350);
                });
            };
            /**
             * 读取初始化参数
             */
            p.readOption = function (container, options) {
                var option = {};
                option.entryClassName = container.getAttribute("data-entry-class");
                option.scaleMode = container.getAttribute("data-scale-mode") || egret.StageScaleMode.NO_SCALE;
                option.frameRate = +container.getAttribute("data-frame-rate") || 30;
                option.contentWidth = +container.getAttribute("data-content-width") || 480;
                option.contentHeight = +container.getAttribute("data-content-height") || 800;
                option.orientation = container.getAttribute("data-orientation") || egret.OrientationMode.AUTO;
                option.maxTouches = +container.getAttribute("data-multi-fingered") || 2;
                option.textureScaleFactor = +container.getAttribute("texture-scale-factor") || 1;
                if (options.renderMode == "webgl") {
                    option.showPaintRect = false;
                }
                else {
                    option.showPaintRect = container.getAttribute("data-show-paint-rect") == "true";
                }
                option.showFPS = container.getAttribute("data-show-fps") == "true";
                var styleStr = container.getAttribute("data-show-fps-style") || "";
                var stylesArr = styleStr.split(",");
                var styles = {};
                for (var i = 0; i < stylesArr.length; i++) {
                    var tempStyleArr = stylesArr[i].split(":");
                    styles[tempStyleArr[0]] = tempStyleArr[1];
                }
                option.fpsStyles = styles;
                option.showLog = container.getAttribute("data-show-log") == "true";
                option.logFilter = container.getAttribute("data-log-filter");
                return option;
            };
            /**
             * @private
             * 添加canvas到container。
             */
            p.attachCanvas = function (container, canvas) {
                var style = canvas.style;
                style.cursor = "inherit";
                style.position = "absolute";
                style.top = "0";
                style.bottom = "0";
                style.left = "0";
                style.right = "0";
                container.appendChild(canvas);
                style = container.style;
                style.overflow = "hidden";
                style.position = "relative";
                style["webkitTransform"] = "translateZ(0)";
            };
            /**
             * @private
             * 更新播放器视口尺寸
             */
            p.updateScreenSize = function () {
                var canvas = this.canvas;
                if (canvas['userTyping'])
                    return;
                var option = this.playerOption;
                var screenRect = this.container.getBoundingClientRect();
                var shouldRotate = false;
                var orientation = this.stage.$orientation;
                if (orientation != egret.OrientationMode.AUTO) {
                    shouldRotate = orientation != egret.OrientationMode.PORTRAIT && screenRect.height > screenRect.width
                        || orientation == egret.OrientationMode.PORTRAIT && screenRect.width > screenRect.height;
                }
                var screenWidth = shouldRotate ? screenRect.height : screenRect.width;
                var screenHeight = shouldRotate ? screenRect.width : screenRect.height;
                var stageSize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode, screenWidth, screenHeight, option.contentWidth, option.contentHeight);
                var stageWidth = stageSize.stageWidth;
                var stageHeight = stageSize.stageHeight;
                var displayWidth = stageSize.displayWidth;
                var displayHeight = stageSize.displayHeight;
                if (canvas.width !== stageWidth) {
                    canvas.width = stageWidth;
                }
                if (canvas.height !== stageHeight) {
                    canvas.height = stageHeight;
                }
                canvas.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
                canvas.style.width = displayWidth + "px";
                canvas.style.height = displayHeight + "px";
                var rotation = 0;
                if (shouldRotate) {
                    if (orientation == egret.OrientationMode.LANDSCAPE) {
                        rotation = 90;
                        canvas.style.top = (screenRect.height - displayWidth) / 2 + "px";
                        canvas.style.left = (screenRect.width + displayHeight) / 2 + "px";
                    }
                    else {
                        rotation = -90;
                        canvas.style.top = (screenRect.height + displayWidth) / 2 + "px";
                        canvas.style.left = (screenRect.width - displayHeight) / 2 + "px";
                    }
                }
                else {
                    canvas.style.top = (screenRect.height - displayHeight) / 2 + "px";
                    canvas.style.left = (screenRect.width - displayWidth) / 2 + "px";
                }
                var transform = "rotate(" + rotation + "deg)";
                canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
                var scalex = displayWidth / stageWidth, scaley = displayHeight / stageHeight;
                this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
                this.webInput.$updateSize();
                this.player.updateStageSize(stageWidth, stageHeight); //不要在这个方法后面修改属性
            };
            p.setContentSize = function (width, height) {
                var option = this.playerOption;
                option.contentWidth = width;
                option.contentHeight = height;
                this.updateScreenSize();
            };
            /**
             * @private
             * 更新触摸数量
             */
            p.updateMaxTouches = function () {
                this.webTouchHandler.$updateMaxTouches();
            };
            return WebPlayer;
        }(egret.HashObject));
        web.WebPlayer = WebPlayer;
        egret.registerClass(WebPlayer,'egret.web.WebPlayer',["egret.sys.Screen"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var sharedCanvas;
        var sharedContext;
        /**
         * @private
         */
        function convertImageToCanvas(texture, rect) {
            if (!sharedCanvas) {
                sharedCanvas = document.createElement("canvas");
                sharedContext = sharedCanvas.getContext("2d");
            }
            var w = texture.$getTextureWidth();
            var h = texture.$getTextureHeight();
            if (rect == null) {
                rect = egret.$TempRectangle;
                rect.x = 0;
                rect.y = 0;
                rect.width = w;
                rect.height = h;
            }
            rect.x = Math.min(rect.x, w - 1);
            rect.y = Math.min(rect.y, h - 1);
            rect.width = Math.min(rect.width, w - rect.x);
            rect.height = Math.min(rect.height, h - rect.y);
            var iWidth = rect.width;
            var iHeight = rect.height;
            var surface = sharedCanvas;
            surface["style"]["width"] = iWidth + "px";
            surface["style"]["height"] = iHeight + "px";
            sharedCanvas.width = iWidth;
            sharedCanvas.height = iHeight;
            var bitmapData = texture;
            var offsetX = Math.round(bitmapData._offsetX);
            var offsetY = Math.round(bitmapData._offsetY);
            var bitmapWidth = bitmapData._bitmapWidth;
            var bitmapHeight = bitmapData._bitmapHeight;
            sharedContext.drawImage(bitmapData._bitmapData, bitmapData._bitmapX + rect.x / egret.$TextureScaleFactor, bitmapData._bitmapY + rect.y / egret.$TextureScaleFactor, bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
            return surface;
        }
        /**
         * @private
         */
        function toDataURL(type, rect) {
            try {
                var surface = convertImageToCanvas(this, rect);
                var result = surface.toDataURL(type);
                return result;
            }
            catch (e) {
                egret.$error(1033);
            }
            return null;
        }
        function saveToFile(type, filePath, rect) {
            var base64 = toDataURL.call(this, type, rect);
            if (base64 == null) {
                return;
            }
            var href = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
            var aLink = document.createElement('a');
            aLink['download'] = filePath;
            aLink.href = href;
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错
            aLink.dispatchEvent(evt);
        }
        function getPixel32(x, y) {
            var buffer = egret.sys.hitTestBuffer;
            buffer.resize(3, 3);
            var context = buffer.context;
            if (!context.translate) {
                context = buffer;
            }
            context.translate(1 - x, 1 - y);
            var width = this._bitmapWidth;
            var height = this._bitmapHeight;
            var scale = egret.$TextureScaleFactor;
            context.drawImage(this._bitmapData, this._bitmapX, this._bitmapY, width, this._bitmapHeight, this._offsetX, this._offsetY, width * scale, height * scale);
            if (context.$drawWebGL) {
                context.$drawWebGL();
            }
            try {
                var data = buffer.getPixel(1, 1);
            }
            catch (e) {
                console.log(this);
                throw new Error(egret.sys.tr(1039));
            }
            return data;
        }
        egret.Texture.prototype.toDataURL = toDataURL;
        egret.Texture.prototype.saveToFile = saveToFile;
        egret.Texture.prototype.getPixel32 = getPixel32;
        //销毁掉webgl纹理
        var originDispose = egret.Texture.prototype.dispose;
        egret.Texture.prototype.dispose = function () {
            web.WebGLUtils.deleteWebGLTexture(this._bitmapData);
            originDispose.call(this);
        };
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * XML节点基类
         */
        var XMLNode = (function () {
            /**
             * @private
             */
            function XMLNode(nodeType, parent) {
                this.nodeType = nodeType;
                this.parent = parent;
            }
            var d = __define,c=XMLNode,p=c.prototype;
            return XMLNode;
        }());
        web.XMLNode = XMLNode;
        egret.registerClass(XMLNode,'egret.web.XMLNode');
        /**
         * @private
         * XML节点对象
         */
        var XML = (function (_super) {
            __extends(XML, _super);
            /**
             * @private
             */
            function XML(localName, parent, prefix, namespace, name) {
                _super.call(this, 1, parent);
                /**
                 * @private
                 * 当前节点上的属性列表
                 */
                this.attributes = {};
                /**
                 * @private
                 * 当前节点的子节点列表
                 */
                this.children = [];
                this.localName = localName;
                this.prefix = prefix;
                this.namespace = namespace;
                this.name = name;
            }
            var d = __define,c=XML,p=c.prototype;
            return XML;
        }(XMLNode));
        web.XML = XML;
        egret.registerClass(XML,'egret.web.XML');
        /**
         * @private
         * XML文本节点
         */
        var XMLText = (function (_super) {
            __extends(XMLText, _super);
            /**
             * @private
             */
            function XMLText(text, parent) {
                _super.call(this, 3, parent);
                this.text = text;
            }
            var d = __define,c=XMLText,p=c.prototype;
            return XMLText;
        }(XMLNode));
        web.XMLText = XMLText;
        egret.registerClass(XMLText,'egret.web.XMLText');
        var parser = new DOMParser();
        /**
         * @private
         * 解析字符串为XML对象
         * @param text 要解析的字符串
         */
        function parse(text) {
            var xmlDoc = parser.parseFromString(text, "text/xml");
            var length = xmlDoc.childNodes.length;
            for (var i = 0; i < length; i++) {
                var node = xmlDoc.childNodes[i];
                if (node.nodeType == 1) {
                    return parseNode(node, null);
                }
            }
            return null;
        }
        /**
         * @private
         * 解析一个节点
         */
        function parseNode(node, parent) {
            if (node.localName == "parsererror") {
                throw new Error(node.textContent);
            }
            var xml = new XML(node.localName, parent, node.prefix, node.namespaceURI, node.nodeName);
            var nodeAttributes = node.attributes;
            var attributes = xml.attributes;
            var length = nodeAttributes.length;
            for (var i = 0; i < length; i++) {
                var attributeNode = nodeAttributes[i];
                var name = attributeNode.name;
                if (name.indexOf("xmlns:") == 0) {
                    continue;
                }
                attributes[name] = attributeNode.value;
                xml["$" + name] = attributeNode.value;
            }
            var childNodes = node.childNodes;
            length = childNodes.length;
            var children = xml.children;
            for (i = 0; i < length; i++) {
                var childNode = childNodes[i];
                var nodeType = childNode.nodeType;
                var childXML = null;
                if (nodeType == 1) {
                    childXML = parseNode(childNode, xml);
                }
                else if (nodeType == 3) {
                    var text = childNode.textContent.trim();
                    if (text) {
                        childXML = new XMLText(text, xml);
                    }
                }
                if (childXML) {
                    children.push(childXML);
                }
            }
            return xml;
        }
        egret.XML = { parse: parse };
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebDeviceOrientation = (function (_super) {
            __extends(WebDeviceOrientation, _super);
            function WebDeviceOrientation() {
                var _this = this;
                _super.apply(this, arguments);
                /**
                 * @private
                 */
                this.onChange = function (e) {
                    var event = new egret.OrientationEvent(egret.Event.CHANGE);
                    event.beta = e.beta;
                    event.gamma = e.gamma;
                    event.alpha = e.alpha;
                    _this.dispatchEvent(event);
                };
            }
            var d = __define,c=WebDeviceOrientation,p=c.prototype;
            /**
             * @private
             *
             */
            p.start = function () {
                window.addEventListener("deviceorientation", this.onChange);
            };
            /**
             * @private
             *
             */
            p.stop = function () {
                window.removeEventListener("deviceorientation", this.onChange);
            };
            return WebDeviceOrientation;
        }(egret.EventDispatcher));
        web.WebDeviceOrientation = WebDeviceOrientation;
        egret.registerClass(WebDeviceOrientation,'egret.web.WebDeviceOrientation',["egret.DeviceOrientation"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
egret.DeviceOrientation = egret.web.WebDeviceOrientation;
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebGeolocation = (function (_super) {
            __extends(WebGeolocation, _super);
            /**
             * @private
             */
            function WebGeolocation(option) {
                var _this = this;
                _super.call(this);
                /**
                 * @private
                 */
                this.onUpdate = function (position) {
                    var event = new egret.GeolocationEvent(egret.Event.CHANGE);
                    var coords = position.coords;
                    event.altitude = coords.altitude;
                    event.heading = coords.heading;
                    event.accuracy = coords.accuracy;
                    event.latitude = coords.latitude;
                    event.longitude = coords.longitude;
                    event.speed = coords.speed;
                    event.altitudeAccuracy = coords.altitudeAccuracy;
                    _this.dispatchEvent(event);
                };
                /**
                 * @private
                 */
                this.onError = function (error) {
                    var errorType = egret.GeolocationEvent.UNAVAILABLE;
                    if (error.code == error.PERMISSION_DENIED)
                        errorType = egret.GeolocationEvent.PERMISSION_DENIED;
                    var event = new egret.GeolocationEvent(egret.IOErrorEvent.IO_ERROR);
                    event.errorType = errorType;
                    event.errorMessage = error.message;
                    _this.dispatchEvent(event);
                };
                this.geolocation = navigator.geolocation;
            }
            var d = __define,c=WebGeolocation,p=c.prototype;
            /**
             * @private
             *
             */
            p.start = function () {
                var geo = this.geolocation;
                if (geo)
                    this.watchId = geo.watchPosition(this.onUpdate, this.onError);
                else
                    this.onError({
                        code: 2,
                        message: egret.sys.tr(3004),
                        PERMISSION_DENIED: 1,
                        POSITION_UNAVAILABLE: 2
                    });
            };
            /**
             * @private
             *
             */
            p.stop = function () {
                var geo = this.geolocation;
                geo.clearWatch(this.watchId);
            };
            return WebGeolocation;
        }(egret.EventDispatcher));
        web.WebGeolocation = WebGeolocation;
        egret.registerClass(WebGeolocation,'egret.web.WebGeolocation',["egret.Geolocation"]);
        egret.Geolocation = egret.web.WebGeolocation;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebMotion = (function (_super) {
            __extends(WebMotion, _super);
            function WebMotion() {
                var _this = this;
                _super.apply(this, arguments);
                /**
                 * @private
                 */
                this.onChange = function (e) {
                    var event = new egret.MotionEvent(egret.Event.CHANGE);
                    var acceleration = {
                        x: e.acceleration.x,
                        y: e.acceleration.y,
                        z: e.acceleration.z
                    };
                    var accelerationIncludingGravity = {
                        x: e.accelerationIncludingGravity.x,
                        y: e.accelerationIncludingGravity.y,
                        z: e.accelerationIncludingGravity.z
                    };
                    var rotation = {
                        alpha: e.rotationRate.alpha,
                        beta: e.rotationRate.beta,
                        gamma: e.rotationRate.gamma
                    };
                    event.acceleration = acceleration;
                    event.accelerationIncludingGravity = accelerationIncludingGravity;
                    event.rotationRate = rotation;
                    _this.dispatchEvent(event);
                };
            }
            var d = __define,c=WebMotion,p=c.prototype;
            /**
             * @private
             *
             */
            p.start = function () {
                window.addEventListener("devicemotion", this.onChange);
            };
            /**
             * @private
             *
             */
            p.stop = function () {
                window.removeEventListener("devicemotion", this.onChange);
            };
            return WebMotion;
        }(egret.EventDispatcher));
        web.WebMotion = WebMotion;
        egret.registerClass(WebMotion,'egret.web.WebMotion',["egret.Motion"]);
        egret.Motion = egret.web.WebMotion;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        if (DEBUG) {
            var logFuncs;
            function setLogLevel(logType) {
                if (logFuncs == null) {
                    logFuncs = {
                        "error": console.error,
                        "debug": console.debug,
                        "warn": console.warn,
                        "info": console.info,
                        "log": console.log
                    };
                }
                switch (logType) {
                    case egret.Logger.OFF:
                        console.error = function () {
                        };
                    case egret.Logger.ERROR:
                        console.warn = function () {
                        };
                    case egret.Logger.WARN:
                        console.info = function () {
                        };
                        console.log = function () {
                        };
                    case egret.Logger.INFO:
                        console.debug = function () {
                        };
                    default:
                        break;
                }
                switch (logType) {
                    case egret.Logger.ALL:
                    case egret.Logger.DEBUG:
                        console.debug = logFuncs["debug"];
                    case egret.Logger.INFO:
                        console.log = logFuncs["log"];
                        console.info = logFuncs["info"];
                    case egret.Logger.WARN:
                        console.warn = logFuncs["warn"];
                    case egret.Logger.ERROR:
                        console.error = logFuncs["error"];
                    default:
                        break;
                }
            }
            Object.defineProperty(egret.Logger, "logLevel", {
                set: setLogLevel,
                enumerable: true,
                configurable: true
            });
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WebGLUtils = (function () {
            function WebGLUtils() {
            }
            var d = __define,c=WebGLUtils,p=c.prototype;
            WebGLUtils.compileProgram = function (gl, vertexSrc, fragmentSrc) {
                var fragmentShader = WebGLUtils.compileFragmentShader(gl, fragmentSrc);
                var vertexShader = WebGLUtils.compileVertexShader(gl, vertexSrc);
                var shaderProgram = gl.createProgram();
                gl.attachShader(shaderProgram, vertexShader);
                gl.attachShader(shaderProgram, fragmentShader);
                gl.linkProgram(shaderProgram);
                if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                    egret.$warn(1020);
                }
                return shaderProgram;
            };
            WebGLUtils.compileFragmentShader = function (gl, shaderSrc) {
                return WebGLUtils._compileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
            };
            WebGLUtils.compileVertexShader = function (gl, shaderSrc) {
                return WebGLUtils._compileShader(gl, shaderSrc, gl.VERTEX_SHADER);
            };
            WebGLUtils._compileShader = function (gl, shaderSrc, shaderType) {
                var shader = gl.createShader(shaderType);
                gl.shaderSource(shader, shaderSrc);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    //egret.info(gl.getShaderInfoLog(shader));
                    return null;
                }
                return shader;
            };
            WebGLUtils.checkCanUseWebGL = function () {
                if (WebGLUtils.canUseWebGL == undefined) {
                    try {
                        var canvas = document.createElement("canvas");
                        WebGLUtils.canUseWebGL = !!window["WebGLRenderingContext"]
                            && !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
                    }
                    catch (e) {
                        WebGLUtils.canUseWebGL = false;
                    }
                }
                return WebGLUtils.canUseWebGL;
            };
            WebGLUtils.deleteWebGLTexture = function (bitmapData) {
                if (bitmapData) {
                    var webGLTexture = bitmapData.webGLTexture;
                    if (webGLTexture) {
                        for (var key in webGLTexture) {
                            var glTexture = webGLTexture[key];
                            var gl = glTexture.glContext;
                            gl.deleteTexture(glTexture);
                        }
                    }
                    bitmapData.webGLTexture = null;
                }
            };
            return WebGLUtils;
        }());
        web.WebGLUtils = WebGLUtils;
        egret.registerClass(WebGLUtils,'egret.web.WebGLUtils');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var EgretShader = (function () {
            function EgretShader(gl) {
                this.defaultVertexSrc = "attribute vec2 aVertexPosition;\n" +
                    "attribute vec2 aTextureCoord;\n" +
                    "attribute vec2 aColor;\n" +
                    "uniform vec2 projectionVector;\n" +
                    "uniform vec2 offsetVector;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "varying vec4 vColor;\n" +
                    "const vec2 center = vec2(-1.0, 1.0);\n" +
                    "void main(void) {\n" +
                    "   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);\n" +
                    "   vTextureCoord = aTextureCoord;\n" +
                    "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
                    "}";
                this.gl = null;
                this.program = null;
                this.fragmentSrc = "precision lowp float;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "varying vec4 vColor;\n" +
                    "uniform sampler2D uSampler;\n" +
                    "uniform float uPureColor;\n" +
                    "void main(void) {\n" +
                    "if(uPureColor == 1.0) {\n" +
                    "gl_FragColor = vColor ;\n" +
                    "} else {\n" +
                    "gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;\n" +
                    "}\n" +
                    "}";
                this.uniforms = null;
                this.gl = gl;
            }
            var d = __define,c=EgretShader,p=c.prototype;
            p.init = function () {
                var gl = this.gl;
                var program = web.WebGLUtils.compileProgram(gl, this.defaultVertexSrc, this.fragmentSrc);
                gl.useProgram(program);
                this.uSampler = gl.getUniformLocation(program, "uSampler");
                this.projectionVector = gl.getUniformLocation(program, "projectionVector");
                this.offsetVector = gl.getUniformLocation(program, "offsetVector");
                this.dimensions = gl.getUniformLocation(program, "dimensions");
                this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
                this.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
                this.colorAttribute = gl.getAttribLocation(program, "aColor");
                this.uPureColor = gl.getUniformLocation(program, "uPureColor");
                if (this.colorAttribute === -1) {
                    this.colorAttribute = 2;
                }
                this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];
                for (var key in this.uniforms) {
                    this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
                }
                this.initUniforms();
                this.program = program;
            };
            p.initUniforms = function () {
                if (!this.uniforms) {
                    return;
                }
                var gl = this.gl;
                var uniform;
                for (var key in this.uniforms) {
                    uniform = this.uniforms[key];
                    var type = uniform.type;
                    if (type === 'mat2' || type === 'mat3' || type === 'mat4') {
                        uniform.glMatrix = true;
                        uniform.glValueLength = 1;
                        if (type === 'mat2') {
                            uniform.glFunc = gl.uniformMatrix2fv;
                        }
                        else if (type === 'mat3') {
                            uniform.glFunc = gl.uniformMatrix3fv;
                        }
                        else if (type === 'mat4') {
                            uniform.glFunc = gl.uniformMatrix4fv;
                        }
                    }
                    else {
                        uniform.glFunc = gl['uniform' + type];
                        if (type === '2f' || type === '2i') {
                            uniform.glValueLength = 2;
                        }
                        else if (type === '3f' || type === '3i') {
                            uniform.glValueLength = 3;
                        }
                        else if (type === '4f' || type === '4i') {
                            uniform.glValueLength = 4;
                        }
                        else {
                            uniform.glValueLength = 1;
                        }
                    }
                }
            };
            p.syncUniforms = function () {
                if (!this.uniforms) {
                    return;
                }
                var uniform;
                var gl = this.gl;
                for (var key in this.uniforms) {
                    uniform = this.uniforms[key];
                    if (uniform.glValueLength === 1) {
                        if (uniform.glMatrix === true) {
                            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
                        }
                        else {
                            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
                        }
                    }
                    else if (uniform.glValueLength === 2) {
                        uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
                    }
                    else if (uniform.glValueLength === 3) {
                        uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
                    }
                    else if (uniform.glValueLength === 4) {
                        uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
                    }
                }
            };
            return EgretShader;
        }());
        web.EgretShader = EgretShader;
        egret.registerClass(EgretShader,'egret.web.EgretShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var PrimitiveShader = (function () {
            function PrimitiveShader(gl) {
                this.gl = null;
                this.program = null;
                this.projectionVector = null;
                this.offsetVector = null;
                this.tintColor = null;
                this.aVertexPosition = null;
                this.colorAttribute = null;
                this.attributes = null;
                this.translationMatrix = null;
                this.alpha = null;
                this.fragmentSrc = "precision mediump float;\n" +
                    "varying vec4 vColor;\n" +
                    "void main(void) {\n" +
                    "   gl_FragColor = vColor;\n" +
                    "}";
                this.vertexSrc = "attribute vec2 aVertexPosition;\n" +
                    "attribute vec4 aColor;\n" +
                    "uniform mat3 translationMatrix;\n" +
                    "uniform vec2 projectionVector;\n" +
                    "uniform vec2 offsetVector;\n" +
                    "uniform float alpha;\n" +
                    "uniform vec3 tint;\n" +
                    "varying vec4 vColor;\n" +
                    "void main(void) {\n" +
                    "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);\n" +
                    "   v -= offsetVector.xyx;\n" +
                    "   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);\n" +
                    "   vColor = aColor * vec4(tint * alpha, alpha);\n" +
                    "}";
                this.gl = gl;
                this.init();
            }
            var d = __define,c=PrimitiveShader,p=c.prototype;
            p.init = function () {
                var gl = this.gl;
                var program = web.WebGLUtils.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
                gl.useProgram(program);
                this.projectionVector = gl.getUniformLocation(program, "projectionVector");
                this.offsetVector = gl.getUniformLocation(program, "offsetVector");
                this.tintColor = gl.getUniformLocation(program, "tint");
                this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
                this.colorAttribute = gl.getAttribLocation(program, "aColor");
                this.attributes = [this.aVertexPosition, this.colorAttribute];
                this.translationMatrix = gl.getUniformLocation(program, "translationMatrix");
                this.alpha = gl.getUniformLocation(program, "alpha");
                this.program = program;
            };
            return PrimitiveShader;
        }());
        web.PrimitiveShader = PrimitiveShader;
        egret.registerClass(PrimitiveShader,'egret.web.PrimitiveShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var BlurShader = (function (_super) {
            __extends(BlurShader, _super);
            function BlurShader(gl) {
                _super.call(this, gl);
                this.fragmentSrc = "precision mediump float;" +
                    "uniform vec2 blur;" +
                    "uniform sampler2D uSampler;" +
                    "varying vec2 vTextureCoord;" +
                    "void main()" +
                    "{" +
                    "gl_FragColor = vec4(0.0);" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.028 * blur.x, -0.028 * blur.y))) * 0.0044299121055113265;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.024 * blur.x, -0.024 * blur.y))) * 0.00895781211794;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.020 * blur.x, -0.020 * blur.y))) * 0.0215963866053;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.016 * blur.x, -0.016 * blur.y))) * 0.0443683338718;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.012 * blur.x, -0.012 * blur.y))) * 0.0776744219933;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.008 * blur.x, -0.008 * blur.y))) * 0.115876621105;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2(-0.004 * blur.x, -0.004 * blur.y))) * 0.147308056121;" +
                    "gl_FragColor += texture2D(uSampler, vTextureCoord) * 0.159576912161;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.004 * blur.x,  0.004 * blur.y))) * 0.147308056121;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.008 * blur.x,  0.008 * blur.y))) * 0.115876621105;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.012 * blur.x,  0.012 * blur.y))) * 0.0776744219933;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.016 * blur.x,  0.016 * blur.y))) * 0.0443683338718;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.020 * blur.x,  0.020 * blur.y))) * 0.0215963866053;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.024 * blur.x,  0.024 * blur.y))) * 0.00895781211794;" +
                    "gl_FragColor += texture2D(uSampler, (vTextureCoord + vec2( 0.028 * blur.x,  0.028 * blur.y))) * 0.0044299121055113265;" +
                    "}";
                this.uniforms = {
                    blur: { type: '2f', value: { x: 2, y: 2 } }
                };
                this.init();
            }
            var d = __define,c=BlurShader,p=c.prototype;
            return BlurShader;
        }(web.EgretShader));
        web.BlurShader = BlurShader;
        egret.registerClass(BlurShader,'egret.web.BlurShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var ColorTransformShader = (function (_super) {
            __extends(ColorTransformShader, _super);
            function ColorTransformShader(gl) {
                _super.call(this, gl);
                this.fragmentSrc = "precision mediump float;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "varying vec4 vColor;\n" +
                    "uniform float invert;\n" +
                    "uniform mat4 matrix;\n" +
                    "uniform vec4 colorAdd;\n" +
                    "uniform sampler2D uSampler;\n" +
                    "void main(void) {\n" +
                    "vec4 texColor = texture2D(uSampler, vTextureCoord);\n" +
                    "vec4 locColor = texColor * matrix;\n" +
                    "if(texColor.a != 0.0){\n" +
                    "locColor += colorAdd;\n" +
                    "}\n" +
                    "gl_FragColor = vColor*vec4(locColor.rgb*locColor.a,locColor.a);\n" +
                    "}";
                this.uniforms = {
                    matrix: { type: 'mat4', value: [1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1] },
                    colorAdd: { type: '4f', value: { x: 0, y: 0, z: 0, w: 0 } }
                };
                this.init();
            }
            var d = __define,c=ColorTransformShader,p=c.prototype;
            return ColorTransformShader;
        }(web.EgretShader));
        web.ColorTransformShader = ColorTransformShader;
        egret.registerClass(ColorTransformShader,'egret.web.ColorTransformShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         *
         * @private
         */
        var WebGLShaderManager = (function () {
            function WebGLShaderManager(gl) {
                this.gl = null;
                this.maxAttibs = 10;
                this.attribState = [];
                this.tempAttribState = [];
                this.currentShader = null;
                this.defaultShader = null;
                this.primitiveShader = null;
                this.colorTransformShader = null;
                this.blurShader = null;
                for (var i = 0; i < this.maxAttibs; i++) {
                    this.attribState[i] = false;
                }
                this.setContext(gl);
            }
            var d = __define,c=WebGLShaderManager,p=c.prototype;
            p.setContext = function (gl) {
                this.gl = gl;
                this.primitiveShader = new web.PrimitiveShader(gl);
                this.defaultShader = new web.EgretShader(gl);
                this.defaultShader.init();
                this.colorTransformShader = new web.ColorTransformShader(gl);
                this.blurShader = new web.BlurShader(gl);
                this.activateShader(this.defaultShader);
            };
            p.activateShader = function (shader) {
                if (this.currentShader != shader) {
                    this.gl.useProgram(shader.program);
                    this.setAttribs(shader.attributes);
                    this.currentShader = shader;
                }
            };
            p.setAttribs = function (attribs) {
                var i;
                var l;
                l = this.tempAttribState.length;
                for (i = 0; i < l; i++) {
                    this.tempAttribState[i] = false;
                }
                l = attribs.length;
                for (i = 0; i < l; i++) {
                    var attribId = attribs[i];
                    this.tempAttribState[attribId] = true;
                }
                var gl = this.gl;
                l = this.attribState.length;
                for (i = 0; i < l; i++) {
                    if (this.attribState[i] !== this.tempAttribState[i]) {
                        this.attribState[i] = this.tempAttribState[i];
                        if (this.tempAttribState[i]) {
                            gl.enableVertexAttribArray(i);
                        }
                        else {
                            gl.disableVertexAttribArray(i);
                        }
                    }
                }
            };
            return WebGLShaderManager;
        }());
        web.WebGLShaderManager = WebGLShaderManager;
        egret.registerClass(WebGLShaderManager,'egret.web.WebGLShaderManager');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * WebGLRenderTarget
         * 一个WebGL渲染目标，拥有一个frame buffer和texture
         * A webgl render target, has a frame buffer and a texture
         */
        var WebGLRenderTarget = (function () {
            function WebGLRenderTarget(gl, width, height, useFrameBuffer) {
                if (useFrameBuffer === void 0) { useFrameBuffer = true; }
                this.gl = gl;
                // width and height cannot be 0, or webgl will throw a warn
                this.width = width || 1;
                this.height = height || 1;
                this.useFrameBuffer = useFrameBuffer;
                this.texture = this.createTexture();
                // create a frame buffer
                this.frameBuffer = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                // bind a texture to frame buffer, store color data
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
                // bind a stencil buffer to frame buffer, store stencil data
                this.stencilBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
            var d = __define,c=WebGLRenderTarget,p=c.prototype;
            /**
             * resize this render target, this will cause render target unbind
             */
            p.resize = function (width, height) {
                var gl = this.gl;
                this.width = width || 1;
                this.height = height || 1;
                // resize texture
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
                // resize renderbuffer
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
                // cause frame buffer unbind!!!
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            };
            // if dont use frame buffer, get frame buffer will return null
            // so gl will bind frame buffer with a null
            p.getFrameBuffer = function () {
                if (!this.useFrameBuffer) {
                    return null;
                }
                return this.frameBuffer;
            };
            /**
             * create a texture
             */
            p.createTexture = function () {
                var gl = this.gl;
                var texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                // set width and height, cannot be 0
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
                return texture;
            };
            return WebGLRenderTarget;
        }());
        web.WebGLRenderTarget = WebGLRenderTarget;
        egret.registerClass(WebGLRenderTarget,'egret.web.WebGLRenderTarget');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * 创建一个canvas。
         */
        function createCanvas(width, height) {
            var canvas = document.createElement("canvas");
            if (!isNaN(width) && !isNaN(height)) {
                canvas.width = width;
                canvas.height = height;
            }
            egret.$toBitmapData(canvas);
            return canvas;
        }
        /**
         * @private
         * WebGL渲染器
         */
        var WebGLRenderBuffer = (function () {
            function WebGLRenderBuffer(width, height) {
                // dirtyRegionPolicy hack
                this.dirtyRegionPolicy = true;
                this._dirtyRegionPolicy = true; // 默认设置为true，保证第一帧绘制在frameBuffer上
                this.glID = null;
                this.size = 2000;
                this.vertices = null;
                this.vertSize = 5;
                this.indices = null;
                this.projectionX = NaN;
                this.projectionY = NaN;
                this.shaderManager = null;
                this.contextLost = false;
                this.currentBaseTexture = null;
                this.currentBatchSize = 0;
                this.drawData = [];
                this.$drawCalls = 0;
                this.$computeDrawCall = false;
                this.globalMatrix = new egret.Matrix();
                this.savedGlobalMatrix = new egret.Matrix();
                this._globalAlpha = 1;
                this.$stencilList = [];
                this.stencilHandleCount = 0;
                //todo 抽取出一个WebglRenderContext
                this.surface = createCanvas(width, height);
                this.initWebGL();
                this.rootRenderTarget = new web.WebGLRenderTarget(this.context, this.surface.width, this.surface.height);
                // set render target, default is rootRenderTarget
                this.currentRenderTarget = this.rootRenderTarget;
                this.rebindRenderTarget();
            }
            var d = __define,c=WebGLRenderBuffer,p=c.prototype;
            /**
             * create a render target
             * 创建一个渲染目标，外界只允许通过此方法创建render target，创建的render target只适用于当前的render buffer
             */
            p.createRenderTarget = function () {
                var renderTarget = new web.WebGLRenderTarget(this.context, this.surface.width, this.surface.height);
                // create render target cause current render target unbind, so rebind render target
                this.rebindRenderTarget();
                return renderTarget;
            };
            /**
             * set render target to another one
             * 切换渲染目标
             */
            p.setRenderTarget = function (renderTarget) {
                this.currentRenderTarget = renderTarget;
                this.rebindRenderTarget();
            };
            /**
             * reset render target to rootRenderTarget
             * 重置渲染目标
             */
            p.resetRenderTarget = function () {
                this.currentRenderTarget = this.rootRenderTarget;
                this.rebindRenderTarget();
            };
            /**
             * rebind render target
             * 重新绑定渲染目标
             */
            p.rebindRenderTarget = function () {
                var gl = this.context;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.currentRenderTarget.getFrameBuffer());
            };
            d(p, "width"
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                ,function () {
                    return this.surface.width;
                }
            );
            d(p, "height"
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                ,function () {
                    return this.surface.height;
                }
            );
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            p.resize = function (width, height, useMaxSize) {
                var surface = this.surface;
                if (useMaxSize) {
                    if (surface.width < width) {
                        surface.width = width;
                    }
                    if (surface.height < height) {
                        surface.height = height;
                    }
                }
                else {
                    if (surface.width != width) {
                        surface.width = width;
                    }
                    if (surface.height != height) {
                        surface.height = height;
                    }
                }
                this.currentRenderTarget.resize(this.surface.width, this.surface.height);
                // resize func will unbind the frame buffer, so rebind it
                this.rebindRenderTarget();
                this.onResize();
                this.clear();
            };
            /**
             * 改变渲染缓冲为指定大小，但保留原始图像数据
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
             * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
             */
            p.resizeTo = function (width, height, offsetX, offsetY) {
                var oldSurface = this.surface;
                var oldWidth = oldSurface.width;
                var oldHeight = oldSurface.height;
                this.surface.width = width;
                this.surface.height = height;
                // TODO is this a bug? maybe frame buffer has no data if frame buffer is not used
                this.drawFrameBufferToSurface(0, 0, oldWidth, oldHeight, offsetX, offsetY, oldWidth, oldHeight, true);
            };
            p.setDirtyRegionPolicy = function (state) {
                this.dirtyRegionPolicy = (state == "on");
            };
            /**
             * 清空并设置裁切
             * @param regions 矩形列表
             * @param offsetX 矩形要加上的偏移量x
             * @param offsetY 矩形要加上的偏移量y
             */
            p.beginClip = function (regions, offsetX, offsetY) {
                // dirtyRegionPolicy hack
                if (this._dirtyRegionPolicy) {
                    this.rootRenderTarget.useFrameBuffer = true;
                    this.rebindRenderTarget();
                }
                else {
                    this.rootRenderTarget.useFrameBuffer = false;
                    this.rebindRenderTarget();
                    this.clear();
                }
                offsetX = +offsetX || 0;
                offsetY = +offsetY || 0;
                this.setTransform(1, 0, 0, 1, offsetX, offsetY);
                var length = regions.length;
                //只有一个区域且刚好为舞台大小时,不设置模板
                if (length == 1 && regions[0].minX == 0 && regions[0].minY == 0 &&
                    regions[0].width == this.surface.width && regions[0].height == this.surface.height) {
                    this.maskPushed = false;
                    this.rootRenderTarget.useFrameBuffer && this.clear();
                    return;
                }
                // 擦除脏矩形区域
                for (var i = 0; i < length; i++) {
                    var region = regions[i];
                    this.clearRect(region.minX, region.minY, region.width, region.height);
                }
                // 设置模版
                if (length > 0) {
                    this.pushMask(regions);
                    this.maskPushed = true;
                    this.offsetX = offsetX;
                    this.offsetY = offsetY;
                }
                else {
                    this.maskPushed = false;
                }
            };
            /**
             * 取消上一次设置的clip。
             */
            p.endClip = function () {
                if (this.maskPushed) {
                    this.setTransform(1, 0, 0, 1, this.offsetX, this.offsetY);
                    this.popMask();
                }
            };
            /**
             * 获取指定坐标的像素
             */
            p.getPixel = function (x, y) {
                var gl = this.context;
                var pixels = new Uint8Array(4);
                var useFrameBuffer = this.currentRenderTarget.useFrameBuffer;
                this.currentRenderTarget.useFrameBuffer = true;
                this.rebindRenderTarget();
                gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                // restore the state of currentRenderTarget
                this.currentRenderTarget.useFrameBuffer = useFrameBuffer;
                this.rebindRenderTarget();
                return pixels;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            p.toDataURL = function (type, encoderOptions) {
                return this.surface.toDataURL(type, encoderOptions);
            };
            /**
             * 清空缓冲区数据
             */
            p.clear = function () {
                if (this.surface.width != 0 && this.surface.height != 0) {
                    var gl = this.context;
                    gl.colorMask(true, true, true, true);
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                }
            };
            /**
             * @private
             */
            p.clearRect = function (x, y, width, height) {
                this.setGlobalCompositeOperation("destination-out");
                this.drawRect(x, y, width, height);
                this.setGlobalCompositeOperation("source-over");
            };
            /**
             * 销毁绘制对象
             */
            p.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            p.onResize = function () {
                this.projectionX = this.surface.width / 2;
                this.projectionY = -this.surface.height / 2;
                if (this.context) {
                    this.context.viewport(0, 0, this.surface.width, this.surface.height);
                }
            };
            p.initWebGL = function () {
                this.onResize();
                this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
                this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);
                var numVerts = this.size * 4 * this.vertSize;
                var numIndices = this.size * 6;
                this.vertices = new Float32Array(numVerts);
                this.indices = new Uint16Array(numIndices);
                for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
                    this.indices[i + 0] = j + 0;
                    this.indices[i + 1] = j + 1;
                    this.indices[i + 2] = j + 2;
                    this.indices[i + 3] = j + 0;
                    this.indices[i + 4] = j + 2;
                    this.indices[i + 5] = j + 3;
                }
                this.getWebGLContext();
                this.shaderManager = new web.WebGLShaderManager(this.context);
            };
            p.handleContextLost = function () {
                this.contextLost = true;
            };
            p.handleContextRestored = function () {
                this.initWebGL();
                //this.shaderManager.setContext(this.context);
                this.contextLost = false;
            };
            p.getWebGLContext = function () {
                var options = {
                    stencil: true //设置可以使用模板（用于不规则遮罩）
                };
                var gl;
                //todo 是否使用chrome源码names
                //var contextNames = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl", "3d"];
                var names = ["webgl", "experimental-webgl"];
                for (var i = 0; i < names.length; i++) {
                    try {
                        gl = this.surface.getContext(names[i], options);
                    }
                    catch (e) {
                    }
                    if (gl) {
                        break;
                    }
                }
                if (!gl) {
                    egret.$error(1021);
                }
                this.setContext(gl);
                this.setGlobalCompositeOperation("source-over");
            };
            p.setContext = function (gl) {
                this.context = gl;
                gl.id = WebGLRenderBuffer.glContextId++;
                this.glID = gl.id;
                this.vertexBuffer = gl.createBuffer();
                this.indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.CULL_FACE);
                gl.enable(gl.BLEND);
                gl.colorMask(true, true, true, true);
            };
            //Rendering Functions begin
            p.drawImage = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight) {
                if (this.contextLost) {
                    return;
                }
                if (!texture) {
                    return;
                }
                //if (this.filters) {
                //    for (var i = 0; i < 1; i++) {
                //        var filter:Filter = this.filters[0];
                //        if (filter.type == "glow") {
                //            this.useGlow(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                //            return;
                //        }
                //    }
                //}
                this.createWebGLTexture(texture);
                var webGLTexture = texture["webGLTexture"][this.glID];
                if (!webGLTexture) {
                    return;
                }
                this.drawTexture(webGLTexture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight);
            };
            /**
             * @private
             * draw a texture use default shader
             * */
            p.drawTexture = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight) {
                if (this.contextLost) {
                    return;
                }
                if (!texture) {
                    return;
                }
                var webGLTexture = texture;
                if (this.currentBatchSize >= this.size - 1) {
                    this.$drawWebGL();
                    this.currentBaseTexture = webGLTexture;
                    this.drawData.push({ type: 0 /* TEXTURE */, texture: this.currentBaseTexture, count: 0 });
                }
                else if (webGLTexture !== this.currentBaseTexture) {
                    this.currentBaseTexture = webGLTexture;
                    this.drawData.push({ type: 0 /* TEXTURE */, texture: this.currentBaseTexture, count: 0 });
                }
                this.drawUvRect(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight);
                this.currentBatchSize++;
                this.drawData[this.drawData.length - 1].count++;
            };
            /**
             * @private
             * draw a rect use default shader
             * */
            p.drawRect = function (x, y, width, height) {
                if (this.contextLost) {
                    return;
                }
                // TODO if needed, this rect can set a color
                if (this.currentBatchSize >= this.size - 1) {
                    this.$drawWebGL();
                    this.drawData.push({ type: 1 /* RECT */, rect: 1, count: 0 });
                }
                else if (this.drawData.length > 1 && this.drawData[this.drawData.length - 2].rect) {
                }
                else {
                    this.drawData.push({ type: 1 /* RECT */, rect: 1, count: 0 });
                }
                this.drawUvRect(0, 0, width, height, x, y, width, height, width, height);
                this.currentBatchSize++;
                this.drawData[this.drawData.length - 1].count++;
                this.currentBaseTexture = null;
            };
            /**
             * @private
             * draw a rect with uv attribute, just push vertices datas to array
             * */
            p.drawUvRect = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight) {
                var textureSourceWidth = textureWidth;
                var textureSourceHeight = textureHeight;
                //计算出绘制矩阵，之后把矩阵还原回之前的
                var locWorldTransform = this.globalMatrix;
                var originalA = locWorldTransform.a;
                var originalB = locWorldTransform.b;
                var originalC = locWorldTransform.c;
                var originalD = locWorldTransform.d;
                var originalTx = locWorldTransform.tx;
                var originalTy = locWorldTransform.ty;
                if (destX != 0 || destY != 0) {
                    locWorldTransform.append(1, 0, 0, 1, destX, destY);
                }
                if (sourceWidth / destWidth != 1 || sourceHeight / destHeight != 1) {
                    locWorldTransform.append(destWidth / sourceWidth, 0, 0, destHeight / sourceHeight, 0, 0);
                }
                var a = locWorldTransform.a;
                var b = locWorldTransform.b;
                var c = locWorldTransform.c;
                var d = locWorldTransform.d;
                var tx = locWorldTransform.tx;
                var ty = locWorldTransform.ty;
                locWorldTransform.a = originalA;
                locWorldTransform.b = originalB;
                locWorldTransform.c = originalC;
                locWorldTransform.d = originalD;
                locWorldTransform.tx = originalTx;
                locWorldTransform.ty = originalTy;
                var width = textureSourceWidth;
                var height = textureSourceHeight;
                var w = sourceWidth;
                var h = sourceHeight;
                sourceX = sourceX / width;
                sourceY = sourceY / height;
                sourceWidth = sourceWidth / width;
                sourceHeight = sourceHeight / height;
                var vertices = this.vertices;
                var index = this.currentBatchSize * 4 * this.vertSize;
                var alpha = this._globalAlpha;
                // xy
                vertices[index++] = tx;
                vertices[index++] = ty;
                // uv
                vertices[index++] = sourceX;
                vertices[index++] = sourceY;
                // alpha
                vertices[index++] = alpha;
                // xy
                vertices[index++] = a * w + tx;
                vertices[index++] = b * w + ty;
                // uv
                vertices[index++] = sourceWidth + sourceX;
                vertices[index++] = sourceY;
                // alpha
                vertices[index++] = alpha;
                // xy
                vertices[index++] = a * w + c * h + tx;
                vertices[index++] = d * h + b * w + ty;
                // uv
                vertices[index++] = sourceWidth + sourceX;
                vertices[index++] = sourceHeight + sourceY;
                // alpha
                vertices[index++] = alpha;
                // xy
                vertices[index++] = c * h + tx;
                vertices[index++] = d * h + ty;
                // uv
                vertices[index++] = sourceX;
                vertices[index++] = sourceHeight + sourceY;
                // alpha
                vertices[index++] = alpha;
            };
            p.$drawWebGL = function () {
                if ((this.currentBatchSize == 0 && this.drawData.length == 0) || this.contextLost) {
                    return;
                }
                this.start();
                // update the vertices data
                var gl = this.context;
                var view = this.vertices.subarray(0, this.currentBatchSize * 4 * this.vertSize);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
                var length = this.drawData.length;
                var offset = 0;
                for (var i = 0; i < length; i++) {
                    var data = this.drawData[i];
                    switch (data.type) {
                        case 0 /* TEXTURE */:
                            offset += this.drawTextureElements(data, offset);
                            break;
                        case 1 /* RECT */:
                            offset += this.drawRectElements(data, offset);
                            break;
                        case 2 /* PUSH_MASK */:
                            offset += this.drawPushMaskElements(data, offset);
                            break;
                        case 3 /* POP_MASK */:
                            offset += this.drawPopMaskElements(data, offset);
                            break;
                        case 4 /* BLEND */:
                            var blendModeWebGL = WebGLRenderBuffer.blendModesForGL[data.value];
                            if (blendModeWebGL) {
                                this.context.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                            }
                            break;
                        default:
                            break;
                    }
                    // add drawCall except blend type
                    if (data.type != 4 /* BLEND */) {
                        if (this.$computeDrawCall) {
                            this.$drawCalls++;
                        }
                    }
                }
                // flush draw data
                this.drawData.length = 0;
                this.currentBatchSize = 0;
                this.currentBaseTexture = null;
            };
            p.start = function () {
                if (this.contextLost) {
                    return;
                }
                var gl = this.context;
                gl.activeTexture(gl.TEXTURE0);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                var shader;
                if (this.filterType == "colorTransform") {
                    shader = this.shaderManager.colorTransformShader;
                }
                else if (this.filterType == "blur") {
                    shader = this.shaderManager.blurShader;
                }
                else {
                    shader = this.shaderManager.defaultShader;
                }
                this.shaderManager.activateShader(shader);
                shader.syncUniforms();
                gl.uniform2f(shader.projectionVector, this.projectionX, this.projectionY);
                // set the default shader to draw texture model
                this.switchDrawingTextureState(true);
                var stride = this.vertSize * 4;
                gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
                gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
                gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, stride, 4 * 4);
            };
            p.createWebGLTexture = function (texture) {
                var bitmapData = texture;
                if (!bitmapData.webGLTexture) {
                    bitmapData.webGLTexture = {};
                }
                if (!bitmapData.webGLTexture[this.glID]) {
                    var glTexture = this.createTexture(bitmapData);
                    bitmapData.webGLTexture[this.glID] = glTexture;
                }
            };
            // 创建一个材质，并返回，只供外部引用，内部无引用
            p.createTexture = function (bitmapData) {
                var gl = this.context;
                var glTexture = gl.createTexture();
                if (!glTexture) {
                    //先创建texture失败,然后lost事件才发出来..
                    this.contextLost = true;
                    return;
                }
                glTexture.glContext = gl;
                gl.bindTexture(gl.TEXTURE_2D, glTexture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_2D, null);
                return glTexture;
            };
            p.onRenderFinish = function () {
                this.$drawCalls = 0;
                // if used for render a render target, this is not need
                if (this.currentRenderTarget == this.rootRenderTarget) {
                    // dirtyRegionPolicy hack
                    if (!this._dirtyRegionPolicy && this.dirtyRegionPolicy) {
                        this.drawSurfaceToFrameBuffer(0, 0, this.surface.width, this.surface.height, 0, 0, this.surface.width, this.surface.height, true);
                    }
                    if (this._dirtyRegionPolicy) {
                        this.drawFrameBufferToSurface(0, 0, this.surface.width, this.surface.height, 0, 0, this.surface.width, this.surface.height);
                    }
                    this._dirtyRegionPolicy = this.dirtyRegionPolicy;
                }
            };
            /**
             * 交换frameBuffer中的图像到surface中
             * @param width 宽度
             * @param height 高度
             */
            p.drawFrameBufferToSurface = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                var gl = this.context;
                this.currentRenderTarget.useFrameBuffer = false;
                this.rebindRenderTarget();
                gl.disable(gl.STENCIL_TEST); // 切换frameBuffer注意要禁用STENCIL_TEST
                this.globalMatrix.setTo(1, 0, 0, -1, 0, this.surface.height); // 翻转,因为从frameBuffer中读出的图片是正的
                this._globalAlpha = 1;
                this.setGlobalCompositeOperation("source-over");
                clear && this.clear();
                this.drawTexture(this.currentRenderTarget.texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
                this.$drawWebGL();
                this.currentRenderTarget.useFrameBuffer = true;
                this.rebindRenderTarget();
                if (this.maskPushed) {
                    gl.enable(gl.STENCIL_TEST);
                }
            };
            /**
             * 交换surface的图像到frameBuffer中
             * @param width 宽度
             * @param height 高度
             */
            p.drawSurfaceToFrameBuffer = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                var gl = this.context;
                this.currentRenderTarget.useFrameBuffer = true;
                this.rebindRenderTarget();
                gl.disable(gl.STENCIL_TEST); // 切换frameBuffer注意要禁用STENCIL_TEST
                this.globalMatrix.setTo(1, 0, 0, 1, 0, 0);
                this._globalAlpha = 1;
                this.setGlobalCompositeOperation("source-over");
                clear && this.clear();
                this.drawImage(this.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
                this.$drawWebGL();
                this.currentRenderTarget.useFrameBuffer = false;
                this.rebindRenderTarget();
                if (this.maskPushed) {
                    gl.enable(gl.STENCIL_TEST);
                }
            };
            p.setTransform = function (a, b, c, d, tx, ty) {
                this.globalMatrix.setTo(a, b, c, d, tx, ty);
            };
            p.transform = function (a, b, c, d, tx, ty) {
                this.globalMatrix.append(a, b, c, d, tx, ty);
            };
            p.translate = function (dx, dy) {
                this.globalMatrix.translate(dx, dy);
            };
            p.saveTransform = function () {
                this.savedGlobalMatrix.copyFrom(this.globalMatrix);
            };
            p.restoreTransform = function () {
                this.globalMatrix.copyFrom(this.savedGlobalMatrix);
            };
            p.setGlobalAlpha = function (value) {
                this._globalAlpha = value;
            };
            p.setGlobalCompositeOperation = function (value) {
                if (this.currentBlendMode != value) {
                    this.drawData.push({ type: 4 /* BLEND */, value: value });
                    this.currentBlendMode = value;
                    this.currentBaseTexture = null;
                }
            };
            p.pushMask = function (mask) {
                // TODO mask count
                this.$stencilList.push(mask);
                if (this.currentBatchSize >= this.size - 1) {
                    this.$drawWebGL();
                    this.drawData.push({ type: 2 /* PUSH_MASK */, pushMask: mask, count: 0 });
                }
                else {
                    this.drawData.push({ type: 2 /* PUSH_MASK */, pushMask: mask, count: 0 });
                }
                this.drawMask(mask);
                this.currentBaseTexture = null;
            };
            p.popMask = function () {
                // TODO mask count
                var mask = this.$stencilList.pop();
                if (this.currentBatchSize >= this.size - 1) {
                    this.$drawWebGL();
                    this.drawData.push({ type: 3 /* POP_MASK */, popMask: mask, count: 0 });
                }
                else {
                    this.drawData.push({ type: 3 /* POP_MASK */, popMask: mask, count: 0 });
                }
                this.drawMask(mask);
                this.currentBaseTexture = null;
            };
            /**
             * @private
             * draw masks with default shader
             **/
            p.drawMask = function (mask) {
                if (this.contextLost) {
                    return;
                }
                var length = mask.length;
                if (length) {
                    for (var i = 0; i < length; i++) {
                        var item = mask[i];
                        this.drawUvRect(0, 0, item.width, item.height, item.minX, item.minY, item.width, item.height, item.width, item.height);
                        this.currentBatchSize++;
                        this.drawData[this.drawData.length - 1].count++;
                    }
                }
                else {
                    this.drawUvRect(0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
                    this.currentBatchSize++;
                    this.drawData[this.drawData.length - 1].count++;
                }
            };
            p.switchDrawingTextureState = function (state) {
                if (state == this.drawingTexture) {
                    return;
                }
                var gl = this.context;
                var shader = this.shaderManager.defaultShader;
                if (state) {
                    gl.uniform1f(shader.uPureColor, 0.0);
                }
                else {
                    gl.uniform1f(shader.uPureColor, 1.0);
                }
                this.drawingTexture = state;
            };
            /**
             * @private
             * draw texture elements
             **/
            p.drawTextureElements = function (data, offset) {
                this.switchDrawingTextureState(true);
                var gl = this.context;
                gl.bindTexture(gl.TEXTURE_2D, data.texture);
                var size = data.count * 6;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            /**
             * @private
             * draw rect elements
             **/
            p.drawRectElements = function (data, offset) {
                this.switchDrawingTextureState(false);
                var gl = this.context;
                gl.bindTexture(gl.TEXTURE_2D, null);
                var size = data.count * 6;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            /**
             * @private
             * draw push mask elements
             **/
            p.drawPushMaskElements = function (data, offset) {
                this.switchDrawingTextureState(false);
                var gl = this.context;
                if (this.stencilHandleCount == 0) {
                    gl.enable(gl.STENCIL_TEST);
                    gl.clear(gl.STENCIL_BUFFER_BIT);
                }
                var level = this.stencilHandleCount;
                this.stencilHandleCount++;
                gl.colorMask(false, false, false, false);
                gl.stencilFunc(gl.EQUAL, level, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                gl.bindTexture(gl.TEXTURE_2D, null);
                var size = data.count * 6;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                gl.colorMask(true, true, true, true);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                return size;
            };
            /**
             * @private
             * draw pop mask elements
             **/
            p.drawPopMaskElements = function (data, offset) {
                this.switchDrawingTextureState(false);
                var gl = this.context;
                this.stencilHandleCount--;
                if (this.stencilHandleCount == 0) {
                    gl.disable(gl.STENCIL_TEST);
                    // skip this draw
                    var size = data.count * 6;
                    return size;
                }
                else {
                    var level = this.stencilHandleCount;
                    gl.colorMask(false, false, false, false);
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                    gl.bindTexture(gl.TEXTURE_2D, null);
                    var size = data.count * 6;
                    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                    gl.stencilFunc(gl.EQUAL, level, 0xFF);
                    gl.colorMask(true, true, true, true);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                    return size;
                }
            };
            WebGLRenderBuffer.initBlendMode = function () {
                WebGLRenderBuffer.blendModesForGL = {};
                WebGLRenderBuffer.blendModesForGL["source-over"] = [1, 771];
                WebGLRenderBuffer.blendModesForGL["lighter"] = [770, 1];
                WebGLRenderBuffer.blendModesForGL["destination-out"] = [0, 771];
                WebGLRenderBuffer.blendModesForGL["destination-in"] = [0, 770];
            };
            WebGLRenderBuffer.glContextId = 0;
            // private graphicsPoints:Array<number> = null;
            // private graphicsIndices:Array<number> = null;
            // private graphicsBuffer:WebGLBuffer = null;
            // private graphicsIndexBuffer:WebGLBuffer = null;
            //
            // public renderGraphics(graphics) {
            //     this.$drawWebGL();
            //     var gl:any = this.context;
            //     var shader = this.shaderManager.primitiveShader;
            //
            //     if (!this.graphicsPoints) {
            //         this.graphicsPoints = [];
            //         this.graphicsIndices = [];
            //         this.graphicsBuffer = gl.createBuffer();
            //         this.graphicsIndexBuffer = gl.createBuffer();
            //     }
            //     else {
            //         this.graphicsPoints.length = 0;
            //         this.graphicsIndices.length = 0;
            //     }
            //
            //     this.updateGraphics(graphics);
            //
            //     this.shaderManager.activateShader(shader);
            //     //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            //     gl.uniformMatrix3fv(shader.translationMatrix, false, this.matrixToArray(this.globalMatrix));
            //
            //     gl.uniform2f(shader.projectionVector, this.projectionX, -this.projectionY);
            //     gl.uniform2f(shader.offsetVector, 0, 0);
            //
            //     gl.uniform3fv(shader.tintColor, [1, 1, 1]);
            //
            //     gl.uniform1f(shader.alpha, this._globalAlpha);
            //     gl.bindBuffer(gl.ARRAY_BUFFER, this.graphicsBuffer);
            //
            //     gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
            //     gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false, 4 * 6, 2 * 4);
            //
            //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.graphicsIndexBuffer);
            //
            //     gl.drawElements(gl.TRIANGLE_STRIP, this.graphicsIndices.length, gl.UNSIGNED_SHORT, 0);
            //
            //     this.shaderManager.activateShader(this.shaderManager.defaultShader);
            //
            //     this.currentBlendMode = null;
            //     //this.setGlobalCompositeOperation("source-over");
            // }
            //
            // private matrixArray:Float32Array;
            //
            // private matrixToArray(matrix:Matrix) {
            //     if (!this.matrixArray) {
            //         this.matrixArray = new Float32Array(9);
            //     }
            //     this.matrixArray[0] = matrix.a;
            //     this.matrixArray[1] = matrix.b;
            //     this.matrixArray[2] = 0;
            //     this.matrixArray[3] = matrix.c;
            //     this.matrixArray[4] = matrix.d;
            //     this.matrixArray[5] = 0;
            //     this.matrixArray[6] = matrix.tx;
            //     this.matrixArray[7] = matrix.ty;
            //     this.matrixArray[8] = 1;
            //     return this.matrixArray;
            // }
            //
            // private updateGraphics(graphics) {
            //     var gl:any = this.context;
            //
            //     this.buildRectangle(graphics);
            //
            //     gl.bindBuffer(gl.ARRAY_BUFFER, this.graphicsBuffer);
            //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.graphicsPoints), gl.STATIC_DRAW);
            //
            //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.graphicsIndexBuffer);
            //     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.graphicsIndices), gl.STATIC_DRAW);
            // }
            //
            // private graphicsStyle:any = {a: 1, r: 255, g: 0, b: 0};
            //
            // private buildRectangle(graphicsData:Rectangle) {
            //     var x:number = graphicsData.x;
            //     var y:number = graphicsData.y;
            //     var width:number = graphicsData.width;
            //     var height:number = graphicsData.height;
            //
            //     var alpha:number = this.graphicsStyle.a;
            //     var r:number = this.graphicsStyle.r * alpha;
            //     var g:number = this.graphicsStyle.g * alpha;
            //     var b:number = this.graphicsStyle.b * alpha;
            //
            //     var verts:Array<any> = this.graphicsPoints;
            //     var indices:Array<any> = this.graphicsIndices;
            //     var vertPos:number = verts.length / 6;
            //
            //     verts.push(x, y);
            //     verts.push(r, g, b, alpha);
            //
            //     verts.push(x + width, y);
            //     verts.push(r, g, b, alpha);
            //
            //     verts.push(x, y + height);
            //     verts.push(r, g, b, alpha);
            //
            //     verts.push(x + width, y + height);
            //     verts.push(r, g, b, alpha);
            //
            //     indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
            // }
            WebGLRenderBuffer.blendModesForGL = null;
            return WebGLRenderBuffer;
        }());
        web.WebGLRenderBuffer = WebGLRenderBuffer;
        egret.registerClass(WebGLRenderBuffer,'egret.web.WebGLRenderBuffer',["egret.sys.RenderBuffer"]);
        WebGLRenderBuffer.initBlendMode();
        var sharedBuffer;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        var BLACK_COLOR = "#000000";
        var CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
        var renderBufferPool = []; //渲染缓冲区对象池
        /**
         * @private
         * WebGL渲染器
         */
        var WebGLRenderer = (function () {
            function WebGLRenderer() {
                this.nestLevel = 0; //渲染的嵌套层次，0表示在调用堆栈的最外层。
            }
            var d = __define,c=WebGLRenderer,p=c.prototype;
            /**
             * 渲染一个显示对象
             * @param displayObject 要渲染的显示对象
             * @param buffer 渲染缓冲
             * @param matrix 要对显示对象整体叠加的变换矩阵
             * @param dirtyList 脏矩形列表
             * @param forRenderTexture 绘制目标是RenderTexture的标志
             * @returns drawCall触发绘制的次数
             */
            p.render = function (displayObject, buffer, matrix, dirtyList, forRenderTexture) {
                this.nestLevel++;
                var webglBuffer = buffer;
                var root = forRenderTexture ? displayObject : null;
                //绘制显示对象
                this.drawDisplayObject(displayObject, webglBuffer, dirtyList, matrix, null, null, root);
                webglBuffer.$drawWebGL();
                var drawCall = webglBuffer.$drawCalls;
                webglBuffer.onRenderFinish();
                this.nestLevel--;
                if (this.nestLevel === 0) {
                    //最大缓存6个渲染缓冲
                    if (renderBufferPool.length > 6) {
                        renderBufferPool.length = 6;
                    }
                    var length = renderBufferPool.length;
                    for (var i = 0; i < length; i++) {
                        renderBufferPool[i].resize(0, 0);
                    }
                }
                return drawCall;
            };
            /**
             * @private
             * 绘制一个显示对象
             */
            p.drawDisplayObject = function (displayObject, buffer, dirtyList, matrix, displayList, clipRegion, root) {
                var drawCalls = 0;
                var node;
                if (displayList && !root) {
                    if (displayList.isDirty) {
                        drawCalls += displayList.drawToSurface();
                    }
                    node = displayList.$renderNode;
                }
                else {
                    node = displayObject.$getRenderNode();
                }
                if (node) {
                    if (dirtyList) {
                        var renderRegion = node.renderRegion;
                        if (clipRegion && !clipRegion.intersects(renderRegion)) {
                            node.needRedraw = false;
                        }
                        else if (!node.needRedraw) {
                            var l = dirtyList.length;
                            for (var j = 0; j < l; j++) {
                                if (renderRegion.intersects(dirtyList[j])) {
                                    node.needRedraw = true;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        node.needRedraw = true;
                    }
                    if (node.needRedraw) {
                        drawCalls++;
                        var renderAlpha;
                        var m;
                        if (root) {
                            renderAlpha = displayObject.$getConcatenatedAlphaAt(root, displayObject.$getConcatenatedAlpha());
                            m = egret.Matrix.create().copyFrom(displayObject.$getConcatenatedMatrix());
                            displayObject.$getConcatenatedMatrixAt(root, m);
                            matrix.$preMultiplyInto(m, m);
                            buffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                            egret.Matrix.release(m);
                        }
                        else {
                            renderAlpha = node.renderAlpha;
                            m = node.renderMatrix;
                            buffer.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);
                        }
                        buffer.setGlobalAlpha(renderAlpha);
                        this.renderNode(node, buffer);
                        node.needRedraw = false;
                    }
                }
                if (displayList && !root) {
                    return drawCalls;
                }
                var children = displayObject.$children;
                if (children) {
                    var length = children.length;
                    for (var i = 0; i < length; i++) {
                        var child = children[i];
                        if (!child.$visible || child.$alpha <= 0 || child.$maskedObject) {
                            continue;
                        }
                        if ((child.$blendMode !== 0 ||
                            (child.$mask && (child.$mask.$parentDisplayList || root)))) {
                            drawCalls += this.drawWithClip(child, buffer, dirtyList, matrix, clipRegion, root);
                        }
                        else if (child.$scrollRect || child.$maskRect) {
                            drawCalls += this.drawWithScrollRect(child, buffer, dirtyList, matrix, clipRegion, root);
                        }
                        else {
                            if (child["isFPS"]) {
                                buffer.$drawWebGL();
                                buffer.$computeDrawCall = false;
                                this.drawDisplayObject(child, buffer, dirtyList, matrix, child.$displayList, clipRegion, root);
                                buffer.$drawWebGL();
                                buffer.$computeDrawCall = true;
                            }
                            else {
                                drawCalls += this.drawDisplayObject(child, buffer, dirtyList, matrix, child.$displayList, clipRegion, root);
                            }
                        }
                    }
                }
                return drawCalls;
            };
            /**
             * @private
             */
            p.drawWithClip = function (displayObject, buffer, dirtyList, matrix, clipRegion, root) {
                var drawCalls = 0;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                if (hasBlendMode) {
                    var compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                var mask = displayObject.$mask;
                //if (mask && !mask.$parentDisplayList) {
                //    mask = null; //如果遮罩不在显示列表中，放弃绘制遮罩。
                //}
                //计算scrollRect和mask的clip区域是否需要绘制，不需要就直接返回，跳过所有子项的遍历。
                var maskRegion;
                var displayMatrix = egret.Matrix.create();
                displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
                if (displayObject.$parentDisplayList) {
                    var displayRoot = displayObject.$parentDisplayList.root;
                    var invertedMatrix;
                    if (displayRoot !== displayObject.$stage) {
                        displayObject.$getConcatenatedMatrixAt(displayRoot, displayMatrix);
                    }
                }
                if (mask) {
                    var bounds = mask.$getOriginalBounds();
                    maskRegion = egret.sys.Region.create();
                    var m = egret.Matrix.create();
                    m.copyFrom(mask.$getConcatenatedMatrix());
                    if (invertedMatrix) {
                        invertedMatrix.$preMultiplyInto(m, m);
                    }
                    maskRegion.updateRegion(bounds, m);
                    egret.Matrix.release(m);
                }
                var region;
                if (scrollRect) {
                    region = egret.sys.Region.create();
                    region.updateRegion(scrollRect, displayMatrix);
                }
                if (region && maskRegion) {
                    region.intersect(maskRegion);
                    egret.sys.Region.release(maskRegion);
                }
                else if (!region && maskRegion) {
                    region = maskRegion;
                }
                if (region) {
                    if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                        egret.sys.Region.release(region);
                        egret.Matrix.release(displayMatrix);
                        return drawCalls;
                    }
                }
                else {
                    region = egret.sys.Region.create();
                    bounds = displayObject.$getOriginalBounds();
                    region.updateRegion(bounds, displayMatrix);
                }
                var found = false;
                if (!dirtyList) {
                    found = true;
                }
                else {
                    var l = dirtyList.length;
                    for (var j = 0; j < l; j++) {
                        if (region.intersects(dirtyList[j])) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    egret.sys.Region.release(region);
                    egret.Matrix.release(displayMatrix);
                    return drawCalls;
                }
                //没有遮罩,同时显示对象没有子项
                if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                    if (scrollRect) {
                        var m = displayMatrix;
                        buffer.setTransform(m.a, m.b, m.c, m.d, m.tx - region.minX, m.ty - region.minY);
                        buffer.pushMask(scrollRect);
                    }
                    var offsetM = egret.Matrix.create().setTo(1, 0, 0, 1, 0, 0);
                    //绘制显示对象
                    if (hasBlendMode) {
                        buffer.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, offsetM, displayObject.$displayList, region, null);
                    egret.Matrix.release(offsetM);
                    if (hasBlendMode) {
                        buffer.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    if (scrollRect) {
                        buffer.pushMask(scrollRect);
                    }
                    egret.sys.Region.release(region);
                    egret.Matrix.release(displayMatrix);
                    return drawCalls;
                }
                else {
                    //绘制显示对象自身，若有scrollRect，应用clip
                    var displayBuffer = this.createRenderBuffer(region.width, region.height);
                    var displayContext = displayBuffer.context;
                    if (!displayContext) {
                        drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, clipRegion, root);
                        egret.sys.Region.release(region);
                        egret.Matrix.release(displayMatrix);
                        return drawCalls;
                    }
                    if (scrollRect) {
                        var m = displayMatrix;
                        displayBuffer.setTransform(m.a, m.b, m.c, m.d, m.tx - region.minX, m.ty - region.minY);
                        displayBuffer.pushMask(scrollRect);
                    }
                    displayBuffer.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                    var offsetM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, dirtyList, offsetM, displayObject.$displayList, region, root ? displayObject : null);
                    egret.Matrix.release(offsetM);
                    //绘制遮罩
                    if (mask) {
                        //如果只有一次绘制或是已经被cache直接绘制到displayContext
                        //webgl暂时无法添加,因为会有边界像素没有被擦除
                        //var maskRenderNode = mask.$getRenderNode();
                        //if (maskRenderNode && maskRenderNode.$getRenderCount() == 1 || mask.$displayList) {
                        //    displayBuffer.setGlobalCompositeOperation("destination-in");
                        //    drawCalls += this.drawDisplayObject(mask, displayBuffer, dirtyList, offsetM,
                        //        mask.$displayList, region, root ? mask : null);
                        //}
                        //else {
                        var maskBuffer = this.createRenderBuffer(region.width, region.height);
                        var maskContext = maskBuffer.context;
                        if (!maskContext) {
                            drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, clipRegion, root);
                            if (scrollRect) {
                                displayBuffer.popMask();
                            }
                            renderBufferPool.push(displayBuffer);
                            egret.sys.Region.release(region);
                            egret.Matrix.release(displayMatrix);
                            return drawCalls;
                        }
                        maskBuffer.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                        offsetM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                        var calls = this.drawDisplayObject(mask, maskBuffer, dirtyList, offsetM, mask.$displayList, region, root ? mask : null);
                        egret.Matrix.release(offsetM);
                        if (calls > 0) {
                            drawCalls += calls;
                            displayBuffer.setGlobalCompositeOperation("destination-in");
                            displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
                            displayBuffer.setGlobalAlpha(1);
                            maskBuffer.$drawWebGL();
                            maskBuffer.onRenderFinish();
                            web.WebGLUtils.deleteWebGLTexture(maskBuffer.surface);
                            var maskBufferWidth = maskBuffer.surface.width;
                            var maskBufferHeight = maskBuffer.surface.height;
                            displayBuffer.drawImage(maskBuffer.surface, 0, 0, maskBufferWidth, maskBufferHeight, 0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                        }
                        renderBufferPool.push(maskBuffer);
                    }
                    //绘制结果到屏幕
                    if (drawCalls > 0) {
                        drawCalls++;
                        if (hasBlendMode) {
                            buffer.setGlobalCompositeOperation(compositeOp);
                        }
                        buffer.setGlobalAlpha(1);
                        buffer.setTransform(1, 0, 0, 1, region.minX + matrix.tx, region.minY + matrix.ty);
                        displayBuffer.$drawWebGL();
                        displayBuffer.onRenderFinish();
                        web.WebGLUtils.deleteWebGLTexture(displayBuffer.surface);
                        var displayBufferWidth = displayBuffer.surface.width;
                        var displayBufferHeight = displayBuffer.surface.height;
                        buffer.drawImage(displayBuffer.surface, 0, 0, displayBufferWidth, displayBufferHeight, 0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                        if (hasBlendMode) {
                            buffer.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                    }
                    displayBuffer.setGlobalCompositeOperation(defaultCompositeOp);
                    if (scrollRect) {
                        displayBuffer.popMask();
                    }
                    renderBufferPool.push(displayBuffer);
                    egret.sys.Region.release(region);
                    egret.Matrix.release(displayMatrix);
                    return drawCalls;
                }
            };
            /**
             * @private
             */
            p.drawWithScrollRect = function (displayObject, buffer, dirtyList, matrix, clipRegion, root) {
                var drawCalls = 0;
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                if (scrollRect.width == 0 || scrollRect.height == 0) {
                    return drawCalls;
                }
                var m = egret.Matrix.create();
                m.copyFrom(displayObject.$getConcatenatedMatrix());
                if (displayObject.$parentDisplayList) {
                    var displayRoot = displayObject.$parentDisplayList.root;
                    if (displayRoot !== displayObject.$stage) {
                        displayObject.$getConcatenatedMatrixAt(displayRoot, m);
                    }
                }
                var region = egret.sys.Region.create();
                if (!scrollRect.isEmpty()) {
                    region.updateRegion(scrollRect, m);
                }
                if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                    egret.sys.Region.release(region);
                    egret.Matrix.release(m);
                    return drawCalls;
                }
                var found = false;
                if (!dirtyList) {
                    found = true;
                }
                else {
                    var l = dirtyList.length;
                    for (var j = 0; j < l; j++) {
                        if (region.intersects(dirtyList[j])) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    egret.sys.Region.release(region);
                    egret.Matrix.release(m);
                    return drawCalls;
                }
                //绘制显示对象自身
                buffer.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);
                buffer.pushMask(scrollRect);
                drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, region, root);
                buffer.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);
                buffer.popMask();
                egret.sys.Region.release(region);
                egret.Matrix.release(m);
                return drawCalls;
            };
            /**
             * 将一个RenderNode对象绘制到渲染缓冲
             * @param node 要绘制的节点
             * @param buffer 渲染缓冲
             * @param matrix 要叠加的矩阵
             * @param forHitTest 绘制结果是用于碰撞检测。若为true，当渲染GraphicsNode时，会忽略透明度样式设置，全都绘制为不透明的。
             */
            p.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
                var webglBuffer = buffer;
                webglBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                this.renderNode(node, buffer, forHitTest);
                buffer.$drawWebGL();
                buffer.onRenderFinish();
            };
            /**
             * @private
             */
            p.renderNode = function (node, buffer, forHitTest) {
                switch (node.type) {
                    case 1 /* BitmapNode */:
                        this.renderBitmap(node, buffer);
                        break;
                    case 2 /* TextNode */:
                        this.renderText(node, buffer);
                        break;
                    case 3 /* GraphicsNode */:
                        this.renderGraphics(node, buffer, forHitTest);
                        break;
                    case 4 /* GroupNode */:
                        this.renderGroup(node, buffer);
                        break;
                    case 5 /* SetTransformNode */:
                        buffer.setTransform(node.drawData[0], node.drawData[1], node.drawData[2], node.drawData[3], node.drawData[4], node.drawData[5]);
                        break;
                    case 6 /* SetAlphaNode */:
                        buffer.setGlobalAlpha(node.drawData[0]);
                        break;
                }
            };
            /**
             * @private
             */
            p.renderBitmap = function (node, buffer) {
                var image = node.image;
                //buffer.imageSmoothingEnabled = node.smoothing;
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                if (m) {
                    buffer.saveTransform();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                while (pos < length) {
                    buffer.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight);
                }
                if (m) {
                    buffer.restoreTransform();
                }
            };
            /**
             * @private
             */
            p.renderText = function (node, buffer) {
                // var width = node.width - node.x;
                // var height = node.height - node.y;
                // if (node.drawData.length == 0) {
                //     return;
                // }
                // if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                //     this.canvasRenderer = new CanvasRenderer();
                //     this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
                // }
                // else {
                //     this.canvasRenderBuffer.resize(width, height, true);
                // }
                // if (!this.canvasRenderBuffer.context) {
                //     return;
                // }
                // if (node.x || node.y) {
                //     if (node.dirtyRender) {
                //         this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                //     }
                //     buffer.transform(1, 0, 0, 1, node.x, node.y);
                // }
                // var surface = this.canvasRenderBuffer.surface;
                // if (node.dirtyRender) {
                //     this.canvasRenderer["renderText"](node, this.canvasRenderBuffer.context);
                //     // 拷贝canvas到texture
                //     var texture = node.$texture;
                //     if(!texture) {
                //         texture = buffer.createTexture(<BitmapData><any>surface);
                //         node.$texture = texture;
                //     } else {
                //         // 重新拷贝新的图像
                //         var gl = buffer.context;
                //         gl.bindTexture(gl.TEXTURE_2D, texture);
                //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface);
                //         gl.bindTexture(gl.TEXTURE_2D, null);
                //     }
                //     // 保存材质尺寸
                //     node.$textureWidth = surface.width;
                //     node.$textureHeight = surface.height;
                // }
                // buffer.drawTexture(node.$texture, 0, 0, width, height, 0, 0, width, height, node.$textureWidth, node.$textureHeight);
                // if (node.x || node.y) {
                //     if (node.dirtyRender) {
                //         this.canvasRenderBuffer.context.translate(node.x, node.y);
                //     }
                //     buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                // }
                // node.dirtyRender = false;
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (node.drawData.length == 0) {
                    return;
                }
                if (!node.$canvasRenderBuffer || !node.$canvasRenderBuffer.context) {
                    node.$canvasRenderer = new egret.CanvasRenderer();
                    node.$canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                }
                else {
                    node.$canvasRenderBuffer.resize(width, height, true);
                }
                if (!node.$canvasRenderBuffer.context) {
                    return;
                }
                if (node.x || node.y) {
                    if (node.dirtyRender) {
                        node.$canvasRenderBuffer.context.translate(-node.x, -node.y);
                    }
                    buffer.transform(1, 0, 0, 1, node.x, node.y);
                }
                var surface = node.$canvasRenderBuffer.surface;
                if (node.dirtyRender) {
                    web.WebGLUtils.deleteWebGLTexture(surface);
                    node.$canvasRenderer["renderText"](node, node.$canvasRenderBuffer.context);
                }
                buffer.drawImage(surface, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height);
                if (node.x || node.y) {
                    if (node.dirtyRender) {
                        node.$canvasRenderBuffer.context.translate(node.x, node.y);
                    }
                    buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                }
                node.dirtyRender = false;
            };
            /**
             * @private
             */
            p.renderGraphics = function (node, buffer, forHitTest) {
                // var width = node.width;
                // var height = node.height;
                // if (width <= 0 || height <= 0) {
                //     return;
                // }
                // if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                //     this.canvasRenderer = new CanvasRenderer();
                //     this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
                // }
                // else {
                //     this.canvasRenderBuffer.resize(width, height, true);
                // }
                // if (!this.canvasRenderBuffer.context) {
                //     return;
                // }
                // if (node.x || node.y) {
                //     if (node.dirtyRender) {
                //         this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                //     }
                //     buffer.transform(1, 0, 0, 1, node.x, node.y);
                // }
                // var surface = this.canvasRenderBuffer.surface;
                // if (node.dirtyRender) {
                //     this.canvasRenderer["renderGraphics"](node, this.canvasRenderBuffer.context);
                //     // 拷贝canvas到texture
                //     var texture = node.$texture;
                //     if(!texture) {
                //         texture = buffer.createTexture(<BitmapData><any>surface);
                //         node.$texture = texture;
                //     } else {
                //         // 重新拷贝新的图像
                //         var gl = buffer.context;
                //         gl.bindTexture(gl.TEXTURE_2D, texture);
                //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface);
                //         gl.bindTexture(gl.TEXTURE_2D, null);
                //     }
                //     // 保存材质尺寸
                //     node.$textureWidth = surface.width;
                //     node.$textureHeight = surface.height;
                // }
                // buffer.drawTexture(node.$texture, 0, 0, width, height, 0, 0, width, height, node.$textureWidth, node.$textureHeight);
                // if (node.x || node.y) {
                //     if (node.dirtyRender) {
                //         this.canvasRenderBuffer.context.translate(node.x, node.y);
                //     }
                //     buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                // }
                // node.dirtyRender = false;
                var width = node.width;
                var height = node.height;
                if (width <= 0 || height <= 0) {
                    return;
                }
                if (!node.$canvasRenderBuffer || !node.$canvasRenderBuffer.context) {
                    node.$canvasRenderer = new egret.CanvasRenderer();
                    node.$canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                }
                else if (node.dirtyRender) {
                    node.$canvasRenderBuffer.resize(width, height, true);
                }
                if (!node.$canvasRenderBuffer.context) {
                    return;
                }
                if (node.x || node.y) {
                    if (node.dirtyRender) {
                        node.$canvasRenderBuffer.context.translate(-node.x, -node.y);
                    }
                    buffer.transform(1, 0, 0, 1, node.x, node.y);
                }
                var surface = node.$canvasRenderBuffer.surface;
                if (node.dirtyRender) {
                    web.WebGLUtils.deleteWebGLTexture(surface);
                    node.$canvasRenderer["renderGraphics"](node, node.$canvasRenderBuffer.context, forHitTest);
                }
                buffer.drawImage(surface, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height);
                if (node.x || node.y) {
                    if (node.dirtyRender) {
                        node.$canvasRenderBuffer.context.translate(node.x, node.y);
                    }
                    buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                }
                node.dirtyRender = false;
            };
            p.renderGroup = function (groupNode, buffer) {
                var children = groupNode.drawData;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var node = children[i];
                    this.renderNode(node, buffer);
                }
            };
            /**
             * @private
             */
            p.createRenderBuffer = function (width, height) {
                var buffer = renderBufferPool.pop();
                if (buffer) {
                    buffer.resize(width, height, true);
                }
                else {
                    buffer = new web.WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            return WebGLRenderer;
        }());
        web.WebGLRenderer = WebGLRenderer;
        egret.registerClass(WebGLRenderer,'egret.web.WebGLRenderer',["egret.sys.SystemRenderer"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
