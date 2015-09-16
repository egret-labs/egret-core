/**
 * Created by yanjiaqi on 15/9/16.
 */
/// <reference path="../lib/types.d.ts" />
import TSP = require("./upgrade/2.4.2/TsServiceProxy");
import fs = require("fs");
import file = require('../lib/FileUtil');
import TSS = require("./upgrade/2.4.2/typescriptServices");
import utils = require('../lib/utils');


var DTS = require('./upgrade/2.4.2/compare2dts.js');

var AutoLogger = {
    _snapShot:'',
    _solutionMap:{},
    _dir:'',
    _total:0,
    _isAPIadd : false,
    _api:null,
    _item:null,
    _logContent:{
        title:'API Math.abs discarded,solution:http//www.baidu.com/Math.abs',
        isShow:true
    },
    _categoryQuickLST:{},
    init:function(ignorePath:string):void{
        this._dir = ignorePath;
        this._total = 0;
        var solutionPath = file.joinPath(egret.root,'/tools/commands/upgrade/2.4.2','solution_urls.json');
        this._solutionMap = JSON.parse(file.read(solutionPath));
        this._snapShot = '';
    },
    close:function():void{
        this.clear();
    },
    acceptCategory:function(item:any):void{
        this._categoryQuickLST[item['category-name']] = item;
    },
    logTitle:function(item:any):void{
        //拼title
        var titleStr;
        //无解决方案
        var no_solution = false;
        //是否输出
        var is_show = true;
        //有url确定title
        this._api = item['category-name']+'.'+item['name'];
        if(item['solution-url']){
            titleStr = 'API '+this._api +' 变更,解决方案请查看 '+this._filterUrl(item['solution-url']);
            this._isAPIadd = false;
        }else
        //无解决方案去查快表是否有解决方案
        if(item['category-name'] in this._categoryQuickLST){
            var father_item = this._categoryQuickLST[item['category-name']];
            //快表有url
            if(father_item['solution-url']) {
                titleStr = 'API ' +
                    item['category-name'] + '.*' + ' 变更,解决方案请查看 ' + this._filterUrl(father_item['solution-url']);
                this._isAPIadd = true;
            }else{
                //快表无url查看快表的source属性
                if('solved_name_change.json' == father_item['source']){
                    titleStr = 'API '+ item['category-name'] + '.*' + ' 名称变更,尝试用\'$\'代替\'_\'';
                    this._isAPIadd = true;

                }else
                if('solved_deprecated.json' == father_item['source']){
                    titleStr = 'API '+ item['category-name'] + '.*' + ' 废弃,新版本不再提供兼容';
                    this._isAPIadd = true;
                }else
                if('solved_right.json' == father_item['source']){
                    //不输出
                    titleStr = 'no need output';
                    is_show = false;
                }else{
                    no_solution = true;
                }
            }
        }else{
            no_solution = true;
        }
        if(no_solution){//无解决方案 查看source属性
            if('solved_name_change.json' == item['soucre']){
                titleStr = 'API '+ this._api + ' 名称改变,尝试用\'$\'代替\'_\'';
            }else
            if('solved_deprecated.json' == item['source']){
                titleStr = 'API '+ this._api +' 废弃,新版本不再提供兼容。 '
            }else
            if('solved_right.json' == item['source']){
                //不输出
                titleStr = 'no need output';
                is_show = false;
            }
            this._isAPIadd = false;
        }
        if(titleStr != this._logContent.title){
            this.clear();
            this._logContent.title = titleStr;
            this._logContent.isShow = is_show;
        }
    },
    logRef:function(fileName:string,lineNum:number):void{
        if(!this._logContent.references){
            this._logContent.references = {};
        }
        if(!this._logContent.references[fileName]){
            this._logContent.references[fileName] = {};
        }
        if(!this._logContent.references[fileName][this._api]){
            this._logContent.references[fileName][this._api] = [];
        }
        this._logContent.references[fileName][this._api].push(lineNum);
        this._logContent.references[fileName][this._api].isAPIshow = this._isAPIadd;
    },
    clear:function():void{
        //过滤掉只有title的情况
        if(this._logContent.title && this._logContent.references && this._logContent.isShow){
            //step1
            console.log(this._logContent.title);
            this._snapShot += '\n'+this._logContent.title;
            //step2
            var fileRefLine;
            for(var file_path in this._logContent.references){
                fileRefLine = file.getRelativePath(this._dir,file_path) +' ';
                for(var api in this._logContent.references[file_path]){
                    this._logContent.references[file_path][api].forEach(lineNum=>{
                        //行号需要＋1
                        fileRefLine +=(lineNum + 1)+', ';
                        this._total ++;

                    });
                    fileRefLine = fileRefLine.slice(0,fileRefLine.lastIndexOf(', ')) + '行处引用 ';
                    if(this._logContent.references[file_path][api].isAPIshow){
                        fileRefLine += api + ' ;';
                    };
                }
                console.log(fileRefLine);
                this._snapShot += fileRefLine;
            }
            console.log('\n');
            this._snapShot += '\n';
        }
        //清空_logContent对象
        this._logContent.title = null;
        delete this._logContent.references;
        delete this._api;
        this._isAPIadd = false;
        this.isShow = true;
    },
    _filterUrl:function(key){
        if(key in this._solutionMap){
            return this._solutionMap[key];
        }else
            return key;
    }
}

class APItestCommand implements egret.Command{
    isAsync = true;
    private tsp:TSP.TsServiceProxy;

    execute():number{
        var projectPath = egret.args.projectDir;
        //判断目录是否有效

        this.apiTest(projectPath);
        return DontExitCode;
    }

    private apiTest(projectPath:string) {
        //var open = globals.getOpen();
        //open("https://github.com/egret-labs/egret-core/tree/v2.4.2/docs/cn/2.4.2_ReleaseNotes.md");

        //var projectPath = this.createAndCopyProjectFile();
        var egretRoot = egret.root;
        //var egretPath = "/Users/yanjiaqi/workspace/main/new_1/egret";

        var libPath = file.joinPath(egretRoot,'tools/commands/upgrade/2.4.2/libs');//用自带的旧api检测
        //var libPath = file.joinPath(projectPath,'/libs');//
        var configPath = file.joinPath(egretRoot,'tools/commands/upgrade/2.4.2/solved');
        var searchLST = DTS.load_format(configPath);
        if(searchLST){
            console.log('API 冲突检测中...');
            //ts服务初始化设置
            var settings: TSS.CompilerOptions = {
                mapSourceFiles: true,
                sourceMap: true,
                target: TSS.ScriptTarget.ES5
            };
            this.tsp = new TSP.TsServiceProxy(settings);
            this.tsp.setExceptDir(file.joinPath(projectPath,'src/libs'));
            this.tsp.setDefaultLibFileName(file.joinPath(libPath, 'core','core.d'));
            this.tsp.initProject(projectPath);
            this.tsp.initLibs([libPath]);
            //初始化
            AutoLogger.init(projectPath);
            if('quickLST' in searchLST){
                for(var p in searchLST.quickLST){
                    var item = searchLST.quickLST[p];
                    AutoLogger.acceptCategory(item);
                }
            }
            searchLST.forEach(item =>{
                var searchName = item['name'];
                var fatherName = item['category-name'];
                //if(searchName == 'anchorX' && fatherName == 'DisplayObject' ||
                //    searchName == 'addEventListener' && fatherName == 'DisplayObject' ||
                //    searchName == '_setHeight' && fatherName == 'ScrollView'){
                //    var a;
                //}
                if(searchName == 'addEventListener'){
                    var a;
                }
                var pkg;
                //过滤＊
                if(searchName == '*'){
                    AutoLogger.acceptCategory(item);
                }else{
                    AutoLogger.logTitle(item);
                    //console.log(item.name+'.'+item['category-name']);
                    if(pkg = this.tsp.getDeclarationPosition(fatherName,searchName)){
                        this.tsp.getAllReferenceAccordingDeclarationPosition(
                            pkg.path,pkg.position,fatherName,function(filePath,line){
                                AutoLogger.logRef(filePath,line);
                                //console.log(filePath,line);
                            });
                    }
                }
            });
            AutoLogger.close();

            //写入log并打开log
            var saveLogFilePath = file.joinPath(projectPath,'LOG_'+new Date().toLocaleString()+'_APITEST.txt');
            var saveContent = AutoLogger._snapShot;
            this.saveFileAndOpen(saveLogFilePath,saveContent);
            if(AutoLogger._total === 0){
                globals.exit(1702);
            }else{
                globals.exit(1706,AutoLogger._total);
            }
        }else{
            globals.exit(1705);
        }
    }

    private saveFileAndOpen(filePath:string,content:string){
        file.save(filePath,content);
        utils.open(filePath);
    }
}

export = APItestCommand;