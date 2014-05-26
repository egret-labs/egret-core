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

/// <reference path="../utils/HashObject.ts"/>
/// <reference path="../utils/Logger.ts"/>

module ns_egret{
    /**
     * @class SpriteSheet是一张由多个子位图拼接而成的集合位图，它包含多个Texture对象。
     * 每一个Texture都共享SpriteSheet的集合位图，但是指向它的不同的区域。
     * 在WebGL / OpenGL上，这种做法可以显著提升性能
     * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
     */
    export class SpriteSheet extends HashObject{

        public constructor(bitmapData:any) {
            super();
            if(bitmapData.frames)//to-do 这段代码是为了兼容SpriteSheetFrame的配置，要删除。
                this.textureMap = bitmapData.frames;
            else{
                this.bitmapData = bitmapData;
                this.textureMap = {};
            }

        }
        /**
         * 这个接口即将废弃
         * @deprecated
         */
        public getFrame(spriteFrameName) {
            var frame = this.textureMap[spriteFrameName];
            if(frame == null)
            {
                ns_egret.Logger.fatal("没有找到相应的frame：", spriteFrameName);
            }
            return frame;
        }

        /**
         * 共享的位图数据
         */
        private bitmapData:any;
        /**
         * 纹理缓存字典
         */
        private textureMap:Object;
        /**
         * 根据指定纹理名称获取一个缓存的Textrue对象
         * @method ns_egret.SpriteSheet#getTexture
         * @param name {string} 缓存这个Texture对象所使用的名称，如果名称已存在，将会覆盖之前的Texture对象
         * @returns {ns_egret.Texture} 创建的Texture对象
         */
        public getTexture(name:string):Texture{
            return this.textureMap[name];
        }

        /**
         * 为SpriteSheet上的指定区域创建一个新的Texture对象并缓存它
         * @method ns_egret.SpriteSheet#createTexture
         * @param name {string} 缓存这个Texture对象所使用的名称，如果名称已存在，将会覆盖之前的Texture对象
         * @param startX {number} 指定位图区域在SpriteSheet上的起始坐标x
         * @param startY {number} 指定位图区域在SpriteSheet上的起始坐标y
         * @param width {number} 指定位图区域在SpriteSheet上的宽度
         * @param height {number} 指定位图区域在SpriteSheet上的高度
         * @returns {ns_egret.Texture} 创建的Texture对象
         */
        public createTexture(name:string,startX:number,startY:number,width:number,height:number):Texture{
            var texture:Texture = new Texture();
            texture._bitmapData = this.bitmapData;
            texture._startX = startX;
            texture._startY = startY;
            texture._textureWidth = width;
            texture._textureHeight = height;
            this.textureMap[name] = texture;
            return texture;
        }


    }
    /**
     * 这个类即将废弃
     * @deprecated
     */
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