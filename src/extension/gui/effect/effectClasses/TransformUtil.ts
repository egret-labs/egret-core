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
     * @class egret.gui.TransformUtil
     */
    export class TransformUtil{
        /**
         * 将显示对象按照给定的转换中心调整位置
         * @param obj 要转换的显示对象
         * @param transformCenter 转换中心点，以显示对象为坐标系
         * @param translation 新的转换中心的位置，以显示对象的父容器为坐标系
         * @param scaleX 新的缩放值scaleX，如果为NaN则不设置
         * @param scaleY 新的缩放值scaleY，如果为NaN则不设置
         * @param rotation 新的旋转角度，如果为NaN则不设置
         */
        public static transformAround(obj:egret.DisplayObject,
                                               transformCenter:egret.Point,
                                               translation:egret.Point = null,
                                               scaleX:number = NaN,
                                               scaleY:number = NaN,
                                               rotation:number = NaN):void{
            if (translation == null && transformCenter != null){
                egret.$TempPoint.x = transformCenter.x;
                egret.$TempPoint.y = transformCenter.y;
                var xformedPt:egret.Point = TransformUtil.transformPointToParent(obj , egret.$TempPoint);
            }
            if (!isNaN(rotation))
                obj.rotation = rotation;
            if (!isNaN(scaleX))
                obj.scaleX = scaleX;
            if (!isNaN(scaleY))
                obj.scaleY = scaleY;
            
            if (transformCenter == null){
                if (translation != null){
                    obj.x = translation.x;
                    obj.y = translation.y;
                }
            }
            else{
                egret.$TempPoint.x = transformCenter.x;
                egret.$TempPoint.y = transformCenter.y;
                var postXFormPoint:egret.Point = TransformUtil.transformPointToParent(obj , egret.$TempPoint);
                if (translation != null){
                    obj.x += translation.x - postXFormPoint.x;
                    obj.y += translation.y - postXFormPoint.y;
                }
                else{
                    obj.x += xformedPt.x - postXFormPoint.x;
                    obj.y += xformedPt.y - postXFormPoint.y;
                }
            }
        }
        
        public static transformPointToParent(obj:egret.DisplayObject,localPosition:egret.Point = null):egret.Point{
            var resultPoint:Point = new Point();
            if (localPosition){
                resultPoint.x = localPosition.x;
                resultPoint.y = localPosition.y;
            }
            if(obj.parent)
            {
                obj.localToGlobal(resultPoint.x,resultPoint.y,resultPoint);
                obj.parent.globalToLocal(resultPoint.x,resultPoint.y,resultPoint);
            }
            return resultPoint;
        }
    }
}