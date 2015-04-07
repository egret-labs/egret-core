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

    export interface IEffectInstance{
        /**
         * 效果的持续时间（以毫秒为单位）。
         */
        duration:number;
        
        /**
         * 创建此 IEffectInstance 对象的 IEffect 对象。
         */
        effect:IEffect;
        
        /**
         * 效果的当前时间位置。
         * 此属性的值介于 0 和总持续时间（包括该效果的 startDelay、repeatCount 和 repeatDelay）之间。
         */
        playheadTime:number;
        
        /**
         * 效果的重复次数。可能的值为任何大于等于 0 的整数。
         */
        repeatCount:number;
        
        /**
         * 重复播放效果前需要等待的时间（以毫秒为单位）。
         */
        repeatDelay:number;
        
        /**
         * 开始播放效果前需要等待的时间（以毫秒为单位）。
         * 此值可以是任何大于或等于 0 的整数。
         * 如果使用 repeatCount 属性重复播放效果，则只在首次播放该效果时应用 startDelay 属性。
         */
        startDelay:number;
        
        /**
         * 要应用此效果的对象。
         */
        target:any;
        
        /**
         * 经过 startDelay 所占用的这段时间后，在目标上播放效果实例。
         * 由 Effect 类调用。在启动 EffectInstance 时，请使用此函数，而非 play() 方法。
         */
        startEffect():void;
        
        /**
         * 在目标上播放效果实例。改为调用 startEffect() 方法，以在 EffectInstance 上开始播放效果。 
         * <p>在 EffectInstance 的子类中，必须覆盖此方法。
         * 此覆盖必须调用 super.play() 方法，以便从目标中分派 effectStart 事件。</p>
         */
        play():void;
        
        /**
         * 暂停效果，直到调用 resume() 方法。
         */
        pause():void;
        
        /**
         * 停止播放效果，使目标保持当前状态。
         * 您需要通过调用 Effect.stop() 方法来调用此方法。在实现过程中，它会调用 finishEffect() 方法。 
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         */
        stop():void;
        
        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         */
        resume():void;
        
        /**
         * 从效果的当前位置开始反向播放效果。
         */
        reverse():void;
        
        /**
         * 中断当前播放的效果实例，立即跳转到效果的结束位置。
         * 通过调用 Effect.end() 方法可调用此方法。在实现过程中，它会调用 finishEffect() 方法。 
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         */
        end():void;
        
        /**
         * 在完成效果播放时由 end() 方法调用。此函数将为效果目标分派 endEffect 事件。 
         */
        finishEffect():void;
        
        /**
         * 每次完成重复效果的迭代播放后调用。 
         */
        finishRepeat():void;
    }
}