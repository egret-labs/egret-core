declare namespace egretfb {
    class EgretUpdateAction {
        CUSTOM: string;
        LEADERBOARD: string;
    }
}
declare namespace egretfb {
    /**
     * 游戏好友的信息
     */
    class EgretConnectedPlayer {
        private _fbContextPlayer;
        constructor(player: any);
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
     * 游戏环境中的玩家
     */
    class EgretContextPlayer {
        private _fbContextPlayer;
        constructor(player: any);
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
        private _action;
        /**
         * 对于自定义更新来说，该值应该为 'CUSTOM'.
         */
        action: string;
        private _template;
        /**
         * 自定义更新使用的模板的ID，模板应该在 fbapp-config.json 中预定义。
         * 查看配置文件说明：https://developers.facebook.com/docs/games/instant-games/bundle-config
         */
        template: string;
        private _cta;
        /**
         * 可选，按钮文字。默认情况下，我们本地化的 'Play' 作为按钮文字。
         */
        cta: string | EgretLocalizableContent;
        private _image;
        /**
         * base64 编码的图像信息
         */
        image: string;
        private _text;
        /**
         * 文本信息
         */
        text: string | EgretLocalizableContent;
        private _data;
        /**
         * 附加到更新上的数据。当游戏通过分享启动时，可以通过 EgretFBInstant.getEntryPointData() 方法获取。
         * 该数据必须少于1000个字符。
         */
        data: Object;
        private _strategy;
        /**
         * 指定更新的方式。
         * 'IMMEDIATE' - 默认值，立即发布更新
         * 'LAST' - 当游戏结束时，发布更新
         * 'IMMEDIATE_CLEAR' - 立即发布更新，并清除任何其他正在等待的更新
         */
        strategy: string;
        private _notification;
        /**
         * 指定自定义更新的通知设置。可以是“NO_PUSH”或“PUSH”，默认为“NO_PUSH”。
         */
        notification: string;
    }
}
declare namespace egretfb {
    class EgretAdInstance {
        private _ad;
        constructor(ad: any);
        /**
         * 获取当前广告的 placementID
         */
        getPlacementID(): string;
        /**
         * 加载广告
         * <br>
         * 抛出错误：ADS_FREQUENT_LOAD，ADS_NO_FILL，INVALID_PARAM，NETWORK_FAILURE
         */
        loadAsync(): Promise<void>;
        /**
         * 显示广告
         * <br>
         * 抛出错误：ADS_NOT_LOADED，INVALID_PARAM，NETWORK_FAILURE
         */
        showAsync(): Promise<void>;
    }
}
declare namespace egretfb {
    /**
     * 游戏排行榜成绩录入
     */
    class EgretLeaderboardEntry {
        private _le;
        constructor(le: any);
        /**
         * 分数
         */
        getScore(): number;
        /**
         * 格式化分数
         */
        getFormattedScore(): string;
        /**
         * 分数更新时间戳
         */
        getTimestamp(): number;
        /**
         * 获取玩家的分数排名的排行榜。
         */
        getRank(): number;
        getExtraData(): number;
        /**
         * 玩家信息
         */
        getPlayer(): EgretFBPlayer;
    }
}
declare namespace egretfb {
    class EgretLocalizableContent {
        default: string;
        localizations: Object;
    }
}
declare namespace egretfb {
    /**
     * 当前游戏的来源信息
     */
    class EgretContext {
        private _fbContext;
        constructor(_EgretContext: any);
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
     * Facebook Instant Games SDK 顶级入口
     */
    class EgretFBInstant {
        /**
         * 获取当前玩家用户信息。
         * 调用此API会创建一个全新的 egretfb.EgretFBPlayer 对象，
         * 您应该在您的游戏逻辑中缓存第一次创建的此对象
         */
        static readonly player: EgretFBPlayer;
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
         * <br>
         * 抛出错误：INVALID_OPERATION
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
         * <br>
         * 抛出错误：INVALID_PARAM，CLIENT_UNSUPPORTED_OPERATION
         */
        static startGameAsync(): Promise<void>;
        /**
         * 分享游戏
         * <br>
         * 抛出错误：INVALID_PARAM，NETWORK_FAILURE，PENDING_REQUEST，CLIENT_UNSUPPORTED_OPERATION，INVALID_OPERATION
         */
        static shareAsync(payload: EgretSharePayload): Promise<void>;
        /**
         * 通知 Facebook 在游戏中发生的更新
         * <br>
         * 抛出错误：INVALID_PARAM，PENDING_REQUEST，INVALID_OPERATION
         */
        static updateAsync(payload: EgretCustomUpdatePayload): Promise<void>;
        /**
         * 请求客户端切换不用的Facebook Instant Game
         * <br>
         * 抛出错误：USER_INPUT，INVALID_PARAM，PENDING_REQUEST，CLIENT_REQUIRES_UPDATE
         * @param appID
         * @param data
         */
        static switchGameAsync(appID: string, data?: string): Promise<void>;
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
        static getEntryPointAsync(): Promise<string>;
        /**
         * 获取 facebook 广告对象
         * @param placementID
         */
        static getInterstitialAdAsync(placementID: string): Promise<EgretAdInstance>;
        /**
         * 获取 facebook 视频广告对象
         * @param placementID
         */
        static getRewardedVideoAsync(placementID: string): Promise<EgretAdInstance>;
        /**
         * 获取游戏中的排行榜
         * <br>
         * 抛出错误：LEADERBOARD_NOT_FOUND，NETWORK_FAILURE，CLIENT_UNSUPPORTED_OPERATION，INVALID_OPERATION，INVALID_PARAM
         * @param name 排行榜名称
         */
        static getLeaderboardAsync(name: string): Promise<EgretLeaderboard>;
    }
}
declare namespace egretfb {
    /**
     * 用户信息
     */
    class EgretFBPlayer {
        private _FBPlayer;
        /**
         * @private
         * 您不应该手动实例化此实例对象，该对象由系统创建。
         * @param _player
         */
        constructor(_player: any);
        /**
         * 玩家的唯一标识ID
         */
        getID(): string;
        /**
         * 获取玩家的唯一ID和一个签名，签名用来验证该 ID 来自 Facebook ，没有被篡改。
         * <br>
         * 抛出错误：INVALID_PARAM，NETWORK_FAILURE，CLIENT_UNSUPPORTED_OPERATION
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
         * <br>
         * 抛出错误：INVALID_PARAM，NETWORK_FAILURE，CLIENT_UNSUPPORTED_OPERATION
         * @param keys 数据的 key 的数组
         */
        getDataAsync(keys: string[]): Promise<Object>;
        /**
         * 把当前用户的数据储存在FB平台上。
         * <br>
         * 抛出错误：INVALID_PARAM，NETWORK_FAILURE，PENDING_REQUEST，CLIENT_UNSUPPORTED_OPERATION
         * @param data 包含key-value的数据对象.
         */
        setDataAsync(data: Object): Promise<void>;
        /**
         * 立刻保存数据
         * <br>
         * 抛出错误：INVALID_PARAM，NETWORK_FAILURE，PENDING_REQUEST，CLIENT_UNSUPPORTED_OPERATION
         */
        flushDataAsync(): Promise<void>;
        /**
         * 获取当前玩家指定的位于服务器中的存储数据
         * <br>
         * 抛出错误：INVALID_PARAM，NETWORK_FAILURE，CLIENT_UNSUPPORTED_OPERATION
         */
        getStatsAsync(key: string[]): Promise<Object>;
        /**
         * 将指定的数据存储到服务器中
         * <br>
         * 抛出错误：INVALID_PARAM，NETWORK_FAILURE，PENDING_REQUEST，CLIENT_UNSUPPORTED_OPERATION
         */
        setStatsAsync(stats: Object): Promise<void>;
        /**
         * 将指定的数据以增量方式存储到服务器中
         * <br>
         * 抛出错误：INVALID_PARAM，NETWORK_FAILURE，PENDING_REQUEST，CLIENT_UNSUPPORTED_OPERATION
         */
        incrementStatsAsync(increments: Object): Promise<Object>;
        /**
         * 获取玩家好友的信息
         */
        getConnectedPlayersAsync(): Promise<EgretConnectedPlayer[]>;
    }
}
declare namespace egretfb {
    /**
     * 排行榜
     */
    class EgretLeaderboard {
        private _lb;
        constructor(lb: any);
        /**
         * 排行榜名称
         */
        getName(): string;
        /**
         * 排行榜 ContextID
         */
        getContextID(): string;
        /**
         * 排行榜总玩家数
         */
        getEntryCountAsync(): Promise<number>;
        /**
         * 更新玩家得分
         * @param score
         * @param extraData
         */
        setScoreAsync(score: number, extraData?: string): Promise<EgretLeaderboardEntry>;
        /**
         * 检索当前玩家排行榜的条目
         */
        getPlayerEntryAsync(): Promise<EgretLeaderboardEntry>;
        /**
         * 检索一组作品的排行榜，排行榜成绩排名排序。
         */
        getEntriesAsync(): Promise<Array<EgretLeaderboardEntry>>;
    }
}
declare namespace egretfb {
    class EgretLeaderboardUpdatePayload {
        action: EgretUpdateAction;
        name: string;
        text: string;
    }
}
declare namespace egretfb {
    /**
     * @private
     */
    class Net {
        private static _username;
        private static readonly username;
        private static _url;
        static push(action: string, key: string, value: Object): void;
        static pushlog(eventName: string, valueToSum?: number, parameters?: Object): void;
    }
}
declare namespace egretfb {
    /**
     * 要分享的内容
     */
    class EgretSharePayload {
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
        private _playerInfo;
        constructor(player: any);
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
