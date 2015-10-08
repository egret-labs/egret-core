//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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
module egret {

    /**
     * @language en_US
     * The VerticalAlign class defines the possible values for the vertical alignment.
     * @see egret.TextField#verticalAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * VerticalAlign 类为垂直对齐方式定义可能的值。
     * @see egret.TextField#verticalAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class VerticalAlign{

        /**
         * @language en_US
         * Vertically align content to the top of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的顶部对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static TOP:string = "top";

        /**
         * @language en_US
         * Vertically align content to the bottom of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的底部对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static BOTTOM:string = "bottom";

        /**
         * @language en_US
         * Vertically align content in the middle of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在容器的垂直中心对齐内容。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static MIDDLE:string = "middle";

        /**
         * @language en_US
         * Vertical alignment with both edges
         * Note: TextFiled does not support this alignment method."
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 垂直两端对齐
         * 注意：TextFiled不支持此对齐方式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static JUSTIFY:string = "justify";

        /**
         * @language en_US
         * Align the content of the child items, relative to the container. This operation will adjust uniformly the size of all the child items to be the Content Height \" of the container \".
         * The Content Height \" of the container \" is the size of the max. child item. If the size of all child items are less than the height of the container, they will be adjusted to the height of the container.
         * Note: TextFiled does not support this alignment method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容高度"。
         * 容器的"内容高度"是最大子项的大小,如果所有子项都小于容器的高度，则会将所有子项的大小调整为容器的高度。
         * 注意：TextFiled不支持此对齐方式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static CONTENT_JUSTIFY:string = "contentJustify";
    }
}