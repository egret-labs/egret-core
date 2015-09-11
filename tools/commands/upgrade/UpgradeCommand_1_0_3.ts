/// <reference path="../../lib/types.d.ts" />

//import globals = require("../../Globals");
//import params = require("../../ParamsParser");
import file = require('../../lib/FileUtil');
//import config = require('../../lib/ProjectConfig');

class UpgradeCommand_1_0_3 implements egret.Command {
    execute():number {
        this.upgradeTo_1_0_3();
        return 0;
    }

    private upgradeTo_1_0_3() {
        var extensionDir = file.joinPath(egret.args.projectDir, "src");
        var list = file.search(extensionDir, "ts");
        list.forEach(this.fixSingleTypeScriptFile.bind(this));
    }

    private fixSingleTypeScriptFile(item) {

        var code_util = require("../../lib/core/code_util.js");

        var content = file.read(item);
        for (var key in this.gui_refactor_1_0_3) {

            var value = this.gui_refactor_1_0_3[key];

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

    private gui_refactor_1_0_3 = {
        'egret.ArrayCollection': 'egret.gui.ArrayCollection',
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
        'egret.getScale9Grid': 'egret.gui.getScale9Grid'
    }
}

export = UpgradeCommand_1_0_3;