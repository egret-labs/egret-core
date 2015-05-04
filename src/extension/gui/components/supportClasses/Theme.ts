/*
 * Copyright (c) 2014,egret.com
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the egret.com nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret.gui {

    export class Theme{
        /**
         * 构造函数
         * @method egret.gui.PopUpManager#constructor
         */
        public constructor(configURL:string){
            this.loadConfig(configURL);
        }

        private static initialized:boolean = false;

        public static load(configURL:string):void{
            if(this.initialized){
                return;
            }
            this.initialized = true;
            SkinnableComponent._defaultTheme = new Theme(configURL);
        }

        private loadConfig(configURL:string):void{
            var loader:egret.URLLoader = new URLLoader();
            loader.addEventListener(Event.COMPLETE,this.onLoadComplete,this);
            loader.addEventListener(IOErrorEvent.IO_ERROR,this.onLoadError,this);
            loader.dataFormat = URLLoaderDataFormat.TEXT;
            loader.load(new URLRequest(configURL));
        }

        private onLoadComplete(event:Event):void{
            var loader:egret.URLLoader = <egret.URLLoader> (event.target);
            try{
                var str:string = <string> loader.data;
                var data:any = JSON.parse(str);
                this.skinMap = data.skins;
            }
            catch (e){
                egret.Logger.warningWithErrorId(1017, loader._request.url, loader.data);
            }
            this.handleDelyList();
        }

        private onLoadError(event:IOErrorEvent):void{
            var loader:egret.URLLoader = <egret.URLLoader> (event.target);
            egret.Logger.warningWithErrorId(3000, loader._request.url);
            this.handleDelyList();
        }

        private skinMap: any = {};

        private delyList:Array<SkinnableComponent> = [];

        private handleDelyList():void{
            if(!this.skinMap){
                this.skinMap = {};
                this.delyList = [];
                return;
            }
            var list:Array<SkinnableComponent> = this.delyList;
            this.delyList = [];
            var length:number = list.length;
            for(var i:number=0;i<length;i++){
                var client:SkinnableComponent = list[i];
                if(!client._skin){
                    var skin:any = this.getDefaultSkin(client);
                    client._setSkin(skin);
                }
            }
        }

        public getDefaultSkin(client:SkinnableComponent):any{
            var skinMap:any = this.skinMap;
            if(!skinMap){
                if(this.delyList.indexOf(client)==-1){
                    this.delyList.push(client);
                }
                return null;
            }

            var skinName: string;
            var hostKey: string = client.hostComponentKey;
            if(hostKey){
                skinName = skinMap[hostKey];
            }
            else{
                var superClass:any = client;
                while (superClass) {
                    hostKey = egret.getQualifiedClassName(superClass);
                    skinName = skinMap[hostKey];
                    if(skinName){
                        break;
                    }
                    superClass = egret.getDefinitionByName(egret.getQualifiedSuperclassName(superClass));
                }
            }

            if(!skinName){
                return null;
            }
            var skinClass:any = egret.getDefinitionByName(skinName);
            if(!skinClass){
                egret.Logger.warningWithErrorId(3001, skinName);
                return null;
            }
            return new skinClass();
        }
    }
}