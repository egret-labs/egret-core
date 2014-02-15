理解egret的资源管理机制
========================
egret的资源生命周期管理包括以下三个组成部分，资源的加载，资源的维护，资源的释放。

资源加载
----------------------

egret的资源加载主要由四个类组成，ResourceLoader，ResourceHandler，ResourceLoadingController，ResourceLoadingView

* ResourceLoader类是egret的资源加载类。他封装了：
** 不同资源类型的加载实现细节
** 资源的当前状态
** 加载成功、失败的回调函数接口
* 开发者不应该直接调用ResourceLoader，而是通过ResourceHandler进行调用

* ResourceHandler是对ResourceLoader的一层封装，是一个抽象基类，负责对加载成功的资源进行处理，如配置文件序列化、图片缓存等
* 



资源的维护
---------------------


