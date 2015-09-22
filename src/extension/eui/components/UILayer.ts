//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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

module eui {
    /**
     * @language en_US
     * The UILayer class is the subclass of the Group class.It not only has the standard function of the Group class,but also
     * can keep its size the same to the stage size (Stage.stageWidth,Stage.stageHeight).Its size will changes as the stage size changes.
     * like any normal container class,you can create multiple instance of the UILayer class,but it is usually used as the root of the UI display list.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * UILayer 是 Group 的子类，它除了具有容器的所有标准功能，还能够自动保持自身尺寸始终与舞台尺寸相同（Stage.stageWidth,Stage.stageHeight）。
     * 当舞台尺寸发生改变时，它会跟随舞台尺寸改变。UILayer 跟普通容器一样，允许创建多个实例，但通常都将它作为UI显示列表的根节点使用。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class UILayer extends Group {

        /**
         * @language en_US
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(){
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.onRemoveFromStage,this);
        }
        /**
         * @private
         * 添加到舞台
         */
        private onAddToStage(event?:egret.Event):void{
            this.$stage.addEventListener(egret.Event.RESIZE,this.onResize,this);
            this.onResize();
        }
        /**
         * @private
         * 从舞台移除
         */
        private onRemoveFromStage(event:egret.Event):void{
            this.$stage.removeEventListener(egret.Event.RESIZE,this.onResize,this);
        }

        /**
         * @private
         * 舞台尺寸改变
         */
        private onResize(event?:egret.Event):void{
            var stage = this.$stage;
            this.$setWidth(stage.$stageWidth);
            this.$setHeight(stage.$stageHeight);
        }
    }
}