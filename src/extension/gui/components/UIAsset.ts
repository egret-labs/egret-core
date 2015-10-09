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


module egret.gui {

	/**
	 * @class egret.gui.UIAsset
	 * @classdesc
	 * 素材和非GUI显示对象包装器。<p/>
	 * @extends egret.gui.UIComponent
	 * @implements egret.gui.ISkinnableClient
	 */
	export class UIAsset extends UIComponent{
		/**
		 * @method egret.gui.UIAsset#constructor
         * @param source {any} 素材标识符
         */
		public constructor(source?:any,autoScale:boolean=true){
			super();
			this.touchChildren = false;
            if(source){
                this.source = source;
            }
			this.$renderRegion = new sys.Region();

            this.autoScale = autoScale;
		}

        /**
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在source的解析结果为Texture并且fileMode为BitmapFillMode.SCALE时有效。
         * @member {egret.Texture} egret.gui.UIAsset#scale9Grid
         */
        public scale9Grid: Rectangle = null;

        /**
         * 确定位图填充尺寸的方式。默认值：BitmapFillMode.SCALE。
         * 设置为 BitmapFillMode.REPEAT时，位图将重复以填充区域。
         * 设置为 BitmapFillMode.SCALE时，位图将拉伸以填充区域。
         * 注意:此属性仅在source的解析结果为Texture时有效
         * @member {egret.Texture} egret.gui.UIAsset#fillMode
         */
        public fillMode:string = "scale";
		
		private sourceChanged:boolean = false;

        public _source: any = null;
		/**
		 * 素材标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
		 * 适配器根据此属性值解析获取对应的显示对象，并赋值给content属性。
		 * @member egret.gui.UIAsset#source
		 */	
		public get source():any{
			return this._source;
		}

		public set source(value:any){
			if(this._source==value)
				return;
			this._source = value;
			if(this.createChildrenCalled){
				this.parseSource();
			}
			else{
				this.sourceChanged = true;
			}

            this.$invalidateContentBounds();
		}
        
        public _content: any = null;
        public _contentIsTexture: boolean = false;
		/**
		 * 解析source得到的对象，通常为显示对象或Texture。
		 * @member egret.gui.UIAsset#content
		 */
		public get content():any{
			return this._content;
		}
		
		private createChildrenCalled:boolean = false;
		/**
		 * 创建该容器的子元素对象
		 */
		public createChildren():void{
			super.createChildren();
			if(this.sourceChanged){
				this.parseSource();
			}
			this.createChildrenCalled = true;
		}
		
		/**
		 * 皮肤解析适配器
		 */		
        private static assetAdapter: IAssetAdapter = null;
		private contentReused:boolean = false;
		/**
		 * 解析source
		 */		
		private parseSource():void{
			this.sourceChanged = false;
			var adapter:IAssetAdapter = UIAsset.assetAdapter;
			if(!adapter){
                adapter = this.getAdapter();
			}
			if(!this._source){
				this.contentChanged(null,null);
			}
			else{
				var reuseContent:DisplayObject = this.contentReused?null:this._content;
				this.contentReused = true;
				adapter.getAsset(this._source,this.contentChanged,this,reuseContent);
			}
		}
        /**
         * 获取资源适配器
         */
        private getAdapter():IAssetAdapter{
            var adapter:IAssetAdapter;
            try{
                adapter = $getAdapter("egret.gui.IAssetAdapter");
            }
            catch(e){
                adapter = new DefaultAssetAdapter();
            }
            UIAsset.assetAdapter = adapter;
            return adapter;
        }
		/**
		 * 皮肤发生改变
		 */
		private contentChanged(content:any,source:any):void{
			if(source!==this._source)
				return;
            var oldContent:any = this._content;
            this._content = content;
            if(this._content instanceof Texture){
				this._contentIsTexture = true;
            }
            else{
				this._contentIsTexture = false;
            }
            if(oldContent!==content) {
                if(oldContent instanceof DisplayObject){
					if((<DisplayObject> oldContent).parent==this){
						//(<DisplayObject> oldContent)._sizeChangeCallBack = null;
						//(<DisplayObject> oldContent)._sizeChangeCallTarget = null;
						this._removeFromDisplayList(<DisplayObject> oldContent);
					}
                }
                if(content instanceof  DisplayObject){
					//(<DisplayObject> content)._sizeChangeCallBack = this.invalidateSize;
					//(<DisplayObject> content)._sizeChangeCallTarget = this;
                    this._addToDisplayListAt(<DisplayObject> content,0);
                }
            }
            this.invalidateSize();
            this.invalidateDisplayList();
			this.contentReused = false;
			if(this.hasEventListener(UIEvent.CONTENT_CHANGED)){
                UIEvent.dispatchUIEvent(this,UIEvent.CONTENT_CHANGED);
			}
		}

		/**
		 * 计算组件的默认大小和（可选）默认最小大小
		 */
		public measure():void{
			super.measure();
            var content:any = this._content;
			if(content instanceof DisplayObject){
                if("preferredWidth" in content){
                    this.measuredWidth = (<ILayoutElement><any> (content)).preferredWidth;
                    this.measuredHeight = (<ILayoutElement><any> (content)).preferredHeight;
                }
                else{
					var oldW:number = content.explicitWidth;
					var oldH:number = content.explicitHeight;
					content.width = NaN;
					content.height = NaN;
                    this.measuredWidth = content.measuredWidth*content.scaleX;
					this.measuredHeight = content.measuredHeight*content.scaleY;
					content.width = oldW;
					content.height = oldH;
                }
            }
            else if(this._contentIsTexture){
                this.measuredWidth = (<Texture> content).$getTextureWidth();
                this.measuredHeight = (<Texture> content).$getTextureHeight();
            }
		}
        /**
         * 是自动否缩放content对象，以符合UIAsset的尺寸。默认值true。
         */
        public autoScale:boolean = true;
		/**
		 * 绘制对象和/或设置其子项的大小和位置
		 * @param unscaledWidth {number}
		 * @param unscaledHeight {number} 
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
            var content:any = this._content;
			if(this.autoScale&&content instanceof DisplayObject){
				if("setLayoutBoundsSize" in content){
                    (<ILayoutElement><any> (content)).setLayoutBoundsSize(unscaledWidth,unscaledHeight);
				}
				else{
					content.width = unscaledWidth/content.scaleX;
					content.height = unscaledHeight/content.scaleY;
				}
			}
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
		 */
		$render(context:sys.RenderContext):void{
			if (this._contentIsTexture) {
				var bitmapData = <Texture> this._content;
				context.imageSmoothingEnabled = false;
				var destW:number;
				var destH:number;
				if(this.autoScale){
					destW = this._UIC_Props_._uiWidth;
					destH = this._UIC_Props_._uiHeight;
				}
				else{
					destW = bitmapData.$getTextureWidth();
					destH = bitmapData.$getTextureHeight();
				}

                Bitmap.$drawImage(context, bitmapData._bitmapData,
                    bitmapData._bitmapX, bitmapData._bitmapY, bitmapData._bitmapWidth, bitmapData._bitmapHeight, bitmapData._offsetX, bitmapData._offsetY, bitmapData.$getTextureWidth(), bitmapData.$getTextureHeight(),
                    destW, destH, this.scale9Grid || bitmapData["scale9Grid"], this.fillMode, this.$smoothing);

				//var offsetX:number = Math.round(bitmapData._offsetX);
				//var offsetY:number = Math.round(bitmapData._offsetY);
				//var bitmapWidth:number = bitmapData._bitmapWidth || bitmapData._textureWidth;
				//var bitmapHeight:number = bitmapData._bitmapHeight || bitmapData._textureHeight;
				//var scale9Grid = this.scale9Grid || bitmapData["scale9Grid"];
				//if (scale9Grid ) {
				//	Bitmap.$drawScale9GridImage(context, bitmapData, scale9Grid, destW, destH);
				//}
				//else {
				//	context.drawImage(bitmapData._bitmapData, bitmapData._bitmapX, bitmapData._bitmapY,
				//		bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
				//}
			}
			super.$render(context);
		}
		/**
		 * @private
		 */
		$measureContentBounds(bounds:Rectangle):void {
			if(this._contentIsTexture){
				var texture:Texture = <Texture> this._content;
				var w = NaN;
				var h = NaN;
				if(this.autoScale){
					w = this._UIC_Props_._uiWidth == 10000 ? this.$getExplicitWidth() : this._UIC_Props_._uiWidth;
					h = this._UIC_Props_._uiHeight == 10000 ? this.$getExplicitHeight() : this._UIC_Props_._uiHeight;
				}

				if (isNaN(w)) {
					w = texture.$getTextureWidth();
				}
				if (isNaN(h)) {
					h = texture.$getTextureHeight();
				}

				bounds.setTo(0, 0, w, h);

			}
			else{
				super.$measureContentBounds(bounds);
			}
		}

		/**
		 * 此方法不支持
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public addChild(child:DisplayObject):DisplayObject{
			egret.$error(3004, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 此方法不支持
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			egret.$error(3005, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 此方法不支持
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public removeChild(child:DisplayObject):DisplayObject{
			egret.$error(3006, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 此方法不支持
		 * @deprecated
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public removeChildAt(index:number):DisplayObject{
			egret.$error(3007, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 此方法不支持
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 */		
		public setChildIndex(child:DisplayObject, index:number):void{
			egret.$error(3008, egret.sys.tr(3003));
		}
		/**
		 * 此方法不支持
		 * @deprecated
		 * @param child1 {DisplayObject} 
		 * @param child2 {DisplayObject} 
		 */		
		public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
			egret.$error(3009, egret.sys.tr(3003));
		}
		/**
		 * 此方法不支持
		 * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
		 */		
		public swapChildrenAt(index1:number, index2:number):void{
			egret.$error(3010, egret.sys.tr(3003));
		}
	}
}