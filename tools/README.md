Egret Tools
================================================
Current Version: v0.0.1



简介
-------------------

Egret Tools是用于创建、编译Egret项目，包含一系列命名操作。



如何使用
-------------------------
到对应网站下载

配置全局编译脚本
```
$ cd ${egret_root}/tools
$ npm install -g
```

创建项目
```
$ cd ${egret_workspace}
$ egret c HelloEgret -a | egret c HelloEgret
```
> 同一个工作目录可以有多个游戏项目（共享一个egret引擎）。当创建第一项目时，切记加上 '-a'（同时生成引擎目录），之后的几个都不需要加 '-a'

编译代码
```
$ egret b  同时编译引擎代码和所有的游戏项目代码
$ egret b -e 仅编译引擎代码
$ egret b -g 编译所有的游戏项目代码
$ egret b -g HelloEgret 编译特定的 某个游戏项目（HelloEgret）代码
```


运行项目（如HelloEgret）
> 以浏览器站点形式 查看 ${egret_workspace}/output/HelloEgret/launcher/index.html


其他操作
-------------------------
删除项目
```
$ egret r HelloEgret
```
> 删除 特定游戏项目


