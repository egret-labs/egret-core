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


module egret {
    /**
     * @language zh_CN
     * StageAlign 类为舞台對齊模式提供值。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/player/StageAlign.ts
     */
    export class StageAlign {
        /**
         * @language zh_CN
         * 指定「舞台」與底部對齊。<br/>
         */
        public static BOTTOM:string = "bottom";
        /**
         * @language zh_CN
         * 指定「舞台」與左下角對齊。<br/>
         */
        public static BOTTOM_LEFT:string = "bottomLeft";
        /**
         * @language zh_CN
         * 指定「舞台」與右下角對齊。<br/>
         */
        public static BOTTOM_RIGHT:string = "bottomRight";
        /**
         * @language zh_CN
         * 指定「舞台」與中間對齊。<br/>
         */
        public static CENTER:string = "center";
        /**
         * @language zh_CN
         * 指定「舞台」與左側對齊。<br/>
         */
        public static LEFT:string = "left";
        /**
         * @language zh_CN
         * 指定「舞台」與右側對齊。<br/>
         */
        public static RIGHT:string = "right";
        /**
         * @language zh_CN
         * 指定「舞台」與頂端對齊。<br/>
         */
        public static TOP:string = "top";
        /**
         * @language zh_CN
         * 指定「舞台」與左上角對齊。<br/>
         */
        public static TOP_LEFT:string = "topLeft";
        /**
         * @language zh_CN
         * 指定「舞台」與右上角對齊。<br/>
         */
        public static TOP_RIGHT:string = "topRight";
    }
}