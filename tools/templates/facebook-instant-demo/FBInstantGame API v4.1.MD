# Facebook InstantGame API v4.1 说明

# FBInstant

Instant Games SDK 的顶级命名空间.

## player
包含当前用户信息的一些方法和属性

### getID()
玩家的唯一标识ID。一个Facebook用户的id是不会改变的。同一个Facebook的用户，在不同的游戏里会有不用的id。
注意，该方法必须放在 FBInstant.initializeAsync() 的回调里。

**代码示例：**

```
// 该方法必须放在 FBInstant.initializeAsync() 的回调里
var playerID = FBInstant.player.getID();
```
返回值：**string**，用户的唯一ID

### getSignedPlayerInfoAsync( )
获取玩家的唯一ID和一个签名，签名用来验证该 ID 来自 Facebook ，没有被篡改。该方法必须放在 FBInstant.initializeAsync() 的回调里。

**参数**

•	requestPayload  **String**  一个由开发者指定的信息，包含在已签名的响应消息里。

**代码示例**

```
该方法必须放在 FBInstant.initializeAsync() 的回调里。
// resolves.
FBInstant.player.getSignedPlayerInfoAsync('my_metadata')
  .then(function (result) {
    // ID和签名的验证应放在服务器端处理。
    SendToMyServer(
      result.getPlayerID(), // 和 FBInstant.player.getID() 相同
      result.getSignature(),
      'GAIN_COINS',
      100);
  });
```
•	Throws **INVALID_PARAM**

•	Throws **NETWORK_FAILURE**

•	Throws **CLIENT_REQUIRES_UPDATE**

返回值： **Promise&lt;SignedPlayerInfo>** 一个带有 signedplayerinfo 对象的 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

### getName()
用户的名字。
注意，该方法必须放在 FBInstant.initializeAsync() 的回调里。

代码示例：

```
//该方法必须放在 FBInstant.initializeAsync() 的回调里。
var playerName = FBInstant.player.getName();
```
返回值：**string**，用户的名字

### getPhoto()
用户头像的链接地址。头像的图片始终为正方形，尺寸最小为200x200。建议在游戏中使用的时候，先将图像缩放到所需的大小。
注意，该方法必须放在 FBInstant.initializeAsync() 的回调里。
警告：由于跨域的问题，在 canvas 里使用图片会有问题。要防止此情况，请将图像的 cross-origin 属性设置为 "anonymous"

代码示例：

```
//该方法必须放在 FBInstant.initializeAsync() 的回调里。
var playerImage = new Image();
playerImage.crossOrigin = 'anonymous';
playerImage.src = FBInstant.player.getPhoto();
```
返回值：string，用户的头像的链接地址


### getDataAsync()
取回当前用户在FB平台储存的数据

**参数**
•	keys  **Array &lt;String>**  一个用来检索数据的key的数组

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
*  Throws **INVALID_PARAM**
*  Throws **NETWORK_FAILURE**
*  Throws **CLIENT_REQUIRES_UPDATE**

返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) &lt;Object> 如果发送的Key存在，则通过Promise 返回储存的数据对象.

### setDataAsync()
把当前用户的数据储存在FB平台上。每个用户可以在每个游戏里储存1MB的数据。
代码示例：
**参数**
•	data  **Object**  需要储存的数据，包含key-value的数据对象。对象只能包含可以序列化的值，任何不可序列化的值都会导致储存失败。

代码示例：

```
FBInstant.player
  .setDataAsync({
    achievements: ['medal1', 'medal2', 'medal3'],
    currentLife: 300,
  })
  .then(function() {
    console.log('data is set');
});
```
*  Throws **INVALID_PARAM**
*  Throws **NETWORK_FAILURE**
*  Throws **PENDING_REQUEST**
*  Throws **CLIENT_REQUIRES_UPDATE**

返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当数据提交了以后会返回一个 promise。 注意：这个promise 并不意味着这个数据已经被成功保存。它只是验证了数据的有效性，并且随后会被保存。可以保证的是，在调用 player.getDataAsync 方法时，这些设定的数据会生效。


### flushDataAsync()
将用户的数据立刻更新到云存储。这个方法是开销很大，应该主要用于关键的更改。非关键的更改应该依赖于平台来将它们储存到后台。注意: 当该方法未完成时，调用 player.setDataAsync 这个方法会被拒绝.

代码示例：

```
FBInstant.player
  .setDataAsync({
    achievements: ['medal1', 'medal2', 'medal3'],
    currentLife: 300,
  })
  .then(FBInstant.player.flushDataAsync)
  .then(function() {
    console.log('Data persisted to FB!');
});
```
*  Throws **INVALID_PARAM**
*  Throws **NETWORK_FAILURE**
*  Throws **PENDING_REQUEST**
*  Throws **CLIENT_REQUIRES_UPDATE**
  
返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 数据储存成功会返回一个promise，如果保存失败则返回拒绝

### getConnectedPlayersAsync()
获取和当前玩家有关联的玩家列表信息（即好友列表）。

代码示例：

```
var connectedPlayers = FBInstant.player.getConnectedPlayersAsync()
  .then(function(players) {
    console.log(players.map(function(player) {
      return {
        id: player.getID(),
        name: player.getName(),
      }
    }));
  });
// [{id: '123456789', name: 'Paul Atreides'}, {id: '987654321', name: 'Duncan Idaho'}]

```
*  Throws **NETWORK_FAILURE**
*  Throws **CLIENT_REQUIRES_UPDATE**

返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) &lt;Object&lt;ConnectedPlayer>返回一个promise，包含了关联用户对象的数据

##context
包含当前游戏环境的一些方法和属性

### getID()
当前游戏来源的唯一id。它代表了当前游戏是在哪玩的（例如：是在 messenger 的对话里还是 facebook 的网页里）。如果是在独立页面玩的游戏，这个id值为 null。只有在 FBInstant.startGameAsync 方法被调用后，这个结果才能保证是正确的。

代码示例：

```
//该方法必须放在 FBInstant.startGameAsync() 的回调里。
var contextID = FBInstant.context.getID();
```
返回值 string，当前游戏环境的id。

### getType()
当前游戏的环境类型。

代码示例：

```
//该方法必须放在 FBInstant.startGameAsync() 的回调里。
var contextType = FBInstant.context.getType();
```
返回值 ("POST" | "THREAD" | "GROUP" | "SOLO") 当前游戏环境的类型。

### isSizeBetween()
用这个方法来判断当前游戏环境中游戏参与者的数量是否介于指定的最小值和最大值之间。
如果其中一个边界为空，则只对另一个边界进行检查。在当前游戏中第一次调用后，以后永远返回这个结果，不管参数如何改变。直到游戏环境发生改变，才会重置查询结果。

**参数**
•	minSize  **number**  要查询的环境值的最小值。
•	maxSize  **number**  要查询的环境值的最大值。

代码示例：

```
console.log(FBInstant.context.isSizeBetween(3, 5)); //(Context size = 4)
// {answer: true, minSize: 3, maxSize: 5}
```
```
console.log(FBInstant.context.isSizeBetween(5, 7)); //(Context size = 4)
// {answer: false, minSize: 5, maxSize: 7}
```
```
console.log(FBInstant.context.isSizeBetween(2, 10));// (Context size = 3)
// {answer: true, minSize: 2, maxSize: 10}
console.log(FBInstant.context.isSizeBetween(4, 8));// (Still in same context)
// {answer: true, minSize: 2, maxSize: 10}
```
```
console.log(FBInstant.context.isSizeBetween(3, null)); //(Context size = 4)
// {answer: true, minSize: 3, maxSize: null}
```
```
console.log(FBInstant.context.isSizeBetween(null, 3)); (Context size = 4)
// {answer: false, minSize: null, maxSize: 3}
```
```
console.log(FBInstant.context.isSizeBetween("test", 5)); (Context size = 4)
// null
```
```
console.log(FBInstant.context.isSizeBetween(0, 100)); (Context size = null)
// null
```
返回值 ContextSizeResponse。

### switchAsync()
请求切换到指定的游戏环境。如果玩家没有进入该环境的权限，或者玩家没有提供进入游戏的许可，该方法都会被拒绝。如果成功切换到指定游戏环境，将会返回一个 promise.

**参数**

•	id **string**  想要进入的环境ID

代码示例：

```
console.log(FBInstant.context.getID());
// 1122334455
FBInstant.context
  .switchAsync('1234567890')
  .then(function() {
    console.log(FBInstant.context.getID());
    // 1234567890
  });
```
*  Throws INVALID_PARAM
*  Throws SAME_CONTEXT
*  Throws NETWORK_FAILURE
*  Throws USER_INPUT
*  Throws PENDING_REQUEST
*  Throws CLIENT_REQUIRES_UPDATE

返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当游戏切换到指定环境，返回一个 promise，失败会被拒绝。

### chooseAsync()
为玩家打开一个游戏环境选择列表。如果玩家选择了一个可用的环境，客户端将尝试切到那个环境，如果成功，返回 resolve。如果玩家退出菜单，或者客户端未能切换到新环境，返回 reject.

**参数**

•	options **Object**  提供可选择的环境对象。

•	options.filters **Array**<ContextFilter>设置一组应用于环境对象的过滤器.

•	options.maxSize **number** 理想情况下，环境对象的最大值

•	options.minSize **number** 理想情况下，环境对象的最小值

代码示例：

```
console.log(FBInstant.context.getID());
// 1122334455
FBInstant.context
  .chooseAsync()
  .then(function() {
    console.log(FBInstant.context.getID());
    // 1234567890
  });
```

```
console.log(FBInstant.context.getID());
// 1122334455
FBInstant.context
  .chooseAsync({
    filters: ['NEW_CONTEXT_ONLY'],
    minSize: 3,
  })
  .then(function() {
    console.log(FBInstant.context.getID());
    // 1234567890
  });
```
*  Throws INVALID_PARAM
*  Throws SAME_CONTEXT
*  Throws NETWORK_FAILURE
*  Throws USER_INPUT
*  Throws PENDING_REQUEST
*  Throws CLIENT_REQUIRES_UPDATE

返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当游戏切换到指定环境，返回一个 promise，失败会返回reject(例如，用户取消了对话框)

### createAsync()
在当前玩家和指定玩家之间，尝试创建或切换一个环境。如果指定玩家不能玩这个游戏，或者玩家决绝进入新环境，则返回 recject。如果成功切换到新游戏的环境时，则返回 resolve。

**参数**

•	playerID **string**  用户的 ID

代码示例：

```
console.log(FBInstant.context.getID());
// 1122334455
FBInstant.context
  .createAsync('12345678')
  .then(function() {
    console.log(FBInstant.context.getID());
    // 5544332211
  });
```
*  Throws INVALID_PARAM
*  Throws SAME_CONTEXT
*  Throws NETWORK_FAILURE
*  Throws USER_INPUT
*  Throws PENDING_REQUEST
*  Throws CLIENT_REQUIRES_UPDATE


返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当游戏成功切换到指定环境，返回一个 promise 的 resolve，失败会返回reject

### getPlayersAsync()
获取当前环境中正在玩游戏的玩家列表，它可能包含当前玩家的信息。

代码示例：

```
var contextPlayers = FBInstant.context.getPlayersAsync()
  .then(function(players) {
    console.log(players.map(function(player) {
      return {
        id: player.getID(),
        name: player.getName(),
      }
    }));
  });
// [{id: '123456789', name: 'Luke'}, {id: '987654321', name: 'Leia'}]
```
*  Throws NETWORK_FAILURE
*  Throws CLIENT_REQUIRES_UPDATE
*  Throws INVALID_OPERATION

返回 **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) &lt;Array&lt;ContextPlayer>>**

### getLocale()

获取用户的地域信息。 例如 **zh_CN**、 **en_US**
全部的地域信息数据，请看此链接 https://www.facebook.com/translations/FacebookLocales.xml 。使用这个值用来确定游戏中应该显示那种语言。
该方法必须放在 FBInstant.initializeAsync() 的回调里。

代码示例：

```
// 该方法必须放在 FBInstant.initializeAsync() 的回调里
var locale = FBInstant.getLocale(); // 'en_US'
```
返回值 string，当前地域信息。

### getPlatform()
当前游戏运行在哪个平台。该方法必须放在 FBInstant.initializeAsync() 的回调里

代码示例：

```
该方法必须放在 FBInstant.initializeAsync() 的回调里
var platform = FBInstant.getPlatform(); // 'IOS'
```
返回值 string，当前游戏运行的平台("IOS" | "ANDROID" | "WEB" | "MOBILE_WEB")

### getSDKVersion()
获取SDK的版本号,用字符串来表示。

代码示例：

```
var sdkVersion = FBInstant.getSDKVersion(); // '4.1'
```
返回值 string，SDK 的版本号。


### initializeAsync()
初始化SDK，应当在所有其他的API使用前调用。
代码示例：

```
FBInstant.initializeAsync().then(function() {
  // 在初始化完成之前，下面这些属性都是无法得到的。必须要放在这个回调方法里。
  var locale = FBInstant.getLocale(); // 'en_US'
  var platform = FBInstant.getPlatform(); // 'IOS'
  var sdkVersion = FBInstant.getSDKVersion(); // '4.1'
  var playerID = FBInstant.player.getID();
});
```
*  Throws INVALID_OPERATION

返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)当sdk 初始化完成后会返回 promise


### setLoadingProgress()
通知平台游戏初始化资源加载的进度

**参数**

•	percentage **number**  0到100之间的数字

代码示例：

```
FBInstant.setLoadingProgress(50); // 50%的资源被加载了
```
返回值 void


### getSupportedAPIs()
提供当前客户端支持的 API 函数列表。

代码示例：

```
//该方法必须放在 FBInstant.initializeAsync() 的回调里
FBInstant.getSupportedAPIs();
// ['getLocale', 'initializeAsync', 'player.getID', 'context.getType', ...]
```
返回值  Array&lt;string> 返回客户端支持的 API 函数列表


### getEntryPointData()
返回与游戏启动的入口点相关的数据对象。

对象的内容是开发人员定义的，并且可以在不同平台的入口点触发。在老的移动客户端上会返回 null。如果特定的入口点没有数据时，也会返回 null。

代码示例：

```
//该方法必须放在 FBInstant.initializeAsync() 的回调里
const entryPointData = FBInstant.getEntryPointData();
```
返回值  Object 与当前入口点相关的数据。

### setSessionData()
为当前环境设置游戏的数据。
每当游戏想要更新当前会话的数据时，可以调用该方法。
**参数**

•	sessionData **Object**  一个任意的数据对象，必须小于1000个字符

代码示例：

```
FBInstant.setSessionData({coinsEarned: 10, eventsSeen: ['start', ...]});
```
返回值 void

### startGameAsync()
这表明游戏已经加载完资源，可以开始玩了。当返回 promise 的 resolve 时，环境信息将会更新。

代码示例：

```
FBInstant.startGameAsync().then(function() {
  myGame.start();
});
```
*  Throws INVALID_PARAM
*  Throws CLIENT_REQUIRES_UPDATE
返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)当游戏应当开始玩的时候会返回 promise

### shareAsync()
这将启动一个对话框，让用户共享指定的内容，可能是一个 Messenger 里的消息，或者是用户时间线上的一个帖子。一个blob数据可以附加在分享上，当游戏通过分享启动时，可以通过 FBInstant.getEntryPointData() 方法获取。这个数据必须少于1000个字符。用户可以选择取消分享，或者关闭对话框，但不论用户是否真的分享了内容，都会返回 promise 的 resolve。

**参数**

•	payload **SharePayload**  要分享的内容，请看示例代码

代码示例：

```
FBInstant.shareAsync({
  intent: 'REQUEST',
  image: base64Picture,
  text: 'X is asking for your help!',
  data: { myReplayData: '...' },
}).then(function() {
  // 继续游戏
});
```
*  Throws INVALID_PARAM
*  Throws NETWORK_FAILURE
*  Throws PENDING_REQUEST
*  Throws CLIENT_REQUIRES_UPDATE
*  Throws INVALID_OPERATION

返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 不管分享成功或失败，都会返回 promise 的 resolve

### updateAsync()
通知Facebook在游戏中发生的更新。这将暂时把控制权交给Facebook，而Facebook将决定根据更新的内容来做什么。当Facebook将控制权归还给游戏时，将返回 promise 的 resolve/reject.

**参数**

•	payload **CustomUpdatePayload **  要更新的内容

代码示例：

```
//这将发送一个自定义更新。如果游戏是运行在一个 messenger 的对话里，
//它将发送一条带有图文的消息到指定的对话里。
//如果其他用户通过这条消息启动了游戏，
//这些游戏会话将可以通过 FBInstant.getEntryPointData() 方法获取附加的 blob 数据。 

FBInstant.updateAsync({
  action: 'CUSTOM',
  cta: 'Join The Fight',
  template:'join_fight',
  image: base64Picture,
  text: 'X just invaded Y\'s village!',
  data: { myReplayData: '...' },
  strategy: 'IMMEDIATE',
  notification: 'NO_PUSH',
}).then(function() {
  //当消息发送后，关闭游戏
  FBInstant.quit();
});
```
** Throws INVALID_PARAM
** Throws PENDING_REQUEST
返回值 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 当Facebook将控制权归还给游戏时返回 promise

### quit()
退出游戏

代码示例：

```
FBInstant.quit();
```
返回值 void

### logEvent()

使用 Facebook 的分析系统来记录一个应用的事件消息，更多细节请参见： https://developers.facebook.com/docs/javascript/reference/v2.8#app_events 

**参数**

•	eventName **string**  事件的名称。必须是2到40个字符，只能包含'_', '-', ' '和字母数字的字符。

•	valueToSum **number** 一个可选的数字，FB分析可以计算它。

•	parameters **Object** 一个可选的对象，它可以包含多达25个 key-value，以记录事件。key 必须是2-40个字符，只能包含'_', '-', ' '和字母数字的字符。 Value 必须少于100个字符。
 
代码示例：

```
var logged = FBInstant.logEvent(
  'my_custom_event',
  42,
  {custom_property: 'custom_value'},
);
```
返回值 **CodeError** 如果事件记录失败，返回错误信息，否则返回 null.

### onPause()
设置一个暂停事件触发时调用的方法。
**参数**

•	func **Function**  当暂停事件触发时调用的方法。

返回值 **void**

