/**
* Copyright (c) egret.com. Permission is hereby granted, free of charge,
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

var sax = require("./sax/sax");
var saxparser = sax.parser(true);

function parse(xmlString) {
    var object = null;
    var namespaces = {};
    var hasError = false;
    saxparser.onerror = function (err) {
        hasError = true;
    };
    saxparser.onopentag = function (node) {
        var attribs = node.attributes;
        delete node["attributes"];
        for (var key in attribs) {
            index = key.indexOf("xmlns:");
            if (index == 0) {
                var prefix = key.substring(6);
                var uri = attribs[key];
                namespaces[prefix] = uri;
                delete attribs[key];
            }
            else{
                node["$"+key] = attribs[key];
            }
        }
        node.text = "";
        node.toString = toString;
        var name = node.name;
        var index = name.indexOf(":");
        if (index == -1) {
            node.namespace = "";
            node.prefix = "";
            node.localName = name;
        } else {
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
        } else {
            object = node;
        }
    };

    saxparser.onclosetag = function (node) {
        if (object.parent)
            object = object.parent;
    };

    saxparser.oncdata = function (cdata) {
        if (object && !object.children)
            object.text = cdata;
    };

    saxparser.ontext = function (text) {
        if (object && !object.text && !object.children)
            object.text = text;
    };

    saxparser.write(xmlString).close();

    if (hasError) {
        return null;
    } else {
        return object;
    }
};

function toString(){
    return this.text;
};

exports.parse = parse;
