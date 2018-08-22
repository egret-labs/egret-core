var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) {
    function r() {
        this.constructor = t;
    }
    for (var i in e)
        e.hasOwnProperty(i) && (t[i] = e[i]);
    r.prototype = e.prototype, t.prototype = new r();
};
var JSONParseClass = /** @class */ (function () {
    function JSONParseClass() {
        this.skinClass = {};
        this.euiNormalizeNames = {
            "$eBL": "eui.BitmapLabel",
            "$eB": "eui.Button",
            "$eCB": "eui.CheckBox",
            "$eC": "eui.Component",
            "$eDG": "eui.DataGroup",
            "$eET": "eui.EditableText",
            "$eG": "eui.Group",
            "$eHL": "eui.HorizontalLayout",
            "$eHSB": "eui.HScrollBar",
            "$eHS": "eui.HSlider",
            "$eI": "eui.Image",
            "$eL": "eui.Label",
            "$eLs": "eui.List",
            "$eP": "eui.Panel",
            "$ePB": "eui.ProgressBar",
            "$eRB": "eui.RadioButton",
            "$eRBG": "eui.RadioButtonGroup",
            "$eRa": "eui.Range",
            "$eR": "eui.Rect",
            "$eRAl": "eui.RowAlign",
            "$eS": "eui.Scroller",
            "$eT": "eui.TabBar",
            "$eTI": "eui.TextInput",
            "$eTL": "eui.TileLayout",
            "$eTB": "eui.ToggleButton",
            "$eTS": "eui.ToggleSwitch",
            "$eVL": "eui.VerticalLayout",
            "$eV": "eui.ViewStack",
            "$eVSB": "eui.VScrollBar",
            "$eVS": "eui.VSlider",
            "$eSk": "eui.Skin"
        };
    }
    JSONParseClass.prototype.setData = function (data) {
        if (!this.json) {
            this.json = data;
            this.parseSkinMap(this.json);
        }
        else {
            this.parseSkinMap(data);
            for (var a in data) {
                this.json[a] = data[a];
            }
        }
    };
    JSONParseClass.prototype.generateSkinClass = function (skinData, className, superName) {
        if (!skinData)
            return null;
        var paths = superName.split(".");
        var target = window;
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var p = paths_1[_i];
            target = target[p];
        }
        function __SkinClass() {
            target.call(this);
            window["JSONParseClass"].create(className, this);
        }
        __extends(__SkinClass, target);
        __reflect(__SkinClass, className, [superName]);
        return __SkinClass;
    };
    JSONParseClass.prototype.parseSkinMap = function (skinMap) {
        var skinResult = {};
        for (var exml in skinMap) {
            var skinData = skinMap[exml];
            if (!skinData)
                continue;
            var paths = exml.split(".");
            var target = window;
            for (var _i = 0, paths_2 = paths; _i < paths_2.length; _i++) {
                var p = paths_2[_i];
                var parent = target;
                if (p !== paths[paths.length - 1]) {
                    target = target[p];
                    if (target == undefined) {
                        target = {};
                        parent[p] = target;
                    }
                }
            }
            var superName = this.euiNormalizeNames[skinData["$sC"]] == undefined ? skinData["$sC"] : this.euiNormalizeNames[skinData["$sC"]];
            skinResult[exml] = target[paths[paths.length - 1]] = this.generateSkinClass(skinData, exml, superName);
            if (skinMap[exml]["$path"]) {
                generateEUI2["paths"][skinMap[exml]["$path"]] = skinResult[exml];
            }
        }
        return skinResult;
    };
    JSONParseClass.prototype.create = function (skinName, target) {
        if (!this.json) {
            console.log("Missing json defined by eui resource, please modify the theme adapter");
            console.log("缺少eui资源定义的json，请修改主题适配器");
            return;
        }
        /** 先解析对应名字的的 */
        this.target = target;
        this.skinName = skinName;
        this.skinClass = this.json[skinName];
        //开始生成
        this.applyBase();
        this.applySkinParts();
        this.applyState();
        this.applyBinding();
        //skinParts 只能最后赋值，在comp中引用问题
        if (this.skinClass["$sP"] == undefined)
            this.target["skinParts"] = [];
        else
            this.target["skinParts"] = this.skinClass["$sP"];
    };
    JSONParseClass.prototype.applySkinParts = function () {
        if (this.skinClass["$sP"] == undefined)
            return;
        for (var _i = 0, _a = this.skinClass["$sP"]; _i < _a.length; _i++) {
            var component = _a[_i];
            if (this.target[component] == undefined)
                this.createElementContentOrViewport(component);
        }
    };
    JSONParseClass.prototype.applyBase = function () {
        if (this.skinClass["$bs"] == undefined)
            return;
        this.addCommonProperty("$bs", this.target);
    };
    JSONParseClass.prototype.createElementContentOrViewport = function (component) {
        var result;
        var typeStr = this.getNormalizeEuiName(this.skinClass[component].$t);
        if (typeStr == "egret.tween.TweenGroup") {
            result = this.creatsEgretTweenGroup(component);
        }
        else {
            /** 有可能对象是从外面一定义的皮肤 */
            var type_1 = egret.getDefinitionByName(typeStr);
            this.$createNewObject(function () {
                result = new type_1();
            });
            this.addCommonProperty(component, result);
        }
        this.target[component] = result;
        return result;
    };
    /**
     * 生成单位，有可能会跳出当前皮肤，所以统一维护target和skin
     * @param callback 创建对象的真实逻辑
     */
    JSONParseClass.prototype.$createNewObject = function (callback) {
        var skinName = this.skinName;
        var target = this.target;
        callback();
        this.skinName = skinName;
        this.skinClass = this.json[this.skinName];
        this.target = target;
    };
    /**
     * 生成对应的缓动组
     * @param component 名字索引
     */
    JSONParseClass.prototype.creatsEgretTweenGroup = function (component) {
        var result = this.createTypeObject(component);
        var items = [];
        for (var _i = 0, _a = this.skinClass[component]["items"]; _i < _a.length; _i++) {
            var item = _a[_i];
            items.push(this.createEgretTweenItem(item));
        }
        result["items"] = items;
        return result;
    };
    /**
     * 生成对应的缓动单位
     * @param tweenItem 名字索引
     */
    JSONParseClass.prototype.createEgretTweenItem = function (tweenItem) {
        var _this = this;
        var result = this.createTypeObject(tweenItem);
        var paths = [];
        var _loop_1 = function (prop) {
            var property = this_1.skinClass[tweenItem][prop];
            if (prop == "$t" || prop == "target") {
            }
            else if (prop == "paths") {
                for (var _i = 0, property_1 = property; _i < property_1.length; _i++) {
                    var path = property_1[_i];
                    paths.push(this_1.createSetOrTo(path));
                }
            }
            else if (prop == "target") {
                this_1.$createNewObject(function () {
                    result[prop] = _this.createElementContentOrViewport(property);
                    _this.target[property] = result[prop];
                });
            }
            else {
                result[prop] = property;
            }
        };
        var this_1 = this;
        for (var prop in this.skinClass[tweenItem]) {
            _loop_1(prop);
        }
        result["paths"] = paths;
        this.target[tweenItem] = result;
        return result;
    };
    JSONParseClass.prototype.createSetOrTo = function (key) {
        var result = this.createTypeObject(key);
        for (var prop in this.skinClass[key]) {
            var property = this.skinClass[key][prop];
            if (prop == "$t" || prop == "target") {
            }
            else if (prop == "props") {
                result[prop] = this.createObject(property);
                this.target[property] = result[prop];
            }
            else {
                result[prop] = property;
            }
        }
        return result;
    };
    JSONParseClass.prototype.createObject = function (name) {
        var result = {};
        for (var prop in this.skinClass[name]) {
            if (prop == "$t" || prop == "target") {
            }
            else {
                result[prop] = this.skinClass[name][prop];
            }
        }
        return result;
    };
    JSONParseClass.prototype.addCommonProperty = function (componentName, target) {
        var eleC;
        var sId;
        var _loop_2 = function (prop) {
            var property = this_2.skinClass[componentName][prop];
            if (prop == "$t") {
            }
            else if (prop == "layout") {
                target[prop] = this_2.createLayout(property);
            }
            else if (prop == "$eleC") {
                eleC = property;
            }
            else if (prop == "$sId") {
                sId = property;
            }
            else if (prop == "scale9Grid") {
                target[prop] = this_2.getScale9Grid(property);
            }
            else if (prop == "skinName") {
                this_2.$createNewObject(function () {
                    target[prop] = property;
                });
            }
            else if (prop == "itemRendererSkinName") {
                this_2.$createNewObject(function () {
                    var dirPath = property.split(".");
                    var t = window;
                    for (var _i = 0, dirPath_1 = dirPath; _i < dirPath_1.length; _i++) {
                        var p = dirPath_1[_i];
                        t = t[p];
                    }
                    target[prop] = t;
                });
            }
            else if (prop == "itemRenderer") {
                target[prop] = egret.getDefinitionByName(property);
            }
            else if (prop == "dataProvider") {
                target[prop] = this_2.createDataProvider(property);
            }
            else if (prop == "viewport") {
                target[prop] = this_2.createElementContentOrViewport(property);
            }
            else {
                target[prop] = property;
            }
        };
        var this_2 = this;
        for (var prop in this.skinClass[componentName]) {
            _loop_2(prop);
        }
        var ele = [];
        if (eleC && eleC.length > 0) {
            for (var _i = 0, eleC_1 = eleC; _i < eleC_1.length; _i++) {
                var element = eleC_1[_i];
                var e = this.createElementContentOrViewport(element);
                ele.push(e);
            }
        }
        target["elementsContent"] = ele;
        if (sId && sId.length > 0) {
            for (var _a = 0, sId_1 = sId; _a < sId_1.length; _a++) {
                var element = sId_1[_a];
                this.createElementContentOrViewport(element);
            }
        }
        return target;
    };
    JSONParseClass.prototype.createLayout = function (componentName) {
        var result = this.createTypeObject(componentName);
        var component = this.skinClass[componentName];
        for (var property in component) {
            if (property !== "$t") {
                result[property] = component[property];
            }
        }
        this.target[componentName] = result;
        return result;
    };
    JSONParseClass.prototype.applyState = function () {
        if (this.skinClass["$s"] == undefined)
            return;
        var states = [];
        for (var state in this.skinClass["$s"]) {
            var setProperty = [];
            var tempState = this.skinClass["$s"][state];
            if (tempState["$saI"]) {
                for (var _i = 0, _a = tempState["$saI"]; _i < _a.length; _i++) {
                    var property = _a[_i];
                    setProperty.push(new eui.AddItems(property["target"], property["property"], property["position"], property["relativeTo"]));
                }
            }
            if (tempState["$ssP"]) {
                for (var _b = 0, _c = tempState["$ssP"]; _b < _c.length; _b++) {
                    var property = _c[_b];
                    if (property["name"]) {
                        var value = property["value"];
                        if (property["name"] == "scale9Grid") {
                            value = this.getScale9Grid(property["value"]);
                        }
                        setProperty.push(new eui.SetProperty(property["target"], property["name"], value));
                    }
                    else {
                        setProperty.push(new eui.SetStateProperty(this.target, property["templates"], property["chainIndex"], this.target[property["target"]], property["property"]));
                    }
                }
            }
            states.push(new eui.State(state, setProperty));
        }
        this.target["states"] = states;
    };
    JSONParseClass.prototype.applyBinding = function () {
        if (this.skinClass["$b"] == undefined)
            return;
        for (var _i = 0, _a = this.skinClass["$b"]; _i < _a.length; _i++) {
            var bindingDate = _a[_i];
            if (bindingDate["$bc"] !== undefined) {
                eui.Binding.$bindProperties(this.target, bindingDate["$bd"], bindingDate["$bc"], this.target[bindingDate["$bt"]], bindingDate["$bp"]);
            }
            else {
                eui.Binding.bindProperty(this.target, bindingDate["$bd"][0].split("."), this.target[bindingDate["$bt"]], bindingDate["$bp"]);
            }
        }
    };
    JSONParseClass.prototype.createDataProvider = function (component) {
        if (component == "")
            return undefined;
        var result = this.createTypeObject(component);
        var source = [];
        for (var _i = 0, _a = this.skinClass[component]["source"]; _i < _a.length; _i++) {
            var sour = _a[_i];
            source.push(this.createItemRender(sour));
        }
        result["source"] = source;
        return result;
    };
    JSONParseClass.prototype.createItemRender = function (itemName) {
        var result = this.createTypeObject(itemName);
        for (var property in this.skinClass[itemName]) {
            if (property != "$t") {
                result[property] = this.skinClass[itemName][property];
            }
        }
        return result;
    };
    JSONParseClass.prototype.getNormalizeEuiName = function (str) {
        return this.euiNormalizeNames[str] ? this.euiNormalizeNames[str] : str;
    };
    JSONParseClass.prototype.createTypeObject = function (component) {
        var typestr = this.getNormalizeEuiName(this.skinClass[component].$t);
        var type = egret.getDefinitionByName(typestr);
        return new type();
    };
    JSONParseClass.prototype.getScale9Grid = function (data) {
        var datalist = data.split(",");
        return new egret.Rectangle(parseFloat(datalist[0]), parseFloat(datalist[1]), parseFloat(datalist[2]), parseFloat(datalist[3]));
    };
    return JSONParseClass;
}());
window["JSONParseClass"] = new JSONParseClass();
