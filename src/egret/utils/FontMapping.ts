namespace egret {

    /**
     * @private
     */
    export let fontMapping = {};
    /**
     * 兼容旧版本不使用 fontMapping 的情况
     * @private
     */
    export let useFontMapping:boolean = false;

    /**
     * Register font mapping.
     * @param fontFamily The font family name to register.
     * @param value The font value.
     * @version Egret 3.2.3
     * @platform Native
     * @language en_US
     */
    /**
     * 注册字体映射
     * @param fontFamily 要注册的字体名称
     * @param value 注册的字体值
     * @version Egret 3.2.3
     * @platform Native
     * @language zh_CN
     */
    export function registerFontMapping(fontFamily:string,value:string):void {
        useFontMapping = true;
        fontMapping[fontFamily] = value;
    }
}