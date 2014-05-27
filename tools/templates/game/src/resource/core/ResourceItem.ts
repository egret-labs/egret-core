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