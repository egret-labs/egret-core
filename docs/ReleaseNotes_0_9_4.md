Egret Release Notes
===============================

最近更新时间：2014年5月12日

欢迎您使用Egret

### Egret 0.9.4 Release Note ( Prerelease )

#### 概述
Egret 0.9.4 主要包括以下优化
* 大幅度提升编译速度，创建新项目的编译速度提升约30倍
* 取消了对tsc编译器的错误忽略处理
* 大幅度提升渲染循环中 updateTransform() 的性能，整体性能在移动设备上提升30% ~ 200%
* 添加 Graphics API 和 Shape 类



#### 向下兼容性变更

* 由于Egret取消了对tsc编译器的错误忽略屏蔽，旧项目的游戏代码中可能会抛出一些在之前项目中被屏蔽掉的错误
* 初始化项目模板进行更改，旧项目请修改 ```launcher/egret_loader.js``` 文件

```
   // context.touchContext = new ns_egret.TouchContext(canvas);
   // 修改为
    context.touchContext = new ns_egret.HTML5TouchContext(canvas);

```