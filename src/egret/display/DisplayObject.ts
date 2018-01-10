//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

namespace egret {

    /**
     * @private
     */
    export const enum RenderMode {
        NONE = 1,
        FILTER = 2,
        CLIP = 3,
        SCROLLRECT = 4
    };

    /**
     * @private
     * 格式化旋转角度的值
     */
    function clampRotation(value): number {
        value %= 360;
        if (value > 180) {
            value -= 360;
        } else if (value < -180) {
            value += 360;
        }
        return value;
    }

    /**
     * The DisplayObject class is the base class for all objects that can be placed on the display list. The display list
     * manages all objects displayed in the runtime. Use the DisplayObjectContainer class to arrange the display
     * objects in the display list. DisplayObjectContainer objects can have child display objects, while other display objects,
     * such as Shape and TextField objects, are "leaf" nodes that have only parents and siblings, no children.
     * The DisplayObject class supports basic functionality like the x and y position of an object, as well as more advanced
     * properties of the object such as its transformation matrix.<br/>
     * The DisplayObject class contains several broadcast events.Normally, the target of any particular event is a specific
     * DisplayObject instance. For example, the target of an added event is the specific DisplayObject instance that was added
     * to the display list. Having a single target restricts the placement of event listeners to that target and in some cases
     * the target's ancestors on the display list. With broadcast events, however, the target is not a specific DisplayObject
     * instance, but rather all DisplayObject instances, including those that are not on the display list. This means that you
     * can add a listener to any DisplayObject instance to listen for broadcast events.
     *
     * @event egret.Event.ADDED Dispatched when a display object is added to the display list.
     * @event egret.Event.ADDED_TO_STAGE Dispatched when a display object is added to the on stage display list, either directly or through the addition of a sub tree in which the display object is contained.
     * @event egret.Event.REMOVED Dispatched when a display object is about to be removed from the display list.
     * @event egret.Event.REMOVED_FROM_STAGE Dispatched when a display object is about to be removed from the display list, either directly or through the removal of a sub tree in which the display object is contained.
     * @event egret.Event.ENTER_FRAME [broadcast event] Dispatched when the playhead is entering a new frame.
     * @event egret.Event.RENDER [broadcast event] Dispatched when the display list is about to be updated and rendered.
     * @event egret.TouchEvent.TOUCH_MOVE Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
     * @event egret.TouchEvent.TOUCH_BEGIN Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_END Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_TAP Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display object on a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_RELEASE_OUTSIDE Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display object on a mobile phone or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObject.ts
     * @language en_US
     */
    /**
     * DisplayObject 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时中显示的所有对象。使用 DisplayObjectContainer 类排列
     * 显示列表中的显示对象。DisplayObjectContainer 对象可以有子显示对象，而其他显示对象（如 Shape 和 TextField 对象）是“叶”节点，没有子项，只有父级和
     * 同级。DisplayObject 类有一些基本的属性（如确定坐标位置的 x 和 y 属性），也有一些高级的对象属性（如 Matrix 矩阵变换）。<br/>
     * DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。例如，added 事件的目标是已添加到显示列表
     * 的目标 DisplayObject 实例。若只有一个目标，则会将事件侦听器限制为只能监听在该目标上（在某些情况下，可监听在显示列表中该目标的祖代上）。
     * 但是对于广播事件，目标不是特定的 DisplayObject 实例，而是所有 DisplayObject 实例（包括那些不在显示列表中的实例）。这意味着您可以向任何
     * DisplayObject 实例添加侦听器来侦听广播事件。
     *
     * @event egret.Event.ADDED 将显示对象添加到显示列表中时调度。
     * @event egret.Event.ADDED_TO_STAGE 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
     * @event egret.Event.REMOVED 将要从显示列表中删除显示对象时调度。
     * @event egret.Event.REMOVED_FROM_STAGE 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
     * @event egret.Event.ENTER_FRAME [广播事件] 播放头进入新帧时调度。
     * @event egret.Event.RENDER [广播事件] 将要更新和呈现显示列表时调度。
     * @event egret.TouchEvent.TOUCH_MOVE 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。
     * @event egret.TouchEvent.TOUCH_BEGIN 当用户第一次触摸启用触摸的设备时（例如，用手指触摸手机屏幕）调度。
     * @event egret.TouchEvent.TOUCH_END 当用户移除与启用触摸的设备的接触时（例如，将手指从屏幕上抬起）调度。
     * @event egret.TouchEvent.TOUCH_TAP 当用户在启用触摸设备上的已启动接触的同一 DisplayObject 实例上抬起接触点时（例如，手机点击屏幕后抬起）调度。
     * @event egret.TouchEvent.TOUCH_RELEASE_OUTSIDE 当用户在启用触摸设备上的已启动接触的不同 DisplayObject 实例上抬起接触点时（例如，按住屏幕上的某个对象,然后从它上面挪开后再松开手指）调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObject.ts
     * @language zh_CN
     */
    export class DisplayObject extends EventDispatcher {

        /**
         * Initializes a DisplayObject object
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个显示对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            super();
            if (egret.nativeRender) {
                this.createNativeDisplayObject();
            }
        }

        $nativeDisplayObject: egret_native.NativeDisplayObject;

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.CONTAINER);
        }

        /**
         * @private
         * 是否添加到舞台上，防止重复发送 removed_from_stage 消息
         */
        $hasAddToStage: boolean;

        /**
         * @private
         * 能够含有子项的类将子项列表存储在这个属性里。
         */
        $children: DisplayObject[] = null;

        private $name: string = "";

        /**
         * Indicates the instance name of the DisplayObject. The object can be identified in the child list of its parent
         * display object container by calling the getChildByName() method of the display object container.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示 DisplayObject 的实例名称。
         * 通过调用父显示对象容器的 getChildByName() 方法，可以在父显示对象容器的子列表中标识该对象。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get name(): string {
            return this.$name;
        }

        public set name(value: string) {
            this.$name = value;
        }

        /**
         * @private
         */
        $parent: DisplayObjectContainer = null;

        /**
         * Indicates the DisplayObjectContainer object that contains this display object. Use the parent property to specify
         * a relative path to display objects that are above the current display object in the display list hierarchy.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示包含此显示对象的 DisplayObjectContainer 对象。
         * 使用 parent 属性可以指定高于显示列表层次结构中当前显示对象的显示对象的相对路径。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get parent(): DisplayObjectContainer {
            return this.$parent;
        }

        /**
         * @private
         * 设置父级显示对象
         */
        $setParent(parent: DisplayObjectContainer): void {
            this.$parent = parent;
        }

        /**
         * @private
         * 显示对象添加到舞台
         */
        $onAddToStage(stage: Stage, nestLevel: number): void {
            let self = this;
            self.$stage = stage;
            self.$nestLevel = nestLevel;
            self.$hasAddToStage = true;
            Sprite.$EVENT_ADD_TO_STAGE_LIST.push(self);
        }

        /**
         * @private
         * 显示对象从舞台移除
         */
        $onRemoveFromStage(): void {
            let self = this;
            self.$nestLevel = 0;
            Sprite.$EVENT_REMOVE_FROM_STAGE_LIST.push(self);
        }

        /**
         * @private
         */
        $stage: Stage = null;

        /**
         * @private
         * 这个对象在显示列表中的嵌套深度，舞台为1，它的子项为2，子项的子项为3，以此类推。当对象不在显示列表中时此属性值为0.
         */
        $nestLevel: number = 0;

        $useTranslate: boolean = false;

        protected $updateUseTransform(): void {
            let self = this;
            if (self.$scaleX == 1 && self.scaleY == 1 && self.$skewX == 0 && self.$skewY == 0) {
                self.$useTranslate = false;
            }
            else {
                self.$useTranslate = true;
            }
        }

        /**
         * The Stage of the display object. you can create and load multiple display objects into the display list, and
         * the stage property of each display object refers to the same Stage object.<br/>
         * If a display object is not added to the display list, its stage property is set to null.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 显示对象的舞台。
         * 例如，您可以创建多个显示对象并加载到显示列表中，每个显示对象的 stage 属性是指向相同的 Stage 对象。<br/>
         * 如果显示对象未添加到显示列表，则其 stage 属性会设置为 null。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get stage(): Stage {
            return this.$stage;
        }

        /**
         * A Matrix object containing values that alter the scaling, rotation, and translation of the display object.<br/>
         * Note: to change the value of a display object's matrix, you must make a copy of the entire matrix object, then copy
         * the new object into the matrix property of the display object.
         * @example the following code increases the tx value of a display object's matrix
         * <pre>
         *     let myMatrix:Matrix = myDisplayObject.matrix;
         *     myMatrix.tx += 10;
         *     myDisplayObject.matrix = myMatrix;
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个 Matrix 对象，其中包含更改显示对象的缩放、旋转和平移的值。<br/>
         * 注意：要改变一个显示对象矩阵的值，您必引用整个矩阵对象，然后将它重新赋值给显示对象的 matrix 属性。
         * @example 以下代码改变了显示对象矩阵的tx属性值：
         * <pre>
         *     let myMatrix:Matrix = myDisplayObject.matrix;
         *     myMatrix.tx += 10;
         *     myDisplayObject.matrix = myMatrix;
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get matrix(): Matrix {
            return this.$getMatrix().clone();
        }

        private $matrix: egret.Matrix = new egret.Matrix();

        private $matrixDirty: boolean = false;

        /**
         * @private
         * 获取矩阵
         */
        $getMatrix(): Matrix {
            let self = this;
            if (self.$matrixDirty) {
                self.$matrixDirty = false;
                self.$matrix.$updateScaleAndRotation(self.$scaleX, self.$scaleY, self.$skewX, self.$skewY);
            }
            self.$matrix.tx = self.$x;
            self.$matrix.ty = self.$y;
            return self.$matrix;
        }

        public set matrix(value: Matrix) {
            this.$setMatrix(value);
        }

        /**
         * @private
         * 设置矩阵
         */
        $setMatrix(matrix: Matrix, needUpdateProperties: boolean = true): void {
            let self = this;
            let m = self.$matrix;
            m.a = matrix.a;
            m.b = matrix.b;
            m.c = matrix.c;
            m.d = matrix.d;
            self.$x = matrix.tx;
            self.$y = matrix.ty;
            self.$matrixDirty = false;
            if (m.a == 1 && m.b == 0 && m.c == 0 && m.d == 1) {
                self.$useTranslate = false;
            }
            else {
                self.$useTranslate = true;
            }
            if (needUpdateProperties) {
                self.$scaleX = m.$getScaleX();
                self.$scaleY = m.$getScaleY();
                self.$skewX = matrix.$getSkewX();
                self.$skewY = matrix.$getSkewY();
                self.$skewXdeg = clampRotation(self.$skewX * 180 / Math.PI);
                self.$skewYdeg = clampRotation(self.$skewY * 180 / Math.PI);
                self.$rotation = clampRotation(self.$skewY * 180 / Math.PI);
            }
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setMatrix(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            }
        }

        private $concatenatedMatrix: egret.Matrix;

        /**
         * @private
         * 获得这个显示对象以及它所有父级对象的连接矩阵。
         */
        $getConcatenatedMatrix(): Matrix {
            let self = this;
            let matrix = self.$concatenatedMatrix;
            if (!matrix) {
                matrix = self.$concatenatedMatrix = new egret.Matrix();
            }
            if (self.$parent) {
                self.$parent.$getConcatenatedMatrix().$preMultiplyInto(self.$getMatrix(),
                    matrix);
            } else {
                matrix.copyFrom(self.$getMatrix());
            }

            let offsetX = self.$anchorOffsetX;
            let offsetY = self.$anchorOffsetY;
            let rect = self.$scrollRect;
            if (rect) {
                matrix.$preMultiplyInto($TempMatrix.setTo(1, 0, 0, 1, -rect.x - offsetX, -rect.y - offsetY), matrix);
            }
            else if (offsetX != 0 || offsetY != 0) {
                matrix.$preMultiplyInto($TempMatrix.setTo(1, 0, 0, 1, -offsetX, -offsetY), matrix);
            }
            return self.$concatenatedMatrix;
        }

        private $invertedConcatenatedMatrix: egret.Matrix;

        /**
         * @private
         * 获取链接矩阵
         */
        $getInvertedConcatenatedMatrix(): Matrix {
            let self = this;
            if (!self.$invertedConcatenatedMatrix) {
                self.$invertedConcatenatedMatrix = new egret.Matrix();
            }
            self.$getConcatenatedMatrix().$invertInto(self.$invertedConcatenatedMatrix);
            return self.$invertedConcatenatedMatrix;
        }

        $x: number = 0;

        /**
         * Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent
         * DisplayObjectContainer.<br/>
         * If the object is inside a DisplayObjectContainer that has transformations, it is in
         * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer
         * rotated 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is
         * rotated 90° counterclockwise. The object's coordinates refer to the registration point position.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。<br/>
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。
         * 因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get x(): number {
            return this.$getX();
        }

        /**
         * @private
         * 获取x坐标
         */
        $getX(): number {
            return this.$x;
        }

        public set x(value: number) {
            this.$setX(value);
        }

        /**
         * @private
         * 设置x坐标
         */
        $setX(value: number): boolean {
            let self = this;
            if (self.$x == value) {
                return false;
            }
            self.$x = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setX(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return true;
        }

        $y: number = 0;

        /**
         * Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent
         * DisplayObjectContainer. <br/>
         * If the object is inside a DisplayObjectContainer that has transformations, it is in
         * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer rotated
         * 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is rotated 90°
         * counterclockwise. The object's coordinates refer to the registration point position.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。<br/>
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。
         * 因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get y(): number {
            return this.$getY();
        }

        /**
         * @private
         * 获取y坐标
         */
        $getY(): number {
            return this.$y;
        }

        public set y(value: number) {
            this.$setY(value);
        }

        /**
         * @private
         * 设置y坐标
         */
        $setY(value: number): boolean {
            let self = this;
            if (self.$y == value) {
                return false;
            }
            self.$y = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setY(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            return true;
        }

        private $scaleX: number = 1;

        /**
         * Indicates the horizontal scale (percentage) of the object as applied from the registration point. <br/>
         * The default 1.0 equals 100% scale.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。<br/>
         * 1.0 等于 100% 缩放。
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get scaleX(): number {
            return this.$getScaleX();
        }

        public set scaleX(value: number) {
            this.$setScaleX(value);
        }

        /**
         * @private
         *
         * @returns
         */
        $getScaleX(): number {
            return this.$scaleX;
        }

        /**
         * @private
         * 设置水平缩放值
         */
        $setScaleX(value: number): void {
            let self = this;
            self.$scaleX = value;
            self.$matrixDirty = true;

            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setScaleX(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        private $scaleY: number = 1;

        /**
         * Indicates the vertical scale (percentage) of an object as applied from the registration point of the object.
         * 1.0 is 100% scale.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。1.0 是 100% 缩放。
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get scaleY(): number {
            return this.$getScaleY();
        }

        public set scaleY(value: number) {
            this.$setScaleY(value);
        }

        /**
         * @private
         *
         * @returns
         */
        $getScaleY(): number {
            return this.$scaleY;
        }

        /**
         * @private
         * 设置垂直缩放值
         */
        $setScaleY(value: number): void {
            let self = this;
            self.$scaleY = value;
            self.$matrixDirty = true;

            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setScaleY(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        private $rotation: number = 0;

        /**
         * Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation. Values from
         * 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside
         * this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement
         * myDisplayObject.rotation = 450 is the same as myDisplayObject.rotation = 90.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
         * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或
         * 减去 360 获得该范围内的值。例如，myDisplayObject.rotation = 450语句与 myDisplayObject.rotation = 90 是相同的。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get rotation(): number {
            return this.$getRotation();
        }

        /**
         * @private
         */
        $getRotation(): number {
            return this.$rotation;
        }

        public set rotation(value: number) {
            this.$setRotation(value);
        }

        $setRotation(value: number): void {
            value = clampRotation(value);
            let self = this;
            if (value == self.$rotation) {
                return;
            }
            let delta = value - self.$rotation;
            let angle = delta / 180 * Math.PI;
            self.$skewX += angle;
            self.$skewY += angle;
            self.$rotation = value;
            self.$matrixDirty = true;

            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setRotation(value);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        private $skewX: number = 0;
        private $skewXdeg: number = 0;

        /**
         * 表示DisplayObject的x方向斜切
         * @member {number} egret.DisplayObject#skewX
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get skewX(): number {
            return this.$skewXdeg;
        }

        public set skewX(value: number) {
            this.$setSkewX(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setSkewX(value: number): void {
            let self = this;
            if (value == self.$skewXdeg) {
                return;
            }
            self.$skewXdeg = value;

            value = clampRotation(value);
            value = value / 180 * Math.PI;

            self.$skewX = value;
            self.$matrixDirty = true;

            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setSkewX(self.$skewXdeg);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        private $skewY: number = 0;
        private $skewYdeg: number = 0;

        /**
         * 表示DisplayObject的y方向斜切
         * @member {number} egret.DisplayObject#skewY
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get skewY(): number {
            return this.$skewYdeg;
        }

        public set skewY(value: number) {
            this.$setSkewY(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setSkewY(value: number): void {
            let self = this;
            if (value == self.$skewYdeg) {
                return;
            }
            self.$skewYdeg = value;

            value = clampRotation(value);
            value = value / 180 * Math.PI;

            self.$skewY = value;
            self.$matrixDirty = true;

            self.$updateUseTransform();
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setSkewY(self.$skewYdeg);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * Indicates the width of the display object, in pixels. The width is calculated based on the bounds of the content
         * of the display object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示显示对象的宽度，以像素为单位。宽度是根据显示对象内容的范围来计算的。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get width(): number {
            return this.$getWidth();
        }

        /**
         * @private
         * 获取显示宽度
         */
        $getWidth(): number {
            let self = this;
            return isNaN(self.$explicitWidth) ? self.$getOriginalBounds().width : self.$explicitWidth;
        }

        $explicitWidth: number = NaN;

        public set width(value: number) {
            this.$setWidth(value);
        }

        /**
         * @private
         * 设置显示宽度
         */
        $setWidth(value: number): void {
            this.$explicitWidth = isNaN(value) ? NaN : value;
        }

        /**
         * Indicates the height of the display object, in pixels. The height is calculated based on the bounds of the
         * content of the display object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示显示对象的高度，以像素为单位。高度是根据显示对象内容的范围来计算的。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get height(): number {
            return this.$getHeight();
        }

        $explicitHeight: number = NaN;

        /**
         * @private
         * 获取显示高度
         */
        $getHeight(): number {
            let self = this;
            return isNaN(self.$explicitHeight) ? self.$getOriginalBounds().height : self.$explicitHeight;
        }

        public set height(value: number) {
            this.$setHeight(value);
        }

        /**
         * @private
         * 设置显示高度
         */
        $setHeight(value: number): void {
            this.$explicitHeight = isNaN(value) ? NaN : value;
        }


        /**
         * 测量宽度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get measuredWidth(): number {
            return this.$getOriginalBounds().width;
        }

        /**
         * 测量高度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get measuredHeight(): number {
            return this.$getOriginalBounds().height;
        }

        $anchorOffsetX: number = 0;

        /**
         * X represents the object of which is the anchor.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示从对象绝对锚点X。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get anchorOffsetX(): number {
            return this.$anchorOffsetX;
        }

        public set anchorOffsetX(value: number) {
            this.$setAnchorOffsetX(value);
        }

        /**
         * @private
         *
         * @param value
         * @returns
         */
        $setAnchorOffsetX(value: number): void {
            let self = this;
            self.$anchorOffsetX = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setAnchorOffsetX(value);
            }
        }

        $anchorOffsetY: number = 0;

        /**
         * Y represents the object of which is the anchor.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示从对象绝对锚点Y。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get anchorOffsetY(): number {
            return this.$anchorOffsetY;
        }

        public set anchorOffsetY(value: number) {
            this.$setAnchorOffsetY(value);
        }

        /**
         * @private
         *
         * @param value
         * @returns
         */
        $setAnchorOffsetY(value: number): void {
            let self = this;
            self.$anchorOffsetY = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setAnchorOffsetY(value);
            }
        }

        /**
         * @private
         */
        $visible: boolean = true;

        /**
         * Whether or not the display object is visible. Display objects that are not visible are disabled. For example,
         * if visible=false for an DisplayObject instance, it cannot receive touch or other user input.
         * @default true
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 显示对象是否可见。不可见的显示对象将被禁用。例如，如果实例的 visible 为 false，则无法接受触摸或用户交互操作。
         * @default true
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get visible(): boolean {
            return this.$visible;
        }

        public set visible(value: boolean) {
            this.$setVisible(value);
        }

        $setVisible(value: boolean): void {
            let self = this;
            self.$visible = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setVisible(value);
            }
            else {
                self.updateRenderMode();
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         * cacheAsBitmap创建的缓存位图节点。
         */
        $displayList: egret.sys.DisplayList = null;

        private $cacheAsBitmap: boolean = false;

        /**
         * If set to true, Egret runtime caches an internal bitmap representation of the display object. This caching can
         * increase performance for display objects that contain complex vector content. After you set the cacheAsBitmap
         * property to true, the rendering does not change, however the display object performs pixel snapping automatically.
         * The execution speed can be significantly faster depending on the complexity of the content.The cacheAsBitmap
         * property is best used with display objects that have mostly static content and that do not scale and rotate frequently.<br/>
         * Note: The display object will not create the bitmap caching when the memory exceeds the upper limit,even if you set it to true.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 如果设置为 true，则 Egret 运行时将缓存显示对象的内部位图表示形式。此缓存可以提高包含复杂矢量内容的显示对象的性能。
         * 将 cacheAsBitmap 属性设置为 true 后，呈现并不更改，但是，显示对象将自动执行像素贴紧。执行速度可能会大大加快，
         * 具体取决于显示对象内容的复杂性。最好将 cacheAsBitmap 属性与主要具有静态内容且不频繁缩放或旋转的显示对象一起使用。<br/>
         * 注意：在内存超过上限的情况下，即使将 cacheAsBitmap 属性设置为 true，显示对象也不使用位图缓存。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get cacheAsBitmap(): boolean {
            return this.$cacheAsBitmap;
        }

        public set cacheAsBitmap(value: boolean) {
            let self = this;
            self.$cacheAsBitmap = value;
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setCacheAsBitmap(value);
            }
            else {
                self.$setHasDisplayList(value);
            }
        }

        public $setHasDisplayList(value: boolean): void {
            let self = this;
            let hasDisplayList = !!self.$displayList;
            if (hasDisplayList == value) {
                return;
            }
            if (value) {
                let displayList = sys.DisplayList.create(self);
                if (displayList) {
                    self.$displayList = displayList;
                    self.$cacheDirty = true;
                }
            }
            else {
                self.$displayList = null;
            }
        }

        $cacheDirty: boolean = false;

        $cacheDirtyUp(): void {
            let p = this.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
        }

        /**
         * @private
         */
        $alpha: number = 1;

        /**
         * Indicates the alpha transparency value of the object specified. Valid values are 0 (fully transparent) to 1 (fully opaque).
         * The default value is 1. Display objects with alpha set to 0 are active, even though they are invisible.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示指定对象的 Alpha 透明度值。
         * 有效值为 0（完全透明）到 1（完全不透明）。alpha 设置为 0 的显示对象是可触摸的，即使它们不可见。
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get alpha(): number {
            return this.$alpha;
        }

        public set alpha(value: number) {
            this.$setAlpha(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setAlpha(value: number): void {
            let self = this;
            self.$alpha = value;

            if (egret.nativeRender) {
                self.$nativeDisplayObject.setAlpha(value);
            }
            else {
                self.updateRenderMode();
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         * The default touchEnabled property of DisplayObject
         * @default false
         * @version Egret 2.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * @private
         * 显示对象默认的 touchEnabled 属性
         * @default false
         * @version Egret 2.5
         * @platform Web,Native
         * @language zh_CN
         */
        static defaultTouchEnabled: boolean = false;

        $touchEnabled: boolean = DisplayObject.defaultTouchEnabled;
        /**
         * Specifies whether this object receives touch or other user input. The default value is false, which means that
         * by default any DisplayObject instance that is on the display list cannot receive touch events. If touchEnabled is
         * set to false, the instance does not receive any touch events (or other user input events). Any children of
         * this instance on the display list are not affected. To change the touchEnabled behavior for all children of
         * an object on the display list, use DisplayObjectContainer.touchChildren.
         * @see egret.DisplayObjectContainer#touchChildren
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定此对象是否接收触摸或其他用户输入。默认值为 false，这表示默认情况下，显示列表上的任何 DisplayObject 实例都不会接收触摸事件或
         * 其他用户输入事件。如果将 touchEnabled 设置为 false，则实例将不接收任何触摸事件（或其他用户输入事件）。显示列表上的该实例的任
         * 何子级都不会受到影响。要更改显示列表上对象的所有子级的 touchEnabled 行为，请使用 DisplayObjectContainer.touchChildren。
         * @see egret.DisplayObjectContainer#touchChildren
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get touchEnabled(): boolean {
            return this.$getTouchEnabled();
        }

        public set touchEnabled(value: boolean) {
            this.$setTouchEnabled(value);
        }

        /**
         * @private
         */
        $getTouchEnabled(): boolean {
            return this.$touchEnabled;
        }

        /**
         * @private
         */
        $setTouchEnabled(value: boolean): void {
            this.$touchEnabled = value;
        }

        /**
         * @private
         */
        $scrollRect: Rectangle = null;

        /**
         * The scroll rectangle bounds of the display object. The display object is cropped to the size defined by the rectangle,
         * and it scrolls within the rectangle when you change the x and y properties of the scrollRect object. A scrolled display
         * object always scrolls in whole pixel increments.You can scroll an object left and right by setting the x property of
         * the scrollRect Rectangle object. You can scroll an object up and down by setting the y property of the scrollRect
         * Rectangle object. If the display object is rotated 90° and you scroll it left and right, the display object actually
         * scrolls up and down.<br/>
         *
         * Note: to change the value of a display object's scrollRect, you must make a copy of the entire scrollRect object, then copy
         * the new object into the scrollRect property of the display object.
         * @example the following code increases the x value of a display object's scrollRect
         * <pre>
         *     let myRectangle:Rectangle = myDisplayObject.scrollRect;
         *     myRectangle.x += 10;
         *     myDisplayObject.scrollRect = myRectangle;
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
         * 滚动的显示对象始终以整像素为增量进行滚动。您可以通过设置 scrollRect Rectangle 对象的 x 属性来左右滚动对象， 还可以通过设置
         * scrollRect 对象的 y 属性来上下滚动对象。如果显示对象旋转了 90 度，并且您左右滚动它，则实际上显示对象会上下滚动。<br/>
         *
         * 注意：要改变一个显示对象 scrollRect 属性的值，您必引用整个 scrollRect 对象，然后将它重新赋值给显示对象的 scrollRect 属性。
         * @example 以下代码改变了显示对象 scrollRect 的 x 属性值：
         * <pre>
         *     let myRectangle:Rectangle = myDisplayObject.scrollRect;
         *     myRectangle.x += 10;
         *     myDisplayObject.scrollRect = myRectangle;//设置完scrollRect的x、y、width、height值之后，一定要对myDisplayObject重新赋值scrollRect，不然会出问题。
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get scrollRect(): Rectangle {
            return this.$scrollRect;
        }

        public set scrollRect(value: Rectangle) {
            this.$setScrollRect(value);
        }

        /**
         * @private
         *
         * @param value
         */
        private $setScrollRect(value: Rectangle): void {
            let self = this;
            if (!value && !self.$scrollRect) {
                self.updateRenderMode();
                return;
            }
            if (value) {
                if (!self.$scrollRect) {
                    self.$scrollRect = new egret.Rectangle();
                }
                self.$scrollRect.copyFrom(value);
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setScrollRect(value.x, value.y, value.width, value.height);
                }
            }
            else {
                self.$scrollRect = null;
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setScrollRect(0, 0, 0, 0);
                }
            }
            if (!egret.nativeRender) {
                self.updateRenderMode();
            }
        }

        /**
         * @private
         */
        $blendMode: number = 0;

        /**
         * A value from the BlendMode class that specifies which blend mode to use. Determine how a source image (new one)
         * is drawn on the target image (old one).<br/>
         * If you attempt to set this property to an invalid value, Egret runtime set the value to BlendMode.NORMAL.
         * @default egret.BlendMode.NORMAL
         * @see egret.BlendMode
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * BlendMode 枚举中的一个值，用于指定要使用的混合模式，确定如何将一个源（新的）图像绘制到目标（已有）的图像上<br/>
         * 如果尝试将此属性设置为无效值，则运行时会将此值设置为 BlendMode.NORMAL。
         * @default egret.BlendMode.NORMAL
         * @see egret.BlendMode
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get blendMode(): string {
            return sys.numberToBlendMode(this.$blendMode);
        }

        public set blendMode(value: string) {
            let self = this;
            let mode = sys.blendModeToNumber(value);
            self.$blendMode = mode;

            if (egret.nativeRender) {
                self.$nativeDisplayObject.setBlendMode(mode);
            }
            else {
                self.updateRenderMode();
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        /**
         * @private
         * 被遮罩的对象
         */
        $maskedObject: DisplayObject = null;

        /**
         * @private
         */
        $mask: DisplayObject = null;

        /**
         * @private
         */
        $maskRect: Rectangle = null;

        /**
         * The calling display object is masked by the specified mask object. To ensure that masking works when the Stage
         * is scaled, the mask display object must be in an active part of the display list. The mask object itself is not drawn.
         * Set mask to null to remove the mask. To be able to scale a mask object, it must be on the display list. To be
         * able to drag a mask object , it must be on the display list.<br/>
         * Note: A single mask object cannot be used to mask more than one calling display object. When the mask is assigned
         * to a second display object, it is removed as the mask of the first object, and that object's mask property becomes null.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 调用显示对象被指定的 mask 对象遮罩。要确保当舞台缩放时蒙版仍然有效，mask 显示对象必须处于显示列表的活动部分。
         * 但不绘制 mask 对象本身。将 mask 设置为 null 可删除蒙版。要能够缩放遮罩对象，它必须在显示列表中。要能够拖动蒙版
         * 对象，它必须在显示列表中。<br/>
         * 注意：单个 mask 对象不能用于遮罩多个执行调用的显示对象。在将 mask 分配给第二个显示对象时，会撤消其作为第一个对象的遮罩，
         * 该对象的 mask 属性将变为 null。
         *
         * 下面例子为 mask 为 Rectangle 类型对象，这种情况下，修改 mask 的值后，一定要对 myDisplayObject 重新赋值 mask，不然会出问题。
         * @example 以下代码改变了显示对象 mask 的 x 属性值：
         * <pre>
         *     let myMask:Rectangle = myDisplayObject.mask;
         *     myMask.x += 10;
         *     myDisplayObject.mask = myMask;//设置完 mask 的x、y、width、height值之后，一定要对myDisplayObject重新赋值 mask，不然会出问题。
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get mask(): DisplayObject | Rectangle {
            let self = this;
            return self.$mask ? self.$mask : self.$maskRect;
        }

        public set mask(value: DisplayObject | Rectangle) {
            let self = this;
            if (value === self) {
                return;
            }
            if (value) {
                if (value instanceof DisplayObject) {
                    if (value == self.$mask) {
                        return;
                    }
                    if (value.$maskedObject) {
                        value.$maskedObject.mask = null;
                    }
                    value.$maskedObject = self;

                    self.$mask = value;
                    if (!egret.nativeRender) {
                        value.updateRenderMode();
                    }
                    if (self.$maskRect) {
                        if (egret.nativeRender) {
                            self.$nativeDisplayObject.setMaskRect(0, 0, 0, 0);
                        }
                        self.$maskRect = null;
                    }
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setMask(value.$nativeDisplayObject.id);
                    }
                }
                else {
                    if (!self.$maskRect) {
                        self.$maskRect = new egret.Rectangle();
                    }
                    self.$maskRect.copyFrom(value);
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setMaskRect(value.x, value.y, value.width, value.height);
                    }
                    if (self.$mask) {
                        self.$mask.$maskedObject = null;
                        if (!egret.nativeRender) {
                            self.$mask.updateRenderMode();
                        }
                    }
                    if (self.mask) {
                        if (egret.nativeRender) {
                            self.$nativeDisplayObject.setMask(-1);
                        }
                        self.$mask = null;
                    }
                }
            }
            else {
                if (self.$mask) {
                    self.$mask.$maskedObject = null;
                    if (!egret.nativeRender) {
                        self.$mask.updateRenderMode();
                    }
                }
                if (self.mask) {
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setMask(-1);
                    }
                    self.$mask = null;
                }
                if (self.$maskRect) {
                    if (egret.nativeRender) {
                        self.$nativeDisplayObject.setMaskRect(0, 0, 0, 0);
                    }
                    self.$maskRect = null;
                }
            }
            if (!egret.nativeRender) {
                self.updateRenderMode();
            }
        }

        private $setMaskRect(value: Rectangle): void {
            let self = this;
            if (!value && !self.$maskRect) {
                return;
            }
            if (value) {
                if (!self.$maskRect) {
                    self.$maskRect = new egret.Rectangle();
                }
                self.$maskRect.copyFrom(value);
            }
            else {
                self.$maskRect = null;
            }
        }

        public $filters: Array<Filter | CustomFilter>;

        /**
         * An indexed array that contains each filter object currently associated with the display object.
         * @version Egret 3.1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 包含当前与显示对象关联的每个滤镜对象的索引数组。
         * @version Egret 3.1.0
         * @platform Web
         * @language zh_CN
         */
        public get filters(): Array<Filter | CustomFilter> {
            return this.$filters;
        }

        public set filters(value: Array<Filter | CustomFilter>) {
            let self = this;
            let filters: Filter[] = self.$filters;
            if (!filters && !value) {
                self.$filters = null;
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setFilters(null);
                }
                else {
                    self.updateRenderMode();
                }
                return;
            }
            if (value && value.length) {
                value = value.concat();
                self.$filters = value;
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setFilters(value);
                }
            }
            else {
                self.$filters = null;
                if (egret.nativeRender) {
                    self.$nativeDisplayObject.setFilters(null);
                }
            }
            if (!egret.nativeRender) {
                self.updateRenderMode();
            }
        }

        /**
         * Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.
         * @param targetCoordinateSpace The display object that defines the coordinate system to use.
         * @param resultRect A reusable instance of Rectangle for saving the results. Passing this parameter can reduce the number of reallocate objects
         *, which allows you to get better code execution performance..
         * @returns The rectangle that defines the area of the display object relative to the targetCoordinateSpace object's coordinate system.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回一个矩形，该矩形定义相对于 targetCoordinateSpace 对象坐标系的显示对象区域。
         * @param targetCoordinateSpace 定义要使用的坐标系的显示对象。
         * @param resultRect 一个用于存储结果的可复用Rectangle实例，传入此参数能够减少内部创建对象的次数，从而获得更高的运行性能。
         * @returns 定义与 targetCoordinateSpace 对象坐标系统相关的显示对象面积的矩形。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public getTransformedBounds(targetCoordinateSpace: DisplayObject, resultRect?: Rectangle): Rectangle {
            targetCoordinateSpace = targetCoordinateSpace || this;
            return this.$getTransformedBounds(targetCoordinateSpace, resultRect);
        }

        /**
         * Obtain measurement boundary of display object
         * @param resultRect {Rectangle} Optional. It is used to import Rectangle object for saving results, preventing duplicate object creation.
         * @param calculateAnchor {boolean} Optional. It is used to determine whether to calculate anchor point.
         * @returns {Rectangle}
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取显示对象的测量边界
         * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         * @param calculateAnchor {boolean} 可选参数，是否会计算锚点。
         * @returns {Rectangle}
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public getBounds(resultRect?: Rectangle, calculateAnchor: boolean = true): egret.Rectangle {
            let self = this;
            resultRect = self.$getTransformedBounds(self, resultRect);
            if (calculateAnchor) {
                if (self.$anchorOffsetX != 0) {
                    resultRect.x -= self.$anchorOffsetX;
                }
                if (self.$anchorOffsetY != 0) {
                    resultRect.y -= self.$anchorOffsetY;
                }
            }
            return resultRect;
        }

        /**
         * @private
         */
        $getTransformedBounds(targetCoordinateSpace: DisplayObject, resultRect?: Rectangle): Rectangle {
            let self = this;
            let bounds = self.$getOriginalBounds();
            if (!resultRect) {
                resultRect = new Rectangle();
            }
            resultRect.copyFrom(bounds);
            if (targetCoordinateSpace == self) {
                return resultRect;
            }
            let m: Matrix;
            if (targetCoordinateSpace) {
                m = $TempMatrix;
                let invertedTargetMatrix = targetCoordinateSpace.$getInvertedConcatenatedMatrix();
                invertedTargetMatrix.$preMultiplyInto(self.$getConcatenatedMatrix(), m);
            } else {
                m = self.$getConcatenatedMatrix();
            }
            m.$transformBounds(resultRect);
            return resultRect;
        }

        /**
         * Converts the point object from the Stage (global) coordinates to the display object's (local) coordinates.
         * @param stageX the x value in the global coordinates
         * @param stageY the y value in the global coordinates
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns A Point object with coordinates relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将从舞台（全局）坐标转换为显示对象的（本地）坐标。
         * @param stageX 舞台坐标x
         * @param stageY 舞台坐标y
         * @param resultPoint 一个用于存储结果的可复用 Point 实例，传入此参数能够减少内部创建对象的次数，从而获得更高的运行性能。
         * @returns 具有相对于显示对象的坐标的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public globalToLocal(stageX: number = 0, stageY: number = 0, resultPoint?: Point): Point {
            if (egret.nativeRender) {
                egret_native.updateNativeRender();
                let result = egret_native.nrGlobalToLocal(this.$nativeDisplayObject.id, stageX, stageY);
                let arr = result.split(",");
                let x = parseFloat(arr[0]);
                let y = parseFloat(arr[1]);
                if (resultPoint) {
                    resultPoint.setTo(x, y);
                }
                else {
                    resultPoint = new Point(x, y);
                }
                return resultPoint;
            }
            else {
                let m = this.$getInvertedConcatenatedMatrix();
                return m.transformPoint(stageX, stageY, resultPoint);
            }
        }

        /**
         * Converts the point object from the display object's (local) coordinates to the Stage (global) coordinates.
         * @param localX the x value in the local coordinates
         * @param localY the x value in the local coordinates
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns  A Point object with coordinates relative to the Stage.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将显示对象的（本地）坐标转换为舞台（全局）坐标。
         * @param localX 本地坐标 x
         * @param localY 本地坐标 y
         * @param resultPoint 一个用于存储结果的可复用 Point 实例，传入此参数能够减少内部创建对象的次数，从而获得更高的运行性能。
         * @returns 一个具有相对于舞台坐标的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public localToGlobal(localX: number = 0, localY: number = 0, resultPoint?: Point): Point {
            if (egret.nativeRender) {
                egret_native.updateNativeRender();
                let result = egret_native.nrLocalToGlobal(this.$nativeDisplayObject.id, localX, localY);
                let arr = result.split(",");
                let x = parseFloat(arr[0]);
                let y = parseFloat(arr[1]);
                if (resultPoint) {
                    resultPoint.setTo(x, y);
                }
                else {
                    resultPoint = new Point(x, y);
                }
                return resultPoint;
            }
            else {
                let m = this.$getConcatenatedMatrix();
                return m.transformPoint(localX, localY, resultPoint);
            }
        }

        /**
         * @private
         * 获取显示对象占用的矩形区域集合，通常包括自身绘制的测量区域，如果是容器，还包括所有子项占据的区域。
         */
        $getOriginalBounds(): Rectangle {
            let self = this;
            let bounds: Rectangle = self.$getContentBounds();
            self.$measureChildBounds(bounds);
            let offset = self.$measureFiltersOffset(false);
            if (offset) {
                bounds.x += offset.minX;
                bounds.y += offset.minY;
                bounds.width += -offset.minX + offset.maxX;
                bounds.height += -offset.minY + offset.maxY;
            }
            return bounds;
        }

        /**
         * @private
         * 测量子项占用的矩形区域
         * @param bounds 测量结果存储在这个矩形对象内
         */
        $measureChildBounds(bounds: Rectangle): void {

        }

        /**
         * @private
         */
        $getContentBounds(): Rectangle {
            let bounds: egret.Rectangle = $TempRectangle;
            bounds.setEmpty();
            this.$measureContentBounds(bounds);
            return bounds;
        }

        /**
         * @private
         * 测量自身占用的矩形区域，注意：此测量结果并不包括子项占据的区域。
         * @param bounds 测量结果存储在这个矩形对象内
         */
        $measureContentBounds(bounds: Rectangle): void {
        }

        /**
         * @private
         */
        $parentDisplayList: egret.sys.DisplayList = null;

        /**
         * @private
         * 渲染节点,不为空表示自身有绘制到屏幕的内容
         */
        $renderNode: sys.RenderNode = null;

        $renderDirty: boolean = false;

        /**
         * @private
         * 获取渲染节点
         */
        $getRenderNode(): sys.RenderNode {
            let self = this;
            let node = self.$renderNode;
            if (!node) {
                return null;
            }

            if (self.$renderDirty) {
                node.cleanBeforeRender();
                self.$updateRenderNode();
                self.$renderDirty = false;
                node = self.$renderNode;
            }
            return node;
        }

        private updateRenderMode(): void {
            let self = this;
            if (!self.$visible || self.$alpha <= 0 || self.$maskedObject) {
                self.$renderMode = RenderMode.NONE;
            }
            else if (self.filters && self.filters.length > 0) {
                self.$renderMode = RenderMode.FILTER;
            }
            else if (self.$blendMode !== 0 || self.$mask) {
                self.$renderMode = RenderMode.CLIP;
            }
            else if (self.$scrollRect || self.$maskRect) {
                self.$renderMode = RenderMode.SCROLLRECT;
            }
            else {
                self.$renderMode = null;
            }
        }

        $renderMode: RenderMode = null;

        /**
         * @private
         */
        private $measureFiltersOffset(fromParent: boolean): any {
            let display: DisplayObject = this;
            let minX: number = 0;
            let minY: number = 0;
            let maxX: number = 0;
            let maxY: number = 0;
            while (display) {
                let filters = display.$filters;
                if (filters && filters.length) {
                    let length = filters.length;
                    for (let i: number = 0; i < length; i++) {
                        let filter: Filter = filters[i];
                        //todo 缓存这个数据
                        if (filter.type == "blur") {
                            let offsetX = (<BlurFilter>filter).blurX;
                            let offsetY = (<BlurFilter>filter).blurY;
                            minX -= offsetX;
                            minY -= offsetY;
                            maxX += offsetX;
                            maxY += offsetY;
                        }
                        else if (filter.type == "glow") {
                            let offsetX = (<GlowFilter>filter).blurX;
                            let offsetY = (<GlowFilter>filter).blurY;
                            minX -= offsetX;
                            minY -= offsetY;
                            maxX += offsetX;
                            maxY += offsetY;
                            let distance: number = (<DropShadowFilter>filter).distance || 0;
                            let angle: number = (<DropShadowFilter>filter).angle || 0;
                            let distanceX = 0;
                            let distanceY = 0;
                            if (distance != 0) {
                                distanceX = distance * egret.NumberUtils.cos(angle);
                                if (distanceX > 0) {
                                    distanceX = Math.ceil(distanceX);
                                }
                                else {
                                    distanceX = Math.floor(distanceX);
                                }
                                distanceY = distance * egret.NumberUtils.sin(angle);
                                if (distanceY > 0) {
                                    distanceY = Math.ceil(distanceY);
                                }
                                else {
                                    distanceY = Math.floor(distanceY);
                                }
                                minX += distanceX;
                                maxX += distanceX;
                                minY += distanceY;
                                maxY += distanceY;
                            }
                        } else if (filter.type == "custom") {
                            let padding = (<CustomFilter>filter).padding;
                            minX -= padding;
                            minY -= padding;
                            maxX += padding;
                            maxY += padding;
                        }
                    }
                }
                if (fromParent) {
                    display = display.$parent;
                }
                else {
                    display = null;
                }
            }
            minX = Math.min(minX, 0);
            minY = Math.min(minY, 0);
            maxX = Math.max(maxX, 0);
            maxY = Math.max(maxY, 0);
            return { minX, minY, maxX, maxY };
        }

        /**
         * @private
         * 获取相对于指定根节点的连接矩阵。
         * @param root 根节点显示对象
         * @param matrix 目标显示对象相对于舞台的完整连接矩阵。
         */
        $getConcatenatedMatrixAt(root: DisplayObject, matrix: Matrix): void {
            let invertMatrix = root.$getInvertedConcatenatedMatrix();
            if (invertMatrix.a === 0 || invertMatrix.d === 0) {//缩放值为0，逆矩阵无效
                let target: DisplayObject = this;
                let rootLevel = root.$nestLevel;
                matrix.identity();
                while (target.$nestLevel > rootLevel) {
                    let rect = target.$scrollRect;
                    if (rect) {
                        matrix.concat($TempMatrix.setTo(1, 0, 0, 1, -rect.x, -rect.y));
                    }
                    matrix.concat(target.$getMatrix());
                    target = target.$parent;
                }
            }
            else {
                invertMatrix.$preMultiplyInto(matrix, matrix);
            }
        }

        /**
         * @private
         * 更新renderNode
         */
        $updateRenderNode(): void {

        }

        /**
         * @private
         */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            let self = this;
            if (!self.$renderNode || !self.$visible || self.$scaleX == 0 || self.$scaleY == 0) {
                return null;
            }
            let m = self.$getInvertedConcatenatedMatrix();
            if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {//防止父类影响子类
                return null;
            }
            let bounds = self.$getContentBounds();
            let localX = m.a * stageX + m.c * stageY + m.tx;
            let localY = m.b * stageX + m.d * stageY + m.ty;
            if (bounds.contains(localX, localY)) {
                if (!self.$children) {//容器已经检查过scrollRect和mask，避免重复对遮罩进行碰撞。

                    let rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return null;
                    }
                    if (self.$mask && !self.$mask.$hitTest(stageX, stageY)) {
                        return null;
                    }
                }
                return self;
            }
            return null;
        }

        /**
         * Calculate the display object to determine whether it overlaps or crosses with the points specified by the x and y parameters. The x and y parameters specify the points in the coordinates of the stage, rather than the points in the display object container that contains display objects (except the situation where the display object container is a stage).
         * Note: Don't use accurate pixel collision detection on a large number of objects. Otherwise, this will cause serious performance deterioration.
         * @param x {number}  x coordinate of the object to be tested.
         * @param y {number}  y coordinate of the object to be tested.
         * @param shapeFlag {boolean} Whether to check the actual pixel of object (true) or check that of border (false).Write realized.
         * @returns {boolean} If display object overlaps or crosses with the specified point, it is true; otherwise, it is false.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 计算显示对象，以确定它是否与 x 和 y 参数指定的点重叠或相交。x 和 y 参数指定舞台的坐标空间中的点，而不是包含显示对象的显示对象容器中的点（除非显示对象容器是舞台）。
         * 注意，不要在大量物体中使用精确碰撞像素检测，这回带来巨大的性能开销
         * @param x {number}  要测试的此对象的 x 坐标。
         * @param y {number}  要测试的此对象的 y 坐标。
         * @param shapeFlag {boolean} 是检查对象 (true) 的实际像素，还是检查边框 (false) 的实际像素。
         * @returns {boolean} 如果显示对象与指定的点重叠或相交，则为 true；否则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean {
            let self = this;
            if (!shapeFlag) {
                if (self.$scaleX == 0 || self.$scaleY == 0) {
                    return false;
                }
                let m = self.$getInvertedConcatenatedMatrix();
                let bounds = self.getBounds(null, false);
                let localX = m.a * x + m.c * y + m.tx;
                let localY = m.b * x + m.d * y + m.ty;
                if (bounds.contains(localX, localY)) {
                    //这里不考虑设置mask的情况
                    let rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return false;
                    }
                    return true;
                }
                return false;
            }
            else {
                let m = self.$getInvertedConcatenatedMatrix();
                let localX = m.a * x + m.c * y + m.tx;
                let localY = m.b * x + m.d * y + m.ty;
                let data: number[] | Uint8Array;
                if (egret.nativeRender) {
                    let buffer = sys.customHitTestBuffer;
                    buffer.resize(3, 3);
                    egret_native.forHitTest = true;
                    egret_native.activateBuffer(buffer);
                    egret_native.updateNativeRender();
                    egret_native.nrRenderDisplayObject2(self.$nativeDisplayObject.id, 1 - localX, 1 - localY, true);
                    try {
                        data = new Uint8Array(4);
                        egret_native.nrGetPixels(1, 1, 1, 1, data);
                    }
                    catch (e) {
                        throw new Error(sys.tr(1039));
                    }
                    egret_native.activateBuffer(null);
                    egret_native.forHitTest = false;
                    if (data[3] === 0) {
                        return false;
                    }
                    return true;
                }
                else {
                    let displayList = self.$displayList;
                    if (displayList) {
                        let buffer = displayList.renderBuffer;
                        try {
                            data = buffer.getPixels(localX - displayList.offsetX, localY - displayList.offsetY);
                        }
                        catch (e) {
                            throw new Error(sys.tr(1039));
                        }
                    }
                    else {
                        let buffer = sys.customHitTestBuffer;
                        buffer.resize(3, 3);
                        let matrix = Matrix.create();
                        matrix.identity();
                        matrix.translate(1 - localX, 1 - localY);
                        sys.systemRenderer.render(this, buffer, matrix, true);
                        Matrix.release(matrix);

                        try {
                            data = buffer.getPixels(1, 1);
                        }
                        catch (e) {
                            throw new Error(sys.tr(1039));
                        }
                    }
                    if (data[3] === 0) {
                        return false;
                    }
                    return true;
                }
            }
        }

        /**
         * @private
         */
        static $enterFrameCallBackList: DisplayObject[] = [];
        /**
         * @private
         */
        static $renderCallBackList: DisplayObject[] = [];

        /**
         * @private
         */
        $addListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void {
            super.$addListener(type, listener, thisObject, useCapture, priority, dispatchOnce);
            let isEnterFrame = (type == Event.ENTER_FRAME);
            if (isEnterFrame || type == Event.RENDER) {
                let list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                if (list.indexOf(this) == -1) {
                    list.push(this);
                }
            }
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void {
            super.removeEventListener(type, listener, thisObject, useCapture);
            let isEnterFrame: boolean = (type == Event.ENTER_FRAME);
            if ((isEnterFrame || type == Event.RENDER) && !this.hasEventListener(type)) {
                let list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                let index = list.indexOf(this);
                if (index !== -1) {
                    list.splice(index, 1);
                }
            }
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public dispatchEvent(event: Event): boolean {
            if (!event.$bubbles) {
                return super.dispatchEvent(event);
            }

            let list = this.$getPropagationList(this);
            let targetIndex = list.length * 0.5;
            event.$setTarget(this);
            this.$dispatchPropagationEvent(event, list, targetIndex);
            return !event.$isDefaultPrevented;
        }

        /**
         * @private
         * 获取事件流列表。注意：Egret框架的事件流与Flash实现并不一致。
         *
         * 事件流有三个阶段：捕获，目标，冒泡。
         * Flash里默认的的事件监听若不开启useCapture将监听目标和冒泡阶段。若开始capture将只能监听捕获当不包括目标的事件。
         * 可以在Flash中写一个简单的测试：实例化一个非容器显示对象，例如TextField。分别监听useCapture为true和false时的鼠标事件。
         * 点击后将只有useCapture为false的回调函数输出信息。也就带来一个问题「Flash的捕获阶段不能监听到最内层对象本身，只在父级列表有效」。
         *
         * 而HTML里的事件流设置useCapture为true时是能监听到目标阶段的，也就是目标阶段会被触发两次，在捕获和冒泡过程各触发一次。这样可以避免
         * 前面提到的监听捕获无法监听目标本身的问题。
         *
         * Egret最终采用了HTML里目标节点触发两次的事件流方式。
         */
        $getPropagationList(target: DisplayObject): DisplayObject[] {
            let list: DisplayObject[] = [];
            while (target) {
                list.push(target);
                target = target.$parent;
            }
            let captureList = list.concat();
            captureList.reverse();//使用一次reverse()方法比多次调用unshift()性能高。
            list = captureList.concat(list);
            return list;
        }

        /**
         * @private
         */
        $dispatchPropagationEvent(event: Event, list: DisplayObject[], targetIndex: number): void {
            let length = list.length;
            let captureIndex = targetIndex - 1;
            for (let i = 0; i < length; i++) {
                let currentTarget = list[i];
                event.$currentTarget = currentTarget;
                if (i < captureIndex)
                    event.$eventPhase = EventPhase.CAPTURING_PHASE;
                else if (i == targetIndex || i == captureIndex)
                    event.$eventPhase = EventPhase.AT_TARGET;
                else
                    event.$eventPhase = EventPhase.BUBBLING_PHASE;
                currentTarget.$notifyListener(event, i < targetIndex);
                if (event.$isPropagationStopped || event.$isPropagationImmediateStopped) {
                    return;
                }
            }
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public willTrigger(type: string): boolean {
            let parent: DisplayObject = this;
            while (parent) {
                if (parent.hasEventListener(type))
                    return true;
                parent = parent.$parent;
            }
            return false;
        }

    }

}
