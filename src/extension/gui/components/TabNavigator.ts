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

/// <reference path="Group.ts"/>
/// <reference path="SkinnableContainer.ts"/>
/// <reference path="TabBar.ts"/>
/// <reference path="ViewStack.ts"/>
/// <reference path="../core/IViewStack.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../events/ElementExistenceEvent.ts"/>
/// <reference path="../events/IndexChangeEvent.ts"/>

module ns_egret {

	export class TabNavigator extends SkinnableContainer implements IViewStack{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		
		/**
		 * [SkinPart]选项卡组件
		 */
		public tabBar:TabBar;
		/**
		 * viewStack引用
		 */		
		private get viewStack():ViewStack{
			return <ViewStack> (this.contentGroup);
		}
		/**
		 * @inheritDoc
		 */
		public get currentContentGroup():Group{
			if (!this.contentGroup){
				if (!this._placeHolderGroup){
					this._placeHolderGroup = new ViewStack();
					this._placeHolderGroup.visible = false;
					this.addToDisplayList(this._placeHolderGroup);
				}
				this._placeHolderGroup.addEventListener(
					ElementExistenceEvent.ELEMENT_ADD, this.contentGroup_elementAddedHandler, this);
				this._placeHolderGroup.addEventListener(
					ElementExistenceEvent.ELEMENT_REMOVE, this.contentGroup_elementRemovedHandler, this);
				return this._placeHolderGroup;
			}
			else{
				return this.contentGroup;    
			}
		}
		
		private viewStackProperties:any = {};
		
		private _createAllChildren:boolean = false;
		/**
		 * 是否立即初始化化所有子项。false表示当子项第一次被显示时再初始化它。默认值false。
		 */
		public get createAllChildren():boolean{
			return this.viewStack?this.viewStack.createAllChildren:
				this.viewStackProperties.createAllChildren;
		}

		public set createAllChildren(value:boolean){
			if(this.viewStack){
				this.viewStack.createAllChildren = value;
			}
			else{
				this.viewStackProperties.createAllChildren = value;
			}
		}

		/**
		 * @inheritDoc
		 */		
		public get selectedChild():IVisualElement{
			return this.viewStack?this.viewStack.selectedChild:
				this.viewStackProperties.selectedChild;
		}
		public set selectedChild(value:IVisualElement){
			if(this.viewStack){
				this.viewStack.selectedChild = value;
			}
			else{
				delete this.viewStackProperties.selectedIndex;
				this.viewStackProperties.selectedChild = value;
			}
		}
		
		/**
		 * @inheritDoc
		 */	
		public get selectedIndex():number{
			if(this.viewStack)
				return this.viewStack.selectedIndex;
			if(this.viewStackProperties.selectedIndex!==undefined)
				return this.viewStackProperties.selectedIndex;
			return -1;
		}
		public set selectedIndex(value:number){
			if(this.viewStack){
				this.viewStack.selectedIndex = value;
			}
			else{
				delete this.viewStackProperties.selectedChild;
				this.viewStackProperties.selectedIndex = value;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName,instance);
			if(instance==this.tabBar){
				if(this.viewStack&&this.tabBar.dataProvider != this.viewStack)
					this.tabBar.dataProvider = this.viewStack;
				this.tabBar.selectedIndex = this.viewStack?this.viewStack.selectedIndex:-1;
				this.tabBar.addEventListener(IndexChangeEvent.CHANGE,this.dispatchEvent,this);
				this.tabBar.addEventListener(IndexChangeEvent.CHANGING,this.onTabBarIndexChanging,this);
			}
			else if(instance==this.viewStack){
				if(this.tabBar&&this.tabBar.dataProvider != this.viewStack)
					this.tabBar.dataProvider = this.viewStack;
				if(this.viewStackProperties.selectedIndex!==undefined){
					this.viewStack.selectedIndex = this.viewStackProperties.selectedIndex;
				}
				else if(this.viewStackProperties.selectedChild!==undefined){
					this.viewStack.selectedChild = this.viewStackProperties.selectedChild;
				}
				else if(this.viewStackProperties.createAllChildren!==undefined){
					this.viewStack.createAllChildren = this.viewStackProperties.createAllChildren;
				}
				this.viewStackProperties = {};
			}
		}
		
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName,instance);
			if(instance==this.tabBar){
				this.tabBar.dataProvider = null;
				this.tabBar.removeEventListener(IndexChangeEvent.CHANGE,this.dispatchEvent,this);
				this.tabBar.removeEventListener(IndexChangeEvent.CHANGING,this.onTabBarIndexChanging,this);
			}
			else if(instance==this.viewStack){
				this.viewStackProperties.selectedIndex = this.viewStack.selectedIndex;
			}
		}
		
		/**
		 * 传递TabBar的IndexChanging事件
		 */		
		private onTabBarIndexChanging(event:IndexChangeEvent):void{
			if(!this.dispatchEvent(event))
				event.preventDefault();
		}

		/**
		 * @inheritDoc
		 */
		public createSkinParts():void{}
		/**
		 * @inheritDoc
		 */
		public removeSkinParts():void{}
	}
}