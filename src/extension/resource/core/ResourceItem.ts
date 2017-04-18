//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

namespace RES {

	/**
	 * Resource term. One of the resources arrays in resource.json.
	 * @version Egret 2.4
	 * @platform Web,Native
	 * @language en_US
	 */
	/**
	 * 资源项。对应 resource.json 中 resources 数组中的一项。
	 * @version Egret 2.4
	 * @platform Web,Native
	 * @language zh_CN
	 */
	export class ResourceItem{

		/**
		 * XML file.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * XML 文件。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public static TYPE_XML:string = "xml";
		/**
		 * Picture file.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 图片文件。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public static TYPE_IMAGE:string = "image";
		/**
		 * Binary file.
		 * @version Egret 2.4
		 * @platform Web
		 * @language en_US
		 */
		/**
		 * 二进制文件。
		 * @version Egret 2.4
		 * @platform Web
		 * @language zh_CN
		 */
		public static TYPE_BIN:string = "bin";
		/**
		 * Text file.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 文本文件。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public static TYPE_TEXT:string = "text";
		/**
		 * JSON file.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * JSON 文件。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
        public static TYPE_JSON:string = "json";
		/**
		 * SpriteSheet file.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * SpriteSheet 文件。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
        public static TYPE_SHEET:string = "sheet";
		/**
		 * BitmapTextSpriteSheet file.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * BitmapTextSpriteSheet 文件。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
        public static TYPE_FONT:string = "font";
		/**
		 * Sound file.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 声音文件。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
        public static TYPE_SOUND:string = "sound";

		/**
		 * Constructor.
		 * @param name Name of resource term.
		 * @param url URL of resource term.
		 * @param type Type of resource term.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 构造函数。
		 * @param name 加载项名称。
		 * @param url 要加载的文件地址。
		 * @param type 加载项文件类型。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public constructor(name:string,url:string,type:string){
			this.name = name;
			this.url = url;
			this.type = type;
		}

		/**
		 * Name of resource term.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 加载项名称。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public name:string;
		/**
		 * URL of resource term.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 要加载的文件地址。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public url:string;
		/**
		 * Type of resource term.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 加载项文件类型。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public type:string;

		/**
		 * Name of the resource term group.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 资源所属的组名。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public groupName:string = "";
		/**
		 * The raw data object to be referenced.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 被引用的原始数据对象。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public data:any = null;
		
		private _loaded:boolean = false;
		/**
		 * Load complete flag.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 加载完成的标志。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
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
		 * Turn into a string.
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 转成字符串。
		 * @version Egret 2.4
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public toString():string{
			return "[ResourceItem name=\""+this.name+"\" url=\""+this.url+"\" type=\""+this.type+"\"]";
		}
	}
}