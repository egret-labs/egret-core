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
    "egret/context/renderer/HTML5CanvasRenderer.js",
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
    "egret/context/sound/HTML5SoundContext.js",

    //扩展
    //tileMap start
    "extension/tilemap/TMXTileMap.js",
    "extension/tilemap/TMXLayer.js",
    "extension/tilemap/TMXConst.js",
    "extension/tilemap/TMXMapInfo.js",
    //tileMap end
    "extension/gui/component/Constant.js",
    "extension/gui/component/TabView.js",
    "extension/gui/component/SimpleButton.js",
    "extension/gui/component/ScrollView.js",
    "extension/gui/component/TableView.js",
    "extension/gui/component/ProgressBar.js",
    "extension/gui/component/DynamicBitmap.js",
    "extension/dragonbones/dragonBones.js",
    "extension/dragonbones/DragonBonesEgretBridge.js",
    "jslib/DEBUG.js",
    "jslib/box2d.js",
    "jslib/NumberUtils.js"
]




if (true) {//浏览器
    temp.push("egret/context/devices/HTML5DeviceContext.js");
    temp.push("egret/context/renderer/NativeRendererContext.js");
}
else {
    temp.push("egret/context/devices/NativeDeviceContext.js");
    temp.push("egret/context/renderer/NativeRendererContext.js");
}


jsFileList = temp;
egret_file_list = temp;




var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};