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
	 * @class egret.Bitmap
	 * @classdesc
     * Bitmap 类表示用于表示位图图像的显示对象。这些图像可以是使用 Bitmap() 构造函数创建的图像。
     * 利用 Bitmap() 构造函数，可以创建包含对 Texture 对象的引用的 Bitmap 对象。创建了 Bitmap 对象后，使用父 DisplayObjectContainer 实例的 addChild() 或 addChildAt() 方法将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 Texture 引用，与转换属性或旋转属性无关。由于能够创建引用相同 Texture 对象的多个 Bitmap 对象，因此，多个显示对象可以使用相同的复杂 Texture 对象，而不会因为每个显示对象实例使用一个 Texture 对象而产生内存开销。
     * @link http://docs.egret-labs.org/post/manual/bitmap/createbitmap.html 创建位图
	 * @extends egret.DisplayObject
	 */
    export class Bitmap extends DisplayObject {

        private static renderFilter:RenderFilter = RenderFilter.getInstance();

        /**
         * 初始化 Bitmap 对象以引用指定的 Texture 对象
         * @param texture {Texture} 纹理
         */
        public constructor(texture?:Texture) {
            super();
            if(texture){
                this._texture = texture;
                this._setSizeDirty();
            }
            this.needDraw = true;
        }

        private _texture:Texture = null;
        /**
         * 渲染纹理
		 * @member {egret.Texture} egret.Bitmap#texture
         */
        public get texture():Texture{
            return this._texture;
        }

        public set texture(value:Texture){
            if(value==this._texture){
                return;
            }
            this._setSizeDirty();
            this._texture = value;
        }
        /**
         * 矩形区域，它定义位图对象的九个缩放区域。此属性仅当fillMode为BitmapFillMode.SCALE时有效。
         * scale9Grid的x、y、width、height分别代表九宫图中中间那块的左上点的x、y以及中间方块的宽高。
         * @member {egret.Rectangle} egret.Bitmap#scale9Grid
         */
        public scale9Grid:Rectangle = null;

        /**
         * 确定位图填充尺寸的方式。
         * 设置为 BitmapFillMode.REPEAT时，位图将重复以填充区域；BitmapFillMode.SCALE时，位图将拉伸以填充区域。
         * 默认值：BitmapFillMode.SCALE。
         * @member {string} egret.Bitmap#fillMode
         */
        public fillMode:string = "scale";

        public _render(renderContext:RendererContext):void {
            var texture = this._texture;
            if (!texture) {
                this._texture_to_render = null;
                return;
            }
            this._texture_to_render = texture;
            var destW:number = this._getFlag(DisplayObjectFlags.HAS_WIDTH_SET)?this._explicitWidth:texture._textureWidth;
            var destH:number = this._getFlag(DisplayObjectFlags.HAS_HEIGHT_SET)?this._explicitHeight:texture._textureHeight;
            Bitmap._drawBitmap(renderContext,destW,destH,this);
        }

        public static _drawBitmap(renderContext:RendererContext,destW:number, destH:number,thisObject:any):void{
            var texture = thisObject._texture_to_render;
            if(!texture){
                return;
            }
            var textureWidth:number = texture._textureWidth;
            var textureHeight:number = texture._textureHeight;
            if(thisObject.fillMode=="scale"){
                var s9g:Rectangle = thisObject.scale9Grid||texture["scale9Grid"];
                if (s9g&&textureWidth - s9g.width < destW && textureHeight - s9g.height < destH) {
                    Bitmap.drawScale9GridImage(renderContext, thisObject, s9g, destW, destH);
                }
                else{
                    var offsetX:number = texture._offsetX;
                    var offsetY:number = texture._offsetY;
                    var bitmapWidth:number = texture._bitmapWidth||textureWidth;
                    var bitmapHeight:number = texture._bitmapHeight||textureHeight;
                    var scaleX:number = destW/textureWidth;
                    offsetX = Math.round(offsetX*scaleX);
                    destW = Math.round(bitmapWidth*scaleX);
                    var scaleY:number = destH/textureHeight;
                    offsetY = Math.round(offsetY*scaleY);
                    destH = Math.round(bitmapHeight*scaleY);
                    Bitmap.renderFilter.drawImage(renderContext, thisObject, texture._bitmapX, texture._bitmapY,
                        bitmapWidth, bitmapHeight, offsetX, offsetY, destW,destH);
                }
            }
            else{
                Bitmap.drawRepeatImage(renderContext, thisObject, destW, destH, thisObject.fillMode);
            }
        }

        /**
         * 绘制平铺位图
         */
        private static drawRepeatImage(renderContext:RendererContext, data:RenderData, destWidth:number, destHeight:number,repeat:string):void {
            var texture:Texture = data._texture_to_render;
            if (!texture) {
                return;
            }
            var textureWidth:number = texture._textureWidth;
            var textureHeight:number = texture._textureHeight;
            var sourceX:number = texture._bitmapX;
            var sourceY:number = texture._bitmapY;
            var sourceWidth:number = texture._bitmapWidth||textureWidth;
            var sourceHeight:number = texture._bitmapHeight||textureHeight;
            var destX:number = texture._offsetX;
            var destY:number = texture._offsetY;

            var renderFilter:RenderFilter = RenderFilter.getInstance();
            renderFilter.drawImage(renderContext, data, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight,repeat);
        }

        /**
         * 绘制九宫格位图
         */
        private static drawScale9GridImage(renderContext:RendererContext, data:RenderData, scale9Grid:Rectangle,
                                   destWidth:number, destHeight:number):void {
            var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
            var texture:Texture = data._texture_to_render;
            if (!texture || !scale9Grid) {
                return;
            }
            var textureWidth:number = texture._textureWidth;
            var textureHeight:number = texture._textureHeight;
            var sourceX:number = texture._bitmapX;
            var sourceY:number = texture._bitmapY;
            var sourceWidth:number = texture._bitmapWidth||textureWidth;
            var sourceHeight:number = texture._bitmapHeight||textureHeight;

            destWidth -= textureWidth-sourceWidth;
            destHeight -= textureHeight-sourceHeight;

            if (renderContext.drawImageScale9(texture, sourceX, sourceY, sourceWidth, sourceHeight, texture._offsetX, texture._offsetY, destWidth, destHeight, scale9Grid)) {
                return;
            }

            var destX:number = texture._offsetX / texture_scale_factor;
            var destY:number = texture._offsetY / texture_scale_factor;

            var renderFilter:RenderFilter = RenderFilter.getInstance();

            var s9g:Rectangle = Rectangle.identity.initialize(
                    scale9Grid.x - Math.round(destX), scale9Grid.y - Math.round(destX),
                scale9Grid.width, scale9Grid.height);
            var roundedDrawX:number = Math.round(destX);
            var roundedDrawY:number = Math.round(destY);

            //防止空心的情况出现。
            if (s9g.y == s9g.bottom) {
                if (s9g.bottom < sourceHeight)
                    s9g.bottom++;
                else
                    s9g.y--;
            }
            if (s9g.x == s9g.right) {
                if (s9g.right < sourceWidth)
                    s9g.right++;
                else
                    s9g.x--;
            }

            var sourceX2:number = sourceX + s9g.x / texture_scale_factor;
            var sourceX3:number = sourceX + s9g.right / texture_scale_factor;
            var sourceRightW:number = sourceWidth - s9g.right;
            var sourceY2:number = sourceY + s9g.y / texture_scale_factor;
            var sourceY3:number = sourceY + s9g.bottom / texture_scale_factor;
            var sourceBottomH:number = sourceHeight - s9g.bottom;

            var destX1:number = roundedDrawX + s9g.x;
            var destY1:number = roundedDrawY + s9g.y;
            var destScaleGridBottom:number = destHeight - (sourceHeight - s9g.bottom);
            var destScaleGridRight:number = destWidth - (sourceWidth - s9g.right);

            renderFilter.drawImage(renderContext, data, sourceX, sourceY, s9g.x, s9g.y, roundedDrawX, roundedDrawY, s9g.x, s9g.y);
            renderFilter.drawImage(renderContext, data, sourceX2, sourceY, s9g.width, s9g.y, destX1, roundedDrawY, destScaleGridRight - s9g.x, s9g.y);
            renderFilter.drawImage(renderContext, data, sourceX3, sourceY, sourceRightW, s9g.y, roundedDrawX + destScaleGridRight, roundedDrawY, destWidth - destScaleGridRight, s9g.y);
            renderFilter.drawImage(renderContext, data, sourceX, sourceY2, s9g.x, s9g.height, roundedDrawX, destY1, s9g.x, destScaleGridBottom - s9g.y);
            renderFilter.drawImage(renderContext, data, sourceX2, sourceY2, s9g.width, s9g.height, destX1, destY1, destScaleGridRight - s9g.x, destScaleGridBottom - s9g.y);
            renderFilter.drawImage(renderContext, data, sourceX3, sourceY2, sourceRightW, s9g.height, roundedDrawX + destScaleGridRight, destY1, destWidth - destScaleGridRight, destScaleGridBottom - s9g.y);
            renderFilter.drawImage(renderContext, data, sourceX, sourceY3, s9g.x, sourceBottomH, roundedDrawX, roundedDrawY+destScaleGridBottom, s9g.x, destHeight - destScaleGridBottom);
            renderFilter.drawImage(renderContext, data, sourceX2, sourceY3, s9g.width, sourceBottomH, destX1, roundedDrawY+destScaleGridBottom, destScaleGridRight - s9g.x, destHeight - destScaleGridBottom);
            renderFilter.drawImage(renderContext, data, sourceX3, sourceY3, sourceRightW, sourceBottomH, roundedDrawX + destScaleGridRight, roundedDrawY+destScaleGridBottom, destWidth - destScaleGridRight, destHeight - destScaleGridBottom);
        }

        /**
         * @see egret.DisplayObject.measureBounds
         * @returns {egret.Rectangle}
         * @private
         */
        public _measureBounds():egret.Rectangle {
            var texture:Texture = this._texture;
            if(!texture){
                return super._measureBounds();
            }
            //点击区域要包含原图中得透明区域，所以xy均返回0
            var x:number = 0;//texture._offsetX;
            var y:number = 0;//texture._offsetY;
            var w:number = texture._textureWidth;
            var h:number = texture._textureHeight;
            return Rectangle.identity.initialize(x,y, w, h);
        }
    }
}