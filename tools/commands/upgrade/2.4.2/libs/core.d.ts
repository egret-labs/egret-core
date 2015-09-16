declare var __extends: any;
declare module egret {
    function superSetter(thisObj: any, type: string, ...values: any[]): any;
    function superGetter(thisObj: any, type: string): any;
}
declare module egret {
    class Logger {
        static ALL: string;
        static DEBUG: string;
        static INFO: string;
        static WARN: string;
        static ERROR: string;
        static OFF: string;
        private static logFuncs;
        static openLogByType(logType: string): void;
        static fatal(actionCode: string, value?: Object): void;
        static info(actionCode: string, value?: Object): void;
        static warning(actionCode: string, value?: Object): void;
        private static traceToConsole(type, actionCode, value);
        private static getTraceCode(type, actionCode, value);
    }
    function getString(id: number, ...args: any[]): string;
    function $error(code: number, ...args: any[]): void;
    function $warn(code: number, ...args: any[]): void;
}
declare module egret {
    interface IHashObject {
        hashCode: number;
    }
}
declare module egret {
    class HashObject implements IHashObject {
        constructor();
        private static hashCount;
        private _hashCode;
        hashCode: number;
    }
}
declare module egret {
    class Recycler extends HashObject {
        constructor(autoDisposeTime?: number);
        static _callBackList: Array<any>;
        private autoDisposeTime;
        private frameCount;
        _checkFrame(): void;
        private objectPool;
        private _length;
        length: number;
        push(object: any): void;
        pop(): any;
        dispose(): void;
    }
}
declare module egret {
    var __START_TIME: number;
    function getTimer(): number;
}
declare module egret {
    var __callLaterFunctionList: Array<any>;
    var __callLaterThisList: Array<any>;
    var __callLaterArgsList: Array<any>;
    function callLater(method: Function, thisObject: any, ...args: any[]): void;
    var __callAsyncFunctionList: Array<any>;
    var __callAsyncThisList: Array<any>;
    var __callAsyncArgsList: Array<any>;
    function __callAsync(method: Function, thisObject: any, ...args: any[]): void;
}
declare module egret {
    class RenderCommand {
        static __freeList: Array<RenderCommand>;
        callback: any;
        thisObject: any;
        call(renderContext: RendererContext): void;
        dispose(): void;
        static push(callback: Function, thisObject: any): void;
    }
}
declare module egret {
    interface RenderContext {
        lineWidth: number;
        strokeStyle: any;
        fillStyle: any;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        lineTo(x: number, y: number): void;
        fill(fillRule?: string): void;
        closePath(): void;
        rect(x: number, y: number, w: number, h: number): void;
        moveTo(x: number, y: number): void;
        fillRect(x: number, y: number, w: number, h: number): void;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        stroke(): void;
        strokeRect(x: number, y: number, w: number, h: number): void;
        beginPath(): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        translate(x: number, y: number): void;
        scale(x: number, y: number): void;
        rotate(angle: number): void;
        restore(): void;
        save(): void;
    }
}
declare module egret {
    class Event extends HashObject {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        static ADDED_TO_STAGE: string;
        static REMOVED_FROM_STAGE: string;
        static ADDED: string;
        static REMOVED: string;
        static COMPLETE: string;
        static LOOP_COMPLETE: string;
        static ENTER_FRAME: string;
        static RENDER: string;
        static FINISH_RENDER: string;
        static FINISH_UPDATE_TRANSFORM: string;
        static LEAVE_STAGE: string;
        static RESIZE: string;
        static CHANGE: string;
        static ACTIVATE: string;
        static DEACTIVATE: string;
        static CLOSE: string;
        static CONNECT: string;
        data: any;
        _type: string;
        type: string;
        _bubbles: boolean;
        bubbles: boolean;
        private _cancelable;
        cancelable: boolean;
        _eventPhase: number;
        eventPhase: number;
        _currentTarget: any;
        currentTarget: any;
        _target: any;
        target: any;
        _isDefaultPrevented: boolean;
        isDefaultPrevented(): boolean;
        preventDefault(): void;
        _isPropagationStopped: boolean;
        stopPropagation(): void;
        _isPropagationImmediateStopped: boolean;
        stopImmediatePropagation(): void;
        private isNew;
        _reset(): void;
        __recycle(): void;
        static _dispatchByTarget(EventClass: any, target: IEventDispatcher, type: string, props?: Object, bubbles?: boolean, cancelable?: boolean): boolean;
        static _getPropertyData(EventClass: any): any;
        static dispatchEvent(target: IEventDispatcher, type: string, bubbles?: boolean, data?: any): void;
    }
}
declare module egret {
    class HTTPStatusEvent extends Event {
        static HTTP_STATUS: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        private _status;
        status: number;
        private static httpStatusEvent;
        static dispatchHTTPStatusEvent(target: IEventDispatcher, status: number): void;
    }
}
declare module egret {
    class SoundEvent extends egret.Event {
        static SOUND_COMPLETE: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    }
}
declare module egret {
    class FocusEvent extends egret.Event {
        static FOCUS_IN: string;
        static FOCUS_OUT: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    }
}
declare module egret {
    class IOErrorEvent extends Event {
        static IO_ERROR: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        static dispatchIOErrorEvent(target: IEventDispatcher): void;
    }
}
declare module egret {
    class TouchEvent extends Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, touchPointID?: number, stageX?: number, stageY?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, touchDown?: boolean);
        static TOUCH_TAP: string;
        static TOUCH_MOVE: string;
        static TOUCH_BEGIN: string;
        static TOUCH_END: string;
        static TOUCH_RELEASE_OUTSIDE: string;
        static TOUCH_ROLL_OUT: string;
        static TOUCH_ROLL_OVER: string;
        static TOUCH_OUT: string;
        static TOUCH_OVER: string;
        _stageX: number;
        stageX: number;
        _stageY: number;
        stageY: number;
        localX: number;
        localY: number;
        touchPointID: number;
        ctrlKey: boolean;
        shiftKey: boolean;
        altKey: boolean;
        touchDown: boolean;
        static dispatchTouchEvent(target: IEventDispatcher, type: string, touchPointID?: number, stageX?: number, stageY?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, touchDown?: boolean): void;
    }
}
declare module egret {
    class TimerEvent extends Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        static TIMER: string;
        static TIMER_COMPLETE: string;
        static dispatchTimerEvent(target: IEventDispatcher, type: string): void;
    }
}
declare module egret {
    class TextEvent extends Event {
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string);
        static LINK: string;
        text: string;
        static dispatchTextEvent(target: IEventDispatcher, type: string, text: string): void;
    }
}
declare module egret {
    class ProgressEvent extends egret.Event {
        static PROGRESS: string;
        static SOCKET_DATA: string;
        bytesLoaded: number;
        bytesTotal: number;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, bytesLoaded?: number, bytesTotal?: number);
        static dispatchProgressEvent(target: IEventDispatcher, type: string, bytesLoaded?: number, bytesTotal?: number): void;
    }
}
declare module egret {
    class EventPhase {
        static CAPTURING_PHASE: number;
        static AT_TARGET: number;
        static BUBBLING_PHASE: number;
    }
}
declare module egret {
    interface IEventDispatcher extends IHashObject {
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        hasEventListener(type: string): boolean;
        dispatchEvent(event: Event): boolean;
        willTrigger(type: string): boolean;
    }
}
declare module egret {
    class EventDispatcher extends HashObject implements IEventDispatcher {
        constructor(target?: IEventDispatcher);
        private _eventTarget;
        _eventsMap: Object;
        _captureEventsMap: Object;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        _insertEventBin(list: Array<any>, listener: Function, thisObject: any, priority: number, display?: any): boolean;
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        _removeEventBin(list: Array<any>, listener: Function, thisObject: any, display?: any, fromIdx?: number): boolean;
        hasEventListener(type: string): boolean;
        willTrigger(type: string): boolean;
        dispatchEvent(event: Event): boolean;
        _notifyListener(event: Event): boolean;
        dispatchEventWith(type: string, bubbles?: boolean, data?: Object): void;
    }
}
declare module egret {
    class MainContext extends EventDispatcher {
        constructor();
        rendererContext: RendererContext;
        touchContext: TouchContext;
        netContext: NetContext;
        deviceContext: DeviceContext;
        stage: Stage;
        static deviceType: string;
        static DEVICE_PC: string;
        static DEVICE_MOBILE: string;
        static runtimeType: string;
        static RUNTIME_HTML5: string;
        static RUNTIME_NATIVE: string;
        private _profileInstance;
        run(): void;
        static __DRAW_COMMAND_LIST: Array<RenderCommand>;
        static __use_new_draw: boolean;
        static _renderLoopPhase: string;
        private renderLoop(frameTime);
        private _draw(context);
        private reuseEvent;
        private broadcastEnterFrame(frameTime);
        private broadcastRender();
        private doCallLaterList(funcList, thisList, argsList);
        private doCallAsyncList();
        static instance: egret.MainContext;
        private static cachedEvent;
    }
}
declare var testDeviceType: () => boolean;
declare var testRuntimeType: () => boolean;
declare module egret {
    class Profiler {
        private static instance;
        static getInstance(): Profiler;
        private _lastTime;
        private _logicPerformanceCost;
        private _renderPerformanceCost;
        private _updateTransformPerformanceCost;
        private _preDrawCount;
        private _calculatePreDrawCount;
        private _txt;
        private _tick;
        private _maxDeltaTime;
        private _totalDeltaTime;
        _isRunning: boolean;
        stop(): void;
        run(): void;
        _drawProfiler(context: RendererContext): void;
        _setTxtFontSize(fontSize: number): void;
        private onEnterFrame(event);
        private onStartRender(event);
        private onFinishUpdateTransform(event);
        private onFinishRender(event);
        private update(frameTime);
        onDrawImage(): void;
    }
}
declare module egret {
    class Ticker extends EventDispatcher {
        constructor();
        private _timeScale;
        private _paused;
        run(): void;
        private _callIndex;
        private _callList;
        private update(advancedTime);
        private callBackList;
        register(listener: Function, thisObject: any, priority?: number): void;
        unregister(listener: Function, thisObject: any): void;
        setTimeout(listener: Function, thisObject: any, delay: number, ...parameters: any[]): void;
        setTimeScale(timeScale: number): void;
        getTimeScale(): number;
        pause(): void;
        resume(): void;
        private static instance;
        static getInstance(): egret.Ticker;
    }
}
declare module egret {
    class HorizontalAlign {
        static LEFT: string;
        static RIGHT: string;
        static CENTER: string;
        static JUSTIFY: string;
        static CONTENT_JUSTIFY: string;
    }
}
declare module egret {
    class VerticalAlign {
        static TOP: string;
        static BOTTOM: string;
        static MIDDLE: string;
        static JUSTIFY: string;
        static CONTENT_JUSTIFY: string;
    }
}
declare module egret {
    class Timer extends EventDispatcher {
        constructor(delay: number, repeatCount?: number);
        delay: number;
        repeatCount: number;
        private _currentCount;
        currentCount: number;
        private _running;
        running: boolean;
        reset(): void;
        start(): void;
        stop(): void;
        private lastTime;
        private onEnterFrame(frameTime);
    }
}
declare module egret {
    function getQualifiedClassName(value: any): string;
    function getQualifiedSuperclassName(value: any): string;
}
declare module egret {
    function getDefinitionByName(name: string): any;
}
declare var __global: any;
declare module egret {
    function setTimeout(listener: Function, thisObject: any, delay: number, ...args: any[]): number;
    function clearTimeout(key: number): void;
}
declare module egret {
    function setInterval(listener: Function, thisObject: any, delay: number, ...args: any[]): number;
    function clearInterval(key: number): void;
}
declare module egret {
    function hasDefinition(name: string): boolean;
}
declare module egret {
    function toColorString(value: number): string;
}
declare module egret {
    class Matrix extends HashObject {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        static identity: Matrix;
        static DEG_TO_RAD: number;
        prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        prependTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, regX: number, regY: number): Matrix;
        appendTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, regX: number, regY: number): Matrix;
        rotate(angle: number): Matrix;
        skew(skewX: number, skewY: number): Matrix;
        scale(x: number, y: number): Matrix;
        translate(x: number, y: number): Matrix;
        identity(): Matrix;
        identityMatrix(matrix: Matrix): Matrix;
        invert(): Matrix;
        static transformCoords(matrix: Matrix, x: number, y: number): Point;
        private array;
        toArray(transpose: any): any;
        setTo(aa: number, ba: number, ca: number, da: number, txa: number, tya: number): void;
        copyFrom(sourceMatrix: Matrix): void;
        clone(): Matrix;
        concat(m: Matrix): void;
        deltaTransformPoint(point: egret.Point): egret.Point;
        transformPoint(point: egret.Point): egret.Point;
        toString(): string;
        createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
    }
}
declare module egret {
    class Point extends HashObject {
        static identity: Point;
        constructor(x?: number, y?: number);
        x: number;
        y: number;
        clone(): Point;
        equals(toCompare: Point): boolean;
        static distance(p1: egret.Point, p2: egret.Point): number;
        setTo(xa: number, ya: number): void;
        copyFrom(sourcePoint: Point): void;
        length: number;
        add(v: Point): Point;
        static interpolate(pt1: Point, pt2: Point, f: number): Point;
        normalize(thickness: number): void;
        offset(dx: number, dy: number): void;
        static polar(len: number, angle: number): Point;
        subtract(v: Point): Point;
        toString(): string;
    }
}
declare module egret {
    class Rectangle extends HashObject {
        constructor(x?: number, y?: number, width?: number, height?: number);
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        topLeft: Point;
        bottomRight: Point;
        initialize(x: number, y: number, width: number, height: number): Rectangle;
        contains(x: number, y: number): boolean;
        intersects(toIntersect: Rectangle): boolean;
        setEmpty(): void;
        clone(): Rectangle;
        static identity: Rectangle;
        containsPoint(point: Point): boolean;
        setTo(xa: number, ya: number, widtha: number, heighta: number): void;
        copyFrom(sourceRect: Rectangle): void;
        inflate(dx: number, dy: number): void;
        isEmpty(): boolean;
        containsRect(rect: egret.Rectangle): boolean;
        equals(toCompare: Rectangle): boolean;
        inflatePoint(point: Point): void;
        intersection(toIntersect: Rectangle): Rectangle;
        offset(dx: number, dy: number): void;
        offsetPoint(point: Point): void;
        toString(): string;
        union(toUnion: Rectangle): Rectangle;
    }
}
declare module egret {
    class ColorTransform extends HashObject {
        constructor(redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaMultiplier?: number, redOffset?: number, greenOffset?: number, blueOffset?: number, alphaOffset?: number);
        _alphaMultiplier: number;
        alphaMultiplier: number;
        _alphaOffset: number;
        alphaOffset: number;
        _blueMultiplier: number;
        blueMultiplier: number;
        _blueOffset: number;
        blueOffset: number;
        _greenMultiplier: number;
        greenMultiplier: number;
        _greenOffset: number;
        greenOffset: number;
        _redMultiplier: number;
        redMultiplier: number;
        _redOffset: number;
        redOffset: number;
        color: number;
        identityColorTransform(colorTransform: ColorTransform): void;
        concat(second: egret.ColorTransform): void;
        toString(): string;
    }
}
declare module egret {
    class Transform extends HashObject {
        private _display;
        constructor(display: DisplayObject);
        private _matrix;
        private _matrix2;
        matrix: Matrix;
        private _setMatrix(value);
        _colorTransform: ColorTransform;
        private _colorTransform2;
        colorTransform: ColorTransform;
        private _setColorTransform(value);
    }
}
declare module egret {
    class SAXParser extends HashObject {
        static _instance: SAXParser;
        static getInstance(): SAXParser;
        private _parser;
        private _xmlDict;
        private _isSupportDOMParser;
        constructor();
        parserXML(textxml: string): any;
    }
}
declare module egret {
    class StageDelegate extends HashObject {
        private static instance;
        static getInstance(): StageDelegate;
        static canvas_name: string;
        static egret_root_div: string;
        static canvas_div_name: string;
        private _designWidth;
        private _designHeight;
        _scaleX: number;
        _scaleY: number;
        _offSetY: number;
        private _resolutionPolicy;
        _stageWidth: number;
        _stageHeight: number;
        constructor();
        setDesignSize(width: number, height: number): void;
        _setResolutionPolicy(resolutionPolicy: ResolutionPolicy): void;
        getScaleX(): number;
        getScaleY(): number;
        getOffSetY(): number;
    }
    class ResolutionPolicy {
        private _containerStrategy;
        private _contentStrategy;
        constructor(containerStg: any, contentStg: any);
        init(view: StageDelegate): void;
        _apply(view: any, designedResolutionWidth: any, designedResolutionHeight: any): void;
    }
    class ContainerStrategy {
        static EQUAL_TO_FRAME: any;
        static initialize(): void;
        init(view: any): void;
        _apply(view: any, designedWidth: any, designedHeight: any): void;
        _setupContainer(): void;
    }
    class EqualToFrame extends ContainerStrategy {
        _apply(view: any): void;
    }
    class ContentStrategy {
        init(view: any): void;
        _apply(delegate: egret.StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
        setEgretSize(w: number, h: number, styleW: number, styleH: number, left?: number, top?: number): void;
        _getClientWidth(): number;
        _getClientHeight(): number;
    }
    class FixedHeight extends ContentStrategy {
        private minWidth;
        constructor(minWidth?: number);
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
    class FixedWidth extends ContentStrategy {
        private minHeight;
        constructor(minHeight?: number);
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
    class FixedSize extends ContentStrategy {
        private width;
        private height;
        constructor(width: any, height: any);
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
    class NoScale extends ContentStrategy {
        constructor();
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
    class ShowAll extends ContentStrategy {
        constructor();
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
    class FullScreen extends ContentStrategy {
        constructor();
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
}
declare module egret {
    class RenderFilter extends HashObject {
        constructor();
        private static instance;
        static getInstance(): RenderFilter;
        _drawAreaList: Array<Rectangle>;
        private _defaultDrawAreaList;
        private _originalData;
        addDrawArea(area: egret.Rectangle): void;
        clearDrawArea(): void;
        private static identityRectangle;
        drawImage(renderContext: RendererContext, data: RenderData, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, repeat?: any): void;
        private ignoreRender(data, rect, destX, destY);
        getDrawAreaList(): Array<Rectangle>;
        private onResize();
    }
    interface RenderData {
        _worldTransform: egret.Matrix;
        _worldBounds: egret.Rectangle;
        _texture_to_render: egret.Texture;
        _getSize(resultRect: Rectangle): egret.Rectangle;
    }
}
declare module egret {
    class Injector {
        private static mapClassDic;
        static mapClass(whenAskedFor: any, instantiateClass: any, named?: string): void;
        private static getKey(hostComponentKey);
        private static mapValueDic;
        static mapValue(whenAskedFor: any, useValue: any, named?: string): void;
        static hasMapRule(whenAskedFor: any, named?: string): boolean;
        static getInstance(clazz: any, named?: string): any;
    }
}
declare module egret {
    const enum BitmapFilterQuality {
        LOW = 1,
        MEDIUM = 2,
        HIGH = 3,
    }
}
declare module egret {
    class Filter extends HashObject {
        type: string;
    }
}
declare module egret {
    class BlurFilter extends Filter {
        blurX: number;
        blurY: number;
        constructor(blurX: number, blurY: number);
    }
}
declare module egret {
    class ColorMatrixFilter extends Filter {
        _matrix: Array<number>;
        private _matrix2;
        constructor(matrix?: Array<number>);
        matrix: Array<number>;
        private _setMatrix(value);
    }
}
declare module egret {
    class GlowFilter extends Filter {
        color: number;
        alpha: number;
        blurX: number;
        blurY: number;
        strength: number;
        quality: number;
        inner: boolean;
        knockout: boolean;
        _red: number;
        _green: number;
        _blue: number;
        constructor(color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean);
    }
}
declare module egret {
    class DropShadowFilter extends GlowFilter {
        distance: number;
        angle: number;
        constructor(distance?: number, angle?: number, color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean, hideObject?: boolean);
    }
}
declare module egret {
    class BlendMode {
        static NORMAL: string;
        static ADD: string;
        static ERASE: string;
        static ERASE_REVERSE: string;
    }
}
declare module egret {
    class DisplayObjectProperties {
        _name: string;
        _explicitWidth: number;
        _explicitHeight: number;
        _x: number;
        _y: number;
        _scaleX: number;
        _scaleY: number;
        _anchorOffsetX: number;
        _anchorOffsetY: number;
        _anchorX: number;
        _anchorY: number;
        _rotation: number;
        _alpha: number;
        _skewX: number;
        _skewY: number;
        _blendMode: string;
        static defaultTouchEnabled: boolean;
        _touchEnabled: boolean;
        _visible: boolean;
        _worldAlpha: number;
        _scrollRect: Rectangle;
        _cacheAsBitmap: boolean;
        _parent: DisplayObjectContainer;
        _stage: Stage;
        _needDraw: boolean;
        _filters: Array<Filter>;
        _hasWidthSet: boolean;
        _hasHeightSet: boolean;
        _normalDirty: boolean;
        _sizeDirty: boolean;
        _isContainer: boolean;
        constructor();
    }
}
declare module egret {
    class DisplayObjectPrivateProperties {
        _cacheBounds: egret.Rectangle;
        _hitTestPointTexture: RenderTexture;
        _rectW: number;
        _rectH: number;
        _cacheDirty: boolean;
        constructor();
    }
}
declare module egret {
    class DisplayObject extends EventDispatcher implements RenderData {
        _DO_Props_: DisplayObjectProperties;
        private _DO_Privs_;
        constructor();
        _texture_to_render: Texture;
        _worldTransform: egret.Matrix;
        _worldBounds: egret.Rectangle;
        __hack_local_matrix: any;
        _sizeChangeCallBack: Function;
        _sizeChangeCallTarget: any;
        _setDirty(): void;
        getDirty(): boolean;
        _setParentSizeDirty(): void;
        _setSizeDirty(): void;
        _clearDirty(): void;
        _clearSizeDirty(): void;
        name: string;
        parent: DisplayObjectContainer;
        _parentChanged(parent: DisplayObjectContainer): void;
        x: number;
        _setX(value: number): void;
        y: number;
        _setY(value: number): void;
        scaleX: number;
        scaleY: number;
        anchorOffsetX: number;
        anchorOffsetY: number;
        anchorX: number;
        _setAnchorX(value: number): void;
        anchorY: number;
        _setAnchorY(value: number): void;
        visible: boolean;
        _setVisible(value: boolean): void;
        rotation: number;
        alpha: number;
        _setAlpha(value: number): void;
        skewX: number;
        skewY: number;
        touchEnabled: boolean;
        _setTouchEnabled(value: boolean): void;
        blendMode: string;
        scrollRect: Rectangle;
        _setScrollRect(value: Rectangle): void;
        measuredWidth: number;
        measuredHeight: number;
        explicitWidth: number;
        explicitHeight: number;
        width: number;
        _getWidth(): number;
        height: number;
        _getHeight(): number;
        _setWidth(value: number): void;
        _setHeight(value: number): void;
        mask: Rectangle;
        worldAlpha: number;
        _draw(renderContext: RendererContext): void;
        private static color;
        private static colorMatrixFilter;
        _setGlobalFilters(renderContext: RendererContext): void;
        _removeGlobalFilters(renderContext: RendererContext): void;
        _hasFilters(): boolean;
        _pushMask(renderContext: RendererContext): void;
        _popMask(renderContext: RendererContext): void;
        private drawCacheTexture(renderContext);
        needDraw: boolean;
        _updateTransform(): void;
        _calculateWorldTransform(): void;
        _render(renderContext: RendererContext): void;
        getBounds(resultRect?: Rectangle, calculateAnchor?: boolean): egret.Rectangle;
        private destroyCacheBounds();
        private static identityMatrixForGetConcatenated;
        _getConcatenatedMatrix(): egret.Matrix;
        localToGlobal(x?: number, y?: number, resultPoint?: Point): Point;
        globalToLocal(x?: number, y?: number, resultPoint?: Point): Point;
        hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
        hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean;
        _getMatrix(parentMatrix?: Matrix): Matrix;
        _getSize(resultRect: Rectangle): Rectangle;
        _measureSize(resultRect: Rectangle): egret.Rectangle;
        _measureBounds(): egret.Rectangle;
        _getOffsetPoint(): egret.Point;
        _onAddToStage(): void;
        _onRemoveFromStage(): void;
        stage: Stage;
        static _enterFrameCallBackList: Array<any>;
        static _renderCallBackList: Array<any>;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        dispatchEvent(event: Event): boolean;
        _dispatchPropagationEvent(event: Event, list: Array<DisplayObject>, targetIndex?: number): void;
        willTrigger(type: string): boolean;
        cacheAsBitmap: boolean;
        renderTexture: RenderTexture;
        _makeBitmapCache(): boolean;
        _setCacheDirty(dirty?: boolean): void;
        static getTransformBounds(bounds: egret.Rectangle, mtx: egret.Matrix): egret.Rectangle;
        filters: Array<Filter>;
        private _transform;
        transform: Transform;
    }
}
declare module egret {
    class DisplayObjectContainer extends DisplayObject {
        static __EVENT__ADD_TO_STAGE_LIST: Array<DisplayObject>;
        static __EVENT__REMOVE_FROM_STAGE_LIST: Array<DisplayObject>;
        constructor();
        _touchChildren: boolean;
        touchChildren: boolean;
        _children: Array<DisplayObject>;
        numChildren: number;
        setChildIndex(child: DisplayObject, index: number): void;
        private doSetChildIndex(child, index);
        addChild(child: DisplayObject): DisplayObject;
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        _doAddChild(child: DisplayObject, index: number, notifyListeners?: boolean): DisplayObject;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        _doRemoveChild(index: number, notifyListeners?: boolean): DisplayObject;
        getChildAt(index: number): DisplayObject;
        contains(child: DisplayObject): boolean;
        swapChildrenAt(index1: number, index2: number): void;
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        private _swapChildrenAt(index1, index2);
        getChildIndex(child: egret.DisplayObject): number;
        removeChildren(): void;
        _updateTransform(): void;
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
        hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
        _onAddToStage(): void;
        _onRemoveFromStage(): void;
        getChildByName(name: string): DisplayObject;
    }
}
declare module egret {
    class StageScaleMode {
        static NO_BORDER: string;
        static NO_SCALE: string;
        static SHOW_ALL: string;
        static EXACT_FIT: string;
    }
}
declare module egret {
    class Stage extends DisplayObjectContainer {
        static _invalidateRenderFlag: boolean;
        _changeSizeDispatchFlag: boolean;
        invalidate(): void;
        constructor(width?: number, height?: number);
        private _scaleMode;
        scaleMode: string;
        changeSize(): void;
        private setResolutionPolicy();
        private _stageWidth;
        stageWidth: number;
        private _stageHeight;
        stageHeight: number;
        private _frameRate;
        frameRate: number;
        hitTest(x: any, y: any, ignoreTouchEnabled?: boolean): DisplayObject;
        getBounds(resultRect?: Rectangle): Rectangle;
        _updateTransform(): void;
        focus: DisplayObject;
        static SCALE_MODE_ENUM: any;
        static registerScaleMode(key: string, value: ContentStrategy, override?: boolean): void;
    }
}
declare module egret {
    class ScrollViewProperties {
        _verticalScrollPolicy: string;
        _horizontalScrollPolicy: string;
        _scrollLeft: number;
        _scrollTop: number;
        _hCanScroll: boolean;
        _vCanScroll: boolean;
        _lastTouchPosition: egret.Point;
        _touchStartPosition: egret.Point;
        _scrollStarted: boolean;
        _lastTouchTime: number;
        _lastTouchEvent: TouchEvent;
        _velocitys: Array<{
            x: number;
            y: number;
        }>;
        _isHTweenPlaying: boolean;
        _isVTweenPlaying: boolean;
        _hScrollTween: Tween;
        _vScrollTween: Tween;
        _bounces: boolean;
    }
}
declare module egret {
    class ScrollView extends DisplayObjectContainer {
        _ScrV_Props_: ScrollViewProperties;
        scrollBeginThreshold: number;
        scrollSpeed: number;
        bounces: boolean;
        constructor(content?: DisplayObject);
        _content: DisplayObject;
        setContent(content: DisplayObject): void;
        removeContent(): void;
        verticalScrollPolicy: string;
        horizontalScrollPolicy: string;
        scrollLeft: number;
        scrollTop: number;
        setScrollPosition(top: number, left: number, isOffset?: boolean): void;
        private _validatePosition(top?, left?);
        _setWidth(value: number): void;
        _setHeight(value: number): void;
        _updateContentPosition(): void;
        _checkScrollPolicy(): boolean;
        private __checkScrollPolicy(policy, contentLength, viewLength);
        _addEvents(): void;
        _removeEvents(): void;
        _onTouchBegin(e: TouchEvent): void;
        private delayTouchBeginEvent;
        private touchBeginTimer;
        _onTouchBeginCapture(event: TouchEvent): void;
        private _onTouchEndCapture(event);
        private _onTouchBeginTimer();
        private dispatchPropagationEvent(event);
        _dispatchPropagationEvent(event: Event, list: Array<DisplayObject>, targetIndex?: number): void;
        _onTouchMove(event: TouchEvent): void;
        _onTouchEnd(event: TouchEvent): void;
        _onEnterFrame(event: Event): void;
        private _logTouchEvent(e);
        private _getPointChange(e);
        private _calcVelocitys(e);
        _getContentWidth(): number;
        _getContentHeight(): number;
        getMaxScrollLeft(): number;
        getMaxScrollTop(): number;
        private static weight;
        private _moveAfterTouchEnd();
        _onTweenFinished(tw: Tween): void;
        _onScrollStarted(): void;
        _onScrollFinished(): void;
        setScrollTop(scrollTop: number, duration?: number): egret.Tween;
        setScrollLeft(scrollLeft: number, duration?: number): egret.Tween;
        private getAnimationDatas(pixelsPerMS, curPos, maxPos);
        private cloneTouchEvent(event);
        private throwNotSupportedError();
        addChild(child: DisplayObject): DisplayObject;
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        setChildIndex(child: DisplayObject, index: number): void;
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        swapChildrenAt(index1: number, index2: number): void;
        hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
    }
}
declare module egret {
    class BitmapFillMode {
        static REPEAT: string;
        static SCALE: string;
    }
}
declare module egret {
    class Bitmap extends DisplayObject {
        private static renderFilter;
        constructor(texture?: Texture);
        private _texture;
        texture: Texture;
        scale9Grid: Rectangle;
        fillMode: string;
        _render(renderContext: RendererContext): void;
        static _drawBitmap(renderContext: RendererContext, destW: number, destH: number, thisObject: any): void;
        private static drawRepeatImage(renderContext, data, destWidth, destHeight, repeat);
        private static drawScale9GridImage(renderContext, data, scale9Grid, destWidth, destHeight);
        _measureBounds(): egret.Rectangle;
    }
}
declare module egret {
    class BitmapText extends DisplayObject {
        constructor();
        private _text;
        private _textChanged;
        text: string;
        $setText(value: string): void;
        _font: BitmapFont;
        private _fontChanged;
        font: BitmapFont;
        $setFont(value: BitmapFont): void;
        _letterSpacing: number;
        letterSpacing: number;
        _setLetterSpacing(value: number): void;
        _lineSpacing: number;
        lineSpacing: number;
        _setLineSpacing(value: number): void;
        _setSizeDirty(): void;
        static EMPTY_FACTOR: number;
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
        private _textWidth;
        private _textHeight;
        private _textOffsetX;
        private _textOffsetY;
        private textLinesChange;
        private _textLines;
        _lineHeights: Array<number>;
        _getTextLines(): Array<string>;
    }
}
declare module egret {
    class GradientType {
        static LINEAR: string;
        static RADIAL: string;
    }
}
declare module egret {
    class Graphics {
        static _currentFillStyle: any;
        _renderContext: RenderContext;
        private commandQueue;
        private strokeStyle;
        private fillStyle;
        _dirty: boolean;
        private lineX;
        private lineY;
        private _endLineCommand;
        private _endFillCommand;
        constructor();
        beginFill(color: number, alpha?: number): void;
        _parseColor(color: number, alpha: number): string;
        private _setStyle(fillStyle);
        beginGradientFill(type: string, colors: Array<number>, alphas: Array<number>, ratios: Array<number>, matrix?: egret.Matrix): void;
        private getGradient(type, colors, alphas, ratios, matrix);
        drawRect(x: number, y: number, width: number, height: number): void;
        drawCircle(x: number, y: number, r: number): void;
        drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        drawEllipse(x: number, y: number, width: number, height: number): void;
        lineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number): void;
        lineTo(x: number, y: number): void;
        curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        moveTo(x: number, y: number): void;
        clear(): void;
        endFill(): void;
        _beginDraw(renderContext: RendererContext): void;
        _endDraw(renderContext: RendererContext): void;
        _draw(renderContext: RendererContext): void;
        private _firstCheck;
        private _minX;
        private _minY;
        private _maxX;
        private _maxY;
        _checkRect(x: number, y: number, w: number, h: number): void;
        private _lastX;
        private _lastY;
        _checkPoint(x: number, y: number): void;
        _measureBounds(): egret.Rectangle;
        private _createEndFillCommand();
        private _fill();
        private _createEndLineCommand();
        private _pushCommand(cmd);
    }
}
declare module egret {
    class Shape extends egret.DisplayObject {
        constructor();
        private _graphics;
        graphics: Graphics;
        _draw(renderContext: RendererContext): void;
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
    }
}
declare module egret {
    class Sprite extends DisplayObjectContainer {
        constructor();
        private _graphics;
        graphics: Graphics;
        _draw(renderContext: RendererContext): void;
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
        hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
    }
}
declare module egret {
    class TextFieldUtils {
        static _getStartLine(textfield: egret.TextField): number;
        static _getHalign(textfield: egret.TextField): number;
        static _getTextHeight(textfield: egret.TextField): number;
        static _getValign(textfield: egret.TextField): number;
        static _getTextElement(textfield: egret.TextField, x: number, y: number): ITextElement;
        static _getHit(textfield: egret.TextField, x: number, y: number): IHitTextElement;
        static _getScrollNum(textfield: egret.TextField): number;
    }
}
declare module egret {
    class TextFieldProperties {
        _type: string;
        _text: string;
        _displayAsPassword: boolean;
        _fontFamily: string;
        _size: number;
        _italic: boolean;
        _bold: boolean;
        _textColorString: string;
        _textColor: number;
        _strokeColorString: string;
        _strokeColor: number;
        _stroke: number;
        _border: boolean;
        _borderColor: number;
        _background: boolean;
        _backgroundColor: number;
        _textAlign: string;
        _verticalAlign: string;
        _textMaxWidth: number;
        _textMaxHeight: number;
        _maxChars: number;
        _scrollV: number;
        _lineSpacing: number;
        _numLines: number;
        _multiline: boolean;
        _wordWrap: boolean;
        _restrictAnd: string;
        _restrictNot: string;
        constructor();
    }
}
declare module egret {
    interface IHitTextElement {
        lineIndex: number;
        textElementIndex: number;
    }
    interface ITextStyle {
        textColor?: number;
        strokeColor?: number;
        size?: number;
        stroke?: number;
        bold?: boolean;
        italic?: boolean;
        fontFamily?: string;
        href?: string;
    }
    interface ITextElement {
        text: string;
        style?: ITextStyle;
    }
    interface IWTextElement extends ITextElement {
        width: number;
    }
    interface ILineElement {
        width: number;
        height: number;
        charNum: number;
        hasNextLine: boolean;
        elements: Array<IWTextElement>;
    }
}
declare module egret {
    class TextField extends DisplayObject {
        static default_fontFamily: string;
        private isInput();
        _inputEnabled: boolean;
        _setTouchEnabled(value: boolean): void;
        private _inputUtils;
        type: string;
        _setType(value: string): void;
        text: string;
        _getText(): string;
        _setSizeDirty(): void;
        _setTextDirty(): void;
        _setBaseText(value: string): void;
        _setText(value: string): void;
        displayAsPassword: boolean;
        _setDisplayAsPassword(value: boolean): void;
        fontFamily: string;
        _setFontFamily(value: string): void;
        size: number;
        _setSize(value: number): void;
        italic: boolean;
        _setItalic(value: boolean): void;
        bold: boolean;
        _setBold(value: boolean): void;
        textColor: number;
        _setTextColor(value: number): void;
        strokeColor: number;
        _setStrokeColor(value: number): void;
        stroke: number;
        _setStroke(value: number): void;
        textAlign: string;
        _setTextAlign(value: string): void;
        verticalAlign: string;
        _setVerticalAlign(value: string): void;
        maxWidth: any;
        maxChars: number;
        _setMaxChars(value: number): void;
        scrollV: number;
        maxScrollV: number;
        selectionBeginIndex: number;
        selectionEndIndex: number;
        caretIndex: number;
        _setSelection(beginIndex: number, endIndex: number): void;
        lineSpacing: number;
        _setLineSpacing(value: number): void;
        _getLineHeight(): number;
        numLines: number;
        multiline: boolean;
        _setMultiline(value: boolean): void;
        restrict: string;
        _setWidth(value: number): void;
        _setHeight(value: number): void;
        private _bgGraphics;
        border: boolean;
        borderColor: number;
        background: boolean;
        backgroundColor: number;
        private fillBackground();
        setFocus(): void;
        _TF_Props_: TextFieldProperties;
        constructor();
        _onRemoveFromStage(): void;
        _onAddToStage(): void;
        _updateBaseTransform(): void;
        _updateTransform(): void;
        _draw(renderContext: RendererContext): void;
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
        private _isFlow;
        textFlow: Array<egret.ITextElement>;
        private changeToPassText(text);
        private _textArr;
        private _isArrayChanged;
        private setMiddleStyle(textArr);
        textWidth: number;
        textHeight: number;
        appendText(newText: string): void;
        appendElement(newElement: egret.ITextElement): void;
        private _linesArr;
        _getLinesArr(): Array<egret.ILineElement>;
        wordWrap: boolean;
        _isTyping: boolean;
        private drawText(renderContext);
        private _addEvent();
        private _removeEvent();
        private onTapHandler(e);
    }
}
declare module egret {
    class HtmlTextParser {
        constructor();
        private _replaceArr;
        private initReplaceArr();
        private replaceSpecial(value);
        private resutlArr;
        parser(htmltext: string): Array<egret.ITextElement>;
        private addToResultArr(value);
        private changeStringToObject(str);
        private getHeadReg();
        private addProperty(info, head, value);
        private stackArray;
        private addToArray(infoStr);
    }
}
declare module egret {
    class TextFieldType {
        static DYNAMIC: string;
        static INPUT: string;
    }
}
declare module egret {
    class SpriteSheet extends HashObject {
        constructor(texture: Texture);
        private _sourceWidth;
        private _sourceHeight;
        private _bitmapX;
        private _bitmapY;
        private texture;
        _textureMap: Object;
        getTexture(name: string): Texture;
        createTexture(name: string, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX?: number, offsetY?: number, textureWidth?: number, textureHeight?: number): Texture;
        dispose(): void;
    }
}
declare module egret {
    class InputController extends HashObject {
        private stageText;
        private _text;
        private _isFocus;
        constructor();
        init(text: TextField): void;
        _addStageText(): void;
        _removeStageText(): void;
        _getText(): string;
        _setText(value: string): void;
        private focusHandler(event);
        private blurHandler(event);
        private onMouseDownHandler(event);
        private onStageDownHandler(event);
        private updateTextHandler(event);
        private resetText();
        _hideInput(): void;
        _updateTransform(): void;
        _updateProperties(): void;
    }
}
declare module egret {
    class BitmapFont extends SpriteSheet {
        constructor(texture: Texture, config: any);
        private charList;
        getTexture(name: string): Texture;
        private firstCharHeight;
        _getFirstCharHeight(): number;
        private parseConfig(fntText);
        private getConfigByKey(configText, key);
    }
}
declare module egret {
    class MovieClip extends DisplayObject {
        private _isAddedToStage;
        private static renderFilter;
        _textureToRender: Texture;
        _movieClipData: MovieClipData;
        private _frames;
        private _totalFrames;
        _frameLabels: any[];
        private _frameIntervalTime;
        _eventPool: string[];
        private _isPlaying;
        private _isStopped;
        private _playTimes;
        _currentFrameNum: number;
        _nextFrameNum: number;
        private _displayedKeyFrameNum;
        private _passedTime;
        constructor(movieClipData?: MovieClipData);
        _init(): void;
        _reset(): void;
        private _initFrame();
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
        _onAddToStage(): void;
        _onRemoveFromStage(): void;
        _getFrameLabelByName(labelName: string, ignoreCase?: boolean): FrameLabel;
        _getFrameLabelByFrame(frame: number): FrameLabel;
        _getFrameLabelForFrame(frame: number): FrameLabel;
        play(playTimes?: number): void;
        stop(): void;
        prevFrame(): void;
        nextFrame(): void;
        gotoAndPlay(frame: any, playTimes?: number): void;
        gotoAndStop(frame: any): void;
        private _gotoFrame(frame);
        private _advanceTime(advancedTime);
        _advanceFrame(): void;
        private _constructFrame();
        private _handlePendingEvent();
        totalFrames: number;
        currentFrame: number;
        currentFrameLabel: string;
        currentLabel: string;
        frameRate: number;
        isPlaying: boolean;
        movieClipData: MovieClipData;
        private _setMovieClipData(value);
        private setPlayTimes(value);
        private setIsStopped(value);
    }
}
declare module egret {
    class FrameLabel extends EventDispatcher {
        private _name;
        private _frame;
        constructor(name: string, frame: number);
        name: string;
        frame: number;
        clone(): FrameLabel;
    }
}
declare module egret {
    class MovieClipData extends HashObject {
        _mcData: any;
        numFrames: number;
        frames: any[];
        labels: any[];
        frameRate: number;
        textureData: any;
        spriteSheet: SpriteSheet;
        constructor();
        _init(mcData: any, textureData: any, spriteSheet: SpriteSheet): void;
        getKeyFrameData(frame: number): any;
        getTextureByFrame(frame: number): Texture;
        private getTextureByResName(resName);
        _isDataValid(): boolean;
        _isTextureValid(): boolean;
        _fillMCData(mcData: any): void;
        private _fillFramesData(framesData);
        private _fillFrameLabelsData(frameLabelsData);
        mcData: MovieClipData;
        private _setMCData(value);
    }
}
declare module egret {
    class MovieClipDataFactory extends EventDispatcher {
        enableCache: boolean;
        _mcDataSet: any;
        _spriteSheet: SpriteSheet;
        _mcDataCache: any;
        constructor(movieClipDataSet?: any, texture?: Texture);
        clearCache(): void;
        generateMovieClipData(movieClipName?: string): MovieClipData;
        private _findFromCache(movieClipName, cache);
        private _fillData(movieClipName, movieClip, cache);
        mcDataSet: any;
        texture: Texture;
        spriteSheet: SpriteSheet;
        private setTexture(value);
    }
}
declare module egret {
    class StageText extends EventDispatcher {
        constructor();
        _textfield: egret.TextField;
        _setTextField(textfield: egret.TextField): void;
        _getText(): string;
        _setText(value: string): void;
        _setTextType(type: string): void;
        _getTextType(): string;
        _show(multiline: boolean, size: number, width: number, height: number): void;
        _add(): void;
        _remove(): void;
        _hide(): void;
        _addListeners(): void;
        _removeListeners(): void;
        _scaleX: number;
        _scaleY: number;
        _setScale(x: number, y: number): void;
        changePosition(x: number, y: number): void;
        _size: number;
        _setSize(value: number): void;
        _color: string;
        _setTextColor(value: string): void;
        _fontFamily: string;
        _setTextFontFamily(value: string): void;
        _bold: boolean;
        _setBold(value: boolean): void;
        _italic: boolean;
        _setItalic(value: boolean): void;
        _textAlign: string;
        _setTextAlign(value: string): void;
        _verticalAlign: string;
        _setVerticalAlign(value: string): void;
        _visible: boolean;
        _setVisible(value: boolean): void;
        _width: number;
        _setWidth(value: number): void;
        _height: number;
        _setHeight(value: number): void;
        _multiline: boolean;
        _setMultiline(value: boolean): void;
        _maxChars: number;
        _setMaxChars(value: number): void;
        _resetStageText(): void;
        _initElement(x: number, y: number, cX: number, cY: number): void;
        _removeInput(): void;
        static create(): StageText;
        $onBlur(): void;
    }
}
declare module egret {
    class URLRequestMethod {
        static GET: string;
        static POST: string;
    }
}
declare module egret {
    class URLLoaderDataFormat {
        static BINARY: string;
        static TEXT: string;
        static VARIABLES: string;
        static TEXTURE: string;
        static SOUND: string;
    }
}
declare module egret {
    class URLVariables extends HashObject {
        constructor(source?: string);
        variables: Object;
        decode(source: string): void;
        toString(): string;
        private encodeValue(key, value);
        private encodeArray(key, value);
    }
}
declare module egret {
    class URLRequestHeader {
        name: string;
        value: string;
        constructor(name: string, value: string);
    }
}
declare module egret {
    class URLRequest extends HashObject {
        constructor(url?: string);
        data: any;
        method: string;
        url: string;
        requestHeaders: Array<URLRequestHeader>;
    }
}
declare module egret {
    class URLLoader extends EventDispatcher {
        constructor(request?: URLRequest);
        dataFormat: string;
        data: any;
        _request: URLRequest;
        load(request: URLRequest): void;
        _status: number;
        __recycle(): void;
    }
}
declare module egret {
    class Texture extends HashObject {
        constructor();
        _bitmapX: number;
        _bitmapY: number;
        _bitmapWidth: number;
        _bitmapHeight: number;
        _offsetX: number;
        _offsetY: number;
        _textureWidth: number;
        textureWidth: number;
        _textureHeight: number;
        textureHeight: number;
        _sourceWidth: number;
        _sourceHeight: number;
        _bitmapData: any;
        _setBitmapData(value: any): void;
        getPixel32(x: number, y: number): number[];
        dispose(): void;
        _clone(): Texture;
        draw(context: any, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, renderType: any): void;
        toDataURL(type: string, rect?: egret.Rectangle): string;
        saveToFile(type: string, filePath: string, rect?: egret.Rectangle): void;
        _drawForCanvas(context: CanvasRenderingContext2D, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, renderType: any): void;
        _drawForNative(context: any, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, renderType: any): void;
        _drawRepeatImageForNative(context: any, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, repeat: any): void;
        _drawRepeatImageForCanvas(context: CanvasRenderingContext2D, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, repeat: any): void;
        _disposeForCanvas(): void;
        _disposeForNative(): void;
        static deleteWebGLTexture(texture: Texture): void;
        static createBitmapData(url: string, callback: (code: number, bitmapData: any) => void): void;
        static crossOrigin: string;
        static _createBitmapDataForCanvasAndWebGl(url: string, callback: (code: number, bitmapData: any) => void): void;
        static _onLoad(url: any, bitmapData: any): void;
        static _onError(url: any, bitmapData: any): void;
        static _createBitmapDataForNative(url: string, callback: (code: number, bitmapData: any) => void): void;
        private static _addToCallbackList(url, callback);
        private static _bitmapDataFactory;
        private static _bitmapCallbackMap;
    }
}
declare module egret_native {
    module Texture {
        function addTexture(filePath: string): any;
        function addTextureAsyn(filePath: string, promise: any): any;
        function addTextureUnsyn(filePath: string, promise: any): any;
        function removeTexture(filePath: string): void;
    }
}
declare module egret {
    class RenderTexture extends Texture {
        renderContext: any;
        constructor();
        init(): void;
        static identityRectangle: egret.Rectangle;
        drawToTexture(displayObject: egret.DisplayObject, clipBounds?: Rectangle, scale?: number): boolean;
        setSize(width: number, height: number): void;
        begin(): void;
        end(): void;
        dispose(): void;
        private static _pool;
        static create(): RenderTexture;
        static release(value: RenderTexture): void;
    }
}
declare module egret {
    class RendererContext extends HashObject {
        renderCost: number;
        _matrixA: number;
        _matrixB: number;
        _matrixC: number;
        _matrixD: number;
        _matrixTx: number;
        _matrixTy: number;
        _texture_scale_factor: number;
        texture_scale_factor: number;
        _setTextureScaleFactor(value: number): void;
        static imageSmoothingEnabled: boolean;
        private profiler;
        constructor();
        clearScreen(): void;
        clearRect(x: number, y: number, w: number, h: number): void;
        drawImage(texture: Texture, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, repeat?: string): void;
        drawImageScale9(texture: Texture, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, offX: any, offY: any, destWidth: any, destHeight: any, rect: any): boolean;
        _addOneDraw(): void;
        setTransform(matrix: egret.Matrix): void;
        setAlpha(value: number, blendMode: string): void;
        setupFont(textField: TextField, style?: egret.ITextStyle): void;
        measureText(text: string): number;
        drawText(textField: egret.TextField, text: string, x: number, y: number, maxWidth: number, style?: egret.ITextStyle): void;
        strokeRect(x: any, y: any, w: any, h: any, color: any): void;
        pushMask(mask: Rectangle): void;
        popMask(): void;
        onRenderStart(): void;
        onRenderFinish(): void;
        createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
        createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
        setGlobalFilters(filterData: Array<Filter>): void;
        drawCursor(x1: number, y1: number, x2: number, y2: number): void;
        static createRendererContext(canvas: any): RendererContext;
        static blendModesForGL: any;
        private static initBlendMode();
        static registerBlendModeForGL(key: string, src: number, dst: number, override?: boolean): void;
    }
}
declare module egret {
    class InteractionMode {
        static MOUSE: string;
        static TOUCH: string;
        static mode: string;
    }
}
declare module egret {
    class TouchContext extends HashObject {
        private _currentTouchTarget;
        maxTouches: number;
        private touchDownTarget;
        touchingIdentifiers: Array<any>;
        constructor();
        run(): void;
        getTouchData(identifier: any, x: any, y: any): any;
        dispatchEvent(type: string, data: any): void;
        onTouchBegan(x: number, y: number, identifier: number): void;
        private lastTouchX;
        private lastTouchY;
        onTouchMove(x: number, y: number, identifier: number): void;
        onTouchEnd(x: number, y: number, identifier: number): void;
    }
}
declare module egret {
    class NetContext extends HashObject {
        constructor();
        proceed(loader: URLLoader): void;
        static _getUrl(request: URLRequest): string;
        getChangeList(): Array<any>;
        getVirtualUrl(url: string): string;
    }
}
declare module egret {
    class DeviceContext extends HashObject {
        constructor();
        executeMainLoop(callback: Function, thisObject: any): void;
        setFrameRate(frameRate: number): void;
    }
}
declare module egret {
    class ExternalInterface {
        static call(functionName: string, value: string): void;
        static addCallback(functionName: string, listener: Function): void;
    }
}
declare module egret {
    class Browser extends HashObject {
        private static instance;
        private trans;
        private ua;
        static getInstance(): Browser;
        webPSupport: boolean;
        isMobile: boolean;
        isIOS(): boolean;
        getIOSVersion(): string;
        constructor();
        getUserAgent(): string;
        private header;
        getTrans(style: string, judge?: boolean): string;
        private getHeader(style);
        $new(x: any): any;
        $(x: any): any;
        translate(a: any): string;
        rotate(a: any): string;
        scale(a: any): string;
        skew(a: any): string;
    }
}
declare module egret {
    class localStorage {
        static getItem(key: string): string;
        static setItem(key: string, value: string): boolean;
        static removeItem(key: string): void;
        static clear(): void;
    }
}
declare module egret {
    class XML {
        static parse(value: string): any;
        private static parseNode(node);
        static findChildren(xml: any, path: string, result?: Array<any>): Array<any>;
        private static findByPath(xml, path, result);
        static getAttributes(xml: any, result?: Array<any>): Array<string>;
    }
}
declare module egret {
    class Endian {
        static LITTLE_ENDIAN: string;
        static BIG_ENDIAN: string;
    }
    class ByteArray {
        private static SIZE_OF_BOOLEAN;
        private static SIZE_OF_INT8;
        private static SIZE_OF_INT16;
        private static SIZE_OF_INT32;
        private static SIZE_OF_UINT8;
        private static SIZE_OF_UINT16;
        private static SIZE_OF_UINT32;
        private static SIZE_OF_FLOAT32;
        private static SIZE_OF_FLOAT64;
        private BUFFER_EXT_SIZE;
        private data;
        private _position;
        private write_position;
        endian: string;
        constructor(buffer?: ArrayBuffer);
        private _setArrayBuffer(buffer);
        buffer: ArrayBuffer;
        dataView: DataView;
        bufferOffset: number;
        position: number;
        length: number;
        bytesAvailable: number;
        clear(): void;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        readDouble(): number;
        readFloat(): number;
        readInt(): number;
        readShort(): number;
        readUnsignedByte(): number;
        readUnsignedInt(): number;
        readUnsignedShort(): number;
        readUTF(): string;
        readUTFBytes(length: number): string;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
        writeDouble(value: number): void;
        writeFloat(value: number): void;
        writeInt(value: number): void;
        writeShort(value: number): void;
        writeUnsignedInt(value: number): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        toString(): string;
        _writeUint8Array(bytes: Uint8Array, validateBuffer?: boolean): void;
        validate(len: number): boolean;
        private validateBuffer(len, needReplace?);
        private encodeUTF8(str);
        private decodeUTF8(data);
        private encoderError(code_point);
        private decoderError(fatal, opt_code_point?);
        private EOF_byte;
        private EOF_code_point;
        private inRange(a, min, max);
        private div(n, d);
        private stringToCodePoints(string);
    }
}
declare module egret {
    function getOption(key: string): string;
}
declare module egret {
    class Tween extends EventDispatcher {
        private static NONE;
        private static LOOP;
        private static REVERSE;
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
        static pauseTweens(target: any): void;
        static resumeTweens(target: any): void;
        private static tick(delta, paused?);
        private static _register(tween, value);
        static removeAllTweens(): void;
        constructor(target: any, props: any, pluginData: any);
        private initialize(target, props, pluginData);
        private setPosition(value, actionsMode?);
        private _runActions(startPos, endPos, includeStart?);
        private _updateTargetProps(step, ratio);
        setPaused(value: boolean): Tween;
        private _cloneProps(props);
        private _addStep(o);
        private _appendQueueProps(o);
        private _addAction(o);
        private _set(props, o);
        wait(duration: number, passive?: boolean): Tween;
        to(props: any, duration?: number, ease?: Function): Tween;
        call(callback: Function, thisObj?: any, params?: Array<any>): Tween;
        set(props: any, target?: any): Tween;
        play(tween?: Tween): Tween;
        pause(tween?: Tween): Tween;
        tick(delta: number): void;
    }
}
declare module egret {
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
declare module egret {
    interface IAudio {
        _setCurrentTime(value: number): void;
        _getCurrentTime(): number;
        _setVolume(value: number): void;
        _getVolume(): number;
        _setLoop(value: boolean): void;
        _play(type?: string): void;
        _pause(): void;
        _load(): void;
        _preload(type: string, callback?: Function, thisObj?: any): void;
        _addEventListener(type: string, listener: Function, useCapture?: boolean): void;
        _removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
        _destroy(): void;
    }
}
declare module egret {
    class Sound extends egret.EventDispatcher {
        static MUSIC: string;
        static EFFECT: string;
        path: string;
        constructor();
        private audio;
        type: string;
        position: number;
        play(loop?: boolean, position?: number): void;
        private _pauseTime;
        stop(): void;
        pause(): void;
        resume(): void;
        load(): void;
        private _listeners;
        addEventListener(type: string, listener: Function, thisObject: any): void;
        removeEventListener(type: string, listener: Function, thisObject: any): void;
        private getVirtualType(type);
        volume: number;
        setVolume(value: number): void;
        getVolume(): number;
        preload(type: string, callback?: Function, thisObj?: any): void;
        _setAudio(value: IAudio): void;
        destroy(): void;
    }
}
declare module egret {
    class NumberUtils {
        static isNumber(value: any): boolean;
        static sin(value: number): number;
        private static sinInt(value);
        static cos(value: number): number;
        private static cosInt(value);
    }
}
declare var egret_sin_map: {};
declare var egret_cos_map: {};
declare module egret {
    class PromiseObject {
        private static promiseObjectList;
        onSuccessFunc: Function;
        onSuccessThisObject: any;
        onErrorFunc: Function;
        onErrorThisObject: any;
        downloadingSizeFunc: Function;
        downloadingSizeThisObject: any;
        constructor();
        static create(): any;
        private onSuccess(...args);
        private onError(...args);
        private downloadingSize(...args);
        private destroy();
    }
}
declare module egret {
    interface IVersionController {
        fetchVersion(): void;
        checkIsNewVersion(url: string): boolean;
        saveVersion(url: string): void;
        getChangeList(): Array<string>;
        getVirtualUrl(url: string): string;
    }
}
