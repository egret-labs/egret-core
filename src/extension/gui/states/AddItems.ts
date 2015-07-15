//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module egret.gui {

	/**
	 * @class egret.gui.AddItems
	 * @classdesc
	 * 添加显示元素
	 * @extends egret.gui.OverrideBase
	 */	
	export class AddItems extends OverrideBase {
		/**
		 * 添加父级容器的底层
		 * @constant egret.gui.AddItems.FIRST
		 */		
		public static FIRST:string = "first";
		/**
		 * 添加在父级容器的顶层 
		 * @constant egret.gui.AddItems.LAST
		 */		
		public static LAST:string = "last";
		/**
		 * 添加在相对对象之前 
		 * @constant egret.gui.AddItems.BEFORE
		 */		
		public static BEFORE:string = "before";
		/**
		 * 添加在相对对象之后 
		 * @constant egret.gui.AddItems.AFTER
		 */		
		public static AFTER:string = "after";
		
		/**
		 * 构造函数
		 * @method egret.gui.AddItems#constructor
		 */		
		public constructor(target:string,propertyName:string,position:string,relativeTo:string){
			super();
            this.target = target;
            this.propertyName = propertyName;
            this.position = position;
            this.relativeTo = relativeTo;
		}
		
		/**
		 * 要添加到的属性 
		 * @member egret.gui.AddItems#propertyName
		 */		
		public propertyName:string = "";
		
		/**
		 * 添加的位置 
		 * @member egret.gui.AddItems#position
		 */		
		public position:string = AddItems.LAST;
		
		/**
		 * 相对的显示元素的实例名
		 * @member egret.gui.AddItems#relativeTo
		 */		
        public relativeTo: string = null;
		
		/**
		 * 目标实例名
		 * @member egret.gui.AddItems#target
		 */		
        public target: string = null;
		
		/**
		 * @method egret.gui.AddItems#initialize
		 * @param parent {IStateClient} 
		 */
		public initialize(parent:IStateClient):void{
			var targetElement:IVisualElement = <IVisualElement> (parent[this.target]);
			if(!targetElement||targetElement instanceof SkinnableComponent)
				return;
			//让UIAsset等素材组件立即开始初始化，防止延迟闪一下或首次点击失效的问题。
			if("_initialize" in targetElement){
				try{
					targetElement["_initialize"]();
				}
				catch(e){
				}
			}
		}
		
		/**
		 * @method egret.gui.AddItems#apply
		 * @param parent {IContainer} 
		 */
		public apply(parent:IContainer):void{
			var index:number;
			var relative:IVisualElement;
			try{
				relative = <IVisualElement> (parent[this.relativeTo]);
			}
			catch(e){
			}
			var targetElement:IVisualElement = <IVisualElement> (parent[this.target]);
			var dest:IContainer = <IContainer> (this.propertyName?parent[this.propertyName]:parent);
			if(!targetElement||!dest)
				return;
			switch (this.position){
				case AddItems.FIRST:
					index = 0;
					break;
				case AddItems.LAST:
					index = -1;
					break;
				case AddItems.BEFORE:
					index = dest.getElementIndex(relative);
					break;
				case AddItems.AFTER:
					index = dest.getElementIndex(relative) + 1;
					break;
			}    
			if (index == -1)
				index = dest.numElements;
			dest.addElementAt(targetElement,index);
		}
		
		/**
		 * @method egret.gui.AddItems#remove
		 * @param parent {IContainer} 
		 */
		public remove(parent:IContainer):void{
			var dest:IContainer = this.propertyName==null||this.propertyName==""?
				<IContainer> parent:parent[this.propertyName];
			var targetElement:IVisualElement = <IVisualElement> (parent[this.target]);
			if(!targetElement||!dest)
				return;
			if(dest.getElementIndex(targetElement)!=-1){
				dest.removeElement(targetElement);
			}
		}
	}
	
}