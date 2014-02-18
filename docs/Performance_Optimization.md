egret性能优化指南
==================================

egret性能优化主要有两个主要部分，JavaScript代码性能优化和运行时ContextAPI优化。

JavaScript代码优化
------------------------
开发者首先需要了解JavaScript基础优化知识，推荐内容：
* [JavaScript秘密花园][1]
* 《高性能JavaScript》, Nicholas C. Zakas ,  电子工业出版社

### 核心概念
JavaScript性能优化主要包括瞬时开销和整体开销两部分
#### 瞬时开销
一个用户体验良好的应用，应该遵循**100毫秒准则**，即**用户的任何操作，都应在100毫秒内给予反馈**，所以一个性能优秀的游戏，应该在任何时候都不会有超过100毫秒的UI线程卡死。

导致UI线程卡死主要由两个原因，执行过多的JavaScript逻辑，触发了垃圾回收
###### 避免过大的JavaScript调用










[1]: http://sanshi.me/articles/JavaScript-Garden-CN/html/index.html        "JavaScript秘密花园"
