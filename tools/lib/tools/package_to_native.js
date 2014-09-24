/**
 * Created by apple on 14-5-29.
 */
var globals = require("../core/globals");

var output = "signed_egret.apk";
var async = require("../core/async.js");
var file = require("../core/file.js");

function run(current, arg, opt) {


    if (opt["-config"]) {
        var content = "{\n" +
            "  \"project\":\"\",\n" +
            "  \"keystore\":\"\",\n" +
            "  \"password\":\"\",\n" +
            "  \"egret-native\":\"EgretFrameworkNative\"\n" +
            "}";
        file.save("package_to_native.config", content);
        return;
    }
    var config = globals.getConfig(arg[0]);
    var keystore = config.keystore;
    var keypass = config.password;
    var project = config.project;
    var native_folder = config["egret-native"];
    var jscmaker = config["jsc-maker"];
    var join = require("path").join;

    async.series(
        [

            function (callback) {
                file.copy(join(project,"bin-debug"), join(native_folder,"assets/egret-game/bin-debug"));
                file.copy(join(project,"launcher"), join(native_folder,"assets/egret-game/launcher"));
                file.copy(join(project,"resource"), join(native_folder,"assets/egret-game/resource"));
                file.copy(join(project,"libs"), join(native_folder,"assets/egret-game/libs"));
//                return;
                callback();
            },


//            function (callback) {
//                var cmd = jscmaker +" " + join(native_folder,"assets")
//                executeCommand(callback, cmd);
//            },

//            function (callback) {
//
//                var list = file.search(join(native_folder,"assets"),"js");
//                list = list.concat( file.search(join(native_folder,"assets"),"js.map"));
//                list.forEach(function(item){
//                    file.remove(item);
//                })
//                callback();
//            },

            function (callback) {
                var cmd = "apktool b " + native_folder + " a.apk";
                executeCommand(callback, cmd);
            },

            function (callback) {
                var cmd = "jarsigner -verbose -keystore  " + keystore + " -storepass " + keypass + " -signedjar " + output + " a.apk " + keystore;
                executeCommand(callback, cmd);
            },

          

            function (callback) {
                file.remove("a.apk");
                var cmd = "adb uninstall org.egret.java.HelloEgret";
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
    cmd.stdout.on("data", function (data) {
        console.log(data);
    })

    cmd.on('exit', function (code) {

        if (code == 0) {
            callback();
        }
        else {
            globals.log("脚本执行失败");
        }

    });
}


exports.run = run;
