namespace egret {

    /**
     * @private
     */
    export let fontMapping = {};

    /**
     * @language en_US
     * Register font mapping.
     * @param fontFamily The font family name to register.
     * @param value The font value.
     * @version Egret 3.2.3
     * @platform Native
     */
    /**
     * @language zh_CN
     * 注册字体映射
     * @param fontFamily 要注册的字体名称
     * @param value 注册的字体值
     * @version Egret 3.2.3
     * @platform Native
     */
    export function registerFontMapping(fontFamily:string,value:string):void {
        fontMapping[fontFamily] = value;
    }
}