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

module ns_egret {
    export interface ISkinConfig{
        /**
         * 添加一个项目内的自定义组件,若要添加的组件已经存在，则覆盖原始组件。
         * @param className 组件完整类名
         * @param superClass 父级完整类名
         */
        addComponent(className:string,superClass:string):Component;

        /**
         * 移除一个项目内的自定义组件
         * @param className 组件完整类名
         */
        removeComponent(className:string):Component;

        /**
         * 是否含有某个组件
         * @param className 组件完整类名
         */
        hasComponent(className:string):boolean;
        /**
         * 检查指定的类名是否存在于配置中，若不存在则执行相应的处理。
         * @param className 要检查的类名
         */
        checkComponent(className:string):void;

        /**
         * 根据类的短名ID和命名空间获取完整类名(以"."分隔)
         * @param id 类的短名ID
         * @param ns 命名空间
         */
        getClassNameById(id:string,ns:Namespace):string;

        /**
         * 根据ID获取对应的默认属性
         * @param id 类的短名ID
         * @param ns 命名空间
         * @return {name:属性名(String),isArray:该属性是否为数组(Boolean)}
         */
        getDefaultPropById(id:string,ns:Namespace):any;

        /**
         * 获取指定属性的类型,返回基本数据类型："uint","int","Boolean","String","Number","Class"。
         * @param prop 属性名
         * @param className 要查询的完整类名
         * @param value 属性值
         */
        getPropertyType(prop:string,className:string,value:string):string;
    }
}