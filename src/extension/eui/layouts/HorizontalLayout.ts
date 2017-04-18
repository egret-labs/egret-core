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

    let UIComponentClass = "eui.UIComponent";

    /**
     * The HorizontalLayout class arranges the layout elements in a horizontal sequence,
     * left to right, with optional gaps between the elements and optional padding
     * around the elements.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/HorizontalLayoutExample.ts
     * @language en_US
     */
    /**
     * HorizontalLayout 类按水平顺序从左到右排列布局元素，在元素和围绕元素的可选填充之间带有可选间隙。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/HorizontalLayoutExample.ts
     * @language zh_CN
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
            let target = this.$target;
            let count = target.numElements;
            let numElements = count;
            let measuredWidth = 0;
            let measuredHeight = 0;
            let bounds = egret.$TempRectangle;
            for (let i = 0; i < count; i++) {
                let layoutElement = <UIComponent> (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    numElements--;
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredWidth += bounds.width;
                measuredHeight = Math.max(measuredHeight, bounds.height);
            }
            measuredWidth += (numElements - 1) * this.$gap;
            let hPadding = this.$paddingLeft + this.$paddingRight;
            let vPadding = this.$paddingTop + this.$paddingBottom;
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
            let target = this.$target;
            let typicalWidth = this.$typicalWidth;
            let measuredWidth = this.getElementTotalSize();
            let measuredHeight = Math.max(this.maxElementSize, this.$typicalHeight);
            let bounds = egret.$TempRectangle;
            let endIndex = this.endIndex;
            let elementSizeTable = this.elementSizeTable;
            for (let index = this.startIndex; index < endIndex; index++) {
                let layoutElement = <UIComponent> (target.getElementAt(index));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredWidth += bounds.width;
                measuredWidth -= isNaN(elementSizeTable[index]) ? typicalWidth : elementSizeTable[index];
                measuredHeight = Math.max(measuredHeight, bounds.height);
            }
            let hPadding = this.$paddingLeft + this.$paddingRight;
            let vPadding = this.$paddingTop + this.$paddingBottom;
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
            let target = this.$target;
            let paddingL = this.$paddingLeft;
            let paddingR = this.$paddingRight;
            let paddingT = this.$paddingTop;
            let paddingB = this.$paddingBottom;
            let gap = this.$gap;
            let targetWidth = Math.max(0, width - paddingL - paddingR);
            let targetHeight = Math.max(0, height - paddingT - paddingB);

            let hJustify = this.$horizontalAlign == JustifyAlign.JUSTIFY;
            let vJustify = this.$verticalAlign == JustifyAlign.JUSTIFY || this.$verticalAlign == JustifyAlign.CONTENT_JUSTIFY;
            let vAlign = 0;
            if (!vJustify) {
                if (this.$verticalAlign == egret.VerticalAlign.MIDDLE) {
                    vAlign = 0.5;
                }
                else if (this.$verticalAlign == egret.VerticalAlign.BOTTOM) {
                    vAlign = 1;
                }
            }

            let count = target.numElements;
            let numElements = count;
            let x = paddingL;
            let y = paddingT;
            let i:number;
            let layoutElement:UIComponent;

            let totalPreferredWidth = 0;
            let totalPercentWidth = 0;
            let childInfoArray:any[] = [];
            let childInfo:sys.ChildInfo;
            let widthToDistribute = targetWidth;
            let maxElementHeight = this.maxElementSize;
            let bounds = egret.$TempRectangle;
            for (i = 0; i < count; i++) {
                let layoutElement = <UIComponent> (target.getElementAt(i));
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
                    let values = layoutElement.$UIComponent;
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
            let excessSpace = targetWidth - totalPreferredWidth - gap * (numElements - 1);

            let averageWidth:number;
            let largeChildrenCount = numElements;
            let widthDic:any = {};
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
                    let roundOff = 0;
                    let length = childInfoArray.length;
                    for (i = 0; i < length; i++) {
                        childInfo = childInfoArray[i];
                        let childSize = Math.round(childInfo.size + roundOff);
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

            let maxX = paddingL;
            let maxY = paddingT;
            let dx = 0;
            let dy = 0;
            let justifyHeight:number = Math.ceil(targetHeight);
            if (this.$verticalAlign == JustifyAlign.CONTENT_JUSTIFY)
                justifyHeight = Math.ceil(Math.max(targetHeight, maxElementHeight));
            let roundOff = 0;
            let layoutElementWidth:number;
            let childWidth:number;
            for (i = 0; i < count; i++) {
                let exceesHeight = 0;
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
                    let layoutElementHeight = NaN;
                    let values = layoutElement.$UIComponent;
                    if (!isNaN(layoutElement.percentHeight)) {
                        let percent = Math.min(100, values[sys.UIKeys.percentHeight]);
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
            let target = this.$target;
            if (this.indexInViewCalculated)
                this.indexInViewCalculated = false;
            else
                this.getIndexInView();
            let paddingR = this.$paddingRight;
            let paddingT = this.$paddingTop;
            let paddingB = this.$paddingBottom;
            let gap = this.$gap;
            let contentWidth:number;
            let numElements = target.numElements;
            if (this.startIndex == -1 || this.endIndex == -1) {
                contentWidth = this.getStartPosition(numElements) - gap + paddingR;
                target.setContentSize(contentWidth, target.contentHeight);
                return;
            }

            let endIndex = this.endIndex;
            target.setVirtualElementIndicesInView(this.startIndex, endIndex);
            //获取垂直布局参数
            let justify = this.$verticalAlign == JustifyAlign.JUSTIFY || this.$verticalAlign == JustifyAlign.CONTENT_JUSTIFY;
            let contentJustify = this.$verticalAlign == JustifyAlign.CONTENT_JUSTIFY;
            let vAlign = 0;
            if (!justify) {
                if (this.$verticalAlign == egret.VerticalAlign.MIDDLE) {
                    vAlign = 0.5;
                }
                else if (this.$verticalAlign == egret.VerticalAlign.BOTTOM) {
                    vAlign = 1;
                }
            }

            let bounds = egret.$TempRectangle;
            let targetHeight = Math.max(0, height - paddingT - paddingB);
            let justifyHeight = Math.ceil(targetHeight);
            let layoutElement:UIComponent;
            let typicalHeight = this.$typicalHeight;
            let typicalWidth = this.$typicalWidth;
            let maxElementHeight = this.maxElementSize;
            let oldMaxH = Math.max(typicalHeight, this.maxElementSize);
            if (contentJustify) {
                for (let index = this.startIndex; index <= endIndex; index++) {
                    layoutElement = <UIComponent> (target.getVirtualElementAt(index));
                    if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                        continue;
                    }
                    layoutElement.getPreferredBounds(bounds);
                    maxElementHeight = Math.max(maxElementHeight, bounds.height);
                }
                justifyHeight = Math.ceil(Math.max(targetHeight, maxElementHeight));
            }
            let x = 0;
            let y = 0;
            let contentHeight = 0;
            let oldElementSize:number;
            let needInvalidateSize = false;
            let elementSizeTable = this.elementSizeTable;

            //对可见区域进行布局
            for (let i = this.startIndex; i <= endIndex; i++) {
                let exceesHeight = 0;
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
                    let element = <UIComponent>this.$target.getElementAt(index);
                    if (element) {
                        return element.x;
                    }
                }
            }
            let typicalWidth = this.$typicalWidth;
            let startPos = this.$paddingLeft;
            let gap = this.$gap;
            let elementSizeTable = this.elementSizeTable;
            for (let i = 0; i < index; i++) {
                let w = elementSizeTable[i];
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
                let size = this.elementSizeTable[index];
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
            let typicalWidth = this.$typicalWidth;
            let gap = this.$gap;
            let totalSize = 0;
            let length = this.$target.numElements;
            let elementSizeTable = this.elementSizeTable;
            for (let i = 0; i < length; i++) {
                let w = elementSizeTable[i];
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
            let target = this.$target;
            if (!target || target.numElements == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }

            let values = target.$UIComponent;
            if (values[sys.UIKeys.width] <= 0 || values[sys.UIKeys.height] <= 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }

            let numElements = target.numElements;
            let contentWidth = this.getStartPosition(numElements - 1) +
                this.elementSizeTable[numElements - 1] + this.$paddingRight;
            let minVisibleX = target.scrollH;
            if (minVisibleX > contentWidth - this.$paddingRight) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            let maxVisibleX = target.scrollH + values[sys.UIKeys.width];
            if (maxVisibleX < this.$paddingLeft) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            let oldStartIndex:number = this.startIndex;
            let oldEndIndex:number = this.endIndex;
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
