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

/// <reference path="../core/IContainer.ts"/>
/// <reference path="../core/IVisualElement.ts"/>

module ns_egret {

	export class SystemContainer implements IContainer{
		/**
		 * 构造函数
		 */		
		public constructor(owner:ISystemManager,
										lowerBoundReference:QName,
										upperBoundReference:QName){
			this.owner = owner;
			this.lowerBoundReference = lowerBoundReference;
			this.upperBoundReference = upperBoundReference;
		}
		/**
		 * 实体容器
		 */		
		private owner:ISystemManager;
		
		/**
		 * 容器下边界属性
		 */		
		private lowerBoundReference:QName;
		
		/**
		 * 容器上边界属性
		 */		
		private upperBoundReference:QName;
		/**
		 * @inheritDoc
		 */
		public get numElements():number{
			return this.owner[this.upperBoundReference] - this.owner[this.lowerBoundReference];
		}
		
		private raw_getElementAt:QName = new QName(dx_internal, "raw_getElementAt");
		private raw_addElementAt:QName = new QName(dx_internal, "raw_addElementAt");
		private raw_getElementIndex:QName = new QName(dx_internal, "raw_getElementIndex");
		private raw_removeElement:QName = new QName(dx_internal, "raw_removeElement");
		private raw_removeElementAt:QName = new QName(dx_internal, "raw_removeElementAt");
		private raw_setElementIndex:QName = new QName(dx_internal, "raw_setElementIndex");
		/**
		 * @inheritDoc
		 */
		public getElementAt(index:number):IVisualElement{
			var retval:IVisualElement =
				this.owner[this.raw_getElementAt](
					this.owner[this.lowerBoundReference] + index);
			return retval;
		}
		/**
		 * @inheritDoc
		 */
		public addElement(element:IVisualElement):IVisualElement{
			var index:number = this.owner[this.upperBoundReference];
			if(element.parent==this.owner)
				index--;
			this.owner[this.upperBoundReference]++;
			this.owner[this.raw_addElementAt](element,index);
			element.ownerChanged(this);
			return element;
		}
		/**
		 * @inheritDoc
		 */
		public addElementAt(element:IVisualElement, index:number):IVisualElement{
			this.owner[this.upperBoundReference]++;
			this.owner[this.raw_addElementAt](
				element, this.owner[this.lowerBoundReference] + index);
			element.ownerChanged(this);
			return element;
		}
		/**
		 * @inheritDoc
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
		 * @inheritDoc
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
		 * @inheritDoc
		 */
		public getElementIndex(element:IVisualElement):number{
			var retval:number = this.owner[this.raw_getElementIndex](element);
			retval -= this.owner[this.lowerBoundReference];
			return retval;
		}
		/**
		 * @inheritDoc
		 */
		public setElementIndex(element:IVisualElement, index:number):void{
			this.owner[this.raw_setElementIndex](
				element, this.owner[this.lowerBoundReference] + index);
		}
	}
}