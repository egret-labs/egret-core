
module egret.gui {

    export class Transition{
        public constructor(){
        }
        
        /**
         * 应用过渡时要播放的 IEffect 对象。通常，它是一个包含多个效果的复合效果对象（如 Parallel 或 Sequence 效果）。 
         */
        public effect:IEffect;
        
        /**
         * 该字符串指定在应用过渡时要从中进行更改的视图状态。默认值为“*”，表示任何视图状态。 
         * <p>可以将该属性设置为空字符串“”，它对应于基本视图状态。</p>
         */
        public fromState:string = "*";
        
        /**
         *  该字符串指定在应用过渡时要更改到的视图状态。默认值为“*”，表示任何视图状态。 
         *
         *  <p>可以将该属性设置为空字符串“”，它对应于基本视图状态。</p>
         */
        public toState:string = "*";
        
        /**
         * 设置为 true 以指定该过渡应用于正向和逆向视图状态更改。
         * 因此，对于从视图状态 A 到视图状态 B 的更改以及从视图状态 B 到视图状态 A 的更改，使用该过渡。 
         */
        public autoReverse:boolean = false;
        
        /**
         * 该属性控制当前过渡中断时的行为方式。 InterruptionBehavior 类定义此属性的可能值。
         * 默认值为end
         */
        public interruptionBehavior:string = InterruptionBehavior.END;
    }
}