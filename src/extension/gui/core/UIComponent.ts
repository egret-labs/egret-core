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
/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/geom/Point.ts"/>
/// <reference path="../events/MoveEvent.ts"/>
/// <reference path="../events/PropertyChangeEvent.ts"/>
/// <reference path="../events/ResizeEvent.ts"/>
/// <reference path="../events/UIEvent.ts"/>
/// <reference path="../managers/ILayoutManagerClient.ts"/>
/// <reference path="../managers/ISystemManager.ts"/>
/// <reference path="../managers/IToolTipManagerClient.ts"/>
/// <reference path="../managers/ToolTipManager.ts"/>
/// <reference path="UIGlobals.ts"/>

module ns_egret {

	export class UIComponent extends DisplayObjectContainer 
		implements IUIComponent,ILayoutManagerClient,ILayoutElement,
		IInvalidating,IVisualElement,IToolTipManagerClient{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
			this.addEventListener(Event.ADDED_TO_STAGE,this.onAddedToStage,this);
			this.addEventListener(Event.ADDED_TO_STAGE,this.checkInvalidateFlag,this);
		}
		
		/**
		 * 添加到舞台
		 */		
		private onAddedToStage(e:Event):void{
			this.removeEventListener(Event.ADDED_TO_STAGE,this.onAddedToStage);
			this.initialize();
			UIGlobals.initlize(this.stage);
			if(this._nestLevel>0)
				this.checkInvalidateFlag();
		}
		
		private _id:string;
		/**
		 * 组件 ID。此值将作为对象的实例名称，因此不应包含任何空格或特殊字符。应用程序中的每个组件都应具有唯一的 ID。 
		 */		
		public get id():string{
			return this._id;
		}
		
		public set id(value:string):void{
			this._id = value;
		}
		
		private _toolTip:any;
		/**
		 * @inheritDoc
		 */
		public get toolTip():any{
			return this._toolTip;
		}
		public set toolTip(value:any):void{
			if(value==this._toolTip)
				return;
			var oldValue:any = this._toolTip;
			this._toolTip = value;
			
			ToolTipManager.registerToolTip(this, oldValue, value);
			
			this.dispatchEvent(new Event("toolTipChanged"));
		}
		
		private _toolTipClass:any;
		/**
		 * @inheritDoc
		 */
		public get toolTipClass():any{
			return this._toolTipClass;
		}
		public set toolTipClass(value:any):void{
			if(value==this._toolTipClass)
				return;
			this._toolTipClass = value;
		}
		
		private _toolTipOffset:Point;
		/**
		 * @inheritDoc
		 */
		public get toolTipOffset():Point{
			return this._toolTipOffset;
		}
		
		public set toolTipOffset(value:Point):void{
			this._toolTipOffset = value;
		}
		
		private _toolTipPosition:string = "mouse";
		/**
		 * @inheritDoc
		 */
		public get toolTipPosition():string{
			return this._toolTipPosition;
		}

		public set toolTipPosition(value:string):void{
			this._toolTipPosition = value;
		}

		private _isPopUp:boolean;
		/**
		 * @inheritDoc
		 */
		public get isPopUp():boolean{
			return this._isPopUp;
		}
		public set isPopUp(value:boolean):void{
			this._isPopUp = value;
		}
		
		private _owner:any;
		/**
		 * @inheritDoc
		 */
		public get owner():any{
			return this._owner? this._owner : this.parent;
		}
		/**
		 * @inheritDoc
		 */
		public ownerChanged(value:any):void{
			this._owner = value;
		}
		
		private _systemManager:ISystemManager;
		/**
		 * @inheritDoc
		 */
		public get systemManager():ISystemManager{
			if(!this._systemManager){
				if(this instanceof ISystemManager){
					this._systemManager = <ISystemManager> this;
				}
				else{
					var o:DisplayObjectContainer = this.parent;
					while (o){
						var ui:IUIComponent = <IUIComponent> o;
						if (ui){
							this._systemManager = ui.systemManager;
							break;
						}
						else if (o instanceof ISystemManager){
							this._systemManager = <ISystemManager> o;
							break;
						}
						o = o.parent;
					}
				}
			}
			return this._systemManager;
		}
		public set systemManager(value:ISystemManager):void{
			this._systemManager = value;
			var length:number = this.numChildren;
			for(var i:number=0;i<length;i++){
				var ui:IUIComponent = <IUIComponent> (this.getChildAt(i));
				if(ui)
					ui.systemManager = value;
			}
		}
		
		private _updateCompletePendingFlag:boolean = false;
		/**
		 * @inheritDoc
		 */		
		public get updateCompletePendingFlag():boolean{
			return this._updateCompletePendingFlag;
		}		
		public set updateCompletePendingFlag(value:boolean):void{
			this._updateCompletePendingFlag = value;
		}
		
		private _initialized:boolean = false;
		
		/**
		 * @inheritDoc
		 */
		public get initialized():boolean{
			return this._initialized;
		}
		public set initialized(value:boolean):void{
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
		 */
		public initialize():void{
			if(this.initializeCalled)
				return;
			if(UIGlobals.stage){
				this.removeEventListener(Event.ADDED_TO_STAGE,this.onAddedToStage);
			}
			this.initializeCalled = true;
			this.dispatchEvent(new UIEvent(UIEvent.INITIALIZE));
			this.createChildren();
			this.childrenCreated();
		}
		/**
		 * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
		 * 请务必调用super.createChildren()以完成父类组件的初始化
		 */		
		public createChildren():void{
			
		}		
		/**
		 * 子项创建完成
		 */		
		public childrenCreated():void{
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		
		private _nestLevel:number = 0;
		/**
		 * @inheritDoc
		 */	
		public get nestLevel():number{
			return this._nestLevel;
		}
		
		public set nestLevel(value:number):void{
			if(this._nestLevel==value)
				return;
			this._nestLevel = value;
			
			if(this._nestLevel==0)
				this.addEventListener(Event.ADDED_TO_STAGE,this.checkInvalidateFlag,this);
			else
				this.removeEventListener(Event.ADDED_TO_STAGE,this.checkInvalidateFlag);
			
			for(var i:number=this.numChildren-1;i>=0;i--){
				var child:ILayoutManagerClient = <ILayoutManagerClient> (this.getChildAt(i));
				if(child!=null){
					child.nestLevel = this._nestLevel+1;
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public addChild(child:DisplayObject):DisplayObject{
			this.addingChild(child);
			super.addChild(child);
			this._childAdded(child);
			return child;
		}
		
		/**
		 * @inheritDoc
		 */
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			this.addingChild(child);
			super.addChildAt(child,index);
			this._childAdded(child);
			return child;
		}
		
		/**
		 * 即将添加一个子项
		 */		
		public addingChild(child:DisplayObject):void{
			if(child instanceof ILayoutManagerClient){
				(<ILayoutManagerClient> child).nestLevel = this._nestLevel+1;
			}
		}
		
		/**
		 * 已经添加一个子项
		 */		
		public _childAdded(child:DisplayObject):void{
			if(child instanceof UIComponent){
				(<UIComponent> child).initialize();
				(<UIComponent> child).checkInvalidateFlag();
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public removeChild(child:DisplayObject):DisplayObject{
			super.removeChild(child);
			this._childRemoved(child);
			return child;
		}
		
		/**
		 * @inheritDoc
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
			if(child instanceof ILayoutManagerClient){
				(<ILayoutManagerClient> child).nestLevel = 0;
			}
			if(child instanceof IUIComponent){
				(<IUIComponent> child).systemManager = null;
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

		
		private _enabled:boolean = true;
		/**
		 * @inheritDoc
		 */
		public get enabled():boolean{
			return this._enabled;
		}
		
		public set enabled(value:boolean):void{
			if(this._enabled==value)
				return;
			this._enabled = value;
			this.dispatchEvent(new Event("enabledChanged"));
		}
		
		/**
		 * 属性提交前组件旧的宽度
		 */	
		public oldWidth:number;
			
		private _explicitWidth:number = NaN;
		/**
		 * @inheritDoc
		 */
		public get explicitWidth():number{
			return this._explicitWidth;
		}
		
		
		public _width:number;
		/**
		 * 组件宽度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
		 */		
		public set width(value:number):void{
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
		 * @inheritDoc
		 */
		public get width():number{
			return this.escapeNaN(this._width);
		}
		
		
		/**
		 * 属性提交前组件旧的高度
		 */
		public oldHeight:number;
		
		private _explicitHeight:number = NaN;
		/**
		 * @inheritDoc
		 */	
		public get explicitHeight():number{
			return this._explicitHeight;
		}
		
		
		public _height:number;
		/**
		 * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
		 */		
		public set height(value:number):void{
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
		 * @inheritDoc
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
		 * @inheritDoc
		 */
		public set scaleX(value:number):void{
			if(super.scaleX == value)
				return;
			super.scaleX = value;
			this.invalidateParentSizeAndDisplayList();
		}
		/**
		 * @inheritDoc
		 */
		public set scaleY(value:number):void{
			if(super.scaleY == value)
				return;
			super.scaleY = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		private _minWidth:number = 0;
		/**
		 * @inheritDoc
		 */
		public get minWidth():number{
			return this._minWidth;
		}
		public set minWidth(value:number):void{
			if(this._minWidth==value)
				return;
			this._minWidth = value;
			this.invalidateSize();
		}
		
		private _maxWidth:number = 10000;
		/**
		 * @inheritDoc
		 */
		public get maxWidth():number{
			return this._maxWidth;
		}
		public set maxWidth(value:number):void{
			if(this._maxWidth==value)
				return;
			this._maxWidth = value;
			this.invalidateSize();
		}
		
		private _minHeight:number = 0;
		/**
		 * @inheritDoc
		 */
		public get minHeight():number{
			return this._minHeight;
		}
		public set minHeight(value:number):void{
			if(this._minHeight==value)
				return;
			this._minHeight = value;
			this.invalidateSize();
		}
		
		private _maxHeight:number = 10000;
		/**
		 * @inheritDoc
		 */
		public get maxHeight():number{
			return this._maxHeight;
		}
		public set maxHeight(value:number):void{
			if(this._maxHeight==value)
				return;
			this._maxHeight = value;
			this.invalidateSize();
		}
		
		
		
		private _measuredWidth:number = 0;
		/**
		 * 组件的默认宽度（以像素为单位）。此值由 measure() 方法设置。
		 */		
		public get measuredWidth():number{
			return this._measuredWidth;
		}
		public set measuredWidth(value:number):void{
			this._measuredWidth = value;
		}
		
		private _measuredHeight:number = 0;
		/**
		 * 组件的默认高度（以像素为单位）。此值由 measure() 方法设置。
		 */
		public get measuredHeight():number{
			return this._measuredHeight;
		}
		public set measuredHeight(value:number):void{
			this._measuredHeight = value;
		}
		/**
		 * @inheritDoc
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
		 */
		public oldX:number;
		
		/**
		 * @inheritDoc
		 */
		public set x(value:number):void{
			if(this.x==value)
				return;
			super.x = value;
			this.invalidateProperties();
			if (this._includeInLayout&&this.parent && this.parent instanceof UIComponent)
				(<UIComponent> (this.parent)).childXYChanged();
		}
		
		/**
		 * 属性提交前组件旧的Y
		 */
		public oldY:number;
		
		/**
		 * @inheritDoc
		 */
		public set y(value:number):void{
			if(this.y==value)
				return;
			super.y = value;
			this.invalidateProperties();
			if (this._includeInLayout&&this.parent && this.parent instanceof UIComponent)
				(<UIComponent> (this.parent)).childXYChanged();
		}
		
		public invalidatePropertiesFlag:boolean = false;
		/**
		 * @inheritDoc
		 */		
		public invalidateProperties():void{
			if (!this.invalidatePropertiesFlag){
				this.invalidatePropertiesFlag = true;
				
				if (this.parent&&UIGlobals.layoutManager)
					UIGlobals.layoutManager.invalidateProperties(this);
			}
		}
		/**
		 * @inheritDoc
		 */		
		public validateProperties():void{
			if (this.invalidatePropertiesFlag){
				this.commitProperties();
				
				this.invalidatePropertiesFlag = false;
			}
		}
		
		public invalidateSizeFlag:boolean = false;
		
		/**
		 * @inheritDoc
		 */	
		public invalidateSize():void{
			if (!this.invalidateSizeFlag){
				this.invalidateSizeFlag = true;
				
				if (this.parent&&UIGlobals.layoutManager)
					UIGlobals.layoutManager.invalidateSize(this);
			}
		}
		
		/**
		 * @inheritDoc
		 */	
		public validateSize(recursive:boolean = false):void{
			if (recursive){
				for (var i:number = 0; i < this.numChildren; i++){
					var child:DisplayObject = this.getChildAt(i);
					if (child instanceof ILayoutManagerClient )
						(<ILayoutManagerClient> child ).validateSize(true);
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
		 */		
		public oldPreferWidth:number;
		/**
		 * 上一次测量的首选高度
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
		
		public invalidateDisplayListFlag:boolean = false;
		
		/**
		 * @inheritDoc
		 */		
		public invalidateDisplayList():void{
			if (!this.invalidateDisplayListFlag){
				this.invalidateDisplayListFlag = true;
				
				if (this.parent&&UIGlobals.layoutManager)
					UIGlobals.layoutManager.invalidateDisplayList(this);
			}
		}
		
		/**
		 * @inheritDoc
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
		
		public validateNowFlag:boolean = false;
		
		/**
		 * @inheritDoc
		 */	
		public validateNow(skipDisplayList:boolean = false):void{
			if(!this.validateNowFlag&&UIGlobals.layoutManager!=null)
				UIGlobals.layoutManager.validateClient(this,skipDisplayList);
			else
				this.validateNowFlag = true;
		}
		/**
		 * 标记父级容器的尺寸和显示列表为失效
		 */		
		public invalidateParentSizeAndDisplayList():void{
			if (!this.parent||!this._includeInLayout)
				return;
			var p:IInvalidating = <IInvalidating> (this.parent);
			if (!p)
				return;
			p.invalidateSize();
			p.invalidateDisplayList();
		}
		
		/**
		 * 更新显示列表
		 */		
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
		}
		
		/**
		 * 是否可以跳过测量尺寸阶段,返回true则不执行measure()方法
		 */		
		public canSkipMeasurement():boolean{
			return !isNaN(this._explicitWidth) && !isNaN(this._explicitHeight);
		}
		
		/**
		 * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
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
		 * @param prop 改变的属性名
		 * @param oldValue 属性的原始值
		 * @param value 属性的新值
		 */		
		public dispatchPropertyChangeEvent(prop:string, oldValue:any,
													   value:any):void{
			if (this.hasEventListener("propertyChange"))
				this.dispatchEvent(PropertyChangeEvent.createUpdateEvent(
					this, prop, oldValue, value));
		}
		
		public _includeInLayout:boolean = true;
		/**
		 * @inheritDoc
		 */
		public get includeInLayout():boolean{
			return this._includeInLayout;
		}
		public set includeInLayout(value:boolean):void{
			if(this._includeInLayout==value)
				return;
			this._includeInLayout = true;
			this.invalidateParentSizeAndDisplayList();
			this._includeInLayout = value;
		}

		
		private _left:number;
		
		/**
		 * @inheritDoc
		 */
		public get left():number{
			return this._left;
		}
		public set left(value:number):void{
			if(this._left == value)
				return;
			this._left = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		private _right:number;
		/**
		 * @inheritDoc
		 */
		public get right():number{
			return this._right;
		}
		public set right(value:number):void{
			if(this._right == value)
				return;
			this._right = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		private _top:number;
		/**
		 * @inheritDoc
		 */
		public get top():number{
			return this._top;
		}
		public set top(value:number):void{
			if(this._top == value)
				return;
			this._top = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		private _bottom:number;
		/**
		 * @inheritDoc
		 */	
		public get bottom():number{
			return this._bottom;
		}
		public set bottom(value:number):void{
			if(this._bottom == value)
				return;
			this._bottom = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		
		private _horizontalCenter:number;
		/**
		 * @inheritDoc
		 */
		public get horizontalCenter():number{
			return this._horizontalCenter;
		}
		public set horizontalCenter(value:number):void{
			if(this._horizontalCenter == value)
				return;
			this._horizontalCenter = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		private _verticalCenter:number;
		/**
		 * @inheritDoc
		 */
		public get verticalCenter():number{
			return this._verticalCenter;
		}
		public set verticalCenter(value:number):void{
			if(this._verticalCenter == value)
				return;
			this._verticalCenter = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		
		private _percentWidth:number;
		/**
		 * @inheritDoc
		 */
		public get percentWidth():number{
			return this._percentWidth;
		}
		public set percentWidth(value:number):void{
			if(this._percentWidth == value)
				return;
			this._percentWidth = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		
		private _percentHeight:number;
		
		/**
		 * @inheritDoc
		 */
		public get percentHeight():number{
			return this._percentHeight;
		}
		public set percentHeight(value:number):void{
			if(this._percentHeight == value)
				return;
			this._percentHeight = value;
			this.invalidateParentSizeAndDisplayList();
		}
		
		/**
		 * 父级布局管理器设置了组件的宽度标志，尺寸设置优先级：自动布局>显式设置>自动测量
		 */
		public layoutWidthExplicitlySet:boolean = false;
		
		/**
		 * 父级布局管理器设置了组件的高度标志，尺寸设置优先级：自动布局>显式设置>自动测量
		 */
		public layoutHeightExplicitlySet:boolean = false;
		
		/**
		 * @inheritDoc
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
		 * @inheritDoc
		 */	
		public setLayoutBoundsPosition(x:number,y:number):void{
			var changed:boolean = false;
			if(this.x!=x){
				super.x = x;
				changed = true;
			}
			if(this.y!=y){
				super.y = y;
				changed = true;
			}
			if(changed){
				this.dispatchMoveEvent();
			}
		}
		
		/**
		 * @inheritDoc
		 */		
		public get preferredWidth():number{
			var w:number = isNaN(this._explicitWidth) ? this.measuredWidth:this._explicitWidth;
			if(isNaN(w))
				return 0;
			return w*this.scaleX;
		}
		
		/**
		 * @inheritDoc
		 */
		public get preferredHeight():number{
			var h:number = isNaN(this._explicitHeight) ? this.measuredHeight : this._explicitHeight;
			if(isNaN(h))
				return 0;
			return h*this.scaleY;
		}
		
		/**
		 * @inheritDoc
		 */	
		public get preferredX():number{
			return super.x;
		}
		
		/**
		 * @inheritDoc
		 */
		public get preferredY():number{
			return super.y;
		}
		/**
		 * @inheritDoc
		 */
		public get layoutBoundsX():number{
			return super.x;
		}
		/**
		 * @inheritDoc
		 */
		public get layoutBoundsY():number{
			return super.y;
		}
		
		/**
		 * @inheritDoc
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
		
		private _focusEnabled:boolean = false;
		/**
		 * @inheritDoc
		 */		
		public get focusEnabled():boolean{
			return this._focusEnabled;
		}
		public set focusEnabled(value:boolean):void{
			this._focusEnabled = value;
		}
		/**
		 * @inheritDoc
		 */		
		public setFocus():void{
			if(UIGlobals.stage){
				UIGlobals.stage.focus = this;
			}
		}
		
	}
}