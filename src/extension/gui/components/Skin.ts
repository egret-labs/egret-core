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
     * @class egret.gui.Skin
     * @classdesc
     * 含有视图状态功能的皮肤基类。
     * @extends egret.EventDispatcher
     * @implements egret.gui.IStateClient
     * @implements egret.gui.ISkin
     * @implements egret.gui.IContainer
     */
    export class Skin extends EventDispatcher
    implements IStateClient, ISkin, IContainer{
        /**
         * 构造函数
         * @method egret.gui.Skin#constructor
         */
        public constructor(){
            super();
            this.skinLayout = new SkinBasicLayout();
            this.skinLayout.target = this;
        }

        /**
         * 组件的最大测量宽度,仅影响measuredWidth属性的取值范围。
         * @member egret.gui.Skin#maxWidth
         */
        public maxWidth:number = 10000;
        /**
         * 组件的最小测量宽度,此属性设置为大于maxWidth的值时无效。仅影响measuredWidth属性的取值范围。
         * @member egret.gui.Skin#minWidth
         */
        public minWidth:number = 0;
        /**
         * 组件的最大测量高度,仅影响measuredHeight属性的取值范围。
         * @member egret.gui.Skin#maxHeight
         */
        public maxHeight:number = 10000;
        /**
         * 组件的最小测量高度,此属性设置为大于maxHeight的值时无效。仅影响measuredHeight属性的取值范围。
         * @member egret.gui.Skin#minHeight
         */
        public minHeight:number = 0;

        public _hasWidthSet:boolean = false;
        public _width:number = NaN;
        /**
         * 组件宽度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         * @member egret.gui.Skin#width
         */
        public get width():number{
            return this._width;
        }
        public set width(value:number){
            if(this._width==value)
                return;
            this._width = value;
            this._hasWidthSet = NumberUtils.isNumber(value);
        }

        public _hasHeightSet:boolean = false;

        public _height:number = NaN;
        /**
         * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         * @member egret.gui.Skin#height
         */
        public get height():number{
            return this._height;
        }

        public set height(value:number) {
            if (this._height == value)
                return;
            this._height = value;
            this._hasHeightSet = NumberUtils.isNumber(value);
        }

        /**
         * 组件的默认宽度（以像素为单位）。此值由 measure() 方法设置。
         * @member egret.gui.Skin#measuredWidth
         */
        public _measuredWidth:number = 0;
        public set measuredWidth(value:number) {
            this._measuredWidth = value;
        }
        public get measuredWidth():number {
            return this._measuredWidth;
        }


        /**
         * 组件的默认高度（以像素为单位）。此值由 measure() 方法设置。
         * @member egret.gui.Skin#measuredHeight
         */
        public measuredHeight:number = 0;

        public get preferredWidth():number{
            return this._hasWidthSet ? this._width:this.measuredWidth;
        }

        public get preferredHeight():number{
            return this._hasHeightSet ? this._height:this.measuredHeight;
        }

        private _initialized:boolean = false;
        /**
         * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
         * 请务必调用super.createChildren()以完成父类组件的初始化
         * @method egret.gui.Skin#createChildren
         */
        public createChildren():void{

        }

        private _hostComponent: SkinnableComponent = null;
        /**
         * @member egret.gui.Skin#hostComponent
         */
        public get hostComponent():SkinnableComponent{
            return this._hostComponent;
        }
        /**
         * @inheritDoc
         */
        public set hostComponent(value:SkinnableComponent){
            this._setHostComponent(value);
        }

        /**
         *
         * @param value
         * @private
         */
        public _setHostComponent(value:SkinnableComponent){
            if(this._hostComponent==value)
                return;
            var i:number;
            if(this._hostComponent){
                for(i = this._elementsContent.length - 1; i >= 0; i--){
                    this._elementRemoved(this._elementsContent[i], i);
                }
            }

            this._hostComponent = value;
            if(!this._initialized){
                this._initialized = true;
                this.createChildren();
            }

            if(this._hostComponent){
                var n:number = this._elementsContent.length;
                for (i = 0; i < n; i++){
                    this._elementAdded(this._elementsContent[i], i);
                }

                this.initializeStates();

                if(this.currentStateChanged){
                    this.commitCurrentState();
                }
            }
        }

        private _elementsContent:Array<any> = [];
        /**
         * 返回子元素列表
         */
        public _getElementsContent():Array<any>{
            return this._elementsContent;
        }

        /**
         * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
         * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
         */
        public set elementsContent(value:Array<any>){
            if(value==null)
                value = [];
            if(value==this._elementsContent)
                return;
            if(this._hostComponent){
                var i:number;
                for (i = this._elementsContent.length - 1; i >= 0; i--){
                    this._elementRemoved(this._elementsContent[i], i);
                }

                this._elementsContent = value.concat();

                var n:number = this._elementsContent.length;
                for (i = 0; i < n; i++){
                    var elt:IVisualElement = this._elementsContent[i];

                    if(elt.parent&&"removeElement" in elt.parent)
                        (<IVisualElementContainer><any> (elt.parent)).removeElement(elt);
                    else if(elt.owner&&"removeElement" in elt.owner)
                        (<IContainer><any> (elt.owner)).removeElement(elt);
                    this._elementAdded(elt, i);
                }
            }
            else{
                this._elementsContent = value.concat();
            }
        }

        /**
         * @member egret.gui.Skin#numElements
         */
        public get numElements():number{
            return this._elementsContent.length;
        }

        /**
         * 如果存在视域，且传入的索引为 0，则返回该视域
         * @method egret.gui.Skin#getElementAt
         * @param index {number}
         * @returns {IVisualElement}
         */
        public getElementAt(index:number):IVisualElement{
            this.checkForRangeError(index);
            return this._elementsContent[index];
        }

        private checkForRangeError(index:number, addingElement:boolean = false):void{
            var maxIndex:number = this._elementsContent.length - 1;

            if (addingElement)
                maxIndex++;

            if (index < 0 || index > maxIndex)
                egret.$error(3011, index);
        }
        /**
         * 将可视元素添加到此容器中
         * @method egret.gui.Skin#addElement
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        public addElement(element:IVisualElement):IVisualElement{
            var index:number = this.numElements;

            if (element.owner == this)
                index = this.numElements-1;

            return this.addElementAt(element, index);
        }
        /**
         * 将可视元素添加到此容器中
         * @method egret.gui.Skin#addElementAt
         * @param element {IVisualElement}
         * @param index {number}
         * @returns {IVisualElement}
         */
        public addElementAt(element:IVisualElement, index:number):IVisualElement{
            this.checkForRangeError(index, true);

            var host:any = element.owner;
            if (host == this){
                this.setElementIndex(element, index);
                return element;
            }
            else if(host&&"removeElement" in host){
                (<IContainer><any> host).removeElement(element);
            }

            this._elementsContent.splice(index, 0, element);

            if(this._hostComponent)
                this._elementAdded(element, index);
            else
                element.ownerChanged(this);

            return element;
        }
        /**
         * 从此容器的子列表中删除指定的可视元素
         * @method egret.gui.Skin#removeElement
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        public removeElement(element:IVisualElement):IVisualElement{
            return this.removeElementAt(this.getElementIndex(element));
        }
        /**
         * 从容器中的指定索引位置删除可视元素
         * @method egret.gui.Skin#removeElementAt
         * @param index {number}
         * @returns {IVisualElement}
         */
        public removeElementAt(index:number):IVisualElement{
            this.checkForRangeError(index);

            var element:IVisualElement = this._elementsContent[index];

            if(this._hostComponent)
                this._elementRemoved(element, index);
            else
                element.ownerChanged(null);
            this._elementsContent.splice(index, 1);

            return element;
        }

        /**
         * 返回可视元素的索引位置
         * @method egret.gui.Skin#getElementIndex
         * @param element {IVisualElement}
         * @returns {number}
         */
        public getElementIndex(element:IVisualElement):number{
            return this._elementsContent.indexOf(element);
        }
        /**
         * 按照索引添加到容器
         * @method egret.gui.Skin#setElementIndex
         * @param element {IVisualElement}
         * @param index {number}
         */
        public setElementIndex(element:IVisualElement, index:number):void{
            this.checkForRangeError(index);

            var oldIndex:number = this.getElementIndex(element);
            if (oldIndex==-1||oldIndex == index)
                return;

            if(this._hostComponent)
                this._elementRemoved(element, oldIndex, false);

            this._elementsContent.splice(oldIndex, 1);
            this._elementsContent.splice(index, 0, element);

            if(this._hostComponent)
                this._elementAdded(element, index, false);
        }

        /**
         * 添加一个显示元素到容器
         * @param element {IVisualElement}
         * @param index {number}
         * @param notifyListeners {boolean}
         */
        public _elementAdded(element:IVisualElement, index:number, notifyListeners:boolean = true):void{
            element.ownerChanged(this);
            if(element instanceof DisplayObject){
                var childDO:DisplayObject = <DisplayObject><any> element;
                this._hostComponent._addToDisplayListAt(childDO,index,notifyListeners);
            }

            if (notifyListeners){
                if (this.hasEventListener(ElementExistenceEvent.ELEMENT_ADD))
                    ElementExistenceEvent.dispatchElementExistenceEvent(this,
                        ElementExistenceEvent.ELEMENT_ADD,element,index);
            }

            this._hostComponent.invalidateSize();
            this._hostComponent.invalidateDisplayList();
        }
        /**
         * 从容器移除一个显示元素
         * @param element {IVisualElement}
         * @param index {number}
         * @param notifyListeners {boolean}
         */
        public _elementRemoved(element:IVisualElement, index:number, notifyListeners:boolean = true):void{
            if (notifyListeners){
                if (this.hasEventListener(ElementExistenceEvent.ELEMENT_REMOVE))
                    ElementExistenceEvent.dispatchElementExistenceEvent(this,
                        ElementExistenceEvent.ELEMENT_REMOVE,element,index);
            }

            if(element instanceof DisplayObject&&element.parent==this._hostComponent){
                var childDO:DisplayObject = <DisplayObject><any> element;
                this._hostComponent._removeFromDisplayList(childDO,notifyListeners);
            }

            element.ownerChanged(null);
            this._hostComponent.invalidateSize();
            this._hostComponent.invalidateDisplayList();
        }


        private skinLayout: SkinBasicLayout = null;
        /**
         * 测量组件尺寸
         * @method egret.gui.Skin#measure
         */
        public measure():void{
            this.skinLayout.measure();
            if(this.measuredWidth<this.minWidth){
                this.measuredWidth = this.minWidth;
            }
            if(this.measuredWidth>this.maxWidth){
                this.measuredWidth = this.maxWidth;
            }
            if(this.measuredHeight<this.minHeight){
                this.measuredHeight = this.minHeight;
            }
            if(this.measuredHeight>this.maxHeight){
                this.measuredHeight = this.maxHeight
            }
        }

        /**
         * 更新显示列表
         * @method egret.gui.Skin#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
            this.skinLayout.updateDisplayList(unscaledWidth,unscaledHeight);
        }

        //========================state相关函数===============start=========================

        private _states:Array<any> = [];
        /**
         * 为此组件定义的视图状态。
         * @member egret.StateClientHelper#states
         */
        public get states():Array<any>{
            return this._states;
        }
        public set states(value:Array<any>){
            this._setStates(value);
        }

        public _setStates(value:Array<any>){
            if(!value)
                value = [];
            if(typeof(value[0]) == "string"){
                var length:number = value.length;
                for(var i:number=0;i<length;i++){
                    var state:State = new State(value[i],[]);
                    value[i] = state;
                }
            }

            this._states = value;
            this.currentStateChanged = true;
            this.requestedCurrentState = this._currentState;
            if(!this.hasState(this.requestedCurrentState)){
                this.requestedCurrentState = this.getDefaultState();
            }
        }

        /**
         * 当前的过渡效果
         */
        private _currentTransition:Transition;
        private _transitions:Array<Transition>;
        /**
         *  一个 Transition 对象 Array，其中的每个 Transition 对象都定义一组效果，
         * 用于在视图状态发生更改时播放。
         */
        public get transitions():Array<Transition>
        {
            return this._transitions;
        }

        public set transitions(value:Array<Transition>)
        {
            this._transitions = value;
        }

        /**
         * 播放过渡效果的标志
         */
        private playStateTransition:boolean = true;
        private transitionFromState:string;
        private transitionToState:string;

        /**
         * 当前视图状态发生改变的标志
         */
        private currentStateChanged:boolean = false;

        private _currentState: string = null;
        /**
         * 存储还未验证的视图状态
         */
        private requestedCurrentState: string = null;
        /**
         * 组件的当前视图状态。将其设置为 "" 或 null 可将组件重置回其基本状态。
         * @member egret.StateClientHelper#currentState
         */
        public get currentState():string{
            if(this.currentStateChanged)
                return this.requestedCurrentState;
            return this._currentState?this._currentState:this.getDefaultState();
        }

        public set currentState(value:string){
            if(!value)
                value = this.getDefaultState();
            if (value != this.currentState &&value&&this.currentState){
                this.requestedCurrentState = value;
                this.currentStateChanged = true;
                if (this._hostComponent){
                    this.commitCurrentState();
                }
            }
        }

        /**
         * 返回是否含有指定名称的视图状态
         * @method egret.gui.Skin#hasState
         * @param stateName {string}
         * @returns {boolean}
         */
        public hasState(stateName:string):boolean{
            return (this.getState(stateName) != null);
        }

        /**
         * 返回默认状态
         */
        private getDefaultState():string{
            if(this._states.length>0){
                return this._states[0].name;
            }
            return null;
        }
        /**
         * 应用当前的视图状态。子类覆盖此方法在视图状态发生改变时执行相应更新操作。
         * @method egret.gui.Skin#commitCurrentState
         */
        public commitCurrentState():void{
            if(!this.currentStateChanged)
                return;
            this.currentStateChanged = false;
            var destination:State = this.getState(this.requestedCurrentState);
            if(!destination){
                this.requestedCurrentState = this.getDefaultState();
            }

            var nextTransition:Transition;
            if(this.playStateTransition){
                nextTransition = this.getTransition(this._currentState, this.requestedCurrentState);
            }

            var prevTransitionFraction:number;
            var prevTransitionEffect:IEffect;

            if (this._currentTransition){
                this._currentTransition.effect.removeEventListener(
                    EffectEvent.EFFECT_END, this.transition_effectEndHandler, this);

                if (nextTransition && this._currentTransition.interruptionBehavior == InterruptionBehavior.STOP){
                    prevTransitionEffect = this._currentTransition.effect;
                    prevTransitionEffect.stop();
                }
                else{
                    if (this._currentTransition.autoReverse &&
                        this.transitionFromState == this.requestedCurrentState &&
                        this.transitionToState == this._currentState){
                        if (this._currentTransition.effect.duration == 0)
                            prevTransitionFraction = 0;
                        else
                            prevTransitionFraction =
                                this._currentTransition.effect.playheadTime /
                                this.getTotalDuration(this._currentTransition.effect);
                    }
                    this._currentTransition.effect.end();
                }
                this._currentTransition = null;
            }

            var oldState:string = this._currentState ? this._currentState : "";
            if (this.hasEventListener(StateChangeEvent.CURRENT_STATE_CHANGING)) {
                StateChangeEvent.dispatchStateChangeEvent(this,
                    StateChangeEvent.CURRENT_STATE_CHANGING,oldState,
                    this.requestedCurrentState ? this.requestedCurrentState : "");
            }

            this.removeState(this._currentState);
            this._currentState = this.requestedCurrentState;

            if (this._currentState) {
                this.applyState(this._currentState);
            }

            if (this.hasEventListener(StateChangeEvent.CURRENT_STATE_CHANGE)){
                StateChangeEvent.dispatchStateChangeEvent(this,StateChangeEvent.CURRENT_STATE_CHANGE,oldState,
                    this._currentState ? this._currentState : "")
            }

            if (nextTransition){
                var reverseTransition:boolean =
                    nextTransition && nextTransition.autoReverse &&
                    (nextTransition.toState == oldState ||
                        nextTransition.fromState == this._currentState);
                UIGlobals._layoutManager.validateNow();
                this._currentTransition = nextTransition;
                this.transitionFromState = oldState;
                this.transitionToState = this._currentState;

                nextTransition.effect.addEventListener(EffectEvent.EFFECT_END, this.transition_effectEndHandler, this);
                nextTransition.effect.play(null, reverseTransition);
                if (!isNaN(prevTransitionFraction) && nextTransition.effect.duration != 0){
                    nextTransition.effect.playheadTime = (1 - prevTransitionFraction) * this.getTotalDuration(nextTransition.effect);
                }
            }
            else
            {
                if (this.hasEventListener(StateChangeEvent.STATE_CHANGE_COMPLETE)){
                    StateChangeEvent.dispatchStateChangeEvent(
					this, StateChangeEvent.STATE_CHANGE_COMPLETE, oldState, this._currentState);
                }
            }
        }

        private transition_effectEndHandler(event:EffectEvent):void
        {
            this._currentTransition = null;
            if (this.hasEventListener(StateChangeEvent.STATE_CHANGE_COMPLETE)){
                StateChangeEvent.dispatchStateChangeEvent(
				this,StateChangeEvent.STATE_CHANGE_COMPLETE, this.transitionFromState, this.transitionToState);
            }
        }


        /**
         * 通过名称返回视图状态
         */
        private getState(stateName:string):State{
            if (!stateName)
                return null;
            var states:Array<any> = this._states;
            var length:number = states.length;
            for (var i:number = 0; i < length; i++){
                var state:State = states[i];
                if (state.name == stateName)
                    return state;
            }
            return null;
        }

        /**
         * 移除指定的视图状态以及所依赖的所有父级状态，除了与新状态的共同状态外
         */
        private removeState(stateName:string):void{
            var state:State = this.getState(stateName);
            if (state){
                var overrides:Array<IOverride> = state.overrides;
                for (var i:number = overrides.length-1; i>=0; i--)
                    overrides[i].remove(this);
            }
        }

        /**
         * 应用新状态
         */
        private applyState(stateName:string):void{
            var state:State = this.getState(stateName);
            if (state){
                var overrides:Array<any> = state.overrides;
                var length:number = overrides.length;
                for (var i:number = 0; i < length; i++)
                    overrides[i].apply(<IContainer><any>(this));
            }
        }

        private initialized:boolean = false;
        /**
         * 初始化所有视图状态
         * @method egret.StateClientHelper#initializeStates
         */
        public initializeStates():void{
            if(this.initialized)
                return;
            this.initialized = true;
            var states:Array<any> = this._states;
            var length:number = states.length;
            for (var i:number = 0; i < length; i++){
                var state:State = <State> (states[i]);
                state.initialize(this);
            }
        }

        /**
         *  获取两个状态之间的过渡
         */
        private getTransition(oldState:string, newState:string):Transition
        {
            var result:Transition = null;
            var priority:number = 0;
            if (!this.transitions)
                return null;

            if (!oldState)
                oldState = "";

            if (!newState)
                newState = "";

            for (var i:number = 0; i < this.transitions.length; i++){
                var t:Transition = this.transitions[i];
                if (t.fromState == "*" && t.toState == "*" && priority < 1){
                    result = t;
                    priority = 1;
                }
                else if (t.toState == oldState && t.fromState == "*" && t.autoReverse && priority < 2){
                    result = t;
                    priority = 2;
                }
                else if (t.toState == "*" && t.fromState == newState && t.autoReverse && priority < 3){
                    result = t;
                    priority = 3;
                }
                else if (t.toState == oldState && t.fromState == newState && t.autoReverse && priority < 4){
                    result = t;
                    priority = 4;
                }
                else if (t.fromState == oldState && t.toState == "*" && priority < 5){
                    result = t;
                    priority = 5;
                }
                else if (t.fromState == "*" && t.toState == newState && priority < 6){
                    result = t;
                    priority = 6;
                }
                else if (t.fromState == oldState && t.toState == newState && priority < 7){
                    result = t;
                    priority = 7;
                    break;
                }
            }

            if (result && !result.effect)
                result = null;
            return result;
        }

        /**
         * 效果的总持续时间
         */
        private getTotalDuration(effect:IEffect):number
        {
            var duration:number = 0;
            var effectObj:any = effect;
            if (effect instanceof CompositeEffect){
                duration = effectObj.compositeDuration;
            }
            else{
                duration = effect.duration;
            }
            var repeatDelay:number = ("repeatDelay" in effect) ?
                effectObj.repeatDelay : 0;
            var repeatCount:number = ("repeatCount" in effect) ?
                effectObj.repeatCount : 0;
            var startDelay:number = ("startDelay" in effect) ?
                effectObj.startDelay : 0;
            duration = duration * repeatCount +
                (repeatDelay * (repeatCount - 1)) +
                startDelay;
            return duration;
        }
        //========================state相关函数===============end=========================
    }
}