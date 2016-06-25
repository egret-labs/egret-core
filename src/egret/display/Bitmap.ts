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
        bitmapX,
        bitmapY,
        bitmapWidth,
        bitmapHeight,
        offsetX,
        offsetY,
        textureWidth,
        textureHeight,
        smoothing,
        explicitBitmapWidth,
        explicitBitmapHeight,
        sourceWidth,
        sourceHeight
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
            this.$renderNode = new sys.BitmapNode();
            this.$Bitmap = {
                0: null,     // bitmapData,
                1: null,     // image,
                2: 0,        // bitmapX,
                3: 0,        // bitmapY,
                4: 0,        // bitmapWidth,
                5: 0,        // bitmapHeight,
                6: 0,        // offsetX,
                7: 0,        // offsetY,
                8: 0,        // textureWidth,
                9: 0,        // textureHeight
                10: Bitmap.defaultSmoothing,    // smoothing
                11: NaN,     //explicitBitmapWidth,
                12: NaN      //explicitBitmapHeight,
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
                Texture.$addDisplayObject(this, bitmapData);
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
                Texture.$removeDisplayObject(this, bitmapData);
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
            var oldBitmapData = values[sys.BitmapKeys.bitmapData];
            if (value == oldBitmapData) {
                return false;
            }
            values[sys.BitmapKeys.bitmapData] = value;
            if (value) {
                this.$refreshImageData();
            }
            else {
                this.setImageData(null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                this.$invalidateContentBounds();
                return true;
            }

            if (this.$stage) {
                if (oldBitmapData) {
                    var oldHashCode:number;
                    if((<Texture>oldBitmapData)._bitmapData && (<Texture>oldBitmapData)._bitmapData.hashCode) {
                        oldHashCode = (<Texture>oldBitmapData)._bitmapData.hashCode;
                    }
                    else {
                        oldHashCode = oldBitmapData.hashCode;
                    }
                    var newHashCode:number;
                    if((<Texture>value)._bitmapData && (<Texture>value)._bitmapData.hashCode) {
                        newHashCode = (<Texture>value)._bitmapData.hashCode;
                    }
                    else {
                        newHashCode = value.hashCode;
                    }
                    if(oldHashCode == newHashCode) {
                        this.$invalidateContentBounds();
                        return true;
                    }
                    Texture.$removeDisplayObject(this, oldBitmapData);
                }
                Texture.$addDisplayObject(this, value);
            }

            this.$invalidateContentBounds();
            return true;
        }

        /**
         * @private
         */
        public $refreshImageData():void {
            var values = this.$Bitmap;
            var bitmapData = values[sys.BitmapKeys.bitmapData];
            if (bitmapData) {
                if (bitmapData instanceof Texture) {
                    var texture = <Texture>bitmapData;
                    this.setImageData(texture._bitmapData,
                        texture._bitmapX, texture._bitmapY,
                        texture._bitmapWidth, texture._bitmapHeight,
                        texture._offsetX, texture._offsetY,
                        texture.$getTextureWidth(), texture.$getTextureHeight(),
                        texture._sourceWidth, texture._sourceHeight);
                }
                else {
                    var width = (<BitmapData>bitmapData).width;
                    var height = (<BitmapData>bitmapData).height;
                    this.setImageData(<BitmapData>bitmapData, 0, 0, width, height, 0, 0, width, height, width, height);
                }
            }
        }

        /**
         * @private
         */
        private setImageData(image:BitmapData, bitmapX:number, bitmapY:number, bitmapWidth:number, bitmapHeight:number,
                             offsetX:number, offsetY:number, textureWidth:number, textureHeight:number, sourceWidth:number, sourceHeight:number):void {
            var values = this.$Bitmap;
            values[sys.BitmapKeys.image] = image;
            values[sys.BitmapKeys.bitmapX] = bitmapX;
            values[sys.BitmapKeys.bitmapY] = bitmapY;
            values[sys.BitmapKeys.bitmapWidth] = bitmapWidth;
            values[sys.BitmapKeys.bitmapHeight] = bitmapHeight;
            values[sys.BitmapKeys.offsetX] = offsetX;
            values[sys.BitmapKeys.offsetY] = offsetY;
            values[sys.BitmapKeys.textureWidth] = textureWidth;
            values[sys.BitmapKeys.textureHeight] = textureHeight;
            values[sys.BitmapKeys.sourceWidth] = sourceWidth;
            values[sys.BitmapKeys.sourceHeight] = sourceHeight;
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
         * @language en_US
         * The default value of whether or not is smoothed when scaled.
         * When object such as Bitmap is created,smoothing property will be set to this value.
         * @default true。
         * @version Egret 3.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 控制在缩放时是否进行平滑处理的默认值。
         * 在 Bitmap 等对象创建时,smoothing 属性会被设置为该值。
         * @default true。
         * @version Egret 3.0
         * @platform Web
         */
        public static defaultSmoothing:boolean = true;

        /**
         * @language en_US
         * Whether or not the bitmap is smoothed when scaled.
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 控制在缩放时是否对位图进行平滑处理。
         * @version Egret 2.4
         * @platform Web
         */
        public get smoothing():boolean {
            var values = this.$Bitmap;
            return values[sys.BitmapKeys.smoothing];
        }

        public set smoothing(value:boolean) {
            value = !!value;
            var values = this.$Bitmap;
            if (value == values[sys.BitmapKeys.smoothing]) {
                return;
            }
            values[sys.BitmapKeys.smoothing] = value;
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
            if (values[sys.BitmapKeys.image]) {
                var values = this.$Bitmap;
                var w:number = !isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? values[sys.BitmapKeys.explicitBitmapWidth] : values[sys.BitmapKeys.textureWidth];
                var h:number = !isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? values[sys.BitmapKeys.explicitBitmapHeight] : values[sys.BitmapKeys.textureHeight];
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
        $render():void {
            var values = this.$Bitmap;
            if (values[sys.BitmapKeys.image]) {
                var destW:number = !isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? values[sys.BitmapKeys.explicitBitmapWidth] : values[sys.BitmapKeys.textureWidth];
                var destH:number = !isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? values[sys.BitmapKeys.explicitBitmapHeight] : values[sys.BitmapKeys.textureHeight];

                Bitmap.$drawImage(<sys.BitmapNode>this.$renderNode, values[sys.BitmapKeys.image],
                    values[sys.BitmapKeys.bitmapX], values[sys.BitmapKeys.bitmapY], values[sys.BitmapKeys.bitmapWidth], values[sys.BitmapKeys.bitmapHeight],
                    values[sys.BitmapKeys.offsetX], values[sys.BitmapKeys.offsetY], values[sys.BitmapKeys.textureWidth], values[sys.BitmapKeys.textureHeight],
                    destW, destH, values[sys.BitmapKeys.sourceWidth], values[sys.BitmapKeys.sourceHeight], this.scale9Grid || values[sys.BitmapKeys.bitmapData]["scale9Grid"], this.fillMode, values[sys.BitmapKeys.smoothing]);
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
            var data:number[];
            var displayList = this.$displayList;
            if (displayList) {
                var buffer = displayList.renderBuffer;
                try {
                    data = buffer.getPixel(localX - displayList.offsetX, localY - displayList.offsetY);
                }
                catch (e) {
                    console.log(this.$Bitmap[sys.BitmapKeys.bitmapData]);
                    throw new Error(sys.tr(1039));
                }
            }
            else {
                var buffer = sys.hitTestBuffer;
                buffer.resize(3, 3);
                var node = this.$getRenderNode();
                var matrix = Matrix.create();
                matrix.identity();
                matrix.translate(1 - localX, 1 - localY);
                sys.systemRenderer.drawNodeToBuffer(node, buffer, matrix, true);
                Matrix.release(matrix);

                try {
                    data = buffer.getPixel(1, 1);
                }
                catch (e) {
                    console.log(this.$Bitmap[sys.BitmapKeys.bitmapData]);
                    throw new Error(sys.tr(1039));
                }
            }
            if (data[3] === 0) {
                return null;
            }
            return this;
        }

        /**
         * @private
         */
        static $drawImage(node:sys.BitmapNode, image:any,
                          bitmapX:number, bitmapY:number, bitmapWidth:number, bitmapHeight:number, offsetX:number, offsetY:number,
                          textureWidth:number, textureHeight:number, destW:number, destH:number, sourceWidth:number, sourceHeight:number,
                          scale9Grid:egret.Rectangle, fillMode:string, smoothing:boolean):void {
            if (!image) {
                return;
            }
            var scale = $TextureScaleFactor;
            node.smoothing = smoothing;
            node.image = image;
            node.imageWidth = sourceWidth;
            node.imageHeight = sourceHeight;
            if (scale9Grid) {
                Bitmap.drawScale9GridImage(node, scale9Grid,
                    bitmapX, bitmapY, bitmapWidth,
                    bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH);
            }
            else if (fillMode == egret.BitmapFillMode.SCALE) {
                var tsX:number = destW / textureWidth;
                var tsY:number = destH / textureHeight;
                node.drawImage(bitmapX, bitmapY,
                    bitmapWidth, bitmapHeight, offsetX * tsX, offsetY * tsY, tsX * bitmapWidth, tsY * bitmapHeight);
            }
            else if (fillMode == egret.BitmapFillMode.CLIP) {
                var displayW:number = Math.min(textureWidth, destW);
                var displayH:number = Math.min(textureHeight, destH);
                var scaledBitmapW = bitmapWidth * scale;
                var scaledBitmapH = bitmapHeight * scale;
                drawClipImage(node, scale, bitmapX, bitmapY, scaledBitmapW, scaledBitmapH,
                    offsetX, offsetY, displayW, displayH);
            }
            else {
                var scaledBitmapW = bitmapWidth * scale;
                var scaledBitmapH = bitmapHeight * scale;
                for (var startX = 0; startX < destW; startX += textureWidth) {
                    for (var startY = 0; startY < destH; startY += textureHeight) {
                        var displayW = Math.min(destW - startX, textureWidth);
                        var displayH = Math.min(destH - startY, textureHeight);
                        drawClipImage(node, scale, bitmapX, bitmapY, scaledBitmapW, scaledBitmapH,
                            offsetX, offsetY, displayW, displayH, startX, startY);
                    }
                }

            }
        }


        /**
         * @private
         * 绘制九宫格位图
         */
        private static drawScale9GridImage(node:sys.BitmapNode, scale9Grid:egret.Rectangle, bitmapX:number, bitmapY:number,
                                           bitmapWidth:number, bitmapHeight:number, offsetX:number, offsetY:number,
                                           textureWidth:number, textureHeight:number, destW:number, destH:number):void {
            var imageWidth:number = bitmapWidth;
            var imageHeight:number = bitmapHeight;

            destW = destW - (textureWidth - bitmapWidth * $TextureScaleFactor);
            destH = destH - (textureHeight - bitmapHeight * $TextureScaleFactor);


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
            var sourceX0 = bitmapX;
            var sourceX1 = sourceX0 + sourceW0;
            var sourceX2 = sourceX1 + sourceW1;
            var sourceW2 = imageWidth - sourceW0 - sourceW1;

            var sourceY0 = bitmapY;
            var sourceY1 = sourceY0 + sourceH0;
            var sourceY2 = sourceY1 + sourceH1;
            var sourceH2 = imageHeight - sourceH0 - sourceH1;

            var targetW2 = sourceW2 * $TextureScaleFactor;
            var targetH2 = sourceH2 * $TextureScaleFactor;

            if ((sourceW0 + sourceW2) * $TextureScaleFactor > destW || (sourceH0 + sourceH2) * $TextureScaleFactor > destH) {
                node.drawImage(bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
                return;
            }

            var targetX0 = offsetX;
            var targetX1 = targetX0 + targetW0;
            var targetX2 = targetX0 + (destW - targetW2);
            var targetW1 = destW - targetW0 - targetW2;

            var targetY0 = offsetY;
            var targetY1 = targetY0 + targetH0;
            var targetY2 = targetY0 + destH - targetH2;
            var targetH1 = destH - targetH0 - targetH2;

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
            if (sourceH0 > 0) { 
                if (sourceW0 > 0) node.drawImage(sourceX0, sourceY0, sourceW0, sourceH0, targetX0, targetY0, targetW0, targetH0);
                if (sourceW1 > 0) node.drawImage(sourceX1, sourceY0, sourceW1, sourceH0, targetX1, targetY0, targetW1, targetH0);
                if (sourceW2 > 0) node.drawImage(sourceX2, sourceY0, sourceW2, sourceH0, targetX2, targetY0, targetW2, targetH0);
            }
            if (sourceH1 > 0) {
                if (sourceW0 > 0) node.drawImage(sourceX0, sourceY1, sourceW0, sourceH1, targetX0, targetY1, targetW0, targetH1);
                if (sourceW1 > 0) node.drawImage(sourceX1, sourceY1, sourceW1, sourceH1, targetX1, targetY1, targetW1, targetH1);
                if (sourceW2 > 0) node.drawImage(sourceX2, sourceY1, sourceW2, sourceH1, targetX2, targetY1, targetW2, targetH1);
            }
            if (sourceH2 > 0) {
                if (sourceW0 > 0) node.drawImage(sourceX0, sourceY2, sourceW0, sourceH2, targetX0, targetY2, targetW0, targetH2);
                if (sourceW1 > 0) node.drawImage(sourceX1, sourceY2, sourceW1, sourceH2, targetX1, targetY2, targetW1, targetH2);
                if (sourceW2 > 0) node.drawImage(sourceX2, sourceY2, sourceW2, sourceH2, targetX2, targetY2, targetW2, targetH2);
            }
        }
    }

    /**
     * @private
     */
    function drawClipImage(node:sys.BitmapNode, scale:number, bitmapX:number, bitmapY:number, scaledBitmapW:number,
                           scaledBitmapH:number, offsetX:number, offsetY:number, destW:number, destH:number,
                           startX:number = 0, startY:number = 0):void {
        var offset = offsetX + scaledBitmapW - destW;
        if (offset > 0) {
            scaledBitmapW -= offset;
        }
        offset = offsetY + scaledBitmapH - destH;
        if (offset > 0) {
            scaledBitmapH -= offset;
        }
        node.drawImage(bitmapX, bitmapY,
            scaledBitmapW / scale, scaledBitmapH / scale, startX + offsetX, startY + offsetY, scaledBitmapW, scaledBitmapH);
    }

}
