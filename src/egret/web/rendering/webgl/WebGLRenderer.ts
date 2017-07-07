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

    let blendModes = ["source-over", "lighter", "destination-out"];
    let defaultCompositeOp = "source-over";
    let BLACK_COLOR = "#000000";
    let CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
    let renderBufferPool: WebGLRenderBuffer[] = [];//渲染缓冲区对象池
    /**
     * @private
     * WebGL渲染器
     */
    export class WebGLRenderer implements sys.SystemRenderer {

        public constructor() {

        }

        private nestLevel: number = 0;//渲染的嵌套层次，0表示在调用堆栈的最外层。
        /**
         * 渲染一个显示对象
         * @param displayObject 要渲染的显示对象
         * @param buffer 渲染缓冲
         * @param matrix 要对显示对象整体叠加的变换矩阵
         * @param dirtyList 脏矩形列表
         * @param forRenderTexture 绘制目标是RenderTexture的标志
         * @returns drawCall触发绘制的次数
         */
        public render(displayObject: DisplayObject, buffer: sys.RenderBuffer, matrix: Matrix, dirtyList?: egret.sys.Region[], forRenderTexture?: boolean): number {
            this.nestLevel++;
            let webglBuffer: WebGLRenderBuffer = <WebGLRenderBuffer>buffer;
            let webglBufferContext: WebGLRenderContext = webglBuffer.context;
            let root: DisplayObject = forRenderTexture ? displayObject : null;

            webglBufferContext.pushBuffer(webglBuffer);

            //绘制显示对象
            this.drawDisplayObject(displayObject, webglBuffer, dirtyList, matrix, null, null, root);
            webglBufferContext.$drawWebGL();
            let drawCall = webglBuffer.$drawCalls;
            webglBuffer.onRenderFinish();

            webglBufferContext.popBuffer();

            this.nestLevel--;
            if (this.nestLevel === 0) {
                //最大缓存6个渲染缓冲
                if (renderBufferPool.length > 6) {
                    renderBufferPool.length = 6;
                }
                let length = renderBufferPool.length;
                for (let i = 0; i < length; i++) {
                    renderBufferPool[i].resize(0, 0);
                }
            }
            return drawCall;
        }

        /**
         * @private
         * 绘制一个显示对象
         */
        private drawDisplayObject(displayObject: DisplayObject, buffer: WebGLRenderBuffer, dirtyList: egret.sys.Region[],
            matrix: Matrix, displayList: sys.DisplayList, clipRegion: sys.Region, root: DisplayObject): number {
            let drawCalls = 0;
            let node: sys.RenderNode;
            let filterPushed: boolean = false;
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
                    let renderRegion = node.renderRegion;
                    if (clipRegion && !clipRegion.intersects(renderRegion)) {
                        node.needRedraw = false;
                    }
                    else if (!node.needRedraw) {
                        let l = dirtyList.length;
                        for (let j = 0; j < l; j++) {
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
                    let renderAlpha: number;
                    let m: Matrix;
                    if (root) {
                        renderAlpha = displayObject.$getConcatenatedAlphaAt(root, displayObject.$getConcatenatedAlpha());
                        m = Matrix.create().copyFrom(displayObject.$getConcatenatedMatrix());
                        displayObject.$getConcatenatedMatrixAt(root, m);
                    }
                    else {
                        renderAlpha = node.renderAlpha;
                        m = Matrix.create().copyFrom(node.renderMatrix);
                    }
                    matrix.$preMultiplyInto(m, m);
                    buffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    Matrix.release(m);
                    buffer.globalAlpha = renderAlpha;
                    this.renderNode(node, buffer);
                    node.needRedraw = false;
                }
            }
            if (displayList && !root) {
                return drawCalls;
            }
            let children = displayObject.$children;
            if (children) {
                let length = children.length;
                for (let i = 0; i < length; i++) {
                    let child = children[i];
                    if (!child.$visible || child.$alpha <= 0 || child.$maskedObject) {
                        continue;
                    }
                    let filters = child.$getFilters();
                    if (filters && filters.length > 0) {
                        drawCalls += this.drawWithFilter(child, buffer, dirtyList, matrix, clipRegion, root);
                    }
                    else if ((child.$blendMode !== 0 ||
                        (child.$mask && (child.$mask.$parentDisplayList || root)))) {//若遮罩不在显示列表中，放弃绘制遮罩。
                        drawCalls += this.drawWithClip(child, buffer, dirtyList, matrix, clipRegion, root);
                    }
                    else if (child.$scrollRect || child.$maskRect) {
                        drawCalls += this.drawWithScrollRect(child, buffer, dirtyList, matrix, clipRegion, root);
                    }
                    else {
                        if (child["isFPS"]) {
                            buffer.context.$drawWebGL();
                            buffer.$computeDrawCall = false;
                            this.drawDisplayObject(child, buffer, dirtyList, matrix, child.$displayList, clipRegion, root);
                            buffer.context.$drawWebGL();
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
        private drawWithFilter(displayObject: DisplayObject, buffer: WebGLRenderBuffer, dirtyList: egret.sys.Region[],
            matrix: Matrix, clipRegion: sys.Region, root: DisplayObject): number {
            let drawCalls = 0;
            if (displayObject.$children && displayObject.$children.length == 0) {
                return;
            }
            let filters = displayObject.$getFilters();
            let hasBlendMode = (displayObject.$blendMode !== 0);
            let compositeOp: string;
            if (hasBlendMode) {
                compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }

            if (filters.length == 1 && (filters[0].type == "colorTransform" || (filters[0].type === "custom" && (<CustomFilter>filters[0]).padding === 0))) {
                let childrenDrawCount = this.getRenderCount(displayObject);
                if (!displayObject.$children || childrenDrawCount == 1) {
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }

                    buffer.context.$filter = <ColorMatrixFilter>filters[0];
                    if ((displayObject.$mask && (displayObject.$mask.$parentDisplayList || root))) {
                        drawCalls += this.drawWithClip(displayObject, buffer, dirtyList, matrix, clipRegion, root);
                    }
                    else if (displayObject.$scrollRect || displayObject.$maskRect) {
                        drawCalls += this.drawWithScrollRect(displayObject, buffer, dirtyList, matrix, clipRegion, root);
                    }
                    else {
                        drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, clipRegion, root);
                    }
                    buffer.context.$filter = null;

                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }

                    return drawCalls;
                }
            }

            // 获取显示对象的链接矩阵
            let displayMatrix = Matrix.create();
            displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
            if (root) {
                displayObject.$getConcatenatedMatrixAt(root, displayMatrix);
            }

            // 获取显示对象的矩形区域
            let region: sys.Region;
            region = sys.Region.create();
            let bounds = displayObject.$getOriginalBounds();
            region.updateRegion(bounds, displayMatrix);

            // 为显示对象创建一个新的buffer
            // todo 这里应该计算 region.x region.y
            let displayBuffer = this.createRenderBuffer(region.width * matrix.a, region.height * matrix.d);
            displayBuffer.context.pushBuffer(displayBuffer);
            displayBuffer.setTransform(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
            let offsetM = Matrix.create().setTo(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);

            //todo 可以优化减少draw次数
            if ((displayObject.$mask && (displayObject.$mask.$parentDisplayList || root))) {
                drawCalls += this.drawWithClip(displayObject, displayBuffer, dirtyList, offsetM, region, root);
            }
            else if (displayObject.$scrollRect || displayObject.$maskRect) {
                drawCalls += this.drawWithScrollRect(displayObject, displayBuffer, dirtyList, offsetM, region, root);
            }
            else {
                drawCalls += this.drawDisplayObject(displayObject, displayBuffer, dirtyList, offsetM, displayObject.$displayList, region, root);
            }

            Matrix.release(offsetM);
            displayBuffer.context.popBuffer();

            //绘制结果到屏幕
            if (drawCalls > 0) {

                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(compositeOp);
                }

                drawCalls++;
                buffer.globalAlpha = 1;
                buffer.setTransform(1, 0, 0, 1, (region.minX + matrix.tx) * matrix.a, (region.minY + matrix.ty) * matrix.d);
                // 绘制结果的时候，应用滤镜
                buffer.context.drawTargetWidthFilters(filters, displayBuffer);

                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }

            }

            renderBufferPool.push(displayBuffer);
            sys.Region.release(region);
            Matrix.release(displayMatrix);

            return drawCalls;
        }

        private getRenderCount(displayObject:DisplayObject): number {
            let childrenDrawCount = 0;
            if (displayObject.$children) {
                for (let child of displayObject.$children) {
                    let node = child.$getRenderNode();
                    if(node) {
                        childrenDrawCount += node.$getRenderCount();
                    }
                    if(child.$children) {
                        childrenDrawCount += this.getRenderCount(child);
                    }
                }
            }
            return childrenDrawCount;
        }

        /**
         * @private
         */
        private drawWithClip(displayObject: DisplayObject, buffer: WebGLRenderBuffer, dirtyList: egret.sys.Region[],
            matrix: Matrix, clipRegion: sys.Region, root: DisplayObject): number {
            let drawCalls = 0;
            let hasBlendMode = (displayObject.$blendMode !== 0);
            let compositeOp: string;
            if (hasBlendMode) {
                compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }

            let scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            let mask = displayObject.$mask;
            if (mask) {
                let maskRenderNode = mask.$getRenderNode();
                if (maskRenderNode) {
                    let maskRenderMatrix = maskRenderNode.renderMatrix;
                    //遮罩scaleX或scaleY为0，放弃绘制
                    if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                        return drawCalls;
                    }
                }
            }
            //if (mask && !mask.$parentDisplayList) {
            //    mask = null; //如果遮罩不在显示列表中，放弃绘制遮罩。
            //}

            //计算scrollRect和mask的clip区域是否需要绘制，不需要就直接返回，跳过所有子项的遍历。
            let maskRegion: sys.Region;
            let displayMatrix = Matrix.create();
            displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
            if(root) {
                displayObject.$getConcatenatedMatrixAt(root, displayMatrix);
            }
            else if (displayObject.$parentDisplayList) {
                let displayRoot = displayObject.$parentDisplayList.root;
                if (displayRoot !== displayObject.$stage) {
                    displayObject.$getConcatenatedMatrixAt(displayRoot, displayMatrix);
                }
            }

            let bounds: Rectangle;
            if (mask) {
                bounds = mask.$getOriginalBounds();
                maskRegion = sys.Region.create();
                let m = Matrix.create();
                m.copyFrom(mask.$getConcatenatedMatrix());
                if(root) {
                    mask.$getConcatenatedMatrixAt(root, m);
                }
                maskRegion.updateRegion(bounds, m);
                Matrix.release(m);
            }
            let region: sys.Region;
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
            let found = false;
            if (!dirtyList) {//forRenderTexture
                found = true;
            }
            else {
                let l = dirtyList.length;
                for (let j = 0; j < l; j++) {
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
                    let m = displayMatrix;
                    buffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    buffer.context.pushMask(scrollRect);
                }
                //绘制显示对象
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(compositeOp);
                }
                drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix,
                    displayObject.$displayList, clipRegion, root);
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (scrollRect) {
                    buffer.context.popMask();
                }
                sys.Region.release(region);
                Matrix.release(displayMatrix);
                return drawCalls;
            }
            else {
                //绘制显示对象自身，若有scrollRect，应用clip
                let displayBuffer = this.createRenderBuffer(region.width * matrix.a, region.height * matrix.d);
                // let displayContext = displayBuffer.context;
                displayBuffer.context.pushBuffer(displayBuffer);
                displayBuffer.setTransform(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                let offsetM = Matrix.create().setTo(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);

                drawCalls += this.drawDisplayObject(displayObject, displayBuffer, dirtyList, offsetM,
                    displayObject.$displayList, region, root);
                //绘制遮罩
                if (mask) {
                    //如果只有一次绘制或是已经被cache直接绘制到displayContext
                    //webgl暂时无法添加,因为会有边界像素没有被擦除
                    //let maskRenderNode = mask.$getRenderNode();
                    //if (maskRenderNode && maskRenderNode.$getRenderCount() == 1 || mask.$displayList) {
                    //    displayBuffer.context.setGlobalCompositeOperation("destination-in");
                    //    drawCalls += this.drawDisplayObject(mask, displayBuffer, dirtyList, offsetM,
                    //        mask.$displayList, region, root);
                    //}
                    //else {
                    let maskBuffer = this.createRenderBuffer(region.width * matrix.a, region.height * matrix.d);
                    maskBuffer.context.pushBuffer(maskBuffer);
                    maskBuffer.setTransform(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                    offsetM = Matrix.create().setTo(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                    drawCalls += this.drawDisplayObject(mask, maskBuffer, dirtyList, offsetM,
                        mask.$displayList, region, root);
                    maskBuffer.context.popBuffer();
                    displayBuffer.context.setGlobalCompositeOperation("destination-in");
                    displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                    displayBuffer.globalAlpha = 1;
                    let maskBufferWidth = maskBuffer.rootRenderTarget.width;
                    let maskBufferHeight = maskBuffer.rootRenderTarget.height;
                    displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight,
                        0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                    displayBuffer.context.setGlobalCompositeOperation("source-over");
                    renderBufferPool.push(maskBuffer);
                    //}
                }
                Matrix.release(offsetM);

                displayBuffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                displayBuffer.context.popBuffer();

                //绘制结果到屏幕
                if (drawCalls > 0) {
                    drawCalls++;
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    if (scrollRect) {
                        let m = displayMatrix;
                        matrix.$preMultiplyInto(m, m);
                        displayBuffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        displayBuffer.context.pushMask(scrollRect);
                    }
                    buffer.globalAlpha = 1;
                    buffer.setTransform(1, 0, 0, -1, (region.minX + matrix.tx) * matrix.a, (region.minY + matrix.ty) * matrix.d + displayBuffer.height);
                    let displayBufferWidth = displayBuffer.rootRenderTarget.width;
                    let displayBufferHeight = displayBuffer.rootRenderTarget.height;
                    buffer.context.drawTexture(displayBuffer.rootRenderTarget.texture, 0, 0, displayBufferWidth, displayBufferHeight,
                        0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                    if (scrollRect) {
                        displayBuffer.context.popMask();
                    }
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                }

                renderBufferPool.push(displayBuffer);
                sys.Region.release(region);
                Matrix.release(displayMatrix);

                return drawCalls;
            }
        }

        /**
         * @private
         */
        private drawWithScrollRect(displayObject: DisplayObject, buffer: WebGLRenderBuffer, dirtyList: egret.sys.Region[],
            matrix: Matrix, clipRegion: sys.Region, root: DisplayObject): number {
            let drawCalls = 0;
            let scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            if (scrollRect.isEmpty()) {
                return drawCalls;
            }
            let m = Matrix.create();
            m.copyFrom(displayObject.$getConcatenatedMatrix());
            if (root) {
                displayObject.$getConcatenatedMatrixAt(root, m);
            }
            else if (displayObject.$parentDisplayList) {
                let displayRoot = displayObject.$parentDisplayList.root;
                if (displayRoot !== displayObject.$stage) {
                    displayObject.$getConcatenatedMatrixAt(displayRoot, m);
                }
            }
            let region: sys.Region = sys.Region.create();
            region.updateRegion(scrollRect, m);
            if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                sys.Region.release(region);
                Matrix.release(m);
                return drawCalls;
            }
            let found = false;
            if (!dirtyList) {//forRenderTexture
                found = true;
            }
            else {
                let l = dirtyList.length;
                for (let j = 0; j < l; j++) {
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
            matrix.$preMultiplyInto(m, m);
            buffer.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

            let context = buffer.context;
            let scissor = false;
            if (buffer.$hasScissor || m.b != 0 || m.c != 0) {// 有旋转的情况下不能使用scissor
                context.pushMask(scrollRect);
            } else {
                let a = m.a;
                let d = m.d;
                let tx = m.tx;
                let ty = m.ty;
                let x = scrollRect.x;
                let y = scrollRect.y;
                let xMax = x + scrollRect.width;
                let yMax = y + scrollRect.height;
                let minX: number, minY: number, maxX: number, maxY: number;
                //优化，通常情况下不缩放的对象占多数，直接加上偏移量即可。
                if (a == 1.0 && d == 1.0) {
                    minX = x + tx;
                    minY = y + ty;
                    maxX = xMax + tx;
                    maxY = yMax + ty;
                }
                else {
                    let x0 = a * x + tx;
                    let y0 = d * y + ty;
                    let x1 = a * xMax + tx;
                    let y1 = d * y + ty;
                    let x2 = a * xMax + tx;
                    let y2 = d * yMax + ty;
                    let x3 = a * x + tx;
                    let y3 = d * yMax + ty;

                    let tmp = 0;

                    if (x0 > x1) {
                        tmp = x0;
                        x0 = x1;
                        x1 = tmp;
                    }
                    if (x2 > x3) {
                        tmp = x2;
                        x2 = x3;
                        x3 = tmp;
                    }

                    minX = (x0 < x2 ? x0 : x2);
                    maxX = (x1 > x3 ? x1 : x3);

                    if (y0 > y1) {
                        tmp = y0;
                        y0 = y1;
                        y1 = tmp;
                    }
                    if (y2 > y3) {
                        tmp = y2;
                        y2 = y3;
                        y3 = tmp;
                    }

                    minY = (y0 < y2 ? y0 : y2);
                    maxY = (y1 > y3 ? y1 : y3);
                }
                context.enableScissor(minX + matrix.tx, -matrix.ty - maxY + buffer.height, maxX - minX, maxY - minY);
                scissor = true;
            }

            drawCalls += this.drawDisplayObject(displayObject, buffer, dirtyList, matrix, displayObject.$displayList, region, root);
            buffer.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);

            if (scissor) {
                context.disableScissor();
            } else {
                context.popMask();
            }

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
        public drawNodeToBuffer(node: sys.RenderNode, buffer: WebGLRenderBuffer, matrix: Matrix, forHitTest?: boolean): void {
            let webglBuffer: WebGLRenderBuffer = <WebGLRenderBuffer>buffer;

            //pushRenderTARGET
            webglBuffer.context.pushBuffer(webglBuffer);

            webglBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this.renderNode(node, buffer, forHitTest);
            webglBuffer.context.$drawWebGL();
            webglBuffer.onRenderFinish();

            //popRenderTARGET
            webglBuffer.context.popBuffer();
        }

        /**
         * @private
         */
        private renderNode(node: sys.RenderNode, buffer: WebGLRenderBuffer, forHitTest?: boolean): void {
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
                case sys.RenderNodeType.SetAlphaNode:
                    buffer.globalAlpha = node.drawData[0];
                    break;
                case sys.RenderNodeType.MeshNode:
                    this.renderMesh(<sys.MeshNode>node, buffer);
                    break;
            }
        }

        /**
         * @private
         */
        private renderBitmap(node: sys.BitmapNode, buffer: WebGLRenderBuffer): void {
            let image = node.image;
            if (!image) {
                return;
            }
            //buffer.imageSmoothingEnabled = node.smoothing;
            let data = node.drawData;
            let length = data.length;
            let pos = 0;
            let m = node.matrix;
            let blendMode = node.blendMode;
            let alpha = node.alpha;
            if (m) {
                buffer.saveTransform();
                buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            //这里不考虑嵌套
            if (blendMode) {
                buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
            }
            let originAlpha: number;
            if (alpha == alpha) {
                originAlpha = buffer.globalAlpha;
                buffer.globalAlpha *= alpha;
            }
            if (node.filter) {
                buffer.context.$filter = node.filter;
                while (pos < length) {
                    buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++],
                        data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                }
                buffer.context.$filter = null;
            }
            else {
                while (pos < length) {
                    buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++],
                        data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                }
            }
            if (blendMode) {
                buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
            }
            if (alpha == alpha) {
                buffer.globalAlpha = originAlpha;
            }
            if (m) {
                buffer.restoreTransform();
            }
        }

        /**
         * @private
         */
        private renderMesh(node: sys.MeshNode, buffer: WebGLRenderBuffer): void {
            let image = node.image;
            //buffer.imageSmoothingEnabled = node.smoothing;
            let data = node.drawData;
            let length = data.length;
            let pos = 0;
            let m = node.matrix;
            let blendMode = node.blendMode;
            let alpha = node.alpha;
            if (m) {
                buffer.saveTransform();
                buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            //这里不考虑嵌套
            if (blendMode) {
                buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
            }
            let originAlpha: number;
            if (alpha == alpha) {
                originAlpha = buffer.globalAlpha;
                buffer.globalAlpha *= alpha;
            }
            if (node.filter) {
                buffer.context.$filter = node.filter;
                while (pos < length) {
                    buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++],
                    data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.smoothing);
                }
                buffer.context.$filter = null;
            }
            else {
                while (pos < length) {
                    buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++],
                    data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.smoothing);
                }
            }
            if (blendMode) {
                buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
            }
            if (alpha == alpha) {
                buffer.globalAlpha = originAlpha;
            }
            if (m) {
                buffer.restoreTransform();
            }
        }

        private canvasRenderer: CanvasRenderer;
        private canvasRenderBuffer: CanvasRenderBuffer;

        /**
         * @private
         */
        private renderText(node: sys.TextNode, buffer: WebGLRenderBuffer): void {
            let width = node.width - node.x;
            let height = node.height - node.y;
            let pixelRatio = sys.DisplayList.$pixelRatio;
            let maxTextureSize = buffer.context.$maxTextureSize;
            if (width * pixelRatio > maxTextureSize || height * pixelRatio > maxTextureSize) {
                pixelRatio *= width * pixelRatio > height * pixelRatio ? maxTextureSize / (width * pixelRatio) : maxTextureSize / (height * pixelRatio);
            }
            width *= pixelRatio;
            height *= pixelRatio;
            let x = node.x * pixelRatio;
            let y = node.y * pixelRatio;
            if (node.drawData.length == 0) {
                return;
            }

            if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                this.canvasRenderer = new CanvasRenderer();
                this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
                if (pixelRatio != 1) {
                    this.canvasRenderBuffer.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                }
            }
            else if (node.dirtyRender) {
                this.canvasRenderBuffer.resize(width, height);
            }

            if (!this.canvasRenderBuffer.context) {
                return;
            }

            if (x || y) {
                if (node.dirtyRender) {
                    this.canvasRenderBuffer.context.setTransform(pixelRatio, 0, 0, pixelRatio, -x, -y);
                }
                buffer.transform(1, 0, 0, 1, x / pixelRatio, y / pixelRatio);
            }


            if (node.dirtyRender) {
                let surface = this.canvasRenderBuffer.surface;
                this.canvasRenderer.renderText(node, this.canvasRenderBuffer.context);

                // 拷贝canvas到texture
                let texture = node.$texture;
                if (!texture) {
                    texture = buffer.context.createTexture(<BitmapData><any>surface);
                    node.$texture = texture;
                } else {
                    // 重新拷贝新的图像
                    buffer.context.updateTexture(texture, <BitmapData><any>surface);
                }
                // 保存材质尺寸
                node.$textureWidth = surface.width;
                node.$textureHeight = surface.height;
            }

            let textureWidth = node.$textureWidth;
            let textureHeight = node.$textureHeight;
            buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / pixelRatio, textureHeight / pixelRatio, textureWidth, textureHeight);

            if (x || y) {
                if (node.dirtyRender) {
                    this.canvasRenderBuffer.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                }
                buffer.transform(1, 0, 0, 1, -x / pixelRatio, -y / pixelRatio);
            }
            node.dirtyRender = false;
        }

        /**
         * @private
         */
        private renderGraphics(node: sys.GraphicsNode, buffer: WebGLRenderBuffer, forHitTest?: boolean): void {
            let width = node.width;
            let height = node.height;
            if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                return;
            }
            if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                this.canvasRenderer = new CanvasRenderer();
                this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
            }
            else if (node.dirtyRender || forHitTest) {
                this.canvasRenderBuffer.resize(width, height);
            }
            if (!this.canvasRenderBuffer.context) {
                return;
            }
            if (node.x || node.y) {
                if (node.dirtyRender || forHitTest) {
                    this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                }
                buffer.transform(1, 0, 0, 1, node.x, node.y);
            }
            let surface = this.canvasRenderBuffer.surface;
            if (forHitTest) {
                this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context, true);
                WebGLUtils.deleteWebGLTexture(surface);
                let texture = buffer.context.getWebGLTexture(<BitmapData><any>surface);
                buffer.context.drawTexture(texture, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height);
            } else {
                if (node.dirtyRender) {
                    this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context);

                    // 拷贝canvas到texture
                    let texture: WebGLTexture = node.$texture;
                    if (!texture) {
                        texture = buffer.context.createTexture(<BitmapData><any>surface);
                        node.$texture = texture;
                    } else {
                        // 重新拷贝新的图像
                        buffer.context.updateTexture(texture, <BitmapData><any>surface);
                    }
                    // 保存材质尺寸
                    node.$textureWidth = surface.width;
                    node.$textureHeight = surface.height;
                }
                let textureWidth = node.$textureWidth;
                let textureHeight = node.$textureHeight;
                buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth, textureHeight, textureWidth, textureHeight);
            }

            if (node.x || node.y) {
                if (node.dirtyRender || forHitTest) {
                    this.canvasRenderBuffer.context.translate(node.x, node.y);
                }
                buffer.transform(1, 0, 0, 1, -node.x, -node.y);
            }
            if (!forHitTest) {
                node.dirtyRender = false;
            }
        }

        private renderGroup(groupNode: sys.GroupNode, buffer: WebGLRenderBuffer): void {
            let m = groupNode.matrix;
            if (m) {
                buffer.saveTransform();
                buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }

            let children = groupNode.drawData;
            let length = children.length;
            for (let i = 0; i < length; i++) {
                let node: sys.RenderNode = children[i];
                this.renderNode(node, buffer);
            }

            if (m) {
                buffer.restoreTransform();
            }
        }

        /**
         * @private
         */
        private createRenderBuffer(width: number, height: number): WebGLRenderBuffer {
            let buffer = renderBufferPool.pop();
            if (buffer) {
                buffer.resize(width, height);
            }
            else {
                buffer = new WebGLRenderBuffer(width, height);
                buffer.$computeDrawCall = false;
            }
            return buffer;
        }
    }
}
