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

	export class BinAnalyzer extends AnalyzerBase{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		
		/**
		 * 字节流数据缓存字典
		 */		
		public fileDic:any = {};
		/**
		 * 加载项字典
		 */		
		public resItemDic:Array<any> = [];
		/**
		 * @inheritDoc
		 */
		public loadFile(resItem:ResourceItem,compFunc:Function,thisObject:any):void{
			if(this.fileDic[resItem.name]){
				compFunc.call(thisObject,resItem);
				return;
			}
			var loader:egret.URLLoader = this.getLoader();
			this.resItemDic[loader.hashCode] = {item:resItem,func:compFunc,thisObject:thisObject};
			loader.load(new egret.URLRequest(resItem.url));
		}

        public _dataFormat:string = egret.URLLoaderDataFormat.BINARY;
		/**
		 * URLLoader对象池
		 */		
		public recycler:egret.Recycler = new egret.Recycler();
		/**
		 * 获取一个URLLoader对象
		 */		
		private getLoader():egret.URLLoader{
			var loader:egret.URLLoader = this.recycler.pop();
			if(!loader){
				loader = new egret.URLLoader();
				loader.addEventListener(egret.Event.COMPLETE,this.onLoadFinish,this);
				loader.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onLoadFinish,this);
			}
            loader.dataFormat = this._dataFormat;
			return loader;
		}
		/**
		 * 一项加载结束
		 */		
		public onLoadFinish(event:egret.Event):void{
			var loader:egret.URLLoader = <egret.URLLoader> (event.target);
			var data:any = this.resItemDic[loader.hashCode];
			delete this.resItemDic[loader.hashCode];
			var resItem:ResourceItem = data.item;
			var compFunc:Function = data.func;
			resItem.loaded = (event.type==egret.Event.COMPLETE);
			if(resItem.loaded){
                this.analyzeData(resItem,loader.data)
			}
			this.recycler.push(loader);
			compFunc.call(data.thisObject,resItem);
		}
        /**
         * 解析并缓存加载成功的数据
         */
        public analyzeData(resItem:ResourceItem,data:any):void{
            var name:string = resItem.name;
            if(this.fileDic[name]||!data){
                return;
            }
            this.fileDic[name] = data;
        }
		/**
		 * @inheritDoc
		 */
		public getRes(name:string):any{
			return this.fileDic[name];
		}
		/**
		 * @inheritDoc
		 */
		public hasRes(name:string):boolean{
            var res:any = this.getRes(name);
			return res!=null;
		}
		/**
		 * @inheritDoc
		 */
		public destroyRes(name:string):boolean{
			if(this.fileDic[name]){
				delete this.fileDic[name];
				return true;
			}
			return false;
		}
	}
}