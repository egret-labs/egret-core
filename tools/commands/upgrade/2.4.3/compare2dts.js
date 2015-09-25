(function(){
	var LineReader = require('./line_reader');
	var file = require('../../../lib/FileUtil');

	var parseMap = {lines:[]};

	var outputLst = [];

	//带＊的输出控制台
	var cacheConsole = {
		cacheLst:{},
		push : function(){
			//提取参数
			var lineNum = arguments[0];
			var mark = arguments[1];
			var lineStr = arguments[2];

			if(OUTPUT_TYPE_API == output_type){
				return _consoleOut_raw(mark,lineStr);
			}

			if(OUTPUT_TYPE_SIMPLE == output_type){
				lineStr = mark?mark+'{ '+lineStr+' }':lineStr;
				if(isConsoleIgnored(formatItem({desc:lineStr}))){
					solved_count ++;
					return ;
				}
				if(mark){
					mark = mark.split(' ')[1];
				}else{
					mark = 'egret';
				}
			}

			if(!this.cacheLst[mark]){
				this.cacheLst[mark] = 1;
			}else{
				this.cacheLst[mark] ++;
			}
		},
		pushAutoClear : function(){
			//提取参数
			var lineNum = arguments[0];
			var mark = arguments[1];
			var lineStr = arguments[2];

			if(OUTPUT_TYPE_API == output_type){
				return _consoleOut_raw(mark,lineStr);
			}

			if(OUTPUT_TYPE_SIMPLE == output_type){
				lineStr = mark?mark+'{ '+lineStr+' }':lineStr;
				if(isConsoleIgnored(formatItem({desc:lineStr}))){
					solved_count ++;
					return ;
				}
				if(mark){
					mark = mark.split(' ')[1];
				}else{
					mark = 'egret';
				}
			}

			if(!this.cacheLst[mark]){
				this.clear();
				this.cacheLst[mark] = 1;
			}else{
				this.cacheLst[mark] ++;
			}
		},
		clear : function(){
			for(var mark in this.cacheLst){
				if(OUTPUT_TYPE_FULL == output_type) {
					_consoleOut_full("..("+this.cacheLst[mark] + "项)",mark,"*");
				}else
				if(OUTPUT_TYPE_SIMPLE == output_type){
					_consoleOut_simple(mark,this.cacheLst[mark]);
				}
				delete this.cacheLst[mark];
			}
		}
	}

	var compareEndCallBack = null;

	var solvedJson = null;

	var GRADULE_PARSE = 1;

	var CLASS_INTERFACE_ENUM_PARSE = 2;

	var IGNORE_PARSE = 3;

	var mark = undefined;

	var currentLineNum = 0;

	var state = -1;

	var braceStack = [];//花括号栈

	/*控制项*/
	var isComment = false;//去除注释
	var isParseEnabled = false;//解析开关,目前只解析egret模组的内容

	var OUTPUT_TYPE_FULL = 1;
	var OUTPUT_TYPE_SIMPLE = 2;
	var OUTPUT_TYPE_API = 3;//API 模式 不带*号 用于扫描

	var output_type = OUTPUT_TYPE_FULL;//1,默认;2,精简;3,API

	var isConsoleEnabled = true;//控制台输出开关

	/*统计项*/
	var keep_count = 0;
	var differ_count = 0;
	var ignore_count = 0;
	var solved_count = 0;

	/**
	 * 解析行并构成简单解析Map（用于后续比较）
	 * @param lineStr
	 */
	function parseLineAndMergeInMap(lineStr){
		//行号＋1
		currentLineNum ++;
		//console.log(lineStr);

		//注释忽略
		if(isCommentIgnored(lineStr)){
			return ;
		}

		//标记解析范围并打开解析开关 不允许declare module egret嵌套
		if(!isParseEnabled && lineStr.indexOf('declare module egret {') !== -1){
			state = GRADULE_PARSE;
			braceStack.push(state);
			isParseEnabled = true;
			return ;
		}
		//执行解析
		if(isParseEnabled){
			//解析class和interface以及enum并将行作为索引
			if((lineStr.indexOf('class ') !== -1 ||
				lineStr.indexOf('interface ') !== -1 ||
				lineStr.indexOf('enum ') !== -1) && lineStr.indexOf('{') !== -1){
				state = CLASS_INTERFACE_ENUM_PARSE;
				braceStack.push(state);
				//空格切分单词
				var reg=/\s+/g;
				var arr = lineStr.split(reg);
				//类＋类名/接口 + 接口名 为索引值
				mark = (function(arr){
					//去掉前导限定符 比如 static declare const
					for(var i =0;i<arr.length;i++){
						if(arr[i] == 'class' ||
							arr[i] == 'interface' ||
							arr[i] == 'enum'){
							return arr[i] + ' ' + arr[i+1];
						}
					}
				})(arr);
				//预定义数据格式（当前开始行号）
				parseMap[mark] = {lineFrom:currentLineNum,lines:[]};
			}else
			if(lineStr.indexOf('{') !== -1){
				state = IGNORE_PARSE;
				braceStack.push(state);
			}
			else
			//回括及处理
			if(lineStr.indexOf('}') !== -1){
				var endState = braceStack.pop();
				if(endState === CLASS_INTERFACE_ENUM_PARSE){
					parseMap[mark].lineEnd = currentLineNum;
				}else
				if(endState === GRADULE_PARSE){
					isParseEnabled = false;
					mark = undefined;
				}
				//弹出栈后标记当前状态
				if(braceStack.length>=1){
					state = braceStack[braceStack.length-1];
				}else{
					state = -1;
				}
			}else{
				//根据状态直接将行插入到lines数组中
				if(state === GRADULE_PARSE){
					parseMap.lines.push(lineStr);
				}
				if(state === CLASS_INTERFACE_ENUM_PARSE){
					parseMap[mark].lines.push(lineStr);
				}
			}
		}
	}

	/**
	 * 解析行并与解析好的Map比较
	 * @param lineStr
	 */
	function parseLineAndCompareWithMap(lineStr) {
		//行号＋1
		currentLineNum ++;
		//console.log(lineStr);

		//注释忽略
		if(isCommentIgnored(lineStr)){
			return ;
		}
		//标记解析范围并打开解析开关 不允许declare module egret嵌套
		if (!isParseEnabled && lineStr.indexOf('declare module egret {') !== -1) {
			state = GRADULE_PARSE;
			braceStack.push(state);
			isParseEnabled = true;
			return;
		}
		//执行解析
		if (isParseEnabled) {
			//解析class和interface并将行作为索引
			if ((lineStr.indexOf('class ') !== -1 ||
				lineStr.indexOf('interface ') !== -1 ||
				lineStr.indexOf('enum ') !== -1 ) && lineStr.indexOf('{') !== -1) {
				state = CLASS_INTERFACE_ENUM_PARSE;
				braceStack.push(state);
				//空格切分单词
				var reg = /\s+/g;
				var arr = lineStr.split(reg);
				//类＋类名/接口 + 接口名 为索引值
				mark = (function (arr) {
					//去掉前导限定符 比如 static declare const
					for (var i = 0; i < arr.length; i++) {
						if (arr[i] == 'class' ||
							arr[i] == 'interface' ||
							arr[i] == 'enum') {
							return arr[i] + ' ' + arr[i + 1];
						}
					}
				})(arr);
				//预定义数据格式（当前开始行号）
				//parseMap[mark] = {lineFrom:currentLineNum,lines:[]};
			} else if (lineStr.indexOf('{') !== -1) {
				state = IGNORE_PARSE;
				braceStack.push(state);
			}
			else
			//回括及处理
			if (lineStr.indexOf('}') !== -1) {
				var endState = braceStack.pop();
				if (endState === CLASS_INTERFACE_ENUM_PARSE) {

				} else if (endState === GRADULE_PARSE) {
					isParseEnabled = false;
					mark = undefined;
				}
				//弹出栈后标记当前状态
				if (braceStack.length >= 1) {
					state = braceStack[braceStack.length - 1];
				} else {
					state = -1;
				}
			} else {
				//私有成员不参与比较
				if(lineStr.indexOf('private ') != -1){
					return;
				}
				//根据状态与Map中的行比较并输出
				if (state === GRADULE_PARSE) {
					if (!_isLineMatch(lineStr, parseMap.lines)) {
						differ_count++;
						//输出不匹配项
						consoleOut(currentLineNum,null,lineStr);
						//输出不匹配原因
						//console.log('///Member_Undefined');
					} else {
						keep_count++;
					}
				}else
				if (state === CLASS_INTERFACE_ENUM_PARSE) {
					if (_isMarkMatch(mark, parseMap)) {
						if (!_isLineMatch(lineStr, parseMap[mark].lines)) {
							differ_count ++;
							//输出不匹配项
							consoleOut(currentLineNum,mark,lineStr);
							//输出不匹配原因
							//console.log('///ClassOrInterfaceOrEnum_Member_Undefined');
						} else {
							keep_count ++;
						}
					} else {
						differ_count ++;
						//输出不匹配项
						if(mark){
							//同一个类输出结束后输出＊
							//cacheConsole.pushAutoClear(currentLineNum,mark,lineStr);
							cacheConsole.push(currentLineNum,mark,lineStr);
							//consoleOut(currentLineNum,mark,lineStr);
						}else{
							consoleOut(currentLineNum,mark,lineStr);
						}
						//输出不匹配原因
						//console.log('///ClassOrInterfaceOrEnum_Not_Found');
					}
				}else{
					//忽略的解析行
					//console.log('ignore:'+lineStr);
				}
			}
		}
	}

	function _isMarkMatch(mark, obj) {
		return mark in obj;
	}

	function _isLineMatch(str, matching) {
		if (matching instanceof Array) {
			return matching.some(function (item, i) {
				if (str == item) {
					//删除该行便于加速后续的比较
					matching.splice(i, 1);
					return true;
				} else
					return false;
			});
		} else if (typeof matching === 'object') {
			if (str in matching) {
				delete matching[str];
				return true;
			}
		}
		return false;
	}

	//输出
	function consoleOut(lineNum,mark,lineStr){
		if(OUTPUT_TYPE_FULL == output_type){
			_consoleOut_full(lineNum,mark,lineStr);
		}else
		if(OUTPUT_TYPE_SIMPLE == output_type){
			cacheConsole.pushAutoClear(lineNum,mark,lineStr);
		}else
		if(OUTPUT_TYPE_API == output_type){
			_consoleOut_raw(mark,lineStr);
		}
	}
	//极简输出
	function _consoleOut_simple(name,count){
		if(isConsoleEnabled){
			console.log(name +' '+ count);
		}
	}

	//只为生成json文件的输出 原始api集 不经过过滤
	function _consoleOut_raw(mark,lineStr){
		var solvedKeyPattern;
		if(mark){
			solvedKeyPattern = mark + '{ ' + lineStr + ' }';
		}else{
			solvedKeyPattern = lineStr;
		}
		if(isConsoleEnabled){
			console.log(solvedKeyPattern);
		}
		outputLst.push({desc:solvedKeyPattern});
	}

	//全部输出
	function _consoleOut_full(lineNum,mark,lineStr){
        var solvedKeyPattern;
        var lineNumPattern = 'Line ' + lineNum + ':';
        if(mark){
            solvedKeyPattern = mark + '{ ' + lineStr + ' }';
        }else{
            solvedKeyPattern = lineStr;
        }

		var add_count = 1;
		if(typeof lineNum == 'string'){
			var numStr = lineNum.slice(lineNum.indexOf('(')+1,lineNum.indexOf('项)'));
			add_count = parseInt(numStr);
		}
		if(isConsoleIgnored(formatItem({desc:solvedKeyPattern}))){
			solved_count += add_count;
			return ;
		}
		if(isConsoleEnabled){
        	console.log(lineNumPattern + solvedKeyPattern);
		}
		if(outputLst.quickLST && solvedKeyPattern in outputLst.quickLST){
			//快表中已存在该项
		}else{
			outputLst.push({desc:solvedKeyPattern});
		}
	}

	function consoleExit(){
		var consoleOut = '';
		for(var i=0;i<arguments.length;i++){
			consoleOut += arguments[i];
		}
		console.log(consoleOut);
	}

	function isCommentIgnored(lineStr){
		//单行注释
		if(lineStr.indexOf('//') !== -1){
			return true;
		}
		if(lineStr.indexOf('/*') !== -1){
			//单行注释
			if(lineStr.indexOf('*/') !== -1){
				isComment = false;
				return true;
			}
			isComment = true;
		}
		//多行注释结尾
		if(lineStr.indexOf('*/') !== -1){
			isComment = false;
			return true;
		}
		return isComment;
	}

	function isConsoleIgnored(item){
		if(solvedJson){
			var res = false;
			//有先查看通配 * 的处理
			var quickLst = solvedJson;
			if(quickLst){
				res = quickLst.some(function(it){
					var result = (it['name'] == "*" &&
						it['category-name'] == item['category-name'] &&
						it['category-type'] == item['category-type'] &&
						it.solved);
					return result;
				});
				if(res){
					return true;
				}
			}
			return solvedJson.some(function(it){
				return it.desc == item.desc && it.solved;
			});
		}
		return false;
	}

	function buildJsonObject(jsonFilePath,doneFunc){
		var jsonStr = "";
		LineReader.eachLine(jsonFilePath,function(line,last){
			jsonStr += line;
			if(last){
				solvedJson = JSON.parse(jsonStr);
				doneFunc();
			}
		});
	}

	function startParse(comparedFilePath,comparingFilePath){
		currentLineNum = 0;
		LineReader.eachLine(comparedFilePath, function (line, last) {
			if (typeof line == 'string') {
				parseLineAndMergeInMap(trim(line));
			}
			if (last) {
				console.log("-----------------------------------ParseEnd >>>>>");
				startCompare(comparingFilePath);
			}
		});
	}

	function startCompare(comparingFilePath) {
		currentLineNum = 0;
		LineReader.eachLine(comparingFilePath, function (line, last) {
			if (typeof line == 'string') {
				parseLineAndCompareWithMap(trim(line));
			}
			if (last) {
				if(compareEndCallBack){
					compareEndCallBack();
				}
				cacheConsole.clear();
				console.log("-----------------------------------CompareEnd >>>>>");
				console.log("Differences:" + differ_count);
				console.log("Kept:" + keep_count);
                if(solvedJson){
                    console.log("Solved:" + solved_count);
                    console.log("Left:" + (differ_count - solved_count));
                }
				//console.log("Ignored:" + ignore_count);
			}
		});
	}

	function trim(str) {
		return str.replace(/(^\s+)|(\s+$)/g, "");
	}

	function compare(){
		//是否包含控制参数
		var i = 0;
		if(arguments[0] == '-simple'){
			output_type = OUTPUT_TYPE_SIMPLE;
			i = 1;
		}else
		if(arguments[0] == '-raw'){
			output_type = OUTPUT_TYPE_API;
			i = 1;
		}

		if(arguments.length<i+2){
			return helpCompare();
		}
		var comparingFilePath = arguments[i];
		var comparedFilePath = arguments[i+1];
		//配置JSON配置文件
		var solvedJsonFile = arguments[i+2];//过滤已经处理的json的配置文件[对象或文件名]
		if(solvedJsonFile){
			if(typeof solvedJsonFile == 'string'){
				if(!solvedJsonFile){
					solvedJson = formatJsonConfig(JSON.parse(file.read(solvedJsonFile)));
				}
			}else
			if(typeof solvedJsonFile == 'object'){
				solvedJson = solvedJsonFile;
			}
		}
		startParse(comparedFilePath,comparingFilePath);
	}

	function helpCompare(){
		console.log('tip:need at least 2 params ');
		console.log('example: arg1.dts arg2.dts [config.json]');
	}

	function helpGenJSON(){
		console.log('tip:need at least 3 params ');
		console.log('example: arg1.dts arg2.dts gen_json_path');
	}

	function mergeItem(newItem,oldItem){
		for(var p in newItem){
			if(!oldItem[p] && newItem[p]){
				oldItem[p] = newItem[p];
			}else
			if(oldItem[p] != newItem[p]){
				consoleExit('属性冲突，请手动修改后重新试\n',JSON.stringify(newItem,null,2),JSON.stringify(oldItem,null,2));
				break;
			}
		}
	}

	/**
	 * 格式化配置项
	 * @param item
	 */
	function formatItem(item){
		if(!item.desc){
			return;
		}
		var body;
		var name;
		var category_name;
		var category_type;
		//step 1 解析包含关系
		//解析class enum interface和module直接成员
		if(item.desc.indexOf('{') != -1 && item.desc.indexOf('}') != -1){
			var category = item.desc.slice(0,item.desc.indexOf('{'));
			body = item.desc.slice(item.desc.indexOf('{')+2,item.desc.indexOf('}')-1);
			//空格切分单词
			var reg=/\s+/g;
			var arr = category.split(reg);
			//去掉前导限定符 比如 public/private static declare const
			for(var i =0;i<arr.length;i++){
				if(arr[i] == 'class' ||
					arr[i] == 'interface' ||
					arr[i] == 'enum'){
					category_type = arr[i];
					category_name = arr[i+1];
					break;
				}
			}
		}
		//step 2 设置category-name和category-type
		if(!body){
			body = item.desc;
			category_name = 'egret';
			category_type = 'module';
		}
		//step 3 冲突检测
		if(category_name){
			if('category-name' in item && item['category-name'] != category_name){
				//加入冲突列表
				if(!item.conflict){
					item.conflict = [];
				}
				item.conflict.push(item);
			}else{
				item['category-name'] = category_name;
			}
		}else{
			consoleExit('解析格式错误,无法解析出类型名称',item.desc);
		}
		if(category_type){
			if('category-type' in item && item['category-type'] != category_type){
				//解析冲突 以手写输入值为准
				//if(!item.conflict){
				//	item.conflict = [];
				//}
				//item.conflict.push(item);
			}else{
				item['category-type'] = category_type;
			}
		}else{
			consoleExit('解析格式错误,解析类型冲突',item.desc);
		}
		//step 4 是否包含通配符
		if(body.indexOf('*') != -1){
			//module下的直接成员不能通配
			if(item['category-type'] != 'module'){
				item['name'] = '*';
			}
		}
		//step 5 提取成员名称
		//3种情况
		//1) private _setMatrix(value); 首个'('前的单词作为函数成员名称
		//2) static __DRAW_COMMAND_LIST: Array<RenderCommand>; 成员变量后面紧接着:用来声明类型
		//3) private array; 没有用:声明类型 去掉;取最后一个单词
		//空格切分单词
		var body_reg = /\s+/g;
		var body_arr = body.split(body_reg);
		//去掉前导限定符 比如 public/private static declare const

		for(var i =0;i<body_arr.length;i++){
			if(body_arr[i] != 'private' &&
				body_arr[i] != 'public' &&
				body_arr[i] != 'static' &&
					body_arr[i] != 'var' &&
					body_arr[i] != 'function'
			){
				//提取函数名称
				if(body_arr[i].indexOf('(') != -1){
					name = body_arr[i].slice(0,body_arr[i].indexOf('('));
					break;
				}
				//提取声明符号前的单词
				if(body_arr[i].indexOf(':') != -1 || body_arr[i].indexOf('?:') != -1){
					var sliceIndex = body_arr[i].indexOf(':');
					if(sliceIndex == -1){
						sliceIndex = body_arr[i].indexOf('?:');
					}
					name = body_arr[i].slice(0,sliceIndex);
					break;
				}
				if(body_arr[i].indexOf(';') != -1){
					name = body_arr[i].slice(0,body_arr[i].indexOf(';'));
				}else{
					name = body_arr[i];
				}
			}else{
				//添加修饰符(有用)
				item['decorate'] = body_arr[i];
			}
		}
		//step 6 冲突检测
		if(name){
			if('name' in item && item['name'] != name){
				//解析冲突 以手写值为准
				//if(!item.conflict){
				//	item.conflict = [];
				//}
				//item.conflict.push(item);
			}else{
				item['name'] = name;
			}
		}else{
			consoleExit('解析格式错误,无法解析出成员名称',item.desc);
		}

		//step 7 添加solved标记
		if(item['solution-url'] == ''){
			delete item['solution-url'];
		}
		if('solution-url' in item && !('solved' in item)){
			item.solved = true;
		}
		//此时没有完全解析 请不要通配星号＊
		return item;
	}

	function formatJsonConfig(solvedJson){
		//if(!solvedJson){
		//	solvedJson = JSON.parse(file.read(jsonPath));
		//}
		//添加快表
		//快表的目的是确保唯一
		if(!solvedJson.quickLST){
			solvedJson.quickLST = {};
		}
		solvedJson.forEach(function(item){
			if(item.desc){
				if(item.desc in solvedJson.quickLST){
					mergeItem(item,solvedJson.quickLST[item.desc]);
					formatItem(solvedJson.quickLST[item.desc]);
				}else{
					formatItem(item);
					if(item.name == '*'){
						solvedJson.quickLST[item['category-name']] = item;
					}else{
						solvedJson.quickLST[item.desc] = item;
					}
				}
			}
		});
		//清空数据
		solvedJson.length = 0;

		//对未解决项再次查找快表 重组单项
		for(var p in solvedJson.quickLST){
			var item = solvedJson.quickLST[p];
			//对单项查找快表
			if(item.name != '*' ){
				if(item.solved != true &&
					item['category-name'] in solvedJson.quickLST){
					item.solved = solvedJson.quickLST[item['category-name']].solved;
				}
				solvedJson.push(item);
				delete solvedJson.quickLST[p];
			}else{
				//把＊号放在最上面
				solvedJson.unshift(item);
			}
		}
		//solvedJson.forEach(function(item){
		//	//对未解决项再次查找快表
		//	if(!item.solved){
		//		for(var p in solvedJson.quickLST){
		//			if(solvedJson.quickLST[p].name != '*'){
		//				delete solvedJson.quickLST[p];
		//			}else
		//			if(solvedJson.quickLST[p]['category-name'] == item['category-name']){
		//				item.solved = solvedJson.quickLST[p].solved;
		//			}
		//		}
		//	}
		//});
		return solvedJson;
	}

	function compareAndGenJSON(comparingFilePath,comparedFilePath,solvedJsonFile,genJsonFile,isRaw){
		isConsoleEnabled = true;
		var writeFilePath;
		if(isRaw){
			output_type = OUTPUT_TYPE_API;
		}
		//支持多文件输入
		if(solvedJsonFile && typeof solvedJsonFile == 'object'){
			if(!genJsonFile)return;
			writeFilePath = genJsonFile;
			outputLst = solvedJsonFile;
		}else
		//额外生成的jsonFile路径
		if(genJsonFile){
			writeFilePath = genJsonFile;
		}else
		//没有输出的文件路径则复用输入的路径
		if(solvedJsonFile) {
			//写回
			writeFilePath = solvedJsonFile;
			//输出对象指向solvedJson
			solvedJson = formatJsonConfig(JSON.parse(file.read(solvedJsonFile)));
			outputLst = solvedJson;
		}else return;

		compareEndCallBack = function(){
			if(!isRaw){
				formatJsonConfig(outputLst);
			}
			file.save(writeFilePath,JSON.stringify(outputLst,null,4));
		}
		compare(comparingFilePath,comparedFilePath,solvedJsonFile);

	}

	function loadAndFormatJSON(jsonFilePath){
		return loadMultiAndFormatJSON.apply(this,file.getDirectoryAllListing(jsonFilePath));
	}

	function loadMultiAndFormatJSON(){
		var solvedJson = [];
		if(arguments.length>1){
			for(var i=0;i<arguments.length;i++){
				var filePath = arguments[i];
				var mergeItem = JSON.parse(file.read(filePath));
				mergeItem.forEach(function(item){
						//以文件名区分来源
						var source = filePath.substr(filePath.lastIndexOf('/')+1);
						if(source.indexOf('solved') != -1){
							item.source = source;
						}
						solvedJson.push(item);
					});
			}
		}
		return formatJsonConfig(solvedJson);
	}

	module.exports.compare = compare;
	module.exports.compare_gen = compareAndGenJSON;
	module.exports.load_format = loadAndFormatJSON;
	module.exports.load_multi_format = loadMultiAndFormatJSON;
})();

//if(process.argv.length>3){
//	module.exports.compare(process.argv.slice(0,2));
//}


