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

    //refactor
    export class CompressedTextureData {
        public glInternalFormat: number;
        public width: number;
        public height: number;
        public byteArray: Uint8Array;
        public face: number;
        public level: number;
    }

    export const etc_alpha_mask = 'etc_alpha_mask';
    export const engine_default_empty_texture = 'engine_default_empty_texture';
    export const is_compressed_texture = 'is_compressed_texture';
    export const glContext = 'glContext';

    

    /**
     * A BitmapData object contains an array of pixel data. This data can represent either a fully opaque bitmap or a
     * transparent bitmap that contains alpha channel data. Either type of BitmapData object is stored as a buffer of 32-bit
     * integers. Each 32-bit integer determines the properties of a single pixel in the bitmap.<br/>
     * Each 32-bit integer is a combination of four 8-bit channel values (from 0 to 255) that describe the alpha transparency
     * and the red, green, and blue (ARGB) values of the pixel. (For ARGB values, the most significant byte represents the
     * alpha channel value, followed by red, green, and blue.)
     * @see egret.Bitmap
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * BitmapData 对象是一个包含像素数据的数组。此数据可以表示完全不透明的位图，或表示包含 Alpha 通道数据的透明位图。
     * 以上任一类型的 BitmapData 对象都作为 32 位整数的缓冲区进行存储。每个 32 位整数确定位图中单个像素的属性。<br/>
     * 每个 32 位整数都是四个 8 位通道值（从 0 到 255）的组合，这些值描述像素的 Alpha 透明度以及红色、绿色、蓝色 (ARGB) 值。
     * （对于 ARGB 值，最高有效字节代表 Alpha 通道值，其后的有效字节分别代表红色、绿色和蓝色通道值。）
     * @see egret.Bitmap
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export class BitmapData extends HashObject {
        /**
         * The width of the bitmap image in pixels.
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 位图图像的宽度，以像素为单位。
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        width: number;
        /**
         * The height of the bitmap image in pixels.
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 位图图像的高度，以像素为单位。
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        height: number;

        /**
         * Original bitmap image.
         * HTMLImageElement|HTMLCanvasElement|HTMLVideoElement
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         * @language en_US
         */
        /**
         * 原始位图图像。
         * HTMLImageElement|HTMLCanvasElement|HTMLVideoElement
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         * @language zh_CN
         */
        $source: any;

        /**
         * WebGL texture.
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         * @language en_US
         */
        /**
         * WebGL纹理。
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         * @language zh_CN
         */
        webGLTexture: any;

        /**
         * Texture format.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 纹理格式。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        format: string = "image";

        /**
         * @private
         * webgl纹理生成后，是否删掉原始图像数据
         */
        $deleteSource: boolean = true;

        /**
         * @private
         * id
         */
        public $nativeBitmapData: egret_native.NativeBitmapData;

        /**
         * @private
         * 
         */
        public readonly compressedTextureData: Array<Array<CompressedTextureData>> = [];
        public debugCompressedTextureURL: string = '';
        public etcAlphaMask: Nullable<BitmapData> = null;

        /**
         * Initializes a BitmapData object to refer to the specified source object.
         * @param source The source object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个引用指定 source 实例的 BitmapData 对象
         * @param source 被引用的 source 实例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        constructor(source: any) {
            super();
            if (egret.nativeRender) {
                let nativeBitmapData = new egret_native.NativeBitmapData();
                nativeBitmapData.$init();
                this.$nativeBitmapData = nativeBitmapData;
            }
            this.source = source;
            // this.width = source.width;
            // this.height = source.height;
            this.source = source;
            if (this.source) {
                this.width = +source.width;
                this.height = +source.height;
            }
            else {
                ///compressed texture?
            }
        }

        public get source(): any {
            return this.$source;
        }

        public set source(value: any) {
            this.$source = value;
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.setSourceToNativeBitmapData(this.$nativeBitmapData, value);
            }
        }

        public static create(type: "arraybuffer", data: ArrayBuffer, callback?: (bitmapData: BitmapData) => void): BitmapData;
        public static create(type: "base64", data: string, callback?: (bitmapData: BitmapData) => void): BitmapData;
        public static create(type: "arraybuffer" | "base64", data: ArrayBuffer | string, callback?: (bitmapData: BitmapData) => void): BitmapData {
            let base64 = "";
            if (type === "arraybuffer") {
                base64 = egret.Base64Util.encode(data as ArrayBuffer);
            }
            else {
                base64 = data as string;
            }
            let imageType = "image/png";//default value
            if (base64.charAt(0) === '/') {
                imageType = "image/jpeg";
            } else if (base64.charAt(0) === 'R') {
                imageType = "image/gif";
            } else if (base64.charAt(0) === 'i') {
                imageType = "image/png";
            }
            let img: HTMLImageElement = new Image();
            img.src = "data:" + imageType + ";base64," + base64;
            img.crossOrigin = '*';
            let bitmapData = new BitmapData(img);
            img.onload = function () {
                img.onload = undefined;
                bitmapData.source = img;
                bitmapData.height = img.height;
                bitmapData.width = img.width;
                if (callback) {
                    callback(bitmapData);
                }
            }
            return bitmapData;
        }

        public $dispose(): void {
            if (Capabilities.renderMode == "webgl" && this.webGLTexture) {
                egret.WebGLUtils.deleteWebGLTexture(this.webGLTexture);
                this.webGLTexture = null;
            }
            //native or WebGLRenderTarget
            if (this.source && this.source.dispose) {
                this.source.dispose();
            }
            // WeChat Memory leakage bug
            if (this.source && this.source.src) {
                this.source.src = "";
            }
            this.source = null;

            ///dispose compressed texture info
            //this.bitmapCompressedData.length = 0;
            this.clearCompressedTextureData();
            this.debugCompressedTextureURL = '';
            this.etcAlphaMask = null;
            ///
            
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.disposeNativeBitmapData(this.$nativeBitmapData);
            }
            BitmapData.$dispose(this);
        }



        private static _displayList = egret.createMap<DisplayObject[]>();
        static $addDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData): void {
            if (!bitmapData) {
                return;
            }
            let hashCode: number = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                BitmapData._displayList[hashCode] = [displayObject];
                return;
            }
            let tempList: Array<DisplayObject> = BitmapData._displayList[hashCode];
            if (tempList.indexOf(displayObject) < 0) {
                tempList.push(displayObject);
            }
        }

        static $removeDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData): void {
            if (!bitmapData) {
                return;
            }
            let hashCode: number = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                return;
            }
            let tempList: Array<DisplayObject> = BitmapData._displayList[hashCode];
            let index: number = tempList.indexOf(displayObject);
            if (index >= 0) {
                tempList.splice(index, 1);
            }
        }

        static $invalidate(bitmapData: BitmapData): void {
            if (!bitmapData) {
                return;
            }
            let hashCode: number = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                return;
            }
            let tempList: Array<DisplayObject> = BitmapData._displayList[hashCode];
            for (let i: number = 0; i < tempList.length; i++) {
                if (tempList[i] instanceof egret.Bitmap) {
                    (<egret.Bitmap>tempList[i]).$refreshImageData();
                }
                let bitmap = tempList[i];
                bitmap.$renderDirty = true;
                let p = bitmap.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = bitmap.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        static $dispose(bitmapData: BitmapData): void {
            if (!bitmapData) {
                return;
            }
            let hashCode: number = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!BitmapData._displayList[hashCode]) {
                return;
            }
            let tempList = BitmapData._displayList[hashCode];
            for (let node of tempList) {
                if (node instanceof egret.Bitmap) {
                    node.$bitmapData = null;
                }
                node.$renderDirty = true;
                let p = node.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = node.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            delete BitmapData._displayList[hashCode];
        }

        private _getCompressedTextureData(level: number, face: number): CompressedTextureData {
            if (DEBUG) {
                //level face is valid?
            }
            const levelData = this.compressedTextureData[level];
            return levelData ? levelData[face] : null;
        }

        public getCompressed2dTextureData(): CompressedTextureData {
            return this._getCompressedTextureData(0, 0);
        }

        public hasCompressed2d(): boolean {
            return !!this.getCompressed2dTextureData();
        }
        
        public clearCompressedTextureData(): void {
            this.compressedTextureData.length = 0;
        }
    }
}
