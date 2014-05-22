/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../core/ISkinAdapter.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.DefaultSkinAdapter
	 * @classdesc
	 * 默认的ISkinAdapter接口实现
	 * @implements ns_egret.ISkinAdapter
	 */
    export class DefaultSkinAdapter implements ISkinAdapter{
        /**
         * 构造函数
		 * @method ns_egret.DefaultSkinAdapter#constructor
         */
        public constructor(){
        }
        /**
         * 获取皮肤显示对象
         * @method ns_egret.ISkinAdapter#getSkin
         * @param skinName {any} 待解析的皮肤标识符
         * @param hostComponentKey {string} 主机组件标识符
         * @returns {any} 皮肤对象实例
         */
        public getSkin(skinName:any,hostComponentKey:string):any{
            if(skinName instanceof DisplayObject||skinName instanceof Skin){
                return skinName;
            }
            else if(typeof(skinName)=="string"){
                var clazz:any = getDefinitionByName(<string><any> skinName);
                if(clazz){
                    return new clazz();
                }
                else{
                    return null;
                }
            }
            else{
                return new skinName();
            }
        }
    }
}