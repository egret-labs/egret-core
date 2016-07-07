namespace dragonBones {
    /**
     * @language zh_CN
     * 2D 变换。
     * @version DragonBones 3.0
     */
    export class Transform {
        /**
         * @private
         */
        public static normalizeRadian(value: number): number {
            value = (value + Math.PI) % (Math.PI * 2);
            value += value > 0 ? -Math.PI : Math.PI;

            return value;
        }
        /**
         * @private
         */
        public constructor(
            /**
             * @language zh_CN
             * 水平位移。
             * @version DragonBones 3.0
             */
            public x: number = 0,
            /**
             * @language zh_CN
             * 垂直位移。
             * @version DragonBones 3.0
             */
            public y: number = 0,
            /**
             * @language zh_CN
             * 水平倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            public skewX: number = 0,
            /**
             * @language zh_CN
             * 垂直倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            public skewY: number = 0,
            /**
             * @language zh_CN
             * 水平缩放。
             * @version DragonBones 3.0
             */
            public scaleX: number = 1,
            /**
             * @language zh_CN
             * 垂直缩放。
             * @version DragonBones 3.0
             */
            public scaleY: number = 1
        ) {
        }
        /**
         * @private
         */
        public toString(): string {
            return "[object dragonBones.Transform] x:" + this.x + " y:" + this.y + " skewX:" + this.skewX * 180 / Math.PI + " skewY:" + this.skewY * 180 / Math.PI + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
        }
        /**
         * @private
         */
        public copyFrom(value: Transform): Transform {
            this.x = value.x;
            this.y = value.y;
            this.skewX = value.skewX;
            this.skewY = value.skewY;
            this.scaleX = value.scaleX;
            this.scaleY = value.scaleY;

            return this;
        }
        /**
         * @private
         */
        public clone(): Transform {
            const value = new Transform();
            value.copyFrom(this);

            return value;
        }
        /**
         * @private
         */
        public identity(): Transform {
            this.x = this.y = this.skewX = this.skewY = 0;
            this.scaleX = this.scaleY = 1;

            return this;
        }
        /**
         * @private
         */
        public add(value: Transform): Transform {
            this.x += value.x;
            this.y += value.y;
            this.skewX += value.skewX;
            this.skewY += value.skewY;
            this.scaleX *= value.scaleX;
            this.scaleY *= value.scaleY;

            return this;
        }
        /**
         * @private
         */
        public minus(value: Transform): Transform {
            this.x -= value.x;
            this.y -= value.y;
            this.skewX = Transform.normalizeRadian(this.skewX - value.skewX);
            this.skewY = Transform.normalizeRadian(this.skewY - value.skewY);
            this.scaleX /= value.scaleX;
            this.scaleY /= value.scaleY;

            return this;
        }
        /**
         * @private
         */
        public fromMatrix(matrix: Matrix): Transform {
            const PI_Q = Math.PI * 0.25;

            const backupScaleX = this.scaleX, backupScaleY = this.scaleY;

            this.x = matrix.tx;
            this.y = matrix.ty;

            this.skewX = Math.atan(-matrix.c / matrix.d);
            this.skewY = Math.atan(matrix.b / matrix.a);
            if (this.skewX != this.skewX) this.skewX = 0;
            if (this.skewY != this.skewY) this.skewY = 0;

            this.scaleY = (this.skewX > -PI_Q && this.skewX < PI_Q) ? matrix.d / Math.cos(this.skewX) : -matrix.c / Math.sin(this.skewX);
            this.scaleX = (this.skewY > -PI_Q && this.skewY < PI_Q) ? matrix.a / Math.cos(this.skewY) : matrix.b / Math.sin(this.skewY);

            if (backupScaleX >= 0 && this.scaleX < 0) {
                this.scaleX = -this.scaleX;
                this.skewY = this.skewY - Math.PI;
            }

            if (backupScaleY >= 0 && this.scaleY < 0) {
                this.scaleY = -this.scaleY;
                this.skewX = this.skewX - Math.PI;
            }

            return this;
        }
        /**
         * @language zh_CN
         * 转换为矩阵。
         * @param 矩阵。
         * @version DragonBones 3.0
         */
        public toMatrix(matrix: Matrix): void {
            matrix.a = this.scaleX * Math.cos(this.skewY);
            matrix.b = this.scaleX * Math.sin(this.skewY);
            matrix.c = -this.scaleY * Math.sin(this.skewX);
            matrix.d = this.scaleY * Math.cos(this.skewX);
            matrix.tx = this.x;
            matrix.ty = this.y;
        }
        /**
         * @language zh_CN
         * 旋转。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        public get rotation(): number {
            return this.skewY;
        }
        public set rotation(value: number) {
            const dValue = value - this.skewY;
            this.skewX += dValue;
            this.skewY += dValue;
        }
    }
}