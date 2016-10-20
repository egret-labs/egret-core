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

namespace egret.gui {
    /**
     * @class egret.gui.StateSkin
     * @classdesc
     * 按钮组件的快速皮肤模板，能够快速制定哪个状态显示那个资源，实例化一次性专用的按钮皮肤。
     * @extends egret.gui.Skin
     */
    export class ButtonSkin extends Skin {

        /**
         * 构造函数
         * @method egret.gui.StateSkin#constructor
         * @param upSkinName {any} 按钮弹起状态的要显示的资源名
         * @param downSkinName {any} 按钮按下状态的要显示的资源名
         * @param disabledSkinName {any} 按钮禁用状态的要显示的资源名
         */
        public constructor(upSkinName:any=null,downSkinName:any=null,disabledSkinName:any=null){
            super();
            let stateMap = {};
            stateMap["up"] = upSkinName;
            stateMap["down"] = downSkinName;
            stateMap["disabled"] = disabledSkinName;
            this.stateMap = stateMap;
            this._setStates(["up","down","disabled"]);
        }

        /**
         *
         * @type {string[]}
         * @private
         */
        private static _skinParts:string[] = ["labelDisplay","iconDisplay"];

        public get skinParts():string[]{
            return ButtonSkin._skinParts;
        }

        private stateMap:any;

        private backgroundAsset:UIAsset;
        public labelDisplay:Label  = new egret.gui.Label();
        public iconDisplay:UIAsset = new egret.gui.UIAsset();

        /**
         * 创建容器的子对象
         * @inheritDoc
         */
        public createChildren():void{
            super.createChildren();
            let asset:UIAsset = new UIAsset();
            asset.left = asset.top = asset.bottom = asset.right = 0;
            this.addElement(asset);
            this.backgroundAsset = asset;
            this.iconDisplay.includeInLayout = false;
            this.addElement(this.iconDisplay);
            this.labelDisplay.includeInLayout = false;
            this.labelDisplay.paddingLeft = 5;
            this.labelDisplay.paddingRight = 5;
            this.addElement(this.labelDisplay);
        }
        /**
         * @inheritDoc
         */
        public commitCurrentState():void{
            super.commitCurrentState();
            let state:string = this.currentState;
            let source:any = this.stateMap[state];
            if(source){
                this.backgroundAsset.source = this.stateMap[state];
            }
        }

        /**
         * 计算 Panel 容器默认大小的最小值和最大值
         */
        public measure():void{
            super.measure();
            let w:number = this.iconDisplay.preferredWidth+this.labelDisplay.preferredWidth+20;
            let h:number = Math.max(this.iconDisplay.preferredHeight,this.labelDisplay.preferredHeight)+20;
            if(w > this.measuredWidth){
                if(w < this.minWidth){
                    w = this.minWidth;
                }
                if(w > this.maxWidth){
                    w = this.maxWidth;
                }
                this.measuredWidth = w;
            }
            if(h > this.measuredHeight){

                if(h < this.minHeight){
                    h = this.minHeight;
                }
                if(h > this.maxHeight){
                    h = this.maxHeight
                }
                this.measuredHeight = h;
            }
        }

        /**
         * 通过设置此容器子项的位置和大小来响应大小更改
         * @param unscaledWidth
         * @param unscaledHeight
         */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number):void{
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            let iconWidth:number = this.iconDisplay.layoutBoundsWidth;
            let iconHeight:number = this.iconDisplay.layoutBoundsHeight;
            let labelWidth:number = this.labelDisplay.layoutBoundsWidth;
            let labelHeight:number = this.labelDisplay.layoutBoundsHeight;
            let iconX:number = (unscaledWidth-iconWidth-labelWidth)*0.5;
            let iconY:number = (unscaledHeight-iconHeight)*0.5;
            this.iconDisplay.setLayoutBoundsPosition(iconX,iconY);
            let labelX:number = iconX+iconWidth;
            let labelY:number = (unscaledHeight-labelHeight)*0.5;
            this.labelDisplay.setLayoutBoundsPosition(labelX,labelY);
        }

    }
}