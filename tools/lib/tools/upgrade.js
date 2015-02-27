/**
 * Created by apple on 14-8-5.
 */


var file = require("../core/file.js");
var param = require("../core/params_analyze.js");
var code_util = require("../core/code_util.js");
var path = require("path");
var globals = require("../core/globals.js");
var projectConfig = require("../core/projectConfig.js");

var upgradeConfigArr = [
    //todo
    {"v" : "1.0.3", "func":upgradeTo_1_0_3},
    {"v" : "1.0.4", "func":upgradeTo_1_0_4},
    {"v" : "1.0.5", "func":upgradeTo_1_0_5},
    {"v" : "1.0.6", "func":upgradeTo_1_0_6},
    {"v" : "1.1.0", "func":upgradeTo_1_1_0},
    {"v" : "1.1.1", "func":upgradeTo_1_1_1},
    {"v" : "1.1.2", "func":upgradeTo_1_1_2},
    {"v" : "1.1.3", "func":upgradeTo_1_1_3},
    {"v" : "1.1.4", "func":upgradeTo_1_1_4},
    {"v" : "1.5.0", "func":upgradeTo_1_5_0},
    {"v" : "1.5.1", "func":upgradeTo_1_5_1},
    {"v" : "1.5.2", "func":upgradeTo_1_5_2},
    {"v" : "1.5.3", "func":upgradeTo_1_5_3},
    {"v" : "1.5.4", "func":upgradeTo_1_5_4},
    {"v" : "1.5.5", "func":upgradeTo_1_5_5}
];

var currDir;
var args;
function run(dir, a, opts) {
    currDir = globals.joinEgretDir(dir, a[0]);
    args = a;

    var config = require("../core/projectConfig.js");
    config.init(currDir);
    var version = config.data.egret_version;
    if (!version) {
        version = "1.0.0";
    }

    for (var i = 0; i < upgradeConfigArr.length; i++) {
        var info = upgradeConfigArr[i];
        var key = info["v"];
        var func = info["func"];

        var result = globals.compressVersion(version, key);
        if (result < 0) {
            func();
        }
    }

    globals.exit(1702);
}

function upgradeTo_1_0_3() {
    globals.log("正在更新到1.0.3");
    var extensionDir = path.join(currDir, "src");
    var list = file.search(extensionDir, "ts");
    list.forEach(fixSingleTypeScriptFile);
}

function upgradeTo_1_0_4() {
    globals.log("正在更新到1.0.4");
    //新的publish改之后，需要把base给删掉
    var releasePath = currDir + "/launcher/release.html";
    var txt = file.read(releasePath);
    txt = txt.replace("<base href=\"../\"/>", "");
    file.save(releasePath, txt);
    file.remove(path.join(currDir, "libs/egret.d.ts"));
    var releasePath = currDir + "/launcher/index.html";
    var txt = file.read(releasePath);
    txt = txt.replace("\"bin-debug/lib/\"", "\"libs/core/\"");
    file.save(releasePath, txt);
    projectConfig.init(currDir);
    projectConfig.data.modules = [
        {
            "name": "core"
        },
        {
            "name": "gui"
        },
        {
            "name": "dragonbones"
        }
    ];
    projectConfig.data.egret_version = "1.0.4";
    projectConfig.data.native.path_ignore = [];
    projectConfig.save();
}


function upgradeTo_1_0_5() {
    globals.log("正在更新到1.0.5");
    var releasePath = currDir + "/launcher/index.html";
    var txt = file.read(releasePath);
    txt = txt.replace("\"libs/core/\"", "\"libs/\"");
    file.save(releasePath, txt);


    var releasePath = currDir + "/launcher/native_loader.js";
    var txt = file.read(releasePath);
    txt = txt.replace("\"libs/core", "\"libs");
    file.save(releasePath, txt);


    var releasePath = currDir + "/launcher/egret_loader.js";
    var txt = file.read(releasePath);
    txt = txt.replace("egret.StageScaleMode.SHOW_ALL", "egret.StageScaleMode.NO_BORDER");
    file.save(releasePath, txt);

    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.0.5";
    projectConfig.data.native.path_ignore = [];
    projectConfig.save();
}

function upgradeTo_1_0_6(){
    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.0.6";
    projectConfig.save();
}

function upgradeTo_1_1_0() {
    globals.log("正在更新到1.1.0");

    //替换 全部 html
    var projectDir = currDir;

    var reg1 = /<div(.|\n|\r)+\"gameDiv\"(.|\n|\r)*<canvas(.|\n|\r)+<\/canvas>[^<]*<\/div>/;
    var newDiv = '<div style="position:relative;" id="gameDiv">';

    var fileList = file.getDirectoryListing(path.join(projectDir, "launcher"), true);
    for (var key in fileList) {
        var fileName = fileList[key];
        var filePath = path.join(projectDir, "launcher", fileName);
        if (file.isDirectory(filePath)) {
        }
        else if (filePath.indexOf(".html") >= 0) {
            var fileContent = file.read(filePath);
            //替换Div
            var matchObj = fileContent.match(/<div[^<]*gameDiv/);
            if (matchObj == null || matchObj.index < 0) {
                continue;
            }

            //保存副本
            file.save(path.join(projectDir, "launcher", "copy_" + fileName), fileContent);

            var firstIndex = matchObj.index;
            var endIndex = firstIndex + 1;
            var lastIndex = fileContent.indexOf('</div>', endIndex);

            while (lastIndex >= 0) {
                if (fileContent.indexOf("<div", endIndex) < lastIndex) {
                    endIndex = lastIndex;
                    lastIndex = fileContent.indexOf('</div>', endIndex + 1);
                }
                else {
                    endIndex = lastIndex;
                    lastIndex = -1;
                }
            }

            fileContent = fileContent.substring(0, firstIndex) + newDiv + fileContent.substring(endIndex, fileContent.length);

            //是否存在egret_require.js
            if (fileContent.indexOf("launcher/egret_require.js") < 0) {//不存在
                fileContent = fileContent.replace('<script src="launcher/egret_loader.js"', '<script src="launcher/egret_require.js"></script>\n<script src="launcher/egret_loader.js"');
            }

            file.save(filePath, fileContent);
        }
    }

    var loaderPath = path.join(projectDir, "launcher", "egret_loader.js");
    var loaderContent = file.read(loaderPath);
    //保存副本
    file.save(path.join(projectDir, "launcher", "copy_egret_loader.js"), loaderContent);

    //生成egret_loader.js样板
    var fileContent = file.read(path.join(param.getEgretPath(), "tools", "templates", "empty", "launcher", "egret_loader.js"));
    file.save(path.join(projectDir, "launcher", "egret_loader.js"), fileContent);

    if (!file.exists(path.join(projectDir, "launcher", "egret_require.js"))) {
        //生成require。js文件夹
        var reqContent = file.read(path.join(param.getEgretPath(), "tools", "templates", "empty", "launcher", "egret_require.js"));
        file.save(path.join(projectDir, "launcher", "egret_require.js"), reqContent);
    }

    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.1.0";
    projectConfig.save();

    var open = require("../core/open");
    open("https://github.com/egret-labs/egret-core/wiki/Egret_Upgrade/upgrade/index.html");

    globals.warn(1703);
}

function upgradeTo_1_1_1(){
    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.1.1";
    projectConfig.save();
}

function upgradeTo_1_1_2(){
    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.1.2";
    projectConfig.save();
}

function upgradeTo_1_1_3(){
    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.1.3";
    projectConfig.save();
}

function upgradeTo_1_1_4(){
    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.1.4";
    projectConfig.save();
}

function upgradeTo_1_5_0(){
    globals.log("正在更新到1.5.0");

    var projectDir = currDir;

    //更新egretProperties.json
    try {
        var properties = JSON.parse(file.read(path.join(projectDir, "egretProperties.json")));
        if (properties.native && properties.native.support_path && properties.native.support_path.length > 0) {
            for (var i = 0; i < properties.native.support_path.length; i++) {
                var supP = properties.native.support_path[i];
                if (supP.indexOf("proj.android") >= 0) {
                    properties.native.android_path = supP.substring(0, supP.indexOf("proj.android") - 1);
                }
                else if (supP.indexOf("proj.ios") >= 0) {
                    properties.native.ios_path = supP.substring(0, supP.indexOf("proj.ios") - 1);
                }
            }

            delete properties.native.support_path;
            file.save(path.join(projectDir, "egretProperties.json"), JSON.stringify(properties, null, "\t"));
        }
    }
    catch (e) {

    }

    //替换 native_loader.js
    var loaderPath = path.join(projectDir, "launcher", "native_loader.js");
    var loaderContent = file.read(loaderPath);
    //保存副本
    file.save(path.join(projectDir, "launcher", "copy_native_loader.js"), loaderContent);


    //生成egret_loader.js样板
    var fileContent = file.read(path.join(param.getEgretPath(), "tools", "templates", "empty", "launcher", "runtime_loader.js"));
    file.save(path.join(projectDir, "launcher", "runtime_loader.js"), fileContent);
    var fileContent = file.read(path.join(param.getEgretPath(), "tools", "templates", "empty", "launcher", "native_loader.js"));
    file.save(path.join(projectDir, "launcher", "native_loader.js"), fileContent);
    var fileContent = file.read(path.join(param.getEgretPath(), "tools", "templates", "empty", "launcher", "native_require.js"));
    file.save(path.join(projectDir, "launcher", "native_require.js"), fileContent);

    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.5.0";
    projectConfig.save();

    var open = require("../core/open");
    open("https://github.com/egret-labs/egret-core/blob/master/docs/1.5.0_ReleaseNotes.md");
}

function upgradeTo_1_5_1(){
    globals.log("正在更新到1.5.1");

    var extensionDir = path.join(currDir, "src");
    var list = file.search(extensionDir, "ts");
    list.forEach(fixSingleTypeScriptFile151);

    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.5.1";
    projectConfig.save();
}

function upgradeTo_1_5_2(){
    globals.log("正在更新到1.5.2");

    var native_require_path = path.join(currDir, "launcher", "native_require.js");
    if(file.exists(native_require_path)){
        var fileContent = file.read(native_require_path);
        fileContent = fileContent.replace("ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);","ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);\n\n        console.log(\"版本控制文件加载失败，请检查\");\n        completeCall();");
        file.save(native_require_path, fileContent);
    }

    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.5.2";
    projectConfig.save();
}

function upgradeTo_1_5_3(){
    globals.log("正在更新到1.5.3");

    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.5.3";
    projectConfig.save();
}

function upgradeTo_1_5_4(){
    globals.log("正在更新到1.5.4");

    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.5.4";
    projectConfig.save();
}

function upgradeTo_1_5_5(){
    globals.log("正在更新到1.5.5");

    var projectDir = currDir;
    //更新egretProperties.json， 将res变成一个单独的模块
    try {
        var properties = JSON.parse(file.read(path.join(projectDir, "egretProperties.json")));

        var hasRes = false;
        for (var key in properties.modules) {
            var module = properties.modules[key];
            if (module.name == "res") {
                hasRes = true;
                break;
            }
        }
        if (!hasRes) {
            properties.modules.splice(1, 0, {"name" : "res"});
        }
        file.save(path.join(projectDir, "egretProperties.json"), JSON.stringify(properties, null, "\t"));
    }
    catch (e) {

    }

    projectConfig.init(currDir);
    projectConfig.data.egret_version = "1.5.5";
    projectConfig.save();
}

function getClassList(item) {
    var basename = path.basename(item);
    return basename.substring(0, basename.indexOf("."))
}


function fixSingleTypeScriptFile(item) {
    var content = file.read(item);
    for (var key in gui_refactor_1_0_3) {

        var value = gui_refactor_1_0_3[key];

        while (content) {
            var index = code_util.getFirstVariableIndex(key, content);
            if (index == -1) {
                break;
            }
            content = content.substring(0, index) + value + content.substring(index + key.length);
        }
    }
    file.save(item, content);
}


function fixSingleTypeScriptFile151(item) {
    var content = file.read(item);
    for (var key in dragonbones_refactor_1_5_1) {

        var value = dragonbones_refactor_1_5_1[key];

        while (content) {
            var index = code_util.getFirstVariableIndex(key, content);
            if (index == -1) {
                break;
            }
            content = content.substring(0, index) + value + content.substring(index + key.length);
        }
    }
    file.save(item, content);
}

function help_title() {
    return "升级项目代码\n";
}

function help_example() {
    return "egret upgrade { your_project }";
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;


var gui_refactor_1_0_3 = { 'egret.ArrayCollection': 'egret.gui.ArrayCollection',
    'egret.ICollection': 'egret.gui.ICollection',
    'egret.ITreeCollection': 'egret.gui.ITreeCollection',
    'egret.ObjectCollection': 'egret.gui.ObjectCollection',
    'egret.Alert': 'egret.gui.Alert',
    'egret.Button': 'egret.gui.Button',
    'egret.CheckBox': 'egret.gui.CheckBox',
    'egret.DataGroup': 'egret.gui.DataGroup',
    'egret.DropDownList': 'egret.gui.DropDownList',
    'egret.Group': 'egret.gui.Group',
    'egret.HSlider': 'egret.gui.HSlider',
    'egret.IItemRenderer': 'egret.gui.IItemRenderer',
    'egret.IItemRendererOwner': 'egret.gui.IItemRendererOwner',
    'egret.ITreeItemRenderer': 'egret.gui.ITreeItemRenderer',
    'egret.Label': 'egret.gui.Label',
    'egret.List': 'egret.gui.List',
    'egret.Panel': 'egret.gui.Panel',
    'egret.PopUpAnchor': 'egret.gui.PopUpAnchor',
    'egret.ProgressBar': 'egret.gui.ProgressBar',
    'egret.ProgressBarDirection': 'egret.gui.ProgressBarDirection',
    'egret.RadioButton': 'egret.gui.RadioButton',
    'egret.RadioButtonGroup': 'egret.gui.RadioButtonGroup',
    'egret.Rect': 'egret.gui.Rect',
    'egret.Scroller': 'egret.gui.Scroller',
    'egret.Skin': 'egret.gui.Skin',
    'egret.SkinnableComponent': 'egret.gui.SkinnableComponent',
    'egret.SkinnableContainer': 'egret.gui.SkinnableContainer',
    'egret.SkinnableDataContainer': 'egret.gui.SkinnableDataContainer',
    'egret.Spacer': 'egret.gui.Spacer',
    'egret.TabBar': 'egret.gui.TabBar',
    'egret.TabBarButton': 'egret.gui.TabBarButton',
    'egret.TitleWindow': 'egret.gui.TitleWindow',
    'egret.ToggleButton': 'egret.gui.ToggleButton',
    'egret.Tree': 'egret.gui.Tree',
    'egret.UIAsset': 'egret.gui.UIAsset',
    'egret.VSlider': 'egret.gui.VSlider',
    'egret.ViewStack': 'egret.gui.ViewStack',
    'egret.Animation': 'egret.gui.Animation',
    'egret.ButtonBase': 'egret.gui.ButtonBase',
    'egret.DefaultAssetAdapter': 'egret.gui.DefaultAssetAdapter',
    'egret.DefaultSkinAdapter': 'egret.gui.DefaultSkinAdapter',
    'egret.DropDownController': 'egret.gui.DropDownController',
    'egret.DropDownListBase': 'egret.gui.DropDownListBase',
    'egret.GroupBase': 'egret.gui.GroupBase',
    'egret.ItemRenderer': 'egret.gui.ItemRenderer',
    'egret.ListBase': 'egret.gui.ListBase',
    'egret.Range': 'egret.gui.Range',
    'egret.SkinBasicLayout': 'egret.gui.SkinBasicLayout',
    'egret.SliderBase': 'egret.gui.SliderBase',
    'egret.TextBase': 'egret.gui.TextBase',
    'egret.ToggleButtonBase': 'egret.gui.ToggleButtonBase',
    'egret.TrackBase': 'egret.gui.TrackBase',
    'egret.TreeItemRenderer': 'egret.gui.TreeItemRenderer',
    'egret.ClassFactory': 'egret.gui.ClassFactory',
    'egret.IAssetAdapter': 'egret.gui.IAssetAdapter',
    'egret.IContainer': 'egret.gui.IContainer',
    'egret.IDisplayText': 'egret.gui.IDisplayText',
    'egret.IEditableText': 'egret.gui.IEditableText',
    'egret.IFactory': 'egret.gui.IFactory',
    'egret.IInvalidateDisplay': 'egret.gui.IInvalidateDisplay',
    'egret.IInvalidating': 'egret.gui.IInvalidating',
    'egret.ILayoutElement': 'egret.gui.ILayoutElement',
    'egret.ISkin': 'egret.gui.ISkin',
    'egret.ISkinAdapter': 'egret.gui.ISkinAdapter',
    'egret.ISkinnableClient': 'egret.gui.ISkinnableClient',
    'egret.IStateClient': 'egret.gui.IStateClient',
    'egret.IUIComponent': 'egret.gui.IUIComponent',
    'egret.IUIStage': 'egret.gui.IUIStage',
    'egret.IViewStack': 'egret.gui.IViewStack',
    'egret.IViewport': 'egret.gui.IViewport',
    'egret.IVisualElement': 'egret.gui.IVisualElement',
    'egret.IVisualElementContainer': 'egret.gui.IVisualElementContainer',
    'egret.PopUpPosition': 'egret.gui.PopUpPosition',
    'egret.ScrollPolicy': 'egret.gui.ScrollPolicy',
    'egret.UIComponent': 'egret.gui.UIComponent',
    'egret.UIGlobals': 'egret.gui.UIGlobals',
    'egret.UILayer': 'egret.gui.UILayer',
    'egret.UIStage': 'egret.gui.UIStage',
    'egret.CloseEvent': 'egret.gui.CloseEvent',
    'egret.CollectionEvent': 'egret.gui.CollectionEvent',
    'egret.CollectionEventKind': 'egret.gui.CollectionEventKind',
    'egret.ElementExistenceEvent': 'egret.gui.ElementExistenceEvent',
    'egret.IndexChangeEvent': 'egret.gui.IndexChangeEvent',
    'egret.ListEvent': 'egret.gui.ListEvent',
    'egret.MoveEvent': 'egret.gui.MoveEvent',
    'egret.PopUpEvent': 'egret.gui.PopUpEvent',
    'egret.PropertyChangeEvent': 'egret.gui.PropertyChangeEvent',
    'egret.PropertyChangeEventKind': 'egret.gui.PropertyChangeEventKind',
    'egret.RendererExistenceEvent': 'egret.gui.RendererExistenceEvent',
    'egret.ResizeEvent': 'egret.gui.ResizeEvent',
    'egret.SkinPartEvent': 'egret.gui.SkinPartEvent',
    'egret.StateChangeEvent': 'egret.gui.StateChangeEvent',
    'egret.TrackBaseEvent': 'egret.gui.TrackBaseEvent',
    'egret.TreeEvent': 'egret.gui.TreeEvent',
    'egret.UIEvent': 'egret.gui.UIEvent',
    'egret.BasicLayout': 'egret.gui.BasicLayout',
    'egret.ColumnAlign': 'egret.gui.ColumnAlign',
    'egret.HorizontalLayout': 'egret.gui.HorizontalLayout',
    'egret.RowAlign': 'egret.gui.RowAlign',
    'egret.TileLayout': 'egret.gui.TileLayout',
    'egret.TileOrientation': 'egret.gui.TileOrientation',
    'egret.VerticalLayout': 'egret.gui.VerticalLayout',
    'egret.LayoutBase': 'egret.gui.LayoutBase',
    'egret.ILayoutManagerClient': 'egret.gui.ILayoutManagerClient',
    'egret.IPopUpManager': 'egret.gui.IPopUpManager',
    'egret.LayoutManager': 'egret.gui.LayoutManager',
    'egret.PopUpManager': 'egret.gui.PopUpManager',
    'egret.PopUpManagerImpl': 'egret.gui.PopUpManagerImpl',
    'egret.DepthQueue': 'egret.gui.DepthQueue',
    'egret.AddItems': 'egret.gui.AddItems',
    'egret.IOverride': 'egret.gui.IOverride',
    'egret.OverrideBase': 'egret.gui.OverrideBase',
    'egret.SetProperty': 'egret.gui.SetProperty',
    'egret.State': 'egret.gui.State',
    'egret.LayoutUtil': 'egret.gui.LayoutUtil',
    'egret.getScale9Grid': 'egret.gui.getScale9Grid' }

var dragonbones_refactor_1_5_1 = { 'dragonBones.geom': 'dragonBones',
    'dragonBones.events': 'dragonBones',
    'dragonBones.animation': 'dragonBones',
    'dragonBones.objects': 'dragonBones',
    'dragonBones.display': 'dragonBones',
    'dragonBones.textures': 'dragonBones',
    'dragonBones.factorys': 'dragonBones',
    'dragonBones.utils': 'dragonBones',
    'DataParser.parseSkeletonData':'DataParser.parseDragonBonesData'}