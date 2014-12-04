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

module egret.gui {
    /**
     * @class egret.gui.StateSkin
     * @classdesc
     * 按钮等组件的快速皮肤模板，能够快速制定哪个状态显示那个资源，实例化一个一次性专用的按钮皮肤。
     * @extends egret.gui.Skin
     */
    export class StateSkin extends Skin {

        /**
         * 快速创建一个按钮皮肤的便利方法
         * @method egret.gui.StateSkin.createButtonSkin
         * @param upSkinName {any} 按钮弹起状态的要显示的资源名
         * @param downSkinName {any} 按钮按下状态的要显示的资源名
         * @param disabledSkinName {any} 按钮禁用状态的要显示的资源名
         */
        public static createButtonSkin(upSkinName:any,downSkinName:any=null,disabledSkinName:any=null):StateSkin{
            var sources:any = [upSkinName,downSkinName,disabledSkinName];
            return new StateSkin(["up","down","disabled"],sources);
        }

        /**
         * 构造函数
         * @method egret.gui.StateSkin#constructor
         * @param states {Array<string>} 状态名称列表,定义这个皮肤包含哪几种状态。示例：["up","down","disabled"]
         * @param sources {Array<any>} 资源名列表，与状态名列表一一对应，表示每个状态应该显示的素材资源名。示例：["up_skin_png","down_skin_png","disabled_skin_png"]
         */
        public constructor(states:Array<string>,sources:Array<any>){
            super();
            if(!states||!sources){
                return;
            }
            this.stateMap = {};
            var length:number = states.length;
            for(var i:number=0;i<length;i++){
                var state:string = states[i];
                this.stateMap[state] = sources[i];
            }
            this._setStates(states);
        }

        private stateMap:any;

        private backgroundAsset:UIAsset;
        /**
         * @inheritDoc
         */
        public createChildren():void{
            super.createChildren();
            var asset:UIAsset = new UIAsset();
            asset.left = asset.top = asset.bottom = asset.right = 0;
            this.addElement(asset);
            this.backgroundAsset = asset;
        }
        /**
         * @inheritDoc
         */
        public commitCurrentState():void{
            super.commitCurrentState();
            var state:string = this.currentState;
            var source:any = this.stateMap[state];
            if(source){
                this.backgroundAsset.source = this.stateMap[state];
            }
        }

    }
}