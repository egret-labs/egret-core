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
     * @language en_US
     * The BasicLayout class arranges the layout elements according to their individual settings,
     * independent of each-other. BasicLayout, also called absolute layout, requires that you
     * explicitly position each container child.
     * You can use the <code>x</code> and <code>y</code> properties of the child,
     * or constraints to position each child.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/BasicLayoutExample.ts
     */
    /**
     * @language zh_CN
     * BasicLayout 类根据其各个设置彼此独立地排列布局元素。
     * BasicLayout（也称为绝对布局）要求显式定位每个容器子代。
     * 可以使用子代的 <code>x</code> 和 <code>y</code> 属性，或使用约束来定位每个子代。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/BasicLayoutExample.ts
     */
    export class BasicLayout extends LayoutBase {

        /**
         * @language en_US
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
        }


        /**
         * @language en_US
         * BasicLayout does not support virtual layout, setting this property is invalid.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * BasicLayout不支持虚拟布局，设置这个属性无效。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public useVirtualLayout:boolean;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public measure():void {
            super.measure();
            sys.measure(this.$target);
        }


        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            var target = this.$target;
            var pos = sys.updateDisplayList(target,unscaledWidth,unscaledHeight);
            target.setContentSize(Math.ceil(pos.x), Math.ceil(pos.y));
        }
    }

    if (DEBUG) {
        Object.defineProperty(BasicLayout.prototype, "useVirtualLayout", {
            /**
             * 此布局不支持虚拟布局，设置这个属性无效
             */
            get: function () {
                return this.$useVirtualLayout;
            },
            set: function (value) {
                egret.$error(2201);
            },
            enumerable: true,
            configurable: true
        });
    }
}

module eui.sys {

    var UIComponentClass = "eui.UIComponent";

    /**
     * @private
     * 一个工具方法，使用BasicLayout规则测量目标对象。
     */
    export function measure(target:eui.Group|eui.Component):void{
        if(!target){
            return;
        }
        var width = 0;
        var height = 0;
        var bounds = egret.$TempRectangle;
        var count = target.numChildren;
        for (var i = 0; i < count; i++) {
            var layoutElement = <eui.UIComponent> (target.getChildAt(i));
            if (!egret.is(layoutElement,UIComponentClass) || !layoutElement.$includeInLayout) {
                continue;
            }

            var values = layoutElement.$UIComponent;
            var hCenter = values[sys.UIKeys.horizontalCenter];
            var vCenter = values[sys.UIKeys.verticalCenter];
            var left = values[sys.UIKeys.left];
            var right = values[sys.UIKeys.right];
            var top = values[sys.UIKeys.top];
            var bottom = values[sys.UIKeys.bottom];

            var extX:number;
            var extY:number;

            layoutElement.getPreferredBounds(bounds);

            if (!isNaN(left) && !isNaN(right)) {
                extX = left + right;
            }
            else if (!isNaN(hCenter)) {
                extX = Math.abs(hCenter) * 2;
            }
            else if (!isNaN(left) || !isNaN(right)) {
                extX = isNaN(left) ? 0 : left;
                extX += isNaN(right) ? 0 : right;
            }
            else {
                extX = bounds.x;
            }

            if (!isNaN(top) && !isNaN(bottom)) {
                extY = top + bottom;
            }
            else if (!isNaN(vCenter)) {
                extY = Math.abs(vCenter) * 2;
            }
            else if (!isNaN(top) || !isNaN(bottom)) {
                extY = isNaN(top) ? 0 : top;
                extY += isNaN(bottom) ? 0 : bottom;
            }
            else {
                extY = bounds.y;
            }

            var preferredWidth = bounds.width;
            var preferredHeight = bounds.height;
            width = Math.ceil(Math.max(width, extX + preferredWidth));
            height = Math.ceil(Math.max(height, extY + preferredHeight));
        }

        target.setMeasuredSize(width,height);
    }

    /**
     * @private
     * 一个工具方法，使用BasicLayout规则布局目标对象。
     */
    export function updateDisplayList(target:eui.Group|eui.Component,
                                                 unscaledWidth:number, unscaledHeight:number):egret.Point{
        if (!target)
            return;

        var count = target.numChildren;

        var maxX = 0;
        var maxY = 0;
        var bounds = egret.$TempRectangle;
        for (var i = 0; i < count; i++) {
            var layoutElement = <eui.UIComponent> (target.getChildAt(i));
            if (!egret.is(layoutElement,UIComponentClass) || !layoutElement.$includeInLayout) {
                continue;
            }

            var values = layoutElement.$UIComponent;
            var hCenter = values[sys.UIKeys.horizontalCenter];
            var vCenter = values[sys.UIKeys.verticalCenter];
            var left = values[sys.UIKeys.left];
            var right = values[sys.UIKeys.right];
            var top = values[sys.UIKeys.top];
            var bottom = values[sys.UIKeys.bottom];
            var percentWidth = values[sys.UIKeys.percentWidth];
            var percentHeight = values[sys.UIKeys.percentHeight];

            var childWidth = NaN;
            var childHeight = NaN;

            if (!isNaN(left) && !isNaN(right)) {
                childWidth = unscaledWidth - right - left;
            }
            else if (!isNaN(percentWidth)) {
                childWidth = Math.round(unscaledWidth * Math.min(percentWidth * 0.01, 1));
            }

            if (!isNaN(top) && !isNaN(bottom)) {
                childHeight = unscaledHeight - bottom - top;
            }
            else if (!isNaN(percentHeight)) {
                childHeight = Math.round(unscaledHeight * Math.min(percentHeight * 0.01, 1));
            }

            layoutElement.setLayoutBoundsSize(childWidth, childHeight);
            layoutElement.getLayoutBounds(bounds);
            var elementWidth = bounds.width;
            var elementHeight = bounds.height;


            var childX = NaN;
            var childY = NaN;

            if (!isNaN(hCenter))
                childX = Math.round((unscaledWidth - elementWidth) / 2 + hCenter);
            else if (!isNaN(left))
                childX = left;
            else if (!isNaN(right))
                childX = unscaledWidth - elementWidth - right;
            else
                childX = bounds.x;

            if (!isNaN(vCenter))
                childY = Math.round((unscaledHeight - elementHeight) / 2 + vCenter);
            else if (!isNaN(top))
                childY = top;
            else if (!isNaN(bottom))
                childY = unscaledHeight - elementHeight - bottom;
            else
                childY = bounds.y;

            layoutElement.setLayoutBoundsPosition(childX, childY);

            maxX = Math.max(maxX, childX + elementWidth);
            maxY = Math.max(maxY, childY + elementHeight);
        }
        return egret.$TempPoint.setTo(maxX,maxY);
    }
}