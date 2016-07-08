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
            this.a = value.a;
            this.b = value.b;
            this.c = value.c;
            this.d = value.d;
            this.tx = value.tx;
            this.ty = value.ty;
        }
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        public identity(): void {
            this.a = this.d = 1;
            this.b = this.c = 0;
            this.tx = this.ty = 0;
        }
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        public concat(value: Matrix): void {
            const aA = this.a;
            const bA = this.b;
            const cA = this.c;
            const dA = this.d;
            const txA = this.tx;
            const tyA = this.ty;
            const aB = value.a;
            const bB = value.b;
            const cB = value.c;
            const dB = value.d;
            const txB = value.tx;
            const tyB = value.ty;

            this.a = aA * aB + bA * cB;
            this.b = aA * bB + bA * dB;
            this.c = cA * aB + dA * cB;
            this.d = cA * bB + dA * dB;
            this.tx = aB * txA + cB * tyA + txB;
            this.ty = dB * tyA + bB * txA + tyB;

            /*
            [
                this.a,
                this.b,
                this.c,
                this.d,
                this.tx,
                this.ty
            ] = [
                this.a * value.a + this.b * value.c,
                this.a * value.b + this.b * value.d,
                this.c * value.a + this.d * value.c,
                this.c * value.b + this.d * value.d,
                value.a * this.tx + value.c * this.tx + value.tx,
                value.d * this.ty + value.b * this.ty + value.ty
            ];
            */
        }
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        public invert(): void {
            const aA = this.a;
            const bA = this.b;
            const cA = this.c;
            const dA = this.d;
            const txA = this.tx;
            const tyA = this.ty;
            const n = aA * dA - bA * cA;

            this.a = dA / n;
            this.b = -bA / n;
            this.c = -cA / n;
            this.d = aA / n;
            this.tx = (cA * tyA - dA * txA) / n;
            this.ty = -(aA * tyA - bA * txA) / n;
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
            result.x = this.a * x + this.c * y;
            result.y = this.b * x + this.d * y;

            if (!delta) {
                result.x += this.tx;
                result.y += this.ty;
            }
        }
    }
}