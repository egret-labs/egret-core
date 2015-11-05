/**
 * Created by yanjiaqi on 15/10/20.
 */
var sax = require("../../xml/sax");
var utils = require("../../utils");
var saxparser = sax.parser(true);
function parse(xmlString) {
    var object = null;
    //命名空间查询表
    var namespaces = {};
    var hasError = false;
    saxparser.resume();
    saxparser.onerror = function (err) {
        hasError = true;
    };
    saxparser.onopentag = function (node) {
        node.nodeType = 1;
        var attribs = node.attributes;
        //delete node["attributes"];
        for (var key in attribs) {
            index = key.indexOf("xmlns:");
            if (index == 0) {
                var prefix = key.substring(6);
                var uri = attribs[key];
                namespaces[prefix] = uri;
                delete attribs[key];
            }
        }
        node.text = "";
        node.toString = toString;
        //以下为解析node名(无命名空间和有命名空间两种情况)
        var name = node.name;
        var index = name.indexOf(":");
        if (index == -1) {
            node.namespace = "";
            node.prefix = "";
            node.localName = name;
        }
        else {
            var prefix = name.substring(0, index);
            node.prefix = prefix;
            node.namespace = namespaces[prefix];
            node.localName = name.substring(index + 1);
        }
        if (object) {
            var children = object.children;
            if (!children) {
                children = object.children = [];
                if (object.text) {
                    object.text = "";
                }
            }
            children.push(node);
            node.parent = object;
            object = node;
        }
        else {
            object = node;
        }
    };
    saxparser.onclosetag = function (node) {
        if (object.parent)
            object = object.parent;
    };
    saxparser.oncdata = function (cdata) {
        if (object && !object.children) {
            object.nodeType = 3;
            object.text = cdata;
        }
    };
    saxparser.ontext = function (text) {
        //忽略格式化字符
        if (utils.isFormatString(text)) {
            return;
        }
        if (object && !object.text && !object.children) {
            object.nodeType = 3;
            object.text = text;
        }
    };
    saxparser.write(xmlString).close();
    if (hasError) {
        return null;
    }
    else {
        return object;
    }
}
exports.parse = parse;
;
function toString() {
    return this.text;
}
;
//export = { parse: parse };

//# sourceMappingURL=../../../lib/eui/parser/index.js.map