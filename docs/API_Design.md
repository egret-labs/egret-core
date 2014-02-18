egret的API设计理念
====================
egret的API设计理念为，尽可能贴近Flash的API，但是并不会100%镜像，而是在其基础上进行有限度的改进，同时在文档中详细标记出和Flash不一致的地方，方便开发者理解。

API不一致列表
-------------------
以下列表是 egret和flash API 设计不一致的地方，开发者可以通过此文档进行参考

### EventDispatcher.addEventListener
由于JavaScript的this延迟绑定特性，egret中的addEventListener需要传递三个参数，eventName,callback,thisObj，这一点和ActionScript3编写的程序不一致，请开发者务必注意。

### InterativeObject
egret没有 IntrativeObject 基类，所有的显示对象都可以点击，开发者需要重点了解 Bitmap也是可以被点击的，无需在外包装一层Sprite。

### InterativeObject.mouseEnabled / DisplayObjectContainer.mouseChildren
这两个API被移动到了 DisplayObject.touchEnabled 上。
egret中并没有 mouseChildren属性。
和Flash不同，DisplayObject.touchEanbled 的默认值为false。

以上的优化参考Flash Stage3D的Starling框架

### Sprite
egret没有Sprite类，具体原因参见【todo:link】

### BitmapData
egret的BitmapData的名称为Texture，参考Starling框架


