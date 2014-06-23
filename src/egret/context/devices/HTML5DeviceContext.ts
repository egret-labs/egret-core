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


module egret {


	/**
	 * @class egret.HTML5DeviceContext
	 * @classdesc
	 * @extends egret.DeviceContext
	 */
    export class HTML5DeviceContext extends DeviceContext {


        private _time:number = 0;

		/**
		 * @member egret.HTML5DeviceContext#frameRate
		 */
        public frameRate:number = 60;s

		/**
		 * @method egret.HTML5DeviceContext#constructor
		 */
        public constructor() {
            super();
        }

        static requestAnimationFrame:Function = window["requestAnimationFrame"] ||
            window["webkitRequestAnimationFrame"] ||
            window["mozRequestAnimationFrame"] ||
            window["oRequestAnimationFrame"] ||
            window["msRequestAnimationFrame"] ||
            //如果全都没有，使用setTimeout实现
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };


		/**
		 * @method egret.HTML5DeviceContext#executeMainLoop
		 * @param callback {Function} 
		 * @param thisObject {any} 
		 */
        public executeMainLoop(callback:Function, thisObject:any):void {


            var self = this;

            var enterFrame = function () {
                var thisTime:number = getTimer();
                var advancedTime = thisTime - self._time;
                callback.call(thisObject, advancedTime);
                self._time = thisTime;
                HTML5DeviceContext.requestAnimationFrame.call(window, enterFrame);
            }

            HTML5DeviceContext.requestAnimationFrame.call(window, enterFrame);
        }
    }

}