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

/// <reference path="../core/Logger.ts"/>

module ns_egret{
    /**
     * @class SpriteSheet类是位图SpriteSheet的配置文件。包括一组SpriteSheetFrame
     * 每一个Bitmap对象都可以设置其SpriteSheetFrame，实现显示纹理的特定区域
     * 在WebGL / OpenGL上，这种做法可以显著提升性能
     * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
     * todo: GitHub egret的SpriteSheet
     */
    export class SpriteSheet {

        private frames:Object;
        constructor(data) {
            this.frames = data.frames;
        }


        /**
         * 获取指定的SpriteFrame
         * @param spriteFrameName
         * @returns {*}
         */
        public getFrame(spriteFrameName) {
            var frame = this.frames[spriteFrameName];
            if(frame == null)
            {
                ns_egret.Logger.fatal("没有找到相应的frame：", spriteFrameName);
            }
            return frame;
        }


        /**
         * 这个API已经被完全废弃，会尽快删除
         * @param data
         * @returns {SpriteSheet}
         * @stable D
         */
        static parseFromDragonBones(data):SpriteSheet {

            var spriteSheet:SpriteSheet = new SpriteSheet(data);
            spriteSheet.frames = {};
            var list = data.SubTexture

            for (var key in list) {
                var frameData = list[key];
                var rect = new SpriteSheetFrame();
                rect.w = frameData.width;
                rect.h = frameData.height;
                rect.x = frameData.x;
                rect.y = frameData.y;
                spriteSheet.frames[frameData.name] = rect;
//            console.log (rect);
            }
            return spriteSheet;
        }


    }

    export class SpriteSheetFrame {
        /**
         * 表示这个Frame在Sheet上的x位置
         */
        public x:number;
        /**
         * 表示这个Frame在Sheet上的y位置
         */
        public y:number;
        /**
         * 表示这个Frame在Sheet上的宽度
         */
        public w:number;
        /**
         * 表示这个Frame在Sheet上的高度
         */
        public h:number;

        /**
         * 表示这个Frame显示了之后需要在x方向的渲染偏移量
         */
        public offX:number = 0;

        /**
         * 表示这个Frame显示了之后需要在y方向的渲染偏移量
         */
        public offY:number = 0;
    }
}