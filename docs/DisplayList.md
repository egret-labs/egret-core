理解Egret的显示列表【施工中】
=================================
显示列表类结构
-----------------


使用egret开发的应用都会有被称之为“显示列表”的层次。egret的显示列表的概念和API设计模仿了Flash ActionScript3.0的显示列表架构，如下图所示：
【todo:图】

如图所示，绝大部分的egret显示对象都会包含在Stage中，只有两个对象例外，StageText和StageView。【todo:这两个API的名称可能会修改】


显示对象分为以下一个或多个组：

### Stage
Stage 是包括显示对象的基础容器。每个应用程序都有一个 Stage 对象。Stage是顶级容器，位于显示列表层次的顶部：
可以通过 MainContext.instance.stage 访问到Stage实力
【重要】需要注意的是，和Flash API不同，egret并不提供 DisplayObject.stage属性，egret团队认为，Flash的DisplayObject.stage属性并非能100%获取到Stage对象（取决于当前显示对象是否在舞台上），这个设计会让开发者困惑，并且容易出现访问Stage为null的情况。DisplayObject.stage的另一个用法是判断当前显示对象是否在舞台上，在egret中，使用 DisplayObject.isRunning来判断

### DisplayObject
DisplayObject是egret显示对象的基类。任何一个显示对象都会有如下的属性
* 位置 DisplayObject.x,DisplayObject.y
* 旋转 DisplayObject.rotation
* 缩放 DisplayObject.scaleX,DisplayObject.scaleY
* 斜切 DisplayObject.skewX,DisplayObject.skewY
* 锚点 DisplayObject.anchorX,DisplayObject.anchorY
* 透明度 DisplayObject.alpha
* 混合模式 DisplayObject.blendMode
* 蒙版 DisplayObject.mask
* 父容器 DisplayObject.parent
* 是否可以交互 DisplayObject.touchEnabled


示例代码
```
var display = new ns_egret.DisplayObject();
display.x = display.y = 100;
display.rotation = 90;
display.alpha = .5;
display.mask = new ns_egret.Rectangle(0,0,100,100);
display.touchEnabled = true;
```

同时会提供以下公开方法
* 缓存 DisplayObject.cache()
* 显示对象边界 DisplayObject.getBounds() / DisplayObject.setBounds()
* 坐标系转换 DisplayObject.localToGlobal() / DisplayObject.globalToLocal()

**由于JavaScript没有自定义命名空间和private关键词，请开发者务必不要调用非API文档中提供的属性和方法**
### DisplayObjectContainer
DisplayObjectContainer继承自DisplayObject，这些显示对象除了有自己的可视表示形式之外，还可以包含也是显示对象的子对象。DisplayObjectContainer会包含以下属性
* 获取子节点数量 DisplayObjectContainer.numChildren
同时会提供以下公开方法
* 添加、移除对象 DisplayObject.addChild(),DisplayObject.removeChild()
* 获取显示对象 DisplayObject.getChildAt()
在传统Flash开发中，由于DisplayObjectContainer被设计为了一个抽象类，而egret开发者没有这些限制，无需使用Sprite类来完成DisplayObjectContainer就可以实现的功能。
在Flash中，Sprite和DisplayObjectContainer相比，多了两个功能，其一是 Sprite.startDrag / stopDrag 方法，这个功能egret将在DragManager里实现，另一个是 Sprite.graphic，这个egret会通过Graphic类来实现。基于以上的原因，**egret并不会提供Sprite类，开发者应使用DisplayObjectContainer来代替**

示例代码
```
var child = new ns_egret.DisplayObject();
var container = new ns_egret.DisplayObjectContainer();
container.addChild(child);
```

### Bitmap
Bitmap 类继承自Displayobject,表示用于表示位图图像的显示对象。
利用 Bitmap() 构造函数，可以创建包含对 Texture 对象的引用的 Bitmap 对象。创建了 Bitmap 对象后，使用父 DisplayObjectContainer 实例的 addChild() 方法将位图放在显示列表中。
**和Flash不一样的是，由于 touchEnabled是DisplayObject的属性，所以Bitmap同样可以添加鼠标/触摸事件侦听器**
Bitmap中的图像从Texture类中获取。

### Texture
Texture类并不是显示对象，而是一个纯资源对象，非常类似Flash中的BitmapData。
【todo:为什么不起名为BitmapData】
和Flash一样，多个Bitmap 对象可以共享其 Texture 引用，与转换属性或旋转属性无关。由于能够创建引用相同 BitmapData 对象的多个 Bitmap 对象，因此，多个显示对象可以使用相同的复杂 Texture 对象，而不会因为每个显示对象实例使用一个 Texture 对象而产生内存开销。

显示坐标系
--------------------
//todo:这里改为StageDelegate的类介绍可能更好
egret的坐标系参考Flash,以左上角为(0,0)点。在游戏初始化时，需要通过以下函数调用设置用户坐标系

```
var stageDelegate = ns_egret.StageDelegate.getInstance();
stageDelegate.setResolutionPolicy(2);//todo，这里api设计需要修改
var width = window.innerWidth;
var height = window.innerHeight;
stageDelegate.setFrameSize(width,height);
stageDelegate.setDesignSize(480,800,2);
```
上述代码片段会在egret的新项目创建脚本中自动生成。StageDelegate.setFrameSize()方法是设置游戏的**真实尺寸**，StageDelegate.setDesignSize()是设置游戏的**设计尺寸**。
####真实尺寸
####设计尺寸



事件流机制
-----------------

egret的事件流机制设计思想与FlashAPI一致，分为



