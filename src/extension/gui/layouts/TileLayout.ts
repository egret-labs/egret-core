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


module egret.gui {

	/**
	 * @class egret.gui.TileLayout
	 * @classdesc
	 * 格子布局
	 * @extends egret.gui.LayoutBase
	 */
	export class TileLayout extends LayoutBase{
		/**
		 * 构造函数
		 * @method egret.gui.TileLayout#constructor
		 */		
		public constructor(){
			super();
		}
		/**
		 * 标记horizontalGap被显式指定过 
		 */
		private explicitHorizontalGap:number = NaN;
		
		private _horizontalGap:number = 6;
		/**
		 * 列之间的水平空间（以像素为单位）。
		 * @member egret.gui.TileLayout#horizontalGap
		 */		
		public get horizontalGap():number{
			return this._horizontalGap;
		}
		
		public set horizontalGap(value:number){
			if (value == this._horizontalGap)
				return;
			this.explicitHorizontalGap = value;
				
			this._horizontalGap = value;
			this.invalidateTargetSizeAndDisplayList();
			if(this.hasEventListener("gapChanged"))
				this.dispatchEventWith("gapChanged");
		}
		
		/**
		 * 标记verticalGap被显式指定过 
		 */		
		private explicitVerticalGap:number = NaN;
		
		private _verticalGap:number = 6;
		
		/**
		 * 行之间的垂直空间（以像素为单位）。
		 * @member egret.gui.TileLayout#verticalGap
		 */		
		public get verticalGap():number{
			return this._verticalGap;
		}
		
		public set verticalGap(value:number){
			if (value == this._verticalGap)
				return;
			this.explicitVerticalGap = value;
			
			this._verticalGap = value;
			this.invalidateTargetSizeAndDisplayList();
			if(this.hasEventListener("gapChanged"))
				this.dispatchEventWith("gapChanged");
		}
		
		
		private _columnCount:number = -1;
		/**
		 * 实际列计数。
		 * @member egret.gui.TileLayout#columnCount
		 */		
		public get columnCount():number{
			return this._columnCount;
		}
		
		private _requestedColumnCount:number = 0;
		/**
		 * 要显示的列数。设置为0表示自动确定列计数,默认值0。<br/>
		 * 注意:当orientation为TileOrientation.COLUMNS(逐列排列元素)且taget被显式设置宽度时，此属性无效。
		 * @member egret.gui.TileLayout#requestedColumnCount
		 */
		public get requestedColumnCount():number{
			return this._requestedColumnCount;
		}

		public set requestedColumnCount(value:number){
			if (this._requestedColumnCount == value)
				return;
			this._requestedColumnCount = value;
			this._columnCount = value;
			this.invalidateTargetSizeAndDisplayList();
		}

		
		private _rowCount:number = -1;
		/**
		 * 实际行计数。
		 * @member egret.gui.TileLayout#rowCount
		 */		
		public get rowCount():number{
			return this._rowCount;
		}
		
		private _requestedRowCount:number = 0;
		/**
		 * 要显示的行数。设置为0表示自动确定行计数,默认值0。<br/>
		 * 注意:当orientation为TileOrientation.ROWS(即逐行排列元素,此为默认值)且target被显式设置高度时，此属性无效。
		 * @member egret.gui.TileLayout#requestedRowCount
		 */
		public get requestedRowCount():number{
			return this._requestedRowCount;
		}

		public set requestedRowCount(value:number){
			if (this._requestedRowCount == value)
				return;
			this._requestedRowCount = value;
			this._rowCount = value;
			this.invalidateTargetSizeAndDisplayList();
		}

		
		/**
		 * 外部显式指定的列宽
		 */
		private explicitColumnWidth:number = NaN;
	
		private _columnWidth:number = NaN;
		/**
		 * 实际列宽（以像素为单位）。 若未显式设置，则从根据最宽的元素的宽度确定列宽度。
		 * @member egret.gui.TileLayout#columnWidth
		 */		
		public get columnWidth():number{
			return this._columnWidth;
		}
		
		/**
		 */
		public set columnWidth(value:number){
			if (value == this._columnWidth)
				return;
			this.explicitColumnWidth = value;
			this._columnWidth = value;
			this.invalidateTargetSizeAndDisplayList();
		}
		
		/**
		 * 外部显式指定的行高 
		 */		
		private explicitRowHeight:number = NaN;

		private _rowHeight:number = NaN;
		/**
		 * 行高（以像素为单位）。 如果未显式设置，则从元素的高度的最大值确定行高度。
		 * @member egret.gui.TileLayout#rowHeight
		 */		
		public get rowHeight():number{
			return this._rowHeight;
		}
		
		/**
		 */
		public set rowHeight(value:number){
			if (value == this._rowHeight)
				return;
			this.explicitRowHeight = value;
			this._rowHeight = value;
			this.invalidateTargetSizeAndDisplayList();
		}
		
		private _padding:number = 0;
		/**
		 * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
		 * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
		 * @member egret.gui.TileLayout#padding
		 */
		public get padding():number{
			return this._padding;
		}
		public set padding(value:number){
			if(this._padding==value)
				return;
			this._padding = value;
			this.invalidateTargetSizeAndDisplayList();
		}
		
		
		private _paddingLeft:number = NaN;
		/**
		 * 容器的左边缘与布局元素的左边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
		 * @member egret.gui.TileLayout#paddingLeft
		 */
		public get paddingLeft():number{
			return this._paddingLeft;
		}
		
		public set paddingLeft(value:number){
			if (this._paddingLeft == value)
				return;
			
			this._paddingLeft = value;
			this.invalidateTargetSizeAndDisplayList();
		}    
		
		private _paddingRight:number = NaN;
		/**
		 * 容器的右边缘与布局元素的右边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
		 * @member egret.gui.TileLayout#paddingRight
		 */
		public get paddingRight():number{
			return this._paddingRight;
		}
		
		public set paddingRight(value:number){
			if (this._paddingRight == value)
				return;
			
			this._paddingRight = value;
			this.invalidateTargetSizeAndDisplayList();
		}    
		
		private _paddingTop:number = NaN;
		/**
		 * 容器的顶边缘与第一个布局元素的顶边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
		 * @member egret.gui.TileLayout#paddingTop
		 */
		public get paddingTop():number{
			return this._paddingTop;
		}
		
		public set paddingTop(value:number){
			if (this._paddingTop == value)
				return;
			
			this._paddingTop = value;
			this.invalidateTargetSizeAndDisplayList();
		}    
		
		private _paddingBottom:number = NaN;
		/**
		 * 容器的底边缘与最后一个布局元素的底边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
		 * @member egret.gui.TileLayout#paddingBottom
		 */
		public get paddingBottom():number{
			return this._paddingBottom;
		}
		
		public set paddingBottom(value:number){
			if (this._paddingBottom == value)
				return;
			
			this._paddingBottom = value;
			this.invalidateTargetSizeAndDisplayList();
		}    
		
		
		private _horizontalAlign:string = HorizontalAlign.JUSTIFY;
		/**
		 * 指定如何在水平方向上对齐单元格内的元素。
		 * 支持的值有 HorizontalAlign.LEFT、HorizontalAlign.CENTER、
		 * HorizontalAlign.RIGHT、HorizontalAlign.JUSTIFY。
		 * 默认值：HorizontalAlign.JUSTIFY
		 * @member egret.gui.TileLayout#horizontalAlign
		 */		
		public get horizontalAlign():string{
			return this._horizontalAlign;
		}
		
		public set horizontalAlign(value:string){
			if (this._horizontalAlign == value)
				return;
			
			this._horizontalAlign = value;
			this.invalidateTargetSizeAndDisplayList();
		}
		
		private _verticalAlign:string = VerticalAlign.JUSTIFY;
		
		/**
		 * 指定如何在垂直方向上对齐单元格内的元素。
		 * 支持的值有 VerticalAlign.TOP、VerticalAlign.MIDDLE、
		 * VerticalAlign.BOTTOM、VerticalAlign.JUSTIFY。 
		 * 默认值：VerticalAlign.JUSTIFY。
		 * @member egret.gui.TileLayout#verticalAlign
		 */		
		public get verticalAlign():string{
			return this._verticalAlign;
		}
		
		public set verticalAlign(value:string){
			if (this._verticalAlign == value)
				return;
			
			this._verticalAlign = value;
			this.invalidateTargetSizeAndDisplayList();
		}
		
		private _columnAlign:string = ColumnAlign.LEFT;
		
		/**
		 * 指定如何将完全可见列与容器宽度对齐。
		 * 设置为 ColumnAlign.LEFT 时，它会关闭列两端对齐。在容器的最后一列和右边缘之间可能存在部分可见的列或空白。这是默认值。
		 * 设置为 ColumnAlign.JUSTIFY_USING_GAP 时，horizontalGap 的实际值将增大，
		 * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。仅存在一个完全可见列时，
		 * horizontalGap 的实际值将增大，这样它会将任何部分可见列推到容器的右边缘之外。
		 * 请注意显式设置 horizontalGap 属性不会关闭两端对齐。它仅确定初始间隙值。两端对齐可能会增大它。
		 * 设置为 ColumnAlign.JUSTIFY_USING_WIDTH 时，columnWidth 的实际值将增大，
		 * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。请注意显式设置 columnWidth 属性不会关闭两端对齐。
		 * 它仅确定初始列宽度值。两端对齐可能会增大它。
		 * @member egret.gui.TileLayout#columnAlign
		 */		
		public get columnAlign():string{
			return this._columnAlign;
		}
		
		public set columnAlign(value:string){
			if (this._columnAlign == value)
				return;
			
			this._columnAlign = value;
			this.invalidateTargetSizeAndDisplayList();
		}
		
		private _rowAlign:string = RowAlign.TOP;
		
		/**
		 * @member egret.gui.TileLayout#rowAlign
		 */
		public get rowAlign():string{
			return this._rowAlign;
		}
		/**
		 * 指定如何将完全可见行与容器高度对齐。
		 * 设置为 RowAlign.TOP 时，它会关闭列两端对齐。在容器的最后一行和底边缘之间可能存在部分可见的行或空白。这是默认值。
		 * 
		 * 设置为 RowAlign.JUSTIFY_USING_GAP 时，verticalGap 的实际值会增大，
		 * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。仅存在一个完全可见行时，verticalGap 的值会增大，
		 * 这样它会将任何部分可见行推到容器的底边缘之外。请注意，显式设置 verticalGap
		 * 不会关闭两端对齐，而只是确定初始间隙值。两端对齐接着可以增大它。
		 * 
		 * 设置为 RowAlign.JUSTIFY_USING_HEIGHT 时，rowHeight 的实际值会增大，
		 * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。请注意，显式设置 rowHeight 
		 * 不会关闭两端对齐，而只是确定初始行高度值。两端对齐接着可以增大它。
		 */		
		public set rowAlign(value:string){
			if (this._rowAlign == value)
				return;
			
			this._rowAlign = value;
			this.invalidateTargetSizeAndDisplayList();
		}
		
		private _orientation:string = TileOrientation.ROWS;
		/**
		 * 指定是逐行还是逐列排列元素。
		 * @member egret.gui.TileLayout#orientation
		 */		
		public get orientation():string{
			return this._orientation;
		}
		
		public set orientation(value:string){
			if (this._orientation == value)
				return;
			
			this._orientation = value;
			this.invalidateTargetSizeAndDisplayList();
			if(this.hasEventListener("orientationChanged"))
				this.dispatchEventWith("orientationChanged");
		}
		
		/**
		 * 标记目标容器的尺寸和显示列表失效
		 */		
		private invalidateTargetSizeAndDisplayList():void{
			if(this.target){
				this.target.invalidateSize();
				this.target.invalidateDisplayList();
			}
		}

		/**
		 * 基于目标的内容测量其默认大小，并（可选）测量目标的默认最小大小
		 */
		public measure():void{
			if (!this.target)
				return;
			
			var savedColumnCount:number = this._columnCount;
			var savedRowCount:number = this._rowCount;
			var savedColumnWidth:number = this._columnWidth;
			var savedRowHeight:number = this._rowHeight; 
			
			var measuredWidth:number = 0;
			var measuredHeight:number = 0;
			
			this.calculateRowAndColumn(this.target.$getExplicitWidth(),this.target.$getExplicitHeight());
			var columnCount:number = this._requestedColumnCount>0 ? this._requestedColumnCount: this._columnCount;
			var rowCount:number = this._requestedRowCount>0 ? this._requestedRowCount : this._rowCount;
			var horizontalGap:number = isNaN(this._horizontalGap)?0:this._horizontalGap;
			var verticalGap:number = isNaN(this._verticalGap)?0:this._verticalGap;
			if (columnCount > 0){
				measuredWidth = columnCount * (this._columnWidth + horizontalGap) - horizontalGap;
			}
			
			if (rowCount > 0){
				measuredHeight = rowCount * (this._rowHeight + verticalGap) - verticalGap;
			}
			
			var padding:number = isNaN(this._padding)?0:this._padding;
			var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			
			var hPadding:number = paddingL + paddingR;
			var vPadding:number = paddingT + paddingB;
			
			this.target.measuredWidth = Math.ceil(measuredWidth + hPadding);
			this.target.measuredHeight = Math.ceil(measuredHeight + vPadding);
			
			this._columnCount = savedColumnCount;
			this._rowCount = savedRowCount;
			this._columnWidth = savedColumnWidth;
			this._rowHeight = savedRowHeight; 
		}
		
		/**
		 * 计算行和列的尺寸及数量
		 */		
		private calculateRowAndColumn(explicitWidth:number, explicitHeight:number):void{
			var horizontalGap:number = isNaN(this._horizontalGap)?0:this._horizontalGap;
			var verticalGap:number = isNaN(this._verticalGap)?0:this._verticalGap;
			this._rowCount = this._columnCount = -1;
			var numElements:number = this.target.numElements;
			var count:number = numElements;
			for(var index:number = 0;index<count;index++){
				var elt:ILayoutElement = <ILayoutElement> (this.target.getElementAt(index));
				if(elt&&!elt.includeInLayout){
					numElements--;
				}
			}
			if(numElements==0){
				this._rowCount = this._columnCount = 0;
				return;
			}
			
			if(isNaN(this.explicitColumnWidth)||isNaN(this.explicitRowHeight))
				this.updateMaxElementSize();
			
			if(isNaN(this.explicitColumnWidth)){
				this._columnWidth = this.maxElementWidth;
			}
			else{
				this._columnWidth = this.explicitColumnWidth;
			}
			if(isNaN(this.explicitRowHeight)){
				this._rowHeight = this.maxElementHeight;
			}
			else{
				this._rowHeight = this.explicitRowHeight;
			}
			
			var itemWidth:number = this._columnWidth + horizontalGap;
			//防止出现除数为零的情况
			if(itemWidth <= 0)
				itemWidth = 1;
			var itemHeight:number = this._rowHeight + verticalGap;
			if(itemHeight <= 0)
				itemHeight = 1;
			
			var orientedByColumns:boolean = (this.orientation == TileOrientation.COLUMNS);
			var widthHasSet:boolean = !isNaN(explicitWidth);
			var heightHasSet:boolean = !isNaN(explicitHeight);
			
			var padding:number = isNaN(this._padding)?0:this._padding;
			var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			
			if (this._requestedColumnCount>0 || this._requestedRowCount>0){
				if (this._requestedRowCount>0)
					this._rowCount = Math.min(this._requestedRowCount,numElements);
				
				if (this._requestedColumnCount>0)
					this._columnCount = Math.min(this._requestedColumnCount,numElements);
			}
			else if(!widthHasSet&&!heightHasSet){
				var side:number = Math.sqrt(numElements*itemWidth*itemHeight);
				if(orientedByColumns){
					this._rowCount = Math.max(1,Math.round(side/itemHeight));
				}
				else{
					this._columnCount = Math.max(1,Math.round(side/itemWidth));
				}
			}
			else if(widthHasSet&&(!heightHasSet||!orientedByColumns)){
				var targetWidth:number = Math.max(0, 
					explicitWidth - paddingL - paddingR);
				this._columnCount = Math.floor((targetWidth + horizontalGap)/itemWidth);
				this._columnCount = Math.max(1,Math.min(this._columnCount,numElements));
			}
			else{
				var targetHeight:number = Math.max(0, 
					explicitHeight - paddingT - paddingB);
				this._rowCount = Math.floor((targetHeight + verticalGap)/itemHeight);
				this._rowCount = Math.max(1,Math.min(this._rowCount,numElements));
			}
			if (this._rowCount==-1)
				this._rowCount = Math.max(1, Math.ceil(numElements / this._columnCount));
			if (this._columnCount==-1)
				this._columnCount = Math.max(1, Math.ceil(numElements / this._rowCount));
			if (this._requestedColumnCount>0&&this._requestedRowCount>0){
				if (this.orientation == TileOrientation.ROWS)
					this._rowCount = Math.max(1, Math.ceil(numElements / this._requestedColumnCount));
				else
					this._columnCount = Math.max(1, Math.ceil(numElements / this._requestedRowCount));
			}
		}
		/**
		 * 缓存的最大子对象宽度
		 */		
		private maxElementWidth:number = 0;
		/**
		 * 缓存的最大子对象高度 
		 */		
		private maxElementHeight:number = 0;
		/**
		 * 更新最大子对象尺寸
		 */		
		private updateMaxElementSize():void{
			if(!this.target)
				return;
			if(this.useVirtualLayout)
				this.updateMaxElementSizeVirtual();
			else 
				this.updateMaxElementSizeReal();
		}
		/**
		 * 更新虚拟布局的最大子对象尺寸
		 */		
		private updateMaxElementSizeVirtual():void{
			var typicalHeight:number = this.typicalLayoutRect?this.typicalLayoutRect.height:22;
			var typicalWidth:number = this.typicalLayoutRect?this.typicalLayoutRect.width:22;
			this.maxElementWidth = Math.max(this.maxElementWidth,typicalWidth);
			this.maxElementHeight = Math.max(this.maxElementHeight,typicalHeight);

			if ((this.startIndex != -1) && (this.endIndex != -1)){
				for (var index:number = this.startIndex; index <= this.endIndex; index++){
					var elt:ILayoutElement = <ILayoutElement> (this.target.getVirtualElementAt(index));
					if(!elt||!elt.includeInLayout)
						continue;
					this.maxElementWidth = Math.max(this.maxElementWidth,elt.preferredWidth);
					this.maxElementHeight = Math.max(this.maxElementHeight,elt.preferredHeight);
				}
			}
				
		}
		/**
		 * 更新真实布局的最大子对象尺寸
		 */		
		private updateMaxElementSizeReal():void{
			var numElements:number = this.target.numElements;
			for(var index:number = 0;index<numElements;index++){
				var elt:ILayoutElement = <ILayoutElement> (this.target.getElementAt(index));
				if(!elt||!elt.includeInLayout)
					continue;
				this.maxElementWidth = Math.max(this.maxElementWidth,elt.preferredWidth);
				this.maxElementHeight = Math.max(this.maxElementHeight,elt.preferredHeight);
			}
		}
		
		/**
		 * 如果 useVirtualLayout 为 true，则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息
		 * @method egret.gui.TileLayout#clearVirtualLayoutCache
		 */
		public clearVirtualLayoutCache():void{
			super.clearVirtualLayoutCache();
			this.maxElementWidth = 0;
			this.maxElementHeight = 0;
		}
		
		/**
		 * 当前视图中的第一个元素索引
		 */		
		private startIndex:number = -1;
		/**
		 * 当前视图中的最后一个元素的索引
		 */		
		private endIndex:number = -1;
		/**
		 * 视图的第一个和最后一个元素的索引值已经计算好的标志 
		 */		
		private indexInViewCalculated:boolean = false;

		/**
		 * verticalScrollPosition 或 horizontalScrollPosition 属性更改时调用
		 */
		public scrollPositionChanged():void{
			super.scrollPositionChanged();
			if(this.useVirtualLayout){
				var changed:boolean = this.getIndexInView();
				if(changed){
					this.indexInViewCalculated = true;
					this.target.invalidateDisplayList();
				}
			}
			
		}
		
		/**
		 * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
		 */		
		private getIndexInView():boolean{
			if(!this.target||this.target.numElements==0){
				this.startIndex = this.endIndex = -1;
				return false;
			}
			
			var numElements:number = this.target.numElements;
			if(!this.useVirtualLayout){
				this.startIndex = 0;
				this.endIndex = numElements-1;
				return false;
			}
			
			if(isNaN(this.target.width)||this.target.width==0||isNaN(this.target.height)||this.target.height==0){
				this.startIndex = this.endIndex = -1;
				return false;
			}
			var oldStartIndex:number = this.startIndex;
			var oldEndIndex:number = this.endIndex;
			var padding:number = isNaN(this._padding)?0:this._padding;
			var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			var horizontalGap:number = isNaN(this._horizontalGap)?0:this._horizontalGap;
			var verticalGap:number = isNaN(this._verticalGap)?0:this._verticalGap;
			if(this.orientation == TileOrientation.COLUMNS){
				var itemWidth:number = this._columnWidth + horizontalGap;
				if(itemWidth <= 0){
					this.startIndex = 0;
					this.endIndex = numElements-1;
					return false;
				}
				var minVisibleX:number = this.target.horizontalScrollPosition;
				var maxVisibleX:number = this.target.horizontalScrollPosition+this.target.width;
				var startColumn:number = Math.floor((minVisibleX-paddingL)/itemWidth);
				if(startColumn<0)
					startColumn = 0;
				var endColumn:number = Math.ceil((maxVisibleX-paddingL)/itemWidth);
				if(endColumn<0)
					endColumn = 0;
				this.startIndex = Math.min(numElements-1,Math.max(0,startColumn*this._rowCount));
				this.endIndex = Math.min(numElements-1,Math.max(0,endColumn*this._rowCount-1));
			}
			else{
				var itemHeight:number = this._rowHeight + verticalGap;
				if(itemHeight <= 0){
					this.startIndex = 0;
					this.endIndex = numElements-1;
					return false;
				}
				var minVisibleY:number = this.target.verticalScrollPosition;
				var maxVisibleY:number = this.target.verticalScrollPosition+this.target.height;
				var startRow:number = Math.floor((minVisibleY-paddingT)/itemHeight);
				if(startRow<0)
					startRow = 0;
				var endRow:number = Math.ceil((maxVisibleY-paddingT)/itemHeight);
				if(endRow<0)
					endRow = 0;
				this.startIndex = Math.min(numElements-1,Math.max(0,startRow*this._columnCount));
				this.endIndex = Math.min(numElements-1,Math.max(0,endRow*this._columnCount-1));
			}
			
			return this.startIndex != oldStartIndex||this.endIndex != oldEndIndex;
		}
		
		/**
		 * 调整目标的元素的大小并定位这些元素
		 * @param width {number}
		 * @param height {number} 
		 */
		public updateDisplayList(width:number, height:number):void{
			super.updateDisplayList(width, height);
			if (!this.target)
				return;
			var padding:number = isNaN(this._padding)?0:this._padding;
			var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			if(this.indexInViewCalculated){
				this.indexInViewCalculated = false;
			}
			else{
				this.calculateRowAndColumn(width,height);
				if(this._rowCount==0||this._columnCount==0){
					this.target.setContentSize(paddingL+paddingR,paddingT+paddingB);
					return;
				}
				this.adjustForJustify(width,height);
				this.getIndexInView();
			}
			if(this.useVirtualLayout){
				this.calculateRowAndColumn(width,height);
                this.adjustForJustify(width,height);
			}

			if(this.startIndex == -1||this.endIndex==-1){
				this.target.setContentSize(0,0);
				return;
			}
			this.target.setVirtualElementIndicesInView(this.startIndex,this.endIndex);
			var elt:ILayoutElement;
			var x:number;
			var y:number;
			var columnIndex:number;
			var rowIndex:number;
			var orientedByColumns:boolean = (this.orientation == TileOrientation.COLUMNS);
			var index:number = this.startIndex;
			var horizontalGap:number = isNaN(this._horizontalGap)?0:this._horizontalGap;
			var verticalGap:number = isNaN(this._verticalGap)?0:this._verticalGap;
			for(var i:number = this.startIndex;i <= this.endIndex;i++){
				if(this.useVirtualLayout)
					elt = <ILayoutElement> (this.target.getVirtualElementAt(i));
				else
					elt = <ILayoutElement> (this.target.getElementAt(i));
				if(elt == null||!elt.includeInLayout)
					continue;
				
				if(orientedByColumns){
					columnIndex = Math.ceil((index+1)/this._rowCount)-1;
					rowIndex = Math.ceil((index+1)%this._rowCount)-1;
					if(rowIndex == -1)
						rowIndex = this._rowCount-1;
				}
				else{
					columnIndex = Math.ceil((index+1)%this._columnCount) - 1;
					if(columnIndex == -1)
						columnIndex = this._columnCount - 1;
					rowIndex = Math.ceil((index+1)/this._columnCount) - 1;
				}
				x = columnIndex*(this._columnWidth+horizontalGap)+paddingL;
				y = rowIndex*(this._rowHeight+verticalGap)+paddingT;
				this.sizeAndPositionElement(elt,x,y,this._columnWidth,this.rowHeight);
				index++;
			}
			
			var hPadding:number = paddingL + paddingR;
			var vPadding:number = paddingT + paddingB;
			var contentWidth:number = (this._columnWidth+horizontalGap)*this._columnCount-horizontalGap;
			var contentHeight:number = (this._rowHeight+verticalGap)*this._rowCount-verticalGap;
			this.target.setContentSize(Math.ceil(contentWidth+hPadding),Math.ceil(contentHeight+vPadding));
		}

		/**
		 * 为单个元素布局
		 */		
		private sizeAndPositionElement(element:ILayoutElement,cellX:number,cellY:number,
												cellWidth:number,cellHeight:number):void{
			var elementWidth:number = NaN;
			var elementHeight:number = NaN;
			
			if (this.horizontalAlign == HorizontalAlign.JUSTIFY)
				elementWidth = cellWidth;
			else if (!isNaN(element.percentWidth))
				elementWidth = cellWidth * element.percentWidth * 0.01;
			
			if (this.verticalAlign == VerticalAlign.JUSTIFY)
				elementHeight = cellHeight;
			else if (!isNaN(element.percentHeight))
				elementHeight = cellHeight * element.percentHeight * 0.01;
			
			
			element.setLayoutBoundsSize(Math.round(elementWidth), Math.round(elementHeight));
			
			var x:number = cellX;
			switch (this.horizontalAlign){
				case HorizontalAlign.RIGHT:
					x += cellWidth - element.layoutBoundsWidth;
					break;
				case HorizontalAlign.CENTER:
					x = cellX + (cellWidth - element.layoutBoundsWidth) / 2;
					break;
			}
			
			var y:number = cellY;
			switch (this.verticalAlign){
				case VerticalAlign.BOTTOM:
					y += cellHeight - element.layoutBoundsHeight;
					break;
				case VerticalAlign.MIDDLE:
					y += (cellHeight - element.layoutBoundsHeight) / 2;
					break;
			}
			element.setLayoutBoundsPosition(Math.round(x), Math.round(y));
		}			
		
		
		/**
		 * 为两端对齐调整间隔或格子尺寸
		 */		
		private adjustForJustify(width:number,height:number):void{
			var padding:number = isNaN(this._padding)?0:this._padding;
			var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			
			var targetWidth:number = Math.max(0, 
				width - paddingL - paddingR);
			var targetHeight:number = Math.max(0, 
				height - paddingT - paddingB);
			if(!isNaN(this.explicitVerticalGap))
				this._verticalGap = this.explicitVerticalGap;
			if(!isNaN(this.explicitHorizontalGap))
				this._horizontalGap = this.explicitHorizontalGap;
			this._verticalGap = isNaN(this._verticalGap)?0:this._verticalGap;
			this._horizontalGap = isNaN(this._horizontalGap)?0:this._horizontalGap;
			
			var itemWidth:number = this._columnWidth + this._horizontalGap;
			if(itemWidth <= 0)
				itemWidth = 1;
			var itemHeight:number = this._rowHeight + this._verticalGap;
			if(itemHeight <= 0)
				itemHeight = 1;
			
			var offsetY:number = targetHeight-this._rowHeight*this._rowCount;
			var offsetX:number = targetWidth-this._columnWidth*this._columnCount;
			var gapCount:number;
			if(offsetY>0){
				if(this.rowAlign == RowAlign.JUSTIFY_USING_GAP){
					gapCount = Math.max(1,this._rowCount-1);
					this._verticalGap = offsetY/gapCount;
				}
				else if(this.rowAlign == RowAlign.JUSTIFY_USING_HEIGHT){
					if(this._rowCount>0){
						this._rowHeight += (offsetY-(this._rowCount-1)*this._verticalGap)/this._rowCount;
					}
				}
			}
			if(offsetX>0){
				if(this.columnAlign == ColumnAlign.JUSTIFY_USING_GAP){
					gapCount = Math.max(1,this._columnCount-1);
					this._horizontalGap = offsetX/gapCount;
				}
				else if(this.columnAlign == ColumnAlign.JUSTIFY_USING_WIDTH){
					if(this._columnCount>0){
						this._columnWidth += (offsetX-(this._columnCount-1)*this._horizontalGap)/this._columnCount;
					}
				}
			}			
		}
	}
}