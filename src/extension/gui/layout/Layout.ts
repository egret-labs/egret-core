/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
module ns_egret{
    export class BasicLayout {

        public target:GroupBase;

        constructor() {
//        super();
        }

        measure():void {
            var target = this.target;
//        super.measure();

            if (target == null)
                return;

            var width:number = 0;
            var height:number = 0;

            var count:number = target.numElements;
            for (var i:number = 0; i < count; i++) {
                var layoutElement:ILayoutElement = <ILayoutElement>target.getElementAt(i);

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

                width = Math.ceil(Math.max(width, extX + preferredWidth));
                height = Math.ceil(Math.max(height, extY + preferredHeight));
            }

            target.measuredWidth = width;
            target.measuredHeight = height;
        }


        /**
         * @inheritDoc
         */

        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
//        super.updateDisplayList(unscaledWidth, unscaledHeight);
            var target = this.target;
            if (target == null)
                return;

            var count:number = target.numElements;

            var maxX:number = 0;
            var maxY:number = 0;
            for (var i:number = 0; i < count; i++) {
                var layoutElement:ILayoutElement = <ILayoutElement>target.getElementAt(i)
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

                maxX = Math.max(maxX, childX + elementWidth);
                maxY = Math.max(maxY, childY + elementHeight);
            }
            target.setContentSize(maxX, maxY);
        }
    }

    export interface ILayoutElement{

        bottom;

        top;

        left;

        right;

        horizontalCenter;

        verticalCenter;

        includeInLayout;

        preferredX;

        preferredY;

        preferredWidth;

        preferredHeight;

        percentWidth;

        percentHeight;

        layoutBoundsX;

        layoutBoundsY;

        layoutBoundsWidth;

        layoutBoundsHeight;

        numElements;

        setLayoutBoundsPosition(x, y);

        setLayoutBoundsSize(width, height);


    }


    export interface GroupBase {


        numElements;


        getElementAt(index:number):ILayoutElement;

        measuredWidth;

        measuredHeight;

        setContentSize(width, height);
    }
}