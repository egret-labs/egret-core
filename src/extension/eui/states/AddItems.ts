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

    /**
     * @private
     */
    export const enum AddPosition {
        /**
         * @private
         * 添加父级容器的底层
         */
        FIRST,
        /**
         * @private
         * 添加在父级容器的顶层
         */
        LAST,
        /**
         * @private
         * 添加在相对对象之前
         */
        BEFORE,
        /**
         * @private
         * 添加在相对对象之后
         */
        AFTER
    }
}

module eui {

    /**
     * @language en_US
     * The operation of adding a state to view.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 视图添加状态显示元素操作
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class AddItems implements IOverride {
        /**
         * @language en_US
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个AddItems实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(target:string, propertyName:string, position:number, relativeTo:string) {
            this.target = target;
            this.propertyName = propertyName;
            this.position = position;
            this.relativeTo = relativeTo;
        }

        /**
         * @language en_US
         * The name of the property that is being added.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要添加到的属性
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public propertyName:string;

        /**
         * @language en_US
         * The position to be added. Valid values: "first","last","before","after"
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 添加的位置，有效值为: "first","last","before","after"
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public position:number;

        /**
         * @language en_US
         * an instance name of relative visual element.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 相对的显示元素的实例名
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public relativeTo:string;

        /**
         * @language en_US
         * The target instance name.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 目标实例名
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public target:string;

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public apply(host:any, parent:egret.DisplayObjectContainer):void {
            var index:number;
            var relative:egret.DisplayObject = host[this.relativeTo];
            var target:egret.DisplayObject = host[this.target];
            var container:egret.DisplayObjectContainer = this.propertyName ? host[this.propertyName] : parent;
            if (!target || !container)
                return;
            switch (this.position) {
                case sys.AddPosition.FIRST:
                    index = 0;
                    break;
                case sys.AddPosition.LAST:
                    index = -1;
                    break;
                case sys.AddPosition.BEFORE:
                    index = container.getChildIndex(relative);
                    break;
                case sys.AddPosition.AFTER:
                    index = container.getChildIndex(relative) + 1;
                    break;
            }
            if (index == -1){
                index = container.numChildren;
            }
            if (egret.is(container, "eui.Component")) {
                (<Skin>(<Component>container).$Component[sys.ComponentKeys.skin]).$elementsContent.push(target);
            }
            container.addChildAt(target, index);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public remove(host:any,parent:egret.DisplayObjectContainer):void {
            var container:egret.DisplayObjectContainer = this.propertyName ? host[this.propertyName] : parent;
            var target:egret.DisplayObject = host[this.target];
            if (!target || !container)
                return;
            if (target.$parent === container) {
                container.removeChild(target);
            }
            if (egret.is(container, "eui.Component")) {
                var arr = (<Skin>(<Component>container).$Component[sys.ComponentKeys.skin]).$elementsContent;
                var idx = arr.indexOf(target);
                if (idx > -1) {
                    arr.splice(idx, 1);
                }
            }
        }
    }

}

