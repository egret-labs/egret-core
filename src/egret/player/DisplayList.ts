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

module egret.sys {

    var displayListPool:DisplayList[] = [];
    var blendModes = ["source-over", "lighter", "destination-out"];
    var defaultCompositeOp = "source-over";

    /**
     * @private
     * 显示列表
     */
    export class DisplayList extends HashObject implements sys.Renderable {

        /**
         * @private
         * 释放一个DisplayList实例到对象池
         */
        public static release(displayList:DisplayList):void {
            surfaceFactory.release(displayList.surface);
            displayList.surface = null;
            displayList.renderContext = null;
            displayList.root = null;
            displayList.isDirty = false;
            displayList.$renderNode.renderMatrix.setTo(1, 0, 0, 1, 0, 0);
            displayList.$renderNode.needRedraw = false;
            displayListPool.push(displayList);
        }

        /**
         * @private
         * 从对象池中取出或创建一个新的DisplayList对象。
         */
        public static create(target:DisplayObject):DisplayList {
            var displayList = displayListPool.pop();
            if (!displayList) {
                displayList = new egret.sys.DisplayList(target);
            }
            var surface = surfaceFactory.create();
            if (!surface) {
                return null;
            }
            displayList.surface = surface;
            displayList.renderContext = surface.renderContext;
            displayList.root = target;
            return displayList;
        }


        /**
         * @private
         * 创建一个DisplayList对象
         */
        public constructor(root:DisplayObject) {
            super();
            this.root = root;
            this.dirtyRegion.displayList = this;
        }

        /**
         * 位图渲染节点
         */
        $renderNode:RenderNode = new BitmapNode();

        /**
         * @private
         * 更新对象在舞台上的显示区域和透明度,返回显示区域是否发生改变。
         */
        $update():boolean {
            var target = this.root;
            //当cache对象的显示列表已经加入dirtyList，对象又取消cache的时候，root为空
            if (target == null) {
                return false;
            }
            target.$removeFlagsUp(DisplayObjectFlags.Dirty);
            var node = this.$renderNode;
            node.renderAlpha = target.$getConcatenatedAlpha();
            //必须在访问moved属性前调用以下两个方法，因为moved属性在以下两个方法内重置。
            var concatenatedMatrix = target.$getConcatenatedMatrix();
            var bounds = target.$getOriginalBounds();
            var displayList = target.$parentDisplayList;
            var region = node.renderRegion;
            if (this.isDirty) {
                this.updateDirtyRegions();
            }
            if (!displayList) {
                region.setTo(0, 0, 0, 0);
                node.moved = false;
                return false;
            }

            if (!node.moved) {
                return false;
            }
            node.moved = false;
            node.renderMatrix = concatenatedMatrix;
            var root = displayList.root;
            if (root === target.$stage) {
                region.updateRegion(bounds, concatenatedMatrix);
            }
            else{
                var matrix = Matrix.create().copyFrom(concatenatedMatrix);
                target.$getConcatenatedMatrixAt(root, matrix);
                region.updateRegion(bounds, matrix);
                Matrix.release(matrix);
            }
            return true;
        }

        /**
         * @private
         * 呈现绘制结果的目标画布
         */
        public surface:Surface = null;
        /**
         * @private
         */
        public offsetX:number = 0;
        /**
         * @private
         */
        public offsetY:number = 0;

        /**
         * @private
         * 显示列表根节点
         */
        public root:DisplayObject;

        /**
         * @private
         */
        public isDirty:boolean = false;

        /**
         * @private
         */
        private rootMatrix:Matrix = new Matrix();

        /**
         * @private
         * 绘图上下文
         */
        public renderContext:RenderContext;

        /**
         * @private
         * 设置剪裁边界，不再绘制完整目标对象，画布尺寸由外部决定，超过边界的节点将跳过绘制。
         */
        public setClipRect(width:number, height:number):void {
            this.dirtyRegion.setClipRect(width, height);
            this.rootMatrix = null;//只有舞台画布才能设置ClipRect
            var surface = this.renderContext.surface;
            surface.width = width;
            surface.height = height;
            if (this.renderContext["resize"]) {
                this.renderContext["resize"](width, height);
            }
            this.surface = surface;
        }

        /**
         * @private
         * 显示对象的渲染节点发生改变时，把自身的IRenderable对象注册到此列表上。
         */
        private dirtyNodes:any = {};

        /**
         * @private
         */
        private dirtyNodeList:Renderable[] = [];

        /**
         * @private
         * 标记一个节点需要重新渲染
         */
        public markDirty(node:Renderable):void {
            var key = node.$hashCode;
            if (this.dirtyNodes[key]) {
                return;
            }
            this.dirtyNodes[key] = true;
            this.dirtyNodeList.push(node);
            if (!this.isDirty) {
                this.isDirty = true;
                var parentCache = this.root.$parentDisplayList;
                if (parentCache) {
                    parentCache.markDirty(this);
                }
            }
        }

        /**
         * @private
         */
        private dirtyList:Region[] = null;

        /**
         * @private
         */
        private dirtyRegion:DirtyRegion = new DirtyRegion();

        /**
         * @private
         * 更新节点属性并返回脏矩形列表。
         */
        public updateDirtyRegions():Region[] {
            var dirtyNodeList = this.dirtyNodeList;
            this.dirtyNodeList = [];
            this.dirtyNodes = {};
            var dirtyRegion = this.dirtyRegion;
            var length = dirtyNodeList.length;
            for (var i = 0; i < length; i++) {
                var display = dirtyNodeList[i];
                var node = display.$renderNode;
                node.needRedraw = false;//先清空上次缓存的标记,防止上次没遍历到的节点needRedraw始终为true.
                if (node.renderAlpha > 0) {
                    if (dirtyRegion.addRegion(node.renderRegion)) {
                        node.needRedraw = true;
                    }
                }
                var moved = display.$update();
                if (node.renderAlpha > 0 && (moved || !node.needRedraw)) {//若不判断needRedraw,从0设置为1的情况将会不显示
                    if (dirtyRegion.addRegion(node.renderRegion)) {
                        node.needRedraw = true;
                    }
                }
            }
            this.dirtyList = dirtyRegion.getDirtyRegions();
            return this.dirtyList;
        }

        /**
         * @private
         * 绘制根节点显示对象到目标画布，返回draw的次数。
         */
        public drawToSurface():number {
            var m = this.rootMatrix;
            if (m) {//对非舞台画布要根据目标显示对象尺寸改变而改变。
                this.changeSurfaceSize();
            }
            var context = this.renderContext;
            //绘制脏矩形区域
            context.save();
            context.beginPath();

            if (m) {
                context.setTransform(1, 0, 0, 1, -this.offsetX, -this.offsetY);
            }
            var dirtyList = this.dirtyList;
            var length = dirtyList.length;
            for (var i = 0; i < length; i++) {
                var region = dirtyList[i];
                context.clearRect(region.minX, region.minY, region.width, region.height);
                context.rect(region.minX, region.minY, region.width, region.height);
            }
            context.clip();
            if (m) {
                context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            //绘制显示对象
            var drawCalls = this.drawDisplayObject(this.root, context, dirtyList, m, null, null);
            //清除脏矩形区域
            context.restore();
            if (context["finish"]) {
                context["finish"]();
            }
            var surface = this.surface;
            var renderNode = <BitmapNode>this.$renderNode;
            renderNode.drawData.length = 0;
            renderNode.image = surface;
            renderNode.drawImage(0, 0, surface.width, surface.height, this.offsetX, this.offsetY, surface.width, surface.height);
            this.dirtyList = null;
            this.dirtyRegion.clear();
            this.isDirty = false;
            return drawCalls;
        }

        /**
         * @private
         * 绘制一个显示对象
         */
        private drawDisplayObject(displayObject:DisplayObject, context:RenderContext, dirtyList:egret.sys.Region[],
                                  rootMatrix:Matrix, displayList:DisplayList, clipRegion:Region):number {
            var drawCalls = 0;
            var node:RenderNode;
            var globalAlpha:number;
            if (displayList) {
                if (displayList.isDirty) {
                    drawCalls += displayList.drawToSurface();
                }
                node = displayList.$renderNode;
                globalAlpha = 1;//这里不用读取node.renderAlpha,因为它已经绘制到了displayList.surface的内部。
            }
            else if (displayObject.$renderNode) {
                node = displayObject.$renderNode;
                globalAlpha = node.renderAlpha;
            }
            if (node) {
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
                if (node.needRedraw) {
                    drawCalls++;
                    context.globalAlpha = globalAlpha;
                    var m = node.renderMatrix;
                    if (rootMatrix) {
                        context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        this.render(context, node);
                        context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx, rootMatrix.ty);
                    }
                    else {//绘制到舞台上时，所有矩阵都是绝对的，不需要调用transform()叠加。
                        context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        this.render(context, node);
                    }
                    node.needRedraw = false;
                }
            }
            if (displayList) {
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
                    if (child.$blendMode !== 0 ||
                        (child.$mask && child.$mask.$parentDisplayList)) {//若遮罩不在显示列表中，放弃绘制遮罩。
                        drawCalls += this.drawWithClip(child, context, dirtyList, rootMatrix, clipRegion);
                    }
                    else if (child.$scrollRect || child.$maskRect) {
                        drawCalls += this.drawWithScrollRect(child, context, dirtyList, rootMatrix, clipRegion);
                    }
                    else {
                        if (child["isFPS"]) {
                            this.drawDisplayObject(child, context, dirtyList, rootMatrix, child.$displayList, clipRegion);
                        }
                        else {
                            drawCalls += this.drawDisplayObject(child, context, dirtyList, rootMatrix, child.$displayList, clipRegion);
                        }
                    }
                }
            }
            return drawCalls;
        }

        /**
         * @private
         */
        private drawWithClip(displayObject:DisplayObject, context:RenderContext, dirtyList:egret.sys.Region[],
                             rootMatrix:Matrix, clipRegion:Region):number {
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
            var maskRegion:Region;
            var displayMatrix = Matrix.create();
            displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
            var root = displayObject.$parentDisplayList.root;
            var invertedMatrix:Matrix;
            if (root !== displayObject.$stage) {
                invertedMatrix = root.$getInvertedConcatenatedMatrix();
                invertedMatrix.$preMultiplyInto(displayMatrix, displayMatrix);
            }

            if (mask) {
                var bounds = mask.$getOriginalBounds();
                maskRegion = Region.create();
                var m = Matrix.create();
                m.copyFrom(mask.$getConcatenatedMatrix());
                if (invertedMatrix) {
                    invertedMatrix.$preMultiplyInto(m, m);
                }
                maskRegion.updateRegion(bounds, m);
                Matrix.release(m);
            }
            var region:Region;
            if (scrollRect) {
                region = Region.create();
                region.updateRegion(scrollRect, displayMatrix);
            }
            if (region && maskRegion) {
                region.intersect(maskRegion);
                Region.release(maskRegion);
            }
            else if (!region && maskRegion) {
                region = maskRegion;
            }
            if (region) {
                if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                    Region.release(region);
                    Matrix.release(displayMatrix);
                    return drawCalls;
                }
            }
            else {
                region = Region.create();
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
                Region.release(region);
                Matrix.release(displayMatrix);
                return drawCalls;
            }

            //绘制显示对象自身，若有scrollRect，应用clip
            var displayContext = this.createRenderContext(region.width, region.height);
            if (!displayContext) {//RenderContext创建失败，放弃绘制遮罩。
                drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, rootMatrix, displayObject.$displayList, clipRegion);
                Region.release(region);
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
            var rootM = Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
            drawCalls += this.drawDisplayObject(displayObject, displayContext, dirtyList, rootM, displayObject.$displayList, region);
            Matrix.release(rootM);
            //绘制遮罩
            if (mask) {
                var maskContext = this.createRenderContext(region.width, region.height);
                if (!maskContext) {//RenderContext创建失败，放弃绘制遮罩。
                    drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, rootMatrix, displayObject.$displayList, clipRegion);
                    surfaceFactory.release(displayContext.surface);
                    Region.release(region);
                    Matrix.release(displayMatrix);
                    return drawCalls;
                }
                maskContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                rootM = Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                var calls = this.drawDisplayObject(mask, maskContext, dirtyList, rootM, mask.$displayList, region);
                Matrix.release(rootM);
                if (calls > 0) {
                    drawCalls += calls;
                    displayContext.globalCompositeOperation = "destination-in";
                    displayContext.setTransform(1, 0, 0, 1, 0, 0);
                    displayContext.globalAlpha = 1;
                    displayContext.drawImage(maskContext.surface, 0, 0);
                }
                surfaceFactory.release(maskContext.surface);
            }


            //绘制结果到屏幕
            if (drawCalls > 0) {
                drawCalls++;
                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }
                context.globalAlpha = 1;
                if (rootMatrix) {
                    context.translate(region.minX, region.minY);
                    context.drawImage(displayContext.surface, 0, 0);
                    context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx, rootMatrix.ty);
                }
                else {//绘制到舞台上时，所有矩阵都是绝对的，不需要调用transform()叠加。
                    context.setTransform(1, 0, 0, 1, region.minX, region.minY);
                    context.drawImage(displayContext.surface, 0, 0);
                }

                if (hasBlendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
            }
            surfaceFactory.release(displayContext.surface);
            Region.release(region);
            Matrix.release(displayMatrix);
            return drawCalls;
        }

        /**
         * @private
         */
        private drawWithScrollRect(displayObject:DisplayObject, context:RenderContext, dirtyList:egret.sys.Region[],
                                   rootMatrix:Matrix, clipRegion:Region):number {
            var drawCalls = 0;
            var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            if (scrollRect.width == 0 || scrollRect.height == 0) {
                return drawCalls;
            }
            var m = Matrix.create();
            m.copyFrom(displayObject.$getConcatenatedMatrix());
            var root = displayObject.$parentDisplayList.root;
            if (root !== displayObject.$stage) {
                root.$getInvertedConcatenatedMatrix().$preMultiplyInto(m, m)
            }
            var region:Region = Region.create();
            if (!scrollRect.isEmpty()) {
                region.updateRegion(scrollRect, m);
            }
            if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                Region.release(region);
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
                Region.release(region);
                Matrix.release(m);
                return drawCalls;
            }

            //绘制显示对象自身
            context.save();
            if (rootMatrix) {
                context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx, rootMatrix.ty);
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            else {
                context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            context.beginPath();
            context.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
            context.clip();
            if (rootMatrix) {
                context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx, rootMatrix.ty);
            }
            drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, rootMatrix, displayObject.$displayList, region);
            context.restore();

            Region.release(region);
            Matrix.release(m);
            return drawCalls;
        }

        /**
         * @private
         */
        private createRenderContext(width:number, height:number):RenderContext {
            var surface = surfaceFactory.create(true);
            if (!surface) {
                return null;
            }
            if (Capabilities.runtimeType == RuntimeType.WEB) {
                //在chrome里，小等于256*256的canvas会不启用GPU加速。
                surface.width = Math.max(257, width);
                surface.height = Math.max(257, height);
            }
            else {
                surface.width = width;
                surface.height = height;
            }
            return surface.renderContext;
        }

        /**
         * @private
         */
        private sizeChanged:boolean = false;

        /**
         * @private
         * 改变画布的尺寸，由于画布尺寸修改会清空原始画布。所以这里将原始画布绘制到一个新画布上，再与原始画布交换。
         */
        public changeSurfaceSize():void {
            var root = this.root;
            var oldOffsetX = this.offsetX;
            var oldOffsetY = this.offsetY;
            var bounds = this.root.$getOriginalBounds();
            this.offsetX = bounds.x;
            this.offsetY = bounds.y;
            var oldContext = this.renderContext;
            var oldSurface = oldContext.surface;
            if (!this.sizeChanged) {
                this.sizeChanged = true;
                oldSurface.width = Math.max(bounds.width, 257);
                oldSurface.height = Math.max(bounds.height, 257);
            }
            else {
                var newContext = sys.sharedRenderContext;
                var newSurface = newContext.surface;
                sys.sharedRenderContext = oldContext;
                this.renderContext = newContext;
                this.surface = newSurface;
                newSurface.width = Math.max(bounds.width, 257);
                newSurface.height = Math.max(bounds.height, 257);
                //if (bounds.width !== 0 && bounds.height !== 0) {
                newContext.setTransform(1, 0, 0, 1, 0, 0);
                newContext.drawImage(oldSurface, oldOffsetX - this.offsetX, oldOffsetY - this.offsetY);
                //}
                if (Capabilities.runtimeType != RuntimeType.NATIVE) {
                    oldSurface.height = 1;
                    oldSurface.width = 1;
                }
            }

            var m = root.$getInvertedConcatenatedMatrix();
            this.rootMatrix.setTo(m.a, m.b, m.c, m.d, m.tx - bounds.x, m.ty - bounds.y);
            this.renderContext.setTransform(m.a, m.b, m.c, m.d, m.tx - bounds.x, m.ty - bounds.y);
        }

        public setDirtyRegionPolicy(policy:string):void {
            //todo 这里还可以做更多优化
            this.dirtyRegion.setDirtyRegionPolicy(policy);
        }

        private render(context:RenderContext, node:RenderNode):void {
            switch (node.type){
                case RenderNodeType.BitmapNode:
                    var bitmapNode = <BitmapNode>node;
                    var image = bitmapNode.image;
                    context.imageSmoothingEnabled = bitmapNode.smoothing;
                    var data = bitmapNode.drawData;
                    var length = data.length;
                    for(var i=0;i<length;i+=8){
                        context.drawImage(image, data[i], data[i+1], data[i+2], data[i+3], data[i+4], data[i+5], data[i+6], data[i+7]);
                    }
                    break;
            }
        }

    }
}