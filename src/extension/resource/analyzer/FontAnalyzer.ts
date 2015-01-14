/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
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


module RES {

    export class FontAnalyzer extends SheetAnalyzer{

        public constructor(){
            super();
        }

        public analyzeConfig(resItem:ResourceItem,data:string):string{
            var name:string = resItem.name;
            var config:any;
            var imageUrl:string = "";
            try{
                var str:string = <string> data;
                config = JSON.parse(str);
            }
            catch (e){
            }
            if(config){
                imageUrl = this.getRelativePath(resItem.url,config["file"]);
            }
            else{
                config = <string> data;
                imageUrl = this.getTexturePath(resItem.url,config);
            }
            this.sheetMap[name] = config;
            return imageUrl;
        }

        public analyzeBitmap(resItem:ResourceItem,data:egret.Texture):void {

            var name:string = resItem.name;
            if (this.fileDic[name] || !data) {
                return;
            }
            var texture:egret.Texture = data;
            var config:any = this.sheetMap[name];
            delete this.sheetMap[name];
            var bitmapFont:egret.BitmapFont = new egret.BitmapFont(texture,config);
            this.fileDic[name] = bitmapFont;
        }

        private getTexturePath(url:string,fntText:string):string{

            var file:string = "";
            var lines = fntText.split("\n");
            var pngLine = lines[2];
            var index:number = pngLine.indexOf("file=\"");
            if(index!=-1){
                pngLine = pngLine.substring(index+6);
                index = pngLine.indexOf("\"");
                file = pngLine.substring(0,index);
            }

            url = url.split("\\").join("/");
            var index:number = url.lastIndexOf("/");
            if(index!=-1){
                url = url.substring(0,index+1)+file;
            }
            else{
                url = file;
            }
            return url;
        }

        /**
         * @inheritDoc
         */
        public destroyRes(name:string):boolean{
            if(this.fileDic[name]){
                delete this.fileDic[name];
                return true;
            }
            return false;
        }
    }
}