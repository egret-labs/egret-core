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
     * @classdesc
     * StageScaleMode 类为 Stage.scaleMode 属性提供值。
     * @class egret.StageScaleMode
     */
    export class StageScaleMode {

        /**
         * 指定整个应用程序填满指定区域，不会发生扭曲，但有可能会进行一些裁切，同时保持应用程序的原始高宽比。
         * @member {string} egret.StageScaleMode.NO_BORDER
         */
        public static NO_BORDER:string = "noBorder";

        /**
         * 指定应用程序的大小是固定的，因此，即使在更改播放器窗口大小时，它仍然保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
         * @member {string} egret.StageScaleMode.NO_SCALE
         */
        public static NO_SCALE:string = "noScale";

        /**
         * 指定整个应用程序在指定区域中可见，且不会发生扭曲，同时保持应用程序的原始高宽比。应用程序的两侧可能会显示边框。
         * @member {string} egret.StageScaleMode.SHOW_ALL
         */
        public static SHOW_ALL:string = "showAll";

        /**
         * 指定整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲。
         * @member {string} egret.StageScaleMode.EXACT_FIT
         */
        public static EXACT_FIT:string = "exactFit";
    }
}