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


module egret {

    export class BitmapTextSpriteSheet extends SpriteSheet {

        public constructor(texture:Texture, fntText:string) {
            super(texture);
            this.charList = this.parseConfig(fntText);
        }

        private charList:any;

        public getTexture(name:string):Texture {
            var texture:Texture = this._textureMap[name];
            if (!texture) {
                var c:any = this.charList[name];
                if (!c) {
                    return null;
                }
                texture = this.createTexture(name, c.x, c.y, c.width, c.height, c.offsetX, c.offsetY);
                this._textureMap[name] = texture;
            }
            return texture;
        }

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
                c["width"] = this.getConfigByKey(charText, "width");
                c["height"] = this.getConfigByKey(charText, "height");
                c["offsetX"] = this.getConfigByKey(charText, "xoffset");
                c["offsetY"] = this.getConfigByKey(charText, "yoffset");
            }
            return chars;
        }

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