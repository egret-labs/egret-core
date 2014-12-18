module dragonBones {
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
}
