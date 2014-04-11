/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/// <reference path="../geom/Rectangle.ts"/>
/// <reference path="../geom/Matrix.ts"/>

module ns_egret {
    export class RenderFilter {
        private static instance:RenderFilter;

        public static getInstance():RenderFilter {
            if (RenderFilter.instance == null) {
                RenderFilter.instance = new RenderFilter();
            }
            return RenderFilter.instance;
        }

        public _drawAreaList:Array = [];
        private _defaultDrawAreaList:Array;

        public addDrawArea(area:ns_egret.Rectangle):void {
            this._drawAreaList.push(area);
        }

        public clearDrawArea():void {
            this._drawAreaList = [];
        }

        /**
         * 先检查有没有不需要绘制的区域，再把需要绘制的区域绘制出来
         */
        public drawImage(renderContext, data:RenderData, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight):void {
            var locTexture = data.renderTexture || data.texture;
            if (locTexture == null || locTexture._bitmapData == null) {
                return;
            }
            var originalData = {sourceX: sourceX, sourceY: sourceY, sourceWidth: sourceWidth, sourceHeight: sourceHeight,
                destX: destX, destY: destY, destWidth: destWidth, destHeight: destHeight};

            var locDrawAreaList = this.getDrawAreaList();
            for (var j:number = 0; j < locDrawAreaList.length; j++) {
                var drawArea:ns_egret.Rectangle = locDrawAreaList[j];
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
                            ns_egret.Logger.fatal("请不要让带有旋转和斜切的显示对象跨过重绘区域");
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

                sourceX = originalData.sourceX;
                sourceY = originalData.sourceY;
                sourceWidth = originalData.sourceWidth;
                sourceHeight = originalData.sourceHeight;
                destX = originalData.destX;
                destY = originalData.destY;
                destWidth = originalData.destWidth;
                destHeight = originalData.destHeight;
            }
        }

        private ignoreRender(data:RenderData, rect:ns_egret.Rectangle, destX, destY):Boolean {
            var bounds = data.worldBounds;
            var destX = destX * data.worldTransform.a;
            var destY = destY * data.worldTransform.d;
            if (bounds.x + bounds.width + destX <= rect.x || bounds.x + destX >= rect.x + rect.width
                || bounds.y + bounds.height + destY <= rect.y || bounds.y + destY >= rect.y + rect.height) {
                return true;
            }
            return false;
        }

        public getDrawAreaList():Array {
            var locDrawAreaList;
            //默认整个舞台都是重绘区域
            if (this._drawAreaList.length == 0) {
                if (!this._defaultDrawAreaList) {
                    this._defaultDrawAreaList = [new ns_egret.Rectangle(0, 0,
                        ns_egret.MainContext.instance.stage.stageWidth, ns_egret.MainContext.instance.stage.stageHeight)];
                }
                locDrawAreaList = this._defaultDrawAreaList;
            }
            else {
                locDrawAreaList = this._drawAreaList;
            }
            return locDrawAreaList;
        }
    }

    export interface RenderData {
        worldTransform:ns_egret.Matrix;
        worldBounds:ns_egret.Rectangle;
        texture:ns_egret.Texture;
        renderTexture;
    }
}