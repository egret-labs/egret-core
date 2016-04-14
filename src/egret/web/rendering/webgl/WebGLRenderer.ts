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

module egret.web {

    var blendModes = ["source-over", "lighter", "destination-out"];
    var defaultCompositeOp = "source-over";
    var BLACK_COLOR = "#000000";
    var CAPS_STYLES = {none: 'butt', square: 'square', round: 'round'};
    var renderBufferPool:WebGLRenderBuffer[] = [];//渲染缓冲区对象池
    /**
     * @private
     * WebGL渲染器
     */
    export class WebGLRenderer implements sys.SystemRenderer {

        public constructor() {

        }

        private nestLevel:number = 0;//渲染的嵌套层次，0表示在调用堆栈的最外层。
        /**
         * 渲染一个显示对象
         * @param displayObject 要渲染的显示对象
         * @param buffer 渲染缓冲
         * @param matrix 要对显示对象整体叠加的变换矩阵
         * @param dirtyList 脏矩形列表
         * @param forRenderTexture 绘制目标是RenderTexture的标志
         * @returns drawCall触发绘制的次数
         */
        public render(displayObject:DisplayObject, buffer:sys.RenderBuffer, matrix:Matrix, dirtyList?:egret.sys.Region[], forRenderTexture?:boolean):number {
            this.nestLevel++;
            var webglBuffer:WebGLRenderBuffer = <WebGLRenderBuffer>buffer;
            var root:DisplayObject = forRenderTexture ? displayObject : null;
            //绘制显示对象
            this.drawDisplayObject(displayObject, webglBuffer, dirtyList, matrix, null, null, root);
            webglBuffer.$drawWebGL();
            var drawCall = webglBuffer.$drawCalls;
            webglBuffer.onRenderFinish();
            this.nestLevel--;
            if (this.nestLevel === 0) {
                //最大缓存6个渲染缓冲
                if (renderBufferPool.length > 6) {
                    renderBufferPool.length = 6;
                }
                var length = renderBufferPool.length;
                for (var i = 0; i < length; i++) {
                    renderBufferPool[i].resize(0, 0);
                }
            }
            return drawCall;
        }

        /**
         * @private
         * 绘制一个显示对象
         */
        private drawDisplayObject(displayObject:DisplayObject, buffer:WebGLRenderBuffer, dirtyList:egret.sys.Region[],
                                  matrix:Matrix, displayList:sys.DisplayList, clipRegion:sys.Region, root:DisplayObject):number {
            var drawCalls = 0;
            var node:sys.RenderNode;
            if (displayList && !root) {
                if (displayList.isDirty) {
                    drawCalls += displayList.drawToSurface();
                }
                node = displayList.$renderNode;
            }
            else {
                node = displayObject.$getRenderNode();
            }

            if (node) {
                if (dirtyList) {
                    var renderRegion = node.renderRegion;
                    if (clipRegion && !clipRegion.intersects(renderRegion)) {
                        node.needRedraw = false;
                    }
                    else if (!node.needRedraw) {
                        var l = dirtyList.length;
                        for (var j = 0; j < l; j++) {
                            if (renderRegion.intersects(dirtyList[j])) {
                                node.needRedraw = true;
                                break;
                            }
                        }
                    }
                }
                else {
                    node.needRedraw = true;
                }
                if (node.needRedraw) {
                    drawCalls++;
                    var renderAlpha:number;
                    var m:Matrix;
                    if (root) {
                        renderAlpha = displayObject.$getConcatenatedAlphaAt(root, displayObject.$getConcatenatedAlpha());
                        m = Matrix.create().copyFrom(displayObject.$getConcatenatedMatrix());
                        displayObject.$getConcatenatedMatrixAt(root, m);
                        matrix.$preMultiplyInto(m, m);
                        buffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        Matrix.release(m);
                    }
                    else {
                        renderAlpha = node.renderAlpha;
                        m = node.renderMatrix;
                        buffer.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);
                    }
                    buffer.setGlobalAlpha(renderAlpha);
                    this.renderNode(node, buffer);
                    node.needRedraw = false;
                }
            }
            if (displayList && !root) {
                return drawCalls;
            }
            var children = displayObject.$children;
            if (children) {
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var child = children[i];
                    if (!child.$visible || child.$alpha <= 0 || child.$maskedObject) {
                        continue;
                    }
                    if ((child.$blendMode !== 0 ||
                        (child.$mask && (child.$mask.$parentDisplayList || root)))) {//若遮罩不在显示列表中，放弃绘制遮罩。
                        drawCalls += this.drawWithClip(child, buffer, dirtyList, matrix, clipRegion, root);
                    }
                    else if (child.$scrollRect || child.$maskRect) {
                        drawCalls += this.drawWithScrollRect(child, buffer, dirtyList, matrix, clipRegion, root);
                    }
                    else {
                        if (child["isFPS"]) {
                            buffer.$drawWebGL();
                            buffer.$computeDrawCall = false;
                            this.drawDisplayObject(child, buffer, dirtyList, matrix, child.$displayList, clipRegion, root);
                            buffer.$drawWebGL();
                            buffer.$computeDrawCall = true;
                        }
                        else {
                            drawCalls += this.drawDisplayObject(child, buffer, dirtyList, matrix,
                                child.$displayList, clipRegion, root);
                        }
                    }
                }
            }
            return drawCalls;
        }

        /**
         * @private
         */
        private drawWithClip(displayObject:DisplayObject, buffer:WebGLRenderBuffer, dirtyList:egret.sys.Region[],
                             matrix:Matrix, clipRegion:sys.Region, root:DisplayObject):number {
            var drawCalls = 0;
            var hasBlendMode = (displayObject.$blendMode !== 0);
            if (hasBlendMode) {
                var compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }

            var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            var mask = displayObject.$mask;
            //if (mask && !mask.$parentDisplayList) {
            //    mask = null; //如果遮罩不在显示列表中，放弃绘制遮罩。
            //}

            //计算scrollRect和mask的clip区域是否需要绘制，不需要就直接返回，跳过所有子项的遍历。
            var maskRegion:sys.Region;
            var displayMatrix = Matrix.create();
            displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
            if (displayObject.$parentDisplayList) {
                var displayRoot = displayObject.$parentDisplayList.root;
                var invertedMatrix:Matrix;
                if (displayRoot !== displayObject.$stage) {
                    displayObject.$getConcatenatedMatrixAt(displayRoot, displayMatrix);
                }
            }

            if (mask) {
                var bounds = mask.$getOriginalBounds();
                maskRegion = sys.Region.create();
                var m = Matrix.create();
                m.copyFrom(mask.$getConcatenatedMatrix());
                if (invertedMatrix) {
                    invertedMatrix.$preMultiplyInto(m, m);
                }
                maskRegion.updateRegion(bounds, m);
                Matrix.release(m);
            }
            var region:sys.Region;
            if (scrollRect) {
                region = sys.Region.create();
                region.updateRegion(scrollRect, displayMatrix);
            }
            if (region && maskRegion) {
                region.intersect(maskRegion);
                sys.Region.release(maskRegion);
            }
            else if (!region && maskRegion) {
                region = maskRegion;
            }
            if (region) {
                if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                    sys.Region.release(region);
                    Matrix.release(displayMatrix);
                    return drawCalls;
                }
            }
            else {
                region = sys.Region.create();
                bounds = displayObject.$getOriginalBounds();
                region.updateRegion(bounds, displayMatrix);
            }
            var found = false;
            if (!dirtyList) {//forRenderTexture
                found = true;
            }
            else {
                var l = dirtyList.length;
                for (var j = 0; j < l; j++) {
                    if (region.intersects(dirtyList[j])) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                sys.Region.release(region);
                Matrix.release(displayMatrix);
                return drawCalls;
            }

            //没有遮罩,同时显示对象没有子项
            if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                if (scrollRect) {
                    buffer.pushMask(scrollRect);
                }
                var offsetM = Matrix.create().setTo(1, 0, 0, 1, 0, 0);


                //绘制显示对象
                if (hasBlendMode) {
                    buffer.setGlobalCompositeOperation(compositeOp);
                }
                drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, offsetM,
                    displayObject.$displayList, region, null);
                Matrix.release(offsetM);
                if (hasBlendMode) {
                    buffer.setGlobalCompositeOperation(defaultCompositeOp);
                }
                sys.Region.release(region);
                Matrix.release(displayMatrix);
                return drawCalls;
            }
            else {
                //绘制显示对象自身，若有scrollRect，应用clip
                var displayBuffer = this.createRenderBuffer(region.width, region.height);
                var displayContext = displayBuffer.context;
                if (!displayContext) {//RenderContext创建失败，放弃绘制遮罩。
                    drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix,
                        displayObject.$displayList, clipRegion, root);
                    sys.Region.release(region);
                    Matrix.release(displayMatrix);
                    return drawCalls;
                }
                if (scrollRect) {
                    var m = displayMatrix;
                    displayBuffer.setTransform(m.a, m.b, m.c, m.d, m.tx - region.minX, m.ty - region.minY);
                    displayBuffer.pushMask(scrollRect);
                }
                displayBuffer.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                var offsetM = Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);

                drawCalls += this.drawDisplayObject(displayObject, displayBuffer, dirtyList, offsetM,
                    displayObject.$displayList, region, root ? displayObject : null);
                Matrix.release(offsetM);
                //绘制遮罩
                if (mask) {
                    //如果只有一次绘制或是已经被cache直接绘制到displayContext
                    //webgl暂时无法添加,因为会有边界像素没有被擦除
                    //var maskRenderNode = mask.$getRenderNode();
                    //if (maskRenderNode && maskRenderNode.$getRenderCount() == 1 || mask.$displayList) {
                    //    displayBuffer.setGlobalCompositeOperation("destination-in");
                    //    drawCalls += this.drawDisplayObject(mask, displayBuffer, dirtyList, offsetM,
                    //        mask.$displayList, region, root ? mask : null);
                    //}
                    //else {
                    var maskBuffer = this.createRenderBuffer(region.width, region.height);
                    var maskContext = maskBuffer.context;
                    if (!maskContext) {//RenderContext创建失败，放弃绘制遮罩。
                        drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix,
                            displayObject.$displayList, clipRegion, root);
                        displayBuffer.popMask();
                        renderBufferPool.push(displayBuffer);
                        sys.Region.release(region);
                        Matrix.release(displayMatrix);
                        return drawCalls;
                    }
                    maskBuffer.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                    offsetM = Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                    var calls = this.drawDisplayObject(mask, maskBuffer, dirtyList, offsetM,
                        mask.$displayList, region, root ? mask : null);
                    Matrix.release(offsetM);
                    if (calls > 0) {
                        drawCalls += calls;
                        displayBuffer.setGlobalCompositeOperation("destination-in");
                        displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        displayBuffer.setGlobalAlpha(1);
                        maskBuffer.$drawWebGL();
                        WebGLUtils.deleteWebGLTexture(maskBuffer.surface);
                        var maskBufferWidth = maskBuffer.surface.width;
                        var maskBufferHeight = maskBuffer.surface.height;
                        displayBuffer.drawImage(<any>maskBuffer.surface, 0, 0, maskBufferWidth, maskBufferHeight,
                            0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                    }
                    renderBufferPool.push(maskBuffer);
                    //}
                }

                //绘制结果到屏幕
                if (drawCalls > 0) {
                    drawCalls++;
                    if (hasBlendMode) {
                        buffer.setGlobalCompositeOperation(compositeOp);
                    }
                    buffer.setGlobalAlpha(1);
                    buffer.setTransform(1, 0, 0, 1, region.minX + matrix.tx, region.minY + matrix.ty);
                    displayBuffer.$drawWebGL();
                    WebGLUtils.deleteWebGLTexture(displayBuffer.surface);
                    var displayBufferWidth = maskBuffer.surface.width;
                    var displayBufferHeight = maskBuffer.surface.height;
                    buffer.drawImage(<any>displayBuffer.surface, 0, 0, displayBufferWidth, displayBufferHeight,
                        0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                    if (hasBlendMode) {
                        buffer.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                }
                displayBuffer.setGlobalCompositeOperation(defaultCompositeOp);
                renderBufferPool.push(displayBuffer);
                sys.Region.release(region);
                Matrix.release(displayMatrix);
                return drawCalls;
            }
        }

        /**
         * @private
         */
        private drawWithScrollRect(displayObject:DisplayObject, buffer:WebGLRenderBuffer, dirtyList:egret.sys.Region[],
                                   matrix:Matrix, clipRegion:sys.Region, root:DisplayObject):number {
            var drawCalls = 0;
            var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            if (scrollRect.width == 0 || scrollRect.height == 0) {
                return drawCalls;
            }
            var m = Matrix.create();
            m.copyFrom(displayObject.$getConcatenatedMatrix());
            if (displayObject.$parentDisplayList) {
                var displayRoot = displayObject.$parentDisplayList.root;
                if (displayRoot !== displayObject.$stage) {
                    displayObject.$getConcatenatedMatrixAt(displayRoot, m);
                }
            }
            var region:sys.Region = sys.Region.create();
            if (!scrollRect.isEmpty()) {
                region.updateRegion(scrollRect, m);
            }
            if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                sys.Region.release(region);
                Matrix.release(m);
                return drawCalls;
            }
            var found = false;
            if (!dirtyList) {//forRenderTexture
                found = true;
            }
            else {
                var l = dirtyList.length;
                for (var j = 0; j < l; j++) {
                    if (region.intersects(dirtyList[j])) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                sys.Region.release(region);
                Matrix.release(m);
                return drawCalls;
            }

            //绘制显示对象自身
            buffer.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);
            buffer.pushMask(scrollRect);
            drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, region, root);
            buffer.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);
            buffer.popMask();

            sys.Region.release(region);
            Matrix.release(m);
            return drawCalls;
        }

        /**
         * 将一个RenderNode对象绘制到渲染缓冲
         * @param node 要绘制的节点
         * @param buffer 渲染缓冲
         * @param matrix 要叠加的矩阵
         * @param forHitTest 绘制结果是用于碰撞检测。若为true，当渲染GraphicsNode时，会忽略透明度样式设置，全都绘制为不透明的。
         */
        public drawNodeToBuffer(node:sys.RenderNode, buffer:WebGLRenderBuffer, matrix:Matrix, forHitTest?:boolean):void {
            var webglBuffer:WebGLRenderBuffer = <WebGLRenderBuffer>buffer;
            webglBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this.renderNode(node, buffer, forHitTest);
            buffer.$drawWebGL();
        }

        /**
         * @private
         */
        private renderNode(node:sys.RenderNode, buffer:WebGLRenderBuffer, forHitTest?:boolean):void {
            switch (node.type) {
                case sys.RenderNodeType.BitmapNode:
                    this.renderBitmap(<sys.BitmapNode>node, buffer);
                    break;
                case sys.RenderNodeType.TextNode:
                    this.renderText(<sys.TextNode>node, buffer);
                    break;
                case sys.RenderNodeType.GraphicsNode:
                    this.renderGraphics(<sys.GraphicsNode>node, buffer, forHitTest);
                    break;
                case sys.RenderNodeType.GroupNode:
                    this.renderGroup(<sys.GroupNode>node, buffer);
                    break;
                case sys.RenderNodeType.SetTransformNode:
                    buffer.setTransform(node.drawData[0], node.drawData[1], node.drawData[2], node.drawData[3], node.drawData[4], node.drawData[5]);
                    break;
                case sys.RenderNodeType.SetAlphaNode:
                    buffer.setGlobalAlpha(node.drawData[0]);
                    break;
            }
        }

        /**
         * @private
         */
        private renderBitmap(node:sys.BitmapNode, buffer:WebGLRenderBuffer):void {
            var image = node.image;
            //buffer.imageSmoothingEnabled = node.smoothing;
            var data = node.drawData;
            var length = data.length;
            var pos = 0;
            var m = node.matrix;
            if (m) {
                buffer.saveTransform();
                buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);

            }
            while (pos < length) {
                buffer.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++],
                    data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight);
            }
            if (m) {
                buffer.restoreTransform();
            }
        }

        //private canvasRenderer:CanvasRenderer;
        //private canvasRenderBuffer:CanvasRenderBuffer;

        /**
         * @private
         */
        private renderText(node:sys.TextNode, buffer:WebGLRenderBuffer):void {
            //优化,使用同一个canvas
            var width = node.width - node.x;
            var height = node.height - node.y;
            if (node.drawData.length == 0) {
                return;
            }
            if (!node.$canvasRenderBuffer || !node.$canvasRenderBuffer.context) {
                node.$canvasRenderer = new CanvasRenderer();
                node.$canvasRenderBuffer = new CanvasRenderBuffer(width, height);
            }
            else {
                node.$canvasRenderBuffer.resize(width, height, true);
            }
            if (!node.$canvasRenderBuffer.context) {
                return;
            }
            if (node.x || node.y) {
                if (node.dirtyRender) {
                    node.$canvasRenderBuffer.context.translate(-node.x, -node.y);
                }
                buffer.transform(1, 0, 0, 1, node.x, node.y);
            }
            if (node.dirtyRender) {
                WebGLUtils.deleteWebGLTexture(node.$canvasRenderBuffer.surface);
                node.$canvasRenderer["renderText"](node, node.$canvasRenderBuffer.context);
            }
            buffer.drawImage(<BitmapData><any>node.$canvasRenderBuffer.surface, 0, 0, width, height, 0, 0, width, height, width, height);
            if (node.x || node.y) {
                if (node.dirtyRender) {
                    node.$canvasRenderBuffer.context.translate(node.x, node.y);
                }
                buffer.transform(1, 0, 0, 1, -node.x, -node.y);
            }
            node.dirtyRender = false;
        }

        /**
         * @private
         */
        private renderGraphics(node:sys.GraphicsNode, buffer:WebGLRenderBuffer, forHitTest?:boolean):void {
            var width = node.width;
            var height = node.height;
            if (width <= 0 || height <= 0) {
                return;
            }
            if (!node.$canvasRenderBuffer || !node.$canvasRenderBuffer.context) {
                node.$canvasRenderer = new CanvasRenderer();
                node.$canvasRenderBuffer = new CanvasRenderBuffer(width, height);
            }
            else if (node.dirtyRender) {
                node.$canvasRenderBuffer.resize(width, height, true);
            }
            if (!node.$canvasRenderBuffer.context) {
                return;
            }
            if (node.x || node.y) {
                if (node.dirtyRender) {
                    node.$canvasRenderBuffer.context.translate(-node.x, -node.y);
                }
                buffer.transform(1, 0, 0, 1, node.x, node.y);
            }
            if (node.dirtyRender) {
                WebGLUtils.deleteWebGLTexture(node.$canvasRenderBuffer.surface);
                node.$canvasRenderer["renderGraphics"](node, node.$canvasRenderBuffer.context, forHitTest);
            }
            buffer.drawImage(<BitmapData><any>node.$canvasRenderBuffer.surface, 0, 0, width, height, 0, 0, width, height, width, height);
            if (node.x || node.y) {
                if (node.dirtyRender) {
                    node.$canvasRenderBuffer.context.translate(node.x, node.y);
                }
                buffer.transform(1, 0, 0, 1, -node.x, -node.y);
            }
            node.dirtyRender = false;
        }

        private renderGroup(groupNode:sys.GroupNode, buffer:WebGLRenderBuffer):void {
            var children = groupNode.drawData;
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var node:sys.RenderNode = children[i];
                this.renderNode(node, buffer);
            }
        }

        /**
         * @private
         */
        private createRenderBuffer(width:number, height:number):WebGLRenderBuffer {
            var buffer = renderBufferPool.pop();
            if (buffer) {
                buffer.resize(width, height, true);
            }
            else {
                buffer = new WebGLRenderBuffer(width, height);
                buffer.$computeDrawCall = false;
            }
            return buffer;
        }
    }
}
