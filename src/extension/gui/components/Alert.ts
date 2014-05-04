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

/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="../core/IDisplayText.ts"/>
/// <reference path="../events/CloseEvent.ts"/>
/// <reference path="../managers/PopUpManager.ts"/>

module ns_egret {

	export class Alert extends TitleWindow{
		/**
		 * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为firstButton。
		 */		
		public static FIRST_BUTTON:string = "firstButton";
		/**
		 * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为secondButton。
		 */		
		public static SECOND_BUTTON:string = "secondButton";
		/**
		 * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为closeButton。
		 */		
		public static CLOSE_BUTTON:string = "closeButton";
		
		/**
		 * 弹出Alert控件的静态方法。在Alert控件中选择一个按钮，将关闭该控件。
		 * @param text 要显示的文本内容字符串。
		 * @param title 对话框标题
		 * @param closeHandler 按下Alert控件上的任意按钮时的回调函数。示例:closeHandler(event:CloseEvent);
		 * event的detail属性包含 Alert.FIRST_BUTTON、Alert.SECOND_BUTTON和Alert.CLOSE_BUTTON。
		 * @param firstButtonLabel 第一个按钮上显示的文本。
		 * @param secondButtonLabel 第二个按钮上显示的文本，若为null，则不显示第二个按钮。
		 * @param modal 是否启用模态。即禁用弹出框以下的鼠标事件。默认true。
		 * @param center 是否居中。默认true。
		 * @return 弹出的对话框实例的引用
		 */		
		public static show(text:string="",title:string="",closeHandler:Function=null,
									firstButtonLabel:string="确定",secondButtonLabel:string="",
									modal:boolean=true,center:boolean=true):Alert{
			var alert:Alert = new Alert();
			alert.contentText = text;
			alert.title = title;
			alert._firstButtonLabel = firstButtonLabel;
			alert._secondButtonLabel = secondButtonLabel;
			alert.closeHandler = closeHandler;
			PopUpManager.addPopUp(alert,modal,center);
			return alert;
		}
		/**
		 * 构造函数，请通过静态方法Alert.show()来创建对象实例。
		 */		
		public constructor(){
			super();
		}
		/**
		 * @inheritDoc
		 */
		public get hostComponentKey():any{
			return Alert;
		}
		private _firstButtonLabel:string = "";
		/**
		 * 第一个按钮上显示的文本
		 */
		public get firstButtonLabel():string{
			return this._firstButtonLabel;
		}
		public set firstButtonLabel(value:string){
			if(this._firstButtonLabel==value)
				return;
			this._firstButtonLabel = value;
			if(this.firstButton)
				this.firstButton.label = value;
		}

		private _secondButtonLabel:string = "";
		/**
		 * 第二个按钮上显示的文本
		 */
		public get secondButtonLabel():string{
			return this._secondButtonLabel;
		}
		public set secondButtonLabel(value:string){
			if(this._secondButtonLabel==value)
				return;
			this._secondButtonLabel = value;
			if(this.secondButton){
				if(value==null||value=="")
					this.secondButton.includeInLayout = this.secondButton.visible
						= (this._secondButtonLabel!=""&&this._secondButtonLabel!=null);
			}
		}

		
		private _contentText:string = "";
		/**
		 * 文本内容
		 */
		public get contentText():string{
			return this._contentText;
		}
		public set contentText(value:string){
			if(this._contentText==value)
				return;
			this._contentText = value;
			if(this.contentDisplay)
				this.contentDisplay.text = value;
		}
		/**
		 * 对话框关闭回调函数
		 */
		private closeHandler:Function;
		/**
		 * 关闭事件
		 */		
		private onClose(event:TouchEvent):void{
			PopUpManager.removePopUp(this);
			if(this.closeHandler!=null){
				var closeEvent:CloseEvent = new CloseEvent(CloseEvent.CLOSE);
				switch(event.currentTarget){
					case this.firstButton:
						closeEvent.detail = Alert.FIRST_BUTTON;
						break;
					case this.secondButton:
						closeEvent.detail = Alert.SECOND_BUTTON;
						break;
				}
				this.closeHandler(closeEvent);
			}
		}
		/**
		 * @inheritDoc
		 */
		public closeButton_clickHandler(event:TouchEvent):void{
			super.closeButton_clickHandler(event);
			PopUpManager.removePopUp(this);
			var closeEvent:CloseEvent = new CloseEvent(CloseEvent.CLOSE,false,false,Alert.CLOSE_BUTTON);
			if(this.closeHandler!=null)
				this.closeHandler(closeEvent);
		}
		
		/**
		 * [SkinPart]文本内容显示对象
		 */		
		public contentDisplay:IDisplayText;
		/**
		 * [SkinPart]第一个按钮，通常是"确定"。
		 */		
		public firstButton:Button;
		/**
		 * [SkinPart]第二个按钮，通常是"取消"。
		 */		
		public secondButton:Button;
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName,instance);
			if(instance==this.contentDisplay){
				this.contentDisplay.text = this._contentText;
			}
			else if(instance==this.firstButton){
				this.firstButton.label = this._firstButtonLabel;
				this.firstButton.addEventListener(TouchEvent.TOUCH_TAP,this.onClose,this);
			}
			else if(instance==this.secondButton){
				this.secondButton.label = this._secondButtonLabel;
				this.secondButton.includeInLayout = this.secondButton.visible
					= (this._secondButtonLabel!=""&&this._secondButtonLabel!=null);
				this.secondButton.addEventListener(TouchEvent.TOUCH_TAP,this.onClose,this);
			}
		}
		/**
		 * @inheritDoc
		 */		
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName,instance);
			if(instance==this.firstButton){
				this.firstButton.removeEventListener(TouchEvent.TOUCH_TAP,this.onClose,this);
			}
			else if(instance==this.secondButton){
				this.secondButton.removeEventListener(TouchEvent.TOUCH_TAP,this.onClose,this);
			}
		}
	}
}