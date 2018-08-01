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
     * draw类型，所有的绘图操作都会缓存在drawData中，每个drawData都是一个drawable对象
     * $renderWebGL方法依据drawable对象的类型，调用不同的绘制方法
     */
    //for 3D&2D
    //2D与3D的DRAWABLE_TYPE有区别，且3D是写死的
    //暂时不要更改
    export const enum DRAWABLE_TYPE {
        TEXTURE = 0,
        PUSH_MASK = 1,
        POP_MASK = 2,
        BLEND = 3,
        RESIZE_TARGET = 4,
        CLEAR_COLOR = 5,
        ACT_BUFFER = 6,
        ENABLE_SCISSOR = 7,
        DISABLE_SCISSOR = 8,
        SMOOTHING = 9,
        CHANGE_PROGRAM = 10
    }


    /**
     * @private
     * 绘制指令管理器
     * 用来维护drawData数组
     */
    export class WebGLDrawCmdManager {

        /**
         * 用于缓存绘制命令的数组
         */
        public drawData = {};

        private lastDrawTextureData: any;

        private lastProgramKey: string;

        public drawDataLen = 0;

        public constructor() {

        }

        /**
         * 压入绘制texture指令
         */
        public pushDrawTexture(texture: any, count: number = 2, filter?: egret.Filter, textureWidth?: number, textureHeight?: number): void {
            if (filter) {
                //根据filter压入切换program
                let programeKey = filter.type;
                if (this.lastProgramKey !== programeKey) {
                    this.pushChangeProgram(programeKey, filter);
                }
                // 目前有滤镜的情况下不会合并绘制
                let data = this.drawData[this.drawDataLen] || {};
                data.type = DRAWABLE_TYPE.TEXTURE;
                data.texture = texture;
                data.count = count;
                data.textureWidth = textureWidth;
                data.textureHeight = textureHeight;
                data.filter = filter;
                if (filter.$uniforms) {
                    if (filter.$uniforms.uGlobalMatrix === null) {
                        const context = WebGLRenderContext.getInstance();
                        const buffer = context["currentBuffer"];
                        const globalMatrix = buffer.globalMatrix;
                        const m = Matrix.create();
                        m.copyFrom(globalMatrix);
                        m.append(1, 0, 0, 1, buffer.$offsetX, buffer.$offsetY);
                        data.a = m.a;
                        data.b = m.b;
                        data.c = m.c;
                        data.d = m.d;
                        data.tx = m.tx;
                        data.ty = m.ty;
                        Matrix.release(m);
                    }
                    if (filter.$uniforms.uGlobalAlpha === null) {
                        const context = WebGLRenderContext.getInstance();
                        const globalAlpha = context["currentBuffer"].globalAlpha;
                        data.alpha = globalAlpha;
                    }
                }
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
                this.lastDrawTextureData = null;
            } else {
                if (this.lastDrawTextureData == null || texture != this.lastDrawTextureData.texture) {
                    if (this.lastProgramKey !== "texture") {
                        this.pushChangeProgram("texture");
                    }
                    let data = this.drawData[this.drawDataLen] || {};
                    data.type = DRAWABLE_TYPE.TEXTURE;
                    data.texture = texture;
                    data.count = 0;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                    this.lastDrawTextureData = data;
                }

                this.drawData[this.drawDataLen - 1].count += count;

            }
        }

        public pushChangeSmoothing(texture: WebGLTexture, smoothing: boolean): void {
            texture["smoothing"] = smoothing;
            let data = this.drawData[this.drawDataLen] || {};
            data.type = DRAWABLE_TYPE.SMOOTHING;
            data.texture = texture;
            data.smoothing = smoothing;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }

        /**
         * 压入pushMask指令
         */
        public pushPushMask(count: number = 1): void {
            if (this.lastProgramKey !== "primitive") {
                this.pushChangeProgram("primitive");
            }
            let data = this.drawData[this.drawDataLen] || {};
            data.type = DRAWABLE_TYPE.PUSH_MASK;
            data.count = count * 2;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }

        /**
         * 压入popMask指令
         */
        public pushPopMask(count: number = 1): void {
            if (this.lastProgramKey !== "primitive") {
                this.pushChangeProgram("primitive");
            }
            let data = this.drawData[this.drawDataLen] || {};
            data.type = DRAWABLE_TYPE.POP_MASK;
            data.count = count * 2;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }

        /**
         * 压入混色指令
         */
        public pushSetBlend(value: string): void {
            let len = this.drawDataLen;
            // 有无遍历到有效绘图操作
            let drawState = false;
            for (let i = len - 1; i >= 0; i--) {
                let data = this.drawData[i];

                if (data) {
                    if (data.type == DRAWABLE_TYPE.TEXTURE) {
                        drawState = true;
                    }

                    // 如果与上一次blend操作之间无有效绘图，上一次操作无效
                    if (!drawState && data.type == DRAWABLE_TYPE.BLEND) {
                        delete this.drawData[i];
                        continue;
                    }

                    // 如果与上一次blend操作重复，本次操作无效
                    if (data.type == DRAWABLE_TYPE.BLEND) {
                        if (data.value == value) {
                            return;
                        } else {
                            break;
                        }
                    }
                }
            }

            let _data = this.drawData[this.drawDataLen] || {};
            _data.type = DRAWABLE_TYPE.BLEND;
            _data.value = value;
            this.drawData[this.drawDataLen] = _data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }

        /*
         * 压入resize render target命令
         */
        public pushResize(buffer: WebGLRenderBuffer, width: number, height: number) {
            let data = this.drawData[this.drawDataLen] || {};
            data.type = DRAWABLE_TYPE.RESIZE_TARGET;
            data.buffer = buffer;
            data.width = width;
            data.height = height;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }

        /*
         * 压入clear color命令
         */
        public pushClearColor() {
            let data = this.drawData[this.drawDataLen] || {};
            data.type = DRAWABLE_TYPE.CLEAR_COLOR;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }

        /**
         * 压入激活buffer命令
         */
        public pushActivateBuffer(buffer: WebGLRenderBuffer) {
            let len = this.drawDataLen;
            // 有无遍历到有效绘图操作
            let drawState = false;
            for (let i = len - 1; i >= 0; i--) {
                let data = this.drawData[i];

                if (data) {
                    if (data.type != DRAWABLE_TYPE.BLEND && data.type != DRAWABLE_TYPE.ACT_BUFFER) {
                        drawState = true;
                    }

                    // 如果与上一次buffer操作之间无有效绘图，上一次操作无效
                    if (!drawState && data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                        delete this.drawData[i];
                        continue;
                    }

                    // 如果与上一次buffer操作重复，本次操作无效
                    // if(data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                    //     if(data.buffer == buffer) {
                    //         return;
                    //     } else {
                    //         break;
                    //     }
                    // }
                }
            }

            let _data = this.drawData[this.drawDataLen] || {};
            _data.type = DRAWABLE_TYPE.ACT_BUFFER;
            _data.buffer = buffer;
            _data.width = buffer.rootRenderTarget.width;
            _data.height = buffer.rootRenderTarget.height;
            this.drawData[this.drawDataLen] = _data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }

        /*
         * 压入enabel scissor命令
         */
        public pushEnableScissor(x: number, y: number, width: number, height: number) {
            let data = this.drawData[this.drawDataLen] || {};
            data.type = DRAWABLE_TYPE.ENABLE_SCISSOR;
            data.x = x;
            data.y = y;
            data.width = width;
            data.height = height;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }

        /*
         * 压入disable scissor命令
         */
        public pushDisableScissor() {
            let data = this.drawData[this.drawDataLen] || {};
            data.type = DRAWABLE_TYPE.DISABLE_SCISSOR;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }

        /**
         * 清空命令数组
         */
        public clear(): void {
            for (let i = 0; i < this.drawDataLen; i++) {
                let data = this.drawData[i];
                if (!data)
                    continue;
                data.type = 0;
                data.count = 0;
                data.texture = null;
                data.filter = null;
                data.uv = null;
                data.value = "";
                data.buffer = null;
                data.width = 0;
                data.height = 0;
                data.vertSource = null;
                data.fragSource = null;
                data.key = null;
                data.alpha = null;
                data.a = null;
                data.b = null;
                data.c = null;
                data.d = null;
                data.tx = null;
                data.ty = null;
            }
            this.drawDataLen = 0;
            this.lastDrawTextureData = null;
            this.lastProgramKey = null;
        }


        /**
         * 压入切换shader programe命令
         */
        public pushChangeProgram(type: string, filter?: egret.Filter): void {
            let key: string;
            let vertSource: string = EgretShaderLib.default_vert;
            let fragSource: string = EgretShaderLib.blur_frag;
            if (type === "texture") {
                key = "texture";
                fragSource = EgretShaderLib.texture_frag;
            } else if (type === "custom") {
                key = (filter as egret.CustomFilter).$shaderKey;
                vertSource = (filter as egret.CustomFilter).$vertexSrc;
                fragSource = (filter as egret.CustomFilter).$fragmentSrc;
            } else if (type === "colorTransform") {
                key = "colorTransform";
                fragSource = EgretShaderLib.colorTransform_frag
            } else if (type === "blurX" || type === "blurY") {
                key = "blur";
            } else if (type === "glow") {
                key = "glow";
                fragSource = EgretShaderLib.glow_frag;
            } else if (type === "primitive") {
                key = "primitive";
                fragSource = EgretShaderLib.primitive_frag;
                vertSource = EgretShaderLib.default_vert;
            }
            //记录上一次的Programe类型
            this.lastProgramKey = key;
            let data = this.drawData[this.drawDataLen] || {};
            data.type = DRAWABLE_TYPE.CHANGE_PROGRAM;
            data.key = key;
            data.vertSource = vertSource;
            data.fragSource = fragSource;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
            this.lastDrawTextureData = null;
        }
    }
}
