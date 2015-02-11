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
	 * @class egret.gui.SkinnableContainer
	 * @classdesc
	 * 可设置外观的容器的基类
	 * @extends egret.gui.SkinnableComponent
	 * @implements egret.gui.IVisualElementContainer
	 */
    export class SkinnableContainer extends SkinnableComponent implements IVisualElementContainer {
		/**
		 * @method egret.gui.SkinnableContainer#constructor
		 */
        public constructor() {
            super();
            
        }

        /**
         * [SkinPart]实体容器
		 * @member egret.gui.SkinnableContainer#contentGroup
         */
        public contentGroup: Group = null;

        /**
         * 实体容器实例化之前缓存子对象的容器
         */
        public _placeHolderGroup: Group = null;
        /**
         * 获取当前的实体容器
         */
        public _getCurrentContentGroup():Group {
            if (this.contentGroup == null) {
                if (this._placeHolderGroup == null) {
                    this._placeHolderGroup = new Group();
                    this._placeHolderGroup.visible = false;
                    this._addToDisplayList(<DisplayObject><any>this._placeHolderGroup);
                }
                this._placeHolderGroup.addEventListener(
                    ElementExistenceEvent.ELEMENT_ADD, this._contentGroup_elementAddedHandler, this);
                this._placeHolderGroup.addEventListener(
                    ElementExistenceEvent.ELEMENT_REMOVE, this._contentGroup_elementRemovedHandler, this);
                return this._placeHolderGroup;
            }
            else {
                return this.contentGroup;
            }
        }

        /**
         * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
         * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
         */
        public set elementsContent(value:Array<any>) {
            this._getCurrentContentGroup().elementsContent = value;
        }

        /**
         */
        public get numElements():number {
            return this._getCurrentContentGroup().numElements;
        }

        /**
         * 返回指定索引处的可视元素
		 * @param index {number}
		 * @returns {IVisualElement}
         */
        public getElementAt(index:number):IVisualElement {
            return this._getCurrentContentGroup().getElementAt(index);
        }

        /**
         * 将可视元素添加到此容器中
		 * @param element {IVisualElement}
		 * @returns {IVisualElement}
         */
        public addElement(element:IVisualElement):IVisualElement {
            return this._getCurrentContentGroup().addElement(element);
        }

        /**
         * 将可视元素添加到此容器中
		 * @param element {IVisualElement}
		 * @param index {number} 
		 * @returns {IVisualElement}
         */
        public addElementAt(element:IVisualElement, index:number):IVisualElement {
            return this._getCurrentContentGroup().addElementAt(element, index);
        }

        /**
         * 从此容器的子列表中删除指定的可视元素
		 * @param element {IVisualElement}
		 * @returns {IVisualElement}
         */
        public removeElement(element:IVisualElement):IVisualElement {
            return this._getCurrentContentGroup().removeElement(element);
        }

        /**
         * 从容器中的指定索引位置删除可视元素
		 * @param index {number}
		 * @returns {IVisualElement}
         */
        public removeElementAt(index:number):IVisualElement {
            return this._getCurrentContentGroup().removeElementAt(index);
        }

        /**
         * 删除容器中的所有子元素
         */
        public removeAllElements():void {
            this._getCurrentContentGroup().removeAllElements();
        }

        /**
         * 获取子元素对象在容器中的索引值
		 * @param element {IVisualElement}
		 * @returns {number}
         */
        public getElementIndex(element:IVisualElement):number {
            return this._getCurrentContentGroup().getElementIndex(element);
        }

        /**
         * 根据索引设置子元素的显示
		 * @param element {IVisualElement}
		 * @param index {number} 
         */
        public setElementIndex(element:IVisualElement, index:number):void {
            this._getCurrentContentGroup().setElementIndex(element, index);
        }

        /**
         * 交换两个指定可视元素的索引
		 * @param element1 {IVisualElement}
		 * @param element2 {IVisualElement} 
         */
        public swapElements(element1:IVisualElement, element2:IVisualElement):void {
            this._getCurrentContentGroup().swapElements(element1, element2);
        }

        /**
         * 交换容器中位于两个指定索引位置的可视元素
		 * @param index1 {number}
		 * @param index2 {number} 
         */
        public swapElementsAt(index1:number, index2:number):void {
            this._getCurrentContentGroup().swapElementsAt(index1, index2);
        }

        /**
         * contentGroup发生改变时传递的参数
         */
        private contentGroupProperties:any = {};

        /**
         * 此容器的布局对象
		 * @member egret.gui.SkinnableContainer#layout
         */
        public get layout():LayoutBase {
            return this.contentGroup != null ?
                this.contentGroup.layout : this.contentGroupProperties.layout;
        }

        public set layout(value:LayoutBase) {
            if (this.contentGroup != null) {
                this.contentGroup.layout = value;
            }
            else {
                this.contentGroupProperties.layout = value;
            }
        }

        /**
         * [覆盖] 添加外观部件时调用
		 * @param partName {string}
		 * @param instance {any} 
         */
        public partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);
            if (instance == this.contentGroup) {
                if (this.contentGroupProperties.layout !== undefined) {
                    this.contentGroup.layout = this.contentGroupProperties.layout;
                    this.contentGroupProperties = {};
                }
                if (this._placeHolderGroup) {
                    this._placeHolderGroup.removeEventListener(
                        ElementExistenceEvent.ELEMENT_ADD, this._contentGroup_elementAddedHandler, this);
                    this._placeHolderGroup.removeEventListener(
                        ElementExistenceEvent.ELEMENT_REMOVE, this._contentGroup_elementRemovedHandler, this);
                    var sourceContent:Array<any> = this._placeHolderGroup._getElementsContent().concat();
                    for (var i:number = this._placeHolderGroup.numElements; i > 0; i--) {
                        var element:IVisualElement = this._placeHolderGroup.removeElementAt(0);
                        element.ownerChanged(null);
                    }
                    this._removeFromDisplayList(<DisplayObject><any>this._placeHolderGroup);
                    this.contentGroup.elementsContent = sourceContent;
                    for (i = sourceContent.length - 1; i >= 0; i--) {
                        element = sourceContent[i];
                        element.ownerChanged(this);
                    }
                    this._placeHolderGroup = null;
                }
                this.contentGroup.addEventListener(
                    ElementExistenceEvent.ELEMENT_ADD, this._contentGroup_elementAddedHandler, this);
                this.contentGroup.addEventListener(
                    ElementExistenceEvent.ELEMENT_REMOVE, this._contentGroup_elementRemovedHandler, this);
            }
        }

        /**
         * [覆盖] 正删除外观部件的实例时调用
		 * @param partName {string}
		 * @param instance {any} 
         */
        public partRemoved(partName:string, instance:any):void {
            super.partRemoved(partName, instance);
            if (instance == this.contentGroup) {
                this.contentGroup.removeEventListener(
                    ElementExistenceEvent.ELEMENT_ADD, this._contentGroup_elementAddedHandler, this);
                this.contentGroup.removeEventListener(
                    ElementExistenceEvent.ELEMENT_REMOVE, this._contentGroup_elementRemovedHandler, this);
                this.contentGroupProperties.layout = this.contentGroup.layout;
                this.contentGroup.layout = null;
                if (this.contentGroup.numElements > 0) {
                    this._placeHolderGroup = new Group;

                    while (this.contentGroup.numElements > 0) {
                        this._placeHolderGroup.addElement(this.contentGroup.getElementAt(0));
                    }
                    this._placeHolderGroup.addEventListener(
                        ElementExistenceEvent.ELEMENT_ADD, this._contentGroup_elementAddedHandler, this);
                    this._placeHolderGroup.addEventListener(
                        ElementExistenceEvent.ELEMENT_REMOVE, this._contentGroup_elementRemovedHandler, this);
                }
            }
        }

        /**
         * 容器添加元素事件
         */
        public _contentGroup_elementAddedHandler(event:ElementExistenceEvent):void {
            event.element.ownerChanged(this);
            this.dispatchEvent(event);
        }

        /**
         * 容器移除元素事件
         */
        public _contentGroup_elementRemovedHandler(event:ElementExistenceEvent):void {
            event.element.ownerChanged(null);
            this.dispatchEvent(event);
        }

    }
}