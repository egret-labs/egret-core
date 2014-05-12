/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module ns_egret {

    export class SkinParser{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		
		/**
		 * 配置管理器实例
		 */		
		private skinConfig:ISkinConfig;
		
		/**
		 * 当前类 
		 */		
		private currentClass:CpClass;
		/**
		 * 当前编译的类名
		 */		
		private currentClassName:string;
		/**
		 * 当前要编译的DXML文件 
		 */		
		private currentXML:XML;
		/**
		 * id缓存字典 
		 */		
		private idDic:any;
		/**
		 * 状态代码列表 
		 */		
		private stateCode:Array<CpState>;
		/**
		 * 需要单独创建的实例id列表
		 */		
		private stateIds:Array<any> = [];
		
		/**
		 * 编译指定的XML对象为ActionScript类。
		 * 注意:编译前要先注入flexlite-manifest.xml清单文件给manifestData属性。 清单文件可以用ManifestUtil类生成。
		 * @param skinData 要编译的dxml文件内容
		 * @param className 要编译成的完整类名，包括包名。
		 */		
		public parse(skinData:Object):any{
			if(!skinData)
				return null;
			if(!this.skinConfig){
				try{
					this.skinConfig = Injector.getInstance("ISkinConfig");
				}
				catch(e){
					this.skinConfig = new SkinConfig();
				}
			}
			this.currentXML = new XML(skinData);	
			this.delayAssignmentDic = {};
			className = className.split("::").join(".");
			this.currentClassName = className;
			this.idDic = new Dictionary;
			this.stateCode = new Array<CpState>();
			this.declarations = null;
			this.currentClass = new CpClass();
			this.stateIds = [];
			this.currentClass.notation = new CpNotation(
				"@private\n此类由编译器自动生成，您应修改对应的DXML文件内容，然后重新编译，而不应直接修改其代码。\n@author DXMLCompiler");
			
			var index:number = className.lastIndexOf(".");
			if(index!=-1){
				this.currentClass.packageName = className.substring(0,index);
				this.currentClass.className = className.substring(index+1);
			}
			else{
				this.currentClass.className = className;
			}
			this.startCompile();
			var resutlCode:string = this.currentClass.toCode();
			this.currentClass = null;
			return resutlCode;
		}
		
		private declarations:XML;
		/**
		 * 开始编译
		 */		
		private startCompile():void{
			this.currentClass.superClass = this.getPackageByNode(this.currentXML);
			
			this.getStateNames();
			if(this.stateCode.length>0&&!this.currentXML.hasOwnProperty("@currentState")){
				this.currentXML.@currentState = this.stateCode[0].name;
			}
			
			for each(var node:XML in this.currentXML.children()){
				if(node.localName()==DXMLCompiler.DECLARATIONS){
					this.declarations = node;
					break;
				}
			}
			
			if(this.declarations){//清理声明节点里的状态标志
				for each(node in this.declarations.children()){
					if(node.hasOwnProperty("@includeIn"))
						delete node.@includeIn;
					if(node.hasOwnProperty("@excludeFrom"))
						delete node.@excludeFrom;
				}
			}
			
			this.addIds(this.currentXML.children());
			
			this.createConstructFunc();
		}
		
		/**
		 * 添加必须的id
		 */		
		private addIds(items:XMLList):void{
			for each(var node:XML in items){
				if(node.namespace()==this.DXML.FS){
				}
				else if(node.hasOwnProperty("@id")){
					this.createVarForNode(node);
					if(this.isStateNode(node))//检查节点是否只存在于一个状态里，需要单独实例化
						this.stateIds.push(<string><any> (node.@id));
				}
				else if(this.getPackageByNode(node)!=""){
					this.createIdForNode(node);
					if(this.isStateNode(node))
						this.stateIds.push(<string><any> (node.@id));
				}
				this.addIds(node.children());
			}
		}
		/**
		 * 检测指定节点的属性是否含有视图状态
		 */		
		private static containsState(node:XML):boolean{
			if(node.hasOwnProperty("@includeIn")||node.hasOwnProperty("@excludeFrom")){
				return true;
			}
			var attributes:XMLList = node.attributes();
			for each(var item:XML in attributes){
				var name:string= item.localName();
				if(name.indexOf(".")!=-1){
					return true;
				}
			}
			return false;
		}
		
		/**
		 * 为指定节点创建id属性
		 */		
		private createIdForNode(node:XML):void{
			var idName:string = this.getNodeId(node);
			if(this.idDic[idName]==null)
				this.idDic[idName] = 1;
			else
				this.idDic[idName] ++;
			idName += this.idDic[idName];
			node.@id = idName;
		}
		/**
		 * 获取节点ID
		 */		
		private getNodeId(node:XML):string{
			if(node.hasOwnProperty("@id"))
				return node.@id;
			return "__"+this.currentClass.className+"_"+node.localName();
		}
		
		/**
		 * 为指定节点创建变量
		 */		
		private createVarForNode(node:XML):void{
			var className:string = node.localName();
			if(this.isBasicTypeData(className)){
				if(!this.currentClass.containsVar(node.@id))
					this.currentClass.addVariable(new CpVariable(node.@id,Modifiers.M_PUBLIC,className));
				return;
			}
			var packageName:string = this.getPackageByNode(node);
			if(packageName=="")
				return;
			if(!this.currentClass.containsVar(node.@id))
				this.currentClass.addVariable(new CpVariable(node.@id,Modifiers.M_PUBLIC,packageName));
		}
		/**
		 * 为指定节点创建初始化函数,返回函数名引用
		 */		
		private createFuncForNode(node:XML):string{
			var packageName:string = this.getPackageByNode(node);
			var className:string = node.localName();
			var isBasicType:boolean = this.isBasicTypeData(className);
			if(!isBasicType&&(this.isProperty(node)||packageName==""))
				return "";
			if(isBasicType)
				return this.createBasicTypeForNode(node);
			var func:CpFunction = new CpFunction;
			var tailName:string = "_i";
			var id:string = node.@id;
			func.name = id+tailName;
			func.returnType = packageName;
			var cb:CpCodeBlock = new CpCodeBlock;
			var varName:string = "temp";
			if(packageName=="flash.geom.Transform"){//Transform需要构造函数参数
				cb.addVar(varName,packageName,"new "+packageName+"(new Shape())");
				this.currentClass.addImport("flash.display.Shape");
			}
			else{
				cb.addVar(varName,packageName,"new "+packageName+"()");
			}
			var containsId:boolean = this.currentClass.containsVar(node.@id);
			if(containsId){
				cb.addAssignment(node.@id,varName);
			}
			
			this.addAttributesToCodeBlock(cb,varName,node);
			
			var children:XMLList = node.children();
			var obj:any = this.skinConfig.getDefaultPropById(node.localName(),node.namespace());
			var property:string = obj.name;
			var isArray:boolean = obj.isArray;
			
			this.initlizeChildNode(cb,children,property,isArray,varName);
			if(this.delayAssignmentDic[id]){
				cb.concat(this.delayAssignmentDic[id]);
			}
			cb.addReturn(varName);
			func.codeBlock = cb;
			this.currentClass.addFunction(func);
			return func.name+"()";
		}
		
		private basicTypes:Array<string> = 
			new <string>["Array","uint","int","Boolean","String","Number","Class","Vector"];
		/**
		 * 检查目标类名是否是基本数据类型
		 */		
		private isBasicTypeData(className:string):boolean{
			for each(var type:string in this.basicTypes){
				if(type==className)
					return true;
			}
			return false;
		}
		/**
		 * 为指定基本数据类型节点实例化,返回实例化后的值。
		 */		
		private createBasicTypeForNode(node:XML):string{
			var className:string = node.localName();
			var returnValue:string = "";
			var child:XML;
			var varItem:CpVariable = this.currentClass.getVariableByName(node.@id);
			switch(className){
				case "Array":
				case "Vector":
					var values:Array<any> = [];
					for each(child in node.children()){
					values.push(this.createFuncForNode(child));
				}
					returnValue = "["+values.join(",")+"]";
					if(className=="Vector"){
						returnValue = "new <"+node.@type+">"+returnValue;
					}
					break;
				case "uint":
				case "int":
				case "Boolean":
				case "Class":
					returnValue = node.toString();
					returnValue = StringUtil.trim(returnValue);
					break;
				case "Number":
					returnValue = StringUtil.trim(node.toString());
					if(returnValue.indexOf("%")!=-1)
						returnValue = returnValue.substring(0,returnValue.length-1);
					break;
				case "String":
					returnValue = this.formatString(node.toString());
					break;
			}
			if(varItem)
				varItem.defaultValue = returnValue;
			return returnValue;
		}
		/**
		 * 延迟赋值字典
		 */		
		private delayAssignmentDic:any = {};
		/**
		 * 将节点属性赋值语句添加到代码块
		 */		
		private addAttributesToCodeBlock(cb:CpCodeBlock,varName:string,node:XML):void{
			var keyList:Array<any> = [];
			var key:string;
			var value:string;
			for each(var item:XML in node.attributes()){
				key = item.localName();
				if(!this.isNormalKey(key))
					continue;
				keyList.push(key);
			}
			keyList.sort();//排序一下防止出现随机顺序
			for each(key in keyList){
				value = node["@"+key].toString();
				key = this.formatKey(key,value);
				value  = this.formatValue(key,value,node);
				if(this.currentClass.containsVar(value)){//赋的值对象是一个id
					var id:string = node.@id;
					var codeLine:string = id+" = temp;";
					if(!this.currentClass.containsVar(id))
						this.createVarForNode(node);
					if(!cb.containsCodeLine(codeLine)){
						cb.addCodeLineAt(codeLine,1);
					}
					var delayCb:CpCodeBlock = new CpCodeBlock();
					if(varName==KeyWords.KW_THIS){
						delayCb.addAssignment(varName,value,key);
					}
					else{
						
						delayCb.startIf(id);
						delayCb.addAssignment(id,value,key);
						delayCb.endBlock();
					}
					this.delayAssignmentDic[value] = delayCb;
				}
				cb.addAssignment(varName,value,key);
			}
		}
		/**
		 * 初始化子项
		 */		
		private initlizeChildNode(cb:CpCodeBlock,children:XMLList,
										   property:string,isArray:boolean,varName:string):void{
			if(children.length()==0)
				return;
			var child:XML;
			var childFunc:string = "";
			var directChild:Array<any> = [];
			var prop:string = "";
			for each(child in children){
				prop = child.localName(); 
				if(prop==DXMLCompiler.DECLARATIONS||prop=="states"||child.namespace()==this.DXML.FS){
					continue;
				}
				if(this.isProperty(child)){
					var childLength:number = child.children().length();
					if(childLength==0)
						continue;
					var isContainerProp:boolean = (prop==property&&isArray);
					if(childLength>1){
						var values:Array<any> = [];
						for each(var item:XML in child.children()){
							childFunc = this.createFuncForNode(item);
							if(!isContainerProp||!this.isStateNode(item))
								values.push(childFunc);
						}
						childFunc = "["+values.join(",")+"]";
					}
					else{
						var firsChild:XML = child.children()[0];
						if(isContainerProp){
							if(firsChild.localName()=="Array"){
								values = [];
								for each(item in firsChild.children()){
									childFunc = this.createFuncForNode(item);
									if(!isContainerProp||!this.isStateNode(item))
										values.push(childFunc);
								}
								childFunc = "["+values.join(",")+"]";
							}
							else{
								childFunc = this.createFuncForNode(firsChild);
								if(!this.isStateNode(item))
									childFunc = "["+childFunc+"]";
								else
									childFunc = "[]";
							}
						}
						else{
							childFunc = this.createFuncForNode(firsChild);
						}
					}
					if(childFunc!=""){
						if(childFunc.indexOf("()")==-1)
							prop = this.formatKey(prop,childFunc);
						cb.addAssignment(varName,childFunc,prop);
					}
				}
				else{
					directChild.push(child);
				}
				
			}
			if(directChild.length==0)
				return;
			if(isArray&&(directChild.length>1||directChild[0].localName()!="Array")){
				var childs:Array<any> = [];
				for each(child in directChild){
					childFunc = this.createFuncForNode(child);
					if(childFunc==""||this.isStateNode(child))
						continue;
					childs.push(childFunc);
				}
				cb.addAssignment(varName,"["+childs.join(",")+"]",property);
			}
			else{
				childFunc = this.createFuncForNode(directChild[0]);
				if(childFunc!=""&&!this.isStateNode(child))
					cb.addAssignment(varName,childFunc,property);
			}
		}
		
		/**
		 * 指定节点是否是属性节点
		 */		
		private isProperty(node:XML):boolean{
			var name:string = node.localName();
			if(name==null)
				return true;
			if(name=="int"||name=="uint")
				return false;
			var firstChar:string = name.charAt(0);
			return firstChar<"A"||firstChar>"Z";
		}
		/**
		 * 命名空间为fs的属性名列表
		 */		
		public static fsKeys:Array<string> = new <string>["id","locked","includeIn","excludeFrom"];
		/**
		 * 是否是普通赋值的key
		 */		
		private isNormalKey(key:string):boolean{
			if(!key||key.indexOf(".")!=-1||DXMLCompiler.fsKeys.indexOf(key)!=-1)
				return false;
			return true;
		}
		/**
		 * 格式化key
		 */		
		private formatKey(key:string,value:string):string{
			if(value.indexOf("%")!=-1){
				if(key=="height")
					key = "percentHeight";
				else if(key=="width")
					key = "percentWidth";
			}
			return key;
		}
		/**
		 * 格式化值
		 */		
		private formatValue(key:string,value:string,node:XML):string{
			var stringValue:string = value;//除了字符串，其他类型都去除两端多余空格。
			value = StringUtil.trim(value);
			var index:number = value.indexOf("@Embed(");
			if(index!=-1){
				var id:string = node.hasOwnProperty("@id")?node.@id:"this";
				var metadata:string = value.substr(index+1);
				this.currentClass.addVariable(new CpVariable(id+"_"+key,Modifiers.M_PRIVATE,"Class","",true,false,metadata));
				value = id+"_"+key; 
			}
			else if(value.indexOf("{")!=-1){
				value = value.substr(1,value.length-2);
			}
			else{
				var className:string = this.skinConfig.getClassNameById(node.localName(),node.namespace());
				var type:string = this.skinConfig.getPropertyType(key,className,value);
				switch(type){
					case "Class":
						if(value==this.currentClassName)//防止无限循环。
							return "null";
						this.currentClass.addImport(value);
						break;
					case "uint":
						if(value.indexOf("#")==0)
							value = "0x"+value.substring(1);
						break;
					case "Number":
						if(value.indexOf("%")!=-1)
							value = (<number><any> (value.substr(0,value.length-1))).toString();
						break;
					case "String":
						value = this.formatString(stringValue);
						break;
					default:
						break;
				}
			}
			return value;
		}
		/**
		 * 格式化字符串
		 */		
		private formatString(value:string):string{
			value = StringUtil.unescapeHTMLEntity(value);
			value = value.split("\n").join("\\n");
			value = value.split("\r").join("\\n");
			value = value.split("\"").join("\\\"");
			value = "\""+value+"\"";
			return value;
		}
		
		/**
		 * 创建构造函数
		 */		
		private createConstructFunc():void{
			var cb:CpCodeBlock = new CpCodeBlock;
			cb.addEmptyLine();
			var varName:string = KeyWords.KW_THIS;
			this.addAttributesToCodeBlock(cb,varName,this.currentXML);
			
			if(this.declarations&&this.declarations.children().length()>0){
				for each(var decl:XML in this.declarations.children()){
					
					var funcName:string = this.createFuncForNode(decl);
					if(funcName!=""){
						cb.addCodeLine(funcName+";");
					}
				}
			}
			
			var obj:any =  this.skinConfig.getDefaultPropById(this.currentXML.localName(),this.currentXML.namespace());
			var property:string = obj.name;
			var isArray:boolean = obj.isArray;
			this.initlizeChildNode(cb,this.currentXML.children(),property,isArray,varName);
			var id:string;
			if(this.stateIds.length>0){
				for each(id in this.stateIds){
					cb.addCodeLine(id+"_i();");
				}
				cb.addEmptyLine();
			}
			cb.addEmptyLine();

			//生成视图状态代码
			this.createStates(this.currentXML.children());
			var states:Array<CpState>;
			for each(var item:XML in this.currentXML.attributes()){
				var itemName:string= item.localName();
				var index:number = itemName.indexOf(".");
				if(index!=-1){
					var key:string = itemName.substring(0,index);
					key = this.formatKey(key,item);
					var itemValue:string = this.formatValue(key,item,this.currentXML);
					var stateName:string = itemName.substr(index+1);
					states = this.getStateByName(stateName);
					if(states.length>0){
						for each(var state:CpState in states)
						state.addOverride(new CpSetProperty("",key,itemValue));
					}
				}
			}
			
			for each(state in this.stateCode){
				if(state.addItems.length>0){
					this.currentClass.addImport(DXMLCompiler.ADD_ITEMS_PACKAGE);
					break;
				}
			}
			
			for each(state in this.stateCode){
				if(state.setProperty.length>0){
					this.currentClass.addImport(DXMLCompiler.SETPROPERTY_PACKAGE);
					break;
				}
			}
			
			//打印视图状态初始化代码
			if(this.stateCode.length>0){
				this.currentClass.addImport(DXMLCompiler.STATE_CLASS_PACKAGE);
				cb.addCodeLine("states = [");
				var first:boolean = true;
				var indentStr:string = "	";
				for each(state in this.stateCode){
					if(first)
						first = false;
					else
						cb.addCodeLine(indentStr+",");
					var codes:Array<any> = state.toCode().split("\n");
					var codeIndex:number = 0;
					while(codeIndex<codes.length){
						cb.addCodeLine(indentStr+codes[codeIndex]);
						codeIndex++;
					}
				}
				cb.addCodeLine("];");
			}
			
			
			this.currentClass.constructCode = cb;
		}
		
		/**
		 * 是否含有includeIn和excludeFrom属性
		 */		
		private isStateNode(node:XML):boolean{
			return node.hasOwnProperty("@includeIn")||node.hasOwnProperty("@excludeFrom");
		}
		
		/**
		 * 获取视图状态名称列表
		 */		
		private getStateNames():void{
			var states:XMLList;
			for each(var item:XML in this.currentXML.children()){
				if(item.localName()=="states"){
					states = item.children();
					break;
				}
			}
			if(states==null||states.length()==0)
				return;
			for each(var state:XML in states){
				var stateGroups:Array<any> = [];
				if(state.hasOwnProperty("@stateGroups")){
					var groups:Array<any> = (<string><any> (state.@stateGroups)).split(",");
					for each(var group:string in groups){
						if(StringUtil.trim(group)!=""){
							stateGroups.push(StringUtil.trim(group));
						}
					}
				}
				this.stateCode.push(new CpState(state.@name,stateGroups));
			}
		}
		
		/**
		 * 解析视图状态代码
		 */		
		private createStates(items:XMLList):void{
			for each(var node:XML in items){
				this.createStates(node.children());
				if(this.isProperty(node)||this.getPackageByNode(node)=="")
					continue;
				if(DXMLCompiler.containsState(node)){
					var id:string = node.@id;
					this.checkIdForState(node);
					var stateName:string;
					var states:Array<CpState>;
					var state:CpState;
					if(this.isStateNode(node)){
						var propertyName:string = "";
						var parentNode:XML = <XML><any> (node.parent());
						if(parentNode.localName()=="Array")
							parentNode = <XML><any> (parentNode.parent());
						if(this.isProperty(parentNode))
							parentNode = <XML><any> (parentNode.parent());
						if(parentNode!=null&&parentNode != this.currentXML){
							propertyName = parentNode.@id;
							this.checkIdForState(parentNode);
						}
						var positionObj:any = this.findNearNodeId(node);
						var stateNames:Array<any> = [];
						if(node.hasOwnProperty("@includeIn")){
							stateNames = node.@includeIn.toString().split(",");
						}
						else{
							var excludeNames:Array<any> = node.@excludeFrom.toString().split(",");
							for each(state in this.stateCode){
								if(excludeNames.indexOf(state.name)==-1)
									stateNames.push(state.name);
							}
						}
						
						for each(stateName in stateNames){
							states = this.getStateByName(stateName);
							if(states.length>0){
								for each(state in states){
									state.addOverride(new CpAddItems(id,propertyName,
										positionObj.position,positionObj.relativeTo));
								}
							}
						}
					}
					
					for each(var item:XML in node.attributes()){
						var name:string= item.localName();
						var index:number = name.indexOf(".");
						if(index!=-1){
							var key:string = name.substring(0,index);
							key = this.formatKey(key,item);
							var value:string = this.formatValue(key,item,node);
							stateName = name.substr(index+1);
							states = this.getStateByName(stateName);
							if(states.length>0){
								for each(state in states)
								state.addOverride(new CpSetProperty(id,key,value));
							}
						}
					}
				}
			}
			
		}
		/**
		 * 检查指定的ID是否创建了类成员变量，若没创建则为其创建。
		 */		
		private checkIdForState(node:XML):void{
			if(!node||this.currentClass.containsVar(node.@id)){
				return;
			}
			this.createVarForNode(node);
			var id:string = node.@id;
			var funcName:string = id+"_i";
			var func:CpFunction = this.currentClass.getFuncByName(funcName);
			if(!func)
				return;
			var codeLine:string = id+" = temp;";
			var cb:CpCodeBlock = func.codeBlock;
			if(!cb)
				return;
			if(!cb.containsCodeLine(codeLine)){
				cb.addCodeLineAt(codeLine,1);
			}
		}
		/**
		 * 通过视图状态名称获取对应的视图状态
		 */		
		private getStateByName(name:string):Array<CpState>{
			var states:Array<CpState> = new Array<CpState>;
			for each(var state:CpState in this.stateCode){
				if(state.name == name){
					if(states.indexOf(state)==-1)
						states.push(state);
				}
				else if(state.stateGroups.length>0){
					var found:boolean = false;
					for each(var g:string in state.stateGroups){
						if(g==name){
							found = true;
							break;
						}
					}
					if(found){
						if(states.indexOf(state)==-1)
							states.push(state);
					}
				}
			}
			return states;
		}
		/**
		 * 寻找节点的临近节点ID和位置
		 */		
		private findNearNodeId(node:XML):any{
			var parentNode:XML = node.parent();
			var targetId:string = "";
			var postion:string;
			var index:number = -1;
			var totalCount:number = 0;
			var preItem:XML;
			var afterItem:XML;
			var found:boolean = false;
			for each(var item:XML in parentNode.children()){
				if(this.isProperty(item))
					continue;
				if(item==node){
					found = true;
					index = totalCount;
				}
				else{
					if(found&&!afterItem&&!this.isStateNode(item)){
						afterItem = item;
					}
				}
				if(!found&&!this.isStateNode(item))
					preItem = item;
				totalCount++;
			}
			if(index==0){
				postion = "first";
				return {position:postion,relativeTo:targetId};
			}
			if(index==totalCount-1){
				postion = "last";
				return {position:postion,relativeTo:targetId};
			}
			if(afterItem){
				postion = "before";
				targetId = afterItem.@id;
				if(targetId){
					this.checkIdForState(afterItem);
					return {position:postion,relativeTo:targetId};
				}
				
			}
			
			return {position:"last",relativeTo:targetId};
		}
		
		
		private static STATE_CLASS_PACKAGE:string = "org.flexlite.domUI.states.State";
		
		private static ADD_ITEMS_PACKAGE:string = "org.flexlite.domUI.states.AddItems";
		
		private static SETPROPERTY_PACKAGE:string = "org.flexlite.domUI.states.SetProperty";
		
		private static DECLARATIONS:string = "Declarations";
		
		/**
		 * 根据类名获取对应的包，并自动导入相应的包
		 */		
		private getPackageByNode(node:XML):string{
			var packageName:string = 
				this.skinConfig.getClassNameById(node.localName(),node.namespace());
			this.skinConfig.checkComponent(packageName);
			if(packageName&&packageName.indexOf(".")!=-1){
				this.currentClass.addImport(packageName);
			}
			return packageName;
		}
		
		/**
		 * 检查变量是否是包名
		 */		
		private isPackageName(name:string):boolean{
			return name.indexOf(".")!=-1;
		}
    }

}