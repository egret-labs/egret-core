var temp = [
	"egret/core/HashObject.js",
    "egret/utils/Recycler.js",
    "egret/events/Event.js",
    "egret/events/TouchEvent.js",
    "egret/events/TimerEvent.js",
    "egret/events/EventPhase.js",
    "egret/events/EventDispatcher.js",
    "egret/core/MainContext.js",
    "egret/core/Profiler.js",
    "egret/core/Ticker.js",
    "egret/core/HorizontalAlign.js",
    "egret/core/VerticalAlign.js",
    "egret/utils/Timer.js",
    "egret/utils/getQualifiedClassName.js",
    "egret/utils/toColorString.js",
    "egret/geom/Matrix.js",
    "egret/geom/Point.js",
    "egret/geom/Rectangle.js",
    "egret/core/Logger.js",
    "egret/core/StageDelegate.js",
    "egret/core/RenderFilter.js",
    "egret/display/DisplayObject.js",
    "egret/display/DisplayObjectContainer.js",
    "egret/display/Stage.js",
    "egret/display/Bitmap.js",
    "egret/text/BitmapText.js",
    "egret/display/Shape.js",
    "egret/text/TextField.js",
    "egret/display/SpriteSheet.js",
    "egret/text/TextInput.js",
    "egret/display/MovieClip.js",
    "egret/context/display/StageText.js",
    "egret/context/renderer/RendererContext.js",

	"egret/interactive/InteractionMode.js",
    "egret/interactive/TouchContext.js",
    "egret/resource/ResourceLoader.js",
    "egret/resource/LoadingController.js",
    "egret/texture/Texture.js",
    "egret/texture/TextureCache.js",
    "egret/context/net/NetContext.js",
    "egret/context/net/HTML5NetContext.js",
	"egret/display/ScaleBitmap.js",
    //utils start
    "jslib/ZipUtils.js",
    "jslib/base64.js",
    "jslib/gzip.js",
    "jslib/zlib.min.js",
    "egret/utils/SAXParser.js",
    "egret/utils/Browser.js",
    "egret/utils/XML.js",
    //utils end
    //tween start
    "egret/tween/Tween.js",
    "egret/tween/Ease.js",
    //tween end
    "egret/context/sound/SoundContext.js",


    //扩展
    //tileMap start
    "extension/tilemap/TMXTileMap.js",
    "extension/tilemap/TMXLayer.js",
    "extension/tilemap/TMXConst.js",
    "extension/tilemap/TMXMapInfo.js",
    //tileMap end


    //GUI start
    "extension/gui/collections/ArrayCollection.js",
    "extension/gui/managers/LayoutManager.js",
    "extension/gui/managers/layoutClass/DepthQueue.js",
    "extension/gui/core/UIGlobals.js",
    "extension/gui/core/UIComponent.js",
    "extension/gui/core/PopUpPosition.js",
    "extension/gui/core/NavigationUnit.js",
    "extension/gui/core/ScrollPolicy.js",
    "extension/gui/core/ClassFactory.js",
    "extension/gui/core/IContainer.js",
    "extension/gui/core/IVisualElementContainer.js",
    "extension/gui/states/OverrideBase.js",
    "extension/gui/states/AddItems.js",
    "extension/gui/states/SetProperty.js",
    "extension/gui/states/State.js",
    "extension/gui/states/StateClientHelper.js",
    "extension/gui/components/UIAsset.js",
    "extension/gui/components/SkinnableComponent.js",
    "extension/gui/components/supportClasses/DefaultSkinAdapter.js",
    "extension/gui/components/supportClasses/SkinBasicLayout.js",
    "extension/gui/components/supportClasses/ButtonBase.js",
    "extension/gui/components/supportClasses/TextBase.js",
    "extension/gui/components/supportClasses/GroupBase.js",
    "extension/gui/components/supportClasses/ItemRenderer.js",
    "extension/gui/components/supportClasses/Range.js",
    "extension/gui/components/supportClasses/Animation.js",
    "extension/gui/components/Label.js",
    "extension/gui/components/Button.js",
    "extension/gui/components/Group.js",
    "extension/gui/components/Skin.js",
    "extension/gui/components/DataGroup.js",
    "extension/gui/components/SkinnableContainer.js",
    "extension/gui/components/Panel.js",
    "extension/gui/components/ProgressBar.js",
    "extension/gui/components/ProgressBarDirection.js",


    "extension/gui/events/UIEvent.js",
    "extension/gui/events/PropertyChangeEvent.js",
    "extension/gui/events/PropertyChangeEventKind.js",
    "extension/gui/events/MoveEvent.js",
    "extension/gui/events/ResizeEvent.js",
    "extension/gui/events/SkinPartEvent.js",
    "extension/gui/events/CloseEvent.js",
    "extension/gui/events/CollectionEvent.js",
    "extension/gui/events/CollectionEventKind.js",
    "extension/gui/events/ElementExistenceEvent.js",
    "extension/gui/events/IndexChangeEvent.js",
    "extension/gui/events/ListEvent.js",
    "extension/gui/events/PopUpEvent.js",
    "extension/gui/events/RendererExistenceEvent.js",
    "extension/gui/events/StateChangeEvent.js",
    "extension/gui/events/TrackBaseEvent.js",
    "extension/gui/events/TreeEvent.js",
    "extension/gui/layouts/supportClasses/LayoutBase.js",
    "extension/gui/layouts/BasicLayout.js",
    "extension/gui/layouts/ColumnAlign.js",
    "extension/gui/layouts/RowAlign.js",
    "extension/gui/layouts/TileOrientation.js",
    "extension/gui/layouts/VerticalLayout.js",
    "extension/gui/layouts/HorizontalLayout.js",
    "extension/gui/layouts/TileLayout.js",
    "extension/gui/managers/SystemContainer.js",
    "extension/gui/managers/SystemManager.js",
    "extension/gui/managers/impl/PopUpManagerImpl.js",
    "extension/gui/managers/PopUpManager.js",
    //GUI end
//    "extension/gui/component/DynamicBitmap.js",
    "extension/dragonbones/dragonBones.js",
    "extension/dragonbones/DragonBonesEgretBridge.js",
    "jslib/DEBUG.js",
    "jslib/box2d.js",
    "jslib/NumberUtils.js"
]


var context_list;

if (true) {//浏览器

    context_list = [
        "egret/context/devices/HTML5DeviceContext.js",
        "egret/context/renderer/HTML5CanvasRenderer.js",
        "egret/context/sound/HTML5SoundContext.js"

    ]
}
else {
    context_list = [
        "egret/context/devices/NativeDeviceContext.js",
        "egret/context/renderer/NativeRendererContext.js"
    ]
}


egret_file_list = temp.concat(context_list);




var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    if (!b){
        console.log(d.toString() + "extends Error");
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};