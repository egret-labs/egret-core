module dragonBones {
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
}
