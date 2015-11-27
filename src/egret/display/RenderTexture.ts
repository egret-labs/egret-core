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

module egret {
    var blendModes = ["source-over", "lighter", "destination-out"];
    var defaultCompositeOp = "source-over";

    /**
     * @language en_US
     * RenderTexture is a dynamic texture
     * @extends egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/RenderTexture.ts
     */
    /**
     * @language zh_CN
     * RenderTexture 是动态纹理类，他实现了将显示对象及其子对象绘制成为一个纹理的功能
     * @extends egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/RenderTexture.ts
     */
    export class RenderTexture extends egret.Texture {

        protected context:sys.RenderContext;

        private rootDisplayList:sys.DisplayList;

        constructor() {
            super();
        }

        /**
         * @language en_US
         * The specified display object is drawn as a texture
         * @param displayObject {egret.DisplayObject} the display to draw
         * @param clipBounds {egret.Rectangle} clip rect
         * @param scale {number} scale factor
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定显示对象绘制为一个纹理
         * @param displayObject {egret.DisplayObject} 需要绘制的显示对象
         * @param clipBounds {egret.Rectangle} 绘制矩形区域
         * @param scale {number} 缩放比例
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawToTexture(displayObject:egret.DisplayObject, clipBounds?:Rectangle, scale:number = 1):boolean {
            if (clipBounds && (clipBounds.width == 0 || clipBounds.height==0)){
                return false;
            }
            this.dispose();

            var bounds = clipBounds || displayObject.$getOriginalBounds();
            if (bounds.width == 0 || bounds.height == 0) {
                return false;
            }

            scale /= $TextureScaleFactor;
            var width = (bounds.x + bounds.width);
            var height = (bounds.y + bounds.height);
            if(clipBounds) {
                width = bounds.width;
                height = bounds.height;
            }
            this.context = this.createRenderContext(width, height);
            if (!this.context) {
                return false;
            }

            var root = new egret.DisplayObjectContainer();
            this.rootDisplayList = sys.DisplayList.create(root);
            root.$displayList = this.rootDisplayList;
            root.$children.push(displayObject);

            var hasRenderRegion = displayObject.$renderRegion;
            if(!hasRenderRegion) {
                displayObject.$renderRegion = sys.Region.create();
            }
            var parent = displayObject.$parent;
            displayObject.$parent = null;
            this.$saveParentDisplayList(displayObject);
            this.$update(displayObject);
            displayObject.$parent = parent;
            if(!hasRenderRegion) {
                sys.Region.release(displayObject.$renderRegion);
                displayObject.$renderRegion = null;
            }

            var renderMatrix = displayObject.$renderMatrix;
            var invertMatrix = Matrix.create();
            renderMatrix.$invertInto(invertMatrix);
            //应用裁切
            if(clipBounds) {
                invertMatrix.translate(-clipBounds.x, -clipBounds.y);
            }
            //应用缩放
            if(scale) {
                invertMatrix.scale(scale, scale);
            }

            this.context.clearRect(0, 0, width, height);
            this.context.setTransform(invertMatrix.a, invertMatrix.b, invertMatrix.c, invertMatrix.d, invertMatrix.tx, invertMatrix.ty);
            var drawCalls = this.drawDisplayObject(root, this.context, invertMatrix);
            Matrix.release(invertMatrix);

            this._setBitmapData(this.context.surface);
            //设置纹理参数
            this.$initData(0, 0, width, height, 0, 0, width, height, width, height);
            this.$reset(displayObject);
            this.$displayListMap = {};
            return true;
        }

        private $displayListMap = {};

        private $saveParentDisplayList(displayObject:DisplayObject):void {
            this.$displayListMap[displayObject.$hashCode] = displayObject.$displayList;
            displayObject.$displayList = this.rootDisplayList;
            if (displayObject instanceof DisplayObjectContainer) {
                var children:DisplayObject[] = (<DisplayObjectContainer>displayObject).$children;
                var length:number = children.length;
                for (var i:number = 0; i < length; i++) {
                    var child:DisplayObject = children[i];
                    this.$saveParentDisplayList(child);
                }
            }
        }

        private $update(displayObject:DisplayObject):void {
            if (displayObject.$renderRegion) {
                displayObject.$renderRegion.moved = true;
                displayObject.$update();
            }
            if (displayObject instanceof DisplayObjectContainer) {
                var children:DisplayObject[] = (<DisplayObjectContainer>displayObject).$children;
                var length:number = children.length;
                for (var i:number = 0; i < length; i++) {
                    var child:DisplayObject = children[i];
                    this.$update(child);
                }
            }
        }

        private $reset(displayObject:DisplayObject):void {
            displayObject.$displayList = this.$displayListMap[displayObject.$hashCode];
            if (displayObject instanceof DisplayObjectContainer) {
                var children:DisplayObject[] = (<DisplayObjectContainer>displayObject).$children;
                var length:number = children.length;
                for (var i:number = 0; i < length; i++) {
                    var child:DisplayObject = children[i];
                    this.$reset(child);
                }
            }
        }

        protected drawDisplayObject(displayObject:DisplayObject, context:sys.RenderContext, rootMatrix:Matrix):number {
            var drawCalls = 0;
            var node:sys.Renderable;
            var globalAlpha:number;
            if (displayObject.$renderRegion) {
                node = displayObject;
                globalAlpha = displayObject.$renderAlpha;
            }
            if (node) {
                drawCalls++;
                context.globalAlpha = globalAlpha;
                var m = node.$renderMatrix;
                if (rootMatrix) {
                    context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    node.$render(context);
                    context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx, rootMatrix.ty);
                }
                else {//绘制到舞台上时，所有矩阵都是绝对的，不需要调用transform()叠加。
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    node.$render(context);
                }
            }
            var children = displayObject.$children;
            if (children) {
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var child = children[i];
                    if (!child.$visible || child.$alpha <= 0 || child.$maskedObject) {
                        continue;
                    }
                    if (child.$blendMode !== 0 || child.$mask) {
                        drawCalls += this.drawWithClip(child, context, rootMatrix);
                    }
                    else if (child.$scrollRect || child.$maskRect) {
                        drawCalls += this.drawWithScrollRect(child, context, rootMatrix);
                    }
                    else {
                        drawCalls += this.drawDisplayObject(child, context, rootMatrix);
                    }
                }
            }
            return drawCalls;
        }

        private drawWithClip(displayObject:DisplayObject, context:sys.RenderContext, rootMatrix:Matrix):number {
            var drawCalls = 0;
            var hasBlendMode = (displayObject.$blendMode !== 0);
            if (hasBlendMode) {
                var compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }

            var scrollRect = displayObject.$scrollRect;
            var mask = displayObject.$mask;

            //计算scrollRect和mask的clip区域是否需要绘制，不需要就直接返回，跳过所有子项的遍历。
            var maskRegion:sys.Region;
            var displayMatrix = displayObject.$getConcatenatedMatrix();
            if (mask) {
                var bounds = mask.$getOriginalBounds();
                maskRegion = sys.Region.create();
                maskRegion.updateRegion(bounds, mask.$getConcatenatedMatrix());
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
                if (region.isEmpty()) {
                    sys.Region.release(region);
                    return drawCalls;
                }
            }
            else {
                region = sys.Region.create();
                bounds = displayObject.$getOriginalBounds();
                region.updateRegion(bounds, displayObject.$getConcatenatedMatrix());
            }

            //绘制显示对象自身，若有scrollRect，应用clip
            var displayContext = this.createRenderContext(region.width, region.height);
            if (!displayContext) {//RenderContext创建失败，放弃绘制遮罩。
                drawCalls += this.drawDisplayObject(displayObject, context, rootMatrix);
                sys.Region.release(region);
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
            drawCalls += this.drawDisplayObject(displayObject, displayContext, rootM);
            Matrix.release(rootM);
            //绘制遮罩
            if (mask) {
                var maskContext = this.createRenderContext(region.width, region.height);
                if (!maskContext) {//RenderContext创建失败，放弃绘制遮罩。
                    drawCalls += this.drawDisplayObject(displayObject, context, rootMatrix);
                    sys.surfaceFactory.release(displayContext.surface);
                    sys.Region.release(region);
                    return drawCalls;
                }
                maskContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                rootM = Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                var calls = this.drawDisplayObject(mask, maskContext, rootM);
                Matrix.release(rootM);
                if (calls > 0) {
                    drawCalls += calls;
                    displayContext.globalCompositeOperation = "destination-in";
                    displayContext.setTransform(1, 0, 0, 1, 0, 0);
                    displayContext.globalAlpha = 1;
                    displayContext.drawImage(maskContext.surface, 0, 0);
                }
                sys.surfaceFactory.release(maskContext.surface);
            }


            //绘制结果到屏幕
            if (drawCalls > 0) {
                drawCalls++;
                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }
                context.setTransform(1, 0, 0, 1, region.minX, region.minY);
                context.drawImage(displayContext.surface, 0, 0);

                if (hasBlendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
            }
            sys.surfaceFactory.release(displayContext.surface);
            sys.Region.release(region);
            return drawCalls;
        }

        private drawWithScrollRect(displayObject:DisplayObject, context:sys.RenderContext, rootMatrix:Matrix):number {
            var drawCalls = 0;
            var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            if (scrollRect.width == 0 || scrollRect.height == 0) {
                return drawCalls;
            }
            var m = displayObject.$getConcatenatedMatrix();
            var region:sys.Region = sys.Region.create();
            if (!scrollRect.isEmpty()) {
                region.updateRegion(scrollRect, m);
            }
            if (region.isEmpty()) {
                sys.Region.release(region);
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
            context.rect(0, 0, scrollRect.width, scrollRect.height);
            context.clip();
            if (rootMatrix) {
                context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx, rootMatrix.ty);
            }
            drawCalls += this.drawDisplayObject(displayObject, context, rootMatrix);
            context.restore();

            sys.Region.release(region);
            return drawCalls;
        }

        protected createRenderContext(width:number, height:number):sys.RenderContext {
            var surface = sys.surfaceFactory.create(true);
            if (!surface) {
                return null;
            }
            surface.width = Math.max(257, width);
            surface.height = Math.max(257, height);
            return surface.renderContext;
        }

        public dispose():void {
            super.dispose();
            if(this.rootDisplayList) {
                sys.DisplayList.release(this.rootDisplayList);
                this.rootDisplayList = null;
            }
            if(this.context) {
                sys.surfaceFactory.release(this.context.surface);
            }
        }
    }
}