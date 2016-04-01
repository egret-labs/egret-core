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
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    export class FrameLabel extends EventDispatcher {
        /**
         * @private
         */
        private _name:string;
        /**
         * @private
         */
        private _frame:number /*int*/;
        /**
         * @private
         */
        private _end:number /*int*/;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(name:string, frame:number /*int*/, end?:number /*int*/) {
            super();
            this._name = name;
            this._frame = frame | 0;
            if (end) this._end = end | 0;
        }

        /**
         * @language en_US
         * Frame number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 标签名
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get name():string {
            return this._name;
        }

        /**
         * @language en_US
         * Frame serial number of the label
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 标签所在帧序号
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get frame():number /*int*/ {
            return this._frame;
        }
        /**
         * @language en_US
         * Frame serial number, the end of the label
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 标签对应的结束帧序号
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get end(): number /*int*/ {
            return this._end;
        }

        /**
         * @language en_US
         * Duplicate the current frame label object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 复制当前帧标签对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        public clone() {
            return new FrameLabel(this._name, this._frame, this._end);
        }
    }

}


