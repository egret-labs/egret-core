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

module RES {

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

	export namespace ResourceItem {


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
		export const TYPE_XML: string = "xml";
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
		export const TYPE_IMAGE: string = "image";
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
		export const TYPE_BIN: string = "bin";
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
		export const TYPE_TEXT: string = "text";
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
		export const TYPE_JSON: string = "json";
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
		export const TYPE_SHEET: string = "sheet";
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
		export const TYPE_FONT: string = "font";
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
		export const TYPE_SOUND: string = "sound";

		export function convertToResItem(r: ResourceInfo): ResourceItem {

			let name = "";
			if (!config.config) {
				name = r.url;
			}
			else {
				for (let aliasName in config.config.alias) {
					if (config.config.alias[aliasName] == r.url) {
						name = aliasName;
					}
				}
			}

			let result = {
				name,
				url: r.url,
				type: r.type,
				data: r
			}

			return result;
		}

	}



	export interface ResourceItem extends ResourceInfo {

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
		name: string;
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
		url: string;
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
		type: string;

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
		data: ResourceInfo;

		crc32?: string;

		size?: number;

		soundType?: string

	}
}