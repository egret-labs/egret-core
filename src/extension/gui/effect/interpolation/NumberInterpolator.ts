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
     * @class egret.gui.NumberInterpolator
     * @classdesc
     * NumberInterpolator 类在表示为 number 实例的开始值和结束值之间提供插值。
     * @implements egret.gui.IInterpolator
     */
    export class NumberInterpolator implements IInterpolator{
        /**
         * @method egret.gui.NumberInterpolator#constructor
         */
        public constructor(){
        }
        
        private static theInstance:NumberInterpolator;

        public static getInstance():NumberInterpolator{
            if (!NumberInterpolator.theInstance)
                NumberInterpolator.theInstance = new NumberInterpolator();
            return NumberInterpolator.theInstance;
        }
        
        public interpolate(fraction:number, startValue:any, endValue:any):any{
            if (fraction == 0)
                return startValue;
            else if (fraction == 1)
                return endValue;
            return <number><any> startValue + (fraction * (<number><any> endValue - <number><any> startValue));
        }
        
        public increment(baseValue:any, incrementValue:any):any{
            return <number><any> baseValue + <number><any> incrementValue;
        }
        
        public decrement(baseValue:any, decrementValue:any):any{
            return <number><any> baseValue - <number><any> decrementValue;
        }
    }
}