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


namespace egret.gui {

	/**
	 * @class egret.gui.HorizontalLayout
	 * @classdesc
	 * 水平布局
	 * @extends egret.gui.LayoutBase
	 */
	export class HorizontalLayout extends LayoutBase{
		/**
		 * @method egret.gui.HorizontalLayout#constructor
		 */
		public constructor(){
			super();
		}
		
		private _horizontalAlign:string = HorizontalAlign.LEFT;
		/**
		 * 布局元素的水平对齐策略。参考HorizontalAlign定义的常量。
		 * 注意：此属性设置为CONTENT_JUSTIFY始终无效。当useVirtualLayout为true时，设置JUSTIFY也无效。
		 * @member egret.gui.HorizontalLayout#horizontalAlign
		 */
		public get horizontalAlign():string{
			return this._horizontalAlign;
		}
		
		public set horizontalAlign(value:string){
			if(this._horizontalAlign==value)
				return;
			this._horizontalAlign = value;
			if(this.target)
				this.target.invalidateDisplayList();
		}
		
		private _verticalAlign:string = VerticalAlign.TOP;
		/**
		 * 布局元素的竖直对齐策略。参考VerticalAlign定义的常量。
		 * @member egret.gui.HorizontalLayout#verticalAlign
		 */
		public get verticalAlign():string{
			return this._verticalAlign;
		}
		
		public set verticalAlign(value:string){
			if(this._verticalAlign==value)
				return;
			this._verticalAlign = value;
			if(this.target)
				this.target.invalidateDisplayList();
		}
		
		private _gap:number = 6;
		/**
		 * 布局元素之间的水平空间（以像素为单位）
		 * @member egret.gui.HorizontalLayout#gap
		 */
		public get gap():number{
			return this._gap;
		}

		public set gap(value:number){
			if (this._gap == value) 
				return;
			this._gap = value;
			this.invalidateTargetSizeAndDisplayList();
			if(this.hasEventListener("gapChanged"))
				this.dispatchEventWith("gapChanged");
		}
		
		private _padding:number = 0;
		/**
		 * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
		 * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
		 * @member egret.gui.HorizontalLayout#padding
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
		 * @member egret.gui.HorizontalLayout#paddingLeft
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
		 * @member egret.gui.HorizontalLayout#paddingRight
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
		 * @member egret.gui.HorizontalLayout#paddingTop
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
		 * @member egret.gui.HorizontalLayout#paddingBottom
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
		 * @method egret.gui.HorizontalLayout#measure
		 */
		public measure():void{
			super.measure();
			if(!this.target)
				return;
			if(this.useVirtualLayout){
				this.measureVirtual();
			}
			else{
				this.measureReal();
			}
		}
		
		/**
		 * 测量使用虚拟布局的尺寸
		 */		
		private measureVirtual():void{
			let numElements:number = this.target.numElements;
			let typicalHeight:number = this.typicalLayoutRect?this.typicalLayoutRect.height:22;
			let typicalWidth:number = this.typicalLayoutRect?this.typicalLayoutRect.width:71;
			let measuredWidth:number = this.getElementTotalSize();
			let measuredHeight:number = Math.max(this.maxElementHeight,typicalHeight);
			
			let visibleIndices:number[] = this.target.getElementIndicesInView();
            let length:number = visibleIndices.length;
			for(let i:number=0;i<length;i++){
                let index:number = visibleIndices[i];
				let layoutElement:ILayoutElement = <ILayoutElement> (this.target.getElementAt(index));
				if (layoutElement == null||!layoutElement.includeInLayout)
					continue;
				
				let preferredWidth:number = layoutElement.preferredWidth;
				let preferredHeight:number = layoutElement.preferredHeight;
				measuredWidth += preferredWidth;
				measuredWidth -= isNaN(this.elementSizeTable[index])?typicalWidth:this.elementSizeTable[index];
				measuredHeight = Math.max(measuredHeight,preferredHeight);
			}
			let padding:number = isNaN(this._padding)?0:this._padding;
			let paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			let paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			let paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			let paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			
			let hPadding:number = paddingL + paddingR;
			let vPadding:number = paddingT + paddingB;
			this.target.measuredWidth = Math.ceil(measuredWidth+hPadding);
			this.target.measuredHeight = Math.ceil(measuredHeight+vPadding);
		}
		
		/**
		 * 测量使用真实布局的尺寸
		 */		
		private measureReal():void{
			let count:number = this.target.numElements;
			let numElements:number = count;
			let measuredWidth:number = 0;
			let measuredHeight:number = 0;
			for (let i:number = 0; i < count; i++){
				let layoutElement:ILayoutElement = <ILayoutElement> (this.target.getElementAt(i));
				if (!layoutElement||!layoutElement.includeInLayout){
					numElements--;
					continue;
				}
				let preferredWidth:number = layoutElement.preferredWidth;
				let preferredHeight:number = layoutElement.preferredHeight;
				measuredWidth += preferredWidth;
				measuredHeight = Math.max(measuredHeight,preferredHeight);
			}
			let gap:number = isNaN(this._gap)?0:this._gap;
			measuredWidth += (numElements-1)*gap;
			let padding:number = isNaN(this._padding)?0:this._padding;
			let paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			let paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			let paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			let paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			let hPadding:number = paddingL + paddingR;
			let vPadding:number = paddingT + paddingB;
			this.target.measuredWidth = Math.ceil(measuredWidth+hPadding);
			this.target.measuredHeight = Math.ceil(measuredHeight+vPadding);
		}
		
		/**
		 * 调整目标的元素的大小并定位这些元素
		 * @method egret.gui.HorizontalLayout#updateDisplayList
		 * @param width {number} 
		 * @param height {number} 
		 */
		public updateDisplayList(width:number, height:number):void{
			super.updateDisplayList(width, height);
			if(!this.target)
				return;

            if (this.target.numElements == 0)
            {
                let padding:number = isNaN(this._padding)?0:this._padding;
                let paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
                let paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
                let paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
                let paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
                this.target.setContentSize(Math.ceil(paddingL+paddingR),Math.ceil(paddingT+paddingB));
                return;
            }

			if(this.useVirtualLayout){
				this.updateDisplayListVirtual(width,height);
			}
			else{
				this.updateDisplayListReal(width,height);
			}
		}
		
		
		/**
		 * 虚拟布局使用的子对象尺寸缓存 
		 */		
		private elementSizeTable:any[] = [];
		
		/**
		 * 获取指定索引的起始位置
		 */		
		private getStartPosition(index:number):number{
			let padding:number = isNaN(this._padding)?0:this._padding;
			let paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			let gap:number = isNaN(this._gap)?0:this._gap;
			if(!this.useVirtualLayout){
				let element:IVisualElement;
				if(this.target){
					element = this.target.getElementAt(index);
				}
				return element?element.x:paddingL;
			}
			let typicalWidth:number = this.typicalLayoutRect?this.typicalLayoutRect.width:71;
			let startPos:number = paddingL;
			for(let i:number = 0;i<index;i++){
				let eltWidth:number = this.elementSizeTable[i];
				if(isNaN(eltWidth)){
					eltWidth = typicalWidth;
				}
				startPos += eltWidth+gap;
			}
			return startPos;
		}
		
		/**
		 * 获取指定索引的元素尺寸
		 */		
		private getElementSize(index:number):number{
			if(this.useVirtualLayout){
				let size:number = this.elementSizeTable[index];
				if(isNaN(size)){
					size = this.typicalLayoutRect?this.typicalLayoutRect.width:71;
				}
				return size;
			}
			if(this.target){
				return this.target.getElementAt(index).width;
			}
			return 0;
		}
		
		/**
		 * 获取缓存的子对象尺寸总和
		 */		
		private getElementTotalSize():number{
			let typicalWidth:number = this.typicalLayoutRect?this.typicalLayoutRect.width:71;
			let gap:number = isNaN(this._gap)?0:this._gap;
			let totalSize:number = 0;
			let length:number = this.target.numElements;
			for(let i:number = 0; i<length; i++){
				let eltWidth:number = this.elementSizeTable[i];
				if(isNaN(eltWidth)){
					eltWidth = typicalWidth;
				}
				totalSize += eltWidth+gap;
			}
			totalSize -= gap;
			return totalSize;
		}
		
		public elementAdded(index:number):void{
			if(!this.useVirtualLayout)
				return;
			super.elementAdded(index);
			let typicalWidth:number = this.typicalLayoutRect?this.typicalLayoutRect.width:71;
			this.elementSizeTable.splice(index,0,typicalWidth);
		}
		
		public elementRemoved(index:number):void{
			if(!this.useVirtualLayout)
				return;
			super.elementRemoved(index);
			this.elementSizeTable.splice(index,1);
		}

		/**
		 * 如果 useVirtualLayout 为 true，则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息
		 */
		public clearVirtualLayoutCache():void{
			if(!this.useVirtualLayout)
				return;
			super.clearVirtualLayoutCache();
			this.elementSizeTable = [];
			this.maxElementHeight = 0;
		}
		
		
		
		/**
		 * 折半查找法寻找指定位置的显示对象索引
		 */		
		private findIndexAt(x:number, i0:number, i1:number):number{
			let index:number = Math.floor((i0 + i1) *0.5);
			let elementX:number = this.getStartPosition(index);
			let elementWidth:number = this.getElementSize(index);
			let gap:number = isNaN(this._gap)?0:this._gap;
			if ((x >= elementX) && (x < elementX + elementWidth + gap))
				return index;
			else if (i0 == i1)
				return -1;
			else if (x < elementX)
				return this.findIndexAt(x, i0, Math.max(i0, index-1));
			else 
				return this.findIndexAt(x, Math.min(index+1, i1), i1);
		} 
		
		/**
		 * 虚拟布局使用的当前视图中的第一个元素索引
		 */		
		private startIndex:number = -1;
		/**
		 * 虚拟布局使用的当前视图中的最后一个元素的索引
		 */		
		private endIndex:number = -1;
		/**
		 * 视图的第一个和最后一个元素的索引值已经计算好的标志 
		 */		
		private indexInViewCalculated:boolean = false;
		
		/**
		 * verticalScrollPosition 或 horizontalScrollPosition 属性更改时调用
		 * @method egret.gui.HorizontalLayout#scrollPositionChanged
		 */
		public scrollPositionChanged():void{
			super.scrollPositionChanged();
			if(this.useVirtualLayout){
				let changed:boolean = this.getIndexInView();
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
			
			if(isNaN(this.target.width)||this.target.width==0||isNaN(this.target.height)||this.target.height==0){
				this.startIndex = this.endIndex = -1;
				return false;
			}
			
			let padding:number = isNaN(this._padding)?0:this._padding;
			let paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			let paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			let paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			let paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			
			let numElements:number = this.target.numElements;
			let contentWidth:number = this.getStartPosition(numElements-1)+
				this.elementSizeTable[numElements-1]+paddingR;			
			let minVisibleX:number = this.target.horizontalScrollPosition;
			if(minVisibleX>contentWidth-paddingR){
				this.startIndex = -1;
				this.endIndex = -1;
				return false;
			}
			let maxVisibleX:number = this.target.horizontalScrollPosition + this.target.width;
			if(maxVisibleX<paddingL){
				this.startIndex = -1;
				this.endIndex = -1;
				return false;
			}
			let oldStartIndex:number = this.startIndex;
			let oldEndIndex:number = this.endIndex;
			this.startIndex = this.findIndexAt(minVisibleX,0,numElements-1);
			if(this.startIndex==-1)
				this.startIndex = 0;
			this.endIndex = this.findIndexAt(maxVisibleX,0,numElements-1);
			if(this.endIndex == -1)
				this.endIndex = numElements-1;
			return oldStartIndex!=this.startIndex||oldEndIndex!=this.endIndex;
		}
		
		/**
		 * 子对象最大宽度 
		 */		
		private maxElementHeight:number = 0;
		
		/**
		 * 更新使用虚拟布局的显示列表
		 */		
		private updateDisplayListVirtual(width:number,height:number):void{
			if(this.indexInViewCalculated)
				this.indexInViewCalculated = false;
			else
				this.getIndexInView();
			let padding:number = isNaN(this._padding)?0:this._padding;
			let paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			let paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			let paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			let gap:number = isNaN(this._gap)?0:this._gap;
			let contentWidth:number;
			let numElements:number = this.target.numElements;
			if(this.startIndex == -1||this.endIndex==-1){
				contentWidth = this.getStartPosition(numElements)-gap+paddingR;
				this.target.setContentSize(Math.ceil(contentWidth),this.target.contentHeight);
				return;
			}
			this.target.setVirtualElementIndicesInView(this.startIndex,this.endIndex);
			//获取垂直布局参数
			let justify:boolean = this._verticalAlign==VerticalAlign.JUSTIFY||this._verticalAlign==VerticalAlign.CONTENT_JUSTIFY;
			let contentJustify:boolean = this._verticalAlign==VerticalAlign.CONTENT_JUSTIFY;
			let vAlign:number = 0;
			if(!justify){
				if(this._verticalAlign==VerticalAlign.MIDDLE){
					vAlign = 0.5;
				}
				else if(this._verticalAlign==VerticalAlign.BOTTOM){
					vAlign = 1;
				}
			}
			
			let targetHeight:number = Math.max(0, height - paddingT - paddingB);
			let justifyHeight:number = Math.ceil(targetHeight);
			let layoutElement:ILayoutElement;
			let typicalHeight:number = this.typicalLayoutRect?this.typicalLayoutRect.height:22;
			let typicalWidth:number = this.typicalLayoutRect?this.typicalLayoutRect.width:71;
			let oldMaxH:number = Math.max(typicalHeight,this.maxElementHeight);
			if(contentJustify){
				for(let index:number=this.startIndex;index<=this.endIndex;index++){
					layoutElement = <ILayoutElement> (this.target.getVirtualElementAt(index));
					if (!layoutElement||!layoutElement.includeInLayout)
						continue;
					this.maxElementHeight = Math.max(this.maxElementHeight,layoutElement.preferredHeight);
				}
				justifyHeight = Math.ceil(Math.max(targetHeight,this.maxElementHeight));
			}
			let x:number = 0;
			let y:number = 0;
			let contentHeight:number = 0;
			let oldElementSize:number;
			let needInvalidateSize:boolean = false;
			//对可见区域进行布局
			for(let i:number=this.startIndex;i<=this.endIndex;i++){
				let exceesHeight:number = 0;
				layoutElement = <ILayoutElement> (this.target.getVirtualElementAt(i));
				if (!layoutElement){
					continue;
				}
				else if(!layoutElement.includeInLayout){
					this.elementSizeTable[i] = 0;
					continue;
				}
				if(justify){
					y = paddingT;
					layoutElement.setLayoutBoundsSize(NaN,justifyHeight);
				}
				else{
					exceesHeight = (targetHeight - layoutElement.layoutBoundsHeight)*vAlign;
					exceesHeight = exceesHeight>0?exceesHeight:0;
					y = paddingT+exceesHeight;
				}
				if(!contentJustify)
					this.maxElementHeight = Math.max(this.maxElementHeight,layoutElement.preferredHeight);
				contentHeight = Math.max(contentHeight,layoutElement.layoutBoundsHeight);
				if(!needInvalidateSize){
					oldElementSize = isNaN(this.elementSizeTable[i])?typicalWidth:this.elementSizeTable[i];
					if(oldElementSize!=layoutElement.layoutBoundsWidth)
						needInvalidateSize = true;
				}
				if(i==0&&this.elementSizeTable.length>0&&this.elementSizeTable[i]!=layoutElement.layoutBoundsWidth)
					this.typicalLayoutRect = null;
				this.elementSizeTable[i] = layoutElement.layoutBoundsWidth;
				x = this.getStartPosition(i);
				layoutElement.setLayoutBoundsPosition(Math.round(x),Math.round(y));
			}
			
			contentHeight += paddingT+paddingB;
			contentWidth = this.getStartPosition(numElements)-gap+paddingR;	
			this.target.setContentSize(Math.ceil(contentWidth),
				Math.ceil(contentHeight));
			if(needInvalidateSize||oldMaxH<this.maxElementHeight){
				this.target.invalidateSize();
			}
		}
		
		
		
		
		/**
		 * 更新使用真实布局的显示列表
		 */		
		private updateDisplayListReal(width:number,height:number):void{
			let padding:number = isNaN(this._padding)?0:this._padding;
			let paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			let paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			let paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			let paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			let gap:number = isNaN(this._gap)?0:this._gap;
			let targetWidth:number = Math.max(0, width - paddingL - paddingR);
			let targetHeight:number = Math.max(0, height - paddingT - paddingB);
			
			let hJustify:boolean = this._horizontalAlign==HorizontalAlign.JUSTIFY;
			let vJustify:boolean = this._verticalAlign==VerticalAlign.JUSTIFY||this._verticalAlign==VerticalAlign.CONTENT_JUSTIFY;
			let vAlign:number = 0;
			if(!vJustify){
				if(this._verticalAlign==VerticalAlign.MIDDLE){
					vAlign = 0.5;
				}
				else if(this._verticalAlign==VerticalAlign.BOTTOM){
					vAlign = 1;
				}
			}
			
			let count:number = this.target.numElements;
			let numElements:number = count;
			let x:number = paddingL;
			let y:number = paddingT;
			let i:number;
			let layoutElement:ILayoutElement;
			
			let totalPreferredWidth:number = 0;
			let totalPercentWidth:number = 0;
			let childInfoArray:any[] = [];
			let childInfo:ChildInfo;
			let widthToDistribute:number = targetWidth;
			for (i = 0; i < count; i++){
				layoutElement = <ILayoutElement> (this.target.getElementAt(i));
				if (!layoutElement||!layoutElement.includeInLayout){
					numElements--;
					continue;
				}
				this.maxElementHeight = Math.max(this.maxElementHeight,layoutElement.preferredHeight);
				if(hJustify){
					totalPreferredWidth += layoutElement.preferredWidth;
				}
				else{
					if(!isNaN(layoutElement.percentWidth)){
						totalPercentWidth += layoutElement.percentWidth;
						
						childInfo = new ChildInfo();
						childInfo.layoutElement = layoutElement;
						childInfo.percent    = layoutElement.percentWidth;
						childInfo.min        = layoutElement.minWidth
						childInfo.max        = layoutElement.maxWidth;
						childInfoArray.push(childInfo);
						
					}
					else{
						widthToDistribute -= layoutElement.preferredWidth;
					}
				}
			}
			widthToDistribute -= gap * (numElements - 1);
			widthToDistribute = widthToDistribute>0?widthToDistribute:0;
			let excessSpace:number = targetWidth - totalPreferredWidth - gap * (numElements - 1);
			
			let averageWidth:number;
			let largeChildrenCount:number = numElements;
			let widthDic:any[] = [];
			if(hJustify){
				if(excessSpace<0){
					averageWidth = widthToDistribute / numElements;
					for (i = 0; i < count; i++){
						layoutElement = this.target.getElementAt(i);
						if (!layoutElement || !layoutElement.includeInLayout)
							continue;
						
						let preferredWidth:number = layoutElement.preferredWidth;
						if (preferredWidth <= averageWidth){
							widthToDistribute -= preferredWidth;
							largeChildrenCount--;
							continue;
						}
					}
					widthToDistribute = widthToDistribute>0?widthToDistribute:0;
				}
			}
			else{
				if(totalPercentWidth>0){
					HorizontalLayout.flexChildrenProportionally(targetWidth,widthToDistribute,
						totalPercentWidth,childInfoArray);
					let roundOff:number = 0;
                    let length:number = childInfoArray.length;
					for (i=0;i<length;i++){
                        childInfo = childInfoArray[i];
						let childSize:number = Math.round(childInfo.size + roundOff);
						roundOff += childInfo.size - childSize;
						
						widthDic[childInfo.layoutElement.hashCode] = childSize;
						widthToDistribute -= childSize;
					}
					widthToDistribute = widthToDistribute>0?widthToDistribute:0;
				}
			}
			
			if(this._horizontalAlign==HorizontalAlign.CENTER){
				x = paddingL+widthToDistribute*0.5;
			}
			else if(this._horizontalAlign==HorizontalAlign.RIGHT){
				x = paddingL+widthToDistribute;
			}
			
			let maxX:number = paddingL;
			let maxY:number = paddingT;
			let dx:number = 0;
			let dy:number = 0;
			let justifyHeight:number = Math.ceil(targetHeight);
			if(this._verticalAlign==VerticalAlign.CONTENT_JUSTIFY)
				justifyHeight = Math.ceil(Math.max(targetHeight,this.maxElementHeight));
			let roundOff = 0;
			let layoutElementWidth:number;
			let childWidth:number;
			for (i = 0; i < count; i++){
				let exceesHeight:number = 0;
				layoutElement = <ILayoutElement> (this.target.getElementAt(i));
				if (!layoutElement||!layoutElement.includeInLayout)
					continue;
				layoutElementWidth = NaN;
				if(hJustify){
					childWidth = NaN;
					if(excessSpace>0){
						childWidth = widthToDistribute * layoutElement.preferredWidth / totalPreferredWidth;
					}
					else if(excessSpace<0&&layoutElement.preferredWidth>averageWidth){
						childWidth = widthToDistribute / largeChildrenCount
					}
					if(!isNaN(childWidth)){
						layoutElementWidth = Math.round(childWidth + roundOff);
						roundOff += childWidth - layoutElementWidth;
					}
				}
				else{
					layoutElementWidth = widthDic[layoutElement.hashCode];
				}
				if(vJustify){
					y = paddingT;
					layoutElement.setLayoutBoundsSize(layoutElementWidth,justifyHeight);
				}
				else{
					let layoutElementHeight:number = NaN;
					if(!isNaN(layoutElement.percentHeight)){
						let percent:number = Math.min(100,layoutElement.percentHeight);
						layoutElementHeight = Math.round(targetHeight*percent*0.01);
					}
					layoutElement.setLayoutBoundsSize(layoutElementWidth,layoutElementHeight);
					exceesHeight = (targetHeight - layoutElement.layoutBoundsHeight)*vAlign;
					exceesHeight = exceesHeight>0?exceesHeight:0;
					y = paddingT+exceesHeight;
				}
				layoutElement.setLayoutBoundsPosition(Math.round(x),Math.round(y));
				dx = Math.ceil(layoutElement.layoutBoundsWidth);
				dy = Math.ceil(layoutElement.layoutBoundsHeight);
				maxX = Math.max(maxX,x+dx);
				maxY = Math.max(maxY,y+dy);
				x += dx+gap;
			}
			this.target.setContentSize(Math.ceil(maxX+paddingR),Math.ceil(maxY+paddingB));
		}
		
		/**
		 * 为每个可变尺寸的子项分配空白区域
		 * @param spaceForChildren {number}
		 * @param spaceToDistribute {number} 
		 * @param totalPercent {number} 
		 * @param childInfoArray {any[]}
		 */		
		public static flexChildrenProportionally(spaceForChildren:number,spaceToDistribute:number,
															totalPercent:number,childInfoArray:any[]):void{
			
			let numChildren:number = childInfoArray.length;
			let done:boolean;
			
			do{
				done = true; 
				
				let unused:number = spaceToDistribute -
					(spaceForChildren * totalPercent / 100);
				if (unused > 0)
					spaceToDistribute -= unused;
				else
					unused = 0;
				
				let spacePerPercent:number = spaceToDistribute / totalPercent;
				
				for (let i:number = 0; i < numChildren; i++){
					let childInfo:ChildInfo = childInfoArray[i];
					
					let size:number = childInfo.percent * spacePerPercent;
					
					if (size < childInfo.min){
						let min:number = childInfo.min;
						childInfo.size = min;
						
						childInfoArray[i] = childInfoArray[--numChildren];
						childInfoArray[numChildren] = childInfo;
						
						totalPercent -= childInfo.percent;
						if (unused >= min){
							unused -= min;
						}
						else{
							spaceToDistribute -= min - unused;
							unused = 0;
						}
						done = false;
						break;
					}
					else if (size > childInfo.max){
						let max:number = childInfo.max;
						childInfo.size = max;
						
						childInfoArray[i] = childInfoArray[--numChildren];
						childInfoArray[numChildren] = childInfo;
						
						totalPercent -= childInfo.percent;
						if (unused >= max){
							unused -= max;
						}
						else{
							spaceToDistribute -= max - unused;
							unused = 0;
						}
						done = false;
						break;
					}
					else{
						childInfo.size = size;
					}
				}
			} 
			while (!done);
		}
	}

    class ChildInfo{

		/**
		 * @member egret.ChildInfo#layoutElement
		 */
        public layoutElement: ILayoutElement = null;

		/**
		 * @member egret.ChildInfo#size
		 */
        public size:number = 0;

		/**
		 * @member egret.ChildInfo#percent
		 */
        public percent:number = NaN;

		/**
		 * @member egret.ChildInfo#min
		 */
        public min:number = NaN;

		/**
		 * @member egret.ChildInfo#max
		 */
        public max:number = NaN;
    }
}