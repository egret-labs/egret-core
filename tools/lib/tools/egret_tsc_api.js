/**
 * Created by wander on 14-9-15.
 */


var file = require("../core/file.js");

function typeScriptCompiler(quitFunc,cmd, tscLibUrl) {
    file.save("tsc_config_temp.txt", cmd);//todo performance-optimize
    var TypeScript = require('../core/typescript/tsc.js');

    TypeScript.exit = function(){
        setTimeout(quitFunc,1,arguments[0])
    };

    var nameArr = [];

    var objArr = [];

    var apiArr = [];
    var dtsArr = [];
    var arr = TypeScript.executeApi(["@tsc_config_temp.txt"], tscLibUrl);
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
    parent[obj.name] = {};
    if (obj.valueDeclaration) {
        parent[obj.name]["api"] = text.substring(obj.valueDeclaration.pos, obj.valueDeclaration.end);


        addDoc(parent[obj.name]["api"], parent[obj.name]);
    }

    if (obj.name == "__constructor") {
        parent[obj.name]["api"] = text.substring(obj.declarations[0].pos, obj.declarations[0].end);

        addDoc(parent[obj.name]["api"], parent[obj.name]);
    }


    switch (obj.flags) {
        case 128: //module
        case 256: //module
            parent[obj.name]["$_tree_"] = {};

            parent[obj.name]["bodyType"] = "module";
            for (var key in obj.exports) {
                if (["__proto__", "flags", "mergeId", "name", "parent"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[obj.name]["$_tree_"], text);
            }

            break;
        case 1://module var
            parent[obj.name]["bodyType"] = "modulevar";

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }
            addPublic(parent[obj.name]["content"], parent[obj.name], obj.name);
            break;
        case 2://变量
            parent[obj.name]["bodyType"] = "var";

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            addStatic(parent[obj.name]["content"], parent[obj.name]);
            addPublic(parent[obj.name]["content"], parent[obj.name], obj.name);
            break;
        case 8192://module var  get
            parent[obj.name]["bodyType"] = "get";

            for (var i = 0; i < obj.declarations.length; i++) {
                var decla = obj.declarations[i];
                if (decla.parameters.length == 1) {//使用set
                }
                else {
                    initGetParamObject(parent[obj.name], decla, text);
                }
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            break;
        case 16384://module var set
            parent[obj.name]["bodyType"] = "set";

            for (var i = 0; i < obj.declarations.length; i++) {
                var decla = obj.declarations[i];
                if (decla.parameters.length == 1) {//使用set
                    initSetParamObject(parent[obj.name], decla, text);
                }
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            break;
        case 24576://module var set get
            parent[obj.name]["bodyType"] = "set get";

            for (var i = 0; i < obj.declarations.length; i++) {
                var decla = obj.declarations[i];
                if (decla.parameters.length == 1) {//使用set
                    initSetParamObject(parent[obj.name], decla, text);
                }
                else {
                    initGetParamObject(parent[obj.name], decla, text);
                }
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            break;
        case 8://方法
            parent[obj.name]["bodyType"] = "modulefunction";
            if (obj.valueDeclaration && obj.valueDeclaration.parameters) {
                parent[obj.name]["parameters"] = [];

                addParams(obj.valueDeclaration.parameters, parent[obj.name]["parameters"], text);
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            addPublic(parent[obj.name]["content"], parent[obj.name], obj.name);
            break;
        case 2048://方法
            parent[obj.name]["bodyType"] = "function";

            if (obj.valueDeclaration && obj.valueDeclaration.parameters) {
                parent[obj.name]["parameters"] = [];

                addParams(obj.valueDeclaration.parameters, parent[obj.name]["parameters"], text);
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            addStatic(parent[obj.name]["content"], parent[obj.name]);
            addPublic(parent[obj.name]["content"], parent[obj.name], obj.name);
            break;
        case 32://接口
            parent[obj.name]["$_tree_"] = {};
            parent[obj.name]["bodyType"] = "interface";
            for (var key in obj.members) {
                if (["__proto__", "name"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.members[key], parent[obj.name]["$_tree_"], text);
            }

            for (var key in obj.exports) {
                if (["__proto__", "flags", "id"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[obj.name]["$_tree_"], text);
            }

            if (obj["valueDeclaration"]) {
                initExtends(obj["valueDeclaration"]["baseType"], parent[obj.name]);
            }
            break;
        case 16://类
            parent[obj.name]["$_tree_"] = {};
            parent[obj.name]["bodyType"] = "class";

            for (var key in obj.members) {
                if (["__proto__", "name"].indexOf(key) >= 0) {
                    continue;
                }
                check(obj.members[key], parent[obj.name]["$_tree_"], text);
            }

            for (var key in obj.exports) {
                if (["__proto__", "flags", "id"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[obj.name]["$_tree_"], text);
            }

            if (obj["valueDeclaration"]) {
                initExtends(obj["valueDeclaration"]["baseType"], parent[obj.name]);
                initImplements(obj["valueDeclaration"]["implementedTypes"], parent[obj.name]);
            }
            break;

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
                arr.push(text.match(/(.)*/)[0]);
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
            docInfo["see"] = item;
        }
        else if (item.indexOf("link") == 0) {
            docInfo["link"] = item;
        }
        else if (item.indexOf("example") == 0) {
            docInfo["example"] = item;
        }
        else if (item.indexOf("classdesc") == 0) {
            if (item.match(/^classdesc(\s)+/)) {
                var temp = item.match(/^classdesc(\s)+/)[0];
                docInfo["description"] = changeDescription(item.substring(temp.length));
            }
            else {
                //console.log("sdf");
            }
        }
        else if (item.indexOf("return") == 0) {
            var temp = item.match(/^return(s)?(\s)+(\{[\s\S]*\})?(\s)*/)[0];

            docInfo["return"] = item.substring(temp.length);
        }
        //else {
        //    docInfo["description"] = item;
        //}

        //docs[i] = "@" + docs[i];
    }

    return docInfo;
}

function changeDescription(des) {
    return des;
}

exports.compile = typeScriptCompiler;