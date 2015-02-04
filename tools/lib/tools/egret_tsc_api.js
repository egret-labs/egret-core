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

            var root = {"filename" : item.filename, "tree":{}};
            apiArr.push(root);
            for (var key in item.locals) {
                if (key == "NaN" || key == "__proto__") {
                    continue;
                }
                check(item.locals[key], root["tree"], item.text);
            }
        }
    });

    console.log("adf");
}

function check(obj, parent, text) {
    parent[obj.name] = {"tree":{}};

    if (obj.valueDeclaration) {
        parent[obj.name]["api"] = text.substring(obj.valueDeclaration.pos, obj.valueDeclaration.end);


        addDoc(parent[obj.name]["api"], obj.name, parent[obj.name]);
    }

    if (obj.name == "__constructor") {
        parent[obj.name]["api"] = text.substring(obj.declarations[0].pos, obj.declarations[0].end);

        addDoc(parent[obj.name]["api"], obj.name, parent[obj.name]);
    }


    switch (obj.flags) {
        case 128: //module
        case 256: //module
            parent[obj.name]["bodyType"] = "module";
            for (var key in obj.exports) {
                if (["__proto__", "flags", "mergeId", "name", "parent"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[obj.name]["tree"], text);
            }

            break;
        case 1://module var
            parent[obj.name]["bodyType"] = "modulevar";

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }
            break;
        case 2://变量
            parent[obj.name]["bodyType"] = "var";

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }
            break;
        case 8192://module var  get
            parent[obj.name]["bodyType"] = "get";

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            break;
        case 8://方法
            parent[obj.name]["bodyType"] = "modulefunction";
            if (obj.valueDeclaration && obj.valueDeclaration.parameters) {
                parent[obj.name]["parameters"] = [];

                for (var i = 0; i < obj.valueDeclaration.parameters.length; i++) {
                    var param = obj.valueDeclaration.parameters[i];

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
                    parent[obj.name]["parameters"].push(p);
                }
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }
            break;
        case 2048://方法
            parent[obj.name]["bodyType"] = "function";

            if (obj.valueDeclaration && obj.valueDeclaration.parameters) {
                parent[obj.name]["parameters"] = [];

                for (var i = 0; i < obj.valueDeclaration.parameters.length; i++) {
                    var param = obj.valueDeclaration.parameters[i];

                    var p = {};

                    if (param.name) {
                        p["name"] = param.name.text;
                    }

                    if (param.type) {
                        p["type"] = text.substring(param.type.pos, param.type.end)
                    }
                    parent[obj.name]["parameters"].push(p);
                }
            }

            if (obj.valueDeclaration && obj.valueDeclaration.type) {
                parent[obj.name]["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
            }

            break;
        case 32://接口
            parent[obj.name]["bodyType"] = "interface";
            for (var key in obj.members) {
                if (["__proto__", "name"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.members[key], parent[obj.name]["tree"], text);
            }

            for (var key in obj.exports) {
                if (["__proto__", "flags", "id"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[obj.name]["tree"], text);
            }

            break;
        case 16://类

            parent[obj.name]["bodyType"] = "class";

            for (var key in obj.members) {
                if (["__proto__", "name"].indexOf(key) >= 0) {
                    continue;
                }
                check(obj.members[key], parent[obj.name]["tree"], text);
            }

            for (var key in obj.exports) {
                if (["__proto__", "flags", "id"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[obj.name]["tree"], text);
            }

            break;

    }
}

function addDoc(text, name, obj) {
    text = text.replace(/^(\s)*/, "");
    if (text.charAt(0) != "/") {
        return;
    }


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

            doc = doc.replace(/^(\s)*/, "");
            doc = doc.replace(/(\s)*$/, "");
            brr[i] = doc;

            crr.push(analyze(doc));
        }

        obj["docapi"] = arr;
        obj["docapin"] = brr;
        obj["docapic"] = crr;
    }

    obj["content"] = text.substring(0, text.indexOf("{"));
}

function analyze(doc) {
    var docs;

    docs = doc.split(/\n\@/);
    if (docs == null) {
        docs = [doc];
    }

    for (var i = 1; i < docs.length; i++) {
        docs[i] = "@" + docs[i];
    }

    return docs;
}

exports.compile = typeScriptCompiler;