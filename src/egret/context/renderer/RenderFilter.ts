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
     * @classdesc
     * @extends egret.HashObject
     * @private
     */
    export class RenderFilter extends HashObject {

        public constructor() {
            super();
            this._drawAreaList = [];
        }

        private static instance:RenderFilter;

        /**
         * @method egret.egret.getInstance
         * @returns {RenderFilter}
         */
        public static getInstance():RenderFilter {
            if (RenderFilter.instance == null) {
                RenderFilter.instance = new RenderFilter();
            }
            return RenderFilter.instance;
        }

        public _drawAreaList:Array<Rectangle>;
        private _defaultDrawAreaList:Array<Rectangle>
        private _originalData:any = {};

        /**
         * @method egret.egret#addDrawArea
         * @param area {egret.Rectangle}
         */
        public addDrawArea(area:egret.Rectangle):void {
            this._drawAreaList.push(area);
        }

        /**
         * @method egret.egret#clearDrawArea
         */
        public clearDrawArea():void {
            this._drawAreaList = [];
        }

        private static identityRectangle:Rectangle = new Rectangle();

        /**
         * 先检查有没有不需要绘制的区域，再把需要绘制的区域绘制出来
         * @method egret.egret#drawImage
         * @param renderContext {any}
         * @param data {RenderData}
         * @param sourceX {number}
         * @param sourceY {number}
         * @param sourceWidth {number}
         * @param sourceHeight {number}
         * @param destX {number}
         * @param destY {number}
         * @param destWidth {number}
         * @param destHeight {number}
         */
        public drawImage(renderContext:RendererContext, data:RenderData, sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number, destX:number, destY:number, destWidth:number, destHeight:number,repeat=undefined):void {
            destX = destX || 0;
            destY = destY || 0;
            var locTexture = data._texture_to_render;
            if (locTexture == null || sourceHeight == 0 || sourceWidth == 0 || destWidth == 0 || destHeight == 0) {
                return;
            }
            var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
            sourceWidth = sourceWidth / texture_scale_factor;
            sourceHeight = sourceHeight / texture_scale_factor;
            if (this._drawAreaList.length == 0 || !MainContext.instance.rendererContext["_cacheCanvasContext"]) {
                renderContext.drawImage(locTexture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight,repeat);
                return;
            }

            //计算worldBounds
            var bounds:egret.Rectangle = DisplayObject.getTransformBounds(data._getSize(RenderFilter.identityRectangle), data._worldTransform);
            data._worldBounds.initialize(bounds.x, bounds.y, bounds.width, bounds.height);

            var originalData = this._originalData;
            originalData.sourceX = sourceX;
            originalData.sourceY = sourceY;
            originalData.sourceWidth = sourceWidth;
            originalData.sourceHeight = sourceHeight;
            originalData.destX = destX;
            originalData.destY = destY;
            originalData.destWidth = destWidth;
            originalData.destHeight = destHeight;

            var locDrawAreaList = this.getDrawAreaList();
            for (var j:number = 0; j < locDrawAreaList.length; j++) {
                var drawArea:egret.Rectangle = locDrawAreaList[j];
                if (this.ignoreRender(data, drawArea, originalData.destX, originalData.destY)) {
                    continue;
                }

                //在设置过重绘区域时算出不需要绘制的区域
//                if (this._drawAreaList.length != 0) {
//                    //不能允许有旋转和斜切的显示对象跨过重绘区域
//                    if (data._worldTransform.b != 0 || data._worldTransform.c != 0) {
//                        //之前已经判断过是否出了重绘区域了
//                        if (data._worldBounds.x + originalData.destX < drawArea.x
//                            || data._worldBounds.y + originalData.destY < drawArea.y
//                            || data._worldBounds.x + data._worldBounds.width + originalData.destX > drawArea.x + drawArea.width
//                            || data._worldBounds.y + data._worldBounds.height + originalData.destY > drawArea.y + drawArea.height) {
//                            egret.Logger.fatal("请不要让带有旋转和斜切的显示对象跨过重绘区域");
//                            return;
//                        }
//                    }
//                    else {
//                        //因为有旋转和斜切时候不允许跨过重绘区域，所以缩放属性可以直接这么取
//                        var scaleX = data._worldTransform.a;
//                        var scaleY = data._worldTransform.d;
//                        var offset;
//                        if (data._worldBounds.x + originalData.destX < drawArea.x) {
//                            offset = (drawArea.x - data._worldBounds.x) / scaleX - originalData.destX;
//                            sourceX += offset / (destWidth / sourceWidth);
//                            sourceWidth -= offset / (destWidth / sourceWidth);
//                            destWidth -= offset;
//                            destX += offset;
//                        }
//                        if (data._worldBounds.y + originalData.destY < drawArea.y) {
//                            offset = (drawArea.y - data._worldBounds.y) / scaleY - originalData.destY;
//                            sourceY += offset / (destHeight / sourceHeight);
//                            sourceHeight -= offset / (destHeight / sourceHeight);
//                            destHeight -= offset;
//                            destY += offset;
//                        }
//                        if (data._worldBounds.x + data._worldBounds.width + originalData.destX > drawArea.x + drawArea.width) {
//                            offset = (data._worldBounds.x + data._worldBounds.width - drawArea.x - drawArea.width) / scaleX + originalData.destX;
//                            sourceWidth -= offset / (destWidth / sourceWidth);
//                            destWidth -= offset;
//                        }
//                        if (data._worldBounds.y + data._worldBounds.height + originalData.destY > drawArea.y + drawArea.height) {
//                            offset = (data._worldBounds.y + data._worldBounds.height - drawArea.y - drawArea.height) / scaleY + originalData.destY;
//                            sourceHeight -= offset / (destHeight / sourceHeight);
//                            destHeight -= offset;
//                        }
//                    }
//                }

                renderContext.drawImage(locTexture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat);

                //测试代码，把画出来的区域用红框标出来
//                renderContext.strokeRect(destX, destY, destWidth, destHeight, "#ff0000");
                break;
            }
        }

        private ignoreRender(data:RenderData, rect:egret.Rectangle, destX:number, destY:number):boolean {
            var bounds = data._worldBounds;
            var destX = destX * data._worldTransform.a;
            var destY = destY * data._worldTransform.d;
            if (bounds.x + bounds.width + destX <= rect.x || bounds.x + destX >= rect.x + rect.width
                || bounds.y + bounds.height + destY <= rect.y || bounds.y + destY >= rect.y + rect.height) {
                return true;
            }
            return false;
        }

        /**
         * @method egret.egret#getDrawAreaList
         * @returns {Rectangle}
         */
        public getDrawAreaList():Array<Rectangle> {
            var locDrawAreaList;
            //默认整个舞台都是重绘区域
            if (this._drawAreaList.length == 0) {
                if (!this._defaultDrawAreaList) {
                    this._defaultDrawAreaList = [new egret.Rectangle(0, 0,
                        egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight)];
                    egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
                }
                locDrawAreaList = this._defaultDrawAreaList;
            }
            else {
                locDrawAreaList = this._drawAreaList;
            }
            return locDrawAreaList;
        }

        /**
         * 改变尺寸时使用
         */
        private onResize():void{
            egret.MainContext.instance.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this._defaultDrawAreaList = null;
        }
    }

    /**
     * 用于显示对象的接口定义，开发者不需要用到该类
     */
    export interface RenderData {
        /**
         * @member egret.RenderData#_worldTransform
         */
            _worldTransform:egret.Matrix;
        /**
         * @member egret.RenderData#_worldBounds
         */
            _worldBounds:egret.Rectangle;
        _texture_to_render:egret.Texture;
        _getSize(resultRect:Rectangle):egret.Rectangle;
    }
}