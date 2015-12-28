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
         * 创建一个DisplayList对象，若内存不足或无法创建RenderBuffer，将会返回null。
         */
        public static create(target:DisplayObject):DisplayList {
            var displayList = new egret.sys.DisplayList(target);
            try{
                var buffer = new RenderBuffer(200,200);
            }
            catch (e){
                return null;
            }
            displayList.renderBuffer = buffer;
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
            else {
                var matrix = Matrix.create().copyFrom(concatenatedMatrix);
                target.$getConcatenatedMatrixAt(root, matrix);
                region.updateRegion(bounds, matrix);
                Matrix.release(matrix);
            }
            return true;
        }

        public renderBuffer:RenderBuffer = null;
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
         * 设置剪裁边界，不再绘制完整目标对象，画布尺寸由外部决定，超过边界的节点将跳过绘制。
         */
        public setClipRect(width:number, height:number):void {
            this.dirtyRegion.setClipRect(width, height);
            this.rootMatrix = null;//只有舞台画布才能设置ClipRect
            this.renderBuffer.resize(width,height);
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
            var buffer = this.renderBuffer;
            buffer.beginClip(this.dirtyList, -this.offsetY, -this.offsetY);
            var drawCalls = systemRenderer.render(this.root, buffer, this.rootMatrix);
            buffer.endClip();
            var surface = buffer.surface;
            var renderNode = <BitmapNode>this.$renderNode;
            renderNode.drawData.length = 0;
            renderNode.image = <any>surface;
            renderNode.drawImage(0, 0, surface.width, surface.height, this.offsetX, this.offsetY, surface.width, surface.height);
            this.dirtyList = null;
            this.dirtyRegion.clear();
            this.isDirty = false;
            return drawCalls;
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
            var buffer = this.renderBuffer;
            if (!this.sizeChanged) {
                this.sizeChanged = true;
                buffer.resize(bounds.width, bounds.height);
            }
            else {
                buffer.resizeTo(bounds.width, bounds.height, oldOffsetX - this.offsetX, oldOffsetY - this.offsetY);
            }

            var m = root.$getInvertedConcatenatedMatrix();
            this.rootMatrix.setTo(m.a, m.b, m.c, m.d, m.tx - bounds.x, m.ty - bounds.y);
        }

        public setDirtyRegionPolicy(policy:string):void {
            //todo 这里还可以做更多优化
            this.dirtyRegion.setDirtyRegionPolicy(policy);
        }

        private render(context:RenderContext, node:RenderNode):void {
            switch (node.type) {
                case RenderNodeType.BitmapNode:
                    var bitmapNode = <BitmapNode>node;
                    var image = bitmapNode.image;
                    context.imageSmoothingEnabled = bitmapNode.smoothing;
                    var data = bitmapNode.drawData;
                    var length = data.length;
                    for (var i = 0; i < length; i += 8) {
                        context.drawImage(image, data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4], data[i + 5], data[i + 6], data[i + 7]);
                    }
                    break;
            }
        }

    }
}