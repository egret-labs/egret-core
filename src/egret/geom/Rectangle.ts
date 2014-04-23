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

module ns_egret {

    /**
     * 矩形类
     */
    export class Rectangle {

        constructor(x:number=0,y:number=0,width:number=0,height=0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        /**
         * 矩形x坐标
         */
        public x:number;
        /**
         * 矩形y坐标
         */
        public y:number;
        /**
         * 矩形宽度
         */
        public width:number;
        /**
         * 矩形高度
         */
        public height:number;
        /**
         * x和width的和
         */
        public get right():number{
            return this.x + this.width;
        }
        public set right(value:number){
            this.width = value - this.x;
        }
        /**
         * y和height的和
         */
        public get bottom():number{
            return this.y + this.height;
        }
        public set bottom(value:number){
            this.height = value - this.y;
        }
        /**
         * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
         * @param x
         * @param y
         * @param width
         * @param height
         * @returns {ns_egret.Rectangle}
         */
        initialize(x:number, y:number, width:number, height:number):Rectangle {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        }

        /**
         * 判断某坐标点是否存在于矩形内
         * @param x
         * @param y
         * @returns {boolean}
         */
        public contains(x:number, y:number):boolean {
            return this.x <= x &&
                this.x + this.width >= x &&
                this.y <= y &&
                this.y + this.height >= y;
        }

        /**
         * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
         * @param toIntersect 要与此 Rectangle 对象比较的 Rectangle 对象。
         */
        public intersects(toIntersect:Rectangle):boolean{
            if(this.contains(toIntersect.x,toIntersect.y))
                return true;
            if(this.contains(toIntersect.x,toIntersect.bottom))
                return true;
            if(this.contains(toIntersect.right,toIntersect.y))
                return true;
            if(this.contains(toIntersect.right,toIntersect.bottom))
                return true;
            return false;
        }

        /**
         * 克隆矩形对象
         * @returns {ns_egret.Rectangle}
         * @stable C 倾向于废除此API，方式开发者滥用，降低游戏性能
         */
        public clone() {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }

        /**
         * 引擎内部用于函数传递返回值的全局矩形对象，开发者请勿随意修改此对象
         */
        public static identity = new Rectangle(0, 0, 0, 0);

    }
}