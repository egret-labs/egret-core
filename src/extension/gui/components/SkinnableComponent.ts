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
/// <reference path="../../../egret/utils/Injector.ts"/>
/// <reference path="supportClasses/DefaultSkinAdapter.ts"/>
/// <reference path="supportClasses/SkinBasicLayout.ts"/>
/// <reference path="../core/ILayoutElement.ts"/>
/// <reference path="../core/ISkin.ts"/>
/// <reference path="../core/ISkinAdapter.ts"/>
/// <reference path="../core/IStateClient.ts"/>
/// <reference path="../core/UIComponent.ts"/>
/// <reference path="../events/SkinPartEvent.ts"/>
/// <reference path="../events/UIEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.SkinnableComponent
	 * @classdesc
	 * 复杂可设置外观组件的基类，接受ISkin类或任何显示对象作为皮肤。
	 * 当皮肤为ISkin时，将自动匹配两个实例内同名的公开属性(显示对象)，
	 * 并将皮肤的属性引用赋值到此类定义的同名属性(必须没有默认值)上,
	 * 如果要对公共属性添加事件监听或其他操作，
	 * 请覆盖partAdded()和partRemoved()方法
	 * @extends ns_egret.SkinnableComponent
	 */
	export class SkinnableComponent extends UIComponent{
		/**
		 * 构造函数
		 * @method ns_egret.SkinnableComponent#constructor
		 */		
		public constructor(){
			super();
		}
        /**
         * 主机组件标识符。用于唯一确定一个组件的名称。
         * 在解析skinName时，会把此属性的值传递给ISkinAdapter.getSkin()方法，以参与皮肤解析的规则判断。
         * 用户自定义的组件若不对此属性赋值，将会继承父级的标识符定义。
         * @member {string} ns_egret.SkinnableComponent#hostComponentKey
         */
        public hostComponentKey:string = "ns_egret.SkinnableComponent"

        /**
         * 外部显式设置了皮肤名
         */
        public _skinNameExplicitlySet:any = false;

        public _skinName:any;
        /**
         * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
         * 适配器根据此属性值解析获取对应的显示对象，并赋值给skin属性。
         * @member ns_egret.SkinnableComponent#skinName
         */
        public get skinName():any{
            return this._skinName;
        }

        public set skinName(value:any){
            if(this._skinName==value)
                return;
            this._skinName = value;
            this._skinNameExplicitlySet = true;
            if(this.createChildrenCalled){
                this.parseSkinName();
            }
        }

        public _skin:any;
        /**
         * 皮肤对象实例。
         * @member ns_egret.SkinnableComponent#skin
         */
        public get skin():any{
            return this._skin;
        }

        private createChildrenCalled:boolean = false;
        /**
         * @method ns_egret.SkinnableComponent#createChildren
         */
        public createChildren():void{
            super.createChildren();
            this.parseSkinName();
            this.createChildrenCalled = true;
        }

        /**
         * 皮肤解析适配器
         */
        private static skinAdapter:ISkinAdapter;

        /**
         * 解析skinName
         */
        private parseSkinName():void{
            var adapter:ISkinAdapter = SkinnableComponent.skinAdapter;
            if(!adapter){
                adapter = this.getSkinAdapter();
            }

            var skin:any = adapter.getSkin(this._skinName,this.hostComponentKey);
            var oldSkin:any = this._skin;
            this.detachSkin(oldSkin);
            if(oldSkin instanceof DisplayObject){
                this._removeFromDisplayList(<DisplayObjectContainer> oldSkin);
            }

            this._skin = skin;
            if(skin instanceof DisplayObject){
                this._addToDisplayListAt(this._skin,0);
            }
            this.attachSkin(skin);
            this.invalidateSkinState();
            this.invalidateSize();
            this.invalidateDisplayList();

            if(this.hasEventListener(UIEvent.SKIN_CHANGED)){
                UIEvent.dispatchUIEvent(this,UIEvent.SKIN_CHANGED);
            }
        }
        /**
         * 获取皮肤适配器
         */
        private getSkinAdapter():ISkinAdapter{
            var adapter:ISkinAdapter;
            try{
                adapter = Injector.getInstance("ns_egret.ISkinAdapter");
            }
            catch(e){
                adapter = new DefaultSkinAdapter();
            }
            SkinnableComponent.skinAdapter = adapter;
            return adapter;
        }

		/**
		 * 附加皮肤
		 * @method ns_egret.SkinnableComponent#attachSkin
		 * @param skin {any} 
		 */		
		public attachSkin(skin:any):void{
			if(skin&&"hostComponent" in skin){
				var newSkin:ISkin = <ISkin> skin;
				newSkin.hostComponent = this;
				this.findSkinParts();
			}
			if(skin&&"hostComponent" in skin&&skin instanceof DisplayObject)
				this._setSkinLayoutEnabled(false);
			else
				this._setSkinLayoutEnabled(true);
		}
		/**
		 * 匹配皮肤和主机组件的公共变量，并完成实例的注入。此方法在附加皮肤时会自动执行一次。
		 * 若皮肤中含有延迟实例化的子部件，在子部件实例化完成时需要从外部再次调用此方法,完成注入。
		 * @method ns_egret.SkinnableComponent#findSkinParts
		 */	
		public findSkinParts():void{
			var skin:any = this._skin;
            if(skin&&"skinParts" in skin){
                var skinParts:Array<any> = skin.skinParts;
                var length:number = skinParts.length;
                for(var i:number=0;i<length;i++){
                    var partName:string = skinParts[i];
                    if((partName in skin)){
                        try{
                            this[partName] = skin[partName];
                            this.partAdded(partName,skin[partName]);
                        }
                        catch(e){
                        }
                    }
                }
            }
		}
		
		/**
		 * 卸载皮肤
		 * @method ns_egret.SkinnableComponent#detachSkin
		 * @param skin {any} 
		 */		
		public detachSkin(skin:any):void{
            if(skin&&"skinParts" in skin){
                var skinParts:Array<any> = skin.skinParts;
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
		 * 若皮肤是ISkin,则调用此方法附加皮肤中的公共部件
		 * @method ns_egret.SkinnableComponent#partAdded
		 * @param partName {string} 
		 * @param instance {any} 
		 */		
		public partAdded(partName:string,instance:any):void{
            SkinPartEvent.dispatchSkinPartEvent(this,
                SkinPartEvent.PART_ADDED,partName,instance);
		}
		/**
		 * 若皮肤是ISkin，则调用此方法卸载皮肤之前注入的公共部件
		 * @method ns_egret.SkinnableComponent#partRemoved
		 * @param partName {string} 
		 * @param instance {any} 
		 */		
		public partRemoved(partName:string,instance:any):void{
            SkinPartEvent.dispatchSkinPartEvent(this,
                SkinPartEvent.PART_REMOVED,partName,instance);
		}
		
		
		
		//========================皮肤视图状态=====================start=======================
		
		private stateIsDirty:boolean = false;
		
		/**
		 * 标记当前需要重新验证皮肤状态
		 * @method ns_egret.SkinnableComponent#invalidateSkinState
		 */		
		public invalidateSkinState():void{
			if (this.stateIsDirty)
				return;
			
			this.stateIsDirty = true;
			this.invalidateProperties();
		}
		
		/**
		 * 子类覆盖此方法,应用当前的皮肤状态
		 * @method ns_egret.SkinnableComponent#validateSkinState
		 */		
		public validateSkinState():void{
			var curState:string = this.getCurrentSkinState();
			var skin:any = this._skin;
			if(skin&&"currentState" in skin){
				(<IStateClient> skin).currentState = curState;
			}
			if(this.hasEventListener("stateChanged"))
				this.dispatchEventWith("stateChanged");
		}
		
		private _autoMouseEnabled:boolean = true;
		/**
		 * 在enabled属性发生改变时是否自动开启或禁用鼠标事件的响应。默认值为true。
		 * @member ns_egret.SkinnableComponent#autoTouchEnabled
		 */
		public get autoTouchEnabled():boolean{
			return this._autoMouseEnabled;
		}
		
		public set autoTouchEnabled(value:boolean){
			if(this._autoMouseEnabled==value)
				return;
			this._autoMouseEnabled = value;
			if(this._autoMouseEnabled){
				this._touchChildren = this.enabled ? this.explicitMouseChildren : false;
				this._touchEnabled  = this.enabled ? this.explicitMouseEnabled  : false;
			}
			else{
				this._touchChildren = this.explicitMouseChildren;
                this._touchEnabled  = this.explicitMouseEnabled;
			}
		}
		
		/**
		 * 外部显式设置的mouseChildren属性值 
		 */		
		private explicitMouseChildren:boolean = true;

		/**
		 * @member ns_egret.SkinnableComponent#touchChildren
		 */
        public get touchChildren():boolean{
            return this._touchChildren;
        }
		/**
		 * @inheritDoc
		 */		
		public set touchChildren(value:boolean){
			if(this.enabled)
				this._touchChildren = value;
			this.explicitMouseChildren = value;
		}
		/**
		 * 外部显式设置的mouseEnabled属性值
		 */		
		private explicitMouseEnabled:boolean = true;

		/**
		 * @member ns_egret.SkinnableComponent#touchEnabled
		 */
        public get touchEnabled():boolean{
            return this._touchEnabled;
        }
		/**
		 * @inheritDoc
		 */	
		public set touchEnabled(value:boolean){
			if(this.enabled)
				this._touchEnabled = value;
			this.explicitMouseEnabled = value;
		}

        /**
		 * @member ns_egret.SkinnableComponent#enabled
         */
        public get enabled():boolean{
            return this._enabled;
        }
		/**
		 * @inheritDoc
		 */
		public set enabled(value:boolean){
			this._setEnabled(value);
		}

        public _setEnabled(value:boolean):void{
            if(this._enabled==value)
                return;
            this._enabled = value;
            if(this._autoMouseEnabled){
                this._touchChildren = value ? this.explicitMouseChildren : false;
                this._touchEnabled  = value ? this.explicitMouseEnabled  : false;
            }
            this.invalidateSkinState();
        }
		
		/**
		 * 返回组件当前的皮肤状态名称,子类覆盖此方法定义各种状态名
		 * @method ns_egret.SkinnableComponent#getCurrentSkinState
		 * @returns {string}
		 */		
		public getCurrentSkinState():string {
			return this.enabled?"normal":"disabled"
		}
		
		//========================皮肤视图状态===================end========================
		
		/**
		 * @method ns_egret.SkinnableComponent#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			if(this.stateIsDirty){
				this.stateIsDirty = false;
				this.validateSkinState();
			}
		}
		
		private skinLayout:SkinBasicLayout;
		/**
		 * 启用或禁用组件自身的布局。通常用在当组件的皮肤不是ISkinPartHost，又需要自己创建子项并布局时。
		 */		
		public _setSkinLayoutEnabled(value:boolean){
			var hasLayout:boolean = (this.skinLayout != null);
			if(hasLayout==value)
				return;
			if(value){
				this.skinLayout = new SkinBasicLayout();
				this.skinLayout.target = this;
			}
			else{
				this.skinLayout.target = null;
 				this.skinLayout = null;
			}
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		public _childXYChanged():void{
			if(this.skinLayout){
				this.invalidateSize();
				this.invalidateDisplayList();
			}
		}
		
		public measure():void{
            super.measure();
            var skin:any = this._skin;
            if(!skin)
                return;
            var isDisplayObject:boolean = (skin instanceof DisplayObject);
            if(isDisplayObject){
                if(skin&&"preferredWidth" in skin){
                    this.measuredWidth = (<ILayoutElement> (skin)).preferredWidth;
                    this.measuredHeight = (<ILayoutElement> (skin)).preferredHeight;
                }
                else{
                    this.measuredWidth = skin.width;
                    this.measuredHeight = skin.height;
                }
            }
			if(this.skinLayout){
				this.skinLayout.measure();
			}
            if(!isDisplayObject){//对非显示对象的皮肤测量
				var measuredW:number = this.measuredWidth;
				var measuredH:number = this.measuredHeight;
				try{
					if(!isNaN(skin.width))
						measuredW = Math.ceil(skin.width);
					if(!isNaN(skin.height))
						measuredH = Math.ceil(skin.height);
					if(skin.hasOwnProperty("minWidth")&&
						measuredW<skin.minWidth){
						measuredW = skin.minWidth;
					}
					if(skin.hasOwnProperty("maxWidth")&&
						measuredW>skin.maxWidth){
						measuredW = skin.maxWidth;
					}
					if(skin.hasOwnProperty("minHeight")&&
						measuredH<skin.minHeight){
						measuredH = skin.minHeight;
					}
					if(skin.hasOwnProperty("maxHeight")&&
						measuredH>skin.maxHeight){
						measuredH = skin.maxHeight
					}
					this.measuredWidth = measuredW;
					this.measuredHeight = measuredH;
				}
				catch(e){}
			}
		}
		
		/**
		 * @method ns_egret.SkinnableComponent#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
            var skin:any = this._skin;
            if(skin) {
                if ("setLayoutBoundsSize" in skin) {
                    (<ILayoutElement><any> (skin)).setLayoutBoundsSize(unscaledWidth, unscaledHeight);
                }
                else {
                    skin.scaleX = skin.width==0?1:unscaledWidth/skin.width;
                    skin.scaleY = skin.height==0?1:unscaledHeight/skin.height;
                }
            }
			if(this.skinLayout){
				this.skinLayout.updateDisplayList(unscaledWidth,unscaledHeight);
			}
		}

        private static errorStr:string = "在此组件中不可用，若此组件为容器类，请使用";
        /**
         * @method ns_egret.SkinnableComponent#addChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        public addChild(child:DisplayObject):DisplayObject{
            throw(new Error("addChild()"+SkinnableComponent.errorStr+"addElement()代替"));
        }
        /**
         * @method ns_egret.SkinnableComponent#addChildAt
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject{
            throw(new Error("addChildAt()"+SkinnableComponent.errorStr+"addElementAt()代替"));
        }
        /**
         * @method ns_egret.SkinnableComponent#removeChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        public removeChild(child:DisplayObject):DisplayObject{
            throw(new Error("removeChild()"+SkinnableComponent.errorStr+"removeElement()代替"));
        }
        /**
         * @method ns_egret.SkinnableComponent#removeChildAt
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         */
        public removeChildAt(index:number):DisplayObject{
            throw(new Error("removeChildAt()"+SkinnableComponent.errorStr+"removeElementAt()代替"));
        }
        /**
         * @method ns_egret.SkinnableComponent#setChildIndex
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         */
        public setChildIndex(child:DisplayObject, index:number):void{
            throw(new Error("setChildIndex()"+SkinnableComponent.errorStr+"setElementIndex()代替"));
        }
        /**
         * @method ns_egret.SkinnableComponent#swapChildren
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
            throw(new Error("swapChildren()"+SkinnableComponent.errorStr+"swapElements()代替"));
        }
        /**
         * @method ns_egret.SkinnableComponent#swapChildrenAt
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         */
        public swapChildrenAt(index1:number, index2:number):void{
            throw(new Error("swapChildrenAt()"+SkinnableComponent.errorStr+"swapElementsAt()代替"));
        }
	}
}