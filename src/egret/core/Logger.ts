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
     * Logger是引擎的日志处理模块入口
     * @stable B 目前Logger的接口设计没有问题，但是考虑到跨平台，需要将其改为一个Context，并且允许开发者自由扩展以实现自身游戏的日志分析收集需求
     * todo:GitHub文档，如何利用日志帮助游戏持续改进
     */
    export class Logger {
        /**
         * 表示出现了致命错误，开发者必须修复错误
         * @param actionCode
         * @param value
         */
        public static fatal(actionCode:string, value:Object = null){
            ns_egret.Logger.traceToConsole("Fatal",actionCode,value);
            throw new Error(ns_egret.Logger.getTraceCode("Fatal", actionCode, value));
        }

        /**
         * 记录正常的Log信息
         * @param actionCode
         * @param value
         */
        public static info(actionCode:string, value:Object = null){
            ns_egret.Logger.traceToConsole("Info",actionCode,value);
        }

        /**
         * 记录可能会出现问题的Log信息
         * @param actionCode
         * @param value
         */
        public static warning(actionCode:string, value:Object = null){
            ns_egret.Logger.traceToConsole("Warning",actionCode,value);
        }

        /**
         * @private
         * @param type
         * @param actionCode
         * @param value
         */
        private static traceToConsole(type:String,actionCode:String,value:Object){
            console.log(ns_egret.Logger.getTraceCode(type, actionCode, value));
        }

        /**
         * @private
         * @param type
         * @param actionCode
         * @param value
         * @returns {string}
         */
        private static getTraceCode(type:String,actionCode:String,value:Object){
            return "[" + type + "]" + actionCode + ":" + (value == null ? "" : value);
        }
    }
}