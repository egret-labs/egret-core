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
     * @class egret.gui.Elastic
     * @classdesc
     * Elastic 类实现缓动功能，此时目标对象移动是由一个指数衰减正弦波定义的。
     * @implements egret.gui.IEaser
     */
    export class Elastic implements IEaser{
        /**
         * @method egret.gui.Elastic#constructor
         */
        public constructor(){
        }
        
        public ease(fraction:number):number{
            return this.easeOut(fraction, 0, 1, 1);
        }
        
        public easeOut(t:number, b:number,
                                       c:number, d:number,
                                       a:number = 0, p:number = 0):number{
            if (t == 0)
                return b;
            
            if ((t /= d) == 1)
                return b + c;
            
            if (!p)
                p = d * 0.3;
            
            var s:number;
            if (!a || a < Math.abs(c)){
                a = c;
                s = p / 4;
            }
            else{
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            
            return a * Math.pow(2, -10 * t) *
                Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        }

    }
}