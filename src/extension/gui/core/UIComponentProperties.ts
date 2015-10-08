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


module egret.gui {
    /**
     * @private
     */
    export class UIComponentProperties {

        public _id: string = null;
        public _isPopUp: boolean = false;
        public _owner: any = null;
        public _updateCompletePendingFlag:boolean = false;
        public _initialized:boolean = false;
        public _nestLevel:number = 0;
        public _enabled:boolean = true;
        public _uiWidth:number = 0;
        public _uiHeight:number = 0;
        public _minWidth:number = 0;
        public _maxWidth:number = 10000;
        public _minHeight:number = 0;
        public _maxHeight:number = 10000;
        public _measuredWidth:number = 0;
        public _measuredHeight:number = 0;
        public _left:number = NaN;
        public _right: number = NaN;
        public _top: number = NaN;
        public _bottom: number = NaN;
        public _horizontalCenter: number = NaN;
        public _verticalCenter: number = NaN;
        public _percentWidth: number = NaN;
        public _percentHeight: number = NaN;
        public _includeInLayout:boolean = true;


        /**
         * 属性提交前组件旧的宽度
         */
        public _oldWidth: number = NaN;

        /**
         * 属性提交前组件旧的高度
         */
        public _oldHeight: number = NaN;

        /**
         * 属性提交前组件旧的X
         * @member egret.gui.UIComponent#oldX
         */
        public _oldX: number = NaN;
        /**
         * 属性提交前组件旧的Y
         * @member egret.gui.UIComponent#oldY
         */
        public _oldY: number = NaN;
        /**
         * @member egret.gui.UIComponent#_invalidatePropertiesFlag
         */
        public _invalidatePropertiesFlag:boolean = false;
        /**
         * @member egret.gui.UIComponent#_invalidateSizeFlag
         */
        public _invalidateSizeFlag:boolean = false;
        /**
         * 上一次测量的首选宽度
         * @member egret.gui.UIComponent#_oldPreferWidth
         */
        public _oldPreferWidth: number = NaN;
        /**
         * 上一次测量的首选高度
         * @member egret.gui.UIComponent#_oldPreferHeight
         */
        public _oldPreferHeight: number = NaN;
        public _invalidateDisplayListFlag:boolean = false;
        public _validateNowFlag:boolean = false;

        /**
         * _initialize()方法被调用过的标志。
         */
        public _initializeCalled:boolean = false;

        /**
         * 是否已经创建了自身的样式原型链
         */
        public _hasOwnStyleChain:boolean = false;
        /**
         * 样式原型链引用
         */
        public _styleProtoChain:any = null;
        /**
         * 一个性能优化的标志变量。某些子类可以设置为true显式表明自己不含有可设置样式的子项。
         */
        public _hasNoStyleChild:boolean = false;

        /**
         * 父级布局管理器设置了组件的宽度标志，尺寸设置优先级：自动布局>显式设置>自动测量
         * @member egret.gui.UIComponent#_layoutWidthExplicitlySet
         */
        public _layoutWidthExplicitlySet:boolean = false;

        /**
         * 父级布局管理器设置了组件的高度标志，尺寸设置优先级：自动布局>显式设置>自动测量
         * @member egret.gui.UIComponent#_layoutHeightExplicitlySet
         */
        public _layoutHeightExplicitlySet:boolean = false;

    }
}