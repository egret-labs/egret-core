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

module egret.native {
    /**
     * @private
     */
    export class NativeTouchHandler extends HashObject {
        private $touch:egret.sys.TouchHandler;

        constructor(stage:Stage) {
            super();
            this.$touch = new egret.sys.TouchHandler(stage);

            var self = this;
            egret_native.onTouchesBegin = function (num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
                self.$executeTouchCallback(num, ids, xs_array, ys_array, self.$touch.onTouchBegin);
            };
            egret_native.onTouchesMove = function (num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
                self.$executeTouchCallback(num, ids, xs_array, ys_array, self.$touch.onTouchMove);
            };
            egret_native.onTouchesEnd = function (num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
                self.$executeTouchCallback(num, ids, xs_array, ys_array, self.$touch.onTouchEnd);
            };
            egret_native.onTouchesCancel = function (num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {

            };
        }

        private $executeTouchCallback(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>, callback:Function) {
            for (var i = 0; i < num; i++) {
                var id = ids[i];
                var x = xs_array[i];
                var y = ys_array[i];
                callback.call(this.$touch, x, y, id);
            }
        }

        /**
         * @private
         * 更新同时触摸点的数量
         */
        public $updateMaxTouches():void {
            this.$touch.$initMaxTouches();
        }
    }
}