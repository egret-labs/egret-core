理解egret的舞台
==========================
egret的舞台类Stage是一个显示对象，是游戏最根层的容器，其主要的属性通过StageDelegate进行设置。

egret的坐标系
--------------------------
egret和flash一样，采用左上角作为世界坐标系（0,0)点

egret的游戏尺寸
--------------------------
egret通过 stageDelegate.setFrameSize( clientWidth , clientHeight ) 来指定游戏尺寸。
在移动设备中，这个值是移动设备的屏幕像素分辨率。
**在不同的移动设备中，此值是不一样的。**

egret的坐标系尺寸
-------------------------
egret通过 stageDelegate.setDesignSize ( designWidth , designHeight ) 来指定游戏的坐标系大小。
egret建议开发者将此值设置为 480 * 800。
**在不同的设备中，此值是恒定的。**
