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

module egret.sys {



    /**
     * @private
     * 位图渲染节点
     */
    export class BitmapNode extends RenderNode {

        public constructor() {
            super();
            this.type = RenderNodeType.BitmapNode;
        }
        /**
         * 要绘制的位图
         */
        public image: BitmapData = null;
        /**
         * 控制在缩放时是否对位图进行平滑处理。
         */
        public smoothing: boolean = true;
        /**
         * 相对偏移矩阵。
         */
        public matrix: egret.Matrix;
        /**
         * 图片宽度。WebGL渲染使用
         */
        public imageWidth: number;
        /**
         * 图片高度。WebGL渲染使用
         */
        public imageHeight: number;
        /**
         * 使用的混合模式
         */
        public blendMode: number = null;
        /**
         * 绘制一次位图
         */
        public drawImage(sourceX: number, sourceY: number, sourceW: number, sourceH: number,
            drawX: number, drawY: number, drawW: number, drawH: number): void {
            this.drawData.push(sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
            this.renderCount++;
        }

        /**
         * 在显示对象的$render()方法被调用前，自动清空自身的drawData数据。
         */
        public cleanBeforeRender(): void {
            super.cleanBeforeRender();
            this.image = null;
            this.matrix = null;
        }


        static $updateTextureData(node: sys.BitmapNode, image: any,
            bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number,
            textureWidth: number, textureHeight: number, destW: number, destH: number, sourceWidth: number, sourceHeight: number,
            scale9Grid: egret.Rectangle, fillMode: string, smoothing: boolean): void {
            if (!image) {
                return;
            }
            var scale = $TextureScaleFactor;
            node.smoothing = smoothing;
            node.image = image;
            node.imageWidth = sourceWidth;
            node.imageHeight = sourceHeight;
            if (scale9Grid) {
                BitmapNode.$updateTextureDataWithScale9Grid(node, scale9Grid,
                    bitmapX, bitmapY, bitmapWidth,
                    bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH);
            }
            else if (fillMode == egret.BitmapFillMode.SCALE) {
                var tsX: number = destW / textureWidth;
                var tsY: number = destH / textureHeight;
                node.drawImage(bitmapX, bitmapY,
                    bitmapWidth, bitmapHeight, offsetX * tsX, offsetY * tsY, tsX * bitmapWidth, tsY * bitmapHeight);
            }
            else if (fillMode == egret.BitmapFillMode.CLIP) {
                var displayW: number = Math.min(textureWidth, destW);
                var displayH: number = Math.min(textureHeight, destH);
                var scaledBitmapW = bitmapWidth * scale;
                var scaledBitmapH = bitmapHeight * scale;
                BitmapNode.drawClipImage(node, scale, bitmapX, bitmapY, scaledBitmapW, scaledBitmapH,
                    offsetX, offsetY, displayW, displayH);
            }
            else {
                var scaledBitmapW = bitmapWidth * scale;
                var scaledBitmapH = bitmapHeight * scale;
                for (var startX = 0; startX < destW; startX += textureWidth) {
                    for (var startY = 0; startY < destH; startY += textureHeight) {
                        var displayW = Math.min(destW - startX, textureWidth);
                        var displayH = Math.min(destH - startY, textureHeight);
                        BitmapNode.drawClipImage(node, scale, bitmapX, bitmapY, scaledBitmapW, scaledBitmapH,
                            offsetX, offsetY, displayW, displayH, startX, startY);
                    }
                }

            }
        }


        /**
         * @private
         * 绘制九宫格位图
         */
        private static $updateTextureDataWithScale9Grid(node: sys.BitmapNode, scale9Grid: egret.Rectangle, bitmapX: number, bitmapY: number,
            bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number,
            textureWidth: number, textureHeight: number, destW: number, destH: number): void {
            var imageWidth: number = bitmapWidth;
            var imageHeight: number = bitmapHeight;

            destW = destW - (textureWidth - bitmapWidth * $TextureScaleFactor);
            destH = destH - (textureHeight - bitmapHeight * $TextureScaleFactor);


            var targetW0 = scale9Grid.x - offsetX;
            var targetH0 = scale9Grid.y - offsetY;

            var sourceW0 = targetW0 / $TextureScaleFactor;
            var sourceH0 = targetH0 / $TextureScaleFactor;
            var sourceW1 = scale9Grid.width / $TextureScaleFactor;
            var sourceH1 = scale9Grid.height / $TextureScaleFactor;


            //防止空心的情况出现。
            if (sourceH1 == 0) {
                sourceH1 = 1;
                if (sourceH0 >= imageHeight) {
                    sourceH0--;
                }
            }
            if (sourceW1 == 0) {
                sourceW1 = 1;
                if (sourceW0 >= imageWidth) {
                    sourceW0--;
                }
            }
            var sourceX0 = bitmapX;
            var sourceX1 = sourceX0 + sourceW0;
            var sourceX2 = sourceX1 + sourceW1;
            var sourceW2 = imageWidth - sourceW0 - sourceW1;

            var sourceY0 = bitmapY;
            var sourceY1 = sourceY0 + sourceH0;
            var sourceY2 = sourceY1 + sourceH1;
            var sourceH2 = imageHeight - sourceH0 - sourceH1;

            var targetW2 = sourceW2 * $TextureScaleFactor;
            var targetH2 = sourceH2 * $TextureScaleFactor;

            if ((sourceW0 + sourceW2) * $TextureScaleFactor > destW || (sourceH0 + sourceH2) * $TextureScaleFactor > destH) {
                node.drawImage(bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, destW, destH);
                return;
            }

            var targetX0 = offsetX;
            var targetX1 = targetX0 + targetW0;
            var targetX2 = targetX0 + (destW - targetW2);
            var targetW1 = destW - targetW0 - targetW2;

            var targetY0 = offsetY;
            var targetY1 = targetY0 + targetH0;
            var targetY2 = targetY0 + destH - targetH2;
            var targetH1 = destH - targetH0 - targetH2;

            //
            //             x0     x1     x2
            //          y0 +------+------+------+
            //             |      |      |      | h0
            //             |      |      |      |
            //          y1 +------+------+------+
            //             |      |      |      | h1
            //             |      |      |      |
            //          y2 +------+------+------+
            //             |      |      |      | h2
            //             |      |      |      |
            //             +------+------+------+
            //                w0     w1     w2
            //
            if (sourceH0 > 0) {
                if (sourceW0 > 0) node.drawImage(sourceX0, sourceY0, sourceW0, sourceH0, targetX0, targetY0, targetW0, targetH0);
                if (sourceW1 > 0) node.drawImage(sourceX1, sourceY0, sourceW1, sourceH0, targetX1, targetY0, targetW1, targetH0);
                if (sourceW2 > 0) node.drawImage(sourceX2, sourceY0, sourceW2, sourceH0, targetX2, targetY0, targetW2, targetH0);
            }
            if (sourceH1 > 0) {
                if (sourceW0 > 0) node.drawImage(sourceX0, sourceY1, sourceW0, sourceH1, targetX0, targetY1, targetW0, targetH1);
                if (sourceW1 > 0) node.drawImage(sourceX1, sourceY1, sourceW1, sourceH1, targetX1, targetY1, targetW1, targetH1);
                if (sourceW2 > 0) node.drawImage(sourceX2, sourceY1, sourceW2, sourceH1, targetX2, targetY1, targetW2, targetH1);
            }
            if (sourceH2 > 0) {
                if (sourceW0 > 0) node.drawImage(sourceX0, sourceY2, sourceW0, sourceH2, targetX0, targetY2, targetW0, targetH2);
                if (sourceW1 > 0) node.drawImage(sourceX1, sourceY2, sourceW1, sourceH2, targetX1, targetY2, targetW1, targetH2);
                if (sourceW2 > 0) node.drawImage(sourceX2, sourceY2, sourceW2, sourceH2, targetX2, targetY2, targetW2, targetH2);
            }
        }


        /**
  * @private
  */
        private static drawClipImage(node: sys.BitmapNode, scale: number, bitmapX: number, bitmapY: number, scaledBitmapW: number,
            scaledBitmapH: number, offsetX: number, offsetY: number, destW: number, destH: number,
            startX: number = 0, startY: number = 0): void {
            var offset = offsetX + scaledBitmapW - destW;
            if (offset > 0) {
                scaledBitmapW -= offset;
            }
            offset = offsetY + scaledBitmapH - destH;
            if (offset > 0) {
                scaledBitmapH -= offset;
            }
            node.drawImage(bitmapX, bitmapY,
                scaledBitmapW / scale, scaledBitmapH / scale, startX + offsetX, startY + offsetY, scaledBitmapW, scaledBitmapH);
        }
    }
}