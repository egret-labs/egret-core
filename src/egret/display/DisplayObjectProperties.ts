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
     * @private
     */
    export class DisplayObjectProperties {
        public _name:string = null;
        public _explicitWidth:number = NaN;
        public _explicitHeight:number = NaN;
        public _x:number = 0;
        public _y:number = 0;
        public _scaleX:number = 1;
        public _scaleY:number = 1;
        public _anchorOffsetX:number = 0;
        public _anchorOffsetY:number = 0;
        public _anchorX:number = 0;
        public _anchorY:number = 0;
        public _rotation:number = 0;
        public _alpha:number = 1;
        public _skewX:number = 0;
        public _skewY:number = 0;
        public _blendMode:string = null;
        public _touchEnabled:boolean = false;
        public _visible:boolean = true;
        public _worldAlpha:number = 1;
        public _scrollRect:Rectangle = null;
        public _cacheAsBitmap:boolean = false;
        public _parent:DisplayObjectContainer = null;
        public _stage:Stage = null;
        public _needDraw:boolean = false;

        /**
         * beta功能，请勿调用此方法
         */
        public _filters:Array<Filter> = null;



        public _hasWidthSet:boolean = false;
        public _hasHeightSet:boolean = false;
        public _normalDirty:boolean = true;
        //对宽高有影响
        public _sizeDirty:boolean = true;
        public _isContainer:boolean = false;
        constructor() {
        }
    }
}