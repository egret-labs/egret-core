# 白鹭引擎 5.1.9 发布日志


---


白鹭引擎在 2017年 12 月份正式发布了 5.1 版本。在 2018年4月4日，我们将发布 5.1.9 版本。本次版本是 5.1 版本的一次集中性缺陷修复。



## 2D 渲染 - JavaScript 

* 修复显示对象设置 matrix 属性后，skew 属性更新不正确问题（感谢开发者 eos3tion）
* 修复 egret startserver 启动的服务器可以读取项目外文件问题（感谢开发者 ChiChou）

## Facebook Instant Games SDK
由于最近 Facebook 隐私政策改变，原有的 Instant Games SDK 无法继续使用，老版本的 Egret 项目需要做一定修改。详细信息请看 egret-facebook 里的文档

## DragonBones - JavaScript
* 修复极速格式可能报错问题（感谢开发者 小叮当）

## 第三方库
* 修复粒子库编译报错问题