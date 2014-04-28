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
    /**
     * ILoadingView是加载进度条的接口，所有的加载进度条都需要实现如下方法，并通过LoadingController.setLoadingView(view)来调用
     * @interface
     * @class ns_egret.ILoadingView
     */
    export interface ILoadingView{

        /**
         * 将进度条添加到舞台
         * @method ns_egret.ILoadingView#addToStage
         */
        addToStage();

        /**
         * 将进度条从舞台中移除
         * @method ns_egret.ILoadingView#removeFromStage
         */
        removeFromStage();

        /**
         * 更新进度条
         * @callback ns_egret.ILoadingView#onProgress
         * @param current
         * @param total
         *
         */
        onProgress(current:number, total:number);
    }
}