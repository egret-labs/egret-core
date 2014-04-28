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

/// <reference path="../core/Logger.ts"/>
/// <reference path="../core/Ticker.ts"/>
/// <reference path="../events/Event.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="ResourceLoader.ts"/>

module ns_egret{

    /**
     * 是egret的加载控制器，他包含了一个或者一组ResourceLoader，控制其加载队列和调用加载界面更新进度。
     * @class ns_egret.LoadingController
     */
    export class LoadingController extends ns_egret.EventDispatcher {
        static LOAD_STATE_IDLE = 0;
        static LOAD_STATE_LOADING = 1;

        private _resourceUrlList:Array<ns_egret.ResourceLoader> = null;
        private _currentIndex:number = 0;
        private _loadingView:ILoadingView;
        private _state = ns_egret.LoadingController.LOAD_STATE_IDLE;
        private _currentResource:ResourceLoader;

        /**
         * 添加资源
         * @method ns_egret.LoadingController#addResource
         * @param url {string} 加载url
         * @param type {string} 加载类型
         */
        public addResource(url:string, type:string = null):void {
            if (this.checkIsLoading()) {
                return;
            }
            //todo:这个判断可以放在构造函数里
            if (this._resourceUrlList == null) {
                this._resourceUrlList = [];
            }
            var resource = ns_egret.ResourceLoader.create(url,type);
            if (this._resourceUrlList.indexOf(resource) == -1 && resource.state != ns_egret.ResourceLoader.LOAD_STATE_LOADED){
                this._resourceUrlList.push(resource);
            }
        }

        /**
         * 开始加载
         * @method ns_egret.LoadingController#load
         */
        public load():void {
            if (this.checkIsLoading()) {
                return;
            }
            if (this._resourceUrlList != null && this._resourceUrlList.length > 0) {
                this._state = LoadingController.LOAD_STATE_LOADING;
                this._currentIndex = 0;
                //todo
                if (this._loadingView != null) {
                    this._loadingView.addToStage();
                }
                this.next(null);
            }
            else{
                ns_egret.Ticker.getInstance().callLater(this.onComplete,this);
            }
        }

        private onComplete(){
            this._state = LoadingController.LOAD_STATE_IDLE;
            this.destroy();
            this.dispatchEventWith(ResourceLoader.LOAD_COMPLETE);

        }

        private checkIsLoading():boolean {
            if (this._state == LoadingController.LOAD_STATE_LOADING) {
                ns_egret.Logger.info("正在加载中");
                return true;
            }
            return false;
        }

        private next(event:Event) {
            this.removeResourceEvent();
            this.onProgress();
            if (this._resourceUrlList.length > this._currentIndex) {
                this._currentResource = this._resourceUrlList[this._currentIndex];
                this._currentResource.addEventListener(ns_egret.ResourceLoader.LOAD_COMPLETE, this.next, this);
                this._currentResource.load();
            }
            else {
                this.onComplete();
            }
            this._currentIndex++;
        }

        private removeResourceEvent(){
            if(this._currentResource)
            {
                this._currentResource.removeEventListener(ns_egret.ResourceLoader.LOAD_COMPLETE, this.next, this);
                this._currentResource = null;
            }
        }

        private onProgress() {
            if (this._loadingView != null) {
                this._loadingView.onProgress(this._currentIndex, this._resourceUrlList.length);
            }
        }

        /**
         * 设置加载进度界面
         * @method ns_egret.LoadingController#setLoadingView
         * @param view {ns_egret.ILoadingView}
         */
        public setLoadingView(view:ILoadingView) {
            if (this._loadingView != null) {
                this._loadingView.removeFromStage();
                this._loadingView = null;
            }
            this._loadingView = view;
        }

        private destroy() {
            this.removeResourceEvent();
            if (this._loadingView != null) {
                this._loadingView.removeFromStage();
                this._loadingView = null;
            }
            this._resourceUrlList = null;
        }
    }
}