/**
 * Created by huanghaiying on 15/2/5.
 */

var file = require("../core/file.js");
var path = require("path");

var classesArr = {};
var windowArr = [];

var classRelations = {};
var classMemberofs = {};

var modulesArr = {};
function addToModulesArr(className, memberof) {
    if (modulesArr[memberof] == null) {
        modulesArr[memberof] = [];
    }

    modulesArr[memberof].push(className);
}

function getExtendsClassName(className) {
    if (className && classRelations[getClassFullName(className)]) {
        return getClassFullName(classRelations[getClassFullName(className)]);
    }
    return null;
}

function getClassFullName(className) {
    var memberof = getMemberof(className);

    if (memberof.length) {
        var arr = className.split(".");
        return memberof + "." + arr[arr.length - 1];
    }
    else {
        return className;
    }
}

function getMemberof(className) {
    var arr = className.split(".");

    var name = arr[arr.length - 1];

    if (classMemberofs[name] == null) {
        return "";
    }

    if (classMemberofs[name].length == 1) {
        return classMemberofs[name][0];
    }

    for (var i = 0; i < classMemberofs[name].length; i++) {
        var fullName =  classMemberofs[name][i] + "." + name;
        if (fullName.indexOf(className) == fullName.length - className.length) {
            return classMemberofs[name][i];
        }
    }

    arr.pop();
    return arr.join(".");
}

function addExtendsClass(name, memberof, parent) {
    classRelations[memberof + "." + name] = parent;

    if (classMemberofs[name] == null) {
        classMemberofs[name] = [];
    }

    if (classMemberofs[name].indexOf(memberof) < 0) {
        classMemberofs[name].push(memberof);
    }
}

exports.save = function (apiArr, outputPath) {
    for (var i = 0; i < apiArr.length; i++) {
        _analyze(apiArr[i], [], apiArr[i]["filename"]);
    }

    //加入extends 和  implements
    for (var key in classesArr) {
        var classinfo = classesArr[key];

        var classDes;
        if (classinfo["class"]) {
            classDes = classinfo["class"];
        }
        else if (classinfo["interface"]) {
            classDes = classinfo["interface"];
        }
        else {
            continue;
        }

        //继承
        if (classDes["tempExtends"]) {
            classDes["augments"] = [];

            var parent = getClassFullName(classDes["tempExtends"]);
            classDes["augments"].push(parent);

            while (parent = getExtendsClassName(parent)) {
                classDes["augments"].push(parent);
            }
        }

        //接口
        if (classDes["tempImplements"]) {
            classDes["implements"] = [];

            for (var i = 0; i < classDes["tempImplements"].length; i++) {
                var tempIm = classDes["tempImplements"][i];

                classDes["implements"].push({"name" : getClassFullName(tempIm)});
            }
        }

        delete classDes["tempExtends"];
        delete classDes["tempImplements"];

        setFullType(classinfo);

    }

    var tempClassArr = {};
    clone(classesArr, tempClassArr);
    removeDefault(tempClassArr);


    var tempModulesArr = {};
    var tempMemberGlobals = {};
    var tempFunctionGlobals = {};
    for (var key in tempClassArr) {
        var item = tempClassArr[key];
        if (item.class) {
            if (tempModulesArr[item.class.memberof] == null) {
                tempModulesArr[item.class.memberof] = [];
            }
            tempModulesArr[item.class.memberof].push(item.class.name);

            file.save("/Volumes/WORK/Sites/api/js/data/finalClasses/" + key + ".json", JSON.stringify(tempClassArr[key], null, "\t"));
        }
        else {
            var modeName = key;
            if (item.memberof && item.memberof != "") {
                modeName = item.memberof + "." + key;
            }

            if (item.globalMember.length) {
                tempMemberGlobals[modeName] = true;
                var globalM = {"member":[], "function":[], "globalMember":item.globalMember, "globalFunction":[]};
                file.save(path.join(outputPath, "finalClasses", modeName + "." + "globalMember.json"), JSON.stringify(globalM, null, "\t"));
            }
            if (item.globalFunction.length) {
                tempFunctionGlobals[modeName] = true;
                var globalF = {"member":[], "function":[], "globalMember":[], "globalFunction":item.globalFunction};
                file.save(path.join(outputPath, "finalClasses",modeName + "." + "globalFunction.json"), JSON.stringify(globalF, null, "\t"));
            }
        }
    }

    for (var key in tempModulesArr) {
        var mod = tempModulesArr[key];
        mod.sort();

        if (tempMemberGlobals[key]) {
            mod.unshift("globalMember");
        }
        if (tempFunctionGlobals[key]) {
            mod.unshift("globalFunction");
        }
    }
    file.save(path.join(outputPath, "relation/egret_list.json"), JSON.stringify(tempModulesArr, null, "\t"));

    console.log("asdf");
};

function removeDefault(tempObj) {
    if (!(tempObj instanceof Object)) {
        return false;
    }

    if (tempObj["pType"] == "private" || tempObj["pType"] == "protected") {
        return true;
    }
    if (tempObj["private"] == true) {
        return true;
    }

    if (tempObj["noDes"] == true) {
        return true;
    }

    if (tempObj instanceof Array) {
        for (var i = tempObj.length - 1; i >= 0; i--) {
            if (removeDefault(tempObj[i])) {
                tempObj.splice(i, 1);
            }
        }
    }
    else {
        for (var key in tempObj) {
            if (removeDefault(tempObj[key])) {
                delete tempObj[key];
            }
        }
    }
}

function setFullType(obj) {
    if (obj instanceof Object) {
        for (var key in obj) {
            if (key == "type" && obj[key] != null && ["void", "number", "string", "boolean", "any"].indexOf(obj[key]) < 0) {
                obj[key] = getClassFullName(obj[key]);
            }
            else {
                setFullType(obj[key]);
            }
        }
    }
}


function _analyze(docsInfo, parent, filename) {

    for (var key in docsInfo["$_tree_"]) {
        var item = docsInfo["$_tree_"][key];
        analyze(item, key, parent, filename);
    }
}

function addClassInfo(name, parent) {
    var l = parent.concat([name]);
    if (classesArr[l.join(".")] == null) {
        classesArr[l.join(".")] = {"memberof" : parent.join("."), "member":[], "function":[], "globalMember":[], "globalFunction":[]};
    }

    return classesArr[l.join(".")];
}

function analyze(item, name, parent, filename) {
    var rwType = 0;

    var tempParent = parent.concat();
    switch (item.bodyType) {
        case "module":
            var moduleInfo = addClassInfo(name, tempParent);
            moduleInfo["memberof"];

            tempParent.push(name);
            _analyze(item, tempParent, filename);

            addOtherPropertis(moduleInfo, item);
            break;
        case "interface":
            var classInfo = addClassInfo(name, tempParent);
            delete classInfo["memberof"];

            var tempClass = classInfo["class"] = {};
            tempClass["kind"] = "interface";
            tempClass["name"] = name;
            tempClass["memberof"] = tempParent.join(".");
            tempClass["filename"] = filename;

            initDesc(item["docs"], item["parameters"], tempClass);
            tempClass["classdesc"] = tempClass["description"];
            delete tempClass["description"];

            tempClass["extends"] = item["extends"];

            addExtendsClass(name, tempClass["memberof"], tempClass["tempExtends"]);

            tempParent.push(name);
            _analyze(item, tempParent, filename);

            addToModulesArr(name, tempClass["memberof"]);

            addOtherPropertis(classInfo, item);

            if (tempClass["classdesc"] == null || tempClass["classdesc"] == "") {
                //classInfo["noDes"] = true;
            }
            break;
        case "class":
            var classInfo = addClassInfo(name, tempParent);
            delete classInfo["memberof"];

            var tempClass = classInfo["class"] = {};
            tempClass["kind"] = "class";
            tempClass["name"] = name;
            tempClass["memberof"] = tempParent.join(".");
            tempClass["filename"] = filename;

            initDesc(item["docs"], item["parameters"], tempClass);
            tempClass["classdesc"] = tempClass["description"];
            delete tempClass["description"];

            tempClass["tempExtends"] = item["extends"];
            tempClass["tempImplements"] = item["implements"];

            addExtendsClass(name, tempClass["memberof"], tempClass["tempExtends"]);

            tempParent.push(name);
            _analyze(item, tempParent, filename);

            addToModulesArr(name, tempClass["memberof"]);

            addOtherPropertis(classInfo, item);

            if (tempClass["classdesc"] == null || tempClass["classdesc"] == "") {
                //classInfo["noDes"] = true;
            }
            break;
        case "modulevar"://变量
            var member = {};
            member["kind"] = "globalmember";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = item["scope"];

            initDesc(item["docs"], item["parameters"], member);

            if (classesArr[member["memberof"]] == null) {
                windowArr.push(member);
            }
            else {
                classesArr[member["memberof"]]["globalMember"].push(member);
            }

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, item);
            break;
        case "var"://变量
            var member = {};
            member["kind"] = "member";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = item["scope"];

            initDesc(item["docs"], item["parameters"], member);

            classesArr[member["memberof"]]["member"].push(member);

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, item);
            break;
        case "get"://
            rwType = 1;
        case "set"://
            if (rwType == 0) {
                rwType = 2;
            }
        case "set get":
        {
            if (rwType == 0) {
                rwType = 3;
            }
            var member = {};
            member["kind"] = "member";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = item["scope"];
            member["rw"] = "setget";

            var tempItem;
            if (rwType == 1) {
                tempItem = item["get"];
            }
            else {
                tempItem = item["set"];
            }

            initDesc(tempItem["docs"], tempItem["parameters"], member, true);
            if (rwType != 1) {
                member["type"] = member["params"][0]["type"];

                delete member["params"];
            }
            if (member["description"] == "" && rwType == 3) {
                member["description"] = getDesc(item["get"]["docs"]);
            }

            if (rwType == 1) {
                member["description"] += "【只读】";
            }
            else if (rwType == 2){
                member["description"] += "【只写】";
            }
            member["description"] = changeDescription(member["description"]);

            classesArr[member["memberof"]]["member"].push(member);

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, tempItem);
            break;
        }
        case "modulefunction"://变量
            var member = {};
            member["kind"] = "globalFunction";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = item["scope"];

            if (item["docs"] && item["docs"].length) {
                var doc = item["docs"][item["docs"].length - 1];

                if (doc["return"]) {
                    member["returns"] = {"type" : member["type"], "description" : changeDescription(doc["return"])};
                }
            }

            initDesc(item["docs"], item["parameters"], member);
            if (member["returns"]) {
                member["returns"]["type"] = member["type"];
            }

            classesArr[member["memberof"]]["globalFunction"].push(member);

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, item);
            break;
        case "function"://变量
            var member = {};
            member["kind"] = "function";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = item["scope"];

            if (item["docs"] && item["docs"].length) {
                var doc = item["docs"][item["docs"].length - 1];

                if (doc["return"]) {
                    member["returns"] = {"type" : member["type"], "description" : changeDescription(doc["return"])};
                }
            }

            initDesc(item["docs"], item["parameters"], member);
            if (member["returns"]) {
                member["returns"]["type"] = member["type"];
            }
            else {
                if (member["type"] != "void") {
                    member["returns"] = {"type" : member["type"]};
                }
            }
            classesArr[member["memberof"]]["function"].push(member);

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, item);
            break;
    }
}

function getDesc(docs) {
    if (docs && docs.length) {
        var doc = docs[docs.length - 1];

        return changeDescription(doc["description"]);
    }
    return "";
}

function initDesc(docs, parameters, obj, notTrans) {
    if (notTrans === void 0) { notTrans = false; }
    var paramsDoc = {};
    if (docs && docs.length) {
        var doc = docs[docs.length - 1];

        if (doc["return"]) {
            obj["returns"] = {"description" : changeDescription(doc["return"])};
        }

        if (doc["params"]) {
            paramsDoc = doc["params"];
        }

        if (!notTrans) {
            obj["description"] = changeDescription(doc["description"]);
        }
        else {
            obj["description"] = doc["description"];
        }
    }

    if (parameters && parameters.length) {
        for (var i = 0; i < parameters.length; i++) {
            var param = parameters[i];
            param["description"] = changeDescription(paramsDoc[param["name"]] || "");
        }
        obj["params"] = parameters;
    }
}

function addOtherPropertis(item, orgItem) {
    if (orgItem["private"]) {
        item["private"] = true;
    }

    if (orgItem["deprecated"]) {
        item["deprecated"] = true;
    }

    if (orgItem["see"]) {
        item["see"] = orgItem["see"];
    }

    if (orgItem["link"]) {
        item["link"] = orgItem["link"];
    }

    if (orgItem["example"]) {
        item["example"] = orgItem["example"];
    }

    if (orgItem["pType"]) {
        item["pType"] = orgItem["pType"];
    }
}

function changeDescription(des) {
    if (des == null) {
        return des;
    }
    des = des.replace(/^(\s)*/, "");
    des = des.replace(/(\s)*$/, "");
    if (des == "") {
        return des;
    }

    //var arr = des.split("\n");
    //return "<p>" + arr.join("</p><p>") + "</p>";
    return "<p>" + des + "</p>";
}

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