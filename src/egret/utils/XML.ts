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

/**
 <root>
 <egret>
 <item>123</item>
 <item name="yjtx"/>
 </egret>
 </root>

 上面的 字符串 最后解析成 xml文件后，
 获取 item数组           xml.egret[0].item;               egret[0] 必须加 [0]
 获取 第一个item的123     xml.egret[0].item[0].value;      egret[0] 必须加 [0]
 获取 第二个item的yjtx    xml.egret[0].item[1].$name;      egret[0] 必须加 [0]
 *
 */

/// <reference path="../texture/TextureCache.ts"/>
/// <reference path="SAXParser.ts"/>

module ns_egret {
    export class XML {
        private _xmlStr = "";

        /**
         * 必须是 xml格式的字符串
         * @param xmlStr  xml格式的字符串
         */
        public constructor() {
        }

        /**
         * 解析 xml文件
         * @param xmlDoc
         * @private
         */
        public _ansXML(xmlDoc) {
            var num = 0;
            if (xmlDoc.childNodes && xmlDoc.childNodes.length > 0) {
                for (var i = 0; i < xmlDoc.childNodes.length; i++) {
                    var childXMLDoc = xmlDoc.childNodes[i];
                    if (childXMLDoc.nodeType == 1) {
                        var xml = new XML();
                        xml._ansXML(childXMLDoc);

                        var name = childXMLDoc.nodeName;
                        if (this[name] == null) {
                            this[name] = [];
                        }
                        this[name].push(xml);

                        num++;
                    }
                }
            }

            if (num == 0) {
                this["value"] = xmlDoc.textContent;
            }

            if (xmlDoc.attributes && xmlDoc.attributes.length > 0) {//拥有 属性
                for (var j = 0; j < xmlDoc.attributes.length; j++) {
                    var attr = xmlDoc.attributes[j];
                    this["$" + attr.id] = attr.value;//todo:
                    this["$" + attr.name] = attr.value;//todo:
                }
            }
        }


        public static create(url):XML {
            var xml:XML = new XML();
            var xmldoc:any;
            if (ns_egret.SAXParser) {
                var content = ns_egret.TextureCache.getInstance().getTextData(url);
                xmldoc = ns_egret.SAXParser.getInstance().tmxParse(content, true).documentElement;
            }
            else {
                xmldoc = egret_native.EGTXML.readXML(url);
            }
            xml._ansXML(xmldoc);
            return xml;
        }
    }
}