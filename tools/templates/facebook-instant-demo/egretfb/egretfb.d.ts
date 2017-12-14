declare namespace egretfb {
    /**
     * 游戏好友的信息
     */
    class EgretConnectedPlayer {
        /**
         * 关联用户的ID
         */
        getID(): string;
        /**
         * 关联用户的名字
         */
        getName(): string;
        /**
         * 关联用户的头像 url 地址
         */
        getPhoto(): string;
    }
}
declare namespace egretfb {
    /**
     * 当前游戏的来源信息
     */
    class EgretContext {
        /**
         * 当前游戏来源的唯一id
         */
        getID(): string;
        /**
         * 游戏的来源类型："POST" | "THREAD" | "GROUP" | "SOLO"
         */
        getType(): string;
        /**
         * 用这个方法来判断当前游戏环境中游戏参与者的数量是否介于指定的最小值和最大值之间。
         * @param minSize
         * @param maxSize
         */
        isSizeBetween(minSize: number, maxSize: number): {
            answer: boolean;
            minSize: number;
            maxSize: number;
        };
        /**
         * 切换游戏场景
         * @param id
         */
        switchAsync(id: string): Promise<void>;
        /**
         * 选择游戏场景
         * @param options
         */
        chooseAsync(options?: {
            filter: string[];
            maxSize: number;
            minSize: number;
        }): Promise<void>;
        /**
         * 创建游戏场景
         * @param playerID
         */
        createAsync(playerID: string): Promise<void>;
        /**
         * 获取当前环境中正在玩游戏的玩家列表，它可能包含当前玩家的信息。
         */
        getPlayersAsync(): Promise<EgretContextPlayer[]>;
    }
}
declare namespace egretfb {
    /**
     * 游戏环境中的玩家
     */
    class EgretContextPlayer {
        /**
         * 关联用户的ID
         */
        getID(): string;
        /**
         * 关联用户的名字
         */
        getName(): string;
        /**
         * 关联用户的头像 ulr 地址
         */
        getPhoto(): string;
    }
}
declare namespace egretfb {
    /**
     * 自定义更新内容
     */
    class EgretCustomUpdatePayload {
        /**
         * 对于自定义更新来说，该值应该为 'CUSTOM'.
         */
        action: string;
        /**
         * 自定义更新使用的模板的ID，模板应该在 fbapp-config.json 中预定义。
         * 查看配置文件说明：https://developers.facebook.com/docs/games/instant-games/bundle-config
         */
        template: string;
        /**
         * 可选，按钮文字。默认情况下，我们本地化的 'Play' 作为按钮文字。
         */
        cta: string | EgretLocalizableContent;
        /**
         * base64 编码的图像信息
         */
        image: string;
        /**
         * 文本信息
         */
        text: string | EgretLocalizableContent;
        /**
         * 附加到更新上的数据。当游戏通过分享启动时，可以通过 EgretFBInstant.getEntryPointData() 方法获取。
         * 该数据必须少于1000个字符。
         */
        data: Object;
        /**
         * 指定更新的方式。
         * 'IMMEDIATE' - 默认值，立即发布更新
         * 'LAST' - 当游戏结束时，发布更新
         * 'IMMEDIATE_CLEAR' - 立即发布更新，并清除任何其他正在等待的更新
         */
        strategy: string;
        /**
         * 指定自定义更新的通知设置。可以是“NO_PUSH”或“PUSH”，默认为“NO_PUSH”。
         */
        notification: string;
    }
}
declare namespace egretfb {
    class EgretLocalizableContent {
        default: string;
        localizations: Object;
    }
}
declare namespace egretfb {
    class EgretFBInstant {
        /**
         * 获取用户信息
         */
        static readonly player: egretfb.EgretFBPlayer;
        static getNetID(): string;
        /**
         * 当前游戏的来源信息
         */
        static readonly context: EgretContext;
        /**
         * 获取用户的地域信息，例如:zh_CN en_US
         */
        static getLocale(): string;
        /**
         * 获取运行的平台信息: IOS | ANDROID | WEB | MOBILE_WEB
         */
        static getPlatform(): string;
        /**
         * SDK 的版本号，例如: '4.1'
         */
        static getSDKVersion(): string;
        /**
         * SDK 初始化结束会返回一个 Promise 方法
         * 应当在其他 API 使用前调用
         */
        static initializeAsync(): Promise<void>;
        /**
         * 通知平台资源加载的百分比
         * @param percentage 0-100
         */
        static setLoadingProgress(percentage: number): void;
        /**
         * 获取平台支持的 api 列表
         */
        static getSupportedAPIs(): string[];
        /**
         * 获取入口点数据
         */
        static getEntryPointData(): Object;
        /**
         * 设置会话数据
         */
        static setSessionData(sessionData: Object): void;
        /**
         * 游戏已完成加载资源，用户点击了开始游戏的按钮
         * 返回一个 Promise 方法
         */
        static startGameAsync(): Promise<void>;
        /**
         * 分享游戏
         */
        static shareAsync(payload: EgretSharePayload): Promise<void>;
        /**
         * 通知 Facebook 在游戏中发生的更新
         */
        static updateAsync(payload: EgretCustomUpdatePayload): Promise<void>;
        /**
         * 退出游戏
         */
        static quit(): void;
        /**
         * 使用 Facebook 的分析功能来分析应用。
         * @param eventName 要分析的事件名称
         * @param valueToSum 可选，FB分析可以计算它。
         * @param parameters 可选，它可以包含多达25个 key-value，以记录事件。key 必须是2-40个字符，只能包含'_', '-', ' '和字母数字的字符。 Value 必须少于100个字符。
         */
        static logEvent(eventName: string, valueToSum?: number, parameters?: Object): void;
        /**
         * 设置一个暂停触发的方法
         */
        static onPause(func: Function): void;
        /**
         * 返回游戏的启动入口点
         */
        static getEntryPointAsync(): string;
        /**
         * 获取 facebook 广告对象
         * @param placementID
         */
        static getInterstitialAdAsync(placementID: string): Promise<void>;
        /**
         * 获取 facebook 视频广告对象
         * @param placementID
         */
        static getRewardedVideoAsync(placementID: string): Promise<void>;
    }
}
declare namespace egretfb {
    class EgretFBPlayer {
        /**
         * 玩家的唯一标识ID
         */
        getID(): string;
        /**
         * 获取玩家的唯一ID和一个签名，签名用来验证该 ID 来自 Facebook ，没有被篡改。
         */
        getSignedPlayerInfoAsync(requestPayload: string): Promise<EgretSignedPlayerInfo>;
        /**
         * 获取用户在Facebook上的的名字，使用用户的语言种类显示
         */
        getName(): string;
        /**
         * 获取用户在Facebook上的头像的url，头像为正方形，最小尺寸为200x200
         */
        getPhoto(): string;
        /**
         * 取回在FB平台储存的当前用户的数据
         * @param keys 数据的 key 的数组
         */
        getDataAsync(keys: string[]): Promise<Object>;
        /**
         * 把当前用户的数据储存在FB平台上。
         * @param data 包含key-value的数据对象.
         */
        setDataAsync(data: Object): Promise<void>;
        /**
         * 立刻保存数据
         */
        flushDataAsync(): Promise<void>;
        /**
         * 获取玩家好友的信息
         */
        getConnectedPlayersAsync(): Promise<EgretConnectedPlayer[]>;
        /**
         * 获取当前玩家指定的位于服务器中的存储数据
         */
        getStatsAsync(key: string[]): Promise<Object>;
        /**
         * 将指定的数据存储到服务器中
         */
        setStatsAsync(stats: Object): Promise<void>;
        /**
         * 将指定的数据以增量方式存储到服务器中
         */
        incrementStatsAsync(increments: Object): Promise<Object>;
    }
}

declare namespace egretfb {
    /**
     * 要分享的内容
     */
    class EgretSharePayload {
        constructor();
        /**
         * 表示共享的目标
         * "INVITE" | "REQUEST" | "CHALLENGE" | "SHARE"
         */
        intent: string;
        /**
         * 要分享的图像，使用 base64 编码
         */
        image: string;
        /**
         * 要分享的文字
         */
        text: string;
        /**
         * 一个附加到分享上的数据。
         * 所有从这个分享启动的游戏都可以通过  EgretFBInstant.getEntryPointData() 方法获取到该数据。
         */
        data: Object;
    }
}
declare namespace egretfb {
    /**
     * 玩家的签名信息
     */
    class EgretSignedPlayerInfo {
        /**
         * 玩家的id
         */
        getPlayerID(): string;
        /**
         * 验证这个对象的签名确实来自Facebook。该字符串是base64url编码的，使用 HMAC 对您应用的 Sccret 进行签名，基于 OAuth 2.0 规范
         */
        getSignature(): string;
    }
}
