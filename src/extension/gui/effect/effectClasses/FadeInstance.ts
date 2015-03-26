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
     * @class egret.gui.FadeInstance
     * @classdesc
     * FadeInstance 类用于实现 Fade 效果的实例类
     * @extends egret.gui.AnimateInstance
     */
    export class FadeInstance extends AnimateInstance{
        /**
         * @method egret.gui.FadeInstance#constructor
         */
        public constructor(target:any){
            super(target);
        }
        
        /**
         * 介于 0.0 和 1.0 之间的 alpha 属性的初始值
         * @member egret.gui.FadeInstance#alphaFrom
         */
        public alphaFrom:number;
        
        /**
         * 介于 0.0 和 1.0 之间的 alpha 属性的最终值
         * @member egret.gui.FadeInstance#alphaFrom
         */
        public alphaTo:number;
        
        public play():void{
            var fromValue:number = this.alphaFrom;
            var toValue:number = this.alphaTo;

            if ("visible" in this.target && !this.target.visible){
                if (isNaN(fromValue))
                    fromValue = this.target.alpha;
                if (isNaN(toValue))
                    toValue = this.target.alpha;
                if (fromValue == 0 && toValue != 0){
                    this.target.alpha = 0;
                    this.target.visible = true;
                }
            }
            
            this.motionPaths = [new MotionPath("alpha")];
            this.motionPaths[0].keyframes = [new Keyframe(0, this.alphaFrom),
                new Keyframe(this.duration, this.alphaTo)];
            
            super.play();
        }
    }
}