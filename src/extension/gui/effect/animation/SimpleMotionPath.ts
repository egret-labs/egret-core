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
     * @class egret.gui.SimpleMotionPath
     * @classdesc
     * SimpleMotionPath 类是只有两个关键帧的MotionPath的简单实现
     * @extends egret.gui.MotionPath
     */
    export class SimpleMotionPath extends MotionPath{
        
        /**
         * 您可以同时指定 valueFrom 和 valueTo 参数，
         * 也可以在指定 valueBy 参数的同时指定 valueFrom 或 valueTo 参数。
         * 如果忽略这些参数，则会从效果目标计算它们。
         * @param property 正在设置动画的属性的名称。
         * @param valueFrom 属性的初始值。
         * @param valueTo 属性的最终值。
         * @param valueBy 用于指定 delta 的可选参数，该 delta 用于计算 from 或 to 值（如果其中一个值被忽略）。
         * @method egret.gui.SimpleMotionPath#constructor
         */
        public constructor(property:string = null, 
                                         valueFrom:any = null, valueTo:any = null, 
                                         valueBy:any = null){
            super();
            this.property = property;
            this.keyframes = [new Keyframe(0, valueFrom), new Keyframe(NaN, valueTo, valueBy)];
        }
        
        /**
         * 动画过程中属性的起始值。 
         */
        public get valueFrom():any{
            return this.keyframes[0].value;
        }
        public set valueFrom(value:any){
            this.keyframes[0].value = value;
        }
        
        /**
         * 已命名的属性将要设置动画的值。 
         */
        public get valueTo():any{
            return this.keyframes[this.keyframes.length -1].value;
        }
        public set valueTo(value:any){
            this.keyframes[this.keyframes.length - 1].value = value;
        }
        
        /**
         * 可指定用于计算 valueFrom 或 valueTo 值的 delta 的可选属性。
         */
        public get valueBy():any{
            return this.keyframes[this.keyframes.length - 1].valueBy;
        }
        public set valueBy(value:any){
            this.keyframes[this.keyframes.length - 1].valueBy = value;
        }
    }
}