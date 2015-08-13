module egret {
    /**
     * @private
     */
    export var egret_string_code = {};
    egret_string_code[-1] = "不存在的stringId:{0}";
    egret_string_code[1000] = "Browser.isMobile接口参数已经变更，请尽快调整用法为 egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE";
    egret_string_code[1001] = "该方法目前不应传入 resolutionPolicy 参数，请在 docs/1.0_Final_ReleaseNote中查看如何升级";
    egret_string_code[1002] = "egret.Ticker是框架内部使用的单例，不允许在外部实例化，计时器请使用egret.Timer类！";
    egret_string_code[1003] = "Ticker#setTimeout方法即将废弃,请使用egret.setTimeout";
    egret_string_code[1004] = "ExternalInterface调用了js没有注册的方法: {0}";
    egret_string_code[1005] = "设置了已经存在的blendMode: {0}";
    egret_string_code[1006] = "child不在当前容器内";
    egret_string_code[1007] = "提供的索引超出范围";
    egret_string_code[1008] = "child未被addChild到该parent";
    egret_string_code[1009] = "设置了已经存在的适配模式:{0}";
    egret_string_code[1010] = "addEventListener侦听函数不能为空";
    egret_string_code[1011] = "BitmapText找不到文字所对应的纹理:\"{0}\"";
    egret_string_code[1012] = "egret.BitmapTextSpriteSheet已废弃，请使用egret.BitmapFont代替。";
    egret_string_code[1013] = "TextField.setFocus 没有实现";
    egret_string_code[1014] = "Ease不能被实例化";
    egret_string_code[1015] = "xml not found!";
    egret_string_code[1016] = "{0}已经废弃";
    egret_string_code[1017] = "JSON文件格式不正确: {0}\ndata: {1}";
    egret_string_code[1018] = "egret_html5_localStorage.setItem保存失败,key={0}&value={1}";
    egret_string_code[1019] = "网络异常:{0}";
    egret_string_code[1020] = "无法初始化着色器";
    egret_string_code[1021] = "当前浏览器不支持webgl";
    egret_string_code[1022] = "{0} ArgumentError";
    egret_string_code[1023] = "此方法在ScrollView内不可用!";
    egret_string_code[1024] = "使用了尚未实现的ScaleMode";
    egret_string_code[1025] = "遇到文件尾";
    egret_string_code[1026] = "EncodingError! The code point {0} could not be encoded.";
    egret_string_code[1027] = "DecodingError";
    egret_string_code[1028] = "调用了未配置的注入规则:{0}。 请先在项目初始化里配置指定的注入规则，再调用对应单例。";
    egret_string_code[1029] = "Function.prototype.bind - what is trying to be bound is not callable";
    egret_string_code[1030] = "该API已废弃";
    egret_string_code[1031] = "setVolume已废弃，请使用this.volume = value代替";
    egret_string_code[1032] = "getVolume已废弃，请使用this.volume代替";
    egret_string_code[1033] = "跨域图片不可以使用toDataURL来转换成base64";

    egret_string_code[2000] = "RES.createGroup()传入了配置中不存在的键值: {0}";
    egret_string_code[2001] = "RES加载了不存在或空的资源组:\"{0}\"";
    egret_string_code[2002] = "请不要使用不同的类型方式来加载同一个素材！";

    egret_string_code[3000] = "主题配置文件加载失败: {0}";
    egret_string_code[3001] = "找不到主题中所配置的皮肤类名: {0}";
    egret_string_code[3002] = "索引:\"{0}\"超出集合元素索引范围";
    egret_string_code[3003] = "在此组件中不可用，若此组件为容器类，请使用";
    egret_string_code[3004] = "addChild(){0}addElement()代替";
    egret_string_code[3005] = "addChildAt(){0}addElementAt()代替";
    egret_string_code[3006] = "removeChild(){0}removeElement()代替";
    egret_string_code[3007] = "removeChildAt(){0}removeElementAt()代替";
    egret_string_code[3008] = "setChildIndex(){0}setElementIndex()代替";
    egret_string_code[3009] = "swapChildren(){0}swapElements()代替";
    egret_string_code[3010] = "swapChildrenAt(){0}swapElementsAt()代替";
    egret_string_code[3011] = "索引:\"{0}\"超出可视元素索引范围";
    egret_string_code[3012] = "此方法在Scroller组件内不可用!";
    egret_string_code[3013] = "UIStage是GUI根容器，只能有一个此实例在显示列表中！";
    egret_string_code[3014] = "propNotPropOrStyle";

    egret_string_code[4000] = "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)";
    egret_string_code[4001] = "Abstract class can not be instantiated!";
    egret_string_code[4002] = "Unnamed data!";
    egret_string_code[4003] = "Nonsupport version!";
    egret_string_code[4004] = "Abstract method needs to be implemented in subclass!";

    egret_string_code[3100] = "当前浏览器不支持WebSocket";
    egret_string_code[3101] = "请先连接WebSocket";
    egret_string_code[3102] = "请先设置type为二进制类型";
}