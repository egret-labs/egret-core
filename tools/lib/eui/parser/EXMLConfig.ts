/**
 * Created by yanjiaqi on 15/10/21.
 */
import file = require("../../FileUtil");
import XMLTool = require("../../xml/index");
/**
 * @private
 * EUI 命名空间
 */
export var NS_S:string = "http://ns.egret.com/eui";
/**
 * @private
 * Wing命名空间
 */
export var NS_W:string = "http://ns.egret.com/wing";
var coreClasses:string[] = ["Point","Matrix","Rectangle"];
var basicTypes:string[] = ["Object", "Array", "boolean", "string", "number"];

var MODULE_NAME = "eui.";

var hashCount = 0;

var properties: any = {};

//added by yanjiaqi 2015.10.21
var properties = {};
var stylesMap = {};

class Component{
    /**
     * 构造函数
     */
    public constructor(item?:any){
        if(item){
            this.id = item.$id;
            this.className = item["$module"] +"."+ this.id;
            if(item["$super"])
                this.superClass = item.$super;
            if(item["$default"])
                this.defaultProp = item.$default;
        }
    }
    /**
     * 短名ID
     */
    public id:string;
    /**
     * 完整类名
     */
    public className:string;
    /**
     * 父级类名
     */
    public superClass:string = "";
    /**
     * 默认属性
     */
    public defaultProp:string = "";
}
//end by yanjiaqi

/**
 * @private
 */
export class EXMLConfig {

    //added by yanjiaqi 2015.10.21
    static __instance :EXMLConfig = null;
    /**
     * 组件清单列表
     */
    public componentDic:any = {};

    public idMap:any = {};

    /**
     * 项目目录路径
     */
    private _dirPath:string;

    public get dirPath():string{
        return this._dirPath;
    }

    public set dirPath(value:string){
        if(this._dirPath !== value){
            this._dirPath = value;
            this.classNameToExmlFilePath = this.getClassToPathInfo(this.dirPath);
        }
        //this.parseModules();
    }

    private getClassToPathInfo(dirPath:string):any{
        var exmls:string[] = file.search(dirPath, 'exml');
        exmls.forEach(exml=>{
            var str:string = file.read(exml);
            var xml:egret.XML = XMLTool.parse(str);
            var className:string = null;
            if(xml["$class"]){
                className = xml["$class"];
            }else{
                className = this.getClassNameById(xml.localName,xml.namespace);
            }
            exmls[className] = exml;
        });
        return exmls;
    }

    /**
     * 目录下所有exml文件的地址与类全名的映射
     */
    classNameToExmlFilePath:any;
    constructor() {
        var exmlPath:string = egret.root + "/tools/lib/eui/";
        exmlPath = exmlPath.split("\\").join("/");
        var str:string = file.read(exmlPath + "manifest.xml");
        var manifest:any = XMLTool.parse(str);
        this.parseManifest(manifest);

        str = file.read(exmlPath + "properties.json");
        properties = JSON.parse(str);
        //this.findStyles(properties);
    }

    static getInstance():EXMLConfig{
        if(EXMLConfig.__instance == null){
            EXMLConfig.__instance = new EXMLConfig();
        }
        return EXMLConfig.__instance;
    }
    /**
     * 解析框架清单文件
     */
    public parseManifest(manifest:any):void {

        var children:Array<any> = manifest.children;
        var length:number = children.length;
        for (var i:number = 0; i < length; i++) {
            var item:any = children[i];
            var component:Component = new Component(item);
            this.componentDic[component.className] = component;
            this.idMap[component.id] = component.className;
        }
        for (var className in this.componentDic) {
            var component:Component = this.componentDic[className];

            if (!component.defaultProp)
                this.findProp(component);
        }
    }

    /**
     * 递归查找默认属性
     */
    private findProp(component:Component):string {
        if (component.defaultProp)
            return component.defaultProp;
        var superComp:Component = this.componentDic[component.superClass];
        if (superComp) {
            var prop:string = this.findProp(superComp);
            if (prop) {
                component.defaultProp = prop;
            }
        }
        return component.defaultProp;
    }

    public getClassNameById(id:string, ns:string):string {
        var name:string = "";
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
            if (!this.classNameToExmlFilePath[name]) {
                name = "";
            }
        }
        return name;
    }
//end by yanjiaqi

    /**
     * @private
     * 根据ID获取对应的默认属性
     * @param id 类的短名ID
     * @param ns 命名空间
     * @return 默认属性名
     */
    //added by yanjiaqi
    public getDefaultPropById(id:string, ns:string):string{
        var className:string = this.getClassNameById(id,ns);
        var component:Component = this.componentDic[className];
        if(!component&&className){
            component = this.findDefaultProp(className);
        }
        if(!component)
            return "";
        return component.defaultProp;
    }

    private findDefaultProp(className:string):Component{
        //去properties配置文件中找
        var classData:any = properties[className];
        if(!classData){
            var path:string = this.classNameToExmlFilePath[className];
            //var ext:string = file.getExtension(path).toLowerCase();
            var text:string = file.read(path);
            //if(ext=="ts"){
            //    classData = this.getPropertiesFromTs(text,className,"");
            //}
            //else if(ext=="exml"){
            classData = this.getPropertiesFromExml(text);
            //}

            if(classData){
                properties[className] = classData;
            }
            else{
                return null;
            }
        }
        //向上递归寻找父类的默认属性
        var superClass:string = classData["super"];
        var component:Component = this.componentDic[superClass];
        if(!component){
            component = this.findDefaultProp(superClass);
        }
        return component;
    }
    /**
     * 读取一个exml文件引用的类列表
     */
    private getPropertiesFromExml(text:string):any{
        var exml:any = XMLTool.parse(text);
        if(!exml){
            return null;
        }
        var superClass:string = this.getClassNameById(exml.localName,exml.namespace);
        if(superClass){
            var data:any = {};
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
    public getPropertyType(prop:string,className:string):string{
        if(className=="Object"){
            return "any";
        }
        var type:string = this.findType(className,prop);
        //if(!type){
        //    if(this.checkStyleProperty(prop,className)){
        //        return stylesMap[prop];
        //    }
        //}
        return type;
    }

    private findType(className:string,prop:string):string{
        var classData:any = properties[className];
        if(!classData){
            var path:string = this.classNameToExmlFilePath[className];
            //var ext:string = file.getExtension(path).toLowerCase();
            var text:string = file.read(path);
            //if(ext=="ts"){
            //    text = CodeUtil.removeComment(text,path);
            //    classData = this.getPropertiesFromTs(text,className,"");
            //}
            //else if(ext=="exml"){
            classData = this.getPropertiesFromExml(text);
            //}
            if(classData){
                properties[className] = classData;
            }
            else{
                return "";
            }
        }
        var type:string = classData[prop];
        if(!type){
            type = this.findType(classData["super"],prop);
        }
        return type;
    }
}