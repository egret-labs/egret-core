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

    /**
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/localStorage/localStorage.ts
     */
module egret.localStorage {

    /**
     * @language en_US
     * Read data
     * @param key {string} Name of the key to be read
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 读取数据
     * @param key {string} 要读取的键名称
     * @version Egret 2.4
     * @platform Web,Native
     */
    export var getItem:(key:string)=>string;

    /**
     * @language en_US
     * Save data
     * @param key {string} Name of the key to be saved
     * @param value {string} Value to be saved
     * @returns {boolean} Whether data is saved successfully
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 保存数据
     * @param key {string} 要保存的键名称
     * @param value {string} 要保存的值
     * @returns {boolean} 数据保存是否成功
     * @version Egret 2.4
     * @platform Web,Native
     */
    export var setItem:(key:string, value:string)=>boolean;

    /**
     * @language en_US
     * Delete data
     * @param key {string} Name of the key to be deleted
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 删除数据
     * @param key {string} 要删除的键名称
     * @version Egret 2.4
     * @platform Web,Native
     */
    export var removeItem:(key:string)=>void;

    /**
     * @language en_US
     * Clear all data
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 将所有数据清空
     * @version Egret 2.4
     * @platform Web,Native
     */
    export var clear:()=>void;
}