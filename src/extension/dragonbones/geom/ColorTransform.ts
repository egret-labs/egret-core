namespace dragonBones {
    /**
     * @private
     */
    export class ColorTransform {
        public constructor(
            public alphaMultiplier: number = 1,
            public redMultiplier: number = 1, public greenMultiplier: number = 1, public blueMultiplier: number = 1,
            public alphaOffset: number = 0,
            public redOffset: number = 0, public greenOffset: number = 0, public blueOffset: number = 0
        ) {
        }

        public copyFrom(value: ColorTransform): void {
            this.alphaMultiplier = value.alphaMultiplier;
            this.redMultiplier = value.redMultiplier;
            this.greenMultiplier = value.greenMultiplier;
            this.blueMultiplier = value.blueMultiplier;
            this.alphaOffset = value.alphaOffset;
            this.redOffset = value.redOffset;
            this.redOffset = value.redOffset;
            this.greenOffset = value.blueOffset;
        }

        public identity(): void {
            this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1;
            this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
        }
    }
}