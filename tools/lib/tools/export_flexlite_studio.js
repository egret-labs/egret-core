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
    return;
//解析FlexLiteStudio的功能暂时屏蔽掉
var DOMParser = require("../core/xmldom/dom-parser").DOMParser;

var file = require("../core/file");
var path = require("path");

var xml_digester = require('../core/xml-digester');
var digester = xml_digester.XmlDigester({});
var _logger = xml_digester._logger;
_logger.level(_logger.TRACE_LEVEL);



var totalData = {};
var sourceArr = [];

var childDxmlArr = [];
    
function run(currDir, args, opts) {
    var sourceFile = args[0];
    if (!sourceFile) {
        console.log("missing arguments .dxml file");
        return;
    }

    var stat = file.exists(sourceFile);
    if (!stat) {
        console.log("can't open .dxml file");
        return;
    }

    ans(sourceFile, null);
}

function getXMLDoc(textxml) {
    var i = 0;
    while (textxml.charAt(i) == "\n" || textxml.charAt(i) == "\t" || textxml.charAt(i) == "\r" || textxml.charAt(i) == " ") {
        i++;
    }

    if (i != 0) {
        textxml = textxml.substring(i, textxml.length);
    }
    

    return new DOMParser().parseFromString(textxml);
}

function ansXML(xmlDoc) {
    var json = {};
    if (xmlDoc.childElementCount > 0) {//拥有子 节点
        json.children = [];
        for (var i = 0; i < xmlDoc.childElementCount; i++) {
            var childXMLDoc = xmlDoc.children[i];

            json.children.push(_ansXML(childXMLDoc));
        }
    }
    // else {
    //     json["value"] = xmlDoc.textContent;
    // }

    if (xmlDoc.attributes && xmlDoc.attributes.length > 0) {//拥有 属性
        for (var j = 0; j < xmlDoc.attributes.length; j++) {
            var attr = xmlDoc.attributes[j];
            json[attr.name] = attr.value;
        }
    }
    return json;
}


function duplicateRemoval(arr) {
    var tempArr = [];
    for (var i = arr.length - 1; i >= 0; i--) {
        for (var j = i - 1; j >= 0; j--) {
            if (arr[i] == arr[j]) {
                arr.splice(i, 1);
                break;
            }
        }

        if (j < 0) {
            tempArr.push(arr[i]);
        }
    }

    return tempArr;
}

function ans(sourceFile, callback) {
    var resouceArr = [];
    var resultJson;

    var dxmlNum = 0;
    var ansOver = function (tempResouceArr) {
        dxmlNum--;
        resouceArr = resouceArr.concat(tempResouceArr);
        if (dxmlNum == 0) {
            var txt = JSON.stringify({"viewData":resultJson, "resourceData":duplicateRemoval(resouceArr)});
            var saveFile = sourceFile.replace(".dxml", ".jfll");
            file.save(saveFile,txt);
            console.log (saveFile + " 输出已完成");

            if (callback) {
                callback(resouceArr);
            }
        }
    };

    var xmlStr = file.read(sourceFile);
    resultJson = ansXML(getXMLDoc(xmlStr));
    var dxmlArr = [];

    ansResource(resouceArr, dxmlArr, resultJson);

    dxmlNum = dxmlArr.length;
    for (var i = 0; i < dxmlArr.length; i++) {
        ans(dxmlArr[i], ansOver);
    }

    if (dxmlNum == 0) {
        dxmlNum++;
        ansOver([]);
    }    
}

function ansResource(resouceArr, dxmlArr, result) {
    for (var key in result) {
        if (key == "skinName") {//皮肤
            var file;
            if (result[key].indexOf("IMG__") == 0) {//图片
                file = result[key] + ".png";
                resouceArr.push(file);
            }
            else {//组件皮肤
                file = result[key];
                var arr = file.split(".");
                file = arr[arr.length - 1] + ".dxml";
                resouceArr.push(file);

                if (childDxmlArr.indexOf(file) < 0) {
                    childDxmlArr.push(file);
                    dxmlArr.push(file);
                }
            }
        }

        if (result[key] instanceof Array || result[key] instanceof Object) {
            ansResource(resouceArr, dxmlArr, result[key]);
        }
    }
}

exports.run = run;

