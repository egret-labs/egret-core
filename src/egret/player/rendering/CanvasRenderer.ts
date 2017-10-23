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

/**
 * @private
 */
interface CanvasRenderingContext2D {
    imageSmoothingEnabled: boolean;
    $imageSmoothingEnabled: boolean;
}

namespace egret {

    let blendModes = ["source-over", "lighter", "destination-out"];
    let defaultCompositeOp = "source-over";
    let BLACK_COLOR = "#000000";
    let CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
    let renderBufferPool: sys.RenderBuffer[] = [];//渲染缓冲区对象池
    let renderBufferPool_Filters: sys.RenderBuffer[] = [];//滤镜缓冲区对象池
    /**
     * @private
     * Canvas渲染器
     */
    export class CanvasRenderer implements sys.SystemRenderer {

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
            let context = buffer.context;
            let root: DisplayObject = forRenderTexture ? displayObject : null;
            //绘制显示对象
            let drawCall = this.drawDisplayObject(displayObject, context, dirtyList, matrix, null, null, root);
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
                if (renderBufferPool_Filters.length > 1) {
                    renderBufferPool_Filters.length = 1;
                    renderBufferPool_Filters[0].resize(0, 0);
                }
            }
            return drawCall;
        }

        /**
         * @private
         * 绘制一个显示对象
         */
        private drawDisplayObject(displayObject: DisplayObject, context: CanvasRenderingContext2D, dirtyList: egret.sys.Region[],
            matrix: Matrix, displayList: sys.DisplayList, clipRegion: sys.Region, root: DisplayObject): number {
            let drawCalls = 0;
            let node: sys.RenderNode;
            if (displayList && !root) {
                if (displayList.isDirty ||
                    displayList.$canvasScaleX != sys.DisplayList.$canvasScaleX ||
                    displayList.$canvasScaleY != sys.DisplayList.$canvasScaleY) {
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
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    Matrix.release(m);
                    context.globalAlpha = renderAlpha;
                    drawCalls += this.renderNode(node, context);
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
                        drawCalls += this.drawWithFilter(child, context, dirtyList, matrix, clipRegion, root);
                    }
                    else if ((child.$blendMode !== 0 ||
                        (child.$mask && (child.$mask.$parentDisplayList || root)))) {//若遮罩不在显示列表中，放弃绘制遮罩。
                        drawCalls += this.drawWithClip(child, context, dirtyList, matrix, clipRegion, root);
                    }
                    else if (child.$scrollRect || child.$maskRect) {
                        drawCalls += this.drawWithScrollRect(child, context, dirtyList, matrix, clipRegion, root);
                    }
                    else {
                        if (child["isFPS"]) {
                            this.drawDisplayObject(child, context, dirtyList, matrix, child.$displayList, clipRegion, root);
                        }
                        else {
                            drawCalls += this.drawDisplayObject(child, context, dirtyList, matrix,
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
        private drawWithFilter(displayObject: DisplayObject, context: CanvasRenderingContext2D, dirtyList: egret.sys.Region[],
            matrix: Matrix, clipRegion: sys.Region, root: DisplayObject): number {

            if (Capabilities.runtimeType == RuntimeType.NATIVE) { // for native
                let drawCalls = 0;
                let filters = displayObject.$getFilters();
                let hasBlendMode = (displayObject.$blendMode !== 0);
                let compositeOp: string;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }

                let bounds = displayObject.$getOriginalBounds();
                if (bounds.width <= 0 || bounds.height <= 0) {
                    return drawCalls;
                }

                if (filters.length == 1 && filters[0].type == "colorTransform" && !displayObject.$children) {
                    if (hasBlendMode) {
                        context.globalCompositeOperation = compositeOp;
                    }

                    (<any>context).setGlobalShader(filters[0]);

                    if (displayObject.$mask && (displayObject.$mask.$parentDisplayList || root)) {
                        drawCalls += this.drawWithClip(displayObject, context, dirtyList, matrix, clipRegion, root);
                    }
                    else if (displayObject.$scrollRect || displayObject.$maskRect) {
                        drawCalls += this.drawWithScrollRect(displayObject, context, dirtyList, matrix, clipRegion, root);
                    }
                    else {
                        drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, matrix, displayObject.$displayList, clipRegion, root);
                    }

                    (<any>context).setGlobalShader(null);

                    if (hasBlendMode) {
                        context.globalCompositeOperation = defaultCompositeOp;
                    }

                    return drawCalls;
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
                region.updateRegion(bounds, displayMatrix);

                // 为显示对象创建一个新的buffer
                // todo 这里应该计算 region.x region.y
                let displayBuffer = this.createRenderBuffer(region.width, region.height);
                displayBuffer.context.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                let offsetM = Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);

                if (displayObject.$mask && (displayObject.$mask.$parentDisplayList || root)) {
                    drawCalls += this.drawWithClip(displayObject, displayBuffer.context, dirtyList, offsetM, region, root);
                }
                else if (displayObject.$scrollRect || displayObject.$maskRect) {
                    drawCalls += this.drawWithScrollRect(displayObject, displayBuffer.context, dirtyList, offsetM, region, root);
                }
                else {
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer.context, dirtyList, offsetM, displayObject.$displayList, region, root);
                }

                Matrix.release(offsetM);

                //绘制结果到屏幕
                if (drawCalls > 0) {

                    if (hasBlendMode) {
                        context.globalCompositeOperation = compositeOp;
                    }

                    drawCalls++;
                    context.globalAlpha = 1;
                    context.setTransform(1, 0, 0, 1, region.minX + matrix.tx, region.minY + matrix.ty);
                    // 绘制结果的时候，应用滤镜
                    (<any>context).setGlobalShader(filters[0]);
                    context.drawImage(displayBuffer.surface, 0, 0, displayBuffer.width, displayBuffer.height, 0, 0, displayBuffer.width, displayBuffer.height);
                    (<any>context).setGlobalShader(null);

                    if (hasBlendMode) {
                        context.globalCompositeOperation = defaultCompositeOp;
                    }

                }

                renderBufferPool.push(displayBuffer);
                sys.Region.release(region);
                Matrix.release(displayMatrix);

                return drawCalls;
            }

            let drawCalls = 0;
            let filters = displayObject.$getFilters();
            let filtersLen: number = filters.length;
            let hasBlendMode = (displayObject.$blendMode !== 0);
            let compositeOp: string;
            if (hasBlendMode) {
                compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }

            let bounds = displayObject.$getOriginalBounds();
            if (bounds.width <= 0 || bounds.height <= 0) {
                return drawCalls;
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
            region.updateRegion(bounds, displayMatrix);

            // 为显示对象创建一个新的buffer
            // todo 这里应该计算 region.x region.y
            let displayBuffer = this.createRenderBuffer(region.width * matrix.a, region.height * matrix.d, true);
            let displayContext = displayBuffer.context;
            displayContext.setTransform(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
            let offsetM = Matrix.create().setTo(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);

            //todo 可以优化减少draw次数
            if (displayObject.$mask && (displayObject.$mask.$parentDisplayList || root)) {
                drawCalls += this.drawWithClip(displayObject, displayContext, dirtyList, offsetM, region, root);
            }
            else if (displayObject.$scrollRect || displayObject.$maskRect) {
                drawCalls += this.drawWithScrollRect(displayObject, displayContext, dirtyList, offsetM, region, root);
            }
            else {
                drawCalls += this.drawDisplayObject(displayObject, displayContext, dirtyList, offsetM, displayObject.$displayList, region, root);
            }

            Matrix.release(offsetM);

            //绘制结果到屏幕
            if (drawCalls > 0) {

                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }

                drawCalls++;

                // 应用滤镜
                let imageData = displayContext.getImageData(0, 0, displayBuffer.surface.width, displayBuffer.surface.height);
                for (let i = 0; i < filtersLen; i++) {
                    let filter = filters[i];

                    if (filter.type == "colorTransform") {
                        colorFilter(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, (<ColorMatrixFilter>filter).$matrix);
                    } else if (filter.type == "blur") {
                        blurFilter(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, (<BlurFilter>filter).$blurX, (<BlurFilter>filter).$blurY);
                    } else if (filter.type == "glow") {
                        let r = (<GlowFilter>filter).$red;
                        let g = (<GlowFilter>filter).$green;
                        let b = (<GlowFilter>filter).$blue;
                        let a = (<GlowFilter>filter).$alpha;
                        if ((<GlowFilter>filter).$inner || (<GlowFilter>filter).$knockout || (<DropShadowFilter>filter).$hideObject) {
                            dropShadowFilter2(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, [r / 255, g / 255, b / 255, a], (<GlowFilter>filter).$blurX, (<GlowFilter>filter).$blurY,
                                (<DropShadowFilter>filter).$angle ? ((<DropShadowFilter>filter).$angle / 180 * Math.PI) : 0, (<DropShadowFilter>filter).$distance || 0, (<GlowFilter>filter).$strength, (<GlowFilter>filter).$inner ? 1 : 0, (<GlowFilter>filter).$knockout ? 0 : 1, (<DropShadowFilter>filter).$hideObject ? 1 : 0);
                        } else {
                            // 如果没有高级效果，使用性能比较高的方式
                            dropShadowFilter(imageData.data, displayBuffer.surface.width, displayBuffer.surface.height, [r / 255, g / 255, b / 255, a], (<GlowFilter>filter).$blurX, (<GlowFilter>filter).$blurY, (<DropShadowFilter>filter).$angle ? ((<DropShadowFilter>filter).$angle / 180 * Math.PI) : 0, (<DropShadowFilter>filter).$distance || 0, (<GlowFilter>filter).$strength);
                        }
                    } else if (filter.type == "custom") {
                        // 目前canvas渲染不支持自定义滤镜
                    }
                }
                displayContext.putImageData(imageData, 0, 0);

                context.globalAlpha = 1;
                context.setTransform(1, 0, 0, 1, (region.minX + matrix.tx) * matrix.a, (region.minY + matrix.ty) * matrix.d);
                // 绘制结果的时候，应用滤镜
                context.drawImage(<any>displayBuffer.surface, 0, 0);

                if (hasBlendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }

            }

            renderBufferPool_Filters.push(displayBuffer);
            sys.Region.release(region);
            Matrix.release(displayMatrix);

            return drawCalls;
        }

        private renderingMask = false;

        /**
         * @private
         */
        private drawWithClip(displayObject: DisplayObject, context: CanvasRenderingContext2D, dirtyList: egret.sys.Region[],
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
            let maskRenderNode: sys.RenderNode;
            if (mask) {
                maskRenderNode = mask.$getRenderNode();
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
            if (root) {
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
                if (root) {
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
            if (region.width <= 0 || region.height <= 0) {
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
                Matrix.release(displayMatrix);
                return drawCalls;
            }

            //没有遮罩,同时显示对象没有子项
            if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                if (scrollRect) {
                    let m = displayMatrix;
                    context.save();
                    matrix.$preMultiplyInto(m, m);
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    context.beginPath();
                    context.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
                    context.clip();
                }

                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }
                drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, matrix,
                    displayObject.$displayList, clipRegion, root);
                if (hasBlendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
                if (scrollRect) {
                    context.restore();
                }
                sys.Region.release(region);
                Matrix.release(displayMatrix);
                return drawCalls;
            }

            //遮罩是单纯的填充图形,且alpha为1,性能优化
            //todo 平台差异
            if (mask && Capabilities.$runtimeType == RuntimeType.WEB && (!mask.$children || mask.$children.length == 0) &&
                maskRenderNode && maskRenderNode.type == sys.RenderNodeType.GraphicsNode &&
                maskRenderNode.drawData.length == 1 &&
                (<sys.Path2D>maskRenderNode.drawData[0]).type == sys.PathType.Fill &&
                (<sys.FillPath>maskRenderNode.drawData[0]).fillAlpha == 1) {
                this.renderingMask = true;
                context.save();
                let calls = this.drawDisplayObject(mask, context, dirtyList, matrix,
                    mask.$displayList, clipRegion, root);
                this.renderingMask = false;
                if (scrollRect) {
                    let m = displayMatrix;
                    matrix.$preMultiplyInto(m, m);
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    context.beginPath();
                    context.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
                    context.clip();
                }
                calls += this.drawDisplayObject(displayObject, context, dirtyList, matrix,
                    displayObject.$displayList, clipRegion, root);
                context.restore();
                sys.Region.release(region);
                Matrix.release(displayMatrix);
                return calls;
            }

            //todo 若显示对象是容器，同时子项有混合模式，则需要先绘制背景到displayBuffer并清除背景区域

            //绘制显示对象自身，若有scrollRect，应用clip
            let displayBuffer = this.createRenderBuffer(region.width * matrix.a, region.height * matrix.d);
            let displayContext = displayBuffer.context;
            if (!displayContext) {//RenderContext创建失败，放弃绘制遮罩。
                drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, matrix,
                    displayObject.$displayList, clipRegion, root);
                sys.Region.release(region);
                Matrix.release(displayMatrix);
                return drawCalls;
            }
            displayContext.setTransform(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
            let offsetM = Matrix.create().setTo(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);

            drawCalls += this.drawDisplayObject(displayObject, displayContext, dirtyList, offsetM,
                displayObject.$displayList, region, root);
            //绘制遮罩
            if (mask) {
                //如果只有一次绘制或是已经被cache直接绘制到displayContext
                if (Capabilities.$runtimeType == RuntimeType.WEB && maskRenderNode && maskRenderNode.$getRenderCount() == 1 || mask.$displayList) {
                    displayContext.globalCompositeOperation = "destination-in";
                    drawCalls += this.drawDisplayObject(mask, displayContext, dirtyList, offsetM,
                        mask.$displayList, region, root);
                }
                else {
                    let maskBuffer = this.createRenderBuffer(region.width * matrix.a, region.height * matrix.d);
                    let maskContext = maskBuffer.context;
                    if (!maskContext) {//RenderContext创建失败，放弃绘制遮罩。
                        drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, matrix,
                            displayObject.$displayList, clipRegion, root);
                        renderBufferPool.push(displayBuffer);
                        sys.Region.release(region);
                        Matrix.release(displayMatrix);
                        return drawCalls;
                    }
                    maskContext.setTransform(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                    offsetM = Matrix.create().setTo(matrix.a, 0, 0, matrix.d, -region.minX * matrix.a, -region.minY * matrix.d);
                    drawCalls += this.drawDisplayObject(mask, maskContext, dirtyList, offsetM,
                        mask.$displayList, region, root);
                    displayContext.globalCompositeOperation = "destination-in";
                    displayContext.setTransform(1, 0, 0, 1, 0, 0);
                    displayContext.globalAlpha = 1;
                    displayContext.drawImage(<any>maskBuffer.surface, 0, 0);
                    renderBufferPool.push(maskBuffer);
                }
            }
            Matrix.release(offsetM);

            //绘制结果到屏幕
            if (drawCalls > 0) {
                drawCalls++;
                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }
                if (scrollRect) {
                    let m = displayMatrix;
                    context.save();
                    matrix.$preMultiplyInto(m, m);
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    context.beginPath();
                    context.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
                    context.clip();
                }
                context.globalAlpha = 1;
                context.setTransform(1, 0, 0, 1, (region.minX + matrix.tx) * matrix.a, (region.minY + matrix.ty) * matrix.d);
                context.drawImage(<any>displayBuffer.surface, 0, 0);
                if (scrollRect) {
                    context.restore();
                }
                if (hasBlendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
            }
            renderBufferPool.push(displayBuffer);
            sys.Region.release(region);
            Matrix.release(displayMatrix);
            return drawCalls;
        }

        /**
         * @private
         */
        private drawWithScrollRect(displayObject: DisplayObject, context: CanvasRenderingContext2D, dirtyList: egret.sys.Region[],
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
            context.save();
            matrix.$preMultiplyInto(m, m);
            context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            context.beginPath();
            context.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
            context.clip();
            drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, matrix, displayObject.$displayList, region, root);
            context.restore();

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
        public drawNodeToBuffer(node: sys.RenderNode, buffer: sys.RenderBuffer, matrix: Matrix, forHitTest?: boolean): void {
            let context = buffer.context;
            context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this.renderNode(node, context, forHitTest);
        }

        /**
         * @private
         */
        private renderNode(node: sys.RenderNode, context: any, forHitTest?: boolean): number {
            let drawCalls = 0;
            switch (node.type) {
                case sys.RenderNodeType.BitmapNode:
                    drawCalls = this.renderBitmap(<sys.BitmapNode>node, context);
                    break;
                case sys.RenderNodeType.TextNode:
                    drawCalls = 1;
                    this.renderText(<sys.TextNode>node, context);
                    break;
                case sys.RenderNodeType.GraphicsNode:
                    drawCalls = this.renderGraphics(<sys.GraphicsNode>node, context, forHitTest);
                    break;
                case sys.RenderNodeType.GroupNode:
                    drawCalls = this.renderGroup(<sys.GroupNode>node, context);
                    break;
                case sys.RenderNodeType.SetAlphaNode:
                    context.globalAlpha = node.drawData[0];
                    break;
                case sys.RenderNodeType.MeshNode:
                    drawCalls = this.renderMesh(<sys.MeshNode>node, context);
                    break;
            }
            return drawCalls;
        }

        /** 
         * render mesh 
         */
        private renderMesh(node: sys.MeshNode, context: any): number {
            if (Capabilities.runtimeType != RuntimeType.NATIVE) {
                return 0;
            }
            let image = node.image;
            let data = node.drawData;
            let length = data.length;
            let pos = 0;
            let m = node.matrix;
            let blendMode = node.blendMode;
            let alpha = node.alpha;
            let saved = false;
            if (m) {
                context.saveTransform();
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            if (blendMode) {
                context.globalCompositeOperation = blendModes[blendMode];
            }
            let originAlpha: number;
            if (alpha == alpha) {
                originAlpha = context.globalAlpha;
                context.globalAlpha *= alpha;
            }

            let drawCalls: number = 0;
            let filter = node.filter;
            if (filter) {
                egret_native.Graphics.setGlobalShader(filter);
                while (pos < length) {
                    drawCalls++;
                    context.drawMesh(image.source, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++],
                        data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds);
                }
                egret_native.Graphics.setGlobalShader(null);
            }
            else {
                while (pos < length) {
                    drawCalls++;
                    context.drawMesh(image.source, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++],
                        data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds);
                }
            }
            if (m) {
                context.restoreTransform();
            }
            if (blendMode) {
                context.globalCompositeOperation = defaultCompositeOp;
            }
            if (alpha == alpha) {
                context.globalAlpha = originAlpha;
            }
            return 1;
        }


        /**
         * @private
         */
        private renderBitmap(node: sys.BitmapNode, context: CanvasRenderingContext2D): number {
            let image = node.image;
            if (!image || !image.source) {
                return 0;
            }
            if (context.$imageSmoothingEnabled != node.smoothing) {
                context.imageSmoothingEnabled = node.smoothing;
                context.$imageSmoothingEnabled = node.smoothing;
            }
            let data = node.drawData;
            let length = data.length;
            let pos = 0;
            let m = node.matrix;
            let blendMode = node.blendMode;
            let alpha = node.alpha;

            let saved = false;
            if (m) {
                if ((<any>context).saveTransform) {//for native
                    (<any>context).saveTransform();
                }
                else {
                    context.save();
                }
                saved = true;
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            //这里不考虑嵌套
            if (blendMode) {
                context.globalCompositeOperation = blendModes[blendMode];
            }
            let originAlpha: number;
            if (alpha == alpha) {
                originAlpha = context.globalAlpha;
                context.globalAlpha *= alpha;
            }
            let drawCalls: number = 0;
            let filter = node.filter;
            //todo 暂时只考虑绘制一次的情况
            if (filter && length == 8) {
                if (Capabilities.runtimeType == RuntimeType.NATIVE) { // for native
                    egret_native.Graphics.setGlobalShader(filter);
                    drawCalls++;
                    if (node.rotated) {
                        let sourceX = data[0];
                        let sourceY = data[1];
                        let sourceHeight = data[2];
                        let sourceWidth = data[3];
                        let offsetX = data[4];
                        let offsetY = data[5];
                        let destHeight = data[6];
                        let destWidth = data[7];
                        if ((<any>context).saveTransform) {//for native
                            (<any>context).saveTransform();
                        }
                        else {
                            context.save();
                        }
                        context.transform(0, -1, 1, 0, 0, destWidth);
                        context.drawImage(image.source, sourceX, sourceY, sourceWidth, sourceHeight, offsetX, offsetY, destWidth, destHeight);
                        if ((<any>context).restoreTransform) {//for native
                            (<any>context).restoreTransform();
                        }
                        else {
                            context.restore();
                        }
                    }
                    else {
                        context.drawImage(image.source, data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
                    }
                    egret_native.Graphics.setGlobalShader(null);
                }
                else {
                    let sourceX = data[0];
                    let sourceY = data[1];
                    let sourceWidth = data[2];
                    let sourceHeight = data[3];
                    let offsetX = data[4];
                    let offsetY = data[5];
                    let destWidth = data[6];
                    let destHeight = data[7];
                    if (node.rotated) {
                        sourceWidth = data[3];
                        sourceHeight = data[2];
                        destWidth = data[7];
                        destHeight = data[6];
                    }
                    let displayBuffer = this.createRenderBuffer(destWidth, destHeight);
                    let displayContext = displayBuffer.context;
                    drawCalls++;
                    if (node.rotated) {
                        context.transform(0, -1, 1, 0, 0, destWidth);
                    }
                    displayContext.drawImage(image.source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, destWidth, destHeight);
                    //绘制结果到屏幕
                    drawCalls++;
                    // 应用滤镜
                    let imageData = displayContext.getImageData(0, 0, destWidth, destHeight);
                    colorFilter(imageData.data, destWidth, destHeight, (<ColorMatrixFilter>filter).$matrix);
                    displayContext.putImageData(imageData, 0, 0);
                    // 绘制结果的时候，应用滤镜
                    context.drawImage(<any>displayBuffer.surface, 0, 0, destWidth, destHeight, offsetX, offsetY, destWidth, destHeight);
                    renderBufferPool.push(displayBuffer);
                }
            }
            else {
                while (pos < length) {
                    drawCalls++;
                    if (node.rotated) {
                        let sourceX = data[pos++];
                        let sourceY = data[pos++];
                        let sourceHeight = data[pos++];
                        let sourceWidth = data[pos++];
                        let offsetX = data[pos++];
                        let offsetY = data[pos++];
                        let destHeight = data[pos++];
                        let destWidth = data[pos++];
                        if ((<any>context).saveTransform) {//for native
                            (<any>context).saveTransform();
                        }
                        else {
                            context.save();
                        }
                        context.transform(0, -1, 1, 0, 0, destWidth);
                        context.drawImage(image.source, sourceX, sourceY, sourceWidth, sourceHeight, offsetX, offsetY, destWidth, destHeight);
                        if ((<any>context).restoreTransform) {//for native
                            (<any>context).restoreTransform();
                        }
                        else {
                            context.restore();
                        }
                    }
                    else {
                        context.drawImage(image.source, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++]);
                    }
                }
            }
            if (saved) {
                if ((<any>context).restoreTransform) {//for native
                    (<any>context).restoreTransform();
                    if (blendMode) {
                        context.globalCompositeOperation = defaultCompositeOp;
                    }
                    if (alpha == alpha) {
                        context.globalAlpha = originAlpha;
                    }
                }
                else {
                    context.restore();
                }
            }
            else {
                if (blendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
                if (alpha == alpha) {
                    context.globalAlpha = originAlpha;
                }
            }
            return drawCalls;
        }

        /**
         * @private
         */
        public renderText(node: sys.TextNode, context: CanvasRenderingContext2D): void {
            context.textAlign = "left";
            context.textBaseline = "middle";
            context.lineJoin = "round";//确保描边样式是圆角
            let drawData = node.drawData;
            let length = drawData.length;
            let pos = 0;
            while (pos < length) {
                let x = drawData[pos++];
                let y = drawData[pos++];
                let text = drawData[pos++];
                let format: sys.TextFormat = drawData[pos++];
                context.font = getFontString(node, format);
                let textColor = format.textColor == null ? node.textColor : format.textColor;
                let strokeColor = format.strokeColor == null ? node.strokeColor : format.strokeColor;
                let stroke = format.stroke == null ? node.stroke : format.stroke;
                context.fillStyle = toColorString(textColor);
                context.strokeStyle = toColorString(strokeColor);
                if (stroke) {
                    context.lineWidth = stroke * 2;
                    context.strokeText(text, x, y);
                }
                context.fillText(text, x, y);
            }
        }

        /**
         * @private
         */
        public renderGraphics(node: sys.GraphicsNode, context: CanvasRenderingContext2D, forHitTest?: boolean): number {
            let drawData = node.drawData;
            let length = drawData.length;
            forHitTest = !!forHitTest;
            for (let i = 0; i < length; i++) {
                let path: sys.Path2D = drawData[i];
                switch (path.type) {
                    case sys.PathType.Fill:
                        let fillPath = <sys.FillPath>path;
                        context.fillStyle = forHitTest ? BLACK_COLOR : getRGBAString(fillPath.fillColor, fillPath.fillAlpha);
                        this.renderPath(path, context);
                        if (this.renderingMask) {
                            context.clip();
                        }
                        else {
                            context.fill();
                        }
                        break;
                    case sys.PathType.GradientFill:
                        let g = <sys.GradientFillPath>path;
                        context.fillStyle = forHitTest ? BLACK_COLOR : getGradient(context, g.gradientType, g.colors, g.alphas, g.ratios, g.matrix);
                        context.save();
                        let m = g.matrix;
                        this.renderPath(path, context);
                        context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        context.fill();
                        context.restore();
                        break;
                    case sys.PathType.Stroke:
                        let strokeFill = <sys.StrokePath>path;
                        let lineWidth = strokeFill.lineWidth;
                        context.lineWidth = lineWidth;
                        context.strokeStyle = forHitTest ? BLACK_COLOR : getRGBAString(strokeFill.lineColor, strokeFill.lineAlpha);
                        context.lineCap = CAPS_STYLES[strokeFill.caps];
                        context.lineJoin = strokeFill.joints;
                        context.miterLimit = strokeFill.miterLimit;
                        //对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
                        let isSpecialCaseWidth = lineWidth === 1 || lineWidth === 3;
                        if (isSpecialCaseWidth) {
                            context.translate(0.5, 0.5);
                        }
                        this.renderPath(path, context);
                        context.stroke();
                        if (isSpecialCaseWidth) {
                            context.translate(-0.5, -0.5);
                        }
                        break;
                }
            }
            return length == 0 ? 0 : 1;
        }

        private renderPath(path: sys.Path2D, context: CanvasRenderingContext2D): void {
            context.beginPath();
            let data = path.$data;
            let commands = path.$commands;
            let commandCount = commands.length;
            let pos = 0;
            for (let commandIndex = 0; commandIndex < commandCount; commandIndex++) {
                let command = commands[commandIndex];
                switch (command) {
                    case sys.PathCommand.CubicCurveTo:
                        context.bezierCurveTo(data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++]);
                        break;
                    case sys.PathCommand.CurveTo:
                        context.quadraticCurveTo(data[pos++], data[pos++], data[pos++], data[pos++]);
                        break;
                    case sys.PathCommand.LineTo:
                        context.lineTo(data[pos++], data[pos++]);
                        break;
                    case sys.PathCommand.MoveTo:
                        context.moveTo(data[pos++], data[pos++]);
                        break;
                }
            }
        }


        private renderGroup(groupNode: sys.GroupNode, context: CanvasRenderingContext2D): number {
            let m = groupNode.matrix;
            let saved = false;
            if (m) {
                if ((<any>context).saveTransform) {//for native
                    (<any>context).saveTransform();
                }
                else {
                    context.save();
                }
                saved = true;
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }

            let drawCalls: number = 0;
            let children = groupNode.drawData;
            let length = children.length;
            for (let i = 0; i < length; i++) {
                let node: sys.RenderNode = children[i];
                drawCalls += this.renderNode(node, context);
            }

            if (saved) {
                if ((<any>context).restoreTransform) {//for native
                    (<any>context).restoreTransform();
                }
                else {
                    context.restore();
                }
            }
            return drawCalls;
        }

        /**
         * @private
         */
        private createRenderBuffer(width: number, height: number, useForFilters?: boolean): sys.RenderBuffer {
            let buffer = useForFilters ? renderBufferPool_Filters.pop() : renderBufferPool.pop();
            if (buffer) {
                buffer.resize(width, height, true);
            }
            else {
                buffer = new sys.CanvasRenderBuffer(width, height);
            }
            return buffer;
        }
    }

    /**
     * @private
     * 获取字体字符串
     */
    function getFontString(node: sys.TextNode, format: sys.TextFormat): string {
        let italic: boolean = format.italic == null ? node.italic : format.italic;
        let bold: boolean = format.bold == null ? node.bold : format.bold;
        let size: number = format.size == null ? node.size : format.size;
        let fontFamily: string = format.fontFamily || node.fontFamily;
        let font: string = italic ? "italic " : "normal ";
        font += bold ? "bold " : "normal ";
        font += size + "px " + fontFamily;
        return font;
    }

    /**
     * @private
     * 获取RGBA字符串
     */
    function getRGBAString(color: number, alpha: number): string {
        let red = color >> 16;
        let green = (color >> 8) & 0xFF;
        let blue = color & 0xFF;
        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }

    /**
     * @private
     * 获取渐变填充样式对象
     */
    function getGradient(context: CanvasRenderingContext2D, type: string, colors: number[],
        alphas: number[], ratios: number[], matrix: Matrix): CanvasGradient {
        let gradient: CanvasGradient;
        if (type == GradientType.LINEAR) {
            gradient = context.createLinearGradient(-1, 0, 1, 0);
        }
        else {
            gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
        }
        //todo colors alphas ratios数量不一致情况处理
        let l = colors.length;
        for (let i = 0; i < l; i++) {
            gradient.addColorStop(ratios[i] / 255, getRGBAString(colors[i], alphas[i]));
        }
        return gradient;
    }

    // 判断浏览器是否支持 Uint8ClampedArray
    let use8Clamp = false;
    try {
        use8Clamp = (typeof Uint8ClampedArray !== undefined);
    } catch (e) { }

    function setArray(a, b, index: number = 0): void {
        for (let i = 0, l = b.length; i < l; i++) {
            a[i + index] = b[i];
        }
    }

    /**
     * @private
     */
    function colorFilter(buffer, w, h, matrix) {
        let r0 = matrix[0], r1 = matrix[1], r2 = matrix[2], r3 = matrix[3], r4 = matrix[4];
        let g0 = matrix[5], g1 = matrix[6], g2 = matrix[7], g3 = matrix[8], g4 = matrix[9];
        let b0 = matrix[10], b1 = matrix[11], b2 = matrix[12], b3 = matrix[13], b4 = matrix[14];
        let a0 = matrix[15], a1 = matrix[16], a2 = matrix[17], a3 = matrix[18], a4 = matrix[19];
        for (let p = 0, e = w * h * 4; p < e; p += 4) {
            let r = buffer[p + 0];
            let g = buffer[p + 1];
            let b = buffer[p + 2];
            let a = buffer[p + 3];

            buffer[p + 0] = r0 * r + r1 * g + r2 * b + r3 * a + r4;
            buffer[p + 1] = g0 * r + g1 * g + g2 * b + g3 * a + g4;
            buffer[p + 2] = b0 * r + b1 * g + b2 * b + b3 * a + b4;
            buffer[p + 3] = a0 * r + a1 * g + a2 * b + a3 * a + a4;
        }
    }

    /**
     * @private
     */
    function blurFilter(buffer, w, h, blurX, blurY) {
        blurFilterH(buffer, w, h, blurX);
        blurFilterV(buffer, w, h, blurY);
    }

    /**
     * @private
     */
    function blurFilterH(buffer, w, h, blurX) {
        let lineBuffer;
        if (use8Clamp) {
            lineBuffer = new Uint8ClampedArray(w * 4);
        } else {
            lineBuffer = new Array(w * 4);
        }
        let lineSize = w * 4;
        let windowLength = (blurX * 2) + 1;
        let windowSize = windowLength * 4;
        for (let y = 0; y < h; y++) {
            let pLineStart = y * lineSize;
            let rs = 0, gs = 0, bs = 0, _as = 0, alpha = 0, alpha2 = 0;
            // Fill window
            for (let ptr = -blurX * 4, end = blurX * 4 + 4; ptr < end; ptr += 4) {
                let key = pLineStart + ptr;
                if (key < pLineStart || key >= pLineStart + lineSize) {
                    continue;
                }
                alpha = buffer[key + 3];
                rs += buffer[key + 0] * alpha;
                gs += buffer[key + 1] * alpha;
                bs += buffer[key + 2] * alpha;
                _as += alpha;
            }
            // Slide window
            for (let ptr = pLineStart, end = pLineStart + lineSize, linePtr = 0, lastPtr = ptr - blurX * 4, nextPtr = ptr + (blurX + 1) * 4; ptr < end; ptr += 4, linePtr += 4, nextPtr += 4, lastPtr += 4) {

                if (_as === 0) {
                    lineBuffer[linePtr + 0] = 0;
                    lineBuffer[linePtr + 1] = 0;
                    lineBuffer[linePtr + 2] = 0;
                    lineBuffer[linePtr + 3] = 0;
                } else {
                    lineBuffer[linePtr + 0] = rs / _as;
                    lineBuffer[linePtr + 1] = gs / _as;
                    lineBuffer[linePtr + 2] = bs / _as;
                    lineBuffer[linePtr + 3] = _as / windowLength;
                }

                alpha = buffer[nextPtr + 3];
                alpha2 = buffer[lastPtr + 3];

                if (alpha || alpha == 0) {
                    if (alpha2 || alpha2 == 0) {
                        rs += buffer[nextPtr + 0] * alpha - buffer[lastPtr + 0] * alpha2;
                        gs += buffer[nextPtr + 1] * alpha - buffer[lastPtr + 1] * alpha2;
                        bs += buffer[nextPtr + 2] * alpha - buffer[lastPtr + 2] * alpha2;
                        _as += alpha - alpha2;
                    } else {
                        rs += buffer[nextPtr + 0] * alpha;
                        gs += buffer[nextPtr + 1] * alpha;
                        bs += buffer[nextPtr + 2] * alpha;
                        _as += alpha;
                    }
                } else {
                    if (alpha2 || alpha2 == 0) {
                        rs += - buffer[lastPtr + 0] * alpha2;
                        gs += - buffer[lastPtr + 1] * alpha2;
                        bs += - buffer[lastPtr + 2] * alpha2;
                        _as += - alpha2;
                    } else {
                        // do nothing
                    }
                }
            }
            // Copy line
            if (use8Clamp) {
                buffer.set(lineBuffer, pLineStart);
            } else {
                setArray(buffer, lineBuffer, pLineStart);
            }
        }
    }

    /**
     * @private
     */
    function blurFilterV(buffer, w, h, blurY) {
        let columnBuffer;
        if (use8Clamp) {
            columnBuffer = new Uint8ClampedArray(h * 4);
        } else {
            columnBuffer = new Array(h * 4);
        }
        let stride = w * 4;
        let windowLength = (blurY * 2) + 1;
        for (let x = 0; x < w; x++) {
            let pColumnStart = x * 4;
            let rs = 0, gs = 0, bs = 0, _as = 0, alpha = 0, alpha2 = 0;
            // Fill window
            for (let ptr = -blurY * stride, end = blurY * stride + stride; ptr < end; ptr += stride) {
                let key = pColumnStart + ptr;
                if (key < pColumnStart || key >= pColumnStart + h * stride) {
                    continue;
                }
                alpha = buffer[key + 3];
                rs += buffer[key + 0] * alpha;
                gs += buffer[key + 1] * alpha;
                bs += buffer[key + 2] * alpha;
                _as += alpha;
            }
            // Slide window
            for (let ptr = pColumnStart, end = pColumnStart + h * stride, columnPtr = 0, lastPtr = pColumnStart - blurY * stride, nextPtr = pColumnStart + ((blurY + 1) * stride); ptr < end; ptr += stride, columnPtr += 4, nextPtr += stride, lastPtr += stride) {

                if (_as === 0) {
                    columnBuffer[columnPtr + 0] = 0;
                    columnBuffer[columnPtr + 1] = 0;
                    columnBuffer[columnPtr + 2] = 0;
                    columnBuffer[columnPtr + 3] = 0;
                } else {
                    columnBuffer[columnPtr + 0] = rs / _as;
                    columnBuffer[columnPtr + 1] = gs / _as;
                    columnBuffer[columnPtr + 2] = bs / _as;
                    columnBuffer[columnPtr + 3] = _as / windowLength;
                }

                alpha = buffer[nextPtr + 3];
                alpha2 = buffer[lastPtr + 3];

                if (alpha || alpha == 0) {
                    if (alpha2 || alpha2 == 0) {
                        rs += buffer[nextPtr + 0] * alpha - buffer[lastPtr + 0] * alpha2;
                        gs += buffer[nextPtr + 1] * alpha - buffer[lastPtr + 1] * alpha2;
                        bs += buffer[nextPtr + 2] * alpha - buffer[lastPtr + 2] * alpha2;
                        _as += alpha - alpha2;
                    } else {
                        rs += buffer[nextPtr + 0] * alpha;
                        gs += buffer[nextPtr + 1] * alpha;
                        bs += buffer[nextPtr + 2] * alpha;
                        _as += alpha;
                    }
                } else {
                    if (alpha2 || alpha2 == 0) {
                        rs += - buffer[lastPtr + 0] * alpha2;
                        gs += - buffer[lastPtr + 1] * alpha2;
                        bs += - buffer[lastPtr + 2] * alpha2;
                        _as += - alpha2;
                    } else {
                        // do nothing
                    }
                }
            }
            // Copy column
            for (let i = x * 4, end = i + h * stride, j = 0; i < end; i += stride, j += 4) {
                buffer[i + 0] = columnBuffer[j + 0];
                buffer[i + 1] = columnBuffer[j + 1];
                buffer[i + 2] = columnBuffer[j + 2];
                buffer[i + 3] = columnBuffer[j + 3];
            }
        }
    }

    // function glowFilter(buffer, w, h, color, blurX, blurY, strength) {
    //     dropShadowFilter(buffer, w, h, color, blurX, blurY, 0, 0, strength)
    // }

    function dropShadowFilter(buffer, w, h, color, blurX, blurY, angle, distance, strength) {
        let tmp = alphaFilter(buffer, color);
        panFilter(tmp, w, h, angle, distance);
        blurFilter(tmp, w, h, blurX, blurY);
        scaleAlphaChannel(tmp, strength);
        compositeSourceOver(tmp, buffer);
        buffer.set(tmp);
        if (use8Clamp) {
            buffer.set(tmp);
        } else {
            setArray(buffer, tmp);
        }
    }

    function alphaFilter(buffer, color) {
        if (!color) {
            color = [0, 0, 0, 0];
        }
        let plane;
        if (use8Clamp) {
            plane = new Uint8ClampedArray(buffer)
        } else {
            plane = new Array(buffer.length);
            setArray(plane, buffer);
        }
        let colorR = color[0];
        let colorG = color[1];
        let colorB = color[2];
        let colorA = color[3];
        for (let ptr = 0, end = plane.length; ptr < end; ptr += 4) {
            let alpha = plane[ptr + 3];
            plane[ptr + 0] = colorR * alpha;
            plane[ptr + 1] = colorG * alpha;
            plane[ptr + 2] = colorB * alpha;
            plane[ptr + 3] = colorA * alpha;
        }
        return plane;
    }

    function panFilter(buffer, w, h, angle, distance) {
        let dy = (Math.sin(angle) * distance) | 0;
        let dx = (Math.cos(angle) * distance) | 0;

        let oldBuffer, newBuffer;
        if (use8Clamp) {
            oldBuffer = new Int32Array(buffer.buffer);
            newBuffer = new Int32Array(oldBuffer.length);

            for (let oy = 0; oy < h; oy++) {
                let ny = oy + dy;
                if (ny < 0 || ny > h) {
                    continue;
                }
                for (let ox = 0; ox < w; ox++) {
                    let nx = ox + dx;
                    if (nx < 0 || nx > w) {
                        continue;
                    }
                    newBuffer[ny * w + nx] = oldBuffer[oy * w + ox];
                }
            }

            oldBuffer.set(newBuffer);
        } else {
            oldBuffer = buffer;
            newBuffer = new Array(oldBuffer.length);

            for (let oy = 0; oy < h; oy++) {
                let ny = oy + dy;
                if (ny < 0 || ny > h) {
                    continue;
                }
                for (let ox = 0; ox < w; ox++) {
                    let nx = ox + dx;
                    if (nx < 0 || nx > w) {
                        continue;
                    }
                    newBuffer[(ny * w + nx) * 4 + 0] = oldBuffer[(oy * w + ox) * 4 + 0];
                    newBuffer[(ny * w + nx) * 4 + 1] = oldBuffer[(oy * w + ox) * 4 + 1];
                    newBuffer[(ny * w + nx) * 4 + 2] = oldBuffer[(oy * w + ox) * 4 + 2];
                    newBuffer[(ny * w + nx) * 4 + 3] = oldBuffer[(oy * w + ox) * 4 + 3];
                }
            }

            setArray(oldBuffer, newBuffer);
        }
    }

    function scaleAlphaChannel(buffer, value) {
        for (let ptr = 0, end = buffer.length; ptr < end; ptr += 4) {
            buffer[ptr + 3] *= value;
        }
    }

    function compositeSourceOver(dst, src) {
        for (let ptr = 0, end = dst.length; ptr < end; ptr += 4) {
            let Dr = dst[ptr + 0];
            let Dg = dst[ptr + 1];
            let Db = dst[ptr + 2];
            let Da = dst[ptr + 3] / 255;

            let Sr = src[ptr + 0];
            let Sg = src[ptr + 1];
            let Sb = src[ptr + 2];
            let Sa = src[ptr + 3] / 255;

            dst[ptr + 0] = Sr + Dr * (1 - Sa);
            dst[ptr + 1] = Sg + Dg * (1 - Sa);
            dst[ptr + 2] = Sb + Db * (1 - Sa);
            dst[ptr + 3] = (Sa + Da * (1 - Sa)) * 255;
        }
    }

    function getPixelKey(w, x, y) {
        return y * w * 4 + x * 4;
    }

    function mix(v1, v2, rate) {
        return v1 * (1 - rate) + v2 * rate;
    }

    // dropShadowFilter2
    // 模拟shader中的算法，可以实现内发光，挖空等高级效果
    function dropShadowFilter2(buffer, w, h, color, blurX, blurY, angle, distance, strength, inner, knockout, hideObject) {
        let plane;
        if (use8Clamp) {
            plane = new Uint8ClampedArray(buffer.length);
        } else {
            plane = new Array(buffer.length);
        }

        let alpha = color[3];

        let curDistanceX = 0;
        let curDistanceY = 0;
        let offsetX = distance * Math.cos(angle);
        let offsetY = distance * Math.sin(angle);

        let linearSamplingTimes = 7.0;
        let circleSamplingTimes = 12.0;
        let PI = 3.14159265358979323846264;
        let cosAngle;
        let sinAngle;

        let stepX = blurX / linearSamplingTimes;
        let stepY = blurY / linearSamplingTimes;

        // 遍历像素
        for (let u = 0; u < w; u++) {
            for (let v = 0; v < h; v++) {

                // 此处为了避免毛刺可以添加一个随机值
                let offset = 0;

                // 处理单个像素
                let key = v * w * 4 + u * 4;
                let totalAlpha = 0;
                let maxTotalAlpha = 0;

                // 采样出来的色值
                let _r = buffer[key + 0] / 255;
                let _g = buffer[key + 1] / 255;
                let _b = buffer[key + 2] / 255;
                let _a = buffer[key + 3] / 255;

                for (let a = 0; a <= PI * 2; a += PI * 2 / circleSamplingTimes) {
                    cosAngle = Math.cos(a + offset);
                    sinAngle = Math.sin(a + offset);
                    for (let i = 0; i < linearSamplingTimes; i++) {
                        curDistanceX = i * stepX * cosAngle;
                        curDistanceY = i * stepY * sinAngle;
                        let _u = Math.round(u + curDistanceX - offsetX);
                        let _v = Math.round(v + curDistanceY - offsetY);
                        let __a = 0;
                        if (_u >= w || _u < 0 || _v < 0 || _v >= h) {
                            __a = 0;
                        }
                        else {
                            let _key = _v * w * 4 + _u * 4;
                            __a = buffer[_key + 3] / 255;
                        }
                        totalAlpha += (linearSamplingTimes - i) * __a;
                        maxTotalAlpha += (linearSamplingTimes - i);
                    }
                }

                _a = Math.max(_a, 0.0001);
                // 'ownColor.rgb = ownColor.rgb / ownColor.a;',

                let outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * Math.max(Math.min(hideObject, knockout), 1. - _a);
                let innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * _a;

                _a = Math.max(_a * knockout * (1 - hideObject), 0.0001);

                let rate1 = innerGlowAlpha / (innerGlowAlpha + _a);
                let r1 = mix(_r, color[0], rate1);
                let g1 = mix(_g, color[1], rate1);
                let b1 = mix(_b, color[2], rate1);

                let rate2 = outerGlowAlpha / (innerGlowAlpha + _a + outerGlowAlpha);
                let r2 = mix(r1, color[0], rate2);
                let g2 = mix(g1, color[1], rate2);
                let b2 = mix(b1, color[2], rate2);

                let resultAlpha = Math.min(_a + outerGlowAlpha + innerGlowAlpha, 1);

                // 赋值颜色
                plane[key + 0] = r2 * 255;
                plane[key + 1] = g2 * 255;
                plane[key + 2] = b2 * 255;
                plane[key + 3] = resultAlpha * 255;

            }
        }

        if (use8Clamp) {
            buffer.set(plane);
        } else {
            setArray(buffer, plane);
        }

    }


}
