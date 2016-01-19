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
    var renderBufferPool:CanvasRenderBuffer[] = [];//渲染缓冲区对象池
    /**
     * @private
     * Canvas渲染器
     */
    export class CanvasRenderer implements sys.SystemRenderer {

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
        public render(displayObject:DisplayObject, buffer:CanvasRenderBuffer, matrix:Matrix, dirtyList?:egret.sys.Region[], forRenderTexture?:boolean):number {
            this.nestLevel++;
            var context = buffer.context;
            var root:DisplayObject = forRenderTexture ? displayObject : null;
            //绘制显示对象
            var drawCall = this.drawDisplayObject(displayObject, context, dirtyList, matrix, null, null, root);
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
        private drawDisplayObject(displayObject:DisplayObject, context:CanvasRenderingContext2D, dirtyList:egret.sys.Region[],
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
                        context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        Matrix.release(m);
                    }
                    else {
                        renderAlpha = node.renderAlpha;
                        m = node.renderMatrix;
                        context.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);
                    }
                    context.globalAlpha = renderAlpha;
                    switch (node.type) {
                        case sys.RenderNodeType.BitmapNode:
                            this.renderBitmap(<sys.BitmapNode>node, context);
                            break;
                        case sys.RenderNodeType.TextNode:
                            this.renderText(<sys.TextNode>node, context);
                            break;
                        case sys.RenderNodeType.GraphicsNode:
                            this.renderGraphics(<sys.GraphicsNode>node, context);
                            break;
                        case sys.RenderNodeType.GroupNode:
                            this.renderGroup(<sys.GroupNode>node, context);
                            break;
                    }
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
                        (child.$mask && child.$mask.$parentDisplayList))) {//若遮罩不在显示列表中，放弃绘制遮罩。
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
        private drawWithClip(displayObject:DisplayObject, context:CanvasRenderingContext2D, dirtyList:egret.sys.Region[],
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
            if (mask && !mask.$parentDisplayList) {
                mask = null; //如果遮罩不在显示列表中，放弃绘制遮罩。
            }

            //计算scrollRect和mask的clip区域是否需要绘制，不需要就直接返回，跳过所有子项的遍历。
            var maskRegion:sys.Region;
            var displayMatrix = Matrix.create();
            displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
            var displayRoot = displayObject.$parentDisplayList.root;
            var invertedMatrix:Matrix;
            if (displayRoot !== displayObject.$stage) {
                displayObject.$getConcatenatedMatrixAt(displayRoot, displayMatrix);
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
            var l = dirtyList.length;
            for (var j = 0; j < l; j++) {
                if (region.intersects(dirtyList[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                sys.Region.release(region);
                Matrix.release(displayMatrix);
                return drawCalls;
            }

            //绘制显示对象自身，若有scrollRect，应用clip
            var displayBuffer = this.createRenderBuffer(region.width, region.height);
            var displayContext = displayBuffer.context;
            if (!displayContext) {//RenderContext创建失败，放弃绘制遮罩。
                drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, matrix,
                    displayObject.$displayList, clipRegion, root);
                sys.Region.release(region);
                Matrix.release(displayMatrix);
                return drawCalls;
            }
            if (scrollRect) {
                var m = displayMatrix;
                displayContext.setTransform(m.a, m.b, m.c, m.d, m.tx - region.minX, m.ty - region.minY);
                displayContext.beginPath();
                displayContext.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
                displayContext.clip();
            }
            displayContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
            var offsetM = Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);

            drawCalls += this.drawDisplayObject(displayObject, displayContext, dirtyList, offsetM,
                displayObject.$displayList, region, root ? displayObject : null);
            Matrix.release(offsetM);
            //绘制遮罩
            if (mask) {
                //如果只有一次绘制或是已经被cache直接绘制到displayContext
                var maskRenderNode = mask.$getRenderNode();
                if(maskRenderNode.$getRenderCount() == 1 || mask.$displayList) {
                    displayContext.globalCompositeOperation = "destination-in";
                    drawCalls += this.drawDisplayObject(mask, displayContext, dirtyList, offsetM,
                        mask.$displayList, region, root ? mask : null);
                }
                else {
                    var maskBuffer = this.createRenderBuffer(region.width, region.height);
                    var maskContext = maskBuffer.context;
                    if (!maskContext) {//RenderContext创建失败，放弃绘制遮罩。
                        drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, matrix,
                            displayObject.$displayList, clipRegion, root);
                        renderBufferPool.push(displayBuffer);
                        sys.Region.release(region);
                        Matrix.release(displayMatrix);
                        return drawCalls;
                    }
                    maskContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                    offsetM = Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                    var calls = this.drawDisplayObject(mask, maskContext, dirtyList, offsetM,
                        mask.$displayList, region, root ? mask : null);
                    Matrix.release(offsetM);
                    if (calls > 0) {
                        drawCalls += calls;
                        displayContext.globalCompositeOperation = "destination-in";
                        displayContext.setTransform(1, 0, 0, 1, 0, 0);
                        displayContext.globalAlpha = 1;
                        displayContext.drawImage(<any>maskBuffer.surface, 0, 0);
                    }
                    renderBufferPool.push(maskBuffer);
                }
            }


            //绘制结果到屏幕
            if (drawCalls > 0) {
                drawCalls++;
                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }
                context.globalAlpha = 1;
                context.setTransform(1, 0, 0, 1, region.minX + matrix.tx, region.minY + matrix.ty);
                context.drawImage(<any>displayBuffer.surface, 0, 0);

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
        private drawWithScrollRect(displayObject:DisplayObject, context:CanvasRenderingContext2D, dirtyList:egret.sys.Region[],
                                   matrix:Matrix, clipRegion:sys.Region, root:DisplayObject):number {
            var drawCalls = 0;
            var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            if (scrollRect.width == 0 || scrollRect.height == 0) {
                return drawCalls;
            }
            var m = Matrix.create();
            m.copyFrom(displayObject.$getConcatenatedMatrix());
            var displayRoot = displayObject.$parentDisplayList.root;
            if (displayRoot !== displayObject.$stage) {
                displayObject.$getConcatenatedMatrixAt(displayRoot, m);
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
            var l = dirtyList.length;
            for (var j = 0; j < l; j++) {
                if (region.intersects(dirtyList[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                sys.Region.release(region);
                Matrix.release(m);
                return drawCalls;
            }

            //绘制显示对象自身
            context.save();
            context.setTransform(m.a, m.b, m.c, m.d, m.tx + matrix.tx, m.ty + matrix.ty);
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
        public drawNodeToBuffer(node:sys.RenderNode, buffer:CanvasRenderBuffer, matrix:Matrix, forHitTest?:boolean):void {
            var context = buffer.context;
            context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            switch (node.type) {
                case sys.RenderNodeType.BitmapNode:
                    this.renderBitmap(<sys.BitmapNode>node, context);
                    break;
                case sys.RenderNodeType.TextNode:
                    this.renderText(<sys.TextNode>node, context);
                    break;
                case sys.RenderNodeType.GraphicsNode:
                    this.renderGraphics(<sys.GraphicsNode>node, context, forHitTest);
                    break;
                case sys.RenderNodeType.GroupNode:
                    this.renderGroup(<sys.GroupNode>node, context);
                    break;
            }
        }

        /**
         * @private
         */
        private renderBitmap(node:sys.BitmapNode, context:CanvasRenderingContext2D):void {
            var image = node.image;
            context["imageSmoothingEnabled"] = node.smoothing;
            var data = node.drawData;
            var length = data.length;
            var pos = 0;
            while (pos < length) {
                context.drawImage(<HTMLImageElement><any>image, data[pos++], data[pos++], data[pos++],
                    data[pos++], data[pos++], data[pos++], data[pos++], data[pos++]);
            }
        }

        /**
         * @private
         */
        private renderText(node:sys.TextNode, context:CanvasRenderingContext2D):void {
            context.textAlign = "left";
            context.textBaseline = "middle";
            context.lineJoin = "round";//确保描边样式是圆角
            var drawData = node.drawData;
            var length = drawData.length;
            var pos = 0;
            while (pos < length) {
                var x = drawData[pos++];
                var y = drawData[pos++];
                var text = drawData[pos++];
                var format:sys.TextFormat = drawData[pos++];
                context.font = getFontString(node, format);
                var textColor = format.textColor == null ? node.textColor : format.textColor;
                var strokeColor = format.strokeColor == null ? node.strokeColor : format.strokeColor;
                var stroke = format.stroke == null ? node.stroke : format.stroke;
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
        private renderGraphics(node:sys.GraphicsNode, context:CanvasRenderingContext2D, forHitTest?:boolean):void {
            var drawData = node.drawData;
            var length = drawData.length;
            forHitTest = !!forHitTest;
            for (var i = 0; i < length; i++) {
                var path:sys.Path2D = drawData[i];
                switch (path.type) {
                    case sys.PathType.Fill:
                        var fillPath = <sys.FillPath>path;
                        context.fillStyle = forHitTest ? BLACK_COLOR : getRGBAString(fillPath.fillColor, fillPath.fillAlpha);
                        this.renderPath(path, context);
                        context.fill();
                        break;
                    case sys.PathType.GradientFill:
                        var g = <sys.GradientFillPath>path;
                        context.fillStyle = forHitTest ? BLACK_COLOR : getGradient(context, g.gradientType, g.colors, g.alphas, g.ratios, g.matrix);
                        context.save();
                        var m = g.matrix;
                        context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        this.renderPath(path, context);
                        context.fill();
                        context.restore();
                        break;
                    case sys.PathType.Stroke:
                        var strokeFill = <sys.StrokePath>path;
                        var lineWidth = strokeFill.lineWidth;
                        context.lineWidth = lineWidth;
                        context.strokeStyle = forHitTest ? BLACK_COLOR : getRGBAString(strokeFill.lineColor, strokeFill.lineAlpha);
                        context.lineCap = CAPS_STYLES[strokeFill.caps];
                        context.lineJoin = strokeFill.joints;
                        context.miterLimit = strokeFill.miterLimit;
                        //对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
                        var isSpecialCaseWidth = lineWidth === 1 || lineWidth === 3;
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
        }

        private renderPath(path:sys.Path2D, context:CanvasRenderingContext2D):void {
            context.beginPath();
            var data = path.$data;
            var commands = path.$commands;
            var commandCount = commands.length;
            var pos = 0;
            for (var commandIndex = 0; commandIndex < commandCount; commandIndex++) {
                var command = commands[commandIndex];
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


        private renderGroup(groupNode:sys.GroupNode, context:CanvasRenderingContext2D):void {
            var children = groupNode.drawData;
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var node:sys.RenderNode = children[i];
                switch (node.type) {
                    case sys.RenderNodeType.BitmapNode:
                        this.renderBitmap(<sys.BitmapNode>node, context);
                        break;
                    case sys.RenderNodeType.TextNode:
                        this.renderText(<sys.TextNode>node, context);
                        break;
                    case sys.RenderNodeType.GraphicsNode:
                        this.renderGraphics(<sys.GraphicsNode>node, context);
                        break;
                    case sys.RenderNodeType.GroupNode:
                        this.renderGroup(<sys.GroupNode>node, context);
                        break;
                }
            }
        }

        /**
         * @private
         */
        private createRenderBuffer(width:number, height:number):CanvasRenderBuffer {
            var buffer = renderBufferPool.pop();
            if (buffer) {
                buffer.resize(width, height, true);
            }
            else {
                buffer = new CanvasRenderBuffer(width, height);
            }
            return buffer;
        }
    }

    /**
     * @private
     * 获取字体字符串
     */
    function getFontString(node:sys.TextNode, format:sys.TextFormat):string {
        var italic:boolean = format.italic == null ? node.italic : format.italic;
        var bold:boolean = format.bold == null ? node.bold : format.bold;
        var size:number = format.size == null ? node.size : format.size;
        var fontFamily:string = format.fontFamily || node.fontFamily;
        var font:string = italic ? "italic " : "normal ";
        font += bold ? "bold " : "normal ";
        font += size + "px " + fontFamily;
        return font;
    }

    /**
     * @private
     * 获取RGBA字符串
     */
    function getRGBAString(color:number, alpha:number):string {
        var red = color >> 16;
        var green = (color >> 8) & 0xFF;
        var blue = color & 0xFF;
        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }

    /**
     * @private
     * 获取渐变填充样式对象
     */
    function getGradient(context:CanvasRenderingContext2D, type:string, colors:number[],
                         alphas:number[], ratios:number[], matrix:Matrix):CanvasGradient {
        var gradient:CanvasGradient;
        if (type == GradientType.LINEAR) {
            gradient = context.createLinearGradient(-1, 0, 1, 0);
        }
        else {
            gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
        }
        //todo colors alphas ratios数量不一致情况处理
        var l = colors.length;
        for (var i = 0; i < l; i++) {
            gradient.addColorStop(ratios[i] / 255, getRGBAString(colors[i], alphas[i]));
        }
        return gradient;
    }
}
