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

//测试开关
const useDisplayObjectTransform: boolean = true;

namespace egret.web {
    /**
     * 转换的整体封装
     */
    export class DisplayObjectTransform {
        /**
         * 测试用, 检查重构的结果
         * @param displayObject 
         * @param buffer 
         */
        public static debugCheckTransformMatchesExactly(displayObject: DisplayObject, buffer: WebGLRenderBuffer): boolean {
            if (!useDisplayObjectTransform || !displayObject) {
                return false;
            }
            const currentRenderNode = buffer.currentRenderNode;
            if (currentRenderNode) {
                const _textureTransform = currentRenderNode.textureTransform;
                if (!NumberUtils.matrixEqual(_textureTransform._matrix, buffer.globalMatrix)) {
                    console.error('WebGLRendererTransform debugCheckTransformMatchesExactly matrixEqual');
                    return false;
                }
                if (!NumberUtils.fequal(_textureTransform._offsetX, buffer.$offsetX)
                    || !NumberUtils.fequal(_textureTransform._offsetY, buffer.$offsetY)) {
                    console.error('WebGLRendererTransform debugCheckTransformMatchesExactly offset');
                    return false;
                }
            }
            return true;
        }
        /**
         * 将displayObject作为根部，做整体转换
         * @param displayObject 
         * @param buffer 
         * @param offsetX 
         * @param offsetY 
         */
        public static transformObjectAsRoot(displayObject: DisplayObject, globalMatrix: Matrix, offsetX: number, offsetY: number): void {
            //设置为根节点，不再重复设置
            displayObject._worldTransform.set(globalMatrix, offsetX, offsetY);
            //开始遍历进行transform
            this.transformObject(displayObject, offsetX, offsetY);
        }
        /**
         * 处理一个对象
         * @param displayObject 
         * @param buffer 
         * @param offsetX 
         * @param offsetY 
         */
        public static transformObject(displayObject: DisplayObject, offsetX: number, offsetY: number): void {
            if (!useDisplayObjectTransform) {
                return;
            }
            //
            const node = displayObject.$getRenderNode();
            if (node) {
                //临时, 这里需要再次重构
                const renderNodeIsDirty = true;
                if (renderNodeIsDirty) {
                    DisplayObjectTransform.copyTransformToRenderNodeTextureTransform(displayObject._worldTransform, node);
                }
                DisplayObjectTransform.transformRenderNode(displayObject, node);
            }
            //
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
                    if (!child.visible || child.$alpha <= 0) {
                        continue;
                    }
                    const childWorldTransform = child._worldTransform;
                    const parentWorldTransform = displayObject._worldTransform;
                    const m3 = parentWorldTransform._matrix;
                    childWorldTransform._matrix.setTo(m3.a, m3.b, m3.c, m3.d, m3.tx, m3.ty);
                    if (child.$useTranslate) {
                        const m = child.$getMatrix();
                        offsetX2 = offsetX + child.$x;
                        offsetY2 = offsetY + child.$y;
                        childWorldTransform.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                        offsetX2 = -child.$anchorOffsetX;
                        offsetY2 = -child.$anchorOffsetY;
                    }
                    else {
                        offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                        offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                    }
                    childWorldTransform.set(childWorldTransform._matrix, offsetX2, offsetY2);
                    switch (child.$renderMode) {
                        case RenderMode.NONE:
                            break;
                        case RenderMode.FILTER:
                        case RenderMode.CLIP:
                            break;
                        case RenderMode.SCROLLRECT:
                            DisplayObjectTransform.transformObjectAsScrollRect(child, offsetX2, offsetY2);
                            break;
                        default:
                            DisplayObjectTransform.transformObject(child, offsetX2, offsetY2);
                            break;
                    }
                }
            }
        }
        /**
         * 在转换Group里面做递归使用
         * @param displayObject 
         * @param fromNode 
         * @param toNode 
         * @param buffer 
         */
        private static transformRenderNodeRecursive(displayObject: DisplayObject, fromNode: sys.RenderNode, toNode: sys.RenderNode): void {
            if (!fromNode) {
                return;
            }
            if (fromNode.type === sys.RenderNodeType.GroupNode) {
                DisplayObjectTransform.copyTransformToRenderNodeTextureTransform(fromNode.textureTransform, toNode);
            }
            DisplayObjectTransform.transformRenderNode(displayObject, toNode);
        }
        /**
         * 转换一个RenderNode的TextureTransform
         * @param displayObject 
         * @param node 
         * @param buffer 
         */
        private static transformRenderNode(displayObject: DisplayObject, node: sys.RenderNode): void {
            switch (node.type) {
                case sys.RenderNodeType.BitmapNode:
                    DisplayObjectTransform.transformBitmapAtlasNode(displayObject, <sys.BitmapNode>node);
                    break;
                case sys.RenderNodeType.TextNode:
                    DisplayObjectTransform.transformTextNode(displayObject, <sys.TextNode>node);
                    break;
                case sys.RenderNodeType.GraphicsNode:
                    DisplayObjectTransform.transformGraphicsNode(displayObject, <sys.GraphicsNode>node);
                    break;
                case sys.RenderNodeType.GroupNode:
                    DisplayObjectTransform.transformGroupNode(displayObject, <sys.GroupNode>node);
                    break;
                case sys.RenderNodeType.MeshNode:
                    DisplayObjectTransform.transformMeshNode(displayObject, <sys.MeshNode>node);
                    break;
                case sys.RenderNodeType.NormalBitmapNode:
                    DisplayObjectTransform.transformBitmapSingleNode(displayObject, <sys.NormalBitmapNode>node);
                    break;
                default:
                    break;
            }
        }
        /**
         * 把一个transform复制给目标RenderNode的所有TextureTransform;
         * @param worldTransform 
         * @param renderNode 
         */
        public static copyTransformToRenderNodeTextureTransform(worldTransform: Transform, renderNode: egret.sys.RenderNode): void {
            switch (renderNode.type) {
                case sys.RenderNodeType.NormalBitmapNode:
                case sys.RenderNodeType.GraphicsNode:
                case sys.RenderNodeType.TextNode:
                case sys.RenderNodeType.GroupNode: {
                    renderNode.textureTransform.from(worldTransform);
                    break;
                }
                case sys.RenderNodeType.BitmapNode:
                case sys.RenderNodeType.MeshNode: {
                    //
                    const node: sys.BitmapNode | sys.MeshNode =
                        (renderNode.type === sys.RenderNodeType.BitmapNode ? renderNode as sys.BitmapNode : renderNode as sys.MeshNode);
                    //
                    const data = node.drawData;
                    const length = data.length;
                    const dataGroupCount = Math.floor(length / sys.BitmapNodeDrawDataIndex.MAX_SIZE);
                    node.resizeTextureTransformGroup(dataGroupCount);
                    //
                    let textureTransformIndex = 0;
                    let pos = 0;
                    while (pos < length) {
                        node.textureTransformIndex(textureTransformIndex);
                        node.textureTransform.from(worldTransform);
                        ++textureTransformIndex;
                        pos += sys.BitmapNodeDrawDataIndex.MAX_SIZE;
                    }
                    break;
                }
                default:
                    break;
            }
        }
        /**
         * 转换的最后一步
         * @param _textureTransform 
         * @param image 
         * @param buffer 
         * @param destHeight 
         * @param destY 
         */
        private static _filpY_(_textureTransform: Transform, image: BitmapData, destHeight: number, destY: number): void {
            if (image) {
                if (image["texture"] || (image.source && image.source["texture"])) {
                    _textureTransform.flipY(destHeight + destY * 2);
                }
            }
        }
        /**
         * 转换单图
         * @param displayObject 
         * @param node 
         * @param buffer 
         */
        private static transformBitmapSingleNode(displayObject: DisplayObject, node: sys.NormalBitmapNode): void {
            DisplayObjectTransform._filpY_(node.textureTransform, node.image, node.drawH, node.drawY);
        }
        /**
         * 转换文字
         * @param displayObject 
         * @param node 
         * @param buffer 
         */
        private static transformTextNode(displayObject: DisplayObject, node: sys.TextNode): void {
            let width = node.width - node.x;
            let height = node.height - node.y;
            if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                return;
            }
            let canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
            let canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
            const maxTextureSize = web.WebGLRenderContext.getInstance(0, 0).$maxTextureSize;
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
            ///
            if (x || y) {
                node.textureTransform.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
            }
        }
        /**
         * 转换矢量绘图
         * @param displayObject 
         * @param node 
         * @param buffer 
         */
        private static transformGraphicsNode(displayObject: DisplayObject, node: sys.GraphicsNode): void {
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
            //
            if (node.x || node.y) {
                node.textureTransform.transform(1, 0, 0, 1, node.x, node.y);
            }
        }
        /**
         * 转换Group
         * @param displayObject 
         * @param groupNode 
         * @param buffer 
         */
        private static transformGroupNode(displayObject: DisplayObject, groupNode: sys.GroupNode): void {
            const m = groupNode.matrix;
            if (m) {
                const textureTransform = groupNode.textureTransform;
                textureTransform.useOffset();
                textureTransform.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            const children = groupNode.drawData;
            const length = children.length;
            for (let i = 0; i < length; i++) {
                const node = children[i];
                DisplayObjectTransform.transformRenderNodeRecursive(displayObject, groupNode, node);
            }
        }
        /**
         * 转换图集处理
         * @param displayObject 
         * @param node 
         * @param buffer 
         */
        private static transformBitmapAtlasNode(displayObject: DisplayObject, node: sys.BitmapNode): void {
            const image = node.image;
            if (!image) {
                return;
            }
            const data = node.drawData;
            const length = data.length;
            const m = node.matrix;
            let pos = 0;
            let textureTransformIndex = 0;
            while (pos < length) {
                const destHeight = data[pos + sys.BitmapNodeDrawDataIndex.destHeight];
                const destY = data[pos + sys.BitmapNodeDrawDataIndex.destY];
                node.textureTransformIndex(textureTransformIndex);
                const curTextureTransform = node.textureTransform;
                if (m) {
                    curTextureTransform.useOffset();
                    curTextureTransform.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                DisplayObjectTransform._filpY_(curTextureTransform, image, destHeight, destY);
                //
                ++textureTransformIndex;
                pos += sys.BitmapNodeDrawDataIndex.MAX_SIZE;
            }
        }
        /**
         * 转换一个mesh
         * @param displayObject 
         * @param node 
         * @param buffer 
         */
        private static transformMeshNode(displayObject: DisplayObject, node: sys.MeshNode): void {
            const image = node.image;
            const data = node.drawData;
            const length = data.length;
            const m = node.matrix;
            let pos = 0;
            let textureTransformIndex = 0;
            while (pos < length) {
                const destHeight = data[pos + sys.BitmapNodeDrawDataIndex.destHeight];
                const destY = data[pos + sys.BitmapNodeDrawDataIndex.destY];
                node.textureTransformIndex(textureTransformIndex);
                const curTextureTransform = node.textureTransform;
                if (m) {
                    curTextureTransform.useOffset();
                    curTextureTransform.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                DisplayObjectTransform._filpY_(curTextureTransform, image, destHeight, destY);
                ++textureTransformIndex;
                pos += sys.BitmapNodeDrawDataIndex.MAX_SIZE;
            }
        }
        /**
         * 转换一个SrcollRect
         * @param displayObject 
         * @param buffer 
         * @param offsetX 
         * @param offsetY 
         */
        private static transformObjectAsScrollRect(displayObject: DisplayObject, offsetX: number, offsetY: number): void {
            const scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            if (scrollRect.isEmpty()) {
                return;
            }
            if (displayObject.$scrollRect) {
                offsetX -= scrollRect.x;
                offsetY -= scrollRect.y;
            }
            DisplayObjectTransform.transformObject(displayObject, offsetX, offsetY);
        }
    }
}
