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
     * The BitmapFillMode class defines the image fill mode of Bitmap.
     * The BitmapFillMode class defines a pattern enumeration for adjusting size. These patterns determine how Bitmap fill the size designated by the layout system.
     * @see http://edn.egret.com/cn/docs/page/134 Texture filling way
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BitmapFillMode.ts
     * @language en_US
     */
    /**
     * BitmapFillMode 类定义Bitmap的图像填充方式。
     * BitmapFillMode 类定义了调整大小模式的一个枚举，这些模式确定 Bitmap 如何填充由布局系统指定的尺寸。
     * @see http://edn.egret.com/cn/docs/page/134 纹理的填充方式
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BitmapFillMode.ts
     * @language zh_CN
     */
    export const BitmapFillMode = {

        /**
         * Repeat the bitmap to fill area.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 重复位图以填充区域。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        REPEAT: "repeat",
        /**
         * Scale bitmap fill to fill area.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 位图填充拉伸以填充区域。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        SCALE: "scale",

        /**
         * The bitmap ends at the edge of the region.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在区域的边缘处截断不显示位图。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        CLIP: "clip"
    }
}