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

/// <reference path="HashObject.ts"/>
/// <reference path="Logger.ts"/>

module ns_egret{
    export class SAXParser extends HashObject{
        static _instance:SAXParser = null;

        static getInstance() {
            if (!SAXParser._instance) {
                SAXParser._instance = new SAXParser();
            }
            return SAXParser._instance;
        }

        private _parser:any = null;
        private _xmlDict:any = null;
        private _isSupportDOMParser:any = null;

        public constructor() {
            super();
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
            var data:any = null;
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