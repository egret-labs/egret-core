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

/// <reference path="ILoadingView.ts"/>
///<reference path="../egret.d.ts"/>

module ns_egret{

    /**
     * 是egret的加载控制器，他包含了一个或者一组ResourceLoader，控制其加载队列和调用加载界面更新进度。
     * @class ns_egret.LoadingController
     */
    export class LoadingController extends EventDispatcher {

        public prefix:string = "";

        private urlList:Array<string> = [];
        private typeList:Array<string> = [];
        /**
         * 添加资源
         * @method ns_egret.LoadingController#addResource
         * @param url {string} 加载url
         * @param type {string} 加载类型
         */
        public addResource(url:string, type:string = null):void {
            this.urlList.push(url);
            this.typeList.push(type);
        }

        private loader:URLLoader;
        /**
         * 开始加载
         * @method ns_egret.LoadingController#load
         */
        public load():void {
            if(this._loadingView){
                this._loadingView.addToStage();
            }
            this.next();
        }

        private loadCount:number = 0;

        private next():void{
            if (this._loadingView != null) {
                this._loadingView.onProgress(this.loadCount, this.urlList.length+this.loadCount);
            }
            if(this.urlList.length==0){
                this.onAllComp();
            }
            else{
                this.loadItem();
            }
        }

        private currentUrl:string;

        private loadItem():void{
            this.loadCount ++;
            if(!this.loader){
                this.loader = new URLLoader();
                this.loader.addEventListener(Event.COMPLETE,this.onItemComp,this);
                this.loader.addEventListener(IOErrorEvent.IO_ERROR,this.onError,this);
            }
            this.currentUrl = this.urlList.shift();
            var url:string = this.prefix+this.currentUrl;
            var type:string = this.typeList.shift();
            this.loader.dataFormat = type;
            this.loader.load(new URLRequest(url));
        }

        private onItemComp(event:Event):void{
            var texture:Texture = <Texture> this.loader.data;
            TextureCache.getInstance().addTexture(this.currentUrl,texture);
            this.next();
        }

        private onError(event:IOErrorEvent):void{
            this.next();
        }

        private onAllComp(){
            this.destroy();
            this.dispatchEventWith(Event.COMPLETE);
        }

        private _loadingView:ILoadingView;
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
            if (this._loadingView != null) {
                this._loadingView.removeFromStage();
                this._loadingView = null;
            }
        }
    }
}