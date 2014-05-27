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
module dragonBones {
    export module geom {
        export class Point {
            public x:number;
            public y:number;

            constructor(x:number = 0, y:number = 0) {
                this.x = x;
                this.y = y;
            }

            public toString():string {
                return "[Point (x=" + this.x + " y=" + this.y + ")]";
            }
        }

        export class Rectangle {
            public x:number;
            public y:number;
            public width:number;
            public height:number;

            constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
        }

        export class Matrix {
            public a:number;
            public b:number;
            public c:number;
            public d:number;
            public tx:number;
            public ty:number;

            constructor() {
                this.a = 1;
                this.b = 0;
                this.c = 0;
                this.d = 1;
                this.tx = 0;
                this.ty = 0;
            }

            public invert():void {
                var a1:number = this.a;
                var b1:number = this.b;
                var c1:number = this.c;
                var d1:number = this.d;
                var tx1:number = this.tx;
                var n:number = a1 * d1 - b1 * c1;

                this.a = d1 / n;
                this.b = -b1 / n;
                this.c = -c1 / n;
                this.d = a1 / n;
                this.tx = (c1 * this.ty - d1 * tx1) / n;
                this.ty = -(a1 * this.ty - b1 * tx1) / n;
            }
        }

        export class ColorTransform {
            public alphaMultiplier:number;
            public alphaOffset:number
            public blueMultiplier:number;
            public blueOffset:number;
            public greenMultiplier:number;
            public greenOffset:number;
            public redMultiplier:number;
            public redOffset:number;

            constructor() {
                this.alphaMultiplier = 0;
                this.alphaOffset = 0;
                this.blueMultiplier = 0;
                this.blueOffset = 0;
                this.greenMultiplier = 0;
                this.greenOffset = 0;
                this.redMultiplier = 0;
                this.redOffset = 0;
            }
        }
    }

    export module events {
        export class Event {
            public type:string;
            public target:EventDispatcher;

            constructor(type:string) {
                this.type = type;
            }
        }

        export class AnimationEvent extends Event {
            public static FADE_IN:string = "fadeIn";
            public static FADE_OUT:string = "fadeOut";
            public static START:string = "start";
            public static COMPLETE:string = "complete";
            public static LOOP_COMPLETE:string = "loopComplete";
            public static FADE_IN_COMPLETE:string = "fadeInComplete";
            public static FADE_OUT_COMPLETE:string = "fadeOutComplete";

            public animationState:animation.AnimationState;
            public armature:Armature;

            constructor(type:string) {
                super(type);
            }
        }

        export class ArmatureEvent extends Event {
            public static Z_ORDER_UPDATED:string = "zOrderUpdated";

            constructor(type:string) {
                super(type);
            }
        }

        export class FrameEvent extends Event {
            public static ANIMATION_FRAME_EVENT:string = "animationFrameEvent";
            public static BONE_FRAME_EVENT:string = "boneFrameEvent";

            public animationState:animation.AnimationState;
            public armature:Armature;
            public bone:Bone;
            public frameLabel:string;

            constructor(type:string) {
                super(type);
            }
        }

        export class SoundEvent extends Event {
            public static SOUND:string = "sound";
            public static BONE_FRAME_EVENT:string = "boneFrameEvent";

            public animationState:animation.AnimationState;
            public armature:Armature;
            public sound:string;

            constructor(type:string) {
                super(type);
            }
        }

        export class EventDispatcher {
            private _listenersMap:Object;

            constructor() {
            }

            public hasEventListener(type:string):boolean {
                if (this._listenersMap && this._listenersMap[type]) {
                    return true;
                }
                return false;
            }

            public addEventListener(type:string, listener:Function):void {
                if (type && listener) {
                    if (!this._listenersMap) {
                        this._listenersMap = {};
                    }
                    var listeners:Array<Function> = this._listenersMap[type];
                    if (listeners) {
                        this.removeEventListener(type, listener);
                    }
                    if (listeners) {
                        listeners.push(listener);
                    }
                    else {
                        this._listenersMap[type] = [listener];
                    }
                }
            }

            public removeEventListener(type:string, listener:Function):void {
                if (!this._listenersMap || !type || !listener) {
                    return;
                }
                var listeners:Array<Function> = this._listenersMap[type];
                if (listeners) {
                    var length:number = listeners.length;
                    for (var i:number = 0; i < length; i++) {
                        if (listeners[i] == listener) {
                            if (length == 1) {
                                listeners.length = 0;
                                delete this._listenersMap[type];
                            }
                            else {
                                listeners.splice(i, 1);
                            }
                        }
                    }
                }
            }

            public removeAllEventListeners(type:string):void {
                if (type) {
                    delete this._listenersMap[type];
                }
                else {
                    this._listenersMap = null;
                }
            }

            public dispatchEvent(event:Event):void {
                if (event) {
                    var listeners:Array<Function> = this._listenersMap[event.type];
                    if (listeners) {
                        event.target = this;
                        var listenersCopy:Array<Function> = listeners.concat();
                        var length:number = listeners.length;
                        for (var i:number = 0; i < length; i++) {
                            listenersCopy[i](event);
                        }
                    }
                }
            }
        }

        export class SoundEventManager extends EventDispatcher {
            private static _instance:SoundEventManager;

            public static getInstance():SoundEventManager {
                if (!SoundEventManager._instance) {
                    SoundEventManager._instance = new SoundEventManager();
                }
                return SoundEventManager._instance;
            }

            constructor() {
                super();
                if (SoundEventManager._instance) {
                    throw new Error("Singleton already constructed!");
                }
            }
        }
    }

    export module animation {
        export interface IAnimatable {
            advanceTime(passedTime:number):void;
        }

        export class WorldClock implements IAnimatable {
            public static clock:WorldClock = new WorldClock();

            public time:number;
            public timeScale:number;

            private _animatableList:Array<IAnimatable>;

            constructor() {
                this.timeScale = 1;
                this.time = new Date().getTime() * 0.001;
                this._animatableList = [];
            }

            public contains(animatable:IAnimatable):boolean {
                return this._animatableList.indexOf(animatable) >= 0;
            }

            public add(animatable:IAnimatable):void {
                if (animatable && this._animatableList.indexOf(animatable) == -1) {
                    this._animatableList.push(animatable);
                }
            }

            public remove(animatable:IAnimatable):void {
                var index:number = this._animatableList.indexOf(animatable);
                if (index >= 0) {
                    this._animatableList[index] = null;
                }
            }

            public clear():void {
                this._animatableList.length = 0;
            }

            public advanceTime(passedTime:number):void {
                if (passedTime < 0) {
                    var currentTime:number = new Date().getTime() * 0.001;
                    passedTime = currentTime - this.time;
                    this.time = currentTime;
                }

                passedTime *= this.timeScale;

                var length:number = this._animatableList.length;
                if (length == 0) {
                    return;
                }
                var currentIndex:number = 0;

                for (var i:number = 0; i < length; i++) {
                    var animatable:IAnimatable = this._animatableList[i];
                    if (animatable) {
                        if (currentIndex != i) {
                            this._animatableList[currentIndex] = animatable;
                            this._animatableList[i] = null;
                        }
                        animatable.advanceTime(passedTime);
                        currentIndex++;
                    }
                }

                if (currentIndex != i) {
                    length = this._animatableList.length;
                    while (i < length) {
                        this._animatableList[currentIndex++] = this._animatableList[i++];
                    }
                    this._animatableList.length = currentIndex;
                }
            }
        }

        export class TimelineState {
            private static HALF_PI:number = Math.PI * 0.5;

            private static _pool:Array<TimelineState> = [];

            public static _borrowObject():TimelineState {
                if (TimelineState._pool.length == 0) {
                    return new TimelineState();
                }
                return TimelineState._pool.pop();
            }

            /** @private */
            public static _returnObject(timeline:TimelineState):void {
                if (TimelineState._pool.indexOf(timeline) < 0) {
                    TimelineState._pool[TimelineState._pool.length] = timeline;
                }

                timeline.clear();
            }

            /** @private */
            public static _clear():void {
                var i:number = TimelineState._pool.length;
                while (i--) {
                    TimelineState._pool[i].clear();
                }
                TimelineState._pool.length = 0;
            }

            public static getEaseValue(value:number, easing:number):number {
                if (easing > 1) {
                    var valueEase:number = 0.5 * (1 - Math.cos(value * Math.PI)) - value;
                    easing -= 1;
                }
                else if (easing > 0) {
                    valueEase = Math.sin(value * TimelineState.HALF_PI) - value;
                }
                else if (easing < 0) {
                    valueEase = 1 - Math.cos(value * TimelineState.HALF_PI) - value;
                    easing *= -1;
                }
                return valueEase * easing + value;
            }

            public transform:objects.DBTransform;
            public pivot:geom.Point;
            public tweenActive:boolean;

            private _updateState:number;

            private _animationState:AnimationState;
            private _bone:Bone;
            private _timeline:objects.TransformTimeline;
            private _currentFrame:objects.TransformFrame;
            private _currentFramePosition:number;
            private _currentFrameDuration:number;
            private _durationTransform:objects.DBTransform;
            private _durationPivot:geom.Point;
            private _durationColor:geom.ColorTransform;
            private _originTransform:objects.DBTransform;
            private _originPivot:geom.Point;

            private _tweenEasing:number;
            private _tweenTransform:boolean;
            private _tweenColor:boolean;

            private _totalTime:number;

            constructor() {
                this.transform = new objects.DBTransform();
                this.pivot = new geom.Point();

                this._durationTransform = new objects.DBTransform();
                this._durationPivot = new geom.Point();
                this._durationColor = new geom.ColorTransform();
            }

            public fadeIn(bone:Bone, animationState:AnimationState, timeline:objects.TransformTimeline):void {
                this._bone = bone;
                this._animationState = animationState;
                this._timeline = timeline;

                this._originTransform = this._timeline.originTransform;
                this._originPivot = this._timeline.originPivot;

                this._tweenTransform = false;
                this._tweenColor = false;

                this._totalTime = this._animationState.totalTime;

                this.transform.x = 0;
                this.transform.y = 0;
                this.transform.scaleX = 0;
                this.transform.scaleY = 0;
                this.transform.skewX = 0;
                this.transform.skewY = 0;
                this.pivot.x = 0;
                this.pivot.y = 0;

                this._durationTransform.x = 0;
                this._durationTransform.y = 0;
                this._durationTransform.scaleX = 0;
                this._durationTransform.scaleY = 0;
                this._durationTransform.skewX = 0;
                this._durationTransform.skewY = 0;
                this._durationPivot.x = 0;
                this._durationPivot.y = 0;

                this._currentFrame = null;

                switch (this._timeline.getFrameList().length) {
                    case 0:
                        this._bone._arriveAtFrame(null, this, this._animationState, false);
                        this._updateState = 0;
                        break;
                    case 1:
                        this._updateState = -1;
                        break;
                    default:
                        this._updateState = 1;
                        break;
                }
            }

            public fadeOut():void {
                this.transform.skewX = utils.TransformUtil.formatRadian(this.transform.skewX);
                this.transform.skewY = utils.TransformUtil.formatRadian(this.transform.skewY);
            }

            public update(progress:number):void {
                if (this._updateState) {
                    if (this._updateState > 0) {
                        if (this._timeline.scale == 0) {
                            progress = 1;
                        }
                        else {
                            progress /= this._timeline.scale;
                        }

                        if (progress == 1) {
                            progress = 0.99999999;
                        }

                        progress += this._timeline.offset;
                        var loopCount:number = Math.floor(progress);
                        progress -= loopCount;
                        //
                        var playedTime:number = this._totalTime * progress;
                        var isArrivedFrame:boolean = false;
                        var frameIndex:number;
                        while (!this._currentFrame || playedTime > this._currentFramePosition + this._currentFrameDuration || playedTime < this._currentFramePosition) {
                            if (isArrivedFrame) {
                                this._bone._arriveAtFrame(this._currentFrame, this, this._animationState, true);
                            }
                            isArrivedFrame = true;
                            if (this._currentFrame) {
                                frameIndex = this._timeline.getFrameList().indexOf(this._currentFrame) + 1;
                                if (frameIndex >= this._timeline.getFrameList().length) {
                                    frameIndex = 0;
                                }
                                this._currentFrame = <objects.TransformFrame> this._timeline.getFrameList()[frameIndex];
                            }
                            else {
                                frameIndex = 0;
                                this._currentFrame = <objects.TransformFrame> this._timeline.getFrameList()[0];
                            }
                            this._currentFrameDuration = this._currentFrame.duration;
                            this._currentFramePosition = this._currentFrame.position;
                        }

                        if (isArrivedFrame) {
                            this.tweenActive = this._currentFrame.displayIndex >= 0;
                            frameIndex++;
                            if (frameIndex >= this._timeline.getFrameList().length) {
                                frameIndex = 0;
                            }
                            var nextFrame:objects.TransformFrame = <objects.TransformFrame> this._timeline.getFrameList()[frameIndex];

                            if (
                                frameIndex == 0 &&
                                    this._animationState.loop &&
                                    this._animationState.loopCount >= Math.abs(this._animationState.loop) - 1 &&
                                    ((this._currentFramePosition + this._currentFrameDuration) / this._totalTime + loopCount - this._timeline.offset) * this._timeline.scale > 0.99999999
                                ) {
                                this._updateState = 0;
                                this._tweenEasing = NaN;
                            }
                            else if (this._currentFrame.displayIndex < 0 || nextFrame.displayIndex < 0 || !this._animationState.tweenEnabled) {
                                this._tweenEasing = NaN;
                            }
                            else if (isNaN(this._animationState.clip.tweenEasing)) {
                                this._tweenEasing = this._currentFrame.tweenEasing;
                            }
                            else {
                                this._tweenEasing = this._animationState.clip.tweenEasing;
                            }

                            if (isNaN(this._tweenEasing)) {
                                this._tweenTransform = false;
                                this._tweenColor = false;
                            }
                            else {
                                this._durationTransform.x = nextFrame.transform.x - this._currentFrame.transform.x;
                                this._durationTransform.y = nextFrame.transform.y - this._currentFrame.transform.y;
                                this._durationTransform.skewX = nextFrame.transform.skewX - this._currentFrame.transform.skewX;
                                this._durationTransform.skewY = nextFrame.transform.skewY - this._currentFrame.transform.skewY;
                                this._durationTransform.scaleX = nextFrame.transform.scaleX - this._currentFrame.transform.scaleX;
                                this._durationTransform.scaleY = nextFrame.transform.scaleY - this._currentFrame.transform.scaleY;

                                if (frameIndex == 0) {
                                    this._durationTransform.skewX = utils.TransformUtil.formatRadian(this._durationTransform.skewX);
                                    this._durationTransform.skewY = utils.TransformUtil.formatRadian(this._durationTransform.skewY);
                                }

                                this._durationPivot.x = nextFrame.pivot.x - this._currentFrame.pivot.x;
                                this._durationPivot.y = nextFrame.pivot.y - this._currentFrame.pivot.y;

                                if (
                                    this._durationTransform.x != 0 ||
                                        this._durationTransform.y != 0 ||
                                        this._durationTransform.skewX != 0 ||
                                        this._durationTransform.skewY != 0 ||
                                        this._durationTransform.scaleX != 0 ||
                                        this._durationTransform.scaleY != 0 ||
                                        this._durationPivot.x != 0 ||
                                        this._durationPivot.y != 0
                                    ) {
                                    this._tweenTransform = true;
                                }
                                else {
                                    this._tweenTransform = false;
                                }

                                if (this._currentFrame.color && nextFrame.color) {
                                    this._durationColor.alphaOffset = nextFrame.color.alphaOffset - this._currentFrame.color.alphaOffset;
                                    this._durationColor.redOffset = nextFrame.color.redOffset - this._currentFrame.color.redOffset;
                                    this._durationColor.greenOffset = nextFrame.color.greenOffset - this._currentFrame.color.greenOffset;
                                    this._durationColor.blueOffset = nextFrame.color.blueOffset - this._currentFrame.color.blueOffset;

                                    this._durationColor.alphaMultiplier = nextFrame.color.alphaMultiplier - this._currentFrame.color.alphaMultiplier;
                                    this._durationColor.redMultiplier = nextFrame.color.redMultiplier - this._currentFrame.color.redMultiplier;
                                    this._durationColor.greenMultiplier = nextFrame.color.greenMultiplier - this._currentFrame.color.greenMultiplier;
                                    this._durationColor.blueMultiplier = nextFrame.color.blueMultiplier - this._currentFrame.color.blueMultiplier;

                                    if (
                                        this._durationColor.alphaOffset != 0 ||
                                            this._durationColor.redOffset != 0 ||
                                            this._durationColor.greenOffset != 0 ||
                                            this._durationColor.blueOffset != 0 ||
                                            this._durationColor.alphaMultiplier != 0 ||
                                            this._durationColor.redMultiplier != 0 ||
                                            this._durationColor.greenMultiplier != 0 ||
                                            this._durationColor.blueMultiplier != 0
                                        ) {
                                        this._tweenColor = true;
                                    }
                                    else {
                                        this._tweenColor = false;
                                    }
                                }
                                else if (this._currentFrame.color) {
                                    this._tweenColor = true;
                                    this._durationColor.alphaOffset = -this._currentFrame.color.alphaOffset;
                                    this._durationColor.redOffset = -this._currentFrame.color.redOffset;
                                    this._durationColor.greenOffset = -this._currentFrame.color.greenOffset;
                                    this._durationColor.blueOffset = -this._currentFrame.color.blueOffset;

                                    this._durationColor.alphaMultiplier = 1 - this._currentFrame.color.alphaMultiplier;
                                    this._durationColor.redMultiplier = 1 - this._currentFrame.color.redMultiplier;
                                    this._durationColor.greenMultiplier = 1 - this._currentFrame.color.greenMultiplier;
                                    this._durationColor.blueMultiplier = 1 - this._currentFrame.color.blueMultiplier;
                                }
                                else if (nextFrame.color) {
                                    this._tweenColor = true;
                                    this._durationColor.alphaOffset = nextFrame.color.alphaOffset;
                                    this._durationColor.redOffset = nextFrame.color.redOffset;
                                    this._durationColor.greenOffset = nextFrame.color.greenOffset;
                                    this._durationColor.blueOffset = nextFrame.color.blueOffset;

                                    this._durationColor.alphaMultiplier = nextFrame.color.alphaMultiplier - 1;
                                    this._durationColor.redMultiplier = nextFrame.color.redMultiplier - 1;
                                    this._durationColor.greenMultiplier = nextFrame.color.greenMultiplier - 1;
                                    this._durationColor.blueMultiplier = nextFrame.color.blueMultiplier - 1;
                                }
                                else {
                                    this._tweenColor = false;
                                }
                            }

                            if (!this._tweenTransform) {
                                if (this._animationState.blend) {
                                    this.transform.x = this._originTransform.x + this._currentFrame.transform.x;
                                    this.transform.y = this._originTransform.y + this._currentFrame.transform.y;
                                    this.transform.skewX = this._originTransform.skewX + this._currentFrame.transform.skewX;
                                    this.transform.skewY = this._originTransform.skewY + this._currentFrame.transform.skewY;
                                    this.transform.scaleX = this._originTransform.scaleX + this._currentFrame.transform.scaleX;
                                    this.transform.scaleY = this._originTransform.scaleY + this._currentFrame.transform.scaleY;

                                    this.pivot.x = this._originPivot.x + this._currentFrame.pivot.x;
                                    this.pivot.y = this._originPivot.y + this._currentFrame.pivot.y;
                                }
                                else {
                                    this.transform.x = this._currentFrame.transform.x;
                                    this.transform.y = this._currentFrame.transform.y;
                                    this.transform.skewX = this._currentFrame.transform.skewX;
                                    this.transform.skewY = this._currentFrame.transform.skewY;
                                    this.transform.scaleX = this._currentFrame.transform.scaleX;
                                    this.transform.scaleY = this._currentFrame.transform.scaleY;

                                    this.pivot.x = this._currentFrame.pivot.x;
                                    this.pivot.y = this._currentFrame.pivot.y;
                                }
                            }

                            if (!this._tweenColor) {
                                if (this._currentFrame.color) {
                                    this._bone._updateColor(
                                        this._currentFrame.color.alphaOffset,
                                        this._currentFrame.color.redOffset,
                                        this._currentFrame.color.greenOffset,
                                        this._currentFrame.color.blueOffset,
                                        this._currentFrame.color.alphaMultiplier,
                                        this._currentFrame.color.redMultiplier,
                                        this._currentFrame.color.greenMultiplier,
                                        this._currentFrame.color.blueMultiplier,
                                        true
                                    );
                                }
                                else if (this._bone._isColorChanged) {
                                    this._bone._updateColor(0, 0, 0, 0, 1, 1, 1, 1, false);
                                }
                            }
                            this._bone._arriveAtFrame(this._currentFrame, this, this._animationState, false);
                        }

                        if (this._tweenTransform || this._tweenColor) {
                            progress = (playedTime - this._currentFramePosition) / this._currentFrameDuration;
                            if (this._tweenEasing) {
                                progress = TimelineState.getEaseValue(progress, this._tweenEasing);
                            }
                        }

                        if (this._tweenTransform) {
                            var currentTransform:objects.DBTransform = this._currentFrame.transform;
                            var currentPivot:geom.Point = this._currentFrame.pivot;
                            if (this._animationState.blend) {
                                this.transform.x = this._originTransform.x + currentTransform.x + this._durationTransform.x * progress;
                                this.transform.y = this._originTransform.y + currentTransform.y + this._durationTransform.y * progress;
                                this.transform.skewX = this._originTransform.skewX + currentTransform.skewX + this._durationTransform.skewX * progress;
                                this.transform.skewY = this._originTransform.skewY + currentTransform.skewY + this._durationTransform.skewY * progress;
                                this.transform.scaleX = this._originTransform.scaleX + currentTransform.scaleX + this._durationTransform.scaleX * progress;
                                this.transform.scaleY = this._originTransform.scaleY + currentTransform.scaleY + this._durationTransform.scaleY * progress;

                                this.pivot.x = this._originPivot.x + currentPivot.x + this._durationPivot.x * progress;
                                this.pivot.y = this._originPivot.y + currentPivot.y + this._durationPivot.y * progress;
                            }
                            else {
                                this.transform.x = currentTransform.x + this._durationTransform.x * progress;
                                this.transform.y = currentTransform.y + this._durationTransform.y * progress;
                                this.transform.skewX = currentTransform.skewX + this._durationTransform.skewX * progress;
                                this.transform.skewY = currentTransform.skewY + this._durationTransform.skewY * progress;
                                this.transform.scaleX = currentTransform.scaleX + this._durationTransform.scaleX * progress;
                                this.transform.scaleY = currentTransform.scaleY + this._durationTransform.scaleY * progress;

                                this.pivot.x = currentPivot.x + this._durationPivot.x * progress;
                                this.pivot.y = currentPivot.y + this._durationPivot.y * progress;
                            }
                        }

                        if (this._tweenColor) {
                            if (this._currentFrame.color) {
                                this._bone._updateColor(
                                    this._currentFrame.color.alphaOffset + this._durationColor.alphaOffset * progress,
                                    this._currentFrame.color.redOffset + this._durationColor.redOffset * progress,
                                    this._currentFrame.color.greenOffset + this._durationColor.greenOffset * progress,
                                    this._currentFrame.color.blueOffset + this._durationColor.blueOffset * progress,
                                    this._currentFrame.color.alphaMultiplier + this._durationColor.alphaMultiplier * progress,
                                    this._currentFrame.color.redMultiplier + this._durationColor.redMultiplier * progress,
                                    this._currentFrame.color.greenMultiplier + this._durationColor.greenMultiplier * progress,
                                    this._currentFrame.color.blueMultiplier + this._durationColor.blueMultiplier * progress,
                                    true
                                );
                            }
                            else {
                                this._bone._updateColor(
                                    this._durationColor.alphaOffset * progress,
                                    this._durationColor.redOffset * progress,
                                    this._durationColor.greenOffset * progress,
                                    this._durationColor.blueOffset * progress,
                                    1 + this._durationColor.alphaMultiplier * progress,
                                    1 + this._durationColor.redMultiplier * progress,
                                    1 + this._durationColor.greenMultiplier * progress,
                                    1 + this._durationColor.blueMultiplier * progress,
                                    true
                                );
                            }
                        }
                    }
                    else {
                        this._updateState = 0;
                        if (this._animationState.blend) {
                            this.transform.copy(this._originTransform);

                            this.pivot.x = this._originPivot.x;
                            this.pivot.y = this._originPivot.y;
                        }
                        else {
                            this.transform.x =
                                this.transform.y =
                                    this.transform.skewX =
                                        this.transform.skewY =
                                            this.transform.scaleX =
                                                this.transform.scaleY = 0;

                            this.pivot.x = 0;
                            this.pivot.y = 0;
                        }

                        this._currentFrame = <objects.TransformFrame> this._timeline.getFrameList()[0];

                        this.tweenActive = this._currentFrame.displayIndex >= 0;

                        if (this._currentFrame.color) {
                            this._bone._updateColor(
                                this._currentFrame.color.alphaOffset,
                                this._currentFrame.color.redOffset,
                                this._currentFrame.color.greenOffset,
                                this._currentFrame.color.blueOffset,
                                this._currentFrame.color.alphaMultiplier,
                                this._currentFrame.color.redMultiplier,
                                this._currentFrame.color.greenMultiplier,
                                this._currentFrame.color.blueMultiplier,
                                true
                            );
                        }
                        else {
                            this._bone._updateColor(0, 0, 0, 0, 1, 1, 1, 1, false);
                        }

                        this._bone._arriveAtFrame(this._currentFrame, this, this._animationState, false);
                    }
                }
            }

            private clear():void {
                this._updateState = 0;
                this._bone = null;
                this._animationState = null;
                this._timeline = null;
                this._currentFrame = null;
                this._originTransform = null;
                this._originPivot = null;
            }
        }

        export class AnimationState {
            private static _pool:Array<AnimationState> = [];

            /** @private */
            public static _borrowObject():AnimationState {
                if (AnimationState._pool.length == 0) {
                    return new AnimationState();
                }
                return AnimationState._pool.pop();
            }

            /** @private */
            public static _returnObject(animationState:AnimationState):void {
                if (AnimationState._pool.indexOf(animationState) < 0) {
                    AnimationState._pool[AnimationState._pool.length] = animationState;
                }

                animationState.clear();
            }

            /** @private */
            public static _clear():void {
                var i:number = AnimationState._pool.length;
                while (i--) {
                    AnimationState._pool[i].clear();
                }
                AnimationState._pool.length = 0;
            }

            public enabled:boolean;
            public tweenEnabled:boolean;
            public blend:boolean;
            public group:string;
            public weight:number;

            public name:string;
            public clip:objects.AnimationData;
            public loopCount:number;

            public loop:number;
            public layer:number;

            public isPlaying:boolean;
            public isComplete:boolean;
            public totalTime:number;
            public currentTime:number;
            public timeScale:number;
            public displayControl:boolean;

            /** @private */
            public _timelineStates:any;
            /** @private */
            public _fadeWeight:number;

            private _armature:Armature;
            private _currentFrame:objects.Frame;
            private _mixingTransforms:any;
            private _fadeState:number;
            private _fadeInTime:number;
            private _fadeOutTime:number;
            private _fadeOutBeginTime:number;
            private _fadeOutWeight:number;
            private _fadeIn:boolean;
            private _fadeOut:boolean;
            private _pauseBeforeFadeInComplete:boolean;

            constructor() {
                this.loop = 0;
                this.layer = 0;
                this._timelineStates = {};
            }

            public fadeIn(armature:Armature, clip:objects.AnimationData, fadeInTime:number, timeScale:number, loop:number, layer:number, displayControl:boolean, pauseBeforeFadeInComplete:boolean):void {
                this.layer = layer;
                this.clip = clip;
                this.name = this.clip.name;
                this.totalTime = this.clip.duration;

                this._armature = armature;

                if (Math.round(this.clip.duration * this.clip.frameRate) < 2 || timeScale == Infinity) {
                    this.timeScale = 1;
                    this.currentTime = this.totalTime;
                    if (this.loop >= 0) {
                        this.loop = 1;
                    }
                    else {
                        this.loop = -1;
                    }
                }
                else {
                    this.timeScale = timeScale;
                    this.currentTime = 0;
                    this.loop = loop;
                }


                this._pauseBeforeFadeInComplete = pauseBeforeFadeInComplete;

                this._fadeInTime = fadeInTime * this.timeScale;
                this._fadeState = 1;
                this._fadeOutBeginTime = 0;
                this._fadeOutWeight = -1;
                this._fadeWeight = 0;
                this._fadeIn = true;
                this._fadeOut = false;

                this.loopCount = -1;
                this.displayControl = displayControl;
                this.isPlaying = true;
                this.isComplete = false;

                this.weight = 1;
                this.blend = true;
                this.enabled = true;
                this.tweenEnabled = true;

                this.updateTimelineStates();
            }

            public fadeOut(fadeOutTime:number, pause:boolean = false):void {
                if (!this._armature || this._fadeOutWeight >= 0) {
                    return;
                }
                this._fadeState = -1;
                this._fadeOutWeight = this._fadeWeight;
                this._fadeOutTime = fadeOutTime * this.timeScale;
                this._fadeOutBeginTime = this.currentTime;
                this._fadeOut = true;

                this.isPlaying = !pause;
                this.displayControl = false;

                for (var index in  this._timelineStates) {
                    (<TimelineState> this._timelineStates[index]).fadeOut();
                }

                this.enabled = true;
            }

            public play():void {
                this.isPlaying = true;
            }

            public stop():void {
                this.isPlaying = false;
            }

            public getMixingTransform(timelineName:string):number {
                if (this._mixingTransforms) {
                    return Number(this._mixingTransforms[timelineName]);
                }
                return -1;
            }

            public addMixingTransform(timelineName:string, type:number = 2, recursive:boolean = true):void {
                if (this.clip && this.clip.getTimeline(timelineName)) {
                    if (!this._mixingTransforms) {
                        this._mixingTransforms = {};
                    }
                    if (recursive) {
                        var i:number = this._armature._boneList.length;
                        var bone:Bone;
                        var currentBone:Bone;
                        while (i--) {
                            bone = this._armature._boneList[i];
                            if (bone.name == timelineName) {
                                currentBone = bone;
                            }
                            if (currentBone && (currentBone == bone || currentBone.contains(bone))) {
                                this._mixingTransforms[bone.name] = type;
                            }
                        }
                    }
                    else {
                        this._mixingTransforms[timelineName] = type;
                    }

                    this.updateTimelineStates();
                }
                else {
                    throw new Error();
                }
            }

            public removeMixingTransform(timelineName:string = null, recursive:boolean = true):void {
                if (timelineName) {
                    if (recursive) {
                        var i:number = this._armature._boneList.length;
                        var bone:Bone;
                        var currentBone:Bone;
                        while (i--) {
                            bone = this._armature._boneList[i];
                            if (bone.name == timelineName) {
                                currentBone = bone;
                            }
                            if (currentBone && (currentBone == bone || currentBone.contains(bone))) {
                                delete this._mixingTransforms[bone.name];
                            }
                        }
                    }
                    else {
                        delete this._mixingTransforms[timelineName];
                    }

                    for (var index in this._mixingTransforms) {
                        var hasMixing:boolean = true;
                        break;
                    }
                    if (!hasMixing) {
                        this._mixingTransforms = null;
                    }
                }
                else {
                    this._mixingTransforms = null;
                }

                this.updateTimelineStates();
            }

            public advanceTime(passedTime:number):boolean {
                if (!this.enabled) {
                    return false;
                }
                var event:events.AnimationEvent;
                var isComplete:boolean;

                if (this._fadeIn) {
                    this._fadeIn = false;
                    if (this._armature.hasEventListener(events.AnimationEvent.FADE_IN)) {
                        event = new events.AnimationEvent(events.AnimationEvent.FADE_IN);
                        event.animationState = this;
                        this._armature._eventList.push(event);
                    }
                }

                if (this._fadeOut) {
                    this._fadeOut = false;
                    if (this._armature.hasEventListener(events.AnimationEvent.FADE_OUT)) {
                        event = new events.AnimationEvent(events.AnimationEvent.FADE_OUT);
                        event.animationState = this;
                        this._armature._eventList.push(event);
                    }
                }

                this.currentTime += passedTime * this.timeScale;

                if (this.isPlaying && !this.isComplete) {
                    var progress:number;
                    var currentLoopCount:number;
                    if (this._pauseBeforeFadeInComplete) {
                        this._pauseBeforeFadeInComplete = false;
                        this.isPlaying = false;
                        progress = 0;
                        currentLoopCount = Math.floor(progress);
                    }
                    else {
                        progress = this.currentTime / this.totalTime;
                        //update loopCount
                        currentLoopCount = Math.floor(progress);
                        if (currentLoopCount != this.loopCount) {
                            if (this.loopCount == -1) {
                                if (this._armature.hasEventListener(events.AnimationEvent.START)) {
                                    event = new events.AnimationEvent(events.AnimationEvent.START);
                                    event.animationState = this;
                                    this._armature._eventList.push(event);
                                }
                            }
                            this.loopCount = currentLoopCount;
                            if (this.loopCount) {
                                if (this.loop && this.loopCount * this.loopCount >= this.loop * this.loop - 1) {
                                    isComplete = true;
                                    progress = 1;
                                    currentLoopCount = 0;
                                    if (this._armature.hasEventListener(events.AnimationEvent.COMPLETE)) {
                                        event = new events.AnimationEvent(events.AnimationEvent.COMPLETE);
                                        event.animationState = this;
                                        this._armature._eventList.push(event);
                                    }
                                }
                                else {
                                    if (this._armature.hasEventListener(events.AnimationEvent.LOOP_COMPLETE)) {
                                        event = new events.AnimationEvent(events.AnimationEvent.LOOP_COMPLETE);
                                        event.animationState = this;
                                        this._armature._eventList.push(event);
                                    }
                                }
                            }
                        }
                    }

                    for (var index in this._timelineStates) {
                        (<TimelineState> this._timelineStates[index]).update(progress);
                    }
                    var frameList:Array<objects.Frame> = this.clip.getFrameList();
                    if (frameList.length > 0) {
                        var playedTime:number = this.totalTime * (progress - currentLoopCount);
                        var isArrivedFrame:boolean = false;
                        var frameIndex:number;
                        while (!this._currentFrame || playedTime > this._currentFrame.position + this._currentFrame.duration || playedTime < this._currentFrame.position) {
                            if (isArrivedFrame) {
                                this._armature._arriveAtFrame(this._currentFrame, null, this, true);
                            }
                            isArrivedFrame = true;
                            if (this._currentFrame) {
                                frameIndex = frameList.indexOf(this._currentFrame);
                                frameIndex++;
                                if (frameIndex >= frameList.length) {
                                    frameIndex = 0;
                                }
                                this._currentFrame = frameList[frameIndex];
                            }
                            else {
                                this._currentFrame = frameList[0];
                            }
                        }

                        if (isArrivedFrame) {
                            this._armature._arriveAtFrame(this._currentFrame, null, this, false);
                        }
                    }
                }

                //update weight and fadeState
                if (this._fadeState > 0) {
                    if (this._fadeInTime == 0) {
                        this._fadeWeight = 1;
                        this._fadeState = 0;
                        this.isPlaying = true;
                        if (this._armature.hasEventListener(events.AnimationEvent.FADE_IN_COMPLETE)) {
                            event = new events.AnimationEvent(events.AnimationEvent.FADE_IN_COMPLETE);
                            event.animationState = this;
                            this._armature._eventList.push(event);
                        }
                    }
                    else {
                        this._fadeWeight = this.currentTime / this._fadeInTime;
                        if (this._fadeWeight >= 1) {
                            this._fadeWeight = 1;
                            this._fadeState = 0;
                            if (!this.isPlaying) {
                                this.currentTime -= this._fadeInTime;
                            }
                            this.isPlaying = true;
                            if (this._armature.hasEventListener(events.AnimationEvent.FADE_IN_COMPLETE)) {
                                event = new events.AnimationEvent(events.AnimationEvent.FADE_IN_COMPLETE);
                                event.animationState = this;
                                this._armature._eventList.push(event);
                            }
                        }
                    }
                }
                else if (this._fadeState < 0) {
                    if (this._fadeOutTime == 0) {
                        this._fadeWeight = 0;
                        this._fadeState = 0;
                        if (this._armature.hasEventListener(events.AnimationEvent.FADE_OUT_COMPLETE)) {
                            event = new events.AnimationEvent(events.AnimationEvent.FADE_OUT_COMPLETE);
                            event.animationState = this;
                            this._armature._eventList.push(event);
                        }
                        return true;
                    }
                    else {
                        this._fadeWeight = (1 - (this.currentTime - this._fadeOutBeginTime) / this._fadeOutTime) * this._fadeOutWeight;
                        if (this._fadeWeight <= 0) {
                            this._fadeWeight = 0;
                            this._fadeState = 0;
                            if (this._armature.hasEventListener(events.AnimationEvent.FADE_OUT_COMPLETE)) {
                                event = new events.AnimationEvent(events.AnimationEvent.FADE_OUT_COMPLETE);
                                event.animationState = this;
                                this._armature._eventList.push(event);
                            }
                            return true;
                        }
                    }
                }

                if (isComplete) {
                    this.isComplete = true;
                    if (this.loop < 0) {
                        this.fadeOut((this._fadeOutWeight || this._fadeInTime) / this.timeScale, true);
                    }
                }

                return false;
            }

            private updateTimelineStates():void {
                if (this._mixingTransforms) {
                    for (var timelineName in this._timelineStates) {
                        if (this._mixingTransforms[timelineName] == null) {
                            this.removeTimelineState(timelineName);
                        }
                    }

                    for (timelineName in this._mixingTransforms) {
                        if (!this._timelineStates[timelineName]) {
                            this.addTimelineState(timelineName);
                        }
                    }
                }
                else {
                    for (timelineName in this.clip.getTimelines()) {
                        if (!this._timelineStates[timelineName]) {
                            this.addTimelineState(timelineName);
                        }
                    }
                }
            }

            private addTimelineState(timelineName:string):void {
                var bone:Bone = this._armature.getBone(timelineName);
                if (bone) {
                    var timelineState:TimelineState = TimelineState._borrowObject();
                    var timeline:objects.TransformTimeline = this.clip.getTimeline(timelineName);
                    timelineState.fadeIn(bone, this, timeline);
                    this._timelineStates[timelineName] = timelineState;
                }
            }

            private removeTimelineState(timelineName:string):void {
                TimelineState._returnObject(<TimelineState> this._timelineStates[timelineName]);
                delete this._timelineStates[timelineName];
            }

            private clear():void {
                this.clip = null;
                this.enabled = false;

                this._armature = null;
                this._currentFrame = null;
                this._mixingTransforms = null;

                for (var timelineName in this._timelineStates) {
                    this.removeTimelineState(timelineName);
                }
            }
        }

        export class Animation {
            public static NONE:string = "none";
            public static SAME_LAYER:string = "sameLayer";
            public static SAME_GROUP:string = "sameGroup";
            public static SAME_LAYER_AND_GROUP:string = "sameLayerAndGroup";
            public static ALL:string = "all";

            public tweenEnabled:boolean;
            public timeScale:number;

            public animationNameList:Array<string>;

            /** @private */
            public _animationLayer:Array<Array<AnimationState>>;
            /** @private */
            public _lastAnimationState:AnimationState;

            private _armature:Armature;
            private _isPlaying:boolean;

            public getLastAnimationName():string {
                return this._lastAnimationState ? this._lastAnimationState.name : null;
            }

            public getLastAnimationState():AnimationState {
                return this._lastAnimationState;
            }

            private _animationDataList:Array<objects.AnimationData>;

            public getAnimationDataList():Array<objects.AnimationData> {
                return this._animationDataList;
            }

            public setAnimationDataList(value:Array<objects.AnimationData>):void {
                this._animationDataList = value;
                this.animationNameList.length = 0;
                for (var index in this._animationDataList) {
                    this.animationNameList[this.animationNameList.length] = this._animationDataList[index].name;
                }
            }


            public getIsPlaying():boolean {
                return this._isPlaying && !this.getIsComplete();
            }

            public getIsComplete():boolean {
                if (this._lastAnimationState) {
                    if (!this._lastAnimationState.isComplete) {
                        return false;
                    }
                    var j:number = this._animationLayer.length;
                    while (j--) {
                        var animationStateList:Array<AnimationState> = this._animationLayer[j];
                        var i:number = animationStateList.length;
                        while (i--) {
                            if (!animationStateList[i].isComplete) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
                return false;
            }

            constructor(armature:Armature) {
                this._armature = armature;
                this._animationLayer = [];
                this._isPlaying = false;

                this.animationNameList = [];
                this.tweenEnabled = true;
                this.timeScale = 1;
            }

            public dispose():void {
                if (!this._armature) {
                    return;
                }
                this.stop();
                var i:number = this._animationLayer.length;
                while (i--) {
                    var animationStateList:Array<AnimationState> = this._animationLayer[i];
                    var j:number = animationStateList.length;
                    while (j--) {
                        AnimationState._returnObject(animationStateList[j]);
                    }
                    animationStateList.length = 0;
                }
                this._animationLayer.length = 0;
                this.animationNameList.length = 0;

                this._armature = null;
                this._animationLayer = null;
                this._animationDataList = null;
                this.animationNameList = null;
            }

            public gotoAndPlay(animationName:string, fadeInTime:number = -1, duration:number = -1, loop:number = NaN, layer:number = 0, group:string = null, fadeOutMode:string = Animation.SAME_LAYER_AND_GROUP, displayControl:boolean = true, pauseFadeOut:boolean = true, pauseFadeIn:boolean = true):AnimationState {
                if (!this._animationDataList) {
                    return null;
                }
                var i:number = this._animationDataList.length;
                var animationData:objects.AnimationData;
                while (i--) {
                    if (this._animationDataList[i].name == animationName) {
                        animationData = this._animationDataList[i];
                        break;
                    }
                }
                if (!animationData) {
                    return null;
                }

                this._isPlaying = true;

                //
                fadeInTime = fadeInTime < 0 ? (animationData.fadeInTime < 0 ? 0.3 : animationData.fadeInTime) : fadeInTime;

                var durationScale:number;
                if (duration < 0) {
                    durationScale = animationData.scale < 0 ? 1 : animationData.scale;
                }
                else {
                    durationScale = duration / animationData.duration;
                }

                loop = isNaN(loop) ? animationData.loop : loop;
                layer = this.addLayer(layer);

                //autoSync = autoSync && !pauseFadeOut && !pauseFadeIn;
                var animationState:AnimationState;
                var animationStateList:Array<AnimationState>;
                switch (fadeOutMode) {
                    case Animation.NONE:
                        break;
                    case Animation.SAME_LAYER:
                        animationStateList = this._animationLayer[layer];
                        i = animationStateList.length;
                        while (i--) {
                            animationState = animationStateList[i];
                            animationState.fadeOut(fadeInTime, pauseFadeOut);
                        }
                        break;
                    case Animation.SAME_GROUP:
                        j = this._animationLayer.length;
                        while (j--) {
                            animationStateList = this._animationLayer[j];
                            i = animationStateList.length;
                            while (i--) {
                                animationState = animationStateList[i];
                                if (animationState.group == group) {
                                    animationState.fadeOut(fadeInTime, pauseFadeOut);
                                }
                            }
                        }
                        break;
                    case Animation.ALL:
                        var j:number = this._animationLayer.length;
                        while (j--) {
                            animationStateList = this._animationLayer[j];
                            i = animationStateList.length;
                            while (i--) {
                                animationState = animationStateList[i];
                                animationState.fadeOut(fadeInTime, pauseFadeOut);
                            }
                        }
                        break;
                    case Animation.SAME_LAYER_AND_GROUP:
                    default:
                        animationStateList = this._animationLayer[layer];
                        i = animationStateList.length;
                        while (i--) {
                            animationState = animationStateList[i];
                            if (animationState.group == group) {
                                animationState.fadeOut(fadeInTime, pauseFadeOut);
                            }
                        }
                        break;
                }

                this._lastAnimationState = AnimationState._borrowObject();
                this._lastAnimationState.group = group;
                this._lastAnimationState.tweenEnabled = this.tweenEnabled;
                this._lastAnimationState.fadeIn(this._armature, animationData, fadeInTime, 1 / durationScale, loop, layer, displayControl, pauseFadeIn);

                this.addState(this._lastAnimationState);

                var slotList:Array<Slot> = this._armature._slotList;
                var slot:Slot;
                var childArmature:Armature;
                i = slotList.length;
                while (i--) {
                    slot = slotList[i];
                    childArmature = slot.getChildArmature();
                    if (childArmature) {
                        childArmature.animation.gotoAndPlay(animationName, fadeInTime);
                    }
                }

                return this._lastAnimationState;
            }

            public play():void {
                if (!this._animationDataList || this._animationDataList.length == 0) {
                    return;
                }
                if (!this._lastAnimationState) {
                    this.gotoAndPlay(this._animationDataList[0].name);
                }
                else if (!this._isPlaying) {
                    this._isPlaying = true;
                }
                else {
                    this.gotoAndPlay(this._lastAnimationState.name);
                }
            }

            public stop():void {
                this._isPlaying = false;
            }

            public getState(name:string, layer:number = 0):AnimationState {
                var l:number = this._animationLayer.length;
                if (l == 0) {
                    return null;
                }
                else if (layer >= l) {
                    layer = l - 1;
                }

                var animationStateList:Array<AnimationState> = this._animationLayer[layer];
                if (!animationStateList) {
                    return null;
                }
                var i:number = animationStateList.length;
                while (i--) {
                    if (animationStateList[i].name == name) {
                        return animationStateList[i];
                    }
                }

                return null;
            }

            public hasAnimation(animationName:string):boolean {
                var i:number = this._animationDataList.length;
                while (i--) {
                    if (this._animationDataList[i].name == animationName) {
                        return true;
                    }
                }

                return false;
            }

            public advanceTime(passedTime:number):void {
                if (!this._isPlaying) {
                    return;
                }
                passedTime *= this.timeScale;

                var l:number = this._armature._boneList.length;
                var i:number;
                var j:number;
                var k:number = l;
                var stateListLength:number;
                var bone:Bone;
                var boneName:string;
                var weigthLeft:number;

                var x:number;
                var y:number;
                var skewX:number;
                var skewY:number;
                var scaleX:number;
                var scaleY:number;
                var pivotX:number;
                var pivotY:number;

                var layerTotalWeight:number;
                var animationStateList:Array<AnimationState>;
                var animationState:AnimationState;
                var timelineState:TimelineState;
                var weight:number;
                var transform:objects.DBTransform;
                var pivot:geom.Point;

                l--;
                while (k--) {
                    bone = this._armature._boneList[k];
                    boneName = bone.name;
                    weigthLeft = 1;

                    x = 0;
                    y = 0;
                    skewX = 0;
                    skewY = 0;
                    scaleX = 0;
                    scaleY = 0;
                    pivotX = 0;
                    pivotY = 0;

                    i = this._animationLayer.length;
                    while (i--) {
                        layerTotalWeight = 0;
                        animationStateList = this._animationLayer[i];
                        stateListLength = animationStateList.length;
                        for (j = 0; j < stateListLength; j++) {
                            animationState = animationStateList[j];
                            if (k == l) {
                                if (animationState.advanceTime(passedTime)) {
                                    this.removeState(animationState);
                                    j--;
                                    stateListLength--;
                                    continue;
                                }
                            }

                            timelineState = animationState._timelineStates[boneName];
                            if (timelineState && timelineState.tweenActive) {
                                weight = animationState._fadeWeight * animationState.weight * weigthLeft;
                                transform = timelineState.transform;
                                pivot = timelineState.pivot;
                                x += transform.x * weight;
                                y += transform.y * weight;
                                skewX += transform.skewX * weight;
                                skewY += transform.skewY * weight;
                                scaleX += transform.scaleX * weight;
                                scaleY += transform.scaleY * weight;
                                pivotX += pivot.x * weight;
                                pivotY += pivot.y * weight;

                                layerTotalWeight += weight;
                            }
                        }

                        if (layerTotalWeight >= weigthLeft) {
                            break;
                        }
                        else {
                            weigthLeft -= layerTotalWeight;
                        }
                    }
                    transform = bone.tween;
                    pivot = bone._tweenPivot;

                    transform.x = x;
                    transform.y = y;
                    transform.skewX = skewX;
                    transform.skewY = skewY;
                    transform.scaleX = scaleX;
                    transform.scaleY = scaleY;
                    pivot.x = pivotX;
                    pivot.y = pivotY;
                }
            }

            private addLayer(layer:number):number {
                if (layer >= this._animationLayer.length) {
                    layer = this._animationLayer.length;
                    this._animationLayer[layer] = [];
                }
                return layer;
            }

            private addState(animationState:AnimationState):void {
                var animationStateList:Array<AnimationState> = this._animationLayer[animationState.layer];
                animationStateList.push(animationState);
            }

            private removeState(animationState:AnimationState):void {
                var layer:number = animationState.layer;
                var animationStateList:Array<AnimationState> = this._animationLayer[layer];
                animationStateList.splice(animationStateList.indexOf(animationState), 1);

                AnimationState._returnObject(animationState);

                if (animationStateList.length == 0 && layer == this._animationLayer.length - 1) {
                    this._animationLayer.length--;
                }
            }
        }
    }

    export module objects {
        export class DBTransform {
            public x:number;
            public y:number;
            public skewX:number;
            public skewY:number;
            public scaleX:number;
            public scaleY:number;

            constructor() {
                this.x = 0;
                this.y = 0;
                this.skewX = 0;
                this.skewY = 0;
                this.scaleX = 1;
                this.scaleY = 1;
            }

            public getRotation():number {
                return this.skewX;
            }

            public setRotation(value:number):void {
                this.skewX = this.skewY = value;
            }

            public copy(transform:DBTransform):void {
                this.x = transform.x;
                this.y = transform.y;
                this.skewX = transform.skewX;
                this.skewY = transform.skewY;
                this.scaleX = transform.scaleX;
                this.scaleY = transform.scaleY;
            }

            public toString():string {
                return "[DBTransform (x=" +
                    this.x +
                    " y=" + this.y +
                    " skewX=" + this.skewX +
                    " skewY=" + this.skewY +
                    " scaleX=" + this.scaleX +
                    " scaleY=" + this.scaleY +
                    ")]";
            }
        }

        export class Frame {
            public position:number;
            public duration:number;

            public action:string;
            public event:string;
            public sound:string;

            constructor() {
                this.position = 0;
                this.duration = 0;
            }

            public dispose():void {
            }
        }

        export class TransformFrame extends Frame {
            public tweenEasing:number;
            public tweenRotate:number;
            public displayIndex:number;
            public zOrder:number;
            public visible:boolean;

            public global:DBTransform;
            public transform:DBTransform;
            public pivot:geom.Point;
            public color:geom.ColorTransform;

            constructor() {
                super();

                this.tweenEasing = 0;
                this.tweenRotate = 0;
                this.displayIndex = 0;
                this.zOrder = NaN;
                this.visible = true;

                this.global = new DBTransform();
                this.transform = new DBTransform();
                this.pivot = new geom.Point();
            }

            public dispose():void {
                super.dispose();
                this.global = null;
                this.transform = null;
                //SkeletonData pivots
                this.pivot = null;
                this.color = null;
            }
        }

        export class Timeline {
            public duration:number;
            public scale:number;

            private _frameList:Array<Frame>;

            public getFrameList():Array<Frame> {
                return this._frameList;
            }

            constructor() {
                this._frameList = [];
                this.duration = 0;
                this.scale = 1;
            }

            public dispose():void {
                var i:number = this._frameList.length;
                while (i--) {
                    this._frameList[i].dispose();
                }
                this._frameList.length = 0;
                this._frameList = null;
            }

            public addFrame(frame:Frame):void {
                if (!frame) {
                    throw new Error();
                }

                if (this._frameList.indexOf(frame) < 0) {
                    this._frameList[this._frameList.length] = frame;
                }
                else {
                    throw new Error();
                }
            }
        }

        export class TransformTimeline extends Timeline {
            public static HIDE_TIMELINE:TransformTimeline = new TransformTimeline();

            public transformed:boolean;
            public offset:number;

            public originTransform:DBTransform;
            public originPivot:geom.Point;


            constructor() {
                super();
                this.originTransform = new DBTransform();
                this.originPivot = new geom.Point();
                this.offset = 0;
                this.transformed = false;
            }

            public dispose():void {
                if (this == TransformTimeline.HIDE_TIMELINE) {
                    return;
                }
                super.dispose();
                this.originTransform = null;
                this.originPivot = null;
            }
        }

        export class AnimationData extends Timeline {
            public frameRate:number;
            public name:string;
            public loop:number;
            public tweenEasing:number;
            public fadeInTime:number;

            private _timelines:any;

            public getTimelines():any {
                return this._timelines;
            }

            constructor() {
                super();
                this.frameRate = 0;
                this.loop = 0;
                this.tweenEasing = NaN;
                this.fadeInTime = 0;

                this._timelines = {};
            }

            public dispose():void {
                super.dispose();

                for (var timelineName in this._timelines) {
                    (<TransformTimeline> this._timelines[timelineName]).dispose();
                }
                this._timelines = null;
            }

            public getTimeline(timelineName:string):TransformTimeline {
                return <TransformTimeline> this._timelines[timelineName];
            }

            public addTimeline(timeline:TransformTimeline, timelineName:string):void {
                if (!timeline) {
                    throw new Error();
                }

                this._timelines[timelineName] = timeline;
            }
        }

        export class DisplayData {
            public static ARMATURE:string = "armature";
            public static IMAGE:string = "image";

            public name:string;
            public type:string;
            public transform:DBTransform;
            public pivot:geom.Point;

            constructor() {
                this.transform = new DBTransform();
            }

            public dispose():void {
                this.transform = null;
                this.pivot = null;
            }
        }

        export class SlotData {
            public name:string;
            public parent:string;
            public zOrder:number;
            public blendMode:string;
            private _displayDataList:Array<DisplayData>;

            public getDisplayDataList():Array<DisplayData> {
                return this._displayDataList;
            }

            constructor() {
                this._displayDataList = [];
                this.zOrder = 0;
                this.blendMode = "normal";
            }

            public dispose():void {
                var i:number = this._displayDataList.length;
                while (i--) {
                    this._displayDataList[i].dispose();
                }
                this._displayDataList.length = 0;
                this._displayDataList = null;
            }

            public addDisplayData(displayData:DisplayData):void {
                if (!displayData) {
                    throw new Error();
                }
                if (this._displayDataList.indexOf(displayData) < 0) {
                    this._displayDataList[this._displayDataList.length] = displayData;
                }
                else {
                    throw new Error();
                }
            }

            public getDisplayData(displayName:string):DisplayData {
                var i:number = this._displayDataList.length;
                while (i--) {
                    if (this._displayDataList[i].name == displayName) {
                        return this._displayDataList[i];
                    }
                }

                return null;
            }
        }

        export class BoneData {
            public name:string;
            public parent:string;
            public length:number;

            public global:DBTransform;
            public transform:DBTransform;

            public scaleMode:number;
            public fixedRotation:boolean;

            constructor() {
                this.length = 0;
                this.global = new DBTransform();
                this.transform = new DBTransform();
                this.scaleMode = 1;
                this.fixedRotation = false;
            }

            public dispose():void {
                this.global = null;
                this.transform = null;
            }
        }

        export class SkinData {
            public name:string;

            private _slotDataList:Array<SlotData>;

            public getSlotDataList():Array<SlotData> {
                return this._slotDataList;
            }

            constructor() {
                this._slotDataList = [];
            }

            public dispose():void {
                var i:number = this._slotDataList.length;
                while (i--) {
                    this._slotDataList[i].dispose();
                }
                this._slotDataList.length = 0;
                this._slotDataList = null;
            }

            public getSlotData(slotName:string):SlotData {
                var i:number = this._slotDataList.length;
                while (i--) {
                    if (this._slotDataList[i].name == slotName) {
                        return this._slotDataList[i];
                    }
                }
                return null;
            }

            public addSlotData(slotData:SlotData):void {
                if (!slotData) {
                    throw new Error();
                }

                if (this._slotDataList.indexOf(slotData) < 0) {
                    this._slotDataList[this._slotDataList.length] = slotData;
                }
                else {
                    throw new Error();
                }
            }
        }

        export class ArmatureData {
            public name:string;

            private _boneDataList:Array<BoneData>;

            public getBoneDataList():Array<BoneData> {
                return this._boneDataList;
            }

            private _skinDataList:Array<SkinData>;

            public getSkinDataList():Array<SkinData> {
                return this._skinDataList;
            }

            private _animationDataList:Array<AnimationData>;

            public getAnimationDataList():Array<AnimationData> {
                return this._animationDataList;
            }

            constructor() {
                this._boneDataList = [];
                this._skinDataList = [];
                this._animationDataList = [];
            }

            public dispose():void {
                var i:number = this._boneDataList.length;
                while (i--) {
                    this._boneDataList[i].dispose();
                }
                i = this._skinDataList.length;
                while (i--) {
                    this._skinDataList[i].dispose();
                }
                i = this._animationDataList.length;
                while (i--) {
                    this._animationDataList[i].dispose();
                }
                this._boneDataList.length = 0;
                this._skinDataList.length = 0;
                this._animationDataList.length = 0;
                this._boneDataList = null;
                this._skinDataList = null;
                this._animationDataList = null;
            }

            public getBoneData(boneName:string):BoneData {
                var i:number = this._boneDataList.length;
                while (i--) {
                    if (this._boneDataList[i].name == boneName) {
                        return this._boneDataList[i];
                    }
                }
                return null;
            }

            public getSkinData(skinName:string):SkinData {
                if (!skinName) {
                    return this._skinDataList[0];
                }
                var i:number = this._skinDataList.length;
                while (i--) {
                    if (this._skinDataList[i].name == skinName) {
                        return this._skinDataList[i];
                    }
                }

                return null;
            }

            public getAnimationData(animationName:string):AnimationData {
                var i:number = this._animationDataList.length;
                while (i--) {
                    if (this._animationDataList[i].name == animationName) {
                        return this._animationDataList[i];
                    }
                }
                return null;
            }

            public addBoneData(boneData:BoneData):void {
                if (!boneData) {
                    throw new Error();
                }

                if (this._boneDataList.indexOf(boneData) < 0) {
                    this._boneDataList[this._boneDataList.length] = boneData;
                }
                else {
                    throw new Error();
                }
            }

            public addSkinData(skinData:SkinData):void {
                if (!skinData) {
                    throw new Error();
                }

                if (this._skinDataList.indexOf(skinData) < 0) {
                    this._skinDataList[this._skinDataList.length] = skinData;
                }
                else {
                    throw new Error();
                }
            }

            public addAnimationData(animationData:AnimationData):void {
                if (!animationData) {
                    throw new Error();
                }

                if (this._animationDataList.indexOf(animationData) < 0) {
                    this._animationDataList[this._animationDataList.length] = animationData;
                }
            }

            public sortBoneDataList():void {
                var i:number = this._boneDataList.length;
                if (i == 0) {
                    return;
                }

                var helpArray:Array<any> = [];
                while (i--) {
                    var boneData:BoneData = this._boneDataList[i];
                    var level:number = 0;
                    var parentData:BoneData = boneData;
                    while (parentData && parentData.parent) {
                        level++;
                        parentData = this.getBoneData(parentData.parent);
                    }
                    helpArray[i] = {level: level, boneData: boneData};
                }

                helpArray.sort(this.sortBoneData);

                i = helpArray.length;
                while (i--) {
                    this._boneDataList[i] = helpArray[i].boneData;
                }
            }

            private sortBoneData(object1:any, object2:any):number {
                return object1.level > object2.level ? 1 : -1;
            }
        }

        export class SkeletonData {
            public name:string;

            private _subTexturePivots:any;

            public getArmatureNames():Array<string> {
                var nameList:Array<string> = [];
                for (var armatureDataIndex in this._armatureDataList) {
                    nameList[nameList.length] = this._armatureDataList[armatureDataIndex].name;
                }
                return nameList;
            }

            private _armatureDataList:Array<ArmatureData>;

            public getArmatureDataList():Array<ArmatureData> {
                return this._armatureDataList;
            }

            constructor() {
                this._armatureDataList = [];
                this._subTexturePivots = {};
            }

            public dispose():void {
                for (var armatureDataIndex in this._armatureDataList) {
                    this._armatureDataList[armatureDataIndex].dispose();
                }
                this._armatureDataList.length = 0;

                this._armatureDataList = null;
                this._subTexturePivots = null;
            }

            public getArmatureData(armatureName:string):ArmatureData {
                var i:number = this._armatureDataList.length;
                while (i--) {
                    if (this._armatureDataList[i].name == armatureName) {
                        return this._armatureDataList[i];
                    }
                }

                return null;
            }

            public addArmatureData(armatureData:ArmatureData):void {
                if (!armatureData) {
                    throw new Error();
                }

                if (this._armatureDataList.indexOf(armatureData) < 0) {
                    this._armatureDataList[this._armatureDataList.length] = armatureData;
                }
                else {
                    throw new Error();
                }
            }

            public removeArmatureData(armatureData:ArmatureData):void {
                var index:number = this._armatureDataList.indexOf(armatureData);
                if (index >= 0) {
                    this._armatureDataList.splice(index, 1);
                }
            }

            public removeArmatureDataByName(armatureName:string):void {
                var i:number = this._armatureDataList.length;
                while (i--) {
                    if (this._armatureDataList[i].name == armatureName) {
                        this._armatureDataList.splice(i, 1);
                    }
                }
            }

            public getSubTexturePivot(subTextureName:string):geom.Point {
                return this._subTexturePivots[subTextureName];
            }

            public addSubTexturePivot(x:number, y:number, subTextureName:string):geom.Point {
                var point:geom.Point = this._subTexturePivots[subTextureName];
                if (point) {
                    point.x = x;
                    point.y = y;
                }
                else {
                    this._subTexturePivots[subTextureName] = point = new geom.Point(x, y);
                }

                return point;
            }

            public removeSubTexturePivot(subTextureName:string):void {
                if (subTextureName) {
                    delete this._subTexturePivots[subTextureName];
                }
                else {
                    for (subTextureName in this._subTexturePivots) {
                        delete this._subTexturePivots[subTextureName];
                    }
                }
            }
        }

        export class DataParser {
            public static parseTextureAtlasData(rawData:any, scale:number = 1):any {
                if (!rawData) {
                    throw new Error();
                }

                var textureAtlasData:any = {};
                textureAtlasData.__name = rawData[utils.ConstValues.A_NAME];
                var subTextureList:Array<any> = rawData[utils.ConstValues.SUB_TEXTURE]
                for (var index in subTextureList) {
                    var subTextureObject:any = subTextureList[index];
                    var subTextureName:string = subTextureObject[utils.ConstValues.A_NAME];
                    var subTextureData:geom.Rectangle = new geom.Rectangle(
                        Number(subTextureObject[utils.ConstValues.A_X]) / scale,
                        Number(subTextureObject[utils.ConstValues.A_Y]) / scale,
                        Number(subTextureObject[utils.ConstValues.A_WIDTH]) / scale,
                        Number(subTextureObject[utils.ConstValues.A_HEIGHT]) / scale
                    );
                    textureAtlasData[subTextureName] = subTextureData;
                }

                return textureAtlasData;
            }

            public static parseSkeletonData(rawData:any):SkeletonData {
                if (!rawData) {
                    throw new Error();
                }

                /*var version:string = rawData[utils.ConstValues.A_VERSION];
                 switch (version)
                 {
                 case dragonBones:
                 break;
                 default:
                 throw new Error("Nonsupport version!");
                 }*/

                var frameRate:number = Number(rawData[utils.ConstValues.A_FRAME_RATE]);
                var data:SkeletonData = new SkeletonData();
                data.name = rawData[utils.ConstValues.A_NAME];

                var armatureObjectList:Array<any> = rawData[utils.ConstValues.ARMATURE];
                for (var index in armatureObjectList) {
                    var armatureObject:any = armatureObjectList[index];
                    data.addArmatureData(DataParser.parseArmatureData(armatureObject, data, frameRate));
                }

                return data;
            }

            private static parseArmatureData(armatureObject:any, data:SkeletonData, frameRate:number):ArmatureData {
                var armatureData:ArmatureData = new ArmatureData();
                armatureData.name = armatureObject[utils.ConstValues.A_NAME];

                var boneObjectList:Array<any> = armatureObject[utils.ConstValues.BONE];
                for (var index in boneObjectList) {
                    var boneObject:any = boneObjectList[index];
                    armatureData.addBoneData(DataParser.parseBoneData(boneObject));
                }

                var skinObjectList:Array<any> = armatureObject[utils.ConstValues.SKIN];
                for (var index in skinObjectList) {
                    var skinObject:any = skinObjectList[index];
                    armatureData.addSkinData(DataParser.parseSkinData(skinObject, data));
                }

                utils.DBDataUtil.transformArmatureData(armatureData);
                armatureData.sortBoneDataList();

                var animationObjectList:Array<any> = armatureObject[utils.ConstValues.ANIMATION];

                for (var index in animationObjectList) {
                    var animationObject:any = animationObjectList[index];
                    armatureData.addAnimationData(DataParser.parseAnimationData(animationObject, armatureData, frameRate));
                }

                return armatureData;
            }

            private static parseBoneData(boneObject:any):BoneData {
                var boneData:BoneData = new BoneData();
                boneData.name = boneObject[utils.ConstValues.A_NAME];
                boneData.parent = boneObject[utils.ConstValues.A_PARENT];
                boneData.length = Number(boneObject[utils.ConstValues.A_LENGTH]) || 0;
                var scaleMode = Number(boneObject[utils.ConstValues.A_SCALE_MODE]);
                if (!isNaN(scaleMode) && scaleMode) {
                    boneData.scaleMode = scaleMode;
                }
                var inheritRotation:boolean = boneObject[utils.ConstValues.A_FIXED_ROTATION];
                if (inheritRotation) {
                    boneData.fixedRotation = inheritRotation;
                }

                DataParser.parseTransform(boneObject[utils.ConstValues.TRANSFORM], boneData.global);
                boneData.transform.copy(boneData.global);

                return boneData;
            }

            private static parseSkinData(skinObject:any, data:SkeletonData):SkinData {
                var skinData:SkinData = new SkinData();
                skinData.name = skinObject[utils.ConstValues.A_NAME];
                var slotObjectList:Array<any> = skinObject[utils.ConstValues.SLOT];
                for (var index in slotObjectList) {
                    var slotObject:any = slotObjectList[index];
                    skinData.addSlotData(DataParser.parseSlotData(slotObject, data));
                }

                return skinData;
            }

            private static parseSlotData(slotObject:any, data:SkeletonData):SlotData {
                var slotData:SlotData = new SlotData();
                slotData.name = slotObject[utils.ConstValues.A_NAME];
                slotData.parent = slotObject[utils.ConstValues.A_PARENT];
                slotData.zOrder = Number(slotObject[utils.ConstValues.A_Z_ORDER]);

                slotData.blendMode = slotObject[utils.ConstValues.A_BLENDMODE];
                if (!slotData.blendMode) {
                    slotData.blendMode = "normal";
                }

                var displayObjectList:Array<any> = slotObject[utils.ConstValues.DISPLAY];
                for (var index in displayObjectList) {
                    var displayObject:any = displayObjectList[index];
                    slotData.addDisplayData(DataParser.parseDisplayData(displayObject, data));
                }

                return slotData;
            }

            private static parseDisplayData(displayObject:any, data:SkeletonData):DisplayData {
                var displayData:DisplayData = new DisplayData();
                displayData.name = displayObject[utils.ConstValues.A_NAME];
                displayData.type = displayObject[utils.ConstValues.A_TYPE];

                displayData.pivot = data.addSubTexturePivot(
                    0,
                    0,
                    displayData.name
                );

                DataParser.parseTransform(displayObject[utils.ConstValues.TRANSFORM], displayData.transform, displayData.pivot);

                return displayData;
            }

            private static parseAnimationData(animationObject:any, armatureData:ArmatureData, frameRate:number):AnimationData {
                var animationData:AnimationData = new AnimationData();
                animationData.name = animationObject[utils.ConstValues.A_NAME];
                animationData.frameRate = frameRate;
                animationData.loop = Number(animationObject[utils.ConstValues.A_LOOP]) || 0;
                animationData.fadeInTime = Number(animationObject[utils.ConstValues.A_FADE_IN_TIME]);
                animationData.duration = Number(animationObject[utils.ConstValues.A_DURATION]) / frameRate;
                animationData.scale = Number(animationObject[utils.ConstValues.A_SCALE]);

                if (animationObject.hasOwnProperty(utils.ConstValues.A_TWEEN_EASING)) {
                    var tweenEase:any = animationObject[utils.ConstValues.A_TWEEN_EASING];
                    if (
                        tweenEase == undefined ||
                            tweenEase == null
                        ) {
                        animationData.tweenEasing = NaN;
                    }
                    else {
                        animationData.tweenEasing = Number(tweenEase);
                    }
                }
                else {
                    animationData.tweenEasing = NaN;
                }

                DataParser.parseTimeline(animationObject, animationData, DataParser.parseMainFrame, frameRate);

                var timeline:TransformTimeline;
                var timelineName:string;
                var timelineObjectList:Array<any> = animationObject[utils.ConstValues.TIMELINE];
                for (var index in timelineObjectList) {
                    var timelineObject:any = timelineObjectList[index];
                    timeline = DataParser.parseTransformTimeline(timelineObject, animationData.duration, frameRate);
                    timelineName = timelineObject[utils.ConstValues.A_NAME];
                    animationData.addTimeline(timeline, timelineName);
                }

                utils.DBDataUtil.addHideTimeline(animationData, armatureData);
                utils.DBDataUtil.transformAnimationData(animationData, armatureData);

                return animationData;
            }

            private static parseTimeline(timelineObject:any, timeline:Timeline, frameParser:Function, frameRate:number):void {
                var position:number = 0;
                var frame:Frame;
                var frameObjectList:Array<any> = timelineObject[utils.ConstValues.FRAME];
                for (var index in frameObjectList) {
                    var frameObject:any = frameObjectList[index];
                    frame = frameParser(frameObject, frameRate);
                    frame.position = position;
                    timeline.addFrame(frame);
                    position += frame.duration;
                }
                if (frame) {
                    frame.duration = timeline.duration - frame.position;
                }
            }

            private static parseTransformTimeline(timelineObject:any, duration:number, frameRate:number):TransformTimeline {
                var timeline:TransformTimeline = new TransformTimeline();
                timeline.duration = duration;

                DataParser.parseTimeline(timelineObject, timeline, DataParser.parseTransformFrame, frameRate);

                timeline.scale = Number(timelineObject[utils.ConstValues.A_SCALE]);
                timeline.offset = Number(timelineObject[utils.ConstValues.A_OFFSET]);

                return timeline;
            }

            private static parseFrame(frameObject:any, frame:Frame, frameRate:number):void {
                frame.duration = Number(frameObject[utils.ConstValues.A_DURATION]) / frameRate;
                frame.action = frameObject[utils.ConstValues.A_ACTION];
                frame.event = frameObject[utils.ConstValues.A_EVENT];
                frame.sound = frameObject[utils.ConstValues.A_SOUND];
            }

            private static parseMainFrame(frameObject:any, frameRate:number):Frame {
                var frame:Frame = new Frame();
                DataParser.parseFrame(frameObject, frame, frameRate);
                return frame;
            }

            private static parseTransformFrame(frameObject:any, frameRate:number):TransformFrame {
                var frame:TransformFrame = new TransformFrame();
                DataParser.parseFrame(frameObject, frame, frameRate);

                frame.visible = Number(frameObject[utils.ConstValues.A_HIDE]) != 1;

                if (frameObject.hasOwnProperty(utils.ConstValues.A_TWEEN_EASING)) {
                    var tweenEase:any = frameObject[utils.ConstValues.A_TWEEN_EASING];
                    if (
                        tweenEase == undefined ||
                            tweenEase == null
                        ) {
                        frame.tweenEasing = NaN;
                    }
                    else {
                        frame.tweenEasing = Number(tweenEase);
                    }
                }
                else {
                    frame.tweenEasing = 0;
                }

                frame.tweenRotate = Number(frameObject[utils.ConstValues.A_TWEEN_ROTATE]) || 0;
                frame.displayIndex = Number(frameObject[utils.ConstValues.A_DISPLAY_INDEX]) || 0;
                //
                frame.zOrder = Number(frameObject[utils.ConstValues.A_Z_ORDER]) || 0;

                DataParser.parseTransform(frameObject[utils.ConstValues.TRANSFORM], frame.global, frame.pivot);
                frame.transform.copy(frame.global);

                var colorTransformObject:any = frameObject[utils.ConstValues.COLOR_TRANSFORM];
                if (colorTransformObject) {
                    frame.color = new geom.ColorTransform();
                    frame.color.alphaOffset = Number(colorTransformObject[utils.ConstValues.A_ALPHA_OFFSET]);
                    frame.color.redOffset = Number(colorTransformObject[utils.ConstValues.A_RED_OFFSET]);
                    frame.color.greenOffset = Number(colorTransformObject[utils.ConstValues.A_GREEN_OFFSET]);
                    frame.color.blueOffset = Number(colorTransformObject[utils.ConstValues.A_BLUE_OFFSET]);

                    frame.color.alphaMultiplier = Number(colorTransformObject[utils.ConstValues.A_ALPHA_MULTIPLIER]) * 0.01;
                    frame.color.redMultiplier = Number(colorTransformObject[utils.ConstValues.A_RED_MULTIPLIER]) * 0.01;
                    frame.color.greenMultiplier = Number(colorTransformObject[utils.ConstValues.A_GREEN_MULTIPLIER]) * 0.01;
                    frame.color.blueMultiplier = Number(colorTransformObject[utils.ConstValues.A_BLUE_MULTIPLIER]) * 0.01;
                }

                return frame;
            }

            private static parseTransform(transformObject:any, transform:DBTransform, pivot:geom.Point = null):void {
                if (transformObject) {
                    if (transform) {
                        transform.x = Number(transformObject[utils.ConstValues.A_X]);
                        transform.y = Number(transformObject[utils.ConstValues.A_Y]);
                        transform.skewX = Number(transformObject[utils.ConstValues.A_SKEW_X]) * utils.ConstValues.ANGLE_TO_RADIAN;
                        transform.skewY = Number(transformObject[utils.ConstValues.A_SKEW_Y]) * utils.ConstValues.ANGLE_TO_RADIAN;
                        transform.scaleX = Number(transformObject[utils.ConstValues.A_SCALE_X]);
                        transform.scaleY = Number(transformObject[utils.ConstValues.A_SCALE_Y]);
                    }
                    if (pivot) {
                        pivot.x = Number(transformObject[utils.ConstValues.A_PIVOT_X]);
                        pivot.y = Number(transformObject[utils.ConstValues.A_PIVOT_Y]);
                    }
                }
            }
        }
    }

    export module display {
        export interface IDisplayBridge {
            getVisible(): boolean;
            setVisible(value:boolean): void;

            getDisplay(): any;
            setDisplay(value:any): void;

            dispose(): void;

            updateTransform(matrix:geom.Matrix, transform:objects.DBTransform): void;
            updateColor(aOffset:number, rOffset:number, gOffset:number, bOffset:number, aMultiplier:number, rMultiplier:number, gMultiplier:number, bMultiplier:number): void;

            addDisplay(container:any, index:number): void;
            removeDisplay(): void;


            updateBlendMode(blendMode:string):void;
        }
    }

    export module textures {
        export interface ITextureAtlas {
            name: string;
            dispose(): void;
            getRegion(subTextureName:string): geom.Rectangle;
        }
    }

    export module factorys {
        export class BaseFactory extends events.EventDispatcher {
            /** @private */
            public _dataDic:any;
            /** @private */
            public _textureAtlasDic:any;
            /** @private */
            public _textureAtlasLoadingDic:any;
            /** @private */
            public _currentDataName:string;
            /** @private */
            public _currentTextureAtlasName:string;

            constructor() {
                super();

                this._dataDic = {};
                this._textureAtlasDic = {};
                this._textureAtlasLoadingDic = {};
            }


            public getSkeletonData(name:string):objects.SkeletonData {
                return this._dataDic[name];
            }

            public addSkeletonData(data:objects.SkeletonData, name:string = null):void {
                if (!data) {
                    throw new Error();
                }
                name = name || data.name;
                if (!name) {
                    throw new Error("Unnamed data!");
                }
                if (this._dataDic[name]) {

                }
                this._dataDic[name] = data;
            }

            public removeSkeletonData(name:string):void {
                delete this._dataDic[name];
            }

            public getTextureAtlas(name:string):any {
                return this._textureAtlasDic[name];
            }

            public addTextureAtlas(textureAtlas:textures.ITextureAtlas, name:string = null):void {
                if (!textureAtlas) {
                    throw new Error();
                }

                name = name || textureAtlas.name;
                if (!name) {
                    throw new Error("Unnamed data!");
                }
                if (this._textureAtlasDic[name]) {

                }
                this._textureAtlasDic[name] = textureAtlas;
            }

            public removeTextureAtlas(name:string):void {
                delete this._textureAtlasDic[name];
            }


            public dispose(disposeData:boolean = true):void {
                if (disposeData) {
                    for (var i in this._dataDic) {
                        this._dataDic[i].dispose();
                    }
                    for (var i in this._textureAtlasDic) {
                        this._textureAtlasDic[i].dispose();
                    }
                }
                this._dataDic = null
                this._textureAtlasDic = null;
                this._textureAtlasLoadingDic = null;
                this._currentDataName = null;
                this._currentTextureAtlasName = null;
            }

            public buildArmature(armatureName:string, animationName?:string, skeletonName?:string, textureAtlasName?:string, skinName?:string):Armature {
                if (skeletonName) {
                    var data:objects.SkeletonData = this._dataDic[skeletonName];
                    if (data) {
                        var armatureData:objects.ArmatureData = data.getArmatureData(armatureName);
                    }
                }
                else {
                    for (skeletonName in this._dataDic) {
                        data = this._dataDic[skeletonName];
                        armatureData = data.getArmatureData(armatureName);
                        if (armatureData) {
                            break;
                        }
                    }
                }

                if (!armatureData) {
                    return null;
                }

                this._currentDataName = skeletonName;
                this._currentTextureAtlasName = textureAtlasName || skeletonName;

                var armature:Armature = this._generateArmature();
                armature.name = armatureName;
                var bone:Bone;
                var boneData:objects.BoneData;
                var boneDataList:Array<objects.BoneData> = armatureData.getBoneDataList();
                for (var index in boneDataList) {
                    boneData = boneDataList[index];
                    bone = new Bone();
                    bone.name = boneData.name;
                    bone.fixedRotation = boneData.fixedRotation;
                    bone.scaleMode = boneData.scaleMode;
                    bone.origin.copy(boneData.transform);
                    if (armatureData.getBoneData(boneData.parent)) {
                        armature.addChild(bone, boneData.parent);
                    }
                    else {
                        armature.addChild(bone, null);
                    }
                }

                if (animationName && animationName != armatureName) {
                    var animationArmatureData:objects.ArmatureData = data.getArmatureData(animationName);
                    if (!animationArmatureData) {
                        for (skeletonName in this._dataDic) {
                            data = this._dataDic[skeletonName];
                            animationArmatureData = data.getArmatureData(animationName);
                            if (animationArmatureData) {
                                break;
                            }
                        }
                    }
                }

                if (animationArmatureData) {
                    armature.animation.setAnimationDataList(animationArmatureData.getAnimationDataList());
                }
                else {
                    armature.animation.setAnimationDataList(armatureData.getAnimationDataList());
                }

                var skinData:objects.SkinData = armatureData.getSkinData(skinName);
                if (!skinData) {
                    throw new Error();
                }

                var slot:Slot;
                var displayData:objects.DisplayData;
                var childArmature:Armature;
                var i:number;
                var helpArray:Array<any> = [];
                var slotData:objects.SlotData;
                var slotDataList:Array<objects.SlotData> = skinData.getSlotDataList();
                var displayDataList:Array<objects.DisplayData>;
                for (var index in slotDataList) {
                    slotData = slotDataList[index];
                    bone = armature.getBone(slotData.parent);
                    if (!bone) {
                        continue;
                    }
                    displayDataList = slotData.getDisplayDataList();
                    slot = this._generateSlot();
                    slot.name = slotData.name;
                    slot._blendMode = slotData.blendMode;
                    slot._originZOrder = slotData.zOrder;
                    slot._dislayDataList = displayDataList;

                    helpArray.length = 0;
                    i = displayDataList.length;
                    while (i--) {
                        displayData = displayDataList[i];
                        switch (displayData.type) {
                            case objects.DisplayData.ARMATURE:
                                childArmature = this.buildArmature(displayData.name, null, this._currentDataName, this._currentTextureAtlasName, null);
                                if (childArmature) {
                                    helpArray[i] = childArmature;
                                }
                                break;
                            case objects.DisplayData.IMAGE:
                            default:
                                helpArray[i] = this._generateDisplay(this._textureAtlasDic[this._currentTextureAtlasName], displayData.name, displayData.pivot.x, displayData.pivot.y);
                                break;

                        }
                    }
                    slot.setDisplayList(helpArray);
                    slot._changeDisplay(0);
                    bone.addChild(slot);
                }

                armature._slotsZOrderChanged = true;
                armature.advanceTime(0);
                return armature;
            }

            public getTextureDisplay(textureName:string, textureAtlasName:string, pivotX:number, pivotY:number):Object {
                if (textureAtlasName) {
                    var textureAtlas:textures.ITextureAtlas = this._textureAtlasDic[textureAtlasName];
                }
                if (!textureAtlas && !textureAtlasName) {
                    for (textureAtlasName in this._textureAtlasDic) {
                        textureAtlas = this._textureAtlasDic[textureAtlasName];
                        if (textureAtlas.getRegion(textureName)) {
                            break;
                        }
                        textureAtlas = null;
                    }
                }
                if (textureAtlas) {
                    if (isNaN(pivotX) || isNaN(pivotY)) {
                        var data:objects.SkeletonData = this._dataDic[textureAtlasName];
                        if (data) {
                            var pivot:geom.Point = data.getSubTexturePivot(textureName);
                            if (pivot) {
                                pivotX = pivot.x;
                                pivotY = pivot.y;
                            }
                        }
                    }

                    return this._generateDisplay(textureAtlas, textureName, pivotX, pivotY);
                }
                return null;
            }

            /** @private */
            public _generateArmature():Armature {
                return null;
            }

            /** @private */
            public _generateSlot():Slot {
                return null;
            }

            /** @private */
            public _generateDisplay(textureAtlas:textures.ITextureAtlas, fullName:string, pivotX:number, pivotY:number):any {
                return null;
            }
        }
    }

    export module utils {
        export class ConstValues {
            public static ANGLE_TO_RADIAN:number = Math.PI / 180;

            public static DRAGON_BONES:string = "dragonBones";
            public static ARMATURE:string = "armature";
            public static SKIN:string = "skin";
            public static BONE:string = "bone";
            public static SLOT:string = "slot";
            public static DISPLAY:string = "display";
            public static ANIMATION:string = "animation";
            public static TIMELINE:string = "timeline";
            public static FRAME:string = "frame";
            public static TRANSFORM:string = "transform";
            public static COLOR_TRANSFORM:string = "colorTransform";

            public static TEXTURE_ATLAS:string = "TextureAtlas";
            public static SUB_TEXTURE:string = "SubTexture";

            public static A_VERSION:string = "version";
            public static A_IMAGE_PATH:string = "imagePath";
            public static A_FRAME_RATE:string = "frameRate";
            public static A_NAME:string = "name";
            public static A_PARENT:string = "parent";
            public static A_LENGTH:string = "length";
            public static A_TYPE:string = "type";
            public static A_FADE_IN_TIME:string = "fadeInTime";
            public static A_DURATION:string = "duration";
            public static A_SCALE:string = "scale";
            public static A_OFFSET:string = "offset";
            public static A_LOOP:string = "loop";
            public static A_EVENT:string = "event";
            public static A_SOUND:string = "sound";
            public static A_ACTION:string = "action";
            public static A_HIDE:string = "hide";
            public static A_TWEEN_EASING:string = "tweenEasing";
            public static A_TWEEN_ROTATE:string = "tweenRotate";
            public static A_DISPLAY_INDEX:string = "displayIndex";
            public static A_Z_ORDER:string = "z";
            public static A_BLENDMODE:string = "blendMode";
            public static A_WIDTH:string = "width";
            public static A_HEIGHT:string = "height";
            public static A_SCALE_MODE:string = "scaleMode";
            public static A_FIXED_ROTATION:string = "fixedRotation";
            public static A_X:string = "x";
            public static A_Y:string = "y";
            public static A_SKEW_X:string = "skX";
            public static A_SKEW_Y:string = "skY";
            public static A_SCALE_X:string = "scX";
            public static A_SCALE_Y:string = "scY";
            public static A_PIVOT_X:string = "pX";
            public static A_PIVOT_Y:string = "pY";
            public static A_ALPHA_OFFSET:string = "aO";
            public static A_RED_OFFSET:string = "rO";
            public static A_GREEN_OFFSET:string = "gO";
            public static A_BLUE_OFFSET:string = "bO";
            public static A_ALPHA_MULTIPLIER:string = "aM";
            public static A_RED_MULTIPLIER:string = "rM";
            public static A_GREEN_MULTIPLIER:string = "gM";
            public static A_BLUE_MULTIPLIER:string = "bM";
        }

        export class TransformUtil {
            private static DOUBLE_PI:number = Math.PI * 2;
            private static _helpMatrix:geom.Matrix = new geom.Matrix();

            public static transformPointWithParent(transform:objects.DBTransform, parent:objects.DBTransform):void {
                var helpMatrix:geom.Matrix = TransformUtil._helpMatrix;
                TransformUtil.transformToMatrix(parent, helpMatrix);
                helpMatrix.invert();

                var x:number = transform.x;
                var y:number = transform.y;

                transform.x = helpMatrix.a * x + helpMatrix.c * y + helpMatrix.tx;
                transform.y = helpMatrix.d * y + helpMatrix.b * x + helpMatrix.ty;

                transform.skewX = TransformUtil.formatRadian(transform.skewX - parent.skewX);
                transform.skewY = TransformUtil.formatRadian(transform.skewY - parent.skewY);
            }

            public static transformToMatrix(transform:objects.DBTransform, matrix:geom.Matrix):void {
                matrix.a = transform.scaleX * Math.cos(transform.skewY)
                matrix.b = transform.scaleX * Math.sin(transform.skewY)
                matrix.c = -transform.scaleY * Math.sin(transform.skewX);
                matrix.d = transform.scaleY * Math.cos(transform.skewX);
                matrix.tx = transform.x;
                matrix.ty = transform.y;
            }

            public static formatRadian(radian:number):number {
                radian %= TransformUtil.DOUBLE_PI;
                if (radian > Math.PI) {
                    radian -= TransformUtil.DOUBLE_PI;
                }
                if (radian < -Math.PI) {
                    radian += TransformUtil.DOUBLE_PI;
                }
                return radian;
            }
        }

        export class DBDataUtil {
            private static _helpTransform1:objects.DBTransform = new objects.DBTransform();
            private static _helpTransform2:objects.DBTransform = new objects.DBTransform();

            public static transformArmatureData(armatureData:objects.ArmatureData):void {
                var boneDataList:Array<objects.BoneData> = armatureData.getBoneDataList();
                var i:number = boneDataList.length;
                var boneData:objects.BoneData;
                var parentBoneData:objects.BoneData;
                while (i--) {
                    boneData = boneDataList[i];
                    if (boneData.parent) {
                        parentBoneData = armatureData.getBoneData(boneData.parent);
                        if (parentBoneData) {
                            boneData.transform.copy(boneData.global);
                            TransformUtil.transformPointWithParent(boneData.transform, parentBoneData.global);
                        }
                    }
                }
            }

            public static transformArmatureDataAnimations(armatureData:objects.ArmatureData):void {
                var animationDataList:Array<objects.AnimationData> = armatureData.getAnimationDataList();
                var i:number = animationDataList.length;
                while (i--) {
                    DBDataUtil.transformAnimationData(animationDataList[i], armatureData);
                }
            }

            public static transformAnimationData(animationData:objects.AnimationData, armatureData:objects.ArmatureData):void {
                var skinData:objects.SkinData = armatureData.getSkinData(null);
                var boneDataList:Array<objects.BoneData> = armatureData.getBoneDataList();
                var slotDataList:Array<objects.SlotData> = skinData.getSlotDataList();
                var i:number = boneDataList.length;

                var boneData:objects.BoneData;
                var timeline:objects.TransformTimeline;
                var slotData:objects.SlotData;
                var displayData:objects.DisplayData
                var parentTimeline:objects.TransformTimeline;
                var frameList:Array<objects.Frame>;
                var originTransform:objects.DBTransform;
                var originPivot:geom.Point;
                var prevFrame:objects.TransformFrame;
                var frame:objects.TransformFrame;
                var frameListLength:number;

                while (i--) {
                    boneData = boneDataList[i];
                    timeline = animationData.getTimeline(boneData.name);
                    if (!timeline) {
                        continue;
                    }

                    slotData = null;

                    for (var slotIndex in slotDataList) {
                        slotData = slotDataList[slotIndex];
                        if (slotData.parent == boneData.name) {
                            break;
                        }
                    }

                    parentTimeline = boneData.parent ? animationData.getTimeline(boneData.parent) : null;

                    frameList = timeline.getFrameList();

                    originTransform = null;
                    originPivot = null;
                    prevFrame = null;
                    frameListLength = frameList.length;
                    for (var j:number = 0; j < frameListLength; j++) {
                        frame = <objects.TransformFrame> frameList[j];
                        if (parentTimeline) {
                            //tweenValues to transform.
                            DBDataUtil._helpTransform1.copy(frame.global);

                            //get transform from parent timeline.
                            DBDataUtil.getTimelineTransform(parentTimeline, frame.position, DBDataUtil._helpTransform2);
                            TransformUtil.transformPointWithParent(DBDataUtil._helpTransform1, DBDataUtil._helpTransform2);

                            //transform to tweenValues.
                            frame.transform.copy(DBDataUtil._helpTransform1);
                        }
                        else {
                            frame.transform.copy(frame.global);
                        }

                        frame.transform.x -= boneData.transform.x;
                        frame.transform.y -= boneData.transform.y;
                        frame.transform.skewX -= boneData.transform.skewX;
                        frame.transform.skewY -= boneData.transform.skewY;
                        frame.transform.scaleX -= boneData.transform.scaleX;
                        frame.transform.scaleY -= boneData.transform.scaleY;

                        if (!timeline.transformed) {
                            if (slotData) {
                                frame.zOrder -= slotData.zOrder;
                            }
                        }

                        if (!originTransform) {
                            originTransform = timeline.originTransform;
                            originTransform.copy(frame.transform);
                            originTransform.skewX = TransformUtil.formatRadian(originTransform.skewX);
                            originTransform.skewY = TransformUtil.formatRadian(originTransform.skewY);
                            originPivot = timeline.originPivot;
                            originPivot.x = frame.pivot.x;
                            originPivot.y = frame.pivot.y;
                        }

                        frame.transform.x -= originTransform.x;
                        frame.transform.y -= originTransform.y;
                        frame.transform.skewX = TransformUtil.formatRadian(frame.transform.skewX - originTransform.skewX);
                        frame.transform.skewY = TransformUtil.formatRadian(frame.transform.skewY - originTransform.skewY);
                        frame.transform.scaleX -= originTransform.scaleX;
                        frame.transform.scaleY -= originTransform.scaleY;

                        if (!timeline.transformed) {
                            frame.pivot.x -= originPivot.x;
                            frame.pivot.y -= originPivot.y;
                        }

                        if (prevFrame) {
                            var dLX:number = frame.transform.skewX - prevFrame.transform.skewX;

                            if (prevFrame.tweenRotate) {

                                if (prevFrame.tweenRotate > 0) {
                                    if (dLX < 0) {
                                        frame.transform.skewX += Math.PI * 2;
                                        frame.transform.skewY += Math.PI * 2;
                                    }

                                    if (prevFrame.tweenRotate > 1) {
                                        frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate - 1);
                                        frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate - 1);
                                    }
                                }
                                else {
                                    if (dLX > 0) {
                                        frame.transform.skewX -= Math.PI * 2;
                                        frame.transform.skewY -= Math.PI * 2;
                                    }

                                    if (prevFrame.tweenRotate < 1) {
                                        frame.transform.skewX += Math.PI * 2 * (prevFrame.tweenRotate + 1);
                                        frame.transform.skewY += Math.PI * 2 * (prevFrame.tweenRotate + 1);
                                    }
                                }
                            }
                            else {
                                frame.transform.skewX = prevFrame.transform.skewX + TransformUtil.formatRadian(frame.transform.skewX - prevFrame.transform.skewX);
                                frame.transform.skewY = prevFrame.transform.skewY + TransformUtil.formatRadian(frame.transform.skewY - prevFrame.transform.skewY);
                            }
                        }

                        prevFrame = frame;
                    }
                    timeline.transformed = true;
                }
            }

            public static getTimelineTransform(timeline:objects.TransformTimeline, position:number, retult:objects.DBTransform):void {
                var frameList:Array<objects.Frame> = timeline.getFrameList();
                var i:number = frameList.length;

                var currentFrame:objects.TransformFrame;
                var tweenEasing:number;
                var progress:number;
                var nextFrame:objects.TransformFrame;
                while (i--) {
                    currentFrame = <objects.TransformFrame> frameList[i];
                    if (currentFrame.position <= position && currentFrame.position + currentFrame.duration > position) {
                        tweenEasing = currentFrame.tweenEasing;
                        if (i == frameList.length - 1 || isNaN(tweenEasing) || position == currentFrame.position) {
                            retult.copy(currentFrame.global);
                        }
                        else {
                            progress = (position - currentFrame.position) / currentFrame.duration;
                            if (tweenEasing) {
                                progress = animation.TimelineState.getEaseValue(progress, tweenEasing);
                            }

                            nextFrame = <objects.TransformFrame> frameList[i + 1];

                            retult.x = currentFrame.global.x + (nextFrame.global.x - currentFrame.global.x) * progress;
                            retult.y = currentFrame.global.y + (nextFrame.global.y - currentFrame.global.y) * progress;
                            retult.skewX = TransformUtil.formatRadian(currentFrame.global.skewX + (nextFrame.global.skewX - currentFrame.global.skewX) * progress);
                            retult.skewY = TransformUtil.formatRadian(currentFrame.global.skewY + (nextFrame.global.skewY - currentFrame.global.skewY) * progress);
                            retult.scaleX = currentFrame.global.scaleX + (nextFrame.global.scaleX - currentFrame.global.scaleX) * progress;
                            retult.scaleY = currentFrame.global.scaleY + (nextFrame.global.scaleY - currentFrame.global.scaleY) * progress;
                        }
                        break;
                    }
                }
            }

            public static addHideTimeline(animationData:objects.AnimationData, armatureData:objects.ArmatureData):void {
                var boneDataList:Array<objects.BoneData> = armatureData.getBoneDataList();
                var i:number = boneDataList.length;

                var boneData:objects.BoneData;
                var boneName:string;
                while (i--) {
                    boneData = boneDataList[i];
                    boneName = boneData.name;
                    if (!animationData.getTimeline(boneName)) {
                        animationData.addTimeline(objects.TransformTimeline.HIDE_TIMELINE, boneName);
                    }
                }
            }
        }
    }

    /** @private */
    export class DBObject {
        public name:string;

        public fixedRotation:boolean;

        public global:objects.DBTransform;
        public origin:objects.DBTransform;
        public offset:objects.DBTransform;
        public tween:objects.DBTransform;

        public parent:Bone;
        public armature:Armature;

        /** @private */
        public _globalTransformMatrix:geom.Matrix;
        /** @private */
        public _isDisplayOnStage:boolean;
        /** @private */
        public _scaleType:number;
        /** @private */
        public _isColorChanged:boolean;
        /** @private */
        public _visible:boolean;

        public getVisible():boolean {
            return this._visible;
        }

        public setVisible(value:boolean):void {
            this._visible = value;
        }

        /** @private */
        public _setParent(value:Bone):void {
            this.parent = value;
        }

        /** @private */
        public _setArmature(value:Armature):void {
            if (this.armature) {
                this.armature._removeDBObject(this);
            }
            this.armature = value;
            if (this.armature) {
                this.armature._addDBObject(this);
            }
        }

        constructor() {
            this.global = new objects.DBTransform();
            this.origin = new objects.DBTransform();
            this.offset = new objects.DBTransform();
            this.tween = new objects.DBTransform();
            this.tween.scaleX = this.tween.scaleY = 0;

            this._globalTransformMatrix = new geom.Matrix();

            this._visible = true;
            this._isColorChanged = false;
            this._isDisplayOnStage = false;
            this._scaleType = 0;

            this.fixedRotation = false;
        }

        public dispose():void {
            this.parent = null;
            this.armature = null;
            this.global = null;
            this.origin = null;
            this.offset = null;
            this.tween = null;
            this._globalTransformMatrix = null;
        }

        /** @private */
        public _update():void {
            this.global.scaleX = (this.origin.scaleX + this.tween.scaleX) * this.offset.scaleX;
            this.global.scaleY = (this.origin.scaleY + this.tween.scaleY) * this.offset.scaleY;

            if (this.parent) {
                var x:number = this.origin.x + this.offset.x + this.tween.x;
                var y:number = this.origin.y + this.offset.y + this.tween.y;
                var parentMatrix:geom.Matrix = this.parent._globalTransformMatrix;

                this._globalTransformMatrix.tx = this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                this._globalTransformMatrix.ty = this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;

                if (this.fixedRotation) {
                    this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
                    this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY;
                }
                else {
                    this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX + this.parent.global.skewX;
                    this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY + this.parent.global.skewY;
                }

                if (this.parent.scaleMode >= this._scaleType) {
                    this.global.scaleX *= this.parent.global.scaleX;
                    this.global.scaleY *= this.parent.global.scaleY;
                }
            }
            else {
                this._globalTransformMatrix.tx = this.global.x = this.origin.x + this.offset.x + this.tween.x;
                this._globalTransformMatrix.ty = this.global.y = this.origin.y + this.offset.y + this.tween.y;

                this.global.skewX = this.origin.skewX + this.offset.skewX + this.tween.skewX;
                this.global.skewY = this.origin.skewY + this.offset.skewY + this.tween.skewY;
            }
            this._globalTransformMatrix.a = this.global.scaleX * Math.cos(this.global.skewY);
            this._globalTransformMatrix.b = this.global.scaleX * Math.sin(this.global.skewY);
            this._globalTransformMatrix.c = -this.global.scaleY * Math.sin(this.global.skewX);
            this._globalTransformMatrix.d = this.global.scaleY * Math.cos(this.global.skewX);
        }
    }

    export class Slot extends DBObject {
        /** @private */
        public _dislayDataList:Array<objects.DisplayData>;
        /** @private */
        public _displayBridge:display.IDisplayBridge;
        /** @private */
        public _isDisplayOnStage:boolean;
        /** @private */
        public _originZOrder:number;
        /** @private */
        public _tweenZorder:number;

        private _isHideDisplay:boolean;
        private _offsetZOrder:number;
        private _displayIndex:number;
        public _blendMode:string;

        public getZOrder():number {
            return this._originZOrder + this._tweenZorder + this._offsetZOrder;
        }

        public setZOrder(value:number):void {
            if (this.getZOrder() != value) {
                this._offsetZOrder = value - this._originZOrder - this._tweenZorder;
                if (this.armature) {
                    this.armature._slotsZOrderChanged = true;
                }
            }
        }

        public getDisplay():any {
            var display:any = this._displayList[this._displayIndex];
            if (display instanceof Armature) {
                return (<Armature> display).getDisplay();
            }
            return display;
        }

        public setDisplay(value:any):void {
            this._displayList[this._displayIndex] = value;
            this._setDisplay(value);
        }

        public getBlendMode():string {
            return this._blendMode;
        }

        public setBlendMode(value:string):void {
            if (this._blendMode != value) {
                this._blendMode = value;
                if (this._displayBridge.getDisplay()) {
                    this._displayBridge.updateBlendMode(this._blendMode);
                }
            }
        }

        public getChildArmature():Armature {
            var display:any = this._displayList[this._displayIndex];
            if (display instanceof Armature) {
                return display;
            }
            return null;
        }

        public setChildArmature(value:Armature):void {
            this._displayList[this._displayIndex] = value;
            if (value) {
                this._setDisplay(value.getDisplay());
            }
        }

        /** @private */
        public _displayList:Array<any>;

        public getDisplayList():Array<any> {
            return this._displayList;
        }

        public setDisplayList(value:Array<any>):void {
            if (!value) {
                throw new Error();
            }
            var i:number = this._displayList.length = value.length;
            while (i--) {
                this._displayList[i] = value[i];
            }
            if (this._displayIndex >= 0) {
                var displayIndexBackup:number = this._displayIndex;
                this._displayIndex = -1;
                this._changeDisplay(displayIndexBackup);
            }
        }

        private _setDisplay(display:any):void {
            if (this._displayBridge.getDisplay()) {
                this._displayBridge.setDisplay(display);
            }
            else {
                this._displayBridge.setDisplay(display);
                if (this.armature) {
                    this._displayBridge.addDisplay(this.armature.getDisplay(), -1);
                    this.armature._slotsZOrderChanged = true;
                }
            }

            this.updateChildArmatureAnimation();
            if (display) {
                this._displayBridge.updateBlendMode(this._blendMode);
            }

            if (!this._isHideDisplay && this._displayBridge.getDisplay()) {
                this._isDisplayOnStage = true;
            }
            else {
                this._isDisplayOnStage = false;
            }
        }

        /** @private */
        public _changeDisplay(displayIndex:number):void {
            if (displayIndex < 0) {
                if (!this._isHideDisplay) {
                    this._isHideDisplay = true;
                    this._displayBridge.removeDisplay();
                    this.updateChildArmatureAnimation();
                }
            }
            else {
                if (this._isHideDisplay) {
                    this._isHideDisplay = false;
                    var changeShowState:boolean = true;
                    if (this.armature) {
                        this._displayBridge.addDisplay(this.armature.getDisplay(), -1);
                        this.armature._slotsZOrderChanged = true;
                    }
                }

                var length:number = this._displayList.length;
                if (displayIndex >= length && length > 0) {
                    displayIndex = length - 1;
                }
                if (this._displayIndex != displayIndex) {
                    this._displayIndex = displayIndex;

                    var display:any = this._displayList[this._displayIndex];
                    if (display instanceof Armature) {
                        this._setDisplay((<Armature> display).getDisplay());
                    }
                    else {
                        this._setDisplay(display);
                    }

                    if (this._dislayDataList && this._displayIndex <= this._dislayDataList.length) {
                        this.origin.copy(this._dislayDataList[this._displayIndex].transform);
                    }
                }
                else if (changeShowState) {
                    this.updateChildArmatureAnimation();
                }
            }

            if (!this._isHideDisplay && this._displayBridge.getDisplay()) {
                this._isDisplayOnStage = true;
            }
            else {
                this._isDisplayOnStage = false;
            }
        }

        public setVisible(value:boolean):void {
            if (value != this._visible) {
                this._visible = value;
                this._updateVisible(this._visible);
            }
        }

        /** @private */
        public _setArmature(value:Armature):void {
            super._setArmature(value);
            if (this.armature) {
                this.armature._slotsZOrderChanged = true;
                this._displayBridge.addDisplay(this.armature.getDisplay(), -1);
            }
            else {
                this._displayBridge.removeDisplay();
            }
        }

        constructor(displayBrideg:display.IDisplayBridge) {
            super();
            this._displayBridge = displayBrideg;
            this._displayList = [];
            this._displayIndex = -1;
            this._scaleType = 1;

            this._originZOrder = 0;
            this._tweenZorder = 0;
            this._offsetZOrder = 0;

            this._isDisplayOnStage = false;
            this._isHideDisplay = false;

            this._blendMode = "normal";
            this._displayBridge.updateBlendMode(this._blendMode);
        }

        public dispose():void {
            if (!this._displayBridge) {
                return;
            }
            super.dispose();

            this._displayBridge.dispose();
            this._displayList.length = 0;

            this._displayBridge = null;
            this._displayList = null;
            this._dislayDataList = null;
        }

        /** @private */
        public _update():void {
            super._update();
            if (this._isDisplayOnStage) {
                var pivotX:number = this.parent._tweenPivot.x;
                var pivotY:number = this.parent._tweenPivot.y;
                if (pivotX || pivotY) {
                    var parentMatrix:geom.Matrix = this.parent._globalTransformMatrix;
                    this._globalTransformMatrix.tx += parentMatrix.a * pivotX + parentMatrix.c * pivotY;
                    this._globalTransformMatrix.ty += parentMatrix.b * pivotX + parentMatrix.d * pivotY;
                }

                this._displayBridge.updateTransform(this._globalTransformMatrix, this.global);
            }
        }

        /** @private */
        public _updateVisible(value:boolean):void {
            this._displayBridge.setVisible(this.parent.getVisible() && this._visible && value);
        }

        private updateChildArmatureAnimation():void {
            var childArmature:Armature = this.getChildArmature();

            if (childArmature) {
                if (this._isHideDisplay) {
                    childArmature.animation.stop();
                    childArmature.animation._lastAnimationState = null;
                }
                else {
                    var lastAnimationName:string = this.armature ? this.armature.animation.getLastAnimationName() : null;
                    if (lastAnimationName && childArmature.animation.hasAnimation(lastAnimationName)) {
                        childArmature.animation.gotoAndPlay(lastAnimationName);
                    }
                    else {
                        childArmature.animation.play();
                    }
                }
            }
        }
    }

    export class Bone extends DBObject {
        private static _soundManager:events.SoundEventManager = events.SoundEventManager.getInstance();

        public scaleMode:number;
        public displayController:string;

        public slot:Slot;

        /** @private */
        public _tweenPivot:geom.Point;

        private _children:Array<DBObject>;

        public setVisible(value:boolean):void {
            if (this._visible != value) {
                this._visible = value;
                var i:number = this._children.length;
                while (i--) {
                    var child:DBObject = this._children[i];
                    if (child instanceof Slot) {
                        (<Slot> child)._updateVisible(this._visible);
                    }
                }
            }
        }

        /** @private */
        public _setArmature(value:Armature):void {
            super._setArmature(value);
            var i:number = this._children.length;
            while (i--) {
                this._children[i]._setArmature(this.armature);
            }
        }

        constructor() {
            super();
            this._children = [];
            this._scaleType = 2;

            this._tweenPivot = new geom.Point();

            this.scaleMode = 1;
        }

        public dispose():void {
            if (!this._children) {
                return;
            }
            super.dispose();

            var i:number = this._children.length;
            while (i--) {
                this._children[i].dispose();
            }
            this._children.length = 0;

            this._children = null;
            this._tweenPivot = null;

            this.slot = null;
        }

        public contains(child:DBObject):boolean {
            if (!child) {
                throw new Error();
            }
            if (child == this) {
                return false;
            }
            var ancestor:DBObject = child;
            while (!(ancestor == this || ancestor == null)) {
                ancestor = ancestor.parent;
            }
            return ancestor == this;
        }

        public addChild(child:DBObject):void {
            if (!child) {
                throw new Error();
            }

            if (child == this || (child instanceof Bone && (<Bone> child).contains(this))) {
                throw new Error("An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)");
            }

            if (child.parent) {
                child.parent.removeChild(child);
            }
            this._children[this._children.length] = child;
            child._setParent(this);
            child._setArmature(this.armature);

            if (!this.slot && child instanceof Slot) {
                this.slot = <Slot> child;
            }
        }

        public removeChild(child:DBObject):void {
            if (!child) {
                throw new Error();
            }

            var index:number = this._children.indexOf(child);
            if (index >= 0) {
                this._children.splice(index, 1);
                child._setParent(null);
                child._setArmature(null);

                if (child == this.slot) {
                    this.slot = null;
                }
            }
            else {
                throw new Error();
            }
        }

        public getSlots():Array<Slot> {
            var slotList:Array<Slot> = [];
            var i:number = this._children.length;
            while (i--) {
                if (this._children[i] instanceof Slot) {
                    slotList.unshift(<Slot> this._children[i]);
                }
            }
            return slotList;
        }

        /** @private */
        public _arriveAtFrame(frame:objects.Frame, timelineState:animation.TimelineState, animationState:animation.AnimationState, isCross:boolean):void {
            if (frame) {
                var mixingType:number = animationState.getMixingTransform(this.name);
                if (animationState.displayControl && (mixingType == 2 || mixingType == -1)) {
                    if (
                        !this.displayController ||
                            this.displayController == animationState.name
                        ) {
                        var tansformFrame:objects.TransformFrame = <objects.TransformFrame> frame;
                        if (this.slot) {
                            var displayIndex:number = tansformFrame.displayIndex;
                            if (displayIndex >= 0) {
                                if (
                                    !isNaN(tansformFrame.zOrder) &&
                                        tansformFrame.zOrder != this.slot._tweenZorder
                                    ) {
                                    this.slot._tweenZorder = tansformFrame.zOrder;
                                    this.armature._slotsZOrderChanged = true;
                                }
                            }
                            this.slot._changeDisplay(displayIndex);
                            this.slot._updateVisible(tansformFrame.visible);
                        }
                    }
                }

                if (frame.event && this.armature.hasEventListener(events.FrameEvent.BONE_FRAME_EVENT)) {
                    var frameEvent:events.FrameEvent = new events.FrameEvent(events.FrameEvent.BONE_FRAME_EVENT);
                    frameEvent.bone = this;
                    frameEvent.animationState = animationState;
                    frameEvent.frameLabel = frame.event;
                    this.armature._eventList.push(frameEvent);
                }

                if (frame.sound && Bone._soundManager.hasEventListener(events.SoundEvent.SOUND)) {
                    var soundEvent:events.SoundEvent = new events.SoundEvent(events.SoundEvent.SOUND);
                    soundEvent.armature = this.armature;
                    soundEvent.animationState = animationState;
                    soundEvent.sound = frame.sound;
                    Bone._soundManager.dispatchEvent(soundEvent);
                }

                if (frame.action) {
                    for (var index in this._children) {
                        if (this._children[index] instanceof Slot) {
                            var childArmature:Armature = (<Slot> this._children[index]).getChildArmature();
                            if (childArmature) {
                                childArmature.animation.gotoAndPlay(frame.action);
                            }
                        }
                    }
                }
            }
            else {
                if (this.slot) {
                    this.slot._changeDisplay(-1);
                }
            }
        }

        /** @private */
        public _updateColor(aOffset:number, rOffset:number, gOffset:number, bOffset:number, aMultiplier:number, rMultiplier:number, gMultiplier:number, bMultiplier:number, isColorChanged:boolean):void {
            if (isColorChanged || this._isColorChanged) {
                this.slot._displayBridge.updateColor(
                    aOffset,
                    rOffset,
                    gOffset,
                    bOffset,
                    aMultiplier,
                    rMultiplier,
                    gMultiplier,
                    bMultiplier
                );
            }
            this._isColorChanged = isColorChanged;
        }
    }

    export class Armature extends events.EventDispatcher implements animation.IAnimatable {
        private static _soundManager:events.SoundEventManager = events.SoundEventManager.getInstance();

        public name:string;

        public animation:animation.Animation;

        /** @private */
        public _slotsZOrderChanged:boolean;
        /** @private */
        public _slotList:Array<Slot>;
        /** @private */
        public _boneList:Array<Bone>;
        /** @private */
        public _eventList:Array<events.Event>;

        private _display:any;

        public getDisplay():any {
            return this._display;
        }

        constructor(display:any) {
            super();

            this.animation = new animation.Animation(this);

            this._display = display;
            this._slotsZOrderChanged = false;
            this._slotList = [];
            this._boneList = [];
            this._eventList = [];
        }

        public dispose():void {
            if (!this.animation) {
                return;
            }

            this.animation.dispose();

            var i:number = this._slotList.length;
            while (i--) {
                this._slotList[i].dispose();
            }

            i = this._boneList.length;
            while (i--) {
                this._boneList[i].dispose();
            }

            this._slotList.length = 0;
            this._boneList.length = 0;
            this._eventList.length = 0;

            this._slotList = null;
            this._boneList = null;
            this._eventList = null;
            this._display = null;

            this.animation = null;
        }

        public advanceTime(passedTime:number):void {
            this.animation.advanceTime(passedTime);
            passedTime *= this.animation.timeScale;

            var i:number = this._boneList.length;
            while (i--) {
                this._boneList[i]._update();
            }
            i = this._slotList.length;
            var slot:Slot;
            while (i--) {
                slot = this._slotList[i];
                slot._update();
                if (slot._isDisplayOnStage) {
                    var childArmature:Armature = slot.getChildArmature();
                    if (childArmature) {
                        childArmature.advanceTime(passedTime);
                    }
                }
            }

            if (this._slotsZOrderChanged) {
                this.updateSlotsZOrder();
                if (this.hasEventListener(events.ArmatureEvent.Z_ORDER_UPDATED)) {
                    this.dispatchEvent(new events.ArmatureEvent(events.ArmatureEvent.Z_ORDER_UPDATED));
                }
            }

            if (this._eventList.length) {
                var length = this._eventList.length;
                for (i = 0; i < length; i++) {
                    this.dispatchEvent(this._eventList[i]);
                }
                this._eventList.length = 0;
            }
        }

        public getSlots(returnCopy:boolean = true):Array<Slot> {
            return returnCopy ? this._slotList.concat() : this._slotList;
        }

        public getBones(returnCopy:boolean = true):Array<Bone> {
            return returnCopy ? this._boneList.concat() : this._boneList;
        }

        public getSlot(slotName:string):Slot {
            var i:number = this._slotList.length;
            while (i--) {
                if (this._slotList[i].name == slotName) {
                    return this._slotList[i];
                }
            }
            return null;
        }

        public getSlotByDisplay(display:Object):Slot {
            if (display) {
                var i:number = this._slotList.length;
                while (i--) {
                    if (this._slotList[i].getDisplay() == display) {
                        return this._slotList[i];
                    }
                }
            }
            return null;
        }

        public removeSlot(slot:Slot):void {
            if (!slot) {
                throw new Error();
            }

            if (this._slotList.indexOf(slot) >= 0) {
                slot.parent.removeChild(slot);
            }
            else {
                throw new Error();
            }
        }

        public removeSlotByName(slotName:string):void {
            if (!slotName) {
                return;
            }

            var slot:Slot = this.getSlot(slotName);
            if (slot) {
                this.removeSlot(slot);
            }
        }

        public getBone(boneName:string):Bone {
            var i:number = this._boneList.length;
            while (i--) {
                if (this._boneList[i].name == boneName) {
                    return this._boneList[i];
                }
            }
            return null;
        }

        public getBoneByDisplay(display:Object):Bone {
            var slot:Slot = this.getSlotByDisplay(display);
            return slot ? slot.parent : null;
        }

        public removeBone(bone:Bone):void {
            if (!bone) {
                throw new Error();
            }

            if (this._boneList.indexOf(bone) >= 0) {
                if (bone.parent) {
                    bone.parent.removeChild(bone);
                }
                else {
                    bone._setArmature(null);
                }
            }
            else {
                throw new Error();
            }
        }

        public removeBoneByName(boneName:string):void {
            if (!boneName) {
                return;
            }

            var bone:Bone = this.getBone(boneName);
            if (bone) {
                this.removeBone(bone);
            }
        }

        public addChild(object:DBObject, parentName:string):void {
            if (!object) {
                throw new Error();
            }
            if (parentName) {
                var boneParent:Bone = this.getBone(parentName);
                if (boneParent) {
                    boneParent.addChild(object);
                }
                else {
                    throw new Error();
                }
            }
            else {
                if (object.parent) {
                    object.parent.removeChild(object);
                }
                object._setArmature(this);
            }
        }

        public updateSlotsZOrder():void {
            this._slotList.sort(this.sortSlot);
            var i:number = this._slotList.length;
            var slot:Slot;
            while (i--) {
                slot = this._slotList[i];
                if (slot._isDisplayOnStage) {
                    slot._displayBridge.addDisplay(this._display, -1);
                }
            }

            this._slotsZOrderChanged = false;
        }

        /** @private */
        public _addDBObject(object:DBObject):void {
            if (object instanceof Slot) {
                var slot:Slot = <Slot> object;
                if (this._slotList.indexOf(slot) < 0) {
                    this._slotList[this._slotList.length] = slot;
                }
            }
            else if (object instanceof Bone) {
                var bone:Bone = <Bone> object;
                if (this._boneList.indexOf(bone) < 0) {
                    this._boneList[this._boneList.length] = bone;
                    this._sortBoneList();
                }
            }
        }

        /** @private */
        public _removeDBObject(object:DBObject):void {
            if (object instanceof Slot) {
                var slot:Slot = <Slot> object;
                var index:number = this._slotList.indexOf(slot);
                if (index >= 0) {
                    this._slotList.splice(index, 1);
                }
            }
            else if (object instanceof Bone) {
                var bone:Bone = <Bone> object;
                index = this._boneList.indexOf(bone);
                if (index >= 0) {
                    this._boneList.splice(index, 1);
                }
            }
        }

        /** @private */
        public _sortBoneList():void {
            var i:number = this._boneList.length;
            if (i == 0) {
                return;
            }
            var helpArray:Array<any> = [];
            var level:number;
            var bone:Bone;
            var boneParent:Bone;
            while (i--) {
                level = 0;
                bone = this._boneList[i];
                boneParent = bone;
                while (boneParent) {
                    level++;
                    boneParent = boneParent.parent;
                }
                helpArray[i] = {level: level, bone: bone};
            }

            helpArray.sort(this.sortBone);

            i = helpArray.length;
            while (i--) {
                this._boneList[i] = helpArray[i].bone;
            }
        }

        /** @private */
        public _arriveAtFrame(frame:objects.Frame, timelineState:animation.TimelineState, animationState:animation.AnimationState, isCross:boolean):void {
            if (frame.event && this.hasEventListener(events.FrameEvent.ANIMATION_FRAME_EVENT)) {
                var frameEvent:events.FrameEvent = new events.FrameEvent(events.FrameEvent.ANIMATION_FRAME_EVENT);
                frameEvent.animationState = animationState;
                frameEvent.frameLabel = frame.event;
                this._eventList.push(frameEvent);
            }

            if (frame.sound && Armature._soundManager.hasEventListener(events.SoundEvent.SOUND)) {
                var soundEvent:events.SoundEvent = new events.SoundEvent(events.SoundEvent.SOUND);
                soundEvent.armature = this;
                soundEvent.animationState = animationState;
                soundEvent.sound = frame.sound;
                Armature._soundManager.dispatchEvent(soundEvent);
            }

            if (frame.action) {
                if (animationState.isPlaying) {
                    this.animation.gotoAndPlay(frame.action);
                }
            }
        }

        private sortSlot(slot1:Slot, slot2:Slot):number {
            return slot1.getZOrder() < slot2.getZOrder() ? 1 : -1;
        }

        private sortBone(object1:any, object2:any):number {
            return object1.level < object2.level ? 1 : -1;
        }
    }
}
