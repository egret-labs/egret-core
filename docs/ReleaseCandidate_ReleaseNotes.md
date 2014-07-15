Egret 1.0 Release Candidate 1 Release Note
===============================

最近更新时间：2014年7月10日

欢迎您使用Egret



## 概述

Egret 1.0 Release Candidate 是 Egret 1.0的第一个发布候选版，在此版本后，Egret 1.0原则上不会再改动 API结构，而是专注于解决现有的问题和优化。感谢所有在 Prerelease 和 Public Beta 阶段所有对 Egret 提出宝贵意见的开发者。

特别鸣谢： 墨麟集团-武汉鱼之乐信息技术有限公司

### 新特性
* 核心显示列表
  * 为 Graphics API 添加 moveTo / curveTo / drawCircle 等方法
  * Graphics解决和Flash表象不一致的一系列问题，如不调用endFill方法就不会绘制等
  * 添加 DisplayObject.getChildByName(name) 方法
  * 添加精确像素碰撞检测


* Egret 项目结构与命令行工具
  * 添加 egret publish 命令，通过封装 Google Closure Compiler 进行代码压缩 
  * 添加自动化生成 ``` game_file_list.js ``` 文件的功能
  * TS文件不再需要声明 ``` ///<reference/> ``` 文件引用节点
  * egret build命令支持对exml文件的编译，直接生成目标js文件。exml是Egret GUI支持的皮肤描述文件。

* Egret Android Support Update 1 ，在这个版本中，开发者可以通过 egret create_cpp 命令创建一个支持 egret 的标准Android工程项，并修复若干问题，[具体列表如下] (https://github.com/egret-labs/egret-android-support/blob/master/ReleaseNote.md)
* Egret iOS Support Alpha，同样可以使用 egret create_app 命令创建，添加了若干新特性，[具体列表如下](https://github.com/egret-labs/egret-ios-support/blob/master/ReleaseNote.md)

### 修复

* 解决在部分三星设备中，当游戏从锁屏状态恢复后，游戏画面卡死的bug
* 解决 egret 安装在包含空格的文件夹内时创建新项目会报错的bug
* 解决 egret create 命令传入绝对路径导致报错的bug
* 解决 GraphicsAPI 在 RenderTexture上渲染失败的BUG
* 解决BitmapText重复修改文字失效的bug
* 解决 ProgressBar设置当前value后立刻调用时会返回错误的bug
* 解决 Group某些情况下添加子项失败的问题
* 解决 RES.getResByUrl()加载位图报错的bug
* 解决 DragonBones 模块中在人物换装时可能层级显示错误的bug
* 修复在Mobile设备上获取StageHeight错误的bug 
* 修复Bitmap对含有透明边界的且来自SpriteSheet的位图绘制不正确的问题
* 解决 Native 方式蒙版失效的问题
* 解决 Native 方式下文本测量宽度获取错误的bug
* 解决设置文本居中后，Native上的文本位置渲染错误的bug


### 改进

* 优化 DisplayObjectContainer.swapChildren() 的性能
* egret.UIAsset 类的构造函数添加一个可选参数 source 
* 改进 egret startserver 命令，使其对开发者更为友好，具体参见 [这里](#tag1)
* 大幅优化引擎主渲染循环 updateTransform 的性能
* 大幅优化引擎 hitTest 的性能
* 修改 将 DisplayObject.cacheAsBitmap() 修改为 DisplayObject.cacheAsBitmap ，以和 Flash Style API 保持一致
* Skin.createChildren()方法的执行时机调整到hostComponent赋值之后
* 优化 DragonBones 模块的性能，在移动设备浏览器中有 200% 左右的性能提升
* UIStage增加autoResize属性
* 命令行工具改为无需声明reference的编译方式
* 增加Profiler具体显示，现在 Profiler 将会在三行 Profiler 信息前分别将其标记为 Draw / Cost / FPS
* 添加 Rectangle.containsPoint 方法

### 重构

* MovieClip类的结构进行了重构，允许开发者对数据格式进行扩展，同时废弃了部分API，目前被废弃的API会向下兼容，但是在 1.0 Final Release 中这些API会被删除,更多细节参见[这里](#tag2)


## 已知问题
* egret publish 命令在特定 windows 系统上会执行失败（命令行缓冲区不足），这个问题会在下个版本中修复


## 旧项目升级迁移事项

为了让命令行工具支持自动生成game_file_list和不用手写reference的功能，我们对项目结构做了部分调整。旧项目请按如下步骤升级以使用新的命令行工具进行编译：

* 重装egret命令行工具
* 使用```egret create {临时项目名}```命令创建一新的模板项目,拷贝其中的launcher文件夹和egretProperties.json文件到旧项目并覆盖。
* 若旧项目的文档类不是GameApp，请编辑egretProperties.json文件，找到```document_class```这一行，将文档类的值```GameApp```改为旧项目的文档类。
* 删除旧项目src目录下的egret.d.ts文件
* 删除所有ts文件内的reference标签，可以使用[这个工具](http://download.egret-labs.org/?id=TsReferenceTool)，拖入文件夹一次性清除。
* 使用```egret build {旧项目名} -e```重新编译项目。注意要加上-e参数才能编译引擎代码。

关于文档类，从这版本起，文档类只在egretProperties.json里配置。命令行工具会自动去修改index.html等页面里的文档类配置。请不要直接修改launcher文件夹下的文件。

关于自动生成```game_file_list.js```的功能。默认情况下，命令行会根据配置的文档类，只把被引用到的类生成到列表里。这里跟Flash的编译一致，若是通过反射的字符串方式获取类名可能会无法生成到列表，请在ts文件内定义一个引用该类的var变量来解决这个问题。若需要屏蔽自动生成功能，采用自定义加载列表。请在旧项目的目录下运行```egret create_manifest```，会生成一个manifest.json文件模板。修改该模板，之后命令行都以这个文件作为列表来源。

关于发布IOS平台原生App，由于```resources```文件夹在IOS平台下是关键字。会导致发布失败。新的模板项目已经把这个文件夹重命名为```resource```。旧项目若需要发布IOS平台，也要重命名这个文件夹。并修改```GameApp```中```RES.loadConfig()```这一行的两个```resources```参数为```resource```


## 部分详细改动日志
<a name="tag1"></a>
### egret startserver 命令优化
* 当端口被占用导致 egret startserver 执行失败时，现在会给开发者提供友好的错误提示，而非 Node.js 内部报错
* egret startserver 命令现在可以通过添加 ``` --port ``` 参数的方式修改 Node.js 服务器的启动端口，例 ``` egret startserver --port 10086 ```
* egret startserver 命令现在可以通过添加 ``` -ip ``` 参数，在打开的浏览器的链接中显示 ip地址而非 http://localhost ，方便开发者更简单的进行移动设备调试或者url链接在局域网环境下的分享 

<a name="tag2"></a>
### MovieClip 重构
在 egret 1.0.0 public beta 版本中，MovieClip是一个具体的实现类，封装了动画渲染、动画帧切换、数据格式解析等所有内容，这虽然使开发者直接使用比较方便，但也导致了无法扩展、很难支持第三方数据格式等问题

在这个版本中，我们着手解决这个问题，现在 MovieClip 只是一个空的基类，具体的实现细节逻辑委托给了 DefaultMovieClipDelegate 这个类去实现，并保持了 MovieClip 对外接口不变。

在egret的未来规划中，DragonBones、StarlingSWF for Egret 以及其他开发者自己实现的其他动画播放方式，都可以通过实现一个 MovieClipDelegate 来统一起来，最终暴露给开发者的接口都是 MovieClip.gotoAndPlay() 等，例如：

```

var movieclip1 = new MovieClip(new DefaultMovieClipDelegate(texture,data));
var movieclip2 = new MovieClip(new DragonBonesMovieClipDelegate(texture,skeletonData,textureData));
var movieclip3 = new MovieClip(new StarlingSwfMovieClipDelegate(texture,data));

this.addChild(movieclip1);
this.addChild(movieclip2);
this.addChild(movieclip3);

movieclip1.gotoAndStop("run");
movieclip2.gotoAndPlay("jump");
movieclip3.stop();


```




