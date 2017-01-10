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
     * The VerticalLayout class arranges the layout elements in a vertical sequence,
     * top to bottom, with optional gaps between the elements and optional padding
     * around the sequence of elements.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/VerticalLayoutExample.ts
     * @language en_US
     */
    /**
     * VerticalLayout 类按垂直顺序从上向下排列布局元素，在元素和围绕元素顺序的可选填充之间带有可选间隙。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/VerticalLayoutExample.ts
     * @language zh_CN
     */
    export class VerticalLayout extends LinearLayoutBase {

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
                measuredHeight += bounds.height;
                measuredWidth = Math.max(measuredWidth, bounds.width);
            }
            measuredHeight += (numElements - 1) * this.$gap;
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
            let typicalHeight = this.$typicalHeight;
            let measuredHeight = this.getElementTotalSize();
            let measuredWidth = Math.max(this.maxElementSize, this.$typicalWidth);
            let bounds = egret.$TempRectangle;
            let endIndex = this.endIndex;
            let elementSizeTable = this.elementSizeTable;
            for (let index = this.startIndex; index < endIndex; index++) {
                let layoutElement = <UIComponent> (target.getElementAt(index));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredHeight += bounds.height;
                measuredHeight -= isNaN(elementSizeTable[index]) ? typicalHeight : elementSizeTable[index];
                measuredWidth = Math.max(measuredWidth, bounds.width);
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

            let vJustify = this.$verticalAlign == JustifyAlign.JUSTIFY;
            let hJustify = this.$horizontalAlign == JustifyAlign.JUSTIFY || this.$horizontalAlign == JustifyAlign.CONTENT_JUSTIFY;
            let hAlign = 0;
            if (!hJustify) {
                if (this.$horizontalAlign == egret.HorizontalAlign.CENTER) {
                    hAlign = 0.5;
                }
                else if (this.$horizontalAlign == egret.HorizontalAlign.RIGHT) {
                    hAlign = 1;
                }
            }

            let count = target.numElements;
            let numElements = count;
            let x = paddingL;
            let y = paddingT;
            let i:number;
            let layoutElement:UIComponent;

            let totalPreferredHeight = 0;
            let totalPercentHeight = 0;
            let childInfoArray:any[] = [];
            let childInfo:sys.ChildInfo;
            let heightToDistribute = targetHeight;
            let maxElementWidth = this.maxElementSize;
            let bounds = egret.$TempRectangle;
            for (i = 0; i < count; i++) {
                let layoutElement = <UIComponent> (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    numElements--;
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                maxElementWidth = Math.max(maxElementWidth, bounds.width);
                if (vJustify) {
                    totalPreferredHeight += bounds.height;
                }
                else {
                    let values = layoutElement.$UIComponent;
                    if (!isNaN(values[sys.UIKeys.percentHeight])) {
                        totalPercentHeight += values[sys.UIKeys.percentHeight];

                        childInfo = new sys.ChildInfo();
                        childInfo.layoutElement = layoutElement;
                        childInfo.percent = values[sys.UIKeys.percentHeight];
                        childInfo.min = values[sys.UIKeys.minHeight];
                        childInfo.max = values[sys.UIKeys.maxHeight];
                        childInfoArray.push(childInfo);

                    }
                    else {
                        heightToDistribute -= bounds.height;
                    }
                }
            }
            heightToDistribute -= gap * (numElements - 1);
            heightToDistribute = heightToDistribute > 0 ? heightToDistribute : 0;
            let excessSpace = targetHeight - totalPreferredHeight - gap * (numElements - 1);

            let averageHeight:number;
            let largeChildrenCount = numElements;
            let heightDic:any = {};
            if (vJustify) {
                if (excessSpace < 0) {
                    averageHeight = heightToDistribute / numElements;
                    for (i = 0; i < count; i++) {
                        layoutElement = <UIComponent> (target.getElementAt(i));
                        if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                            continue;
                        }

                        layoutElement.getPreferredBounds(bounds);
                        if (bounds.height <= averageHeight) {
                            heightToDistribute -= bounds.height;
                            largeChildrenCount--;
                            continue;
                        }
                    }
                    heightToDistribute = heightToDistribute > 0 ? heightToDistribute : 0;
                }
            }
            else {
                if (totalPercentHeight > 0) {
                    this.flexChildrenProportionally(targetHeight, heightToDistribute,
                        totalPercentHeight, childInfoArray);
                    let roundOff = 0;
                    let length = childInfoArray.length;
                    for (i = 0; i < length; i++) {
                        childInfo = childInfoArray[i];
                        let childSize = Math.round(childInfo.size + roundOff);
                        roundOff += childInfo.size - childSize;

                        heightDic[childInfo.layoutElement.$hashCode] = childSize;
                        heightToDistribute -= childSize;
                    }
                    heightToDistribute = heightToDistribute > 0 ? heightToDistribute : 0;
                }
            }

            if (this.$verticalAlign == egret.VerticalAlign.MIDDLE) {
                y = paddingT + heightToDistribute * 0.5;
            }
            else if (this.$verticalAlign == egret.VerticalAlign.BOTTOM) {
                y = paddingT + heightToDistribute;
            }

            let maxX = paddingL;
            let maxY = paddingT;
            let dx = 0;
            let dy = 0;
            let justifyWidth:number = Math.ceil(targetWidth);
            if (this.$horizontalAlign == JustifyAlign.CONTENT_JUSTIFY)
                justifyWidth = Math.ceil(Math.max(targetWidth, maxElementWidth));
            let roundOff = 0;
            let layoutElementHeight:number;
            let childHeight:number;
            for (i = 0; i < count; i++) {
                let exceesWidth = 0;
                layoutElement = <UIComponent> (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                layoutElementHeight = NaN;
                if (vJustify) {
                    childHeight = NaN;
                    if (excessSpace > 0) {
                        childHeight = heightToDistribute * bounds.height / totalPreferredHeight;
                    }
                    else if (excessSpace < 0 && bounds.height > averageHeight) {
                        childHeight = heightToDistribute / largeChildrenCount
                    }
                    if (!isNaN(childHeight)) {
                        layoutElementHeight = Math.round(childHeight + roundOff);
                        roundOff += childHeight - layoutElementHeight;
                    }
                }
                else {
                    layoutElementHeight = heightDic[layoutElement.$hashCode];
                }
                if (hJustify) {
                    x = paddingL;
                    layoutElement.setLayoutBoundsSize(justifyWidth, layoutElementHeight);
                    layoutElement.getLayoutBounds(bounds);
                }
                else {
                    let layoutElementWidth = NaN;
                    let values = layoutElement.$UIComponent;
                    if (!isNaN(values[sys.UIKeys.percentWidth])) {
                        let percent = Math.min(100, values[sys.UIKeys.percentWidth]);
                        layoutElementWidth = Math.round(targetWidth * percent * 0.01);
                    }
                    layoutElement.setLayoutBoundsSize(layoutElementWidth, layoutElementHeight);
                    layoutElement.getLayoutBounds(bounds);
                    exceesWidth = (targetWidth - bounds.width) * hAlign;
                    exceesWidth = exceesWidth > 0 ? exceesWidth : 0;
                    x = paddingL + exceesWidth;
                }
                layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
                dx = Math.ceil(bounds.width);
                dy = Math.ceil(bounds.height);
                maxX = Math.max(maxX, x + dx);
                maxY = Math.max(maxY, y + dy);
                y += dy + gap;
            }
            this.maxElementSize = maxElementWidth;
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
            let paddingB = this.$paddingBottom;
            let paddingL = this.$paddingLeft;
            let paddingR = this.$paddingRight;
            let gap = this.$gap;
            let contentHeight:number;
            let numElements = target.numElements;
            if (this.startIndex == -1 || this.endIndex == -1) {
                contentHeight = this.getStartPosition(numElements) - gap + paddingB;
                target.setContentSize(target.contentWidth, contentHeight);
                return;
            }

            let endIndex = this.endIndex;
            target.setVirtualElementIndicesInView(this.startIndex, endIndex);
            //获取垂直布局参数
            let justify = this.$horizontalAlign == JustifyAlign.JUSTIFY || this.$horizontalAlign == JustifyAlign.CONTENT_JUSTIFY;
            let contentJustify = this.$horizontalAlign == JustifyAlign.CONTENT_JUSTIFY;
            let hAlign = 0;
            if (!justify) {
                if (this.$horizontalAlign == egret.HorizontalAlign.CENTER) {
                    hAlign = 0.5;
                }
                else if (this.$horizontalAlign == egret.HorizontalAlign.RIGHT) {
                    hAlign = 1;
                }
            }

            let bounds = egret.$TempRectangle;
            let targetWidth = Math.max(0, width - paddingL - paddingR);
            let justifyWidth = Math.ceil(targetWidth);
            let layoutElement:UIComponent;
            let typicalHeight = this.$typicalHeight;
            let typicalWidth = this.$typicalWidth;
            let maxElementWidth = this.maxElementSize;
            let oldMaxW = Math.max(typicalWidth, this.maxElementSize);
            if (contentJustify) {
                for (let index = this.startIndex; index <= endIndex; index++) {
                    layoutElement = <UIComponent> (target.getVirtualElementAt(index));
                    if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                        continue;
                    }
                    layoutElement.getPreferredBounds(bounds);
                    maxElementWidth = Math.max(maxElementWidth, bounds.width);
                }
                justifyWidth = Math.ceil(Math.max(targetWidth, maxElementWidth));
            }
            let x = 0;
            let y = 0;
            let contentWidth = 0;
            let oldElementSize:number;
            let needInvalidateSize = false;
            let elementSizeTable = this.elementSizeTable;

            //对可见区域进行布局
            for (let i = this.startIndex; i <= endIndex; i++) {
                let exceesWidth = 0;
                layoutElement = <UIComponent> (target.getVirtualElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                if (!contentJustify) {
                    maxElementWidth = Math.max(maxElementWidth, bounds.width);
                }
                if (justify) {
                    x = paddingL;
                    layoutElement.setLayoutBoundsSize(justifyWidth, NaN);
                    layoutElement.getLayoutBounds(bounds);
                }
                else {
                    layoutElement.getLayoutBounds(bounds);
                    exceesWidth = (targetWidth - bounds.width) * hAlign;
                    exceesWidth = exceesWidth > 0 ? exceesWidth : 0;
                    x = paddingL + exceesWidth;
                }

                contentWidth = Math.max(contentWidth, bounds.width);
                if (!needInvalidateSize) {
                    oldElementSize = isNaN(elementSizeTable[i]) ? typicalHeight : elementSizeTable[i];
                    if (oldElementSize != bounds.height)
                        needInvalidateSize = true;
                }
                elementSizeTable[i] = bounds.height;
                y = this.getStartPosition(i);
                layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
            }

            contentWidth += paddingL + paddingR;
            contentHeight = this.getStartPosition(numElements) - gap + paddingB;
            this.maxElementSize = maxElementWidth;
            target.setContentSize(contentWidth, contentHeight);

            if (needInvalidateSize || oldMaxW < this.maxElementSize) {
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
                        return element.y;
                    }
                }
            }
            let typicalHeight = this.$typicalHeight;
            let startPos = this.$paddingTop;
            let gap = this.$gap;
            let elementSizeTable = this.elementSizeTable;
            for (let i = 0; i < index; i++) {
                let h = elementSizeTable[i];
                if(isNaN(h)) {
                    h = typicalHeight;
                }
                startPos += h + gap;
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
                if (isNaN(size)) {
                    size = this.$typicalHeight;
                }
                return size;
            }
            if (this.$target) {
                return this.$target.getElementAt(index).height;
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
            let typicalHeight = this.$typicalHeight;
            let gap = this.$gap;
            let totalSize = 0;
            let length = this.$target.numElements;
            let elementSizeTable = this.elementSizeTable;
            for (let i = 0; i < length; i++) {
                let h = elementSizeTable[i];
                if(isNaN(h)) {
                    h = typicalHeight;
                }
                totalSize += h + gap;
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
            if (!this.$useVirtualLayout)
                return;
            super.elementAdded(index);
            this.elementSizeTable.splice(index, 0, this.$typicalHeight);
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
            if (values[sys.UIKeys.width] == 0 || values[sys.UIKeys.height] == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }

            let numElements = target.numElements;
            let contentHeight = this.getStartPosition(numElements - 1) +
                this.elementSizeTable[numElements - 1] + this.$paddingBottom;
            let minVisibleY = target.scrollV;
            if (minVisibleY > contentHeight - this.$paddingBottom) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            let maxVisibleY = target.scrollV + values[sys.UIKeys.height];
            if (maxVisibleY < this.$paddingTop) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            let oldStartIndex = this.startIndex;
            let oldEndIndex = this.endIndex;
            this.startIndex = this.findIndexAt(minVisibleY, 0, numElements - 1);
            if (this.startIndex == -1)
                this.startIndex = 0;
            this.endIndex = this.findIndexAt(maxVisibleY, 0, numElements - 1);
            if (this.endIndex == -1)
                this.endIndex = numElements - 1;
            return oldStartIndex != this.startIndex || oldEndIndex != this.endIndex;
        }
    }

}
