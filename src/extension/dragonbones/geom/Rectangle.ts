namespace dragonBones {
    /**
     * @private
     */
    export class Rectangle {
        public constructor(
            public x: number = 0, public y: number = 0,
            public width: number = 0, public height: number = 0
        ) {
        }

        public copyFrom(value: Rectangle): void {
            this.x = value.x;
            this.y = value.y;
            this.width = value.width;
            this.height = value.height;
        }

        public clear(): void {
            this.x = this.y = 0;
            this.width = this.height = 0;
        }
    }
}