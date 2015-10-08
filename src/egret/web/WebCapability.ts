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

module egret.web {

    /**
     * @private
     */
    export class WebCapability {
        /**
         * @private
         * 检测系统属性
         */
        public static detect():void {
            var capabilities = egret.Capabilities;
            var ua = navigator.userAgent.toLowerCase();
            capabilities.$isMobile = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
            if(capabilities.$isMobile){
                if(ua.indexOf("windows") < 0&&(ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 || ua.indexOf("ipod") != -1)){
                    capabilities.$os = "iOS";
                }
                else if(ua.indexOf("android")!= -1&&ua.indexOf("linux")!= -1){
                    capabilities.$os = "Android";
                }
                else if(ua.indexOf("windows")!= -1){
                    capabilities.$os = "Windows Phone";
                }
            }
            else{
                if(ua.indexOf("windows nt")!= -1){
                    capabilities.$os = "Windows PC";
                }
                else if(ua.indexOf("mac os")!= -1){
                    capabilities.$os = "Mac OS";
                }
            }
            
            var language = (navigator.language || navigator.browserLanguage).toLowerCase();
            var strings = language.split("-");
            if (strings.length > 1) {
                strings[1] = strings[1].toUpperCase();
            }
            capabilities.$language = strings.join("-");
        }
    }
    WebCapability.detect();
}
