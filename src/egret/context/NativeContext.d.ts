/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
    function executeMainLoop(callback:Function, thisObject:any):void;


    function readXML(filepath:string):any;


    module Graphics {


        function clearScreen(r:number, g:number, b:number):void;

        function drawImage(texture:any, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight):void;

        function setTransform(a:number, b:number, c:number, d:number, tx:number, ty:number):void;

        function setGlobalAlpha(alpha:number):void;


    }

    module Label {

        function createLabel(font:string,size:number,defaultString:string):void;

        function setTextColor(color:number):void;

        function drawText(text:string,x:number,y:number):void;

        function setTextAlignment(type:string):void;


    }


    module EGTXML {



        function readXML(filepath:string):void;
    }
}