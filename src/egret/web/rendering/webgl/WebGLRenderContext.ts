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

    /**
     * draw类型，所有的绘图操作都会缓存在drawData中，每个drawData都是一个drawable对象
     * $renderWebGL方法依据drawable对象的类型，调用不同的绘制方法
     * TODO 提供drawable类型接口并且创建对象池？
     */
     const enum DRAWABLE_TYPE {
         TEXTURE,
         RECT,
         PUSH_MASK,
         POP_MASK,
         BLEND
     }

    /**
     * 创建一个canvas。
     */
    function createCanvas(width?:number, height?:number):HTMLCanvasElement {
        var canvas:HTMLCanvasElement = document.createElement("canvas");
        if (!isNaN(width) && !isNaN(height)) {
            canvas.width = width;
            canvas.height = height;
        }
        $toBitmapData(canvas);
        return canvas;
    }

    /**
     * @private
     * WebGL上下文对象，提供简单的绘图接口
     * 抽象出此类，以实现共用一个context
     */
    export class WebGLRenderContext {

        /**
         * 渲染上下文
         */
        public context:WebGLRenderingContext;
        /**
         * 呈现最终绘图结果的画布
         */
        public surface:HTMLCanvasElement;

        // 单例
        private static instance:WebGLRenderContext;
        public static getInstance(width:number, height:number):WebGLRenderContext {
            if(this.instance) {
                this.instance.resize(width, height);
                return this.instance;
            }
            this.instance = new WebGLRenderContext(width, height);
            return this.instance;
        }


        public constructor(width?:number, height?:number) {
            //todo 抽取出一个WebglRenderContext
            this.surface = createCanvas(width, height);

            this.initWebGL();
        }

        /**
         * 销毁绘制对象
         */
        public destroy():void {
            this.surface.width = this.surface.height = 0;
        }

        private onResize():void {
            this.projectionX = this.surface.width / 2;
            this.projectionY = -this.surface.height / 2;
            if (this.context) {
                this.context.viewport(0, 0, this.surface.width, this.surface.height);
            }
        }

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        public resize(width:number, height:number, useMaxSize?:boolean):void {
            var surface = this.surface;
            if (useMaxSize) {
                if (surface.width < width) {
                    surface.width = width;
                }
                if (surface.height < height) {
                    surface.height = height;
                }
            }
            else {
                if (surface.width != width) {
                    surface.width = width;
                }
                if (surface.height != height) {
                    surface.height = height;
                }
            }

            this.onResize();
            this.clear();
        }

        /**
         * 改变渲染缓冲为指定大小，但保留原始图像数据
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
         * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
         */
        public resizeTo(width:number, height:number, offsetX:number, offsetY:number):void {
            this.surface.width = width;
            this.surface.height = height;
        }

        private static glContextId:number = 0;
        private glID:number = null;
        private size:number = 2000;
        private vertices:Float32Array = null;
        private vertSize:number = 5;
        private indices:Uint16Array = null;
        private projectionX:number = NaN;
        private projectionY:number = NaN;
        private shaderManager:WebGLShaderManager = null;
        private contextLost:boolean = false;

        private initWebGL():void {
            this.onResize();

            this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
            this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);

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
            this.getWebGLContext();

            this.shaderManager = new WebGLShaderManager(this.context);
        }

        private handleContextLost() {
            this.contextLost = true;
        }

        private handleContextRestored() {
            this.initWebGL();
            //this.shaderManager.setContext(this.context);
            this.contextLost = false;
        }

        private getWebGLContext() {
            var options = {
                stencil: true//设置可以使用模板（用于不规则遮罩）
            };
            var gl:any;
            //todo 是否使用chrome源码names
            //var contextNames = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl", "3d"];
            var names = ["webgl", "experimental-webgl"];
            for (var i = 0; i < names.length; i++) {
                try {
                    gl = this.surface.getContext(names[i], options);
                } catch (e) {
                }
                if (gl) {
                    break;
                }
            }
            if (!gl) {
                $error(1021);
            }
            this.setContext(gl);
            this.setGlobalCompositeOperation("source-over");
        }

        private setContext(gl:any) {
            this.context = gl;
            gl.id = WebGLRenderContext.glContextId++;
            this.glID = gl.id;
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

        /**
         * 清空缓冲区数据
         */
        public clear():void {
            if(this.surface.width != 0 && this.surface.height != 0) {
                var gl:any = this.context;
                gl.colorMask(true, true, true, true);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
        }

        /**
         * @private
         */
        public clearRect(x:number, y:number, width:number, height:number):void {
            this.setGlobalCompositeOperation("destination-out");
            this.drawRect(x, y, width, height);
            this.setGlobalCompositeOperation("source-over");
        }

        //Rendering Functions begin
        public drawImage(texture:BitmapData,
                         sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                         destX:number, destY:number, destWidth:number, destHeight:number,
                         textureSourceWidth:number, textureSourceHeight:number):void {
            if (this.contextLost) {
                return;
            }
            if (!texture) {
                return;
            }
            //if (this.filters) {
            //    for (var i = 0; i < 1; i++) {
            //        var filter:Filter = this.filters[0];
            //        if (filter.type == "glow") {
            //            this.useGlow(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            //            return;
            //        }
            //    }
            //}
            this.createWebGLTexture(texture);
            var webGLTexture = texture["webGLTexture"][this.glID];
            if (!webGLTexture) {
                return;
            }
            this.drawTexture(webGLTexture,
                sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight,
                textureSourceWidth, textureSourceHeight);
        }

        private currentBaseTexture:Texture = null;
        private currentBatchSize:number = 0;

        /**
         * @private
         * draw a texture use default shader
         * */
        public drawTexture(texture:WebGLTexture,
                            sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                            destX:number, destY:number, destWidth:number, destHeight:number, textureWidth:number, textureHeight:number):void {
            if (this.contextLost) {
                return;
            }
            if (!texture) {
                return;
            }
            var webGLTexture = <Texture>texture;
            if (this.currentBatchSize >= this.size - 1) {
                this.$drawWebGL();
                this.currentBaseTexture = webGLTexture;
                this.drawData.push({type: DRAWABLE_TYPE.TEXTURE, texture: this.currentBaseTexture, count: 0});
            }
            else if (webGLTexture !== this.currentBaseTexture) {
                this.currentBaseTexture = webGLTexture;
                this.drawData.push({type: DRAWABLE_TYPE.TEXTURE, texture: this.currentBaseTexture, count: 0});
            }

            this.drawUvRect(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight);

            this.currentBatchSize++;
            this.drawData[this.drawData.length - 1].count++;
        }

        /**
         * @private
         * draw a rect use default shader
         * */
        private drawRect(x:number, y:number, width:number, height:number):void {
            if (this.contextLost) {
                return;
            }

            // TODO if needed, this rect can set a color
            if (this.currentBatchSize >= this.size - 1) {
                this.$drawWebGL();
                this.drawData.push({type: DRAWABLE_TYPE.RECT, rect: 1, count: 0});
            } else if(this.drawData.length > 1 && this.drawData[this.drawData.length - 2].rect) {
                // merge to one draw
            } else {
                this.drawData.push({type: DRAWABLE_TYPE.RECT, rect: 1, count: 0});
            }

            this.drawUvRect(0, 0, width, height, x, y, width, height, width, height);

            this.currentBatchSize++;
            this.drawData[this.drawData.length - 1].count++;
            this.currentBaseTexture = null;
        }

        /**
         * @private
         * draw a rect with uv attribute, just push vertices datas to array
         * */
        private drawUvRect(sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                                destX:number, destY:number, destWidth:number, destHeight:number, textureWidth:number, textureHeight:number) {

            var textureSourceWidth = textureWidth;
            var textureSourceHeight = textureHeight;

            //计算出绘制矩阵，之后把矩阵还原回之前的
            var locWorldTransform = this.globalMatrix;
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

            var width:number = textureSourceWidth;
            var height:number = textureSourceHeight;

            var w:number = sourceWidth;
            var h:number = sourceHeight;

            sourceX = sourceX / width;
            sourceY = sourceY / height;
            sourceWidth = sourceWidth / width;
            sourceHeight = sourceHeight / height;

            var vertices:Float32Array = this.vertices;
            var index:number = this.currentBatchSize * 4 * this.vertSize;
            var alpha:number = this._globalAlpha;

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
        }

        private drawData = [];
        public $drawCalls:number = 0;
        public $computeDrawCall:boolean = false;

        public $drawWebGL():void {
            if ((this.currentBatchSize == 0 && this.drawData.length == 0) || this.contextLost) {
                return;
            }

            this.start();

            // update the vertices data
            var gl:any = this.context;
            var view = this.vertices.subarray(0, this.currentBatchSize * 4 * this.vertSize);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);

            var length = this.drawData.length;
            var offset = 0;
            for (var i = 0; i < length; i++) {
                var data = this.drawData[i];
                switch(data.type) {
                    case DRAWABLE_TYPE.TEXTURE:
                        offset += this.drawTextureElements(data, offset);
                        break;
                    case DRAWABLE_TYPE.RECT:
                        offset += this.drawRectElements(data, offset);
                        break;
                    case DRAWABLE_TYPE.PUSH_MASK:
                        offset += this.drawPushMaskElements(data, offset);
                        break;
                    case DRAWABLE_TYPE.POP_MASK:
                        offset += this.drawPopMaskElements(data, offset);
                        break;
                    case DRAWABLE_TYPE.BLEND:
                        var blendModeWebGL = WebGLRenderContext.blendModesForGL[data.value];
                        if (blendModeWebGL) {
                            this.context.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                        }
                        break;
                    default:
                        break;
                }

                // add drawCall except blend type
                if(data.type != DRAWABLE_TYPE.BLEND) {
                    if (this.$computeDrawCall) {
                        this.$drawCalls++;
                    }
                }
            }

            // flush draw data
            this.drawData.length = 0;
            this.currentBatchSize = 0;
            this.currentBaseTexture = null;
        }

        private vertexBuffer;
        private indexBuffer;
        private filterType;

        private start():void {
            if (this.contextLost) {
                return;
            }
            var gl:any = this.context;
            gl.activeTexture(gl.TEXTURE0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            var shader;
            if (this.filterType == "colorTransform") {
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

            // set the default shader to draw texture model
            this.switchDrawingTextureState(true);

            var stride = this.vertSize * 4;
            gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
            gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
            gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, stride, 4 * 4);
        }

        public createWebGLTexture(texture:BitmapData):void {
            var bitmapData:any = texture;
            if (!bitmapData.webGLTexture) {
                bitmapData.webGLTexture = {};
            }
            if (!bitmapData.webGLTexture[this.glID]) {
                var glTexture = this.createTexture(bitmapData);
                bitmapData.webGLTexture[this.glID] = glTexture;
            }
        }

        // 创建一个材质，并返回，只供外部引用，内部无引用
        public createTexture(bitmapData:BitmapData):WebGLTexture {
            var gl:any = this.context;
            var glTexture = gl.createTexture();
            if (!glTexture) {
                //先创建texture失败,然后lost事件才发出来..
                this.contextLost = true;
                return;
            }
            glTexture.glContext = gl;
            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.bindTexture(gl.TEXTURE_2D, null);

            return glTexture;
        }

        private globalMatrix:Matrix = new Matrix();
        private savedGlobalMatrix:Matrix = new Matrix();

        public setTransform(a:number, b:number, c:number, d:number, tx:number, ty:number):void {
            this.globalMatrix.setTo(a, b, c, d, tx, ty);
        }

        public transform(a:number, b:number, c:number, d:number, tx:number, ty:number):void {
            this.globalMatrix.append(a, b, c, d, tx, ty);
        }

        public translate(dx:number, dy:number):void {
            this.globalMatrix.translate(dx, dy);
        }

        public saveTransform():void {
            this.savedGlobalMatrix.copyFrom(this.globalMatrix);
        }

        public restoreTransform():void {
            this.globalMatrix.copyFrom(this.savedGlobalMatrix);
        }

        private _globalAlpha:number = 1;

        public setGlobalAlpha(value:number) {
            this._globalAlpha = value;
        }

        private currentBlendMode:string;

        public setGlobalCompositeOperation(value:string) {
            if (this.currentBlendMode != value) {
                this.drawData.push({type:DRAWABLE_TYPE.BLEND, value: value});
                this.currentBlendMode = value;
                this.currentBaseTexture = null;
            }
        }

        public $stencilList = [];
        public stencilHandleCount:number = 0;

        public pushMask(mask):void {
            // TODO mask count
            this.$stencilList.push(mask);

            if (this.currentBatchSize >= this.size - 1) {
                this.$drawWebGL();
                this.drawData.push({type: DRAWABLE_TYPE.PUSH_MASK, pushMask: mask, count: 0});
            } else {
                this.drawData.push({type: DRAWABLE_TYPE.PUSH_MASK, pushMask: mask, count: 0});
            }

            this.drawMask(mask);
            this.currentBaseTexture = null;
        }

        public popMask():void {
            // TODO mask count
            var mask = this.$stencilList.pop();

            if (this.currentBatchSize >= this.size - 1) {
                this.$drawWebGL();
                this.drawData.push({type: DRAWABLE_TYPE.POP_MASK, popMask: mask, count: 0});
            } else {
                this.drawData.push({type: DRAWABLE_TYPE.POP_MASK, popMask: mask, count: 0});
            }

            this.drawMask(mask);
            this.currentBaseTexture = null;
        }

        /**
         * @private
         * draw masks with default shader
         **/
        private drawMask(mask) {
            if (this.contextLost) {
                return;
            }

            var length = mask.length;
            if (length) {
                for (var i = 0; i < length; i++) {
                    var item:sys.Region = mask[i];
                    this.drawUvRect(0, 0, item.width, item.height, item.minX, item.minY, item.width, item.height, item.width, item.height);
                    this.currentBatchSize++;
                    this.drawData[this.drawData.length - 1].count++;
                }
            }
            else {
                this.drawUvRect(0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
                this.currentBatchSize++;
                this.drawData[this.drawData.length - 1].count++;
            }
        }

        /**
         * @private
         * TODO 这个方法可以移到shader中？
         * switch default shader render type
         * if true, shader is ready to render texture
         * if false, shader is used to render rect
         **/
        private drawingTexture:boolean;
        private switchDrawingTextureState(state:boolean):void {
            if(state == this.drawingTexture) {
                return;
            }
            var gl = this.context;
            var shader = this.shaderManager.defaultShader;
            if(state) {
                gl.uniform1f(shader.uPureColor, 0.0);
            } else {
                gl.uniform1f(shader.uPureColor, 1.0);
            }
            this.drawingTexture = state;
        }
        /**
         * @private
         * draw texture elements
         **/
        private drawTextureElements(data:any, offset:number):number {
            this.switchDrawingTextureState(true);

            var gl = this.context;
            gl.bindTexture(gl.TEXTURE_2D, data.texture);
            var size = data.count * 6;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }

        /**
         * @private
         * draw rect elements
         **/
        private drawRectElements(data:any, offset:number):number {
            this.switchDrawingTextureState(false);

            var gl = this.context;
            gl.bindTexture(gl.TEXTURE_2D, null);
            var size = data.count * 6;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }

        /**
         * @private
         * draw push mask elements
         **/
        private drawPushMaskElements(data:any, offset:number):number {
            this.switchDrawingTextureState(false);

            var gl = this.context;
            if(this.stencilHandleCount == 0) {
                gl.enable(gl.STENCIL_TEST);
                gl.clear(gl.STENCIL_BUFFER_BIT);
            }
            var level = this.stencilHandleCount;
            this.stencilHandleCount++;
            gl.colorMask(false, false, false, false);
            gl.stencilFunc(gl.EQUAL, level, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

            gl.bindTexture(gl.TEXTURE_2D, null);
            var size = data.count * 6;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);

            gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
            gl.colorMask(true, true, true, true);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

            return size;
        }

        /**
         * @private
         * draw pop mask elements
         **/
        private drawPopMaskElements(data:any, offset:number) {
            this.switchDrawingTextureState(false);

            var gl = this.context;
            this.stencilHandleCount--;
            if(this.stencilHandleCount == 0) {
                gl.disable(gl.STENCIL_TEST);
                // skip this draw
                var size = data.count * 6;
                return size;
            } else {
                var level = this.stencilHandleCount;
                gl.colorMask(false, false, false, false);
                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

                gl.bindTexture(gl.TEXTURE_2D, null);
                var size = data.count * 6;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);

                gl.stencilFunc(gl.EQUAL, level, 0xFF);
                gl.colorMask(true, true, true, true);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

                return size;
            }
        }

        // private graphicsPoints:Array<number> = null;
        // private graphicsIndices:Array<number> = null;
        // private graphicsBuffer:WebGLBuffer = null;
        // private graphicsIndexBuffer:WebGLBuffer = null;
        //
        // public renderGraphics(graphics) {
        //     this.$drawWebGL();
        //     var gl:any = this.context;
        //     var shader = this.shaderManager.primitiveShader;
        //
        //     if (!this.graphicsPoints) {
        //         this.graphicsPoints = [];
        //         this.graphicsIndices = [];
        //         this.graphicsBuffer = gl.createBuffer();
        //         this.graphicsIndexBuffer = gl.createBuffer();
        //     }
        //     else {
        //         this.graphicsPoints.length = 0;
        //         this.graphicsIndices.length = 0;
        //     }
        //
        //     this.updateGraphics(graphics);
        //
        //     this.shaderManager.activateShader(shader);
        //     //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        //     gl.uniformMatrix3fv(shader.translationMatrix, false, this.matrixToArray(this.globalMatrix));
        //
        //     gl.uniform2f(shader.projectionVector, this.projectionX, -this.projectionY);
        //     gl.uniform2f(shader.offsetVector, 0, 0);
        //
        //     gl.uniform3fv(shader.tintColor, [1, 1, 1]);
        //
        //     gl.uniform1f(shader.alpha, this._globalAlpha);
        //     gl.bindBuffer(gl.ARRAY_BUFFER, this.graphicsBuffer);
        //
        //     gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
        //     gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false, 4 * 6, 2 * 4);
        //
        //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.graphicsIndexBuffer);
        //
        //     gl.drawElements(gl.TRIANGLE_STRIP, this.graphicsIndices.length, gl.UNSIGNED_SHORT, 0);
        //
        //     this.shaderManager.activateShader(this.shaderManager.defaultShader);
        //
        //     this.currentBlendMode = null;
        //     //this.setGlobalCompositeOperation("source-over");
        // }
        //
        // private matrixArray:Float32Array;
        //
        // private matrixToArray(matrix:Matrix) {
        //     if (!this.matrixArray) {
        //         this.matrixArray = new Float32Array(9);
        //     }
        //     this.matrixArray[0] = matrix.a;
        //     this.matrixArray[1] = matrix.b;
        //     this.matrixArray[2] = 0;
        //     this.matrixArray[3] = matrix.c;
        //     this.matrixArray[4] = matrix.d;
        //     this.matrixArray[5] = 0;
        //     this.matrixArray[6] = matrix.tx;
        //     this.matrixArray[7] = matrix.ty;
        //     this.matrixArray[8] = 1;
        //     return this.matrixArray;
        // }
        //
        // private updateGraphics(graphics) {
        //     var gl:any = this.context;
        //
        //     this.buildRectangle(graphics);
        //
        //     gl.bindBuffer(gl.ARRAY_BUFFER, this.graphicsBuffer);
        //     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.graphicsPoints), gl.STATIC_DRAW);
        //
        //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.graphicsIndexBuffer);
        //     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.graphicsIndices), gl.STATIC_DRAW);
        // }
        //
        // private graphicsStyle:any = {a: 1, r: 255, g: 0, b: 0};
        //
        // private buildRectangle(graphicsData:Rectangle) {
        //     var x:number = graphicsData.x;
        //     var y:number = graphicsData.y;
        //     var width:number = graphicsData.width;
        //     var height:number = graphicsData.height;
        //
        //     var alpha:number = this.graphicsStyle.a;
        //     var r:number = this.graphicsStyle.r * alpha;
        //     var g:number = this.graphicsStyle.g * alpha;
        //     var b:number = this.graphicsStyle.b * alpha;
        //
        //     var verts:Array<any> = this.graphicsPoints;
        //     var indices:Array<any> = this.graphicsIndices;
        //     var vertPos:number = verts.length / 6;
        //
        //     verts.push(x, y);
        //     verts.push(r, g, b, alpha);
        //
        //     verts.push(x + width, y);
        //     verts.push(r, g, b, alpha);
        //
        //     verts.push(x, y + height);
        //     verts.push(r, g, b, alpha);
        //
        //     verts.push(x + width, y + height);
        //     verts.push(r, g, b, alpha);
        //
        //     indices.push(vertPos, vertPos, vertPos + 1, vertPos + 2, vertPos + 3, vertPos + 3);
        // }

        public static blendModesForGL:any = null;

        public static initBlendMode():void {
            WebGLRenderContext.blendModesForGL = {};
            WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
            WebGLRenderContext.blendModesForGL["lighter"] = [770, 1];
            WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
            WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
        }

    }

    WebGLRenderContext.initBlendMode();

}
