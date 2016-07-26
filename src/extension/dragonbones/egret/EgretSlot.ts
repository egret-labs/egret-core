namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 插槽。
     * @version DragonBones 3.0
     */
    export class EgretSlot extends Slot {
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.EgretSlot]";
        }

        /**
         * @language zh_CN
         * 是否更新显示对象的变换属性。
         * 为了更好的性能, 并不会更新 display 的变换属性 (x, y, rotation, scaleX, scaleX), 如果需要正确访问这些属性, 则需要设置为 true 。
         * @default false
         * @version DragonBones 3.0
         */
        public transformUpdateEnabled: boolean;

        private _renderDisplay: egret.DisplayObject;
        private _colorFilter: egret.ColorMatrixFilter;

        /**
         * @language zh_CN
         * 创建一个空的插槽。
         * @version DragonBones 3.0
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.transformUpdateEnabled = false;

            this._renderDisplay = null;
            this._colorFilter = null;
        }

        /**
         * @private
         */
        protected _onUpdateDisplay(): void {
            const self = this;

            if (!self._rawDisplay) {
                self._rawDisplay = new egret.Bitmap();
            }

            self._renderDisplay = <egret.DisplayObject>(self._display || self._rawDisplay);
        }
        /**
         * @private
         */
        protected _initDisplay(value: Object): void {
        }
        /**
         * @private
         */
        protected _addDisplay(): void {
            const container = <EgretArmatureDisplay>this._armature._display;
            container.addChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _replaceDisplay(value: Object): void {
            const container = <EgretArmatureDisplay>this._armature._display;
            const prevDisplay = <egret.DisplayObject>value;
            container.addChild(this._renderDisplay);
            container.swapChildren(this._renderDisplay, prevDisplay);
            container.removeChild(prevDisplay);
        }
        /**
         * @private
         */
        protected _removeDisplay(): void {
            this._renderDisplay.parent.removeChild(this._renderDisplay);
        }
        /**
         * @private
         */
        protected _disposeDisplay(value: Object): void {
        }
        /**
         * @private
         */
        public _updateVisible(): void {
            this._renderDisplay.visible = this._parent.visible;
        }
        /**
         * @private
         */
        private static BLEND_MODE_LIST: Array<string> =
        [
            egret.BlendMode.NORMAL,
            egret.BlendMode.ADD,
            null,
            null,
            null,
            egret.BlendMode.ERASE,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ];
        /**
         * @private
         */
        protected _updateBlendMode(): void {
            if (this._blendMode < EgretSlot.BLEND_MODE_LIST.length) {
                const blendMode = EgretSlot.BLEND_MODE_LIST[this._blendMode];
                if (blendMode) {
                    this._renderDisplay.blendMode = blendMode;
                }
            }
        }
        /**
         * @private
         */
        protected _updateColor(): void {
            const self = this;

            if (
                self._colorTransform.redMultiplier != 1 ||
                self._colorTransform.greenMultiplier != 1 ||
                self._colorTransform.blueMultiplier != 1 ||
                self._colorTransform.redOffset != 0 ||
                self._colorTransform.greenOffset != 0 ||
                self._colorTransform.blueOffset != 0
            ) {
                if (!self._colorFilter) {
                    self._colorFilter = new egret.ColorMatrixFilter();
                }

                const colorMatrix = self._colorFilter.matrix;
                colorMatrix[0] = self._colorTransform.redMultiplier;
                colorMatrix[6] = self._colorTransform.greenMultiplier;
                colorMatrix[12] = self._colorTransform.blueMultiplier;
                colorMatrix[18] = self._colorTransform.alphaMultiplier;
                colorMatrix[4] = self._colorTransform.redOffset;
                colorMatrix[9] = self._colorTransform.greenOffset;
                colorMatrix[14] = self._colorTransform.blueOffset;
                colorMatrix[19] = self._colorTransform.alphaOffset;
                self._colorFilter.matrix = colorMatrix;

                let filters = self._renderDisplay.filters;
                if (!filters) {
                    filters = [];
                }

                if (filters.indexOf(self._colorFilter) < 0) {
                    filters.push(self._colorFilter);
                }

                self._renderDisplay.filters = filters;
            } else {
                if (self._colorFilter) {
                    self._colorFilter = null;
                    self._renderDisplay.filters = null;
                }

                self._renderDisplay.$setAlpha(self._colorTransform.alphaMultiplier);
            }
        }
        /**
         * @private
         */
        protected _updateFilters(): void { }
        /**
         * @private
         */
        protected _updateFrame(): void {
            const self = this;

            const frameDisplay = <egret.Bitmap>self._renderDisplay;

            if (self._display && self._displayIndex >= 0) {
                const rawDisplayData = self._displayIndex < self._displayDataSet.displays.length ? self._displayDataSet.displays[self._displayIndex] : null;
                const replacedDisplayData = self._displayIndex < self._replacedDisplayDataSet.length ? self._replacedDisplayDataSet[self._displayIndex] : null;
                const currentDisplayData = replacedDisplayData || rawDisplayData;
                const currentTextureData = <EgretTextureData>currentDisplayData.textureData;
                if (currentTextureData) {
                    const textureAtlasTexture = (<EgretTextureAtlasData>currentTextureData.parent).texture;
                    if (!currentTextureData.texture && textureAtlasTexture) { // Create and cache texture.
                        currentTextureData.texture = new egret.Texture();
                        currentTextureData.texture._bitmapData = textureAtlasTexture._bitmapData;

                        currentTextureData.texture.$initData(
                            currentTextureData.region.x, currentTextureData.region.y,
                            currentTextureData.region.width, currentTextureData.region.height,
                            0, 0,
                            currentTextureData.region.width, currentTextureData.region.height,
                            textureAtlasTexture.textureWidth, textureAtlasTexture.textureHeight
                        );
                    }

                    const texture = (<egret.Texture>self._armature._replacedTexture) || currentTextureData.texture;

                    if (texture) {
                        if (self._meshData && self._display == self._meshDisplay) { // Mesh.
                            const meshDisplay = <egret.Mesh>self._meshDisplay;
                            const meshNode = <egret.sys.MeshNode>meshDisplay.$renderNode;

                            for (let i = 0, l = self._meshData.vertices.length; i < l; ++i) {
                                meshNode.uvs[i] = self._meshData.uvs[i];
                                meshNode.vertices[i] = self._meshData.vertices[i];
                            }

                            for (let i = 0, l = self._meshData.vertexIndices.length; i < l; ++i) {
                                meshNode.indices[i] = self._meshData.vertexIndices[i];
                            }

                            meshDisplay.$setBitmapData(texture);
                            meshDisplay.$updateVertices();
                            meshDisplay.$invalidateTransform();
                        } else { // Normal texture.
                            const rect = currentTextureData.frame || currentTextureData.region;

                            let width = rect.width;
                            let height = rect.height;
                            if (currentTextureData.rotated) {
                                width = rect.height;
                                height = rect.width;
                            }

                            let pivotX = currentDisplayData.pivot.x;
                            let pivotY = currentDisplayData.pivot.y;

                            if (currentDisplayData.isRelativePivot) {
                                pivotX = width * pivotX;
                                pivotY = height * pivotY;
                            }

                            if (currentTextureData.frame) {
                                pivotX += currentTextureData.frame.x;
                                pivotY += currentTextureData.frame.y;
                            }

                            if (rawDisplayData && replacedDisplayData) {
                                pivotX += rawDisplayData.transform.x - replacedDisplayData.transform.x;
                                pivotY += rawDisplayData.transform.y - replacedDisplayData.transform.y;
                            }

                            frameDisplay.$setBitmapData(texture);
                            frameDisplay.$setAnchorOffsetX(pivotX);
                            frameDisplay.$setAnchorOffsetY(pivotY);
                        }

                        self._updateVisible();

                        return;
                    }
                }
            }

            frameDisplay.visible = false;
            frameDisplay.$setBitmapData(null);
            frameDisplay.$setAnchorOffsetX(0);
            frameDisplay.$setAnchorOffsetY(0);
            frameDisplay.x = 0;
            frameDisplay.y = 0;
        }
        /**
         * @private
         */
        protected _updateMesh(): void {
            const self = this;

            const meshDisplay = <egret.Mesh>self._meshDisplay;
            const meshNode = <egret.sys.MeshNode>meshDisplay.$renderNode;
            const hasFFD = self._ffdVertices.length > 0;

            if (self._meshData.skinned) {
                for (let i = 0, iF = 0, l = self._meshData.vertices.length; i < l; i += 2) {
                    let iH = i / 2;

                    const boneIndices = self._meshData.boneIndices[iH];
                    const boneVertices = self._meshData.boneVertices[iH];
                    const weights = self._meshData.weights[iH];

                    let xG = 0, yG = 0;

                    for (let iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        const bone = self._meshBones[boneIndices[iB]];
                        const matrix = bone.globalTransformMatrix;
                        const weight = weights[iB];

                        let xL = 0, yL = 0;
                        if (hasFFD) {
                            xL = boneVertices[iB * 2] + self._ffdVertices[iF];
                            yL = boneVertices[iB * 2 + 1] + self._ffdVertices[iF + 1];
                        } else {
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
            } else if (hasFFD) {
                const vertices = self._meshData.vertices;
                for (let i = 0, l = self._meshData.vertices.length; i < l; i += 2) {
                    const xG = vertices[i] + self._ffdVertices[i];
                    const yG = vertices[i + 1] + self._ffdVertices[i + 1];
                    meshNode.vertices[i] = xG;
                    meshNode.vertices[i + 1] = yG;
                }

                meshDisplay.$updateVertices();
                meshDisplay.$invalidateTransform();
            }
        }
        /**
         * @private
         */
        protected _updateTransform(): void
        {
            const self = this;

            self._renderDisplay.$setMatrix(<egret.Matrix><any>self.globalTransformMatrix, self.transformUpdateEnabled);
        }
    }
}