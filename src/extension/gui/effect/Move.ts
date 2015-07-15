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


module egret.gui {

    /**
     * @class egret.gui.Move
     * @classdesc
     * Move 效果按 x 和 y 方向移动目标对象。
     * @extends egret.gui.AnimateTransform
     */
    export class Move extends AnimateTransform{
        /**
         * @method egret.gui.Move#constructor
         */
        public constructor(target:any=null){
            super(target);
            this.instanceClass = AnimateTransformInstance;
        }
        
        /** 
         * 按其修改目标的 y 位置的像素数目。此值可以为负值
         * @member egret.gui.Move#yBy
         */
        public yBy:number;
        
        /** 
         * 目标的初始 y 位置
         * @member egret.gui.Move#yFrom
         */
        public yFrom:number;

        /** 
         * 目标的最终 y 位置
         * @member egret.gui.Move#yTo
         */
        public yTo:number;
        
        /** 
         * 按其修改目标的 x 位置的像素数目
         * @member egret.gui.Move#xBy
         */
        public xBy:number;
        
        /** 
         * 目标的初始 x 位置
         * @member egret.gui.Move#xFrom
         */
        public xFrom:number;
        
        /** 
         * 目标的最终 x 位置
         * @member egret.gui.Move#xTo
         */
        public xTo:number;

        public createInstance(target:any = null):IEffectInstance{
            this.motionPaths = new Array<MotionPath>();
            return super.createInstance(target);
        }
        
        public _initInstance(instance:IEffectInstance):void{
            this._addMotionPath("translationX", this.xFrom, this.xTo, this.xBy);
            this._addMotionPath("translationY", this.yFrom, this.yTo, this.yBy);
            super._initInstance(instance);
        }    
    }
}