/**
 * Created by wander on 14-9-15.
 */


var file = require("../core/file.js");
var trim = require("./trim");

function typeScriptCompiler(quitFunc,cmd) {
    file.save("tsc_config_temp.txt", cmd);//todo performance-optimize
    var TypeScript = require('../core/typescript/tscapi.js');

    TypeScript.exit = function(){
        setTimeout(quitFunc,1,arguments[0])
    };

    var nameArr = [];

    var objArr = [];

    var apiArr = [];
    var dtsArr = [];
    var arr = TypeScript.executeApi(["@tsc_config_temp.txt"]);
    arr.forEach(function (item) {
        if (item.filename.indexOf(".d.ts") >= 0) {
            dtsArr.push(item.locals);
        }
        else {
            objArr.push(item.locals);

            nameArr.push(item.filename);

            var root = {"filename" : item.filename, "$_tree_":{}};
            apiArr.push(root);
            for (var key in item.locals) {
                if (key == "NaN" || key == "__proto__") {
                    continue;
                }
                check(item.locals[key], root["$_tree_"], item.text);
            }
        }
    });

    return apiArr;
}

function check(obj, parent, text) {
    var objName = obj.name;
    if (obj.name == "__constructor") {
        objName = "constructor";
        parent[objName] = {};
        parent[objName]["api"] = text.substring(obj.declarations[0].pos, obj.declarations[0].end);

        addDoc(parent[objName]["api"], parent[objName]);
    }
    else if (obj.valueDeclaration) {
        parent[objName] = {};
        parent[objName]["api"] = text.substring(obj.valueDeclaration.pos, obj.valueDeclaration.end);

        addDoc(parent[objName]["api"], parent[objName]);
    }
    else {
        parent[objName] = {};
    }



    switch (obj.flags) {
        case 128: //module
        case 256: //module
        {
            parent[objName]["$_tree_"] = {};

            parent[objName]["bodyType"] = "module";
            for (var key in obj.exports) {
                if (["__proto__", "flags", "mergeId", "name", "parent"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[objName]["$_tree_"], text);
            }

            break;
        }
        case 1://module var
        {
            parent[objName]["bodyType"] = "modulevar";

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[objName]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }
            addPublic(parent[objName]["content"], parent[objName], objName);
            break;
        }
        case 2://变量
        {
            parent[objName]["bodyType"] = "var";

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[objName]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            addStatic(parent[objName]["content"], parent[objName]);
            addPublic(parent[objName]["content"], parent[objName], objName);
            break;
        }
        case 8192://module var  get
        {
            parent[objName]["bodyType"] = "get";

            for (var i = 0; i < obj.declarations.length; i++) {
                var decla = obj.declarations[i];
                if (decla.parameters.length == 1) {//使用set
                }
                else {
                    initGetParamObject(parent[objName], decla, text);
                }
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[objName]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            break;
        }
        case 16384://module var set
        {
            parent[objName]["bodyType"] = "set";

            for (var i = 0; i < obj.declarations.length; i++) {
                var decla = obj.declarations[i];
                if (decla.parameters.length == 1) {//使用set
                    initSetParamObject(parent[objName], decla, text);
                }
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[objName]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            break;
        }
        case 24576://module var set get
        {
            parent[objName]["bodyType"] = "set get";

            for (var i = 0; i < obj.declarations.length; i++) {
                var decla = obj.declarations[i];
                if (decla.parameters.length == 1) {//使用set
                    initSetParamObject(parent[objName], decla, text);
                }
                else {
                    initGetParamObject(parent[objName], decla, text);
                }
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[objName]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            break;
        }
        case 8://方法
        {
            parent[objName]["bodyType"] = "modulefunction";
            if (obj.valueDeclaration && obj.valueDeclaration.parameters) {
                parent[objName]["parameters"] = [];

                addParams(obj.valueDeclaration.parameters, parent[objName]["parameters"], text);
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[objName]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            addPublic(parent[objName]["content"], parent[objName], objName);
            break;
        }
        case 4096://构造函数
        {
            parent[objName]["bodyType"] = "function";

            var declarations = obj.declarations[0];

            if (declarations && declarations.parameters) {
                parent[objName]["parameters"] = [];

                addParams(declarations.parameters, parent[objName]["parameters"], text);
            }

            parent[objName]["type"] = null;
            addStatic(parent[objName]["content"], parent[objName]);
            addPublic(parent[objName]["content"], parent[objName], objName);
            break;
        }
        case 2048://方法
        {
            parent[objName]["bodyType"] = "function";

            if (obj.valueDeclaration && obj.valueDeclaration.parameters) {
                parent[objName]["parameters"] = [];

                addParams(obj.valueDeclaration.parameters, parent[objName]["parameters"], text);
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[objName]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }
            addStatic(parent[objName]["content"], parent[objName]);
            addPublic(parent[objName]["content"], parent[objName], objName);
            break;
        }
        case 32://接口
        {
            parent[objName]["$_tree_"] = {};
            parent[objName]["bodyType"] = "interface";
            for (var key in obj.members) {
                if (["__proto__", "name"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.members[key], parent[objName]["$_tree_"], text);
            }

            for (var key in obj.exports) {
                if (["__proto__", "flags", "id"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[objName]["$_tree_"], text);
            }

            if (obj["declarations"] && obj["declarations"].length) {
                var docInfo = obj["declarations"][0];
                if (docInfo["baseTypes"] && docInfo["baseTypes"].length) {
                    initExtends(docInfo["baseTypes"][0], parent[objName]);
                }

                parent[objName]["api"] = text.substring(docInfo.pos, docInfo.end);

                addDoc(parent[objName]["api"], parent[objName]);
            }
            break;
        }
        case 16://类
        {
            parent[objName]["$_tree_"] = {};
            parent[objName]["bodyType"] = "class";

            for (var key in obj.members) {
                if (["__proto__", "name"].indexOf(key) >= 0) {
                    continue;
                }
                check(obj.members[key], parent[objName]["$_tree_"], text);
            }

            for (var key in obj.exports) {
                if (["__proto__", "flags", "id"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[objName]["$_tree_"], text);
            }

            if (obj["valueDeclaration"]) {
                initExtends(obj["valueDeclaration"]["baseType"], parent[objName]);
                initImplements(obj["valueDeclaration"]["implementedTypes"], parent[objName]);
            }
            break;
        }

    }
}

function addDoc(text, obj) {
    text = text.replace(/^(\s)*/, "");
    if (text.charAt(0) != "/") {

    }
    else {

        var arr = [];
        while (text.charAt(0) == "/") {
            if (text.charAt(1) == "*") {
                var last = text.indexOf("*/");

                arr.push(text.substring(0, last + 2));

                text = text.substring(last + 2);

                text = text.replace(/^(\s)*/, "");
            }
            else {
                //arr.push(text.match(/(.)*/)[0]);
                text = text.replace(/(.)*/, "");

                text = text.replace(/^(\s)*/, "");
            }
        }

        var brr = [];
        var crr = [];
        if (arr.length) {
            for (var i = 0; i < arr.length; i++) {
                var doc = arr[i];

                doc = doc.replace(/^\/(\/)+/, "");
                doc = doc.replace(/(\n\r|\r\n|\n|\r)/g, "\n");

                doc = doc.replace(/^\/(\*)+/, "");
                doc = doc.replace(/(\*)+\/$/, "");

                doc = doc.replace(/(\n)(\s)*(\*)+@/g, "\n@");

                doc = doc.replace(/(\n)(\s)*(\*)+[^\S\n]?/g, "\n");

                //去掉 @member
                doc = doc.replace(/@member.*/, "");
                //去掉 @method
                doc = doc.replace(/@method.*/, "");
                //去掉 @class
                doc = doc.replace(/@class .*/, "");
                //去掉 @extends
                doc = doc.replace(/@extends.*/, "");
                //去掉 @constant
                doc = doc.replace(/@constant.*/, "");
                //去掉 @constructor
                doc = doc.replace(/@constructor.*/, "");
                //去掉 @implements
                doc = doc.replace(/@implements.*/, "");

                doc = doc.replace(/^(\s)*/, "");
                doc = doc.replace(/(\s)*$/, "");
                brr[i] = doc;

                crr.push(analyze(doc));
            }

            //obj["docapi"] = arr;
            //obj["docapin"] = brr;
            obj["docs"] = crr;
        }

    }


    if (text.indexOf("{") >= 0) {
        obj["content"] = text.substring(0, text.indexOf("{"));
    }
    else {
        obj["content"] = text;
    }
}

//加入是否是static
function addStatic(content, obj) {
    //判断是否是 static
    if (content.match(/(^static )|( static )/)) {
        obj["scope"] = "static";
    }
    else {
        obj["scope"] = "instance";
    }
}

//是否是public
function addPublic(content, obj, name) {
    //判断是否是 static
    if (content.match(/(^private )|( private )/)) {
        obj["pType"] = "private";
    }
    else {
        if (name.charAt(0) == "_") {
            obj["pType"] = "protected";
        }
        else {
            obj["pType"] = "public";
        }
    }
}

//参数列表
function addParams(parameters, parametersArr, text) {
    for (var i = 0; i < parameters.length; i++) {
        var param = parameters[i];

        var p = {};

        var value = text.substring(param.pos, param.end);
        if (value.indexOf("...") >= 0) {
            p["name"] = "..." + param.name.text;
        }
        else if (param.name) {
            p["name"] = param.name.text;
        }

        if (param.type) {
            p["type"] = text.substring(param.type.pos, param.type.end)
        }
        parametersArr.push(p);
    }
}

//set 参数列表
function initGetParamObject(obj, decla, text) {
    obj["get"] = {};
    obj["get"]["api"] = text.substring(decla.pos, decla.end);
    addDoc(obj["get"]["api"], obj["get"]);

    obj["get"]["parameters"] = [];
    addParams(decla.parameters, obj["get"]["parameters"], text);
}

//get 参数列表
function initSetParamObject(obj, decla, text) {
    obj["set"] = {};
    obj["set"]["api"] = text.substring(decla.pos, decla.end);
    addDoc(obj["set"]["api"], obj["set"]);

    obj["set"]["parameters"] = [];
    addParams(decla.parameters, obj["set"]["parameters"], text);
}

//extends
function initExtends(baseType, obj) {
    if (baseType == null) {
        return;
    }
    obj["extends"] = baseType["typeName"]["text"];
}

//implements
function initImplements(implementedTypes, obj) {
    if (implementedTypes == null) {
        return;
    }
    obj["implements"] = [];
    for (var i = 0; i < implementedTypes.length; i++) {
        obj["implements"].push(implementedTypes[i]["typeName"]["text"]);
    }
}

function analyze(doc) {
    var docs;

    docs = doc.split(/\n\@/);
    if (docs == null) {
        docs = [doc];
    }

    var docInfo = {};
    for (var i = 0; i < docs.length; i++) {
        var item = docs[i];
        item = item.replace(/^(\s)*/, "");
        if (item == "") {
            continue;
        }
        if (i == 0 && item.charAt(0) != "@") {
            docInfo["description"] = changeDescription(item);
            continue;
        }
        else if (i == 0) {
            item = item.substring(1);
        }

        if (item.indexOf("private") == 0) {
            docInfo["private"] = true;
        }
        else if (item.indexOf("deprecated") == 0) {
            docInfo["deprecated"] = true;
        }
        else if (item.indexOf("param") == 0) {
            if (docInfo["params"] == null) {
                docInfo["params"] = {};
            }

            var itemArr = item.split(/^param(\s)+/);
            var paramName = itemArr[itemArr.length - 1].match(/^(\S)+/)[0];

            itemArr = itemArr[itemArr.length - 1].split(/^(\S)+(\s)+(\{(\s|\S)*\})?(\s)*/);
            var des = "";
            des = itemArr[itemArr.length - 1];

            docInfo["params"][paramName] = des;
        }
        else if (item.indexOf("see") == 0) {
            var temp = item.match(/^see(\s)+/)[0];
            docInfo["see"] = item.substring(temp.length);
        }
        else if (item.indexOf("link") == 0) {
            var temp = item.match(/^link(\s)+/)[0];
            docInfo["link"] = item.substring(temp.length);
        }
        else if (item.indexOf("example") == 0) {
            var temp = item.match(/^example(\s)+/)[0];
            docInfo["example"] = item.substring(temp.length);
        }
        else if (item.indexOf("classdesc") == 0) {
            if (item.match(/^classdesc(\s)+/)) {
                var temp = item.match(/^classdesc(\s)+/)[0];
                if (docInfo["description"] == null) {
                    docInfo["description"] = changeDescription(item.substring(temp.length));
                }
                else {
                    docInfo["description"] += "\n" + changeDescription(item.substring(temp.length));
                }
            }
            else {
                //console.log("sdf");
            }
        }
        else if (item.indexOf("return") == 0) {
            var temp = item.match(/^return(s)?(\s)+(\{[\s\S]*\})?(\s)*/)[0];

            docInfo["return"] = item.substring(temp.length);
        }
        else {
            var docName = item.match(/^(\S)+/)[0];
            docInfo[docName] = trim.trimAll(changeDescription(item.substring(docName.length)) || "");
        }
    }

    return docInfo;
}

function changeDescription(des) {
    return des;
}

exports.compile = typeScriptCompiler;