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
     * The Skin class defines the base class for all skins.
     * You typically don't need to manually create the instance of this class.
     * It can be created by resolving a EXML.<p/>
     *
     * @example You typically write the skin classes in EXML, as the followiong example shows:<p/>
     * <pre>
     *      <?xml version="1.0" encoding="utf-8"?>
     *      <s:Skin xmlns:s="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
     *          <states>
     *              <!-- Specify the states controlled by this skin. -->
     *          </states>
     *          <!-- Define skin. -->
     *      </s:Skin>
     * </pre>
     *
     * @defaultProperty elementsContent
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/SkinExample.ts
     */
    /**
     * @language zh_CN
     * 皮肤基类。通常情况下，您不需要手动创建这个类的实例，而是通过解析EXML文件后自动生成。<p/>
     *
     * @example 通常您可以按照如下方式写EXML代码：<p/>
     * <pre>
     *      <?xml version="1.0" encoding="utf-8"?>
     *      <s:Skin xmlns:s="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
     *          <states>
     *              <!-- Specify the states controlled by this skin. -->
     *          </states>
     *          <!-- Define skin. -->
     *      </s:Skin>
     * </pre>
     *
     * @defaultProperty elementsContent
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/SkinExample.ts
     */
    export class Skin extends egret.EventDispatcher {

        /**
         * @language en_US
         * The list of skin parts name
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 皮肤部件名称列表
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public skinParts:string[];

        /**
         * @language en_US
         * The maximum recommended width of the component to be considered.
         * This property can only affect measure result of host component.
         *
         * @default 100000
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 皮肤的最大宽度。仅影响主机组件的测量结果。
         *
         * @default 100000
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxWidth:number = 100000;
        /**
         * @language en_US
         * The minimum recommended width of the component to be considered.
         * This property can only affect measure result of host component.
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 皮肤的最小宽度,此属性设置为大于maxWidth的值时无效。仅影响主机组件的测量结果。
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minWidth:number = 0;
        /**
         * @language en_US
         * The maximum recommended height of the component to be considered.
         * This property can only affect measure result of host component.
         *
         * @default 100000
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 皮肤的最大高度。仅影响主机组件的测量结果。
         *
         * @default 100000
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxHeight:number = 100000;
        /**
         * @language en_US
         * The minimum recommended height of the component to be considered.
         * This property can only affect measure result of host component.
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 皮肤的最小高度,此属性设置为大于maxHeight的值时无效。仅影响主机组件的测量结果。
         *
         * @default 0
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minHeight:number = 0;
        /**
         * @language en_US
         * Number that specifies the explicit width of the skin.
         * This property can only affect measure result of host component.
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 皮肤显式设置宽度,设置为 NaN 表示不显式设置。仅影响主机组件的测量结果。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public width:number = NaN;
        /**
         * @language en_US
         * Number that specifies the explicit height of the skin.
         * This property can only affect measure result of host component.
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 皮肤显式设置高度,设置为 NaN 表示不显式设置。仅影响主机组件的测量结果。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public height:number = NaN;

        /**
         * @private
         */
        $elementsContent:egret.DisplayObject[] = [];

        public set elementsContent(value:egret.DisplayObject[]) {
            this.$elementsContent = value;
        }


        /**
         * @private
         */
        private _hostComponent:Component = null;
        /**
         * @language en_US
         * The host component which the skin will be attached.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 此皮肤附加到的主机组件
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get hostComponent():Component {
            return this._hostComponent;
        }

        public set hostComponent(value:Component) {
            if (this._hostComponent == value)
                return;
            if(this._hostComponent){
                this._hostComponent.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddedToStage,this);
            }
            this._hostComponent = value;
            var values = this.$stateValues;
            values.parent = value;
            if (value) {
                this.commitCurrentState();
                if (!this.$stateValues.intialized) {
                    if (value.$stage) {
                        this.initializeStates(value.$stage);
                    }
                    else{
                        value.once(egret.Event.ADDED_TO_STAGE,this.onAddedToStage,this);
                    }
                }
            }
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "hostComponent");
        }

        /**
         * @private
         * 
         * @param event 
         */
        private onAddedToStage(event?:egret.Event):void{
            this.initializeStates(this._hostComponent.$stage);
        }


        /**
         * @private
         */
        $stateValues:sys.StateValues = new sys.StateValues();

        /**
         * @language en_US
         * The list of state for host component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 为此组件定义的视图状态。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public states:State[];

        /**
         * @language en_US
         * The current state of host component.
         * Set to <code>""</code> or <code>null</code> to reset the component back to its base state.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 组件的当前视图状态。将其设置为 "" 或 null 可将组件重置回其基本状态。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public currentState:string;

        /**
         * @language en_US
         * Check if contains the specifies state name.
         * @param stateName the state name need to be checked
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回是否含有指定名称的视图状态
         * @param stateName 要检查的视图状态名称
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public hasState:(stateName:string)=>boolean;

        /**
         * @private
         * 初始化所有视图状态
         */
        private initializeStates:(stage:egret.Stage)=>void;

        /**
         * @private
         * 应用当前的视图状态。子类覆盖此方法在视图状态发生改变时执行相应更新操作。
         */
        private commitCurrentState:()=>void;
    }

    sys.mixin(Skin, sys.StateClient);
    registerProperty(Skin, "elementsContent", "Array", true);
    registerProperty(Skin, "states", "State[]");
    registerBindable(Skin.prototype, "hostComponent");
}