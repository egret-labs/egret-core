# 白鹭引擎 5.2.16 发布日志


---


白鹭引擎在 2018年5月25日 正式发布了 5.2 稳定版本。在 2019年3月18日，我们将发布 5.2.16 稳定版本。

## 2D 渲染 - JavaScript 
* 修复 `egret.Timer` 在游戏逻辑出错的情况下，不会终止的问题
* 修复 `egret.setTimeout` 在游戏逻辑出错的情况下，不会终止的问题
* 将某些报错信息由 `alert` 方法改为 `egret.log` 方法
* 完善 EUI `DataGroup` 里的事件处理，增加异常事件报错信息
* 修复 `HttpRequest` 加载错误时，不会抛出 `IO_ERROR` 事件的问题
* 修复 `BitmapText` 里 `letterSpacing` 为负数时，居中计算错误的问题。
* 增加 `Edge` 和 `IE11` 浏览器上声音的兼容性支持
* 修复 `EUI` 的 `EditableText` 在 `PC` 浏览器里，滚动后还会出现输入框的问题

## 微信小游戏 v1.1.11
* 优化 iOS 平台的性能
* 修复 `egret.Capabilities.os` 返回值错误的问题
* 修复 `egret.Capabilities.language` 返回值错误的问题

## 百度小游戏 v0.1.5
* 优化 `iOS` 平台的性能
* 修复 `egret.Capabilities.isMobile` 返回值错误的问题
