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
     * @class egret.XML
     * @classdesc
     * XML文件解析工具，它将XML文件解析为标准的JSON对象返回。
     * 用法类似JSON.parse(),传入一个XML字符串给XML.parse()，将能得到一个标准JSON对象。
     * 示例：<root value="abc">
     *          <item value="item0"/>
     *          <item value="item1"/>
     *       </root>
     * 将解析为:
     * {"name":"root","$value":"abc","children":[{"name":"item","$value":"item0"},{"name":"item","$value":"item0"}]};
     *
     * 其中XML上的属性节点都使用$+"属性名"的方式表示,子节点都存放在children属性的列表里，name表示节点名称。
     */
    export class XML {
        /**
         * 解析一个XML字符串为JSON对象。
         * @method egret.XML.parse
         * @param value {string} 要解析的XML字符串。
         * @returns {any} XML对应的JSON对象。
         */
        public static parse(value:string):any{
            var xmlDoc = SAXParser.getInstance().parserXML(value);
            if(!xmlDoc||!xmlDoc.children){
                return null;
            }
            var root:any = xmlDoc.children[0];
            var xml:any = XML.parseNode(root);
            return xml;
        }

        private static parseNode(node:any):any{
            if(!node){
                return null;
            }
            var xml:any = {};
            xml.localName = node.localName;
            xml.name = node.nodeName;
            if(node.namespaceURI)
                xml.namespace = node.namespaceURI;
            if(node.prefix)
                xml.prefix = node.prefix;
            var attributes:any = node.attributes;
            var length:number = attributes.length;
            for(var i:number=0;i<length;i++){
                var attrib:any = attributes[i];
                var key:string = attrib.name;
                if (key.indexOf("xmlns:") == 0) {
                    continue;
                }
                xml["$"+key] = attrib.value;
            }
            var children:any = node.children;
            length = children.length;
            if(length==0){
                var text:string = node.textContent.trim();
                if(text){
                    xml.text = text;
                }
            }
            else{
                xml.children = [];
                for(i=0;i<length;i++){
                    var childNode:any = children[i];
                    var childXML:any = XML.parseNode(childNode);
                    if(childXML){
                        childXML.parent = xml;
                        xml.children.push(childXML);
                    }
                }
            }
            return xml;
        }
    }
}