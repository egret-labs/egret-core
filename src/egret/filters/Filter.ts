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

namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class Filter extends HashObject {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public type:string = null;

        /**
         * @private 
         */
        public $uniforms:any;
        
        private $targets:DisplayObject[] = [];

        constructor() {
            super();
            this.$uniforms = {};
        }
        
        public $addTarget(target:DisplayObject):void {
            let length:number = this.$targets.length;
            for(let i:number = 0 ; i < length ; i++) {
                if(this.$targets[i].$hashCode == target.$hashCode) {
                    return;
                }
            }
            this.$targets.push(target);
        }
        
        public $removeTarget(target:DisplayObject):void {
            let length:number = this.$targets.length;
            for(let i:number = 0 ; i < length ; i++) {
                if(this.$targets[i].$hashCode == target.$hashCode) {
                    this.$targets.splice(i, 1);
                    return;
                }
            }
        }
        
        protected invalidate():void {
            let length:number = this.$targets.length;
            for(let i:number = 0 ; i < length ; i++) {
                this.$targets[i].$invalidateContentBounds();
            }
        }

        /**
         * @private
         */
        public $toJson():string {
            return '';
        }
    }
}