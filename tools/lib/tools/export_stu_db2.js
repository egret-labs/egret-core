/**
 * Created by huanghaiying on 14/11/9.
 */

var path = require("path");
var file = require("../core/file");
var fs = require("fs");
var image = require("../core/image");

var currentDir = "";

function run(currDir, args, opts) {
    if (args[0]) {
        currDir = path.resolve(args[0]);
    }

    currentDir = currDir;

    linkChildren(currDir);
}

function linkChildren(fileUrl) {
    if (fileUrl.indexOf("Backup") >= 0) {
        return;
    }
    if (file.isDirectory(fileUrl)) {
        var fileList = file.getDirectoryListing(fileUrl, true);

        for (var key in fileList) {
            var fileName = fileList[key];

            var tempFileUrl = path.join(fileUrl, fileName);
            linkChildren(tempFileUrl);
        }
        return;
    }

    try {
        var stuStr = file.read(fileUrl);
        var stuData = JSON.parse(stuStr);

        if (stuData["armature_data"] == null || stuData["animation_data"] == null) {
            return;
        }
    }
    catch (e) {

        return;
    }

    bones = {};
    resultArr = [];
    layersInfo = {};


    var relativeUrl = fileUrl.replace(currentDir, "");

    var filePathArr = relativeUrl.split("/");
    filePathArr.splice(filePathArr.length - 2, 1);
    filePathArr[filePathArr.length - 1] = filePathArr[filePathArr.length - 3] + "_" + filePathArr[filePathArr.length - 2];

    var dbData = {"isGlobal": 0, "armature": [], "version": 2.3, "name": filePathArr[filePathArr.length - 1], "frameRate": 60};
    dbData["textureScale"] = stuData["content_scale"] != null ? stuData["content_scale"] : 1;

    for (var i = 0; i < stuData["animation_data"].length; i++) {
        var stuAnimation = stuData["animation_data"][i];
        var stuArmature = stuData["armature_data"][i];

        var dbArmature = {"bone": [], "skin": [], "animation": []};
        dbData["armature"].push(dbArmature);

        //设置name
        dbArmature["name"] = filePathArr[filePathArr.length - 1];//stuArmature["name"];

        //设置bone
        setBone(dbArmature["bone"], stuArmature["bone_data"],dbData);

        //设置skin
        var skin = {"name": 0, "slot": []};
        dbArmature["skin"].push(skin);
        setSlot(skin["slot"], stuArmature["bone_data"], dbData);

        //设置动画
        setAnimation(dbArmature["animation"], stuAnimation["mov_data"],dbData);
    }
    removeDefault(dbArmature);

    var skeUrl = path.join(currentDir, "..", "animations", filePathArr.join("/") + "_ske.json");
    file.save(skeUrl, JSON.stringify(dbData, null, 0));

    console.log(fileUrl + "生成完毕");

}

var layersInfo = {};
function setLayer(name, parent) {
    if (layersInfo[name] == null) {
        layersInfo[name] = [];
    }

    if (parent != null && parent != "") {
        if (layersInfo[parent] == null) {
            layersInfo[parent] = [];
        }

        layersInfo[parent].push(name);
    }
}

var resultArr = [];
function resortLayers() {
    var tempArr = [];
    for (var name in layersInfo) {
        tempArr.push({"name": name, "children": layersInfo[name].concat([])});
    }

    while (tempArr.length > 0) {
        for (var i = tempArr.length - 1; i >= 0; i--) {
            var info = tempArr[i];
            if (info["children"].length == 0) {
                resultArr.push(info["name"]);

                tempArr.splice(i, 1);

                for (var j = 0; j < tempArr.length; j++) {
                    var temp = tempArr[j];
                    if (temp["children"].indexOf(info["name"]) >= 0) {
                        var idx = temp["children"].indexOf(info["name"]);
                        temp["children"].splice(idx, 1);
                    }
                }
            }
        }
    }

    resultArr.reverse();

}

function radianToAngle(radian) {
    return radian * 180 / Math.PI;
}

function addToArrayObj(arrayObj, index, obj) {
    if (arrayObj[index] == null) {
        arrayObj[index] = [];
    }
    arrayObj[index].push(obj);
}

function sortArrayObj(arrayObj, resultArray) {
    var maxIdx = 0;
    for (var key in arrayObj) {
        maxIdx = Math.max(key, maxIdx);
    }

    for (var i = 0; i <= maxIdx; i++) {
        if (arrayObj[i] == null) {
            continue;
        }

        for (var j = 0; j < arrayObj[i].length; j++) {
            resultArray.push(arrayObj[i][j]);

        }
    }
}

var bones = {};
function setBone(dbBones, stuBones, dbData) {
    var tempDbBones = {};
    for (var i = 0; i < stuBones.length; i++) {
        var stuBone = stuBones[i];
        var dbBone = {"transform": {}};

        addToArrayObj(tempDbBones, stuBone["z"], dbBone);

        dbBone["name"] = stuBone["name"];

        if (stuBone["parent"] != null && stuBone["parent"] != "") {
            dbBone["parent"] = stuBone["parent"];
        }

        setLayer(stuBone["name"], stuBone["parent"]);

        dbBone["transform"]["x"] = stuBone["x"]*dbData["textureScale"];
        dbBone["transform"]["y"] = -stuBone["y"]*dbData["textureScale"];
        dbBone["transform"]["skX"] = radianToAngle(stuBone["kX"]);
        dbBone["transform"]["skY"] = -radianToAngle(stuBone["kY"]);
        dbBone["transform"]["scX"] = stuBone["cX"];
        dbBone["transform"]["scY"] = stuBone["cY"];

        bones[stuBone["name"]] = dbBone;
    }

    sortArrayObj(tempDbBones, dbBones);
    for (var i = 0; i < dbBones.length; i++) {
        //todo
        dbBones[i]["z"] = i;
    }

    resortLayers();
}

function setSlot(dbSlots, stuSlots, dbData) {
    var tempDbSlots = {};
    for (var i = 0; i < stuSlots.length; i++) {
        var stuSlot = stuSlots[i];

        var dbSlot = {};
        addToArrayObj(tempDbSlots, bones[stuSlot["name"]]["z"], dbSlot);

        dbSlot["blendMode"] = "normal";
        dbSlot["z"] = bones[stuSlot["name"]]["z"];
        dbSlot["name"] = stuSlot["name"];
        dbSlot["parent"] = stuSlot["name"];

        dbSlot["display"] = [];

        setDisplay(dbSlot["display"], stuSlot["display_data"], dbData);
    }

    sortArrayObj(tempDbSlots, dbSlots);

    for (var i = 0; i < dbSlots.length; i++) {
        dbSlots[i]["z"] = i;
    }

}

function setDisplay(dbDisplays, stuDisplays, dbData) {
    for (var i = 0; stuDisplays && i < stuDisplays.length; i++) {
        var stuDisplay = stuDisplays[i];

        var dbDisplay = {"transform": {}};
        dbDisplays.push(dbDisplay);

        dbDisplay["name"] = stuDisplay["name"].replace(/(\.png)|(\.jpg)/, "");
        dbDisplay["type"] = stuDisplay["displayType"] == 0 ? "image" : "image";
        dbDisplay["transform"]["x"] = stuDisplay["skin_data"][0]["x"]*dbData["textureScale"];
        dbDisplay["transform"]["y"] = -stuDisplay["skin_data"][0]["y"]*dbData["textureScale"];
        dbDisplay["transform"]["pX"] = 0.5;
        dbDisplay["transform"]["pY"] = 0.5;
        dbDisplay["transform"]["skX"] = radianToAngle(stuDisplay["skin_data"][0]["kX"]);
        dbDisplay["transform"]["skY"] = -radianToAngle(stuDisplay["skin_data"][0]["kY"]);
        dbDisplay["transform"]["scX"] = stuDisplay["skin_data"][0]["cX"];
        dbDisplay["transform"]["scY"] = stuDisplay["skin_data"][0]["cY"];
    }
}

function setAnimation(dbAnimations, stuAnimations,dbData) {
    for (var i = 0; i < stuAnimations.length; i++) {
        var stuAnimation = stuAnimations[i];

        var dbAnimation = {};
        dbAnimations.push(dbAnimation);

        dbAnimation["duration"] = stuAnimation["dr"];
        dbAnimation["name"] = stuAnimation["name"];
        dbAnimation["fadeInTime"] = 0;
        dbAnimation["tweenEasing"] = stuAnimation["twE"];
        dbAnimation["loop"] = stuAnimation["lp"] == true ? 0 : 1;
        dbAnimation["scale"] = 1.0 / stuAnimation["sc"];

        dbAnimation["timeline"] = [];
        setTimeline(dbAnimation["timeline"], stuAnimation["mov_bone_data"],dbData);
    }
}

var timelines = {};
var count = 0;
function setTimeline(dbTimelines, stuTimelines,dbData) {
    count++;
    var tempDbTimelines = {};

    timelines = {};
    var maxIdx = 0;
    for (var i = 0; i < stuTimelines.length; i++) {
        var stuTimeline = stuTimelines[i];

        var dbTimeline = {};
        dbTimeline["name"] = stuTimeline["name"];

        addToArrayObj(tempDbTimelines, bones[stuTimeline["name"]]["z"], dbTimeline);
        dbTimeline["offset"] = 0;

        dbTimeline["frame"] = [];

        timelines[dbTimeline["name"]] = dbTimeline;

        dbTimeline["pX"] = 0;
        dbTimeline["pY"] = 0;
        setFrame(dbTimeline["frame"], stuTimeline["frame_data"], bones[dbTimeline["name"]], i,dbData);
    }

    sortArrayObj(tempDbTimelines, dbTimelines);

    //设置层级
    for (var i = 0; i < dbTimelines.length; i++) {
        var frames = dbTimelines[i]["frame"];
        for (var k = 0; k < frames.length; k++) {
            frames[k]["z"] = i;
        }
    }
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


function setFrame(dbFrames, stuFrames, bone, z,dbData) {

    for (var i = 0; i < stuFrames.length; i++) {
        var stuFrame = stuFrames[i];
        var dbFrame = {};

        if (i == 0) {
            var startIdx = stuFrame["fi"];

            if (startIdx != 0) {
                var temp = {"duration": startIdx, "displayIndex": -1};
                dbFrames.push(temp);
            }
        }

        if (stuFrame["dI"] < 0) {
            dbFrame["hide"] = 1;
        }
        else if (stuFrame["dI"] > 0) {
            dbFrame["displayIndex"] = stuFrame["dI"];
        }
//        else if (stuFrame["dI"] < -900) {
//            dbFrame["hide"] = 1;
//        }


        if (stuFrame["tweenFrame"] == false) {
            dbFrame["tweenEasing"] = "NaN";
        }

        dbFrames.push(dbFrame);
        if (i < stuFrames.length - 1) {
            var nextFrame = stuFrames[i + 1];
            dbFrame["duration"] = nextFrame["fi"] - stuFrame["fi"];
        }
        else {
            dbFrame["duration"] = 1;
        }

        if (stuFrame["evt"]) {
            dbFrame["event"] = stuFrame["evt"];
        }

        dbFrame["z"] = z;

        if (stuFrame["bd_src"] == 700 && stuFrame["bd_dst"] == 1) {
            dbFrame["blendMode"] = "add";
        }

        if (stuFrame["color"]) {
            dbFrame["colorTransform"] = {};
            dbFrame["colorTransform"]["aO"] = 0;
            dbFrame["colorTransform"]["rO"] = 0;
            dbFrame["colorTransform"]["gO"] = 0;
            dbFrame["colorTransform"]["bO"] = 0;
            dbFrame["colorTransform"]["aM"] = 100 * stuFrame["color"]["a"] / 255;
            dbFrame["colorTransform"]["rM"] = 100 * stuFrame["color"]["r"] / 255;
            dbFrame["colorTransform"]["gM"] = 100 * stuFrame["color"]["g"] / 255;
            dbFrame["colorTransform"]["bM"] = 100 * stuFrame["color"]["b"] / 255;
        }

        dbFrame["transform"] = {};
        dbFrame["transform"]["x"] = stuFrame["x"]*dbData["textureScale"];
        dbFrame["transform"]["y"] = -stuFrame["y"]*dbData["textureScale"];
        dbFrame["transform"]["scX"] = (stuFrame["cX"] + bone["transform"]["scX"] - 1) / bone["transform"]["scX"];
        dbFrame["transform"]["scY"] = (stuFrame["cY"] + bone["transform"]["scY"] - 1) / bone["transform"]["scY"];
        dbFrame["transform"]["skX"] = radianToAngle(stuFrame["kX"]);
        dbFrame["transform"]["skY"] = -radianToAngle(stuFrame["kY"]);
    }
}

var defaultProperty = {
    "x": 0,
    "y": 0,
    "scX": 1,
    "scY": 1,
    "skX": 0,
    "skY": 0,
    "pX": 0,
    "pY": 0,
    "z": 0,
    "scale": 0,
    "offset": 0,
    "loop": 1,
    "fadeInTime": 0,
    "aO": 0,
    "rO": 0,
    "gO": 0,
    "bO": 0,
    "aM": 100,
    "rM": 100,
    "gM": 100,
    "bM": 100,
    "textureScale":1
}

function removeDefault(obj, parent, parentKey) {
    for (var key in obj) {
        if (obj[key] instanceof Array) {
            if (obj[key].length > 0) {
                removeDefault(obj[key]);
            }
        }
        else if (obj[key] instanceof Object) {//
            removeDefault(obj[key], obj, key);
        }
        else {
            if (defaultProperty[key] != null && obj[key] == defaultProperty[key]) {
                delete obj[key];
            }
            else {
                if (typeof(obj[key]) == "number") {
                    obj[key] = Number(obj[key].toFixed(4));
                }
            }
        }
    }

    if (obj instanceof Object) {//
        var hasKey = false;
        for (var key in obj) {
            hasKey = true;
            break;
        }

        if (!hasKey) {
            console.log(parentKey)
            delete parent[parentKey];
        }
    }
}

var Matrix = function () {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
}
Matrix.DEG_TO_RAD = Math.PI / 180;
Matrix.prototype.prependTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
    if (rotation % 360) {
        var r = rotation * Matrix.DEG_TO_RAD;
        var cos = Math.cos(r);
        var sin = Math.sin(r);
    } else {
        cos = 1;
        sin = 0;
    }

    if (regX || regY) {
        // append the registration offset:
        this.tx -= regX;
        this.ty -= regY;
    }
    if (skewX || skewY) {
        // TODO: can this be combined into a single prepend operation?
        skewX *= Matrix.DEG_TO_RAD;
        skewY *= Matrix.DEG_TO_RAD;
        this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
    } else {
        this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
    }
    return this;
};

Matrix.prototype.prepend = function (a, b, c, d, tx, ty) {
    var tx1 = this.tx;
    if (a != 1 || b != 0 || c != 0 || d != 1) {
        var a1 = this.a;
        var c1 = this.c;
        this.a = a1 * a + this.b * c;
        this.b = a1 * b + this.b * d;
        this.c = c1 * a + this.d * c;
        this.d = c1 * b + this.d * d;
    }
    this.tx = tx1 * a + this.ty * c + tx;
    this.ty = tx1 * b + this.ty * d + ty;
    return this;
};


Matrix.prototype.append = function (a, b, c, d, tx, ty) {
    var tx1 = this.tx;
    if (a != 1 || b != 0 || c != 0 || d != 1) {
        var a1 = this.a;
        var c1 = this.c;
        this.a = a1 * a + this.b * c;
        this.b = a1 * b + this.b * d;
        this.c = c1 * a + this.d * c;
        this.d = c1 * b + this.d * d;
    }
    this.tx = tx1 * a + this.ty * c + tx;
    this.ty = tx1 * b + this.ty * d + ty;
    return this;
};

function linkChildren(fileUrl) {
    if (fileUrl.indexOf("Backup") >= 0) {
        return;
    }
    if (file.isDirectory(fileUrl)) {
        var fileList = file.getDirectoryListing(fileUrl, true);

        for (var key in fileList) {
            var fileName = fileList[key];

            var tempFileUrl = path.join(fileUrl, fileName);
            linkChildren(tempFileUrl);
        }
        return;
    }

    try {
        var stuStr = file.read(fileUrl);
        var stuData = JSON.parse(stuStr);

        if (stuData["armature_data"] == null || stuData["animation_data"] == null) {
            return;
        }
    }
    catch (e) {

        return;
    }

    var relativeUrl = fileUrl.replace(currentDir, "");

    var filePathArr = relativeUrl.split("/");
    filePathArr.splice(filePathArr.length - 2, 1);
    filePathArr[filePathArr.length - 1] = filePathArr[filePathArr.length - 3] + "_" + filePathArr[filePathArr.length - 2];

    var dbData = parseData(stuData, filePathArr[filePathArr.length - 1]);

    var skeUrl = path.join(currentDir, "..", "animations", filePathArr.join("/") + "_ske.json");
    file.save(skeUrl, JSON.stringify(dbData, null, 0));

    console.log(fileUrl + "生成完毕");

}


function parseData(stuData, ccaName) {
    bones = {};
    resultArr = [];
    layersInfo = {};

    var dbData = {"isGlobal": 0, "armature": [], "version": 2.3, "name": ccaName, "frameRate": 60};
    dbData["textureScale"] = stuData["content_scale"] != null ? stuData["content_scale"] : 1;

    for (var i = 0; i < stuData["animation_data"].length; i++) {
        var stuAnimation = stuData["animation_data"][i];
        var stuArmature = stuData["armature_data"][i];

        var dbArmature = {"bone": [], "skin": [], "animation": []};
        dbData["armature"].push(dbArmature);

        //设置name
        dbArmature["name"] = ccaName;

        //设置bone
        setBone(dbArmature["bone"], stuArmature["bone_data"], dbData);

        //设置skin
        var skin = {"name": 0, "slot": []};
        dbArmature["skin"].push(skin);
        setSlot(skin["slot"], stuArmature["bone_data"], dbData);

        //设置动画
        setAnimation(dbArmature["animation"], stuAnimation["mov_data"],dbData);
    }
    removeDefault(dbArmature);

    console.log(ccaName + "生成完毕");
    return dbData;
}
exports.parseData = parseData;


exports.run = run;