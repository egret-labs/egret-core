/// <reference path="../../lib/types.d.ts" />

//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
import TSP = require("./2.4.2/TsServiceProxy");
import fs = require("fs");
import file = require('../../lib/FileUtil');

var TSS = require("./2.4.2/typescriptServices");
var DTS = require('./2.4.2/compare2dts.js');
var AutoLogger = {
    _total:0,
    _isAPIadd : false,
    _api:null,
    _item:null,
    _logContent:{
        title:'API Math.abs discarded,solution:http//www.baidu.com/Math.abs',
    },
    _categoryQuickLST:{},
    init:function(){
        this._total = 0;
    },
    close:function(){
        this.clear();
        console.log('共计'+this._total+'处 API冲突,请用户修改代码后重试');
    },
    acceptCategory:function(item){
        this._categoryQuickLST[item['category-name']] = item;
    },
    logTitle:function(item){
        //拼title
        var titleStr;
        //有url确定title
        this._api = item['category-name']+'.'+item['name'];
        if(item['solution-url']){
            titleStr = 'API '+this._api +' 变更,解决方案请查看 '+item['solution-url'];
            this._isAPIadd = false;
        }else
        if(item['category-name'] in this._categoryQuickLST && this._categoryQuickLST[item['category-name']]['solution-url']){
           //无url去查快表是否有url
            titleStr = 'API '+
                item['category-name']+'.*' +' 变更,解决方案请查看 '+this._categoryQuickLST[item['category-name']]['solution-url'];
            this._isAPIadd = true;
        }else{
            //无解决方案
            titleStr = 'API '+ this._api +' 废弃,新版本不再提供兼容。 '
            this._isAPIadd = false;
        }
        if(titleStr != this._logContent.title){
            this.clear();
            this._logContent.title = titleStr;
        }
    },
    logRef:function(fileName,lineNum){
        if(!this._logContent.references){
            this._logContent.references = {};
        }
        if(!this._logContent.references[fileName]){
            this._logContent.references[fileName] = {};
            this._logContent.references[fileName][this._api] = [];
        }
        this._logContent.references[fileName][this._api].push(lineNum);
        this._logContent.references[fileName][this._api].isAPIshow = this._isAPIadd;
    },
    clear:function(){
        //过滤掉只有title的情况
        if(this._logContent.references){
            //step1
            console.log(this._logContent.title);
            //step2
            var fileRefLine;
            for(var file_path in this._logContent.references){
                fileRefLine = file_path +' ';
                for(var api in this._logContent.references[file_path]){
                    this._logContent.references[file_path][api].forEach(lineNum=>{
                        fileRefLine +=lineNum+', '
                        this._total ++;

                    });
                    fileRefLine = fileRefLine.slice(0,fileRefLine.lastIndexOf(', ')) + '行处引用 ';
                    if(this._logContent.references[file_path][api].isAPIshow){
                        fileRefLine += api;
                    };
                    console.log(fileRefLine);
                }
            }
            //清空_logContent对象
            this._logContent.title = null;
            delete this._logContent.references;
            delete this._api;
            this._isAPIadd = false;
        }
    }


}

class UpgradeCommand_2_4_2 implements egret.Command {

    private static tsp:TSP.TsServiceProxy;
    execute():number {
        this.upgradeTo_2_4_2();
        return 0;
    }


    private upgradeTo_2_4_2() {

        //var open = globals.getOpen();
        //open("https://github.com/egret-labs/egret-core/tree/v2.4.2/docs/cn/2.4.2_ReleaseNotes.md");
        var projectPath = egret.args.projectDir;
        var egretRoot = egret.args.larkRoot;
        var libPath = file.joinPath(projectPath,'libs/core');
        var configPath = file.joinPath(egretRoot,'tools/commands/upgrade/2.4.2','solved.json');
        var searchLST = DTS.load_format(configPath);
        if(searchLST){
            //ts服务初始化设置
            var settings: TSS.CompilerOptions = {
                mapSourceFiles: true,
                sourceMap: true,
                target: TSS.ScriptTarget.ES5
            };
            this.tsp = new TSP.TsServiceProxy(settings);

            this.tsp.setDefaultLibFileName(file.joinPath(libPath,'core.d'));
            this.tsp.initProject(projectPath);
            this.tsp.initLibs([libPath]);
            AutoLogger.init();
            searchLST.forEach(item =>{
                var searchName = item['name'];
                var fatherName = item['category-name'];
                var pkg;
                if(searchName == '*'){
                    AutoLogger.acceptCategory(item);
                }else{
                    AutoLogger.logTitle(item);
                    if(pkg = this.tsp.getDeclarationPosition(fatherName,searchName)){
                        this.tsp.getAllReferenceAccordingDeclarationPosition(
                            pkg.path,pkg.position,function(filePath,line){
                                AutoLogger.logRef(filePath,line);
                            });
                    }
                }

            });
        }

        AutoLogger.close();
        globals.exit(1702);
    }
}

export = UpgradeCommand_2_4_2;

