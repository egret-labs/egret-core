//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret {
    /**
     * @class egret.DropShadowFilter
     * @classdesc
     * 可使用 DropShadowFilter 类向显示对象添加投影。
     * @extends egret.GlowFilter
     * @version Egret 3.1.4
     * @platform Web,Native
     */
    export class DropShadowFilter extends GlowFilter {
        /**
         * Initializes a new DropShadowFilter instance.
         * @method egret.DropShadowFilter#constructor
         * @param distance {number} The offset distance of the bevel. Valid values are in pixels (floating point).
         * @param angle {number} The angle of the bevel. Valid values are from 0 to 360°.
         * @param color {number} The color of the glow. Valid values are in the hexadecimal format 0xRRGGBB. The default value is 0xFF0000.
         * @param alpha {number} The alpha transparency value for the color. Valid values are 0 to 1. For example, .25 sets a transparency value of 25%. The default value is 1.
         * @param blurX {number} The amount of horizontal blur. Valid values are 0 to 255 (floating point).
         * @param blurY {number} The amount of vertical blur. Valid values are 0 to 255 (floating point). 
         * @param strength {number} The strength of the imprint or spread. The higher the value, the more color is imprinted and the stronger the contrast between the glow and the background. Valid values are 0 to 255.
         * @param quality {number} The number of times to apply the filter.
         * @param inner {boolean} Specifies whether the glow is an inner glow. The value true indicates an inner glow. The default is false, an outer glow (a glow around the outer edges of the object).
         * @param knockout {number} Specifies whether the object has a knockout effect. A value of true makes the object's fill transparent and reveals the background color of the document. The default value is false (no knockout effect).
         * @param hideObject {number} Indicates whether or not the object is hidden. The value true indicates that the object itself is not drawn; only the shadow is visible. The default is false, meaning that the object is shown.
         * @version Egret 3.1.4
         * @platform Web
         * @language en_US
         */
        /**
         * 初始化 DropShadowFilter 对象
         * @method egret.DropShadowFilter#constructor
         * @param distance {number} 阴影的偏移距离，以像素为单位。
         * @param angle {number} 阴影的角度，0 到 360 度（浮点）。
         * @param color {number} 光晕颜色，采用十六进制格式 0xRRGGBB。默认值为 0xFF0000。
         * @param alpha {number} 颜色的 Alpha 透明度值。有效值为 0 到 1。例如，0.25 设置透明度值为 25%。
         * @param blurX {number} 水平模糊量。有效值为 0 到 255（浮点）。
         * @param blurY {number} 垂直模糊量。有效值为 0 到 255（浮点）。
         * @param strength {number} 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。
         * @param quality {number} 应用滤镜的次数。暂未实现。
         * @param inner {boolean} 指定发光是否为内侧发光。值 true 指定发光是内侧发光。值 false 指定发光是外侧发光（对象外缘周围的发光）。
         * @param knockout {number} 指定对象是否具有挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。
         * @param hideObject {number} 表示是否隐藏对象。如果值为 true，则表示没有绘制对象本身，只有阴影是可见的。默认值为 false（显示对象）。
         * @version Egret 3.1.4
         * @platform Web
         * @language zh_CN
         */
        constructor(distance:number = 4.0, angle:number = 45, color:number = 0, alpha:number = 1.0, blurX:number = 4.0, blurY:number = 4.0, strength:number = 1.0, quality:number = 1, inner:boolean = false, knockout:boolean = false, hideObject:boolean = false) {
            super(color, alpha, blurX, blurY, strength, quality, inner, knockout);
            let self = this;
            self.$distance = distance;
            self.$angle = angle;
            self.$hideObject = hideObject;

            self.$uniforms.dist = distance;
            self.$uniforms.angle = angle / 180 * Math.PI;
            self.$uniforms.hideObject = hideObject ? 1 : 0;
            self.onPropertyChange();
        }

        /**
         * @private
         */
        public $distance:number;

        /**
         * The offset distance of the bevel.
         * @version Egret 3.1.4
         * @platform Web
         * @language en_US
         */
        /**
         * 阴影的偏移距离，以像素为单位。
         * @version Egret 3.1.4
         * @platform Web
         * @language zh_CN
         */
        public get distance():number {
            return this.$distance;
        }

        public set distance(value:number) {
            let self = this;
            if(self.$distance == value) {
                return;
            }
            self.$distance = value;
            self.$uniforms.dist = value;
            self.onPropertyChange();
        }

        /**
         * @private
         */
        public $angle:number;

        /**
         * The angle of the bevel.
         * @version Egret 3.1.4
         * @platform Web
         * @language en_US
         */
        /**
         * 阴影的角度。
         * @version Egret 3.1.4
         * @platform Web
         * @language zh_CN
         */
        public get angle():number {
            return this.$angle;
        }

        public set angle(value:number) {
            let self = this;
            if(self.$angle == value) {
                return;
            }
            self.$angle = value;
            self.$uniforms.angle = value / 180 * Math.PI;
            self.onPropertyChange();
        }

        /**
         * @private
         */
        public $hideObject:boolean;

        /**
         * Indicates whether or not the object is hidden.
         * @version Egret 3.1.4
         * @platform Web
         * @language en_US
         */
        /**
         * 表示是否隐藏对象。
         * @version Egret 3.1.4
         * @platform Web
         * @language zh_CN
         */
        public get hideObject():boolean {
            return this.$hideObject;
        }

        public set hideObject(value:boolean) {
            if(this.$hideObject == value) {
                return;
            }
            this.$hideObject = value;
            this.$uniforms.hideObject = value ? 1 : 0;
        }

        /**
         * @private
         */
        public $toJson():string {
            return '{"distance": ' + this.$distance + ', "angle": ' + this.$angle + ', "color": ' + this.$color + ', "red": ' + this.$red + ', "green": ' + this.$green + ', "blue": ' + this.$blue + ', "alpha": ' + this.$alpha + ', "blurX": ' + this.$blurX + ', "blurY": ' + this.blurY + ', "strength": ' + this.$strength + ', "quality": ' + this.$quality + ', "inner": ' + this.$inner + ', "knockout": ' + this.$knockout + ', "hideObject": ' + this.$hideObject + '}';
        }

        protected updatePadding():void {
            let self = this;
            self.paddingLeft = self.blurX;
            self.paddingRight = self.blurX;
            self.paddingTop = self.blurY;
            self.paddingBottom = self.blurY;
            let distance: number = self.distance || 0;
            let angle: number = self.angle || 0;
            let distanceX = 0;
            let distanceY = 0;
            if (distance != 0) {
                distanceX = distance * egret.NumberUtils.cos(angle);
                if (distanceX > 0) {
                    distanceX = Math.ceil(distanceX);
                }
                else {
                    distanceX = Math.floor(distanceX);
                }
                distanceY = distance * egret.NumberUtils.sin(angle);
                if (distanceY > 0) {
                    distanceY = Math.ceil(distanceY);
                }
                else {
                    distanceY = Math.floor(distanceY);
                }
                self.paddingLeft += distanceX;
                self.paddingRight += distanceX;
                self.paddingTop += distanceY;
                self.paddingBottom += distanceY;
            }
        }
    }
}