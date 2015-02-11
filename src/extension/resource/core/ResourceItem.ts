/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
		 */
		public constructor(name:string,url:string,type:string){
			this.name = name;
			this.url = url;
			this.type = type;
		}
		
		/**
		 * 加载项名称
		 * @member {string} RES.ResourceItem#name
		 */
		public name:string;
		/**
		 * 要加载的文件地址 
		 * @member {string} RES.ResourceItem#url
		 */
		public url:string;
		/**
		 * 加载项文件类型
		 * @member {string} RES.ResourceItem#type
		 */
		public type:string;

        /**
         * 所属组名
		 * @member {string} RES.ResourceItem#groupName
         */
		public groupName:string = "";
		/**
		 * 被引用的原始数据对象
		 * @member {any} RES.ResourceItem#data
		 */		
		public data:any = null;
		
		private _loaded:boolean = false;
		/**
		 * 加载完成的标志
		 * @member {boolean} RES.ResourceItem#loaded
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
		 */
		public toString():string{
			return "[ResourceItem name=\""+this.name+"\" url=\""+this.url+"\" type=\""+this.type+"\"]";
		}
	}
}