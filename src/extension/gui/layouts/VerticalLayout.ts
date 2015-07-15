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
	 * @class egret.gui.VerticalLayout
	 * @classdesc
	 * 垂直布局
	 * @extends egret.gui.LayoutBase
	 */
    export class VerticalLayout extends LayoutBase{
		/**
		 * @method egret.gui.VerticalLayout#constructor
		 */
        public constructor(){
            super();
        }

        private _horizontalAlign:string = HorizontalAlign.LEFT;
        /**
         * 布局元素的水平对齐策略。参考HorizontalAlign定义的常量。
		 * @member egret.gui.VerticalLayout#horizontalAlign
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
         * 注意：此属性设置为CONTENT_JUSTIFY始终无效。当useVirtualLayout为true时，设置JUSTIFY也无效。
		 * @member egret.gui.VerticalLayout#verticalAlign
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
         * 布局元素之间的垂直空间（以像素为单位）
		 * @member egret.gui.VerticalLayout#gap
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
		 * @member egret.gui.VerticalLayout#padding
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
		 * @member egret.gui.VerticalLayout#paddingLeft
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
		 * @member egret.gui.VerticalLayout#paddingRight
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
		 * @member egret.gui.VerticalLayout#paddingTop
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
		 * @member egret.gui.VerticalLayout#paddingBottom
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
            var numElements:number = this.target.numElements;
            var typicalHeight:number = this.typicalLayoutRect?this.typicalLayoutRect.height:22;
            var typicalWidth:number = this.typicalLayoutRect?this.typicalLayoutRect.width:71;
            var measuredWidth:number = Math.max(this.maxElementWidth,typicalWidth);
            var measuredHeight:number = this.getElementTotalSize();

            var visibleIndices:Array<number> = this.target.getElementIndicesInView();
            var length:number = visibleIndices.length;
            for(var i:number=0;i<length;i++){
                var index:number = visibleIndices[i];
                var layoutElement:ILayoutElement = <ILayoutElement> (this.target.getElementAt(index));
                if (layoutElement == null||!layoutElement.includeInLayout)
                    continue;

                var preferredWidth:number = layoutElement.preferredWidth;
                var preferredHeight:number = layoutElement.preferredHeight;
                measuredHeight += preferredHeight;
                measuredHeight -= isNaN(this.elementSizeTable[index])?typicalHeight:this.elementSizeTable[index];
                measuredWidth = Math.max(measuredWidth,preferredWidth);
            }
            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
            var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
            var hPadding:number = paddingL + paddingR;
            var vPadding:number = paddingT + paddingB;
            this.target.measuredWidth = Math.ceil(measuredWidth+hPadding);
            this.target.measuredHeight = Math.ceil(measuredHeight+vPadding);
        }

        /**
         * 测量使用真实布局的尺寸
         */
        private measureReal():void{
            var count:number = this.target.numElements;
            var numElements:number = count;
            var measuredWidth:number = 0;
            var measuredHeight:number = 0;
            for (var i:number = 0; i < count; i++){
                var layoutElement:ILayoutElement = <ILayoutElement> (this.target.getElementAt(i));
                if (!layoutElement||!layoutElement.includeInLayout){
                    numElements--;
                    continue;
                }
                var preferredWidth:number = layoutElement.preferredWidth;
                var preferredHeight:number = layoutElement.preferredHeight;
                measuredHeight += preferredHeight;
                measuredWidth = Math.max(measuredWidth,preferredWidth);
            }
            var gap:number = isNaN(this._gap)?0:this._gap;
            measuredHeight += (numElements-1)*gap;
            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
            var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
            var hPadding:number = paddingL + paddingR;
            var vPadding:number = paddingT + paddingB;
            this.target.measuredWidth = Math.ceil(measuredWidth+hPadding);
            this.target.measuredHeight = Math.ceil(measuredHeight+vPadding);
        }

        /**
         * 调整目标的元素的大小并定位这些元素
		 * @param width {number}
		 * @param height {number} 
         */
        public updateDisplayList(width:number, height:number):void{
            super.updateDisplayList(width, height);
            if(!this.target)
                return;

            if (this.target.numElements == 0)
            {
                var padding:number = isNaN(this._padding)?0:this._padding;
                var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
                var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
                var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
                var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
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
        private elementSizeTable:Array<any> = [];

        /**
         * 获取指定索引的起始位置
         */
        private getStartPosition(index:number):number{
            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
            var gap:number = isNaN(this._gap)?0:this._gap;
            if(!this.useVirtualLayout){
                var element:IVisualElement;
                if(this.target){
                    element =  this.target.getElementAt(index);
                }
                return element?element.y:paddingT;
            }
            var typicalHeight:number = this.typicalLayoutRect?this.typicalLayoutRect.height:22;
            var startPos:number = paddingT;
            for(var i:number = 0;i<index;i++){
                var eltHeight:number = this.elementSizeTable[i];
                if(isNaN(eltHeight)){
                    eltHeight = typicalHeight;
                }
                startPos += eltHeight+gap;
            }
            return startPos;
        }

        /**
         * 获取指定索引的元素尺寸
         */
        private getElementSize(index:number):number{
            if(this.useVirtualLayout){
                var size:number = this.elementSizeTable[index];
                if(isNaN(size)){
                    size = this.typicalLayoutRect?this.typicalLayoutRect.height:22;
                }
                return size;
            }
            if(this.target){
                return this.target.getElementAt(index).height;
            }
            return 0;
        }

        /**
         * 获取缓存的子对象尺寸总和
         */
        private getElementTotalSize():number{
            var gap:number = isNaN(this._gap)?0:this._gap;
            var typicalHeight:number = this.typicalLayoutRect?this.typicalLayoutRect.height:22;
            var totalSize:number = 0;
            var length:number = this.target.numElements;
            for(var i:number = 0; i<length; i++){
                var eltHeight:number = this.elementSizeTable[i];
                if(isNaN(eltHeight)){
                    eltHeight = typicalHeight;
                }
                totalSize += eltHeight+gap;
            }
            totalSize -= gap;
            return totalSize;
        }

        /**
		 * @param index {number}
         */
        public elementAdded(index:number):void{
            super.elementAdded(index);
            var typicalHeight:number = this.typicalLayoutRect?this.typicalLayoutRect.height:22;
            this.elementSizeTable.splice(index,0,typicalHeight);
        }

        /**
		 * @param index {number}
         */
        public elementRemoved(index:number):void{
            super.elementRemoved(index);
            this.elementSizeTable.splice(index,1);
        }

        /**
         * 如果 useVirtualLayout 为 true，则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息
         */
        public clearVirtualLayoutCache():void{
            super.clearVirtualLayoutCache();
            this.elementSizeTable = [];
            this.maxElementWidth = 0;
        }



        /**
         * 折半查找法寻找指定位置的显示对象索引
         */
        private findIndexAt(y:number, i0:number, i1:number):number{
            var index:number = Math.floor((i0 + i1) * 0.5);
            var elementY:number = this.getStartPosition(index);
            var elementHeight:number = this.getElementSize(index);
            var gap:number = isNaN(this._gap)?0:this._gap;
            if ((y >= elementY) && (y < elementY + elementHeight + gap))
                return index;
            else if (i0 == i1)
                return -1;
            else if (y < elementY)
                return this.findIndexAt(y, i0, Math.max(i0, index-1));
            else
                return this.findIndexAt(y, Math.min(index+1, i1), i1);
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

            if(isNaN(this.target.width)||this.target.width==0||isNaN(this.target.height)||this.target.height==0){
                this.startIndex = this.endIndex = -1;
                return false;
            }
            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
            var numElements:number = this.target.numElements;
            var contentHeight:number = this.getStartPosition(numElements-1)+
                this.elementSizeTable[numElements-1]+paddingB;
            var minVisibleY:number = this.target.verticalScrollPosition;
            if(minVisibleY>contentHeight-paddingB){
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var maxVisibleY:number = this.target.verticalScrollPosition + this.target.height;
            if(maxVisibleY<paddingT){
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var oldStartIndex:number = this.startIndex;
            var oldEndIndex:number = this.endIndex;
            this.startIndex = this.findIndexAt(minVisibleY,0,numElements-1);
            if(this.startIndex==-1)
                this.startIndex = 0;
            this.endIndex = this.findIndexAt(maxVisibleY,0,numElements-1);
            if(this.endIndex == -1)
                this.endIndex = numElements-1;
            return oldStartIndex!=this.startIndex||oldEndIndex!=this.endIndex;
        }

        /**
         * 子对象最大宽度
         */
        private maxElementWidth:number = 0;

        /**
         * 更新使用虚拟布局的显示列表
         */
        private updateDisplayListVirtual(width:number,height:number):void{
            if(this.indexInViewCalculated)
                this.indexInViewCalculated = false;
            else
                this.getIndexInView();
            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
            var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
            var gap:number = isNaN(this._gap)?0:this._gap;
            var contentHeight:number;
            var numElements:number = this.target.numElements;
            if(this.startIndex == -1||this.endIndex==-1){
                contentHeight = this.getStartPosition(numElements)-gap+paddingB;
                this.target.setContentSize(this.target.contentWidth,Math.ceil(contentHeight));
                return;
            }
            this.target.setVirtualElementIndicesInView(this.startIndex,this.endIndex);
            //获取水平布局参数
            var justify:boolean = this._horizontalAlign==HorizontalAlign.JUSTIFY||this._horizontalAlign==HorizontalAlign.CONTENT_JUSTIFY;
            var contentJustify:boolean = this._horizontalAlign==HorizontalAlign.CONTENT_JUSTIFY;
            var hAlign:number = 0;
            if(!justify){
                if(this._horizontalAlign==HorizontalAlign.CENTER){
                    hAlign = 0.5;
                }
                else if(this._horizontalAlign==HorizontalAlign.RIGHT){
                    hAlign = 1;
                }
            }

            var targetWidth:number = Math.max(0, width - paddingL - paddingR);
            var justifyWidth:number = Math.ceil(targetWidth);
            var layoutElement:ILayoutElement;
            var typicalHeight:number = this.typicalLayoutRect?this.typicalLayoutRect.height:22;
            var typicalWidth:number = this.typicalLayoutRect?this.typicalLayoutRect.width:71;
            var oldMaxW:number = Math.max(typicalWidth,this.maxElementWidth);
            if(contentJustify){
                for(var index:number=this.startIndex;index<=this.endIndex;index++){
                    layoutElement = <ILayoutElement> (this.target.getVirtualElementAt(index));
                    if (!layoutElement||!layoutElement.includeInLayout)
                        continue;
                    this.maxElementWidth = Math.max(this.maxElementWidth,layoutElement.preferredWidth);
                }
                justifyWidth = Math.ceil(Math.max(targetWidth,this.maxElementWidth));
            }
            var x:number = 0;
            var y:number = 0;
            var contentWidth:number = 0;
            var oldElementSize:number;
            var needInvalidateSize:boolean = false;
            //对可见区域进行布局
            for(var i:number=this.startIndex;i<=this.endIndex;i++){
                var exceesWidth:number = 0;
                layoutElement = <ILayoutElement> (this.target.getVirtualElementAt(i));
                if (!layoutElement){
                    continue;
                }
                else if(!layoutElement.includeInLayout){
                    this.elementSizeTable[i] = 0;
                    continue;
                }
                if(justify){
                    x = paddingL;
                    layoutElement.setLayoutBoundsSize(justifyWidth,NaN);
                }
                else{
                    exceesWidth = (targetWidth - layoutElement.layoutBoundsWidth)*hAlign;
                    exceesWidth = exceesWidth>0?exceesWidth:0;
                    x = paddingL+exceesWidth;
                }
                if(!contentJustify)
                    this.maxElementWidth = Math.max(this.maxElementWidth,layoutElement.preferredWidth);
                contentWidth = Math.max(contentWidth,layoutElement.layoutBoundsWidth);
                if(!needInvalidateSize){
                    oldElementSize = isNaN(this.elementSizeTable[i])?typicalHeight:this.elementSizeTable[i];
                    if(oldElementSize!=layoutElement.layoutBoundsHeight)
                        needInvalidateSize = true;
                }
                if(i==0&&this.elementSizeTable.length>0&&this.elementSizeTable[i]!=layoutElement.layoutBoundsHeight)
                    this.typicalLayoutRect = null;
                this.elementSizeTable[i] = layoutElement.layoutBoundsHeight;
                y = this.getStartPosition(i);
                layoutElement.setLayoutBoundsPosition(Math.round(x),Math.round(y));
            }
            contentWidth += paddingL+paddingR;
            contentHeight = this.getStartPosition(numElements)-gap+paddingB;
            this.target.setContentSize(Math.ceil(contentWidth),Math.ceil(contentHeight));
            if(needInvalidateSize||oldMaxW<this.maxElementWidth){
                this.target.invalidateSize();
            }
        }




        /**
         * 更新使用真实布局的显示列表
         */
        private updateDisplayListReal(width:number,height:number):void{
            var padding:number = isNaN(this._padding)?0:this._padding;
            var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
            var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
            var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
            var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
            var gap:number = isNaN(this._gap)?0:this._gap;
            var targetWidth:number = Math.max(0, width - paddingL - paddingR);
            var targetHeight:number = Math.max(0, height - paddingT - paddingB);
            // 获取水平布局参数
            var vJustify:boolean = this._verticalAlign==VerticalAlign.JUSTIFY;
            var hJustify:boolean = this._horizontalAlign==HorizontalAlign.JUSTIFY||this._horizontalAlign==HorizontalAlign.CONTENT_JUSTIFY;
            var hAlign:number = 0;
            if(!hJustify){
                if(this._horizontalAlign==HorizontalAlign.CENTER){
                    hAlign = 0.5;
                }
                else if(this._horizontalAlign==HorizontalAlign.RIGHT){
                    hAlign = 1;
                }
            }

            var count:number = this.target.numElements;
            var numElements:number = count;
            var x:number = paddingL;
            var y:number = paddingT;
            var i:number;
            var layoutElement:ILayoutElement;

            var totalPreferredHeight:number = 0;
            var totalPercentHeight:number = 0;
            var childInfoArray:Array<any> = [];
            var childInfo:ChildInfo;
            var heightToDistribute:number = targetHeight;
            for (i = 0; i < count; i++){
                layoutElement = <ILayoutElement> (this.target.getElementAt(i));
                if (!layoutElement||!layoutElement.includeInLayout){
                    numElements--;
                    continue;
                }
                this.maxElementWidth = Math.max(this.maxElementWidth,layoutElement.preferredWidth);
                if(vJustify){
                    totalPreferredHeight += layoutElement.preferredHeight;
                }
                else{
                    if(!isNaN(layoutElement.percentHeight)){
                        totalPercentHeight += layoutElement.percentHeight;

                        childInfo = new ChildInfo();
                        childInfo.layoutElement = layoutElement;
                        childInfo.percent    = layoutElement.percentHeight;
                        childInfo.min        = layoutElement.minHeight
                        childInfo.max        = layoutElement.maxHeight;
                        childInfoArray.push(childInfo);
                    }
                    else{
                        heightToDistribute -= layoutElement.preferredHeight;
                    }
                }

            }

            heightToDistribute -= (numElements-1)*gap;
            heightToDistribute = heightToDistribute>0?heightToDistribute:0;
            var excessSpace:number = targetHeight - totalPreferredHeight - gap * (numElements - 1);

            var averageHeight:number;
            var largeChildrenCount:number = numElements;
            var heightDic:Array<any> = [];
            if(vJustify){
                if(excessSpace<0){
                    averageHeight = heightToDistribute / numElements;
                    for (i = 0; i < count; i++){
                        layoutElement = this.target.getElementAt(i);
                        if (!layoutElement || !layoutElement.includeInLayout)
                            continue;

                        var preferredHeight:number = layoutElement.preferredHeight;
                        if (preferredHeight <= averageHeight){
                            heightToDistribute -= preferredHeight;
                            largeChildrenCount--;
                            continue;
                        }
                    }
                    heightToDistribute = heightToDistribute>0?heightToDistribute:0;
                }
            }
            else{
                if(totalPercentHeight>0){
                    VerticalLayout.flexChildrenProportionally(targetHeight,heightToDistribute,
                        totalPercentHeight,childInfoArray);
                    var roundOff:number = 0;
                    var length:number = childInfoArray.length;
                    for(i=0;i<length;i++){
                        childInfo = childInfoArray[i];
                        var childSize:number = Math.round(childInfo.size + roundOff);
                        roundOff += childInfo.size - childSize;

                        heightDic[childInfo.layoutElement.hashCode] = childSize;
                        heightToDistribute -= childSize;
                    }
                    heightToDistribute = heightToDistribute>0?heightToDistribute:0;
                }
            }

            if(this._verticalAlign==VerticalAlign.MIDDLE){
                y = paddingT+heightToDistribute*0.5;
            }
            else if(this._verticalAlign==VerticalAlign.BOTTOM){
                y = paddingT+heightToDistribute;
            }

            //开始对所有元素布局
            var maxX:number = paddingL;
            var maxY:number = paddingT;
            var dx:number = 0;
            var dy:number = 0;
            var justifyWidth:number = Math.ceil(targetWidth);
            if(this._horizontalAlign==HorizontalAlign.CONTENT_JUSTIFY)
                justifyWidth = Math.ceil(Math.max(targetWidth,this.maxElementWidth));
            roundOff = 0;
            var layoutElementHeight:number = NaN;
            var childHeight:number;
            for (i = 0; i < count; i++){
                var exceesWidth:number = 0;
                layoutElement = <ILayoutElement> (this.target.getElementAt(i));
                if (!layoutElement||!layoutElement.includeInLayout)
                    continue;
                layoutElementHeight = NaN;
                if(vJustify){
                    childHeight = NaN;
                    if(excessSpace>0){
                        childHeight = heightToDistribute * layoutElement.preferredHeight / totalPreferredHeight;
                    }
                    else if(excessSpace<0&&layoutElement.preferredHeight>averageHeight){
                        childHeight = heightToDistribute / largeChildrenCount
                    }
                    if(!isNaN(childHeight)){
                        layoutElementHeight = Math.round(childHeight + roundOff);
                        roundOff += childHeight - layoutElementHeight;
                    }
                }
                else{
                    layoutElementHeight = heightDic[layoutElement.hashCode];
                }
                if(hJustify){
                    x = paddingL;
                    layoutElement.setLayoutBoundsSize(justifyWidth,layoutElementHeight);
                }
                else{
                    var layoutElementWidth:number = NaN;
                    if(!isNaN(layoutElement.percentWidth)){
                        var percent:number = Math.min(100,layoutElement.percentWidth);
                        layoutElementWidth = Math.round(targetWidth*percent*0.01);
                    }
                    layoutElement.setLayoutBoundsSize(layoutElementWidth,layoutElementHeight);
                    exceesWidth = (targetWidth - layoutElement.layoutBoundsWidth)*hAlign;
                    exceesWidth = exceesWidth>0?exceesWidth:0;
                    x = paddingL+exceesWidth;
                }
                layoutElement.setLayoutBoundsPosition(Math.round(x),Math.round(y));
                dx = Math.ceil(layoutElement.layoutBoundsWidth);
                dy = Math.ceil(layoutElement.layoutBoundsHeight);
                maxX = Math.max(maxX,x+dx);
                maxY = Math.max(maxY,y+dy);
                y += dy+gap;
            }
            this.target.setContentSize(Math.ceil(maxX+paddingR),Math.ceil(maxY+paddingB));
        }

        /**
         * 为每个可变尺寸的子项分配空白区域
		 * @method egret.gui.VerticalLayout.flexChildrenProportionally
		 * @param spaceForChildren {number} 
		 * @param spaceToDistribute {number} 
		 * @param totalPercent {number} 
		 * @param childInfoArray {Array<any>} 
         */
        public static flexChildrenProportionally(spaceForChildren:number,spaceToDistribute:number,
                                                 totalPercent:number,childInfoArray:Array<any>):void{

            var numChildren:number = childInfoArray.length;
            var done:boolean;

            do{
                done = true;

                var unused:number = spaceToDistribute -
                    (spaceForChildren * totalPercent / 100);
                if (unused > 0)
                    spaceToDistribute -= unused;
                else
                    unused = 0;

                var spacePerPercent:number = spaceToDistribute / totalPercent;

                for (var i:number = 0; i < numChildren; i++){
                    var childInfo:ChildInfo = childInfoArray[i];

                    var size:number = childInfo.percent * spacePerPercent;

                    if (size < childInfo.min){
                        var min:number = childInfo.min;
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
                        var max:number = childInfo.max;
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