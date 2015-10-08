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

/**
 * @private
 */
interface PlayerOption {
    /**
     * 入口类完整类名
     */
    entryClassName?:string;
    /**
     * 默认帧率
     */
    frameRate?:number;
    /**
     * 屏幕适配模式
     */
    scaleMode?:string;
    /**
     * 初始内容宽度
     */
    contentWidth?:number;
    /**
     * 初始内容高度
     */
    contentHeight?:number;
    /**
     * 屏幕方向
     */
    orientation?:string;
    /**
     * 是否显示重绘区域
     */
    showPaintRect?:boolean;
    /**
     * 显示FPS
     */
    showFPS?:boolean;
    /**
     *
     */
    fpsStyles?:Object;
    /**
     * 显示日志
     */
    showLog?:boolean;
    /**
     * 过滤日志的正则表达式
     */
    logFilter?:string;
    /**
     *
     */
    maxTouches?:number;
    /**
     *
     */
    textureScaleFactor?:number;
}