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
     * @class egret.Logger
     * @classdesc
     * Logger是引擎的日志处理模块入口
     * @stable B 目前Logger的接口设计没有问题，但是考虑到跨平台，需要将其改为一个Context，并且允许开发者自由扩展以实现自身游戏的日志分析收集需求
     * todo:GitHub文档，如何利用日志帮助游戏持续改进
     */
    export class Logger {
        /**
         * 表示出现了致命错误，开发者必须修复错误
         * @method egret.Logger.fatal
         * @param actionCode {string} 错误信息
         * @param value {Object} 错误描述信息
         */
        private static fatal(actionCode:string, value:Object = null) {
            egret.Logger.traceToConsole("Fatal", actionCode, value);
            throw new Error(egret.Logger.getTraceCode("Fatal", actionCode, value));
        }

        /**
         * 记录正常的Log信息
         * @method egret.Logger.info
         * @param actionCode {string} 错误信息
         * @param value {Object} 错误描述信息
         */
        public static info(actionCode:string, value:Object = null) {
            egret.Logger.traceToConsole("Info", actionCode, value);
        }

        /**
         * 记录可能会出现问题的Log信息
         * @method egret.Logger.warning
         * @param actionCode {string} 错误信息
         * @param value {Object} 错误描述信息
         */
        private static warning(actionCode:string, value:Object = null) {
            egret.Logger.traceToConsole("Warning", actionCode, value);
        }

        public static fatalWithErrorId(errorId:number, ...args) {
            args.unshift(errorId);
            var actionCode = getString.apply(null, args);
            if (actionCode) {
                Logger.fatal(actionCode);
            }
            else {
                Logger.warning(getString(-1, errorId));
            }
        }

        public static infoWithErrorId(errorId:number, ...args) {
            args.unshift(errorId);
            var actionCode = getString.apply(null, args);
            if (actionCode) {
                Logger.info(actionCode);
            }
            else {
                Logger.warning(getString(-1, errorId));
            }
        }

        public static warningWithErrorId(errorId:number, ...args) {
            args.unshift(errorId);
            var actionCode = getString.apply(null, args);
            if (actionCode) {
                Logger.warning(actionCode);
            }
            else {
                Logger.warning(getString(-1, errorId));
            }
        }

        /**
         * @private
         * @param type
         * @param actionCode
         * @param value
         */
        private static traceToConsole(type:string, actionCode:string, value:Object) {
            console.log(egret.Logger.getTraceCode(type, actionCode, value));
        }

        /**
         * @private
         * @param type
         * @param actionCode
         * @param value
         * @returns {string}
         */
        private static getTraceCode(type:string, actionCode:string, value:Object) {
            return "[" + type + "]" + actionCode + (value == null ? "" : ":" + value);
        }
    }

    export var egret_string_code = {};
    egret_string_code[-1] = "不存在的stringId:{0}";
    egret_string_code[1000] = "Browser.isMobile接口参数已经变更，请尽快调整用法为 egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE";
    egret_string_code[1001] = "该方法目前不应传入 resolutionPolicy 参数，请在 docs/1.0_Final_ReleaseNote中查看如何升级";
    egret_string_code[1002] = "egret.Ticker是框架内部使用的单例，不允许在外部实例化，计时器请使用egret.Timer类！";
    egret_string_code[1003] = "Ticker#setTimeout方法即将废弃,请使用egret.setTimeout";
    egret_string_code[1004] = "ExternalInterface调用了js没有注册的方法: {0}";
    egret_string_code[1005] = "设置了已经存在的blendMode: {0}";
    egret_string_code[1006] = "child不在当前容器内";
    egret_string_code[1007] = "提供的索引超出范围";
    egret_string_code[1008] = "child未被addChild到该parent";
    egret_string_code[1009] = "设置了已经存在的适配模式:{0}";
    egret_string_code[1010] = "addEventListener侦听函数不能为空";
    egret_string_code[1011] = "BitmapText找不到文字所对应的纹理:\"{0}\"";
    egret_string_code[1012] = "egret.BitmapTextSpriteSheet已废弃，请使用egret.BitmapFont代替。";
    egret_string_code[1013] = "TextField.setFocus 没有实现";
    egret_string_code[1014] = "Ease不能被实例化";
    egret_string_code[1015] = "xml not found!";
    egret_string_code[1016] = "{0}已经废弃";
    egret_string_code[1017] = "JSON文件格式不正确: {0}\ndata: {1}";
    egret_string_code[1018] = "egret_html5_localStorage.setItem保存失败,key={0}&value={1}";
    egret_string_code[1019] = "网络异常:{0}";
    egret_string_code[1020] = "无法初始化着色器";
    egret_string_code[1021] = "当前浏览器不支持webgl";
    egret_string_code[1022] = "{0} ArgumentError";
    egret_string_code[1023] = "此方法在ScrollView内不可用!";
    egret_string_code[1024] = "使用了尚未实现的ScaleMode";
    egret_string_code[1025] = "遇到文件尾";
    egret_string_code[1026] = "EncodingError! The code point {0} could not be encoded.";
    egret_string_code[1027] = "DecodingError";
    egret_string_code[1028] = "调用了未配置的注入规则:{0}。 请先在项目初始化里配置指定的注入规则，再调用对应单例。";
    egret_string_code[1029] = "Function.prototype.bind - what is trying to be bound is not callable";
    egret_string_code[1030] = "该API已废弃";

    egret_string_code[2000] = "RES.createGroup()传入了配置中不存在的键值: {0}";
    egret_string_code[2001] = "RES加载了不存在或空的资源组:\"{0}\"";

    egret_string_code[3000] = "主题配置文件加载失败: {0}";
    egret_string_code[3001] = "找不到主题中所配置的皮肤类名: {0}";
    egret_string_code[3002] = "索引:\"{0}\"超出集合元素索引范围";
    egret_string_code[3003] = "在此组件中不可用，若此组件为容器类，请使用";
    egret_string_code[3004] = "addChild(){0}addElement()代替";
    egret_string_code[3005] = "addChildAt(){0}addElementAt()代替";
    egret_string_code[3006] = "removeChild(){0}removeElement()代替";
    egret_string_code[3007] = "removeChildAt(){0}removeElementAt()代替";
    egret_string_code[3008] = "setChildIndex(){0}setElementIndex()代替";
    egret_string_code[3009] = "swapChildren(){0}swapElements()代替";
    egret_string_code[3010] = "swapChildrenAt(){0}swapElementsAt()代替";
    egret_string_code[3011] = "索引:\"{0}\"超出可视元素索引范围";
    egret_string_code[3012] = "此方法在Scroller组件内不可用!";
    egret_string_code[3013] = "UIStage是GUI根容器，只能有一个此实例在显示列表中！";

    egret_string_code[4000] = "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)";
    egret_string_code[4001] = "Abstract class can not be instantiated!";
    egret_string_code[4002] = "Unnamed data!";
    egret_string_code[4003] = "Nonsupport version!";

    egret_string_code[3100] = "当前浏览器不支持WebSocket";
    egret_string_code[3101] = "请先连接WebSocket";
    egret_string_code[3102] = "请先设置type为二进制类型";

    export function getString(id:number, ...args):string {
        var message = egret_string_code[id];
        if (message) {
            var length = args.length;
            for (var i = 0; i < length; i++) {
                message = message.replace("{" + i + "}", args[i]);
            }
        }
        return message;
    }
}