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

namespace egret.web {
    /**
     * virtual vao object, mainly managing vertexbuffer and indexbuffer
     */
    export class WebGLVertexArrayObject {
        /**
         * WebGLRenderContext
         */
        private readonly _webGLRenderContext: WebGLRenderContext;
        /**
         * define vertex format: (x: 8 * 4 = 32) + (y: 8 * 4 = 32) + (u: 8 * 4 = 32) + (v: 8 * 4 = 32) + (tintcolor: 8 * 4 = 32) = (8 * 4 = 32) * (x + y + u + v + tintcolor: 5);
         */
        private readonly _vertSize: number = 5;
        /**
         * vertex byte size = float(4) * components
         */
        private readonly _vertByteSize: number = this._vertSize * 4;
        /**
        * submit a maximum of single quad quads Count so many quads
        */
        private readonly _maxQuadsCount: number = 2048;
        /**
         * quad = 4 * vertex
         */
        private readonly _maxVertexCount: number = this._maxQuadsCount * 4;
        /**
         * index = _maxVertexCount * 6
         */
        private readonly _maxIndicesCount: number = this._maxQuadsCount * 6;
        /**
         * vertex buffer data
         */
        private readonly _vertices: ArrayBuffer;
        private readonly _verticesFloat32View: Float32Array;
        private readonly _verticesUint32View: Uint32Array;
        /**
         * index buffer data，3 ways to visit
         */
        private readonly _indices: ArrayBuffer;
        private readonly _indicesUint16View: Uint16Array;
        /**
         * status of buffer data processing
         */
        private _vertexIndex: number = 0;
        private _indexIndex: number = 0;
        /**
         * debugging name
         */
        private readonly _name: string = '';
        /**
         * dirty mark of index buffer
         */
        private _indexBufferId: number = 0;
        private _currentIndexBufferId: number = 0;
        /**
         * gl.STATIC_DRAW or gl.DYNAMIC_DRAW
         */
        private readonly _indexBufferUsage: number = 0;
        /**
         * webgl vertex buffer
         */
        private _webglVertexBuffer: WebGLBuffer;
        /**
        * webgl index buffer
        */
        private _webglIndexBuffer: WebGLBuffer;
        /**
         * best matching buffer data
         */
        private _sizeMatchVertexBufferCache: { [index: number]: Float32Array } = {};
        private _sizeMatchIndexBufferCache: { [index: number]: Uint16Array } = {};
        /**
         * last upload length record, optimize
         */
        private lastUploadVertexBufferLength: number = 0;
        private lastUploadIndexBufferLength: number = 0;
        /**
         * @constructor
         * @param webGLRenderContext _webGLRenderContext
         * @param maxQuadsCount _maxQuadsCount
         * @param indexBufferUsage _indexBufferUsage
         * @param name _name
         */
        constructor(webGLRenderContext: WebGLRenderContext, maxQuadsCount: number, indexBufferUsage: number, name: string) {
            this._name = name;
            this._webGLRenderContext = webGLRenderContext;
            this._maxQuadsCount = maxQuadsCount;
            this._maxVertexCount = maxQuadsCount * 4;
            this._maxIndicesCount = maxQuadsCount * 6;
            this._indexBufferUsage = indexBufferUsage;
            this._vertices = new ArrayBuffer(this._maxVertexCount * this._vertByteSize);
            this._verticesFloat32View = new Float32Array(this._vertices);
            this._verticesUint32View = new Uint32Array(this._vertices);
            const maxIndicesCount = this._maxIndicesCount;
            this._indices = new ArrayBuffer(maxIndicesCount * 2);
            this._indicesUint16View = new Uint16Array(this._indices);
            //only static indexbuffers need to be initialized in the order of quad.
            if (this._indexBufferUsage === this._webGLRenderContext.context.STATIC_DRAW) {
                const _indexArrayBuffer = this._indicesUint16View;
                /*
                0-------1
                |       |
                |       |
                3-------2  
                0->1->2
                0->2->3 
                */
                for (let i = 0, j = 0; i < maxIndicesCount; i += 6, j += 4) {
                    _indexArrayBuffer[i + 0] = j + 0;
                    _indexArrayBuffer[i + 1] = j + 1;
                    _indexArrayBuffer[i + 2] = j + 2;
                    _indexArrayBuffer[i + 3] = j + 0;
                    _indexArrayBuffer[i + 4] = j + 2;
                    _indexArrayBuffer[i + 5] = j + 3;
                }
                ++this._indexBufferId;
            }
        }
        /**
         * whether it reaches the overflow, can't be batched again
         * @public
         * @param vertexCount 
         * @param indexCount 
         */
        public reachMaxSize(vertexCount: number = 4, indexCount: number = 6): boolean {
            return this._vertexIndex > this._maxVertexCount - vertexCount || this._indexIndex > this._maxIndicesCount - indexCount;
        }
        /**
         * clear cache
         * @public
         */
        public clearSizeMatchBuffersCache(): void {
            this._sizeMatchVertexBufferCache = {};
            this._sizeMatchIndexBufferCache = {};
        }
        /**
         * get the best match vertex buffer
         * @public
         */
        private getVertexArrayBuffer(): Float32Array {
            const length = this._vertexIndex * this._vertSize;
            let nextPow2Length = NumberUtils.nextPow2(length);
            nextPow2Length = Math.min(this._verticesFloat32View.length, nextPow2Length);
            let bufferView = this._sizeMatchVertexBufferCache[nextPow2Length];
            if (!bufferView) {
                bufferView = this._sizeMatchVertexBufferCache[nextPow2Length] = new Float32Array(this._vertices, 0, nextPow2Length);
            }
            return bufferView;
        }
        /**
         * get the best match index buffer
         * @public
         */
        private getIndexArrayBuffer(): Uint16Array {
            const gl = this._webGLRenderContext.context;
            if (this._indexBufferUsage === gl.STATIC_DRAW) {
                return this._indicesUint16View;
            }
            const length = this._indexIndex;
            let nextPow2Length = NumberUtils.nextPow2(length);
            nextPow2Length = Math.min(this._indicesUint16View.length, nextPow2Length);
            let bufferView = this._sizeMatchIndexBufferCache[nextPow2Length];
            if (!bufferView) {
                bufferView = this._sizeMatchIndexBufferCache[nextPow2Length] = new Uint16Array(this._indices, 0, nextPow2Length);
            }
            return bufferView;
        }
        /**
         * pack geometry
         * @public
         */
        public cacheArrays(buffer: WebGLRenderBuffer, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
            destX: number, destY: number, destWidth: number, destHeight: number, textureSourceWidth: number, textureSourceHeight: number,
            meshUVs?: number[], meshVertices?: number[], meshIndices?: number[], rotated?: boolean): void {
            let alpha = buffer.globalAlpha;
            //tintcolor => alpha
            alpha = Math.min(alpha, 1.0);
            const globalTintColor = buffer.globalTintColor || 0xFFFFFF;
            const currentTexture = buffer.currentTexture;
            alpha = ((alpha < 1.0 && currentTexture && currentTexture[UNPACK_PREMULTIPLY_ALPHA_WEBGL]) ?
                WebGLUtils.premultiplyTint(globalTintColor, alpha)
                : globalTintColor + (alpha * 255 << 24));

            //
            let locWorldTransform = buffer.globalMatrix;

            let a = locWorldTransform.a;
            let b = locWorldTransform.b;
            let c = locWorldTransform.c;
            let d = locWorldTransform.d;
            let tx = locWorldTransform.tx;
            let ty = locWorldTransform.ty;

            let offsetX = buffer.$offsetX;
            let offsetY = buffer.$offsetY;
            if (offsetX != 0 || offsetY != 0) {
                tx = offsetX * a + offsetY * c + tx;
                ty = offsetX * b + offsetY * d + ty;
            }

            if (!meshVertices) {
                if (destX != 0 || destY != 0) {
                    tx = destX * a + destY * c + tx;
                    ty = destX * b + destY * d + ty;
                }

                let a1 = destWidth / sourceWidth;
                if (a1 != 1) {
                    a = a1 * a;
                    b = a1 * b;
                }
                let d1 = destHeight / sourceHeight;
                if (d1 != 1) {
                    c = d1 * c;
                    d = d1 * d;
                }
            }

            if (meshVertices) {
                // 
                const vertices = this._verticesFloat32View;
                const verticesUint32View = this._verticesUint32View;
                let index = this._vertexIndex * this._vertSize;
                //
                let i = 0, iD = 0, l = 0;
                let u = 0, v = 0, x = 0, y = 0;
                for (i = 0, l = meshUVs.length; i < l; i += 2) {
                    iD = index + i * 5 / 2;
                    x = meshVertices[i];
                    y = meshVertices[i + 1];
                    u = meshUVs[i];
                    v = meshUVs[i + 1];
                    // xy
                    vertices[iD + 0] = a * x + c * y + tx;
                    vertices[iD + 1] = b * x + d * y + ty;
                    // uv
                    if (rotated) {
                        vertices[iD + 2] = (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth;
                        vertices[iD + 3] = (sourceY + u * sourceWidth) / textureSourceHeight;
                    }
                    else {
                        vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                        vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                    }
                    // alpha
                    verticesUint32View[iD + 4] = alpha;
                }
                //
                for (let i = 0, l = meshIndices.length; i < l; ++i) {
                    this._indicesUint16View[this._indexIndex + i] = meshIndices[i] + this._vertexIndex;
                }
                ++this._indexBufferId;
                this._vertexIndex += meshUVs.length / 2;
                this._indexIndex += meshIndices.length;
            } else {
                let width = textureSourceWidth;
                let height = textureSourceHeight;
                let w = sourceWidth;
                let h = sourceHeight;
                sourceX = sourceX / width;
                sourceY = sourceY / height;
                let vertices = this._verticesFloat32View;
                const verticesUint32View = this._verticesUint32View;
                let index = this._vertexIndex * this._vertSize;
                if (rotated) {
                    let temp = sourceWidth;
                    sourceWidth = sourceHeight / width;
                    sourceHeight = temp / height;
                    // xy
                    vertices[index++] = tx;
                    vertices[index++] = ty;
                    // uv
                    vertices[index++] = sourceWidth + sourceX;
                    vertices[index++] = sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + tx;
                    vertices[index++] = b * w + ty;
                    // uv
                    vertices[index++] = sourceWidth + sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + c * h + tx;
                    vertices[index++] = d * h + b * w + ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = c * h + tx;
                    vertices[index++] = d * h + ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                }
                else {
                    sourceWidth = sourceWidth / width;
                    sourceHeight = sourceHeight / height;
                    // xy
                    vertices[index++] = tx;
                    vertices[index++] = ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + tx;
                    vertices[index++] = b * w + ty;
                    // uv
                    vertices[index++] = sourceWidth + sourceX;
                    vertices[index++] = sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + c * h + tx;
                    vertices[index++] = d * h + b * w + ty;
                    // uv
                    vertices[index++] = sourceWidth + sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                    // xy
                    vertices[index++] = c * h + tx;
                    vertices[index++] = d * h + ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    verticesUint32View[index++] = alpha;
                }
                //
                if (this._indexBufferUsage === this._webGLRenderContext.context.DYNAMIC_DRAW) {
                    const _indicesUint16View = this._indicesUint16View;
                    const _indexIndex = this._indexIndex;
                    const _vertexIndex = this._vertexIndex;
                    _indicesUint16View[_indexIndex + 0] = 0 + _vertexIndex;
                    _indicesUint16View[_indexIndex + 1] = 1 + _vertexIndex;
                    _indicesUint16View[_indexIndex + 2] = 2 + _vertexIndex;
                    _indicesUint16View[_indexIndex + 3] = 0 + _vertexIndex;
                    _indicesUint16View[_indexIndex + 4] = 2 + _vertexIndex;
                    _indicesUint16View[_indexIndex + 5] = 3 + _vertexIndex;
                    ++this._indexBufferId;
                }

                this._vertexIndex += 4;
                this._indexIndex += 6;
            }
        }
        /** 
         * reset _vertexIndex and _indexIndex
         * @public
         */
        public clear(): void {
            this._vertexIndex = 0;
            this._indexIndex = 0;
        }
        /** 
         * bind and bufferdata
         * @public
         */
        public bind(): void {
            const gl = this._webGLRenderContext.context;
            if (!this._webglVertexBuffer) {
                this._webglVertexBuffer = gl.createBuffer();
            }
            this._webGLRenderContext.bindVertexBuffer(this._webglVertexBuffer);
            if (this._vertexIndex > 0) {
                const vb = this.getVertexArrayBuffer();
                this._uploadVerticesArray(vb);
            }
            if (!this._webglIndexBuffer) {
                this._webglIndexBuffer = gl.createBuffer();
            }
            this._webGLRenderContext.bindIndexBuffer(this._webglIndexBuffer);
            if (this._indexIndex > 0 && this._currentIndexBufferId !== this._indexBufferId) {
                this._currentIndexBufferId = this._indexBufferId;
                const ib = this.getIndexArrayBuffer();
                this._uploadIndicesArray(ib);
            }
        }
        /** 
         * buffer data vertex data
         * @private
         */
        private _uploadVerticesArray(array: Float32Array): void {
            const gl = this._webGLRenderContext.context;
            if (this.lastUploadVertexBufferLength >= array.length) {
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
            }
            else {
                this.lastUploadVertexBufferLength = array.length;
                gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);
            }
        }
        /** 
         * buffer data index data
         * @private
         */
        private _uploadIndicesArray(array: Uint16Array): void {
            const gl = this._webGLRenderContext.context;
            if (this.lastUploadIndexBufferLength >= array.length) {
                gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, array);
            }
            else {
                this.lastUploadIndexBufferLength = array.length;
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, this._indexBufferUsage);
            }
        }
    }
}
