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
	 * @class RES.ResourceItem
	 * @classdesc
	 */
	export class ResourceItem{
		/**
		 * XML文件  
		 * @constant {string} RES.ResourceItem.TYPE_XML
		 */
		public static TYPE_XML:string = "xml";
		/** 
		 * 图片文件 
		 * @constant {string} RES.ResourceItem.TYPE_IMAGE
		 */
		public static TYPE_IMAGE:string = "image";
		/** 
		 * 二进制流文件
		 * @constant {string} RES.ResourceItem.TYPE_BIN
		 * @platform Web
		 */		
		public static TYPE_BIN:string = "bin";
		/**
		 * 文本文件(解析为字符串)
		 * @constant {string} RES.ResourceItem.TYPE_TEXT
		 */
		public static TYPE_TEXT:string = "text";
        /**
         * JSON文件
		 * @constant {string} RES.ResourceItem.TYPE_JSON
         */
        public static TYPE_JSON:string = "json";
        /**
         * SpriteSheet文件
		 * @constant {string} RES.ResourceItem.TYPE_SHEET
         */
        public static TYPE_SHEET:string = "sheet";
        /**
         * BitmapTextSpriteSheet文件
		 * @constant {string} RES.ResourceItem.TYPE_FONT
         */
        public static TYPE_FONT:string = "font";
        /**
         * 声音文件
		 * @constant {string} RES.ResourceItem.TYPE_SOUND
         */
        public static TYPE_SOUND:string = "sound";

		/**
		 * 构造函数
		 * @method RES.ResourceItem#constructor
		 * @param name {string} 加载项名称
		 * @param url {string} 要加载的文件地址 
		 * @param type {string} 加载项文件类型
		 * @private
		 */
		public constructor(name:string,url:string,type:string){
			this.name = name;
			this.url = url;
			this.type = type;
		}
		
		/**
		 * 加载项名称
		 * @member {string} RES.ResourceItem#name
		 * @private
		 */
		public name:string;
		/**
		 * 要加载的文件地址 
		 * @member {string} RES.ResourceItem#url
		 * @private
		 */
		public url:string;
		/**
		 * 加载项文件类型
		 * @member {string} RES.ResourceItem#type
		 * @private
		 */
		public type:string;

        /**
         * 所属组名
		 * @member {string} RES.ResourceItem#groupName
		 * @private
         */
		public groupName:string = "";
		/**
		 * 被引用的原始数据对象
		 * @member {any} RES.ResourceItem#data
		 * @private
		 */		
		public data:any = null;
		
		private _loaded:boolean = false;
		/**
		 * 加载完成的标志
		 * @member {boolean} RES.ResourceItem#loaded
		 * @private
		 */
		public get loaded():boolean{
			return this.data?this.data.loaded:this._loaded;
		}

		public set loaded(value:boolean){
			if(this.data)
				this.data.loaded = value;
			this._loaded = value;
		}

		
		/**
		 * 转成字符串
		 * @method RES.ResourceItem#toString
		 * @returns {string}
		 * @private
		 */
		public toString():string{
			return "[ResourceItem name=\""+this.name+"\" url=\""+this.url+"\" type=\""+this.type+"\"]";
		}
	}
}