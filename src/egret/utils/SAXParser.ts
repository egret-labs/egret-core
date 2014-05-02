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

/// <reference path="../core/Logger.ts"/>

module ns_egret{
    export class SAXParser {
        static _instance:SAXParser = null;

        static getInstance() {
            if (!SAXParser._instance) {
                SAXParser._instance = new SAXParser();
            }
            return SAXParser._instance;
        }

        private _parser = null;
        private _xmlDict = null;
        private _isSupportDOMParser = null;

        constructor() {
            this._xmlDict = {};
            if (window["DOMParser"]) {
                this._isSupportDOMParser = true;
                this._parser = new DOMParser();
            } else {
                this._isSupportDOMParser = false;
            }
        }

        /**
         *解析xml
         */
        public parse(textxml:string) {
            var path = textxml;
            textxml = this.getList(textxml);
            var xmlDoc = this.parserXML(textxml);
            var plist = xmlDoc.documentElement;
            if (plist.tagName != 'plist')
                ns_egret.Logger.fatal(path + "不是plist或者没有预加载plist");

            //获得第一个节点
            var node = null;
            for (var i = 0, len = plist.childNodes.length; i < len; i++) {
                node = plist.childNodes[i];
                if (node.nodeType == 1)
                    break
            }
            xmlDoc = null;
            return this.parseNode(node);
        }

        /**
         * 解析tilemap
         */
        public tmxParse(textxml:string, isXMLString:boolean = false) {
            if (!isXMLString) {
                textxml = this.getList(textxml);
            }
            return this.parserXML(textxml);
        }

        private parserXML(textxml:string) {
            var i = 0;
            while (textxml.charAt(i) == "\n" || textxml.charAt(i) == "\t" || textxml.charAt(i) == "\r" || textxml.charAt(i) == " ") {
                i++;
            }

            if (i != 0) {
                textxml = textxml.substring(i, textxml.length);
            }

            var xmlDoc;
            if (this._isSupportDOMParser) {
                xmlDoc = this._parser.parseFromString(textxml, "text/xml");
            } else {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(textxml);
            }

            if (xmlDoc == null) {
                ns_egret.Logger.info("xml not found!");
            }
            return xmlDoc;
        }

        private parseNode(node) {
            var data = null;
            switch (node.tagName) {
                case 'dict':
                    data = this.parseDict(node);
                    break;
                case 'array':
                    data = this.parseArray(node);
                    break;
                case 'string':
                    if (node.childNodes.length == 1)
                        data = node.firstChild.nodeValue;
                    else {
                        data = "";
                        for (var i = 0; i < node.childNodes.length; i++)
                            data += node.childNodes[i].nodeValue;
                    }
                    break;
                case 'false':
                    data = false;
                    break;
                case 'true':
                    data = true;
                    break;
                case 'real':
                    data = parseFloat(node.firstChild.nodeValue);
                    break;
                case 'integer':
                    data = parseInt(node.firstChild.nodeValue, 10);
                    break;
            }
            return data;
        }

        private parseArray(node) {
            var data = [];
            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                var child = node.childNodes[i];
                if (child.nodeType != 1)
                    continue;
                data.push(this.parseNode(child));
            }
            return data;
        }

        private parseDict(node) {
            var data = {};

            var key = null;
            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                var child = node.childNodes[i];
                if (child.nodeType != 1)
                    continue;

                if (child.tagName == 'key') {
                    key = child.firstChild.nodeValue;
                }
                else {
                    data[key] = this.parseNode(child);
                }
            }
            return data;
        }

        /**
         * 获取文件名
         */
        public getName(filePath:string) {
            var startPos = filePath.lastIndexOf("/", filePath.length) + 1;
            var endPos = filePath.lastIndexOf(".", filePath.length);
            return filePath.substring(startPos, endPos);
        }

        /**
         * 获取文件扩展名
         */
        public getExt(filePath:string) {
            var startPos = filePath.lastIndexOf(".", filePath.length) + 1;
            return filePath.substring(startPos, filePath.length);
        }

        public getList(key:string) {
            if (this._xmlDict != null) {
                return this._xmlDict[key];
            }
            return null;
        }
    }
}