/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

module egret {
    /**
     * @class egret.WebGLRenderer
     * @classdesc
     * WebGL的渲染类
     * @extends egret.RendererContext
     * @private
     */
    export class WebGLRenderer extends RendererContext {
        private static glID:number = 0;
        private static isInit:boolean = false;
        private canvas:HTMLCanvasElement = null;
        private gl:WebGLRenderingContext = null;
        private glID:number = null;
        private size:number = 2000;
        private vertices:Float32Array = null;
        private vertSize:number = 5;
        private indices:Uint16Array = null;
        private projectionX:number = NaN;
        private projectionY:number = NaN;
        private shaderManager:WebGLShaderManager = null;

        constructor(canvas?:HTMLCanvasElement) {
            super();

            Texture.prototype.dispose = Texture.prototype._disposeForCanvas;

            this.canvas = canvas || this.createCanvas();
            this.canvas.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
            this.canvas.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);

            this.html5Canvas = document.createElement("canvas");
            this.canvasContext = new HTML5CanvasRenderer(this.html5Canvas);

            this.onResize();

            this.projectionX = this.canvas.width / 2;
            this.projectionY = -this.canvas.height / 2;

            var numVerts = this.size * 4 * this.vertSize;
            var numIndices = this.size * 6;

            this.vertices = new Float32Array(numVerts);
            this.indices = new Uint16Array(numIndices);

            for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
                this.indices[i + 0] = j + 0;
                this.indices[i + 1] = j + 1;
                this.indices[i + 2] = j + 2;
                this.indices[i + 3] = j + 0;
                this.indices[i + 4] = j + 2;
                this.indices[i + 5] = j + 3;
            }
            this.initWebGL();

            this.shaderManager = new WebGLShaderManager(this.gl);

            this.worldTransform = new Matrix();

            this.initAll();
        }

        public onRenderFinish():void {
            this._drawWebGL();
        }

        private initAll():void {
            if (WebGLRenderer.isInit) {
                return;
            }
            WebGLRenderer.isInit = true;
            egret_webgl_graphics.init();
            egret.TextField.prototype._makeBitmapCache = function () {
                if (!this.renderTexture) {
                    this.renderTexture = new egret.RenderTexture();
                }
                var bounds = this.getBounds(Rectangle.identity);
                if (bounds.width == 0 || bounds.height == 0) {
                    this._texture_to_render = null;
                    return false;
                }

                if (!this._bitmapData) {
                    this._bitmapData = document.createElement("canvas");
                    this.renderContext = egret.RendererContext.createRendererContext(this._bitmapData);
                }
                var width = bounds.width;
                var height = bounds.height;

                var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
                width /= texture_scale_factor;
                height /= texture_scale_factor;

                width = Math.round(width);
                height = Math.round(height);

                var cacheCanvas:HTMLCanvasElement = this._bitmapData;
                cacheCanvas.width = width;
                cacheCanvas.height = height;
                cacheCanvas.style.width = width + "px";
                cacheCanvas.style.height = height + "px";

                if (this.renderContext._cacheCanvas) {
                    this.renderContext._cacheCanvas.width = width;
                    this.renderContext._cacheCanvas.height = height;
                }

                this._worldTransform.identity();
                this._worldTransform.a = 1 / texture_scale_factor;
                this._worldTransform.d = 1 / texture_scale_factor;
                this.renderContext.setTransform(this._worldTransform);
                this.worldAlpha = 1;

                var renderFilter = egret.RenderFilter.getInstance();
                var drawAreaList:Array<Rectangle> = renderFilter._drawAreaList.concat();
                renderFilter._drawAreaList.length = 0;
                this.renderContext.clearScreen();
                this.renderContext.onRenderStart();
                this.renderTexture.dispose();
                Texture.deleteWebGLTexture(this.renderTexture);
                if (this._colorTransform) {
                    this.renderContext.setGlobalColorTransform(this._colorTransform.matrix);
                }
                var mask = this.mask || this._scrollRect;
                if (mask) {
                    this.renderContext.pushMask(mask);
                }
                this._render(this.renderContext);
                if (mask) {
                    this.renderContext.popMask();
                }
                if (this._colorTransform) {
                    this.renderContext.setGlobalColorTransform(null);
                }
                RenderTexture.identityRectangle.width = width;
                RenderTexture.identityRectangle.height = height;
                renderFilter.addDrawArea(RenderTexture.identityRectangle);
                this.renderContext.onRenderFinish();
                renderFilter._drawAreaList = drawAreaList;

                this.renderTexture._bitmapData = this._bitmapData;
                this.renderTexture._sourceWidth = width;
                this.renderTexture._sourceHeight = height;
                this.renderTexture._textureWidth = this.renderTexture._sourceWidth * texture_scale_factor;
                this.renderTexture._textureHeight = this.renderTexture._sourceHeight * texture_scale_factor;

                this._texture_to_render = this.renderTexture;
                return true;
            };

            egret.TextField.prototype._draw = function (renderContext) {
                var textField:egret.TextField = <egret.TextField>this;
                if (textField.getDirty()) {
                    this._texture_to_render = this.renderTexture;
                    this._cacheAsBitmap = true;
                }
                egret.DisplayObject.prototype._draw.call(textField, renderContext);
            };


            egret.RenderTexture.prototype.init = function () {
                var o:any = this;
                o._bitmapData = document.createElement("canvas");
                o._bitmapData["avaliable"] = true;
                o.canvasContext = o._bitmapData.getContext("2d");
                o._webglBitmapData = document.createElement("canvas");
                o._bitmapData["avaliable"] = true;
                o.renderContext = new egret.WebGLRenderer(o._webglBitmapData);
            };

            egret.RenderTexture.prototype.setSize = function (width, height) {
                var o:any = this;
                if (o._webglBitmapData) {
                    var cacheCanvas:HTMLCanvasElement = o._webglBitmapData;
                    cacheCanvas.width = width;
                    cacheCanvas.height = height;
                    cacheCanvas.style.width = width + "px";
                    cacheCanvas.style.height = height + "px";

                    o.renderContext.projectionX = width / 2;
                    o.renderContext.projectionY = -height / 2;
                    o.renderContext.viewportScale = egret.MainContext.instance.rendererContext._texture_scale_factor;
                }
            };

            egret.RenderTexture.prototype.end = function () {

            };

            //todo 如果是文本会有问题
            RenderTexture.prototype.drawToTexture = function (displayObject:egret.DisplayObject, clipBounds?:Rectangle, scale?:number):boolean {
                var bounds = clipBounds || displayObject.getBounds(egret.Rectangle.identity);
                if (bounds.width == 0 || bounds.height == 0) {
                    return false;
                }
                if (clipBounds && (clipBounds.width == 0 || clipBounds.height == 0)) {
                    return false;
                }
                if (typeof scale == "undefined") {
                    scale = 1;
                }
                if (!this._bitmapData) {
                    this._bitmapData = document.createElement("canvas");
                    this._bitmapData["avaliable"] = true;
                    this.canvasContext = this._bitmapData.getContext("2d");
                    //todo 多层嵌套会有隐患
                    if (!RenderTexture["WebGLCanvas"]) {
                        RenderTexture["WebGLCanvas"] = document.createElement("canvas");
                        RenderTexture["WebGLCanvas"]["avaliable"] = true;
                        RenderTexture["WebGLRenderer"] = new egret.WebGLRenderer(RenderTexture["WebGLCanvas"]);
                    }
                    this._webglBitmapData = RenderTexture["WebGLCanvas"];
                    this.renderContext = RenderTexture["WebGLRenderer"];
                }
                var x = bounds.x;
                var y = bounds.y;
                var width = bounds.width;
                var height = bounds.height;
                width /= scale;
                height /= scale;
                var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
                width = Math.round(width);
                height = Math.round(height);
                this.setSize(width, height);
                var cacheCanvas = this._bitmapData;
                var cacheCanvasWidth = width / texture_scale_factor * scale;
                var cacheCanvasHeight = height / texture_scale_factor * scale;
                cacheCanvas.width = cacheCanvasWidth;
                cacheCanvas.height = cacheCanvasHeight;
                cacheCanvas.style.width = cacheCanvasWidth + "px";
                cacheCanvas.style.height = cacheCanvasHeight + "px";
                this.begin();
                displayObject._worldTransform.identity();
                var anchorOffsetX = displayObject._anchorOffsetX;
                var anchorOffsetY = displayObject._anchorOffsetY;
                if (displayObject._anchorX != 0 || displayObject._anchorY != 0) {
                    anchorOffsetX = displayObject._anchorX * width;
                    anchorOffsetY = displayObject._anchorY * height;
                }
                this._offsetX = x + anchorOffsetX;
                this._offsetY = y + anchorOffsetY;
                displayObject._worldTransform.append(1, 0, 0, 1, -this._offsetX, -this._offsetY);
                displayObject.worldAlpha = 1;
                var __use_new_draw = MainContext.__use_new_draw;
                MainContext.__use_new_draw = false;
                if (displayObject instanceof egret.DisplayObjectContainer) {
                    var list = (<DisplayObjectContainer>displayObject)._children;
                    for (var i = 0, length = list.length; i < length; i++) {
                        var child = list[i];
                        child._updateTransform();
                    }
                }
                this.renderContext.setTransform(displayObject._worldTransform);
                var renderFilter = egret.RenderFilter.getInstance();
                var drawAreaList = renderFilter._drawAreaList.concat();
                renderFilter._drawAreaList.length = 0;
                var gl = this.renderContext.gl;
                gl.viewport(0, 0, width, height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                this.renderContext.onRenderStart();
                Texture.deleteWebGLTexture(this);
                if(displayObject._filter) {
                    this.renderContext.setGlobalFilter(displayObject._filter);
                }
                if (displayObject._colorTransform) {
                    this.renderContext.setGlobalColorTransform(displayObject._colorTransform.matrix);
                }
                var mask = displayObject.mask || displayObject._scrollRect;
                if (mask) {
                    this.renderContext.pushMask(mask);
                }
                displayObject._render(this.renderContext);
                this.renderContext["_drawWebGL"]();
                MainContext.__use_new_draw = __use_new_draw;
                if (mask) {
                    this.renderContext.popMask();
                }
                if (displayObject._colorTransform) {
                    this.renderContext.setGlobalColorTransform(null);
                }
                if(displayObject._filter) {
                    this.renderContext.setGlobalFilter(null);
                }
                egret.RenderTexture.identityRectangle.width = width;
                egret.RenderTexture.identityRectangle.height = height;
                renderFilter.addDrawArea(egret.RenderTexture.identityRectangle);
                this.renderContext.onRenderFinish();
                renderFilter._drawAreaList = drawAreaList;

                this._sourceWidth = width / texture_scale_factor * scale;
                this._sourceHeight = height / texture_scale_factor * scale;
                this._textureWidth = width * scale;
                this._textureHeight = height * scale;

                this.canvasContext.drawImage(this._webglBitmapData, 0, 0, width, height, 0, 0, this._sourceWidth, this._sourceHeight);

                //测试代码
                //document.documentElement.appendChild(this._bitmapData);
                return true;
            };

            //egret.Graphics.prototype._draw = function (renderContext:WebGLRenderer) {
            //    //todo dirty
            //    var commandQueue = this["commandQueue"];
            //    var length:number = commandQueue.length;
            //    if (length == 0) {
            //        return;
            //    }
            //    var stage:Stage = egret.MainContext.instance.stage;
            //    var stageW:number = stage.stageWidth;
            //    var stageH:number = stage.stageHeight;
            //
            //    this.renderContext = renderContext.canvasContext;
            //    this.canvasContext = this.renderContext._cacheCanvasContext || this.renderContext.canvasContext;
            //    this.canvasContext.clearRect(0, 0, stageW, stageH);
            //    this.canvasContext.save();
            //    var worldTransform:Matrix = renderContext.worldTransform;
            //    this.canvasContext.setTransform(worldTransform.a, worldTransform.b, worldTransform.c, worldTransform.d, worldTransform.tx, worldTransform.ty);
            //    var worldAlpha:number = renderContext.worldAlpha;
            //    renderContext.canvasContext.setAlpha(worldAlpha, null);
            //    if (this.strokeStyleColor && length > 0 && commandQueue[length - 1] != this.endLineCommand) {
            //        this.createEndLineCommand();
            //        commandQueue.push(this.endLineCommand);
            //        length = commandQueue.length;
            //    }
            //    for (var i:number = 0; i < length; i++) {
            //        var command = commandQueue[i];
            //        command.method.apply(command.thisObject, command.args);
            //    }
            //    this.renderContext.canvasContext.clearRect(0, 0, stageW, stageH);
            //    this.renderContext.canvasContext.drawImage(this.renderContext._cacheCanvas, 0, 0, stageW, stageH, 0, 0, stageW, stageH);
            //
            //    if (!this["graphics_webgl_texture"]) {
            //        this["graphics_webgl_texture"] = new egret.Texture();
            //    }
            //    this["graphics_webgl_texture"]._setBitmapData(renderContext.html5Canvas);
            //    RendererContext.deleteTexture(this);
            //    renderContext.setTransform(egret.Matrix.identity.identity());
            //    renderContext.drawImage(this["graphics_webgl_texture"], 0, 0, stageW, stageH, 0, 0, stageW, stageH);
            //    this.canvasContext.restore();
            //    this._dirty = false;
            //}
        }

        private createCanvas():HTMLCanvasElement {
            var canvas:HTMLCanvasElement = egret.Browser.getInstance().$("#egretCanvas");
            if (!canvas) {
                var container = document.getElementById(egret.StageDelegate.canvas_div_name);
                canvas = egret.Browser.getInstance().$new("canvas");
                canvas.id = "egretCanvas";
                container.appendChild(canvas);
            }
            egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
            return canvas;
        }

        private onResize():void {
            //设置canvas宽高
            var container = document.getElementById(egret.StageDelegate.canvas_div_name);
            if (this.canvas) {
                this.canvas.width = egret.MainContext.instance.stage.stageWidth; //stageW
                this.canvas.height = egret.MainContext.instance.stage.stageHeight; //stageH
                this.canvas.style.width = container.style.width;
                this.canvas.style.height = container.style.height;
//              this.canvas.style.position = "absolute";

                this.projectionX = this.canvas.width / 2;
                this.projectionY = -this.canvas.height / 2;
            }
            if (this.html5Canvas) {
                this.html5Canvas.width = egret.MainContext.instance.stage.stageWidth; //stageW
                this.html5Canvas.height = egret.MainContext.instance.stage.stageHeight; //stageH
                this.html5Canvas.style.width = container.style.width;
                this.html5Canvas.style.height = container.style.height;
            }
        }

        private contextLost:boolean = false;

        private handleContextLost() {
            this.contextLost = true;
        }

        private handleContextRestored() {
            this.initWebGL();
            this.shaderManager.setContext(this.gl);
            this.contextLost = false;
        }

        private initWebGL() {
            var options = {
//                stencil: true//设置可以使用模板（用于遮罩实现）
            };
            var gl:any;
            var names = ["experimental-webgl", "webgl"];
            for (var i = 0; i < names.length; i++) {
                try {
                    gl = this.canvas.getContext(names[i], options);
                } catch (e) {
                }
                if (gl) {
                    break;
                }
            }
            if (!gl) {
                throw new Error(getString(1021));
            }
            WebGLRenderer.glID++;
            this.glID = WebGLRenderer.glID;
            this.setContext(gl);
        }

        private glContextId:number = 0;
        private vertexBuffer;
        private indexBuffer;

        private setContext(gl:any) {
            this.gl = gl;
            gl.id = this.glContextId++;
            this.vertexBuffer = gl.createBuffer();
            this.indexBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.enable(gl.BLEND);
            gl.colorMask(true, true, true, true);
        }

        private start():void {
            if (this.contextLost) {
                return;
            }
            var gl:any = this.gl;

            gl.activeTexture(gl.TEXTURE0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            var shader;
            if (this.colorTransformMatrix) {
                shader = this.shaderManager.colorTransformShader;
            }
            else if (this.filterType == "blur") {
                shader = this.shaderManager.blurShader;
            }
            else {
                shader = this.shaderManager.defaultShader;
            }
            this.shaderManager.activateShader(shader);
            shader.syncUniforms();

            gl.uniform2f(shader.projectionVector, this.projectionX, this.projectionY);

            var stride = this.vertSize * 4;
            gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
            gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
            gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, stride, 4 * 4);
        }

        public clearScreen():void {
            var gl:any = this.gl;
            gl.colorMask(true, true, true, true);
            var list = RenderFilter.getInstance().getDrawAreaList();
            for (var i:number = 0, l:number = list.length; i < l; i++) {
                var area = list[i];
                gl.viewport(area.x, area.y, area.width, area.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            var stage:Stage = egret.MainContext.instance.stage;
            gl.viewport(0, 0, stage.stageWidth, stage.stageHeight);
            this.renderCost = 0;
        }

        private currentBlendMode:string = "";

        private setBlendMode(blendMode:string) {
            if (!blendMode) {
                blendMode = egret.BlendMode.NORMAL;
            }
            if (this.currentBlendMode != blendMode) {
                var blendModeWebGL = RendererContext.blendModesForGL[blendMode];
                if (blendModeWebGL) {
                    this._drawWebGL();
                    this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                    this.currentBlendMode = blendMode;
                }
            }
        }

        private currentBaseTexture:Texture = null;
        private currentBatchSize:number = 0;

        public drawRepeatImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat) {
            var texture_scale_factor = egret.MainContext.instance.rendererContext._texture_scale_factor;
            sourceWidth = sourceWidth * texture_scale_factor;
            sourceHeight = sourceHeight * texture_scale_factor;
            for (var x:number = destX; x < destWidth; x += sourceWidth) {
                for (var y:number = destY; y < destHeight; y += sourceHeight) {
                    var destW:number = Math.min(sourceWidth, destWidth - x);
                    var destH:number = Math.min(sourceHeight, destHeight - y);
                    this.drawImage(texture, sourceX, sourceY, destW / texture_scale_factor, destH / texture_scale_factor, x, y, destW, destH);
                }
            }
        }

        public drawImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat = undefined) {
            if (this.contextLost) {
                return;
            }
            var bitmapData = texture._bitmapData;
            if (!bitmapData["avaliable"]) {
                return;
            }
            if (repeat !== undefined) {
                this.drawRepeatImage(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat);
                return;
            }

            this.createWebGLTexture(texture);
            var webGLTexture = texture._bitmapData.webGLTexture[this.glID];
            if (webGLTexture !== this.currentBaseTexture || this.currentBatchSize >= this.size - 1) {
                this._drawWebGL();
                this.currentBaseTexture = webGLTexture;
            }

            //计算出绘制矩阵，之后把矩阵还原回之前的
            var locWorldTransform = this.worldTransform;
            var originalA:number = locWorldTransform.a;
            var originalB:number = locWorldTransform.b;
            var originalC:number = locWorldTransform.c;
            var originalD:number = locWorldTransform.d;
            var originalTx:number = locWorldTransform.tx;
            var originalTy:number = locWorldTransform.ty;
            if (destX != 0 || destY != 0) {
                locWorldTransform.append(1, 0, 0, 1, destX, destY);
            }
            if (sourceWidth / destWidth != 1 || sourceHeight / destHeight != 1) {
                locWorldTransform.append(destWidth / sourceWidth, 0, 0, destHeight / sourceHeight, 0, 0);
            }
            var a:number = locWorldTransform.a;
            var b:number = locWorldTransform.b;
            var c:number = locWorldTransform.c;
            var d:number = locWorldTransform.d;
            var tx:number = locWorldTransform.tx;
            var ty:number = locWorldTransform.ty;

            locWorldTransform.a = originalA;
            locWorldTransform.b = originalB;
            locWorldTransform.c = originalC;
            locWorldTransform.d = originalD;
            locWorldTransform.tx = originalTx;
            locWorldTransform.ty = originalTy;

            var width:number = texture._sourceWidth;
            var height:number = texture._sourceHeight;

            var w:number = sourceWidth;
            var h:number = sourceHeight;

            sourceX = sourceX / width;
            sourceY = sourceY / height;
            sourceWidth = sourceWidth / width;
            sourceHeight = sourceHeight / height;

            var vertices:Float32Array = this.vertices;
            var index:number = this.currentBatchSize * 4 * this.vertSize;
            var alpha:number = this.worldAlpha;

            // xy
            vertices[index++] = tx;
            vertices[index++] = ty;
            // uv
            vertices[index++] = sourceX;
            vertices[index++] = sourceY;
            // alpha
            vertices[index++] = alpha;

            // xy
            vertices[index++] = a * w + tx;
            vertices[index++] = b * w + ty;
            // uv
            vertices[index++] = sourceWidth + sourceX;
            vertices[index++] = sourceY;
            // alpha
            vertices[index++] = alpha;

            // xy
            vertices[index++] = a * w + c * h + tx;
            vertices[index++] = d * h + b * w + ty;
            // uv
            vertices[index++] = sourceWidth + sourceX;
            vertices[index++] = sourceHeight + sourceY;
            // alpha
            vertices[index++] = alpha;

            // xy
            vertices[index++] = c * h + tx;
            vertices[index++] = d * h + ty;
            // uv
            vertices[index++] = sourceX;
            vertices[index++] = sourceHeight + sourceY;
            // alpha
            vertices[index++] = alpha;

            this.currentBatchSize++;
        }

        private _drawWebGL():void {
            if (this.currentBatchSize == 0 || this.contextLost) {
                return;
            }
            var beforeDraw:number = getTimer();
            this.start();
            var gl:any = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this.currentBaseTexture);
            var view = this.vertices.subarray(0, this.currentBatchSize * 4 * this.vertSize);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
            gl.drawElements(gl.TRIANGLES, this.currentBatchSize * 6, gl.UNSIGNED_SHORT, 0);
            this.currentBatchSize = 0;
            this.renderCost += getTimer() - beforeDraw;
            Profiler.getInstance().onDrawImage();
        }

        private worldTransform:Matrix = null;

        public setTransform(matrix:Matrix):void {
            var locWorldTransform:Matrix = this.worldTransform;
            locWorldTransform.a = matrix.a;
            locWorldTransform.b = matrix.b;
            locWorldTransform.c = matrix.c;
            locWorldTransform.d = matrix.d;
            locWorldTransform.tx = matrix.tx;
            locWorldTransform.ty = matrix.ty;
        }

        private worldAlpha:number = 1;

        public setAlpha(value:number, blendMode:string):void {
            this.worldAlpha = value;
            this.setBlendMode(blendMode);
        }

        public createWebGLTexture(texture:Texture):void {
            var bitmapData:any = texture._bitmapData;
            if (!bitmapData.webGLTexture) {
                bitmapData.webGLTexture = {};
            }
            if (!bitmapData.webGLTexture[this.glID]) {
                var gl:any = this.gl;
                bitmapData.webGLTexture[this.glID] = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, bitmapData.webGLTexture[this.glID]);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                gl.bindTexture(gl.TEXTURE_2D, null);
            }
        }

        private maskList:Array<any> = [];
        private maskDataFreeList:Array<any> = [];

        public pushMask(mask:Rectangle):void {
            this._drawWebGL();
            var gl:any = this.gl;
            if (this.maskList.length == 0) {
                gl.enable(gl.SCISSOR_TEST);
            }

            var maskData:egret.Rectangle = this.getScissorRect(mask);
            this.maskList.push(maskData);
            this.scissor(maskData.x, maskData.y, maskData.width, maskData.height);
        }

        private getScissorRect(mask:egret.Rectangle):any {
            var prevMask:egret.Rectangle = this.maskList[this.maskList.length - 1];
            var x:number;
            var y:number;
            var w:number;
            var h:number;
            if (prevMask) {
                if (prevMask.intersects(prevMask)) {
                    x = Math.max(mask.x + this.worldTransform.tx, prevMask.x);
                    y = Math.max(mask.y + this.worldTransform.ty, prevMask.y);
                    w = Math.min(mask.x + this.worldTransform.tx + mask.width, prevMask.x + prevMask.width) - x;
                    h = Math.min(mask.y + this.worldTransform.ty + mask.height, prevMask.y + prevMask.height) - y;
                }
                else {
                    x = 0;
                    y = 0;
                    w = 0;
                    h = 0;
                }
            }
            else {
                x = mask.x + this.worldTransform.tx;
                y = mask.y + this.worldTransform.ty;
                w = mask.width;
                h = mask.height;
            }
            var maskData:egret.Rectangle = this.maskDataFreeList.pop();
            if (!maskData) {
                maskData = new egret.Rectangle(x, y, w, h);
            }
            else {
                maskData.x = x;
                maskData.y = y;
                maskData.width = w;
                maskData.height = h;
            }
            return maskData;
        }

        public popMask():void {
            this._drawWebGL();
            var gl:any = this.gl;
            var maskData = this.maskList.pop();
            this.maskDataFreeList.push(maskData);
            var length = this.maskList.length;
            if (length != 0) {
                maskData = this.maskList[length - 1];
                if (maskData.width > 0 || maskData.height > 0) {
                    this.scissor(maskData.x, maskData.y, maskData.width, maskData.height);
                }
            }
            else {
                gl.disable(gl.SCISSOR_TEST);
            }
        }

        private scissor(x:number, y:number, w:number, h:number):void {
            var gl:any = this.gl;
            if (w < 0) {
                w = 0;
            }
            if (h < 0) {
                h = 0;
            }
            gl.scissor(x, -y + MainContext.instance.stage.stageHeight - h, w, h);
        }

        private colorTransformMatrix:Array<any> = null;

        public setGlobalColorTransform(colorTransformMatrix:Array<any>):void {
            if (this.colorTransformMatrix != colorTransformMatrix) {
                this._drawWebGL();
                this.colorTransformMatrix = colorTransformMatrix;
                if (colorTransformMatrix) {
                    var colorTransformMatrix = colorTransformMatrix.concat();
                    var shader:ColorTransformShader = this.shaderManager.colorTransformShader;
                    shader.uniforms.colorAdd.value.w = colorTransformMatrix.splice(19, 1)[0] / 255.0;
                    shader.uniforms.colorAdd.value.z = colorTransformMatrix.splice(14, 1)[0] / 255.0;
                    shader.uniforms.colorAdd.value.y = colorTransformMatrix.splice(9, 1)[0] / 255.0;
                    shader.uniforms.colorAdd.value.x = colorTransformMatrix.splice(4, 1)[0] / 255.0;
                    shader.uniforms.matrix.value = colorTransformMatrix;
                }
            }
        }

        public setGlobalFilter(filterData:Filter):void {
            this._drawWebGL();
            this.setFilterProperties(filterData);
        }

        private filterType:string = null;

        private setFilterProperties(filterData:Filter):void {
            if (filterData) {
                this.filterType = filterData.type;
                switch (filterData.type) {
                    case "blur":
                        var shader:BlurShader = this.shaderManager.blurShader;
                        shader.uniforms.blur.value.x = (<BlurFilter>filterData).blurX;
                        shader.uniforms.blur.value.y = (<BlurFilter>filterData).blurY;
                        break;
                }
            }
            else {
                this.filterType = null;
            }
        }

        private html5Canvas:HTMLCanvasElement;
        private canvasContext:HTML5CanvasRenderer;

        public setupFont(textField:TextField, style:egret.ITextStyle = null):void {
            this.canvasContext.setupFont(textField, style);
        }

        public measureText(text:string):number {
            return this.canvasContext.measureText(text);
        }

        private graphicsPoints:Array<any> = null;
        private graphicsIndices:Array<any> = null;
        private graphicsBuffer:any = null;
        private graphicsIndexBuffer:any = null;

        public renderGraphics(graphics) {
            this._drawWebGL();
            var gl:any = this.gl;
            var shader = this.shaderManager.primitiveShader;

            if (!this.graphicsPoints) {
                this.graphicsPoints = [];
                this.graphicsIndices = [];
                this.graphicsBuffer = gl.createBuffer();
                this.graphicsIndexBuffer = gl.createBuffer();
            }
            else {
                this.graphicsPoints.length = 0;
                this.graphicsIndices.length = 0;
            }

            this.updateGraphics(graphics);

            this.shaderManager.activateShader(shader);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.uniformMatrix3fv(shader.translationMatrix, false, this.worldTransform.toArray(true));

            gl.uniform2f(shader.projectionVector, this.projectionX, -this.projectionY);
            gl.uniform2f(shader.offsetVector, 0, 0);

            gl.uniform3fv(shader.tintColor, [1, 1, 1]);

            gl.uniform1f(shader.alpha, this.worldAlpha);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.graphicsBuffer);

            gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
            gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false, 4 * 6, 2 * 4);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.graphicsIndexBuffer);

            gl.drawElements(gl.TRIANGLE_STRIP, this.graphicsIndices.length, gl.UNSIGNED_SHORT, 0);

            this.shaderManager.activateShader(this.shaderManager.defaultShader);
        }

        private updateGraphics(graphics) {
            var gl:any = this.gl;

            this.buildRectangle(graphics);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.graphicsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.graphicsPoints), gl.STATIC_DRAW);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.graphicsIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.graphicsIndices), gl.STATIC_DRAW);
        }

        private buildRectangle(graphicsData) {
            var x:number = graphicsData.x;
            var y:number = graphicsData.y;
            var width:number = graphicsData.w;
            var height:number = graphicsData.h;

            var alpha:number = this.graphicsStyle.a;
            var r:number = this.graphicsStyle.r * alpha;
            var g:number = this.graphicsStyle.g * alpha;
            var b:number = this.graphicsStyle.b * alpha;

            var verts:Array<any> = this.graphicsPoints;
            var indices:Array<any> = this.graphicsIndices;
            var vertPos:number = verts.length / 6;

            verts.push(x, y);
            verts.push(r, g, b, alpha);

            verts.push(x + width, y);
            verts.push(r, g, b, alpha);

            verts.push(x, y + height);
            verts.push(r, g, b, alpha);

            verts.push(x + width, y + height);
            verts.push(r, g, b, alpha);

            indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
        }

        private graphicsStyle:any = {};

        public setGraphicsStyle(r:number, g:number, b:number, a:number):void {
            this.graphicsStyle.r = r;
            this.graphicsStyle.g = g;
            this.graphicsStyle.b = b;
            this.graphicsStyle.a = a;
        }
    }
}


module egret_webgl_graphics {

    export function beginFill(color:number, alpha:number = 1):void {
        var _colorBlue = (color & 0x0000FF) / 255;
        var _colorGreen = ((color & 0x00ff00) >> 8) / 255;
        var _colorRed = (color >> 16) / 255;

        this._pushCommand(new Command(this._setStyle, this, [_colorRed, _colorGreen, _colorBlue, alpha]))
    }

    export function drawRect(x:number, y:number, width:number, height:number):void {
        this._pushCommand(new Command(
                function (data) {
                    var rendererContext = <egret.WebGLRenderer>this.renderContext;
                    rendererContext.renderGraphics(data);
                },
                this,
                [{x: x, y: y, w: width, h: height}]
            )
        );
        this.checkRect(x, y, width, height);
    }

    export function drawCircle(x:number, y:number, r:number):void {

    }

    export function drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void {

    }

    export function drawEllipse(x:number, y:number, width:number, height:number):void {

    }

    export function lineStyle(thickness:number = NaN, color:number = 0, alpha:number = 1.0, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = null, joints:string = null, miterLimit:number = 3):void {

    }

    export function lineTo(x:number, y:number):void {
    }

    export function curveTo(controlX:Number, controlY:Number, anchorX:Number, anchorY:Number):void {
    }

    export function moveTo(x:number, y:number):void {

    }

    export function clear():void {
        this.commandQueue.length = 0;
        this._minX = 0;
        this._minY = 0;
        this._maxX = 0;
        this._maxY = 0;
    }

    export function endFill():void {

    }

    export function _pushCommand(cmd:any):void {
        this.commandQueue.push(cmd);
    }

    export function _draw(renderContext:egret.WebGLRenderer):void {
        var length = this.commandQueue.length;
        if (length == 0) {
            return;
        }
        this.renderContext = renderContext;
        for (var i = 0; i < length; i++) {
            var command:Command = this.commandQueue[i];
            command.method.apply(command.thisObject, command.args);
        }
    }

    class Command {

        constructor(public method:Function, public thisObject:any, public args:Array<any>) {

        }
    }

    export function _setStyle(r:number, g:number, b:number, a:number):void {
        this.renderContext.setGraphicsStyle(r, g, b, a);
    }

    export function init():void {
        for (var key in egret_webgl_graphics) {
            egret.Graphics.prototype[key] = egret_webgl_graphics[key];
        }
    }

}