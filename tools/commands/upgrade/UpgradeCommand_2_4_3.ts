/// <reference path="../../lib/types.d.ts" />

//import TSP = require("./2.4.2/TsServiceProxy");
import fs = require("fs");
import file = require('../../lib/FileUtil');
import CHILD_EXEC = require('child_process');
//import TSS = require("./2.4.2/typescriptServices");
import utils = require('../../lib/utils');
import APITestTool = require('../../actions/APITest');

declare class AutoLogger{
    _htmlTitle:string;
    _htmlBody:string;
    _htmlEnd:string;
    total:number;
}

class UpgradeCommand_2_4_3 implements egret.Command {
    isAsync = true;
    private asyncCallback:(err?:Error)=>void = null;

    //execute():number {
    execute(asyncCallback?:(err?: Error)=>void): number{
        //globals.exit(1710);
        this.asyncCallback = asyncCallback;
        this.upgradeTo_2_4_2();
        return 1;
    }

    /**
     * step1.创建新项目
     * step2.配置新项目
     * step3.API检测
     */
    private upgradeTo_2_4_2(){
        var projectPath = egret.args.projectDir;
        this.createAndCopyProjectFile(projectPath);
    }

    /**
     * step 1 创建新项目
     * @param projectPath
     */
    private createAndCopyProjectFile(projectPath:string){
        projectPath = projectPath.substr(0,projectPath.lastIndexOf('/'));
        var self = this;
        var adding_suffix:string = '_new';
        var newPath:string = null;
        if(projectPath.indexOf('_new') == -1){
            newPath = projectPath + adding_suffix;
            var i:number = 0;
            while(file.exists(newPath)){
                newPath = projectPath + adding_suffix + (++i);
            }
            //file.copy(projectPath,newPath);
            globals.log2(1707,projectPath,newPath);
            var egretPath = egret.root;
            //var egretPath = "/Users/yanjiaqi/workspace/main/new_1/egret";
            //处理命令行中的空格(用“”抱起来作为一个单独的参数)
            CHILD_EXEC.exec('node \"'+file.joinPath(egretPath,'/tools/bin/egret')+'\" create \"'+newPath+"\"",{
                encoding: 'utf8',
                timeout: 0,
                maxBuffer: 200*1024,
                killSignal: 'SIGTERM',
                cwd: process.cwd(),
                env: process.env
            },function(error,stdout,stderror){
                if(error){
                    //无法创建新目录输出错误日志 直接返回
                    console.log(stderror);
                    self.asyncCallback({name:'消息',message:"无法创建新目录"});
                }else{
                    console.log(stdout);
                    console.log(stderror);
                    self.configNewProject(newPath);
                    self.apiTest(newPath);
                }
            });
        }else{
            //跳过配置新项目
            this.apiTest(projectPath);
        }
    }

    /**
     * step2.配置新项目
     * @param newPath
     */
    private configNewProject(newPath:string){
        //step 1.拷贝src工程文件
        var srcOld = file.joinPath(egret.args.srcDir);
        var srcNew = file.joinPath(newPath,'/src/');
        if (srcOld.toLowerCase() != srcNew.toLowerCase()){
            globals.log2(1707,srcOld,srcNew);
            file.copy(srcOld, srcNew);
        }
        //step 2.拷贝resource资源文件
        var resourceOld = file.joinPath(egret.args.projectDir,'/resource/');
        var resourceNew = file.joinPath(newPath,'/src/resource/');
        if(resourceOld.toLowerCase() != resourceNew.toLowerCase()){
            globals.log2(1707,resourceOld,resourceNew);
            file.copy(resourceOld,resourceNew);
        }
        //step 3.将旧配置注入新配置 和 template/index.html文件
        var oldProperties = require('./ModifyProperties').getProperties();

        var newPropertyPath = file.joinPath(newPath, "egretProperties.json");
        var newProperties = JSON.parse(file.read(newPropertyPath));

        var rplc_parram = [];
        //step 3.1 将引用库的配置加入到index.html中
        if(oldProperties.modules){
            var replaced = '<script src="libs/res/res.js" src-release="libs/res/res.min.js"></script>';
            var added = replaced;
            var isNeedReplace = false;
            oldProperties.modules.forEach(item =>{
                if(item.name == 'gui'){
                    isNeedReplace = true;
                    added += '\n\n\t<script src="libs/gui/gui.js" src-release="libs/gui/gui.min.js"></script>';
                    newProperties.modules.push({"name":item.name});
                }else
                if(item.name == 'dragonbones'){
                    isNeedReplace = true;
                    added += '\n\n\t<script src="libs/dragonbones/dragonbones.js" src-release="libs/dragonbones/dragonbones.min.js"></script>';
                    newProperties.modules.push({"name":item.name});
                }
            });
            if(isNeedReplace) {
                rplc_parram.push(replaced);
                rplc_parram.push(added);
                //保存新配置文件
                var newPropertiesBody = JSON.stringify(newProperties, null, "\t");
                file.save(newPropertyPath, newPropertiesBody);
            }
        }
        //step 3.2 将旧版配置文件的 document_class 属性 配置到template目录下的index.html文件
        var enter_class_name = null;
        if((enter_class_name = oldProperties['document_class']) && enter_class_name != 'Main') {
            globals.log2(1714);
            //globals.log2(1710);
            rplc_parram.push('data-entry-class=\"Main\"');
            rplc_parram.push('data-entry-class=\"' + enter_class_name + '\"');
        }
        this.replaceFileStr(file.joinPath(newPath,'template/index.html'),rplc_parram);
        //step 4.拷贝旧的库文件用于比较(引擎自带历史版本的核心库声明文件)

        //var libOld = file.joinPath(egret.args.projectDir,'/libs');
        //var libOld_temp = file.joinPath(newPath,'/libs_old/');
        //if(libOld.toLowerCase() != libOld_temp.toLowerCase()){
        //    globals.log2(1707,libOld,libOld_temp);
        //    file.copy(libOld,libOld_temp);
        //}

            //找到入口文件替换资源引用
            //    globals.log2(1708);
            //    var enter_class_path = file.joinPath(newPath,'/src/',enter_class_name+'.ts');
            //    var enter_class_body = file.read(enter_class_path);
            //    '自动替换资源引用路径'
            //    if(enter_class_body.match(/RES(\n)./))
            //    RES.
    }

    /**
     * step3.API检测
     * @param projectPath
     */
    private apiTest(projectPath:string) {
        var self = this;
        new APITestTool().execute(projectPath,onAPICallBack);
        function onAPICallBack(error:boolean, total:number|string, logger?:AutoLogger){
            if(error){
                globals.exit(1705);
                self.asyncCallback();
            }else{
                if(total != 0){
                    //打开项目目录(异步方法)
                    utils.open(projectPath,(err,stdout,stderr)=>{
                        if(err){
                            console.log(stderr);
                        }
                        //延时操作下一步
                        setTimeout(()=>{
                            //写入html并打开网址
                            var saveContent =
                                logger._htmlTitle+
                                '<h1>'+ projectPath + '<b>v2.0.5</b>到<b>v2.4.3</b>API升级检测报告</h1><br>' +
                                '<h2>共计 <b>'+logger.total+'</b> 处冲突,请解决完所有冲突后再执行build</h2><br>' +
                                logger._htmlBody +
                                logger._htmlEnd;
                            //var saveContent = logger._snapShot;
                            if(saveContent != ''){
                                var saveLogFilePath = file.joinPath(projectPath,'LOG_APITEST.html');
                                self.saveFileAndOpen(saveLogFilePath,saveContent);
                                globals.log2(1712,saveLogFilePath);//检测结果已写入
                            }
                            globals.log2(1711,projectPath);//工程目录已变更
                            globals.exit(1713);//qq体验群
                            self.asyncCallback();
                        },200);
                    });
                }else{
                    globals.exit(1702);
                    self.asyncCallback();
                }
            }
        }
    }

    private replaceFileStr(filePath:string,mtch_rplc_str_arry:string[]){
        var contentTxt = file.read(filePath);
        if(contentTxt){
            while(mtch_rplc_str_arry.length>1){
                var matchingStr = mtch_rplc_str_arry[0];
                var replaceStr = mtch_rplc_str_arry[1];
                contentTxt = contentTxt.replace(matchingStr,replaceStr);
                mtch_rplc_str_arry = mtch_rplc_str_arry.slice(2);
            }
            file.save(filePath,contentTxt);
        }
    }

    private saveFileAndOpen(filePath:string,content:string){
        file.save(filePath,content);
        utils.open(filePath);
    }
}

export = UpgradeCommand_2_4_3;
