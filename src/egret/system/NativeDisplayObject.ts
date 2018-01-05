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

namespace egret_native {
    //渲染命令枚举
    const enum CommandType {
        CREATE_OBJECT = 0,
        REMOVE_CHILD = 2,
        ADD_CHILD_AT = 3,
        SWAP_CHILD_AT = 4,
        SET_X = 101,
        SET_Y = 102,
        SET_ROTATION = 103,
        SET_SCALE_X = 104,
        SET_SCALE_Y = 105,
        SET_SKEW_X = 106,
        SET_SKEW_Y = 107,
        SET_ALPHA = 108,
        SET_WIDTH = 114,
        SET_HEIGHT = 115,
        SET_ANCHOR_OFFSET_X = 116,
        SET_ANCHOR_OFFSET_Y = 117,
        SET_VISIBLE = 118,
        SET_BITMAP_DATA = 121,
        SET_VALUES_TO_BITMAP_DATA = 122,
        SET_IMAGE_ID_TO_BITMAP_DATA = 123,
        SET_SCALE_9_GRID = 124,
        SET_MATRIX = 125,
        SET_BLEND_MODE = 126,
        SET_MASK_RECT = 127,
        SET_SCROLL_RECT = 128,
        SET_DATA_TO_COLOR_MATRIX_FILTER = 129,
        SET_MASK = 131,
        SET_DATA_TO_BLUR_FILTER = 132,
        SET_DATA_TO_GLOW_FILTER = 133,
        SET_FILTERS = 134,
        SET_CACHE_AS_BITMAP = 135,
        SET_PADDING_TO_FILTER = 136,
        SET_ISTYPING = 137,
        SET_TEXT_RECT = 138,
        SET_GRAPHICS_RECT = 139,
        DISPOSE_DISPLAY_OBJECT = 140,
        DISPOSE_BITMAP_DATA = 141,
        DISPOSE_FILTER = 142,
        SET_SPRITE_GRAPHICS_RECT = 143,
        SET_MESH_VERTICE_DATA = 144,
        SET_MESH_UVS_DATA = 145,
        SET_MESH_INDICES_DATA = 146,
        SET_MESH_BITMAP_DATA = 147,
        DISPOSE_GRAPHICS_DATA = 148,
        DISPOSE_TEXT_DATA = 149,
        SET_FILLMODE = 150,

        SET_CUSTOM_DATA = 901,
        SET_PARTICLE_BITMAP_DATA = 902,
        SET_PARTICLE_STOP = 903,

        SET_DATA_TO_BITMAP_NODE = 1001,
        SET_DATA_TO_TEXTFIELD = 1002,
        SET_GRAPHICS_RENDERDATA = 1003,
        SET_DATA_TO_FILTER = 1004

    }

    const enum FilterType {
        colorTransform = 1,
        blur = 2,
        glow = 3,
        custom = 4
    }

    let displayObjectId: number = 0;

    let bitmapDataMap;
    let bitmapDataId = 1;

    let filterId = 1;
    let customFilterDataMap = {};
    let customFilterUniformMap = {};

    let displayCmdBufferIndex: number = 2;
    let displayCmdBufferSize: number = 0;
    let displayCmdBuffer: Float32Array;
    if (egret.nativeRender) {
        displayCmdBuffer = new Float32Array(20000);
    }

    /**
     * @private
     */
    export class NativeDisplayObject {

        public static init(buffer: Float32Array, map1, map2, map3): void {
            //初始化之前有原生对象创建
            if (displayCmdBufferIndex != 2) {
                for (let i = 2; i < displayCmdBufferIndex; i++) {
                    buffer[i] = displayCmdBuffer[i];
                }
            }
            displayCmdBuffer = buffer;
            displayCmdBuffer[0] = 0;
            displayCmdBuffer[1] = 2;
            bitmapDataMap = map1;
            customFilterDataMap = map3;
        }

        public id: number;

        protected $obj: any;

        public static update(): void {
            displayCmdBuffer[0] = displayCmdBufferSize;
            displayCmdBuffer[1] = displayCmdBufferIndex;
            displayCmdBufferSize = 0;
            displayCmdBufferIndex = 2;
        }

        constructor(type: number) {
            this.id = displayObjectId;
            this.$obj = new egret_native.NrNode(this.id, type);
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.CREATE_OBJECT;
            displayCmdBuffer[displayCmdBufferIndex++] = displayObjectId;
            displayCmdBuffer[displayCmdBufferIndex++] = type;
            displayCmdBufferSize++;
            displayObjectId++;
        }

        public addChildAt(childId: number, index: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.ADD_CHILD_AT;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = childId;
            displayCmdBuffer[displayCmdBufferIndex++] = index;
            displayCmdBufferSize++;
        }

        public removeChild(childId: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.REMOVE_CHILD;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = childId;
            displayCmdBufferSize++;

        }

        public swapChild(index1: number, index2: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SWAP_CHILD_AT;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = index1;
            displayCmdBuffer[displayCmdBufferIndex++] = index2;
            displayCmdBufferSize++;
        }

        public setX(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_X;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setY(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_Y;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setRotation(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_ROTATION;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setScaleX(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_SCALE_X;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setScaleY(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_SCALE_Y;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setSkewX(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_SKEW_X;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setSkewY(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_SKEW_Y;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setAlpha(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_ALPHA;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setAnchorOffsetX(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_ANCHOR_OFFSET_X;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setAnchorOffsetY(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_ANCHOR_OFFSET_Y;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setVisible(value: boolean): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_VISIBLE;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value ? 1 : 0;
            displayCmdBufferSize++;
        }

        public setBlendMode(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_BLEND_MODE;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setMaskRect(x: number, y: number, w: number, h: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_MASK_RECT;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = x;
            displayCmdBuffer[displayCmdBufferIndex++] = y;
            displayCmdBuffer[displayCmdBufferIndex++] = w;
            displayCmdBuffer[displayCmdBufferIndex++] = h;
            displayCmdBufferSize++;
        }

        public setScrollRect(x: number, y: number, w: number, h: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_SCROLL_RECT;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = x;
            displayCmdBuffer[displayCmdBufferIndex++] = y;
            displayCmdBuffer[displayCmdBufferIndex++] = w;
            displayCmdBuffer[displayCmdBufferIndex++] = h;
            displayCmdBufferSize++;
        }

        public setFilters(filters: Array<egret.Filter>): void {
            if (!filters) {
                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_FILTERS;
                displayCmdBuffer[displayCmdBufferIndex++] = this.id;
                displayCmdBuffer[displayCmdBufferIndex++] = 0;
                displayCmdBufferSize++;
                return;
            }

            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_FILTERS;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            let lengthIndex = displayCmdBufferIndex++;
            let length = filters.length;
            let trueLength = length;
            for (let i = 0; i < length; i++) {
                let filter = filters[i];
                if (filter.type == "blur") {
                    let blurFilter = (<egret.BlurFilter>filter);
                    if (blurFilter.$blurX != 0 && blurFilter.$blurY != 0) {
                        trueLength++;
                        displayCmdBuffer[displayCmdBufferIndex++] = blurFilter.blurXFilter.$id;
                        displayCmdBuffer[displayCmdBufferIndex++] = blurFilter.blurYFilter.$id;
                    }
                    else if (blurFilter.$blurX != 0) {
                        displayCmdBuffer[displayCmdBufferIndex++] = blurFilter.blurXFilter.$id;
                    }
                    else if (blurFilter.$blurY != 0) {
                        displayCmdBuffer[displayCmdBufferIndex++] = blurFilter.blurYFilter.$id;
                    }
                    else {
                        trueLength--;
                    }
                }
                else {
                    displayCmdBuffer[displayCmdBufferIndex++] = filter.$id;
                }
            }
            displayCmdBuffer[lengthIndex] = trueLength;
            displayCmdBufferSize++;
        }

        public static createFilter(filter: egret.Filter): void {
            filter.$id = filterId;
            filter.$obj = new egret_native.NrNode(filterId, NativeObjectType.FILTER);
            filterId++;
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.CREATE_OBJECT;
            displayCmdBuffer[displayCmdBufferIndex++] = filter.$id;
            displayCmdBuffer[displayCmdBufferIndex++] = NativeObjectType.FILTER;
            displayCmdBufferSize++;
        }

        public static setFilterPadding(filterId: number, paddingTop: number, paddingBottom: number, paddingLeft: number, paddingRight: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_PADDING_TO_FILTER;
            displayCmdBuffer[displayCmdBufferIndex++] = filterId;
            displayCmdBuffer[displayCmdBufferIndex++] = paddingTop;
            displayCmdBuffer[displayCmdBufferIndex++] = paddingBottom;
            displayCmdBuffer[displayCmdBufferIndex++] = paddingLeft;
            displayCmdBuffer[displayCmdBufferIndex++] = paddingRight;
            displayCmdBufferSize++;
        }

        public setMask(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_MASK;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }



        public static setValuesToBitmapData(value: egret.Texture): void {
            let bitmapData = value.bitmapData;
            if (!bitmapData.$bitmapDataId) {
                bitmapData.$bitmapDataId = bitmapDataId;
                bitmapDataMap[bitmapDataId] = bitmapData;
                bitmapDataId++;
            }
            if (!value.$textureId) {
                value.$textureId = bitmapDataId;

                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.CREATE_OBJECT;
                displayCmdBuffer[displayCmdBufferIndex++] = bitmapDataId;
                displayCmdBuffer[displayCmdBufferIndex++] = NativeObjectType.BITMAP_DATA;
                displayCmdBufferSize++;

                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_VALUES_TO_BITMAP_DATA;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$textureId;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$bitmapX;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$bitmapY;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$bitmapWidth;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$bitmapHeight;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$offsetX;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$offsetY;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$getTextureWidth();
                displayCmdBuffer[displayCmdBufferIndex++] = value.$getTextureHeight();
                displayCmdBuffer[displayCmdBufferIndex++] = value.$sourceWidth;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$sourceHeight;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$rotated ? 1 : 0;
                displayCmdBufferSize++;

                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_IMAGE_ID_TO_BITMAP_DATA;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$textureId;
                displayCmdBuffer[displayCmdBufferIndex++] = bitmapData.$bitmapDataId;
                displayCmdBufferSize++;

                bitmapDataId++;
            }
        }

        /**
         * for wasm native
         * @param private
         */
        public static setValuesToRenderBuffer(value: egret.sys.RenderBuffer): number {
            let texture;
            if ((<egret.web.WebGLRenderBuffer>value).rootRenderTarget) {
                texture = (<egret.web.WebGLRenderBuffer>value).rootRenderTarget.texture;
            }
            else if ((<egret.web.WebGLRenderBuffer>value)["texture"]) {
                texture = (<egret.web.WebGLRenderBuffer>value)["texture"];
            }
            else {
                texture = {};
                (<egret.web.WebGLRenderBuffer>value)["texture"] = texture;
            }
            if (!texture.$bitmapDataId) {
                texture["isTexture"] = true;
                texture.$bitmapDataId = bitmapDataId;
                bitmapDataMap[bitmapDataId] = texture;

                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.CREATE_OBJECT;
                displayCmdBuffer[displayCmdBufferIndex++] = texture.$bitmapDataId;
                displayCmdBuffer[displayCmdBufferIndex++] = 2;
                displayCmdBufferSize++;

                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_IMAGE_ID_TO_BITMAP_DATA;
                displayCmdBuffer[displayCmdBufferIndex++] = texture.$bitmapDataId;
                displayCmdBuffer[displayCmdBufferIndex++] = texture.$bitmapDataId;
                displayCmdBufferSize++;

                bitmapDataId++;

                (<egret.web.WebGLRenderBuffer>value).bufferIdForWasm = bitmapDataId;
            }
            return texture.$bitmapDataId;
        }

        public setBitmapData(value: egret.Texture): void {
            if (!value) {
                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_BITMAP_DATA;
                displayCmdBuffer[displayCmdBufferIndex++] = this.id;
                displayCmdBuffer[displayCmdBufferIndex++] = -1;
                displayCmdBufferSize++;
                return;
            }
            //todo lcj
            if ((<egret.RenderTexture>value).$renderBuffer) {
                let texture;
                if ((<egret.web.WebGLRenderBuffer>(<egret.RenderTexture>value).$renderBuffer).rootRenderTarget) {
                    texture = (<egret.web.WebGLRenderBuffer>(<egret.RenderTexture>value).$renderBuffer).rootRenderTarget.texture;
                }
                else if ((<egret.web.WebGLRenderBuffer>(<egret.RenderTexture>value).$renderBuffer)["texture"]) {
                    texture = (<egret.web.WebGLRenderBuffer>(<egret.RenderTexture>value).$renderBuffer)["texture"];
                }
                else {
                    texture = (<egret.web.CanvasRenderBuffer>(<egret.RenderTexture>value).$renderBuffer).surface;
                }

                if (!texture.$bitmapDataId) {
                    texture["isTexture"] = true;
                    texture.$bitmapDataId = bitmapDataId;
                    bitmapDataMap[bitmapDataId] = texture;

                    displayCmdBuffer[displayCmdBufferIndex++] = CommandType.CREATE_OBJECT;
                    displayCmdBuffer[displayCmdBufferIndex++] = texture.$bitmapDataId;
                    displayCmdBuffer[displayCmdBufferIndex++] = 2;
                    displayCmdBufferSize++;

                    displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_IMAGE_ID_TO_BITMAP_DATA;
                    displayCmdBuffer[displayCmdBufferIndex++] = texture.$bitmapDataId;
                    displayCmdBuffer[displayCmdBufferIndex++] = texture.$bitmapDataId;
                    displayCmdBufferSize++;

                    bitmapDataId++;
                }

                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_VALUES_TO_BITMAP_DATA;
                displayCmdBuffer[displayCmdBufferIndex++] = texture.$bitmapDataId;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$bitmapX;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$bitmapY;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$bitmapWidth;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$bitmapHeight;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$offsetY;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$offsetX;
                displayCmdBuffer[displayCmdBufferIndex++] = value.textureHeight;
                displayCmdBuffer[displayCmdBufferIndex++] = value.textureWidth;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$sourceWidth;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$sourceHeight;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$rotated ? 1 : 0;
                displayCmdBufferSize++;

                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_BITMAP_DATA;
                displayCmdBuffer[displayCmdBufferIndex++] = this.id;
                displayCmdBuffer[displayCmdBufferIndex++] = texture.$bitmapDataId;
                displayCmdBufferSize++;
            }
            else {
                NativeDisplayObject.setValuesToBitmapData(value);
                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_BITMAP_DATA;
                displayCmdBuffer[displayCmdBufferIndex++] = this.id;
                displayCmdBuffer[displayCmdBufferIndex++] = value.$textureId;
                displayCmdBufferSize++;
            }
        }

        public setBitmapDataToMesh(value: egret.Texture): void {
            if (!value) {
                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_MESH_BITMAP_DATA;
                displayCmdBuffer[displayCmdBufferIndex++] = this.id;
                displayCmdBuffer[displayCmdBufferIndex++] = -1;
                displayCmdBufferSize++;
                return;
            }

            NativeDisplayObject.setValuesToBitmapData(value);
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_MESH_BITMAP_DATA;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value.$textureId;
            displayCmdBufferSize++;
        }

        public setBitmapDataToParticle(value: egret.Texture): void {
            NativeDisplayObject.setValuesToBitmapData(value);
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_PARTICLE_BITMAP_DATA;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value.$textureId;
            displayCmdBufferSize++;
        }

        public setStopToParticle(value: boolean): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_PARTICLE_STOP;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value ? 1 : 0;
            displayCmdBufferSize++;
        }
        public setCustomData(config: any): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_CUSTOM_DATA;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            var len = config.length;

            displayCmdBuffer[displayCmdBufferIndex++] = config.length;
            for (var i = 0; i < config.length; i++) {
                displayCmdBuffer[displayCmdBufferIndex++] = config[i];
            }
            displayCmdBufferSize++;
        }


        public setWidth(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_WIDTH;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setHeight(value: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_HEIGHT;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setCacheAsBitmap(value: boolean): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_CACHE_AS_BITMAP;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value ? 1 : 0;
            displayCmdBufferSize++;
        }

        public setBitmapFillMode(fillMode: string): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_FILLMODE;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            let value = 0;
            if(fillMode == egret.BitmapFillMode.REPEAT) {
                value = 1;
            }
            else if(fillMode == egret.BitmapFillMode.CLIP) {
                value = 2;
            }
            displayCmdBuffer[displayCmdBufferIndex++] = value;
            displayCmdBufferSize++;
        }

        public setScale9Grid(x: number, y: number, w: number, h: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_SCALE_9_GRID;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = x;
            displayCmdBuffer[displayCmdBufferIndex++] = y;
            displayCmdBuffer[displayCmdBufferIndex++] = w;
            displayCmdBuffer[displayCmdBufferIndex++] = h;
            displayCmdBufferSize++;
        }

        public setMatrix(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_MATRIX;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = a;
            displayCmdBuffer[displayCmdBufferIndex++] = b;
            displayCmdBuffer[displayCmdBufferIndex++] = c;
            displayCmdBuffer[displayCmdBufferIndex++] = d;
            displayCmdBuffer[displayCmdBufferIndex++] = tx;
            displayCmdBuffer[displayCmdBufferIndex++] = ty;
            displayCmdBufferSize++;
        }

        public setIsTyping(value: boolean): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_ISTYPING;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = value ? 1 : 0;
            displayCmdBufferSize++;
        }

        public setTextRect(x: number, y: number, w: number, h: number): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_TEXT_RECT;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = x;
            displayCmdBuffer[displayCmdBufferIndex++] = y;
            displayCmdBuffer[displayCmdBufferIndex++] = w;
            displayCmdBuffer[displayCmdBufferIndex++] = h;
            displayCmdBufferSize++;
        }

        public setGraphicsRect(x: number, y: number, w: number, h: number, isSprite: boolean): void {
            if (isSprite) {
                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_SPRITE_GRAPHICS_RECT;
            }
            else {
                displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_GRAPHICS_RECT;
            }
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBuffer[displayCmdBufferIndex++] = x;
            displayCmdBuffer[displayCmdBufferIndex++] = y;
            displayCmdBuffer[displayCmdBufferIndex++] = w;
            displayCmdBuffer[displayCmdBufferIndex++] = h;
            displayCmdBufferSize++;
        }

        public setGraphicsRenderData(arr: Array<number>): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_GRAPHICS_RENDERDATA;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            let length = arr.length;
            displayCmdBuffer[displayCmdBufferIndex++] = length;
            for (let i = 0; i < length; i++) {
                displayCmdBuffer[displayCmdBufferIndex++] = arr[i];
            }
            displayCmdBufferSize++;
        }

        public setDataToBitmapNode(id: number, texture: egret.Texture, arr: number[]): void {
            NativeDisplayObject.setValuesToBitmapData(texture);
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_DATA_TO_BITMAP_NODE;
            displayCmdBuffer[displayCmdBufferIndex++] = id;
            displayCmdBuffer[displayCmdBufferIndex++] = texture.$bitmapData.$bitmapDataId;
            let length = arr.length;
            displayCmdBuffer[displayCmdBufferIndex++] = length / 10;
            for (let i = 0; i < length; i++) {
                displayCmdBuffer[displayCmdBufferIndex++] = arr[i];
            }
            displayCmdBufferSize++;
        }

        public setDataToMesh(vertexArr: number[], indiceArr: number[], uvArr: number[]): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_MESH_VERTICE_DATA;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            let length = vertexArr.length;
            displayCmdBuffer[displayCmdBufferIndex++] = length;
            for (let i = 0; i < length; i++) {
                displayCmdBuffer[displayCmdBufferIndex++] = vertexArr[i];
            }

            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_MESH_INDICES_DATA;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            length = indiceArr.length;
            displayCmdBuffer[displayCmdBufferIndex++] = length;
            for (let i = 0; i < length; i++) {
                displayCmdBuffer[displayCmdBufferIndex++] = indiceArr[i];
            }

            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_MESH_UVS_DATA;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            length = uvArr.length;
            displayCmdBuffer[displayCmdBufferIndex++] = length;
            for (let i = 0; i < length; i++) {
                displayCmdBuffer[displayCmdBufferIndex++] = uvArr[i];
            }

            displayCmdBufferSize += 3;
        }


        public static setDataToFilter(currFilter: egret.Filter): void {
            let id = currFilter.$id;
            let customArr = [];
            let filterType;
            if (!customFilterUniformMap[currFilter.$id]) {
                customFilterUniformMap[currFilter.$id] = [];
            }
            let currUniformArray = customFilterUniformMap[currFilter.$id];
            let vertexSrcStr = "";
            let fragmentSrcStr = "";
            if (currFilter.type == "custom") {
                vertexSrcStr = (<egret.CustomFilter>currFilter).$vertexSrc;
                fragmentSrcStr = (<egret.CustomFilter>currFilter).$fragmentSrc;
                filterType = FilterType.custom;
            }
            else if (currFilter.type == "colorTransform") {
                filterType = FilterType.colorTransform;
            }
            else if (currFilter.type == "blur") {
                filterType = FilterType.blur;
            }
            else if (currFilter.type == "glow") {
                filterType = FilterType.glow;
            }
            let uniformsStrVal = "";
            let uniformCustomId = 0;
            let uniforms = currFilter.$uniforms;
            for (let key in uniforms) {
                uniformsStrVal += key;
                uniformsStrVal += " ";
                currUniformArray[uniformCustomId] = key;
                uniformCustomId++;
            }

            customFilterDataMap[currFilter.$id] = {
                vertexSrc: vertexSrcStr,
                fragmentSrc: fragmentSrcStr,
                uniformsSrc: uniformsStrVal
            };

            for (let i = 0; i < currUniformArray.length; i++) {
                let uniformdata = uniforms[currUniformArray[i]];
                let tempType = typeof uniformdata;
                if (tempType == "number") {
                    customArr.push(1);
                    customArr.push(uniformdata);
                }
                else if (uniformdata instanceof (Array)) {
                    customArr.push(uniformdata.length);
                    for (let j = 0; j < uniformdata.length; j++) {
                        customArr.push(uniformdata[j]);
                    }
                }
                else if (tempType == "object") {
                    customArr.push(1);
                    let objectNum = 1;
                    if (uniformdata.x !== null && uniformdata.x !== undefined) {
                        //  || uniformdata.x !== uniformdata.x) {
                        objectNum++;
                        customArr.push(uniformdata.x);
                    }
                    if (uniformdata.y !== null && uniformdata.y !== undefined) {
                        objectNum++;
                        customArr.push(uniformdata.y);
                    }
                    if (uniformdata.z !== null && uniformdata.z !== undefined) {
                        objectNum++;
                        customArr.push(uniformdata.z);
                    }
                    if (uniformdata.w !== null && uniformdata.w !== undefined) {
                        objectNum++;
                        customArr.push(uniformdata.w);
                    }
                    customArr[customArr.length - objectNum] = objectNum - 1;
                }
            }

            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_DATA_TO_FILTER;
            displayCmdBuffer[displayCmdBufferIndex++] = id;
            displayCmdBuffer[displayCmdBufferIndex++] = filterType;
            let length = customArr.length;
            displayCmdBuffer[displayCmdBufferIndex++] = length;
            for (let i = 0; i < length; i++) {
                displayCmdBuffer[displayCmdBufferIndex++] = customArr[i];
            }
            displayCmdBufferSize++;
        }

        public setDataToTextField(id: number, arr: number[]): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.SET_DATA_TO_TEXTFIELD;
            displayCmdBuffer[displayCmdBufferIndex++] = id;
            let length = arr.length;
            displayCmdBuffer[displayCmdBufferIndex++] = length;
            for (let i = 0; i < length; i++) {
                displayCmdBuffer[displayCmdBufferIndex++] = arr[i];
            }
            displayCmdBufferSize++;
        }

        public disposeDisplayObject(): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.DISPOSE_DISPLAY_OBJECT;
            displayCmdBuffer[displayCmdBufferIndex++] = this.id;
            displayCmdBufferSize++;
        }

        public static disposeTexture(texture: egret.Texture): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.DISPOSE_BITMAP_DATA;
            displayCmdBuffer[displayCmdBufferIndex++] = texture.$textureId;
            displayCmdBufferSize++;
        }

        public static disposeBitmapData(bitmapData: egret.BitmapData): void {
            if (bitmapData.$bitmapDataId) {
                delete bitmapDataMap[bitmapData.$bitmapDataId];
            }
        }

        public static disposeTextData(node: egret.TextField): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.DISPOSE_TEXT_DATA;
            displayCmdBuffer[displayCmdBufferIndex++] = node.$nativeDisplayObject.id;
            displayCmdBufferSize++;
        }

        public static disposeGraphicData(graphic: egret.Graphics): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.DISPOSE_GRAPHICS_DATA;
            displayCmdBuffer[displayCmdBufferIndex++] = graphic.$targetDisplay.$nativeDisplayObject.id;
            displayCmdBufferSize++;
        }

        public static disposeFilter(filter: egret.Filter): void {
            displayCmdBuffer[displayCmdBufferIndex++] = CommandType.DISPOSE_FILTER;
            displayCmdBuffer[displayCmdBufferIndex++] = filter.$id;
            displayCmdBufferSize++;
        }
    }
}