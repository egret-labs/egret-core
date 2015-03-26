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
     * @class egret.gui.Rotate
     * @classdesc
     * Rotate 效果围绕转换中心旋转目标对象。
     * @extends egret.gui.AnimateTransform
     */
    export class Rotate extends AnimateTransform{
        /**
         * @method egret.gui.Rotate#constructor
         */
        public constructor(target:any=null){
            super(target);
            this.instanceClass = AnimateTransformInstance;
        }
        
        /** 
         * 目标对象的起始旋转角度
         * @member egret.gui.Rotate#angleFrom
         */
        public angleFrom:number;
        
        /** 
         * 目标对象的结束旋转角度
         * @member egret.gui.Rotate#angleTo
         */
        public angleTo:number;
        
        /** 
         * 旋转目标对象的度数
         * @member egret.gui.Rotate#angleBy
         */
        public angleBy:number;
        
        public createInstance(target:any = null):IEffectInstance{
            this.motionPaths = new Array<MotionPath>();
            return super.createInstance(target);
        }
        
        public _initInstance(instance:IEffectInstance):void{
            this._addMotionPath("rotation", this.angleFrom, this.angleTo, this.angleBy);
            super._initInstance(instance);
        }    
    }
}