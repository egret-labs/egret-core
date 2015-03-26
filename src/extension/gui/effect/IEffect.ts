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

    export interface IEffect extends IEventDispatcher{
        /**
         * 效果类的短名
         */
        className:string;
        
        /** 
         * 效果的持续时间（以毫秒为单位）。 
         */
        duration:number;

        /**
         * 一个只读标志，如果当前正在播放效果的任一实例，则为 true；否则，则为 false。
         */
        isPlaying:boolean;

        /**
         * 在效果的第一个目标之后，其他效果目标的附加延迟（以毫秒为单位）。此值将添加到 startDelay 属性的值中。
         */ 
        perElementOffset:number;
        
        /** 
         * 要应用此效果的对象。当效果触发器触发某个效果时，会自动将 target 属性设置为触发该效果的对象。
         */
        target:any;

        /**
         * 一个对象 Array，这些对象都是效果的目标。播放效果时，会对各个目标并行执行效果。
         * 设置 target 属性将替换此 Array 中的所有对象。
         * 设置 targets 属性后，target 属性将返回此 Array 中的第一个项目。
         */
        targets:Array<any>;
        
        /**
         * 效果的当前时间位置。此属性的值介于 0 和总持续时间（包括该效果的 startDelay、repeatCount 和 repeatDelay）之间。
         */
        playheadTime:number;
        
        /**
         * 获取一个目标对象 Array，并对每个目标调用 createInstance() 方法。
         *  @param targets 要使用此效果设置动画的对象的数组。
         *  @return 效果的效果实例对象的数组，一个目标一个数组。
         */
        createInstances(targets?:Array<any>):Array<any>;
        
        /**
         * 创建一个效果实例并对其进行初始化。在播放效果实例前，使用此方法（而非 play() 方法）处理效果实例属性。 
         *  <p>所创建的效果实例的类型由 instanceClass 属性指定。然后，使用 _initInstance() 方法初始化此实例。
         * 如果该实例是 EffectManager 在效果触发器触发此效果时创建的，
         * 则还需要调用 EffectInstance.initEffect() 方法进一步初始化此效果。</p>
         *  <p>调用 createInstance() 方法不会播放效果。对返回的效果实例调用 startEffect() 方法。</p>
         *  <p>Effect.play() 方法将自动调用此函数。 </p>
         *  @param target 要使用此效果为其设置动画的对象。
         *  @return 效果的效果实例对象。
         */
        createInstance(target?:any):IEffectInstance;
        
        /**
         * 删除实例中的事件侦听器，然后从实例列表中删除该实例。
         */
        deleteInstance(instance:IEffectInstance):void;
        
        /**
         * 开始播放效果。通常在调用 play() 方法之前先调用 end() 方法，以确保在开始播放新效果前已结束先前效果的所有实例。 
         * @param targets 播放此效果的目标对象的数组。如果已指定此参数，则不会使用效果的 targets 属性。
         * @param playReversedFromEnd 如果为 true，则向后播放效果。
         * @return 效果的 EffectInstance 对象的数组，一个目标一个数组。
         */
        play(targets?:Array<any>,playReversedFromEnd?:boolean):Array<any>;
        
        /**
         * 暂停效果，直到调用 resume() 方法。
         */
        pause():void;
        
        /**
         * 停止播放效果，使效果目标保持当前状态。
         * 与调用 pause() 方法不同，无法先调用 stop() 方法再调用 resume() 方法。
         * 不过，您可以调用 play() 方法重新播放效果。
         */
        stop():void;
        
        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         */
        resume():void;
        
        /**
         * 逆序播放效果；如果当前正在播放效果，则从该效果的当前位置开始逆序播放。
         */
        reverse():void;
        
        /**
         * 中断当前正在播放的效果，立即跳转到该效果的末尾。调用此方法将调用 EffectInstance.end() 方法。 
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         * <p>如果将效果实例作为参数传递，则会中断此实例。
         * 如果没有传入参数，则该效果当前生成的所有效果实例都将中断。</p>
         */
        end(effectInstance?:IEffectInstance):void;
    }
}