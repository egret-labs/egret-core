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
     * The TileLayout class arranges layout elements in columns and rows
     * of equally-sized cells.
     * The TileLayout class uses a number of properties that control orientation,
     * count, size, gap and justification of the columns and the rows
     * as well as element alignment within the cells.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/TileLayoutExample.ts
     * @language en_US
     */
    /**
     * TileLayout 类在单元格大小相等的列和行中排列布局元素。
     * TileLayout 类使用许多属性来控制列和行的方向、计数、大小、间隙和两端对齐以及单元格内的元素对齐。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/TileLayoutExample.ts
     * @language zh_CN
     */
    export class TileLayout extends LayoutBase {

        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            super();
        }

        /**
         * @private
         * 标记horizontalGap被显式指定过
         */
        private explicitHorizontalGap:number = NaN;

        /**
         * @private
         */
        private _horizontalGap:number = 6;
        /**
         * Horizontal space between columns, in pixels.
         *
         * @default 6
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 列之间的水平空间（以像素为单位）。
         *
         * @default 6
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get horizontalGap():number {
            return this._horizontalGap;
        }

        public set horizontalGap(value:number) {
            value = +value;
            if (value === this._horizontalGap)
                return;
            this.explicitHorizontalGap = value;

            this._horizontalGap = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         * 标记verticalGap被显式指定过
         */
        private explicitVerticalGap:number = NaN;

        /**
         * @private
         */
        private _verticalGap:number = 6;

        /**
         * Vertical space between rows, in pixels.
         *
         * @default 6
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 行之间的垂直空间（以像素为单位）。
         *
         * @default 6
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get verticalGap():number {
            return this._verticalGap;
        }

        public set verticalGap(value:number) {
            value = +value;
            if (value === this._verticalGap)
                return;
            this.explicitVerticalGap = value;
            this._verticalGap = value;
            this.invalidateTargetLayout();
        }


        /**
         * @private
         */
        private _columnCount:number = -1;
        /**
         * Contain the actual column count.
         *
         * @default -1
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         *  实际列计数。
         *
         * @default -1
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get columnCount():number {
            return this._columnCount;
        }

        /**
         * @private
         */
        private _requestedColumnCount:number = 0;
        /**
         * Number of columns to be displayed.
         * <p>Set to 0 to allow the TileLayout to determine
         * the column count automatically.</p>
         * <p>If the <code>orientation</code> property is set to <code>TileOrientation.ROWS</code>,
         * then setting this property has no effect
         * In this case, the <code>rowCount</code> is explicitly set, and the
         * container width is explicitly set. </p>
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要显示的列数。
         * <p>设置为 0 会允许 TileLayout 自动确定列计数。</p>
         * <p>如果将 <code>orientation</code> 属性设置为 <code>TileOrientation.ROWS</code>，
         * 则设置此属性不会产生任何效果。这种情况下，会显式设置 code>rowCount</code>，并显式设置容器宽度。</p>
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get requestedColumnCount():number {
            return this._requestedColumnCount;
        }

        public set requestedColumnCount(value:number) {
            value = +value || 0;
            if (this._requestedColumnCount === value)
                return;
            this._requestedColumnCount = value;
            this._columnCount = value;
            this.invalidateTargetLayout();
        }


        /**
         * @private
         */
        private _rowCount:number = -1;
        /**
         * The row count.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         *  行计数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get rowCount():number {
            return this._rowCount;
        }

        /**
         * @private
         */
        private _requestedRowCount:number = 0;
        /**
         * Number of rows to be displayed.
         * <p>Set to 0 to remove explicit override and allow the TileLayout to determine
         * the row count automatically.</p>
         * <p>If the <code>orientation</code> property is set to
         * <code>TileOrientation.COLUMNS</code>, setting this property has no effect.
         * in this case, <code>columnCount</code> is explicitly set, and the
         * container height is explicitly set.</p>
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要显示的行数。
         * <code>设置为 -1 会删除显式覆盖并允许 TileLayout 自动确定行计数。</code>
         * <code>如果将 <code>orientation</code> 属性设置为 <code>TileOrientation.COLUMNS</code>，
         * 则设置此属性不会产生任何效果。这种情况下，会显式设置 <code>columnCount</code>，并显式设置容器高度。</code>
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get requestedRowCount():number {
            return this._requestedRowCount;
        }

        public set requestedRowCount(value:number) {
            value = +value || 0;
            if (this._requestedRowCount == value)
                return;
            this._requestedRowCount = value;
            this._rowCount = value;
            this.invalidateTargetLayout();
        }


        /**
         * @private
         * 外部显式指定的列宽
         */
        private explicitColumnWidth:number = NaN;

        /**
         * @private
         */
        private _columnWidth:number = NaN;
        /**
         * Contain the actual column width, in pixels.
         * <p>If not explicitly set, the column width is
         * determined from the width of the widest element. </p>
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 包含实际列宽（以像素为单位）。
         * <p>若未显式设置，则从根据最宽的元素的宽度确定列宽度。</p>
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get columnWidth():number {
            return this._columnWidth;
        }

        public set columnWidth(value:number) {
            value = +value;
            if (value === this._columnWidth)
                return;
            this.explicitColumnWidth = value;
            this._columnWidth = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         * 外部显式指定的行高
         */
        private explicitRowHeight:number = NaN;

        /**
         * @private
         */
        private _rowHeight:number = NaN;
        /**
         * The row height, in pixels.
         * <p>If not explicitly set, the row height is
         * determined from the maximum of elements' height.</p>
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 行高（以像素为单位）。
         * <p>如果未显式设置，则从元素的高度的最大值确定行高度。<p>
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get rowHeight():number {
            return this._rowHeight;
        }

        public set rowHeight(value:number) {
            value = +value;
            if (value === this._rowHeight)
                return;
            this.explicitRowHeight = value;
            this._rowHeight = value;
            this.invalidateTargetLayout();
        }


        /**
         * @private
         */
        private _paddingLeft:number = 0;
        /**
         * @copy eui.LinearLayoutBase#paddingLeft
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get paddingLeft():number {
            return this._paddingLeft;
        }

        public set paddingLeft(value:number) {
            value = +value || 0;
            if (this._paddingLeft == value)
                return;

            this._paddingLeft = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         */
        private _paddingRight:number = 0;
        /**
         * @copy eui.LinearLayoutBase#paddingRight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get paddingRight():number {
            return this._paddingRight;
        }

        public set paddingRight(value:number) {
            value = +value || 0;
            if (this._paddingRight === value)
                return;

            this._paddingRight = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         */
        private _paddingTop:number = 0;
        /**
         * @copy eui.LinearLayoutBase#paddingTop
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get paddingTop():number {
            return this._paddingTop;
        }

        public set paddingTop(value:number) {
            value = +value || 0;
            if (this._paddingTop == value)
                return;
            this._paddingTop = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         */
        private _paddingBottom:number = 0;
        /**
         * @copy eui.LinearLayoutBase#paddingBottom
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get paddingBottom():number {
            return this._paddingBottom;
        }

        public set paddingBottom(value:number) {
            value = +value || 0;
            if (this._paddingBottom === value)
                return;
            this._paddingBottom = value;
            this.invalidateTargetLayout();
        }


        /**
         * @private
         */
        private _horizontalAlign:string = JustifyAlign.JUSTIFY;
        /**
         * Specifies how to align the elements within the cells in the horizontal direction.
         * Supported values are
         * HorizontalAlign.LEFT、HorizontalAlign.CENTER、
         * HorizontalAlign.RIGHT、JustifyAlign.JUSTIFY。
         *
         * @default <code>JustifyAlign.JUSTIFY</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定如何在水平方向上对齐单元格内的元素。支持的值有
         * HorizontalAlign.LEFT、HorizontalAlign.CENTER、
         * HorizontalAlign.RIGHT、JustifyAlign.JUSTIFY。
         *
         * @default <code>JustifyAlign.JUSTIFY</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get horizontalAlign():string {
            return this._horizontalAlign;
        }

        public set horizontalAlign(value:string) {
            if (this._horizontalAlign == value)
                return;

            this._horizontalAlign = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         */
        private _verticalAlign:string = JustifyAlign.JUSTIFY;

        /**
         * 指定如何在垂直方向上对齐单元格内的元素。
         * 支持的值有 VerticalAlign.TOP、VerticalAlign.MIDDLE、
         * VerticalAlign.BOTTOM、JustifyAlign.JUSTIFY。
         * 默认值：JustifyAlign.JUSTIFY。
         *
         * @default <code>eui.JustifyAlign.JUSTIFY</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * Specifies how to align the elements within the cells in the vertical direction.
         * Supported values are
         * VerticalAlign.TOP、VerticalAlign.MIDDLE、
         * VerticalAlign.BOTTOM、JustifyAlign.JUSTIFY。
         *
         * @default <code>eui.JustifyAlign.JUSTIFY</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get verticalAlign():string {
            return this._verticalAlign;
        }

        public set verticalAlign(value:string) {
            if (this._verticalAlign == value)
                return;

            this._verticalAlign = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         */
        private _columnAlign:string = ColumnAlign.LEFT;

        /**
         * Specifies how to justify the fully visible columns to the container width.
         *
         * <p>When set to <code>ColumnAlign.LEFT</code> it turns column justification off.
         *  There may be partially visible columns or whitespace between the last column and
         *  the right edge of the container.  This is the default value.</p>
         *
         * <p>When set to <code>ColumnAlign.JUSTIFY_USING_GAP</code> the <code>horizontalGap</code>
         * actual value increases so that
         * the last fully visible column right edge aligns with the container's right edge.
         * In case there is only a single fully visible column, the <code>horizontalGap</code> actual value
         * increases so that it pushes any partially visible column beyond the right edge
         * of the container.
         * Note that explicitly setting the <code>horizontalGap</code> property does not turn off
         * justification. It only determines the initial gap value.
         * Justification may increases it.</p>
         *
         * <p>When set to <code>ColumnAlign.JUSTIFY_USING_WIDTH</code> the <code>columnWidth</code>
         * actual value increases so that
         * the last fully visible column right edge aligns with the container's right edge.
         * Note that explicitly setting the <code>columnWidth</code> property does not turn off justification.
         * It only determines the initial column width value.
         * Justification may increases it.</p>
         *
         * @default ColumnAlign.LEFT
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定如何将完全可见列与容器宽度对齐。
         *
         * <p>设置为 <code>ColumnAlign.LEFT</code> 时，它会关闭列两端对齐。
         * 在容器的最后一列和右边缘之间可能存在部分可见的列或空白。这是默认值。</p>
         *
         * <p>设置为 <code>ColumnAlign.JUSTIFY_USING_GAP</code> 时，<code>horizontalGap</code> 的实际值将增大，
         * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。仅存在一个完全可见列时，
         * <code>horizontalGap</code> 的实际值将增大，这样它会将任何部分可见列推到容器的右边缘之外。
         * 请注意显式设置 <code>horizontalGap</code> 属性不会关闭两端对齐。它仅确定初始间隙值。两端对齐可能会增大它。</p>
         *
         * <p>设置为 <code>ColumnAlign.JUSTIFY_USING_WIDTH</code> 时，<code>columnWidth</code> 的实际值将增大，
         * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。请注意显式设置 <code>columnWidth</code> 属性不会关闭两端对齐。
         * 它仅确定初始列宽度值。两端对齐可能会增大它。</p>
         *
         * @default ColumnAlign.LEFT
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get columnAlign():string {
            return this._columnAlign;
        }

        public set columnAlign(value:string) {
            if (this._columnAlign == value)
                return;

            this._columnAlign = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         */
        private _rowAlign:string = RowAlign.TOP;
        /**
         * Specifies how to justify the fully visible rows to the container height.
         *
         * <p>When set to <code>RowAlign.TOP</code> it turns column justification off.
         * There might be partially visible rows or whitespace between the last row and
         * the bottom edge of the container.  This is the default value.</p>
         *
         * <p>When set to <code>RowAlign.JUSTIFY_USING_GAP</code> the <code>verticalGap</code>
         * actual value increases so that
         * the last fully visible row bottom edge aligns with the container's bottom edge.
         * In case there is only a single fully visible row, the value of <code>verticalGap</code>
         * increases so that it pushes any partially visible row beyond the bottom edge
         * of the container.  Note that explicitly setting the <code>verticalGap</code> does not turn off
         * justification, but just determines the initial gap value.
         * Justification can then increases it.</p>
         *
         * <p>When set to <code>RowAlign.JUSTIFY_USING_HEIGHT</code> the <code>rowHeight</code>
         * actual value increases so that
         * the last fully visible row bottom edge aligns with the container's bottom edge.  Note that
         * explicitly setting the <code>rowHeight</code> does not turn off justification, but
         * determines the initial row height value.
         * Justification can then increase it.</p>
         *
         * @default RowAlign.TOP
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定如何将完全可见行与容器高度对齐。
         *
         * <p>设置为 <code>RowAlign.TOP</code> 时，它会关闭列两端对齐。
         * 在容器的最后一行和底边缘之间可能存在部分可见的行或空白。这是默认值。</p>
         *
         * <p>设置为 <code>RowAlign.JUSTIFY_USING_GAP</code> 时，<code>verticalGap</code> 的实际值会增大，
         * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。仅存在一个完全可见行时，<code>verticalGap</code> 的值会增大，
         * 这样它会将任何部分可见行推到容器的底边缘之外。请注意，显式设置 <code>verticalGap</code>
         * 不会关闭两端对齐，而只是确定初始间隙值。两端对齐接着可以增大它。</p>
         *
         * <p>设置为 <code>RowAlign.JUSTIFY_USING_HEIGHT</code> 时，<code>rowHeight</code> 的实际值会增大，
         * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。请注意，显式设置 <code>rowHeight</code>
         * 不会关闭两端对齐，而只是确定初始行高度值。两端对齐接着可以增大它。</p>
         *
         * @default RowAlign.TOP
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get rowAlign():string {
            return this._rowAlign;
        }

        public set rowAlign(value:string) {
            if (this._rowAlign == value)
                return;

            this._rowAlign = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         */
        private _orientation:string = TileOrientation.ROWS;
        /**
         * Specifies whether elements are arranged row by row or
         * column by column.
         *
         * @default TileOrientation.ROWS
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定是逐行还是逐列排列元素。
         *
         * @default TileOrientation.ROWS
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get orientation():string {
            return this._orientation;
        }

        public set orientation(value:string) {
            if (this._orientation == value)
                return;

            this._orientation = value;
            this.invalidateTargetLayout();
        }

        /**
         * @private
         * 标记目标容器的尺寸和显示列表失效
         */
        private invalidateTargetLayout():void {
            let target = this.$target;
            if (target) {
                target.invalidateSize();
                target.invalidateDisplayList();
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public measure():void {
            let target = this.$target;
            if (!target)
                return;

            let savedColumnCount = this._columnCount;
            let savedRowCount = this._rowCount;
            let savedColumnWidth = this._columnWidth;
            let savedRowHeight = this._rowHeight;

            let measuredWidth = 0;
            let measuredHeight = 0;

            let values = target.$UIComponent;
            this.calculateRowAndColumn(values[sys.UIKeys.explicitWidth], values[sys.UIKeys.explicitHeight]);
            let columnCount = this._requestedColumnCount > 0 ? this._requestedColumnCount : this._columnCount;
            let rowCount = this._requestedRowCount > 0 ? this._requestedRowCount : this._rowCount;
            let horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;
            let verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            if (columnCount > 0) {
                measuredWidth = columnCount * (this._columnWidth + horizontalGap) - horizontalGap;
            }

            if (rowCount > 0) {
                measuredHeight = rowCount * (this._rowHeight + verticalGap) - verticalGap;
            }

            let hPadding = this._paddingLeft + this._paddingRight;
            let vPadding = this._paddingTop + this._paddingBottom;

            target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding)

            this._columnCount = savedColumnCount;
            this._rowCount = savedRowCount;
            this._columnWidth = savedColumnWidth;
            this._rowHeight = savedRowHeight;
        }

        /**
         * @private
         * 计算行和列的尺寸及数量
         */
        private calculateRowAndColumn(explicitWidth:number, explicitHeight:number):void {
            let target = this.$target;
            let horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;
            let verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            this._rowCount = this._columnCount = -1;
            let numElements = target.numElements;
            let count = numElements;
            for (let index = 0; index < count; index++) {
                let layoutElement = <UIComponent> (target.getElementAt(index));
                if (layoutElement && (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout)) {
                    numElements--;
                    continue;
                }
            }
            if (numElements == 0) {
                this._rowCount = this._columnCount = 0;
                return;
            }

            if (isNaN(this.explicitColumnWidth) || isNaN(this.explicitRowHeight))
                this.updateMaxElementSize();

            if (isNaN(this.explicitColumnWidth)) {
                this._columnWidth = this.maxElementWidth;
            }
            else {
                this._columnWidth = this.explicitColumnWidth;
            }
            if (isNaN(this.explicitRowHeight)) {
                this._rowHeight = this.maxElementHeight;
            }
            else {
                this._rowHeight = this.explicitRowHeight;
            }

            let itemWidth = this._columnWidth + horizontalGap;
            //防止出现除数为零的情况
            if (itemWidth <= 0)
                itemWidth = 1;
            let itemHeight = this._rowHeight + verticalGap;
            if (itemHeight <= 0)
                itemHeight = 1;

            let orientedByColumns = (this._orientation == TileOrientation.COLUMNS);
            let widthHasSet = !isNaN(explicitWidth);
            let heightHasSet = !isNaN(explicitHeight);

            let paddingL = this._paddingLeft;
            let paddingR = this._paddingRight;
            let paddingT = this._paddingTop;
            let paddingB = this._paddingBottom;

            if (this._requestedColumnCount > 0 || this._requestedRowCount > 0) {
                if (this._requestedRowCount > 0)
                    this._rowCount = Math.min(this._requestedRowCount, numElements);

                if (this._requestedColumnCount > 0)
                    this._columnCount = Math.min(this._requestedColumnCount, numElements);
            }
            else if (!widthHasSet && !heightHasSet) {
                let side = Math.sqrt(numElements * itemWidth * itemHeight);
                if (orientedByColumns) {
                    this._rowCount = Math.max(1, Math.round(side / itemHeight));
                }
                else {
                    this._columnCount = Math.max(1, Math.round(side / itemWidth));
                }
            }
            else if (widthHasSet && (!heightHasSet || !orientedByColumns)) {
                let targetWidth = Math.max(0,
                    explicitWidth - paddingL - paddingR);
                this._columnCount = Math.floor((targetWidth + horizontalGap) / itemWidth);
                this._columnCount = Math.max(1, Math.min(this._columnCount, numElements));
            }
            else {
                let targetHeight = Math.max(0,
                    explicitHeight - paddingT - paddingB);
                this._rowCount = Math.floor((targetHeight + verticalGap) / itemHeight);
                this._rowCount = Math.max(1, Math.min(this._rowCount, numElements));
            }
            if (this._rowCount == -1)
                this._rowCount = Math.max(1, Math.ceil(numElements / this._columnCount));
            if (this._columnCount == -1)
                this._columnCount = Math.max(1, Math.ceil(numElements / this._rowCount));
            if (this._requestedColumnCount > 0 && this._requestedRowCount > 0) {
                if (this._orientation == TileOrientation.ROWS)
                    this._rowCount = Math.max(1, Math.ceil(numElements / this._requestedColumnCount));
                else
                    this._columnCount = Math.max(1, Math.ceil(numElements / this._requestedRowCount));
            }
        }

        /**
         * @private
         * 缓存的最大子对象宽度
         */
        private maxElementWidth:number = 0;
        /**
         * @private
         * 缓存的最大子对象高度
         */
        private maxElementHeight:number = 0;

        /**
         * @private
         * 更新最大子对象尺寸
         */
        private updateMaxElementSize():void {
            if (!this.$target)
                return;
            if (this.$useVirtualLayout) {
                this.maxElementWidth = Math.max(this.maxElementWidth, this.$typicalWidth);
                this.maxElementHeight = Math.max(this.maxElementHeight, this.$typicalHeight);
                this.doUpdateMaxElementSize(this.startIndex, this.endIndex);
            }
            else {
                this.doUpdateMaxElementSize(0, this.$target.numElements - 1);
            }
        }

        /**
         * @private
         * 更新虚拟布局的最大子对象尺寸
         */
        private doUpdateMaxElementSize(startIndex:number, endIndex:number):void {
            let maxElementWidth = this.maxElementWidth;
            let maxElementHeight = this.maxElementHeight;
            let bounds = egret.$TempRectangle;
            let target = this.$target;
            if ((startIndex != -1) && (endIndex != -1)) {
                for (let index = startIndex; index <= endIndex; index++) {
                    let elt = <UIComponent> target.getVirtualElementAt(index);
                    if (!egret.is(elt, UIComponentClass) || !elt.$includeInLayout) {
                        continue;
                    }
                    elt.getPreferredBounds(bounds);
                    maxElementWidth = Math.max(maxElementWidth, bounds.width);
                    maxElementHeight = Math.max(maxElementHeight, bounds.height);
                }
            }
            this.maxElementWidth = maxElementWidth;
            this.maxElementHeight = maxElementHeight;

        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public clearVirtualLayoutCache():void {
            super.clearVirtualLayoutCache();
            this.maxElementWidth = 0;
            this.maxElementHeight = 0;
        }

        /**
         * @private
         * 当前视图中的第一个元素索引
         */
        private startIndex:number = -1;
        /**
         * @private
         * 当前视图中的最后一个元素的索引
         */
        private endIndex:number = -1;
        /**
         * @private
         * 视图的第一个和最后一个元素的索引值已经计算好的标志
         */
        private indexInViewCalculated:boolean = false;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public scrollPositionChanged():void {
            if (this.$useVirtualLayout) {
                let changed = this.getIndexInView();
                if (changed) {
                    this.indexInViewCalculated = true;
                    this.$target.invalidateDisplayList();
                }
            }

        }

        /**
         * @private
         * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
         */
        private getIndexInView():boolean {
            if (!this.$target || this.$target.numElements == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }

            let target = this.$target;
            let numElements = target.numElements;
            if (!this.$useVirtualLayout) {
                this.startIndex = 0;
                this.endIndex = numElements - 1;
                return false;
            }

            let values = target.$UIComponent;
            if (values[sys.UIKeys.width] == 0 || values[sys.UIKeys.height] == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }
            let oldStartIndex = this.startIndex;
            let oldEndIndex = this.endIndex;
            let paddingL = this._paddingLeft;
            let paddingT = this._paddingTop;
            let horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;
            let verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            if (this._orientation == TileOrientation.COLUMNS) {
                let itemWidth = this._columnWidth + horizontalGap;
                if (itemWidth <= 0) {
                    this.startIndex = 0;
                    this.endIndex = numElements - 1;
                    return false;
                }
                let minVisibleX = target.scrollH;
                let maxVisibleX = minVisibleX + values[sys.UIKeys.width];
                let startColumn = Math.floor((minVisibleX - paddingL) / itemWidth);
                if (startColumn < 0)
                    startColumn = 0;
                let endColumn = Math.ceil((maxVisibleX - paddingL) / itemWidth);
                if (endColumn < 0)
                    endColumn = 0;
                this.startIndex = Math.min(numElements - 1, Math.max(0, startColumn * this._rowCount));
                this.endIndex = Math.min(numElements - 1, Math.max(0, endColumn * this._rowCount - 1));
            }
            else {
                let itemHeight = this._rowHeight + verticalGap;
                if (itemHeight <= 0) {
                    this.startIndex = 0;
                    this.endIndex = numElements - 1;
                    return false;
                }
                let minVisibleY = target.scrollV;
                let maxVisibleY = minVisibleY + values[sys.UIKeys.height];
                let startRow = Math.floor((minVisibleY - paddingT) / itemHeight);
                if (startRow < 0)
                    startRow = 0;
                let endRow = Math.ceil((maxVisibleY - paddingT) / itemHeight);
                if (endRow < 0)
                    endRow = 0;
                this.startIndex = Math.min(numElements - 1, Math.max(0, startRow * this._columnCount));
                this.endIndex = Math.min(numElements - 1, Math.max(0, endRow * this._columnCount - 1));
            }

            return this.startIndex != oldStartIndex || this.endIndex != oldEndIndex;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public updateDisplayList(width:number, height:number):void {
            super.updateDisplayList(width, height);
            if (!this.$target)
                return;
            let target = this.$target;
            let paddingL = this._paddingLeft;
            let paddingR = this._paddingRight;
            let paddingT = this._paddingTop;
            let paddingB = this._paddingBottom;
            if (this.indexInViewCalculated) {
                this.indexInViewCalculated = false;
            }
            else {
                this.calculateRowAndColumn(width, height);
                if (this._rowCount == 0 || this._columnCount == 0) {
                    target.setContentSize(paddingL + paddingR, paddingT + paddingB);
                    return;
                }
                this.adjustForJustify(width, height);
                this.getIndexInView();
            }
            if (this.$useVirtualLayout) {
                this.calculateRowAndColumn(width, height);
                this.adjustForJustify(width, height);
            }

            if (this.startIndex == -1 || this.endIndex == -1) {
                target.setContentSize(0, 0);
                return;
            }
            let endIndex = this.endIndex;
            target.setVirtualElementIndicesInView(this.startIndex, endIndex);
            let elt:UIComponent;
            let x:number;
            let y:number;
            let columnIndex:number;
            let rowIndex:number;
            let orientedByColumns = (this._orientation == TileOrientation.COLUMNS);
            let index = this.startIndex;
            let horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;
            let verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            let rowCount = this._rowCount;
            let columnCount = this._columnCount;
            let columnWidth = this._columnWidth;
            let rowHeight = this._rowHeight;
            for (let i = this.startIndex; i <= endIndex; i++) {
                if(this.$useVirtualLayout){
                    elt = <UIComponent> (this.target.getVirtualElementAt(i));
                }else{
                    elt = <UIComponent> (this.target.getElementAt(i));
                }
                if (!egret.is(elt, UIComponentClass) || !elt.$includeInLayout) {
                    continue;
                }

                if (orientedByColumns) {
                    columnIndex = Math.ceil((index + 1) / rowCount) - 1;
                    rowIndex = Math.ceil((index + 1) % rowCount) - 1;
                    if (rowIndex == -1)
                        rowIndex = rowCount - 1;
                }
                else {
                    columnIndex = Math.ceil((index + 1) % columnCount) - 1;
                    if (columnIndex == -1)
                        columnIndex = columnCount - 1;
                    rowIndex = Math.ceil((index + 1) / columnCount) - 1;
                }
                switch (this._horizontalAlign) {
                    case egret.HorizontalAlign.RIGHT:
                        x = width - (columnIndex + 1) * (columnWidth + horizontalGap) + horizontalGap - paddingR;
                        break;
                    case egret.HorizontalAlign.LEFT:
                        x = columnIndex * (columnWidth + horizontalGap) + paddingL;
                        break;
                    default:
                        x = columnIndex * (columnWidth + horizontalGap) + paddingL;
                }

                switch (this._verticalAlign) {
                    case egret.VerticalAlign.TOP:
                        y = rowIndex * (rowHeight + verticalGap) + paddingT;
                        break;
                    case egret.VerticalAlign.BOTTOM:
                        y = height - (rowIndex + 1) * (rowHeight + verticalGap) + verticalGap - paddingB;
                        break;
                    default:
                        y = rowIndex * (rowHeight + verticalGap) + paddingT;
                }
                
                this.sizeAndPositionElement(elt, x, y, columnWidth, rowHeight);
                index++;
            }

            let hPadding = paddingL + paddingR;
            let vPadding = paddingT + paddingB;
            let contentWidth = (columnWidth + horizontalGap) * columnCount - horizontalGap;
            let contentHeight = (rowHeight + verticalGap) * rowCount - verticalGap;
            target.setContentSize(contentWidth + hPadding, contentHeight + vPadding);
        }

        /**
         * @private
         * 为单个元素布局
         */
        private sizeAndPositionElement(element:UIComponent, cellX:number, cellY:number,
                                       cellWidth:number, cellHeight:number):void {
            let elementWidth = NaN;
            let elementHeight = NaN;
            let values = element.$UIComponent;
            if (this._horizontalAlign == JustifyAlign.JUSTIFY)
                elementWidth = cellWidth;
            else if (!isNaN(values[sys.UIKeys.percentWidth]))
                elementWidth = cellWidth * values[sys.UIKeys.percentWidth] * 0.01;

            if (this._verticalAlign == JustifyAlign.JUSTIFY)
                elementHeight = cellHeight;
            else if (!isNaN(values[sys.UIKeys.percentHeight]))
                elementHeight = cellHeight * values[sys.UIKeys.percentHeight] * 0.01;


            element.setLayoutBoundsSize(Math.round(elementWidth), Math.round(elementHeight));

            let x = cellX;
            let bounds = egret.$TempRectangle;
            element.getLayoutBounds(bounds);
            switch (this._horizontalAlign) {
                case egret.HorizontalAlign.RIGHT:
                    x += cellWidth - bounds.width;
                    break;
                case egret.HorizontalAlign.CENTER:
                    x = cellX + (cellWidth - bounds.width) / 2;
                    break;
            }

            let y = cellY;
            switch (this._verticalAlign) {
                case egret.VerticalAlign.BOTTOM:
                    y += cellHeight - bounds.height;
                    break;
                case egret.VerticalAlign.MIDDLE:
                    y += (cellHeight - bounds.height) / 2;
                    break;
            }
            element.setLayoutBoundsPosition(Math.round(x), Math.round(y));
        }


        /**
         * @private
         * 为两端对齐调整间隔或格子尺寸
         */
        private adjustForJustify(width:number, height:number):void {
            let paddingL = this._paddingLeft;
            let paddingR = this._paddingRight;
            let paddingT = this._paddingTop;
            let paddingB = this._paddingBottom;

            let targetWidth = Math.max(0, width - paddingL - paddingR);
            let targetHeight = Math.max(0, height - paddingT - paddingB);
            if (!isNaN(this.explicitVerticalGap))
                this._verticalGap = this.explicitVerticalGap;
            if (!isNaN(this.explicitHorizontalGap))
                this._horizontalGap = this.explicitHorizontalGap;
            this._verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            this._horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;

            let offsetY = targetHeight - this._rowHeight * this._rowCount;
            let offsetX = targetWidth - this._columnWidth * this._columnCount;
            let gapCount;
            if (offsetY > 0) {
                if (this._rowAlign == RowAlign.JUSTIFY_USING_GAP) {
                    gapCount = Math.max(1, this._rowCount - 1);
                    this._verticalGap = offsetY / gapCount;
                }
                else if (this._rowAlign == RowAlign.JUSTIFY_USING_HEIGHT) {
                    if (this._rowCount > 0) {
                        this._rowHeight += (offsetY - (this._rowCount - 1) * this._verticalGap) / this._rowCount;
                    }
                }
            }
            if (offsetX > 0) {
                if (this._columnAlign == ColumnAlign.JUSTIFY_USING_GAP) {
                    gapCount = Math.max(1, this._columnCount - 1);
                    this._horizontalGap = offsetX / gapCount;
                }
                else if (this._columnAlign == ColumnAlign.JUSTIFY_USING_WIDTH) {
                    if (this._columnCount > 0) {
                        this._columnWidth += (offsetX - (this._columnCount - 1) * this._horizontalGap) / this._columnCount;
                    }
                }
            }
        }
    }
}
