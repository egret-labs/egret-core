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
        public offsetX: number = 0;
        public offsetY: number = 0;

        constructor() {
        }

        public clear(): void {
            this.displayObject = null;
            this.renderTarget = null;
            this.filters = null;
            this.compositeOp = '';
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
            offsetX: number, offsetY: number): void {
            //
            if (filters.length <= 0) {
                console.error('FilterSystem:push:filters.length = ' + filters.length);
            }
            //
            const _defaultFilterStack = this._defaultFilterStack;
            const state = this._statePool.pop() || new FilterState();
            //
            if (_defaultFilterStack.length === 1) {
                _defaultFilterStack[0].renderTarget = buffer;
            }
            _defaultFilterStack.push(state);
            //install.....
            state.displayObject = displayObject;
            //width, height
            const displayBounds = displayObject.$getOriginalBounds();
            state.offsetX = displayObject._worldTransform._offsetX;
            state.offsetY = displayObject._worldTransform._offsetY;
            if (offsetX !== displayObject._worldTransform._offsetX || offsetY !== displayObject._worldTransform._offsetY) {
                console.error('offsetX !== displayObject._worldTransform._offsetX || offsetY !== displayObject._worldTransform._offset');
            }
            //render target
            state.renderTarget = WebGLRenderBuffer.create(displayBounds.width, displayBounds.height);
            //save filters
            state.filters = filters;
            //save blendFunc;
            state.compositeOp = blendModes[displayObject.$blendMode] || defaultCompositeOp;
            //
            this._webglRenderContext.pushBuffer(state.renderTarget);
            const cmd = AdvancedRenderCommand.create(displayObject, buffer, offsetX, offsetY);
            AdvancedRenderCommand.pushCommand(cmd);
            web.DisplayObjectTransform.transformObjectAsRoot(displayObject, state.renderTarget.globalMatrix, -displayBounds.x, -displayBounds.y);




            /*
            if (filters.length <= 0) {
                console.error('FilterSystem:push:filters.length = ' + filters.length);
            }
            //
            const filterStack = this.defaultFilterStack;
            const state = this.statePool.pop() || new FilterState();
            //
            if (filterStack.length === 1) {
                this.defaultFilterStack[0].renderTexture = renderTargetRoot;
            }
            filterStack.push(state);
            //install
            state.displayObject = target;
            //width, height
            const displayBounds = target.$getOriginalBounds();
            state.displayBoundsX = displayBounds.x;
            state.displayBoundsY = displayBounds.y;
            state.displayBoundsWidth = displayBounds.width;
            state.displayBoundsHeight = displayBounds.height;
            state.offsetX = offsetX;
            state.offsetY = offsetY;
            //render target
            state.renderTexture = this.getOptimalFilterTexture(displayBounds.width, displayBounds.height);
            state.rootRenderTexture = renderTargetRoot;
            state.filters = filters;
            //save blendFunc;
            state.currentCompositeOp = blendModes[target.$blendMode] || defaultCompositeOp;




            ////重新变换
            const _webglRenderContext = this._webglRenderContext;
            const targetTexture = state.renderTexture;
            //绑定目标
            _webglRenderContext.pushBuffer(targetTexture);
            ///设置位置，不再相对全局，而是局部
            drawAdvancedData.renderTarget = targetTexture;
            drawAdvancedData.offsetX = -state.displayBoundsX;
            drawAdvancedData.offsetY = -state.displayBoundsY;
            //need transform
            if (egret.transformRefactor) {
                state.displayObject.transformAsRenderRoot(-state.displayBoundsX, -state.displayBoundsY, targetTexture.globalMatrix);
                //state.displayObject.transform(-state.displayBoundsX, -state.displayBoundsY);
            }
            */
        }

        public pop(): void {
            //
            const _defaultFilterStack = this._defaultFilterStack;
            const state = _defaultFilterStack.pop();
            const lastState = _defaultFilterStack[_defaultFilterStack.length - 1];
            const filters = state.filters;
            //this.activeState = state;
            //const _webglRenderContext = this._webglRenderContext;
            //unbind target
            //_webglRenderContext.popBuffer(state.renderTexture);
            this._webglRenderContext.popBuffer(state.renderTarget);
            //
            //_webglRenderContext.setGlobalCompositeOperation(state.currentCompositeOp);
            //
            if (filters.length === 1) {

                const filters0 = filters[0];
                if (filters0.type === 'SpriteMaskFilter') {
                    //SpriteMaskFilter单独处理
                    //this.applySpriteMaskFilter(filters0, state.renderTexture, lastState.renderTexture, false, state);
                    console.error('un impl!');
                }
                else {

                    // let drawCalls = 1;
                    // const buffer = lastState.renderTarget;
                    // const compositeOp = state.compositeOp;
                    // const offsetX = state.offsetX;
                    // const offsetY = state.offsetY;
                    // const displayBounds = state.displayObject.$getOriginalBounds();
                    // const displayBoundsX = displayBounds.x;
                    // const displayBoundsY = displayBounds.y;

                    // //绘制结果到屏幕
                    // if (drawCalls > 0) {
                    //     //if (hasBlendMode) {
                    //     buffer.context.setGlobalCompositeOperation(compositeOp);
                    //     //}
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
                    //     buffer.context.drawTargetWidthFilters(filters, state.renderTarget);
                    //     curMatrix.a = savedMatrix.a;
                    //     curMatrix.b = savedMatrix.b;
                    //     curMatrix.c = savedMatrix.c;
                    //     curMatrix.d = savedMatrix.d;
                    //     curMatrix.tx = savedMatrix.tx;
                    //     curMatrix.ty = savedMatrix.ty;
                    //     Matrix.release(savedMatrix);
                    //     //if (hasBlendMode) {
                    //     buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    //     //}
                    // }
                    //renderBufferPool.push(displayBuffer);









                    //后处理
                    this.applyFilter(filters0, state.renderTarget, lastState.renderTarget, false, state);
                    // //return 不管用没用，都还回去
                    WebGLRenderBuffer.release(state.renderTarget);
                    state.renderTarget = null;
                }
            }
            else {
                /*
                //
                let input = state.renderTexture;
                const filtersLen = filters.length;
                if (filtersLen > 1) {
                    for (let i = 0; i < filtersLen - 1; ++i) {
                        const filter = filters[i];
                        const output = this.getOptimalFilterTexture(state.displayBoundsWidth, state.displayBoundsHeight);
                        output.debugCurrentRenderNode = null;
                        _webglRenderContext.___drawToRenderTarget___(filter, input, output);
                        this.returnFilterTexture(input);
                        input = output;
                    }
                }
                //应用最后一个滤镜并绘制到当前场景中
                const lastFilter = filters[filtersLen - 1];
                if (lastFilter) {
                    lastState.renderTexture.debugCurrentRenderNode = null;
                    this.applyFilter(lastFilter, input, lastState.renderTexture, false, state);
                    this.returnFilterTexture(input);
                    input = null;
                }
                else {
                    console.error('FilterSystem:pop:filtersLen = ' + filtersLen);
                }
                */
                console.error('un impl!');
            }
            //
            //_webglRenderContext.setGlobalCompositeOperation(defaultCompositeOp);
            //清除，回池
            state.clear();
            this._statePool.push(state);
        }

        // private getOptimalFilterTexture(minWidth: number, minHeight: number, resolution: number = 1): WebGLRenderBuffer {
        //     return this.__createRenderBuffer__(minWidth, minHeight);
        // }

        private applySpriteMaskFilter(filter: Filter, input: WebGLRenderBuffer, output: WebGLRenderBuffer, clear: boolean, state: FilterState): void {

            /*
            //绘制遮罩
            const mask = state.displayObject.$mask;
            const displayObject = state.displayObject;
            const displayBoundsX = state.displayBoundsX;
            const displayBoundsY = state.displayBoundsY;
            const displayBoundsWidth = state.displayBoundsWidth;
            const displayBoundsHeight = state.displayBoundsHeight;
            const displayBuffer = state.renderTexture;
            const offsetX = state.offsetX;
            const offsetY = state.offsetY;
            let drawCalls = 0;

            if (mask) {
                let maskBuffer = WebGLRenderBuffer.create(displayBoundsWidth, displayBoundsHeight);//this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                maskBuffer.context.pushBuffer(maskBuffer);
                let maskMatrix = Matrix.create();
                const maskConcatenatedMatrix = mask.$getConcatenatedMatrix();
                maskMatrix.copyFrom(maskConcatenatedMatrix);
                mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
                maskMatrix.translate(-displayBoundsX, -displayBoundsY);
                maskBuffer.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                Matrix.release(maskMatrix);
                //
                if (egret.transformRefactor) {
                    mask.transformAsRenderRoot(0, 0, maskBuffer.globalMatrix);
                    //mask.transform(0, 0);
                }
                drawCalls += this._webglRender.drawDisplayObject(mask, maskBuffer, 0, 0);
                maskBuffer.context.popBuffer(maskBuffer);
                displayBuffer.context.setGlobalCompositeOperation("destination-in");
                displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                let maskBufferWidth = maskBuffer.rootRenderTarget.width;
                let maskBufferHeight = maskBuffer.rootRenderTarget.height;

                this._webglRenderContext.pushBuffer(displayBuffer);///??

                displayBuffer.debugCurrentRenderNode = null;
                displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight,
                    0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
                displayBuffer.context.setGlobalCompositeOperation("source-over");
                maskBuffer.setTransform(1, 0, 0, 1, 0, 0);
                //renderBufferPool.push(maskBuffer);
                WebGLRenderBuffer.release(maskBuffer);

                this._webglRenderContext.popBuffer(displayBuffer); ///???
            }

            displayBuffer.context.setGlobalCompositeOperation(defaultCompositeOp);
            //displayBuffer.context.popBuffer();

            //绘制结果到屏幕
            if (drawCalls > 0) {
                drawCalls++;
                const buffer = output;//state.renderTarget;
                let hasBlendMode = (displayObject.$blendMode !== 0);
                let compositeOp: string;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(compositeOp);
                }
               
                let savedMatrix = Matrix.create();
                let curMatrix = buffer.globalMatrix;
                savedMatrix.a = curMatrix.a;
                savedMatrix.b = curMatrix.b;
                savedMatrix.c = curMatrix.c;
                savedMatrix.d = curMatrix.d;
                savedMatrix.tx = curMatrix.tx;
                savedMatrix.ty = curMatrix.ty;
                curMatrix.append(1, 0, 0, -1, offsetX + displayBoundsX, offsetY + displayBoundsY + displayBuffer.height);
                let displayBufferWidth = displayBuffer.rootRenderTarget.width;
                let displayBufferHeight = displayBuffer.rootRenderTarget.height;
                buffer.debugCurrentRenderNode = null;
                buffer.context.drawTexture(displayBuffer.rootRenderTarget.texture, 0, 0, displayBufferWidth, displayBufferHeight,
                    0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
             
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                let matrix = buffer.globalMatrix;
                matrix.a = savedMatrix.a;
                matrix.b = savedMatrix.b;
                matrix.c = savedMatrix.c;
                matrix.d = savedMatrix.d;
                matrix.tx = savedMatrix.tx;
                matrix.ty = savedMatrix.ty;
                Matrix.release(savedMatrix);
            }
            //renderBufferPool.push(displayBuffer);
            WebGLRenderBuffer.release(displayBuffer);
            */
        }

        public applyFilter(filter: Filter, input: WebGLRenderBuffer, output: WebGLRenderBuffer, clear: boolean, state: FilterState): void {

            const buffer = output;//lastState.renderTarget;
            const compositeOp = state.compositeOp;
            const offsetX = state.offsetX;
            const offsetY = state.offsetY;
            const displayBounds = state.displayObject.$getOriginalBounds();
            const displayBoundsX = displayBounds.x;
            const displayBoundsY = displayBounds.y;
            const _webglRenderContext = this._webglRenderContext;



            //if (hasBlendMode) {
            _webglRenderContext.setGlobalCompositeOperation(compositeOp);
            //}
            //drawCalls++;
            // 绘制结果的时候，应用滤镜
            buffer.$offsetX = offsetX + displayBoundsX;
            buffer.$offsetY = offsetY + displayBoundsY;
            const savedMatrix = Matrix.create();
            const curMatrix = buffer.globalMatrix;
            savedMatrix.a = curMatrix.a;
            savedMatrix.b = curMatrix.b;
            savedMatrix.c = curMatrix.c;
            savedMatrix.d = curMatrix.d;
            savedMatrix.tx = curMatrix.tx;
            savedMatrix.ty = curMatrix.ty;
            buffer.useOffset();
            _webglRenderContext.drawTargetWidthFilters([filter], input);
            curMatrix.a = savedMatrix.a;
            curMatrix.b = savedMatrix.b;
            curMatrix.c = savedMatrix.c;
            curMatrix.d = savedMatrix.d;
            curMatrix.tx = savedMatrix.tx;
            curMatrix.ty = savedMatrix.ty;
            Matrix.release(savedMatrix);
            //if (hasBlendMode) {
            _webglRenderContext.setGlobalCompositeOperation(defaultCompositeOp);




            // const _webglRenderContext = this._webglRenderContext;
            // /*
            // ************************
            // */
            // output.$offsetX = state.offsetX + state.displayBoundsX;
            // output.$offsetY = state.offsetY + state.displayBoundsY;
            // const savedMatrix = Matrix.create();
            // const curMatrix = output.globalMatrix;
            // savedMatrix.a = curMatrix.a;
            // savedMatrix.b = curMatrix.b;
            // savedMatrix.c = curMatrix.c;
            // savedMatrix.d = curMatrix.d;
            // savedMatrix.tx = curMatrix.tx;
            // savedMatrix.ty = curMatrix.ty;
            // const savedOffsetX = output.$offsetX;
            // const savedOffsetY = output.$offsetY;
            // output.useOffset();
            // /*
            // ************************
            // */
            // output.debugCurrentRenderNode = null;//do not render using renderNode
            // _webglRenderContext.___drawToRenderTarget___(filter, input, output);
            // /*
            // ************************
            // */
            // curMatrix.a = savedMatrix.a;
            // curMatrix.b = savedMatrix.b;
            // curMatrix.c = savedMatrix.c;
            // curMatrix.d = savedMatrix.d;
            // curMatrix.tx = savedMatrix.tx;
            // curMatrix.ty = savedMatrix.ty;
            // output.$offsetX = savedOffsetX;
            // output.$offsetY = savedOffsetY;
            // Matrix.release(savedMatrix);
        }

        // private returnFilterTexture(renderTexture: WebGLRenderBuffer): void {
        //     WebGLRenderBuffer.release(renderTexture);
        // }

        // private __createRenderBuffer__(width: number, height: number): WebGLRenderBuffer {
        //     return WebGLRenderBuffer.create(width, height);
        // }
    }
}