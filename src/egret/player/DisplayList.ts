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
    export class DisplayList extends HashObject implements Renderable {

        /**
         * @private
         * 释放一个DisplayList实例到对象池
         */
        public static release(displayList:DisplayList):void {
            surfaceFactory.release(displayList.surface);
            Matrix.release(displayList.$renderMatrix);
            Matrix.release(displayList.$ratioMatrix);
            displayList.surface = null;
            displayList.renderContext = null;
            displayList.root = null;
            displayList.$renderMatrix = null;
            displayList.$ratioMatrix = null;
            displayList.needRedraw = false;
            displayList.$isDirty = false;
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
            displayList.$renderMatrix = Matrix.create();
            displayList.$renderMatrix.setTo(1, 0, 0, 1, 0, 0);
            displayList.$pixelRatio = 1;
            displayList.$ratioMatrix = Matrix.create();
            displayList.$ratioMatrix.setTo(1, 0, 0, 1, 0, 0);
            displayList.needRedraw = true;
            displayList.$isDirty = true;
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
         * @private
         * 是否需要重绘
         */
        $isDirty:boolean = false;
        /**
         * @private
         * 在舞台上的透明度
         */
        $renderAlpha:number = 1;
        /**
         * @private
         * 相对于显示列表根节点或位图缓存根节点的矩阵对象
         */
        $renderMatrix: Matrix = new Matrix();

        $ratioMatrix: Matrix = new Matrix();

        $ratioChanged: boolean = false;

        $pixelRatio: number = 1;

        /**
         * @private
         * 在显示列表根节点或位图缓存根节点上的显示区域
         */
        $renderRegion:Region = new Region();

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
            this.$renderAlpha = target.$getConcatenatedAlpha();
            //必须在访问moved属性前调用以下两个方法，因为moved属性在以下两个方法内重置。
            var concatenatedMatrix = target.$getConcatenatedMatrix();
            var bounds = target.$getOriginalBounds();
            var displayList = target.$parentDisplayList;
            var pixelRatio = 1;
            if (displayList)
                pixelRatio = displayList.$pixelRatio;
            else if (target.stage && target.stage.$displayList)
                pixelRatio = target.stage.$displayList.$pixelRatio;
            this.setDevicePixelRatio(pixelRatio);
            var region = this.$renderRegion;
            if (this.needRedraw) {
                this.updateDirtyRegions();
            }
            if(!displayList){
                region.setTo(0,0,0,0);
                region.moved = false;
                return false;
            }

            if (!region.moved && !displayList.$ratioChanged) {
                return false;
            }
            region.moved = false;
            var matrix = this.$renderMatrix;
            matrix.copyFrom(concatenatedMatrix);
            var root = displayList.root;
            if(root!==target.$stage){
                target.$getConcatenatedMatrixAt(root,matrix);
            }
            this.$ratioMatrix.$preMultiplyInto(matrix, matrix);
            region.updateRegion(bounds, matrix);
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
         *
         * @param context
         */
        $render(context:RenderContext):void {
            var data = this.surface;
            if (data) {
                context.drawImage(data, this.offsetX, this.offsetY, data.width / this.$pixelRatio, data.height / this.$pixelRatio);
            }
        }

        /**
         * @private
         * 显示列表根节点
         */
        public root:DisplayObject;

        /**
         * @private
         */
        public needRedraw:boolean = false;

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
        public setClipRect(width: number, height: number): void {
            width *= this.$pixelRatio;
            height *= this.$pixelRatio;
            this.dirtyRegion.setClipRect(width, height);
            this.rootMatrix = null;//只有舞台画布才能设置ClipRect
            var surface = this.renderContext.surface;
            surface.width = width;
            surface.height = height;
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
            if (!this.needRedraw) {
                this.needRedraw = true;
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
            var nodeList = this.dirtyNodeList;
            this.dirtyNodeList = [];
            this.dirtyNodes = {};
            var dirtyRegion = this.dirtyRegion;
            var length = nodeList.length;
            for (var i = 0; i < length; i++) {
                var node = nodeList[i];
                var region = node.$renderRegion;
                if (node.$renderAlpha > 0) {
                    if (dirtyRegion.addRegion(region)) {
                        node.$isDirty = true;
                    }
                }
                var moved = node.$update();
                if (node.$renderAlpha > 0 && (moved || !node.$isDirty)) {
                    if (dirtyRegion.addRegion(region)) {
                        node.$isDirty = true;
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
                context.setTransform(1, 0, 0, 1, -this.offsetX * this.$pixelRatio, -this.offsetY* this.$pixelRatio);
            }
            var dirtyList = this.dirtyList;
            var length = dirtyList.length;
            for (var i = 0; i < length; i++) {
                var region = dirtyList[i];
                context.clearRect(region.minX, region.minY, region.width, region.height);
                context.rect(region.minX, region.minY, region.width, region.height);
            }
            context.clip();
            if(m){
                context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            //绘制显示对象
            var drawCalls = this.drawDisplayObject(this.root, context, dirtyList, m, null, null);
            //清除脏矩形区域
            context.restore();
            this.dirtyList = null;
            this.dirtyRegion.clear();
            this.needRedraw = false;
            this.$ratioChanged = false;
            return drawCalls;
        }

        /**
         * @private
         * 绘制一个显示对象
         */
        private drawDisplayObject(displayObject:DisplayObject, context:RenderContext, dirtyList:egret.sys.Region[],
                                  rootMatrix:Matrix, displayList:DisplayList, clipRegion:Region):number {
            var drawCalls = 0;
            var node:Renderable;
            var globalAlpha:number;
            if (displayList) {
                if (displayList.needRedraw) {
                    drawCalls += displayList.drawToSurface();
                }
                node = displayList;
                globalAlpha = 1;//这里不用读取displayList.$renderAlpha,因为它已经绘制到了displayList.surface的内部。
            }
            else if (displayObject.$renderRegion) {
                node = displayObject;
                globalAlpha = displayObject.$renderAlpha;
            }
            if (node) {
                var renderRegion = node.$renderRegion;
                if (clipRegion && !clipRegion.intersects(renderRegion)) {
                    node.$isDirty = false;
                }
                else if (!node.$isDirty) {
                    var l = dirtyList.length;
                    for (var j = 0; j < l; j++) {
                        if (renderRegion.intersects(dirtyList[j])) {
                            node.$isDirty = true;
                            break;
                        }
                    }
                }
                if (node.$isDirty) {
                    drawCalls++;
                    context.globalAlpha = globalAlpha;
                    var m = node.$renderMatrix;
                    if (rootMatrix) {
                        context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        node.$render(context);
                        context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                    }
                    else {//绘制到舞台上时，所有矩阵都是绝对的，不需要调用transform()叠加。
                        context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        node.$render(context);
                    }
                    node.$isDirty = false;
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
                        (child.$mask&&child.$mask.$parentDisplayList)) {//若遮罩不在显示列表中，放弃绘制遮罩。
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
            if(mask&&!mask.$parentDisplayList){
                mask = null; //如果遮罩不在显示列表中，放弃绘制遮罩。
            }

            //计算scrollRect和mask的clip区域是否需要绘制，不需要就直接返回，跳过所有子项的遍历。
            var maskRegion:Region;
            var displayMatrix = Matrix.create();
            displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
            var root = displayObject.$parentDisplayList.root;
            var invertedMatrix:Matrix;
            if(root!==displayObject.$stage){
                invertedMatrix = root.$getInvertedConcatenatedMatrix();
                invertedMatrix.$preMultiplyInto(displayMatrix,displayMatrix);
            }

            this.$ratioMatrix.$preMultiplyInto(displayMatrix, displayMatrix);
            if (mask) {
                var bounds = mask.$getOriginalBounds();
                maskRegion = Region.create();
                var m = Matrix.create();
                m.copyFrom(mask.$getConcatenatedMatrix());
                if(invertedMatrix){
                    invertedMatrix.$preMultiplyInto(m,m);
                }
                this.$ratioMatrix.$preMultiplyInto(m, m);
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
                if(region.isEmpty() || (clipRegion && !clipRegion.intersects(region))){
                    Region.release(region);
                    Matrix.release(displayMatrix);
                    return drawCalls;
                }
            }
            else{
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
                    context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
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
            if(root!==displayObject.$stage){
                root.$getInvertedConcatenatedMatrix().$preMultiplyInto(m,m)
            }
            this.$ratioMatrix.$preMultiplyInto(m, m);
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
                context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            else {
                context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            context.beginPath();
            context.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
            context.clip();
            if (rootMatrix) {
                context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
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
            if(Capabilities.runtimeType == RuntimeType.WEB) {
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
        public changeSurfaceSize(): void {
            var root = this.root;
            var oldOffsetX = this.offsetX;
            var oldOffsetY = this.offsetY;
            var bounds = this.root.$getOriginalBounds();
            var scaleX = this.$pixelRatio;
            var scaleY = this.$pixelRatio;
            this.offsetX = bounds.x;
            this.offsetY = bounds.y;
            var oldContext = this.renderContext;
            var oldSurface = oldContext.surface;
            if (!this.sizeChanged) {
                this.sizeChanged = true;
                oldSurface.width = Math.max(bounds.width * scaleX, 257);
                oldSurface.height = Math.max(bounds.height * scaleY, 257);
            }
            else {
                var newContext = sys.sharedRenderContext;
                var newSurface = newContext.surface;
                sys.sharedRenderContext = oldContext;
                this.renderContext = newContext;
                this.surface = newSurface;
                newSurface.width = Math.max(bounds.width * scaleX, 257);
                newSurface.height = Math.max(bounds.height * scaleY, 257);
                //if (bounds.width !== 0 && bounds.height !== 0) {
                    newContext.setTransform(1, 0, 0, 1, 0, 0);
                    newContext.drawImage(oldSurface, (oldOffsetX - this.offsetX) * scaleX, (oldOffsetY - this.offsetY) * scaleY);
                //}
                if (Capabilities.runtimeType != RuntimeType.NATIVE) {
                    oldSurface.height = 1;
                    oldSurface.width = 1;
                }
            }

            this.rootMatrix.setTo(1, 0, 0, 1, - this.offsetX, - this.offsetY);
            this.renderContext.setTransform(1, 0, 0, 1, - bounds.x, - bounds.y);
        }

        public setDevicePixelRatio(ratio: number = 1) {
            if (this.$pixelRatio == ratio && this.$ratioMatrix)
                return;
            if (!this.$ratioMatrix)
                this.$ratioMatrix = Matrix.create();
            this.$ratioChanged = true;
            this.$pixelRatio = ratio;
            this.$ratioMatrix.setTo(ratio, 0, 0, ratio, 0, 0);
            this.root.$invalidate(true);
        }

        public setDirtyRegionPolicy(policy:string):void {
            //todo 这里还可以做更多优化
            this.dirtyRegion.setDirtyRegionPolicy(policy);
        }
    }
}