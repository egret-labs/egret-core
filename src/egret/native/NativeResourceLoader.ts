//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
module egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class NativeResourceLoader extends egret.EventDispatcher{

        /**
         * @private
         */
        private _downCount:number = 0;
        /**
         * @private
         */
        private _path:string = null;
        /**
         * @private
         */
        private _bytesTotal:number = 0;

        /**
         * 
         * @param path 
         * @param bytesTotal 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public load(path:string, bytesTotal:number):void {
            this._downCount = 0;
            this._path = path;
            this._bytesTotal = bytesTotal;

            this.reload();
        }

        /**
         * @private
         * 
         */
        private reload():void {
            if (this._downCount >= 3) {
                this.downloadFileError();
                return;
            }

            //if (egret_native.isRecordExists(this._path)) {//卡里
            //    this.loadOver();
            //    return;
            //}
            //else if (egret_native.isFileExists(this._path)){
            //    this.loadOver();
            //    return;
            //}
            //else {
            this._downCount++;
            var promise = egret.PromiseObject.create();
            var self = this;
            promise.onSuccessFunc = function () {
                self.loadOver();
            };
            promise.onErrorFunc = function () {
                self.reload();
            };
            promise.downloadingSizeFunc = function (bytesLoaded:number) {
                self.downloadingProgress(bytesLoaded);
            };
            egret_native.download(this._path, this._path, promise);
            //}
        }

        /**
         * @private
         * 
         * @param bytesLoaded 
         */
        private downloadingProgress(bytesLoaded:number) {
            egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.PROGRESS, bytesLoaded, this._bytesTotal);
        }

        /**
         * @private
         * 
         */
        private downloadFileError() {
            this.dispatchEvent(new egret.Event(egret.IOErrorEvent.IO_ERROR));
        }

        /**
         * @private
         * 
         */
        private loadOver() {
            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        }
    }
}
