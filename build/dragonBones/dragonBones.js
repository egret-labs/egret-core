var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var dragonBones;
(function (dragonBones) {
    /**
     * DragonBones
     */
    var DragonBones = (function () {
        function DragonBones() {
        }
        /**
         * @internal
         * @private
         */
        DragonBones.hasArmature = function (value) {
            return DragonBones._armatures.indexOf(value) >= 0;
        };
        /**
         * @internal
         * @private
         */
        DragonBones.addArmature = function (value) {
            if (value && DragonBones._armatures.indexOf(value) < 0) {
                DragonBones._armatures.push(value);
            }
        };
        /**
         * @internal
         * @private
         */
        DragonBones.removeArmature = function (value) {
            if (value) {
                var index = DragonBones._armatures.indexOf(value);
                if (index >= 0) {
                    DragonBones._armatures.splice(index, 1);
                }
            }
        };
        return DragonBones;
    }());
    /**
     * @private
     */
    DragonBones.PI_D = Math.PI * 2.0;
    /**
     * @private
     */
    DragonBones.PI_H = Math.PI / 2.0;
    /**
     * @private
     */
    DragonBones.PI_Q = Math.PI / 4.0;
    /**
     * @private
     */
    DragonBones.ANGLE_TO_RADIAN = Math.PI / 180.0;
    /**
     * @private
     */
    DragonBones.RADIAN_TO_ANGLE = 180.0 / Math.PI;
    /**
     * @private
     */
    DragonBones.SECOND_TO_MILLISECOND = 1000.0;
    /**
     * @internal
     * @private
     */
    DragonBones.NO_TWEEN = 100;
    DragonBones.VERSION = "5.0.0";
    /**
     * @internal
     * @private
     */
    DragonBones.ARGUMENT_ERROR = "Argument error.";
    /**
     * @private
     */
    DragonBones.debug = false;
    /**
     * @private
     */
    DragonBones.debugDraw = false;
    /**
     * @internal
     * @private
     */
    DragonBones._armatures = [];
    dragonBones.DragonBones = DragonBones;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 基础对象。
     * @version DragonBones 4.5
     */
    var BaseObject = (function () {
        /**
         * @internal
         * @private
         */
        function BaseObject() {
            /**
             * @language zh_CN
             * 对象的唯一标识。
             * @version DragonBones 4.5
             */
            this.hashCode = BaseObject._hashCode++;
        }
        BaseObject._returnObject = function (object) {
            var classType = String(object.constructor);
            var maxCount = BaseObject._maxCountMap[classType] == null ? BaseObject._defaultMaxCount : BaseObject._maxCountMap[classType];
            var pool = BaseObject._poolsMap[classType] = BaseObject._poolsMap[classType] || [];
            if (pool.length < maxCount) {
                if (pool.indexOf(object) < 0) {
                    pool.push(object);
                }
                else {
                    throw new Error();
                }
            }
        };
        /**
         * @language zh_CN
         * 设置每种对象池的最大缓存数量。
         * @param objectConstructor 对象类。
         * @param maxCount 最大缓存数量。 (设置为 0 则不缓存)
         * @version DragonBones 4.5
         */
        BaseObject.setMaxCount = function (objectConstructor, maxCount) {
            if (maxCount < 0 || maxCount !== maxCount) {
                maxCount = 0;
            }
            if (objectConstructor) {
                var classType = String(objectConstructor);
                BaseObject._maxCountMap[classType] = maxCount;
                var pool = BaseObject._poolsMap[classType];
                if (pool && pool.length > maxCount) {
                    pool.length = maxCount;
                }
            }
            else {
                BaseObject._defaultMaxCount = maxCount;
                for (var classType in BaseObject._poolsMap) {
                    if (BaseObject._maxCountMap[classType] == null) {
                        continue;
                    }
                    BaseObject._maxCountMap[classType] = maxCount;
                    var pool = BaseObject._poolsMap[classType];
                    if (pool.length > maxCount) {
                        pool.length = maxCount;
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 清除对象池缓存的对象。
         * @param objectConstructor 对象类。 (不设置则清除所有缓存)
         * @version DragonBones 4.5
         */
        BaseObject.clearPool = function (objectConstructor) {
            if (objectConstructor === void 0) { objectConstructor = null; }
            if (objectConstructor) {
                var pool = BaseObject._poolsMap[String(objectConstructor)];
                if (pool && pool.length) {
                    pool.length = 0;
                }
            }
            else {
                for (var k in BaseObject._poolsMap) {
                    var pool = BaseObject._poolsMap[k];
                    pool.length = 0;
                }
            }
        };
        /**
         * @language zh_CN
         * 从对象池中创建指定对象。
         * @param objectConstructor 对象类。
         * @version DragonBones 4.5
         */
        BaseObject.borrowObject = function (objectConstructor) {
            var pool = BaseObject._poolsMap[String(objectConstructor)];
            if (pool && pool.length > 0) {
                return pool.pop();
            }
            else {
                var object = new objectConstructor();
                object._onClear();
                return object;
            }
        };
        /**
         * @language zh_CN
         * 清除数据并返还对象池。
         * @version DragonBones 4.5
         */
        BaseObject.prototype.returnToPool = function () {
            this._onClear();
            BaseObject._returnObject(this);
        };
        return BaseObject;
    }());
    BaseObject._hashCode = 0;
    BaseObject._defaultMaxCount = 5000;
    BaseObject._maxCountMap = {};
    BaseObject._poolsMap = {};
    dragonBones.BaseObject = BaseObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
        };
        Point.prototype.clear = function () {
            this.x = this.y = 0.0;
        };
        return Point;
    }());
    dragonBones.Point = Point;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }
            if (width === void 0) { width = 0.0; }
            if (height === void 0) { height = 0.0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rectangle.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
            this.width = value.width;
            this.height = value.height;
        };
        Rectangle.prototype.clear = function () {
            this.x = this.y = 0.0;
            this.width = this.height = 0.0;
        };
        return Rectangle;
    }());
    dragonBones.Rectangle = Rectangle;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 2D 变换。
     * @version DragonBones 3.0
     */
    var Transform = (function () {
        function Transform(
            /**
             * @language zh_CN
             * 水平位移。
             * @version DragonBones 3.0
             */
            x, 
            /**
             * @language zh_CN
             * 垂直位移。
             * @version DragonBones 3.0
             */
            y, 
            /**
             * @language zh_CN
             * 水平倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewX, 
            /**
             * @language zh_CN
             * 垂直倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewY, 
            /**
             * @language zh_CN
             * 水平缩放。
             * @version DragonBones 3.0
             */
            scaleX, 
            /**
             * @language zh_CN
             * 垂直缩放。
             * @version DragonBones 3.0
             */
            scaleY) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }
            if (skewX === void 0) { skewX = 0.0; }
            if (skewY === void 0) { skewY = 0.0; }
            if (scaleX === void 0) { scaleX = 1.0; }
            if (scaleY === void 0) { scaleY = 1.0; }
            this.x = x;
            this.y = y;
            this.skewX = skewX;
            this.skewY = skewY;
            this.scaleX = scaleX;
            this.scaleY = scaleY;
        }
        /**
         * @private
         */
        Transform.normalizeRadian = function (value) {
            value = (value + Math.PI) % (Math.PI * 2.0);
            value += value > 0.0 ? -Math.PI : Math.PI;
            return value;
        };
        /**
         * @private
         */
        Transform.prototype.toString = function () {
            return "[object dragonBones.Transform] x:" + this.x + " y:" + this.y + " skewX:" + this.skewX * 180.0 / Math.PI + " skewY:" + this.skewY * 180.0 / Math.PI + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
        };
        /**
         * @private
         */
        Transform.prototype.copyFrom = function (value) {
            this.x = value.x;
            this.y = value.y;
            this.skewX = value.skewX;
            this.skewY = value.skewY;
            this.scaleX = value.scaleX;
            this.scaleY = value.scaleY;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.identity = function () {
            this.x = this.y = this.skewX = this.skewY = 0.0;
            this.scaleX = this.scaleY = 1.0;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.add = function (value) {
            this.x += value.x;
            this.y += value.y;
            this.skewX += value.skewX;
            this.skewY += value.skewY;
            this.scaleX *= value.scaleX;
            this.scaleY *= value.scaleY;
            return this;
        };
        /**
         * @private
         */
        Transform.prototype.minus = function (value) {
            this.x -= value.x;
            this.y -= value.y;
            this.skewX = Transform.normalizeRadian(this.skewX - value.skewX);
            this.skewY = Transform.normalizeRadian(this.skewY - value.skewY);
            this.scaleX /= value.scaleX;
            this.scaleY /= value.scaleY;
            return this;
        };
        /**
         * @language zh_CN
         * 矩阵转换为变换。
         * @param 矩阵。
         * @version DragonBones 3.0
         */
        Transform.prototype.fromMatrix = function (matrix) {
            var PI_Q = dragonBones.DragonBones.PI_Q;
            var backupScaleX = this.scaleX, backupScaleY = this.scaleY;
            this.x = matrix.tx;
            this.y = matrix.ty;
            this.skewX = Math.atan(-matrix.c / matrix.d);
            this.skewY = Math.atan(matrix.b / matrix.a);
            if (this.skewX !== this.skewX) {
                this.skewX = 0.0;
            }
            if (this.skewY !== this.skewY) {
                this.skewY = 0.0;
            }
            this.scaleY = (this.skewX > -PI_Q && this.skewX < PI_Q) ? matrix.d / Math.cos(this.skewX) : -matrix.c / Math.sin(this.skewX);
            this.scaleX = (this.skewY > -PI_Q && this.skewY < PI_Q) ? matrix.a / Math.cos(this.skewY) : matrix.b / Math.sin(this.skewY);
            if (backupScaleX >= 0.0 && this.scaleX < 0.0) {
                this.scaleX = -this.scaleX;
                this.skewY = this.skewY - Math.PI;
            }
            if (backupScaleY >= 0.0 && this.scaleY < 0.0) {
                this.scaleY = -this.scaleY;
                this.skewX = this.skewX - Math.PI;
            }
            return this;
        };
        /**
         * @language zh_CN
         * 转换为矩阵。
         * @param 矩阵。
         * @version DragonBones 3.0
         */
        Transform.prototype.toMatrix = function (matrix) {
            if (this.skewX !== 0.0 || this.skewY !== 0.0) {
                matrix.a = Math.cos(this.skewY);
                matrix.b = Math.sin(this.skewY);
                if (this.skewX === this.skewY) {
                    matrix.c = -matrix.b;
                    matrix.d = matrix.a;
                }
                else {
                    matrix.c = -Math.sin(this.skewX);
                    matrix.d = Math.cos(this.skewX);
                }
                if (this.scaleX !== 1.0 || this.scaleY !== 1.0) {
                    matrix.a *= this.scaleX;
                    matrix.b *= this.scaleX;
                    matrix.c *= this.scaleY;
                    matrix.d *= this.scaleY;
                }
            }
            else {
                matrix.a = this.scaleX;
                matrix.b = 0.0;
                matrix.c = 0.0;
                matrix.d = this.scaleY;
            }
            matrix.tx = this.x;
            matrix.ty = this.y;
            return this;
        };
        Object.defineProperty(Transform.prototype, "rotation", {
            /**
             * @language zh_CN
             * 旋转。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            get: function () {
                return this.skewY;
            },
            set: function (value) {
                var dValue = value - this.skewY;
                this.skewX += dValue;
                this.skewY += dValue;
            },
            enumerable: true,
            configurable: true
        });
        return Transform;
    }());
    dragonBones.Transform = Transform;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 2D 矩阵。
     * @version DragonBones 3.0
     */
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1.0; }
            if (b === void 0) { b = 0.0; }
            if (c === void 0) { c = 0.0; }
            if (d === void 0) { d = 1.0; }
            if (tx === void 0) { tx = 0.0; }
            if (ty === void 0) { ty = 0.0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        /**
         * @private
         */
        Matrix.prototype.toString = function () {
            return "[object dragonBones.Matrix] a:" + this.a + " b:" + this.b + " c:" + this.c + " d:" + this.d + " tx:" + this.tx + " ty:" + this.ty;
        };
        /**
         * @language zh_CN
         * 复制矩阵。
         * @param value 需要复制的矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.copyFrom = function (value) {
            this.a = value.a;
            this.b = value.b;
            this.c = value.c;
            this.d = value.d;
            this.tx = value.tx;
            this.ty = value.ty;
            return this;
        };
        /**
         * @private
         */
        Matrix.prototype.copyFromArray = function (value, offset) {
            if (offset === void 0) { offset = 0; }
            this.a = value[offset];
            this.b = value[offset + 1];
            this.c = value[offset + 2];
            this.d = value[offset + 3];
            this.tx = value[offset + 4];
            this.ty = value[offset + 5];
            return this;
        };
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.identity = function () {
            this.a = this.d = 1.0;
            this.b = this.c = 0.0;
            this.tx = this.ty = 0.0;
            return this;
        };
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.concat = function (value) {
            var aA = this.a * value.a;
            var bA = 0.0;
            var cA = 0.0;
            var dA = this.d * value.d;
            var txA = this.tx * value.a + value.tx;
            var tyA = this.ty * value.d + value.ty;
            if (this.b !== 0.0 || this.c !== 0.0) {
                aA += this.b * value.c;
                dA += this.c * value.b;
                bA += this.b * value.d;
                cA += this.c * value.a;
            }
            if (value.b !== 0.0 || value.c !== 0.0) {
                bA += this.a * value.b;
                cA += this.d * value.c;
                txA += this.ty * value.c;
                tyA += this.tx * value.b;
            }
            this.a = aA;
            this.b = bA;
            this.c = cA;
            this.d = dA;
            this.tx = txA;
            this.ty = tyA;
            return this;
        };
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        Matrix.prototype.invert = function () {
            var aA = this.a;
            var bA = this.b;
            var cA = this.c;
            var dA = this.d;
            var txA = this.tx;
            var tyA = this.ty;
            if (bA === 0.0 && cA === 0.0) {
                this.b = this.c = 0.0;
                if (aA === 0.0 || dA === 0.0) {
                    this.a = this.b = this.tx = this.ty = 0.0;
                }
                else {
                    aA = this.a = 1.0 / aA;
                    dA = this.d = 1.0 / dA;
                    this.tx = -aA * txA;
                    this.ty = -dA * tyA;
                }
                return this;
            }
            var determinant = aA * dA - bA * cA;
            if (determinant === 0.0) {
                this.a = this.d = 1.0;
                this.b = this.c = 0.0;
                this.tx = this.ty = 0.0;
                return this;
            }
            determinant = 1.0 / determinant;
            var k = this.a = dA * determinant;
            bA = this.b = -bA * determinant;
            cA = this.c = -cA * determinant;
            dA = this.d = aA * determinant;
            this.tx = -(k * txA + cA * tyA);
            this.ty = -(bA * txA + dA * tyA);
            return this;
        };
        /**
         * @language zh_CN
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         */
        Matrix.prototype.transformPoint = function (x, y, result, delta) {
            if (delta === void 0) { delta = false; }
            result.x = this.a * x + this.c * y;
            result.y = this.b * x + this.d * y;
            if (!delta) {
                result.x += this.tx;
                result.y += this.ty;
            }
        };
        return Matrix;
    }());
    dragonBones.Matrix = Matrix;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ColorTransform = (function () {
        function ColorTransform(alphaMultiplier, redMultiplier, greenMultiplier, blueMultiplier, alphaOffset, redOffset, greenOffset, blueOffset) {
            if (alphaMultiplier === void 0) { alphaMultiplier = 1.0; }
            if (redMultiplier === void 0) { redMultiplier = 1.0; }
            if (greenMultiplier === void 0) { greenMultiplier = 1.0; }
            if (blueMultiplier === void 0) { blueMultiplier = 1.0; }
            if (alphaOffset === void 0) { alphaOffset = 0; }
            if (redOffset === void 0) { redOffset = 0; }
            if (greenOffset === void 0) { greenOffset = 0; }
            if (blueOffset === void 0) { blueOffset = 0; }
            this.alphaMultiplier = alphaMultiplier;
            this.redMultiplier = redMultiplier;
            this.greenMultiplier = greenMultiplier;
            this.blueMultiplier = blueMultiplier;
            this.alphaOffset = alphaOffset;
            this.redOffset = redOffset;
            this.greenOffset = greenOffset;
            this.blueOffset = blueOffset;
        }
        ColorTransform.prototype.copyFrom = function (value) {
            this.alphaMultiplier = value.alphaMultiplier;
            this.redMultiplier = value.redMultiplier;
            this.greenMultiplier = value.greenMultiplier;
            this.blueMultiplier = value.blueMultiplier;
            this.alphaOffset = value.alphaOffset;
            this.redOffset = value.redOffset;
            this.redOffset = value.redOffset;
            this.greenOffset = value.blueOffset;
        };
        ColorTransform.prototype.identity = function () {
            this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1.0;
            this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
        };
        return ColorTransform;
    }());
    dragonBones.ColorTransform = ColorTransform;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * @beta
     * 动画配置，描述播放一个动画所需要的全部信息。
     * @see dragonBones.AnimationState
     * @version DragonBones 5.0
     */
    var AnimationConfig = (function (_super) {
        __extends(AnimationConfig, _super);
        /**
         * @internal
         * @private
         */
        function AnimationConfig() {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 骨骼遮罩。
             * @version DragonBones 5.0
             */
            _this.boneMask = [];
            /**
             * @language zh_CN
             * @version DragonBones 5.0
             */
            _this.animationNames = [];
            return _this;
        }
        AnimationConfig.toString = function () {
            return "[class dragonBones.AnimationConfig]";
        };
        /**
         * @private
         */
        AnimationConfig.prototype._onClear = function () {
            this.pauseFadeOut = true;
            this.fadeOutMode = 4 /* All */;
            this.fadeOutTime = -1.0;
            this.fadeOutEasing = 0.0;
            this.additiveBlending = false;
            this.displayControl = true;
            this.pauseFadeIn = true;
            this.actionEnabled = true;
            this.playTimes = -1;
            this.layer = 0;
            this.position = 0.0;
            this.duration = -1.0;
            this.timeScale = -100.0;
            this.fadeInTime = -1.0;
            this.autoFadeOutTime = -1.0;
            this.fadeInEasing = 0.0;
            this.weight = 1.0;
            this.name = null;
            this.animationName = null;
            this.group = null;
            this.boneMask.length = 0;
            this.animationNames.length = 0;
        };
        AnimationConfig.prototype.clear = function () {
            this._onClear();
        };
        AnimationConfig.prototype.copyFrom = function (value) {
            this.pauseFadeOut = value.pauseFadeOut;
            this.fadeOutMode = value.fadeOutMode;
            this.autoFadeOutTime = value.autoFadeOutTime;
            this.fadeOutEasing = value.fadeOutEasing;
            this.additiveBlending = value.additiveBlending;
            this.displayControl = value.displayControl;
            this.pauseFadeIn = value.pauseFadeIn;
            this.actionEnabled = value.actionEnabled;
            this.playTimes = value.playTimes;
            this.layer = value.layer;
            this.position = value.position;
            this.duration = value.duration;
            this.timeScale = value.timeScale;
            this.fadeInTime = value.fadeInTime;
            this.fadeOutTime = value.fadeOutTime;
            this.fadeInEasing = value.fadeInEasing;
            this.weight = value.weight;
            this.name = value.name;
            this.animationName = value.animationName;
            this.group = value.group;
            this.boneMask.length = value.boneMask.length;
            for (var i = 0, l = this.boneMask.length; i < l; ++i) {
                this.boneMask[i] = value.boneMask[i];
            }
            this.animationNames.length = value.animationNames.length;
            for (var i = 0, l = this.animationNames.length; i < l; ++i) {
                this.animationNames[i] = value.animationNames[i];
            }
        };
        AnimationConfig.prototype.containsBoneMask = function (name) {
            return this.boneMask.length === 0 || this.boneMask.indexOf(name) >= 0;
        };
        AnimationConfig.prototype.addBoneMask = function (armature, name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var currentBone = armature.getBone(name);
            if (!currentBone) {
                return;
            }
            if (this.boneMask.indexOf(name) < 0) {
                this.boneMask.push(name);
            }
            if (recursive) {
                var bones = armature.getBones();
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    if (this.boneMask.indexOf(bone.name) < 0 && currentBone.contains(bone)) {
                        this.boneMask.push(bone.name);
                    }
                }
            }
        };
        AnimationConfig.prototype.removeBoneMask = function (armature, name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var index = this.boneMask.indexOf(name);
            if (index >= 0) {
                this.boneMask.splice(index, 1);
            }
            if (recursive) {
                var currentBone = armature.getBone(name);
                if (currentBone) {
                    var bones = armature.getBones();
                    if (this.boneMask.length > 0) {
                        for (var i = 0, l = bones.length; i < l; ++i) {
                            var bone = bones[i];
                            var index_1 = this.boneMask.indexOf(bone.name);
                            if (index_1 >= 0 && currentBone.contains(bone)) {
                                this.boneMask.splice(index_1, 1);
                            }
                        }
                    }
                    else {
                        for (var i = 0, l = bones.length; i < l; ++i) {
                            var bone = bones[i];
                            if (!currentBone.contains(bone)) {
                                this.boneMask.push(bone.name);
                            }
                        }
                    }
                }
            }
        };
        return AnimationConfig;
    }(dragonBones.BaseObject));
    dragonBones.AnimationConfig = AnimationConfig;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var FrameData = (function (_super) {
        __extends(FrameData, _super);
        function FrameData() {
            return _super.call(this) || this;
        }
        FrameData.prototype._onClear = function () {
            this.position = 0.0;
            this.duration = 0.0;
            this.prev = null;
            this.next = null;
        };
        return FrameData;
    }(dragonBones.BaseObject));
    dragonBones.FrameData = FrameData;
    /**
     * @private
     */
    var TweenFrameData = (function (_super) {
        __extends(TweenFrameData, _super);
        function TweenFrameData() {
            return _super.call(this) || this;
        }
        TweenFrameData._getCurvePoint = function (x1, y1, x2, y2, x3, y3, x4, y4, t, result) {
            var l_t = 1 - t;
            var powA = l_t * l_t;
            var powB = t * t;
            var kA = l_t * powA;
            var kB = 3.0 * t * powA;
            var kC = 3.0 * l_t * powB;
            var kD = t * powB;
            result.x = kA * x1 + kB * x2 + kC * x3 + kD * x4;
            result.y = kA * y1 + kB * y2 + kC * y3 + kD * y4;
        };
        TweenFrameData.samplingEasingCurve = function (curve, samples) {
            var curveCount = curve.length;
            var result = new dragonBones.Point();
            var stepIndex = -2;
            for (var i = 0, l = samples.length; i < l; ++i) {
                var t = (i + 1) / (l + 1);
                while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6] : 1) < t) {
                    stepIndex += 6;
                }
                var isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
                var x1 = isInCurve ? curve[stepIndex] : 0.0;
                var y1 = isInCurve ? curve[stepIndex + 1] : 0.0;
                var x2 = curve[stepIndex + 2];
                var y2 = curve[stepIndex + 3];
                var x3 = curve[stepIndex + 4];
                var y3 = curve[stepIndex + 5];
                var x4 = isInCurve ? curve[stepIndex + 6] : 1.0;
                var y4 = isInCurve ? curve[stepIndex + 7] : 1.0;
                var lower = 0.0;
                var higher = 1.0;
                while (higher - lower > 0.01) {
                    var percentage = (higher + lower) / 2.0;
                    TweenFrameData._getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, result);
                    if (t - result.x > 0.0) {
                        lower = percentage;
                    }
                    else {
                        higher = percentage;
                    }
                }
                samples[i] = result.y;
            }
        };
        TweenFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweenEasing = 0.0;
            this.curve = null;
        };
        return TweenFrameData;
    }(FrameData));
    dragonBones.TweenFrameData = TweenFrameData;
    /**
     * @private
     */
    var AnimationFrameData = (function (_super) {
        __extends(AnimationFrameData, _super);
        function AnimationFrameData() {
            var _this = _super.call(this) || this;
            _this.actions = [];
            _this.events = [];
            return _this;
        }
        AnimationFrameData.toString = function () {
            return "[class dragonBones.AnimationFrameData]";
        };
        AnimationFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            for (var i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }
            for (var i = 0, l = this.events.length; i < l; ++i) {
                this.events[i].returnToPool();
            }
            this.actions.length = 0;
            this.events.length = 0;
        };
        return AnimationFrameData;
    }(FrameData));
    dragonBones.AnimationFrameData = AnimationFrameData;
    /**
     * @private
     */
    var ZOrderFrameData = (function (_super) {
        __extends(ZOrderFrameData, _super);
        function ZOrderFrameData() {
            var _this = _super.call(this) || this;
            _this.zOrder = [];
            return _this;
        }
        ZOrderFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.zOrder.length = 0;
        };
        return ZOrderFrameData;
    }(FrameData));
    dragonBones.ZOrderFrameData = ZOrderFrameData;
    /**
     * @private
     */
    var BoneFrameData = (function (_super) {
        __extends(BoneFrameData, _super);
        function BoneFrameData() {
            var _this = _super.call(this) || this;
            _this.transform = new dragonBones.Transform();
            return _this;
        }
        BoneFrameData.toString = function () {
            return "[class dragonBones.BoneFrameData]";
        };
        BoneFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweenScale = false;
            this.tweenRotate = 0.0;
            this.transform.identity();
        };
        return BoneFrameData;
    }(TweenFrameData));
    dragonBones.BoneFrameData = BoneFrameData;
    /**
     * @private
     */
    var SlotFrameData = (function (_super) {
        __extends(SlotFrameData, _super);
        function SlotFrameData() {
            return _super.call(this) || this;
        }
        SlotFrameData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        SlotFrameData.toString = function () {
            return "[class dragonBones.SlotFrameData]";
        };
        SlotFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.displayIndex = 0;
            this.color = null;
        };
        return SlotFrameData;
    }(TweenFrameData));
    SlotFrameData.DEFAULT_COLOR = new dragonBones.ColorTransform();
    dragonBones.SlotFrameData = SlotFrameData;
    /**
     * @private
     */
    var ExtensionFrameData = (function (_super) {
        __extends(ExtensionFrameData, _super);
        function ExtensionFrameData() {
            var _this = _super.call(this) || this;
            _this.tweens = [];
            return _this;
        }
        ExtensionFrameData.toString = function () {
            return "[class dragonBones.ExtensionFrameData]";
        };
        ExtensionFrameData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.tweens.length = 0;
        };
        return ExtensionFrameData;
    }(TweenFrameData));
    dragonBones.ExtensionFrameData = ExtensionFrameData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var TimelineData = (function (_super) {
        __extends(TimelineData, _super);
        /**
         * @private
         */
        function TimelineData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.frames = [];
            return _this;
        }
        /**
         * @private
         */
        TimelineData.toString = function () {
            return "[class dragonBones.TimelineData]";
        };
        /**
         * @private
         */
        TimelineData.prototype._onClear = function () {
            var prevFrame = null;
            for (var i = 0, l = this.frames.length; i < l; ++i) {
                var frame = this.frames[i];
                if (prevFrame && frame !== prevFrame) {
                    prevFrame.returnToPool();
                }
                prevFrame = frame;
            }
            this.scale = 1;
            this.offset = 0;
            this.frames.length = 0;
        };
        return TimelineData;
    }(dragonBones.BaseObject));
    dragonBones.TimelineData = TimelineData;
    /**
     * @private
     */
    var ZOrderTimelineData = (function (_super) {
        __extends(ZOrderTimelineData, _super);
        function ZOrderTimelineData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ZOrderTimelineData.toString = function () {
            return "[class dragonBones.ZOrderTimelineData]";
        };
        return ZOrderTimelineData;
    }(TimelineData));
    dragonBones.ZOrderTimelineData = ZOrderTimelineData;
    /**
     * @private
     */
    var BoneTimelineData = (function (_super) {
        __extends(BoneTimelineData, _super);
        function BoneTimelineData() {
            var _this = _super.call(this) || this;
            _this.originalTransform = new dragonBones.Transform();
            return _this;
        }
        BoneTimelineData.toString = function () {
            return "[class dragonBones.BoneTimelineData]";
        };
        BoneTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.originalTransform.identity();
            this.bone = null;
        };
        return BoneTimelineData;
    }(TimelineData));
    dragonBones.BoneTimelineData = BoneTimelineData;
    /**
     * @private
     */
    var SlotTimelineData = (function (_super) {
        __extends(SlotTimelineData, _super);
        function SlotTimelineData() {
            return _super.call(this) || this;
        }
        SlotTimelineData.toString = function () {
            return "[class dragonBones.SlotTimelineData]";
        };
        SlotTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
        };
        return SlotTimelineData;
    }(TimelineData));
    dragonBones.SlotTimelineData = SlotTimelineData;
    /**
     * @private
     */
    var FFDTimelineData = (function (_super) {
        __extends(FFDTimelineData, _super);
        function FFDTimelineData() {
            return _super.call(this) || this;
        }
        FFDTimelineData.toString = function () {
            return "[class dragonBones.FFDTimelineData]";
        };
        FFDTimelineData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.skin = null;
            this.slot = null;
            this.display = null;
        };
        return FFDTimelineData;
    }(TimelineData));
    dragonBones.FFDTimelineData = FFDTimelineData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画数据。
     * @version DragonBones 3.0
     */
    var AnimationData = (function (_super) {
        __extends(AnimationData, _super);
        /**
         * @internal
         * @private
         */
        function AnimationData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.boneTimelines = {};
            /**
             * @private
             */
            _this.slotTimelines = {};
            /**
             * @private
             */
            _this.ffdTimelines = {}; // skin slot mesh
            /**
             * @private
             */
            _this.cachedFrames = [];
            /**
             * @private
             */
            _this.boneCachedFrameIndices = {};
            /**
             * @private
             */
            _this.slotCachedFrameIndices = {};
            return _this;
        }
        /**
         * @private
         */
        AnimationData.toString = function () {
            return "[class dragonBones.AnimationData]";
        };
        /**
         * @private
         */
        AnimationData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            for (var k in this.boneTimelines) {
                this.boneTimelines[k].returnToPool();
                delete this.boneTimelines[k];
            }
            for (var k in this.slotTimelines) {
                this.slotTimelines[k].returnToPool();
                delete this.slotTimelines[k];
            }
            for (var k in this.ffdTimelines) {
                for (var kA in this.ffdTimelines[k]) {
                    for (var kB in this.ffdTimelines[k][kA]) {
                        this.ffdTimelines[k][kA][kB].returnToPool();
                    }
                }
                delete this.ffdTimelines[k];
            }
            for (var k in this.boneCachedFrameIndices) {
                // this.boneCachedFrameIndices[i].length = 0;
                delete this.boneCachedFrameIndices[k];
            }
            for (var k in this.slotCachedFrameIndices) {
                // this.slotCachedFrameIndices[i].length = 0;
                delete this.slotCachedFrameIndices[k];
            }
            if (this.zOrderTimeline) {
                this.zOrderTimeline.returnToPool();
            }
            this.frameCount = 0;
            this.playTimes = 0;
            this.duration = 0.0;
            this.fadeInTime = 0.0;
            this.cacheFrameRate = 0.0;
            this.name = null;
            //this.boneTimelines.clear();
            //this.slotTimelines.clear();
            //this.ffdTimelines.clear();
            this.cachedFrames.length = 0;
            //this.boneCachedFrameIndices.clear();
            //this.boneCachedFrameIndices.clear();
            this.zOrderTimeline = null;
        };
        /**
         * @private
         */
        AnimationData.prototype.cacheFrames = function (frameRate) {
            if (this.cacheFrameRate > 0.0) {
                return;
            }
            this.cacheFrameRate = Math.max(Math.ceil(frameRate * this.scale), 1.0);
            var cacheFrameCount = Math.ceil(this.cacheFrameRate * this.duration) + 1; // uint
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
            for (var k in this.boneTimelines) {
                var indices = new Array(cacheFrameCount);
                for (var i = 0, l = indices.length; i < l; ++i) {
                    indices[i] = -1;
                }
                this.boneCachedFrameIndices[k] = indices;
            }
            for (var k in this.slotTimelines) {
                var indices = new Array(cacheFrameCount);
                for (var i = 0, l = indices.length; i < l; ++i) {
                    indices[i] = -1;
                }
                this.slotCachedFrameIndices[k] = indices;
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.addBoneTimeline = function (value) {
            if (value && value.bone && !this.boneTimelines[value.bone.name]) {
                this.boneTimelines[value.bone.name] = value;
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.addSlotTimeline = function (value) {
            if (value && value.slot && !this.slotTimelines[value.slot.name]) {
                this.slotTimelines[value.slot.name] = value;
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.addFFDTimeline = function (value) {
            if (value && value.skin && value.slot && value.display) {
                var skin = this.ffdTimelines[value.skin.name] = this.ffdTimelines[value.skin.name] || {};
                var slot = skin[value.slot.slot.name] = skin[value.slot.slot.name] || {};
                if (!slot[value.display.name]) {
                    slot[value.display.name] = value;
                }
                else {
                    throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
                }
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @private
         */
        AnimationData.prototype.getBoneTimeline = function (name) {
            return this.boneTimelines[name];
        };
        /**
         * @private
         */
        AnimationData.prototype.getSlotTimeline = function (name) {
            return this.slotTimelines[name];
        };
        /**
         * @private
         */
        AnimationData.prototype.getFFDTimeline = function (skinName, slotName) {
            var skin = this.ffdTimelines[skinName];
            if (skin) {
                return skin[slotName];
            }
            return null;
        };
        /**
         * @private
         */
        AnimationData.prototype.getBoneCachedFrameIndices = function (name) {
            return this.boneCachedFrameIndices[name];
        };
        /**
         * @private
         */
        AnimationData.prototype.getSlotCachedFrameIndices = function (name) {
            return this.slotCachedFrameIndices[name];
        };
        return AnimationData;
    }(dragonBones.TimelineData));
    dragonBones.AnimationData = AnimationData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨架数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var ArmatureData = (function (_super) {
        __extends(ArmatureData, _super);
        /**
         * @internal
         * @private
         */
        function ArmatureData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.aabb = new dragonBones.Rectangle();
            /**
             * @language zh_CN
             * 所有骨骼数据。
             * @see dragonBones.BoneData
             * @version DragonBones 3.0
             */
            _this.bones = {};
            /**
             * @language zh_CN
             * 所有插槽数据。
             * @see dragonBones.SlotData
             * @version DragonBones 3.0
             */
            _this.slots = {};
            /**
             * @private
             */
            _this.skins = {};
            /**
             * @language zh_CN
             * 所有动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 3.0
             */
            _this.animations = {};
            /**
             * @private
             */
            _this.actions = [];
            _this._animationNames = [];
            _this._sortedBones = [];
            _this._sortedSlots = [];
            _this._bonesChildren = {};
            return _this;
        }
        /**
         * @private
         */
        ArmatureData.toString = function () {
            return "[class dragonBones.ArmatureData]";
        };
        ArmatureData._onSortSlots = function (a, b) {
            return a.zOrder > b.zOrder ? 1 : -1;
        };
        /**
         * @private
         */
        ArmatureData.prototype._onClear = function () {
            for (var k in this.bones) {
                this.bones[k].returnToPool();
                delete this.bones[k];
            }
            for (var k in this.slots) {
                this.slots[k].returnToPool();
                delete this.slots[k];
            }
            for (var k in this.skins) {
                this.skins[k].returnToPool();
                delete this.skins[k];
            }
            for (var k in this.animations) {
                this.animations[k].returnToPool();
                delete this.animations[k];
            }
            for (var i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }
            for (var k in this._bonesChildren) {
                delete this._bonesChildren[k];
            }
            if (this.userData) {
                this.userData.returnToPool();
            }
            this.frameRate = 0;
            this.type = -1 /* None */;
            this.cacheFrameRate = 0;
            this.scale = 1.0;
            this.name = null;
            this.aabb.clear();
            //this.bones.clear();
            //this.slots.clear();
            //this.skins.clear();
            //this.animations.clear();
            this.actions.length = 0;
            this.parent = null;
            this.userData = null;
            this._boneDirty = false;
            this._slotDirty = false;
            this._animationNames.length = 0;
            this._sortedBones.length = 0;
            this._sortedSlots.length = 0;
            this._defaultSkin = null;
            this._defaultAnimation = null;
        };
        ArmatureData.prototype._sortBones = function () {
            var total = this._sortedBones.length;
            if (total < 1) {
                return;
            }
            var sortHelper = this._sortedBones.concat();
            var index = 0;
            var count = 0;
            this._sortedBones.length = 0;
            while (count < total) {
                var bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (this._sortedBones.indexOf(bone) >= 0) {
                    continue;
                }
                if (bone.parent && this._sortedBones.indexOf(bone.parent) < 0) {
                    continue;
                }
                if (bone.ik && this._sortedBones.indexOf(bone.ik) < 0) {
                    continue;
                }
                if (bone.ik && bone.chain > 0 && bone.chainIndex === bone.chain) {
                    this._sortedBones.splice(this._sortedBones.indexOf(bone.parent) + 1, 0, bone);
                }
                else {
                    this._sortedBones.push(bone);
                }
                count++;
            }
        };
        ArmatureData.prototype._sortSlots = function () {
            this._sortedSlots.sort(ArmatureData._onSortSlots);
        };
        /**
         * @private
         */
        ArmatureData.prototype.cacheFrames = function (frameRate) {
            if (this.cacheFrameRate > 0) {
                return;
            }
            this.cacheFrameRate = frameRate;
            for (var k in this.animations) {
                this.animations[k].cacheFrames(this.cacheFrameRate);
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.setCacheFrame = function (globalTransformMatrix, transform) {
            var dataArray = this.parent.cachedFrames;
            var arrayOffset = dataArray.length;
            dataArray.length += 10;
            dataArray[arrayOffset] = globalTransformMatrix.a;
            dataArray[arrayOffset + 1] = globalTransformMatrix.b;
            dataArray[arrayOffset + 2] = globalTransformMatrix.c;
            dataArray[arrayOffset + 3] = globalTransformMatrix.d;
            dataArray[arrayOffset + 4] = globalTransformMatrix.tx;
            dataArray[arrayOffset + 5] = globalTransformMatrix.ty;
            dataArray[arrayOffset + 6] = transform.skewX;
            dataArray[arrayOffset + 7] = transform.skewY;
            dataArray[arrayOffset + 8] = transform.scaleX;
            dataArray[arrayOffset + 9] = transform.scaleY;
            return arrayOffset;
        };
        /**
         * @private
         */
        ArmatureData.prototype.getCacheFrame = function (globalTransformMatrix, transform, arrayOffset) {
            var dataArray = this.parent.cachedFrames;
            globalTransformMatrix.a = dataArray[arrayOffset];
            globalTransformMatrix.b = dataArray[arrayOffset + 1];
            globalTransformMatrix.c = dataArray[arrayOffset + 2];
            globalTransformMatrix.d = dataArray[arrayOffset + 3];
            globalTransformMatrix.tx = dataArray[arrayOffset + 4];
            globalTransformMatrix.ty = dataArray[arrayOffset + 5];
            transform.skewX = dataArray[arrayOffset + 6];
            transform.skewY = dataArray[arrayOffset + 7];
            transform.scaleX = dataArray[arrayOffset + 8];
            transform.scaleY = dataArray[arrayOffset + 9];
        };
        /**
         * @private
         */
        ArmatureData.prototype.addBone = function (value, parentName) {
            if (value && value.name && !this.bones[value.name]) {
                if (parentName) {
                    var parent_1 = this.getBone(parentName);
                    if (parent_1) {
                        value.parent = parent_1;
                    }
                    else {
                        (this._bonesChildren[parentName] = this._bonesChildren[parentName] || []).push(value);
                    }
                }
                var children = this._bonesChildren[value.name];
                if (children) {
                    for (var i = 0, l = children.length; i < l; ++i) {
                        children[i].parent = value;
                    }
                    delete this._bonesChildren[value.name];
                }
                this.bones[value.name] = value;
                this._sortedBones.push(value);
                this._boneDirty = true;
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addSlot = function (value) {
            if (value && value.name && !this.slots[value.name]) {
                this.slots[value.name] = value;
                this._sortedSlots.push(value);
                this._slotDirty = true;
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addSkin = function (value) {
            if (value && value.name && !this.skins[value.name]) {
                this.skins[value.name] = value;
                if (!this._defaultSkin) {
                    this._defaultSkin = value;
                }
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @private
         */
        ArmatureData.prototype.addAnimation = function (value) {
            if (value && value.name && !this.animations[value.name]) {
                this.animations[value.name] = value;
                this._animationNames.push(value.name);
                if (!this._defaultAnimation) {
                    this._defaultAnimation = value;
                }
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @language zh_CN
         * 获取骨骼数据。
         * @param name 骨骼数据名称。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getBone = function (name) {
            return this.bones[name];
        };
        /**
         * @language zh_CN
         * 获取插槽数据。
         * @param name 插槽数据名称。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getSlot = function (name) {
            return this.slots[name];
        };
        /**
         * @private
         */
        ArmatureData.prototype.getSkin = function (name) {
            return name ? this.skins[name] : this._defaultSkin;
        };
        /**
         * @language zh_CN
         * 获取动画数据。
         * @param name 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        ArmatureData.prototype.getAnimation = function (name) {
            return name ? this.animations[name] : this._defaultAnimation;
        };
        Object.defineProperty(ArmatureData.prototype, "animationNames", {
            /**
             * @language zh_CN
             * 所有动画数据名称。
             * @see #armatures
             * @version DragonBones 3.0
             */
            get: function () {
                return this._animationNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "sortedBones", {
            /**
             * @private
             */
            get: function () {
                if (this._boneDirty) {
                    this._boneDirty = false;
                    this._sortBones();
                }
                return this._sortedBones;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "sortedSlots", {
            /**
             * @private
             */
            get: function () {
                if (this._slotDirty) {
                    this._slotDirty = false;
                    this._sortSlots();
                }
                return this._sortedSlots;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "defaultSkin", {
            /**
             * @private
             */
            get: function () {
                return this._defaultSkin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArmatureData.prototype, "defaultAnimation", {
            /**
             * @language zh_CN
             * 获取默认动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._defaultAnimation;
            },
            enumerable: true,
            configurable: true
        });
        return ArmatureData;
    }(dragonBones.BaseObject));
    dragonBones.ArmatureData = ArmatureData;
    /**
     * @language zh_CN
     * 骨骼数据。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    var BoneData = (function (_super) {
        __extends(BoneData, _super);
        /**
         * @internal
         * @private
         */
        function BoneData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.transform = new dragonBones.Transform();
            return _this;
        }
        /**
         * @private
         */
        BoneData.toString = function () {
            return "[class dragonBones.BoneData]";
        };
        /**
         * @private
         */
        BoneData.prototype._onClear = function () {
            if (this.userData) {
                this.userData.returnToPool();
            }
            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.bendPositive = false;
            this.chain = 0;
            this.chainIndex = 0;
            this.weight = 0.0;
            this.length = 0.0;
            this.name = null;
            this.transform.identity();
            this.parent = null;
            this.ik = null;
            this.userData = null;
        };
        return BoneData;
    }(dragonBones.BaseObject));
    dragonBones.BoneData = BoneData;
    /**
     * @language zh_CN
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    var SlotData = (function (_super) {
        __extends(SlotData, _super);
        /**
         * @internal
         * @private
         */
        function SlotData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.actions = [];
            return _this;
        }
        /**
         * @private
         */
        SlotData.generateColor = function () {
            return new dragonBones.ColorTransform();
        };
        /**
         * @private
         */
        SlotData.toString = function () {
            return "[class dragonBones.SlotData]";
        };
        /**
         * @private
         */
        SlotData.prototype._onClear = function () {
            for (var i = 0, l = this.actions.length; i < l; ++i) {
                this.actions[i].returnToPool();
            }
            if (this.userData) {
                this.userData.returnToPool();
            }
            this.displayIndex = -1;
            this.zOrder = 0;
            this.blendMode = -1 /* None */;
            this.name = null;
            this.actions.length = 0;
            this.parent = null;
            this.color = null;
            this.userData = null;
        };
        return SlotData;
    }(dragonBones.BaseObject));
    /**
     * @private
     */
    SlotData.DEFAULT_COLOR = new dragonBones.ColorTransform();
    dragonBones.SlotData = SlotData;
    /**
     * @private
     */
    var SkinData = (function (_super) {
        __extends(SkinData, _super);
        function SkinData() {
            var _this = _super.call(this) || this;
            _this.slots = {};
            return _this;
        }
        SkinData.toString = function () {
            return "[class dragonBones.SkinData]";
        };
        SkinData.prototype._onClear = function () {
            for (var k in this.slots) {
                this.slots[k].returnToPool();
                delete this.slots[k];
            }
            this.name = null;
            //this.slots.clear();
        };
        SkinData.prototype.addSlot = function (value) {
            if (value && value.slot && !this.slots[value.slot.name]) {
                this.slots[value.slot.name] = value;
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        SkinData.prototype.getSlot = function (name) {
            return this.slots[name];
        };
        return SkinData;
    }(dragonBones.BaseObject));
    dragonBones.SkinData = SkinData;
    /**
     * @private
     */
    var SkinSlotData = (function (_super) {
        __extends(SkinSlotData, _super);
        function SkinSlotData() {
            var _this = _super.call(this) || this;
            _this.displays = [];
            _this.meshs = {};
            return _this;
        }
        SkinSlotData.toString = function () {
            return "[class dragonBones.SkinSlotData]";
        };
        SkinSlotData.prototype._onClear = function () {
            for (var i = 0, l = this.displays.length; i < l; ++i) {
                this.displays[i].returnToPool();
            }
            for (var k in this.meshs) {
                this.meshs[k].returnToPool();
                delete this.meshs[k];
            }
            this.displays.length = 0;
            //this.meshs.clear();
            this.slot = null;
        };
        SkinSlotData.prototype.getDisplay = function (name) {
            for (var i = 0, l = this.displays.length; i < l; ++i) {
                var display = this.displays[i];
                if (display.name === name) {
                    return display;
                }
            }
            return null;
        };
        SkinSlotData.prototype.addMesh = function (value) {
            if (value && value.name && !this.meshs[value.name]) {
                this.meshs[value.name] = value;
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        SkinSlotData.prototype.getMesh = function (name) {
            return this.meshs[name];
        };
        return SkinSlotData;
    }(dragonBones.BaseObject));
    dragonBones.SkinSlotData = SkinSlotData;
    /**
     * @private
     */
    var DisplayData = (function (_super) {
        __extends(DisplayData, _super);
        function DisplayData() {
            var _this = _super.call(this) || this;
            _this.pivot = new dragonBones.Point();
            _this.transform = new dragonBones.Transform();
            return _this;
        }
        DisplayData.toString = function () {
            return "[class dragonBones.DisplayData]";
        };
        DisplayData.prototype._onClear = function () {
            if (this.boundingBox) {
                this.boundingBox.returnToPool();
            }
            this.isRelativePivot = false;
            this.type = -1 /* None */;
            this.inheritAnimation = true;
            this.name = null;
            this.path = null;
            this.share = null;
            this.pivot.clear();
            this.transform.identity();
            this.texture = null;
            this.armature = null;
            this.mesh = null;
            this.boundingBox = null;
        };
        return DisplayData;
    }(dragonBones.BaseObject));
    dragonBones.DisplayData = DisplayData;
    /**
     * @private
     */
    var MeshData = (function (_super) {
        __extends(MeshData, _super);
        function MeshData() {
            var _this = _super.call(this) || this;
            _this.slotPose = new dragonBones.Matrix();
            _this.uvs = []; // vertices * 2
            _this.vertices = []; // vertices * 2
            _this.vertexIndices = []; // triangles * 3
            _this.boneIndices = []; // vertices bones
            _this.weights = []; // vertices bones
            _this.boneVertices = []; // vertices bones * 2
            _this.bones = []; // bones
            _this.inverseBindPose = []; // bones
            return _this;
        }
        MeshData.toString = function () {
            return "[class dragonBones.MeshData]";
        };
        MeshData.prototype._onClear = function () {
            this.skinned = false;
            this.name = null;
            this.slotPose.identity();
            this.uvs.length = 0;
            this.vertices.length = 0;
            this.vertexIndices.length = 0;
            this.boneIndices.length = 0;
            this.weights.length = 0;
            this.boneVertices.length = 0;
            this.bones.length = 0;
            this.inverseBindPose.length = 0;
        };
        return MeshData;
    }(dragonBones.BaseObject));
    dragonBones.MeshData = MeshData;
    /**
     * @language zh_CN
     * 自定义包围盒数据。
     * @version DragonBones 5.0
     */
    var BoundingBoxData = (function (_super) {
        __extends(BoundingBoxData, _super);
        /**
         * @internal
         * @private
         */
        function BoundingBoxData() {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 自定义多边形顶点。
             * @version DragonBones 5.0
             */
            _this.vertices = [];
            return _this;
        }
        /**
         * @private
         */
        BoundingBoxData.toString = function () {
            return "[class dragonBones.BoundingBoxData]";
        };
        /**
         * Compute the bit code for a point (x, y) using the clip rectangle
         */
        BoundingBoxData._computeOutCode = function (x, y, xMin, yMin, xMax, yMax) {
            var code = 0 /* InSide */; // initialised as being inside of [[clip window]]
            if (x < xMin) {
                code |= 1 /* Left */;
            }
            else if (x > xMax) {
                code |= 2 /* Right */;
            }
            if (y < yMin) {
                code |= 4 /* Top */;
            }
            else if (y > yMax) {
                code |= 8 /* Bottom */;
            }
            return code;
        };
        /**
         * @private
         */
        BoundingBoxData.segmentIntersectsRectangle = function (xA, yA, xB, yB, xMin, yMin, xMax, yMax, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            var inSideA = xA > xMin && xA < xMax && yA > yMin && yA < yMax;
            var inSideB = xB > xMin && xB < xMax && yB > yMin && yB < yMax;
            if (inSideA && inSideB) {
                return -1;
            }
            var intersectionCount = 0;
            var outcode0 = BoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
            var outcode1 = BoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);
            while (true) {
                if (!(outcode0 | outcode1)) {
                    intersectionCount = 2;
                    break;
                }
                else if (outcode0 & outcode1) {
                    break;
                }
                // failed both tests, so calculate the line segment to clip
                // from an outside point to an intersection with clip edge
                var x = 0.0;
                var y = 0.0;
                var normalRadian = 0.0;
                // At least one endpoint is outside the clip rectangle; pick it.
                var outcodeOut = outcode0 ? outcode0 : outcode1;
                // Now find the intersection point;
                if (outcodeOut & 4 /* Top */) {
                    x = xA + (xB - xA) * (yMin - yA) / (yB - yA);
                    y = yMin;
                    if (normalRadians) {
                        normalRadian = -Math.PI * 0.5;
                    }
                }
                else if (outcodeOut & 8 /* Bottom */) {
                    x = xA + (xB - xA) * (yMax - yA) / (yB - yA);
                    y = yMax;
                    if (normalRadians) {
                        normalRadian = Math.PI * 0.5;
                    }
                }
                else if (outcodeOut & 2 /* Right */) {
                    y = yA + (yB - yA) * (xMax - xA) / (xB - xA);
                    x = xMax;
                    if (normalRadians) {
                        normalRadian = 0;
                    }
                }
                else if (outcodeOut & 1 /* Left */) {
                    y = yA + (yB - yA) * (xMin - xA) / (xB - xA);
                    x = xMin;
                    if (normalRadians) {
                        normalRadian = Math.PI;
                    }
                }
                // Now we move outside point to intersection point to clip
                // and get ready for next pass.
                if (outcodeOut === outcode0) {
                    xA = x;
                    yA = y;
                    outcode0 = BoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
                    if (normalRadians) {
                        normalRadians.x = normalRadian;
                    }
                }
                else {
                    xB = x;
                    yB = y;
                    outcode1 = BoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);
                    if (normalRadians) {
                        normalRadians.y = normalRadian;
                    }
                }
            }
            if (intersectionCount) {
                if (inSideA) {
                    intersectionCount = 2; // 10
                    if (intersectionPointA) {
                        intersectionPointA.x = xB;
                        intersectionPointA.y = yB;
                    }
                    if (intersectionPointB) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = xB;
                    }
                    if (normalRadians) {
                        normalRadians.x = normalRadians.y + Math.PI;
                    }
                }
                else if (inSideB) {
                    intersectionCount = 1; // 01
                    if (intersectionPointA) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }
                    if (intersectionPointB) {
                        intersectionPointB.x = xA;
                        intersectionPointB.y = yA;
                    }
                    if (normalRadians) {
                        normalRadians.y = normalRadians.x + Math.PI;
                    }
                }
                else {
                    intersectionCount = 3; // 11
                    if (intersectionPointA) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }
                    if (intersectionPointB) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = yB;
                    }
                }
            }
            return intersectionCount;
        };
        /**
         * @private
         */
        BoundingBoxData.segmentIntersectsEllipse = function (xA, yA, xB, yB, xC, yC, widthH, heightH, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            var d = widthH / heightH;
            var dd = d * d;
            yA *= d;
            yB *= d;
            var dX = xB - xA;
            var dY = yB - yA;
            var lAB = Math.sqrt(dX * dX + dY * dY);
            var xD = dX / lAB;
            var yD = dY / lAB;
            var a = (xC - xA) * xD + (yC - yA) * yD;
            var aa = a * a;
            var ee = xA * xA + yA * yA;
            var rr = widthH * widthH;
            var dR = rr - ee + aa;
            var intersectionCount = 0;
            if (dR >= 0) {
                var dT = Math.sqrt(dR);
                var sA = a - dT;
                var sB = a + dT;
                var inSideA = sA < 0.0 ? -1 : (sA <= lAB ? 0 : 1);
                var inSideB = sB < 0.0 ? -1 : (sB <= lAB ? 0 : 1);
                var sideAB = inSideA * inSideB;
                if (sideAB < 0) {
                    return -1;
                }
                else if (sideAB === 0) {
                    if (inSideA === -1) {
                        intersectionCount = 2; // 10
                        xB = xA + sB * xD;
                        yB = (yA + sB * yD) / d;
                        if (intersectionPointA) {
                            intersectionPointA.x = xB;
                            intersectionPointA.y = yB;
                        }
                        if (intersectionPointB) {
                            intersectionPointB.x = xB;
                            intersectionPointB.y = yB;
                        }
                        if (normalRadians) {
                            normalRadians.x = Math.atan2(yB / rr * dd, xB / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else if (inSideB === 1) {
                        intersectionCount = 1; // 01
                        xA = xA + sA * xD;
                        yA = (yA + sA * yD) / d;
                        if (intersectionPointA) {
                            intersectionPointA.x = xA;
                            intersectionPointA.y = yA;
                        }
                        if (intersectionPointB) {
                            intersectionPointB.x = xA;
                            intersectionPointB.y = yA;
                        }
                        if (normalRadians) {
                            normalRadians.x = Math.atan2(yA / rr * dd, xA / rr);
                            normalRadians.y = normalRadians.x + Math.PI;
                        }
                    }
                    else {
                        intersectionCount = 3; // 11
                        if (intersectionPointA) {
                            intersectionPointA.x = xA + sA * xD;
                            intersectionPointA.y = (yA + sA * yD) / d;
                            if (normalRadians) {
                                normalRadians.x = Math.atan2(intersectionPointA.y / rr * dd, intersectionPointA.x / rr);
                            }
                        }
                        if (intersectionPointB) {
                            intersectionPointB.x = xA + sB * xD;
                            intersectionPointB.y = (yA + sB * yD) / d;
                            if (normalRadians) {
                                normalRadians.y = Math.atan2(intersectionPointB.y / rr * dd, intersectionPointB.x / rr);
                            }
                        }
                    }
                }
            }
            return intersectionCount;
        };
        /**
         * @private
         */
        BoundingBoxData.segmentIntersectsPolygon = function (xA, yA, xB, yB, vertices, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            if (xA === xB) {
                xA = xB + 0.01;
            }
            if (yA === yB) {
                yA = yB + 0.01;
            }
            var l = vertices.length;
            var dXAB = xA - xB;
            var dYAB = yA - yB;
            var llAB = xA * yB - yA * xB;
            var intersectionCount = 0;
            var xC = vertices[l - 2];
            var yC = vertices[l - 1];
            var dMin = 0.0;
            var dMax = 0.0;
            var xMin = 0.0;
            var yMin = 0.0;
            var xMax = 0.0;
            var yMax = 0.0;
            for (var i = 0; i < l; i += 2) {
                var xD = vertices[i];
                var yD = vertices[i + 1];
                if (xC === xD) {
                    xC = xD + 0.01;
                }
                if (yC === yD) {
                    yC = yD + 0.01;
                }
                var dXCD = xC - xD;
                var dYCD = yC - yD;
                var llCD = xC * yD - yC * xD;
                var ll = dXAB * dYCD - dYAB * dXCD;
                var x = (llAB * dXCD - dXAB * llCD) / ll;
                if (((x >= xC && x <= xD) || (x >= xD && x <= xC)) && (dXAB === 0 || (x >= xA && x <= xB) || (x >= xB && x <= xA))) {
                    var y = (llAB * dYCD - dYAB * llCD) / ll;
                    if (((y >= yC && y <= yD) || (y >= yD && y <= yC)) && (dYAB === 0 || (y >= yA && y <= yB) || (y >= yB && y <= yA))) {
                        if (intersectionPointB) {
                            var d = x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }
                            if (intersectionCount === 0) {
                                dMin = d;
                                dMax = d;
                                xMin = x;
                                yMin = y;
                                xMax = x;
                                yMax = y;
                                if (normalRadians) {
                                    normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    normalRadians.y = normalRadians.x;
                                }
                            }
                            else {
                                if (d < dMin) {
                                    dMin = d;
                                    xMin = x;
                                    yMin = y;
                                    if (normalRadians) {
                                        normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }
                                if (d > dMax) {
                                    dMax = d;
                                    xMax = x;
                                    yMax = y;
                                    if (normalRadians) {
                                        normalRadians.y = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                    }
                                }
                            }
                            intersectionCount++;
                        }
                        else {
                            xMin = x;
                            yMin = y;
                            xMax = x;
                            yMax = y;
                            intersectionCount++;
                            if (normalRadians) {
                                normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                normalRadians.y = normalRadians.x;
                            }
                            break;
                        }
                    }
                }
                xC = xD;
                yC = yD;
            }
            if (intersectionCount === 1) {
                if (intersectionPointA) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }
                if (intersectionPointB) {
                    intersectionPointB.x = xMin;
                    intersectionPointB.y = yMin;
                }
                if (normalRadians) {
                    normalRadians.y = normalRadians.x + Math.PI;
                }
            }
            else if (intersectionCount > 1) {
                intersectionCount++;
                if (intersectionPointA) {
                    intersectionPointA.x = xMin;
                    intersectionPointA.y = yMin;
                }
                if (intersectionPointB) {
                    intersectionPointB.x = xMax;
                    intersectionPointB.y = yMax;
                }
            }
            return intersectionCount;
        };
        /**
         * @private
         */
        BoundingBoxData.prototype._onClear = function () {
            this.type = -1 /* None */;
            this.color = 0x000000;
            this.x = 0.0;
            this.y = 0.0;
            this.width = 0.0;
            this.height = 0.0;
            this.vertices.length = 0;
        };
        /**
         * @language zh_CN
         * 是否包含点。
         * @version DragonBones 5.0
         */
        BoundingBoxData.prototype.containsPoint = function (pX, pY) {
            var isInSide = false;
            if (this.type === 2 /* Polygon */) {
                if (pX >= this.x && pX <= this.width && pY >= this.y && pY <= this.height) {
                    for (var i = 0, l = this.vertices.length, iP = l - 2; i < l; i += 2) {
                        var yA = this.vertices[iP + 1];
                        var yB = this.vertices[i + 1];
                        if ((yB < pY && yA >= pY) || (yA < pY && yB >= pY)) {
                            var xA = this.vertices[iP];
                            var xB = this.vertices[i];
                            if ((pY - yB) * (xA - xB) / (yA - yB) + xB < pX) {
                                isInSide = !isInSide;
                            }
                        }
                        iP = i;
                    }
                }
            }
            else {
                var widthH = this.width * 0.5;
                if (pX >= -widthH && pX <= widthH) {
                    var heightH = this.height * 0.5;
                    if (pY >= -heightH && pY <= heightH) {
                        if (this.type === 1 /* Ellipse */) {
                            pY *= widthH / heightH;
                            isInSide = Math.sqrt(pX * pX + pY * pY) <= widthH;
                        }
                        else {
                            isInSide = true;
                        }
                    }
                }
            }
            return isInSide;
        };
        /**
         * @language zh_CN
         * 是否与线段相交。
         * @version DragonBones 5.0
         */
        BoundingBoxData.prototype.intersectsSegment = function (xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            var intersectionCount = 0;
            switch (this.type) {
                case 0 /* Rectangle */:
                    var widthH = this.width * 0.5;
                    var heightH = this.height * 0.5;
                    intersectionCount = BoundingBoxData.segmentIntersectsRectangle(xA, yA, xB, yB, -widthH, -heightH, widthH, heightH, intersectionPointA, intersectionPointB, normalRadians);
                    break;
                case 1 /* Ellipse */:
                    intersectionCount = BoundingBoxData.segmentIntersectsEllipse(xA, yA, xB, yB, 0.0, 0.0, this.width * 0.5, this.height * 0.5, intersectionPointA, intersectionPointB, normalRadians);
                    break;
                case 2 /* Polygon */:
                    if (BoundingBoxData.segmentIntersectsRectangle(xA, yA, xB, yB, this.x, this.y, this.width, this.height, null, null) !== 0) {
                        intersectionCount = BoundingBoxData.segmentIntersectsPolygon(xA, yA, xB, yB, this.vertices, intersectionPointA, intersectionPointB, normalRadians);
                    }
                    break;
                default:
                    break;
            }
            return intersectionCount;
        };
        return BoundingBoxData;
    }(dragonBones.BaseObject));
    dragonBones.BoundingBoxData = BoundingBoxData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 自定义数据。
     * @version DragonBones 5.0
     */
    var CustomData = (function (_super) {
        __extends(CustomData, _super);
        /**
         * @internal
         * @private
         */
        function CustomData() {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 自定义整数。
             * @version DragonBones 5.0
             */
            _this.ints = [];
            /**
             * @language zh_CN
             * 自定义浮点数。
             * @version DragonBones 5.0
             */
            _this.floats = [];
            /**
             * @language zh_CN
             * 自定义字符串。
             * @version DragonBones 5.0
             */
            _this.strings = [];
            return _this;
        }
        /**
         * @private
         */
        CustomData.toString = function () {
            return "[class dragonBones.CustomData]";
        };
        /**
         * @private
         */
        CustomData.prototype._onClear = function () {
            this.ints.length = 0;
            this.floats.length = 0;
            this.strings.length = 0;
        };
        /**
         * @language zh_CN
         * 获取自定义整数。
         * @version DragonBones 5.0
         */
        CustomData.prototype.getInt = function (index) {
            if (index === void 0) { index = 0; }
            return index >= 0 && index < this.ints.length ? this.ints[index] : 0;
        };
        /**
         * @language zh_CN
         * 获取自定义浮点数。
         * @version DragonBones 5.0
         */
        CustomData.prototype.getFloat = function (index) {
            if (index === void 0) { index = 0; }
            return index >= 0 && index < this.floats.length ? this.floats[index] : 0;
        };
        /**
         * @language zh_CN
         * 获取自定义字符串。
         * @version DragonBones 5.0
         */
        CustomData.prototype.getString = function (index) {
            if (index === void 0) { index = 0; }
            return index >= 0 && index < this.strings.length ? this.strings[index] : null;
        };
        return CustomData;
    }(dragonBones.BaseObject));
    dragonBones.CustomData = CustomData;
    /**
     * @private
     */
    var EventData = (function (_super) {
        __extends(EventData, _super);
        function EventData() {
            return _super.call(this) || this;
        }
        EventData.toString = function () {
            return "[class dragonBones.EventData]";
        };
        EventData.prototype._onClear = function () {
            if (this.data) {
                this.data.returnToPool();
            }
            this.type = -1 /* None */;
            this.name = null;
            this.bone = null;
            this.slot = null;
            this.data = null;
        };
        return EventData;
    }(dragonBones.BaseObject));
    dragonBones.EventData = EventData;
    /**
     * @private
     */
    var ActionData = (function (_super) {
        __extends(ActionData, _super);
        function ActionData() {
            return _super.call(this) || this;
        }
        ActionData.toString = function () {
            return "[class dragonBones.ActionData]";
        };
        ActionData.prototype._onClear = function () {
            if (this.animationConfig) {
                this.animationConfig.returnToPool();
            }
            this.type = -1 /* None */;
            this.bone = null;
            this.slot = null;
            this.animationConfig = null;
        };
        return ActionData;
    }(dragonBones.BaseObject));
    dragonBones.ActionData = ActionData;
    /**
     * @language zh_CN
     * 龙骨数据。
     * 一个龙骨数据包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    var DragonBonesData = (function (_super) {
        __extends(DragonBonesData, _super);
        /**
         * @internal
         * @private
         */
        function DragonBonesData() {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 所有骨架数据。
             * @see dragonBones.ArmatureData
             * @version DragonBones 3.0
             */
            _this.armatures = {};
            /**
             * @private
             */
            _this.cachedFrames = [];
            _this._armatureNames = [];
            return _this;
        }
        /**
         * @private
         */
        DragonBonesData.toString = function () {
            return "[class dragonBones.DragonBonesData]";
        };
        /**
         * @private
         */
        DragonBonesData.prototype._onClear = function () {
            if (dragonBones.DragonBones.debug) {
                for (var i = 0, l = dragonBones.DragonBones._armatures.length; i < l; ++i) {
                    var armature = dragonBones.DragonBones._armatures[i];
                    if (armature.armatureData.parent === this) {
                        throw new Error("The DragonBonesData is being used, please make sure all armature references to the data have been deleted.");
                    }
                }
            }
            for (var k in this.armatures) {
                this.armatures[k].returnToPool();
                delete this.armatures[k];
            }
            if (this.userData) {
                this.userData.returnToPool();
            }
            this.autoSearch = false;
            this.frameRate = 0;
            this.name = null;
            //this.armatures.clear();
            this.cachedFrames.length = 0;
            this.userData = null;
            this._armatureNames.length = 0;
        };
        /**
         * @private
         */
        DragonBonesData.prototype.addArmature = function (value) {
            if (value && value.name && !this.armatures[value.name]) {
                this.armatures[value.name] = value;
                this._armatureNames.push(value.name);
                value.parent = this;
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @language zh_CN
         * 获取骨架。
         * @param name 骨架数据名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        DragonBonesData.prototype.getArmature = function (name) {
            return this.armatures[name];
        };
        Object.defineProperty(DragonBonesData.prototype, "armatureNames", {
            /**
             * @language zh_CN
             * 所有骨架数据名称。
             * @see #armatures
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armatureNames;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        DragonBonesData.prototype.dispose = function () {
            this.returnToPool();
        };
        return DragonBonesData;
    }(dragonBones.BaseObject));
    dragonBones.DragonBonesData = DragonBonesData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 贴图集数据。
     * @version DragonBones 3.0
     */
    var TextureAtlasData = (function (_super) {
        __extends(TextureAtlasData, _super);
        /**
         * @internal
         * @private
         */
        function TextureAtlasData() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.textures = {};
            return _this;
        }
        /**
         * @private
         */
        TextureAtlasData.prototype._onClear = function () {
            for (var k in this.textures) {
                this.textures[k].returnToPool();
                delete this.textures[k];
            }
            this.autoSearch = false;
            this.scale = 1.0;
            this.width = 0.0;
            this.height = 0.0;
            //this.textures.clear();
            this.name = null;
            this.imagePath = null;
        };
        /**
         * @private
         */
        TextureAtlasData.prototype.addTexture = function (value) {
            if (value && value.name && !this.textures[value.name]) {
                this.textures[value.name] = value;
                value.parent = this;
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @private
         */
        TextureAtlasData.prototype.getTexture = function (name) {
            return this.textures[name];
        };
        /**
         * @private
         */
        TextureAtlasData.prototype.copyFrom = function (value) {
            this.autoSearch = value.autoSearch;
            this.scale = value.scale;
            this.width = value.width;
            this.height = value.height;
            this.name = value.name;
            this.imagePath = value.imagePath;
            for (var k in this.textures) {
                this.textures[k].returnToPool();
                delete this.textures[k];
            }
            for (var k in value.textures) {
                var texture = this.generateTexture();
                texture.copyFrom(value.textures[k]);
                this.textures[k] = texture;
            }
        };
        return TextureAtlasData;
    }(dragonBones.BaseObject));
    dragonBones.TextureAtlasData = TextureAtlasData;
    /**
     * @private
     */
    var TextureData = (function (_super) {
        __extends(TextureData, _super);
        function TextureData() {
            var _this = _super.call(this) || this;
            _this.region = new dragonBones.Rectangle();
            return _this;
        }
        TextureData.generateRectangle = function () {
            return new dragonBones.Rectangle();
        };
        TextureData.prototype._onClear = function () {
            this.rotated = false;
            this.name = null;
            this.region.clear();
            this.frame = null;
            this.parent = null;
        };
        TextureData.prototype.copyFrom = function (value) {
            this.rotated = value.rotated;
            this.name = value.name;
            if (!this.frame && value.frame) {
                this.frame = TextureData.generateRectangle();
            }
            else if (this.frame && !value.frame) {
                this.frame = null;
            }
            if (this.frame && value.frame) {
                this.frame.copyFrom(value.frame);
            }
            this.parent = value.parent;
            this.region.copyFrom(value.region);
        };
        return TextureData;
    }(dragonBones.BaseObject));
    dragonBones.TextureData = TextureData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var DataParser = (function () {
        function DataParser() {
            this._isOldData = false; // For 2.x ~ 3.x
            this._isGlobalTransform = false; // For 2.x ~ 3.x
            this._isAutoTween = false; // For 2.x ~ 3.x
            this._animationTweenEasing = 0.0; // For 2.x ~ 3.x
            this._timelinePivot = new dragonBones.Point(); // For 2.x ~ 3.x
            this._helpPoint = new dragonBones.Point();
            this._helpTransformA = new dragonBones.Transform();
            this._helpTransformB = new dragonBones.Transform();
            this._helpMatrix = new dragonBones.Matrix();
            this._rawBones = []; // For skinned mesh
            this._data = null;
            this._armature = null;
            this._skin = null;
            this._skinSlotData = null;
            this._animation = null;
            this._timeline = null;
        }
        DataParser._getArmatureType = function (value) {
            switch (value.toLowerCase()) {
                case "stage":
                    return 2 /* Stage */;
                case "armature":
                    return 0 /* Armature */;
                case "movieclip":
                    return 1 /* MovieClip */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser._getDisplayType = function (value) {
            switch (value.toLowerCase()) {
                case "image":
                    return 0 /* Image */;
                case "mesh":
                    return 2 /* Mesh */;
                case "armature":
                    return 1 /* Armature */;
                case "boundingbox":
                    return 3 /* BoundingBox */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser._getBoundingBoxType = function (value) {
            switch (value.toLowerCase()) {
                case "rectangle":
                    return 0 /* Rectangle */;
                case "ellipse":
                    return 1 /* Ellipse */;
                case "polygon":
                    return 2 /* Polygon */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser._getBlendMode = function (value) {
            switch (value.toLowerCase()) {
                case "normal":
                    return 0 /* Normal */;
                case "add":
                    return 1 /* Add */;
                case "alpha":
                    return 2 /* Alpha */;
                case "darken":
                    return 3 /* Darken */;
                case "difference":
                    return 4 /* Difference */;
                case "erase":
                    return 5 /* Erase */;
                case "hardlight":
                    return 6 /* HardLight */;
                case "invert":
                    return 7 /* Invert */;
                case "layer":
                    return 8 /* Layer */;
                case "lighten":
                    return 9 /* Lighten */;
                case "multiply":
                    return 10 /* Multiply */;
                case "overlay":
                    return 11 /* Overlay */;
                case "screen":
                    return 12 /* Screen */;
                case "subtract":
                    return 13 /* Subtract */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser._getActionType = function (value) {
            switch (value.toLowerCase()) {
                case "play":
                case "gotoandplay":
                    return 0 /* Play */;
                default:
                    return -1 /* None */;
            }
        };
        DataParser.prototype._getTimelineFrameMatrix = function (animation, timeline, position, transform) {
            var frameIndex = Math.floor(position * animation.frameCount / animation.duration);
            if (timeline.frames.length === 1 || frameIndex >= timeline.frames.length) {
                transform.copyFrom(timeline.frames[0].transform);
            }
            else {
                var frame = timeline.frames[frameIndex];
                var tweenProgress = 0.0;
                if (frame.tweenEasing !== dragonBones.DragonBones.NO_TWEEN) {
                    tweenProgress = (position - frame.position) / frame.duration;
                    if (frame.tweenEasing !== 0.0) {
                        tweenProgress = dragonBones.TweenTimelineState._getEasingValue(tweenProgress, frame.tweenEasing);
                    }
                }
                else if (frame.curve) {
                    tweenProgress = (position - frame.position) / frame.duration;
                    tweenProgress = dragonBones.TweenTimelineState._getEasingCurveValue(tweenProgress, frame.curve);
                }
                var nextFrame = frame.next;
                transform.x = nextFrame.transform.x - frame.transform.x;
                transform.y = nextFrame.transform.y - frame.transform.y;
                transform.skewX = dragonBones.Transform.normalizeRadian(nextFrame.transform.skewX - frame.transform.skewX);
                transform.skewY = dragonBones.Transform.normalizeRadian(nextFrame.transform.skewY - frame.transform.skewY);
                transform.scaleX = nextFrame.transform.scaleX - frame.transform.scaleX;
                transform.scaleY = nextFrame.transform.scaleY - frame.transform.scaleY;
                transform.x = frame.transform.x + transform.x * tweenProgress;
                transform.y = frame.transform.y + transform.y * tweenProgress;
                transform.skewX = frame.transform.skewX + transform.skewX * tweenProgress;
                transform.skewY = frame.transform.skewY + transform.skewY * tweenProgress;
                transform.scaleX = frame.transform.scaleX + transform.scaleX * tweenProgress;
                transform.scaleY = frame.transform.scaleY + transform.scaleY * tweenProgress;
            }
            transform.add(timeline.originalTransform);
        };
        DataParser.prototype._globalToLocal = function (armature) {
            var keyFrames = new Array();
            var bones = armature.sortedBones.concat().reverse();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                if (bone.parent) {
                    bone.parent.transform.toMatrix(this._helpMatrix);
                    this._helpMatrix.invert();
                    this._helpMatrix.transformPoint(bone.transform.x, bone.transform.y, this._helpPoint);
                    bone.transform.x = this._helpPoint.x;
                    bone.transform.y = this._helpPoint.y;
                    bone.transform.rotation -= bone.parent.transform.rotation;
                }
                for (var i_1 in armature.animations) {
                    var animation = armature.animations[i_1];
                    var timeline = animation.getBoneTimeline(bone.name);
                    if (!timeline) {
                        continue;
                    }
                    var parentTimeline = bone.parent ? animation.getBoneTimeline(bone.parent.name) : null;
                    this._helpTransformB.copyFrom(timeline.originalTransform);
                    keyFrames.length = 0;
                    for (var i_2 = 0, l_1 = timeline.frames.length; i_2 < l_1; ++i_2) {
                        var frame = timeline.frames[i_2];
                        if (keyFrames.indexOf(frame) >= 0) {
                            continue;
                        }
                        keyFrames.push(frame);
                        if (parentTimeline) {
                            this._getTimelineFrameMatrix(animation, parentTimeline, frame.position, this._helpTransformA);
                            frame.transform.add(this._helpTransformB);
                            this._helpTransformA.toMatrix(this._helpMatrix);
                            this._helpMatrix.invert();
                            this._helpMatrix.transformPoint(frame.transform.x, frame.transform.y, this._helpPoint);
                            frame.transform.x = this._helpPoint.x;
                            frame.transform.y = this._helpPoint.y;
                            frame.transform.rotation -= this._helpTransformA.rotation;
                        }
                        else {
                            frame.transform.add(this._helpTransformB);
                        }
                        frame.transform.minus(bone.transform);
                        if (i_2 === 0) {
                            timeline.originalTransform.copyFrom(frame.transform);
                            frame.transform.identity();
                        }
                        else {
                            frame.transform.minus(timeline.originalTransform);
                        }
                    }
                }
            }
        };
        DataParser.prototype._mergeFrameToAnimationTimeline = function (framePostion, actions, events) {
            var frameStart = Math.floor(framePostion * this._armature.frameRate); // uint()
            var frames = this._animation.frames;
            if (frames.length === 0) {
                var startFrame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData); // Add start frame.
                startFrame.position = 0.0;
                if (this._animation.frameCount > 1) {
                    frames.length = this._animation.frameCount + 1; // One more count for zero duration frame.
                    var endFrame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData); // Add end frame to keep animation timeline has two different frames atleast.
                    endFrame.position = this._animation.frameCount / this._armature.frameRate;
                    frames[0] = startFrame;
                    frames[this._animation.frameCount] = endFrame;
                }
            }
            var insertedFrame = null;
            var replacedFrame = frames[frameStart];
            if (replacedFrame && (frameStart === 0 || frames[frameStart - 1] === replacedFrame.prev)) {
                insertedFrame = replacedFrame;
            }
            else {
                insertedFrame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData); // Create frame.
                insertedFrame.position = frameStart / this._armature.frameRate;
                frames[frameStart] = insertedFrame;
                for (var i = frameStart + 1, l = frames.length; i < l; ++i) {
                    if (replacedFrame && frames[i] === replacedFrame) {
                        frames[i] = null;
                    }
                }
            }
            if (actions) {
                for (var i = 0, l = actions.length; i < l; ++i) {
                    insertedFrame.actions.push(actions[i]);
                }
            }
            if (events) {
                for (var i = 0, l = events.length; i < l; ++i) {
                    insertedFrame.events.push(events[i]);
                }
            }
            // Modify frame link and duration.
            var prevFrame = null;
            var nextFrame = null;
            for (var i = 0, l = frames.length; i < l; ++i) {
                var currentFrame = frames[i];
                if (currentFrame && nextFrame !== currentFrame) {
                    nextFrame = currentFrame;
                    if (prevFrame) {
                        nextFrame.prev = prevFrame;
                        prevFrame.next = nextFrame;
                        prevFrame.duration = nextFrame.position - prevFrame.position;
                    }
                    prevFrame = nextFrame;
                }
                else {
                    frames[i] = prevFrame;
                }
            }
            nextFrame.duration = this._animation.duration - nextFrame.position;
            nextFrame = frames[0];
            prevFrame.next = nextFrame;
            nextFrame.prev = prevFrame;
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        DataParser.parseDragonBonesData = function (rawData) {
            return dragonBones.ObjectDataParser.getInstance().parseDragonBonesData(rawData);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parsetTextureAtlasData()
         */
        DataParser.parseTextureAtlasData = function (rawData, scale) {
            if (scale === void 0) { scale = 1; }
            var textureAtlasData = {};
            var subTextureList = rawData[DataParser.SUB_TEXTURE];
            for (var i = 0, len = subTextureList.length; i < len; i++) {
                var subTextureObject = subTextureList[i];
                var subTextureName = subTextureObject[DataParser.NAME];
                var subTextureRegion = new dragonBones.Rectangle();
                var subTextureFrame = null;
                subTextureRegion.x = subTextureObject[DataParser.X] / scale;
                subTextureRegion.y = subTextureObject[DataParser.Y] / scale;
                subTextureRegion.width = subTextureObject[DataParser.WIDTH] / scale;
                subTextureRegion.height = subTextureObject[DataParser.HEIGHT] / scale;
                if (DataParser.FRAME_WIDTH in subTextureObject) {
                    subTextureFrame = new dragonBones.Rectangle();
                    subTextureFrame.x = subTextureObject[DataParser.FRAME_X] / scale;
                    subTextureFrame.y = subTextureObject[DataParser.FRAME_Y] / scale;
                    subTextureFrame.width = subTextureObject[DataParser.FRAME_WIDTH] / scale;
                    subTextureFrame.height = subTextureObject[DataParser.FRAME_HEIGHT] / scale;
                }
                textureAtlasData[subTextureName] = { region: subTextureRegion, frame: subTextureFrame, rotated: false };
            }
            return textureAtlasData;
        };
        return DataParser;
    }());
    DataParser.DATA_VERSION_2_3 = "2.3";
    DataParser.DATA_VERSION_3_0 = "3.0";
    DataParser.DATA_VERSION_4_0 = "4.0";
    DataParser.DATA_VERSION_4_5 = "4.5";
    DataParser.DATA_VERSION_5_0 = "5.0";
    DataParser.DATA_VERSION = DataParser.DATA_VERSION_5_0;
    DataParser.DATA_VERSIONS = [
        DataParser.DATA_VERSION_5_0,
        DataParser.DATA_VERSION_4_5,
        DataParser.DATA_VERSION_4_0,
        DataParser.DATA_VERSION_3_0,
        DataParser.DATA_VERSION_2_3
    ];
    DataParser.TEXTURE_ATLAS = "TextureAtlas";
    DataParser.SUB_TEXTURE = "SubTexture";
    DataParser.FORMAT = "format";
    DataParser.IMAGE_PATH = "imagePath";
    DataParser.WIDTH = "width";
    DataParser.HEIGHT = "height";
    DataParser.ROTATED = "rotated";
    DataParser.FRAME_X = "frameX";
    DataParser.FRAME_Y = "frameY";
    DataParser.FRAME_WIDTH = "frameWidth";
    DataParser.FRAME_HEIGHT = "frameHeight";
    DataParser.DRADON_BONES = "dragonBones";
    DataParser.ARMATURE = "armature";
    DataParser.BONE = "bone";
    DataParser.IK = "ik";
    DataParser.SLOT = "slot";
    DataParser.SKIN = "skin";
    DataParser.DISPLAY = "display";
    DataParser.ANIMATION = "animation";
    DataParser.Z_ORDER = "zOrder";
    DataParser.FFD = "ffd";
    DataParser.FRAME = "frame";
    DataParser.ACTIONS = "actions";
    DataParser.EVENTS = "events";
    DataParser.INTS = "ints";
    DataParser.FLOATS = "floats";
    DataParser.STRINGS = "strings";
    DataParser.PIVOT = "pivot";
    DataParser.TRANSFORM = "transform";
    DataParser.AABB = "aabb";
    DataParser.COLOR = "color";
    DataParser.VERSION = "version";
    DataParser.COMPATIBLE_VERSION = "compatibleVersion";
    DataParser.FRAME_RATE = "frameRate";
    DataParser.TYPE = "type";
    DataParser.SUB_TYPE = "subType";
    DataParser.NAME = "name";
    DataParser.PARENT = "parent";
    DataParser.TARGET = "target";
    DataParser.SHARE = "share";
    DataParser.PATH = "path";
    DataParser.LENGTH = "length";
    DataParser.DISPLAY_INDEX = "displayIndex";
    DataParser.BLEND_MODE = "blendMode";
    DataParser.INHERIT_TRANSLATION = "inheritTranslation";
    DataParser.INHERIT_ROTATION = "inheritRotation";
    DataParser.INHERIT_SCALE = "inheritScale";
    DataParser.INHERIT_ANIMATION = "inheritAnimation";
    DataParser.INHERIT_FFD = "inheritFFD";
    DataParser.BEND_POSITIVE = "bendPositive";
    DataParser.CHAIN = "chain";
    DataParser.WEIGHT = "weight";
    DataParser.FADE_IN_TIME = "fadeInTime";
    DataParser.PLAY_TIMES = "playTimes";
    DataParser.SCALE = "scale";
    DataParser.OFFSET = "offset";
    DataParser.POSITION = "position";
    DataParser.DURATION = "duration";
    DataParser.TWEEN_TYPE = "tweenType";
    DataParser.TWEEN_EASING = "tweenEasing";
    DataParser.TWEEN_ROTATE = "tweenRotate";
    DataParser.TWEEN_SCALE = "tweenScale";
    DataParser.CURVE = "curve";
    DataParser.EVENT = "event";
    DataParser.SOUND = "sound";
    DataParser.ACTION = "action";
    DataParser.DEFAULT_ACTIONS = "defaultActions";
    DataParser.X = "x";
    DataParser.Y = "y";
    DataParser.SKEW_X = "skX";
    DataParser.SKEW_Y = "skY";
    DataParser.SCALE_X = "scX";
    DataParser.SCALE_Y = "scY";
    DataParser.ALPHA_OFFSET = "aO";
    DataParser.RED_OFFSET = "rO";
    DataParser.GREEN_OFFSET = "gO";
    DataParser.BLUE_OFFSET = "bO";
    DataParser.ALPHA_MULTIPLIER = "aM";
    DataParser.RED_MULTIPLIER = "rM";
    DataParser.GREEN_MULTIPLIER = "gM";
    DataParser.BLUE_MULTIPLIER = "bM";
    DataParser.UVS = "uvs";
    DataParser.VERTICES = "vertices";
    DataParser.TRIANGLES = "triangles";
    DataParser.WEIGHTS = "weights";
    DataParser.SLOT_POSE = "slotPose";
    DataParser.BONE_POSE = "bonePose";
    DataParser.COLOR_TRANSFORM = "colorTransform";
    DataParser.TIMELINE = "timeline";
    DataParser.IS_GLOBAL = "isGlobal";
    DataParser.PIVOT_X = "pX";
    DataParser.PIVOT_Y = "pY";
    DataParser.Z = "z";
    DataParser.LOOP = "loop";
    DataParser.AUTO_TWEEN = "autoTween";
    DataParser.HIDE = "hide";
    DataParser.DEFAULT_NAME = "__default";
    dragonBones.DataParser = DataParser;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var ObjectDataParser = (function (_super) {
        __extends(ObjectDataParser, _super);
        /**
         * @private
         */
        function ObjectDataParser() {
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        ObjectDataParser._getBoolean = function (rawData, key, defaultValue) {
            if (key in rawData) {
                var value = rawData[key];
                var valueType = typeof value;
                if (valueType === "boolean") {
                    return value;
                }
                else if (valueType === "string") {
                    switch (value) {
                        case "0":
                        case "NaN":
                        case "":
                        case "false":
                        case "null":
                        case "undefined":
                            return false;
                        default:
                            return true;
                    }
                }
                else {
                    return !!value;
                }
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser._getNumber = function (rawData, key, defaultValue) {
            if (key in rawData) {
                var value = rawData[key];
                if (value == null || value === "NaN") {
                    return defaultValue;
                }
                return +value || 0;
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser._getString = function (rawData, key, defaultValue) {
            if (key in rawData) {
                return String(rawData[key]);
            }
            return defaultValue;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseArmature = function (rawData, scale) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.ArmatureData);
            armature.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            armature.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, this._data.frameRate);
            armature.scale = scale;
            if (armature.frameRate === 0) {
                armature.frameRate = 24;
            }
            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] === "string") {
                armature.type = ObjectDataParser._getArmatureType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                armature.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* Armature */);
            }
            this._armature = armature;
            this._rawBones.length = 0;
            if (ObjectDataParser.AABB in rawData) {
                var rawAABB = rawData[ObjectDataParser.AABB];
                armature.aabb.x = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.X, 0);
                armature.aabb.y = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.Y, 0);
                armature.aabb.width = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.WIDTH, 0);
                armature.aabb.height = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.HEIGHT, 0);
            }
            if (ObjectDataParser.BONE in rawData) {
                var rawBones = rawData[ObjectDataParser.BONE];
                for (var i = 0, l = rawBones.length; i < l; ++i) {
                    var rawBone = rawBones[i];
                    var bone = this._parseBone(rawBone);
                    armature.addBone(bone, ObjectDataParser._getString(rawBone, ObjectDataParser.PARENT, null));
                    this._rawBones.push(bone);
                }
            }
            if (ObjectDataParser.IK in rawData) {
                var rawIKS = rawData[ObjectDataParser.IK];
                for (var i = 0, l = rawIKS.length; i < l; ++i) {
                    this._parseIK(rawIKS[i]);
                }
            }
            if (ObjectDataParser.SLOT in rawData) {
                var rawSlots = rawData[ObjectDataParser.SLOT];
                var zOrder = 0;
                for (var i = 0, l = rawSlots.length; i < l; ++i) {
                    armature.addSlot(this._parseSlot(rawSlots[i], zOrder++));
                }
            }
            if (ObjectDataParser.SKIN in rawData) {
                var rawSkins = rawData[ObjectDataParser.SKIN];
                for (var i = 0, l = rawSkins.length; i < l; ++i) {
                    armature.addSkin(this._parseSkin(rawSkins[i]));
                }
            }
            if (ObjectDataParser.ANIMATION in rawData) {
                var rawAnimations = rawData[ObjectDataParser.ANIMATION];
                for (var i = 0, l = rawAnimations.length; i < l; ++i) {
                    armature.addAnimation(this._parseAnimation(rawAnimations[i]));
                }
            }
            if ((ObjectDataParser.ACTIONS in rawData) ||
                (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
                this._parseActionData(rawData, armature.actions, null, null);
            }
            if (this._isOldData && this._isGlobalTransform) {
                this._globalToLocal(armature);
            }
            this._armature = null;
            this._rawBones.length = 0;
            return armature;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBone = function (rawData) {
            var bone = dragonBones.BaseObject.borrowObject(dragonBones.BoneData);
            bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_TRANSLATION, true);
            bone.inheritRotation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ROTATION, true);
            bone.inheritScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_SCALE, true);
            bone.length = ObjectDataParser._getNumber(rawData, ObjectDataParser.LENGTH, 0) * this._armature.scale;
            bone.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], bone.transform);
            }
            if (this._isOldData) {
                bone.inheritScale = false;
            }
            return bone;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseIK = function (rawData) {
            var bone = this._armature.getBone(ObjectDataParser._getString(rawData, (ObjectDataParser.BONE in rawData) ? ObjectDataParser.BONE : ObjectDataParser.NAME, null));
            if (bone) {
                bone.bendPositive = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true);
                bone.chain = ObjectDataParser._getNumber(rawData, ObjectDataParser.CHAIN, 0);
                bone.weight = ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1.0);
                bone.ik = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.TARGET, null));
                if (bone.chain > 0 && bone.parent && !bone.parent.ik) {
                    bone.parent.ik = bone.ik;
                    bone.parent.chainIndex = 0;
                    bone.parent.chain = 0;
                    bone.chainIndex = 1;
                }
                else {
                    bone.chain = 0;
                    bone.chainIndex = 0;
                }
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlot = function (rawData, zOrder) {
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.SlotData);
            slot.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            slot.zOrder = ObjectDataParser._getNumber(rawData, ObjectDataParser.Z, zOrder); // Support 2.x ~ 3.x data.
            slot.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, null));
            if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) {
                slot.color = dragonBones.SlotData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
            }
            else {
                slot.color = dragonBones.SlotData.DEFAULT_COLOR;
            }
            if (ObjectDataParser.BLEND_MODE in rawData && typeof rawData[ObjectDataParser.BLEND_MODE] === "string") {
                slot.blendMode = ObjectDataParser._getBlendMode(rawData[ObjectDataParser.BLEND_MODE]);
            }
            else {
                slot.blendMode = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLEND_MODE, 0 /* Normal */);
            }
            if ((ObjectDataParser.ACTIONS in rawData) || (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
                this._parseActionData(rawData, slot.actions, null, null);
            }
            if (this._isOldData) {
                if (ObjectDataParser.COLOR_TRANSFORM in rawData) {
                    slot.color = dragonBones.SlotData.generateColor();
                    this._parseColorTransform(rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
                }
                else {
                    slot.color = dragonBones.SlotData.DEFAULT_COLOR;
                }
            }
            return slot;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSkin = function (rawData) {
            var skin = dragonBones.BaseObject.borrowObject(dragonBones.SkinData);
            skin.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);
            if (!skin.name) {
                skin.name = ObjectDataParser.DEFAULT_NAME;
            }
            if (ObjectDataParser.SLOT in rawData) {
                this._skin = skin;
                var slots = rawData[ObjectDataParser.SLOT];
                var zOrder = 0;
                for (var i = 0, l = slots.length; i < l; ++i) {
                    if (this._isOldData) {
                        this._armature.addSlot(this._parseSlot(slots[i], zOrder++));
                    }
                    skin.addSlot(this._parseSkinSlotData(slots[i]));
                }
                this._skin = null;
            }
            return skin;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSkinSlotData = function (rawData) {
            var skinSlotData = dragonBones.BaseObject.borrowObject(dragonBones.SkinSlotData);
            skinSlotData.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
            if (ObjectDataParser.DISPLAY in rawData) {
                var rawDisplays = rawData[ObjectDataParser.DISPLAY];
                this._skinSlotData = skinSlotData;
                for (var i = 0, l = rawDisplays.length; i < l; ++i) {
                    skinSlotData.displays.push(this._parseDisplay(rawDisplays[i]));
                }
                this._skinSlotData = null;
            }
            return skinSlotData;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseDisplay = function (rawData) {
            var display = dragonBones.BaseObject.borrowObject(dragonBones.DisplayData);
            display.inheritAnimation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ANIMATION, true);
            display.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            display.path = ObjectDataParser._getString(rawData, ObjectDataParser.PATH, display.name);
            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] === "string") {
                display.type = ObjectDataParser._getDisplayType(rawData[ObjectDataParser.TYPE]);
            }
            else {
                display.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* Image */);
            }
            display.isRelativePivot = true;
            if (ObjectDataParser.PIVOT in rawData) {
                var pivotObject = rawData[ObjectDataParser.PIVOT];
                display.pivot.x = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.X, 0);
                display.pivot.y = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.Y, 0);
            }
            else if (this._isOldData) {
                var transformObject = rawData[ObjectDataParser.TRANSFORM];
                display.isRelativePivot = false;
                display.pivot.x = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0) * this._armature.scale;
                display.pivot.y = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0) * this._armature.scale;
            }
            else {
                display.pivot.x = 0.5;
                display.pivot.y = 0.5;
            }
            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], display.transform);
            }
            switch (display.type) {
                case 0 /* Image */:
                    break;
                case 1 /* Armature */:
                    break;
                case 2 /* Mesh */:
                    display.share = ObjectDataParser._getString(rawData, ObjectDataParser.SHARE, null);
                    if (!display.share) {
                        display.inheritAnimation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_FFD, true);
                        display.mesh = this._parseMesh(rawData);
                        this._skinSlotData.addMesh(display.mesh);
                    }
                    break;
                case 3 /* BoundingBox */:
                    display.boundingBox = this._parseBoundingBox(rawData);
                    break;
                default:
                    break;
            }
            return display;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseMesh = function (rawData) {
            var mesh = dragonBones.BaseObject.borrowObject(dragonBones.MeshData);
            var rawVertices = rawData[ObjectDataParser.VERTICES];
            var rawUVs = rawData[ObjectDataParser.UVS];
            var rawTriangles = rawData[ObjectDataParser.TRIANGLES];
            var numVertices = Math.floor(rawVertices.length / 2); // uint
            var numTriangles = Math.floor(rawTriangles.length / 3); // uint
            var inverseBindPose = new Array(this._armature.sortedBones.length);
            mesh.skinned = ObjectDataParser.WEIGHTS in rawData && rawData[ObjectDataParser.WEIGHTS].length > 0;
            mesh.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            mesh.uvs.length = numVertices * 2;
            mesh.vertices.length = numVertices * 2;
            mesh.vertexIndices.length = numTriangles * 3;
            if (mesh.skinned) {
                mesh.boneIndices.length = numVertices;
                mesh.weights.length = numVertices;
                mesh.boneVertices.length = numVertices;
                if (ObjectDataParser.SLOT_POSE in rawData) {
                    var rawSlotPose = rawData[ObjectDataParser.SLOT_POSE];
                    mesh.slotPose.a = rawSlotPose[0];
                    mesh.slotPose.b = rawSlotPose[1];
                    mesh.slotPose.c = rawSlotPose[2];
                    mesh.slotPose.d = rawSlotPose[3];
                    mesh.slotPose.tx = rawSlotPose[4] * this._armature.scale;
                    mesh.slotPose.ty = rawSlotPose[5] * this._armature.scale;
                }
                if (ObjectDataParser.BONE_POSE in rawData) {
                    var rawBonePose = rawData[ObjectDataParser.BONE_POSE];
                    for (var i = 0, l = rawBonePose.length; i < l; i += 7) {
                        var rawBoneIndex = rawBonePose[i]; // uint
                        var boneMatrix = inverseBindPose[rawBoneIndex] = new dragonBones.Matrix();
                        boneMatrix.a = rawBonePose[i + 1];
                        boneMatrix.b = rawBonePose[i + 2];
                        boneMatrix.c = rawBonePose[i + 3];
                        boneMatrix.d = rawBonePose[i + 4];
                        boneMatrix.tx = rawBonePose[i + 5] * this._armature.scale;
                        boneMatrix.ty = rawBonePose[i + 6] * this._armature.scale;
                        boneMatrix.invert();
                    }
                }
            }
            for (var i = 0, iW = 0, l = rawVertices.length; i < l; i += 2) {
                var iN = i + 1;
                var vertexIndex = i / 2;
                var x = mesh.vertices[i] = rawVertices[i] * this._armature.scale;
                var y = mesh.vertices[iN] = rawVertices[iN] * this._armature.scale;
                mesh.uvs[i] = rawUVs[i];
                mesh.uvs[iN] = rawUVs[iN];
                if (mesh.skinned) {
                    var rawWeights = rawData[ObjectDataParser.WEIGHTS];
                    var numBones = rawWeights[iW]; // uint
                    var indices = mesh.boneIndices[vertexIndex] = new Array(numBones);
                    var weights = mesh.weights[vertexIndex] = new Array(numBones);
                    var boneVertices = mesh.boneVertices[vertexIndex] = new Array(numBones * 2);
                    mesh.slotPose.transformPoint(x, y, this._helpPoint);
                    x = mesh.vertices[i] = this._helpPoint.x;
                    y = mesh.vertices[iN] = this._helpPoint.y;
                    for (var iB = 0; iB < numBones; ++iB) {
                        var iI = iW + 1 + iB * 2;
                        var rawBoneIndex = rawWeights[iI]; // uint
                        var boneData = this._rawBones[rawBoneIndex];
                        var boneIndex = mesh.bones.indexOf(boneData);
                        if (boneIndex < 0) {
                            boneIndex = mesh.bones.length;
                            mesh.bones[boneIndex] = boneData;
                            mesh.inverseBindPose[boneIndex] = inverseBindPose[rawBoneIndex];
                        }
                        mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint);
                        indices[iB] = boneIndex;
                        weights[iB] = rawWeights[iI + 1];
                        boneVertices[iB * 2] = this._helpPoint.x;
                        boneVertices[iB * 2 + 1] = this._helpPoint.y;
                    }
                    iW += numBones * 2 + 1;
                }
            }
            for (var i = 0, l = rawTriangles.length; i < l; ++i) {
                mesh.vertexIndices[i] = rawTriangles[i];
            }
            return mesh;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBoundingBox = function (rawData) {
            var boundingBox = dragonBones.BaseObject.borrowObject(dragonBones.BoundingBoxData);
            if (ObjectDataParser.SUB_TYPE in rawData && typeof rawData[ObjectDataParser.SUB_TYPE] === "string") {
                boundingBox.type = ObjectDataParser._getBoundingBoxType(rawData[ObjectDataParser.SUB_TYPE]);
            }
            else {
                boundingBox.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.SUB_TYPE, 0 /* Rectangle */);
            }
            boundingBox.color = ObjectDataParser._getNumber(rawData, ObjectDataParser.COLOR, 0x000000);
            switch (boundingBox.type) {
                case 0 /* Rectangle */:
                case 1 /* Ellipse */:
                    boundingBox.width = ObjectDataParser._getNumber(rawData, ObjectDataParser.WIDTH, 0.0);
                    boundingBox.height = ObjectDataParser._getNumber(rawData, ObjectDataParser.HEIGHT, 0.0);
                    break;
                case 2 /* Polygon */:
                    if (ObjectDataParser.VERTICES in rawData) {
                        var rawVertices = rawData[ObjectDataParser.VERTICES];
                        boundingBox.vertices.length = rawVertices.length;
                        for (var i = 0, l = boundingBox.vertices.length; i < l; i += 2) {
                            var iN = i + 1;
                            var x = rawVertices[i];
                            var y = rawVertices[iN];
                            boundingBox.vertices[i] = x;
                            boundingBox.vertices[iN] = y;
                            // AABB.
                            if (i === 0) {
                                boundingBox.x = x;
                                boundingBox.y = y;
                                boundingBox.width = x;
                                boundingBox.height = y;
                            }
                            else {
                                if (x < boundingBox.x) {
                                    boundingBox.x = x;
                                }
                                else if (x > boundingBox.width) {
                                    boundingBox.width = x;
                                }
                                if (y < boundingBox.y) {
                                    boundingBox.y = y;
                                }
                                else if (y > boundingBox.height) {
                                    boundingBox.height = y;
                                }
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            return boundingBox;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseAnimation = function (rawData) {
            var animation = dragonBones.BaseObject.borrowObject(dragonBones.AnimationData);
            animation.frameCount = Math.max(ObjectDataParser._getNumber(rawData, ObjectDataParser.DURATION, 1), 1);
            animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.PLAY_TIMES, 1);
            animation.duration = animation.frameCount / this._armature.frameRate;
            animation.fadeInTime = ObjectDataParser._getNumber(rawData, ObjectDataParser.FADE_IN_TIME, 0);
            animation.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);
            if (!animation.name) {
                animation.name = ObjectDataParser.DEFAULT_NAME;
            }
            this._animation = animation;
            this._parseTimeline(rawData, animation, this._parseAnimationFrame);
            if (ObjectDataParser.Z_ORDER in rawData) {
                animation.zOrderTimeline = dragonBones.BaseObject.borrowObject(dragonBones.ZOrderTimelineData);
                this._parseTimeline(rawData[ObjectDataParser.Z_ORDER], animation.zOrderTimeline, this._parseZOrderFrame);
            }
            if (ObjectDataParser.BONE in rawData) {
                var boneTimelines = rawData[ObjectDataParser.BONE];
                for (var i = 0, l = boneTimelines.length; i < l; ++i) {
                    animation.addBoneTimeline(this._parseBoneTimeline(boneTimelines[i]));
                }
            }
            if (ObjectDataParser.SLOT in rawData) {
                var slotTimelines = rawData[ObjectDataParser.SLOT];
                for (var i = 0, l = slotTimelines.length; i < l; ++i) {
                    animation.addSlotTimeline(this._parseSlotTimeline(slotTimelines[i]));
                }
            }
            if (ObjectDataParser.FFD in rawData) {
                var ffdTimelines = rawData[ObjectDataParser.FFD];
                for (var i = 0, l = ffdTimelines.length; i < l; ++i) {
                    animation.addFFDTimeline(this._parseFFDTimeline(ffdTimelines[i]));
                }
            }
            if (this._isOldData) {
                this._isAutoTween = ObjectDataParser._getBoolean(rawData, ObjectDataParser.AUTO_TWEEN, true);
                this._animationTweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, 0) || 0;
                animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.LOOP, 1);
                if (ObjectDataParser.TIMELINE in rawData) {
                    var timelineObjects = rawData[ObjectDataParser.TIMELINE];
                    for (var i = 0, l = timelineObjects.length; i < l; ++i) {
                        var timelineObject = timelineObjects[i];
                        animation.addBoneTimeline(this._parseBoneTimeline(timelineObject));
                        animation.addSlotTimeline(this._parseSlotTimeline(timelineObject));
                    }
                }
            }
            else {
                this._isAutoTween = false;
                this._animationTweenEasing = 0;
            }
            for (var i in this._armature.bones) {
                var bone = this._armature.bones[i];
                if (!animation.getBoneTimeline(bone.name)) {
                    var boneTimeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineData);
                    var boneFrame = dragonBones.BaseObject.borrowObject(dragonBones.BoneFrameData);
                    boneTimeline.bone = bone;
                    boneTimeline.frames[0] = boneFrame;
                    animation.addBoneTimeline(boneTimeline);
                }
            }
            for (var i in this._armature.slots) {
                var slot = this._armature.slots[i];
                if (!animation.getSlotTimeline(slot.name)) {
                    var slotTimeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineData);
                    var slotFrame = dragonBones.BaseObject.borrowObject(dragonBones.SlotFrameData);
                    slotTimeline.slot = slot;
                    slotFrame.displayIndex = slot.displayIndex;
                    if (slot.color === dragonBones.SlotData.DEFAULT_COLOR) {
                        slotFrame.color = dragonBones.SlotFrameData.DEFAULT_COLOR;
                    }
                    else {
                        slotFrame.color = dragonBones.SlotFrameData.generateColor();
                        slotFrame.color.copyFrom(slot.color);
                    }
                    slotTimeline.frames[0] = slotFrame;
                    animation.addSlotTimeline(slotTimeline);
                    if (this._isOldData) {
                        slotFrame.displayIndex = -1;
                    }
                }
            }
            this._animation = null;
            return animation;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBoneTimeline = function (rawData) {
            var timeline = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineData);
            timeline.bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
            this._parseTimeline(rawData, timeline, this._parseBoneFrame);
            var originalTransform = timeline.originalTransform;
            var prevFrame = null;
            for (var i = 0, l = timeline.frames.length; i < l; ++i) {
                var frame = timeline.frames[i];
                if (!prevFrame) {
                    originalTransform.copyFrom(frame.transform);
                    frame.transform.identity();
                    if (originalTransform.scaleX === 0) {
                        originalTransform.scaleX = 0.001;
                    }
                    if (originalTransform.scaleY === 0) {
                        originalTransform.scaleY = 0.001;
                    }
                }
                else if (prevFrame !== frame) {
                    frame.transform.minus(originalTransform);
                }
                prevFrame = frame;
            }
            if (this._isOldData && (ObjectDataParser.PIVOT_X in rawData || ObjectDataParser.PIVOT_Y in rawData)) {
                this._timelinePivot.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_X, 0.0) * this._armature.scale;
                this._timelinePivot.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_Y, 0.0) * this._armature.scale;
            }
            else {
                this._timelinePivot.clear();
            }
            return timeline;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlotTimeline = function (rawData) {
            var timeline = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineData);
            timeline.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
            this._parseTimeline(rawData, timeline, this._parseSlotFrame);
            return timeline;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseFFDTimeline = function (rawData) {
            var timeline = dragonBones.BaseObject.borrowObject(dragonBones.FFDTimelineData);
            timeline.skin = this._armature.getSkin(ObjectDataParser._getString(rawData, ObjectDataParser.SKIN, null));
            timeline.slot = timeline.skin.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.SLOT, null));
            var meshName = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            for (var i = 0, l = timeline.slot.displays.length; i < l; ++i) {
                var display = timeline.slot.displays[i];
                if (display.mesh && display.name === meshName) {
                    timeline.display = display;
                    break;
                }
            }
            this._parseTimeline(rawData, timeline, this._parseFFDFrame);
            return timeline;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseAnimationFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.AnimationFrameData);
            this._parseFrame(rawData, frame, frameStart, frameCount);
            if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
                this._parseActionData(rawData, frame.actions, null, null);
            }
            if ((ObjectDataParser.EVENTS in rawData) || (ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                this._parseEventData(rawData, frame.events, null, null);
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseZOrderFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.ZOrderFrameData);
            this._parseFrame(rawData, frame, frameStart, frameCount);
            var rawZOrder = rawData[ObjectDataParser.Z_ORDER];
            if (rawZOrder && rawZOrder.length > 0) {
                var slotCount = this._armature.sortedSlots.length;
                var unchanged = new Array(slotCount - rawZOrder.length / 2);
                frame.zOrder.length = slotCount;
                for (var i_3 = 0; i_3 < slotCount; ++i_3) {
                    frame.zOrder[i_3] = -1;
                }
                var originalIndex = 0;
                var unchangedIndex = 0;
                for (var i_4 = 0, l = rawZOrder.length; i_4 < l; i_4 += 2) {
                    var slotIndex = rawZOrder[i_4];
                    var offset = rawZOrder[i_4 + 1];
                    while (originalIndex !== slotIndex) {
                        unchanged[unchangedIndex++] = originalIndex++;
                    }
                    frame.zOrder[originalIndex + offset] = originalIndex++;
                }
                while (originalIndex < slotCount) {
                    unchanged[unchangedIndex++] = originalIndex++;
                }
                var i = slotCount;
                while (i--) {
                    if (frame.zOrder[i] === -1) {
                        frame.zOrder[i] = unchanged[--unchangedIndex];
                    }
                }
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseBoneFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.BoneFrameData);
            frame.tweenRotate = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_ROTATE, 0.0);
            frame.tweenScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.TWEEN_SCALE, true);
            this._parseTweenFrame(rawData, frame, frameStart, frameCount);
            if (ObjectDataParser.TRANSFORM in rawData) {
                var transformObject = rawData[ObjectDataParser.TRANSFORM];
                this._parseTransform(transformObject, frame.transform);
                if (this._isOldData) {
                    this._helpPoint.x = this._timelinePivot.x + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0.0) * this._armature.scale;
                    this._helpPoint.y = this._timelinePivot.y + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0.0) * this._armature.scale;
                    frame.transform.toMatrix(this._helpMatrix);
                    this._helpMatrix.transformPoint(this._helpPoint.x, this._helpPoint.y, this._helpPoint, true);
                    frame.transform.x += this._helpPoint.x;
                    frame.transform.y += this._helpPoint.y;
                }
            }
            var bone = this._timeline.bone;
            var actions = new Array();
            var events = new Array();
            if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
                var slot = this._armature.getSlot(bone.name);
                this._parseActionData(rawData, actions, bone, slot);
            }
            if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                this._parseEventData(rawData, events, bone, null);
            }
            if (actions.length > 0 || events.length > 0) {
                this._mergeFrameToAnimationTimeline(frame.position, actions, events); // Merge actions and events to animation timeline.
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseSlotFrame = function (rawData, frameStart, frameCount) {
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.SlotFrameData);
            frame.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            this._parseTweenFrame(rawData, frame, frameStart, frameCount);
            if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) {
                frame.color = dragonBones.SlotFrameData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], frame.color);
            }
            else {
                frame.color = dragonBones.SlotFrameData.DEFAULT_COLOR;
            }
            if (this._isOldData) {
                if (ObjectDataParser._getBoolean(rawData, ObjectDataParser.HIDE, false)) {
                    frame.displayIndex = -1;
                }
            }
            else if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
                var slot = this._timeline.slot;
                var actions = new Array();
                this._parseActionData(rawData, actions, slot.parent, slot);
                this._mergeFrameToAnimationTimeline(frame.position, actions, null); // Merge actions and events to animation timeline.
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseFFDFrame = function (rawData, frameStart, frameCount) {
            var ffdTimeline = this._timeline;
            var mesh = ffdTimeline.display.mesh;
            var frame = dragonBones.BaseObject.borrowObject(dragonBones.ExtensionFrameData);
            this._parseTweenFrame(rawData, frame, frameStart, frameCount);
            var rawVertices = rawData[ObjectDataParser.VERTICES];
            var offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0); // uint
            var x = 0.0;
            var y = 0.0;
            for (var i = 0, l = mesh.vertices.length; i < l; i += 2) {
                if (!rawVertices || i < offset || i - offset >= rawVertices.length) {
                    x = 0.0;
                    y = 0.0;
                }
                else {
                    x = rawVertices[i - offset] * this._armature.scale;
                    y = rawVertices[i + 1 - offset] * this._armature.scale;
                }
                if (mesh.skinned) {
                    mesh.slotPose.transformPoint(x, y, this._helpPoint, true);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;
                    var boneIndices = mesh.boneIndices[i / 2];
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var boneIndex = boneIndices[iB];
                        mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint, true);
                        frame.tweens.push(this._helpPoint.x, this._helpPoint.y);
                    }
                }
                else {
                    frame.tweens.push(x, y);
                }
            }
            return frame;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseTweenFrame = function (rawData, frame, frameStart, frameCount) {
            this._parseFrame(rawData, frame, frameStart, frameCount);
            if (frame.duration > 0.0) {
                if (ObjectDataParser.TWEEN_EASING in rawData) {
                    frame.tweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, dragonBones.DragonBones.NO_TWEEN);
                }
                else if (this._isOldData) {
                    frame.tweenEasing = this._isAutoTween ? this._animationTweenEasing : dragonBones.DragonBones.NO_TWEEN;
                }
                else {
                    frame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                }
                if (this._isOldData && this._animation.scale === 1 && this._timeline.scale === 1 && frame.duration * this._armature.frameRate < 2) {
                    frame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                }
                if (frameCount > 0 && (ObjectDataParser.CURVE in rawData)) {
                    frame.curve = new Array(frameCount * 2 - 1);
                    dragonBones.TweenFrameData.samplingEasingCurve(rawData[ObjectDataParser.CURVE], frame.curve);
                }
            }
            else {
                frame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                frame.curve = null;
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseFrame = function (rawData, frame, frameStart, frameCount) {
            frame.position = frameStart / this._armature.frameRate;
            frame.duration = frameCount / this._armature.frameRate;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseTimeline = function (rawData, timeline, frameParser) {
            timeline.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1);
            timeline.offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0);
            this._timeline = timeline;
            if (ObjectDataParser.FRAME in rawData) {
                var rawFrames = rawData[ObjectDataParser.FRAME];
                if (rawFrames.length === 1) {
                    timeline.frames.length = 1;
                    timeline.frames[0] = frameParser.call(this, rawFrames[0], 0, ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DURATION, 1));
                }
                else if (rawFrames.length > 1) {
                    timeline.frames.length = this._animation.frameCount + 1;
                    var frameStart = 0;
                    var frameCount = 0;
                    var frame = null;
                    var prevFrame = null;
                    for (var i = 0, iW = 0, l = timeline.frames.length; i < l; ++i) {
                        if (frameStart + frameCount <= i && iW < rawFrames.length) {
                            var rawFrame = rawFrames[iW++];
                            frameStart = i;
                            frameCount = ObjectDataParser._getNumber(rawFrame, ObjectDataParser.DURATION, 1);
                            frame = frameParser.call(this, rawFrame, frameStart, frameCount);
                            if (prevFrame) {
                                prevFrame.next = frame;
                                frame.prev = prevFrame;
                                if (this._isOldData) {
                                    if (prevFrame instanceof dragonBones.TweenFrameData && ObjectDataParser._getNumber(rawFrame, ObjectDataParser.DISPLAY_INDEX, 0) === -1) {
                                        prevFrame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                                    }
                                }
                            }
                            prevFrame = frame;
                        }
                        timeline.frames[i] = frame;
                    }
                    frame.duration = this._animation.duration - frame.position; // Modify last frame duration.
                    frame = timeline.frames[0];
                    prevFrame.next = frame;
                    frame.prev = prevFrame;
                    if (this._isOldData) {
                        if (prevFrame instanceof dragonBones.TweenFrameData && ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DISPLAY_INDEX, 0) === -1) {
                            prevFrame.tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                        }
                    }
                }
            }
            this._timeline = null;
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseActionData = function (rawData, actions, bone, slot) {
            var rawActions = rawData[ObjectDataParser.ACTION] || rawData[ObjectDataParser.ACTIONS] || rawData[ObjectDataParser.DEFAULT_ACTIONS];
            if (typeof rawActions === "string") {
                var actionData = dragonBones.BaseObject.borrowObject(dragonBones.ActionData);
                actionData.type = 0 /* Play */;
                actionData.bone = bone;
                actionData.slot = slot;
                actionData.animationConfig = dragonBones.BaseObject.borrowObject(dragonBones.AnimationConfig);
                actionData.animationConfig.animationName = rawActions;
                actions.push(actionData);
            }
            else if (rawActions instanceof Array) {
                for (var i = 0, l = rawActions.length; i < l; ++i) {
                    var actionObject = rawActions[i];
                    var isArray = actionObject instanceof Array;
                    var actionData = dragonBones.BaseObject.borrowObject(dragonBones.ActionData);
                    var animationName = isArray ? actionObject[1] : ObjectDataParser._getString(actionObject, "gotoAndPlay", null);
                    if (isArray) {
                        var actionType = actionObject[0];
                        if (typeof actionType === "string") {
                            actionData.type = ObjectDataParser._getActionType(actionType);
                        }
                        else {
                            actionData.type = actionType;
                        }
                    }
                    else {
                        actionData.type = 0 /* Play */;
                    }
                    switch (actionData.type) {
                        case 0 /* Play */:
                            actionData.animationConfig = dragonBones.BaseObject.borrowObject(dragonBones.AnimationConfig);
                            actionData.animationConfig.animationName = animationName;
                            break;
                        default:
                            break;
                    }
                    actionData.bone = bone;
                    actionData.slot = slot;
                    actions.push(actionData);
                }
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseEventData = function (rawData, events, bone, slot) {
            if (ObjectDataParser.SOUND in rawData) {
                var soundEventData = dragonBones.BaseObject.borrowObject(dragonBones.EventData);
                soundEventData.type = 11 /* Sound */;
                soundEventData.name = ObjectDataParser._getString(rawData, ObjectDataParser.SOUND, null);
                soundEventData.bone = bone;
                soundEventData.slot = slot;
                events.push(soundEventData);
            }
            if (ObjectDataParser.EVENT in rawData) {
                var eventData = dragonBones.BaseObject.borrowObject(dragonBones.EventData);
                eventData.type = 10 /* Frame */;
                eventData.name = ObjectDataParser._getString(rawData, ObjectDataParser.EVENT, null);
                eventData.bone = bone;
                eventData.slot = slot;
                events.push(eventData);
            }
            if (ObjectDataParser.EVENTS in rawData) {
                var rawEvents = rawData[ObjectDataParser.EVENTS];
                for (var i = 0, l = rawEvents.length; i < l; ++i) {
                    var rawEvent = rawEvents[i];
                    var boneName = ObjectDataParser._getString(rawEvent, ObjectDataParser.BONE, null);
                    var slotName = ObjectDataParser._getString(rawEvent, ObjectDataParser.SLOT, null);
                    var eventData = dragonBones.BaseObject.borrowObject(dragonBones.EventData);
                    eventData.type = 10 /* Frame */;
                    eventData.name = ObjectDataParser._getString(rawEvent, ObjectDataParser.NAME, null);
                    eventData.bone = this._armature.getBone(boneName);
                    eventData.slot = this._armature.getSlot(slotName);
                    if (ObjectDataParser.INTS in rawEvent) {
                        if (!eventData.data) {
                            eventData.data = dragonBones.BaseObject.borrowObject(dragonBones.CustomData);
                        }
                        var rawInts = rawEvent[ObjectDataParser.INTS];
                        for (var i_5 = 0, l_2 = rawInts.length; i_5 < l_2; ++i_5) {
                            eventData.data.ints.push(rawInts[i_5]);
                        }
                    }
                    if (ObjectDataParser.FLOATS in rawEvent) {
                        if (!eventData.data) {
                            eventData.data = dragonBones.BaseObject.borrowObject(dragonBones.CustomData);
                        }
                        var rawFloats = rawEvent[ObjectDataParser.FLOATS];
                        for (var i_6 = 0, l_3 = rawFloats.length; i_6 < l_3; ++i_6) {
                            eventData.data.floats.push(rawFloats[i_6]);
                        }
                    }
                    if (ObjectDataParser.STRINGS in rawEvent) {
                        if (!eventData.data) {
                            eventData.data = dragonBones.BaseObject.borrowObject(dragonBones.CustomData);
                        }
                        var rawStrings = rawEvent[ObjectDataParser.STRINGS];
                        for (var i_7 = 0, l_4 = rawStrings.length; i_7 < l_4; ++i_7) {
                            eventData.data.strings.push(rawStrings[i_7]);
                        }
                    }
                    events.push(eventData);
                }
            }
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseTransform = function (rawData, transform) {
            transform.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 0.0) * this._armature.scale;
            transform.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 0.0) * this._armature.scale;
            transform.skewX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_X, 0.0) * dragonBones.DragonBones.ANGLE_TO_RADIAN;
            transform.skewY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_Y, 0.0) * dragonBones.DragonBones.ANGLE_TO_RADIAN;
            transform.scaleX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_X, 1.0);
            transform.scaleY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_Y, 1.0);
        };
        /**
         * @private
         */
        ObjectDataParser.prototype._parseColorTransform = function (rawData, color) {
            color.alphaMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_MULTIPLIER, 100) * 0.01;
            color.redMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_MULTIPLIER, 100) * 0.01;
            color.greenMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_MULTIPLIER, 100) * 0.01;
            color.blueMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_MULTIPLIER, 100) * 0.01;
            color.alphaOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_OFFSET, 0);
            color.redOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_OFFSET, 0);
            color.greenOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_OFFSET, 0);
            color.blueOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_OFFSET, 0);
        };
        /**
         * @inheritDoc
         */
        ObjectDataParser.prototype.parseDragonBonesData = function (rawData, scale) {
            if (scale === void 0) { scale = 1; }
            if (rawData) {
                var version = ObjectDataParser._getString(rawData, ObjectDataParser.VERSION, null);
                var compatibleVersion = ObjectDataParser._getString(rawData, ObjectDataParser.COMPATIBLE_VERSION, null);
                this._isOldData = version === ObjectDataParser.DATA_VERSION_2_3 || version === ObjectDataParser.DATA_VERSION_3_0;
                if (this._isOldData) {
                    this._isGlobalTransform = ObjectDataParser._getBoolean(rawData, ObjectDataParser.IS_GLOBAL, true);
                }
                else {
                    this._isGlobalTransform = false;
                }
                if (ObjectDataParser.DATA_VERSIONS.indexOf(version) >= 0 ||
                    ObjectDataParser.DATA_VERSIONS.indexOf(compatibleVersion) >= 0) {
                    var data = dragonBones.BaseObject.borrowObject(dragonBones.DragonBonesData);
                    data.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                    data.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, 24);
                    if (data.frameRate === 0) {
                        data.frameRate = 24;
                    }
                    if (ObjectDataParser.ARMATURE in rawData) {
                        this._data = data;
                        var rawArmatures = rawData[ObjectDataParser.ARMATURE];
                        for (var i = 0, l = rawArmatures.length; i < l; ++i) {
                            data.addArmature(this._parseArmature(rawArmatures[i], scale));
                        }
                        this._data = null;
                    }
                    return data;
                }
                else {
                    throw new Error("Nonsupport data version.");
                }
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
            // return null;
        };
        /**
         * @inheritDoc
         */
        ObjectDataParser.prototype.parseTextureAtlasData = function (rawData, textureAtlasData, scale) {
            if (scale === void 0) { scale = 0.0; }
            if (rawData) {
                textureAtlasData.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                textureAtlasData.imagePath = ObjectDataParser._getString(rawData, ObjectDataParser.IMAGE_PATH, null);
                textureAtlasData.width = ObjectDataParser._getNumber(rawData, ObjectDataParser.WIDTH, 0.0);
                textureAtlasData.height = ObjectDataParser._getNumber(rawData, ObjectDataParser.HEIGHT, 0.0);
                // Texture format.
                if (scale > 0.0) {
                    textureAtlasData.scale = scale;
                }
                else {
                    scale = textureAtlasData.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, textureAtlasData.scale);
                }
                scale = 1.0 / scale;
                if (ObjectDataParser.SUB_TEXTURE in rawData) {
                    var rawTextures = rawData[ObjectDataParser.SUB_TEXTURE];
                    for (var i = 0, l = rawTextures.length; i < l; ++i) {
                        var rawTexture = rawTextures[i];
                        var textureData = textureAtlasData.generateTexture();
                        textureData.name = ObjectDataParser._getString(rawTexture, ObjectDataParser.NAME, null);
                        textureData.rotated = ObjectDataParser._getBoolean(rawTexture, ObjectDataParser.ROTATED, false);
                        textureData.region.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.X, 0.0) * scale;
                        textureData.region.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.Y, 0.0) * scale;
                        textureData.region.width = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.WIDTH, 0.0) * scale;
                        textureData.region.height = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.HEIGHT, 0.0) * scale;
                        var frameWidth = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_WIDTH, -1.0);
                        var frameHeight = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_HEIGHT, -1.0);
                        if (frameWidth > 0.0 && frameHeight > 0.0) {
                            textureData.frame = dragonBones.TextureData.generateRectangle();
                            textureData.frame.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_X, 0.0) * scale;
                            textureData.frame.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_Y, 0.0) * scale;
                            textureData.frame.width = frameWidth * scale;
                            textureData.frame.height = frameHeight * scale;
                        }
                        textureAtlasData.addTexture(textureData);
                    }
                }
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        ObjectDataParser.getInstance = function () {
            if (!ObjectDataParser._instance) {
                ObjectDataParser._instance = new ObjectDataParser();
            }
            return ObjectDataParser._instance;
        };
        return ObjectDataParser;
    }(dragonBones.DataParser));
    /**
     * @private
     */
    ObjectDataParser._instance = null;
    dragonBones.ObjectDataParser = ObjectDataParser;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 基础变换对象。
     * @version DragonBones 4.5
     */
    var TransformObject = (function (_super) {
        __extends(TransformObject, _super);
        /**
         * @internal
         * @private
         */
        function TransformObject() {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 相对于骨架坐标系的矩阵。
             * @readOnly
             * @version DragonBones 3.0
             */
            _this.globalTransformMatrix = new dragonBones.Matrix();
            /**
             * @language zh_CN
             * 相对于骨架坐标系的变换。
             * @see dragonBones.Transform
             * @readOnly
             * @version DragonBones 3.0
             */
            _this.global = new dragonBones.Transform();
            /**
             * @language zh_CN
             * 相对于骨架或父骨骼坐标系的偏移变换。
             * @see dragonBones.Transform
             * @version DragonBones 3.0
             */
            _this.offset = new dragonBones.Transform();
            return _this;
        }
        /**
         * @private
         */
        TransformObject.prototype._onClear = function () {
            this.name = null;
            this.global.identity();
            this.offset.identity();
            this.globalTransformMatrix.identity();
            this.origin = null;
            this.userData = null;
            this._armature = null;
            this._parent = null;
        };
        /**
         * @internal
         * @private
         */
        TransformObject.prototype._setArmature = function (value) {
            this._armature = value;
        };
        /**
         * @internal
         * @private
         */
        TransformObject.prototype._setParent = function (value) {
            this._parent = value;
        };
        Object.defineProperty(TransformObject.prototype, "armature", {
            /**
             * @language zh_CN
             * 所属的骨架。
             * @see dragonBones.Armature
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TransformObject.prototype, "parent", {
            /**
             * @language zh_CN
             * 所属的父骨骼。
             * @see dragonBones.Bone
             * @version DragonBones 3.0
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        return TransformObject;
    }(dragonBones.BaseObject));
    dragonBones.TransformObject = TransformObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
     * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    var Bone = (function (_super) {
        __extends(Bone, _super);
        /**
         * @internal
         * @private
         */
        function Bone() {
            var _this = _super.call(this) || this;
            /**
             * @internal
             * @private
             */
            _this._animationPose = new dragonBones.Transform();
            _this._bones = [];
            _this._slots = [];
            return _this;
        }
        /**
         * @private
         */
        Bone.toString = function () {
            return "[class dragonBones.Bone]";
        };
        /**
         * @private
         */
        Bone.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.ikBendPositive = false;
            this.length = 0.0;
            this.ikWeight = 0.0;
            this._transformDirty = 0 /* None */;
            this._visible = true;
            this._cachedFrameIndex = -1;
            this._ikChain = 0;
            this._ikChainIndex = 0;
            this._updateState = -1;
            this._blendLayer = 0;
            this._blendLeftWeight = 1.0;
            this._blendTotalWeight = 0.0;
            this._animationPose.identity();
            this._bones.length = 0;
            this._slots.length = 0;
            this._boneData = null;
            this._ik = null;
            this._cachedFrameIndices = null;
        };
        /**
         * @private
         */
        Bone.prototype._updateGlobalTransformMatrix = function () {
            this.global.x = this.origin.x + this.offset.x + this._animationPose.x;
            this.global.y = this.origin.y + this.offset.y + this._animationPose.y;
            this.global.skewX = this.origin.skewX + this.offset.skewX + this._animationPose.skewX;
            this.global.skewY = this.origin.skewY + this.offset.skewY + this._animationPose.skewY;
            this.global.scaleX = this.origin.scaleX * this.offset.scaleX * this._animationPose.scaleX;
            this.global.scaleY = this.origin.scaleY * this.offset.scaleY * this._animationPose.scaleY;
            if (this._parent) {
                var parentRotation = this._parent.global.skewY; // Only inherit skew y.
                var parentMatrix = this._parent.globalTransformMatrix;
                if (this.inheritScale) {
                    if (!this.inheritRotation) {
                        this.global.skewX -= parentRotation;
                        this.global.skewY -= parentRotation;
                    }
                    this.global.toMatrix(this.globalTransformMatrix);
                    this.globalTransformMatrix.concat(parentMatrix);
                    if (!this.inheritTranslation) {
                        this.globalTransformMatrix.tx = this.global.x;
                        this.globalTransformMatrix.ty = this.global.y;
                    }
                    this.global.fromMatrix(this.globalTransformMatrix);
                }
                else {
                    if (this.inheritTranslation) {
                        var x = this.global.x;
                        var y = this.global.y;
                        this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                    }
                    if (this.inheritRotation) {
                        this.global.skewX += parentRotation;
                        this.global.skewY += parentRotation;
                    }
                    this.global.toMatrix(this.globalTransformMatrix);
                }
            }
            else {
                this.global.toMatrix(this.globalTransformMatrix);
            }
            if (this._ik && this._ikChainIndex === this._ikChain && this.ikWeight > 0) {
                if (this.inheritTranslation && this._ikChain > 0 && this._parent) {
                    this._computeIKB();
                }
                else {
                    this._computeIKA();
                }
            }
        };
        /**
         * @private
         */
        Bone.prototype._computeIKA = function () {
            var ikGlobal = this._ik.global;
            var x = this.globalTransformMatrix.a * this.length;
            var y = this.globalTransformMatrix.b * this.length;
            var ikRadian = (Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) +
                this.offset.skewY -
                this.global.skewY * 2 +
                Math.atan2(y, x)) * this.ikWeight; // Support offset.
            this.global.skewX += ikRadian;
            this.global.skewY += ikRadian;
            this.global.toMatrix(this.globalTransformMatrix);
        };
        /**
         * @private
         */
        Bone.prototype._computeIKB = function () {
            var parentGlobal = this._parent.global;
            var ikGlobal = this._ik.global;
            var x = this.globalTransformMatrix.a * this.length;
            var y = this.globalTransformMatrix.b * this.length;
            var lLL = x * x + y * y;
            var lL = Math.sqrt(lLL);
            var dX = this.global.x - parentGlobal.x;
            var dY = this.global.y - parentGlobal.y;
            var lPP = dX * dX + dY * dY;
            var lP = Math.sqrt(lPP);
            dX = ikGlobal.x - parentGlobal.x;
            dY = ikGlobal.y - parentGlobal.y;
            var lTT = dX * dX + dY * dY;
            var lT = Math.sqrt(lTT);
            var ikRadianA = 0;
            if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
                ikRadianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
                if (lL + lP <= lT) {
                }
                else if (lP < lL) {
                    ikRadianA += Math.PI;
                }
            }
            else {
                var h = (lPP - lLL + lTT) / (2 * lTT);
                var r = Math.sqrt(lPP - h * h * lTT) / lT;
                var hX = parentGlobal.x + (dX * h);
                var hY = parentGlobal.y + (dY * h);
                var rX = -dY * r;
                var rY = dX * r;
                if (this.ikBendPositive) {
                    this.global.x = hX - rX;
                    this.global.y = hY - rY;
                }
                else {
                    this.global.x = hX + rX;
                    this.global.y = hY + rY;
                }
                ikRadianA = Math.atan2(this.global.y - parentGlobal.y, this.global.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
            }
            ikRadianA = (ikRadianA - parentGlobal.skewY) * this.ikWeight;
            parentGlobal.skewX += ikRadianA;
            parentGlobal.skewY += ikRadianA;
            parentGlobal.toMatrix(this._parent.globalTransformMatrix);
            this._parent._transformDirty = 1 /* Self */;
            this.global.x = parentGlobal.x + Math.cos(parentGlobal.skewY) * lP;
            this.global.y = parentGlobal.y + Math.sin(parentGlobal.skewY) * lP;
            var ikRadianB = (Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) + this.offset.skewY -
                this.global.skewY * 2 + Math.atan2(y, x)) * this.ikWeight; // Support offset.
            this.global.skewX += ikRadianB;
            this.global.skewY += ikRadianB;
            this.global.toMatrix(this.globalTransformMatrix);
        };
        /**
         * @internal
         * @private
         */
        Bone.prototype._init = function (boneData) {
            if (this._boneData) {
                return;
            }
            this._boneData = boneData;
            this.inheritTranslation = this._boneData.inheritTranslation;
            this.inheritRotation = this._boneData.inheritRotation;
            this.inheritScale = this._boneData.inheritScale;
            this.length = this._boneData.length;
            this.name = this._boneData.name;
            this.origin = this._boneData.transform;
        };
        /**
         * @internal
         * @private
         */
        Bone.prototype._setArmature = function (value) {
            if (this._armature === value) {
                return;
            }
            this._ik = null;
            var oldSlots = null;
            var oldBones = null;
            if (this._armature) {
                oldSlots = this.getSlots();
                oldBones = this.getBones();
                this._armature._removeBoneFromBoneList(this);
            }
            this._armature = value;
            if (this._armature) {
                this._armature._addBoneToBoneList(this);
            }
            if (oldSlots) {
                for (var i = 0, l = oldSlots.length; i < l; ++i) {
                    var slot = oldSlots[i];
                    if (slot.parent === this) {
                        slot._setArmature(this._armature);
                    }
                }
            }
            if (oldBones) {
                for (var i = 0, l = oldBones.length; i < l; ++i) {
                    var bone = oldBones[i];
                    if (bone.parent === this) {
                        bone._setArmature(this._armature);
                    }
                }
            }
        };
        /**
         * @internal
         * @private
         */
        Bone.prototype._setIK = function (value, chain, chainIndex) {
            if (value) {
                if (chain === chainIndex) {
                    var chainEnd = this._parent;
                    if (chain && chainEnd) {
                        chain = 1;
                    }
                    else {
                        chain = 0;
                        chainIndex = 0;
                        chainEnd = this;
                    }
                    if (chainEnd === value || chainEnd.contains(value)) {
                        value = null;
                        chain = 0;
                        chainIndex = 0;
                    }
                    else {
                        var ancestor = value;
                        while (ancestor.ik && ancestor.ikChain) {
                            if (chainEnd.contains(ancestor.ik)) {
                                value = null;
                                chain = 0;
                                chainIndex = 0;
                                break;
                            }
                            ancestor = ancestor.parent;
                        }
                    }
                }
            }
            else {
                chain = 0;
                chainIndex = 0;
            }
            this._ik = value;
            this._ikChain = chain;
            this._ikChainIndex = chainIndex;
            if (this._armature) {
                this._armature._bonesDirty = true;
            }
        };
        /**
         * @internal
         * @private
         */
        Bone.prototype._update = function (cacheFrameIndex) {
            this._updateState = -1;
            if (cacheFrameIndex >= 0 && this._cachedFrameIndices) {
                var cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) {
                    this._transformDirty = 0 /* None */;
                }
                else if (cachedFrameIndex >= 0) {
                    this._transformDirty = 2 /* All */;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else if (this._transformDirty === 2 /* All */ ||
                    (this._parent && this._parent._transformDirty !== 0 /* None */) ||
                    (this._ik && this.ikWeight > 0 && this._ik._transformDirty !== 0 /* None */)) {
                    this._transformDirty = 2 /* All */;
                    this._cachedFrameIndex = -1;
                }
                else if (this._cachedFrameIndex >= 0) {
                    this._transformDirty = 0 /* None */;
                    this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
                }
                else {
                    this._transformDirty = 2 /* All */;
                    this._cachedFrameIndex = -1;
                }
            }
            else if (this._transformDirty === 2 /* All */ ||
                (this._parent && this._parent._transformDirty !== 0 /* None */) ||
                (this._ik && this.ikWeight > 0 && this._ik._transformDirty !== 0 /* None */)) {
                cacheFrameIndex = -1;
                this._transformDirty = 2 /* All */;
                this._cachedFrameIndex = -1;
            }
            if (this._transformDirty !== 0 /* None */) {
                if (this._transformDirty === 2 /* All */) {
                    this._transformDirty = 1 /* Self */;
                    if (this._cachedFrameIndex < 0) {
                        this._updateGlobalTransformMatrix();
                        if (cacheFrameIndex >= 0) {
                            this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                        }
                    }
                    else {
                        this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                    }
                    this._updateState = 0;
                }
                else {
                    this._transformDirty = 0 /* None */;
                }
            }
        };
        /**
         * @language zh_CN
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         */
        Bone.prototype.invalidUpdate = function () {
            this._transformDirty = 2 /* All */;
        };
        /**
         * @language zh_CN
         * 是否包含骨骼或插槽。
         * @returns
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         */
        Bone.prototype.contains = function (child) {
            if (child) {
                if (child === this) {
                    return false;
                }
                var ancestor = child;
                while (ancestor !== this && ancestor) {
                    ancestor = ancestor.parent;
                }
                return ancestor === this;
            }
            return false;
        };
        /**
         * @language zh_CN
         * 所有的子骨骼。
         * @version DragonBones 3.0
         */
        Bone.prototype.getBones = function () {
            this._bones.length = 0;
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                if (bone.parent === this) {
                    this._bones.push(bone);
                }
            }
            return this._bones;
        };
        /**
         * @language zh_CN
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Bone.prototype.getSlots = function () {
            this._slots.length = 0;
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                if (slot.parent === this) {
                    this._slots.push(slot);
                }
            }
            return this._slots;
        };
        Object.defineProperty(Bone.prototype, "visible", {
            /**
             * @language zh_CN
             * 控制此骨骼所有插槽的可见。
             * @default true
             * @see dragonBones.Slot
             * @version DragonBones 3.0
             */
            get: function () {
                return this._visible;
            },
            set: function (value) {
                if (this._visible === value) {
                    return;
                }
                this._visible = value;
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    if (slot._parent === this) {
                        slot._updateVisible();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "slot", {
            /**
             * @deprecated
             * @see dragonBones.Armature#getSlot()
             */
            get: function () {
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    if (slot.parent === this) {
                        return slot;
                    }
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "ikChain", {
            /**
             * @deprecated
             */
            get: function () {
                return this._ikChain;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "ikChainIndex", {
            /**
             * @deprecated
             */
            get: function () {
                return this._ikChainIndex;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Bone.prototype, "ik", {
            /**
             * @deprecated
             */
            get: function () {
                return this._ik;
            },
            enumerable: true,
            configurable: true
        });
        return Bone;
    }(dragonBones.TransformObject));
    dragonBones.Bone = Bone;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    var Slot = (function (_super) {
        __extends(Slot, _super);
        /**
         * @internal
         * @private
         */
        function Slot() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this._localMatrix = new dragonBones.Matrix();
            /**
             * @private
             */
            _this._colorTransform = new dragonBones.ColorTransform();
            /**
             * @private
             */
            _this._ffdVertices = [];
            /**
             * @private
             */
            _this._displayList = [];
            /**
             * @private
             */
            _this._replacedDisplayDatas = [];
            /**
             * @private
             */
            _this._meshBones = [];
            return _this;
        }
        /**
         * @private
         */
        Slot.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            var disposeDisplayList = [];
            for (var i = 0, l = this._displayList.length; i < l; ++i) {
                var eachDisplay = this._displayList[i];
                if (eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                    disposeDisplayList.indexOf(eachDisplay) < 0) {
                    disposeDisplayList.push(eachDisplay);
                }
            }
            for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
                var eachDisplay = disposeDisplayList[i];
                if (eachDisplay instanceof dragonBones.Armature) {
                    eachDisplay.dispose();
                }
                else {
                    this._disposeDisplay(eachDisplay);
                }
            }
            if (this._meshDisplay && this._meshDisplay !== this._rawDisplay) {
                this._disposeDisplay(this._meshDisplay);
            }
            if (this._rawDisplay) {
                this._disposeDisplay(this._rawDisplay);
            }
            this.displayController = null;
            this._displayDirty = false;
            this._zOrderDirty = false;
            this._blendModeDirty = false;
            this._colorDirty = false;
            this._meshDirty = false;
            this._originalDirty = false;
            this._transformDirty = false;
            this._updateState = -1;
            this._blendMode = 0 /* Normal */;
            this._displayIndex = -1;
            this._zOrder = 0;
            this._cachedFrameIndex = -1;
            this._pivotX = 0.0;
            this._pivotY = 0.0;
            this._localMatrix.identity();
            this._colorTransform.identity();
            this._ffdVertices.length = 0;
            this._displayList.length = 0;
            this._replacedDisplayDatas.length = 0;
            this._meshBones.length = 0;
            this._skinSlotData = null;
            this._displayData = null;
            this._replacedDisplayData = null;
            this._textureData = null;
            this._meshData = null;
            this._boundingBoxData = null;
            this._rawDisplay = null;
            this._meshDisplay = null;
            this._display = null;
            this._childArmature = null;
            this._cachedFrameIndices = null;
        };
        /**
         * @private
         */
        Slot.prototype._isMeshBonesUpdate = function () {
            for (var i = 0, l = this._meshBones.length; i < l; ++i) {
                if (this._meshBones[i]._transformDirty !== 0 /* None */) {
                    return true;
                }
            }
            return false;
        };
        /**
         * @private
         */
        Slot.prototype._updateDisplayData = function () {
            var prevDisplayData = this._displayData;
            var prevReplaceDisplayData = this._replacedDisplayData;
            var prevTextureData = this._textureData;
            var prevMeshData = this._meshData;
            var currentDisplay = this._displayIndex >= 0 && this._displayIndex < this._displayList.length ? this._displayList[this._displayIndex] : null;
            if (this._displayIndex >= 0 && this._displayIndex < this._skinSlotData.displays.length) {
                this._displayData = this._skinSlotData.displays[this._displayIndex];
            }
            else {
                this._displayData = null;
            }
            if (this._displayIndex >= 0 && this._displayIndex < this._replacedDisplayDatas.length) {
                this._replacedDisplayData = this._replacedDisplayDatas[this._displayIndex];
            }
            else {
                this._replacedDisplayData = null;
            }
            if (this._displayData !== prevDisplayData || this._replacedDisplayData !== prevReplaceDisplayData || this._display != currentDisplay) {
                var currentDisplayData = this._replacedDisplayData ? this._replacedDisplayData : this._displayData;
                if (currentDisplayData && (currentDisplay === this._rawDisplay || currentDisplay === this._meshDisplay)) {
                    this._textureData = this._replacedDisplayData ? this._replacedDisplayData.texture : this._displayData.texture;
                    if (currentDisplay === this._meshDisplay) {
                        if (this._replacedDisplayData && this._replacedDisplayData.mesh) {
                            this._meshData = this._replacedDisplayData.mesh;
                        }
                        else {
                            this._meshData = this._displayData.mesh;
                        }
                    }
                    else {
                        this._meshData = null;
                    }
                    // Update pivot offset.
                    if (this._meshData) {
                        this._pivotX = 0.0;
                        this._pivotY = 0.0;
                    }
                    else if (this._textureData) {
                        var scale = this._armature.armatureData.scale;
                        this._pivotX = currentDisplayData.pivot.x;
                        this._pivotY = currentDisplayData.pivot.y;
                        if (currentDisplayData.isRelativePivot) {
                            var rect = this._textureData.frame ? this._textureData.frame : this._textureData.region;
                            var width = rect.width * scale;
                            var height = rect.height * scale;
                            if (this._textureData.rotated) {
                                width = rect.height;
                                height = rect.width;
                            }
                            this._pivotX *= width;
                            this._pivotY *= height;
                        }
                        if (this._textureData.frame) {
                            this._pivotX += this._textureData.frame.x * scale;
                            this._pivotY += this._textureData.frame.y * scale;
                        }
                    }
                    else {
                        this._pivotX = 0.0;
                        this._pivotY = 0.0;
                    }
                    if (this._displayData && currentDisplayData !== this._displayData &&
                        (!this._meshData || this._meshData !== this._displayData.mesh)) {
                        this._displayData.transform.toMatrix(Slot._helpMatrix);
                        Slot._helpMatrix.invert();
                        Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                        this._pivotX -= Slot._helpPoint.x;
                        this._pivotY -= Slot._helpPoint.y;
                        currentDisplayData.transform.toMatrix(Slot._helpMatrix);
                        Slot._helpMatrix.invert();
                        Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                        this._pivotX += Slot._helpPoint.x;
                        this._pivotY += Slot._helpPoint.y;
                    }
                    if (this._meshData !== prevMeshData) {
                        if (this._meshData && this._displayData && this._meshData === this._displayData.mesh) {
                            if (this._meshData.skinned) {
                                this._meshBones.length = this._meshData.bones.length;
                                for (var i = 0, l = this._meshBones.length; i < l; ++i) {
                                    this._meshBones[i] = this._armature.getBone(this._meshData.bones[i].name);
                                }
                                var ffdVerticesCount = 0;
                                for (var i = 0, l = this._meshData.boneIndices.length; i < l; ++i) {
                                    ffdVerticesCount += this._meshData.boneIndices[i].length;
                                }
                                this._ffdVertices.length = ffdVerticesCount * 2;
                            }
                            else {
                                this._meshBones.length = 0;
                                this._ffdVertices.length = this._meshData.vertices.length;
                            }
                            for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                                this._ffdVertices[i] = 0.0;
                            }
                            this._meshDirty = true;
                        }
                        else {
                            this._meshBones.length = 0;
                            this._ffdVertices.length = 0;
                        }
                    }
                    else if (this._textureData !== prevTextureData) {
                        this._meshDirty = true;
                    }
                }
                else {
                    this._textureData = null;
                    this._meshData = null;
                    this._pivotX = 0.0;
                    this._pivotY = 0.0;
                    this._meshBones.length = 0;
                    this._ffdVertices.length = 0;
                }
                this._displayDirty = true;
                this._originalDirty = true;
                if (this._displayData) {
                    this.origin = this._displayData.transform;
                }
                else if (this._replacedDisplayData) {
                    this.origin = this._replacedDisplayData.transform;
                }
            }
            // Update bounding box data.
            if (this._replacedDisplayData) {
                this._boundingBoxData = this._replacedDisplayData.boundingBox;
            }
            else if (this._displayData) {
                this._boundingBoxData = this._displayData.boundingBox;
            }
            else {
                this._boundingBoxData = null;
            }
        };
        /**
         * @private
         */
        Slot.prototype._updateDisplay = function () {
            var prevDisplay = this._display || this._rawDisplay;
            var prevChildArmature = this._childArmature;
            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._display = this._displayList[this._displayIndex];
                if (this._display instanceof dragonBones.Armature) {
                    this._childArmature = this._display;
                    this._display = this._childArmature.display;
                }
                else {
                    this._childArmature = null;
                }
            }
            else {
                this._display = null;
                this._childArmature = null;
            }
            var currentDisplay = this._display ? this._display : this._rawDisplay;
            if (currentDisplay !== prevDisplay) {
                this._onUpdateDisplay();
                if (prevDisplay) {
                    this._replaceDisplay(prevDisplay);
                }
                else {
                    this._addDisplay();
                }
                this._blendModeDirty = true;
                this._colorDirty = true;
            }
            // Update frame.
            if (currentDisplay === this._rawDisplay || currentDisplay === this._meshDisplay) {
                this._updateFrame();
            }
            // Update child armature.
            if (this._childArmature !== prevChildArmature) {
                if (prevChildArmature) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    prevChildArmature.clock = null;
                    if (prevChildArmature.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }
                if (this._childArmature) {
                    this._childArmature._parent = this; // Update child armature parent.
                    this._childArmature.clock = this._armature.clock;
                    if (this._childArmature.inheritAnimation) {
                        if (this._childArmature.cacheFrameRate === 0) {
                            var cacheFrameRate = this._armature.cacheFrameRate;
                            if (cacheFrameRate !== 0) {
                                this._childArmature.cacheFrameRate = cacheFrameRate;
                            }
                        }
                        // Child armature action.                        
                        var actions = this._skinSlotData.slot.actions.length > 0 ? this._skinSlotData.slot.actions : this._childArmature.armatureData.actions;
                        if (actions.length > 0) {
                            for (var i = 0, l = actions.length; i < l; ++i) {
                                this._childArmature._bufferAction(actions[i]);
                            }
                        }
                        else {
                            this._childArmature.animation.play();
                        }
                    }
                }
            }
        };
        /**
         * @private
         */
        Slot.prototype._updateLocalTransformMatrix = function () {
            if (this.origin) {
                this.global.copyFrom(this.origin).add(this.offset).toMatrix(this._localMatrix);
            }
            else {
                this.global.copyFrom(this.offset).toMatrix(this._localMatrix);
            }
        };
        /**
         * @private
         */
        Slot.prototype._updateGlobalTransformMatrix = function () {
            this.globalTransformMatrix.copyFrom(this._localMatrix);
            this.globalTransformMatrix.concat(this._parent.globalTransformMatrix);
            this.global.fromMatrix(this.globalTransformMatrix);
        };
        /**
         * @private
         */
        Slot.prototype._init = function (skinSlotData, rawDisplay, meshDisplay) {
            if (this._skinSlotData) {
                return;
            }
            this._skinSlotData = skinSlotData;
            var slotData = this._skinSlotData.slot;
            this.name = slotData.name;
            this._zOrder = slotData.zOrder;
            this._blendMode = slotData.blendMode;
            this._colorTransform.copyFrom(slotData.color);
            this._rawDisplay = rawDisplay;
            this._meshDisplay = meshDisplay;
            this._blendModeDirty = true;
            this._colorDirty = true;
        };
        /**
         * @internal
         * @private
         */
        Slot.prototype._setArmature = function (value) {
            if (this._armature === value) {
                return;
            }
            if (this._armature) {
                this._armature._removeSlotFromSlotList(this);
            }
            this._armature = value;
            this._onUpdateDisplay();
            if (this._armature) {
                this._armature._addSlotToSlotList(this);
                this._addDisplay();
            }
            else {
                this._removeDisplay();
            }
        };
        /**
         * @internal
         * @private
         */
        Slot.prototype._update = function (cacheFrameIndex) {
            this._updateState = -1;
            if (this._displayDirty) {
                this._displayDirty = false;
                this._updateDisplay();
            }
            if (this._zOrderDirty) {
                this._zOrderDirty = false;
                this._updateZOrder();
            }
            if (!this._display) {
                return;
            }
            if (this._blendModeDirty) {
                this._blendModeDirty = false;
                this._updateBlendMode();
            }
            if (this._colorDirty) {
                this._colorDirty = false;
                this._updateColor();
            }
            if (this._originalDirty) {
                this._originalDirty = false;
                this._transformDirty = true;
                this._updateLocalTransformMatrix();
            }
            if (this._meshData && this._displayData && this._meshData === this._displayData.mesh) {
                if (this._meshDirty || (this._meshData.skinned && this._isMeshBonesUpdate())) {
                    this._meshDirty = false;
                    this._updateMesh();
                }
                if (this._meshData.skinned) {
                    if (this._transformDirty) {
                        this._transformDirty = false;
                        this._updateTransform(true);
                    }
                    return;
                }
            }
            if (cacheFrameIndex >= 0 && this._cachedFrameIndices) {
                var cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) {
                    this._transformDirty = false;
                }
                else if (cachedFrameIndex >= 0) {
                    this._transformDirty = true;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else if (this._transformDirty || this._parent._transformDirty !== 0 /* None */) {
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
                else if (this._cachedFrameIndex >= 0) {
                    this._transformDirty = false;
                    this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
                }
                else {
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
            }
            else if (this._transformDirty || this._parent._transformDirty !== 0 /* None */) {
                cacheFrameIndex = -1;
                this._transformDirty = true;
                this._cachedFrameIndex = -1;
            }
            if (this._transformDirty) {
                this._transformDirty = false;
                if (this._cachedFrameIndex < 0) {
                    this._updateGlobalTransformMatrix();
                    if (cacheFrameIndex >= 0) {
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                }
                this._updateTransform(false);
                this._updateState = 0;
            }
        };
        /**
         * @private
         */
        Slot.prototype._updateTransformAndMatrix = function () {
            if (this._updateState < 0) {
                this._updateState = 0;
                this._updateLocalTransformMatrix();
                this._updateGlobalTransformMatrix();
            }
        };
        /**
         * @private Factory
         */
        Slot.prototype._setDisplayList = function (value) {
            if (value && value.length > 0) {
                if (this._displayList.length !== value.length) {
                    this._displayList.length = value.length;
                }
                for (var i = 0, l = value.length; i < l; ++i) {
                    var eachDisplay = value[i];
                    if (eachDisplay && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                        !(eachDisplay instanceof dragonBones.Armature) && this._displayList.indexOf(eachDisplay) < 0) {
                        this._initDisplay(eachDisplay);
                    }
                    this._displayList[i] = eachDisplay;
                }
            }
            else if (this._displayList.length > 0) {
                this._displayList.length = 0;
            }
            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._displayDirty = this._display !== this._displayList[this._displayIndex];
            }
            else {
                this._displayDirty = this._display != null;
            }
            this._updateDisplayData();
            return this._displayDirty;
        };
        /**
         * @internal
         * @private
         */
        Slot.prototype._setDisplayIndex = function (value) {
            if (this._displayIndex === value) {
                return false;
            }
            this._displayIndex = value;
            this._displayDirty = true;
            this._updateDisplayData();
            return this._displayDirty;
        };
        /**
         * @internal
         * @private
         */
        Slot.prototype._setZorder = function (value) {
            if (this._zOrder === value) {
            }
            this._zOrder = value;
            this._zOrderDirty = true;
            return this._zOrderDirty;
        };
        /**
         * @internal
         * @private
         */
        Slot.prototype._setColor = function (value) {
            this._colorTransform.copyFrom(value);
            this._colorDirty = true;
            return true;
        };
        /**
         * @language zh_CN
         * 判断指定的点是否在插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @version DragonBones 5.0
         */
        Slot.prototype.containsPoint = function (x, y) {
            if (!this._boundingBoxData) {
                return false;
            }
            this._updateTransformAndMatrix();
            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(x, y, Slot._helpPoint);
            return this._boundingBoxData.containsPoint(Slot._helpPoint.x, Slot._helpPoint.y);
        };
        /**
         * @language zh_CN
         * 判断指定的线段与插槽的自定义包围盒是否相交。
         * @param xA 线段起点的水平坐标。（骨架内坐标系）
         * @param yA 线段起点的垂直坐标。（骨架内坐标系）
         * @param xB 线段终点的水平坐标。（骨架内坐标系）
         * @param yB 线段终点的垂直坐标。（骨架内坐标系）
         * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
         * @returns 相交的情况。 [-1: 不相交且线段在包围盒内, 0: 不相交, 1: 相交且有一个交点且终点在包围盒内, 2: 相交且有一个交点且起点在包围盒内, 3: 相交且有两个交点, N: 相交且有 N 个交点]
         * @version DragonBones 5.0
         */
        Slot.prototype.intersectsSegment = function (xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            if (!this._boundingBoxData) {
                return 0;
            }
            this._updateTransformAndMatrix();
            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(xA, yA, Slot._helpPoint);
            xA = Slot._helpPoint.x;
            yA = Slot._helpPoint.y;
            Slot._helpMatrix.transformPoint(xB, yB, Slot._helpPoint);
            xB = Slot._helpPoint.x;
            yB = Slot._helpPoint.y;
            var intersectionCount = this._boundingBoxData.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
            if (intersectionCount > 0) {
                if (intersectionCount === 1 || intersectionCount === 2) {
                    if (intersectionPointA) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                        if (intersectionPointB) {
                            intersectionPointB.x = intersectionPointA.x;
                            intersectionPointB.y = intersectionPointA.y;
                        }
                    }
                    else if (intersectionPointB) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }
                else {
                    if (intersectionPointA) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                    }
                    if (intersectionPointB) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }
                if (normalRadians) {
                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.x), Math.sin(normalRadians.x), Slot._helpPoint, true);
                    normalRadians.x = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);
                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.y), Math.sin(normalRadians.y), Slot._helpPoint, true);
                    normalRadians.y = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);
                }
            }
            return intersectionCount;
        };
        /**
         * @language zh_CN
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         */
        Slot.prototype.invalidUpdate = function () {
            this._displayDirty = true;
        };
        Object.defineProperty(Slot.prototype, "skinSlotData", {
            /**
             * @private
             */
            get: function () {
                return this._skinSlotData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "boundingBoxData", {
            /**
             * @language zh_CN
             * 插槽此时的自定义包围盒数据。
             * @see dragonBones.Armature
             * @version DragonBones 3.0
             */
            get: function () {
                return this._boundingBoxData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "rawDisplay", {
            /**
             * @private
             */
            get: function () {
                return this._rawDisplay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "meshDisplay", {
            /**
             * @private
             */
            get: function () {
                return this._meshDisplay;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "displayIndex", {
            /**
             * @language zh_CN
             * 此时显示的显示对象在显示列表中的索引。
             * @version DragonBones 4.5
             */
            get: function () {
                return this._displayIndex;
            },
            set: function (value) {
                if (this._setDisplayIndex(value)) {
                    this._update(-1);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "displayList", {
            /**
             * @language zh_CN
             * 包含显示对象或子骨架的显示列表。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._displayList.concat();
            },
            set: function (value) {
                var backupDisplayList = this._displayList.concat(); // Copy.
                var disposeDisplayList = [];
                if (this._setDisplayList(value)) {
                    this._update(-1);
                }
                // Release replaced render displays.
                for (var i = 0, l = backupDisplayList.length; i < l; ++i) {
                    var eachDisplay = backupDisplayList[i];
                    if (eachDisplay && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                        this._displayList.indexOf(eachDisplay) < 0 &&
                        disposeDisplayList.indexOf(eachDisplay) < 0) {
                        disposeDisplayList.push(eachDisplay);
                    }
                }
                for (var i = 0, l = disposeDisplayList.length; i < l; ++i) {
                    var eachDisplay = disposeDisplayList[i];
                    if (eachDisplay instanceof dragonBones.Armature) {
                        eachDisplay.dispose();
                    }
                    else {
                        this._disposeDisplay(eachDisplay);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "display", {
            /**
             * @language zh_CN
             * 此时显示的显示对象。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._display;
            },
            set: function (value) {
                if (this._display === value) {
                    return;
                }
                var displayListLength = this._displayList.length;
                if (this._displayIndex < 0 && displayListLength === 0) {
                    this._displayIndex = 0;
                }
                if (this._displayIndex < 0) {
                    return;
                }
                else {
                    var replaceDisplayList = this.displayList; // Copy.
                    if (displayListLength <= this._displayIndex) {
                        replaceDisplayList.length = this._displayIndex + 1;
                    }
                    replaceDisplayList[this._displayIndex] = value;
                    this.displayList = replaceDisplayList;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slot.prototype, "childArmature", {
            /**
             * @language zh_CN
             * 此时显示的子骨架。
             * @see dragonBones.Armature
             * @version DragonBones 3.0
             */
            get: function () {
                return this._childArmature;
            },
            set: function (value) {
                if (this._childArmature === value) {
                    return;
                }
                this.display = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see #display
         */
        Slot.prototype.getDisplay = function () {
            return this._display;
        };
        /**
         * @deprecated
         * @see #display
         */
        Slot.prototype.setDisplay = function (value) {
            this.display = value;
        };
        return Slot;
    }(dragonBones.TransformObject));
    /**
     * @private
     */
    Slot._helpPoint = new dragonBones.Point();
    /**
     * @private
     */
    Slot._helpMatrix = new dragonBones.Matrix();
    dragonBones.Slot = Slot;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     */
    var Armature = (function (_super) {
        __extends(Armature, _super);
        /**
         * @internal
         * @private
         */
        function Armature() {
            var _this = _super.call(this) || this;
            _this._bones = [];
            _this._slots = [];
            _this._actions = [];
            _this._events = [];
            /**
             * @deprecated
             * @see #cacheFrameRate
             */
            _this.enableCache = false;
            return _this;
        }
        /**
         * @private
         */
        Armature.toString = function () {
            return "[class dragonBones.Armature]";
        };
        Armature._onSortSlots = function (a, b) {
            return a._zOrder > b._zOrder ? 1 : -1;
        };
        /**
         * @private
         */
        Armature.prototype._onClear = function () {
            for (var i = 0, l = this._bones.length; i < l; ++i) {
                this._bones[i].returnToPool();
            }
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                this._slots[i].returnToPool();
            }
            for (var i = 0, l = this._events.length; i < l; ++i) {
                this._events[i].returnToPool();
            }
            if (this._clock) {
                this._clock.remove(this);
            }
            if (this._proxy) {
                this._proxy._onClear();
            }
            if (this._replaceTextureAtlasData) {
                this._replaceTextureAtlasData.returnToPool();
            }
            if (this._animation) {
                this._animation.returnToPool();
            }
            this.inheritAnimation = true;
            this.debugDraw = false;
            this.userData = null;
            this._debugDraw = false;
            this._delayDispose = false;
            this._lockDispose = false;
            this._bonesDirty = false;
            this._slotsDirty = false;
            this._bones.length = 0;
            this._slots.length = 0;
            this._actions.length = 0;
            this._events.length = 0;
            this._armatureData = null;
            this._skinData = null;
            this._animation = null;
            this._proxy = null;
            this._display = null;
            this._eventManager = null;
            this._parent = null;
            this._clock = null;
            this._replaceTextureAtlasData = null;
            this._replacedTexture = null;
        };
        Armature.prototype._sortBones = function () {
            var total = this._bones.length;
            if (total <= 0) {
                return;
            }
            var sortHelper = this._bones.concat();
            var index = 0;
            var count = 0;
            this._bones.length = 0;
            while (count < total) {
                var bone = sortHelper[index++];
                if (index >= total) {
                    index = 0;
                }
                if (this._bones.indexOf(bone) >= 0) {
                    continue;
                }
                if (bone.parent && this._bones.indexOf(bone.parent) < 0) {
                    continue;
                }
                if (bone.ik && this._bones.indexOf(bone.ik) < 0) {
                    continue;
                }
                if (bone.ik && bone.ikChain > 0 && bone.ikChainIndex === bone.ikChain) {
                    this._bones.splice(this._bones.indexOf(bone.parent) + 1, 0, bone); // ik, parent, bone, children
                }
                else {
                    this._bones.push(bone);
                }
                count++;
            }
        };
        Armature.prototype._sortSlots = function () {
            this._slots.sort(Armature._onSortSlots);
        };
        Armature.prototype._doAction = function (value) {
            switch (value.type) {
                case 0 /* Play */:
                    this._animation.playConfig(value.animationConfig);
                    break;
                default:
                    break;
            }
        };
        /**
         * @private
         */
        Armature.prototype._init = function (armatureData, skinData, proxy, display, eventManager) {
            if (this._armatureData) {
                return;
            }
            this._armatureData = armatureData;
            this._skinData = skinData;
            this._animation = dragonBones.BaseObject.borrowObject(dragonBones.Animation);
            this._proxy = proxy;
            this._display = display;
            this._eventManager = eventManager;
            this._animation._init(this);
            this._animation.animations = this._armatureData.animations;
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._addBoneToBoneList = function (value) {
            if (this._bones.indexOf(value) < 0) {
                this._bonesDirty = true;
                this._bones.push(value);
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._removeBoneFromBoneList = function (value) {
            var index = this._bones.indexOf(value);
            if (index >= 0) {
                this._bones.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._addSlotToSlotList = function (value) {
            if (this._slots.indexOf(value) < 0) {
                this._slotsDirty = true;
                this._slots.push(value);
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._removeSlotFromSlotList = function (value) {
            var index = this._slots.indexOf(value);
            if (index >= 0) {
                this._slots.splice(index, 1);
                this._animation._timelineStateDirty = true;
            }
        };
        /**
         * @private
         */
        Armature.prototype._sortZOrder = function (slotIndices) {
            var sortedSlots = this._armatureData.sortedSlots;
            var isOriginal = !slotIndices || slotIndices.length < 1;
            for (var i = 0, l = sortedSlots.length; i < l; ++i) {
                var slotIndex = isOriginal ? i : slotIndices[i];
                var slotData = sortedSlots[slotIndex];
                var slot = this.getSlot(slotData.name);
                if (slot) {
                    slot._setZorder(i);
                }
            }
            this._slotsDirty = true;
        };
        /**
         * @private
         */
        Armature.prototype._bufferAction = function (value) {
            this._actions.push(value);
        };
        /**
         * @internal
         * @private
         */
        Armature.prototype._bufferEvent = function (value, type) {
            value.type = type;
            value.armature = this;
            this._events.push(value);
        };
        /**
         * @language zh_CN
         * 释放骨架。 (回收到对象池)
         * @version DragonBones 3.0
         */
        Armature.prototype.dispose = function () {
            this._delayDispose = true;
            if (!this._lockDispose && this._armatureData) {
                this.returnToPool();
            }
        };
        /**
         * @language zh_CN
         * 更新骨架和动画。
         * @param passedTime 两帧之间的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @version DragonBones 3.0
         */
        Armature.prototype.advanceTime = function (passedTime) {
            if (!this._armatureData) {
                throw new Error("The armature has been disposed.");
            }
            else if (!this._armatureData.parent) {
                throw new Error("The armature data has been disposed.");
            }
            // Sort bones and slots.
            if (this._bonesDirty) {
                this._bonesDirty = false;
                this._sortBones();
            }
            if (this._slotsDirty) {
                this._slotsDirty = false;
                this._sortSlots();
            }
            var prevCacheFrameIndex = this._animation._cacheFrameIndex;
            // Update nimation.
            this._animation._advanceTime(passedTime);
            var currentCacheFrameIndex = this._animation._cacheFrameIndex;
            var i = 0, l = 0;
            // Update bones and slots.
            if (currentCacheFrameIndex < 0 || currentCacheFrameIndex !== prevCacheFrameIndex) {
                for (i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i]._update(currentCacheFrameIndex);
                }
                for (i = 0, l = this._slots.length; i < l; ++i) {
                    this._slots[i]._update(currentCacheFrameIndex);
                }
            }
            //
            var drawed = this.debugDraw || dragonBones.DragonBones.debugDraw;
            if (drawed || this._debugDraw) {
                this._debugDraw = drawed;
                this._proxy._debugDraw(this._debugDraw);
            }
            if (!this._lockDispose) {
                this._lockDispose = true;
                // Events. (Dispatch event before action.)
                l = this._events.length;
                if (l > 0) {
                    for (i = 0; i < l; ++i) {
                        var eventObject = this._events[i];
                        this._proxy._dispatchEvent(eventObject.type, eventObject);
                        if (eventObject.type === dragonBones.EventObject.SOUND_EVENT) {
                            this._eventManager._dispatchEvent(eventObject.type, eventObject);
                        }
                        eventObject.returnToPool();
                    }
                    this._events.length = 0;
                }
                // Actions.
                l = this._actions.length;
                if (l > 0) {
                    for (i = 0; i < l; ++i) {
                        var action = this._actions[i];
                        if (action.slot) {
                            var slot = this.getSlot(action.slot.name);
                            if (slot) {
                                var childArmature = slot.childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else if (action.bone) {
                            for (var iA = 0, lA = this._slots.length; iA < lA; ++iA) {
                                var childArmature = this._slots[iA].childArmature;
                                if (childArmature) {
                                    childArmature._doAction(action);
                                }
                            }
                        }
                        else {
                            this._doAction(action);
                        }
                    }
                    this._actions.length = 0;
                }
                this._lockDispose = false;
            }
            if (this._delayDispose) {
                this.returnToPool();
            }
        };
        /**
         * @language zh_CN
         * 更新骨骼和插槽。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
         * @param updateSlotDisplay 是否更新插槽的显示对象。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.invalidUpdate = function (boneName, updateSlotDisplay) {
            if (boneName === void 0) { boneName = null; }
            if (updateSlotDisplay === void 0) { updateSlotDisplay = false; }
            if (boneName) {
                var bone = this.getBone(boneName);
                if (bone) {
                    bone.invalidUpdate();
                    if (updateSlotDisplay) {
                        for (var i = 0, l = this._slots.length; i < l; ++i) {
                            var slot = this._slots[i];
                            if (slot.parent === bone) {
                                slot.invalidUpdate();
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0, l = this._bones.length; i < l; ++i) {
                    this._bones[i].invalidUpdate();
                }
                if (updateSlotDisplay) {
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        this._slots[i].invalidUpdate();
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 判断点是否在所有插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @version DragonBones 5.0
         */
        Armature.prototype.containsPoint = function (x, y) {
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                if (slot.containsPoint(x, y)) {
                    return slot;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 判断线段是否与骨架的所有插槽的自定义包围盒相交。
         * @param xA 线段起点的水平坐标。（骨架内坐标系）
         * @param yA 线段起点的垂直坐标。（骨架内坐标系）
         * @param xB 线段终点的水平坐标。（骨架内坐标系）
         * @param yB 线段终点的垂直坐标。（骨架内坐标系）
         * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
         * @returns 线段从起点到终点相交的第一个自定义包围盒的插槽。
         * @version DragonBones 5.0
         */
        Armature.prototype.intersectsSegment = function (xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians) {
            if (intersectionPointA === void 0) { intersectionPointA = null; }
            if (intersectionPointB === void 0) { intersectionPointB = null; }
            if (normalRadians === void 0) { normalRadians = null; }
            var isV = xA === xB;
            var dMin = 0.0;
            var dMax = 0.0;
            var intXA = 0.0;
            var intYA = 0.0;
            var intXB = 0.0;
            var intYB = 0.0;
            var intAN = 0.0;
            var intBN = 0.0;
            var intSlotA = null;
            var intSlotB = null;
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                var intersectionCount = slot.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
                if (intersectionCount > 0) {
                    if (intersectionPointA || intersectionPointB) {
                        if (intersectionPointA) {
                            var d = isV ? intersectionPointA.y - yA : intersectionPointA.x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }
                            if (!intSlotA || d < dMin) {
                                dMin = d;
                                intXA = intersectionPointA.x;
                                intYA = intersectionPointA.y;
                                intSlotA = slot;
                                if (normalRadians) {
                                    intAN = normalRadians.x;
                                }
                            }
                        }
                        if (intersectionPointB) {
                            var d = intersectionPointB.x - xA;
                            if (d < 0.0) {
                                d = -d;
                            }
                            if (!intSlotB || d > dMax) {
                                dMax = d;
                                intXB = intersectionPointB.x;
                                intYB = intersectionPointB.y;
                                intSlotB = slot;
                                if (normalRadians) {
                                    intBN = normalRadians.y;
                                }
                            }
                        }
                    }
                    else {
                        intSlotA = slot;
                        break;
                    }
                }
            }
            if (intSlotA && intersectionPointA) {
                intersectionPointA.x = intXA;
                intersectionPointA.y = intYA;
                if (normalRadians) {
                    normalRadians.x = intAN;
                }
            }
            if (intSlotB && intersectionPointB) {
                intersectionPointB.x = intXB;
                intersectionPointB.y = intYB;
                if (normalRadians) {
                    normalRadians.y = intBN;
                }
            }
            return intSlotA;
        };
        /**
         * @language zh_CN
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBone = function (name) {
            for (var i = 0, l = this._bones.length; i < l; ++i) {
                var bone = this._bones[i];
                if (bone.name === name) {
                    return bone;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 通过显示对象获取骨骼。
         * @param display 显示对象。
         * @returns 包含这个显示对象的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBoneByDisplay = function (display) {
            var slot = this.getSlotByDisplay(display);
            return slot ? slot.parent : null;
        };
        /**
         * @language zh_CN
         * 获取插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlot = function (name) {
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                if (slot.name === name) {
                    return slot;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 通过显示对象获取插槽。
         * @param display 显示对象。
         * @returns 包含这个显示对象的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlotByDisplay = function (display) {
            if (display) {
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    var slot = this._slots[i];
                    if (slot.display === display) {
                        return slot;
                    }
                }
            }
            return null;
        };
        /**
         * @deprecated
         */
        Armature.prototype.addBone = function (value, parentName) {
            if (parentName === void 0) { parentName = null; }
            if (value) {
                value._setArmature(this);
                value._setParent(parentName ? this.getBone(parentName) : null);
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @deprecated
         */
        Armature.prototype.removeBone = function (value) {
            if (value && value.armature === this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @deprecated
         */
        Armature.prototype.addSlot = function (value, parentName) {
            var bone = this.getBone(parentName);
            if (bone) {
                value._setArmature(this);
                value._setParent(bone);
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @deprecated
         */
        Armature.prototype.removeSlot = function (value) {
            if (value && value.armature === this) {
                value._setParent(null);
                value._setArmature(null);
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图类型。
         * @param texture 贴图。
         * @version DragonBones 4.5
         */
        Armature.prototype.replaceTexture = function (texture) {
            this.replacedTexture = texture;
        };
        /**
         * @language zh_CN
         * 获取所有骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        Armature.prototype.getBones = function () {
            return this._bones;
        };
        /**
         * @language zh_CN
         * 获取所有插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        Armature.prototype.getSlots = function () {
            return this._slots;
        };
        Object.defineProperty(Armature.prototype, "name", {
            /**
             * @language zh_CN
             * 骨架名称。
             * @see dragonBones.ArmatureData#name
             * @version DragonBones 3.0
             */
            get: function () {
                return this._armatureData ? this._armatureData.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "armatureData", {
            /**
             * @language zh_CN
             * 获取骨架数据。
             * @see dragonBones.ArmatureData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._armatureData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "animation", {
            /**
             * @language zh_CN
             * 获得动画控制器。
             * @see dragonBones.Animation
             * @version DragonBones 3.0
             */
            get: function () {
                return this._animation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "eventDispatcher", {
            /**
             * @language zh_CN
             * 获取事件监听器。
             * @version DragonBones 5.0
             */
            get: function () {
                return this._proxy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "display", {
            /**
             * @language zh_CN
             * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._display;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "parent", {
            /**
             * @language zh_CN
             * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
             * @see dragonBones.Slot
             * @version DragonBones 4.5
             */
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "cacheFrameRate", {
            /**
             * @language zh_CN
             * 动画缓存帧率，当设置的值大于 0 的时，将会开启动画缓存。
             * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
             * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
             * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
             * @see dragonBones.DragonBonesData#frameRate
             * @see dragonBones.ArmatureData#frameRate
             * @version DragonBones 4.5
             */
            get: function () {
                return this._armatureData.cacheFrameRate;
            },
            set: function (value) {
                if (this._armatureData.cacheFrameRate !== value) {
                    this._armatureData.cacheFrames(value);
                    // Set child armature frameRate.
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        var childArmature = this._slots[i].childArmature;
                        if (childArmature) {
                            childArmature.cacheFrameRate = value;
                        }
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "clock", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._clock;
            },
            set: function (value) {
                if (this._clock === value) {
                    return;
                }
                var prevClock = this._clock;
                this._clock = value;
                if (prevClock) {
                    prevClock.remove(this);
                }
                if (this._clock) {
                    this._clock.add(this);
                }
                // Update childArmature clock.
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    var childArmature = this._slots[i].childArmature;
                    if (childArmature) {
                        childArmature.clock = this._clock;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Armature.prototype, "replacedTexture", {
            /**
             * @language zh_CN
             * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
             * @version DragonBones 4.5
             */
            get: function () {
                return this._replacedTexture;
            },
            set: function (value) {
                if (this._replaceTextureAtlasData) {
                    this._replaceTextureAtlasData.returnToPool();
                    this._replaceTextureAtlasData = null;
                }
                this._replacedTexture = value;
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    var slot = this._slots[i];
                    slot.invalidUpdate();
                    slot._update(-1);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see dragonBones.Armature#eventDispatcher
         */
        Armature.prototype.hasEventListener = function (type) {
            return this._proxy.hasEvent(type);
        };
        /**
         * @deprecated
         * @see dragonBones.Armature#eventDispatcher
         */
        Armature.prototype.addEventListener = function (type, listener, target) {
            this._proxy.addEvent(type, listener, target);
        };
        /**
         * @deprecated
         * @see dragonBones.Armature#eventDispatcher
         */
        Armature.prototype.removeEventListener = function (type, listener, target) {
            this._proxy.removeEvent(type, listener, target);
        };
        /**
         * @deprecated
         * @see #cacheFrameRate
         */
        Armature.prototype.enableAnimationCache = function (frameRate) {
            this.cacheFrameRate = frameRate;
        };
        /**
         * @deprecated
         * @see #display
         */
        Armature.prototype.getDisplay = function () {
            return this._display;
        };
        return Armature;
    }(dragonBones.BaseObject));
    dragonBones.Armature = Armature;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画控制器，用来播放动画数据，管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    var Animation = (function (_super) {
        __extends(Animation, _super);
        /**
         * @internal
         * @private
         */
        function Animation() {
            var _this = _super.call(this) || this;
            _this._animationNames = [];
            _this._animations = {};
            _this._animationStates = [];
            return _this;
        }
        Animation._sortAnimationState = function (a, b) {
            return a.layer > b.layer ? -1 : 1;
        };
        /**
         * @private
         */
        Animation.toString = function () {
            return "[class dragonBones.Animation]";
        };
        /**
         * @private
         */
        Animation.prototype._onClear = function () {
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }
            if (this._animationConfig) {
                this._animationConfig.returnToPool();
            }
            for (var k in this._animations) {
                delete this._animations[k];
            }
            this.timeScale = 1.0;
            this._isPlaying = false;
            this._animationStateDirty = false;
            this._timelineStateDirty = false;
            this._cacheFrameIndex = -1;
            this._animationNames.length = 0;
            //this._animations.clear();
            this._animationStates.length = 0;
            this._armature = null;
            this._lastAnimationState = null;
            this._animationConfig = null;
        };
        Animation.prototype._fadeOut = function (animationConfig) {
            var i = 0, l = this._animationStates.length;
            var animationState = null;
            switch (animationConfig.fadeOutMode) {
                case 1 /* SameLayer */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.layer === animationConfig.layer) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;
                case 2 /* SameGroup */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.group === animationConfig.group) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;
                case 3 /* SameLayerAndGroup */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        if (animationState.layer === animationConfig.layer &&
                            animationState.group === animationConfig.group) {
                            animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                        }
                    }
                    break;
                case 4 /* All */:
                    for (; i < l; ++i) {
                        animationState = this._animationStates[i];
                        animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                    }
                    break;
                case 0 /* None */:
                default:
                    break;
            }
        };
        /**
         * @internal
         * @private
         */
        Animation.prototype._init = function (armature) {
            if (this._armature) {
                return;
            }
            this._armature = armature;
            this._animationConfig = dragonBones.BaseObject.borrowObject(dragonBones.AnimationConfig);
        };
        /**
         * @internal
         * @private
         */
        Animation.prototype._advanceTime = function (passedTime) {
            if (!this._isPlaying) {
                return;
            }
            if (passedTime < 0.0) {
                passedTime = -passedTime;
            }
            if (this._armature.inheritAnimation && this._armature._parent) {
                passedTime *= this._armature._parent._armature.animation.timeScale;
            }
            if (this.timeScale !== 1.0) {
                passedTime *= this.timeScale;
            }
            var animationStateCount = this._animationStates.length;
            if (animationStateCount === 1) {
                var animationState = this._animationStates[0];
                if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                    animationState.returnToPool();
                    this._animationStates.length = 0;
                    this._animationStateDirty = true;
                    this._lastAnimationState = null;
                }
                else {
                    var animationData = animationState.animationData;
                    var cacheFrameRate = animationData.cacheFrameRate;
                    if (this._animationStateDirty && cacheFrameRate > 0.0) {
                        this._animationStateDirty = false;
                        var bones = this._armature.getBones();
                        for (var i = 0, l = bones.length; i < l; ++i) {
                            var bone = bones[i];
                            bone._cachedFrameIndices = animationData.getBoneCachedFrameIndices(bone.name);
                        }
                        var slots = this._armature.getSlots();
                        for (var i = 0, l = slots.length; i < l; ++i) {
                            var slot = slots[i];
                            slot._cachedFrameIndices = animationData.getSlotCachedFrameIndices(slot.name);
                        }
                    }
                    if (this._timelineStateDirty) {
                        animationState._updateTimelineStates();
                    }
                    animationState._advanceTime(passedTime, cacheFrameRate);
                }
            }
            else if (animationStateCount > 1) {
                for (var i = 0, r = 0; i < animationStateCount; ++i) {
                    var animationState = this._animationStates[i];
                    if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                        r++;
                        animationState.returnToPool();
                        this._animationStateDirty = true;
                        if (this._lastAnimationState === animationState) {
                            this._lastAnimationState = null;
                        }
                    }
                    else {
                        if (r > 0) {
                            this._animationStates[i - r] = animationState;
                        }
                        if (this._timelineStateDirty) {
                            animationState._updateTimelineStates();
                        }
                        animationState._advanceTime(passedTime, 0.0);
                    }
                    if (i === animationStateCount - 1 && r > 0) {
                        this._animationStates.length -= r;
                        if (!this._lastAnimationState && this._animationStates.length > 0) {
                            this._lastAnimationState = this._animationStates[this._animationStates.length - 1];
                        }
                    }
                }
                this._cacheFrameIndex = -1;
            }
            else {
                this._cacheFrameIndex = -1;
            }
            this._timelineStateDirty = false;
        };
        /**
         * @language zh_CN
         * 清除所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.reset = function () {
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                this._animationStates[i].returnToPool();
            }
            this._isPlaying = false;
            this._animationStateDirty = false;
            this._timelineStateDirty = false;
            this._cacheFrameIndex = -1;
            this._animationConfig.clear();
            this._animationStates.length = 0;
            this._lastAnimationState = null;
        };
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        Animation.prototype.stop = function (animationName) {
            if (animationName === void 0) { animationName = null; }
            if (animationName) {
                var animationState = this.getState(animationName);
                if (animationState) {
                    animationState.stop();
                }
            }
            else {
                this._isPlaying = false;
            }
        };
        /**
         * @language zh_CN
         * @beta
         * 通过动画配置来播放动画。
         * @param animationConfig 动画配置。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationConfig
         * @see dragonBones.AnimationState
         * @version DragonBones 5.0
         */
        Animation.prototype.playConfig = function (animationConfig) {
            if (!animationConfig) {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
            var animationName = animationConfig.animationName ? animationConfig.animationName : animationConfig.name;
            var animationData = this._animations[animationName];
            if (!animationData) {
                console.warn("Non-existent animation.\n", "DragonBones name: " + this._armature.armatureData.parent.name, "Armature name: " + this._armature.name, "Animation name: " + animationName);
                return null;
            }
            this._isPlaying = true;
            if (animationConfig.playTimes < 0) {
                animationConfig.playTimes = animationData.playTimes;
            }
            if (animationConfig.fadeInTime < 0.0 || animationConfig.fadeInTime !== animationConfig.fadeInTime) {
                if (this._lastAnimationState) {
                    animationConfig.fadeInTime = animationData.fadeInTime;
                }
                else {
                    animationConfig.fadeInTime = 0.0;
                }
            }
            if (animationConfig.fadeOutTime < 0.0 || animationConfig.fadeOutTime !== animationConfig.fadeOutTime) {
                animationConfig.fadeOutTime = animationConfig.fadeInTime;
            }
            if (animationConfig.timeScale <= -100.0 || animationConfig.timeScale !== animationConfig.timeScale) {
                animationConfig.timeScale = 1.0 / animationData.scale;
            }
            if (animationData.duration > 0.0) {
                if (animationConfig.position !== animationConfig.position) {
                    animationConfig.position = 0.0;
                }
                else if (animationConfig.position < 0.0) {
                    animationConfig.position %= animationData.duration;
                    animationConfig.position = animationData.duration - animationConfig.position;
                }
                else if (animationConfig.position === animationData.duration) {
                    animationConfig.position -= 0.001;
                }
                else if (animationConfig.position > animationData.duration) {
                    animationConfig.position %= animationData.duration;
                }
                if (animationConfig.position + animationConfig.duration > animationData.duration) {
                    animationConfig.duration = animationData.duration - animationConfig.position;
                }
            }
            else {
                animationConfig.position = 0.0;
                animationConfig.duration = -1.0;
            }
            var isStop = animationConfig.duration === 0.0;
            if (isStop) {
                animationConfig.playTimes = 1;
                animationConfig.duration = -1.0;
                animationConfig.fadeInTime = 0.0;
            }
            this._fadeOut(animationConfig);
            this._lastAnimationState = dragonBones.BaseObject.borrowObject(dragonBones.AnimationState);
            this._lastAnimationState._init(this._armature, animationData, animationConfig);
            this._animationStates.push(this._lastAnimationState);
            this._animationStateDirty = true;
            this._cacheFrameIndex = -1;
            if (this._animationStates.length > 1) {
                this._animationStates.sort(Animation._sortAnimationState);
            }
            // Child armature play same name animation.
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var childArmature = slots[i].childArmature;
                if (childArmature && childArmature.inheritAnimation &&
                    childArmature.animation.hasAnimation(animationName) &&
                    !childArmature.animation.getState(animationName)) {
                    childArmature.animation.fadeIn(animationName); //
                }
            }
            if (animationConfig.fadeInTime <= 0.0) {
                this._armature.advanceTime(0.0);
            }
            if (isStop) {
                this._lastAnimationState.stop();
            }
            return this._lastAnimationState;
        };
        /**
         * @language zh_CN
         * 淡入播放动画。
         * @param animationName 动画数据名称。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
         * @param layer 混合图层，图层高会优先获取混合权重。
         * @param group 混合组，用于动画状态编组，方便控制淡出。
         * @param fadeOutMode 淡出模式。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationFadeOutMode
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.fadeIn = function (animationName, fadeInTime, playTimes, layer, group, fadeOutMode) {
            if (fadeInTime === void 0) { fadeInTime = -1.0; }
            if (playTimes === void 0) { playTimes = -1; }
            if (layer === void 0) { layer = 0; }
            if (group === void 0) { group = null; }
            if (fadeOutMode === void 0) { fadeOutMode = 3 /* SameLayerAndGroup */; }
            this._animationConfig.clear();
            this._animationConfig.fadeOutMode = fadeOutMode;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.layer = layer;
            this._animationConfig.fadeInTime = fadeInTime;
            this._animationConfig.animationName = animationName;
            this._animationConfig.group = group;
            return this.playConfig(this._animationConfig);
        };
        /**
         * @language zh_CN
         * 播放动画。
         * @param animationName 动画数据名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        Animation.prototype.play = function (animationName, playTimes) {
            if (animationName === void 0) { animationName = null; }
            if (playTimes === void 0) { playTimes = -1; }
            this._animationConfig.clear();
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animationName = animationName;
            if (animationName) {
                this.playConfig(this._animationConfig);
            }
            else if (!this._lastAnimationState) {
                var defaultAnimation = this._armature.armatureData.defaultAnimation;
                if (defaultAnimation) {
                    this._animationConfig.animationName = defaultAnimation.name;
                    this.playConfig(this._animationConfig);
                }
            }
            else if (!this._isPlaying || (!this._lastAnimationState.isPlaying && !this._lastAnimationState.isCompleted)) {
                this._isPlaying = true;
                this._lastAnimationState.play();
            }
            else {
                this._animationConfig.animationName = this._lastAnimationState.name;
                this.playConfig(this._animationConfig);
            }
            return this._lastAnimationState;
        };
        /**
         * @language zh_CN
         * 从指定时间开始播放动画。
         * @param animationName 动画数据的名称。
         * @param time 开始时间。 (以秒为单位)
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndPlayByTime = function (animationName, time, playTimes) {
            if (time === void 0) { time = 0.0; }
            if (playTimes === void 0) { playTimes = -1; }
            this._animationConfig.clear();
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.position = time;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animationName = animationName;
            return this.playConfig(this._animationConfig);
        };
        /**
         * @language zh_CN
         * 从指定帧开始播放动画。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndPlayByFrame = function (animationName, frame, playTimes) {
            if (frame === void 0) { frame = 0; }
            if (playTimes === void 0) { playTimes = -1; }
            this._animationConfig.clear();
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animationName = animationName;
            var animationData = this._animations[animationName];
            if (animationData) {
                this._animationConfig.position = animationData.duration * frame / animationData.frameCount;
            }
            return this.playConfig(this._animationConfig);
        };
        /**
         * @language zh_CN
         * 从指定进度开始播放动画。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndPlayByProgress = function (animationName, progress, playTimes) {
            if (progress === void 0) { progress = 0.0; }
            if (playTimes === void 0) { playTimes = -1; }
            this._animationConfig.clear();
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.fadeInTime = 0.0;
            this._animationConfig.animationName = animationName;
            var animationData = this._animations[animationName];
            if (animationData) {
                this._animationConfig.position = animationData.duration * (progress > 0.0 ? progress : 0.0);
            }
            return this.playConfig(this._animationConfig);
        };
        /**
         * @language zh_CN
         * 将动画停止到指定的时间。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndStopByTime = function (animationName, time) {
            if (time === void 0) { time = 0.0; }
            var animationState = this.gotoAndPlayByTime(animationName, time, 1);
            if (animationState) {
                animationState.stop();
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 将动画停止到指定的帧。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndStopByFrame = function (animationName, frame) {
            if (frame === void 0) { frame = 0; }
            var animationState = this.gotoAndPlayByFrame(animationName, frame, 1);
            if (animationState) {
                animationState.stop();
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 将动画停止到指定的进度。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0 ~ 1]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        Animation.prototype.gotoAndStopByProgress = function (animationName, progress) {
            if (progress === void 0) { progress = 0.0; }
            var animationState = this.gotoAndPlayByProgress(animationName, progress, 1);
            if (animationState) {
                animationState.stop();
            }
            return animationState;
        };
        /**
         * @language zh_CN
         * 获取动画状态。
         * @param animationName 动画状态的名称。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        Animation.prototype.getState = function (animationName) {
            for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                var animationState = this._animationStates[i];
                if (animationState.name === animationName) {
                    return animationState;
                }
            }
            return null;
        };
        /**
         * @language zh_CN
         * 是否包含动画数据。
         * @param animationName 动画数据的名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        Animation.prototype.hasAnimation = function (animationName) {
            return this._animations[animationName] != null;
        };
        Object.defineProperty(Animation.prototype, "isPlaying", {
            /**
             * @language zh_CN
             * 动画是否处于播放状态。
             * @version DragonBones 3.0
             */
            get: function () {
                if (this._animationStates.length > 1) {
                    return this._isPlaying && !this.isCompleted;
                }
                else if (this._lastAnimationState) {
                    return this._isPlaying && this._lastAnimationState.isPlaying;
                }
                return this._isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "isCompleted", {
            /**
             * @language zh_CN
             * 所有动画状态是否均已播放完毕。
             * @see dragonBones.AnimationState
             * @version DragonBones 3.0
             */
            get: function () {
                if (this._lastAnimationState) {
                    if (!this._lastAnimationState.isCompleted) {
                        return false;
                    }
                    for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                        if (!this._animationStates[i].isCompleted) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "lastAnimationName", {
            /**
             * @language zh_CN
             * 上一个正在播放的动画状态名称。
             * @see #lastAnimationState
             * @version DragonBones 3.0
             */
            get: function () {
                return this._lastAnimationState ? this._lastAnimationState.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "lastAnimationState", {
            /**
             * @language zh_CN
             * 上一个正在播放的动画状态。
             * @see dragonBones.AnimationState
             * @version DragonBones 3.0
             */
            get: function () {
                return this._lastAnimationState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animationConfig", {
            /**
             * @language zh_CN
             * 一个可以快速使用的动画配置实例。
             * @see dragonBones.AnimationConfig
             * @version DragonBones 5.0
             */
            get: function () {
                return this._animationConfig;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animationNames", {
            /**
             * @language zh_CN
             * 所有动画数据名称。
             * @see #animations
             * @version DragonBones 4.5
             */
            get: function () {
                return this._animationNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animations", {
            /**
             * @language zh_CN
             * 所有动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 4.5
             */
            get: function () {
                return this._animations;
            },
            set: function (value) {
                if (this._animations === value) {
                    return;
                }
                this._animationNames.length = 0;
                for (var k in this._animations) {
                    delete this._animations[k];
                }
                if (value) {
                    for (var k in value) {
                        this._animations[k] = value[k];
                        this._animationNames.push(k);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see #play()
         * @see #fadeIn()
         * @see #gotoAndPlayByTime()
         * @see #gotoAndPlayByFrame()
         * @see #gotoAndPlayByProgress()
         */
        Animation.prototype.gotoAndPlay = function (animationName, fadeInTime, duration, playTimes, layer, group, fadeOutMode, pauseFadeOut, pauseFadeIn) {
            if (fadeInTime === void 0) { fadeInTime = -1; }
            if (duration === void 0) { duration = -1; }
            if (playTimes === void 0) { playTimes = -1; }
            if (layer === void 0) { layer = 0; }
            if (group === void 0) { group = null; }
            if (fadeOutMode === void 0) { fadeOutMode = 3 /* SameLayerAndGroup */; }
            if (pauseFadeOut === void 0) { pauseFadeOut = true; }
            if (pauseFadeIn === void 0) { pauseFadeIn = true; }
            this._animationConfig.clear();
            this._animationConfig.fadeOutMode = fadeOutMode;
            this._animationConfig.playTimes = playTimes;
            this._animationConfig.layer = layer;
            this._animationConfig.fadeInTime = fadeInTime;
            this._animationConfig.animationName = animationName;
            this._animationConfig.group = group;
            var animationData = this._animations[animationName];
            if (animationData && duration > 0) {
                this._animationConfig.timeScale = animationData.duration / duration;
            }
            return this.playConfig(this._animationConfig);
        };
        /**
         * @deprecated
         * @see #gotoAndStopByTime()
         * @see #gotoAndStopByFrame()
         * @see #gotoAndStopByProgress()
         */
        Animation.prototype.gotoAndStop = function (animationName, time) {
            if (time === void 0) { time = 0; }
            return this.gotoAndStopByTime(animationName, time);
        };
        Object.defineProperty(Animation.prototype, "animationList", {
            /**
             * @deprecated
             * @see #animationNames
             * @see #animations
             */
            get: function () {
                return this._animationNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animation.prototype, "animationDataList", {
            /**
             * @deprecated
             * @see #animationNames
             * @see #animations
             */
            get: function () {
                var list = [];
                for (var i = 0, l = this._animationNames.length; i < l; ++i) {
                    list.push(this._animations[this._animationNames[i]]);
                }
                return list;
            },
            enumerable: true,
            configurable: true
        });
        return Animation;
    }(dragonBones.BaseObject));
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.None
     */
    Animation.None = 0 /* None */;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.SameLayer
     */
    Animation.SameLayer = 1 /* SameLayer */;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.SameGroup
     */
    Animation.SameGroup = 2 /* SameGroup */;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.SameLayerAndGroup
     */
    Animation.SameLayerAndGroup = 3 /* SameLayerAndGroup */;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.All
     */
    Animation.All = 4 /* All */;
    dragonBones.Animation = Animation;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 动画状态，播放动画时产生，可以对每个播放的动画进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    var AnimationState = (function (_super) {
        __extends(AnimationState, _super);
        /**
         * @internal
         * @private
         */
        function AnimationState() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this._boneMask = [];
            /**
             * @private
             */
            _this._animationNames = [];
            /**
             * @private
             */
            _this._boneTimelines = [];
            /**
             * @private
             */
            _this._slotTimelines = [];
            /**
             * @private
             */
            _this._ffdTimelines = [];
            /**
             * @deprecated
             */
            _this.autoTween = false;
            return _this;
        }
        /**
         * @private
         */
        AnimationState.toString = function () {
            return "[class dragonBones.AnimationState]";
        };
        /**
         * @private
         */
        AnimationState.prototype._onClear = function () {
            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                this._boneTimelines[i].returnToPool();
            }
            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                this._slotTimelines[i].returnToPool();
            }
            for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                this._ffdTimelines[i].returnToPool();
            }
            if (this._timeline) {
                this._timeline.returnToPool();
            }
            if (this._zOrderTimeline) {
                this._zOrderTimeline.returnToPool();
            }
            this.displayControl = true;
            this.additiveBlending = false;
            this.actionEnabled = false;
            this.playTimes = 1;
            this.timeScale = 1.0;
            this.weight = 1.0;
            this.autoFadeOutTime = -1.0;
            this.fadeTotalTime = 0.0;
            this._playheadState = 0;
            this._fadeState = -1;
            this._subFadeState = -1;
            this._layer = 0;
            this._position = 0.0;
            this._duration = 0.0;
            this._fadeTime = 0.0;
            this._time = 0.0;
            this._fadeProgress = 0.0;
            this._weightResult = 0.0;
            this._name = null;
            this._group = null;
            this._boneMask.length = 0;
            this._animationNames.length = 0;
            this._boneTimelines.length = 0;
            this._slotTimelines.length = 0;
            this._ffdTimelines.length = 0;
            this._animationData = null;
            this._armature = null;
            this._timeline = null;
            this._zOrderTimeline = null;
        };
        AnimationState.prototype._advanceFadeTime = function (passedTime) {
            var isFadeOut = this._fadeState > 0;
            if (this._subFadeState < 0) {
                this._subFadeState = 0;
                var eventType = isFadeOut ? dragonBones.EventObject.FADE_OUT : dragonBones.EventObject.FADE_IN;
                if (this._armature.eventDispatcher.hasEvent(eventType)) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.animationState = this;
                    this._armature._bufferEvent(eventObject, eventType);
                }
            }
            if (passedTime < 0.0) {
                passedTime = -passedTime;
            }
            this._fadeTime += passedTime;
            if (this._fadeTime >= this.fadeTotalTime) {
                this._subFadeState = 1;
                this._fadeProgress = isFadeOut ? 0.0 : 1.0;
            }
            else if (this._fadeTime > 0.0) {
                this._fadeProgress = isFadeOut ? (1.0 - this._fadeTime / this.fadeTotalTime) : (this._fadeTime / this.fadeTotalTime);
            }
            else {
                this._fadeProgress = isFadeOut ? 1.0 : 0.0;
            }
            if (this._subFadeState > 0) {
                if (!isFadeOut) {
                    this._playheadState |= 1; // x1
                    this._fadeState = 0;
                }
                var eventType = isFadeOut ? dragonBones.EventObject.FADE_OUT_COMPLETE : dragonBones.EventObject.FADE_IN_COMPLETE;
                if (this._armature.eventDispatcher.hasEvent(eventType)) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.animationState = this;
                    this._armature._bufferEvent(eventObject, eventType);
                }
            }
        };
        /**
         * @internal
         * @private
         */
        AnimationState.prototype._init = function (armature, animationData, animationConfig) {
            this._armature = armature;
            this._animationData = animationData;
            this._name = animationConfig.name ? animationConfig.name : animationConfig.animationName;
            this.actionEnabled = animationConfig.actionEnabled;
            this.additiveBlending = animationConfig.additiveBlending;
            this.displayControl = animationConfig.displayControl;
            this.playTimes = animationConfig.playTimes;
            this.timeScale = animationConfig.timeScale;
            this.fadeTotalTime = animationConfig.fadeInTime;
            this.autoFadeOutTime = animationConfig.autoFadeOutTime;
            this.weight = animationConfig.weight;
            if (animationConfig.pauseFadeIn) {
                this._playheadState = 2; // 10
            }
            else {
                this._playheadState = 3; // 11
            }
            this._fadeState = -1;
            this._subFadeState = -1;
            this._layer = animationConfig.layer;
            this._time = animationConfig.position;
            this._group = animationConfig.group;
            if (animationConfig.duration < 0.0) {
                this._position = 0.0;
                this._duration = this._animationData.duration;
            }
            else {
                this._position = animationConfig.position;
                this._duration = animationConfig.duration;
            }
            if (this.fadeTotalTime <= 0.0) {
                this._fadeProgress = 0.999999;
            }
            if (animationConfig.boneMask.length > 0) {
                this._boneMask.length = animationConfig.boneMask.length;
                for (var i = 0, l = this._boneMask.length; i < l; ++i) {
                    this._boneMask[i] = animationConfig.boneMask[i];
                }
            }
            if (animationConfig.animationNames.length > 0) {
                this._animationNames.length = animationConfig.animationNames.length;
                for (var i = 0, l = this._animationNames.length; i < l; ++i) {
                    this._animationNames[i] = animationConfig.animationNames[i];
                }
            }
            this._timeline = dragonBones.BaseObject.borrowObject(dragonBones.AnimationTimelineState);
            this._timeline._init(this._armature, this, this._animationData);
            if (this._animationData.zOrderTimeline) {
                this._zOrderTimeline = dragonBones.BaseObject.borrowObject(dragonBones.ZOrderTimelineState);
                this._zOrderTimeline._init(this._armature, this, this._animationData.zOrderTimeline);
            }
            this._updateTimelineStates();
        };
        /**
         * @internal
         * @private
         */
        AnimationState.prototype._updateTimelineStates = function () {
            var boneTimelineStates = {};
            var slotTimelineStates = {};
            var ffdTimelineStates = {};
            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                var boneTimelineState = this._boneTimelines[i];
                boneTimelineStates[boneTimelineState.bone.name] = boneTimelineState;
            }
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                var boneTimelineName = bone.name;
                if (this.containsBoneMask(boneTimelineName)) {
                    var boneTimelineData = this._animationData.getBoneTimeline(boneTimelineName);
                    if (boneTimelineData) {
                        if (boneTimelineStates[boneTimelineName]) {
                            delete boneTimelineStates[boneTimelineName];
                        }
                        else {
                            var boneTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.BoneTimelineState);
                            boneTimelineState.bone = bone;
                            boneTimelineState._init(this._armature, this, boneTimelineData);
                            this._boneTimelines.push(boneTimelineState);
                        }
                    }
                }
            }
            for (var k in boneTimelineStates) {
                var boneTimelineState = boneTimelineStates[k];
                boneTimelineState.bone.invalidUpdate(); //
                this._boneTimelines.splice(this._boneTimelines.indexOf(boneTimelineState), 1);
                boneTimelineState.returnToPool();
            }
            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                var slotTimelineState = this._slotTimelines[i];
                slotTimelineStates[slotTimelineState.slot.name] = slotTimelineState;
            }
            for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                var ffdTimelineState = this._ffdTimelines[i];
                var display = ffdTimelineState._timelineData.display;
                var meshName = display.inheritAnimation ? display.mesh.name : display.name;
                ffdTimelineStates[meshName] = ffdTimelineState;
            }
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                var slotTimelineName = slot.name;
                var parentTimelineName = slot.parent.name;
                var resetFFDVertices = false;
                if (this.containsBoneMask(parentTimelineName)) {
                    var slotTimelineData = this._animationData.getSlotTimeline(slotTimelineName);
                    if (slotTimelineData) {
                        if (slotTimelineStates[slotTimelineName]) {
                            delete slotTimelineStates[slotTimelineName];
                        }
                        else {
                            var slotTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.SlotTimelineState);
                            slotTimelineState.slot = slot;
                            slotTimelineState._init(this._armature, this, slotTimelineData);
                            this._slotTimelines.push(slotTimelineState);
                        }
                    }
                    var ffdTimelineDatas = this._animationData.getFFDTimeline(this._armature._skinData.name, slotTimelineName);
                    if (ffdTimelineDatas) {
                        for (var k in ffdTimelineDatas) {
                            if (ffdTimelineStates[k]) {
                                delete ffdTimelineStates[k];
                            }
                            else {
                                var ffdTimelineState = dragonBones.BaseObject.borrowObject(dragonBones.FFDTimelineState);
                                ffdTimelineState.slot = slot;
                                ffdTimelineState._init(this._armature, this, ffdTimelineDatas[k]);
                                this._ffdTimelines.push(ffdTimelineState);
                            }
                        }
                    }
                    else {
                        resetFFDVertices = true;
                    }
                }
                else {
                    resetFFDVertices = true;
                }
                if (resetFFDVertices) {
                    for (var iA = 0, lA = slot._ffdVertices.length; iA < lA; ++iA) {
                        slot._ffdVertices[iA] = 0.0;
                    }
                    slot._meshDirty = true;
                }
            }
            for (var k in slotTimelineStates) {
                var slotTimelineState = slotTimelineStates[k];
                this._slotTimelines.splice(this._slotTimelines.indexOf(slotTimelineState), 1);
                slotTimelineState.returnToPool();
            }
            for (var k in ffdTimelineStates) {
                var ffdTimelineState = ffdTimelineStates[k];
                this._ffdTimelines.splice(this._ffdTimelines.indexOf(ffdTimelineState), 1);
                ffdTimelineState.returnToPool();
            }
        };
        /**
         * @internal
         * @private
         */
        AnimationState.prototype._advanceTime = function (passedTime, cacheFrameRate) {
            // Update fade time.
            if (this._fadeState !== 0 || this._subFadeState !== 0) {
                this._advanceFadeTime(passedTime);
            }
            // Update time.
            if (this.timeScale !== 1.0) {
                passedTime *= this.timeScale;
            }
            if (passedTime !== 0.0 && this._playheadState === 3) {
                this._time += passedTime;
            }
            // Weight.
            this._weightResult = this.weight * this._fadeProgress;
            if (this._weightResult !== 0.0) {
                var isCacheEnabled = this._fadeState === 0 && cacheFrameRate > 0.0;
                var isUpdatesTimeline = true;
                var isUpdatesBoneTimeline = true;
                var time = this._time;
                // Update main timeline.
                this._timeline.update(time);
                // Cache time internval.
                if (isCacheEnabled) {
                    this._timeline._currentTime = Math.floor(this._timeline._currentTime * cacheFrameRate) / cacheFrameRate;
                }
                // Update zOrder timeline.
                if (this._zOrderTimeline) {
                    this._zOrderTimeline.update(time);
                }
                // Update cache.
                if (isCacheEnabled) {
                    var cacheFrameIndex = Math.floor(this._timeline._currentTime * cacheFrameRate); // uint
                    if (this._armature.animation._cacheFrameIndex === cacheFrameIndex) {
                        isUpdatesTimeline = false;
                        isUpdatesBoneTimeline = false;
                    }
                    else {
                        this._armature.animation._cacheFrameIndex = cacheFrameIndex;
                        if (this._animationData.cachedFrames[cacheFrameIndex]) {
                            isUpdatesBoneTimeline = false;
                        }
                        else {
                            this._animationData.cachedFrames[cacheFrameIndex] = true;
                        }
                    }
                }
                // Update timelines.
                if (isUpdatesTimeline) {
                    if (isUpdatesBoneTimeline) {
                        for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                            this._boneTimelines[i].update(time);
                        }
                    }
                    for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                        this._slotTimelines[i].update(time);
                    }
                    for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                        this._ffdTimelines[i].update(time);
                    }
                }
            }
            if (this._fadeState === 0) {
                if (this._subFadeState > 0) {
                    this._subFadeState = 0;
                }
                if (this._timeline._playState > 0) {
                    // Auto fade out.
                    if (this.autoFadeOutTime >= 0.0) {
                        this.fadeOut(this.autoFadeOutTime);
                    }
                    if (this._animationNames.length > 0) {
                    }
                }
            }
        };
        /**
         * @internal
         * @private
         */
        AnimationState.prototype._isDisabled = function (slot) {
            if (this.displayControl &&
                (!slot.displayController ||
                    slot.displayController === this._name ||
                    slot.displayController === this._group)) {
                return false;
            }
            return true;
        };
        /**
         * @language zh_CN
         * 继续播放。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.play = function () {
            this._playheadState = 3; // 11
        };
        /**
         * @language zh_CN
         * 暂停播放。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.stop = function () {
            this._playheadState &= 1; // 0x
        };
        /**
         * @language zh_CN
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.fadeOut = function (fadeOutTime, pausePlayhead) {
            if (pausePlayhead === void 0) { pausePlayhead = true; }
            if (fadeOutTime < 0.0 || fadeOutTime !== fadeOutTime) {
                fadeOutTime = 0.0;
            }
            if (pausePlayhead) {
                this._playheadState &= 2; // x0
            }
            if (this._fadeState > 0) {
                if (fadeOutTime > fadeOutTime - this._fadeTime) {
                    // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            }
            else {
                this._fadeState = 1;
                this._subFadeState = -1;
                if (fadeOutTime <= 0.0 || this._fadeProgress <= 0.0) {
                    this._fadeProgress = 0.000001; // Modify _fadeProgress to different value.
                }
                for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                    this._boneTimelines[i].fadeOut();
                }
                for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    this._slotTimelines[i].fadeOut();
                }
                for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                    this._ffdTimelines[i].fadeOut();
                }
            }
            this.displayControl = false; //
            this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0.0;
            this._fadeTime = this.fadeTotalTime * (1.0 - this._fadeProgress);
        };
        /**
         * @language zh_CN
         * 是否包含骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.containsBoneMask = function (name) {
            return this._boneMask.length === 0 || this._boneMask.indexOf(name) >= 0;
        };
        /**
         * @language zh_CN
         * 添加骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.addBoneMask = function (name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var currentBone = this._armature.getBone(name);
            if (!currentBone) {
                return;
            }
            if (this._boneMask.indexOf(name) < 0) {
                this._boneMask.push(name);
            }
            if (recursive) {
                var bones = this._armature.getBones();
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    if (this._boneMask.indexOf(bone.name) < 0 && currentBone.contains(bone)) {
                        this._boneMask.push(bone.name);
                    }
                }
            }
            this._updateTimelineStates();
        };
        /**
         * @language zh_CN
         * 删除骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.removeBoneMask = function (name, recursive) {
            if (recursive === void 0) { recursive = true; }
            var index = this._boneMask.indexOf(name);
            if (index >= 0) {
                this._boneMask.splice(index, 1);
            }
            if (recursive) {
                var currentBone = this._armature.getBone(name);
                if (currentBone) {
                    var bones = this._armature.getBones();
                    if (this._boneMask.length > 0) {
                        for (var i = 0, l = bones.length; i < l; ++i) {
                            var bone = bones[i];
                            var index_2 = this._boneMask.indexOf(bone.name);
                            if (index_2 >= 0 && currentBone.contains(bone)) {
                                this._boneMask.splice(index_2, 1);
                            }
                        }
                    }
                    else {
                        for (var i = 0, l = bones.length; i < l; ++i) {
                            var bone = bones[i];
                            if (!currentBone.contains(bone)) {
                                this._boneMask.push(bone.name);
                            }
                        }
                    }
                }
            }
            this._updateTimelineStates();
        };
        /**
         * @language zh_CN
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         */
        AnimationState.prototype.removeAllBoneMask = function () {
            this._boneMask.length = 0;
            this._updateTimelineStates();
        };
        Object.defineProperty(AnimationState.prototype, "layer", {
            /**
             * @language zh_CN
             * 混合图层。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._layer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "group", {
            /**
             * @language zh_CN
             * 混合组。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "name", {
            /**
             * @language zh_CN
             * 动画名称。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "animationData", {
            /**
             * @language zh_CN
             * 动画数据。
             * @see dragonBones.AnimationData
             * @version DragonBones 3.0
             */
            get: function () {
                return this._animationData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "isCompleted", {
            /**
             * @language zh_CN
             * 是否播放完毕。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._timeline._playState > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "isPlaying", {
            /**
             * @language zh_CN
             * 是否正在播放。
             * @version DragonBones 3.0
             */
            get: function () {
                return (this._playheadState & 2) && this._timeline._playState <= 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "currentPlayTimes", {
            /**
             * @language zh_CN
             * 当前播放次数。
             * @version DragonBones 3.0
             */
            get: function () {
                return this._timeline._currentPlayTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "totalTime", {
            /**
             * @language zh_CN
             * 动画的总时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            get: function () {
                return this._duration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "currentTime", {
            /**
             * @language zh_CN
             * 动画播放的时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            get: function () {
                return this._timeline._currentTime;
            },
            set: function (value) {
                if (value < 0.0 || value !== value) {
                    value = 0.0;
                }
                var currentPlayTimes = this._timeline._currentPlayTimes - (this._timeline._playState > 0 ? 1 : 0);
                value = (value % this._duration) + currentPlayTimes * this._duration;
                if (this._time === value) {
                    return;
                }
                this._time = value;
                this._timeline.setCurrentTime(this._time);
                if (this._zOrderTimeline) {
                    this._zOrderTimeline._playState = -1;
                }
                for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                    this._boneTimelines[i]._playState = -1;
                }
                for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    this._slotTimelines[i]._playState = -1;
                }
                for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                    this._ffdTimelines[i]._playState = -1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationState.prototype, "clip", {
            /**
             * @deprecated
             * @see #animationData
             */
            get: function () {
                return this._animationData;
            },
            enumerable: true,
            configurable: true
        });
        return AnimationState;
    }(dragonBones.BaseObject));
    dragonBones.AnimationState = AnimationState;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @internal
     * @private
     */
    var TimelineState = (function (_super) {
        __extends(TimelineState, _super);
        function TimelineState() {
            return _super.call(this) || this;
        }
        TimelineState.prototype._onClear = function () {
            this._playState = -1;
            this._currentPlayTimes = 0;
            this._currentTime = -1.0;
            this._timelineData = null;
            this._frameRate = 0;
            this._keyFrameCount = 0;
            this._frameCount = 0;
            this._position = 0.0;
            this._duration = 0.0;
            this._animationDutation = 0.0;
            this._timeScale = 1.0;
            this._timeOffset = 0.0;
            this._currentFrame = null;
            this._armature = null;
            this._animationState = null;
            this._mainTimeline = null;
        };
        TimelineState.prototype._onUpdateFrame = function () { };
        TimelineState.prototype._onArriveAtFrame = function () { };
        TimelineState.prototype._setCurrentTime = function (passedTime) {
            var prevState = this._playState;
            var currentPlayTimes = 0;
            var currentTime = 0.0;
            if (this._mainTimeline && this._keyFrameCount === 1) {
                this._playState = this._mainTimeline._playState >= 0 ? 1 : -1;
                currentPlayTimes = 1;
                currentTime = this._mainTimeline._currentTime;
            }
            else if (!this._mainTimeline || this._timeScale !== 1.0 || this._timeOffset !== 0.0) {
                var playTimes = this._animationState.playTimes;
                var totalTime = playTimes * this._duration;
                passedTime *= this._timeScale;
                if (this._timeOffset !== 0.0) {
                    passedTime += this._timeOffset * this._animationDutation;
                }
                if (playTimes > 0 && (passedTime >= totalTime || passedTime <= -totalTime)) {
                    if (this._playState <= 0 && this._animationState._playheadState === 3) {
                        this._playState = 1;
                    }
                    currentPlayTimes = playTimes;
                    if (passedTime < 0.0) {
                        currentTime = 0.0;
                    }
                    else {
                        currentTime = this._duration;
                    }
                }
                else {
                    if (this._playState !== 0 && this._animationState._playheadState === 3) {
                        this._playState = 0;
                    }
                    if (passedTime < 0.0) {
                        passedTime = -passedTime;
                        currentPlayTimes = Math.floor(passedTime / this._duration);
                        currentTime = this._duration - (passedTime % this._duration);
                    }
                    else {
                        currentPlayTimes = Math.floor(passedTime / this._duration);
                        currentTime = passedTime % this._duration;
                    }
                }
            }
            else {
                this._playState = this._mainTimeline._playState;
                currentPlayTimes = this._mainTimeline._currentPlayTimes;
                currentTime = this._mainTimeline._currentTime;
            }
            currentTime += this._position;
            if (this._currentPlayTimes === currentPlayTimes && this._currentTime === currentTime) {
                return false;
            }
            // Clear frame flag when timeline start or loopComplete.
            if ((prevState < 0 && this._playState !== prevState) ||
                (this._playState <= 0 && this._currentPlayTimes !== currentPlayTimes)) {
                this._currentFrame = null;
            }
            this._currentPlayTimes = currentPlayTimes;
            this._currentTime = currentTime;
            return true;
        };
        TimelineState.prototype._init = function (armature, animationState, timelineData) {
            this._armature = armature;
            this._animationState = animationState;
            this._timelineData = timelineData;
            this._mainTimeline = this._animationState._timeline;
            if (this === this._mainTimeline) {
                this._mainTimeline = null;
            }
            this._frameRate = this._armature.armatureData.frameRate;
            this._keyFrameCount = this._timelineData.frames.length;
            this._frameCount = this._animationState.animationData.frameCount;
            this._position = this._animationState._position;
            this._duration = this._animationState._duration;
            this._animationDutation = this._animationState.animationData.duration;
            this._timeScale = !this._mainTimeline ? 1.0 : (1.0 / this._timelineData.scale);
            this._timeOffset = !this._mainTimeline ? 0.0 : this._timelineData.offset;
        };
        TimelineState.prototype.fadeOut = function () { };
        TimelineState.prototype.update = function (passedTime) {
            if (this._playState <= 0 && this._setCurrentTime(passedTime)) {
                var currentFrameIndex = this._keyFrameCount > 1 ? Math.floor(this._currentTime * this._frameRate) : 0; // uint
                var currentFrame = this._timelineData.frames[currentFrameIndex];
                if (this._currentFrame !== currentFrame) {
                    this._currentFrame = currentFrame;
                    this._onArriveAtFrame();
                }
                this._onUpdateFrame();
            }
        };
        return TimelineState;
    }(dragonBones.BaseObject));
    dragonBones.TimelineState = TimelineState;
    /**
     * @internal
     * @private
     */
    var TweenTimelineState = (function (_super) {
        __extends(TweenTimelineState, _super);
        function TweenTimelineState() {
            return _super.call(this) || this;
        }
        TweenTimelineState._getEasingValue = function (progress, easing) {
            if (progress <= 0.0) {
                return 0.0;
            }
            else if (progress >= 1.0) {
                return 1.0;
            }
            var value = 1.0;
            if (easing > 2.0) {
                return progress;
            }
            else if (easing > 1.0) {
                value = 0.5 * (1.0 - Math.cos(progress * Math.PI));
                easing -= 1.0;
            }
            else if (easing > 0.0) {
                value = 1.0 - Math.pow(1.0 - progress, 2.0);
            }
            else if (easing >= -1.0) {
                easing *= -1.0;
                value = Math.pow(progress, 2.0);
            }
            else if (easing >= -2.0) {
                easing *= -1.0;
                value = Math.acos(1.0 - progress * 2.0) / Math.PI;
                easing -= 1.0;
            }
            else {
                return progress;
            }
            return (value - progress) * easing + progress;
        };
        TweenTimelineState._getEasingCurveValue = function (progress, samples) {
            if (progress <= 0.0) {
                return 0.0;
            }
            else if (progress >= 1.0) {
                return 1.0;
            }
            var segmentCount = samples.length + 1; // + 2 - 1
            var valueIndex = Math.floor(progress * segmentCount);
            var fromValue = valueIndex === 0 ? 0.0 : samples[valueIndex - 1];
            var toValue = (valueIndex === segmentCount - 1) ? 1.0 : samples[valueIndex];
            return fromValue + (toValue - fromValue) * (progress - valueIndex / segmentCount);
        };
        TweenTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this._tweenProgress = 0.0;
            this._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
            this._curve = null;
        };
        TweenTimelineState.prototype._onArriveAtFrame = function () {
            if (this._keyFrameCount > 1 &&
                (this._currentFrame.next !== this._timelineData.frames[0] ||
                    this._animationState.playTimes === 0 ||
                    this._animationState.currentPlayTimes < this._animationState.playTimes - 1)) {
                this._tweenEasing = this._currentFrame.tweenEasing;
                this._curve = this._currentFrame.curve;
            }
            else {
                this._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                this._curve = null;
            }
        };
        TweenTimelineState.prototype._onUpdateFrame = function () {
            if (this._tweenEasing !== dragonBones.DragonBones.NO_TWEEN) {
                this._tweenProgress = (this._currentTime - this._currentFrame.position + this._position) / this._currentFrame.duration;
                if (this._tweenEasing !== 0.0) {
                    this._tweenProgress = TweenTimelineState._getEasingValue(this._tweenProgress, this._tweenEasing);
                }
            }
            else if (this._curve) {
                this._tweenProgress = (this._currentTime - this._currentFrame.position + this._position) / this._currentFrame.duration;
                this._tweenProgress = TweenTimelineState._getEasingCurveValue(this._tweenProgress, this._curve);
            }
            else {
                this._tweenProgress = 0.0;
            }
        };
        return TweenTimelineState;
    }(TimelineState));
    dragonBones.TweenTimelineState = TweenTimelineState;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @internal
     * @private
     */
    var AnimationTimelineState = (function (_super) {
        __extends(AnimationTimelineState, _super);
        function AnimationTimelineState() {
            return _super.call(this) || this;
        }
        AnimationTimelineState.toString = function () {
            return "[class dragonBones.AnimationTimelineState]";
        };
        AnimationTimelineState.prototype._onCrossFrame = function (frame) {
            if (this._animationState.actionEnabled) {
                var actions = frame.actions;
                for (var i = 0, l = actions.length; i < l; ++i) {
                    this._armature._bufferAction(actions[i]);
                }
            }
            var eventDispatcher = this._armature.eventDispatcher;
            var events = frame.events;
            for (var i = 0, l = events.length; i < l; ++i) {
                var eventData = events[i];
                var eventType = null;
                switch (eventData.type) {
                    case 10 /* Frame */:
                        eventType = dragonBones.EventObject.FRAME_EVENT;
                        break;
                    case 11 /* Sound */:
                        eventType = dragonBones.EventObject.SOUND_EVENT;
                        break;
                }
                if (eventDispatcher.hasEvent(eventType) || eventData.type === 11 /* Sound */) {
                    var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                    eventObject.name = eventData.name;
                    eventObject.frame = frame;
                    eventObject.data = eventData.data;
                    eventObject.animationState = this._animationState;
                    if (eventData.bone) {
                        eventObject.bone = this._armature.getBone(eventData.bone.name);
                    }
                    if (eventData.slot) {
                        eventObject.slot = this._armature.getSlot(eventData.slot.name);
                    }
                    this._armature._bufferEvent(eventObject, eventType);
                }
            }
        };
        AnimationTimelineState.prototype.update = function (passedTime) {
            var prevState = this._playState;
            var prevPlayTimes = this._currentPlayTimes;
            var prevTime = this._currentTime;
            if (this._playState <= 0 && this._setCurrentTime(passedTime)) {
                var eventDispatcher = this._armature.eventDispatcher;
                if (prevState < 0 && this._playState !== prevState) {
                    if (this._animationState.displayControl) {
                        this._armature._sortZOrder(null);
                    }
                    if (eventDispatcher.hasEvent(dragonBones.EventObject.START)) {
                        var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        eventObject.animationState = this._animationState;
                        this._armature._bufferEvent(eventObject, dragonBones.EventObject.START);
                    }
                }
                if (prevTime < 0.0) {
                    return;
                }
                if (this._keyFrameCount > 1) {
                    var currentFrameIndex = Math.floor(this._currentTime * this._frameRate); // uint
                    var currentFrame = this._timelineData.frames[currentFrameIndex];
                    if (this._currentFrame !== currentFrame) {
                        var isReverse = this._currentPlayTimes === prevPlayTimes && prevTime > this._currentTime;
                        var crossedFrame = this._currentFrame;
                        this._currentFrame = currentFrame;
                        if (!crossedFrame) {
                            var prevFrameIndex = Math.floor(prevTime * this._frameRate);
                            crossedFrame = this._timelineData.frames[prevFrameIndex];
                            if (isReverse) {
                            }
                            else {
                                if (prevTime <= crossedFrame.position) {
                                    crossedFrame = crossedFrame.prev;
                                }
                            }
                        }
                        // TODO 1 2 3 key frame loop, first key frame after loop complete.
                        if (isReverse) {
                            while (crossedFrame !== currentFrame) {
                                this._onCrossFrame(crossedFrame);
                                crossedFrame = crossedFrame.prev;
                            }
                        }
                        else {
                            while (crossedFrame !== currentFrame) {
                                crossedFrame = crossedFrame.next;
                                this._onCrossFrame(crossedFrame);
                            }
                        }
                    }
                }
                else if (this._keyFrameCount > 0 && !this._currentFrame) {
                    this._currentFrame = this._timelineData.frames[0];
                    this._onCrossFrame(this._currentFrame);
                }
                if (this._currentPlayTimes !== prevPlayTimes) {
                    if (eventDispatcher.hasEvent(dragonBones.EventObject.LOOP_COMPLETE)) {
                        var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        eventObject.animationState = this._animationState;
                        this._armature._bufferEvent(eventObject, dragonBones.EventObject.LOOP_COMPLETE);
                    }
                    if (this._playState > 0 && eventDispatcher.hasEvent(dragonBones.EventObject.COMPLETE)) {
                        var eventObject = dragonBones.BaseObject.borrowObject(dragonBones.EventObject);
                        eventObject.animationState = this._animationState;
                        this._armature._bufferEvent(eventObject, dragonBones.EventObject.COMPLETE);
                    }
                }
            }
        };
        AnimationTimelineState.prototype.setCurrentTime = function (value) {
            this._setCurrentTime(value);
            this._currentFrame = null;
        };
        return AnimationTimelineState;
    }(dragonBones.TimelineState));
    dragonBones.AnimationTimelineState = AnimationTimelineState;
    /**
     * @internal
     * @private
     */
    var ZOrderTimelineState = (function (_super) {
        __extends(ZOrderTimelineState, _super);
        function ZOrderTimelineState() {
            return _super.call(this) || this;
        }
        ZOrderTimelineState.toString = function () {
            return "[class dragonBones.ZOrderTimelineState]";
        };
        ZOrderTimelineState.prototype._onArriveAtFrame = function () {
            _super.prototype._onArriveAtFrame.call(this);
            this._armature._sortZOrder(this._currentFrame.zOrder);
        };
        return ZOrderTimelineState;
    }(dragonBones.TimelineState));
    dragonBones.ZOrderTimelineState = ZOrderTimelineState;
    /**
     * @internal
     * @private
     */
    var BoneTimelineState = (function (_super) {
        __extends(BoneTimelineState, _super);
        function BoneTimelineState() {
            var _this = _super.call(this) || this;
            _this._transform = new dragonBones.Transform();
            _this._durationTransform = new dragonBones.Transform();
            return _this;
        }
        BoneTimelineState.toString = function () {
            return "[class dragonBones.BoneTimelineState]";
        };
        BoneTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.bone = null;
            this._transformDirty = false;
            this._tweenTransform = 0 /* None */;
            this._tweenRotate = 0 /* None */;
            this._tweenScale = 0 /* None */;
            this._transform.identity();
            this._durationTransform.identity();
            this._boneTransform = null;
            this._originalTransform = null;
        };
        BoneTimelineState.prototype._onArriveAtFrame = function () {
            _super.prototype._onArriveAtFrame.call(this);
            this._tweenTransform = 1 /* Once */;
            this._tweenRotate = 1 /* Once */;
            this._tweenScale = 1 /* Once */;
            if (this._keyFrameCount > 1 && (this._tweenEasing !== dragonBones.DragonBones.NO_TWEEN || this._curve)) {
                var currentTransform = this._currentFrame.transform;
                var nextFrame = this._currentFrame.next;
                var nextTransform = nextFrame.transform;
                // Transform.
                this._durationTransform.x = nextTransform.x - currentTransform.x;
                this._durationTransform.y = nextTransform.y - currentTransform.y;
                if (this._durationTransform.x !== 0.0 || this._durationTransform.y !== 0.0) {
                    this._tweenTransform = 2 /* Always */;
                }
                // Rotate.
                var tweenRotate = this._currentFrame.tweenRotate;
                if (tweenRotate !== dragonBones.DragonBones.NO_TWEEN) {
                    if (tweenRotate) {
                        if (tweenRotate > 0.0 ? nextTransform.skewY >= currentTransform.skewY : nextTransform.skewY <= currentTransform.skewY) {
                            tweenRotate = tweenRotate > 0.0 ? tweenRotate - 1.0 : tweenRotate + 1.0;
                        }
                        this._durationTransform.skewX = nextTransform.skewX - currentTransform.skewX + dragonBones.DragonBones.PI_D * tweenRotate;
                        this._durationTransform.skewY = nextTransform.skewY - currentTransform.skewY + dragonBones.DragonBones.PI_D * tweenRotate;
                    }
                    else {
                        this._durationTransform.skewX = dragonBones.Transform.normalizeRadian(nextTransform.skewX - currentTransform.skewX);
                        this._durationTransform.skewY = dragonBones.Transform.normalizeRadian(nextTransform.skewY - currentTransform.skewY);
                    }
                    if (this._durationTransform.skewX !== 0.0 || this._durationTransform.skewY !== 0.0) {
                        this._tweenRotate = 2 /* Always */;
                    }
                }
                else {
                    this._durationTransform.skewX = 0.0;
                    this._durationTransform.skewY = 0.0;
                }
                // Scale.
                if (this._currentFrame.tweenScale) {
                    this._durationTransform.scaleX = nextTransform.scaleX - currentTransform.scaleX;
                    this._durationTransform.scaleY = nextTransform.scaleY - currentTransform.scaleY;
                    if (this._durationTransform.scaleX !== 0.0 || this._durationTransform.scaleY !== 0.0) {
                        this._tweenScale = 2 /* Always */;
                    }
                }
                else {
                    this._durationTransform.scaleX = 0.0;
                    this._durationTransform.scaleY = 0.0;
                }
            }
            else {
                this._durationTransform.x = 0.0;
                this._durationTransform.y = 0.0;
                this._durationTransform.skewX = 0.0;
                this._durationTransform.skewY = 0.0;
                this._durationTransform.scaleX = 0.0;
                this._durationTransform.scaleY = 0.0;
            }
        };
        BoneTimelineState.prototype._onUpdateFrame = function () {
            _super.prototype._onUpdateFrame.call(this);
            var tweenProgress = 0.0;
            var currentTransform = this._currentFrame.transform;
            if (this._tweenTransform !== 0 /* None */) {
                if (this._tweenTransform === 1 /* Once */) {
                    this._tweenTransform = 0 /* None */;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }
                if (this._animationState.additiveBlending) {
                    this._transform.x = currentTransform.x + this._durationTransform.x * tweenProgress;
                    this._transform.y = currentTransform.y + this._durationTransform.y * tweenProgress;
                }
                else {
                    this._transform.x = this._originalTransform.x + currentTransform.x + this._durationTransform.x * tweenProgress;
                    this._transform.y = this._originalTransform.y + currentTransform.y + this._durationTransform.y * tweenProgress;
                }
                this._transformDirty = true;
            }
            if (this._tweenRotate !== 0 /* None */) {
                if (this._tweenRotate === 1 /* Once */) {
                    this._tweenRotate = 0 /* None */;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }
                if (this._animationState.additiveBlending) {
                    this._transform.skewX = currentTransform.skewX + this._durationTransform.skewX * tweenProgress;
                    this._transform.skewY = currentTransform.skewY + this._durationTransform.skewY * tweenProgress;
                }
                else {
                    this._transform.skewX = this._originalTransform.skewX + currentTransform.skewX + this._durationTransform.skewX * tweenProgress;
                    this._transform.skewY = this._originalTransform.skewY + currentTransform.skewY + this._durationTransform.skewY * tweenProgress;
                }
                this._transformDirty = true;
            }
            if (this._tweenScale !== 0 /* None */) {
                if (this._tweenScale === 1 /* Once */) {
                    this._tweenScale = 0 /* None */;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }
                if (this._animationState.additiveBlending) {
                    this._transform.scaleX = currentTransform.scaleX + this._durationTransform.scaleX * tweenProgress;
                    this._transform.scaleY = currentTransform.scaleY + this._durationTransform.scaleY * tweenProgress;
                }
                else {
                    this._transform.scaleX = this._originalTransform.scaleX * (currentTransform.scaleX + this._durationTransform.scaleX * tweenProgress);
                    this._transform.scaleY = this._originalTransform.scaleY * (currentTransform.scaleY + this._durationTransform.scaleY * tweenProgress);
                }
                this._transformDirty = true;
            }
        };
        BoneTimelineState.prototype._init = function (armature, animationState, timelineData) {
            _super.prototype._init.call(this, armature, animationState, timelineData);
            this._originalTransform = this._timelineData.originalTransform;
            this._boneTransform = this.bone._animationPose;
        };
        BoneTimelineState.prototype.fadeOut = function () {
            this._transform.skewX = dragonBones.Transform.normalizeRadian(this._transform.skewX);
            this._transform.skewY = dragonBones.Transform.normalizeRadian(this._transform.skewY);
        };
        BoneTimelineState.prototype.update = function (passedTime) {
            // Blend animation state.
            var animationLayer = this._animationState._layer;
            var weight = this._animationState._weightResult;
            if (this.bone._updateState <= 0) {
                _super.prototype.update.call(this, passedTime);
                this.bone._blendLayer = animationLayer;
                this.bone._blendLeftWeight = 1.0;
                this.bone._blendTotalWeight = weight;
                this._boneTransform.x = this._transform.x * weight;
                this._boneTransform.y = this._transform.y * weight;
                this._boneTransform.skewX = this._transform.skewX * weight;
                this._boneTransform.skewY = this._transform.skewY * weight;
                this._boneTransform.scaleX = (this._transform.scaleX - 1.0) * weight + 1.0;
                this._boneTransform.scaleY = (this._transform.scaleY - 1.0) * weight + 1.0;
                this.bone._updateState = 1;
            }
            else if (this.bone._blendLeftWeight > 0.0) {
                if (this.bone._blendLayer !== animationLayer) {
                    if (this.bone._blendTotalWeight >= this.bone._blendLeftWeight) {
                        this.bone._blendLeftWeight = 0.0;
                    }
                    else {
                        this.bone._blendLayer = animationLayer;
                        this.bone._blendLeftWeight -= this.bone._blendTotalWeight;
                        this.bone._blendTotalWeight = 0.0;
                    }
                }
                weight *= this.bone._blendLeftWeight;
                if (weight >= 0.0) {
                    _super.prototype.update.call(this, passedTime);
                    this.bone._blendTotalWeight += weight;
                    this._boneTransform.x += this._transform.x * weight;
                    this._boneTransform.y += this._transform.y * weight;
                    this._boneTransform.skewX += this._transform.skewX * weight;
                    this._boneTransform.skewY += this._transform.skewY * weight;
                    this._boneTransform.scaleX += (this._transform.scaleX - 1) * weight;
                    this._boneTransform.scaleY += (this._transform.scaleY - 1) * weight;
                    this.bone._updateState++;
                }
            }
            if (this.bone._updateState > 0) {
                if (this._transformDirty || this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                    this._transformDirty = false;
                    this.bone.invalidUpdate();
                }
            }
        };
        return BoneTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.BoneTimelineState = BoneTimelineState;
    /**
     * @internal
     * @private
     */
    var SlotTimelineState = (function (_super) {
        __extends(SlotTimelineState, _super);
        function SlotTimelineState() {
            var _this = _super.call(this) || this;
            _this._color = new dragonBones.ColorTransform();
            _this._durationColor = new dragonBones.ColorTransform();
            return _this;
        }
        SlotTimelineState.toString = function () {
            return "[class dragonBones.SlotTimelineState]";
        };
        SlotTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
            this._colorDirty = false;
            this._tweenColor = 0 /* None */;
            this._color.identity();
            this._durationColor.identity();
            this._slotColor = null;
        };
        SlotTimelineState.prototype._onArriveAtFrame = function () {
            _super.prototype._onArriveAtFrame.call(this);
            if (this._animationState._isDisabled(this.slot)) {
                this._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenColor = 0 /* None */;
                return;
            }
            var displayIndex = this._currentFrame.displayIndex;
            if (this._playState >= 0 && this.slot.displayIndex !== displayIndex) {
                this.slot._setDisplayIndex(displayIndex);
            }
            if (displayIndex >= 0) {
                this._tweenColor = 0 /* None */;
                var currentColor = this._currentFrame.color;
                if (this._tweenEasing !== dragonBones.DragonBones.NO_TWEEN || this._curve) {
                    var nextFrame = this._currentFrame.next;
                    var nextColor = nextFrame.color;
                    if (currentColor !== nextColor) {
                        this._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                        this._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                        this._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                        this._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                        this._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                        this._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                        this._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                        this._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;
                        if (this._durationColor.alphaMultiplier !== 0.0 ||
                            this._durationColor.redMultiplier !== 0.0 ||
                            this._durationColor.greenMultiplier !== 0.0 ||
                            this._durationColor.blueMultiplier !== 0.0 ||
                            this._durationColor.alphaOffset !== 0 ||
                            this._durationColor.redOffset !== 0 ||
                            this._durationColor.greenOffset !== 0 ||
                            this._durationColor.blueOffset !== 0) {
                            this._tweenColor = 2 /* Always */;
                        }
                    }
                }
                if (this._tweenColor === 0 /* None */) {
                    if (this._slotColor.alphaMultiplier !== currentColor.alphaMultiplier ||
                        this._slotColor.redMultiplier !== currentColor.redMultiplier ||
                        this._slotColor.greenMultiplier !== currentColor.greenMultiplier ||
                        this._slotColor.blueMultiplier !== currentColor.blueMultiplier ||
                        this._slotColor.alphaOffset !== currentColor.alphaOffset ||
                        this._slotColor.redOffset !== currentColor.redOffset ||
                        this._slotColor.greenOffset !== currentColor.greenOffset ||
                        this._slotColor.blueOffset !== currentColor.blueOffset) {
                        this._tweenColor = 1 /* Once */;
                    }
                }
            }
            else {
                this._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenColor = 0 /* None */;
            }
        };
        SlotTimelineState.prototype._onUpdateFrame = function () {
            _super.prototype._onUpdateFrame.call(this);
            var tweenProgress = 0.0;
            if (this._tweenColor !== 0 /* None */ && this.slot.parent._blendLayer >= this._animationState._layer) {
                if (this._tweenColor === 1 /* Once */) {
                    this._tweenColor = 0 /* None */;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }
                var currentColor = this._currentFrame.color;
                this._color.alphaMultiplier = currentColor.alphaMultiplier + this._durationColor.alphaMultiplier * tweenProgress;
                this._color.redMultiplier = currentColor.redMultiplier + this._durationColor.redMultiplier * tweenProgress;
                this._color.greenMultiplier = currentColor.greenMultiplier + this._durationColor.greenMultiplier * tweenProgress;
                this._color.blueMultiplier = currentColor.blueMultiplier + this._durationColor.blueMultiplier * tweenProgress;
                this._color.alphaOffset = currentColor.alphaOffset + this._durationColor.alphaOffset * tweenProgress;
                this._color.redOffset = currentColor.redOffset + this._durationColor.redOffset * tweenProgress;
                this._color.greenOffset = currentColor.greenOffset + this._durationColor.greenOffset * tweenProgress;
                this._color.blueOffset = currentColor.blueOffset + this._durationColor.blueOffset * tweenProgress;
                this._colorDirty = true;
            }
        };
        SlotTimelineState.prototype._init = function (armature, animationState, timelineData) {
            _super.prototype._init.call(this, armature, animationState, timelineData);
            this._slotColor = this.slot._colorTransform;
        };
        SlotTimelineState.prototype.fadeOut = function () {
            this._tweenColor = 0 /* None */;
        };
        SlotTimelineState.prototype.update = function (passedTime) {
            _super.prototype.update.call(this, passedTime);
            // Fade animation.
            if (this._tweenColor !== 0 /* None */ || this._colorDirty) {
                if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                    var fadeProgress = Math.pow(this._animationState._fadeProgress, 4);
                    this._slotColor.alphaMultiplier += (this._color.alphaMultiplier - this._slotColor.alphaMultiplier) * fadeProgress;
                    this._slotColor.redMultiplier += (this._color.redMultiplier - this._slotColor.redMultiplier) * fadeProgress;
                    this._slotColor.greenMultiplier += (this._color.greenMultiplier - this._slotColor.greenMultiplier) * fadeProgress;
                    this._slotColor.blueMultiplier += (this._color.blueMultiplier - this._slotColor.blueMultiplier) * fadeProgress;
                    this._slotColor.alphaOffset += (this._color.alphaOffset - this._slotColor.alphaOffset) * fadeProgress;
                    this._slotColor.redOffset += (this._color.redOffset - this._slotColor.redOffset) * fadeProgress;
                    this._slotColor.greenOffset += (this._color.greenOffset - this._slotColor.greenOffset) * fadeProgress;
                    this._slotColor.blueOffset += (this._color.blueOffset - this._slotColor.blueOffset) * fadeProgress;
                    this.slot._colorDirty = true;
                }
                else if (this._colorDirty) {
                    this._colorDirty = false;
                    this._slotColor.alphaMultiplier = this._color.alphaMultiplier;
                    this._slotColor.redMultiplier = this._color.redMultiplier;
                    this._slotColor.greenMultiplier = this._color.greenMultiplier;
                    this._slotColor.blueMultiplier = this._color.blueMultiplier;
                    this._slotColor.alphaOffset = this._color.alphaOffset;
                    this._slotColor.redOffset = this._color.redOffset;
                    this._slotColor.greenOffset = this._color.greenOffset;
                    this._slotColor.blueOffset = this._color.blueOffset;
                    this.slot._colorDirty = true;
                }
            }
        };
        return SlotTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.SlotTimelineState = SlotTimelineState;
    /**
     * @internal
     * @private
     */
    var FFDTimelineState = (function (_super) {
        __extends(FFDTimelineState, _super);
        function FFDTimelineState() {
            var _this = _super.call(this) || this;
            _this._ffdVertices = [];
            _this._durationFFDVertices = [];
            return _this;
        }
        FFDTimelineState.toString = function () {
            return "[class dragonBones.FFDTimelineState]";
        };
        FFDTimelineState.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.slot = null;
            this._ffdDirty = false;
            this._tweenFFD = 0 /* None */;
            this._ffdVertices.length = 0;
            this._durationFFDVertices.length = 0;
            this._slotFFDVertices = null;
        };
        FFDTimelineState.prototype._onArriveAtFrame = function () {
            _super.prototype._onArriveAtFrame.call(this);
            if (this.slot.displayIndex >= 0 && this._animationState._isDisabled(this.slot)) {
                this._tweenEasing = dragonBones.DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenFFD = 0 /* None */;
                return;
            }
            this._tweenFFD = 0 /* None */;
            if (this._tweenEasing !== dragonBones.DragonBones.NO_TWEEN || this._curve) {
                var currentFFDVertices = this._currentFrame.tweens;
                var nextFFDVertices = this._currentFrame.next.tweens;
                for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    var duration = nextFFDVertices[i] - currentFFDVertices[i];
                    this._durationFFDVertices[i] = duration;
                    if (duration !== 0.0) {
                        this._tweenFFD = 2 /* Always */;
                    }
                }
            }
            //
            if (this._tweenFFD === 0 /* None */) {
                this._tweenFFD = 1 /* Once */;
                for (var i = 0, l = this._durationFFDVertices.length; i < l; ++i) {
                    this._durationFFDVertices[i] = 0;
                }
            }
        };
        FFDTimelineState.prototype._onUpdateFrame = function () {
            _super.prototype._onUpdateFrame.call(this);
            var tweenProgress = 0.0;
            if (this._tweenFFD !== 0 /* None */ && this.slot.parent._blendLayer >= this._animationState._layer) {
                if (this._tweenFFD === 1 /* Once */) {
                    this._tweenFFD = 0 /* None */;
                    tweenProgress = 0.0;
                }
                else {
                    tweenProgress = this._tweenProgress;
                }
                var currentFFDVertices = this._currentFrame.tweens;
                for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    this._ffdVertices[i] = currentFFDVertices[i] + this._durationFFDVertices[i] * tweenProgress;
                }
                this._ffdDirty = true;
            }
        };
        FFDTimelineState.prototype._init = function (armature, animationState, timelineData) {
            _super.prototype._init.call(this, armature, animationState, timelineData);
            this._slotFFDVertices = this.slot._ffdVertices;
            this._ffdVertices.length = this._timelineData.frames[0].tweens.length;
            this._durationFFDVertices.length = this._ffdVertices.length;
            for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                this._ffdVertices[i] = 0.0;
            }
            for (var i = 0, l = this._durationFFDVertices.length; i < l; ++i) {
                this._durationFFDVertices[i] = 0.0;
            }
        };
        FFDTimelineState.prototype.fadeOut = function () {
            this._tweenFFD = 0 /* None */;
        };
        FFDTimelineState.prototype.update = function (passedTime) {
            _super.prototype.update.call(this, passedTime);
            if (this.slot._meshData !== this._timelineData.display.mesh) {
                return;
            }
            // Fade animation.
            if (this._tweenFFD !== 0 /* None */ || this._ffdDirty) {
                if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                    var fadeProgress = Math.pow(this._animationState._fadeProgress, 4.0);
                    for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._slotFFDVertices[i] += (this._ffdVertices[i] - this._slotFFDVertices[i]) * fadeProgress;
                    }
                    this.slot._meshDirty = true;
                }
                else if (this._ffdDirty) {
                    this._ffdDirty = false;
                    for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._slotFFDVertices[i] = this._ffdVertices[i];
                    }
                    this.slot._meshDirty = true;
                }
            }
        };
        return FFDTimelineState;
    }(dragonBones.TweenTimelineState));
    dragonBones.FFDTimelineState = FFDTimelineState;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * WorldClock 提供时钟支持，为每个加入到时钟的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimateble
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var WorldClock = (function () {
        /**
         * @language zh_CN
         * 创建一个新的 WorldClock 实例。
         * 通常并不需要单独创建 WorldClock 实例，可以直接使用 WorldClock.clock 静态实例。
         * (创建更多独立的 WorldClock 实例可以更灵活的为需要更新的 IAnimateble 实例分组，用于控制不同组不同的播放速度)
         * @version DragonBones 3.0
         */
        function WorldClock() {
            /**
             * @language zh_CN
             * 当前时间。 (以秒为单位)
             * @version DragonBones 3.0
             */
            this.time = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND;
            /**
             * @language zh_CN
             * 时间流逝速度，用于控制动画变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
             * @default 1
             * @version DragonBones 3.0
             */
            this.timeScale = 1.0;
            this._animatebles = [];
            this._clock = null;
        }
        Object.defineProperty(WorldClock, "clock", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局 WorldClock 实例.
             * @version DragonBones 3.0
             */
            get: function () {
                if (!WorldClock._clock) {
                    WorldClock._clock = new WorldClock();
                }
                return WorldClock._clock;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 为所有的 IAnimatable 实例更新时间。
         * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
         * @version DragonBones 3.0
         */
        WorldClock.prototype.advanceTime = function (passedTime) {
            if (passedTime !== passedTime) {
                passedTime = 0.0;
            }
            if (passedTime < 0.0) {
                passedTime = new Date().getTime() / dragonBones.DragonBones.SECOND_TO_MILLISECOND - this.time;
            }
            if (this.timeScale !== 1.0) {
                passedTime *= this.timeScale;
            }
            if (passedTime < 0.0) {
                this.time -= passedTime;
            }
            else {
                this.time += passedTime;
            }
            if (passedTime) {
                var i = 0, r = 0, l = this._animatebles.length;
                for (; i < l; ++i) {
                    var animateble = this._animatebles[i];
                    if (animateble) {
                        if (r > 0) {
                            this._animatebles[i - r] = animateble;
                            this._animatebles[i] = null;
                        }
                        animateble.advanceTime(passedTime);
                    }
                    else {
                        r++;
                    }
                }
                if (r > 0) {
                    l = this._animatebles.length;
                    for (; i < l; ++i) {
                        var animateble = this._animatebles[i];
                        if (animateble) {
                            this._animatebles[i - r] = animateble;
                        }
                        else {
                            r++;
                        }
                    }
                    this._animatebles.length -= r;
                }
            }
        };
        /**
         * 是否包含 IAnimatable 实例
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.contains = function (value) {
            return this._animatebles.indexOf(value) >= 0;
        };
        /**
         * @language zh_CN
         * 添加 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.add = function (value) {
            if (value && this._animatebles.indexOf(value) < 0) {
                this._animatebles.push(value);
                value.clock = this;
                if (dragonBones.DragonBones.debug && value instanceof dragonBones.Armature) {
                    dragonBones.DragonBones.addArmature(value);
                }
            }
        };
        /**
         * @language zh_CN
         * 移除 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.remove = function (value) {
            var index = this._animatebles.indexOf(value);
            if (index >= 0) {
                this._animatebles[index] = null;
                value.clock = null;
                if (dragonBones.DragonBones.debug && value instanceof dragonBones.Armature) {
                    dragonBones.DragonBones.removeArmature(value);
                }
            }
        };
        /**
         * @language zh_CN
         * 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         */
        WorldClock.prototype.clear = function () {
            for (var i = 0, l = this._animatebles.length; i < l; ++i) {
                var animateble = this._animatebles[i];
                this._animatebles[i] = null;
                if (animateble != null) {
                    animateble.clock = null;
                }
            }
        };
        Object.defineProperty(WorldClock.prototype, "clock", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._clock;
            },
            set: function (value) {
                if (this._clock === value) {
                    return;
                }
                var prevClock = this._clock;
                this._clock = value;
                if (prevClock) {
                    prevClock.remove(this);
                }
                if (this._clock) {
                    this._clock.add(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        return WorldClock;
    }());
    WorldClock._clock = null;
    dragonBones.WorldClock = WorldClock;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 事件数据。
     * @version DragonBones 4.5
     */
    var EventObject = (function (_super) {
        __extends(EventObject, _super);
        /**
         * @internal
         * @private
         */
        function EventObject() {
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        EventObject.toString = function () {
            return "[class dragonBones.EventObject]";
        };
        /**
         * @private
         */
        EventObject.prototype._onClear = function () {
            this.type = null;
            this.name = null;
            this.frame = null;
            this.data = null;
            this.armature = null;
            this.bone = null;
            this.slot = null;
            this.animationState = null;
        };
        return EventObject;
    }(dragonBones.BaseObject));
    /**
     * @language zh_CN
     * 动画开始。
     * @version DragonBones 4.5
     */
    EventObject.START = "start";
    /**
     * @language zh_CN
     * 动画循环播放一次完成。
     * @version DragonBones 4.5
     */
    EventObject.LOOP_COMPLETE = "loopComplete";
    /**
     * @language zh_CN
     * 动画播放完成。
     * @version DragonBones 4.5
     */
    EventObject.COMPLETE = "complete";
    /**
     * @language zh_CN
     * 动画淡入开始。
     * @version DragonBones 4.5
     */
    EventObject.FADE_IN = "fadeIn";
    /**
     * @language zh_CN
     * 动画淡入完成。
     * @version DragonBones 4.5
     */
    EventObject.FADE_IN_COMPLETE = "fadeInComplete";
    /**
     * @language zh_CN
     * 动画淡出开始。
     * @version DragonBones 4.5
     */
    EventObject.FADE_OUT = "fadeOut";
    /**
     * @language zh_CN
     * 动画淡出完成。
     * @version DragonBones 4.5
     */
    EventObject.FADE_OUT_COMPLETE = "fadeOutComplete";
    /**
     * @language zh_CN
     * 动画帧事件。
     * @version DragonBones 4.5
     */
    EventObject.FRAME_EVENT = "frameEvent";
    /**
     * @language zh_CN
     * 动画声音事件。
     * @version DragonBones 4.5
     */
    EventObject.SOUND_EVENT = "soundEvent";
    dragonBones.EventObject = EventObject;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * 创建骨架的基础工厂。 (通常只需要一个全局工厂实例)
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    var BaseFactory = (function () {
        /**
         * @private
         */
        function BaseFactory(dataParser) {
            if (dataParser === void 0) { dataParser = null; }
            /**
             * @language zh_CN
             * 是否开启共享搜索。
             * 如果开启，创建一个骨架时，可以从多个龙骨数据中寻找骨架数据，或贴图集数据中寻找贴图数据。 (通常在有共享导出的数据时开启)
             * @see dragonBones.DragonBonesData#autoSearch
             * @see dragonBones.TextureAtlasData#autoSearch
             * @version DragonBones 4.5
             */
            this.autoSearch = false;
            /**
             * @private
             */
            this._dragonBonesDataMap = {};
            /**
             * @private
             */
            this._textureAtlasDataMap = {};
            /**
             * @private
             */
            this._dataParser = null;
            this._dataParser = dataParser;
            if (!this._dataParser) {
                if (!BaseFactory._defaultParser) {
                    BaseFactory._defaultParser = new dragonBones.ObjectDataParser();
                }
                this._dataParser = BaseFactory._defaultParser;
            }
        }
        /**
         * @private
         */
        BaseFactory.prototype._getTextureData = function (textureAtlasName, textureName) {
            var textureAtlasDataList = this._textureAtlasDataMap[textureAtlasName];
            if (textureAtlasDataList) {
                for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                    var textureData = textureAtlasDataList[i].getTexture(textureName);
                    if (textureData) {
                        return textureData;
                    }
                }
            }
            if (this.autoSearch) {
                for (var textureAtlasName_1 in this._textureAtlasDataMap) {
                    textureAtlasDataList = this._textureAtlasDataMap[textureAtlasName_1];
                    for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                        var textureAtlasData = textureAtlasDataList[i];
                        if (textureAtlasData.autoSearch) {
                            var textureData = textureAtlasData.getTexture(textureName);
                            if (textureData) {
                                return textureData;
                            }
                        }
                    }
                }
            }
            return null;
        };
        /**
         * @private
         */
        BaseFactory.prototype._fillBuildArmaturePackage = function (dataPackage, dragonBonesName, armatureName, skinName, textureAtlasName) {
            var dragonBonesData = null;
            var armatureData = null;
            if (dragonBonesName) {
                dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
                if (dragonBonesData) {
                    armatureData = dragonBonesData.getArmature(armatureName);
                }
            }
            if (!armatureData && (!dragonBonesName || this.autoSearch)) {
                for (var eachDragonBonesName in this._dragonBonesDataMap) {
                    dragonBonesData = this._dragonBonesDataMap[eachDragonBonesName];
                    if (!dragonBonesName || dragonBonesData.autoSearch) {
                        armatureData = dragonBonesData.getArmature(armatureName);
                        if (armatureData) {
                            dragonBonesName = eachDragonBonesName;
                            break;
                        }
                    }
                }
            }
            if (armatureData) {
                dataPackage.dataName = dragonBonesName;
                dataPackage.textureAtlasName = textureAtlasName;
                dataPackage.data = dragonBonesData;
                dataPackage.armature = armatureData;
                dataPackage.skin = armatureData.getSkin(skinName);
                if (!dataPackage.skin) {
                    dataPackage.skin = armatureData.defaultSkin;
                }
                return true;
            }
            return false;
        };
        /**
         * @private
         */
        BaseFactory.prototype._buildBones = function (dataPackage, armature) {
            var bones = dataPackage.armature.sortedBones;
            for (var i = 0, l = bones.length; i < l; ++i) {
                var boneData = bones[i];
                var bone = dragonBones.BaseObject.borrowObject(dragonBones.Bone);
                bone._init(boneData);
                if (boneData.parent) {
                    armature.addBone(bone, boneData.parent.name);
                }
                else {
                    armature.addBone(bone);
                }
                if (boneData.ik) {
                    bone.ikBendPositive = boneData.bendPositive;
                    bone.ikWeight = boneData.weight;
                    bone._setIK(armature.getBone(boneData.ik.name), boneData.chain, boneData.chainIndex);
                }
            }
        };
        /**
         * @private
         */
        BaseFactory.prototype._buildSlots = function (dataPackage, armature) {
            var currentSkin = dataPackage.skin;
            var defaultSkin = dataPackage.armature.defaultSkin;
            var skinSlotDatas = {};
            for (var k in defaultSkin.slots) {
                var skinSlotData = defaultSkin.slots[k];
                skinSlotDatas[skinSlotData.slot.name] = skinSlotData;
            }
            if (currentSkin !== defaultSkin) {
                for (var k in currentSkin.slots) {
                    var skinSlotData = currentSkin.slots[k];
                    skinSlotDatas[skinSlotData.slot.name] = skinSlotData;
                }
            }
            var slots = dataPackage.armature.sortedSlots;
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slotData = slots[i];
                var skinSlotData = skinSlotDatas[slotData.name];
                if (!skinSlotData) {
                    continue;
                }
                var slot = this._generateSlot(dataPackage, skinSlotData, armature);
                if (slot) {
                    armature.addSlot(slot, slotData.parent.name);
                    slot._setDisplayIndex(slotData.displayIndex);
                }
            }
        };
        /**
         * @private
         */
        BaseFactory.prototype._replaceSlotDisplay = function (dataPackage, displayData, slot, displayIndex) {
            if (displayIndex < 0) {
                displayIndex = slot.displayIndex;
            }
            if (displayIndex >= 0) {
                var displayList = slot.displayList; // Copy.
                if (displayList.length <= displayIndex) {
                    displayList.length = displayIndex + 1;
                }
                if (slot._replacedDisplayDatas.length <= displayIndex) {
                    slot._replacedDisplayDatas.length = displayIndex + 1;
                }
                slot._replacedDisplayDatas[displayIndex] = displayData;
                if (displayData.type === 1 /* Armature */) {
                    var childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                    displayList[displayIndex] = childArmature;
                }
                else {
                    if (!displayData.texture || dataPackage.textureAtlasName) {
                        displayData.texture = this._getTextureData(dataPackage.textureAtlasName ? dataPackage.textureAtlasName : dataPackage.dataName, displayData.path);
                    }
                    var displayDatas = slot.skinSlotData.displays;
                    if (displayData.mesh ||
                        (displayIndex < displayDatas.length && displayDatas[displayIndex].mesh)) {
                        displayList[displayIndex] = slot.meshDisplay;
                    }
                    else {
                        displayList[displayIndex] = slot.rawDisplay;
                    }
                }
                slot.displayList = displayList;
            }
        };
        /**
         * @language zh_CN
         * 解析并添加龙骨数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param name 为数据提供一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @returns DragonBonesData
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.parseDragonBonesData = function (rawData, name, scale) {
            if (name === void 0) { name = null; }
            if (scale === void 0) { scale = 1.0; }
            var dragonBonesData = this._dataParser.parseDragonBonesData(rawData, scale);
            this.addDragonBonesData(dragonBonesData, name);
            return dragonBonesData;
        };
        /**
         * @language zh_CN
         * 解析并添加贴图集数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param textureAtlas 贴图。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @param scale 为贴图集设置一个缩放值。
         * @returns 贴图集数据
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.parseTextureAtlasData = function (rawData, textureAtlas, name, scale) {
            if (name === void 0) { name = null; }
            if (scale === void 0) { scale = 0.0; }
            var textureAtlasData = this._generateTextureAtlasData(null, null);
            this._dataParser.parseTextureAtlasData(rawData, textureAtlasData, scale);
            this._generateTextureAtlasData(textureAtlasData, textureAtlas);
            this.addTextureAtlasData(textureAtlasData, name);
            return textureAtlasData;
        };
        /**
         * @language zh_CN
         * 获取指定名称的龙骨数据。
         * @param name 数据名称。
         * @returns DragonBonesData
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.getDragonBonesData = function (name) {
            return this._dragonBonesDataMap[name];
        };
        /**
         * @language zh_CN
         * 添加龙骨数据。
         * @param data 龙骨数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.addDragonBonesData = function (data, name) {
            if (name === void 0) { name = null; }
            if (data) {
                name = name || data.name;
                if (name) {
                    if (!this._dragonBonesDataMap[name]) {
                        this._dragonBonesDataMap[name] = data;
                    }
                    else {
                        console.warn("Same name data.", name);
                    }
                }
                else {
                    console.warn("Unnamed data.");
                }
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @language zh_CN
         * 移除龙骨数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.removeDragonBonesData = function (name, disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            var dragonBonesData = this._dragonBonesDataMap[name];
            if (dragonBonesData) {
                if (disposeData) {
                    dragonBonesData.returnToPool();
                }
                delete this._dragonBonesDataMap[name];
            }
        };
        /**
         * @language zh_CN
         * 获取指定名称的贴图集数据列表。
         * @param name 数据名称。
         * @returns 贴图集数据列表。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.getTextureAtlasData = function (name) {
            return this._textureAtlasDataMap[name];
        };
        /**
         * @language zh_CN
         * 添加贴图集数据。
         * @param data 贴图集数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.addTextureAtlasData = function (data, name) {
            if (name === void 0) { name = null; }
            if (data) {
                name = name || data.name;
                if (name) {
                    var textureAtlasList = this._textureAtlasDataMap[name] ? this._textureAtlasDataMap[name] : (this._textureAtlasDataMap[name] = []);
                    if (textureAtlasList.indexOf(data) < 0) {
                        textureAtlasList.push(data);
                    }
                }
                else {
                    console.warn("Unnamed data.");
                }
            }
            else {
                throw new Error(dragonBones.DragonBones.ARGUMENT_ERROR);
            }
        };
        /**
         * @language zh_CN
         * 移除贴图集数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.removeTextureAtlasData = function (name, disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            var textureAtlasDataList = this._textureAtlasDataMap[name];
            if (textureAtlasDataList) {
                if (disposeData) {
                    for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                        textureAtlasDataList[i].returnToPool();
                    }
                }
                delete this._textureAtlasDataMap[name];
            }
        };
        /**
         * @language zh_CN
         * 清除所有的数据。
         * @param disposeData 是否释放数据。
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.clear = function (disposeData) {
            if (disposeData === void 0) { disposeData = true; }
            for (var k in this._dragonBonesDataMap) {
                if (disposeData) {
                    this._dragonBonesDataMap[k].returnToPool();
                }
                delete this._dragonBonesDataMap[k];
            }
            for (var k in this._textureAtlasDataMap) {
                if (disposeData) {
                    var textureAtlasDataList = this._textureAtlasDataMap[k];
                    for (var i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                        textureAtlasDataList[i].returnToPool();
                    }
                }
                delete this._textureAtlasDataMap[k];
            }
        };
        /**
         * @language zh_CN
         * 创建一个骨架。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，当多个龙骨数据中包含同名的骨架数据时，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据名称。
         * @returns 骨架
         * @see dragonBones.ArmatureData
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        BaseFactory.prototype.buildArmature = function (armatureName, dragonBonesName, skinName, textureAtlasName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dataPackage, dragonBonesName, armatureName, skinName, textureAtlasName)) {
                var armature = this._generateArmature(dataPackage);
                this._buildBones(dataPackage, armature);
                this._buildSlots(dataPackage, armature);
                armature.invalidUpdate(null, true);
                armature.advanceTime(0.0); // Update armature pose.
                return armature;
            }
            console.warn("No armature data.", armatureName, dragonBonesName ? dragonBonesName : "");
            return null;
        };
        /**
         * @language zh_CN
         * 将骨架的动画替换成其他骨架的动画。 (通常这些骨架应该具有相同的骨架结构)
         * @param toArmature 指定的骨架。
         * @param fromArmatreName 其他骨架的名称。
         * @param fromSkinName 其他骨架的皮肤名称，如果未设置，则使用默认皮肤。
         * @param fromDragonBonesDataName 其他骨架属于的龙骨数据名称，如果未设置，则检索所有的龙骨数据。
         * @param replaceOriginalAnimation 是否替换原有的同名动画。
         * @returns 是否替换成功。
         * @see dragonBones.Armature
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.copyAnimationsToArmature = function (toArmature, fromArmatreName, fromSkinName, fromDragonBonesDataName, replaceOriginalAnimation) {
            if (fromSkinName === void 0) { fromSkinName = null; }
            if (fromDragonBonesDataName === void 0) { fromDragonBonesDataName = null; }
            if (replaceOriginalAnimation === void 0) { replaceOriginalAnimation = true; }
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dataPackage, fromDragonBonesDataName, fromArmatreName, fromSkinName, null)) {
                var fromArmatureData = dataPackage.armature;
                if (replaceOriginalAnimation) {
                    toArmature.animation.animations = fromArmatureData.animations;
                }
                else {
                    var animations = {};
                    for (var animationName in toArmature.animation.animations) {
                        animations[animationName] = toArmature.animation.animations[animationName];
                    }
                    for (var animationName in fromArmatureData.animations) {
                        animations[animationName] = fromArmatureData.animations[animationName];
                    }
                    toArmature.animation.animations = animations;
                }
                if (dataPackage.skin) {
                    var slots = toArmature.getSlots();
                    for (var i = 0, l = slots.length; i < l; ++i) {
                        var toSlot = slots[i];
                        var toSlotDisplayList = toSlot.displayList;
                        for (var iA = 0, lA = toSlotDisplayList.length; iA < lA; ++iA) {
                            var toDisplayObject = toSlotDisplayList[iA];
                            if (toDisplayObject instanceof dragonBones.Armature) {
                                var displays = dataPackage.skin.getSlot(toSlot.name).displays;
                                if (iA < displays.length) {
                                    var fromDisplayData = displays[iA];
                                    if (fromDisplayData.type === 1 /* Armature */) {
                                        this.copyAnimationsToArmature(toDisplayObject, fromDisplayData.path, fromSkinName, fromDragonBonesDataName, replaceOriginalAnimation);
                                    }
                                }
                            }
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        /**
         * @language zh_CN
         * 用指定资源替换插槽的显示对象。
         * @param dragonBonesName 指定的龙骨数据名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param displayName 指定的显示对象名称。
         * @param slot 指定的插槽实例。
         * @param displayIndex 要替换的显示对象的索引，如果未设置，则替换当前正在显示的显示对象。
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.replaceSlotDisplay = function (dragonBonesName, armatureName, slotName, displayName, slot, displayIndex) {
            if (displayIndex === void 0) { displayIndex = -1; }
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dataPackage, dragonBonesName, armatureName, null, null)) {
                var skinSlotData = dataPackage.skin.getSlot(slotName);
                if (skinSlotData) {
                    for (var i = 0, l = skinSlotData.displays.length; i < l; ++i) {
                        var displayData = skinSlotData.displays[i];
                        if (displayData.name === displayName) {
                            this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex);
                            break;
                        }
                    }
                }
            }
        };
        /**
         * @language zh_CN
         * 用指定资源列表替换插槽的显示对象列表。
         * @param dragonBonesName 指定的 DragonBonesData 名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param slot 指定的插槽实例。
         * @version DragonBones 4.5
         */
        BaseFactory.prototype.replaceSlotDisplayList = function (dragonBonesName, armatureName, slotName, slot) {
            var dataPackage = {};
            if (this._fillBuildArmaturePackage(dataPackage, dragonBonesName, armatureName, null, null)) {
                var skinSlotData = dataPackage.skin.getSlot(slotName);
                if (skinSlotData) {
                    for (var i = 0, l = skinSlotData.displays.length; i < l; ++i) {
                        var displayData = skinSlotData.displays[i];
                        this._replaceSlotDisplay(dataPackage, displayData, slot, i);
                    }
                }
            }
        };
        /**
         * @private
         */
        BaseFactory.prototype.getAllDragonBonesData = function () {
            return this._dragonBonesDataMap;
        };
        /**
         * @private
         */
        BaseFactory.prototype.getAllTextureAtlasData = function () {
            return this._textureAtlasDataMap;
        };
        return BaseFactory;
    }());
    /**
     * @private
     */
    BaseFactory._defaultParser = null;
    dragonBones.BaseFactory = BaseFactory;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 贴图集数据。
     * @version DragonBones 3.0
     */
    var EgretTextureAtlasData = (function (_super) {
        __extends(EgretTextureAtlasData, _super);
        /**
         * @private
         */
        function EgretTextureAtlasData() {
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        EgretTextureAtlasData.toString = function () {
            return "[class dragonBones.EgretTextureAtlasData]";
        };
        /**
         * @inheritDoc
         */
        EgretTextureAtlasData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                //this.texture.dispose();
                this.texture = null;
            }
        };
        /**
         * @private
         */
        EgretTextureAtlasData.prototype.generateTexture = function () {
            return dragonBones.BaseObject.borrowObject(EgretTextureData);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        EgretTextureAtlasData.prototype.dispose = function () {
            this.returnToPool();
        };
        return EgretTextureAtlasData;
    }(dragonBones.TextureAtlasData));
    dragonBones.EgretTextureAtlasData = EgretTextureAtlasData;
    /**
     * @private
     */
    var EgretTextureData = (function (_super) {
        __extends(EgretTextureData, _super);
        function EgretTextureData() {
            return _super.call(this) || this;
        }
        EgretTextureData.toString = function () {
            return "[class dragonBones.EgretTextureData]";
        };
        /**
         * @inheritDoc
         */
        EgretTextureData.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            if (this.texture) {
                //this.texture.dispose();
                this.texture = null;
            }
        };
        return EgretTextureData;
    }(dragonBones.TextureData));
    dragonBones.EgretTextureData = EgretTextureData;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 事件。
     * @version DragonBones 4.5
     */
    var EgretEvent = (function (_super) {
        __extends(EgretEvent, _super);
        /**
         * @internal
         * @private
         */
        function EgretEvent(type, bubbles, cancelable, data) {
            return _super.call(this, type, bubbles, cancelable, data) || this;
        }
        Object.defineProperty(EgretEvent.prototype, "eventObject", {
            /**
             * @language zh_CN
             * 事件对象。
             * @see dragonBones.EventObject
             * @version DragonBones 4.5
             */
            get: function () {
                return this.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "animationName", {
            /**
             * @deprecated
             * @see #eventObject
             * @see dragonBones.EventObject#animationName
             */
            get: function () {
                return this.eventObject.animationState.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "armature", {
            /**
             * @deprecated
             * @see #eventObject
             * @see dragonBones.EventObject#armature
             */
            get: function () {
                return this.eventObject.armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "bone", {
            /**
             * @deprecated
             * @see #eventObject
             * @see dragonBones.EventObject#bone
             */
            get: function () {
                return this.eventObject.bone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "slot", {
            /**
             * @deprecated
             * @see #eventObject
             * @see dragonBones.EventObject#slot
             */
            get: function () {
                return this.eventObject.slot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "animationState", {
            /**
             * @deprecated
             * @see #eventObject
             * @see dragonBones.EventObject#animationState
             */
            get: function () {
                return this.eventObject.animationState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "frameLabel", {
            /**
             * @deprecated
             * @see dragonBones.EventObject#name
             */
            get: function () {
                return this.eventObject.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "sound", {
            /**
             * @deprecated
             * @see dragonBones.EventObject#name
             */
            get: function () {
                return this.eventObject.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretEvent.prototype, "movementID", {
            /**
             * @deprecated
             * @see #animationName
             */
            get: function () {
                return this.animationName;
            },
            enumerable: true,
            configurable: true
        });
        return EgretEvent;
    }(egret.Event));
    /**
     * @deprecated
     * @see dragonBones.EventObject.START
     */
    EgretEvent.START = dragonBones.EventObject.START;
    /**
     * @deprecated
     * @see dragonBones.EventObject.LOOP_COMPLETE
     */
    EgretEvent.LOOP_COMPLETE = dragonBones.EventObject.LOOP_COMPLETE;
    /**
     * @deprecated
     * @see dragonBones.EventObject.COMPLETE
     */
    EgretEvent.COMPLETE = dragonBones.EventObject.COMPLETE;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FADE_IN
     */
    EgretEvent.FADE_IN = dragonBones.EventObject.FADE_IN;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FADE_IN_COMPLETE
     */
    EgretEvent.FADE_IN_COMPLETE = dragonBones.EventObject.FADE_IN_COMPLETE;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FADE_OUT
     */
    EgretEvent.FADE_OUT = dragonBones.EventObject.FADE_OUT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FADE_OUT_COMPLETE
     */
    EgretEvent.FADE_OUT_COMPLETE = dragonBones.EventObject.FADE_OUT_COMPLETE;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FRAME_EVENT
     */
    EgretEvent.FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.SOUND_EVENT
     */
    EgretEvent.SOUND_EVENT = dragonBones.EventObject.SOUND_EVENT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FRAME_EVENT
     */
    EgretEvent.ANIMATION_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FRAME_EVENT
     */
    EgretEvent.BONE_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.FRAME_EVENT
     */
    EgretEvent.MOVEMENT_FRAME_EVENT = dragonBones.EventObject.FRAME_EVENT;
    /**
     * @deprecated
     * @see dragonBones.EventObject.SOUND_EVENT
     */
    EgretEvent.SOUND = dragonBones.EventObject.SOUND_EVENT;
    dragonBones.EgretEvent = EgretEvent;
    /**
     * @inheritDoc
     */
    var EgretArmatureDisplay = (function (_super) {
        __extends(EgretArmatureDisplay, _super);
        /**
         * @internal
         * @private
         */
        function EgretArmatureDisplay() {
            return _super.call(this) || this;
        }
        /**
         * @internal
         * @private
         */
        EgretArmatureDisplay.prototype._onClear = function () {
            this._disposeProxy = false;
            this._armature = null;
            this._debugDrawer = null;
        };
        /**
         * @internal
         * @private
         */
        EgretArmatureDisplay.prototype._dispatchEvent = function (type, eventObject) {
            var event = egret.Event.create(EgretEvent, type);
            event.data = eventObject;
            _super.prototype.dispatchEvent.call(this, event);
            egret.Event.release(event);
        };
        /**
         * @internal
         * @private
         */
        EgretArmatureDisplay.prototype._debugDraw = function (isEnabled) {
            if (isEnabled) {
                if (!this._debugDrawer) {
                    this._debugDrawer = new egret.Sprite();
                }
                this.addChild(this._debugDrawer);
                this._debugDrawer.graphics.clear();
                var bones = this._armature.getBones();
                for (var i = 0, l = bones.length; i < l; ++i) {
                    var bone = bones[i];
                    var boneLength = bone.length;
                    var startX = bone.globalTransformMatrix.tx;
                    var startY = bone.globalTransformMatrix.ty;
                    var endX = startX + bone.globalTransformMatrix.a * boneLength;
                    var endY = startY + bone.globalTransformMatrix.b * boneLength;
                    this._debugDrawer.graphics.lineStyle(2.0, bone.ik ? 0xFF0000 : 0x00FFFF, 0.7);
                    this._debugDrawer.graphics.moveTo(startX, startY);
                    this._debugDrawer.graphics.lineTo(endX, endY);
                    this._debugDrawer.graphics.lineStyle(0.0, 0, 0);
                    this._debugDrawer.graphics.beginFill(0x00FFFF, 0.7);
                    this._debugDrawer.graphics.drawCircle(startX, startY, 3.0);
                    this._debugDrawer.graphics.endFill();
                }
                var slots = this._armature.getSlots();
                for (var i = 0, l = slots.length; i < l; ++i) {
                    var slot = slots[i];
                    var boundingBoxData = slot.boundingBoxData;
                    if (boundingBoxData) {
                        var child = this._debugDrawer.getChildByName(slot.name);
                        if (!child) {
                            child = new egret.Shape();
                            child.name = slot.name;
                            this._debugDrawer.addChild(child);
                        }
                        child.graphics.clear();
                        child.graphics.beginFill(boundingBoxData.color ? boundingBoxData.color : 0xFF00FF, 0.3);
                        switch (boundingBoxData.type) {
                            case 0 /* Rectangle */:
                                child.graphics.drawRect(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                break;
                            case 1 /* Ellipse */:
                                child.graphics.drawEllipse(-boundingBoxData.width * 0.5, -boundingBoxData.height * 0.5, boundingBoxData.width, boundingBoxData.height);
                                break;
                            case 2 /* Polygon */:
                                var vertices = boundingBoxData.vertices;
                                for (var iA = 0, lA = boundingBoxData.vertices.length; iA < lA; iA += 2) {
                                    if (iA === 0) {
                                        child.graphics.moveTo(vertices[iA], vertices[iA + 1]);
                                    }
                                    else {
                                        child.graphics.lineTo(vertices[iA], vertices[iA + 1]);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                        child.graphics.endFill();
                        slot._updateTransformAndMatrix();
                        child.$setMatrix(slot.globalTransformMatrix, false);
                    }
                    else {
                        var child = this._debugDrawer.getChildByName(slot.name);
                        if (child) {
                            this._debugDrawer.removeChild(child);
                        }
                    }
                }
            }
            else if (this._debugDrawer && this._debugDrawer.parent === this) {
                this.removeChild(this._debugDrawer);
            }
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.dispose = function (disposeProxy) {
            if (disposeProxy === void 0) { disposeProxy = true; }
            this._disposeProxy = disposeProxy;
            if (this._armature) {
                this._armature.dispose();
                this._armature = null;
            }
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.hasEvent = function (type) {
            return this.hasEventListener(type);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.addEvent = function (type, listener, target) {
            this.addEventListener(type, listener, target);
        };
        /**
         * @inheritDoc
         */
        EgretArmatureDisplay.prototype.removeEvent = function (type, listener, target) {
            this.removeEventListener(type, listener, target);
        };
        Object.defineProperty(EgretArmatureDisplay.prototype, "armature", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._armature;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EgretArmatureDisplay.prototype, "animation", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._armature.animation;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see dragonBones.Animation#timescale
         * @see dragonBones.Animation#stop()
         */
        EgretArmatureDisplay.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                this._armature.clock = dragonBones.EgretFactory._clock;
            }
            else {
                this._armature.clock = null;
            }
        };
        return EgretArmatureDisplay;
    }(egret.DisplayObjectContainer));
    dragonBones.EgretArmatureDisplay = EgretArmatureDisplay;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var Event = (function (_super) {
        __extends(Event, _super);
        function Event() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Event;
    }(EgretEvent));
    dragonBones.Event = Event;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var ArmatureEvent = (function (_super) {
        __extends(ArmatureEvent, _super);
        function ArmatureEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ArmatureEvent;
    }(EgretEvent));
    dragonBones.ArmatureEvent = ArmatureEvent;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var AnimationEvent = (function (_super) {
        __extends(AnimationEvent, _super);
        function AnimationEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AnimationEvent;
    }(EgretEvent));
    dragonBones.AnimationEvent = AnimationEvent;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var FrameEvent = (function (_super) {
        __extends(FrameEvent, _super);
        function FrameEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FrameEvent;
    }(EgretEvent));
    dragonBones.FrameEvent = FrameEvent;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    var SoundEvent = (function (_super) {
        __extends(SoundEvent, _super);
        function SoundEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SoundEvent;
    }(EgretEvent));
    dragonBones.SoundEvent = SoundEvent;
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    var EgretTextureAtlas = (function (_super) {
        __extends(EgretTextureAtlas, _super);
        function EgretTextureAtlas(texture, rawData, scale) {
            if (scale === void 0) { scale = 1; }
            var _this = _super.call(this) || this;
            _this._onClear();
            _this.texture = texture;
            dragonBones.ObjectDataParser.getInstance().parseTextureAtlasData(rawData, _this, scale);
            return _this;
        }
        /**
         * @private
         */
        EgretTextureAtlas.toString = function () {
            return "[class dragonBones.EgretTextureAtlas]";
        };
        return EgretTextureAtlas;
    }(dragonBones.EgretTextureAtlasData));
    dragonBones.EgretTextureAtlas = EgretTextureAtlas;
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    var EgretSheetAtlas = (function (_super) {
        __extends(EgretSheetAtlas, _super);
        function EgretSheetAtlas() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return EgretSheetAtlas;
    }(EgretTextureAtlas));
    dragonBones.EgretSheetAtlas = EgretSheetAtlas;
    /**
     * @deprecated
     * @see dragonBones.EgretFactory#soundEventManater
     */
    var SoundEventManager = (function () {
        function SoundEventManager() {
        }
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManater
         */
        SoundEventManager.getInstance = function () {
            return dragonBones.EgretFactory.factory.soundEventManager;
        };
        return SoundEventManager;
    }());
    dragonBones.SoundEventManager = SoundEventManager;
    /**
     * @deprecated
     * @see dragonBones.Armature#cacheFrameRate
     * @see dragonBones.Armature#enableAnimationCache()
     */
    var AnimationCacheManager = (function () {
        function AnimationCacheManager() {
        }
        return AnimationCacheManager;
    }());
    dragonBones.AnimationCacheManager = AnimationCacheManager;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 工厂。
     * @version DragonBones 3.0
     */
    var EgretFactory = (function (_super) {
        __extends(EgretFactory, _super);
        /**
         * @language zh_CN
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         */
        function EgretFactory(dataParser) {
            if (dataParser === void 0) { dataParser = null; }
            var _this = _super.call(this, dataParser) || this;
            if (!EgretFactory._eventManager) {
                EgretFactory._eventManager = new dragonBones.EgretArmatureDisplay();
                EgretFactory._clock = new dragonBones.WorldClock();
                EgretFactory._clock.time = egret.getTimer() * 0.001;
                egret.startTick(EgretFactory._clockHandler, EgretFactory);
            }
            return _this;
        }
        EgretFactory._clockHandler = function (time) {
            time *= 0.001;
            var passedTime = time - EgretFactory._clock.time;
            EgretFactory._clock.advanceTime(passedTime);
            EgretFactory._clock.time = time;
            return false;
        };
        Object.defineProperty(EgretFactory, "factory", {
            /**
             * @language zh_CN
             * 一个可以直接使用的全局工厂实例。
             * @version DragonBones 4.7
             */
            get: function () {
                if (!EgretFactory._factory) {
                    EgretFactory._factory = new EgretFactory();
                }
                return EgretFactory._factory;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        EgretFactory.prototype._generateTextureAtlasData = function (textureAtlasData, textureAtlas) {
            if (textureAtlasData) {
                textureAtlasData.texture = textureAtlas;
            }
            else {
                textureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.EgretTextureAtlasData);
            }
            return textureAtlasData;
        };
        /**
         * @private
         */
        EgretFactory.prototype._generateArmature = function (dataPackage) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
            var armatureDisplay = new dragonBones.EgretArmatureDisplay();
            armatureDisplay._armature = armature;
            armature._init(dataPackage.armature, dataPackage.skin, armatureDisplay, armatureDisplay, EgretFactory._eventManager);
            return armature;
        };
        /**
         * @private
         */
        EgretFactory.prototype._generateSlot = function (dataPackage, skinSlotData, armature) {
            var slotData = skinSlotData.slot;
            var slot = dragonBones.BaseObject.borrowObject(dragonBones.EgretSlot);
            var displayList = [];
            slot._init(skinSlotData, new egret.Bitmap(), new egret.Mesh());
            for (var i = 0, l = skinSlotData.displays.length; i < l; ++i) {
                var displayData = skinSlotData.displays[i];
                switch (displayData.type) {
                    case 0 /* Image */:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }
                        displayList.push(slot.rawDisplay);
                        break;
                    case 2 /* Mesh */:
                        if (!displayData.texture || dataPackage.textureAtlasName) {
                            displayData.texture = this._getTextureData(dataPackage.textureAtlasName || dataPackage.dataName, displayData.path);
                        }
                        if (!displayData.mesh && displayData.share) {
                            displayData.mesh = skinSlotData.getMesh(displayData.share);
                        }
                        if (egret.Capabilities.renderMode === "webgl" || egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
                            displayList.push(slot.meshDisplay);
                        }
                        else {
                            console.warn("Canvas can not support mesh, please change renderMode to webgl.");
                            displayList.push(slot.rawDisplay);
                        }
                        break;
                    case 1 /* Armature */:
                        var childArmature = this.buildArmature(displayData.path, dataPackage.dataName, null, dataPackage.textureAtlasName);
                        if (childArmature) {
                            childArmature.inheritAnimation = displayData.inheritAnimation;
                            if (!childArmature.inheritAnimation) {
                                var actions = slotData.actions.length > 0 ? slotData.actions : childArmature.armatureData.actions;
                                if (actions.length > 0) {
                                    for (var i_8 = 0, l_5 = actions.length; i_8 < l_5; ++i_8) {
                                        childArmature._bufferAction(actions[i_8]);
                                    }
                                }
                                else {
                                    childArmature.animation.play();
                                }
                            }
                            displayData.armature = childArmature.armatureData; // 
                        }
                        displayList.push(childArmature);
                        break;
                    default:
                        displayList.push(null);
                        break;
                }
            }
            slot._setDisplayList(displayList);
            return slot;
        };
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架的显示容器。
         * @see dragonBones.EgretArmatureDisplay
         * @version DragonBones 4.5
         */
        EgretFactory.prototype.buildArmatureDisplay = function (armatureName, dragonBonesName, skinName, textureAtlasName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
            if (armature) {
                EgretFactory._clock.add(armature);
                return armature.display;
            }
            return null;
        };
        /**
         * @language zh_CN
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param textureAtlasName 指定的贴图集数据名称，如果未设置，将检索所有的贴图集数据。
         * @version DragonBones 3.0
         */
        EgretFactory.prototype.getTextureDisplay = function (textureName, textureAtlasName) {
            if (textureAtlasName === void 0) { textureAtlasName = null; }
            var textureData = this._getTextureData(textureAtlasName, textureName);
            if (textureData) {
                if (!textureData.texture) {
                    var textureAtlasTexture = textureData.parent.texture;
                    textureData.texture = new egret.Texture();
                    textureData.texture._bitmapData = textureAtlasTexture._bitmapData;
                    textureData.texture.$initData(textureData.region.x, textureData.region.y, textureData.region.width, textureData.region.height, 0, 0, textureData.region.width, textureData.region.height, textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight);
                }
                return new egret.Bitmap(textureData.texture);
            }
            return null;
        };
        Object.defineProperty(EgretFactory.prototype, "soundEventManager", {
            /**
             * @language zh_CN
             * 获取全局声音事件管理器。
             * @version DragonBones 4.5
             */
            get: function () {
                return EgretFactory._eventManager;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addDragonBonesData()
         */
        EgretFactory.prototype.addSkeletonData = function (dragonBonesData, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            this.addDragonBonesData(dragonBonesData, dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getDragonBonesData()
         */
        EgretFactory.prototype.getSkeletonData = function (dragonBonesName) {
            return this.getDragonBonesData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeSkeletonData()
         */
        EgretFactory.prototype.removeSkeletonData = function (dragonBonesName) {
            this.removeDragonBonesData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addTextureAtlasData()
         */
        EgretFactory.prototype.addTextureAtlas = function (textureAtlasData, dragonBonesName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            this.addTextureAtlasData(textureAtlasData, dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getTextureAtlasData()
         */
        EgretFactory.prototype.getTextureAtlas = function (dragonBonesName) {
            return this.getTextureAtlasData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        EgretFactory.prototype.removeTextureAtlas = function (dragonBonesName) {
            this.removeTextureAtlasData(dragonBonesName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#buildArmature()
         */
        EgretFactory.prototype.buildFastArmature = function (armatureName, dragonBonesName, skinName) {
            if (dragonBonesName === void 0) { dragonBonesName = null; }
            if (skinName === void 0) { skinName = null; }
            return this.buildArmature(armatureName, dragonBonesName, skinName);
        };
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#clear()
         */
        EgretFactory.prototype.dispose = function () {
            this.clear();
        };
        Object.defineProperty(EgretFactory.prototype, "soundEventManater", {
            /**
             * @deprecated
             * @see dragonBones.EgretFactory#soundEventManager()
             */
            get: function () {
                return EgretFactory._eventManager;
            },
            enumerable: true,
            configurable: true
        });
        return EgretFactory;
    }(dragonBones.BaseFactory));
    EgretFactory._factory = null;
    EgretFactory._eventManager = null;
    /**
     * @private
     */
    EgretFactory._clock = null;
    dragonBones.EgretFactory = EgretFactory;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @language zh_CN
     * Egret 插槽。
     * @version DragonBones 3.0
     */
    var EgretSlot = (function (_super) {
        __extends(EgretSlot, _super);
        /**
         * @internal
         * @private
         */
        function EgretSlot() {
            return _super.call(this) || this;
        }
        /**
         * @private
         */
        EgretSlot.toString = function () {
            return "[class dragonBones.EgretSlot]";
        };
        /**
         * @private
         */
        EgretSlot.prototype._onClear = function () {
            _super.prototype._onClear.call(this);
            this.transformUpdateEnabled = false;
            this._renderDisplay = null;
            this._colorFilter = null;
        };
        /**
         * @private
         */
        EgretSlot.prototype._initDisplay = function (value) {
        };
        /**
         * @private
         */
        EgretSlot.prototype._disposeDisplay = function (value) {
        };
        /**
         * @private
         */
        EgretSlot.prototype._onUpdateDisplay = function () {
            this._renderDisplay = (this._display ? this._display : this._rawDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._addDisplay = function () {
            var container = this._armature.display;
            container.addChild(this._renderDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._replaceDisplay = function (value) {
            var container = this._armature.display;
            var prevDisplay = value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._removeDisplay = function () {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateZOrder = function () {
            var container = this._armature.display;
            var index = container.getChildIndex(this._renderDisplay);
            if (index === this._zOrder) {
                return;
            }
            container.addChildAt(this._renderDisplay, this._zOrder < index ? this._zOrder : this._zOrder + 1);
        };
        /**
         * @internal
         * @private
         */
        EgretSlot.prototype._updateVisible = function () {
            this._renderDisplay.visible = this._parent.visible;
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateBlendMode = function () {
            switch (this._blendMode) {
                case 0 /* Normal */:
                    this._renderDisplay.blendMode = egret.BlendMode.NORMAL;
                    break;
                case 1 /* Add */:
                    this._renderDisplay.blendMode = egret.BlendMode.ADD;
                    break;
                case 5 /* Erase */:
                    this._renderDisplay.blendMode = egret.BlendMode.ERASE;
                    break;
                default:
                    break;
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateColor = function () {
            if (this._colorTransform.redMultiplier !== 1 ||
                this._colorTransform.greenMultiplier !== 1 ||
                this._colorTransform.blueMultiplier !== 1 ||
                this._colorTransform.redOffset !== 0 ||
                this._colorTransform.greenOffset !== 0 ||
                this._colorTransform.blueOffset !== 0 ||
                this._colorTransform.alphaOffset !== 0) {
                if (!this._colorFilter) {
                    this._colorFilter = new egret.ColorMatrixFilter();
                }
                var colorMatrix = this._colorFilter.matrix;
                colorMatrix[0] = this._colorTransform.redMultiplier;
                colorMatrix[6] = this._colorTransform.greenMultiplier;
                colorMatrix[12] = this._colorTransform.blueMultiplier;
                colorMatrix[18] = this._colorTransform.alphaMultiplier;
                colorMatrix[4] = this._colorTransform.redOffset;
                colorMatrix[9] = this._colorTransform.greenOffset;
                colorMatrix[14] = this._colorTransform.blueOffset;
                colorMatrix[19] = this._colorTransform.alphaOffset;
                this._colorFilter.matrix = colorMatrix;
                var filters = this._renderDisplay.filters;
                if (!filters) {
                    filters = [];
                }
                if (filters.indexOf(this._colorFilter) < 0) {
                    filters.push(this._colorFilter);
                }
                this._renderDisplay.filters = filters;
            }
            else {
                if (this._colorFilter) {
                    this._colorFilter = null;
                    this._renderDisplay.filters = null;
                }
                this._renderDisplay.$setAlpha(this._colorTransform.alphaMultiplier);
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateFrame = function () {
            var isMeshDisplay = this._meshData && this._display === this._meshDisplay;
            var currentTextureData = this._textureData;
            if (this._displayIndex >= 0 && this._display && currentTextureData) {
                var currentTextureAtlasData = currentTextureData.parent;
                // Update replaced texture atlas.
                if (this._armature.replacedTexture && this._displayData && currentTextureAtlasData === this._displayData.texture.parent) {
                    currentTextureAtlasData = this._armature._replaceTextureAtlasData;
                    if (!currentTextureAtlasData) {
                        currentTextureAtlasData = dragonBones.BaseObject.borrowObject(dragonBones.EgretTextureAtlasData);
                        currentTextureAtlasData.copyFrom(this._textureData.parent);
                        currentTextureAtlasData.texture = this._armature.replacedTexture;
                        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
                    }
                    currentTextureData = currentTextureAtlasData.getTexture(currentTextureData.name);
                }
                var currentTextureAtlas = currentTextureAtlasData.texture ? currentTextureAtlasData.texture._bitmapData : null;
                if (currentTextureAtlas) {
                    if (!currentTextureData.texture) {
                        var textureAtlasWidth = currentTextureAtlasData.width > 0.0 ? currentTextureAtlasData.width : currentTextureAtlas.width;
                        var textureAtlasHeight = currentTextureAtlasData.height > 0.0 ? currentTextureAtlasData.height : currentTextureAtlas.height;
                        var subTextureWidth = Math.min(currentTextureData.region.width, textureAtlasWidth - currentTextureData.region.x); // TODO need remove
                        var subTextureHeight = Math.min(currentTextureData.region.height, textureAtlasHeight - currentTextureData.region.y); // TODO need remove
                        currentTextureData.texture = new egret.Texture();
                        currentTextureData.texture._bitmapData = currentTextureAtlas;
                        currentTextureData.texture.$initData(currentTextureData.region.x, currentTextureData.region.y, subTextureWidth, subTextureHeight, 0, 0, subTextureWidth, subTextureHeight, textureAtlasWidth, textureAtlasHeight);
                    }
                    if (isMeshDisplay) {
                        var meshDisplay = this._renderDisplay;
                        var meshNode = meshDisplay.$renderNode;
                        meshNode.uvs.length = 0;
                        meshNode.vertices.length = 0;
                        meshNode.indices.length = 0;
                        for (var i = 0, l = this._meshData.vertices.length; i < l; ++i) {
                            meshNode.uvs[i] = this._meshData.uvs[i];
                            meshNode.vertices[i] = this._meshData.vertices[i];
                        }
                        for (var i = 0, l = this._meshData.vertexIndices.length; i < l; ++i) {
                            meshNode.indices[i] = this._meshData.vertexIndices[i];
                        }
                        meshDisplay.$setBitmapData(currentTextureData.texture);
                        meshDisplay.$setAnchorOffsetX(this._pivotX);
                        meshDisplay.$setAnchorOffsetY(this._pivotY);
                        meshDisplay.$updateVertices();
                        meshDisplay.$invalidateTransform();
                    }
                    else {
                        var normalDisplay = this._renderDisplay;
                        normalDisplay.$setBitmapData(currentTextureData.texture);
                        normalDisplay.$setAnchorOffsetX(this._pivotX);
                        normalDisplay.$setAnchorOffsetY(this._pivotY);
                    }
                    this._updateVisible();
                    return;
                }
            }
            if (isMeshDisplay) {
                var meshDisplay = this._renderDisplay;
                meshDisplay.visible = false;
                meshDisplay.$setBitmapData(null);
                meshDisplay.x = 0.0;
                meshDisplay.y = 0.0;
            }
            else {
                var normalDisplay = this._renderDisplay;
                normalDisplay.visible = false;
                normalDisplay.$setBitmapData(null);
                normalDisplay.x = 0.0;
                normalDisplay.y = 0.0;
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateMesh = function () {
            var meshDisplay = this._renderDisplay;
            var meshNode = meshDisplay.$renderNode;
            var hasFFD = this._ffdVertices.length > 0;
            if (this._meshData.skinned) {
                for (var i = 0, iF = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var iH = i / 2;
                    var boneIndices = this._meshData.boneIndices[iH];
                    var boneVertices = this._meshData.boneVertices[iH];
                    var weights = this._meshData.weights[iH];
                    var xG = 0, yG = 0;
                    for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        var bone = this._meshBones[boneIndices[iB]];
                        var matrix = bone.globalTransformMatrix;
                        var weight = weights[iB];
                        var xL = 0, yL = 0;
                        if (hasFFD) {
                            xL = boneVertices[iB * 2] + this._ffdVertices[iF];
                            yL = boneVertices[iB * 2 + 1] + this._ffdVertices[iF + 1];
                        }
                        else {
                            xL = boneVertices[iB * 2];
                            yL = boneVertices[iB * 2 + 1];
                        }
                        xG += (matrix.a * xL + matrix.c * yL + matrix.tx) * weight;
                        yG += (matrix.b * xL + matrix.d * yL + matrix.ty) * weight;
                        iF += 2;
                    }
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }
                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
            else if (hasFFD) {
                var vertices = this._meshData.vertices;
                for (var i = 0, l = this._meshData.vertices.length; i < l; i += 2) {
                    var xG = vertices[i] + this._ffdVertices[i];
                    var yG = vertices[i + 1] + this._ffdVertices[i + 1];
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }
                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
        };
        /**
         * @private
         */
        EgretSlot.prototype._updateTransform = function (isSkinnedMesh) {
            if (isSkinnedMesh) {
                var transformationMatrix = this._renderDisplay.matrix;
                transformationMatrix.identity();
                this._renderDisplay.$setMatrix(transformationMatrix, this.transformUpdateEnabled);
            }
            else {
                if (this.transformUpdateEnabled) {
                    this._renderDisplay.$setMatrix(this.globalTransformMatrix, this.transformUpdateEnabled);
                    this._renderDisplay.$setAnchorOffsetX(this._pivotX);
                    this._renderDisplay.$setAnchorOffsetX(this._pivotY);
                }
                else {
                    var values = this._renderDisplay.$DisplayObject;
                    var displayMatrix = values[6];
                    displayMatrix.a = this.globalTransformMatrix.a;
                    displayMatrix.b = this.globalTransformMatrix.b;
                    displayMatrix.c = this.globalTransformMatrix.c;
                    displayMatrix.d = this.globalTransformMatrix.d;
                    displayMatrix.tx = this.globalTransformMatrix.tx;
                    displayMatrix.ty = this.globalTransformMatrix.ty;
                    this._renderDisplay.$removeFlags(8);
                    this._renderDisplay.$invalidatePosition();
                }
            }
        };
        return EgretSlot;
    }(dragonBones.Slot));
    dragonBones.EgretSlot = EgretSlot;
})(dragonBones || (dragonBones = {}));
var dragonBones;
(function (dragonBones) {
    /**
     * @private
     */
    var MovieSlot = (function (_super) {
        __extends(MovieSlot, _super);
        function MovieSlot(slotConfig) {
            var _this = _super.call(this) || this;
            _this.displayIndex = -1;
            _this.colorIndex = -1;
            _this.transformIndex = -1;
            _this.rawDisplay = new egret.Bitmap();
            _this.childMovies = {};
            _this.config = null;
            _this.displayConfig = null;
            _this.display = null;
            _this.childMovie = null;
            _this.colorFilter = null;
            _this.display = _this.rawDisplay;
            _this.config = slotConfig;
            _this.rawDisplay.name = _this.config.name;
            if (_this.config.blendMode == null) {
                _this.config.blendMode = 0 /* Normal */;
            }
            return _this;
        }
        MovieSlot.prototype.dispose = function () {
            this.rawDisplay = null;
            this.childMovies = null;
            this.config = null;
            this.displayConfig = null;
            this.display = null;
            this.childMovie = null;
            this.colorFilter = null;
        };
        return MovieSlot;
    }(egret.HashObject));
    /**
     * @private
     */
    var _helpRectangle = new egret.Rectangle();
    /**
     * @private
     */
    var _helpMatrix = new egret.Matrix();
    /**
     * @private
     */
    var _groupConfigMap = {};
    /**
     * @private
     */
    function _findObjectInArray(array, name) {
        for (var i = 0, l = array.length; i < l; ++i) {
            var data = array[i];
            if (data.name === name) {
                return data;
            }
        }
        return null;
    }
    /**
     * @private
     */
    function _fillCreateMovieHelper(createMovieHelper) {
        if (createMovieHelper.groupName) {
            var groupConfig = _groupConfigMap[createMovieHelper.groupName];
            if (groupConfig) {
                var movieConfig = _findObjectInArray(groupConfig.movie, createMovieHelper.movieName);
                if (movieConfig) {
                    createMovieHelper.groupConfig = groupConfig;
                    createMovieHelper.movieConfig = movieConfig;
                    return true;
                }
            }
        }
        if (!createMovieHelper.groupName) {
            for (var groupName in _groupConfigMap) {
                var groupConfig = _groupConfigMap[groupName];
                if (!createMovieHelper.groupName) {
                    var movieConfig = _findObjectInArray(groupConfig.movie, createMovieHelper.movieName);
                    if (movieConfig) {
                        createMovieHelper.groupName = groupName;
                        createMovieHelper.groupConfig = groupConfig;
                        createMovieHelper.movieConfig = movieConfig;
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * @language zh_CN
     * 是否包含指定名称的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function hasMovieGroup(groupName) {
        return _groupConfigMap[groupName] != null;
    }
    dragonBones.hasMovieGroup = hasMovieGroup;
    /**
     * @language zh_CN
     * 添加动画组。
     * @param groupData 动画二进制数据。
     * @param textureAtlas 贴图集或贴图集列表。
     * @param groupName 为动画组指定一个名称，如果未设置，则使用数据中的名称。
     * @version DragonBones 4.7
     */
    function addMovieGroup(groupData, textureAtlas, groupName) {
        if (groupName === void 0) { groupName = null; }
        if (groupData) {
            var byteArray = new egret.ByteArray(groupData);
            byteArray.endian = egret.Endian.LITTLE_ENDIAN;
            byteArray.position = 8; // TODO format
            var groupConfig = JSON.parse(byteArray.readUTF());
            groupConfig.offset = byteArray.position;
            groupConfig.arrayBuffer = groupData;
            groupConfig.textures = [];
            var p = groupConfig.offset % 4;
            if (p) {
                groupConfig.offset += 4 - p;
            }
            for (var i = 0, l = groupConfig.position.length; i < l; i += 3) {
                switch (i / 3) {
                    case 1:
                        groupConfig.displayFrameArray = new Int16Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                    case 2:
                        groupConfig.rectangleArray = new Float32Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                    case 3:
                        groupConfig.transformArray = new Float32Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                    case 4:
                        groupConfig.colorArray = new Int16Array(groupConfig.arrayBuffer, groupConfig.offset + groupConfig.position[i], groupConfig.position[i + 1] / groupConfig.position[i + 2]);
                        break;
                }
            }
            groupName = groupName || groupConfig.name;
            if (_groupConfigMap[groupName]) {
            }
            _groupConfigMap[groupName] = groupConfig;
            //
            if (textureAtlas instanceof Array) {
                for (var i = 0, l = textureAtlas.length; i < l; ++i) {
                    var texture = textureAtlas[i];
                    groupConfig.textures.push(texture);
                }
            }
            else {
                groupConfig.textures.push(textureAtlas);
            }
        }
        else {
            throw new Error();
        }
    }
    dragonBones.addMovieGroup = addMovieGroup;
    /**
     * @language zh_CN
     * 移除动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function removeMovieGroup(groupName) {
        var groupConfig = _groupConfigMap[groupName];
        if (groupConfig) {
            delete _groupConfigMap[groupName];
        }
    }
    dragonBones.removeMovieGroup = removeMovieGroup;
    /**
     * @language zh_CN
     * 移除所有的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function removeAllMovieGroup() {
        for (var i in _groupConfigMap) {
            delete _groupConfigMap[i];
        }
    }
    dragonBones.removeAllMovieGroup = removeAllMovieGroup;
    /**
     * @language zh_CN
     * 创建一个动画。
     * @param movieName 动画的名称。
     * @param groupName 动画组的名称，如果未设置，将检索所有的动画组，当多个动画组中包含同名的动画时，可能无法创建出准确的动画。
     * @version DragonBones 4.7
     */
    function buildMovie(movieName, groupName) {
        if (groupName === void 0) { groupName = null; }
        var createMovieHelper = { movieName: movieName, groupName: groupName };
        if (_fillCreateMovieHelper(createMovieHelper)) {
            var movie = new Movie(createMovieHelper);
            return movie;
        }
        else {
            console.warn("No movie named: " + movieName);
        }
        return null;
    }
    dragonBones.buildMovie = buildMovie;
    /**
     * @language zh_CN
     * 获取指定动画组内包含的所有动画名称。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function getMovieNames(groupName) {
        var groupConfig = _groupConfigMap[groupName];
        if (groupConfig) {
            var movieNameGroup = [];
            for (var i = 0, l = groupConfig.movie.length; i < l; ++i) {
                movieNameGroup.push(groupConfig.movie[i].name);
            }
            return movieNameGroup;
        }
        else {
            console.warn("No group named: " + groupName);
        }
        return null;
    }
    dragonBones.getMovieNames = getMovieNames;
    /**
     * @language zh_CN
     * 动画事件。
     * @version DragonBones 4.7
     */
    var MovieEvent = (function (_super) {
        __extends(MovieEvent, _super);
        /**
         * @private
         */
        function MovieEvent(type) {
            var _this = _super.call(this, type) || this;
            /**
             * @language zh_CN
             * 事件名称。 (帧标签的名称或声音的名称)
             * @version DragonBones 4.7
             */
            _this.name = null;
            /**
             * @language zh_CN
             * 发出事件的插槽名称。
             * @version DragonBones 4.7
             */
            _this.slotName = null;
            /**
             * @language zh_CN
             * 发出事件的动画剪辑名称。
             * @version DragonBones 4.7
             */
            _this.clipName = null;
            /**
             * @language zh_CN
             * 发出事件的动画。
             * @version DragonBones 4.7
             */
            _this.movie = null;
            return _this;
        }
        return MovieEvent;
    }(egret.Event));
    /**
     * @language zh_CN
     * 动画剪辑开始播放。
     * @version DragonBones 4.7
     */
    MovieEvent.START = "start";
    /**
     * @language zh_CN
     * 动画剪辑循环播放一次完成。
     * @version DragonBones 4.7
     */
    MovieEvent.LOOP_COMPLETE = "loopComplete";
    /**
     * @language zh_CN
     * 动画剪辑播放完成。
     * @version DragonBones 4.7
     */
    MovieEvent.COMPLETE = "complete";
    /**
     * @language zh_CN
     * 动画剪辑帧事件。
     * @version DragonBones 4.7
     */
    MovieEvent.FRAME_EVENT = "frameEvent";
    /**
     * @language zh_CN
     * 动画剪辑声音事件。
     * @version DragonBones 4.7
     */
    MovieEvent.SOUND_EVENT = "soundEvent";
    dragonBones.MovieEvent = MovieEvent;
    /**
     * @language zh_CN
     * 通过读取缓存的二进制动画数据来更新动画，具有良好的运行性能，同时对内存的占用也非常低。
     * @see dragonBones.buildMovie
     * @version DragonBones 4.7
     */
    var Movie = (function (_super) {
        __extends(Movie, _super);
        /**
         * @internal
         * @private
         */
        function Movie(createMovieHelper) {
            var _this = _super.call(this) || this;
            /**
             * @language zh_CN
             * 动画的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
             * @default 1
             * @version DragonBones 4.7
             */
            _this.timeScale = 1;
            /**
             * @language zh_CN
             * 动画剪辑的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
             * （当再次播放其他动画剪辑时，此值将被重置为 1）
             * @default 1
             * @version DragonBones 4.7
             */
            _this.clipTimeScale = 1;
            _this._batchEnabled = true;
            _this._isLockDispose = false;
            _this._isDelayDispose = false;
            _this._isStarted = false;
            _this._isPlaying = false;
            _this._isReversing = false;
            _this._isCompleted = false;
            _this._playTimes = 0;
            _this._time = 0;
            _this._currentTime = 0;
            _this._timeStamp = 0;
            _this._currentPlayTimes = 0;
            _this._cacheFrameIndex = 0;
            _this._frameSize = 0;
            _this._cacheRectangle = null;
            _this._clock = null;
            _this._groupConfig = null;
            _this._config = null;
            _this._clipConfig = null;
            _this._currentFrameConfig = null;
            _this._clipArray = null;
            _this._clipNames = [];
            _this._slots = [];
            _this._childMovies = [];
            _this._groupConfig = createMovieHelper.groupConfig;
            _this._config = createMovieHelper.movieConfig;
            _this._batchEnabled = !_this._config.isNested;
            if (_this._batchEnabled) {
                _this.$renderNode = new egret.sys.GroupNode();
                _this.$renderNode.cleanBeforeRender = Movie._cleanBeforeRender;
            }
            _this._clipNames.length = 0;
            for (var i = 0, l = _this._config.clip.length; i < l; ++i) {
                _this._clipNames.push(_this._config.clip[i].name);
            }
            for (var i = 0, l = _this._config.slot.length; i < l; ++i) {
                var slot = new MovieSlot(_this._config.slot[i]);
                _this._updateSlotBlendMode(slot);
                _this._slots.push(slot);
                if (_this._batchEnabled) {
                    _this.$renderNode.addNode(slot.rawDisplay.$renderNode);
                }
                else {
                    _this.addChild(slot.rawDisplay);
                }
            }
            _this._frameSize = (1 + 1) * _this._slots.length; // displayFrame, transformFrame.
            dragonBones.EgretFactory.factory; //
            _this.advanceTimeBySelf(true);
            _this.name = _this._config.name;
            _this.play();
            _this.advanceTime(0.000001);
            _this.stop();
            return _this;
        }
        Movie._cleanBeforeRender = function () { };
        Movie.prototype._configToEvent = function (config, event) {
            event.movie = this;
            event.clipName = this._clipConfig.name;
            event.name = config.name;
            event.slotName = config.slot;
        };
        Movie.prototype._onCrossFrame = function (frameConfig) {
            for (var i = 0, l = frameConfig.actionAndEvent.length; i < l; ++i) {
                var actionAndEvent = frameConfig.actionAndEvent[i];
                if (actionAndEvent) {
                    switch (actionAndEvent.type) {
                        case 11 /* Sound */:
                            if (dragonBones.EgretFactory.factory.soundEventManager.hasEventListener(MovieEvent.SOUND_EVENT)) {
                                var event_1 = egret.Event.create(MovieEvent, MovieEvent.SOUND_EVENT);
                                this._configToEvent(actionAndEvent, event_1);
                                dragonBones.EgretFactory.factory.soundEventManager.dispatchEvent(event_1);
                                egret.Event.release(event_1);
                            }
                            break;
                        case 10 /* Frame */:
                            if (this.hasEventListener(MovieEvent.FRAME_EVENT)) {
                                var event_2 = egret.Event.create(MovieEvent, MovieEvent.FRAME_EVENT);
                                this._configToEvent(actionAndEvent, event_2);
                                this.dispatchEvent(event_2);
                                egret.Event.release(event_2);
                            }
                            break;
                        case 0 /* Play */:
                        case 4 /* Fade */:
                            if (actionAndEvent.slot) {
                                var slot = this._getSlot(actionAndEvent.slot);
                                if (slot && slot.childMovie) {
                                    slot.childMovie.play(actionAndEvent.name);
                                }
                            }
                            else {
                                this.play(actionAndEvent.name);
                            }
                            break;
                    }
                }
            }
        };
        Movie.prototype._updateSlotBlendMode = function (slot) {
            var blendMode = "";
            switch (slot.config.blendMode) {
                case 0 /* Normal */:
                    blendMode = egret.BlendMode.NORMAL;
                    break;
                case 1 /* Add */:
                    blendMode = egret.BlendMode.ADD;
                    break;
                case 5 /* Erase */:
                    blendMode = egret.BlendMode.ERASE;
                    break;
                default:
                    break;
            }
            if (blendMode) {
                if (this._batchEnabled) {
                    // RenderNode display.
                    slot.display.$renderNode.blendMode = egret.sys.blendModeToNumber(blendMode);
                }
                else {
                    // Classic display.
                    slot.display.blendMode = blendMode;
                }
            }
        };
        Movie.prototype._updateSlotColor = function (slot, aM, rM, gM, bM, aO, rO, gO, bO) {
            if (rM !== 1 ||
                gM !== 1 ||
                bM !== 1 ||
                rO !== 0 ||
                gO !== 0 ||
                bO !== 0 ||
                aO !== 0) {
                if (!slot.colorFilter) {
                    slot.colorFilter = new egret.ColorMatrixFilter();
                }
                var colorMatrix = slot.colorFilter.matrix;
                colorMatrix[0] = rM;
                colorMatrix[6] = gM;
                colorMatrix[12] = bM;
                colorMatrix[18] = aM;
                colorMatrix[4] = rO;
                colorMatrix[9] = gO;
                colorMatrix[14] = bO;
                colorMatrix[19] = aO;
                slot.colorFilter.matrix = colorMatrix;
                if (this._batchEnabled) {
                    // RenderNode display.
                    var filter = slot.display.$renderNode.filter;
                    slot.display.$renderNode.filter = slot.colorFilter;
                }
                else {
                    // Classic display.
                    var filters = slot.display.filters;
                    if (!filters) {
                        filters = [];
                    }
                    if (filters.indexOf(slot.colorFilter) < 0) {
                        filters.push(slot.colorFilter);
                    }
                    slot.display.filters = filters;
                }
            }
            else {
                if (slot.colorFilter) {
                    slot.colorFilter = null;
                }
                if (this._batchEnabled) {
                    // RenderNode display.
                    slot.display.$renderNode.filter = null;
                    slot.display.$renderNode.alpha = aM;
                }
                else {
                    // Classic display.
                    slot.display.filters = null;
                    slot.display.$setAlpha(aM);
                }
            }
        };
        Movie.prototype._updateSlotDisplay = function (slot) {
            var prevDisplay = slot.display || slot.rawDisplay;
            var prevChildMovie = slot.childMovie;
            if (slot.displayIndex >= 0) {
                slot.displayConfig = this._groupConfig.display[slot.displayIndex];
                if (slot.displayConfig.type === 1 /* Armature */) {
                    var childMovie = slot.childMovies[slot.displayConfig.name];
                    if (!childMovie) {
                        childMovie = buildMovie(slot.displayConfig.name, this._groupConfig.name);
                        childMovie.advanceTimeBySelf(false);
                        slot.childMovies[slot.displayConfig.name] = childMovie;
                    }
                    slot.display = childMovie;
                    slot.childMovie = childMovie;
                }
                else {
                    slot.display = slot.rawDisplay;
                    slot.childMovie = null;
                }
            }
            else {
                slot.displayConfig = null;
                slot.display = slot.rawDisplay;
                slot.childMovie = null;
            }
            if (slot.display !== prevDisplay) {
                if (prevDisplay) {
                    this.addChild(slot.display);
                    this.swapChildren(slot.display, prevDisplay);
                    this.removeChild(prevDisplay);
                }
                // Update blendMode.
                this._updateSlotBlendMode(slot);
            }
            // Update frame.
            if (slot.display === slot.rawDisplay) {
                if (slot.displayConfig && slot.displayConfig.regionIndex != null) {
                    if (!slot.displayConfig.texture) {
                        var textureAtlasTexture = this._groupConfig.textures[0]; // TODO
                        var regionIndex = slot.displayConfig.regionIndex * 4;
                        var x = this._groupConfig.rectangleArray[regionIndex];
                        var y = this._groupConfig.rectangleArray[regionIndex + 1];
                        var width = this._groupConfig.rectangleArray[regionIndex + 2];
                        var height = this._groupConfig.rectangleArray[regionIndex + 3];
                        slot.displayConfig.texture = new egret.Texture();
                        slot.displayConfig.texture._bitmapData = textureAtlasTexture._bitmapData;
                        slot.displayConfig.texture.$initData(x, y, Math.min(width, textureAtlasTexture.textureWidth - x), Math.min(height, textureAtlasTexture.textureHeight - y), 0, 0, Math.min(width, textureAtlasTexture.textureWidth - x), Math.min(height, textureAtlasTexture.textureHeight - y), textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight);
                    }
                    if (this._batchEnabled) {
                        // RenderNode display.
                        var texture = slot.displayConfig.texture;
                        var bitmapNode = slot.rawDisplay.$renderNode;
                        egret.sys.RenderNode.prototype.cleanBeforeRender.call(slot.rawDisplay.$renderNode);
                        bitmapNode.image = texture._bitmapData;
                        bitmapNode.drawImage(texture._bitmapX, texture._bitmapY, texture._bitmapWidth, texture._bitmapHeight, texture._offsetX, texture._offsetY, texture.textureWidth, texture.textureHeight);
                        bitmapNode.imageWidth = texture._sourceWidth;
                        bitmapNode.imageHeight = texture._sourceHeight;
                    }
                    else {
                        // Classic display.
                        slot.rawDisplay.visible = true;
                        slot.rawDisplay.$setBitmapData(slot.displayConfig.texture);
                    }
                }
                else {
                    if (this._batchEnabled) {
                        // RenderNode display.
                        slot.rawDisplay.$renderNode.image = null;
                    }
                    else {
                        // Classic display.
                        slot.rawDisplay.visible = false;
                        slot.rawDisplay.$setBitmapData(null);
                    }
                }
            }
            // Update child movie.
            if (slot.childMovie !== prevChildMovie) {
                if (prevChildMovie) {
                    prevChildMovie.stop();
                    this._childMovies.slice(this._childMovies.indexOf(prevChildMovie), 1);
                }
                if (slot.childMovie) {
                    if (this._childMovies.indexOf(slot.childMovie) < 0) {
                        this._childMovies.push(slot.childMovie);
                    }
                    if (slot.config.action) {
                        slot.childMovie.play(slot.config.action);
                    }
                    else {
                        slot.childMovie.play(slot.childMovie._config.action);
                    }
                }
            }
        };
        Movie.prototype._getSlot = function (name) {
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                if (slot.config.name === name) {
                    return slot;
                }
            }
            return null;
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.$render = function () {
            if (this._batchEnabled) {
            }
            else {
                // Classic display.
                _super.prototype.$render.call(this);
            }
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.$measureContentBounds = function (bounds) {
            if (this._batchEnabled && this._cacheRectangle) {
                // RenderNode display.
                bounds.setTo(this._cacheRectangle.x, this._cacheRectangle.y, this._cacheRectangle.width - this._cacheRectangle.x, this._cacheRectangle.height - this._cacheRectangle.y);
            }
            else {
                // Classic display.
                _super.prototype.$measureContentBounds.call(this, bounds);
            }
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.$doAddChild = function (child, index, notifyListeners) {
            if (this._batchEnabled) {
                // RenderNode display.
                console.warn("Can not add child.");
                return null;
            }
            // Classic display.
            return _super.prototype.$doAddChild.call(this, child, index, notifyListeners);
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.$doRemoveChild = function (index, notifyListeners) {
            if (this._batchEnabled) {
                // RenderNode display.
                console.warn("Can not remove child.");
                return null;
            }
            // Classic display.
            return _super.prototype.$doRemoveChild.call(this, index, notifyListeners);
        };
        /**
         * @language zh_CN
         * 释放动画。
         * @version DragonBones 3.0
         */
        Movie.prototype.dispose = function () {
            if (this._isLockDispose) {
                this._isDelayDispose = true;
            }
            else {
                if (this._clock) {
                    this._clock.remove(this);
                }
                if (this._slots) {
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        this._slots[i].dispose();
                    }
                }
                this._isPlaying = false;
                this._cacheRectangle = null;
                this._clock = null;
                this._groupConfig = null;
                this._config = null;
                this._clipConfig = null;
                this._currentFrameConfig = null;
                this._clipArray = null;
                this._clipNames = null;
                this._slots = null;
                this._childMovies = null;
            }
        };
        /**
         * @inheritDoc
         */
        Movie.prototype.advanceTime = function (passedTime) {
            if (!this._isPlaying) {
                return;
            }
            this._isLockDispose = true;
            if (passedTime < 0) {
                passedTime = -passedTime;
            }
            passedTime *= this.timeScale;
            this._time += passedTime * this.clipTimeScale;
            // Modify time.            
            var duration = this._clipConfig.duration;
            var totalTime = duration * this._playTimes;
            var currentTime = this._time;
            var currentPlayTimes = this._currentPlayTimes;
            if (this._playTimes > 0 && (currentTime >= totalTime || currentTime <= -totalTime)) {
                this._isCompleted = true;
                currentPlayTimes = this._playTimes;
                if (currentTime < 0) {
                    currentTime = 0;
                }
                else {
                    currentTime = duration;
                }
            }
            else {
                this._isCompleted = false;
                if (currentTime < 0) {
                    currentPlayTimes = Math.floor(-currentTime / duration);
                    currentTime = duration - (-currentTime % duration);
                }
                else {
                    currentPlayTimes = Math.floor(currentTime / duration);
                    currentTime %= duration;
                }
                if (this._playTimes > 0 && currentPlayTimes > this._playTimes) {
                    currentPlayTimes = this._playTimes;
                }
            }
            if (this._currentTime === currentTime) {
                return;
            }
            var cacheFrameIndex = Math.floor(currentTime * this._clipConfig.cacheTimeToFrameScale);
            if (this._cacheFrameIndex !== cacheFrameIndex) {
                this._cacheFrameIndex = cacheFrameIndex;
                var displayFrameArray = this._groupConfig.displayFrameArray;
                var transformArray = this._groupConfig.transformArray;
                var colorArray = this._groupConfig.colorArray;
                //
                var isFirst = true;
                var hasDisplay = false;
                var needCacheRectangle = false;
                var prevCacheRectangle = this._cacheRectangle;
                this._cacheRectangle = this._clipConfig.cacheRectangles[this._cacheFrameIndex];
                if (this._batchEnabled && !this._cacheRectangle) {
                    needCacheRectangle = true;
                    this._cacheRectangle = new egret.Rectangle();
                    this._clipConfig.cacheRectangles[this._cacheFrameIndex] = this._cacheRectangle;
                }
                // Update slots.
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    var slot = this._slots[i];
                    var clipFrameIndex = this._frameSize * this._cacheFrameIndex + i * 2;
                    var displayFrameIndex = this._clipArray[clipFrameIndex] * 2;
                    if (displayFrameIndex >= 0) {
                        var displayIndex = displayFrameArray[displayFrameIndex];
                        var colorIndex = displayFrameArray[displayFrameIndex + 1] * 8;
                        var transformIndex = this._clipArray[clipFrameIndex + 1] * 6;
                        var colorChange = false;
                        if (slot.displayIndex !== displayIndex) {
                            slot.displayIndex = displayIndex;
                            colorChange = true;
                            this._updateSlotDisplay(slot);
                        }
                        if (slot.colorIndex !== colorIndex || colorChange) {
                            slot.colorIndex = colorIndex;
                            if (slot.colorIndex >= 0) {
                                this._updateSlotColor(slot, colorArray[colorIndex] * 0.01, colorArray[colorIndex + 1] * 0.01, colorArray[colorIndex + 2] * 0.01, colorArray[colorIndex + 3] * 0.01, colorArray[colorIndex + 4], colorArray[colorIndex + 5], colorArray[colorIndex + 6], colorArray[colorIndex + 7]);
                            }
                            else {
                                this._updateSlotColor(slot, 1, 1, 1, 1, 0, 0, 0, 0);
                            }
                        }
                        hasDisplay = true;
                        if (slot.transformIndex !== transformIndex) {
                            slot.transformIndex = transformIndex;
                            if (this._batchEnabled) {
                                // RenderNode display.
                                var matrix = slot.display.$renderNode.matrix;
                                if (!matrix) {
                                    matrix = slot.display.$renderNode.matrix = new egret.Matrix();
                                }
                                matrix.a = transformArray[transformIndex];
                                matrix.b = transformArray[transformIndex + 1];
                                matrix.c = transformArray[transformIndex + 2];
                                matrix.d = transformArray[transformIndex + 3];
                                matrix.tx = transformArray[transformIndex + 4];
                                matrix.ty = transformArray[transformIndex + 5];
                            }
                            else {
                                // Classic display.
                                _helpMatrix.a = transformArray[transformIndex];
                                _helpMatrix.b = transformArray[transformIndex + 1];
                                _helpMatrix.c = transformArray[transformIndex + 2];
                                _helpMatrix.d = transformArray[transformIndex + 3];
                                _helpMatrix.tx = transformArray[transformIndex + 4];
                                _helpMatrix.ty = transformArray[transformIndex + 5];
                                slot.display.$setMatrix(_helpMatrix);
                            }
                        }
                        // 
                        if (this._batchEnabled && needCacheRectangle) {
                            // RenderNode display.
                            var matrix = slot.display.$renderNode.matrix;
                            _helpRectangle.x = 0;
                            _helpRectangle.y = 0;
                            _helpRectangle.width = slot.displayConfig.texture.textureWidth;
                            _helpRectangle.height = slot.displayConfig.texture.textureHeight;
                            matrix.$transformBounds(_helpRectangle);
                            if (isFirst) {
                                isFirst = false;
                                this._cacheRectangle.x = _helpRectangle.x;
                                this._cacheRectangle.width = _helpRectangle.x + _helpRectangle.width;
                                this._cacheRectangle.y = _helpRectangle.y;
                                this._cacheRectangle.height = _helpRectangle.y + _helpRectangle.height;
                            }
                            else {
                                this._cacheRectangle.x = Math.min(this._cacheRectangle.x, _helpRectangle.x);
                                this._cacheRectangle.width = Math.max(this._cacheRectangle.width, _helpRectangle.x + _helpRectangle.width);
                                this._cacheRectangle.y = Math.min(this._cacheRectangle.y, _helpRectangle.y);
                                this._cacheRectangle.height = Math.max(this._cacheRectangle.height, _helpRectangle.y + _helpRectangle.height);
                            }
                        }
                    }
                    else if (slot.displayIndex !== -1) {
                        slot.displayIndex = -1;
                        this._updateSlotDisplay(slot);
                    }
                }
                //
                if (this._cacheRectangle) {
                    if (hasDisplay && needCacheRectangle && isFirst && prevCacheRectangle) {
                        this._cacheRectangle.x = prevCacheRectangle.x;
                        this._cacheRectangle.y = prevCacheRectangle.y;
                        this._cacheRectangle.width = prevCacheRectangle.width;
                        this._cacheRectangle.height = prevCacheRectangle.height;
                    }
                    this.$invalidateContentBounds();
                }
            }
            if (this._isCompleted) {
                this._isPlaying = false;
            }
            if (!this._isStarted) {
                this._isStarted = true;
                if (this.hasEventListener(MovieEvent.START)) {
                    var event_3 = egret.Event.create(MovieEvent, MovieEvent.START);
                    event_3.movie = this;
                    event_3.clipName = this._clipConfig.name;
                    event_3.name = null;
                    event_3.slotName = null;
                    this.dispatchEvent(event_3);
                }
            }
            this._isReversing = this._currentTime > currentTime && this._currentPlayTimes === currentPlayTimes;
            // Action and event.
            var frameCount = this._clipConfig.frame ? this._clipConfig.frame.length : 0;
            if (frameCount > 0) {
                var currentFrameIndex = Math.floor(this._currentTime * this._config.frameRate);
                var currentFrameConfig = this._groupConfig.frame[this._clipConfig.frame[currentFrameIndex]];
                if (this._currentFrameConfig !== currentFrameConfig) {
                    if (frameCount > 1) {
                        var crossedFrameConfig = this._currentFrameConfig;
                        this._currentFrameConfig = currentFrameConfig;
                        if (!crossedFrameConfig) {
                            var prevFrameIndex = Math.floor(this._currentTime * this._config.frameRate);
                            crossedFrameConfig = this._groupConfig.frame[this._clipConfig.frame[prevFrameIndex]];
                            if (this._isReversing) {
                            }
                            else {
                                if (this._currentTime <= crossedFrameConfig.position ||
                                    this._currentPlayTimes !== currentPlayTimes) {
                                    crossedFrameConfig = this._groupConfig.frame[crossedFrameConfig.prev];
                                }
                            }
                        }
                        if (this._isReversing) {
                            while (crossedFrameConfig !== currentFrameConfig) {
                                this._onCrossFrame(crossedFrameConfig);
                                crossedFrameConfig = this._groupConfig.frame[crossedFrameConfig.prev];
                            }
                        }
                        else {
                            while (crossedFrameConfig !== currentFrameConfig) {
                                crossedFrameConfig = this._groupConfig.frame[crossedFrameConfig.next];
                                this._onCrossFrame(crossedFrameConfig);
                            }
                        }
                    }
                    else {
                        this._currentFrameConfig = currentFrameConfig;
                        if (this._currentFrameConfig) {
                            this._onCrossFrame(this._currentFrameConfig);
                        }
                    }
                }
            }
            this._currentTime = currentTime;
            // Advance child armatre time.
            for (var i = 0, l = this._childMovies.length; i < l; ++i) {
                this._childMovies[i].advanceTime(passedTime);
            }
            if (this._currentPlayTimes !== currentPlayTimes) {
                this._currentPlayTimes = currentPlayTimes;
                if (this.hasEventListener(MovieEvent.LOOP_COMPLETE)) {
                    var event_4 = egret.Event.create(MovieEvent, MovieEvent.LOOP_COMPLETE);
                    event_4.movie = this;
                    event_4.clipName = this._clipConfig.name;
                    event_4.name = null;
                    event_4.slotName = null;
                    this.dispatchEvent(event_4);
                    egret.Event.release(event_4);
                }
                if (this._isCompleted && this.hasEventListener(MovieEvent.COMPLETE)) {
                    var event_5 = egret.Event.create(MovieEvent, MovieEvent.COMPLETE);
                    event_5.movie = this;
                    event_5.clipName = this._clipConfig.name;
                    event_5.name = null;
                    event_5.slotName = null;
                    this.dispatchEvent(event_5);
                    egret.Event.release(event_5);
                }
            }
            this._isLockDispose = false;
            if (this._isDelayDispose) {
                this.dispose();
            }
        };
        /**
         * @language zh_CN
         * 播放动画剪辑。
         * @param clipName 动画剪辑的名称，如果未设置，则播放默认动画剪辑，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画剪辑。
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 4.7
         */
        Movie.prototype.play = function (clipName, playTimes) {
            if (clipName === void 0) { clipName = null; }
            if (playTimes === void 0) { playTimes = -1; }
            if (clipName) {
                var clipConfig = null;
                for (var i = 0, l = this._config.clip.length; i < l; ++i) {
                    var data = this._config.clip[i];
                    if (data.name === clipName) {
                        clipConfig = data;
                    }
                }
                if (clipConfig) {
                    this._clipConfig = clipConfig;
                    this._clipArray = new Int16Array(this._groupConfig.arrayBuffer, this._groupConfig.offset + this._groupConfig.position[0] + this._clipConfig.p, this._clipConfig.s / this._groupConfig.position[2]);
                    if (!this._clipConfig.cacheRectangles) {
                        this._clipConfig.cacheRectangles = [];
                    }
                    this._isPlaying = true;
                    this._isStarted = false;
                    this._isCompleted = false;
                    if (playTimes < 0 || playTimes !== playTimes) {
                        this._playTimes = this._clipConfig.playTimes;
                    }
                    else {
                        this._playTimes = playTimes;
                    }
                    this._time = 0;
                    this._currentTime = 0;
                    this._currentPlayTimes = 0;
                    this._cacheFrameIndex = -1;
                    this._currentFrameConfig = null;
                    this._cacheRectangle = null;
                    this.clipTimeScale = 1 / this._clipConfig.scale;
                }
                else {
                    console.warn("No clip in movie.", this._config.name, clipName);
                }
            }
            else if (this._clipConfig) {
                if (this._isPlaying || this._isCompleted) {
                    this.play(this._clipConfig.name, this._playTimes);
                }
                else {
                    this._isPlaying = true;
                }
            }
            else if (this._config.action) {
                this.play(this._config.action, playTimes);
            }
        };
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @version DragonBones 4.7
         */
        Movie.prototype.stop = function () {
            this._isPlaying = false;
        };
        /**
         * @language zh_CN
         * 从指定时间播放动画。
         * @param clipName 动画剪辑的名称。
         * @param time 指定时间。（以秒为单位）
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 4.7
         */
        Movie.prototype.gotoAndPlay = function (clipName, time, playTimes) {
            if (clipName === void 0) { clipName = null; }
            if (playTimes === void 0) { playTimes = -1; }
            time %= this._clipConfig.duration;
            if (time < 0) {
                time += this._clipConfig.duration;
            }
            this.play(clipName, playTimes);
            this._time = time;
            this._currentTime = time;
        };
        /**
         * @language zh_CN
         * 将动画停止到指定时间。
         * @param clipName 动画剪辑的名称。
         * @param time 指定时间。（以秒为单位）
         * @version DragonBones 4.7
         */
        Movie.prototype.gotoAndStop = function (clipName, time) {
            if (clipName === void 0) { clipName = null; }
            time %= this._clipConfig.duration;
            if (time < 0) {
                time += this._clipConfig.duration;
            }
            this.play(clipName, 1);
            this._time = time;
            this._currentTime = time;
            this.advanceTime(0.001);
            this.stop();
        };
        /**
         * @language zh_CN
         * 是否包含指定动画剪辑。
         * @param clipName 动画剪辑的名称。
         * @version DragonBones 4.7
         */
        Movie.prototype.hasClip = function (clipName) {
            for (var i = 0, l = this._config.clip.length; i < l; ++i) {
                var clip = this._config.clip[i];
                if (clip.name === clipName) {
                    return true;
                }
            }
            return false;
        };
        Object.defineProperty(Movie.prototype, "isPlaying", {
            /**
             * @language zh_CN
             * 动画剪辑是否处正在播放。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._isPlaying && !this._isCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "isComplete", {
            /**
             * @language zh_CN
             * 动画剪辑是否均播放完毕。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._isCompleted;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "currentTime", {
            /**
             * @language zh_CN
             * 当前动画剪辑的播放时间。 (以秒为单位)
             * @version DragonBones 4.7
             */
            get: function () {
                return this._currentTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "totalTime", {
            /**
             * @language zh_CN
             * 当前动画剪辑的总时间。 (以秒为单位)
             * @version DragonBones 4.7
             */
            get: function () {
                return this._clipConfig ? this._clipConfig.duration : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "currentPlayTimes", {
            /**
             * @language zh_CN
             * 当前动画剪辑的播放次数。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._currentPlayTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "playTimes", {
            /**
             * @language zh_CN
             * 当前动画剪辑需要播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
             * @version DragonBones 4.7
             */
            get: function () {
                return this._playTimes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "groupName", {
            get: function () {
                return this._groupConfig.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "clipName", {
            /**
             * @language zh_CN
             * 正在播放的动画剪辑名称。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._clipConfig ? this._clipConfig.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "clipNames", {
            /**
             * @language zh_CN
             * 所有动画剪辑的名称。
             * @version DragonBones 4.7
             */
            get: function () {
                return this._clipNames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Movie.prototype, "clock", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this._clock;
            },
            set: function (value) {
                if (this._clock === value) {
                    return;
                }
                var prevClock = this._clock;
                this._clock = value;
                if (prevClock) {
                    prevClock.remove(this);
                }
                if (this._clock) {
                    this._clock.add(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @language zh_CN
         * 由 Movie 自己来更新动画。
         * @param on 开启或关闭 Movie 自己对动画的更新。
         * @version DragonBones 4.7
         */
        Movie.prototype.advanceTimeBySelf = function (on) {
            if (on) {
                this.clock = dragonBones.EgretFactory._clock;
            }
            else {
                this.clock = null;
            }
        };
        return Movie;
    }(egret.DisplayObjectContainer));
    dragonBones.Movie = Movie;
})(dragonBones || (dragonBones = {}));
