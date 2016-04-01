/**
 * Created by yjtx on 15-7-11.
 */
var path = require("../core/path");
var file = require("../core/file.js");
exports.modify = function (projectPath, isCompiler) {

    if (!isCompiler) {
        var egretProperties = JSON.parse(file.read(path.join(projectPath, "egretProperties.json")));
        var document_class = egretProperties["document_class"];

        var egretListcontent = file.read(path.join(projectPath, "bin-debug", "lib", "egret_file_list.js"));
        var egretList = JSON.parse(egretListcontent.substring(egretListcontent.indexOf("["), egretListcontent.indexOf("]") + 1));
        egretList = egretList.map(function(item) {
            return "libs/" + item;
        });

        var gameListcontent = file.read(path.join(projectPath, "bin-debug", "src", "game_file_list.js"));
        var gameList = JSON.parse(gameListcontent.substring(gameListcontent.indexOf("["), gameListcontent.indexOf("]") + 1));
        gameList = gameList.map(function(item) {
            return "bin-debug/src/" + item;
        });
        var list = egretList.concat(gameList);
    }
    else {
        list = ["launcher/game-min.js"];
    }

    var str = "";
    for (var i = 0; i < list.length; i++) {
        str += "<script src=\"" + list[i] + "\"></script>\n";
    }

    var htmlList = file.getDirectoryListing(path.join(projectPath));
    htmlList.map(function(htmlpath) {
        if (file.getExtension(htmlpath) == "html") {
            var htmlContent = file.read(htmlpath);

            //替换文档类
            var reg = /data-entry-class(\s)*=(\s)*"[^"]*"/;
            if (document_class && htmlContent.match(reg)) {
                htmlContent = htmlContent.replace(reg, 'data-entry-class="' + document_class + '"');
            }

            //替换list
            reg = /<!--egret_files_start-->[\s\S]*<!--egret_files_end-->/;
            if (htmlContent.match(reg)) {
                htmlContent = htmlContent.replace(reg, '<!--egret_files_start-->\n' + str + '<!--egret_files_end-->');
            }

            file.save(htmlpath, htmlContent);
        }
    });
};