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

    export class RenderTexture extends egret.Texture {

        constructor() {
            super();
        }

        public drawToTexture(displayObject:egret.DisplayObject, clipBounds?:Rectangle, scale:number = 1):boolean {
            scale /= $TextureScaleFactor;
            var originParent = displayObject.$parent;
            var c1 = new egret.DisplayObjectContainer();
            c1.addChild(displayObject);
            c1.scaleX = c1.scaleY = scale;

            if (clipBounds) {
                var scrollRect = new egret.Rectangle();
                scrollRect.setTo(clipBounds.x, clipBounds.y, clipBounds.width, clipBounds.height);
                c1.scrollRect = scrollRect;
            }

            var root = new egret.DisplayObjectContainer();
            var displayList = sys.DisplayList.create(root);
            root.$displayList = displayList;
            root.addChild(c1);

            this.$update(displayObject);
            sys.DisplayList.release(displayList);
            root.$displayList = null;
            var bounds = displayObject.getBounds();
            var context = this.createRenderContext(bounds.width * scale, bounds.height * scale);
            context.clearRect(0, 0, bounds.width * scale, bounds.height * scale);
            this._offsetX = bounds.x * scale;
            this._offsetY = bounds.y * scale;
            if (!context) {
                return false;
            }
            var drawCalls = this.drawDisplayObject(root, context);
            if (drawCalls == 0) {
                return false;
            }
            this._setBitmapData(context.surface);
            this._offsetX = bounds.x * scale;
            this._offsetY = bounds.y * scale;
            if (originParent) {
                originParent.addChild(displayObject);
            }
            return true;
        }

        private $update(displayObject:DisplayObject):void {
            if (displayObject.$renderRegion) {
                displayObject.$renderRegion.moved = true;
                displayObject.$update();
            }
            else if (displayObject instanceof DisplayObjectContainer) {
                var children:DisplayObject[] = (<DisplayObjectContainer>displayObject).$children;
                var length:number = children.length;
                for (var i:number = 0; i < length; i++) {
                    var child:DisplayObject = children[i];
                    this.$update(child);
                }
            }
        }

        private drawDisplayObject(displayObject:DisplayObject, context:sys.RenderContext):number {
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
                context.setTransform(m.a, m.b, m.c, m.d, m.tx - this._offsetX, m.ty - this._offsetY);
                node.$render(context);
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
                        drawCalls += this.drawWithClip(child, context);
                    }
                    else if (child.$scrollRect) {
                        drawCalls += this.drawWithScrollRect(child, context);
                    }
                    else {
                        drawCalls += this.drawDisplayObject(child, context);
                    }
                }
            }
            return drawCalls;
        }

        private drawWithClip(displayObject:DisplayObject, context:sys.RenderContext):number {
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
                drawCalls += this.drawDisplayObject(displayObject, context);
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
            drawCalls += this.drawDisplayObject(displayObject, displayContext);
            Matrix.release(rootM);
            //绘制遮罩
            if (mask) {
                var maskContext = this.createRenderContext(region.width, region.height);
                if (!maskContext) {//RenderContext创建失败，放弃绘制遮罩。
                    drawCalls += this.drawDisplayObject(displayObject, context);
                    sys.surfaceFactory.release(displayContext.surface);
                    sys.Region.release(region);
                    return drawCalls;
                }
                maskContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                rootM = Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                var calls = this.drawDisplayObject(mask, maskContext);
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

        private drawWithScrollRect(displayObject:DisplayObject, context:sys.RenderContext):number {
            var drawCalls = 0;
            var scrollRect = displayObject.$scrollRect;

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
            context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            context.beginPath();
            context.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
            context.clip();
            drawCalls += this.drawDisplayObject(displayObject, context);
            context.restore();

            sys.Region.release(region);
            return drawCalls;
        }

        private createRenderContext(width:number, height:number):sys.RenderContext {
            var surface = sys.surfaceFactory.create(true);
            if (!surface) {
                return null;
            }
            surface.width = Math.max(257, width);
            surface.height = Math.max(257, height);
            return surface.renderContext;
        }
    }
}