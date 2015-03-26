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
     * @class egret.gui.Scale
     * @classdesc
     * Scale 效果围绕转换中心在 x 和 y 方向上缩放目标对象
     * @extends egret.gui.AnimateTransform
     */
    export class Scale extends AnimateTransform{
        /**
         * @method egret.gui.Scale#constructor
         */
        public constructor(target:any=null){
            super(target);
            this.instanceClass = AnimateTransformInstance;
        }
        
        /**
         * 在 y 方向上的起始比例因子。
         * @member egret.gui.Scale#scaleYFrom
         */
        public scaleYFrom:number;

        /**
         * 在 y 方向上的结束比例因子。
         * @member egret.gui.Scale#scaleYTo
         */
        public scaleYTo:number;

        /**
         * 在 y 方向上按其缩放对象的因子。
         * @member egret.gui.Scale#scaleYBy
         */
        public scaleYBy:number;
        
        /**
         * 在 x 方向上的起始比例因子。
         * @member egret.gui.Scale#scaleXFrom
         */
        public scaleXFrom:number;

        /**
         * 在 x 方向上的结束比例因子。
         * @member egret.gui.Scale#scaleXTo
         */
        public scaleXTo:number;

        /**
         * 在 x 方向上按其缩放对象的因子。
         * @member egret.gui.Scale#scaleXBy
         */
        public scaleXBy:number;
        
        public createInstance(target:any = null):IEffectInstance{
            this.motionPaths = new Array<MotionPath>();
            return super.createInstance(target);
        }

        public _initInstance(instance:IEffectInstance):void{
            this._addMotionPath("scaleX", this.scaleXFrom, this.scaleXTo, this.scaleXBy);
            this._addMotionPath("scaleY", this.scaleYFrom, this.scaleYTo, this.scaleYBy);
            super._initInstance(instance);
        }    
    }
}