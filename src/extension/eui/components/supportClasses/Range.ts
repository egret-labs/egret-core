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

module eui.sys {
    
    /**
     * @private
     */
    export const enum RangeKeys{
        maximum,
        maxChanged,
        minimum,
        minChanged,
        value,
        changedValue,
        valueChanged,
        snapInterval,
        snapIntervalChanged,
        explicitSnapInterval
    }
}

module eui {

    /**
     * @language en_US
     * The Range class holds a value and an allowed range for that
     * value, defined by <code>minimum</code> and <code>maximum</code> properties.
     *
     * The <code>value</code> property
     * is always constrained to be between the current <code>minimum</code> and
     * <code>maximum</code>, and the <code>minimum</code>,
     * and <code>maximum</code> are always constrained
     * to be in the proper numerical order, such that
     * <code>(minimum <= value <= maximum)</code> is <code>true</code>.
     *
     * If the value of the <code>snapInterval</code> property is not 0,
     * then the <code>value</code> property is also constrained to be a multiple of
     * <code>snapInterval</code>.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/supportClasses/RangeExample.ts
     */
    /**
     * @language zh_CN
     * 范围选取组件,该组件包含一个值和这个值所允许的最大最小约束范围。
     *
     * <code>value</code>属性的值永远被限制于当前的<code>minimum</code>和
     * <code>maximum</code>之间，并且<code>minimum</code>和 <code>maximum</code>永远按照固定的顺序排列，
     * 即<code>(minimum <= value <= maximum)</code> 为真。
     *
     * 如果<code>snapInterval</code>属性的值不是0，那么<code>value</code>的值也会被<code>snapInterval</code>所约束。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/supportClasses/RangeExample.ts
     */
    export class Range extends Component {
        /**
         * @language en_US
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 Range 实例。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$Range = {
                0: 100,         //maximum
                1: false,       //maxChanged
                2: 0,           //minimum
                3: false,       //minChanged
                4: 0,           //value
                5: 0,           //changedValue
                6: false,       //valueChanged
                7: 1,           //snapInterval
                8: false,       //snapIntervalChanged
                9: false,       //explicitSnapInterval
            };
        }

        /**
         * @private
         */
        $Range:Object;

        /**
         * @language en_US
         * The maximum valid <code>value</code>.<p/>
         *
         * Changes to the value property are constrained
         * by <code>commitProperties()</code> to be less than or equal to
         * maximum with the <code>nearestValidValue()</code> method.
         *
         * @default 100
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 最大有效值。<p/>
         *
         * 规定<code>value</code>属性的值不能够超过的最大值。该修正过程
         * 将在<code>nearestValidValue()</code>方法中进行。
         *
         * @default 100
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get maximum():number {
            return this.$Range[sys.RangeKeys.maximum];
        }

        public set maximum(value:number) {
            value = +value || 0;
            var values = this.$Range;
            if (value === values[sys.RangeKeys.maximum])
                return;
            values[sys.RangeKeys.maximum] = value;
            values[sys.RangeKeys.maxChanged] = true;
            this.invalidateProperties();
            this.invalidateDisplayList();
        }

        /**
         * @language en_US
         * The minimum valid <code>value</code>.<p/>
         *
         * Changes to the value property are constrained
         * by <code>commitProperties()</code> to be greater than or equal to
         * minimum with the <code>nearestValidValue()</code> method.
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 最小有效值<p/>
         *
         * 规定<code>value</code>属性的值不能够低于的最小值。该修正过程
         * 将在<code>nearestValidValue()</code>方法中进行。
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get minimum():number {
            return this.$Range[sys.RangeKeys.minimum];
        }

        public set minimum(value:number) {
            value = +value || 0;
            var values = this.$Range;
            if (value === values[sys.RangeKeys.minimum])
                return;
            values[sys.RangeKeys.minimum] = value;
            values[sys.RangeKeys.minChanged] = true;
            this.invalidateProperties();
            this.invalidateDisplayList();
        }

        /**
         * @language en_US
         * The current value for this range.<p/>
         *
         * Changes to the value property are constrained
         * by <code>commitProperties()</code> to be greater than or equal to
         * the <code>minimum</code> property, less than or equal to the <code>maximum</code> property, and a
         * multiple of <code>snapInterval</code> with the <code>nearestValidValue()</code>
         * method.
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 此范围的当前值。<p/>
         *
         * 改变的<code>value</code>属性将在<code>commitProperties()</code>方法中被<code>minimum</code>属性
         * 和<code>minimum</code>属性所限制。此修正过程将在<code>nearestValidValue()</code>方法中进行。
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get value():number {
            var values = this.$Range;
            return values[sys.RangeKeys.valueChanged] ?
                values[sys.RangeKeys.changedValue] : values[sys.RangeKeys.value];
        }

        public set value(newValue:number) {
            newValue = +newValue || 0;
            this.$setValue(newValue);
        }

        /**
         * @private
         * 
         * @param newValue 
         */
        $setValue(newValue:number):boolean {
            if (newValue === this.value)
                return false;
            var values = this.$Range;
            values[sys.RangeKeys.changedValue] = newValue;
            values[sys.RangeKeys.valueChanged] = true;
            this.invalidateProperties();

            return true;
        }

        /**
         * @language en_US
         * The snapInterval property controls the valid values of the <code>value</code> property.
         *
         * If nonzero, valid values are the sum of the <code>minimum</code> and integer multiples
         * of this property, for all sums that are less than or equal to the <code>maximum</code>.<p/>
         *
         * For example, if <code>minimum</code> is 10, <code>maximum</code> is 20, and this property is 3, then the
         * valid values of this Range are 10, 13, 16, 19, and 20.<p/>
         *
         * If the value of this property is zero, then valid values are only constrained
         * to be between minimum and maximum inclusive.
         *
         * @default 1
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * snapInterval 属性定义 value 属性的有效值。
         * 如果为非零，则有效值为 minimum 与此属性的整数倍数之和，且小于或等于 maximum。</p>
         *
         * 例如，如果 minimum 为 10，maximum 为 20，而此属性为 3，则可能的有效值为 10、13、16、19 和 20.</p>
         *
         * 如果此属性的值为零，则仅会将有效值约束到介于 minimum 和 maximum 之间（包括两者）。
         *
         * @default 1
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get snapInterval():number {
            return this.$Range[sys.RangeKeys.snapInterval];
        }

        public set snapInterval(value:number) {
            var values = this.$Range;
            values[sys.RangeKeys.explicitSnapInterval] = true;
            value = +value || 0;
            if (value === values[sys.RangeKeys.snapInterval])
                return;
            if (isNaN(value)) {
                values[sys.RangeKeys.snapInterval] = 1;
                values[sys.RangeKeys.explicitSnapInterval] = false;
            }
            else {
                values[sys.RangeKeys.snapInterval] = value;
            }

            values[sys.RangeKeys.snapIntervalChanged] = true;

            this.invalidateProperties();
        }

        /**
         * @language en_US
         * Processes the properties set on the component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 处理对组件设置的属性
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            super.commitProperties();
            var values = this.$Range;
            if (values[sys.RangeKeys.minimum] > values[sys.RangeKeys.maximum]) {

                if (!values[sys.RangeKeys.maxChanged])
                    values[sys.RangeKeys.minimum] = values[sys.RangeKeys.maximum];
                else
                    values[sys.RangeKeys.maximum] = values[sys.RangeKeys.minimum];
            }

            if (values[sys.RangeKeys.valueChanged] || values[sys.RangeKeys.maxChanged] ||
                values[sys.RangeKeys.minChanged] || values[sys.RangeKeys.snapIntervalChanged]) {
                var currentValue = values[sys.RangeKeys.valueChanged] ?
                    values[sys.RangeKeys.changedValue] : values[sys.RangeKeys.value];
                values[sys.RangeKeys.valueChanged] = false;
                values[sys.RangeKeys.maxChanged] = false;
                values[sys.RangeKeys.minChanged] = false;
                values[sys.RangeKeys.snapIntervalChanged] = false;
                this.setValue(this.nearestValidValue(currentValue, values[sys.RangeKeys.snapInterval]));
            }
        }

        /**
         * @private
         * 修正size到最接近snapInterval的整数倍
         */
        private nearestValidSize(size:number):number {
            var interval:number = this.snapInterval;
            if (interval == 0)
                return size;

            var validSize:number = Math.round(size / interval) * interval;
            return (Math.abs(validSize) < interval) ? interval : validSize;
        }

        /**
         * @language en_US
         * Returns the sum of the minimum with an integer multiple of <code>interval</code> that's
         * closest to <code>value</code>, unless <code>value</code> is closer to the maximum limit,
         * in which case the maximum is returned.<p/>
         *
         * If <code>interval</code> is equal to 0, the value is clipped to the minimum and maximum
         * limits.<p/>
         *
         * The valid values for a range are defined by the sum of the <code>minimum</code> property
         * with multiples of the <code>interval</code> and also defined to be less than or equal to the
         * <code>maximum</code> property.
         * The maximum need not be a multiple of <code>snapInterval</code>.<p/>
         *
         * For example, if <code>minimum</code> is equal to 1, <code>maximum</code> is equal to 6,
         * and <code>snapInterval</code> is equal to 2, the valid
         * values for the Range are 1, 3, 5, 6.
         *
         * Similarly, if <code>minimum</code> is equal to 2, <code>maximum</code> is equal to 9,
         * and <code>snapInterval</code> is equal to 1.5, the valid
         * values for the Range are 2, 3.5, 5, 6.5, 8, and 9.
         *
         * @param value The input value.
         * @param interval The value of snapInterval or an integer multiple of snapInterval.
         * @return The valid value that's closest to the input.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回 <code>minimum</code> 与最接近 <code>value</code> 的 <code>interval</code> 的整数倍数之和，
         * 除非 <code>value</code> 接近最大值限制的时候会返回 maximum。<p/>
         *
         * 如果 <code>interval</code> 等于 0，则会将该值剪裁到限制的最小值和最大值。<p/>
         *
         * 范围的有效值由 <code>minimum</code> 属性与 <code>interval</code> 的倍数之和决定，
         * 与此同时也要小于等于 <code>maximum</code> 属性。
         * 最大值不能是 <code>snapInterval</code> 属性的倍数。<p/>
         *
         * 例如，如果 <code>minimum</code> 等于 1，<code>maximum</code> 等于 6，且 <code>snapInterval</code> 等于 3，
         * 则 Range 的有效值有 1、2、5、6。
         *
         * 类似地，如果 <code>minimum</code> 等于 2，<code>maximum</code> 等于 9，
         * 且 <code>snapInterval</code> 等于 1.5，则 Range 的有效值有 2、3.5、5、6.5、8 和 9。
         *
         *
         * @param value 输入值。
         * @param interval snapInterval 的值，或 snapInterval 的整数倍数。
         * @return 最近接输入值的有效值。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected nearestValidValue(value:number, interval:number):number {
            var values = this.$Range;
            if (interval == 0)
                return Math.max(values[sys.RangeKeys.minimum], Math.min(values[sys.RangeKeys.maximum], value));

            var maxValue = values[sys.RangeKeys.maximum] - values[sys.RangeKeys.minimum];
            var scale = 1;

            value -= values[sys.RangeKeys.minimum];
            if (interval != Math.round(interval)) {
                var parts = ((1 + interval).toString()).split(".");
                scale = Math.pow(10, parts[1].length);
                maxValue *= scale;
                value = Math.round(value * scale);
                interval = Math.round(interval * scale);
            }

            var lower = Math.max(0, Math.floor(value / interval) * interval);
            var upper = Math.min(maxValue, Math.floor((value + interval) / interval) * interval);
            var validValue = ((value - lower) >= ((upper - lower) / 2)) ? upper : lower;

            return (validValue / scale) + values[sys.RangeKeys.minimum];
        }

        /**
         * @language en_US
         * Sets the current value for the <code>value</code> property.<p/>
         *
         * This method assumes that the caller has already used the <code>nearestValidValue()</code> method
         * to constrain the value parameter
         *
         * @param value The new value of the <code>value</code> property.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置当前值。<p/>
         *
         * 此方法假定调用者已经使用了 nearestValidValue() 方法来约束 value 参数。
         *
         * @param value value属性的新值
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setValue(value:number):void {
            var values = this.$Range;
            if (values[sys.RangeKeys.value] === value)
            return;
            if (values[sys.RangeKeys.maximum] > values[sys.RangeKeys.minimum])
                values[sys.RangeKeys.value] = Math.min(values[sys.RangeKeys.maximum],
                    Math.max(values[sys.RangeKeys.minimum], value));
            else
                values[sys.RangeKeys.value] = value;
            values[sys.RangeKeys.valueChanged] = false;
            this.invalidateDisplayList();
            PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"value");
        }

        /**
         * @language en_US
         * Draws the object and/or sizes and positions its children.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制对象和/或设置其子项的大小和位置
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(w:number, h:number):void {
            super.updateDisplayList(w, h);
            this.updateSkinDisplayList();
        }

        /**
         * @language en_US
         * Update size and visible of skin parts.<p/>
         * Subclasses override this method to update skin parts display based on <code>minimum</code>, <code>maximum</code>
         * and <code>value</code> properties.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 更新皮肤部件（通常为滑块）的大小和可见性。<p/>
         * 子类覆盖此方法以基于 minimum、maximum 和 value 属性更新滑块的大小、位置和可见性。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateSkinDisplayList():void {
        }
    }

    registerBindable(Range.prototype,"value");
}