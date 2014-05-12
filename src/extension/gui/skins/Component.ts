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

    export class Component{
        /**
         * 构造函数
         */
        public constructor(item:XML=null){
            if(item){
                this.id = <string><any> (item.@id);
                this.className = <string><any> (item.@p);
                if(item.hasOwnProperty("@s"))
                    this.superClass = <string><any> (item.@s);
                if(item.hasOwnProperty("@d"))
                    this.defaultProp = <string><any> (item.@d);
                if(item.hasOwnProperty("@array"))
                    this.isArray = <boolean><any> (item.@array=="true");
                if(item.hasOwnProperty("@state"))
                    this.states = (<string><any> (item.@state)).split(",");
            }
        }
        /**
         * 短名ID
         */
        public id:string;
        /**
         * 完整类名
         */
        public className:string;
        /**
         * 父级类名
         */
        public superClass:string = "";
        /**
         * 默认属性
         */
        public defaultProp:string = "";
        /**
         * 默认属性是否为数组类型
         */
        public isArray:boolean = false;
        /**
         * 视图状态列表
         */
        public states:Array<any>;
    }
}