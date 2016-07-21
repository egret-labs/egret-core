declare module nest {
    type userSupportCallbackType = (resultInfo: nest.user.UserSupportCallbackInfo) => void;
    type shareSupportCallbackType = (resultInfo: nest.share.ShareSupportCallbackInfo) => void;
    type socialSupportCallbackType = (resultInfo: nest.social.SocialSupportCallbackInfo) => void;
    type appSupportCallbackType = (resultInfo: nest.app.AppSupportCallbackInfo) => void;
    module core {
        interface ResultCallbackInfo {
            /**
             * 回调参数是否正确，0 正确，-1 用户取消操作, -2 失败，-3 平台登陆账号被踢掉，需要重新登陆, 其他 未知错误
             */
            result: number;
        }
        interface StartupInfo {
            /**
             * egret 平台分配的 AppId
             */
            egretAppId: number;
            /**
             * 使用的 Nest 版本,默认为1
             * 使用新版 Nest 接口请传2
             */
            version?: number;
            /**
             * 是否是debug模式,debug模式在调用各个接口均有日志输出
             */
            debug?: boolean;
        }
    }
    interface core {
    }
    var core: {
        /**
         * 启动Nest
         * @param startupInfo 启动参数
         * @param callback 启动完成回调
         * @example 以下代码设置appId为 88888,启动Nest
         * <pre>
         *     nest.core.startup({egretAppId:88888}, function (){
         *         //do something
         *     });
         * </pre>
         */
        startup(startupInfo: nest.core.StartupInfo, callback: (resultInfo: nest.core.ResultCallbackInfo) => void): void;
        callCustomMethod(customInfo: any, callback: Function): void;
    };
    /**
     * 登录功能逻辑：
     * 1.初始化项目数据
     * 2.在游戏中展示一张登录背景界面
     * 3.调用 checkLogin 函数判断是否已经登录过，如果登录过，进入步骤7，否则进入步骤4
     * 4.调用 isSupport 函数判断支持的登录类型，根据登录类型显示对应的登录图标
     * 5.用户点击登录图标后，调用 login 函数打开登录面板进行登录
     * 6.如果登录成功，进入步骤7
     * 7.退出登录界面，进入游戏
     *
     * 登出功能逻辑：
     * 1.在游戏中放置一个“退出游戏”或者“切换账号”的按钮
     * 2.用户点击“退出游戏”图标后，调用 logout 函数
     * 3.在登出成功后，返回到登录逻辑的步骤4
     */
    module user {
        /**
         * 登录接口传递参数
         *
         */
        interface LoginInfo {
            /**
             * 登录类型：如 <code>qq</code>表示QQ登录，<code>wx</code>表示微信支付。
             * 如果没有，则不需要赋值
             */
            loginType?: string;
        }
        interface LoginCallbackInfo extends core.ResultCallbackInfo {
            /**
             * checkLogin , login 函数返回。
             * 用户 token 信息，如果checkLogin函数中没有token则表示用户尚未登录
             */
            token: string;
        }
        interface UserSupportCallbackInfo extends core.ResultCallbackInfo {
            /**
             * isSupport 函数返回。
             * 登录方式。
             * 以QQ浏览器为例，返回 ["qq","wx"]
             * 开发者应该主动判断登录方式，如果返回了 null ，则表示没有特殊登录方式
             * 需要优先判断loginTypes,如果有loginTypes用loginTypes里面的值
             */
            loginType: Array<string>;
            /**
             * isSupport 函数返回。
             * 登录方式。
             * 以QQ浏览器为例，返回 [{loginType:"qq",accInfo:{nickName:"",avatarUrl:""}},{loginType:"wx",accInfo:{nickName:"",avatarUrl:""}}]
             * 开发者应该主动判断登录方式，如果返回了 null ，则表示没有特殊登录方式
             */
            loginTypes: Array<Object>;
            /**
             * 是否支持获取用户信息
             */
            getInfo?: number;
        }
    }
    module user {
        /**
         * 检测是否已登录
         * @param loginInfo 请传递一个{}
         * @param callback
         * @callback-param  @see nest.user.LoginCallbackInfo
         * @example 以下代码检测是否已经登录
         * <pre>
         *     nest.user.checkLogin({}, function (data){
         *         if(data.result == 0) {
         *             //已经登录,获取登陆token信息
         *             var token = data.token;
         *         }
         *         else {
         *             //没有登录,之后需要用nest.user.isSupport接口获取loginType并根据loginType显示登录界面
         *         }
         *     });
         * </pre>
         */
        var checkLogin: (loginInfo: nest.user.LoginInfo, callback: (resultInfo: nest.user.LoginCallbackInfo) => void) => void;
        /**
         * 调用渠道登录接口
         * @param loginInfo
         * @param callback
         * @callback-param  @see nest.user.LoginCallbackInfo
         * @example 以下代码调用渠道登录接口
         * <pre>
         *     nest.user.login({}, function (data){
         *         if(data.result == 0) {
         *             //登陆成功,获取用户token
         *             var token = data.token;
         *         }
         *         else {
         *             //登录失败,需要重新登录
         *         }
         *     });
         * </pre>
         */
        var login: (loginInfo: nest.user.LoginInfo, callback: (resultInfo: nest.user.LoginCallbackInfo) => void) => void;
        /**
         * 登出接口
         * @param loginInfo 登出参数,没有可以传递{}
         * @param callback 回调函数
         * @callback-param   { result : 0 };
         * @example 以下代码调用渠道登出接口
         * <pre>
         *     nest.user.logout({}, function (data){
         *         if(data.result == 0) {
         *             //登出成功,需要显示登陆界面供玩家重新登录
         *             //这里后续不需要继续调用nest.user.checkLogin
         *         }
         *         else {
         *             //登出失败,可能相应渠道不支持登出
         *         }
         *     });
         * </pre>
         */
        var logout: (loginInfo: nest.user.LoginInfo, callback: (resultInfo: core.ResultCallbackInfo) => void) => void;
        /**
         * 检测支持何种登录方式
         * @param info 请传递一个{}
         * @param callback 回调函数
         * @callback-param  @see nest.user.UserSupportCallbackInfo
         * @example 以下代码进行检测支持何种登录方式
         * <pre>
         *     nest.user.isSupport({}, function (data){
         *         if(data.result == 0) {
         *             //获取渠道支持的登陆方式,并根据登录方式显示登陆界面
         *             var loginType = data.loginType;
         *             //获取渠道是否支持获得用户信息接口,如果支持可以使用nest.user.getInfo获取用户信息
         *             var isSupportGetUserInfo = data.getInfo == 1;
         *         }
         *     });
         * </pre>
         */
        var isSupport: (info: Object | userSupportCallbackType, callback?: userSupportCallbackType) => void;
        /**
         * 获取用户信息，目前只有qq浏览器runtime支持
         * @param callback 回调函数
         * @example 以下代码获取用户信息
         * <pre>
         *     nest.user.getInfo({}, function (data){
         *         if(data.result == 0) {
         *             var msg = data.msg;              //传回的提示信息
         *             var nickName = data.nickName;     //昵称
         *             var avatarUrl = data.avatarUrl;  //头像
         *             var sex = data.sex;              //性别, 0未知，1男，2女
         *             var city = data.city;            //城市
         *             var language = data.language;    //语言
         *             var isVip = data.isVip;          //是否vip, 1是，0不是
         *             var province = data.province;    //省份
         *             var country = data.country;      //国家
         *         }
         *     });
         * </pre>
         */
        var getInfo: (loginInfo: nest.user.LoginInfo, callback: (resultInfo: Object) => void) => void;
    }
    module iap {
        interface PayInfo {
            goodsId: string;
            goodsNumber: string;
            serverId: string;
            ext: string;
        }
        interface PayCallbackInfo extends core.ResultCallbackInfo {
            ext?: string;
        }
    }
    interface iap {
    }
    var iap: {
        /**
         * 支付
         * @param payInfo 支付信息
         * @param callback 支付回调
         * @example 以下代码进行支付
         * <pre>
         *     nest.iap.pay({goodsId:"1",goodsNumber:"1",serverId:"1",ext:"msg"}, function (data){
         *         if(data.result == 0) {
         *             //支付成功
         *         }
         *         else {
         *             //支付失败
         *         }
         *     });
         * </pre>
         */
        pay(payInfo: nest.iap.PayInfo, callback: (result: nest.iap.PayCallbackInfo) => void): void;
    };
    module share {
        /**
         * 分享接口传递参数
         */
        interface ShareInfo {
            /**
             * 分享标题
             */
            title: string;
            /**
             * 分享文字内容
             */
            description: string;
            /**
             * 分享图片标题
             */
            img_title: string;
            /**
             * 分享图标地址
             */
            img_url: string;
            /**
             * 分享地址
             */
            url: string;
        }
        interface ShareCallbackInfo extends core.ResultCallbackInfo {
        }
        interface ShareSupportCallbackInfo extends core.ResultCallbackInfo {
            share: number;
        }
    }
    interface share {
    }
    var share: {
        /**
         * 是否支持分享
         * @param info 请传递一个{}
         * @param callback 回调函数
         * @example 以下代码获取是否支持分享
         * <pre>
         *     nest.share.isSupport({}, function (data){
         *         if(data.result == 0) {
         *             //获取是否支持分享
         *             var share = data.share == 1;
         *         }
         *     });
         * </pre>
         */
        isSupport(info: Object | shareSupportCallbackType, callback?: shareSupportCallbackType): void;
        /**
         * 设置默认分享内容,以便某些渠道在游戏外点击分享按钮时显示分享内容
         * @param shareInfo
         * @param callback
         * @callback-param result 0 表示成功，-2表示失败
         */
        setDefaultData(shareInfo: nest.share.ShareInfo, callback: Function): void;
        /**
         * 分享
         * @param shareInfo 分享参数
         * @param callback 回调函数
         * @callback-param result 0 表示分享成功，-1表示用户取消
         * @example 以下代码获取是否支持分享
         * <pre>
         *     var shareInfo = {title:"title", description:"description", img_title:"img_title", img_url:"http://www.example.com/example.jpg", url:"http://www.example.com"};;
         *     nest.share.share(shareInfo, function (data) {
         *         if(data.result == 0) {
         *             //分享成功
         *         }
         *         else {
         *             //分享失败
         *         }
         *     });
         * </pre>
         */
        share(shareInfo: share.ShareInfo, callback: (resultInfo: share.ShareCallbackInfo) => void): void;
    };
    module social {
        /**
         * social接口传递参数
         */
        interface SocialSupportCallbackInfo extends core.ResultCallbackInfo {
            getFriends?: number;
            openBBS?: number;
        }
    }
    interface social {
    }
    var social: {
        /**
         * social接口支持
         * @param info 请传递一个{}
         * @param callback 回调函数
         * @example 以下代码获取是否支持
         * <pre>
         *     nest.social.isSupport({}, function (data){
         *         if(data.result == 0) {
         *             //获取是否支持获得好友列表
         *             var getFriends = data.getFriends == 1;
         *             //获取是否支持打开BBS
         *             var openBBS = data.openBBS == 1;
         *         }
         *     });
         * </pre>
         */
        isSupport(info: Object | socialSupportCallbackType, callback?: socialSupportCallbackType): void;
        getFriends(socialInfo: any, callback: (resultInfo: core.ResultCallbackInfo) => void): void;
        /**
         * 打开BBS
         * @param socialInfo 请传递一个{}
         * @param callback 回调
         * @example 以下代码进行打开BBS
         * <pre>
         *     nest.social.openBBS({}, function (data){
         *         if(data.result == 0) {
         *             //打开成功
         *         }
         *         else {
         *             //打开失败
         *         }
         *     });
         * </pre>
         */
        openBBS(socialInfo: any, callback: (resultInfo: core.ResultCallbackInfo) => void): void;
    };
    module app {
        interface AppSupportCallbackInfo extends core.ResultCallbackInfo {
            attention?: number;
            sendToDesktop?: number;
            exitGame?: number;
            getInfo?: number;
        }
        interface GetInfoCallbackInfo extends core.ResultCallbackInfo {
            contact: ContactInfo;
        }
        interface ContactInfo {
            qq?: string[];
            qqgroup?: string[];
            weixin?: string[];
            email?: string[];
        }
        /**
         * 发送到桌面
         */
        interface SendToDesktopInfo {
            /**
             * 透传参数
             */
            ext: string;
        }
    }
    interface app {
    }
    var app: {
        /**
         * 是否支持特定功能
         * @param info 请传递一个{}
         * @param callback 回调函数
         * @callback-param  { result:"0" , attention :"1" , sendToDesktop : "1" , exitGame : "1" , getInfo : "1"}
         * attention|sendToDesktop|exitGame|getInfo 1支持 0不支持
         */
        isSupport(info: Object | appSupportCallbackType, callback?: appSupportCallbackType): void;
        /**
         * 关注
         * @param appInfo
         * @param callback
         */
        attention(appInfo: any, callback: (resultInfo: core.ResultCallbackInfo) => void): void;
        /**
         * 退出游戏，回到 App 界面
         * @param appInfo
         * @param callback
         */
        exitGame(appInfo: any, callback: (resultInfo: core.ResultCallbackInfo) => void): void;
        /**
         * 发送到桌面
         * @param appInfo
         * @param callback
         * @param callback-param result 0表示添加桌面成功，-1表示添加失败
         */
        sendToDesktop(appInfo: app.SendToDesktopInfo, callback: (resultInfo: core.ResultCallbackInfo) => void): void;
        /**
         * 获取渠道信息
         * @param appInfo 获取信息参数,没有请传递{}
         * @param callback 回调函数
         * 回调参数:
         * {
         * "result": , //result为0说明成功
         * "contact": , //可用联系方式
         *   "qq": //qq联系方式数组[],如果没有响应联系方式将没有该字段
         *   "qqgroup": //qq群联系方式数组[],如果没有响应联系方式将没有该字段
         *   "weixin": //微信联系方式数组[],如果没有响应联系方式将没有该字段
         *   "email": //email联系方式数组[],如果没有响应联系方式将没有该字段
         * }
         */
        getInfo(appInfo: any, callback: (resultInfo: app.GetInfoCallbackInfo) => void): void;
    };
}
declare module nest {
    module easyuser {
        /**
         * 启动Nest
         * @param startupInfo 启动参数
         * @param callback 启动完成回调
         * @example 以下代码设置appId为 88888,启动Nest
         * <pre>
         *     nest.core.startup({egretAppId:88888}, function (){
         *         //do something
         *     });
         * </pre>
         */
        function startup(startupInfo: nest.core.StartupInfo, callback: (data: core.ResultCallbackInfo) => any): void;
        /**
         * 获取登录按钮类型。登出后再次登录前此方法需要重新调用。
         * 目前为止出现能为 qq（显示 qq 按钮）、wx（显示微信按钮）、default（显示一个游戏内的默认按钮），可能只有1个）
         */
        function getLoginTypes(): Array<ILoginType>;
        /**
         * 单个按钮的信息
         */
        interface ILoginType {
            /**
             * 登录类型
             */
            loginType: string;
            /**
             * 不存在，则不需要显示具体的内容
             */
            accInfo?: {
                nickName?: string;
                avatarUrl?: string;
            };
        }
        /**
         * 调用渠道登录接口，调用登录接口前，请先根据 nest.easyuser.getLoginTypes 来获取实际显示的按钮类型。
         * @param loginInfo
         * @param callback
         * @callback-param  @see nest.user.LoginCallbackInfo
         * @example 以下代码调用渠道登录接口
         * <pre>
         *     nest.user.login({}, function (data){
         *         if(data.result == 0) {
         *             //登陆成功,获取用户token
         *             var token = data.token;
         *         }
         *         else {
         *             //登录失败,需要重新登录
         *         }
         *     });
         * </pre>
         */
        function login(loginInfo: nest.user.LoginInfo, callback: (resultInfo: nest.user.LoginCallbackInfo) => void): void;
        /**
         * 登出接口
         * @param loginInfo 登出参数,没有可以传递{}
         * @param callback 回调函数
         * @callback-param   { result : 0 };
         * @example 以下代码调用渠道登出接口
         * <pre>
         *     nest.easyuser.logout({}, function (data){
         *         if(data.result == 0) {
         *             //登出成功,需要显示登陆界面供玩家重新登录
         *             //这里后续不需要继续调用nest.user.checkLogin
         *         }
         *         else {
         *             //登出失败,可能相应渠道不支持登出
         *         }
         *     });
         * </pre>
         */
        function logout(loginInfo: nest.user.LoginInfo, callback: (data: nest.core.ResultCallbackInfo) => void): void;
        interface UserSupportCallbackInfo extends core.ResultCallbackInfo {
            /**
             * 是否支持获取用户信息
             */
            getInfo: number;
        }
        /**
         * 检测支持何种登录方式
         * @param info 请传递一个{}
         * @param callback 回调函数
         * @callback-param  @see nest.user.UserSupportCallbackInfo
         * @example 以下代码进行检测支持何种登录方式
         * <pre>
         *     nest.user.isSupport({}, function (data){
         *         if(data.result == 0) {
         *             //获取渠道是否支持获得用户信息接口,如果支持可以使用nest.user.getInfo获取用户信息
         *             var isSupportGetUserInfo = data.getInfo == 1;
         *         }
         *     });
         * </pre>
         */
        function isSupport(info: Object, callback: (resultInfo: easyuser.UserSupportCallbackInfo) => void): void;
        /**
         * 获取用户信息，目前只有qq浏览器runtime支持
         * @param callback 回调函数
         * @example 以下代码获取用户信息
         * <pre>
         *     nest.user.getInfo({}, function (data){
         *         if(data.result == 0) {
         *             var msg = data.msg;              //传回的提示信息
         *             var nickName = data.nickName;     //昵称
         *             var avatarUrl = data.avatarUrl;  //头像
         *             var sex = data.sex;              //性别, 0未知，1男，2女
         *             var city = data.city;            //城市
         *             var language = data.language;    //语言
         *             var isVip = data.isVip;          //是否vip, 1是，0不是
         *             var province = data.province;    //省份
         *             var country = data.country;      //国家
         *         }
         *     });
         * </pre>
         */
        function getInfo(loginInfo: nest.user.LoginInfo, callback: (resultInfo: Object) => void): void;
    }
}
declare module nest.utils {
    var $API_DOMAIN: string;
    var $APP_ID: number;
    var $DEBUG_LOG: boolean;
    var $EGRET_SUPPORT: boolean;
    function $changeMethod(version: string): void;
    var $isRuntime: boolean;
    var $spid: number;
    function $getSpid(): number;
    function $getChannelTag(): string;
    function $isQQBrowser(): boolean;
    function $isTargetPlatform(target: number): boolean;
    function $getOption(key: string): string;
    function $log(msg: string): void;
    function setProxy(url: string, postData: Object, method: string, callback: Function, errCallback: Function): void;
}
/**
 * @private
 */
declare module nest.runtime {
    module core {
        function callCustomMethod(customInfo: any, callback: Function): void;
    }
    module user {
        function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
        function checkLogin(loginInfo: nest.user.LoginInfo, callback: Function): void;
        function login(loginInfo: nest.user.LoginInfo, callback: Function): void;
        function logout(loginInfo: nest.user.LoginInfo, callback: Function): void;
        function getInfo(loginInfo: nest.user.LoginInfo, callback: (resultInfo: Object) => void): void;
    }
    module iap {
        function pay(orderInfo: nest.iap.PayInfo, callback: Function): void;
    }
    module share {
        function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
        function setDefaultData(shareInfo: nest.share.ShareInfo, callback: Function): void;
        function share(shareInfo: nest.share.ShareInfo, callback: Function): void;
    }
    module social {
        function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
        function getFriends(socialInfo: any, callback: Function): void;
        function openBBS(socialInfo: any, callback: Function): void;
    }
    module app {
        function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
        function attention(appInfo: any, callback: Function): void;
        function exitGame(appInfo: any, callback: Function): void;
        function sendToDesktop(appInfo: any, callback: Function): void;
        function getInfo(appInfo: any, callback: Function): void;
    }
    interface NestData {
        module: string;
        action: string;
        param?: any;
    }
    function callRuntime(data: NestData, callback: any, parallel?: boolean): void;
    function _getData(): void;
}
declare module nest.cm {
    interface EgretData {
        egretUserId: string;
    }
    interface NestData {
        module: string;
        action: string;
        param?: any;
        postData?: any;
    }
    function callRuntime(data: NestData, callback: any): void;
    function loginBefore(callback: any): void;
    function loginAfter(postdata: any, callback: any, isNew: boolean): void;
    function payBefore(orderInfo: nest.iap.PayInfo, callback: any): void;
}
declare module nest.cm.user {
    var egretInfo: any;
    function checkLogin(loginInfo: nest.user.LoginInfo, callback: any): void;
    /**
     * @private
     * 调用渠道登录接口
     * @param loginInfo
     * @param callback
     * @callback-param  @see nest.user.LoginCallbackInfo
     */
    function login(loginInfo: nest.user.LoginInfo, callback: Function): void;
    function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
    function logout(loginInfo: nest.user.LoginInfo, callback: Function): void;
}
declare module nest.cm.iap {
    /**
     * 支付
     * @param orderInfo
     * @param callback
     */
    function pay(orderInfo: nest.iap.PayInfo, callback: Function): void;
}
/**
 * @private
 */
declare module nest.cm.social {
    function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
    function getFriends(socialInfo: any, callback: Function): void;
    function openBBS(socialInfo: any, callback: Function): void;
}
declare module nest.cm.share {
    /**
     * 是否支持分享
     * @priavte
     * @param callback
     * @callback-param {status:0, share:0}
     */
    function isSupport(info: Object | shareSupportCallbackType, callback?: shareSupportCallbackType): void;
}
declare module nest.cm.app {
    /**
     * @private
     */
    interface IDesktopInfo {
        Title: string;
        DetailUrl: string;
        PicUrl: string;
    }
    /**
     * @private
     * 初始化浏览器快捷登陆需要的信息（目前只有猎豹可用，其他为空实现）
     * @param param
     */
    function $initDesktop(param: IDesktopInfo): void;
    /**
     * @private
     * 是否支持特定功能
     * @param callback
     * @callback-param  { status:"0" , attention :"1" , sendToDesktop : "1"}
     */
    function isSupport(info: Object | appSupportCallbackType, callback?: appSupportCallbackType): void;
    /**
     * @private
     * 发送到桌面
     * @param appInfo
     * @param callback
     * @param callback-param result 0表示添加桌面成功，-1表示添加失败
     */
    function sendToDesktop(appInfo: any, callback: Function): void;
}
/**
 * @private
 */
declare module nest.qqhall {
    var login_call_type: number;
    var login_back_call_type: number;
    var pay_call_type: number;
    var share_call_type: number;
    var login_callback_type: number;
    var pay_callback_type: number;
    var share_callback_type: number;
    var loginCallback: Function;
    var payCallback: Function;
    var shareCallback: Function;
    var version: string;
    var loginNum: number;
    var gameType: any;
    var gameVersion: any;
    var OpenId: any;
    var OpenKey: any;
    var enterType: any;
    var enterId: any;
    var payToken: any;
    var userId: any;
    var payOrderInfo: any;
    function payBefore(orderInfo: nest.iap.PayInfo, callback: any): void;
    function callHall(data: any): void;
    function init(): void;
}
/**
 * @private
 */
declare module nest.qqhall.user {
    function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
    function checkLogin(loginInfo: nest.user.LoginInfo, callback: Function): void;
    function login(loginInfo: nest.user.LoginInfo, callback: Function): void;
}
/**
 * @private
 */
declare module nest.qqhall.iap {
    function pay(orderInfo: nest.iap.PayInfo, callback: Function): void;
    /**
     * 大厅充值成功后，再次调用付费接口
     */
    function repay(): void;
}
/**
 * @private
 */
declare module nest.qqhall.app {
    function isSupport(info: Object | appSupportCallbackType, callback?: appSupportCallbackType): void;
    function exitGame(callback: Function): void;
    function attention(appInfo: any, callback: Function): void;
    function sendToDesktop(appInfo: any, callback: Function): void;
}
/**
 * @private
 */
declare module nest.qqhall.share {
    function isSupport(info: Object | shareSupportCallbackType, callback?: shareSupportCallbackType): void;
    /**
     * 分享
     * @param shareInfo
     * @param callback
     * @callback-param result 0 表示分享成功，-1表示用户取消
     */
    function share(shareInfo: nest.share.ShareInfo, callback: Function): void;
}
/**
 * @private
 */
declare module nest.qqhall.social {
    function isSupport(info: Object | socialSupportCallbackType, callback?: socialSupportCallbackType): void;
    function getFriends(socialInfo: any, callback: Function): void;
    function openBBS(socialInfo: any, callback: Function): void;
}
/**
 * @private
 */
declare module nest.qqhall2 {
    function init(): void;
    module user {
        function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
        function checkLogin(loginInfo: nest.user.LoginInfo, callback: Function): void;
        function login(loginInfo: nest.user.LoginInfo, callback: Function): void;
    }
    module iap {
        function pay(orderInfo: nest.iap.PayInfo, callback: Function): void;
        /**
         * 大厅充值成功后，再次调用付费接口
         */
        function repay(): void;
    }
    module app {
        function isSupport(info: Object | appSupportCallbackType, callback?: appSupportCallbackType): void;
        function exitGame(appInfo: any, callback: (resultInfo: core.ResultCallbackInfo) => void): void;
        function attention(appInfo: any, callback: Function): void;
        function sendToDesktop(appInfo: any, callback: Function): void;
    }
    module share {
        function isSupport(info: Object | shareSupportCallbackType, callback?: shareSupportCallbackType): void;
        /**
         * 分享
         * @param shareInfo
         * @param callback
         * @callback-param result 0 表示分享成功，-1表示用户取消
         */
        function share(shareInfo: nest.share.ShareInfo, callback: Function): void;
    }
    module social {
        function isSupport(info: Object | socialSupportCallbackType, callback?: socialSupportCallbackType): void;
        function getFriends(socialInfo: any, callback: Function): void;
        function openBBS(socialInfo: any, callback: Function): void;
    }
}
/**
 * @private
 */
declare module nest.h5 {
    var uid: number;
    module user {
        function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
        function checkLogin(loginInfo: nest.user.LoginInfo, callback: Function): void;
        function login(loginInfo: nest.user.LoginInfo, callback: Function): void;
        function logout(loginInfo: nest.user.LoginInfo, callback: Function): void;
    }
    module iap {
        function pay(orderInfo: nest.iap.PayInfo, callback: Function): void;
    }
    module share {
        function isSupport(info: Object | shareSupportCallbackType, callback?: shareSupportCallbackType): void;
        function share(shareInfo: nest.share.ShareInfo, callback: Function): void;
    }
    module social {
        function isSupport(info: Object | socialSupportCallbackType, callback?: socialSupportCallbackType): void;
        function getFriends(data: any, callback: Function): void;
        function openBBS(data: any, callback: Function): void;
    }
    module app {
        function isSupport(info: Object | appSupportCallbackType, callback?: appSupportCallbackType): void;
        function attention(appInfo: any, callback: Function): void;
        function sendToDesktop(appInfo: any, callback: Function): void;
        function getInfo(appInfo: any, callback: Function): void;
    }
}
/**
 * @private
 */
declare module nest.h5_2 {
    module user {
        function isSupport(info: Object | userSupportCallbackType, callback?: userSupportCallbackType): void;
        function checkLogin(loginInfo: nest.user.LoginInfo, callback: Function): void;
        function login(loginInfo: nest.user.LoginInfo, callback: Function): void;
        function logout(loginInfo: nest.user.LoginInfo, callback: Function): void;
        function getInfo(loginInfo: nest.user.LoginInfo, callback: Function): void;
    }
    module iap {
        function pay(orderInfo: nest.iap.PayInfo, callback: Function): void;
    }
    module share {
        function isSupport(info: Object | shareSupportCallbackType, callback?: shareSupportCallbackType): void;
        function setDefaultData(shareInfo: nest.share.ShareInfo, callback: Function): void;
        function share(shareInfo: nest.share.ShareInfo, callback: Function): void;
    }
    module social {
        function isSupport(info: Object | socialSupportCallbackType, callback?: socialSupportCallbackType): void;
        function getFriends(data: any, callback: Function): void;
        function openBBS(data: any, callback: Function): void;
    }
    module app {
        function isSupport(info: Object | appSupportCallbackType, callback?: appSupportCallbackType): void;
        function attention(appInfo: any, callback: Function): void;
        function sendToDesktop(appInfo: any, callback: Function): void;
        function exitGame(appInfo: any, callback: Function): void;
        function getInfo(appInfo: any, callback: Function): void;
    }
}
