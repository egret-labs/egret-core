
module egret.gui {

    export class EffectEvent extends Event{
        /**
         * 动画播放结束
         */        
        public static EFFECT_END:string = "effectEnd";
        /**
         * 动画播放被停止
         */        
        public static EFFECT_STOP:string = "effectStop";
        /**
         * 动画播放开始
         */        
        public static EFFECT_START:string = "effectStart";
        /**
         * 动画开始重复播放
         */        
        public static EFFECT_REPEAT:string = "effectRepeat";
        /**
         * 动画播放更新
         */        
        public static EFFECT_UPDATE:string = "effectUpdate";
        
        /**
         * 构造函数
         */        
        public constructor(eventType:string, bubbles:boolean = false,
                                    cancelable:boolean = false,
                                    effectInstance:IEffectInstance = null){
            super(eventType, bubbles, cancelable);
            this.effectInstance = effectInstance;
        }
        
        /**
         * 事件的效果实例对象。您可以使用此属性从事件侦听器中访问效果实例对象的属性。
         */
        public effectInstance:IEffectInstance;
    }
}