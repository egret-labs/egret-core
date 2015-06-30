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

module egret {
    /**
     * @private
     */
    const enum Keys {
        explicitBitmapWidth,
        explicitBitmapHeight,
    }

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
     * @version egret 1.0
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
     * @version egret 1.0
     */
    export class Bitmap extends DisplayObject {

        /**
         * @language en_US
         * Initializes a Bitmap object to refer to the specified BitmapData object.
         * @param bitmapData The BitmapData object being referenced.
         * @version egret 1.0
         */
        /**
         * @language zh_CN
         * 创建一个引用指定 BitmapData 实例的 Bitmap 对象
         * @param bitmapData 被引用的 BitmapData 实例
         * @version egret 1.0
         */
        public constructor(bitmapData?:Texture) {
            super();
            this.$renderRegion = new sys.Region();
            this.$Bitmap = {
                0: NONE, //explicitBitmapWidth,
                1: NONE  //explicitBitmapHeight,
            };

            this.texture = bitmapData;
        }

        $Bitmap:Object;

        /**
         * @private
         */
        $bitmapData:Texture;

        /**
         * @language en_US
         * bitmapData The Texture object being referenced.
         * @version egret 1.0
         */
        /**
         * @language zh_CN
         * 被引用的 Texture 对象。
         * @version egret 1.0
         */
        public get texture():Texture {
            return this.$bitmapData;
        }

        public set texture(value:Texture) {
            this.$setBitmapData(value);
        }

        /**
         * @private
         */
        private _scale9Grid:egret.Rectangle = null;

        /**
         * @language en_US
         * Represent a Rectangle Area that the 9 scale area of Image.
         * Notice: This property is valid only when <code>fillMode</code>
         * is <code>BitmapFillMode.SCALE</code>.
         *
         */
        /**
         * @language zh_CN
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
         *
         */
        public get scale9Grid():egret.Rectangle {
            return this._scale9Grid;
        }

        public set scale9Grid(value:egret.Rectangle) {
            this._scale9Grid = value;
            this.$invalidateContentBounds();
        }


        /**
         * @language en_USDetermine the bitmap fill mode for size.
         * When BitmapFillMode.REPEAT is set, area is filled in repeat mode; when BitmapFillMode.SCALE is set, area is filled in scale mode.
         * @default egret.BitmapFillMode.SCALE
         */
        /**
         * @language zh_CN
         * 确定位图填充尺寸的方式。
         * 设置为 BitmapFillMode.REPEAT时，位图将重复以填充区域；BitmapFillMode.SCALE时，位图将拉伸以填充区域。
         * @default egret.BitmapFillMode.SCALE
         */
        public fillMode:string = "scale";

        /**
         * @private
         */
        $setBitmapData(value:Texture):void {
            if (value == this.$bitmapData) {
                return;
            }
            this.$bitmapData = value;
            this.$invalidateContentBounds();
        }

        /**
         * @private
         */
        $smoothing:boolean = true;
        /**
         * @language en_US
         * Whether or not the bitmap is smoothed when scaled.
         * @default true。
         * @version egret 1.0
         */
        /**
         * @language zh_CN
         * 控制在缩放时是否对位图进行平滑处理。
         * @default true。
         * @version egret 1.0
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

        $setWidth(value:number):void {
            //value = +value || 0;
            var values = this.$Bitmap;
            if (value < 0 || value == values[Keys.explicitBitmapWidth]) {
                return;
            }
            values[Keys.explicitBitmapWidth] = value;
            this.$invalidateContentBounds();
        }

        $setHeight(value:number):void {
            //value = +value || 0;
            var values = this.$Bitmap;
            if (value < 0 || value == values[Keys.explicitBitmapHeight]) {
                return;
            }
            values[Keys.explicitBitmapHeight] = value;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            var bitmapData = this.$bitmapData;
            if (bitmapData) {
                var w:number = !isNone(this.$Bitmap[Keys.explicitBitmapWidth]) ? this.$Bitmap[Keys.explicitBitmapWidth] : (bitmapData._bitmapWidth || bitmapData._textureWidth);
                var h:number = !isNone(this.$Bitmap[Keys.explicitBitmapHeight]) ? this.$Bitmap[Keys.explicitBitmapHeight] : (bitmapData._bitmapHeight || bitmapData._textureHeight);
                bounds.setTo(0, 0, w, h);
            }
            else {
                bounds.setEmpty();
            }
        }

        /**
         * @private
         */
        $render(context:sys.RenderContext):void {
            var bitmapData = this.$bitmapData;
            if (bitmapData) {
                context.imageSmoothingEnabled = this.$smoothing;

                var offsetX:number = Math.round(bitmapData._offsetX);
                var offsetY:number = Math.round(bitmapData._offsetY);
                var bitmapWidth:number = bitmapData._bitmapWidth || bitmapData._textureWidth;
                var bitmapHeight:number = bitmapData._bitmapHeight || bitmapData._textureHeight;

                var destW:number = !isNone(this.$Bitmap[Keys.explicitBitmapWidth]) ? this.$Bitmap[Keys.explicitBitmapWidth] : (bitmapData._bitmapWidth || bitmapData._textureWidth);
                var destH:number = !isNone(this.$Bitmap[Keys.explicitBitmapHeight]) ? this.$Bitmap[Keys.explicitBitmapHeight] : (bitmapData._bitmapHeight || bitmapData._textureHeight);

                if (this.scale9Grid) {
                    Bitmap.$drawScale9GridImage(context, bitmapData, this.scale9Grid, destW, destH);
                }
                else if (this.fillMode == egret.BitmapFillMode.SCALE) {
                    context.drawImage(bitmapData._bitmapData, bitmapData._bitmapX, bitmapData._bitmapY,
                        bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
                }
                else {

                    var pattern = context.createPattern(bitmapData._bitmapData, "repeat");
                    context.beginPath();
                    context.rect(0, 0, destW, destH);
                    context.fillStyle = pattern;
                    context.fill();
                }
            }
        }

        /**
         * @private
         * 绘制九宫格位图
         */
        static $drawScale9GridImage(context:egret.sys.RenderContext, texture:egret.Texture,
                                    scale9Grid:egret.Rectangle, surfaceWidth?:number, surfaceHeight?:number):void {
            var image:egret.BitmapData = texture._bitmapData
            var imageWidth:number = texture._bitmapWidth || texture._textureWidth;
            var imageHeight:number = texture._bitmapHeight || texture._textureHeight;

            var sourceW0 = scale9Grid.x;
            var sourceH0 = scale9Grid.y;
            var sourceW1 = scale9Grid.width;
            var sourceH1 = scale9Grid.height;

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
            var sourceX0 = texture._bitmapX;
            var sourceX1 = sourceX0 + sourceW0;
            var sourceX2 = sourceX1 + sourceW1;
            var sourceW2 = imageWidth - sourceW0 - sourceW1;

            var sourceY0 = texture._bitmapY;
            var sourceY1 = sourceY0 + sourceH0;
            var sourceY2 = sourceY1 + sourceH1;
            var sourceH2 = imageHeight - sourceH0 - sourceH1;

            if (sourceW0 + sourceW2 > surfaceWidth || sourceH0 + sourceH2 > surfaceHeight) {
                context.drawImage(image, 0, 0, surfaceWidth, surfaceHeight);
                return;
            }

            var targetX0 = 0;
            var targetX1 = targetX0 + sourceW0;
            var targetX2 = targetX0 + surfaceWidth - sourceW2;
            var targetW1 = surfaceWidth - sourceW0 - sourceW2;

            var targetY0 = 0;
            var targetY1 = targetY0 + sourceH0;
            var targetY2 = targetY0 + surfaceHeight - sourceH2;
            var targetH1 = surfaceHeight - sourceH0 - sourceH2;

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

            context.drawImage(image, sourceX0, sourceY0, sourceW0, sourceH0, targetX0, targetY0, sourceW0, sourceH0);
            context.drawImage(image, sourceX1, sourceY0, sourceW1, sourceH0, targetX1, targetY0, targetW1, sourceH0);
            context.drawImage(image, sourceX2, sourceY0, sourceW2, sourceH0, targetX2, targetY0, sourceW2, sourceH0);
            context.drawImage(image, sourceX0, sourceY1, sourceW0, sourceH1, targetX0, targetY1, sourceW0, targetH1);
            context.drawImage(image, sourceX1, sourceY1, sourceW1, sourceH1, targetX1, targetY1, targetW1, targetH1);
            context.drawImage(image, sourceX2, sourceY1, sourceW2, sourceH1, targetX2, targetY1, sourceW2, targetH1);
            context.drawImage(image, sourceX0, sourceY2, sourceW0, sourceH2, targetX0, targetY2, sourceW0, sourceH2);
            context.drawImage(image, sourceX1, sourceY2, sourceW1, sourceH2, targetX1, targetY2, targetW1, sourceH2);
            context.drawImage(image, sourceX2, sourceY2, sourceW2, sourceH2, targetX2, targetY2, sourceW2, sourceH2);
        }
    }

    registerClass(Bitmap, Types.Bitmap);
}