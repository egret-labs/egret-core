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
/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../../egret/geom/Point.ts"/>
/// <reference path="../Button.ts"/>
/// <reference path="Range.ts"/>
/// <reference path="../../core/UIGlobals.ts"/>
/// <reference path="../../events/ResizeEvent.ts"/>
/// <reference path="../../events/TrackBaseEvent.ts"/>
/// <reference path="../../events/UIEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.TrackBase
	 * @classdesc
	 * TrackBase类是具有一个轨道和一个或多个滑块按钮的组件的一个基类，如 Slider 和 ScrollBar。
	 * @extends ns_egret.Range
	 */	
	export class TrackBase extends Range{
		/**
		 * @method ns_egret.TrackBase#constructor
		 */
		public constructor(){
			super();
			this.addEventListener(Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
			this.addEventListener(TouchEvent.TOUCH_BEGAN, this.mouseDownHandler, this);
		}
		
		private _slideDuration:number = 300;

		/**
		 * 在轨道上单击以移动滑块时，滑动动画持续的时间（以毫秒为单位）。<br/>
		 * 此属性用于 Slider 和 ScrollBar。对于 Slider，在轨道上的任何单击将导致生成使用此样式的一个动画，同时滑块将移到单击的位置。<br/>
		 * 对于 ScrollBar，仅当按住 Shift 键并单击轨道时才使用此样式，这会导致滑块移到单击的位置。<br/>
		 * 未按下 Shift 键时单击 ScrollBar 轨道将导致出现分页行为。<br/>
		 * 按住 Shift 键并单击时，必须也对 ScrollBar 设置 smoothScrolling 属性才可以实现动画行为。<br/>
		 * 此持续时间是整个滑过轨道的总时间，实际滚动会根据距离相应缩短。
		 * @member ns_egret.TrackBase#slideDuration
		 */		
		public get slideDuration():number{
			return this._slideDuration;
		}

		public set slideDuration(value:number){
			this._slideDuration = value;
		}

		
		/**
		 * [SkinPart]实体滑块组件
		 * @member ns_egret.TrackBase#thumb
		 */		
		public thumb:Button;
		
		/**
		 * [SkinPart]实体轨道组件
		 * @member ns_egret.TrackBase#track
		 */
		public track:Button;

        /**
         * 最大有效值
		 * @member ns_egret.TrackBase#maximum
         */
        public get maximum():number {
            return this._maximum;
        }
		/**
		 * @inheritDoc
		 */
		public set maximum(value:number){
			if (value == this._maximum)
				return;
			
			this._setMaximun(value);
			this.invalidateDisplayList();
		}
        /**
         * 最小有效值
		 * @member ns_egret.TrackBase#minimum
         */
        public get minimum():number {
            return this._minimum;
        }

        /**
		 * @inheritDoc
		 */
		public set minimum(value:number){
			if (value == this._minimum)
				return;
			
			this._setMinimun(value);
			this.invalidateDisplayList();
		}
        /**
         * 此范围的当前值。
		 * @member ns_egret.TrackBase#value
         */
        public get value():number {
            return this._getValue();
        }
		/**
		 * @inheritDoc
		 */
		public set value(newValue:number){
			if (newValue == this._getValue())
				return;
			
			this._setValue(newValue);
			this.invalidateDisplayList();
		}
		
		/**
		 * @method ns_egret.TrackBase#setValue
		 * @param value {number} 
		 */
		public setValue(value:number):void{
			super.setValue(value);
			this.invalidateDisplayList();
		}
		
		/**
		 * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值。 
		 * @method ns_egret.TrackBase#pointToValue
		 * @param x {number} 相对于轨道原点的位置的x坐标。
		 * @param y {number} 相对于轨道原点的位置的y坐标。
		 * @returns {number}
		 */		
		public pointToValue(x:number, y:number):number{
			return this.minimum;
		}
		
		
		/**
		 * @method ns_egret.TrackBase#changeValueByStep
		 * @param increase {boolean} 
		 */
		public changeValueByStep(increase:boolean = true):void{
			var prevValue:number = this.value;
			
			super.changeValueByStep(increase);
			
			if (this.value != prevValue)
				this.dispatchEvent(new Event(Event.CHANGE));
		}
		
		/**
		 * @method ns_egret.TrackBase#partAdded
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.thumb){
				this.thumb.addEventListener(TouchEvent.TOUCH_BEGAN, this.thumb_mouseDownHandler, this);
				this.thumb.addEventListener(ResizeEvent.RESIZE, this.thumb_resizeHandler, this);
				this.thumb.addEventListener(UIEvent.UPDATE_COMPLETE, this.thumb_updateCompleteHandler, this);
				this.thumb.stickyHighlighting = true;
			}
			else if (instance == this.track){
				this.track.addEventListener(TouchEvent.TOUCH_BEGAN, this.track_mouseDownHandler, this);
				this.track.addEventListener(ResizeEvent.RESIZE, this.track_resizeHandler, this);
			}
		}
		
		/**
		 * @method ns_egret.TrackBase#partRemoved
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName, instance);
			
			if (instance == this.thumb){
				this.thumb.removeEventListener(TouchEvent.TOUCH_BEGAN, this.thumb_mouseDownHandler, this);
				this.thumb.removeEventListener(ResizeEvent.RESIZE, this.thumb_resizeHandler, this);            
				this.thumb.removeEventListener(UIEvent.UPDATE_COMPLETE, this.thumb_updateCompleteHandler, this);            
			}
			else if (instance == this.track){
				this.track.removeEventListener(TouchEvent.TOUCH_BEGAN, this.track_mouseDownHandler, this);
				this.track.removeEventListener(ResizeEvent.RESIZE, this.track_resizeHandler, this);
			}
		}
		
		/**
		 * @method ns_egret.TrackBase#updateDisplayList
		 * @param w {number} 
		 * @param h {number} 
		 */
		public updateDisplayList(w:number, h:number):void{
			super.updateDisplayList(w, h);
			this.updateSkinDisplayList();
		}
		
		/**
		 * 记录鼠标在thumb上按下的位置
		 */		
		public _clickOffsetX:number;
		public _clickOffsetY:number;

		/**
		 * 更新皮肤部件（通常为滑块）的大小和可见性。<br/>
		 * 子类覆盖此方法以基于 minimum、maximum 和 value 属性更新滑块的大小、位置和可见性。 
		 * @method ns_egret.TrackBase#updateSkinDisplayList
		 */		
		public updateSkinDisplayList():void {
		}
		
		/**
		 * 添加到舞台时
		 */		
		private addedToStageHandler(event:Event):void{
			this.updateSkinDisplayList();
		}
		
		/**
		 * 轨道尺寸改变事件
		 */		
		private track_resizeHandler(event:Event):void{
			this.updateSkinDisplayList();
		}
		
		/**
		 * 滑块尺寸改变事件
		 */		
		private thumb_resizeHandler(event:Event):void{
			this.updateSkinDisplayList();
		}
		
		/**
		 * 滑块三个阶段的延迟布局更新完毕事件
		 */		
		private thumb_updateCompleteHandler(event:Event):void{
			this.updateSkinDisplayList();
			this.thumb.removeEventListener(UIEvent.UPDATE_COMPLETE, this.thumb_updateCompleteHandler, this);
		}
		
		/**
		 * 滑块按下事件
		 * @method ns_egret.TrackBase#thumb_mouseDownHandler
		 * @param event {TouchEvent} 
		 */		
		public thumb_mouseDownHandler(event:TouchEvent):void{        
			UIGlobals.stage.addEventListener(TouchEvent.TOUCH_MOVE,this.stage_mouseMoveHandler,this);
			UIGlobals.stage.addEventListener(TouchEvent.TOUCH_END,this.stage_mouseUpHandler,this);
			UIGlobals.stage.addEventListener(Event.LEAVE_STAGE,this.stage_mouseUpHandler,this);
			this.addEventListener(Event.ENTER_FRAME,this.onEnterFrame,this);
			
			var clickOffset:Point = this.thumb.globalToLocal(event.stageX, event.stageY);
            this._clickOffsetX = clickOffset.x;
            this._clickOffsetY = clickOffset.y;

			this.dispatchEvent(new TrackBaseEvent(TrackBaseEvent.THUMB_PRESS));
			this.dispatchEvent(new UIEvent(UIEvent.CHANGE_START));
		}
		
		/**
		 * 当鼠标拖动thumb时，需要更新value的标记。
		 */		
		private needUpdateValue:boolean = false;
		/**
		 * 拖动thumb过程中触发的EnterFrame事件
		 */		
		private onEnterFrame(event:Event):void{
			if(!this.needUpdateValue||!this.track)
				return;
			this.updateWhenMouseMove();
			this.needUpdateValue = false;
		}
		
		/**
		 * 当thumb被拖动时更新值，此方法每帧只被调用一次，比直接在鼠标移动事件里更新性能更高。
		 * @method ns_egret.TrackBase#updateWhenMouseMove
		 */		
		public updateWhenMouseMove():void{
			if(!this.track)
				return;
			var p:Point = this.track.globalToLocal(this._moveStageX, this._moveStageY);
			var newValue:number = this.pointToValue(p.x - this._clickOffsetX, p.y - this._clickOffsetY);
			newValue = this.nearestValidValue(newValue, this.snapInterval);
			
			if (newValue != this.value){
				this.setValue(newValue); 
				this.validateDisplayList();
				this.dispatchEvent(new TrackBaseEvent(TrackBaseEvent.THUMB_DRAG));
				this.dispatchEventWith(Event.CHANGE);
			}
		}

        public _moveStageX:number;
        public _moveStageY:number;

		/**
		 * 鼠标移动事件
		 * @method ns_egret.TrackBase#stage_mouseMoveHandler
		 * @param event {TouchEvent} 
		 */		
		public stage_mouseMoveHandler(event:TouchEvent):void{
            this._moveStageX = event.stageX;
            this._moveStageY = event.stageY;
			if (this.needUpdateValue)
				return;
			this.needUpdateValue = true;
		}
		
		/**
		 * 鼠标弹起事件
		 * @method ns_egret.TrackBase#stage_mouseUpHandler
		 * @param event {Event} 
		 */		
		public stage_mouseUpHandler(event:Event):void{
			UIGlobals.stage.removeEventListener(TouchEvent.TOUCH_MOVE, 
				this.stage_mouseMoveHandler, 
				this);
			UIGlobals.stage.removeEventListener(TouchEvent.TOUCH_END, 
				this.stage_mouseUpHandler, 
				this);
			UIGlobals.stage.addEventListener(Event.LEAVE_STAGE,
				this.stage_mouseUpHandler,
				this);
			this.removeEventListener(Event.ENTER_FRAME,this.updateWhenMouseMove,this);
			if(this.needUpdateValue){
				this.updateWhenMouseMove();
				this.needUpdateValue = false;
			}
			this.dispatchEvent(new TrackBaseEvent(TrackBaseEvent.THUMB_RELEASE));
			this.dispatchEvent(new UIEvent(UIEvent.CHANGE_END));
		}
		
		/**
		 * 轨道被按下事件
		 * @method ns_egret.TrackBase#track_mouseDownHandler
		 * @param event {TouchEvent} 
		 */		
		public track_mouseDownHandler(event:TouchEvent):void { 
		}
		
		private mouseDownTarget:DisplayObject;
		
		/**
		 * 当在组件上按下鼠标时记录被按下的子显示对象
		 */		
		private mouseDownHandler(event:TouchEvent):void{
			UIGlobals.stage.addEventListener(TouchEvent.TOUCH_END, this.system_mouseUpSomewhereHandler, this);
			UIGlobals.stage.addEventListener(Event.LEAVE_STAGE, this.system_mouseUpSomewhereHandler, this);
			
			this.mouseDownTarget = <DisplayObject> (event.target);      
		}
		
		/**
		 * 当鼠标弹起时，若不是在mouseDownTarget上弹起，而是另外的子显示对象上弹起时，额外抛出一个鼠标单击事件。
		 */		
		private system_mouseUpSomewhereHandler(event:Event):void{
			UIGlobals.stage.removeEventListener(TouchEvent.TOUCH_END, this.system_mouseUpSomewhereHandler, this);
			UIGlobals.stage.removeEventListener(Event.LEAVE_STAGE,this.system_mouseUpSomewhereHandler,this);
			if (this.mouseDownTarget != event.target && event instanceof TouchEvent && this.contains(<DisplayObject> (event.target))){ 
				var mEvent:TouchEvent = <TouchEvent> event;

                var mousePoint:Point = (<DisplayObject> (event.target)).localToGlobal(mEvent.localX, mEvent.localY);

                var touchEvent:TouchEvent = new TouchEvent(TouchEvent.TOUCH_TAP, mEvent.bubbles,mEvent.cancelable,
                    mEvent.touchPointID,mousePoint.x,mousePoint.y,mEvent.ctrlKey,mEvent.altKey,mEvent.shiftKey,mEvent.touchDown);
				this.dispatchEvent(touchEvent);
			}
			
			this.mouseDownTarget = null;
		}
	}
	
}