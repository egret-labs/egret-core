/**
 * 从CocosBuilder 中导出JSON数据用于egret项目
 * 目前对应的CocosBuilder版本为v3.0-alpha，导出版本为5
 * 本项目依赖于plist库，请执行 npm install plist 安装依赖库
 * 当前依赖的plist库有一个bug，请安装后打开 node_modules/plist/lib/plist.js，第134行
 *   if (res ) new_arr.push( res );
 * 改为
 *   new_arr.push( res );
 *
 * 调用方式
 * <code>
 *     node egret_export_cocos_builder.js [ccb_file_path]
 * </code>
 *
 * 禁止使用的属性：
 *   忽略锚点
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
 *
 * 定制需求：
 *  如果有进一步的定制需求，在 View.ts 里的ViewManager._createView()里进行调整
 *
 *
 */
var path = require("path");
var plist = require('../core/plist');
var file = require("../core/file");

var totalData = {};
var sourceArr = [];
    
function run(currDir, args, opts) {
    var ccbFilePath = args[0];
    if (!ccbFilePath) {
        console.log("missing arguments .ccb file");
        return;
    }

    var stat = file.exists(ccbFilePath);
    if (!stat) {
        console.log("can't open .ccb file");
        return;
    }

    var config = plist.parseFileSync(ccbFilePath);

    totalData.children = [];
    loop(config.nodeGraph, null, totalData);
    console.log ("输出ViewData文件:\n");
    console.log(JSON.stringify(totalData.children[0], null, ""));
    console.log ("输出资源文件:\n")
    var sourceTxt = JSON.stringify(sourceArr);
    console.log(sourceTxt.slice(1, sourceTxt.length - 1));
}

function loop(container, parent, parentData) {
    var data = build(container, parent);
    if (container.children.length > 0) {
        data.children = [];
    }
//    console.log (parentData)
    if (parentData.children) {
        parentData.children.push(data);
    }

    container.children.forEach(function (item) {
        loop(item, container, data);
    });
}

function build(data, parent) {
    var builder = new ConfigBuilder();
    var name = "";
    switch (data.baseClass) {
        case "CCSprite":
            if (data.memberVarAssignmentName.match(/Progress$/)) {
                name = "ProgressBar";
                break;
            }
            name = "Bitmap";
            break;
        case "CCLabelTTF":
            name = "TextField";
            break;
        case "CCScale9Sprite":
            name = "Scale9Bitmap";
            break;
        case "CCLabelBMFont":
            name = "BitmapText";
            break;
        case "CCLayer":
            if (data.memberVarAssignmentName.match(/Btn$/)) {
                name = "SimpleButton";
                break;
            }
            if (data.memberVarAssignmentName.match(/Scroll$/)) {
                name = "ScrollView";
                break;
            }
            if (data.memberVarAssignmentName.match(/Table$/)) {
                name = "TableView";
                break;
            }
            if (data.memberVarAssignmentName.match(/Tab$/)) {
                name = "TabView";
                break;
            }
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
    for (var childPropertyConfigKey in data.properties) {
        var childPropertyConfig = data.properties[childPropertyConfigKey];
        switch (childPropertyConfig.name) {
            case "position":
                var x = childPropertyConfig.value[0];
                var y = childPropertyConfig.value[1];
                if (x == 701)
                {
                    console.log(childPropertyConfig);
                    throw new Error();
                }
                if (!parent) {
                    console.log("warning");
                }
                else {
                    var anchorData = getProperty(parent,"anchorPoint");
                    var anchorDataX = anchorData.value[0];
                    var anchorDataY = anchorData.value[1];
                    if (!anchorDataX){
                        anchorDataX = 0;
                    }
                    if (!anchorDataY){
                        anchorDataY = 0;
                    }
                    var contentData = getProperty(parent,"contentSize");
                    var contentWidth;
                    var contentHeight;
                    if (!contentData){
                        contentHeight = contentWidth = 0;
                    }else{
                        contentWidth = contentData.value[0];
                        contentHeight = contentData.value[1];
                    }
                }

                if (childPropertyConfig.value[2] == 0)
                {
                    y = contentHeight - y;
                    // x -= anchorDataX * contentWidth;
                    // y -= anchorDataY * contentHeight;
                }
                else if (childPropertyConfig.value[2] == 4) {//百分比
                    x = x * contentWidth / 100;
                    y = y * contentHeight / 100;
                    y = contentHeight - y;
                }
                builder.withPosition(x, y);
                break;
            case "scale":
                builder.withScale(childPropertyConfig.value[0], childPropertyConfig.value[1]);
                break;
            case "displayFrame":
            case "spriteFrame":
                builder.withTexture(childPropertyConfig.value[1]);
                break;
            case "anchorPoint":
                var anchorPointX = childPropertyConfig.value[0];
                var anchorPointY = childPropertyConfig.value[1];
                if (!anchorPointX) {
                    anchorPointX = 0;
                }
                if (!anchorPointY) {
                    anchorPointY = 0;
                }
                builder.withRegPosition(anchorPointX, 1 - anchorPointY);
                break;
            case "contentSize":
            case "preferedSize":
            case "dimensions":
                builder.withContentSize(childPropertyConfig.value[0],childPropertyConfig.value[1]);
                break;
            case "fontName":
                builder.withFontName(childPropertyConfig.value);
                break;
            case "fontSize":
                builder.withFontSize(childPropertyConfig.value[0]);
                break;
            case "color":
                builder.withFontColor(childPropertyConfig.value[0], childPropertyConfig.value[1], childPropertyConfig.value[2]);
                break;
            case "horizontalAlignment":
                builder.withHorizontalAlignment(childPropertyConfig.value);
                break;
            case "verticalAlignment":
                builder.withVerticalAlignment(childPropertyConfig.value);
                break;
            case "string":
                builder.withText(childPropertyConfig.value);
                break;
            case "fntFile":
                builder.withTexture(childPropertyConfig.value.replace(".fnt", ".png"));
                break;
            case "tag":
                builder.withTag(childPropertyConfig.value);
                break;
            case "visible":
                builder.withVisible(childPropertyConfig.value);
                break;
            case "insetTop":
                builder.withProperty("top", childPropertyConfig.value);
                break;
            case "insetBottom":
                builder.withProperty("bottom", childPropertyConfig.value);
                break;
            case "insetLeft":
                builder.withProperty("left", childPropertyConfig.value);
                break;
            case "insetRight":
                builder.withProperty("right", childPropertyConfig.value);
                break;
            case "opacity":
                builder.withProperty("alpha", childPropertyConfig.value / 255);
                break
            case "ignoreAnchorPointForPosition":
                if (childPropertyConfig.value == true) {
                    throw new Error("有描点被忽略！");
                }
                break;
        }
    }
    return builder.data;
////    builder.withPosition(data.properties.x,data.properties.y);
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

//console.log (builder.data);

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
        this.data.x = Number(x);
        this.data.y = Number(y);
        return this;
    }

    this.withScale = function (scaleX, scaleY) {
        if (scaleX != 1) {
            this.data.scaleX = Number(scaleX);
        }
        if (scaleY != 1) {
            this.data.scaleY = Number(scaleY);
        }
        return this;
    }

    this.withTexture = function (texturePath) {
        this.data.texturePath = texturePath;
        if (sourceArr.indexOf(texturePath) < 0) {
            sourceArr.push(texturePath);
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
        this.data.font = name;
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
        this.data.textColor = "#" + r + "" + g + "" + b;
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

