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

module eui {

    /**
     * @language en_US
     * The Button component is a commonly used rectangular button.
     * The Button component looks like it can be pressed.
     * The default skin has a text label and a icon display object.
     * @state up Button up state
     * @state down Button down state
     * @state disabled Button disabled state
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/ButtonExample.ts
     */
    /**
     * @language zh_CN
     * Button 组件是常用的矩形按钮。Button 组件看起来可以按压。默认外观具有一个文本标签和图标显示对象。
     * @state up 按钮弹起状态
     * @state down 按钮按下状态
     * @state disabled 按钮禁用状态
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/ButtonExample.ts
     */
    export class Button extends Component {
        /**
         * @language en_US
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个按钮实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.touchChildren = false;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        }

        /**
         * @language en_US
         * [SkinPart] A skin part that defines the label of the button.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [SkinPart] 按钮上的文本标签。
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public labelDisplay:IDisplayText = null;

        /**
         * @private
         */
        private _label:string = "";
        /**
         * @language en_US
         * Text to appear on the Button control.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要在按钮上显示的文本。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get label():string {
            return this._label;
        }

        public set label(value:string) {
            this._label = value;
            if (this.labelDisplay) {
                this.labelDisplay.text = value;
            }
        }

        /**
         * @language en_US
         * [SkinPart] A skin part that defines an optional icon for the button.
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [SkinPart] 按钮上的图标显示对象。
         * @skinPart
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public iconDisplay:Image = null;

        /**
         * @private
         */
        private _icon:string|egret.Texture = null;
        /**
         * @language en_US
         * Icon to appear on the Button control.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要在按钮上显示的图标数据
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get icon():string|egret.Texture {
            return this._icon;
        }

        public set icon(value:string|egret.Texture) {
            this._icon = value;
            if (this.iconDisplay) {
                this.iconDisplay.source = value;
            }
        }

        /**
         * @private
         * 指示第一次分派 TouchEvent.TOUCH_BEGIN 时，触摸点是否在按钮上。
         */
        private touchCaptured:boolean = false;

        /**
         * @language en_US
         * This method handles the touch events
         * @param  The <code>egret.TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 触碰事件处理。
         * @param event 事件 <code>egret.TouchEvent</code> 的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onTouchBegin(event:egret.TouchEvent):void {
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = true;
            this.invalidateState();
            event.updateAfterEvent();
        }

        /**
         * @private
         * 舞台上触摸弹起事件
         */
        private onStageTouchEnd(event:egret.Event):void {
            var stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            if (this.contains(event.target)){
                this.buttonReleased();
            }
            this.touchCaptured = false;
            this.invalidateState();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected getCurrentState():string {
            if (!this.enabled)
                return "disabled";

            if (this.touchCaptured)
                return "down";

            return "up";
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected partAdded(partName:string, instance:any):void {
            if (instance === this.labelDisplay) {
                this.labelDisplay.text = this._label;
            }
            else if (instance == this.iconDisplay) {
                this.iconDisplay.source = this._icon;
            }
        }

        /**
         * @language en_US
         * This method is called when handling a <code>egret.TouchEvent.TOUCH_END</code> event
         * when the user touches on the button. It is only called when the button
         * is the target and when <code>touchCaptured</code> is <code>true</code>.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当在用户单击按钮之后处理 <code>egret.TouchEvent.TOUCH_END</code> 事件时，将调用此方法。
         * 仅当以按钮为目标，并且 <code>touchCaptured</code> 为 <code>true</code> 时，才会调用此方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected buttonReleased():void {
        }
    }

}