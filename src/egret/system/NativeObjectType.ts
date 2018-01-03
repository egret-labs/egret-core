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

/**
 * @private
 */
namespace egret_native {
    /**
     * @private
     */
    export const enum NativeObjectType {
        /**
         * 容器
         */
        CONTAINER = 0,
        /**
         * 位图
         */
        BITMAP = 1,
        /**
         * 位图数据
         */
        BITMAP_DATA = 2,
        // COLOR_MATRIX_FILTER = 3,
        // BLUR_FILTER = 4,
        // GLOW_FILTER = 5,
        /**
         * 滤镜
         */
        FILTER = 6,
        /**
         * 文本
         */
        TEXT = 7,
        /**
         * 矢量绘图
         */
        GRAPHICS = 8,
        /**
         * 含一个适量绘图的容器
         */
        SPRITE = 9,
        /**
         * 粒子系统
         */
        PARTICLE_SYSTEM = 10,
        /**
         * 位图文本
         */
        BITMAP_TEXT = 11,
        /**
         * 网格
         */
        MESH = 12,
        /**
         * 舞台（根容器）
         */
        STAGE = 13
    }
}