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

/// <reference path="../../../../egret/utils/Dictionary.ts"/>
/// <reference path="../../../../extension/gui/core/DXML.ts"/>
/// <reference path="../../../../../org/flexlite/domUtils/InvalidteEventDispatcher.ts"/>

module ns_egret {

	export class DXMLConfig implements IDXMLConfig{
		/**
		 * 构造函数
		 */		
		public constructor(manifest:XML=null){
			super();
			if(manifest){
				this.parseManifest(manifest);
			}
		}
		
		/**
		 * 组件清单列表
		 */		
		public componentDic:any = {};
		/**
		 * 框架组件ID到完整类名映射列表
		 */		
		public idDic:any = {};
		/**
		 * 解析框架清单文件
		 */		
		public parseManifest(manifest:XML):void{
			for each(var item:XML in manifest.component){
				var component:Component = new Component(item);
				this.componentDic[component.className] = component;
				this.idDic[component.id] = component.className;
			}
			for each(component in this.componentDic){
				if(!component.defaultProp)
					this.findProp(component);
			}
		}
		/**
		 * 递归查找默认属性
		 */		
		private findProp(component:Component):string{
			if(component.defaultProp)
				return component.defaultProp;
			var superComp:Component = this.componentDic[component.superClass];
			if(superComp){
				var prop:string = this.findProp(superComp);
				if(prop){
					component.defaultProp = prop;
					component.isArray = superComp.isArray;
					if(!component.states&&superComp.states)
						component.states = superComp.states;
				}
			}
			return component.defaultProp;
		}
		
		/**
		 * @inheritDoc
		 */
		public addComponent(className:string,superClass:string):Component{
			if(!className)
				return null;
			if(superClass==null)
				superClass = "";
			className = className.split("::").join(".");
			superClass = superClass.split("::").join(".");
			var id:string = className;
			var index:number = className.lastIndexOf(".");
			if(index!=-1){
				id = className.substring(index+1);
			}
			var component:Component = new Component();
			component.id = id;
			component.className = className;
			component.superClass = superClass;
			this.componentDic[className] = component;
			return component;
		}
		
		/**
		 * @inheritDoc
		 */
		public removeComponent(className:string):Component{
			var component:Component = this.componentDic[className]
			delete this.componentDic[className];
			return component;
		}
		
		/**
		 * @inheritDoc
		 */		
		public hasComponent(className:string):boolean{
			return this.componentDic[className];
		}
		
		/**
		 * @inheritDoc
		 */		
		public checkComponent(className:string):void{
			
		}
		
		/**
		 * @inheritDoc
		 */
		public getClassNameById(id:string, ns:Namespace):string{
			var name:string = "";
			if(ns==this.DXML.FS){
				
			}
			else if(!ns||this.isDefaultNs(ns)){
				name = this.idDic[id];
			}
			else{
				name = ns.uri;
				name = name.substring(0,name.length-1)+id;
			}
			return name;
		}
		
		/**
		 * 使用框架配置文件的默认命名空间 
		 */		
		private DEFAULT_NS:Array<any> = 
			[DXML.NS,
				new Namespace("s","library://ns.adobe.com/flex/spark"),
				new Namespace("mx","library://ns.adobe.com/flex/mx"),
				new Namespace("fx","http://ns.adobe.com/mxml/2009")];
		
		/**
		 * 指定的命名空间是否是默认命名空间
		 */		
		private isDefaultNs(ns:Namespace):boolean{
			for each(var dns:Namespace in this.DEFAULT_NS){
				if(ns==dns)
					return true;
			}
			return false;
		}
		
		/**
		 * @inheritDoc
		 */
		public getDefaultPropById(id:string, ns:Namespace):any{
			var data:any = {name:"",isArray:false};
			var className:string = this.getClassNameById(id,ns);
			var component:Component = this.componentDic[className];
			while(component){
				if(component.defaultProp)
					break;
				className = component.superClass;
				component = this.componentDic[className];
			}
			if(!component)
				return data;
			data.name = component.defaultProp;
			data.isArray = component.isArray;
			return data;
		}
		
		/**
		 * @inheritDoc
		 */
		public getPropertyType(prop:string,className:string,value:string):string{
			var type:string = "";
			if(prop=="toolTipClass"||prop=="itemRenderer")
				type = "Class";
			else if(prop=="percentHeight"||prop=="percentWidth")
				type = "Number";
			else if(prop=="skinName"||prop=="itemRendererSkinName"){
				if(value.indexOf(".")!=-1){
					type = "Class";
				}
				else{
					type = "String";
				}
			}
			else if(this.isStringKey(prop))
				type = "String";
			else if(value.indexOf("#")==0&&!isNaN(<number><any> ("0x"+value.substring(1))))
				type = "uint";
			else if(!isNaN(<number><any> value))
				type = "Number";
			else if(value=="true"||value=="false")
				type = "Boolean";
			else
				type = "String";
			return type;
		}
		
		/**
		 * 类型为字符串的属性名列表
		 */		
		private stringKeyList:Array<any> = ["text","label"];
		/**
		 * 判断一个属性是否是字符串类型。
		 */		
		private isStringKey(key:string):boolean{
			for each(var str:string in this.stringKeyList){
				if(str==key)
					return true;
			}
			return false;
		}
	}
}
