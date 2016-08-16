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

module egret.sys {

    var displayListPool: DisplayList[] = [];
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
        public static create(target: DisplayObject): DisplayList {
            var displayList = new egret.sys.DisplayList(target);
            try {
                var buffer = new RenderBuffer();
            }
            catch (e) {
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
        public constructor(root: DisplayObject) {
            super();
            this.root = root;
            this.dirtyRegion = new DirtyRegion(root);
            this.isStage = (root instanceof Stage);
            this.dirtyNodes = egret.createMap<boolean>();
        }

        private isStage: boolean = false;
        /**
         * 位图渲染节点
         */
        $renderNode: RenderNode = new BitmapNode();

        /**
         * @private
         * 获取渲染节点
         */
        $getRenderNode(): sys.RenderNode {
            return this.$renderNode;
        }

        /**
         * @private
         * 更新对象在舞台上的显示区域和透明度,返回显示区域是否发生改变。
         */
        $update(dirtyRegionPolicy: string): boolean {
            var target = this.root;
            //当cache对象的显示列表已经加入dirtyList，对象又取消cache的时候，root为空
            if (target == null) {
                return false;
            }
            target.$removeFlagsUp(DisplayObjectFlags.Dirty);
            var node = this.$renderNode;
            //这里不需要更新node.renderAlpha。因为alpha已经写入到缓存的内部

            //必须在访问moved属性前调用以下两个方法，因为moved属性在以下两个方法内重置。
            var concatenatedMatrix = target.$getConcatenatedMatrix();
            if (dirtyRegionPolicy == DirtyRegionPolicy.OFF) {
                var displayList = target.$parentDisplayList;
                if (this.needUpdateRegions) {
                    this.updateDirtyRegions();
                }
                if (!displayList) {
                    return false;
                }
                var matrix = node.renderMatrix;
                matrix.copyFrom(concatenatedMatrix);
                var root = displayList.root;
                if (root !== target.$stage) {
                    target.$getConcatenatedMatrixAt(root, matrix);
                }
            }
            else {
                var bounds = target.$getOriginalBounds();
                var displayList = target.$parentDisplayList;
                var region = node.renderRegion;
                if (this.needUpdateRegions) {
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
                var matrix = node.renderMatrix;
                matrix.copyFrom(concatenatedMatrix);
                var root = displayList.root;
                if (root !== target.$stage) {
                    target.$getConcatenatedMatrixAt(root, matrix);
                }
                region.updateRegion(bounds, matrix);
            }
            return true;
        }

        /**
         * @private
         */
        public renderBuffer: RenderBuffer = null;
        /**
         * @private
         */
        public offsetX: number = 0;
        /**
         * @private
         */
        public offsetY: number = 0;
        /**
         * @private
         */
        private offsetMatrix: Matrix = new Matrix();
        /**
         * @private
         * 显示列表根节点
         */
        public root: DisplayObject;

        /**
         * @private
         */
        public isDirty: boolean = false;

        public needUpdateRegions: boolean = false;

        /**
         * @private
         * 设置剪裁边界，不再绘制完整目标对象，画布尺寸由外部决定，超过边界的节点将跳过绘制。
         */
        public setClipRect(width: number, height: number): void {
            this.dirtyRegion.setClipRect(width, height);
            this.renderBuffer.resize(width, height);
        }

        /**
         * @private
         * 显示对象的渲染节点发生改变时，把自身的IRenderable对象注册到此列表上。
         */
        private dirtyNodes: MapLike<boolean>;

        /**
         * @private
         */
        private dirtyNodeList: Renderable[] = [];

        /**
         * @private
         * 标记一个节点需要重新渲染
         */
        public markDirty(node: Renderable): void {
            var key = node.$hashCode;
            if (this.dirtyNodes[key]) {
                return;
            }
            this.dirtyNodes[key] = true;
            this.dirtyNodeList.push(node);
            if (!this.needUpdateRegions) {
                this.needUpdateRegions = true;
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
        private dirtyList: Region[] = null;

        /**
         * @private
         */
        private dirtyRegion: DirtyRegion;

        /**
         * @private
         * 更新节点属性并返回脏矩形列表。
         */
        public updateDirtyRegions(): Region[] {
            var dirtyNodeList = this.dirtyNodeList;
            this.dirtyNodeList = [];
            this.dirtyNodes = egret.createMap<boolean>();
            this.needUpdateRegions = false;
            var dirtyRegion = this.dirtyRegion;
            var length = dirtyNodeList.length;
            for (var i = 0; i < length; i++) {
                var display = dirtyNodeList[i];
                var node = display.$getRenderNode();
                node.needRedraw = false;//先清空上次缓存的标记,防止上次没遍历到的节点needRedraw始终为true.
                if (this.isStage) {
                    if (node.renderAlpha > 0 && node.renderVisible) {
                        if (dirtyRegion.addRegion(node.renderRegion)) {
                            node.needRedraw = true;
                        }
                    }
                    var moved = display.$update(this.$dirtyRegionPolicy);
                    if (node.renderAlpha > 0 && node.renderVisible && (moved || !node.needRedraw)) {//若不判断needRedraw,从0设置为1的情况将会不显示
                        if (dirtyRegion.addRegion(node.renderRegion)) {
                            node.needRedraw = true;
                        }
                    }
                }
                else {
                    if (dirtyRegion.addRegion(node.renderRegion)) {
                        node.needRedraw = true;
                    }
                    var moved = display.$update(this.$dirtyRegionPolicy);
                    if (moved || !node.needRedraw) {//若不判断needRedraw,从0设置为1的情况将会不显示
                        if (dirtyRegion.addRegion(node.renderRegion)) {
                            node.needRedraw = true;
                        }
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
        public drawToSurface(): number {
            var drawCalls = 0;
            var dirtyList = this.dirtyList;
            if (dirtyList && dirtyList.length > 0) {
                if (!this.isStage) {//对非舞台画布要根据目标显示对象尺寸改变而改变。
                    this.changeSurfaceSize();
                }
                var buffer = this.renderBuffer;
                buffer.beginClip(this.dirtyList, this.offsetX, this.offsetY);
                var dirtyList = this.$dirtyRegionPolicy == egret.DirtyRegionPolicy.OFF ? null : this.dirtyList;
                var drawCalls = systemRenderer.render(this.root, buffer, this.offsetMatrix, dirtyList);
                buffer.endClip();
                var surface = buffer.surface;
                var renderNode = <BitmapNode>this.$renderNode;
                renderNode.drawData.length = 0;
                renderNode.image = <any>surface;
                var width = surface.width;
                var height = surface.height;
                renderNode.imageWidth = width;
                renderNode.imageHeight = height;
                renderNode.drawImage(0, 0, width, height, -this.offsetX, -this.offsetY, width, height);
            }

            this.dirtyList = null;
            this.dirtyRegion.clear();
            this.isDirty = false;
            return drawCalls;
        }


        /**
         * @private
         */
        private sizeChanged: boolean = false;

        /**
         * @private
         * 改变画布的尺寸，由于画布尺寸修改会清空原始画布。所以这里将原始画布绘制到一个新画布上，再与原始画布交换。
         */
        public changeSurfaceSize(): void {
            var root = this.root;
            var oldOffsetX = this.offsetX;
            var oldOffsetY = this.offsetY;
            var bounds = this.root.$getOriginalBounds();
            this.offsetX = -bounds.x;
            this.offsetY = -bounds.y;
            this.offsetMatrix.setTo(1, 0, 0, 1, this.offsetX, this.offsetY);
            var buffer = this.renderBuffer;
            //在chrome里，小等于256*256的canvas会不启用GPU加速。
            var width = Math.max(257, bounds.width);
            var height = Math.max(257, bounds.height);
            if (this.offsetX == oldOffsetX &&
                this.offsetY == oldOffsetY &&
                buffer.surface.width == width &&
                buffer.surface.height == height) {
                return;
            }
            if (!this.sizeChanged) {
                this.sizeChanged = true;
                buffer.resize(width, height);
            }
            else {
                buffer.resizeTo(width, height, this.offsetX - oldOffsetX, this.offsetY - oldOffsetY);
            }
        }

        private $dirtyRegionPolicy: string = egret.DirtyRegionPolicy.ON;

        public setDirtyRegionPolicy(policy: string): void {
            //todo 这里还可以做更多优化
            this.$dirtyRegionPolicy = policy;
            this.dirtyRegion.setDirtyRegionPolicy(policy);
            this.renderBuffer.setDirtyRegionPolicy(policy);
        }
    }
}
