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
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="supportClasses/Animation.ts"/>
/// <reference path="../core/IViewport.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../core/IVisualElementContainer.ts"/>
/// <reference path="../core/UIComponent.ts"/>
/// <reference path="../core/UIGlobals.ts"/>

module ns_egret {

	export class Scroller extends UIComponent implements IVisualElementContainer{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		
		/**
		 * @inheritDoc
		 */
		public measure():void{
            if(!this._viewport)
                return;
			this.measuredWidth = this._viewport.preferredWidth;
			this.measuredHeight = this._viewport.preferredHeight;
		}
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			this._viewport.setLayoutBoundsSize(unscaledWidth,unscaledHeight);
		}

		private _viewport:IViewport;
		
		/**
		 * 要滚动的视域组件。 
		 */		
		public get viewport():IViewport{       
			return this._viewport;
		}
		public set viewport(value:IViewport){
			if (value == this._viewport)
				return;
			
			this.uninstallViewport();
			this._viewport = value;
			this.installViewport();
			this.dispatchEventWith("viewportChanged");
		}
		
		/**
		 * 安装并初始化视域组件
		 */		
		private installViewport():void{
			if (this.viewport){
				this.viewport.clipAndEnableScrolling = true;
                this.viewport.addEventListener(TouchEvent.TOUCH_BEGAN,this.onTouchBegan,this)
				super.addChildAt(<DisplayObject><any> this.viewport,0);
			}
		}
		
		/**
		 * 卸载视域组件
		 */		
		private uninstallViewport():void{
			if (this.viewport){
				this.viewport.clipAndEnableScrolling = false;
                this.viewport.removeEventListener(TouchEvent.TOUCH_BEGAN,this.onTouchBegan,this)
				super.removeChild(<DisplayObject><any> this.viewport);
			}
		}
        /**
         * 鼠标按下时的偏移量
         */
        private _offsetPointX:number;
        private _offsetPointY:number;

        private onTouchBegan(event:TouchEvent):void{
            if (this.animator&&this.animator.isPlaying)
                this.animator.stop();
            var viewport:IViewport = this._viewport;
            this._offsetPointX = viewport.horizontalScrollPosition + event.stageX;
            this._offsetPointY = viewport.verticalScrollPosition + event.stageY;
            UIGlobals.stage.addEventListener(
                TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            UIGlobals.stage.addEventListener(
                TouchEvent.TOUCH_END, this.onTouchEnd, this);
            UIGlobals.stage.addEventListener(
                Event.LEAVE_STAGE, this.onTouchEnd, this);
        }

        private onTouchMove(event:TouchEvent):void{
            var hsp:number = this._offsetPointX - event.stageX;
            var vsp:number = this._offsetPointY - event.stageY;
            var viewport:IViewport = this._viewport;
            if(hsp<0){
                hsp *= 0.5;
            }
            if(hsp>viewport.contentWidth-viewport.width){
                hsp = (hsp+viewport.contentWidth-viewport.width)*0.5
            }
            if(vsp<0){
                vsp *= 0.5;
            }
            if(vsp>viewport.contentHeight-viewport.height){
                vsp = (vsp+viewport.contentHeight-viewport.height)*0.5;
            }
            viewport.horizontalScrollPosition = hsp;
            viewport.verticalScrollPosition = vsp;
        }

        private onTouchEnd(event:Event):void{
            UIGlobals.stage.removeEventListener(
                TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            UIGlobals.stage.removeEventListener(
                TouchEvent.TOUCH_END, this.onTouchEnd, this);
            UIGlobals.stage.removeEventListener(
                Event.LEAVE_STAGE, this.onTouchEnd, this);
            var viewport:IViewport = this._viewport;
            var hsp:number = viewport.horizontalScrollPosition;
            var vsp:number = viewport.verticalScrollPosition;
            var hspTo:number = hsp;
            if(hsp<0){
                hspTo = 0;
            }
            if(hsp>viewport.contentWidth-viewport.width){
                hspTo = viewport.contentWidth-viewport.width;
            }
            var vspTo:number = vsp;
            if(vsp<0){
                vspTo = 0;
            }
            if(vsp>viewport.contentHeight-viewport.height){
                vspTo = viewport.contentHeight-viewport.height;
            }
            if(hspTo==hsp&&vspTo==vsp){
                return;
            }
            if (!this.animator){
                this.animator = new Animation(this.animationUpdateHandler,this);
                this.animator.duration = 200;
            }
            if (this.animator.isPlaying)
                this.animator.stop();
            var paths:Array<any> = [];
            if(hspTo!=hsp){
                paths.push({prop:"hsp", from:hsp, to:hspTo})
            }
            if(vspTo!=vsp){
                paths.push({prop:"vsp", from:vsp, to:vspTo})
            }
            this.animator.motionPaths = paths;
            this.animator.play();
        }

        /**
         * 动画实例
         */
        private animator:Animation;


        /**
         * 动画播放更新数值
         */
        private animationUpdateHandler(animation:Animation):void {
            var data:any = animation.currentValue;
            if(data.hasOwnProperty("hsp")){
                this._viewport.horizontalScrollPosition = data["hsp"];
            }
            if(data.hasOwnProperty("vsp")){
                this._viewport.verticalScrollPosition = data["vsp"];
            }
        }


		public get numElements():number{
			return this.viewport ? 1 : 0;
		}
		
		/**
		 * 抛出索引越界异常
		 */		
		private throwRangeError(index:number):void{
			throw new RangeError("索引:\""+index+"\"超出可视元素索引范围");
		}
		/**
		 * @inheritDoc
		 */
		public getElementAt(index:number):IVisualElement{
			if (this.viewport && index == 0)
				return this.viewport;
			else
				this.throwRangeError(index);
			return null;
		}
		
		/**
		 * @inheritDoc
		 */
		public getElementIndex(element:IVisualElement):number{
			if (element != null && element == this.viewport)
				return 0;
			else
				return -1;
		}
		/**
		 * @inheritDoc
		 */
		public containsElement(element:IVisualElement):boolean{
			if (element != null && element == this.viewport)
				return true;
			return false;
		}
		
		private throwNotSupportedError():void{
			throw new Error("此方法在Scroller组件内不可用!");
		}
		/**
		 * @deprecated
		 */
		public addElement(element:IVisualElement):IVisualElement{
			this.throwNotSupportedError();
			return null;
		}
		/**
		 * @deprecated
		 */
		public addElementAt(element:IVisualElement, index:number):IVisualElement{
			this.throwNotSupportedError();
			return null;
		}
		/**
		 * @deprecated
		 */
		public removeElement(element:IVisualElement):IVisualElement{
			this.throwNotSupportedError();
			return null;
		}
		/**
		 * @deprecated
		 */
		public removeElementAt(index:number):IVisualElement{
			this.throwNotSupportedError();
			return null;
		}
		/**
		 * @deprecated
		 */
		public removeAllElements():void{
			this.throwNotSupportedError();
		}
		/**
		 * @deprecated
		 */
		public setElementIndex(element:IVisualElement, index:number):void{
			this.throwNotSupportedError();
		}
		/**
		 * @deprecated
		 */
		public swapElements(element1:IVisualElement, element2:IVisualElement):void{
			this.throwNotSupportedError();
		}
		/**
		 * @deprecated
		 */
		public swapElementsAt(index1:number, index2:number):void{
			this.throwNotSupportedError();
		}

        /**
         * @deprecated
         */
        public addChild(child:DisplayObject):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
         */
        public removeChild(child:DisplayObject):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
         */
        public removeChildAt(index:number):DisplayObject{
            this.throwNotSupportedError();
            return null;
        }
        /**
         * @deprecated
         */
        public setChildIndex(child:DisplayObject, index:number):void{
            this.throwNotSupportedError();
        }
        /**
         * @deprecated
         */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
            this.throwNotSupportedError();
        }
        /**
         * @deprecated
         */
        public swapChildrenAt(index1:number, index2:number):void{
            this.throwNotSupportedError();
        }
	}
	
}