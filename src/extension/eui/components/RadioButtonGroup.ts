//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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


namespace eui {

    let groupCount:number = 0;

    /**
     * @private
     * 显示列表深度排序
     */
    function breadthOrderCompare(a:egret.DisplayObject, b:egret.DisplayObject):number {
        let aParent = a.parent;
        let bParent = b.parent;

        if (!aParent || !bParent)
            return 0;

        let aNestLevel = a.$nestLevel;
        let bNestLevel = b.$nestLevel;

        let aIndex = 0;
        let bIndex = 0;

        if (aParent == bParent) {
            aIndex = aParent.getChildIndex(a);
            bIndex = bParent.getChildIndex(b);
        }

        if (aNestLevel > bNestLevel || aIndex > bIndex)
            return 1;
        if (aNestLevel < bNestLevel || bIndex > aIndex)
            return -1;
        if (a == b)
            return 0;
        return breadthOrderCompare(aParent, bParent);
    }


    /**
     * The RadioButtonGroup component defines a group of RadioButton components
     * that act as a single mutually exclusive component; therefore,
     * a user can select only one RadioButton component at a time.
     *
     * @event egret.Event.CHANGE Dispatched when the value of the selected RadioButton component in
     * this group changes.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/RadioButtonGroupExample.ts
     * @language en_US
     */
    /**
     * RadioButtonGroup 组件定义一组 RadioButton 组件，这些组件相互排斥；因此，用户每次只能选择一个 RadioButton 组件
     *
     * @event egret.Event.CHANGE 此组中所选 RadioButton 组件的值更改时分派。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/RadioButtonGroupExample.ts
     * @language zh_CN
     */
    export class RadioButtonGroup extends egret.EventDispatcher {

        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            super();
            this.$name = "_radioButtonGroup" + groupCount++;
        }

        /**
         * @private
         * 组名
         */
        $name:string = null;
        /**
         * @private
         * 单选按钮列表
         */
        private radioButtons:RadioButton[] = [];

        /**
         * Returns the RadioButton component at the specified index.
         *
         * @param index The 0-based index of the RadioButton in the
         * RadioButtonGroup.
         *
         * @return The specified RadioButton component if index is between
         * 0 and <code>numRadioButtons</code> - 1.  Returns
         * <code>null</code> if the index is invalid.
         *
         * @see eui.RadioButtonGroup#numRadioButtons
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回指定索引处的 RadioButton 组件。
         *
         * @param index RadioButtonGroup 中的 RadioButton 的从零开始的索引。
         *
         * @return 当索引位于 0 和 <code>numRadioButtons</code> 之间时，指定的 RadioButton 组件为 1。
         * 如果索引无效，则返回 <code>null</code>。
         *
         * @see eui.RadioButtonGroup#numRadioButtons
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public getRadioButtonAt(index:number):RadioButton {
            return this.radioButtons[index];
        }

        /**
         * @private
         */
        $enabled:boolean = true;

        /**
         * Determines whether selection is allowed.  Note that the value returned
         * only reflects the value that was explicitly set on the
         * <code>RadioButtonGroup</code> and does not reflect any values explicitly
         * set on the individual RadioButtons.
         *
         * @default true
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 确定是否允许选择。请注意，返回的值仅反映对 <code>RadioButtonGroup</code> 显式设置的值，
         * 而不反映对各个 RadioButton 显式设置的任何值。
         *
         * @default true
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get enabled():boolean {
            return this.$enabled;
        }

        public set enabled(value:boolean) {
            value = !!value;
            if (this.$enabled === value)
                return;
            this.$enabled = value;
            let buttons = this.radioButtons;
            let length = buttons.length;
            for (let i = 0; i < length; i++)
                buttons[i].invalidateState();
        }

        /**
         * The number of RadioButtons that belong to this RadioButtonGroup.
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         *  属于此 RadioButtonGroup 的 RadioButton 数。
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get numRadioButtons():number {
            return this.radioButtons.length;
        }

        /**
         * @private
         */
        private _selectedValue:any = null;
        /**
         * The <code>value</code> property of the selected
         * RadioButton component in the group, if it has been set,
         * otherwise, the <code>label</code> property of the selected RadioButton.
         * If no RadioButton is selected, this property is <code>null</code>.
         *
         * <p>If you set <code>selectedValue</code>, selects the
         * first RadioButton component whose <code>value</code> or
         * <code>label</code> property matches this value.</p>
         *
         * @default null
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 组中所选 RadioButton 组件的 <code>value</code> 属性（如果未设置），
         * 否则为所选 RadioButton 组件的 <code>label</code> 属性。
         * 如果未选择任何 RadioButton，则此属性为 <code>null</code>。
         *
         * <p>如果设置了 <code>selectedValue</code>，则会选择 <code>value</code> 或 <code>label</code> 属性
         * 与此值匹配的第一个 RadioButton 组件。</p>
         *
         * @default null
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get selectedValue():any {
            if (this.selection) {
                return this.selection.value != null ?
                    this.selection.value :
                    this.selection.label;
            }
            return null;
        }

        public set selectedValue(value:any) {
            this._selectedValue = value;
            if (value == null) {
                this.$setSelection(null, false);
                return;
            }
            let n = this.numRadioButtons;
            for (let i = 0; i < n; i++) {
                let radioButton = this.radioButtons[i];
                if (radioButton.value == value ||
                    radioButton.label == value) {
                    this.changeSelection(i, false);
                    this._selectedValue = null;
                    PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedValue");
                    break;
                }
            }
        }

        /**
         * @private
         */
        private _selection:RadioButton = null;
        /**
         * Contains a reference to the currently selected
         * RadioButton component in the group.This property is valid only
         * when the target RadioButton is displayed on the display list
         *
         * @default null
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当前被选中的单选按钮引用。此属性仅当目标RadioButton在显示列表时有效。
         *
         * @default null
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get selection():RadioButton {
            return this._selection;
        }

        public set selection(value:RadioButton) {
            if (this._selection == value)
                return;
            this.$setSelection(value, false);
        }

        /**
         * @private
         * 添加单选按钮到组内
         */
        $addInstance(instance:RadioButton):void {
            instance.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedHandler, this);
            let buttons = this.radioButtons;
            buttons.push(instance);
            buttons.sort(breadthOrderCompare);
            let length = buttons.length;
            for (let i = 0; i < length; i++) {
                buttons[i].$indexNumber = i;
            }
            if (this._selectedValue)
                this.selectedValue = this._selectedValue;
            if (instance.selected == true)
                this.selection = instance;

            instance.$radioButtonGroup = this;
            instance.invalidateState();
        }

        /**
         * @private
         * 从组里移除单选按钮
         */
        $removeInstance(instance:RadioButton, addListener?:boolean):void {
            if (instance) {
                let foundInstance = false;
                let buttons = this.radioButtons;
                let length = buttons.length;
                for (let i = 0; i < length; i++) {
                    let rb = buttons[i];
                    if (foundInstance) {
                        rb.$indexNumber = rb.$indexNumber - 1;
                    }
                    else if (rb == instance) {
                        if (addListener)
                            instance.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedHandler, this);
                        if (instance == this._selection)
                            this._selection = null;
                        instance.$radioButtonGroup = null;
                        instance.invalidateState();
                        this.radioButtons.splice(i, 1);
                        foundInstance = true;
                        i--;
                        length--;
                    }
                }
            }
        }

        /**
         * @private
         * 设置选中的单选按钮
         */
        $setSelection(value:RadioButton, fireChange?:boolean):boolean {
            if (this._selection == value)
                return false;

            if (!value) {
                if (this._selection) {
                    this._selection.selected = false;
                    this._selection = null;
                    if (fireChange)
                        this.dispatchEventWith(egret.Event.CHANGE);
                }
            }
            else {
                let n = this.numRadioButtons;
                for (let i = 0; i < n; i++) {
                    if (value == this.getRadioButtonAt(i)) {
                        this.changeSelection(i, fireChange);
                        break;
                    }
                }
            }
            PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedValue");
            return true;
        }

        /**
         * @private
         * 改变选中项
         */
        private changeSelection(index:number, fireChange?:boolean):void {
            let rb = this.getRadioButtonAt(index);
            if (rb && rb != this._selection) {

                if (this._selection)
                    this._selection.selected = false;
                this._selection = rb;
                this._selection.selected = true;
                if (fireChange)
                    this.dispatchEventWith(egret.Event.CHANGE);
            }
        }


        /**
         * @private
         * 单选按钮添加到显示列表
         */
        private addedHandler(event:egret.Event):void {
            let rb:RadioButton = event.target;
            if (rb == event.currentTarget) {
                rb.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedHandler, this);
                this.$addInstance(rb);
            }
        }

        /**
         * @private
         * 单选按钮从显示列表移除
         */
        private removedHandler(event:egret.Event):void {
            let rb:RadioButton = event.target;
            if (rb == event.currentTarget) {
                rb.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedHandler, this);
                this.$removeInstance(rb, true);
            }
        }
    }
    registerBindable(RadioButtonGroup.prototype,"selectedValue");

}