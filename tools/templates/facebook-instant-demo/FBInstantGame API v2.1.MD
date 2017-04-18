#API 说明 v2.1

##FBInstant

Instant Games SDK 的顶级命名空间.

##FBInstant.getLocale

获取用户的地域信息。 例如 **zh_CN**、 **en_US**
全部的地域信息数据，请看此链接 https://www.facebook.com/translations/FacebookLocales.xml 。
注意，只有FBInstant.initializeAsync()获得回调以后，才能调用这个api。

代码示例：

```
var locale = FBInstant.getLocale(); // 'en_US'
```
##FBInstant.getPlatform
当前游戏运行在哪个平台，返回值为：'iOS', 'android' 和 'web'。
注意，只有FBInstant.initializeAsync()获得回调以后，才能调用这个api。

代码示例：

```
var platform = FBInstant.getPlatform(); // 'iOS', 'android' or 'web'
```
##FBInstant.getSDKVersion
获取SDK的版本号，例如 "2.1"。

代码示例：

```
var sdkVersion = FBInstant.getSDKVersion(); // '2.1'
```
##FBInstant.initializeAsync
初始化SDK，应当在其他API使用前调用。
代码示例：

```
FBInstant.initializeAsync().then(function() {
  var locale = FBInstant.getLocale(); // 'en_US'
  var platform = FBInstant.getPlatform(); // 'iOS', 'android' or 'web'
  var sdkVersion = FBInstant.getSDKVersion(); // '2.0'
  var playerID = FBInstant.player.getID();
});
```
当sdk 初始化结束会返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

##FBInstant.setLoadingProgress
告诉平台游戏初始化资源加载的进度

代码示例：

```
FBInstant.setLoadingProgress(50); // 50%的资源被加载了
```
**参数**
•	percentage **number**  0到100之间的数字

##FBInstant.startGameAsync
这表明游戏已完成加载资源，用户准备好开始玩了。
代码示例：

```
FBInstant.startGameAsync().then(function() {
  //在这我们可以确定用户点击了开始游戏的按钮
  myGame.start();
});
```
当游戏应当开始玩的时候会返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
收到这个信号说明用户已经明确的准备好玩游戏了，在此之后，游戏里不应该再有另一个“点击开始”的步骤。

##FBInstant.player
包含当前用户信息的一些方法和属性

##FBInstant.player.getID
玩家的唯一标识ID。一个Facebook用户的id是不会改变的。同一个Facebook的用户，在不同的游戏里会有不用的id。
注意，只有FBInstant.initializeAsync()获得回调以后，才能调用这个api。

代码示例：

```
var playerID = FBInstant.player.getID();
```
##FBInstant.player.getName
用户的名字。
注意，只有FBInstant.initializeAsync()获得回调以后，才能调用这个api。

代码示例：

```
var playerName = FBInstant.player.getName();
```
##FBInstant.player.getPhoto
用户头像的链接地址。头像的图片始终为正方形，尺寸最小为200x200。建议在游戏中使用的时候，先将图像缩放到所需的大小。
注意，只有FBInstant.initializeAsync()获得回调以后，才能调用这个api。
警告：由于跨域的问题，在 canvas 里使用图片会有问题。要防止此情况，请将图像的 cross-origin 属性设置为 "anonymous"

代码示例：

```
var playerImage = new Image();
playerImage.crossOrigin = 'anonymous';
playerImage.src = FBInstant.player.getPhoto();
```
##FBInstant.player.getDataAsync
取回在FB平台储存的当前用户的数据
代码示例：

```
FBInstant.player
  .getDataAsync(['achievements', 'currentLife'])
  .then(function(data) {
     console.log('data is loaded');
     var achievements = data['achievements'];
     var currentLife = data['currentLife'];
});
```
**参数**
•	keys  **Array &lt;String>**  要获取的数据的key值
返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) &lt;Object> 如果发送的Key存在，则通过Promise 返回储存的数据对象.

##FBInstant.player.setDataAsync
把当前用户的数据储存在FB平台上。
代码示例：

```
FBInstant.player
  .setDataAsync({
    achievements: ['medal1', 'medal2', 'medal3'],
    currentLife: 300,
  })
  .then(function() {
    console.log('data is saved');
});
```
**参数**
•	data  **Object**  包含key-value的数据对象.
返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 数据储存成功会返回一个promise

##FBInstant.context
当前游戏的来源信息

##FBInstant.context.getID
当前游戏来源的唯一id。例如你的信息流中有很多好友都发了这个游戏，通过这个id来知道你玩的是哪一个。注意，必须在FBInstant.startGameAsync的回调后才能得到这个id。在FBInstant.endGameAsync的回调后可能会更新这个id。如果平台不支持，或者是在独立页面玩的游戏，这个id值为null

代码示例：

```
var contextID = FBInstant.context.getID();
```

##FBInstant.context.getType
通过该方法可以获知用户是在哪玩的这个游戏。比如 'post', 'thread', 'group', or 'solo'.

代码示例：
```
var contextType = FBInstant.context.getType();
```

##FBInstant.setScore

向平台上传分数。每当玩家的分数在游戏中改变时，就可以调用这个方法，这样平台可以在游戏外实时更新这些分数，提升用户体验。当调用 endGameAsync 时，通过这个API发送的分数将显示在排行榜上。

代码示例：

```
FBInstant.setScore(42);
```
**参数**
•	score **number**  玩家在游戏里的分数

##FBInstant.endGameAsync
显示平台统一的游戏结束画面。

代码示例：

```
FBInstant.endGameAsync().then(function() {
  // 在这里我们可以确定，玩家点击了重玩的按钮
  myGame.resetScore();
  myGame.restartWithoutTutorial();
});
```
当游戏重新开始的时候，返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。


##FBInstant.takeScreenshotAsync
进行截屏，用户以后可以分享给好友。

代码示例：
```
myGame.displayFinalScore();
FBInstant.takeScreenshotAsync().then(function() {
  console.log('Screenshot taken!');
}).catch(function() {
  console.log('Failed to take screenshot.');
});
```
截屏成功或者失败，都会返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

##FBInstant.sendScreenshotAsync
用户要分享的截屏画面。截屏尺寸应该和游戏场景的尺寸一致。


代码示例：
```
var scoreCanvas = new HtmlCanvasElement();
var base64Picture = scoreCanvas.toDataURL();
FBInstant.sendScreenshotAsync(base64Picture).then(function() {
  console.log('Screenshot sent!');
}).catch(function(error) {
  console.log('Failed to send screenshot.');
  console.log(error.toString());
});
```
**参数**

•	base64picture **string** 把截图进行 base64 编码后的字符串
发送成功或者失败，都会返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

##FBInstant.abort

遇到错误中止游戏。只有当游戏进入不可恢复的状态时才可被调用。

代码示例：
```
FBInstant.abort(e);
```
**参数**

•	e [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 具体的错误信息。