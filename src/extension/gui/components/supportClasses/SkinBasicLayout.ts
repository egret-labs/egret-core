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
	 * @class egret.gui.SkinBasicLayout
	 * @classdesc
	 * 皮肤简单布局类。
	 * @extends egret.HashObject
	 */
    export class SkinBasicLayout extends HashObject{
		/**
         * 构造函数
		 * @method egret.gui.SkinBasicLayout#constructor
		 */
        public constructor() {
            super();
        }

        private _target: Skin = null;

        /**
         * 目标布局对象
		 * @member egret.gui.SkinBasicLayout#target
         */
        public get target():Skin {
            return this._target;
        }

        public set target(value:Skin) {
            this._target = value;
        }


        /**
         * 测量组件尺寸大小
		 * @method egret.gui.SkinBasicLayout#measure
         */
        public measure():void {
            if (this.target == null)
                return;

            var measureW:number = 0;
            var measureH:number = 0;

            var target:any = this._target;
            var count:number = target.numElements;
            for (var i:number = 0; i < count; i++) {
                var layoutElement:ILayoutElement = <ILayoutElement><any>target.getElementAt(i);
                if (!layoutElement || !layoutElement.includeInLayout)
                    continue;

                var hCenter:number = layoutElement.horizontalCenter;
                var vCenter:number = layoutElement.verticalCenter;
                var left:number = layoutElement.left;
                var right:number = layoutElement.right;
                var top:number = layoutElement.top;
                var bottom:number = layoutElement.bottom;

                var extX:number;
                var extY:number;

                if (!isNaN(left) && !isNaN(right)) {
                    extX = left + right;
                }
                else if (!isNaN(hCenter)) {
                    extX = Math.abs(hCenter) * 2;
                }
                else if (!isNaN(left) || !isNaN(right)) {
                    extX = isNaN(left) ? 0 : left;
                    extX += isNaN(right) ? 0 : right;
                }
                else {
                    extX = layoutElement.preferredX;
                }

                if (!isNaN(top) && !isNaN(bottom)) {
                    extY = top + bottom;
                }
                else if (!isNaN(vCenter)) {
                    extY = Math.abs(vCenter) * 2;
                }
                else if (!isNaN(top) || !isNaN(bottom)) {
                    extY = isNaN(top) ? 0 : top;
                    extY += isNaN(bottom) ? 0 : bottom;
                }
                else {
                    extY = layoutElement.preferredY;
                }

                var preferredWidth:number = layoutElement.preferredWidth;
                var preferredHeight:number = layoutElement.preferredHeight;

                measureW = Math.ceil(Math.max(measureW, extX + preferredWidth));
                measureH = Math.ceil(Math.max(measureH, extY + preferredHeight));
            }

            this.target.measuredWidth = measureW;
            this.target.measuredHeight = measureH;
        }

        /**
         * 更新显示列表
		 * @method egret.gui.SkinBasicLayout#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            if (this.target == null)
                return;

            var count:number = this.target.numElements;
            for (var i:number = 0; i < count; i++) {
                var layoutElement:ILayoutElement = <ILayoutElement><any> this.target.getElementAt(i);
                if (layoutElement == null || !layoutElement.includeInLayout)
                    continue;

                var hCenter:number = layoutElement.horizontalCenter;
                var vCenter:number = layoutElement.verticalCenter;
                var left:number = layoutElement.left;
                var right:number = layoutElement.right;
                var top:number = layoutElement.top;
                var bottom:number = layoutElement.bottom;
                var percentWidth:number = layoutElement.percentWidth;
                var percentHeight:number = layoutElement.percentHeight;

                var childWidth:number = NaN;
                var childHeight:number = NaN;


                if (!isNaN(left) && !isNaN(right)) {
                    childWidth = unscaledWidth - right - left;
                }
                else if (!isNaN(percentWidth)) {
                    childWidth = Math.round(unscaledWidth * Math.min(percentWidth * 0.01, 1));
                }

                if (!isNaN(top) && !isNaN(bottom)) {
                    childHeight = unscaledHeight - bottom - top;
                }
                else if (!isNaN(percentHeight)) {
                    childHeight = Math.round(unscaledHeight * Math.min(percentHeight * 0.01, 1));
                }

                layoutElement.setLayoutBoundsSize(childWidth, childHeight);

                var elementWidth:number = layoutElement.layoutBoundsWidth;
                var elementHeight:number = layoutElement.layoutBoundsHeight;


                var childX:number = NaN;
                var childY:number = NaN;

                if (!isNaN(hCenter))
                    childX = Math.round((unscaledWidth - elementWidth) / 2 + hCenter);
                else if (!isNaN(left))
                    childX = left;
                else if (!isNaN(right))
                    childX = unscaledWidth - elementWidth - right;
                else
                    childX = layoutElement.layoutBoundsX;

                if (!isNaN(vCenter))
                    childY = Math.round((unscaledHeight - elementHeight) / 2 + vCenter);
                else if (!isNaN(top))
                    childY = top;
                else if (!isNaN(bottom))
                    childY = unscaledHeight - elementHeight - bottom;
                else
                    childY = layoutElement.layoutBoundsY;

                layoutElement.setLayoutBoundsPosition(childX, childY);
            }
        }

    }
}