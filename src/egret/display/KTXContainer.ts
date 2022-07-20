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

    /** !!!!!!!!inspired by Babylon.js!!!!!!!!!!!!!
     * for description see https://www.khronos.org/opengles/sdk/tools/KTX/
     * for file layout see https://www.khronos.org/opengles/sdk/tools/KTX/file_format_spec/
     * Current families are astc, dxt, pvrtc, etc2, & etc1.
     * @returns The extension selected.
     */
    export class KTXContainer {

        private static readonly HEADER_LEN = 12 + (13 * 4); // identifier + header elements (not including key value meta-data pairs)

        // load types
        private static readonly COMPRESSED_2D = 0; // uses a gl.compressedTexImage2D()
        private static readonly COMPRESSED_3D = 1; // uses a gl.compressedTexImage3D()
        private static readonly TEX_2D = 2; // uses a gl.texImage2D()
        private static readonly TEX_3D = 3; // uses a gl.texImage3D()

        // elements of the header
        /**
         * Gets the openGL type
         */
        public glType: number;
        /**
         * Gets the openGL type size
         */
        public glTypeSize: number;
        /**
         * Gets the openGL format
         */
        public glFormat: number;
        /**
         * Gets the openGL internal format
         */
        public glInternalFormat: number;
        /**
         * Gets the base internal format
         */
        public glBaseInternalFormat: number;
        /**
         * Gets image width in pixel
         */
        public pixelWidth: number;
        /**
         * Gets image height in pixel
         */
        public pixelHeight: number;
        /**
         * Gets image depth in pixels
         */
        public pixelDepth: number;
        /**
         * Gets the number of array elements
         */
        public numberOfArrayElements: number;
        /**
         * Gets the number of faces
         */
        public numberOfFaces: number;
        /**
         * Gets the number of mipmap levels
         */
        public numberOfMipmapLevels: number;
        /**
         * Gets the bytes of key value data
         */
        public bytesOfKeyValueData: number;
        /**
         * Gets the load type
         */
        public loadType: number;
        /**
         * If the container has been made invalid (eg. constructor failed to correctly load array buffer)
         */
        public isInvalid = false;

        /**
         * Creates a new KhronosTextureContainer
         * @param arrayBuffer contents of the KTX container file
         * @param facesExpected should be either 1 or 6, based whether a cube texture or or
         * @param threeDExpected provision for indicating that data should be a 3D texture, not implemented
         * @param textureArrayExpected provision for indicating that data should be a texture array, not implemented
         */
        constructor(/** contents of the KTX container file */public arrayBuffer: any, facesExpected: number, threeDExpected?: boolean, textureArrayExpected?: boolean) {
            // Test that it is a ktx formatted file, based on the first 12 bytes, character representation is:
            // '�', 'K', 'T', 'X', ' ', '1', '1', '�', '\r', '\n', '\x1A', '\n'
            // 0xAB, 0x4B, 0x54, 0x58, 0x20, 0x31, 0x31, 0xBB, 0x0D, 0x0A, 0x1A, 0x0A
            const identifier = new Uint8Array(this.arrayBuffer, 0, 12);
            if (identifier[0] !== 0xAB || identifier[1] !== 0x4B || identifier[2] !== 0x54 || identifier[3] !== 0x58 || identifier[4] !== 0x20 || identifier[5] !== 0x31 ||
                identifier[6] !== 0x31 || identifier[7] !== 0xBB || identifier[8] !== 0x0D || identifier[9] !== 0x0A || identifier[10] !== 0x1A || identifier[11] !== 0x0A) {
                this.isInvalid = true;
                //Logger.Error("texture missing KTX identifier");
                console.error("texture missing KTX identifier");
                return;
            }

            // load the reset of the header in native 32 bit uint
            const dataSize = Uint32Array.BYTES_PER_ELEMENT;
            const headerDataView = new DataView(this.arrayBuffer, 12, 13 * dataSize);
            const endianness = headerDataView.getUint32(0, true);
            const littleEndian = endianness === 0x04030201;

            this.glType = headerDataView.getUint32(1 * dataSize, littleEndian); // must be 0 for compressed textures
            this.glTypeSize = headerDataView.getUint32(2 * dataSize, littleEndian); // must be 1 for compressed textures
            this.glFormat = headerDataView.getUint32(3 * dataSize, littleEndian); // must be 0 for compressed textures
            this.glInternalFormat = headerDataView.getUint32(4 * dataSize, littleEndian); // the value of arg passed to gl.compressedTexImage2D(,,x,,,,)
            this.glBaseInternalFormat = headerDataView.getUint32(5 * dataSize, littleEndian); // specify GL_RGB, GL_RGBA, GL_ALPHA, etc (un-compressed only)
            this.pixelWidth = headerDataView.getUint32(6 * dataSize, littleEndian); // level 0 value of arg passed to gl.compressedTexImage2D(,,,x,,,)
            this.pixelHeight = headerDataView.getUint32(7 * dataSize, littleEndian); // level 0 value of arg passed to gl.compressedTexImage2D(,,,,x,,)
            this.pixelDepth = headerDataView.getUint32(8 * dataSize, littleEndian); // level 0 value of arg passed to gl.compressedTexImage3D(,,,,,x,,)
            this.numberOfArrayElements = headerDataView.getUint32(9 * dataSize, littleEndian); // used for texture arrays
            this.numberOfFaces = headerDataView.getUint32(10 * dataSize, littleEndian); // used for cubemap textures, should either be 1 or 6
            this.numberOfMipmapLevels = headerDataView.getUint32(11 * dataSize, littleEndian); // number of levels; disregard possibility of 0 for compressed textures
            this.bytesOfKeyValueData = headerDataView.getUint32(12 * dataSize, littleEndian); // the amount of space after the header for meta-data

            // Make sure we have a compressed type.  Not only reduces work, but probably better to let dev know they are not compressing.
            if (this.glType !== 0) {
                console.error("only compressed formats currently supported");
                return;
            } else {
                // value of zero is an indication to generate mipmaps @ runtime.  Not usually allowed for compressed, so disregard.
                this.numberOfMipmapLevels = Math.max(1, this.numberOfMipmapLevels);
            }

            if (this.pixelHeight === 0 || this.pixelDepth !== 0) {
                console.error("only 2D textures currently supported");
                return;
            }

            if (this.numberOfArrayElements !== 0) {
                console.error("texture arrays not currently supported");
                return;
            }

            if (this.numberOfFaces !== facesExpected) {
                console.error("number of faces expected" + facesExpected + ", but found " + this.numberOfFaces);
                return;
            }
            // we now have a completely validated file, so could use existence of loadType as success
            // would need to make this more elaborate & adjust checks above to support more than one load type
            this.loadType = KTXContainer.COMPRESSED_2D;
        }

        /**
         * Uploads KTX content to a Babylon Texture.
         * It is assumed that the texture has already been created & is currently bound
         * @hidden
         */
        public uploadLevels(bitmapData: egret.BitmapData, loadMipmaps: boolean): void {
            if (this.loadType === KTXContainer.COMPRESSED_2D) {
                this._upload2DCompressedLevels(bitmapData, loadMipmaps);
            }
        }

        private _upload2DCompressedLevels(bitmapData: egret.BitmapData, loadMipmaps: boolean): void {
            bitmapData.clearCompressedTextureData();

            // initialize width & height for level 1
            let dataOffset = KTXContainer.HEADER_LEN + this.bytesOfKeyValueData;
            let width = this.pixelWidth;
            let height = this.pixelHeight;

            const mipmapCount = loadMipmaps ? this.numberOfMipmapLevels : 1;
            for (let level = 0; level < mipmapCount; level++) {

                const imageSize = new Int32Array(this.arrayBuffer, dataOffset, 1)[0]; // size per face, since not supporting array cubemaps
                dataOffset += 4; //image data starts from next multiple of 4 offset. Each face refers to same imagesize field above.

                const levelData: egret.CompressedTextureData[] = [];
                for (let face = 0; face < this.numberOfFaces; face++) {

                    const byteArray = new Uint8Array(this.arrayBuffer, dataOffset, imageSize);

                    const compressedData = new egret.CompressedTextureData;
                    compressedData.glInternalFormat = this.glInternalFormat;
                    compressedData.width = width;
                    compressedData.height = height;
                    compressedData.byteArray = byteArray;
                    compressedData.face = face;
                    compressedData.level = level;
                    levelData.push(compressedData);

                    dataOffset += imageSize; // add size of the image for the next face/mipmap
                    dataOffset += 3 - ((imageSize + 3) % 4); // add padding for odd sized image
                }
                bitmapData.$setCompressed2dTextureData(levelData);

                width = Math.max(1.0, width * 0.5);
                height = Math.max(1.0, height * 0.5);
            }
            const compressed2d = bitmapData.getCompressed2dTextureData();
            if (compressed2d) {
                bitmapData.width = compressed2d.width;
                bitmapData.height = compressed2d.height;
            }
        }
    }

}

