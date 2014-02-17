理解Egret的显示列表【施工中】
=================================
显示列表类结构
-----------------


使用egret开发的应用都会有被称之为“显示列表”的层次。egret的显示列表的概念和API设计模仿了Flash ActionScript3.0的显示列表架构，如下图所示：
【todo:图】

如图所示，绝大部分的egret显示对象都会包含在Stage中，只有两个对象例外，StageText和StageView。【todo:这两个API的名称可能会修改】


显示对象分为以下一个或多个组：

Stage
Stage 是包括显示对象的基础容器。每个应用程序都有一个 Stage 对象。Stage是顶级容器，位于显示列表层次的顶部：
可以通过 MainContext.instance.stage 访问到Stage实力
【重要】需要注意的是，和Flash API不同，egret并不提供 DisplayObject.stage属性，egret团队认为，Flash的DisplayObject.stage属性并非能100%获取到Stage对象（取决于当前显示对象是否在舞台上），这个设计会让开发者困惑，并且容易出现访问Stage为null的情况。DisplayObject.stage的另一个用法是判断当前显示对象是否在舞台上，在egret中，使用 DisplayObject.isRunning来判断

DisplayObject
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

同时会提供以下公开方法
* 缓存 DisplayObject.cache()
* 显示对象边界 DisplayObject.getBounds() / DisplayObject.setBounds()
* 坐标系转换 DisplayObject.localToGlobal() / DisplayObject.globalToLocal()

**由于JavaScript没有自定义命名空间和private关键词，请开发者务必不要调用非API文档中提供的属性和方法**
DisplayObjectContainer
DisplayObjectContainer继承自DisplayObject，这些显示对象除了有自己的可视表示形式之外，还可以包含也是显示对象的子对象。DisplayObjectContainer会包含以下属性
* 获取子节点数量 DisplayObjectContainer.numChildren
同时会提供以下公开方法
* 添加、移除对象 DisplayObject.addChild(),DisplayObject.removeChild()
* 获取显示对象 DisplayObject.getChildAt()
在传统Flash开发中，由于DisplayObjectContainer被设计为了一个抽象类，而egret开发者没有这些限制，无需使用Sprite类来完成DisplayObjectContainer就可以实现的功能。
在Flash中，Sprite和DisplayObjectContainer相比，多了两个功能，其一是 Sprite.startDrag / stopDrag 方法，这个功能egret将在DragManager里实现，另一个是 Sprite.graphic，这个egret会通过Graphic类来实现。基于以上的原因，**egret并不会提供Sprite类，开发者应使用DisplayObjectContainer来代替**







事件流机制
-----------------
