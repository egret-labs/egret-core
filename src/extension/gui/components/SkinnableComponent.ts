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
/// <reference path="UIAsset.ts"/>
/// <reference path="supportClasses/SkinBasicLayout.ts"/>
/// <reference path="../core/ISkin.ts"/>
/// <reference path="../core/IStateClient.ts"/>
/// <reference path="../events/SkinPartEvent.ts"/>

module ns_egret {

	export class SkinnableComponent extends UIAsset{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
			this.touchChildren = true;
		}
		
		/**
		 * @inheritDoc
		 */
		public createChildren():void{
			if(this.skinName==null){//让部分组件在没有皮肤的情况下创建默认的子部件。
				this.onGetSkin(null,null);
			}
			super.createChildren();
		}

		private _skinObject:any
		/**
		 * 存储皮肤适配器解析skinName得到的原始皮肤对象，包括非显示对象皮肤的实例。
		 */
		public get skinObject():any{
			return this._skinObject;
		}
		
		/**
		 * @inheritDoc
		 */
		public onGetSkin(skin:any,skinName:any):void{
			var oldSkin:any = this._skinObject;
			this.detachSkin(oldSkin);
			if(this._skin){
				if(this._skin.parent==this){
					this.removeFromDisplayList(this._skin); 
				}
			}
			
			if(skin instanceof DisplayObject){
				this._skin = <DisplayObject> skin;
				this.addToDisplayListAt(this._skin,0);
			}
			else{
				this._skin = null;
			}
			this._skinObject = skin;
			this.attachSkin(this._skinObject);
			this.aspectRatio = NaN;
			this.invalidateSkinState();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		/**
		 * 附加皮肤
		 */		
		public attachSkin(skin:any):void{
			if("hostComponent" in skin){
				var newSkin:ISkin = <ISkin> skin;
				newSkin.hostComponent = this;
				this.findSkinParts();
			}
			else{
				if(!this.hasCreatedSkinParts){
					this.createSkinParts();
					this.hasCreatedSkinParts = true;
				}
			}
			if("hostComponent" in skin&&skin instanceof DisplayObject)
				this.skinLayoutEnabled = false;
			else
				this.skinLayoutEnabled = true;
		}
		/**
		 * 匹配皮肤和主机组件的公共变量，并完成实例的注入。此方法在附加皮肤时会自动执行一次。
		 * 若皮肤中含有延迟实例化的子部件，在子部件实例化完成时需要从外部再次调用此方法,完成注入。
		 */	
		public findSkinParts():void{
			var curSkin:any = this._skinObject;
            if(curSkin&&"skinParts" in curSkin){
                var skinParts:Array = curSkin["skinParts"];
                var length:number = skinParts.length;
                for(var i:number=0;i<length;i++){
                    var partName:string = skinParts[i];
                    if((partName in curSkin)){
                        try{
                            this[partName] = curSkin[partName];
                            this.partAdded(partName,curSkin[partName]);
                        }
                        catch(e){
                        }
                    }
                }
            }



		}
		
		/**
		 * 由组件自身创建了SkinPart的标志
		 */		
		private hasCreatedSkinParts:boolean = false;
		/**
		 * 由组件自身来创建必要的SkinPart，通常是皮肤为空或皮肤不是ISkinPart时调用。
		 */		
		public createSkinParts():void{
		}
		/**
		 * 删除组件自身创建的SkinPart
		 */		
		public removeSkinParts():void{
		}
		
		/**
		 * 卸载皮肤
		 */		
		public detachSkin(skin:any):void{       
			if(this.hasCreatedSkinParts){
				this.removeSkinParts();
				this.hasCreatedSkinParts = false;
			}
            if(skin&&"skinParts" in skin.prototype){
                var skinParts:Array = skin.prototype["skinParts"];
                var length:number = skinParts.length;
				for(var i:number=0;i<length;i++){
                    var partName:string = skinParts[i];
					if(!(partName in this))
						continue;
					if (this[partName] != null){
						this.partRemoved(partName,this[partName]);
					}
					this[partName] = null;
				}
				(<ISkin> skin).hostComponent = null;
			}
		}
		
		/**
		 * 若皮肤是ISkinPartHost,则调用此方法附加皮肤中的公共部件
		 */		
		public partAdded(partName:string,instance:any):void{
			var event:SkinPartEvent = new SkinPartEvent(SkinPartEvent.PART_ADDED);
			event.partName = partName;
			event.instance = instance;
			this.dispatchEvent(event);
		}
		/**
		 * 若皮肤是ISkinPartHost，则调用此方法卸载皮肤之前注入的公共部件
		 */		
		public partRemoved(partName:string,instance:any):void{       
			var event:SkinPartEvent = new SkinPartEvent(SkinPartEvent.PART_REMOVED);
			event.partName = partName;
			event.instance = instance;
			this.dispatchEvent(event);
		}
		
		
		
		//========================皮肤视图状态=====================start=======================
		
		private stateIsDirty:boolean = false;
		
		/**
		 * 标记当前需要重新验证皮肤状态
		 */		
		public invalidateSkinState():void{
			if (this.stateIsDirty)
				return;
			
			this.stateIsDirty = true;
			this.invalidateProperties();
		}
		
		/**
		 * 子类覆盖此方法,应用当前的皮肤状态
		 */		
		public validateSkinState():void{
			var curState:string = this.getCurrentSkinState();
			var hasState:boolean = false;
			var curSkin:any = this._skinObject;
			if("hasState" in curSkin){
				(<IStateClient> curSkin).currentState = curState;
				hasState = (<IStateClient> curSkin).hasState(curState);
			}
			if(this.hasEventListener("stateChanged"))
				this.dispatchEvent(new Event("stateChanged"));
		}
		
		private _autoMouseEnabled:boolean = true;
		/**
		 * 在enabled属性发生改变时是否自动开启或禁用鼠标事件的响应。默认值为true。
		 */
		public get autoTouchEnabled():boolean{
			return this._autoMouseEnabled;
		}
		
		public set autoTouchEnabled(value:boolean){
			if(this._autoMouseEnabled==value)
				return;
			this._autoMouseEnabled = value;
			if(this._autoMouseEnabled){
				super.touchChildren = this.enabled ? this.explicitMouseChildren : false;
				super.touchEnabled  = this.enabled ? this.explicitMouseEnabled  : false;
			}
			else{
				super.touchChildren = this.explicitMouseChildren;
				super.touchEnabled  = this.explicitMouseEnabled;
			}
		}
		
		/**
		 * 外部显式设置的mouseChildren属性值 
		 */		
		private explicitMouseChildren:boolean = true;
		/**
		 * @inheritDoc
		 */		
		public set touchChildren(value:boolean){
			if(this.enabled)
				super.touchChildren = value;
			this.explicitMouseChildren = value;
		}
		/**
		 * 外部显式设置的mouseEnabled属性值
		 */		
		private explicitMouseEnabled:boolean = true;
		/**
		 * @inheritDoc
		 */	
		public set touchEnabled(value:boolean){
			if(this.enabled)
				super.touchEnabled = value;
			this.explicitMouseEnabled = value;
		}

        /**
         * @inheritDoc
         */
        public get enabled():boolean{
            return this._enabled;
        }
		/**
		 * @inheritDoc
		 */
		public set enabled(value:boolean){
			if(this._enabled==value)
				return;
			this._enabled = value;
			if(this._autoMouseEnabled){
				super.touchChildren = value ? this.explicitMouseChildren : false;
				super.touchEnabled  = value ? this.explicitMouseEnabled  : false;
			}
			this.invalidateSkinState();
		}
		
		/**
		 * 返回组件当前的皮肤状态名称,子类覆盖此方法定义各种状态名
		 */		
		public getCurrentSkinState():string {
			return this.enabled?"normal":"disabled"
		}
		
		//========================皮肤视图状态===================end========================
		
		/**
		 * @inheritDoc
		 */
		public commitProperties():void{
			super.commitProperties();
			if(this.stateIsDirty){
				this.stateIsDirty = false;
				this.validateSkinState();
			}
		}
		
		private layout:SkinBasicLayout;
		/**
		 * 启用或禁用组件自身的布局。通常用在当组件的皮肤不是ISkinPartHost，又需要自己创建子项并布局时。
		 */		
		public set skinLayoutEnabled(value:boolean){
			var hasLayout:boolean = (this.layout != null);
			if(hasLayout==value)
				return;
			if(value){
				this.layout = new SkinBasicLayout();
				this.layout.target = this;
			}
			else{
				this.layout.target = null;
 				this.layout = null;
			}
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		/**
		 * @inheritDoc
		 */
		public childXYChanged():void{
			if(this.layout){
				this.invalidateSize();
				this.invalidateDisplayList();
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public measure():void{
			super.measure();
			if(this.layout){
				this.layout.measure();
			}
			var skinObject:any = this._skinObject;
			if(!this._skin&&skinObject){//为非显示对象的皮肤测量
				var measuredW:number = this.measuredWidth;
				var measuredH:number = this.measuredHeight;
				try{
					if(!isNaN(skinObject.width))
						measuredW = Math.ceil(skinObject.width);
					if(!isNaN(skinObject.height))
						measuredH = Math.ceil(skinObject.height);
					if(skinObject.hasOwnProperty("minWidth")&&
						measuredW<skinObject.minWidth){
						measuredW = skinObject.minWidth;
					}
					if(skinObject.hasOwnProperty("maxWidth")&&
						measuredW>skinObject.maxWidth){
						measuredW = skinObject.maxWidth;
					}
					if(skinObject.hasOwnProperty("minHeight")&&
						measuredH<skinObject.minHeight){
						measuredH = skinObject.minHeight;
					}
					if(skinObject.hasOwnProperty("maxHeight")&&
						measuredH>skinObject.maxHeight){
						measuredH = skinObject.maxHeight
					}
					this.measuredWidth = measuredW;
					this.measuredHeight = measuredH;
				}
				catch(e){}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			if(this.layout){
				this.layout.updateDisplayList(unscaledWidth,unscaledHeight);
			}
		}
	}
}