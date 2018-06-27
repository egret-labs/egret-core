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

namespace egret.sys {
    /**
     * @private
     * 共享的用于碰撞检测的渲染缓冲
     */
    export let customHitTestBuffer:sys.RenderBuffer;
    /**
     * @private
     * 共享的用于canvas碰撞检测的渲染缓冲
     */
    export let canvasHitTestBuffer:sys.RenderBuffer;
    /**
     * @private
     * 渲染缓冲
     */
    export interface RenderBuffer {
        /**
         * 呈现最终绘图结果的画布。
         * @readOnly
         */
        surface:any;

        /**
         * 渲染上下文。
         * @readOnly
         */
        context:any;

        /**
         * 渲染缓冲的宽度，以像素为单位。
         * @readOnly
         */
        width: number;

        /**
         * 渲染缓冲的高度，以像素为单位。
         * @readOnly
         */
        height: number;

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        resize(width:number,height:number,useMaxSize?:boolean):void;

        /**
         * 获取指定区域的像素
         */
        getPixels(x:number,y:number,width?:number,height?:number):number[];

        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        toDataURL(type?: string, ...args: any[]): string;

        /**
         * 清空缓冲区数据
         */
        clear():void;

        /**
         * 销毁渲染缓冲
         */
        destroy():void;
    }

    /**
     * @private
     */
    export let RenderBuffer:{
        /**
         * 创建一个RenderTarget。
         * 注意：若内存不足或创建缓冲区失败，将会抛出错误异常。
         * @param width 渲染缓冲的初始宽
         * @param height 渲染缓冲的初始高
         * @param root 是否为舞台buffer
         */
        new(width?:number, height?:number, root?:boolean):RenderBuffer;
    };

    /**
     * @private
     */
    export let CanvasRenderBuffer:{
        /**
         * 创建一个CanvasRenderBuffer。
         * 注意：若内存不足或创建缓冲区失败，将会抛出错误异常。
         * @param width 渲染缓冲的初始宽
         * @param height 渲染缓冲的初始高
         */
        new(width?:number, height?:number):RenderBuffer;
    };
}
