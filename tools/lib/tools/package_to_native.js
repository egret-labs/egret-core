/**
 * Created by apple on 14-5-29.
 */
var libs = require("../core/normal_libs");

var output = "signed_egret.apk";
var async = require("../core/async.js");
var fs = require("fs");
var FileUtil = require("../core/file_util.js");

function run(current, arg, opt) {


    if (opt["-config"]) {
        var content = "{\n" +
            "  \"project\":\"\",\n" +
            "  \"keystore\":\"\",\n" +
            "  \"password\":\"\",\n" +
            "  \"egret-native\":\"EgretFrameworkNative\"\n" +
            "}";
        fs.writeFileSync("package_to_native.config", content, "utf-8");
        return;
    }
    var config = libs.getConfig(arg[0]);
    var keystore = config.keystore;
    var keypass = config.password;
    var project = config.project;
    var native_folder = config["egret-native"];
    var join = require("path").join;

    async.series(
        [

            function (callback) {
                FileUtil.copy(join(project,"bin-debug"), join(native_folder,"assets/js/bin-debug"));
                FileUtil.copy(join(project,"launcher"), join(native_folder,"assets/js/launcher"));
                FileUtil.copy(join(project,"resources"), join(native_folder,"assets/js/resources"));
                callback();
            },

            function (callback) {
                var cmd = "apktool b " + native_folder + " a.apk";
                executeCommand(callback, cmd);
            },

            function (callback) {
                var cmd = "jarsigner -verbose -keystore  " + keystore + " -storepass " + keypass + " -signedjar " + output + " a.apk " + keystore;
                executeCommand(callback, cmd);
            },

            function (callback) {
                fs.unlinkSync("a.apk");
                var cmd = "adb uninstall org.egret.egretframeworknative";
                executeCommand(callback, cmd)
                callback();
            },

            function (callback) {
                var cmd = "adb install " + output;
                executeCommand(callback, cmd);
            }

        ]

    )
}


function executeCommand(callback, script) {
    var cp_exec = require("child_process").exec;
    var cmd = cp_exec(script);
    cmd.stderr.on("data", function (data) {
        console.log(data);
    })

    cmd.on('exit', function (code) {

        if (code == 0) {
            callback();
        }
        else {
            libs.log("脚本执行失败");
        }

    });
}


exports.run = run;