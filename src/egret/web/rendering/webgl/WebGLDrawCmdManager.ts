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
     * draw类型，所有的绘图操作都会缓存在drawData中，每个drawData都是一个drawable对象
     * $renderWebGL方法依据drawable对象的类型，调用不同的绘制方法
     */
    export const enum DRAWABLE_TYPE {
        TEXTURE,
        RECT,
        PUSH_MASK,
        POP_MASK,
        BLEND,
        RESIZE_TARGET,
        CLEAR_COLOR,
        ACT_BUFFER
    }

    /**
     * 绘制指令的对象池
     */
    var renderCmdPool = [];

    /**
     * 绘制指令
     */
    class RenderCMD {
        public type;
        public count;
        public texture;
        public filter;
        public uv;
        public value;
        public buffer;
        public width;
        public height;

        public static create():RenderCMD {
            return renderCmdPool.pop() || new RenderCMD();
        }

        public static release(renderCMD:RenderCMD) {
            renderCMD.type = 0;
            renderCMD.count = 0;
            renderCMD.texture = null;
            renderCMD.filter = null;
            renderCMD.uv = null;
            renderCMD.value = "";
            renderCMD.buffer = null;
            renderCMD.width = 0;
            renderCMD.height = 0;
            renderCmdPool.push(renderCMD);
        }
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
        public drawData = [];

        public constructor() {

        }

        /**
         * 压入绘制矩形指令
         */
        public pushDrawRect():void {
            if(this.drawData.length == 0 || this.drawData[this.drawData.length - 1].type != DRAWABLE_TYPE.RECT) {
                var data = RenderCMD.create();
                data.type = DRAWABLE_TYPE.RECT;
                data.count = 0;
                this.drawData.push(data);
            }
            this.drawData[this.drawData.length - 1].count += 2;
        }

        /**
         * 压入绘制texture指令
         */
        public pushDrawTexture(texture:any, count:number = 2, filter?:any, uv?:any):void {
            if(filter) {
                // 目前有滤镜的情况下不会合并绘制
                var data = RenderCMD.create();
                data.type = DRAWABLE_TYPE.TEXTURE;
                data.texture = texture;
                data.filter = filter;
                data.count = count;
                data.uv = uv;
                this.drawData.push(data);
            } else {

                if (this.drawData.length == 0 || this.drawData[this.drawData.length - 1].type != DRAWABLE_TYPE.TEXTURE || texture != this.drawData[this.drawData.length - 1].texture || this.drawData[this.drawData.length - 1].filter) {
                    var data = RenderCMD.create();
                    data.type = DRAWABLE_TYPE.TEXTURE;
                    data.texture = texture;
                    data.count = 0;
                    this.drawData.push(data);
                }
                this.drawData[this.drawData.length - 1].count += count;

            }

        }

        /**
         * 压入pushMask指令
         */
        public pushPushMask(count:number = 1):void {
            var data = RenderCMD.create();
            data.type = DRAWABLE_TYPE.PUSH_MASK;
            data.count = count * 2;
            this.drawData.push(data);
        }

        /**
         * 压入popMask指令
         */
        public pushPopMask(count:number = 1):void {
            var data = RenderCMD.create();
            data.type = DRAWABLE_TYPE.POP_MASK;
            data.count = count * 2;
            this.drawData.push(data);
        }

        /**
         * 压入混色指令
         */
        public pushSetBlend(value:string):void {
            var len = this.drawData.length;
            // 有无遍历到有效绘图操作
            var drawState = false;
            for(var i = len - 1; i >= 0; i--) {
                var data = this.drawData[i];

                if(data){
                    if(data.type == DRAWABLE_TYPE.TEXTURE || data.type == DRAWABLE_TYPE.RECT) {
                        drawState = true;
                    }

                    // 如果与上一次blend操作之间无有效绘图，上一次操作无效
                    if(!drawState && data.type == DRAWABLE_TYPE.BLEND) {
                        this.drawData.splice(i, 1);
                        continue;
                    }

                    // 如果与上一次blend操作重复，本次操作无效
                    if(data.type == DRAWABLE_TYPE.BLEND) {
                        if(data.value == value) {
                            return;
                        } else {
                            break;
                        }
                    }
                }
            }

            var _data = RenderCMD.create();
            _data.type = DRAWABLE_TYPE.BLEND;
            _data.value = value;
            this.drawData.push(_data);
        }

        /*
         * 压入resize render target命令
         */
        public pushResize(buffer:WebGLRenderBuffer, width:number, height:number) {
            var data = RenderCMD.create();
            data.type = DRAWABLE_TYPE.RESIZE_TARGET;
            data.buffer = buffer;
            data.width = width;
            data.height = height;
            this.drawData.push(data);
        }

        /*
         * 压入clear color命令
         */
        public pushClearColor() {
            var data = RenderCMD.create();
            data.type = DRAWABLE_TYPE.CLEAR_COLOR;
            this.drawData.push(data);
        }

        /**
         * 压入激活buffer命令
         */
        public pushActivateBuffer(buffer) {
            var len = this.drawData.length;
            // 有无遍历到有效绘图操作
            var drawState = false;
            for(var i = len - 1; i >= 0; i--) {
                var data = this.drawData[i];

                if(data){
                    if(data.type != DRAWABLE_TYPE.BLEND && data.type != DRAWABLE_TYPE.ACT_BUFFER) {
                        drawState = true;
                    }

                    // 如果与上一次buffer操作之间无有效绘图，上一次操作无效
                    if(!drawState && data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                        this.drawData.splice(i, 1);
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

            var _data = RenderCMD.create();
            _data.type = DRAWABLE_TYPE.ACT_BUFFER;
            _data.buffer = buffer;
            _data.width = buffer.$getWidth();
            _data.height = buffer.$getHeight();
            this.drawData.push(_data);
        }

        /**
         * 清空命令数组
         */
        public clear():void {
            for(var i = 0; i < this.drawData.length; i++) {
                var data = this.drawData[i];

                RenderCMD.release(data);
            }

            this.drawData.length = 0;
        }

    }
}
