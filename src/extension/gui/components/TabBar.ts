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
	export class TabBar extends List{
		/**
		 * 构造函数
		 * @method egret.gui.TabBar#constructor
		 */		
		public constructor(){
			super();
            
			this.requireSelection = true;
        }

		/**
		 * 创建容器的子元素
		 */
        public createChildren(): void {
            ListBase.prototype.createChildren.call(this);
        }

		/**
		 * requireSelection改变标志
		 */
		private requireSelectionChanged_tabBar:boolean = false;

        public get requireSelection():boolean{
            return this._requireSelection;
        }
		/**
		 * @method egret.gui.TabBar#requireSelection
		 * @param value {boolean}
		 */
		public set requireSelection(value:boolean){
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
		 * 处理对组件设置的属性
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
		
		public dataGroup_rendererAddHandler(event:RendererExistenceEvent):void{
            super.dataGroup_rendererAddHandler(event);
            if (event.renderer == null)
                return;
            if (event.renderer instanceof TabBarButton)
                (<TabBarButton><any> event.renderer).allowDeselection = !this.requireSelection;
		}
        
		/**
		 * 鼠标在项呈示器上弹起，抛出ItemClick事件。
		 */	
        public _item_touchEndHandler(event: TouchEvent): void {
            var itemRenderer: IItemRenderer = <IItemRenderer> (event.currentTarget);
            if (itemRenderer != this._mouseDownItemRenderer)
                return;

            var newIndex: number
            if (itemRenderer)
                newIndex = itemRenderer.itemIndex;
            else
                newIndex = this.dataGroup.getElementIndex(<IVisualElement><any> (event.currentTarget));

            if (newIndex == this.selectedIndex) {
                if (!this.requireSelection)
                    this._setSelectedIndex(ListBase.NO_SELECTION, true);
            }
            else
                this._setSelectedIndex(newIndex, true);
            if (!this._captureItemRenderer)
                return;
            this._dispatchListEvent(event, ListEvent.ITEM_CLICK, itemRenderer);
        }
	}
}