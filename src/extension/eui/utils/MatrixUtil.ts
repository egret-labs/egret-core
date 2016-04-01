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

module eui.sys {

    var SOLUTION_TOLERANCE = 0.1;
    var MIN_MAX_TOLERANCE = 0.1;

    /**
     * @private
     */
    export class MatrixUtil {

        /**
         * @private
         */
        public static fitBounds(width:number, height:number, matrix:egret.Matrix,
                                explicitWidth:number, explicitHeight:number,
                                preferredWidth:number, preferredHeight:number,
                                minWidth:number, minHeight:number,
                                maxWidth:number, maxHeight:number):egret.Point {
            if (isNaN(width) && isNaN(height))
                return egret.Point.create(preferredWidth, preferredHeight);

            var newMinWidth = (minWidth < MIN_MAX_TOLERANCE) ? 0 : minWidth - MIN_MAX_TOLERANCE;
            var newMinHeight = (minHeight < MIN_MAX_TOLERANCE) ? 0 : minHeight - MIN_MAX_TOLERANCE;
            var newMaxWidth = maxWidth + MIN_MAX_TOLERANCE;
            var newMaxHeight = maxHeight + MIN_MAX_TOLERANCE;

            var actualSize:egret.Point;

            if (!isNaN(width) && !isNaN(height)) {
                actualSize = calcUBoundsToFitTBounds(width, height, matrix,
                    newMinWidth, newMinHeight,
                    newMaxWidth, newMaxHeight);

                if (!actualSize) {
                    var actualSize1:egret.Point;
                    actualSize1 = fitTBoundsWidth(width, matrix,
                        explicitWidth, explicitHeight,
                        preferredWidth, preferredHeight,
                        newMinWidth, newMinHeight,
                        newMaxWidth, newMaxHeight);

                    if (actualSize1) {
                        var fitHeight = transformSize(actualSize1.x, actualSize1.y, matrix).height;
                        if (fitHeight - SOLUTION_TOLERANCE > height)
                        {
                            egret.Point.release(actualSize1);
                            actualSize1 = null;
                        }
                    }

                    var actualSize2:egret.Point
                    actualSize2 = fitTBoundsHeight(height, matrix,
                        explicitWidth, explicitHeight,
                        preferredWidth, preferredHeight,
                        newMinWidth, newMinHeight,
                        newMaxWidth, newMaxHeight);

                    if (actualSize2) {
                        var fitWidth = transformSize(actualSize2.x, actualSize2.y, matrix).width;
                        if (fitWidth - SOLUTION_TOLERANCE > width)
                        {
                            egret.Point.release(actualSize2);
                            actualSize2 = null;
                        }
                    }

                    if (actualSize1 && actualSize2) {
                        actualSize = ((actualSize1.x * actualSize1.y) > (actualSize2.x * actualSize2.y)) ? actualSize1 : actualSize2;
                    }
                    else if (actualSize1) {
                        actualSize = actualSize1;
                    }
                    else {
                        actualSize = actualSize2;
                    }
                    egret.Point.release(actualSize1);
                    egret.Point.release(actualSize2);
                }
                return actualSize;
            }
            else if (!isNaN(width)) {
                return fitTBoundsWidth(width, matrix,
                    explicitWidth, explicitHeight,
                    preferredWidth, preferredHeight,
                    newMinWidth, newMinHeight,
                    newMaxWidth, newMaxHeight);
            }
            else {
                return fitTBoundsHeight(height, matrix,
                    explicitWidth, explicitHeight,
                    preferredWidth, preferredHeight,
                    newMinWidth, newMinHeight,
                    newMaxWidth, newMaxHeight);
            }
        }
    }

    /**
     * @private
     */
    function fitTBoundsWidth(width:number, matrix:egret.Matrix,
                             explicitWidth:number, explicitHeight:number,
                             preferredWidth:number, preferredHeight:number,
                             minWidth:number, minHeight:number,
                             maxWidth:number, maxHeight:number):egret.Point {
        var actualSize:egret.Point;

        if (!isNaN(explicitWidth) && isNaN(explicitHeight)) {
            actualSize = calcUBoundsToFitTBoundsWidth(width, matrix,
                explicitWidth, preferredHeight,
                explicitWidth, minHeight,
                explicitWidth, maxHeight);

            if (actualSize)
                return actualSize;
        }
        else if (isNaN(explicitWidth) && !isNaN(explicitHeight)) {
            actualSize = calcUBoundsToFitTBoundsWidth(width, matrix,
                preferredWidth, explicitHeight,
                minWidth, explicitHeight,
                maxWidth, explicitHeight);
            if (actualSize)
                return actualSize;
        }

        actualSize = calcUBoundsToFitTBoundsWidth(width, matrix,
            preferredWidth, preferredHeight,
            minWidth, minHeight,
            maxWidth, maxHeight);

        return actualSize;
    }

    /**
     * @private
     */
    function fitTBoundsHeight(height:number, matrix:egret.Matrix,
                              explicitWidth:number, explicitHeight:number,
                              preferredWidth:number, preferredHeight:number,
                              minWidth:number, minHeight:number,
                              maxWidth:number, maxHeight:number):egret.Point {
        var actualSize:egret.Point;

        if (!isNaN(explicitWidth) && isNaN(explicitHeight)) {
            actualSize = calcUBoundsToFitTBoundsHeight(height, matrix,
                explicitWidth, preferredHeight,
                explicitWidth, minHeight,
                explicitWidth, maxHeight);

            if (actualSize)
                return actualSize;
        }
        else if (isNaN(explicitWidth) && !isNaN(explicitHeight)) {
            actualSize = calcUBoundsToFitTBoundsHeight(height, matrix,
                preferredWidth, explicitHeight,
                minWidth, explicitHeight,
                maxWidth, explicitHeight);
            if (actualSize)
                return actualSize;
        }

        actualSize = calcUBoundsToFitTBoundsHeight(height, matrix,
            preferredWidth, preferredHeight,
            minWidth, minHeight,
            maxWidth, maxHeight);

        return actualSize;
    }


    /**
     * @private
     */
    function calcUBoundsToFitTBoundsHeight(h:number,
                                           matrix:egret.Matrix,
                                           preferredX:number,
                                           preferredY:number,
                                           minX:number,
                                           minY:number,
                                           maxX:number,
                                           maxY:number):egret.Point {
        var b = matrix.b;
        var d = matrix.d;

        if (-1.0e-9 < b && b < +1.0e-9)
            b = 0;
        if (-1.0e-9 < d && d < +1.0e-9)
            d = 0;

        if (b == 0 && d == 0)
            return null;

        if (b == 0 && d == 0)
            return null;

        if (b == 0)
            return egret.Point.create(preferredX, h / Math.abs(d));
        else if (d == 0)
            return egret.Point.create(h / Math.abs(b), preferredY);

        var d1 = (b * d >= 0) ? d : -d;

        var s:egret.Point;
        var x:number;
        var y:number;

        if (d1 != 0 && preferredX > 0) {
            var invD1 = 1 / d1;
            preferredX = Math.max(minX, Math.min(maxX, preferredX));
            x = preferredX;

            y = (h - b * x) * invD1;
            if (minY <= y && y <= maxY &&
                b * x + d1 * y >= 0) {
                s = egret.Point.create(x, y);
            }

            y = (-h - b * x) * invD1;
            if (minY <= y && y <= maxY &&
                b * x + d1 * y < 0) {
                if (!s || transformSize(s.x, s.y, matrix).width > transformSize(x, y, matrix).width)
                {
                    egret.Point.release(s);
                    s = egret.Point.create(x, y);
                }
            }
        }

        if (b != 0 && preferredY > 0) {
            var invB = 1 / b;
            preferredY = Math.max(minY, Math.min(maxY, preferredY));
            y = preferredY;

            x = ( h - d1 * y ) * invB;
            if (minX <= x && x <= maxX &&
                b * x + d1 * y >= 0) {
                if (!s || transformSize(s.x, s.y, matrix).width > transformSize(x, y, matrix).width)
                    s = egret.Point.create(x, y);
            }

            x = ( -h - d1 * y ) * invB;
            if (minX <= x && x <= maxX &&
                b * x + d1 * y < 0) {
                if (!s || transformSize(s.x, s.y, matrix).width > transformSize(x, y, matrix).width)
                {
                    egret.Point.release(s);
                    s = egret.Point.create(x, y);
                }
            }
        }

        if (s)
            return s;

        var a = matrix.a;
        var c = matrix.c;
        var c1 = ( a * c >= 0 ) ? c : -c;
        return solveEquation(b, d1, h, minX, minY, maxX, maxY, a, c1);
    }

    /**
     * @private
     */
    function calcUBoundsToFitTBoundsWidth(w:number,
                                          matrix:egret.Matrix,
                                          preferredX:number,
                                          preferredY:number,
                                          minX:number,
                                          minY:number,
                                          maxX:number,
                                          maxY:number):egret.Point {

        var a = matrix.a;
        var c = matrix.c;

        if (-1.0e-9 < a && a < +1.0e-9)
            a = 0;
        if (-1.0e-9 < c && c < +1.0e-9)
            c = 0;

        if (a == 0 && c == 0)
            return null;

        if (a == 0)
            return egret.Point.create(preferredX, w / Math.abs(c));
        else if (c == 0)
            return egret.Point.create(w / Math.abs(a), preferredY);

        var c1 = ( a * c >= 0 ) ? c : -c;

        var s:egret.Point;
        var x:number;
        var y:number;

        if (c1 != 0 && preferredX > 0) {
            var invC1 = 1 / c1;
            preferredX = Math.max(minX, Math.min(maxX, preferredX));
            x = preferredX;

            y = (w - a * x) * invC1;
            if (minY <= y && y <= maxY &&
                a * x + c1 * y >= 0) {
                s = egret.Point.create(x, y);
            }

            y = (-w - a * x) * invC1;
            if (minY <= y && y <= maxY &&
                a * x + c1 * y < 0) {
                if (!s || transformSize(s.x, s.y, matrix).height > transformSize(x, y, matrix).height)
                {
                    egret.Point.release(s);
                    s = egret.Point.create(x, y);
                }
            }
        }

        if (a != 0 && preferredY > 0) {
            var invA = 1 / a;
            preferredY = Math.max(minY, Math.min(maxY, preferredY));
            y = preferredY;

            x = (w - c1 * y ) * invA;
            if (minX <= x && x <= maxX &&
                a * x + c1 * y >= 0) {
                if (!s || transformSize(s.x, s.y, matrix).height > transformSize(x, y, matrix).height)
                {
                    egret.Point.release(s);
                    s = egret.Point.create(x, y);
                }
            }

            x = (-w - c1 * y ) * invA;
            if (minX <= x && x <= maxX &&
                a * x + c1 * y < 0) {
                if (!s || transformSize(s.x, s.y, matrix).height > transformSize(x, y, matrix).height)
                {
                    egret.Point.release(s);
                    s = egret.Point.create(x, y);
                }
            }
        }

        if (s)
            return s;

        var b = matrix.b;
        var d = matrix.d;
        var d1 = (b * d >= 0) ? d : -d;
        return solveEquation(a, c1, w, minX, minY, maxX, maxY, b, d1);
    }

    /**
     * @private
     */
    function solveEquation(a:number,
                           c:number,
                           w:number,
                           minX:number,
                           minY:number,
                           maxX:number,
                           maxY:number,
                           b:number,
                           d:number):egret.Point {
        if (a == 0 || c == 0)
            return null;

        var x:number;
        var y:number;

        var A = (w - minX * a) / c;
        var B = (w - maxX * a) / c;
        var rangeMinY = Math.max(minY, Math.min(A, B));
        var rangeMaxY = Math.min(maxY, Math.max(A, B));
        var det = (b * c - a * d);

        if (rangeMinY <= rangeMaxY) {
            if (Math.abs(det) < 1.0e-9) {
                y = w / ( a + c );
            }
            else {
                y = b * w / det;
            }

            y = Math.max(rangeMinY, Math.min(y, rangeMaxY));

            x = (w - c * y) / a;
            return egret.Point.create(x, y);
        }

        A = -(minX * a + w) / c;
        B = -(maxX * a + w) / c;
        rangeMinY = Math.max(minY, Math.min(A, B));
        rangeMaxY = Math.min(maxY, Math.max(A, B));

        if (rangeMinY <= rangeMaxY) {
            if (Math.abs(det) < 1.0e-9) {
                y = -w / ( a + c );
            }
            else {
                y = -b * w / det;
            }

            y = Math.max(rangeMinY, Math.min(y, rangeMaxY));
            x = (-w - c * y) / a;
            return egret.Point.create(x, y);

        }
        return null;
    }

    /**
     * @private
     */
    function calcUBoundsToFitTBounds(w:number,
                                     h:number,
                                     matrix:egret.Matrix,
                                     minX:number,
                                     minY:number,
                                     maxX:number,
                                     maxY:number):egret.Point {

        var a = matrix.a;
        var b = matrix.b;
        var c = matrix.c;
        var d = matrix.d;

        if (-1.0e-9 < a && a < +1.0e-9)
            a = 0;
        if (-1.0e-9 < b && b < +1.0e-9)
            b = 0;
        if (-1.0e-9 < c && c < +1.0e-9)
            c = 0;
        if (-1.0e-9 < d && d < +1.0e-9)
            d = 0;

        if (b == 0 && c == 0) {
            if (a == 0 || d == 0)
                return null;

            return egret.Point.create(w / Math.abs(a), h / Math.abs(d));
        }

        if (a == 0 && d == 0) {
            if (b == 0 || c == 0)
                return null;

            return egret.Point.create(h / Math.abs(b), w / Math.abs(c));
        }

        var c1 = ( a * c >= 0 ) ? c : -c;
        var d1 = ( b * d >= 0 ) ? d : -d;

        var det = a * d1 - b * c1;
        if (Math.abs(det) < 1.0e-9) {
            if (c1 == 0 || a == 0 || a == -c1)
                return null;

            if (Math.abs(a * h - b * w) > 1.0e-9)
                return null;

            return solveEquation(a, c1, w, minX, minX, maxX, maxY, b, d1);
        }

        var invDet = 1 / det;
        w *= invDet;
        h *= invDet;

        var s:egret.Point;
        s = solveSystem(a, c1, b, d1, w, h);
        if (s &&
            minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
            a * s.x + c1 * s.x >= 0 &&
            b * s.x + d1 * s.y >= 0)
            return s;

        s = solveSystem(a, c1, b, d1, w, -h);
        if (s &&
            minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
            a * s.x + c1 * s.x >= 0 &&
            b * s.x + d1 * s.y < 0)
            return s;

        s = solveSystem(a, c1, b, d1, -w, h);
        if (s &&
            minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
            a * s.x + c1 * s.x < 0 &&
            b * s.x + d1 * s.y >= 0)
            return s;

        s = solveSystem(a, c1, b, d1, -w, -h);
        if (s &&
            minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
            a * s.x + c1 * s.x < 0 &&
            b * s.x + d1 * s.y < 0)
            return s;

        egret.Point.release(s);
        return null;
    }

    /**
     * @private
     */
    function transformSize(width:number, height:number, matrix:egret.Matrix):egret.Rectangle {

        var bounds = egret.$TempRectangle.setTo(0, 0, width, height);
        matrix.$transformBounds(bounds);
        return bounds;
    }

    /**
     * @private
     */
    function solveSystem(a:number,
                         c:number,
                         b:number,
                         d:number,
                         mOverDet:number,
                         nOverDet:number):egret.Point {
        return egret.Point.create(d * mOverDet - c * nOverDet,
            a * nOverDet - b * mOverDet);
    }
}