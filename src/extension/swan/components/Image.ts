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
     * @version Lark 1.0
     * @version Swan 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/extension/swan/components/ImageExample.ts
     */
    /**
     * @language zh_CN
     * Image 控件允许您在运行时显示 JPEG、PNG 等图片文件文件。Image 继承至 Bitmap，因此您可以直接对其 bitmapData 属性，
     * 赋值从外部加载得到的位图数据以显示对应图片。同时，Image 还提供了更加方便的 source 属性，source 属性可以接受一个网络图片url作为值，
     * 赋值为url后，它内部会自动去加载并显示图片。并且您同样也可以直接把 Texture 对象赋值给 source 属性以显示图片。
     *
     * @event egret.Event.COMPLETE 当图片加载完成后调度
     * @version Lark 1.0
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
         * a string or an instance of <code>Texture</code>
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @param source 用于位图填充的源。可以是一个字符串或者 <code>Texture</code> 对象
         *
         * @version Lark 1.0
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
         * @language en_US
         * Represent a Rectangle Area that the 9 scale area of Image.
         * Notice: This property is valid only when <code>fillMode</code>
         * is <code>BitmapFillMode.SCALE</code>.
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public get scale9Grid():egret.Rectangle {
            return this.$scale9Grid;
        }

        public set scale9Grid(value:egret.Rectangle) {
            this.$scale9Grid = value;
            this.invalidateDisplayList();
        }

        public set fillMode(value:string) {
            if (value == this.$fillMode) {
                return;
            }
            this.$fillMode = value;
            this.invalidateDisplayList();
        }

        $setFillMode(value:string):void {
            super.$setFillMode(value);

            this.invalidateDisplayList();
        }

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
         * a string or an instance of <code>Texture</code>
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于位图填充的源。可以是一个字符串或者 <code>Texture</code> 对象
         *
         * @version Lark 1.0
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
         * 
         * @param value 
         */
        $setBitmapData(value:egret.Texture):void {
            if (value == this.$bitmapData) {
                return;
            }
            super.$setBitmapData(value);
            this._source = value;
            this.sourceChanged = false;
            this.invalidateSize();
            this.invalidateDisplayList();
        }

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
            if (!egret.is(data, "egret.Texture")) {
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
         * 
         * @param bounds 
         */
        $measureContentBounds(bounds:egret.Rectangle):void {
            var bitmapData = this.$bitmapData;
            if (bitmapData) {
                var values = this.$UIComponent;
                var width = values[sys.UIKeys.width];
                var height = values[sys.UIKeys.height];
                if (isNaN(width) || isNaN(height)) {
                    bounds.setEmpty();
                    return;
                }
                if (this.$fillMode == "clip") {
                    if (width > bitmapData._bitmapData.width) {
                        width = bitmapData._bitmapData.width;
                    }
                    if (height > bitmapData._bitmapData.height) {
                        height = bitmapData._bitmapData.height;
                    }
                }
                bounds.setTo(0, 0, width, height);
            }
            else {
                bounds.setEmpty();
            }
        }

        /**
         * @private
         * 
         * @param context 
         */
        $render(context:egret.sys.RenderContext):void {
            var bitmapData = this.$bitmapData;
            if (!bitmapData) {
                return;
            }
            var values = this.$UIComponent;
            var width = values[sys.UIKeys.width];
            var height = values[sys.UIKeys.height];
            if (width === 0 || height === 0) {
                return;
            }
            egret.Bitmap.$drawImage(context, bitmapData, width, height, this.$scale9Grid, this.$fillMode, this.$smoothing, 0, 0);
            /*switch (this.$fillMode) {
                case "clip":
                    if (width > bitmapData._bitmapData.width) {
                        width = bitmapData._bitmapData.width;
                    }
                    if (height > bitmapData._bitmapData.height) {
                        height = bitmapData._bitmapData.height;
                    }
                    context.drawImage(bitmapData, 0, 0, width, height, 0, 0, width, height);
                    break;
                case "repeat":
                    var pattern = context.createPattern(bitmapData, "repeat");
                    context.beginPath();
                    context.rect(0, 0, width, height);
                    context.fillStyle = pattern;
                    context.fill();
                    break;
                default ://scale
                    context.imageSmoothingEnabled = this.$smoothing;
                    if (this._scale9Grid) {
                        this.drawScale9GridImage(context, bitmapData, this._scale9Grid, width, height);
                    }
                    else {
                        context.drawImage(bitmapData, 0, 0, width, height);
                    }
                    break;
            }*/
        }

        //=======================UIComponent接口实现===========================
        /**
         * @private
         * UIComponentImpl 定义的所有变量请不要添加任何初始值，必须统一在此处初始化。
         */
        private initializeUIValues:()=>void;

        /**
         * @copy swan.UIComponent#createChildren
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected createChildren():void {

        }

        /**
         * @copy swan.UIComponent#childrenCreated
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected childrenCreated():void {

        }

        /**
         * @copy swan.UIComponent#commitProperties
         *
         * @version Lark 1.0
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
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected measure():void {
            var bitmapData = this.$bitmapData;
            if (bitmapData) {
                this.setMeasuredSize(bitmapData._bitmapData.width, bitmapData._bitmapData.height);
            }
            else {
                this.setMeasuredSize(0, 0);
            }

        }

        /**
         * @copy swan.UIComponent#updateDisplayList
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            this.$invalidateContentBounds();
        }

        /**
         * @copy swan.UIComponent#invalidateParentLayout
         *
         * @version Lark 1.0
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
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public includeInLayout:boolean;
        /**
         * @copy swan.UIComponent#left
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public left:number;

        /**
         * @copy swan.UIComponent#right
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public right:number;

        /**
         * @copy swan.UIComponent#top
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public top:number;

        /**
         * @copy swan.UIComponent#bottom
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public bottom:number;

        /**
         * @copy swan.UIComponent#horizontalCenter
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public horizontalCenter:number;

        /**
         * @copy swan.UIComponent#verticalCenter
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public verticalCenter:number;

        /**
         * @copy swan.UIComponent#percentWidth
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public percentWidth:number;

        /**
         * @copy swan.UIComponent#percentHeight
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public percentHeight:number;

        /**
         * @copy swan.UIComponent#explicitWidth
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public explicitWidth:number;

        /**
         * @copy swan.UIComponent#explicitHeight
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public explicitHeight:number;


        /**
         * @copy swan.UIComponent#minWidth
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public minWidth:number;
        /**
         * @copy swan.UIComponent#maxWidth
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public maxWidth:number;

        /**
         * @copy swan.UIComponent#minHeight
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public minHeight:number;
        /**
         * @copy swan.UIComponent#maxHeight
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public maxHeight:number;


        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public setMeasuredSize(width:number, height:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public invalidateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public invalidateSize():void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateSize(recursive?:boolean):void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public invalidateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateNow():void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsSize(layoutWidth:number, layoutHeight:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsPosition(x:number, y:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public getLayoutBounds(bounds:egret.Rectangle):void {
        }

        /**
         * @inheritDoc
         *
         * @version Lark 1.0
         * @version Swan 1.0
         * @platform Web,Native
         */
        public getPreferredBounds(bounds:egret.Rectangle):void {
        }
    }

    sys.implementUIComponent(Image, egret.Bitmap);
    registerProperty(Image, "scale9Grid", "egret.Rectangle");
}