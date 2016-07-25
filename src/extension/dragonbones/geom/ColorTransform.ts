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
            const self = this;

            self.alphaMultiplier = value.alphaMultiplier;
            self.redMultiplier = value.redMultiplier;
            self.greenMultiplier = value.greenMultiplier;
            self.blueMultiplier = value.blueMultiplier;
            self.alphaOffset = value.alphaOffset;
            self.redOffset = value.redOffset;
            self.redOffset = value.redOffset;
            self.greenOffset = value.blueOffset;
        }

        public identity(): void {
            const self = this;

            self.alphaMultiplier = self.redMultiplier = self.greenMultiplier = self.blueMultiplier = 1;
            self.alphaOffset = self.redOffset = self.greenOffset = self.blueOffset = 0;
        }
    }
}