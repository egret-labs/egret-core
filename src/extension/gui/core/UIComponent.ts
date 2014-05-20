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

/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="IInvalidating.ts"/>
/// <reference path="ILayoutElement.ts"/>
/// <reference path="IUIComponent.ts"/>
/// <reference path="IVisualElement.ts"/>
/// <reference path="UIGlobals.ts"/>
/// <reference path="../events/MoveEvent.ts"/>
/// <reference path="../events/PropertyChangeEvent.ts"/>
/// <reference path="../events/ResizeEvent.ts"/>
/// <reference path="../events/UIEvent.ts"/>
/// <reference path="../managers/ILayoutManagerClient.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.UIComponent
	 * @classdesc
	 * 显示对象基类
	 * @extends ns_egret.DisplayObjectContainer
	 * @implements ns_egret.IUIComponent
	 * @implements ns_egret.ILayoutManagerClient
	 * @implements ns_egret.ILayoutElement
	 * @implements ns_egret.IInvalidating
	 * @implements ns_egret.IVisualElement
	 */
	export class UIComponent extends DisplayObjectContainer
		implements IUIComponent,ILayoutManagerClient,ILayoutElement,
		IInvalidating,IVisualElement{
		/**
		 * 构造函数
		 * @method ns_egret.UIComponent#constructor
		 */		
		public constructor(){
			super();
            this.touchEnabled = true;
			this.addEventListener(Event.ADDED_TO_STAGE,this.onAddedToStage,this);
			this.addEventListener(Event.ADDED_TO_STAGE,this.checkInvalidateFlag,this);
		}
		
		/**
		 * 添加到舞台
		 */		
		private onAddedToStage(e:Event):void{
			this.removeEventListener(Event.ADDED_TO_STAGE,this.onAddedToStage,this);
			this.initialize();
			UIGlobals.initlize(this.stage);
			if(this._nestLevel>0)
				this.checkInvalidateFlag();
		}
		
		private _id:string;
		/**
		 * 组件 ID。此值将作为对象的实例名称，因此不应包含任何空格或特殊字符。应用程序中的每个组件都应具有唯一的 ID。 
		 * @constant ns_egret.UIComponent#id
		 */		
		public get id():string{
			return this._id;
		}
		
		public set id(value:string){
			this._id = value;
		}

		private _isPopUp:boolean;
		/**
		 * @member ns_egret.UIComponent#isPopUp
		 */
		public get isPopUp():boolean{
			return this._isPopUp;
		}
		public set isPopUp(value:boolean){
			this._isPopUp = value;
		}
		
		private _owner:any;
		/**
		 * @member ns_egret.UIComponent#owner
		 */
		public get owner():any{
			return this._owner? this._owner : this.parent;
		}
		/**
		 * @method ns_egret.UIComponent#ownerChanged
		 * @param value {any} 
		 */
		public ownerChanged(value:any):void{
			this._owner = value;
		}

		
		private _updateCompletePendingFlag:boolean = false;
		/**
		 * @member ns_egret.UIComponent#updateCompletePendingFlag
		 */		
		public get updateCompletePendingFlag():boolean{
			return this._updateCompletePendingFlag;
		}		
		public set updateCompletePendingFlag(value:boolean){
			this._updateCompletePendingFlag = value;
		}
		
		private _initialized:boolean = false;
		
		/**
		 * @member ns_egret.UIComponent#initialized
		 */
		public get initialized():boolean{
			return this._initialized;
		}
		public set initialized(value:boolean){
			if(this._initialized==value)
				return;
			this._initialized = value;
			if (value){
				this.dispatchEvent(new UIEvent(UIEvent.CREATION_COMPLETE));
			}
		}
		/**
		 * initialize()方法被调用过的标志。
		 */		
		private initializeCalled:boolean = false;
		/**
		 * 初始化组件
		 * @method ns_egret.UIComponent#initialize
		 */
		public initialize():void{
			if(this.initializeCalled)
				return;
			if(UIGlobals.stage){
				this.removeEventListener(Event.ADDED_TO_STAGE,this.onAddedToStage,this);
			}
			this.initializeCalled = true;
			this.dispatchEvent(new UIEvent(UIEvent.INITIALIZE));
			this.createChildren();
			this.childrenCreated();
		}
		/**
		 * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
		 * 请务必调用super.createChildren()以完成父类组件的初始化
		 * @method ns_egret.UIComponent#createChildren
		 */		
		public createChildren():void{
			
		}		
		/**
		 * 子项创建完成
		 * @method ns_egret.UIComponent#childrenCreated
		 */		
		private childrenCreated():void{
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		
		private _nestLevel:number = 0;
		/**
		 * @member ns_egret.UIComponent#nestLevel
		 */	
		public get nestLevel():number{
			return this._nestLevel;
		}
		
		public set nestLevel(value:number){
			if(this._nestLevel==value)
				return;
			this._nestLevel = value;
			
			if(this._nestLevel==0)
				this.addEventListener(Event.ADDED_TO_STAGE,this.checkInvalidateFlag,this);
			else
				this.removeEventListener(Event.ADDED_TO_STAGE,this.checkInvalidateFlag,this);
			
			for(var i:number=this.numChildren-1;i>=0;i--){
				var child:ILayoutManagerClient = <ILayoutManagerClient><any> (this.getChildAt(i));
				if(child!=null){
					child.nestLevel = this._nestLevel+1;
				}
			}
		}
		
		/**
		 * @method ns_egret.UIComponent#addChild
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */
		public addChild(child:DisplayObject):DisplayObject{
			this.addingChild(child);
			super.addChild(child);
			this._childAdded(child);
			return child;
		}
		
		/**
		 * @method ns_egret.UIComponent#addChildAt
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			this.addingChild(child);
			super.addChildAt(child,index);
			this._childAdded(child);
			return child;
		}
		
		/**
		 * 即将添加一个子项
		 * @method ns_egret.UIComponent#addingChild
		 * @param child {DisplayObject} 
		 */		
		public addingChild(child:DisplayObject):void{
			if(child&&"nestLevel" in child){
				(<ILayoutManagerClient><any>child).nestLevel = this._nestLevel+1;
			}
		}
		
		/**
		 * 已经添加一个子项
		 */		
		public _childAdded(child:DisplayObject):void{
			if(child instanceof UIComponent){
				(<UIComponent><any> child).initialize();
				(<UIComponent><any> child).checkInvalidateFlag();
			}
		}
		
		/**
		 * @method ns_egret.UIComponent#removeChild
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */
		public removeChild(child:DisplayObject):DisplayObject{
			super.removeChild(child);
			this._childRemoved(child);
			return child;
		}
		
		/**
		 * @method ns_egret.UIComponent#removeChildAt
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */
		public removeChildAt(index:number):DisplayObject{
			var child:DisplayObject = super.removeChildAt(index);
			this._childRemoved(child);
			return child;
		}
		
		/**
		 * 已经移除一个子项
		 */
		public _childRemoved(child:DisplayObject):void{
			if(child&&"nestLevel" in child){
				(<ILayoutManagerClient> <any>child).nestLevel = 0;
			}
		}

		/**
		 * 检查属性失效标记并应用
		 */		
		private checkInvalidateFlag(event:Event=null):void{
			if(!UIGlobals.layoutManager)
				return;
			if(this.invalidatePropertiesFlag){
				UIGlobals.layoutManager.invalidateProperties(this);
			}
			if(this.invalidateSizeFlag){
				UIGlobals.layoutManager.invalidateSize(this);
			}
			if(this.invalidateDisplayListFlag){
				UIGlobals.layoutManager.invalidateDisplayList(this);
			}
			if(this.validateNowFlag){
				UIGlobals.layoutManager.validateClient(this);
				this.validateNowFlag = false;
			}
		}

		
		public _enabled:boolean = true;
		/**
		 * @member ns_egret.UIComponent#enabled
		 */
		public get enabled():boolean{
			return this._enabled;
		}
		
		public set enabled(value:boolean){
			this._enabled = value;
		}
		
		/**
		 * 属性提交前组件旧的宽度
		 * @member ns_egret.UIComponent#oldWidth
		 */	
		public oldWidth:number;

		public _width:number;
		/**
		 * 组件宽度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
		 */		
		public set width(value:number){
			this._setWidth(value);
		}

        public _setWidth(value:number):void{
            if(this._width==value&&this._explicitWidth==value)
                return;
            this._width = value;
            this._explicitWidth = value;
            this.invalidateProperties();
            this.invalidateDisplayList();
            this.invalidateParentSizeAndDisplayList();
            if(isNaN(value))
                this.invalidateSize();
        }
		
		/**
		 * @member ns_egret.UIComponent#width
		 */
		public get width():number{
			return this.escapeNaN(this._width);
		}
		
		
		/**
		 * 属性提交前组件旧的高度
		 * @member ns_egret.UIComponent#oldHeight
		 */
		public oldHeight:number;
		
		public _height:number;
		/**
		 * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
		 */		
		public set height(value:number){
			this._setHeight(value);
		}

        public _setHeight(value:number):void{
            if(this._height==value&&this._explicitHeight==value)
                return;
            this._height = value;
            this._explicitHeight = value;
            this.invalidateProperties();
            this.invalidateDisplayList();
            this.invalidateParentSizeAndDisplayList();
            if(isNaN(value))
                this.invalidateSize();
        }
		
		/**
		 * @member ns_egret.UIComponent#height
		 */
		public get height():number{
			return this.escapeNaN(this._height);
		}
		/**
		 * 过滤NaN数字
		 */		
		private escapeNaN(number:number):number{
			if(isNaN(number))
				return 0;
			return number;
		}

		/**
		 * @member ns_egret.UIComponent#scaleX
		 */
        public get scaleX():number{
            return this._scaleX;
        }
		/**
		 * @inheritDoc
		 */
		public set scaleX(value:number){
			this._setScaleX(value);
		}

        public _setScaleX(value:number):void{
            if(this._scaleX == value)
                return;
            this._scaleX = value;
            this.invalidateParentSizeAndDisplayList();
        }

		/**
		 * @member ns_egret.UIComponent#scaleY
		 */
        public get scaleY():number{
            return this._scaleY;
        }
		/**
		 * @inheritDoc
		 */
		public set scaleY(value:number){
			this._setScaleY(value);
		}

        public _setScaleY(value:number):void{
            if(this._scaleY == value)
                return;
            this._scaleY = value;
            this.invalidateParentSizeAndDisplayList();
        }
		
		private _minWidth:number = 0;
		/**
		 * @member ns_egret.UIComponent#minWidth
		 */
		public get minWidth():number{
			return this._minWidth;
		}
		public set minWidth(value:number){
			if(this._minWidth==value)
				return;
			this._minWidth = value;
			this.invalidateSize();
		}
		
		private _maxWidth:number = 10000;
		/**
		 * @member ns_egret.UIComponent#maxWidth
		 */
		public get maxWidth():number{
			return this._maxWidth;
		}
		public set maxWidth(value:number){
			if(this._maxWidth==value)
				return;
			this._maxWidth = value;
			this.invalidateSize();
		}
		
		private _minHeight:number = 0;
		/**
		 * @member ns_egret.UIComponent#minHeight
		 */
		public get minHeight():number{
			return this._minHeight;
		}
		public set minHeight(value:number){
			if(this._minHeight==value)
				return;
			this._minHeight = value;
			this.invalidateSize();
		}
		
		private _maxHeight:number = 10000;
		/**
		 * @member ns_egret.UIComponent#maxHeight
		 */
		public get maxHeight():number{
			return this._maxHeight;
		}
		public set maxHeight(value:number){
			if(this._maxHeight==value)
				return;
			this._maxHeight = value;
			this.invalidateSize();
		}
		
		
		
		private _measuredWidth:number = 0;
		/**
		 * 组件的默认宽度（以像素为单位）。此值由 measure() 方法设置。
		 * @member ns_egret.UIComponent#measuredWidth
		 */		
		public get measuredWidth():number{
			return this._measuredWidth;
		}
		public set measuredWidth(value:number){
			this._measuredWidth = value;
		}
		
		private _measuredHeight:number = 0;
		/**
		 * 组件的默认高度（以像素为单位）。此值由 measure() 方法设置。
		 * @member ns_egret.UIComponent#measuredHeight
		 */
		public get measuredHeight():number{
			return this._measuredHeight;
		}
		public set measuredHeight(value:number){
			this._measuredHeight = value;
		}
		/**
		 * @method ns_egret.UIComponent#setActualSize
		 * @param w {number} 
		 * @param h {number} 
		 */
		public setActualSize(w:number, h:number):void{
			var change:boolean = false;
			if(this._width != w){
				this._width = w;
				change = true;
			}
			if(this._height != h){
				this._height = h;
				change = true;
			}
			if(change){
				this.invalidateDisplayList();
				this.dispatchResizeEvent();
			}
		}
		
		/**
		 * 属性提交前组件旧的X
		 * @member ns_egret.UIComponent#oldX
		 */
		public oldX:number;
		/**
		 * @constant ns_egret.UIComponent#x
		 */
        public get x():number {
            return this._x;
        }
		/**
		 * @inheritDoc
		 */
		public set x(value:number){
			if(this._x==value)
				return;
			this._x = value;
			this.invalidateProperties();
			if (this._includeInLayout&&this.parent && this.parent instanceof UIComponent)
				(<UIComponent><any> (this.parent)).childXYChanged();
		}
		
		/**
		 * 属性提交前组件旧的Y
		 * @member ns_egret.UIComponent#oldY
		 */
		public oldY:number;
		/**
		 * @constant ns_egret.UIComponent#y
		 */
        public get y():number {
            return this._y;
        }
		/**
		 * @inheritDoc
		 */
		public set y(value:number){
			if(this._y==value)
				return;
			this._y = value;
			this.invalidateProperties();
			if (this._includeInLayout&&this.parent && this.parent instanceof UIComponent)
				(<UIComponent> (this.parent)).childXYChanged();
		}
		
		/**
		 * @member ns_egret.UIComponent#invalidatePropertiesFlag
		 */
		public invalidatePropertiesFlag:boolean = false;
		/**
		 * @method ns_egret.UIComponent#invalidateProperties
		 */		
		public invalidateProperties():void{
			if (!this.invalidatePropertiesFlag){
				this.invalidatePropertiesFlag = true;
				
				if (this.parent&&UIGlobals.layoutManager)
					UIGlobals.layoutManager.invalidateProperties(this);
			}
		}
		/**
		 * @method ns_egret.UIComponent#validateProperties
		 */		
		public validateProperties():void{
			if (this.invalidatePropertiesFlag){
				this.commitProperties();
				
				this.invalidatePropertiesFlag = false;
			}
		}
		
		/**
		 * @member ns_egret.UIComponent#invalidateSizeFlag
		 */
		public invalidateSizeFlag:boolean = false;
		
		/**
		 * @method ns_egret.UIComponent#invalidateSize
		 */	
		public invalidateSize():void{
			if (!this.invalidateSizeFlag){
				this.invalidateSizeFlag = true;
				
				if (this.parent&&UIGlobals.layoutManager)
					UIGlobals.layoutManager.invalidateSize(this);
			}
		}
		
		/**
		 * @method ns_egret.UIComponent#validateSize
		 * @param recursive {boolean} 
		 */	
		public validateSize(recursive:boolean = false):void{
			if (recursive){
				for (var i:number = 0; i < this.numChildren; i++){
					var child:DisplayObject = this.getChildAt(i);
					if ("validateSize" in child)
						(<ILayoutManagerClient> <any>child ).validateSize(true);
				}
			}
			if (this.invalidateSizeFlag){
				var changed:boolean = this.measureSizes();
				if(changed){
					this.invalidateDisplayList();
					this.invalidateParentSizeAndDisplayList();
				}
				this.invalidateSizeFlag = false;
			}
		}
		/**
		 * 上一次测量的首选宽度
		 * @member ns_egret.UIComponent#oldPreferWidth
		 */		
		public oldPreferWidth:number;
		/**
		 * 上一次测量的首选高度
		 * @member ns_egret.UIComponent#oldPreferHeight
		 */		
		public oldPreferHeight:number;
		/**
		 * 测量组件尺寸，返回尺寸是否发生变化
		 */		
		private measureSizes():boolean{
			var changed:boolean = false;
			
			if (!this.invalidateSizeFlag)
				return changed;
			
			if (!this.canSkipMeasurement()){
				this.measure();
				if(this.measuredWidth<this.minWidth){
					this.measuredWidth = this.minWidth;
				}
				if(this.measuredWidth>this.maxWidth){
					this.measuredWidth = this.maxWidth;
				}
				if(this.measuredHeight<this.minHeight){
					this.measuredHeight = this.minHeight;
				}
				if(this.measuredHeight>this.maxHeight){
					this.measuredHeight = this.maxHeight
				}
			}
			if(isNaN(this.oldPreferWidth)){
				this.oldPreferWidth = this.preferredWidth;
				this.oldPreferHeight = this.preferredHeight;
				changed = true;
			}
			else{
				if(this.preferredWidth!=this.oldPreferWidth||this.preferredHeight!=this.oldPreferHeight)
					changed = true;
				this.oldPreferWidth = this.preferredWidth;
				this.oldPreferHeight = this.preferredHeight;
			}
			return changed;
		}
		
		/**
		 * @member ns_egret.UIComponent#invalidateDisplayListFlag
		 */
		public invalidateDisplayListFlag:boolean = false;
		
		/**
		 * @method ns_egret.UIComponent#invalidateDisplayList
		 */		
		public invalidateDisplayList():void{
			if (!this.invalidateDisplayListFlag){
				this.invalidateDisplayListFlag = true;
				
				if (this.parent&&UIGlobals.layoutManager)
					UIGlobals.layoutManager.invalidateDisplayList(this);
			}
		}
		
		/**
		 * @method ns_egret.UIComponent#validateDisplayList
		 */		
		public validateDisplayList():void{
			if (this.invalidateDisplayListFlag){
				var unscaledWidth:number = 0;
				var unscaledHeight:number = 0;
				if(this.layoutWidthExplicitlySet){
					unscaledWidth = this._width;
				}
				else if(!isNaN(this.explicitWidth)){
					unscaledWidth = this._explicitWidth;
				}
				else{
					unscaledWidth = this.measuredWidth;
				}
				if(this.layoutHeightExplicitlySet){
					unscaledHeight = this._height;
				}
				else if(!isNaN(this.explicitHeight)){
					unscaledHeight = this._explicitHeight;
				}
				else{
					unscaledHeight = this.measuredHeight;
				}
				if(isNaN(unscaledWidth))
					unscaledWidth = 0;
				if(isNaN(unscaledHeight))
					unscaledHeight = 0;
				this.setActualSize(unscaledWidth,unscaledHeight);
				this.updateDisplayList(unscaledWidth,unscaledHeight);
				this.invalidateDisplayListFlag = false;
			}
		}
		
		/**
		 * @member ns_egret.UIComponent#validateNowFlag
		 */
		public validateNowFlag:boolean = false;
		
		/**
		 * @method ns_egret.UIComponent#validateNow
		 * @param skipDisplayList {boolean} 
		 */	
		public validateNow(skipDisplayList:boolean = false):void{
			if(!this.validateNowFlag&&UIGlobals.layoutManager!=null)
				UIGlobals.layoutManager.validateClient(this,skipDisplayList);
			else
				this.validateNowFlag = true;
		}
		/**
		 * 标记父级容器的尺寸和显示列表为失效
		 * @method ns_egret.UIComponent#invalidateParentSizeAndDisplayList
		 */		
		public invalidateParentSizeAndDisplayList():void{
			if (!this.parent||!this._includeInLayout||!("invalidateSize" in this.parent))
				return;
			var p:IInvalidating = <IInvalidating><any>(this.parent);
			p.invalidateSize();
			p.invalidateDisplayList();
		}
		
		/**
		 * 更新显示列表
		 * @method ns_egret.UIComponent#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
		 */		
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
		}
		
		/**
		 * 是否可以跳过测量尺寸阶段,返回true则不执行measure()方法
		 * @method ns_egret.UIComponent#canSkipMeasurement
		 * @returns {boolean}
		 */		
		public canSkipMeasurement():boolean{
			return !isNaN(this._explicitWidth) && !isNaN(this._explicitHeight);
		}
		
		/**
		 * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
		 * @method ns_egret.UIComponent#commitProperties
		 */		
		public commitProperties():void{
			if(this.oldWidth != this._width||this.oldHeight != this._height){
				this.dispatchResizeEvent();
			}
			if(this.oldX != this.x||this.oldY != this.y){
				this.dispatchMoveEvent();
			}
		}
		/**
		 * 测量组件尺寸
		 * @method ns_egret.UIComponent#measure
		 */		
		public measure():void{
			this._measuredHeight = 0;
			this._measuredWidth = 0;
		}
		/**
		 *  抛出移动事件
		 */
		private dispatchMoveEvent():void{
			if (this.hasEventListener(MoveEvent.MOVE)){
				var moveEvent:MoveEvent = new MoveEvent(MoveEvent.MOVE,this.oldX,this.oldY);
				this.dispatchEvent(moveEvent);
			}
			this.oldX = this.x;
			this.oldY = this.y;
		}
		
		/**
		 * 子项的xy位置发生改变
		 * @method ns_egret.UIComponent#childXYChanged
		 */		
		public childXYChanged():void{
			
		}
		
		/**
		 *  抛出尺寸改变事件
		 */
		private dispatchResizeEvent():void{
			if (this.hasEventListener(ResizeEvent.RESIZE)){
				var resizeEvent:ResizeEvent = new ResizeEvent(ResizeEvent.RESIZE,this.oldWidth,this.oldHeight);
				this.dispatchEvent(resizeEvent);
			}
			this.oldWidth = this._width;
			this.oldHeight = this._height;
		}
		
		/**
		 * 抛出属性值改变事件
		 * @method ns_egret.UIComponent#dispatchPropertyChangeEvent
		 * @param prop {string} 改变的属性名
		 * @param oldValue {any} 属性的原始值
		 * @param value {any} 属性的新值
		 */		
		public dispatchPropertyChangeEvent(prop:string, oldValue:any,
													   value:any):void{
			if (this.hasEventListener("propertyChange"))
				this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(
					this, prop, oldValue, value));
		}
		
		public _includeInLayout:boolean = true;
		/**
		 * @member ns_egret.UIComponent#includeInLayout
		 */
		public get includeInLayout():boolean{
			return this._includeInLayout;
		}
		public set includeInLayout(value:boolean){
			if(this._includeInLayout==value)
				return;
			this._includeInLayout = true;
			this.invalidateParentSizeAndDisplayList();
			this._includeInLayout = value;
		}

		
		private _left:number;
		
		/**
		 * @member ns_egret.UIComponent#left
		 */
		public get left():number{
			return this._left;
		}
		public set left(value:number){
			if(this._left == value)
				return;
			this._left = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		private _right:number;
		/**
		 * @member ns_egret.UIComponent#right
		 */
		public get right():number{
			return this._right;
		}
		public set right(value:number){
			if(this._right == value)
				return;
			this._right = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		private _top:number;
		/**
		 * @member ns_egret.UIComponent#top
		 */
		public get top():number{
			return this._top;
		}
		public set top(value:number){
			if(this._top == value)
				return;
			this._top = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		private _bottom:number;
		/**
		 * @member ns_egret.UIComponent#bottom
		 */	
		public get bottom():number{
			return this._bottom;
		}
		public set bottom(value:number){
			if(this._bottom == value)
				return;
			this._bottom = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		
		private _horizontalCenter:number;
		/**
		 * @member ns_egret.UIComponent#horizontalCenter
		 */
		public get horizontalCenter():number{
			return this._horizontalCenter;
		}
		public set horizontalCenter(value:number){
			if(this._horizontalCenter == value)
				return;
			this._horizontalCenter = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		private _verticalCenter:number;
		/**
		 * @member ns_egret.UIComponent#verticalCenter
		 */
		public get verticalCenter():number{
			return this._verticalCenter;
		}
		public set verticalCenter(value:number){
			if(this._verticalCenter == value)
				return;
			this._verticalCenter = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		
		private _percentWidth:number;
		/**
		 * @member ns_egret.UIComponent#percentWidth
		 */
		public get percentWidth():number{
			return this._percentWidth;
		}
		public set percentWidth(value:number){
			if(this._percentWidth == value)
				return;
			this._percentWidth = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		
		private _percentHeight:number;
		
		/**
		 * @member ns_egret.UIComponent#percentHeight
		 */
		public get percentHeight():number{
			return this._percentHeight;
		}
		public set percentHeight(value:number){
			if(this._percentHeight == value)
				return;
			this._percentHeight = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		/**
		 * 父级布局管理器设置了组件的宽度标志，尺寸设置优先级：自动布局>显式设置>自动测量
		 * @member ns_egret.UIComponent#layoutWidthExplicitlySet
		 */
		public layoutWidthExplicitlySet:boolean = false;
		
		/**
		 * 父级布局管理器设置了组件的高度标志，尺寸设置优先级：自动布局>显式设置>自动测量
		 * @member ns_egret.UIComponent#layoutHeightExplicitlySet
		 */
		public layoutHeightExplicitlySet:boolean = false;
		
		/**
		 * @method ns_egret.UIComponent#setLayoutBoundsSize
		 * @param layoutWidth {number} 
		 * @param layoutHeight {number} 
		 */	
		public setLayoutBoundsSize(layoutWidth:number,layoutHeight:number):void{
			layoutWidth /= this.scaleX;
			layoutHeight /= this.scaleY;
			if(isNaN(layoutWidth)){
				this.layoutWidthExplicitlySet = false;
				layoutWidth = this.preferredWidth;
			}
			else{
				this.layoutWidthExplicitlySet = true;
			}
			if(isNaN(layoutHeight)){
				this.layoutHeightExplicitlySet = false;
				layoutHeight = this.preferredHeight;
			}
			else{
				this.layoutHeightExplicitlySet = true;
			}
			
			this.setActualSize(layoutWidth,layoutHeight);
		}
		/**
		 * @method ns_egret.UIComponent#setLayoutBoundsPosition
		 * @param x {number} 
		 * @param y {number} 
		 */	
		public setLayoutBoundsPosition(x:number,y:number):void{
			var changed:boolean = false;
			if(this._x!=x){
				this._x = x;
				changed = true;
			}
			if(this._y!=y){
				this._y = y;
				changed = true;
			}
			if(changed){
				this.dispatchMoveEvent();
			}
		}
		
		/**
		 * @member ns_egret.UIComponent#preferredWidth
		 */		
		public get preferredWidth():number{
			var w:number = isNaN(this._explicitWidth) ? this.measuredWidth:this._explicitWidth;
			if(isNaN(w))
				return 0;
			return w*this.scaleX;
		}
		
		/**
		 * @member ns_egret.UIComponent#preferredHeight
		 */
		public get preferredHeight():number{
			var h:number = isNaN(this._explicitHeight) ? this.measuredHeight : this._explicitHeight;
			if(isNaN(h))
				return 0;
			return h*this.scaleY;
		}
		
		/**
		 * @member ns_egret.UIComponent#preferredX
		 */	
		public get preferredX():number{
			return this._x;
		}
		
		/**
		 * @member ns_egret.UIComponent#preferredY
		 */
		public get preferredY():number{
			return this._y;
		}
		/**
		 * @member ns_egret.UIComponent#layoutBoundsX
		 */
		public get layoutBoundsX():number{
			return this._x;
		}
		/**
		 * @member ns_egret.UIComponent#layoutBoundsY
		 */
		public get layoutBoundsY():number{
			return this._y;
		}
		
		/**
		 * @member ns_egret.UIComponent#layoutBoundsWidth
		 */	
		public get layoutBoundsWidth():number{
			var w:number =  0;
			if(this.layoutWidthExplicitlySet){
				w = this._width;
			}
			else if(!isNaN(this.explicitWidth)){
				w = this._explicitWidth;
			}
			else{
				w = this.measuredWidth;
			}
			return this.escapeNaN(w*this.scaleX);
		}
		/**
		 * 组件的布局高度,常用于父级的updateDisplayList()方法中
		 * 按照：布局高度>外部显式设置高度>测量高度 的优先级顺序返回高度
		 * @member ns_egret.UIComponent#layoutBoundsHeight
		 */		
		public get layoutBoundsHeight():number{
			var h:number =  0
			if(this.layoutHeightExplicitlySet){
				h = this._height;
			}
			else if(!isNaN(this.explicitHeight)){
				h = this._explicitHeight;
			}
			else{
				h = this.measuredHeight;
			}
			return this.escapeNaN(h*this.scaleY);
		}
	}
}