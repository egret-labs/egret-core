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
///<reference path="../core/Logger.ts"/>
module ns_egret {
    export class DEBUG {
        /**
         * drawImage时检测传入参数
         */
        static DRAW_IMAGE:Boolean = true;

        static checkDrawImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
            if (texture == null) {
                Logger.fatal("texture为空");
            }
            if (texture.getTextureWidth() < sourceX + sourceWidth || texture.getTextureHeight() < sourceY + sourceHeight) {
                Logger.fatal("提供的尺寸超出texture尺寸");
            }
        }

        static ADD_EVENT_LISTENER:Boolean = true;

        static checkAddEventListener(eventName:string, func:Function, thisObj, useCapture:Boolean = false, priority:number = 0) {
            if (func == null || func == undefined) {
                Logger.fatal("addEventListener侦听函数不能为空");
            }
        }

        static SCALE_BITMAP_SET_SCALE_GRID:Boolean = true;

        static checkSetScaleGrid(texture, top, bottom, left, right) {
            if (!texture) {
                Logger.fatal("Scale9Bitmap没有纹理");
            }
            if (parseInt(top) < 0 || parseInt(bottom) < 0 || parseInt(left) < 0 || parseInt(right) < 0) {
                Logger.fatal("传入的值不能为负数");
            }
            if (texture.getTextureWidth() < left + right) {
                Logger.fatal("传入的宽度超出范围");
            }
            if (texture.getTextureHeight() < top + bottom) {
                Logger.fatal("传入的高度超出范围");
            }
        }


        /**
         * 跟踪渲染主循环过程
         * @param command 0,停止主循环; 1,执行一次主循环 2,正常循环渲染
         * @constructor
         */
        static TRACE_RENDER_LOOP(command:int = 0):void {
            var ticker:ns_egret.Ticker = ns_egret.Ticker.getInstance();
            var context =  ns_egret.MainContext.instance;
            switch (command) {
                case 0:
                    ticker.unregister(context.renderLoop,context);
                    break;
                case 1:
                    context.renderLoop();
                    break;
                case 2:
                    ticker.register(context.renderLoop,context);
                    break;
            }
        }

    }
}