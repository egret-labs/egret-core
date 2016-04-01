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

    var UIComponentClass = "eui.UIComponent";

    /**
     * @language en_US
     * The HorizontalLayout class arranges the layout elements in a horizontal sequence,
     * left to right, with optional gaps between the elements and optional padding
     * around the elements.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/HorizontalLayoutExample.ts
     */
    /**
     * @language zh_CN
     * HorizontalLayout 类按水平顺序从左到右排列布局元素，在元素和围绕元素的可选填充之间带有可选间隙。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/HorizontalLayoutExample.ts
     */
    export class HorizontalLayout extends LinearLayoutBase {

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected measureReal():void {
            var target = this.$target;
            var count = target.numElements;
            var numElements = count;
            var measuredWidth = 0;
            var measuredHeight = 0;
            var bounds = egret.$TempRectangle;
            for (var i = 0; i < count; i++) {
                var layoutElement = <UIComponent> (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    numElements--;
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredWidth += bounds.width;
                measuredHeight = Math.max(measuredHeight, bounds.height);
            }
            measuredWidth += (numElements - 1) * this.$gap;
            var hPadding = this.$paddingLeft + this.$paddingRight;
            var vPadding = this.$paddingTop + this.$paddingBottom;
            target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected measureVirtual():void {
            var target = this.$target;
            var typicalWidth = this.$typicalWidth;
            var measuredWidth = this.getElementTotalSize();
            var measuredHeight = Math.max(this.maxElementSize, this.$typicalHeight);
            var bounds = egret.$TempRectangle;
            var endIndex = this.endIndex;
            var elementSizeTable = this.elementSizeTable;
            for (var index = this.startIndex; index < endIndex; index++) {
                var layoutElement = <UIComponent> (target.getElementAt(index));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredWidth += bounds.width;
                measuredWidth -= isNaN(elementSizeTable[index]) ? typicalWidth : elementSizeTable[index];
                measuredHeight = Math.max(measuredHeight, bounds.height);
            }
            var hPadding = this.$paddingLeft + this.$paddingRight;
            var vPadding = this.$paddingTop + this.$paddingBottom;
            target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayListReal(width:number, height:number):void {
            var target = this.$target;
            var paddingL = this.$paddingLeft;
            var paddingR = this.$paddingRight;
            var paddingT = this.$paddingTop;
            var paddingB = this.$paddingBottom;
            var gap = this.$gap;
            var targetWidth = Math.max(0, width - paddingL - paddingR);
            var targetHeight = Math.max(0, height - paddingT - paddingB);

            var hJustify = this.$horizontalAlign == JustifyAlign.JUSTIFY;
            var vJustify = this.$verticalAlign == JustifyAlign.JUSTIFY || this.$verticalAlign == JustifyAlign.CONTENT_JUSTIFY;
            var vAlign = 0;
            if (!vJustify) {
                if (this.$verticalAlign == egret.VerticalAlign.MIDDLE) {
                    vAlign = 0.5;
                }
                else if (this.$verticalAlign == egret.VerticalAlign.BOTTOM) {
                    vAlign = 1;
                }
            }

            var count = target.numElements;
            var numElements = count;
            var x = paddingL;
            var y = paddingT;
            var i:number;
            var layoutElement:UIComponent;

            var totalPreferredWidth = 0;
            var totalPercentWidth = 0;
            var childInfoArray:any[] = [];
            var childInfo:sys.ChildInfo;
            var widthToDistribute = targetWidth;
            var maxElementHeight = this.maxElementSize;
            var bounds = egret.$TempRectangle;
            for (i = 0; i < count; i++) {
                var layoutElement = <UIComponent> (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    numElements--;
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                maxElementHeight = Math.max(maxElementHeight, bounds.height);
                if (hJustify) {
                    totalPreferredWidth += bounds.width;
                }
                else {
                    var values = layoutElement.$UIComponent;
                    if (!isNaN(values[sys.UIKeys.percentWidth])) {
                        totalPercentWidth += values[sys.UIKeys.percentWidth];

                        childInfo = new sys.ChildInfo();
                        childInfo.layoutElement = layoutElement;
                        childInfo.percent = values[sys.UIKeys.percentWidth];
                        childInfo.min = values[sys.UIKeys.minWidth];
                        childInfo.max = values[sys.UIKeys.maxWidth];
                        childInfoArray.push(childInfo);

                    }
                    else {
                        widthToDistribute -= bounds.width;
                    }
                }
            }
            widthToDistribute -= gap * (numElements - 1);
            widthToDistribute = widthToDistribute > 0 ? widthToDistribute : 0;
            var excessSpace = targetWidth - totalPreferredWidth - gap * (numElements - 1);

            var averageWidth:number;
            var largeChildrenCount = numElements;
            var widthDic:any = {};
            if (hJustify) {
                if (excessSpace < 0) {
                    averageWidth = widthToDistribute / numElements;
                    for (i = 0; i < count; i++) {
                        layoutElement = <UIComponent> (target.getElementAt(i));
                        if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                            continue;
                        }

                        layoutElement.getPreferredBounds(bounds);
                        if (bounds.width <= averageWidth) {
                            widthToDistribute -= bounds.width;
                            largeChildrenCount--;
                            continue;
                        }
                    }
                    widthToDistribute = widthToDistribute > 0 ? widthToDistribute : 0;
                }
            }
            else {
                if (totalPercentWidth > 0) {
                    this.flexChildrenProportionally(targetWidth, widthToDistribute,
                        totalPercentWidth, childInfoArray);
                    var roundOff = 0;
                    var length = childInfoArray.length;
                    for (i = 0; i < length; i++) {
                        childInfo = childInfoArray[i];
                        var childSize = Math.round(childInfo.size + roundOff);
                        roundOff += childInfo.size - childSize;

                        widthDic[childInfo.layoutElement.$hashCode] = childSize;
                        widthToDistribute -= childSize;
                    }
                    widthToDistribute = widthToDistribute > 0 ? widthToDistribute : 0;
                }
            }

            if (this.$horizontalAlign == egret.HorizontalAlign.CENTER) {
                x = paddingL + widthToDistribute * 0.5;
            }
            else if (this.$horizontalAlign == egret.HorizontalAlign.RIGHT) {
                x = paddingL + widthToDistribute;
            }

            var maxX = paddingL;
            var maxY = paddingT;
            var dx = 0;
            var dy = 0;
            var justifyHeight:number = Math.ceil(targetHeight);
            if (this.$verticalAlign == JustifyAlign.CONTENT_JUSTIFY)
                justifyHeight = Math.ceil(Math.max(targetHeight, maxElementHeight));
            roundOff = 0;
            var layoutElementWidth:number;
            var childWidth:number;
            for (i = 0; i < count; i++) {
                var exceesHeight = 0;
                layoutElement = <UIComponent> (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                layoutElementWidth = NaN;
                if (hJustify) {
                    childWidth = NaN;
                    if (excessSpace > 0) {
                        childWidth = widthToDistribute * bounds.width / totalPreferredWidth;
                    }
                    else if (excessSpace < 0 && bounds.width > averageWidth) {
                        childWidth = widthToDistribute / largeChildrenCount
                    }
                    if (!isNaN(childWidth)) {
                        layoutElementWidth = Math.round(childWidth + roundOff);
                        roundOff += childWidth - layoutElementWidth;
                    }
                }
                else {
                    layoutElementWidth = widthDic[layoutElement.$hashCode];
                }
                if (vJustify) {
                    y = paddingT;
                    layoutElement.setLayoutBoundsSize(layoutElementWidth, justifyHeight);
                    layoutElement.getLayoutBounds(bounds);
                }
                else {
                    var layoutElementHeight = NaN;
                    var values = layoutElement.$UIComponent;
                    if (!isNaN(layoutElement.percentHeight)) {
                        var percent = Math.min(100, values[sys.UIKeys.percentHeight]);
                        layoutElementHeight = Math.round(targetHeight * percent * 0.01);
                    }
                    layoutElement.setLayoutBoundsSize(layoutElementWidth, layoutElementHeight);
                    layoutElement.getLayoutBounds(bounds);
                    exceesHeight = (targetHeight - bounds.height) * vAlign;
                    exceesHeight = exceesHeight > 0 ? exceesHeight : 0;
                    y = paddingT + exceesHeight;
                }
                layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
                dx = Math.ceil(bounds.width);
                dy = Math.ceil(bounds.height);
                maxX = Math.max(maxX, x + dx);
                maxY = Math.max(maxY, y + dy);
                x += dx + gap;
            }
            this.maxElementSize = maxElementHeight;
            target.setContentSize(maxX + paddingR, maxY + paddingB);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayListVirtual(width:number, height:number):void {
            var target = this.$target;
            if (this.indexInViewCalculated)
                this.indexInViewCalculated = false;
            else
                this.getIndexInView();
            var paddingR = this.$paddingRight;
            var paddingT = this.$paddingTop;
            var paddingB = this.$paddingBottom;
            var gap = this.$gap;
            var contentWidth:number;
            var numElements = target.numElements;
            if (this.startIndex == -1 || this.endIndex == -1) {
                contentWidth = this.getStartPosition(numElements) - gap + paddingR;
                target.setContentSize(contentWidth, target.contentHeight);
                return;
            }

            var endIndex = this.endIndex;
            target.setVirtualElementIndicesInView(this.startIndex, endIndex);
            //获取垂直布局参数
            var justify = this.$verticalAlign == JustifyAlign.JUSTIFY || this.$verticalAlign == JustifyAlign.CONTENT_JUSTIFY;
            var contentJustify = this.$verticalAlign == JustifyAlign.CONTENT_JUSTIFY;
            var vAlign = 0;
            if (!justify) {
                if (this.$verticalAlign == egret.VerticalAlign.MIDDLE) {
                    vAlign = 0.5;
                }
                else if (this.$verticalAlign == egret.VerticalAlign.BOTTOM) {
                    vAlign = 1;
                }
            }

            var bounds = egret.$TempRectangle;
            var targetHeight = Math.max(0, height - paddingT - paddingB);
            var justifyHeight = Math.ceil(targetHeight);
            var layoutElement:UIComponent;
            var typicalHeight = this.$typicalHeight;
            var typicalWidth = this.$typicalWidth;
            var maxElementHeight = this.maxElementSize;
            var oldMaxH = Math.max(typicalHeight, this.maxElementSize);
            if (contentJustify) {
                for (var index = this.startIndex; index <= endIndex; index++) {
                    layoutElement = <UIComponent> (target.getVirtualElementAt(index));
                    if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                        continue;
                    }
                    layoutElement.getPreferredBounds(bounds);
                    maxElementHeight = Math.max(maxElementHeight, bounds.height);
                }
                justifyHeight = Math.ceil(Math.max(targetHeight, maxElementHeight));
            }
            var x = 0;
            var y = 0;
            var contentHeight = 0;
            var oldElementSize:number;
            var needInvalidateSize = false;
            var elementSizeTable = this.elementSizeTable;

            //对可见区域进行布局
            for (var i = this.startIndex; i <= endIndex; i++) {
                var exceesHeight = 0;
                layoutElement = <UIComponent> (target.getVirtualElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                if (!contentJustify) {
                    maxElementHeight = Math.max(maxElementHeight, bounds.height);
                }
                if (justify) {
                    y = paddingT;
                    layoutElement.setLayoutBoundsSize(NaN, justifyHeight);
                    layoutElement.getLayoutBounds(bounds);
                }
                else {
                    layoutElement.getLayoutBounds(bounds);
                    exceesHeight = (targetHeight - bounds.height) * vAlign;
                    exceesHeight = exceesHeight > 0 ? exceesHeight : 0;
                    y = paddingT + exceesHeight;
                }

                contentHeight = Math.max(contentHeight, bounds.height);
                if (!needInvalidateSize) {
                    oldElementSize = isNaN(elementSizeTable[i]) ? typicalWidth : elementSizeTable[i];
                    if (oldElementSize != bounds.width)
                        needInvalidateSize = true;
                }
                elementSizeTable[i] = bounds.width;
                x = this.getStartPosition(i);
                layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
            }

            contentHeight += paddingT + paddingB;
            contentWidth = this.getStartPosition(numElements) - gap + paddingR;
            this.maxElementSize = maxElementHeight;
            target.setContentSize(contentWidth, contentHeight);

            if (needInvalidateSize || oldMaxH < this.maxElementSize) {
                target.invalidateSize();
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getStartPosition(index:number):number {
            if (!this.$useVirtualLayout) {
                if (this.$target) {
                    var element = <UIComponent>this.$target.getElementAt(index);
                    if (element) {
                        return element.x;
                    }
                }
            }
            var typicalWidth = this.$typicalWidth;
            var startPos = this.$paddingLeft;
            var gap = this.$gap;
            var elementSizeTable = this.elementSizeTable;
            for (var i = 0; i < index; i++) {
                var w = elementSizeTable[i];
                if(isNaN(w)){
                    w = typicalWidth;
                }
                startPos += w + gap;
            }
            return startPos;
        }


        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getElementSize(index:number):number {
            if (this.$useVirtualLayout) {
                var size = this.elementSizeTable[index];
                if(isNaN(size)){
                    size = this.$typicalWidth;
                }
                return size;
            }
            if (this.$target) {
                return this.$target.getElementAt(index).width;
            }
            return 0;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getElementTotalSize():number {
            var typicalWidth = this.$typicalWidth;
            var gap = this.$gap;
            var totalSize = 0;
            var length = this.$target.numElements;
            var elementSizeTable = this.elementSizeTable;
            for (var i = 0; i < length; i++) {
                var w = elementSizeTable[i];
                if(isNaN(w)){
                    w = typicalWidth;
                }
                totalSize += w + gap;
            }
            totalSize -= gap;
            return totalSize;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public elementAdded(index:number):void {
            if (!this.useVirtualLayout)
                return;
            super.elementAdded(index);
            this.elementSizeTable.splice(index, 0, this.$typicalWidth);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getIndexInView():boolean {
            var target = this.$target;
            if (!target || target.numElements == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }

            var values = target.$UIComponent;
            if (values[sys.UIKeys.width] <= 0 || values[sys.UIKeys.height] <= 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }

            var numElements = target.numElements;
            var contentWidth = this.getStartPosition(numElements - 1) +
                this.elementSizeTable[numElements - 1] + this.$paddingRight;
            var minVisibleX = target.scrollH;
            if (minVisibleX > contentWidth - this.$paddingRight) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var maxVisibleX = target.scrollH + values[sys.UIKeys.width];
            if (maxVisibleX < this.$paddingLeft) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var oldStartIndex:number = this.startIndex;
            var oldEndIndex:number = this.endIndex;
            this.startIndex = this.findIndexAt(minVisibleX, 0, numElements - 1);
            if (this.startIndex == -1)
                this.startIndex = 0;
            this.endIndex = this.findIndexAt(maxVisibleX, 0, numElements - 1);
            if (this.endIndex == -1)
                this.endIndex = numElements - 1;
            return oldStartIndex != this.startIndex || oldEndIndex != this.endIndex;
        }

    }

}
