///<reference path="typescriptServices.d.ts" />
var TSS = require("./typescriptServices");
var fs = require("fs");
//import Logger = require("./utils/Logger");
var path = require('path');
var file = require('../../../lib/FileUtil');
var Logger = {
    log: function (a, b, c, d, e) {
        //var consoleLog = arguments[0];
        //if(arguments[1]){
        //	if(arguments[1] instanceof Array){
        //		arguments[1].forEach(function(item){consoleLog += item});
        //	}else{
        //		consoleLog += arguments[1];
        //	}
        //}
        //console.log(consoleLog);
    },
};
/**
 * ts服务代理，对原始服务和host进行了封装
 * @author featherJ
 */
var TsServiceProxy = (function () {
    function TsServiceProxy(settings) {
        //已经加载过的库的缓存列表
        this.libList = [];
        //已经加载过的代码的缓存列表
        this.scriptList = [];
        this.extLibs = new Array();
        this.host = new Host();
        this.tss = TSS.createLanguageService(this.host, TSS.createDocumentRegistry());
        this.host.settings = settings;
        this.host.tss = this.tss;
    }
    /**
     * 读取基本库的代码，此方法需要在项目初始化的时候调用。
     * @param dir {string} 目录路径
     */
    TsServiceProxy.prototype.initLibs = function (paths) {
        Logger.log("初始化基本库目录: ", paths);
        //先移除之前加载的所有库
        for (var i = 0; i < this.libList.length; i++) {
            this.host.removeScript(this.libList[i]);
        }
        this.libList = [];
        if (global.gc)
            global.gc();
        //重新加载指定的新库
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if (path.charAt(path.length - 1) == "/")
                path = path.slice(0, path.length - 1);
            this.readDir(path, this.libAdded_handler, this);
        }
    };
    TsServiceProxy.prototype.libAdded_handler = function (path) {
        this.libList.push(path);
    };
    /**
     * 读取项目内的代码，此方法需要在项目初始化的时候调用。
     * 此方法会读项目目录下的libs目录和src目录，并加载内部的*.ts资源。
     * @param dir {string} 目录路径
     */
    TsServiceProxy.prototype.initProject = function (_path) {
        Logger.log("初始化项目目录: ", _path);
        //先移除已经加载的全部代码（不包括库）
        for (var i = 0; i < this.scriptList.length; i++) {
            this.host.removeScript(this.scriptList[i]);
        }
        this.scriptList = [];
        //初始化扩展库
        this.initExtLibs(_path);
        //初始化项目内的所有ts代码
        this.readDir(file.joinPath(_path, "libs_old"), this.scriptAdded_handler, this);
        this.readDir(file.joinPath(_path, "src"), this.scriptAdded_handler, this);
    };
    TsServiceProxy.prototype.setDefaultLibFileName = function (fileName) {
        this.host.setDefaultLibFileName(fileName);
    };
    TsServiceProxy.prototype.setExceptDir = function (dir) {
        this.exceptDir = dir;
    };
    /**
     * 初始化扩展库，用于加入到排除列表内
     * @param path {string} 项目路径
     */
    TsServiceProxy.prototype.initExtLibs = function (path) {
        Logger.log("初始化扩展库");
        this.extLibs = new Array();
        var egretPropertisFs;
        try {
            egretPropertisFs = fs.statSync(path + "/egretProperties.json");
        }
        catch (e) { }
        if (!egretPropertisFs || !egretPropertisFs.isFile)
            return;
        var egretPropertisContent = fs.readFileSync(path + "/egretProperties.json", "utf-8");
        var egretPropertis = JSON.parse(egretPropertisContent);
        var modules = egretPropertis["modules"];
        if (!modules)
            return;
        for (var i = 0; i < modules.length; i++) {
            if (modules[i]["path"]) {
                this.parserExtLib(path, modules[i]["path"], modules[i]["name"]);
            }
        }
    };
    /**
     * 解析扩展库模块
     * @param projectPath {string} 项目路径
     * @param configPath {string} 扩展库配置路径
     * @param configPathName {string} 扩展库配置名
     */
    TsServiceProxy.prototype.parserExtLib = function (projectPath, configPath, configPathName) {
        var configAbsolutePath = "";
        configAbsolutePath = path.resolve(projectPath, configPath, configPathName + ".json");
        var configFs;
        try {
            configFs = fs.statSync(configPath);
        }
        catch (e) { }
        if (!configFs || !configFs.isFile)
            return;
        var configContent = fs.readFileSync(configAbsolutePath, "utf-8");
        var config = JSON.parse(configContent);
        var filePath = new Array();
        var source = config["source"];
        var file_list = config["file_list"];
        if (source && file_list) {
            for (var i = 0; i < file_list.length; i++) {
                var currentFilePath = path.resolve(projectPath, configPath, source, file_list[i]);
                var currentFile;
                try {
                    currentFile = fs.statSync(currentFilePath);
                }
                catch (e) { }
                if (currentFile && currentFile.isFile) {
                    currentFilePath = currentFilePath.replace(/\\/g, "/");
                    this.extLibs.push(currentFilePath);
                }
            }
        }
    };
    TsServiceProxy.prototype.scriptAdded_handler = function (path) {
        this.scriptList.push(path);
    };
    /**
     * 清空，释放
     */
    TsServiceProxy.prototype.dispose = function () {
        this.tss.dispose();
    };
    /**
     * 读取目录，此方法会过滤掉.svn目录以及.git目录
     * @param dir {string} 目录路径
     */
    TsServiceProxy.prototype.readDir = function (dir, onComplete, target) {
        if (onComplete === void 0) { onComplete = null; }
        if (target === void 0) { target = null; }
        Logger.log("读取目录:", dir);
        if (dir == this.exceptDir)
            return;
        var items;
        try {
            items = fs.readdirSync(dir);
        }
        catch (e) { }
        if (!items)
            return;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var stat = fs.statSync(dir + "/" + item);
            if (stat.isDirectory() && item != ".svn" && item != ".git") {
                this.readDir(dir + "/" + item, onComplete, target);
            }
            else if (stat.isFile() && item.lastIndexOf('.ts') == item.length - 3 && item.indexOf(".ts") != -1) {
                Logger.log("读取文件:", dir + "/" + item);
                var content = fs.readFileSync(dir + "/" + item, "utf-8");
                this.host.addScript(dir + "/" + item, content);
                if (onComplete && target)
                    onComplete.call(target, dir + "/" + item);
            }
        }
    };
    /**
     * 添加代码
     * @param filePath {string} 代码标识
    * @param content {string} 文本内容
*/
    TsServiceProxy.prototype.addScript = function (filePath, content) {
        Logger.log("添加代码:", filePath);
        this.host.addScript(filePath, content);
        this.host.updateScript(filePath, content);
        this.scriptList.push(filePath);
    };
    /**
     * 移除代码
* @param filePath {string} 代码标识
*/
    TsServiceProxy.prototype.removeScript = function (filePath) {
        Logger.log("移除代码:", filePath);
        this.host.removeScript(filePath);
        for (var i = 0; i < this.scriptList.length; i++) {
            if (this.scriptList[i] == filePath) {
                for (var j = i; j < this.scriptList.length - 1; j++) {
                    this.scriptList[j] = this.scriptList[j + 1];
                }
                this.scriptList.pop();
                break;
            }
        }
    };
    /**
     * 更新代码
     * @param filePath {string} 代码标识
     * @param content {string} 文本内容
     */
    TsServiceProxy.prototype.updateScript = function (filePath, content, isLog) {
        if (isLog === void 0) { isLog = true; }
        if (isLog)
            Logger.log("更新代码:", filePath, content.length);
        try {
            this.host.updateScript(filePath, content);
        }
        catch (e) {
            Logger.log(e);
        }
    };
    /**
     * 更新代码路径
     * @param filePath {string} 代码标识
     * @param newPath {string} 新的代码标识
     */
    TsServiceProxy.prototype.renameScript = function (filePath, newPath) {
        Logger.log("重命名代码:", filePath, newPath);
        var content = this.host.getScriptInfo(filePath).content;
        this.removeScript(filePath);
        this.addScript(newPath, content);
    };
    /**
     * 编辑代码
     * @param filePath {string} 代码标识
     * @param startIndex {number} 编辑的起始索引（包括）
     * @param endIndex {number} 编辑的结束索引（不包括）
     * @param newText {string} 新的文本内容
     */
    TsServiceProxy.prototype.editScript = function (filePath, startIndex, endIndex, newText) {
        Logger.log("编辑代码:", filePath, startIndex, endIndex, newText.length);
        this.host.editScript(filePath, startIndex, endIndex, newText);
        var content = this.host.getScriptInfo(filePath).content;
        var lastChar = content.slice(content.length - 1, content.length);
        //经过测试更新一下最后一个字符可以使得整个文档都刷新一下，以防止其他获取不正常的情况
        this.host.editScript(filePath, content.length - 1, content.length, lastChar);
    };
    /**
* 得到大纲
  * @param filePath {string} 代码标识
      */
    TsServiceProxy.prototype.getOutline = function (filePath) {
        Logger.log("得到大纲:", filePath);
        return this.tss.getNavigationBarItems(filePath);
    };
    /**
     * 得到代码提示
     * @param filePath {string} 代码标识
     * @param position {number} 寻找的位置
     */
    TsServiceProxy.prototype.getCompletions = function (filePath, position) {
        Logger.log("得到代码提示:", filePath, position);
        var completionInfo = this.tss.getCompletionsAtPosition(filePath, position);
        return completionInfo;
    };
    /**
     * 得到代码提示,详细信息。
     * @param filePath {string} 代码标识
     * @param position {number} 寻找的位置
     * @param name {string} 要查找的内容
     */
    TsServiceProxy.prototype.getCompletionDetails = function (filePath, position, name) {
        Logger.log("得到详细代码提示:", filePath, position, name);
        return this.tss.getCompletionEntryDetails(filePath, position, name);
    };
    /**
* 获取方法签名提示信息，该方法只有方法的参数等，没有doc信息。
  * @param filePath {string} 代码标识
        * @param position {number} 寻找的位置
      */
    TsServiceProxy.prototype.getSignature = function (filePath, position) {
        Logger.log("获取签名提示:", filePath, position);
        return this.tss.getSignatureHelpItems(filePath, position);
    };
    /**
* 获取指定位置的定义
  * @param filePath {string} 代码标识
        * @param position {number} 寻找的位置
      */
    TsServiceProxy.prototype.getDefinition = function (filePath, position) {
        Logger.log("获取定义:", filePath, position);
        return this.tss.getDefinitionAtPosition(filePath, position);
    };
    /**
* 获取指定位置的引用
  * @param filePath {string} 代码标识
        * @param position {number} 寻找的位置
      */
    TsServiceProxy.prototype.getReferences = function (filePath, position) {
        Logger.log("得到引用:", filePath, position);
        return this.tss.getReferencesAtPosition(filePath, position);
    };
    /**
*获取指定字符串的定义位置
     * @param searchValue 字符串
     */
    TsServiceProxy.prototype.getDeclarationPosition = function (searchContainer, searchValue) {
        var declarations = this.tss.getNavigateToItems(searchValue);
        var targetDeclaration;
        var res = [];
        for (var i = 0; i < declarations.length; i++) {
            if (declarations[i].name == searchValue && declarations[i].containerName == searchContainer) {
                targetDeclaration = declarations[i];
                Logger.log('搜索:' + searchContainer + '.' + searchValue);
                return { path: targetDeclaration.fileName, position: targetDeclaration.textSpan['start'] };
            }
        }
        return null;
    };
    TsServiceProxy.prototype.getAllReferenceAccordingDeclarationPosition = function (filePath, position, callBack) {
        var _this = this;
        var res = this.getReferences(filePath, position);
        if (res) {
            Logger.log('找到:' + res.length + '处引用');
            res.forEach(function (resItem) {
                if (resItem.fileName.indexOf('src') != -1 &&
                    resItem.fileName.indexOf('.d.ts') == -1) {
                    var pos = _this.getLineAndCharacterOfPosition(_this.tss.getSourceFile(resItem.fileName), resItem.textSpan.start);
                    callBack(resItem.fileName, pos.line);
                }
            });
        }
    };
    TsServiceProxy.prototype.getLineAndCharacterOfPosition = function (sourceFile, position) {
        return TSS.getLineAndCharacterOfPosition(sourceFile, position);
    };
    /**
* 获取指定位置的高亮内容
  * @param filePath {string} 代码标识
        * @param position {number} 寻找的位置
      */
    TsServiceProxy.prototype.getOccurrences = function (filePath, position) {
        Logger.log("得到高亮:", filePath, position);
        return this.tss.getOccurrencesAtPosition(filePath, position);
    };
    /**
    * 获取指定位置的高亮内容
    * @param filePath {string} 代码标识
    * @param position {number} 寻找的位置
    */
    TsServiceProxy.prototype.getDiagnostics = function (filePath) {
        Logger.log("获得诊断信息:", filePath);
        //检查如果有扩展库则缓存起来，并从代码中移除
        var extLibContents = new Array();
        for (var i = 0; i < this.extLibs.length; i++) {
            var scriptInfo = this.host.getScriptInfo(this.extLibs[i]);
            if (scriptInfo) {
                var extContent = scriptInfo.content;
                extLibContents.push({
                    "path": this.extLibs[i],
                    "content": extContent
                });
                this.removeScript(this.extLibs[i]);
            }
        }
        //如果不存在该文件
        if (!this.host.contains(filePath)) {
            //将缓存的扩展库添加回去
            for (var i = 0; i < extLibContents.length; i++) {
                this.addScript(extLibContents[i]["path"], extLibContents[i]["content"]);
            }
            return {
                diagnostics: [],
                filePath: filePath
            };
        }
        var stt = this.tss.getSyntacticDiagnostics(filePath);
        var smt = this.tss.getSemanticDiagnostics(filePath);
        var compile = this.tss.getCompilerOptionsDiagnostics() || [];
        if (compile && compile.length)
            compile = compile.filter(function (d) { return d.file != null && d.file.fileName == filePath; });
        var diagnostics = stt.concat(smt).concat(compile);
        diagnostics = diagnostics.map(function (d) {
            d.file = d.file.fileName;
            return d;
        });
        var result = new Array();
        for (var i = 0; i < diagnostics.length; i++) {
            var currentDiagnostic = new Array();
            if (typeof diagnostics[i].messageText === "string") {
                currentDiagnostic.push({
                    code: diagnostics[i].code,
                    msg: diagnostics[i].messageText,
                    category: diagnostics[i].category
                });
            }
            else {
                this.fixDiagnostics(currentDiagnostic, diagnostics[i].messageText);
            }
            result.push({
                start: diagnostics[i].start,
                length: diagnostics[i].length,
                diagnostic: currentDiagnostic
            });
        }
        var obj = {
            diagnostics: result,
            filePath: filePath
        };
        //将缓存的扩展库添加回去
        for (var i = 0; i < extLibContents.length; i++) {
            this.addScript(extLibContents[i]["path"], extLibContents[i]["content"]);
        }
        return obj;
    };
    /**
     * 修复错误诊断信息，递归为一个数组
     *
     */
    TsServiceProxy.prototype.fixDiagnostics = function (list, diagnostic) {
        list.push({
            code: diagnostic.code,
            msg: diagnostic.messageText,
            category: diagnostic.category
        });
        if (diagnostic.next) {
            this.fixDiagnostics(list, diagnostic.next);
        }
    };
    /**
* 格式化指定区域
  * @param filePath {string} 代码标识
        * @param startIndex {number} 编辑的起始索引（包括）
        * @param endIndex {number} 编辑的结束索引（不包括）
        * @param option 格式化选项
      */
    TsServiceProxy.prototype.getFormattingCode = function (filePath, startIndex, endIndex, option) {
        Logger.log("格式化代码:", filePath, startIndex, endIndex);
        return this.tss.getFormattingEditsForRange(filePath, startIndex, endIndex, option);
    };
    /**
* 得到某一个键后的格式化
  * @param filePath {string} 代码标识
        * @param position {number} 位置
        * @param key {number} 要输入的键
        * @param option 格式化选项
      */
    TsServiceProxy.prototype.getFormattingAfterKey = function (filePath, position, key, option) {
        Logger.log("格式化键入:", filePath, position, key);
        return this.tss.getFormattingEditsAfterKeystroke(filePath, position, key, option);
    };
    /**
* 得到匹配括号
* @param filePath {string} 代码标识
* @param position {number} 寻找的位置
*/
    TsServiceProxy.prototype.getBraceMatching = function (filePath, position) {
        Logger.log("得到匹配括号:", filePath, position);
        return this.tss.getBraceMatchingAtPosition(filePath, position);
    };
    /**
* 得到指定区域的代码分类，用于代码着色,此方法会综合getSyntacticClassifications与getSemanticClassifications。
  * @param filePath {string} 代码标识
        * @param startIndex {number} 编辑的起始索引（包括）
        * @param endIndex {number} 编辑的结束索引（不包括）
      */
    TsServiceProxy.prototype.getClassifications = function (filePath, startIndex, endIndex) {
        Logger.log("得到着色信息:", filePath, startIndex, endIndex);
        var stc = this.tss.getEncodedSyntacticClassifications(filePath, TSS.createTextSpan(startIndex, endIndex - startIndex)).spans;
        var smc = this.tss.getEncodedSemanticClassifications(filePath, TSS.createTextSpan(startIndex, endIndex - startIndex)).spans;
        var result = new Array();
        var indexCatch = 0;
        for (var i = 0; i < stc.length; i += 3) {
            var index = -1;
            for (var j = indexCatch; j < smc.length; j += 3) {
                if (smc[j] == stc[i] && smc[j + 1] == stc[i + 1]) {
                    index = j;
                    indexCatch = index;
                    break;
                }
            }
            if (index != -1) {
                var start = smc[index];
                var end = smc[index] + smc[index + 1];
                if ((start >= startIndex && end <= endIndex)) {
                    result.push(smc[index]);
                    result.push(smc[index + 1]);
                    result.push(smc[index + 2]);
                }
            }
            else {
                var start = stc[i];
                var end = stc[i] + stc[i + 1];
                if ((start >= startIndex && end <= endIndex)) {
                    result.push(stc[i]);
                    result.push(stc[i + 1]);
                    result.push(stc[i + 2]);
                }
            }
        }
        return result;
    };
    /**
* 得到整个文件的代码分类,此方法会综合getSyntacticClassifications与getSemanticClassifications。
  * @param filePath {string} 代码标识
        * @param startIndex {number} 编辑的起始索引（包括）
        * @param endIndex {number} 编辑的结束索引（不包括）
      */
    TsServiceProxy.prototype.getClassificationsAll = function (filePath) {
        Logger.log("得到全部代码着色", filePath);
        var code = this.host.getScriptInfo(filePath).content;
        var len = code.length;
        var result = this.getClassifications(filePath, 0, len);
        return result;
    };
    /**
* 获取缩进数量
* @param filePath {string} 代码标识
* @param position {number} 寻找的位置
     * @param optiton {TSS.EditorOptions} 配置参数
*/
    TsServiceProxy.prototype.getIndentation = function (filePath, position, optiton) {
        Logger.log("得到缩进:", filePath, position);
        return this.tss.getIndentationAtPosition(filePath, position, optiton);
    };
    /**
* 在指定的位置获得doc信息
* @param filePath {string} 代码标识
* @param position {number} 寻找的位置
     * @param optiton {TSS.EditorOptions} 配置参数
*/
    TsServiceProxy.prototype.getDoc = function (filePath, position) {
        Logger.log("得到Doc:", filePath, position);
        return this.tss.getQuickInfoAtPosition(filePath, position);
    };
    /**
* 全局查找
* @param searchValue {string} 要查找的内容
*/
    TsServiceProxy.prototype.search = function (searchValue) {
        Logger.log("全局查找:", searchValue);
        return this.tss.getNavigateToItems(searchValue);
    };
    /**
* 得到重命名信息
* @param filePath {string} 代码标识
* @param position {number} 寻找的位置
  *	@param findInStrings {boolean} 在字符串中重命名
  *	@param findInComments {boolean} 在注释中重命名
*/
    TsServiceProxy.prototype.findRenameLocations = function (filePath, position, findInStrings, findInComments) {
        Logger.log("获得重命名信息:", filePath, position);
        this.tss.findRenameLocations;
        if (this.tss.getRenameInfo(filePath, position).canRename) {
            return this.tss.findRenameLocations(filePath, position, findInStrings, findInComments);
        }
        return [];
    };
    /**
* 得到指定文件的折叠层次
* @param filePath {string} 代码标识
*/
    TsServiceProxy.prototype.getOutliningSpans = function (filePath) {
        Logger.log("得到折叠层次:", filePath);
        return this.tss.getOutliningSpans(filePath);
    };
    /**
* 获取该位置能否打断点，及断点最终位置
* @param filePath {string} 代码标识
* @param position {number} 位置
*/
    TsServiceProxy.prototype.getCanBreakpoint = function (filePath, position) {
        Logger.log("断点信息:", filePath, position);
        if (this.host.contains(filePath)) {
            //读取一下本地文件
            var fileContent = fs.readFileSync(filePath, "utf-8");
            //缓存一下当前编辑的文件
            var contentCatch = this.host.getScriptInfo(filePath).content;
            //在本地文件中查找是否可以设置断点
            this.updateScript(filePath, fileContent, false);
            var result;
            var pos = position;
            while (true) {
                result = this.tss.getBreakpointStatementAtPosition(filePath, pos);
                if (!result) {
                    pos++;
                    if (pos >= fileContent.length) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            //还原正在编辑的文件
            this.updateScript(filePath, contentCatch, false);
        }
        Logger.log(result);
        if (result)
            return result;
        return null;
    };
    /**
     * 语义分割，用于调试  this.text.indexOf => 鼠标在 indexOf 上，告诉你this.text.indexOf是完整的语句
     * @param filePath {string} 代码标识
     * @param startIndex {number} 起始索引（包括）
     * @param endIndex {number} 结束索引（不包括）
     */
    TsServiceProxy.prototype.getDottedNameSpan = function (filePath, startIndex, endIndex) {
        Logger.log("语义分割:", filePath, startIndex, endIndex);
        var textSpan = this.tss.getNameOrDottedNameSpan(filePath, startIndex, endIndex);
        return textSpan;
    };
    return TsServiceProxy;
})();
exports.TsServiceProxy = TsServiceProxy;
/**
 * Host
 * @author featherJ
 */
var Host = (function () {
    function Host(cancellationToken) {
        if (cancellationToken === void 0) { cancellationToken = CancellationToken.None; }
        this.cancellationToken = cancellationToken;
        //当前已经加载的ts代码
        this.fileNameToScript = {};
        //设置项
        this.settings = null;
    }
    /**
     * 添加代码
     * @param fileName {string} 代码标识
     * @param content {string} 文本内容
     */
    Host.prototype.addScript = function (fileName, content) {
        this.fileNameToScript[fileName] = new ScriptInfo(fileName, content);
    };
    /**
     * 编辑代码
     * @param fileName {string} 代码标识
     * @param startIndex {number} 编辑的起始索引（包括）
     * @param endIndex {number} 编辑的结束索引（不包括）
     * @param newText {string} 新的文本内容
     */
    Host.prototype.editScript = function (fileName, startIndex, endIndex, newText) {
        var script = this.getScriptInfo(fileName);
        if (script !== null) {
            script.editContent(startIndex, endIndex, newText);
            return;
        }
        throw new Error("No script with name '" + fileName + "'");
    };
    /**
     * 更新代码
     * @param fileName {string} 代码标识
     * @param content {string} 文本内容
     */
    Host.prototype.updateScript = function (fileName, content) {
        var script = this.getScriptInfo(fileName);
        if (script !== null) {
            script.updateContent(content);
            return;
        }
        this.addScript(fileName, content);
        //	this.removeScript(fileName);
        //	this.addScript(fileName, content);
    };
    /**
     * 移除代码
     * @param fileName {string} 代码标识
     */
    Host.prototype.removeScript = function (fileName) {
        var script = this.getScriptInfo(fileName);
        if (script !== null) {
            script.updateContent("");
            delete this.fileNameToScript[fileName];
            return;
        }
    };
    Host.prototype.getCompilationSettings = function () {
        return this.settings || {
            mapSourceFiles: true,
            sourceMap: true
        };
    };
    Host.prototype.getScriptFileNames = function () {
        var fileNames = [];
        this.forEachKey(this.fileNameToScript, function (fileName) { fileNames.push(fileName); });
        return fileNames;
    };
    Host.prototype.forEachKey = function (map, callback) {
        var result;
        for (var id in map) {
            if (result = callback(id))
                break;
        }
        return result;
    };
    /**是否包含指定名的代码*/
    Host.prototype.contains = function (fileName) {
        if (this.fileNameToScript[fileName])
            return true;
        return false;
    };
    Host.prototype.getScriptInfo = function (fileName) {
        return this.fileNameToScript[fileName];
    };
    Host.prototype.getScriptVersion = function (fileName) {
        return this.getScriptInfo(fileName).version.toString();
    };
    Host.prototype.getScriptSnapshot = function (fileName) {
        var info = this.getScriptInfo(fileName);
        return new ScriptSnapshot(info);
    };
    Host.prototype.getLocalizedDiagnosticMessages = function () {
        return "{}";
    };
    Host.prototype.getCancellationToken = function () {
        return this.cancellationToken;
    };
    Host.prototype.getCurrentDirectory = function () {
        return "";
    };
    Host.prototype.getDefaultLibFilename = function () {
        return Host.defaultLibFileName;
    };
    Host.prototype.log = function (msg) {
        // Logger.log(msg);
        Logger.log(msg);
    };
    Host.prototype.setDefaultLibFileName = function (fileName) { Host.defaultLibFileName = fileName; };
    Host.prototype.getDefaultLibFileName = function () { return Host.defaultLibFileName; };
    Host.defaultLibFileName = 'default';
    return Host;
})();
var CancellationToken = (function () {
    function CancellationToken(cancellationToken) {
        this.cancellationToken = cancellationToken;
    }
    CancellationToken.prototype.isCancellationRequested = function () {
        return this.cancellationToken && this.cancellationToken.isCancellationRequested();
    };
    CancellationToken.None = new CancellationToken(null);
    return CancellationToken;
})();
/**
 * 一个代码实体类
 */
var ScriptInfo = (function () {
    function ScriptInfo(fileName, content) {
        this.fileName = fileName;
        this.content = content;
        this.version = 1;
        this.editRanges = [];
        this.lineMap = null;
        this.setContent(content);
    }
    ScriptInfo.prototype.setContent = function (content) {
        this.content = content;
        this.lineMap = TSS.computeLineStarts(content);
    };
    ScriptInfo.prototype.updateContent = function (newContent) {
        this.editContent(0, this.content.length, newContent);
        //this.editRanges = [];
        //this.setContent(content);
        //this.version++;
    };
    ScriptInfo.prototype.editContent = function (start, end, newText) {
        // Apply edits
        var prefix = this.content.substring(0, start);
        var middle = newText;
        var suffix = this.content.substring(end);
        this.setContent(prefix + middle + suffix);
        // Store edit range + new length of script
        this.editRanges.push({
            length: this.content.length,
            textChangeRange: TSS.createTextChangeRange(TSS.createTextSpanFromBounds(start, end), newText.length)
        });
        // Update version #
        this.version++;
    };
    ScriptInfo.prototype.getTextChangeRangeBetweenVersions = function (startVersion, endVersion) {
        if (startVersion === endVersion) {
            // No edits!
            return TSS.unchangedTextChangeRange;
        }
        var initialEditRangeIndex = this.editRanges.length - (this.version - startVersion);
        var lastEditRangeIndex = this.editRanges.length - (this.version - endVersion);
        var entries = this.editRanges.slice(initialEditRangeIndex, lastEditRangeIndex);
        return TSS.collapseTextChangeRangesAcrossMultipleVersions(entries.map(function (e) { return e.textChangeRange; }));
    };
    return ScriptInfo;
})();
var ScriptSnapshot = (function () {
    function ScriptSnapshot(scriptInfo) {
        this.scriptInfo = scriptInfo;
        if (!scriptInfo) {
            var i;
        }
        this.textSnapshot = scriptInfo.content;
        this.version = scriptInfo.version;
    }
    ScriptSnapshot.prototype.getText = function (start, end) {
        return this.textSnapshot.substring(start, end);
    };
    ScriptSnapshot.prototype.getLength = function () {
        return this.textSnapshot.length;
    };
    ScriptSnapshot.prototype.getChangeRange = function (oldScript) {
        var oldShim = oldScript;
        return this.scriptInfo.getTextChangeRangeBetweenVersions(oldShim.version, this.version);
    };
    return ScriptSnapshot;
})();

//# sourceMappingURL=../../../commands/upgrade/2.4.2/TsServiceProxy.js.map