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

module RES {
    /**
     * @private
     */
    export class SoundAnalyzer extends AnalyzerBase {

        /**
         * 构造函数
         */
        public constructor() {
            super();
        }

        /**
         * 字节流数据缓存字典
         */
        protected soundDic:any = {};
        /**
         * 加载项字典
         */
        protected resItemDic:Array<any> = [];

        /**
         * @inheritDoc
         */
        public loadFile(resItem:ResourceItem, callBack:Function, thisObject:any):void {
            if (this.soundDic[resItem.name]) {
                callBack.call(thisObject, resItem);
                return;
            }
            var sound = new egret.Sound();
            sound.addEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
            sound.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            this.resItemDic[sound.$hashCode] = {item: resItem, func: callBack, thisObject: thisObject};
            sound.load($getVirtualUrl(resItem.url));
            if (resItem.data) {
                sound.type = resItem.data.soundType;
            }
        }

        /**
         * 一项加载结束
         */
        protected onLoadFinish(event:egret.Event):void {
            var sound = <egret.Sound> (event.$target);
            sound.removeEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
            sound.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            var data:any = this.resItemDic[sound.$hashCode];
            delete this.resItemDic[sound.$hashCode];
            var resItem:ResourceItem = data.item;
            var compFunc:Function = data.func;
            resItem.loaded = (event.$type == egret.Event.COMPLETE);
            if (resItem.loaded) {
                this.analyzeData(resItem, sound)
            }
            compFunc.call(data.thisObject, resItem);
        }

        /**
         * 解析并缓存加载成功的数据
         */
        protected analyzeData(resItem:ResourceItem, data:egret.Sound):void {
            var name:string = resItem.name;
            if (this.soundDic[name] || !data) {
                return;
            }
            this.soundDic[name] = data;
        }

        /**
         * @inheritDoc
         */
        public getRes(name:string):any {
            return this.soundDic[name];
        }

        /**
         * @inheritDoc
         */
        public hasRes(name:string):boolean {
            return !!this.getRes(name);
        }

        /**
         * @inheritDoc
         */
        public destroyRes(name:string):boolean {
            if (this.soundDic[name]) {
                delete this.soundDic[name];
                return true;
            }
            return false;
        }
    }
}