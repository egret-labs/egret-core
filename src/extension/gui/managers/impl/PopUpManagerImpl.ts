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
     * @class egret.gui.PopUpManagerImpl
     * @classdesc
     * 窗口弹出管理器实现类
     * @extends egret.EventDispatcher
     * @implements egret.gui.IPopUpManager
     */
    export class PopUpManagerImpl extends EventDispatcher implements IPopUpManager{
        /**
         * 构造函数
         * @method egret.gui.PopUpManagerImpl#constructor
         */
        public constructor(){
            super();
        }

        private _popUpList:Array<any> = [];
        /**
         * 已经弹出的窗口列表
         * @member egret.gui.PopUpManagerImpl#popUpList
         */
        public get popUpList():Array<any>{
            return this._popUpList.concat();
        }
        /**
         * 模态窗口列表
         */
        private popUpDataList:Array<any> = [];
        /**
         * 根据popUp获取对应的popUpData
         */
        private findPopUpData(popUp:IVisualElement):PopUpData{
            var list:Array<any> = this.popUpDataList;
            var length:number = list.length;
            for(var i:number=0;i<length;i++){
                var data:PopUpData = list[i];
                if(data.popUp==popUp)
                    return data;
            }
            return null;
        }

        private static REMOVE_FROM_UISTAGE:string = "removeFromUIStage";
        /**
         * 弹出一个窗口。<br/>
         * @method egret.gui.PopUpManagerImpl#addPopUp
         * @param popUp {IVisualElement} 要弹出的窗口
         * @param modal {boolean} 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
         * @param center {boolean} 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
         */
        public addPopUp(popUp:IVisualElement,modal:boolean=false,center:boolean=true):void{
            var uiStage:IUIStage = UIGlobals.uiStage;
            var data:PopUpData = this.findPopUpData(popUp);
            if(data){
                data.modal = modal;
                popUp.removeEventListener(PopUpManagerImpl.REMOVE_FROM_UISTAGE,this.onRemoved,this);
            }
            else{
                data = new PopUpData(popUp,modal);
                this.popUpDataList.push(data);
                this._popUpList.push(popUp);
            }
            uiStage.popUpContainer.addElement(popUp);
            if(center)
                this.centerPopUp(popUp);
            if("isPopUp" in popUp)
                (<IUIComponent> popUp).isPopUp = true;
            if(modal){
                this.invalidateModal();
            }
            popUp.addEventListener(PopUpManagerImpl.REMOVE_FROM_UISTAGE,this.onRemoved,this);
        }

        /**
         * 从舞台移除
         */
        private onRemoved(event:Event):void{
            var index:number = 0;
            var list:Array<any> = this.popUpDataList;
            var length:number = list.length;
            for(var i:number=0;i<length;i++){
                var data:PopUpData = list[i];
                if(data.popUp==event.target){
                    if("isPopUp" in data.popUp)
                        (<IUIComponent> (data.popUp)).isPopUp = false;
                    data.popUp.removeEventListener(PopUpManagerImpl.REMOVE_FROM_UISTAGE,this.onRemoved,this);
                    this.popUpDataList.splice(index,1);
                    this._popUpList.splice(index,1);
                    this.invalidateModal();
                    break;
                }
                index++;
            }
        }


        private _modalColor:number = 0x000000;
        /**
         * 模态遮罩的填充颜色
         * @member egret.gui.PopUpManagerImpl#modalColor
         */
        public get modalColor():number{
            return this._modalColor;
        }
        public set modalColor(value:number){
            if(this._modalColor==value)
                return;
            this._modalColor = value;
            this.invalidateModal();
        }

        private _modalAlpha:number = 0.5;
        /**
         * 模态遮罩的透明度
         * @member egret.gui.PopUpManagerImpl#modalAlpha
         */
        public get modalAlpha():number{
            return this._modalAlpha;
        }
        public set modalAlpha(value:number){
            if(this._modalAlpha==value)
                return;
            this._modalAlpha = value;
            this.invalidateModal();
        }

        private invalidateModalFlag:boolean = false;
        /**
         * 标记一个UIStage的模态层失效
         */
        private invalidateModal():void{
            if(!this.invalidateModalFlag){
                this.invalidateModalFlag = true;
                UIGlobals.stage.addEventListener(Event.ENTER_FRAME,this.validateModal,this);
                UIGlobals.stage.addEventListener(Event.RENDER,this.validateModal,this);
                UIGlobals.stage.invalidate();
            }
        }

        private validateModal(event:Event):void{
            this.invalidateModalFlag = false;
            UIGlobals.stage.removeEventListener(Event.ENTER_FRAME,this.validateModal,this);
            UIGlobals.stage.removeEventListener(Event.RENDER,this.validateModal,this);
            this.updateModal(UIGlobals.uiStage);
        }

        private modalMask: Rect = null;
        /**
         * 更新窗口模态效果
         */
        private updateModal(uiStage:IUIStage):void{
            var popUpContainer:IContainer = uiStage.popUpContainer;
            var found:boolean = false;
            for(var i:number = popUpContainer.numElements-1;i>=0;i--){
                var element:IVisualElement = popUpContainer.getElementAt(i);
                var data:PopUpData = this.findPopUpData(element);
                if(data&&data.modal){
                    found = true;
                    break;
                }
            }
            if(found){
                if(!this.modalMask){
                    this.modalMask = new Rect();
                    this.modalMask.touchEnabled = true;
                    this.modalMask.top = this.modalMask.left = this.modalMask.right = this.modalMask.bottom = 0;
                }
                this.modalMask.fillColor = this._modalColor;
                this.modalMask.alpha = this._modalAlpha;
                if(this.modalMask.parent==(<DisplayObjectContainer><any>uiStage)){
                    if(popUpContainer.getElementIndex(this.modalMask)<i)
                        i--;
                    popUpContainer.setElementIndex(this.modalMask,i);
                }
                else{
                    popUpContainer.addElementAt(this.modalMask,i);
                }
            }
            else if(this.modalMask&&this.modalMask.parent==(<DisplayObjectContainer><any>uiStage)){
                popUpContainer.removeElement(this.modalMask);
            }
        }

        /**
         * 移除由addPopUp()方法弹出的窗口。
         * @method egret.gui.PopUpManagerImpl#removePopUp
         * @param popUp {IVisualElement} 要移除的窗口
         */
        public removePopUp(popUp:IVisualElement):void{
            if(popUp && popUp.parent&&this.findPopUpData(popUp)){
                if("removeElement" in popUp.parent)
                    (<IVisualElementContainer><any> (popUp.parent)).removeElement(popUp);
                else if(popUp.parent instanceof UIComponent)
                    (<UIComponent><any> (popUp.parent))._removeFromDisplayList(<DisplayObject><any> popUp);
                else if(popUp instanceof DisplayObject)
                    popUp.parent.removeChild(<DisplayObject><any>popUp);
            }
        }

        /**
         * 将指定窗口居中显示
         * @method egret.gui.PopUpManagerImpl#centerPopUp
         * @param popUp {IVisualElement} 要居中显示的窗口
         */
        public centerPopUp(popUp:IVisualElement):void{
            popUp.top = popUp.bottom = popUp.left = popUp.right = NaN;
            popUp.verticalCenter = popUp.horizontalCenter = 0;
            var parent:DisplayObjectContainer = popUp.parent;
            if(parent){
                if("validateNow" in popUp)
                    (<IInvalidating><any>popUp).validateNow();
                popUp.x = (parent.width-popUp.layoutBoundsWidth)*0.5;
                popUp.y = (parent.height-popUp.layoutBoundsHeight)*0.5;
            }
        }

        /**
         * 将指定窗口的层级调至最前
         * @method egret.gui.PopUpManagerImpl#bringToFront
         * @param popUp {IVisualElement} 要最前显示的窗口
         */
        public bringToFront(popUp:IVisualElement):void{
            var data:PopUpData = this.findPopUpData(popUp);
            if(data&&popUp.parent&&"popUpContainer" in popUp.parent){
                var uiStage:IUIStage = <IUIStage><any>(popUp.parent);
                uiStage.popUpContainer.setElementIndex(popUp,uiStage.popUpContainer.numElements-1);
                this.invalidateModal();
            }
        }
    }

    class PopUpData{
        /**
         * @method egret.PopUpData#constructor
         * @param popUp {IVisualElement}
         * @param modal {boolea}
         */
        public constructor(popUp:IVisualElement,modal:boolean){
            this.popUp = popUp;
            this.modal = modal;
        }

        /**
         * @member egret.PopUpData#popUp
         */
        public popUp: IVisualElement = null;

        /**
         * @member egret.PopUpData#modal
         */
        public modal:boolean = false;
    }
}