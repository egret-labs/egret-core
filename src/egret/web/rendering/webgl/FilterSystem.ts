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
    /**
     * 一个数据
     */
    class FilterState {
        /**
         * 记录DisplayObject
         */
        public displayObject: DisplayObject;
        /**
         * 切换渲染目标
         */
        public renderTarget: egret.web.WebGLRenderBuffer;
        /**
         * 记录filters
         */
        public filters: Array<Filter | CustomFilter> = [];
        /**
         * 记录blend
         */
        public blend: string = '';
        /**
        * 记录displayBounds
        */
        public displayBoundsX: number = 0;
        public displayBoundsY: number = 0;
        public displayBoundsWidth: number = 0;
        public displayBoundsHeight: number = 0;
        /**
         * 记录目标绘制的绝对偏移
         */
        public offsetX: number = 0;
        public offsetY: number = 0;
        /**
         * constructor
         */
        constructor() {
        }
        /**
         * 因为是池化的管理，全部都是引用和字面值，弃掉就好
         */
        public clear(): void {
            this.displayObject = null;
            this.renderTarget = null;
            this.filters = null;
            this.blend = '';
            this.displayBoundsX = 0;
            this.displayBoundsY = 0;
            this.displayBoundsWidth = 0;
            this.displayBoundsHeight = 0;
            this.offsetX = 0;
            this.offsetY = 0;
        }
    }
    /**
     * FilterSystem
     */
    export class FilterSystem {
        /**
         * FilterState的对象池
         */
        private readonly _statePool: FilterState[] = [];
        /**
        * 执行栈
        */
        private readonly _defaultFilterStack: FilterState[] = [];
        /**
         * 引用记录 WebGLRenderContext
         */
        private readonly _webglRenderContext: WebGLRenderContext;
        /**
         * 引用记录 WebGLRenderer
         */
        public _webglRender: WebGLRenderer;
        /**
         * constructor
         * @param webglRenderContext 
         */
        constructor(webglRenderContext: WebGLRenderContext) {
            this._statePool = [];
            //必须有根
            this._defaultFilterStack.push(new FilterState);
            this._webglRenderContext = webglRenderContext;
        }
        /**
         * 压入执行
         * @param displayObject 
         * @param filters 
         * @param buffer 
         * @param offsetX 
         * @param offsetY 
         */
        public push(displayObject: DisplayObject,
            filters: Array<Filter | CustomFilter>,
            buffer: WebGLRenderBuffer,
            offsetX: number,
            offsetY: number): void {
            //基本检查
            if (filters.length <= 0) {
                //走到这里就是错误
                console.error('FilterSystem:push:filters.length = ' + filters.length);
            }
            //从对象池中创建
            const state = this._statePool.pop() || new FilterState();
            //初始化栈，并压入新的
            const _defaultFilterStack = this._defaultFilterStack;
            if (_defaultFilterStack.length === 1) {
                //压入默认的, 第一个压入的，必是根
                this._defaultFilterStack[0].renderTarget = buffer;
            }
            _defaultFilterStack.push(state);
            //声明一些数据
            const displayBounds = displayObject.$getOriginalBounds();
            const displayBoundsX = displayBounds.x;
            const displayBoundsY = displayBounds.y;
            const displayBoundsWidth = displayBounds.width;
            const displayBoundsHeight = displayBounds.height;
            //开始装配数据, 全部记录下来
            state.displayObject = displayObject;
            state.displayBoundsX = displayBounds.x;
            state.displayBoundsY = displayBounds.y;
            state.displayBoundsWidth = displayBounds.width;
            state.displayBoundsHeight = displayBounds.height;
            state.offsetX = offsetX;
            state.offsetY = offsetY;
            state.renderTarget = WebGLRenderBuffer.create(displayBoundsWidth, displayBoundsHeight);
            state.filters = filters;
            state.blend = blendModes[displayObject.$blendMode] || defaultCompositeOp;
            //重新基于新的目标，做transform
            DisplayObjectTransform.transformObjectAsRoot(displayObject, state.renderTarget.globalMatrix, -displayBoundsX, -displayBoundsY);
            //记录命令，给WebGLRender调用
            const cmd = AdvancedRenderCommand.create(displayObject, state.renderTarget, -displayBoundsX, -displayBoundsY);
            AdvancedRenderCommand.pushCommand(cmd);
            //切换目标
            this._webglRenderContext.pushBuffer(state.renderTarget);
        }
        /**
         * 弹出一个执行
         */
        public pop(): void {
            //弹出操作
            const _defaultFilterStack = this._defaultFilterStack;
            const state = _defaultFilterStack.pop();
            const lastState = _defaultFilterStack[_defaultFilterStack.length - 1];
            const filters = state.filters;
            this._webglRenderContext.popBuffer(state.renderTarget);
            //单一滤镜和滤镜嵌套分开处理
            if (filters.length === 1) {
                const filters0 = filters[0];
                if (filters0 && false) {
                    console.error('FilterSystem pop: Not implemented!');
                }
                else {
                    //引用这个滤镜
                    this.applyFilter(filters[0], state.renderTarget, lastState.renderTarget, false, state);
                    //不要这个renderTarget了，回池子
                    WebGLRenderBuffer.release(state.renderTarget);
                    state.renderTarget = null;
                }
            }
            else {
                //
                const _webglRenderContext = this._webglRenderContext;
                let input = state.renderTarget;
                const filtersLen = filters.length;
                if (filtersLen > 1) {
                    for (let i = 0; i < filtersLen - 1; ++i) {
                        const filter = filters[i];
                        const output = WebGLRenderBuffer.create(state.displayBoundsWidth, state.displayBoundsHeight);
                        _webglRenderContext.__renderToTargetWithFilter__(filter, input, output);
                        WebGLRenderBuffer.release(input);
                        input = output;
                    }
                }
                //应用最后一个滤镜并绘制到当前场景中
                const lastFilter = filters[filtersLen - 1];
                if (lastFilter) {
                    this.applyFilter(lastFilter, input, lastState.renderTarget, false, state);
                    WebGLRenderBuffer.release(input);
                    input = null;
                }
                else {
                    console.error('FilterSystem:pop:filtersLen = ' + filtersLen);
                }
            }
            //清除，回池
            state.clear();
            this._statePool.push(state);
        }
        /**
         * 应用一个滤镜效果到output
         * @param filter 
         * @param input 
         * @param output 
         * @param clear 
         * @param state 
         */
        public applyFilter(filter: Filter, input: WebGLRenderBuffer, output: WebGLRenderBuffer, clear: boolean, state: FilterState): void {
            const _webglRenderContext = this._webglRenderContext;
            //设置混合
            _webglRenderContext.setGlobalCompositeOperation(state.blend);
            //绝对偏移记录
            const bufferOffsetX = output.$offsetX;
            const bufferOffsetY = output.$offsetY;
            output.$offsetX = state.offsetX + state.displayBoundsX;
            output.$offsetY = state.offsetY + state.displayBoundsY;
            //矩阵记录
            const savedMatrix = Matrix.create();
            const globalMatrix = output.globalMatrix;
            savedMatrix.a = globalMatrix.a;
            savedMatrix.b = globalMatrix.b;
            savedMatrix.c = globalMatrix.c;
            savedMatrix.d = globalMatrix.d;
            savedMatrix.tx = globalMatrix.tx;
            savedMatrix.ty = globalMatrix.ty;
            //需要做合并处理，消除绝对偏移
            output.useOffset();
            //开始绘制
            _webglRenderContext.drawTargetWidthFilters([filter], input);
            //矩阵还原回去
            globalMatrix.a = savedMatrix.a;
            globalMatrix.b = savedMatrix.b;
            globalMatrix.c = savedMatrix.c;
            globalMatrix.d = savedMatrix.d;
            globalMatrix.tx = savedMatrix.tx;
            globalMatrix.ty = savedMatrix.ty;
            Matrix.release(savedMatrix);
            //绝对偏移还原回去
            output.$offsetX = bufferOffsetX;
            output.$offsetY = bufferOffsetY;
            //混合还原回去
            _webglRenderContext.setGlobalCompositeOperation(defaultCompositeOp);
        }
    }
}