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

/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/core/Injector.ts"/>
/// <reference path="../core/IToolTip.ts"/>
/// <reference path="impl/ToolTipManagerImpl.ts"/>

module ns_egret {

	export class ToolTipManager{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}

		private static _impl:IToolTipManager;
		
		/**
		 * 获取单例
		 */
		private static get impl():IToolTipManager{
			if (!ToolTipManager._impl){
				try{
                    ToolTipManager._impl = Injector.getInstance(IToolTipManager);
				}
				catch(e:Error){
                    ToolTipManager._impl = new ToolTipManagerImpl();
				}
			}
			return this._impl;
		}
		
		/**
		 * 当前的IToolTipManagerClient组件
		 */			
		public static get currentTarget():IToolTipManagerClient{
			return this.impl.currentTarget;
		}
		
		public static set currentTarget(value:IToolTipManagerClient):void{
			this.impl.currentTarget = value;
		}
		
		/**
		 * 当前可见的ToolTip显示对象；如果未显示ToolTip，则为 null。
		 */		
		public static get currentToolTip():IToolTip{
			return this.impl.currentToolTip;
		}
		
		public static set currentToolTip(value:IToolTip):void{
			this.impl.currentToolTip = value;
		}
		
		/**
		 * 如果为 true，则当用户将鼠标指针移至组件上方时，ToolTipManager会自动显示工具提示。
		 * 如果为 false，则不会显示任何工具提示。
		 */		
		public static get enabled():boolean {
			return this.impl.enabled;
		}
		
		public static set enabled(value:boolean):void{
			this.impl.enabled = value;
		}
		
		/**
		 * 自工具提示出现时起，ToolTipManager要隐藏此提示前所需等待的时间量（以毫秒为单位）。默认值：10000。
		 */		
		public static get hideDelay():number {
			return this.impl.hideDelay;
		}
		
		public static set hideDelay(value:number):void{
			this.impl.hideDelay = value;
		}
		
		/**
		 * 当第一个ToolTip显示完毕后，若在此时间间隔内快速移动到下一个组件上，
		 * 就直接显示ToolTip而不延迟showDelay。默认值：100。
		 */		
		public static get scrubDelay():number {
			return this.impl.scrubDelay;
		}
		
		public static set scrubDelay(value:number):void{
			this.impl.scrubDelay = value;
		}
		
		/**
		 * 当用户将鼠标移至具有工具提示的组件上方时，等待 ToolTip框出现所需的时间（以毫秒为单位）。
		 * 若要立即显示ToolTip框，请将toolTipShowDelay设为0。默认值：200。
		 */			
		public static get showDelay():number {
			return this.impl.showDelay;
		}
		public static set showDelay(value:number):void{
			this.impl.showDelay = value;
		}

		/**
		 * 全局默认的创建工具提示要用到的类。
		 */		
		public static get toolTipClass():any {
			return this.impl.toolTipClass;
		}
		
		public static set toolTipClass(value:any):void{
			this.impl.toolTipClass = value;
		}

		/**
		 * 注册需要显示ToolTip的组件
		 * @param target 目标组件
		 * @param oldToolTip 之前的ToolTip数据
		 * @param newToolTip 现在的ToolTip数据
		 */		
		public static registerToolTip(target:DisplayObject,
										oldToolTip:any,
										newToolTip:any):void{
			this.impl.registerToolTip(target,oldToolTip,newToolTip);
		}
		
		/**
		 * 使用指定的ToolTip数据,创建默认的ToolTip类的实例，然后在舞台坐标中的指定位置显示此实例。
		 * 保存此方法返回的对 ToolTip 的引用，以便将其传递给destroyToolTip()方法销毁实例。
		 * @param toolTipData ToolTip数据
		 * @param x 舞台坐标x
		 * @param y 舞台坐标y
		 * @return 创建的ToolTip实例引用
		 */		
		public static createToolTip(toolTipData:string, x:number, y:number):IToolTip{
			return this.impl.createToolTip(toolTipData,x,y);
		}
		/**
		 * 销毁由createToolTip()方法创建的ToolTip实例。 
		 * @param toolTip 要销毁的ToolTip实例
		 */		
		public static destroyToolTip(toolTip:IToolTip):void{
			return this.impl.destroyToolTip(toolTip);
		}
	}
	
}
