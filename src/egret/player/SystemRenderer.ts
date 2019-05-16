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
     */
    export let systemRenderer: SystemRenderer;
    /**
     * @private
     * 用于碰撞检测绘制
     */
    export let canvasRenderer: SystemRenderer;
    /**
     * @private
     * 显示渲染器接口
     */
    export interface SystemRenderer {

        /**
         * 渲染一个显示对象
         * @param displayObject 要渲染的显示对象
         * @param buffer 渲染缓冲
         * @param matrix 要叠加的矩阵
         * @param forRenderTexture 绘制目标是RenderTexture的标志
         * @returns drawCall触发绘制的次数
         */
        render(displayObject: DisplayObject, buffer: RenderBuffer, matrix: Matrix, forRenderTexture?: boolean): number;
        /**
         * 将一个RenderNode对象绘制到渲染缓冲
         * @param node 要绘制的节点
         * @param buffer 渲染缓冲
         * @param matrix 要叠加的矩阵
         * @param forHitTest 绘制结果是用于碰撞检测。若为true，当渲染GraphicsNode时，会忽略透明度样式设置，全都绘制为不透明的。
         */
        drawNodeToBuffer(node: sys.RenderNode, buffer: RenderBuffer, matrix: Matrix, forHitTest?: boolean): void;
    }
    /**
     * 
     */
    export interface RenderContext {

    }
    /**
     * 创建一个canvas。
     */
    export function mainCanvas(width?: number, height?: number): HTMLCanvasElement {
        console.error(`empty sys.mainCanvas = ${width}, ${height}`);
        return null;
    }

    export function createCanvas(width?: number, height?: number): HTMLCanvasElement {
        console.error(`empty sys.createCanvas = ${width}, ${height}`);
        return null;
    }
    /**
    * 重新设置主canvas的大小
    */
    export function resizeContext(renderContext: RenderContext, width: number, height: number, useMaxSize?: boolean): void {
        console.error(`empty sys.resizeContext = ${renderContext}, ${width}, ${height}, ${useMaxSize}`);
    }
    /**
    * 获得系统的渲染运行时
    */
    export function getContextWebGL(surface: HTMLCanvasElement): WebGLRenderingContext {
        console.error(`empty sys.getContextWebGL = ${surface}`);
        return null;
    }

    export function getContext2d(surface: HTMLCanvasElement): CanvasRenderingContext2D {
        console.error(`empty sys.getContext2d = ${surface}`);
        return null;
    }

    /**
    * 重新设置主canvas的大小
    */
    export function createTexture(renderContext: RenderContext, bitmapData: BitmapData | HTMLCanvasElement): WebGLTexture {
        console.error(`empty sys.createTexture = ${bitmapData}`);
        return null;
    }

    /**
     * 画texture
     **/
    export function drawTextureElements(renderContext: RenderContext, data: any, offset: number): number {
        console.error(`empty sys.drawTextureElements = ${renderContext}, ${data}, ${offset}`);
        return 0;
    }
}