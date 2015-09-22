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

module egret {
    /**
     * @language en_US
     * Logger is an entrance for the log processing module of the engine
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Logger是引擎的日志处理模块入口
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class Logger {

        /**
         * @language en_US
         * open all
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 全开
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ALL:string = "all";

        /**
         * @language en_US
         * level: DEBUG
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 DEBUG
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static DEBUG:string = "debug";

        /**
         * @language en_US
         * level: INFO
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 INFO
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static INFO:string = "info";

        /**
         * @language en_US
         * level: WARN
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 WARN
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static WARN:string = "warn";

        /**
         * @language en_US
         * level: ERROR
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 ERROR
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static ERROR:string = "error";

        /**
         * @language en_US
         * close all
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 全关
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static OFF:string = "off";

        /**
         * @language en_US
         * Set the current need to open the log level. Grade level are: ALL <DEBUG <INFO <WARN <ERROR <OFF<br/>
         * This feature is only in DEBUG mode to take effect. <br/>
         * <Ul>
         * <Li> Logger.ALL - all levels of log can be printed out. </ li>
         * <Li> Logger.DEBUG - print debug, info, log, warn, error. </ li>
         * <Li> Logger.INFO - print info, log, warn, error. </ li>
         * <Li> Logger.WARN - can print warn, error. </ li>
         * <Li> Logger.ERROR - You can print error. </ li>
         * <Li> Logger.OFF - all closed. </ li>
         * </ Ul>
         *param LogType from this level to start printing.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置当前需要开启的log级别。级别等级分别为：ALL < DEBUG < INFO < WARN < ERROR < OFF<br/>
         * 此功能只在 DEBUG 模式下才生效。<br/>
         * <ul>
         * <li>Logger.ALL -- 所有等级的log都可以打印出来。</li>
         * <li>Logger.DEBUG -- 可以打印debug、info、log、warn、error。</li>
         * <li>Logger.INFO -- 可以打印info、log、warn、error。</li>
         * <li>Logger.WARN -- 可以打印warn、error。</li>
         * <li>Logger.ERROR -- 可以打印error。</li>
         * <li>Logger.OFF -- 全部关闭。</li>
         * </ul>
         * @param logType 从这个等级开始打印。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static set logLevel(logType:string) {
        }
    }
}