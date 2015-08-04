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
     * @class egret.HtmlTextParser
     * @classdesc 将html格式文本转换为可赋值给 egret.TextField#textFlow 属性的对象
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=146&terms1_id=25&terms2_id=33&t3_id=146 多种样式文本混合
     * @includeExample egret/text/HtmlTextParser.ts
     */
    export class HtmlTextParser{

        /**
         * 创建一个 egret.HtmlTextParser 对象
         */
        constructor () {
            this.initReplaceArr();
        }

        private _replaceArr:Array<any> = [];
        private initReplaceArr():void {
            this._replaceArr = [];
            this._replaceArr.push([/&lt;/g, "<"]);
            this._replaceArr.push([/&gt;/g, ">"]);
            this._replaceArr.push([/&amp;/g, "&"]);
            this._replaceArr.push([/&quot;/g, "\""]);
            this._replaceArr.push([/&apos;/g, "\'"]);
        }
        private replaceSpecial(value:string):string {
            for (var i = 0; i < this._replaceArr.length; i++) {
                var k = this._replaceArr[i][0];
                var v = this._replaceArr[i][1];

                value = value.replace(k, v);
            }
            return value;
        }

        private resutlArr:Array<egret.ITextElement> = [];

        /**
         * 将html格式文本转换为可赋值给 egret.TextField#textFlow 属性的对象
         * @param htmltext {string} html文本
         * @method egret.HtmlTextParser#parser
         * @returns {Array<egret.ITextElement>} 可赋值给 egret.TextField#textFlow 属性的对象
         */
        public parser(htmltext:string):Array<egret.ITextElement> {
            this.stackArray = [];
            this.resutlArr = [];

            var firstIdx:number = 0;//文本段开始位置
            var length:number = htmltext.length;
            while (firstIdx < length) {
                var starIdx:number = htmltext.indexOf("<", firstIdx);
                if (starIdx < 0) {
                    this.addToResultArr(htmltext.substring(firstIdx));
                    firstIdx = length;
                }
                else {
                    this.addToResultArr(htmltext.substring(firstIdx, starIdx));

                    var fontEnd = htmltext.indexOf(">", starIdx);
                    if (htmltext.charAt(starIdx + 1) == "\/") {//关闭
                        this.stackArray.pop();
                    }
                    else {
                        this.addToArray(htmltext.substring(starIdx + 1, fontEnd));
                    }

                    firstIdx = fontEnd + 1;
                }
            }

            return this.resutlArr;
        }

        private addToResultArr(value:string):void {
            if (value == "") {
                return;
            }

            value = this.replaceSpecial(value);

            if (this.stackArray.length > 0) {
                this.resutlArr.push({text:value, style:this.stackArray[this.stackArray.length - 1]})
            }
            else {
                this.resutlArr.push(<egret.ITextElement>{text:value});
            }
        }

        //将字符数据转成Json数据
        private changeStringToObject(str:string):egret.ITextStyle {
            str = str.trim();
            var info:any = {};

            var header = [];
            if (str.charAt(0) == "i" || str.charAt(0) == "b")  {
                this.addProperty(info, str, "true");
            }
            else if (header = str.match(/^(font|a)\s/)){
                str = str.substring(header[0].length).trim();

                var next:number = 0;
                var titles;
                while (titles = str.match(this.getHeadReg())) {
                    var title = titles[0];
                    var value = "";
                    var str = str.substring(title.length).trim();
                    if (str.charAt(0) == "\"") {
                        var next = str.indexOf("\"", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else if (str.charAt(0) == "\'") {
                        var next = str.indexOf("\'", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else {
                        value = str.match(/(\S)+/)[0];
                        next = value.length;
                    }

                    this.addProperty(info, title.substring(0, title.length - 1).trim(), value.trim());

                    str = str.substring(next).trim();
                }
            }

            return info;
        }

        private getHeadReg():RegExp {
            return /^(color|textcolor|strokecolor|stroke|b|bold|i|italic|size|fontfamily|href)(\s)*=/;
        }

        private addProperty(info:egret.ITextStyle, head:string, value:string):void {

            switch (head.toLowerCase()) {
                case "color" :
                case "textcolor" :
                    value = value.replace(/#/, "0x");
                    info.textColor = parseInt(value);
                    break;
                case "strokecolor" :
                    value = value.replace(/#/, "0x");
                    info.strokeColor = parseInt(value);
                    break;
                case "stroke" :
                    info.stroke = parseInt(value);
                    break;
                case "b" :
                case "bold" :
                    info.bold = value == "true";
                    break;
                case "i" :
                case "italic" :
                    info.italic = value == "true";
                    break;
                case "size" :
                    info.size = parseInt(value);
                    break;
                case "fontfamily" :
                    info.fontFamily = value;
                    break;
                case "href" :
                    info.href = this.replaceSpecial(value);
                    break;
            }
        }

        private stackArray:Array<egret.ITextStyle>;

        private addToArray(infoStr:string):void {
            var info:egret.ITextStyle = this.changeStringToObject(infoStr);

            if (this.stackArray.length == 0) {
                this.stackArray.push(info);
            }
            else {
                var lastInfo:Object = this.stackArray[this.stackArray.length - 1];
                for (var key in lastInfo) {
                    if (info[key] == null) {
                        info[key] = lastInfo[key];
                    }
                }
                this.stackArray.push(info);
            }
        }
    }

}