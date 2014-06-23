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
var file = require("../core/file.js");
var path = require("path");
var plist = require('../core/plist');

var totalData = {};
var sourceArr = [];
var linkName = "";
    
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

    var localStr = file.read(ccbFilePath);
    var localObj = JSON.parse(localStr);

    linkName = ccbFilePath.substring(ccbFilePath.lastIndexOf("/") + 1, ccbFilePath.lastIndexOf("."));

    linkChildren(localObj.widgetTree);
}

function linkChildren(rootNode) {
    var viewData = {};

        viewData = loop(rootNode, rootNode);
        viewData.x = 0;
        viewData.y = 0;
        viewData.anchorX = 0;
        viewData.anchorY = 0;

        checkProperties(viewData);

    //最后 输出的格式
    var rootData = {"viewData" : {}, "resourceData" : sourceArr};
    rootData["viewData"][linkName] = viewData;

    console.log ("输出ViewData文件:\n");
    console.log(JSON.stringify(rootData, null, ""));
}

function loop(container, parent, parentData) {
    var data = build(container, parent);

    if (container.children.length > 0) {
        data.children = [];
    }

    if (parentData && parentData.children) {
        parentData.children.push(data);
    }

    container.children.forEach(function (item) {
        loop(item, container, data);
    });

    return data;
}

function build(currentObj, parentObj) {
    var data = currentObj.options;
    var parent = parentObj.options;

    var builder = new ConfigBuilder();
    var name = "";
    switch (data.classname) {
        case "ImageView":
            if (data.name.match(/Progress$/)) {
                name = "ProgressBar";
                break;
            }

            if (data.scale9Enable == true) {
                name = "Scale9Bitmap";    
                break;
            }

            name = "Bitmap";
            break;
        case "TextArea":
            if (data.name.match(/Input$/)) {
                name = "TextInput";
                break;
            }
            name = "TextField";
            break;
        case "LabelBMFont":
            name = "BitmapText";
            break;
        case "Button":
            name = "SimpleButton";
            break;
        case "Panel":
            if (data.name.match(/Scroll$/)) {
                name = "ScrollView";
                break;
            }
            if (data.name.match(/Table$/)) {
                name = "TableView";
                break;
            }
            if (data.name.match(/Tab$/)) {
                name = "TabView";
                break;
            }
        default:
            name = "DisplayObjectContainer";
            break;
    }

    if (data.name) {
        builder.withName(data.name);
    }

    if (name == "Bitmap" && currentObj.children && currentObj.children.length > 0) {//
        name = "DisplayObjectContainer";

        var bmpChild = {"options" : data, "children":[]};
        currentObj.children.unshift(bmpChild);
    }
    else if (name == "SimpleButton") {//
        var bmpChild = {"options" : {}, "children":[]};
        bmpChild["options"] = {"fileNameData":data.normalData, "classname":"ImageView", "name":""};

        currentObj.children.unshift(bmpChild);
    }

    builder.withClassName(name);

    //获取当前宽高
    var contentSizeWidth = data.width || 0;
    var contentSizeHeight = data.height || 0;

    var propertiesInfo = data;

    //设置x,y 
    var parentW = parent.width || 0;
    var parentH = parent.height || 0;
    var x = data.x || 0;
    var y = data.y || parentH;
    builder.withPosition(x, parentH - y);

    //设置缩放
    builder.withScale(data.scaleX || 1, data.scaleY || 1);

    //图片\字体 地址
    if (data.fileNameData && data.fileNameData.path) {
        var url = "";
        if (data.fileNameData.plistFile != null && data.fileNameData.plistFile != "") {
            var endIdx = data.fileNameData.plistFile.lastIndexOf(".");
            url = data.fileNameData.plistFile.substring(0, endIdx) + "_PList.Dir/";
        }

        builder.withTexture(url + data.fileNameData.path);
    }
    
    //设置锚点
    builder.withRegPosition(data.anchorPointX || 0, 1 - (data.anchorPointY || 1));

    //设置宽高
    builder.withContentSize(data.width || 0, data.height || 0);
    //设置可见
    if (data.visible != null) {
        builder.withVisible(data.visible);
    }
    
    //设置旋转
    if (data.rotation != null) {
        builder.withRotation(data.rotation);
    }

    if (data.Scale9Bitmap == true) {
        var left =  data.capInsetsX;
        var bottom =  data.capInsetsY;
        var right =  contentSizeWidth - (data.capInsetsX + data.capInsetsWidth);
        var top =  contentSizeHeight - (data.capInsetsY + data.capInsetsHeight);

        builder.withProperty("top", top);
        builder.withProperty("bottom", bottom);
        builder.withProperty("left", left);
        builder.withProperty("right", right);
    }
    if (data.hAlignment != null) {
        //设置水平排版
        builder.withHorizontalAlignment(data.hAlignment);
    }
    if (data.vAlignment != null) {
        //设置垂直排版
        builder.withVerticalAlignment(data.vAlignment);
    }
    if (data.fontName != null) {
        //字体名
        builder.withFontName(data.fontName);
    }
    if (data.fontSize != null) {
        //字体大小
        builder.withFontSize(data.fontSize);
    }
    if (data.text != null) {
        //字体内容
        builder.withText(data.text);
    }
    if (data.colorR != null) {
        //设置颜色
        builder.withFontColor(data.colorR, data.colorG, data.colorB);
    }
    if (data.tag != null) {
        //设置tag
        builder.withTag(data.tag);
    }
    if (data.opacity != null) {
        //设置透明度
        builder.withProperty("alpha", data.opacity / 255);
    }

    if (propertiesInfo["ignoreAnchorPointForPosition"] == true) {//描点被忽略
        builder.withRegPosition(0, 1 - 0);
    }

    checkProperties(builder.data);

    return builder.data;
////    builder.withPosition(data.properties.x,data.properties.y);
}

function checkProperties(data) {
    var properties = ["name", "class", "children", "x", "y", "width", "height", "anchorX", "anchorY", "visible", "alpha", "scaleX", "scaleY", "rotation"];

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

    this.withRotation = function (rotation) {
        this.data.rotation = rotation;
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
        if (texturePath.lastIndexOf(".fnt") >= 0) {//字体
            this.data.configPath = texturePath.replace(".fnt", ".jfnt");

            if (sourceArr.indexOf(this.data.configPath) < 0) {
                sourceArr.push(this.data.configPath);
            }
        }
        else {//图片
            this.data.texturePath = texturePath;

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

