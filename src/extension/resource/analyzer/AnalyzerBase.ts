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
     * @classic
     * @private
     */
    export class AnalyzerBase extends egret.HashObject{

        public constructor(){
            super();
            this.resourceConfig = <ResourceConfig>(RES["configInstance"]);
        }

        private resourceConfig:ResourceConfig = null;
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        public addSubkey(subkey:string,name:string):void{
            this.resourceConfig.addSubkey(subkey,name);
        }
        /**
         * 加载一个资源文件
         * @param resItem 加载项信息
         * @param compFunc 加载完成回调函数,示例:compFunc(resItem:ResourceItem):void;
         * @param thisObject 加载完成回调函数的this引用
         */
        public loadFile(resItem:ResourceItem,compFunc:Function,thisObject:any):void{

        }
        /**
         * 同步方式获取解析完成的数据
         * @param name 对应配置文件里的name属性。
         */
        public getRes(name:string):any{

        }
        /**
         * 销毁某个资源文件的二进制数据,返回是否删除成功。
         * @param name 配置文件中加载项的name属性
         */
        public destroyRes(name:string):boolean{
            return false;
        }

        /**
         * 读取一个字符串里第一个点之前的内容。
         * @param name {string} 要读取的字符串
         */
        public static getStringPrefix(name:string):string{
            if(!name){
                return "";
            }
            var index:number = name.indexOf(".");
            if(index!=-1) {
                return name.substring(0, index);
            }
            return "";
        }
        /**
         * 读取一个字符串里第一个点之后的内容。
         * @param name {string} 要读取的字符串
         */
        public static getStringTail(name:string):string{
            if(!name){
                return "";
            }
            var index:number = name.indexOf(".");
            if(index!=-1) {
                return name.substring(index+1);
            }
            return "";
        }
    }
}