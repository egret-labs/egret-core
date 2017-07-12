//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

namespace egret.sys {
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

namespace egret {

    /**
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
     * @language en_US
     */
    /**
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
     * @language zh_CN
     */
    export class Bitmap extends DisplayObject {

        /**
         * Initializes a Bitmap object to refer to the specified BitmapData|Texture object.
         * @param value The BitmapData|Texture object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个引用指定 BitmapData|Texture 实例的 Bitmap 对象
         * @param value 被引用的 BitmapData|Texture 实例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor(value?: BitmapData | Texture) {
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
                12: NaN,     //explicitBitmapHeight,
                13: NaN,     //sourceWidth,
                14: NaN,     //sourceHeight
            };

            this.$setBitmapData(value);
            if(value instanceof Texture) {
                (<sys.BitmapNode>this.$renderNode).rotated = value.$rotated;
            }
        }

        /**
         * @private
         */
        $Bitmap: Object;

        /**
         * @private
         * 显示对象添加到舞台
         */
        $onAddToStage(stage: Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);

            let bitmapData = this.$Bitmap[sys.BitmapKeys.bitmapData];
            if (bitmapData) {
                BitmapData.$addDisplayObject(this, bitmapData);
            }
        }

        /**
         * @private
         * 显示对象从舞台移除
         */
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();

            let bitmapData = this.$Bitmap[sys.BitmapKeys.bitmapData];
            if (bitmapData) {
                BitmapData.$removeDisplayObject(this, bitmapData);
            }
        }

        /**
         * The BitmapData object being referenced.
         * If you pass the constructor of type Texture or last set for texture, this value returns null.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 被引用的 BitmapData 对象。
         * 如果传入构造函数的类型为 Texture 或者最后设置的为 texture，则此值返回 null。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get bitmapData(): BitmapData {
            let value = this.$Bitmap[sys.BitmapKeys.bitmapData];
            if (value instanceof Texture) {
                return null;
            }
            else {
                return value;
            }
        }

        public set bitmapData(value: BitmapData) {
            this.$setBitmapData(value);
        }

        /**
         * The Texture object being referenced.
         * If you pass the constructor of type BitmapData or last set for bitmapData, this value returns null.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 被引用的 Texture 对象。
         * 如果传入构造函数的类型为 BitmapData 或者最后设置的为 bitmapData，则此值返回 null。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get texture(): Texture {
            let value = this.$Bitmap[sys.BitmapKeys.bitmapData];
            if (value instanceof Texture) {
                return value;
            }
            else {
                return null;
            }
        }

        public set texture(value: Texture) {
            let self = this;
            self.$setBitmapData(value);
            if(value && self.$renderNode) {
                (<sys.BitmapNode>self.$renderNode).rotated = value.$rotated;
            }
        }

        /**
         * @private
         */
        $setBitmapData(value: BitmapData | Texture): boolean {
            let values = this.$Bitmap;
            let oldBitmapData = values[sys.BitmapKeys.bitmapData];
            if (value == oldBitmapData) {
                return false;
            }
            values[sys.BitmapKeys.bitmapData] = value;
            if (value) {
                this.$refreshImageData();
            }
            else {
                if (oldBitmapData) {
                    BitmapData.$removeDisplayObject(this, oldBitmapData);
                }
                this.setImageData(null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                this.$invalidateContentBounds();
                return true;
            }

            if (this.$stage) {
                if (oldBitmapData) {
                    let oldHashCode: number;
                    if ((<Texture>oldBitmapData)._bitmapData && (<Texture>oldBitmapData)._bitmapData.hashCode) {
                        oldHashCode = (<Texture>oldBitmapData)._bitmapData.hashCode;
                    }
                    else {
                        oldHashCode = oldBitmapData.hashCode;
                    }
                    let newHashCode: number;
                    if ((<Texture>value)._bitmapData && (<Texture>value)._bitmapData.hashCode) {
                        newHashCode = (<Texture>value)._bitmapData.hashCode;
                    }
                    else {
                        newHashCode = value.hashCode;
                    }
                    if (oldHashCode == newHashCode) {
                        this.$invalidateContentBounds();
                        return true;
                    }
                    BitmapData.$removeDisplayObject(this, oldBitmapData);
                }
                BitmapData.$addDisplayObject(this, value);
            }

            this.$invalidateContentBounds();
            return true;
        }

        /**
         * @private
         */
        public $refreshImageData(): void {
            let values = this.$Bitmap;
            let bitmapData: Texture | BitmapData = values[sys.BitmapKeys.bitmapData];
            if (bitmapData) {
                if (bitmapData instanceof Texture) {
                    this.setImageData(bitmapData._bitmapData,
                        bitmapData._bitmapX, bitmapData._bitmapY,
                        bitmapData._bitmapWidth, bitmapData._bitmapHeight,
                        bitmapData._offsetX, bitmapData._offsetY,
                        bitmapData.$getTextureWidth(), bitmapData.$getTextureHeight(),
                        bitmapData._sourceWidth, bitmapData._sourceHeight);
                }
                else {
                    let width = bitmapData.width;
                    let height = bitmapData.height;
                    this.setImageData(bitmapData, 0, 0, width, height, 0, 0, width, height, width, height);
                }
            }
        }

        /**
         * @private
         */
        private setImageData(image: BitmapData, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number,
            offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, sourceWidth: number, sourceHeight: number): void {
            let values = this.$Bitmap;
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
        $scale9Grid: egret.Rectangle = null;

        /**
         * Represent a Rectangle Area that the 9 scale area of Image.
         * Notice: This property is valid only when <code>fillMode</code>
         * is <code>BitmapFillMode.SCALE</code>.
         *
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
         *
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get scale9Grid(): egret.Rectangle {
            return this.$scale9Grid;
        }

        public set scale9Grid(value: egret.Rectangle) {
            this.$scale9Grid = value;
            this.$invalidateContentBounds();
        }

        /**
         * @private
         */
        $fillMode: string = "scale";
        /**
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
         * @language en_US
         */
        /**
         * 确定位图填充尺寸的方式。
         * <p>设置为 <code>BitmapFillMode.REPEAT</code>时，位图将重复以填充区域。</p>
         * <p>设置为 <code>BitmapFillMode.SCALE</code>时，位图将拉伸以填充区域。</p>
         *
         * @default <code>BitmapFillMode.SCALE</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         * @language zh_CN
         */
        public get fillMode(): string {
            return this.$fillMode;
        }

        public set fillMode(value: string) {
            this.$setFillMode(value);
        }

        $setFillMode(value: string): boolean {
            if (value == this.$fillMode) {
                return false;
            }
            this.$fillMode = value;

            return true;
        }

        /**
         * The default value of whether or not is smoothed when scaled.
         * When object such as Bitmap is created,smoothing property will be set to this value.
         * @default true。
         * @version Egret 3.0
         * @platform Web
         * @language en_US
         */
        /**
         * 控制在缩放时是否进行平滑处理的默认值。
         * 在 Bitmap 等对象创建时,smoothing 属性会被设置为该值。
         * @default true。
         * @version Egret 3.0
         * @platform Web
         * @language zh_CN
         */
        public static defaultSmoothing: boolean = true;

        /**
         * Whether or not the bitmap is smoothed when scaled.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 控制在缩放时是否对位图进行平滑处理。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        public get smoothing(): boolean {
            let values = this.$Bitmap;
            return values[sys.BitmapKeys.smoothing];
        }

        public set smoothing(value: boolean) {
            value = !!value;
            let values = this.$Bitmap;
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
        $setWidth(value: number): boolean {
            //value = +value || 0;
            let values = this.$Bitmap;
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
        $setHeight(value: number): boolean {
            //value = +value || 0;
            let values = this.$Bitmap;
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
        $getWidth(): number {
            let values = this.$Bitmap;
            return isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? this.$getContentBounds().width : values[sys.BitmapKeys.explicitBitmapWidth];
        }

        /**
         * @private
         * 获取显示宽度
         */
        $getHeight(): number {
            let values = this.$Bitmap;
            return isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? this.$getContentBounds().height : values[sys.BitmapKeys.explicitBitmapHeight];
        }

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            let values = this.$Bitmap;
            if (values[sys.BitmapKeys.image]) {
                let values = this.$Bitmap;
                let w: number = !isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? values[sys.BitmapKeys.explicitBitmapWidth] : values[sys.BitmapKeys.textureWidth];
                let h: number = !isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? values[sys.BitmapKeys.explicitBitmapHeight] : values[sys.BitmapKeys.textureHeight];
                bounds.setTo(0, 0, w, h);
            }
            else {
                let w = !isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? values[sys.BitmapKeys.explicitBitmapWidth] : 0;
                let h = !isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? values[sys.BitmapKeys.explicitBitmapHeight] : 0;

                bounds.setTo(0, 0, w, h);
            }
        }

        /**
         * @private
         */
        $render(): void {
            let values = this.$Bitmap;
            if (values[sys.BitmapKeys.image]) {
                let destW: number = !isNaN(values[sys.BitmapKeys.explicitBitmapWidth]) ? values[sys.BitmapKeys.explicitBitmapWidth] : values[sys.BitmapKeys.textureWidth];
                let destH: number = !isNaN(values[sys.BitmapKeys.explicitBitmapHeight]) ? values[sys.BitmapKeys.explicitBitmapHeight] : values[sys.BitmapKeys.textureHeight];

                sys.BitmapNode.$updateTextureData(<sys.BitmapNode>this.$renderNode, values[sys.BitmapKeys.image],
                    values[sys.BitmapKeys.bitmapX], values[sys.BitmapKeys.bitmapY], values[sys.BitmapKeys.bitmapWidth], values[sys.BitmapKeys.bitmapHeight],
                    values[sys.BitmapKeys.offsetX], values[sys.BitmapKeys.offsetY], values[sys.BitmapKeys.textureWidth], values[sys.BitmapKeys.textureHeight],
                    destW, destH, values[sys.BitmapKeys.sourceWidth], values[sys.BitmapKeys.sourceHeight], this.scale9Grid || values[sys.BitmapKeys.bitmapData]["scale9Grid"], this.fillMode, values[sys.BitmapKeys.smoothing]);
            }
        }

        private _pixelHitTest: boolean = false;
        /**
         * Specifies whether this object use precise hit testing by checking the alpha value of each pixel.If pixelHitTest
         * is set to true,the transparent area of the bitmap will be touched through.<br/>
         * Note:If the image is loaded from cross origin,that we can't access to the pixel data,so it might cause
         * the pixelHitTest property invalid.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 是否开启精确像素碰撞。设置为true显示对象本身的透明区域将能够被穿透。<br/>
         * 注意：若图片资源是以跨域方式从外部服务器加载的，将无法访问图片的像素数据，而导致此属性失效。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get pixelHitTest(): boolean {
            return this._pixelHitTest;
        }

        public set pixelHitTest(value: boolean) {
            this._pixelHitTest = !!value;
        }

        $hitTest(stageX: number, stageY: number): DisplayObject {
            let target = super.$hitTest(stageX, stageY);
            if (target && this._pixelHitTest) {
                target = this.hitTestPixel(stageX, stageY);
            }
            return target;
        }

        /**
         * @private
         */
        private hitTestPixel(stageX: number, stageY: number): DisplayObject {
            let m = this.$getInvertedConcatenatedMatrix();
            let localX = m.a * stageX + m.c * stageY + m.tx;
            let localY = m.b * stageX + m.d * stageY + m.ty;
            let data: number[];
            let displayList = this.$displayList;
            if (displayList) {
                let buffer = displayList.renderBuffer;
                try {
                    data = buffer.getPixels(localX - displayList.offsetX, localY - displayList.offsetY);
                }
                catch (e) {
                    console.log(this.$Bitmap[sys.BitmapKeys.bitmapData]);
                    throw new Error(sys.tr(1039));
                }
            }
            else {
                let buffer = sys.customHitTestBuffer;
                buffer.resize(3, 3);
                let node = this.$getRenderNode();
                let matrix = Matrix.create();
                matrix.identity();
                matrix.translate(1 - localX, 1 - localY);
                sys.systemRenderer.drawNodeToBuffer(node, buffer, matrix, true);
                Matrix.release(matrix);

                try {
                    data = buffer.getPixels(1, 1);
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

        static $drawImage(node: sys.BitmapNode, image: any,
            bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number,
            textureWidth: number, textureHeight: number, destW: number, destH: number, sourceWidth: number, sourceHeight: number,
            scale9Grid: egret.Rectangle, fillMode: string, smoothing: boolean): void {
            console.warn('deprecated method : Bitmap.$drawImage,use egret.sys.BitmapNode.$drawImage instead of it');
            sys.BitmapNode.$updateTextureData(node, image,
                bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY,
                textureWidth, textureHeight, destW, destH, sourceWidth, sourceHeight,
                scale9Grid, fillMode, smoothing);
        }

    }

}
