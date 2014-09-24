/**
 * 从CocosBuilder 中导出JSON数据用于egret项目
 * 目前对应的CocosBuilder版本为v3.0-alpha，导出版本为5
 * 禁止使用的属性：
 *   翻转
 *   [旋转]（以后会支持）
 *   坐标原点，第二层节点必须左上角，其他节点也尽量在左上角
 *
 * 组件：
 *  SimpleButton
 *      按钮类以BTN结尾，必须是CCLayer,Tag如果是1的话会在点击时切换下一张
 *  ScrollView
 *      以Scroll结尾，可以设置ContentSize
 *  TableView
 *      和ScrollView类似，以Table结尾
 *  TabView
 *      以Tab结尾，容器里有多个按钮
 *
 */
var file = require("../core/file");
var path = require("path");
var plist = require('../core/plist');

var totalData = {};
var sourceArr = [];

var sourceFile;
var config;
var realPath;

function run(currDir, args, opts) {
    sourceFile = args[0] || "";
    if (!sourceFile && (!opts || !opts["-all"])) {
        console.log("missing arguments .ccb file");
        return;
    }

    // var stat = file.exists(sourceFile);
    // if (!stat) {
    //     console.log("can't open .ccb file");
    //     return;
    // }

    var saveFile = sourceFile;
    var index = sourceFile.lastIndexOf("/");
    var path1, name;
    if (index < 0) {
        path1 = "";
        name = saveFile;
    }
    else {
        path1 = saveFile.substring(0, index);
        name = saveFile.substring(index + 1, saveFile.length);
    }
    realPath = path.join(currDir, path1);

    var fileList = file.getDirectoryListing(realPath, true);
    if (opts && opts["-all"]) {
        for (var key in fileList) {
            var fileName = fileList[key];
            if (fileName.indexOf(".ccbi") >= 0 || fileName.indexOf(".ccb") < 0) {
                continue;
            }
            var fileUrl = path.join(realPath, fileName)
            config = plist.parseFileSync(fileUrl);
            linkChildren(config.nodeGraph, fileName.replace(".ccb", ".jmc"));
        }
    }
    else {
        var fileUrl = path.join(realPath, name)
        config = plist.parseFileSync(fileUrl);
        linkChildren(config.nodeGraph, name.replace(".ccb", ".jmc"));
    }
}

function linkChildren(rootNode, name) {
    var viewData = {};
    var data = loop(rootNode, null);
    data.x = 0;
    data.y = 0;

    if (rootNode.jsController && rootNode.jsController != "") {
        data.linkClass = rootNode.jsController;
    }

    checkProperties(data);
    viewData = data;

    //最后 输出的格式
    var rootData = {"viewData" : viewData, "resourceData" : sourceArr};

    var saveFile = path.join(realPath, "..", "..", "config", "jmcs", name);
    console.log(saveFile);
    file.save(saveFile, JSON.stringify(rootData, null, "\t"));
    console.log(name + "生成完毕！");
}

function loop(container, parentData) {
    var data = build(container, parentData);
    if (data == null) {
        return null;
    }

    if (data.width == null && parentData == null) {
        data.width = config.resolutions[0].width;
        data.height = config.resolutions[0].height;
    }

    if (container.children.length > 0) {
        data.children = [];
    }

    if (parentData && parentData.children) {
        parentData.children.push(data);
    }

    container.children.forEach(function (item) {
        loop(item, data);
    });
    return data;
}

function build(data, parentData) {
    var builder = new ConfigBuilder();
    var name = "";
    switch (data.baseClass) {
        case "CCScrollView":
            return null;
        case "CCSprite":
            // if (data.memberVarAssignmentName.match(/Progress$/)) {
            //     name = "ProgressBar";
            //     break;
            // }
            name = "Bitmap";
            break;
        case "CCLabelTTF":
            // if (data.memberVarAssignmentName.match(/Input$/)) {
            //     name = "TextInput";
            //     break;
            // }
            name = "TextField";
            break;
        case "CCScale9Sprite":
            name = "Scale9Bitmap";
            break;
        case "CCLabelBMFont":
            name = "BitmapText";
            break;
        case "CCBFile":

            break;
        case "MooScaleLayer":
            name = "ScaleContainer";
            break;
        case "MooLayoutBox":
            name = "LayoutBox";
            break;
            // if (data.memberVarAssignmentName.match(/Btn$/)) {
            //     name = "SimpleButton";
            //     break;
            // }
            // if (data.memberVarAssignmentName.match(/Scroll$/)) {
            //     name = "ScrollView";
            //     break;
            // }
            // if (data.memberVarAssignmentName.match(/Table$/)) {
            //     name = "TableView";
            //     break;
            // }
            // if (data.memberVarAssignmentName.match(/Tab$/)) {
            //     name = "TabView";
            //     break;
            // }
        default:
            name = "DisplayObjectContainer";
            break;
    }

    if (data.memberVarAssignmentName) {
        builder.withName(data.memberVarAssignmentName);
    }

    builder.withClassName(name);
    for (var childPropertyConfigKey in data.properties) {
        var childPropertyConfig = data.properties[childPropertyConfigKey];
        if (childPropertyConfig.name == "contentSize") {
            var contentSizeWidth = childPropertyConfig.value[0];
            var contentSizeHeight = childPropertyConfig.value[1];
        }
    }

    var propertiesInfo = {};
    for (var childPropertyConfigKey in data.properties) {
        var childPropertyConfig = data.properties[childPropertyConfigKey];
        propertiesInfo[childPropertyConfig.name] = childPropertyConfig.value;
    }

    if (propertiesInfo["position"] == null) {
        propertiesInfo["position"] = [0, 0, 0];
    }

    for (var key in propertiesInfo) {
        var propertyValue = propertiesInfo[key];
        switch (key) {
            case "position":
                if (!parentData) {

                }
                else {
                    var x = propertyValue[0];
                    var y = propertyValue[1];

                    if (parentData.width != null) {
                        var contentWidth = parentData.width;
                        var contentHeight = parentData.height;
                    }
                    else {
                        var contentWidth = 0;
                        var contentHeight = 0;
                    }

                    if (propertyValue[2] == 0)
                    {
                        y = contentHeight - y;
                    }
                    else if (propertyValue[2] == 2) {
                        x = contentWidth - x;
                    }
                    else if (propertyValue[2] == 3) {
                        y = contentHeight - y;
                        x = contentWidth - x;
                    }
                    else if (propertyValue[2] == 4) {//百分比
                        x = x * contentWidth / 100;
                        y = y * contentHeight / 100;
                        y = contentHeight - y;
                    }
                    builder.withPosition(x, y);
                }
                break;
            case "scale":
                builder.withScale(propertyValue[0], propertyValue[1]);
                break;
            case "displayFrame":
            case "spriteFrame":
                builder.withTexture(propertyValue[1]);
                break;
            case "anchorPoint":
                var anchorPointX = propertyValue[0];
                var anchorPointY = propertyValue[1];
                builder.withRegPosition(anchorPointX, 1 - anchorPointY);
                break;
            case "contentSize":
                if (propertyValue[2] == 1) {
                    if (parentData != null) {
                        if (parentData.width != null) {
                            var contentWidth = parentData.width;
                            var contentHeight = parentData.height;
                        }
                        else {
                            var contentWidth = 0;
                            var contentHeight = 0;
                        }
                        builder.withContentSize(contentWidth * propertyValue[0] / 100, contentHeight * propertyValue[1] / 100);
                    }
                }
                else {
                    builder.withContentSize(propertyValue[0], propertyValue[1]);
                }
                break;
            case "preferedSize":
            case "dimensions":
                builder.withContentSize(propertyValue[0],propertyValue[1]);
                break;
            case "fontName":
                builder.withFontName(propertyValue);
                break;
            case "fontSize":
                builder.withFontSize(propertyValue[0]);
                break;
            case "color":
                builder.withFontColor(propertyValue[0], propertyValue[1], propertyValue[2]);
                break;
            case "horizontalAlignment":
                builder.withHorizontalAlignment(propertyValue);
                break;
            case "verticalAlignment":
                builder.withVerticalAlignment(propertyValue);
                break;
            case "string":
                builder.withText(propertyValue);
                break;
            case "fntFile":
                builder.withTexture(propertyValue);
                break;
            case "tag":
                builder.withTag(propertyValue);
                break;
            case "visible":
                builder.withVisible(propertyValue);
                break;
            case "rotation":
                builder.withProperty("rotation", propertyValue);
                break;
            case "insetTop":
                builder.withProperty("top", propertyValue);
                break;
            case "insetBottom":
                builder.withProperty("bottom", propertyValue);
                break;
            case "insetLeft":
                builder.withProperty("left", propertyValue);
                break;
            case "insetRight":
                builder.withProperty("right", propertyValue);
                break;
            case "opacity":
                builder.withProperty("alpha", propertyValue / 255);
                break
            case "spacingHorizontal":
                builder.withProperty("spacingHorizontal", propertyValue[0]);
                break;
            case "spacingVertical":
                builder.withProperty("spacingVertical", propertyValue[0]);
                break;
            case "itemCount":
                builder.withProperty("itemCount", propertyValue);
                break;
            case "ccbFile":
                var arr = propertyValue.split("/");
                builder.withClassName(arr[arr.length - 1].split(".")[0]);
                break
        }

        if (propertiesInfo["ignoreAnchorPointForPosition"] == true) {//描点被忽略
            builder.withRegPosition(0, 1);
        }



    }
    checkProperties(builder.data);
    return builder.data;
////    builder.withPosition(data.properties.x,data.properties.y);
}


function checkProperties(data) {
    var properties = ["linkClass", "frame", "textColor", "name", "class", "children", "x", "y", "width", "height", "anchorX", "anchorY", "visible", "alpha", "scaleX", "scaleY", "rotation"];

    switch (data.class) {
        case "DisplayObjectContainer":
        case "SimpleButton":
            deleteExtraProperties(data, properties);
            break;
        case "Bitmap":
            properties = properties.concat(["texturePath", "frame"]);
            deleteExtraProperties(data, properties);
            break;
        case "BitmapText":
            properties = properties.concat(["configPath", "frame", "text"]);
            deleteExtraProperties(data, properties);
            break;

    }

    if (data["x"] == 0) {
        delete(data["x"]);
    }
    if (data["y"] == 0) {
        delete(data["y"]);
    }
    if (data["width"] == 0) {
        delete(data["width"]);
    }
    if (data["height"] == 0) {
        delete(data["height"]);
    }
    if (data["anchorX"] == 0) {
        delete(data["anchorX"]);
    }
    if (data["anchorY"] == 0) {
        delete(data["anchorY"]);
    }
    if (data["rotation"] == 0) {
        delete(data["rotation"]);
    }
    if (data["visible"] == true) {
        delete(data["visible"]);
    }
    if (data["alpha"] == 1) {
        delete(data["alpha"]);
    }
    if (data["scaleX"] == 1) {
        delete(data["scaleX"]);
    }
    if (data["scaleY"] == 1) {
        delete(data["scaleY"]);
    }
}

function deleteExtraProperties(data, properties) {
    for (var key in data) {
        if (properties.indexOf(key) < 0) {
            delete(data[key]);
        }
    }
}

function getProperty(data, propertyName) {
    for (var childPropertyConfigKey in data.properties) {
        var childPropertyConfig = data.properties[childPropertyConfigKey];
        if (childPropertyConfig.name == propertyName) {
            return childPropertyConfig;
        }
    }
    return null;
}

function ConfigBuilder() {

    this.data = {};

    this.withProperty = function (key, value) {
        this.data[key] = value;
        return this;
    }
    this.withClassName = function (name) {
        this.data.class = name;
        return this;
    }

    this.withName = function (name) {
        this.data.name = name;
        return this;
    }

    this.withVisible = function (visibleStr) {
        this.data.visible = visibleStr;
        return this;
    }

    this.withPosition = function (x, y) {
        this.data.x = Number(x.toFixed(2));
        this.data.y = Number(y.toFixed(2));
        return this;
    }

    this.withScale = function (scaleX, scaleY) {
        if (scaleX != 1) {
            this.data.scaleX = Number(scaleX.toFixed(2));
        }
        if (scaleY != 1) {
            this.data.scaleY = Number(scaleY.toFixed(2));
        }
        return this;
    }

    this.withTexture = function (texturePath) {
        var pathArr = texturePath.split("/");
        var name = pathArr[pathArr.length - 1].replace(".", "_");

        name = name.replace("-", "_");


        if (name.lastIndexOf("_fnt") >= 0) {//字体
            this.data.configPath = name;
            if (sourceArr.indexOf(this.data.configPath) < 0) {
                sourceArr.push(this.data.configPath);
            }
        }
        else {//图片
            this.data.texturePath = name;

            if (sourceArr.indexOf(this.data.texturePath) < 0) {
                sourceArr.push(this.data.texturePath);
            }
        }

        return this;
    }

    this.withRegPosition = function (regX, regY) {
        if (regX != null) {
            this.data.anchorX = regX;
        }
        if (regY != null) {
            this.data.anchorY = regY;
        }

        return this;
    }

    this.withContentSize = function (width, height) {
        if (width && height) {
            this.data.width = Number(width.toFixed(2));
            this.data.height = Number(height.toFixed(2));
        }
    }

    this.withFontName = function (name) {
        this.data.fontFamily = name;
    }

    this.withFontSize = function (size) {
        this.data.size = size;
    }

    this.withFontColor = function (r, g, b) {

        r = r.toString(16);
        if(r.length == 1)
        {
            r = "0" + r;
        }
        g = g.toString(16);
        if(g.length == 1)
        {
            g = "0" + g;
        }
        b = b.toString(16);
        if(b.length == 1)
        {
            b = "0" + b;
        }
        this.data.textColor = parseInt("0x" + r + "" + g + "" + b);
    }

    this.withHorizontalAlignment = function (dirt) {
        switch (dirt)
        {
            case 0:
                this.data.textAlign = "left";
                break;
            case 1:
                this.data.textAlign = "center";
                break;
            case 2:
                this.data.textAlign = "right";
                break;
        }
    }

    this.withVerticalAlignment = function (dirt) {
        // this.data.textColor = dirt;
    }

    this.withText = function (textStr) {
        this.data.text = textStr;
    }

    this.withTag = function (tag) {
        if (tag >= 0) {
            this.data.frame = tag;
        }
    }
}
exports.run = run;

