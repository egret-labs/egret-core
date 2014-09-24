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


module egret.gui {

	/**
	 * @class egret.gui.UIAsset
	 * @classdesc
	 * 素材包装器。<p/>
	 * 注意：UIAsset仅在添content时测量一次初始尺寸， 请不要在外部直接修改content尺寸，
	 * 若做了引起content尺寸发生变化的操作, 需手动调用UIAsset的invalidateSize()进行重新测量。
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
            this.autoScale = autoScale;
		}

        /**
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在source的解析结果为Texture并且fileMode为BitmapFillMode.SCALE时有效。
         * @member {egret.Texture} egret.gui.UIAsset#scale9Grid
         */
        public scale9Grid:Rectangle;

        /**
         * 确定位图填充尺寸的方式。默认值：BitmapFillMode.SCALE。
         * 设置为 BitmapFillMode.REPEAT时，位图将重复以填充区域。
         * 设置为 BitmapFillMode.SCALE时，位图将拉伸以填充区域。
         * 注意:此属性仅在source的解析结果为Texture时有效
         * @member {egret.Texture} egret.gui.UIAsset#fillMode
         */
        public fillMode:string = "scale";
		
		private sourceChanged:boolean = false;

		public _source:any;
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
		}
        
		public _content:any;
		/**
		 * 解析source得到的对象，通常为显示对象或Texture。
		 * @member egret.gui.UIAsset#content
		 */
		public get content():any{
			return this._content;
		}
		
		private createChildrenCalled:boolean = false;
		/**
		 * @method egret.gui.UIAsset#createChildren
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
		private static assetAdapter:IAssetAdapter;
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
                adapter = Injector.getInstance("egret.gui.IAssetAdapter");
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
            if(oldContent!==content) {
                if(oldContent instanceof DisplayObject){
                    this._removeFromDisplayList(<DisplayObject> oldContent);
                }
                if(content instanceof  DisplayObject){
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

		public measure():void{
			super.measure();
            var content:any = this._content;
			if(content instanceof DisplayObject){
                if("preferredWidth" in content){
                    this.measuredWidth = (<ILayoutElement><any> (content)).preferredWidth;
                    this.measuredHeight = (<ILayoutElement><any> (content)).preferredHeight;
                }
                else{
                    this.measuredWidth = content.width*content.scaleX;
                    this.measuredHeight = content.height*content.scaleY;
                }
            }
            else if(content instanceof Texture){
                this.measuredWidth = (<Texture> content)._textureWidth;
                this.measuredHeight = (<Texture> content)._textureHeight;
            }
		}
        /**
         * 是自动否缩放content对象，以符合UIAsset的尺寸。默认值true。
         */
        public autoScale:boolean = true;
		/**
		 * @method egret.gui.UIAsset#updateDisplayList
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
            this._setSizeDirty();
		}

        public _render(renderContext:RendererContext):void {
            if(this._content instanceof Texture){
                var texture:Texture = <Texture> this._content;
                this._texture_to_render = texture;
                var w:number;
                var h:number;
                if(this.autoScale){
                    w = this._width;
                    h = this._height;
                }
                else{
                    w = texture.textureWidth;
                    h = texture.textureHeight;
                }
                Bitmap._drawBitmap(renderContext,w,h,this);
            }
            else{
                this._texture_to_render = null;
            }
            super._render(renderContext);
        }

        /**
         * @see egret.DisplayObject.measureBounds
         * @returns {Rectangle}
         * @private
         */
        public _measureBounds():egret.Rectangle {
            if(this._content instanceof Texture){
                var texture:Texture = <Texture> this._content;
                var textureW:number = texture._textureWidth;
                var textureH:number = texture._textureHeight;
                var w:number = this.width;
                var h:number = this.height;
                var x:number = Math.floor(texture._offsetX*w/textureW);
                var y:number = Math.floor(texture._offsetY*h/textureH);
                return Rectangle.identity.initialize(x,y, w, h);
            }
            return super._measureBounds();
        }

		private static errorStr:string = "在此组件中不可用，若此组件为容器类，请使用";
		/**
		 * @method egret.gui.UIAsset#addChild
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public addChild(child:DisplayObject):DisplayObject{
			throw(new Error("addChild()"+UIAsset.errorStr+"addElement()代替"));
		}
		/**
		 * @method egret.gui.UIAsset#addChildAt
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			throw(new Error("addChildAt()"+UIAsset.errorStr+"addElementAt()代替"));
		}
		/**
		 * @method egret.gui.UIAsset#removeChild
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public removeChild(child:DisplayObject):DisplayObject{
			throw(new Error("removeChild()"+UIAsset.errorStr+"removeElement()代替"));
		}
		/**
		 * @method egret.gui.UIAsset#removeChildAt
		 * @deprecated
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public removeChildAt(index:number):DisplayObject{
			throw(new Error("removeChildAt()"+UIAsset.errorStr+"removeElementAt()代替"));
		}
		/**
		 * @method egret.gui.UIAsset#setChildIndex
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 */		
		public setChildIndex(child:DisplayObject, index:number):void{
			throw(new Error("setChildIndex()"+UIAsset.errorStr+"setElementIndex()代替"));
		}
		/**
		 * @method egret.gui.UIAsset#swapChildren
		 * @deprecated
		 * @param child1 {DisplayObject} 
		 * @param child2 {DisplayObject} 
		 */		
		public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
			throw(new Error("swapChildren()"+UIAsset.errorStr+"swapElements()代替"));
		}
		/**
		 * @method egret.gui.UIAsset#swapChildrenAt
		 * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
		 */		
		public swapChildrenAt(index1:number, index2:number):void{
			throw(new Error("swapChildrenAt()"+UIAsset.errorStr+"swapElementsAt()代替"));
		}
	}
}