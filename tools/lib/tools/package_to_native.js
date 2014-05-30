/**
 * Created by apple on 14-5-29.
 */
var libs = require("../core/normal_libs");

var native_folder = "egret_native/EgretFrameworkNative";
var output = "1.apk";
var keystore = "egret.keystore";
var keypass = "185713114";
var async = require("../core/async.js");
var fs = require("fs");
var project = "HelloNative";


function run(current,arg,opt) {


    if (opt["-config"]){
        var content = "{\n" +
            "  \"keyfile\":\"\",\n" +
            "  \"password\":\"\",\n" +
            "  \"egret-native\":\"EgretFrameworkNative\"\n" +
            "}";
        fs.writeFileSync("package_to_native.config",content,"utf-8");
        return;
    }
    var config = libs.getConfig(arg[0]);
    var keystore = config.keystore;
    var keypass = config.password;
    var native_folder = config["egret-native"];

    async.series(
        [

            function (callback) {
                libs.copy(project +"/bin-debug","egret_native/EgretFrameworkNative/assets/js/bin-debug")
                libs.copy(project +"/launcher","egret_native/EgretFrameworkNative/assets/js/launcher")
                libs.copy(project + "/resources","egret_native/EgretFrameworkNative/assets/js/resources");
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

            },

            function (callback) {

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