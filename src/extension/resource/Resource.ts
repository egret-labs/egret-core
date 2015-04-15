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


module RES {
    /**
     * 加载配置文件并解析
	 * @method RES.loadConfig
     * @param url {string} 配置文件路径(resource.json的路径)
     * @param resourceRoot {string} 资源根路径。配置中的所有url都是这个路径的相对值。最终url是这个字符串与配置里资源项的url相加的值。
     * @param type {string} 配置文件的格式。确定要用什么解析器来解析配置文件。默认"json"
     */
    export function loadConfig(url:string,resourceRoot:string="",type="json"):void{
        instance.loadConfig(url,resourceRoot,type);
    }
    /**
     * 根据组名加载一组资源
	 * @method RES.loadGroup
     * @param name {string} 要加载资源组的组名
     * @param priority {number} 加载优先级,可以为负数,默认值为0。
     * 低优先级的组必须等待高优先级组完全加载结束才能开始，同一优先级的组会同时加载。
     */
    export function loadGroup(name:string,priority:number=0):void{
        instance.loadGroup(name,priority);
    }
    /**
     * 检查某个资源组是否已经加载完成
	 * @method RES.isGroupLoaded
     * @param name {string} 组名
	 * @returns {boolean}
     */
    export function isGroupLoaded(name:string):boolean{
        return instance.isGroupLoaded(name);
    }
    /**
     * 根据组名获取组加载项列表
	 * @method RES.getGroupByName
     * @param name {string} 组名
	 * @returns {egret.ResourceItem}
     */
    export function getGroupByName(name:string):Array<ResourceItem>{
        return instance.getGroupByName(name);
    }
    /**
     * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
     * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
     * @method RES.createGroup
     * @param name {string} 要创建的加载资源组的组名
     * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
     * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
     * @returns {boolean}
     */
    export function createGroup(name:string,keys:Array<string>,override:boolean = false):boolean{
        return instance.createGroup(name,keys,override);
    }
    /**
     * 检查配置文件里是否含有指定的资源
	 * @method RES.hasRes
     * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
	 * @returns {boolean}
     */
    export function hasRes(key:string):boolean{
        return instance.hasRes(key);
    }
    /**
     * 运行时动态解析一个配置文件,
     * @method RES.parseConfig
     * @param data {any} 配置文件数据，请参考resource.json的配置文件格式。传入对应的json对象即可。
     * @param folder {string} 加载项的路径前缀。
     */
    export function parseConfig(data:any, folder:string=""):void {
        instance.parseConfig(data,folder);
    }
    /**
     * 同步方式获取缓存的已经加载成功的资源。<br/>
	 * @method RES.getRes
     * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
	 * @returns {any}
     */
    export function getRes(key:string):any{
        return instance.getRes(key);
    }
    /**
     * 异步方式获取配置里的资源。只要是配置文件里存在的资源，都可以通过异步方式获取。
	 * @method RES.getResAsync
     * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
     * @param compFunc {Function} 回调函数。示例：compFunc(data,key):void。
     * @param thisObject {any} 回调函数的this引用
     */
    export function getResAsync(key:string,compFunc:Function,thisObject:any):void{
        instance.getResAsync(key,compFunc,thisObject);
    }
    /**
     * 通过完整URL方式获取外部资源。
	 * @method RES.getResByUrl
     * @param url {string} 要加载文件的外部路径。
     * @param compFunc {Function} 回调函数。示例：compFunc(data,url):void。
     * @param thisObject {any} 回调函数的this引用
     * @param type {string} 文件类型(可选)。请使用ResourceItem类中定义的静态常量。若不设置将根据文件扩展名生成。
     */
    export function getResByUrl(url:string,compFunc:Function,thisObject:any,type:string=""):void{
        instance.getResByUrl(url,compFunc,thisObject,type);
    }
    /**
     * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
     * @method RES.destroyRes
     * @param name {string} 配置文件中加载项的name属性或资源组名
     * @returns {boolean}
     */
    export function destroyRes(name:string):boolean{
        return instance.destroyRes(name);
    }
    /**
     * 设置最大并发加载线程数量，默认值是2.
     * @method RES.setMaxLoadingThread
     * @param thread {number} 要设置的并发加载数。
     */
    export function setMaxLoadingThread(thread:number):void{
        instance.setMaxLoadingThread(thread);
    }
    
    /**
     * 设置资源加载失败时的重试次数，默认值是 3。
     * @param retry 要设置的重试次数。
     */
    export function setMaxRetryTimes(retry: number): void {
        instance.setMaxRetryTimes(retry);
    }

    /**
     * 添加事件侦听器,参考ResourceEvent定义的常量。
	 * @method RES.addEventListener
     * @param type {string} 事件的类型。
     * @param listener {Function} 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
     * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
     * @param thisObject {any} 侦听函数绑定的this对象
     * @param useCapture {boolean} 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
     * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
     * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
     * @param priority {number} 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
     * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
     */
    export function addEventListener(type:string, listener:Function, thisObject:any, useCapture:boolean = false, priority:number = 0):void {
        instance.addEventListener(type,listener,thisObject,useCapture,priority);
    }
    /**
     * 移除事件侦听器,参考ResourceEvent定义的常量。
	 * @method RES.removeEventListener
     * @param type {string} 事件名
     * @param listener {Function} 侦听函数
     * @param thisObject {any} 侦听函数绑定的this对象
     * @param useCapture {boolean} 是否使用捕获，这个属性只在显示列表中生效。
     */
    export function removeEventListener(type:string, listener:Function,thisObject:any,useCapture:boolean = false):void {
        instance.removeEventListener(type,listener,thisObject,useCapture);
    }



    class Resource extends egret.EventDispatcher{
        /**
         * 构造函数
		 * @method RES.constructor
         */
        public constructor(){
            super();
            this.init();
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
                analyzer = this.analyzerDic[type] = egret.Injector.getInstance(AnalyzerBase,type);
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
            if(!egret.Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_BIN))
                egret.Injector.mapClass(AnalyzerBase,BinAnalyzer,ResourceItem.TYPE_BIN);
            if(!egret.Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_IMAGE))
                egret.Injector.mapClass(AnalyzerBase,ImageAnalyzer,ResourceItem.TYPE_IMAGE);
            if(!egret.Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_TEXT))
                egret.Injector.mapClass(AnalyzerBase,TextAnalyzer,ResourceItem.TYPE_TEXT);
            if(!egret.Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_JSON))
                egret.Injector.mapClass(AnalyzerBase,JsonAnalyzer,ResourceItem.TYPE_JSON);
            if(!egret.Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_SHEET))
                egret.Injector.mapClass(AnalyzerBase,SheetAnalyzer,ResourceItem.TYPE_SHEET);
            if(!egret.Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_FONT))
                egret.Injector.mapClass(AnalyzerBase,FontAnalyzer,ResourceItem.TYPE_FONT);
            if(!egret.Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_SOUND))
                egret.Injector.mapClass(AnalyzerBase,SoundAnalyzer,ResourceItem.TYPE_SOUND);
            if(!egret.Injector.hasMapRule(AnalyzerBase,ResourceItem.TYPE_XML))
                egret.Injector.mapClass(AnalyzerBase,XMLAnalyzer,ResourceItem.TYPE_XML);
            this.resConfig = new ResourceConfig();
            this.resLoader = new ResourceLoader();
            this.resLoader.callBack = this.onResourceItemComp;
            this.resLoader.resInstance = this;
            this.resLoader.addEventListener(ResourceEvent.GROUP_COMPLETE,this.onGroupComp,this);
            this.resLoader.addEventListener(ResourceEvent.GROUP_LOAD_ERROR,this.onGroupError,this);
        }

        /**
         * 配置文件组组名
         */
        private static GROUP_CONFIG:string = "RES__CONFIG";

        private configItemList:Array<any> = [];

        private loadingConfigList:Array<any>;

        private callLaterFlag:boolean = false;
        /**
         * 配置文件加载解析完成标志
         */
        private configComplete:boolean = false;
        /**
         * 开始加载配置
		 * @method RES.loadConfig
		 * @param url {string}
		 * @param resourceRoot {string}
		 * @param type {string}
         */
        public loadConfig(url:string,resourceRoot:string,type:string="json"):void{

            var configItem:any = {url:url,resourceRoot:resourceRoot,type:type};
            this.configItemList.push(configItem);
            if(!this.callLaterFlag){
                egret.callLater(this.startLoadConfig,this);
                this.callLaterFlag = true;
            }
        }

        private startLoadConfig():void{
            this.callLaterFlag = false;
            var configList:Array<any> = this.configItemList;
            this.configItemList = [];
            this.loadingConfigList = configList;
            var length:number = configList.length;
            var itemList:Array<ResourceItem> = [];
            for(var i:number=0;i<length;i++){
                var item:any = configList[i];
                var resItem:ResourceItem = new ResourceItem(item.url,item.url,item.type);
                itemList.push(resItem);
            }
            this.resLoader.loadGroup(itemList,Resource.GROUP_CONFIG,Number.MAX_VALUE);
        }
        /**
         * 已经加载过组名列表
         */
        private loadedGroups:Array<string> = [];
        /**
         * 检查某个资源组是否已经加载完成
		 * @method RES.isGroupLoaded
		 * @param name {string}
		 * @returns {boolean}
         */
        public isGroupLoaded(name:string):boolean{
            return this.loadedGroups.indexOf(name)!=-1;
        }
        /**
         * 根据组名获取组加载项列表
		 * @method RES.getGroupByName
		 * @param name {string}
		 * @returns {Array<egret.ResourceItem>}
         */
        public getGroupByName(name:string):Array<ResourceItem>{
            return this.resConfig.getGroupByName(name);
        }

        private groupNameList:Array<any> = [];
        /**
         * 根据组名加载一组资源
		 * @method RES.loadGroup
		 * @param name {string}
		 * @param priority {number}
         */
        public loadGroup(name:string,priority:number=0):void{
            if(this.loadedGroups.indexOf(name)!=-1){
                ResourceEvent.dispatchResourceEvent(this,ResourceEvent.GROUP_COMPLETE,name);
                return;
            }
            if(this.resLoader.isGroupInLoading(name))
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
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        public createGroup(name:string,keys:Array<string>,override:boolean=false):boolean{
            if(override){
                var index:number = this.loadedGroups.indexOf(name);
                if(index!=-1){
                    this.loadedGroups.splice(index,1);
                }
            }
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
                var length:number = this.loadingConfigList.length;
                for(var i:number = 0;i < length;i++){
                    var config:any = this.loadingConfigList[i];
                    var resolver:AnalyzerBase = this.getAnalyzerByType(config.type);
                    var data:any = resolver.getRes(config.url);
                    resolver.destroyRes(config.url);
                    this.resConfig.parseConfig(data,config.resourceRoot);
                }
                this.configComplete = true;
                this.loadingConfigList = null;
                ResourceEvent.dispatchResourceEvent(this,ResourceEvent.CONFIG_COMPLETE);
                this.loadDelayGroups();
            }
            else{
                this.loadedGroups.push(event.groupName);
                this.dispatchEvent(event);
            }

        }
        /**
         * 启动延迟的组加载
         */
        private loadDelayGroups():void{
            var groupNameList:Array<any> = this.groupNameList;
            this.groupNameList = [];
            var length:number = groupNameList.length;
            for(var i:number=0;i<length;i++){
                var item:any = groupNameList[i];
                this.loadGroup(item.name,item.priority);
            }

        }
        /**
         * 队列加载失败事件
         */
        private onGroupError(event:ResourceEvent):void{
            if(event.groupName==Resource.GROUP_CONFIG){
                this.loadingConfigList = null;
                ResourceEvent.dispatchResourceEvent(this,ResourceEvent.CONFIG_LOAD_ERROR);
            }
            else{
                this.dispatchEvent(event);
            }
        }
        /**
         * 检查配置文件里是否含有指定的资源
		 * @method RES.hasRes
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
		 * @returns {boolean}
         */
        public hasRes(key:string):boolean{
            var type:string = this.resConfig.getType(key);
            if(type==""){
                var prefix:string = RES.AnalyzerBase.getStringPrefix(key);
                type = this.resConfig.getType(prefix);
                if(type==""){
                    return false;
                }
            }
            return true;
        }
        /**
         * 运行时动态解析一个配置文件,
         * @param data {any} 配置文件数据，请参考resource.json的配置文件格式。传入对应的json对象即可。
         * @param folder {string} 加载项的路径前缀。
         */
        public parseConfig(data:any, folder:string):void {
            this.resConfig.parseConfig(data,folder);
            if(!this.configComplete&&!this.loadingConfigList){
                this.configComplete = true;
                this.loadDelayGroups();
            }
        }
        /**
         * 通过key同步获取资源
		 * @method RES.getRes
		 * @param key {string}
		 * @returns {any}
         */
        public getRes(key:string):any{
            var type:string = this.resConfig.getType(key);
            if(type==""){
                var prefix:string = RES.AnalyzerBase.getStringPrefix(key);
                type = this.resConfig.getType(prefix);
                if(type==""){
                    return null;
                }
            }

            var analyzer:AnalyzerBase = this.getAnalyzerByType(type);
            return analyzer.getRes(key);
        }

        /**
         * 异步获取资源参数缓存字典
         */
        private asyncDic:any = {};
        /**
         * 通过key异步获取资源
         * @method RES.getResAsync
         * @param key {string}
         * @param compFunc {Function} 回调函数。示例：compFunc(data,url):void。
         * @param thisObject {any}
         */
        public getResAsync(key:string,compFunc:Function,thisObject:any):void{
            var type:string = this.resConfig.getType(key);
            var name:string = this.resConfig.getName(key);
            if(type==""){
                name = RES.AnalyzerBase.getStringPrefix(key);
                type = this.resConfig.getType(name);
                if(type==""){
                    compFunc.call(thisObject,null);
                    return;
                }
            }
            var analyzer:AnalyzerBase = this.getAnalyzerByType(type);
            var res:any = analyzer.getRes(key);
            if(res){
                compFunc.call(thisObject,res);
                return;
            }
            var args:any = {key:key,compFunc:compFunc,thisObject:thisObject};
            if(this.asyncDic[name]){
                this.asyncDic[name].push(args);
            }
            else{
                this.asyncDic[name] = [args];
                var resItem:ResourceItem = this.resConfig.getResourceItem(name);
                this.resLoader.loadItem(resItem);
            }
        }
        /**
         * 通过url获取资源
		 * @method RES.getResByUrl
		 * @param url {string} 
		 * @param compFunc {Function} 
		 * @param thisObject {any} 
		 * @param type {string} 
         */
        public getResByUrl(url:string,compFunc:Function,thisObject:any,type:string=""):void{
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
            var args:any = {key:name,compFunc:compFunc,thisObject:thisObject};
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
            if(suffix){
                suffix = suffix.toLowerCase();
            }
            var type:string;
            switch(suffix){
                case ResourceItem.TYPE_XML:
                case ResourceItem.TYPE_JSON:
                case ResourceItem.TYPE_SHEET:
                    type = suffix;
                    break;
                case "png":
                case "jpg":
                case "gif":
                case "jpeg":
                case "bmp":
                    type = ResourceItem.TYPE_IMAGE;
                    break;
                case "fnt":
                    type = ResourceItem.TYPE_FONT;
                    break;
                case "txt":
                    type = ResourceItem.TYPE_TEXT;
                    break;
                case "mp3":
                case "ogg":
                case "mpeg":
                case "wav":
                case "m4a":
                case "mp4":
                case "aiff":
                case "wma":
                case "mid":
                    type = ResourceItem.TYPE_SOUND;
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
                var res:any = analyzer.getRes(args.key);
                args.compFunc.call(args.thisObject,res,args.key);
            }
        }
        /**
         * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
		 * @method RES.destroyRes
         * @param name {string} 配置文件中加载项的name属性或资源组名
		 * @returns {boolean}
         */
        public destroyRes(name:string):boolean{
            var group:Array<any> = this.resConfig.getRawGroupByName(name);
            if(group){
                var index:number = this.loadedGroups.indexOf(name);
                if(index!=-1){
                    this.loadedGroups.splice(index,1);
                }
                var length:number = group.length;
                for(var i:number=0;i<length;i++){
                    var item:any = group[i];
                    item.loaded = false;
                    var analyzer:AnalyzerBase = this.getAnalyzerByType(item.type);
                    analyzer.destroyRes(item.name);
                    this.removeLoadedGroupsByItemName(item.name);
                }
                return true;
            }
            else{
                var type:string = this.resConfig.getType(name);
                if(type=="")
                    return false;
                item = this.resConfig.getRawResourceItem(name);
                item.loaded = false;
                analyzer = this.getAnalyzerByType(type);
                var result = analyzer.destroyRes(name);
                this.removeLoadedGroupsByItemName(item.name);
                return result;
            }
        }
        private removeLoadedGroupsByItemName(name:string):void {
            var loadedGroups:Array<string> = this.loadedGroups;
            var loadedGroupLength:number = loadedGroups.length;
            for(var i:number = 0 ; i < loadedGroupLength ; i++) {
                var group:Array<any> = this.resConfig.getRawGroupByName(loadedGroups[i]);
                var length:number = group.length;
                for(var j:number = 0 ; j < length ; j++) {
                    var item:any = group[j];
                    if(item.name == name) {
                        loadedGroups.splice(i, 1);
                        i--;
                        loadedGroupLength = loadedGroups.length;
                        break;
                    }
                }
            }
        }
        /**
         * 设置最大并发加载线程数量，默认值是2.
         * @method RES.setMaxLoadingThread
         * @param thread {number} 要设置的并发加载数。
         */
        public setMaxLoadingThread(thread:number):void{
            if(thread<1){
                thread = 1;
            }
            this.resLoader.thread = thread;
        }

        /**
         * 设置资源加载失败时的重试次数。
         * @param retry 要设置的重试次数。
         */
        public setMaxRetryTimes(retry:number):void{
            retry = Math.max(retry, 0);
            this.resLoader.maxRetryTimes = retry;
        }
    }
    /**
     * Resource单例
     */
    var instance:Resource = new Resource();
}