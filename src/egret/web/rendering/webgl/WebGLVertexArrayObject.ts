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

        private size: number = 2000;
        private vertexMaxSize: number = this.size * 4;
        private indicesMaxSize: number = this.size * 6;
        private vertSize: number = 5;

        private vertices: Float32Array = null;
        private indices: Uint16Array = null;
        private indicesForMesh: Uint16Array = null;

        private vertexIndex: number = 0;
        private indexIndex: number = 0;

        private hasMesh: boolean = false;

        public constructor() {
            let numVerts = this.vertexMaxSize * this.vertSize;
            let numIndices = this.indicesMaxSize;

            this.vertices = new Float32Array(numVerts);
            this.indices = new Uint16Array(numIndices);
            this.indicesForMesh = new Uint16Array(numIndices);

            for (let i = 0, j = 0; i < numIndices; i += 6, j += 4) {
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
            return this.vertexIndex > this.vertexMaxSize - vertexCount || this.indexIndex > this.indicesMaxSize - indexCount;
        }

        /**
         * 获取缓存完成的顶点数组
         */
        public getVertices(): any {
            let view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
            return view;
        }

        /**
         * 获取缓存完成的索引数组
         */
        public getIndices(): any {
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
                // 计算索引位置与赋值
                let vertices = this.vertices;
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
                    vertices[iD + 4] = alpha;
                }
                // 缓存索引数组
                if (this.hasMesh) {
                    for (let i = 0, l = meshIndices.length; i < l; ++i) {
                        this.indicesForMesh[this.indexIndex + i] = meshIndices[i] + this.vertexIndex;
                    }
                }
                this.vertexIndex += meshUVs.length / 2;
                this.indexIndex += meshIndices.length;
            } else {
                let width = textureSourceWidth;
                let height = textureSourceHeight;
                let w = sourceWidth;
                let h = sourceHeight;
                sourceX = sourceX / width;
                sourceY = sourceY / height;
                let vertices = this.vertices;
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
                    vertices[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + tx;
                    vertices[index++] = b * w + ty;
                    // uv
                    vertices[index++] = sourceWidth + sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    vertices[index++] = alpha;
                    // xy
                    vertices[index++] = a * w + c * h + tx;
                    vertices[index++] = d * h + b * w + ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceHeight + sourceY;
                    // alpha
                    vertices[index++] = alpha;
                    // xy
                    vertices[index++] = c * h + tx;
                    vertices[index++] = d * h + ty;
                    // uv
                    vertices[index++] = sourceX;
                    vertices[index++] = sourceY;
                    // alpha
                    vertices[index++] = alpha;
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
}
