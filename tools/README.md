Egret Command Line Tools
================================================
Current Version: 0.9.4



简介
-------------------

Egret Command Line Tools简称简称Egret CLT，是用于创建、编译Egret项目，包含一系列命名操作的脚本集合。

Egret 0.9.2废弃了之前分散的脚本执行方式，改为将一个脚本作为入口，集中调用其他脚本。

Egret 0.9.3在听取了众位参与了Prerelease的开发者的反馈之后对 Egret CLT进行了进一步的优化。

Egret 0.9.4大幅度提升了引擎的编译项目（ 30倍发布速度提升 ），同时进一步优化了 Egret CLT的安装过程，使其对开发者更为友好



如何使用Egret Command Line Tools创建新项目
------------------------

#### 步骤一：下载并安装 Node.js

#### 步骤一：下载并安装 Egret
将Egret下载并解压至操作系统中的任意位置，启动一个命令行终端，在该目录下下输入
``` npm install -g ```
> 如果上述命令执行失败，请先查看系统当前用户是否有管理员权限


#### 步骤二：创建新项目
在系统的任意目录下执行以下脚本
``` egret c HelloEgret ```

#### 步骤三：运行项目
执行以下脚本
``` egret startserver HelloEgret ```
该脚本会在当前目录下启动一个HTTP Server（默认端口3000），并打开默认浏览器运行项目


#### 项目结构
上述脚本执行成功后，游戏项目的结构如下所示

```

system_global_node_module    // 操作系统的全局nodejs安装目录
  |-- egret   // 安装后的egret项目


workspace    // egret
  |-- your_project  // 游戏项目
        |-- src // 游戏代码目录
        |-- assets // 游戏资源目录
        |-- launcher // 游戏入口
              |-- index.html 启动文件
        |-- bin-debug // 编译后的代码目录
  |-- your_project_2
  |-- your_project_3


```

