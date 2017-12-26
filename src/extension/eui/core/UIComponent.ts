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

/// <reference path="Validator.ts" />

namespace eui {



    export function getAssets(source: string, callback: (content: any) => void) {
        let adapter: IAssetAdapter = egret.getImplementation("eui.IAssetAdapter");
        if (!adapter) {
            adapter = new DefaultAssetAdapter();
        }
        adapter.getAsset(source, content => {
            callback(content);
        }, this);
    }

    export function getTheme(source: string, callback: (content: any) => void) {

        let adapter: IThemeAdapter = egret.getImplementation("eui.IThemeAdapter");
        if (!adapter) {
            adapter = new DefaultThemeAdapter();
        }
        adapter.getTheme(source, (data) => {
            callback(data)
        }, (e) => { console.log(e) }, this);

    }

    /**
     * The UIComponent class is the base class for all visual components, both skinnable and nonskinnable.
     *
     * @event egret.Event.RESIZE Dispatch when the component is resized.
     * @event eui.UIEvent.MOVE Dispatch when the object has moved.
     * @event eui.UIEvent.CREATION_COMPLETE  Dispatch when the component has finished its construction,
     * property processing, measuring, layout, and drawing.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */

    /**
     * UIComponent 类是所有可视组件（可定制皮肤和不可定制皮肤）的基类。
     *
     * @event egret.Event.RESIZE 当UI组件的尺寸发生改变时调度
     * @event eui.UIEvent.MOVE 当UI组件在父级容器中的位置发生改变时调度
     * @event eui.UIEvent.CREATION_COMPLETE 当UI组件第一次被添加到舞台并完成初始化后调度
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */

    export interface UIComponent extends egret.DisplayObject {

        ///**
        // * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
        // * 请务必调用super.createChildren()以完成父类组件的初始化
        // */
        // protected createChildren():void{}

        ///**
        // * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
        // */
        // protected commitProperties():void{}

        ///**
        // * 测量组件尺寸
        // */
        // protected measure():void{}

        ///**
        // * 更新显示列表
        // */
        // protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{}

        ///**
        // * 标记父级容器的尺寸和显示列表为失效
        // */
        // protected invalidateParentLayout():void{}

        //$getWidth():number;
        //$setWidth(value:number):void;

        //$getHeight():number;
        //$setHeight(value:number):void;

        /**
         * @private
         */
        $UIComponent: Object;

        /**
         * @private
         */
        $includeInLayout: boolean;

        /**
         * Specifies whether this component is included in the layout of the
         * parent container.
         * If <code>false</code>, the object size and position are not affected by its parent container's
         * layout.
         * This value is different with <code>visible</code>. the object size and position is still affected by its parent
         * container's layout when the <code>visible</code> is false.
         * @default true
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定此组件是否包含在父容器的布局中。若为false，则父级容器在测量和布局阶段都忽略此组件。
         * 注意，visible属性与此属性不同，设置visible为false，父级容器仍会对其布局。
         *
         * @default true
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        includeInLayout: boolean;
        /**
         * The horizontal distance in pixels from the left edge of the component to the
         * anchor target's left edge.
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 距父级容器离左边距离。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        left: any;

        /**
         * The horizontal distance in pixels from the right edge of the component to the
         * anchor target's right edge.
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 距父级容器右边距离。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        right: any;

        /**
         * The vertical distance in pixels from the top edge of the component to the
         * anchor target's top edge.
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 距父级容器顶部距离。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        top: any;

        /**
         * The vertical distance in pixels from the bottom edge of the component to the
         * anchor target's bottom edge.
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 距父级容器底部距离。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        bottom: any;

        /**
         * The horizontal distance in pixels from the center of the component to the
         * center of the anchor target's content area.
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在父级容器中距水平中心位置的距离。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        horizontalCenter: any;

        /**
         * The vertical distance in pixels from the center of the component to the
         *  center of the anchor target's content area.
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在父级容器中距竖直中心位置的距离。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        verticalCenter: any;

        /**
         * Specifies the width of a component as a percentage
         * of its parent's size. Allowed values are 0-100.
         * Setting the <code>width</code> or <code>explicitWidth</code> properties
         * resets this property to NaN.
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 相对父级容器宽度的百分比。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        percentWidth: number;

        /**
         * Specifies the height of a component as a percentage
         * of its parent's size. Allowed values are 0-100.
         * Setting the <code>height</code> or <code>explicitHeight</code> properties
         * resets this property to NaN.
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 相对父级容器高度的百分比。
         *
         * @default NaN
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        percentHeight: number;

        /**
         * Number that specifies the explicit width of the component,
         * in pixels, in the component's coordinates.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 外部显式指定的宽度。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        explicitWidth: number;

        /**
         * Number that specifies the explicit height of the component,
         * in pixels, in the component's coordinates.
         * @readOnly
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 外部显式指定的高度。
         * @readOnly
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        explicitHeight: number;

        /**
         * The minimum recommended width of the component to be considered
         * by the parent during layout. This value is in the
         * component's coordinates, in pixels. The default value depends on
         * the component's implementation.
         * @readOnly
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 组件的最小宽度,此属性设置为大于maxWidth的值时无效。同时影响测量和自动布局的尺寸。
         * @readOnly
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        minWidth: number;
        /**
         * The maximum recommended width of the component to be considered
         * by the parent during layout. This value is in the
         * component's coordinates, in pixels. The default value of this property is
         * set by the component developer.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 组件的最大高度。同时影响测量和自动布局的尺寸。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        maxWidth: number;

        /**
         * The minimum recommended height of the component to be considered
         * by the parent during layout. This value is in the
         * component's coordinates, in pixels. The default value depends on
         * the component's implementation.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 组件的最小高度,此属性设置为大于maxHeight的值时无效。同时影响测量和自动布局的尺寸。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        minHeight: number;

        /**
         * The maximum recommended height of the component to be considered
         * by the parent during layout. This value is in the
         * component's coordinates, in pixels. The default value of this property is
         * set by the component developer.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 组件的最大高度,同时影响测量和自动布局的尺寸。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        maxHeight: number;

        /**
         * Set the result of measuring.
         * @param width measured width
         * @param height measured height
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置测量结果。
         * @param width 测量宽度
         * @param height 测量高度
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        setMeasuredSize(width: number, height: number): void;

        /**
         * Marks a component so that its <code>commitProperties()</code>
         * method gets called during a later screen update.<p/>
         *
         * Invalidation is a useful mechanism for eliminating duplicate
         * work by delaying processing of changes to a component until a
         * later screen update.<p/>
         *
         * For example, if you want to change the text color and size,
         * it would be wasteful to update the color immediately after you
         * change it and then update the size when it gets set.
         * It is more efficient to change both properties and then render
         * the text with its new size and color once.<p/>
         *
         * Invalidation methods rarely get called.
         * In general, setting a property on a component automatically
         * calls the appropriate invalidation method.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 标记提交过需要延迟应用的属性，以便在稍后屏幕更新期间调用该组件的 commitProperties() 方法。<p/>
         *
         * 这是一个很有用的机制，可将组件更改延迟到稍后屏幕更新时进行处理，从而消除了重复的工作。<p/>
         *
         * 例如，要更改文本颜色和大小，如果在更改颜色后立即进行更新，然后在设置大小后再更新大小，就有些浪费。
         * 同时更改两个属性后再使用新的大小和颜色一次性呈示文本，效率会更高。<p/>
         *
         * 很少调用 Invalidation 方法。通常，在组件上设置属性会自动调用合适的 invalidation 方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        invalidateProperties(): void;

        /**
         * Used by layout logic to validate the properties of a component
         * by calling the <code>commitProperties()</code> method.
         * In general, subclassers should
         * override the <code>commitProperties()</code> method and not this method.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 由布局逻辑用于通过调用 commitProperties() 方法来验证组件的属性。
         * 通常，子类应覆盖 commitProperties() 方法，而不是覆盖此方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        validateProperties(): void;

        /**
         * Marks a component so that its <code>measure()</code>
         * method gets called during a later screen update.<p/>
         *
         * Invalidation is a useful mechanism for eliminating duplicate
         * work by delaying processing of changes to a component until a
         * later screen update.<p/>
         *
         * For example, if you want to change the text and font size,
         * it would be wasteful to update the text immediately after you
         * change it and then update the size when it gets set.
         * It is more efficient to change both properties and then render
         * the text with its new size once.<p/>
         *
         * Invalidation methods rarely get called.
         * In general, setting a property on a component automatically
         * calls the appropriate invalidation method.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 标记提交过需要验证组件尺寸，以便在稍后屏幕更新期间调用该组件的 measure() 方法。<p/>
         *
         * Invalidation 是一个很有用的机制，可将组件更改延迟到稍后屏幕更新时进行处理，从而消除了重复的工作。<p/>
         *
         * 例如，要更改文本和字体大小，如果在更改文本后立即进行更新，然后在设置大小后再更新大小，就有些浪费。
         * 更改两个属性后再使用新的大小一次性呈示文本，效率会更高。<p/>
         *
         * 很少调用 Invalidation 方法。通常，在组件上设置属性会自动调用合适的 invalidation 方法。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        invalidateSize(): void;

        /**
         * Validates the measured size of the component.
         * @param recursive If <code>true</code>, call this method
         *  on the objects children.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 验证组件的尺寸。
         * @param recursive 如果为 true，则调用对象子项的此方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        validateSize(recursive?: boolean): void;

        /**
         * Marks a component so that its <code>updateDisplayList()</code>
         * method gets called during a later screen update.<p/>
         *
         * Invalidation is a useful mechanism for eliminating duplicate
         * work by delaying processing of changes to a component until a
         * later screen update.<p/>
         *
         * For example, if you want to change the width and height,
         * it would be wasteful to update the component immediately after you
         * change the width and then update again with the new height.
         * It is more efficient to change both properties and then render
         * the component with its new size once.<p/>
         *
         * Invalidation methods rarely get called.
         * In general, setting a property on a component automatically
         * calls the appropriate invalidation method.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 标记需要验证显示列表，以便在稍后屏幕更新期间调用该组件的 updateDisplayList() 方法。<p/>
         *
         * Invalidation 是一个很有用的机制，可将组件更改延迟到稍后屏幕更新时进行处理，从而消除了重复的工作。<p/>
         *
         * 例如，要更改宽度和高度，如果在更改宽度后立即更新组件，然后在设置新高度后再次更新组件，就有些浪费。
         * 更改两个属性后再使用新的大小一次性呈示组件，效率会更高。<p/>
         *
         * 很少调用 Invalidation 方法。通常，在组件上设置属性会自动调用合适的 invalidation 方法。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        invalidateDisplayList(): void;

        /**
         * Validates the position and size of children and draws other
         * visuals.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 验证子项的位置和大小，并绘制其他可视内容。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        validateDisplayList(): void;

        /**
         * Validate and update the properties and layout of this object
         * and redraw it, if necessary.<p/>
         *
         * Processing properties that require substantial computation are normally
         * not processed until the script finishes executing.<p/>
         *
         * For example setting the <code>width</code> property is delayed, because it can
         * require recalculating the widths of the objects children or its parent.
         * Delaying the processing prevents it from being repeated
         * multiple times if the script sets the <code>width</code> property more than once.
         * This method lets you manually override this behavior.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 验证并更新此对象的属性和布局，如果需要的话重绘对象。<p/>
         *
         * 通常只有当脚本执行完毕后，才会处理要求进行大量计算的处理属性。<p/>
         *
         * 例如，对 width 属性的设置可能会延迟，因为此设置需要重新计算这些对象的子项或父项的宽度。
         * 如果脚本多次设置了 width 属性，则延迟处理可防止进行多次处理。此方法允许您手动覆盖此行为。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        validateNow(): void;

        /**
         * Sets the layout size of the element.
         * This is the size that the element uses to draw on screen.<p/>
         *
         * If the <code>width</code> and/or <code>height</code> parameters are left unspecified (NaN),
         * EUI sets the element's layout size to its preferred width and/or preferred height.<p/>
         *
         * Note that calls to the <code>setLayoutBoundSize()</code> method can affect the layout position, so
         * call <code>setLayoutBoundPosition()</code> after calling <code>setLayoutBoundSize()</code>.<p/>
         *
         * @param layoutWidth The element's layout width.
         * @param layoutHeight The element's layout height.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置元素的布局大小。这是元素在屏幕上进行绘制时所用的大小。<p/>
         *
         * 如果 width 和/或 height 参数尚未指定 (NaN))，则 EUI 会将该元素的布局大小设置为首选宽度和/或首选高度。<p/>
         *
         * 请注意，调用 setLayoutBoundSize() 方法会影响布局位置，因此请在调用 setLayoutBoundSize()
         * 之后再调用 setLayoutBoundPosition()。
         *
         * @param layoutWidth 元素的布局宽度。
         * @param layoutHeight 元素的布局高度。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void;

        /**
         * Sets the coordinates that the element uses to draw on screen.<p/>
         *
         * Note that calls to the <code>setLayoutBoundSize()</code> method can affect the layout position, so
         * call <code>setLayoutBoundPosition()</code> after calling <code>setLayoutBoundSize()</code>.<p/>
         *
         * @param x The x-coordinate of the top-left corner of the bounding box.
         * @param y The y-coordinate of the top-left corner of the bounding box.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置元素在屏幕上进行绘制时所用的布局坐标。<p/>
         *
         * 请注意，调用 setLayoutBoundSize() 方法会影响布局位置，因此请在调用 setLayoutBoundSize()
         * 之后再调用 setLayoutBoundPosition()。
         *
         * @param x 边框左上角的 X 坐标。
         * @param y 边框左上角的 Y 坐标。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        setLayoutBoundsPosition(x: number, y: number): void;

        /**
         * Get the layout bounds that the element uses to draw on screen.
         * Commonly used in the <code>updateDisplayList()</code> method in parent container.<p/>
         * Priority: layout > explicit > measure.<p/>
         * The result of this method is contains <code>scale</code> and <code>rotation</code>.
         *
         * @param bounds the instance of <code>egret.Rectangle</code> can set result.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 组件的布局尺寸,常用于父级的<code>updateDisplayList()</code>方法中。<p/>
         * 按照：布局尺寸>外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸。<p/>
         * 注意此方法返回值已经包含scale和rotation。
         *
         * @param bounds 可以放置结果的<code>egret.Rectangle</code>实例。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        getLayoutBounds(bounds: egret.Rectangle): void;

        /**
         * Get the element's preferred bounds。
         * Commonly used in the <code>measure()</code> method in parent container.<p/>
         * Priority: explicit > measure.<p/>
         * The result of this method is contains <code>scale</code> and <code>rotation</code>.
         *
         * @param bounds the instance of <code>egret.Rectangle</code> can set result.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取组件的首选尺寸,常用于父级的<code>measure()</code>方法中。<p/>
         * 按照：外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸。<p/>
         * 注意此方法返回值已经包含scale和rotation。
         *
         * @param bounds 可以放置结果的<code>egret.Rectangle</code>实例。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        getPreferredBounds(bounds: egret.Rectangle): void;
    }

}

namespace eui.sys {

    /**
     * @private
     */
    export const enum UIKeys {
        left,
        right,
        top,
        bottom,
        horizontalCenter,
        verticalCenter,
        percentWidth,
        percentHeight,
        explicitWidth,
        explicitHeight,
        width,
        height,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        measuredWidth,
        measuredHeight,
        oldPreferWidth,
        oldPreferHeight,
        oldX,
        oldY,
        oldWidth,
        oldHeight,
        invalidatePropertiesFlag,
        invalidateSizeFlag,
        invalidateDisplayListFlag,
        layoutWidthExplicitlySet,
        layoutHeightExplicitlySet,
        initialized
    }

    let UIComponentClass = "eui.UIComponent";

    function isDeltaIdentity(m: egret.Matrix): boolean {
        return (m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1);
    }

    let validator = new sys.Validator();

    /**
     * @private
     * EUI 显示对象基类模板。仅作为 UIComponent 的默认实现，为egret.sys.implemenetUIComponenet()方法提供代码模板。
     * 注意：在此类里不允许直接使用super关键字访问父类方法。一律使用this.$super属性访问。
     */
    export class UIComponentImpl extends egret.DisplayObject implements eui.UIComponent {
        /**
         * @private
         * 构造函数
         */
        public constructor() {
            super();
            this.initializeUIValues();
        }

        /**
         * @private
         * UIComponentImpl 定义的所有变量请不要添加任何初始值，必须统一在此处初始化。
         */
        private initializeUIValues(): void {
            this.$UIComponent = {
                0: NaN,       //left
                1: NaN,       //right
                2: NaN,       //top
                3: NaN,       //bottom
                4: NaN,       //horizontalCenter
                5: NaN,       //verticalCenter
                6: NaN,       //percentWidth
                7: NaN,       //percentHeight
                8: NaN,       //explicitWidth
                9: NaN,       //explicitHeight
                10: 0,              //width
                11: 0,              //height
                12: 0,              //minWidth
                13: 100000,         //maxWidth
                14: 0,              //minHeight
                15: 100000,         //maxHeight
                16: 0,              //measuredWidth
                17: 0,              //measuredHeight
                18: NaN,      //oldPreferWidth
                19: NaN,      //oldPreferHeight
                20: 0,              //oldX
                21: 0,              //oldY
                22: 0,              //oldWidth
                23: 0,              //oldHeight
                24: true,           //invalidatePropertiesFlag
                25: true,           //invalidateSizeFlag
                26: true,           //invalidateDisplayListFlag
                27: false,          //layoutWidthExplicitlySet
                28: false,          //layoutHeightExplicitlySet
                29: false,          //initialized
            };
            this.$includeInLayout = true;
            //if egret
            this.$touchEnabled = true;
            //endif*/
        }


        /**
         * @private
         * 子类覆盖此方法可以执行一些初始化子项操作。此方法仅在组件第一次添加到舞台时回调一次。
         * 请务必调用super.createChildren()以完成父类组件的初始化
         */
        protected createChildren(): void {

        }

        /**
         * @private
         * 子项创建完成,此方法在createChildren()之后执行。
         */
        protected childrenCreated(): void {

        }

        /**
         * @private
         * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
         */
        protected commitProperties(): void {
            let values = this.$UIComponent;
            if (values[UIKeys.oldWidth] != values[UIKeys.width] || values[UIKeys.oldHeight] != values[UIKeys.height]) {
                this.dispatchEventWith(egret.Event.RESIZE);
                values[UIKeys.oldWidth] = values[UIKeys.width];
                values[UIKeys.oldHeight] = values[UIKeys.height];
            }
            if (values[UIKeys.oldX] != this.$getX() || values[UIKeys.oldY] != this.$getY()) {
                UIEvent.dispatchUIEvent(this, UIEvent.MOVE);
                values[UIKeys.oldX] = this.$getX();
                values[UIKeys.oldY] = this.$getY();
            }
        }

        /**
         * @private
         * 测量组件尺寸
         */
        protected measure(): void {

        }

        /**
         * @private
         * 更新显示列表
         */
        protected updateDisplayList(unscaledWidth: number, unscaledHeight: number): void {
        }

        $super: any;

        $UIComponent: Object;

        $includeInLayout: boolean;

        /**
         * @private
         * 指定此组件是否包含在父容器的布局中。若为false，则父级容器在测量和布局阶段都忽略此组件。默认值为true。
         * 注意，visible属性与此属性不同，设置visible为false，父级容器仍会对其布局。
         */
        public get includeInLayout(): boolean {
            return this.$includeInLayout;
        }

        public set includeInLayout(value: boolean) {
            value = !!value;
            if (this.$includeInLayout === value)
                return;
            this.$includeInLayout = true;
            this.invalidateParentLayout();
            this.$includeInLayout = value;
        }

        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        $onAddToStage(stage: egret.Stage, nestLevel: number): void {
            this.$super.$onAddToStage.call(this, stage, nestLevel);
            this.checkInvalidateFlag();
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.initialized]) {
                values[sys.UIKeys.initialized] = true;
                this.createChildren();
                this.childrenCreated();
                UIEvent.dispatchUIEvent(this, UIEvent.CREATION_COMPLETE);
            }
        }

        /**
         * @private
         * 检查属性失效标记并应用
         */
        private checkInvalidateFlag(event?: Event): void {
            let values = this.$UIComponent;
            if (values[sys.UIKeys.invalidatePropertiesFlag]) {
                validator.invalidateProperties(this);
            }
            if (values[sys.UIKeys.invalidateSizeFlag]) {
                validator.invalidateSize(this);
            }
            if (values[sys.UIKeys.invalidateDisplayListFlag]) {
                validator.invalidateDisplayList(this);
            }
        }

        /**
         * @private
         * 距父级容器离左边距离
         */
        public get left(): any {
            return this.$UIComponent[UIKeys.left];
        }

        public set left(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }

            let values = this.$UIComponent;
            if (values[UIKeys.left] === value)
                return;
            values[UIKeys.left] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * 距父级容器右边距离
         */
        public get right(): any {
            return this.$UIComponent[UIKeys.right];
        }

        public set right(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.right] === value)
                return;
            values[UIKeys.right] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * 距父级容器顶部距离
         */
        public get top(): any {
            return this.$UIComponent[UIKeys.top];
        }

        public set top(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.top] === value)
                return;
            values[UIKeys.top] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * 距父级容器底部距离
         */
        public get bottom(): any {
            return this.$UIComponent[UIKeys.bottom];
        }

        public set bottom(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.bottom] == value)
                return;
            values[UIKeys.bottom] = value;
            this.invalidateParentLayout();
        }


        /**
         * @private
         * 在父级容器中距水平中心位置的距离
         */
        public get horizontalCenter(): any {
            return this.$UIComponent[UIKeys.horizontalCenter];
        }

        public set horizontalCenter(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.horizontalCenter] === value)
                return;
            values[UIKeys.horizontalCenter] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * 在父级容器中距竖直中心位置的距离
         */
        public get verticalCenter(): any {
            return this.$UIComponent[UIKeys.verticalCenter];
        }

        public set verticalCenter(value: any) {
            if (!value || typeof value == "number") {
                value = +value;
            }
            else {
                value = value.toString().trim();
            }
            let values = this.$UIComponent;
            if (values[UIKeys.verticalCenter] === value)
                return;
            values[UIKeys.verticalCenter] = value;
            this.invalidateParentLayout();
        }


        /**
         * @private
         * 相对父级容器宽度的百分比
         */
        public get percentWidth(): number {
            return this.$UIComponent[UIKeys.percentWidth];
        }

        public set percentWidth(value: number) {
            value = +value;
            let values = this.$UIComponent;
            if (values[UIKeys.percentWidth] === value)
                return;
            values[UIKeys.percentWidth] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * 相对父级容器高度的百分比
         */
        public get percentHeight(): number {
            return this.$UIComponent[UIKeys.percentHeight];
        }

        public set percentHeight(value: number) {
            value = +value;
            let values = this.$UIComponent;
            if (values[UIKeys.percentHeight] === value)
                return;
            values[UIKeys.percentHeight] = value;
            this.invalidateParentLayout();
        }

        /**
         * @private
         * 外部显式指定的宽度
         */
        public get explicitWidth(): number {
            return this.$UIComponent[UIKeys.explicitWidth];
        }

        /**
         * @private
         * 外部显式指定的高度
         */
        public get explicitHeight(): number {
            return this.$UIComponent[UIKeys.explicitHeight];
        }

        /**
         * @private
         * 组件宽度,默认值为egret.NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         */
        $getWidth(): number {
            this.validateSizeNow();
            return this.$UIComponent[UIKeys.width];
        }

        /**
         * @private
         *
         * @param value
         */
        $setWidth(value: number): boolean {
            value = +value;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.width] === value && values[UIKeys.explicitWidth] === value)
                return false;
            values[UIKeys.explicitWidth] = value;
            if (isNaN(value))
                this.invalidateSize();
            this.invalidateProperties();
            this.invalidateDisplayList();
            this.invalidateParentLayout();

            return true;
        }

        /**
         * @private
         * 立即验证自身的尺寸。
         */
        private validateSizeNow(): void {
            this.validateSize(true);
            this.updateFinalSize();
        }

        /**
         * @private
         * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         */
        $getHeight(): number {
            this.validateSizeNow();
            return this.$UIComponent[UIKeys.height];
        }

        /**
         * @private
         *
         * @param value
         */
        $setHeight(value: number): boolean {
            value = +value;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.height] === value && values[UIKeys.explicitHeight] === value)
                return false;
            values[UIKeys.explicitHeight] = value;
            if (isNaN(value))
                this.invalidateSize();
            this.invalidateProperties();
            this.invalidateDisplayList();
            this.invalidateParentLayout();

            return true;
        }

        /**
         * @private
         * 组件的最小宽度,此属性设置为大于maxWidth的值时无效。同时影响测量和自动布局的尺寸。
         */
        public get minWidth(): number {
            return this.$UIComponent[UIKeys.minWidth];
        }

        public set minWidth(value: number) {
            value = +value || 0;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.minWidth] === value) {
                return;
            }
            values[UIKeys.minWidth] = value;
            this.invalidateSize();
            this.invalidateParentLayout();
        }

        /**
         * @private
         * 组件的最大高度。同时影响测量和自动布局的尺寸。
         */
        public get maxWidth(): number {
            return this.$UIComponent[UIKeys.maxWidth];
        }

        public set maxWidth(value: number) {
            value = +value || 0;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.maxWidth] === value) {
                return;
            }
            values[UIKeys.maxWidth] = value;
            this.invalidateSize();
            this.invalidateParentLayout();
        }

        /**
         * @private
         * 组件的最小高度,此属性设置为大于maxHeight的值时无效。同时影响测量和自动布局的尺寸。
         */
        public get minHeight(): number {
            return this.$UIComponent[UIKeys.minHeight];
        }

        public set minHeight(value: number) {
            value = +value || 0;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.minHeight] === value) {
                return;
            }
            values[UIKeys.minHeight] = value;
            this.invalidateSize();
            this.invalidateParentLayout();
        }


        /**
         * @private
         * 组件的最大高度,同时影响测量和自动布局的尺寸。
         */
        public get maxHeight(): number {
            return this.$UIComponent[UIKeys.maxHeight];
        }

        public set maxHeight(value: number) {
            value = +value || 0;
            let values = this.$UIComponent;
            if (value < 0 || values[UIKeys.maxHeight] === value) {
                return;
            }
            values[UIKeys.maxHeight] = value;
            this.invalidateSize();
            this.invalidateParentLayout();
        }

        /**
         * @private
         * 设置测量结果。
         * @param width 测量宽度
         * @param height 测量高度
         */
        public setMeasuredSize(width: number, height: number): void {
            let values = this.$UIComponent;
            values[UIKeys.measuredWidth] = Math.ceil(+width || 0);
            values[UIKeys.measuredHeight] = Math.ceil(+height || 0);
        }


        /**
         * @private
         * 设置组件的宽高。此方法不同于直接设置width,height属性，
         * 不会影响显式标记尺寸属性
         */
        private setActualSize(w: number, h: number): void {
            let change = false;
            let values = this.$UIComponent;
            if (values[UIKeys.width] !== w) {
                values[UIKeys.width] = w;
                change = true;
            }
            if (values[UIKeys.height] !== h) {
                values[UIKeys.height] = h;
                change = true;
            }
            if (change) {
                this.invalidateDisplayList();
                this.dispatchEventWith(egret.Event.RESIZE);
            }
        }

        /**
         * @private
         */
        protected $updateUseTransform(): void {
            this.$super.$updateUseTransform.call(this);
            this.invalidateParentLayout();
        }
        /**
         * @private
         */
        $setMatrix(matrix: egret.Matrix, needUpdateProperties: boolean = true): boolean {
            this.$super.$setMatrix.call(this, matrix, needUpdateProperties);
            this.invalidateParentLayout();
            return true;
        }
        /**
         * @private
         */
        $setAnchorOffsetX(value: number): boolean {
            this.$super.$setAnchorOffsetX.call(this, value);
            this.invalidateParentLayout();
            return true;
        }
        /**
         * @private
         */
        $setAnchorOffsetY(value: number): boolean {
            this.$super.$setAnchorOffsetY.call(this, value);
            this.invalidateParentLayout();
            return true;
        }

        /**
         * @private
         *
         * @param value
         * @returns
         */
        $setX(value: number): boolean {
            let change = this.$super.$setX.call(this, value);
            if (change) {
                this.invalidateParentLayout();
                this.invalidateProperties();
            }
            return change;
        }

        /**
         * @private
         *
         * @param value
         * @returns
         */
        $setY(value: number): boolean {
            let change = this.$super.$setY.call(this, value);
            if (change) {
                this.invalidateParentLayout();
                this.invalidateProperties();
            }
            return change;
        }


        /**
         * @private
         * 标记属性失效
         */
        public invalidateProperties(): void {
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.invalidatePropertiesFlag]) {
                values[sys.UIKeys.invalidatePropertiesFlag] = true;
                if (this.$stage)
                    validator.invalidateProperties(this);
            }
        }

        /**
         * @private
         * 验证组件的属性
         */
        public validateProperties(): void {
            let values = this.$UIComponent;
            if (values[sys.UIKeys.invalidatePropertiesFlag]) {
                this.commitProperties();
                values[sys.UIKeys.invalidatePropertiesFlag] = false;
            }
        }

        /**
         * @private
         * 标记提交过需要验证组件尺寸
         */
        public invalidateSize(): void {
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.invalidateSizeFlag]) {
                values[sys.UIKeys.invalidateSizeFlag] = true;
                if (this.$stage)
                    validator.invalidateSize(this);
            }
        }

        /**
         * @private
         * 验证组件的尺寸
         */
        public validateSize(recursive?: boolean): void {
            if (recursive) {
                let children = this.$children;
                if (children) {
                    let length = children.length;
                    for (let i = 0; i < length; i++) {
                        let child = children[i];
                        if (egret.is(child, UIComponentClass)) {
                            (<eui.UIComponent>child).validateSize(true);
                        }
                    }
                }
            }
            let values = this.$UIComponent;
            if (values[sys.UIKeys.invalidateSizeFlag]) {
                let changed = this.measureSizes();
                if (changed) {
                    this.invalidateDisplayList();
                    this.invalidateParentLayout();
                }
                values[sys.UIKeys.invalidateSizeFlag] = false;
            }
        }

        /**
         * @private
         * 测量组件尺寸，返回尺寸是否发生变化
         */
        private measureSizes(): boolean {
            let changed = false;
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.invalidateSizeFlag])
                return changed;

            if (isNaN(values[UIKeys.explicitWidth]) || isNaN(values[UIKeys.explicitHeight])) {
                this.measure();
                if (values[UIKeys.measuredWidth] < values[UIKeys.minWidth]) {
                    values[UIKeys.measuredWidth] = values[UIKeys.minWidth];
                }
                if (values[UIKeys.measuredWidth] > values[UIKeys.maxWidth]) {
                    values[UIKeys.measuredWidth] = values[UIKeys.maxWidth];
                }
                if (values[UIKeys.measuredHeight] < values[UIKeys.minHeight]) {
                    values[UIKeys.measuredHeight] = values[UIKeys.minHeight];
                }
                if (values[UIKeys.measuredHeight] > values[UIKeys.maxHeight]) {
                    values[UIKeys.measuredHeight] = values[UIKeys.maxHeight]
                }
            }
            let preferredW = this.getPreferredUWidth();
            let preferredH = this.getPreferredUHeight();
            if (preferredW !== values[UIKeys.oldPreferWidth] ||
                preferredH !== values[UIKeys.oldPreferHeight]) {
                values[UIKeys.oldPreferWidth] = preferredW;
                values[UIKeys.oldPreferHeight] = preferredH;
                changed = true;
            }
            return changed;
        }

        /**
         * @private
         * 标记需要验证显示列表
         */
        public invalidateDisplayList(): void {
            let values = this.$UIComponent;
            if (!values[sys.UIKeys.invalidateDisplayListFlag]) {
                values[sys.UIKeys.invalidateDisplayListFlag] = true;
                if (this.$stage)
                    validator.invalidateDisplayList(this);
            }
        }

        /**
         * @private
         * 验证子项的位置和大小，并绘制其他可视内容
         */
        public validateDisplayList(): void {
            let values = this.$UIComponent;
            if (values[sys.UIKeys.invalidateDisplayListFlag]) {
                this.updateFinalSize();
                this.updateDisplayList(values[UIKeys.width], values[UIKeys.height]);
                values[sys.UIKeys.invalidateDisplayListFlag] = false;
            }
        }

        /**
         * @private
         * 更新最终的组件宽高
         */
        private updateFinalSize(): void {
            let unscaledWidth = 0;
            let unscaledHeight = 0;
            let values = this.$UIComponent;
            if (values[sys.UIKeys.layoutWidthExplicitlySet]) {
                unscaledWidth = values[UIKeys.width];
            }
            else if (!isNaN(values[UIKeys.explicitWidth])) {
                unscaledWidth = values[UIKeys.explicitWidth];
            }
            else {
                unscaledWidth = values[UIKeys.measuredWidth];
            }
            if (values[sys.UIKeys.layoutHeightExplicitlySet]) {
                unscaledHeight = values[UIKeys.height];
            }
            else if (!isNaN(values[UIKeys.explicitHeight])) {
                unscaledHeight = values[UIKeys.explicitHeight];
            }
            else {
                unscaledHeight = values[UIKeys.measuredHeight];
            }
            this.setActualSize(unscaledWidth, unscaledHeight);
        }

        /**
         * @private
         * 立即应用组件及其子项的所有属性
         */
        public validateNow(): void {
            if (this.$stage)
                validator.validateClient(this);
        }

        /**
         * @private
         * 标记父级容器的尺寸和显示列表为失效
         */
        protected invalidateParentLayout(): void {
            let parent = this.$parent;
            if (!parent || !this.$includeInLayout || !egret.is(parent, UIComponentClass))
                return;
            (<eui.UIComponent><any>parent).invalidateSize();
            (<eui.UIComponent><any>parent).invalidateDisplayList();
        }

        /**
         * @private
         * 设置组件的布局宽高
         */
        public setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void {
            layoutHeight = +layoutHeight;
            layoutWidth = +layoutWidth;
            if (layoutHeight < 0 || layoutWidth < 0) {
                return;
            }
            let values = this.$UIComponent;
            let maxWidth = values[UIKeys.maxWidth];
            let maxHeight = values[UIKeys.maxHeight];
            let minWidth = Math.min(values[UIKeys.minWidth], maxWidth);
            let minHeight = Math.min(values[UIKeys.minHeight], maxHeight);
            let width: number;
            let height: number;
            if (isNaN(layoutWidth)) {
                values[sys.UIKeys.layoutWidthExplicitlySet] = false;
                width = this.getPreferredUWidth();
            }
            else {
                values[sys.UIKeys.layoutWidthExplicitlySet] = true;
                width = Math.max(minWidth, Math.min(maxWidth, layoutWidth));
            }
            if (isNaN(layoutHeight)) {
                values[sys.UIKeys.layoutHeightExplicitlySet] = false;
                height = this.getPreferredUHeight();
            }
            else {
                values[sys.UIKeys.layoutHeightExplicitlySet] = true;
                height = Math.max(minHeight, Math.min(maxHeight, layoutHeight));
            }
            let matrix = this.getAnchorMatrix();
            if (isDeltaIdentity(matrix)) {
                this.setActualSize(width, height);
                return;
            }

            let fitSize = sys.MatrixUtil.fitBounds(layoutWidth, layoutHeight, matrix,
                values[UIKeys.explicitWidth], values[UIKeys.explicitHeight],
                this.getPreferredUWidth(), this.getPreferredUHeight(),
                minWidth, minHeight, maxWidth, maxHeight);
            if (!fitSize) {
                fitSize = egret.Point.create(minWidth, minHeight);
            }
            this.setActualSize(fitSize.x, fitSize.y);
            egret.Point.release(fitSize);
        }

        /**
         * @private
         * 设置组件的布局位置
         */
        public setLayoutBoundsPosition(x: number, y: number): void {
            let matrix = this.$getMatrix();
            if (!isDeltaIdentity(matrix) || this.anchorOffsetX != 0 || this.anchorOffsetY != 0) {
                let bounds = egret.$TempRectangle;
                this.getLayoutBounds(bounds);
                x += this.$getX() - bounds.x;
                y += this.$getY() - bounds.y;
            }
            let changed: boolean = this.$super.$setX.call(this, x);
            if (this.$super.$setY.call(this, y) || changed) {
                UIEvent.dispatchUIEvent(this, UIEvent.MOVE);
            }
        }

        /**
         * @private
         * 组件的布局尺寸,常用于父级的updateDisplayList()方法中
         * 按照：布局尺寸>外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸,
         * 注意此方法返回值已经包含scale和rotation。
         */
        public getLayoutBounds(bounds: egret.Rectangle): void {
            let values = this.$UIComponent;
            let w: number;
            if (values[sys.UIKeys.layoutWidthExplicitlySet]) {
                w = values[UIKeys.width];
            }
            else if (!isNaN(values[UIKeys.explicitWidth])) {
                w = values[UIKeys.explicitWidth];
            }
            else {
                w = values[UIKeys.measuredWidth];
            }
            let h: number;
            if (values[sys.UIKeys.layoutHeightExplicitlySet]) {
                h = values[UIKeys.height];
            }
            else if (!isNaN(values[UIKeys.explicitHeight])) {
                h = values[UIKeys.explicitHeight];
            }
            else {
                h = values[UIKeys.measuredHeight];
            }
            this.applyMatrix(bounds, w, h);
        }


        /**
         * @private
         *
         * @returns
         */
        private getPreferredUWidth(): number {
            let values = this.$UIComponent;
            return isNaN(values[UIKeys.explicitWidth]) ?
                values[UIKeys.measuredWidth] : values[UIKeys.explicitWidth];
        }

        /**
         * @private
         *
         * @returns
         */
        private getPreferredUHeight(): number {
            let values = this.$UIComponent;
            return isNaN(values[UIKeys.explicitHeight]) ?
                values[UIKeys.measuredHeight] : values[UIKeys.explicitHeight];
        }

        /**
         * @private
         * 获取组件的首选尺寸,常用于父级的measure()方法中
         * 按照：外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸，
         * 注意此方法返回值已经包含scale和rotation。
         */
        public getPreferredBounds(bounds: egret.Rectangle): void {
            let w = this.getPreferredUWidth();
            let h = this.getPreferredUHeight();
            this.applyMatrix(bounds, w, h);
        }


        /**
         * @private
         */
        private applyMatrix(bounds: egret.Rectangle, w: number, h: number): void {
            bounds.setTo(0, 0, w, h);
            let matrix = this.getAnchorMatrix();

            if (isDeltaIdentity(matrix)) {
                bounds.x += matrix.tx;
                bounds.y += matrix.ty;
            }
            else {
                matrix.$transformBounds(bounds);
            }
        }


        /**
         * @private
         */
        private getAnchorMatrix(): egret.Matrix {
            let matrix = this.$getMatrix();
            let offsetX = this.anchorOffsetX;
            let offsetY = this.anchorOffsetY;
            if (offsetX != 0 || offsetY != 0) {
                let tempM = egret.$TempMatrix;
                matrix.$preMultiplyInto(tempM.setTo(1, 0, 0, 1, -offsetX, -offsetY), tempM);
                return tempM;
            }
            return matrix;
        }
    }

    /**
     * 检查一个函数的方法体是否为空。
     */
    function isEmptyFunction(prototype: any, key: string): boolean {
        if (typeof prototype[key] != "function") {
            return false;
        }
        let body = prototype[key].toString();
        let index = body.indexOf("{");
        let lastIndex = body.lastIndexOf("}");
        body = body.substring(index + 1, lastIndex);
        return body.trim() == "";
    }

    /**
     * @private
     * 拷贝模板类的方法体和属性到目标类上。
     * @param target 目标类
     * @param template 模板类
     */
    export function mixin(target: any, template: any): void {
        for (let property in template) {
            if (property != "prototype" && template.hasOwnProperty(property)) {
                target[property] = template[property];
            }
        }
        let prototype = target.prototype;
        let protoBase = template.prototype;
        let keys = Object.keys(protoBase);
        let length = keys.length;
        for (let i = 0; i < length; i++) {
            let key = keys[i];
            if (key == "__meta__") {
                continue;
            }
            if (!prototype.hasOwnProperty(key) || isEmptyFunction(prototype, key)) {
                let value = Object.getOwnPropertyDescriptor(protoBase, key);
                Object.defineProperty(prototype, key, value);
            }
        }
    }

    /**
     * @private
     * 自定义类实现UIComponent的步骤：
     * 1.在自定义类的构造函数里调用：this.initializeUIValues();
     * 2.拷贝UIComponent接口定义的所有内容(包括注释掉的protected函数)到自定义类，将所有子类需要覆盖的方法都声明为空方法体。
     * 3.在定义类结尾的外部调用sys.implementUIComponent()，并传入自定义类。
     * 4.若覆盖了某个UIComponent的方法，需要手动调用UIComponentImpl.prototype["方法名"].call(this);
     * @param descendant 自定义的UIComponent子类
     * @param base 自定义子类继承的父类
     */
    export function implementUIComponent(descendant: any, base: any, isContainer?: boolean): void {
        mixin(descendant, UIComponentImpl);
        let prototype = descendant.prototype;
        prototype.$super = base.prototype;

        registerProperty(descendant, "left", "Percentage");
        registerProperty(descendant, "right", "Percentage");
        registerProperty(descendant, "top", "Percentage");
        registerProperty(descendant, "bottom", "Percentage");
        registerProperty(descendant, "horizontalCenter", "Percentage");
        registerProperty(descendant, "verticalCenter", "Percentage");
        if (isContainer) {
            prototype.$childAdded = function (child: egret.DisplayObject, index: number): void {
                this.invalidateSize();
                this.invalidateDisplayList();
            };
            prototype.$childRemoved = function (child: egret.DisplayObject, index: number): void {
                this.invalidateSize();
                this.invalidateDisplayList();
            };
        }

        if (DEBUG) {//用于调试时查看布局尺寸的便利属性，发行版时移除。

            Object.defineProperty(prototype, "preferredWidth", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getPreferredBounds(bounds);
                    return bounds.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "preferredHeight", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getPreferredBounds(bounds);
                    return bounds.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "preferredX", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getPreferredBounds(bounds);
                    return bounds.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "preferredY", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getPreferredBounds(bounds);
                    return bounds.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutBoundsX", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getLayoutBounds(bounds);
                    return bounds.x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutBoundsY", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getLayoutBounds(bounds);
                    return bounds.y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutBoundsWidth", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getLayoutBounds(bounds);
                    return bounds.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutBoundsHeight", {
                get: function () {
                    let bounds = egret.$TempRectangle;
                    this.getLayoutBounds(bounds);
                    return bounds.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "measuredWidth", {
                get: function () {
                    return this.$UIComponent[UIKeys.measuredWidth];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "measuredHeight", {
                get: function () {
                    return this.$UIComponent[UIKeys.measuredHeight];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutWidthExplicitlySet", {
                get: function () {
                    return this.$UIComponent[UIKeys.layoutWidthExplicitlySet];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "layoutHeightExplicitlySet", {
                get: function () {
                    return this.$UIComponent[UIKeys.layoutHeightExplicitlySet];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "invalidatePropertiesFlag", {
                get: function () {
                    return this.$UIComponent[UIKeys.invalidatePropertiesFlag];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "invalidateSizeFlag", {
                get: function () {
                    return this.$UIComponent[UIKeys.invalidateSizeFlag];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(prototype, "invalidateDisplayListFlag", {
                get: function () {
                    return this.$UIComponent[UIKeys.invalidateDisplayListFlag];
                },
                enumerable: true,
                configurable: true
            });
        }
    }
}