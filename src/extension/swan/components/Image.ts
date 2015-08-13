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

module swan {

    /**
     * @private
     * 默认的皮肤适配器
     */
    var assetAdapter = new DefaultAssetAdapter();
    /**
     * @language en_US
     * The Image control lets you show JPEG, PNG, and GIF files
     * at runtime. Image inherit Bitmap，so you can set the <code>bitmapData</code> property
     * to show the data. you can also set the <code>source</code> property, Image will auto load
     * and show the url image or the bitmapData.
     *
     * @event egret.Event.COMPLETE Emitted when the image loaded complete.
     * @version Egret 2.4
     * @version Swan 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/extension/swan/components/ImageExample.ts
     */
    /**
     * @language zh_CN
     * Image 控件允许您在运行时显示 JPEG、PNG 等图片文件文件。Image 继承至 Bitmap，因此您可以直接对其 bitmapData 属性，
     * 赋值从外部加载得到的位图数据以显示对应图片。同时，Image 还提供了更加方便的 source 属性，source 属性可以接受一个网络图片url作为值，
     * 赋值为url后，它内部会自动去加载并显示图片。并且您同样也可以直接把 BitmapData 对象赋值给 source 属性以显示图片。
     *
     * @event egret.Event.COMPLETE 当图片加载完成后调度
     * @version Egret 2.4
     * @version Swan 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/extension/swan/components/ImageExample.ts
     */
    export class Image extends egret.Bitmap implements UIComponent {

        /**
         * @language en_US
         * Constructor.
         *
         * @param source The source used for the bitmap fill. the value can be
         * a string or an instance of <code>egret.Texture</code>
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @param source 用于位图填充的源。可以是一个字符串或者 <code>egret.Texture</code> 对象
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public constructor(source?:string|egret.Texture) {
            super();
            this.initializeUIValues();
            if (source) {
                this.source = source;
            }
        }

        /**
         * @private
         */
        /*//IF LARK
        private _scale9Grid:egret.Rectangle = null;
        //END IF*/

        /**
         * @language en_US
         * Represent a Rectangle Area that the 9 scale area of Image.
         * Notice: This property is valid only when <code>fillMode</code>
         * is <code>BitmapFillMode.SCALE</code>.
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public get scale9Grid():egret.Rectangle {
            /*//IF LARK
            return this._scale9Grid;
            //END IF*/
            //IF EGRET
            return this.$scale9Grid;
            //END IF*/
        }

        public set scale9Grid(value:egret.Rectangle) {
            /*//IF LARK
            this._scale9Grid = value;
            this.invalidateDisplayList();
            //END IF*/
            //IF EGRET
            this.$scale9Grid = value;
            this.$invalidateContentBounds();
            this.invalidateDisplayList();
            //END IF*/
        }

        /**
         * @private
         */
        /*//IF LARK
        private _fillMode:string = "scale";
        //END IF*/
        /**
         * @language en_US
         * Determines how the bitmap fills in the dimensions.
         * <p>When set to <code>BitmapFillMode.CLIP</code>, the bitmap
         * ends at the edge of the region.</p>
         * <p>When set to <code>BitmapFillMode.REPEAT</code>, the bitmap
         * repeats to fill the region.</p>
         * <p>When set to <code>BitmapFillMode.SCALE</code>, the bitmap
         * stretches to fill the region.</p>
         *
         * @default <code>BitmapFillMode.SCALE</code>
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定位图填充尺寸的方式。
         * <p>设置为 <code>BitmapFillMode.CLIP</code>时，位图将在边缘处被截断。</p>
         * <p>设置为 <code>BitmapFillMode.REPEAT</code>时，位图将重复以填充区域。</p>
         * <p>设置为 <code>BitmapFillMode.SCALE</code>时，位图将拉伸以填充区域。</p>
         *
         * @default <code>BitmapFillMode.SCALE</code>
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public get fillMode():string {
            /*//IF LARK
            return this._fillMode;
            //END IF*/
            //IF EGRET
            return this.$fillMode;
            //END IF*/
        }

        public set fillMode(value:string) {
            /*//IF LARK
            if (value == this._fillMode) {
                return;
            }
            this._fillMode = value;
            //END IF*/
            //IF EGRET
            if (value == this.$fillMode) {
                return;
            }
            this.$fillMode = value;
             //END IF*/
            this.invalidateDisplayList();
        }

        //IF EGRET
        $setFillMode(value:string):void {
            super.$setFillMode(value);
            this.invalidateDisplayList();
        }
         //END IF*/

        /**
         * @private
         */
        private sourceChanged:boolean = false;
        /**
         * @private
         */
        private _source:string|egret.Texture = null;
        /**
         * @language en_US
         * The source used for the bitmap fill. the value can be
         * a string or an instance of <code>egret.Texture</code>
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于位图填充的源。可以是一个字符串或者 <code>egret.Texture</code> 对象
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public get source():string|egret.Texture {
            return this._source;
        }

        public set source(value:string|egret.Texture) {
            if (value == this._source) {
                return;
            }
            this._source = value;
            this.sourceChanged = true;
            this.invalidateProperties();
        }

        /**
         * @private
         */
        /*//IF LARK
        $setBitmapData(value:egret.Texture|egret.Texture):void {
            var values = this.$Bitmap;
            if (value == values[egret.sys.BitmapKeys.bitmapData]) {
                return;
            }
            super.$setBitmapData(value);
            this.sourceChanged = false;
            this.invalidateSize();
            this.invalidateDisplayList();
        }
        //END IF*/
        //IF EGRET
        $setBitmapData(value:egret.Texture):void {
            if (value == this.$bitmapData) {
                return;
            }
            super.$setBitmapData(value);
            this.sourceChanged = false;
            this.invalidateSize();
            this.invalidateDisplayList();
        }
         //END IF*/

        /**
         * @private
         * 解析source
         */
        private parseSource():void {
            this.sourceChanged = false;
            var source = this._source;
            if (source && typeof source == "string") {
                var adapter:IAssetAdapter = this.$stage.getImplementation("swan.IAssetAdapter");
                if (!adapter) {
                    adapter = assetAdapter;
                }
                adapter.getAsset(<string>this._source, this.contentChanged, this);
            }
            else {
                this.$setBitmapData(<egret.Texture>source);
            }
        }

        /**
         * @private
         * 资源发生改变
         */
        private contentChanged(data:any, source:any):void {
            if (source !== this._source)
                return;
            /*//IF LARK
            if (!egret.is(data, "egret.Texture") && !(data instanceof egret.Texture))
            //END IF*/
            //IF EGRET
            if (!egret.is(data, "egret.Texture"))
             //END IF*/
            {
                return;
            }
            this.$setBitmapData(data);
            if (data) {
                this.dispatchEventWith(egret.Event.COMPLETE);
            }
            else if (DEBUG) {
                egret.$warn(2301, source);
            }
        }

        /**
         * @private
         */
        /*//IF LARK
        $measureContentBounds(bounds:egret.Rectangle):void {
            var values = this.$Bitmap;
            var image = values[egret.sys.BitmapKeys.image];
            if (image) {
                var uiValues = this.$UIComponent;
                var width = uiValues[sys.UIKeys.width];
                var height = uiValues[sys.UIKeys.height];
                if (isNaN(width) || isNaN(height)) {
                    bounds.setEmpty();
                    return;
                }
                if (this._fillMode == "clip")
                {
                    if (width > values[egret.sys.BitmapKeys.width]) {
                        width = values[egret.sys.BitmapKeys.width];
                    }
                    if (height > values[egret.sys.BitmapKeys.height]) {
                        height = values[egret.sys.BitmapKeys.height];
                    }
                }
                bounds.setTo(0, 0, width, height);
            }
            else {
                bounds.setEmpty();
            }
        }
        //END IF*/
        //IF EGRET
        $measureContentBounds(bounds:egret.Rectangle):void {
            var values = this.$Bitmap;
            var image = this.$bitmapData;
            if (image) {
                var uiValues = this.$UIComponent;
                var width = uiValues[sys.UIKeys.width];
                var height = uiValues[sys.UIKeys.height];
                if (isNaN(width) || isNaN(height)) {
                    bounds.setEmpty();
                    return;
                }
                if (this.$fillMode == "clip")
                {
                    if (width > image.$getTextureWidth()) {
                        width = image.$getTextureWidth();
                    }
                    if (height > image.$getTextureHeight()) {
                        height = image.$getTextureHeight();
                    }
                }
                bounds.setTo(0, 0, width, height);
            }
            else {
                bounds.setEmpty();
            }
        }
         //END IF*/

        /**
         * @private
         *
         * @param context
         */
        $render(context:egret.sys.RenderContext):void {
            /*//IF LARK
            var values = this.$Bitmap;
            var image = values[egret.sys.BitmapKeys.image];
            //END IF*/
            //IF EGRET
            var image = this.$bitmapData;
            //END IF*/
            if (!image) {
                return;
            }
            var uiValues = this.$UIComponent;
            var width = uiValues[sys.UIKeys.width];
            var height = uiValues[sys.UIKeys.height];
            if (width === 0 || height === 0) {
                return;
            }
            /*//IF LARK
            switch (this._fillMode) {
                case "clip":
                    if (width > values[egret.sys.BitmapKeys.width]) {
                        width = values[egret.sys.BitmapKeys.width];
                    }
                    if (height > values[egret.sys.BitmapKeys.height]) {
                        height = values[egret.sys.BitmapKeys.height];
                    }
                    context.drawImage(image, 0, 0, width, height, 0, 0, width, height);
                    break;
                case "repeat":
                    var pattern = context.createPattern(image, "repeat");
                    context.beginPath();
                    context.rect(0, 0, width, height);
                    context.fillStyle = pattern;
                    context.fill();
                    break;
                default ://scale
                    context.imageSmoothingEnabled = values[egret.sys.BitmapKeys.smoothing];
                    if (this._scale9Grid) {
                        this.drawScale9GridImage(context, image, this._scale9Grid, width, height);
                    }
                    else {
                        context.drawImage(image, 0, 0, width, height);
                    }
                    break;
            }
            //END IF*/
            //IF EGRET
            egret.Bitmap.$drawImage(context, image, width, height, this.$scale9Grid, this.$fillMode, this.$smoothing, 0, 0);
            //END IF*/
        }

        /**
         * @private
         * 绘制九宫格位图
         */
        /*//IF LARK
        private drawScale9GridImage(context:egret.sys.RenderContext, image:egret.Texture,
                                    scale9Grid:egret.Rectangle, surfaceWidth?:number, surfaceHeight?:number):void {

            var imageWidth = image.width;
            var imageHeight = image.height;

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
            var sourceX0 = 0;
            var sourceX1 = sourceX0 + sourceW0;
            var sourceX2 = sourceX1 + sourceW1;
            var sourceW2 = imageWidth - sourceW0 - sourceW1;

            var sourceY0 = 0;
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
        //END IF*/

        //=======================UIComponent接口实现===========================
        /**
         * @private
         * UIComponentImpl 定义的所有变量请不要添加任何初始值，必须统一在此处初始化。
         */
        private initializeUIValues:()=>void;

        /**
         * @copy swan.UIComponent#createChildren
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected createChildren():void {

        }

        /**
         * @copy swan.UIComponent#childrenCreated
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected childrenCreated():void {

        }

        /**
         * @copy swan.UIComponent#commitProperties
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            sys.UIComponentImpl.prototype["commitProperties"].call(this);
            if (this.sourceChanged) {
                this.parseSource();
            }
        }

        /**
         * @copy swan.UIComponent#measure
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected measure():void {
            /*//IF LARK
            var values = this.$Bitmap;
            var image = values[egret.sys.BitmapKeys.image];
            if (image) {
                this.setMeasuredSize(values[egret.sys.BitmapKeys.width], values[egret.sys.BitmapKeys.height]);
            }
            else {
                this.setMeasuredSize(0, 0);
            }
            //END IF*/
            //IF EGRET
            var bitmapData = this.$bitmapData;
            if (bitmapData) {
                this.setMeasuredSize(bitmapData.$getTextureWidth(), bitmapData.$getTextureHeight());
            }
            else {
                this.setMeasuredSize(0, 0);
            }
            //END IF*/
        }

        /**
         * @copy swan.UIComponent#updateDisplayList
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            this.$invalidateContentBounds();
        }

        /**
         * @copy swan.UIComponent#invalidateParentLayout
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected invalidateParentLayout():void {
        }

        /**
         * @private
         */
        $UIComponent:Object;

        /**
         * @private
         */
        $includeInLayout:boolean;

        /**
         * @copy swan.UIComponent#includeInLayout
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public includeInLayout:boolean;
        /**
         * @copy swan.UIComponent#left
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public left:number;

        /**
         * @copy swan.UIComponent#right
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public right:number;

        /**
         * @copy swan.UIComponent#top
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public top:number;

        /**
         * @copy swan.UIComponent#bottom
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public bottom:number;

        /**
         * @copy swan.UIComponent#horizontalCenter
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public horizontalCenter:number;

        /**
         * @copy swan.UIComponent#verticalCenter
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public verticalCenter:number;

        /**
         * @copy swan.UIComponent#percentWidth
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public percentWidth:number;

        /**
         * @copy swan.UIComponent#percentHeight
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public percentHeight:number;

        /**
         * @copy swan.UIComponent#explicitWidth
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public explicitWidth:number;

        /**
         * @copy swan.UIComponent#explicitHeight
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public explicitHeight:number;


        /**
         * @copy swan.UIComponent#minWidth
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public minWidth:number;
        /**
         * @copy swan.UIComponent#maxWidth
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public maxWidth:number;

        /**
         * @copy swan.UIComponent#minHeight
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public minHeight:number;
        /**
         * @copy swan.UIComponent#maxHeight
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public maxHeight:number;


        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public setMeasuredSize(width:number, height:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public invalidateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public invalidateSize():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateSize(recursive?:boolean):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public invalidateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateNow():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsSize(layoutWidth:number, layoutHeight:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsPosition(x:number, y:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public getLayoutBounds(bounds:egret.Rectangle):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public getPreferredBounds(bounds:egret.Rectangle):void {
        }
    }

    sys.implementUIComponent(Image, egret.Bitmap);
    registerProperty(Image, "scale9Grid", "egret.Rectangle");
}