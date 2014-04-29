/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="supportClasses/TextBase.ts"/>
/// <reference path="../events/UIEvent.ts"/>

module ns_egret {

	export class Label extends TextBase{
		public constructor(){
			super();
			this.addEventListener(UIEvent.UPDATE_COMPLETE, this.updateCompleteHandler, this);
		}

		/**
		 * 一个验证阶段完成
		 */		
		private updateCompleteHandler(event:UIEvent):void{
			this.lastUnscaledWidth = NaN;
		}
		
		private _maxDisplayedLines:number = 0;
		/**
		 * 最大显示行数,0或负值代表不限制。
		 */
		public get maxDisplayedLines():number{
			return this._maxDisplayedLines;
		}

		public set maxDisplayedLines(value:number){
			if(this._maxDisplayedLines==value)
				return;
			this._maxDisplayedLines = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}

		/**
		 * 上一次测量的宽度 
		 */		
		private lastUnscaledWidth:number = NaN;
		
		private _padding:number = 0;
		/**
		 * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
		 * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
		 */
		public get padding():number{
			return this._padding;
		}
		public set padding(value:number){
			if(this._padding==value)
				return;
			this._padding = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		private _paddingLeft:number = NaN;
		/**
		 * 文字距离左边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
		 */
		public get paddingLeft():number{
			return this._paddingLeft;
		}
		
		public set paddingLeft(value:number){
			if (this._paddingLeft == value)
				return;
			
			this._paddingLeft = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}    
		
		private _paddingRight:number = NaN;
		/**
		 * 文字距离右边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
		 */
		public get paddingRight():number{
			return this._paddingRight;
		}
		
		public set paddingRight(value:number){
			if (this._paddingRight == value)
				return;
			
			this._paddingRight = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}    
		
		private _paddingTop:number = NaN;
		/**
		 * 文字距离顶部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
		 */
		public get paddingTop():number{
			return this._paddingTop;
		}
		
		public set paddingTop(value:number){
			if (this._paddingTop == value)
				return;
			
			this._paddingTop = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}    
		
		private _paddingBottom:number = NaN;
		/**
		 * 文字距离底部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
		 */
		public get paddingBottom():number{
			return this._paddingBottom;
		}
		
		public set paddingBottom(value:number){
			if (this._paddingBottom == value)
				return;
			
			this._paddingBottom = value;
			this.invalidateSize();
			this.invalidateDisplayList();
		}    
		
		/**
		 * @inheritDoc
		 */
		public measure():void{
			//先提交属性，防止样式发生改变导致的测量不准确问题。
			if(this.invalidatePropertiesFlag)
				this.validateProperties();
			if (this.isSpecialCase()){
				if (isNaN(this.lastUnscaledWidth)){
					this.oldPreferWidth = NaN;
					this.oldPreferHeight = NaN;
				}
				else{
					this.measureUsingWidth(this.lastUnscaledWidth);
					return;
				}
			}
			
			var availableWidth:number;
			
			if (!isNaN(this.explicitWidth))
				availableWidth = this.explicitWidth;
			else if (this.maxWidth!=10000)
				availableWidth = this.maxWidth;
			
			this.measureUsingWidth(availableWidth);
		}
		
		/**
		 * 特殊情况，组件尺寸由父级决定，要等到父级UpdateDisplayList的阶段才能测量
		 */		
		private isSpecialCase():boolean{
			return this._maxDisplayedLines!=1&&
				(!isNaN(this.percentWidth) || (!isNaN(this.left) && !isNaN(this.right))) &&
				isNaN(this.explicitHeight) &&
				isNaN(this.percentHeight);
		}
		
		/**
		 * 使用指定的宽度进行测量
		 */	
		private measureUsingWidth(w:number):void{
			var originalText:string = this._textField.text;
			if(this.textChanged){
				this._textField.text = this._text;
			}
			
			var padding:number = isNaN(this._padding)?0:this._padding;
			var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;

            this._textField.width = NaN;
            this._textField.height = NaN;
			if (!isNaN(w)){
				this._textField.width = w - paddingL - paddingR;
				this.measuredWidth = Math.ceil(this._textField.measuredWidth);
				this.measuredHeight = Math.ceil(this._textField.measuredHeight);
			}
			else{
				this.measuredWidth = Math.ceil(this._textField.measuredWidth);
				this.measuredHeight = Math.ceil(this._textField.measuredHeight);
			}
			
			if(this._maxDisplayedLines>0&&this._textField.numLines>this._maxDisplayedLines){
                var size:number = this._textField.size;
                var lineSpacing:number = this._textField.lineSpacing;
				this.measuredHeight = (size+lineSpacing)*this._maxDisplayedLines-lineSpacing;
			}
			
			this.measuredWidth += paddingL + paddingR;
			this.measuredHeight += paddingT + paddingB;
			
			this._textField.text = originalText;
		}
		
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number,unscaledHeight:number):void{
			this.$updateDisplayList(unscaledWidth,unscaledHeight);
			
			var padding:number = isNaN(this._padding)?0:this._padding;
			var paddingL:number = isNaN(this._paddingLeft)?padding:this._paddingLeft;
			var paddingR:number = isNaN(this._paddingRight)?padding:this._paddingRight;
			var paddingT:number = isNaN(this._paddingTop)?padding:this._paddingTop;
			var paddingB:number = isNaN(this._paddingBottom)?padding:this._paddingBottom;
			
			this._textField.x = paddingL;
			this._textField.y = paddingT;
			if (this.isSpecialCase()){
				var firstTime:boolean = isNaN(this.lastUnscaledWidth) ||
					this.lastUnscaledWidth != unscaledWidth;
				this.lastUnscaledWidth = unscaledWidth;
				if (firstTime){
					this.oldPreferWidth = NaN;
					this.oldPreferHeight = NaN;
					this.invalidateSize();
					return;
				}
			}
			//防止在父级validateDisplayList()阶段改变的text属性值，
			//接下来直接调用自身的updateDisplayList()而没有经过measure(),使用的测量尺寸是上一次的错误值。
			if(this.invalidateSizeFlag)
				this.validateSize();
			
			if(!this._textField.visible)//解决初始化时文本闪烁问题
				this._textField.visible = true;

			this._textField.width = unscaledWidth - paddingL - paddingR;
			var unscaledTextHeight:number = unscaledHeight - paddingT - paddingB;
			this._textField.height = unscaledTextHeight;
			
			if(this._maxDisplayedLines>0&&this._textField.numLines>this._maxDisplayedLines){
                var size:number = this._textField.size;
                var lineSpacing:number = this._textField.lineSpacing;
                var h:number = (size+lineSpacing)*this._maxDisplayedLines-lineSpacing;
				this._textField.height = Math.min(unscaledTextHeight,h);
			}
		}
	}
}