/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/// <reference path="../../egret/display/DisplayObject.ts"/>
/// <reference path="../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../egret/geom/Rectangle.ts"/>
/// <reference path="../../egret/utils/Logger.ts"/>
/// <reference path="TMXConst.ts"/>
/// <reference path="TMXLayer.ts"/>
/// <reference path="TMXMapInfo.ts"/>

module egret {
    export class TMXTiledMap extends DisplayObjectContainer {

        public mapInfo:egret.TMXMapInfo;
        public viewPortWidth:number = 400;

        public static createWithFile(tmxFile:string):TMXTiledMap {
            var ret:TMXTiledMap = new TMXTiledMap();
            ret.initWithTMXFile(tmxFile);
            return ret;
        }

        public initWithTMXFile(tmxFile:string) {
            if (!tmxFile || tmxFile.length == 0) {
                egret.Logger.fatal("TMXTiledMap.initWithTMXFile(): tmxFile应该是不为null的string");
            }
            var mapInfo:TMXMapInfo = TMXMapInfo.createWithFile(tmxFile);
            if (!mapInfo) {
                return;
            }

            var locTilesets:Array<any> = mapInfo.getTilesets();
            if (!locTilesets || locTilesets.length === 0) {
                egret.Logger.info("TMXTiledMap.initWithTMXFile(): Map没有", tmxFile);
            }
            this.buildWithMapInfo(mapInfo);
        }

        private buildWithMapInfo(mapInfo:TMXMapInfo) {
            this.mapInfo = mapInfo;
            var idx:number = 0;
            var layers:Array<TMXLayerInfo> = mapInfo.getLayers();
            if (layers) {
                var layerInfo:egret.TMXLayerInfo = null;
                for (var i:number = 0, len:number = layers.length; i < len; i++) {
                    layerInfo = layers[i];
                    if (layerInfo && layerInfo.visible) {
                        var child:TMXLayer = this.parseLayer(layerInfo, mapInfo);
                        super.addChild(child);
                        idx++;
                    }
                }
            }
        }

        private parseLayer(layerInfo:TMXLayerInfo, mapInfo:TMXMapInfo):TMXLayer {
            var tileset:TMXTilesetInfo = this.tilesetForLayer(layerInfo, mapInfo);
            var layer:TMXLayer = TMXLayer.create(tileset, layerInfo, mapInfo);
            layerInfo.ownTiles = false;
            layer.setupTiles();
            return layer;
        }

        private tilesetForLayer(layerInfo:TMXLayerInfo, mapInfo:TMXMapInfo):TMXTilesetInfo {
            var layerWidth:number = layerInfo.layerWidth;
            var layerHeight:number = layerInfo.layerHeight;
            var tilesets:Array<TMXTilesetInfo> = mapInfo.getTilesets();
            if (tilesets) {
                for (var i:number = tilesets.length - 1; i >= 0; i--) {
                    var tileset:TMXTilesetInfo = tilesets[i];
                    if (tileset) {
                        for (var y:number = 0; y < layerHeight; y++) {
                            for (var x:number = 0; x < layerWidth; x++) {
                                var pos:number = x + layerWidth * y;
                                var gid:number = layerInfo._tiles[pos];
                                if (gid != 0) {
                                    if (((gid & egret.TMX.TILE_FLIPPED_MASK) >>> 0) >= tileset.firstGid) {
                                        return tileset;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            egret.Logger.warning("TMXLayer" + layerInfo.name + "没有tiles");
            return null;
        }

        public getLayer(layerName:string):TMXLayer {
            if (!layerName || layerName.length === 0) {
                egret.Logger.fatal("TMXTiledMap.getLayer(): layerName应该是不为null的string");
            }
            var l:number = this.numChildren;
            for (var i = 0; i < l; i++) {
                var layer:TMXLayer = <TMXLayer>super.getChildAt(i);
                if (layer && layer.getLayerName && layer.getLayerName() == layerName)
                    return layer;
            }
            return null;
        }

        public getObjectGroup(groupName:string) {
            if (!groupName || groupName.length === 0)
                egret.Logger.fatal("TMXTiledMap.getObjectGroup(): groupName应该是不为null的string");
            var groups:Array<any> = this.mapInfo.getObjectGroups();
            if (groups) {
                for (var i:number = 0, len:number = groups.length; i < len; i++) {
                    var objectGroup = groups[i];
                    if (objectGroup && objectGroup.getGroupName() == groupName) {
                        return objectGroup;
                    }
                }
            }
            return null;
        }

        public propertiesForGID(value) {
            return this.mapInfo.getTileProperties()[value];
        }

        public getProperty(propertyName) {
            return this.mapInfo.getProperties()[propertyName.toString()];
        }

        public setMoveX(x:number) {
            this.x = x;
            var l:number = this.numChildren;
            for (var i:number = 0; i < l; i++) {
                var layer:DisplayObject = this.getChildAt(i);
                if (layer instanceof TMXLayer) {
                    if (layer.visible) {
                        for (var j:number = 0; j < (<TMXLayer>layer).numChildren; j++) {
                            var tile = (<TMXLayer>layer).getChildAt(j);
                            //格子只按地图尺寸进行计算，不考虑锚点、缩放等
                            if (tile.x + this.mapInfo.getTileWidth() < -this.x || tile.x > -this.x + this.viewPortWidth) {
                                tile.visible = false;
                            }
                            else {
                                tile.visible = true;
                            }
                        }
                    }
                }
                else {
                    var bounds:egret.Rectangle = layer.getBounds(Rectangle.identity);
                    if (layer.x + bounds.width - layer.anchorOffsetX < -this.x || layer.x - layer.anchorOffsetX > -this.x + this.viewPortWidth) {
                        layer.visible = false;
                    }
                    else {
                        layer.visible = true;
                    }
                }
            }
        }
    }
}