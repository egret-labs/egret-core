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

module egret.web {

    /**
     * @private
     * XML节点基类
     */
    export class XMLNode {

        /**
         * @private
         */
        public constructor(nodeType:number, parent:XML) {
            this.nodeType = nodeType;
            this.parent = parent;
        }

        /**
         * @private
         * 节点类型，1：XML，2：XMLAttribute，3：XMLText
         */
        public nodeType:number;
        /**
         * @private
         * 节点所属的父级节点
         */
        public parent:XML;
    }

    /**
     * @private
     * XML节点对象
     */
    export class XML extends XMLNode {

        /**
         * @private
         */
        public constructor(localName:string, parent:XML, prefix:string, namespace:string, name:string) {
            super(1, parent);
            this.localName = localName;
            this.prefix = prefix;
            this.namespace = namespace;
            this.name = name;
        }

        /**
         * @private
         * 当前节点上的属性列表
         */
        public attributes:{[key:string]:string} = {};
        /**
         * @private
         * 当前节点的子节点列表
         */
        public children:XMLNode[] = [];
        /**
         * @private
         * 节点完整名称。例如节点 <s:Button/> 的 name 为：s:Button
         */
        public name:string;
        /**
         * @private
         * 节点的命名空间前缀。例如节点 <s:Button/> 的 prefix 为：s
         */
        public prefix:string;
        /**
         * @private
         * 节点的本地名称。例如节点 <s:Button/> 的 localName 为：Button
         */
        public localName:string;
        /**
         * @private
         * 节点的命名空间地址。例如节点 <s:Skin xmlns:s="http://ns.egret.com/eui"/> 的 namespace 为： http://ns.egret.com/eui
         */
        public namespace:string;
    }

    /**
     * @private
     * XML文本节点
     */
    export class XMLText extends XMLNode {
        /**
         * @private
         */
        public  constructor(text:string, parent:XML) {
            super(3, parent);
            this.text = text;
        }

        /**
         * @private
         * 文本内容
         */
        public text:string;
    }


    var parser = new DOMParser();

    /**
     * @private
     * 解析字符串为XML对象
     * @param text 要解析的字符串
     */
    function parse(text:string):XML {
        var xmlDoc = parser.parseFromString(text, "text/xml");
        var length = xmlDoc.childNodes.length;
        for (var i = 0; i < length; i++) {
            var node = xmlDoc.childNodes[i];
            if (node.nodeType == 1) {
                return parseNode(node, null);
            }
        }
        return null;
    }

    /**
     * @private
     * 解析一个节点
     */
    function parseNode(node:Node, parent:XML):XML {
        if(node.localName=="parsererror"){
            throw new Error(node.textContent);
        }
        var xml = new XML(node.localName, parent, node.prefix, node.namespaceURI, node.nodeName);
        var nodeAttributes = node.attributes;
        var attributes = xml.attributes;
        var length = nodeAttributes.length;
        for (var i = 0; i < length; i++) {
            var attributeNode = nodeAttributes[i];
            var name = attributeNode.name;
            if (name.indexOf("xmlns:") == 0) {
                continue;
            }
            attributes[name] = attributeNode.value;
            xml["$" + name] = attributeNode.value;
        }
        var childNodes = node.childNodes;
        length = childNodes.length;
        var children = xml.children;
        for (i = 0; i < length; i++) {
            var childNode = childNodes[i];
            var nodeType = childNode.nodeType;
            var childXML:any = null;
            if (nodeType == 1) {
                childXML = parseNode(childNode, xml);
            }
            else if (nodeType == 3) {
                var text = childNode.textContent.trim();
                if (text) {
                    childXML = new XMLText(text, xml);
                }
            }
            if (childXML) {
                children.push(childXML);
            }
        }
        return xml;
    }

    egret.XML = {parse: parse};
}