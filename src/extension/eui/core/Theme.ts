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

namespace eui {


    interface ThemeData {
        /**
         * The skins list.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 皮肤列表
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        skins: { [component: string]: string };
        /**
         * An array of exmls data.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * exml数据的数组，数据可以是字符串或者实现EXMLFile接口的对象
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        exmls?: Array<string | EXMLFile>;
    }

    interface EXMLFile {
        /**
         * EXML file path.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * EXML文件的路径
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        path: string;
        /**
         * EXML file content.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * EXML文件的内容
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        content?: string;
        /**
         * EXML file content.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 生成的js文本内容
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        gjs?: string;
        /**
         * EXML file content.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 类名
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        className?: string;
    }

    /**
     * Note: The skin name values in the skin theme are used as default values,which can not be changed while running.
     * You can change the skin of a component with the skinName property.
     * @event egret.Event.COMPLETE Dispatch when EXML used in this theme is loaded and parsed.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/core/ThemeExample.ts
     * @language en_US
     */
    /**
     * 皮肤主题。注意：皮肤主题是一次性设置的默认值,并不能运行时切换所有组件默认皮肤。切换单个皮肤您可以自行对Component.skinName赋值来修改。
     * @event egret.Event.COMPLETE 当主题关联的EXML加载解析完成时派发
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/core/ThemeExample.ts
     * @language zh_CN
     */
    export class Theme extends egret.EventDispatcher {

        private $configURL: string;

        /**
         * Create an instance of Theme
         * @param configURL the external theme path. if null, you need to register the default skin name with
         * mapSkin() manually.
         * @param stage current stage.
         * If null, you need to register with egret.registerImplementation("eui.Theme",theme)
         * manually.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个主题实例
         * @param configURL 要加载并解析的外部主题配置文件路径。若传入 null，将不进行配置文件加载，
         * 之后需要在外部以代码方式手动调用 mapSkin() 方法完成每条默认皮肤名的注册。
         * @param stage 当前舞台引用。
         * 若传入null，需要在外部手动调用 egret.registerImplementation("eui.Theme",theme) 来完成主题的注册。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor(configURL: string, stage?: egret.Stage) {
            super();
            this.initialized = !configURL;
            if (stage) {
                egret.registerImplementation("eui.Theme", this);
            }
            this.$configURL = configURL;
            this.load(configURL);
        }

        /**
         * @private
         */
        private initialized: boolean;

        /**
         * @private
         *
         * @param url
         */
        private load(url: string): void {
            eui.getTheme(url, data => this.onConfigLoaded(data))
        }

        /**
         * @private
         *
         * @param str
         */
        private onConfigLoaded(str: string | any): void {
            let data: any;
            if (typeof str == "string") {
                try {
                    data = JSON.parse(str);
                }
                catch (e) {
                    egret.$error(3000);
                }
            }
            else {
                data = str;
            }
            if (data && data.skins) {
                let skinMap = this.skinMap
                let skins = data.skins;
                let keys = Object.keys(skins);
                let length = keys.length;
                for (let i = 0; i < length; i++) {
                    let key = keys[i];
                    if (!skinMap[key]) {
                        this.mapSkin(key, skins[key]);
                    }
                }
            }

            if (data.styles) {
                this.$styles = data.styles;
            }
            let paths = data.paths;
            for (let path in paths) {
                EXML.update(path, paths[path])
            }

            //commonjs|commonjs2
            if (!data.exmls || data.exmls.length == 0) {
                this.onLoaded();
            }
            //gjs
            else if (data.exmls[0]['gjs']) {
                data.exmls.forEach((exml) => EXML.$parseURLContentAsJs((<EXMLFile>exml).path, (<EXMLFile>exml).gjs, (<EXMLFile>exml).className));
                this.onLoaded();
            }
            // In release version, exml content is packaged in the theme file
            else if (data.exmls[0]['content']) {
                data.exmls.forEach((exml) => EXML.$parseURLContent((<EXMLFile>exml).path, (<EXMLFile>exml).content));
                this.onLoaded();
            }
            else {
                EXML.$loadAll(<string[]>data.exmls, this.onLoaded, this, true);
            }

        }

        private onLoaded(classes?: any[], urls?: string[]) {
            this.initialized = true;
            this.handleDelayList();
            this.dispatchEventWith(egret.Event.COMPLETE);
        }

        /**
         * @private
         */
        private delayList: Component[] = [];

        /**
         * @private
         *
         */
        private handleDelayList(): void {
            let list = this.delayList;
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let client = list[i];
                if (!client.$Component[sys.ComponentKeys.skinNameExplicitlySet]) {
                    let skinName = this.getSkinName(client);
                    if (skinName) {
                        client.$Component[sys.ComponentKeys.skinName] = skinName;
                        client.$parseSkinName();
                    }
                }
            }
            list.length = 0;
        }

        /**
         * @private
         */
        private skinMap: { [key: string]: string } = {};


        /**
         * According to the host component to get the default skin name.
         * Search rules are as follows:
         * <li>1. Use the <code>hostComponentKey</code> of client to search.</li>
         * <li>2. Use the class name of client to search.</li>
         * <li>3. Use the parent class name of client to search.</li>
         * <li>4. Repeat step 3 until find the skin name or the parent is <code>eui.Component</code>.</li>
         * @param client the component need to get the default skin.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 根据主机组件，获取对应的默认皮肤名。查询规则如下：
         * <li>1.使用client的hostComponentKey作为键查询默认皮肤名。</li>
         * <li>2.使用client的类名作为键查询默认皮肤名。</li>
         * <li>3.使用client的父类名作为键查询默认皮肤名。</li>
         * <li>4.不断重复3直到查询到皮肤名或父类为eui.Component时停止。</li>
         * @param client 要获取默认皮肤的组件。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public getSkinName(client: Component): string {
            if (!this.initialized) {
                if (this.delayList.indexOf(client) == -1) {
                    this.delayList.push(client);
                }
                return "";
            }
            let skinMap = this.skinMap;
            let skinName: string = skinMap[client.hostComponentKey];
            if (!skinName) {
                skinName = this.findSkinName(client);
            }
            return skinName;
        }

        /**
         * @private
         */
        private findSkinName(prototype: any): string {
            if (!prototype) {
                return "";
            }
            let key = prototype["__class__"];
            if (key === void 0) {
                return "";
            }
            let skinName = this.skinMap[key];
            if (skinName || key == "eui.Component") {
                return skinName;
            }
            return this.findSkinName(Object.getPrototypeOf(prototype));
        }

        /**
         * Map a default skin for the specified host component.
         * @param hostComponentKey the name of host component, such as "eui.Button".
         * @param skinName the name of skin, such as "app.MyButtonSkin".
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 为指定的主机组件映射一个默认皮肤。
         * @param hostComponentKey 主机组件名称，例如：“eui.Button”。
         * @param skinName 皮肤名称 例如："app.MyButtonSkin"。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        public mapSkin(hostComponentKey: string, skinName: string): void {
            if (DEBUG) {
                if (!hostComponentKey) {
                    egret.$error(1003, "hostComponentKey");
                }
                if (!skinName) {
                    egret.$error(1003, "skinName");
                }
            }
            this.skinMap[hostComponentKey] = skinName;
        }

        /**
         * @private
         * styles 配置信息
         */
        private $styles: any = {};

        public $getStyleConfig(style: string): any {
            return this.$styles[style];
        }
    }
}