Egret Command Line Tools
================================================
Current Version: 0.9.2



简介
-------------------

Egret Command Line Tools简称简称Egret CLT，是用于创建、编译Egret项目，包含一系列命名操作的脚本集合。

Egret 0.9.2废弃了之前分散的脚本执行方式，改为将一个脚本作为入口，集中调用其他脚本。



如何使用
------------------------

配置全局编译脚本
```
$ cd ${egret_root}/tools // ${egret_root}指下载后本地的egret文件夹
$ npm install -g
```

> 如果上述命令执行失败，请先查看系统当前用户是否有管理员权限

创建项目
```
$ cd ${egret_workspace} // ${egret_workspace}指你的工作目录，注意，此目录请务必可以被你的WebServer访问到
$ egret c HelloEgret -e ${egret_root}/src   生成引擎项目和游戏项目，创建第一个项目时使用
$ egret c HelloEgret                        仅生成游戏项目，非第一项目时使用
```
> 综上所述，同一个工作目录下可以创建多个游戏项目，并共享同一份egret代码库。

编译代码
```
$ egret b  同时编译引擎代码和所有的游戏项目代码
$ egret b -e 仅编译引擎代码
$ egret b -g 编译所有的游戏项目代码
$ egret b -g HelloEgret 编译特定的 某个游戏项目（HelloEgret）代码
```

项目结构
```
egret_workspace
  |-- engine //引擎源代码目录（src）
  |-- your_project   //游戏逻辑目录
        |-- src //游戏代码目录
        |-- assets //游戏资源目录
        |-- launcher //游戏入口的代码目录
  |-- your_project_2
  |-- your_project_3
  |-- output //最终发布目录，由assets、launcher、src和engine通过脚本编译或拷贝至此目录
        |-- your_project
              |-- launcher/index.html 最终发布入口
        |-- your_project_2
        |-- your_project_3
```


运行项目（如HelloEgret）
> 以浏览器站点形式 查看 http://${your_website_localhost}/${egret_workspace}/output/HelloEgret/launcher/index.html


其他操作
-------------------------
删除项目
```
$ egret r HelloEgret
```
> 删除 特定游戏项目


