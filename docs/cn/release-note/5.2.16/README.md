
## 2D 渲染 - JavaScript 

* 修复 `egret.Timer` 在游戏逻辑出错的情况下，不会终止的问题
* 修复 `egret.setTimeout` 在游戏逻辑出错的情况下，不会终止的问题
* 将某些报错信息由 `alert` 方法改为 `egret.log` 方法
* 完善 EUI `DataGroup` 里的事件处理，增加异常事件报错信息
* 修复 `HttpRequest` 加载错误时，不会抛出 `IO_ERROR` 事件的问题
* 修复 `BitmapText` 里 `letterSpacing` 为负数时，居中计算错误的问题。
