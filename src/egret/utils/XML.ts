/** Created with JetBrains WebStorm.
 * User: yjtx
 * Date: 14-4-14
 * Time: 下午4:00
 * Class: XML
 * Summary: 根据 xml格式的字符串 生成可以直接 通过属性 获取值
 *

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

module ns_egret{
    export class XML {
        private _xmlStr = "";

        /**
         * 必须是 xml格式的字符串
         * @param xmlStr  xml格式的字符串
         */
            constructor(xmlStr:string = "") {
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