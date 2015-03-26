/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


declare module egret_native {

    /**
     * 游戏启动
     * @private
     */
    function startGame():void;

    /**
     * 启动主循环
     * @param callback 主循环回调函数
     * @param thisObject
     */
    function executeMainLoop(callback: Function, thisObject: any): void;

    function pauseApp(): void;

    function resumeApp(): void;

    function readXML(filepath:string):any;

    function isFileExists(filepath:string):boolean;

    function isRecordExists(filepath:string):boolean;

    function readFileSync(filepath:string):any;
    function readResourceFileSync(filepath:string):any;
    function readUpdateFileSync(filepath:string):any;
    function deleteUpdateFile(filepath:string):void;

    function readFileAsync(filepath:string, promise:egret.PromiseObject):any;

    function writeFileSync(filepath:string, fileContent:string):any;

    function requireHttpSync(url:string, callback:Function):void;

    function requireHttp(url:string, param:any, callback:Function):void;

    function sendInfoToPlugin(info:string):void;

    function receivedPluginInfo(info:string):void;

    function loadRecord(filepath:string):string;

    function saveRecord(filepath:string, fileContent:string):void;

    function getOption(type:string):any;

    module Audio {
        function preloadBackgroundMusic(path:string):void;

        function playBackgroundMusic(path:string, loop:boolean):void;

        function stopBackgroundMusic(isRelease:boolean):void;

        function preloadEffect(path:string):void;
        function preloadEffectAsync(path:string, promise:egret.PromiseObject):void;

        function playEffect(path:string, loop:boolean):void;
        function unloadEffect(path:string):void;

        function stopEffect(effectId:number):void;
    }

    function download(url:string, savePath:string, promise:any):void;

    module Graphics {


        function clearScreen(r:number, g:number, b:number):void;

        function drawImage(texture:any, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight):void;
        function drawImageScale9(texture:any, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, x, y, width, height):boolean;

        function setTransform(a:number, b:number, c:number, d:number, tx:number, ty:number):void;

        function setGlobalAlpha(alpha:number):void;

        function pushClip(x:number, y:number, w:number, h:number):void;

        function popClip():void;

        function setGlobalColorTransform(colorTransformMatrix:Array<number>):void;

        function setGlobalColorTransformEnabled(bool:boolean):void;

        function setGlobalShader(filterData:any):void;


        function lineStyle(thickness:number, color:number):void;

        function lineTo(x:number, y:number):void;

        function moveTo(x:number, y:number):void;

        function beginFill(color:number, alpha:number):void;

        function endFill():void;

        function setBlendArg(src:number, des:number):void;

        function setTextureScaleFactor(value:number):void;
    }

    module Label {

        function createLabel(font:string, size:number, defaultString:string, defaultStroke:number):void;

        function setTextColor(color:number):void;
        function setStrokeColor(color:number):void;

        function drawText(text:string, x:number, y:number):void;

        function setTextAlignment(type:string):void;

        function getTextSize(text:string):Array<number>;


    }


    module EGTXML {


        function readXML(filepath:string):void;
    }

    module Texture {

        function addTexture(filePath:string):any;
        function addTextureAsyn(filePath:string, promise:any):any;
        function addTextureUnsyn(filePath:string, promise:any):any;

        function removeTexture(filePath:string):void;
    }


    module TextInputOp {

        function setKeybordOpen(isOpen:boolean):void
        function isFullScreenKeyBoard():boolean
        function setInputTextMaxLenght(value:number):void;


    }

    function EGT_TextInput(text:string):void
    function EGT_keyboardFinish():void


    function EGT_deleteBackward():void;

    function EGT_keyboardDidHide():void;
    function EGT_keyboardDidShow():void;

    function EGT_getTextEditerContentText():string;

    module EGTView {

        function getFrameWidth():number;

        function getFrameHeight():number;

        function setVisibleRect(x:number, y:number, w:number, h:number):number;

        function setDesignSize(w:number, h:number):number;
    }

    class RenderTexture{
        constructor(width:number, height:number);

        begin();

        end();
    }
}