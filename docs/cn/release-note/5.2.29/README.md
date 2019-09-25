# 白鹭引擎 5.2.29 发布日志
白鹭引擎在 2019年9月25日，发布 5.2.29 稳定版本。

本次更新主要解决声音在内存中占用问题。小游戏平台增加了对 `egret.log` 方法的支持。

## 2D 渲染 - JavaScript 
- **[修复]** 修复 RES 模块不能销毁声音的问题
- **[优化]** 优化引擎内销毁声音的逻辑


## 微信小游戏 v1.2.10
- **[新增]** 支持在 `index.html` 里设置 `data-show-log="true"` 后，通过 `egret.log` 方法输出 log 信息
- **[优化]** 声音系统替换为微信的原生 API
- **[优化]** 增加通过调用微信的原生 API 来销毁声音

## QQ小游戏 v0.1.5
- **[新增]** 支持在 `index.html` 里设置 `data-show-log="true"` 后，通过 `egret.log` 方法输出 log 信息
- **[优化]** 优化销毁声音的逻辑

## 百度小游戏 v0.2.8
- **[新增]** 支持在 `index.html` 里设置 `data-show-log="true"` 后，通过 `egret.log` 方法输出 log 信息
- **[优化]** 优化销毁声音的逻辑

## 小米快游戏 v0.2.10
- **[新增]** 支持在 `index.html` 里设置 `data-show-log="true"` 后，通过 `egret.log` 方法输出 log 信息
- **[优化]** 优化销毁声音的逻辑

## OPPO 小游戏 v0.2.7
- **[新增]** 支持在 `index.html` 里设置 `data-show-log="true"` 后，通过 `egret.log` 方法输出 log 信息
- **[优化]** 优化销毁声音的逻辑
- **[优化]** 将 `WebTextuer` 中的 `convertImageToCanvas` 方法，修改为 原生 API

## vivo 小游戏 v0.2.11
- **[新增]** 支持在 `index.html` 里设置 `data-show-log="true"` 后，通过 `egret.log` 方法输出 log 信息
- **[优化]** 优化销毁声音的逻辑
- **[优化]** 将 `WebTextuer` 中的 `convertImageToCanvas` 方法，修改为 原生 API
