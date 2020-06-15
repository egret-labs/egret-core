declare class Application {
    static instance: Application;
    egretProUtil: EgretProUtil;
}

declare class EgretProUtil {
    /**
     * 执行方法
     * 通过传入命令的字符串，获取已注册的方法并执行，参数为可变参数
     * 执行方法可获取到方法的返回值
     * 若找到注册该方法，会报出警告并返回 null
     * @param command 
     * @param thisObject 
     * @param args 
     */
    execute(command: string, ...args: any[]): any;

    /**
     * 注册方法
     * 根据传入字符串名称，注册方法
     * 同一个名称的方法只能注册一次，相同名称会报出警告
     * @param command 
     * @param func 
     * @param thisObject 
     */
    register(command: string, func: (...args: any[]) => any, thisObject: any): void;

    /**
     * 注册事件
     * @param eventType 
     * @param target
     * @param func 
     * @param thisObject 
     */
    addEventListener(eventType: string, target: any, func: (...args: any[]) => void, thisObject: any): void;

    /**
     * 移除事件
     * @param eventType 
     * @param target
     * @param func
     */
    removeEventListener(eventType: string, target: any, func: (...args: any[]) => void): void;
    /**
     * 派发事件
     * @param command 
     * @param target
     * @param args 
     */
    dispatch(command: string, target: any, ...args: any[]): void;
}