/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {
    
    /**
     * @class egret.Stage
     * @classdesc Stage 类代表主绘图区。
     */
    export class Stage extends DisplayObjectContainer {


        public static _invalidateRenderFlag:boolean = false;

        /**
         * 调用 invalidate() 方法后，在显示列表下次呈现时，Egret 会向每个已注册侦听 render 事件的显示对象发送一个 render 事件。
         * 每次您希望 Egret 发送 render 事件时，都必须调用 invalidate() 方法。
         * @method egret.Stage#invalidate
         */
        public invalidate():void {
            Stage._invalidateRenderFlag = true;
        }

        public constructor(width:number = 480, height:number = 800) {
            super();
            this.touchEnabled = true;
            this._stage = this;
            this._stageWidth = width;
            this._stageHeight = height;

        }

        /**
         * @member {number} egret.Stage#scaleMode
         * 一个 StageScaleMode 类中指定要使用哪种缩放模式的值。以下是有效值：
         * StageScaleMode.EXACT_FIT -- 整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲，应用程序可能会拉伸或压缩显示。
         * StageScaleMode.SHOW_ALL -- 整个应用程序在指定区域中可见，且不发生扭曲，同时保持应用程序的原始高宽比。应用程序的可能会显示边框。
         * StageScaleMode.NO_BORDER -- 整个应用程序填满指定区域，不发生扭曲，但有可能进行一些裁切，同时保持应用程序的原始高宽比。
         * StageScaleMode.NO_SCALE -- 整个应用程序的大小固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
         */
        private _scaleMode:string;

        public get scaleMode():string{
            return this._scaleMode;
        }

        public set scaleMode(value:string){
            if (this._scaleMode != value){
                this._scaleMode = value;

               var  scaleModeEnum = {};
                scaleModeEnum[StageScaleMode.NO_SCALE] = new NoScale();
                scaleModeEnum[StageScaleMode.SHOW_ALL] = new ShowAll();
                scaleModeEnum[StageScaleMode.NO_BORDER] = new FixedWidth();
                scaleModeEnum[StageScaleMode.EXACT_FIT] = new FullScreen();
                var content = scaleModeEnum[value];
                if (!content){
                    throw new Error("使用了尚未实现的ScaleMode");
                }
                var container = new egret.EqualToFrame();
                var policy = new egret.ResolutionPolicy(container, content);
                egret.StageDelegate.getInstance()._setResolutionPolicy(policy);
                this._stageWidth = egret.StageDelegate.getInstance()._stageWidth;
                this._stageHeight = egret.StageDelegate.getInstance()._stageHeight;
                this.dispatchEventWith(Event.RESIZE);
            }
        }

        private _stageWidth:number;
        /**
         * @member {number} egret.Stage#stageWidth
         * 舞台宽度（坐标系宽度，非设备宽度）
         */
        public get stageWidth():number {
            return this._stageWidth;
        }

        private _stageHeight:number;
        /**
         * @member {number} egret.Stage#stageHeight
         * 舞台高度（坐标系高度，非设备高度）
         */
        public get stageHeight():number {
            return this._stageHeight;
        }

        /**
         * @member egret.Stage#hitTest
         * @see egret.DisplayObject#hitTest
         * @param x
         * @param y
         * @returns {egret.DisplayObject}
         */
        public hitTest(x, y, ignoreTouchEnabled:boolean = false):DisplayObject {
            if (!this._touchEnabled) {
                return null;
            }
            var result:DisplayObject;
            if (!this._touchChildren) {
                return this;
            }
            var children = this._children;
            var l = children.length;
            for (var i = l - 1; i >= 0; i--) {
                var child = children[i];
                var mtx = child._getMatrix();
                var scrollRect = child._scrollRect;
                if (scrollRect) {
                    mtx.append(1, 0, 0, 1, -scrollRect.x, -scrollRect.y);
                }
                mtx.invert();
                var point = Matrix.transformCoords(mtx, x, y);
                result = child.hitTest(point.x, point.y, true);
                if (result) {
                    if (result._touchEnabled) {
                        return result;
                    }
                }
            }
            return this;
        }

        /**
         * 返回舞台尺寸范围
         * @member egret.Stage#getBounds
         * @see egret.DisplayObject#getBounds
         * @param resultRect {egret.Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         * @returns {egret.Rectangle}
         */
        public getBounds(resultRect?:Rectangle):Rectangle {
            if (!resultRect) {
                resultRect = new Rectangle();
            }
            return resultRect.initialize(0, 0, this._stageWidth, this._stageHeight);
        }

        public _updateTransform():void {
            for (var i = 0 , length = this._children.length; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child._updateTransform();
            }
        }

    }
}