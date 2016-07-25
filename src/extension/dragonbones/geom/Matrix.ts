namespace dragonBones {
    /**
     * @language zh_CN
     * 2D 矩阵。
     * @version DragonBones 3.0
     */
    export class Matrix {
        public constructor(
            public a: number = 1, public b: number = 0,
            public c: number = 0, public d: number = 1,
            public tx: number = 0, public ty: number = 0
        ) {
        }
        /**
         * @language zh_CN
         * 复制矩阵。
         * @param value 需要复制的矩阵。
         * @version DragonBones 3.0
         */
        public copyFrom(value: Matrix): void {
            const self = this;

            self.a = value.a;
            self.b = value.b;
            self.c = value.c;
            self.d = value.d;
            self.tx = value.tx;
            self.ty = value.ty;
        }
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        public identity(): void {
            const self = this;

            self.a = self.d = 1;
            self.b = self.c = 0;
            self.tx = self.ty = 0;
        }
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        public concat(value: Matrix): void {
            const self = this;

            const aA = self.a;
            const bA = self.b;
            const cA = self.c;
            const dA = self.d;
            const txA = self.tx;
            const tyA = self.ty;
            const aB = value.a;
            const bB = value.b;
            const cB = value.c;
            const dB = value.d;
            const txB = value.tx;
            const tyB = value.ty;

            self.a = aA * aB + bA * cB;
            self.b = aA * bB + bA * dB;
            self.c = cA * aB + dA * cB;
            self.d = cA * bB + dA * dB;
            self.tx = aB * txA + cB * tyA + txB;
            self.ty = dB * tyA + bB * txA + tyB;

            /*
            [
                self.a,
                self.b,
                self.c,
                self.d,
                self.tx,
                self.ty
            ] = [
                self.a * value.a + self.b * value.c,
                self.a * value.b + self.b * value.d,
                self.c * value.a + self.d * value.c,
                self.c * value.b + self.d * value.d,
                value.a * self.tx + value.c * self.tx + value.tx,
                value.d * self.ty + value.b * self.ty + value.ty
            ];
            */
        }
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        public invert(): void {
            const self = this;

            const aA = self.a;
            const bA = self.b;
            const cA = self.c;
            const dA = self.d;
            const txA = self.tx;
            const tyA = self.ty;
            const n = aA * dA - bA * cA;

            self.a = dA / n;
            self.b = -bA / n;
            self.c = -cA / n;
            self.d = aA / n;
            self.tx = (cA * tyA - dA * txA) / n;
            self.ty = -(aA * tyA - bA * txA) / n;
        }
        /**
         * @language zh_CN
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         */
        public transformPoint(x: number, y: number, result: { x: number, y: number }, delta: boolean = false): void {
            const self = this;

            result.x = self.a * x + self.c * y;
            result.y = self.b * x + self.d * y;

            if (!delta) {
                result.x += self.tx;
                result.y += self.ty;
            }
        }
    }
}