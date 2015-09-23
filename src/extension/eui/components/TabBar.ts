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
     * The TabBar class displays a set of identical tabs.
     * One tab can be selected at a time, and the first tab is selected by default.
     * <p>The set of tabs is defined by the <code>dataProvider</code> property.
     * The appearance of each tab is defined by the <code>ItemRenderer</code> class.</p>
     * <p>You can use the TabBar control to set the active child of a ViewStack container,
     * as the following example shows:</p>
     * <pre>
     *       <s:TabBar dataProvider="{viewStack}"/>
     *       <s:ViewStack id="viewStack">
     *          <s:Group name="tab1"/>
     *          <s:Group name="tab2"/>
     *          <s:Group name="tab3"/>
     *       </s:ViewStack>
     * </pre>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/TabBarExample.ts
     */
    /**
     * @language zh_CN
     * TabBar 类显示一组相同的选项卡。一次可以选择一个选项卡，且默认情况下选择第一个选项卡。
     * <p>该组选项卡由 <code>dataProvider</code> 属性定义。
     * 每个选项卡的外观由 <code>ItemRenderer</code> 定义。</p>
     * <p>可以使用 TabBar 控件设置 ViewStack 容器的活动子代，如下例所示：</p>
     * <pre>
     *       <s:TabBar dataProvider="{viewStack}"/>
     *       <s:ViewStack id="viewStack">
     *          <s:Group name="tab1"/>
     *          <s:Group name="tab2"/>
     *          <s:Group name="tab3"/>
     *       </s:ViewStack>
     * </pre>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/TabBarExample.ts
     */
    export class TabBar extends ListBase {

        /**
         * @language en_US
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(){
            super();
            this.requireSelection = true;
            this.useVirtualLayout = false;
        }

        /**
         * @inheritDoc
         * 
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected createChildren():void{
            if (!this.$layout) {
                var layout = new HorizontalLayout();
                layout.gap = 0;
                layout.horizontalAlign = JustifyAlign.JUSTIFY;
                layout.verticalAlign = JustifyAlign.CONTENT_JUSTIFY;
                this.$setLayout(layout);
            }
            super.createChildren();
        }

        /**
         * @private
         * 
         * @param value 
         */
        $setDataProvider(value:ICollection):boolean{
            var dp = this.$dataProvider;
            if(dp&&dp instanceof eui.ViewStack){
                dp.removeEventListener(PropertyEvent.PROPERTY_CHANGE,this.onViewStackIndexChange,this);
                this.removeEventListener(egret.Event.CHANGE,this.onIndexChanged,this);
            }

            if(value&&value instanceof eui.ViewStack){
                value.addEventListener(PropertyEvent.PROPERTY_CHANGE,this.onViewStackIndexChange,this);
                this.addEventListener(egret.Event.CHANGE,this.onIndexChanged,this);
            }
            return super.$setDataProvider(value);
        }

        /**
         * @private
         */
        private indexBeingUpdated:boolean = false;
        /**
         * @private
         * 触摸点击的选中项改变
         */
        private onIndexChanged(event:egret.Event):void{
            this.indexBeingUpdated = true;
            (<ViewStack><any> (this.$dataProvider)).selectedIndex = this.selectedIndex;
            this.indexBeingUpdated = false;
        }

        /**
         * @private
         * ViewStack选中项发生改变
         */
        private onViewStackIndexChange(event:PropertyEvent):void{
            if(event.property=="selectedIndex"&&!this.indexBeingUpdated){
                this.setSelectedIndex((<ViewStack><any> (this.$dataProvider)).selectedIndex, false);
            }
        }
    }

}