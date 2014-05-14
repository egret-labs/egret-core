/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-1-9
 * Time: PM8:49
 * To change this template use File | Settings | File Templates.
 */

var fs = require("fs");
var path = require("path");

var sourceFile;

function run(currDir, args, opts) {
    sourceFile = args[0];
    if (!sourceFile){
        console.log ("missing arguments .fnt file");
        return;
    }
    var stat = fs.existsSync(sourceFile);
    if (!stat){
        console.log ("can't open .fnt file");
        return;
    }

    var fntText = fs.readFileSync(sourceFile,"utf-8");

    fntText = fntText.split("\r\n").join("\n");
    var lines = fntText.split("\n");
    var config = lines[0];

    var charsCount = parseInt(getConfigByKey(lines[3],"count"));

    //获取 png图 
    var pngLine = lines[2];
    var pngStr = getConfigByKey(pngLine, "file");

    var egret_obj = {};
    for (var i = 4 ; i < 4 + charsCount ; i++){
        var charText = lines[i];
        var letter = String.fromCharCode(getConfigByKey(charText,"id"));
        var obj = {};
        egret_obj[letter] = obj;

        obj["x"] =  parseInt(getConfigByKey(charText,"x"));
        obj["y"] = parseInt(getConfigByKey(charText,"y"));
        obj["w"] = parseInt(getConfigByKey(charText,"width"));
        obj["h"] = parseInt(getConfigByKey(charText,"height"));
        obj["offX"] = parseInt(getConfigByKey(charText,"xoffset"));
        obj["offY"] = parseInt(getConfigByKey(charText,"yoffset"));
    }

    exportEgretObject({"data" : egret_obj, "texturePath" : pngStr});
}

function exportEgretObject(obj){
    var str = JSON.stringify(obj);
    str = str.replace(/\\\"/gi,"");

    console.log("自定义字体生成完毕！");

    var saveFile = sourceFile.replace(".fnt", ".jfnt");
    fs.writeFile(saveFile, str);
}


function getConfigByKey(configText,key){
    var itemConfigTextList = configText.split(" ");
    for (var i = 0 , length = itemConfigTextList.length ; i < length ; i++){
        var itemConfigText = itemConfigTextList[i];
        if (key == itemConfigText.substring(0,key.length)){
            return itemConfigText.substring(key.length + 1);
        }
    }
    return null;

}
exports.run = run;