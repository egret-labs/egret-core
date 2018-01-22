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

namespace egret.sys {

    let CAPS_STYLES = ["none", "round", "square"];
    let JOINT_STYLES = ["bevel", "miter", "round"];
    /**
     * @private
     * 矢量渲染节点
     */
    export class GraphicsNode extends RenderNode {

        public constructor() {
            super();
            this.type = RenderNodeType.GraphicsNode;
        }

        /**
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * @param color 填充的颜色
         * @param alpha 填充的 Alpha 值
         * @param beforePath 插入在指定的路径命令之前绘制，通常是插入到当前正在绘制的线条路径之前，以确保线条总在填充的上方。
         */
        public beginFill(color:number, alpha:number = 1, beforePath?:Path2D):Path2D {
            let path = new sys.FillPath();
            path.fillColor = color;
            path.fillAlpha = alpha;
            if (beforePath) {
                let index = this.drawData.lastIndexOf(beforePath);
                this.drawData.splice(index, 0, path);
            }
            else {
                this.drawData.push(path);
            }
            this.renderCount++;
            return path;
        }

        /**
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * @param type 用于指定要使用哪种渐变类型的 GradientType 类的值：GradientType.LINEAR 或 GradientType.RADIAL。
         * @param colors 渐变中使用的 RGB 十六进制颜色值的数组（例如，红色为 0xFF0000，蓝色为 0x0000FF，等等）。对于每种颜色，请在 alphas 和 ratios 参数中指定对应值。
         * @param alphas colors 数组中对应颜色的 alpha 值数组。
         * @param ratios 颜色分布比率的数组。有效值为 0 到 255。
         * @param matrix 一个由 egret.Matrix 类定义的转换矩阵。egret.Matrix 类包括 createGradientBox() 方法，通过该方法可以方便地设置矩阵，以便与 beginGradientFill() 方法一起使用
         * @param beforePath 插入在指定的路径命令之前绘制，通常是插入到当前正在绘制的线条路径之前，以确保线条总在填充的上方。
         */
        public beginGradientFill(type:string, colors:number[], alphas:number[], ratios:number[],
                                 matrix?:egret.Matrix, beforePath?:Path2D):Path2D {
            let m = new egret.Matrix();
            if (matrix) {
                m.a = matrix.a * 819.2;
                m.b = matrix.b * 819.2;
                m.c = matrix.c * 819.2;
                m.d = matrix.d * 819.2;
                m.tx = matrix.tx;
                m.ty = matrix.ty;
            }
            else {
                //默认值
                m.a = 100;
                m.d = 100;
            }
            let path = new sys.GradientFillPath();
            path.gradientType = type;
            path.colors = colors;
            path.alphas = alphas;
            path.ratios = ratios;
            path.matrix = m;
            if (beforePath) {
                let index = this.drawData.lastIndexOf(beforePath);
                this.drawData.splice(index, 0, path);
            }
            else {
                this.drawData.push(path);
            }
            this.renderCount++;
            return path;
        }

        /**
         * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
         * @param thickness 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param caps 用于指定线条末端处端点类型的 CapsStyle 类的值。默认值：CapsStyle.ROUND
         * @param joints 指定用于拐角的连接外观的类型。默认值：JointStyle.ROUND
         * @param miterLimit 用于表示剪切斜接的极限值的数字。
         */
        public lineStyle(thickness?:number, color?:number, alpha:number = 1, caps?:string,
                         joints?:string, miterLimit:number = 3):StrokePath {
            if (CAPS_STYLES.indexOf(caps) == -1) {
                caps = "round";
            }
            if (JOINT_STYLES.indexOf(joints) == -1) {
                joints = "round";
            }
            let path = new StrokePath();
            path.lineWidth = thickness;
            path.lineColor = color;
            path.lineAlpha = alpha;
            path.caps = caps || CapsStyle.ROUND;
            path.joints = joints;
            path.miterLimit = miterLimit;
            this.drawData.push(path);
            this.renderCount++;
            return path;
        }

        /**
         * 清空所有缓存的绘制数据
         */
        public clear():void {
            this.drawData.length = 0;
            this.dirtyRender = true;
            this.renderCount = 0;
        }

        /**
         * 覆盖父类方法，不自动清空缓存的绘图数据，改为手动调用clear()方法清空。
         */
        public cleanBeforeRender():void {

        }

        //forWebGL
        /**
         * 绘制x偏移
         */
        public x:number;
        /**
         * 绘制y偏移
         */
        public y:number;
        /**
         * 绘制宽度
         */
        public width:number;
        /**
         * 绘制高度
         */
        public height:number;
        /**
         * 脏渲染标记
         * 暂时调用lineStyle,beginFill,beginGradientFill标记,实际应该draw时候标记在Path2D
         */
        public dirtyRender:boolean = true;
        public $texture:WebGLTexture;
        public $textureWidth:number;
        public $textureHeight:number;
        public $canvasScaleX:number;
        public $canvasScaleY:number;

        /**
         * 清除非绘制的缓存数据
         */
        public clean():void {
            if(this.$texture) {
                WebGLUtils.deleteWebGLTexture(this.$texture);
                this.$texture = null;
                this.dirtyRender = true;
            }
        }
    }
}