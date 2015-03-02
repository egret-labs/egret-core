/**
 * Created by huanghaiying on 15/2/5.
 */

var path = require("path");
var trim = require("./trim");

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
    className = trim.trimAll(className);
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

exports.screening = function (apiArr) {
    for (var i = 0; i < apiArr.length; i++) {
        _analyze(apiArr[i], [], apiArr[i]["filename"]);
    }

    //补全 extends、implements
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
            setFullType(classinfo);
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

    return tempClassArr;
};

function exclude (tempObj) {
    if (tempObj["pType"] == "private" || tempObj["pType"] == "protected") {
        return true;
    }
    if (tempObj["private"] == true) {
        return true;
    }

    if (tempObj["noDes"] == true) {
        return true;
    }
    return false;
}

function removeDefault(tempObj) {
    if (!(tempObj instanceof Object)) {
        return false;
    }

    if (exclude(tempObj)) {
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
            if (tempObj[key] && tempObj[key].class) {//类或者接口
                if (exclude(tempObj[key].class)) {
                    delete tempObj[key];
                    continue;
                }
            }

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

            initDesc(item["docs"], item["parameters"], tempClass, true);
            tempClass["classdesc"] = tempClass["description"];
            delete tempClass["description"];

            tempClass["tempExtends"] = item["extends"];

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

            initDesc(item["docs"], item["parameters"], tempClass, true);
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
            var member = {};
            if (rwType == 0) {
                rwType = 3;
            }
            else {
                member["rwType"] = rwType;
            }
            member["kind"] = "member";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = "instance";

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
            if ((member["description"] == null || member["description"] == "") && rwType == 3) {
                member["description"] = getDesc(item["get"]["docs"]) || "";
            }

            member["description"] = member["description"] || "";

            member["description"] = member["description"].replace(/^(\s)*/, "");
            member["description"] = member["description"].replace(/(\s)*$/, "");

            if (member["description"] != "") {
                //if (rwType == 1) {
                //    member["description"] += "【只读】";
                //}
                //else if (rwType == 2){
                //    member["description"] += "【只写】";
                //}
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

        for (var key in doc) {
            switch (key)  {
                case "return" :
                    obj["returns"] = {"description" : changeDescription(doc["return"])};
                    break;
                case "link" :
                    obj["exampleU"] = [];

                    var links = trim.trimAll(doc["link"]);
                    var arr = links.split("\n");
                    for (var m = 0; m < arr.length; m++) {
                        var u = arr[m];

                        var uo = {};
                        obj["exampleU"].push(uo);
                        uo["u"] = u.match(/^(\S)+/)[0];
                        uo["t"] = trim.trimAll(u.substring(uo["u"].length));
                    }

                    break;
                case "example" :
                    obj["exampleC"] = trim.trimAll(doc["example"]);
                    break;
                case "params" :
                    paramsDoc = doc["params"];
                    break;
                case "description" :
                    if (!notTrans) {
                        obj["description"] = changeDescription(doc["description"]);
                    }
                    else {
                        obj["description"] = doc["description"];
                    }
                    break;
                default :
                    obj[key] = doc[key];
            }
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
        item["link"] = trim.trimAll(orgItem["link"]);
    }

    if (orgItem["example"]) {
        item["example"] = trim.trimAll(orgItem["example"]);
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
    des = des.replace(/<br\/>/g, "\n");
    if (des == "") {
        return des;
    }

    //var arr = des.split("\n");
    //return "<p>" + arr.join("</p><p>") + "</p>";
    //return "<p>" + des + "</p>";
    return des;
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
