var JSONParseClass = /** @class */ (function () {
    function JSONParseClass() {
        this.json = {};
        this.skinClass = {};
        this.skinNameList = []; //因为是单例，操作的都是一个解析，所以这个保存皮肤
        this.targetList = []; //因为是单例，操作的都是一个解析，所以这个保存对象池
        this.euiNormalize = {
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
            "$eVS": "eui.VSlider"
        };
    }
    JSONParseClass.prototype.setData = function (data) {
        var readtool = new egret.ByteArray();
        readtool._writeUint8Array(new Uint8Array(data));
        readtool.position = 0;
        var d = readtool.readUTFBytes(data.byteLength);
        this.json = JSON.parse(d);
    };
    JSONParseClass.prototype.create = function (skinName, target) {
        /** 先解析对应名字的的 */
        this.target = target;
        this.skinName = skinName;
        this.skinClass = this.json[skinName];
        //开始生成
        this.createBase();
        this.creatSkinParts();
        this.creatState();
        this.creatBinding();
        //skinParts 只能最后赋值，在comp中引用问题
        this.target["skinParts"] = this.skinClass["$sP"];
    };
    JSONParseClass.prototype.creatSkinParts = function () {
        for (var _i = 0, _a = this.skinClass["$sP"]; _i < _a.length; _i++) {
            var component = _a[_i];
            if (this.target[component] == undefined)
                this.createElementContentOrViewport(component);
        }
    };
    JSONParseClass.prototype.createBase = function () {
        this.addCommonProperty("$bs", this.target);
    };
    JSONParseClass.prototype.createElementContentOrViewport = function (component) {
        var temp;
        var typestr = this.getNormalizeEui(this.skinClass[component].$t);
        if (typestr == "egret.tween.TweenGroup") {
            temp = this.creatsEgretTweenGroup(component);
        }
        else {
            /** 有可能对象是从外面一定义的皮肤 */
            var type_1 = egret.getDefinitionByName(typestr);
            this.$createNewObject(function () {
                temp = new type_1();
            });
            this.addCommonProperty(component, temp);
        }
        this.target[component] = temp;
        return temp;
    };
    /**
     * 生成单位，有可能会跳出当前皮肤，所以统一维护target和skin
     * @param callback 创建对象的真实逻辑
     */
    JSONParseClass.prototype.$createNewObject = function (callback) {
        this.skinNameList.push(this.skinName);
        this.targetList.push(this.target);
        callback();
        this.skinName = this.skinNameList.pop();
        this.skinClass = this.json[this.skinName];
        this.target = this.targetList.pop();
    };
    /**
     * 生成对应的缓动组
     * @param component 名字索引
     */
    JSONParseClass.prototype.creatsEgretTweenGroup = function (component) {
        var typestr = this.getNormalizeEui(this.skinClass[component].$t);
        var type = egret.getDefinitionByName(typestr);
        var temp = new type();
        var items = [];
        for (var _i = 0, _a = this.skinClass[component]["items"]; _i < _a.length; _i++) {
            var item = _a[_i];
            items.push(this.createEgretTweenItem(item));
        }
        temp["items"] = items;
        return temp;
    };
    /**
     * 生成对应的缓动单位
     * @param tweenItem 名字索引
     */
    JSONParseClass.prototype.createEgretTweenItem = function (tweenItem) {
        var _this = this;
        var typestr = this.getNormalizeEui(this.skinClass[tweenItem].$t);
        var type = egret.getDefinitionByName(typestr);
        var temp = new type();
        var paths = [];
        var _loop_1 = function (proper) {
            if (proper == "$t" || proper == "target") {
            }
            else if (proper == "paths") {
                for (var _i = 0, _a = this_1.skinClass[tweenItem][proper]; _i < _a.length; _i++) {
                    var path = _a[_i];
                    paths.push(this_1.createSetOrTo(path));
                }
            }
            else if (proper == "target") {
                this_1.$createNewObject(function () {
                    temp[proper] = _this.createElementContentOrViewport(_this.skinClass[tweenItem][proper]);
                    _this.target[_this.skinClass[tweenItem][proper]] = temp[proper];
                });
            }
            else {
                temp[proper] = this_1.skinClass[tweenItem][proper];
            }
        };
        var this_1 = this;
        for (var proper in this.skinClass[tweenItem]) {
            _loop_1(proper);
        }
        temp["paths"] = paths;
        this.target[tweenItem] = temp;
        return temp;
    };
    JSONParseClass.prototype.createSetOrTo = function (key) {
        var typestr = this.getNormalizeEui(this.skinClass[key].$t);
        var type = egret.getDefinitionByName(typestr);
        var temp = new type();
        for (var proper in this.skinClass[key]) {
            if (proper == "$t" || proper == "target") {
            }
            else if (proper == "props") {
                temp[proper] = this.createEgretObject(this.skinClass[key][proper]);
                this.target[this.skinClass[key][proper]] = temp[proper];
            }
            else {
                temp[proper] = this.skinClass[key][proper];
            }
        }
        return temp;
    };
    JSONParseClass.prototype.createEgretObject = function (name) {
        var temp = {};
        for (var prop in this.skinClass[name]) {
            if (prop == "$t" || prop == "target") {
            }
            else
                temp[prop] = this.skinClass[name][prop];
        }
        return temp;
    };
    JSONParseClass.prototype.addCommonProperty = function (component, target) {
        var _this = this;
        var eleC = [];
        var layout;
        var viewport;
        var _loop_2 = function (property) {
            if (property == "$t") {
            }
            else if (property == "layout") {
                layout = this_2.skinClass[component][property];
            }
            else if (property == "$eleC") {
                eleC = this_2.skinClass[component]["$eleC"];
            }
            else if (property == "scale9Grid") {
                var data = this_2.skinClass[component][property].split(",");
                target[property] = new egret.Rectangle(parseFloat(data[0]), parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
            }
            else if (property == "skinName") {
                this_2.$createNewObject(function () {
                    target[property] = _this.skinClass[component][property];
                });
            }
            else if (property == "viewport") {
                viewport = this_2.skinClass[component][property];
            }
            else
                target[property] = this_2.skinClass[component][property];
        };
        var this_2 = this;
        for (var property in this.skinClass[component]) {
            _loop_2(property);
        }
        if (eleC.length > 0) {
            var eleCs = [];
            for (var _i = 0, eleC_1 = eleC; _i < eleC_1.length; _i++) {
                var element = eleC_1[_i];
                var e = this.createElementContentOrViewport(element);
                eleCs.push(e);
            }
            target["elementsContent"] = eleCs;
        }
        if (layout !== undefined) {
            var l = this.createLayout(layout);
            target["layout"] = l;
        }
        if (viewport !== undefined) {
            var v = this.createElementContentOrViewport(viewport);
            target["viewport"] = v;
        }
        return target;
    };
    JSONParseClass.prototype.createLayout = function (component) {
        var typestr = this.getNormalizeEui(this.skinClass[component].$t);
        var type = egret.getDefinitionByName(typestr);
        var temp = new type();
        for (var property in this.skinClass[component]) {
            if (property == "$t") {
            }
            else
                temp[property] = this.skinClass[component][property];
        }
        this.target[component] = temp;
        return temp;
    };
    JSONParseClass.prototype.creatState = function () {
        if (this.skinClass["$s"] == undefined)
            return;
        var setProperty = [];
        var states = [];
        for (var state in this.skinClass["$s"]) {
            var setProperty_1 = [];
            for (var _i = 0, _a = this.skinClass["$s"][state]; _i < _a.length; _i++) {
                var property = _a[_i];
                var p = this.skinClass["$s"][state][property];
                setProperty_1.push(new eui.SetProperty(property["target"], property["name"], property["value"]));
            }
            states.push(new eui.State(state, setProperty_1));
        }
        this.target["states"] = states;
    };
    JSONParseClass.prototype.creatBinding = function () {
        if (this.skinClass["$b"] == undefined)
            return;
        for (var _i = 0, _a = this.skinClass["$b"]; _i < _a.length; _i++) {
            var bindingDate = _a[_i];
            if (bindingDate["$bc"] !== undefined)
                eui.Binding.$bindProperties(this.target, bindingDate["$bd"], bindingDate["$bc"], this.target[bindingDate["$bt"]], bindingDate["$bp"]);
            else
                eui.Binding.bindProperty(this.target, bindingDate["$bd"][0].split("."), this.target[bindingDate["$bt"]], bindingDate["$bp"]);
        }
    };
    JSONParseClass.prototype.getNormalizeEui = function (str) {
        return this.euiNormalize[str] == undefined ? str : this.euiNormalize[str];
        ;
    };
    return JSONParseClass;
}());
window["JSONParseClass"] = new JSONParseClass();
