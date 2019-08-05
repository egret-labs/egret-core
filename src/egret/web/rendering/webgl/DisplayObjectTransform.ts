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

const useDisplayObjectTransform: boolean = false;

namespace egret.web {

    export class DisplayObjectTransform {
        //
        public static checkData(displayObject: DisplayObject, buffer: WebGLRenderBuffer): boolean {
            if (!useDisplayObjectTransform) {
                return true;
            }
            const _textureTransform = displayObject.textureTransform;
            if (!NumberUtils.matrixEqual(_textureTransform._matrix, buffer.globalMatrix)) {
                console.error('WebGLRendererTransform checkData matrixEqual');
                return false;
            }
            if (!NumberUtils.fequal(_textureTransform._offsetX, buffer.$offsetX)
                || !NumberUtils.fequal(_textureTransform._offsetY, buffer.$offsetY)) {
                console.error('WebGLRendererTransform checkData offset');
                return false;
            }
            return true;
        }

        //
        public static transformDisplayObject(displayObject: DisplayObject, buffer: WebGLRenderBuffer, offsetX: number, offsetY: number): void {
            if (!useDisplayObjectTransform) {
                return;
            }
            const node = displayObject.$getRenderNode();
            if (node) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                switch (node.type) {
                    case sys.RenderNodeType.BitmapNode:
                        DisplayObjectTransform.transformAtlasBitmap(displayObject, <sys.BitmapNode>node, buffer);
                        break;
                    case sys.RenderNodeType.TextNode:
                        DisplayObjectTransform.transformText(displayObject, <sys.TextNode>node, buffer);
                        break;
                    case sys.RenderNodeType.GraphicsNode:
                        DisplayObjectTransform.transformGraphics(displayObject, <sys.GraphicsNode>node, buffer);
                        break;
                    case sys.RenderNodeType.GroupNode:
                        //this.renderGroup(<sys.GroupNode>node, buffer);
                        break;
                    case sys.RenderNodeType.MeshNode:
                        //this.renderMesh(<sys.MeshNode>node, buffer);
                        break;
                    case sys.RenderNodeType.NormalBitmapNode:
                        DisplayObjectTransform.transformNormalBitmap(displayObject, <sys.NormalBitmapNode>node, buffer);
                        break;
                }
                buffer.$offsetX = 0;
                buffer.$offsetY = 0;
            }
            const children = displayObject.$children;
            if (children) {
                if (displayObject.sortableChildren && displayObject.$sortDirty) {
                    //绘制排序
                    displayObject.sortChildren();
                }
                const length = children.length;
                let child: DisplayObject;
                let offsetX2 = 0;
                let offsetY2 = 0;
                for (let i = 0; i < length; ++i) {
                    child = children[i];
                    let savedMatrix: Matrix;
                    if (child.$useTranslate) {
                        const m = child.$getMatrix();
                        offsetX2 = offsetX + child.$x;
                        offsetY2 = offsetY + child.$y;
                        const m2 = buffer.globalMatrix;
                        savedMatrix = Matrix.create();
                        savedMatrix.a = m2.a;
                        savedMatrix.b = m2.b;
                        savedMatrix.c = m2.c;
                        savedMatrix.d = m2.d;
                        savedMatrix.tx = m2.tx;
                        savedMatrix.ty = m2.ty;
                        buffer.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                        offsetX2 = -child.$anchorOffsetX;
                        offsetY2 = -child.$anchorOffsetY;
                    }
                    else {
                        offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                        offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                    }
                    //
                    const _worldTransform = displayObject._worldTransform;
                    _worldTransform._offsetX = offsetX2;
                    _worldTransform._offsetY = offsetY2;
                    //
                    const _matrix = _worldTransform._matrix;
                    const globalMatrix = buffer.globalMatrix;
                    _matrix.a = globalMatrix.a;
                    _matrix.b = globalMatrix.b;
                    _matrix.c = globalMatrix.c;
                    _matrix.d = globalMatrix.d;
                    _matrix.tx = globalMatrix.tx;
                    _matrix.ty = globalMatrix.ty;
                    //
                    switch (child.$renderMode) {
                        case RenderMode.NONE:
                            break;
                        case RenderMode.FILTER:
                        case RenderMode.CLIP:
                            break;
                        case RenderMode.SCROLLRECT:
                            //drawCalls += this.drawDisplayObjectAdvanced(child, buffer, offsetX2, offsetY2);
                            break;
                        default:
                            //drawCalls += this.drawDisplayObject(child, buffer, offsetX2, offsetY2);
                            DisplayObjectTransform.transformDisplayObject(child, buffer, offsetX2, offsetY2);
                            break;
                    }
                    if (savedMatrix) {
                        const m = buffer.globalMatrix;
                        m.a = savedMatrix.a;
                        m.b = savedMatrix.b;
                        m.c = savedMatrix.c;
                        m.d = savedMatrix.d;
                        m.tx = savedMatrix.tx;
                        m.ty = savedMatrix.ty;
                        Matrix.release(savedMatrix);
                    }
                }
            }
        }

        private static _transformImage_(_textureTransform: Transform, image: BitmapData, buffer: WebGLRenderBuffer, destHeight: number, destY: number): void {
            // const image = node.image;
            // if (!image) {
            //     return;
            // }
            let offsetX = 0;
            let offsetY = 0;
            // const destHeight = node.drawH;
            // const destY = node.drawY;
            if (image["texture"] || (image.source && image.source["texture"])) {
                buffer.saveTransform();
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2); // 翻转
            }
            //
            //const _textureTransform = displayObject._textureTransform;
            _textureTransform._offsetX = buffer.$offsetX;
            _textureTransform._offsetY = buffer.$offsetY;
            const _matrix = _textureTransform._matrix;
            const globalMatrix = buffer.globalMatrix;
            _matrix.a = globalMatrix.a;
            _matrix.b = globalMatrix.b;
            _matrix.c = globalMatrix.c;
            _matrix.d = globalMatrix.d;
            _matrix.tx = globalMatrix.tx;
            _matrix.ty = globalMatrix.ty;
            //
            if (image.source && image.source["texture"]) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                buffer.restoreTransform();
            }

        }

        private static transformNormalBitmap(displayObject: DisplayObject, node: sys.NormalBitmapNode, buffer: WebGLRenderBuffer): void {

            // const image = node.image;
            // if (!image) {
            //     return;
            // }
            // let offsetX = 0;
            // let offsetY = 0;
            // const destHeight = node.drawH;
            // const destY = node.drawY;


            DisplayObjectTransform._transformImage_(displayObject.textureTransform, node.image, buffer, node.drawH, node.drawY);
            /*
            const image = node.image;
            if (!image) {
                return;
            }
            let offsetX = 0;
            let offsetY = 0;
            const destHeight = node.drawH;
            const destY = node.drawY;
            if (image["texture"] || (image.source && image.source["texture"])) {
                buffer.saveTransform();
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2); // 翻转
            }
            //
            const _textureTransform = displayObject._textureTransform;
            _textureTransform._offsetX = buffer.$offsetX;
            _textureTransform._offsetY = buffer.$offsetY;
            const _matrix = _textureTransform._matrix;
            const globalMatrix = buffer.globalMatrix;
            _matrix.a = globalMatrix.a;
            _matrix.b = globalMatrix.b;
            _matrix.c = globalMatrix.c;
            _matrix.d = globalMatrix.d;
            _matrix.tx = globalMatrix.tx;
            _matrix.ty = globalMatrix.ty;
            //
            if (image.source && image.source["texture"]) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                buffer.restoreTransform();
            }
            */
        }

        private static transformText(displayObject: DisplayObject, node: sys.TextNode, buffer: WebGLRenderBuffer): void {
            let width = node.width - node.x;
            let height = node.height - node.y;
            if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                return;
            }
            let canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
            let canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
            const maxTextureSize = buffer.context.$maxTextureSize;
            if (width * canvasScaleX > maxTextureSize) {
                canvasScaleX *= maxTextureSize / (width * canvasScaleX);
            }
            if (height * canvasScaleY > maxTextureSize) {
                canvasScaleY *= maxTextureSize / (height * canvasScaleY);
            }
            width *= canvasScaleX;
            height *= canvasScaleY;
            const x = node.x * canvasScaleX;
            const y = node.y * canvasScaleY;
            if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                node.$canvasScaleX = canvasScaleX;
                node.$canvasScaleY = canvasScaleY;
            }
            if (canvasScaleX !== 1 || canvasScaleY !== 1) {
            }
            if (x || y) {
                buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
            }
            //
            const _textureTransform = displayObject.textureTransform;
            _textureTransform._offsetX = buffer.$offsetX;
            _textureTransform._offsetY = buffer.$offsetY;
            const _matrix = _textureTransform._matrix;
            const globalMatrix = buffer.globalMatrix;
            _matrix.a = globalMatrix.a;
            _matrix.b = globalMatrix.b;
            _matrix.c = globalMatrix.c;
            _matrix.d = globalMatrix.d;
            _matrix.tx = globalMatrix.tx;
            _matrix.ty = globalMatrix.ty;
            //
            if (x || y) {
                buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
            }
        }

        private static transformGraphics(displayObject: DisplayObject, node: sys.GraphicsNode, buffer: WebGLRenderBuffer): void {
            let width = node.width;
            let height = node.height;
            if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                return;
            }
            let canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
            let canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
            if (width * canvasScaleX < 1 || height * canvasScaleY < 1) {
                canvasScaleX = canvasScaleY = 1;
            }
            if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                node.$canvasScaleX = canvasScaleX;
                node.$canvasScaleY = canvasScaleY;
            }
            width = width * canvasScaleX;
            height = height * canvasScaleY;
            let width2 = Math.ceil(width);
            let height2 = Math.ceil(height);
            canvasScaleX *= width2 / width;
            canvasScaleY *= height2 / height;
            width = width2;
            height = height2;
            if (canvasScaleX !== 1 || canvasScaleY !== 1) {
            }
            if (node.x || node.y) {
                buffer.transform(1, 0, 0, 1, node.x, node.y);
            }
            ///
            const _textureTransform = displayObject.textureTransform;
            _textureTransform._offsetX = buffer.$offsetX;
            _textureTransform._offsetY = buffer.$offsetY;
            const _matrix = _textureTransform._matrix;
            const globalMatrix = buffer.globalMatrix;
            _matrix.a = globalMatrix.a;
            _matrix.b = globalMatrix.b;
            _matrix.c = globalMatrix.c;
            _matrix.d = globalMatrix.d;
            _matrix.tx = globalMatrix.tx;
            _matrix.ty = globalMatrix.ty;
            ///
            if (node.x || node.y) {
                buffer.transform(1, 0, 0, 1, -node.x, -node.y);
            }
        }

        private static transformAtlasBitmap(displayObject: DisplayObject, node: sys.BitmapNode, buffer: WebGLRenderBuffer): void {
            const image = node.image;
            if (!image) {
                return;
            }
            //buffer.imageSmoothingEnabled = node.smoothing;
            const data = node.drawData;
            const length = data.length;
            let pos = 0;
            const m = node.matrix;
            // var blendMode = node.blendMode;
            // var alpha = node.alpha;
            let savedMatrix: Matrix;
            let offsetX = 0;
            let offsetY = 0;
            if (m) {
                savedMatrix = egret.Matrix.create();
                const curMatrix = buffer.globalMatrix;
                savedMatrix.a = curMatrix.a;
                savedMatrix.b = curMatrix.b;
                savedMatrix.c = curMatrix.c;
                savedMatrix.d = curMatrix.d;
                savedMatrix.tx = curMatrix.tx;
                savedMatrix.ty = curMatrix.ty;
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            //这里不考虑嵌套
            // if (blendMode) {
            //     buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
            // }
            // var originAlpha;
            // if (alpha == alpha) {
            //     originAlpha = buffer.globalAlpha;
            //     buffer.globalAlpha *= alpha;
            // }
            const _textureAtlasTransforms = displayObject._textureAtlasTransforms;
            if (_textureAtlasTransforms.length !== length) {
                _textureAtlasTransforms.length = 0;
                for (let i = 0; i < length; ++i) {
                    _textureAtlasTransforms.push(new Transform);
                }
            }

            if (node.filter) {
                //buffer.context.$filter = node.filter;
                while (pos < length) {
                    //DisplayObjectTransform ._transformNormalBitmap(displayObject._textureAtlasTransforms[length/8], node.image, buffer, );
                    //buffer.context.__drawImage__(displayObject, image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                }
                //buffer.context.$filter = null;
            }
            else {
                while (pos < length) {
                    //DisplayObjectTransform ._transformNormalBitmap(displayObject._textureTransform, node, buffer);
                    //buffer.context.__drawImage__(displayObject, image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                }
            }

            // WebGLRenderContext.prototype.__drawImage__ = function
            //  (displayObject, image, 

            //     sourceX, sourceY, sourceWidth, sourceHeight, 
            //     destX, destY, destWidth, destHeight,
            //      imageSourceWidth, imageSourceHeight,
            //       rotated, smoothing) {
            //     var buffer = this.currentBuffer;
            //     if (this.contextLost || !image || !buffer) {
            const offsetLength = 8;
            let textureAtlasTransformIndex = 0;
            //const image = node.image;
            while (pos < length) {
                const destHeight = data[pos + 7];
                const destY = data[pos + 5];
                DisplayObjectTransform._transformImage_(displayObject._textureAtlasTransforms[textureAtlasTransformIndex], image, buffer, destHeight, destY);
                //
                ++textureAtlasTransformIndex;
                pos += offsetLength;
            }



            // if (blendMode) {
            //     buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
            // }
            // if (alpha == alpha) {
            //     buffer.globalAlpha = originAlpha;
            // }
            if (m) {
                const matrix = buffer.globalMatrix;
                matrix.a = savedMatrix.a;
                matrix.b = savedMatrix.b;
                matrix.c = savedMatrix.c;
                matrix.d = savedMatrix.d;
                matrix.tx = savedMatrix.tx;
                matrix.ty = savedMatrix.ty;
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                egret.Matrix.release(savedMatrix);
            }
        }
    }
}
