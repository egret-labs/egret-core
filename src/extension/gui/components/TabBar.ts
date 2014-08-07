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
	 * @class egret.gui.TabBar
	 * @classdesc
	 * 选项卡组件
	 * @extends egret.gui.ListBase
	 */	
	export class TabBar extends ListBase{
		/**
		 * 构造函数
		 * @method egret.gui.TabBar#constructor
		 */		
		public constructor(){
			super();
            this.hostComponentKey = "egret.gui.TabBar";
			this.requireSelection = true;
		}
		
		/**
		 * requireSelection改变标志
		 */
		private requireSelectionChanged_tabBar:boolean;
		/**
		 * @method egret.gui.TabBar#c
		 * @param value {boolea} 
		 */
		public c(value:boolean){
			if (value == this._requireSelection)
				return;
			
			super._setRequireSelection(value);
			this.requireSelectionChanged_tabBar = true;
			this.invalidateProperties();
		}

		/**
		 * @inheritDoc
		 */
		public _setDataProvider(value:ICollection){
			if(this.dataProvider instanceof ViewStack){
				this.dataProvider.removeEventListener("IndexChanged",this.onViewStackIndexChange,this);
				this.removeEventListener(IndexChangeEvent.CHANGE,this.onIndexChanged,this);
			}
			
			if(value instanceof ViewStack){
				value.addEventListener("IndexChanged",this.onViewStackIndexChange,this);
				this.addEventListener(IndexChangeEvent.CHANGE,this.onIndexChanged,this);
			}
			super._setDataProvider(value);
		}
		/**
		 * 鼠标点击的选中项改变
		 */		
		private onIndexChanged(event:IndexChangeEvent):void{
			(<ViewStack><any> (this.dataProvider))._setSelectedIndex(event.newIndex,false);
		}
		
		/**
		 * ViewStack选中项发生改变
		 */		
		private onViewStackIndexChange(event:Event):void{
			this._setSelectedIndex((<ViewStack><any> (this.dataProvider)).selectedIndex, false);
		}
		
		
		/**
		 * @method egret.gui.TabBar#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			
			if (this.requireSelectionChanged_tabBar && this.dataGroup){
				this.requireSelectionChanged_tabBar = false;
				var n:number = this.dataGroup.numElements;
				for (var i:number = 0; i < n; i++){
					var renderer:TabBarButton = <TabBarButton><any> (this.dataGroup.getElementAt(i));
					if (renderer)
						renderer.allowDeselection = !this.requireSelection;
				}
			}
		}  
		
		/**
		 * @method egret.gui.TabBar#dataGroup_rendererAddHandler
		 * @param event {RendererExistenceEvent} 
		 */
		public dataGroup_rendererAddHandler(event:RendererExistenceEvent):void{
			super.dataGroup_rendererAddHandler(event);
			
			var renderer:IItemRenderer = event.renderer;
			if (renderer){
				renderer.addEventListener(TouchEvent.TOUCH_TAP, this.item_clickHandler, this);
				if (renderer instanceof TabBarButton)
					(<TabBarButton><any> renderer).allowDeselection = !this.requireSelection;
			}
		}
		
		/**
		 * @method egret.gui.TabBar#dataGroup_rendererRemoveHandler
		 * @param event {RendererExistenceEvent} 
		 */
		public dataGroup_rendererRemoveHandler(event:RendererExistenceEvent):void{   
			super.dataGroup_rendererRemoveHandler(event);
			
			var renderer:IItemRenderer = event.renderer;
			if (renderer)
				renderer.removeEventListener(TouchEvent.TOUCH_TAP, this.item_clickHandler, this);
		}
		/**
		 * 鼠标在条目上按下
		 */		
		private item_clickHandler(event:TouchEvent):void{
			var itemRenderer:IItemRenderer = <IItemRenderer><any> (event.currentTarget);
			var newIndex:number
			if (itemRenderer)
				newIndex = itemRenderer.itemIndex;
			else
				newIndex = this.dataGroup.getElementIndex(<IVisualElement><any> (event.currentTarget));
			
			if (newIndex == this.selectedIndex){
				if (!this.requireSelection)
					this._setSelectedIndex(ListBase.NO_SELECTION, true);
			}
			else
				this._setSelectedIndex(newIndex, true);
			this._dispatchListEvent(event,ListEvent.ITEM_CLICK,itemRenderer);
		}
		
	}
}