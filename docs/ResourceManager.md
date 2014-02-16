理解egret的资源管理机制【施工中，请勿修改】
========================
egret的资源生命周期管理包括以下三个组成部分，资源加载，资源维护，资源释放。

资源加载
----------------------

在Web浏览器上，绝大部分资源都需要进行异步的加载。

* ResourceLoader
ResourceLoader类是egret的资源加载类。他封装了：
不同资源类型的加载实现细节
资源的当前状态
加载成功、失败的回调函数接口
开发者不应该直接调用ResourceLoader，而是通过ResourceHandler进行调用

* ResourceHandler
ResourceHandler是对ResourceLoader的一层封装，是一个抽象基类，负责对加载成功的资源进行处理，如配置文件序列化、图片缓存等

egret封装了底层资源加载的实现细节，对开发者提供了友好的对外访问接口，如下所示
```
var resourceLoader = ns_egret.ResourceLoader.create(url);
resourceLoader.addEventListener(ns_egret.ResourceLoader.LOAD_COMPLETE,callback,this);
resourceLoader.load();
```

需要注意的是，ns_egret.ResourceLoader.create(url)方法如果重复调用，当url一致时，返回的是同一对象，这种方式解决了资源重复加载的问题，并且开发者无需关注实现细节。

当开发者需要加载多个文件时，调用方法如下所示：

var loadingController = new ns_egret.LoadingController();
loadingController.addResource(url1);
loadingController.addResource(url2);
loadingController.addResource(url3);
loadingController.addEventListener(ns_egret.LoadingController.LOAD_COMPLETE,this.onCompleteHandler,this);
loadingController.load();

如果需要添加Loading界面，只需要
var loadingView = new LoadingView();
loadingController.setLoadingView(loadingView);

其中LoadingView需要实现以下三个方法
addToStage();
removeFromStage();
onProgress(current,total);
实现之后，游戏Loading画面就会显示出来。

注意事项:
egret引擎封装解决了资源重复加载问题，假设开发者编写了如下的代码：
loadingController.addResource(url1);
loadingController.addResource(url1);
loadingController.addResource(url1);
loadingController会执行三次自身业务逻辑的加载处理，但是在ResourceLoader这一层，只会发送一次HTTP请求，并分别处理所有的回调函数。
假设另一种情况
开发者开发的一款游戏，游戏一开始有一段20秒剧情，剧情播放完之后展示主场景，主场景有大量资源需要加载，但是播放剧情时不需要加载资源
为了降低主场景加载资源的加载时间，可以前置主场景的加载时机，在播放剧情时就会后台静默加载。

开发者可以编写如下的逻辑：

//播放剧情
playStory(onStoryComplete);
//前置加载主场景资源
var loadingController = createSceneResourceLoadingController();
loadingController.load();

function onStoryComplete(){
    var loadingController = createSceneResourceLoadingController();
    loadingController.addEventListener(ns_egret.LoadingController.LOAD_COMPLETE,this.onCompleteHandler,this);
    loadingController.load();

}

function createSceneResourceLoadingController(){
    var loadingController = new ns_egret.LoadingController();
    loadingController.addResource(url1);
    loadingController.addResource(url2);
    loadingController.addResource(url3);
    loadingController.load();
    return loadingController;
}

无论在onStoryComplete被触发时，场景资源是否加载完成，第二次加载时候都会进行正确的处理。如：假设场景共有10个资源，剧情播放完毕时加载成功了4个，正在加载1个，那么创建场景时候引擎内部只会等待正在加载的资源完成之后，再加载剩余的5个，不会重复加载。
这种设计思路对开发者优化游戏体验带来了非常大的方便。

egret的资源加载主要由四个类组成，ResourceLoader，ResourceHandler，ResourceLoadingController，ResourceLoadingView





资源的维护
---------------------


