egret的架构设计
==========================


egret的引擎由两部分组成：核心运行时+引擎脚本。

跨平台：
--------------
在浏览器端，egret使用支持HTML5的浏览器为核心运行时
在原生应用端，egret实现了一个最小化的运行时，主要包括渲染机制 OpenGL ES、封装一致的NativeAPI和JavaScript脚本解析引擎SpiderMonkey三部分组成。

### why not V8 ?

Chrome的V8引擎虽然在多数性能测试中超过SpiderMonkey,但是由于V8的静态编译库体积过大，考虑到移动设备app应用大小问题，egret最终还是决定采用SpiderMonkey。
egret的Native运行时的设计思想为极简设计，引擎逻辑并不会用C/C++等Native语言重新实现，而是复用 JavaScript引擎脚本

### why not C++ ?
之所以egret不会使用C++等Native语言重新实现一套运行时，是基于以下考虑
1、引擎核心代码需要两套甚至更多套代码实现，导致了人力成本成倍提升
2、为了保证业务逻辑代码在两套代码构建的两种运行时的行为的表现完全一致，会消耗大量的精力
3、由于业务逻辑代码需要不断和Native代码进行通讯，性能未必有完全交由JavaScript引擎托管的运行时性能高
4、由于Native语言绝大多数为强类型语言，为了保证行为一致性，会限制JavaScript版引擎的灵活性
5、对开发者自身的能力要求更高，需要开发者了解C++的逻辑和调试工具
6、对象映射模型和函数调用模型的缺点【todo】

### why JavaScript ?
1、在浏览器端开发，在真机可以100%行为一致，无需修改任何代码
2、JavaScript的语法和ActionScript3.0遵循同样的语法规范（ ECMAScript )，方便Flash开发者转型
3、调试工具成熟，各种第三方资料丰富【todo:link 使用Chrome调试egret应用】


### 松耦合架构
分离显示列表、用户交互、渲染等模块

开发者需要了解
-----------------
1、JavaScript知识和浏览器调试经验
2、前端开发知识， Flash / cocos2d-x / Unity-3D 皆可
3、一名了解的Native语言的开发者，用于部署应用和接入第三方SDK
