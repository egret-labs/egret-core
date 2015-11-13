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

module egret.web {

    var surfacePool:sys.Surface[] = [];

    var isQQBrowser = navigator.userAgent.indexOf("QQBrowser") != -1;

    /**
     * @private
     */
    export class CanvasFactory implements sys.SurfaceFactory {

        /**
         * @private
         */
        public constructor() {
            sys.sharedRenderContext = this.create().renderContext;
            for (var i = 0; i < 3; i++) {
                surfacePool.push(this.create());
            }
        }

        /**
         * @private
         * 从对象池取出或创建一个新的Surface实例
         * @param useOnce 表示对取出实例的使用是一次性的，用完后立即会释放。
         */
        public create(useOnce?:boolean):sys.Surface {
            var surface = (useOnce || surfacePool.length > 3) ? surfacePool.pop() : null;
            if (!surface) {
                var canvas:HTMLCanvasElement = document.createElement("canvas");
                canvas.width = canvas.height = 1;
                if (isQQBrowser && !this.testCanvasValid(canvas)) {
                    warn("failed to create canvas!");
                    return null;
                }
                surface = this.createSurface(canvas);
            }
            return surface;
        }

        /**
         * @private
         * 释放一个Surface实例
         * @param surface 要释放的Surface实例
         */
        public release(surface:sys.Surface):void {
            if (!surface) {
                return;
            }
            if (!isQQBrowser) {
                surface.width = surface.height = 1;
            }

            surfacePool.push(surface);
        }

        /**
         * @private
         * 检测创建的canvas是否有效，QQ浏览器对硬件内存小等于1G的手机，限制Canvas创建的数量为19个。
         * 针对这个限制,同时满足以下两个条件就不会对显示造成任何影响：
         * 1.不要嵌套使用BlendMode，即使用了混合模式的容器内部不要再设置另一个子项的混合模式。
         * 2.不要嵌套使用遮罩，即遮罩对象或被遮罩对象的内部子项不要再设置另一个遮罩。
         * cacheAsBitmap功能已经自动对这个限制做了兼容，即使设置cacheAsBitmap为true，若Canvas数量不足，将会放弃缓存，以保证渲染显示正确。
         * 另外，如果要销毁一个开启过cacheAsBitmap的显示对象，在断开引用前建议显式将cacheAsBitmap置为false，这样可以回收一个Canvas对象。
         */
        private testCanvasValid(canvas:HTMLCanvasElement):boolean {
            canvas.height = 1;
            canvas.width = 1;
            var data = canvas.toDataURL("image/png");
            if (data == 'data:,')
                return false;
            return true;
        }

        /**
         * @private
         */
        private createSurface(canvas:HTMLCanvasElement):sys.Surface {
            var context = canvas.getContext("2d");
            canvas["renderContext"] = context;
            context["surface"] = canvas;
            $toBitmapData(canvas);

            if (egret.sys.isUndefined(context["imageSmoothingEnabled"])) {
                var keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
                for (var i = keys.length - 1; i >= 0; i--) {
                    var key = keys[i];
                    if (context[key]!==void 0) {
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
            return <sys.Surface><any>canvas;
        }

    }
}