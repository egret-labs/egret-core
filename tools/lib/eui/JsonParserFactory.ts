var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) {
    function r() {
        this.constructor = t;
    }
    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    r.prototype = e.prototype, t.prototype = new r();
};

declare let window;
declare let generateEUI2;
declare namespace egret {
    function getDefinitionByName(name: string): any;
    export class Rectangle {
        constructor(a, b, c, d);
    }
}
declare namespace eui {
    export class SetProperty {
        constructor(a, b, c);
    }
    export class SetStateProperty {
        constructor(a, b, c, d, e);
    }
    export class Binding {
        static $bindProperties(a, b, c, d, e);
        static bindProperty(a, b, c, d)
    }
    export class State {
        constructor(a, b);
    }
    export class AddItems {
        constructor(a, b, c, d);
    }

}
class JSONParseClass {
    private json;
    private skinClass = {};
    private target;
    private skinName: string;//一个skin可能包含多个

    private euiNormalizeNames = {
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
    }


    setData(data: any) {
        if (!this.json) {
            this.json = data;
            this.parseSkinMap(this.json);
        } else {
            this.parseSkinMap(data);
            for (let a in data) {
                this.json[a] = data[a];
            }
        }
    }
    private generateSkinClass(skinData: any, className: string, superName: string): any {
        if (!skinData) return null;
        let paths = superName.split(".");
        let target = window;
        for (let p of paths) {
            target = target[p];
        }
        function __SkinClass() {
            target.call(this);
            window["JSONParseClass"].create(className, this);
        }
        (<any>__extends)(__SkinClass, target);
        (<any>__reflect)(__SkinClass, className, [superName]);
        return __SkinClass;
    }

    parseSkinMap(skinMap): any {
        let skinResult = {};
        for (let exml in skinMap) {
            let skinData = skinMap[exml];
            if (!skinData) continue;
            let paths = exml.split(".");
            let target = window;
            for (let p of paths) {
                let parent = target;
                if (p !== paths[paths.length - 1]) {
                    target = target[p];
                    if (target == undefined) {
                        target = {};
                        parent[p] = target;
                    }
                }
            }

            let superName = this.euiNormalizeNames[skinData["$sC"]] == undefined ? skinData["$sC"] : this.euiNormalizeNames[skinData["$sC"]];
            skinResult[exml] = target[paths[paths.length - 1]] = this.generateSkinClass(skinData, exml, superName);
            if (skinMap[exml]["$path"]) {
                generateEUI2["paths"][skinMap[exml]["$path"]] = skinResult[exml];
            }
        }
        return skinResult;
    }


    create(skinName: string, target: any) {
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
            this.target["skinParts"] = this.skinClass["$sP"]
    }
    private applySkinParts() {
        if (this.skinClass["$sP"] == undefined)
            return;
        for (let component of this.skinClass["$sP"]) {
            if (this.target[component] == undefined)
                this.createElementContentOrViewport(component);
        }
    }
    private applyBase() {
        if (this.skinClass["$bs"] == undefined) return;
        this.addCommonProperty("$bs", this.target);
    }
    private createElementContentOrViewport(component: string) {
        let result;
        const typeStr = this.getNormalizeEuiName(this.skinClass[component].$t);
        if (typeStr == "egret.tween.TweenGroup") {
            result = this.creatsEgretTweenGroup(component);
        } else {
            /** 有可能对象是从外面一定义的皮肤 */
            const type = egret.getDefinitionByName(typeStr);
            this.$createNewObject(() => {
                result = new type();
            })
            this.addCommonProperty(component, result);
        }
        this.target[component] = result;
        return result;
    }
    /**
     * 生成单位，有可能会跳出当前皮肤，所以统一维护target和skin
     * @param callback 创建对象的真实逻辑 
     */
    private $createNewObject(callback: Function) {
        const skinName = this.skinName;
        const target = this.target;
        callback();
        this.skinName = skinName;
        this.skinClass = this.json[this.skinName];
        this.target = target;
    }

    /**
     * 生成对应的缓动组
     * @param component 名字索引 
     */
    private creatsEgretTweenGroup(component: string) {
        let result = this.createTypeObject(component);
        let items = [];
        for (let item of this.skinClass[component]["items"]) {
            items.push(this.createEgretTweenItem(item));
        }
        result["items"] = items;
        return result;
    }
    /**
     * 生成对应的缓动单位
     * @param tweenItem 名字索引
     */
    private createEgretTweenItem(tweenItem: string) {
        let result = this.createTypeObject(tweenItem);
        let paths = [];
        for (let prop in this.skinClass[tweenItem]) {
            const property = this.skinClass[tweenItem][prop];
            if (prop == "$t" || prop == "target") {
            }
            else if (prop == "paths") {
                for (let path of property)
                    paths.push(this.createSetOrTo(path));
            } else if (prop == "target") {
                this.$createNewObject(() => {
                    result[prop] = this.createElementContentOrViewport(property);
                    this.target[property] = result[prop];
                })
            } else {
                result[prop] = property;
            }
        }
        result["paths"] = paths;
        this.target[tweenItem] = result;
        return result;
    }

    private createSetOrTo(key: string) {
        let result = this.createTypeObject(key);
        for (let prop in this.skinClass[key]) {
            const property = this.skinClass[key][prop];
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
    }
    private createObject(name: string) {
        let result = {};
        for (let prop in this.skinClass[name]) {
            if (prop == "$t" || prop == "target") {
            }
            else {
                result[prop] = this.skinClass[name][prop];
            }
        }
        return result;
    }

    private addCommonProperty(componentName: string, target: any) {
        let eleC: string[];
        let sId: string[];
        for (let prop in this.skinClass[componentName]) {
            let property = this.skinClass[componentName][prop];
            if (prop == "$t") {
            }
            else if (prop == "layout") {
                target[prop] = this.createLayout(property);
            }
            else if (prop == "$eleC") {
                eleC = property;
            }
            else if (prop == "$sId") {
                sId = property;
            }
            else if (prop == "scale9Grid") {
                target[prop] = this.getScale9Grid(property);
            }
            else if (prop == "skinName") {
                this.$createNewObject(() => {
                    target[prop] = property;
                });
            }
            else if (prop == "itemRendererSkinName") {
                this.$createNewObject(() => {
                    let dirPath = property.split(".");
                    let t = window;
                    for (let p of dirPath) {
                        t = t[p];
                    }
                    target[prop] = t;
                });
            }
            else if (prop == "itemRenderer") {
                target[prop] = egret.getDefinitionByName(property);
            }
            else if (prop == "dataProvider") {
                target[prop] = this.createDataProvider(property);
            }
            else if (prop == "viewport") {
                target[prop] = this.createElementContentOrViewport(property);
            }
            else {
                target[prop] = property;
            }
        }
        let ele = []
        if (eleC && eleC.length > 0) {
            for (let element of eleC) {
                let e = this.createElementContentOrViewport(element);
                ele.push(e);
            }
        }
        target["elementsContent"] = ele;
        if (sId && sId.length > 0) {
            for (let element of sId) {
                this.createElementContentOrViewport(element);
            }
        }
        return target;
    }

    private createLayout(componentName: string) {
        let result = this.createTypeObject(componentName);
        const component = this.skinClass[componentName];
        for (let property in component) {
            if (property !== "$t") {
                result[property] = component[property];
            }
        }
        this.target[componentName] = result;
        return result;
    }

    private applyState() {
        if (this.skinClass["$s"] == undefined) return;
        let states = [];
        for (let state in this.skinClass["$s"]) {
            let setProperty = [];
            let tempState = this.skinClass["$s"][state];
            if (tempState["$saI"]) {
                for (let property of tempState["$saI"]) {
                    setProperty.push(new eui.AddItems(property["target"], property["property"], property["position"], property["relativeTo"]));
                }
            }
            if (tempState["$ssP"]) {
                for (let property of tempState["$ssP"]) {
                    if (property["name"]) {
                        let value = property["value"];
                        if (property["name"] == "scale9Grid") {
                            value = this.getScale9Grid(property["value"])
                        }
                        setProperty.push(new eui.SetProperty(property["target"], property["name"], value));
                    } else {
                        setProperty.push(new eui.SetStateProperty(this.target, property["templates"], property["chainIndex"], this.target[property["target"]], property["property"]));
                    }
                }
            }
            states.push(new eui.State(state, setProperty))
        }
        this.target["states"] = states;
    }
    private applyBinding() {
        if (this.skinClass["$b"] == undefined) return;
        for (let bindingDate of this.skinClass["$b"]) {
            if (bindingDate["$bc"] !== undefined) {
                eui.Binding.$bindProperties(this.target, bindingDate["$bd"], bindingDate["$bc"], this.target[bindingDate["$bt"]], bindingDate["$bp"]);
            }
            else {
                eui.Binding.bindProperty(this.target, bindingDate["$bd"][0].split("."), this.target[bindingDate["$bt"]], bindingDate["$bp"])
            }
        }
    }
    private createDataProvider(component: string) {
        if (component == "") return undefined;
        let result = this.createTypeObject(component);
        let source = [];
        for (let sour of this.skinClass[component]["source"]) {
            source.push(this.createItemRender(sour));
        }
        result["source"] = source;
        return result;
    }
    private createItemRender(itemName: string) {
        let result = this.createTypeObject(itemName);
        for (let property in this.skinClass[itemName]) {
            if (property != "$t") {
                result[property] = this.skinClass[itemName][property];
            }
        }
        return result;
    }
    private getNormalizeEuiName(str: string): string {
        return this.euiNormalizeNames[str] ? this.euiNormalizeNames[str] : str;
    }
    private createTypeObject(component: string) {
        const typestr = this.getNormalizeEuiName(this.skinClass[component].$t);
        const type = egret.getDefinitionByName(typestr);
        return new type();
    }
    private getScale9Grid(data: string) {
        const datalist = data.split(",");
        return new egret.Rectangle(parseFloat(datalist[0]), parseFloat(datalist[1]), parseFloat(datalist[2]), parseFloat(datalist[3]));
    }
}
window["JSONParseClass"] = new JSONParseClass();