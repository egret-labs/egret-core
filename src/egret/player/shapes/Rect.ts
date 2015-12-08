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

module egret.sys {

    /**
     * @private
     * 矩形
     */
    export class Rect implements ShapeData {
        /**
         * 构造函数
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         */
        public constructor(x:number, y:number, width:number, height:number) {
            super();
            this.type = ShpaeType.Rect;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        /**
         * 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         */
        public x;

        /**
         * 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         */
        public y;

        /**
         * 矩形的宽度（以像素为单位）。
         */
        public width;

        /**
         * 矩形的高度（以像素为单位）。
         */
        public height;

        /**
         * 图形是否包含指定的坐标点
         */
        public contains(x:number, y:number):boolean {
            if (this.width <= 0 || this.height <= 0) {
                return false;
            }

            if (x >= this.x && x < this.x + this.width) {
                if (y >= this.y && y < this.y + this.height) {
                    return true;
                }
            }

            return false;
        }

    }


}