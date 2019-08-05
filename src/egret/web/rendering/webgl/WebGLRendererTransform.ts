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

namespace egret.web {
    export class WebGLRendererTransform {
        public static transformDisplayObject(displayObject: DisplayObject, buffer: WebGLRenderBuffer, offsetX: number, offsetY: number): void {

            // let drawCalls = 0;
            // let node: sys.RenderNode;
            // let displayList = displayObject.$displayList;
            // if (displayList && !isStage) {
            //     if (displayObject.$cacheDirty || displayObject.$renderDirty ||
            //         displayList.$canvasScaleX != sys.DisplayList.$canvasScaleX ||
            //         displayList.$canvasScaleY != sys.DisplayList.$canvasScaleY) {
            //         drawCalls += displayList.drawToSurface();
            //     }
            //     node = displayList.$renderNode;
            // }
            // else {
            //     if (displayObject.$renderDirty) {
            //         node = displayObject.$getRenderNode();
            //     }
            //     else {
            //         node = displayObject.$renderNode;
            //     }
            // }
            // displayObject.$cacheDirty = false;
            const node = displayObject.$getRenderNode();
            if (node) {
                //drawCalls++;
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                ///
                //buffer.context.setBatchSystem(node);
                ///
                switch (node.type) {
                    case sys.RenderNodeType.BitmapNode:
                        //this.renderBitmap(<sys.BitmapNode>node, buffer);
                        break;
                    case sys.RenderNodeType.TextNode:
                        //this.renderText(<sys.TextNode>node, buffer);
                        break;
                    case sys.RenderNodeType.GraphicsNode:
                        //this.renderGraphics(<sys.GraphicsNode>node, buffer);
                        break;
                    case sys.RenderNodeType.GroupNode:
                        //this.renderGroup(<sys.GroupNode>node, buffer);
                        break;
                    case sys.RenderNodeType.MeshNode:
                        //this.renderMesh(<sys.MeshNode>node, buffer);
                        break;
                    case sys.RenderNodeType.NormalBitmapNode:
                        //this.renderNormalBitmap(<sys.NormalBitmapNode>node, buffer);
                        break;
                }
                buffer.$offsetX = 0;
                buffer.$offsetY = 0;
            }
            // if (displayList && !isStage) {
            //     return drawCalls;
            // }
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
                    // offsetX2;
                    // offsetY2;
                    // let tempAlpha;
                    // let tempTintColor;
                    // if (child.$alpha != 1) {
                    //     tempAlpha = buffer.globalAlpha;
                    //     buffer.globalAlpha *= child.$alpha;
                    // }
                    // if (child.tint !== 0xFFFFFF) {
                    //     tempTintColor = buffer.globalTintColor;
                    //     buffer.globalTintColor = child.$tintRGB;
                    // }
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
                    const transform = displayObject.transform;
                    transform.offsetX = offsetX2;
                    transform.offsetY = offsetY2;
                    //
                    const worldMatrix = transform.worldMatrix;
                    const globalMatrix = buffer.globalMatrix;
                    worldMatrix.a = globalMatrix.a;
                    worldMatrix.b = globalMatrix.b;
                    worldMatrix.c = globalMatrix.c;
                    worldMatrix.d = globalMatrix.d;
                    worldMatrix.tx = globalMatrix.tx;
                    worldMatrix.ty = globalMatrix.ty;
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
                        /*
                    case RenderMode.FILTER:
                        drawCalls += this.drawWithFilter(child, buffer, offsetX2, offsetY2);
                        break;
                    case RenderMode.CLIP:
                        drawCalls += this.drawWithClip(child, buffer, offsetX2, offsetY2);
                        break;
                    case RenderMode.SCROLLRECT:
                        drawCalls += this.drawWithScrollRect(child, buffer, offsetX2, offsetY2);
                        break;
                        */
                        default:
                            //drawCalls += this.drawDisplayObject(child, buffer, offsetX2, offsetY2);
                            break;
                    }
                    // if (tempAlpha) {
                    //     buffer.globalAlpha = tempAlpha;
                    // }
                    // if (tempTintColor) {
                    //     buffer.globalTintColor = tempTintColor;
                    // }
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
            //return drawCalls;
        }
    }
}
