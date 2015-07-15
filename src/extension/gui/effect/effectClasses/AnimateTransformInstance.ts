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
     * @class egret.gui.AnimateTransformInstance
     * @classdesc
     * AnimateTransformInstance 类用于实现 AnimateTransform 效果的实例类
     * @extends egret.gui.AnimateInstance
     */
    export class AnimateTransformInstance extends AnimateInstance{
        /**
         * @method egret.gui.AnimateTransformInstance#constructor
         */
        public constructor(target:any){
            super(target);
        }
        
        /**
         * 变换效果开始的标志
         */
        private started:boolean = false;
        
        private instanceStartTime:number = 0;
        
        /**
         * 储存当前的属性值
         */
        private currentValues:any = {
            rotation:NaN,
            scaleX:NaN, scaleY:NaN,
            translationX:NaN, translationY:NaN};
        
        /**
         * 如果为 true，则已经初始化与该转换相关的效果的此单一实例。
         * 此属性供 AnimateTransform 使用，以防止在将多个转换效果集成到此单一实例中时重复初始化该实例。
         */
        public initialized:boolean = false;
        
        /**
         * 中心，此效果中的转换是围绕其发生的。特别是，旋转会围绕此点旋转，平移会移动此点，而缩放会以此点为中心进行缩放。
         * 如果 autoCenterTransform 为 true，则将忽略此属性。
         * 如果 autoCenterTransform 为 false 且未提供 transformCenter，则会使用目标对象的转换中心。
         * @member egret.gui.AnimateTransformInstance#transformCenter
         */
        public transformCenter:Point;
        
        public autoCenterTransform:boolean;
        
        public startEffect():void{
            if (!this.started){
                this.started = true;
                super.startEffect();
            }
        }
        
        private insertKeyframe(keyframes:Array<Keyframe>, 
                                        newKF:Keyframe, startDelay:number = 0, first:boolean = false):void{
            newKF.time += startDelay;
            for (var i:number = 0; i < keyframes.length; i++){
                if (keyframes[i].time >= newKF.time){
                    if (keyframes[i].time == newKF.time){
                        if (first){
                            newKF.time += .01;
                            keyframes.splice(i+1, 0, newKF);
                        }
                        else{
                            newKF.time -= .01;
                            keyframes.splice(i, 0, newKF);
                        }
                    }
                    else{
                        keyframes.splice(i, 0, newKF);
                    }
                    return;
                }
            }
            keyframes.push(newKF);
        }
        
        /**
         * 使用相对于最外侧的 parent 效果的开始时间，将一个 MotionPath 对象添加到此实例中的 MotionPath 对象集中。
         * 对于在与新的 MotionPath 对象相同的属性上起作用的此效果实例，
         * 如果已经存在一个 MotionPath 对象，则只会将新 MotionPath 的关键帧添加到现有 MotionPath 中。
         * @member egret.gui.AnimateTransformInstance#addMotionPath
         */
        public addMotionPath(newMotionPath:MotionPath, newEffectStartTime:number = 0):void{
            var added:boolean = false;
            if (this.motionPaths){
                var i:number = 0;
                var j:number = 0;
                var mp:MotionPath;
                var n:number = this.motionPaths.length;
                if (newEffectStartTime < this.instanceStartTime){
                    var deltaStartTime:number = this.instanceStartTime - newEffectStartTime;
                    for (i = 0; i < n; i++){
                        mp = <MotionPath><any> (this.motionPaths[i]);
                        for (j = 0; j < mp.keyframes.length; j++)
                            mp.keyframes[j].time += deltaStartTime;
                    }
                    this.instanceStartTime = newEffectStartTime;
                }
                for (i = 0; i < n; i++){
                    mp = <MotionPath><any> (this.motionPaths[i]);
                    if (mp.property == newMotionPath.property){
                        for (j = 0; j < newMotionPath.keyframes.length; j++){
                            this.insertKeyframe(mp.keyframes, newMotionPath.keyframes[j], 
                                (newEffectStartTime - this.instanceStartTime), (j == 0));
                        }
                        added = true;
                        break;
                    }
                }
            }
            else{
                this.motionPaths = new Array<MotionPath>();
                this.instanceStartTime = newEffectStartTime;
            }
            if (!added){
                if (newEffectStartTime > this.instanceStartTime){
                    for (j = 0; j < newMotionPath.keyframes.length; j++)
                        newMotionPath.keyframes[j].time += 
                            (newEffectStartTime - this.instanceStartTime);
                }
                this.motionPaths.push(newMotionPath);
            }
            n = this.motionPaths.length;
            for (i = 0; i < n; i++){
                mp = <MotionPath><any> (this.motionPaths[i]);
                var kf:Keyframe = mp.keyframes[mp.keyframes.length-1];
                if (!isNaN(kf.time))
                    this.duration = Math.max(this.duration, kf.time);
            }
        }
        
        public play():void{
            if (this.motionPaths){
                var i:number = 0;
                var j:number = 0;
                this.updateTransformCenter();
                var adjustXY:boolean = (this.transformCenter.x != 0 || this.transformCenter.y != 0);
                
                for (i = 0; i < this.motionPaths.length; ++i){
                    var animProp:MotionPath = this.motionPaths[i];
                    if (adjustXY && 
                        (animProp.property == "translationX" || 
                            animProp.property == "translationY")){
                        for (j = 0; j < animProp.keyframes.length; ++j){
                            var kf:Keyframe = animProp.keyframes[j];
                            if (this._isValidValue(kf.value)){
                                if (animProp.property == "translationX"){
                                    kf.value += this.transformCenter.x;
                                }
                                else{
                                    kf.value += this.transformCenter.y;
                                }
                            }
                        }
                    }
                }
            }
            super.play();
        }
        
        public animationEnd(animation:Animation):void{
            this.started = false;
            super.animationEnd(animation);
        }

        /**
         * 更新转换中心
         */
        private updateTransformCenter():void{
            if (!this.transformCenter)
                this.transformCenter = new egret.Point(0,0);
            if (this.autoCenterTransform){
                this.transformCenter.x = this.target.width / 2;
                this.transformCenter.y = this.target.height / 2;
            }
        }

        public getCurrentValue(property:string):any{
            switch(property){
                case "translationX":
                case "translationY":{
                    this.updateTransformCenter();
                    var position:egret.Point = TransformUtil.transformPointToParent(<egret.DisplayObject><any> (this.target),this.transformCenter);
                    if (property == "translationX")
                        return position.x;
                    if (property == "translationY")
                        return position.y;
                    break;
                }            
                default:
                    return super.getCurrentValue(property);
            }
        }

        /**
         * 记录上次中心点的位置，当当前计算的中心点和上次位置相差不大时为了防止误差，
         * 就使用上次的值。
         */
        private lastTranslationPoint:Point;
        private static position:egret.Point = new egret.Point();
        public applyValues(anim:Animation):void{
            var tmpScaleX:number;
            var tmpScaleY:number;
            var tmpPosition:egret.Point;
            var tmpRotation:number;

            for (var i:number = 0; i < this.motionPaths.length; ++i){
                if (this.currentValues[this.motionPaths[i].property] !== undefined)
                    this.currentValues[this.motionPaths[i].property] =
                        anim.currentValue[this.motionPaths[i].property];
                else
                    this.setValue(this.motionPaths[i].property,
                        anim.currentValue[this.motionPaths[i].property]);
            }

            tmpRotation = !isNaN(this.currentValues.rotation) ?
                this.currentValues.rotation : this.getCurrentValue("rotation");
            tmpScaleX = !isNaN(this.currentValues.scaleX) ?
                this.currentValues.scaleX : this.getCurrentValue("scaleX");
            tmpScaleY = !isNaN(this.currentValues.scaleY) ?
                this.currentValues.scaleY : this.getCurrentValue("scaleY");

            AnimateTransformInstance.position.x = !isNaN(this.currentValues.translationX) ?
                this.currentValues.translationX :
                this.getCurrentValue("translationX");
            AnimateTransformInstance.position.y = !isNaN(this.currentValues.translationY) ?
                this.currentValues.translationY :
                this.getCurrentValue("translationY");

            if(!this.lastTranslationPoint)
                this.lastTranslationPoint = AnimateTransformInstance.position.clone();
            if(isNaN(this.currentValues.translationX) && Math.abs(AnimateTransformInstance.position.x-this.lastTranslationPoint.x)<0.1)
                AnimateTransformInstance.position.x = this.lastTranslationPoint.x;
            if(isNaN(this.currentValues.translationY) && Math.abs(AnimateTransformInstance.position.y-this.lastTranslationPoint.y)<0.1)
                AnimateTransformInstance.position.y = this.lastTranslationPoint.y;
            this.lastTranslationPoint.x = AnimateTransformInstance.position.x;
            this.lastTranslationPoint.y = AnimateTransformInstance.position.y;
            tmpPosition = AnimateTransformInstance.position;

            TransformUtil.transformAround(<egret.DisplayObject><any> (this.target),
                this.transformCenter,tmpPosition,tmpScaleX,tmpScaleY,tmpRotation);
        }
    }
}