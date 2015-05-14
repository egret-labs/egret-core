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
     * @class egret.gui.Keyframe
     * @classdesc
     * Keyframe 类用于定义位于效果过程中某个特定时间的属性的值。
     */
    export class Keyframe{
        /**
         * @param time 以毫秒为单位的时间，此关键帧的效果目标应该在此时间处具有 value 参数指定的值。
         * @param value 效果目标在给定的 time 处应该具有的值。
         * @param valueBy 可选参数，如果提供该可选参数，
         * 则可以通过将 valueBy 与 MotionPath 对象的关键帧集合中的前一个关键帧的 value 相加来动态地计算 value。
         * 如果是序列中的第一个 Keyframe，则会忽略此值
         * @method egret.gui.Keyframe#constructor
         */
        public constructor(time:number = NaN, 
                                 value:any = null, valueBy:any = null){
            this.value = value;
            this.time = time;
            this.valueBy = valueBy;
        }
        
        /**
         * 返回此 Keyframe 对象的副本。
         */
        public clone():Keyframe{
            var kf:Keyframe = new Keyframe(this.time, this.value, this.valueBy);
            kf.easer = this.easer;
            kf._timeFraction = this._timeFraction;
            return kf;
        }
        
        /**
         * 效果目标的属性在 time 属性指定的时间处所应该具有的值。
         */
        public value:any;
        
        /**
         * 以毫秒为单位的时间，此关键帧的效果目标应该在此时间处具有 value 属性指定的值。
         * 此时间与用此关键帧定义的效果的起始时间相关。
         */
        public time:number;
        
        public _timeFraction:number;
        
        /**
         * 对运动路径中前一个 Keyframe 对象与此 Keyframe 对象之间的运动所应用的缓动行为。
         * 默认情况下，缓动是线性的，或者根本就没有缓动。 
         */
        public easer:IEaser;
        
        /**
         * 用于计算此关键帧或前一个关键帧中的 value 的可选参数（如果已指定）。
         * 如果在前一个关键帧中未设置 value，但此关键帧中同时定义了 value 和 valueBy，
         * 则前一个关键帧中的 value 可以通过以此关键帧中的 value 减去此关键帧中的 valueBy 来计算。
         */
        public valueBy:any;
    }
}