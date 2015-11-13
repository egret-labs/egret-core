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

module egret.sys {
    /**
     * @private
     */
    export const enum BitmapKeys {
        bitmapData,
        image,
        clipX,
        clipY,
        clipWidth,
        clipHeight,
        offsetX,
        offsetY,
        width,
        height,
        smoothing,
        explicitBitmapWidth,
        explicitBitmapHeight
    }
}

module egret {
    /**
     * @language en_US
     * The Bitmap class represents display objects that represent bitmap images.
     * The Bitmap() constructor allows you to create a Bitmap object that contains a reference to a BitmapData object.
     * After you create a Bitmap object, use the addChild() or addChildAt() method of the parent DisplayObjectContainer
     * instance to place the bitmap on the display list.A Bitmap object can share its texture reference among several
     * Bitmap objects, independent of translation or rotation properties. Because you can create multiple Bitmap objects
     * that reference the same texture object, multiple display objects can use the same complex texture object
     * without incurring the memory overhead of a texture object for each display object instance.
     *
     * @see egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Bitmap.ts
     */
    /**
     * @language zh_CN
     * Bitmap 类表示用于显示位图图片的显示对象。
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象引用的 Bitmap 对象。创建了 Bitmap 对象后，
     * 使用父级 DisplayObjectContainer 实例的 addChild() 或 addChildAt() 方法可以将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 texture 引用，与缩放或旋转属性无关。
     * 由于能够创建引用相同 texture 对象的多个 Bitmap 对象，因此，多个显示对象可以使用相同的 texture 对象，
     * 而不会因为每个显示对象实例使用一个 texture 对象而产生额外内存开销。
     *
     * @see egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Bitmap.ts
     */
    export class Bitmap extends DisplayObject {

        /**
         * @language en_US
         * Initializes a Bitmap object to refer to the specified BitmapData|Texture object.
         * @param value The BitmapData|Texture object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个引用指定 BitmapData|Texture 实例的 Bitmap 对象
         * @param value 被引用的 BitmapData|Texture 实例
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(value?:BitmapData|Texture) {
            super();
            this.$renderRegion = new sys.Region();
            this.$Bitmap = {
                0: null,     // bitmapData,
                1: null,     // image,
                2: 0,        // clipX,
                3: 0,        // clipY,
                4: 0,        // clipWidth,
                5: 0,        // clipHeight,
                6: 0,        // offsetX,
                7: 0,        // offsetY,
                8: 0,        // width,
                9: 0,        // height
                10: true,    // smoothing
                11: NaN, //explicitBitmapWidth,
                12: NaN  //explicitBitmapHeight,
            };

            this.$setBitmapData(value);
        }

        /**
         * @private
         */
        $Bitmap:Object;

        /**
         * @private
         * 显示对象添加到舞台
         */
        $onAddToStage(stage:Stage, nestLevel:number):void {
            super.$onAddToStage(stage, nestLevel);

            var bitmapData = this.$Bitmap[sys.BitmapKeys.bitmapData];
            if (bitmapData) {
                if (bitmapData instanceof Texture) {
                    Texture.$addDisplayObject(this, bitmapData._bitmapData.hashCode);
                }
                else {
                    Texture.$addDisplayObject(this, bitmapData.hashCode);
                }
            }
        }

        /**
         * @private
         * 显示对象从舞台移除
         */
        $onRemoveFromStage():void {
            super.$onRemoveFromStage();

            var bitmapData = this.$Bitmap[sys.BitmapKeys.bitmapData];
            if (bitmapData) {
                if (bitmapData instanceof Texture) {
                    Texture.$removeDisplayObject(this, bitmapData._bitmapData.hashCode);
                }
                else {
                    Texture.$removeDisplayObject(this, bitmapData.hashCode);
                }
            }
        }

        /**
         * @language en_US
         * The BitmapData object being referenced.
         * If you pass the constructor of type Texture or last set for texture, this value returns null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 被引用的 BitmapData 对象。
         * 如果传入构造函数的类型为 Texture 或者最后设置的为 texture，则此值返回 null。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get bitmapData():BitmapData {
            var value = this.$Bitmap[sys.BitmapKeys.bitmapData];
            if (value instanceof Texture) {
                return null;
            }
            else {
                return value;
            }
        }

        public set bitmapData(value:BitmapData) {
            this.$setBitmapData(value);
        }

        /**
         * @language en_US
         * The Texture object being referenced.
         * If you pass the constructor of type BitmapData or last set for bitmapData, this value returns null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 被引用的 Texture 对象。
         * 如果传入构造函数的类型为 BitmapData 或者最后设置的为 bitmapData，则此值返回 null。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get texture():Texture {
            var value = this.$Bitmap[sys.BitmapKeys.bitmapData];
            if (value instanceof Texture) {
                return value;
            }
            else {
                return null;
            }
        }

        public set texture(value:Texture) {
            this.$setBitmapData(value);
        }

        /**
         * @private
         */
        $setBitmapData(value:BitmapData|Texture):boolean {
            var values = this.$Bitmap;
            if (value == values[sys.BitmapKeys.bitmapData]) {
                return false;
            }
            values[sys.BitmapKeys.bitmapData] = value;
            if (value) {
                if (value instanceof Texture) {
                    var texture = <Texture>value;

                    this.setImageData(texture._bitmapData, texture._bitmapX, texture._bitmapY, texture._bitmapWidth,
                        texture._bitmapHeight, texture._offsetX, texture._offsetY, texture.$getTextureWidth(), texture.$getTextureHeight());
                }
                else {
                    this.setImageData(<BitmapData>value, 0, 0, (<BitmapData>value).width, (<BitmapData>value).height, 0, 0, (<BitmapData>value).width, (<BitmapData>value).height);
                }
            }
            else {
                this.setImageData(null, 0, 0, 0, 0, 0, 0, 0, 0);
                this.$invalidateContentBounds();
                return true;
            }

            if (this.$stage) {
                if (value instanceof Texture) {
                    Texture.$addDisplayObject(this, value._bitmapData.hashCode);
                }
                else {
                    Texture.$addDisplayObject(this, value.hashCode);
                }
            }

            this.$invalidateContentBounds();
            return true;
        }

        /**
         * @private
         */
        private setImageData(image:BitmapData, clipX:number, clipY:number, clipWidth:number, clipHeight:number,
                             offsetX:number, offsetY:number, width:number, height:number):void {
            var values = this.$Bitmap;
            values[sys.BitmapKeys.image] = image;
            values[sys.BitmapKeys.clipX] = clipX;
            values[sys.BitmapKeys.clipY] = clipY;
            values[sys.BitmapKeys.clipWidth] = clipWidth;
            values[sys.BitmapKeys.clipHeight] = clipHeight;
            values[sys.BitmapKeys.offsetX] = offsetX;
            values[sys.BitmapKeys.offsetY] = offsetY;
            values[sys.BitmapKeys.width] = width;
            values[sys.BitmapKeys.height] = height;
        }

        /**
         * @private
         */
        $scale9Grid:egret.Rectangle = null;

        /**
         * @language en_US
         * Represent a Rectangle Area that the 9 scale area of Image.
         * Notice: This property is valid only when <code>fillMode</code>
         * is <code>BitmapFillMode.SCALE</code>.
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get scale9Grid():egret.Rectangle {
            return this.$scale9Grid;
        }

        public set scale9Grid(value:egret.Rectangle) {
            this.$scale9Grid = value;
            this.$invalidateContentBounds();
        }

        /**
         * @private
         */
        $fillMode:string = "scale";
        /**
         * @language en_US
         * Determines how the bitmap fills in the dimensions.
         * ends at the edge of the region.</p>
         * <p>When set to <code>BitmapFillMode.REPEAT</code>, the bitmap
         * repeats to fill the region.</p>
         * <p>When set to <code>BitmapFillMode.SCALE</code>, the bitmap
         * stretches to fill the region.</p>
         *
         * @default <code>BitmapFillMode.SCALE</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 确定位图填充尺寸的方式。
         * <p>设置为 <code>BitmapFillMode.REPEAT</code>时，位图将重复以填充区域。</p>
         * <p>设置为 <code>BitmapFillMode.SCALE</code>时，位图将拉伸以填充区域。</p>
         *
         * @default <code>BitmapFillMode.SCALE</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        public get fillMode():string {
            return this.$fillMode;
        }

        public set fillMode(value:string) {
            this.$setFillMode(value);
        }

        $setFillMode(value:string):boolean {
            if (value == this.$fillMode) {
                return false;
            }
            this.$fillMode = value;

            return true;
        }

        /**
         * @private
         */
        $smoothing:boolean = true;
        /**
         * @language en_US
         * Whether or not the bitmap is smoothed when scaled.
         * @default true。
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 控制在缩放时是否对位图进行平滑处理。
         * @default true。
         * @version Egret 2.4
         * @platform Web
         */
        public get smoothing():boolean {
            return this.$smoothing;
        }

        public set smoothing(value:boolean) {
            value = !!value;
            if (value == this.$smoothing) {
                return;
            }
            this.$smoothing = value;
            this.$invalidate();
        }

        /**
         * @private
         *
         * @param value
         */
        $setWidth(value:number):boolean {
            //value = +value || 0;
            var values = this.$Bitmap;
            if (value < 0 || value == values[sys.BitmapKeys.explicitBitmapWidth]) {
                return false;
            }
            values[sys.BitmapKeys.explicitBitmapWidth] = value;

            this.$invalidateContentBounds();

            return true;
        }

        /**
         * @private
         *
         * @param value
         */
        $setHeight(value:number):boolean {
            //value = +value || 0;
            var values = this.$Bitmap;
            if (value < 0 || value == values[sys.BitmapKeys.explicitBitmapHeight]) {
                return false;
            }
            values[sys.BitmapKeys.explicitBitmapHeight] = value;

            this.$invalidateContentBounds();

            return true;
        }

        /**
         * @private
         * 获取显示宽度
         */
        $getWidth():number {
            var values = this.$Bitmap;
            return isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? this.$getContentBounds().width : values[sys.BitmapKeys.explicitBitmapWidth];
        }

        /**
         * @private
         * 获取显示宽度
         */
        $getHeight():number {
            var values = this.$Bitmap;
            return isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? this.$getContentBounds().height : values[sys.BitmapKeys.explicitBitmapHeight];
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            var values = this.$Bitmap;
            var x:number = values[sys.BitmapKeys.offsetX];
            var y:number = values[sys.BitmapKeys.offsetY];
            if (values[sys.BitmapKeys.image]) {
                var values = this.$Bitmap;
                var w:number = !isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? values[sys.BitmapKeys.explicitBitmapWidth] : x + values[sys.BitmapKeys.clipWidth];
                var h:number = !isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? values[sys.BitmapKeys.explicitBitmapHeight] : y + values[sys.BitmapKeys.clipHeight];
                bounds.setTo(0, 0, w, h);
            }
            else {
                w = !isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? values[sys.BitmapKeys.explicitBitmapWidth] : 0;
                h = !isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? values[sys.BitmapKeys.explicitBitmapHeight] : 0;

                bounds.setTo(0, 0, w, h);
            }
        }

        /**
         * @private
         */
        $render(context:sys.RenderContext):void {
            var values = this.$Bitmap;
            if (values[sys.BitmapKeys.image]) {
                var destW:number = !isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? values[sys.BitmapKeys.explicitBitmapWidth] : values[sys.BitmapKeys.width];
                var destH:number = !isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? values[sys.BitmapKeys.explicitBitmapHeight] : values[sys.BitmapKeys.height];

                Bitmap.$drawImage(context, values[sys.BitmapKeys.image],
                    values[sys.BitmapKeys.clipX], values[sys.BitmapKeys.clipY], values[sys.BitmapKeys.clipWidth], values[sys.BitmapKeys.clipHeight],
                    values[sys.BitmapKeys.offsetX], values[sys.BitmapKeys.offsetY], values[sys.BitmapKeys.width], values[sys.BitmapKeys.height],
                    destW, destH, this.scale9Grid || values[sys.BitmapKeys.bitmapData]["scale9Grid"], this.fillMode, this.$smoothing);
            }
        }

        private _pixelHitTest:boolean = false;
        /**
         * @language en_US
         * Specifies whether this object use precise hit testing by checking the alpha value of each pixel.If pixelHitTest
         * is set to true,the transparent area of the bitmap will be touched through.<br/>
         * Note:If the image is loaded from cross origin,that we can't access to the pixel data,so it might cause
         * the pixelHitTest property invalid.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否开启精确像素碰撞。设置为true显示对象本身的透明区域将能够被穿透。<br/>
         * 注意：若图片资源是以跨域方式从外部服务器加载的，将无法访问图片的像素数据，而导致此属性失效。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get pixelHitTest():boolean {
            return this._pixelHitTest;
        }

        public set pixelHitTest(value:boolean) {
            this._pixelHitTest = !!value;
        }

        $hitTest(stageX:number, stageY:number):DisplayObject {
            var target = super.$hitTest(stageX, stageY);
            if (target && this._pixelHitTest) {
                target = this.hitTestPixel(stageX, stageY);
            }
            return target;
        }

        /**
         * @private
         */
        private hitTestPixel(stageX:number, stageY:number):DisplayObject {
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var context:sys.RenderContext;
            var data:Uint8Array;
            var displayList = this.$displayList;
            if (displayList) {
                context = displayList.renderContext;
                data = context.getImageData(localX - displayList.offsetX, localY - displayList.offsetY, 1, 1).data;
            }
            else {
                context = sys.sharedRenderContext;
                context.surface.width = context.surface.height = 3;
                context.translate(1 - localX, 1 - localY);
                this.$render(context);
                data = context.getImageData(1, 1, 1, 1).data;
            }
            if (data[3] === 0) {
                return null;
            }
            return this;
        }

        /**
         * @private
         *
         * @param context
         * @param texture
         * @param destW
         * @param destH
         * @param scale9Grid
         * @param fillMode
         * @param smoothing
         */
        static $drawImage(context:sys.RenderContext, image:any,
                          clipX:number, clipY:number, clipWidth:number, clipHeight:number, offsetX:number, offsetY:number, textureWidth:number, textureHeight:number,
                          destW:number, destH:number, scale9Grid:egret.Rectangle, fillMode:string, smoothing:boolean):void {
            if (!image) {
                return;
            }
            context.imageSmoothingEnabled = smoothing;

            if (scale9Grid) {
                Bitmap.$drawScale9GridImage(context, image, scale9Grid,
                    clipX, clipY, clipWidth,
                    clipHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH);
            }
            else if (fillMode == egret.BitmapFillMode.SCALE) {
                var tsX:number = destW / textureWidth;
                var tsY:number = destH / textureHeight;
                context.drawImage(image, clipX, clipY,
                    clipWidth, clipHeight, offsetX * tsX, offsetY * tsY, tsX * clipWidth, tsY * clipHeight);
            }
            else if (fillMode == egret.BitmapFillMode.CLIP) {
                var tempW:number = Math.min(textureWidth, destW);
                var tempH:number = Math.min(textureHeight, destH);
                context.drawImage(image, clipX, clipY,
                    tempW / $TextureScaleFactor, tempH / $TextureScaleFactor, offsetX, offsetY, tempW, tempH);
            }
            else {
                var tempImage:egret.BitmapData = image;
                var tempCanvas;
                if (tempImage.width != clipWidth || tempImage.height != clipHeight || egret.$TextureScaleFactor != 1) {
                    tempCanvas = egret.sys.surfaceFactory.create(true);
                    tempCanvas.width = textureWidth;
                    tempCanvas.height = textureHeight;
                    tempCanvas.renderContext.drawImage(tempImage, clipX, clipY, clipWidth, clipHeight, offsetX, offsetY, clipWidth * $TextureScaleFactor, clipHeight * $TextureScaleFactor);
                    tempImage = tempCanvas;
                }

                var pattern = context.createPattern(tempImage, "repeat");
                context.beginPath();
                context.rect(0, 0, destW, destH);
                context.fillStyle = pattern;
                context.fill();

                if (tempCanvas) {
                    egret.sys.surfaceFactory.release(tempCanvas);
                }
            }
        }

        /**
         * @private
         * 绘制九宫格位图
         */
        private static $drawScale9GridImage(context:egret.sys.RenderContext, image:any,
                                            scale9Grid:egret.Rectangle, clipX:number, clipY:number, clipWidth:number, clipHeight:number, offsetX:number, offsetY:number, textureWidth:number, textureHeight:number, surfaceWidth:number, surfaceHeight:number):void {
            var imageWidth:number = clipWidth;
            var imageHeight:number = clipHeight;

            surfaceWidth = surfaceWidth - (textureWidth - clipWidth * $TextureScaleFactor);
            surfaceHeight = surfaceHeight - (textureHeight - clipHeight * $TextureScaleFactor);


            var targetW0 = scale9Grid.x - offsetX;
            var targetH0 = scale9Grid.y - offsetY;

            var sourceW0 = targetW0 / $TextureScaleFactor;
            var sourceH0 = targetH0 / $TextureScaleFactor;
            var sourceW1 = scale9Grid.width / $TextureScaleFactor;
            var sourceH1 = scale9Grid.height / $TextureScaleFactor;


            //防止空心的情况出现。
            if (sourceH1 == 0) {
                sourceH1 = 1;
                if (sourceH0 >= imageHeight) {
                    sourceH0--;
                }
            }
            if (sourceW1 == 0) {
                sourceW1 = 1;
                if (sourceW0 >= imageWidth) {
                    sourceW0--;
                }
            }
            var sourceX0 = clipX;
            var sourceX1 = sourceX0 + sourceW0;
            var sourceX2 = sourceX1 + sourceW1;
            var sourceW2 = imageWidth - sourceW0 - sourceW1;

            var sourceY0 = clipY;
            var sourceY1 = sourceY0 + sourceH0;
            var sourceY2 = sourceY1 + sourceH1;
            var sourceH2 = imageHeight - sourceH0 - sourceH1;

            var targetW2 = sourceW2 * $TextureScaleFactor;
            var targetH2 = sourceH2 * $TextureScaleFactor;

            if ((sourceW0 + sourceW2) * $TextureScaleFactor > surfaceWidth || (sourceH0 + sourceH2) * $TextureScaleFactor > surfaceHeight) {
                context.drawImage(image, clipX, clipY, clipWidth, clipHeight, offsetX, offsetY, surfaceWidth, surfaceHeight);
                return;
            }

            var targetX0 = offsetX;
            var targetX1 = targetX0 + targetW0;
            var targetX2 = targetX0 + (surfaceWidth - targetW2);
            var targetW1 = surfaceWidth - targetW0 - targetW2;

            var targetY0 = offsetY;
            var targetY1 = targetY0 + targetH0;
            var targetY2 = targetY0 + surfaceHeight - targetH2;
            var targetH1 = surfaceHeight - targetH0 - targetH2;

            //
            //             x0     x1     x2
            //          y0 +------+------+------+
            //             |      |      |      | h0
            //             |      |      |      |
            //          y1 +------+------+------+
            //             |      |      |      | h1
            //             |      |      |      |
            //          y2 +------+------+------+
            //             |      |      |      | h2
            //             |      |      |      |
            //             +------+------+------+
            //                w0     w1     w2
            //
            if (sourceH0 <= 0 || sourceH1 <= 0 || sourceH2 <= 0 || sourceW0 <= 0 || sourceW1 <= 0 || sourceW2 <= 0 || (sourceW0 + sourceW1 + sourceW2) > imageWidth || (sourceH0 + sourceH1 + sourceH2) > imageHeight) {
                if (DEBUG)$warn(1018);
                return;
            }
            context.drawImage(image, sourceX0, sourceY0, sourceW0, sourceH0, targetX0, targetY0, targetW0, targetH0);
            context.drawImage(image, sourceX1, sourceY0, sourceW1, sourceH0, targetX1, targetY0, targetW1, targetH0);
            context.drawImage(image, sourceX2, sourceY0, sourceW2, sourceH0, targetX2, targetY0, targetW2, targetH0);
            context.drawImage(image, sourceX0, sourceY1, sourceW0, sourceH1, targetX0, targetY1, targetW0, targetH1);
            context.drawImage(image, sourceX1, sourceY1, sourceW1, sourceH1, targetX1, targetY1, targetW1, targetH1);
            context.drawImage(image, sourceX2, sourceY1, sourceW2, sourceH1, targetX2, targetY1, targetW2, targetH1);
            context.drawImage(image, sourceX0, sourceY2, sourceW0, sourceH2, targetX0, targetY2, targetW0, targetH2);
            context.drawImage(image, sourceX1, sourceY2, sourceW1, sourceH2, targetX1, targetY2, targetW1, targetH2);
            context.drawImage(image, sourceX2, sourceY2, sourceW2, sourceH2, targetX2, targetY2, targetW2, targetH2);
        }
    }
}
