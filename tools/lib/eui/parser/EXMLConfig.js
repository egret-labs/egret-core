/**
 * Created by yanjiaqi on 15/10/21.
 */
var file = require("../../FileUtil");
var XMLTool = require("../../xml/index");
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
var properties = {};
//added by yanjiaqi 2015.10.21
var properties = {};
var stylesMap = {};
var Component = (function () {
    /**
     * 构造函数
     */
    function Component(item) {
        /**
         * 父级类名
         */
        this.superClass = "";
        /**
         * 默认属性
         */
        this.defaultProp = "";
        if (item) {
            this.id = item.$id;
            this.className = item["$module"] + "." + this.id;
            if (item["$super"])
                this.superClass = item.$super;
            if (item["$default"])
                this.defaultProp = item.$default;
        }
    }
    return Component;
})();
//end by yanjiaqi
/**
 * @private
 */
var EXMLConfig = (function () {
    function EXMLConfig() {
        /**
         * 组件清单列表
         */
        this.componentDic = {};
        this.idMap = {};
        var exmlPath = egret.root + "/tools/lib/eui/";
        exmlPath = exmlPath.split("\\").join("/");
        var str = file.read(exmlPath + "manifest.xml");
        var manifest = XMLTool.parse(str);
        this.parseManifest(manifest);
        str = file.read(exmlPath + "properties.json");
        properties = JSON.parse(str);
        //this.findStyles(properties);
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
    /**
     * 解析框架清单文件
     */
    EXMLConfig.prototype.parseManifest = function (manifest) {
        var children = manifest.children;
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var item = children[i];
            var component = new Component(item);
            this.componentDic[component.className] = component;
            this.idMap[component.id] = component.className;
        }
        for (var className in this.componentDic) {
            var component = this.componentDic[className];
            if (!component.defaultProp)
                this.findProp(component);
        }
    };
    /**
     * 递归查找默认属性
     */
    EXMLConfig.prototype.findProp = function (component) {
        if (component.defaultProp)
            return component.defaultProp;
        var superComp = this.componentDic[component.superClass];
        if (superComp) {
            var prop = this.findProp(superComp);
            if (prop) {
                component.defaultProp = prop;
            }
        }
        return component.defaultProp;
    };
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
            if (!this.classNameToExmlFilePath[name]) {
                name = "";
            }
        }
        return name;
    };
    //end by yanjiaqi
    /**
     * @private
     * 根据ID获取对应的默认属性
     * @param id 类的短名ID
     * @param ns 命名空间
     * @return 默认属性名
     */
    //added by yanjiaqi
    EXMLConfig.prototype.getDefaultPropById = function (id, ns) {
        var className = this.getClassNameById(id, ns);
        var component = this.componentDic[className];
        if (!component && className) {
            component = this.findDefaultProp(className);
        }
        if (!component)
            return "";
        return component.defaultProp;
    };
    EXMLConfig.prototype.findDefaultProp = function (className) {
        //去properties配置文件中找
        var classData = properties[className];
        if (!classData) {
            var path = this.classNameToExmlFilePath[className];
            //var ext:string = file.getExtension(path).toLowerCase();
            var text = file.read(path);
            //if(ext=="ts"){
            //    classData = this.getPropertiesFromTs(text,className,"");
            //}
            //else if(ext=="exml"){
            classData = this.getPropertiesFromExml(text);
            //}
            if (classData) {
                properties[className] = classData;
            }
            else {
                return null;
            }
        }
        //向上递归寻找父类的默认属性
        var superClass = classData["super"];
        var component = this.componentDic[superClass];
        if (!component) {
            component = this.findDefaultProp(superClass);
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
        var type = this.findType(className, prop);
        //if(!type){
        //    if(this.checkStyleProperty(prop,className)){
        //        return stylesMap[prop];
        //    }
        //}
        return type;
    };
    EXMLConfig.prototype.findType = function (className, prop) {
        var classData = properties[className];
        if (!classData) {
            var path = this.classNameToExmlFilePath[className];
            //var ext:string = file.getExtension(path).toLowerCase();
            var text = file.read(path);
            //if(ext=="ts"){
            //    text = CodeUtil.removeComment(text,path);
            //    classData = this.getPropertiesFromTs(text,className,"");
            //}
            //else if(ext=="exml"){
            classData = this.getPropertiesFromExml(text);
            //}
            if (classData) {
                properties[className] = classData;
            }
            else {
                return "";
            }
        }
        var type = classData[prop];
        if (!type) {
            type = this.findType(classData["super"], prop);
        }
        return type;
    };
    //added by yanjiaqi 2015.10.21
    EXMLConfig.__instance = null;
    return EXMLConfig;
})();
exports.EXMLConfig = EXMLConfig;

//# sourceMappingURL=../../../lib/eui/parser/EXMLConfig.js.map