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

    export interface IInterpolator{
        
        /**
         * 如果有在 0.0 和 1.0 之间的某个动画的已过去部分，以及要插补的开始值和结束值，则返回内插值。
         * @param fraction 动画的已过去部分，在 0.0 和 1.0 之间。
         * @param startValue 插值的开始值。
         * @param endValue 插值的结束值。
         * @return 内插值。
         */
        interpolate(fraction:number, startValue:any, endValue:any):any;
        
        /**
         * 如果有一个基值和一个要添加到它的值，则返回该操作的结果。
         * @param baseValue 插值的开始值。
         * @param incrementValue  应用到 baseValue 的更改。
         * @return 内插值。
         */
        increment(baseValue:any, incrementValue:any):any;
        
        /**
         * 如果有一个基值和一个从其减去的值，则返回该减量操作的结果。
         * @param baseValue 插值的开始值。
         * @param decrementValue  应用到 baseValue 的更改。
         * @return  内插值。
         */
        decrement(baseValue:any, decrementValue:any):any;
    }
}