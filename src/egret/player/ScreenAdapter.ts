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
     * 屏幕适配器接口，当播放器视口尺寸改变时，屏幕适配器将被用于计算当前对应的舞台显示尺寸。
     */
    export interface IScreenAdapter{

        /**
         * @private
         * 计算舞台显示尺寸
         * @param scaleMode 当前的缩放模式
         * @param screenWidth 播放器视口宽度
         * @param screenHeight 播放器视口高度
         * @param contentWidth 初始化内容宽度
         * @param contentHeight 初始化内容高度
         */
        calculateStageSize(scaleMode:string,screenWidth:number,screenHeight:number,
                           contentWidth:number, contentHeight:number):StageDisplaySize;
    }

    /**
     * @private
     * 舞台显示尺寸数据
     */
    export interface StageDisplaySize{

        /**
         * @private
         * 舞台宽度
         */
        stageWidth:number;
        /**
         * @private
         * 舞台高度
         */
        stageHeight:number;
        /**
         * @private
         * 显示宽度，若跟舞台宽度不同，将会产生缩放。
         */
        displayWidth:number;
        /**
         * @private
         * 显示高度，若跟舞台高度不同，将会产生缩放。
         */
        displayHeight:number;
    }

    /**
     * @private
     * 屏幕适配器实例，开发者可以通过给这个变量赋值实现了IScreenAdapter接口的实例，从而注入自定义的屏幕适配器。
     */
    export let screenAdapter:IScreenAdapter;

    /**
     * @private
     * 屏幕适配器默认实现，开发者可以实现自定义规则的屏幕适配器。并在初始化加载时将适配器的实例赋值给egret.sys.screenAdapter上，从而替换掉默认适配器。
     */
    export class DefaultScreenAdapter extends HashObject implements IScreenAdapter {

        /**
         * @private
         */
        public constructor() {
            super();
        }

        /**
         * @private
         * 计算舞台显示尺寸
         * @param scaleMode 当前的缩放模式
         * @param screenWidth 播放器视口宽度
         * @param screenHeight 播放器视口高度
         * @param contentWidth 初始化内容宽度
         * @param contentHeight 初始化内容高度
         */
        public calculateStageSize(scaleMode:string, screenWidth:number, screenHeight:number,
                                  contentWidth:number, contentHeight:number):StageDisplaySize {
            let displayWidth = screenWidth;
            let displayHeight = screenHeight;
            let stageWidth = contentWidth;
            let stageHeight = contentHeight;
            let scaleX = (screenWidth / stageWidth) || 0;
            let scaleY = (screenHeight / stageHeight) || 0;
            switch (scaleMode) {
                case StageScaleMode.EXACT_FIT:
                    break;
                case StageScaleMode.FIXED_HEIGHT:
                    stageWidth = Math.round(screenWidth / scaleY);
                    break;
                case StageScaleMode.FIXED_WIDTH:
                    stageHeight = Math.round(screenHeight / scaleX);
                    break;
                case StageScaleMode.NO_BORDER:
                    if (scaleX > scaleY) {
                        displayHeight = Math.round(stageHeight * scaleX);
                    }
                    else {
                        displayWidth = Math.round(stageWidth * scaleY);
                    }
                    break;
                case StageScaleMode.SHOW_ALL:
                    if (scaleX > scaleY) {
                        displayWidth = Math.round(stageWidth * scaleY);
                    }
                    else {
                        displayHeight = Math.round(stageHeight * scaleX);
                    }
                    break;
                case StageScaleMode.FIXED_NARROW:
                    if (scaleX > scaleY) {
                        stageWidth = Math.round(screenWidth / scaleY);
                    }
                    else {
                        stageHeight = Math.round(screenHeight / scaleX);
                    }
                    break;
                case StageScaleMode.FIXED_WIDE:
                    if (scaleX > scaleY) {
                        stageHeight = Math.round(screenHeight / scaleX);
                    }
                    else {
                        stageWidth = Math.round(screenWidth / scaleY);
                    }
                    break;
                default :
                    stageWidth = screenWidth;
                    stageHeight = screenHeight;
                    break;
            }
            //宽高不是2的整数倍会导致图片绘制出现问题
            if (stageWidth % 2 != 0) {
                stageWidth += 1;
            }
            if (stageHeight % 2 != 0) {
                stageHeight += 1;
            }
            if(displayWidth % 2 != 0) {
                displayWidth += 1;
            }
            if(displayHeight % 2 != 0) {
                displayHeight += 1;
            }
            return {
                stageWidth: stageWidth,
                stageHeight: stageHeight,
                displayWidth: displayWidth,
                displayHeight: displayHeight
            };
        }
    }
}