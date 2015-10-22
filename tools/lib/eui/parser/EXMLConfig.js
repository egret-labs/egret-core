/**
 * Created by yanjiaqi on 15/10/21.
 */
var file = require("../../FileUtil");
var xml = require("../../xml/index");
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
        var manifest = xml.parse(str);
        this.parseManifest(manifest);
        str = file.read(exmlPath + "properties.json");
        properties = JSON.parse(str);
        //this.findStyles(properties);
    }
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
        }
        return name;
    };
    //added by yanjiaqi 2015.10.21
    EXMLConfig.__instance = null;
    return EXMLConfig;
})();
exports.EXMLConfig = EXMLConfig;

//# sourceMappingURL=../../../lib/eui/parser/EXMLConfig.js.map