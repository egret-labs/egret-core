

//Copyright (c) 2014-present, Egret Technology.
//for fbinstant.6.2.js
declare class FBInstant {
    /**
     * 获取用户信息.
     * Contains functions and properties related to the current player.
     */
    static player: FBInstant.FBPlayer;
    /**
     * 当前游戏的来源信息
     * Contains functions and properties related to the current game context.
     */
    static context: FBInstant.Context;
    /**
     * 获取用户的语言设置，例如:zh_CN en_US
     * The current locale
     */
    static getLocale(): string;
    /**
     * 获取运行的平台信息: IOS | ANDROID | WEB | MOBILE_WEB
     * The platform on which the game is currently running
     */
    static getPlatform(): FBPlatform;
    /**
     * SDK 的版本号，例如: '4.1'
     * The string representation of this SDK version.
     */
    static getSDKVersion(): string;
    /**
     * SDK 初始化结束会返回一个 Promise 方法，应当在其他 API 使用前调用
     * Initializes the SDK library.
     */
    static initializeAsync(): Promise<void>;
    /**
     * 通知平台资源加载的百分比
     * Report the game's initial loading progress.
     * @param percentage 0-100
     */
    static setLoadingProgress(percentage: number): void;
    /**
     * 获取平台支持的 api 列表
     * Provides a list of API functions that are supported by the client.
     */
    static getSupportedAPIs(): string[];
    /**
     * 获取入口点数据
     * Returns any data object associated with the entry point that the game was launched from.
     */
    static getEntryPointData(): Object;
    /**
     * 用户从哪个入口进入的游戏
     * Returns the entry point that the game was launched from
     */
    static getEntryPointAsync(): string;
    /**
     * 设置会话数据
     * Sets the data associated with the individual gameplay session for the current context.
     */
    static setSessionData(sessionData: Object): void;
    /**
     * 游戏已完成加载资源，用户点击了开始游戏的按钮
     * 返回一个 Promise 方法
     * This indicates that the game has finished initial loading and is ready to start. Context information will be up-to-date when the returned promise resolves.
     */
    static startGameAsync(): Promise<void>;
    /**
     * 分享游戏
     * This invokes a dialog to let the user share specified content, either as a message in Messenger or as a post on the user's timeline. 
     */
    static shareAsync(payload: FBInstant.SharePayload): Promise<void>;
    /**
     * 通知 Facebook 在游戏中发生的更新
     * Informs Facebook of an update that occurred in the game. 
     */
    static updateAsync(payload: FBInstant.CustomUpdatePayload | FBInstant.LeaderboardUpdatePayload): Promise<void>;
    /**
     * 请求客户端切换到另一个小游戏
     * Request that the client switch to a different Instant Game. 
     */
    static switchGameAsync(appID: string, data?: string): Promise<void>;
    /**
     * 用户是否有资格创建快捷方式。
     * Returns whether or not the user is eligible to have shortcut creation requested.
     */
    static canCreateShortcutAsync(): Promise<Boolean>;
    /**
     * 如果用户有资格，提示用户创建游戏的快捷方式。
     * Prompts the user to create a shortcut to the game if they are eligible to Can only be called once per session. 
     */
    static createShortcutAsync(): Promise<void>;
    /**
     * 退出游戏
     * Quits the game.
     */
    static quit(): void;
    /**
     * 使用 Facebook 的分析功能来分析应用。
     * Log an app event with FB Analytics
     * @param eventName 要分析的事件名称
     * @param valueToSum 可选，FB分析可以计算它。
     * @param parameters 可选，它可以包含多达25个 key-value，以记录事件。key 必须是2-40个字符，只能包含'_', '-', ' '和字母数字的字符。 Value 必须少于100个字符。
     */
    static logEvent(eventName: string, valueToSum?: number, parameters?: Object): FBInstant.APIError;
    /**
     * 设置一个暂停触发的方法
     * Set a callback to be fired when a pause event is triggered.
     */
    static onPause(func: Function): void;
    /**
     * 创建交互广告
     * Attempt to create an instance of interstitial ad. This instance can then be preloaded and presented.
     * @param placementID 在 Audience Network 设置的位置ID
     */
    static getInterstitialAdAsync(placementID: String): Promise<FBInstant.AdInstance>;
    /**
     * 创建激励视频广告
     * Attempt to create an instance of rewarded video. This instance can then be preloaded and presented.
     * @param placementID 在 Audience Network 设置的位置ID
     */
    static getRewardedVideoAsync(placementID: String): Promise<FBInstant.AdInstance>;
    /**
     * 尝试将当前玩家与等待他人加入游戏的其他玩家进行匹配
     * Attempts to match the current player with other users looking for people to play with
     */
    static matchPlayerAsync(matchTag: string, switchContextWhenMatched: boolean): Promise<void>;
    /**
     * 检查当前玩家是否符合 matchPlayerAsync API 的条件。
     * Checks if the current player is eligible for the matchPlayerAsync API.
     */
    static checkCanPlayerMatchAsync(): Promise<boolean>;
    /**
     * 获取这款小游戏中的特有排行榜。
     * An Instant Game leaderboard
     */
    static getLeaderboardAsync(name: string): Promise<FBInstant.Leaderboard>;
}
declare namespace FBInstant {
    interface AdInstance {
        /**
         * 获取广告位id
         */
        getPlacementID(): string;
        /**
         * 加载广告资源
         */
        loadAsync(): Promise<void>;
        /**
         * 播放广告
         */
        showAsync(): Promise<void>;
    }
    interface FBPlayer {
        /**
         * 玩家的唯一标识ID.
         * A unique identifier for the player.
         */
        getID(): string;
        /**
         * 获取玩家的唯一ID和一个签名，签名用来验证该 ID 来自 Facebook ，没有被篡改。
         * Fetch the player's unique identifier along with a signature that verifies that the identifier indeed comes from Facebook without being tampered with
         */
        getSignedPlayerInfoAsync(requestPayload?: string): Promise<SignedPlayerInfo>;
        /**
         * 返回一个 promise，表示玩家是否可以与游戏机器人对战。
         * Returns a promise that resolves with whether the player can subscribe to the game bot or not.
         */
        canSubscribeBotAsync(): Promise<Boolean>;
        /**
         * 请求玩家订阅游戏机器人。
         * Request that the player subscribe the bot associated to the game. 
         */
        subscribeBotAsync(): Promise<void>;
        /**
         * 获取用户在Facebook上的的名字，使用用户的语言种类显示
         * The player's localized display name.
         */
        getName(): string;
        /**
         * 获取用户在Facebook上的头像的url，头像为正方形，最小尺寸为200x200.
         * A url to the player's public profile photo.
         */
        getPhoto(): string;
        /**
         * 取回在FB平台储存的当前用户的数据
         * Retrieve data from the designated cloud storage of the current player
         * @param keys 数据的 key 的数组
         */
        getDataAsync(keys: string[]): Promise<Object>;
        /**
         * 把当前用户的数据储存在FB平台上。
         * Set data to be saved to the designated cloud storage of the current player. 
         * @param data 包含key-value的数据对象.
         */
        setDataAsync(data: Object): Promise<void>;
        /**
         * 立刻保存数据
         * Immediately flushes any changes to the player data to the designated cloud storage. 
         */
        flushDataAsync(): Promise<void>;
        /**
         * 获取当前玩家数据
         * Retrieve stats from the designated cloud storage of the current player.
         * @param keys 数据的 key 的数组
         */
        getStatsAsync(keys: string[]): Promise<void>;
        /**
         * 把当前用户的数据储存在FB平台上。
         * Set stats to be saved to the designated cloud storage of the current player.
         * @param data 包含key-value的数据对象.
         */
        setStatsAsync(stats: Object): Promise<void>;
        /**
         * 把当前玩家数据增量更新储存到FB平台上。
         * Increment stats saved in the designated cloud storage of the current player.
         * @param data 包含key-value的数据对象.
         */
        incrementStatsAsync(increments: Object): Promise<void>;
        /**
         * 获取玩家好友的信息
         * Fetches an array of ConnectedPlayer objects containing information about players that are connected to the current player.
         */
        getConnectedPlayersAsync(): Promise<ConnectedPlayer[]>;
    }

    /**
     * 当前游戏的来源信息
     */
    interface Context {
        /**
         * 当前游戏来源的唯一id
         * A unique identifier for the current game context. 
         */
        getID(): string;
        /**
         * 游戏的来源类型："POST" | "THREAD" | "GROUP" | "SOLO"
         * The type of the current game context.
         */
        getType(): string;
        /**
         * 用这个方法来判断当前游戏环境中游戏参与者的数量是否介于指定的最小值和最大值之间。
         * This function determines whether the number of participants in the current game context is between a given minimum and maximum, inclusive.
         */
        isSizeBetween(minSize: number, maxSize: number): { answer: boolean, minSize: number, maxSize: number };
        /**
         * 切换游戏场景
         * Request a switch into a specific context. 
         */
        switchAsync(id: string): Promise<void>;
        /**
         * 选择游戏场景
         * Opens a context selection dialog for the player. 
         */
        chooseAsync(options?: { filter?: FBContextFilter[], maxSize?: number, minSize?: number }): Promise<void>;
        /**
         * 创建游戏场景
         * Attempts to create or switch into a context between a specified player and the current player. 
         */
        createAsync(playerID: string): Promise<void>;
        /**
         * 获取当前环境中正在玩游戏的玩家列表，它可能包含当前玩家的信息。
         * Gets an array of #contextplayer objects containing information about active players
         */
        getPlayersAsync(): Promise<ContextPlayer[]>;
    }
    /**
     * 支付
     */
    interface payments {
        /**
         * 获取游戏的产品目录。
         * Fetches the game's product catalog.
         */
        getCatalogAsync(): Promise<Product[]>;
        /**
         * 开始特定产品的购买流程。
         * Begins the purchase flow for a specific product. 
         */
        purchaseAsync(purchaseConfig: PurchaseConfig): Promise<Purchase>;
        /**
         * 获取玩家未消费的所有购买商品
         * Fetches all of the player's unconsumed purchases. 
         */
        getPurchasesAsync(): Promise<Purchase[]>;
        /**
         * 消费当前玩家拥有的特定购买商品
         * Consumes a specific purchase belonging to the current player. 
         */
        consumePurchaseAsync(purchaseToken: string): Promise<void>;
        /**
         * 设置一个回调，在支付操作可进行时触发。
         * Sets a callback to be triggered when Payments operations are available.
         */
        onReady(callBack: Function): void;
    }
    /**
     * 游戏好友的信息
     */
    interface ConnectedPlayer {
        /**
         * 关联用户的ID
         * Get the id of the connected player.
         */
        getID(): string;
        /**
         * 关联用户的名字
         * Get the player's full name.
         */
        getName(): string;
        /**
         * Get the player's public profile photo.
         * 关联用户的头像 ulr 地址
         */
        getPhoto(): string;
    }
    /**
     * 游戏环境中的玩家
     */
    interface ContextPlayer {
        /**
         * 关联用户的ID
         * Get the id of the context player.
         */
        getID(): string;
        /**
         * 关联用户的名字
         * Get the player's localized display name.
         */
        getName(): string;
        /**
         * 关联用户的头像 ulr 地址
         * Get the player's public profile photo.
         */
        getPhoto(): string;
    }
    /**
     * 玩家的签名信息
     */
    interface SignedPlayerInfo {
        /**
         * 玩家的id
         * Get the id of the player.
         */
        getPlayerID(): string;
        /**
         * 验证这个对象的签名确实来自Facebook。该字符串是base64url编码的，使用 HMAC 对您应用的 Sccret 进行签名，基于 OAuth 2.0 规范，
         * A signature to verify this object indeed comes from Facebook.
         */
        getSignature(): string;

    }
    /**
     * 要分享的内容
     */
    interface SharePayload {
        /**
         * 表示共享的目标
         * Indicates the intent of the share.
         * "INVITE" | "REQUEST" | "CHALLENGE" | "SHARE"
         */
        intent: string;
        /**
         * 要分享的图像，使用 base64 编码
         * A base64 encoded image to be shared.
         */
        image: string;
        /**
         * 要分享的文字
         * A text message to be shared.
         */
        text: string;
        /**
         * 一个附加到分享上的数据。
         * 所有从这个分享启动的游戏都可以通过  FBInstant.getEntryPointData() 方法获取到该数据。
         *  A blob of data to attach to the share.
         */
        data?: Object;
    }
    /**
     * 自定义更新内容
     */
    interface CustomUpdatePayload {
        /**
         * 对于自定义更新来说，该值应该为 'CUSTOM'.
         * For custom updates, this should be 'CUSTOM'.
         */
        action: string;
        /**
         * 自定义更新使用的模板的ID，模板应该在 fbapp-config.json 中预定义。
         * 查看配置文件说明：https://developers.facebook.com/docs/games/instant-games/bundle-config
         * ID of the template this custom update is using. 
         */
        template: string;
        /**
         * 可选，按钮文字。默认情况下，我们本地化的 'Play' 作为按钮文字。
         * Optional call-to-action button text. 
         */
        cta?: string;
        /**
         * base64 编码的图像信息
         * Data URL of a base64 encoded image.
         */
        image: string;
        /**
         * 文本信息
         * A text message, or an object with the default text as the value of 'default' and another object mapping locale keys to translations as the value of 'localizations'.
         */
        text: string;
        /**
         * 附加到更新上的数据。当游戏通过分享启动时，可以通过 FBInstant.getEntryPointData() 方法获取。
         * 该数据必须少于1000个字符。
         * A blob of data to attach to the update. 
         */
        data?: Object;
        /**
         * 指定更新的方式。
         *  Specifies how the update should be delivered. 
         * 'IMMEDIATE' - 默认值，立即发布更新
         * 'LAST' - 当游戏结束时，发布更新
         * 'IMMEDIATE_CLEAR' - 立即发布更新，并清除任何其他正在等待的更新
         */
        strategy?: string;
        /**
         * 指定自定义更新的通知设置。可以是“NO_PUSH”或“PUSH”，默认为“NO_PUSH”。
         * Specifies notification setting for the custom update.
         */
        notification?: string;
    }
    /**
     * 表示 FBInstant.updateAsync 的一项排行榜更新
     * Represents a leaderboard update for FBInstant.updateAsync.
     */
    interface LeaderboardUpdatePayload {
        /**
         * 对于排行榜更新，此属性应为 “LEADERBOARD”
         * For a leaderboard update, this should be 'LEADERBOARD'. text. 
         */
        action: string;
        /**
         * 更新排行榜的名称。
         * The name of the leaderboard to feature in the update.
         */
        name: string;
        /**
         * 可选的文本消息
         * Optional text message
         */
        text?: string;
    }
    interface APIError {
        /**
         * 错误码
         * The relevant error code
         */
        code: string;
        /**
         * 错误信息
         * A message describing the error
         */
        message: string;
    }
    interface Product {
        /**
         * 产品的名称
         * The title of the product
         */
        title: string,
        /**
         * 产品的游戏指定id
         * The product's game-specified identifier
         */
        productID: string,
        /**
         * 产品的描述
         * The product description
         */
        description: string,
        /**
         * 产品相关图片的链接
         * A link to the product's associated image
         */
        imageURI: string,
        /**
         * 产品的价格
         * The price of the product
         */
        price: string,
        /**
         * 产品的货币代码
         * The currency code for the product
         */
        priceCurrencyCode: string,
    }
    interface PurchaseConfig {
        /**
         * 产品id
         * The identifier of the product to purchase
         */
        productID: string,
        /**
         * 可选参数，开发人员指定的内容，将包含在返回的购买签名请求里。
         * An optional developer-specified payload, to be included in the returned purchase's signed request.
         */
        developerPayload: string,
    }
    interface Purchase {
        /**
         * 可选参数，开发人员指定的内容，将包含在返回的购买签名请求里。
         * A developer-specified string, provided during the purchase of the product
         */
        developerPayload: string,
        /**
         * 购买交易的标识符
         * The identifier for the purchase transaction
         */
        paymentID: string,
        /**
         * 产品id
         * The product's game-specified identifier
         */
        productID: string,
        /**
         * 发生购买时的Unix时间戳
         * Unix timestamp of when the purchase occurred
         */
        purchaseTime: string,
        /**
         * 代表可用于消费者购买时的token
         * A token representing the purchase that may be used to consume the purchase
         */
        purchaseToken: string,
        /**
         * 购买请求的服务器签名编码
         * Server-signed encoding of the purchase request
         */
        signedRequest: string,

    }
    /**
     * 排行榜
     * Leaderboard
     */
    interface Leaderboard {
        /**
         * 排行榜的名称
         * The name of the leaderboard.
         */
        getName(): string,
        /**
         * 排行榜的上下文id
         * The ID of the context that the leaderboard is associated with
         */
        getContextID(): string;
        /**
         * 获取排行榜中玩家总量
         * Fetches the total number of player entries in the leaderboard.
         */
        getEntryCountAsync(): Promise<number>;
        /**
         * 更新玩家的分数
         * Updates the player's score. 
         */
        setScoreAsync(score: number, extraData: string): Promise<LeaderboardEntry>;
        /**
         * 获取当前玩家游戏榜单的入口点
         * Retrieves the leaderboard's entry for the current player, or null if the player has not set one yet.
         */
        getPlayerEntryAsync(): Promise<LeaderboardEntry>;
        /**
         * 检索一组排行榜条目, 按排行榜中的评分顺序排序。
         * Retrieves a set of leaderboard entries, ordered by score ranking in the leaderboard.
         */
        getEntriesAsync(count: number, offset: number): Promise<LeaderboardEntry>;
        /**
         * 检索与当前玩家分数相邻的玩家(包括当前玩家)的排行榜分录，按照玩家的级别排序。
         * Retrieves the leaderboard score entries of the current player's connected players (including the current player), ordered by local rank within the set of connected players.
         */
        getConnectedPlayerEntriesAsync(count: number, offset: number): Promise<LeaderboardEntry>;
    }
    interface LeaderboardEntry {
        /**
         * 获取与该项关联的分数。
         * Gets the score associated with the entry.
         */
        getScore(): number;
        /**
         * 获取与该项关联的分数, 格式化为与排行榜关联的评分格式。
         * Gets the score associated with the entry, formatted with the score format associated with the leaderboard.
         */
        getFormattedScore(): string;
        /**
         * 获取上次更新排行榜条目的时间戳。
         * Gets the timestamp of when the leaderboard entry was last updated.
         */
        getTimestamp(): number;
        /**
         * 获取排行榜中玩家得分的等级。
         * Gets the rank of the player's score in the leaderboard.
         */
        getRank(): number;
        /**
         * 获取与分数关联的额外数据，由开发者设定
         * Gets the developer-specified payload associated with the score, or null if one was not set.
         */
        getExtraData(): string;
        /**
         * 获取有关与该项关联的玩家的信息。
         * Gets information about the player associated with the entry.
         */
        getPlayer(): LeaderboardPlayer

    }
    interface LeaderboardPlayer {
        /**
         * 玩家的名字
         * Gets the player's localized display name.
         */
        getName(): string;
        /**
         * 玩家的头像链接
         * Returns a url to the player's public profile photo.
         */
        getPhoto(): string;
        /**
         * 玩家的id
         * Gets the game's unique identifier for the player.
         */
        getID(): string;
    }
}
type FBContextFilter = "NEW_CONTEXT_ONLY" | "INCLUDE_EXISTING_CHALLENGES";
type FBPlatform = "IOS" | "ANDROID" | "WEB" | "MOBILE_WEB";

