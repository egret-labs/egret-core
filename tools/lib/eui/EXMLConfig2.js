Object.defineProperty(exports, "__esModule", { value: true });
var file = require("../FileUtil");
var path = require("path");
var XMLTool = require("../xml/index");
var componentScanner = require("../exml/exml-service/componentScanner");
/**
 * @private
 * EUI 命名空间
 */
exports.NS_S = "http://ns.egret.com/eui";
/**
 * @private
 * Wing命名空间
 */
exports.NS_W = "http://ns.egret.com/wing";
var coreClasses = ["Point", "Matrix", "Rectangle"];
var basicTypes = ["Object", "Array", "boolean", "string", "number"];
var MODULE_NAME = "eui.";
var hashCount = 0;
var stylesMap = {};
/**
 * @private
 */
var EXMLConfig = (function () {
    function EXMLConfig() {
        /**
         * 组件清单列表
         */
        //public componentDic:any = {};
        this.config = {};
        this.idMap = {};
        var configStr = file.read(path.join(egret.root, "tools", "lib", "eui", "default.json"));
        configStr = configStr.replace(/^\uFEFF/, '');
        var configObj = JSON.parse(configStr);
        this.parseConfig(configObj);
    }
    Object.defineProperty(EXMLConfig.prototype, "dirPath", {
        get: function () {
            return this._dirPath;
        },
        set: function (value) {
            if (this._dirPath !== value) {
                this._dirPath = value;
                this.classNameToExmlFilePath = this.getClassToPathInfo(this.dirPath);
            }
            //this.parseModules();
        },
        enumerable: true,
        configurable: true
    });
    EXMLConfig.prototype.getClassToPathInfo = function (dirPath) {
        var _this = this;
        var exmls = file.search(dirPath, 'exml');
        exmls.forEach(function (exml) {
            var str = file.read(exml);
            var xml = XMLTool.parse(str);
            var className = null;
            if (xml["$class"]) {
                className = xml["$class"];
            }
            else {
                className = _this.getClassNameById(xml.localName, xml.namespace);
            }
            exmls[className] = exml;
        });
        return exmls;
    };
    EXMLConfig.getInstance = function () {
        if (EXMLConfig.__instance == null) {
            EXMLConfig.__instance = new EXMLConfig();
        }
        return EXMLConfig.__instance;
    };
    EXMLConfig.prototype.parseConfig = function (config) {
        this.config = config;
        componentScanner.run(config);
        for (var className in this.config) {
            var component = this.config[className];
            var dotIndex = className.lastIndexOf(".");
            //解析id
            if (dotIndex !== -1) {
                var id = className.substring(dotIndex + 1);
                // console.log(className,"[id]:"+id);
                this.idMap[id] = className;
            }
            //查找并设置默认属性
            if (!component.default) {
                this._findProp(component);
            }
        }
    };
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
    EXMLConfig.prototype._findProp = function (component) {
        if (component.default) {
            return component.default;
        }
        var superComponent = this.config[component.super];
        if (superComponent) {
            var prop = this._findProp(superComponent);
            if (prop) {
                component.default = prop;
            }
        }
        return component.default;
    };
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
    EXMLConfig.prototype.getClassNameById = function (id, ns) {
        var name = "";
        //基本类型直接返回
        if (basicTypes.indexOf(id) != -1) {
            return id;
        }
        //忽略wing的命名空间
        if (ns == exports.NS_W) {
        }
        else if (!ns || ns == exports.NS_S) {
            name = this.idMap[id];
        }
        else {
            name = ns.substring(0, ns.length - 1) + id;
            // if (!this.classNameToExmlFilePath[name]) {
            //     name = "";
            // }
        }
        return name;
    };
    /**
     * @private
     * 根据ID获取对应的默认属性
     * @param id 类的短名ID
     * @param ns 命名空间
     * @return 默认属性名
     */
    EXMLConfig.prototype.getDefaultPropById = function (id, ns) {
        var className = this.getClassNameById(id, ns);
        var component = this.config[className];
        if (!component && className) {
            component = this.findDefaultPropComponent(className);
        }
        if (!component)
            return "";
        return component.default;
    };
    EXMLConfig.prototype.findDefaultPropComponent = function (className) {
        //去config配置文件中找
        var classData = this.config[className];
        if (!classData) {
            var path_1 = this.classNameToExmlFilePath[className];
            //let ext:string = file.getExtension(path).toLowerCase();
            var text = file.read(path_1);
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
        var superClass = classData["super"];
        var component = this.config[superClass];
        if (!component) {
            component = this.findDefaultPropComponent(superClass);
        }
        return component;
    };
    /**
     * 读取一个exml文件引用的类列表
     */
    EXMLConfig.prototype.getPropertiesFromExml = function (text) {
        var exml = XMLTool.parse(text);
        if (!exml) {
            return null;
        }
        var superClass = this.getClassNameById(exml.localName, exml.namespace);
        if (superClass) {
            var data = {};
            data["super"] = superClass;
            return data;
        }
        return null;
    };
    /**
     * @private
     * 获取指定属性的类型,返回基本数据类型："boolean","string","number","any"。
     * @param property 属性名
     * @param className 要查询的完整类名
     */
    EXMLConfig.prototype.getPropertyType = function (prop, className) {
        if (className == "Object") {
            return "any";
        }
        var type = this._findType(className, prop);
        //if(!type){
        //    if(this.checkStyleProperty(prop,className)){
        //        return stylesMap[prop];
        //    }
        //}
        return type;
    };
    EXMLConfig.prototype._findType = function (className, prop) {
        var classData = this.config[className];
        if (!classData) {
            var path_2 = this.classNameToExmlFilePath[className];
            var text = file.read(path_2);
            classData = this.getPropertiesFromExml(text);
            if (classData) {
                this.config[className] = classData;
            }
            else {
                return "";
            }
        }
        var type = classData[prop];
        if (!type) {
            type = this._findType(classData["super"], prop);
        }
        return type;
    };
    EXMLConfig.__instance = null;
    return EXMLConfig;
}());
exports.EXMLConfig = EXMLConfig;
