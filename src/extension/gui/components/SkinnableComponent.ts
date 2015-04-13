/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret.gui {

	/**
	 * @class egret.gui.SkinnableComponent
	 * @classdesc
	 * 复杂可设置外观组件的基类，接受ISkin类或任何显示对象作为皮肤。
	 * 当皮肤为ISkin时，将自动匹配两个实例内同名的公开属性(显示对象)，
	 * 并将皮肤的属性引用赋值到此类定义的同名属性(必须没有默认值)上,
	 * 如果要对公共属性添加事件监听或其他操作，
	 * 请覆盖partAdded()和partRemoved()方法
	 * @extends egret.gui.UIComponent
	 */
	export class SkinnableComponent extends UIComponent implements ISkinnableClient{
		/**
		 * 构造函数
		 * @method egret.gui.SkinnableComponent#constructor
		 */		
		public constructor(){
			super();
		}


        /**
         * 主机组件标识符。用于唯一确定一个组件的名称。
         * 用户自定义的组件若不对此属性赋值，将会继承父级的标识符定义。
         * @member {string} egret.gui.SkinnableComponent#hostComponentKey
         */
        public hostComponentKey: string = null;

        /**
         * 外部显式设置了皮肤名
         */
        public _skinNameExplicitlySet:any = false;

        public _skinName:any = null;
        /**
         * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
         * 适配器根据此属性值解析获取对应的显示对象，并赋值给skin属性。
         * @member {string} egret.gui.SkinnableComponent#skinName
         */
        public get skinName():any{
            return this._skinName;
        }

        public set skinName(value:any){
            if(this._skinName==value)
                return;
            this._skinName = value;
            this._skinNameExplicitlySet = true;
            if(this._createChildrenCalled){
                this.parseSkinName();
            }
        }

        public _createChildrenCalled:boolean = false;
        /**
         * 创建该容器的子元素对象
         * @method egret.gui.SkinnableComponent#createChildren
         */
        public createChildren():void{
            super.createChildren();
            this.parseSkinName();
            this._createChildrenCalled = true;
        }

        /**
         * 皮肤解析适配器
         */
        private static skinAdapter:ISkinAdapter = null;
        /**
         * 默认皮肤主题解析器
         */
        public static _defaultTheme:Theme = null;
        /**
         * 解析skinName
         */
        private parseSkinName():void{
            var adapter:ISkinAdapter = SkinnableComponent.skinAdapter;
            if(!adapter){
                adapter = this.getSkinAdapter();
            }
            var key = this.hostComponentKey || egret.getQualifiedClassName(this);
            var skin: any = adapter.getSkin(this._skinName, key);
            if(!skin){
                var theme:Theme = SkinnableComponent._defaultTheme;
                if(theme){
                    skin = theme.getDefaultSkin(this);
                }
            }
            this._setSkin(skin);
        }
        /**
         * 获取皮肤适配器
         */
        private getSkinAdapter():ISkinAdapter{
            var adapter:ISkinAdapter;
            try{
                adapter = Injector.getInstance("egret.gui.ISkinAdapter");
            }
            catch(e){
                adapter = new DefaultSkinAdapter();
            }
            SkinnableComponent.skinAdapter = adapter;
            return adapter;
        }

        public _skin:any = null;
        /**
         * 皮肤对象实例。
         * @member egret.gui.SkinnableComponent#skin
         */
        public get skin():any{
            return this._skin;
        }

        /**
         * 设置皮肤
         */
        public _setSkin(skin:any):void{
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

        private skinLayoutEnabled = false;
		/**
		 * 附加皮肤
		 * @method egret.gui.SkinnableComponent#attachSkin
		 * @param skin {any} 
		 */		
        public attachSkin(skin: any): void {
            if (skin && !(skin instanceof DisplayObject))
                this.skinLayoutEnabled = true;
            else
                this.skinLayoutEnabled = false;

			if(skin&&"hostComponent" in skin){
				var newSkin:ISkin = <ISkin> skin;
				newSkin.hostComponent = this;
				this.findSkinParts();
			}
		}
		/**
		 * 匹配皮肤和主机组件的公共变量，并完成实例的注入。此方法在附加皮肤时会自动执行一次。
		 * 若皮肤中含有延迟实例化的子部件，在子部件实例化完成时需要从外部再次调用此方法,完成注入。
		 * @method egret.gui.SkinnableComponent#findSkinParts
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
		 * @method egret.gui.SkinnableComponent#detachSkin
		 * @param skin {any} 
		 */		
		public detachSkin(skin:any):void{
            if(skin){
                if("skinParts" in skin){
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
                }
				(<ISkin> skin).hostComponent = null;
			}
		}
		
		/**
		 * 若皮肤是ISkin,则调用此方法附加皮肤中的公共部件
		 * @method egret.gui.SkinnableComponent#partAdded
		 * @param partName {string} 
		 * @param instance {any} 
		 */		
		public partAdded(partName:string,instance:any):void{
            SkinPartEvent.dispatchSkinPartEvent(this,
                SkinPartEvent.PART_ADDED,partName,instance);
		}
		/**
		 * 若皮肤是ISkin，则调用此方法卸载皮肤之前注入的公共部件
		 * @method egret.gui.SkinnableComponent#partRemoved
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
		 * @method egret.gui.SkinnableComponent#invalidateSkinState
		 */		
		public invalidateSkinState():void{
			if (this.stateIsDirty)
				return;
			
			this.stateIsDirty = true;
			this.invalidateProperties();
		}
		
		/**
		 * 子类覆盖此方法,应用当前的皮肤状态
		 * @method egret.gui.SkinnableComponent#validateSkinState
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
		 * @member egret.gui.SkinnableComponent#autoTouchEnabled
		 */
		public get autoTouchEnabled():boolean{
			return this._autoMouseEnabled;
		}
		
		public set autoTouchEnabled(value:boolean){
			if(this._autoMouseEnabled==value)
				return;
			this._autoMouseEnabled = value;
			if(this._autoMouseEnabled){
                this._setFlag(DisplayObjectFlags.TOUCH_CHILDREN, this.enabled ? this.explicitMouseChildren : false);
                this._setFlag(DisplayObjectFlags.TOUCH_ENABLED, this.enabled ? this.explicitMouseEnabled  : false);
			}
			else{
                this._setFlag(DisplayObjectFlags.TOUCH_CHILDREN, this.explicitMouseChildren);
                this._setFlag(DisplayObjectFlags.TOUCH_ENABLED, this.explicitMouseEnabled);
			}
		}
		
		/**
		 * 外部显式设置的mouseChildren属性值 
		 */		
		private explicitMouseChildren:boolean = true;

		/**
		 * @member egret.gui.SkinnableComponent#touchChildren
		 */
        public get touchChildren():boolean{
            return this._getFlag(DisplayObjectFlags.TOUCH_CHILDREN);
        }
		/**
		 * @inheritDoc
		 */		
		public set touchChildren(value:boolean){
			if(this.enabled)
            this._setFlag(DisplayObjectFlags.TOUCH_CHILDREN, value);
			this.explicitMouseChildren = value;
		}
		/**
		 * 外部显式设置的mouseEnabled属性值
		 */		
		private explicitMouseEnabled:boolean = true;

		/**
		 * @member egret.gui.SkinnableComponent#touchEnabled
		 */
        public get touchEnabled():boolean{
            return this._getFlag(DisplayObjectFlags.TOUCH_ENABLED);
        }
		/**
		 * @inheritDoc
		 */	
		public set touchEnabled(value:boolean){
			if(this.enabled)
            this._setFlag(DisplayObjectFlags.TOUCH_ENABLED, value);
			this.explicitMouseEnabled = value;
		}

        /**
		 * @member egret.gui.SkinnableComponent#enabled
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
                this._setFlag(DisplayObjectFlags.TOUCH_CHILDREN, value ? this.explicitMouseChildren : false);
                this._setFlag(DisplayObjectFlags.TOUCH_ENABLED, value ? this.explicitMouseEnabled  : false);
            }
            this.invalidateSkinState();
        }
		
		/**
		 * 返回组件当前的皮肤状态名称,子类覆盖此方法定义各种状态名
		 * @method egret.gui.SkinnableComponent#getCurrentSkinState
		 * @returns {string}
		 */		
		public getCurrentSkinState():string {
			return this.enabled?"normal":"disabled"
		}
		
		//========================皮肤视图状态===================end========================
		
		/**
         * 处理对组件设置的属性
		 * @method egret.gui.SkinnableComponent#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			if(this.stateIsDirty){
				this.stateIsDirty = false;
				this.validateSkinState();
			}
		}

        /**
         *
         * @private
         */
		public _childXYChanged():void{
			if(this.skinLayoutEnabled){
				this.invalidateSize();
				this.invalidateDisplayList();
			}
		}

        /**
         * 计算组件的默认大小和（可选）默认最小大小
         */
		public measure():void{
            super.measure();
            var skin:any = this._skin;
            if(!skin)
                return;
            if(this.skinLayoutEnabled){
                skin.measure();
                this.measuredWidth = skin.preferredWidth;
                this.measuredHeight = skin.preferredHeight;
            }
            else{
                if("preferredWidth" in skin){
                    this.measuredWidth = skin.preferredWidth;
                    this.measuredHeight = skin.preferredHeight;
                }
                else{
                    this.measuredWidth = skin.width;
                    this.measuredHeight = skin.height;
                }
            }
		}
		
		/**
         * 绘制对象和/或设置其子项的大小和位置
		 * @method egret.gui.SkinnableComponent#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
            var skin:any = this._skin;
            if(skin) {
                if(this.skinLayoutEnabled){
                    skin.updateDisplayList(unscaledWidth,unscaledHeight);
                }
                else if ("setLayoutBoundsSize" in skin) {
                    (<ILayoutElement><any> (skin)).setLayoutBoundsSize(unscaledWidth, unscaledHeight);
                }
                else if(skin instanceof DisplayObject){
                    skin.scaleX = skin.width==0?1:unscaledWidth/skin.width;
                    skin.scaleY = skin.height==0?1:unscaledHeight/skin.height;
                }
            }
		}

        /**
         * 不支持此方法
         * @method egret.gui.SkinnableComponent#addChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        public addChild(child:DisplayObject):DisplayObject{
            throw(new Error(getString(3004, getString(3003))));
        }
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#addChildAt
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject{
            throw(new Error(getString(3005, getString(3003))));
        }
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#removeChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        public removeChild(child:DisplayObject):DisplayObject{
            throw(new Error(getString(3006, getString(3003))));
        }
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#removeChildAt
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         */
        public removeChildAt(index:number):DisplayObject{
            throw(new Error(getString(3007, getString(3003))));
        }
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#setChildIndex
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         */
        public setChildIndex(child:DisplayObject, index:number):void{
            throw(new Error(getString(3008, getString(3003))));
        }
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#swapChildren
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
            throw(new Error(getString(3009, getString(3003))));
        }
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#swapChildrenAt
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         */
        public swapChildrenAt(index1:number, index2:number):void{
            throw(new Error(getString(3010, getString(3003))));
        }
	}
}