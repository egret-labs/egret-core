/** Created with JetBrains WebStorm.
 * User: yjtx
 * Date: 14-8-17
 * Time: 上午12:56
 * Class: DOMTrans
 * Summary:
 */

module egret_dom {

    export var header:string = "";

    /**
     * 获取当前浏览器的类型
     * @returns {string}
     */
    export function getHeader():string {
        var tempStyle = document.createElement('div').style;
        var transArr:Array<string> = ["t", "webkitT", "msT", "MozT", "OT"];
        for (var i:number = 0; i < transArr.length; i++) {
            var transform:string = transArr[i] + 'ransform';

            if (transform in tempStyle)
                return transArr[i];
        }

        return transArr[0];
    }

    /**
     * 获取当前浏览器类型
     * @type {string}
     */
    export function getTrans(type:string):string {
        if (header == "") {
            header = getHeader();
        }

        return header + type.substring(1, type.length);
    }
}