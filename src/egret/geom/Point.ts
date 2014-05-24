/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../utils/HashObject.ts"/>

module ns_egret {

    /**
     * @class ns_egret.Point
     * @classdesc
     * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
     * @extends ns_egret.HashObject
     */
    export class Point extends HashObject {

        static identity = new Point(0, 0);

        /**
         * @method ns_egret.Point#constructor
         * @param x {number}
         * @param y {number}
         */
        public constructor(x:number = 0, y:number = 0) {
            super();
            this.x = x;
            this.y = y;
        }

        /**
         * 该点的水平坐标。默认值为 0。
         * @constant ns_egret.Point#x
         */
        public x:number;
        /**
         * 该点的垂直坐标。默认值为 0。
         * @constant ns_egret.Point#y
         */
        public y:number;

        /**
         * 克隆点对象
         * @method ns_egret.Point#clone
         * @returns {Point}
         */
        public clone():Point {
            return new Point(this.x, this.y);
        }
    }
}