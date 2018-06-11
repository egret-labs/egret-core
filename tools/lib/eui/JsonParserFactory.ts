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
class JSONParseClass {
    private json = {};
    private skinClass = {};
    private target;
    private skinName: string;//一个skin可能包含多个
    private skinNameList: string[] = [];//因为是单例，操作的都是一个解析，所以这个保存皮肤
    private targetList: any[] = [];//因为是单例，操作的都是一个解析，所以这个保存对象池

    private euiNormalize = {
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
        this.json = data;
        this.parseSkinMap(this.json);
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

            let superName = this.euiNormalize[skinData["$sC"]] == undefined ? skinData["$sC"] : this.euiNormalize[skinData["$sC"]];
            skinResult[exml] = target[paths[paths.length - 1]] = this.generateSkinClass(skinData, exml, superName);
            if (skinMap[exml]["$path"]) {
                generateEUI2["paths"][skinMap[exml]["$path"]] = skinResult[exml];
            }
        }
        return skinResult;
    }


    create(skinName: string, target: any) {
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
        if (this.skinClass["$sP"] == undefined)
            this.target["skinParts"] = [];
        else
            this.target["skinParts"] = this.skinClass["$sP"]
    }
    private creatSkinParts() {
        if (this.skinClass["$sP"] == undefined)
            return;
        for (let component of this.skinClass["$sP"]) {
            if (this.target[component] == undefined)
                this.createElementContentOrViewport(component);
        }
    }
    private createBase() {
        if (this.skinClass["$bs"] == undefined) return;
        this.addCommonProperty("$bs", this.target);
    }
    private createElementContentOrViewport(component: string) {
        let temp;
        let typestr = this.getNormalizeEui(this.skinClass[component].$t);
        if (typestr == "egret.tween.TweenGroup") {
            temp = this.creatsEgretTweenGroup(component);
        } else {
            /** 有可能对象是从外面一定义的皮肤 */
            let type = egret.getDefinitionByName(typestr);
            this.$createNewObject(() => {
                temp = new type();
            })
            this.addCommonProperty(component, temp);
        }
        this.target[component] = temp;
        return temp;
    }
    /**
     * 生成单位，有可能会跳出当前皮肤，所以统一维护target和skin
     * @param callback 创建对象的真实逻辑 
     */
    private $createNewObject(callback: Function) {
        this.skinNameList.push(this.skinName);
        this.targetList.push(this.target);
        callback();
        this.skinName = this.skinNameList.pop();
        this.skinClass = this.json[this.skinName];
        this.target = this.targetList.pop();
    }

    /**
     * 生成对应的缓动组
     * @param component 名字索引 
     */
    private creatsEgretTweenGroup(component: string) {
        let temp = this.createTypeObject(component);
        let items = [];
        for (let item of this.skinClass[component]["items"]) {
            items.push(this.createEgretTweenItem(item));
        }
        temp["items"] = items;
        return temp;
    }
    /**
     * 生成对应的缓动单位
     * @param tweenItem 名字索引
     */
    private createEgretTweenItem(tweenItem: string) {
        let temp = this.createTypeObject(tweenItem);
        let paths = [];
        for (let proper in this.skinClass[tweenItem]) {
            if (proper == "$t" || proper == "target") {
            }
            else if (proper == "paths") {
                for (let path of this.skinClass[tweenItem][proper])
                    paths.push(this.createSetOrTo(path));
            } else if (proper == "target") {
                this.$createNewObject(() => {
                    temp[proper] = this.createElementContentOrViewport(this.skinClass[tweenItem][proper]);
                    this.target[this.skinClass[tweenItem][proper]] = temp[proper];
                })
            } else {
                temp[proper] = this.skinClass[tweenItem][proper];
            }
        }
        temp["paths"] = paths;
        this.target[tweenItem] = temp;
        return temp;
    }

    private createSetOrTo(key: string) {
        let temp = this.createTypeObject(key);
        for (let proper in this.skinClass[key]) {
            if (proper == "$t" || proper == "target") {

            }
            else if (proper == "props") {
                temp[proper] = this.createEgretObject(this.skinClass[key][proper]);
                this.target[this.skinClass[key][proper]] = temp[proper];
            } else {
                temp[proper] = this.skinClass[key][proper];
            }
        }
        return temp;
    }
    private createEgretObject(name: string) {
        let temp = {};
        for (let prop in this.skinClass[name]) {
            if (prop == "$t" || prop == "target") {
            }
            else
                temp[prop] = this.skinClass[name][prop];
        }
        return temp;
    }

    private addCommonProperty(component: string, target: any) {
        let eleC: string[] = [];
        let sId: string[] = [];
        for (let property in this.skinClass[component]) {
            if (property == "$t") {
            }
            else if (property == "layout") {
                let layout = this.skinClass[component][property];
                target["layout"] = this.createLayout(layout);
            }
            else if (property == "$eleC") {
                eleC = this.skinClass[component]["$eleC"];
            }
            else if (property == "$sId") {
                sId = this.skinClass[component]["$sId"];
            }
            else if (property == "scale9Grid") {
                target[property] = this.getScale9Grid(this.skinClass[component][property])
            }
            else if (property == "skinName") {
                this.$createNewObject(() => {
                    target[property] = this.skinClass[component][property];
                })
            } else if (property == "itemRendererSkinName") {
                this.$createNewObject(() => {
                    let dirPath = this.skinClass[component][property].split(".");
                    let t = window;
                    for (let p of dirPath) {
                        t = t[p];
                    }
                    target[property] = t;
                })
            } else if (property == "itemRenderer") {
                target[property] = egret.getDefinitionByName(this.skinClass[component][property]);
            }
            else if (property == "dataProvider") {
                target[property] = this.createDataProvider(this.skinClass[component][property]);
            }
            else if (property == "viewport") {
                let viewport = this.skinClass[component][property];
                target["viewport"] = this.createElementContentOrViewport(viewport);
            }
            else
                target[property] = this.skinClass[component][property];
        }
        let ele = []
        if (eleC.length > 0) {
            for (let element of eleC) {
                let e = this.createElementContentOrViewport(element);
                ele.push(e);
            }
        }
        if (sId.length > 0) {
            for (let element of sId) {
                this.createElementContentOrViewport(element);
            }
        }
        target["elementsContent"] = ele;
        return target;
    }

    private createLayout(component: string) {
        let temp = this.createTypeObject(component);
        for (let property in this.skinClass[component]) {
            if (property == "$t") {
            } else
                temp[property] = this.skinClass[component][property];
        }
        this.target[component] = temp;
        return temp;
    }

    private creatState() {
        if (this.skinClass["$s"] == undefined) return;
        let setProperty = [];
        let states = [];
        for (let state in this.skinClass["$s"]) {
            let setProperty = [];
            let tempState = this.skinClass["$s"][state];
            if (this.skinClass["$s"][state]["$saI"]) {
                for (let property of tempState["$saI"]) {
                    setProperty.push(new eui.AddItems(property["target"], property["property"], property["position"], property["relativeTo"]));
                }
            }
            if (this.skinClass["$s"][state]["$ssP"]) {
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
    private creatBinding() {
        if (this.skinClass["$b"] == undefined) return;
        for (let bindingDate of this.skinClass["$b"]) {
            if (bindingDate["$bc"] !== undefined)
                eui.Binding.$bindProperties(this.target, bindingDate["$bd"], bindingDate["$bc"], this.target[bindingDate["$bt"]], bindingDate["$bp"]);
            else
                eui.Binding.bindProperty(this.target, bindingDate["$bd"][0].split("."), this.target[bindingDate["$bt"]], bindingDate["$bp"])
        }
    }
    private createDataProvider(component: string) {
        if (component == "") return undefined;
        let temp = this.createTypeObject(component);
        let source = [];
        for (let sour of this.skinClass[component]["source"]) {
            source.push(this.createdataItem(sour));
        }
        temp["source"] = source;
        return temp;
    }
    private createdataItem(itemName: string) {
        let temp = this.createTypeObject(itemName);
        for (let property in this.skinClass[itemName]) {
            if (property == "$t") {
            } else {
                temp[property] = this.skinClass[itemName][property];
            }
        }
        return temp;
    }
    private getNormalizeEui(str: string) {
        return this.euiNormalize[str] == undefined ? str : this.euiNormalize[str];;
    }
    private createTypeObject(component: string) {
        let typestr = this.getNormalizeEui(this.skinClass[component].$t);
        let type = egret.getDefinitionByName(typestr);
        return new type();
    }
    private getScale9Grid(data: string) {
        let datalist = data.split(",");
        return new egret.Rectangle(parseFloat(datalist[0]), parseFloat(datalist[1]), parseFloat(datalist[2]), parseFloat(datalist[3]));
    }
}
window["JSONParseClass"] = new JSONParseClass();