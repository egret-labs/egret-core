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
     * @class egret.gui.Sequence
     * @classdesc
     * Sequence 效果以子效果的添加顺序依次播放多个子效果。
     * @extends egret.gui.CompositeEffect
     */
    export class Sequence extends CompositeEffect{
        /**
         * @method egret.gui.Sequence#constructor
         */
        public constructor(target:any=null){
            super(target);
            this.instanceClass = SequenceInstance;
        }

        public get compositeDuration():number{
            var sequenceDuration:number = 0;
            for (var i:number = 0; i < this.children.length; ++i){
                var childDuration:number;
                var child:Effect = <Effect><any> (this.children[i]);
                if (child instanceof CompositeEffect)
                    childDuration = (<CompositeEffect><any> child).compositeDuration;
                else
                    childDuration = child.duration;
                childDuration = 
                    childDuration * child.repeatCount +
                    (child.repeatDelay * (child.repeatCount - 1)) +
                    child.startDelay;
                sequenceDuration += childDuration;
            }
            return sequenceDuration;
        }
    }
}