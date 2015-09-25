/**
 * Created by yanjiaqi on 15/9/16.
 */
/// <reference path="../lib/types.d.ts" />
import file = require('../lib/FileUtil');
import utils = require('../lib/utils');
import APITestTool = require('../actions/APITest');

declare class AutoLogger{
    _htmlBody:string;
    total:number;
    htmlOut(injector?:any):string;
    HTML_FILENAME :string
}

class APItestCommand implements egret.Command{
    isAsync = true;//APITestTool是一个异步Action必须配置异步环境 很重要
    projectPath:string;
    execute(successCallBack?:()=>boolean):number{
        var self = this;
        this.projectPath = egret.args.projectDir;
        new APITestTool().execute(this.projectPath,onAPICallBack);
        //this.apiTest(projectPath);
        return DontExitCode;

        function onAPICallBack(error:boolean, total:number|string, logger?:AutoLogger){
            if(error){
                globals.exit(1705);
            }else{
                if(total != 0){
                    //打开项目目录(异步方法)
                    utils.open(self.projectPath,(err,stdout,stderr)=>{
                        if(err){
                            console.log(stderr);
                        }
                        //延时操作下一步
                        setTimeout(()=>{
                            //写入html并打开网址
                            if(logger._htmlBody != ''){
                                var currentVersion = egret.args.properties.getVersion();
                                var saveContent = logger.htmlOut(
                                    //为模版html注入属性值
                                    {   'dir':self.projectPath,
                                        'version_old':globals.compressVersion(currentVersion,"2.5.0")<0?currentVersion:'',
                                        'version_new':"2.5.0",
                                        'conflict_count':logger.total+'',
                                        'title':'API检测报告',
                                        'dir_changed_tip':'',
                                        'qq_new_feature':'如果您在升级过程中遇到了问题，请在 <a target="_blank" href="http://bbs.egret.com/forum.php?mod=viewthread&tid=11702&extra=&page=1">这里</a>回帖',//qq体验群
                                        'color_red':'',
                                        'color_green':'',
                                        'color_normal':''
                                    });
                                var saveLogFilePath = file.joinPath(self.projectPath,logger.HTML_FILENAME);
                                self.saveFileAndOpen(saveLogFilePath,saveContent);
                                globals.exit(1712,saveLogFilePath);//检测结果已写入
                            }
                            //sumUpAndEndProcess();
                        },200);
                    });
                }else{
                    if(successCallBack && successCallBack()){
                    }else{
                        globals.exit(1715);//项目检测成功
                    }
                }
            }
        }
    }

    private saveFileAndOpen(filePath:string,content:string){
        file.save(filePath,content);
        utils.open(filePath);
    }

}

export = APItestCommand;