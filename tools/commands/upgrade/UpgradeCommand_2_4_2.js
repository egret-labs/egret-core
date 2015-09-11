/// <reference path="../../lib/types.d.ts" />
//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
var TSP = require("./2.4.2/TsServiceProxy");
var file = require('../../lib/FileUtil');
var CHILD_EXEC = require('child_process');
var TSS = require("./2.4.2/typescriptServices");
var DTS = require('./2.4.2/compare2dts.js');
var AutoLogger = {
    _dir: string = '',
    _total: 0,
    _isAPIadd: false,
    _api: null,
    _item: null,
    _logContent: {
        title: 'API Math.abs discarded,solution:http//www.baidu.com/Math.abs',
        isShow: true
    },
    _categoryQuickLST: {},
    init: function (ignorePath) {
        this._dir = ignorePath;
        this._total = 0;
    },
    close: function () {
        this.clear();
    },
    acceptCategory: function (item) {
        this._categoryQuickLST[item['category-name']] = item;
    },
    logTitle: function (item) {
        //拼title
        var titleStr;
        //无解决方案
        var no_solution = false;
        //是否输出
        var is_show = true;
        //有url确定title
        this._api = item['category-name'] + '.' + item['name'];
        if (item['solution-url']) {
            titleStr = 'API ' + this._api + ' 变更,解决方案请查看 ' + item['solution-url'];
            this._isAPIadd = false;
        }
        else 
        //无解决方案去查快表是否有解决方案
        if (item['category-name'] in this._categoryQuickLST) {
            var father_item = this._categoryQuickLST[item['category-name']];
            //快表有url
            if (father_item['solution-url']) {
                titleStr = 'API ' +
                    item['category-name'] + '.*' + ' 变更,解决方案请查看 ' + father_item['solution-url'];
                this._isAPIadd = true;
            }
            else {
                //快表无url查看快表的source属性
                if ('solved_name_change.json' == father_item['source']) {
                    titleStr = 'API ' + item['category-name'] + '.*' + ' 名称变更,尝试用\'$\'代替\'_\'';
                    this._isAPIadd = true;
                }
                else if ('solved_deprecated.json' == father_item['source']) {
                    titleStr = 'API ' + item['category-name'] + '.*' + ' 废弃,新版本不再提供兼容';
                    this._isAPIadd = true;
                }
                else if ('solved_right.json' == father_item['source']) {
                    //不输出
                    titleStr = 'no need output';
                    is_show = false;
                }
                else {
                    no_solution = true;
                }
            }
        }
        else {
            no_solution = true;
        }
        if (no_solution) {
            if ('solved_name_change.json' == item['soucre']) {
                titleStr = 'API ' + this._api + ' 名称改变,尝试用\'$\'代替\'_\'';
            }
            else if ('solved_deprecated.json' == item['source']) {
                titleStr = 'API ' + this._api + ' 废弃,新版本不再提供兼容。 ';
            }
            else if ('solved_right.json' == item['source']) {
                //不输出
                titleStr = 'no need output';
                is_show = false;
            }
            this._isAPIadd = false;
        }
        if (titleStr != this._logContent.title) {
            this.clear();
            this._logContent.title = titleStr;
            this._logContent.isShow = is_show;
        }
    },
    logRef: function (fileName, lineNum) {
        if (!this._logContent.references) {
            this._logContent.references = {};
        }
        if (!this._logContent.references[fileName]) {
            this._logContent.references[fileName] = {};
        }
        if (!this._logContent.references[fileName][this._api]) {
            this._logContent.references[fileName][this._api] = [];
        }
        this._logContent.references[fileName][this._api].push(lineNum);
        this._logContent.references[fileName][this._api].isAPIshow = this._isAPIadd;
    },
    clear: function () {
        var _this = this;
        //过滤掉只有title的情况
        if (this._logContent.title && this._logContent.references && this._logContent.isShow) {
            //step1
            console.log(this._logContent.title);
            //step2
            var fileRefLine;
            for (var file_path in this._logContent.references) {
                fileRefLine = file.getRelativePath(this._dir, file_path) + ' ';
                for (var api in this._logContent.references[file_path]) {
                    this._logContent.references[file_path][api].forEach(function (lineNum) {
                        //行号需要＋1
                        fileRefLine += (lineNum + 1) + ', ';
                        _this._total++;
                    });
                    fileRefLine = fileRefLine.slice(0, fileRefLine.lastIndexOf(', ')) + '行处引用 ';
                    if (this._logContent.references[file_path][api].isAPIshow) {
                        fileRefLine += api;
                    }
                    ;
                    console.log(fileRefLine);
                }
            }
            console.log('\n');
        }
        //清空_logContent对象
        this._logContent.title = null;
        delete this._logContent.references;
        delete this._api;
        this._isAPIadd = false;
        this.isShow = true;
    }
};
var UpgradeCommand_2_4_2 = (function () {
    function UpgradeCommand_2_4_2() {
    }
    UpgradeCommand_2_4_2.prototype.execute = function () {
        console.log("升级失败");
        //var new_project_path =  this.createAndCopyProjectFile(egret.args.projectDir);
        //this.upgradeTo_2_4_2(new_project_path);
        return 1;
    };
    UpgradeCommand_2_4_2.prototype.createAndCopyProjectFile = function (projectPath) {
        projectPath = projectPath.substr(0, projectPath.lastIndexOf('/'));
        var adding_suffix = '_bak';
        var newPath = null;
        if (projectPath.indexOf('_bak') == -1) {
            newPath = projectPath + adding_suffix;
            var i = 0;
            while (file.exists(newPath)) {
                newPath = projectPath + adding_suffix + (++i);
            }
            //file.copy(projectPath,newPath);
            //step 1.拷贝新项目
            globals.log2(1707, projectPath, newPath);
            var egretPath = egret.root;
            //var egretPath = "/Users/yanjiaqi/workspace/main/new_1/egret";
            var cp = CHILD_EXEC.execSync('node ' + file.joinPath(egretPath, '/tools/bin/egret') + ' create ' + newPath, {
                encoding: 'utf8',
                timeout: 0,
                maxBuffer: 200 * 1024,
                killSignal: 'SIGTERM',
                cwd: process.cwd(),
                env: process.env
            });
            if (cp != 0) {
                //step 2.拷贝src工程文件
                var srcOld = file.joinPath(egret.args.srcDir);
                var srcNew = file.joinPath(newPath, '/src/');
                if (srcOld.toLowerCase() != srcNew.toLowerCase()) {
                    globals.log2(1707, srcOld, srcNew);
                    file.copy(srcOld, srcNew);
                }
                //step 3.拷贝resource资源文件
                var resourceOld = file.joinPath(egret.args.projectDir, '/resource/');
                var resourceNew = file.joinPath(newPath, '/src/resource/');
                if (resourceOld.toLowerCase() != resourceNew.toLowerCase()) {
                    globals.log2(1707, resourceOld, resourceNew);
                    file.copy(resourceOld, resourceNew);
                }
                //step 4.配置入口文件
                //将旧版配置文件的 document_class 属性 配置到template目录下的index.html文件
                var oldProperties = require('./ModifyProperties').getProperties();
                var enter_class_name = null;
                if ((enter_class_name = oldProperties['document_class']) && enter_class_name != 'Main') {
                    globals.log2(1710);
                    this.replaceFileStr(file.joinPath(newPath, 'template/index.html'), 'data-entry-class=\"Main\"', 'data-entry-class=\"' + enter_class_name + '\"');
                }
                //step 5.拷贝旧的库文件用于比较
                var libOld = file.joinPath(egret.args.projectDir, '/libs');
                var libOld_temp = file.joinPath(newPath, 'src/libs_old/');
                if (libOld.toLowerCase() != libOld_temp.toLowerCase()) {
                    globals.log2(1707, libOld, libOld_temp);
                    file.copy(libOld, libOld_temp);
                }
            }
        }
        else {
            newPath = projectPath;
        }
        return newPath;
    };
    UpgradeCommand_2_4_2.prototype.upgradeTo_2_4_2 = function (projectPath) {
        //var open = globals.getOpen();
        //open("https://github.com/egret-labs/egret-core/tree/v2.4.2/docs/cn/2.4.2_ReleaseNotes.md");
        var _this = this;
        //var projectPath = this.createAndCopyProjectFile();
        var egretRoot = egret.root;
        //var egretPath = "/Users/yanjiaqi/workspace/main/new_1/egret";
        var libPath = file.joinPath(projectPath, '/src/libs_old'); //用旧的api检测
        //var libPath = file.joinPath(projectPath,'/libs');//
        var configPath = file.joinPath(egretRoot, 'tools/commands/upgrade/2.4.2/solved');
        var searchLST = DTS.load_format(configPath);
        if (searchLST) {
            console.log('API 冲突检测中...');
            //ts服务初始化设置
            var settings = {
                mapSourceFiles: true,
                sourceMap: true,
                target: TSS.ScriptTarget.ES5
            };
            this.tsp = new TSP.TsServiceProxy(settings);
            this.tsp.setExceptDir(file.joinPath(projectPath, 'src/libs'));
            this.tsp.setDefaultLibFileName(file.joinPath(libPath, 'core', 'core.d'));
            this.tsp.initProject(projectPath);
            this.tsp.initLibs([libPath]);
            AutoLogger.init(projectPath);
            searchLST.forEach(function (item) {
                var searchName = item['name'];
                var fatherName = item['category-name'];
                if (searchName == 'anchorX' && fatherName == 'DisplayObject' ||
                    searchName == 'addEventListener' && fatherName == 'DisplayObject' ||
                    searchName == '_setHeight' && fatherName == 'ScrollView') {
                    var a;
                }
                var pkg;
                if (searchName == '*') {
                    AutoLogger.acceptCategory(item);
                }
                else {
                    AutoLogger.logTitle(item);
                    if (pkg = _this.tsp.getDeclarationPosition(fatherName, searchName)) {
                        _this.tsp.getAllReferenceAccordingDeclarationPosition(pkg.path, pkg.position, function (filePath, line) {
                            AutoLogger.logRef(filePath, line);
                        });
                    }
                }
            });
            AutoLogger.close();
            if (AutoLogger._total === 0) {
                //执行拷贝
                globals.exit(1702);
            }
            else {
                globals.exit(1706, AutoLogger._total);
            }
        }
        else {
            globals.exit(1705);
        }
    };
    UpgradeCommand_2_4_2.prototype.replaceFileStr = function (filePath, matchingStr, replaceStr) {
        var contentTxt = file.read(filePath);
        if (contentTxt) {
            file.save(filePath, contentTxt.replace(matchingStr, replaceStr));
        }
    };
    return UpgradeCommand_2_4_2;
})();
module.exports = UpgradeCommand_2_4_2;

//# sourceMappingURL=../../commands/upgrade/UpgradeCommand_2_4_2.js.map