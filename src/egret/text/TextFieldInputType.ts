
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
     * @language en_US
     * TextFieldInputType class is an enumeration of constant value used in setting the inputType property of the TextField class.
     * @version Egret 3.1.2
     * @platform Web,Native
	 */
	/**
     * @language zh_CN
     * TextFieldInputType 类是在设置 TextField 类的 inputType 属性时使用的常数值的枚举。
     * @version Egret 3.1.2
     * @platform Web,Native
	 */
    export class TextFieldInputType {

		/**
         * @language en_US
         * The default
         * @version Egret 3.1.2
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * 默认 input 类型
         * @version Egret 3.1.2
         * @platform Web,Native
		 */
        public static TEXT:string = "text";

		/**
         * @language en_US
         * Telephone Number Inputs
         * @version Egret 3.1.2
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * 电话号码 input 类型
         * @version Egret 3.1.2
         * @platform Web,Native
		 */
        public static TEL:string = "tel";
        
        /**
         * @language en_US
         * Password Inputs
         * @version Egret 3.1.2
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * password 类型
         * @version Egret 3.1.2
         * @platform Web,Native
		 */
        public static PASSWORD:string = "password";
    }
}