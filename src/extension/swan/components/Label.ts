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

module swan {

    var UIImpl = sys.UIComponentImpl;
    /**
     * @language en_US
     * Label is an UIComponent that can render one or more lines of text.
     * The text to be displayed is determined by the <code>text</code> property.
     * The formatting of the text is specified by the styles，
     * such as <code>fontFamily</code> and <code>fontSize</code>.
     *
     * <p>Because Label is fast and lightweight, it is especially suitable
     * for use cases that involve rendering many small pieces of non-interactive
     * text, such as item renderers and labels in Button skins.</p>
     *
     * <p>In Label, three character sequences are recognized
     * as explicit line breaks: CR (<code>"\r"</code>), LF (<code>"\n"</code>),
     * and CR+LF (<code>"\r\n"</code>).</p>
     *
     * <p>If you don't specify any kind of width for a Label,
     * then the longest line, as determined by these explicit line breaks,
     * determines the width of the Label.</p>
     *
     * <p>If you do specify some kind of width, then the specified text is
     * word-wrapped at the right edge of the component's bounds.
     * If the text extends below the bottom of the component,
     * it is clipped.</p>
     *
     * @version Egret 2.4
     * @version Swan 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/extension/swan/components/LabelExample.ts
     */
    /**
     * @language zh_CN
     * Label 是可以呈示一行或多行统一格式文本的UI组件。要显示的文本由 text 属性确定。文本格式由样式属性指定，例如 fontFamily 和 fontSize。
     * 因为 Label 运行速度快且占用内存少，所以它特别适合用于显示多个小型非交互式文本的情况，例如，项呈示器和 Button 外观中的标签。
     * 在 Label 中，将以下三个字符序列识别为显式换行符：CR（“\r”）、LF（“\n”）和 CR+LF（“\r\n”）。
     * 如果没有为 Label 指定宽度，则由这些显式换行符确定的最长行确定 Label 的宽度。
     * 如果指定了宽度，则指定文本将在组件边界的右边缘换行，如果文本扩展到低于组件底部，则将被剪切。
     *
     * @version Egret 2.4
     * @version Swan 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/extension/swan/components/LabelExample.ts
     */
    export class Label extends egret.TextField implements UIComponent,IDisplayText {

        /**
         * @language en_US
         * Constructor.
         *
         * @param text The text displayed by this text component.
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @param text 此文本组件所显示的文本。
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public constructor(text?:string) {
            /*//IF LARK
            super(text);
            this.initializeUIValues();
            //END IF*/
            //IF EGRET
            super();
            this.initializeUIValues();
            this.text = text;
             //END IF*/
        }

        /**
         * @private
         *
         */
        $invalidateContentBounds():void {
            super.$invalidateContentBounds();
            this.invalidateSize();
        }

        /**
         * @private
         *
         * @param value
         */
        $setWidth(value:number):void {
            super.$setWidth(value);
            UIImpl.prototype.$setWidth.call(this, value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setHeight(value:number):void {
            super.$setHeight(value);
            UIImpl.prototype.$setHeight.call(this, value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setText(value:string):void {
            super.$setText(value);
            PropertyEvent.emitPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "text");
        }

        /**
         * @private
         */
        private _widthConstraint:number = NaN;


        //=======================UIComponent接口实现===========================
        /**
         * @private
         * UIComponentImpl 定义的所有变量请不要添加任何初始值，必须统一在此处初始化。
         */
        private initializeUIValues:()=>void;

        /**
         * @copy swan.UIComponent#createChildren
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected createChildren():void {

        }

        /**
         * @copy swan.UIComponent#childrenCreated
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected childrenCreated():void {

        }

        /**
         * @copy swan.UIComponent#commitProperties
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {

        }

        /**
         * @copy swan.UIComponent#measure
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected measure():void {
            var values = this.$UIComponent;
            var textValues = this.$TextField;
            var oldWidth = textValues[egret.sys.TextKeys.textFieldWidth];
            var availableWidth = NaN;
            if (!isNaN(this._widthConstraint)) {
                availableWidth = this._widthConstraint;
                this._widthConstraint = NaN;
            }
            else if (!isNaN(values[sys.UIKeys.explicitWidth])) {
                availableWidth = values[sys.UIKeys.explicitWidth];
            }
            else if (values[sys.UIKeys.maxWidth] != 100000) {
                availableWidth = values[sys.UIKeys.maxWidth];
            }

            super.$setWidth(availableWidth);
            this.setMeasuredSize(this.textWidth, this.textHeight);
            super.$setWidth(oldWidth);
        }

        /**
         * @copy swan.UIComponent#updateDisplayList
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.$setWidth(unscaledWidth);
            super.$setHeight(unscaledHeight);
        }

        /**
         * @copy swan.UIComponent#invalidateParentLayout
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        protected invalidateParentLayout():void {
        }

        /**
         * @private
         */
        $UIComponent:Object;

        /**
         * @private
         */
        $includeInLayout:boolean;

        /**
         * @copy swan.UIComponent#includeInLayout
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public includeInLayout:boolean;
        /**
         * @copy swan.UIComponent#left
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public left:number;

        /**
         * @copy swan.UIComponent#right
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public right:number;

        /**
         * @copy swan.UIComponent#top
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public top:number;

        /**
         * @copy swan.UIComponent#bottom
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public bottom:number;

        /**
         * @copy swan.UIComponent#horizontalCenter
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public horizontalCenter:number;

        /**
         * @copy swan.UIComponent#verticalCenter
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public verticalCenter:number;

        /**
         * @copy swan.UIComponent#percentWidth
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public percentWidth:number;

        /**
         * @copy swan.UIComponent#percentHeight
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public percentHeight:number;

        /**
         * @copy swan.UIComponent#explicitWidth
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public explicitWidth:number;

        /**
         * @copy swan.UIComponent#explicitHeight
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public explicitHeight:number;


        /**
         * @copy swan.UIComponent#minWidth
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public minWidth:number;
        /**
         * @copy swan.UIComponent#maxWidth
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public maxWidth:number;

        /**
         * @copy swan.UIComponent#minHeight
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public minHeight:number;
        /**
         * @copy swan.UIComponent#maxHeight
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public maxHeight:number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public setMeasuredSize(width:number, height:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public invalidateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public invalidateSize():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateSize(recursive?:boolean):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public invalidateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public validateNow():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsSize(layoutWidth:number, layoutHeight:number):void {
            UIImpl.prototype.setLayoutBoundsSize.call(this, layoutWidth, layoutHeight);
            if (isNaN(layoutWidth) || layoutWidth === this._widthConstraint || layoutWidth == 0) {
                return;
            }
            var values = this.$UIComponent;
            if (!isNaN(values[sys.UIKeys.explicitHeight])) {
                return;
            }
            if (layoutWidth == values[sys.UIKeys.measuredWidth]) {
                return;
            }
            this._widthConstraint = layoutWidth;
            this.invalidateSize();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsPosition(x:number, y:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public getLayoutBounds(bounds:egret.Rectangle):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version Swan 1.0
         * @platform Web,Native
         */
        public getPreferredBounds(bounds:egret.Rectangle):void {
        }
    }

    sys.implementUIComponent(Label, egret.TextField);
    registerBindable(Label.prototype, "text");
}