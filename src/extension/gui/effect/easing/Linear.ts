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
     * @class egret.gui.Power
     * @classdesc
     * Linear 类使用三个阶段定义缓动：加速、匀速运动和减速。
     * @implements egret.gui.IEaser
     */
    export class Linear implements IEaser{
        /**
         * @param easeInFraction 在加速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
         * @param easeOutFraction 在减速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
         * @method egret.gui.Linear#constructor
         */
        public constructor(easeInFraction:number = 0, easeOutFraction:number = 0){
            this.easeInFraction = easeInFraction;
            this.easeOutFraction = easeOutFraction;
        }
        
        private _easeInFraction:number = 0;
        /**
         * 在加速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
         */        
        public get easeInFraction():number{
            return this._easeInFraction;
        }
        
        public set easeInFraction(value:number){
            this._easeInFraction = value;
        }
        
        private _easeOutFraction:number = 0;
        /**
         * 在减速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
         */        
        public get easeOutFraction():number{
            return this._easeOutFraction;
        }
        
        public set easeOutFraction(value:number){
            this._easeOutFraction = value;
        }
        
        public ease(fraction:number):number{
            
            if (this.easeInFraction == 0 && this.easeOutFraction == 0)
                return fraction;
            
            var runRate:number = 1 / (1 - this.easeInFraction/2 - this.easeOutFraction/2);
            if (fraction < this.easeInFraction)
                return fraction * runRate * (fraction / this.easeInFraction) / 2;
            if (fraction > (1 - this.easeOutFraction)){
                var decTime:number = fraction - (1 - this.easeOutFraction);
                var decProportion:number = decTime / this.easeOutFraction;
                return runRate * (1 - this.easeInFraction/2 - this.easeOutFraction +
                    decTime * (2 - decProportion) / 2);
            }
            return runRate * (fraction - this.easeInFraction/2);
        }
    }
}