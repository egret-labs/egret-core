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

module egret {

    /**
     * @class egret.Scroller
     * @classdesc
     * egret.Scroller已废弃，请使用egret.ScrollView
     * @extends egret.DisplayObject
     */
    export class Scroller extends ScrollView {
        
        /**
         * egret.Scroller已废弃，请使用egret.ScrollView
		 * @method egret.Scroller#constructor
         * @param content {egret.DisplayObject} 需要滚动的对象
         * @param width {number} Scroller的宽度，默认值为content的宽度
         * @param height {number} Scroller的高度，默认值为content的高度
         */
        constructor(public content: DisplayObject, width= NaN, height= NaN) {
            super(content);
            this.width = width == NaN ? this._getContentWidth() : width;
            this.height = height == NaN ? this._getContentHeight() : height;
            Logger.warning("egret.Scroller已废弃，请使用egret.ScrollView");
        }
        
        /**
         * 是否启用水平滚动
         * @member {boolean} egret.Scroller#scrollXEnabled
         * @returns {boolean}
         */
        public get scrollXEnabled() {
            return this.horizontalScrollPolicy != "off";
        }
        public set scrollXEnabled(value: boolean) {
            Logger.warning("egret.Scroller已废弃，请使用egret.ScrollView");
            this.horizontalScrollPolicy = value ? "auto" : "off";
        }
        
        /**
         * 是否启用垂直滚动
         * @member {boolean} egret.Scroller#scrollYEnabled
         * @returns {boolean}
         */
        public get scrollYEnabled() {
            return this.verticalScrollPolicy != "off";
        }
        public set scrollYEnabled(value: boolean) {
            Logger.warning("egret.Scroller已废弃，请使用egret.ScrollView");
            this.verticalScrollPolicy = value ? "auto" : "off";
        }
    }
} 