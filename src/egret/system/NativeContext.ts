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
namespace egret {
    //todo remove
    /**
     * @private
     */
    export let fontMapping = {};
}
/**
 * @private
 */
declare namespace egret_native {

    function readUpdateFileSync(filePath):any;
    function readResourceFileSync(filePath):any;

    function sendInfoToPlugin(info: string): void;

    function receivedPluginInfo(info: string): void;

    function nrInit(): void;
    function nrDownloadBuffers(callback: (displayCmdBuffer: Float32Array) => void): void;
    function nrSetRenderMode(mode: number): void;
    function nrRenderDisplayObject(id: number, scale: number, useClip: boolean, clipX: number, clipY: number, clipW: number, clipH: number): void;
    function nrRenderDisplayObject2(id: number, offsetX: number, offsetY: number, forHitTest: boolean): void;
    function nrLocalToGlobal(id: number, localX: number, localY: number): string;
    function nrGlobalToLocal(id: number, globalX: number, globalY: number): string;
    function nrGetTextFieldWidth(id: number): number;
    function nrGetTextFieldHeight(id: number): number;
    function nrGetTextWidth(id: number): number;
    function nrGetTextHeight(id: number): number;
    function nrResize(width: number, height: number): void;
    function nrSetCanvasScaleFactor(factor: number, scalex: number, scaley: number): void;
    function nrUpdate(): void;
    function nrRender(): void;
    function nrSendTextFieldData(textFieldId: number, strData: string): void;
    function nrUpdateCallbackList(dt: number): void;
    function nrActiveBuffer(id: number, width: number, height: number): void;
    function nrGetPixels(x: number, y: number, width: number, height: number, pixels: Uint8Array): void;

    class NrNode {
        constructor(id: number, type: number)
    }
}

/**
 * @private
 */
declare namespace egret_native {
    let rootWebGLBuffer: egret.sys.RenderBuffer;
    let forHitTest: boolean;
    let addModuleCallback: (callback: Function, thisObj: any) => void;
    let initNativeRender: () => void;
    let updateNativeRender: () => void;
    let activateBuffer: (buffer: egret.sys.RenderBuffer) => void;
    let getJsCustomFilterVertexSrc: (key: any) => any;
    let getJsCustomFilterFragSrc: (key: any) => any;
    let getJsCustomFilterUniforms: (key: any) => any;
    let nrABIVersion: number;
    let nrMinEgretVersion: string;
}
declare namespace egret_native {
    /**
     * @private
     */
    class NativeRenderSurface {
        width: number;
        height: number;
        constructor(currRenderBuffer: any, w?: number, h?: number, root?: boolean);
        resize(w: number, h: number): void;
    }
    /**
     * @private
     */
    class NativeDisplayObject {
        id: number;
        constructor(type: number);
        addChildAt(childId: number, index: number): void;
        removeChild(childId: number): void;
        swapChild(index1: number, index2: number): void;
        setX(value: number): void;
        setY(value: number): void;
        setRotation(value: number): void;
        setScaleX(value: number): void;
        setScaleY(value: number): void;
        setSkewX(value: number): void;
        setSkewY(value: number): void;
        setAlpha(value: number): void;
        setAnchorOffsetX(value: number): void;
        setAnchorOffsetY(value: number): void;
        setVisible(value: boolean): void;
        setBlendMode(value: number): void;
        setMaskRect(x: number, y: number, w: number, h: number): void;
        setScrollRect(x: number, y: number, w: number, h: number): void;
        setFilters(filters: Array<egret.Filter>): void;
        static createFilter(filter: egret.Filter): void;
        static setFilterPadding(filterId: number, paddingTop: number, paddingBottom: number, paddingLeft: number, paddingRight: number): void;
        setMask(value: number): void;
        setBitmapData(value: egret.Texture): void;
        setBitmapDataToMesh(value: egret.Texture): void;
        setBitmapDataToParticle(value: egret.Texture): void;
        setStopToParticle(value: boolean): void;
        setCustomData(config: any): void;
        setWidth(value: number): void;
        setHeight(value: number): void;
        setCacheAsBitmap(value: boolean): void;
        setBitmapFillMode(fillMode: string): void;
        setScale9Grid(x: number, y: number, w: number, h: number): void;
        setMatrix(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        setIsTyping(value: boolean): void;
        setDataToBitmapNode(id: number, texture: egret.Texture, arr: number[]): void;
        setDataToMesh(vertexArr: number[], indiceArr: number[], uvArr: number[]): void;
        static setDataToFilter(currFilter: egret.Filter): void;
        static disposeTexture(texture: egret.Texture): void;
        static disposeBitmapData(bitmapData: egret.BitmapData): void;
        static disposeTextData(node: egret.TextField): void;
        static disposeGraphicData(graphic: egret.Graphics): void;
        setFontSize(value: number): void;
        setLineSpacing(value: number): void;
        setTextColor(value: number): void;
        setTextFieldWidth(value: number): void;
        setTextFieldHeight(value: number): void;
        setFontFamily(value: string): void;
        setTextFlow(textArr: Array<egret.ITextElement>): void;
        setTextAlign(value: string): void;
        setVerticalAlign(value: string): void;
        setText(value: string): void;
        setBold(value: boolean): void;
        setItalic(value: boolean): void;
        setWordWrap(value: boolean): void;
        setMaxChars(value: number): void;
        setType(value: string): void;
        setStrokeColor(value: number): void;
        setStroke(value: number): void;
        setScrollV(value: number): void;
        setMultiline(value: boolean): void;
        setBorder(value: boolean): void;
        setBorderColor(value: number): void;
        setBackground(value: boolean): void;
        setBackgroundColor(value: number): void;
        setInputType(value: string): void;
        setBeginFill(color: number, alpha?: number): void;
        setBeginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix: egret.Matrix): void;
        setEndFill(): void;
        setLineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number, lineDash?: number[]): void;
        setDrawRect(x: number, y: number, width: number, height: number): void;
        setDrawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        setDrawCircle(x: number, y: number, radius: number): void;
        setDrawEllipse(x: number, y: number, width: number, height: number): void;
        setMoveTo(x: number, y: number): void;
        setLineTo(x: number, y: number): void;
        setCurveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        setCubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        setDrawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        setGraphicsClear(): void;
    }
}
/**
 * @private
 */
declare namespace egret_native {
    /**
     * @private
     */
    const enum NativeObjectType {
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
        STAGE = 13,
    }
}
