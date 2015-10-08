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
     * @language en_US
     * Bitmap font, texture set of a font. It is generally used as the value of the BitmapText.font attribute.
     * @see http://bbs.egret-labs.org/thread-918-1-1.html TextureMerger
     * @see http://bbs.egret-labs.org/forum.php?mod=viewthread&tid=251 Text(Containing the specific usage of the bitmap font )
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapFont.ts
     */
    /**
     * @language zh_CN
     * 位图字体,是一个字体的纹理集，通常作为BitmapText.font属性的值。
     * @see http://bbs.egret-labs.org/thread-918-1-1.html TextureMerger
     * @see http://bbs.egret-labs.org/forum.php?mod=viewthread&tid=251 文本(含位图字体具体用法)
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapFont.ts
     */
    export class BitmapFont extends SpriteSheet {

        /**
         * @language en_US
         * Create an egret.BitmapFont object
         * @param texture {egret.Texture} Texture set that use TextureMerger create
         * @param config {any} Configure data that use TextureMerger create
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.BitmapFont 对象
         * @param texture {egret.Texture} 使用TextureMerger生成的纹理集
         * @param config {any} 使用TextureMerger生成的配置数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(texture:Texture, config:any) {
            super(texture);
            if(typeof(config)=="string"){
                this.charList = this.parseConfig(config);
            }
            else if(config&&config.hasOwnProperty("frames")){
                this.charList = config.frames;
            }
            else{
                this.charList = {};
            }
        }

        /**
         * @private
         */
        private charList:any;

        /**
         * @language en_US
         * Obtain corresponding texture through the name attribute
         * @param name {string} name Attribute
         * @returns {egret.Texture}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 通过 name 属性获取对应纹理
         * @param name {string} name属性
         * @returns {egret.Texture}
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getTexture(name:string):Texture {
            var texture:Texture = this._textureMap[name];
            if (!texture) {
                var c:any = this.charList[name];
                if (!c) {
                    return null;
                }
                texture = this.createTexture(name, c.x, c.y, c.w, c.h, c.offX, c.offY,c.sourceW,c.sourceH);
                this._textureMap[name] = texture;
            }
            return texture;
        }

        /**
         * @private
         */
        private firstCharHeight:number = 0;

        /**
         * @private
         * 
         * @returns 
         */
        public _getFirstCharHeight():number{
            if(this.firstCharHeight==0){
                for(var str in this.charList){
                    var c:any = this.charList[str];
                    if(c){
                        var sourceH:number = c.sourceH;
                        if(egret.sys.isUndefined(sourceH)){
                            var h:number = c.h;
                            if(h===undefined){
                                h = 0;
                            }
                            var offY:number = c.offY;
                            if(egret.sys.isUndefined(offY)){
                                offY = 0;
                            }
                            sourceH = h+offY;
                        }
                        if(sourceH<=0){
                            continue;
                        }
                        this.firstCharHeight = sourceH;
                        break;
                    }
                }
            }
            return this.firstCharHeight;
        }

        /**
         * @private
         * 
         * @param fntText 
         * @returns 
         */
        private parseConfig(fntText:string):any {
            fntText = fntText.split("\r\n").join("\n");
            var lines:Array<string> = fntText.split("\n");
            var charsCount:number = this.getConfigByKey(lines[3], "count");

            var chars:any = {};
            for (var i:number = 4; i < 4 + charsCount; i++) {
                var charText:string = lines[i];
                var letter:string = String.fromCharCode(this.getConfigByKey(charText, "id"));
                var c = {};
                chars[letter] = c;
                c["x"] = this.getConfigByKey(charText, "x");
                c["y"] = this.getConfigByKey(charText, "y");
                c["w"] = this.getConfigByKey(charText, "width");
                c["h"] = this.getConfigByKey(charText, "height");
                c["offX"] = this.getConfigByKey(charText, "xoffset");
                c["offY"] = this.getConfigByKey(charText, "yoffset");
            }
            return chars;
        }

        /**
         * @private
         * 
         * @param configText 
         * @param key 
         * @returns 
         */
        private getConfigByKey(configText:string, key:string):number {
            var itemConfigTextList = configText.split(" ");
            for (var i = 0 , length = itemConfigTextList.length; i < length; i++) {
                var itemConfigText = itemConfigTextList[i];
                if (key == itemConfigText.substring(0, key.length)) {
                    var value:string = itemConfigText.substring(key.length + 1);
                    return parseInt(value);
                }
            }
            return 0;
        }

    }

}