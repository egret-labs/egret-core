//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
     * @deprecated
     */
    function $toBitmapData(data) {
        data["hashCode"] = data["$hashCode"] = egret.$hashCount++;
        return data;
    }
    egret.$toBitmapData = $toBitmapData;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
                    egret.$warn(1047, key, value);
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
//  Copyright (c) 2014-present, Egret Technology.
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
                    egret.$error(1049);
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
                    egret.$error(1049);
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
                request.onload = function () {
                    WebAudioDecode.decodeArr.push({
                        "buffer": request.response,
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
                    egret.$error(1049);
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
            function WebVideo(url, cache) {
                var _this = this;
                if (cache === void 0) { cache = true; }
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
                        if (!egret.Capabilities.isMobile) {
                            _this._fullscreen = isfullscreen;
                        }
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
                    //video.pause();
                    if (_this.posterData) {
                        _this.posterData.width = _this.getPlayWidth();
                        _this.posterData.height = _this.getPlayHeight();
                    }
                    video.width = video.videoWidth;
                    video.height = video.videoHeight;
                    _this.$invalidateContentBounds();
                    window.setTimeout(function () {
                        _this.dispatchEventWith(egret.Event.COMPLETE);
                    }, 200);
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
            p.load = function (url, cache) {
                var _this = this;
                if (cache === void 0) { cache = true; }
                url = url || this.src;
                this.src = url;
                if (DEBUG && !url) {
                    egret.$error(3002);
                }
                if (this.video && this.video.src == url)
                    return;
                if (!this.video || egret.Capabilities.isMobile) {
                    var video = document.createElement("video");
                    this.video = video;
                    video.controls = null;
                }
                else {
                    video = this.video;
                }
                video.src = url;
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
                window.setTimeout(function () { return video.pause(); }, 170);
            };
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
                if (egret.Capabilities.os != "Windows PC" && egret.Capabilities.os != "Mac OS") {
                    window.setTimeout(function () {
                        video.width = 0;
                    }, 1000);
                }
                this.checkFullScreen(this._fullscreen);
            };
            p.checkFullScreen = function (playFullScreen) {
                var video = this.video;
                if (playFullScreen) {
                    if (video.parentElement == null) {
                        video.removeAttribute("webkit-playsinline");
                        document.body.appendChild(video);
                    }
                    egret.stopTick(this.markDirty, this);
                    this.goFullscreen();
                }
                else {
                    if (video.parentElement != null) {
                        video.parentElement.removeChild(video);
                    }
                    video.setAttribute("webkit-playsinline", "true");
                    this.setFullScreenMonitor(false);
                    egret.startTick(this.markDirty, this);
                    if (egret.Capabilities.isMobile) {
                        this.video.currentTime = 0;
                        this.onVideoEnded();
                        return;
                    }
                }
                video.play();
            };
            p.goFullscreen = function () {
                var video = this.video;
                var fullscreenType;
                fullscreenType = egret.web.getPrefixStyleName('requestFullscreen', video);
                if (!video[fullscreenType]) {
                    fullscreenType = egret.web.getPrefixStyleName('requestFullScreen', video);
                    if (!video[fullscreenType]) {
                        return true;
                    }
                }
                video.removeAttribute("webkit-playsinline");
                video[fullscreenType]();
                this.setFullScreenMonitor(true);
                return true;
            };
            p.setFullScreenMonitor = function (use) {
                var video = this.video;
                if (use) {
                    video.addEventListener("mozfullscreenchange", this.screenChanged);
                    video.addEventListener("webkitfullscreenchange", this.screenChanged);
                    video.addEventListener("mozfullscreenerror", this.screenError);
                    video.addEventListener("webkitfullscreenerror", this.screenError);
                }
                else {
                    video.removeEventListener("mozfullscreenchange", this.screenChanged);
                    video.removeEventListener("webkitfullscreenchange", this.screenChanged);
                    video.removeEventListener("mozfullscreenerror", this.screenError);
                    video.removeEventListener("webkitfullscreenerror", this.screenError);
                }
            };
            p.screenError = function () {
                egret.$error(3014);
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
                this.pause();
                this.isPlayed = false;
                this.$invalidateContentBounds();
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
                    if (egret.Capabilities.isMobile) {
                        return;
                    }
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
                        this._bitmapData = new egret.BitmapData(this.video);
                        this._bitmapData.$deleteSource = false;
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
                if ((!this.isPlayed || egret.Capabilities.isMobile) && posterData) {
                    node.image = posterData;
                    node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
                }
                else if (this.isPlayed && bitmapData) {
                    node.image = bitmapData;
                    egret.WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
                    bitmapData.webGLTexture = null;
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
            d(p, "length"
                /**
                 * @inheritDoc
                 */
                ,function () {
                    if (this.video) {
                        return this.video.duration;
                    }
                    throw new Error("Video not loaded!");
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
                this.data = new egret.BitmapData(image);
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
//  Copyright (c) 2014-present, Egret Technology.
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
                // var m = this.$textfield.$renderNode.renderMatrix;
                // var cX = m.a;
                // var cY = m.d;
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
                var node = this.$textfield;
                var cX = 1;
                var cY = 1;
                var rotation = 0;
                while (node.parent) {
                    cX *= node.scaleX;
                    cY *= node.scaleY;
                    rotation += node.rotation;
                    node = node.parent;
                }
                var transformKey = egret.web.getPrefixStyleName("transform");
                this.inputDiv.style[transformKey] = "rotate(" + rotation + "deg)";
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
                    if (!this.$textfield.multiline) {
                        this.inputElement.type = this.$textfield.inputType;
                    }
                    else {
                        this.inputElement.type = "text";
                    }
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
                            if (self.inputElement && self.inputElement.selectionStart && self.inputElement.selectionEnd) {
                                if (self.inputElement.selectionStart == self.inputElement.selectionEnd) {
                                    self.textValue = self.inputElement.value;
                                    egret.Event.dispatchEvent(self, "updateText", false);
                                }
                            }
                        }, 0);
                    }
                }
                else {
                    window.setTimeout(function () {
                        if (self.inputElement && self.inputElement.selectionStart == self.inputElement.selectionEnd) {
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
                    if (textfield.height <= textfield.size) {
                        this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                        this.setElementStyle("padding", "0px");
                        this.setElementStyle("lineHeight", (textfield.size) * this._gscaleY + "px");
                    }
                    else if (textfield.height < textheight) {
                        this.setElementStyle("height", (textfield.height) * this._gscaleY + "px");
                        this.setElementStyle("padding", "0px");
                        this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
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
//  Copyright (c) 2014-present, Egret Technology.
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
            context = egret.sys.canvasHitTestBuffer.context;
            context.textAlign = "left";
            context.textBaseline = "middle";
        }
        egret.sys.measureText = measureText;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
            function CanvasRenderBuffer(width, height, root) {
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
            Html5Capatibility.$init = function () {
                var ua = navigator.userAgent.toLowerCase();
                Html5Capatibility.ua = ua;
                egret.Capabilities.$isMobile = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
                Html5Capatibility._canUseBlob = false;
                var checkAudioType;
                var audioType = Html5Capatibility._audioType;
                var canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
                if (audioType == 1 || audioType == 2 || audioType == 3) {
                    checkAudioType = false;
                    Html5Capatibility.setAudioType(audioType);
                }
                else {
                    checkAudioType = true;
                    Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
                }
                if (ua.indexOf("windows phone") >= 0) {
                    Html5Capatibility._System_OS = SystemOSType.WPHONE;
                    egret.Capabilities.$os = "Windows Phone";
                }
                else if (ua.indexOf("android") >= 0) {
                    egret.Capabilities.$os = "Android";
                    Html5Capatibility._System_OS = SystemOSType.ADNROID;
                    if (canUseWebAudio) {
                        Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                    }
                    else {
                        Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
                    }
                    if (window.hasOwnProperty("QZAppExternal") && ua.indexOf("qzone") >= 0) {
                        Html5Capatibility.setAudioType(AudioType.QQ_AUDIO);
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
                        Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
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
                egret.Sound = Html5Capatibility._AudioClass;
            };
            Html5Capatibility.setAudioType = function (type) {
                Html5Capatibility._audioType = type;
                switch (type) {
                    case AudioType.QQ_AUDIO:
                        Html5Capatibility._AudioClass = egret.web.QQSound;
                        break;
                    case AudioType.WEB_AUDIO:
                        Html5Capatibility._AudioClass = egret.web.WebAudioSound;
                        break;
                    case AudioType.HTML5_AUDIO:
                        Html5Capatibility._AudioClass = egret.web.HtmlSound;
                        break;
                }
            };
            /**
             * @private
             * 获取ios版本
             * @returns {string}
             */
            Html5Capatibility.getIOSVersion = function () {
                var value = Html5Capatibility.ua.toLowerCase().match(/cpu [^\d]*\d.*like mac os x/)[0];
                return parseInt(value.match(/\d+(_\d)*/)[0]) || 0;
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
//  Copyright (c) 2014-present, Egret Technology.
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
            web.Html5Capatibility._audioType = options.audioType;
            web.Html5Capatibility.$init();
            // WebGL上下文参数自定义
            if (options.renderMode == "webgl") {
                // WebGL抗锯齿默认关闭，提升PC及某些平台性能
                var antialias = options.antialias;
                web.WebGLRenderContext.antialias = !!antialias;
            }
            egret.sys.CanvasRenderBuffer = web.CanvasRenderBuffer;
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
                //webgl模式关闭脏矩形
                if (options.renderMode == "webgl") {
                    player.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
                    egret.sys.DisplayList.prototype.setDirtyRegionPolicy = function () {
                    };
                }
            }
        }
        /**
         * 设置渲染模式。"auto","webgl","canvas"
         * @param renderMode
         */
        function setRenderMode(renderMode) {
            if (renderMode == "webgl" && egret.WebGLUtils.checkCanUseWebGL()) {
                egret.sys.RenderBuffer = web.WebGLRenderBuffer;
                egret.sys.systemRenderer = new web.WebGLRenderer();
                egret.sys.canvasRenderer = new egret.CanvasRenderer();
                egret.sys.customHitTestBuffer = new web.WebGLRenderBuffer(3, 3);
                egret.sys.canvasHitTestBuffer = new web.CanvasRenderBuffer(3, 3);
                egret.Capabilities.$renderMode = "webgl";
            }
            else {
                egret.sys.RenderBuffer = web.CanvasRenderBuffer;
                egret.sys.systemRenderer = new egret.CanvasRenderer();
                egret.sys.canvasRenderer = egret.sys.systemRenderer;
                egret.sys.customHitTestBuffer = new web.CanvasRenderBuffer(3, 3);
                egret.sys.canvasHitTestBuffer = egret.sys.customHitTestBuffer;
                egret.Capabilities.$renderMode = "canvas";
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
        var WebFps = (function (_super) {
            __extends(WebFps, _super);
            function WebFps(stage, showFPS, showLog, logFilter, styles) {
                _super.call(this);
                this.showPanle = true;
                this.fpsHeight = 0;
                this.WIDTH = 101;
                this.HEIGHT = 20;
                this.bgCanvasColor = "#18304b";
                this.fpsFrontColor = "#18fefe";
                this.WIDTH_COST = 33;
                this.cost1Color = "#18fefe";
                this.cost2Color = "#ffff00";
                this.cost3Color = "#ff0000";
                this.arrFps = [];
                this.arrCost = [];
                this.arrLog = [];
                if (showFPS || showLog) {
                    if (egret.Capabilities.renderMode == 'canvas') {
                        this.renderMode = "Canvas";
                    }
                    else {
                        this.renderMode = "WebGL";
                    }
                    this.panelX = styles["x"] === undefined ? 0 : parseInt(styles['x']);
                    this.panelY = styles["y"] === undefined ? 0 : parseInt(styles['y']);
                    this.fontColor = styles["textColor"] === undefined ? '#ffffff' : styles['textColor'].replace("0x", "#");
                    this.fontSize = styles["size"] === undefined ? 12 : parseInt(styles['size']);
                    if (egret.Capabilities.isMobile) {
                        this.fontSize -= 2;
                    }
                    var all = document.createElement('div');
                    all.style.position = 'absolute';
                    all.style.background = "rgba(0,0,0," + styles['bgAlpha'] + ")";
                    all.style.left = this.panelX + 'px';
                    all.style.top = this.panelY + 'px';
                    all.style.pointerEvents = 'none';
                    document.body.appendChild(all);
                    var container = document.createElement('div');
                    container.style.color = this.fontColor;
                    container.style.fontSize = this.fontSize + 'px';
                    container.style.lineHeight = this.fontSize + 'px';
                    container.style.margin = '4px 4px 4px 4px';
                    this.container = container;
                    all.appendChild(container);
                    if (showFPS)
                        this.addFps();
                    if (showLog)
                        this.addLog();
                }
            }
            var d = __define,c=WebFps,p=c.prototype;
            p.addFps = function () {
                var div = document.createElement('div');
                div.style.display = 'inline-block';
                this.containerFps = div;
                this.container.appendChild(div);
                var fps = document.createElement('div');
                fps.style.paddingBottom = '2px';
                this.fps = fps;
                this.containerFps.appendChild(fps);
                fps.innerHTML = "0 FPS " + this.renderMode + "<br/>min0 max0 avg0";
                var canvas = document.createElement('canvas');
                this.containerFps.appendChild(canvas);
                canvas.width = this.WIDTH;
                canvas.height = this.HEIGHT;
                this.canvasFps = canvas;
                var context = canvas.getContext('2d');
                this.contextFps = context;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
                var divDatas = document.createElement('div');
                this.divDatas = divDatas;
                this.containerFps.appendChild(divDatas);
                var left = document.createElement('div');
                left.style['float'] = 'left';
                left.innerHTML = "Draw<br/>Dirty<br/>Cost";
                divDatas.appendChild(left);
                var right = document.createElement('div');
                right.style.paddingLeft = left.offsetWidth + 20 + "px";
                divDatas.appendChild(right);
                var draw = document.createElement('div');
                this.divDraw = draw;
                draw.innerHTML = "0<br/>0<br/>";
                right.appendChild(draw);
                var cost = document.createElement('div');
                this.divCost = cost;
                cost.innerHTML = "<font  style=\"color:" + this.cost1Color + "\">0<font/> <font  style=\"color:" + this.cost2Color + "\">0<font/> <font  style=\"color:" + this.cost3Color + "\">0<font/>";
                right.appendChild(cost);
                var canvas = document.createElement('canvas');
                this.canvasCost = canvas;
                this.containerFps.appendChild(canvas);
                canvas.width = this.WIDTH;
                canvas.height = this.HEIGHT;
                var context = canvas.getContext('2d');
                this.contextCost = context;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
                context.fillStyle = "#000000";
                context.fillRect(this.WIDTH_COST, 0, 1, this.HEIGHT);
                context.fillRect(this.WIDTH_COST * 2 + 1, 0, 1, this.HEIGHT);
                this.fpsHeight = this.container.offsetHeight;
            };
            p.addLog = function () {
                var log = document.createElement('div');
                log.style.maxWidth = document.body.clientWidth - 8 - this.panelX + 'px';
                log.style.wordWrap = "break-word";
                this.log = log;
                this.container.appendChild(log);
            };
            p.update = function (datas, showLastData) {
                if (showLastData === void 0) { showLastData = false; }
                if (!showLastData) {
                    var numFps = datas.fps;
                    var numCostTicker = datas.costTicker;
                    var numCostDirty = datas.costDirty;
                    var numCostRender = datas.costRender;
                    this.lastNumDraw = datas.draw;
                    this.lastNumDirty = datas.dirty;
                    this.arrFps.push(numFps);
                    this.arrCost.push([numCostTicker, numCostDirty, numCostRender]);
                }
                else {
                    numFps = this.arrFps[this.arrFps.length - 1];
                    numCostTicker = this.arrCost[this.arrCost.length - 1][0];
                    numCostDirty = this.arrCost[this.arrCost.length - 1][1];
                    numCostRender = this.arrCost[this.arrCost.length - 1][2];
                }
                var fpsTotal = 0;
                var lenFps = this.arrFps.length;
                if (lenFps > 101) {
                    lenFps = 101;
                    this.arrFps.shift();
                }
                var fpsMin = this.arrFps[0];
                var fpsMax = this.arrFps[0];
                for (var i = 0; i < lenFps; i++) {
                    var num = this.arrFps[i];
                    fpsTotal += num;
                    if (num < fpsMin)
                        fpsMin = num;
                    else if (num > fpsMax)
                        fpsMax = num;
                }
                var WIDTH = this.WIDTH;
                var HEIGHT = this.HEIGHT;
                var context = this.contextFps;
                context.drawImage(this.canvasFps, 1, 0, WIDTH - 1, HEIGHT, 0, 0, WIDTH - 1, HEIGHT);
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(WIDTH - 1, 0, 1, HEIGHT);
                var lastHeight = Math.floor(numFps / 60 * 20);
                if (lastHeight < 1)
                    lastHeight = 1;
                context.fillStyle = this.fpsFrontColor;
                context.fillRect(WIDTH - 1, 20 - lastHeight, 1, lastHeight);
                var WIDTH_COST = this.WIDTH_COST;
                var context = this.contextCost;
                context.drawImage(this.canvasCost, 1, 0, WIDTH_COST - 1, HEIGHT, 0, 0, WIDTH_COST - 1, HEIGHT);
                context.drawImage(this.canvasCost, WIDTH_COST + 2, 0, WIDTH_COST - 1, HEIGHT, WIDTH_COST + 1, 0, WIDTH_COST - 1, HEIGHT);
                context.drawImage(this.canvasCost, WIDTH_COST * 2 + 3, 0, WIDTH_COST - 1, HEIGHT, WIDTH_COST * 2 + 2, 0, WIDTH_COST - 1, HEIGHT);
                var c1Height = Math.floor(numCostTicker / 2);
                if (c1Height < 1)
                    c1Height = 1;
                else if (c1Height > 20)
                    c1Height = 20;
                var c2Height = Math.floor(numCostDirty / 2);
                if (c2Height < 1)
                    c2Height = 1;
                else if (c2Height > 20)
                    c2Height = 20;
                var c3Height = Math.floor(numCostRender / 2);
                if (c3Height < 1)
                    c3Height = 1;
                else if (c3Height > 20)
                    c3Height = 20;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(WIDTH_COST - 1, 0, 1, HEIGHT);
                context.fillRect(WIDTH_COST * 2, 0, 1, HEIGHT);
                context.fillRect(WIDTH_COST * 3 + 1, 0, 1, HEIGHT);
                context.fillStyle = this.cost1Color;
                context.fillRect(WIDTH_COST - 1, 20 - c1Height, 1, c1Height);
                context.fillStyle = this.cost2Color;
                context.fillRect(WIDTH_COST * 2, 20 - c2Height, 1, c2Height);
                context.fillStyle = this.cost3Color;
                context.fillRect(WIDTH_COST * 3 + 1, 20 - c3Height, 1, c3Height);
                var fpsAvg = Math.floor(fpsTotal / lenFps);
                var fpsOutput = numFps + " FPS " + this.renderMode;
                if (this.showPanle) {
                    fpsOutput += "<br/>min" + fpsMin + " max" + fpsMax + " avg" + fpsAvg;
                    this.divDraw.innerHTML = this.lastNumDraw + "<br/>" + this.lastNumDirty + "%<br/>";
                    this.divCost.innerHTML = "<font  style=\"color:#18fefe\">" + numCostTicker + "<font/> <font  style=\"color:#ffff00\">" + numCostDirty + "<font/> <font  style=\"color:#ff0000\">" + numCostRender + "<font/>";
                }
                this.fps.innerHTML = fpsOutput;
            };
            ;
            p.updateInfo = function (info) {
                this.arrLog.push(info);
                this.log.innerHTML = this.arrLog.join('<br/>');
                while (document.body.clientHeight < (this.log.offsetHeight + this.fpsHeight + this.panelY + this.fontSize * 2)) {
                    this.arrLog.shift();
                    this.log.innerHTML = this.arrLog.join('<br/>');
                }
            };
            return WebFps;
        }(egret.DisplayObject));
        web.WebFps = WebFps;
        egret.registerClass(WebFps,'egret.web.WebFps',["egret.FPSDisplay"]);
        egret.FPSDisplay = WebFps;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
                var buffer = new egret.sys.RenderBuffer(undefined, undefined, true);
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
                egret.Capabilities.$boundingClientWidth = screenWidth;
                egret.Capabilities.$boundingClientHeight = screenHeight;
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
//  Copyright (c) 2014-present, Egret Technology.
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
            sharedContext.drawImage(bitmapData._bitmapData.source, bitmapData._bitmapX + rect.x / egret.$TextureScaleFactor, bitmapData._bitmapY + rect.y / egret.$TextureScaleFactor, bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
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
            var buffer = egret.sys.canvasHitTestBuffer;
            buffer.resize(3, 3);
            var context = buffer.context;
            context.translate(1 - x, 1 - y);
            var width = this._bitmapWidth;
            var height = this._bitmapHeight;
            var scale = egret.$TextureScaleFactor;
            context.drawImage(this._bitmapData.source, this._bitmapX, this._bitmapY, width, this._bitmapHeight, this._offsetX, this._offsetY, width * scale, height * scale);
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
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
         * 抽象shader类，所有shader的基类
         */
        var EgretShader = (function () {
            function EgretShader(gl) {
                // 着色器源码
                this.defaultVertexSrc = "attribute vec2 aVertexPosition;\n" +
                    "attribute vec2 aTextureCoord;\n" +
                    "attribute vec2 aColor;\n" +
                    "uniform vec2 projectionVector;\n" +
                    // "uniform vec2 offsetVector;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "varying vec4 vColor;\n" +
                    "const vec2 center = vec2(-1.0, 1.0);\n" +
                    "void main(void) {\n" +
                    "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n" +
                    "   vTextureCoord = aTextureCoord;\n" +
                    "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
                    "}";
                this.fragmentSrc = "";
                this.gl = null;
                this.program = null;
                this.uniforms = {
                    projectionVector: { type: '2f', value: { x: 0, y: 0 }, dirty: true }
                };
                this.gl = gl;
            }
            var d = __define,c=EgretShader,p=c.prototype;
            p.init = function () {
                var gl = this.gl;
                var program = egret.WebGLUtils.compileProgram(gl, this.defaultVertexSrc, this.fragmentSrc);
                gl.useProgram(program);
                this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
                this.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
                this.colorAttribute = gl.getAttribLocation(program, "aColor");
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
                    uniform.dirty = true;
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
                    if (uniform.dirty) {
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
                        uniform.dirty = false;
                    }
                }
            };
            /**
             * 同步视角坐标
             */
            p.setProjection = function (projectionX, projectionY) {
                var uniform = this.uniforms.projectionVector;
                if (uniform.value.x != projectionX || uniform.value.y != projectionY) {
                    uniform.value.x = projectionX;
                    uniform.value.y = projectionY;
                    uniform.dirty = true;
                }
            };
            /**
             * 设置attribute pointer
             */
            p.setAttribPointer = function (stride) {
                var gl = this.gl;
                gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
                gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
                gl.vertexAttribPointer(this.colorAttribute, 1, gl.FLOAT, false, stride, 4 * 4);
            };
            return EgretShader;
        }());
        web.EgretShader = EgretShader;
        egret.registerClass(EgretShader,'egret.web.EgretShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
        var TextureShader = (function (_super) {
            __extends(TextureShader, _super);
            function TextureShader() {
                _super.apply(this, arguments);
                this.fragmentSrc = "precision lowp float;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "varying vec4 vColor;\n" +
                    "uniform sampler2D uSampler;\n" +
                    "void main(void) {\n" +
                    "gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;\n" +
                    "}";
            }
            var d = __define,c=TextureShader,p=c.prototype;
            return TextureShader;
        }(web.EgretShader));
        web.TextureShader = TextureShader;
        egret.registerClass(TextureShader,'egret.web.TextureShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
        var PrimitiveShader = (function (_super) {
            __extends(PrimitiveShader, _super);
            function PrimitiveShader() {
                _super.apply(this, arguments);
                this.fragmentSrc = "precision lowp float;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "varying vec4 vColor;\n" +
                    "void main(void) {\n" +
                    "gl_FragColor = vColor;\n" +
                    "}";
            }
            var d = __define,c=PrimitiveShader,p=c.prototype;
            return PrimitiveShader;
        }(web.EgretShader));
        web.PrimitiveShader = PrimitiveShader;
        egret.registerClass(PrimitiveShader,'egret.web.PrimitiveShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
            function BlurShader() {
                _super.apply(this, arguments);
                this.fragmentSrc = "precision mediump float;" +
                    "uniform vec2 blur;" +
                    "uniform sampler2D uSampler;" +
                    "varying vec2 vTextureCoord;" +
                    "uniform vec2 uTextureSize;" +
                    "void main()" +
                    "{" +
                    "const int sampleRadius = 5;" +
                    "const int samples = sampleRadius * 2 + 1;" +
                    "vec2 blurUv = blur / uTextureSize;" +
                    "vec4 color = vec4(0, 0, 0, 0);" +
                    "vec2 uv = vec2(0.0, 0.0);" +
                    "blurUv /= float(sampleRadius);" +
                    "for (int i = -sampleRadius; i <= sampleRadius; i++) {" +
                    "uv.x = vTextureCoord.x + float(i) * blurUv.x;" +
                    "uv.y = vTextureCoord.y + float(i) * blurUv.y;" +
                    "color += texture2D(uSampler, uv);" +
                    '}' +
                    "color /= float(samples);" +
                    "gl_FragColor = color;" +
                    "}";
                this.uniforms = {
                    projectionVector: { type: '2f', value: { x: 0, y: 0 }, dirty: true },
                    blur: { type: '2f', value: { x: 2, y: 2 }, dirty: true },
                    uTextureSize: { type: '2f', value: { x: 100, y: 100 }, dirty: true }
                };
            }
            var d = __define,c=BlurShader,p=c.prototype;
            p.setBlur = function (blurX, blurY) {
                var uniform = this.uniforms.blur;
                if (uniform.value.x != blurX || uniform.value.y != blurY) {
                    uniform.value.x = blurX;
                    uniform.value.y = blurY;
                    uniform.dirty = true;
                }
            };
            /**
             * 设置采样材质的尺寸
             */
            p.setTextureSize = function (width, height) {
                var uniform = this.uniforms.uTextureSize;
                if (width != uniform.value.x || height != uniform.value.y) {
                    uniform.value.x = width;
                    uniform.value.y = height;
                    uniform.dirty = true;
                }
            };
            return BlurShader;
        }(web.TextureShader));
        web.BlurShader = BlurShader;
        egret.registerClass(BlurShader,'egret.web.BlurShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
            function ColorTransformShader() {
                _super.apply(this, arguments);
                this.fragmentSrc = "precision mediump float;\n" +
                    "varying vec2 vTextureCoord;\n" +
                    "varying vec4 vColor;\n" +
                    "uniform mat4 matrix;\n" +
                    "uniform vec4 colorAdd;\n" +
                    "uniform sampler2D uSampler;\n" +
                    "void main(void) {\n" +
                    "vec4 texColor = texture2D(uSampler, vTextureCoord);\n" +
                    "if(texColor.a > 0.) {" +
                    // 抵消预乘的alpha通道
                    "texColor = vec4(texColor.rgb / texColor.a, texColor.a);\n" +
                    "}" +
                    "vec4 locColor = clamp(texColor * matrix + colorAdd, 0., 1.);\n" +
                    "gl_FragColor = vColor * vec4(locColor.rgb * locColor.a, locColor.a);\n" +
                    "}";
                this.uniforms = {
                    projectionVector: { type: '2f', value: { x: 0, y: 0 }, dirty: true },
                    matrix: { type: 'mat4', value: [1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1], dirty: true },
                    colorAdd: { type: '4f', value: { x: 0, y: 0, z: 0, w: 0 }, dirty: true }
                };
            }
            var d = __define,c=ColorTransformShader,p=c.prototype;
            p.setMatrix = function (matrix) {
                var uniform = this.uniforms.matrix;
                if (uniform.value[0] != matrix[0] ||
                    uniform.value[0] != matrix[0] ||
                    uniform.value[1] != matrix[1] ||
                    uniform.value[2] != matrix[2] ||
                    uniform.value[3] != matrix[3] ||
                    uniform.value[4] != matrix[5] ||
                    uniform.value[5] != matrix[6] ||
                    uniform.value[6] != matrix[7] ||
                    uniform.value[7] != matrix[8] ||
                    uniform.value[8] != matrix[10] ||
                    uniform.value[9] != matrix[11] ||
                    uniform.value[10] != matrix[12] ||
                    uniform.value[11] != matrix[13] ||
                    uniform.value[12] != matrix[15] ||
                    uniform.value[13] != matrix[16] ||
                    uniform.value[14] != matrix[17] ||
                    uniform.value[15] != matrix[18]) {
                    uniform.value[0] = matrix[0];
                    uniform.value[1] = matrix[1];
                    uniform.value[2] = matrix[2];
                    uniform.value[3] = matrix[3];
                    uniform.value[4] = matrix[5];
                    uniform.value[5] = matrix[6];
                    uniform.value[6] = matrix[7];
                    uniform.value[7] = matrix[8];
                    uniform.value[8] = matrix[10];
                    uniform.value[9] = matrix[11];
                    uniform.value[10] = matrix[12];
                    uniform.value[11] = matrix[13];
                    uniform.value[12] = matrix[15];
                    uniform.value[13] = matrix[16];
                    uniform.value[14] = matrix[17];
                    uniform.value[15] = matrix[18];
                    uniform.dirty = true;
                }
                var uniform2 = this.uniforms.colorAdd;
                if (uniform2.value.x != matrix[4] / 255.0 ||
                    uniform2.value.y != matrix[9] / 255.0 ||
                    uniform2.value.z != matrix[14] / 255.0 ||
                    uniform2.value.w != matrix[19] / 255.0) {
                    uniform2.value.x = matrix[4] / 255.0;
                    uniform2.value.y = matrix[9] / 255.0;
                    uniform2.value.z = matrix[14] / 255.0;
                    uniform2.value.w = matrix[19] / 255.0;
                    uniform2.dirty = true;
                }
            };
            return ColorTransformShader;
        }(web.TextureShader));
        web.ColorTransformShader = ColorTransformShader;
        egret.registerClass(ColorTransformShader,'egret.web.ColorTransformShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
        var GlowShader = (function (_super) {
            __extends(GlowShader, _super);
            function GlowShader() {
                _super.apply(this, arguments);
                this.fragmentSrc = [
                    'precision mediump float;',
                    'varying vec2 vTextureCoord;',
                    'uniform sampler2D uSampler;',
                    'uniform float distance;',
                    'uniform float angle;',
                    'uniform vec4 color;',
                    'uniform float alpha;',
                    'uniform float blurX;',
                    'uniform float blurY;',
                    // 'uniform vec4 quality;',
                    'uniform float strength;',
                    'uniform float inner;',
                    'uniform float knockout;',
                    'uniform float hideObject;',
                    "uniform vec2 uTextureSize;" +
                        'vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);',
                    'float random(vec3 scale, float seed)',
                    '{',
                    'return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);',
                    '}',
                    'void main(void) {',
                    // TODO 自动调节采样次数？
                    'const float linearSamplingTimes = 7.0;',
                    'const float circleSamplingTimes = 12.0;',
                    'vec4 ownColor = texture2D(uSampler, vTextureCoord);',
                    'vec4 curColor;',
                    'float totalAlpha = 0.0;',
                    'float maxTotalAlpha = 0.0;',
                    'float curDistanceX = 0.0;',
                    'float curDistanceY = 0.0;',
                    'float offsetX = distance * cos(angle) * px.x;',
                    'float offsetY = distance * sin(angle) * px.y;',
                    'const float PI = 3.14159265358979323846264;',
                    'float cosAngle;',
                    'float sinAngle;',
                    'float offset = PI * 2.0 / circleSamplingTimes * random(vec3(12.9898, 78.233, 151.7182), 0.0);',
                    'float stepX = blurX * px.x / linearSamplingTimes;',
                    'float stepY = blurY * px.y / linearSamplingTimes;',
                    'for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {',
                    'cosAngle = cos(a + offset);',
                    'sinAngle = sin(a + offset);',
                    'for (float i = 1.0; i <= linearSamplingTimes; i++) {',
                    'curDistanceX = i * stepX * cosAngle;',
                    'curDistanceY = i * stepY * sinAngle;',
                    'curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));',
                    'totalAlpha += (linearSamplingTimes - i) * curColor.a;',
                    'maxTotalAlpha += (linearSamplingTimes - i);',
                    '}',
                    '}',
                    'ownColor.a = max(ownColor.a, 0.0001);',
                    'ownColor.rgb = ownColor.rgb / ownColor.a;',
                    'float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);',
                    'float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;',
                    'ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);',
                    'vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));',
                    'vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));',
                    'float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);',
                    'gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);',
                    '}',
                ].join("\n");
                this.uniforms = {
                    projectionVector: { type: '2f', value: { x: 0, y: 0 }, dirty: true },
                    distance: { type: '1f', value: 15, dirty: true },
                    angle: { type: '1f', value: 1, dirty: true },
                    color: { type: '4f', value: { x: 1, y: 0, z: 0, w: 0 }, dirty: true },
                    alpha: { type: '1f', value: 1, dirty: true },
                    blurX: { type: '1f', value: 1, dirty: true },
                    blurY: { type: '1f', value: 1, dirty: true },
                    strength: { type: '1f', value: 1, dirty: true },
                    inner: { type: '1f', value: 1, dirty: true },
                    knockout: { type: '1f', value: 1, dirty: true },
                    hideObject: { type: '1f', value: 0, dirty: true },
                    uTextureSize: { type: '2f', value: { x: 100, y: 100 }, dirty: true }
                };
            }
            var d = __define,c=GlowShader,p=c.prototype;
            p.setDistance = function (distance) {
                var uniform = this.uniforms.distance;
                if (uniform.value != distance) {
                    uniform.value = distance;
                    uniform.dirty = true;
                }
            };
            p.setAngle = function (angle) {
                var uniform = this.uniforms.angle;
                if (uniform.value != angle) {
                    uniform.value = angle;
                    uniform.dirty = true;
                }
            };
            p.setColor = function (red, green, blue) {
                var uniform = this.uniforms.color;
                if (uniform.value.x != red || uniform.value.y != green || uniform.value.z != blue) {
                    uniform.value.x = red;
                    uniform.value.y = green;
                    uniform.value.z = blue;
                    uniform.dirty = true;
                }
            };
            p.setAlpha = function (alpha) {
                var uniform = this.uniforms.alpha;
                if (uniform.value != alpha) {
                    uniform.value = alpha;
                    uniform.dirty = true;
                }
            };
            p.setBlurX = function (blurX) {
                var uniform = this.uniforms.blurX;
                if (uniform.value != blurX) {
                    uniform.value = blurX;
                    uniform.dirty = true;
                }
            };
            p.setBlurY = function (blurY) {
                var uniform = this.uniforms.blurY;
                if (uniform.value != blurY) {
                    uniform.value = blurY;
                    uniform.dirty = true;
                }
            };
            p.setStrength = function (strength) {
                var uniform = this.uniforms.strength;
                if (uniform.value != strength) {
                    uniform.value = strength;
                    uniform.dirty = true;
                }
            };
            p.setInner = function (inner) {
                var uniform = this.uniforms.inner;
                if (uniform.value != inner) {
                    uniform.value = inner;
                    uniform.dirty = true;
                }
            };
            p.setKnockout = function (knockout) {
                var uniform = this.uniforms.knockout;
                if (uniform.value != knockout) {
                    uniform.value = knockout;
                    uniform.dirty = true;
                }
            };
            p.setHideObject = function (hideObject) {
                var uniform = this.uniforms.hideObject;
                if (uniform.value != hideObject) {
                    uniform.value = hideObject;
                    uniform.dirty = true;
                }
            };
            /**
             * 设置采样材质的尺寸
             */
            p.setTextureSize = function (width, height) {
                var uniform = this.uniforms.uTextureSize;
                if (width != uniform.value.x || height != uniform.value.y) {
                    uniform.value.x = width;
                    uniform.value.y = height;
                    uniform.dirty = true;
                }
            };
            return GlowShader;
        }(web.TextureShader));
        web.GlowShader = GlowShader;
        egret.registerClass(GlowShader,'egret.web.GlowShader');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
                this.glowShader = null;
                for (var i = 0; i < this.maxAttibs; i++) {
                    this.attribState[i] = false;
                }
                this.setContext(gl);
            }
            var d = __define,c=WebGLShaderManager,p=c.prototype;
            p.setContext = function (gl) {
                this.gl = gl;
                this.primitiveShader = new web.PrimitiveShader(gl);
                this.defaultShader = new web.TextureShader(gl);
                this.colorTransformShader = new web.ColorTransformShader(gl);
                this.glowShader = new web.GlowShader(gl);
                this.blurShader = new web.BlurShader(gl);
                this.primitiveShader.init();
                this.defaultShader.init();
                this.colorTransformShader.init();
                this.blurShader.init();
                this.glowShader.init();
            };
            p.activateShader = function (shader, stride) {
                if (this.currentShader != shader) {
                    this.gl.useProgram(shader.program);
                    this.setAttribs(shader.attributes);
                    shader.setAttribPointer(stride);
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
//  Copyright (c) 2014-present, Egret Technology.
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
         * 绘制指令管理器
         * 用来维护drawData数组
         */
        var WebGLDrawCmdManager = (function () {
            function WebGLDrawCmdManager() {
                /**
                 * 用于缓存绘制命令的数组
                 */
                this.drawData = [];
                this.drawDataLen = 0;
            }
            var d = __define,c=WebGLDrawCmdManager,p=c.prototype;
            /**
             * 压入绘制矩形指令
             */
            p.pushDrawRect = function () {
                if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 1 /* RECT */) {
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 1 /* RECT */;
                    data.count = 0;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                this.drawData[this.drawDataLen - 1].count += 2;
            };
            /**
             * 压入绘制texture指令
             */
            p.pushDrawTexture = function (texture, count, filter, textureWidth, textureHeight) {
                if (count === void 0) { count = 2; }
                if (filter) {
                    // 目前有滤镜的情况下不会合并绘制
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 0 /* TEXTURE */;
                    data.texture = texture;
                    data.filter = filter;
                    data.count = count;
                    data.textureWidth = textureWidth;
                    data.textureHeight = textureHeight;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                else {
                    if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 0 /* TEXTURE */ || texture != this.drawData[this.drawDataLen - 1].texture || this.drawData[this.drawDataLen - 1].filter) {
                        var data = this.drawData[this.drawDataLen] || {};
                        data.type = 0 /* TEXTURE */;
                        data.texture = texture;
                        data.count = 0;
                        this.drawData[this.drawDataLen] = data;
                        this.drawDataLen++;
                    }
                    this.drawData[this.drawDataLen - 1].count += count;
                }
            };
            /**
             * 压入pushMask指令
             */
            p.pushPushMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 2 /* PUSH_MASK */;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入popMask指令
             */
            p.pushPopMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 3 /* POP_MASK */;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入混色指令
             */
            p.pushSetBlend = function (value) {
                var len = this.drawDataLen;
                // 有无遍历到有效绘图操作
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type == 0 /* TEXTURE */ || data.type == 1 /* RECT */) {
                            drawState = true;
                        }
                        // 如果与上一次blend操作之间无有效绘图，上一次操作无效
                        if (!drawState && data.type == 4 /* BLEND */) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                        // 如果与上一次blend操作重复，本次操作无效
                        if (data.type == 4 /* BLEND */) {
                            if (data.value == value) {
                                return;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 4 /* BLEND */;
                _data.value = value;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            /*
             * 压入resize render target命令
             */
            p.pushResize = function (buffer, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 5 /* RESIZE_TARGET */;
                data.buffer = buffer;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /*
             * 压入clear color命令
             */
            p.pushClearColor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 6 /* CLEAR_COLOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入激活buffer命令
             */
            p.pushActivateBuffer = function (buffer) {
                var len = this.drawDataLen;
                // 有无遍历到有效绘图操作
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type != 4 /* BLEND */ && data.type != 7 /* ACT_BUFFER */) {
                            drawState = true;
                        }
                        // 如果与上一次buffer操作之间无有效绘图，上一次操作无效
                        if (!drawState && data.type == 7 /* ACT_BUFFER */) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 7 /* ACT_BUFFER */;
                _data.buffer = buffer;
                _data.width = buffer.rootRenderTarget.width;
                _data.height = buffer.rootRenderTarget.height;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            /*
             * 压入enabel scissor命令
             */
            p.pushEnableScissor = function (x, y, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 8 /* ENABLE_SCISSOR */;
                data.x = x;
                data.y = y;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /*
             * 压入disable scissor命令
             */
            p.pushDisableScissor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 9 /* DISABLE_SCISSOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 清空命令数组
             */
            p.clear = function () {
                for (var i = 0; i < this.drawDataLen; i++) {
                    var data = this.drawData[i];
                    data.type = 0;
                    data.count = 0;
                    data.texture = null;
                    data.filter = null;
                    data.uv = null;
                    data.value = "";
                    data.buffer = null;
                    data.width = 0;
                    data.height = 0;
                }
                this.drawDataLen = 0;
            };
            return WebGLDrawCmdManager;
        }());
        web.WebGLDrawCmdManager = WebGLDrawCmdManager;
        egret.registerClass(WebGLDrawCmdManager,'egret.web.WebGLDrawCmdManager');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
         * 顶点数组管理对象
         * 用来维护顶点数组
         */
        var WebGLVertexArrayObject = (function () {
            function WebGLVertexArrayObject() {
                this.size = 2000;
                this.vertexMaxSize = this.size * 4;
                this.indicesMaxSize = this.size * 6;
                this.vertSize = 5;
                this.vertices = null;
                this.indices = null;
                this.indicesForMesh = null;
                this.vertexIndex = 0;
                this.indexIndex = 0;
                this.hasMesh = false;
                var numVerts = this.vertexMaxSize * this.vertSize;
                var numIndices = this.indicesMaxSize;
                this.vertices = new Float32Array(numVerts);
                this.indices = new Uint16Array(numIndices);
                this.indicesForMesh = new Uint16Array(numIndices);
                for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
                    this.indices[i + 0] = j + 0;
                    this.indices[i + 1] = j + 1;
                    this.indices[i + 2] = j + 2;
                    this.indices[i + 3] = j + 0;
                    this.indices[i + 4] = j + 2;
                    this.indices[i + 5] = j + 3;
                }
            }
            var d = __define,c=WebGLVertexArrayObject,p=c.prototype;
            /**
             * 是否达到最大缓存数量
             */
            p.reachMaxSize = function (vertexCount, indexCount) {
                if (vertexCount === void 0) { vertexCount = 4; }
                if (indexCount === void 0) { indexCount = 6; }
                return this.vertexIndex > this.vertexMaxSize - vertexCount || this.indexIndex > this.indicesMaxSize - indexCount;
            };
            /**
             * 获取缓存完成的顶点数组
             */
            p.getVertices = function () {
                var view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
                return view;
            };
            /**
             * 获取缓存完成的索引数组
             */
            p.getIndices = function () {
                return this.indices;
            };
            /**
             * 获取缓存完成的mesh索引数组
             */
            p.getMeshIndices = function () {
                return this.indicesForMesh;
            };
            /**
             * 切换成mesh索引缓存方式
             */
            p.changeToMeshIndices = function () {
                if (!this.hasMesh) {
                    // 拷贝默认index信息到for mesh中
                    for (var i = 0, l = this.indexIndex; i < l; ++i) {
                        this.indicesForMesh[i] = this.indices[i];
                    }
                    this.hasMesh = true;
                }
            };
            p.isMesh = function () {
                return this.hasMesh;
            };
            /**
             * 默认构成矩形
             */
            // private defaultMeshVertices = [0, 0, 1, 0, 1, 1, 0, 1];
            // private defaultMeshUvs = [
            //     0, 0,
            //     1, 0,
            //     1, 1,
            //     0, 1
            // ];
            // private defaultMeshIndices = [0, 1, 2, 0, 2, 3];
            /**
             * 缓存一组顶点
             */
            p.cacheArrays = function (transform, alpha, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices) {
                //计算出绘制矩阵，之后把矩阵还原回之前的
                var locWorldTransform = transform;
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
                if (meshVertices) {
                    // 计算索引位置与赋值
                    var vertices = this.vertices;
                    var index = this.vertexIndex * this.vertSize;
                    // 缓存顶点数组
                    var i = 0, iD = 0, l = 0;
                    var u = 0, v = 0, x = 0, y = 0;
                    for (i = 0, l = meshUVs.length; i < l; i += 2) {
                        iD = i * 5 / 2;
                        x = meshVertices[i];
                        y = meshVertices[i + 1];
                        u = meshUVs[i];
                        v = meshUVs[i + 1];
                        // xy
                        vertices[index + iD + 0] = a * x + c * y + tx;
                        vertices[index + iD + 1] = b * x + d * y + ty;
                        // uv
                        vertices[index + iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                        vertices[index + iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                        // alpha
                        vertices[index + iD + 4] = alpha;
                    }
                    // 缓存索引数组
                    if (this.hasMesh) {
                        for (var i = 0, l = meshIndices.length; i < l; ++i) {
                            this.indicesForMesh[this.indexIndex + i] = meshIndices[i] + this.vertexIndex;
                        }
                    }
                    this.vertexIndex += meshUVs.length / 2;
                    this.indexIndex += meshIndices.length;
                }
                else {
                    var width = textureSourceWidth;
                    var height = textureSourceHeight;
                    var w = sourceWidth;
                    var h = sourceHeight;
                    sourceX = sourceX / width;
                    sourceY = sourceY / height;
                    sourceWidth = sourceWidth / width;
                    sourceHeight = sourceHeight / height;
                    var vertices = this.vertices;
                    var index = this.vertexIndex * this.vertSize;
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
                    // 缓存索引数组
                    if (this.hasMesh) {
                        var indicesForMesh = this.indicesForMesh;
                        indicesForMesh[this.indexIndex + 0] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 1] = 1 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 2] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 3] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 4] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 5] = 3 + this.vertexIndex;
                    }
                    this.vertexIndex += 4;
                    this.indexIndex += 6;
                }
            };
            p.clear = function () {
                this.hasMesh = false;
                this.vertexIndex = 0;
                this.indexIndex = 0;
            };
            return WebGLVertexArrayObject;
        }());
        web.WebGLVertexArrayObject = WebGLVertexArrayObject;
        egret.registerClass(WebGLVertexArrayObject,'egret.web.WebGLVertexArrayObject');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
         * WebGLRenderTarget类
         * 一个WebGL渲染目标，拥有一个frame buffer和texture
         */
        var WebGLRenderTarget = (function () {
            function WebGLRenderTarget(gl, width, height) {
                // 清除色
                this.clearColor = [0, 0, 0, 0];
                // 是否启用frame buffer, 默认为true
                this.useFrameBuffer = true;
                this.gl = gl;
                // 如果尺寸为 0 chrome会报警
                this.width = width || 1;
                this.height = height || 1;
                // 创建材质
                this.texture = this.createTexture();
                // 创建frame buffer
                this.frameBuffer = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                // 绑定材质
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
                // 绑定stencil buffer
                this.stencilBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);
            }
            var d = __define,c=WebGLRenderTarget,p=c.prototype;
            /**
             * 重置render target的尺寸
             */
            p.resize = function (width, height) {
                var gl = this.gl;
                // 设置texture尺寸
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                // gl.bindTexture(gl.TEXTURE_2D, null);
                // 设置render buffer的尺寸
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer); // 是否需要强制绑定？
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer); // 是否需要强制绑定？
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
                this.width = width;
                this.height = height;
                // 此处不解绑是否会造成bug？
                // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            };
            /**
             * 激活此render target
             */
            p.activate = function () {
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
            };
            /**
             * 获取frame buffer
             */
            p.getFrameBuffer = function () {
                if (!this.useFrameBuffer) {
                    return null;
                }
                return this.frameBuffer;
            };
            /**
             * 创建材质
             * TODO 创建材质的方法可以合并
             */
            p.createTexture = function () {
                var gl = this.gl;
                var texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                return texture;
            };
            /**
             * 清除render target颜色缓存
             */
            p.clear = function (bind) {
                var gl = this.gl;
                if (bind) {
                    this.activate();
                }
                gl.colorMask(true, true, true, true);
                gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
                gl.clear(gl.COLOR_BUFFER_BIT);
            };
            return WebGLRenderTarget;
        }());
        web.WebGLRenderTarget = WebGLRenderTarget;
        egret.registerClass(WebGLRenderTarget,'egret.web.WebGLRenderTarget');
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
            return canvas;
        }
        /**
         * @private
         * WebGL上下文对象，提供简单的绘图接口
         * 抽象出此类，以实现共用一个context
         */
        var WebGLRenderContext = (function () {
            function WebGLRenderContext(width, height) {
                this.glID = null;
                this.projectionX = NaN;
                this.projectionY = NaN;
                this.shaderManager = null;
                this.contextLost = false;
                this.$scissorState = false;
                this.vertSize = 5;
                this.blurFilter = null;
                this.surface = createCanvas(width, height);
                this.initWebGL();
                this.$bufferStack = [];
                var gl = this.context;
                this.vertexBuffer = gl.createBuffer();
                this.indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                this.drawCmdManager = new web.WebGLDrawCmdManager();
                this.vao = new web.WebGLVertexArrayObject();
                this.setGlobalCompositeOperation("source-over");
            }
            var d = __define,c=WebGLRenderContext,p=c.prototype;
            WebGLRenderContext.getInstance = function (width, height) {
                if (this.instance) {
                    return this.instance;
                }
                this.instance = new WebGLRenderContext(width, height);
                return this.instance;
            };
            /**
             * 推入一个RenderBuffer并绑定
             */
            p.pushBuffer = function (buffer) {
                this.$bufferStack.push(buffer);
                if (buffer != this.currentBuffer) {
                    if (this.currentBuffer) {
                    }
                    this.drawCmdManager.pushActivateBuffer(buffer);
                }
                this.currentBuffer = buffer;
            };
            /**
             * 推出一个RenderBuffer并绑定上一个RenderBuffer
             */
            p.popBuffer = function () {
                // 如果只剩下一个buffer，则不执行pop操作
                // 保证舞台buffer永远在最开始
                if (this.$bufferStack.length <= 1) {
                    return;
                }
                var buffer = this.$bufferStack.pop();
                var lastBuffer = this.$bufferStack[this.$bufferStack.length - 1];
                // 重新绑定
                if (buffer != lastBuffer) {
                    // this.$drawWebGL();
                    this.drawCmdManager.pushActivateBuffer(lastBuffer);
                }
                this.currentBuffer = lastBuffer;
            };
            /**
             * 启用RenderBuffer
             */
            p.activateBuffer = function (buffer) {
                buffer.rootRenderTarget.activate();
                if (!this.bindIndices) {
                    this.uploadIndicesArray(this.vao.getIndices());
                    this.bindIndices = true;
                }
                buffer.restoreStencil();
                buffer.restoreScissor();
                this.onResize(buffer.width, buffer.height);
            };
            /**
             * 上传顶点数据
             */
            p.uploadVerticesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
                // gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
            };
            /**
             * 上传索引数据
             */
            p.uploadIndicesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
            };
            /**
             * 销毁绘制对象
             */
            p.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            p.onResize = function (width, height) {
                var width = width || this.surface.width;
                var height = height || this.surface.height;
                this.projectionX = width / 2;
                this.projectionY = -height / 2;
                if (this.context) {
                    this.context.viewport(0, 0, width, height);
                }
            };
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
                this.onResize();
            };
            p.initWebGL = function () {
                this.onResize();
                this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
                this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);
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
                    antialias: WebGLRenderContext.antialias,
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
            };
            p.setContext = function (gl) {
                this.context = gl;
                gl.id = WebGLRenderContext.glContextId++;
                this.glID = gl.id;
                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.CULL_FACE);
                gl.enable(gl.BLEND);
                gl.colorMask(true, true, true, true);
                // 目前只使用0号材质单元，默认开启
                gl.activeTexture(gl.TEXTURE0);
            };
            /**
             * 开启模版检测
             */
            p.enableStencilTest = function () {
                var gl = this.context;
                gl.enable(gl.STENCIL_TEST);
            };
            /**
             * 关闭模版检测
             */
            p.disableStencilTest = function () {
                var gl = this.context;
                gl.disable(gl.STENCIL_TEST);
            };
            /**
             * 开启scissor检测
             */
            p.enableScissorTest = function (rect) {
                var gl = this.context;
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(rect.x, rect.y, rect.width, rect.height);
            };
            /**
             * 关闭scissor检测
             */
            p.disableScissorTest = function () {
                var gl = this.context;
                gl.disable(gl.SCISSOR_TEST);
            };
            /**
             * 获取像素信息
             */
            p.getPixels = function (x, y, width, height, pixels) {
                var gl = this.context;
                gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            };
            /**
             * 创建一个WebGLTexture
             */
            p.createTexture = function (bitmapData) {
                var gl = this.context;
                var texture = gl.createTexture();
                if (!texture) {
                    //先创建texture失败,然后lost事件才发出来..
                    this.contextLost = true;
                    return;
                }
                texture.glContext = gl;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                return texture;
            };
            p.createTextureFromCompressedData = function (data, width, height, levels, internalFormat) {
                return null;
            };
            /**
             * 更新材质的bitmapData
             */
            p.updateTexture = function (texture, bitmapData) {
                var gl = this.context;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            };
            /**
             * 获取一个WebGLTexture
             * 如果有缓存的texture返回缓存的texture，如果没有则创建并缓存texture
             */
            p.getWebGLTexture = function (bitmapData) {
                if (!bitmapData.webGLTexture) {
                    if (bitmapData.format == "image") {
                        bitmapData.webGLTexture = this.createTexture(bitmapData.source);
                    }
                    else if (bitmapData.format == "pvr") {
                        bitmapData.webGLTexture = this.createTextureFromCompressedData(bitmapData.source.pvrtcData, bitmapData.width, bitmapData.height, bitmapData.source.mipmapsCount, bitmapData.source.format);
                    }
                    if (bitmapData.$deleteSource && bitmapData.webGLTexture) {
                        bitmapData.source = null;
                    }
                }
                return bitmapData.webGLTexture;
            };
            /**
             * 清除矩形区域
             */
            p.clearRect = function (x, y, width, height) {
                if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                    var buffer = this.currentBuffer;
                    if (buffer.$hasScissor) {
                        this.setGlobalCompositeOperation("destination-out");
                        this.drawRect(x, y, width, height);
                        this.setGlobalCompositeOperation("source-over");
                    }
                    else {
                        var m = buffer.globalMatrix;
                        if (m.b == 0 && m.c == 0) {
                            x = x * m.a + m.tx;
                            y = y * m.d + m.ty;
                            width = width * m.a;
                            height = height * m.d;
                            this.enableScissor(x, -y - height + buffer.height, width, height);
                            this.clear();
                            this.disableScissor();
                        }
                        else {
                            this.setGlobalCompositeOperation("destination-out");
                            this.drawRect(x, y, width, height);
                            this.setGlobalCompositeOperation("source-over");
                        }
                    }
                }
                else {
                    this.clear();
                }
            };
            /**
             * 设置混色
             */
            p.setGlobalCompositeOperation = function (value) {
                this.drawCmdManager.pushSetBlend(value);
            };
            /**
             * 绘制图片，image参数可以是BitmapData或者renderTarget
             */
            p.drawImage = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                if (image.source && image.source["texture"]) {
                    // 如果是render target
                    texture = image.source["texture"];
                    buffer.saveTransform();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2); // 翻转
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight);
                if (image.source && image.source["texture"]) {
                    buffer.restoreTransform();
                }
            };
            /**
             * 绘制Mesh
             */
            p.drawMesh = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                if (image.source && image.source["texture"]) {
                    // 如果是render target
                    texture = image.source["texture"];
                    buffer.saveTransform();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2); // 翻转
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds);
            };
            /**
             * 绘制材质
             */
            p.drawTexture = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, bounds) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !texture || !buffer) {
                    return;
                }
                if (meshVertices && meshIndices) {
                    if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                        this.$drawWebGL();
                    }
                }
                else {
                    if (this.vao.reachMaxSize()) {
                        this.$drawWebGL();
                    }
                }
                if (meshUVs) {
                    this.vao.changeToMeshIndices();
                }
                var transform = buffer.globalMatrix;
                var alpha = buffer.globalAlpha;
                var count = meshIndices ? meshIndices.length / 3 : 2;
                // 应用$filter，因为只可能是colorMatrixFilter，最后两个参数可不传
                this.drawCmdManager.pushDrawTexture(texture, count, this.$filter);
                this.vao.cacheArrays(transform, alpha, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices);
            };
            /**
             * 绘制矩形（仅用于遮罩擦除等）
             */
            p.drawRect = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushDrawRect();
                this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, width, height, x, y, width, height, width, height);
            };
            /**
             * 绘制遮罩
             */
            p.pushMask = function (mask) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                buffer.$stencilList.push(mask);
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                var length = mask.length;
                if (length) {
                    this.drawCmdManager.pushPushMask(length);
                    for (var i = 0; i < length; i++) {
                        var item = mask[i];
                        this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, item.width, item.height, item.minX, item.minY, item.width, item.height, item.width, item.height);
                    }
                }
                else {
                    this.drawCmdManager.pushPushMask();
                    this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
                }
            };
            /**
             * 恢复遮罩
             */
            p.popMask = function () {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                var mask = buffer.$stencilList.pop();
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                var length = mask.length;
                if (length) {
                    this.drawCmdManager.pushPopMask(length);
                    for (var i = 0; i < length; i++) {
                        var item = mask[i];
                        this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, item.width, item.height, item.minX, item.minY, item.width, item.height, item.width, item.height);
                    }
                }
                else {
                    this.drawCmdManager.pushPopMask();
                    this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
                }
            };
            /**
             * 清除颜色缓存
             */
            p.clear = function () {
                this.drawCmdManager.pushClearColor();
            };
            /**
             * 开启scissor test
             */
            p.enableScissor = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushEnableScissor(x, y, width, height);
                buffer.$hasScissor = true;
            };
            /**
             * 关闭scissor test
             */
            p.disableScissor = function () {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushDisableScissor();
                buffer.$hasScissor = false;
            };
            p.$drawWebGL = function () {
                if (this.drawCmdManager.drawDataLen == 0 || this.contextLost) {
                    return;
                }
                this.uploadVerticesArray(this.vao.getVertices());
                // 有mesh，则使用indicesForMesh
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getMeshIndices());
                }
                var length = this.drawCmdManager.drawDataLen;
                var offset = 0;
                for (var i = 0; i < length; i++) {
                    var data = this.drawCmdManager.drawData[i];
                    offset = this.drawData(data, offset);
                    // 计算draw call
                    if (data.type == 7 /* ACT_BUFFER */) {
                        this.activatedBuffer = data.buffer;
                    }
                    if (data.type == 0 /* TEXTURE */ || data.type == 1 /* RECT */ || data.type == 2 /* PUSH_MASK */ || data.type == 3 /* POP_MASK */) {
                        if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                            this.activatedBuffer.$drawCalls++;
                        }
                    }
                }
                // 切换回默认indices
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                // 清空数据
                this.drawCmdManager.clear();
                this.vao.clear();
            };
            /**
             * 执行绘制命令
             */
            p.drawData = function (data, offset) {
                if (!data) {
                    return;
                }
                switch (data.type) {
                    case 0 /* TEXTURE */:
                        var filter = data.filter;
                        var shader;
                        if (filter) {
                            if (filter.type == "colorTransform") {
                                shader = this.shaderManager.colorTransformShader;
                                shader.setMatrix(filter.$matrix);
                            }
                            else if (filter.type == "blur") {
                                shader = this.shaderManager.blurShader;
                                shader.setBlur(filter.$blurX, filter.$blurY);
                                shader.setTextureSize(data.textureWidth, data.textureHeight);
                            }
                            else if (filter.type == "glow") {
                                shader = this.shaderManager.glowShader;
                                shader.setDistance(filter.$distance || 0);
                                shader.setAngle(filter.$angle ? filter.$angle / 180 * Math.PI : 0);
                                shader.setColor(filter.$red / 255, filter.$green / 255, filter.$blue / 255);
                                shader.setAlpha(filter.$alpha);
                                shader.setBlurX(filter.$blurX);
                                shader.setBlurY(filter.$blurY);
                                shader.setStrength(filter.$strength);
                                shader.setInner(filter.$inner ? 1 : 0);
                                shader.setKnockout(filter.$knockout ? 0 : 1);
                                shader.setHideObject(filter.$hideObject ? 1 : 0);
                                shader.setTextureSize(data.textureWidth, data.textureHeight);
                            }
                        }
                        else {
                            shader = this.shaderManager.defaultShader;
                        }
                        shader.setProjection(this.projectionX, this.projectionY);
                        this.shaderManager.activateShader(shader, this.vertSize * 4);
                        shader.syncUniforms();
                        offset += this.drawTextureElements(data, offset);
                        break;
                    case 1 /* RECT */:
                        var shader = this.shaderManager.primitiveShader;
                        shader.setProjection(this.projectionX, this.projectionY);
                        this.shaderManager.activateShader(shader, this.vertSize * 4);
                        shader.syncUniforms();
                        offset += this.drawRectElements(data, offset);
                        break;
                    case 2 /* PUSH_MASK */:
                        var shader = this.shaderManager.primitiveShader;
                        shader.setProjection(this.projectionX, this.projectionY);
                        this.shaderManager.activateShader(shader, this.vertSize * 4);
                        shader.syncUniforms();
                        offset += this.drawPushMaskElements(data, offset);
                        break;
                    case 3 /* POP_MASK */:
                        var shader = this.shaderManager.primitiveShader;
                        shader.setProjection(this.projectionX, this.projectionY);
                        this.shaderManager.activateShader(shader, this.vertSize * 4);
                        shader.syncUniforms();
                        offset += this.drawPopMaskElements(data, offset);
                        break;
                    case 4 /* BLEND */:
                        this.setBlendMode(data.value);
                        break;
                    case 5 /* RESIZE_TARGET */:
                        data.buffer.rootRenderTarget.resize(data.width, data.height);
                        this.onResize(data.width, data.height);
                        break;
                    case 6 /* CLEAR_COLOR */:
                        if (this.activatedBuffer) {
                            var target = this.activatedBuffer.rootRenderTarget;
                            if (target.width != 0 || target.height != 0) {
                                target.clear();
                            }
                        }
                        break;
                    case 7 /* ACT_BUFFER */:
                        this.activateBuffer(data.buffer);
                        break;
                    case 8 /* ENABLE_SCISSOR */:
                        var buffer = this.activatedBuffer;
                        if (buffer) {
                            buffer.enableScissor(data.x, data.y, data.width, data.height);
                        }
                        break;
                    case 9 /* DISABLE_SCISSOR */:
                        var buffer = this.activatedBuffer;
                        if (buffer) {
                            buffer.disableScissor();
                        }
                        break;
                    default:
                        break;
                }
                return offset;
            };
            /**
             * 画texture
             **/
            p.drawTextureElements = function (data, offset) {
                var gl = this.context;
                gl.bindTexture(gl.TEXTURE_2D, data.texture);
                var size = data.count * 3;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            /**
             * @private
             * 画rect
             **/
            p.drawRectElements = function (data, offset) {
                var gl = this.context;
                // gl.bindTexture(gl.TEXTURE_2D, null);
                var size = data.count * 3;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            /**
             * 画push mask
             **/
            p.drawPushMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    if (buffer.stencilHandleCount == 0) {
                        buffer.enableStencil();
                        gl.clear(gl.STENCIL_BUFFER_BIT); // clear
                    }
                    var level = buffer.stencilHandleCount;
                    buffer.stencilHandleCount++;
                    gl.colorMask(false, false, false, false);
                    gl.stencilFunc(gl.EQUAL, level, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                    // gl.bindTexture(gl.TEXTURE_2D, null);
                    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.colorMask(true, true, true, true);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                }
                return size;
            };
            /**
             * 画pop mask
             **/
            p.drawPopMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    buffer.stencilHandleCount--;
                    if (buffer.stencilHandleCount == 0) {
                        buffer.disableStencil(); // skip this draw
                    }
                    else {
                        var level = buffer.stencilHandleCount;
                        gl.colorMask(false, false, false, false);
                        gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                        // gl.bindTexture(gl.TEXTURE_2D, null);
                        gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                        gl.stencilFunc(gl.EQUAL, level, 0xFF);
                        gl.colorMask(true, true, true, true);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                    }
                }
                return size;
            };
            /**
             * 设置混色
             */
            p.setBlendMode = function (value) {
                var gl = this.context;
                var blendModeWebGL = WebGLRenderContext.blendModesForGL[value];
                if (blendModeWebGL) {
                    gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                }
            };
            /**
             * 应用滤镜绘制给定的render target
             * 此方法不会导致input被释放，所以如果需要释放input，需要调用此方法后手动调用release
             */
            p.drawTargetWidthFilters = function (filters, input) {
                var originInput = input, filtersLen = filters.length, output;
                // 应用前面的滤镜
                if (filtersLen > 1) {
                    for (var i = 0; i < filtersLen - 1; i++) {
                        var filter = filters[i];
                        var width = input.rootRenderTarget.width;
                        var height = input.rootRenderTarget.height;
                        output = web.WebGLRenderBuffer.create(width, height);
                        output.setTransform(1, 0, 0, 1, 0, 0);
                        output.globalAlpha = 1;
                        this.drawToRenderTarget(filter, input, output);
                        if (input != originInput) {
                            web.WebGLRenderBuffer.release(input);
                        }
                        input = output;
                    }
                }
                // 应用最后一个滤镜并绘制到当前场景中
                var filter = filters[filtersLen - 1];
                this.drawToRenderTarget(filter, input, this.currentBuffer);
                // 释放掉用于交换的buffer
                if (input != originInput) {
                    web.WebGLRenderBuffer.release(input);
                }
            };
            /**
             * 向一个renderTarget中绘制
             * */
            p.drawToRenderTarget = function (filter, input, output) {
                if (this.contextLost) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.pushBuffer(output);
                var originInput = input, temp, width = input.rootRenderTarget.width, height = input.rootRenderTarget.height;
                // 模糊滤镜实现为blurX与blurY的叠加
                if (filter.type == "blur") {
                    if (!this.blurFilter) {
                        this.blurFilter = new egret.BlurFilter(2, 2);
                    }
                    if (filter.blurX != 0 && filter.blurY != 0) {
                        this.blurFilter.blurX = filter.blurX;
                        this.blurFilter.blurY = 0;
                        temp = web.WebGLRenderBuffer.create(width, height);
                        temp.setTransform(1, 0, 0, 1, 0, 0);
                        temp.globalAlpha = 1;
                        this.drawToRenderTarget(this.blurFilter, input, temp);
                        if (input != originInput) {
                            web.WebGLRenderBuffer.release(input);
                        }
                        input = temp;
                        this.blurFilter.blurX = 0;
                        this.blurFilter.blurY = filter.blurY;
                    }
                    else {
                        this.blurFilter.blurX = filter.blurX;
                        this.blurFilter.blurY = filter.blurY;
                    }
                    filter = this.blurFilter;
                }
                // 绘制input结果到舞台
                output.saveTransform();
                output.transform(1, 0, 0, -1, 0, height);
                this.vao.cacheArrays(output.globalMatrix, output.globalAlpha, 0, 0, width, height, 0, 0, width, height, width, height);
                output.restoreTransform();
                var filterData;
                if (filter.type == "blur") {
                    // 实现blurx与blurY分开处理，会借用公用filter
                    // 为了允许公用filter的存在，这里拷贝filter到对象中
                    filterData = { type: "blur", $blurX: filter.$blurX, $blurY: filter.$blurY };
                }
                else {
                    filterData = filter;
                }
                this.drawCmdManager.pushDrawTexture(input["rootRenderTarget"].texture, 2, filterData, width, height);
                // 释放掉input
                if (input != originInput) {
                    web.WebGLRenderBuffer.release(input);
                }
                this.popBuffer();
            };
            WebGLRenderContext.initBlendMode = function () {
                WebGLRenderContext.blendModesForGL = {};
                WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
                WebGLRenderContext.blendModesForGL["lighter"] = [1, 772];
                WebGLRenderContext.blendModesForGL["lighter-in"] = [770, 771];
                WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
                WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
            };
            /**
             * 改变渲染缓冲为指定大小，但保留原始图像数据
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
             * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
             */
            // public resizeTo(width:number, height:number, offsetX:number, offsetY:number):void {
            //     this.surface.width = width;
            //     this.surface.height = height;
            // }
            WebGLRenderContext.glContextId = 0;
            WebGLRenderContext.blendModesForGL = null;
            return WebGLRenderContext;
        }());
        web.WebGLRenderContext = WebGLRenderContext;
        egret.registerClass(WebGLRenderContext,'egret.web.WebGLRenderContext');
        WebGLRenderContext.initBlendMode();
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
         * WebGL渲染缓存
         */
        var WebGLRenderBuffer = (function () {
            function WebGLRenderBuffer(width, height, root) {
                this.globalAlpha = 1;
                /**
                 * stencil state
                 * 模版开关状态
                 */
                this.stencilState = false;
                this.$stencilList = [];
                this.stencilHandleCount = 0;
                /**
                 * scissor state
                 * scissor 开关状态
                 */
                this.$scissorState = false;
                this.scissorRect = new egret.Rectangle();
                this.$hasScissor = true;
                // dirtyRegionPolicy hack
                this.dirtyRegionPolicy = true;
                this._dirtyRegionPolicy = true; // 默认设置为true，保证第一帧绘制在frameBuffer上
                this.$drawCalls = 0;
                this.$computeDrawCall = false;
                this.globalMatrix = new egret.Matrix();
                this.savedGlobalMatrix = new egret.Matrix();
                // 获取webglRenderContext
                this.context = web.WebGLRenderContext.getInstance(width, height);
                // buffer 对应的 render target
                this.rootRenderTarget = new web.WebGLRenderTarget(this.context.context, 3, 3);
                if (width && height) {
                    this.resize(width, height);
                }
                // 如果是第一个加入的buffer，说明是舞台buffer
                this.root = root;
                // 如果是用于舞台渲染的renderBuffer，则默认添加renderTarget到renderContext中，而且是第一个
                if (this.root) {
                    this.context.pushBuffer(this);
                    // 画布
                    this.surface = this.context.surface;
                }
                else {
                    // 由于创建renderTarget造成的frameBuffer绑定，这里重置绑定
                    var lastBuffer = this.context.activatedBuffer;
                    if (lastBuffer) {
                        lastBuffer.rootRenderTarget.activate();
                    }
                    this.surface = this.rootRenderTarget;
                }
            }
            var d = __define,c=WebGLRenderBuffer,p=c.prototype;
            p.enableStencil = function () {
                if (!this.stencilState) {
                    this.context.enableStencilTest();
                    this.stencilState = true;
                }
            };
            p.disableStencil = function () {
                if (this.stencilState) {
                    this.context.disableStencilTest();
                    this.stencilState = false;
                }
            };
            p.restoreStencil = function () {
                if (this.stencilState) {
                    this.context.enableStencilTest();
                }
                else {
                    this.context.disableStencilTest();
                }
            };
            p.enableScissor = function (x, y, width, height) {
                if (!this.$scissorState) {
                    this.$scissorState = true;
                    this.scissorRect.setTo(x, y, width, height);
                    this.context.enableScissorTest(this.scissorRect);
                }
            };
            p.disableScissor = function () {
                if (this.$scissorState) {
                    this.$scissorState = false;
                    this.scissorRect.setEmpty();
                    this.context.disableScissorTest();
                }
            };
            p.restoreScissor = function () {
                if (this.$scissorState) {
                    this.context.enableScissorTest(this.scissorRect);
                }
                else {
                    this.context.disableScissorTest();
                }
            };
            d(p, "width"
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                ,function () {
                    return this.rootRenderTarget.width;
                }
            );
            d(p, "height"
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                ,function () {
                    return this.rootRenderTarget.height;
                }
            );
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            p.resize = function (width, height, useMaxSize) {
                this.context.pushBuffer(this);
                width = width || 1;
                height = height || 1;
                // render target 尺寸重置
                if (width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                    this.context.drawCmdManager.pushResize(this, width, height);
                    // 同步更改宽高
                    this.rootRenderTarget.width = width;
                    this.rootRenderTarget.height = height;
                }
                // 如果是舞台的渲染缓冲，执行resize，否则surface大小不随之改变
                if (this.root) {
                    this.context.resize(width, height, useMaxSize);
                }
                this.context.clear();
                this.context.popBuffer();
            };
            /**
             * 改变渲染缓冲为指定大小，但保留原始图像数据
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
             * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
             */
            p.resizeTo = function (width, height, offsetX, offsetY) {
                this.context.pushBuffer(this);
                var oldWidth = this.rootRenderTarget.width;
                var oldHeight = this.rootRenderTarget.height;
                var tempBuffer = WebGLRenderBuffer.create(oldWidth, oldHeight);
                this.context.pushBuffer(tempBuffer);
                this.context.drawImage(this.rootRenderTarget, 0, 0, oldWidth, oldHeight, 0, 0, oldWidth, oldHeight, oldWidth, oldHeight);
                this.context.popBuffer();
                this.resize(width, height);
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.context.drawImage(tempBuffer.rootRenderTarget, 0, 0, oldWidth, oldHeight, offsetX, offsetY, oldWidth, oldHeight, oldWidth, oldHeight);
                WebGLRenderBuffer.release(tempBuffer);
                this.context.popBuffer();
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
                this.context.pushBuffer(this);
                if (this.root) {
                    // dirtyRegionPolicy hack
                    if (this._dirtyRegionPolicy) {
                        this.rootRenderTarget.useFrameBuffer = true;
                        this.rootRenderTarget.activate();
                    }
                    else {
                        this.rootRenderTarget.useFrameBuffer = false;
                        this.rootRenderTarget.activate();
                        this.context.clear();
                    }
                }
                offsetX = +offsetX || 0;
                offsetY = +offsetY || 0;
                this.setTransform(1, 0, 0, 1, offsetX, offsetY);
                var length = regions.length;
                //只有一个区域且刚好为舞台大小时,不设置模板
                if (length == 1 && regions[0].minX == 0 && regions[0].minY == 0 &&
                    regions[0].width == this.rootRenderTarget.width && regions[0].height == this.rootRenderTarget.height) {
                    this.maskPushed = false;
                    this.rootRenderTarget.useFrameBuffer && this.context.clear();
                    this.context.popBuffer();
                    return;
                }
                // 擦除脏矩形区域
                for (var i = 0; i < length; i++) {
                    var region = regions[i];
                    this.context.clearRect(region.minX, region.minY, region.width, region.height);
                }
                // 设置模版
                if (length > 0) {
                    // 对第一个且只有一个mask用scissor处理
                    if (!this.$hasScissor && length == 1) {
                        var region = regions[0];
                        regions = regions.slice(1);
                        var x = region.minX + offsetX;
                        var y = region.minY + offsetY;
                        var width = region.width;
                        var height = region.height;
                        this.context.enableScissor(x, -y - height + this.height, width, height);
                        this.scissorEnabled = true;
                    }
                    else {
                        this.scissorEnabled = false;
                    }
                    if (regions.length > 0) {
                        this.context.pushMask(regions);
                        this.maskPushed = true;
                    }
                    else {
                        this.maskPushed = false;
                    }
                    this.offsetX = offsetX;
                    this.offsetY = offsetY;
                }
                else {
                    this.maskPushed = false;
                }
                this.context.popBuffer();
            };
            /**
             * 取消上一次设置的clip。
             */
            p.endClip = function () {
                if (this.maskPushed || this.scissorEnabled) {
                    this.context.pushBuffer(this);
                    if (this.maskPushed) {
                        this.setTransform(1, 0, 0, 1, this.offsetX, this.offsetY);
                        this.context.popMask();
                    }
                    if (this.scissorEnabled) {
                        this.context.disableScissor();
                    }
                    this.context.popBuffer();
                }
            };
            /**
             * 获取指定坐标的像素
             */
            p.getPixel = function (x, y) {
                var pixels = new Uint8Array(4);
                var useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.context.getPixels(x, y, 1, 1, pixels);
                this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
                this.rootRenderTarget.activate();
                return pixels;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            p.toDataURL = function (type, encoderOptions) {
                return this.context.surface.toDataURL(type, encoderOptions);
            };
            /**
             * 销毁绘制对象
             */
            p.destroy = function () {
                this.context.destroy();
            };
            p.onRenderFinish = function () {
                this.$drawCalls = 0;
                // 如果是舞台渲染buffer，判断脏矩形策略
                if (this.root) {
                    // dirtyRegionPolicy hack
                    if (!this._dirtyRegionPolicy && this.dirtyRegionPolicy) {
                        this.drawSurfaceToFrameBuffer(0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height, 0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height, true);
                    }
                    if (this._dirtyRegionPolicy) {
                        this.drawFrameBufferToSurface(0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height, 0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height);
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
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest(); // 切换frameBuffer注意要禁用STENCIL_TEST
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            /**
             * 交换surface的图像到frameBuffer中
             * @param width 宽度
             * @param height 高度
             */
            p.drawSurfaceToFrameBuffer = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest(); // 切换frameBuffer注意要禁用STENCIL_TEST
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            /**
             * 清空缓冲区数据
             */
            p.clear = function () {
                this.context.clear();
            };
            p.setTransform = function (a, b, c, d, tx, ty) {
                // this.globalMatrix.setTo(a, b, c, d, tx, ty);
                var matrix = this.globalMatrix;
                matrix.a = a;
                matrix.b = b;
                matrix.c = c;
                matrix.d = d;
                matrix.tx = tx;
                matrix.ty = ty;
            };
            p.transform = function (a, b, c, d, tx, ty) {
                // this.globalMatrix.append(a, b, c, d, tx, ty);
                var matrix = this.globalMatrix;
                var a1 = matrix.a;
                var b1 = matrix.b;
                var c1 = matrix.c;
                var d1 = matrix.d;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    matrix.a = a * a1 + b * c1;
                    matrix.b = a * b1 + b * d1;
                    matrix.c = c * a1 + d * c1;
                    matrix.d = c * b1 + d * d1;
                }
                matrix.tx = tx * a1 + ty * c1 + matrix.tx;
                matrix.ty = tx * b1 + ty * d1 + matrix.ty;
            };
            p.translate = function (dx, dy) {
                // this.globalMatrix.translate(dx, dy);
                var matrix = this.globalMatrix;
                matrix.tx += dx;
                matrix.ty += dy;
            };
            p.saveTransform = function () {
                // this.savedGlobalMatrix.copyFrom(this.globalMatrix);
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                sMatrix.a = matrix.a;
                sMatrix.b = matrix.b;
                sMatrix.c = matrix.c;
                sMatrix.d = matrix.d;
                sMatrix.tx = matrix.tx;
                sMatrix.ty = matrix.ty;
            };
            p.restoreTransform = function () {
                // this.globalMatrix.copyFrom(this.savedGlobalMatrix);
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                matrix.a = sMatrix.a;
                matrix.b = sMatrix.b;
                matrix.c = sMatrix.c;
                matrix.d = sMatrix.d;
                matrix.tx = sMatrix.tx;
                matrix.ty = sMatrix.ty;
            };
            /**
             * 创建一个buffer实例
             */
            WebGLRenderBuffer.create = function (width, height) {
                var buffer = renderBufferPool.pop();
                // width = Math.min(width, 1024);
                // height = Math.min(height, 1024);
                if (buffer) {
                    buffer.resize(width, height);
                }
                else {
                    buffer = new WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            /**
             * 回收一个buffer实例
             */
            WebGLRenderBuffer.release = function (buffer) {
                renderBufferPool.push(buffer);
            };
            return WebGLRenderBuffer;
        }());
        web.WebGLRenderBuffer = WebGLRenderBuffer;
        egret.registerClass(WebGLRenderBuffer,'egret.web.WebGLRenderBuffer',["egret.sys.RenderBuffer"]);
        var renderBufferPool = []; //渲染缓冲区对象池
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
                var webglBufferContext = webglBuffer.context;
                var root = forRenderTexture ? displayObject : null;
                webglBufferContext.pushBuffer(webglBuffer);
                //绘制显示对象
                this.drawDisplayObject(displayObject, webglBuffer, dirtyList, matrix, null, null, root);
                webglBufferContext.$drawWebGL();
                var drawCall = webglBuffer.$drawCalls;
                webglBuffer.onRenderFinish();
                webglBufferContext.popBuffer();
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
                var filterPushed = false;
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
                        buffer.globalAlpha = renderAlpha;
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
                        var filters = child.$getFilters();
                        if (filters && filters.length > 0) {
                            drawCalls += this.drawWithFilter(child, buffer, dirtyList, matrix, clipRegion, root);
                        }
                        else if ((child.$blendMode !== 0 ||
                            (child.$mask && (child.$mask.$parentDisplayList || root)))) {
                            drawCalls += this.drawWithClip(child, buffer, dirtyList, matrix, clipRegion, root);
                        }
                        else if (child.$scrollRect || child.$maskRect) {
                            drawCalls += this.drawWithScrollRect(child, buffer, dirtyList, matrix, clipRegion, root);
                        }
                        else {
                            if (child["isFPS"]) {
                                buffer.context.$drawWebGL();
                                buffer.$computeDrawCall = false;
                                this.drawDisplayObject(child, buffer, dirtyList, matrix, child.$displayList, clipRegion, root);
                                buffer.context.$drawWebGL();
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
            p.drawWithFilter = function (displayObject, buffer, dirtyList, matrix, clipRegion, root) {
                var drawCalls = 0;
                var filters = displayObject.$getFilters();
                var hasBlendMode = (displayObject.$blendMode !== 0);
                if (hasBlendMode) {
                    var compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                if (filters.length == 1 && filters[0].type == "colorTransform" && !displayObject.$children) {
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    buffer.context.$filter = filters[0];
                    if ((displayObject.$mask && (displayObject.$mask.$parentDisplayList || root))) {
                        drawCalls += this.drawWithClip(displayObject, buffer, dirtyList, matrix, clipRegion, root);
                    }
                    else if (displayObject.$scrollRect || displayObject.$maskRect) {
                        drawCalls += this.drawWithScrollRect(displayObject, buffer, dirtyList, matrix, clipRegion, root);
                    }
                    else {
                        drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, clipRegion, root);
                    }
                    buffer.context.$filter = null;
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    return drawCalls;
                }
                // 获取显示对象的链接矩阵
                var displayMatrix = egret.Matrix.create();
                displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
                // 获取显示对象的矩形区域
                var region;
                region = egret.sys.Region.create();
                var bounds = displayObject.$getOriginalBounds();
                region.updateRegion(bounds, displayMatrix);
                // 为显示对象创建一个新的buffer
                // todo 这里应该计算 region.x region.y
                var displayBuffer = this.createRenderBuffer(region.width, region.height);
                displayBuffer.context.pushBuffer(displayBuffer);
                displayBuffer.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                var offsetM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                //todo 可以优化减少draw次数
                if ((displayObject.$mask && (displayObject.$mask.$parentDisplayList || root))) {
                    drawCalls += this.drawWithClip(displayObject, displayBuffer, dirtyList, offsetM, region, root);
                }
                else if (displayObject.$scrollRect || displayObject.$maskRect) {
                    drawCalls += this.drawWithScrollRect(displayObject, displayBuffer, dirtyList, offsetM, region, root);
                }
                else {
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, dirtyList, offsetM, displayObject.$displayList, region, root);
                }
                egret.Matrix.release(offsetM);
                displayBuffer.context.popBuffer();
                //绘制结果到屏幕
                if (drawCalls > 0) {
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls++;
                    buffer.globalAlpha = 1;
                    buffer.setTransform(1, 0, 0, 1, region.minX + matrix.tx, region.minY + matrix.ty);
                    // 绘制结果的时候，应用滤镜
                    buffer.context.drawTargetWidthFilters(filters, displayBuffer);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                }
                renderBufferPool.push(displayBuffer);
                egret.sys.Region.release(region);
                egret.Matrix.release(displayMatrix);
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
                var mask = displayObject.$mask;
                if (mask) {
                    var maskRenderNode = mask.$getRenderNode();
                    if (maskRenderNode) {
                        var maskRenderMatrix = maskRenderNode.renderMatrix;
                        //遮罩scaleX或scaleY为0，放弃绘制
                        if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                            return drawCalls;
                        }
                    }
                }
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
                        buffer.context.pushMask(scrollRect);
                    }
                    //绘制显示对象
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, region, null);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    if (scrollRect) {
                        buffer.context.popMask();
                    }
                    egret.sys.Region.release(region);
                    egret.Matrix.release(displayMatrix);
                    return drawCalls;
                }
                else {
                    //绘制显示对象自身，若有scrollRect，应用clip
                    var displayBuffer = this.createRenderBuffer(region.width, region.height);
                    // var displayContext = displayBuffer.context;
                    displayBuffer.context.pushBuffer(displayBuffer);
                    displayBuffer.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                    var offsetM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, dirtyList, offsetM, displayObject.$displayList, region, root);
                    //绘制遮罩
                    if (mask) {
                        //如果只有一次绘制或是已经被cache直接绘制到displayContext
                        //webgl暂时无法添加,因为会有边界像素没有被擦除
                        //var maskRenderNode = mask.$getRenderNode();
                        //if (maskRenderNode && maskRenderNode.$getRenderCount() == 1 || mask.$displayList) {
                        //    displayBuffer.context.setGlobalCompositeOperation("destination-in");
                        //    drawCalls += this.drawDisplayObject(mask, displayBuffer, dirtyList, offsetM,
                        //        mask.$displayList, region, root);
                        //}
                        //else {
                        var maskBuffer = this.createRenderBuffer(region.width, region.height);
                        maskBuffer.context.pushBuffer(maskBuffer);
                        maskBuffer.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                        offsetM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                        var calls = this.drawDisplayObject(mask, maskBuffer, dirtyList, offsetM, mask.$displayList, region, root);
                        maskBuffer.context.popBuffer();
                        if (calls > 0) {
                            drawCalls += calls;
                            displayBuffer.context.setGlobalCompositeOperation("destination-in");
                            displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                            displayBuffer.globalAlpha = 1;
                            var maskBufferWidth = maskBuffer.rootRenderTarget.width;
                            var maskBufferHeight = maskBuffer.rootRenderTarget.height;
                            displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight, 0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                            displayBuffer.context.setGlobalCompositeOperation("source-over");
                        }
                        renderBufferPool.push(maskBuffer);
                    }
                    egret.Matrix.release(offsetM);
                    displayBuffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    displayBuffer.context.popBuffer();
                    //绘制结果到屏幕
                    if (drawCalls > 0) {
                        drawCalls++;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        if (scrollRect) {
                            var m = displayMatrix;
                            displayBuffer.setTransform(m.a, m.b, m.c, m.d, m.tx - region.minX, m.ty - region.minY);
                            displayBuffer.context.pushMask(scrollRect);
                        }
                        buffer.globalAlpha = 1;
                        buffer.setTransform(1, 0, 0, -1, region.minX + matrix.tx, region.minY + matrix.ty + displayBuffer.height);
                        var displayBufferWidth = displayBuffer.rootRenderTarget.width;
                        var displayBufferHeight = displayBuffer.rootRenderTarget.height;
                        buffer.context.drawTexture(displayBuffer.rootRenderTarget.texture, 0, 0, displayBufferWidth, displayBufferHeight, 0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                        if (scrollRect) {
                            displayBuffer.context.popMask();
                        }
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
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
                if (root) {
                    displayObject.$getConcatenatedMatrixAt(root, m);
                }
                else if (displayObject.$parentDisplayList) {
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
                var context = buffer.context;
                var scissor = false;
                if (buffer.$hasScissor || m.b != 0 || m.c != 0) {
                    context.pushMask(scrollRect);
                }
                else {
                    var x = scrollRect.x;
                    var y = scrollRect.y;
                    var w = scrollRect.width;
                    var h = scrollRect.height;
                    x = x * m.a + m.tx + matrix.tx;
                    y = y * m.d + m.ty + matrix.ty;
                    w = w * m.a;
                    h = h * m.d;
                    context.enableScissor(x, -y - h + buffer.height, w, h);
                    scissor = true;
                }
                drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, region, root);
                buffer.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);
                if (scissor) {
                    context.disableScissor();
                }
                else {
                    context.popMask();
                }
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
                //pushRenderTARGET
                webglBuffer.context.pushBuffer(webglBuffer);
                webglBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                this.renderNode(node, buffer, forHitTest);
                webglBuffer.context.$drawWebGL();
                webglBuffer.onRenderFinish();
                //popRenderTARGET
                webglBuffer.context.popBuffer();
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
                    case 6 /* SetAlphaNode */:
                        buffer.globalAlpha = node.drawData[0];
                        break;
                    case 7 /* MeshNode */:
                        this.renderMesh(node, buffer);
                        break;
                }
            };
            /**
             * @private
             */
            p.renderBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                //buffer.imageSmoothingEnabled = node.smoothing;
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                if (m) {
                    buffer.saveTransform();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                //这里不考虑嵌套
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                if (alpha == alpha) {
                    var originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    buffer.restoreTransform();
                }
            };
            /**
             * @private
             */
            p.renderMesh = function (node, buffer) {
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
                    buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds);
                }
                if (m) {
                    buffer.restoreTransform();
                }
            };
            /**
             * @private
             */
            p.renderText = function (node, buffer) {
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (node.drawData.length == 0) {
                    return;
                }
                if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                    this.canvasRenderer = new egret.CanvasRenderer();
                    this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                }
                else if (node.dirtyRender) {
                    this.canvasRenderBuffer.resize(width, height);
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (node.x || node.y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                    }
                    buffer.transform(1, 0, 0, 1, node.x, node.y);
                }
                if (node.dirtyRender) {
                    var surface = this.canvasRenderBuffer.surface;
                    this.canvasRenderer.renderText(node, this.canvasRenderBuffer.context);
                    // 拷贝canvas到texture
                    var texture = node.$texture;
                    if (!texture) {
                        texture = buffer.context.createTexture(surface);
                        node.$texture = texture;
                    }
                    else {
                        // 重新拷贝新的图像
                        buffer.context.updateTexture(texture, surface);
                    }
                    // 保存材质尺寸
                    node.$textureWidth = surface.width;
                    node.$textureHeight = surface.height;
                }
                var textureWidth = node.$textureWidth;
                var textureHeight = node.$textureHeight;
                buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth, textureHeight, textureWidth, textureHeight);
                if (node.x || node.y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.translate(node.x, node.y);
                    }
                    buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                }
                node.dirtyRender = false;
            };
            /**
             * @private
             */
            p.renderGraphics = function (node, buffer, forHitTest) {
                var width = node.width;
                var height = node.height;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                    this.canvasRenderer = new egret.CanvasRenderer();
                    this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                }
                else if (node.dirtyRender || forHitTest) {
                    this.canvasRenderBuffer.resize(width, height);
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                    }
                    buffer.transform(1, 0, 0, 1, node.x, node.y);
                }
                var surface = this.canvasRenderBuffer.surface;
                if (forHitTest) {
                    this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context, true);
                    egret.WebGLUtils.deleteWebGLTexture(surface);
                    var texture = buffer.context.getWebGLTexture(surface);
                    buffer.context.drawTexture(texture, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height);
                }
                else {
                    if (node.dirtyRender) {
                        this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context);
                        // 拷贝canvas到texture
                        var texture = node.$texture;
                        if (!texture) {
                            texture = buffer.context.createTexture(surface);
                            node.$texture = texture;
                        }
                        else {
                            // 重新拷贝新的图像
                            buffer.context.updateTexture(texture, surface);
                        }
                        // 保存材质尺寸
                        node.$textureWidth = surface.width;
                        node.$textureHeight = surface.height;
                    }
                    var textureWidth = node.$textureWidth;
                    var textureHeight = node.$textureHeight;
                    buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth, textureHeight, textureWidth, textureHeight);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(node.x, node.y);
                    }
                    buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                }
                if (!forHitTest) {
                    node.dirtyRender = false;
                }
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
                    buffer.resize(width, height);
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
