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
module egret.native {
    var callBackDic = {};

    /**
     * @private
     */
    export class NativeExternalInterface implements ExternalInterface {

        static call(functionName:string, value:string):void {
            var data:any = {};
            data.functionName = functionName;
            data.value = value;
            egret_native.sendInfoToPlugin(JSON.stringify(data));
        }

        static addCallback(functionName:string, listener:(value)=>void):void {
            callBackDic[functionName] = listener;
        }
    }

    /**
     * @private
     * @param info
     */
    function onReceivedPluginInfo(info:string):void {
        var data = JSON.parse(info);
        var functionName = data.functionName;
        var listener = callBackDic[functionName];
        if (listener) {
            var value = data.value;
            listener.call(null, value);
        }
        else {
            egret.$warn(1004, functionName);
        }
    }

    ExternalInterface = NativeExternalInterface;
    egret_native.receivedPluginInfo = onReceivedPluginInfo;
}