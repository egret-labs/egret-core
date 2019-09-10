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

namespace egret.web {

    class FilterState {

        public displayObject: DisplayObject;
        public renderTarget: egret.web.WebGLRenderBuffer;
        public filters: Array<Filter | CustomFilter> = [];
        public compositeOp: string = '';
        public displayBoundsX: number = 0;
        public displayBoundsY: number = 0;
        public displayBoundsWidth: number = 0;
        public displayBoundsHeight: number = 0;
        public offsetX: number = 0;
        public offsetY: number = 0;

        constructor() {
        }

        public clear(): void {
            this.displayObject = null;
            this.renderTarget = null;
            this.filters = null;
            this.compositeOp = '';
            this.displayBoundsX = 0;
            this.displayBoundsY = 0;
            this.displayBoundsWidth = 0;
            this.displayBoundsHeight = 0;
            this.offsetX = 0;
            this.offsetY = 0;
        }
    }

    export class FilterSystem {

        private readonly _statePool: FilterState[] = [];
        private readonly _defaultFilterStack: FilterState[] = [];
        private readonly _webglRenderContext: WebGLRenderContext;
        public _webglRender: WebGLRenderer = null;

        constructor(webglRenderContext: WebGLRenderContext) {
            this._statePool = [];
            this._defaultFilterStack.push(new FilterState);
            this._webglRenderContext = webglRenderContext;
        }

        public push(displayObject: DisplayObject,
            filters: Array<Filter | CustomFilter>,
            buffer: WebGLRenderBuffer,
            offsetX: number, offsetY: number): number {

            let drawCalls = 0;
            if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) {
                //return drawCalls;
            }
            //let filters = displayObject.$filters;
            let hasBlendMode = (displayObject.$blendMode !== 0);
            let compositeOp: string;
            if (hasBlendMode) {
                compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }

            const displayBounds = displayObject.$getOriginalBounds();
            const displayBoundsX = displayBounds.x;
            const displayBoundsY = displayBounds.y;
            const displayBoundsWidth = displayBounds.width;
            const displayBoundsHeight = displayBounds.height;
            if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                //return drawCalls;
            }

            const _webglRender = this._webglRender;

            // if (!displayObject.mask && filters.length == 1 && (filters[0].type == "colorTransform" || (filters[0].type === "custom" && (<CustomFilter>filters[0]).padding === 0))) {
            //     let childrenDrawCount = _webglRender.getRenderCount(displayObject);
            //     if (!displayObject.$children || childrenDrawCount == 1) {
            //         if (hasBlendMode) {
            //             buffer.context.setGlobalCompositeOperation(compositeOp);
            //         }

            //         buffer.context.$filter = <ColorMatrixFilter>filters[0];
            //         DisplayObjectTransform.transformObjectAsRoot(displayObject, buffer.globalMatrix, offsetX, offsetY);
            //         if (displayObject.$mask) {
            //             drawCalls += _webglRender.drawWithClip(displayObject, buffer, offsetX, offsetY);
            //         }
            //         else if (displayObject.$scrollRect || displayObject.$maskRect) {
            //             drawCalls += _webglRender.drawWithScrollRect(displayObject, buffer, offsetX, offsetY);
            //         }
            //         else {
            //             drawCalls += _webglRender.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
            //         }

            //         buffer.context.$filter = null;

            //         if (hasBlendMode) {
            //             buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
            //         }

            //         return drawCalls;
            //     }
            // }

            // 为显示对象创建一个新的buffer
            let displayBuffer = _webglRender.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
            this._webglRenderContext.pushBuffer(displayBuffer);

            ///?????
            if (filters.length <= 0) {
                console.error('FilterSystem:push:filters.length = ' + filters.length);
            }
            //
            const _defaultFilterStack = this._defaultFilterStack;
            const state = this._statePool.pop() || new FilterState();
            //
            if (_defaultFilterStack.length === 1) {
                this._defaultFilterStack[0].renderTarget = buffer;
            }
            _defaultFilterStack.push(state);
            //install
            state.displayObject = displayObject;
            //width, height
            //const displayBounds = target.$getOriginalBounds();
            state.displayBoundsX = displayBounds.x;
            state.displayBoundsY = displayBounds.y;
            state.displayBoundsWidth = displayBounds.width;
            state.displayBoundsHeight = displayBounds.height;
            state.offsetX = offsetX;
            state.offsetY = offsetY;
            //render target
            state.renderTarget = displayBuffer;//this.getOptimalFilterTexture(displayBounds.width, displayBounds.height);
            //state.rootRenderTexture = renderTargetRoot;
            state.filters = filters;
            //save blendFunc;
            state.compositeOp = blendModes[displayObject.$blendMode] || defaultCompositeOp;
            ////重新变换
            // const _webglRenderContext = this._webglRenderContext;
            // const targetTexture = state.renderTexture;
            ///?????

            //todo 可以优化减少draw次数
            // if (displayObject.$mask) {
            //     drawCalls += _webglRender.drawWithClip(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
            // }
            // else if (displayObject.$scrollRect || displayObject.$maskRect) {
            //     drawCalls += _webglRender.drawWithScrollRect(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
            // }
            // else {
                /////
                DisplayObjectTransform.transformObjectAsRoot(displayObject, displayBuffer.globalMatrix, -displayBoundsX, -displayBoundsY);
                /////
                drawCalls += _webglRender.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
            //}

            // displayBuffer.context.popBuffer();

            // //绘制结果到屏幕
            // if (drawCalls > 0) {
            //     if (hasBlendMode) {
            //         buffer.context.setGlobalCompositeOperation(compositeOp);
            //     }
            //     drawCalls++;
            //     // 绘制结果的时候，应用滤镜
            //     buffer.$offsetX = offsetX + displayBoundsX;
            //     buffer.$offsetY = offsetY + displayBoundsY;
            //     let savedMatrix = Matrix.create();
            //     let curMatrix = buffer.globalMatrix;
            //     savedMatrix.a = curMatrix.a;
            //     savedMatrix.b = curMatrix.b;
            //     savedMatrix.c = curMatrix.c;
            //     savedMatrix.d = curMatrix.d;
            //     savedMatrix.tx = curMatrix.tx;
            //     savedMatrix.ty = curMatrix.ty;
            //     buffer.useOffset();
            //     buffer.context.drawTargetWidthFilters(filters, displayBuffer);
            //     curMatrix.a = savedMatrix.a;
            //     curMatrix.b = savedMatrix.b;
            //     curMatrix.c = savedMatrix.c;
            //     curMatrix.d = savedMatrix.d;
            //     curMatrix.tx = savedMatrix.tx;
            //     curMatrix.ty = savedMatrix.ty;
            //     Matrix.release(savedMatrix);
            //     if (hasBlendMode) {
            //         buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
            //     }
            // }
            // renderBufferPool.push(displayBuffer);
            return drawCalls;
        }

        public pop(): void {
            //
            const _defaultFilterStack = this._defaultFilterStack;
            const state = _defaultFilterStack.pop();
            const lastState = _defaultFilterStack[_defaultFilterStack.length - 1];
            const filters = state.filters;
            //this.activeState = state;
            const _webglRenderContext = this._webglRenderContext;
            //unbind target
            _webglRenderContext.popBuffer(state.renderTarget);
            //
            //_webglRenderContext.setGlobalCompositeOperation(state.compositeOp);
            //
            if (filters.length === 1) {

                const filters0 = filters[0];


                let drawCalls = 1;
                const compositeOp = state.compositeOp;
                const buffer = lastState.renderTarget;

                const offsetX = state.offsetX;
                const offsetY = state.offsetY;
                const displayBoundsX = state.displayBoundsX;
                const displayBoundsY = state.displayBoundsY;


                // displayBuffer.context.popBuffer();

                //绘制结果到屏幕
                if (drawCalls > 0) {
                    //if (hasBlendMode) {
                    _webglRenderContext.setGlobalCompositeOperation(compositeOp);
                    //}
                    drawCalls++;
                    // 绘制结果的时候，应用滤镜
                    const bufferOffsetX = buffer.$offsetX;
                    const bufferOffsetY = buffer.$offsetY;

                    buffer.$offsetX = offsetX + displayBoundsX;
                    buffer.$offsetY = offsetY + displayBoundsY;
                    let savedMatrix = Matrix.create();
                    let curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    buffer.useOffset();
                    buffer.context.drawTargetWidthFilters(filters, state.renderTarget);
                    curMatrix.a = savedMatrix.a;
                    curMatrix.b = savedMatrix.b;
                    curMatrix.c = savedMatrix.c;
                    curMatrix.d = savedMatrix.d;
                    curMatrix.tx = savedMatrix.tx;
                    curMatrix.ty = savedMatrix.ty;
                    Matrix.release(savedMatrix);

                    //
                    buffer.$offsetX = bufferOffsetX;
                    buffer.$offsetY = bufferOffsetY;

                    //if (hasBlendMode) {
                    _webglRenderContext.setGlobalCompositeOperation(defaultCompositeOp);
                    //}
                }
                renderBufferPool.push(state.renderTarget);
                state.renderTarget = null;
                //return drawCalls;





                // if (filters0.type === 'SpriteMaskFilter') {
                //     //SpriteMaskFilter单独处理
                //     //this.applySpriteMaskFilter(filters0, state.renderTexture, lastState.renderTexture, false, state);
                // }
                // else {
                //     // //后处理
                //     // this.applyFilter(filters[0], state.renderTexture, lastState.renderTexture, false, state);
                //     // //return 不管用没用，都还回去
                //     // this.returnFilterTexture(state.renderTexture);
                //     // state.renderTexture = null;
                // }
            }
            else {
                // //
                // let input = state.renderTexture;
                // const filtersLen = filters.length;
                // if (filtersLen > 1) {
                //     for (let i = 0; i < filtersLen - 1; ++i) {
                //         const filter = filters[i];
                //         const output = this.getOptimalFilterTexture(state.displayBoundsWidth, state.displayBoundsHeight);
                //         output.debugCurrentRenderNode = null;
                //         _webglRenderContext.___drawToRenderTarget___(filter, input, output);
                //         this.returnFilterTexture(input);
                //         input = output;
                //     }
                // }
                // //应用最后一个滤镜并绘制到当前场景中
                // const lastFilter = filters[filtersLen - 1];
                // if (lastFilter) {
                //     lastState.renderTexture.debugCurrentRenderNode = null;
                //     this.applyFilter(lastFilter, input, lastState.renderTexture, false, state);
                //     this.returnFilterTexture(input);
                //     input = null;
                // }
                // else {
                //     console.error('FilterSystem:pop:filtersLen = ' + filtersLen);
                // }
            }
            //
            // _webglRenderContext.setGlobalCompositeOperation(defaultCompositeOp);
            //清除，回池
            state.clear();
            this._statePool.push(state);
        }

        public applyFilter(filter: Filter, input: WebGLRenderBuffer, output: WebGLRenderBuffer, clear: boolean, state: FilterState): void {
        }
    }
}