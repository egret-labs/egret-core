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

/// <reference path="SAXParser.ts"/>

module egret {
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
    }
}