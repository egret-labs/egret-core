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

module egret {
    /**
     * @language en_US
     * The Sprite class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Sprite 类是基本显示列表构造块：一个可包含子项的显示列表节点。
     * @version Egret 2.0
     * @platform Web,Native
     */
    export class Sprite extends DisplayObjectContainer implements IDisplayObjectContainer {

        /**
         * @language en_US
         * Creates a new Sprite instance.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 实例化一个容器
         * @version Egret 2.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$graphics = new Graphics();
            this.$graphics.$renderContext.$targetDisplay = this;
            this.$renderRegion = new sys.Region();
        }

        /**
         * @private
         */
        $graphics:Graphics;

        /**
         * @language en_US
         * Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取 Shape 中的 Graphics 对象。可通过此对象执行矢量绘图命令。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public get graphics():Graphics {
            return this.$graphics;
        }

        $hitTest(stageX:number, stageY:number):DisplayObject {
            var target = super.$hitTest(stageX, stageY);
            if (target) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            this.$graphics.$measureContentBounds(bounds);
        }

        /**
         * @private
         */
        $render(context:sys.RenderContext):void {
            this.$graphics.$render(context);
        }
    }

    registerClass(Sprite, Types.Sprite, [Types.DisplayObjectContainer]);
}