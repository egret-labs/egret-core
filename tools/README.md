Egret Command Line Tools
================================================
Current Version: 0.9.3



简介
-------------------

Egret Command Line Tools简称简称Egret CLT，是用于创建、编译Egret项目，包含一系列命名操作的脚本集合。

Egret 0.9.2废弃了之前分散的脚本执行方式，改为将一个脚本作为入口，集中调用其他脚本。

Egret 0.9.3在听取了众位参与了Prerelease的开发者的反馈之后对 Egret CLT进行了进一步的优化。



如何使用Egret Command Line Tools创建新项目
------------------------

#### 步骤一：下载及配置环境变量
将Egret下载并解压至操作系统中的任意位置，并修改操作系统的环境变量，将 EGRET_PATH 赋值为Egret文件夹的路径

执行以下脚本，安装egret

```
$ npm install {EGRET_PATH}/tools -g
```
> 如果上述命令执行失败，请先查看系统当前用户是否有管理员权限





#### 步骤二：创建egret工作空间

在本机WebServer可以访问到的位置创建一个新的文件夹，该文件夹在下文被称为 {egret_workspace}

如果您使用WebStorm作为开发环境，请以 {egret_workspace} 目录作为Project目录


#### 步骤三：创建新项目
```
$ cd {egret_workspace} 
$ egret c HelloEgret    #创建新项目HelloEgret，并将Egret/src拷贝至同级目录下
```
> 综上所述，同一个工作目录下可以创建多个游戏项目，并共享同一份egret代码库。

#### 步骤四：编译代码
```
$ egret b HelloEgret 
```


#### 步骤五：运行项目（如HelloEgret）
打开浏览器，输入 http://${your_website_localhost}/${egret_workspace}/output/HelloEgret/launcher/index.html
> 注意url中存在output文件夹，请勿疏忽




#### 项目结构
上述脚本执行成功后，游戏项目的结构如下所示
```
egret_workspace
  |-- egret //引擎目录
        |-- src 引擎代码目录
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


其他操作
-------------------------
删除项目
```
$ egret r HelloEgret
```
> 删除 特定游戏项目


