/**
 * 将TexturePackager的数据各位转换为Egret的数据格式
 * 调用方式
 * <code>
 *     node egret_export_texture_packager [sourcePath]
 * </code>
 * TexturePackager的导出格式必须是JSON-ARRAY
 * @type {*}
 */


var sourcePath = process.argv[2];
if (!sourcePath){
    throw new Error("missed agreement sourcePath");
}
var fs = require("fs");
var jsonTxt = fs.readFileSync(sourcePath, "utf8");
var jsonData = JSON.parse(jsonTxt);
var frames = jsonData.frames;
var l = frames.length;
var outputData = {};
for (var i = 0; i < l; i++) {
    var data = frames[i];
    if (data.rotated) {
        console.log("不支持rotation属性");
        return;
    }
    var frame = data.frame;
    outputData[data.filename] = {x: frame.x, y: frame.y, w: frame.w, h: frame.h, offX: 0, offY: 0};
}
var outputTxt = JSON.stringify({frames: outputData});
console.log (outputTxt);