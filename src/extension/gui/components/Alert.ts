/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret.gui {

    /**
     * @class egret.gui.Alert
     * @classdesc
     * 弹出对话框，可能包含消息、标题、按钮（“确定”、“取消”、“是”和“否”的任意组合)。
     * @extends egret.gui.TitleWindow
     */
    export class Alert extends TitleWindow{
        /**
         * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为firstButton。
         * @constant egret.gui.Alert.FIRST_BUTTON
         */
        public static FIRST_BUTTON:string = "firstButton";
        /**
         * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为secondButton。
         * @constant egret.gui.Alert.SECOND_BUTTON
         */
        public static SECOND_BUTTON:string = "secondButton";
        /**
         * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为closeButton。
         * @constant egret.gui.Alert.CLOSE_BUTTON
         */
        public static CLOSE_BUTTON:string = "closeButton";

        /**
         * 弹出Alert控件的静态方法。在Alert控件中选择一个按钮，将关闭该控件。
         * @method egret.gui.Alert.show
         * @param text {string} 要显示的文本内容字符串。
         * @param title {string} 对话框标题
         * @param closeHandler {Function} 按下Alert控件上的任意按钮时的回调函数。示例:closeHandler(event:CloseEvent);
         * event的detail属性包含 Alert.FIRST_BUTTON、Alert.SECOND_BUTTON和Alert.CLOSE_BUTTON。
         * @param firstButtonLabel {string} 第一个按钮上显示的文本。
         * @param secondButtonLabel {string} 第二个按钮上显示的文本，若为null，则不显示第二个按钮。
         * @param modal {boolean} 是否启用模态。即禁用弹出框以下的鼠标事件。默认true。
         * @param center {boolean} 是否居中。默认true。
         * @param thisObject {any} 回掉函数绑定的this对象
         * @returns {Alert}
         */
        public static show(text:string="",title:string="",closeHandler:Function=null,
                                    firstButtonLabel:string="OK",secondButtonLabel:string="",
                                    modal:boolean=true,center:boolean=true,thisObject?:any):Alert{
            var alert:Alert = new Alert();
            alert.contentText = text;
            alert.title = title;
            alert._firstButtonLabel = firstButtonLabel;
            alert._secondButtonLabel = secondButtonLabel;
            alert.closeHandler = closeHandler;
            alert.thisObject = thisObject;
            PopUpManager.addPopUp(alert,modal,center);
            return alert;
        }
        /**
         * 构造函数，请通过静态方法Alert.show()来创建对象实例。
         * @method egret.gui.Alert#constructor
         */
        public constructor(){
            super();
        }

        private _firstButtonLabel:string = "";
        /**
         * 第一个按钮上显示的文本
         * @member egret.gui.Alert#firstButtonLabel
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

        /**
         *
         * @type {string}
         * @private
         */
        private _secondButtonLabel:string = "";
        /**
         * 第二个按钮上显示的文本
         * @member egret.gui.Alert#secondButtonLabel
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

        /**
         *
         * @type {string}
         * @private
         */
        private _contentText:string = "";
        /**
         * 文本内容
         * @member egret.gui.Alert#contentText
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
        private closeHandler: Function = null;

        /**
        * 对话框关闭回调函数对应的this对象
        */
        private thisObject: any;

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
                this.callCloseHandler(closeEvent);
            }
        }
        /**
         * @method egret.gui.Alert#closeButton_clickHandler
         * @param event {TouchEvent}
         */
        public closeButton_clickHandler(event:TouchEvent):void{
            super.closeButton_clickHandler(event);
            PopUpManager.removePopUp(this);
            var closeEvent:CloseEvent = new CloseEvent(CloseEvent.CLOSE,false,false,Alert.CLOSE_BUTTON);
            this.callCloseHandler(closeEvent);
        }

        private callCloseHandler(closeEvent: CloseEvent) {
            if (this.closeHandler == null)
                return;
            var target = this.thisObject || this;
            this.closeHandler.call(target, closeEvent);
        }

        /**
         * [SkinPart]文本内容显示对象
         * @member egret.gui.Alert#contentDisplay
         */
        public contentDisplay:IDisplayText = null;
        /**
         * [SkinPart]第一个按钮，通常是"确定"。
         * @member egret.gui.Alert#firstButton
         */
        public firstButton:Button = null;
        /**
         * [SkinPart]第二个按钮，通常是"取消"。
         * @member egret.gui.Alert#secondButton
         */
        public secondButton:Button = null;
        /**
         * 添加外观部件时调用
         * @method egret.gui.Alert#partAdded
         * @param partName {string}
         * @param instance {any}
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
         * 删除外观部件的实例时调用
         * @method egret.gui.Alert#partRemoved
         * @param partName {string}
         * @param instance {any}
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