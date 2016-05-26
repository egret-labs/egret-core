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
     * @private
     * 顶点数组管理对象
     * 用来维护顶点数组
     */
    export class WebGLVertexArrayObject {

        private size:number = 2000;
        private vertexMaxSize:number = 2000 * 4;
        private vertSize:number = 5;

        private vertices:Float32Array = null;
        private indices:Uint16Array = null;
        private indicesForMesh:Uint16Array = null;

        private vertexIndex: number = 0;
        private indexIndex: number = 0;

        private hasMesh:boolean = false;

        public constructor() {
            var numVerts = this.vertexMaxSize * this.vertSize;
            var numIndices = this.vertexMaxSize * 3 / 2;

            this.vertices = new Float32Array(numVerts);
            this.indices = new Uint16Array(numIndices);
            this.indicesForMesh = new Uint16Array(numIndices);

            for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
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
        public reachMaxSize():boolean {
            // TODO 此处的4*4应该为下次绘制实际要绘制的顶点数，并且应该同时检查index
            return this.vertexIndex >= this.vertexMaxSize - 4 * 4;
        }

        /**
         * 获取缓存完成的顶点数组
         */
        public getVertices():any {
            var view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
            return view;
        }

        /**
         * 获取缓存完成的索引数组
         */
        public getIndices():any {
            return this.indices;
        }

        /**
         * 获取缓存完成的mesh索引数组
         */
        public getMeshIndices():any {
            return this.indicesForMesh;
        }

        /**
         * 切换成mesh索引缓存方式
         */
        public changeToMeshIndices():void {
            if(!this.hasMesh) {
                // 拷贝默认index信息到for mesh中
                for (var i = 0, l = this.indexIndex; i < l; ++i) {
                    this.indicesForMesh[i] = this.indices[i];
                }

                this.hasMesh = true;
            }
        }

        public isMesh():boolean {
            return this.hasMesh;
        }

        /**
         * 默认构成矩形
         */
        private defaultMeshVertices = [0, 0, 1, 0, 1, 1, 0, 1];
        private defaultMeshUvs = [
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ];
        private defaultMeshIndices = [0, 1, 2, 0, 2, 3];

        /**
         * 缓存一组顶点
         */
        public cacheArrays(transform:Matrix, alpha:number, sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                             destX:number, destY:number, destWidth:number, destHeight:number, textureSourceWidth:number, textureSourceHeight:number,
                             meshUVs?:number[], meshVertices?:number[], meshIndices?:number[]):void {

             // 如果后三个值缺省，默认为构成矩形的顶点
             if(!meshVertices) {
                 this.defaultMeshVertices[2] = this.defaultMeshVertices[4] = sourceWidth;
                 this.defaultMeshVertices[5] = this.defaultMeshVertices[7] = sourceHeight;
             }

             meshVertices = meshVertices || this.defaultMeshVertices;
             meshUVs = meshUVs || this.defaultMeshUvs;
             meshIndices = meshIndices || this.defaultMeshIndices;

             //计算出绘制矩阵，之后把矩阵还原回之前的
             var locWorldTransform = transform;
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

             // 计算索引位置与赋值
             var vertices:Float32Array = this.vertices;
             var index:number = this.vertexIndex * this.vertSize;

             // 缓存顶点数组
             var i = 0, iD = 0, l = 0;
             var u = 0, v = 0, x = 0, y = 0;
             for (i = 0, l = meshUVs.length; i < l; i += 2) {
                 iD = i * 5 / 2;
                 x = meshVertices[i];
                 y = meshVertices[i + 1];
                 u = meshUVs[i];
                 v = meshUVs[i + 1];

                 // xy
                 vertices[index + iD + 0] = a * x + c * y + tx;
                 vertices[index + iD + 1] = b * x + d * y + ty;
                 // uv
                 vertices[index + iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                 vertices[index + iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                 // alpha
                 vertices[index + iD + 4] = alpha;
             }

             // 缓存索引数组
             if(this.hasMesh) {
                 for (var i = 0, l = meshIndices.length; i < l; ++i) {
                     this.indicesForMesh[this.indexIndex + i] = meshIndices[i] + this.vertexIndex;
                 }
             }

             this.vertexIndex += meshUVs.length / 2;
             this.indexIndex += meshIndices.length;
        }

        public clear():void {
            this.hasMesh = false;
            this.vertexIndex = 0;
            this.indexIndex = 0;
        }

    }
}
