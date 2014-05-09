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

/// <reference path="../../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/events/EventDispatcher.ts"/>
/// <reference path="../../core/IContainer.ts"/>
/// <reference path="../../core/IInvalidating.ts"/>
/// <reference path="../../core/IUIComponent.ts"/>
/// <reference path="../../core/IVisualElement.ts"/>
/// <reference path="../../core/IVisualElementContainer.ts"/>
/// <reference path="../../core/UIComponent.ts"/>
/// <reference path="../../core/UIGlobals.ts"/>
/// <reference path="../IPopUpManager.ts"/>
/// <reference path="../ISystemManager.ts"/>

module ns_egret {

    export class PopUpManagerImpl extends EventDispatcher implements IPopUpManager{
        /**
         * 构造函数
         */
        public constructor(){
            super();
        }

        private _popUpList:Array<any> = [];
        /**
         * 已经弹出的窗口列表
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

        private static REMOVE_FROM_SYSTEMMANAGER:string = "removeFromSystemManager";
        /**
         * 弹出一个窗口。<br/>
         * @param popUp 要弹出的窗口
         * @param modal 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
         * @param center 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
         */
        public addPopUp(popUp:IVisualElement,modal:boolean=false,center:boolean=true):void{
            var systemManager:ISystemManager = UIGlobals.systemManager;
            var data:PopUpData = this.findPopUpData(popUp);
            if(data){
                data.modal = modal;
                popUp.removeEventListener(PopUpManagerImpl.REMOVE_FROM_SYSTEMMANAGER,this.onRemoved,this);
            }
            else{
                data = new PopUpData(popUp,modal);
                this.popUpDataList.push(data);
                this._popUpList.push(popUp);
            }
            systemManager.popUpContainer.addElement(popUp);
            if(center)
                this.centerPopUp(popUp);
            if("isPopUp" in popUp)
                (<IUIComponent> popUp).isPopUp = true;
            if(modal){
                this.invalidateModal();
            }
            popUp.addEventListener(PopUpManagerImpl.REMOVE_FROM_SYSTEMMANAGER,this.onRemoved,this);
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
                    data.popUp.removeEventListener(PopUpManagerImpl.REMOVE_FROM_SYSTEMMANAGER,this.onRemoved,this);
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
         * 标记一个SystemManager的模态层失效
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
            this.updateModal(UIGlobals.systemManager);
        }

        private modalMask:UIComponent;
        /**
         * 更新窗口模态效果
         */
        private updateModal(systemManager:ISystemManager):void{
            var popUpContainer:IContainer = systemManager.popUpContainer;
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
                    this.modalMask = new UIComponent();
                    this.modalMask.touchEnabled = true;
                    this.modalMask.top = this.modalMask.left = this.modalMask.right = this.modalMask.bottom = 0;
                }
               // (<Rect> modalMask).fillColor = this._modalColor;
                this.modalMask.alpha = this._modalAlpha;
                if(this.modalMask.parent==(<DisplayObjectContainer><any>systemManager)){
                    if(popUpContainer.getElementIndex(this.modalMask)<i)
                        i--;
                    popUpContainer.setElementIndex(this.modalMask,i);
                }
                else{
                    popUpContainer.addElementAt(this.modalMask,i);
                }
            }
            else if(this.modalMask&&this.modalMask.parent==(<DisplayObjectContainer><any>systemManager)){
                popUpContainer.removeElement(this.modalMask);
            }
        }

        /**
         * 移除由addPopUp()方法弹出的窗口。
         * @param popUp 要移除的窗口
         */
        public removePopUp(popUp:IVisualElement):void{
            if(popUp && popUp.parent&&this.findPopUpData(popUp)){
                if("removeElement" in popUp.parent)
                (<IVisualElementContainer><any> (popUp.parent)).removeElement(popUp);
            else if(popUp instanceof DisplayObject)
                    popUp.parent.removeChild(<DisplayObject><any>popUp);
            }
        }

        /**
         * 将指定窗口居中显示
         * @param popUp 要居中显示的窗口
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
         * @param popUp 要最前显示的窗口
         */
        public bringToFront(popUp:IVisualElement):void{
            var data:PopUpData = this.findPopUpData(popUp);
            if(data&&popUp.parent&&"popUpContainer" in popUp.parent){
                var sm:ISystemManager = <ISystemManager><any>(popUp.parent);
                sm.popUpContainer.setElementIndex(popUp,sm.popUpContainer.numElements-1);
                this.invalidateModal();
            }
        }
    }

    class PopUpData{
        public constructor(popUp:IVisualElement,modal:boolean){
            this.popUp = popUp;
            this.modal = modal;
        }

        public popUp:IVisualElement;

        public modal:boolean;
    }
}