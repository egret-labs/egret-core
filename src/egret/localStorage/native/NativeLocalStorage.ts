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
module egret.localStorage.native {
    var filePath:string = "LocalStorage.local";

    var localStorageData = {};

    /**
     * @private
     *
     * @param key
     * @returns
     */
    function getItem(key:string):string {
        return localStorageData[key];
    }

    /**
     * @private
     *
     * @param key
     * @param value
     * @returns
     */
    function setItem(key:string, value:string):boolean {
        localStorageData[key] = value;
        try {
            save();
            return true;
        }
        catch (e) {
            egret.$warn(1018, key, value);
            return false;
        }
    }

    /**
     * @private
     *
     * @param key
     */
    function removeItem(key:string):void {
        delete localStorageData[key];
        save();
    }

    /**
     * @private
     *
     */
    function clear():void {
        for (var key in localStorageData) {
            delete localStorageData[key];
        }
        save();
    }

    /**
     * @private
     *
     */
    function save() {
        egret_native.saveRecord(filePath, JSON.stringify(localStorageData));
    }

    if (egret_native.isRecordExists(filePath)) {
        var str:string = egret_native.loadRecord(filePath);

        try {
            localStorageData = JSON.parse(str);
        } catch (e) {
            localStorageData = {};
        }
    }
    else {
        localStorageData = {};
    }

    localStorage.getItem = getItem;
    localStorage.setItem = setItem;
    localStorage.removeItem = removeItem;
    localStorage.clear = clear;
}