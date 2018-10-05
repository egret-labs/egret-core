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

namespace egret {
    /**
     * @private
     */
    export class Mesh extends Bitmap {

        public constructor(value?: Texture) {
            super(value);
            this.$renderNode = new sys.MeshNode();
        }

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.MESH);
        }

        /**
         * @private
         */
        protected setBitmapDataToWasm(data?: Texture): void {
            this.$nativeDisplayObject.setBitmapDataToMesh(data);
        }

        /**
         * @private
         */
        $updateRenderNode(): void {
            let image = this.$bitmapData;
            if (!image) {
                return;
            }

            let scale = $TextureScaleFactor;
            let node = <sys.MeshNode>this.$renderNode;
            node.smoothing = this.$smoothing;
            node.image = image;
            node.imageWidth = this.$sourceWidth;
            node.imageHeight = this.$sourceHeight;

            let destW: number = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$textureWidth;
            let destH: number = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$textureHeight;
            let tsX: number = destW / this.$textureWidth;
            let tsY: number = destH / this.$textureHeight;
            let bitmapWidth: number = this.$bitmapWidth;
            let bitmapHeight: number = this.$bitmapHeight;

            node.drawMesh(
                this.$bitmapX, this.$bitmapY,
                bitmapWidth, bitmapHeight,
                this.$offsetX * tsX, this.$offsetY * tsY,
                tsX * bitmapWidth, tsY * bitmapHeight
            );
        }

        /**
         * @private
         */
        private _verticesDirty: boolean = true;
        private _bounds: Rectangle = new Rectangle();
        /**
         * @private
         */
        $updateVertices(): void {
            let self = this;
            self._verticesDirty = true;
            self.$renderDirty = true;
            if (egret.nativeRender) {
                let renderNode = <sys.MeshNode>(this.$renderNode);
                this.$nativeDisplayObject.setDataToMesh(renderNode.vertices, renderNode.indices, renderNode.uvs);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            if (this._verticesDirty) {
                this._verticesDirty = false;
                let node = <sys.MeshNode>this.$renderNode;
                let vertices = node.vertices;
                if (vertices.length) {
                    this._bounds.setTo(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                    for (let i = 0, l = vertices.length; i < l; i += 2) {
                        let x = vertices[i];
                        let y = vertices[i + 1];
                        if (this._bounds.x > x) this._bounds.x = x;
                        if (this._bounds.width < x) this._bounds.width = x;
                        if (this._bounds.y > y) this._bounds.y = y;
                        if (this._bounds.height < y) this._bounds.height = y;
                    }
                    this._bounds.width -= this._bounds.x;
                    this._bounds.height -= this._bounds.y;
                } else {
                    this._bounds.setTo(0, 0, 0, 0);
                }
                node.bounds.copyFrom(this._bounds);
            }
            bounds.copyFrom(this._bounds);
        }
    }
}
