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
     * @extends egret.RendererContext
     */
    export class WebGLRenderer extends RendererContext {
        public static blendModesWebGL = {};
        private canvas:HTMLCanvasElement;
        private gl:any;
        private size:number = 2000;
        private vertices:Float32Array;
        private vertSize:number = 6;
        private indices:Uint16Array;
        private projectionX:number;
        private projectionY:number;
        private shaderManager:WebGLShaderManager;

        constructor(canvas?:HTMLCanvasElement) {
            super();
            console.log("使用WebGL模式");
            this.canvas = canvas || this.createCanvas();
            this.canvas.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
            this.canvas.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);

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

            this.initBlendMode();

            MainContext.instance.addEventListener(Event.FINISH_RENDER, this._draw, this);

            egret.TextField.prototype._draw = function (renderContext) {
                var textField:egret.TextField = <egret.TextField>this;
                if (textField.getDirty()) {
                    textField.cacheAsBitmap = true;
                }
                egret.DisplayObject.prototype._draw.call(textField, renderContext);
            };
        }

        private createCanvas():HTMLCanvasElement {
            var canvas:HTMLCanvasElement = egret.Browser.getInstance().$("#egretCanvas");
            if (!canvas) {
                var container = document.getElementById(egret.StageDelegate.canvas_div_name);
                canvas = egret.Browser.getInstance().$new("canvas");
                canvas.id = "egretCanvas";
                canvas.width = egret.MainContext.instance.stage.stageWidth; //stageW
                canvas.height = egret.MainContext.instance.stage.stageHeight; //stageH
                canvas.style.width = container.style.width;
                canvas.style.height = container.style.height;
                container.appendChild(canvas);
            }
            return canvas;
        }

        private contextLost:Boolean = false;

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
                stencil: true//设置可以使用模板（用于遮罩实现）
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
                throw new Error("当前浏览器不支持webgl");
            }
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

        private initBlendMode():void {
            WebGLRenderer.blendModesWebGL[BlendMode.NORMAL] = [this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA];
            WebGLRenderer.blendModesWebGL[BlendMode.ADD] = [this.gl.SRC_ALPHA, this.gl.DST_ALPHA];
        }

        private start():void {
            if (this.contextLost) {
                return;
            }
            var gl:any = this.gl;

            gl.activeTexture(gl.TEXTURE0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            var shader = this.shaderManager.defaultShader;
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
            for (var i:number = 0 , l:number = list.length; i < l; i++) {
                var area = list[i];
                gl.viewport(area.x, area.y, area.width, area.height);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
            this.renderCost = 0;
        }

        private currentBlendMode:string = "";

        private setBlendMode(blendMode:string) {
            if (!blendMode) {
                blendMode = egret.BlendMode.NORMAL;
            }
            if (this.currentBlendMode != blendMode) {
                var blendModeWebGL = WebGLRenderer.blendModesWebGL[blendMode];
                if (blendModeWebGL) {
                    this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                    this.currentBlendMode = blendMode;
                }
            }
        }

        private currentBaseTexture:Texture = null;
        private currentBatchSize:number = 0;

        public drawImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
            if (this.contextLost) {
                return;
            }

            var texture_scale_factor:number = MainContext.instance.rendererContext.texture_scale_factor;
            sourceX = sourceX / texture_scale_factor;
            sourceY = sourceY / texture_scale_factor;
            sourceWidth = sourceWidth / texture_scale_factor;
            sourceHeight = sourceHeight / texture_scale_factor;

            this.createWebGLTexture(texture);

            if (texture.webGLTexture !== this.currentBaseTexture || this.currentBatchSize >= this.size) {
                this._draw();
                this.currentBaseTexture = texture.webGLTexture;
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
            var tint:number = 0xFFFFFF;

            // xy
            vertices[index++] = tx;
            vertices[index++] = ty;
            // uv
            vertices[index++] = sourceX;
            vertices[index++] = sourceY;
            // color
            vertices[index++] = alpha;
            vertices[index++] = tint;

            // xy
            vertices[index++] = a * w + tx;
            vertices[index++] = b * w + ty;
            // uv
            vertices[index++] = sourceWidth + sourceX;
            vertices[index++] = sourceY;
            // color
            vertices[index++] = alpha;
            vertices[index++] = tint;

            // xy
            vertices[index++] = a * w + c * h + tx;
            vertices[index++] = d * h + b * w + ty;
            // uv
            vertices[index++] = sourceWidth + sourceX;
            vertices[index++] = sourceHeight + sourceY;
            // color
            vertices[index++] = alpha;
            vertices[index++] = tint;

            // xy
            vertices[index++] = c * h + tx;
            vertices[index++] = d * h + ty;
            // uv
            vertices[index++] = sourceX;
            vertices[index++] = sourceHeight + sourceY;
            // color
            vertices[index++] = alpha;
            vertices[index++] = tint;

            this.currentBatchSize++;
        }

        private _draw():void {
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

        private worldTransform:Matrix;

        public setTransform(matrix:Matrix):void {
            var locWorldTransform:Matrix = this.worldTransform;
            locWorldTransform.a = matrix.a;
            locWorldTransform.b = matrix.b;
            locWorldTransform.c = matrix.c;
            locWorldTransform.d = matrix.d;
            locWorldTransform.tx = matrix.tx;
            locWorldTransform.ty = matrix.ty;
        }

        private worldAlpha:number;

        public setAlpha(value:number, blendMode:string):void {
            this.worldAlpha = value;
            this.setBlendMode(blendMode);
        }

        public createWebGLTexture(texture:Texture):void {
            if (!texture.webGLTexture) {
                var gl:any = this.gl;
                texture.webGLTexture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture.webGLTexture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture._bitmapData);
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
            this._draw();
            var gl:any = this.gl;
            if (this.maskList.length == 0) {
                gl.enable(gl.STENCIL_TEST);
                gl.stencilFunc(gl.ALWAYS, 1, 1);
            }

            var maskData:any = this.maskDataFreeList.pop();
            if (!maskData) {
                maskData = {x: mask.x, y: mask.y, w: mask.width, h: mask.height};
            }
            else {
                maskData.x = mask.x;
                maskData.y = mask.y;
                maskData.w = mask.width;
                maskData.h = mask.height;
            }
            this.maskList.push(maskData);

            gl.colorMask(false, false, false, false);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

            this.renderGraphics(maskData);

            gl.colorMask(true, true, true, true);
            gl.stencilFunc(gl.NOTEQUAL, 0, this.maskList.length);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        }

        public popMask():void {
            this._draw();
            var gl:any = this.gl;
            var maskData = this.maskList.pop();
            if (maskData) {
                gl.colorMask(false, false, false, false);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                this.renderGraphics(maskData);
                gl.colorMask(true, true, true, true);
                gl.stencilFunc(gl.NOTEQUAL, 0, this.maskList.length);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                this.maskDataFreeList.push(maskData);
            }
            if (this.maskList.length == 0) {
                gl.disable(gl.STENCIL_TEST);
            }
        }

        private canvasContext = document.createElement("canvas").getContext("2d");

        public setupFont(textField:TextField):void {
            var ctx = this.canvasContext;
            var font:string = textField.italic ? "italic " : "normal ";
            font += textField.bold ? "bold " : "normal ";
            font += textField.size + "px " + textField.fontFamily;
            ctx.font = font;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
        }

        public measureText(text:string):number {
            var result = this.canvasContext.measureText(text);
            return result.width;
        }

        private graphicsPoints:Array<any>;
        private graphicsIndices:Array<any>;
        private graphicsBuffer:any;
        private graphicsIndexBuffer:any;

        private renderGraphics(graphics) {
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

            var r:number = 0;
            var g:number = 0;
            var b:number = 0;
            var alpha:number = 1;

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
    }
}