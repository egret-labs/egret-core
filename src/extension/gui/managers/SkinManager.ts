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

module ns_egret {

    export class SkinManager{

        private static _impl:ISkinManager;
        /**
         * 获取单例
         */
        private static get impl():ISkinManager{
            if (!SkinManager._impl){
                try{
                    SkinManager._impl = Injector.getInstance("ISkinManager");
                }
                catch(e){
                    SkinManager._impl = new SkinManagerImpl();
                }
            }
            return SkinManager._impl;
        }
        /**
         * 根据关键字获取一个皮肤实例
         * @param key 皮肤的关键字
         */
        public static getSkin(key:string):any{
            return SkinManager.impl.getSkin(key);
        }
        /**
         * 为指定关键字添加一个皮肤映射
         * @param key 皮肤的关键字
         * @param skinData 皮肤的JSON描述文件,可为Object或JSON字符串。
         */
        public addSkin(key:string,skinData:any):void{
            SkinManager.impl.addSkin(key,skinData);
        }
    }
}