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

module egret {
    /**
     * @language en_US
     * The Stage class represents the main drawing area.The Stage object is not globally accessible. You need to access
     * it through the stage property of a DisplayObject instance.<br/>
     * The Stage class has several ancestor classes — Sprite, DisplayObject, and EventDispatcher — from which it inherits
     * properties and methods. Many of these properties and methods are inapplicable to Stage objects.
     * @event egret.Event.RESIZE Dispatched when the stageWidth or stageHeight property of the Stage object is changed.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Stage.ts
     */
    /**
     * @language zh_CN
     * Stage 类代表主绘图区。
     * 可以利用 DisplayObject 实例的 stage 属性进行访问。<br/>
     * Stage 类具有多个祖代类: Sprite、DisplayObject 和 EventDispatcher，属性和方法便是从这些类继承而来的。
     * 从这些继承的许多属性和方法不适用于 Stage 对象。
     * @event egret.Event.RESIZE 当stageWidth或stageHeight属性发生改变时调度
     * @event egret.Event.DEACTIVATE 当stage失去焦点后调度
     * @event egret.Event.ACTIVATE 当stage获得焦点后调度
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Stage.ts
     */
    export class Stage extends DisplayObjectContainer {

        /**
         * @private
         * Stage不许允许自行实例化
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$stage = this;
            this.$nestLevel = 1;
        }

        /**
         * @language en_US
         * Gets and sets the frame rate of the stage. The frame rate is defined as frames per second. Valid range for the
         * frame rate is from 0.01 to 1000 frames per second.<br/>
         * Note: setting the frameRate property of one Stage object changes the frame rate for all Stage objects
         * @default 30
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取并设置舞台的帧速率。帧速率是指每秒显示的帧数。帧速率的有效范围为每秒 0.01 到 60 个帧。<br/>
         * 注意: 修改任何一个Stage的frameRate属性都会同步修改其他Stage的帧率。
         * @default 30
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get frameRate():number {
            return sys.$ticker.$frameRate;
        }

        public set frameRate(value:number) {
            sys.$ticker.$setFrameRate(value);
        }

        /**
         * @private
         */
        $stageWidth:number = 0;

        /**
         * @language en_US
         * Indicates the width of the stage, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 舞台的当前宽度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get stageWidth():number {
            return this.$stageWidth;
        }

        /**
         * @private
         */
        $stageHeight:number = 0;

        /**
         * @language en_US
         * Indicates the height of the stage, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 舞台的当前高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get stageHeight():number {
            return this.$stageHeight;
        }

        /**
         * @language en_US
         * After you call the invalidate() method, when the display list is next rendered, the Egret runtime sends a render
         * event to each display object that has registered to listen for the render event. You must call the invalidate()
         * method each time you want the Egret runtime to send render events.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 调用 invalidate() 方法后，在显示列表下次呈现时，Egret 会向每个已注册侦听 Event.RENDER 事件的显示对象发送一个 Event.RENDER 事件。
         * 每次您希望 Egret 发送 Event.RENDER 事件时，都必须调用 invalidate() 方法。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public invalidate():void {
            sys.$invalidateRenderFlag = true;
        }

        /**
         * @private
         */
        private implMap:any = {};

        /**
         * @language en_US
         * Adds an interface-name-to-implementation-class mapping to the registry.
         * @param interfaceName the interface name to register. For example："eui.IAssetAdapter","eui.Theme"
         * @param instance the instance to register.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 注册一个接口实现。
         * @param interfaceName 注入的接口名称。例如："eui.IAssetAdapter","eui.Theme"
         * @param instance 实现此接口的实例。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public registerImplementation(interfaceName:string, instance:any):void {
            this.implMap[interfaceName] = instance;
        }

        /**
         * @language en_US
         * Returns the singleton instance of the implementation class that was registered for the specified interface.
         * This method is usually called by egret framework.
         * @param interfaceName The interface name to identify. For example："eui.IAssetAdapter","eui.Theme"
         * @returns the singleton instance of the implementation class
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取一个接口实现。此方法通常由框架内部调用。获取项目注入的自定义实现实例。
         * @param interfaceName 要获取的接口名称。例如："eui.IAssetAdapter","eui.Theme"
         * @returns 返回实现此接口的实例。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getImplementation(interfaceName:string):any {
            return this.implMap[interfaceName];
        }

        /**
         * @private
         * 设备屏幕引用
         */
        $screen:egret.sys.Screen;

        $scaleMode:string = egret.StageScaleMode.SHOW_ALL;
        /**
         * @language en_US
         * A StageScaleMode class that specifies which scale mode to use. The following are valid values:<br/>
         * <ul>
         * <li>StageScaleMode.EXACT_FIT -- The entire application be visible in the specified area without trying to preserve the original aspect ratio. Distortion can occur, the application may be stretched or compressed.</li>
         * <li>StageScaleMode.SHOW_ALL -- The entire application is visible in the specified area without distortion while maintaining the application of the original aspect ratio. Applications may display border.</li>
         * <li>StageScaleMode.NO_SCALE -- The size of the entire application is fixed, so that even if the size of the player window changes, it remains unchanged. If the player window is smaller than the content, it may do some trimming.</li>
         * <li>StageScaleMode.NO_BORDER -- Keep the original aspect ratio scaling application content, after scaling a narrow direction of application content to fill the viewport players on both sides in the other direction may exceed the viewport and the player is cut.</li>
         * <li>StageScaleMode.FIXED_WIDTH -- Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant width, height may change.</li>
         * <li>StageScaleMode.FIXED_HEIGHT -- Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant height, width may change.</li>
         * </ul>
         * @default egret.StageScaleMode.SHOW_ALL
         */
        /**
         * @language zh_CN
         * 一个 StageScaleMode 类中指定要使用哪种缩放模式的值。以下是有效值：<br/>
         * <ul>
         * <li>StageScaleMode.EXACT_FIT -- 整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲，应用程序可能会拉伸或压缩显示。</li>
         * <li>StageScaleMode.SHOW_ALL -- 整个应用程序在指定区域中可见，且不发生扭曲，同时保持应用程序的原始高宽比。应用程序的可能会显示边框。</li>
         * <li>StageScaleMode.NO_SCALE -- 整个应用程序的大小固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。</li>
         * <li>StageScaleMode.NO_BORDER -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较窄方向填满播放器视口，另一个方向的两侧可能会超出播放器视口而被裁切。</li>
         * <li>StageScaleMode.FIXED_WIDTH -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始宽度不变，高度可能会改变。</li>
         * <li>StageScaleMode.FIXED_HEIGHT -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始高度不变，宽度可能会改变。</li>
         * </ul>
         * @default egret.StageScaleMode.SHOW_ALL
         */
        public get scaleMode():string {
            return this.$scaleMode;
        }

        public set scaleMode(value:string) {
            if (this.$scaleMode == value) {
                return;
            }
            this.$scaleMode = value;
            this.$screen.updateScreenSize();
        }

        $orientation:string = egret.OrientationMode.AUTO;
        public set orientation(value:string) {
            if (this.$orientation == value) {
                return;
            }
            this.$orientation = value;
            this.$screen.updateScreenSize();
        }

        /**
         * @language en_US
         * Horizontal and vertical screen display screen, can only be set under the current Native in the configuration file. A egret.OrientationMode class that specifies which display mode to use. The following are valid values:<br/>
         * <ul>
         * <li>egret.OrientationMode.AUTO -- Always follow the direction of application display screen, always guaranteed by the look down.</li>
         * <li>egret.OrientationMode.PORTRAIT -- Applications remain portrait mode, namely horizontal screen look, the screen from left to right.</li>
         * <li>egret.OrientationMode.LANDSCAPE -- Applications remain horizontal screen mode, namely vertical screen, the screen from right to left.</li>
         * <li>egret.OrientationMode.LANDSCAPE_FLIPPED -- Applications remain horizontal screen mode, namely vertical screen, the screen from left to right.</li>
         * </ul>
         * @platform Web
         * @version 2.4
         */
        /**
         * @language zh_CN
         * 屏幕横竖屏显示方式，目前 Native 下只能在配置文件里设置。一个 egret.OrientationMode 类中指定要使用哪种显示方式。以下是有效值：<br/>
         * <ul>
         * <li>egret.OrientationMode.AUTO -- 应用始终跟随屏幕的方向显示，始终保证由上往下看。</li>
         * <li>egret.OrientationMode.PORTRAIT -- 应用始终保持竖屏模式，即横屏看时，屏幕由左往右看。</li>
         * <li>egret.OrientationMode.LANDSCAPE -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由右往左。</li>
         * <li>egret.OrientationMode.LANDSCAPE_FLIPPED -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由左往右。</li>
         * </ul>
         * @platform Web
         * @version 2.4
         */
        public get orientation():string {
            return this.$orientation;
        }

        /**
         * @language en_US
         * Draw texture zoom ratio
         * @default 1
         */
        /**
         * @language zh_CN
         * 绘制纹理的缩放比率，默认值为1
         * @default 1
         */
        public get textureScaleFactor():number {
            return egret.$TextureScaleFactor;
        }

        public set textureScaleFactor(value:number) {
            egret.$TextureScaleFactor = value;
        }

        $maxTouches:number = 99;
        /**
         * @language en_US
         * Set the number of screens can simultaneously touch. Above this amount will not be triggered in response.
         * @default 99
         */
        /**
         * @language zh_CN
         * 设置屏幕同时可以触摸的数量。高于这个数量将不会被触发响应。
         * @default 99
         */
        public get maxTouches():number {
            return this.$maxTouches;
        }

        public set maxTouches(value:number) {
            if (this.$maxTouches == value) {
                return;
            }
            this.$maxTouches = value;
            this.$screen.updateMaxTouches();
        }
        private $dirtyRegionPolicy:string = DirtyRegionPolicy.ON;
        /**
         * @language en_US
         * Set dirty region policy
         * One of the constants defined by egret.DirtyRegionPolicy
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置脏矩形策略
         * egret.DirtyRegionPolicy 定义的常量之一
         * @version Egret 2.5
         * @platform Web,Native
         */
        public set dirtyRegionPolicy(policy:string) {
            if(this.$dirtyRegionPolicy != policy){
                this.$dirtyRegionPolicy = policy;
                this.$displayList.setDirtyRegionPolicy(policy);
            }
        }
        public get dirtyRegionPolicy():string{
            return this.$dirtyRegionPolicy;
        }

        /**
         * @language en_US
         * Set resolution size
         * @param width width
         * @param height height
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置分辨率尺寸
         * @param width 宽度
         * @param height 高度
         * @version Egret 2.5
         * @platform Web,Native
         */
        public setContentSize(width:number, height:number):void {
            this.$screen.setContentSize(width, height);
        }
    }

    if (DEBUG) {

        egret.$markCannotUse(Stage, "alpha", 1);
        egret.$markCannotUse(Stage, "visible", true);
        egret.$markCannotUse(Stage, "x", 0);
        egret.$markCannotUse(Stage, "y", 0);
        egret.$markCannotUse(Stage, "scaleX", 1);
        egret.$markCannotUse(Stage, "scaleY", 1);
        egret.$markCannotUse(Stage, "rotation", 0);
        egret.$markCannotUse(Stage, "cacheAsBitmap", false);
        egret.$markCannotUse(Stage, "scrollRect", null);
        egret.$markCannotUse(Stage, "filters", null);
        egret.$markCannotUse(Stage, "blendMode", null);
        egret.$markCannotUse(Stage, "touchEnabled", true);
        egret.$markCannotUse(Stage, "matrix", null);
    }
    if (DEBUG) {
        egret.$markReadOnly(Stage, "stageWidth");
        egret.$markReadOnly(Stage, "stageHeight");
    }
}