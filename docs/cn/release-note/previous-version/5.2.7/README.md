# 白鹭引擎 5.2.7 发布日志


---


白鹭引擎在 2018年5月25日 正式发布了 5.2 稳定版本。在 2018年8月13日，我们将发布 5.2.7 稳定版本。本次版本是 5.2 版本的一次集中性缺陷修复


## 2D 渲染 - JavaScript 

* 修复宽高为0的显示对象设置mask后canvas渲染器报错问题（感谢开发者 周超）
* 修复 Bitmap 设置 fillMode 后没有标脏问题
* 修复 BitmapText 渲染在 runtime 可能报错问题（感谢开发者 nofastfat）

## 命令行

* 增加自动合图插件 TextureMergerPlugin

## AssetsManager

* 修复加载包含相同资源的不同资源组异常问题（感谢开发者 wssznh）
* 修复 RES.ResourceEvent.GROUP_PROGRESS 事件的 resItem 为空问题（感谢开发者 joomecow）
* 修复加载空的资源组导致报错问题（感谢开发者 小叮当）
* RES.destroyRes 支持 force 参数
* 加载器内部停止使用 await，便于调试

## 微信小游戏支持库

微信小游戏支持库请通过 Egret Launcher 将您的项目发布一次微信小游戏的方式进行更新，版本号 1.1.6

* 新增二进制和声音缓存方案
* 修复设置多指触控参数失效问题
* 修复使用文件缓存时图片九宫格参数失效问题
* 修复1.1.5版本资源缓存方案bug（感谢开发者 Lion）