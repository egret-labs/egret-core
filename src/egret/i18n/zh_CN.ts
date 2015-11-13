module egret {

    $locale_strings = $locale_strings || {};
    $locale_strings["zh_CN"] = $locale_strings["zh_CN"] || {};
    var locale_strings = $locale_strings["zh_CN"];

    //eui 2000-2999
    //RES 3200-3299

    //core  1000-1999
    locale_strings[1001] = "找不到Egret入口类: {0}。";
    locale_strings[1002] = "Egret入口类 {0} 必须继承自egret.DisplayObject。";
    locale_strings[1003] = "参数 {0} 不能为 null。";
    locale_strings[1004] = "无法将对象添加为它的一个子对象（或子对象的子对象等）的子对象。";
    locale_strings[1005] = "不能将对象添加为其自身的子对象。";
    locale_strings[1006] = "提供的 DisplayObject 必须是调用者的子级。";
    locale_strings[1007] = "为参数指定的索引不在范围内。";
    locale_strings[1008] = "实例化单例出错，不允许实例化多个 {0} 对象。";
    locale_strings[1009] = "类 {0} 不可以使用属性 {1}";
    locale_strings[1010] = "类 {0} 属性 {1} 是只读的";
    locale_strings[1011] = "流错误。URL: {0}";
    locale_strings[1012] = "参数 {0} 的类型必须为 Class。";
    locale_strings[1013] = "变量赋值为NaN，请查看代码！";
    locale_strings[1014] = "类 {0} 常量 {1} 是只读的";

    locale_strings[1015] = "xml not found!";
    locale_strings[1016] = "{0}已经废弃";
    locale_strings[1017] = "JSON文件格式不正确: {0}\ndata: {1}";
    locale_strings[1018] = "9宫格设置错误";

    locale_strings[1022] = "{0} ArgumentError";
    locale_strings[1023] = "此方法在ScrollView内不可用!";
    locale_strings[1025] = "遇到文件尾";
    locale_strings[1026] = "EncodingError! The code point {0} could not be encoded.";
    locale_strings[1027] = "DecodingError";
    locale_strings[1028] = "调用了未配置的注入规则:{0}。 请先在项目初始化里配置指定的注入规则，再调用对应单例。";
    locale_strings[1029] = "Function.prototype.bind - what is trying to be bound is not callable";
    locale_strings[1033] = "跨域图片不可以使用toDataURL来转换成base64";
    locale_strings[1034] = "音乐文件解码失败：\"{0}\"，请使用标准的转换工具重新转换下mp3。";
    locale_strings[1035] = "Native 下暂未实现此功能！";
    locale_strings[1036] = "声音已停止，请重新调用 Sound.play() 来播放声音！";
    locale_strings[1037] = "非正确的blob加载！";


    //gui  3000-3099
    locale_strings[3000] = "主题配置文件加载失败: {0}";
    locale_strings[3001] = "找不到主题中所配置的皮肤类名: {0}";
    locale_strings[3002] = "索引:\"{0}\"超出集合元素索引范围";
    locale_strings[3003] = "在此组件中不可用，若此组件为容器类，请使用";
    locale_strings[3004] = "addChild(){0}addElement()代替";
    locale_strings[3005] = "addChildAt(){0}addElementAt()代替";
    locale_strings[3006] = "removeChild(){0}removeElement()代替";
    locale_strings[3007] = "removeChildAt(){0}removeElementAt()代替";
    locale_strings[3008] = "setChildIndex(){0}setElementIndex()代替";
    locale_strings[3009] = "swapChildren(){0}swapElements()代替";
    locale_strings[3010] = "swapChildrenAt(){0}swapElementsAt()代替";
    locale_strings[3011] = "索引:\"{0}\"超出可视元素索引范围";
    locale_strings[3012] = "此方法在Scroller组件内不可用!";
    locale_strings[3013] = "UIStage是GUI根容器，只能有一个此实例在显示列表中！";

    //socket 3100-3199
    locale_strings[3100] = "当前浏览器不支持WebSocket";
    locale_strings[3101] = "请先连接WebSocket";
    locale_strings[3102] = "请先设置type为二进制类型";

    //db 4000-4299
    locale_strings[4000] = "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)";
    locale_strings[4001] = "Abstract class can not be instantiated!";
    locale_strings[4002] = "Unnamed data!";
    locale_strings[4003] = "Nonsupport version!";

}
