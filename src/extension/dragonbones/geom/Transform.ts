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
            const self = this;

            self.x = value.x;
            self.y = value.y;
            self.skewX = value.skewX;
            self.skewY = value.skewY;
            self.scaleX = value.scaleX;
            self.scaleY = value.scaleY;

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
            const self = this;

            self.x = self.y = self.skewX = self.skewY = 0;
            self.scaleX = self.scaleY = 1;

            return this;
        }
        /**
         * @private
         */
        public add(value: Transform): Transform {
            const self = this;

            self.x += value.x;
            self.y += value.y;
            self.skewX += value.skewX;
            self.skewY += value.skewY;
            self.scaleX *= value.scaleX;
            self.scaleY *= value.scaleY;

            return this;
        }
        /**
         * @private
         */
        public minus(value: Transform): Transform {
            const self = this;

            self.x -= value.x;
            self.y -= value.y;
            self.skewX = Transform.normalizeRadian(self.skewX - value.skewX);
            self.skewY = Transform.normalizeRadian(self.skewY - value.skewY);
            self.scaleX /= value.scaleX;
            self.scaleY /= value.scaleY;

            return this;
        }
        /**
         * @private
         */
        public fromMatrix(matrix: Matrix): Transform {
            const self = this;

            const PI_Q = Math.PI * 0.25;

            const backupScaleX = self.scaleX, backupScaleY = self.scaleY;

            self.x = matrix.tx;
            self.y = matrix.ty;

            self.skewX = Math.atan(-matrix.c / matrix.d);
            self.skewY = Math.atan(matrix.b / matrix.a);
            if (self.skewX != self.skewX) self.skewX = 0;
            if (self.skewY != self.skewY) self.skewY = 0;

            self.scaleY = (self.skewX > -PI_Q && self.skewX < PI_Q) ? matrix.d / Math.cos(self.skewX) : -matrix.c / Math.sin(self.skewX);
            self.scaleX = (self.skewY > -PI_Q && self.skewY < PI_Q) ? matrix.a / Math.cos(self.skewY) : matrix.b / Math.sin(self.skewY);

            if (backupScaleX >= 0 && self.scaleX < 0) {
                self.scaleX = -self.scaleX;
                self.skewY = self.skewY - Math.PI;
            }

            if (backupScaleY >= 0 && self.scaleY < 0) {
                self.scaleY = -self.scaleY;
                self.skewX = self.skewX - Math.PI;
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
            const self = this;

            matrix.a = self.scaleX * Math.cos(self.skewY);
            matrix.b = self.scaleX * Math.sin(self.skewY);
            matrix.c = -self.scaleY * Math.sin(self.skewX);
            matrix.d = self.scaleY * Math.cos(self.skewX);
            matrix.tx = self.x;
            matrix.ty = self.y;
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