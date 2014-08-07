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
	 * @class egret.gui.UILayer
	 * @classdesc
	 * UIStage的虚拟子容器
	 * @implements egret.gui.IContainer
	 */
	export class UILayer implements IContainer{
		/**
		 * 构造函数
		 * @method egret.gui.UILayer#constructor
		 * @param owner {IUIStage} 
		 * @param lowerBoundReference {string} 
		 * @param upperBoundReference {strin} 
		 */		
		public constructor(owner:IUIStage,
										lowerBoundReference:string,
										upperBoundReference:string){
			this.owner = owner;
			this.lowerBoundReference = lowerBoundReference;
			this.upperBoundReference = upperBoundReference;
		}
		/**
		 * 实体容器
		 */		
		private owner:IUIStage;
		
		/**
		 * 容器下边界属性
		 */		
		private lowerBoundReference:string;
		
		/**
		 * 容器上边界属性
		 */		
		private upperBoundReference:string;
		/**
		 * @member egret.gui.UILayer#numElements
		 */
		public get numElements():number{
			return this.owner[this.upperBoundReference] - this.owner[this.lowerBoundReference];
		}
		
		private raw_getElementAt:string = "raw_getElementAt";
		private raw_addElementAt:string = "raw_addElementAt";
		private raw_getElementIndex:string = "raw_getElementIndex";
		private raw_removeElement:string = "raw_removeElement";
		private raw_removeElementAt:string = "raw_removeElementAt";
		private raw_setElementIndex:string = "raw_setElementIndex";
		/**
		 * @method egret.gui.UILayer#getElementAt
		 * @param index {number} 
		 * @returns {IVisualElement}
		 */
		public getElementAt(index:number):IVisualElement{
			var retval:IVisualElement =
				this.owner[this.raw_getElementAt](
					this.owner[this.lowerBoundReference] + index);
			return retval;
		}
		/**
		 * @method egret.gui.UILayer#addElement
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
		 */
		public addElement(element:IVisualElement):IVisualElement{
			var index:number = this.owner[this.upperBoundReference];
			if(element.parent===(<DisplayObjectContainer><any> this.owner))
				index--;
			this.owner[this.upperBoundReference]++;
			this.owner[this.raw_addElementAt](element,index);
			element.ownerChanged(this);
			return element;
		}
		/**
		 * @method egret.gui.UILayer#addElementAt
		 * @param element {IVisualElement} 
		 * @param index {number} 
		 * @returns {IVisualElement}
		 */
		public addElementAt(element:IVisualElement, index:number):IVisualElement{
			this.owner[this.upperBoundReference]++;
			this.owner[this.raw_addElementAt](
				element, this.owner[this.lowerBoundReference] + index);
			element.ownerChanged(this);
			return element;
		}
		/**
		 * @method egret.gui.UILayer#removeElement
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
		 */
		public removeElement(element:IVisualElement):IVisualElement{
			var index:number = this.owner[this.raw_getElementIndex](element);
			if (this.owner[this.lowerBoundReference] <= index &&
				index < this.owner[this.upperBoundReference]){
				this.owner[this.raw_removeElement](element);
				this.owner[this.upperBoundReference]--;
			}
			element.ownerChanged(null);
			return element;
		}
		/**
		 * @method egret.gui.UILayer#removeElementAt
		 * @param index {number} 
		 * @returns {IVisualElement}
		 */
		public removeElementAt(index:number):IVisualElement{
			index += this.owner[this.lowerBoundReference];
			var element:IVisualElement;
			if (this.owner[this.lowerBoundReference] <= index &&
				index < this.owner[this.upperBoundReference]){
				element = this.owner[this.raw_removeElementAt](index);
				this.owner[this.upperBoundReference]--;
			}
			element.ownerChanged(null);
			return element;
		}
		/**
		 * @method egret.gui.UILayer#getElementIndex
		 * @param element {IVisualElement} 
		 * @returns {number}
		 */
		public getElementIndex(element:IVisualElement):number{
			var retval:number = this.owner[this.raw_getElementIndex](element);
			retval -= this.owner[this.lowerBoundReference];
			return retval;
		}
		/**
		 * @method egret.gui.UILayer#setElementIndex
		 * @param element {IVisualElement} 
		 * @param index {number} 
		 */
		public setElementIndex(element:IVisualElement, index:number):void{
			this.owner[this.raw_setElementIndex](
				element, this.owner[this.lowerBoundReference] + index);
		}
	}
}