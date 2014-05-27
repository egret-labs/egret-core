/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../../egret/context/renderer/RenderFilter.ts"/>
/// <reference path="../../../egret/context/renderer/RendererContext.ts"/>
/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../egret/display/Texture.ts"/>
/// <reference path="../../../egret/geom/Rectangle.ts"/>
/// <reference path="../../../egret/utils/Injector.ts"/>
/// <reference path="supportClasses/DefaultAssetAdapter.ts"/>
/// <reference path="../core/IAssetAdapter.ts"/>
/// <reference path="../core/ILayoutElement.ts"/>
/// <reference path="../core/UIComponent.ts"/>
/// <reference path="../events/UIEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.UIAsset
	 * @classdesc
	 * 素材包装器。<p/>
	 * 注意：UIAsset仅在添content时测量一次初始尺寸， 请不要在外部直接修改content尺寸，
	 * 若做了引起content尺寸发生变化的操作, 需手动调用UIAsset的invalidateSize()进行重新测量。
	 * @extends ns_egret.UIComponent
	 * @implements ns_egret.ISkinnableClient
	 */
	export class UIAsset extends UIComponent{
		/**
		 * @method ns_egret.UIAsset#constructor
		 */
		public constructor(){
			super();
			this.touchChildren = false;
		}
		
		private sourceChanged:boolean = false;

		public _source:any;
		/**
		 * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
		 * 适配器根据此属性值解析获取对应的显示对象，并赋值给content属性。
		 * @member ns_egret.UIAsset#source
		 */	
		public get source():any{
			return this._source;
		}

		public set source(value:any){
			if(this._source==value)
				return;
			this._source = value;
			if(this.createChildrenCalled){
				this.parseSkinName();
			}
			else{
				this.sourceChanged = true;
			}
		}
        
		public _content:any;
		/**
		 * 解析source得到的对象，通常为显示对象或Texture。
		 * @member ns_egret.UIAsset#content
		 */
		public get content():any{
			return this._content;
		}
		
		private createChildrenCalled:boolean = false;
		/**
		 * @method ns_egret.UIAsset#createChildren
		 */
		public createChildren():void{
			super.createChildren();
			if(this.sourceChanged){
				this.parseSkinName();
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
		private parseSkinName():void{
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
                adapter = Injector.getInstance("ns_egret.IAssetAdapter");
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
                    this._removeFromDisplayList(<DisplayObjectContainer> oldContent);
                }
                if(content instanceof  DisplayObject){
                    this._addToDisplayListAt(<DisplayObjectContainer> content,0);
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
                    this.measuredWidth = content.width;
                    this.measuredHeight = content.height;
                }
            }
            else if(content instanceof Texture){
                this.measuredWidth = (<Texture> content)._textureWidth;
                this.measuredHeight = (<Texture> content)._textureHeight;
            }
		}
		
		/**
		 * @method ns_egret.UIAsset#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
            var content:any = this._content;
			if(content instanceof DisplayObject){
				if("setLayoutBoundsSize" in content){
                    (<ILayoutElement><any> (content)).setLayoutBoundsSize(unscaledWidth,unscaledHeight);
				}
				else{
					content.scaleX = content.width==0?1:unscaledWidth/content.width;
					content.scaleY = content.height==0?1:unscaledHeight/content.height;
				}
			}
		}

        public _render(renderContext:RendererContext):void {
            if(this._content instanceof Texture){
                var texture:Texture = <Texture> this._content;
                this._texture_to_render = texture;
                var w:number = texture._textureWidth;
                var h:number = texture._textureHeight;
                var offsetX:number = Math.floor(texture._offsetX*this.width/w);
                var offsetY:number = Math.floor(texture._offsetY*this.height/h);
                RenderFilter.getInstance().drawImage(renderContext, this, texture._startX, texture._startY,
                    w, h,offsetX, offsetY,this.width,this.height);
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
        public _measureBounds():ns_egret.Rectangle {
            var bounds:Rectangle = super._measureBounds();
            if(this._content instanceof Texture){
                var texture:Texture = <Texture> this._content;
                var textureW:number = texture._textureWidth;
                var textureH:number = texture._textureHeight;
                var w:number = this.width;
                var h:number = this.height;
                var x:number = Math.floor(texture._offsetX*w/textureW);
                var y:number = Math.floor(texture._offsetY*h/textureH);
                if(x<bounds.x){
                    bounds.x = x;
                }
                if(y<bounds.y){
                    bounds.y = y;
                }
                if(x+w>bounds.right){
                    bounds.right = x+w;
                }
                if(y+h>bounds.bottom){
                    bounds.bottom = y+h;
                }
            }
            return bounds;
        }

		private static errorStr:string = "在此组件中不可用，若此组件为容器类，请使用";
		/**
		 * @method ns_egret.UIAsset#addChild
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public addChild(child:DisplayObject):DisplayObject{
			throw(new Error("addChild()"+UIAsset.errorStr+"addElement()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#addChildAt
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			throw(new Error("addChildAt()"+UIAsset.errorStr+"addElementAt()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#removeChild
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public removeChild(child:DisplayObject):DisplayObject{
			throw(new Error("removeChild()"+UIAsset.errorStr+"removeElement()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#removeChildAt
		 * @deprecated
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public removeChildAt(index:number):DisplayObject{
			throw(new Error("removeChildAt()"+UIAsset.errorStr+"removeElementAt()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#setChildIndex
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 */		
		public setChildIndex(child:DisplayObject, index:number):void{
			throw(new Error("setChildIndex()"+UIAsset.errorStr+"setElementIndex()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#swapChildren
		 * @deprecated
		 * @param child1 {DisplayObject} 
		 * @param child2 {DisplayObject} 
		 */		
		public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
			throw(new Error("swapChildren()"+UIAsset.errorStr+"swapElements()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#swapChildrenAt
		 * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
		 */		
		public swapChildrenAt(index1:number, index2:number):void{
			throw(new Error("swapChildrenAt()"+UIAsset.errorStr+"swapElementsAt()代替"));
		}
	}
}