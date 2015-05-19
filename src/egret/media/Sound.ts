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

module egret {

    /**
     * @class egret.Sound
     * @classdesc Sound 类允许您在应用程序中使用声音。
     * @link http://docs.egret-labs.org/post/manual/sound/playsound.html 播放音频
     *
     * @event egret.SoundEvent.SOUND_COMPLETE 在声音完成播放后调度。
     */
    export class Sound extends egret.EventDispatcher{

        /**
         * 背景音乐
         * @constant egret.Sound.MUSIC
         */
        public static MUSIC:string = "music";
        /**
         * 音效
         * @constant egret.Sound.EFFECT
         */
        public static EFFECT:string = "effect";
        public path:string = "";

        /**
         * 创建 egret.Sound 对象
         */
        constructor() {
            super();
        }

        /**
         * audio音频对象
         * @member {any} egret.Sound#audio
         */
        private audio:IAudio = null;

        /**
         * 类型，默认为 egret.Sound.EFFECT。
         * 在 native 和 runtime 环境下，背景音乐同时只能播放一个，音效长度尽量不要太长。
         * @member {any} egret.Sound#audio
         */
        public type:string = Sound.EFFECT;

        /**
         * 当播放声音时，position 属性表示声音文件中当前播放的位置（以毫秒为单位）。
         * h5支持，native不支持
         * @returns {number}
         */
        public get position():number {
            return this.audio ? this.audio.currentTime : 0;
        }

        /**
         * 播放声音
         * @param loop  是否循环播放，默认为false
         * @param position  是否从刚开始播放 h5支持，native不支持
         */
        public play(loop:boolean = false, position:number = 0):void {
            var sound = this.audio;
            if (!sound) {
                return;
            }
            sound.currentTime = position / 1000;
            sound.setLoop(loop);
            sound.play(this.type);
        }

        private _pauseTime:number = 0;

        /**
         * 声音停止播放
         */
        public stop():void {
            var sound = this.audio;
            if (!sound) {
                return;
            }
            this._pauseTime = 0;
            sound.currentTime = 0;
            sound.pause();
        }

        /**
         * 暂停声音
         */
        public pause():void {
            var sound = this.audio;
            if (!sound) {
                return;
            }
            this._pauseTime = sound.currentTime;
            sound.pause();
        }

        /**
         * 继续从上次暂停的位置播放
         * h5支持，native不支持
         */
        public resume():void {
            var sound = this.audio;
            if (!sound) {
                return;
            }
            sound.currentTime = this._pauseTime;
            this._pauseTime = 0;
            sound.play();
        }

        /**
         * 重新加载声音
         */
        public load():void {
            var sound = this.audio;
            if (!sound) {
                return;
            }
            sound.load();
        }

        private _listeners:Array<any> = [];
        /**
         * 添加事件监听
         * h5支持，native不支持
         * @param type 事件类型
         * @param listener 监听函数
         * @param thisObj 侦听函数绑定的this对象
         */
        public addEventListener(type:string, listener:Function, thisObject:any = null):void {
            super.addEventListener(type, listener, thisObject);
            var self = this;
            var sound = this.audio;
            if (!sound) {
                return;
            }
            var func = function () {
                self.dispatchEvent(new egret.SoundEvent(egret.SoundEvent.SOUND_COMPLETE));
            };
            var virtualType = self.getVirtualType(type);
            for (var i = 0; i < self._listeners.length; i++) {
                var bin = self._listeners[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.type == virtualType) {
                    return;
                }
            }
            this._listeners.push({ type: virtualType, listener: listener, thisObject: thisObject, func: func });
            this.audio.addEventListener(virtualType, func, false);
        }

        /**
         * 移除事件监听
         * h5支持，native不支持
         * @param type 事件类型
         * @param listener 监听函数
         * @param thisObj 侦听函数绑定的this对象
         */
        public removeEventListener(type:string, listener:Function, thisObject:any = null):void {
            super.removeEventListener(type, listener, thisObject);
            var self = this;
            var sound = this.audio;
            if (!sound) {
                return;
            }
            var virtualType = self.getVirtualType(type);
            for (var i = 0; i < self._listeners.length; i++) {
                var bin = self._listeners[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.type == virtualType) {
                    self._listeners.splice(i, 1);
                    self.audio.removeEventListener(virtualType, bin.func, false);
                    break;
                }
            }
        }

        private getVirtualType(type:string):string {
            switch (type) {
                case egret.SoundEvent.SOUND_COMPLETE:
                    return "ended";
                default:
                    return type;
            }
        }

        /**
         * 音量范围从 0（静音）至 1（最大音量）。
         * h5支持，native不支持
         * @returns number
         */
        public set volume(value:number) {
            var sound = this.audio;
            if (!sound) {
                return;
            }
            sound.volume = Math.max(0, Math.min(value, 1));
        }

        public get volume():number {
            return this.audio ? this.audio.volume : 0;
        }

        /**
         * @deprecated
         * 设置音量
         * @param value 值需大于0 小于等于 1
         */
        public setVolume(value:number):void {
            console.warn("use this.volume = value instead");
            this.volume = value;
        }

        /**
         * @deprecated
         * 获取当前音量值
         * @returns number
         */
        public getVolume():number {
            console.warn("use this.volume instead");
            return this.volume;
        }

        /**
         * 将声音文件加载到内存，
         * native中使用，html5里为空实现
         * @param type 声音类型
         * @param callback 回调函数
         * @param thisObj 侦听函数绑定的this对象
         */
        public preload(type:string, callback:Function = null, thisObj:any = null):void {
            this.type = type;

            this.audio.preload(type, callback, thisObj);
        }

        public _setAudio(value:IAudio):void {
            this.audio = value;
        }

        /**
         * 释放当前音频
         * native中使用，html5里为空实现
         */
        public destroy():void {
            this.audio.destroy();
        }
    }
}