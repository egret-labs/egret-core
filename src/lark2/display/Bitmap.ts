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
     * @language en_US
     * The Bitmap class represents display objects that represent bitmap images.
     * The Bitmap() constructor allows you to create a Bitmap object that contains a reference to a BitmapData object.
     * After you create a Bitmap object, use the addChild() or addChildAt() method of the parent DisplayObjectContainer
     * instance to place the bitmap on the display list.A Bitmap object can share its BitmapData reference among several
     * Bitmap objects, independent of translation or rotation properties. Because you can create multiple Bitmap objects
     * that reference the same BitmapData object, multiple display objects can use the same complex BitmapData object
     * without incurring the memory overhead of a BitmapData object for each display object instance.
     *
     * @see egret.BitmapData
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Bitmap 类表示用于显示位图图片的显示对象。
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象引用的 Bitmap 对象。创建了 Bitmap 对象后，
     * 使用父级 DisplayObjectContainer 实例的 addChild() 或 addChildAt() 方法可以将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 BitmapData 引用，与缩放或旋转属性无关。
     * 由于能够创建引用相同 BitmapData 对象的多个 Bitmap 对象，因此，多个显示对象可以使用相同的 BitmapData 对象，
     * 而不会因为每个显示对象实例使用一个 BitmapData 对象而产生额外内存开销。
     *
     * @see egret.BitmapData
     * @version Lark 1.0
     * @platform Web,Native
     */
    export class Bitmap extends DisplayObject {

        /**
         * @language en_US
         * Initializes a Bitmap object to refer to the specified BitmapData object.
         * @param bitmapData The BitmapData object being referenced.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个引用指定 BitmapData 实例的 Bitmap 对象
         * @param bitmapData 被引用的 BitmapData 实例
         * @version Lark 1.0
         * @platform Web,Native
         */
        public constructor(bitmapData?:Texture) {
            super();
            this.$renderRegion = new sys.Region();
            this.texture = bitmapData;
        }

        /**
         * @private
         */
        $bitmapData:Texture;

        /**
         * @language en_US
         * bitmapData The BitmapData object being referenced.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 被引用的 BitmapData 对象。
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get texture():Texture{
            return this.$bitmapData;
        }

        public set texture(value:Texture){
            this.$setBitmapData(value);
        }

        /**
         * 确定位图填充尺寸的方式。
         * 设置为 BitmapFillMode.REPEAT时，位图将重复以填充区域；BitmapFillMode.SCALE时，位图将拉伸以填充区域。
         * 默认值：BitmapFillMode.SCALE。
         * @member {string} egret.Bitmap#fillMode
         */
        public fillMode:string = "scale";

        /**
         * @private
         */
        $setBitmapData(value:Texture):void{
            if(value==this.$bitmapData){
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
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 控制在缩放时是否对位图进行平滑处理。
         * @default true。
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get smoothing():boolean{
            return this.$smoothing;
        }

        public set smoothing(value:boolean) {
            value = !!value;
            if(value===this.$smoothing){
                return;
            }
            this.$smoothing = value;
            this.$invalidate();
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            var bitmapData = this.$bitmapData;
            if(bitmapData){
                bounds.setTo(0,0,bitmapData._textureWidth,bitmapData._textureHeight);
            }
            else{
                bounds.setEmpty();
            }
        }

        /**
         * @private
         */
        $render(context:sys.RenderContext):void{
            var bitmapData = this.$bitmapData;
            if (bitmapData) {
                context.imageSmoothingEnabled = this.$smoothing;

                var offsetX:number = Math.round(bitmapData._offsetX);
                var offsetY:number = Math.round(bitmapData._offsetY);
                var bitmapWidth:number = bitmapData._bitmapWidth || bitmapData._textureWidth;
                var bitmapHeight:number = bitmapData._bitmapHeight || bitmapData._textureHeight;
                var destW:number = Math.round(bitmapWidth);
                var destH:number = Math.round(bitmapHeight);

                if (this.fillMode == egret.BitmapFillMode.SCALE) {
                    context.drawImage(bitmapData._bitmapData, bitmapData._bitmapX, bitmapData._bitmapY,
                        bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
                }
                else {
                    this.drawRepeat(context, bitmapData._bitmapData, bitmapData._bitmapX, bitmapData._bitmapY,
                        bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH, this.fillMode);
                }
            }
        }

        private drawRepeat(context:sys.RenderContext, bitmapData, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat):void {
            if (this['pattern'] === undefined) {
                var texture_scale_factor = 1;
                var tempImage:BitmapData = bitmapData;
                if (bitmapData.width != sourceWidth || bitmapData.height != sourceHeight || texture_scale_factor != 1) {
                    var tempCanvas = sys.surfaceFactory.create(true);
                    tempCanvas.width = sourceWidth * texture_scale_factor;
                    tempCanvas.height = sourceHeight * texture_scale_factor;

                    tempCanvas.renderContext.drawImage(bitmapData, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth * texture_scale_factor, sourceHeight * texture_scale_factor);
                    tempImage = tempCanvas;
                }
                var pat = context.createPattern(tempImage, repeat);
                this['pattern'] = pat;
            }
            var pattern = this['pattern'];
            context.fillStyle = pattern;
            context.translate(destX, destY);
            context.fillRect(0, 0, destWidth, destHeight);
            context.translate(-destX, -destY);
        }
    }

    registerClass(Bitmap,Types.Bitmap);
}