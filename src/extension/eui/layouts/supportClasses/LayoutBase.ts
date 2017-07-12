//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

namespace eui {

    /**
     * The LayoutBase class defines the base class for all Spark layouts.
     * To create a custom layout that works with the Spark containers,
     * you must extend <code>LayoutBase</code> or one of its subclasses.
     *
     * <p>Subclasses must implement the <code>updateDisplayList()</code>
     * method, which positions and sizes the <code>target</code> GroupBase's elements, and
     * the <code>measure()</code> method, which calculates the default
     * size of the <code>target</code>.</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 容器布局基类。若要创建使用 Group 容器的自定义布局，必须扩展 <code>LayoutBase</code> 或其子类之一。
     *
     * <p>子类必须实现 <code>updateDisplayList()</code> 方法
     * （定位 <code>target</code> Group 的子项并调整这些子项的大小）和 <code>measure()</code> 方法
     * （计算 <code>target</code> 的默认大小）。</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    export class LayoutBase extends egret.EventDispatcher {

        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            super();
        }

        /**
         * @private
         */
        $target:Group = null;

        /**
         * The Group container whose elements are measured, sized and positioned
         * by this layout.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 此布局将测量其元素、调整其元素的大小并定位其元素的 Group 容器。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get target():Group {
            return this.$target;
        }

        public set target(value:Group) {
            if (this.$target === value)
                return;
            this.$target = value;
            this.clearVirtualLayoutCache();
        }


        /**
         * @private
         */
        $useVirtualLayout:boolean = false;

        /**
         * To configure a container to use virtual layout, set the <code>useVirtualLayout</code> property
         * to <code>true</code> for the layout associated with the container.
         * Only DataGroup with layout set to VerticalLayout,
         * HorizontalLayout, or TileLayout supports virtual layout.
         * Layout subclasses that do not support virtualization must prevent changing
         * this property.
         *
         * @default false
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 若要配置容器使用虚拟布局，请为与容器关联的布局的 <code>useVirtualLayout</code> 属性设置为 <code>true</code>。
         * 只有布局设置为 VerticalLayout、HorizontalLayout 或 TileLayout 的 DataGroup 才支持虚拟布局。
         * 不支持虚拟化的布局子类必须禁止更改此属性。
         *
         * @default false
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public get useVirtualLayout():boolean {
            return this.$useVirtualLayout;
        }

        public set useVirtualLayout(value:boolean) {
            value = !!value;
            if (this.$useVirtualLayout == value)
                return;

            this.$useVirtualLayout = value;
            this.dispatchEventWith("useVirtualLayoutChanged");

            if (this.$useVirtualLayout && !value)
                this.clearVirtualLayoutCache();
            if (this.target)
                this.target.invalidateDisplayList();
        }

        /**
         * @private
         */
        $typicalWidth:number = 71;
        /**
         * @private
         */
        $typicalHeight:number = 22;

        /**
         * Set this size of a typical element
         *
         * @param width the height of element
         * @param height the width of element
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置一个典型元素的大小
         *
         * @param width 元素的宽
         * @param height 元素的高
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public setTypicalSize(width:number, height:number):void {
            width = +width || 71;
            height = +height || 22;
            if (width !== this.$typicalWidth || height !== this.$typicalHeight) {
                this.$typicalWidth = width;
                this.$typicalHeight = height;
                if (this.$target) {
                    this.$target.invalidateSize();
                }
            }
        }

        /**
         * Called when the <code>verticalScrollPosition</code> or
         * <code>horizontalScrollPosition</code> properties change.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * <code>verticalScrollPosition</code> 或 <code>horizontalScrollPosition</code>
         * 属性更改时调用。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public scrollPositionChanged():void {
        }

        /**
         * When <code>useVirtualLayout</code> is <code>true</code>,
         * this method can be used by the layout target
         * to clear cached layout information when the target changes.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 如果 <code>useVirtualLayout</code> 为 <code>true</code>，
         * 则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public clearVirtualLayoutCache():void {
        }

        /**
         * Called by the target after a layout element
         * has been added and before the target's size and display list are
         * validated.
         * Layouts that cache per element state, like virtual layouts, can
         * override this method to update their cache.
         *
         * @param index The index of the element that was added.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在已添加布局元素之后且在验证目标的大小和显示列表之前，由目标调用。
         * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
         *
         * @param index 发生改变的子项索引
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public elementAdded(index:number):void {
        }

        /**
         * This method must is called by the target after a layout element
         * has been removed and before the target's size and display list are
         * validated.
         * Layouts that cache per element state, like virtual layouts, can
         * override this method to update their cache.
         *
         * @param index The index of the element that was added.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         *
         * 必须在已删除布局元素之后且在验证目标的大小和显示列表之前，由目标调用此方法。
         * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
         *
         * @param index 发生改变的子项索引
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public elementRemoved(index:number):void {
        }

        /**
         * Return the indices of the element visible within this Group.
         *
         * @return The indices of the visible element.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回此 Group 中可见的元素的索引。
         *
         * @return 可见的元素的索引。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public getElementIndicesInView():number[]{
            return null;
        }

        /**
         * Measures the target's default size based on its content.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 基于目标的内容测量其默认大小
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public measure():void {
        }

        /**
         * Sizes and positions the target's elements.
         *
         * @param unscaledWidth Specifies the width of the target, in pixels,
         * in the targets's coordinates.
         *
         * @param unscaledHeight Specifies the height of the component, in pixels,
         * in the target's coordinates.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 调整目标的元素的大小并定位这些元素。
         *
         * @param unscaledWidth 指定目标在目标坐标中的宽度（以像素为单位）。
         * @param unscaledHeight 指定组件在目标坐标中的高度（以像素为单位）。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public updateDisplayList(width:number, height:number):void {
        }
    }

}