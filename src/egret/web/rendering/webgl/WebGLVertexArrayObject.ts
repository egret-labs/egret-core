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
     * @private
     * 顶点数组管理对象
     * 用来维护顶点数组
     */
    export class WebGLVertexArrayObject {

        /*定义顶点格式
        * (x: 8 * 4 = 32) + (y: 8 * 4 = 32) + (u: 8 * 4 = 32) + (v: 8 * 4 = 32) + (tintcolor: 8 * 4 = 32) = (8 * 4 = 32) * (x + y + u + v + tintcolor: 5);
        */
        private readonly vertSize: number = 5;
        private readonly vertByteSize = this.vertSize * 4;
        /*
        *最多单次提交maxQuadsCount这么多quad
        */
        private readonly maxQuadsCount: number = 2048;
        /*
        *quad = 4个Vertex
        */
        private readonly maxVertexCount: number = this.maxQuadsCount * 4;
        /*
        *配套的Indices = quad * 6. 
        */
        private readonly maxIndicesCount: number = this.maxQuadsCount * 6;

        public vertices: Float32Array = null;
        private indices: Uint16Array = null;
        private indicesForMesh: Uint16Array = null;

        private vertexIndex: number = 0;
        private indexIndex: number = 0;

        private hasMesh: boolean = false;

        /*
        * refactor: 
        */
        private _vertices: ArrayBuffer = null;
        private _verticesFloat32View: Float32Array = null;
        private _verticesUint32View: Uint32Array = null;

        constructor() {
            //old
            // const numVerts = this.maxVertexCount * this.vertSize;
            // this.vertices = new Float32Array(numVerts);
            ///
            this._vertices = new ArrayBuffer(this.maxVertexCount * this.vertByteSize);
            this._verticesFloat32View = new Float32Array(this._vertices);
            this._verticesUint32View = new Uint32Array(this._vertices);
            this.vertices = this._verticesFloat32View;
            //索引缓冲，最大索引数
            /*
            0-------1
            |       |
            |       |
            3-------2  
            0->1->2
            0->2->3 
            两个三角形
            */
            const maxIndicesCount = this.maxIndicesCount;
            this.indices = new Uint16Array(maxIndicesCount);
            this.indicesForMesh = new Uint16Array(maxIndicesCount);
            for (let i = 0, j = 0; i < maxIndicesCount; i += 6, j += 4) {
                this.indices[i + 0] = j + 0;
                this.indices[i + 1] = j + 1;
                this.indices[i + 2] = j + 2;
                this.indices[i + 3] = j + 0;
                this.indices[i + 4] = j + 2;
                this.indices[i + 5] = j + 3;
            }
        }

        /**
         * 是否达到最大缓存数量
         */
        public reachMaxSize(vertexCount: number = 4, indexCount: number = 6): boolean {
            return this.vertexIndex > this.maxVertexCount - vertexCount || this.indexIndex > this.maxIndicesCount - indexCount;
        }

        /**
         * 获取缓存完成的顶点数组
         */
        public getVertices(): Float32Array {
            let view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
            return view;
        }

        /**
         * 获取缓存完成的索引数组
         */
        public getIndices(): Uint16Array {
            return this.indices;
        }

        /**
         * 获取缓存完成的mesh索引数组
         */
        public getMeshIndices(): any {
            return this.indicesForMesh;
        }

        /**
         * 切换成mesh索引缓存方式
         */
        public changeToMeshIndices(): void {
            if (!this.hasMesh) {
                // 拷贝默认index信息到for mesh中
                for (let i = 0, l = this.indexIndex; i < l; ++i) {
                    this.indicesForMesh[i] = this.indices[i];
                }

                this.hasMesh = true;
            }
        }

        public isMesh(): boolean {
            return this.hasMesh;
        }

        /**
         * 默认构成矩形
         */
        // private defaultMeshVertices = [0, 0, 1, 0, 1, 1, 0, 1];
        // private defaultMeshUvs = [
        //     0, 0,
        //     1, 0,
        //     1, 1,
        //     0, 1
        // ];
        // private defaultMeshIndices = [0, 1, 2, 0, 2, 3];

        /**
         * 缓存一组顶点
         */
        public cacheArrays(buffer: WebGLRenderBuffer, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
            destX: number, destY: number, destWidth: number, destHeight: number, textureSourceWidth: number, textureSourceHeight: number,
            meshUVs?: number[], meshVertices?: number[], meshIndices?: number[], rotated?: boolean): void {
            let alpha = buffer.globalAlpha;
            /*
            * 混入tintcolor => alpha
            */
            alpha = Math.min(alpha, 1.0);
            const globalTintColor = buffer.globalTintColor || 0xFFFFFF;
            const currentTexture = buffer.currentTexture;
            alpha = ((alpha < 1.0 && currentTexture && currentTexture[UNPACK_PREMULTIPLY_ALPHA_WEBGL]) ?
                WebGLUtils.premultiplyTint(globalTintColor, alpha)
                : globalTintColor + (alpha * 255 << 24));
            /*
            临时测试
            */
            //计算出绘制矩阵，之后把矩阵还原回之前的
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
                if (isIOS14Device()) {
                    let vertData = [];
                    // 计算索引位置与赋值
                    const vertices = this.vertices;
                    const verticesUint32View = this._verticesUint32View;
                    let index = this.vertexIndex * this.vertSize;
                    // 缓存顶点数组
                    let i = 0, iD = 0, l = 0;
                    let u = 0, v = 0, x = 0, y = 0;
                    for (i = 0, l = meshUVs.length; i < l; i += 2) {
                        iD = index + i * 5 / 2;
                        x = meshVertices[i];
                        y = meshVertices[i + 1];
                        u = meshUVs[i];
                        v = meshUVs[i + 1];

                        if (rotated) {
                            vertData.push([
                                a * x + c * y + tx,
                                b * x + d * y + ty,
                                (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth,
                                (sourceY + u * sourceWidth) / textureSourceHeight,
                            ]);
                        } else {
                            vertData.push([
                                a * x + c * y + tx,
                                b * x + d * y + ty,
                                (sourceX + u * sourceWidth) / textureSourceWidth,
                                (sourceY + v * sourceHeight) / textureSourceHeight,
                            ]);
                        }
                        verticesUint32View[iD + 4] = alpha;
                    }
                    for (let i = 0; i < meshIndices.length; i += 3) {
                        let data0 = vertData[meshIndices[i]];
                        vertices[index++] = data0[0];
                        vertices[index++] = data0[1];
                        vertices[index++] = data0[2];
                        vertices[index++] = data0[3];
                        verticesUint32View[index++] = alpha;

                        let data1 = vertData[meshIndices[i + 1]];
                        vertices[index++] = data1[0];
                        vertices[index++] = data1[1];
                        vertices[index++] = data1[2];
                        vertices[index++] = data1[3];
                        verticesUint32View[index++] = alpha;

                        let data2 = vertData[meshIndices[i + 2]];
                        vertices[index++] = data2[0];
                        vertices[index++] = data2[1];
                        vertices[index++] = data2[2];
                        vertices[index++] = data2[3];
                        verticesUint32View[index++] = alpha;

                        // 填充数据
                        vertices[index++] = data2[0];
                        vertices[index++] = data2[1];
                        vertices[index++] = data2[2];
                        vertices[index++] = data2[3];
                        verticesUint32View[index++] = alpha;
                    }

                    let meshNum = meshIndices.length / 3;
                    this.vertexIndex += 4 * meshNum;
                    this.indexIndex += 6 * meshNum;
                }
                else {
                    // 计算索引位置与赋值
                    const vertices = this.vertices;
                    const verticesUint32View = this._verticesUint32View;
                    let index = this.vertexIndex * this.vertSize;
                    // 缓存顶点数组
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
                    // 缓存索引数组
                    if (this.hasMesh) {
                        for (let i = 0, l = meshIndices.length; i < l; ++i) {
                            this.indicesForMesh[this.indexIndex + i] = meshIndices[i] + this.vertexIndex;
                        }
                    }
                    this.vertexIndex += meshUVs.length / 2;
                    this.indexIndex += meshIndices.length;
                }

            } else {
                let width = textureSourceWidth;
                let height = textureSourceHeight;
                let w = sourceWidth;
                let h = sourceHeight;
                sourceX = sourceX / width;
                sourceY = sourceY / height;
                let vertices = this.vertices;
                const verticesUint32View = this._verticesUint32View;
                let index = this.vertexIndex * this.vertSize;
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
                // 缓存索引数组
                if (this.hasMesh) {
                    let indicesForMesh = this.indicesForMesh;
                    indicesForMesh[this.indexIndex + 0] = 0 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 1] = 1 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 2] = 2 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 3] = 0 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 4] = 2 + this.vertexIndex;
                    indicesForMesh[this.indexIndex + 5] = 3 + this.vertexIndex;
                }

                this.vertexIndex += 4;
                this.indexIndex += 6;
            }
        }

        public clear(): void {
            this.hasMesh = false;
            this.vertexIndex = 0;
            this.indexIndex = 0;
        }

    }

    export var isIOS14Device = () => {
        return false;
    };
}
