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
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class ScrollViewProperties {
        /**
         * @private
         */
        public _verticalScrollPolicy:string = "auto";
        /**
         * @private
         */
        public _horizontalScrollPolicy:string = "auto";
        /**
         * @private
         */
        public _scrollLeft = 0;
        /**
         * @private
         */
        public _scrollTop:number = 0;

        /**
         * @private
         */
        public _hCanScroll:boolean = false;
        /**
         * @private
         */
        public _vCanScroll:boolean = false;

        /**
         * @private
         */
        public _lastTouchPosition:egret.Point = new Point(0, 0);
        /**
         * @private
         */
        public _touchStartPosition:egret.Point = new Point(0, 0);
        /**
         * @private
         */
        public _scrollStarted:boolean = false;
        /**
         * @private
         */
        public _lastTouchTime:number = 0;
        /**
         * @private
         */
        public _lastTouchEvent:TouchEvent = null;
        /**
         * @private
         */
        public _velocitys:Array<{ x: number; y: number }> = [];
        /**
         * @private
         */
        public _isHTweenPlaying:boolean = false;
        /**
         * @private
         */
        public _isVTweenPlaying:boolean = false;
        /**
         * @private
         */
        public _hScrollTween:ScrollTween = null;
        /**
         * @private
         */
        public _vScrollTween:ScrollTween = null;

        /**
         * @private
         */
        public _bounces: boolean = true;
    }
}