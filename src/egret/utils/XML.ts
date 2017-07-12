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

namespace egret {
    /**
     * The XMLNode class is the base class for all xml node.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * XML节点基类
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export interface XMLNode {
        /**
         * a integer representing the type of the node, 1：XML，2：XMLAttribute，3：XMLText
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点类型，1：XML，2：XMLAttribute，3：XMLText
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        nodeType:number;
        /**
         * the parent node of this xml node.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点所属的父级节点
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        parent: XML;
    }

    /**
     * The XML class contains properties for working with XML objects.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/XML.ts
     * @language en_US
     */
    /**
     * XML 类包含用于处理 XML 对象的属性。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/XML.ts
     * @language zh_CN
     */
    export interface XML extends XMLNode {
        /**
         * the attributes of this xml node.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当前节点上的属性列表
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        attributes:any;
        /**
         * the children of the xml node.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当前节点的子节点列表
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        children:XMLNode[];
        /**
         * the full name of this xml node. For example,the name of <s:Button/> is "s:Button".
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点完整名称。例如节点 <s:Button/> 的 name 为："s:Button"
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        name:string;
        /**
         * thie namesapce prefix of this xml node.For example,the prefix of <s:Button/> is "s".
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点的命名空间前缀。例如节点 <s:Button/> 的 prefix 为：s
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        prefix: string;
        /**
         * the local name of this xml node. For example,the local name of <s:Button/> is "Button".
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点的本地名称。例如节点 <s:Button/> 的 localName 为：Button
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        localName:string;
        /**
         * the namesapce uri of this xml node.For example,the namespace uri of <s:Skin xmlns:s="http://ns.egret.com/eui"/> is "http://ns.egret.com/eui".
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 节点的命名空间地址。例如节点 <s:Skin xmlns:s="http://ns.egret.com/eui"/> 的 namespace 为： http://ns.egret.com/eui
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        namespace: string;
    }

    /**
     * The XMLText class represents a string node in the XML.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * XMLText 类表示在XML中的文本节点
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export interface XMLText extends XMLNode {
        /**
         * the text content
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本内容
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        text:string;
    }

    /**
     * The XML class contains properties for working with XML objects.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * XML 类包含用于处理 XML 对象的属性。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export let XML:{
        /**
         * parses a text to XML instance.
         * @param text the text to be parsed.
         * @language en_US
         */
        /**
         * 解析字符串为XML对象
         * @param text 要解析的XML对象。
         * @language zh_CN
         */
        parse(text:string):XML;
    };
}