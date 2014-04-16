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

/// <reference path="../../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/events/EventDispatcher.ts"/>
/// <reference path="../../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../../egret/events/TimerEvent.ts"/>
/// <reference path="../../../../egret/geom/Point.ts"/>
/// <reference path="../../../../egret/geom/Rectangle.ts"/>
/// <reference path="../../../../egret/utils/Timer.ts"/>
/// <reference path="../../../../egret/utils/getQualifiedClassName.ts"/>
/// <reference path="../../components/ToolTip.ts"/>
/// <reference path="../../core/UIGlobals.ts"/>
/// <reference path="../../core/IContainer.ts"/>
/// <reference path="../../core/IInvalidating.ts"/>
/// <reference path="../../core/IToolTip.ts"/>
/// <reference path="../../core/IUIComponent.ts"/>
/// <reference path="../../core/IVisualElementContainer.ts"/>
/// <reference path="../../core/PopUpPosition.ts"/>
/// <reference path="../../events/ToolTipEvent.ts"/>
/// <reference path="../ILayoutManagerClient.ts"/>
/// <reference path="../ISystemManager.ts"/>
/// <reference path="../IToolTipManager.ts"/>
/// <reference path="../IToolTipManagerClient.ts"/>
/// <reference path="../../../../../org/flexlite/domUtils/SharedMap.ts"/>

module ns_egret {

	export class ToolTipManagerImpl implements IToolTipManager{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		/**
		 * 初始化完成的标志
		 */		
		private initialized:boolean = false;
		/**
		 * 用于鼠标经过一个对象后计时一段时间开始显示ToolTip
		 */		
		private showTimer:Timer;
		/**
		 * 用于ToolTip显示后计时一段时间自动隐藏。
		 */		
		private hideTimer:Timer;
		/**
		 * 用于当已经显示了一个ToolTip，鼠标快速经过多个显示对象时立即切换显示ToolTip。
		 */		
		private scrubTimer:Timer;
		/**
		 * 当前的toolTipData
		 */		
		private currentTipData:any;
		/**
		 * 上一个ToolTip显示对象
		 */		
		private previousTarget:IToolTipManagerClient;
		
		private _currentTarget:IToolTipManagerClient;
		/**
		 * 当前的IToolTipManagerClient组件
		 */		
		public get currentTarget():IToolTipManagerClient{
			return this._currentTarget;
		}
		
		public set currentTarget(value:IToolTipManagerClient):void{
			this._currentTarget = value;
		}
		
		private _currentToolTip:DisplayObject;
		/**
		 * 当前的ToolTip显示对象；如果未显示ToolTip，则为 null。
		 */		
		public get currentToolTip():IToolTip{
			return <IToolTip> (this._currentToolTip);
		}
		
		public set currentToolTip(value:IToolTip):void{
			this._currentToolTip = <DisplayObject> value;
		}
		
		private _enabled:boolean = true;
		/**
		 * 如果为 true，则当用户将鼠标指针移至组件上方时，ToolTipManager 会自动显示工具提示。
		 * 如果为 false，则不会显示任何工具提示。
		 */		
		public get enabled():boolean {
			return this._enabled;
		}
		
		public set enabled(value:boolean):void{
			if(this._enabled==value)
				return;
			this._enabled = value;
			if(!this._enabled&&this.currentTarget){
				this.currentTarget = null;
				this.targetChanged();
				this.previousTarget = this.currentTarget;
			}
		}
		
		private _hideDelay:number = 10000; 
		/**
		 * 自工具提示出现时起，ToolTipManager要隐藏此提示前所需等待的时间量（以毫秒为单位）。默认值：10000。
		 */		
		public get hideDelay():number {
			return this._hideDelay;
		}
		
		public set hideDelay(value:number):void{
			this._hideDelay = value;
		}
		
		private _scrubDelay:number = 100; 
		/**
		 * 当第一个ToolTip显示完毕后，若在此时间间隔内快速移动到下一个组件上，就直接显示ToolTip而不延迟一段时间。默认值：100。
		 */		
		public get scrubDelay():number {
			return this._scrubDelay;
		}
		
		public set scrubDelay(value:number):void{
			this._scrubDelay = value;
		}
		
		private _showDelay:number = 200;
		/**
		 * 当用户将鼠标移至具有工具提示的组件上方时，等待 ToolTip框出现所需的时间（以毫秒为单位）。
		 * 若要立即显示ToolTip框，请将toolTipShowDelay设为0。默认值：200。
		 */		
		public get showDelay():number {
			return this._showDelay;
		}
		public set showDelay(value:number):void{
			this._showDelay = value;
		}
		
		private _toolTipClass:any = ToolTip;
		/**
		 * 全局默认的创建工具提示要用到的类。
		 */		
		public get toolTipClass():any {
			return this._toolTipClass;
		}
		
		public set toolTipClass(value:any):void{
			this._toolTipClass = value;
		}
		/**
		 * 初始化
		 */		
		private initialize():void{
			if (!this.showTimer){
				this.showTimer = new Timer(0, 1);
				this.showTimer.addEventListener(TimerEvent.TIMER,
					this.showTimer_timerHandler,this);
			}
			
			if (!this.hideTimer){
				this.hideTimer = new Timer(0, 1);
				this.hideTimer.addEventListener(TimerEvent.TIMER,
					this.hideTimer_timerHandler,this);
			}
			
			if (!this.scrubTimer)
				this.scrubTimer = new Timer(0, 1);
			
			this.initialized = true;
		}
		/**
		 * 注册需要显示ToolTip的组件
		 * @param target 目标组件
		 * @param oldToolTip 之前的ToolTip数据
		 * @param newToolTip 现在的ToolTip数据
		 */		
		public registerToolTip(target:DisplayObject,
										oldToolTip:any,
										newToolTip:any):void{
			var hasOld:boolean = oldToolTip!=null&&oldToolTip!="";
			var hasNew:boolean = newToolTip!=null&&newToolTip!="";
			if (!hasOld && hasNew){
				target.addEventListener(TouchEvent.TOUCH_OVER,
					this.toolTipMouseOverHandler,this);
				target.addEventListener(TouchEvent.TOUCH_OUT,
					this.toolTipMouseOutHandler,this);
				if (this.mouseIsOver(target))
					this.showImmediately(target);
			}
			else if (hasOld&&!hasNew){
				target.removeEventListener(TouchEvent.TOUCH_OVER,
					this.toolTipMouseOverHandler);
				target.removeEventListener(TouchEvent.TOUCH_OUT,
					this.toolTipMouseOutHandler);
				if (this.mouseIsOver(target))
					this.hideImmediately(target);
			}
			else if(hasNew&&this.currentToolTip&&this.currentTarget===target){
				this.currentTipData = newToolTip;
				this.initializeTip();
			}
		}
		/**
		 * 检测鼠标是否处于目标对象上
		 */		
		private mouseIsOver(target:DisplayObject):boolean{
			if (!target || !target.stage)
				return false;
			if ((target.stage.mouseX == 0)	 && (target.stage.mouseY == 0))
				return false;
			
			if (target instanceof ILayoutManagerClient && !(<ILayoutManagerClient> target).initialized)
				return false;
			
			return target.hitTestPoint(target.stage.mouseX,
				target.stage.mouseY, true);
		}
		/**
		 * 立即显示ToolTip标志
		 */		
		private showImmediatelyFlag:boolean = false;
		/**
		 * 立即显示目标组件的ToolTip
		 */		
		private showImmediately(target:DisplayObject):void{
			this.showImmediatelyFlag = true;
			this.checkIfTargetChanged(target);
			this.showImmediatelyFlag = false;
		}
		/**
		 * 立即隐藏目标组件的ToolTip
		 */		
		private hideImmediately(target:DisplayObject):void{
			this.checkIfTargetChanged(null);
		}
		/**
		 * 检查当前的鼠标下的IToolTipManagerClient组件是否发生改变
		 */		
		private checkIfTargetChanged(displayObject:DisplayObject):void{
			if (!this.enabled)
				return;
			
			this.findTarget(displayObject);
			
			if (this.currentTarget != this.previousTarget){
				this.targetChanged();
				this.previousTarget = this.currentTarget;
			}
		}
		/**
		 * 向上遍历查询，直到找到第一个当前鼠标下的IToolTipManagerClient组件。
		 */		
		private findTarget(displayObject:DisplayObject):void{
			while (displayObject){
				if (displayObject instanceof IToolTipManagerClient){
					this.currentTipData = (<IToolTipManagerClient> displayObject).toolTip;
					if (this.currentTipData != null){
						this.currentTarget = <IToolTipManagerClient> displayObject;
						return;
					}
				}
				
				displayObject = displayObject.parent;
			}
			
			this.currentTipData = null;
			this.currentTarget = null;
		}

		/**
		 * 当前的IToolTipManagerClient组件发生改变
		 */		
		private targetChanged():void{
			
			if (!this.initialized)
				this.initialize()
			
			var event:ToolTipEvent;
			
			if (this.previousTarget && this.currentToolTip){
				event = new ToolTipEvent(ToolTipEvent.TOOL_TIP_HIDE);
				event.toolTip = this.currentToolTip;
				this.previousTarget.dispatchEvent(event);
			}   
			
			this.reset();
			
			if (this.currentTarget){
				
				if (!this.currentTipData)
					return;
				
				if (this._showDelay==0||this.showImmediatelyFlag||this.scrubTimer.running){
					this.createTip();
					this.initializeTip();
					this.positionTip();
					this.showTip();
				}
				else{
					this.showTimer.delay = this._showDelay;
					this.showTimer.start();
				}
			}
		}
		/**
		 * toolTip实例缓存表
		 */		
		private toolTipCacheMap:SharedMap = new SharedMap;
		/**
		 * 创建ToolTip显示对象
		 */		
		private createTip():void{
			var tipClass:any = this.currentTarget.toolTipClass;
			if(!tipClass){
				tipClass = this.toolTipClass;
			}
			var key:string = getQualifiedClassName(tipClass);
			this.currentToolTip = this.toolTipCacheMap.get(key);
			if(!this.currentToolTip){
				this.currentToolTip = new tipClass();
				this.toolTipCacheMap.set(key,this.currentToolTip);
				if(this.currentToolTip instanceof DisplayObject)
					(<DisplayObject> (this.currentToolTip)).mouseEnabled = false;
				if(this.currentToolTip instanceof DisplayObjectContainer)
					(<DisplayObjectContainer> (this.currentToolTip)).mouseChildren = false;
			}
			this.toolTipContainer.addElement(this.currentToolTip);
		}
		/**
		 * 获取工具提示弹出层
		 */		
		private get toolTipContainer():IContainer{
			var sm:ISystemManager;
			if(this._currentTarget instanceof IUIComponent)
				sm = (<IUIComponent> (this._currentTarget)).systemManager;
			if(!sm)
				sm = UIGlobals.systemManager;
			return sm.toolTipContainer;
		}
		/**
		 * 初始化ToolTip显示对象
		 */		
		private initializeTip():void{
			this.currentToolTip.toolTipData = this.currentTipData;
			
			if (this.currentToolTip instanceof IInvalidating)
				(<IInvalidating> (this.currentToolTip)).validateNow();
		}
		/**
		 * 设置ToolTip位置
		 */		
		private positionTip():void{
			var x:number;
			var y:number;
			var sm:DisplayObjectContainer = this.currentToolTip.parent;
			var toolTipWidth:number = this.currentToolTip.layoutBoundsWidth;
			var toolTipHeight:number = this.currentToolTip.layoutBoundsHeight;
			var rect:Rectangle = (<DisplayObject> (this.currentTarget)).getRect(sm);
			var centerX:number = rect.left+(rect.width - toolTipWidth)*0.5;
			var centetY:number = rect.top+(rect.height - toolTipHeight)*0.5;
			switch(this.currentTarget.toolTipPosition){
				case PopUpPosition.BELOW:
					x = centerX;
					y = rect.bottom;
					break;
				case PopUpPosition.ABOVE:
					x = centerX;
					y = rect.top-toolTipHeight;
					break;
				case PopUpPosition.LEFT:
					x = rect.left-toolTipWidth;
					y = centetY;
					break;
				case PopUpPosition.RIGHT:
					x = rect.right;
					y = centetY;
					break;            
				case PopUpPosition.CENTER:
					x = centerX;
					y = centetY;
					break;            
				case PopUpPosition.TOP_LEFT:
					x = rect.left;
					y = rect.top;
					break;
				default:
					x = sm.mouseX + 10; 
					y = sm.mouseY + 20;
					break;
			}
			var offset:Point = this.currentTarget.toolTipOffset;
			if(offset){
				x += offset.x;
				y = offset.y;
			}
			var screenWidth:number = sm.width;
			var screenHeight:number = sm.height;
			if (x + toolTipWidth > screenWidth)
				x = screenWidth - toolTipWidth;
			if (y + toolTipHeight > screenHeight)
				y = screenHeight - toolTipHeight;
			if(x<0)
				x = 0;
			if(y<0)
				y = 0;
			this.currentToolTip.x = x;
			this.currentToolTip.y = y;
		}
		/**
		 * 显示ToolTip
		 */		
		private showTip():void{
			var event:ToolTipEvent =
				new ToolTipEvent(ToolTipEvent.TOOL_TIP_SHOW);
			event.toolTip = this.currentToolTip;
			this.currentTarget.dispatchEvent(event);
			
			UIGlobals.stage.addEventListener(TouchEvent.TOUCH_BEGAN,
				this.stage_mouseDownHandler,this);
			if (this._hideDelay == 0){
				this.hideTip();
			}
			else if (this._hideDelay < Infinity){
				this.hideTimer.delay = this._hideDelay;
				this.hideTimer.start();
			}
		}
		/**
		 * 隐藏ToolTip
		 */		
		private hideTip():void{
			if (this.previousTarget&&this.currentToolTip){
				var event:ToolTipEvent =
					new ToolTipEvent(ToolTipEvent.TOOL_TIP_HIDE);
				event.toolTip = this.currentToolTip;
				this.previousTarget.dispatchEvent(event);
			}
			
			if (this.previousTarget){
				UIGlobals.stage.removeEventListener(TouchEvent.TOUCH_BEGAN,
					this.stage_mouseDownHandler);
			}
			this.reset();
		}
		
		/**
		 * 移除当前的ToolTip对象并重置所有计时器。
		 */		
		private reset():void{
			this.showTimer.reset();
			this.hideTimer.reset();
			if(this.currentToolTip){
				var tipParent:DisplayObjectContainer = this.currentToolTip.parent;
				if(tipParent instanceof IVisualElementContainer)
					(<IVisualElementContainer> tipParent).removeElement(this.currentToolTip);
				else if(tipParent)
					tipParent.removeChild(this._currentToolTip);
					
				this.currentToolTip = null;
				
				this.scrubTimer.delay = this.scrubDelay;
				this.scrubTimer.reset();
				if (this.scrubDelay > 0){
					this.scrubTimer.delay = this.scrubDelay;
					this.scrubTimer.start();
				}
			}
		}
		/**
		 * 使用指定的ToolTip数据,创建默认的ToolTip类的实例，然后在舞台坐标中的指定位置显示此实例。
		 * 保存此方法返回的对 ToolTip 的引用，以便将其传递给destroyToolTip()方法销毁实例。
		 * @param toolTipData ToolTip数据
		 * @param x 舞台坐标x
		 * @param y 舞台坐标y
		 * @return 创建的ToolTip实例引用
		 */		
		public createToolTip(toolTipData:string, x:number, y:number):IToolTip{
			var toolTip:IToolTip = new <IToolTip> (this.toolTipClass());
			
			this.toolTipContainer.addElement(toolTip);
			
			toolTip.toolTipData = toolTipData;
			
			if (this.currentToolTip instanceof IInvalidating)
				(<IInvalidating> (this.currentToolTip)).validateNow();
			var pos:Point = toolTip.parent.globalToLocal(new Point(x,y));
			toolTip.x = pos.x;
			toolTip.y = pos.y;
			return toolTip;
		}
		
		/**
		 * 销毁由createToolTip()方法创建的ToolTip实例。 
		 * @param toolTip 要销毁的ToolTip实例
		 */		
		public destroyToolTip(toolTip:IToolTip):void{
			var tipParent:DisplayObjectContainer = toolTip.parent;
			if(tipParent instanceof IVisualElementContainer)
				(<IVisualElementContainer> tipParent).removeElement(toolTip);
			else if(tipParent&&toolTip instanceof DisplayObject)
				<DisplayObject> (tipParent.removeChild(toolTip));
		}
		
		/**
		 * 鼠标经过IToolTipManagerClient组件
		 */		
		private toolTipMouseOverHandler(event:TouchEvent):void{
			this.checkIfTargetChanged(<DisplayObject> (event.target));
		}
		/**
		 * 鼠标移出IToolTipManagerClient组件
		 */		
		private toolTipMouseOutHandler(event:TouchEvent):void{
			this.checkIfTargetChanged(event.relatedObject);
		}
		
		/**
		 * 显示ToolTip的计时器触发。
		 */		
		private showTimer_timerHandler(event:TimerEvent):void{
			if (this.currentTarget){
				this.createTip();
				this.initializeTip();
				this.positionTip();
				this.showTip();
			}
		}
		/**
		 * 隐藏ToolTip的计时器触发
		 */		
		private hideTimer_timerHandler(event:TimerEvent):void{
			this.hideTip();
		}
		/**
		 * 舞台上按下鼠标
		 */		
		private stage_mouseDownHandler(event:TouchEvent):void{
			this.reset();
		}
	}
	
}
