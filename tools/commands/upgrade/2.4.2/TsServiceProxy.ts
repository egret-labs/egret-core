///<reference path="./typescriptServices.d.ts" />

import TSS = require("./typescriptServices");
import fs = require("fs");
//import Logger = require("./utils/Logger");
import path = require('path');
import file = require('../../../lib/FileUtil');

var Logger = {
	log:function(a?,b?,c?,d?,e?){
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
export class TsServiceProxy {
	private tss: TSS.LanguageService;
	private host: Host;
	private exceptDir:string;

	constructor(settings: TSS.CompilerOptions) {
		this.host = new Host();
		this.tss = TSS.createLanguageService(this.host, TSS.createDocumentRegistry());
		this.host.settings = settings;
		this.host.tss = this.tss;
	}

	//已经加载过的库的缓存列表
	private libList: Array<string> = [];
	/**
	 * 读取基本库的代码，此方法需要在项目初始化的时候调用。
	 * @param dir {string} 目录路径
	 */
	public initLibs(paths: string[]): void {
		Logger.log("初始化基本库目录: ", paths);
		//先移除之前加载的所有库
		for (var i: number = 0; i < this.libList.length; i++) {
			this.host.removeScript(this.libList[i]);
		}
		this.libList = [];
		if(global.gc) global.gc();
		//重新加载指定的新库
		for (var i: number = 0; i < paths.length; i++) {
			var path: string = paths[i];
			if (path.charAt(path.length - 1) == "/")
				path = path.slice(0, path.length - 1);
			this.readDir(path, this.libAdded_handler, this);
		}
	}

	private libAdded_handler(path: string): void {
		this.libList.push(path);
	}

	//已经加载过的代码的缓存列表
	private scriptList: Array<string> = [];
	/**
	 * 读取项目内的代码，此方法需要在项目初始化的时候调用。
	 * 此方法会读项目目录下的libs目录和src目录，并加载内部的*.ts资源。
	 * @param dir {string} 目录路径
	 */
	public initProject(_path: string): void {
		Logger.log("初始化项目目录: ", _path);
		//先移除已经加载的全部代码（不包括库）
		for (var i: number = 0; i < this.scriptList.length; i++) {
			this.host.removeScript(this.scriptList[i]);
		}
		this.scriptList = [];
		//初始化扩展库
		this.initExtLibs(_path);
		//初始化项目内的所有ts代码
		//this.readDir(file.joinPath(_path,"libs_old"), this.scriptAdded_handler, this);
		this.readDir(file.joinPath(_path,"src"), this.scriptAdded_handler, this);
	}

	public setDefaultLibFileName(fileName:string):void{
		this.host.setDefaultLibFileName(fileName);
	}

	public setExceptDir(dir:string):void{
		this.exceptDir = dir;
	}

	private extLibs: Array<string> = new Array<string>();
	/**
	 * 初始化扩展库，用于加入到排除列表内
	 * @param path {string} 项目路径
	 */
	private initExtLibs(path: string): void {
		Logger.log("初始化扩展库");
		this.extLibs = new Array<string>();
		var egretPropertisFs: fs.Stats;
		try {
			egretPropertisFs = fs.statSync(path + "/egretProperties.json")
		}catch(e){}
		if (!egretPropertisFs || !egretPropertisFs.isFile) return;
		var egretPropertisContent: string = fs.readFileSync(path + "/egretProperties.json", "utf-8");
		var egretPropertis: any = JSON.parse(egretPropertisContent);
		var modules: Array<any> = egretPropertis["modules"];
		if (!modules) return;
		for (var i: number = 0; i < modules.length; i++) {
			if (modules[i]["path"]) {
				this.parserExtLib(path,modules[i]["path"], modules[i]["name"]);
			}
		}
	}

	/**
	 * 解析扩展库模块
	 * @param projectPath {string} 项目路径
	 * @param configPath {string} 扩展库配置路径
	 * @param configPathName {string} 扩展库配置名
	 */
	private parserExtLib(projectPath: string, configPath: string, configPathName: string): void {
		var configAbsolutePath: string = "";
		configAbsolutePath = path.resolve(projectPath,configPath,configPathName + ".json");
		var configFs: fs.Stats;
		try {
			configFs = fs.statSync(configPath)
		} catch (e) { }
		if (!configFs || !configFs.isFile) return;
		var configContent: string = fs.readFileSync(configAbsolutePath, "utf-8");
		var config: any = JSON.parse(configContent);
		var filePath: Array<string> = new Array<string>();
		var source: string = config["source"];
		var file_list: Array<string> = config["file_list"];
		if (source && file_list) {
			for (var i: number = 0; i < file_list.length; i++) {
				var currentFilePath: string = path.resolve(projectPath, configPath, source, file_list[i]);
				var currentFile: fs.Stats;
				try {
					currentFile = fs.statSync(currentFilePath)
				} catch (e) { }
				if (currentFile && currentFile.isFile) {
					currentFilePath = currentFilePath.replace(/\\/g, "/");
					this.extLibs.push(currentFilePath);
				}
			}
		}
	}

	private scriptAdded_handler(path: string): void {
		this.scriptList.push(path);
	}

	/**
	 * 清空，释放
	 */
	public dispose(): void {
		this.tss.dispose();
	}

	/**
	 * 读取目录，此方法会过滤掉.svn目录以及.git目录
	 * @param dir {string} 目录路径
	 */
	private readDir(dir: string, onComplete: Function = null, target: Object = null): void {
		Logger.log("读取目录:", dir);
		if(dir == this.exceptDir)return;
		var items: string[];
		try {
			items = fs.readdirSync(dir);
		}
		catch (e) { }
		if (!items) return;

		for (var i: number = 0; i < items.length; i++) {
			var item: string = items[i];
			var stat: fs.Stats = fs.statSync(dir + "/" + item);
			if (stat.isDirectory() && item != ".svn" && item != ".git") {
				this.readDir(dir + "/" + item, onComplete, target);
			} else if (stat.isFile() && item.lastIndexOf('.ts') == item.length - 3 && item.indexOf(".ts") != -1) {
				Logger.log("读取文件:", dir + "/" + item);
				var content: string = fs.readFileSync(dir + "/" + item, "utf-8");
				this.host.addScript(dir + "/" + item, content);
				if (onComplete && target)
					onComplete.call(target, dir + "/" + item);
			}
		}
	}

	/**
	 * 添加代码
	 * @param filePath {string} 代码标识
	* @param content {string} 文本内容
*/
	public addScript(filePath: string, content: string): void {
		Logger.log("添加代码:", filePath);
		this.host.addScript(filePath, content);
		this.host.updateScript(filePath, content);
		this.scriptList.push(filePath);
	}

	/**
	 * 移除代码
* @param filePath {string} 代码标识
*/
	public removeScript(filePath: string): void {
		Logger.log("移除代码:", filePath);
		this.host.removeScript(filePath);
		for (var i: number = 0; i < this.scriptList.length; i++) {
			if (this.scriptList[i] == filePath) {
				for (var j: number = i; j < this.scriptList.length - 1; j++) {
					this.scriptList[j] = this.scriptList[j + 1];
				}
				this.scriptList.pop();
				break;
			}
		}
	}

	/**
	 * 更新代码
     * @param filePath {string} 代码标识
     * @param content {string} 文本内容
     */
	public updateScript(filePath: string, content: string, isLog: boolean = true): void {
		if (isLog)
			Logger.log("更新代码:", filePath, content.length);
		try {
			this.host.updateScript(filePath, content);
		} catch (e) {
			Logger.log(e);
		}
	}


	/**
* 获取指定位置的引用
  * @param filePath {string} 代码标识
		* @param position {number} 寻找的位置
	  */
	public getReferences(filePath: string, position: number): TSS.ReferenceEntry[] {
		Logger.log("得到引用:", filePath, position);
		//return this.tss.findReferences(filePath,position);
		return this.tss.getReferencesAtPosition(filePath, position);
	}

	/**
*获取指定字符串的定义位置
	 * @param searchValue 字符串
	 */
	public getDeclarationPosition(searchContainer: string,searchValue: string) {
		var declarations :TSS.NavigateToItem[] = this.tss.getNavigateToItems(searchValue);
		var targetDeclaration:any;
		var res:number[] = [];
		for(var i = 0;i<declarations.length;i++){
			if(declarations[i].name == searchValue && declarations[i].containerName == searchContainer){
				targetDeclaration = declarations[i];
				Logger.log('搜索:'+searchContainer+'.'+searchValue);
				return {path:targetDeclaration.fileName,position:targetDeclaration.textSpan['start']};
			}
		}
		return null;
	}

	public getAllReferenceAccordingDeclarationPosition(filePath: string,position: number,containerName: string,decorate:string,callBack: (filename:string,line:number)=>void):void{
		var res:TSS.ReferenceEntry[] = this.getReferences(filePath,position);
		if(!res){
			if(decorate){
				if(decorate == 'function'){
					res = this.getReferences(filePath,position+10);//去掉function前导限定符
				}else
				if(decorate == 'static'){
					res = this.getReferences(filePath,position+8);//去掉static前导限定符
				}
				//else this.getReferences(filePath,position);
			}
			//this.getReferences(filePath,position);
		}
		if(res){
			Logger.log('找到:'+res.length+'处引用');
			res.forEach(resItem=>{
				//对找到的引用进行验证
				var definitions = this.getDefinitionAtPosition(resItem.fileName,resItem.textSpan.start);
				//有定义且定义是对应的Container
				if(definitions[0] && definitions[0].containerName.indexOf(containerName) != -1 &&
						//只来自于用户的ts文件
					resItem.fileName.indexOf('src')!=-1 && resItem.fileName.indexOf('.d.ts') == -1){

					var pos = this.getLineAndCharacterOfPosition(this.tss.getSourceFile(resItem.fileName),resItem.textSpan.start);
					callBack(resItem.fileName,pos.line);
					//Logger.log('位置 '+ resItem.fileName +' 行'+ pos.line + " API作废" );
				}
			});
		}else{
			//callBack(null,null);
		}
	}
	public getLineAndCharacterOfPosition(sourceFile: TSS.SourceFile,position: number){
		return TSS.getLineAndCharacterOfPosition(sourceFile,position);
	}

	public getDefinitionAtPosition(fileName: string,position:number):TSS.DefinitionInfo[]{
		return this.tss.getDefinitionAtPosition(fileName,position);
	}
	/**
* 获取指定位置的高亮内容
  * @param filePath {string} 代码标识
		* @param position {number} 寻找的位置
	  */
	public getOccurrences(filePath: string, position: number): TSS.ReferenceEntry[] {
		Logger.log("得到高亮:", filePath, position);
		return this.tss.getOccurrencesAtPosition(filePath, position);
	}

	///**
	//* 获取指定位置的高亮内容
	//* @param filePath {string} 代码标识
	//* @param position {number} 寻找的位置
	//*/
	//public getDiagnostics(filePath: string): any {
	//	Logger.log("获得诊断信息:", filePath);
	//	//检查如果有扩展库则缓存起来，并从代码中移除
	//	var extLibContents: Array<any> = new Array<any>();
	//	for (var i: number = 0; i < this.extLibs.length; i++) {
	//		var scriptInfo: ScriptInfo = this.host.getScriptInfo(this.extLibs[i]);
	//		if (scriptInfo) {
	//			var extContent: string = scriptInfo.content;
	//			extLibContents.push({
	//				"path": this.extLibs[i],
	//				"content": extContent
	//			});
	//			this.removeScript(this.extLibs[i]);
	//		}
	//	}
    //
	//	//如果不存在该文件
	//	if (!this.host.contains(filePath)) {
	//		//将缓存的扩展库添加回去
	//		for (var i: number = 0; i < extLibContents.length; i++) {
	//			this.addScript(extLibContents[i]["path"], extLibContents[i]["content"]);
	//		}
	//		return {
	//			diagnostics: [],
	//			filePath: filePath
	//		};
	//	}
    //
	//	var stt: TSS.Diagnostic[] = this.tss.getSyntacticDiagnostics(filePath);
	//	var smt: TSS.Diagnostic[] = this.tss.getSemanticDiagnostics(filePath);
	//	var compile: TSS.Diagnostic[] = this.tss.getCompilerOptionsDiagnostics() || [];
	//	if (compile && compile.length)
	//		compile = compile.filter(d=> d.file != null && d.file.fileName == filePath);
	//	var diagnostics: TSS.Diagnostic[] = stt.concat(smt).concat(compile);
	//	diagnostics = diagnostics.map(d=> {
	//		d.file = <any>d.file.fileName;
	//		return d;
	//	});
	//
    //
	//	var result: Array<any> = new Array<any>();
	//	for (var i: number = 0; i < diagnostics.length; i++) {
    //
	//		var currentDiagnostic: Array<any> = new Array<any>();
	//		if (typeof diagnostics[i].messageText === "string") {
	//			currentDiagnostic.push({
	//				code: diagnostics[i].code,
	//				msg: diagnostics[i].messageText,
	//				category: diagnostics[i].category
	//			});
	//		} else {
	//			this.fixDiagnostics(currentDiagnostic, <TSS.DiagnosticMessageChain> diagnostics[i].messageText);
	//		}
	//		result.push({
	//			start: diagnostics[i].start,
	//			length: diagnostics[i].length,
	//			diagnostic: currentDiagnostic
	//		});
	//	}
    //
	//	var obj: any = {
	//		diagnostics: result,
	//		filePath: filePath
	//	}
    //
	//	//将缓存的扩展库添加回去
	//	for (var i: number = 0; i < extLibContents.length; i++) {
	//		this.addScript(extLibContents[i]["path"], extLibContents[i]["content"]);
	//	}
	//	return obj;
	//}

	///**
	// * 修复错误诊断信息，递归为一个数组
	// *
	// */
	//private fixDiagnostics(list: Array<any>, diagnostic: TSS.DiagnosticMessageChain): void {
	//	list.push({
	//		code: diagnostic.code,
	//		msg: diagnostic.messageText,
	//		category: diagnostic.category
	//	})
	//	if (diagnostic.next) {
	//		this.fixDiagnostics(list, diagnostic.next);
	//	}
	//}
	

	/**
* 在指定的位置获得doc信息
* @param filePath {string} 代码标识
* @param position {number} 寻找的位置
	 * @param optiton {TSS.EditorOptions} 配置参数
*/
	public getDoc(filePath: string, position: number): TSS.QuickInfo {
		Logger.log("得到Doc:", filePath, position);
		return this.tss.getQuickInfoAtPosition(filePath, position);
	}
	/**
* 全局查找
* @param searchValue {string} 要查找的内容
*/
	public search(searchValue: string): TSS.NavigateToItem[] {
		Logger.log("全局查找:", searchValue);
		return this.tss.getNavigateToItems(searchValue);
	}

	/**
* 得到重命名信息
* @param filePath {string} 代码标识
* @param position {number} 寻找的位置
  *	@param findInStrings {boolean} 在字符串中重命名
  *	@param findInComments {boolean} 在注释中重命名
*/
	public findRenameLocations(filePath: string, position: number, findInStrings: boolean, findInComments: boolean): TSS.RenameLocation[] {
		Logger.log("获得重命名信息:", filePath, position);
		this.tss.findRenameLocations
		if (this.tss.getRenameInfo(filePath, position).canRename) {
			return this.tss.findRenameLocations(filePath, position, findInStrings, findInComments);
		}
		return [];
	}

	/**
* 得到指定文件的折叠层次
* @param filePath {string} 代码标识
*/
	public getOutliningSpans(filePath: string): TSS.OutliningSpan[] {
		Logger.log("得到折叠层次:", filePath);
		return this.tss.getOutliningSpans(filePath);
	}

	/**
* 获取该位置能否打断点，及断点最终位置
* @param filePath {string} 代码标识
* @param position {number} 位置
*/
	public getCanBreakpoint(filePath: string, position: number): TSS.TextSpan {
		Logger.log("断点信息:", filePath, position);
		if (this.host.contains(filePath)) {
			//读取一下本地文件
			var fileContent: string = fs.readFileSync(filePath, "utf-8");
			//缓存一下当前编辑的文件
			var contentCatch: string = this.host.getScriptInfo(filePath).content;
			//在本地文件中查找是否可以设置断点
			this.updateScript(filePath, fileContent, false);
			var result: TSS.TextSpan
			var pos: number = position;
			while (true) {
				result = this.tss.getBreakpointStatementAtPosition(filePath, pos);
				if (!result) {
					pos++;
					if (pos >= fileContent.length) {
						break;
					}
				} else {
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
	}

	///**
	// * 语义分割，用于调试  this.text.indexOf => 鼠标在 indexOf 上，告诉你this.text.indexOf是完整的语句
	// * @param filePath {string} 代码标识
	// * @param startIndex {number} 起始索引（包括）
	// * @param endIndex {number} 结束索引（不包括）
	// */
	//public getDottedNameSpan(filePath: string, startIndex: number, endIndex: number): TSS.TextSpan {
	//	Logger.log("语义分割:", filePath, startIndex, endIndex);
	//	var textSpan: TSS.TextSpan = this.tss.getNameOrDottedNameSpan(filePath, startIndex, endIndex);
	//	return textSpan;
	//}
}
/**
 * Host
 * @author featherJ
 */
class Host implements TSS.LanguageServiceHost {
	constructor(private cancellationToken: TSS.CancellationToken = CancellationToken.None) {
	}

	//当前已经加载的ts代码
	private fileNameToScript: TSS.Map<ScriptInfo> = {};
	//ts服务
	public tss: TSS.LanguageService;
	//设置项
	public settings: TSS.CompilerOptions = null;

	public static defaultLibFileName:string = 'default';
	/**
	 * 添加代码
	 * @param fileName {string} 代码标识
	 * @param content {string} 文本内容
	 */
	public addScript(fileName: string, content: string): void {
		this.fileNameToScript[fileName] = new ScriptInfo(fileName, content);
	}

	///**
	// * 编辑代码
	// * @param fileName {string} 代码标识
	// * @param startIndex {number} 编辑的起始索引（包括）
	// * @param endIndex {number} 编辑的结束索引（不包括）
	// * @param newText {string} 新的文本内容
	// */
	//public editScript(fileName: string, startIndex: number, endIndex: number, newText: string): void {
	//	var script = this.getScriptInfo(fileName);
	//	if (script !== null) {
	//		script.editContent(startIndex, endIndex, newText);
	//		return;
	//	}
	//	throw new Error("No script with name '" + fileName + "'");
	//}

	/**
	 * 更新代码
	 * @param fileName {string} 代码标识
	 * @param content {string} 文本内容
	 */
	public updateScript(fileName: string, content: string): void {
		var script = this.getScriptInfo(fileName);
		if (script !== null) {
			script.updateContent(content);
			return;
		}
		this.addScript(fileName, content);
	//	this.removeScript(fileName);
	//	this.addScript(fileName, content);
	}

	/**
	 * 移除代码
	 * @param fileName {string} 代码标识
	 */
	public removeScript(fileName: string) {
		var script = this.getScriptInfo(fileName);
		if (script !== null) {
			script.updateContent("");
			delete this.fileNameToScript[fileName];
			return;
		}
	}

	public getCompilationSettings(): TSS.CompilerOptions {
		return this.settings || {
			mapSourceFiles: true,
			sourceMap: true
		};
	}

	public getScriptFileNames(): string[] {
		var fileNames: string[] = [];
		this.forEachKey(this.fileNameToScript, (fileName) => { fileNames.push(fileName); });
		return fileNames;
	}

	private forEachKey<T, U>(map: TSS.Map<T>, callback: (key: string) => U): U {
		var result: U;
		for (var id in map) {
			if (result = callback(id)) break;
		}
		return result;
	}

	/**是否包含指定名的代码*/
	public contains(fileName: string): boolean {
		if (this.fileNameToScript[fileName])
			return true;
		return false;
	}

	public getScriptInfo(fileName: string): ScriptInfo {
		return this.fileNameToScript[fileName];

	}
	public getScriptVersion(fileName: string): string {
		return this.getScriptInfo(fileName).version.toString();
	}

	public getScriptSnapshot(fileName: string): TSS.IScriptSnapshot {
		var info = this.getScriptInfo(fileName);
		return new ScriptSnapshot(info);
	}

	public getLocalizedDiagnosticMessages(): any {
		return "{}";
	}

	public getCancellationToken(): TSS.CancellationToken {
		return this.cancellationToken;
	}

	public getCurrentDirectory(): string {
		return ""
	}
	public getDefaultLibFilename(): string {
		return Host.defaultLibFileName;
	}

	log(msg) {
		// Logger.log(msg);
		Logger.log(msg);
	}
	public setDefaultLibFileName(fileName: string):void { Host.defaultLibFileName = fileName;}
	getDefaultLibFileName(): string { return Host.defaultLibFileName; }
}



class CancellationToken {
	public static None: CancellationToken = new CancellationToken(null);

	constructor(private cancellationToken: TSS.CancellationToken) {
	}

	public isCancellationRequested() {
		return this.cancellationToken && this.cancellationToken.isCancellationRequested();
	}
}

/**
 * 一个代码实体类 
 */
class ScriptInfo {
	public version: number = 1;
	public editRanges: { length: number; textChangeRange: TSS.TextChangeRange; }[] = [];
	public lineMap: number[] = null;

	constructor(public fileName: string, public content: string) {
		this.setContent(content);
	}

	private setContent(content: string): void {
		this.content = content;
		this.lineMap = TSS.computeLineStarts(content);
	}

	public updateContent(newContent: string): void {
		this.editContent(0, this.content.length, newContent);
		//this.editRanges = [];
		//this.setContent(content);
		//this.version++;
	}

	public editContent(start: number, end: number, newText: string): void {
		// Apply edits
		var prefix = this.content.substring(0, start);
		var middle = newText;
		var suffix = this.content.substring(end);
		this.setContent(prefix + middle + suffix);

		// Store edit range + new length of script
		this.editRanges.push({
			length: this.content.length,
			textChangeRange: TSS.createTextChangeRange(
				TSS.createTextSpanFromBounds(start, end), newText.length)
		});
		// Update version #
		this.version++;
	}

	public getTextChangeRangeBetweenVersions(startVersion: number, endVersion: number): TSS.TextChangeRange {
		if (startVersion === endVersion) {
			// No edits!
			return TSS.unchangedTextChangeRange;
		}

		var initialEditRangeIndex = this.editRanges.length - (this.version - startVersion);
		var lastEditRangeIndex = this.editRanges.length - (this.version - endVersion);

		var entries = this.editRanges.slice(initialEditRangeIndex, lastEditRangeIndex);
		return TSS.collapseTextChangeRangesAcrossMultipleVersions(entries.map(e => e.textChangeRange));
	}
}


class ScriptSnapshot implements TSS.IScriptSnapshot {
	public textSnapshot: string;
	public version: number;

	constructor(public scriptInfo: ScriptInfo) {
		if(!scriptInfo){
			var i;
		}
		this.textSnapshot = scriptInfo.content;
		this.version = scriptInfo.version;
	}

	public getText(start: number, end: number): string {
		return this.textSnapshot.substring(start, end);
	}

	public getLength(): number {
		return this.textSnapshot.length;
	}

	public getChangeRange(oldScript: TSS.IScriptSnapshot): TSS.TextChangeRange {
		var oldShim = <ScriptSnapshot>oldScript;
		return this.scriptInfo.getTextChangeRangeBetweenVersions(oldShim.version, this.version);
	}

}