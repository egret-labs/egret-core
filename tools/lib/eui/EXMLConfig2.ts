import file = require("../FileUtil");
import path = require("path");
import XMLTool = require("../xml/index");
import egretbridge = require("./egretbridge");
import componentScanner = require("../exml/exml-service/componentScanner");
/**
 * @private
 * EUI 命名空间
 */
export let NS_S: string = "http://ns.egret.com/eui";
/**
 * @private
 * Wing命名空间
 */
export let NS_W: string = "http://ns.egret.com/wing";
let coreClasses: string[] = ["Point", "Matrix", "Rectangle"];
let basicTypes: string[] = ["Object", "Array", "boolean", "string", "number"];

let MODULE_NAME = "eui.";

let hashCount = 0;

let stylesMap = {};

/**
 * @private
 */
export class EXMLConfig {

    static __instance: EXMLConfig = null;
    /**
     * 组件清单列表
     */
    //public componentDic:any = {};

    public config: any = {};
    public idMap: any = {};

    /**
     * 项目目录路径
     */
    private _dirPath: string;

    constructor() {
        let configStr: string = file.read(path.join(egret.root, "tools", "lib", "eui", "default.json"));
        configStr = configStr.replace(/^\uFEFF/, '');
        let configObj = JSON.parse(configStr);
        this.parseConfig(configObj);
    }

    public get dirPath(): string {
        return this._dirPath;
    }

    public set dirPath(value: string) {
        if (this._dirPath !== value) {
            this._dirPath = value;
            this.classNameToExmlFilePath = this.getClassToPathInfo(this.dirPath);
        }
        //this.parseModules();
    }

    private getClassToPathInfo(dirPath: string): any {
        let exmls: string[] = file.search(dirPath, 'exml');
        exmls.forEach(exml => {
            let str: string = file.read(exml);
            let xml = XMLTool.parse(str);
            let className: string = null;
            if (xml["$class"]) {
                className = xml["$class"];
            } else {
                className = this.getClassNameById(xml.localName, xml.namespace);
            }
            exmls[className] = exml;
        });
        return exmls;
    }

    /**
     * 目录下所有exml文件的地址与类全名的映射
     */
    classNameToExmlFilePath: any;

    static getInstance(): EXMLConfig {
        if (EXMLConfig.__instance == null) {
            EXMLConfig.__instance = new EXMLConfig();
        }
        return EXMLConfig.__instance;
    }

    public parseConfig(config: any): void {
        this.config = config;
        componentScanner.run(config);
        for (let className in this.config) {
            let component = this.config[className];
            let dotIndex = className.lastIndexOf(".");
            //解析id
            if (dotIndex !== -1) {
                let id = className.substring(dotIndex + 1);
                // console.log(className,"[id]:"+id);
                this.idMap[id] = className;
            }
            //查找并设置默认属性
            if (!component.default) {
                this._findProp(component);
            }
        }
    }

    /**
     * 解析框架清单文件
     */
    //public parseManifest(manifest:any):void {
    //    let children:Array<any> = manifest.children;
    //    let length:number = children.length;
    //    for (let i:number = 0; i < length; i++) {
    //        let item:any = children[i];
    //        let component:Component = new Component(item);
    //        this.componentDic[component.className] = component;
    //        this.idMap[component.id] = component.className;
    //    }
    //    for (let className in this.componentDic) {
    //        let component:Component = this.componentDic[className];
    //
    //        if (!component.defaultProp)
    //            this.findProp(component);
    //    }
    //}
    /**
     * 递归查找默认属性
     */
    private _findProp(component: any): string {
        if (component.default) {
            return component.default;
        }
        let superComponent = this.config[component.super];
        if (superComponent) {
            let prop: string = this._findProp(superComponent);
            if (prop) {
                component.default = prop;
            }
        }
        return component.default;
    }

    /**
     * 递归查找默认属性
     */
    //private findProp(component:Component):string {
    //    if (component.defaultProp)
    //        return component.defaultProp;
    //    let superComp:Component = this.componentDic[component.superClass];
    //    if (superComp) {
    //        let prop:string = this.findProp(superComp);
    //        if (prop) {
    //            component.defaultProp = prop;
    //        }
    //    }
    //    return component.defaultProp;
    //}

    public getClassNameById(id: string, ns: string): string {
        let name: string = "";
        //基本类型直接返回
        if (basicTypes.indexOf(id) != -1) {
            return id;
        }
        //忽略wing的命名空间
        if (ns == NS_W) {
        }
        //省略命名空间和命名空间是eui的去表中查
        else if (!ns || ns == NS_S) {
            name = this.idMap[id];
        }
        //自定义命名空间形如mrj.*要去掉＊
        else {
            name = ns.substring(0, ns.length - 1) + id;
            // if (!this.classNameToExmlFilePath[name]) {
            //     name = "";
            // }
        }
        return name;
    }

    /**
     * @private
     * 根据ID获取对应的默认属性
     * @param id 类的短名ID
     * @param ns 命名空间
     * @return 默认属性名
     */
    public getDefaultPropById(id: string, ns: string): string {
        let className: string = this.getClassNameById(id, ns);
        let component: any = this.config[className];
        if (!component && className) {
            component = this.findDefaultPropComponent(className);
        }
        if (!component)
            return "";
        return component.default;
    }

    private findDefaultPropComponent(className: string): any {
        //去config配置文件中找
        let classData: any = this.config[className];
        if (!classData) {
            let path: string = this.classNameToExmlFilePath[className];
            //let ext:string = file.getExtension(path).toLowerCase();
            let text: string = file.read(path);
            //if(ext=="ts"){
            //    classData = this.getPropertiesFromTs(text,className,"");
            //}
            //else if(ext=="exml"){
            classData = this.getPropertiesFromExml(text);
            //}

            if (classData) {
                this.config[className] = classData;
            }
            else {
                return null;
            }
        }
        //向上递归寻找父类的默认属性
        let superClass: string = classData["super"];
        let component: any = this.config[superClass];
        if (!component) {
            component = this.findDefaultPropComponent(superClass);
        }
        return component;
    }
    /**
     * 读取一个exml文件引用的类列表
     */
    private getPropertiesFromExml(text: string): any {
        let exml: any = XMLTool.parse(text);
        if (!exml) {
            return null;
        }
        let superClass: string = this.getClassNameById(exml.localName, exml.namespace);
        if (superClass) {
            let data: any = {};
            data["super"] = superClass;
            return data;
        }
        return null;
    }
    /**
     * @private
     * 获取指定属性的类型,返回基本数据类型："boolean","string","number","any"。
     * @param property 属性名
     * @param className 要查询的完整类名
     */
    public getPropertyType(prop: string, className: string): string {
        if (className == "Object") {
            return "any";
        }
        let type: string = this._findType(className, prop);
        //if(!type){
        //    if(this.checkStyleProperty(prop,className)){
        //        return stylesMap[prop];
        //    }
        //}
        return type;
    }

    private _findType(className: string, prop: string): string {
        let classData: any = this.config[className];
        if (!classData) {
            let path: string = this.classNameToExmlFilePath[className];
            let text: string = file.read(path);
            classData = this.getPropertiesFromExml(text);
            if (classData) {
                this.config[className] = classData;
            } else {
                return "";
            }
        }
        let type: string = classData[prop];
        if (!type) {
            type = this._findType(classData["super"], prop);
        }
        return type;
    }

    //private findType(className:string,prop:string):string{
    //    let classData:any = properties[className];
    //    if(!classData){
    //        let path:string = this.classNameToExmlFilePath[className];
    //        //let ext:string = file.getExtension(path).toLowerCase();
    //        let text:string = file.read(path);
    //        //if(ext=="ts"){
    //        //    text = CodeUtil.removeComment(text,path);
    //        //    classData = this.getPropertiesFromTs(text,className,"");
    //        //}
    //        //else if(ext=="exml"){
    //        classData = this.getPropertiesFromExml(text);
    //        //}
    //        if(classData){
    //            properties[className] = classData;
    //        }
    //        else{
    //            return "";
    //        }
    //    }
    //    let type:string = classData[prop];
    //    if(!type){
    //        type = this.findType(classData["super"],prop);
    //    }
    //    return type;
    //}
}