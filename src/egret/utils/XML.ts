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

/// <reference path="../core/HashObject.ts"/>
/// <reference path="SAXParser.ts"/>

module ns_egret{
    export class XML extends HashObject{
        private _xmlStr = "";

        /**
         * @class ns_egret.XML
         * @classdesc XML类模拟了ActionScript3.0的E4X的部分语法特性，封装了对XML对象的操作
         *
         * @example
         * <xmp>
         *  <root>
         *    <egret>
         *      <item>123</item>
         *      <item name="yjtx"/>
         *    </egret>
         *  </root>
         *  </xmp>
         * xml.egret[0].item;    // [ XML,XML ]
         * xml.egret[0].item[0].value;  // 123
         * xml.egret[0].item[1].$name;  // yjtx
         * @param xmlStr  {string} xml格式的字符串
         */
        public constructor(xmlStr:string = "") {
            super();
            this._xmlStr = xmlStr;
            if (xmlStr != "") {
                var xmlDoc = ns_egret.SAXParser.getInstance().tmxParse(xmlStr, true);
                if (xmlDoc == null) {

                }
                this._ansXML(xmlDoc.documentElement);
            }
        }

        /**
         * 解析 xml文件
         * @param xmlDoc
         * @private
         */
        public _ansXML(xmlDoc) {
            if (xmlDoc.childElementCount > 0) {//拥有子 节点
                for (var i = 0; i < xmlDoc.childElementCount; i++) {
                    var childXMLDoc = xmlDoc.children[i];

                    var xml = new XML("");
                    xml._ansXML(childXMLDoc);

                    var name = childXMLDoc.nodeName;
                    if (this[name] == null) {
                        this[name] = [];
                    }
                    this[name].push(xml);
                }
            }
            else {
                this["value"] = xmlDoc.textContent;
            }

            if (xmlDoc.attributes.length > 0) {//拥有 属性
                for (var j = 0; j < xmlDoc.attributes.length; j++) {
                    var attr = xmlDoc.attributes[j];
                    this["$" + attr.name] = attr.value;
                }
            }
        }
    }
}