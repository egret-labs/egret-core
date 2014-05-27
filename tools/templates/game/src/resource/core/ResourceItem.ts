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

	export class ResourceItem{
		/**
		 * XML文件  
		 */		
		public static TYPE_XML:string = "xml";
		/** 
		 * 图片文件 
		 */		
		public static TYPE_IMG:string = "img";
		/** 
		 * 二进制流文件
		 */		
		public static TYPE_BIN:string = "bin";
		/**
		 * 文本文件(解析为字符串)
		 */		
		public static TYPE_TXT:string = "txt";
        /**
         * JSON文件
         */
        public static TYPE_JSON:string = "json";
        /**
         * SpriteSheet文件
         */
        public static TYPE_SHEET:string = "sheet";
        /**
         * BitmapTextSpriteSheet文件
         */
        public static TYPE_FONT:string = "font";

		/**
		 * 构造函数
		 * @param name 加载项名称
		 * @param url 要加载的文件地址 
		 * @param type 加载项文件类型
		 */
		public constructor(name:string,url:string,type:string){
			this.name = name;
			this.url = url;
			this.type = type;
		}
		
		/**
		 * 加载项名称
		 */
		public name:string;
		/**
		 * 要加载的文件地址 
		 */
		public url:string;
		/**
		 * 加载项文件类型
		 */
		public type:string;

        /**
         * 所属组名
         */
		public groupName:string;
		/**
		 * 被引用的原始数据对象
		 */		
		public data:any;
		
		private _loaded:boolean = false;
		/**
		 * 加载完成的标志
		 */
		public get loaded():boolean{
			return this.data?this.data.loaded:this._loaded;
		}

		public set loaded(value:boolean){
			if(this.data)
				this.data.loaded = value;
			this._loaded = value;
		}

		
		public toString():string{
			return "[ResourceItem name=\""+this.name+"\" url=\""+this.url+"\" type=\""+this.type+"\"]";
		}
	}
}