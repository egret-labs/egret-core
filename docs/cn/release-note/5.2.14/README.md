# 白鹭引擎 5.2.14 发布日志


---


白鹭引擎在 2018年5月25日 正式发布了 5.2 稳定版本。在 2019年2月19日，我们将发布 5.2.14 稳定版本。


## 2D 渲染 - JavaScript 

* 优化主循环逻辑，当游戏代码出现异常时，屏幕不再黑屏，游戏可以继续带错运行。
* 生成 manifest 依赖文件时，在路径里增加 `./` 开头
* HttpRequest 支持在 Android 上通过 WebView 加载本地文件
* 修复 BitmapText 在带有 offset 值的情况下，位置计算错误的问题。

## Native

* 修改了 native 上 BitmapData 引用 c++ 对象的方式，解决了开启原生渲染加速时部分纹理显存不会释放的问题。上述修改需配合 egret Native 0.1.15 以上版本使用。

## 微信小游戏

* 修复创建位图纹理时，会使用双份显存的问题
* 修复 context.measureText 为 null 时出现异常的问题。

## 微信 Html5
* 在 iOS12 的微信里，某些情况下，在弹出的软键盘回收时，顶起来的游戏页面不会落下来。该问题引擎暂不处理，等待微信修复。您可以在 `index.html` 的 `<script>` 标签里增加一个监听来处理该异常：

```
document.body.addEventListener("blur",function(){
    window.scrollTo(0,0);
},true);
```
