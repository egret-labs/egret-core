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

/// <reference path="../../../egret/display/StageAlign.ts"/>
/// <reference path="../../../egret/display/StageScaleMode.ts"/>
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/events/EventPhase.ts"/>
/// <reference path="../../../egret/events/FullScreenEvent.ts"/>
/// <reference path="../../../egret/events/KeyboardEvent.ts"/>
/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../egret/ui/Keyboard.ts"/>
/// <reference path="../components/Group.ts"/>
/// <reference path="../core/UIGlobals.ts"/>
/// <reference path="../core/IContainer.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../core/IVisualElementContainer.ts"/>
/// <reference path="../layouts/BasicLayout.ts"/>
/// <reference path="../layouts/supportClasses/LayoutBase.ts"/>
/// <reference path="../utils/callLater.ts"/>

module ns_egret {

	export class SystemManager extends Group implements ISystemManager{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
			this.addEventListener(Event.ADDED_TO_STAGE,this.onAddToStage,this);
			this.addEventListener(Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
			this.addEventListener(KeyboardEvent.KEY_DOWN, this.keyDownHandler, this, true, 1000);
			this.addEventListener(TouchEvent.MOUSE_WHEEL, this.mouseEventHandler, this, true, 1000);
			this.addEventListener(TouchEvent.TOUCH_BEGAN, this.mouseEventHandler, this, true, 1000);
		}
		/**
		 * 添加到舞台
		 */		
		private onAddToStage(event:Event=null):void{
			var systemManagers:Vector.<ISystemManager> = UIGlobals._systemManagers;
			if(systemManagers.length==0){
				this.stage.scaleMode = StageScaleMode.NO_SCALE;
				this.stage.align = StageAlign.TOP_LEFT;
				this.stage.stageFocusRect=false;
			}
			var index:number = systemManagers.indexOf(this);
			if(index==-1)
				systemManagers.push(this);
			if(this._autoResize){
				this.stage.addEventListener(Event.RESIZE,this.onResize,this);
				this.stage.addEventListener(FullScreenEvent.FULL_SCREEN,this.onResize,this);
				this.onResize();
			}
		}
		/**
		 * 从舞台移除
		 */		
		private onRemoveFromStage(event:Event):void{
			var systemManagers:Vector.<ISystemManager> = UIGlobals._systemManagers;
			var index:number = systemManagers.indexOf(this);
			if(index!=-1)
				systemManagers.splice(index,1);
			if(this._autoResize){
				this.stage.removeEventListener(Event.RESIZE,this.onResize,this);
				this.stage.removeEventListener(FullScreenEvent.FULL_SCREEN,this.onResize,this);
			}
		}
		
		/**
		 * 舞台尺寸改变
		 */		
		private onResize(event:Event=null):void{
			super.width = this.stage.stageWidth;
			super.height = this.stage.stageHeight;
		}
		/**
		 * @inheritDoc
		 */
		public addEventListener(type:string, listener:Function,
												  useCapture:boolean = false,
												  priority:number = 0,
												  useWeakReference:boolean = true/*将弱引用的默认值改成true*/):void{
			super.addEventListener(type,listener,this,useCapture,priority,useWeakReference);
		}
		
		/**
		 * 过滤鼠标事件为可以取消的
		 */		
		private mouseEventHandler(e:TouchEvent):void{
			if (!e.cancelable&&e.eventPhase!=EventPhase.BUBBLING_PHASE){
				e.stopImmediatePropagation();
				var cancelableEvent:TouchEvent = null;
				if ("clickCount" in e){
					var mouseEventClass:any = TouchEvent;
					
					cancelableEvent = new mouseEventClass(e.type, e.bubbles, true, e.localX,
						e.localY, e.relatedObject, e.ctrlKey, e.altKey,
						e.shiftKey, e.touchDown, e.delta, 
						e["commandKey"], e["controlKey"], e["clickCount"]);
				}
				else{
					cancelableEvent = new TouchEvent(e.type, e.bubbles, true, e.localX, 
						e.localY, e.relatedObject, e.ctrlKey, e.altKey,
						e.shiftKey, e.touchDown, e.delta);
				}
				
				e.target.dispatchEvent(cancelableEvent);               
			}
		}
		
		/**
		 * 过滤键盘事件为可以取消的
		 */		
		private keyDownHandler(e:KeyboardEvent):void{
			if (!e.cancelable){
				switch (e.keyCode){
					case Keyboard.UP:
					case Keyboard.DOWN:
					case Keyboard.PAGE_UP:
					case Keyboard.PAGE_DOWN:
					case Keyboard.HOME:
					case Keyboard.END:
					case Keyboard.LEFT:
					case Keyboard.RIGHT:
					case Keyboard.ENTER:{
						e.stopImmediatePropagation();
						var cancelableEvent:KeyboardEvent =
							new KeyboardEvent(e.type, e.bubbles, true, e.charCode, e.keyCode, 
								e.keyLocation, e.ctrlKey, e.altKey, e.shiftKey)              
						e.target.dispatchEvent(cancelableEvent);
					}
				}
			}
		}
		
		private _autoResize:boolean = true;
		/**
		 * 是否自动跟随舞台缩放。当此属性为true时，将强制让SystemManager始终与舞台保持相同大小。
		 * 反之需要外部手动同步大小。默认值为true。
		 */
		public get autoResize():boolean{
			return this._autoResize;
		}
		
		public set autoResize(value:boolean){
			if(this._autoResize==value)
				return;
			this._autoResize = value;
			if(!this.stage)
				return;
			if(this._autoResize){
				this.stage.addEventListener(Event.RESIZE,this.onResize,this);
				this.stage.addEventListener(FullScreenEvent.FULL_SCREEN,this.onResize,this);
			}
			else{
				this.stage.removeEventListener(Event.RESIZE,this.onResize,this);
				this.stage.removeEventListener(FullScreenEvent.FULL_SCREEN,this.onResize,this);
			}
		}
		
		//==========================================================================
		//                            禁止外部布局顶级容器
		//==========================================================================
		/**
		 * @inheritDoc
		 */
		public set x(value:number){
			if(this._autoResize)
				return;
			super.x = value;
		}
		/**
		 * @inheritDoc
		 */
		public set y(value:number){
			if(this._autoResize)
				return;
			super.y = value;
		}
		/**
		 * @inheritDoc
		 */
		public set width(value:number){
			if(this._autoResize)
				return;
			super.width = value;
		}
		/**
		 * @inheritDoc
		 */
		public set height(value:number){
			if(this._autoResize)
				return;
			super.height = value;
		}
		/**
		 * @inheritDoc
		 */
		public set scaleX(value:number){
			if(this._autoResize)
				return;
			super.scaleX = value;
		}
		/**
		 * @inheritDoc
		 */
		public set scaleY(value:number){
			if(this._autoResize)
				return;
			super.scaleY = value;
		}
		/**
		 * @inheritDoc
		 */
		public setActualSize(w:number, h:number):void{
			if(this._autoResize)
				return;
			super.setActualSize(w,h);
		}
		/**
		 * @inheritDoc
		 */
		public setLayoutBoundsPosition(x:number, y:number):void{
			if(this._autoResize)
				return;
			super.setLayoutBoundsPosition(x,y);
		}
		/**
		 * @inheritDoc
		 */
		public setLayoutBoundsSize(layoutWidth:number, layoutHeight:number):void{
			if(this._autoResize)
				return;
			super.setLayoutBoundsSize(layoutWidth,layoutHeight);
		}
		/**
		 * 布局对象,SystemManager只接受BasicLayout
		 */		
		public get layout():LayoutBase{
			return super.layout;
		}
		public set layout(value:LayoutBase){
			if(value instanceof BasicLayout)
				super.layout = value;
		}
		
		private _popUpContainer:SystemContainer;
		/**
		 * 弹出窗口层容器。
		 */		
		public get popUpContainer():IContainer{
			if (!this._popUpContainer){
				this._popUpContainer = new SystemContainer(this,
					new QName(this.dx_internal, "noTopMostIndex"),
					new QName(this.dx_internal, "topMostIndex"));
			}
			
			return this._popUpContainer;
		}
		
		private _toolTipContainer:SystemContainer;
		/**
		 * 工具提示层容器。
		 */		
		public get toolTipContainer():IContainer{
			if (!this._toolTipContainer){
				this._toolTipContainer = new SystemContainer(this,
					new QName(this.dx_internal, "topMostIndex"),
					new QName(this.dx_internal, "toolTipIndex"));
			}
			
			return this._toolTipContainer;
		}
		
		private _cursorContainer:SystemContainer;
		/**
		 * 鼠标样式层容器。
		 */		
		public get cursorContainer():IContainer{
			if (!this._cursorContainer){
				this._cursorContainer = new SystemContainer(this,
					new QName(this.dx_internal, "toolTipIndex"),
					new QName(this.dx_internal, "cursorIndex"));
			}
			
			return this._cursorContainer;
		}
		
		private _noTopMostIndex:number = 0;
		/**
		 * 弹出窗口层的起始索引(包括)
		 */		
		public get noTopMostIndex():number{
			return this._noTopMostIndex;
		}
		
		public set noTopMostIndex(value:number){
			var delta:number = value - this._noTopMostIndex;
			this._noTopMostIndex = value;
			this.topMostIndex += delta;
		}
		
		private _topMostIndex:number = 0;
		/**
		 * 弹出窗口层结束索引(不包括)
		 */		
		public get topMostIndex():number{
			return this._topMostIndex;
		}
		
		public set topMostIndex(value:number){
			var delta:number = value - this._topMostIndex;
			this._topMostIndex = value;
			this.toolTipIndex += delta;
		}
		
		private _toolTipIndex:number = 0;
		/**
		 * 工具提示层结束索引(不包括)
		 */		
		public get toolTipIndex():number{
			return this._toolTipIndex;
		}
		
		public set toolTipIndex(value:number){
			var delta:number = value - this._toolTipIndex;
			this._toolTipIndex = value;
			this.cursorIndex += delta;
		}
		
		private _cursorIndex:number = 0;
		/**
		 * 鼠标样式层结束索引(不包括)
		 */		
		public get cursorIndex():number{
			return this._cursorIndex;
		}
		
		public set cursorIndex(value:number){
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
		
		/**
		 * @inheritDoc
		 */
		public containsElement(element:IVisualElement):boolean{
			if (super.containsElement(element)){
				if (element.parent == this){
					var elementIndex:number = super.getElementIndex(element);
					if (elementIndex < this._noTopMostIndex)
						return true;
				}
				else{
					for (var i:number = 0; i < this._noTopMostIndex; i++){
						var myChild:IVisualElement = super.getElementAt(i);
						if (myChild is IVisualElementContainer){
							if ((<IVisualElementContainer> myChild).containsElement(element))
								return true;
						}
					}
				}
			}
			return false;
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
		public get raw_numElements():number{
			return super.numElements;
		}
		public raw_getElementAt(index:number):IVisualElement{
			return super.getElementAt(index);
		}
		public raw_addElement(element:IVisualElement):IVisualElement{
			var index:number = super.numElements;
			if (element.parent == this)
				index--;
			return this.raw_addElementAt(element, index);
		}
		public raw_addElementAt(element:IVisualElement, index:number):IVisualElement{
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
		public raw_removeElement(element:IVisualElement):IVisualElement{
			return super.removeElementAt(super.getElementIndex(element));
		}
		public raw_removeElementAt(index:number):IVisualElement{
			return super.removeElementAt(index);
		}
		public raw_removeAllElements():void{
			while(super.numElements>0){
				super.removeElementAt(0);
			}
		}
		public raw_getElementIndex(element:IVisualElement):number{
			return super.getElementIndex(element);
		}
		public raw_setElementIndex(element:IVisualElement, index:number):void{
			super.setElementIndex(element,index);
		}
		public raw_swapElements(element1:IVisualElement, element2:IVisualElement):void{
			super.swapElementsAt(super.getElementIndex(element1), super.getElementIndex(element2));
		}
		public raw_swapElementsAt(index1:number, index2:number):void{
			super.swapElementsAt(index1,index2);
		}
		public raw_containsElement(element:IVisualElement):boolean{
			return super.containsElement(element);
		}
	}
}