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

/// <reference path="../MainContext.ts"/>
/// <reference path="RendererContext.ts"/>
/// <reference path="../../display/Texture.ts"/>
/// <reference path="../../geom/Matrix.ts"/>
/// <reference path="../../geom/Rectangle.ts"/>
/// <reference path="../../utils/HashObject.ts"/>
/// <reference path="../../utils/Logger.ts"/>

module egret {
    /**
     * @class egret.RenderFilter
     * @classdesc
     * @extends egret.HashObject
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

        /**
         * 先检查有没有不需要绘制的区域，再把需要绘制的区域绘制出来
         * @method egret.egret#drawImage
         * @param renderContext {any}
         * @param data {RenderData}
         * @param sourceX {any}
         * @param sourceY {any}
         * @param sourceWidth {any}
         * @param sourceHeight {any}
         * @param destX {any}
         * @param destY {any}
         * @param destWidth {any}
         * @param destHeight {any}
         */
        public drawImage(renderContext:RendererContext, data:RenderData, sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number, destX:number, destY:number, destWidth:number, destHeight:number):void {
            destX = destX || 0;
            destY = destY || 0;
            var locTexture = data._texture_to_render;
            if (locTexture == null || sourceHeight == 0 || sourceWidth == 0 || destWidth == 0 || destHeight == 0) {
                return;
            }
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
                if (this._drawAreaList.length != 0) {
                    //不能允许有旋转和斜切的显示对象跨过重绘区域
                    if (data.worldTransform.b != 0 || data.worldTransform.c != 0) {
                        //之前已经判断过是否出了重绘区域了
                        if (data.worldBounds.x + originalData.destX < drawArea.x
                            || data.worldBounds.y + originalData.destY < drawArea.y
                            || data.worldBounds.x + data.worldBounds.width + originalData.destX > drawArea.x + drawArea.width
                            || data.worldBounds.y + data.worldBounds.height + originalData.destY > drawArea.y + drawArea.height) {
                            egret.Logger.fatal("请不要让带有旋转和斜切的显示对象跨过重绘区域");
                            return;
                        }
                    }
                    else {
                        //因为有旋转和斜切时候不允许跨过重绘区域，所以缩放属性可以直接这么取
                        var scaleX = data.worldTransform.a;
                        var scaleY = data.worldTransform.d;
                        var offset;
                        if (data.worldBounds.x + originalData.destX < drawArea.x) {
                            offset = (drawArea.x - data.worldBounds.x) / scaleX - originalData.destX;
                            sourceX += offset / (destWidth / sourceWidth);
                            sourceWidth -= offset / (destWidth / sourceWidth);
                            destWidth -= offset;
                            destX += offset;
                        }
                        if (data.worldBounds.y + originalData.destY < drawArea.y) {
                            offset = (drawArea.y - data.worldBounds.y) / scaleY - originalData.destY;
                            sourceY += offset / (destHeight / sourceHeight);
                            sourceHeight -= offset / (destHeight / sourceHeight);
                            destHeight -= offset;
                            destY += offset;
                        }
                        if (data.worldBounds.x + data.worldBounds.width + originalData.destX > drawArea.x + drawArea.width) {
                            offset = (data.worldBounds.x + data.worldBounds.width - drawArea.x - drawArea.width) / scaleX + originalData.destX;
                            sourceWidth -= offset / (destWidth / sourceWidth);
                            destWidth -= offset;
                        }
                        if (data.worldBounds.y + data.worldBounds.height + originalData.destY > drawArea.y + drawArea.height) {
                            offset = (data.worldBounds.y + data.worldBounds.height - drawArea.y - drawArea.height) / scaleY + originalData.destY;
                            sourceHeight -= offset / (destHeight / sourceHeight);
                            destHeight -= offset;
                        }
                    }
                }

                renderContext.drawImage(locTexture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

                //测试代码，把画出来的区域用红框标出来
//                renderContext.strokeRect(destX, destY, destWidth, destHeight, "#ff0000");

            }
        }

        private ignoreRender(data:RenderData, rect:egret.Rectangle, destX:number, destY:number):boolean {
            var bounds = data.worldBounds;
            var destX = destX * data.worldTransform.a;
            var destY = destY * data.worldTransform.d;
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
                }
                locDrawAreaList = this._defaultDrawAreaList;
            }
            else {
                locDrawAreaList = this._drawAreaList;
            }
            return locDrawAreaList;
        }
    }

    /**
     * @class egret.RenderData
     * @interface
     * @classdesc
     */
    export interface RenderData {
        /**
         * @member egret.RenderData#worldTransform
         */
            worldTransform:egret.Matrix;
        /**
         * @member egret.RenderData#worldBounds
         */
            worldBounds:egret.Rectangle;
        _texture_to_render:egret.Texture;
    }
}