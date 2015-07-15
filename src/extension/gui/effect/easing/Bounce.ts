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
     * @class egret.gui.Bounce
     * @classdesc
     * Bounce 类实现缓动功能，该功能模拟目标对象上的重力牵引和回弹目标对象。
     * @implements egret.gui.IEaser
     */
    export class Bounce implements IEaser{
        /**
         * @method egret.gui.Bounce#constructor
         */
        public constructor(){
        }
        
        public ease(fraction:number):number{
            return this.easeOut(fraction, 0, 1, 1);
        }
        
        public easeOut(t:number, b:number,
                                       c:number, d:number):number{
            if ((t /= d) < (1 / 2.75))
                return c * (7.5625 * t * t) + b;
                
            else if (t < (2 / 2.75))
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                
            else if (t < (2.5 / 2.75))
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                
            else
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        }
    }
}