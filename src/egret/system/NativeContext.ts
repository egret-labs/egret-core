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
    function nrGetCustomImageId(type: number): number;
    function nrSetCustomImageData(customImageId: number, pvrtcData, width, height, mipmapsCount, format): void;

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
    class NativeBitmapData {
        public $init();
        public $id;
    }
    /**
     * @private
     */
    class NativeDisplayObject {
        id: number;
        constructor(type: number);
        public addChildAt(childId: number, index: number): void;
        public removeChild(childId: number): void;
        public swapChild(index1: number, index2: number): void;
        public setX(value: number): void;
        public setY(value: number): void;
        public setRotation(value: number): void;
        public setScaleX(value: number): void;
        public setScaleY(value: number): void;
        public setSkewX(value: number): void;
        public setSkewY(value: number): void;
        public setAlpha(value: number): void;
        public setAnchorOffsetX(value: number): void;
        public setAnchorOffsetY(value: number): void;
        public setVisible(value: boolean): void;
        public setBlendMode(value: number): void;
        public setMaskRect(x: number, y: number, w: number, h: number): void;
        public setScrollRect(x: number, y: number, w: number, h: number): void;
        public setFilters(filters: Array<egret.Filter>): void;
        public static createFilter(filter: egret.Filter): void;
        public static setFilterPadding(filterId: number, paddingTop: number, paddingBottom: number, paddingLeft: number, paddingRight: number): void;
        public setMask(value: number): void;
        public static setSourceToNativeBitmapData(nativeBitmapData: egret_native.NativeBitmapData, source: any);
        public setTexture(texture: egret.Texture): void;
        public setBitmapDataToMesh(texture: egret.Texture): void;
        public setBitmapDataToParticle(texture: egret.Texture): void;
        public setWidth(value: number): void;
        public setHeight(value: number): void;
        public setCacheAsBitmap(value: boolean): void;
        public setBitmapFillMode(fillMode: string): void;
        public setScale9Grid(x: number, y: number, w: number, h: number): void;
        public setMatrix(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        public setIsTyping(value: boolean): void;
        public setDataToBitmapNode(id: number, texture: egret.Texture, arr: number[]): void;
        public setDataToMesh(vertexArr: number[], indiceArr: number[], uvArr: number[]): void;
        public static setDataToFilter(currFilter: egret.Filter): void;
        public static disposeNativeBitmapData(nativeBitmapData: egret_native.NativeBitmapData): void;
        public static disposeTextData(node: egret.TextField): void;
        public static disposeGraphicData(graphic: egret.Graphics): void;
        public setFontSize(value: number): void;
        public setLineSpacing(value: number): void;
        public setTextColor(value: number): void;
        public setTextFieldWidth(value: number): void;
        public setTextFieldHeight(value: number): void;
        public setFontFamily(value: string): void;
        public setTextFlow(textArr: Array<egret.ITextElement>): void;
        public setTextAlign(value: string): void;
        public setVerticalAlign(value: string): void;
        public setText(value: string): void;
        public setBold(value: boolean): void;
        public setItalic(value: boolean): void;
        public setWordWrap(value: boolean): void;
        public setMaxChars(value: number): void;
        public setType(value: string): void;
        public setStrokeColor(value: number): void;
        public setStroke(value: number): void;
        public setScrollV(value: number): void;
        public setMultiline(value: boolean): void;
        public setBorder(value: boolean): void;
        public setBorderColor(value: number): void;
        public setBackground(value: boolean): void;
        public setBackgroundColor(value: number): void;
        public setInputType(value: string): void;
        public setBeginFill(color: number, alpha?: number): void;
        public setBeginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix: egret.Matrix): void;
        public setEndFill(): void;
        public setLineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number, lineDash?: number[]): void;
        public setDrawRect(x: number, y: number, width: number, height: number): void;
        public setDrawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        public setDrawCircle(x: number, y: number, radius: number): void;
        public setDrawEllipse(x: number, y: number, width: number, height: number): void;
        public setMoveTo(x: number, y: number): void;
        public setLineTo(x: number, y: number): void;
        public setCurveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        public setCubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        public setDrawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        public setGraphicsClear(): void;
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
