

//Copyright (c) 2014-present, Egret Technology.
//for fbinstant.2.1.js
declare class FBInstant {
    /**
     * 获取用户的地域信息，例如:zh_CN en_US
     */
    static getLocale(): string;
    /**
     * 获取运行的平台信息，例如:iOS, android 和 web
     */
    static getPlatform(): string;
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
     * 游戏已完成加载资源，用户点击了开始游戏的按钮
     * 返回一个 Promise 方法
     */
    static startGameAsync(): Promise<void>;
    /**
     * 获取用户信息
     */
    static player: FBPlayer;
    /**
     * 当前游戏的来源信息
     */
    static context: Context;
    /**
     * SDK 的版本号，例如: '2.0'
     */
    static getSDKVersion(): string;    
    
    /**
     * 通知 Facebook 平台当前的分数
     * @param score 玩家在游戏里的分数
     */
    static setScore(score: number): void;
    /**
     * 显示平台统一的游戏结束画面
     * 当游戏重新开始的时候，返回一个 Promise 方法。
     */
    static endGameAsync(): Promise<void>;
    /**
     * 进行截屏，用户以后可以分享给好友。
     */
    static takeScreenshotAsync(): Promise<void>;
    /**
     * 发送分享给好友的截屏画面。
     * @param base64picture 把截图进行 base64 编码后的字符串
     */
    static sendScreenshotAsync(base64picture: string): Promise<void>;
    /**
     * 遇到错误中止游戏。只有当游戏进入不可恢复的状态时才可被调用。
     * @param e 错误信息
     */
    static abort(e: any): void;
}
interface FBPlayer{
    /**
     * 用户的唯一标识ID
     */
    getID(): string;
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
    getDataAsync(keys: string[]): Promise<void>;
    /**
     * 把当前用户的数据储存在FB平台上。
     * @param data 包含key-value的数据对象.
     */
    setDataAsync(data :Object): Promise<void>;
}
/**
 * 当前游戏的来源信息
 */
interface Context{
    /**
     * 当前游戏来源的唯一id
     */
    getID(): string;
    /**
     * 游戏的来源类型：'post', 'thread', 'group', or 'solo'
     */
    getType(): string;
}