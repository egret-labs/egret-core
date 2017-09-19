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

namespace egret.sys {
    /**
     * @private
     * 线条路径。
     * 注意：当线条宽度（lineWidth）为1或3像素时，需要特殊处理，往右下角偏移0.5像素，以显示清晰锐利的线条。
     */
    export class StrokePath extends Path2D {

        public constructor() {
            super();
            this.type = PathType.Stroke;
        }

        /**
         * 线条宽度。
         * 注意：绘制时对1像素和3像素要特殊处理，整体向右下角偏移0.5像素，以显示清晰锐利的线条。
         */
        public lineWidth: number;
        /**
         * 线条颜色
         */
        public lineColor: number;
        /**
         * 线条透明度
         */
        public lineAlpha: number;
        /**
         * 端点样式,"none":无端点,"round":圆头端点,"square":方头端点
         */
        public caps: string;
        /**
         * 联接点样式,"bevel":斜角连接,"miter":尖角连接,"round":圆角连接
         */
        public joints: string;
        /**
         * 用于表示剪切斜接的极限值的数字。
         */
        public miterLimit: number;

        public setLineDash(segments: number[]): void {
            this.$commands[this.commandPosition++] = PathCommand.SetLineDash;
            let pos = this.dataPosition;
            this.$data[pos++] = segments;
            this.dataPosition = pos;
        }
    }
}