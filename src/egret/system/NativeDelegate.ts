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
    export let rootWebGLBuffer: egret.web.WebGLRenderBuffer;
    export let forHitTest: boolean = false;
    type ColorAttrib = { color: number, alpha: number };

    /**
     * @private
     */
    let _callBackList: Function[] = [];
    /**
     * @private
     */
    let _thisObjectList: any[] = [];

    let isInit: boolean = false;

    export let addModuleCallback = function (callback: Function, thisObj): void {
        _callBackList.push(callback);
        _thisObjectList.push(thisObj);
    }

    export let initNativeRender = function (): void {
        if (isInit) {
            if (_callBackList.length > 0) {
                let locCallAsyncFunctionList = _callBackList;
                let locCallAsyncThisList = _thisObjectList;
                for (let i: number = 0; i < locCallAsyncFunctionList.length; i++) {
                    let func: Function = locCallAsyncFunctionList[i];
                    if (func != null) {
                        func.apply(locCallAsyncThisList[i]);
                    }
                }
            }
            return;
        }
        isInit = true;
        let that = this;
        egret_native.nrInit();
        egret_native.nrDownloadBuffers(function (displayCmdBuffer: Float32Array) {
            NativeDisplayObject.init(displayCmdBuffer, bitmapDataMap, filterMap, customFilterDataMap);
            timeStamp = egret.getTimer();
            if (_callBackList.length > 0) {
                let locCallAsyncFunctionList = _callBackList;
                let locCallAsyncThisList = _thisObjectList;
                for (let i: number = 0; i < locCallAsyncFunctionList.length; i++) {
                    let func: Function = locCallAsyncFunctionList[i];
                    if (func != null) {
                        func.apply(locCallAsyncThisList[i]);
                    }
                }
            }
            egret.startTick(that.updatePreCallback, that);
        });
    }

    export let updateNativeRender = function (): void {
        validateDirtyTextField();
        validateDirtyGraphics();
        NativeDisplayObject.update();
        egret_native.nrUpdate();
        syncDirtyTextField();
    }

    export let dirtyTextField = function (textField: egret.TextField): void {
        if (dirtyTextFieldList.indexOf(textField) == -1) {
            dirtyTextFieldList.push(textField);
        }
    }

    export let dirtyGraphics = function (graphics: egret.Graphics): void {
        if (dirtyGraphicsList.indexOf(graphics) == -1) {
            dirtyGraphicsList.push(graphics);
        }
    }

    let syncDirtyTextField = function (): void {
        for (let key in textFieldDataMap) {
            if (textFieldDataMap[key].length > 0) {
                egret_native.nrSendTextFieldData(<number><any>key, textFieldDataMap[key]);
            }
        }
        textFieldDataMap = {};
    }

    let validateDirtyTextField = function (): void {
        let length = dirtyTextFieldList.length;
        if (length > 0) {
            let locList = dirtyTextFieldList;
            dirtyTextFieldList = [];
            for (let i: number = 0; i < length; i++) {
                let textField = locList[i];
                textField.$getRenderNode();
                let node = <egret.sys.TextNode>textField.$renderNode;
                let width = node.width - node.x;
                let height = node.height - node.y;
                if (node.drawData.length == 0) {
                    let graphicNode = textField.$graphicsNode;
                    if (graphicNode) {
                        textField.$nativeDisplayObject.setTextRect(graphicNode.x, graphicNode.y, graphicNode.width, graphicNode.height);
                    }
                    else {
                        textField.$nativeDisplayObject.setTextRect(0, 0, 0, 0);
                    }
                }
                else {
                    textField.$nativeDisplayObject.setTextRect(node.x, node.y, width, height);
                }
                bufferTextData(textField);
            }
        }
    }

    let validateDirtyGraphics = function (): void {
        let length = dirtyGraphicsList.length;
        if (length > 0) {
            let locList = dirtyGraphicsList;
            dirtyGraphicsList = [];
            for (let i: number = 0; i < length; i++) {
                let graphics = locList[i];
                let node = graphics.$renderNode;
                let width = node.width;
                let height = node.height;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    graphics.$targetDisplay.$nativeDisplayObject.setGraphicsRect(0, 0, 0, 0, graphics.$targetIsSprite);
                }
                else {
                    graphics.$targetDisplay.$nativeDisplayObject.setGraphicsRect(node.x, node.y, node.width, node.height, graphics.$targetIsSprite);
                }
                bufferGraphicsData(node, graphics);
            }
        }
    }

    let timeStamp: number;

    let updatePreCallback = function (currTimeStamp: number): boolean {
        var dt: number = currTimeStamp - timeStamp;
        timeStamp = currTimeStamp;
        egret_native.nrUpdateCallbackList(dt);
        return false;
    }

    let parseColorString = function (colorStr: string, colorVal: ColorAttrib): void {
        if (colorStr.indexOf("r") == -1) {
            colorStr = colorStr.replace(/#/, "");
            colorVal.color = parseInt(colorStr, 16);
        }
        else {
            colorStr = colorStr.replace(/rgba\(/, "");
            colorStr = colorStr.replace(/\)/, "");
            let colorArr = colorStr.split(",");
            colorVal.color = (Number(colorArr[0]) << 16) | (Number(colorArr[1]) << 8) | Number(colorArr[2]);
            colorVal.alpha = Number(colorArr[3]);
        }
    }

    let bufferRenderPath = function (path: egret.sys.Path2D, currCmds: Array<number>) {
        // 1023 beginPath
        currCmds.push(1023);
        let data = path.$data;
        let commands = path.$commands;
        let commandCount = commands.length;
        let pos = 0;
        for (let commandIndex = 0; commandIndex < commandCount; commandIndex++) {
            let command = commands[commandIndex];
            switch (command) {
                case egret.sys.PathCommand.CubicCurveTo:
                    // context.bezierCurveTo(data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++]);
                    currCmds.push(1024);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    break;
                case egret.sys.PathCommand.CurveTo:
                    // context.quadraticCurveTo(data[pos++], data[pos++], data[pos++], data[pos++]);
                    currCmds.push(1025);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    break;
                case egret.sys.PathCommand.LineTo:
                    // context.lineTo(data[pos++], data[pos++]);
                    currCmds.push(1026);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    break;
                case egret.sys.PathCommand.MoveTo:
                    // context.moveTo(data[pos++], data[pos++]);
                    currCmds.push(1027);
                    currCmds.push(data[pos++]);
                    currCmds.push(data[pos++]);
                    break;
            }
        }
    }

    let bufferTextData = function (textField: egret.TextField): void {
        let node: egret.sys.TextNode = <egret.sys.TextNode>textField.$renderNode;
        let textFieldId = textField.$nativeDisplayObject.id;
        let width = node.width - node.x;
        let height = node.height - node.y;
        if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
            return;
        }

        let canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
        let canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
        // let maxTextureSize = buffer.context.$maxTextureSize;
        let maxTextureSize = 4096;
        if (width * canvasScaleX > maxTextureSize) {
            canvasScaleX *= maxTextureSize / (width * canvasScaleX);
        }
        if (height * canvasScaleY > maxTextureSize) {
            canvasScaleY *= maxTextureSize / (height * canvasScaleY);
        }
        width *= canvasScaleX;
        height *= canvasScaleY;
        let x1 = node.x * canvasScaleX;
        let y1 = node.y * canvasScaleY;

        let offsetX = -node.x;
        let offsetY = -node.y;
        let renderCmds = [];
        let renderParms = "";
        if (node.dirtyRender) {
            renderCmds.length = 0;
            renderCmds.push(1010);
            renderCmds.push(1);
            // 1011: resize
            renderCmds.push(1011);
            renderCmds.push(width);
            renderCmds.push(height);
            renderCmds.push(node.x);
            renderCmds.push(node.y);

            if (canvasScaleX != 1 || canvasScaleY != 1) {
                renderCmds.push(1019);
                renderCmds.push(canvasScaleX);
                renderCmds.push(0);
                renderCmds.push(0);
                renderCmds.push(canvasScaleY);
                renderCmds.push(0);
                renderCmds.push(0);
                renderCmds.push(0);
            }

            if (x1 || y1) {
                // 1019: setTransform
                renderCmds.push(1019);
                renderCmds.push(canvasScaleX);
                renderCmds.push(0);
                renderCmds.push(0);
                renderCmds.push(canvasScaleY);
                renderCmds.push(-x1);
                renderCmds.push(-y1);
                renderCmds.push(1);
            }

            if (textField.$graphicsNode) {
                renderCmds.push(1015);
                bufferGraphicsData(textField.$graphicsNode, null, renderCmds);
                renderCmds.push(1016);
            }
            let drawData = node.drawData;
            let length = drawData.length;
            let pos = 0;
            while (pos < length) {
                let x = drawData[pos++];
                let y = drawData[pos++];
                let text = drawData[pos++];
                let format: egret.sys.TextFormat = drawData[pos++];
                let textColor = format.textColor == null ? node.textColor : format.textColor;
                let strokeColor = format.strokeColor == null ? node.strokeColor : format.strokeColor;
                let stroke = format.stroke == null ? node.stroke : format.stroke;
                // 1012: setFontFormat 
                renderCmds.push(1012);
                let fontStr = egret.getFontString(node, format);
                let fontPath = "";
                let fontSize = -1;
                let strArray = fontStr.split(",");
                if (strArray.length > 0) {
                    let arr = strArray[0].split(" ");
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].indexOf("px") != -1) {
                            fontSize = Number(arr[i].replace(/px/, ""));
                            fontPath = fontStr.substring(fontStr.indexOf(arr[i]) + arr[i].length + 1);
                            break;
                        }
                    }

                    renderCmds.push(fontSize);
                    //TODO
                    // if (fontPath != this.currentFont) {
                    renderParms += fontPath;
                    // }

                    if (fontStr.indexOf("bold") == -1) {
                        renderCmds.push(0);
                    }
                    else {
                        renderCmds.push(1);
                    }
                    if (fontStr.indexOf("italic") == -1) {
                        renderCmds.push(0);
                    }
                    else {
                        renderCmds.push(1);
                    }

                    renderParms += ";";

                    //  setFillStyle
                    let fontColor = 0;  //black
                    let fillColor;
                    let fillAlpha;
                    let fillStr = egret.toColorString(textColor);
                    if (fillStr.indexOf("r") == -1) {
                        fillStr = fillStr.replace(/#/, "");
                        fontColor = parseInt(fillStr, 16);
                    }
                    else {
                        fillStr = fillStr.replace(/rgba\(/, "");
                        fillStr = fillStr.replace(/\)/, "");
                        let colorArr = fillStr.split(",");
                        fillColor = (Number(colorArr[0]) << 16) | (Number(colorArr[1]) << 8) | Number(colorArr[2]);
                        fillAlpha = Number(arr[3]);
                    }
                    // console.log("font color = " + fontColor);
                    renderCmds.push(fontColor);
                    // native fillColor fillAlph no implement
                    // renderCmds.push(fillColor);
                    // renderCmds.push(fillAlpha);

                    // setStrokeStype
                    let strokeStr = egret.toColorString(strokeColor);
                    let strokeColorInt = 0;    // black
                    let strokeAlpha;
                    if (strokeStr.indexOf("r") == -1) {
                        strokeStr = strokeStr.replace(/#/, "");
                        strokeColorInt = parseInt(strokeStr, 16);
                    }
                    else {
                        strokeStr = strokeStr.replace(/rgba\(/, "");
                        strokeStr = strokeStr.replace(/\)/, "");
                        var coloarArr2 = strokeStr.split(",");
                        strokeColorInt = (Number(coloarArr2[0]) << 16) | (Number(coloarArr2[1]) << 8) | Number(coloarArr2[2]);
                        strokeAlpha = Number(arr[3]);
                    }

                    renderCmds.push(strokeColorInt);
                    // renderCmds.push(strokeAlpha);

                    renderParms += text;
                    renderParms += ";";

                    // 1013: strokeText
                    renderCmds.push(1013);
                    if (stroke) {
                        renderCmds.push(stroke * 2);
                    }
                    else {
                        renderCmds.push(0);
                    }

                    //1014: fillText
                    renderCmds.push(1014);
                    renderCmds.push(x);
                    renderCmds.push(y);
                }
            }
            if (x1 || y1) {
                // 1019: setTransform
                renderCmds.push(1019);
                renderCmds.push(canvasScaleX);
                renderCmds.push(0);
                renderCmds.push(0);
                renderCmds.push(canvasScaleY);
                renderCmds.push(0);
                renderCmds.push(0);
                renderCmds.push(-1);
            }

            textField.$nativeDisplayObject.setDataToTextField(textFieldId, renderCmds);
            textFieldDataMap[textFieldId] = renderParms;
            node.dirtyRender = false;
        }
    }

    let bufferGraphicsData = function (node: egret.sys.GraphicsNode, graphics: egret.Graphics = null, renderCmds: Array<number> = null): void {
        let isGraphics = false;
        let width = node.width;
        let height = node.height;

        if (graphics) {
            renderCmds = [];
            isGraphics = true;
        }

        if (renderCmds == null || renderCmds == undefined) {
            return;
        }

        let canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
        let canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
        if (width * canvasScaleX < 1 || height * canvasScaleY < 1) {
            canvasScaleX = canvasScaleY = 1;
        }
        if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
            node.$canvasScaleX = canvasScaleX;
            node.$canvasScaleY = canvasScaleY;
            node.dirtyRender = true;
        }
        width *= canvasScaleX;
        height *= canvasScaleY;

        if (node.dirtyRender || forHitTest) {
            renderCmds.push(1010);
            renderCmds.push(1);

            // 1011: resize
            renderCmds.push(1011);
            renderCmds.push(width);
            renderCmds.push(height);
            renderCmds.push(node.x);
            renderCmds.push(node.y);

            if (canvasScaleX != 1 || canvasScaleY != 1) {
                renderCmds.push(1019);
                renderCmds.push(canvasScaleX);
                renderCmds.push(0);
                renderCmds.push(0);
                renderCmds.push(canvasScaleY);
                renderCmds.push(0);
                renderCmds.push(0);
                renderCmds.push(0);
            }

            // 1020: translate
            if (node.x || node.y) {
                renderCmds.push(1020);
                renderCmds.push(-node.x);
                renderCmds.push(-node.y);
                renderCmds.push(1);
            }

            let drawData = node.drawData;
            let length = drawData.length;
            let colorVal: ColorAttrib = { color: 0, alpha: 1 };
            for (let i = 0; i < length; i++) {
                let path: egret.sys.Path2D = drawData[i];
                colorVal.color = 0;
                colorVal.alpha = 1;
                switch (path.type) {
                    case egret.sys.PathType.Fill:
                        let fillPath = <egret.sys.FillPath>path;
                        parseColorString(forHitTest ? egret.BLACK_COLOR : egret.getRGBAString(fillPath.fillColor, fillPath.fillAlpha), colorVal);
                        renderCmds.push(1021)
                        renderCmds.push(colorVal.color);
                        renderCmds.push(colorVal.alpha);

                        bufferRenderPath(path, renderCmds);
                        // if (this.renderingMask) {
                        //     context.clip();
                        // }
                        // else {
                        // 1028 context.fill();
                        renderCmds.push(1028);
                        // }
                        break;
                    case egret.sys.PathType.GradientFill:
                        // native no implement

                        break;
                    case egret.sys.PathType.Stroke:
                        let strokeFill = <egret.sys.StrokePath>path;
                        let lineWidth = strokeFill.lineWidth;
                        parseColorString(forHitTest ? egret.BLACK_COLOR : egret.getRGBAString(strokeFill.lineColor, strokeFill.lineAlpha), colorVal);
                        // native no implement
                        // context.lineCap = CAPS_STYLES[strokeFill.caps];
                        // context.lineJoin = strokeFill.joints;
                        // context.miterLimit = strokeFill.miterLimit;
                        renderCmds.push(1022)
                        renderCmds.push(colorVal.color);
                        renderCmds.push(colorVal.alpha);
                        renderCmds.push(lineWidth);

                        //对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
                        let isSpecialCaseWidth = lineWidth === 1 || lineWidth === 3;
                        if (isSpecialCaseWidth) {
                            // 1020 translate context.translate(0.5, 0.5);
                            renderCmds.push(1020);
                            renderCmds.push(0.5);
                            renderCmds.push(0.5);
                            renderCmds.push(0);
                        }
                        bufferRenderPath(path, renderCmds);
                        // 1029 stroke
                        renderCmds.push(1029);
                        if (isSpecialCaseWidth) {
                            // 1020 translate context.translate(-0.5, -0.5);
                            renderCmds.push(1020);
                            renderCmds.push(-0.5);
                            renderCmds.push(-0.5);
                            renderCmds.push(0);
                        }
                        break;
                }
            }

            if (node.x || node.y) {
                renderCmds.push(1020);
                renderCmds.push(node.x);
                renderCmds.push(node.y);
                renderCmds.push(-1);
            }

            if (isGraphics) {
                graphics.$targetDisplay.$nativeDisplayObject.setGraphicsRenderData(renderCmds);
            }

            if (!forHitTest) {
                node.dirtyRender = false;
            }
        }
    }

    export let activateBuffer = function (buffer: egret.sys.RenderBuffer): void {
        if (!buffer) {
            buffer = rootWebGLBuffer;
        }
        egret_native.nrActiveBuffer((<egret.web.WebGLRenderBuffer>buffer).bufferIdForWasm, buffer.width, buffer.height);
    }

    export let getJsImage = function (key) {
        if (bitmapDataMap[key].isTexture === true) {
            return null;
        }
        else {
            return bitmapDataMap[key].source;
        }
    };

    export let getJsCustomFilterVertexSrc = function (key) {
        return customFilterDataMap[key].vertexSrc;
    };

    export let getJsCustomFilterFragSrc = function (key) {
        return customFilterDataMap[key].fragmentSrc;
    };

    export let getJsCustomFilterUniforms = function (key) {
        return customFilterDataMap[key].uniformsSrc;
    };

    let bitmapDataMap = {};
    var textFieldDataMap = {};
    let customFilterDataMap = {};

    let filterMap = egret.createMap<egret.Filter>();

    let dirtyTextFieldList: egret.TextField[] = [];
    let dirtyGraphicsList: egret.Graphics[] = [];
}