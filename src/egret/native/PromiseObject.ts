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
    export class PromiseObject {
        /**
         * @private
         */
        private static promiseObjectList = [];

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public onSuccessFunc:Function = null;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public onSuccessThisObject:any = null;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public onErrorFunc:Function = null;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public onErrorThisObject:any = null;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public downloadingSizeFunc:Function = null;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public downloadingSizeThisObject:any = null;

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor() {

        }

        /**
         * 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static create() {
            if (PromiseObject.promiseObjectList.length) {
                return PromiseObject.promiseObjectList.pop();
            }
            else {
                return new egret.PromiseObject();
            }
        }

        /**
         * @private
         * 
         * @param args 
         */
        private onSuccess(...args):void {
            if (this.onSuccessFunc) {
                this.onSuccessFunc.apply(this.onSuccessThisObject, args);
            }
            this.destroy();
        }

        /**
         * @private
         * 
         * @param args 
         */
        private onError(...args):void {
            if (this.onErrorFunc) {
                this.onErrorFunc.apply(this.onErrorThisObject, args);
            }
            this.destroy();
        }

        /**
         * @private
         * 
         * @param args 
         */
        private downloadingSize(...args):void {
            if (this.downloadingSizeFunc) {
                this.downloadingSizeFunc.apply(this.downloadingSizeThisObject, args);
            }
        }

        /**
         * @private
         * 
         */
        private destroy() {
            this.onSuccessFunc = undefined;
            this.onSuccessThisObject = undefined;
            this.onErrorFunc = undefined;
            this.onErrorThisObject = undefined;
            this.downloadingSizeFunc = undefined;
            this.downloadingSizeThisObject = undefined;
            PromiseObject.promiseObjectList.push(this);
        }
    }
}