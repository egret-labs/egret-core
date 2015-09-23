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


module eui {

    /**
     * @private
     * 存储根据groupName自动创建的RadioButtonGroup列表
     */
    var automaticRadioButtonGroups = {};

    /**
     * @language en_US
     * The RadioButton component allows the user make a single choice
     * within a set of mutually exclusive choices.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/RadioButtonExample.ts
     */
    /**
     * @language zh_CN
     * RadioButton 组件使用户可在一组互相排斥的选择中做出一种选择
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/RadioButtonExample.ts
     */
    export class RadioButton extends ToggleButton {

        /**
         * @language en_US
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.groupName = "radioGroup";
        }

        /**
         * @private
         * 在RadioButtonGroup中的索引
         */
        $indexNumber:number = 0;
        /**
         * @private
         * 所属的RadioButtonGroup
         */
        $radioButtonGroup:RadioButtonGroup = null;

        /**
         * @language en_US
         * The RadioButton component is enabled if the
         * RadioButtonGroup is enabled and the RadioButton itself is enabled.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果 RadioButtonGroup 启用且 RadioButton 本身也启用，则 RadioButton 组件启用。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get enabled():boolean {
            if (!this.$Component[sys.ComponentKeys.enabled]) {
                return false;
            }
            return !this.$radioButtonGroup ||
                this.$radioButtonGroup.$enabled;
        }

        public set enabled(value:boolean) {
            this.$setEnabled(value);
        }

        /**
         * @private
         */
        private _group:RadioButtonGroup = null;
        /**
         * @language en_US
         * The RadioButtonGroup component to which this RadioButton belongs.
         * If this property is not set,
         * a unique RadioButtonGroup is created automatically based on the groupName property.
         *
         * @see eui.RadioButton#groupName
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 此 RadioButton 所属的 RadioButtonGroup 组件。
         * 若不设置此属性，则根据groupName属性自动创建一个唯一的RadioButtonGroup。
         *
         * @see eui.RadioButton#groupName
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get group():RadioButtonGroup {
            if (!this._group && this._groupName) {
                var g:RadioButtonGroup = automaticRadioButtonGroups[this._groupName];
                if (!g) {
                    g = new RadioButtonGroup();
                    g.$name = this._groupName;
                    automaticRadioButtonGroups[this._groupName] = g;
                }
                this._group = g;
            }
            return this._group;
        }

        public set group(value:RadioButtonGroup) {
            if (this._group == value)
                return;
            if (this.$radioButtonGroup)
                this.$radioButtonGroup.$removeInstance(this, false);
            this._group = value;
            this._groupName = value ? this.group.$name : "radioGroup";
            this.groupChanged = true;

            this.invalidateProperties();
            this.invalidateDisplayList();
        }

        /**
         * @private
         */
        private groupChanged:boolean = false;

        /**
         * @private
         */
        private _groupName:string = "radioGroup";
        /**
         * @language en_US
         * Specifies the name of the group to which this RadioButton component belongs
         *
         * @default “radioGroup”
         *
         * @see eui.RadioButton#group
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * RadioButton 组件所属的组的名称
         *
         * @default “radioGroup”
         *
         * @see eui.RadioButton#group
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get groupName():string {
            return this._groupName;
        }

        public set groupName(value:string) {
            if (!value || value == "")
                return;
            this._groupName = value;
            if (this.$radioButtonGroup)
                this.$radioButtonGroup.$removeInstance(this, false);
            this._group = null;
            this.groupChanged = true;
            this.invalidateProperties();
            this.invalidateDisplayList();
        }

        /**
         * @private
         * 
         * @param value 
         */
        $setSelected(value:boolean):boolean{
            var result:boolean = super.$setSelected(value);
            this.invalidateDisplayList();

            return result;
        }


        /**
         * @private
         */
        private _value:any = null;
        /**
         * @language en_US
         * Optional user-defined value
         * that is associated with a RadioButton component.
         *
         * @default null
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 与 RadioButton 组件关联的可选用户定义值。
         *
         * @default null
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get value():any {
            return this._value;
        }

        public set value(value:any) {
            if (this._value == value)
                return;

            this._value = value;

            if (this.$selected && this.group){
                PropertyEvent.dispatchPropertyEvent(this.group,PropertyEvent.PROPERTY_CHANGE,"selectedValue");
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            if (this.groupChanged) {
                this.addToGroup();
                this.groupChanged = false;
            }
            super.commitProperties();
        }


        /**
         * @inheritDoc
         * 
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            if (this.group) {
                if (this.$selected)
                    this._group.$setSelection(this, false);
                else if (this.group.selection == this)
                    this._group.$setSelection(null, false);
            }
        }

        /**
         * @inheritDoc
         * 
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected buttonReleased():void {
            if (!this.enabled || this.selected)
                return;
            if (!this.$radioButtonGroup)
                this.addToGroup();
            super.buttonReleased();
            this.group.$setSelection(this, true);
        }

        /**
         * @private
         * 添此单选按钮加到组
         */
        private addToGroup():RadioButtonGroup {
            var g:RadioButtonGroup = this.group;
            if (g)
                g.$addInstance(this);
            return g;
        }
    }

}