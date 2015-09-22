/**
 * Created by yanjiaqi on 15/9/16.
 */
/// <reference path="../lib/types.d.ts" />
var file = require('../lib/FileUtil');
var utils = require('../lib/utils');
var APITestTool = require('../actions/APITest');
var APItestCommand = (function () {
    function APItestCommand() {
        this.isAsync = true; //APITestTool是一个异步Action必须配置异步环境 很重要
    }
    APItestCommand.prototype.execute = function () {
        var self = this;
        this.projectPath = egret.args.projectDir;
        new APITestTool().execute(this.projectPath, onAPICallBack);
        //this.apiTest(projectPath);
        return DontExitCode;
        function onAPICallBack(error, total, logger) {
            if (error) {
                globals.exit(1705);
            }
            else {
                if (total != 0) {
                    //打开项目目录(异步方法)
                    utils.open(self.projectPath, function (err, stdout, stderr) {
                        if (err) {
                            console.log(stderr);
                        }
                        //延时操作下一步
                        setTimeout(function () {
                            //写入html并打开网址
                            var saveContent = logger._htmlTitle +
                                '<h1>' + self.projectPath + '<b>v2.0.5</b>到<b>v2.4.3</b>API升级检测报告</h1><br>' +
                                '<h2>共计 <b>' + logger.total + '</b> 处冲突,请解决完所有冲突后再执行build</h2><br>' +
                                logger._htmlBody +
                                logger._htmlEnd;
                            //var saveContent = logger._snapShot;
                            if (saveContent != '') {
                                var saveLogFilePath = file.joinPath(self.projectPath, 'LOG_APITEST.html');
                                self.saveFileAndOpen(saveLogFilePath, saveContent);
                                globals.log2(1712, saveLogFilePath);
                            }
                            //sumUpAndEndProcess();
                        }, 200);
                    });
                }
                else {
                    globals.exit(1702);
                }
            }
        }
    };
    APItestCommand.prototype.saveFileAndOpen = function (filePath, content) {
        file.save(filePath, content);
        utils.open(filePath);
    };
    return APItestCommand;
})();
module.exports = APItestCommand;

//# sourceMappingURL=../commands/apitest.js.map