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
     * @class egret.gui.CompositeEffect
     * @classdesc
     * 复合效果的基类
     * @extends egret.gui.Effect
     */
    export class CompositeEffect extends Effect{
        /**
         * @method egret.gui.CompositeEffect#constructor
         */
        public constructor(target:any = null){
            super(target);
            this.instanceClass = CompositeEffectInstance;
        }   
        
        private childTargets:Array<any>;
        
        private _children:Array<Effect> = [];
        /**
         * 子效果的数组。
         * @member egret.gui.CompositeEffect#children
         */
        public get children():Array<Effect>{
            return this._children;
        }

        public set children(value:Array<Effect>){
            var i:number = 0;
            if (this._children)
                for (i = 0; i < this._children.length; ++i)
                    if (this._children[i])
                        this._children[i]._parentCompositeEffect = null;
            this._children = value;
            if (this._children)
                for (i = 0; i < this._children.length; ++i)
                    if (this._children[i])
                        this._children[i]._parentCompositeEffect = this;
        }
        
        /**
         * 返回此效果的总持续时间。
         * @member egret.gui.CompositeEffect#compositeDuration
         */
        public get compositeDuration():number{
            return this.duration;
        }

        public createInstance(target:any = null):IEffectInstance{
            if (!this.childTargets)
                this.childTargets = [ target ];
            
            var newInstance:IEffectInstance = super.createInstance(target);
            
            this.childTargets = null;
            
            return newInstance;
        }

        public createInstances(targets:Array<any> = null):Array<any>{
            if (!targets)
                targets = this.targets;
            
            this.childTargets = targets;
            var newInstance:IEffectInstance = this.createInstance();
            this.childTargets = null;
            return newInstance ? [ newInstance ] : [];
        }

        public _initInstance(instance:IEffectInstance):void{
            super._initInstance(instance);
            
            var compInst:CompositeEffectInstance = <CompositeEffectInstance><any> instance;
            
            var targets:any = this.childTargets;
            if (!(targets instanceof Array))
                targets = [ targets ];
            
            if (this.children){
                var n:number = this.children.length;
                for (var i:number = 0; i < n; i++){
                    var childEffect:Effect = this.children[i];
                    
                    if (childEffect.targets.length == 0){
                        compInst.addChildSet(this.children[i].createInstances(targets));
                    }
                    else{
                        compInst.addChildSet(this.children[i].createInstances(childEffect.targets));
                    }   
                }
            }       
        }   
        
        /**
         * 将新的子效果添加到此复合效果。
         * @method egret.gui.CompositeEffect#addChild
         */
        public addChild(childEffect:Effect):void{
            this.children.push(childEffect);
            childEffect._parentCompositeEffect = this;
        }
    }
}