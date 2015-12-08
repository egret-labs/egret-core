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
     * 圆形
     */
    export class Circle implements ShapeData {

        public constructor(x:number, y:number, radius:number) {
            super();
            this.type = ShapeType.Circle;
            this.x = x;
            this.y = y;
            this.radius = radius;
        }

        /**
         * 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         */
        public x;

        /**
         * 圆心相对于父显示对象注册点的 y 位置（以像素为单位）。
         */
        public y;

        /**
         * 圆的半径（以像素为单位）。
         */
        public radius;

        /**
         * 图形是否包含指定的坐标点
         */
        public contains(x:number, y:number):boolean {
            var radius = this.radius;
            if (radius <= 0) {
                return false;
            }

            var dx = this.x - x;
            var dy = this.y - y;
            var r2 = radius * radius;
            dx *= dx;
            dy *= dy;
            return (dx + dy <= r2);
        }
    }
}