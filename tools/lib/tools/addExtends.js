/**
 * Created by huanghaiying on 15/2/6.
 */

var path = require("path");
var file = require("../core/file.js");

/**
 *
 * @param tempClassArr 已经排除了不需要的方法以及属性
 */
exports.addChildClasses = function (tempClassArr) {
    var classChildren = {};
    for (var tempKey in tempClassArr) {
        var item = tempClassArr[tempKey];

        if (item.class) {//class interface
            var classInfo = item.class;
            if (classInfo["augments"] && classInfo["augments"].length) {
                var classParent = classInfo["augments"][0];
                if (classChildren[classParent] == null) {
                    classChildren[classParent] = [];
                }
                classChildren[classParent].push(tempKey);
            }
        }
    }

    for (var key in tempClassArr) {
        var item = tempClassArr[key];

        if (item.class) {//class interface
            if (classChildren[key]) {
                var classInfo = item.class;
                classInfo["children"] = classChildren[key];
            }
        }
    }
    return tempClassArr;
};

exports.addExtends = function (tempClassArr) {

    var classArr = {};//所有的class
    var moduleGlobals = {};//所有的全局函数、全局属性

    for (var key in tempClassArr) {
        var item = tempClassArr[key];

        if (item.class) {//class interface
            var classInfo = clone(item, {});
            classArr[key] = classInfo;

            var extendsArr = classInfo["class"]["augments"] || [];

            //继承function
            var funcNames = [];
            for (var tempKey in classInfo["function"]) {
                funcNames.push(classInfo["function"][tempKey]["name"]);
            }

            //继承member
            var memberNames = [];
            for (var tempKey in classInfo["member"]) {
                memberNames.push(classInfo["member"][tempKey]["name"]);
            }

            extendsArr = extendsArr.concat();
            for (var i = 0; classInfo["class"]["implements"] && i < classInfo["class"]["implements"].length; i++) {
                extendsArr.push(classInfo["class"]["implements"][i]["name"]);
            }

            for (var i = 0; i < extendsArr.length; i++) {
                var parentClassInfo = tempClassArr[extendsArr[i]];
                if (parentClassInfo == null) {
                    console.log(extendsArr[i] + "从api中移除");
                    continue;
                }

                //继承function
                var parentFunctions = parentClassInfo["function"] || [];
                for (var j = 0; j < parentFunctions.length; j++) {
                    var parentFunc = clone(parentFunctions[j], {});

                    if (parentFunc["name"] != "constructor" && parentFunc["scope"] == "instance" && funcNames.indexOf(parentFunc["name"]) < 0) {//可以继承的方法
                        classInfo["function"] = classInfo["function"] || [];

                        parentFunc["inherits"] = extendsArr[i];
                        parentFunc["inherited"] = true;
                        classInfo["function"].push(parentFunc);

                        funcNames.push(parentFunc["name"]);
                    }
                }

                //继承member
                var parentMembers = parentClassInfo["member"] || [];
                for (j = 0; j < parentMembers.length; j++) {
                    var parentMember = clone(parentMembers[j], {});

                    if (parentMember["scope"] == "instance" && memberNames.indexOf(parentMember["name"]) < 0) {//可以继承的方法
                        classInfo["member"] = classInfo["member"] || [];

                        parentMember["inherits"] = extendsArr[i];
                        parentMember["inherited"] = true;
                        classInfo["member"].push(parentMember);

                        memberNames.push(parentMember["name"]);
                    }
                }
            }

            //排序
            classInfo["function"].sort(function (a, b) {
                return a["name"] > b["name"] ? 1 : -1
            });
            classInfo["member"].sort(function (a, b) {
                return a["name"] > b["name"] ? 1 : -1
            });


            if (classInfo.class.kind == "class") {
                for (var i = 0; i < classInfo["function"].length; i++) {
                    var tempFunc = classInfo["function"][i];
                    if (tempFunc["name"] == "constructor") {
                        break;
                    }
                }

                var arr = key.split(".");
                var className = arr[arr.length - 1];
                if (classInfo["function"].length && i < classInfo["function"].length) {
                    var cons = classInfo["function"][i];
                    cons["name"] = className;
                    classInfo["function"].splice(i, 1);
                    classInfo["function"].unshift(cons);
                }
                else {
                    //var cons = {
                    //    "kind": "function",
                    //    "name": className,
                    //    "memberof": key,
                    //    "scope": "instance",
                    //    "description": "<p>构造函数</p>"
                    //};
                    //
                    //classInfo["function"] = classInfo["function"] || [];
                    //classInfo["function"].unshift(cons);
                }
            }
        }
        else {//module
            var modeName = key;
            if (item.memberof && item.memberof != "") {
                //modeName = item.memberof + "." + key;
            }

            moduleGlobals[modeName] = {};

            if (item.globalMember.length) {
                moduleGlobals[modeName]["globalMember"] = clone(item.globalMember, []);
            }
            if (item.globalFunction.length) {
                moduleGlobals[modeName]["globalFunction"] = clone(item.globalFunction, []);
            }
        }
    }

    return {"classes": classArr, "modules": moduleGlobals}
};

exports.save = function (apiObj, outputPath) {

    var tempModulesArr = {};

    var tempClassArr = apiObj["classes"];
    for (var key in tempClassArr) {
        var item = tempClassArr[key];

        if (tempModulesArr[item.class.memberof] == null) {
            tempModulesArr[item.class.memberof] = [];
        }
        tempModulesArr[item.class.memberof].push(item.class.name);

        file.save(path.join(outputPath, "finalClasses/" + key + ".json"), JSON.stringify(tempClassArr[key], null, "\t"));
    }

    var tempModules = apiObj["modules"];
    for (var key in tempModules) {
        var item = tempModules[key];

        if (item["globalMember"] && item["globalMember"].length) {
            file.save(path.join(outputPath, "finalClasses", key + "." + "globalMember.json"), JSON.stringify({"globalMember": item["globalMember"]}, null, "\t"));
        }
        if (item["globalFunction"] && item["globalFunction"].length) {
            file.save(path.join(outputPath, "finalClasses", key + "." + "globalFunction.json"), JSON.stringify({"globalFunction": item["globalFunction"]}, null, "\t"));
        }
    }

    for (var key in tempModulesArr) {
        var mod = tempModulesArr[key];
        mod.sort();

        if (tempModules[key]) {
            if (tempModules[key]["globalFunction"] && tempModules[key]["globalFunction"].length) {
                mod.unshift("globalFunction");
            }
            if (tempModules[key]["globalMember"] && tempModules[key]["globalMember"].length) {
                mod.unshift("globalMember");
            }
        }
    }
    file.save(path.join(outputPath, "relation/egret_list.json"), JSON.stringify(tempModulesArr, null, "\t"));
};


function clone(frame, result) {
    for (var key in frame) {
        if (frame[key] instanceof Array) {
            result[key] = clone(frame[key], []);
        }
        else if (frame[key] instanceof Object) {//
            result[key] = clone(frame[key], {});
        }
        else {
            result[key] = frame[key];
        }
    }
    return result;
}