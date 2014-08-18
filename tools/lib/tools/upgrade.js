/**
 * Created by apple on 14-8-5.
 */


var file = require("../core/file.js");
var param = require("../core/params_analyze.js");
var code_util = require("../core/code_util.js");
var path = require("path");
var globals = require("../core/globals.js");
var projectConfig = require("../core/projectConfig.js")


var currDir;
var args
function run(dir, a, opts) {
    currDir = dir;
    args = a;
    upgradeTo_1_0_3();
    upgradeTo_1_0_4();

}

function upgradeTo_1_0_3() {
    currDir = globals.joinEgretDir(currDir, args[0]);
    var extensionDir = path.join(currDir, "src");
    var list = file.search(extensionDir, "ts");
    list.forEach(fixSingleTypeScriptFile);
}

function upgradeTo_1_0_4() {
    //新的publish改之后，需要把base给删掉
    var releasePath = currDir + "/launcher/release.html";
    var txt = file.read(releasePath);
    txt = txt.replace("<base href=\"../\"/>", "");
    file.save(releasePath, txt);
    file.remove(path.join(currDir,"libs/egret.d.ts"));
    var releasePath = currDir + "/launcher/index.html";
    var txt = file.read(releasePath);
    txt = txt.replace("\"bin-debug/lib/\"", "\"libs/core/\"")
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
    ]
    projectConfig.save();
}

function getClassList(item) {
    var basename = path.basename(item)
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