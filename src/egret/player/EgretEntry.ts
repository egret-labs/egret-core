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

namespace egret {

    export type runEgretOptions = {
        renderMode?: string;
        audioType?: number;
        screenAdapter?: sys.IScreenAdapter;
        antialias?: boolean,
        canvasScaleFactor?: number,
        calculateCanvasScaleFactor?: (context:CanvasRenderingContext2D)=>number
    };

    /**
     * egret project entry function
     * @param options An object containing the initialization properties for egret engine.
     * @language en_US
     */
    /**
     * egret工程入口函数
     * @param options 一个可选对象，包含初始化Egret引擎需要的参数。
     * @language zh_CN
     */
    export declare function runEgret(options?: runEgretOptions): void;
    /**
     * Refresh the screen display
     * @language en_US
     */
    /**
     * 刷新屏幕显示
     * @language zh_CN
     */
    export declare function updateAllScreens(): void;

    /**
     * @private
     */
    export type CustomContext = {

        onStart: (egretContext: EgretContext) => void;

        onRender: (egretContext: EgretContext) => void;

        onStop: (egretContext: EgretContext) => void;

        onResize: (egretContext: EgretContext) => void;
    }

    /**
     * @private
     */
    export type EgretContext = {

        setAutoClear: (value: boolean) => void;

        save: () => void;

        restore: () => void;

    }

    /**
     * Insert render context, now for egret3d
     * @private
     * @language en_US
     */
    /**
     * 插入渲染上下文，目前用于egret3d的混入
     * @private
     * @language zh_CN
     */
    export declare function setRendererContext(custom: CustomContext): void;

}