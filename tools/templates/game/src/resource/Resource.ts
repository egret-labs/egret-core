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

/// <reference path="../egret.d.ts"/>
/// <reference path="analyzer/AnalyzerBase.ts"/>
/// <reference path="analyzer/BinAnalyzer.ts"/>
/// <reference path="analyzer/ImgAnalyzer.ts"/>
/// <reference path="analyzer/JsonAnalyzer.ts"/>
/// <reference path="analyzer/TxtAnalyzer.ts"/>
/// <reference path="core/ResourceConfig.ts"/>
/// <reference path="core/ResourceItem.ts"/>
/// <reference path="core/ResourceLoader.ts"/>
/// <reference path="events/ResourceEvent.ts"/>

module ns_egret {

	export class Resource extends EventDispatcher{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
			if(Resource._instance){
				throw new Error("实例化单例:Res出错！");
			}
			this.init();
		}

		public static _instance:Resource;
		/**
		 * 获取事件监听对象
		 */		
		public static get eventDispatcher():Resource{
			return Resource._instance;
		}

        /**
         * 加载配置文件并解析
         * @param url 配置文件路径(resource.json的路径)
         * @param resourceRoot 资源根路径。配置中的所有url都是这个路径的相对值。
         */
        public static loadConfig(url:string,resourceRoot:string=""):void{
            Resource._instance.loadConfig(url,resourceRoot);
        }
		/**
		 * 根据组名加载一组资源
		 * @param name 要加载资源组的组名
		 * @param priority 加载优先级,可以为负数,默认值为0。
		 * 低优先级的组必须等待高优先级组完全加载结束才能开始，同一优先级的组会同时加载。
		 */	
		public static loadGroup(name:string,priority:number=0):void{
			Resource._instance.loadGroup(name,priority);
		}
        /**
         * 检查某个资源组是否已经加载完成
         * @param groupName 组名
         */
        public static isGroupLoaded(name:string):boolean{
            return Resource._instance.isGroupLoaded(name);
        }
        /**
         * 根据组名获取组加载项列表
         * @param name 组名
         */
        public static getGroupByName(name:string):Array<ResourceItem>{
            return Resource._instance.getGroupByName(name);
        }
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @param name 要创建的加载资源组的组名
         * @param keys 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项。
         * @param override 是否覆盖已经存在的同名资源组,默认false。
         * @return 是否创建成功，如果传入的keys为空，或keys全部无效，则创建失败。
         */
        public static createGroup(name:string,keys:Array<string>,override:boolean = false):boolean{
            return Resource._instance.createGroup(name,keys,override);
        }
		/**
		 * 检查配置文件里是否含有指定的资源
		 * @param name 对应配置文件里的name属性。
		 */		
		public static hasRes(name:string):boolean{
			return Resource._instance.hasRes(name);
		}
		/**
		 * 同步方式获取缓存的已经加载成功的资源。<br/>
		 * @param name 对应配置文件里的name属性。
		 */
		public static getRes(name:string):any{
			return Resource._instance.getRes(name);
		}
		/**
		 * 异步方式获取配置里的资源。只要是配置文件里存在的资源，都可以通过异步方式获取。
		 * @param name 对应配置文件里的name属性。
		 * @param compFunc 回调函数。示例：compFunc(data):void,若设置了other参数则为:compFunc(data,other):void。
		 * @param thisObject 回调函数的this引用
		 */
		public static getResAsync(name:string,compFunc:Function,thisObject:any):void{
			Resource._instance.getResAsync(name,compFunc,thisObject);
		}
		/**
		 * 通过完整URL方式获取外部资源。
		 * @param url 要加载文件的外部路径。
		 * @param compFunc 回调函数。示例：compFunc(data):void,若设置了other参数则为:compFunc(data,other):void。
         * @param thisObject 回调函数的this引用
		 * @param type 文件类型(可选)。请使用ResourceItem类中定义的静态常量。若不设置将根据文件扩展名生成。
		 */
		public static getResByUrl(url:string,compFunc:Function,thisObject:any,type:string=""):void{
			Resource._instance.getResByUrl(url,compFunc,thisObject,type);
		}
        /**
         * 销毁某个资源文件的缓存数据,返回是否删除成功。
         * @param name 配置文件中加载项的name属性
         */
		public static destroyRes(name:string):boolean{
			return Resource._instance.destroyRes(name);
		}
		
		/**
		 * 解析器字典
		 */		
		private analyzerDic:any = {};
		/**
		 * 根据type获取对应的文件解析库
		 */		
		private getAnalyzerByType(type:string):AnalyzerBase{
			var analyzer:AnalyzerBase = this.analyzerDic[type];
			if(!analyzer){
				analyzer = this.analyzerDic[type] = Injector.getInstance(AnalyzerBase,type);
			}
			return analyzer;
		}
		
		/**
		 * 多文件队列加载器
		 */		
		private resLoader:ResourceLoader;
		/**
		 * 初始化
		 */		
		private init():void{
			if(!Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_BIN))
				Injector.mapClass(AnalyzerBase,BinAnalyzer,ResourceItem.TYPE_BIN);
			if(!Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_IMG))
				Injector.mapClass(AnalyzerBase,ImgAnalyzer,ResourceItem.TYPE_IMG);
			if(!Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_TXT))
				Injector.mapClass(AnalyzerBase,TxtAnalyzer,ResourceItem.TYPE_TXT);
			if(!Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_JSON))
				Injector.mapClass(AnalyzerBase,JsonAnalyzer,ResourceItem.TYPE_JSON);
			this.resConfig = new ResourceConfig();
			this.resLoader = new ResourceLoader();
            this.resLoader.callBack = this.onResourceItemComp;
            this.resLoader.resInstance = this;
			this.resLoader.addEventListener(ResourceEvent.GROUP_COMPLETE,this.onGroupComp,this);
		}
		
		/**
		 * 配置文件组组名
		 */		
		private static GROUP_CONFIG:string = "RES__CONFIG";

		private configURL:string;
        private configFolder:string;
		/**
		 * 配置文件加载解析完成标志
		 */		
		private configComplete:boolean = false;

		private loadConfig(url:string,folder:string):void{
            this.configURL = url;
            this.configFolder = folder;
            var resItem:ResourceItem = new ResourceItem(url,url,ResourceItem.TYPE_JSON);
			var itemList:Array<ResourceItem> = [resItem];
			this.resLoader.loadGroup(itemList,Resource.GROUP_CONFIG,Number.MAX_VALUE);
		}
		/**
		 * 已经加载过组名列表
		 */		
		private loadedGroups:Array<string> = new Array<string>();
		/**
		 * 检查某个资源组是否已经加载完成
		 * @param groupName 组名
		 */		
		private isGroupLoaded(name:string):boolean{
			return this.loadedGroups.indexOf(name)!=-1;
		}
		/**
		 * 根据组名获取组加载项列表
		 * @param name 组名
		 */		
		private getGroupByName(name:string):Array<ResourceItem>{
			return this.resConfig.getGroupByName(name);
		}
		
		private groupNameList:Array<any> = [];
		/**
		 * 根据组名加载一组资源
		 * @param name 要加载资源组的组名
		 * @param priority 加载优先级,低优先级的组必须等待高优先级组完全加载结束才能开始，同一优先级的组同时加载。
		 */
		private loadGroup(name:string,priority:number=0):void{
			if(this.loadedGroups.indexOf(name)!=-1||this.resLoader.isGroupInLoading(name))
				return;
			if(this.configComplete){
				var group:Array<ResourceItem> = this.resConfig.getGroupByName(name);
				this.resLoader.loadGroup(group,name,priority);
			}
			else{
				this.groupNameList.push({name:name,priority:priority});
			}
		}
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @param name 要创建的加载资源组的组名
         * @param keys 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项。
         * @param override 是否覆盖已经存在的同名资源组,默认false。
         * @return 是否创建成功，如果传入的keys为空，或keys全部无效，则创建失败。
         */
        private createGroup(name:string,keys:Array<string>,override:boolean=false):boolean{
            return this.resConfig.createGroup(name,keys,override);
        }
		/**
		 * res配置数据
		 */		
		private resConfig:ResourceConfig;
		/**
		 * 队列加载完成事件
		 */		
		private onGroupComp(event:ResourceEvent):void{
			if(event.groupName==Resource.GROUP_CONFIG){
                var analyzer:AnalyzerBase = this.getAnalyzerByType(ResourceItem.TYPE_JSON);
                var data:any = analyzer.getRes(this.configURL);
                analyzer.destroyRes(this.configURL);
                this.resConfig.parseConfig(data,this.configFolder);
				this.configComplete = true;
                ResourceEvent.dispatchResourceEvent(this,ResourceEvent.CONFIG_COMPLETE);
                var groupNameList:Array<any> = this.groupNameList;
                var length:number = groupNameList.length;
                for(var i:number=0;i<length;i++){
                    var item:any = groupNameList[i];
					this.loadGroup(item.name,item.priority);
				}
				this.groupNameList = [];
			}
			else{
				this.loadedGroups.push(event.groupName);
                this.dispatchEvent(event);
			}

		}
		/**
		 * 检查配置文件里是否含有指定的资源
		 * @param name 对应配置文件里的name属性。
		 */		
		private hasRes(name:string):boolean{
			return this.resConfig.getType(name)!="";
		}
		
		private getRes(name:string):any{
			var type:string = this.resConfig.getType(name);
			if(type=="")
				return null;
			var analyzer:AnalyzerBase = this.getAnalyzerByType(type);
			return analyzer.getRes(name);
		}
		
		/**
		 * 异步获取资源参数缓存字典
		 */		
		private asyncDic:any = {};

		private getResAsync(name:string,compFunc:Function,thisObject:any):void{
			var type:string = this.resConfig.getType(name);
			if(type==""){
                compFunc.call(thisObject,null);
				return;
			}
			var analyzer:AnalyzerBase = this.getAnalyzerByType(type);
			var res:any = analyzer.getRes(name);
			if(res){
                compFunc.call(thisObject,res);
				return;
			}
            var args:any = {name:name,compFunc:compFunc,thisObject:thisObject};
            if(this.asyncDic[name]){
                this.asyncDic[name].push(args);
            }
            else{
                this.asyncDic[name] = [args];
                var resItem:ResourceItem = this.resConfig.getResourceItem(name);
                this.resLoader.loadItem(resItem);
            }
		}

		private getResByUrl(url:string,compFunc:Function,thisObject:any,type:string=""):void{
			if(!url){
                compFunc.call(thisObject,null);
				return;
			}
			if(!type)
				type = this.getTypeByUrl(url);
			var analyzer:AnalyzerBase = this.getAnalyzerByType(type);

			var name:string = url;
            var res:any = analyzer.getRes(name);
            if(res){
                compFunc.call(thisObject,res);
                return;
            }
			var args:any = {name:name,compFunc:compFunc,thisObject:thisObject};
			if(this.asyncDic[name]){
				this.asyncDic[name].push(args);
			}
			else{
				this.asyncDic[name] = [args];
				var resItem:ResourceItem = new ResourceItem(name,url,type);
				this.resLoader.loadItem(resItem);
			}
		}

		/**
		 * 通过url获取文件类型
		 */			
		private getTypeByUrl(url:string):string{
			var suffix:string = url.substr(url.lastIndexOf(".")+1);
			var type:string;
			switch(suffix){
				case ResourceItem.TYPE_XML:
				case ResourceItem.TYPE_TXT:
				case ResourceItem.TYPE_JSON:
					type = suffix;
					break;
				case "png":
				case "jpg":
				case "gif":
					type = ResourceItem.TYPE_IMG;
					break;
				default:
					type = ResourceItem.TYPE_BIN;
					break;
			}
			return type;
		}
		/**
		 * 一个加载项加载完成
		 */		
		private onResourceItemComp(item:ResourceItem):void{
			var argsList:Array<any> = this.asyncDic[item.name];
			delete this.asyncDic[item.name];
			var analyzer:AnalyzerBase = this.getAnalyzerByType(item.type);
            var length:number = argsList.length;
            for(var i:number=0;i<length;i++){
                var args:any = argsList[i];
                var res:any = analyzer.getRes(args.name);
                args.compFunc.call(args.thisObject,res);
			}
		}
		/**
		 * 销毁某个资源文件的缓存数据,返回是否删除成功。
		 * @param name 配置文件中加载项的name属性
		 */
		public destroyRes(name:string):boolean{
			var type:string = this.resConfig.getType(name);
			if(type=="")
				return false;
			var analyzer:AnalyzerBase = this.getAnalyzerByType(type);
			return analyzer.destroyRes(name);
		}
	}
}

ns_egret.Resource._instance = new ns_egret.Resource();