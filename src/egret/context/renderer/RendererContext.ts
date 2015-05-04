/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {
    /**
     * @class egret.RendererContext
     * @classdesc
     * RenderContext是游戏的渲染上下文。
     * 这是一个抽象基类，制定主要的接口
     * @extends egret.HashObject
     * @private
     */
    export class RendererContext extends HashObject {


        /**
         * 渲染全部纹理的时间开销
         * @member egret.RendererContext#renderCost
         */
        public renderCost:number = 0;

        /**
         * 绘制纹理的缩放比率，默认值为1
         * @member egret.RendererContext#texture_scale_factor
         */
        public _texture_scale_factor:number = 1;

        public set texture_scale_factor(value:number) {
            this._setTextureScaleFactor(value);
        }

        public _setTextureScaleFactor(value:number):void {
            this._texture_scale_factor = value;
        }

        public  get texture_scale_factor():number {
            return this._texture_scale_factor;
        }

        /**
         * 是否对图像使用平滑处理
         * 该特性目前只支持Canvas
         */
        public static imageSmoothingEnabled:boolean = true;

        private profiler:Profiler;

        /**
         * @method egret.RendererContext#constructor
         */
        public constructor() {
            super();
            this.profiler = Profiler.getInstance();
            if(!RendererContext.blendModesForGL) {
                RendererContext.initBlendMode();
            }
        }

        /**
         * @method egret.RendererContext#clearScreen
         * @private
         */
        public clearScreen() {
        }


        /**
         * 清除Context的渲染区域
         * @method egret.RendererContext#clearRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {numbe}
         */
        public clearRect(x:number, y:number, w:number, h:number) {

        }

        /**
         * 绘制图片
         * @method egret.RendererContext#drawImage
         * @param texture {Texture}
         * @param sourceX {any}
         * @param sourceY {any}
         * @param sourceWidth {any}
         * @param sourceHeight {any}
         * @param destX {any}
         * @param destY {any}
         * @param destWidth {any}
         * @param destHeigh {any}
         */
        public drawImage(texture: Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, repeat="no-repeat") {
            this.profiler.onDrawImage();
        }

        /**
         * 绘制9宫图片
         * @method egret.RendererContext#drawImageScale9
         * @param texture {Texture}
         * @param sourceX {any}
         * @param sourceY {any}
         * @param sourceWidth {any}
         * @param sourceHeight {any}
         * @param destX {any}
         * @param destY {any}
         * @param destWidth {any}
         * @param destHeigh {any}
         */
        public drawImageScale9(texture: Texture, sourceX, sourceY, sourceWidth, sourceHeight, offX, offY, destWidth, destHeight, rect):boolean {
            return false;
        }

        public _addOneDraw():void {
            this.profiler.onDrawImage();
        }

        /**
         * 变换Context的当前渲染矩阵
         * @method egret.RendererContext#setTransform
         * @param matrix {egret.Matri}
         */
        public setTransform(matrix:egret.Matrix) {

        }

        /**
         * 设置渲染alpha
         * @method egret.RendererContext#setAlpha
         * @param value {number}
         * @param blendMode {egret.BlendMod}
         */
        public setAlpha(value:number, blendMode:string) {

        }


        /**
         * 设置渲染文本参数
         * @method egret.RendererContext#setupFont
         * @param textField {TextField}
         */
        public setupFont(textField:TextField, style:egret.ITextStyle = null):void {

        }


        /**
         * 测量文本
         * @method egret.RendererContext#measureText
         * @param text {string}
         * @returns {number}
         * @stable B 参数很可能会需要调整，和setupFont整合
         */
        public measureText(text:string):number {
            return 0;
        }

        /**
         * 绘制文本
         * @method egret.RendererContext#drawText
         * @param textField {egret.TextField}
         * @param text {string}
         * @param x {number}
         * @param y {number}
         * @param maxWidth {numbe}
         */
        public drawText(textField:egret.TextField, text:string, x:number, y:number, maxWidth:number, style:egret.ITextStyle = null) {
            this.profiler.onDrawImage();
        }

        public strokeRect(x, y, w, h, color) {
        }


        public pushMask(mask:Rectangle):void {

        }

        public popMask():void {

        }

        public onRenderStart():void {

        }

        public onRenderFinish():void {

        }

        public setGlobalColorTransform(colorTransformMatrix:Array<number>):void {

        }

        public setGlobalFilter(filterData:Filter):void {

        }

        public drawCursor(x1:number, y1:number, x2:number, y2:number):void {
        }

        public static createRendererContext(canvas:any):RendererContext {
            return null;
        }


        public static blendModesForGL:any = null;

        private static initBlendMode():void {
            RendererContext.blendModesForGL = {};
            RendererContext.blendModesForGL[BlendMode.NORMAL] = [1, 771];
            RendererContext.blendModesForGL[BlendMode.ADD] = [770, 1];
            RendererContext.blendModesForGL[BlendMode.ERASE] = [0, 771];
            RendererContext.blendModesForGL[BlendMode.ERASE_REVERSE] = [0, 770];
        }

        /**
         * 设置 gl 模式下的blendMode，canvas模式下不会生效
         * @method egret.RendererContext#registerBlendModeForGL
         * @param key {string} 键值
         * @param src {number} 源颜色因子
         * @param dst {number} 目标颜色因子
         * @param override {boolean} 是否覆盖
         */
        public static registerBlendModeForGL(key:string, src:number, dst:number, override?:boolean):void {
            if(RendererContext.blendModesForGL[key] && !override) {
                egret.Logger.warningWithErrorId(1005, key);
            }
            else {
                RendererContext.blendModesForGL[key] = [src, dst];
            }
        }
    }
}