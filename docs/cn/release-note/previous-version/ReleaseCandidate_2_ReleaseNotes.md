Egret 1.0 Release Candidate 2 Release Note
===============================

最近更新时间：2014年7月25日

欢迎您使用Egret



## 概述

Egret 1.0 Release Candidate 2 是 Egret 1.0的第二个发布候选版，专注于提高引擎的稳定性，易用性。

特别鸣谢： 

* 墨麟集团-武汉鱼之乐信息技术有限公司
* 南京泥巴怪网络科技有限公司

## 更新内容

#### 核心显示列表
  * WebGL 支持（Beta）
  * 添加 egret.setTimeout函数和 egret.clearTimeout函数
  * 修复第三方资源打包工具对素材进行裁边时，解析错误的BUG，并更新了 ShoeBox / TexturePacker 的Egret插件的导出格式
  * 修复 Graphics API 在特定情况下，连续调用 lineTo() 和 flash的绘制结果不一样的BUG
  * 修复在另一部分三星手机中，当游戏从锁屏状态恢复后，游戏画面卡死的bug
  * 修复在一台设备同时拥有鼠标事件和触摸事件时（如触屏笔记本 Windows 8 系统），鼠标事件无法响应的bug
  * 当BitmapText.text 中存在 fnt 配置文件中不存在的字形时，目前会提示一个 Warning，而非给出一个难以理解的错误信息
  * 优化了BitmapText 性能

#### GUI体系
 * 修复RadioButtonGroup排序函数的作用域不正确导致递归出错
 * 修复ProgressBar无法执行缓动动画的问题


#### Egret 项目结构与命令行工具
  * 集成 TypeScriptCompiler，开发者现在在安装 Egret 时无需手动下载 TypeScript 了
  * 增加 egret info 命令，可以查看当前 egret的版本和安装路径信息
  * egret build 增加 -sourcemap 参数生成 js.map 文件，支持在TypeScript中进行断点调试
  * 优化 egret build 命令，现在编译速度会和之前比提升最高 20%，大型项目更加明显
  * 修复 egret publish 在 windows 环境下报错的bug
  * 修复 egret startserver 在当前项目路径下直接运行（不输入项目名）会报错的bug
  * 修复了 exml 编译器的若干问题,并进一步提高稳定性


