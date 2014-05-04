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

/// <reference path="../../../../egret/geom/Point.ts"/>
/// <reference path="../Scroller.ts"/>
/// <reference path="../../core/IViewport.ts"/>
/// <reference path="../../core/ScrollPolicy.ts"/>
/// <reference path="../../core/UIComponent.ts"/>
/// <reference path="../../layouts/supportClasses/LayoutBase.ts"/>

module ns_egret {

	export class ScrollerLayout extends LayoutBase{
		/**
		 * 构造函数
		 */		
		public constructor()    {
			super();
		}
		
		/**
		 * 开始显示滚动条的最小溢出值。例如：contentWidth >= viewport width + SDT时显示水平滚动条。
		 */		
		private static SDT:number = 1.0;
		
		/**
		 * 获取滚动条实例
		 */		
		private getScroller():Scroller{
			return  <Scroller> (this.target.parent);
		}
		
		/**
		 * 获取目标视域组件的视域尺寸
		 */		
		private getLayoutContentSize(viewport:IViewport):Point{
			var cw:number = viewport.contentWidth;
			var ch:number = viewport.contentHeight;
			if (((cw == 0) && (ch == 0)) || (isNaN(cw) || isNaN(ch)))
				return new Point(0,0);
			return new Point(cw, ch);
		}
		
		
		private hsbScaleX:number = 1;
		private hsbScaleY:number = 1;
		
		/**
		 * 水平滚动条是否可见
		 */		
		private get hsbVisible():boolean{
			var hsb:ScrollBarBase = this.getScroller().horizontalScrollBar;
			return hsb && hsb.visible;
		}
		
		private set hsbVisible(value:boolean){
			var hsb:ScrollBarBase = this.getScroller().horizontalScrollBar;
			if (!hsb)
				return;
			if(hsb.visible == value)
				return;
			hsb.visible = value;
			hsb._includeInLayout = value;
		}
		
		/**
		 * 返回考虑进水平滚动条后组件所需的最小高度
		 */		
		private hsbRequiredHeight():number {
			var scroller:Scroller = this.getScroller();
			var minViewportInset:number = scroller.minViewportInset;
			var hsb:ScrollBarBase = scroller.horizontalScrollBar;
			return Math.max(minViewportInset, hsb.preferredHeight);
		}
		
		/**
		 * 返回指定的尺寸下水平滚动条是否能够放下
		 */		
		private hsbFits(w:number, h:number, includeVSB:boolean=true):boolean{
			if (this.vsbVisible && includeVSB){
				var vsb:ScrollBarBase = this.getScroller().verticalScrollBar;            
				w -= vsb.preferredWidth;
				h -= vsb.minHeight;
			}
			var hsb:ScrollBarBase = this.getScroller().horizontalScrollBar;        
			return (w >= hsb.minWidth) && (h >= hsb.preferredHeight);
		}
		
		private vsbScaleX:number = 1;
		private vsbScaleY:number = 1;
		
		/**
		 * 垂直滚动条是否可见
		 */		
		private get vsbVisible():boolean{
			var vsb:ScrollBarBase = this.getScroller().verticalScrollBar;
			return vsb && vsb.visible;
		}
		
		private set vsbVisible(value:boolean){
			var vsb:ScrollBarBase = this.getScroller().verticalScrollBar;
			if (!vsb)
				return;
			if(vsb.visible == value)
				return;
			vsb.visible = value;
			vsb._includeInLayout = value;
		}
		
		/**
		 * 返回考虑进垂直滚动条后组件所需用的最小宽度
		 */		
		private vsbRequiredWidth():number {
			var scroller:Scroller = this.getScroller();
			var minViewportInset:number = scroller.minViewportInset;
			var vsb:ScrollBarBase = scroller.verticalScrollBar;
			return Math.max(minViewportInset, vsb.preferredWidth);
		}
		
		/**
		 * 返回在指定的尺寸下垂直滚动条是否能够放下
		 */		
		private vsbFits(w:number, h:number, includeHSB:boolean=true):boolean{
			if (this.hsbVisible && includeHSB){
				var hsb:ScrollBarBase = this.getScroller().horizontalScrollBar;            
				w -= hsb.minWidth;
				h -= hsb.preferredHeight;
			}
			var vsb:ScrollBarBase = this.getScroller().verticalScrollBar;  
			return (w >= vsb.preferredWidth) && (h >= vsb.minHeight);
		}
		
		/**
		 * @inheritDoc
		 */
		public measure():void{
			const scroller:Scroller = this.getScroller();
			if (!scroller) 
				return;
			
			const minViewportInset:number = scroller.minViewportInset;
			const measuredSizeIncludesScrollBars:boolean = scroller.measuredSizeIncludesScrollBars;
			
			var measuredW:number = minViewportInset;
			var measuredH:number = minViewportInset;
			
			const hsb:ScrollBarBase = scroller.horizontalScrollBar;
			var showHSB:boolean = false;
			var hAuto:boolean = false;
			if (measuredSizeIncludesScrollBars)
				switch(scroller.horizontalScrollPolicy) {
					case ScrollPolicy.ON: 
						if (hsb) showHSB = true; 
						break;
					case ScrollPolicy.AUTO: 
						if (hsb) showHSB = hsb.visible;
						hAuto = true;
						break;
				} 
			
			const vsb:ScrollBarBase = scroller.verticalScrollBar;
			var showVSB:boolean = false;
			var vAuto:boolean = false;
			if (measuredSizeIncludesScrollBars)
				switch(scroller.verticalScrollPolicy) {
					case ScrollPolicy.ON: 
						if (vsb) showVSB = true; 
						break;
					case ScrollPolicy.AUTO: 
						if (vsb) showVSB = vsb.visible;
						vAuto = true;
						break;
				}
			
			measuredH += (showHSB) ? this.hsbRequiredHeight() : minViewportInset;
			measuredW += (showVSB) ? this.vsbRequiredWidth() : minViewportInset;
			var viewport:IViewport = scroller.viewport;
			if (viewport){
				if (measuredSizeIncludesScrollBars){
					var viewportPreferredW:number =  viewport.preferredWidth;
					measuredW += Math.max(viewportPreferredW, (showHSB) ? hsb.minWidth : 0);
					
					var viewportPreferredH:number = viewport.preferredHeight;
					measuredH += Math.max(viewportPreferredH, (showVSB) ? vsb.minHeight : 0);
				}
				else{
					measuredW += viewport.preferredWidth;
					measuredH += viewport.preferredHeight;
				}
			}
			
			var minW:number = minViewportInset * 2;
			var minH:number = minViewportInset * 2;
			var viewportUIC:UIComponent = <UIComponent> viewport;
			var explicitViewportW:number = viewportUIC ? viewportUIC.explicitWidth : NaN;
			var explicitViewportH:number = viewportUIC ? viewportUIC.explicitHeight : NaN;
			
			if (!isNaN(explicitViewportW)) 
				minW += explicitViewportW;
			
			if (!isNaN(explicitViewportH)) 
				minH += explicitViewportH;
			
			var g:GroupBase = this.target;
			g.measuredWidth = Math.ceil(measuredW);
			g.measuredHeight = Math.ceil(measuredH);
		}
		
		/**
		 * 布局计数，防止发生无限循环。
		 */		
		private invalidationCount:number = 0;
		
//		Bug备注：
//		当viewport含有相对布局元素的子项(content尺寸跟随viewport尺寸而变，这是不规范的用法)，
//		且水平和垂直滚动条同时到达临界显示值时，会出现无限循环验证的情况。
//		(显示滚动条会导致content尺寸变小，继而导致关闭滚动条，content尺寸又变大，又开启滚动条...)
//		暂时没有根治的解决方案，只能通过计数检查的方式断开循环。
		
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(w:number, h:number):void{  
			var scroller:Scroller = this.getScroller();
			if (!scroller) 
				return;
			var viewport:IViewport = scroller.viewport;
			var hsb:ScrollBarBase = scroller.horizontalScrollBar;
			var vsb:ScrollBarBase = scroller.verticalScrollBar;
			var minViewportInset:number = scroller.minViewportInset;
			
			var contentW:number = 0;
			var contentH:number = 0;
			if (viewport){
				var contentSize:Point = this.getLayoutContentSize(viewport);
				contentW = contentSize.x;
				contentH = contentSize.y;
			}
			var viewportUIC:UIComponent = <UIComponent> viewport;
			var explicitViewportW:number = viewportUIC ? viewportUIC.explicitWidth : NaN;
			var explicitViewportH:number = viewportUIC ? viewportUIC.explicitHeight : NaN;
			
			var viewportW:number = isNaN(explicitViewportW) ? (w - (minViewportInset * 2)) : explicitViewportW;
			var viewportH:number = isNaN(explicitViewportH) ? (h - (minViewportInset * 2)) : explicitViewportH;
			var oldShowHSB:boolean = this.hsbVisible;
			var oldShowVSB:boolean = this.vsbVisible;
			
			var hAuto:boolean = false; 
			switch(scroller.horizontalScrollPolicy) {
				case ScrollPolicy.ON: 
					this.hsbVisible = true;
					break;
				
				case ScrollPolicy.AUTO: 
					if (hsb && viewport){
						hAuto = true;
						this.hsbVisible = (contentW >= (viewportW + ScrollerLayout.SDT));
					} 
					break;
				
				default:
					this.hsbVisible = false;
			} 
			
			var vAuto:boolean = false;
			switch(scroller.verticalScrollPolicy) {
				case ScrollPolicy.ON: 
					this.vsbVisible = true; 
					break;
				
				case ScrollPolicy.AUTO: 
					if (vsb && viewport){ 
						vAuto = true;
						this.vsbVisible = (contentH >= (viewportH + ScrollerLayout.SDT));
					}                        
					break;
				
				default:
					this.vsbVisible = false;
			}
			if (isNaN(explicitViewportW))
				viewportW = w - ((this.vsbVisible) ? (minViewportInset + this.vsbRequiredWidth()) : (minViewportInset * 2));
			else 
				viewportW = explicitViewportW;
			
			if (isNaN(explicitViewportH))
				viewportH = h - ((this.hsbVisible) ? (minViewportInset + this.hsbRequiredHeight()) : (minViewportInset * 2));
			else 
				viewportH = explicitViewportH;
			var hsbIsDependent:boolean = false;
			var vsbIsDependent:boolean = false;
			
			if (this.vsbVisible && !this.hsbVisible && hAuto && (contentW >= (viewportW + ScrollerLayout.SDT)))
				this.hsbVisible = hsbIsDependent = true;
			else if (!this.vsbVisible && this.hsbVisible && vAuto && (contentH >= (viewportH + ScrollerLayout.SDT)))
				this.vsbVisible = vsbIsDependent = true;
			if (this.hsbVisible && this.vsbVisible) {
				if (this.hsbFits(w, h) && this.vsbFits(w, h)){
					
				}
				else if (!this.hsbFits(w, h, false) && !this.vsbFits(w, h, false)){
					
					this.hsbVisible = false;
					this.vsbVisible = false;
				}
				else{
					if (hsbIsDependent){
						if (this.vsbFits(w, h, false))  
							this.hsbVisible = false;
						else 
							this.vsbVisible = this.hsbVisible = false;
						
					}
					else if (vsbIsDependent){
						if (this.hsbFits(w, h, false)) 
							this.vsbVisible = false;
						else
							this.hsbVisible = this.vsbVisible = false; 
					}
					else if (this.vsbFits(w, h, false)) 
						this.hsbVisible = false;
					else 
						this.vsbVisible = false;
				}
			}
			else if (this.hsbVisible && !this.hsbFits(w, h))  
				this.hsbVisible = false;
			else if (this.vsbVisible && !this.vsbFits(w, h))  
				this.vsbVisible = false;
			if (isNaN(explicitViewportW))
				viewportW = w - ((this.vsbVisible) ? (minViewportInset + this.vsbRequiredWidth()) : (minViewportInset * 2));
			else 
				viewportW = explicitViewportW;
			
			if (isNaN(explicitViewportH))
				viewportH = h - ((this.hsbVisible) ? (minViewportInset + this.hsbRequiredHeight()) : (minViewportInset * 2));
			else 
				viewportH = explicitViewportH;
			if (viewport){
				viewport.setLayoutBoundsSize(viewportW, viewportH);
				viewport.setLayoutBoundsPosition(minViewportInset, minViewportInset);
			}
			
			if (this.hsbVisible){
				var hsbW:number = (this.vsbVisible) ? w - vsb.preferredWidth : w;
				var hsbH:number = hsb.preferredHeight;
				hsb.setLayoutBoundsSize(Math.max(hsb.minWidth, hsbW), hsbH);
				hsb.setLayoutBoundsPosition(0, h - hsbH);
			}
			
			if (this.vsbVisible){
				var vsbW:number = vsb.preferredWidth; 
				var vsbH:number = (this.hsbVisible) ? h - hsb.preferredHeight : h;
				vsb.setLayoutBoundsSize(vsbW, Math.max(vsb.minHeight, vsbH));
				vsb.setLayoutBoundsPosition(w - vsbW, 0);
			}
			if ((this.invalidationCount < 2) && (((this.vsbVisible != oldShowVSB) && vAuto) || ((this.hsbVisible != oldShowHSB) && hAuto))){
				this.target.invalidateSize();
				var viewportGroup:GroupBase = <GroupBase> viewport;
				if (viewportGroup && viewportGroup.layout && viewportGroup.layout.useVirtualLayout)
					viewportGroup.invalidateSize();
				
				this.invalidationCount += 1; 
			}
			else
				this.invalidationCount = 0;
			
			this.target.setContentSize(w, h);
		}
		
	}
	
}
