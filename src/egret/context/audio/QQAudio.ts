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

declare module QZAppExternal {
    function playLocalSound(call, data);
    function playLocalBackSound(data);
    function preloadSound(call, data);
    function stopSound();
    function stopBackSound();
}

module egret {
    /**
     * @private
     */
    export class QQAudio implements IAudio {

        constructor() {
        }

        private _loop:boolean = false;

        private _type:string;
        /**
         * 播放声音
         * @method egret.Sound#play
         * @param loop {boolean} 是否循环播放，默认为false
         */
        public _play(type?:string):void {
            this._type = type;
            if (type == egret.Sound.EFFECT) {
                QZAppExternal.playLocalSound(
                    function(data){
                        //alert(JSON.stringify(data));
                    },{
                        bid : -1,
                        url : this._path,
                        loop : this._loop? -1:0
                    });
            }
            else {
                QZAppExternal.playLocalBackSound({
                    bid : -1,
                    url : this._path,
                    loop : this._loop? -1:0
                });
            }
        }

        /**
         * 暂停声音
         * @method egret.Sound#pause
         */
        public _pause():void {
            if (this._type == egret.Sound.EFFECT) {
                QZAppExternal.stopSound();
            }
            else {
                QZAppExternal.stopBackSound();
            }
        }

        /**
         * 添加事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public _addEventListener(type:string, listener:Function, useCapture:boolean = false):void {

        }

        /**s
         * 移除事件监听
         * @param type 事件类型
         * @param listener 监听函数
         */
        public _removeEventListener(type:string, listener:Function, useCapture:boolean = false):void {

        }

        /**
         * 重新加载声音
         * @method egret.Sound#load
         */
        public _load():void {
        }

        public _preload(type:string, callback:Function = null, thisObj:any = null):void {
            egret.callLater(callback, thisObj);
        }

        private _path:string;
        public _setPath(path:string):void {
            this._path = path;
        }

        /**
         * 获取当前音量值
         * @returns number
         */
        public _getVolume():number {
            return 1;
        }

        public _setVolume(value:number) {
        }

        public _setLoop(value:boolean):void {
            this._loop = value;
        }

        private _currentTime:number = 0;

        public _getCurrentTime():number {
            return 0;
        }

        public _setCurrentTime(value:number) {
            this._currentTime = value;
        }

        public _destroy():void {

        }

    }
}
