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
	 * @class egret.HorizontalAlign
	 * @classdesc 水平对齐方式
	 * @link http://docs.egret-labs.org/post/manual/text/textlayout.html 文本布局
	 */
	export class HorizontalAlign{
        /**
         * 左对齐
		 * @constant egret.HorizontalAlign.LEFT
         */
        public static LEFT:string = "left";

        /**
         * 右对齐
		 * @constant egret.HorizontalAlign.RIGHT
         */
        public static RIGHT:string = "right";

        /**
         * 水平居中对齐
		 * @constant egret.HorizontalAlign.CENTER
         */
        public static CENTER:string = "center";

		/**
		 * 水平两端对齐
         * 注意：TextFiled不支持此对齐方式。
		 * @constant egret.HorizontalAlign.JUSTIFY
		 */
		public static JUSTIFY:string = "justify";

		/**
		 * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容宽度"。
		 * 容器的"内容宽度"是最大子项的大小,如果所有子项都小于容器的宽度，则会将所有子项的大小调整为容器的宽度。
         * 注意：TextFiled不支持此对齐方式。
		 * @constant egret.HorizontalAlign.CONTENT_JUSTIFY
		 */
		public static CONTENT_JUSTIFY:string = "contentJustify";
	}
}