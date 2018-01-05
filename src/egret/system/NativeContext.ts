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
declare namespace egret_native {

    function sendInfoToPlugin(info: string): void;

    function receivedPluginInfo(info: string): void;

    function nrInit(): void;
    function nrDownloadBuffers(callback: (displayCmdBuffer: Float32Array) => void): void;
    function nrSetRenderMode(mode: number): void;
    function nrSetRenderMode(mode: number): void;
    function nrRenderDisplayObject(id: number, scale: number, useClip: boolean, clipX: number, clipY: number, clipW: number, clipH: number): void;
    function nrRenderDisplayObject2(id: number, offsetX: number, offsetY: number, forHitTest: boolean): void;
    function nrLocalToGlobal(id: number, localX: number, localY: number): string;
    function nrGlobalToLocal(id: number, globalX: number, globalY: number): string;
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