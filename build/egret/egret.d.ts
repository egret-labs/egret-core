/**
 * @language en_US
 * Is debug mode.
 * @version Egret 2.5
 * @platform Web,Native
 */
/**
 * @language zh_CN
 * 是否为 debug 模式。
 * @version Egret 2.5
 * @platform Web,Native
 */
declare let DEBUG: boolean;
/**
 * @language en_US
 * Is release mode.
 * @version Egret 2.5
 * @platform Web,Native
 */
/**
 * @language zh_CN
 * 是否为 release 模式。
 * @version Egret 2.5
 * @platform Web,Native
 */
declare let RELEASE: boolean;
declare namespace egret {
    function $error(code: number, ...params: any[]): void;
    function $warn(code: number, ...params: any[]): void;
    function getString(code: number, ...params: any[]): string;
    function $markReadOnly(instance: any, property: string, isProperty?: boolean): void;
    function $markCannotUse(instance: any, property: string, defaultVale: any): void;
}
declare namespace egret {
    /**
     * @language en_US
     * Registers the runtime class information for a class.This method adds some strings which represent the class name or
     * some interface names to the class definition. After the registration,you can use egret.is() method to do the type checking
     * for the instance of this class.<br/>
     * Note:If you use the TypeScript programming language, the egret command line tool will automatically generate the registration code line.
     * You don't need to manually call this method.
     *
     * @example the following code shows how to register the runtime class information for the EventDispatcher class and do the type checking:
     * <pre>
     *      egret.registerClass(egret.EventDispatcher,"egret.EventDispatcher",["egret.IEventDispatcher"]);
     *      let dispatcher = new egret.EventDispatcher();
     *      egret.log(egret.is(dispatcher, "egret.IEventDispatcher"));  //true。
     *      egret.log(egret.is(dispatcher, "egret.EventDispatcher"));   //true。
     *      egret.log(egret.is(dispatcher, "egret.Bitmap"));   //false。
     * </pre>
     * @param classDefinition the class definition to be registered.
     * @param className  a unique identification string of the specific class
     * @param interfaceNames a list of unique identification string of the specific interfaces.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 为一个类定义注册运行时类信息,用此方法往类定义上注册它自身以及所有接口对应的字符串。
     * 在运行时，这个类的实例将可以使用 egret.is() 方法传入一个字符串来判断实例类型。
     * @example 以下代码演示了如何为EventDispatcher类注册运行时类信息并判断类型：
     * <pre>
     *      //为egret.EventDispatcher类注册运行时类信息，由于它实现了IEventDispatcher接口，这里应同时传入接口名对应的字符串。
     *      egret.registerClass(egret.EventDispatcher,"egret.EventDispatcher",["egret.IEventDispatcher"]);
     *      let dispatcher = new egret.EventDispatcher();
     *      egret.log(egret.is(dispatcher, "egret.IEventDispatcher"));  //true。
     *      egret.log(egret.is(dispatcher, "egret.EventDispatcher"));   //true。
     *      egret.log(egret.is(dispatcher, "egret.Bitmap"));   //false。
     * </pre>
     * 注意：若您使用 TypeScript 来编写程序，egret 命令行会自动帮您生成类信息注册代码行到最终的 Javascript 文件中。因此您不需要手动调用此方法。
     *
     * @param classDefinition 要注册的类定义。
     * @param className 要注册的类名。
     * @param interfaceNames 要注册的类所实现的接口名列表。
     * @version Egret 2.4
     * @platform Web,Native
     */
    function registerClass(classDefinition: any, className: string, interfaceNames?: string[]): void;
}
declare function __extends(d: any, b: any): void;
declare let __define: any;
declare namespace egret {
    /**
     * @language en_US
     * The HashObject class is the base class for all objects in the Egret framework.The HashObject
     * class includes a hashCode property, which is a unique identification number of the instance.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface IHashObject {
        /**
         * @language en_US
         * a unique identification number assigned to this instance.
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        /**
         * @language zh_CN
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        hashCode: number;
    }
    /**
     * @private
     * 哈希计数
     */
    let $hashCount: number;
    /**
     * @language en_US
     * The HashObject class is the base class for all objects in the Egret framework.The HashObject
     * class includes a hashCode property, which is a unique identification number of the instance.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
     * @version Egret 2.4
     * @platform Web,Native
     */
    class HashObject implements IHashObject {
        /**
         * @language en_US
         * Initializes a HashObject
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 HashObject 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @private
         */
        $hashCode: number;
        /**
         * @language en_US
         * a unique identification number assigned to this instance.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        hashCode: number;
    }
    /**
     * @private
     */
    interface AsyncCallback {
        onSuccess: (data: any) => any;
        onFail: (error: number, data: any) => any;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The EventDispatcher class is the base class for all classes that dispatchEvent events. The EventDispatcher class implements
     * the IEventDispatcher interface and is the base class for the DisplayObject class. The EventDispatcher class allows
     * any object on the display list to be an event target and as such, to use the methods of the IEventDispatcher interface.
     * Event targets are an important part of the Egret event model. The event target serves as the focal point for how events
     * flow through the display list hierarchy. When an event such as a touch tap, Egret dispatches an event object into the
     * event flow from the root of the display list. The event object then makes its way through the display list until it
     * reaches the event target, at which point it begins its return trip through the display list. This round-trip journey
     * to the event target is conceptually divided into three phases: <br/>
     * the capture phase comprises the journey from the root to the last node before the event target's node, the target
     * phase comprises only the event target node, and the bubbling phase comprises any subsequent nodes encountered on
     * the return trip to the root of the display list. In general, the easiest way for a user-defined class to gain event
     * dispatching capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already extending
     * another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member, and write simple
     * hooks to route calls into the aggregated EventDispatcher.
     * @see egret.IEventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventDispatcher.ts
     */
    /**
     * @language zh_CN
     * EventDispatcher 是 Egret 的事件派发器类，负责进行事件的发送和侦听。
     * 事件目标是事件如何通过显示列表层次结构这一问题的焦点。当发生鼠标单击、触摸或按键等事件时，
     * 框架会将事件对象调度到从显示列表根开始的事件流中。然后该事件对象在显示列表中前进，直到到达事件目标，
     * 然后从这一点开始其在显示列表中的回程。在概念上，到事件目标的此往返行程被划分为三个阶段：
     * 捕获阶段包括从根到事件目标节点之前的最后一个节点的行程，目标阶段仅包括事件目标节点，冒泡阶段包括回程上遇到的任何后续节点到显示列表的根。
     * 通常，使用户定义的类能够调度事件的最简单方法是扩展 EventDispatcher。如果无法扩展（即，如果该类已经扩展了另一个类），则可以实现
     * IEventDispatcher 接口，创建 EventDispatcher 成员，并编写一些简单的映射，将调用连接到聚合的 EventDispatcher 中。
     * @see egret.IEventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventDispatcher.ts
     */
    class EventDispatcher extends HashObject implements IEventDispatcher {
        /**
         * @language en_US
         * create an instance of the EventDispatcher class.
         * @param target The target object for events dispatched to the EventDispatcher object. This parameter is used when
         * the EventDispatcher instance is aggregated by a class that implements IEventDispatcher; it is necessary so that the
         * containing object can be the target for events. Do not use this parameter in simple cases in which a class extends EventDispatcher.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 EventDispatcher 类的实例
         * @param target 此 EventDispatcher 所抛出事件对象的 target 指向。此参数主要用于一个实现了 IEventDispatcher 接口的自定义类，
         * 以便抛出的事件对象的 target 属性可以指向自定义类自身。请勿在直接继承 EventDispatcher 的情况下使用此参数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(target?: IEventDispatcher);
        /**
         * @private
         */
        $EventDispatcher: Object;
        /**
         * @private
         *
         * @param useCapture
         */
        $getEventMap(useCapture?: boolean): any;
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * @private
         */
        $addListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void;
        $insertEventBin(list: any[], type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): boolean;
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        $removeEventBin(list: any[], listener: Function, thisObject: any): boolean;
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        hasEventListener(type: string): boolean;
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        willTrigger(type: string): boolean;
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @private
         */
        $notifyListener(event: Event, capturePhase: boolean): boolean;
        /**
         * @language en_US
         * Distribute a specified event parameters.
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param data {any} data
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 派发一个指定参数的事件。
         * @param type {string} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispatchEventWith(type: string, bubbles?: boolean, data?: any, cancelable?: boolean): boolean;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 事件信息对象
     */
    interface EventBin {
        type: string;
        /**
         * @private
         */
        listener: Function;
        /**
         * @private
         */
        thisObject: any;
        /**
         * @private
         */
        priority: number;
        /**
         * @private
         */
        target: IEventDispatcher;
        /**
         * @private
         */
        useCapture: boolean;
        /**
         * @private
         */
        dispatchOnce: boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * A Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its
     * width and its height.<br/>
     * The x, y, width, and height properties of the Rectangle class are independent of each other; changing the value of
     * one property has no effect on the others. However, the right and bottom properties are integrally related to those
     * four properties. For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Rectangle.ts
     */
    /**
     * @language zh_CN
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。<br/>
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     * 但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width
     * 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Rectangle.ts
     */
    class Rectangle extends HashObject {
        /**
         * @language en_US
         * Releases a rectangle instance to the object pool.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个Rectangle实例到对象池
         * @version Egret 2.4
         * @platform Web,Native
         */
        static release(rect: Rectangle): void;
        /**
         * @language en_US
         * get a rectangle instance from the object pool or create a new one.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的Rectangle对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static create(): Rectangle;
        /**
         * @language en_US
         * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified
         * width and height parameters.
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
         * @language en_US
         * The x coordinate of the top-left corner of the rectangle.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形左上角的 x 坐标。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        x: number;
        /**
         * @language en_US
         * The y coordinate of the top-left corner of the rectangle.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形左上角的 y 坐标。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        y: number;
        /**
         * @language en_US
         * The width of the rectangle, in pixels.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形的宽度（以像素为单位）。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        width: number;
        /**
         * @language en_US
         * 矩形的高度（以像素为单位）。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * The height of the rectangle, in pixels.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        height: number;
        /**
         * @language en_US
         * The sum of the x and width properties.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * x 和 width 属性的和。
         * @version Egret 2.4
         * @platform Web,Native
         */
        right: number;
        /**
         * @language en_US
         * The sum of the y and height properties.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * y 和 height 属性的和。
         * @version Egret 2.4
         * @platform Web,Native
         */
        bottom: number;
        /**
         * @language en_US
         * The x coordinate of the top-left corner of the rectangle. Changing the left property of a Rectangle object has
         * no effect on the y and height properties. However it does affect the width property, whereas changing the x value
         * does not affect the width property.
         * The value of the left property is equal to the value of the x property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形左上角的 x 坐标。更改 Rectangle 对象的 left 属性对 y 和 height 属性没有影响。但是，它会影响 width 属性，而更改 x 值不会影响 width 属性。
         * left 属性的值等于 x 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        left: number;
        /**
         * @language en_US
         * The y coordinate of the top-left corner of the rectangle. Changing the top property of a Rectangle object has
         * no effect on the x and width properties. However it does affect the height property, whereas changing the y
         * value does not affect the height property.<br/>
         * The value of the top property is equal to the value of the y property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形左上角的 y 坐标。更改 Rectangle 对象的 top 属性对 x 和 width 属性没有影响。但是，它会影响 height 属性，而更改 y 值不会影响 height 属性。<br/>
         * top 属性的值等于 y 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        top: number;
        /**
         * @language en_US
         * The location of the Rectangle object's top-left corner, determined by the x and y coordinates of the point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        topLeft: Point;
        /**
         * @language en_US
         * The location of the Rectangle object's bottom-right corner, determined by the values of the right and bottom properties.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        bottomRight: Point;
        /**
         * @language en_US
         * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
         * @param sourceRect The Rectangle object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将源 Rectangle 对象中的所有矩形数据复制到调用方 Rectangle 对象中。
         * @param sourceRect 要从中复制数据的 Rectangle 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        copyFrom(sourceRect: Rectangle): Rectangle;
        /**
         * @language en_US
         * Sets the members of Rectangle to the specified values
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Rectangle 的成员设置为指定值
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        setTo(x: number, y: number, width: number, height: number): Rectangle;
        /**
         * @language en_US
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         * @param x The x coordinate (horizontal position) of the point.
         * @param y The y coordinate (vertical position) of the point.
         * @returns A value of true if the Rectangle object contains the specified point; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * @param x 检测点的x轴
         * @param y 检测点的y轴
         * @returns 如果检测点位于矩形内，返回true，否则，返回false
         * @version Egret 2.4
         * @platform Web,Native
         */
        contains(x: number, y: number): boolean;
        /**
         * @language en_US
         * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns
         * the area of intersection as a Rectangle object. If the rectangles do not intersect, this method returns an empty
         * Rectangle object with its properties set to 0.
         * @param toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
         * @returns A Rectangle object that equals the area of intersection. If the rectangles do not intersect, this method
         * returns an empty Rectangle object; that is, a rectangle with its x, y, width, and height properties set to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果在 toIntersect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。如果矩形不相交，
         * 则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
         * @param toIntersect 要对照比较以查看其是否与此 Rectangle 对象相交的 Rectangle 对象。
         * @returns 等于交集区域的 Rectangle 对象。如果该矩形不相交，则此方法返回一个空的 Rectangle 对象；即，其 x、y、width 和
         * height 属性均设置为 0 的矩形。
         * @version Egret 2.4
         * @platform Web,Native
         */
        intersection(toIntersect: Rectangle): Rectangle;
        /**
         * @language en_US
         * Increases the size of the Rectangle object by the specified amounts, in pixels.
         * The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
         * @param dx The value to be added to the left and the right of the Rectangle object.
         * @param dy The value to be added to the top and the bottom of the Rectangle.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 按指定量增加 Rectangle 对象的大小（以像素为单位）
         * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
         * @param dx Rectangle 对象横向增加的值。
         * @param dy Rectangle 对象纵向增加的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        inflate(dx: number, dy: number): void;
        /**
         * @private
         */
        $intersectInPlace(clipRect: Rectangle): Rectangle;
        /**
         * @language en_US
         * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object.
         * This method checks the x, y, width, and height properties of the specified Rectangle object to see if it
         * intersects with this Rectangle object.
         * @param toIntersect The Rectangle object to compare against this Rectangle object.
         * @returns A value of true if the specified object intersects with this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle
         * 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
         * @param toIntersect 要与此 Rectangle 对象比较的 Rectangle 对象。
         * @returns 如果两个矩形相交，返回true，否则返回false
         * @version Egret 2.4
         * @platform Web,Native
         */
        intersects(toIntersect: Rectangle): boolean;
        /**
         * @language en_US
         * Determines whether or not this Rectangle object is empty.
         * @returns A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定此 Rectangle 对象是否为空。
         * @returns 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        isEmpty(): boolean;
        /**
         * @language en_US
         * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Rectangle 对象的所有属性设置为 0。
         * @version Egret 2.4
         * @platform Web,Native
         */
        setEmpty(): void;
        /**
         * @language en_US
         * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
         * @returns A new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回一个新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
         * @returns 新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
         * @version Egret 2.4
         * @platform Web,Native
         */
        clone(): Rectangle;
        /**
         * @language en_US
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         * This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
         * @param point The point, as represented by its x and y coordinates.
         * @returns A value of true if the Rectangle object contains the specified point; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point 包含点对象
         * @returns 如果包含，返回true，否则返回false
         * @version Egret 2.4
         * @platform Web,Native
         */
        containsPoint(point: Point): boolean;
        /**
         * @language en_US
         * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
         * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
         * @param rect The Rectangle object being checked.
         * @returns A value of true if the Rectangle object that you specify is contained by this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。
         * 如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
         * @param rect 所检查的 Rectangle 对象
         * @returns 如果此 Rectangle 对象包含您指定的 Rectangle 对象，则返回 true 值，否则返回 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        containsRect(rect: egret.Rectangle): boolean;
        /**
         * @language en_US
         * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.
         * This method compares the x, y, width, and height properties of an object against the same properties of this Rectangle object.
         * @param The rectangle to compare to this Rectangle object.
         * @returns A value of true if the object has exactly the same values for the x, y, width, and height properties as this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定在 toCompare 参数中指定的对象是否等于此 Rectangle 对象。
         * 此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
         * @param toCompare 要与此 Rectangle 对象进行比较的矩形。
         * @returns 如果对象具有与此 Rectangle 对象完全相同的 x、y、width 和 height 属性值，则返回 true 值，否则返回 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        equals(toCompare: Rectangle): boolean;
        /**
         * @language en_US
         * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
         * @param point 此 Point 对象的 x 属性用于增加 Rectangle 对象的水平尺寸。y 属性用于增加 Rectangle 对象的垂直尺寸。
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 增加 Rectangle 对象的大小。此方法与 Rectangle.inflate() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        inflatePoint(point: Point): void;
        /**
         * @language en_US
         * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
         * @param dx Moves the x value of the Rectangle object by this amount.
         * @param dy Moves the y value of the Rectangle object by this amount.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
         * @param dx 将 Rectangle 对象的 x 值移动此数量。
         * @param dy 将 Rectangle 对象的 t 值移动此数量。
         * @version Egret 2.4
         * @platform Web,Native
         */
        offset(dx: number, dy: number): void;
        /**
         * @language en_US
         * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
         * @param point A Point object to use to offset this Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Point 对象用作参数来调整 Rectangle 对象的位置。此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point 要用于偏移此 Rectangle 对象的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        offsetPoint(point: Point): void;
        /**
         * @language en_US
         * Builds and returns a string that lists the horizontal and vertical positions and the width and height of the Rectangle object.
         * @returns A string listing the value of each of the following properties of the Rectangle object: x, y, width, and height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。
         * @returns 一个字符串，它列出了 Rectangle 对象的下列各个属性的值：x、y、width 和 height。
         * @version Egret 2.4
         * @platform Web,Native
         */
        toString(): string;
        /**
         * @language en_US
         * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
         * @param toUnion A Rectangle object to add to this Rectangle object.
         * @returns A new Rectangle object that is the union of the two rectangles.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
         * @param toUnion 要添加到此 Rectangle 对象的 Rectangle 对象。
         * @returns 充当两个矩形的联合的新 Rectangle 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        union(toUnion: Rectangle): Rectangle;
        /**
         * @private
         */
        $getBaseWidth(angle: number): number;
        /**
         * @private
         */
        $getBaseHeight(angle: number): number;
    }
    /**
     * @private
     * 仅供框架内复用，要防止暴露引用到外部。
     */
    let $TempRectangle: Rectangle;
}
declare namespace egret.sys {
    /**
     * @private
     * 显示对象失效标志
     */
    const enum DisplayObjectFlags {
        /**
         * @private
         * 显示对象自身的绘制区域尺寸失效
         */
        InvalidContentBounds = 2,
        /**
         * @private
         * 显示对象的矩形区域尺寸失效，包括自身绘制区域和子项的区域集合
         */
        InvalidBounds = 4,
        /**
         * @private
         * 显示对象的matrix属性失效标志，通常因为scaleX，width等属性发生改变。
         */
        InvalidMatrix = 8,
        /**
         * @private
         * 显示对象祖代的矩阵失效。
         */
        InvalidConcatenatedMatrix = 16,
        /**
         * @private
         * 显示对象祖代的逆矩阵失效。
         */
        InvalidInvertedConcatenatedMatrix = 32,
        /**
         * @private
         * 显示对象祖代的透明度属性失效。
         */
        InvalidConcatenatedAlpha = 64,
        /**
         * @private
         * DrawData失效,需要重新出发render方法.
         */
        InvalidRenderNodes = 128,
        /**
         * @private
         * 显示对象自身需要重绘的标志
         */
        DirtyRender = 256,
        /**
         * @private
         * 子项中已经全部含有DirtyRender标志，无需继续遍历。
         */
        DirtyChildren = 512,
        /**
         * @private
         * DirtyRender|DirtyChildren
         */
        Dirty = 768,
        /**
         * @private
         * 显示对象祖代的是否可见属性失效。
         */
        InvalidConcatenatedVisible = 1024,
        /**
         * @private
         * 添加或删除子项时，需要向子项传递的标志。
         */
        DownOnAddedOrRemoved = 1648,
        /**
         * @private
         * 显示对象初始化时的标志量
         */
        InitFlags = 2032,
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The DisplayObject class is the base class for all objects that can be placed on the display list. The display list
     * manages all objects displayed in the runtime. Use the DisplayObjectContainer class to arrange the display
     * objects in the display list. DisplayObjectContainer objects can have child display objects, while other display objects,
     * such as Shape and TextField objects, are "leaf" nodes that have only parents and siblings, no children.
     * The DisplayObject class supports basic functionality like the x and y position of an object, as well as more advanced
     * properties of the object such as its transformation matrix.<br/>
     * The DisplayObject class contains several broadcast events.Normally, the target of any particular event is a specific
     * DisplayObject instance. For example, the target of an added event is the specific DisplayObject instance that was added
     * to the display list. Having a single target restricts the placement of event listeners to that target and in some cases
     * the target's ancestors on the display list. With broadcast events, however, the target is not a specific DisplayObject
     * instance, but rather all DisplayObject instances, including those that are not on the display list. This means that you
     * can add a listener to any DisplayObject instance to listen for broadcast events.
     *
     * @event egret.Event.ADDED Dispatched when a display object is added to the display list.
     * @event egret.Event.ADDED_TO_STAGE Dispatched when a display object is added to the on stage display list, either directly or through the addition of a sub tree in which the display object is contained.
     * @event egret.Event.REMOVED Dispatched when a display object is about to be removed from the display list.
     * @event egret.Event.REMOVED_FROM_STAGE Dispatched when a display object is about to be removed from the display list, either directly or through the removal of a sub tree in which the display object is contained.
     * @event egret.Event.ENTER_FRAME [broadcast event] Dispatched when the playhead is entering a new frame.
     * @event egret.Event.RENDER [broadcast event] Dispatched when the display list is about to be updated and rendered.
     * @event egret.TouchEvent.TOUCH_MOVE Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
     * @event egret.TouchEvent.TOUCH_BEGIN Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_END Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_TAP Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display object on a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_RELEASE_OUTSIDE Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display object on a mobile phone or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObject.ts
     */
    /**
     * @language zh_CN
     * DisplayObject 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时中显示的所有对象。使用 DisplayObjectContainer 类排列
     * 显示列表中的显示对象。DisplayObjectContainer 对象可以有子显示对象，而其他显示对象（如 Shape 和 TextField 对象）是“叶”节点，没有子项，只有父级和
     * 同级。DisplayObject 类有一些基本的属性（如确定坐标位置的 x 和 y 属性），也有一些高级的对象属性（如 Matrix 矩阵变换）。<br/>
     * DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。例如，added 事件的目标是已添加到显示列表
     * 的目标 DisplayObject 实例。若只有一个目标，则会将事件侦听器限制为只能监听在该目标上（在某些情况下，可监听在显示列表中该目标的祖代上）。
     * 但是对于广播事件，目标不是特定的 DisplayObject 实例，而是所有 DisplayObject 实例（包括那些不在显示列表中的实例）。这意味着您可以向任何
     * DisplayObject 实例添加侦听器来侦听广播事件。
     *
     * @event egret.Event.ADDED 将显示对象添加到显示列表中时调度。
     * @event egret.Event.ADDED_TO_STAGE 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
     * @event egret.Event.REMOVED 将要从显示列表中删除显示对象时调度。
     * @event egret.Event.REMOVED_FROM_STAGE 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
     * @event egret.Event.ENTER_FRAME [广播事件] 播放头进入新帧时调度。
     * @event egret.Event.RENDER [广播事件] 将要更新和呈现显示列表时调度。
     * @event egret.TouchEvent.TOUCH_MOVE 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。
     * @event egret.TouchEvent.TOUCH_BEGIN 当用户第一次触摸启用触摸的设备时（例如，用手指触摸配有触摸屏的移动电话或平板电脑）调度。
     * @event egret.TouchEvent.TOUCH_END 当用户移除与启用触摸的设备的接触时（例如，将手指从配有触摸屏的移动电话或平板电脑上抬起）调度。
     * @event egret.TouchEvent.TOUCH_TAP 当用户在启用触摸设备上的已启动接触的同一 DisplayObject 实例上抬起接触点时（例如，在配有触摸屏的移动电话或平板电脑的显示对象上的某一点处按下并释放手指）调度。
     * @event egret.TouchEvent.TOUCH_RELEASE_OUTSIDE 当用户在启用触摸设备上的已启动接触的不同 DisplayObject 实例上抬起接触点时（例如，在配有触摸屏的移动电话或平板电脑的显示对象上的某一点处按下并释放手指）调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObject.ts
     */
    class DisplayObject extends EventDispatcher implements sys.Renderable {
        /**
         * @language en_US
         * Initializes a DisplayObject object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个显示对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @private
         */
        $DisplayObject: Object;
        /**
         * @private
         */
        $displayFlags: number;
        /**
         * @private
         * 添加一个标志量
         */
        $setFlags(flags: number): void;
        /**
         * @private
         * 移除一个标志量
         */
        $removeFlags(flags: number): void;
        /**
         * @private
         * 沿着显示列表向上移除标志量，如果标志量没被设置过就停止移除。
         */
        $removeFlagsUp(flags: number): void;
        /**
         * @private
         * 是否含有指定的所有标志量
         */
        $hasFlags(flags: number): boolean;
        /**
         * @private
         * 沿着显示列表向上传递标志量，如果标志量已经被设置过就停止传递。
         */
        $propagateFlagsUp(flags: number): void;
        /**
         * @private
         * 沿着显示列表向下传递标志量，非容器直接设置自身的flag，此方法会在 DisplayObjectContainer 中被覆盖。
         */
        $propagateFlagsDown(flags: number, cachedBreak?: boolean): void;
        /**
         * @private
         * 是否含有多个标志量其中之一。
         */
        $hasAnyFlags(flags: number): boolean;
        /**
         * @private
         * 是否添加到舞台上，防止重复发送 removed_from_stage 消息
         */
        $hasAddToStage: boolean;
        /**
         * @private
         * 标记矩阵失效
         */
        $invalidateMatrix(): void;
        /**
         * @private
         * 标记这个显示对象在父级容器的位置发生了改变。
         */
        $invalidatePosition(): void;
        /**
         * @private
         * 能够含有子项的类将子项列表存储在这个属性里。
         */
        $children: DisplayObject[];
        /**
         * @language en_US
         * Indicates the instance name of the DisplayObject. The object can be identified in the child list of its parent
         * display object container by calling the getChildByName() method of the display object container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 DisplayObject 的实例名称。
         * 通过调用父显示对象容器的 getChildByName() 方法，可以在父显示对象容器的子列表中标识该对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        name: string;
        /**
         * @private
         */
        $parent: DisplayObjectContainer;
        /**
         * @language en_US
         * Indicates the DisplayObjectContainer object that contains this display object. Use the parent property to specify
         * a relative path to display objects that are above the current display object in the display list hierarchy.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示包含此显示对象的 DisplayObjectContainer 对象。
         * 使用 parent 属性可以指定高于显示列表层次结构中当前显示对象的显示对象的相对路径。
         * @version Egret 2.4
         * @platform Web,Native
         */
        parent: DisplayObjectContainer;
        /**
         * @private
         * 设置父级显示对象
         */
        $setParent(parent: DisplayObjectContainer): boolean;
        /**
         * @private
         * 显示对象添加到舞台
         */
        $onAddToStage(stage: Stage, nestLevel: number): void;
        /**
         * @private
         * 显示对象从舞台移除
         */
        $onRemoveFromStage(): void;
        /**
         * @private
         */
        $stage: Stage;
        /**
         * @private
         * 这个对象在显示列表中的嵌套深度，舞台为1，它的子项为2，子项的子项为3，以此类推。当对象不在显示列表中时此属性值为0.
         */
        $nestLevel: number;
        /**
         * @language en_US
         * The Stage of the display object. you can create and load multiple display objects into the display list, and
         * the stage property of each display object refers to the same Stage object.<br/>
         * If a display object is not added to the display list, its stage property is set to null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 显示对象的舞台。
         * 例如，您可以创建多个显示对象并加载到显示列表中，每个显示对象的 stage 属性是指向相同的 Stage 对象。<br/>
         * 如果显示对象未添加到显示列表，则其 stage 属性会设置为 null。
         * @version Egret 2.4
         * @platform Web,Native
         */
        stage: Stage;
        /**
         * @language en_US
         * A Matrix object containing values that alter the scaling, rotation, and translation of the display object.<br/>
         * Note: to change the value of a display object's matrix, you must make a copy of the entire matrix object, then copy
         * the new object into the matrix property of the display object.
         * @example the following code increases the tx value of a display object's matrix
         * <pre>
         *     let myMatrix:Matrix = myDisplayObject.matrix;
         *     myMatrix.tx += 10;
         *     myDisplayObject.matrix = myMatrix;
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个 Matrix 对象，其中包含更改显示对象的缩放、旋转和平移的值。<br/>
         * 注意：要改变一个显示对象矩阵的值，您必引用整个矩阵对象，然后将它重新赋值给显示对象的 matrix 属性。
         * @example 以下代码改变了显示对象矩阵的tx属性值：
         * <pre>
         *     let myMatrix:Matrix = myDisplayObject.matrix;
         *     myMatrix.tx += 10;
         *     myDisplayObject.matrix = myMatrix;
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        matrix: Matrix;
        /**
         * @private
         * 获取矩阵
         */
        $getMatrix(): Matrix;
        /**
         * @private
         * 设置矩阵
         */
        $setMatrix(matrix: Matrix, needUpdateProperties?: boolean): boolean;
        /**
         * @private
         * 获得这个显示对象以及它所有父级对象的连接矩阵。
         */
        $getConcatenatedMatrix(): Matrix;
        /**
         * @private
         * 获取链接矩阵
         */
        $getInvertedConcatenatedMatrix(): Matrix;
        /**
         * @language en_US
         * Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent
         * DisplayObjectContainer.<br/>
         * If the object is inside a DisplayObjectContainer that has transformations, it is in
         * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer
         * rotated 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is
         * rotated 90° counterclockwise. The object's coordinates refer to the registration point position.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。<br/>
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。
         * 因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        x: number;
        /**
         * @private
         * 获取x坐标
         */
        $getX(): number;
        /**
         * @private
         * 设置x坐标
         */
        $setX(value: number): boolean;
        /**
         * @language en_US
         * Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent
         * DisplayObjectContainer. <br/>
         * If the object is inside a DisplayObjectContainer that has transformations, it is in
         * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer rotated
         * 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is rotated 90°
         * counterclockwise. The object's coordinates refer to the registration point position.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。<br/>
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。
         * 因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        y: number;
        /**
         * @private
         * 获取y坐标
         */
        $getY(): number;
        /**
         * @private
         * 设置y坐标
         */
        $setY(value: number): boolean;
        /**
         * @language en_US
         * Indicates the horizontal scale (percentage) of the object as applied from the registration point. <br/>
         * The default 1.0 equals 100% scale.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。<br/>
         * 1.0 等于 100% 缩放。
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        scaleX: number;
        /**
         * @private
         *
         * @returns
         */
        $getScaleX(): number;
        /**
         * @private
         * 设置水平缩放值
         */
        $setScaleX(value: number): boolean;
        /**
         * @language en_US
         * Indicates the vertical scale (percentage) of an object as applied from the registration point of the object.
         * 1.0 is 100% scale.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。1.0 是 100% 缩放。
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        scaleY: number;
        /**
         * @private
         *
         * @returns
         */
        $getScaleY(): number;
        /**
         * @private
         * 设置垂直缩放值
         */
        $setScaleY(value: number): boolean;
        /**
         * @language en_US
         * Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation. Values from
         * 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside
         * this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement
         * myDisplayObject.rotation = 450 is the same as myDisplayObject.rotation = 90.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
         * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或
         * 减去 360 获得该范围内的值。例如，myDisplayObject.rotation = 450语句与 myDisplayObject.rotation = 90 是相同的。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        rotation: number;
        /**
         * @private
         *
         * @returns
         */
        $getRotation(): number;
        $setRotation(value: number): boolean;
        /**
         * 表示DisplayObject的x方向斜切
         * @member {number} egret.DisplayObject#skewX
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        skewX: number;
        /**
         * @private
         *
         * @param value
         */
        $setSkewX(value: number): boolean;
        /**
         * 表示DisplayObject的y方向斜切
         * @member {number} egret.DisplayObject#skewY
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        skewY: number;
        /**
         * @private
         *
         * @param value
         */
        $setSkewY(value: number): boolean;
        /**
         * @language en_US
         * Indicates the width of the display object, in pixels. The width is calculated based on the bounds of the content
         * of the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示显示对象的宽度，以像素为单位。宽度是根据显示对象内容的范围来计算的。
         * @version Egret 2.4
         * @platform Web,Native
         */
        width: number;
        /**
         * @private
         * 获取显示宽度
         */
        $getWidth(): number;
        /**
         * @private
         *
         * @returns
         */
        $getExplicitWidth(): number;
        /**
         * @private
         * 设置显示宽度
         */
        $setWidth(value: number): boolean;
        /**
         * @language en_US
         * Indicates the height of the display object, in pixels. The height is calculated based on the bounds of the
         * content of the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示显示对象的高度，以像素为单位。高度是根据显示对象内容的范围来计算的。
         * @version Egret 2.4
         * @platform Web,Native
         */
        height: number;
        /**
         * @private
         * 获取显示高度
         */
        $getHeight(): number;
        /**
         * @private
         *
         * @returns
         */
        $getExplicitHeight(): number;
        /**
         * @private
         * 设置显示高度
         */
        $setHeight(value: number): boolean;
        /**
         * 测量宽度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         * @version Egret 2.4
         * @platform Web,Native
         */
        measuredWidth: number;
        /**
         * 测量高度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         * @version Egret 2.4
         * @platform Web,Native
         */
        measuredHeight: number;
        /**
         * @language en_US
         * X represents the object of which is the anchor.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示从对象绝对锚点X。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        anchorOffsetX: number;
        /**
         * @private
         */
        $getAnchorOffsetX(): boolean;
        /**
         * @private
         *
         * @param value
         * @returns
         */
        $setAnchorOffsetX(value: number): boolean;
        /**
         * @language en_US
         * Y represents the object of which is the anchor.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示从对象绝对锚点Y。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        anchorOffsetY: number;
        /**
         * @private
         */
        $getAnchorOffsetY(): boolean;
        /**
         * @private
         *
         * @param value
         * @returns
         */
        $setAnchorOffsetY(value: number): boolean;
        /**
         * @private
         */
        $visible: boolean;
        /**
         * @language en_US
         * Whether or not the display object is visible. Display objects that are not visible are disabled. For example,
         * if visible=false for an DisplayObject instance, it cannot receive touch or other user input.
         * @default true
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 显示对象是否可见。不可见的显示对象将被禁用。例如，如果实例的 visible 为 false，则无法接受触摸或用户交互操作。
         * @default true
         * @version Egret 2.4
         * @platform Web,Native
         */
        visible: boolean;
        $setVisible(value: boolean): boolean;
        /**
         * @private
         * 获取这个显示对象跟它所有父级透明度的乘积
         */
        $getConcatenatedVisible(): boolean;
        /**
         * @private
         * cacheAsBitmap创建的缓存位图节点。
         */
        $displayList: egret.sys.DisplayList;
        /**
         * @language en_US
         * If set to true, Egret runtime caches an internal bitmap representation of the display object. This caching can
         * increase performance for display objects that contain complex vector content. After you set the cacheAsBitmap
         * property to true, the rendering does not change, however the display object performs pixel snapping automatically.
         * The execution speed can be significantly faster depending on the complexity of the content.The cacheAsBitmap
         * property is best used with display objects that have mostly static content and that do not scale and rotate frequently.<br/>
         * Note: The display object will not create the bitmap caching when the memory exceeds the upper limit,even if you set it to true.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果设置为 true，则 Egret 运行时将缓存显示对象的内部位图表示形式。此缓存可以提高包含复杂矢量内容的显示对象的性能。
         * 将 cacheAsBitmap 属性设置为 true 后，呈现并不更改，但是，显示对象将自动执行像素贴紧。执行速度可能会大大加快，
         * 具体取决于显示对象内容的复杂性。最好将 cacheAsBitmap 属性与主要具有静态内容且不频繁缩放或旋转的显示对象一起使用。<br/>
         * 注意：在内存超过上限的情况下，即使将 cacheAsBitmap 属性设置为 true，显示对象也不使用位图缓存。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        cacheAsBitmap: boolean;
        $setHasDisplayList(value: boolean): void;
        /**
         * @private
         * cacheAsBitmap属性改变
         */
        $cacheAsBitmapChanged(): void;
        /**
         * @private
         */
        $alpha: number;
        /**
         * @language en_US
         * Indicates the alpha transparency value of the object specified. Valid values are 0 (fully transparent) to 1 (fully opaque).
         * The default value is 1. Display objects with alpha set to 0 are active, even though they are invisible.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示指定对象的 Alpha 透明度值。
         * 有效值为 0（完全透明）到 1（完全不透明）。alpha 设置为 0 的显示对象是可触摸的，即使它们不可见。
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        alpha: number;
        /**
         * @private
         *
         * @param value
         */
        $setAlpha(value: number): boolean;
        /**
         * @private
         * 获取这个显示对象跟它所有父级透明度的乘积
         */
        $getConcatenatedAlpha(): number;
        /**
         * @private
         * @language en_US
         * The default touchEnabled property of DisplayObject
         * @default false
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @private
         * @language zh_CN
         * 显示对象默认的 touchEnabled 属性
         * @default false
         * @version Egret 2.5
         * @platform Web,Native
         */
        static defaultTouchEnabled: boolean;
        $touchEnabled: boolean;
        /**
         * @language en_US
         * Specifies whether this object receives touch or other user input. The default value is false, which means that
         * by default any DisplayObject instance that is on the display list cannot receive touch events. If touchEnabled is
         * set to false, the instance does not receive any touch events (or other user input events). Any children of
         * this instance on the display list are not affected. To change the touchEnabled behavior for all children of
         * an object on the display list, use DisplayObjectContainer.touchChildren.
         * @see egret.DisplayObjectContainer#touchChildren
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定此对象是否接收触摸或其他用户输入。默认值为 false，这表示默认情况下，显示列表上的任何 DisplayObject 实例都不会接收触摸事件或
         * 其他用户输入事件。如果将 touchEnabled 设置为 false，则实例将不接收任何触摸事件（或其他用户输入事件）。显示列表上的该实例的任
         * 何子级都不会受到影响。要更改显示列表上对象的所有子级的 touchEnabled 行为，请使用 DisplayObjectContainer.touchChildren。
         * @see egret.DisplayObjectContainer#touchChildren
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        touchEnabled: boolean;
        /**
         * @private
         *
         * @returns
         */
        $getTouchEnabled(): boolean;
        /**
         * @private
         */
        $setTouchEnabled(value: boolean): boolean;
        /**
         * @private
         */
        $scrollRect: Rectangle;
        /**
         * @language en_US
         * The scroll rectangle bounds of the display object. The display object is cropped to the size defined by the rectangle,
         * and it scrolls within the rectangle when you change the x and y properties of the scrollRect object. A scrolled display
         * object always scrolls in whole pixel increments.You can scroll an object left and right by setting the x property of
         * the scrollRect Rectangle object. You can scroll an object up and down by setting the y property of the scrollRect
         * Rectangle object. If the display object is rotated 90° and you scroll it left and right, the display object actually
         * scrolls up and down.<br/>
         *
         * Note: to change the value of a display object's scrollRect, you must make a copy of the entire scrollRect object, then copy
         * the new object into the scrollRect property of the display object.
         * @example the following code increases the x value of a display object's scrollRect
         * <pre>
         *     let myRectangle:Rectangle = myDisplayObject.scrollRect;
         *     myRectangle.x += 10;
         *     myDisplayObject.scrollRect = myRectangle;
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
         * 滚动的显示对象始终以整像素为增量进行滚动。您可以通过设置 scrollRect Rectangle 对象的 x 属性来左右滚动对象， 还可以通过设置
         * scrollRect 对象的 y 属性来上下滚动对象。如果显示对象旋转了 90 度，并且您左右滚动它，则实际上显示对象会上下滚动。<br/>
         *
         * 注意：要改变一个显示对象 scrollRect 属性的值，您必引用整个 scrollRect 对象，然后将它重新赋值给显示对象的 scrollRect 属性。
         * @example 以下代码改变了显示对象 scrollRect 的 x 属性值：
         * <pre>
         *     let myRectangle:Rectangle = myDisplayObject.scrollRect;
         *     myRectangle.x += 10;
         *     myDisplayObject.scrollRect = myRectangle;//设置完scrollRect的x、y、width、height值之后，一定要对myDisplayObject重新赋值scrollRect，不然会出问题。
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        scrollRect: Rectangle;
        /**
         * @private
         *
         * @param value
         */
        $setScrollRect(value: Rectangle): boolean;
        /**
         * @private
         */
        $blendMode: number;
        /**
         * @language en_US
         * A value from the BlendMode class that specifies which blend mode to use. Determine how a source image (new one)
         * is drawn on the target image (old one).<br/>
         * If you attempt to set this property to an invalid value, Egret runtime set the value to BlendMode.NORMAL.
         * @default egret.BlendMode.NORMAL
         * @see egret.BlendMode
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * BlendMode 枚举中的一个值，用于指定要使用的混合模式，确定如何将一个源（新的）图像绘制到目标（已有）的图像上<br/>
         * 如果尝试将此属性设置为无效值，则运行时会将此值设置为 BlendMode.NORMAL。
         * @default egret.BlendMode.NORMAL
         * @see egret.BlendMode
         * @version Egret 2.4
         * @platform Web,Native
         */
        blendMode: string;
        /**
         * @private
         * 被遮罩的对象
         */
        $maskedObject: DisplayObject;
        /**
         * @private
         */
        $mask: DisplayObject;
        /**
         * @private
         */
        $maskRect: Rectangle;
        /**
         * @language en_US
         * The calling display object is masked by the specified mask object. To ensure that masking works when the Stage
         * is scaled, the mask display object must be in an active part of the display list. The mask object itself is not drawn.
         * Set mask to null to remove the mask. To be able to scale a mask object, it must be on the display list. To be
         * able to drag a mask object , it must be on the display list.<br/>
         * Note: A single mask object cannot be used to mask more than one calling display object. When the mask is assigned
         * to a second display object, it is removed as the mask of the first object, and that object's mask property becomes null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 调用显示对象被指定的 mask 对象遮罩。要确保当舞台缩放时蒙版仍然有效，mask 显示对象必须处于显示列表的活动部分。
         * 但不绘制 mask 对象本身。将 mask 设置为 null 可删除蒙版。要能够缩放遮罩对象，它必须在显示列表中。要能够拖动蒙版
         * 对象，它必须在显示列表中。<br/>
         * 注意：单个 mask 对象不能用于遮罩多个执行调用的显示对象。在将 mask 分配给第二个显示对象时，会撤消其作为第一个对象的遮罩，
         * 该对象的 mask 属性将变为 null。
         *
         * 下面例子为 mask 为 Rectangle 类型对象，这种情况下，修改 mask 的值后，一定要对 myDisplayObject 重新赋值 mask，不然会出问题。
         * @example 以下代码改变了显示对象 mask 的 x 属性值：
         * <pre>
         *     let myMask:Rectangle = myDisplayObject.mask;
         *     myMask.x += 10;
         *     myDisplayObject.mask = myMask;//设置完 mask 的x、y、width、height值之后，一定要对myDisplayObject重新赋值 mask，不然会出问题。
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        mask: DisplayObject | Rectangle;
        $setMaskRect(value: Rectangle): boolean;
        /**
         * @language en_US
         * An indexed array that contains each filter object currently associated with the display object.
         * Note: Currently only the next support WebGL, Canvas rendering and native are not supported.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 包含当前与显示对象关联的每个滤镜对象的索引数组。
         * 注意 : 目前只有 WebGL 下支持，Canvs 渲染以及 native 均不支持。
         * @version Egret 3.1.0
         * @platform Web
         */
        filters: Array<Filter>;
        /**
         * @private
         * 获取filters
         */
        $getFilters(): Array<Filter>;
        /**
         * @language en_US
         * Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.
         * @param targetCoordinateSpace The display object that defines the coordinate system to use.
         * @param resultRect A reusable instance of Rectangle for saving the results. Passing this parameter can reduce the number of reallocate objects
         *, which allows you to get better code execution performance..
         * @returns The rectangle that defines the area of the display object relative to the targetCoordinateSpace object's coordinate system.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回一个矩形，该矩形定义相对于 targetCoordinateSpace 对象坐标系的显示对象区域。
         * @param targetCoordinateSpace 定义要使用的坐标系的显示对象。
         * @param resultRect 一个用于存储结果的可复用Rectangle实例，传入此参数能够减少内部创建对象的次数，从而获得更高的运行性能。
         * @returns 定义与 targetCoordinateSpace 对象坐标系统相关的显示对象面积的矩形。
         * @version Egret 2.4
         * @platform Web,Native
         */
        getTransformedBounds(targetCoordinateSpace: DisplayObject, resultRect?: Rectangle): Rectangle;
        /**
         * @language en_US
         * Obtain measurement boundary of display object
         * @param resultRect {Rectangle} Optional. It is used to import Rectangle object for saving results, preventing duplicate object creation.
         * @param calculateAnchor {boolean} Optional. It is used to determine whether to calculate anchor point.
         * @returns {Rectangle}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取显示对象的测量边界
         * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         * @param calculateAnchor {boolean} 可选参数，是否会计算锚点。
         * @returns {Rectangle}
         * @version Egret 2.4
         * @platform Web,Native
         */
        getBounds(resultRect?: Rectangle, calculateAnchor?: boolean): egret.Rectangle;
        /**
         * @private
         */
        $getTransformedBounds(targetCoordinateSpace: DisplayObject, resultRect?: Rectangle): Rectangle;
        /**
         * @language en_US
         * Converts the point object from the Stage (global) coordinates to the display object's (local) coordinates.
         * @param stageX the x value in the global coordinates
         * @param stageY the y value in the global coordinates
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns A Point object with coordinates relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将从舞台（全局）坐标转换为显示对象的（本地）坐标。
         * @param stageX 舞台坐标x
         * @param stageY 舞台坐标y
         * @param resultPoint 一个用于存储结果的可复用 Point 实例，传入此参数能够减少内部创建对象的次数，从而获得更高的运行性能。
         * @returns 具有相对于显示对象的坐标的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        globalToLocal(stageX?: number, stageY?: number, resultPoint?: Point): Point;
        /**
         * @language en_US
         * Converts the point object from the display object's (local) coordinates to the Stage (global) coordinates.
         * @param localX the x value in the local coordinates
         * @param localY the x value in the local coordinates
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns  A Point object with coordinates relative to the Stage.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将显示对象的（本地）坐标转换为舞台（全局）坐标。
         * @param localX 本地坐标 x
         * @param localY 本地坐标 y
         * @param resultPoint 一个用于存储结果的可复用 Point 实例，传入此参数能够减少内部创建对象的次数，从而获得更高的运行性能。
         * @returns 一个具有相对于舞台坐标的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        localToGlobal(localX?: number, localY?: number, resultPoint?: Point): Point;
        /**
         * @private
         * 标记自身的测量尺寸失效
         */
        $invalidateContentBounds(): void;
        /**
         * @private
         * 获取显示对象占用的矩形区域集合，通常包括自身绘制的测量区域，如果是容器，还包括所有子项占据的区域。
         */
        $getOriginalBounds(): Rectangle;
        /**
         * @private
         * 测量子项占用的矩形区域
         * @param bounds 测量结果存储在这个矩形对象内
         */
        $measureChildBounds(bounds: Rectangle): void;
        /**
         * @private
         */
        $getContentBounds(): Rectangle;
        /**
         * @private
         * 测量自身占用的矩形区域，注意：此测量结果并不包括子项占据的区域。
         * @param bounds 测量结果存储在这个矩形对象内
         */
        $measureContentBounds(bounds: Rectangle): void;
        /**
         * @private
         */
        $parentDisplayList: egret.sys.DisplayList;
        /**
         * @private
         * 标记此显示对象需要重绘。此方法会触发自身的cacheAsBitmap重绘。如果只是矩阵改变，自身显示内容并不改变，应该调用$invalidateTransform().
         * @param notiryChildren 是否标记子项也需要重绘。传入false或不传入，将只标记自身需要重绘。注意:当子项cache时不会继续向下标记
         */
        $invalidate(notifyChildren?: boolean): void;
        /**
         * @private
         * 标记自身以及所有子项在父级中变换叠加的显示内容失效。此方法不会触发自身的cacheAsBitmap重绘。
         * 通常用于矩阵改变或从显示列表添加和移除时。若自身的显示内容已经改变需要重绘，应该调用$invalidate()。
         */
        $invalidateTransform(): void;
        /**
         * @private
         * 渲染节点,不为空表示自身有绘制到屏幕的内容
         */
        $renderNode: sys.RenderNode;
        /**
         * @private
         * 获取渲染节点
         */
        $getRenderNode(): sys.RenderNode;
        /**
         * @private
         * 更新对象在舞台上的显示区域,返回显示区域是否发生改变。
         */
        $update(dirtyRegionPolicy: string, bounds?: Rectangle): boolean;
        private static boundsForUpdate;
        /**
         * @private
         */
        $measureFiltersOffset(): any;
        /**
         * @private
         * 获取相对于指定根节点的连接矩阵。
         * @param root 根节点显示对象
         * @param matrix 目标显示对象相对于舞台的完整连接矩阵。
         */
        $getConcatenatedMatrixAt(root: DisplayObject, matrix: Matrix): void;
        $getConcatenatedAlphaAt(root: DisplayObject, alpha: number): number;
        /**
         * @private
         * 执行渲染,绘制自身到屏幕
         */
        $render(): void;
        /**
         * @private
         */
        $hitTest(stageX: number, stageY: number): DisplayObject;
        /**
         * @language en_US
         * Calculate the display object to determine whether it overlaps or crosses with the points specified by the x and y parameters. The x and y parameters specify the points in the coordinates of the stage, rather than the points in the display object container that contains display objects (except the situation where the display object container is a stage).
         * Note: Don't use accurate pixel collision detection on a large number of objects. Otherwise, this will cause serious performance deterioration.
         * @param x {number}  x coordinate of the object to be tested.
         * @param y {number}  y coordinate of the object to be tested.
         * @param shapeFlag {boolean} Whether to check the actual pixel of object (true) or check that of border (false).Write realized.
         * @returns {boolean} If display object overlaps or crosses with the specified point, it is true; otherwise, it is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 计算显示对象，以确定它是否与 x 和 y 参数指定的点重叠或相交。x 和 y 参数指定舞台的坐标空间中的点，而不是包含显示对象的显示对象容器中的点（除非显示对象容器是舞台）。
         * 注意，不要在大量物体中使用精确碰撞像素检测，这回带来巨大的性能开销
         * @param x {number}  要测试的此对象的 x 坐标。
         * @param y {number}  要测试的此对象的 y 坐标。
         * @param shapeFlag {boolean} 是检查对象 (true) 的实际像素，还是检查边框 (false) 的实际像素。
         * @returns {boolean} 如果显示对象与指定的点重叠或相交，则为 true；否则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean;
        /**
         * @private
         */
        static $enterFrameCallBackList: DisplayObject[];
        /**
         * @private
         */
        static $renderCallBackList: DisplayObject[];
        /**
         * @private
         */
        $addListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number, dispatchOnce?: boolean): void;
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @private
         * 获取事件流列表。注意：Egret框架的事件流与Flash实现并不一致。
         *
         * 事件流有三个阶段：捕获，目标，冒泡。
         * Flash里默认的的事件监听若不开启useCapture将监听目标和冒泡阶段。若开始capture将只能监听捕获当不包括目标的事件。
         * 可以在Flash中写一个简单的测试：实例化一个非容器显示对象，例如TextField。分别监听useCapture为true和false时的鼠标事件。
         * 点击后将只有useCapture为false的回调函数输出信息。也就带来一个问题「Flash的捕获阶段不能监听到最内层对象本身，只在父级列表有效」。
         *
         * 而HTML里的事件流设置useCapture为true时是能监听到目标阶段的，也就是目标阶段会被触发两次，在捕获和冒泡过程各触发一次。这样可以避免
         * 前面提到的监听捕获无法监听目标本身的问题。
         *
         * Egret最终采用了HTML里目标节点触发两次的事件流方式。
         */
        $getPropagationList(target: DisplayObject): DisplayObject[];
        /**
         * @private
         */
        $dispatchPropagationEvent(event: Event, list: DisplayObject[], targetIndex: number): void;
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        willTrigger(type: string): boolean;
    }
}
declare namespace egret.sys {
    /**
     * @private
     */
    const enum BitmapKeys {
        bitmapData = 0,
        image = 1,
        bitmapX = 2,
        bitmapY = 3,
        bitmapWidth = 4,
        bitmapHeight = 5,
        offsetX = 6,
        offsetY = 7,
        textureWidth = 8,
        textureHeight = 9,
        smoothing = 10,
        explicitBitmapWidth = 11,
        explicitBitmapHeight = 12,
        sourceWidth = 13,
        sourceHeight = 14,
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Bitmap class represents display objects that represent bitmap images.
     * The Bitmap() constructor allows you to create a Bitmap object that contains a reference to a BitmapData object.
     * After you create a Bitmap object, use the addChild() or addChildAt() method of the parent DisplayObjectContainer
     * instance to place the bitmap on the display list.A Bitmap object can share its texture reference among several
     * Bitmap objects, independent of translation or rotation properties. Because you can create multiple Bitmap objects
     * that reference the same texture object, multiple display objects can use the same complex texture object
     * without incurring the memory overhead of a texture object for each display object instance.
     *
     * @see egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Bitmap.ts
     */
    /**
     * @language zh_CN
     * Bitmap 类表示用于显示位图图片的显示对象。
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象引用的 Bitmap 对象。创建了 Bitmap 对象后，
     * 使用父级 DisplayObjectContainer 实例的 addChild() 或 addChildAt() 方法可以将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 texture 引用，与缩放或旋转属性无关。
     * 由于能够创建引用相同 texture 对象的多个 Bitmap 对象，因此，多个显示对象可以使用相同的 texture 对象，
     * 而不会因为每个显示对象实例使用一个 texture 对象而产生额外内存开销。
     *
     * @see egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Bitmap.ts
     */
    class Bitmap extends DisplayObject {
        /**
         * @language en_US
         * Initializes a Bitmap object to refer to the specified BitmapData|Texture object.
         * @param value The BitmapData|Texture object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个引用指定 BitmapData|Texture 实例的 Bitmap 对象
         * @param value 被引用的 BitmapData|Texture 实例
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(value?: BitmapData | Texture);
        /**
         * @private
         */
        $Bitmap: Object;
        /**
         * @private
         * 显示对象添加到舞台
         */
        $onAddToStage(stage: Stage, nestLevel: number): void;
        /**
         * @private
         * 显示对象从舞台移除
         */
        $onRemoveFromStage(): void;
        /**
         * @language en_US
         * The BitmapData object being referenced.
         * If you pass the constructor of type Texture or last set for texture, this value returns null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 被引用的 BitmapData 对象。
         * 如果传入构造函数的类型为 Texture 或者最后设置的为 texture，则此值返回 null。
         * @version Egret 2.4
         * @platform Web,Native
         */
        bitmapData: BitmapData;
        /**
         * @language en_US
         * The Texture object being referenced.
         * If you pass the constructor of type BitmapData or last set for bitmapData, this value returns null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 被引用的 Texture 对象。
         * 如果传入构造函数的类型为 BitmapData 或者最后设置的为 bitmapData，则此值返回 null。
         * @version Egret 2.4
         * @platform Web,Native
         */
        texture: Texture;
        /**
         * @private
         */
        $setBitmapData(value: BitmapData | Texture): boolean;
        /**
         * @private
         */
        $refreshImageData(): void;
        /**
         * @private
         */
        private setImageData(image, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, sourceWidth, sourceHeight);
        /**
         * @private
         */
        $scale9Grid: egret.Rectangle;
        /**
         * @language en_US
         * Represent a Rectangle Area that the 9 scale area of Image.
         * Notice: This property is valid only when <code>fillMode</code>
         * is <code>BitmapFillMode.SCALE</code>.
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        scale9Grid: egret.Rectangle;
        /**
         * @private
         */
        $fillMode: string;
        /**
         * @language en_US
         * Determines how the bitmap fills in the dimensions.
         * <p>When set to <code>BitmapFillMode.REPEAT</code>, the bitmap
         * repeats to fill the region.</p>
         * <p>When set to <code>BitmapFillMode.SCALE</code>, the bitmap
         * stretches to fill the region.</p>
         *
         * @default <code>BitmapFillMode.SCALE</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 确定位图填充尺寸的方式。
         * <p>设置为 <code>BitmapFillMode.REPEAT</code>时，位图将重复以填充区域。</p>
         * <p>设置为 <code>BitmapFillMode.SCALE</code>时，位图将拉伸以填充区域。</p>
         *
         * @default <code>BitmapFillMode.SCALE</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web
         */
        fillMode: string;
        $setFillMode(value: string): boolean;
        /**
         * @language en_US
         * The default value of whether or not is smoothed when scaled.
         * When object such as Bitmap is created,smoothing property will be set to this value.
         * @default true。
         * @version Egret 3.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 控制在缩放时是否进行平滑处理的默认值。
         * 在 Bitmap 等对象创建时,smoothing 属性会被设置为该值。
         * @default true。
         * @version Egret 3.0
         * @platform Web
         */
        static defaultSmoothing: boolean;
        /**
         * @language en_US
         * Whether or not the bitmap is smoothed when scaled.
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 控制在缩放时是否对位图进行平滑处理。
         * @version Egret 2.4
         * @platform Web
         */
        smoothing: boolean;
        /**
         * @private
         *
         * @param value
         */
        $setWidth(value: number): boolean;
        /**
         * @private
         *
         * @param value
         */
        $setHeight(value: number): boolean;
        /**
         * @private
         * 获取显示宽度
         */
        $getWidth(): number;
        /**
         * @private
         * 获取显示宽度
         */
        $getHeight(): number;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        /**
         * @private
         */
        $render(): void;
        private _pixelHitTest;
        /**
         * @language en_US
         * Specifies whether this object use precise hit testing by checking the alpha value of each pixel.If pixelHitTest
         * is set to true,the transparent area of the bitmap will be touched through.<br/>
         * Note:If the image is loaded from cross origin,that we can't access to the pixel data,so it might cause
         * the pixelHitTest property invalid.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否开启精确像素碰撞。设置为true显示对象本身的透明区域将能够被穿透。<br/>
         * 注意：若图片资源是以跨域方式从外部服务器加载的，将无法访问图片的像素数据，而导致此属性失效。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        pixelHitTest: boolean;
        $hitTest(stageX: number, stageY: number): DisplayObject;
        /**
         * @private
         */
        private hitTestPixel(stageX, stageY);
        static $drawImage(node: sys.BitmapNode, image: any, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, destW: number, destH: number, sourceWidth: number, sourceHeight: number, scale9Grid: egret.Rectangle, fillMode: string, smoothing: boolean): void;
    }
}
declare namespace egret {
    /**
     * @private
     */
    interface MapLike<T> {
        [key: string]: T;
        [key: number]: T;
    }
    /**
     * @private
     */
    function createMap<T>(): MapLike<T>;
}
declare namespace egret {
    /**
     * @language en_US
     * A BitmapData object contains an array of pixel data. This data can represent either a fully opaque bitmap or a
     * transparent bitmap that contains alpha channel data. Either type of BitmapData object is stored as a buffer of 32-bit
     * integers. Each 32-bit integer determines the properties of a single pixel in the bitmap.<br/>
     * Each 32-bit integer is a combination of four 8-bit channel values (from 0 to 255) that describe the alpha transparency
     * and the red, green, and blue (ARGB) values of the pixel. (For ARGB values, the most significant byte represents the
     * alpha channel value, followed by red, green, and blue.)
     * @see egret.Bitmap
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    /**
     * @language zh_CN
     * BitmapData 对象是一个包含像素数据的数组。此数据可以表示完全不透明的位图，或表示包含 Alpha 通道数据的透明位图。
     * 以上任一类型的 BitmapData 对象都作为 32 位整数的缓冲区进行存储。每个 32 位整数确定位图中单个像素的属性。<br/>
     * 每个 32 位整数都是四个 8 位通道值（从 0 到 255）的组合，这些值描述像素的 Alpha 透明度以及红色、绿色、蓝色 (ARGB) 值。
     * （对于 ARGB 值，最高有效字节代表 Alpha 通道值，其后的有效字节分别代表红色、绿色和蓝色通道值。）
     * @see egret.Bitmap
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    class BitmapData extends HashObject {
        /**
         * @language en_US
         * The width of the bitmap image in pixels.
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 位图图像的宽度，以像素为单位。
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         */
        width: number;
        /**
         * @language en_US
         * The height of the bitmap image in pixels.
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 位图图像的高度，以像素为单位。
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         */
        height: number;
        /**
         * @language en_US
         * Original bitmap image.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 原始位图图像。
         * @version Egret 2.4
         * @platform Web,Native
         */
        source: any;
        /**
         * @language en_US
         * WebGL texture.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * WebGL纹理。
         * @version Egret 2.4
         * @platform Web,Native
         */
        webGLTexture: any;
        /**
         * @language en_US
         * Texture format.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 纹理格式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        format: string;
        /**
         * @private
         * webgl纹理生成后，是否删掉原始图像数据
         */
        $deleteSource: boolean;
        constructor(source: any);
        $dispose(): void;
        private static _displayList;
        static $addDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData | Texture): void;
        static $removeDisplayObject(displayObject: DisplayObject, bitmapData: BitmapData | Texture): void;
        static $invalidate(bitmapData: BitmapData | Texture): void;
        static $dispose(bitmapData: BitmapData | Texture): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The BitmapFillMode class defines the image fill mode of Bitmap.
     * The BitmapFillMode class defines a pattern enumeration for adjusting size. These patterns determine how Bitmap fill the size designated by the layout system.
     * @see http://edn.egret.com/cn/docs/page/134 Texture filling way
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BitmapFillMode.ts
     */
    /**
     * @language zh_CN
     * BitmapFillMode 类定义Bitmap的图像填充方式。
     * BitmapFillMode 类定义了调整大小模式的一个枚举，这些模式确定 Bitmap 如何填充由布局系统指定的尺寸。
     * @see http://edn.egret.com/cn/docs/page/134 纹理的填充方式
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BitmapFillMode.ts
     */
    const BitmapFillMode: {
        REPEAT: string;
        SCALE: string;
        CLIP: string;
    };
}
declare namespace egret {
    /**
     * @language en_US
     * A class that provides constant values for visual blend mode effects. These constants are used in the blendMode
     * property of the DisplayObject class.
     * @see egret.DisplayObject#blendMode
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BlendMode.ts
     * @see http://edn.egret.com/cn/docs/page/108 显示容器的概念与实现
     */
    /**
     * @language zh_CN
     * 提供混合模式可视效果的常量值的类,通常用于 DisplayObject 的 blendMode 属性上。
     * @see egret.DisplayObject#blendMode
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BlendMode.ts
     * @see http://edn.egret.com/cn/docs/page/108 显示容器的概念与实现
     */
    class BlendMode {
        /**
         * @language en_US
         * The display object appears in front of the background. Pixel values of the display object override the pixel
         * values of the background. Where the display object is transparent, the background is visible.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 该显示对象出现在背景前面。显示对象的像素值会覆盖背景的像素值。在显示对象为透明的区域，背景是可见的。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static NORMAL: string;
        /**
         * @language en_US
         * Adds the values of the constituent colors of the display object to the colors of its background, applying a
         * ceiling of 0xFF. This setting is commonly used for animating a lightening dissolve between two objects.<br/>
         * For example, if the display object has a pixel with an RGB value of 0xAAA633, and the background pixel has an
         * RGB value of 0xDD2200, the resulting RGB value for the displayed pixel is 0xFFC833 (because 0xAA + 0xDD > 0xFF,
         * 0xA6 + 0x22 = 0xC8, and 0x33 + 0x00 = 0x33).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。此设置通常用于使两个对象间的加亮溶解产生动画效果。<br/>
         * 例如，如果显示对象的某个像素的 RGB 值为 0xAAA633，背景像素的 RGB 值为 0xDD2200，则显示像素的结果 RGB 值为 0xFFC833
         * （因为 0xAA + 0xDD > 0xFF，0xA6 + 0x22 = 0xC8，且 0x33 + 0x00 = 0x33）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ADD: string;
        /**
         * @language en_US
         * Erases the background based on the alpha value of the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据显示对象的 Alpha 值擦除背景。Alpha 值不为0的区域将被擦除。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ERASE: string;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 转换 blendMode 字符串为数字。
     */
    function blendModeToNumber(blendMode: string): number;
    /**
     * @private
     * 转换数字为 blendMode 字符串。
     */
    function numberToBlendMode(blendMode: number): string;
}
declare namespace egret {
    /**
     * @language en_US
     * The CapsStyle class is an enumeration of constant values that specify the caps style to use in drawing lines.
     * The constants are provided for use as values in the caps parameter of the egret.Graphics.lineStyle() method.
     * @see egret.Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * CapsStyle 类是可指定在绘制线条中使用的端点样式的常量值枚举。常量可用作 egret.Graphics.lineStyle() 方法的 caps 参数中的值。
     * @see egret.Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web,Native
     */
    const CapsStyle: {
        NONE: string;
        ROUND: string;
        SQUARE: string;
    };
}
declare namespace egret {
    /**
     * @language en_US
     * Values for the dirty region policy
     * @version Egret 2.5
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 脏矩形策略常量。
     * @version Egret 3.0
     * @platform Web,Native
     */
    const DirtyRegionPolicy: {
        OFF: string;
        ON: string;
    };
}
declare namespace egret {
    /**
     * @language en_US
     * The DisplayObjectContainer class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObjectContainer.ts
     */
    /**
     * @language zh_CN
     * DisplayObjectContainer 类是基本显示列表构造块：一个可包含子项的显示列表节点。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObjectContainer.ts
     */
    class DisplayObjectContainer extends DisplayObject {
        /**
         * @private
         */
        static $EVENT_ADD_TO_STAGE_LIST: DisplayObject[];
        /**
         * @private
         */
        static $EVENT_REMOVE_FROM_STAGE_LIST: DisplayObject[];
        /**
         * @language en_US
         * Creates a new DisplayObjectContainer instance.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 实例化一个容器
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @private
         */
        $propagateFlagsDown(flags: sys.DisplayObjectFlags, cachedBreak?: boolean): void;
        /**
         * @language en_US
         * Returns the number of children of this object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回此对象的子项数目。
         * @version Egret 2.4
         * @platform Web,Native
         */
        numChildren: number;
        /**
         * @language en_US
         * Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added to the front
         * (top) of all other children in this DisplayObjectContainer instance. (To add a child to a specific index position,
         * use the addChildAt() method.)If you add a child object that already has a different display object container
         * as a parent, the object is removed from the child list of the other display object container.
         * @param child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
         * @returns 在 child The DisplayObject instance that you pass in the child parameter.
         * @see #addChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。子项将被添加到该 DisplayObjectContainer 实例中其他
         * 所有子项的前（上）面。（要将某子项添加到特定索引位置，请使用 addChildAt() 方法。）
         * @param child 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
         * @returns 在 child 参数中传递的 DisplayObject 实例。
         * @see #addChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * @language en_US
         * Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added at the index position
         * specified. An index of 0 represents the back (bottom) of the display list for this DisplayObjectContainer object.
         * If you add a child object that already has a different display object container as a parent, the object is removed
         * from the child list of the other display object container.
         * @param child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
         * @param index The index position to which the child is added. If you specify a currently occupied index position,
         * the child object that exists at that position and all higher positions are moved up one position in the child list.
         * @returns The DisplayObject instance that you pass in the child parameter.
         * @see #addChild()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。该子项将被添加到指定的索引位置。索引为 0 表示该
         * DisplayObjectContainer 对象的显示列表的后（底）部。如果添加一个已将其它显示对象容器作为父项的子对象，则会从其它显示对象容器的子列表中删除该对象。
         * @param child 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
         * @param index 添加该子项的索引位置。 如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
         * @returns 在 child 参数中传递的 DisplayObject 实例。
         * @see #addChild()
         * @version Egret 2.4
         * @platform Web,Native
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         * @private
         */
        $doAddChild(child: DisplayObject, index: number, notifyListeners?: boolean): DisplayObject;
        /**
         * @language en_US
         * Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance
         * itself. The search includes the entire display list including this DisplayObjectContainer instance. Grandchildren,
         * great-grandchildren, and so on each return true.
         * @param child The child object to test.
         * @returns true if the child object is a child of the DisplayObjectContainer or the container itself; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。
         * 孙项、曾孙项等，每项都返回 true。
         * @param child 要测试的子对象。
         * @returns 如果指定的显示对象为 DisplayObjectContainer 该实例本身，则返回true，如果指定的显示对象为当前实例子项，则返回false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        contains(child: DisplayObject): boolean;
        /**
         * @language en_US
         * Returns the child display object instance that exists at the specified index.
         * @param index The index position of the child object.
         * @returns The child display object at the specified index position.
         * @see #getChildByName()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回位于指定索引处的子显示对象实例。
         * @param index 子对象的索引位置。
         * @returns 位于指定索引位置处的子显示对象。
         * @see #getChildByName()
         * @version Egret 2.4
         * @platform Web,Native
         */
        getChildAt(index: number): DisplayObject;
        /**
         * @language en_US
         * Returns the index position of a child DisplayObject instance.
         * @param child The DisplayObject instance to identify.
         * @returns The index position of the child display object to identify.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回 DisplayObject 的 child 实例的索引位置。
         * @param child 要测试的子对象。
         * @returns 要查找的子显示对象的索引位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        getChildIndex(child: egret.DisplayObject): number;
        /**
         * @language en_US
         * Returns the child display object that exists with the specified name. If more that one child display object has
         * the specified name, the method returns the first object in the child list.The getChildAt() method is faster than
         * the getChildByName() method. The getChildAt() method accesses a child from a cached array, whereas the getChildByName()
         * method has to traverse a linked list to access a child.
         * @param name The name of the child to return.
         * @returns The child display object with the specified name.
         * @see #getChildAt()
         * @see egret.DisplayObject#name
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回具有指定名称的子显示对象。如果多个子显示对象具有指定名称，则该方法会返回子级列表中的第一个对象。
         * getChildAt() 方法比 getChildByName() 方法快。getChildAt() 方法从缓存数组中访问子项，而 getChildByName() 方法则必须遍历链接的列表来访问子项。
         * @param name 要返回的子项的名称。
         * @returns 具有指定名称的子显示对象。
         * @see #getChildAt()
         * @see egret.DisplayObject#name
         * @version Egret 2.4
         * @platform Web,Native
         */
        getChildByName(name: string): DisplayObject;
        /**
         * @language en_US
         * Removes the specified child DisplayObject instance from the child list of the DisplayObjectContainer instance.
         * The parent property of the removed child is set to null , and the object is garbage collected if no other references
         * to the child exist. The index positions of any display objects above the child in the DisplayObjectContainer are
         * decreased by 1.
         * @param child The DisplayObject instance to remove.
         * @returns The DisplayObject instance that you pass in the child parameter.
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从 DisplayObjectContainer 实例的子列表中删除指定的 child DisplayObject 实例。将已删除子项的 parent 属性设置为 null；
         * 如果不存在对该子项的任何其它引用，则将该对象作为垃圾回收。DisplayObjectContainer 中该子项之上的任何显示对象的索引位置都减去 1。
         * @param child 要删除的 DisplayObject 实例。
         * @returns 在 child 参数中传递的 DisplayObject 实例。
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * @language en_US
         * Removes a child DisplayObject from the specified index position in the child list of the DisplayObjectContainer.
         * The parent property of the removed child is set to null, and the object is garbage collected if no other references
         * to the child exist. The index positions of any display objects above the child in the DisplayObjectContainer are decreased by 1.
         * @param index The child index of the DisplayObject to remove.
         * @returns The DisplayObject instance that was removed.
         * @see #removeChild()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从 DisplayObjectContainer 的子列表中指定的 index 位置删除子 DisplayObject。将已删除子项的 parent 属性设置为 null；
         * 如果没有对该子项的任何其他引用，则将该对象作为垃圾回收。DisplayObjectContainer 中该子项之上的任何显示对象的索引位置都减去 1。
         * @param index 要删除的 DisplayObject 的子索引。
         * @returns 已删除的 DisplayObject 实例。
         * @see #removeChild()
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeChildAt(index: number): DisplayObject;
        /**
         * @private
         */
        $doRemoveChild(index: number, notifyListeners?: boolean): DisplayObject;
        /**
         * @language en_US
         * Changes the position of an existing child in the display object container. This affects the layering of child objects.
         * @param child The child DisplayObject instance for which you want to change the index number.
         * @param index The resulting index number for the child display object.
         * @see #addChildAt()
         * @see #getChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 更改现有子项在显示对象容器中的位置。这会影响子对象的分层。
         * @param child 要为其更改索引编号的 DisplayObject 子实例。
         * @param index 生成的 child 显示对象的索引编号。当新的索引编号小于0或大于已有子元件数量时，新加入的DisplayObject对象将会放置于最上层。
         * @see #addChildAt()
         * @see #getChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        setChildIndex(child: DisplayObject, index: number): void;
        /**
         * @private
         */
        private doSetChildIndex(child, index);
        /**
         * @language en_US
         * Swaps the z-order (front-to-back order) of the child objects at the two specified index positions in the child
         * list. All other child objects in the display object container remain in the same index positions.
         * @param index1 The index position of the first child object.
         * @param index2 The index position of the second child object.
         * @see #swapChildren()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在子级列表中两个指定的索引位置，交换子对象的 Z 轴顺序（前后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
         * @param index1 第一个子对象的索引位置。
         * @param index2 第二个子对象的索引位置。
         * @see #swapChildren()
         * @version Egret 2.4
         * @platform Web,Native
         */
        swapChildrenAt(index1: number, index2: number): void;
        /**
         * @language en_US
         * Swaps the z-order (front-to-back order) of the two specified child objects. All other child objects in the
         * display object container remain in the same index positions.
         * @param child1 The first child object.
         * @param child2 The second child object.
         * @see #swapChildrenAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 交换两个指定子对象的 Z 轴顺序（从前到后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
         * @param child1 第一个子对象。
         * @param child2 第二个子对象。
         * @see #swapChildrenAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
         * @private
         */
        private doSwapChildrenAt(index1, index2);
        /**
         * @language en_US
         * Removes all child DisplayObject instances from the child list of the DisplayObjectContainer instance. The parent
         * property of the removed children is set to null , and the objects are garbage collected if no other references to the children exist.
         * @see #removeChild()
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从 DisplayObjectContainer 实例的子级列表中删除所有 child DisplayObject 实例。
         * @see #removeChild()
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeChildren(): void;
        /**
         * @private
         * 一个子项被添加到容器内，此方法不仅在操作addChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        $childAdded(child: DisplayObject, index: number): void;
        /**
         * @private
         * 一个子项从容器内移除，此方法不仅在操作removeChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        $childRemoved(child: DisplayObject, index: number): void;
        /**
         * @private
         */
        $onAddToStage(stage: Stage, nestLevel: number): void;
        /**
         * @private
         *
         */
        $onRemoveFromStage(): void;
        /**
         * @private
         */
        $measureChildBounds(bounds: Rectangle): void;
        $touchChildren: boolean;
        /**
         * @language en_US
         * Determines whether or not the children of the object are touch, or user input device, enabled. If an object is
         * enabled, a user can interact with it by using a touch or user input device.
         * @default true
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定对象的子级是否支持触摸或用户输入设备。如果对象支持触摸或用户输入设备，用户可以通过使用触摸或用户输入设备与之交互。
         * @default true
         * @version Egret 2.4
         * @platform Web,Native
         */
        touchChildren: boolean;
        /**
         * @private
         *
         * @returns
         */
        $getTouchChildren(): boolean;
        /**
         * @private
         */
        $setTouchChildren(value: boolean): boolean;
        /**
         * @private
         * 标记此显示对象需要重绘。此方法会触发自身的cacheAsBitmap重绘。如果只是矩阵改变，自身显示内容并不改变，应该调用$invalidateTransform().
         * @param notiryChildren 是否标记子项也需要重绘。传入false或不传入，将只标记自身需要重绘。通常只有alpha属性改变会需要通知子项重绘。
         */
        $invalidate(notifyChildren?: boolean): void;
        /**
         * @private
         * 标记自身以及所有子项在父级中变换叠加的显示内容失效。此方法不会触发自身的cacheAsBitmap重绘。
         * 通常用于矩阵改变或从显示列表添加和移除时。若自身的显示内容已经改变需要重绘，应该调用$invalidate()。
         */
        $invalidateTransform(): void;
        /**
         * @private
         * 标记所有子项失效,若遇到cacheAsBitmap的节点,直接停止继续遍历其子项.
         */
        private markChildDirty(child, parentCache);
        /**
         * @private
         */
        $cacheAsBitmapChanged(): void;
        /**
         * @private
         */
        private assignParentDisplayList(child, parentCache, newParent);
        /**
         * @private
         */
        $hitTest(stageX: number, stageY: number): DisplayObject;
        /**
         * @private
         * 子项有可能会被cache而导致标记失效。重写此方法,以便在赋值时对子项深度遍历标记脏区域
         */
        $setAlpha(value: number): boolean;
        /**
         * @private
         * 标记所有子项失效,与markChildDirty不同,此方法无视子项是否启用cacheAsBitmap,必须遍历完所有子项.通常只有alpha属性改变需要采用这种操作.
         */
        private $invalidateAllChildren();
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The GradientType class provides values for the type parameter in the beginGradientFill() methods of the egret.Graphics class.
     *
     * @see egret.Graphics#beginGradientFill()
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * GradientType 类为 egret.Graphics 类的 beginGradientFill() 方法中的 type 参数提供值。
     *
     * @see egret.Graphics#beginGradientFill()
     * @version Egret 2.4
     * @platform Web,Native
     */
    class GradientType {
        /**
         * @language en_US
         * Value used to specify a linear gradient fill.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于指定线性渐变填充的值
         * @version Egret 2.4
         * @platform Web,Native
         */
        static LINEAR: string;
        /**
         * @language en_US
         * Value used to specify a radial gradient fill.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于指定放射状渐变填充的值
         * @version Egret 2.4
         * @platform Web,Native
         */
        static RADIAL: string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Graphics class contains a set of methods for creating vector shape. Display objects that support drawing include Sprite and Shape objects. Each class in these classes includes the graphics attribute that is a Graphics object.
     * The following auxiliary functions are provided for ease of use: drawRect(), drawRoundRect(), drawCircle(), and drawEllipse().
     * @see http://edn.egret.com/cn/docs/page/136 Draw Rectangle
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Graphics.ts
     */
    /**
     * @language zh_CN
     * Graphics 类包含一组可用来创建矢量形状的方法。支持绘制的显示对象包括 Sprite 和 Shape 对象。这些类中的每一个类都包括 graphics 属性，该属性是一个 Graphics 对象。
     * 以下是为便于使用而提供的一些辅助函数：drawRect()、drawRoundRect()、drawCircle() 和 drawEllipse()。
     * @see http://edn.egret.com/cn/docs/page/136 绘制矩形
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Graphics.ts
     */
    class Graphics extends HashObject {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @private
         */
        $renderNode: sys.GraphicsNode;
        /**
         * 绑定到的目标显示对象
         */
        private targetDisplay;
        /**
         * @private
         * 设置绑定到的目标显示对象
         */
        $setTarget(target: DisplayObject): void;
        /**
         * 当前移动到的坐标X
         */
        private lastX;
        /**
         * 当前移动到的坐标Y
         */
        private lastY;
        /**
         * 当前正在绘制的填充
         */
        private fillPath;
        /**
         * 当前正在绘制的线条
         */
        private strokePath;
        /**
         * 线条的左上方宽度
         */
        private topLeftStrokeWidth;
        /**
         * 线条的右下方宽度
         */
        private bottomRightStrokeWidth;
        /**
         * 对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
         */
        private setStrokeWidth(width);
        /**
         * @language en_US
         * Specify a simple single color fill that will be used for subsequent calls to other Graphics methods (for example, lineTo() and drawCircle()) when drawing.
         * Calling the clear() method will clear the fill.
         * @param color Filled color
         * @param alpha Filled Alpha value
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * @param color 填充的颜色
         * @param alpha 填充的 Alpha 值
         * @version Egret 2.4
         * @platform Web,Native
         */
        beginFill(color: number, alpha?: number): void;
        /**
         * @language en_US
         * Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
         * Calling the clear() method clears the fill.
         * @param type A value from the GradientType class that specifies which gradient type to use: GradientType.LINEAR or GradientType.RADIAL.
         * @param colors An array of RGB hexadecimal color values used in the gradient; for example, red is 0xFF0000, blue is 0x0000FF, and so on. You can specify up to 15 colors. For each color, specify a corresponding value in the alphas and ratios parameters.
         * @param alphas An array of alpha values for the corresponding colors in the colors array;
         * @param ratios An array of color distribution ratios; valid values are 0-255.
         * @param matrix A transformation matrix as defined by the egret.Matrix class. The egret.Matrix class includes a createGradientBox() method, which lets you conveniently set up the matrix for use with the beginGradientFill() method.
         * @platform Web,Native
         * @version Egret 2.4
         */
        /**
         * @language zh_CN
         * 指定一种渐变填充，用于随后调用对象的其他 Graphics 方法（如 lineTo() 或 drawCircle()）。
         * 调用 clear() 方法会清除填充。
         * @param type 用于指定要使用哪种渐变类型的 GradientType 类的值：GradientType.LINEAR 或 GradientType.RADIAL。
         * @param colors 渐变中使用的 RGB 十六进制颜色值的数组（例如，红色为 0xFF0000，蓝色为 0x0000FF，等等）。对于每种颜色，请在 alphas 和 ratios 参数中指定对应值。
         * @param alphas colors 数组中对应颜色的 alpha 值数组。
         * @param ratios 颜色分布比率的数组。有效值为 0 到 255。
         * @param matrix 一个由 egret.Matrix 类定义的转换矩阵。egret.Matrix 类包括 createGradientBox() 方法，通过该方法可以方便地设置矩阵，以便与 beginGradientFill() 方法一起使用
         * @platform Web,Native
         * @version Egret 2.4
         */
        beginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix?: egret.Matrix): void;
        /**
         * @language en_US
         * Apply fill to the lines and curves added after the previous calling to the beginFill() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对从上一次调用 beginFill()方法之后添加的直线和曲线应用填充。
         * @version Egret 2.4
         * @platform Web,Native
         */
        endFill(): void;
        /**
         * @language en_US
         * Specify a line style that will be used for subsequent calls to Graphics methods such as lineTo() and drawCircle().
         * @param thickness An integer, indicating the thickness of the line in points. Valid values are 0 to 255. If a number is not specified, or if the parameter is undefined, a line is not drawn. If a value less than 0 is passed, the default value is 0. Value 0 indicates hairline thickness; the maximum thickness is 255. If a value greater than 255 is passed, the default value is 255.
         * @param color A hexadecimal color value of the line (for example, red is 0xFF0000, and blue is 0x0000FF, etc.). If no value is specified, the default value is 0x000000 (black). Optional.
         * @param alpha Indicates Alpha value of the line's color. Valid values are 0 to 1. If no value is specified, the default value is 1 (solid). If the value is less than 0, the default value is 0. If the value is greater than 1, the default value is 1.
         * @param pixelHinting A boolean value that specifies whether to hint strokes to full pixels. This affects both the position of anchors of a curve and the line stroke size itself. With pixelHinting set to true, the line width is adjusted to full pixel width. With pixelHinting set to false, disjoints can appear for curves and straight lines.
         * @param scaleMode Specifies the scale mode to be used
         * @param caps Specifies the value of the CapsStyle class of the endpoint type at the end of the line. (default = CapsStyle.ROUND)
         * @param joints Specifies the type of joint appearance of corner.  (default = JointStyle.ROUND)
         * @param miterLimit Indicates the limit number of cut miter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
         * @param thickness 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param pixelHinting 布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。
         * @param scaleMode 用于指定要使用的比例模式
         * @param caps 用于指定线条末端处端点类型的 CapsStyle 类的值。默认值：CapsStyle.ROUND
         * @param joints 指定用于拐角的连接外观的类型。默认值：JointStyle.ROUND
         * @param miterLimit 用于表示剪切斜接的极限值的数字。
         * @version Egret 2.4
         * @platform Web,Native
         */
        lineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number): void;
        /**
         * @language en_US
         * Draw a rectangle
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个矩形
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        drawRect(x: number, y: number, width: number, height: number): void;
        /**
         * @language en_US
         * Draw a rectangle with rounded corners.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @param ellipseWidth Width used to draw an ellipse with rounded corners (in pixels).
         * @param ellipseHeight Height used to draw an ellipse with rounded corners (in pixels). (Optional) If no value is specified, the default value matches the value of the ellipseWidth parameter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个圆角矩形。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @param ellipseWidth 用于绘制圆角的椭圆的宽度（以像素为单位）。
         * @param ellipseHeight 用于绘制圆角的椭圆的高度（以像素为单位）。 （可选）如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
         * @version Egret 2.4
         * @platform Web,Native
         */
        drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        /**
         * @language en_US
         * Draw a circle.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param r Radius of the circle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个圆。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param radius 圆的半径（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        drawCircle(x: number, y: number, radius: number): void;
        /**
         * @language en_US
         * Draw an ellipse.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个椭圆。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        drawEllipse(x: number, y: number, width: number, height: number): void;
        /**
         * @language en_US
         * Move the current drawing position to (x, y). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        moveTo(x: number, y: number): void;
        /**
         * @language en_US
         * Draw a straight line from the current drawing position to (x, y) using the current line style; the current drawing position is then set to (x, y).
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        lineTo(x: number, y: number): void;
        /**
         * @language en_US
         * Draw a quadratic Bezier curve from the current drawing position to (anchorX, anchorY) using the current line style according to the control points specified by (controlX, controlY). The current drawing position is then set to (anchorX, anchorY).
         * If the curveTo() method is called before the moveTo() method, the default value of the current drawing position is (0, 0). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * The drawn curve is a quadratic Bezier curve. A quadratic Bezier curve contains two anchor points and one control point. The curve interpolates the two anchor points and bends to the control point.
         * @param controlX A number indicating the horizontal position of the control point, relative to the registration point of the parent display object.
         * @param controlY A number indicating the vertical position of the control point, relative to the registration point of the parent display object.
         * @param anchorX A number indicating the horizontal position of the next anchor point, relative to the registration point of the parent display object.
         * @param anchorY A number indicating the vertical position of the next anchor point, relative to the registration point of the parent display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)。
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * 绘制的曲线是二次贝塞尔曲线。二次贝塞尔曲线包含两个锚点和一个控制点。该曲线内插这两个锚点，并向控制点弯曲。
         * @param controlX 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        /**
         * @language en_US
         * Draws a cubic Bezier curve from the current drawing position to the specified anchor. Cubic Bezier curves consist of two anchor points and two control points. The curve interpolates the two anchor points and two control points to the curve.
         * @param controlX1 Specifies the first control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY1 Specifies the first control point relative to the registration point of the parent display the vertical position of the object.
         * @param controlX2 Specify the second control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY2 Specify the second control point relative to the registration point of the parent display the vertical position of the object.
         * @param anchorX Specifies the anchor point relative to the registration point of the parent display the horizontal position of the object.
         * @param anchorY Specifies the anchor point relative to the registration point of the parent display the vertical position of the object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲。
         * @param controlX1 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY 指定锚点相对于父显示对象的注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        /**
         * @language en_US
         * adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending
         * at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
         * @param x The x coordinate of the arc's center.
         * @param y The y coordinate of the arc's center.
         * @param radius The arc's radius.
         * @param startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
         * @param endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
         * @param anticlockwise if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一段圆弧路径。圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
         * @param x 圆弧中心（圆心）的 x 轴坐标。
         * @param y 圆弧中心（圆心）的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
         * @param endAngle 圆弧的终点， 单位以弧度表示。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         * @version Egret 2.4
         * @platform Web,Native
         */
        drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        /**
         * @private
         * 测量圆弧的矩形大小
         */
        private arcBounds(x, y, radius, startAngle, endAngle);
        /**
         * @language en_US
         * Clear graphics that are drawn to this Graphics object, and reset fill and line style settings.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        clear(): void;
        /**
         * @private
         */
        private minX;
        /**
         * @private
         */
        private minY;
        /**
         * @private
         */
        private maxX;
        /**
         * @private
         */
        private maxY;
        /**
         * @private
         */
        private extendBoundsByPoint(x, y);
        /**
         * @private
         */
        private extendBoundsByX(x);
        /**
         * @private
         */
        private extendBoundsByY(y);
        /**
         * @private
         */
        private updateNodeBounds();
        /**
         * 是否已经包含上一次moveTo的坐标点
         */
        private includeLastPosition;
        /**
         * 更新当前的lineX和lineY值，并标记尺寸失效。
         * @private
         */
        private updatePosition(x, y);
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        /**
         * @private
         *
         */
        $hitTest(stageX: number, stageY: number): DisplayObject;
        /**
         * @private
         */
        $onRemoveFromStage(): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The JointStyle class is an enumeration of constant values that specify the joint style to use in drawing lines.
     * These constants are provided for use as values in the joints parameter of the egret.Graphics.lineStyle() method.
     * @see egret.Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * JointStyle 类是指定要在绘制线条中使用的联接点样式的常量值枚举。提供的这些常量用作 egret.Graphics.lineStyle() 方法的 joints 参数中的值。
     * @see egret.Graphics#lineStyle()
     * @version Egret 2.5
     * @platform Web,Native
     */
    const JointStyle: {
        BEVEL: string;
        MITER: string;
        ROUND: string;
    };
}
declare namespace egret {
    /**
     * @private
     */
    class Mesh extends Bitmap {
        constructor(value?: BitmapData | Texture);
        /**
         * @private
         */
        $render(): void;
        /**
         * @private
         */
        private _verticesDirty;
        private _bounds;
        /**
         * @private
         */
        $updateVertices(): void;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
    }
}
declare namespace egret {
    /**
     * OrientationMode 类为舞台初始旋转模式提供值。
     */
    const OrientationMode: {
        AUTO: string;
        PORTRAIT: string;
        LANDSCAPE: string;
        LANDSCAPE_FLIPPED: string;
    };
}
declare namespace egret {
    let $TextureScaleFactor: number;
    /**
     * @language en_US
     * The Texture class encapsulates different image resources on different platforms.
     * In HTML5, resource is an HTMLElement object
     * In OpenGL / WebGL, resource is a texture ID obtained after the GPU is submitted
     * The Texture class encapsulates the details implemented on the underlayer. Developers just need to focus on interfaces
     * @see http://edn.egret.com/cn/docs/page/135 The use of texture packs
     * @see http://edn.egret.com/cn/docs/page/123 Several ways of access to resources
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Texture.ts
     */
    /**
     * @language zh_CN
     * 纹理类是对不同平台不同的图片资源的封装
     * 在HTML5中，资源是一个HTMLElement对象
     * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
     * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
     * @see http://edn.egret.com/cn/docs/page/135 纹理集的使用
     * @see http://edn.egret.com/cn/docs/page/123 获取资源的几种方式
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Texture.ts
     */
    class Texture extends HashObject {
        /**
         * @language en_US
         * Create an egret.Texture object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.Texture 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @private
         * 表示这个纹理在 bitmapData 上的 x 起始位置
         */
        _bitmapX: number;
        /**
         * @private
         * 表示这个纹理在 bitmapData 上的 y 起始位置
         */
        _bitmapY: number;
        /**
         * @private
         * 表示这个纹理在 bitmapData 上的宽度
         */
        _bitmapWidth: number;
        /**
         * @private
         * 表示这个纹理在 bitmapData 上的高度
         */
        _bitmapHeight: number;
        /**
         * @private
         * 表示这个纹理显示了之后在 x 方向的渲染偏移量
         */
        _offsetX: number;
        /**
         * @private
         * 表示这个纹理显示了之后在 y 方向的渲染偏移量
         */
        _offsetY: number;
        /**
         * @private
         * 纹理宽度
         */
        private _textureWidth;
        /**
         * @language en_US
         * Texture width, read only
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 纹理宽度，只读属性，不可以设置
         * @version Egret 2.4
         * @platform Web,Native
         */
        textureWidth: number;
        $getTextureWidth(): number;
        /**
         * @private
         * 纹理高度
         */
        private _textureHeight;
        /**
         * @language en_US
         * Texture height, read only
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 纹理高度，只读属性，不可以设置
         * @version Egret 2.4
         * @platform Web,Native
         */
        textureHeight: number;
        $getTextureHeight(): number;
        $getScaleBitmapWidth(): number;
        $getScaleBitmapHeight(): number;
        /**
         * @private
         * 表示bitmapData.width
         */
        _sourceWidth: number;
        /**
         * @private
         * 表示bitmapData.height
         */
        _sourceHeight: number;
        /**
         * @private
         */
        _bitmapData: BitmapData;
        /**
         * @language en_US
         * The BitmapData object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 被引用的 BitmapData 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        bitmapData: BitmapData;
        /**
        * @language en_US
        * Set the BitmapData object.
        * @version Egret 3.2.1
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 设置 BitmapData 对象。
         * @version Egret 3.2.1
         * @platform Web,Native
         */
        _setBitmapData(value: BitmapData): void;
        /**
         * @private
         * 设置Texture数据
         * @param bitmapX
         * @param bitmapY
         * @param bitmapWidth
         * @param bitmapHeight
         * @param offsetX
         * @param offsetY
         * @param textureWidth
         * @param textureHeight
         * @param sourceWidth
         * @param sourceHeight
         */
        $initData(bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, sourceWidth: number, sourceHeight: number): void;
        /**
         * @deprecated
         */
        getPixel32(x: number, y: number): number[];
        /**
         * @language en_US
         * Obtain the color value for the specified pixel region
         * @param x  The x coordinate of the pixel region
         * @param y  The y coordinate of the pixel region
         * @param width  The width of the pixel region
         * @param height  The height of the pixel region
         * @returns  Specifies the color value for the pixel region
         * @version Egret 3.2.1
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取指定像素区域的颜色值
         * @param x  像素区域的X轴坐标
         * @param y  像素区域的Y轴坐标
         * @param width  像素点的Y轴坐标
         * @param height  像素点的Y轴坐标
         * @returns  指定像素区域的颜色值
         * @version Egret 3.2.1
         * @platform Web
         */
        getPixels(x: number, y: number, width?: number, height?: number): number[];
        /**
         * @language en_US
         * Convert base64 string, if the picture (or pictures included) cross-border or null
         * @param type Type conversions, such as "image / png"
         * @param rect The need to convert the area
         * @param smoothing Whether to convert data to the smoothing process
         * @returns {any} base64 string
         * @version Egret 2.4
         */
        /**
         * @language zh_CN
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如  "image/png"
         * @param rect 需要转换的区域
         * @returns {any} base64字符串
         * @version Egret 2.4
         */
        toDataURL(type: string, rect?: egret.Rectangle): string;
        /**
         * @language en_US
         * Crop designated area and save it as image.
         * native support only "image / png" and "image / jpeg"; Web browser because of the various implementations are not the same, it is recommended to use only these two kinds.
         * @param type Type conversions, such as "image / png"
         * @param filePath The path name of the image (the home directory for the game's private space, the path can not have "../",Web supports only pass names.)
         * @param rect The need to convert the area
         * @version Egret 2.4
         * @platform Native
         */
        /**
         * @language zh_CN
         * 裁剪指定区域并保存成图片。
         * native只支持 "image/png" 和 "image/jpeg"；Web中由于各个浏览器的实现不一样，因此建议也只用这2种。
         * @param type 转换的类型，如  "image/png"
         * @param filePath 图片的名称的路径（主目录为游戏的私有空间，路径中不能有 "../"，Web只支持传名称。）
         * @param rect 需要转换的区域
         * @version Egret 2.4
         * @platform Native
         */
        saveToFile(type: string, filePath: string, rect?: egret.Rectangle): void;
        /**
         * @language en_US
         * dispose texture
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放纹理
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispose(): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * RenderTexture is a dynamic texture
     * @extends egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/RenderTexture.ts
     */
    /**
     * @language zh_CN
     * RenderTexture 是动态纹理类，他实现了将显示对象及其子对象绘制成为一个纹理的功能
     * @extends egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/RenderTexture.ts
     */
    class RenderTexture extends egret.Texture {
        constructor();
        $renderBuffer: sys.RenderBuffer;
        /**
         * @language en_US
         * The specified display object is drawn as a texture
         * @param displayObject {egret.DisplayObject} the display to draw
         * @param clipBounds {egret.Rectangle} clip rect
         * @param scale {number} scale factor
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定显示对象绘制为一个纹理
         * @param displayObject {egret.DisplayObject} 需要绘制的显示对象
         * @param clipBounds {egret.Rectangle} 绘制矩形区域
         * @param scale {number} 缩放比例
         * @version Egret 2.4
         * @platform Web,Native
         */
        drawToTexture(displayObject: egret.DisplayObject, clipBounds?: Rectangle, scale?: number): boolean;
        /**
         * @inheritDoc
         */
        getPixel32(x: number, y: number): number[];
        /**
         * @inheritDoc
         */
        dispose(): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * This class is used to create lightweight shapes using the drawing application program interface (API). The Shape
     * class includes a graphics property, which lets you access methods from the Graphics class.
     * @see egret.Graphics
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Shape.ts
     */
    /**
     * @language zh_CN
     * 此类用于使用绘图应用程序编程接口 (API) 创建简单形状。Shape 类含有 graphics 属性，通过该属性您可以访问各种矢量绘图方法。
     * @see egret.Graphics
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Shape.ts
     */
    class Shape extends DisplayObject {
        /**
         * @language en_US
         * Creates a new Shape object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 Shape 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @private
         */
        $graphics: Graphics;
        /**
         * @language en_US
         * Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取 Shape 中的 Graphics 对象。可通过此对象执行矢量绘图命令。
         * @version Egret 2.4
         * @platform Web,Native
         */
        graphics: Graphics;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        $hitTest(stageX: number, stageY: number): DisplayObject;
        /**
         * @private
         */
        $onRemoveFromStage(): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Sprite class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Sprite.ts
     */
    /**
     * @language zh_CN
     * Sprite 类是基本显示列表构造块：一个可包含子项的显示列表节点。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Sprite.ts
     */
    class Sprite extends DisplayObjectContainer {
        /**
         * @language en_US
         * Creates a new Sprite instance.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 实例化一个容器
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @private
         */
        $graphics: Graphics;
        /**
         * @language en_US
         * Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取 Shape 中的 Graphics 对象。可通过此对象执行矢量绘图命令。
         * @version Egret 2.4
         * @platform Web,Native
         */
        graphics: Graphics;
        $hitTest(stageX: number, stageY: number): DisplayObject;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        /**
         * @private
         */
        $onRemoveFromStage(): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * SpriteSheet is a mosaic of multiple sub-bitmaps, comprising a plurality of Texture objects.
     * Each Texture object shares the set bitmap of SpriteSheet, but it points to its different areas.
     * On WebGL / OpenGL, this operation can significantly improve performance.
     * At the same time, SpriteSheet can carry out material integration easily to reduce the number of HTTP requests
     * For specification of the SpriteSheet format, see the document https://github.com/egret-labs/egret-core/wiki/Egret-SpriteSheet-Specification
     * @see http://edn.egret.com/cn/docs/page/135 The use of texture packs
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/SpriteSheet.ts
     */
    /**
     * @language zh_CN
     * SpriteSheet 是一张由多个子位图拼接而成的集合位图，它包含多个 Texture 对象。
     * 每一个 Texture 都共享 SpriteSheet 的集合位图，但是指向它的不同的区域。
     * 在WebGL / OpenGL上，这种做法可以显著提升性能
     * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
     * SpriteSheet 格式的具体规范可以参见此文档  https://github.com/egret-labs/egret-core/wiki/Egret-SpriteSheet-Specification
     * @see http://edn.egret.com/cn/docs/page/135 纹理集的使用
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/SpriteSheet.ts
     */
    class SpriteSheet extends HashObject {
        /**
         * @language en_US
         * Create an egret.SpriteSheet object
         * @param texture {Texture} Texture
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.SpriteSheet 对象
         * @param texture {Texture} 纹理
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(texture: Texture);
        /**
         * @private
         * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置x。
         */
        private _bitmapX;
        /**
         * @private
         * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置y。
         */
        private _bitmapY;
        /**
         * @private
         * 共享的位图数据
         */
        $texture: Texture;
        /**
         * @private
         * 纹理缓存字典
         */
        _textureMap: MapLike<Texture>;
        /**
         * @language en_US
         * Obtain a cached Texture object according to the specified texture name
         * @param name {string} Cache the name of this Texture object
         * @returns {egret.Texture} The Texture object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据指定纹理名称获取一个缓存的 Texture 对象
         * @param name {string} 缓存这个 Texture 对象所使用的名称
         * @returns {egret.Texture} Texture 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        getTexture(name: string): Texture;
        /**
         * @language en_US
         * Create a new Texture object for the specified area on SpriteSheet and cache it
         * @param name {string} Cache the name of this Texture object. If the name already exists, the previous Texture object will be overwrited.
         * @param bitmapX {number} Starting coordinate x of texture area on bitmapData
         * @param bitmapY {number} Starting coordinate y of texture area on bitmapData
         * @param bitmapWidth {number} Width of texture area on bitmapData
         * @param bitmapHeight {number} Height of texture area on bitmapData
         * @param offsetX {number} Starting point x for a non-transparent area of the original bitmap
         * @param offsetY {number} Starting point y for a non-transparent area of the original bitmap
         * @param textureWidth {number} Width of the original bitmap. If it is not passed, use the bitmapWidth  value.
         * @param textureHeight {number} Height of the original bitmap. If it is not passed, use the bitmapHeight value.
         * @returns {egret.Texture} The created Texture object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 为 SpriteSheet 上的指定区域创建一个新的 Texture 对象并缓存它
         * @param name {string} 缓存这个 Texture 对象所使用的名称，如果名称已存在，将会覆盖之前的 Texture 对象
         * @param bitmapX {number} 纹理区域在 bitmapData 上的起始坐标x
         * @param bitmapY {number} 纹理区域在 bitmapData 上的起始坐标y
         * @param bitmapWidth {number} 纹理区域在 bitmapData 上的宽度
         * @param bitmapHeight {number} 纹理区域在 bitmapData 上的高度
         * @param offsetX {number} 原始位图的非透明区域 x 起始点
         * @param offsetY {number} 原始位图的非透明区域 y 起始点
         * @param textureWidth {number} 原始位图的高度，若不传入，则使用 bitmapWidth 的值。
         * @param textureHeight {number} 原始位图的宽度，若不传入，则使用 bitmapHeight 的值。
         * @returns {egret.Texture} 创建的 Texture 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        createTexture(name: string, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX?: number, offsetY?: number, textureWidth?: number, textureHeight?: number): Texture;
        /**
         * @language en_US
         * dispose texture
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放纹理
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispose(): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Stage class represents the main drawing area.The Stage object is not globally accessible. You need to access
     * it through the stage property of a DisplayObject instance.<br/>
     * The Stage class has several ancestor classes — Sprite, DisplayObject, and EventDispatcher — from which it inherits
     * properties and methods. Many of these properties and methods are inapplicable to Stage objects.
     * @event egret.Event.RESIZE Dispatched when the stageWidth or stageHeight property of the Stage object is changed.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Stage.ts
     */
    /**
     * @language zh_CN
     * Stage 类代表主绘图区。
     * 可以利用 DisplayObject 实例的 stage 属性进行访问。<br/>
     * Stage 类具有多个祖代类: Sprite、DisplayObject 和 EventDispatcher，属性和方法便是从这些类继承而来的。
     * 从这些继承的许多属性和方法不适用于 Stage 对象。
     * @event egret.Event.RESIZE 当stageWidth或stageHeight属性发生改变时调度
     * @event egret.Event.DEACTIVATE 当stage失去焦点后调度
     * @event egret.Event.ACTIVATE 当stage获得焦点后调度
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Stage.ts
     */
    class Stage extends DisplayObjectContainer {
        /**
         * @private
         * Stage不许允许自行实例化
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @language en_US
         * Gets and sets the frame rate of the stage. The frame rate is defined as frames per second. Valid range for the
         * frame rate is from 0.01 to 1000 frames per second.<br/>
         * Note: setting the frameRate property of one Stage object changes the frame rate for all Stage objects
         * @default 30
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取并设置舞台的帧速率。帧速率是指每秒显示的帧数。帧速率的有效范围为每秒 0.01 到 60 个帧。<br/>
         * 注意: 修改任何一个Stage的frameRate属性都会同步修改其他Stage的帧率。
         * @default 30
         * @version Egret 2.4
         * @platform Web,Native
         */
        frameRate: number;
        /**
         * @private
         */
        $stageWidth: number;
        /**
         * @language en_US
         * Indicates the width of the stage, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 舞台的当前宽度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        stageWidth: number;
        /**
         * @private
         */
        $stageHeight: number;
        /**
         * @language en_US
         * Indicates the height of the stage, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 舞台的当前高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        stageHeight: number;
        /**
         * @language en_US
         * After you call the invalidate() method, when the display list is next rendered, the Egret runtime sends a render
         * event to each display object that has registered to listen for the render event. You must call the invalidate()
         * method each time you want the Egret runtime to send render events.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 调用 invalidate() 方法后，在显示列表下次呈现时，Egret 会向每个已注册侦听 Event.RENDER 事件的显示对象发送一个 Event.RENDER 事件。
         * 每次您希望 Egret 发送 Event.RENDER 事件时，都必须调用 invalidate() 方法。
         * @version Egret 2.4
         * @platform Web,Native
         */
        invalidate(): void;
        /**
         * @deprecated
         */
        registerImplementation(interfaceName: string, instance: any): void;
        /**
         * @deprecated
         */
        getImplementation(interfaceName: string): any;
        /**
         * @private
         * 设备屏幕引用
         */
        $screen: egret.sys.Screen;
        $scaleMode: string;
        /**
         * @language en_US
         * A StageScaleMode class that specifies which scale mode to use. The following are valid values:<br/>
         * <ul>
         * <li>StageScaleMode.EXACT_FIT -- The entire application be visible in the specified area without trying to preserve the original aspect ratio. Distortion can occur, the application may be stretched or compressed.</li>
         * <li>StageScaleMode.SHOW_ALL -- The entire application is visible in the specified area without distortion while maintaining the application of the original aspect ratio. Applications may display border.</li>
         * <li>StageScaleMode.NO_SCALE -- The size of the entire application is fixed, so that even if the size of the player window changes, it remains unchanged. If the player window is smaller than the content, it may do some trimming.</li>
         * <li>StageScaleMode.NO_BORDER -- Keep the original aspect ratio scaling application content, after scaling a narrow direction of application content to fill the viewport players on both sides in the other direction may exceed the viewport and the player is cut.</li>
         * <li>StageScaleMode.FIXED_WIDTH -- Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant width, height may change.</li>
         * <li>StageScaleMode.FIXED_HEIGHT -- Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant height, width may change.</li>
         * </ul>
         * @default egret.StageScaleMode.SHOW_ALL
         */
        /**
         * @language zh_CN
         * 一个 StageScaleMode 类中指定要使用哪种缩放模式的值。以下是有效值：<br/>
         * <ul>
         * <li>StageScaleMode.EXACT_FIT -- 整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲，应用程序可能会拉伸或压缩显示。</li>
         * <li>StageScaleMode.SHOW_ALL -- 整个应用程序在指定区域中可见，且不发生扭曲，同时保持应用程序的原始高宽比。应用程序的可能会显示边框。</li>
         * <li>StageScaleMode.NO_SCALE -- 整个应用程序的大小固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。</li>
         * <li>StageScaleMode.NO_BORDER -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较窄方向填满播放器视口，另一个方向的两侧可能会超出播放器视口而被裁切。</li>
         * <li>StageScaleMode.FIXED_WIDTH -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始宽度不变，高度可能会改变。</li>
         * <li>StageScaleMode.FIXED_HEIGHT -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始高度不变，宽度可能会改变。</li>
         * </ul>
         * @default egret.StageScaleMode.SHOW_ALL
         */
        scaleMode: string;
        $orientation: string;
        /**
         * @language en_US
         * Horizontal and vertical screen display screen, can only be set under the current Native in the configuration file. A egret.OrientationMode class that specifies which display mode to use. The following are valid values:<br/>
         * <ul>
         * <li>egret.OrientationMode.AUTO -- Always follow the direction of application display screen, always guaranteed by the look down.</li>
         * <li>egret.OrientationMode.PORTRAIT -- Applications remain portrait mode, namely horizontal screen look, the screen from left to right.</li>
         * <li>egret.OrientationMode.LANDSCAPE -- Applications remain horizontal screen mode, namely vertical screen, the screen from right to left.</li>
         * <li>egret.OrientationMode.LANDSCAPE_FLIPPED -- Applications remain horizontal screen mode, namely vertical screen, the screen from left to right.</li>
         * </ul>
         * @platform Web
         * @version 2.4
         */
        /**
         * @language zh_CN
         * 屏幕横竖屏显示方式，目前 Native 下只能在配置文件里设置。一个 egret.OrientationMode 类中指定要使用哪种显示方式。以下是有效值：<br/>
         * <ul>
         * <li>egret.OrientationMode.AUTO -- 应用始终跟随屏幕的方向显示，始终保证由上往下看。</li>
         * <li>egret.OrientationMode.PORTRAIT -- 应用始终保持竖屏模式，即横屏看时，屏幕由左往右看。</li>
         * <li>egret.OrientationMode.LANDSCAPE -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由右往左。</li>
         * <li>egret.OrientationMode.LANDSCAPE_FLIPPED -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由左往右。</li>
         * </ul>
         * @platform Web
         * @version 2.4
         */
        orientation: string;
        /**
         * @language en_US
         * Draw texture zoom ratio
         * @default 1
         */
        /**
         * @language zh_CN
         * 绘制纹理的缩放比率，默认值为1
         * @default 1
         */
        textureScaleFactor: number;
        $maxTouches: number;
        /**
         * @language en_US
         * Set the number of screens can simultaneously touch. Above this amount will not be triggered in response.
         * @default 99
         */
        /**
         * @language zh_CN
         * 设置屏幕同时可以触摸的数量。高于这个数量将不会被触发响应。
         * @default 99
         */
        maxTouches: number;
        private $dirtyRegionPolicy;
        /**
         * @language en_US
         * Set dirty region policy
         * One of the constants defined by egret.DirtyRegionPolicy
         * @version Egret 2.5.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置脏矩形策略
         * egret.DirtyRegionPolicy 定义的常量之一
         * @version Egret 2.5.5
         * @platform Web,Native
         */
        dirtyRegionPolicy: string;
        /**
         * @language en_US
         * Set resolution size
         * @param width width
         * @param height height
         * @version Egret 2.5.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置分辨率尺寸
         * @param width 宽度
         * @param height 高度
         * @version Egret 2.5.5
         * @platform Web,Native
         */
        setContentSize(width: number, height: number): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to event
     * listeners when an event occurs.The properties of the Event class carry basic information about an event, such as
     * the event's type or whether the event's default behavior can be canceled. For many events, such as the events represented
     * by the Event class constants, this basic information is sufficient. Other events, however, may require more detailed
     * information. Events associated with a touch tap, for example, need to include additional information about the
     * location of the touch event. You can pass such additional information to event listeners by extending the Event class,
     * which is what the TouchEvent class does. Egret API defines several Event subclasses for common events that require
     * additional information. Events associated with each of the Event subclasses are described in the documentation for
     * each class.The methods of the Event class can be used in event listener functions to affect the behavior of the event
     * object. Some events have an associated default behavior. Your event listener can cancel this behavior by calling the
     * preventDefault() method. You can also make the current event listener the last one to process an event by calling
     * the stopPropagation() or stopImmediatePropagation() method.
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/Event.ts
     * @see http://edn.egret.com/cn/docs/page/798 取消触摸事件
     */
    /**
     * @language zh_CN
     * Event 类作为创建事件实例的基类，当发生事件时，Event 实例将作为参数传递给事件侦听器。Event 类的属性包含有关事件的基本信息，例如事件
     * 的类型或者是否可以取消事件的默认行为。对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。但其他事件可能需要更详细的信息。
     * 例如，与触摸关联的事件需要包括有关触摸事件的位置信息。您可以通过扩展 Event 类（TouchEvent 类执行的操作）将此类其他信息传递给事件侦听器。
     * Egret API 为需要其他信息的常见事件定义多个 Event 子类。与每个 Event 子类关联的事件将在每个类的文档中加以介绍。Event 类的方法可以在
     * 事件侦听器函数中使用以影响事件对象的行为。某些事件有关联的默认行为，通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
     * 可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/Event.ts
     * @see http://edn.egret.com/cn/docs/page/798 取消触摸事件
     */
    class Event extends HashObject {
        /**
         * @language en_US
         * Dispatched when a display object is added to the on stage display list, either directly or through the addition
         * of a sub tree in which the display object is contained.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ADDED_TO_STAGE: string;
        /**
         * @language en_US
         * Dispatched when a display object is about to be removed from the display list, either directly or through the removal
         * of a sub tree in which the display object is contained.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static REMOVED_FROM_STAGE: string;
        /**
         * @language en_US
         * Dispatched when a display object is added to the display list.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将显示对象添加到显示列表中时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ADDED: string;
        /**
         * @language en_US
         * Dispatched when a display object is about to be removed from the display list.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将要从显示列表中删除显示对象时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static REMOVED: string;
        /**
         * @language en_US
         * [broadcast event] Dispatched when the playhead is entering a new frame.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [广播事件] 进入新的一帧,监听此事件将会在下一帧开始时触发一次回调。这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ENTER_FRAME: string;
        /**
         * @language en_US
         * Dispatched when the display list is about to be updated and rendered.
         * Note: Every time you want to receive a render event,you must call the stage.invalidate() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 渲染事件，监听此事件将会在本帧末即将开始渲染的前一刻触发回调，这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
         * 注意：每次您希望 Egret 发送 Event.RENDER 事件时，都必须调用 stage.invalidate() 方法，由于每帧只会触发一次屏幕刷新，
         * 若在 Event.RENDER 回调函数执行期间再次调用stage.invalidate()，将会被忽略。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static RENDER: string;
        /**
         * @language en_US
         * Dispatched when the size of stage or UIComponent is changed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 舞台尺寸或UI组件尺寸发生改变
         * @version Egret 2.4
         * @platform Web,Native
         */
        static RESIZE: string;
        /**
         * @language en_US
         * Dispatched when the value or selection of a property is chaned.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 属性值或状态发生改变。通常是按钮的选中状态，或者列表的选中项索引改变。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static CHANGE: string;
        /**
         * @language en_US
         * Dispatched when the value or selection of a property is going to change.you can cancel this by calling the
         * preventDefault() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 属性值或状态即将发生改变,通常是按钮的选中状态，或者列表的选中项索引改变。可以通过调用 preventDefault() 方法阻止索引发生更改。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static CHANGING: string;
        /**
         * @language en_US
         * Dispatched when the net request is complete.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 网络请求加载完成
         * @version Egret 2.4
         * @platform Web,Native
         */
        static COMPLETE: string;
        /**
         * @language en_US
         * Dispatched when loop completed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 循环完成
         * @version Egret 2.4
         * @platform Web,Native
         */
        static LOOP_COMPLETE: string;
        /**
         * @language en_US
         * Dispatched when the TextInput instance gets focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * TextInput实例获得焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        static FOCUS_IN: string;
        /**
         * @language en_US
         * Dispatched when the TextInput instance loses focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * TextInput实例失去焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        static FOCUS_OUT: string;
        /**
         * @language en_US
         * Dispatched when the playback is ended.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 动画声音等播放完成
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ENDED: string;
        /**
         * 游戏激活
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ACTIVATE: string;
        /**
         * 取消激活
         * @version Egret 2.4
         * @platform Web,Native
         */
        static DEACTIVATE: string;
        /**
         * Event.CLOSE 常量定义 close 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static CLOSE: string;
        /**
         * Event.CONNECT 常量定义 connect 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static CONNECT: string;
        /**
         * Event.LEAVE_STAGE 常量定义 leaveStage 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static LEAVE_STAGE: string;
        /**
         * Event.SOUND_COMPLETE 常量定义 在声音完成播放后调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static SOUND_COMPLETE: string;
        /**
         * @language en_US
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param data the optional data associated with this event
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param data 与此事件对象关联的可选数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any);
        /**
         * @language en_US
         * the optional data associated with this event
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 与此事件对象关联的可选数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        data: any;
        /**
         * @private
         */
        $type: string;
        /**
         * @language en_US
         * The type of event. The type is case-sensitive.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件的类型。类型区分大小写。
         * @version Egret 2.4
         * @platform Web,Native
         */
        type: string;
        /**
         * @private
         */
        $bubbles: boolean;
        /**
         * @language en_US
         * Indicates whether an event is a bubbling event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        bubbles: boolean;
        /**
         * @private
         */
        $cancelable: boolean;
        /**
         * @language en_US
         * Indicates whether the behavior associated with the event can be prevented. If the behavior can be
         * canceled, this value is true; otherwise it is false.
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        cancelable: boolean;
        /**
         * @private
         */
        $eventPhase: number;
        /**
         * @language en_US
         * The current phase in the event flow. This property can contain the following numeric values:
         * The capture phase (EventPhase.CAPTURING_PHASE).
         * The target phase (EventPhase.AT_TARGET)
         * The bubbling phase (EventPhase.BUBBLING_PHASE).
         * @see egret.EventPhase
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件流中的当前阶段。此属性可以包含以下数值：
         * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
         * 目标阶段 (EventPhase.AT_TARGET)。
         * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
         * @see egret.EventPhase
         * @version Egret 2.4
         * @platform Web,Native
         */
        eventPhase: number;
        /**
         * @private
         */
        $currentTarget: any;
        /**
         * @language en_US
         * The object that is actively processing the Event object with an event listener. For example, if a
         * user clicks an OK button, the current target could be the node containing that button or one of its ancestors
         * that has registered an event listener for that event.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
         * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
         * @version Egret 2.4
         * @platform Web,Native
         */
        currentTarget: any;
        /**
         * @private
         */
        $target: any;
        /**
         * @language en_US
         * The event target. This property contains the target node. For example, if a user clicks an OK button,
         * the target node is the display list node containing that button.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        target: any;
        $setTarget(target: any): boolean;
        /**
         * @private
         */
        $isDefaultPrevented: boolean;
        /**
         * @language en_US
         * Checks whether the preventDefault() method has been called on the event. If the preventDefault() method has been
         * called, returns true; otherwise, returns false.
         * @returns If preventDefault() has been called, returns true; otherwise, returns false.
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检查是否已对事件调用 preventDefault() 方法。
         * @returns 如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        isDefaultPrevented(): boolean;
        /**
         * @language en_US
         * Cancels an event's default behavior if that behavior can be canceled.Many events have associated behaviors that
         * are carried out by default. For example, if a user types a character into a text input, the default behavior
         * is that the character is displayed in the text input. Because the TextEvent.TEXT_INPUT event's default behavior
         * can be canceled, you can use the preventDefault() method to prevent the character from appearing.
         * You can use the Event.cancelable property to check whether you can prevent the default behavior associated with
         * a particular event. If the value of Event.cancelable is true, then preventDefault() can be used to cancel the event;
         * otherwise, preventDefault() has no effect.
         * @see #cancelable
         * @see #isDefaultPrevented
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果可以取消事件的默认行为，则取消该行为。
         * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
         * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
         * 您可以使用 Event.cancelable 属性来检查是否可以防止与特定事件关联的默认行为。如果 Event.cancelable 的值为 true，
         * 则可以使用 preventDefault() 来取消事件；否则，preventDefault() 无效。
         * @see #cancelable
         * @see #isDefaultPrevented
         * @version Egret 2.4
         * @platform Web,Native
         */
        preventDefault(): void;
        /**
         * @private
         */
        $isPropagationStopped: boolean;
        /**
         * @language en_US
         * Prevents processing of any event listeners in nodes subsequent to the current node in the event flow. This method
         * does not affect any event listeners in the current node (currentTarget). In contrast, the stopImmediatePropagation()
         * method prevents processing of event listeners in both the current node and subsequent nodes. Additional calls to this
         * method have no effect. This method can be called in any phase of the event flow.<br/>
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopImmediatePropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 currentTarget 中的任何事件侦听器。
         * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
         * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。<br/>
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @see #stopImmediatePropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        stopPropagation(): void;
        /**
         * @private
         */
        $isPropagationImmediateStopped: boolean;
        /**
         * @language en_US
         * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
         * This method takes effect immediately, and it affects event listeners in the current node. In contrast, the
         * stopPropagation() method doesn't take effect until all the event listeners in the current node finish processing.<br/>
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopPropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
         * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。<br/>
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @see #stopPropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        stopImmediatePropagation(): void;
        /**
         * @language en_US
         * This method will be called automatically when you pass the event object as the parameters to the Event.release() method.
         * If your custom event is designed for reusable,you should override this method to make sure all the references to external
         * objects are cleaned. if not,it may cause memory leaking.
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当事件实例传递给Event.release()静态方法时，实例上的clean()方法将会被自动调用。
         * 若此自定义事件的实例设计为可以循环复用的，为了避免引起内存泄露，自定义事件需要覆盖此方法来确保实例被缓存前断开对外部对象的一切引用。
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        protected clean(): void;
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. Objects thrown objects will be cached in the pool for the next round robin.
         * @param target the event target
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param data {any} data
         * @method egret.Event.dispatchEvent
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的 EventDispatcher 对象来抛出 Event 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @method egret.Event.dispatchEvent
         * @version Egret 2.4
         * @platform Web,Native
         */
        static dispatchEvent(target: IEventDispatcher, type: string, bubbles?: boolean, data?: any): boolean;
        /**
         * @private
         *
         * @param EventClass
         * @returns
         */
        static _getPropertyData(EventClass: any): any;
        /**
         * @language en_US
         * Gets one event instance from the object pool or create a new one. We highly recommend using the Event.create()
         * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
         * which allows you to get better code execution performance.<br/>
         * Note: If you want to use this method to initialize your custom event object,you must make sure the constructor
         * of your custom event is the same as the constructor of egret.Event.
         * @param EventClass Event Class。
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @example
         * <pre>
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data;    //optional,initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的事件实例。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：若使用此方法来创建自定义事件的实例，自定义的构造函数参数列表必须跟Event类一致。
         * @param EventClass Event类名。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @example
         * <pre>
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data;  //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        static create<T extends Event>(EventClass: {
            new (type: string, bubbles?: boolean, cancelable?: boolean): T;
            eventPool?: Event[];
        }, type: string, bubbles?: boolean, cancelable?: boolean): T;
        /**
         * @language en_US
         * Releases an event object and cache it into the object pool.We highly recommend using the Event.create()
         * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
         * which allows you to get better code execution performance.<br/>
         * Note: The parameters of this method only accepts an instance created by the Event.create() method.
         * if not,it may throw an error.
         * @example
         * <pre>
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data; //optional,initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个事件对象，并缓存到对象池。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：此方法只能传入由Event.create()创建的事件实例，传入非法对象实例可能会导致报错。
         * @example
         * <pre>
         *    let event = Event.create(Event,type, bubbles);
         *    event.data = data;   //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        static release(event: Event): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The EventPhase class provides values for the eventPhase property of the Event class.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventPhase.ts
     */
    /**
     * @language zh_CN
     * EventPhase 可为 Event 类的 eventPhase 属性提供值。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventPhase.ts
     */
    const enum EventPhase {
        /**
         * @language en_US
         * The capturing phase, which is the first phase of the event flow.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 捕获阶段。
         * @version Egret 2.4
         * @platform Web,Native
         */
        CAPTURING_PHASE = 1,
        /**
         * @language en_US
         * The target phase, which is the second phase of the event flow.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 目标阶段，是事件流的第二个阶段。
         * @version Egret 2.4
         * @platform Web,Native
         */
        AT_TARGET = 2,
        /**
         * @language en_US
         * The bubbling phase, which is the third phase of the event flow.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 冒泡阶段。
         * @version Egret 2.4
         * @platform Web,Native
         */
        BUBBLING_PHASE = 3,
    }
}
declare namespace egret {
    /**
     * @language en_US
     * When the user changes the focus from one object in the display list to another object, the object dispatches a FocusEvent object. Currently only supports input text.
     * Focus events: FocusEvent.FOCUS_IN FocusEvent.FOCUS_OUT
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 用户将焦点从显示列表中的一个对象更改到另一个对象时，对象将调度 FocusEvent 对象。目前只支持输入文本。
     * 焦点事件：FocusEvent.FOCUS_IN FocusEvent.FOCUS_OUT
     * @version Egret 2.4
     * @platform Web,Native
     */
    class FocusEvent extends egret.Event {
        /**
         * @language en_US
         * Gets focus
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获得焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        static FOCUS_IN: string;
        /**
         * @language en_US
         * Loses focus
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 失去焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        static FOCUS_OUT: string;
        /**
         * @language en_US
         * Create a egret.FocusEvent objects
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.FocusEvent 对象
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The GeolocationEvent represents the position and altitude of the device on Earth,
     * and show errors occurred while getting the location of the device.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Geolocation.ts
     * @see http://edn.egret.com/cn/docs/page/662 获取位置信息
     */
    /**
     * @language zh_CN
     * GeolocationEvent 提供设备的地理位置信息和获取位置时发生的错误信息
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Geolocation.ts
     * @see http://edn.egret.com/cn/docs/page/662 获取位置信息
     */
    class GeolocationEvent extends Event {
        /**
         * @language en_US
         * The acquisition of the location information failed because of app don't have permission.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由于用户拒绝访问位置信息，获取位置信息失败
         * @version Egret 2.4
         * @platform Web,Native
         */
        static PERMISSION_DENIED: string;
        /**
         * @language en_US
         * The acquisition of the location failed because at least one internal source of position returned an internal error.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设备位置服务不可用或者超时等原因没有得到位置信息
         * @version Egret 2.4
         * @platform Web,Native
         */
        static UNAVAILABLE: string;
        /**
         * @language en_US
         * The position's longitude in decimal degrees.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前位置的经度信息
         * @version Egret 2.4
         * @platform Web,Native
         */
        longitude: number;
        /**
         * @language en_US
         * The position's latitude in decimal degrees.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前位置的纬度信息
         * @version Egret 2.4
         * @platform Web,Native
         */
        latitude: number;
        /**
         * @language en_US
         * The velocity of the device in meters per second. This value can be null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前设备的速度 单位是 米/秒，这个值可能为 null
         * @version Egret 2.4
         * @platform Web,Native
         */
        speed: number;
        /**
         * @language en_US
         * The direction in which the device is traveling. This value, specified in degrees,
         * indicates how far off from heading due north the device is. 0 degrees represents
         * true true north, and the direction is determined clockwise (which means that east
         * is 90 degrees and west is 270 degrees). If speed is 0, heading is NaN. If the
         * device is unable to provide heading information, this value is null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示设备正在前进的方向，单位是度。heading 表示从正北开始顺时针旋转到当前方向的角度，
         * 比如正东是 90 度，正西是 270 度，如果 speed 是 0，heading 为 NaN。
         * @version Egret 2.4
         * @platform Web,Native
         */
        heading: number;
        /**
         * @language en_US
         * The position's altitude in metres, relative to sea level.
         * This value can be null if the implementation cannot provide the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 该位置的海拔信息，如果设备没有实现这个属性时，这个值有可能为 null
         * @version Egret 2.4
         * @platform Web,Native
         */
        altitude: number;
        /**
         * @language en_US
         * The accuracy of the latitude and longitude properties, expressed in meters.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 经纬度的准确性，单位是米
         * @version Egret 2.4
         * @platform Web,Native
         */
        accuracy: number;
        /**
         * @language en_US
         * The accuracy of the altitude expressed in meters. This value can be null.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 该位置海拔信息的准确性，单位是米，这个值有可能为 null
         * @version Egret 2.4
         * @platform Web,Native
         */
        altitudeAccuracy: number;
        /**
         * @language en_US
         * The type of error occurred while get the location of the device. The value could be:
         * @see egret.GeolocationEvent.PERMISSION_DENIED
         * @see egret.GeolocationEvent.UNAVAILABLE
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取位置信息错误时的错误类型。值可能为：
         * @see egret.GeolocationEvent.PERMISSION_DENIED
         * @see egret.GeolocationEvent.UNAVAILABLE
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        errorType: string;
        /**
         * @language en_US
         * The error message occurred while get the location of the device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取位置信息错误的错误信息
         * @version Egret 2.4
         * @platform Web,Native
         */
        errorMessage: string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * When a network request returns an HTTP status code, the application dispatches HTTPStatusEvent objects.
     * Before error or completion events will always send HTTPStatusEvent object. HTTPStatusEvent object does not necessarily indicate an error condition; it simply reflects the HTTP status code provided by the network stack (if any).
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 在网络请求返回 HTTP 状态代码时，应用程序将调度 HTTPStatusEvent 对象。
     * 在错误或完成事件之前，将始终发送 HTTPStatusEvent 对象。HTTPStatusEvent 对象不一定表示错误条件；它仅反映网络堆栈提供的 HTTP 状态代码（如果有的话）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    class HTTPStatusEvent extends Event {
        /**
         * @language en_US
         * HTTPStatusEvent.HTTP_STATUS constant defines the value of the type property httpStatus event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * HTTPStatusEvent.HTTP_STATUS 常量定义 httpStatus 事件对象的 type 属性值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static HTTP_STATUS: string;
        /**
         * @language en_US
         * Create a egret.HTTPStatusEvent objects
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.HTTPStatusEvent 对象
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * @private
         */
        private _status;
        /**
         * @language en_US
         * he server returns the HTTP status code.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由服务器返回的 HTTP 状态代码。
         * @version Egret 2.4
         * @platform Web,Native
         */
        status: number;
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. The objects will be thrown in the object cache pool for the next round robin.
         * @param target {egret.IEventDispatcher} Distribute event target
         * @param status {number} The server returns the HTTP status code
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param status {number} 由服务器返回的 HTTP 状态代码
         * @version Egret 2.4
         * @platform Web,Native
         */
        static dispatchHTTPStatusEvent(target: IEventDispatcher, status: number): boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The IEventDispatcher interface defines methods for adding or removing event listeners, checks whether specific types
     * of event listeners are registered, and dispatches events. Event targets are an important part of the Egret event model.
     * The event target serves as the focal point for how events flow through the display list hierarchy. When an event
     * such as a touch tap occurs, an event object is dispatched into the event flow from the root of the display list.
     * The event object makes a round-trip journey to the event target, which is conceptually divided into three phases: <br/>
     * the capture phase includes the journey from the root to the last node before the event target's node; the target
     * phase includes only the event target node; and the bubbling phase includes any subsequent nodes encountered on the
     * return trip to the root of the display list.In general, the easiest way for a user-defined class to gain event
     * dispatching capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already
     * extending another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member,
     * and write simple hooks to route calls into the aggregated EventDispatcher.
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/IEventDispatcher.ts
     */
    /**
     * @language zh_CN
     * IEventDispatcher 接口定义用于添加或删除事件侦听器的方法，检查是否已注册特定类型的事件侦听器，并调度事件。
     * 事件目标是 Egret 事件模型的重要组成部分。事件目标是事件如何通过显示列表层次结构这一问题的焦点。当发生触摸轻拍事件时，
     * 会将事件对象调度到从显示列表根开始的事件流中。事件对象进行到事件目标的往返行程，在概念上，此往返行程被划分为三个阶段：<br/>
     * 捕获阶段包括从根到事件目标节点之前的最后一个节点的行程，目标阶段仅包括事件目标节点，冒泡阶段包括到显示列表的根的回程上遇到的任何后续节点。
     * 通常，使用户定义的类能够调度事件的最简单方法是扩展 EventDispatcher。如果无法扩展（即，如果该类已经扩展了另一个类），
     * 则可以实现 IEventDispatcher 接口，创建 EventDispatcher 成员，并编写一些简单的挂钩，将调用连接到聚合的 EventDispatcher 中。
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/IEventDispatcher.ts
     */
    interface IEventDispatcher extends HashObject {
        /**
         * @language en_US
         * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an
         * event. You can register event listeners on all nodes in the display list for a specific type of event, phase,
         * and priority.After you successfully register an event listener, you cannot change its priority through additional
         * calls to on(). To change a listener's priority, you must first call removeEventListener(). Then you can register the
         * listener again with the new priority level.After the listener is registered, subsequent calls to on() with a
         * different value for either type or useCapture result in the creation of a separate listener registration. <br/>
         * When you no longer need an event listener, remove it by calling EventDispatcher.removeEventListener(); otherwise, memory
         * problems might result. Objects with registered event listeners are not automatically removed from memory because
         * the garbage collector does not remove objects that still have references.Copying an EventDispatcher instance does
         * not copy the event listeners attached to it. (If your newly created node needs an event listener, you must attach
         * the listener after creating the node.) However, if you move an EventDispatcher instance, the event listeners attached
         * to it move along with it.If the event listener is being registered on a node while an event is also being processed
         * on this node, the event listener is not triggered during the current phase but may be triggered during a later phase
         * in the event flow, such as the bubbling phase.If an event listener is removed from a node while an event is being
         * processed on the node, it is still triggered by the current actions. After it is removed, the event listener is
         * never invoked again (unless it is registered again for future processing).
         * @param type The type of event.
         * @param listener The listener function that processes the event. This function must accept an event object as
         * its only parameter and must return nothing, as this example shows: function(evt:Event):void  The function can
         * have any name.
         * @param thisObject the listener function's "this"
         * @param useCapture Determines whether the listener works in the capture phase or the bubbling phases. If useCapture
         * is set to true, the listener processes the event only during the capture phase and not in the bubbling phase.
         * If useCapture is false, the listener processes the event only during the bubbling phase. To listen for the event
         * in all three phases, call on() twice, once with useCapture set to true, then again with useCapture set to false.
         * @param  priority The priority level of the event listener. Priorities are designated by a integer. The higher
         * the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1.
         * If two or more listeners share the same priority, they are processed in the order in which they were added.
         * The default priority is
         * @see #once()
         * @see #removeEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知。可以为特定类型的事件、阶段和优先级在显示列表的所有节
         * 点上注册事件侦听器。成功注册一个事件侦听器后，无法通过额外调用 on() 来更改其优先级。要更改侦听器的优先级，必须
         * 先调用 removeEventListener()。然后，可以使用新的优先级再次注册该侦听器。注册该侦听器后，如果继续调用具有不同 type 或 useCapture
         * 值的 on()，则会创建单独的侦听器注册。<br/>
         * 如果不再需要某个事件侦听器，可调用 EventDispatcher.removeEventListener()
         * 删除它；否则会产生内存问题。由于垃圾回收器不会删除仍包含引用的对象，因此不会从内存中自动删除使用已注册事件侦听器的对象。复制
         * EventDispatcher 实例时并不复制其中附加的事件侦听器。（如果新近创建的节点需要一个事件侦听器，必须在创建该节点后附加该侦听器。）
         * 但是，如果移动 EventDispatcher 实例，则其中附加的事件侦听器也会随之移动。如果在正在处理事件的节点上注册事件侦听器，则不会在当
         * 前阶段触发事件侦听器，但会在事件流的稍后阶段触发，如冒泡阶段。如果从正在处理事件的节点中删除事件侦听器，则该事件侦听器仍由当前操
         * 作触发。删除事件侦听器后，决不会再次调用该事件侦听器（除非再次注册以备将来处理）。
         * @param type 事件的类型。
         * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
         * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 确定侦听器是运行于捕获阶段还是运行于冒泡阶段。如果将 useCapture 设置为 true，
         * 则侦听器只在捕获阶段处理事件，而不在冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在冒泡阶段处理事件。
         * 要在两个阶段都侦听事件，请调用 on() 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
         * @param  priority 事件侦听器的优先级。优先级由一个带符号的整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
         * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
         * @see #once()
         * @see #removeEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * @language en_US
         * Registers an event listener object with an EventDispatcher object so that the listener receives notification of an
         * event. Different from the on() method,the listener receives notification only once,and then it will be removed
         * automatically.
         * @param type The type of event.
         * @param listener The listener function that processes the event. This function must accept an event object as
         * its only parameter and must return nothing, as this example shows: function(evt:Event):void  The function can
         * have any name.
         * @param thisObject the listener function's "this"
         * @param useCapture Determines whether the listener works in the capture phase or the bubbling phases. If useCapture
         * is set to true, the listener processes the event only during the capture phase and not in the bubbling phase.
         * If useCapture is false, the listener processes the event only during the bubbling phase. To listen for the event
         * in all three phases, call on() twice, once with useCapture set to true, then again with useCapture set to false.
         * @param  priority The priority level of the event listener. Priorities are designated by a integer. The higher
         * the number, the higher the priority. All listeners with priority n are processed before listeners of priority n-1.
         * If two or more listeners share the same priority, they are processed in the order in which they were added.
         * The default priority is
         * @see #on()
         * @see #removeEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 添加仅回调一次的事件侦听器，此方法与on()方法不同，on()方法会持续产生回调，而此方法在第一次回调时就会自动移除监听。
         * @param type 事件的类型。
         * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
         * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 确定侦听器是运行于捕获阶段还是运行于冒泡阶段。如果将 useCapture 设置为 true，
         * 则侦听器只在捕获阶段处理事件，而不在冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在冒泡阶段处理事件。
         * 要在两个阶段都侦听事件，请调用 once() 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
         * @param  priority 事件侦听器的优先级。优先级由一个带符号整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
         * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
         * @see #on()
         * @see #removeEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * @language en_US
         * Removes a listener from the EventDispatcher object. If there is no matching listener registered with the
         * EventDispatcher object, a call to this method has no effect.
         * @param type The type of event.
         * @param listener The listener object to remove.
         * @param thisObject the listener function's "this"
         * @param useCapture Specifies whether the listener was registered for the capture phase or the bubbling phases.
         * If the listener was registered for both the capture phase and the bubbling phases, two calls to removeEventListener()
         * are required to remove both: one call with useCapture set to true, and another call with useCapture set to false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从 EventDispatcher 对象中删除侦听器。如果没有向 EventDispatcher 对象注册任何匹配的侦听器，则对此方法的调用没有任何效果。
         * @param type 事件的类型。
         * @param listener 要删除的侦听器对象
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 指出是为捕获阶段还是为冒泡阶段注册了侦听器。如果为捕获阶段以及冒泡阶段注册了侦听器，则需要对
         * removeEventListener() 进行两次调用才能将这两个侦听器删除：一次调用将 useCapture 设置为 true，另一次调用将 useCapture 设置为 false。。
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
         * @language en_US
         * Checks whether the EventDispatcher object has any listeners registered for a specific type of event. This allows
         * you to determine where an EventDispatcher object has altered handling of an event type in the event flow hierarchy.
         * To determine whether a specific event type will actually trigger an event listener, use IEventDispatcher.willTrigger().
         * The difference between hasEventListener() and willTrigger() is that hasEventListener() examines only the object to
         * which it belongs, whereas willTrigger() examines the entire event flow for the event specified by the type parameter.
         * @param type The type of event.
         * @returns A value of true if a listener of the specified type is registered; false otherwise.
         * @see #willTrigger()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器。这样，您就可以确定 EventDispatcher 对象在事件流层次结构中的哪个
         * 位置改变了对事件类型的处理。要确定特定事件类型是否确实会触发事件侦听器，请使用 IEventDispatcher.willTrigger()。hasEventListener()
         * 与 willTrigger() 的区别是：hasEventListener() 只检查它所属的对象，而 willTrigger() 检查整个事件流以查找由 type 参数指定的事件。
         * @param type 事件的类型。
         * @returns 如果指定类型的侦听器已注册，则值为 true；否则，值为 false。
         * @see #willTrigger()
         * @version Egret 2.4
         * @platform Web,Native
         */
        hasEventListener(type: string): boolean;
        /**
         * @language en_US
         * Dispatches an event into the event flow. The event target is the EventDispatcher object upon which dispatchEvent() is called.
         * @param event The event object dispatched into the event flow.
         * @returns A value of true unless preventDefault() is called on the event, in which case it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将事件分派到事件流中。事件目标是对其调用 dispatchEvent() 方法的 EventDispatcher 对象。
         * @param event 调度到事件流中的 Event 对象。
         * @returns 如果成功调度了事件，则值为 true。值 false 表示失败或对事件调用了 preventDefault()。
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispatchEvent(event: Event): boolean;
        /**
         * @language en_US
         * Checks whether an event listener is registered with this EventDispatcher object or any of its ancestors for the
         * specified event type. This method returns true if an event listener is triggered during any phase of the event
         * flow when an event of the specified type is dispatched to this EventDispatcher object or any of its descendants.
         * @param type The type of event.
         * @returns A value of true if a listener of the specified type will be triggered; false otherwise.
         * @see #hasEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检查是否用此 EventDispatcher 对象或其任何始祖为指定事件类型注册了事件侦听器。将指定类型的事件调度给此
         * EventDispatcher 对象或其任一后代时，如果在事件流的任何阶段触发了事件侦听器，则此方法返回 true。
         * hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，
         * 而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。
         * @param type 事件类型
         * @returns 是否注册过监听器，如果注册过返回true，反之返回false
         * @see #hasEventListener()
         * @version Egret 2.4
         * @platform Web,Native
         */
        willTrigger(type: string): boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * @classdesc IO流事件，当错误导致输入或输出操作失败时调度 IOErrorEvent 对象。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/IOErrorEvent.ts
     */
    /**
     * @language zh_CN
     * @classdesc IO流事件，当错误导致输入或输出操作失败时调度 IOErrorEvent 对象。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/IOErrorEvent.ts
     */
    class IOErrorEvent extends Event {
        /**
         * @language en_US
         * io error
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * io发生错误
         * @version Egret 2.4
         * @platform Web,Native
         */
        static IO_ERROR: string;
        /**
         * @language en_US
         * Create a egret.IOErrorEvent objects
         * @param type {string} Type of event, accessible as Event.type.
         * @param bubbles {boolean} Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable {boolean} Determine whether the Event object can be canceled. The default value is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.IOErrorEvent 对象
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. The objects will be thrown in the object cache pool for the next round robin.
         * @param target {egret.IEventDispatcher} Distribute event target
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @version Egret 2.4
         * @platform Web,Native
         */
        static dispatchIOErrorEvent(target: IEventDispatcher): boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * MotionEvent represents the device's movement
     * Acceleration and accelerationIncludingGravity to represents the device's acceleration
     * RotationRate to represents the device's rotation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Motion.ts
     */
    /**
     * @language zh_CN
     * MotionEvent 类呈现设备运动的具体信息
     * Acceleration 和 accelerationIncludingGravity 呈现设备三个维度的加速度信息
     * RotationRate 呈现设备的旋转状态信息
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Motion.ts
     */
    class MotionEvent extends Event {
        /**
         * @language en_US
         * An object giving the acceleration of the device on the three axis X, Y and Z. Acceleration is expressed in m/s2.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * acceleration 表示设备在 X Y Z 轴方将的加速度信息，单位是  m/s2，不包含重力
         * @version Egret 2.4
         * @platform Web,Native
         */
        acceleration: DeviceAcceleration;
        /**
         * @language en_US
         * An object giving the acceleration of the device on the three axis X, Y and Z with the effect of gravity. Acceleration is expressed in m/s2.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * acceleration 表示设备在 X Y Z 轴方将的加速度信息，单位是  m/s2，包含重力
         * @version Egret 2.4
         * @platform Web,Native
         */
        accelerationIncludingGravity: DeviceAcceleration;
        /**
         * @language en_US
         * An object giving the rate of change of the device's orientation on the three orientation axis alpha, beta and gamma. Rotation rate is express in degrees per seconds.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * rotationRate 表示设备在 alpha、 beta 和 gamma 三个轴向的角速度信息，单位是 角度每秒
         * @version Egret 2.4
         * @platform Web,Native
         */
        rotationRate: DeviceRotationRate;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The OrientationEvent provides information from the physical orientation of the device.
     * Note: Currently, Browsers on the iOS and Android does not handle the coordinates the same way.
     * Take care about this while using them.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/DeviceOrientation.ts
     */
    /**
     * @language zh_CN
     * OrientationEvent 提供设备的方向信息
     * 注意: 目前各个浏览器和操作系统处理方向的方式不完全相同，请根据使用场景做相应的校正，
     * 比如使用两次方向数据的变化而不是直接使用方向的值
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/DeviceOrientation.ts
     */
    class OrientationEvent extends Event {
        /**
         * @language en_US
         * A number representing the motion of the device around the z axis,
         * express in degrees with values ranging from 0 to 360
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示设备绕 Z 轴的角度，单位是 角度 范围是 0 到 360
         * @version Egret 2.4
         * @platform Web,Native
         */
        alpha: number;
        /**
         * @language en_US
         * A number representing the motion of the device around the x axis,
         * express in degrees with values ranging from -180 to 180.
         * This represents a front to back motion of the device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示设备绕 X 轴的角度，单位是 角度 范围是 -180 到 180.
         * 这个值表示设备从前向后的旋转状态
         * @version Egret 2.4
         * @platform Web,Native
         */
        beta: number;
        /**
         * @language en_US
         * A number representing the motion of the device around the y axis,
         * express in degrees with values ranging from -90 to 90.
         * This represents a left to right motion of the device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示设备绕 Y 轴的角度，单位是 角度 范围是 -90 到 90.
         * 这个值表示设备从前向后的旋转状态
         * @version Egret 2.4
         * @platform Web,Native
         */
        gamma: number;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * When a load operation has begun or a socket has received data, ProgressEvent object is dispatched.
     * There are two types of progress events: ProgressEvent.PROGRESS and ProgressEvent.SOCKET_DATA.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 当加载操作已开始或套接字已接收到数据时，将调度 ProgressEvent 对象。
     * 有两种类型的进程事件：ProgressEvent.PROGRESS 和 ProgressEvent.SOCKET_DATA。
     * @version Egret 2.4
     * @platform Web,Native
     */
    class ProgressEvent extends egret.Event {
        /**
         * @language en_US
         * Changes in the loading progress
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 加载进度发生变化
         * @version Egret 2.4
         * @platform Web,Native
         */
        static PROGRESS: string;
        /**
         * @language en_US
         * Get the data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取到数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        static SOCKET_DATA: string;
        /**
         * @language en_US
         * Number of items or bytes when the listener processes the event。
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在侦听器处理事件时加载的项数或字节数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        bytesLoaded: number;
        /**
         * @language en_US
         * If the loading process succeeds, the total number or the total number of bytes that will be loaded term.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果加载过程成功，将加载的总项数或总字节数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        bytesTotal: number;
        /**
         * @language en_US
         * 创建一个 egret.ProgressEvent 对象
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param bytesLoaded {number} Number of items or bytes loaded
         * @param bytesTotal {number} The total number of items or bytes loaded
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.ProgressEvent 对象
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param bytesLoaded {number} 加载的项数或字节数
         * @param bytesTotal {number} 加载的总项数或总字节数
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, bytesLoaded?: number, bytesTotal?: number);
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. The objects will be thrown in the object cache pool for the next round robin.
         * @param target {egret.IEventDispatcher} Distribute event target
         * @param type  The type of the event, accessible as Event.type.
         * @param bytesLoaded {number} Number of items or bytes loaded
         * @param bytesTotal {number} The total number of items or bytes loaded
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bytesLoaded {number} 加载的项数或字节数
         * @param bytesTotal {number} 加载的总项数或总字节数
         * @version Egret 2.4
         * @platform Web,Native
         */
        static dispatchProgressEvent(target: IEventDispatcher, type: string, bytesLoaded?: number, bytesTotal?: number): boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * When the direction of the stage of change, Stage object dispatches StageOrientationEvent object.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/StageOrientationEvent.ts
     */
    /**
     * @language zh_CN
     * 当舞台的方向更改时，Stage 对象将调度 StageOrientationEvent 对象。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/StageOrientationEvent.ts
     */
    class StageOrientationEvent extends Event {
        /**
         * @language en_US
         * After screen rotation distribute events.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 屏幕旋转后派发的事件。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ORIENTATION_CHANGE: string;
        /**
         * @language en_US
         * Creating contains specific information related to the event and the stage direction of StageOrientationEvent object.
         * @param type Event types:StageOrientationEvent.ORIENTATION_CHANGE
         * @param bubbles It indicates whether the Event object participates in the bubbling stage of the event flow.
         * @param cancelable It indicates whether the Event object can be canceled.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建包含与舞台方向事件相关的特定信息的 StageOrientationEvent 对象。
         * @param type 事件的类型：StageOrientationEvent.ORIENTATION_CHANGE
         * @param bubbles 表示 Event 对象是否参与事件流的冒泡阶段。
         * @param cancelable 表示是否可以取消 Event 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * @language en_US
         * 派发一个屏幕旋转的事件。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {egret.IEventDispatcher} 派发事件类型
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 派发一个屏幕旋转的事件。
         * @param target {egret.IEventDispatcher} Distribute event target
         * @param type {egret.IEventDispatcher} Distribute event type
         * @version Egret 2.4
         * @platform Web,Native
         */
        static dispatchStageOrientationEvent(target: IEventDispatcher, type: string): boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * When a user clicks a hyperlink rich text object dispatches TextEvent object. Text Event Type: TextEvent.LINK.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TextEvent.ts
     */
    /**
     * @language zh_CN
     * 用户在富文本中单击超链接时，对象将调度 TextEvent 对象。文本事件类型：TextEvent.LINK。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TextEvent.ts
     */
    class TextEvent extends Event {
        /**
         * @language en_US
         * TextEvent create an object that contains information about text events.
         * @param type Type of event, you can access the TextEvent.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determine whether the Event object can be canceled. The default value is false.
         * @param text One or more characters of text entered by the user. Event listeners can access this information through the text property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 TextEvent 对象，其中包含有关文本事件的信息。
         * @param type 事件的类型，可以作为 TextEvent.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param text 用户输入的一个或多个文本字符。事件侦听器可以通过 text 属性访问此信息。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string);
        /**
         * @language en_US
         * It defines the value of the type property of a link event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 定义 link 事件对象的 type 属性值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static LINK: string;
        /**
         * @language en_US
         * In TextEvent.LINK event, event corresponding string.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在 TextEvent.LINK 事件中，event对应的字符串。
         * @version Egret 2.4
         * @platform Web,Native
         */
        text: string;
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown TextEvent. The objects will be thrown in the object cache pool for the next round robin.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param text  Text TextEvent object assignment
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出TextEvent事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type  事件类型
         * @param text  TextEvent对象的text赋值
         * @version Egret 2.4
         * @platform Web,Native
         */
        static dispatchTextEvent(target: IEventDispatcher, type: string, text: string): boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * A Timer object dispatches a TimerEvent objects whenever the Timer object reaches the interval specified by the Timer.delay property.
     * @see egret.Timer
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TimerEvent.ts
     */
    /**
     * @language zh_CN
     * 每当 Timer 对象达到由 Timer.delay 属性指定的间隔时，Timer 对象即会调度 TimerEvent 对象。
     * @see egret.Timer
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TimerEvent.ts
     */
    class TimerEvent extends Event {
        /**
         * @language en_US
         * Dispatched whenever a Timer object reaches an interval specified according to the Timer.delay property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 每当 Timer 对象达到根据 Timer.delay 属性指定的间隔时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TIMER: string;
        /**
         * @language en_US
         * Dispatched whenever it has completed the number of requests set by Timer.repeatCount.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 每当它完成 Timer.repeatCount 设置的请求数后调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TIMER_COMPLETE: string;
        /**
         * @language en_US
         * Creates an Event object with specific information relevant to timer events.
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param cancelable Determines whether the Event object can be canceled. Event listeners can access this information
         * through the inherited cancelable property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 Event 对象，其中包含有关 timer 事件的特定信息。
         * @param type 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
         * @param bubbles 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
         * @param cancelable 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * @language en_US
         * Instructs Egret runtime to render after processing of this event completes, if the display list has been modified.
         * @example
         * <pre>
         *    function onTimer(event:TimerEvent):void {
         *        if (40 < mySp.x && mySp.x < 375) {
         *            mySp.x-= 50;
         *        } else {
         *            mySp.x=374;
         *        }
         *        event.updateAfterEvent();
         *    }
         *
         *    let moveTimer:Timer=new Timer(50,250);
         *    moveTimer.addEventListener(TimerEvent.TIMER,onTimer);
         *    moveTimer.start();
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果已修改显示列表，调用此方法将会忽略帧频限制，在此事件处理完成后立即重绘屏幕。
         * @example
         * <pre>
         *    function onTimer(event:TimerEvent):void {
         *        if (40 < mySp.x && mySp.x < 375) {
         *            mySp.x-= 50;
         *        } else {
         *            mySp.x=374;
         *        }
         *        event.updateAfterEvent();
         *    }
         *
         *    let moveTimer:Timer=new Timer(50,250);
         *    moveTimer.addEventListener(TimerEvent.TIMER,onTimer);
         *    moveTimer.start();
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        updateAfterEvent(): void;
        /**
         * @language en_US
         * uses a specified target to dispatchEvent an event. Using this method can reduce the number of
         * reallocate event objects, which allows you to get better code execution performance.
         * @param target the event target
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param cancelable Determines whether the Event object can be canceled. Event listeners can access this information
         * through the inherited cancelable property.
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 事件派发目标
         * @param type 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
         * @param bubbles 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
         * @param cancelable 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        static dispatchTimerEvent(target: IEventDispatcher, type: string, bubbles?: boolean, cancelable?: boolean): boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal
     * axis and y represents the vertical axis.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Point.ts
     */
    /**
     * @language zh_CN
     * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Point.ts
     */
    class Point extends HashObject {
        /**
         * @language en_US
         * Releases a point instance to the object pool
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个Point实例到对象池
         * @version Egret 2.4
         * @platform Web,Native
         */
        static release(point: Point): void;
        /**
         * @language en_US
         * get a point instance from the object pool or create a new one.
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的Point对象。
         * @param x 该对象的x属性值，默认为0
         * @param y 该对象的y属性值，默认为0
         * @version Egret 2.4
         * @platform Web,Native
         */
        static create(x: number, y: number): Point;
        /**
         * @language en_US
         * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.Point 对象.若不传入任何参数，将会创建一个位于（0，0）位置的点。
         * @param x 该对象的x属性值，默认为0
         * @param y 该对象的y属性值，默认为0
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(x?: number, y?: number);
        /**
         * @language en_US
         * The horizontal coordinate.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 该点的水平坐标。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        x: number;
        /**
         * @language en_US
         * The vertical coordinate.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 该点的垂直坐标。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        y: number;
        /**
         * @language en_US
         * The length of the line segment from (0,0) to this point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从 (0,0) 到此点的线段长度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        length: number;
        /**
         * @language en_US
         * Sets the members of Point to the specified values
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Point 的成员设置为指定值
         * @param x 该对象的x属性值
         * @param y 该对象的y属性值
         * @version Egret 2.4
         * @platform Web,Native
         */
        setTo(x: number, y: number): Point;
        /**
         * @language en_US
         * Creates a copy of this Point object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 克隆点对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        clone(): Point;
        /**
         * @language en_US
         * Determines whether two points are equal. Two points are equal if they have the same x and y values.
         * @param toCompare The point to be compared.
         * @returns A value of true if the object is equal to this Point object; false if it is not equal.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定两个点是否相同。如果两个点具有相同的 x 和 y 值，则它们是相同的点。
         * @param toCompare 要比较的点。
         * @returns 如果该对象与此 Point 对象相同，则为 true 值，如果不相同，则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        equals(toCompare: Point): boolean;
        /**
         * @language en_US
         * Returns the distance between pt1 and pt2.
         * @param p1 The first point.
         * @param p2 The second point.
         * @returns The distance between the first and second points.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回 pt1 和 pt2 之间的距离。
         * @param p1 第一个点
         * @param p2 第二个点
         * @returns 第一个点和第二个点之间的距离。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static distance(p1: Point, p2: Point): number;
        /**
         * @language en_US
         * Copies all of the point data from the source Point object into the calling Point object.
         * @param sourcePoint The Point object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将源 Point 对象中的所有点数据复制到调用方 Point 对象中。
         * @param sourcePoint 要从中复制数据的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        copyFrom(sourcePoint: Point): void;
        /**
         * @language en_US
         * Adds the coordinates of another point to the coordinates of this point to create a new point.
         * @param v The point to be added.
         * @returns The new point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将另一个点的坐标添加到此点的坐标以创建一个新点。
         * @param v 要添加的点。
         * @returns 新点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        add(v: Point): Point;
        /**
         * @language en_US
         * Determines a point between two specified points.
         * The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2. The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
         * @param pt1 The first point.
         * @param pt2 The second point.
         * @param f The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
         * @returns The new interpolated point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定两个指定点之间的点。
         * 参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。参数 f 的值越接近 1.0，则内插点就越接近第一个点（参数 pt1）。参数 f 的值越接近 0，则内插点就越接近第二个点（参数 pt2）。
         * @param pt1 第一个点。
         * @param pt2 第二个点。
         * @param f 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1，则返回 pt1；如果 f=0，则返回 pt2。
         * @returns 新的内插点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static interpolate(pt1: Point, pt2: Point, f: number): Point;
        /**
         * @language en_US
         * Scales the line segment between (0,0) and the current point to a set length.
         * @param thickness The scaling value. For example, if the current point is (0,5), and you normalize it to 1, the point returned is at (0,1).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 (0,0) 和当前点之间的线段缩放为设定的长度。
         * @param thickness 缩放值。例如，如果当前点为 (0,5) 并且您将它规范化为 1，则返回的点位于 (0,1) 处。
         * @version Egret 2.4
         * @platform Web,Native
         */
        normalize(thickness: number): void;
        /**
         * @language en_US
         * Offsets the Point object by the specified amount. The value of dx is added to the original value of x to create the new x value. The value of dy is added to the original value of y to create the new y value.
         * @param dx The amount by which to offset the horizontal coordinate, x.
         * @param dy The amount by which to offset the vertical coordinate, y.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 按指定量偏移 Point 对象。dx 的值将添加到 x 的原始值中以创建新的 x 值。dy 的值将添加到 y 的原始值中以创建新的 y 值。
         * @param dx 水平坐标 x 的偏移量。
         * @param dy 水平坐标 y 的偏移量。
         * @version Egret 2.4
         * @platform Web,Native
         */
        offset(dx: number, dy: number): void;
        /**
         * @language en_US
         * Converts a pair of polar coordinates to a Cartesian point coordinate.
         * @param len The length coordinate of the polar pair.
         * @param angle The angle, in radians, of the polar pair.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将一对极坐标转换为笛卡尔点坐标。
         * @param len 极坐标对的长度。
         * @param angle 极坐标对的角度（以弧度表示）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static polar(len: number, angle: number): Point;
        /**
         * @language en_US
         * Subtracts the coordinates of another point from the coordinates of this point to create a new point.
         * @param v The point to be subtracted.
         * @returns The new point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从此点的坐标中减去另一个点的坐标以创建一个新点。
         * @param v 要减去的点。
         * @returns 新点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        subtract(v: Point): Point;
        /**
         * @language en_US
         * Returns a string that contains the values of the x and y coordinates. The string has the form "(x=x, y=y)", so calling the toString() method for a point at 23,17 would return "(x=23, y=17)".
         * @returns The string representation of the coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回包含 x 和 y 坐标的值的字符串。该字符串的格式为 "(x=x, y=y)"，因此为点 23,17 调用 toString() 方法将返回 "(x=23, y=17)"。
         * @returns 坐标的字符串表示形式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        toString(): string;
    }
    /**
     * @private
     * 仅供框架内复用，要防止暴露引用到外部。
     */
    let $TempPoint: Point;
}
declare namespace egret {
    /**
     * @language en_US
     * The TouchEvent class lets you handle events on devices that detect user contact with the device (such as a finger
     * on a touch screen).When a user interacts with a device such as a mobile phone or tablet with a touch screen, the
     * user typically touches the screen with his or her fingers or a pointing device. You can develop applications that
     * respond to basic touch events (such as a single finger tap) with the TouchEvent class. Create event listeners using
     * the event types defined in this class.
     * Note: When objects are nested on the display list, touch events target the deepest possible nested object that is
     * visible in the display list. This object is called the target node. To have a target node's ancestor (an object
     * containing the target node in the display list) receive notification of a touch event, use EventDispatcher.addEventListener()
     * on the ancestor node with the type parameter set to the specific touch event you want to detect.
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TouchEvent.ts
     */
    /**
     * @language zh_CN
     * 使用 TouchEvent 类，您可以处理设备上那些检测用户与设备之间的接触的事件。
     * 当用户与带有触摸屏的移动电话或平板电脑等设备交互时，用户通常使用手指或指针设备接触屏幕。可使用 TouchEvent
     * 类开发响应基本触摸事件（如单个手指点击）的应用程序。使用此类中定义的事件类型创建事件侦听器。
     * 注意：当对象嵌套在显示列表中时，触摸事件的目标将是显示列表中可见的最深的可能嵌套对象。
     * 此对象称为目标节点。要使目标节点的祖代（祖代是一个包含显示列表中所有目标节点的对象，从舞台到目标节点的父节点均包括在内）
     * 接收触摸事件的通知，请对祖代节点使用 EventDispatcher.on() 并将 type 参数设置为要检测的特定触摸事件。
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TouchEvent.ts
     */
    class TouchEvent extends Event {
        /**
         * @language en_US
         * Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TOUCH_MOVE: string;
        /**
         * @language en_US
         * Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户第一次触摸启用触摸的设备时（例如，用手指触摸配有触摸屏的移动电话或平板电脑）调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TOUCH_BEGIN: string;
        /**
         * @language en_US
         * Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone
         * or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户移除与启用触摸的设备的接触时（例如，将手指从配有触摸屏的移动电话或平板电脑上抬起）调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TOUCH_END: string;
        /**
         * @language en_US
         * Dispatched when an event of some kind occurred that canceled the touch.
         * Such as the eui.Scroller will dispatch 'TOUCH_CANCEL' when it start move, the 'TOUCH_END' and 'TOUCH_TAP' will not be triggered.
         * @version Egret 3.0.1
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由于某个事件取消了触摸时触发。比如 eui.Scroller 在开始滚动后会触发 'TOUCH_CANCEL' 事件，不再触发后续的 'TOUCH_END' 和 'TOUCH_TAP' 事件
         * @version Egret 3.0.1
         * @platform Web,Native
         */
        static TOUCH_CANCEL: string;
        /**
         * @language en_US
         * Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact
         * was initiated on a touch-enabled device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户在触摸设备上与开始触摸的同一 DisplayObject 实例上抬起接触点时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TOUCH_TAP: string;
        /**
         * @language en_US
         * Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact
         * was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display
         * object on a mobile phone or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户在触摸设备上与开始触摸的不同 DisplayObject 实例上抬起接触点时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TOUCH_RELEASE_OUTSIDE: string;
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TOUCH_ROLL_OUT: string;
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TOUCH_ROLL_OVER: string;
        /**
         * @language en_US
         * Creates an Event object that contains information about touch events.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param stageX The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @param stageY The vertical coordinate at which the event occurred in global Stage coordinates.
         * @param touchPointID A unique identification number assigned to the touch point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 TouchEvent 对象，其中包含有关Touch事件的信息
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param stageX 事件发生点在全局舞台坐标系中的水平坐标
         * @param stageY 事件发生点在全局舞台坐标系中的垂直坐标
         * @param touchPointID 分配给触摸点的唯一标识号
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, stageX?: number, stageY?: number, touchPointID?: number);
        /**
         * @private
         */
        $initTo(stageX: number, stageY: number, touchPointID: number): void;
        /**
         * @private
         */
        $stageX: number;
        /**
         * @language en_US
         * The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件发生点在全局舞台坐标中的水平坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        stageX: number;
        /**
         * @private
         */
        $stageY: number;
        /**
         * @language en_US
         * The vertical coordinate at which the event occurred in global Stage coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件发生点在全局舞台坐标中的垂直坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        stageY: number;
        private _localX;
        /**
         * @language en_US
         * The horizontal coordinate at which the event occurred relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件发生点相对于所属显示对象的水平坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        localX: number;
        private _localY;
        /**
         * @language en_US
         * The vertical coordinate at which the event occurred relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 事件发生点相对于所属显示对象的垂直坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        localY: number;
        private targetChanged;
        /**
         * @private
         */
        private getLocalXY();
        $setTarget(target: any): boolean;
        /**
         * @language en_US
         * A unique identification number assigned to the touch point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 分配给触摸点的唯一标识号
         * @version Egret 2.4
         * @platform Web,Native
         */
        touchPointID: number;
        /**
         * @language en_US
         * Instructs Egret runtime to render after processing of this event completes, if the display list has been modified.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果已修改显示列表，调用此方法将会忽略帧频限制，在此事件处理完成后立即重绘屏幕。
         * @version Egret 2.4
         * @platform Web,Native
         */
        updateAfterEvent(): void;
        /**
         * @language en_US
         * Whether the touch is pressed (true) or not pressed (false).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示触摸已按下 (true) 还是未按下 (false)。
         * @version Egret 2.4
         * @platform Web,Native
         */
        touchDown: boolean;
        /**
         * @language en_US
         * uses a specified target to dispatchEvent an event. Using this method can reduce the number of
         * reallocate event objects, which allows you to get better code execution performance.
         * @param target the event target
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param stageX The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @param stageY The vertical coordinate at which the event occurred in global Stage coordinates.
         * @param touchPointID A unique identification number (as an int) assigned to the touch point.
         *
         * @see egret.Event.create()
         * @see egret.Event.release()
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param stageX 事件发生点在全局舞台坐标系中的水平坐标
         * @param stageY 事件发生点在全局舞台坐标系中的垂直坐标
         * @param touchPointID 分配给触摸点的唯一标识号
         *
         * @see egret.Event.create()
         * @see egret.Event.release()
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        static dispatchTouchEvent(target: IEventDispatcher, type: string, bubbles?: boolean, cancelable?: boolean, stageX?: number, stageY?: number, touchPointID?: number, touchDown?: boolean): boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * h5 and native interaction.
     * @see http://edn.egret.com/cn/article/index/id/714 Egret basic skills to communicate with Native
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/external/ExternalInterface.ts
     */
    /**
     * @language zh_CN
     * h5与native交互。
     * @see http://edn.egret.com/cn/article/index/id/714 Egret 与 Native 通信基本技巧
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/external/ExternalInterface.ts
     */
    interface ExternalInterface {
    }
    let ExternalInterface: {
        /**
         * @language en_US
         * Call functionName, and the value passed to the native.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 调用 functionName，并将value传入到native中。
         * @version Egret 2.4
         * @platform Web,Native
         */
        call(functionName: string, value: string): void;
        /**
         * @language en_US
         * FunctionName callback listener, you need to have to call functionName this field in native rather than such a call.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 监听 functionName 回调，需要在native中有调用 functionName 这个字段，而不是 此类的call。
         * @version Egret 2.4
         * @platform Web,Native
         */
        addCallback(functionName: string, listener: (value: string) => void): void;
    };
}
declare namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    const enum BitmapFilterQuality {
        /**
         * 定义低品质滤镜设置
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        LOW = 1,
        /**
         * 定义中等品质滤镜设置
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        MEDIUM = 2,
        /**
         * 定义高品质滤镜设置
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        HIGH = 3,
    }
}
declare namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    class Filter extends HashObject {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        type: string;
        private $targets;
        $addTarget(target: DisplayObject): void;
        $removeTarget(target: DisplayObject): void;
        protected invalidate(): void;
        /**
         * @private
         */
        $toJson(): string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The BlurFilter class lets you apply a blur visual effect to display objects. A blur effect softens the details of an image.
     * You can produce blurs that range from a softly unfocused look to a Gaussian blur, a hazy appearance like viewing an image through semi-opaque glass.
     * @version Egret 3.0.1
     * @platform Web
     * @see http://edn.egret.com/cn/docs/page/947#模糊滤镜 模糊滤镜
     */
    /**
     * @language zh_CN
     * 可使用 BlurFilter 类将模糊视觉效果应用于显示对象。模糊效果可以柔化图像的细节。
     * 您可以生成一些模糊效果，范围从创建一个柔化的、未聚焦的外观到高斯模糊（就像通过半透明玻璃查看图像一样的朦胧的外观）。
     * @version Egret 3.1.0
     * @platform Web
     * @see http://edn.egret.com/cn/docs/page/947#模糊滤镜 模糊滤镜
     */
    class BlurFilter extends Filter {
        /**
         * @language en_US
         * Initializes a BlurFilter object.
         * @param blurX {number} The amount of horizontal blur. Valid values are 0 to 255 (floating point).
         * @param blurY {number} The amount of vertical blur. Valid values are 0 to 255 (floating point).
         * @param quality {number} The number of times to apply the filter.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 创建一个 BlurFilter 对象。
         * @param blurX {number} 水平模糊量。有效值为 0 到 255（浮点）。
         * @param blurY {number} 垂直模糊量。有效值为 0 到 255（浮点）。
         * @param quality {number} 应用滤镜的次数。暂未实现。
         * @version Egret 3.1.0
         * @platform Web
         */
        constructor(blurX?: number, blurY?: number, quality?: number);
        /**
         * @private
         */
        $quality: number;
        /**
         * @language en_US
         * The amount of horizontal blur.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 水平模糊量。
         * @version Egret 3.1.0
         * @platform Web
         */
        blurX: number;
        /**
         * @private
         */
        $blurX: number;
        /**
         * @language en_US
         * The amount of vertical blur.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 垂直模糊量。
         * @version Egret 3.1.0
         * @platform Web
         */
        blurY: number;
        /**
         * @private
         */
        $blurY: number;
        /**
         * @private
         */
        $toJson(): string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The ColorMatrixFilter class lets you apply a 4 x 5 matrix transformation on the RGBA color and alpha values of every pixel in the input image to produce a result with a new set of RGBA color and alpha values.
     * It allows saturation changes, hue rotation, luminance to alpha, and various other effects.
     * @version Egret 3.1.0
     * @platform Web
     * @see http://edn.egret.com/cn/docs/page/947 颜色矩阵滤镜
     */
    /**
     * @language zh_CN
     * 使用 ColorMatrixFilter 类可以将 4 x 5 矩阵转换应用于输入图像上的每个像素的 RGBA 颜色和 Alpha 值，以生成具有一组新的 RGBA 颜色和 Alpha 值的结果。
     * 该类允许饱和度更改、色相旋转、亮度为 Alpha 以及各种其他效果。
     * @version Egret 3.1.0
     * @platform Web
     * @see http://edn.egret.com/cn/docs/page/947 颜色矩阵滤镜
     */
    class ColorMatrixFilter extends Filter {
        /**
         * @private
         */
        $matrix: number[];
        /**
         * @private
         */
        private matrix2;
        /**
         * @language en_US
         * Initializes a ColorMatrixFilter object.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 创建一个 ColorMatrixFilter 对象。
         * @version Egret 3.1.0
         * @platform Web
         */
        constructor(matrix?: number[]);
        /**
         * @language en_US
         * A comma delimited list of 20 doubles that comprise a 4x5 matrix applied to the rendered element.
         * The matrix is in row major order -- that is, the first five elements are multipled by the vector [srcR,srcG,srcB,srcA,1] to determine the output red value, the second five determine the output green value, etc.
         * The value must either be an array or comma delimited string of 20 numbers.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 构成应用于所呈示的元素的一个 4x5 矩阵的、以逗号分隔的 20 个双精度数的列表。
         * 矩阵以行作为主要顺序，即用第一行五个元素乘以矢量 [srcR,srcG,srcB,srcA,1] 以确定输出的红色值，用第二行的五个元素确定输出的绿色值，等等。
         * 该值必须为 20 个数字组成的数组或以逗号分隔的字符串。
         * @version Egret 3.1.0
         * @platform Web
         */
        matrix: number[];
        /**
         * @private
         */
        private setMatrix(value);
        /**
         * @private
         */
        $toJson(): string;
    }
}
declare namespace egret {
    /**
     * @class egret.GlowFilter
     * @classdesc
     * 使用 GlowFilter 类可以对显示对象应用发光效果。在投影滤镜的 distance 和 angle 属性设置为 0 时，发光滤镜与投影滤镜极为相似。
     * @extends egret.Filter
     * @version Egret 3.1.4
     * @platform Web,Native
     */
    class GlowFilter extends Filter {
        /**
         * @private
         */
        $red: number;
        /**
         * @private
         */
        $green: number;
        /**
         * @private
         */
        $blue: number;
        /**
         * @language en_US
         * Initializes a new GlowFilter instance.
         * @method egret.GlowFilter#constructor
         * @param color {number} The color of the glow. Valid values are in the hexadecimal format 0xRRGGBB. The default value is 0xFF0000.
         * @param alpha {number} The alpha transparency value for the color. Valid values are 0 to 1. For example, .25 sets a transparency value of 25%. The default value is 1.
         * @param blurX {number} The amount of horizontal blur. Valid values are 0 to 255 (floating point).
         * @param blurY {number} The amount of vertical blur. Valid values are 0 to 255 (floating point).
         * @param strength {number} The strength of the imprint or spread. The higher the value, the more color is imprinted and the stronger the contrast between the glow and the background. Valid values are 0 to 255.
         * @param quality {number} The number of times to apply the filter.
         * @param inner {boolean} Specifies whether the glow is an inner glow. The value true indicates an inner glow. The default is false, an outer glow (a glow around the outer edges of the object).
         * @param knockout {number} Specifies whether the object has a knockout effect. A value of true makes the object's fill transparent and reveals the background color of the document. The default value is false (no knockout effect).
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 初始化 GlowFilter 对象
         * @method egret.GlowFilter#constructor
         * @param color {number} 光晕颜色，采用十六进制格式 0xRRGGBB。默认值为 0xFF0000。
         * @param alpha {number} 颜色的 Alpha 透明度值。有效值为 0 到 1。例如，0.25 设置透明度值为 25%。
         * @param blurX {number} 水平模糊量。有效值为 0 到 255（浮点）。
         * @param blurY {number} 垂直模糊量。有效值为 0 到 255（浮点）。
         * @param strength {number} 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。
         * @param quality {number} 应用滤镜的次数。暂未实现。
         * @param inner {boolean} 指定发光是否为内侧发光。值 true 指定发光是内侧发光。值 false 指定发光是外侧发光（对象外缘周围的发光）。
         * @param knockout {number} 指定对象是否具有挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。
         * @version Egret 3.1.4
         * @platform Web
         */
        constructor(color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean);
        /**
         * @private
         */
        $color: number;
        /**
         * @language en_US
         * The color of the glow.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 光晕颜色。
         * @version Egret 3.1.4
         * @platform Web
         */
        color: number;
        /**
         * @private
         */
        $alpha: number;
        /**
         * @language en_US
         * The alpha transparency value for the color.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 颜色的 Alpha 透明度值。
         * @version Egret 3.1.4
         * @platform Web
         */
        alpha: number;
        /**
         * @private
         */
        $blurX: number;
        /**
         * @language en_US
         * The amount of horizontal blur.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 水平模糊量。
         * @version Egret 3.1.4
         * @platform Web
         */
        blurX: number;
        /**
         * @private
         */
        $blurY: number;
        /**
         * @language en_US
         * The amount of vertical blur.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 垂直模糊量。
         * @version Egret 3.1.4
         * @platform Web
         */
        blurY: number;
        /**
         * @private
         */
        $strength: number;
        /**
         * @language en_US
         * The strength of the imprint or spread.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 印记或跨页的强度。
         * @version Egret 3.1.4
         * @platform Web
         */
        strength: number;
        /**
         * @private
         */
        $quality: number;
        /**
         * @language en_US
         * The number of times to apply the filter.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 应用滤镜的次数。
         * @version Egret 3.1.4
         * @platform Web
         */
        quality: number;
        /**
         * @private
         */
        $inner: boolean;
        /**
         * @language en_US
         * Specifies whether the glow is an inner glow.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 指定发光是否为内侧发光。
         * @version Egret 3.1.4
         * @platform Web
         */
        inner: boolean;
        /**
         * @private
         */
        $knockout: boolean;
        /**
         * @language en_US
         * Specifies whether the object has a knockout effect.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 指定对象是否具有挖空效果。
         * @version Egret 3.1.4
         * @platform Web
         */
        knockout: boolean;
        /**
         * @private
         */
        $toJson(): string;
    }
}
declare namespace egret {
    /**
     * @class egret.DropShadowFilter
     * @classdesc
     * 可使用 DropShadowFilter 类向显示对象添加投影。
     * @extends egret.GlowFilter
     * @version Egret 3.1.4
     * @platform Web,Native
     */
    class DropShadowFilter extends GlowFilter {
        /**
         * @language en_US
         * Initializes a new DropShadowFilter instance.
         * @method egret.DropShadowFilter#constructor
         * @param distance {number} The offset distance of the bevel. Valid values are in pixels (floating point).
         * @param angle {number} The angle of the bevel. Valid values are from 0 to 360°.
         * @param color {number} The color of the glow. Valid values are in the hexadecimal format 0xRRGGBB. The default value is 0xFF0000.
         * @param alpha {number} The alpha transparency value for the color. Valid values are 0 to 1. For example, .25 sets a transparency value of 25%. The default value is 1.
         * @param blurX {number} The amount of horizontal blur. Valid values are 0 to 255 (floating point).
         * @param blurY {number} The amount of vertical blur. Valid values are 0 to 255 (floating point).
         * @param strength {number} The strength of the imprint or spread. The higher the value, the more color is imprinted and the stronger the contrast between the glow and the background. Valid values are 0 to 255.
         * @param quality {number} The number of times to apply the filter.
         * @param inner {boolean} Specifies whether the glow is an inner glow. The value true indicates an inner glow. The default is false, an outer glow (a glow around the outer edges of the object).
         * @param knockout {number} Specifies whether the object has a knockout effect. A value of true makes the object's fill transparent and reveals the background color of the document. The default value is false (no knockout effect).
         * @param hideObject {number} Indicates whether or not the object is hidden. The value true indicates that the object itself is not drawn; only the shadow is visible. The default is false, meaning that the object is shown.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 初始化 DropShadowFilter 对象
         * @method egret.DropShadowFilter#constructor
         * @param distance {number} 阴影的偏移距离，以像素为单位。
         * @param angle {number} 阴影的角度，0 到 360 度（浮点）。
         * @param color {number} 光晕颜色，采用十六进制格式 0xRRGGBB。默认值为 0xFF0000。
         * @param alpha {number} 颜色的 Alpha 透明度值。有效值为 0 到 1。例如，0.25 设置透明度值为 25%。
         * @param blurX {number} 水平模糊量。有效值为 0 到 255（浮点）。
         * @param blurY {number} 垂直模糊量。有效值为 0 到 255（浮点）。
         * @param strength {number} 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。
         * @param quality {number} 应用滤镜的次数。暂未实现。
         * @param inner {boolean} 指定发光是否为内侧发光。值 true 指定发光是内侧发光。值 false 指定发光是外侧发光（对象外缘周围的发光）。
         * @param knockout {number} 指定对象是否具有挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。
         * @param hideObject {number} 表示是否隐藏对象。如果值为 true，则表示没有绘制对象本身，只有阴影是可见的。默认值为 false（显示对象）。
         * @version Egret 3.1.4
         * @platform Web
         */
        constructor(distance?: number, angle?: number, color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean, hideObject?: boolean);
        /**
         * @private
         */
        $distance: number;
        /**
         * @language en_US
         * The offset distance of the bevel.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 阴影的偏移距离，以像素为单位。
         * @version Egret 3.1.4
         * @platform Web
         */
        distance: number;
        /**
         * @private
         */
        $angle: number;
        /**
         * @language en_US
         * The angle of the bevel.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 阴影的角度。
         * @version Egret 3.1.4
         * @platform Web
         */
        angle: number;
        /**
         * @private
         */
        $hideObject: boolean;
        /**
         * @language en_US
         * Indicates whether or not the object is hidden.
         * @version Egret 3.1.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 表示是否隐藏对象。
         * @version Egret 3.1.4
         * @platform Web
         */
        hideObject: boolean;
        /**
         * @private
         */
        $toJson(): string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Matrix class represents a transformation matrix that determines how to map points from one coordinate space to
     * another. You can perform various graphical transformations on a display object by setting the properties of a Matrix
     * object, applying that Matrix object to the matrix property of a display object, These transformation functions include
     * translation (x and y repositioning), rotation, scaling, and skewing.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Matrix.ts
     */
    /**
     * @language zh_CN
     * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
     * 您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix
     * 对象应用于显示对象的 matrix 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Matrix.ts
     */
    class Matrix extends HashObject {
        /**
         * @language en_US
         * Releases a matrix instance to the object pool
         * @param matrix matrix that Needs to be recycled
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个Matrix实例到对象池
         * @param matrix 需要回收的 matrix
         * @version Egret 2.4
         * @platform Web,Native
         */
        static release(matrix: Matrix): void;
        /**
         * @language en_US
         * get a matrix instance from the object pool or create a new one.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的Matrix对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static create(): Matrix;
        /**
         * @language en_US
         * Creates a new Matrix object with the specified parameters.
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定参数创建一个 Matrix 对象
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @param tx 沿 x 轴平移每个点的距离。
         * @param ty 沿 y 轴平移每个点的距离。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        /**
         * @language en_US
         * The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        a: number;
        /**
         * @language en_US
         * The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 旋转或倾斜图像时影响像素沿 y 轴定位的值
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        b: number;
        /**
         * @language en_US
         * The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 旋转或倾斜图像时影响像素沿 x 轴定位的值
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        c: number;
        /**
         * @language en_US
         * The value that affects the positioning of pixels along the y axis when scaling or rotating an image.
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        d: number;
        /**
         * @language en_US
         * The distance by which to translate each point along the x axis.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 沿 x 轴平移每个点的距离
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        tx: number;
        /**
         * @language en_US
         * The distance by which to translate each point along the y axis.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 沿 y 轴平移每个点的距离
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        ty: number;
        /**
         * @language en_US
         * Returns a new Matrix object that is a clone of this matrix, with an exact copy of the contained object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
         * @version Egret 2.4
         * @platform Web,Native
         */
        clone(): Matrix;
        /**
         * @language en_US
         * Concatenates a matrix with the current matrix, effectively combining the geometric effects of the two. In mathematical
         * terms, concatenating two matrixes is the same as combining them using matrix multiplication.
         * @param other The matrix to be concatenated to the source matrix.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。在数学术语中，将两个矩阵连接起来与使用矩阵乘法将它们结合起来是相同的。
         * @param other 要连接到源矩阵的矩阵。
         * @version Egret 2.4
         * @platform Web,Native
         */
        concat(other: Matrix): void;
        /**
         * @language en_US
         * Copies all of the matrix data from the source Point object into the calling Matrix object.
         * @param other  The Matrix object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将源 Matrix 对象中的所有矩阵数据复制到调用方 Matrix 对象中。
         * @param other 要拷贝的目标矩阵
         * @version Egret 2.4
         * @platform Web,Native
         */
        copyFrom(other: Matrix): Matrix;
        /**
         * @language en_US
         * Sets each matrix property to a value that causes a null transformation. An object transformed by applying an
         * identity matrix will be identical to the original. After calling the identity() method, the resulting matrix
         * has the following properties: a=1, b=0, c=0, d=1, tx=0, ty=0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 为每个矩阵属性设置一个值，该值将导致矩阵无转换。通过应用恒等矩阵转换的对象将与原始对象完全相同。
         * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
         * @version Egret 2.4
         * @platform Web,Native
         */
        identity(): void;
        /**
         * @language en_US
         * Performs the opposite transformation of the original matrix. You can apply an inverted matrix to an object to
         * undo the transformation performed when applying the original matrix.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 执行原始矩阵的逆转换。
         * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
         * @version Egret 2.4
         * @platform Web,Native
         */
        invert(): void;
        /**
         * @private
         */
        $invertInto(target: Matrix): void;
        /**
         * @language en_US
         * Applies a rotation transformation to the Matrix object.
         * The rotate() method alters the a, b, c, and d properties of the Matrix object.
         * @param angle The rotation angle in radians.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对 Matrix 对象应用旋转转换。
         * rotate() 方法将更改 Matrix 对象的 a、b、c 和 d 属性。
         * @param angle 以弧度为单位的旋转角度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        rotate(angle: number): void;
        /**
         * @language en_US
         * Applies a scaling transformation to the matrix. The x axis is multiplied by sx, and the y axis it is multiplied by sy.
         * The scale() method alters the a and d properties of the Matrix object.
         * @param sx A multiplier used to scale the object along the x axis.
         * @param sy A multiplier used to scale the object along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对矩阵应用缩放转换。x 轴乘以 sx，y 轴乘以 sy。
         * scale() 方法将更改 Matrix 对象的 a 和 d 属性。
         * @param sx 用于沿 x 轴缩放对象的乘数。
         * @param sy 用于沿 y 轴缩放对象的乘数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        scale(sx: number, sy: number): void;
        /**
         * @language en_US
         * Sets the members of Matrix to the specified values
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Matrix 的成员设置为指定值
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @param tx 沿 x 轴平移每个点的距离。
         * @param ty 沿 y 轴平移每个点的距离。
         * @version Egret 2.4
         * @platform Web,Native
         */
        setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        /**
         * @language en_US
         * Returns the result of applying the geometric transformation represented by the Matrix object to the specified point.
         * @param pointX The x coordinate for which you want to get the result of the Matrix transformation.
         * @param pointY The y coordinate for which you want to get the result of the Matrix transformation.
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns The point resulting from applying the Matrix transformation.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
         * @param pointX 想要获得其矩阵转换结果的点的x坐标。
         * @param pointY 想要获得其矩阵转换结果的点的y坐标。
         * @param resultPoint 框架建议尽可能减少创建对象次数来优化性能，可以从外部传入一个复用的Point对象来存储结果，若不传入将创建一个新的Point对象返回。
         * @returns 由应用矩阵转换所产生的点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        transformPoint(pointX: number, pointY: number, resultPoint?: Point): Point;
        /**
         * @language en_US
         * Translates the matrix along the x and y axes, as specified by the dx and dy parameters.
         * @param dx The amount of movement along the x axis to the right, in pixels.
         * @param dy The amount of movement down along the y axis, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
         * @param dx 沿 x 轴向右移动的量（以像素为单位）。
         * @param dy 沿 y 轴向下移动的量（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        translate(dx: number, dy: number): void;
        /**
         * @language en_US
         * Determines whether two matrixes are equal.
         * @param other The matrix to be compared.
         * @returns A value of true if the object is equal to this Matrix object; false if it is not equal.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否与另一个矩阵数据相等
         * @param other 要比较的另一个矩阵对象。
         * @returns 是否相等，ture表示相等。
         * @version Egret 2.4
         * @platform Web,Native
         */
        equals(other: Matrix): boolean;
        /**
         * @language en_US
         * prepend matrix
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @returns matrix
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 前置矩阵
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param b 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param c 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param tx 沿 x 轴平移每个点的距离
         * @param ty 沿 y 轴平移每个点的距离
         * @returns 矩阵自身
         * @version Egret 2.4
         * @platform Web,Native
         */
        prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        /**
         * @language en_US
         * append matrix
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @returns matrix
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 后置矩阵
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param b 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param c 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param tx 沿 x 轴平移每个点的距离
         * @param ty 沿 y 轴平移每个点的距离
         * @returns 矩阵自身
         * @version Egret 2.4
         * @platform Web,Native
         */
        append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        /**
         * @language en_US
         * Given a point in the pretransform coordinate space, returns the coordinates of that point after the transformation occurs.
         * Unlike the standard transformation applied using the transformPoint() method, the deltaTransformPoint() method's transformation does not consider the translation parameters tx and ty.
         * @param point The point for which you want to get the result of the matrix transformation.
         * @returns The point resulting from applying the matrix transformation.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果给定预转换坐标空间中的点，则此方法返回发生转换后该点的坐标。
         * 与使用 transformPoint() 方法应用的标准转换不同，deltaTransformPoint() 方法的转换不考虑转换参数 tx 和 ty。
         * @param point 想要获得其矩阵转换结果的点
         * @returns 由应用矩阵转换所产生的点
         * @version Egret 2.4
         * @platform Web,Native
         */
        deltaTransformPoint(point: Point): Point;
        /**
         * @language en_US
         * Returns a text value listing the properties of the Matrix object.
         * @returns A string containing the values of the properties of the Matrix object: a, b, c, d, tx, and ty.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
         * @returns 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
         * @version Egret 2.4
         * @platform Web,Native
         */
        toString(): string;
        /**
         * @language en_US
         * Includes parameters for scaling, rotation, and translation. When applied to a matrix it sets the matrix's values based on those parameters.
         * @param scaleX The factor by which to scale horizontally.
         * @param scaleY The factor by which scale vertically.
         * @param rotation The amount to rotate, in radians.
         * @param tx The number of pixels to translate (move) to the right along the x axis.
         * @param ty The number of pixels to translate (move) down along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 包括用于缩放、旋转和转换的参数。当应用于矩阵时，该方法会基于这些参数设置矩阵的值。
         * @param scaleX 水平缩放所用的系数
         * @param scaleY 垂直缩放所用的系数
         * @param rotation 旋转量（以弧度为单位）
         * @param tx 沿 x 轴向右平移（移动）的像素数
         * @param ty 沿 y 轴向下平移（移动）的像素数
         * @version Egret 2.4
         * @platform Web,Native
         */
        createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        /**
         * @language en_US
         * Creates the specific style of matrix expected by the beginGradientFill() and lineGradientStyle() methods of the Graphics class.
         * Width and height are scaled to a scaleX/scaleY pair and the tx/ty values are offset by half the width and height.
         * @param width The width of the gradient box.
         * @param height The height of the gradient box.
         * @param rotation The amount to rotate, in radians.
         * @param tx The distance, in pixels, to translate to the right along the x axis. This value is offset by half of the width parameter.
         * @param ty The distance, in pixels, to translate down along the y axis. This value is offset by half of the height parameter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建 Graphics 类的 beginGradientFill() 和 lineGradientStyle() 方法所需的矩阵的特定样式。
         * 宽度和高度被缩放为 scaleX/scaleY 对，而 tx/ty 值偏移了宽度和高度的一半。
         * @param width 渐变框的宽度
         * @param height 渐变框的高度
         * @param rotation 旋转量（以弧度为单位）
         * @param tx 沿 x 轴向右平移的距离（以像素为单位）。此值将偏移 width 参数的一半
         * @param ty 沿 y 轴向下平移的距离（以像素为单位）。此值将偏移 height 参数的一半
         * @version Egret 2.4
         * @platform Web,Native
         */
        createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
        /**
         * @private
         */
        $transformBounds(bounds: Rectangle): void;
        /**
         * @private
         */
        private getDeterminant();
        /**
         * @private
         */
        $getScaleX(): number;
        /**
         * @private
         */
        $getScaleY(): number;
        /**
         * @private
         */
        $getSkewX(): number;
        /**
         * @private
         */
        $getSkewY(): number;
        /**
         * @private
         */
        $updateScaleAndRotation(scaleX: number, scaleY: number, skewX: number, skewY: number): void;
        /**
         * @private
         * target = other * this
         */
        $preMultiplyInto(other: Matrix, target: Matrix): void;
    }
    /**
     * @private
     * 仅供框架内复用，要防止暴露引用到外部。
     */
    let $TempMatrix: Matrix;
}
declare namespace egret {
}
declare namespace egret {
    /**
     * @private
     */
    let $locale_strings: any;
    /**
     * @private
     */
    let $language: string;
}
declare namespace egret.sys {
    /**
     * @private
     * 全局多语言翻译函数
     * @param code 要查询的字符串代码
     * @param args 替换字符串中{0}标志的参数列表
     * @returns 返回拼接后的字符串
     */
    function tr(code: number, ...args: any[]): string;
}
declare namespace egret {
}
/**
 * @version Egret 2.4
 * @platform Web,Native
 * @includeExample egret/localStorage/localStorage.ts
 */
declare namespace egret.localStorage {
    /**
     * @language en_US
     * Read data
     * @param key {string} Name of the key to be read
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 读取数据
     * @param key {string} 要读取的键名称
     * @version Egret 2.4
     * @platform Web,Native
     */
    let getItem: (key: string) => string;
    /**
     * @language en_US
     * Save data
     * @param key {string} Name of the key to be saved
     * @param value {string} Value to be saved
     * @returns {boolean} Whether data is saved successfully
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 保存数据
     * @param key {string} 要保存的键名称
     * @param value {string} 要保存的值
     * @returns {boolean} 数据保存是否成功
     * @version Egret 2.4
     * @platform Web,Native
     */
    let setItem: (key: string, value: string) => boolean;
    /**
     * @language en_US
     * Delete data
     * @param key {string} Name of the key to be deleted
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 删除数据
     * @param key {string} 要删除的键名称
     * @version Egret 2.4
     * @platform Web,Native
     */
    let removeItem: (key: string) => void;
    /**
     * @language en_US
     * Clear all data
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 将所有数据清空
     * @version Egret 2.4
     * @platform Web,Native
     */
    let clear: () => void;
}
declare namespace egret.sys {
    /**
     * @private
     * @param channel
     */
    function $pushSoundChannel(channel: SoundChannel): void;
    /**
     * @private
     * @param channel
     */
    function $popSoundChannel(channel: SoundChannel): boolean;
}
declare namespace egret {
    /**
     * @language en_US
     * The Sound class lets you work with sound in an application.
     * The Sound class lets you create a Sound object, load and play an external audio file into that object.
     * More detailed control of the sound is performed through the SoundChannel
     *
     * @event egret.Event.COMPLETE Dispatch when the audio resource is loaded and ready to play
     * @event egret.IOErrorEvent.IO_ERROR Dispatch when the audio resource is failed to load
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     */
    /**
     * @language zh_CN
     * Sound 允许您在应用程序中使用声音。使用 Sound 类可以创建 Sound 对象、将外部音频文件加载到该对象并播放该文件。
     * 可通过 SoundChannel 对声音执行更精细的控制，如控制音量和监控播放进度。
     * @see http://edn.egret.com/cn/docs/page/156 音频系统
     *
     * @event egret.Event.COMPLETE 音频加载完成时抛出
     * @event egret.IOErrorEvent.IO_ERROR 音频加载失败时抛出
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     */
    interface Sound extends EventDispatcher {
        /**
         * @language en_US
         * Initiates loading of an external audio file from the specified URL.
         * @param url Audio file URL
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 启动从指定 URL 加载外部音频文件的过程。
         * @param url 需要加载的音频文件URL
         * @version Egret 2.4
         * @platform Web,Native
         */
        load(url: string): void;
        /**
         * @language en_US
         * Generates a new SoundChannel object to play back the sound.
         * @param startTime The initial position in seconds at which playback should start, (default = 0)
         * @param loops Plays, the default value is 0. Greater than 0 to the number of plays, such as 1 to play 1, less than or equal to 0, to loop.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 生成一个新的 SoundChannel 对象来播放该声音。此方法返回 SoundChannel 对象，访问该对象可停止声音调整音量。
         * @param startTime 应开始播放的初始位置（以秒为单位），默认值是 0
         * @param loops 播放次数，默认值是 0，循环播放。 大于 0 为播放次数，如 1 为播放 1 次；小于等于 0，为循环播放。
         * @version Egret 2.4
         * @platform Web,Native
         */
        play(startTime?: number, loops?: number): SoundChannel;
        /**
         * @language en_US
         * Closes the stream, causing any download of data to cease
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 关闭该流，从而停止所有数据的下载。
         * @version Egret 2.4
         * @platform Web,Native
         */
        close(): void;
        /**
         * @language en_US
         * Type, default is egret.Sound.EFFECT.
         * In the native and runtime environment, while only play a background music, sound length so as not to be too long.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 类型，默认为 egret.Sound.EFFECT。
         * 在 native 和 runtime 环境下，背景音乐同时只能播放一个，音效长度尽量不要太长。
         * @version Egret 2.4
         * @platform Web,Native
         */
        type: string;
        /**
         * @language en_US
         * Length of the current sound (in seconds).
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        /**
         * @language zh_CN
         * 当前声音的长度（以秒为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        length: number;
    }
    /**
     * @copy egret.Sound
     */
    let Sound: {
        /**
         * @language en_US
         * Create Sound object, load an external audio file and play
         * @param url Audio file URL, Sound will start to load the media if url is not empty
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建 Sound 对象、将外部音频文件加载到该对象并播放该文件
         * @param url 需要加载的音频文件URL,如果指定了 url, Sound会立即开始加载指定的媒体文件
         * @version Egret 2.4
         * @platform Web,Native
         */
        new (): Sound;
        /**
         * @language en_US
         * Background music
         * @default "music"
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 背景音乐
         * @default "music"
         * @version Egret 2.4
         * @platform Web,Native
         */
        MUSIC: string;
        /**
         * @language en_US
         * EFFECT
         * @default "effect"
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 音效
         * @default "effect"
         * @version Egret 2.4
         * @platform Web,Native
         */
        EFFECT: string;
    };
}
declare namespace egret {
    /**
     * @language en_US
     * The SoundChannel class controls a sound in an application.
     * Every sound is assigned to a sound channel, and the application
     * can have multiple sound channels that are mixed together.
     * The SoundChannel class contains a stop() method, properties for
     * set the volume of the channel
     *
     * @event egret.Event.SOUND_COMPLETE Dispatch when a sound has finished playing at last time
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     */
    /**
    * @language zh_CN
     * SoundChannel 类控制应用程序中的声音。每个声音均分配给一个声道，而且应用程序可以具有混合在一起的多个声道。
     * SoundChannel 类包含 stop() 方法、用于设置音量和监视播放进度的属性。
     *
     * @event egret.Event.SOUND_COMPLETE 音频最后一次播放完成时抛出
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
    */
    interface SoundChannel extends IEventDispatcher {
        /**
         * @language en_US
         * The volume, ranging from 0 (silent) to 1 (full volume).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 音量范围从 0（静音）至 1（最大音量）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        volume: number;
        /**
         * @language en_US
         *  When the sound is playing, the position property indicates
         * in seconds the current point that is being played in the sound file.
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        /**
         * @language zh_CN
         * 当播放声音时，position 属性表示声音文件中当前播放的位置（以秒为单位）
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        position: number;
        /**
         * @language en_US
         * Stops the sound playing in the channel.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 停止在该声道中播放声音。
         * @version Egret 2.4
         * @platform Web,Native
         */
        stop(): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Video class lets you work with video in an application.
     * The Video class lets you create a Video object, load and play an external video file into that object.
     * Note: On most mobile device, the video is playback in the full screen mode.<br/>
     *
     * @param url URL of the media to play, Video will start to load if the url is not empty
     *
     * @event egret.Event.COMPLETE Dispatch when the video resource is loaded and ready to play
     * @event egret.Event.ENDED Dispatch when the video playback ended
     * @event egret.IOErrorEvent.IO_ERROR when the video is failed to load
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/media/Video.ts
     */
    /**
     * @language zh_CN
     * Video 允许您在应用程序中使用视频。使用 Video 类可以创建 Video 对象、将外部视频文件加载到该对象并播放该文件。<br/>
     * 注意: 在大多数移动设备中，视频是强制全屏播放的，所以你可以直接调用 play() 方法全屏播放视频，不用将它绘制在Stage中。
     * @see http://edn.egret.com/cn/docs/page/657 视频系统
     *
     * @param url 要播放的视频的URL，如果url不为空，Video会立即加载这个视频
     *
     * @event egret.Event.COMPLETE 视频加载完成时抛出
     * @event egret.Event.ENDED 视频播放完成时抛出
     * @event egret.IOErrorEvent.IO_ERROR 视频加载失败时触发
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/media/Video.ts
     */
    interface Video extends DisplayObject {
        /**
         * @language en_US
         * Initiates loading of an external video file from the specified URL.
         * @param url Audio file URL
         * * @param cache Should cache the video，only  used in Native
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 启动从指定 URL 加载外部视频文件的过程。
         * @param url 需要加载的视频文件URL
         * @param cache 是否需要缓存到本地，只在 Native 上使用
         * @version Egret 2.4
         * @platform Web,Native
         */
        load(url: string, cache?: boolean): void;
        /**
         * @language en_US
         * Play back the video.
         * @param startTime The initial position in seconds at which playback should start, (default = 0)
         * @param loop Defines should play the video again when the video is ended. (default = false)
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 播放该视频
         * @param startTime 应开始播放的初始位置（以秒为单位），默认值是视频上次结束的位置
         * @param loop 是否需要循环播放，默认值是 false
         * @version Egret 2.4
         * @platform Web,Native
         */
        play(startTime?: number, loop?: boolean): any;
        /**
         * @language en_US
         * Closes the stream, causing any download of data to cease
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 关闭该流，从而停止所有数据的下载。
         * @version Egret 2.4
         * @platform Web,Native
         */
        close(): void;
        /**
         * @language en_US
         * The URL of the video you want to play.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 想要播放的视频的URL
         * @version Egret 2.4
         * @platform Web,Native
         */
        src: string;
        /**
         * @language en_US
         * The URL of an image you want to display before the video is loaded or video cannot been draw on the canvas on some mobile device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 视频加载前，或者在不支持将 video 画在 canvas 的设备上，想要显示的视频截图地址。
         * @version Egret 2.4
         * @platform Web,Native
         */
        poster: string;
        /**
         * @language en_US
         * Should play the video in fullscreen mode (default = true).
         * Currently only supports full-screen mobile terminal web.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否全屏播放这个视频（默认值是 true）。
         * 目前移动端 web 只支持全屏。
         * @version Egret 2.4
         * @platform Web,Native
         */
        fullscreen: boolean;
        /**
         * @language en_US
         * The volume, ranging from 0 (silent) to 1 (full volume).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 音量范围从 0（静音）至 1（最大音量）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        volume: number;
        /**
         * @language en_US
         * When the video is playing, the position property indicates
         * in seconds the current point that is being played in the video file.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当播放视频时，position 属性表示视频文件中当前播放的位置（以秒为单位）
         * @version Egret 2.4
         * @platform Web,Native
         */
        position: number;
        /**
         * @language en_US
         * Pause the video playing.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 暂停播放。
         * @version Egret 2.4
         * @platform Web,Native
         */
        pause(): void;
        /**
         * @language en_US
         * Get bitmapData of the video file, you can use the video as bitmapData on the stage.
         * Note: On most mobile device, the video is playback in the full screen mode.
         * So you can just use the play() method instead of draw it on the Stage
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         *  获取视频的 bitmapData, 你可以将视频绘制到舞台上。
         * 注意： 在大多数移动设备中，视频是全屏播放的，所以你可以直接调用 play() 方法全屏播放视频，不用将它绘制在Stage中。
         * @version Egret 2.4
         * @platform Web
         */
        bitmapData?: BitmapData;
        /**
         * @language en_US
         * Whether current video is paused.
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        /**
         * @language zh_CN
         * 当前视频是否在暂停状态。
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         */
        paused: boolean;
        /**
         * @language en_US
         * Length of the current video (in seconds).
         * @version Egret 3.0.8
         * @platform Web,Native
         * @readOnly
         */
        /**
         * @language zh_CN
         * 当前视频的长度（以秒为单位）。
         * @version Egret 3.0.8
         * @platform Web,Native
         * @readOnly
         */
        length: number;
    }
    /**
     * @copy egret.Video
     */
    let Video: {
        new (url?: string, cache?: boolean): Video;
    };
}
/**
 * @private
 */
declare namespace egret_native {
    let nativeType: string;
    /**
     * 游戏启动
     * @private
     */
    function startGame(): void;
    function loglevel(logType: any): void;
    function callRender(): void;
    function getVersion(): any;
    function setScreenCanvas(canvas: Canvas): void;
    function setFrameRate(frameRate: number): void;
    function onTouchesBegin(num: number, ids: any[], xs_array: any[], ys_array: any[]): any;
    function onTouchesMove(num: number, ids: any[], xs_array: any[], ys_array: any[]): any;
    function onTouchesEnd(num: number, ids: any[], xs_array: any[], ys_array: any[]): any;
    function onTouchesCancel(num: number, ids: any[], xs_array: any[], ys_array: any[]): any;
    function sendToC(float32Array: Float32Array, arrayBufferLen: number, array: string[]): void;
    /**
     * 启动主循环
     * @param callback 主循环回调函数
     * @param thisObject
     */
    function executeMainLoop(callback: Function, thisObject: any): void;
    function pauseApp(): void;
    function resumeApp(): void;
    function readXML(filepath: string): any;
    function xmlStr2JsonStr(text: string): any;
    function isFileExists(filepath: string): boolean;
    function isRecordExists(filepath: string): boolean;
    function readFileSync(filepath: string, type?: string): any;
    function readResourceFileSync(filepath: string): any;
    function readUpdateFileSync(filepath: string): any;
    function deleteUpdateFile(filepath: string): void;
    function readFileAsync(filepath: string, promise: egret.PromiseObject, type?: string): any;
    function writeFileSync(filepath: string, fileContent: string): any;
    function requireHttpSync(url: string, callback: Function): void;
    function requireHttp(url: string, param: any, callback: Function): void;
    function sendInfoToPlugin(info: string): void;
    function receivedPluginInfo(info: string): void;
    function loadRecord(filepath: string): string;
    function saveRecord(filepath: string, fileContent: string): void;
    function getOption(type: string): string;
    namespace Audio {
        function preloadBackgroundMusic(path: string): void;
        function playBackgroundMusic(path: string, loop: boolean): void;
        function setBackgroundMusicVolume(value: number): void;
        function setEffectsVolume(value: number): void;
        function getBackgroundMusicVolume(): number;
        function getEffectsVolume(): number;
        function stopBackgroundMusic(isRelease: boolean): void;
        function preloadEffect(path: string): void;
        function preloadEffectAsync(path: string, promise: egret.PromiseObject): void;
        function playEffect(path: string, loop: boolean): void;
        function unloadEffect(path: string): void;
        function stopEffect(effectId: number): void;
        function pauseBackgroundMusic(): void;
        function pauseAllEffects(): void;
        function resumeBackgroundMusic(): void;
        function resumeAllEffects(): void;
    }
    function download(url: string, savePath: string, promise: any): void;
    namespace Graphics {
        function clearScreen(r: number, g: number, b: number): void;
        function drawImage(texture: any, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any): void;
        function drawImageScale9(texture: any, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, x: any, y: any, width: any, height: any): boolean;
        function setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        function setGlobalAlpha(alpha: number): void;
        function pushClip(x: number, y: number, w: number, h: number): void;
        function popClip(): void;
        function setGlobalColorTransform(colorTransformMatrix: number[]): void;
        function setGlobalColorTransformEnabled(bool: boolean): void;
        function setGlobalShader(filterData: any): void;
        function lineStyle(thickness: number, color: number): void;
        function lineTo(x: number, y: number): void;
        function moveTo(x: number, y: number): void;
        function beginFill(color: number, alpha: number): void;
        function endFill(): void;
        function setBlendArg(src: number, des: number): void;
        function setTextureScaleFactor(value: number): void;
    }
    namespace Label {
        function createLabel(font: string, size: number, defaultString: string, defaultStroke: number): void;
        function setTextColor(color: number): void;
        function setStrokeColor(color: number): void;
        function drawText(text: string, x: number, y: number): void;
        function setTextAlignment(type: string): void;
        function getTextSize(text: string): number[];
    }
    namespace EGTXML {
        function readXML(filepath: string): void;
    }
    namespace Texture {
        function create(filePath: string): any;
        function addTexture(filePath: string): any;
        function addTextureAsyn(filePath: string, promise: any): any;
        function addTextureUnsyn(filePath: string, promise: any): any;
        function removeTexture(filePath: string): void;
    }
    namespace TextInputOp {
        function setKeybordOpen(isOpen: boolean, jsonConfig?: Object): void;
        function isFullScreenKeyBoard(): boolean;
        function setInputTextMaxLenght(value: number): void;
        function updateConfig(jsonConfig?: Object): void;
    }
    function EGT_TextInput(text: string): void;
    function EGT_keyboardFinish(): void;
    function EGT_deleteBackward(): void;
    function EGT_keyboardDidHide(): void;
    function EGT_keyboardDidShow(): void;
    function EGT_getTextEditerContentText(): string;
    namespace EGTView {
        function getFrameWidth(): number;
        function getFrameHeight(): number;
        function setVisibleRect(x: number, y: number, w: number, h: number): number;
        function setDesignSize(w: number, h: number): number;
    }
    /**
     * @private
     */
    class RenderTexture {
        constructor(width: number, height: number);
        begin(): any;
        end(): any;
        dispose(): any;
        toDataURL(type: any): any;
        saveToFile(type: string, filePath: string): any;
    }
    namespace rastergl {
        function arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        function quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        function lineTo(x: number, y: number): void;
        function fill(fillRule?: string): void;
        function closePath(): void;
        function rect(x: number, y: number, w: number, h: number): void;
        function moveTo(x: number, y: number): void;
        function fillRect(x: number, y: number, w: number, h: number): void;
        function bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        function stroke(): void;
        function strokeRect(x: number, y: number, w: number, h: number): void;
        function beginPath(): void;
        function arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        function transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void;
        function translate(x: number, y: number): void;
        function scale(x: number, y: number): void;
        function rotate(angle: number): void;
        function save(): void;
        function restore(): void;
        function createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
        function createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
        /**
         * @private
         */
        let lineWidth: number;
        /**
         * @private
         */
        let strokeStyle: any;
        /**
         * @private
         */
        let fillStyle: any;
    }
    namespace Game {
        function listResource(root: any, promise: any): any;
        function listUpdate(root: any, promise: any): any;
    }
    /**
     * @private
     */
    class RenderContext {
        clearScreen(r: number, g: number, b: number): void;
        drawImage(texture: any, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any): void;
        setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        setGlobalAlpha(alpha: number): void;
        pushClip(x: number, y: number, w: number, h: number): void;
        popClip(): void;
    }
    /**
     * @private
     */
    class Canvas {
        constructor(width: number, height: number);
        width: number;
        height: number;
        getContext(type: string): RenderContext;
    }
}
declare namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    class PromiseObject {
        /**
         * @private
         */
        private static promiseObjectList;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        onSuccessFunc: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        onSuccessThisObject: any;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        onErrorFunc: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        onErrorThisObject: any;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        downloadingSizeFunc: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        downloadingSizeThisObject: any;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        onResponseHeaderFunc: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        onResponseHeaderThisObject: any;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        static create(): any;
        /**
         * @private
         *
         * @param args
         */
        private onSuccess(...args);
        /**
         * @private
         *
         * @param args
         */
        private onError(...args);
        /**
         * @private
         *
         * @param args
         */
        private downloadingSize(...args);
        /**
         * @private
         *
         * @param args
         */
        private onResponseHeader(...args);
        /**
         * @private
         *
         */
        private destroy();
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The HttpMethod class provides values that specify whether the HttpRequest object should use the POST method
     * or the GET method when sending data to a server.
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * HttpRequestMethod 类提供了一些值，这些值可指定在将数据发送到服务器时，
     * HttpRequest 对象应使用 POST 方法还是 GET 方法。
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     */
    class HttpMethod {
        /**
         * @language en_US
         * Specifies that the HttpRequest object is a GET.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 HttpRequest 对象是一个 GET。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static GET: string;
        /**
         * @language en_US
         * Specifies that the HttpRequest object is a POST.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 HttpRequest 对象是一个 POST。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static POST: string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The HttpRequest class downloads data from a URL as text or binary data. It is useful for downloading text files,
     * XML, or other information to be used in a dynamic, data-driven application. A HttpRequest object downloads all
     * of the data from a URL before making it available to code in the applications. It sends out notifications about
     * the progress of the download, which you can monitor through the bytesLoaded and bytesTotal properties,
     * as well as through dispatched events.
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event egret.Event.IO_ERROR Dispatched when the net request is failed.
     * @event egret.ProgressEvent.PROGRESS Dispatched when data is received as the download operation progresses.
     * @see egret.HttpMethod
     * @see egret.HttpResponseType
     * @includeExample egret/net/HttpRequestExample.ts
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * HttpRequest 类以文本或二进制数据的形式从 URL 下载数据。
     * HttpRequest 对象会先从 URL 中下载所有数据，然后才将数据用于应用程序中的代码。它会发出有关下载进度的通知，
     * 通过 bytesLoaded 和 bytesTotal 属性以及已调度的事件，可以监视下载进度。
     * @event egret.Event.COMPLETE 加载完成
     * @event egret.Event.IO_ERROR 加载失败
     * @event egret.ProgressEvent.PROGRESS 加载进度，可通过event.bytesLoaded和event.bytesTotal统计进度信息。
     * @see egret.HttpMethod
     * @see egret.HttpResponseType
     * @includeExample egret/net/HttpRequestExample.ts
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface HttpRequest extends EventDispatcher {
        /**
         * @language en_US
         * The data received from the load operation.  The format of the data depends on the setting of the responseType property.
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 本次请求返回的数据，数据类型根据 responseType 设置的值确定。
         * @readOnly
         * @version Egret 2.4
         * @platform Web,Native
         */
        response: any;
        /**
         * @language en_US
         * Controls whether the downloaded data is received as text (HttpResponseType.TEXT) or raw binary data (HttpResponseType.ArrayBuffer)<br/>
         * Note:If you attempt to set this property to an invalid value, Egret runtime set the value to HttpResponseType.TEXT.
         * @default egret.HttpResponseType.TEXT
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置返回的数据格式为文本（HttpResponseType.TEXT）还是二进制数据（HttpResponseType.ArrayBuffer）<br/>
         * 注意：若尝试设置此属性为一个非法的值，运行时将使用HttpResponseType.TEXT。
         * @default egret.HttpResponseType.TEXT
         * @version Egret 2.4
         * @platform Web,Native
         */
        responseType: string;
        /**
         * @language en_US
         * indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies
         * or authorization headers. (This never affects same-site requests.)
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。(这个标志不会影响同站的请求)
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        withCredentials: boolean;
        /**
         * @language en_US
         * Initializes a request.<br/>
         * Note: Calling this method for an already active request (one for which open() or openRequest() has already been
         * called) is the equivalent of calling abort().
         * @param url The URL to send the request to.
         * @param method The HTTP method to use, please use the const value in the HttpMethod class.
         * @see egret.HttpMethod
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 初始化一个请求.<br/>
         * 注意: 若在已经发出请求的对象上调用此方法，相当于立即调用abort().
         * @param url 该请求所要访问的URL该请求所要访问的URL
         * @param method 请求所使用的HTTP方法， 请使用 HttpMethod 定义的枚举值.
         * @see egret.HttpMethod
         * @version Egret 2.4
         * @platform Web,Native
         */
        open(url: string, method?: string): void;
        /**
         * @language en_US
         * Sends the request.
         * @param data the data to send.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 发送请求.
         * @param data 需要发送的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        send(data?: any): void;
        /**
         * @language en_US
         * Aborts the request if it has already been sent.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果请求已经被发送,则立刻中止请求.
         * @version Egret 2.4
         * @platform Web,Native
         */
        abort(): void;
        /**
         * @language en_US
         * Returns all the response headers as a string, or null if no response has been received.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
         * @version Egret 2.4
         * @platform Web,Native
         */
        getAllResponseHeaders(): string;
        /**
         * @language en_US
         * Sets the value of an HTTP request header. You must call setRequestHeader() after open().
         * @param header The name of the header whose value is to be set.
         * @param value The value to set as the body of the header.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
         * @param header 将要被赋值的请求头名称.
         * @param value 给指定的请求头赋的值.
         * @version Egret 2.4
         * @platform Web,Native
         */
        setRequestHeader(header: string, value: string): void;
        /**
         * @language en_US
         * Returns the string containing the text of the specified header, or null if either the response has not yet been
         * received or the header doesn't exist in the response.
         * @param header The name of the header whose value is to be get.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
         * @param header 要返回的响应头名称
         * @version Egret 2.4
         * @platform Web,Native
         */
        getResponseHeader(header: string): string;
    }
    /**
     * @language en_US
     * Creates a HttpRequest object.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 创建一个 HttpRequest 实例。
     * @version Egret 2.4
     * @platform Web,Native
     */
    let HttpRequest: {
        new (): HttpRequest;
    };
}
declare namespace egret {
    /**
     * @language en_US
     * The HttpResponseType class provides values that specify how downloaded data is received.
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * URLLoaderDataFormat 类提供了一些用于指定如何接收已下载数据的值。
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     */
    class HttpResponseType {
        /**
         * @language en_US
         * Specifies that downloaded data is received as text. This is the default value of HttpRequest.responseType
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回字符串。HttpRequest.responseType属性的默认值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TEXT: string;
        /**
         * @language en_US
         * Specifies that downloaded data is received as raw binary data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回二进制的ArrayBuffer对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ARRAY_BUFFER: string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Loader class is used to load image (JPG, PNG, or GIF) files. Use the load() method to initiate loading.
     * The loaded image data is in the data property of ImageLoader.
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event egret.IOErrorEvent.IO_ERROR Dispatched when the net request is failed.
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/net/ImageLoaderExample.ts
     * @see http://edn.egret.com/cn/docs/page/590 加载位图文件
     */
    /**
     * @language zh_CN
     * ImageLoader 类可用于加载图像（JPG、PNG 或 GIF）文件。使用 load() 方法来启动加载。被加载的图像对象数据将存储在 ImageLoader.data 属性上 。
     * @event egret.Event.COMPLETE 加载完成
     * @event egret.IOErrorEvent.IO_ERROR 加载失败
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/net/ImageLoaderExample.ts
     * @see http://edn.egret.com/cn/docs/page/590 加载位图文件
     */
    interface ImageLoader extends EventDispatcher {
        /**
         * @language en_US
         * The data received from the load operation.
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用 load() 方法加载成功的 BitmapData 图像数据。
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        data: BitmapData;
        /**
         * @language en_US
         * Specifies whether or not cross-site Access-Control requests should be made when loading a image from foreign origins.<br/>
         * possible values are:"anonymous","use-credentials" or null.
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。<br/>
         * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
         * @version Egret 2.4
         * @platform Web,Native
         */
        crossOrigin: string;
        /**
         * @language en_US
         * start a load operation。<br/>
         * Note: Calling this method for an already active request (one for which load() has already been
         * called) will abort the last load operation immediately.
         * @param url 要加载的图像文件的地址。
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 启动一次图像加载。<br/>
         * 注意：若之前已经调用过加载请求，重新调用 load() 将终止先前的请求，并开始新的加载。
         * @param url 要加载的图像文件的地址。
         * @version Egret 2.4
         * @platform Web,Native
         */
        load(url: string): void;
    }
    /**
     * @language en_US
     * Creates a ImageLoader object
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 创建一个 ImageLoader 实例
     * @version Egret 2.4
     * @platform Web,Native
     */
    let ImageLoader: {
        /**
         * @language en_US
         * constructor
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数
         * @version Egret 2.4
         * @platform Web,Native
         */
        new (): ImageLoader;
        /**
         * @language en_US
         * Specifies whether to enable cross-origin resource sharing, If ImageLoader instance has been set crossOrigin property will be used to set the property.
         * @version Egret 2.5.7
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定是否启用跨域资源共享,如果ImageLoader实例有设置过crossOrigin属性将使用设置的属性
         * @version Egret 2.5.7
         * @platform Web,Native
         */
        crossOrigin: string;
    };
}
declare namespace egret.sys {
    /**
     * @private
     * 脏矩形计算工具类
     */
    class DirtyRegion {
        constructor(root: DisplayObject);
        /**
         * @private
         */
        private root;
        /**
         * @private
         */
        private dirtyList;
        /**
         * @private
         */
        private hasClipRect;
        /**
         * @private
         */
        private clipWidth;
        /**
         * @private
         */
        private clipHeight;
        /**
         * @private
         */
        private clipArea;
        /**
         * @private
         */
        private clipRectChanged;
        /**
         * @private
         * 设置剪裁边界，超过边界的节点将跳过绘制。
         */
        setClipRect(width: number, height: number): void;
        /**
         * @private
         * 添加一个脏矩形区域，返回是否添加成功，当矩形为空或者在屏幕之外时返回false。
         */
        addRegion(target: Region): boolean;
        /**
         * @private
         */
        clear(): void;
        /**
         * @private
         * 获取最终的脏矩形列表
         */
        getDirtyRegions(): Region[];
        /**
         * @private
         * 合并脏矩形列表
         */
        private mergeDirtyList(dirtyList);
        private $dirtyRegionPolicy;
        setDirtyRegionPolicy(policy: string): void;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 显示列表
     */
    class DisplayList extends HashObject implements sys.Renderable {
        /**
         * 创建一个DisplayList对象，若内存不足或无法创建RenderBuffer，将会返回null。
         */
        static create(target: DisplayObject): DisplayList;
        /**
         * @private
         * 创建一个DisplayList对象
         */
        constructor(root: DisplayObject);
        private isStage;
        /**
         * 位图渲染节点
         */
        $renderNode: RenderNode;
        /**
         * @private
         * 获取渲染节点
         */
        $getRenderNode(): sys.RenderNode;
        /**
         * @private
         * 更新对象在舞台上的显示区域和透明度,返回显示区域是否发生改变。
         */
        $update(dirtyRegionPolicy: string): boolean;
        /**
         * @private
         */
        renderBuffer: RenderBuffer;
        /**
         * @private
         */
        offsetX: number;
        /**
         * @private
         */
        offsetY: number;
        /**
         * @private
         */
        private offsetMatrix;
        /**
         * @private
         * 显示列表根节点
         */
        root: DisplayObject;
        /**
         * @private
         */
        isDirty: boolean;
        needUpdateRegions: boolean;
        /**
         * @private
         * 设置剪裁边界，不再绘制完整目标对象，画布尺寸由外部决定，超过边界的节点将跳过绘制。
         */
        setClipRect(width: number, height: number): void;
        /**
         * @private
         * 显示对象的渲染节点发生改变时，把自身的IRenderable对象注册到此列表上。
         */
        private dirtyNodes;
        /**
         * @private
         */
        private dirtyNodeList;
        /**
         * @private
         * 标记一个节点需要重新渲染
         */
        markDirty(node: Renderable): void;
        /**
         * @private
         */
        private dirtyList;
        /**
         * @private
         */
        private dirtyRegion;
        /**
         * @private
         * 更新节点属性并返回脏矩形列表。
         */
        updateDirtyRegions(): Region[];
        /**
         * @private
         * 绘制根节点显示对象到目标画布，返回draw的次数。
         */
        drawToSurface(): number;
        private bitmapData;
        /**
         * @private
         */
        private sizeChanged;
        /**
         * @private
         * 改变画布的尺寸，由于画布尺寸修改会清空原始画布。所以这里将原始画布绘制到一个新画布上，再与原始画布交换。
         */
        changeSurfaceSize(): void;
        private $dirtyRegionPolicy;
        setDirtyRegionPolicy(policy: string): void;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * egret project entry function
     * @param options An object containing the initialization properties for egret engine.
     */
    /**
     * @language zh_CN
     * egret工程入口函数
     * @param options 一个可选对象，包含初始化Egret引擎需要的参数。
     */
    function runEgret(options?: {
        renderMode?: string;
        audioType?: number;
        screenAdapter?: sys.IScreenAdapter;
    }): void;
    /**
     * @language en_US
     * Refresh the screen display
     */
    /**
     * @language zh_CN
     * 刷新屏幕显示
     */
    function updateAllScreens(): void;
}
declare namespace egret {
    /**
     * @private
     */
    interface FPSDisplay extends DisplayObject {
        /**
         * 更新FPS信息
         */
        update(datas: FPSData): void;
        /**
         * 插入一条日志信息
         */
        updateInfo(info: string): void;
    }
    /**
     * @private
     */
    let FPSDisplay: {
        new (stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object): FPSDisplay;
    };
}
/**
 * @private
 */
interface FPSData extends Object {
    fps: number;
    draw: number;
    dirty: number;
    costTicker: number;
    costDirty: number;
    costRender: number;
}
declare namespace egret.sys {
    let $TempStage: egret.Stage;
    /**
     * @private
     * Egret播放器
     */
    class Player extends HashObject {
        /**
         * @private
         * 实例化一个播放器对象。
         */
        constructor(buffer: RenderBuffer, stage: Stage, entryClassName: string);
        /**
         * @private
         */
        private createDisplayList(stage, buffer);
        /**
         * @private
         */
        private screenDisplayList;
        /**
         * @private
         * 入口类的完整类名
         */
        private entryClassName;
        /**
         * @private
         * 舞台引用
         */
        stage: Stage;
        /**
         * @private
         * 入口类实例
         */
        private root;
        /**
         * @private
         */
        private isPlaying;
        /**
         * @private
         * 启动播放器
         */
        start(): void;
        /**
         * @private
         *
         */
        private initialize();
        /**
         * @private
         * 停止播放器，停止后将不能重新启动。
         */
        stop(): void;
        /**
         * @private
         * 暂停播放器，后续可以通过调用start()重新启动播放器。
         */
        pause(): void;
        /**
         * @private
         * 渲染屏幕
         */
        $render(triggerByFrame: boolean, costTicker: number): void;
        /**
         * @private
         * 更新舞台尺寸
         * @param stageWidth 舞台宽度（以像素为单位）
         * @param stageHeight 舞台高度（以像素为单位）
         */
        updateStageSize(stageWidth: number, stageHeight: number): void;
        /**
         * @private
         * 显示FPS。
         */
        displayFPS: (showFPS: boolean, showLog: boolean, logFilter: string, fpsStyles: Object) => void;
        /**
         * @private
         */
        private showFPS;
        /**
         * @private
         */
        private showLog;
        /**
         * @private
         */
        private fps;
        /**
         * @private
         * 是否显示脏矩形重绘区。
         */
        showPaintRect: (value: boolean) => void;
        /**
         * @private
         */
        private drawDirtyRect;
        /**
         * @private
         */
        private _showPaintRect;
        /**
         * @private
         */
        private stageDisplayList;
        /**
         * @private
         */
        private paintList;
        /**
         * @private
         */
        private drawPaintRect;
    }
    /**
     * @private
     */
    let $logToFPS: (info: string) => void;
}
/**
 * @private
 */
interface PlayerOption {
    /**
     * 入口类完整类名
     */
    entryClassName?: string;
    /**
     * 默认帧率
     */
    frameRate?: number;
    /**
     * 屏幕适配模式
     */
    scaleMode?: string;
    /**
     * 初始内容宽度
     */
    contentWidth?: number;
    /**
     * 初始内容高度
     */
    contentHeight?: number;
    /**
     * 屏幕方向
     */
    orientation?: string;
    /**
     * 是否显示重绘区域
     */
    showPaintRect?: boolean;
    /**
     * 显示FPS
     */
    showFPS?: boolean;
    /**
     *
     */
    fpsStyles?: Object;
    /**
     * 显示日志
     */
    showLog?: boolean;
    /**
     * 过滤日志的正则表达式
     */
    logFilter?: string;
    /**
     *
     */
    maxTouches?: number;
    /**
     *
     */
    textureScaleFactor?: number;
}
declare namespace egret.sys {
    /**
     * @private
     */
    class Region {
        /**
         * @private
         * 释放一个Region实例到对象池
         */
        static release(region: Region): void;
        /**
         * @private
         * 从对象池中取出或创建一个新的Region对象。
         * 建议对于一次性使用的对象，均使用此方法创建，而不是直接new一个。
         * 使用完后调用对应的release()静态方法回收对象，能有效减少对象创建数量造成的性能开销。
         */
        static create(): Region;
        /**
         * @private
         */
        minX: number;
        /**
         * @private
         */
        minY: number;
        /**
         * @private
         */
        maxX: number;
        /**
         * @private
         */
        maxY: number;
        /**
         * @private
         */
        width: number;
        /**
         * @private
         */
        height: number;
        /**
         * @private
         */
        area: number;
        /**
         * @private
         * 是否发生移动
         */
        moved: boolean;
        /**
         * @private
         */
        setTo(minX: number, minY: number, maxX: number, maxY: number): Region;
        /**
         * @private
         * 把所有值都取整
         */
        intValues(): void;
        /**
         * @private
         */
        updateArea(): void;
        /**
         * @private
         * 注意！由于性能优化，此方法不判断自身是否为空，必须在外部确认自身和目标区域都不为空再调用合并。否则结果始终从0，0点开始。
         */
        union(target: Region): void;
        /**
         * @private
         * 注意！由于性能优化，此方法不判断自身是否为空，必须在外部确认自身和目标区域都不为空再调用合并。否则结果始终从0，0点开始。
         */
        intersect(target: Region): void;
        /**
         * @private
         */
        private setEmpty();
        /**
         * @private
         * 确定此 Region 对象是否为空。
         */
        isEmpty(): boolean;
        /**
         * @private
         */
        intersects(target: Region): boolean;
        /**
         * @private
         */
        updateRegion(bounds: Rectangle, matrix: Matrix): void;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 共享的用于碰撞检测的渲染缓冲
     */
    let customHitTestBuffer: sys.RenderBuffer;
    /**
     * @private
     * 共享的用于canvas碰撞检测的渲染缓冲
     */
    let canvasHitTestBuffer: sys.RenderBuffer;
    /**
     * @private
     * 渲染缓冲
     */
    interface RenderBuffer {
        /**
         * 呈现最终绘图结果的画布。
         * @readOnly
         */
        surface: any;
        /**
         * 渲染上下文。
         * @readOnly
         */
        context: any;
        /**
         * 渲染缓冲的宽度，以像素为单位。
         * @readOnly
         */
        width: number;
        /**
         * 渲染缓冲的高度，以像素为单位。
         * @readOnly
         */
        height: number;
        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        resize(width: number, height: number, useMaxSize?: boolean): void;
        /**
         * 改变渲染缓冲为指定大小，但保留原始图像数据
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
         * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
         */
        resizeTo(width: number, height: number, offsetX: number, offsetY: number): void;
        /**
         * 清空并设置裁切区域
         * @param regions 矩形列表
         * @param offsetX 矩形偏移量x
         * @param offsetY 矩形偏移量y
         */
        beginClip(regions: sys.Region[], offsetX?: number, offsetY?: number): void;
        /**
         * 取消上一次设置的clip。
         */
        endClip(): void;
        /**
         * 获取指定区域的像素
         */
        getPixels(x: number, y: number, width?: number, height?: number): number[];
        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        toDataURL(type?: string, ...args: any[]): string;
        /**
         * 清空缓冲区数据
         */
        clear(): void;
        /**
         * 销毁渲染缓冲
         */
        destroy(): void;
        /**
         * 设置脏矩形策略
         */
        setDirtyRegionPolicy(state: string): void;
    }
    /**
     * @private
     */
    let RenderBuffer: {
        /**
         * 创建一个RenderTarget。
         * 注意：若内存不足或创建缓冲区失败，将会抛出错误异常。
         * @param width 渲染缓冲的初始宽
         * @param height 渲染缓冲的初始高
         * @param root 是否为舞台buffer
         */
        new (width?: number, height?: number, root?: boolean): RenderBuffer;
    };
    /**
     * @private
     */
    let CanvasRenderBuffer: {
        /**
         * 创建一个CanvasRenderBuffer。
         * 注意：若内存不足或创建缓冲区失败，将会抛出错误异常。
         * @param width 渲染缓冲的初始宽
         * @param height 渲染缓冲的初始高
         */
        new (width?: number, height?: number): RenderBuffer;
    };
}
declare namespace egret.sys {
    /**
     * @private
     */
    interface Renderable extends HashObject {
        /**
         * 获取渲染节点
         */
        $getRenderNode(): RenderNode;
        /**
         * @private
         * 更新对象在舞台上的显示区域和透明度,返回显示区域是否发生改变。
         * 注意：此方法必须在$getRenderNode()被调用之后执行。
         */
        $update(dirtyRegionPolicy: string, bounds?: Rectangle): boolean;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 设备屏幕
     */
    interface Screen {
        /**
         * @private
         * 更新屏幕视口尺寸
         */
        updateScreenSize(): any;
        /**
         * @private
         * 更新触摸数量
         */
        updateMaxTouches(): any;
        /**
         * @private
         * 设置分辨率尺寸
         */
        setContentSize(width: number, height: number): any;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 屏幕适配器接口，当播放器视口尺寸改变时，屏幕适配器将被用于计算当前对应的舞台显示尺寸。
     */
    interface IScreenAdapter {
        /**
         * @private
         * 计算舞台显示尺寸
         * @param scaleMode 当前的缩放模式
         * @param screenWidth 播放器视口宽度
         * @param screenHeight 播放器视口高度
         * @param contentWidth 初始化内容宽度
         * @param contentHeight 初始化内容高度
         */
        calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): StageDisplaySize;
    }
    /**
     * @private
     * 舞台显示尺寸数据
     */
    interface StageDisplaySize {
        /**
         * @private
         * 舞台宽度
         */
        stageWidth: number;
        /**
         * @private
         * 舞台高度
         */
        stageHeight: number;
        /**
         * @private
         * 显示宽度，若跟舞台宽度不同，将会产生缩放。
         */
        displayWidth: number;
        /**
         * @private
         * 显示高度，若跟舞台高度不同，将会产生缩放。
         */
        displayHeight: number;
    }
    /**
     * @private
     * 屏幕适配器实例，开发者可以通过给这个变量赋值实现了IScreenAdapter接口的实例，从而注入自定义的屏幕适配器。
     */
    let screenAdapter: IScreenAdapter;
    /**
     * @private
     * 屏幕适配器默认实现，开发者可以实现自定义规则的屏幕适配器。并在初始化加载时将适配器的实例赋值给egret.sys.screenAdapter上，从而替换掉默认适配器。
     */
    class DefaultScreenAdapter extends HashObject implements IScreenAdapter {
        /**
         * @private
         */
        constructor();
        /**
         * @private
         * 计算舞台显示尺寸
         * @param scaleMode 当前的缩放模式
         * @param screenWidth 播放器视口宽度
         * @param screenHeight 播放器视口高度
         * @param contentWidth 初始化内容宽度
         * @param contentHeight 初始化内容高度
         */
        calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): StageDisplaySize;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * StageScaleMode class provides values for the stage zoom mode.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/player/StageScaleMode.ts
     */
    /**
     * @language zh_CN
     * StageScaleMode 类为舞台缩放模式提供值。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/player/StageScaleMode.ts
     */
    class StageScaleMode {
        /**
         * @language en_US
         * Do not scale application content. Even when you change the player viewport size, it remains unchanged. If the player is smaller than the viewport content, possibly with some cropping.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) always with the player viewport size consistent.
         */
        /**
         * @language zh_CN
         * 不缩放应用程序内容。即使在更改播放器视口大小时，它仍然保持不变。如果播放器视口比内容小，则可能进行一些裁切。<br/>
         * 在此模式下，舞台尺寸（Stage.stageWidth,Stage.stageHeight）始终跟播放器视口大小保持一致。
         */
        static NO_SCALE: string;
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling a wide directions application content to fill the viewport players on both sides in the other direction may not be wide enough and left black bars.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming external application content size.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较宽方向填满播放器视口，另一个方向的两侧可能会不够宽而留有黑边。<br/>
         * 在此模式下，舞台尺寸(Stage.stageWidth,Stage.stageHeight)始终等于初始化时外部传入的应用程序内容尺寸。
         */
        static SHOW_ALL: string;
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling a narrow direction of application content to fill the viewport players on both sides in the other direction may exceed the viewport and the player is cut.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming external application content size.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较窄方向填满播放器视口，另一个方向的两侧可能会超出播放器视口而被裁切。<br/>
         * 在此模式下，舞台尺寸(Stage.stageWidth,Stage.stageHeight)始终等于初始化时外部传入的应用程序内容尺寸。
         */
        static NO_BORDER: string;
        /**
         * @language en_US
         * Do not keep the original aspect ratio scaling application content, after scaling application content just fill the player viewport.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming external application content size.
         */
        /**
         * @language zh_CN
         * 不保持原始宽高比缩放应用程序内容，缩放后应用程序内容正好填满播放器视口。<br/>
         * 在此模式下，舞台尺寸(Stage.stageWidth,Stage.stageHeight)始终等于初始化时外部传入的应用程序内容尺寸。
         */
        static EXACT_FIT: string;
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant width, height may change.<br/>
         * In this mode, the stage width (Stage.stageWidth) is always equal to initialize external incoming application content width. Stage height (Stage.stageHeight) by the current scale with the player viewport height decision.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始宽度不变，高度可能会改变。<br/>
         * 在此模式下，舞台宽度(Stage.stageWidth)始终等于初始化时外部传入的应用程序内容宽度。舞台高度(Stage.stageHeight)由当前的缩放比例与播放器视口高度决定。
         */
        static FIXED_WIDTH: string;
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant height, width may change.<br/>
         * In this mode, the stage height (Stage.stageHeight) is always equal to initialize external incoming application content height. Stage width (Stage.stageWidth) by the current scale with the player viewport width decision.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始高度不变，宽度可能会改变。<br/>
         * 在此模式下，舞台高度(Stage.stageHeight)始终等于初始化时外部传入的应用程序内容高度。舞台宽度(Stage.stageWidth)由当前的缩放比例与播放器视口宽度决定。
         */
        static FIXED_HEIGHT: string;
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player,a narrow direction may not be wide enough and fill.<br/>
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale with the player viewport size.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，应用程序内容的较窄方向可能会不够宽而填充。<br/>
         * 在此模式下，舞台高度(Stage.stageHeight)和舞台宽度(Stage.stageWidth)由当前的缩放比例与播放器视口宽高决定。
         */
        static FIXED_NARROW: string;
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, a wide direction may exceed the viewport and the player is cut.<br/>
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale with the player viewport size.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，应用程序内容的较宽方向的两侧可能会超出播放器视口而被裁切。<br/>
         * 在此模式下，舞台高度(Stage.stageHeight)和舞台宽度(Stage.stageWidth)由当前的缩放比例与播放器视口宽高决定。
         */
        static FIXED_WIDE: string;
    }
}
declare namespace egret.sys {
    /**
     * @private
     */
    let systemRenderer: SystemRenderer;
    /**
     * @private
     * 用于碰撞检测绘制
     */
    let canvasRenderer: SystemRenderer;
    /**
     * @private
     * 显示渲染器接口
     */
    interface SystemRenderer {
        /**
         * 渲染一个显示对象
         * @param displayObject 要渲染的显示对象
         * @param buffer 渲染缓冲
         * @param matrix 要对显示对象整体叠加的变换矩阵
         * @param dirtyList 脏矩形列表
         * @param forRenderTexture 绘制目标是RenderTexture的标志
         * @returns drawCall触发绘制的次数
         */
        render(displayObject: DisplayObject, buffer: RenderBuffer, matrix: Matrix, dirtyList?: Region[], forRenderTexture?: boolean): number;
        /**
         * 将一个RenderNode对象绘制到渲染缓冲
         * @param node 要绘制的节点
         * @param buffer 渲染缓冲
         * @param matrix 要叠加的矩阵
         * @param forHitTest 绘制结果是用于碰撞检测。若为true，当渲染GraphicsNode时，会忽略透明度样式设置，全都绘制为不透明的。
         */
        drawNodeToBuffer(node: sys.RenderNode, buffer: RenderBuffer, matrix: Matrix, forHitTest?: boolean): void;
    }
}
declare namespace egret.sys {
    /**
     * @private
     */
    let $START_TIME: number;
    /**
     * @private
     * 是否要广播Event.RENDER事件的标志。
     */
    let $invalidateRenderFlag: boolean;
    /**
     * @private
     * 需要立即刷新屏幕的标志
     */
    let $requestRenderingFlag: boolean;
    /**
     * @private
     * Egret心跳计时器
     */
    class SystemTicker {
        /**
         * @private
         */
        constructor();
        /**
         * @private
         */
        private playerList;
        /**
         * @private
         * 注册一个播放器实例并运行
         */
        $addPlayer(player: Player): void;
        /**
         * @private
         * 停止一个播放器实例的运行。
         */
        $removePlayer(player: Player): void;
        /**
         * @private
         */
        private callBackList;
        /**
         * @private
         */
        private thisObjectList;
        /**
         * @private
         */
        $startTick(callBack: (timeStamp: number) => boolean, thisObject: any): void;
        /**
         * @private
         */
        $stopTick(callBack: (timeStamp: number) => boolean, thisObject: any): void;
        /**
         * @private
         */
        private getTickIndex(callBack, thisObject);
        /**
         * @private
         *
         */
        private concatTick();
        /**
         * @private
         * 全局帧率
         */
        $frameRate: number;
        /**
         * @private
         */
        private frameInterval;
        private frameDeltaTime;
        private lastTimeStamp;
        /**
         * @private
         * 设置全局帧率
         */
        $setFrameRate(value: number): boolean;
        /**
         * @private
         */
        private lastCount;
        /**
         * @private
         * ticker 花销的时间
         */
        private costEnterFrame;
        /**
         * @private
         * 执行一次刷新
         */
        update(): void;
        /**
         * @private
         * 执行一次屏幕渲染
         */
        private render(triggerByFrame, costTicker);
        /**
         * @private
         * 广播EnterFrame事件。
         */
        private broadcastEnterFrame();
        /**
         * @private
         * 广播Render事件。
         */
        private broadcastRender();
        /**
         * @private
         */
        private callLaters();
        /**
         * @private
         */
        private callLaterAsyncs();
    }
    /**
     * @private
     * 心跳计时器单例
     */
    let $ticker: SystemTicker;
}
/**
 * @private
 */
declare let egret_stages: egret.Stage[];
declare namespace egret.sys {
    /**
     * @private
     * 用户交互操作管理器
     */
    class TouchHandler extends HashObject {
        private maxTouches;
        private useTouchesCount;
        /**
         * @private
         */
        constructor(stage: Stage);
        /**
         * @private
         * 设置同时触摸数量
         */
        $initMaxTouches(): void;
        /**
         * @private
         */
        private stage;
        /**
         * @private
         */
        private touchDownTarget;
        /**
         * @private
         * 触摸开始（按下）
         * @param x 事件发生处相对于舞台的坐标x
         * @param y 事件发生处相对于舞台的坐标y
         * @param touchPointID 分配给触摸点的唯一标识号
         */
        onTouchBegin(x: number, y: number, touchPointID: number): void;
        /**
         * @private
         */
        private lastTouchX;
        /**
         * @private
         */
        private lastTouchY;
        /**
         * @private
         * 触摸移动
         * @param x 事件发生处相对于舞台的坐标x
         * @param y 事件发生处相对于舞台的坐标y
         * @param touchPointID 分配给触摸点的唯一标识号
         */
        onTouchMove(x: number, y: number, touchPointID: number): void;
        /**
         * @private
         * 触摸结束（弹起）
         * @param x 事件发生处相对于舞台的坐标x
         * @param y 事件发生处相对于舞台的坐标y
         * @param touchPointID 分配给触摸点的唯一标识号
         */
        onTouchEnd(x: number, y: number, touchPointID: number): void;
        /**
         * @private
         * 获取舞台坐标下的触摸对象
         */
        private findTarget(stageX, stageY);
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 渲染节点类型
     */
    const enum RenderNodeType {
        /**
         * 位图渲染节点
         */
        BitmapNode = 1,
        /**
         * 文本渲染节点
         */
        TextNode = 2,
        /**
         * 矢量渲染节点
         */
        GraphicsNode = 3,
        /**
         * 组渲染节点
         */
        GroupNode = 4,
        /**
         * 设置矩阵节点
         */
        SetTransformNode = 5,
        /**
         * 设置透明度节点
         */
        SetAlphaNode = 6,
        /**
         * Mesh 节点
         */
        MeshNode = 7,
    }
    /**
     * @private
     * 渲染节点基类
     */
    class RenderNode {
        /**
         * 节点类型..
         */
        type: number;
        /**
         * 是否需要重绘的标志。
         */
        needRedraw: boolean;
        /**
         * 这个对象在舞台上的整体透明度
         */
        renderAlpha: number;
        /**
         * 这个对象在舞台上的透明度
         */
        renderVisible: boolean;
        /**
         * 相对于显示列表根节点或位图缓存根节点上的矩阵对象
         */
        renderMatrix: Matrix;
        /**
         * 此显示对象自身（不包括子项）在显示列表根节点或位图缓存根节点上的显示尺寸。
         */
        renderRegion: sys.Region;
        /**
         * 是否发生移动
         */
        moved: boolean;
        /**
         * 绘制数据
         */
        drawData: any[];
        /**
         * 绘制次数
         */
        protected renderCount: number;
        /**
         * 在显示对象的$render()方法被调用前，自动清空自身的drawData数据。
         */
        cleanBeforeRender(): void;
        $getRenderCount(): number;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 位图渲染节点
     */
    class BitmapNode extends RenderNode {
        constructor();
        /**
         * 要绘制的位图
         */
        image: BitmapData;
        /**
         * 控制在缩放时是否对位图进行平滑处理。
         */
        smoothing: boolean;
        /**
         * 相对偏移矩阵。
         */
        matrix: egret.Matrix;
        /**
         * 图片宽度。WebGL渲染使用
         */
        imageWidth: number;
        /**
         * 图片高度。WebGL渲染使用
         */
        imageHeight: number;
        /**
         * 使用的混合模式
         */
        blendMode: number;
        /**
         * 相对透明度
         */
        alpha: number;
        /**
         * 相对透明度
         */
        filter: ColorMatrixFilter;
        /**
         * 绘制一次位图
         */
        drawImage(sourceX: number, sourceY: number, sourceW: number, sourceH: number, drawX: number, drawY: number, drawW: number, drawH: number): void;
        /**
         * 在显示对象的$render()方法被调用前，自动清空自身的drawData数据。
         */
        cleanBeforeRender(): void;
        static $updateTextureData(node: sys.BitmapNode, image: any, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number, textureWidth: number, textureHeight: number, destW: number, destH: number, sourceWidth: number, sourceHeight: number, scale9Grid: egret.Rectangle, fillMode: string, smoothing: boolean): void;
        /**
         * @private
         * 绘制九宫格位图
         */
        private static $updateTextureDataWithScale9Grid(node, scale9Grid, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH);
        /**
  * @private
  */
        private static drawClipImage(node, scale, bitmapX, bitmapY, scaledBitmapW, scaledBitmapH, offsetX, offsetY, destW, destH, startX?, startY?);
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 矢量渲染节点
     */
    class GraphicsNode extends RenderNode {
        constructor();
        /**
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * @param color 填充的颜色
         * @param alpha 填充的 Alpha 值
         * @param beforePath 插入在指定的路径命令之前绘制，通常是插入到当前正在绘制的线条路径之前，以确保线条总在填充的上方。
         */
        beginFill(color: number, alpha?: number, beforePath?: Path2D): Path2D;
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
        beginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix?: egret.Matrix, beforePath?: Path2D): Path2D;
        /**
         * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
         * @param thickness 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param caps 用于指定线条末端处端点类型的 CapsStyle 类的值。默认值：CapsStyle.ROUND
         * @param joints 指定用于拐角的连接外观的类型。默认值：JointStyle.ROUND
         * @param miterLimit 用于表示剪切斜接的极限值的数字。
         */
        lineStyle(thickness?: number, color?: number, alpha?: number, caps?: string, joints?: string, miterLimit?: number): Path2D;
        /**
         * 清空所有缓存的绘制数据
         */
        clear(): void;
        /**
         * 覆盖父类方法，不自动清空缓存的绘图数据，改为手动调用clear()方法清空。
         */
        cleanBeforeRender(): void;
        /**
         * 绘制x偏移
         */
        x: number;
        /**
         * 绘制y偏移
         */
        y: number;
        /**
         * 绘制宽度
         */
        width: number;
        /**
         * 绘制高度
         */
        height: number;
        /**
         * 脏渲染标记
         * 暂时调用lineStyle,beginFill,beginGradientFill标记,实际应该draw时候标记在Path2D
         */
        dirtyRender: boolean;
        $texture: any;
        $textureWidth: any;
        $textureHeight: any;
        /**
         * 清除非绘制的缓存数据
         */
        clean(): void;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 组渲染节点,用于组合多个渲染节点
     */
    class GroupNode extends RenderNode {
        constructor();
        addNode(node: RenderNode): void;
        /**
         * 覆盖父类方法，不自动清空缓存的绘图数据，改为手动调用clear()方法清空。
         * 这里只是想清空绘制命令，因此不调用super
         */
        cleanBeforeRender(): void;
        $getRenderCount(): number;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * Mesh 渲染节点
     */
    class MeshNode extends RenderNode {
        constructor();
        /**
         * 要绘制的位图
         */
        image: BitmapData;
        /**
         * 控制在缩放时是否对位图进行平滑处理。
         */
        smoothing: boolean;
        /**
         * 图片宽度。WebGL渲染使用
         */
        imageWidth: number;
        /**
         * 图片高度。WebGL渲染使用
         */
        imageHeight: number;
        /**
         * 相对偏移矩阵。
         */
        matrix: egret.Matrix;
        /**
         * UV 坐标。
         */
        uvs: number[];
        /**
         * 顶点坐标。
         */
        vertices: number[];
        /**
         * 顶点索引。
         */
        indices: number[];
        /**
         * 顶点索引。
         */
        bounds: Rectangle;
        /**
         * 绘制一次位图
         */
        drawMesh(sourceX: number, sourceY: number, sourceW: number, sourceH: number, drawX: number, drawY: number, drawW: number, drawH: number): void;
        /**
         * 在显示对象的$render()方法被调用前，自动清空自身的drawData数据。
         */
        cleanBeforeRender(): void;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 位图渲染节点
     */
    class SetAlphaNode extends RenderNode {
        constructor();
        /**
         * 绘制一次位图
         */
        setAlpha(alpha: number): void;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 文本格式
     */
    interface TextFormat {
        /**
         * 颜色值
         */
        textColor?: number;
        /**
         * 描边颜色值
         */
        strokeColor?: number;
        /**
         * 字号
         */
        size?: number;
        /**
         * 描边大小
         */
        stroke?: number;
        /**
         * 是否加粗
         */
        bold?: boolean;
        /**
         * 是否倾斜
         */
        italic?: boolean;
        /**
         * 字体名称
         */
        fontFamily?: string;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 文本渲染节点
     */
    class TextNode extends RenderNode {
        constructor();
        /**
         * 颜色值
         */
        textColor: number;
        /**
         * 描边颜色值
         */
        strokeColor: number;
        /**
         * 字号
         */
        size: number;
        /**
         * 描边大小
         */
        stroke: number;
        /**
         * 是否加粗
         */
        bold: boolean;
        /**
         * 是否倾斜
         */
        italic: boolean;
        /**
         * 字体名称
         */
        fontFamily: string;
        /**
         * 绘制一行文本
         */
        drawText(x: number, y: number, text: string, format: TextFormat): void;
        /**
         * 在显示对象的$render()方法被调用前，自动清空自身的drawData数据。
         */
        cleanBeforeRender(): void;
        /**
         * 绘制x偏移
         */
        x: number;
        /**
         * 绘制y偏移
         */
        y: number;
        /**
         * 绘制宽度
         */
        width: number;
        /**
         * 绘制高度
         */
        height: number;
        /**
         * 脏渲染标记
         */
        dirtyRender: boolean;
        $texture: any;
        $textureWidth: any;
        $textureHeight: any;
        /**
         * 清除非绘制的缓存数据
         */
        clean(): void;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 路径类型
     */
    const enum PathType {
        /**
         * 纯色填充路径
         */
        Fill = 1,
        /**
         * 渐变填充路径
         */
        GradientFill = 2,
        /**
         * 线条路径
         */
        Stroke = 3,
    }
    /**
     * @private
     * 2D路径命令
     */
    const enum PathCommand {
        MoveTo = 1,
        LineTo = 2,
        CurveTo = 3,
        CubicCurveTo = 4,
    }
    /**
     * @private
     * 2D路径
     */
    class Path2D {
        /**
         * 路径类型
         */
        type: number;
        $commands: number[];
        $data: number[];
        private commandPosition;
        private dataPosition;
        /**
         * 当前移动到的坐标X
         * 注意：目前只有drawArc之前会被赋值
         */
        $lastX: number;
        /**
         * 当前移动到的坐标Y
         * 注意：目前只有drawArc之前会被赋值
         */
        $lastY: number;
        /**
         * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         */
        moveTo(x: number, y: number): void;
        /**
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         */
        lineTo(x: number, y: number): void;
        /**
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)。
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * 绘制的曲线是二次贝塞尔曲线。二次贝塞尔曲线包含两个锚点和一个控制点。该曲线内插这两个锚点，并向控制点弯曲。
         * @param controlX 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         */
        curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        /**
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲。
         * @param controlX1 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY 指定锚点相对于父显示对象的注册点的垂直位置。
         */
        cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        /**
         * 绘制一个矩形
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         */
        drawRect(x: number, y: number, width: number, height: number): void;
        /**
         * 绘制一个圆角矩形。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @param ellipseWidth 用于绘制圆角的椭圆的宽度（以像素为单位）。
         * @param ellipseHeight 用于绘制圆角的椭圆的高度（以像素为单位）。 （可选）如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
         */
        drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        /**
         * 绘制一个圆。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param radius 圆的半径（以像素为单位）。
         */
        drawCircle(x: number, y: number, radius: number): void;
        /**
         * 绘制一个椭圆。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         */
        drawEllipse(x: number, y: number, width: number, height: number): void;
        /**
         * 绘制一段圆弧路径。圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
         * @param x 圆弧中心（圆心）的 x 轴坐标。
         * @param y 圆弧中心（圆心）的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
         * 注意，必须在0~2π之间。
         * @param endAngle 圆弧的终点， 单位以弧度表示。
         * 注意，必须在0~2π之间。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         */
        drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
        /**
         * 绘制一段圆弧路径
         * @param x 圆弧中心（圆心）的 x 轴坐标。
         * @param y 圆弧中心（圆心）的 y 轴坐标。
         * @param radiusX 圆弧的半径 x。
         * @param radiusY 圆弧的半径 y。
         * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
         * 注意：必须为正数。
         * @param endAngle 圆弧的终点， 单位以弧度表示。
         * 注意：与startAngle差值必须在0~2π之间。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         * 注意：如果为true，endAngle必须小于startAngle，反之必须大于。
         */
        private arcToBezier(x, y, radiusX, radiusY, startAngle, endAngle, anticlockwise?);
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 填充路径
     */
    class FillPath extends Path2D {
        constructor();
        /**
         * 填充颜色
         */
        fillColor: number;
        /**
         * 填充透明度
         */
        fillAlpha: number;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 渐变填充路径
     */
    class GradientFillPath extends Path2D {
        constructor();
        gradientType: string;
        colors: number[];
        alphas: number[];
        ratios: number[];
        matrix: Matrix;
    }
}
declare namespace egret.sys {
    /**
     * @private
     * 线条路径。
     * 注意：当线条宽度（lineWidth）为1或3像素时，需要特殊处理，往右下角偏移0.5像素，以显示清晰锐利的线条。
     */
    class StrokePath extends Path2D {
        constructor();
        /**
         * 线条宽度。
         * 注意：绘制时对1像素和3像素要特殊处理，整体向右下角偏移0.5像素，以显示清晰锐利的线条。
         */
        lineWidth: number;
        /**
         * 线条颜色
         */
        lineColor: number;
        /**
         * 线条透明度
         */
        lineAlpha: number;
        /**
         * 端点样式,"none":无端点,"round":圆头端点,"square":方头端点
         */
        caps: string;
        /**
         * 联接点样式,"bevel":斜角连接,"miter":尖角连接,"round":圆角连接
         */
        joints: string;
        /**
         * 用于表示剪切斜接的极限值的数字。
         */
        miterLimit: number;
    }
}
declare namespace egret {
    /**
     * @private
     * Canvas渲染器
     */
    class CanvasRenderer implements sys.SystemRenderer {
        constructor();
        private nestLevel;
        /**
         * 渲染一个显示对象
         * @param displayObject 要渲染的显示对象
         * @param buffer 渲染缓冲
         * @param matrix 要对显示对象整体叠加的变换矩阵
         * @param dirtyList 脏矩形列表
         * @param forRenderTexture 绘制目标是RenderTexture的标志
         * @returns drawCall触发绘制的次数
         */
        render(displayObject: DisplayObject, buffer: sys.RenderBuffer, matrix: Matrix, dirtyList?: egret.sys.Region[], forRenderTexture?: boolean): number;
        /**
         * @private
         * 绘制一个显示对象
         */
        private drawDisplayObject(displayObject, context, dirtyList, matrix, displayList, clipRegion, root);
        /**
         * @private
         */
        private drawWithFilter(displayObject, context, dirtyList, matrix, clipRegion, root);
        private renderingMask;
        /**
         * @private
         */
        private drawWithClip(displayObject, context, dirtyList, matrix, clipRegion, root);
        /**
         * @private
         */
        private drawWithScrollRect(displayObject, context, dirtyList, matrix, clipRegion, root);
        /**
         * 将一个RenderNode对象绘制到渲染缓冲
         * @param node 要绘制的节点
         * @param buffer 渲染缓冲
         * @param matrix 要叠加的矩阵
         * @param forHitTest 绘制结果是用于碰撞检测。若为true，当渲染GraphicsNode时，会忽略透明度样式设置，全都绘制为不透明的。
         */
        drawNodeToBuffer(node: sys.RenderNode, buffer: sys.RenderBuffer, matrix: Matrix, forHitTest?: boolean): void;
        /**
         * @private
         */
        private renderNode(node, context, forHitTest?);
        /**
         * render mesh
         */
        private renderMesh(node, context);
        /**
         * @private
         */
        private renderBitmap(node, context);
        /**
         * @private
         */
        renderText(node: sys.TextNode, context: CanvasRenderingContext2D): void;
        /**
         * @private
         */
        renderGraphics(node: sys.GraphicsNode, context: CanvasRenderingContext2D, forHitTest?: boolean): number;
        private renderPath(path, context);
        private renderGroup(groupNode, context);
        /**
         * @private
         */
        private createRenderBuffer(width, height);
    }
}
declare namespace egret {
    /**
     * @language en_US
     * Orientation monitor the orientation of the device, send CHANGE event when the orientation is changed
     *
     * @event egret.Event.CHANGE device's orientation is changed
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/DeviceOrientation.ts
     * @see http://edn.egret.com/cn/docs/page/661 获取设备旋转角度
     */
    /**
     * @language zh_CN
     * Orientation 监听设备方向的变化，当方向变化时派发 CHANGE 事件
     * @event egret.Event.CHANGE 设备方向改变时派发
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/DeviceOrientation.ts
     * @see http://edn.egret.com/cn/docs/page/661 获取设备旋转角度
     */
    interface DeviceOrientation extends EventDispatcher {
        /**
         * @language en_US
         * Start to monitor the device's orientation
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 开始监听设备方向变化
         * @version Egret 2.4
         * @platform Web
         */
        start(): void;
        /**
         * @language en_US
         * Stop monitor the device's orientation
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 停止监听设备方向变化
         * @version Egret 2.4
         * @platform Web
         */
        stop(): void;
    }
    /**
     * @copy egret.Orientation
     */
    let DeviceOrientation: {
        new (): DeviceOrientation;
    };
}
declare namespace egret {
    /**
     * @language en_US
     * The Geolocation able to obtain the position of the device.
     * Geolocation will emit CHANGE event when the device's location is changed.
     * It will emit IO_ERROR event if the location request is denied
     * or there is no location service on the device.
     *
     * @event egret.Event.CHANGE The device's location is changed
     * @event egret.Event.IO_ERROR Error occurred while getting the location
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Geolocation.ts
     */
    /**
     * @language zh_CN
     * Geolocation 能够从设备的定位服务获取设备的当前位置。
     * 当设备的位置发生改变时 Geolocation 会派发 CHANGE 事件。
     * 当定位请求被拒绝或该设备没有定位服务时 Geolocation 会派发 IO_ERROR 事件。
     *
     * @event egret.Event.CHANGE 设备位置发生改变
     * @event egret.Event.IO_ERROR 获取设备位置时发生错误
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Geolocation.ts
     */
    interface Geolocation extends EventDispatcher {
        /**
         * @language en_US
         * Start to monitor the device's location
         * @returns
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 开始监听设备位置信息
         * @returns
         * @version Egret 2.4
         * @platform Web
         */
        start(): void;
        /**
         * @language en_US
         * Stop monitor the device's location
         * @returns
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 停止监听设备位置信息
         * @returns
         * @version Egret 2.4
         * @platform Web
         */
        stop(): void;
    }
    /**
     * @copy egret.Geolocation
     */
    let Geolocation: {
        /**
         * @language en_US
         * constructor
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 构造函数
         * @version Egret 2.4
         * @platform Web
         */
        new (): Geolocation;
    };
}
declare namespace egret {
    /**
     * @copy egret.Motion
     */
    let Motion: {
        new (): Motion;
    };
    /**
     * @language en_US
     * The Motion class emits events based on activity detected by the device's motion sensor.
     * This data represents the device's movement along a 3-dimensional axis. When the device moves,
     * the sensor detects this movement and emit the CHANGE event. @see egret.MotionEvent
     *
     * @event egret.Event.CHANGE device is moved
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Motion.ts
     */
    /**
     * @language zh_CN
     * Motion 类从用户设备读取运动状态信息并派发 CHANGE 事件。
     * 当设备移动时，传感器会检测到此移动并返回设备加速度，重力和旋转数据。@see egret.MotionEvent
     * Motion 类提供了 start 和 stop 方法，来启动和停止运动信息检查
     *
     * @event egret.Event.CHANGE 运动状态发生改变
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Motion.ts
     */
    interface Motion extends EventDispatcher {
        /**
         * @language en_US
         * Start to monitor device movement
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 开始监听设备运动状态
         * @version Egret 2.4
         * @platform Web
         */
        start(): void;
        /**
         * @language en_US
         * Stop monitor device movement
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 停止监听设备运动状态
         * @version Egret 2.4
         * @platform Web
         */
        stop(): void;
    }
    /**
     * @language en_US
     * A DeviceRotationRate object provides information about the rate at which
     * the device is rotating around all three axes.
     * @version Egret 2.4
     * @platform Web
     */
    /**
     * @language zh_CN
     * DeviceRotationRate 提供设备围绕三个轴旋转的角速度信息，单位是 角度/秒
     * @version Egret 2.4
     * @platform Web
     */
    interface DeviceRotationRate {
        /**
         * @language en_US
         * The amount of rotation around the Z axis, in degrees per second.
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 设备绕 Z 轴旋转的角速度信息，单位是 度/秒
         * @version Egret 2.4
         * @platform Web
         */
        alpha: number;
        /**
         * @language en_US
         * The amount of rotation around the X axis, in degrees per second.
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 设备绕 X 轴旋转的角速度信息，单位是 度/秒
         * @version Egret 2.4
         * @platform Web
         */
        beta: number;
        /**
         * @language en_US
         * The amount of rotation around the Y axis, in degrees per second.
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 设备绕 Y 轴旋转的角速度信息，单位是 度/秒
         * @version Egret 2.4
         * @platform Web
         */
        gamma: number;
    }
    /**
     * @language en_US
     * A DeviceAcceleration object provides information about the amount
     * of acceleration the device is experiencing along all three axes.
     * Acceleration is expressed in m/s2.
     * @version Egret 2.4
     * @platform Web
     */
    /**
     * @language zh_CN
     * DeviceAcceleration 提供设备在三个维度的加速度信息，加速度值的单位是 m/s2
     * @version Egret 2.4
     * @platform Web
     */
    interface DeviceAcceleration {
        /**
         * @language en_US
         * The amount of acceleration along the X axis
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * X 轴方向的加速度值
         * @version Egret 2.4
         * @platform Web
         */
        x: number;
        /**
         * @language en_US
         * The amount of acceleration along the Y axis
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * Y 轴方向的加速度值
         * @version Egret 2.4
         * @platform Web
         */
        y: number;
        /**
         * @language en_US
         * The amount of acceleration along the Z axis
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * Z 轴方向的加速度值
         * @version Egret 2.4
         * @platform Web
         */
        z: number;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * Type of operation.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 运行类型的类型。
     * @version Egret 2.4
     * @platform Web,Native
     */
    class RuntimeType {
        /**
         * @language en_US
         * Running on Web
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 运行在Web上
         * @version Egret 2.4
         * @platform Web,Native
         */
        static WEB: string;
        /**
         * @language en_US
         * Running on NATIVE
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 运行在NATIVE上
         * @version Egret 2.4
         * @platform Web,Native
         */
        static NATIVE: string;
    }
    /**
     * @language en_US
     * The Capabilities class provides properties that describe the system and runtime that are hosting the application.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/system/Capabilities.ts
     */
    /**
     * @language zh_CN
     * Capabilities 类提供一些属性，这些属性描述了承载应用程序的系统和运行时。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/system/Capabilities.ts
     */
    class Capabilities {
        /**
         * @private
         */
        static $language: string;
        /**
         * @language en_US
         * Specifies the language code of the system on which the content is running. The language is specified as a lowercase
         * two-letter language code from ISO 639-1. For Chinese, an additional uppercase two-letter country code from ISO 3166
         * distinguishes between Simplified and Traditional Chinese.<br/>
         * The following table lists the possible values,but not limited to them:
         * <ul>
         * <li>Simplified    Chinese  zh-CN</li>
         * <li>Traditional   Chinese  zh-TW</li>
         * <li>English       en</li>
         * <li>Japanese      ja</li>
         * <li>Korean        ko</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示运行内容的系统的语言代码。语言指定为 ISO 639-1 中的小写双字母语言代码。
         * 对于中文，另外使用 ISO 3166 中的大写双字母国家/地区代码，以区分简体中文和繁体中文。<br/>
         * 以下是可能但不限于的语言和值：
         * <ul>
         * <li>简体中文  zh-CN</li>
         * <li>繁体中文  zh-TW</li>
         * <li>英语      en</li>
         * <li>日语      ja</li>
         * <li>韩语      ko</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        static language: string;
        /**
         * @private
         */
        static $isMobile: boolean;
        /**
         * @language en_US
         * Specifies whether the system is running in a mobile device.(such as a mobile phone or tablet)
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示程序内容是否运行在移动设备中（例如移动电话或平板电脑）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static isMobile: boolean;
        /**
         * @private
         */
        static $os: string;
        /**
         * @language en_US
         * Specifies the current operating system. The os property can return the following strings:
         * <ul>
         * <li>iPhone            "iOS"</li>
         * <li>Android Phone     "Android"</li>
         * <li>Windows Phone     "Windows Phone"</li>
         * <li>Windows Desktop   "Windows PC"</li>
         * <li>Mac Desktop       "Mac OS"</li>
         * <li>Unknown OS        "Unknown"</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示当前的操作系统。os 属性返回下列字符串：
         * <ul>
         * <li>苹果手机操作系统     "iOS"</li>
         * <li>安卓手机操作系统     "Android"</li>
         * <li>微软手机操作系统     "Windows Phone"</li>
         * <li>微软桌面操作系统     "Windows PC"</li>
         * <li>苹果桌面操作系统     "Mac OS"</li>
         * <li>未知操作系统        "Unknown"</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        static os: string;
        /**
         * @private
         */
        static $runtimeType: string;
        /**
         * @language en_US
         * It indicates the current type of operation. runtimeType property returns the following string:
         * <ul>
         * <li>Run on Web     egret.RuntimeType.WEB</li>
         * <li>Run on Native     egret.RuntimeType.NATIVE</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示当前的运行类型。runtimeType 属性返回下列字符串：
         * <ul>
         * <li>运行在Web上     egret.RuntimeType.WEB</li>
         * <li>运行在Native上     egret.RuntimeType.NATIVE</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        static runtimeType: string;
        /***
         * @language en_US
         * version of the native support.
         * @type {string}
         * @version Egret 2.5
         * @platform Web,Native
         */
        /***
         * @language zh_CN
         * native support 的版本号。
         * @type {string}
         * @version Egret 2.5
         * @platform Web,Native
         */
        static supportVersion: string;
        static $supportVersion: string;
        /***
         * @language en_US
         * version of Egret.
         * @type {string}
         * @version Egret 3.2.0
         * @platform Web,Native
         */
        /***
         * @language zh_CN
         * Egret 的版本号。
         * @type {string}
         * @version Egret 3.2.0
         * @platform Web,Native
         */
        static engineVersion: string;
        /**
         * 设置系统信息
         */
        static $setNativeCapabilities(value: string): void;
        /***
         * @language en_US
         * current render mode.
         * @type {string}
         * @version Egret 3.0.7
         * @platform Web,Native
         */
        /***
         * @language zh_CN
         * 当前渲染模式。
         * @type {string}
         * @version Egret 3.0.7
         * @platform Web,Native
         */
        static renderMode: string;
        static $renderMode: string;
        /***
         * @language en_US
         * Clients border width.
         * The value before the document class initialization is always 0.
         * This value will change after the distribution Event.RESIZE and StageOrientationEvent.ORIENTATION_CHANGE.
         * @version Egret 3.1.3
         * @platform Web,Native
         */
        /***
         * @language zh_CN
         * 客户端边界宽度。
         * 该值在文档类初始化之前始终是0。
         * 该值在派发 Event.RESIZE 以及 StageOrientationEvent.ORIENTATION_CHANGE 之后会发生改变。
         * @version Egret 3.1.3
         * @platform Web,Native
         */
        static boundingClientWidth: number;
        static $boundingClientWidth: number;
        /***
         * @language en_US
         * Clients border height.
         * The value before the document class initialization is always 0.
         * This value will change after the distribution Event.RESIZE and StageOrientationEvent.ORIENTATION_CHANGE.
         * @version Egret 3.1.3
         * @platform Web,Native
         */
        /***
         * @language zh_CN
         * 客户端边界高度。
         * 该值在文档类初始化之前始终是0。
         * 该值在派发 Event.RESIZE 以及 StageOrientationEvent.ORIENTATION_CHANGE 之后会发生改变。
         * @version Egret 3.1.3
         * @platform Web,Native
         */
        static boundingClientHeight: number;
        static $boundingClientHeight: number;
    }
}
/**
 * @private
 */
declare let testDeviceType: () => boolean;
/**
 * @private
 */
declare let testRuntimeType: () => boolean;
declare namespace egret {
    /**
     * @language en_US
     * Writes an error message to the console if the assertion is false. If the assertion is true, nothing will happen.
     * @param assertion Any boolean expression. If the assertion is false, the message will get written to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     */
    /**
     * @language zh_CN
     * 判断参数assertion是否为true，若为false则抛出异常并且在console输出相应信息，反之什么也不做。
     * @param assertion 一个 boolean 表达式，若结果为false，则抛出错误并输出信息。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外可选信息
     */
    function assert(assertion?: boolean, message?: string, ...optionalParams: any[]): void;
    /**
     * @language en_US
     * Writes a warning message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     */
    /**
     * @language zh_CN
     * 输出一个警告信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     */
    function warn(message?: any, ...optionalParams: any[]): void;
    /**
     * @language en_US
     * Writes an error message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     */
    /**
     * @language zh_CN
     * 输出一个错误信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     */
    function error(message?: any, ...optionalParams: any[]): void;
    /**
     * @language en_US
     * Writes an message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     */
    /**
     * @language zh_CN
     * 输出一个日志信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     */
    function log(message?: any, ...optionalParams: any[]): void;
}
declare namespace egret {
    function getI(): void;
    /**
     * @language en_US
     * Adds an interface-name-to-implementation-class mapping to the registry.
     * @param interfaceName the interface name to register. For example："eui.IAssetAdapter","eui.Theme"
     * @param instance the instance to register.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 注册一个接口实现。
     * @param interfaceName 注入的接口名称。例如："eui.IAssetAdapter","eui.Theme"
     * @param instance 实现此接口的实例。
     * @version Egret 3.2.1
     * @platform Web,Native
     */
    function registerImplementation(interfaceName: string, instance: any): void;
    /**
     * @language en_US
     * Returns the singleton instance of the implementation class that was registered for the specified interface.
     * This method is usually called by egret framework.
     * @param interfaceName The interface name to identify. For example："eui.IAssetAdapter","eui.Theme"
     * @returns the singleton instance of the implementation class
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 获取一个接口实现。此方法通常由框架内部调用。获取项目注入的自定义实现实例。
     * @param interfaceName 要获取的接口名称。例如："eui.IAssetAdapter","eui.Theme"
     * @returns 返回实现此接口的实例。
     * @version Egret 3.2.1
     * @platform Web,Native
     */
    function getImplementation(interfaceName: string): any;
}
declare namespace egret {
    /**
     * @language en_US
     * Bitmap font, texture set of a font. It is generally used as the value of the BitmapText.font attribute.
     * @see http://bbs.egret-labs.org/thread-918-1-1.html TextureMerger
     * @see http://bbs.egret-labs.org/forum.php?mod=viewthread&tid=251 Text(Containing the specific usage of the bitmap font )
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapFont.ts
     */
    /**
     * @language zh_CN
     * 位图字体,是一个字体的纹理集，通常作为BitmapText.font属性的值。
     * @see http://bbs.egret-labs.org/thread-918-1-1.html TextureMerger
     * @see http://bbs.egret-labs.org/forum.php?mod=viewthread&tid=251 文本(含位图字体具体用法)
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapFont.ts
     */
    class BitmapFont extends SpriteSheet {
        /**
         * @language en_US
         * Create an egret.BitmapFont object
         * @param texture {egret.Texture} Texture set that use TextureMerger create
         * @param config {any} Configure data that use TextureMerger create
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.BitmapFont 对象
         * @param texture {egret.Texture} 使用TextureMerger生成的纹理集
         * @param config {any} 使用TextureMerger生成的配置数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(texture: Texture, config: any);
        /**
         * @private
         */
        private charList;
        /**
         * @language en_US
         * Obtain corresponding texture through the name attribute
         * @param name {string} name Attribute
         * @returns {egret.Texture}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 通过 name 属性获取对应纹理
         * @param name {string} name属性
         * @returns {egret.Texture}
         * @version Egret 2.4
         * @platform Web,Native
         */
        getTexture(name: string): Texture;
        /**
         * @private
         */
        getConfig(name: string, key: string): number;
        /**
         * @private
         */
        private firstCharHeight;
        /**
         * @private
         *
         * @returns
         */
        _getFirstCharHeight(): number;
        /**
         * @private
         *
         * @param fntText
         * @returns
         */
        private parseConfig(fntText);
        /**
         * @private
         *
         * @param configText
         * @param key
         * @returns
         */
        private getConfigByKey(configText, key);
    }
}
declare namespace egret.sys {
    /**
     * @private
     */
    const enum BitmapTextKeys {
        /**
         * @private 外部设定的值
         */
        textFieldWidth = 0,
        /**
         * @private 外部设定的值
         */
        textFieldHeight = 1,
        /**
         * @private
         */
        text = 2,
        /**
         * @private
         */
        lineSpacing = 3,
        /**
         * @private
         */
        letterSpacing = 4,
        /**
         * @private
         */
        font = 5,
        /**
         * @private
         */
        fontStringChanged = 6,
        /**
         * @private
         */
        textLinesChanged = 7,
        /**
         * @private 测量的值
         */
        textWidth = 8,
        /**
         * @private 测量的值
         */
        textHeight = 9,
        /**
         * @private
         */
        textAlign = 10,
        /**
         * @private
         */
        verticalAlign = 11,
        /**
         * @private
         */
        smoothing = 12,
    }
}
declare namespace egret {
    /**
     * @language en_US
     * Bitmap font adopts the Bitmap+SpriteSheet mode to render text.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     */
    /**
     * @language zh_CN
     * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     */
    class BitmapText extends DisplayObject {
        /**
         * @language en_US
         * Create an egret.BitmapText object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.BitmapText 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @language en_US
         * Whether or not is smoothed when scaled.
         * @default true。
         * @version Egret 3.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 控制在缩放时是否进行平滑处理。
         * @default true。
         * @version Egret 3.0
         * @platform Web
         */
        smoothing: boolean;
        /**
         * @private
         */
        $BitmapText: Object;
        /**
         * @language en_US
         * A string to display in the text field.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要显示的文本内容
         * @version Egret 2.4
         * @platform Web,Native
         */
        text: string;
        /**
         * @private
         */
        $setText(value: string): boolean;
        /**
         * @private
         */
        $getWidth(): number;
        /**
         * @private
         */
        $setWidth(value: number): boolean;
        /**
         * @private
         */
        $invalidateContentBounds(): void;
        /**
         * @private
         */
        $getHeight(): number;
        /**
         * @private
         */
        $setHeight(value: number): boolean;
        /**
         * @language en_US
         * The name of the font to use, or a comma-separated list of font names, the type of value must be BitmapFont.
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要使用的字体的名称或用逗号分隔的字体名称列表，类型必须是 BitmapFont。
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        font: Object;
        $setFont(value: any): boolean;
        /**
         /**
         * @language en_US
         * An integer representing the amount of vertical space between lines.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个整数，表示行与行之间的垂直间距量
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        lineSpacing: number;
        $setLineSpacing(value: number): boolean;
        /**
         * @language en_US
         * An integer representing the amount of distance between characters.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个整数，表示字符之间的距离。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        letterSpacing: number;
        $setLetterSpacing(value: number): boolean;
        /**
         * @language en_US
         * Horizontal alignment of text.
         * @default：egret.HorizontalAlign.LEFT
         * @version Egret 2.5.6
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本的水平对齐方式。
         * @default：egret.HorizontalAlign.LEFT
         * @version Egret 2.5.6
         * @platform Web,Native
         */
        textAlign: string;
        $setTextAlign(value: string): boolean;
        /**
         * @language en_US
         * Vertical alignment of text.
         * @default：egret.VerticalAlign.TOP
         * @version Egret 2.5.6
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文字的垂直对齐方式。
         * @default：egret.VerticalAlign.TOP
         * @version Egret 2.5.6
         * @platform Web,Native
         */
        verticalAlign: string;
        $setVerticalAlign(value: string): boolean;
        /**
         * @language en_US
         * A ratio of the width of the space character. This value is multiplied by the height of the first character is the space character width.
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个空格字符的宽度比例。这个数值乘以第一个字符的高度即为空格字符的宽。
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         */
        static EMPTY_FACTOR: number;
        /**
         * @private
         */
        $render(): void;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        /**
         * @language en_US
         * Get the BitmapText measured width
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取位图文本测量宽度
         * @version Egret 2.4
         * @platform Web,Native
         */
        textWidth: number;
        /**
         * @language en_US
         * Get Text BitmapText height
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取位图文本测量高度
         * @version Egret 2.4
         * @platform Web,Native
         */
        textHeight: number;
        /**
         * @private
         */
        private $textOffsetX;
        /**
         * @private
         */
        private $textOffsetY;
        /**
         * @private
         */
        private $textStartX;
        /**
         * @private
         */
        private $textStartY;
        /**
         * @private
         */
        private textLines;
        /**
         * @private 每一行文字的宽度
         */
        private $textLinesWidth;
        /**
         * @private
         */
        $lineHeights: number[];
        /**
         * @private
         *
         * @returns
         */
        $getTextLines(): string[];
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The HorizontalAlign class defines the possible values for the horizontal alignment.
     * @see egret.TextField#textAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * HorizontalAlign 类为水平对齐方式定义可能的值。
     * @see egret.TextField#textAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    class HorizontalAlign {
        /**
         * @language en_US
         * Horizontally align content to the left of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的左侧对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static LEFT: string;
        /**
         * @language en_US
         * Horizontally align content to the right of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的右侧对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static RIGHT: string;
        /**
         * @language en_US
         * Horizontally align content in the center of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在容器的水平中心对齐内容。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static CENTER: string;
        /**
         * @language en_US
         * Horizontal alignment with both edges.
         * Note: TextFiled does not support this alignment method.
         * @constant egret.HorizontalAlign.JUSTIFY
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 水平两端对齐。
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.HorizontalAlign.JUSTIFY
         * @version Egret 2.4
         * @platform Web,Native
         */
        static JUSTIFY: string;
        /**
         * @language en_US
         * Align the content of the child items, relative to the container. This operation will adjust uniformly the size of all the child items to be the Content Width \" of the container \".
         * The Content Width \" of the container \" is the size of the max. child item. If the size of all child items are less than the width of the container, they will be adjusted to the width of the container.
         * Note: TextFiled does not support this alignment method.
         * @constant egret.HorizontalAlign.CONTENT_JUSTIFY
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容宽度"。
         * 容器的"内容宽度"是最大子项的大小,如果所有子项都小于容器的宽度，则会将所有子项的大小调整为容器的宽度。
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.HorizontalAlign.CONTENT_JUSTIFY
         * @version Egret 2.4
         * @platform Web,Native
         */
        static CONTENT_JUSTIFY: string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * Convert the text in html format to the object that can be assigned to the egret.TextField#textFlow property
     * @see http://edn.egret.com/cn/docs/page/146 Text mixed in a variety of style
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/HtmlTextParser.ts
     */
    /**
     * @language zh_CN
     * 将html格式文本转换为可赋值给 egret.TextField#textFlow 属性的对象
     * @see http://edn.egret.com/cn/docs/page/146 多种样式文本混合
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/HtmlTextParser.ts
     */
    class HtmlTextParser {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        private replaceArr;
        private initReplaceArr();
        /**
         * @private
         *
         * @param value
         * @returns
         */
        private replaceSpecial(value);
        /**
         * @private
         */
        private resutlArr;
        /**
         * @language en_US
         * Convert the text in html format to the object that can be assigned to the egret.TextField#textFlow property
         * @param htmltext {string} Text in html
         * @returns {Array<egret.ITextElement>} 可赋值给 egret.TextField#textFlow Object that can be assigned to the egret.TextField#textFlow property
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将html格式文本转换为可赋值给 egret.TextField#textFlow 属性的对象
         * @param htmltext {string} html文本
         * @returns {Array<egret.ITextElement>} 可赋值给 egret.TextField#textFlow 属性的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        parser(htmltext: string): Array<egret.ITextElement>;
        /**
         * @private
         *
         * @param value
         */
        private addToResultArr(value);
        private changeStringToObject(str);
        /**
         * @private
         *
         * @returns
         */
        private getHeadReg();
        /**
         * @private
         *
         * @param info
         * @param head
         * @param value
         */
        private addProperty(info, head, value);
        /**
         * @private
         */
        private stackArray;
        /**
         * @private
         *
         * @param infoStr
         */
        private addToArray(infoStr);
    }
}
declare namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface IHitTextElement {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        lineIndex: number;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        textElementIndex: number;
    }
    /**
     * @language en_US
     * Text Style
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 文本样式
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface ITextStyle {
        /**
         * @language en_US
         * text color
         * @version Egret 2.4
         * @platform Web,Native
         * @see http://edn.egret.com/cn/docs/page/146 多种样式混合文本的基本结构
         */
        /**
         * @language zh_CN
         * 颜色值
         * @version Egret 2.4
         * @platform Web,Native
         * @see http://edn.egret.com/cn/docs/page/146 多种样式混合文本的基本结构
         */
        textColor?: number;
        /**
         * @language en_US
         * stroke color
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 描边颜色值
         * @version Egret 2.4
         * @platform Web,Native
         */
        strokeColor?: number;
        /**
         * @language en_US
         * size
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 字号
         * @version Egret 2.4
         * @platform Web,Native
         */
        size?: number;
        /**
         * @language en_US
         * stroke width
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 描边大小
         * @version Egret 2.4
         * @platform Web,Native
         */
        stroke?: number;
        /**
         * @language en_US
         * whether bold
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否加粗
         * @version Egret 2.4
         * @platform Web,Native
         */
        bold?: boolean;
        /**
         * @language en_US
         * whether italic
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否倾斜
         * @version Egret 2.4
         * @platform Web,Native
         */
        italic?: boolean;
        /**
         * @language en_US
         * fontFamily
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 字体名称
         * @version Egret 2.4
         * @platform Web,Native
         */
        fontFamily?: string;
        /**
         * @language en_US
         * Link events or address
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 链接事件或者地址
         * @version Egret 2.4
         * @platform Web,Native
         */
        href?: string;
        /**
         * @language en_US
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        target?: string;
        /**
         * @language en_US
         * Is underlined
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否加下划线
         * @version Egret 2.4
         * @platform Web,Native
         */
        underline?: boolean;
    }
    /**
     * @language en_US
     * Used to build the basic structure of text with a variety of mixed styles, mainly for setting textFlow property
     * @see http://edn.egret.com/cn/docs/page/146 Text mixed in a variety of style
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 用于建立多种样式混合文本的基本结构，主要用于设置 textFlow 属性
     * @see http://edn.egret.com/cn/docs/page/146 多种样式文本混合
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface ITextElement {
        /**
         * @language en_US
         * String Content
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 字符串内容
         * @version Egret 2.4
         * @platform Web,Native
         */
        text: string;
        /**
         * @language en_US
         * Text Style
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本样式
         * @version Egret 2.4
         * @platform Web,Native
         */
        style?: ITextStyle;
    }
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface IWTextElement extends ITextElement {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        width: number;
    }
    /**
     * 文本最终解析的一行数据格式
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface ILineElement {
        /**
         * 文本占用宽度
         * @version Egret 2.4
         * @platform Web,Native
         */
        width: number;
        /**
         * 文本占用高度
         * @version Egret 2.4
         * @platform Web,Native
         */
        height: number;
        /**
         * 当前文本字符总数量（包括换行符）
         * @version Egret 2.4
         * @platform Web,Native
         */
        charNum: number;
        /**
         * 是否含有换行符
         * @version Egret 2.4
         * @platform Web,Native
         */
        hasNextLine: boolean;
        /**
         * 本行文本内容
         * @version Egret 2.4
         * @platform Web,Native
         */
        elements: Array<IWTextElement>;
    }
}
declare namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    class InputController extends HashObject {
        /**
         * @private
         */
        private stageText;
        /**
         * @private
         */
        private stageTextAdded;
        /**
         * @private
         */
        private _text;
        /**
         * @private
         */
        private _isFocus;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         *
         * @param text
         * @version Egret 2.4
         * @platform Web,Native
         */
        init(text: TextField): void;
        /**
         * @private
         *
         */
        _addStageText(): void;
        /**
         * @private
         *
         */
        _removeStageText(): void;
        /**
         * @private
         *
         * @returns
         */
        _getText(): string;
        /**
         * @private
         *
         * @param value
         */
        _setText(value: string): void;
        /**
         * @private
         */
        _setColor(value: number): void;
        /**
         * @private
         *
         * @param event
         */
        private focusHandler(event);
        /**
         * @private
         *
         * @param event
         */
        private blurHandler(event);
        private tempStage;
        private onMouseDownHandler(event);
        $onFocus(): void;
        private onStageDownHandler(event);
        /**
         * @private
         *
         * @param event
         */
        private updateTextHandler(event);
        /**
         * @private
         *
         */
        private resetText();
        /**
         * @private
         *
         */
        _hideInput(): void;
        /**
         * @private
         *
         */
        private updateInput();
        /**
         * @private
         *
         */
        _updateProperties(): void;
    }
}
declare namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface StageText extends EventDispatcher {
        /**
         * @private
         */
        $textfield: egret.TextField;
        /**
         * @private
         *
         * @param textfield
         */
        $setTextField(textfield: egret.TextField): boolean;
        /**
         * @private
         *
         */
        $resetStageText(): void;
        /**
         * @private
         *
         * @returns
         */
        $getText(): string;
        /**
         * @private
         *
         * @param value
         */
        $setText(value: string): boolean;
        /**
         * @private
         *
         * @param value
         */
        $setColor(value: number): boolean;
        /**
         * @private
         *
         */
        $show(): void;
        /**
         * @private
         *
         */
        $hide(): void;
        /**
         * @private
         *
         */
        $addToStage(): void;
        /**
         * @private
         *
         */
        $removeFromStage(): void;
        /**
         * @private
         *
         */
        $onBlur(): void;
    }
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    let StageText: {
        new (): StageText;
    };
}
declare namespace egret.sys {
    /**
     * @private
     */
    const enum TextKeys {
        /**
         * @private
         */
        fontSize = 0,
        /**
         * @private
         */
        lineSpacing = 1,
        /**
         * @private
         */
        textColor = 2,
        /**
         * @private
         */
        textFieldWidth = 3,
        /**
         * @private
         */
        textFieldHeight = 4,
        /**
         * @private
         */
        textWidth = 5,
        /**
         * @private
         */
        textHeight = 6,
        /**
         * @private
         */
        textDrawWidth = 7,
        /**
         * @private
         */
        fontFamily = 8,
        /**
         * @private
         */
        textAlign = 9,
        /**
         * @private
         */
        verticalAlign = 10,
        /**
         * @private
         */
        textColorString = 11,
        /**
         * @private
         */
        fontString = 12,
        /**
         * @private
         */
        text = 13,
        /**
         * @private
         */
        measuredWidths = 14,
        /**
         * @private
         */
        bold = 15,
        /**
         * @private
         */
        italic = 16,
        /**
         * @private
         */
        fontStringChanged = 17,
        /**
         * @private
         */
        textLinesChanged = 18,
        /**
         * @private
         */
        wordWrap = 19,
        /**
         * @private
         */
        displayAsPassword = 20,
        /**
         * @private
         */
        maxChars = 21,
        /**
         * @private
         */
        selectionActivePosition = 22,
        /**
         * @private
         */
        selectionAnchorPosition = 23,
        /**
         * @private
         */
        type = 24,
        /**
         * @private
         */
        strokeColor = 25,
        /**
         * @private
         */
        strokeColorString = 26,
        /**
         * @private
         */
        stroke = 27,
        /**
         * @private
         */
        scrollV = 28,
        /**
         * @private
         */
        numLines = 29,
        /**
         * @private
         */
        multiline = 30,
        /**
         * @private
         */
        border = 31,
        /**
         * @private
         */
        borderColor = 32,
        /**
         * @private
         */
        background = 33,
        /**
         * @private
         */
        backgroundColor = 34,
        /**
         * @private
         */
        restrictAnd = 35,
        /**
         * @private
         */
        restrictNot = 36,
        /**
         * @private
         */
        inputType = 37,
    }
}
declare namespace egret {
    /**
     * @language en_US
     * TextField is the text rendering class of egret. It conducts rendering by using the browser / device API. Due to different ways of font rendering in different browsers / devices, there may be differences in the rendering
     * If developers expect  no differences among all platforms, please use BitmapText
     * @see http://edn.egret.com/cn/docs/page/141 Create Text
     *
     * @event egret.Event.CHANGE Dispatched when entering text user input。
     * @event egret.FocusEvent.FOCUS_IN Dispatched after the focus to enter text.
     * @event egret.FocusEvent.FOCUS_OUT Enter the text loses focus after dispatch.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/TextField.ts
     */
    /**
     * @language zh_CN
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
     * @see http://edn.egret.com/cn/docs/page/141 创建文本
     *
     * @event egret.Event.CHANGE 输入文本有用户输入时调度。
     * @event egret.FocusEvent.FOCUS_IN 聚焦输入文本后调度。
     * @event egret.FocusEvent.FOCUS_OUT 输入文本失去焦点后调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/TextField.ts
     */
    class TextField extends DisplayObject {
        /**
         * @language en_US
         * default fontFamily
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 默认文本字体
         * @version Egret 2.4
         * @platform Web,Native
         */
        static default_fontFamily: string;
        /**
         * @language en_US
         * default size in pixels of text
         * @version Egret 3.2.1
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 默认文本字号大小
         * @version Egret 3.2.1
         * @platform Web,Native
         */
        static default_size: number;
        /**
         * @language en_US
         * default color of the text.
         * @version Egret 3.2.1
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 默认文本颜色
         * @version Egret 3.2.1
         * @platform Web,Native
         */
        static default_textColor: number;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @private
         */
        $TextField: Object;
        /**
         * @private
         */
        private isInput();
        $inputEnabled: boolean;
        $setTouchEnabled(value: boolean): boolean;
        /**
         * @language en_US
         * The name of the font to use, or a comma-separated list of font names.
         * @default "Arial"
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要使用的字体的名称或用逗号分隔的字体名称列表。
         * @default "Arial"
         * @version Egret 2.4
         * @platform Web,Native
         */
        fontFamily: string;
        $setFontFamily(value: string): boolean;
        /**
         * @language en_US
         * The size in pixels of text
         * @default 30
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本的字号大小。
         * @default 30
         * @version Egret 2.4
         * @platform Web,Native
         */
        size: number;
        $setSize(value: number): boolean;
        /**
         * @language en_US
         * Specifies whether the text is boldface.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否显示为粗体。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        bold: boolean;
        $setBold(value: boolean): boolean;
        /**
         * @language en_US
         * Determines whether the text is italic font.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否显示为斜体。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        italic: boolean;
        $setItalic(value: boolean): boolean;
        /**
         * @private
         *
         */
        private invalidateFontString();
        /**
         * @language en_US
         * Horizontal alignment of text.
         * @default：egret.HorizontalAlign.LEFT
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本的水平对齐方式。
         * @default：egret.HorizontalAlign.LEFT
         * @version Egret 2.4
         * @platform Web,Native
         */
        textAlign: string;
        $setTextAlign(value: string): boolean;
        /**
         * @language en_US
         * Vertical alignment of text.
         * @default：egret.VerticalAlign.TOP
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文字的垂直对齐方式。
         * @default：egret.VerticalAlign.TOP
         * @version Egret 2.4
         * @platform Web,Native
         */
        verticalAlign: string;
        $setVerticalAlign(value: string): boolean;
        /**
         * @language en_US
         * An integer representing the amount of vertical space between lines.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个整数，表示行与行之间的垂直间距量
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        lineSpacing: number;
        $setLineSpacing(value: number): boolean;
        /**
         * @language en_US
         * Color of the text.
         * @default 0x000000
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本颜色
         * @default 0x000000
         * @version Egret 2.4
         * @platform Web,Native
         */
        textColor: number;
        $setTextColor(value: number): boolean;
        /**
         * @language en_US
         * A Boolean value that indicates whether the text field word wrap. If the value is true, then the text field by word wrap;
         * if the value is false, the text field by newline characters.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个布尔值，表示文本字段是否按单词换行。如果值为 true，则该文本字段按单词换行；
         * 如果值为 false，则该文本字段按字符换行。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         */
        wordWrap: boolean;
        /**
         * @private
         */
        private inputUtils;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Type of the text field.
         * Any one of the following TextFieldType constants: TextFieldType.DYNAMIC (specifies the dynamic text field that users can not edit), or TextFieldType.INPUT (specifies the dynamic text field that users can edit).
         * @default egret.TextFieldType.DYNAMIC
         */
        /**
         * @language zh_CN
         * 文本字段的类型。
         * 以下 TextFieldType 常量中的任一个：TextFieldType.DYNAMIC（指定用户无法编辑的动态文本字段），或 TextFieldType.INPUT（指定用户可以编辑的输入文本字段）。
         * @default egret.TextFieldType.DYNAMIC
         */
        type: string;
        /**
         * @private
         *
         * @param value
         */
        $setType(value: string): boolean;
        /**
         * @version Egret 3.1.2
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Pop-up keyboard type.
         * Any of a TextFieldInputType constants.
         */
        /**
         * @language zh_CN
         * 弹出键盘的类型。
         * TextFieldInputType 常量中的任一个。
         */
        inputType: string;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Serve as a string of the current text field in the text
         */
        /**
         * @language zh_CN
         * 作为文本字段中当前文本的字符串
         */
        text: string;
        /**
         * @private
         *
         * @returns
         */
        $getText(): string;
        /**
         * @private
         *
         * @param value
         */
        $setBaseText(value: string): boolean;
        /**
         * @private
         *
         * @param value
         */
        $setText(value: string): boolean;
        /**
         * @language en_US
         * Specify whether the text field is a password text field.
         * If the value of this property is true, the text field is treated as a password text field and hides the input characters using asterisks instead of the actual characters. If false, the text field is not treated as a password text field.
         * @default false
         */
        /**
         * @language zh_CN
         * 指定文本字段是否是密码文本字段。
         * 如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
         * @default false
         */
        displayAsPassword: boolean;
        /**
         * @private
         *
         * @param value
         */
        $setDisplayAsPassword(value: boolean): boolean;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Represent the stroke color of the text.
         * Contain three 8-bit numbers with RGB color components; for example, 0xFF0000 is red, 0x00FF00 is green.
         * @default 0x000000
         */
        /**
         * @language zh_CN
         * 表示文本的描边颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * @default 0x000000
         */
        strokeColor: number;
        /**
         * @private
         *
         * @param value
         */
        $setStrokeColor(value: number): boolean;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Indicate the stroke width.
         * 0 means no stroke.
         * @default 0
         */
        /**
         * @language zh_CN
         * 表示描边宽度。
         * 0为没有描边。
         * @default 0
         */
        stroke: number;
        /**
         * @private
         *
         * @param value
         */
        $setStroke(value: number): boolean;
        /**
         * @language en_US
         * The maximum number of characters that the text field can contain, as entered by a user. \n A script can insert more text than maxChars allows; the maxChars property indicates only how much text a user can enter. If the value of this property is 0, a user can enter an unlimited amount of text.
         * The default value is 0.
         * @default 0
         */
        /**
         * @language zh_CN
         * 文本字段中最多可包含的字符数（即用户输入的字符数）。
         * 脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
         * @default 0
         */
        maxChars: number;
        /**
         * @private
         *
         * @param value
         */
        $setMaxChars(value: number): boolean;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Vertical position of text in a text field. scrollV property helps users locate specific passages in a long article, and create scrolling text fields.
         * Vertically scrolling units are lines, and horizontal scrolling unit is pixels.
         * If the first displayed line is the first line in the text field, scrollV is set to 1 (instead of 0).
         */
        /**
         * @language zh_CN
         * 文本在文本字段中的垂直位置。scrollV 属性可帮助用户定位到长篇文章的特定段落，还可用于创建滚动文本字段。
         * 垂直滚动的单位是行，而水平滚动的单位是像素。
         * 如果显示的第一行是文本字段中的第一行，则 scrollV 设置为 1（而非 0）。
         */
        scrollV: number;
        /**
         * @language en_US
         * The maximum value of scrollV
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * scrollV 的最大值
         * @version Egret 2.4
         * @platform Web,Native
         */
        maxScrollV: number;
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        selectionBeginIndex: number;
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        selectionEndIndex: number;
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        caretIndex: number;
        /**
         * @private
         *
         * @param beginIndex
         * @param endIndex
         */
        $setSelection(beginIndex: number, endIndex: number): boolean;
        /**
         * @private
         *
         * @returns
         */
        $getLineHeight(): number;
        /**
         * @language en_US
         * Number of lines of text.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本行数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        numLines: number;
        /**
         * @language en_US
         * Indicate whether field is a multiline text field. Note that this property is valid only when the type is TextFieldType.INPUT.
         * If the value is true, the text field is multiline; if the value is false, the text field is a single-line text field. In a field of type TextFieldType.INPUT, the multiline value determines whether the Enter key creates a new line (a value of false, and the Enter key is ignored).
         * @default false
         */
        /**
         * @language zh_CN
         * 表示字段是否为多行文本字段。注意，此属性仅在type为TextFieldType.INPUT时才有效。
         * 如果值为 true，则文本字段为多行文本字段；如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。
         * @default false
         */
        multiline: boolean;
        /**
         * @private
         *
         * @param value
         */
        $setMultiline(value: boolean): boolean;
        /**
         * @language en_US
         * Indicates a user can enter into the text field character set. If you restrict property is null, you can enter any character. If you restrict property is an empty string, you can not enter any character. If you restrict property is a string of characters, you can enter only characters in the string in the text field. The string is scanned from left to right. You can use a hyphen (-) to specify a range. Only restricts user interaction; a script may put any text into the text field. <br/>
                  * If the string of characters caret (^) at the beginning, all characters are initially accepted, then the string are excluded from receiving ^ character. If the string does not begin with a caret (^) to, any characters are initially accepted and then a string of characters included in the set of accepted characters. <br/>
                  * The following example allows only uppercase characters, spaces, and numbers in the text field: <br/>
                  * My_txt.restrict = "A-Z 0-9"; <br/>
                  * The following example includes all characters except lowercase letters: <br/>
                  * My_txt.restrict = "^ a-z"; <br/>
                  * If you need to enter characters \ ^, use two backslash "\\ -" "\\ ^": <br/>
                  * Can be used anywhere in the string ^ to rule out including characters and switch between characters, but can only be used to exclude a ^. The following code includes only uppercase letters except uppercase Q: <br/>
                  * My_txt.restrict = "A-Z ^ Q"; <br/>
         * @version Egret 2.4
         * @platform Web,Native
         * @default null
         */
        /**
         * @language zh_CN
         * 表示用户可输入到文本字段中的字符集。如果 restrict 属性的值为 null，则可以输入任何字符。如果 restrict 属性的值为空字符串，则不能输入任何字符。如果 restrict 属性的值为一串字符，则只能在文本字段中输入该字符串中的字符。从左向右扫描该字符串。可以使用连字符 (-) 指定一个范围。只限制用户交互；脚本可将任何文本放入文本字段中。<br/>
         * 如果字符串以尖号 (^) 开头，则先接受所有字符，然后从接受字符集中排除字符串中 ^ 之后的字符。如果字符串不以尖号 (^) 开头，则最初不接受任何字符，然后将字符串中的字符包括在接受字符集中。<br/>
         * 下例仅允许在文本字段中输入大写字符、空格和数字：<br/>
         * my_txt.restrict = "A-Z 0-9";<br/>
         * 下例包含除小写字母之外的所有字符：<br/>
         * my_txt.restrict = "^a-z";<br/>
         * 如果需要输入字符 \ ^，请使用2个反斜杠 "\\-" "\\^" ：<br/>
         * 可在字符串中的任何位置使用 ^，以在包含字符与排除字符之间进行切换，但是最多只能有一个 ^ 用来排除。下面的代码只包含除大写字母 Q 之外的大写字母：<br/>
         * my_txt.restrict = "A-Z^Q";<br/>
         * @version Egret 2.4
         * @platform Web,Native
         * @default null
         */
        restrict: string;
        /**
         * @private
         *
         * @param value
         */
        $setWidth(value: number): boolean;
        /**
         * @private
         *
         * @param value
         */
        $setHeight(value: number): boolean;
        /**
         * @private
         * 获取显示宽度
         */
        $getWidth(): number;
        /**
         * @private
         * 获取显示宽度
         */
        $getHeight(): number;
        /**
         * @private
         */
        private textNode;
        /**
         * @private
         */
        private graphicsNode;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Specifies whether the text field has a border.
         * If true, the text field has a border. If false, the text field has no border.
         * Use borderColor property to set the border color.
         * @default false
         */
        /**
         * @language zh_CN
         * 指定文本字段是否具有边框。
         * 如果为 true，则文本字段具有边框。如果为 false，则文本字段没有边框。
         * 使用 borderColor 属性来设置边框颜色。
         * @default false
         */
        border: boolean;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * The color of the text field border.
         * Even currently is no border can be retrieved or set this property, but only if the text field has the border property is set to true, the color is visible.
         * @default 0x000000
         */
        /**
         * @language zh_CN
         * 文本字段边框的颜色。
         * 即使当前没有边框，也可检索或设置此属性，但只有当文本字段已将 border 属性设置为 true 时，才可以看到颜色。
         * @default 0x000000
         */
        borderColor: number;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Specifies whether the text field has a background fill.
         * If true, the text field has a background fill. If false, the text field has no background fill.
         * Use the backgroundColor property to set the background color of the text field.
         * @default false
         */
        /**
         * @language zh_CN
         * 指定文本字段是否具有背景填充。
         * 如果为 true，则文本字段具有背景填充。如果为 false，则文本字段没有背景填充。
         * 使用 backgroundColor 属性来设置文本字段的背景颜色。
         * @default false
         */
        background: boolean;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Color of the text field background.
         * Even currently is no background, can be retrieved or set this property, but only if the text field has the background property set to true, the color is visible.
         * @default 0xFFFFFF
         */
        /**
         * @language zh_CN
         * 文本字段背景的颜色。
         * 即使当前没有背景，也可检索或设置此属性，但只有当文本字段已将 background 属性设置为 true 时，才可以看到颜色。
         * @default 0xFFFFFF
         */
        backgroundColor: number;
        /**
         * @private
         *
         */
        private fillBackground(lines?);
        /**
         * @language en_US
         * Enter the text automatically entered into the input state, the input type is text only and may only be invoked in the user interaction.
         * @version Egret 3.0.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 输入文本自动进入到输入状态，仅在类型是输入文本并且是在用户交互下才可以调用。
         * @version Egret 3.0.8
         * @platform Web,Native
         */
        setFocus(): void;
        /**
         * @private
         *
         */
        $onRemoveFromStage(): void;
        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        $onAddToStage(stage: Stage, nestLevel: number): void;
        /**
         * 不能重写$invalidateContentBounds，因为内部graphics调用clear时会触发$invalidateContentBounds这狗方法，从而导致死循环。
         */
        $invalidateTextField(): void;
        $update(dirtyRegionPolicy: string, bounds?: Rectangle): boolean;
        $getRenderBounds(): Rectangle;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        /**
         * @private
         * @see egret.DisplayObject._render
         * @param renderContext
         */
        $render(): void;
        /**
         * @private
         */
        private isFlow;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language en_US
         * Set rich text
         */
        /**
         * @language zh_CN
         * 设置富文本
         * @see http://edn.egret.com/cn/index.php/article/index/id/146
         */
        textFlow: Array<egret.ITextElement>;
        /**
         * @private
         *
         * @param text
         * @returns
         */
        private changeToPassText(text);
        /**
         * @private
         */
        private textArr;
        /**
         * @private
         *
         * @param textArr
         */
        private setMiddleStyle(textArr);
        /**
         * @language en_US
         * Get the text measured width
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取文本测量宽度
         * @version Egret 2.4
         * @platform Web,Native
         */
        textWidth: number;
        /**
         * @language en_US
         * Get Text measuring height
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取文本测量高度
         * @version Egret 2.4
         * @platform Web,Native
         */
        textHeight: number;
        /**
         * @private
         * @param text
         * @version Egret 2.4
         * @platform Web,Native
         */
        appendText(text: string): void;
        /**
         * @private
         * @param element
         * @version Egret 2.4
         * @platform Web,Native
         */
        appendElement(element: egret.ITextElement): void;
        /**
         * @private
         */
        private linesArr;
        /**
         * @private
         *
         * @returns
         */
        $getLinesArr(): Array<egret.ILineElement>;
        /**
         * @private
         */
        $isTyping: boolean;
        /**
         * @private
         * 返回要绘制的下划线列表
         */
        private drawText();
        private addEvent();
        private removeEvent();
        private onTapHandler(e);
    }
}
declare namespace egret {
    /**
     * @language en_US
     * TextFieldInputType class is an enumeration of constant value used in setting the inputType property of the TextField class.
     * @version Egret 3.1.2
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * TextFieldInputType 类是在设置 TextField 类的 inputType 属性时使用的常数值的枚举。
     * @version Egret 3.1.2
     * @platform Web,Native
     */
    class TextFieldInputType {
        /**
         * @language en_US
         * The default
         * @version Egret 3.1.2
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 默认 input 类型
         * @version Egret 3.1.2
         * @platform Web,Native
         */
        static TEXT: string;
        /**
         * @language en_US
         * Telephone Number Inputs
         * @version Egret 3.1.2
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 电话号码 input 类型
         * @version Egret 3.1.2
         * @platform Web,Native
         */
        static TEL: string;
        /**
         * @language en_US
         * Password Inputs
         * @version Egret 3.1.2
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * password 类型
         * @version Egret 3.1.2
         * @platform Web,Native
         */
        static PASSWORD: string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * TextFieldType class is an enumeration of constant value used in setting the type property of the TextField class.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * TextFieldType 类是在设置 TextField 类的 type 属性时使用的常数值的枚举。
     * @version Egret 2.4
     * @platform Web,Native
     */
    class TextFieldType {
        /**
         * @language en_US
         * Used to specify dynamic text
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于指定动态文本
         * @version Egret 2.4
         * @platform Web,Native
         */
        static DYNAMIC: string;
        /**
         * @language en_US
         * Used to specify the input text
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于指定输入文本
         * @version Egret 2.4
         * @platform Web,Native
         */
        static INPUT: string;
    }
}
declare namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    class TextFieldUtils {
        /**
         * 获取第一个绘制的行数
         * @param textfield 文本
         * @returns {number} 行数，从0开始
         * @private
         */
        static $getStartLine(textfield: egret.TextField): number;
        /**
         * 获取水平比例
         * @param textfield 文本
         * @returns {number} 水平比例
         * @private
         */
        static $getHalign(textfield: egret.TextField): number;
        /**
         * @private
         *
         * @param textfield
         * @returns
         */
        static $getTextHeight(textfield: egret.TextField): number;
        /**
         * 获取垂直比例
         * @param textfield 文本
         * @returns {number} 垂直比例
         * @private
         */
        static $getValign(textfield: egret.TextField): number;
        /**
         * 根据x、y获取文本项
         * @param textfield 文本
         * @param x x坐标值
         * @param y y坐标值
         * @returns 文本单项
         * @private
         */
        static $getTextElement(textfield: egret.TextField, x: number, y: number): ITextElement;
        /**
         * 获取文本点击块
         * @param textfield 文本
         * @param x x坐标值
         * @param y y坐标值
         * @returns 文本点击块
         * @private
         */
        static $getHit(textfield: egret.TextField, x: number, y: number): IHitTextElement;
        /**
         * 获取当前显示多少行
         * @param textfield 文本
         * @returns {number} 显示的行数
         * @private
         */
        static $getScrollNum(textfield: egret.TextField): number;
    }
}
/**
 * @private
 */
declare namespace egret.sys {
    /**
     * 测量文本在指定样式下的宽度。
     * @param text 要测量的文本内容。
     * @param fontFamily 字体名称
     * @param fontSize 字体大小
     * @param bold 是否粗体
     * @param italic 是否斜体
     */
    let measureText: (text: string, fontFamily: string, fontSize: number, bold: boolean, italic: boolean) => number;
}
declare namespace egret {
    /**
     * @language en_US
     * The VerticalAlign class defines the possible values for the vertical alignment.
     * @see egret.TextField#verticalAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * VerticalAlign 类为垂直对齐方式定义可能的值。
     * @see egret.TextField#verticalAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    class VerticalAlign {
        /**
         * @language en_US
         * Vertically align content to the top of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的顶部对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TOP: string;
        /**
         * @language en_US
         * Vertically align content to the bottom of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的底部对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static BOTTOM: string;
        /**
         * @language en_US
         * Vertically align content in the middle of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在容器的垂直中心对齐内容。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static MIDDLE: string;
        /**
         * @language en_US
         * Vertical alignment with both edges
         * Note: TextFiled does not support this alignment method."
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 垂直两端对齐
         * 注意：TextFiled不支持此对齐方式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static JUSTIFY: string;
        /**
         * @language en_US
         * Align the content of the child items, relative to the container. This operation will adjust uniformly the size of all the child items to be the Content Height \" of the container \".
         * The Content Height \" of the container \" is the size of the max. child item. If the size of all child items are less than the height of the container, they will be adjusted to the height of the container.
         * Note: TextFiled does not support this alignment method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容高度"。
         * 容器的"内容高度"是最大子项的大小,如果所有子项都小于容器的高度，则会将所有子项的大小调整为容器的高度。
         * 注意：TextFiled不支持此对齐方式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static CONTENT_JUSTIFY: string;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The Endian class contains values that denote the byte order used to represent multibyte numbers.
     * The byte order is either bigEndian (most significant byte first) or littleEndian (least significant byte first).
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    class Endian {
        /**
         * @language en_US
         * Indicates the least significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte). The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static LITTLE_ENDIAN: string;
        /**
         * @language en_US
         * Indicates the most significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte).  The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static BIG_ENDIAN: string;
    }
    /**
     * @language en_US
     * The ByteArray class provides methods and attributes for optimized reading and writing as well as dealing with binary data.
     * Note: The ByteArray class is applied to the advanced developers who need to access data at the byte layer.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    /**
     * @language zh_CN
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    class ByteArray {
        /**
         * @private
         */
        private static SIZE_OF_BOOLEAN;
        /**
         * @private
         */
        private static SIZE_OF_INT8;
        /**
         * @private
         */
        private static SIZE_OF_INT16;
        /**
         * @private
         */
        private static SIZE_OF_INT32;
        /**
         * @private
         */
        private static SIZE_OF_UINT8;
        /**
         * @private
         */
        private static SIZE_OF_UINT16;
        /**
         * @private
         */
        private static SIZE_OF_UINT32;
        /**
         * @private
         */
        private static SIZE_OF_FLOAT32;
        /**
         * @private
         */
        private static SIZE_OF_FLOAT64;
        /**
         * @private
         */
        private BUFFER_EXT_SIZE;
        private data;
        /**
         * @private
         */
        private _position;
        /**
         * @private
         */
        private write_position;
        /**
         * @language en_US
         * Changes or reads the byte order; egret.Endian.BIG_ENDIAN or egret.Endian.LITTLE_ENDIAN.
         * @default egret.Endian.BIG_ENDIAN
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 更改或读取数据的字节顺序；egret.Endian.BIG_ENDIAN 或 egret.Endian.LITTLE_ENDIAN。
         * @default egret.Endian.BIG_ENDIAN
         * @version Egret 2.4
         * @platform Web,Native
         */
        endian: string;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(buffer?: ArrayBuffer);
        /**
         * @private
         * @param buffer
         */
        private _setArrayBuffer(buffer);
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        setArrayBuffer(buffer: ArrayBuffer): void;
        /**
         * @private
         */
        buffer: ArrayBuffer;
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @private
         */
        dataView: DataView;
        /**
         * @private
         */
        bufferOffset: number;
        /**
         * @language en_US
         * The current position of the file pointer (in bytes) to move or return to the ByteArray object. The next time you start reading reading method call in this position, or will start writing in this position next time call a write method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
         * @version Egret 2.4
         * @platform Web,Native
         */
        position: number;
        /**
         * @language en_US
         * The length of the ByteArray object (in bytes).
                  * If the length is set to be larger than the current length, the right-side zero padding byte array.
                  * If the length is set smaller than the current length, the byte array is truncated.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * ByteArray 对象的长度（以字节为单位）。
         * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
         * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
         * @version Egret 2.4
         * @platform Web,Native
         */
        length: number;
        /**
         * @language en_US
         * The number of bytes that can be read from the current position of the byte array to the end of the array data.
         * When you access a ByteArray object, the bytesAvailable property in conjunction with the read methods each use to make sure you are reading valid data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
         * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        bytesAvailable: number;
        /**
         * @language en_US
         * Clears the contents of the byte array and resets the length and position properties to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。

         * @version Egret 2.4
         * @platform Web,Native
         */
        clear(): void;
        /**
         * @language en_US
         * Read a Boolean value from the byte stream. Read a simple byte. If the byte is non-zero, it returns true; otherwise, it returns false.
         * @return If the byte is non-zero, it returns true; otherwise, it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         */
        readBoolean(): boolean;
        /**
         * @language en_US
         * Read signed bytes from the byte stream.
         * @return An integer ranging from -128 to 127
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readByte(): number;
        /**
         * @language en_US
         * Read data byte number specified by the length parameter from the byte stream. Starting from the position specified by offset, read bytes into the ByteArray object specified by the bytes parameter, and write bytes into the target ByteArray
         * @param bytes ByteArray object that data is read into
         * @param offset Offset (position) in bytes. Read data should be written from this position
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * @language en_US
         * Read an IEEE 754 double-precision (64 bit) floating point number from the byte stream
         * @return Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readDouble(): number;
        /**
         * @language en_US
         * Read an IEEE 754 single-precision (32 bit) floating point number from the byte stream
         * @return Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readFloat(): number;
        /**
         * @language en_US
         * Read a 32-bit signed integer from the byte stream.
         * @return A 32-bit signed integer ranging from -2147483648 to 2147483647
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readInt(): number;
        /**
         * @language en_US
         * Read a 16-bit signed integer from the byte stream.
         * @return A 16-bit signed integer ranging from -32768 to 32767
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readShort(): number;
        /**
         * @language en_US
         * Read unsigned bytes from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 255
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUnsignedByte(): number;
        /**
         * @language en_US
         * Read a 32-bit unsigned integer from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 4294967295
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUnsignedInt(): number;
        /**
         * @language en_US
         * Read a 16-bit unsigned integer from the byte stream.
         * @return A 16-bit unsigned integer ranging from 0 to 65535
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUnsignedShort(): number;
        /**
         * @language en_US
         * Read a UTF-8 character string from the byte stream Assume that the prefix of the character string is a short unsigned integer (use byte to express length)
         * @return UTF-8 character string
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUTF(): string;
        /**
         * @language en_US
         * Read a UTF-8 byte sequence specified by the length parameter from the byte stream, and then return a character string
         * @param Specify a short unsigned integer of the UTF-8 byte length
         * @return A character string consists of UTF-8 bytes of the specified length
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUTFBytes(length: number): string;
        /**
         * @language en_US
         * Write a Boolean value. A single byte is written according to the value parameter. If the value is true, write 1; if the value is false, write 0.
         * @param value A Boolean value determining which byte is written. If the value is true, write 1; if the value is false, write 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeBoolean(value: boolean): void;
        /**
         * @language en_US
         * Write a byte into the byte stream
         * The low 8 bits of the parameter are used. The high 24 bits are ignored.
         * @param value A 32-bit integer. The low 8 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeByte(value: number): void;
        /**
         * @language en_US
         * Write the byte sequence that includes length bytes in the specified byte array, bytes, (starting at the byte specified by offset, using a zero-based index), into the byte stream
         * If the length parameter is omitted, the default length value 0 is used and the entire buffer starting at offset is written. If the offset parameter is also omitted, the entire buffer is written
         * If the offset or length parameter is out of range, they are clamped to the beginning and end of the bytes array.
         * @param bytes ByteArray Object
         * @param offset A zero-based index specifying the position into the array to begin writing
         * @param length An unsigned integer specifying how far into the buffer to write
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes ByteArray 对象
         * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length 一个无符号整数，表示在缓冲区中的写入范围
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * @language en_US
         * Write an IEEE 754 double-precision (64 bit) floating point number into the byte stream
         * @param value Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeDouble(value: number): void;
        /**
         * @language en_US
         * Write an IEEE 754 single-precision (32 bit) floating point number into the byte stream
         * @param value Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeFloat(value: number): void;
        /**
         * @language en_US
         * Write a 32-bit signed integer into the byte stream
         * @param value An integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeInt(value: number): void;
        /**
         * @language en_US
         * Write a 16-bit integer into the byte stream. The low 16 bits of the parameter are used. The high 16 bits are ignored.
         * @param value A 32-bit integer. Its low 16 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeShort(value: number): void;
        /**
         * @language en_US
         * Write a 32-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUnsignedInt(value: number): void;
        /**
         * @language en_US
         * Write a 16-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 16 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         */
        writeUnsignedShort(value: number): void;
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. The length of the UTF-8 string in bytes is written first, as a 16-bit integer, followed by the bytes representing the characters of the string
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUTF(value: string): void;
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. Similar to the writeUTF() method, but the writeUTFBytes() method does not prefix the string with a 16-bit length word
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUTFBytes(value: string): void;
        /**
         *
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        toString(): string;
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        _writeUint8Array(bytes: Uint8Array, validateBuffer?: boolean): void;
        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        validate(len: number): boolean;
        /**********************/
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        private validateBuffer(len, needReplace?);
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        private encodeUTF8(str);
        /**
         * @private
         *
         * @param data
         * @returns
         */
        private decodeUTF8(data);
        /**
         * @private
         *
         * @param code_point
         */
        private encoderError(code_point);
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        private decoderError(fatal, opt_code_point?);
        /**
         * @private
         */
        private EOF_byte;
        /**
         * @private
         */
        private EOF_code_point;
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        private inRange(a, min, max);
        /**
         * @private
         *
         * @param n
         * @param d
         */
        private div(n, d);
        /**
         * @private
         *
         * @param string
         */
        private stringToCodePoints(string);
    }
}
declare namespace egret {
    /**
     * @private
     */
    let fontMapping: {};
    /**
     * 兼容旧版本不使用 fontMapping 的情况
     * @private
     */
    let useFontMapping: boolean;
    /**
     * @language en_US
     * Register font mapping.
     * @param fontFamily The font family name to register.
     * @param value The font value.
     * @version Egret 3.2.3
     * @platform Native
     */
    /**
     * @language zh_CN
     * 注册字体映射
     * @param fontFamily 要注册的字体名称
     * @param value 注册的字体值
     * @version Egret 3.2.3
     * @platform Native
     */
    function registerFontMapping(fontFamily: string, value: string): void;
}
declare namespace egret {
    /**
     * @language en_US
     * Logger is an entrance for the log processing namespace of the engine
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Logger是引擎的日志处理模块入口
     * @version Egret 2.4
     * @platform Web,Native
     */
    class Logger {
        /**
         * @language en_US
         * open all
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 全开
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ALL: string;
        /**
         * @language en_US
         * level: DEBUG
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 DEBUG
         * @version Egret 2.4
         * @platform Web,Native
         */
        static DEBUG: string;
        /**
         * @language en_US
         * level: INFO
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 INFO
         * @version Egret 2.4
         * @platform Web,Native
         */
        static INFO: string;
        /**
         * @language en_US
         * level: WARN
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 WARN
         * @version Egret 2.4
         * @platform Web,Native
         */
        static WARN: string;
        /**
         * @language en_US
         * level: ERROR
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 ERROR
         * @version Egret 2.4
         * @platform Web,Native
         */
        static ERROR: string;
        /**
         * @language en_US
         * close all
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 全关
         * @version Egret 2.4
         * @platform Web,Native
         */
        static OFF: string;
        /**
         * @language en_US
         * Set the current need to open the log level. Grade level are: ALL <DEBUG <INFO <WARN <ERROR <OFF<br/>
         * This feature is only in DEBUG mode to take effect. <br/>
         * <Ul>
         * <Li> Logger.ALL - all levels of log can be printed out. </ li>
         * <Li> Logger.DEBUG - print debug, info, log, warn, error. </ li>
         * <Li> Logger.INFO - print info, log, warn, error. </ li>
         * <Li> Logger.WARN - can print warn, error. </ li>
         * <Li> Logger.ERROR - You can print error. </ li>
         * <Li> Logger.OFF - all closed. </ li>
         * </ Ul>
         *param LogType from this level to start printing.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置当前需要开启的log级别。级别等级分别为：ALL < DEBUG < INFO < WARN < ERROR < OFF<br/>
         * 此功能只在 DEBUG 模式下才生效。<br/>
         * <ul>
         * <li>Logger.ALL -- 所有等级的log都可以打印出来。</li>
         * <li>Logger.DEBUG -- 可以打印debug、info、log、warn、error。</li>
         * <li>Logger.INFO -- 可以打印info、log、warn、error。</li>
         * <li>Logger.WARN -- 可以打印warn、error。</li>
         * <li>Logger.ERROR -- 可以打印error。</li>
         * <li>Logger.OFF -- 全部关闭。</li>
         * </ul>
         * @param logType 从这个等级开始打印。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static logLevel: string;
    }
}
declare namespace egret {
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    class NumberUtils {
        /**
         * @language en_US
         * Judge whether it is a numerical value
         * @param value Parameter that needs to be judged
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 判断是否是数值
         * @param value 需要判断的参数
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static isNumber(value: any): boolean;
        /**
         * @language en_US
         * Obtain the approximate sin value of the corresponding angle value
         * @param value {number} Angle value
         * @returns {number} sin value
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         * @version Egret 2.4
         * @platform Web,Native
         */
        static sin(value: number): number;
        /**
         * @private
         *
         * @param value
         * @returns
         */
        private static sinInt(value);
        /**
         * @language en_US
         * Obtain the approximate cos value of the corresponding angle value
         * @param value {number} Angle value
         * @returns {number} cos value
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         * @version Egret 2.4
         * @platform Web,Native
         */
        static cos(value: number): number;
        /**
         * @private
         *
         * @param value
         * @returns
         */
        private static cosInt(value);
    }
}
/**
 * @private
 */
declare let egret_sin_map: {};
/**
 * @private
 */
declare let egret_cos_map: {};
/**
 * @private
 */
declare let DEG_TO_RAD: number;
declare namespace egret {
    /**
     * @language en_US
     * The Timer class is the interface to timers, which let you run code on a specified time sequence. Use the start()
     * method to start a timer. Add an event listener for the timer event to set up code to be run on the timer interval.<br/>
     * You can create Timer objects to run once or repeat at specified intervals to execute code on a schedule. Depending
     * on the framerate or the runtime environment (available memory and other factors), the runtime may dispatchEvent events at
     * slightly offset intervals.
     * @see egret.TimerEvent
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/Timer.ts
     */
    /**
     * @language zh_CN
     * Timer 类是计时器的接口，它使您能按指定的时间序列运行代码。
     * 使用 start() 方法来启动计时器。为 timer 事件添加事件侦听器，以便将代码设置为按计时器间隔运行。
     * 可以创建 Timer 对象以运行一次或按指定间隔重复运行，从而按计划执行代码。
     * 根据 Egret 的帧速率或运行时环境（可用内存和其他因素），运行时调度事件的间隔可能稍有不同。
     * @see egret.TimerEvent
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/Timer.ts
     */
    class Timer extends EventDispatcher {
        /**
         * @language en_US
         * Constructs a new Timer object with the specified delay and repeatCount states.
         * @param delay The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended.
         * Timer frequency is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
         * @param repeatCount Specifies the number of repetitions. If zero, the timer repeats indefinitely.If nonzero,
         * the timer runs the specified number of times and then stops.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的 delay 和 repeatCount 状态构造新的 Timer 对象。
         * @param delay 计时器事件间的延迟（以毫秒为单位）。建议 delay 不要低于 20 毫秒。计时器频率不得超过 60 帧/秒，这意味着低于 16.6 毫秒的延迟可导致出现运行时问题。
         * @param repeatCount 指定重复次数。如果为零，则计时器将持续不断重复运行。如果不为 0，则将运行计时器，运行次数为指定的次数，然后停止。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(delay: number, repeatCount?: number);
        /**
         * @private
         */
        private _delay;
        /**
         * @language en_US
         * The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended.<br/>
         * Note: Timer frequency is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 计时器事件间的延迟（以毫秒为单位）。如果在计时器正在运行时设置延迟间隔，则计时器将按相同的 repeatCount 迭代重新启动。<br/>
         * 注意：建议 delay 不要低于 20 毫秒。计时器频率不得超过 60 帧/秒，这意味着低于 16.6 毫秒的延迟可导致出现运行时问题。
         * @version Egret 2.4
         * @platform Web,Native
         */
        delay: number;
        /**
         * @language en_US
         * The total number of times the timer is set to run. If the repeat count is set to 0, the timer continues indefinitely,
         * until the stop() method is invoked or the program stops. If the repeat count is nonzero, the timer runs the specified
         * number of times. If repeatCount is set to a total that is the same or less then currentCount the timer stops and will not fire again.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置的计时器运行总次数。如果重复计数设置为 0，则计时器将持续不断运行，或直至调用了 stop() 方法或节目停止。
         * 如果重复计数不为 0，则将运行计时器，运行次数为指定的次数。如果设置的 repeatCount 总数等于或小于 currentCount，则计时器将停止并且不会再次触发。
         * @version Egret 2.4
         * @platform Web,Native
         */
        repeatCount: number;
        /**
         * @private
         */
        private _currentCount;
        /**
         * @language en_US
         * The total number of times the timer has fired since it started at zero. If the timer has been reset, only the fires since the reset are counted.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 计时器从 0 开始后触发的总次数。如果已重置了计时器，则只会计入重置后的触发次数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        currentCount: number;
        /**
         * @private
         */
        private _running;
        /**
         * @language en_US
         * The timer's current state; true if the timer is running, otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 计时器的当前状态；如果计时器正在运行，则为 true，否则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        running: boolean;
        /**
         * @language en_US
         * Stops the timer, if it is running, and sets the currentCount property back to 0, like the reset button of a stopwatch.
         * Then, when start() is called, the timer instance runs for the specified number of repetitions, as set by the repeatCount value.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果计时器正在运行，则停止计时器，并将 currentCount 属性设回为 0，这类似于秒表的重置按钮。然后，在调用 start() 后，将运行计时器实例，运行次数为指定的重复次数（由 repeatCount 值设置）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        reset(): void;
        /**
         * @language en_US
         * Starts the timer, if it is not already running.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果计时器尚未运行，则启动计时器。
         * @version Egret 2.4
         * @platform Web,Native
         */
        start(): void;
        /**
         * @language en_US
         * Stops the timer. When start() is called after stop(), the timer instance runs for the remaining number of
         * repetitions, as set by the repeatCount property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 停止计时器。如果在调用 stop() 后调用 start()，则将继续运行计时器实例，运行次数为剩余的 重复次数（由 repeatCount 属性设置）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        stop(): void;
        /**
         * @private
         */
        private updateInterval;
        /**
         * @private
         */
        private lastCount;
        /**
         * @private
         */
        private lastTimeStamp;
        /**
         * @private
         * Ticker以60FPS频率刷新此方法
         */
        $update(timeStamp: number): boolean;
    }
}
declare namespace egret {
    /**
     * @language en_US
     * The XMLNode class is the base class for all xml node.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * XML节点基类
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface XMLNode {
        /**
         * @language en_US
         * a integer representing the type of the node, 1：XML，2：XMLAttribute，3：XMLText
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点类型，1：XML，2：XMLAttribute，3：XMLText
         * @version Egret 2.4
         * @platform Web,Native
         */
        nodeType: number;
        /**
         * @language en_US
         * the parent node of this xml node.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点所属的父级节点
         * @version Egret 2.4
         * @platform Web,Native
         */
        parent: XML;
    }
    /**
     * @language en_US
     * The XML class contains properties for working with XML objects.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/XML.ts
     */
    /**
     * @language zh_CN
     * XML 类包含用于处理 XML 对象的属性。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/XML.ts
     */
    interface XML extends XMLNode {
        /**
         * @language en_US
         * the attributes of this xml node.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前节点上的属性列表
         * @version Egret 2.4
         * @platform Web,Native
         */
        attributes: any;
        /**
         * @language en_US
         * the children of the xml node.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前节点的子节点列表
         * @version Egret 2.4
         * @platform Web,Native
         */
        children: XMLNode[];
        /**
         * @language en_US
         * the full name of this xml node. For example,the name of <s:Button/> is "s:Button".
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点完整名称。例如节点 <s:Button/> 的 name 为："s:Button"
         * @version Egret 2.4
         * @platform Web,Native
         */
        name: string;
        /**
         * @language en_US
         * thie namesapce prefix of this xml node.For example,the prefix of <s:Button/> is "s".
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点的命名空间前缀。例如节点 <s:Button/> 的 prefix 为：s
         * @version Egret 2.4
         * @platform Web,Native
         */
        prefix: string;
        /**
         * @language en_US
         * the local name of this xml node. For example,the local name of <s:Button/> is "Button".
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点的本地名称。例如节点 <s:Button/> 的 localName 为：Button
         * @version Egret 2.4
         * @platform Web,Native
         */
        localName: string;
        /**
         * @language en_US
         * the namesapce uri of this xml node.For example,the namespace uri of <s:Skin xmlns:s="http://ns.egret.com/eui"/> is "http://ns.egret.com/eui".
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 节点的命名空间地址。例如节点 <s:Skin xmlns:s="http://ns.egret.com/eui"/> 的 namespace 为： http://ns.egret.com/eui
         * @version Egret 2.4
         * @platform Web,Native
         */
        namespace: string;
    }
    /**
     * @language en_US
     * The XMLText class represents a string node in the XML.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * XMLText 类表示在XML中的文本节点
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface XMLText extends XMLNode {
        /**
         * @language en_US
         * the text content
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本内容
         * @version Egret 2.4
         * @platform Web,Native
         */
        text: string;
    }
    /**
     * @language en_US
     * The XML class contains properties for working with XML objects.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * XML 类包含用于处理 XML 对象的属性。
     * @version Egret 2.4
     * @platform Web,Native
     */
    let XML: {
        /**
         * @language en_US
         * parses a text to XML instance.
         * @param text the text to be parsed.
         */
        /**
         * @language zh_CN
         * 解析字符串为XML对象
         * @param text 要解析的XML对象。
         */
        parse(text: string): XML;
    };
}
declare namespace egret {
    /**
     * @private
     */
    let $callLaterFunctionList: any[];
    /**
     * @private
     */
    let $callLaterThisList: any[];
    /**
     * @private
     */
    let $callLaterArgsList: any[];
    /**
     * @language en_US
     * Delay the function to run unless screen is redrawn.
     * @param method {Function} The function to be delayed to run
     * @param thisObject {any} this reference of callback function
     * @param ...args {any} Function parameter list
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/callLater.ts
     */
    /**
     * @language zh_CN
     * 延迟函数到屏幕重绘前执行。
     * @param method {Function} 要延迟执行的函数
     * @param thisObject {any} 回调函数的this引用
     * @param ...args {any} 函数参数列表
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/callLater.ts
     */
    function callLater(method: Function, thisObject: any, ...args: any[]): void;
    /**
     * @private
     */
    let $callAsyncFunctionList: any[];
    /**
     * @private
     */
    let $callAsyncThisList: any[];
    /**
     * @private
     */
    let $callAsyncArgsList: any[];
    /**
     * 异步调用函数
     * @param method {Function} 要异步调用的函数
     * @param thisObject {any} 函数的this引用
     * @param ...args {any} 函数参数列表
     * @private
     */
    function $callAsync(method: Function, thisObject: any, ...args: any[]): void;
}
declare namespace egret {
    /**
     * @language en_US
     * Call setter properties of the parent class, instead of the other writing languages, such as super.alpha = 1;
     * @param currentClass The current class class name, non-string
     * @param thisObj The current object. Always this
     * @param type Setter property names need to call
     * @param values Value passed to the parent class
     *
     * @exmaple egret.superSetter(egret.Sprite, this, "alpha", 1);
     */
    /**
     * @language zh_CN
     * 调用父类的setter属性，代替其他语言的写法，如 super.alpha = 1;
     * @param thisObj 当前对象。永远都this
     * @param currentClass 当前 class 类名，非字符串
     * @param type 需要调用的setter属性名称
     * @param values 传给父类的值
     *
     * @exmaple egret.superSetter(egret.Sprite, this, "alpha", 1);
     */
    function superSetter(currentClass: any, thisObj: any, type: string, ...values: any[]): any;
    /**
     * @language en_US
     * Get getter property value of the parent class. Instead of writing in other languages, such as super.alpha;
     * @param currentClass The current class class name, non-string
     * @param thisObj The current object. Always this
     * @param type Setter property names need to call
     * @returns {any} The value returned by the parent
     *
     * @exmaple egret.superGetter(egret.Sprite, this, "alpha");
     */
    /**
     * @language zh_CN
     * 获取父类的getter属性值。代替其他语言的写法，如 super.alpha;
     * @param thisObj 当前对象。永远都this
     * @param currentClass 当前 class 类名，非字符串
     * @param type 需要调用的setter属性名称
     * @returns {any} 父类返回的值
     *
     * @exmaple egret.superGetter(egret.Sprite, this, "alpha");
     */
    function superGetter(currentClass: any, thisObj: any, type: string): any;
}
declare namespace egret {
    /**
     * @language en_US
     * Returns a reference to the class object of the class specified by the name parameter.
     * @param name The name of a class.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getDefinitionByName.ts
     */
    /**
     * @language zh_CN
     * 返回 name 参数指定的类的类对象引用。
     * @param name 类的名称。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getDefinitionByName.ts
     */
    function getDefinitionByName(name: string): any;
}
declare let __global: any;
declare namespace egret {
    /**
     * @language en_US
     * Get browser or Runtime parameters, returns an empty string if not set
     * Get the url parameter corresponds to the browser, access to the corresponding parameter in the Runtime setOption
     * @method egret.getOption
     * @param key {string} Parameters key
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 获取浏览器或者Runtime参数，如果没有设置返回空字符串
     * 在浏览器中相当于获取url中参数，在Runtime获取对应setOption参数
     * @method egret.getOption
     * @param key {string} 参数key
     * @version Egret 2.4
     * @platform Web,Native
     */
    let getOption: (key: string) => string;
}
declare namespace egret {
    /**
     * @language en_US
     * Return the fully qualified class name of an object
     * @param value The object for which a fully qualified class name is desired. Any JavaScript value may be passed to
     * this method including all available JavaScript types, object instances, primitive types such as number, and class objects.
     * @returns A string containing the fully qualified class name.
     * @example
     * <pre>
     *  egret.getQualifiedClassName(egret.DisplayObject) //return "egret.DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getQualifiedClassName.ts
     */
    /**
     * @language zh_CN
     * 返回对象的完全限定类名。
     * @param value 需要完全限定类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型
     * （如number)和类对象
     * @returns 包含完全限定类名称的字符串。
     * @example
     * <pre>
     *  egret.getQualifiedClassName(egret.DisplayObject) //返回 "egret.DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getQualifiedClassName.ts
     */
    function getQualifiedClassName(value: any): string;
}
declare namespace egret {
    /** @language en_US
     * Returns the fully qualified class name of the base class of the object specified by the value parameter.
     * @param value The object for which a parent class is desired. Any JavaScript value may be passed to this method including
     * all available JavaScript types, object instances, primitive types such as number, and class objects.
     * @returns  A fully qualified base class name, or null if none exists.
     * @example
     * <pre>
     *  egret.getQualifiedSuperclassName(egret.Bitmap) //return "egret.DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getQualifiedSuperclassName.ts
     */
    /**
     * @language zh_CN
     * 返回 value 参数指定的对象的基类的完全限定类名。
     * @param value 需要取得父类的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型（如number）和类对象
     * @returns 完全限定的基类名称，或 null（如果不存在基类名称）。
     * @example
     * <pre>
     *  egret.getQualifiedSuperclassName(egret.Sprite) //返回 "egret.DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getQualifiedSuperclassName.ts
     */
    function getQualifiedSuperclassName(value: any): string;
}
declare namespace egret {
    /**
     * @language en_US
     * Used to compute relative time.this method returns the number of milliseconds since the Egret framework was initialized
     * @returns The number of milliseconds since the Egret framework was initialized
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getTimer.ts
     */
    /**
     * @language zh_CN
     * 用于计算相对时间。此方法返回自启动 Egret 框架以来经过的毫秒数。
     * @returns 启动 Egret 框架以来经过的毫秒数。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getTimer.ts
     */
    function getTimer(): number;
}
declare namespace egret {
    /**
     * @language en_US
     * Check whether a public definition exists in the specified application domain. The definition can be that of a class, a naming space or a function.
     * @param name {string} Name of the definition.
     * @returns {boolean} Whether the public definition exists
     * @example
     * egret.hasDefinition("egret.DisplayObject") //return true
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/hasDefinition.ts
     */
    /**
     * @language zh_CN
     * 检查指定的应用程序域之内是否存在一个公共定义。该定义可以是一个类、一个命名空间或一个函数的定义。
     * @param name {string} 定义的名称。
     * @returns {boolean} 公共定义是否存在
     * @example
     * egret.hasDefinition("egret.DisplayObject") //返回 true
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/hasDefinition.ts
     */
    function hasDefinition(name: string): boolean;
}
declare namespace egret {
    /**
     * @language en_US
     * Indicates whether an object is a instance of the class or interface specified as the parameter.This method has better performance
     * compared width the instanceOf operator,and it can indicate whether an object is a instance of the specific interface.
     * @param instance the instance to be checked.
     * @param typeName the string value representing a specific class or interface.
     * @returns A value of true if the object is a instance of the class or interface specified as the parameter.
     * @example
     * <pre>
     *     let instance = new egret.Sprite();
     *     egret.log(egret.is(instance,"egret.Sprite"))  //true
     *     egret.log(egret.is(instance,"egret.DisplayObjectContainer"))  //true
     *     egret.log(egret.is(instance,"egret.Bitmap"))  //false
     * </pre>
     * @see egret.registerClass()
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 检查指定对象是否为 Egret 框架内指定接口或类或其子类的实例。此方法与使用 instanceOf 关键字相比具有更高的性能，并且能判断接口的实现。
     * @param instance 要判断的实例。
     * @param typeName 类或接口的完全名称.
     * @returns 返回true表示当前对象是指定类或接口的实例。
     * @example
     * <pre>
     *     let instance = new egret.Sprite();
     *     egret.log(egret.is(instance,"egret.Sprite"))  //true
     *     egret.log(egret.is(instance,"egret.DisplayObjectContainer"))  //true
     *     egret.log(egret.is(instance,"egret.Bitmap"))  //false
     * </pre>
     * @see egret.registerClass()
     * @version Egret 2.4
     * @platform Web,Native
     */
    function is(instance: any, typeName: string): boolean;
}
declare namespace egret {
    /**
     * @language en_US
     * Register and start a timer,which will notify the callback method at a rate of 60 FPS ,and pass the current time stamp as parameters.<br/>
     * Note: After the registration,it will notify the callback method continuously,you can call the stopTick () method to stop it.
     * @param callBack the call back method. the timeStamp parameter of this method represents the number of milliseconds
     * since the Egret framework was initialized. If the return value of this method is true, it will force Egret runtime
     * to render after processing of this method completes.
     * @param thisObject the call back method's "this"
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 注册并启动一个计时器，通常会以60FPS的速率触发回调方法，并传入当前时间戳。注意：注册后将会持续触发回调方法，若要停止回调，需要手动调用stopTick()方法。
     * @param callBack 要执行的回调方法。参数 timeStamp 表示从启动Egret框架开始经过的时间(毫秒)。
     * 若回调方法返回值为true，其作用与TimerEvent.updateAfterEvent()类似，将会忽略帧频限制，在此方法处理完成后立即重绘屏幕。
     * @param thisObject 回调方法的this对象引用。
     * @version Egret 2.4
     * @platform Web,Native
     */
    function startTick(callBack: (timeStamp: number) => boolean, thisObject: any): void;
}
declare namespace egret {
    /**
     * @language en_US
     * Stops the timer started by the egret.startTick() method.
     * @param callBack the call back method. the timeStamp parameter of this method represents the number of milliseconds
     * since the Egret framework was initialized. If the return value of this method is true, it will force Egret runtime
     * to render after processing of this method completes.
     * @param thisObject the call back method's "this"
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 停止之前用 startTick() 方法启动的计时器。
     * @param callBack 要执行的回调方法。参数 timeStamp 表示从启动Egret框架开始经过的时间(毫秒)。
     * 若回调方法返回值为true，其作用与TimerEvent.updateAfterEvent()类似，将会忽略帧频限制，在此方法处理完成后立即重绘屏幕。
     * @param thisObject 回调方法的this对象引用。
     * @version Egret 2.4
     * @platform Web,Native
     */
    function stopTick(callBack: (timeStamp: number) => boolean, thisObject: any): void;
}
declare namespace egret {
    /**
     * @language en_US
     * Transfer number to color character string
     * @param value {number} color value ,such as 0xffffff
     * @returns {string} Color character string, for example, #ffffff.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/toColorString.ts
     */
    /**
     * @language zh_CN
     * 转换数字为颜色字符串
     * @param value {number} 颜色值，例如 0xffffff
     * @returns {string} 颜色字符串，例如"#ffffff"。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/toColorString.ts
     */
    function toColorString(value: number): string;
}
declare namespace egret {
    /**
     * @private
     */
    class WebGLUtils {
        static compileProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram;
        static compileFragmentShader(gl: WebGLRenderingContext, shaderSrc: string): WebGLShader;
        static compileVertexShader(gl: WebGLRenderingContext, shaderSrc: string): WebGLShader;
        private static _compileShader(gl, shaderSrc, shaderType);
        private static canUseWebGL;
        static checkCanUseWebGL(): boolean;
        static deleteWebGLTexture(bitmapData: any): void;
    }
}
