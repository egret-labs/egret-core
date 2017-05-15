var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
if (true && window['HTMLVideoElement'] == undefined) {
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
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var EgretShaderLib = (function () {
            function EgretShaderLib() {
            }
            return EgretShaderLib;
        }());
        EgretShaderLib.blur_frag = "precision mediump float;\nuniform vec2 blur;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\nuniform vec2 uTextureSize;\nvoid main()\n{\n    const int sampleRadius = 5;\n    const int samples = sampleRadius * 2 + 1;\n    vec2 blurUv = blur / uTextureSize;\n    vec4 color = vec4(0, 0, 0, 0);\n    vec2 uv = vec2(0.0, 0.0);\n    blurUv /= float(sampleRadius);\n    for (int i = -sampleRadius; i <= sampleRadius; i++) {\n        uv.x = vTextureCoord.x + float(i) * blurUv.x;\n        uv.y = vTextureCoord.y + float(i) * blurUv.y;\n        color += texture2D(uSampler, uv);\n    }\n    color /= float(samples);\n    gl_FragColor = color;\n}";
        EgretShaderLib.colorTransform_frag = "precision mediump float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform mat4 matrix;\nuniform vec4 colorAdd;\nuniform sampler2D uSampler;\nvoid main(void) {\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\n    if(texColor.a > 0.) {\n        texColor = vec4(texColor.rgb / texColor.a, texColor.a);\n    }\n    vec4 locColor = clamp(texColor * matrix + colorAdd, 0., 1.);\n    gl_FragColor = vColor * vec4(locColor.rgb * locColor.a, locColor.a);\n}";
        EgretShaderLib.default_vert = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec2 aColor;\nuniform vec2 projectionVector;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nconst vec2 center = vec2(-1.0, 1.0);\nvoid main(void) {\n   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n}";
        EgretShaderLib.glow_frag = "precision mediump float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float dist;\nuniform float angle;\nuniform vec4 color;\nuniform float alpha;\nuniform float blurX;\nuniform float blurY;\nuniform float strength;\nuniform float inner;\nuniform float knockout;\nuniform float hideObject;\nuniform vec2 uTextureSize;\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\nvoid main(void) {\n    vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);\n    const float linearSamplingTimes = 7.0;\n    const float circleSamplingTimes = 12.0;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float curDistanceX = 0.0;\n    float curDistanceY = 0.0;\n    float offsetX = dist * cos(angle) * px.x;\n    float offsetY = dist * sin(angle) * px.y;\n    const float PI = 3.14159265358979323846264;\n    float cosAngle;\n    float sinAngle;\n    float offset = PI * 2.0 / circleSamplingTimes * random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    float stepX = blurX * px.x / linearSamplingTimes;\n    float stepY = blurY * px.y / linearSamplingTimes;\n    for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {\n        cosAngle = cos(a + offset);\n        sinAngle = sin(a + offset);\n        for (float i = 1.0; i <= linearSamplingTimes; i++) {\n            curDistanceX = i * stepX * cosAngle;\n            curDistanceY = i * stepY * sinAngle;\n            \n            curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));\n            totalAlpha += (linearSamplingTimes - i) * curColor.a;\n            maxTotalAlpha += (linearSamplingTimes - i);\n        }\n    }\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;\n    ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);\n    vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));\n    vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));\n    float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);\n    gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);\n}";
        EgretShaderLib.primitive_frag = "precision lowp float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvoid main(void) {\n    gl_FragColor = vColor;\n}";
        EgretShaderLib.texture_frag = "precision lowp float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform sampler2D uSampler;\nvoid main(void) {\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;\n}";
        web.EgretShaderLib = EgretShaderLib;
        __reflect(EgretShaderLib.prototype, "egret.web.EgretShaderLib");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
;
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                return _this;
            }
            Object.defineProperty(HtmlSound.prototype, "length", {
                get: function () {
                    if (this.originAudio) {
                        return this.originAudio.duration;
                    }
                    throw new Error("sound not loaded!");
                    //return 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            HtmlSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (true && !url) {
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
                if (HtmlSound.clearAudios[this.url]) {
                    delete HtmlSound.clearAudios[this.url];
                }
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
            HtmlSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (true && this.loaded == false) {
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
            HtmlSound.prototype.close = function () {
                if (this.loaded == false && this.originAudio)
                    this.originAudio.src = "";
                if (this.originAudio)
                    this.originAudio = null;
                HtmlSound.$clear(this.url);
            };
            HtmlSound.$clear = function (url) {
                HtmlSound.clearAudios[url] = true;
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
                if (HtmlSound.clearAudios[url]) {
                    return;
                }
                var array = HtmlSound.audios[url];
                if (HtmlSound.audios[url] == null) {
                    array = HtmlSound.audios[url] = [];
                }
                array.push(audio);
            };
            return HtmlSound;
        }(egret.EventDispatcher));
        /**
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        HtmlSound.MUSIC = "music";
        /**
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        HtmlSound.EFFECT = "effect";
        /**
         * @private
         */
        HtmlSound.audios = {};
        HtmlSound.clearAudios = {};
        web.HtmlSound = HtmlSound;
        __reflect(HtmlSound.prototype, "egret.web.HtmlSound", ["egret.Sound"]);
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.$startTime = 0;
                /**
                 * @private
                 */
                _this.audio = null;
                //声音是否已经播放完成
                _this.isStopped = false;
                _this.canPlay = function () {
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
                _this.onPlayEnd = function () {
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
                /**
                 * @private
                 */
                _this._volume = 1;
                audio.addEventListener("ended", _this.onPlayEnd);
                _this.audio = audio;
                return _this;
            }
            HtmlSoundChannel.prototype.$play = function () {
                if (this.isStopped) {
                    egret.$error(1036);
                    return;
                }
                try {
                    //this.audio.pause();
                    this.audio.volume = this._volume;
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
            HtmlSoundChannel.prototype.stop = function () {
                if (!this.audio)
                    return;
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
                var audio = this.audio;
                audio.removeEventListener("ended", this.onPlayEnd);
                audio.volume = 0;
                this._volume = 0;
                this.audio = null;
                var url = this.$url;
                //延迟一定时间再停止，规避chrome报错
                window.setTimeout(function () {
                    audio.pause();
                    web.HtmlSound.$recycle(url, audio);
                }, 200);
            };
            Object.defineProperty(HtmlSoundChannel.prototype, "volume", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return this._volume;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                    this._volume = value;
                    if (!this.audio)
                        return;
                    this.audio.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HtmlSoundChannel.prototype, "position", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.audio)
                        return 0;
                    return this.audio.currentTime;
                },
                enumerable: true,
                configurable: true
            });
            return HtmlSoundChannel;
        }(egret.EventDispatcher));
        web.HtmlSoundChannel = HtmlSoundChannel;
        __reflect(HtmlSoundChannel.prototype, "egret.web.HtmlSoundChannel", ["egret.SoundChannel", "egret.IEventDispatcher"]);
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                return _this;
            }
            /**
             * @inheritDoc
             */
            QQSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (true && !url) {
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
            Object.defineProperty(QQSound.prototype, "length", {
                get: function () {
                    throw new Error("qq sound not supported!");
                    //return 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            QQSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (true && this.loaded == false) {
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
            QQSound.prototype.close = function () {
            };
            return QQSound;
        }(egret.EventDispatcher));
        /**
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        QQSound.MUSIC = "music";
        /**
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        QQSound.EFFECT = "effect";
        web.QQSound = QQSound;
        __reflect(QQSound.prototype, "egret.web.QQSound", ["egret.Sound"]);
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.$startTime = 0;
                //声音是否已经播放完成
                _this.isStopped = false;
                /**
                 * @private
                 */
                _this.onPlayEnd = function () {
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
                _this._startTime = 0;
                return _this;
            }
            QQSoundChannel.prototype.$play = function () {
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
            QQSoundChannel.prototype.stop = function () {
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
            Object.defineProperty(QQSoundChannel.prototype, "volume", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return 1;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QQSoundChannel.prototype, "position", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return (Date.now() - this._startTime) / 1000;
                },
                enumerable: true,
                configurable: true
            });
            return QQSoundChannel;
        }(egret.EventDispatcher));
        web.QQSoundChannel = QQSoundChannel;
        __reflect(QQSoundChannel.prototype, "egret.web.QQSoundChannel", ["egret.SoundChannel", "egret.IEventDispatcher"]);
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
            return WebAudioDecode;
        }());
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
        web.WebAudioDecode = WebAudioDecode;
        __reflect(WebAudioDecode.prototype, "egret.web.WebAudioDecode");
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                return _this;
            }
            Object.defineProperty(WebAudioSound.prototype, "length", {
                get: function () {
                    if (this.audioBuffer) {
                        return this.audioBuffer.duration;
                    }
                    throw new Error("sound not loaded!");
                    //return 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @inheritDoc
             */
            WebAudioSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";
                request.onreadystatechange = function () {
                    if (request.readyState == 4) {
                        var ioError = (request.status >= 400 || request.status == 0);
                        if (ioError) {
                            self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                        }
                        else {
                            WebAudioDecode.decodeArr.push({
                                "buffer": request.response,
                                "success": onAudioLoaded,
                                "fail": onAudioError,
                                "self": self,
                                "url": self.url
                            });
                            WebAudioDecode.decodeAudios();
                        }
                    }
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
            WebAudioSound.prototype.play = function (startTime, loops) {
                startTime = +startTime || 0;
                loops = +loops || 0;
                if (true && this.loaded == false) {
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
            WebAudioSound.prototype.close = function () {
            };
            return WebAudioSound;
        }(egret.EventDispatcher));
        /**
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        WebAudioSound.MUSIC = "music";
        /**
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        WebAudioSound.EFFECT = "effect";
        web.WebAudioSound = WebAudioSound;
        __reflect(WebAudioSound.prototype, "egret.web.WebAudioSound", ["egret.Sound"]);
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.$startTime = 0;
                /**
                 * @private
                 */
                _this.bufferSource = null;
                /**
                 * @private
                 */
                _this.context = web.WebAudioDecode.ctx;
                //声音是否已经播放完成
                _this.isStopped = false;
                /**
                 * @private
                 */
                _this._currentTime = 0;
                /**
                 * @private
                 */
                _this._volume = 1;
                /**
                 * @private
                 */
                _this.onPlayEnd = function () {
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
                _this._startTime = 0;
                if (_this.context["createGain"]) {
                    _this.gain = _this.context["createGain"]();
                }
                else {
                    _this.gain = _this.context["createGainNode"]();
                }
                return _this;
            }
            WebAudioSoundChannel.prototype.$play = function () {
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
            WebAudioSoundChannel.prototype.stop = function () {
                if (this.bufferSource) {
                    var sourceNode = this.bufferSource;
                    if (sourceNode.stop) {
                        sourceNode.stop(0);
                    }
                    else {
                        sourceNode.noteOff(0);
                    }
                    sourceNode.onended = null;
                    sourceNode.disconnect();
                    this.bufferSource = null;
                    this.$audioBuffer = null;
                }
                if (!this.isStopped) {
                    egret.sys.$popSoundChannel(this);
                }
                this.isStopped = true;
            };
            Object.defineProperty(WebAudioSoundChannel.prototype, "volume", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    return this._volume;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (this.isStopped) {
                        egret.$error(1036);
                        return;
                    }
                    this._volume = value;
                    this.gain.gain.value = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebAudioSoundChannel.prototype, "position", {
                /**
                 * @private
                 * @inheritDoc
                 */
                get: function () {
                    if (this.bufferSource) {
                        return (Date.now() - this._startTime) / 1000 + this.$startTime;
                    }
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            return WebAudioSoundChannel;
        }(egret.EventDispatcher));
        web.WebAudioSoundChannel = WebAudioSoundChannel;
        __reflect(WebAudioSoundChannel.prototype, "egret.web.WebAudioSoundChannel", ["egret.SoundChannel", "egret.IEventDispatcher"]);
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
                if (cache === void 0) { cache = true; }
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.loaded = false;
                /**
                 * @private
                 */
                _this.closed = false;
                /**
                 * @private
                 */
                _this.heightSet = NaN;
                /**
                 * @private
                 */
                _this.widthSet = NaN;
                /**
                 * @private
                 * pc上视频卡住的时候不能暂停
                 */
                _this.waiting = false;
                /**
                 * @private
                 * 用户是否设置了 pause
                 */
                _this.userPause = false;
                /**
                 * @private
                 * 用户是否设置了 play
                 */
                _this.userPlay = false;
                _this.isPlayed = false;
                _this.screenChanged = function (e) {
                    var isfullscreen = document.fullscreenEnabled || document.webkitIsFullScreen;
                    if (!isfullscreen) {
                        _this.checkFullScreen(false);
                        if (!egret.Capabilities.isMobile) {
                            _this._fullscreen = isfullscreen;
                        }
                    }
                };
                _this._fullscreen = true;
                /**
                 * @private
                 *
                 */
                _this.onVideoLoaded = function () {
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
                _this.$renderNode = new egret.sys.BitmapNode();
                _this.src = url;
                _this.once(egret.Event.ADDED_TO_STAGE, _this.loadPoster, _this);
                if (url) {
                    _this.load();
                }
                return _this;
            }
            /**
             * @inheritDoc
             */
            WebVideo.prototype.load = function (url, cache) {
                var _this = this;
                if (cache === void 0) { cache = true; }
                url = url || this.src;
                this.src = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                if (this.video && this.video.src == url) {
                    return;
                }
                var video;
                if (!this.video || egret.Capabilities.isMobile) {
                    video = document.createElement("video");
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
                var firstPause = false;
                video.addEventListener("canplay", function () {
                    _this.waiting = false;
                    if (!firstPause) {
                        firstPause = true;
                        video.pause();
                    }
                    else {
                        if (_this.userPause) {
                            _this.pause();
                        }
                        else if (_this.userPlay) {
                            _this.play();
                        }
                    }
                });
                video.addEventListener("waiting", function () {
                    _this.waiting = true;
                });
                video.load();
                this.videoPlay();
                video.style.position = "absolute";
                video.style.top = "0px";
                video.style.zIndex = "-88888";
                video.style.left = "0px";
                video.height = 1;
                video.width = 1;
            };
            /**
             * @inheritDoc
             */
            WebVideo.prototype.play = function (startTime, loop) {
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
            WebVideo.prototype.videoPlay = function () {
                this.userPause = false;
                if (this.waiting) {
                    this.userPlay = true;
                    return;
                }
                this.userPlay = false;
                this.video.play();
            };
            WebVideo.prototype.checkFullScreen = function (playFullScreen) {
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
                this.videoPlay();
            };
            WebVideo.prototype.goFullscreen = function () {
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
            WebVideo.prototype.setFullScreenMonitor = function (use) {
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
            WebVideo.prototype.screenError = function () {
                egret.$error(3014);
            };
            WebVideo.prototype.exitFullscreen = function () {
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
            WebVideo.prototype.onVideoEnded = function () {
                this.pause();
                this.isPlayed = false;
                this.$invalidateContentBounds();
                this.dispatchEventWith(egret.Event.ENDED);
            };
            /**
             * @private
             *
             */
            WebVideo.prototype.onVideoError = function () {
                this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
            };
            /**
             * @inheritDoc
             */
            WebVideo.prototype.close = function () {
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
            WebVideo.prototype.pause = function () {
                this.userPlay = false;
                if (this.waiting) {
                    this.userPause = true;
                    return;
                }
                this.userPause = false;
                egret.stopTick(this.markDirty, this);
                this.$invalidate();
            };
            Object.defineProperty(WebVideo.prototype, "volume", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.video)
                        return 1;
                    return this.video.volume;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (!this.video)
                        return;
                    this.video.volume = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "position", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.video)
                        return 0;
                    return this.video.currentTime;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (!this.video)
                        return;
                    this.video.currentTime = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "fullscreen", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    return this._fullscreen;
                },
                /**
                 * @inheritDoc
                 */
                set: function (value) {
                    if (egret.Capabilities.isMobile) {
                        return;
                    }
                    this._fullscreen = !!value;
                    if (this.video && this.video.paused == false) {
                        this.checkFullScreen(this._fullscreen);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "bitmapData", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (!this.video || !this.loaded)
                        return null;
                    if (!this._bitmapData) {
                        this.video.width = this.video.videoWidth;
                        this.video.height = this.video.videoHeight;
                        this._bitmapData = new egret.BitmapData(this.video);
                        this._bitmapData.$deleteSource = false;
                    }
                    return this._bitmapData;
                },
                enumerable: true,
                configurable: true
            });
            WebVideo.prototype.loadPoster = function () {
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
            WebVideo.prototype.$measureContentBounds = function (bounds) {
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
            WebVideo.prototype.getPlayWidth = function () {
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
            WebVideo.prototype.getPlayHeight = function () {
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
            WebVideo.prototype.$render = function () {
                var node = this.$renderNode;
                var bitmapData = this.bitmapData;
                var posterData = this.posterData;
                var width = this.getPlayWidth();
                var height = this.getPlayHeight();
                if ((!this.isPlayed || egret.Capabilities.isMobile) && posterData) {
                    node.image = posterData;
                    node.imageWidth = width;
                    node.imageHeight = height;
                    node.drawImage(0, 0, posterData.width, posterData.height, 0, 0, width, height);
                }
                else if (this.isPlayed && bitmapData) {
                    node.image = bitmapData;
                    node.imageWidth = bitmapData.width;
                    node.imageHeight = bitmapData.height;
                    egret.WebGLUtils.deleteWebGLTexture(bitmapData.webGLTexture);
                    bitmapData.webGLTexture = null;
                    node.drawImage(0, 0, bitmapData.width, bitmapData.height, 0, 0, width, height);
                }
            };
            WebVideo.prototype.markDirty = function () {
                this.$invalidate();
                return true;
            };
            /**
             * @private
             * 设置显示高度
             */
            WebVideo.prototype.$setHeight = function (value) {
                this.heightSet = +value || 0;
                this.$invalidate();
                this.$invalidateContentBounds();
                return _super.prototype.$setHeight.call(this, value);
            };
            /**
             * @private
             * 设置显示宽度
             */
            WebVideo.prototype.$setWidth = function (value) {
                this.widthSet = +value || 0;
                this.$invalidate();
                this.$invalidateContentBounds();
                return _super.prototype.$setWidth.call(this, value);
            };
            Object.defineProperty(WebVideo.prototype, "paused", {
                get: function () {
                    if (this.video) {
                        return this.video.paused;
                    }
                    return true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebVideo.prototype, "length", {
                /**
                 * @inheritDoc
                 */
                get: function () {
                    if (this.video) {
                        return this.video.duration;
                    }
                    throw new Error("Video not loaded!");
                },
                enumerable: true,
                configurable: true
            });
            return WebVideo;
        }(egret.DisplayObject));
        web.WebVideo = WebVideo;
        __reflect(WebVideo.prototype, "egret.web.WebVideo", ["egret.Video", "egret.DisplayObject"]);
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this._url = "";
                _this._method = "";
                return _this;
            }
            Object.defineProperty(WebHttpRequest.prototype, "response", {
                /**
                 * @private
                 * 本次请求返回的数据，数据类型根据responseType设置的值确定。
                 */
                get: function () {
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
                        return w.convertResponseBodyToText(this._xhr["responseBody"]);
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
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHttpRequest.prototype, "responseType", {
                /**
                 * @private
                 * 设置返回的数据格式，请使用 HttpResponseType 里定义的枚举值。设置非法的值或不设置，都将使用HttpResponseType.TEXT。
                 */
                get: function () {
                    return this._responseType;
                },
                set: function (value) {
                    this._responseType = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebHttpRequest.prototype, "withCredentials", {
                /**
                 * @private
                 * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。(这个标志不会影响同站的请求)
                 */
                get: function () {
                    return this._withCredentials;
                },
                set: function (value) {
                    this._withCredentials = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             *
             * @returns
             */
            WebHttpRequest.prototype.getXHR = function () {
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
            WebHttpRequest.prototype.open = function (url, method) {
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
            WebHttpRequest.prototype.send = function (data) {
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
            WebHttpRequest.prototype.abort = function () {
                if (this._xhr) {
                    this._xhr.abort();
                }
            };
            /**
             * @private
             * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
             */
            WebHttpRequest.prototype.getAllResponseHeaders = function () {
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
            WebHttpRequest.prototype.setRequestHeader = function (header, value) {
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
            WebHttpRequest.prototype.getResponseHeader = function (header) {
                if (!this._xhr) {
                    return null;
                }
                var result = this._xhr.getResponseHeader(header);
                return result ? result : "";
            };
            /**
             * @private
             */
            WebHttpRequest.prototype.onReadyStateChange = function () {
                var xhr = this._xhr;
                if (xhr.readyState == 4) {
                    var ioError_1 = (xhr.status >= 400 || xhr.status == 0);
                    var url_1 = this._url;
                    var self_1 = this;
                    window.setTimeout(function () {
                        if (ioError_1) {
                            if (true && !self_1.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                                egret.$error(1011, url_1);
                            }
                            self_1.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                        }
                        else {
                            self_1.dispatchEventWith(egret.Event.COMPLETE);
                        }
                    }, 0);
                }
            };
            /**
             * @private
             */
            WebHttpRequest.prototype.updateProgress = function (event) {
                if (event.lengthComputable) {
                    egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.PROGRESS, event.loaded, event.total);
                }
            };
            return WebHttpRequest;
        }(egret.EventDispatcher));
        web.WebHttpRequest = WebHttpRequest;
        __reflect(WebHttpRequest.prototype, "egret.web.WebHttpRequest", ["egret.HttpRequest"]);
        egret.HttpRequest = WebHttpRequest;
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
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * @private
                 * 使用 load() 方法加载成功的 BitmapData 图像数据。
                 */
                _this.data = null;
                /**
                 * @private
                 * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
                 * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
                 */
                _this._crossOrigin = null;
                /**
                 * @private
                 * 标记crossOrigin有没有被设置过,设置过之后使用设置的属性
                 */
                _this._hasCrossOriginSet = false;
                /**
                 * @private
                 */
                _this.currentImage = null;
                /**
                 * @private
                 */
                _this.request = null;
                return _this;
            }
            Object.defineProperty(WebImageLoader.prototype, "crossOrigin", {
                get: function () {
                    return this._crossOrigin;
                },
                set: function (value) {
                    this._hasCrossOriginSet = true;
                    this._crossOrigin = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             * 启动一次图像加载。注意：若之前已经调用过加载请求，重新调用 load() 将终止先前的请求，并开始新的加载。
             * @param url 要加载的图像文件的地址。
             */
            WebImageLoader.prototype.load = function (url) {
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
                    if (true) {
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
            WebImageLoader.prototype.onBlobLoaded = function (event) {
                var blob = this.request.response;
                this.request = undefined;
                this.loadImage(winURL.createObjectURL(blob));
            };
            /**
             * @private
             */
            WebImageLoader.prototype.onBlobError = function (event) {
                this.dispatchIOError(this.currentURL);
                this.request = undefined;
            };
            /**
             * @private
             */
            WebImageLoader.prototype.loadImage = function (src) {
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
            WebImageLoader.prototype.onImageComplete = function (event) {
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
            WebImageLoader.prototype.onLoadError = function (event) {
                var image = this.getImage(event);
                if (!image) {
                    return;
                }
                this.dispatchIOError(image.src);
            };
            WebImageLoader.prototype.dispatchIOError = function (url) {
                var self = this;
                window.setTimeout(function () {
                    if (true && !self.hasEventListener(egret.IOErrorEvent.IO_ERROR)) {
                        egret.$error(1011, url);
                    }
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }, 0);
            };
            /**
             * @private
             */
            WebImageLoader.prototype.getImage = function (event) {
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
            return WebImageLoader;
        }(egret.EventDispatcher));
        /**
         * @private
         * 指定是否启用跨域资源共享,如果ImageLoader实例有设置过crossOrigin属性将使用设置的属性
         */
        WebImageLoader.crossOrigin = null;
        web.WebImageLoader = WebImageLoader;
        __reflect(WebImageLoader.prototype, "egret.web.WebImageLoader", ["egret.ImageLoader"]);
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this._isNeedShow = false;
                /**
                 * @private
                 */
                _this.inputElement = null;
                /**
                 * @private
                 */
                _this.inputDiv = null;
                /**
                 * @private
                 */
                _this._gscaleX = 0;
                /**
                 * @private
                 */
                _this._gscaleY = 0;
                /**
                 * @private
                 */
                _this._isNeesHide = false;
                /**
                 * @private
                 */
                _this.textValue = "";
                /**
                 * @private
                 */
                _this.colorValue = 0xffffff;
                /**
                 * @private
                 */
                _this._styleInfoes = {};
                return _this;
            }
            /**
             * @private
             *
             * @param textfield
             */
            HTML5StageText.prototype.$setTextField = function (textfield) {
                this.$textfield = textfield;
                return true;
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.$addToStage = function () {
                this.htmlInput = egret.web.$getTextAdapter(this.$textfield);
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype._initElement = function () {
                var point = this.$textfield.localToGlobal(0, 0);
                var x = point.x;
                var y = point.y;
                // let m = this.$textfield.$renderNode.renderMatrix;
                // let cX = m.a;
                // let cY = m.d;
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
            HTML5StageText.prototype.$show = function () {
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
            HTML5StageText.prototype.onBlurHandler = function () {
                this.htmlInput.clearInputElement();
                window.scrollTo(0, 0);
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.executeShow = function () {
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
            HTML5StageText.prototype.$hide = function () {
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
            HTML5StageText.prototype.$getText = function () {
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
            HTML5StageText.prototype.$setText = function (value) {
                this.textValue = value;
                this.resetText();
                return true;
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.resetText = function () {
                if (this.inputElement) {
                    this.inputElement.value = this.textValue;
                }
            };
            HTML5StageText.prototype.$setColor = function (value) {
                this.colorValue = value;
                this.resetColor();
                return true;
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype.resetColor = function () {
                if (this.inputElement) {
                    this.setElementStyle("color", egret.toColorString(this.colorValue));
                }
            };
            HTML5StageText.prototype.$onBlur = function () {
                if (web.Html5Capatibility._System_OS == web.SystemOSType.WPHONE) {
                    egret.Event.dispatchEvent(this, "updateText", false);
                }
            };
            /**
             * @private
             *
             */
            HTML5StageText.prototype._onInput = function () {
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
            HTML5StageText.prototype.setAreaHeight = function () {
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
                        var top_1 = rap * valign;
                        var bottom = rap - top_1;
                        this.setElementStyle("padding", top_1 + "px 0px " + bottom + "px 0px");
                        this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
                    }
                }
            };
            /**
             * @private
             *
             * @param e
             */
            HTML5StageText.prototype._onClickHandler = function (e) {
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
            HTML5StageText.prototype._onDisconnect = function () {
                this.inputElement = null;
                this.dispatchEvent(new egret.Event("blur"));
            };
            /**
             * @private
             *
             * @param style
             * @param value
             */
            HTML5StageText.prototype.setElementStyle = function (style, value) {
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
            HTML5StageText.prototype.$removeFromStage = function () {
                if (this.inputElement) {
                    this.htmlInput.disconnectStageText(this);
                }
            };
            /**
             * 修改位置
             * @private
             */
            HTML5StageText.prototype.$resetStageText = function () {
                if (this.inputElement) {
                    var textfield = this.$textfield;
                    this.setElementStyle("fontFamily", textfield.fontFamily);
                    this.setElementStyle("fontStyle", textfield.italic ? "italic" : "normal");
                    this.setElementStyle("fontWeight", textfield.bold ? "bold" : "normal");
                    this.setElementStyle("textAlign", textfield.textAlign);
                    this.setElementStyle("fontSize", textfield.size * this._gscaleY + "px");
                    this.setElementStyle("color", egret.toColorString(textfield.textColor));
                    var tw = void 0;
                    if (textfield.stage) {
                        tw = textfield.localToGlobal(0, 0).x;
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
                            var top_2 = rap * valign;
                            var bottom = rap - top_2;
                            if (bottom < textfield.size / 2 * this._gscaleY) {
                                bottom = textfield.size / 2 * this._gscaleY;
                            }
                            this.setElementStyle("padding", top_2 + "px 0px " + bottom + "px 0px");
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
        __reflect(HTML5StageText.prototype, "egret.web.HTML5StageText", ["egret.StageText"]);
        egret.StageText = HTML5StageText;
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
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
            /**
             * @private
             *
             * @returns
             */
            HTMLInput.prototype.isInputOn = function () {
                return this._stageText != null;
            };
            /**
             * @private
             *
             * @param stageText
             * @returns
             */
            HTMLInput.prototype.isCurrentStageText = function (stageText) {
                return this._stageText == stageText;
            };
            /**
             * @private
             *
             * @param dom
             */
            HTMLInput.prototype.initValue = function (dom) {
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
            HTMLInput.prototype.$updateSize = function () {
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
            HTMLInput.prototype._initStageDelegateDiv = function (container, canvas) {
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
            HTMLInput.prototype.initInputElement = function (multiline) {
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
            HTMLInput.prototype.show = function () {
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
            HTMLInput.prototype.disconnectStageText = function (stageText) {
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
            HTMLInput.prototype.clearInputElement = function () {
                var self = this;
                if (self._inputElement) {
                    self._inputElement.value = "";
                    self._inputElement.onblur = null;
                    self._inputElement.style.width = "1px";
                    self._inputElement.style.height = "12px";
                    self._inputElement.style.left = "0px";
                    self._inputElement.style.top = "0px";
                    self._inputElement.style.opacity = 0;
                    var otherElement = void 0;
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
            HTMLInput.prototype.getInputElement = function (stageText) {
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
        __reflect(HTMLInput.prototype, "egret.web.HTMLInput");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
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
            context.font = font;
            return context.measureText(text).width;
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
                var key_1;
                for (var i = keys.length - 1; i >= 0; i--) {
                    key_1 = keys[i];
                    if (context[key_1] !== void 0) {
                        break;
                    }
                }
                try {
                    Object.defineProperty(context, "imageSmoothingEnabled", {
                        get: function () {
                            return this[key_1];
                        },
                        set: function (value) {
                            this[key_1] = value;
                        }
                    });
                }
                catch (e) {
                    context["imageSmoothingEnabled"] = context[key_1];
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
            Object.defineProperty(CanvasRenderBuffer.prototype, "width", {
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.surface.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderBuffer.prototype, "height", {
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.surface.height;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            CanvasRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
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
            CanvasRenderBuffer.prototype.resizeTo = function (width, height, offsetX, offsetY) {
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
            CanvasRenderBuffer.prototype.setDirtyRegionPolicy = function (state) {
            };
            /**
             * 清空并设置裁切
             * @param regions 矩形列表
             * @param offsetX 矩形要加上的偏移量x
             * @param offsetY 矩形要加上的偏移量y
             */
            CanvasRenderBuffer.prototype.beginClip = function (regions, offsetX, offsetY) {
                offsetX = +offsetX || 0;
                offsetY = +offsetY || 0;
                var pixelRatio = egret.sys.DisplayList.$pixelRatio;
                var context = this.context;
                context.save();
                context.beginPath();
                context.setTransform(1, 0, 0, 1, offsetX * pixelRatio, offsetY * pixelRatio);
                var length = regions.length;
                for (var i = 0; i < length; i++) {
                    var region = regions[i];
                    context.clearRect(region.minX * pixelRatio, region.minY * pixelRatio, region.width * pixelRatio, region.height * pixelRatio);
                    context.rect(region.minX * pixelRatio, region.minY * pixelRatio, region.width * pixelRatio, region.height * pixelRatio);
                }
                context.clip();
            };
            /**
             * 取消上一次设置的clip。
             */
            CanvasRenderBuffer.prototype.endClip = function () {
                this.context.restore();
            };
            /**
             * 获取指定区域的像素
             */
            CanvasRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                return this.context.getImageData(x, y, width, height).data;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            CanvasRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.surface.toDataURL(type, encoderOptions);
            };
            /**
             * 清空缓冲区数据
             */
            CanvasRenderBuffer.prototype.clear = function () {
                this.context.setTransform(1, 0, 0, 1, 0, 0);
                this.context.clearRect(0, 0, this.surface.width, this.surface.height);
            };
            /**
             * 销毁绘制对象
             */
            CanvasRenderBuffer.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            return CanvasRenderBuffer;
        }());
        web.CanvasRenderBuffer = CanvasRenderBuffer;
        __reflect(CanvasRenderBuffer.prototype, "egret.web.CanvasRenderBuffer", ["egret.sys.RenderBuffer"]);
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.onTouchBegin = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchBegin(location.x, location.y, event.identifier);
                };
                /**
                 * @private
                 */
                _this.onTouchMove = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchMove(location.x, location.y, event.identifier);
                };
                /**
                 * @private
                 */
                _this.onTouchEnd = function (event) {
                    var location = _this.getLocation(event);
                    _this.touch.onTouchEnd(location.x, location.y, event.identifier);
                };
                /**
                 * @private
                 */
                _this.scaleX = 1;
                /**
                 * @private
                 */
                _this.scaleY = 1;
                /**
                 * @private
                 */
                _this.rotation = 0;
                _this.canvas = canvas;
                _this.touch = new egret.sys.TouchHandler(stage);
                _this.addListeners();
                return _this;
            }
            /**
             * @private
             * 添加事件监听
             */
            WebTouchHandler.prototype.addListeners = function () {
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
            WebTouchHandler.prototype.addMouseListener = function () {
                this.canvas.addEventListener("mousedown", this.onTouchBegin);
                this.canvas.addEventListener("mousemove", this.onTouchMove);
                this.canvas.addEventListener("mouseup", this.onTouchEnd);
            };
            /**
             * @private
             *
             */
            WebTouchHandler.prototype.addTouchListener = function () {
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
            WebTouchHandler.prototype.prevent = function (event) {
                event.stopPropagation();
                if (event["isScroll"] != true && !this.canvas['userTyping']) {
                    event.preventDefault();
                }
            };
            /**
             * @private
             */
            WebTouchHandler.prototype.getLocation = function (event) {
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
            WebTouchHandler.prototype.updateScaleMode = function (scaleX, scaleY, rotation) {
                this.scaleX = scaleX;
                this.scaleY = scaleY;
                this.rotation = rotation;
            };
            /**
             * @private
             * 更新同时触摸点的数量
             */
            WebTouchHandler.prototype.$updateMaxTouches = function () {
                this.touch.$initMaxTouches();
            };
            return WebTouchHandler;
        }(egret.HashObject));
        web.WebTouchHandler = WebTouchHandler;
        __reflect(WebTouchHandler.prototype, "egret.web.WebTouchHandler");
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.isActivate = true;
                _this.stage = stage;
                _this.registerListener();
                return _this;
            }
            /**
             * @private
             *
             */
            WebHideHandler.prototype.registerListener = function () {
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
        __reflect(WebHideHandler.prototype, "egret.web.WebHideHandler");
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
            return AudioType;
        }());
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
        web.AudioType = AudioType;
        __reflect(AudioType.prototype, "egret.web.AudioType");
        /**
         * @private
         */
        var SystemOSType = (function () {
            function SystemOSType() {
            }
            return SystemOSType;
        }());
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
        web.SystemOSType = SystemOSType;
        __reflect(SystemOSType.prototype, "egret.web.SystemOSType");
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
                return _super.call(this) || this;
            }
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
                    if (checkAudioType) {
                        if (canUseWebAudio) {
                            Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                        }
                        else {
                            Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
                        }
                    }
                    if (window.hasOwnProperty("QZAppExternal") && ua.indexOf("qzone") >= 0) {
                        if (checkAudioType) {
                            Html5Capatibility.setAudioType(AudioType.QQ_AUDIO);
                        }
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
                        if (checkAudioType) {
                            Html5Capatibility.setAudioType(AudioType.WEB_AUDIO);
                        }
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
                if (ua.indexOf("egretnative") >= 0) {
                    Html5Capatibility.setAudioType(AudioType.HTML5_AUDIO);
                    Html5Capatibility._canUseBlob = true;
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
                var language = (navigator.language || navigator["browserLanguage"]).toLowerCase();
                var strings = language.split("-");
                if (strings.length > 1) {
                    strings[1] = strings[1].toUpperCase();
                }
                egret.Capabilities.$language = strings.join("-");
            };
            return Html5Capatibility;
        }(egret.HashObject));
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
        web.Html5Capatibility = Html5Capatibility;
        __reflect(Html5Capatibility.prototype, "egret.web.Html5Capatibility");
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
        var customContext;
        var context = {
            setAutoClear: function (value) {
                web.WebGLRenderBuffer.autoClear = value;
            },
            save: function () {
                // do nothing
            },
            restore: function () {
                var context = web.WebGLRenderContext.getInstance(0, 0);
                var gl = context.context;
                gl.bindBuffer(gl.ARRAY_BUFFER, context["vertexBuffer"]);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, context["indexBuffer"]);
                gl.activeTexture(gl.TEXTURE0);
                context.currentProgram = null;
                context["bindIndices"] = false;
                var buffer = context.$bufferStack[1];
                context["activateBuffer"](buffer);
                gl.enable(gl.BLEND);
                context["setBlendMode"]("source-over");
            }
        };
        function setRendererContext(custom) {
            custom.onStart(context);
            customContext = custom;
        }
        egret.setRendererContext = setRendererContext;
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
            if (options.retina) {
                //based on : https://github.com/jondavidjohn/hidpi-canvas-polyfill
                var context_1 = egret.sys.canvasHitTestBuffer.context;
                var backingStore = context_1.backingStorePixelRatio ||
                    context_1.webkitBackingStorePixelRatio ||
                    context_1.mozBackingStorePixelRatio ||
                    context_1.msBackingStorePixelRatio ||
                    context_1.oBackingStorePixelRatio ||
                    context_1.backingStorePixelRatio || 1;
                egret.sys.DisplayList.$setDevicePixelRatio((window.devicePixelRatio || 1) / backingStore);
            }
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
                if (egret.Capabilities.$renderMode == "webgl") {
                    player.stage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF;
                }
            }
            if (egret.Capabilities.$renderMode == "webgl") {
                egret.sys.DisplayList.prototype.setDirtyRegionPolicy = function () { };
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
                if (customContext) {
                    customContext.onRender(context);
                }
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
            if (customContext) {
                customContext.onResize(context);
            }
        }
        window.addEventListener("resize", function () {
            if (isNaN(resizeTimer)) {
                resizeTimer = window.setTimeout(doResize, 300);
            }
        });
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
if (true) {
    var language = navigator.language || navigator["browserLanguage"] || "en_US";
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
        var WebExternalInterface = (function () {
            function WebExternalInterface() {
            }
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
        __reflect(WebExternalInterface.prototype, "egret.web.WebExternalInterface", ["egret.ExternalInterface"]);
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretnative") < 0) {
            egret.ExternalInterface = WebExternalInterface;
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
(function (egret) {
    var web;
    (function (web) {
        var callBackDic = {};
        /**
         * @private
         */
        var NativeExternalInterface = (function () {
            function NativeExternalInterface() {
            }
            NativeExternalInterface.call = function (functionName, value) {
                var data = {};
                data.functionName = functionName;
                data.value = value;
                egret_native.sendInfoToPlugin(JSON.stringify(data));
            };
            NativeExternalInterface.addCallback = function (functionName, listener) {
                callBackDic[functionName] = listener;
            };
            return NativeExternalInterface;
        }());
        web.NativeExternalInterface = NativeExternalInterface;
        __reflect(NativeExternalInterface.prototype, "egret.web.NativeExternalInterface", ["egret.ExternalInterface"]);
        /**
         * @private
         * @param info
         */
        function onReceivedPluginInfo(info) {
            var data = JSON.parse(info);
            var functionName = data.functionName;
            var listener = callBackDic[functionName];
            if (listener) {
                var value = data.value;
                listener.call(null, value);
            }
            else {
                egret.$warn(1050, functionName);
            }
        }
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("egretnative") >= 0) {
            egret.ExternalInterface = NativeExternalInterface;
            egret_native.receivedPluginInfo = onReceivedPluginInfo;
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
         */
        var WebFps = (function (_super) {
            __extends(WebFps, _super);
            function WebFps(stage, showFPS, showLog, logFilter, styles) {
                var _this = _super.call(this) || this;
                _this.showPanle = true;
                _this.fpsHeight = 0;
                _this.WIDTH = 101;
                _this.HEIGHT = 20;
                _this.bgCanvasColor = "#18304b";
                _this.fpsFrontColor = "#18fefe";
                _this.WIDTH_COST = 33;
                _this.cost1Color = "#18fefe";
                _this.cost2Color = "#ffff00";
                _this.cost3Color = "#ff0000";
                _this.arrFps = [];
                _this.arrCost = [];
                _this.arrLog = [];
                if (showFPS || showLog) {
                    if (egret.Capabilities.renderMode == 'canvas') {
                        _this.renderMode = "Canvas";
                    }
                    else {
                        _this.renderMode = "WebGL";
                    }
                    _this.panelX = styles["x"] === undefined ? 0 : parseInt(styles['x']);
                    _this.panelY = styles["y"] === undefined ? 0 : parseInt(styles['y']);
                    _this.fontColor = styles["textColor"] === undefined ? '#ffffff' : styles['textColor'].replace("0x", "#");
                    _this.fontSize = styles["size"] === undefined ? 12 : parseInt(styles['size']);
                    if (egret.Capabilities.isMobile) {
                        _this.fontSize -= 2;
                    }
                    var all = document.createElement('div');
                    all.style.position = 'absolute';
                    all.style.background = "rgba(0,0,0," + styles['bgAlpha'] + ")";
                    all.style.left = _this.panelX + 'px';
                    all.style.top = _this.panelY + 'px';
                    all.style.pointerEvents = 'none';
                    document.body.appendChild(all);
                    var container = document.createElement('div');
                    container.style.color = _this.fontColor;
                    container.style.fontSize = _this.fontSize + 'px';
                    container.style.lineHeight = _this.fontSize + 'px';
                    container.style.margin = '4px 4px 4px 4px';
                    _this.container = container;
                    all.appendChild(container);
                    if (showFPS)
                        _this.addFps();
                    if (showLog)
                        _this.addLog();
                }
                return _this;
            }
            WebFps.prototype.addFps = function () {
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
                canvas = document.createElement('canvas');
                this.canvasCost = canvas;
                this.containerFps.appendChild(canvas);
                canvas.width = this.WIDTH;
                canvas.height = this.HEIGHT;
                context = canvas.getContext('2d');
                this.contextCost = context;
                context.fillStyle = this.bgCanvasColor;
                context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
                context.fillStyle = "#000000";
                context.fillRect(this.WIDTH_COST, 0, 1, this.HEIGHT);
                context.fillRect(this.WIDTH_COST * 2 + 1, 0, 1, this.HEIGHT);
                this.fpsHeight = this.container.offsetHeight;
            };
            WebFps.prototype.addLog = function () {
                var log = document.createElement('div');
                log.style.maxWidth = document.body.clientWidth - 8 - this.panelX + 'px';
                log.style.wordWrap = "break-word";
                this.log = log;
                this.container.appendChild(log);
            };
            WebFps.prototype.update = function (datas, showLastData) {
                if (showLastData === void 0) { showLastData = false; }
                var numFps;
                var numCostTicker;
                var numCostDirty;
                var numCostRender;
                if (!showLastData) {
                    numFps = datas.fps;
                    numCostTicker = datas.costTicker;
                    numCostDirty = datas.costDirty;
                    numCostRender = datas.costRender;
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
                    this.arrCost.shift();
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
                context = this.contextCost;
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
            WebFps.prototype.updateInfo = function (info) {
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
        __reflect(WebFps.prototype, "egret.web.WebFps", ["egret.FPSDisplay", "egret.DisplayObject"]);
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
                var length_1 = searchArr.length;
                for (var i = 0; i < length_1; i++) {
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
                var _this = _super.call(this) || this;
                _this.init(container, options);
                _this.initOrientation();
                return _this;
            }
            WebPlayer.prototype.init = function (container, options) {
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
            WebPlayer.prototype.initOrientation = function () {
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
            WebPlayer.prototype.readOption = function (container, options) {
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
            WebPlayer.prototype.attachCanvas = function (container, canvas) {
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
            };
            /**
             * @private
             * 更新播放器视口尺寸
             */
            WebPlayer.prototype.updateScreenSize = function () {
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
            WebPlayer.prototype.setContentSize = function (width, height) {
                var option = this.playerOption;
                option.contentWidth = width;
                option.contentHeight = height;
                this.updateScreenSize();
            };
            /**
             * @private
             * 更新触摸数量
             */
            WebPlayer.prototype.updateMaxTouches = function () {
                this.webTouchHandler.$updateMaxTouches();
            };
            return WebPlayer;
        }(egret.HashObject));
        web.WebPlayer = WebPlayer;
        __reflect(WebPlayer.prototype, "egret.web.WebPlayer", ["egret.sys.Screen"]);
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
            if (egret.Capabilities.$renderMode == "webgl") {
                var renderTexture = void 0;
                //webgl下非RenderTexture纹理先画到RenderTexture
                if (!texture.$renderBuffer) {
                    renderTexture = new egret.RenderTexture();
                    renderTexture.drawToTexture(new egret.Bitmap(texture));
                }
                else {
                    renderTexture = texture;
                }
                //从RenderTexture中读取像素数据，填入canvas
                var pixels = renderTexture.$renderBuffer.getPixels(rect.x, rect.y, iWidth, iHeight);
                var imageData = new ImageData(iWidth, iHeight);
                for (var i = 0; i < pixels.length; i++) {
                    imageData.data[i] = pixels[i];
                }
                sharedContext.putImageData(imageData, 0, 0);
                if (!texture.$renderBuffer) {
                    renderTexture.dispose();
                }
                return surface;
            }
            else {
                var bitmapData = texture;
                var offsetX = Math.round(bitmapData._offsetX);
                var offsetY = Math.round(bitmapData._offsetY);
                var bitmapWidth = bitmapData._bitmapWidth;
                var bitmapHeight = bitmapData._bitmapHeight;
                sharedContext.drawImage(bitmapData._bitmapData.source, bitmapData._bitmapX + rect.x / egret.$TextureScaleFactor, bitmapData._bitmapY + rect.y / egret.$TextureScaleFactor, bitmapWidth * rect.width / w, bitmapHeight * rect.height / h, offsetX, offsetY, rect.width, rect.height);
                return surface;
            }
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
        /**
         * 有些杀毒软件认为 saveToFile 可能是一个病毒文件
         */
        function eliFoTevas(type, filePath, rect) {
            var base64 = toDataURL.call(this, type, rect);
            if (base64 == null) {
                return;
            }
            var href = base64.replace(/^data:image[^;]*/, "data:image/octet-stream");
            var aLink = document.createElement('a');
            aLink['download'] = filePath;
            aLink.href = href;
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            aLink.dispatchEvent(evt);
        }
        function getPixel32(x, y) {
            egret.$warn(1041, "getPixel32", "getPixels");
            return this.getPixels(x, y);
        }
        function getPixels(x, y, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            try {
                var surface = convertImageToCanvas(this);
                var result = sharedContext.getImageData(x, y, width, height).data;
                return result;
            }
            catch (e) {
                egret.$error(1039);
            }
        }
        egret.Texture.prototype.toDataURL = toDataURL;
        egret.Texture.prototype.saveToFile = eliFoTevas;
        egret.Texture.prototype.getPixel32 = getPixel32;
        egret.Texture.prototype.getPixels = getPixels;
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
            return XMLNode;
        }());
        web.XMLNode = XMLNode;
        __reflect(XMLNode.prototype, "egret.web.XMLNode");
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
                var _this = _super.call(this, 1, parent) || this;
                /**
                 * @private
                 * 当前节点上的属性列表
                 */
                _this.attributes = {};
                /**
                 * @private
                 * 当前节点的子节点列表
                 */
                _this.children = [];
                _this.localName = localName;
                _this.prefix = prefix;
                _this.namespace = namespace;
                _this.name = name;
                return _this;
            }
            return XML;
        }(XMLNode));
        web.XML = XML;
        __reflect(XML.prototype, "egret.web.XML");
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
                var _this = _super.call(this, 3, parent) || this;
                _this.text = text;
                return _this;
            }
            return XMLText;
        }(XMLNode));
        web.XMLText = XMLText;
        __reflect(XMLText.prototype, "egret.web.XMLText");
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
            var xml = new XML(node.localName, parent, node["prefix"], node.namespaceURI, node.nodeName);
            var nodeAttributes = node.attributes;
            var attributes = xml.attributes;
            var length = nodeAttributes.length;
            for (var i = 0; i < length; i++) {
                var attributeNode = nodeAttributes[i];
                var name_1 = attributeNode.name;
                if (name_1.indexOf("xmlns:") == 0) {
                    continue;
                }
                attributes[name_1] = attributeNode.value;
                xml["$" + name_1] = attributeNode.value;
            }
            var childNodes = node.childNodes;
            length = childNodes.length;
            var children = xml.children;
            for (var i = 0; i < length; i++) {
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
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * @private
                 */
                _this.onChange = function (e) {
                    var event = new egret.OrientationEvent(egret.Event.CHANGE);
                    event.beta = e.beta;
                    event.gamma = e.gamma;
                    event.alpha = e.alpha;
                    _this.dispatchEvent(event);
                };
                return _this;
            }
            /**
             * @private
             *
             */
            WebDeviceOrientation.prototype.start = function () {
                window.addEventListener("deviceorientation", this.onChange);
            };
            /**
             * @private
             *
             */
            WebDeviceOrientation.prototype.stop = function () {
                window.removeEventListener("deviceorientation", this.onChange);
            };
            return WebDeviceOrientation;
        }(egret.EventDispatcher));
        web.WebDeviceOrientation = WebDeviceOrientation;
        __reflect(WebDeviceOrientation.prototype, "egret.web.WebDeviceOrientation", ["egret.DeviceOrientation"]);
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
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.onUpdate = function (position) {
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
                _this.onError = function (error) {
                    var errorType = egret.GeolocationEvent.UNAVAILABLE;
                    if (error.code == error.PERMISSION_DENIED)
                        errorType = egret.GeolocationEvent.PERMISSION_DENIED;
                    var event = new egret.GeolocationEvent(egret.IOErrorEvent.IO_ERROR);
                    event.errorType = errorType;
                    event.errorMessage = error.message;
                    _this.dispatchEvent(event);
                };
                _this.geolocation = navigator.geolocation;
                return _this;
            }
            /**
             * @private
             *
             */
            WebGeolocation.prototype.start = function () {
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
            WebGeolocation.prototype.stop = function () {
                var geo = this.geolocation;
                geo.clearWatch(this.watchId);
            };
            return WebGeolocation;
        }(egret.EventDispatcher));
        web.WebGeolocation = WebGeolocation;
        __reflect(WebGeolocation.prototype, "egret.web.WebGeolocation", ["egret.Geolocation"]);
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
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * @private
                 */
                _this.onChange = function (e) {
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
                return _this;
            }
            /**
             * @private
             *
             */
            WebMotion.prototype.start = function () {
                window.addEventListener("devicemotion", this.onChange);
            };
            /**
             * @private
             *
             */
            WebMotion.prototype.stop = function () {
                window.removeEventListener("devicemotion", this.onChange);
            };
            return WebMotion;
        }(egret.EventDispatcher));
        web.WebMotion = WebMotion;
        __reflect(WebMotion.prototype, "egret.web.WebMotion", ["egret.Motion"]);
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
        if (true) {
            var logFuncs_1;
            function setLogLevel(logType) {
                if (logFuncs_1 == null) {
                    logFuncs_1 = {
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
                        console.debug = logFuncs_1["debug"];
                    case egret.Logger.INFO:
                        console.log = logFuncs_1["log"];
                        console.info = logFuncs_1["info"];
                    case egret.Logger.WARN:
                        console.warn = logFuncs_1["warn"];
                    case egret.Logger.ERROR:
                        console.error = logFuncs_1["error"];
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
            /**
             * 压入绘制矩形指令
             */
            WebGLDrawCmdManager.prototype.pushDrawRect = function () {
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
            WebGLDrawCmdManager.prototype.pushDrawTexture = function (texture, count, filter, textureWidth, textureHeight) {
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
            WebGLDrawCmdManager.prototype.pushChangeSmoothing = function (texture, smoothing) {
                texture["smoothing"] = smoothing;
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 10 /* SMOOTHING */;
                data.texture = texture;
                data.smoothing = smoothing;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入pushMask指令
             */
            WebGLDrawCmdManager.prototype.pushPushMask = function (count) {
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
            WebGLDrawCmdManager.prototype.pushPopMask = function (count) {
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
            WebGLDrawCmdManager.prototype.pushSetBlend = function (value) {
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
            WebGLDrawCmdManager.prototype.pushResize = function (buffer, width, height) {
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
            WebGLDrawCmdManager.prototype.pushClearColor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 6 /* CLEAR_COLOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入激活buffer命令
             */
            WebGLDrawCmdManager.prototype.pushActivateBuffer = function (buffer) {
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
            WebGLDrawCmdManager.prototype.pushEnableScissor = function (x, y, width, height) {
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
            WebGLDrawCmdManager.prototype.pushDisableScissor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 9 /* DISABLE_SCISSOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 清空命令数组
             */
            WebGLDrawCmdManager.prototype.clear = function () {
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
        __reflect(WebGLDrawCmdManager.prototype, "egret.web.WebGLDrawCmdManager");
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
            /**
             * 是否达到最大缓存数量
             */
            WebGLVertexArrayObject.prototype.reachMaxSize = function (vertexCount, indexCount) {
                if (vertexCount === void 0) { vertexCount = 4; }
                if (indexCount === void 0) { indexCount = 6; }
                return this.vertexIndex > this.vertexMaxSize - vertexCount || this.indexIndex > this.indicesMaxSize - indexCount;
            };
            /**
             * 获取缓存完成的顶点数组
             */
            WebGLVertexArrayObject.prototype.getVertices = function () {
                var view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
                return view;
            };
            /**
             * 获取缓存完成的索引数组
             */
            WebGLVertexArrayObject.prototype.getIndices = function () {
                return this.indices;
            };
            /**
             * 获取缓存完成的mesh索引数组
             */
            WebGLVertexArrayObject.prototype.getMeshIndices = function () {
                return this.indicesForMesh;
            };
            /**
             * 切换成mesh索引缓存方式
             */
            WebGLVertexArrayObject.prototype.changeToMeshIndices = function () {
                if (!this.hasMesh) {
                    // 拷贝默认index信息到for mesh中
                    for (var i = 0, l = this.indexIndex; i < l; ++i) {
                        this.indicesForMesh[i] = this.indices[i];
                    }
                    this.hasMesh = true;
                }
            };
            WebGLVertexArrayObject.prototype.isMesh = function () {
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
            WebGLVertexArrayObject.prototype.cacheArrays = function (transform, alpha, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices) {
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
                        for (var i_1 = 0, l_1 = meshIndices.length; i_1 < l_1; ++i_1) {
                            this.indicesForMesh[this.indexIndex + i_1] = meshIndices[i_1] + this.vertexIndex;
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
            WebGLVertexArrayObject.prototype.clear = function () {
                this.hasMesh = false;
                this.vertexIndex = 0;
                this.indexIndex = 0;
            };
            return WebGLVertexArrayObject;
        }());
        web.WebGLVertexArrayObject = WebGLVertexArrayObject;
        __reflect(WebGLVertexArrayObject.prototype, "egret.web.WebGLVertexArrayObject");
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
        var WebGLRenderTarget = (function (_super) {
            __extends(WebGLRenderTarget, _super);
            function WebGLRenderTarget(gl, width, height) {
                var _this = _super.call(this) || this;
                // 清除色
                _this.clearColor = [0, 0, 0, 0];
                // 是否启用frame buffer, 默认为true
                _this.useFrameBuffer = true;
                _this.gl = gl;
                // 如果尺寸为 0 chrome会报警
                _this.width = width || 1;
                _this.height = height || 1;
                return _this;
            }
            /**
             * 重置render target的尺寸
             */
            WebGLRenderTarget.prototype.resize = function (width, height) {
                var gl = this.gl;
                this.width = width;
                this.height = height;
                if (this.frameBuffer) {
                    // 设置texture尺寸
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                }
                if (this.stencilBuffer) {
                    gl.deleteRenderbuffer(this.stencilBuffer);
                    this.stencilBuffer = null;
                }
            };
            /**
             * 激活此render target
             */
            WebGLRenderTarget.prototype.activate = function () {
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
            };
            /**
             * 获取frame buffer
             */
            WebGLRenderTarget.prototype.getFrameBuffer = function () {
                if (!this.useFrameBuffer) {
                    return null;
                }
                return this.frameBuffer;
            };
            WebGLRenderTarget.prototype.initFrameBuffer = function () {
                if (!this.frameBuffer) {
                    var gl = this.gl;
                    // 创建材质
                    this.texture = this.createTexture();
                    // 创建frame buffer
                    this.frameBuffer = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                    // 绑定材质
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
                }
            };
            /**
             * 创建材质
             * TODO 创建材质的方法可以合并
             */
            WebGLRenderTarget.prototype.createTexture = function () {
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
            WebGLRenderTarget.prototype.clear = function (bind) {
                var gl = this.gl;
                if (bind) {
                    this.activate();
                }
                gl.colorMask(true, true, true, true);
                gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
                gl.clear(gl.COLOR_BUFFER_BIT);
            };
            WebGLRenderTarget.prototype.enabledStencil = function () {
                if (!this.frameBuffer || this.stencilBuffer) {
                    return;
                }
                var gl = this.gl;
                // 设置render buffer的尺寸
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer); // 是否需要强制绑定？
                // 绑定stencil buffer
                this.stencilBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);
                // 此处不解绑是否会造成bug？
                // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            };
            return WebGLRenderTarget;
        }(egret.HashObject));
        web.WebGLRenderTarget = WebGLRenderTarget;
        __reflect(WebGLRenderTarget.prototype, "egret.web.WebGLRenderTarget");
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
                this.contextLost = false;
                this.$scissorState = false;
                this.vertSize = 5;
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
            WebGLRenderContext.prototype.pushBuffer = function (buffer) {
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
            WebGLRenderContext.prototype.popBuffer = function () {
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
            WebGLRenderContext.prototype.activateBuffer = function (buffer) {
                buffer.rootRenderTarget.activate();
                if (!this.bindIndices) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                buffer.restoreStencil();
                buffer.restoreScissor();
                this.onResize(buffer.width, buffer.height);
            };
            /**
             * 上传顶点数据
             */
            WebGLRenderContext.prototype.uploadVerticesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
                // gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
            };
            /**
             * 上传索引数据
             */
            WebGLRenderContext.prototype.uploadIndicesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
                this.bindIndices = true;
            };
            /**
             * 销毁绘制对象
             */
            WebGLRenderContext.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            WebGLRenderContext.prototype.onResize = function (width, height) {
                width = width || this.surface.width;
                height = height || this.surface.height;
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
            WebGLRenderContext.prototype.resize = function (width, height, useMaxSize) {
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
            WebGLRenderContext.prototype.initWebGL = function () {
                this.onResize();
                this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
                this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);
                this.getWebGLContext();
                var gl = this.context;
                this.$maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            };
            WebGLRenderContext.prototype.handleContextLost = function () {
                this.contextLost = true;
            };
            WebGLRenderContext.prototype.handleContextRestored = function () {
                this.initWebGL();
                this.contextLost = false;
            };
            WebGLRenderContext.prototype.getWebGLContext = function () {
                var options = {
                    antialias: WebGLRenderContext.antialias,
                    stencil: true //设置可以使用模板（用于不规则遮罩）
                };
                var gl;
                //todo 是否使用chrome源码names
                //let contextNames = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl", "3d"];
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
            WebGLRenderContext.prototype.setContext = function (gl) {
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
            WebGLRenderContext.prototype.enableStencilTest = function () {
                var gl = this.context;
                gl.enable(gl.STENCIL_TEST);
            };
            /**
             * 关闭模版检测
             */
            WebGLRenderContext.prototype.disableStencilTest = function () {
                var gl = this.context;
                gl.disable(gl.STENCIL_TEST);
            };
            /**
             * 开启scissor检测
             */
            WebGLRenderContext.prototype.enableScissorTest = function (rect) {
                var gl = this.context;
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(rect.x, rect.y, rect.width, rect.height);
            };
            /**
             * 关闭scissor检测
             */
            WebGLRenderContext.prototype.disableScissorTest = function () {
                var gl = this.context;
                gl.disable(gl.SCISSOR_TEST);
            };
            /**
             * 获取像素信息
             */
            WebGLRenderContext.prototype.getPixels = function (x, y, width, height, pixels) {
                var gl = this.context;
                gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            };
            /**
             * 创建一个WebGLTexture
             */
            WebGLRenderContext.prototype.createTexture = function (bitmapData) {
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
            WebGLRenderContext.prototype.createTextureFromCompressedData = function (data, width, height, levels, internalFormat) {
                return null;
            };
            /**
             * 更新材质的bitmapData
             */
            WebGLRenderContext.prototype.updateTexture = function (texture, bitmapData) {
                var gl = this.context;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            };
            /**
             * 获取一个WebGLTexture
             * 如果有缓存的texture返回缓存的texture，如果没有则创建并缓存texture
             */
            WebGLRenderContext.prototype.getWebGLTexture = function (bitmapData) {
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
                    //todo 默认值
                    bitmapData.webGLTexture["smoothing"] = true;
                }
                return bitmapData.webGLTexture;
            };
            /**
             * 清除矩形区域
             */
            WebGLRenderContext.prototype.clearRect = function (x, y, width, height) {
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
            WebGLRenderContext.prototype.setGlobalCompositeOperation = function (value) {
                this.drawCmdManager.pushSetBlend(value);
            };
            /**
             * 绘制图片，image参数可以是BitmapData或者renderTarget
             */
            WebGLRenderContext.prototype.drawImage = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    // 如果是render target
                    texture = image["texture"] || image.source["texture"];
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
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, undefined, undefined, undefined, undefined, smoothing);
                if (image.source && image.source["texture"]) {
                    buffer.restoreTransform();
                }
            };
            /**
             * 绘制Mesh
             */
            WebGLRenderContext.prototype.drawMesh = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    // 如果是render target
                    texture = image["texture"] || image.source["texture"];
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
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, smoothing);
                if (image["texture"] || (image.source && image.source["texture"])) {
                    buffer.restoreTransform();
                }
            };
            /**
             * 绘制材质
             */
            WebGLRenderContext.prototype.drawTexture = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, bounds, smoothing) {
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
                if (smoothing != undefined && texture["smoothing"] != smoothing) {
                    this.drawCmdManager.pushChangeSmoothing(texture, smoothing);
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
            WebGLRenderContext.prototype.drawRect = function (x, y, width, height) {
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
            WebGLRenderContext.prototype.pushMask = function (mask) {
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
            WebGLRenderContext.prototype.popMask = function () {
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
            WebGLRenderContext.prototype.clear = function () {
                this.drawCmdManager.pushClearColor();
            };
            /**
             * 开启scissor test
             */
            WebGLRenderContext.prototype.enableScissor = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushEnableScissor(x, y, width, height);
                buffer.$hasScissor = true;
            };
            /**
             * 关闭scissor test
             */
            WebGLRenderContext.prototype.disableScissor = function () {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushDisableScissor();
                buffer.$hasScissor = false;
            };
            WebGLRenderContext.prototype.$drawWebGL = function () {
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
            WebGLRenderContext.prototype.drawData = function (data, offset) {
                if (!data) {
                    return;
                }
                var gl = this.context;
                var program;
                var filter = data.filter;
                switch (data.type) {
                    case 0 /* TEXTURE */:
                        if (filter) {
                            if (filter.type === "custom") {
                                program = web.EgretWebGLProgram.getProgram(gl, filter.$vertexSrc, filter.$fragmentSrc, filter.$shaderKey);
                            }
                            else if (filter.type === "colorTransform") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.colorTransform_frag, "colorTransform");
                            }
                            else if (filter.type === "blurX") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "blurY") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "glow") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.glow_frag, "glow");
                            }
                        }
                        else {
                            program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.texture_frag, "texture");
                        }
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawTextureElements(data, offset);
                        break;
                    case 1 /* RECT */:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawRectElements(data, offset);
                        break;
                    case 2 /* PUSH_MASK */:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawPushMaskElements(data, offset);
                        break;
                    case 3 /* POP_MASK */:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
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
                            if (buffer.rootRenderTarget) {
                                buffer.rootRenderTarget.enabledStencil();
                            }
                            buffer.enableScissor(data.x, data.y, data.width, data.height);
                        }
                        break;
                    case 9 /* DISABLE_SCISSOR */:
                        buffer = this.activatedBuffer;
                        if (buffer) {
                            buffer.disableScissor();
                        }
                        break;
                    case 10 /* SMOOTHING */:
                        gl.bindTexture(gl.TEXTURE_2D, data.texture);
                        if (data.smoothing) {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        }
                        else {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        }
                        break;
                    default:
                        break;
                }
                return offset;
            };
            WebGLRenderContext.prototype.activeProgram = function (gl, program) {
                if (program != this.currentProgram) {
                    gl.useProgram(program.id);
                    // 目前所有attribute buffer的绑定方法都是一致的
                    var attribute = program.attributes;
                    for (var key in attribute) {
                        if (key === "aVertexPosition") {
                            gl.vertexAttribPointer(attribute["aVertexPosition"].location, 2, gl.FLOAT, false, 5 * 4, 0);
                            gl.enableVertexAttribArray(attribute["aVertexPosition"].location);
                        }
                        else if (key === "aTextureCoord") {
                            gl.vertexAttribPointer(attribute["aTextureCoord"].location, 2, gl.FLOAT, false, 5 * 4, 2 * 4);
                            gl.enableVertexAttribArray(attribute["aTextureCoord"].location);
                        }
                        else if (key === "aColor") {
                            gl.vertexAttribPointer(attribute["aColor"].location, 1, gl.FLOAT, false, 5 * 4, 4 * 4);
                            gl.enableVertexAttribArray(attribute["aColor"].location);
                        }
                    }
                    this.currentProgram = program;
                }
            };
            WebGLRenderContext.prototype.syncUniforms = function (program, filter, textureWidth, textureHeight) {
                var uniforms = program.uniforms;
                var isCustomFilter = filter && filter.type === "custom";
                for (var key in uniforms) {
                    if (key === "projectionVector") {
                        uniforms[key].setValue({ x: this.projectionX, y: this.projectionY });
                    }
                    else if (key === "uTextureSize") {
                        uniforms[key].setValue({ x: textureWidth, y: textureHeight });
                    }
                    else if (key === "uSampler") {
                    }
                    else {
                        var value = filter.$uniforms[key];
                        if (value !== undefined) {
                            uniforms[key].setValue(value);
                        }
                        else {
                        }
                    }
                }
            };
            /**
             * 画texture
             **/
            WebGLRenderContext.prototype.drawTextureElements = function (data, offset) {
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
            WebGLRenderContext.prototype.drawRectElements = function (data, offset) {
                var gl = this.context;
                // gl.bindTexture(gl.TEXTURE_2D, null);
                var size = data.count * 3;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            /**
             * 画push mask
             **/
            WebGLRenderContext.prototype.drawPushMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    if (buffer.rootRenderTarget) {
                        buffer.rootRenderTarget.enabledStencil();
                    }
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
            WebGLRenderContext.prototype.drawPopMaskElements = function (data, offset) {
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
            WebGLRenderContext.prototype.setBlendMode = function (value) {
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
            WebGLRenderContext.prototype.drawTargetWidthFilters = function (filters, input) {
                var originInput = input, filtersLen = filters.length, output;
                // 应用前面的滤镜
                if (filtersLen > 1) {
                    for (var i = 0; i < filtersLen - 1; i++) {
                        var filter_1 = filters[i];
                        var width = input.rootRenderTarget.width;
                        var height = input.rootRenderTarget.height;
                        output = web.WebGLRenderBuffer.create(width, height);
                        output.setTransform(1, 0, 0, 1, 0, 0);
                        output.globalAlpha = 1;
                        this.drawToRenderTarget(filter_1, input, output);
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
            WebGLRenderContext.prototype.drawToRenderTarget = function (filter, input, output) {
                if (this.contextLost) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.pushBuffer(output);
                var originInput = input, temp, width = input.rootRenderTarget.width, height = input.rootRenderTarget.height;
                // 模糊滤镜分别处理blurX与blurY
                if (filter.type == "blur") {
                    var blurXFilter = filter.blurXFilter;
                    var blurYFilter = filter.blurYFilter;
                    if (blurXFilter.blurX != 0 && blurYFilter.blurY != 0) {
                        temp = web.WebGLRenderBuffer.create(width, height);
                        temp.setTransform(1, 0, 0, 1, 0, 0);
                        temp.globalAlpha = 1;
                        this.drawToRenderTarget(filter.blurXFilter, input, temp);
                        if (input != originInput) {
                            web.WebGLRenderBuffer.release(input);
                        }
                        input = temp;
                        filter = blurYFilter;
                    }
                    else {
                        filter = blurXFilter.blurX === 0 ? blurYFilter : blurXFilter;
                    }
                }
                // 绘制input结果到舞台
                output.saveTransform();
                output.transform(1, 0, 0, -1, 0, height);
                this.vao.cacheArrays(output.globalMatrix, output.globalAlpha, 0, 0, width, height, 0, 0, width, height, width, height);
                output.restoreTransform();
                this.drawCmdManager.pushDrawTexture(input.rootRenderTarget.texture, 2, filter, width, height);
                // 释放掉input
                if (input != originInput) {
                    web.WebGLRenderBuffer.release(input);
                }
                this.popBuffer();
            };
            WebGLRenderContext.initBlendMode = function () {
                WebGLRenderContext.blendModesForGL = {};
                WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
                WebGLRenderContext.blendModesForGL["lighter"] = [1, 1];
                WebGLRenderContext.blendModesForGL["lighter-in"] = [770, 771];
                WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
                WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
            };
            return WebGLRenderContext;
        }());
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
        web.WebGLRenderContext = WebGLRenderContext;
        __reflect(WebGLRenderContext.prototype, "egret.web.WebGLRenderContext");
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
        var WebGLRenderBuffer = (function (_super) {
            __extends(WebGLRenderBuffer, _super);
            function WebGLRenderBuffer(width, height, root) {
                var _this = _super.call(this) || this;
                _this.globalAlpha = 1;
                /**
                 * stencil state
                 * 模版开关状态
                 */
                _this.stencilState = false;
                _this.$stencilList = [];
                _this.stencilHandleCount = 0;
                /**
                 * scissor state
                 * scissor 开关状态
                 */
                _this.$scissorState = false;
                _this.scissorRect = new egret.Rectangle();
                _this.$hasScissor = false;
                // dirtyRegionPolicy hack
                _this.dirtyRegionPolicy = true;
                _this._dirtyRegionPolicy = true; // 默认设置为true，保证第一帧绘制在frameBuffer上
                _this.$drawCalls = 0;
                _this.$computeDrawCall = false;
                _this.globalMatrix = new egret.Matrix();
                _this.savedGlobalMatrix = new egret.Matrix();
                // 获取webglRenderContext
                _this.context = web.WebGLRenderContext.getInstance(width, height);
                // buffer 对应的 render target
                _this.rootRenderTarget = new web.WebGLRenderTarget(_this.context.context, 3, 3);
                if (width && height) {
                    _this.resize(width, height);
                }
                // 如果是第一个加入的buffer，说明是舞台buffer
                _this.root = root;
                // 如果是用于舞台渲染的renderBuffer，则默认添加renderTarget到renderContext中，而且是第一个
                if (_this.root) {
                    _this.context.pushBuffer(_this);
                    // 画布
                    _this.surface = _this.context.surface;
                }
                else {
                    // 由于创建renderTarget造成的frameBuffer绑定，这里重置绑定
                    var lastBuffer = _this.context.activatedBuffer;
                    if (lastBuffer) {
                        lastBuffer.rootRenderTarget.activate();
                    }
                    _this.rootRenderTarget.initFrameBuffer();
                    _this.surface = _this.rootRenderTarget;
                }
                return _this;
            }
            WebGLRenderBuffer.prototype.enableStencil = function () {
                if (!this.stencilState) {
                    this.context.enableStencilTest();
                    this.stencilState = true;
                }
            };
            WebGLRenderBuffer.prototype.disableStencil = function () {
                if (this.stencilState) {
                    this.context.disableStencilTest();
                    this.stencilState = false;
                }
            };
            WebGLRenderBuffer.prototype.restoreStencil = function () {
                if (this.stencilState) {
                    this.context.enableStencilTest();
                }
                else {
                    this.context.disableStencilTest();
                }
            };
            WebGLRenderBuffer.prototype.enableScissor = function (x, y, width, height) {
                if (!this.$scissorState) {
                    this.$scissorState = true;
                    this.scissorRect.setTo(x, y, width, height);
                    this.context.enableScissorTest(this.scissorRect);
                }
            };
            WebGLRenderBuffer.prototype.disableScissor = function () {
                if (this.$scissorState) {
                    this.$scissorState = false;
                    this.scissorRect.setEmpty();
                    this.context.disableScissorTest();
                }
            };
            WebGLRenderBuffer.prototype.restoreScissor = function () {
                if (this.$scissorState) {
                    this.context.enableScissorTest(this.scissorRect);
                }
                else {
                    this.context.disableScissorTest();
                }
            };
            Object.defineProperty(WebGLRenderBuffer.prototype, "width", {
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.rootRenderTarget.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebGLRenderBuffer.prototype, "height", {
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.rootRenderTarget.height;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            WebGLRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
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
            WebGLRenderBuffer.prototype.resizeTo = function (width, height, offsetX, offsetY) {
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
            WebGLRenderBuffer.prototype.setDirtyRegionPolicy = function (state) {
                this.dirtyRegionPolicy = (state == "on");
            };
            /**
             * 清空并设置裁切
             * @param regions 矩形列表
             * @param offsetX 矩形要加上的偏移量x
             * @param offsetY 矩形要加上的偏移量y
             */
            WebGLRenderBuffer.prototype.beginClip = function (regions, offsetX, offsetY) {
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
                        WebGLRenderBuffer.autoClear && this.context.clear();
                    }
                }
                offsetX = +offsetX || 0;
                offsetY = +offsetY || 0;
                this.setTransform(1, 0, 0, 1, offsetX, offsetY);
                var length = regions.length;
                //只有一个区域且刚好为舞台大小时,不设置模板
                // if (length == 1 && regions[0].minX == 0 && regions[0].minY == 0 &&
                //     regions[0].width == this.rootRenderTarget.width && regions[0].height == this.rootRenderTarget.height) {
                this.maskPushed = false;
                this.rootRenderTarget.useFrameBuffer && this.context.clear();
                this.context.popBuffer();
                return;
                // }
                // 擦除脏矩形区域
                // for (let i = 0; i < length; i++) {
                //     let region = regions[i];
                //     this.context.clearRect(region.minX, region.minY, region.width, region.height);
                // }
                // // 设置模版
                // if (length > 0) {
                //     // 对第一个且只有一个mask用scissor处理
                //     if(!this.$hasScissor && length == 1) {
                //         let region = regions[0];
                //         regions = regions.slice(1);
                //         let x = region.minX + offsetX;
                //         let y = region.minY + offsetY;
                //         let width = region.width;
                //         let height = region.height;
                //         this.context.enableScissor(x, - y - height + this.height, width, height);
                //         this.scissorEnabled = true;
                //     } else {
                //         this.scissorEnabled = false;
                //     }
                //     if(regions.length > 0) {
                //         this.context.pushMask(regions);
                //         this.maskPushed = true;
                //     } else {
                //         this.maskPushed = false;
                //     }
                //     this.offsetX = offsetX;
                //     this.offsetY = offsetY;
                // }
                // else {
                //     this.maskPushed = false;
                // }
                // this.context.popBuffer();
            };
            /**
             * 取消上一次设置的clip。
             */
            WebGLRenderBuffer.prototype.endClip = function () {
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
             * 获取指定区域的像素
             */
            WebGLRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                var pixels = new Uint8Array(4 * width * height);
                var useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.context.getPixels(x, y, width, height, pixels);
                this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
                this.rootRenderTarget.activate();
                //图像反转
                var result = new Uint8Array(4 * width * height);
                for (var i = 0; i < height; i++) {
                    for (var j = 0; j < width; j++) {
                        result[(width * (height - i - 1) + j) * 4] = pixels[(width * i + j) * 4];
                        result[(width * (height - i - 1) + j) * 4 + 1] = pixels[(width * i + j) * 4 + 1];
                        result[(width * (height - i - 1) + j) * 4 + 2] = pixels[(width * i + j) * 4 + 2];
                        result[(width * (height - i - 1) + j) * 4 + 3] = pixels[(width * i + j) * 4 + 3];
                    }
                }
                return result;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            WebGLRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.context.surface.toDataURL(type, encoderOptions);
            };
            /**
             * 销毁绘制对象
             */
            WebGLRenderBuffer.prototype.destroy = function () {
                this.context.destroy();
            };
            WebGLRenderBuffer.prototype.onRenderFinish = function () {
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
            WebGLRenderBuffer.prototype.drawFrameBufferToSurface = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
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
            WebGLRenderBuffer.prototype.drawSurfaceToFrameBuffer = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
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
            WebGLRenderBuffer.prototype.clear = function () {
                this.context.clear();
            };
            WebGLRenderBuffer.prototype.setTransform = function (a, b, c, d, tx, ty) {
                // this.globalMatrix.setTo(a, b, c, d, tx, ty);
                var matrix = this.globalMatrix;
                matrix.a = a;
                matrix.b = b;
                matrix.c = c;
                matrix.d = d;
                matrix.tx = tx;
                matrix.ty = ty;
            };
            WebGLRenderBuffer.prototype.transform = function (a, b, c, d, tx, ty) {
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
            WebGLRenderBuffer.prototype.translate = function (dx, dy) {
                // this.globalMatrix.translate(dx, dy);
                var matrix = this.globalMatrix;
                matrix.tx += dx;
                matrix.ty += dy;
            };
            WebGLRenderBuffer.prototype.saveTransform = function () {
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
            WebGLRenderBuffer.prototype.restoreTransform = function () {
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
                    var matrix = buffer.globalMatrix;
                    matrix.a = 1;
                    matrix.b = 0;
                    matrix.c = 0;
                    matrix.d = 1;
                    matrix.tx = 0;
                    matrix.ty = 0;
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
        }(egret.HashObject));
        WebGLRenderBuffer.autoClear = true;
        web.WebGLRenderBuffer = WebGLRenderBuffer;
        __reflect(WebGLRenderBuffer.prototype, "egret.web.WebGLRenderBuffer", ["egret.sys.RenderBuffer"]);
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
            /**
             * 渲染一个显示对象
             * @param displayObject 要渲染的显示对象
             * @param buffer 渲染缓冲
             * @param matrix 要对显示对象整体叠加的变换矩阵
             * @param dirtyList 脏矩形列表
             * @param forRenderTexture 绘制目标是RenderTexture的标志
             * @returns drawCall触发绘制的次数
             */
            WebGLRenderer.prototype.render = function (displayObject, buffer, matrix, dirtyList, forRenderTexture) {
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
                    var length_2 = renderBufferPool.length;
                    for (var i = 0; i < length_2; i++) {
                        renderBufferPool[i].resize(0, 0);
                    }
                }
                return drawCall;
            };
            /**
             * @private
             * 绘制一个显示对象
             */
            WebGLRenderer.prototype.drawDisplayObject = function (displayObject, buffer, dirtyList, matrix, displayList, clipRegion, root) {
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
                        var renderAlpha = void 0;
                        var m = void 0;
                        if (root) {
                            renderAlpha = displayObject.$getConcatenatedAlphaAt(root, displayObject.$getConcatenatedAlpha());
                            m = egret.Matrix.create().copyFrom(displayObject.$getConcatenatedMatrix());
                            displayObject.$getConcatenatedMatrixAt(root, m);
                        }
                        else {
                            renderAlpha = node.renderAlpha;
                            m = egret.Matrix.create().copyFrom(node.renderMatrix);
                        }
                        matrix.$preMultiplyInto(m, m);
                        buffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        egret.Matrix.release(m);
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
                    var length_3 = children.length;
                    for (var i = 0; i < length_3; i++) {
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
            WebGLRenderer.prototype.drawWithFilter = function (displayObject, buffer, dirtyList, matrix, clipRegion, root) {
                var drawCalls = 0;
                if (displayObject.$children && displayObject.$children.length == 0) {
                    return;
                }
                var filters = displayObject.$getFilters();
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                if (filters.length == 1 && (filters[0].type == "colorTransform" || (filters[0].type === "custom" && filters[0].padding === 0))) {
                    var childrenDrawCount = this.getRenderCount(displayObject);
                    if (!displayObject.$children || childrenDrawCount == 1) {
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
                }
                // 获取显示对象的链接矩阵
                var displayMatrix = egret.Matrix.create();
                displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
                if (root) {
                    displayObject.$getConcatenatedMatrixAt(root, displayMatrix);
                }
                // 获取显示对象的矩形区域
                var region;
                region = egret.sys.Region.create();
                var bounds = displayObject.$getOriginalBounds();
                region.updateRegion(bounds, displayMatrix);
                // 为显示对象创建一个新的buffer
                // todo 这里应该计算 region.x region.y
                var displayBuffer = this.createRenderBuffer(region.width * matrix.a, region.height * matrix.d);
                displayBuffer.context.pushBuffer(displayBuffer);
                displayBuffer.setTransform(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                var offsetM = egret.Matrix.create().setTo(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
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
                    buffer.setTransform(1, 0, 0, 1, (region.minX + matrix.tx) * matrix.a, (region.minY + matrix.ty) * matrix.d);
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
            WebGLRenderer.prototype.getRenderCount = function (displayObject) {
                var childrenDrawCount = 0;
                if (displayObject.$children) {
                    for (var _i = 0, _a = displayObject.$children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var node = child.$getRenderNode();
                        childrenDrawCount += node.$getRenderCount();
                        if (child.$children) {
                            childrenDrawCount += this.getRenderCount(child);
                        }
                    }
                }
                return childrenDrawCount;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.drawWithClip = function (displayObject, buffer, dirtyList, matrix, clipRegion, root) {
                var drawCalls = 0;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
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
                if (root) {
                    displayObject.$getConcatenatedMatrixAt(root, displayMatrix);
                }
                else if (displayObject.$parentDisplayList) {
                    var displayRoot = displayObject.$parentDisplayList.root;
                    if (displayRoot !== displayObject.$stage) {
                        displayObject.$getConcatenatedMatrixAt(displayRoot, displayMatrix);
                    }
                }
                var bounds;
                if (mask) {
                    bounds = mask.$getOriginalBounds();
                    maskRegion = egret.sys.Region.create();
                    var m = egret.Matrix.create();
                    m.copyFrom(mask.$getConcatenatedMatrix());
                    if (root) {
                        mask.$getConcatenatedMatrixAt(root, m);
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
                        buffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        buffer.context.pushMask(scrollRect);
                    }
                    //绘制显示对象
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, clipRegion, root);
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
                    var displayBuffer = this.createRenderBuffer(region.width * matrix.a, region.height * matrix.d);
                    // let displayContext = displayBuffer.context;
                    displayBuffer.context.pushBuffer(displayBuffer);
                    displayBuffer.setTransform(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                    var offsetM = egret.Matrix.create().setTo(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, dirtyList, offsetM, displayObject.$displayList, region, root);
                    //绘制遮罩
                    if (mask) {
                        //如果只有一次绘制或是已经被cache直接绘制到displayContext
                        //webgl暂时无法添加,因为会有边界像素没有被擦除
                        //let maskRenderNode = mask.$getRenderNode();
                        //if (maskRenderNode && maskRenderNode.$getRenderCount() == 1 || mask.$displayList) {
                        //    displayBuffer.context.setGlobalCompositeOperation("destination-in");
                        //    drawCalls += this.drawDisplayObject(mask, displayBuffer, dirtyList, offsetM,
                        //        mask.$displayList, region, root);
                        //}
                        //else {
                        var maskBuffer = this.createRenderBuffer(region.width * matrix.a, region.height * matrix.d);
                        maskBuffer.context.pushBuffer(maskBuffer);
                        maskBuffer.setTransform(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                        offsetM = egret.Matrix.create().setTo(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                        drawCalls += this.drawDisplayObject(mask, maskBuffer, dirtyList, offsetM, mask.$displayList, region, root);
                        maskBuffer.context.popBuffer();
                        displayBuffer.context.setGlobalCompositeOperation("destination-in");
                        displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                        displayBuffer.globalAlpha = 1;
                        var maskBufferWidth = maskBuffer.rootRenderTarget.width;
                        var maskBufferHeight = maskBuffer.rootRenderTarget.height;
                        displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight, 0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                        displayBuffer.context.setGlobalCompositeOperation("source-over");
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
                            matrix.$preMultiplyInto(m, m);
                            displayBuffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                            displayBuffer.context.pushMask(scrollRect);
                        }
                        buffer.globalAlpha = 1;
                        buffer.setTransform(1, 0, 0, -1, (region.minX + matrix.tx) * matrix.a, (region.minY + matrix.ty) * matrix.d + displayBuffer.height);
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
            WebGLRenderer.prototype.drawWithScrollRect = function (displayObject, buffer, dirtyList, matrix, clipRegion, root) {
                var drawCalls = 0;
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                if (scrollRect.isEmpty()) {
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
                region.updateRegion(scrollRect, m);
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
                matrix.$preMultiplyInto(m, m);
                buffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                var context = buffer.context;
                var scissor = false;
                if (buffer.$hasScissor || m.b != 0 || m.c != 0) {
                    context.pushMask(scrollRect);
                }
                else {
                    var a = m.a;
                    var d = m.d;
                    var tx = m.tx;
                    var ty = m.ty;
                    var x = scrollRect.x;
                    var y = scrollRect.y;
                    var xMax = x + scrollRect.width;
                    var yMax = y + scrollRect.height;
                    var minX = void 0, minY = void 0, maxX = void 0, maxY = void 0;
                    //优化，通常情况下不缩放的对象占多数，直接加上偏移量即可。
                    if (a == 1.0 && d == 1.0) {
                        minX = x + tx;
                        minY = y + ty;
                        maxX = xMax + tx;
                        maxY = yMax + ty;
                    }
                    else {
                        var x0 = a * x + tx;
                        var y0 = d * y + ty;
                        var x1 = a * xMax + tx;
                        var y1 = d * y + ty;
                        var x2 = a * xMax + tx;
                        var y2 = d * yMax + ty;
                        var x3 = a * x + tx;
                        var y3 = d * yMax + ty;
                        var tmp = 0;
                        if (x0 > x1) {
                            tmp = x0;
                            x0 = x1;
                            x1 = tmp;
                        }
                        if (x2 > x3) {
                            tmp = x2;
                            x2 = x3;
                            x3 = tmp;
                        }
                        minX = (x0 < x2 ? x0 : x2);
                        maxX = (x1 > x3 ? x1 : x3);
                        if (y0 > y1) {
                            tmp = y0;
                            y0 = y1;
                            y1 = tmp;
                        }
                        if (y2 > y3) {
                            tmp = y2;
                            y2 = y3;
                            y3 = tmp;
                        }
                        minY = (y0 < y2 ? y0 : y2);
                        maxY = (y1 > y3 ? y1 : y3);
                    }
                    context.enableScissor(minX + matrix.tx, -matrix.ty - maxY + buffer.height, maxX - minX, maxY - minY);
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
            WebGLRenderer.prototype.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
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
            WebGLRenderer.prototype.renderNode = function (node, buffer, forHitTest) {
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
            WebGLRenderer.prototype.renderBitmap = function (node, buffer) {
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
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.smoothing);
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
            WebGLRenderer.prototype.renderMesh = function (node, buffer) {
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
                    buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.smoothing);
                }
                if (m) {
                    buffer.restoreTransform();
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderText = function (node, buffer) {
                var width = node.width - node.x;
                var height = node.height - node.y;
                var pixelRatio = egret.sys.DisplayList.$pixelRatio;
                var maxTextureSize = buffer.context.$maxTextureSize;
                if (width * pixelRatio > maxTextureSize || height * pixelRatio > maxTextureSize) {
                    pixelRatio *= width * pixelRatio > height * pixelRatio ? maxTextureSize / (width * pixelRatio) : maxTextureSize / (height * pixelRatio);
                }
                width *= pixelRatio;
                height *= pixelRatio;
                var x = node.x * pixelRatio;
                var y = node.y * pixelRatio;
                if (node.drawData.length == 0) {
                    return;
                }
                if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                    this.canvasRenderer = new egret.CanvasRenderer();
                    this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                    if (pixelRatio != 1) {
                        this.canvasRenderBuffer.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                    }
                }
                else if (node.dirtyRender) {
                    this.canvasRenderBuffer.resize(width, height);
                }
                if (!this.canvasRenderBuffer.context) {
                    return;
                }
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(pixelRatio, 0, 0, pixelRatio, -x, -y);
                    }
                    buffer.transform(1, 0, 0, 1, x / pixelRatio, y / pixelRatio);
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
                buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / pixelRatio, textureHeight / pixelRatio, textureWidth, textureHeight);
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                    }
                    buffer.transform(1, 0, 0, 1, -x / pixelRatio, -y / pixelRatio);
                }
                node.dirtyRender = false;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderGraphics = function (node, buffer, forHitTest) {
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
            WebGLRenderer.prototype.renderGroup = function (groupNode, buffer) {
                var m = groupNode.matrix;
                if (m) {
                    buffer.saveTransform();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                var children = groupNode.drawData;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var node = children[i];
                    this.renderNode(node, buffer);
                }
                if (m) {
                    buffer.restoreTransform();
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.createRenderBuffer = function (width, height) {
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
        __reflect(WebGLRenderer.prototype, "egret.web.WebGLRenderer", ["egret.sys.SystemRenderer"]);
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
        var WEBGL_ATTRIBUTE_TYPE;
        (function (WEBGL_ATTRIBUTE_TYPE) {
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT"] = 5126] = "FLOAT";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["BYTE"] = 65535] = "BYTE";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        })(WEBGL_ATTRIBUTE_TYPE = web.WEBGL_ATTRIBUTE_TYPE || (web.WEBGL_ATTRIBUTE_TYPE = {}));
        /**
         * @private
         */
        var EgretWebGLAttribute = (function () {
            function EgretWebGLAttribute(gl, program, attributeData) {
                this.gl = gl;
                this.name = attributeData.name;
                this.type = attributeData.type;
                this.size = attributeData.size;
                this.location = gl.getAttribLocation(program, this.name);
                this.count = 0;
                this.initCount(gl);
                this.format = gl.FLOAT;
                this.initFormat(gl);
            }
            EgretWebGLAttribute.prototype.initCount = function (gl) {
                var type = this.type;
                switch (type) {
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT:
                    case WEBGL_ATTRIBUTE_TYPE.BYTE:
                    case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                    case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                        this.count = 1;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                        this.count = 2;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                        this.count = 3;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                        this.count = 4;
                        break;
                }
            };
            EgretWebGLAttribute.prototype.initFormat = function (gl) {
                var type = this.type;
                switch (type) {
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT:
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                        this.format = gl.FLOAT;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                        this.format = gl.UNSIGNED_BYTE;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                        this.format = gl.UNSIGNED_SHORT;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.BYTE:
                        this.format = gl.BYTE;
                        break;
                }
            };
            return EgretWebGLAttribute;
        }());
        web.EgretWebGLAttribute = EgretWebGLAttribute;
        __reflect(EgretWebGLAttribute.prototype, "egret.web.EgretWebGLAttribute");
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
        function loadShader(gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                console.log("shader not compiled!");
                console.log(gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        function createWebGLProgram(gl, vertexShader, fragmentShader) {
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            return program;
        }
        function extractAttributes(gl, program) {
            var attributes = {};
            var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < totalAttributes; i++) {
                var attribData = gl.getActiveAttrib(program, i);
                var name_2 = attribData.name;
                var attribute = new web.EgretWebGLAttribute(gl, program, attribData);
                attributes[name_2] = attribute;
            }
            return attributes;
        }
        function extractUniforms(gl, program) {
            var uniforms = {};
            var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < totalUniforms; i++) {
                var uniformData = gl.getActiveUniform(program, i);
                var name_3 = uniformData.name;
                var uniform = new web.EgretWebGLUniform(gl, program, uniformData);
                uniforms[name_3] = uniform;
            }
            return uniforms;
        }
        /**
         * @private
         */
        var EgretWebGLProgram = (function () {
            function EgretWebGLProgram(gl, vertSource, fragSource) {
                this.vshaderSource = vertSource;
                this.fshaderSource = fragSource;
                this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);
                this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);
                this.id = createWebGLProgram(gl, this.vertexShader, this.fragmentShader);
                this.uniforms = extractUniforms(gl, this.id);
                this.attributes = extractAttributes(gl, this.id);
            }
            /**
             * 获取所需的WebGL Program
             * @param key {string} 对于唯一的program程序，对应唯一的key
             */
            EgretWebGLProgram.getProgram = function (gl, vertSource, fragSource, key) {
                if (!this.programCache[key]) {
                    this.programCache[key] = new EgretWebGLProgram(gl, vertSource, fragSource);
                }
                return this.programCache[key];
            };
            EgretWebGLProgram.deleteProgram = function (gl, vertSource, fragSource, key) {
                // TODO delete
            };
            return EgretWebGLProgram;
        }());
        EgretWebGLProgram.programCache = {};
        web.EgretWebGLProgram = EgretWebGLProgram;
        __reflect(EgretWebGLProgram.prototype, "egret.web.EgretWebGLProgram");
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
        var WEBGL_UNIFORM_TYPE;
        (function (WEBGL_UNIFORM_TYPE) {
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT_VEC2"] = 35667] = "INT_VEC2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT_VEC3"] = 35668] = "INT_VEC3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT_VEC4"] = 35669] = "INT_VEC4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL"] = 35670] = "BOOL";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL_VEC2"] = 35671] = "BOOL_VEC2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL_VEC3"] = 35672] = "BOOL_VEC3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL_VEC4"] = 35673] = "BOOL_VEC4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_MAT2"] = 35674] = "FLOAT_MAT2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_MAT3"] = 35675] = "FLOAT_MAT3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_MAT4"] = 35676] = "FLOAT_MAT4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["SAMPLER_2D"] = 35678] = "SAMPLER_2D";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["SAMPLER_CUBE"] = 35680] = "SAMPLER_CUBE";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BYTE"] = 65535] = "BYTE";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["SHORT"] = 5122] = "SHORT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT"] = 5124] = "INT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT"] = 5126] = "FLOAT";
        })(WEBGL_UNIFORM_TYPE = web.WEBGL_UNIFORM_TYPE || (web.WEBGL_UNIFORM_TYPE = {}));
        /**
         * @private
         */
        var EgretWebGLUniform = (function () {
            function EgretWebGLUniform(gl, program, uniformData) {
                this.gl = gl;
                this.name = uniformData.name;
                this.type = uniformData.type;
                this.size = uniformData.size;
                this.location = gl.getUniformLocation(program, this.name);
                this.setDefaultValue();
                this.generateSetValue();
                this.generateUpload();
            }
            EgretWebGLUniform.prototype.setDefaultValue = function () {
                var type = this.type;
                switch (type) {
                    case WEBGL_UNIFORM_TYPE.FLOAT:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                    case WEBGL_UNIFORM_TYPE.BOOL:
                    case WEBGL_UNIFORM_TYPE.INT:
                        this.value = 0;
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                    case WEBGL_UNIFORM_TYPE.INT_VEC2:
                        this.value = [0, 0];
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                    case WEBGL_UNIFORM_TYPE.INT_VEC3:
                        this.value = [0, 0, 0];
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                    case WEBGL_UNIFORM_TYPE.INT_VEC4:
                        this.value = [0, 0, 0, 0];
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                        this.value = new Float32Array([
                            1, 0,
                            0, 1
                        ]);
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                        this.value = new Float32Array([
                            1, 0, 0,
                            0, 1, 0,
                            0, 0, 1
                        ]);
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                        this.value = new Float32Array([
                            1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        ]);
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateSetValue = function () {
                var type = this.type;
                switch (type) {
                    case WEBGL_UNIFORM_TYPE.FLOAT:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                    case WEBGL_UNIFORM_TYPE.BOOL:
                    case WEBGL_UNIFORM_TYPE.INT:
                        this.setValue = function (value) {
                            var notEqual = this.value !== value;
                            this.value = value;
                            notEqual && this.upload();
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                    case WEBGL_UNIFORM_TYPE.INT_VEC2:
                        this.setValue = function (value) {
                            var notEqual = this.value[0] !== value.x || this.value[1] !== value.y;
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            notEqual && this.upload();
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                    case WEBGL_UNIFORM_TYPE.INT_VEC3:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.upload();
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                    case WEBGL_UNIFORM_TYPE.INT_VEC4:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.value[3] = value.w;
                            this.upload();
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                        this.setValue = function (value) {
                            this.value.set(value);
                            this.upload();
                        };
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateUpload = function () {
                var gl = this.gl;
                var type = this.type;
                var location = this.location;
                switch (type) {
                    case WEBGL_UNIFORM_TYPE.FLOAT:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1f(location, value);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2f(location, value[0], value[1]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3f(location, value[0], value[1], value[2]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                    case WEBGL_UNIFORM_TYPE.BOOL:
                    case WEBGL_UNIFORM_TYPE.INT:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1i(location, value);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                    case WEBGL_UNIFORM_TYPE.INT_VEC2:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2i(location, value[0], value[1]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                    case WEBGL_UNIFORM_TYPE.INT_VEC3:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3i(location, value[0], value[1], value[2]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                    case WEBGL_UNIFORM_TYPE.INT_VEC4:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix2fv(location, false, value);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix3fv(location, false, value);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix4fv(location, false, value);
                        };
                        break;
                }
            };
            return EgretWebGLUniform;
        }());
        web.EgretWebGLUniform = EgretWebGLUniform;
        __reflect(EgretWebGLUniform.prototype, "egret.web.EgretWebGLUniform");
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
        var WebCapability = (function () {
            function WebCapability() {
            }
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
                var language = (navigator.language || navigator["browserLanguage"]).toLowerCase();
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
                        "let convertResponseBodyToText = function (binary) {\r\n" +
                        "   let byteMapping = {};\r\n" +
                        "   for ( let i = 0; i < 256; i++ ) {\r\n" +
                        "       for ( let j = 0; j < 256; j++ ) {\r\n" +
                        "           byteMapping[ String.fromCharCode( i + j * 256 ) ] =\r\n" +
                        "           String.fromCharCode(i) + String.fromCharCode(j);\r\n" +
                        "       }\r\n" +
                        "   }\r\n" +
                        "   let rawBytes = IEBinaryToArray_ByteStr(binary);\r\n" +
                        "   let lastChr = IEBinaryToArray_ByteStr_Last(binary);\r\n" +
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
        __reflect(WebCapability.prototype, "egret.web.WebCapability");
        WebCapability.detect();
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
