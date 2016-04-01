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

    var UIImpl = sys.UIComponentImpl;
    /**
     * @language en_US
     * Label is an UIComponent that can render one or more lines of text.
     * The text to be displayed is determined by the <code>text</code> property.
     * The formatting of the text is specified by the styles，
     * such as <code>fontFamily</code> and <code>size</code>.
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
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/LabelExample.ts
     */
    /**
     * @language zh_CN
     * Label 是可以呈示一行或多行统一格式文本的UI组件。要显示的文本由 text 属性确定。文本格式由样式属性指定，例如 fontFamily 和 size。
     * 因为 Label 运行速度快且占用内存少，所以它特别适合用于显示多个小型非交互式文本的情况，例如，项呈示器和 Button 外观中的标签。
     * 在 Label 中，将以下三个字符序列识别为显式换行符：CR（“\r”）、LF（“\n”）和 CR+LF（“\r\n”）。
     * 如果没有为 Label 指定宽度，则由这些显式换行符确定的最长行确定 Label 的宽度。
     * 如果指定了宽度，则指定文本将在组件边界的右边缘换行，如果文本扩展到低于组件底部，则将被剪切。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/LabelExample.ts
     */
    export class Label extends egret.TextField implements UIComponent,IDisplayText {

        /**
         * @language en_US
         * Constructor.
         *
         * @param text The text displayed by this text component.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @param text 此文本组件所显示的文本。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(text?:string) {
            super();
            this.initializeUIValues();
            this.text = text;
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
        $setWidth(value:number):boolean {
            var result1:boolean = super.$setWidth(value);
            var result2:boolean = UIImpl.prototype.$setWidth.call(this, value);
            return result1 && result2;
        }

        /**
         * @private
         *
         * @param value
         */
        $setHeight(value:number):boolean {
            var result1:boolean = super.$setHeight(value);
            var result2:boolean = UIImpl.prototype.$setHeight.call(this, value);
            return result1 && result2;
        }

        /**
         * @private
         *
         * @param value
         */
        $setText(value:string):boolean {
            var result:boolean = super.$setText(value);
            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, "text");
            return result;
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
         * @copy eui.UIComponent#createChildren
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected createChildren():void {

        }

        /**
         * @copy eui.UIComponent#childrenCreated
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected childrenCreated():void {

        }

        /**
         * @copy eui.UIComponent#commitProperties
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {

        }

        /**
         * @copy eui.UIComponent#measure
         *
         * @version Egret 2.4
         * @version eui 1.0
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
         * @copy eui.UIComponent#updateDisplayList
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            super.$setWidth(unscaledWidth);
            super.$setHeight(unscaledHeight);
        }

        /**
         * @copy eui.UIComponent#invalidateParentLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
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
         * @copy eui.UIComponent#includeInLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public includeInLayout:boolean;
        /**
         * @copy eui.UIComponent#left
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public left:number;

        /**
         * @copy eui.UIComponent#right
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public right:number;

        /**
         * @copy eui.UIComponent#top
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public top:number;

        /**
         * @copy eui.UIComponent#bottom
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public bottom:number;

        /**
         * @copy eui.UIComponent#horizontalCenter
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public horizontalCenter:number;

        /**
         * @copy eui.UIComponent#verticalCenter
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public verticalCenter:number;

        /**
         * @copy eui.UIComponent#percentWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentWidth:number;

        /**
         * @copy eui.UIComponent#percentHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public percentHeight:number;

        /**
         * @copy eui.UIComponent#explicitWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitWidth:number;

        /**
         * @copy eui.UIComponent#explicitHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public explicitHeight:number;


        /**
         * @copy eui.UIComponent#minWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minWidth:number;
        /**
         * @copy eui.UIComponent#maxWidth
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxWidth:number;

        /**
         * @copy eui.UIComponent#minHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public minHeight:number;
        /**
         * @copy eui.UIComponent#maxHeight
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public maxHeight:number;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setMeasuredSize(width:number, height:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateProperties():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateSize():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateSize(recursive?:boolean):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateDisplayList():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public validateNow():void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
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
         * @version eui 1.0
         * @platform Web,Native
         */
        public setLayoutBoundsPosition(x:number, y:number):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getLayoutBounds(bounds:egret.Rectangle):void {
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getPreferredBounds(bounds:egret.Rectangle):void {
        }
    }

    sys.implementUIComponent(Label, egret.TextField);
    registerBindable(Label.prototype, "text");
}