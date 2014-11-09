/**
 * Created by huanghaiying on 14/11/9.
 */

var path = require("path");
var plist = require('../core/plist');
var file = require("../core/file");

function run(currDir, args, opts) {
    if (args[0]) {
        currDir = path.resolve(args[0]);
    }
    linkChildren(currDir);
}


function linkChildren(fileUrl) {
    if (file.isDirectory(fileUrl)) {
        var fileList = file.getDirectoryListing(fileUrl, true);

        for (var key in fileList) {
            var fileName = fileList[key];

            var tempFileUrl = path.join(fileUrl, fileName);
            linkChildren(tempFileUrl);
        }
        return;
    }

    console.log("linkChildren" + fileUrl);

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

    var fileName = file.getFileName(fileUrl);
    var dbData = {"armature":[], "version":2.3, "name" : fileName, "frameRate":60};

    for (var i = 0; i < stuData["animation_data"].length; i++) {
        var stuAnimation = stuData["animation_data"][i];
        var stuArmature = stuData["armature_data"][i];

        var dbArmature = {"bone":[], "skin":[], "animation":[]};
        dbData["armature"].push(dbArmature);

        //设置name
        dbArmature["name"] = stuArmature["name"];

        //设置bone
        setBone(dbArmature["bone"], stuArmature["bone_data"]);

        //设置skin
        var skin = {"name" : 0, "slot" : []};
        dbArmature["skin"].push(skin);
        setSlot(skin["slot"], stuArmature["bone_data"]);

        //设置动画
        setAnimation(dbArmature["animation"], stuAnimation["mov_data"]);
    }

    file.save(fileUrl.replace(".json", "_ske.json"), JSON.stringify(dbData, null, "\t"));

    moveResources(fileUrl, stuData["texture_data"]);
}

function moveResources(fileUrl, resources) {
    console.log("moveResources" + fileUrl);
    var fileName = file.getFileName(fileUrl);
    var filePath = fileUrl.substring(0, fileUrl.lastIndexOf(fileName));



    for (var i = 0; i < resources.length; i++) {
        var name = resources[i]["name"];

        file.copy(path.join(filePath, "..", "Resources", name + ".png"), path.join(filePath, fileName, name));
    }
}

function setBone(dbBones, stuBones) {
    for (var i = 0; i < stuBones.length; i++) {
        var stuBone = stuBones[i];

        var dbBone = {"transform":{}};
        dbBones.push(dbBone);

        dbBone["name"] = stuBone["name"];
        dbBone["transform"]["x"] = stuBone["x"];
        dbBone["transform"]["y"] = -stuBone["y"];
        dbBone["transform"]["skX"] = stuBone["kX"];
        dbBone["transform"]["skY"] = stuBone["kY"];
        dbBone["transform"]["scX"] = stuBone["cX"];
        dbBone["transform"]["scY"] = stuBone["cY"];
    }
}

function setSlot(dbSlots, stuSlots) {
    for (var i = 0; i < stuSlots.length; i++) {
        var stuSlot = stuSlots[i];

        var dbSlot = {};
        dbSlots.push(dbSlot);

        dbSlot["blendMode"] = "normal";
        dbSlot["z"] = i;
        dbSlot["name"] = stuSlot["name"];
        dbSlot["parent"] = stuSlot["parent"];

        dbSlot["display"] = [];

        setDisplay(dbSlot["display"], stuSlot["display_data"]);
    }
}

function setDisplay(dbDisplays, stuDisplays) {
    for (var i = 0; i < stuDisplays.length; i++) {
        var stuDisplay = stuDisplays[i];

        var dbDisplay = {"transform":{}};
        dbDisplays.push(dbDisplay);

        dbDisplay["name"] = stuDisplay["name"];
        dbDisplay["type"] = stuDisplay["displayType"] == 0 ? "image" : "image";
        dbDisplay["transform"]["x"] = 0;//stuDisplay[0]["x"];
        dbDisplay["transform"]["y"] = 0;//-stuDisplay[0]["y"];
        dbDisplay["transform"]["pX"] = stuDisplay["skin_data"][0]["x"];
        dbDisplay["transform"]["pY"] = -stuDisplay["skin_data"][0]["y"];
        dbDisplay["transform"]["skX"] = stuDisplay["skin_data"][0]["kX"];
        dbDisplay["transform"]["skY"] = stuDisplay["skin_data"][0]["kY"];
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
        dbAnimation["tweenEasing"] = stuAnimation["twE"];
        dbAnimation["loop"] = stuAnimation["lp"] == true ? 0 : 1;

        dbAnimation["timeline"] = [];
        setTimeline(dbAnimation["timeline"], stuAnimation["mov_bone_data"]);
    }
}

function setTimeline(dbTimelines, stuTimelines) {
    for (var i = 0; i < stuTimelines.length; i++) {
        var stuTimeline = stuTimelines[i];

        var dbTimeline = {};
        dbTimelines.push(dbTimeline);

        dbTimeline["offset"] = 0;
        dbTimeline["scale"] = 1;
        dbTimeline["name"] = stuTimeline["name"];

        dbTimeline["frame"] = [];

        setFrame(dbTimeline["frame"], stuTimeline["frame_data"]);
    }
}

function setFrame(dbFrames, stuFrames) {
    for (var i = 0; i < stuFrames.length; i++) {
        var stuFrame = stuFrames[i];

        var dbFrame = {"transform":{}};
        dbFrames.push(dbFrame);

        dbFrame["z"] = stuFrame["z"];
        dbFrame["tweenEasing"] = stuFrame["twE"];

        if (i < stuFrames.length - 1) {
            var nextFrame = stuFrames[i + 1];
            dbFrame["duration"] = nextFrame["fi"] - stuFrame["fi"];
        }
        else {
            dbFrame["duration"] = 1;
        }

        dbFrame["transform"]["x"] = stuFrame["x"];
        dbFrame["transform"]["y"] = -stuFrame["y"];
        dbFrame["transform"]["pX"] = 0;//stuFrame[0]["x"];
        dbFrame["transform"]["pY"] = 0;//-stuFrame[0]["y"];
        dbFrame["transform"]["skX"] = stuFrame["kX"];
        dbFrame["transform"]["skY"] = stuFrame["kY"];
        dbFrame["transform"]["scX"] = stuFrame["cX"];
        dbFrame["transform"]["scY"] = stuFrame["cY"];

    }
}


exports.run = run;