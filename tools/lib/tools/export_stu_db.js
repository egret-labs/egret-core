/**
 * Created by huanghaiying on 14/11/9.
 */

var path = require("path");
var plist = require('../core/plist');
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

var currentFileUrl = "";
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

    currentFileUrl = fileUrl;

    var relativeUrl = fileUrl.replace(currentDir, "");
    var fileName = file.getFileName(fileUrl);

    var filePathArr = relativeUrl.split("/");
    filePathArr.splice(filePathArr.length - 2, 1);
    filePathArr[filePathArr.length - 1] = fileName + "_" + filePathArr[filePathArr.length - 2];

    var dbData = {"armature":[], "version":2.3, "name" : filePathArr[filePathArr.length - 1], "frameRate":60};

    //先补全父子关键帧
    fillStuFrames(stuData);
    //拆分同一个bone里多个display
    chaifenBones(stuData);
    //对应拆分动画
    chaifenTimelines(stuData);

    for (var i = 0; i < stuData["animation_data"].length; i++) {
        var stuAnimation = stuData["animation_data"][i];
        var stuArmature = stuData["armature_data"][i];

        var dbArmature = {"bone":[], "skin":[], "animation":[]};
        dbData["armature"].push(dbArmature);

        //设置name
        dbArmature["name"] = filePathArr[filePathArr.length - 1];//stuArmature["name"];

        //设置bone
        setBone(dbArmature["bone"], stuArmature["bone_data"]);

        //设置skin
        var skin = {"name" : 0, "slot" : []};
        dbArmature["skin"].push(skin);
        setSlot(skin["slot"], stuArmature["bone_data"]);

        //设置动画
        setAnimation(dbArmature["animation"], stuAnimation["mov_data"]);
    }

    removeMatrix(dbData);

    moveDisplayOut(dbData);
    appendTail(dbData);

    var skeUrl = path.join(currentDir, "..", "animations", filePathArr.join("/") + "_ske.json");
    file.save(skeUrl, JSON.stringify(dbData, null, "\t"));

    moveResources(fileUrl, stuData["texture_data"]);
    console.log(fileUrl + "生成完毕");

}

function moveResources(fileUrl, resources) {
    var fileName = file.getFileName(fileUrl);
    var filePath = fileUrl.substring(0, fileUrl.lastIndexOf(fileName));

    for (var i = 0; i < resources.length; i++) {
        var name = resources[i]["name"];

        var desResourceUrl = path.join(currentDir, "..", "animations", filePath.replace(currentDir, ""), fileName, name + ".png");
        var desArr = desResourceUrl.split("/");
        desArr.splice(desArr.length - 3, 1);

        file.copy(path.join(filePath, "..", "Resources", name + ".png"), desArr.join("/"));
    }
}

//补全studio中父子骨骼的关键帧，保证最终父子骨骼的关键帧位置完全相同
function fillStuFrames(stuData) {
    for (var i = 0; i < stuData["armature_data"].length; i++) {
        var armature = stuData["armature_data"][i];
        var animation = stuData["animation_data"][i];

        fillStu(armature, animation);
    }
}

function fillStu(armature, animation) {
    var tempHasChildrenNames = {};//拥有的子节点
    var tempOwnParentNames = {};//对应父节点
    var tempSortArray = [];//父子关系，父在前
    //找出 父子关系
    for (var i = 0; i < armature["bone_data"].length; i++) {
        var bone = armature["bone_data"][i];
        if (tempHasChildrenNames[bone["name"]] == null) {
            tempHasChildrenNames[bone["name"]] = [];
        }

        if (bone["parent"] != null && bone["parent"] != "")  {
            if (tempHasChildrenNames[bone["parent"]] == null) {
                tempHasChildrenNames[bone["parent"]] = [];
            }
            tempHasChildrenNames[bone["parent"]].push(bone["name"]);

            tempOwnParentNames[bone["name"]] = bone["parent"];
        }
    }

    var tempArr = [];
    for (var name in tempHasChildrenNames) {
        tempArr.push({"name" : name, "children" : tempHasChildrenNames[name].concat([])});
    }
    while (tempArr.length > 0) {
        for (var i = tempArr.length - 1; i >= 0; i--) {
            var info = tempArr[i];
            if (info["children"].length == 0) {
                tempSortArray.push(info["name"]);
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
    tempSortArray.reverse();

    for (var i = 0; i < animation["mov_data"].length; i++) {
        fillMovData(animation["mov_data"][i], tempSortArray, tempHasChildrenNames, tempOwnParentNames);
    }
}

function fillMovData(mov_data, tempSortArray, tempHasChildrenNames, tempOwnParentNames) {
    //取出当前拥有的层级
    var tempLayers = {};
    for (var i = 0; i < mov_data["mov_bone_data"].length; i++) {
        var movBone = mov_data["mov_bone_data"][i];
        tempLayers[movBone["name"]] = movBone;
    }

    //从子往外
    for (var i = 0; i < tempSortArray.length; i++) {
        var childName = tempSortArray[tempSortArray.length - 1 - i];
        if (tempLayers[childName] == null || tempOwnParentNames[childName] == null || tempOwnParentNames[childName] == "") {
            //当前有child，并且有父节点
            continue;
        }

        var childLayer = tempLayers[childName];
        for (var j = 0; j < childLayer["frame_data"].length; j++) {
            var frameId = childLayer["frame_data"][j]["fi"];
            if (tempLayers[tempOwnParentNames[childName]]) {
                addStudioFrame(tempLayers[tempOwnParentNames[childName]]["frame_data"], frameId);
            }
        }
    }


    //从父往子
    for (var i = 0; i < tempSortArray.length; i++) {
        var parentName = tempSortArray[i];
        if (tempLayers[parentName] == null || tempHasChildrenNames[parentName] == null || tempHasChildrenNames[parentName].length <= 0) {
            continue;
        }

        var parentLayer = tempLayers[parentName];
        for (var j = 0; j < parentLayer["frame_data"].length; j++) {
            var frameId = parentLayer["frame_data"][j]["fi"];

            var childrenNames = tempHasChildrenNames[parentName];
            for (var k = 0; k < childrenNames.length; k++) {
                var childName = childrenNames[k];
                if (tempLayers[childName]) {
                    addStudioFrame(tempLayers[childName]["frame_data"], frameId);
                }
            }
        }
    }
}

function addStudioFrame(frames, frameId) {
    for (var i = 0; i < frames.length; i++) {
        var frame = frames[i];
        var tempFrameId = frame["fi"];
        if (tempFrameId == frameId) {
            return;
        }
        else if (tempFrameId < frameId) {
            continue;
        }

        var lastFrame = frames[i - 1];
        var nextFrame = frames[i];
        var midFrame = clone(lastFrame, {});
        midFrame["fi"] = frameId;

        if (i == 0) {//在最前面补齐
            frames.splice(i, 0, midFrame);
            return;
        }
        var lastFrameId = lastFrame["fi"];
        var nextFrameId = nextFrame["fi"];


        var per = (frameId - lastFrameId) / (nextFrameId - lastFrameId);
        midFrame["x"] = getProperty(lastFrame, nextFrame, "x");
        midFrame["y"] = getProperty(lastFrame, nextFrame, "y");
        midFrame["cX"] = getProperty(lastFrame, nextFrame, "cX");
        midFrame["cY"] = getProperty(lastFrame, nextFrame, "cY");
        midFrame["kX"] = getProperty(lastFrame, nextFrame, "kX");
        midFrame["kY"] = getProperty(lastFrame, nextFrame, "kY");

        if (lastFrame["color"] || nextFrame["color"]) {
            midFrame["color"] = {};

            midFrame["color"]["a"] = getProperty(lastFrame, nextFrame, ["color", "a"], 255, per);
            midFrame["color"]["r"] = getProperty(lastFrame, nextFrame, ["color", "r"], 255, per);
            midFrame["color"]["g"] = getProperty(lastFrame, nextFrame, ["color", "g"], 255, per);
            midFrame["color"]["b"] = getProperty(lastFrame, nextFrame, ["color", "b"], 255, per);
        }

        frames.splice(i, 0, midFrame);
        return;
    }

    //最后加上
    var lastFrame = frames[frames.length - 1];
    var midFrame = clone(lastFrame, {});
    if (midFrame == null) {
        console.log(frames)
    }
    midFrame["fi"] = frameId;

    frames.push(midFrame);
}


//拆分同一个bone有多个display
function chaifenTimelines(stuData) {
    //拆分animation
    for (var i = 0; i < stuData["animation_data"].length; i++) {
        var animation = stuData["animation_data"][i];
        for (var j = 0; j < animation["mov_data"].length; j++) {
            var mov = animation["mov_data"][j];

            var movBones = mov["mov_bone_data"];
            var tempBones = {};
            for (var k = 0; k < movBones.length; k++) {
                var moveBone = movBones[k];

                var lastFrameId = -1;
                for (var m = 0; m < moveBone["frame_data"].length; m++) {
                    var frame = moveBone["frame_data"][m];

                    var currentFrameId = 0;
                    if (frame["dI"] > 0) {
                        currentFrameId = frame["dI"];
                    }

                    var currentName = "egret_" + currentFrameId + "_" + moveBone["name"];
                    if (tempBones[currentName] == null) {
                        var tempBone = clone(moveBone, {});
                        tempBone["frame_data"] = [];
                        tempBone["name"] = currentName;
                        tempBones[currentName] = tempBone;
                    }

                    var useFrame = clone(frame, {});
                    tempBones[currentName]["frame_data"].push(useFrame);

                    if (lastFrameId != -1 && lastFrameId != currentFrameId) {
                        var lastLayerFrame = clone(frame, {});
                        lastLayerFrame["dI"] = -1000;
                        var lastName = "egret_" + lastFrameId + "_" + moveBone["name"];
                        tempBones[lastName]["frame_data"].push(lastLayerFrame);
                    }

                    if (currentFrameId != 0 && lastFrameId != 0) {
                        var layerFrame = clone(frame, {});
                        layerFrame["dI"] = -1000;
                        var zName = "egret_0_" + moveBone["name"];
                        if (tempBones[zName] == null) {
                            var zBone = clone(moveBone, {});
                            zBone["frame_data"] = [];
                            zBone["name"] = zName;
                            tempBones[zName] = zBone;
                        }
                        tempBones[zName]["frame_data"].push(layerFrame);
                    }

                    lastFrameId = currentFrameId;
                }

            }

            mov["mov_bone_data"] = [];
            for (var key in tempBones) {
                mov["mov_bone_data"].push(tempBones[key]);
            }
        }

    }
}

//拆分同一个bone有多个display
function chaifenBones(stuData) {
    //拆分armature
    for (var i = 0; i < stuData["armature_data"].length; i++) {
        var armature = stuData["armature_data"][i];

        var stuBones = armature["bone_data"];
        var tempBones = [];
        for (var j = 0; j < stuBones.length; j++) {
            var bone = stuBones[j];

            for (var k = 0; k < bone["display_data"].length; k++) {
                var tempBone = clone(bone, {});
                tempBone["name"] = "egret_" + k + "_" + tempBone["name"];
                leftArrayByIndex(tempBone["display_data"], k);
                if (tempBone["parent"] != null && tempBone["parent"] != "") {
                    tempBone["parent"] = "egret_0_" + tempBone["parent"];
                }
                tempBones.push(tempBone);
            }
        }
        armature["bone_data"] = tempBones;
    }
}

function leftArrayByIndex(array, index) {
    if (index > 0) {
        array.splice(0, index);
    }

    if (array.length > 1) {
        array.splice(1, array.length - 1);
    }
}

function appendTail(dbData) {
    for (var i = 0; i < dbData["armature"].length; i++) {
        var armature = dbData["armature"][i];
        for (var j = 0; j < armature["animation"].length; j++) {
            var animation = armature["animation"][j];
            var totalDuration = animation["duration"];

            for (var k = 0; k < animation["timeline"].length; k++) {
                var timeline = animation["timeline"][k];

                var tempDuration = 0;
                for (var m = 0; m < timeline["frame"].length; m++) {
                    var frame = timeline["frame"][m];
                    tempDuration += frame["duration"];
                }
                if (tempDuration < totalDuration) {
                    var lastFrame = timeline["frame"][m - 1];
                    if (lastFrame["displayIndex"] != -1) {
                        timeline["frame"].push({"displayIndex": -1, "duration":totalDuration - tempDuration});
                    }
                }
            }
        }
    }

}

function getSlotTransform(dbData, slotName, displayIndex) {
    for (var i = 0; i < dbData["armature"].length; i++) {
        var armature = dbData["armature"][i];
        for (var j = 0; j < armature["skin"].length; j++) {
            var skin = armature["skin"][j];
            for (var k = 0; k < skin["slot"].length; k++) {
                var slot = skin["slot"][k];
                if (slot["name"] != slotName) {
                    continue;
                }

                var displayLen = slot["display"].length;
                if (displayIndex >= displayLen) {
                    return slot["display"][displayLen - 1]["transform"];
                }

                return slot["display"][displayIndex]["transform"];
            }
        }
    }
    return null;
}

function getTransformsMatrix(transforms) {
    var matrix = new Matrix();
    for (var i = 0; i < transforms.length; i++) {
        var transfrom = transforms[i];
        matrix.prependTransform(transfrom["x"], transfrom["y"], transfrom["scX"], transfrom["scY"], 0, transfrom["skX"], transfrom["skY"], 0, 0);
    }
    matrix.append(1, 0, 0, 1, 0, 0);
    return matrix;
}

function moveDisplayOut(dbData) {
    for (var i = 0; i < dbData["armature"].length; i++) {
        var armature = dbData["armature"][i];
        for (var j = 0; j < armature["animation"].length; j++) {
            var animation = armature["animation"][j];
            for (var k = 0; k < animation["timeline"].length; k++) {
                var timeline = animation["timeline"][k];
                for (var m = 0; m < timeline["frame"].length; m++) {
                    var frame = timeline["frame"][m];

                    if (frame["displayIndex"] == null || frame["displayIndex"] >= 0) {
                        var parentTransform = frame["transform"];
                        var childTransform = getSlotTransform(dbData, timeline["name"], frame["displayIndex"] || 0);

                        var matrix = getTransformsMatrix([childTransform, parentTransform]);

                        parentTransform["x"] = matrix.tx;
                        parentTransform["y"] = matrix.ty;
                        parentTransform["skX"] += childTransform["skX"] * (parentTransform["scY"] / Math.abs(parentTransform["scY"]));
                        parentTransform["skY"] += childTransform["skY"] * (parentTransform["scY"] / Math.abs(parentTransform["scY"]));
                        parentTransform["scX"] *= childTransform["scX"];
                        parentTransform["scY"] *= childTransform["scY"];
                    }
                }
            }
        }
    }

    for (var i = 0; i < dbData["armature"].length; i++) {
        var armature = dbData["armature"][i];
        for (var j = 0; j < armature["skin"].length; j++) {
            var skin = armature["skin"][j];
            for (var k = 0; k < skin["slot"].length; k++) {
                var slot = skin["slot"][k];
                for (var m = 0; m < slot["display"].length; m++) {
                    var display = slot["display"][m];
                    display["transform"]["x"] = 0;
                    display["transform"]["y"] = 0;
                    display["transform"]["scX"] = 1;
                    display["transform"]["scY"] = 1;
                    display["transform"]["skX"] = 0;
                    display["transform"]["skY"] = 0;
                }
            }
        }
    }
}


function removeMatrix(data) {
    for (var key in data) {
        if (key == "matrix") {
            delete data[key];
        }
        else if (data[key] instanceof Object) {
            removeMatrix(data[key]);
        }
    }
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
        tempArr.push({"name" : name, "children" : layersInfo[name].concat([])});
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
function setBone(dbBones, stuBones) {

    var maxIdx = 0;
    //层级父子数组

    var tempDbBones = {};
    for (var i = 0; i < stuBones.length; i++) {
        var stuBone = stuBones[i];
        var dbBone = {"transform":{}};

        addToArrayObj(tempDbBones, stuBone["z"], dbBone);

        dbBone["name"] = stuBone["name"];

        if (stuBone["parent"] != null && stuBone["parent"] != "") {
            dbBone["parent"] = stuBone["parent"];
        }

        setLayer(stuBone["name"], stuBone["parent"]);

        dbBone["transform"]["x"] = stuBone["x"];
        dbBone["transform"]["y"] = -stuBone["y"];
        dbBone["transform"]["skX"] = radianToAngle(stuBone["kX"]);
        dbBone["transform"]["skY"] = -radianToAngle(stuBone["kY"]);
        dbBone["transform"]["scX"] = stuBone["cX"];
        dbBone["transform"]["scY"] = stuBone["cY"];

        dbBone["matrix"] = [dbBone["transform"]["x"], dbBone["transform"]["y"],
            dbBone["transform"]["scX"], dbBone["transform"]["scY"],
            0, dbBone["transform"]["skX"], dbBone["transform"]["skY"], 0, 0];

        bones[stuBone["name"]] = dbBone;
    }

    sortArrayObj(tempDbBones, dbBones);
    for (var i = 0; i < dbBones.length; i++) {
        dbBones[i]["z"] = i;
    }

    resortLayers();

    for (var i = 0; i < resultArr.length; i++) {
        var nodeName = resultArr[i];

        var bone = bones[nodeName];

        if (bone["parent"] == null) {
            continue;
        }

        var matrix = new Matrix();
        var o = bone;
        while (o != null) {
            var temp = o["matrix"];
            matrix.prependTransform(temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], 0, 0);

            if (o["parent"] != null) {
                o = bones[o["parent"]];
            }
            else {
                break;
            }
        }
        matrix.append(1, 0, 0, 1, 0, 0);

        var parentBone = bones[bone["parent"]];
        bone["transform"]["x"] = matrix["tx"];
        bone["transform"]["y"] = matrix["ty"];
        bone["transform"]["scX"] *= parentBone["transform"]["scX"];
        bone["transform"]["scY"] *= parentBone["transform"]["scY"];
        bone["transform"]["skX"] += parentBone["transform"]["skX"];
        bone["transform"]["skY"] += parentBone["transform"]["skY"];
    }
}

function setSlot(dbSlots, stuSlots) {
    var maxIdx = 0;

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

        setDisplay(dbSlot["display"], stuSlot["display_data"]);
    }


    sortArrayObj(tempDbSlots, dbSlots);

    for (var i = 0; i < dbSlots.length; i++) {
        dbSlots[i]["z"] = i;
    }

}

function setDisplay(dbDisplays, stuDisplays) {
    for (var i = 0; i < stuDisplays.length; i++) {
        var stuDisplay = stuDisplays[i];

        var dbDisplay = {"transform":{}};
        dbDisplays.push(dbDisplay);


        var fileName = file.getFileName(currentFileUrl);
        var currentPath = currentFileUrl.substring(0, currentFileUrl.lastIndexOf(fileName));
        var picUrl = path.join(currentPath, "..", "Resources", stuDisplay["name"]);
        var fileData = fs.readFileSync(picUrl);
        var info = image.getInfo(fileData);

        dbDisplay["name"] = stuDisplay["name"].replace(/(\.png)|(\.jpg)/, "");
        dbDisplay["type"] = stuDisplay["displayType"] == 0 ? "image" : "image";
        dbDisplay["transform"]["x"] = stuDisplay["skin_data"][0]["x"];
        dbDisplay["transform"]["y"] = -stuDisplay["skin_data"][0]["y"];
        dbDisplay["transform"]["pX"] = info.width / 2;
        dbDisplay["transform"]["pY"] = info.height / 2;
        dbDisplay["transform"]["skX"] = radianToAngle(stuDisplay["skin_data"][0]["kX"]);
        dbDisplay["transform"]["skY"] = -radianToAngle(stuDisplay["skin_data"][0]["kY"]);
        dbDisplay["transform"]["scX"] = stuDisplay["skin_data"][0]["cX"];
        dbDisplay["transform"]["scY"] = stuDisplay["skin_data"][0]["cY"];
    }
}

function setAnimation(dbAnimations, stuAnimations) {
    for (var i = 0; i < stuAnimations.length; i++) {
        var stuAnimation = stuAnimations[i];

        var dbAnimation = {};
        dbAnimations.push(dbAnimation);

        dbAnimation["scale"] = 1;
        dbAnimation["duration"] = stuAnimation["dr"];
        dbAnimation["name"] = stuAnimation["name"];
        dbAnimation["fadeInTime"] = 0;
        //dbAnimation["tweenEasing"] = stuAnimation["twE"];
        dbAnimation["loop"] = stuAnimation["lp"] == true ? 0 : 1;

        dbAnimation["timeline"] = [];
        setTimeline(dbAnimation["timeline"], stuAnimation["mov_bone_data"]);
    }
}

var timelines = {};
var count = 0;
function setTimeline(dbTimelines, stuTimelines) {
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
        dbTimeline["scale"] = 1;

        dbTimeline["frame"] = [];

        timelines[dbTimeline["name"]] = dbTimeline;

        setFrame(dbTimeline["frame"], stuTimeline["frame_data"], bones[dbTimeline["name"]], i);
    }

    sortArrayObj(tempDbTimelines, dbTimelines);

    //设置层级
    for (var i = 0; i < dbTimelines.length; i++) {
        var frames = dbTimelines[i]["frame"];
        for (var k = 0; k < frames.length; k++) {
            frames[k]["z"] = i;
        }
    }

//    //从子往外加帧
//    for (var i = 0; i < resultArr.length; i++) {
//        var childName = resultArr[resultArr.length - 1 - i];
//        if (timelines[childName] == null) {
//            continue;
//        }
//
//        if (bones[childName]["parent"]) {//存在父节点
//            if (timelines[bones[childName]["parent"]] == null) {
//                continue;
//            }
//
//            var pFrames = timelines[bones[childName]["parent"]]["frame"];
//            var cFrames = timelines[childName]["frame"];
//
//            var tempFrameId = 0;
//            for (var j = 0; j < cFrames.length; j++) {
//                var cFrame = cFrames[j];
//                addFrame(pFrames, tempFrameId);
//                tempFrameId += cFrame["duration"];
//            }
//        }
//    }
//
//    //从父往外加帧
//    for (var i = 0; i < resultArr.length; i++) {
//        var pName = resultArr[i];
//        var children = layersInfo[pName];
//        var tempFrameId = 0;
//        if (timelines[pName] == null) {
//            continue;
//        }
//
//        var pFrames = timelines[pName]["frame"];
//        for (var j = 0; j < pFrames.length; j++) {
//            var pFrame = pFrames[j];
//            for (var k = 0; k < children.length; k++) {
//                if (timelines[children[k]] == null) {
//                    continue;
//                }
//                var cFrames = timelines[children[k]]["frame"];
//                addFrame(cFrames, tempFrameId);
//            }
//            tempFrameId += pFrame["duration"];
//        }
//    }

    //
    for (var i = 0; i < resultArr.length; i++) {
        var name = resultArr[i];
        var bone = bones[name];

            var timeline = timelines[name];
            if (timeline == null) {
                continue;
            }
            var frameId = 0;

            for (var j = 0; j < timeline["frame"].length; j++) {
                var tempFrame = timeline["frame"][j];

                if (tempFrame["displayIndex"] != -1) {
                    var matrix = new Matrix();
                    var o = tempFrame;
                    var tempName = name;
                    while (o != null) {
                        var temp = o["matrix"];
                        matrix.prependTransform(temp[0], temp[1], temp[2], temp[3], temp[4], temp[5], temp[6], 0, 0);

                        if (bones[tempName]["parent"] != null) {
                            o = getParentFrame(bones[tempName]["parent"], frameId);
                            if (o == null) {
                                break;
                            }
                            tempName = bones[tempName]["parent"];
                        }
                        else {
                            break;
                        }
                    }
                    matrix.append(1, 0, 0, 1, 0, 0);
                    tempFrame["transform"]["x"] = matrix["tx"];
                    tempFrame["transform"]["y"] = matrix["ty"];
                    tempFrame["transform"]["pX"] = 0.5;
                    tempFrame["transform"]["pY"] = 0.5;

                    if (bone["parent"] == null) {
                        tempFrame["transform"]["scX"] = tempFrame["matrix"][2];
                        tempFrame["transform"]["scY"] = tempFrame["matrix"][3];
                        tempFrame["transform"]["skX"] = tempFrame["matrix"][5];
                        tempFrame["transform"]["skY"] = tempFrame["matrix"][6];
                    }
                    else {
                        var dbParentFrame = getParentFrame(bone["parent"], frameId);
                        if (dbParentFrame) {
                            tempFrame["transform"]["scX"] = tempFrame["matrix"][2] * dbParentFrame["transform"]["scX"];
                            tempFrame["transform"]["scY"] = tempFrame["matrix"][3] * dbParentFrame["transform"]["scY"];
                            tempFrame["transform"]["skX"] = tempFrame["matrix"][5] + dbParentFrame["transform"]["skX"];
                            tempFrame["transform"]["skY"] = tempFrame["matrix"][6] + dbParentFrame["transform"]["skY"];
                        }
                        else {
                            tempFrame["transform"]["scX"] = tempFrame["matrix"][2];
                            tempFrame["transform"]["scY"] = tempFrame["matrix"][3];
                            tempFrame["transform"]["skX"] = tempFrame["matrix"][5];
                            tempFrame["transform"]["skY"] = tempFrame["matrix"][6];
                        }
                    }
                }

                frameId += tempFrame["duration"];
            }
    }

}

function addFrame(frames, frameId) {
    var tempFrameId = 0;
    for (var i = 0; i < frames.length; i++) {
        var frame = frames[i];
        if (tempFrameId == frameId) {
            return;
        }
        else if (tempFrameId < frameId) {
            tempFrameId += frame["duration"];
            continue;
        }

        var lastFrame = frames[i - 1];
        var nextFrame = frames[i];
        var midFrame = clone(lastFrame, {});

        var lastDu = frameId - (tempFrameId - lastFrame["duration"]);
        var midDu = lastFrame["duration"] - lastDu;
        lastFrame["duration"] = lastDu;
        midFrame["duration"] = midDu;
        delete midFrame["event"];

        var per = lastDu / (lastDu + midDu);

        if (lastFrame["displayIndex"] == -1 || nextFrame["displayIndex"] == -1) {

        }
        else {
            if (lastFrame["colorTransform"] || nextFrame["colorTransform"]) {
                midFrame["colorTransform"] = {};

                midFrame["colorTransform"]["aM"] = getProperty(lastDu, nextFrame, ["colorTransform", "aM"], 255, per);
                midFrame["colorTransform"]["rM"] = getProperty(lastDu, nextFrame, ["colorTransform", "rM"], 255, per);
                midFrame["colorTransform"]["gM"] = getProperty(lastDu, nextFrame, ["colorTransform", "gM"], 255, per);
                midFrame["colorTransform"]["bM"] = getProperty(lastDu, nextFrame, ["colorTransform", "bM"], 255, per);
                midFrame["colorTransform"]["aM"] = 0;
                midFrame["colorTransform"]["rM"] = 0;
                midFrame["colorTransform"]["gM"] = 0;
                midFrame["colorTransform"]["bM"] = 0;
            }

            midFrame["matrix"] = getMatrix(lastFrame["matrix"], nextFrame["matrix"], per);
        }
        frames.splice(i, 0, midFrame);
        return;
    }

    var lastFrame = frames[frames.length - 1];
    var midFrame = clone(lastFrame, {});
    lastFrame["duration"] = frameId - (tempFrameId - 1);
    delete midFrame["event"];

    frames.push(midFrame);
}

function getMatrix(array1, array2, per) {
    var array = [];
    for (var i = 0; i < array1.length; i++) {
        array.push(array1[i] + (array2[i] - array1[i]) * per);
    }
    return array;
}

function getProperty(last, next, keys, devalue, per) {
    var lastObj = last;
    for (var i = 0; i < keys.length; i++) {
        if (lastObj[keys[i]] == null) {
            lastObj = devalue;
            break;
        }
        lastObj = lastObj[keys[i]];
    }

    var nextObj = next;
    for (var i = 0; i < keys.length; i++) {
        if (nextObj[keys[i]] == null) {
            nextObj = devalue;
            break;
        }
        nextObj = nextObj[keys[i]];
    }

    return lastObj + (nextObj - lastObj) * per;
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

function getParentFrame(parent, frameId) {
    var timeline = timelines[parent];
    if (timeline == null) {
        return null;
    }

    var tempFrameId = 0;
    for (var i = 0; i < timeline["frame"].length; i++) {
        if (tempFrameId >= frameId) {
            return timeline["frame"][i];
        }
        tempFrameId += timeline["frame"][i]["duration"];
    }

    return {};
}

function setFrame(dbFrames, stuFrames, bone, z) {

    for (var i = 0; i < stuFrames.length; i++) {
        var stuFrame = stuFrames[i];
        var dbFrame = {};

        if (i == 0) {
            var startIdx = stuFrame["fi"];

            if (startIdx != 0) {
                var temp = {"duration" : startIdx, "displayIndex" : -1};
                dbFrames.push(temp);
            }
        }

        if (stuFrame["dI"] == -1) {
            //dbFrame["displayIndex"] = 0;
            dbFrame["hide"] = 1;
        }

        if (stuFrame["dI"] > 0) {
            dbFrame["displayIndex"] = stuFrame["dI"];
        }
        else if (stuFrame["dI"] == -1000) {
            //dbFrame["displayIndex"] = 0;
            dbFrame["hide"] = 1;
        }


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


        dbFrame["z"] = z;//stuFrame["z"];
        //dbFrame["tweenEasing"] = stuFrame["twE"];

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

        var matrix = bone["matrix"];
        dbFrame["matrix"] = [stuFrame["x"] + matrix[0],
                             -stuFrame["y"] + matrix[1],
                stuFrame["cX"] * matrix[2],
                stuFrame["cY"] * matrix[3],
                             0,
                radianToAngle(stuFrame["kX"]) + matrix[5],
                -radianToAngle(stuFrame["kY"]) + matrix[6], 0, 0];

    }
}


var Matrix = function(){
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





exports.run = run;