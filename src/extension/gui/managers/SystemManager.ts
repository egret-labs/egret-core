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

/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../components/Group.ts"/>
/// <reference path="../core/IContainer.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../core/UIGlobals.ts"/>
/// <reference path="../layouts/BasicLayout.ts"/>
/// <reference path="../layouts/supportClasses/LayoutBase.ts"/>
/// <reference path="ISystemManager.ts"/>
/// <reference path="SystemContainer.ts"/>

module ns_egret {

	export class SystemManager extends Group implements ISystemManager{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
			this.addEventListener(Event.ADDED_TO_STAGE,this.onAddToStage,this);
			this.addEventListener(Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
		}
		/**
		 * 添加到舞台
		 */		
		private onAddToStage(event:Event=null):void{
            if(UIGlobals._systemManager){
                throw new Error("只能有一个SystemManager实例在显示列表中！");
                return;
            }
            UIGlobals._systemManager = this;
			this.stage.addEventListener(Event.RESIZE,this.onResize,this);
			this.onResize();
		}
		/**
		 * 从舞台移除
		 */		
		private onRemoveFromStage(event:Event):void{
            UIGlobals._systemManager = null;
			this.stage.removeEventListener(Event.RESIZE,this.onResize,this);
		}
		
		/**
		 * 舞台尺寸改变
		 */		
		private onResize(event:Event=null):void{
			this._setWidth(this.stage.stageWidth);
			this._setHeight(this.stage.stageHeight);
		}

		//==========================================================================
		//                            禁止外部布局顶级容器
		//==========================================================================
        public get x():number{
            return this._x;
        }
		/**
		 * @inheritDoc
		 */
		public set x(value:number){
		}

        public get y():number{
            return this._y;
        }
		/**
		 * @inheritDoc
		 */
		public set y(value:number){
		}

        public get width():number{
            return this._width;
        }
		/**
		 * @inheritDoc
		 */
		public set width(value:number){
		}

        public get height():number{
            return this._height;
        }
		/**
		 * @inheritDoc
		 */
		public set height(value:number){
		}

        public get scaleX():number{
            return this._scaleX;
        }
		/**
		 * @inheritDoc
		 */
		public set scaleX(value:number){
		}

        public get scaleY():number{
            return this._scaleY;
        }
		/**
		 * @inheritDoc
		 */
		public set scaleY(value:number){
		}
		/**
		 * @inheritDoc
		 */
		public setActualSize(w:number, h:number):void{
		}
		/**
		 * @inheritDoc
		 */
		public setLayoutBoundsPosition(x:number, y:number):void{
		}
		/**
		 * @inheritDoc
		 */
		public setLayoutBoundsSize(layoutWidth:number, layoutHeight:number):void{
		}
		/**
		 * 布局对象,SystemManager只接受BasicLayout
		 */		
		public get layout():LayoutBase{
			return this._layout;
		}
		public set layout(value:LayoutBase){
			if(value instanceof BasicLayout)
				this._setLayout(value);
		}
		
		private _popUpContainer:SystemContainer;
		/**
		 * 弹出窗口层容器。
		 */		
		public get popUpContainer():IContainer{
			if (!this._popUpContainer){
				this._popUpContainer = new SystemContainer(this,"noTopMostIndex","topMostIndex");
			}
			
			return this._popUpContainer;
		}
		
		private _toolTipContainer:SystemContainer;
		/**
		 * 工具提示层容器。
		 */		
		public get toolTipContainer():IContainer{
			if (!this._toolTipContainer){
				this._toolTipContainer = new SystemContainer(this,"topMostIndex","toolTipIndex");
			}
			
			return this._toolTipContainer;
		}
		
		private _cursorContainer:SystemContainer;
		/**
		 * 鼠标样式层容器。
		 */		
		public get cursorContainer():IContainer{
			if (!this._cursorContainer){
				this._cursorContainer = new SystemContainer(this,"toolTipIndex","cursorIndex");
			}
			
			return this._cursorContainer;
		}
		
		private _noTopMostIndex:number = 0;
		/**
		 * 弹出窗口层的起始索引(包括)
		 */		
		private get noTopMostIndex():number{
			return this._noTopMostIndex;
		}
		
		private set noTopMostIndex(value:number){
			var delta:number = value - this._noTopMostIndex;
			this._noTopMostIndex = value;
			this.topMostIndex += delta;
		}
		
		private _topMostIndex:number = 0;
		/**
		 * 弹出窗口层结束索引(不包括)
		 */		
		private get topMostIndex():number{
			return this._topMostIndex;
		}
		
		private set topMostIndex(value:number){
			var delta:number = value - this._topMostIndex;
			this._topMostIndex = value;
			this.toolTipIndex += delta;
		}
		
		private _toolTipIndex:number = 0;
		/**
		 * 工具提示层结束索引(不包括)
		 */		
		private get toolTipIndex():number{
			return this._toolTipIndex;
		}
		
		private set toolTipIndex(value:number){
			var delta:number = value - this._toolTipIndex;
			this._toolTipIndex = value;
			this.cursorIndex += delta;
		}
		
		private _cursorIndex:number = 0;
		/**
		 * 鼠标样式层结束索引(不包括)
		 */		
		private get cursorIndex():number{
			return this._cursorIndex;
		}
		
		private set cursorIndex(value:number){
			var delta:number = value - this._cursorIndex;
			this._cursorIndex = value;
		}
		
		//==========================================================================
		//                                复写容器操作方法
		//==========================================================================
		/**
		 * @inheritDoc
		 */
		public addElement(element:IVisualElement):IVisualElement{
			var addIndex:number = this._noTopMostIndex;
			if (element.parent == this)
				addIndex--;
			return this.addElementAt(element, addIndex);
		}
		
		/**
		 * @inheritDoc
		 */
		public addElementAt(element:IVisualElement,index:number):IVisualElement{
			if (element.parent==this){
				var oldIndex:number = this.getElementIndex(element);
				if(oldIndex<this._noTopMostIndex)
					this.noTopMostIndex--;
				else if(oldIndex>=this._noTopMostIndex&&oldIndex<this._topMostIndex)
					this.topMostIndex--;
				else if(oldIndex>=this._topMostIndex&&oldIndex<this._toolTipIndex)
					this.toolTipIndex--;
				else 
					this.cursorIndex--;
			}
			
			if(index<=this._noTopMostIndex)
				this.noTopMostIndex++;
			else if(index>this._noTopMostIndex&&index<=this._topMostIndex)
				this.topMostIndex++;
			else if(index>this._topMostIndex&&index<=this._toolTipIndex)
				this.toolTipIndex++;
			else 
				this.cursorIndex++;
			
			return super.addElementAt(element,index);
		}
		
		/**
		 * @inheritDoc
		 */
		public removeElement(element:IVisualElement):IVisualElement{
			return this.removeElementAt(super.getElementIndex(element));
		}
		
		/**
		 * @inheritDoc
		 */
		public removeElementAt(index:number):IVisualElement{
			var element:IVisualElement = super.removeElementAt(index);
			if(index<this._noTopMostIndex)
				this.noTopMostIndex--;
			else if(index>=this._noTopMostIndex&&index<this._topMostIndex)
				this.topMostIndex--;
			else if(index>=this._topMostIndex&&index<this._toolTipIndex)
				this.toolTipIndex--;
			else 
				this.cursorIndex--;
			return element;
		}
		
		/**
		 * @inheritDoc
		 */
		public removeAllElements():void{
			while(this._noTopMostIndex>0){
				super.removeElementAt(0);
				this.noTopMostIndex--;
			}
		}
		
		public elementRemoved(element:IVisualElement, index:number, notifyListeners:boolean=true):void{
			if(notifyListeners){
				//PopUpManager需要监听这个事件
				element.dispatchEvent(new Event("removeFromSystemManager"));
			}
			super.elementRemoved(element,index,notifyListeners);
		}
		
		//==========================================================================
		//                                保留容器原始操作方法
		//==========================================================================
		private raw_getElementAt(index:number):IVisualElement{
			return super.getElementAt(index);
		}
		private raw_addElement(element:IVisualElement):IVisualElement{
			var index:number = super.numElements;
			if (element.parent == this)
				index--;
			return this.raw_addElementAt(element, index);
		}
		private raw_addElementAt(element:IVisualElement, index:number):IVisualElement{
			if (element.parent==this){
				var oldIndex:number = this.getElementIndex(element);
				if(oldIndex<this._noTopMostIndex)
					this.noTopMostIndex--;
				else if(oldIndex>=this._noTopMostIndex&&oldIndex<this._topMostIndex)
					this.topMostIndex--;
				else if(oldIndex>=this._topMostIndex&&oldIndex<this._toolTipIndex)
					this.toolTipIndex--;
				else 
					this.cursorIndex--;
			}
			return super.addElementAt(element,index);
		}
		private raw_removeElement(element:IVisualElement):IVisualElement{
			return super.removeElementAt(super.getElementIndex(element));
		}
		private raw_removeElementAt(index:number):IVisualElement{
			return super.removeElementAt(index);
		}
		private raw_removeAllElements():void{
			while(super.numElements>0){
				super.removeElementAt(0);
			}
		}
		private raw_getElementIndex(element:IVisualElement):number{
			return super.getElementIndex(element);
		}
		private raw_setElementIndex(element:IVisualElement, index:number):void{
			super.setElementIndex(element,index);
		}
		private raw_swapElements(element1:IVisualElement, element2:IVisualElement):void{
			super.swapElementsAt(super.getElementIndex(element1), super.getElementIndex(element2));
		}
		private raw_swapElementsAt(index1:number, index2:number):void{
			super.swapElementsAt(index1,index2);
		}
	}
}