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
module ns_egret {

	export class DragSource{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		
		private dataHolder:any = {};	
		
		private formatHandlers:any = {};
		
		private _formats:Array  = [];
		/**
		 * 包含拖动数据的格式，以字符串 Array 的形式表示。
		 * 使用 addData() 或 addHandler() 方法设置此属性。默认值取决于添加到 DragSource 对象的数据。
		 */		
		public get formats():Array {
			return this._formats;
		}
		/**
		 * 向拖动源添加数据和相应的格式 String。
		 * @param data 用于指定拖动数据的对象。这可以是任何对象，如，String，ArrayCollection，等等。
		 * @param format 描述此数据格式的字符串。
		 */		
		public addData(data:any, format:string):void{
			this._formats.push(format);
			
			this.dataHolder[format] = data;
		}
		
		/**
		 * 添加一个处理函数，当请求指定格式的数据时将调用此处理函数。当拖动大量数据时，此函数非常有用。仅当请求数据时才调用该处理函数。
		 * @param handler 一个函数，用于指定请求数据时需要调用的处理函数。此函数必须返回指定格式的数据。
		 * @param format 用于指定此数据的格式的字符串。
		 */		
		public addHandler(handler:Function,
								   format:string):void{
			this._formats.push(format);
			
			this.formatHandlers[format] = handler;
		}
		/**
		 * 检索指定格式的数据。如果此数据是使用 addData() 方法添加的，则可以直接返回此数据。
		 * 如果此数据是使用 addHandler() 方法添加的，则需调用处理程序函数来返回此数据。
		 * @param format 描述此数据格式的字符串。
		 */		
		public dataForFormat(format:string):any{
			var data:any = this.dataHolder[format];
			if (data)
				return data;
			
			if (this.formatHandlers[format])
				return this.formatHandlers[format]();
			
			return null;
		}
		/**
		 * 如果数据源中包含所请求的格式，则返回 true；否则，返回 false。
		 * @param format 描述此数据格式的字符串。
		 */		
		public hasFormat(format:string):boolean{
			var n:number = this._formats.length;
			for (var i:number = 0; i < n; i++){
				if (this._formats[i] == format)
					return true;
			}
			
			return false;
		}
	}
	
}
