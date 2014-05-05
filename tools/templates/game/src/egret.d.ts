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
declare module ns_egret {
    /**
    * IHashObject是哈希对象接口。引擎内所有接口的基类,为对象实例提供唯一的hashCode值,提高对象比较的性能。
    * 注意：自定义对象请直接继承HashObject，而不是实现此接口。否则会导致hashCode不唯一。
    * @interface
    * @class ns_egret.IHashObject
    */
    interface IHashObject {
        /**
        * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
        * @member {number} ns_egret.IHashObject#hashCode
        */
        hashCode: number;
    }
}
declare module ns_egret {
    class HashObject implements IHashObject {
        /**
        * @class ns_egret.HashObject
        * @classdesc 哈希对象。引擎内所有对象的基类，为对象实例提供唯一的hashCode值,提高对象比较的性能。
        */
        constructor();
        /**
        * 哈希计数
        */
        private static hashCount;
        private _hashCode;
        /**
        * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
        * @member {number} ns_egret.HashObject#hashCode
        */
        public hashCode : number;
    }
}
declare module ns_egret {
    class DeviceContext extends HashObject {
        constructor();
        public executeMainLoop(callback: Function, thisObject: any): void;
    }
}
declare module ns_egret {
    class NetContext extends HashObject {
        static STATE_COMPLETE: string;
        static GET: string;
        static POST: string;
        constructor();
        static getInstance(): NetContext;
        public send(request: URLRequest): void;
    }
    class URLRequest {
        public url: string;
        public callback: any;
        public thisObj: any;
        public method: string;
        public data: any;
        public type: string;
        public prefix: string;
        constructor(url: string, callback: any, thisObj: any, method?: string, data?: any);
    }
}
declare module ns_egret {
    class Event extends HashObject {
        /**
        * @class ns_egret.Event
        * @classdesc
        * Event 类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。
        *
        * Event 类的属性包含有关事件的基本信息，例如事件的类型或者是否可以取消事件的默认行为。
        *
        * 对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。但其他事件可能需要更详细的信息。
        * 例如，与触摸关联的事件需要包括有关触摸事件的位置以及在触摸事件期间是否按下了任何键的其他信息。
        * 您可以通过扩展 Event 类（TouchEvent 类执行的操作）将此类其他信息传递给事件侦听器。
        * Egret API 为需要其他信息的常见事件定义多个 Event 子类。与每个 Event 子类关联的事件将在每个类的文档中加以介绍。
        *
        * Event 类的方法可以在事件侦听器函数中使用以影响事件对象的行为。
        * 某些事件有关联的默认行为，通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
        * 可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
        * @param {string} type 事件的类型，可以作为 Event.type 访问。
        * @param bubbles{boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
        * @param cancelable{boolean} 确定是否可以取消 Event 对象。默认值为 false。
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
        * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
        * 以下方法会触发此事件：DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
        * @constant {string} ns_egret.Event.ADDED_TO_STAGE
        */
        static ADDED_TO_STAGE: string;
        /**
        * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
        * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
        * @constant {string} ns_egret.Event.REMOVED_FROM_STAGE
        */
        static REMOVED_FROM_STAGE: string;
        /**
        * 将显示对象添加到显示列表中时调度。以下方法会触发此事件：
        * DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
        * @constant {string} ns_egret.Event.ADDED
        */
        static ADDED: string;
        /**
        * 将要从显示列表中删除显示对象时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
        * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
        * @constant {string} ns_egret.Event.REMOVED
        */
        static REMOVED: string;
        /**
        * 完成
        * @constant {string} ns_egret.Event.COMPLETE
        */
        static COMPLETE: string;
        /**
        * 主循环：进入新的一帧
        * @constant {string} ns_egret.Event.ENTER_FRAME
        */
        static ENTER_FRAME: string;
        /**
        * 主循环：开始渲染
        * @constant {string} ns_egret.Event.RENDER
        */
        static RENDER: string;
        /**
        * 主循环：渲染完毕
        * @constant {string} ns_egret.Event.FINISH_RENDER
        */
        static FINISH_RENDER: string;
        /**
        * 主循环：updateTransform完毕
        * @constant {string} ns_egret.Event.FINISH_UPDATE_TRANSFORM
        */
        static FINISH_UPDATE_TRANSFORM: string;
        /**
        * 离开舞台，参考Flash的Event.MOUSE_LEAVE
        * @constant {string} ns_egret.Event.LEAVE_STAGE
        */
        static LEAVE_STAGE: string;
        /**
        * 舞台尺寸发生改变
        * @constant {string} ns_egret.Event.RESIZE
        */
        static RESIZE: string;
        /**
        * 状态改变
        * @constant {string} ns_egret.Event.CHANGE
        */
        static CHANGE: string;
        public data: any;
        public _type: string;
        /**
        * 事件的类型。类型区分大小写。
        * @member {string} ns_egret.Event#type
        */
        public type : string;
        public _bubbles: boolean;
        /**
        * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
        * @member {boolean} ns_egret.Event#bubbles
        */
        public bubbles : boolean;
        private _cancelable;
        /**
        * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
        * @member {boolean} ns_egret.Event#cancelable
        */
        public cancelable : boolean;
        public _eventPhase: number;
        /**
        * 事件流中的当前阶段。此属性可以包含以下数值：
        * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
        * 目标阶段 (EventPhase.AT_TARGET)。
        * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
        * @member {boolean} ns_egret.Event#eventPhase
        */
        public eventPhase : number;
        private _currentTarget;
        /**
        * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
        * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
        * @member {any} ns_egret.Event#currentTarget
        */
        public currentTarget : any;
        public _setCurrentTarget(target: any): void;
        public _target: any;
        /**
        * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
        * @member {any} ns_egret.Event#target
        */
        public target : any;
        private _isDefaultPrevented;
        /**
        * 检查是否已对事件调用 preventDefault() 方法。
        * @method ns_egret.Event#isDefaultPrevented
        * @returns {boolean} 如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
        */
        public isDefaultPrevented(): boolean;
        /**
        * 如果可以取消事件的默认行为，则取消该行为。
        * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
        * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
        * 注意：当cancelable属性为false时，此方法不可用。
        * @method ns_egret.Event#preventDefault
        */
        public preventDefault(): void;
        public _isPropagationStopped: boolean;
        /**
        * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 (currentTarget) 中的任何事件侦听器。
        * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
        * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。
        * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
        * @method ns_egret.Event#stopPropagation
        */
        public stopPropagation(): void;
        public _isPropagationImmediateStopped: boolean;
        /**
        * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
        * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。
        * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
        * @method ns_egret.Event#stopImmediatePropagation
        */
        public stopImmediatePropagation(): void;
        private isNew;
        public _reset(): void;
    }
}
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
declare module ns_egret {
    /**
    * Logger是引擎的日志处理模块入口
    * @stable B 目前Logger的接口设计没有问题，但是考虑到跨平台，需要将其改为一个Context，并且允许开发者自由扩展以实现自身游戏的日志分析收集需求
    * todo:GitHub文档，如何利用日志帮助游戏持续改进
    */
    class Logger {
        /**
        * 表示出现了致命错误，开发者必须修复错误
        * @param actionCode
        * @param value
        */
        static fatal(actionCode: string, value?: Object): void;
        /**
        * 记录正常的Log信息
        * @param actionCode
        * @param value
        */
        static info(actionCode: string, value?: Object): void;
        /**
        * 记录可能会出现问题的Log信息
        * @param actionCode
        * @param value
        */
        static warning(actionCode: string, value?: Object): void;
        /**
        * @private
        * @param type
        * @param actionCode
        * @param value
        */
        private static traceToConsole(type, actionCode, value);
        /**
        * @private
        * @param type
        * @param actionCode
        * @param value
        * @returns {string}
        */
        private static getTraceCode(type, actionCode, value);
    }
}
declare module ns_egret {
    /**
    * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
    */
    class Point extends HashObject {
        static identity: Point;
        constructor(x?: number, y?: number);
        /**
        * 该点的水平坐标。默认值为 0。
        */
        public x: number;
        /**
        * 该点的垂直坐标。默认值为 0。
        */
        public y: number;
    }
}
declare module ns_egret {
    /**
    * 2D矩阵类，包括常见矩阵算法
    */
    class Matrix extends HashObject {
        public a: number;
        public b: number;
        public c: number;
        public d: number;
        public tx: number;
        public ty: number;
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        static identity: Matrix;
        static DEG_TO_RAD: number;
        /**
        * 前置矩阵
        * @param a
        * @param b
        * @param c
        * @param d
        * @param tx
        * @param ty
        * @returns {ns_egret.Matrix}
        */
        public prepend(a: any, b: any, c: any, d: any, tx: any, ty: any): Matrix;
        /**
        * 后置矩阵
        * @param a
        * @param b
        * @param c
        * @param d
        * @param tx
        * @param ty
        * @returns {ns_egret.Matrix}
        */
        public append(a: any, b: any, c: any, d: any, tx: any, ty: any): Matrix;
        /**
        * 前置矩阵
        * @param matrix
        * @returns {ns_egret.Matrix}
        */
        public prependMatrix(matrix: any): Matrix;
        /**
        * 后置矩阵
        * @param matrix
        * @returns {ns_egret.Matrix}
        */
        public appendMatrix(matrix: any): Matrix;
        /**
        * 前置矩阵
        * @param matrix
        * @returns {ns_egret.Matrix}
        */
        public prependTransform(x: any, y: any, scaleX: any, scaleY: any, rotation: any, skewX: any, skewY: any, regX: any, regY: any): Matrix;
        /**
        * 后置矩阵
        * @param matrix
        * @returns {ns_egret.Matrix}
        */
        public appendTransform(x: any, y: any, scaleX: any, scaleY: any, rotation: any, skewX: any, skewY: any, regX: any, regY: any): Matrix;
        public appendTransformFromDisplay(target: DisplayObject): Matrix;
        /**
        * 矩阵旋转，以角度制为单位
        * @param angle
        * @returns {ns_egret.Matrix}
        */
        public rotate(angle: any): Matrix;
        /**
        * 矩阵斜切，以角度值为单位
        * @param skewX
        * @param skewY
        * @returns {ns_egret.Matrix}
        */
        public skew(skewX: any, skewY: any): Matrix;
        /**
        * 矩阵缩放
        * @param x
        * @param y
        * @returns {ns_egret.Matrix}
        */
        public scale(x: any, y: any): Matrix;
        /**
        * 矩阵唯一
        * @param x
        * @param y
        * @returns {ns_egret.Matrix}
        */
        public translate(x: any, y: any): Matrix;
        /**
        * 矩阵重置
        * @returns {ns_egret.Matrix}
        */
        public identity(): Matrix;
        /**
        * 矩阵翻转
        */
        public invert: () => any;
        public isIdentity(): boolean;
        public transformPoint(x: any, y: any, pt: any): any;
        public decompose(target: any): any;
        /**
        * 根据一个矩阵，返回某个点在该矩阵上的坐标
        * @param matrix
        * @param x
        * @param y
        * @returns {Point}
        * @stable C 该方法以后可能删除
        */
        static transformCoords(matrix: Matrix, x: number, y: number): Point;
    }
}
declare module ns_egret {
    /**
    * 矩形类
    */
    class Rectangle extends HashObject {
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
        * 矩形x坐标
        */
        public x: number;
        /**
        * 矩形y坐标
        */
        public y: number;
        /**
        * 矩形宽度
        */
        public width: number;
        /**
        * 矩形高度
        */
        public height: number;
        /**
        * x和width的和
        */
        public right : number;
        /**
        * y和height的和
        */
        public bottom : number;
        /**
        * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
        * @param x
        * @param y
        * @param width
        * @param height
        * @returns {ns_egret.Rectangle}
        */
        public initialize(x: number, y: number, width: number, height: number): Rectangle;
        /**
        * 判断某坐标点是否存在于矩形内
        * @param x
        * @param y
        * @returns {boolean}
        */
        public contains(x: number, y: number): boolean;
        /**
        * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
        * @param toIntersect 要与此 Rectangle 对象比较的 Rectangle 对象。
        */
        public intersects(toIntersect: Rectangle): boolean;
        /**
        * 克隆矩形对象
        * @returns {ns_egret.Rectangle}
        * @stable C 倾向于废除此API，方式开发者滥用，降低游戏性能
        */
        public clone(): Rectangle;
        /**
        * 引擎内部用于函数传递返回值的全局矩形对象，开发者请勿随意修改此对象
        */
        static identity: Rectangle;
    }
}
declare module ns_egret {
    class HTML5CanvasRenderer extends RendererContext {
        private canvas;
        public canvasContext: any;
        private _matrixA;
        private _matrixB;
        private _matrixC;
        private _matrixD;
        private _matrixTx;
        private _matrixTy;
        public _transformTx: number;
        public _transformTy: number;
        constructor(canvas: any);
        public clearScreen(): void;
        public clearRect(x: number, y: number, w: number, h: number): void;
        public drawImage(texture: Texture, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any): void;
        public setTransform(matrix: Matrix): void;
        public save(): void;
        public restore(): void;
        public setAlpha(alpha: number, blendMode: BlendMode): void;
        public setupFont(font: string, textAlign: string, textBaseline: string): void;
        public measureText(text: any): number;
        public drawText(textField: TextField, text: string, x: number, y: number, maxWidth: number): void;
        public clip(x: any, y: any, w: any, h: any): void;
        public strokeRect(x: any, y: any, w: any, h: any, color: any): void;
    }
}
declare module ns_egret {
    /**
    * DisplayObjectContainer 类是显示列表中显示对象容器。
    */
    class DisplayObjectContainer extends DisplayObject {
        constructor();
        public _touchChildren: boolean;
        /**
        * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
        */
        public touchChildren : boolean;
        public _children: DisplayObject[];
        public numChildren : number;
        /**
        * 修改 容器内子元件的 层级
        * @param child 容器的子元件
        * @param index 新的层级 <0或者>=元件数量，都加入到最上层
        */
        public setChildIndex(child: DisplayObject, index: number): void;
        private doSetChildIndex(child, index);
        /**
        * @inheritDoc
        */
        public addChild(child: DisplayObject): DisplayObject;
        /**
        * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。
        * todo:GitHub 显示列表
        * @param child 子显示对象
        * @param index 加载的顺序，默认为-1，加载到最前面
        */
        public addChildAt(child: DisplayObject, index: number): DisplayObject;
        private childAdded(child, index);
        /**
        * 将一个 DisplayObject 子实例从 DisplayObjectContainer 实例中移除。
        * @param child
        */
        public removeChild(child: DisplayObject): DisplayObject;
        public removeChildAt(index: number): DisplayObject;
        private childRemoved(index);
        /**
        * 通过索引获取显示对象
        * @param index
        * @returns {*}
        */
        public getChildAt(index: number): DisplayObject;
        /**
        *  确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。孙项、曾孙项等，每项都返回 true。
        * @param child 要测试的子对象。
        */
        public contains(child: DisplayObject): boolean;
        /**
        * 根据子对象的name属性获取对象
        * @param name
        * @returns {null}
        */
        public getChildByName(name: string): DisplayObject;
        public swapChildrenAt(index1: number, index2: number): void;
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        private _swapChildrenAt(index1, index2);
        /**
        * 获得 容器内元件的层级
        * @param child
        * @returns -1不在容器内 >=0 在容器里
        */
        public getChildIndex(child: DisplayObject): number;
        /**
        * 移除所有显示对象
        */
        public removeChildren(): void;
        public updateTransform(): void;
        public render(renderContext: RendererContext): void;
        /**
        * @see egret.DisplayObject._measureBounds
        * @returns {null}
        * @private
        */
        public _measureBounds(): Rectangle;
        /**
        * @see egret.DisplayObject.hitTest
        * @param x
        * @param y
        * @returns {DisplayObject}
        */
        public hitTest(x: any, y: any): DisplayObject;
        public _onAddToStage(): void;
        public _onRemoveFromStage(): void;
    }
}
declare module ns_egret {
    /**
    * @class Texture
    * 纹理类是对不同平台不同的图片资源的封装
    * 在HTML5中，资源是一个HTMLElement对象
    * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
    * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
    */
    class Texture extends HashObject {
        public offsetX: number;
        public offsetY: number;
        private _path;
        public _textureWidth: number;
        public _textureHeight: number;
        public _bitmapData: any;
        public bitmapData : any;
        public getTextureWidth(): number;
        public getTextureHeight(): number;
        static create(path: string): Texture;
        static createWithBase64(base64: string): Texture;
    }
    class RenderTexture extends Texture {
        private cacheCanvas;
        constructor();
        public drawToTexture(displayObject: DisplayObject): void;
    }
}
declare module ns_egret {
    class RenderFilter extends HashObject {
        /**
        * @class ns_egret.RenderFilter
        */
        constructor();
        private static instance;
        static getInstance(): RenderFilter;
        public _drawAreaList: Rectangle[];
        private _defaultDrawAreaList;
        private _originalData;
        public addDrawArea(area: Rectangle): void;
        public clearDrawArea(): void;
        /**
        * 先检查有没有不需要绘制的区域，再把需要绘制的区域绘制出来
        */
        public drawImage(renderContext: any, data: RenderData, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any): void;
        private ignoreRender(data, rect, destX, destY);
        public getDrawAreaList(): Rectangle[];
    }
    interface RenderData {
        worldTransform: Matrix;
        worldBounds: Rectangle;
        _texture_to_render: Texture;
    }
}
declare module ns_egret {
    class Stage extends DisplayObjectContainer {
        static _invalidateRenderFlag: boolean;
        /**
        * 调用 invalidate() 方法后，在显示列表下次呈现时，Egret 会向每个已注册侦听 render 事件的显示对象发送一个 render 事件。
        * 每次您希望 Egret 发送 render 事件时，都必须调用 invalidate() 方法。
        */
        public invalidate(): void;
        constructor(width: number, height: number);
        /**
        * 设置舞台宽高
        */
        public _setStageSize(width: number, height: number): void;
        private _stageWidth;
        /**
        * 舞台宽度（坐标系宽度，非设备宽度）
        */
        public stageWidth : number;
        private _stageHeight;
        /**
        * 舞台高度（坐标系高度，非设备高度）
        */
        public stageHeight : number;
        /**
        * @see egret.DisplayObject.hitTest
        * @param x
        * @param y
        * @returns {DisplayObject}
        */
        public hitTest(x: any, y: any): DisplayObject;
        /**
        * @see egret.DisplayObject.getBounds
        * @returns {Rectangle}
        */
        public getBounds(): Rectangle;
        public updateTransform(): void;
    }
}
declare module ns_egret {
    /**
    * @class IEventDispatcher
    * IEventDispatcher是egret的事件派发器接口，负责进行事件的发送和侦听。
    * @stable A
    */
    interface IEventDispatcher extends IHashObject {
        /**
        * 添加事件侦听器
        * @param type 事件的类型。
        * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
        * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
        * @param thisObject 侦听函数绑定的this对象
        * @param useCapture 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
        * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
        * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
        * @param  priority 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
        * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
        * @stable A
        */
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
        * 移除事件侦听器
        * @param type 事件名
        * @param listener 侦听函数
        * @param thisObject 侦听函数绑定的this对象
        * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
        * @stable A
        */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
        * 检测是否存在监听器
        * @param type 事件名
        * @returns {*}
        * @stable A
        */
        hasEventListener(type: string): boolean;
        /**
        * 派发事件
        * @param type 事件名
        * @param arg 数据对象
        * @returns {*}
        */
        dispatchEvent(event: Event): boolean;
        /**
        * 检查是否用此 EventDispatcher 对象或其任何始祖为指定事件类型注册了事件侦听器。将指定类型的事件调度给此
        * EventDispatcher 对象或其任一后代时，如果在事件流的任何阶段触发了事件侦听器，则此方法返回 true。
        * hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，
        * 而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。
        * @param type 事件名
        */
        willTrigger(type: string): boolean;
    }
}
declare module ns_egret {
    /**
    * 对象缓存复用工具类，可用于构建对象池，一段时间后会自动回收对象。
    */
    class Recycler extends HashObject {
        constructor(autoDisposeTime?: number);
        static _callBackList: any[];
        /**
        * 多少帧后自动销毁对象。
        */
        private autoDisposeTime;
        private frameCount;
        public _checkFrame(): void;
        private objectPool;
        private _length;
        /**
        * 缓存的对象数量
        */
        public length : number;
        /**
        * 缓存一个对象以复用
        * @param object
        */
        public push(object: any): void;
        /**
        * 获取一个缓存的对象
        */
        public pop(): any;
        /**
        * 立即清空所有缓存的对象。
        */
        public dispose(): void;
    }
}
declare module ns_egret {
    /**
    * @class EventDispatcher
    * EventDispatcher是egret的事件派发器类，负责进行事件的发送和侦听。
    * @stable A
    */
    class EventDispatcher extends HashObject implements IEventDispatcher {
        /**
        * EventDispatcher 类是可调度事件的所有类的基类。EventDispatcher 类实现 IEventDispatcher 接口
        * ，并且是 DisplayObject 类的基类。EventDispatcher 类允许显示列表上的任何对象都是一个事件目标，
        * 同样允许使用 IEventDispatcher 接口的方法。
        */
        constructor(target?: IEventDispatcher);
        /**
        * 事件抛出对象
        */
        private _eventTarget;
        /**
        * 引擎内部调用
        * @private
        */
        public _eventsMap: Object;
        /**
        * 引擎内部调用
        * @private
        */
        public _captureEventsMap: Object;
        /**
        * 引擎内部调用
        * @private
        */
        public _isUseCapture: boolean;
        /**
        * 添加事件侦听器
        * @param type 事件的类型。
        * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
        * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
        * @param thisObject 侦听函数绑定的this对象
        * @param useCapture 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
        * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
        * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
        * @param  priority 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
        * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
        * @stable A
        * todo:GitHub文档
        */
        public addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
        * 在一个事件列表中按优先级插入事件对象
        */
        public _insertEventBin(list: any[], listener: Function, thisObject: any, priority: number): boolean;
        /**
        * 移除事件侦听器
        * @param type 事件名
        * @param listener 侦听函数
        * @param thisObject 侦听函数绑定的this对象
        * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
        * @stable A
        */
        public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
        * 在一个事件列表中按优先级插入事件对象
        */
        public _removeEventBin(list: any[], listener: Function, thisObject: any): boolean;
        /**
        * 检测是否存在监听器
        * @param type 事件名
        * @returns {*}
        * @stable A
        */
        public hasEventListener(type: string): boolean;
        /**
        * 检查是否用此 EventDispatcher 对象或其任何始祖为指定事件类型注册了事件侦听器。将指定类型的事件调度给此
        * EventDispatcher 对象或其任一后代时，如果在事件流的任何阶段触发了事件侦听器，则此方法返回 true。
        * hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，
        * 而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。
        * @param type 事件名
        */
        public willTrigger(type: string): boolean;
        /**
        * 将事件分派到事件流中。事件目标是对其调用 dispatchEvent() 方法的 EventDispatcher 对象。
        * @param event 调度到事件流中的 Event 对象。如果正在重新分派事件，则会自动创建此事件的一个克隆。 在调度了事件后，其 _eventTarget 属性将无法更改，因此您必须创建此事件的一个新副本以能够重新调度。
        * @return 如果成功调度了事件，则值为 true。值 false 表示失败或对事件调用了 preventDefault()。
        */
        public dispatchEvent(event: Event): boolean;
        public _notifyListener(event: Event): boolean;
        private static eventRecycler;
        /**
        * 派发一个包含了特定参数的事件到所有注册了特定类型侦听器的对象中。 这个方法使用了一个内部的事件对象池因避免重复的分配导致的额外开销。
        * @param type 事件类型
        * @param bubbles 是否冒泡，默认false
        * @param data 附加数据(可选)
        */
        public dispatchEventWith(type: string, bubbles?: boolean, data?: Object): void;
    }
}
declare module ns_egret {
    class NumberUtils {
        static isNumber(value: any): Boolean;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DisplayObject
    * @classdesc 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。
    *
    * DisplayObjectContainer 对象可以有子显示对象，而其他显示对象是“叶”节点，只有父级和同级，没有子级。
    *
    * DisplayObject 类支持基本功能（如对象的 x 和 y 位置），也支持更高级的对象属性（如它的转换矩阵），所有显示对象都继承自 DisplayObject 类。
    *
    * DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。
    *
    * 若只有一个目标，则会将事件侦听器限制为只能放置到该目标上（在某些情况下，可放置到显示列表中该目标的祖代上），这意味着您可以向任何 DisplayObject 实例添加侦听器来侦听广播事件。
    *
    * 任何继承自DisplayObject的类都必须实现以下方法
    * render();
    * _measureBounds()
    * 不允许重写以下方法
    * draw();
    * getBounds();
    */
    class DisplayObject extends EventDispatcher implements RenderData {
        constructor();
        public name: string;
        public _texture_to_render: Texture;
        private _parent;
        private _cacheAsBitmap;
        /**
        * 表示包含此显示对象的 DisplayObjectContainer 对象
        * @member {ns_egret.DisplayObjectContainer} ns_egret.DisplayObject#parent
        */
        public parent : DisplayObjectContainer;
        /**
        * 仅供框架内部调用。
        */
        public _parentChanged(parent: DisplayObjectContainer): void;
        public _x: number;
        /**
        * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
        * @member {number} ns_egret.DisplayObject#x
        */
        public x : number;
        public _y: number;
        /**
        * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
        * @member {number} ns_egret.DisplayObject#y
        */
        public y : number;
        /**
        * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
        * @member {number} ns_egret.DisplayObject#scaleX
        * @default 1
        */
        public _scaleX: number;
        public scaleX : number;
        /**
        * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
        * @member {number} ns_egret.DisplayObject#scaleY
        * @default 1
        */
        public _scaleY: number;
        public scaleY : number;
        /**
        * 表示从对象绝对锚点X。
        * @member {number} ns_egret.DisplayObject#anchorPointX
        * @default 0
        */
        private _anchorOffsetX;
        /**
        * @deprecated
        */
        /**
        * @deprecated
        */
        public anchorPointX : number;
        public anchorOffsetX : number;
        /**
        * 表示从对象绝对锚点Y。
        * @member {number} ns_egret.DisplayObject#anchorPointY
        * @default 0
        */
        private _anchorOffsetY;
        /**
        * @deprecated
        */
        /**
        * @deprecated
        */
        public anchorPointY : number;
        public anchorOffsetY : number;
        /**
        * 表示从对象相对锚点X。
        * @member {number} ns_egret.DisplayObject#anchorX
        * @default 0
        */
        private _anchorX;
        /**
        * @deprecated
        */
        /**
        * @deprecated
        */
        public relativeAnchorPointX : number;
        public anchorX : number;
        /**
        * 表示从对象相对锚点Y。
        * @member {number} ns_egret.DisplayObject#anchorY
        * @default 0
        */
        private _anchorY;
        /**
        * @deprecated
        */
        /**
        * @deprecated
        */
        public relativeAnchorPointY : number;
        public anchorY : number;
        /**
        * 显示对象是否可见。
        * @member {boolean} ns_egret.DisplayObject#x
        */
        public visible: boolean;
        /**
        * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位
        * @member {number} ns_egret.DisplayObject#rotation
        * @default 0
        */
        private _rotation;
        public rotation : number;
        /**
        * 表示指定对象的 Alpha 透明度值
        * @member {number} ns_egret.DisplayObject#alpha
        *  @default 1
        */
        public _alpha: number;
        public alpha : number;
        /**
        * 表示DisplayObject的x方向斜切
        * @member {number} ns_egret.DisplayObject#skewX
        * @default 0
        */
        private _skewX;
        public skewX : number;
        /**
        * 表示DisplayObject的y方向斜切
        * @member {number} ns_egret.DisplayObject#skewY
        * @default 0
        */
        private _skewY;
        public skewY : number;
        public _touchEnabled: boolean;
        /**
        * 指定此对象是否接收鼠标/触摸事件
        * @member {boolean} ns_egret.DisplayObject#touchEnabled
        * @default true
        */
        public touchEnabled : boolean;
        public blendMode: BlendMode;
        public _scrollRect: Rectangle;
        /**
        * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
        */
        public scrollRect : Rectangle;
        /**
        * 测量宽度
        * @returns {number}
        */
        public measuredWidth : number;
        /**
        * 测量高度
        * @returns {number}
        */
        public measuredHeight : number;
        public _explicitWidth: number;
        /**
        * 显式设置宽度
        * @returns {number}
        */
        public explicitWidth : number;
        public _explicitHeight: number;
        /**
        * 显式设置高度
        * @returns {number}
        */
        public explicitHeight : number;
        /**
        * 宽度，优先顺序为 显式设置宽度 > 测量宽度
        * @returns {number}
        */
        /**
        * 显式设置宽度
        * @param value
        */
        public width : number;
        /**
        * 高度，优先顺序为 显式设置高度 > 测量高度
        * @returns {number}
        */
        /**
        * 显式设置高度
        * @param value
        */
        public height : number;
        /**
        * 调用显示对象被指定的 mask 对象遮罩
        */
        public mask: Rectangle;
        public worldTransform: Matrix;
        public worldBounds: Rectangle;
        public worldAlpha: number;
        /**
        * @private
        * @param renderContext
        */
        public draw(renderContext: RendererContext): void;
        private drawCacheTexture(renderContext);
        /**
        * @private
        * @param renderContext
        */
        public updateTransform(): void;
        /**
        * @private
        * @param renderContext
        */
        public render(renderContext: RendererContext): void;
        /**
        * 获取显示对象的测量边界
        * @returns {Rectangle}
        */
        public getBounds(): Rectangle;
        /**
        * @private
        * @returns {Matrix}
        */
        private static identityMatrixForGetConcatenated;
        public getConcatenatedMatrix(): Matrix;
        /**
        * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
        * @returns {ns_egret.Point}
        */
        public localToGlobal(x?: number, y?: number): Point;
        /**
        * 将 point 对象从舞台（全局坐标转换为显示对象（本地）坐标。
        * @returns {ns_egret.Point}
        */
        public globalToLocal(x?: number, y?: number): Point;
        /**
        * 检测指定坐标是否在显示对象内
        * @param x
        * @param y
        * @param ignoreTouchEnabled 是否忽略TouchEnabled
        * @returns {*}
        */
        public hitTest(x: any, y: any, ignoreTouchEnabled?: boolean): DisplayObject;
        public getMatrix(): Matrix;
        /**
        * 测量显示对象坐标，这个方法需要子类重写
        * @returns {ns_egret.Rectangle}
        * @private
        */
        public _measureBounds(): Rectangle;
        public getOffsetPoint(): Point;
        public _onAddToStage(): void;
        public _onRemoveFromStage(): void;
        public _stage: Stage;
        public stage : Stage;
        static _enterFrameCallBackList: any[];
        static _renderCallBackList: any[];
        public addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        public dispatchEvent(event: Event): boolean;
        public willTrigger(type: string): boolean;
        public cacheAsBitmap(bool: boolean): void;
        static getTransformBounds(bounds: Rectangle, mtx: Matrix): Rectangle;
    }
}
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
declare module ns_egret {
    /**
    * 转换数字为颜色字符串
    */
    function toColorString(value: number): string;
}
declare module ns_egret {
    /**
    * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
    * 如果开发者希望所有平台完全无差异，请使用BitmapText
    * @todo GitHub 为什么文本渲染存在差异以及如何规避
    */
    class TextField extends DisplayObject {
        /**
        * 显示文本
        */
        public text: string;
        /**
        * 字体
        */
        public fontFamily: string;
        /**
        * 字号
        */
        public size: number;
        public _textColorString: string;
        private _textColor;
        /**
        * 文字颜色
        */
        public textColor : number;
        public _strokeColorString: string;
        private _strokeColor;
        /**
        * 描边颜色
        */
        public strokeColor : number;
        /**
        * 描边宽度，0为没有描边
        */
        public stroke: number;
        /**
        * 文本水平对齐方式,使用HorizontalAlign定义的常量，默认值HorizontalAlign.LEFT。
        * @stable B API名称可能修改
        */
        public textAlign: string;
        /**
        * 文本垂直对齐方式,使用VerticalAlign定义的常量，默认值VerticalAlign.TOP。
        * @stable B API名称可能修改
        */
        public verticalAlign: string;
        /**
        * 文本基准线
        * @stable B 可能移除，用户不需要设置这个属性。
        */
        public textBaseline: any;
        public maxWidth: any;
        /**
        * 行间距
        */
        public lineSpacing: number;
        /**
        * 字符间距
        */
        public letterSpacing: number;
        private _numLines;
        /**
        * 文本行数
        */
        public numLines : number;
        private __hackIgnoreDrawText;
        constructor();
        /**
        * @see egret.DisplayObject.render
        * @param renderContext
        */
        public render(renderContext: RendererContext): void;
        /**
        * 测量显示对象坐标与大小
        */
        public _measureBounds(): Rectangle;
        /**
        * @private
        * @param renderContext
        * @returns {Rectangle}
        */
        private drawText(renderContext, forMeasureContentSize?);
        /**
        * 渲染单行文字
        * @private
        * @param renderContext
        * @param text
        * @param y
        * @private
        */
        public _drawTextLine(renderContext: RendererContext, text: any, y: any, maxWidth: any): void;
    }
}
declare module ns_egret {
    /**
    * Profiler是egret的性能检测分析类
    * @todo GitHub文档，如何使用Profiler
    */
    class Profiler {
        private static instance;
        static getInstance(): Profiler;
        private _lastTime;
        private _lastFrameTime;
        private _logicPerformanceCost;
        private _renderPerformanceCost;
        private _updateTransformPerformanceCost;
        private _preDrawCount;
        private _txt;
        private _tick;
        /**
        * 启动Profiler
        */
        public run(): void;
        /**
        * @private
        */
        private onEnterFrame(event);
        /**
        * @private
        */
        private onStartRender(event);
        private onFinishUpdateTransform(event);
        /**
        * @private
        */
        private onFinishRender(event);
        /**
        * @private
        */
        private update(frameTime);
        /**
        * @private
        */
        public onDrawImage(): void;
    }
}
declare module ns_egret {
    /**
    * RenderContext是游戏的渲染上下文。
    * 这是一个抽象基类，制定主要的接口
    * @stable B 当编写WebGLContext和OpenGLContext时，RendererContext的接口有可能会发生变化，以兼容基于GPU模式的渲染方式，一些设计理念会参考PIXI.js
    * @roadmap 这个接口的重构和实现其他Context是引擎的重点工作
    */
    class RendererContext extends HashObject {
        /**
        * 渲染全部纹理的时间开销
        * @readonly
        */
        public renderCost: number;
        /**
        * 绘制纹理的缩放比率，默认值为1
        */
        public texture_scale_factor: number;
        constructor();
        /**
        * @private
        */
        public clearScreen(): void;
        /**
        * 清除Context的渲染区域
        * @param x
        * @param y
        * @param w
        * @param h
        */
        public clearRect(x: number, y: number, w: number, h: number): void;
        /**
        * 绘制图片
        * @param texture
        * @param sourceX
        * @param sourceY
        * @param sourceWidth
        * @param sourceHeight
        * @param destX
        * @param destY
        * @param destWidth
        * @param destHeight
        */
        public drawImage(texture: Texture, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any): void;
        /**
        * 变换Context的当前渲染矩阵
        * @param matrix
        * @stable A
        */
        public setTransform(matrix: Matrix): void;
        /**
        * @stable C 这个方法以后会和restore一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
        */
        public save(): void;
        /**
        * @stable C 这个方法以后会和save一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
        */
        public restore(): void;
        /**
        * 设置渲染alpha
        * @param value
        * @stable A
        */
        public setAlpha(value: number, blendMode: BlendMode): void;
        /**
        * 设置渲染文本参数
        * @param font
        * @param textAlign
        * @param textBaseline
        */
        public setupFont(font: string, textAlign: string, textBaseline: string): void;
        /**
        * 测量文本
        * @param text
        * @returns {Rectangle}
        * @stable B 参数很可能会需要调整，和setupFont整合
        */
        public measureText(text: any): number;
        /**
        * 绘制文本
        * @param text
        * @param x
        * @param y
        * @param maxWidth
        */
        public drawText(textField: TextField, text: string, x: number, y: number, maxWidth: number): void;
        /**
        * 矩形遮罩
        * @param x
        * @param y
        * @param w
        * @param h
        */
        public clip(x: any, y: any, w: any, h: any): void;
        /**
        * @param x
        * @param y
        * @param w
        * @param h
        * @param color
        * @stable D 这个API是个临时添加的，会被尽快删除
        */
        public strokeRect(x: any, y: any, w: any, h: any, color: any): void;
    }
    class BlendMode {
        private type;
        public value: string;
        constructor(type: any);
        static NORMAL: BlendMode;
        static ADD: BlendMode;
        static LAYER: BlendMode;
        static getBlendMode(type: any): any;
    }
}
declare module ns_egret {
    class SoundContext extends HashObject {
        static getInstance(): SoundContext;
        static isMusicPlaying: boolean;
        constructor();
        public preloadSound(path: any): void;
        public playMusic(path: any, loop?: boolean): void;
        public stopMusic(releaseData: any): void;
    }
}
declare module ns_egret {
    /**
    * StageDelegate负责处理屏幕适配策略
    * 有关屏幕适配策略，更多信息请了解 GitHub:理解egret的GameLauncher
    * @stable B 目前StageDelegate和HTML5有一定的耦合关系，之后会对其解耦，保证NativeApp的正确运行
    */
    class StageDelegate extends HashObject {
        private static instance;
        static getInstance(): StageDelegate;
        static canvas_name: string;
        static canvas_div_name: string;
        private _designWidth;
        private _designHeight;
        private _originalDesignWidth;
        private _originalDesignHeight;
        public _scaleX: number;
        public _scaleY: number;
        private _frame;
        private _resolutionPolicy;
        constructor();
        public setFrameSize(width: any, height: any): void;
        public setDesignSize(width: any, height: any, resolutionPolicy: any): void;
        public setResolutionPolicy(resolutionPolicy: any): void;
        public getScaleX(): number;
        public getScaleY(): number;
    }
    class ResolutionPolicy {
        static FIXED_HEIGHT: number;
        static FIXED_WIDTH: number;
        private _containerStrategy;
        private _contentStrategy;
        constructor(containerStg: any, contentStg: any);
        public init(view: any): void;
        public apply(view: any, designedResolutionWidth: any, designedResolutionHeight: any): any;
        public setContainerStrategy(containerStg: any): void;
        public setContentStrategy(contentStg: any): void;
    }
    class ContainerStrategy {
        static EQUAL_TO_FRAME: any;
        static initialize(): void;
        public init(view: any): void;
        public apply(view: any, designedWidth: any, designedHeight: any): void;
        public _setupContainer(): void;
    }
    class EqualToFrame extends ContainerStrategy {
        public apply(view: any): void;
    }
    class ContentStrategy {
        static FIXED_HEIGHT: ContentStrategy;
        static FIXED_WIDTH: ContentStrategy;
        static initialize(): void;
        public init(view: any): void;
        public apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
    class FixedHeight extends ContentStrategy {
        public apply(delegate: any, designedResolutionWidth: any, designedResolutionHeight: any): void;
    }
    class FixedWidth extends ContentStrategy {
        public apply(delegate: StageDelegate, designedResolutionWidth: any, designedResolutionHeight: any): void;
    }
    class FixedSize extends ContentStrategy {
        private width;
        private height;
        constructor(width: any, height: any);
        public apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
}
declare module ns_egret {
    class TouchEvent extends Event {
        /**
        * 创建一个作为参数传递给事件侦听器的 Event 对象。
        * @class ns_egret.TouchEvent
        * @classdesc TouchEvent数据类
        * @param type {string} 事件的类型，可以作为 Event.type 访问。
        * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
        * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, touchPointID?: number, stageX?: number, stageY?: number);
        /**
        * 轻触，参考Flash的MouseEvent.CLICK
        * @constant {string} ns_egret.TouchEvent.TOUCH_TAP
        */
        static TOUCH_TAP: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        * @constant {string} ns_egret.TouchEvent.TOUCH_MOVE
        */
        static TOUCH_MOVE: string;
        /**
        * 开始触摸,参考Flash的MouseEvent.MOUSE_DOWN
        * @constant {string} ns_egret.TouchEvent.TOUCH_BEGAN
        */
        static TOUCH_BEGAN: string;
        /**
        * 在同一对象上结束触摸,参考Flash的MouseEvent.MOUSE_UP
        * @constant {string} ns_egret.TouchEvent.TOUCH_END
        */
        static TOUCH_END: string;
        /**
        * 在对象外部结束触摸，参考Flash的MouseEvent.RELEASE_OUTSIDE
        * @constant {string} ns_egret.TouchEvent.TOUCH_RELEASE_OUTSIDE
        */
        static TOUCH_RELEASE_OUTSIDE: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        * @member ns_egret.TouchEvent.TOUCH_MOVE
        */
        static TOUCH_ROLL_OUT: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        * @member ns_egret.TouchEvent.TOUCH_MOVE
        */
        static TOUCH_ROLL_OVER: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        */
        static TOUCH_OUT: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        * @member ns_egret.TouchEvent.TOUCH_MOVE
        */
        static TOUCH_OVER: string;
        public _stageX: number;
        /**
        * 事件发生点在全局舞台坐标中的水平坐标。
        * @member {number} ns_egret.TouchEvent#stageX
        */
        public stageX : number;
        public _stageY: number;
        /**
        * 事件发生点在全局舞台坐标中的垂直坐标。
        * @member {number} ns_egret.TouchEvent#stageY
        */
        public stageY : number;
        private _localX;
        /**
        * 事件发生点相对于currentTarget的水平坐标。
        * @member {number} ns_egret.TouchEvent#localX
        */
        public localX : number;
        private _localY;
        /**
        * 事件发生点相对于currentTarget的垂直坐标。
        * @member {number} ns_egret.TouchEvent#localY
        */
        public localY : number;
        /**
        * 分配给触摸点的唯一标识号
        */
        public touchPointID: number;
        /**
        * 事件发生时ctrl键是否被按下。 (Mac OS下为 Cmd 或 Ctrl)
        */
        public ctrlKey: boolean;
        /**
        * 事件发生时shift键是否被按下。
        */
        public shiftKey: boolean;
        /**
        * 事件发生时alt键是否被按下。
        */
        public altKey: boolean;
        /**
        * 表示触摸已按下 (true) 还是未按下 (false)。
        */
        public touchDown: boolean;
        public _setCurrentTarget(target: any): void;
        /**
        * 立即刷新屏幕，此方法主要使用在当用户执行拖拽等操作过程中，强制立即刷新屏幕已提高流畅程度。
        */
        public updateAfterEvent(): void;
    }
}
declare module ns_egret {
    /**
    *
    * @class ns_egret.TouchContext
    * @classdesc TouchContext是egret的触摸Context
    */
    class TouchContext extends HashObject {
        private canvas;
        private _currentTouchTarget;
        public maxTouches: number;
        constructor(canvas: HTMLCanvasElement);
        /**
        * 启动触摸检测
        * @method ns_egret.TouchContext#run
        */
        public run(): void;
        private touchDownTarget;
        private onTouchBegin(event);
        private onTouchMove(event);
        private onTouchEnd(event);
        private getTouchData(event, x, y);
        private static touchEvent;
        private dispatchEvent(type, data);
        static getLocation(canvas: any, event: any): Point;
    }
}
declare module ns_egret {
    /**
    * MainContext是游戏的核心跨平台接口，组合了多个功能Context，并是游戏启动的主入口
    */
    class MainContext extends EventDispatcher {
        constructor();
        /**
        * 渲染Context
        */
        public rendererContext: RendererContext;
        /**
        * 触摸Context
        */
        public touchContext: TouchContext;
        /**
        * 声音Context
        */
        public soundContext: SoundContext;
        /**
        * 网络Context
        */
        public netContext: NetContext;
        /**
        * 设备divice
        */
        public deviceContext: DeviceContext;
        /**
        * 舞台
        */
        public stage: Stage;
        /**
        * 游戏启动，开启主循环，参考Flash的滑动跑道模型
        */
        public run(): void;
        /**
        * 滑动跑道模型，渲染部分
        */
        private renderLoop(frameTime);
        private reuseEvent;
        /**
        * 广播EnterFrame事件。
        */
        private broadcastEnterFrame(frameTime);
        /**
        * 广播Render事件。
        */
        private broadcastRender();
        static instance: MainContext;
    }
}
declare module ns_egret {
    /**
    * Ticker是egret引擎的心跳控制器，是游戏唯一的时间处理入口。开发者务必不要使用setTimeout / setInterval 等方法，而是统一使用Ticker
    * @stable A
    * todo:GitHub文档，介绍心跳控制器的作用
    */
    class Ticker extends EventDispatcher {
        /**
        * 获取当前系统时间的时间戳
        * @stable A
        */
        static now: () => number;
        private _time;
        private _timeScale;
        private _paused;
        private _frameRate;
        /**
        * 启动心跳控制器。
        * 这个函数应只在游戏初始化时调用一次
        * @stable A
        */
        public run(): void;
        private update();
        private callBackList;
        /**
        * 注册帧回调事件，同一函数的重复监听会被忽略。
        * @param listener 帧回调函数,参数返回上一帧和这帧的间隔时间。示例：onEnterFrame(frameTime:number):void
        * @param thisObject 帧回调函数的this对象
        * @param priority 事件优先级，开发者请勿传递 Number.MAX_VALUE 和 Number.MIN_VALUE
        * @stable A-
        */
        public register(listener: Function, thisObject: any, priority?: number): void;
        /**
        * 取消侦听enterFrame事件
        * @param listener 事件侦听函数
        * @param thisObject 侦听函数的this对象
        * @stable A-
        */
        public unregister(listener: Function, thisObject: any): void;
        /**
        * 在一帧之后调用指定函数
        * @param listener 事件侦听函数
        * @param thisObject 侦听函数的this对象
        */
        public callLater(listener: Function, thisObject: any, time?: number): void;
        public setTimeScale(timeScale: any): void;
        public getTimeScale(): number;
        public pause(): void;
        public resume(): void;
        public getFrameRate(): number;
        private static instance;
        static getInstance(): Ticker;
    }
}
declare module ns_egret {
    class HTML5DeviceContext extends HashObject {
        constructor();
        static requestAnimationFrame: Function;
        public executeMainLoop(callback: Function, thisObject: any): void;
    }
}
declare module ns_egret {
    /**
    * 这个类是HTML5的WebWrapper的第一个版本
    * @stable C 目前只是实现需求，大部分API需要考虑重新设计
    */
    class Browser extends HashObject {
        private static instance;
        private pfx;
        private type;
        private trans;
        private ua;
        private isHD;
        public isMobile: boolean;
        static getInstance(): Browser;
        constructor();
        public $new(x: any): any;
        public $(x: any): any;
        public translate: (a: any) => string;
        public rotate: (a: any) => string;
        public scale(a: any): string;
        public skew(a: any): string;
    }
}
declare module ns_egret {
    class StageText extends HashObject {
        private div;
        private inputElement;
        constructor();
        public getText(): string;
        public setText(value: string): void;
        public setTextType(type: string): void;
        public getTextType(): string;
        public open(x: number, y: number, width?: number, height?: number): void;
        public remove(): void;
    }
}
declare module ns_egret {
    /**
    * @class ResourceLoader是egret的资源加载核心
    * GitHub 理解egret的资源加载
    */
    class ResourceLoader extends EventDispatcher {
        public url: string;
        public type: string;
        public state: number;
        public data: any;
        public onLoadComplete: Function;
        public fixedUrl: string;
        public preFixUrl: string;
        constructor(url: string, type: string);
        /**
        * 加载资源，会根据当前资源状态决定是否要发送网络请求
        */
        public load(): void;
        private startLoading();
        private _executeAllCallback(data);
        static LOAD_COMPLETE: string;
        /**
        * 二进制数据
        */
        static DATA_TYPE_BINARY: string;
        /**
        * 文本数据
        */
        static DATA_TYPE_TEXT: string;
        /**
        * 图片数据
        */
        static DATA_TYPE_IMAGE: string;
        /**
        * 加载状态：未开始
        */
        static LOAD_STATE_INIT: number;
        /**
        * 加载状态：已完成
        */
        static LOAD_STATE_LOADED: number;
        private static __pool;
        /**
        * 资源加载前缀
        */
        static prefix: string;
        static create(src: string, type?: string): any;
        private static __registerMap;
        static registerHandler(ext: string, handlerClass: Function): void;
    }
}
declare module ns_egret {
    /**
    * @class SpriteSheet类是位图SpriteSheet的配置文件。包括一组SpriteSheetFrame
    * 每一个Bitmap对象都可以设置其SpriteSheetFrame，实现显示纹理的特定区域
    * 在WebGL / OpenGL上，这种做法可以显著提升性能
    * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
    * todo: GitHub egret的SpriteSheet
    */
    class SpriteSheet extends HashObject {
        private frames;
        constructor(data: any);
        /**
        * 获取指定的SpriteFrame
        * @param spriteFrameName
        * @returns {*}
        */
        public getFrame(spriteFrameName: any): any;
        /**
        * 这个API已经被完全废弃，会尽快删除
        * @param data
        * @returns {SpriteSheet}
        * @stable D
        */
        static parseFromDragonBones(data: any): SpriteSheet;
    }
    class SpriteSheetFrame {
        /**
        * 表示这个Frame在Sheet上的x位置
        */
        public x: number;
        /**
        * 表示这个Frame在Sheet上的y位置
        */
        public y: number;
        /**
        * 表示这个Frame在Sheet上的宽度
        */
        public w: number;
        /**
        * 表示这个Frame在Sheet上的高度
        */
        public h: number;
        /**
        * 表示这个Frame显示了之后需要在x方向的渲染偏移量
        */
        public offX: number;
        /**
        * 表示这个Frame显示了之后需要在y方向的渲染偏移量
        */
        public offY: number;
    }
}
declare module ns_egret {
    /**
    * 纹理的缓存和管理类
    * @class ns_egret.TextureCache
    */
    class TextureCache extends HashObject {
        private static instance;
        static getInstance(): TextureCache;
        private _textures;
        private _spritesheets;
        constructor();
        /**
        * 添加纹理
        * @param key
        * @param texture
        */
        public addTexture(key: any, texture: Texture): void;
        /**
        * 删除纹理
        * @param key
        */
        public removeTexture(key: string): void;
        /**
        * 获取纹理
        * @param key
        * @returns {*}
        */
        public getTexture(key: string): Texture;
        /**
        * 添加SpriteSheet
        * @param key
        * @param spriteSheet
        * @param texture
        * @stable B 由于SpriteSheet和纹理往往是对应的，正在考虑将addSpriteSheet和addTexture合并
        */
        public addSpriteSheet(key: string, spriteSheet: SpriteSheet, texture: Texture): void;
        /**
        * 移除SpriteSheet
        * @param key
        */
        public removeSpriteSheet(key: string): void;
        /**
        * 获取SpriteSheet
        * @param key
        * @returns {*}
        */
        public getSpriteSheet(key: string): any;
    }
}
declare module ns_egret {
    class HTML5NetContext extends NetContext {
        public send(request: URLRequest): void;
        private loadImage(request);
        private _stringConvertToArray(strData);
        private _setXMLHttpRequestHeader(xhr, type);
        private _getXMLHttpRequest();
    }
}
declare module ns_egret {
    class WebGLRenderer extends RendererContext {
        private _list;
        constructor();
        public drawImage(): void;
        public setTransform(): void;
    }
}
declare module ns_egret {
    class HTML5SoundContext extends SoundContext {
        private _soundList;
        private _capabilities;
        private _soundSupported;
        private _canPlay;
        private _supportedFormat;
        private _playingMusicName;
        constructor();
        private _checkCanPlay(capabilities);
        public preloadSound(path: any): void;
        private _getSupportedAudioFormat();
        private isFormatSupported(ext);
        private _getExtFromFullPath(fullpath);
        public playMusic(path: any, loop?: boolean): void;
        public stopMusic(releaseData: any): void;
    }
}
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
declare module ns_egret {
    class HorizontalAlign {
        /**
        * 左对齐
        */
        static LEFT: String;
        /**
        * 右对齐
        */
        static RIGHT: String;
        /**
        * 水平居中对齐
        */
        static CENTER: String;
        /**
        * 水平两端对齐
        */
        static JUSTIFY: string;
        /**
        * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容宽度"。
        * 容器的"内容宽度"是最大子项的大小,如果所有子项都小于容器的宽度，则会将所有子项的大小调整为容器的宽度。
        * 注意：TextFiled不支持此对齐方式。
        */
        static CONTENT_JUSTIFY: string;
    }
}
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
declare module ns_egret {
    /**
    * 返回一个对象的完全限定名<br/>
    * @param value 需要完全限定类名称的对象，可以将任何 TypeScript / JavaScript值传递给此方法，包括所有可用的TypeScript / JavaScript类型、对象实例、原始类型（如number）和类对象
    * @returns {string} 包含完全限定类名称的字符串<br />
    * 在Flash中，此方法返回的是类的全名，如 Bitmap对象返回 flash.display.Bitmap <br/>
    * 在Egret中，由于JavaScript语言自身的限制，Bitmap对象返回 Bitmap而非 ns_egret.Bitmap <br/r>
    * @example
    *  ns_egret.getQualifiedClassName(ns_egret.DisplayObject) //返回 DisplayObject
    *  ns_egret.getQualifiedClassName(new ns_egret.DisplayObject()) //返回 DisplayObject
    *  ns_egret.getQualifiedClassName(19910901) //返回 Number
    *  ns_egret.getQualifiedClassName("Hello,Egret") //返回 String
    */
    function getQualifiedClassName(value: any): any;
}
declare module ns_egret {
    /**
    * @class ns_egret.Injector
    */
    class Injector {
        /**
        * 储存类的映射规则
        */ 
        private static mapClassDic;
        /**
        * 以类定义为值进行映射注入，只有第一次请求它的单例时才会被实例化。
        * @method ns_egret.Injector.mapClass
        * @param {any} whenAskedFor 传递类定义或类完全限定名作为需要映射的键。
        * @param {any} instantiateClass 传递类作为需要映射的值，它的构造函数必须为空。若不为空，请使用Injector.mapValue()方法直接注入实例。
        * @param {string} named 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
        */
        static mapClass(whenAskedFor: any, instantiateClass: any, named?: string): void;
        /**
        * 获取完全限定类名
        */ 
        private static getKey(hostComponentKey);
        private static mapValueDic;
        /**
        * 以实例为值进行映射注入,当请求单例时始终返回注入的这个实例。
        * @method ns_egret.Injector.mapValue
        * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
        * @param useValue {any} 传递对象实例作为需要映射的值。
        * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
        */ 
        static mapValue(whenAskedFor: any, useValue: any, named?: string): void;
        /**
        * 检查指定的映射规则是否存在
        * @method ns_egret.Injector.hasMapRule
        * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
        * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。
        */
        static hasMapRule(whenAskedFor: any, named?: string): boolean;
        /**
        * 获取指定类映射的单例
        * @method ns_egret.Injector.getInstance
        * @param clazz {any} 类定义或类的完全限定名
        * @param named {string} 可选参数，若在调用mapClass()映射时设置了这个值，则要传入同样的字符串才能获取对应的单例
        */ 
        static getInstance(clazz: any, named?: string): any;
    }
}
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
declare module ns_egret {
    class VerticalAlign {
        /**
        * 顶对齐
        */
        static TOP: String;
        /**
        * 底对齐
        */
        static BOTTOM: String;
        /**
        * 垂直居中对齐
        */
        static MIDDLE: String;
        /**
        * 垂直两端对齐
        */
        static JUSTIFY: string;
        /**
        * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容高度"。
        * 容器的"内容高度"是最大子项的大小,如果所有子项都小于容器的高度，则会将所有子项的大小调整为容器的高度。
        * 注意：TextFiled不支持此对齐方式。
        */
        static CONTENT_JUSTIFY: string;
    }
}
declare module ns_egret {
    class Bitmap extends DisplayObject {
        /**
        * 全部Bitmap是否开启DEBUG模式
        * @stable B 这个API以后可能会被移动到一个单独的负责各种DEBUG参数的枚举类中
        */
        static debug: boolean;
        /**
        * 单个Bitmap是否开启DEBUG模式
        * @stable B 这个API以后可能会被移动到一个单独的负责各种DEBUG参数的枚举类中
        */
        public debug: boolean;
        /**
        * debug边框颜色，默认值为红色
        */
        public debugColor: number;
        /**
        * 渲染采用的SpriteFrame，用来渲染纹理中的一部分
        */
        public spriteFrame: SpriteSheetFrame;
        /**
        * 渲染纹理
        */
        public texture: Texture;
        /**
        * 这个API是cocos2d-x风格的，和egret设计思路不统一，会最快时间内删除
        * @stable D
        * @param texture
        * @returns {Bitmap}
        */
        static initWithTexture(texture: Texture): Bitmap;
        constructor();
        /**
        * @see egret.DisplayObject.render
        * @param renderContext
        */
        public render(renderContext: RendererContext): void;
        /**
        * @see egret.DisplayObject.measureBounds
        * @returns {Rectangle}
        * @private
        */
        public _measureBounds(): Rectangle;
    }
}
declare module ns_egret {
    /**
    * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
    */
    class MovieClip extends DisplayObjectContainer {
        public data: any;
        public texture: Texture;
        private _frameData;
        private _resPool;
        private _currentFrameIndex;
        private _currentFrameName;
        private _totalFrame;
        private _interval;
        private _currentInterval;
        private _isPlaying;
        private _passTime;
        private _oneFrameTime;
        constructor(data: any, texture: Texture);
        /**
        * 播放指定动画
        * @param frameName
        */
        public gotoAndPlay(frameName: string): void;
        /**
        * 播放并暂停指定动画
        * @param frameName
        */
        public gotoAndStop(frameName: string): void;
        private checkHasFrame(name);
        /**
        * 暂停动画
        */
        public stop(): void;
        private update(frameTime);
        private playNextFrame(needShow?);
        private getBitmap(name);
        public release(): void;
        public getCurrentFrameIndex(): number;
        public getTotalFrame(): number;
        /**
        * 设置间隔
        * @param value
        */
        public setInterval(value: number): void;
        /**
        * 判断当前动画是否正在播放
        * @stable D 这个API需要改为 isPlaying()
        * @returns {Boolean}
        */
        public getIsPlaying(): boolean;
    }
}
declare module ns_egret {
    class Scale9Bitmap extends DisplayObjectContainer {
        private texture;
        private _defaultPadding;
        private _top;
        private _bottom;
        private _left;
        private _right;
        private _scaleWidth;
        private _scaleHeight;
        private _topLeftBitmap;
        private _topMiddleBitmap;
        private _topRightBitmap;
        private _middleLeftBitmap;
        private _middleMiddleBitmap;
        private _middleRightBitmap;
        private _bottomLeftBitmap;
        private _bottomMiddleBitmap;
        private _bottomRightBitmap;
        constructor(texture: Texture);
        public setScaleGrid(top?: number, bottom?: number, left?: number, right?: number): void;
        public width : number;
        public height : number;
        public updateTransform(): void;
        private setChildScaleX(child, scaleX);
        private setChildScaleY(child, scaleY);
    }
}
declare module ns_egret {
    class Shape extends DisplayObject {
        public graphic: Graphic;
        constructor();
        public hitTest(x: any, y: any): DisplayObject;
        public render(renderContext: RendererContext): void;
    }
    class ShapeRect extends Shape {
        private _color;
        private _colorDirty;
        private _sizeDirty;
        constructor();
        public color : number;
        public alpha : number;
        /**
        * 宽度，优先顺序为 显式设置宽度 > 测量宽度
        * @returns {number}
        */
        /**
        * 显式设置宽度
        * @param value
        */
        public width : number;
        /**
        * 高度，优先顺序为 显式设置高度 > 测量高度
        * @returns {number}
        */
        /**
        * 显式设置高度
        * @param value
        */
        public height : number;
        public render(renderContext: RendererContext): void;
    }
    class Graphic {
        private renderContext;
        private canvasContext;
        private commandQueue;
        constructor(renderContext: RendererContext);
        public beginFill(color: number, alpha: number): void;
        private _setStyle(colorStr);
        public drawRect(x: number, y: number, width: number, height: number): void;
        public clear(): void;
        public endFill(): void;
        public _draw(): void;
    }
}
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
declare module ns_egret {
    /**
    * EventPhase 类可为 Event 类的 eventPhase 属性提供值。
    */
    class EventPhase {
        /**
        * 捕获阶段，是事件流的第一个阶段。
        */
        static CAPTURING_PHASE: number;
        /**
        * 目标阶段，是事件流的第二个阶段。
        */
        static AT_TARGET: number;
        /**
        * 冒泡阶段，是事件流的第三个阶段。
        */
        static BUBBLING_PHASE: number;
    }
}
declare module ns_egret {
    class TimerEvent extends Event {
        /**
        * 创建一个 Event 对象，其中包含有关 timer 事件的特定信息。
        * @class ns_egret.TimerEvent
        * @classdesc 每当 Timer 对象达到由 Timer.delay 属性指定的间隔时，Timer 对象即会调度 TimerEvent 对象。
        * @param type {string} 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
        * @param bubbles {string} 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
        * @param cancelable {string} 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
        * 每当 Timer 对象达到根据 Timer.delay 属性指定的间隔时调度。
        * @constant {string} ns_egret.TimerEvent.TIMER
        */
        static TIMER: string;
        /**
        * 每当它完成 Timer.repeatCount 设置的请求数后调度。
        * @constant {string} ns_egret.TimerEvent.TIMER_COMPLETE
        */
        static TIMER_COMPLETE: string;
        /**
        * 立即刷新屏幕，此方法主要使用在当用户执行拖拽等操作过程中，强制立即刷新屏幕已提高流畅程度。
        */
        public updateAfterEvent(): void;
    }
}
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
declare module ns_egret {
    class InteractionMode {
        /**
        * 使用鼠标交互模式。
        */
        static MOUSE: string;
        /**
        * 使用触摸交互模式。
        */
        static TOUCH: string;
        /**
        * 当前Egret使用的交互模式。
        */
        static mode: string;
    }
}
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
declare module ns_egret {
    /**
    * ILoadingView是加载进度条的接口，所有的加载进度条都需要实现如下方法，并通过LoadingController.setLoadingView(view)来调用
    * @interface
    * @class ns_egret.ILoadingView
    */
    interface ILoadingView {
        /**
        * 将进度条添加到舞台
        * @method ns_egret.ILoadingView#addToStage
        */
        addToStage(): any;
        /**
        * 将进度条从舞台中移除
        * @method ns_egret.ILoadingView#removeFromStage
        */
        removeFromStage(): any;
        /**
        * 更新进度条
        * @callback ns_egret.ILoadingView#onProgress
        * @param current
        * @param total
        *
        */
        onProgress(current: number, total: number): any;
    }
}
declare module ns_egret {
    /**
    * 是egret的加载控制器，他包含了一个或者一组ResourceLoader，控制其加载队列和调用加载界面更新进度。
    * @class ns_egret.LoadingController
    */
    class LoadingController extends EventDispatcher {
        static LOAD_STATE_IDLE: number;
        static LOAD_STATE_LOADING: number;
        private _resourceUrlList;
        private _currentIndex;
        private _loadingView;
        private _state;
        private _currentResource;
        /**
        * 添加资源
        * @method ns_egret.LoadingController#addResource
        * @param url {string} 加载url
        * @param type {string} 加载类型
        */
        public addResource(url: string, type?: string, prefix?: string): void;
        /**
        * 开始加载
        * @method ns_egret.LoadingController#load
        */
        public load(): void;
        private onComplete();
        private checkIsLoading();
        private next(event);
        private removeResourceEvent();
        private onProgress();
        /**
        * 设置加载进度界面
        * @method ns_egret.LoadingController#setLoadingView
        * @param view {ns_egret.ILoadingView}
        */
        public setLoadingView(view: ILoadingView): void;
        private destroy();
    }
}
declare module ns_egret {
    /**
    * @class BitmapText
    * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字
    */
    class BitmapText extends DisplayObjectContainer {
        /**
        * 设置文本
        */
        public text: string;
        /**
        * 纹理对象
        */
        public texture: Texture;
        /**
        * SpriteFrame配置文件，通过egret的Node.js工具生成
        */
        public bitmapFontData: any;
        private _bitmapPool;
        constructor();
        public updateTransform(): void;
        public _renderText(forMeasureContentSize?: boolean): Rectangle;
        public _measureBounds(): Rectangle;
    }
}
declare module ns_egret {
    class TextInput extends DisplayObject {
        private _domInputSprite;
        private _edTxt;
        private _delegate;
        private _placeholderText;
        private _edFontSize;
        private _textColor;
        private _placeholderFontSize;
        private _placeholderColor;
        private _preX;
        private _preY;
        private stageText;
        public _onAddToStage(): void;
        public setText(value: string): void;
        public getText(): string;
        public setTextType(type: string): void;
        public getTextType(): string;
        private onMouseDownHandler(event);
        public _onRemoveFromStage(): void;
        public _measureBounds(): Rectangle;
        public hitTest(x: any, y: any): any;
    }
    class TextInputDegelete {
        public editBoxEditingDidBegin(sender: any): void;
        public editBoxEditingDidEnd(sender: any): void;
        public editBoxTextChanged(sender: any, text: any): void;
        public editBoxReturn(sender: any): void;
    }
}
declare module ns_egret {
    class Ease {
        constructor();
        static get(amount: any): Function;
        static getPowIn(pow: any): Function;
        static getPowOut(pow: any): Function;
        static getPowInOut(pow: any): Function;
        static quadIn: Function;
        static quadOut: Function;
        static quadInOut: Function;
        static cubicIn: Function;
        static cubicOut: Function;
        static cubicInOut: Function;
        static quartIn: Function;
        static quartOut: Function;
        static quartInOut: Function;
        static quintIn: Function;
        static quintOut: Function;
        static quintInOut: Function;
        static sineIn(t: any): number;
        static sineOut(t: any): number;
        static sineInOut(t: any): number;
        static getBackIn(amount: any): Function;
        static backIn: Function;
        static getBackOut(amount: any): Function;
        static backOut: Function;
        static getBackInOut(amount: any): Function;
        static backInOut: Function;
        static circIn(t: any): number;
        static circOut(t: any): number;
        static circInOut(t: any): number;
        static bounceIn(t: any): number;
        static bounceOut(t: any): number;
        static bounceInOut(t: any): number;
        static getElasticIn(amplitude: any, period: any): Function;
        static elasticIn: Function;
        static getElasticOut(amplitude: any, period: any): Function;
        static elasticOut: Function;
        static getElasticInOut(amplitude: any, period: any): Function;
        static elasticInOut: Function;
    }
}
declare module ns_egret {
    class Tween extends EventDispatcher {
        static NONE: number;
        static LOOP: number;
        static REVERSE: number;
        private static _tweens;
        private static IGNORE;
        private static _plugins;
        private static _inited;
        private _target;
        private _useTicks;
        private ignoreGlobalPause;
        private loop;
        private pluginData;
        private _curQueueProps;
        private _initQueueProps;
        private _steps;
        private _actions;
        private paused;
        private duration;
        private _prevPos;
        private position;
        private _prevPosition;
        private _stepPosition;
        private passive;
        static get(target: any, props?: any, pluginData?: any, override?: boolean): Tween;
        static removeTweens(target: any): void;
        private static tick(delta, paused?);
        private static _register(tween, value);
        static removeAllTweens(): void;
        constructor(target: any, props: any, pluginData: any);
        private initialize(target, props, pluginData);
        private setPosition(value, actionsMode?);
        private _runActions(startPos, endPos, includeStart?);
        private _updateTargetProps(step, ratio);
        public setPaused(value: boolean): Tween;
        private _cloneProps(props);
        private _addStep(o);
        private _appendQueueProps(o);
        private _addAction(o);
        private _set(props, o);
        public wait(duration: number, passive?: boolean): Tween;
        public to(props: any, duration: number, ease?: any): Tween;
        public call(callback: Function, thisObj?: any, params?: any): Tween;
        public set(props: any, target?: any): Tween;
        public play(tween: Tween): Tween;
        public pause(tween: Tween): Tween;
        public tick(delta: number): void;
    }
}
declare module ns_egret {
    class SAXParser extends HashObject {
        static _instance: SAXParser;
        static getInstance(): SAXParser;
        private _parser;
        private _xmlDict;
        private _isSupportDOMParser;
        constructor();
        /**
        *解析xml
        */
        public parse(textxml: string): any;
        /**
        * 解析tilemap
        */
        public tmxParse(textxml: string, isXMLString?: boolean): any;
        private parserXML(textxml);
        private parseNode(node);
        private parseArray(node);
        private parseDict(node);
        /**
        * 获取文件名
        */
        public getName(filePath: string): string;
        /**
        * 获取文件扩展名
        */
        public getExt(filePath: string): string;
        public getList(key: string): any;
    }
}
declare module ns_egret {
    class Timer extends EventDispatcher {
        constructor(delay?: number, repeatCount?: number);
        public delay: number;
        public repeatCount: number;
        private _currentCount;
        public currentCount(): number;
        private _running;
        public running(): boolean;
        public reset(): void;
        public start(): void;
        public stop(): void;
        private static timerEvent;
        private lastTime;
        private onEnterFrame(frameTime);
    }
}
declare module ns_egret {
    class XML extends HashObject {
        private _xmlStr;
        /**
        * @class ns_egret.XML
        * @classdesc XML类模拟了ActionScript3.0的E4X的部分语法特性，封装了对XML对象的操作
        *
        * @example
        * <xmp>
        *  <root>
        *    <egret>
        *      <item>123</item>
        *      <item name="yjtx"/>
        *    </egret>
        *  </root>
        *  </xmp>
        * xml.egret[0].item;    // [ XML,XML ]
        * xml.egret[0].item[0].value;  // 123
        * xml.egret[0].item[1].$name;  // yjtx
        * @param xmlStr  {string} xml格式的字符串
        */
        constructor(xmlStr?: string);
        /**
        * 解析 xml文件
        * @param xmlDoc
        * @private
        */
        public _ansXML(xmlDoc: any): void;
    }
}
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
declare module dragonBones {
    module geom {
        class Point {
            public x: number;
            public y: number;
            constructor(x?: number, y?: number);
            public toString(): string;
        }
        class Rectangle {
            public x: number;
            public y: number;
            public width: number;
            public height: number;
            constructor(x?: number, y?: number, width?: number, height?: number);
        }
        class Matrix {
            public a: number;
            public b: number;
            public c: number;
            public d: number;
            public tx: number;
            public ty: number;
            constructor();
            public invert(): void;
        }
        class ColorTransform {
            public alphaMultiplier: number;
            public alphaOffset: number;
            public blueMultiplier: number;
            public blueOffset: number;
            public greenMultiplier: number;
            public greenOffset: number;
            public redMultiplier: number;
            public redOffset: number;
            constructor();
        }
    }
    module events {
        class Event {
            public type: string;
            public target: EventDispatcher;
            constructor(type: string);
        }
        class AnimationEvent extends Event {
            static FADE_IN: string;
            static FADE_OUT: string;
            static START: string;
            static COMPLETE: string;
            static LOOP_COMPLETE: string;
            static FADE_IN_COMPLETE: string;
            static FADE_OUT_COMPLETE: string;
            public animationState: animation.AnimationState;
            public armature: Armature;
            constructor(type: string);
        }
        class ArmatureEvent extends Event {
            static Z_ORDER_UPDATED: string;
            constructor(type: string);
        }
        class FrameEvent extends Event {
            static ANIMATION_FRAME_EVENT: string;
            static BONE_FRAME_EVENT: string;
            public animationState: animation.AnimationState;
            public armature: Armature;
            public bone: Bone;
            public frameLabel: string;
            constructor(type: string);
        }
        class SoundEvent extends Event {
            static SOUND: string;
            static BONE_FRAME_EVENT: string;
            public animationState: animation.AnimationState;
            public armature: Armature;
            public sound: string;
            constructor(type: string);
        }
        class EventDispatcher {
            private _listenersMap;
            constructor();
            public hasEventListener(type: string): boolean;
            public addEventListener(type: string, listener: Function): void;
            public removeEventListener(type: string, listener: Function): void;
            public removeAllEventListeners(type: string): void;
            public dispatchEvent(event: Event): void;
        }
        class SoundEventManager extends EventDispatcher {
            private static _instance;
            static getInstance(): SoundEventManager;
            constructor();
        }
    }
    module animation {
        interface IAnimatable {
            advanceTime(passedTime: number): void;
        }
        class WorldClock implements IAnimatable {
            static clock: WorldClock;
            public time: number;
            public timeScale: number;
            private _animatableList;
            constructor();
            public contains(animatable: IAnimatable): boolean;
            public add(animatable: IAnimatable): void;
            public remove(animatable: IAnimatable): void;
            public clear(): void;
            public advanceTime(passedTime: number): void;
        }
        class TimelineState {
            private static HALF_PI;
            private static _pool;
            static _borrowObject(): TimelineState;
            /** @private */
            static _returnObject(timeline: TimelineState): void;
            /** @private */
            static _clear(): void;
            static getEaseValue(value: number, easing: number): number;
            public transform: objects.DBTransform;
            public pivot: geom.Point;
            public tweenActive: boolean;
            private _updateState;
            private _animationState;
            private _bone;
            private _timeline;
            private _currentFrame;
            private _currentFramePosition;
            private _currentFrameDuration;
            private _durationTransform;
            private _durationPivot;
            private _durationColor;
            private _originTransform;
            private _originPivot;
            private _tweenEasing;
            private _tweenTransform;
            private _tweenColor;
            private _totalTime;
            constructor();
            public fadeIn(bone: Bone, animationState: AnimationState, timeline: objects.TransformTimeline): void;
            public fadeOut(): void;
            public update(progress: number): void;
            private clear();
        }
        class AnimationState {
            private static _pool;
            /** @private */
            static _borrowObject(): AnimationState;
            /** @private */
            static _returnObject(animationState: AnimationState): void;
            /** @private */
            static _clear(): void;
            public enabled: boolean;
            public tweenEnabled: boolean;
            public blend: boolean;
            public group: string;
            public weight: number;
            public name: string;
            public clip: objects.AnimationData;
            public loopCount: number;
            public loop: number;
            public layer: number;
            public isPlaying: boolean;
            public isComplete: boolean;
            public totalTime: number;
            public currentTime: number;
            public timeScale: number;
            public displayControl: boolean;
            /** @private */
            public _timelineStates: any;
            /** @private */
            public _fadeWeight: number;
            private _armature;
            private _currentFrame;
            private _mixingTransforms;
            private _fadeState;
            private _fadeInTime;
            private _fadeOutTime;
            private _fadeOutBeginTime;
            private _fadeOutWeight;
            private _fadeIn;
            private _fadeOut;
            private _pauseBeforeFadeInComplete;
            constructor();
            public fadeIn(armature: Armature, clip: objects.AnimationData, fadeInTime: number, timeScale: number, loop: number, layer: number, displayControl: boolean, pauseBeforeFadeInComplete: boolean): void;
            public fadeOut(fadeOutTime: number, pause?: boolean): void;
            public play(): void;
            public stop(): void;
            public getMixingTransform(timelineName: string): number;
            public addMixingTransform(timelineName: string, type?: number, recursive?: boolean): void;
            public removeMixingTransform(timelineName?: string, recursive?: boolean): void;
            public advanceTime(passedTime: number): boolean;
            private updateTimelineStates();
            private addTimelineState(timelineName);
            private removeTimelineState(timelineName);
            private clear();
        }
        class Animation {
            static NONE: string;
            static SAME_LAYER: string;
            static SAME_GROUP: string;
            static SAME_LAYER_AND_GROUP: string;
            static ALL: string;
            public tweenEnabled: boolean;
            public timeScale: number;
            public animationNameList: string[];
            /** @private */
            public _animationLayer: AnimationState[][];
            /** @private */
            public _lastAnimationState: AnimationState;
            private _armature;
            private _isPlaying;
            public getLastAnimationName(): string;
            public getLastAnimationState(): AnimationState;
            private _animationDataList;
            public getAnimationDataList(): objects.AnimationData[];
            public setAnimationDataList(value: objects.AnimationData[]): void;
            public getIsPlaying(): boolean;
            public getIsComplete(): boolean;
            constructor(armature: Armature);
            public dispose(): void;
            public gotoAndPlay(animationName: string, fadeInTime?: number, duration?: number, loop?: number, layer?: number, group?: string, fadeOutMode?: string, displayControl?: boolean, pauseFadeOut?: boolean, pauseFadeIn?: boolean): AnimationState;
            public play(): void;
            public stop(): void;
            public getState(name: string, layer?: number): AnimationState;
            public hasAnimation(animationName: string): boolean;
            public advanceTime(passedTime: number): void;
            private addLayer(layer);
            private addState(animationState);
            private removeState(animationState);
        }
    }
    module objects {
        class DBTransform {
            public x: number;
            public y: number;
            public skewX: number;
            public skewY: number;
            public scaleX: number;
            public scaleY: number;
            constructor();
            public getRotation(): number;
            public setRotation(value: number): void;
            public copy(transform: DBTransform): void;
            public toString(): string;
        }
        class Frame {
            public position: number;
            public duration: number;
            public action: string;
            public event: string;
            public sound: string;
            constructor();
            public dispose(): void;
        }
        class TransformFrame extends Frame {
            public tweenEasing: number;
            public tweenRotate: number;
            public displayIndex: number;
            public zOrder: number;
            public visible: boolean;
            public global: DBTransform;
            public transform: DBTransform;
            public pivot: geom.Point;
            public color: geom.ColorTransform;
            constructor();
            public dispose(): void;
        }
        class Timeline {
            public duration: number;
            public scale: number;
            private _frameList;
            public getFrameList(): Frame[];
            constructor();
            public dispose(): void;
            public addFrame(frame: Frame): void;
        }
        class TransformTimeline extends Timeline {
            static HIDE_TIMELINE: TransformTimeline;
            public transformed: boolean;
            public offset: number;
            public originTransform: DBTransform;
            public originPivot: geom.Point;
            constructor();
            public dispose(): void;
        }
        class AnimationData extends Timeline {
            public frameRate: number;
            public name: string;
            public loop: number;
            public tweenEasing: number;
            public fadeInTime: number;
            private _timelines;
            public getTimelines(): any;
            constructor();
            public dispose(): void;
            public getTimeline(timelineName: string): TransformTimeline;
            public addTimeline(timeline: TransformTimeline, timelineName: string): void;
        }
        class DisplayData {
            static ARMATURE: string;
            static IMAGE: string;
            public name: string;
            public type: string;
            public transform: DBTransform;
            public pivot: geom.Point;
            constructor();
            public dispose(): void;
        }
        class SlotData {
            public name: string;
            public parent: string;
            public zOrder: number;
            public blendMode: string;
            private _displayDataList;
            public getDisplayDataList(): DisplayData[];
            constructor();
            public dispose(): void;
            public addDisplayData(displayData: DisplayData): void;
            public getDisplayData(displayName: string): DisplayData;
        }
        class BoneData {
            public name: string;
            public parent: string;
            public length: number;
            public global: DBTransform;
            public transform: DBTransform;
            public scaleMode: number;
            public fixedRotation: boolean;
            constructor();
            public dispose(): void;
        }
        class SkinData {
            public name: string;
            private _slotDataList;
            public getSlotDataList(): SlotData[];
            constructor();
            public dispose(): void;
            public getSlotData(slotName: string): SlotData;
            public addSlotData(slotData: SlotData): void;
        }
        class ArmatureData {
            public name: string;
            private _boneDataList;
            public getBoneDataList(): BoneData[];
            private _skinDataList;
            public getSkinDataList(): SkinData[];
            private _animationDataList;
            public getAnimationDataList(): AnimationData[];
            constructor();
            public dispose(): void;
            public getBoneData(boneName: string): BoneData;
            public getSkinData(skinName: string): SkinData;
            public getAnimationData(animationName: string): AnimationData;
            public addBoneData(boneData: BoneData): void;
            public addSkinData(skinData: SkinData): void;
            public addAnimationData(animationData: AnimationData): void;
            public sortBoneDataList(): void;
            private sortBoneData(object1, object2);
        }
        class SkeletonData {
            public name: string;
            private _subTexturePivots;
            public getArmatureNames(): string[];
            private _armatureDataList;
            public getArmatureDataList(): ArmatureData[];
            constructor();
            public dispose(): void;
            public getArmatureData(armatureName: string): ArmatureData;
            public addArmatureData(armatureData: ArmatureData): void;
            public removeArmatureData(armatureData: ArmatureData): void;
            public removeArmatureDataByName(armatureName: string): void;
            public getSubTexturePivot(subTextureName: string): geom.Point;
            public addSubTexturePivot(x: number, y: number, subTextureName: string): geom.Point;
            public removeSubTexturePivot(subTextureName: string): void;
        }
        class DataParser {
            static parseTextureAtlasData(rawData: any, scale?: number): any;
            static parseSkeletonData(rawData: any): SkeletonData;
            private static parseArmatureData(armatureObject, data, frameRate);
            private static parseBoneData(boneObject);
            private static parseSkinData(skinObject, data);
            private static parseSlotData(slotObject, data);
            private static parseDisplayData(displayObject, data);
            private static parseAnimationData(animationObject, armatureData, frameRate);
            private static parseTimeline(timelineObject, timeline, frameParser, frameRate);
            private static parseTransformTimeline(timelineObject, duration, frameRate);
            private static parseFrame(frameObject, frame, frameRate);
            private static parseMainFrame(frameObject, frameRate);
            private static parseTransformFrame(frameObject, frameRate);
            private static parseTransform(transformObject, transform, pivot?);
        }
    }
    module display {
        interface IDisplayBridge {
            getVisible(): boolean;
            setVisible(value: boolean): void;
            getDisplay(): any;
            setDisplay(value: any): void;
            dispose(): void;
            updateTransform(matrix: geom.Matrix, transform: objects.DBTransform): void;
            updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number): void;
            addDisplay(container: any, index: number): void;
            removeDisplay(): void;
            updateBlendMode(blendMode: string): void;
        }
    }
    module textures {
        interface ITextureAtlas {
            name: string;
            dispose(): void;
            getRegion(subTextureName: string): geom.Rectangle;
        }
    }
    module factorys {
        class BaseFactory extends events.EventDispatcher {
            /** @private */
            public _dataDic: any;
            /** @private */
            public _textureAtlasDic: any;
            /** @private */
            public _textureAtlasLoadingDic: any;
            /** @private */
            public _currentDataName: string;
            /** @private */
            public _currentTextureAtlasName: string;
            constructor();
            public getSkeletonData(name: string): objects.SkeletonData;
            public addSkeletonData(data: objects.SkeletonData, name?: string): void;
            public removeSkeletonData(name: string): void;
            public getTextureAtlas(name: string): any;
            public addTextureAtlas(textureAtlas: textures.ITextureAtlas, name?: string): void;
            public removeTextureAtlas(name: string): void;
            public dispose(disposeData?: boolean): void;
            public buildArmature(armatureName: string, animationName: string, skeletonName: string, textureAtlasName: string, skinName: string): Armature;
            public getTextureDisplay(textureName: string, textureAtlasName: string, pivotX: number, pivotY: number): Object;
            /** @private */
            public _generateArmature(): Armature;
            /** @private */
            public _generateSlot(): Slot;
            /** @private */
            public _generateDisplay(textureAtlas: textures.ITextureAtlas, fullName: string, pivotX: number, pivotY: number): any;
        }
    }
    module utils {
        class ConstValues {
            static ANGLE_TO_RADIAN: number;
            static DRAGON_BONES: string;
            static ARMATURE: string;
            static SKIN: string;
            static BONE: string;
            static SLOT: string;
            static DISPLAY: string;
            static ANIMATION: string;
            static TIMELINE: string;
            static FRAME: string;
            static TRANSFORM: string;
            static COLOR_TRANSFORM: string;
            static TEXTURE_ATLAS: string;
            static SUB_TEXTURE: string;
            static A_VERSION: string;
            static A_IMAGE_PATH: string;
            static A_FRAME_RATE: string;
            static A_NAME: string;
            static A_PARENT: string;
            static A_LENGTH: string;
            static A_TYPE: string;
            static A_FADE_IN_TIME: string;
            static A_DURATION: string;
            static A_SCALE: string;
            static A_OFFSET: string;
            static A_LOOP: string;
            static A_EVENT: string;
            static A_SOUND: string;
            static A_ACTION: string;
            static A_HIDE: string;
            static A_TWEEN_EASING: string;
            static A_TWEEN_ROTATE: string;
            static A_DISPLAY_INDEX: string;
            static A_Z_ORDER: string;
            static A_BLENDMODE: string;
            static A_WIDTH: string;
            static A_HEIGHT: string;
            static A_SCALE_MODE: string;
            static A_FIXED_ROTATION: string;
            static A_X: string;
            static A_Y: string;
            static A_SKEW_X: string;
            static A_SKEW_Y: string;
            static A_SCALE_X: string;
            static A_SCALE_Y: string;
            static A_PIVOT_X: string;
            static A_PIVOT_Y: string;
            static A_ALPHA_OFFSET: string;
            static A_RED_OFFSET: string;
            static A_GREEN_OFFSET: string;
            static A_BLUE_OFFSET: string;
            static A_ALPHA_MULTIPLIER: string;
            static A_RED_MULTIPLIER: string;
            static A_GREEN_MULTIPLIER: string;
            static A_BLUE_MULTIPLIER: string;
        }
        class TransformUtil {
            private static DOUBLE_PI;
            private static _helpMatrix;
            static transformPointWithParent(transform: objects.DBTransform, parent: objects.DBTransform): void;
            static transformToMatrix(transform: objects.DBTransform, matrix: geom.Matrix): void;
            static formatRadian(radian: number): number;
        }
        class DBDataUtil {
            private static _helpTransform1;
            private static _helpTransform2;
            static transformArmatureData(armatureData: objects.ArmatureData): void;
            static transformArmatureDataAnimations(armatureData: objects.ArmatureData): void;
            static transformAnimationData(animationData: objects.AnimationData, armatureData: objects.ArmatureData): void;
            static getTimelineTransform(timeline: objects.TransformTimeline, position: number, retult: objects.DBTransform): void;
            static addHideTimeline(animationData: objects.AnimationData, armatureData: objects.ArmatureData): void;
        }
    }
    /** @private */
    class DBObject {
        public name: string;
        public fixedRotation: boolean;
        public global: objects.DBTransform;
        public origin: objects.DBTransform;
        public offset: objects.DBTransform;
        public tween: objects.DBTransform;
        public parent: Bone;
        public armature: Armature;
        /** @private */
        public _globalTransformMatrix: geom.Matrix;
        /** @private */
        public _isDisplayOnStage: boolean;
        /** @private */
        public _scaleType: number;
        /** @private */
        public _isColorChanged: boolean;
        /** @private */
        public _visible: boolean;
        public getVisible(): boolean;
        public setVisible(value: boolean): void;
        /** @private */
        public _setParent(value: Bone): void;
        /** @private */
        public _setArmature(value: Armature): void;
        constructor();
        public dispose(): void;
        /** @private */
        public _update(): void;
    }
    class Slot extends DBObject {
        /** @private */
        public _dislayDataList: objects.DisplayData[];
        /** @private */
        public _displayBridge: display.IDisplayBridge;
        /** @private */
        public _isDisplayOnStage: boolean;
        /** @private */
        public _originZOrder: number;
        /** @private */
        public _tweenZorder: number;
        private _isHideDisplay;
        private _offsetZOrder;
        private _displayIndex;
        public _blendMode: string;
        public getZOrder(): number;
        public setZOrder(value: number): void;
        public getDisplay(): any;
        public setDisplay(value: any): void;
        public getBlendMode(): string;
        public setBlendMode(value: string): void;
        public getChildArmature(): Armature;
        public setChildArmature(value: Armature): void;
        /** @private */
        public _displayList: any[];
        public getDisplayList(): any[];
        public setDisplayList(value: any[]): void;
        private _setDisplay(display);
        /** @private */
        public _changeDisplay(displayIndex: number): void;
        public setVisible(value: boolean): void;
        /** @private */
        public _setArmature(value: Armature): void;
        constructor(displayBrideg: display.IDisplayBridge);
        public dispose(): void;
        /** @private */
        public _update(): void;
        /** @private */
        public _updateVisible(value: boolean): void;
        private updateChildArmatureAnimation();
    }
    class Bone extends DBObject {
        private static _soundManager;
        public scaleMode: number;
        public displayController: string;
        public slot: Slot;
        /** @private */
        public _tweenPivot: geom.Point;
        private _children;
        public setVisible(value: boolean): void;
        /** @private */
        public _setArmature(value: Armature): void;
        constructor();
        public dispose(): void;
        public contains(child: DBObject): boolean;
        public addChild(child: DBObject): void;
        public removeChild(child: DBObject): void;
        public getSlots(): Slot[];
        /** @private */
        public _arriveAtFrame(frame: objects.Frame, timelineState: animation.TimelineState, animationState: animation.AnimationState, isCross: boolean): void;
        /** @private */
        public _updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number, isColorChanged: boolean): void;
    }
    class Armature extends events.EventDispatcher implements animation.IAnimatable {
        private static _soundManager;
        public name: string;
        public animation: animation.Animation;
        /** @private */
        public _slotsZOrderChanged: boolean;
        /** @private */
        public _slotList: Slot[];
        /** @private */
        public _boneList: Bone[];
        /** @private */
        public _eventList: events.Event[];
        private _display;
        public getDisplay(): any;
        constructor(display: any);
        public dispose(): void;
        public advanceTime(passedTime: number): void;
        public getSlots(returnCopy?: boolean): Slot[];
        public getBones(returnCopy?: boolean): Bone[];
        public getSlot(slotName: string): Slot;
        public getSlotByDisplay(display: Object): Slot;
        public removeSlot(slot: Slot): void;
        public removeSlotByName(slotName: string): void;
        public getBone(boneName: string): Bone;
        public getBoneByDisplay(display: Object): Bone;
        public removeBone(bone: Bone): void;
        public removeBoneByName(boneName: string): void;
        public addChild(object: DBObject, parentName: string): void;
        public updateSlotsZOrder(): void;
        /** @private */
        public _addDBObject(object: DBObject): void;
        /** @private */
        public _removeDBObject(object: DBObject): void;
        /** @private */
        public _sortBoneList(): void;
        /** @private */
        public _arriveAtFrame(frame: objects.Frame, timelineState: animation.TimelineState, animationState: animation.AnimationState, isCross: boolean): void;
        private sortSlot(slot1, slot2);
        private sortBone(object1, object2);
    }
}
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
declare module dragonBones {
    module display {
        class DragonBonesEgretBridge implements IDisplayBridge {
            private static RADIAN_TO_ANGLE;
            private _display;
            public getVisible(): boolean;
            public setVisible(value: boolean): void;
            public getDisplay(): any;
            public setDisplay(value: any): void;
            constructor();
            public dispose(): void;
            public updateTransform(matrix: geom.Matrix, transform: objects.DBTransform): void;
            public updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number): void;
            public updateBlendMode(blendMode: string): void;
            public addDisplay(container: any, index: number): void;
            public removeDisplay(): void;
        }
    }
    module textures {
        class EgretTextureAtlas implements ITextureAtlas {
            public texture: any;
            public name: string;
            public scale: number;
            public spriteSheet: ns_egret.SpriteSheet;
            constructor(texture: any, textureAtlasRawData: any, scale?: number);
            public dispose(): void;
            public getRegion(subTextureName: string): geom.Rectangle;
            private parseData(textureAtlasRawData);
        }
    }
    module factorys {
        class EgretFactory extends BaseFactory {
            constructor();
            /** @private */
            public _generateArmature(): Armature;
            /** @private */
            public _generateSlot(): Slot;
            /** @private */
            public _generateDisplay(textureAtlas: textures.EgretTextureAtlas, fullName: string, pivotX: number, pivotY: number): any;
        }
    }
}
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
declare module ns_egret {
    class Direction {
        static CENTER: string;
        static LEFT: string;
        static RIGHT: string;
        static TOP: string;
        static BOTTOM: string;
        static BOTH: string;
        static HORIZONTAL: string;
        static VERTICAL: string;
    }
}
declare module ns_egret {
    class DynamicBitmap extends Bitmap {
        private _src;
        private _onLoadComplete;
        private _onLoadCompleteThisObj;
        private _resource;
        static create(src: string, onLoadComplete?: Function, onLoadCompleteThisObj?: any): DynamicBitmap;
        public startLoad(src: any, onLoadComplete: any, onLoadCompleteThisObj: any): void;
        private resourceLoadComplete();
        public _measureBounds(): Rectangle;
    }
}
declare module ns_egret {
    class ProgressBar extends DisplayObjectContainer {
        private _bg;
        private _bar;
        private _barWidth;
        private _percentage;
        /**
        * 百分比  0 - 100
        * @returns {*}
        */
        public percentage : number;
        constructor(barTextureName: string, bgTextureName?: string);
        public setOffset(x: number, y: number): void;
        public setProgress(current: number, total: number): void;
    }
}
declare module ns_egret {
    /**
    * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
    */
    class ScrollView extends DisplayObjectContainer {
        public _container: any;
        public _viewWidth: number;
        public _viewHeight: number;
        public _initWidth: number;
        public _initHeight: number;
        private _isMoved;
        private _initX;
        private _initY;
        private _downPX;
        private _downPY;
        public _endX: number;
        public _endY: number;
        private _deltaTime;
        private _downTime;
        public direction: string;
        constructor();
        /**
        * 加入到舞台，加入触摸事件
        * @private
        */
        public _onAddToStage(): void;
        /**
        * 从 舞台删除，删除触摸事件
        * @private
        */
        public _onRemoveFromStage(): void;
        public width : number;
        public height : number;
        /**
        * 设置 显示容器
        * @param container
        * @param initWidth
        * @param initHeight
        */
        public setContainer(container: any, initWidth: any, initHeight: any): void;
        private mouseDown(event);
        private mouseUp(event);
        private mouseMove(event);
        /**
        * 显示对象 回到应在的位置
        */
        public _backToPosition(): void;
        public moveList(): void;
        /**
        * 增加监听
        */
        private addListeners();
        /**
        * 删除监听
        */
        private removeListeners();
    }
}
declare module ns_egret {
    /**
    * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
    */
    class SimpleButton extends DisplayObjectContainer {
        private _frames;
        private _frameRes;
        private _currentFrame;
        private _scale;
        private _isMoved;
        private _startX;
        private _startY;
        private _initScaleX;
        private _initScaleY;
        private _canScale;
        private _frameNumber;
        private _textField;
        constructor();
        public hitTest(x: any, y: any): any;
        /**
        * 加入到舞台，加入触摸事件
        * @private
        */
        public _onAddToStage(): void;
        /**
        * 从 舞台删除，删除触摸事件
        * @private
        */
        public _onRemoveFromStage(): void;
        private addListeners();
        private removeListeners();
        private mouseDown(event);
        private mouseUp();
        private mouseMove(event);
        private _callBack;
        private _target;
        public addOnClick(call: any, target: any): void;
        private onClick();
        /**
        * 设置 按钮是否可以点击
        * @param enabled
        */
        public setEnabled(enabled: any): void;
        public useZoomOut(use: any): void;
        /**
        * 设置 按钮文本
        * @param textfield
        */
        public initFontTextField(textfield: any): void;
        /**
        * 设置 按钮文字
        * @param font 按钮文字
        */
        public setFontText(text: any, size?: number): void;
        /**
        * 设置 按钮文字颜色
        * @param color 按钮文字颜色
        */
        public setFontColor(color: any): void;
        public setChoose(choose: any): void;
        private playZoomOut(isOut);
        public initFrameRes(res: string, frame: number, item: Bitmap): void;
        public changeBtn(res: string): void;
        public setFrameNumber(res: string, number: any): void;
        private isInFrames(tag);
        private setFrameChild(frame, idx?);
        private getFrameChild(frame);
        private getIndexRes(tmpRes, count, indexStr);
    }
}
declare module ns_egret {
    /**
    * tab
    */
    class TabView extends DisplayObjectContainer {
        private _callArr;
        private _currentTag;
        constructor();
        public init(): void;
        public chooseIdx(idx: any): void;
        public setDefaultTag(tag: any): void;
        private _callBack;
        private _target;
        public addOnClick(call: any, target: any): void;
        private onClick(tagIdx);
        public useZoomOut(use: any): void;
        public getCurrentTag(): number;
    }
}
declare module ns_egret {
    /**
    * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
    */
    class TableView extends ScrollView {
        private disappearContainer;
        private _itemArr;
        private _dataArr;
        private _delegate;
        private _currentIndex;
        private _itemWidth;
        private _itemHeight;
        constructor();
        public reloadData(dataArr: any[]): void;
        public showAnimation(): void;
        public hideAnimation(): void;
        public setList(dataArr: any[], direction: any, delegate: any, width: number, height: number): void;
        private initItemList();
        private getCurrent();
        public moveList(): void;
        private initItem(item, dataIdx);
    }
}
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
declare module ns_egret {
    class TMX {
        static TILE_HORIZONTAL_FLAG: number;
        static TILE_VERTICAL_FLAG: number;
        static TILE_DIAGONAL_FLAG: number;
        static TILE_FLIPPED_ALL: number;
        static TILE_FLIPPED_MASK: number;
        static LAYER_ATTRIB_NONE: number;
        static LAYER_ATTRIB_BASE64: number;
        static LAYER_ATTRIB_GZIP: number;
        static LAYER_ATTRIB_ZLIB: number;
        static PROPERTY_NONE: number;
        static PROPERTY_MAP: number;
        static PROPERTY_LAYER: number;
        static PROPERTY_OBJECTGROUP: number;
        static PROPERTY_OBJECT: number;
        static PROPERTY_TILE: number;
        static ORIENTATION_ORTHO: number;
        static ORIENTATION_HEX: number;
        static ORIENTATION_ISO: number;
    }
}
declare module ns_egret {
    class TMXMapInfo {
        private _orientation;
        private _mapWidth;
        private _mapHeight;
        private _tileWidth;
        private _tileHeight;
        private _layers;
        private _tileSets;
        private _objectGroups;
        private _parentGID;
        private _storingCharacters;
        private _properties;
        private _TMXFileName;
        private _currentString;
        private _tileProperties;
        static createWithFile(tmxFile: string): TMXMapInfo;
        public initWithTMXFile(tmxFile: any): void;
        private internalInit(tmxFileName);
        private parseXMLFile(tmxFile);
        private parsePointsString(pointsString);
        public getOrientation(): any;
        public setOrientation(value: any): void;
        public getProperties(): any[];
        public setProperties(value: any): void;
        public getTilesets(): TMXTilesetInfo[];
        public setTilesets(value: TMXTilesetInfo): void;
        public getParentGID(): number;
        public setParentGID(value: any): void;
        public getLayers(): TMXLayerInfo[];
        public setLayers(value: TMXLayerInfo): void;
        public getObjectGroups(): any[];
        public setObjectGroups(value: any): void;
        public getTileProperties(): any[];
        public setTileProperties(value: any): void;
        public getTileWidth(): number;
        public getTileHeight(): number;
        public getMapWidth(): number;
        public getMapHeight(): number;
    }
    class TMXTilesetInfo {
        public name: string;
        public firstGid: any;
        public spacing: number;
        public margin: any;
        public tileWidth: number;
        public tileHeight: number;
        public sourceImage: string;
        public imageWidth: number;
        public imageHeight: number;
        public rectForGID(gid: any): Point;
    }
    class TMXObjectGroup {
        private _groupName;
        private _positionOffsetX;
        private _positionOffsetY;
        private _properties;
        private _objects;
        public getGroupName(): string;
        public setGroupName(value: string): void;
        public getPositionOffsetX(): number;
        public setPositionOffsetX(value: any): void;
        public getPositionOffsetY(): number;
        public setPositionOffsetY(value: any): void;
        public getProperties(): any[];
        public setProperties(value: any): void;
        public getObjects(): any[];
        public addObject(value: any): void;
    }
    class TMXLayerInfo {
        public name: string;
        public layerWidth: number;
        public layerHeight: number;
        public visible: boolean;
        public opacity: number;
        public _tiles: any;
        public layerX: number;
        public layerY: number;
        public ownTiles: any;
        public _minGID: number;
        public _maxGID: number;
        private _properties;
        public getProperties(): any;
        public setProperties(value: any): void;
    }
}
declare module ns_egret {
    class TMXLayer extends DisplayObjectContainer {
        private _texture;
        private _layerWidth;
        private _layerHeight;
        private _mapTileWidth;
        private _mapTileHeight;
        private _tiles;
        private _tileSet;
        private _layerOrientation;
        private _properties;
        private _layerName;
        private _opacity;
        private _minGID;
        private _maxGID;
        static create(tilesetInfo: TMXTilesetInfo, layerInfo: TMXLayerInfo, mapInfo: TMXMapInfo): TMXLayer;
        public initWithTilesetInfo(tilesetInfo: TMXTilesetInfo, layerInfo: TMXLayerInfo, mapInfo: TMXMapInfo): void;
        private calculateLayerOffset(x, y);
        public setupTiles(): void;
        private appendTileForGID(gid, x, y);
        private reusedTileWithRect(rect);
        private setupTileSprite(sprite, x, y, gid);
        public getPositionAt(x: number, y: number): Point;
        private positionForIsoAt(x, y);
        private positionForOrthoAt(x, y);
        private positionForHexAt(x, y);
        /**
        * 通过坐标获取GID
        */
        public getTileGIDAt(x: any, y: any): number;
        public getProperties(): any;
        public setProperties(value: any): void;
        public getProperty(propertyName: any): any;
        public getLayerName(): string;
    }
}
declare module ns_egret {
    class TMXTiledMap extends DisplayObjectContainer {
        public mapInfo: TMXMapInfo;
        public viewPortWidth: number;
        static createWithFile(tmxFile: string): TMXTiledMap;
        public initWithTMXFile(tmxFile: string): void;
        private buildWithMapInfo(mapInfo);
        private parseLayer(layerInfo, mapInfo);
        private tilesetForLayer(layerInfo, mapInfo);
        public getLayer(layerName: string): TMXLayer;
        public getObjectGroup(groupName: string): any;
        public propertiesForGID(value: any): any;
        public getProperty(propertyName: any): any;
        public setMoveX(x: number): void;
    }
}
