/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="TMXTileMap.ts"/>
/// <reference path="TMXConst.ts"/>
/// <reference path="../../egret/core/Logger.ts"/>
/// <reference path="../../egret/display/Bitmap.ts"/>
/// <reference path="../../egret/texture/TextureCache.ts"/>
module ns_egret {
    export class TMXLayer extends DisplayObjectContainer {
        private _texture:Texture = null;
        private _layerWidth:number = null;
        private _layerHeight:number = null;
        private _mapTileWidth:number = null;
        private _mapTileHeight:number = null;
        private _tiles = null;
        private _tileSet:TMXTilesetInfo = null;
        private _layerOrientation = null;
        private _properties = null;
        private _layerName:string = "";
        private _opacity:number = 1;
        private _minGID:number = null;
        private _maxGID:number = null;
        private _atlasIndexArray = null;

        public static create(tilesetInfo:TMXTilesetInfo, layerInfo:TMXLayerInfo, mapInfo:TMXMapInfo):TMXLayer {
            var ret:TMXLayer = new TMXLayer();
            ret.initWithTilesetInfo(tilesetInfo, layerInfo, mapInfo);
            return ret;
        }

        public initWithTilesetInfo(tilesetInfo:TMXTilesetInfo, layerInfo:TMXLayerInfo, mapInfo:TMXMapInfo) {
            this._texture = TextureCache.getInstance().getTexture(tilesetInfo.sourceImage);
            this._layerName = layerInfo.name;
            this._layerWidth = layerInfo.layerWidth;
            this._layerHeight = layerInfo.layerHeight;
            this._tiles = layerInfo._tiles;
            this._minGID = layerInfo._minGID;
            this._maxGID = layerInfo._maxGID;
            this._opacity = layerInfo.opacity;
            this.setProperties(layerInfo.getProperties());
            this._tileSet = tilesetInfo;

            this._mapTileWidth = mapInfo.getTileWidth();
            this._mapTileHeight = mapInfo.getTileHeight();
            this._layerOrientation = mapInfo.getOrientation();

            var offset = this.calculateLayerOffset(layerInfo.layerX, layerInfo.layerY);
            this.x = offset.x;
            this.y = offset.y;

            this._atlasIndexArray = [];
        }

        private calculateLayerOffset(x:number, y:number) {
            var ret:Point = Point.identity;
            switch (this._layerOrientation) {
                case ns_egret.TMX.ORIENTATION_ORTHO:
                    ret.x = x * this._mapTileWidth;
                    ret.y = -y * this._mapTileHeight;
                    break;
                case ns_egret.TMX.ORIENTATION_ISO:
                    ret.x = (this._mapTileWidth / 2) * (x - y);
                    ret.y = (this._mapTileHeight / 2 ) * (-x - y);
                    break;
                case ns_egret.TMX.ORIENTATION_HEX:
                    if (x !== 0 || y !== 0)
                        ns_egret.Logger.info("hexagonal map还没有完成");
                    break;
            }
            return ret;
        }

        public setupTiles() {
            this._tileSet.imageWidth = this._texture._textureWidth;
            this._tileSet.imageHeight = this._texture._textureHeight;

            var locLayerHeight = this._layerHeight, locLayerWidth = this._layerWidth;
            for (var y = 0; y < locLayerHeight; y++) {
                for (var x = 0; x < locLayerWidth; x++) {
                    var pos = x + locLayerWidth * y;
                    var gid = this._tiles[pos];
                    if (gid !== 0) {
                        this.appendTileForGID(gid, x, y);
                        this._minGID = Math.min(gid, this._minGID);
                        this._maxGID = Math.max(gid, this._maxGID);
                    }
                }
            }

            if (!((this._maxGID >= this._tileSet.firstGid) && (this._minGID >= this._tileSet.firstGid))) {
                ns_egret.Logger.warning("每个layer只支持1个tileset");
            }
        }

        private appendTileForGID(gid, x, y) {
            var rect:Point = this._tileSet.rectForGID(gid);
            var z = 0 | (x + y * this._layerWidth);
            var tile = this.reusedTileWithRect(rect);
            this.setupTileSprite(tile, x, y, gid);

            var indexForZ = this._atlasIndexArray.length;
            super.addChild(tile, indexForZ);
            return tile;
        }

        private reusedTileWithRect(rect:Point) {
            var tile = Bitmap.initWithTexture(TextureCache.getInstance().getTexture(this._tileSet.sourceImage));
            var spriteframe:SpriteSheetFrame = new SpriteSheetFrame();
            spriteframe.x = rect.x;
            spriteframe.y = rect.y;
            spriteframe.w = this._mapTileWidth;
            spriteframe.h = this._mapTileHeight;
            tile.spriteFrame = spriteframe;
            return tile;
        }

        private setupTileSprite(sprite, x:number, y:number, gid) {
            var position:Point = this.getPositionAt(x, y);
            sprite.x = position.x;
            sprite.y = position.y;

//        sprite.alpha = this._opacity;
            return;
            // 3种翻转，水平、垂直和对角线
        }

        public getPositionAt(x:number, y:number):Point {
            var ret:Point = Point.identity;
            switch (this._layerOrientation) {
                case ns_egret.TMX.ORIENTATION_ORTHO:
                    ret = this.positionForOrthoAt(x, y);
                    break;
                case ns_egret.TMX.ORIENTATION_ISO:
                    ret = this.positionForIsoAt(x, y);
                    break;
                case ns_egret.TMX.ORIENTATION_HEX:
                    ret = this.positionForHexAt(x, y);
                    break;
                default:
                    ret.x = 0;
                    ret.y = 0;
                    break;
            }
            return ret;
        }

        private positionForIsoAt(x:number, y:number):Point {
            Point.identity.x = this._mapTileWidth / 2 * ( this._layerWidth + x - y - 1);
            Point.identity.y = -this._mapTileHeight / 2 * (( this._layerHeight * 2 - x - y) - 2);
            return Point.identity;
        }

        private positionForOrthoAt(x:number, y:number):Point {
            Point.identity.x = x * this._mapTileWidth;
            Point.identity.y = -(this._layerHeight - y - 1) * this._mapTileHeight;
            return Point.identity;
        }

        private positionForHexAt(x:number, y:number):Point {
            var diffY:number = (x % 2 == 1) ? (-this._mapTileHeight / 2) : 0;
            Point.identity.x = x * this._mapTileWidth * 3 / 4;
            Point.identity.y = -((this._layerHeight - y - 1) * this._mapTileHeight + diffY);
            return Point.identity;
        }

        /**
         * 通过坐标获取GID
         */
        public getTileGIDAt(x, y) {
            if (x >= this._layerWidth || y >= this._layerHeight || x < 0 || y < 0) {
                ns_egret.Logger.fatal("TMXLayer.getTileGIDAt():提供的索引超出范围");
            }
            if (!this._tiles || !this._atlasIndexArray) {
                ns_egret.Logger.info("TMXLayer.getTileGIDAt(): tileMap已经被销毁");
                return null;
            }

            var idx = 0 | (x + y * this._layerWidth);
            var tile = this._tiles[idx];

            return (tile & ns_egret.TMX.TILE_FLIPPED_MASK) >>> 0;
        }

        public getProperties() {
            return this._properties;
        }

        public setProperties(value) {
            this._properties = value;
        }

        public getProperty(propertyName) {
            return this._properties[propertyName];
        }

        public getLayerName() {
            return this._layerName;
        }
    }
}