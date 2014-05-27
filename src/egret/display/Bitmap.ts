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

/// <reference path="../context/renderer/RenderFilter.ts"/>
/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="DisplayObject.ts"/>
/// <reference path="SpriteSheet.ts"/>
/// <reference path="Texture.ts"/>
/// <reference path="../geom/Rectangle.ts"/>

module ns_egret {
	/**
	 * @class ns_egret.Bitmap
	 * @classdesc
     * Bitmap 类表示用于表示位图图像的显示对象。
	 * @extends ns_egret.DisplayObject
	 */
    export class Bitmap extends DisplayObject {

        /**
         * 全部Bitmap是否开启DEBUG模式
		 * @member {boolean} ns_egret.Bitmap.debug
         */
        public static debug:boolean = false;

        public constructor(texture?:Texture) {
            super();
            if(texture){
                this.texture = texture;
            }
        }

        /**
         * 单个Bitmap是否开启DEBUG模式
		 * @member {boolean} ns_egret.Bitmap#debug
         */
        public debug:boolean = false;

        /**
         * debug边框颜色，默认值为红色
		 * @member {number} ns_egret.Bitmap#debugColor
         */
        public debugColor:number = 0xff0000;

        private _spriteFrame:ns_egret.SpriteSheetFrame;
        /**
         * 这个API已废弃,将删除SpriteSheetFrame类。
         * @deprecated
         */
        public get spriteFrame():ns_egret.SpriteSheetFrame{
            return this._spriteFrame;
        }
        public set spriteFrame(value:SpriteSheetFrame){
            this._spriteFrame = value;
            if(this.texture){
                this.texture._startX = value.x;
                this.texture._startY = value.y;
                this.texture._textureHeight = value.h;
                this.texture._textureWidth = value.w;
                this.texture._offsetX = value.offX;
                this.texture._offsetY = value.offY;
            }
        }

        /**
         * 渲染纹理
		 * @member {ns_egret.Texture} ns_egret.Bitmap#texture
         */
        public texture:Texture;

        public _render(renderContext:RendererContext):void {
            var texture = this.texture;
            if (!texture) {
                this._texture_to_render = null;
                return;
            }
            this._texture_to_render = texture;
            var w:number = texture._textureWidth;
            var h:number = texture._textureHeight;
            RenderFilter.getInstance().drawImage(renderContext, this, texture._startX, texture._startY,
                w, h, texture._offsetX, texture._offsetY, w, h);
        }

        /**
         * @see egret.DisplayObject.measureBounds
         * @returns {ns_egret.Rectangle}
         * @private
         */
        public _measureBounds():ns_egret.Rectangle {
            var texture:Texture = this.texture;
            if(!texture){
                return super._measureBounds();
            }
            var x:number = texture._offsetX;
            var y:number = texture._offsetY;
            var w:number = texture._textureWidth;
            var h:number = texture._textureHeight;
            return Rectangle.identity.initialize(x,y, w, h);
        }
    }
}