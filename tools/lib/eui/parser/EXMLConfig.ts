/**
 * Created by yanjiaqi on 15/10/21.
 */
import file = require("../../FileUtil");
import xml = require("../../xml/index");
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
    static instance :EXMLConfig = null;
    /**
     * 组件清单列表
     */
    public componentDic:any = {};

    public idMap:any = {};

    constructor() {
        var exmlPath:string = egret.root + "/tools/lib/eui/";
        exmlPath = exmlPath.split("\\").join("/");
        var str:string = file.read(exmlPath + "manifest.xml");
        var manifest:any = xml.parse(str);
        this.parseManifest(manifest);

        str = file.read(exmlPath + "properties.json");
        properties = JSON.parse(str);
        //this.findStyles(properties);
    }

    static getInstance():EXMLConfig{
        if(EXMLConfig.instance == null){
            EXMLConfig.instance = new EXMLConfig();
        }
        return EXMLConfig.instance;
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
            //if (!this.classNameToPath[name]) {
            //    name = "";
            //}
        }
        return name;
    }
//end by yanjiaqi
}