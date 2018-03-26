# 白鹭引擎 5.1.8 发布日志


---


白鹭引擎在 2017年 12 月份正式发布了 5.1 版本。在 2018年3月26日，我们将发布 5.1.8 版本。本次版本是 5.1 版本的一次集中性缺陷修复。



## 2D 渲染 - JavaScript 

* 修复某些情况下设置 alpha 属性失效问题（感谢开发者 zdh082）
* 修复 GlowFilter 在 iOS 设备上显示异常问题
* 修复某些环境下userAgent不正常导致报错问题（感谢开发者 gangzhiwang）

## Facebook Instant Games SDK
* 修复 egretfb.EgretLeaderboardEntry 中 getPlayer 方法返回值类型错误的问题
* 修复分享API兼容问题