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
     * @deprecated
     * @private
     */
    export class SAXParser extends HashObject {
        static _instance:SAXParser = null;

        /**
         * @deprecated
         */
        static getInstance() {
            if (!SAXParser._instance) {
                SAXParser._instance = new SAXParser();
            }
            return SAXParser._instance;
        }

        private _parser:any = null;
        private _xmlDict:any = null;
        private _isSupportDOMParser:any = null;

        public constructor() {
            super();
            this._xmlDict = {};
            if (window["DOMParser"]) {
                this._isSupportDOMParser = true;
                this._parser = new DOMParser();
            } else {
                this._isSupportDOMParser = false;
            }
        }

        /**
         * @deprecated
         */
        public parserXML(textxml:string):any {
            var i = 0;
            while (textxml.charAt(i) == "\n" || textxml.charAt(i) == "\t" || textxml.charAt(i) == "\r" || textxml.charAt(i) == " ") {
                i++;
            }

            if (i != 0) {
                textxml = textxml.substring(i, textxml.length);
            }

            var xmlDoc;
            if (this._isSupportDOMParser) {
                xmlDoc = this._parser.parseFromString(textxml, "text/xml");
            } else {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(textxml);
            }

            if (xmlDoc == null) {
                $warn(1015);
            }
            return xmlDoc;
        }
    }
}