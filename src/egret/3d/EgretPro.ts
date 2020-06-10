namespace egret.pro {
    export let egret2dDriveMode: boolean = false;
    export let mainCanvas: HTMLCanvasElement;
    export function getTextureFrom3dScene(scenePath: string, textureWidth: number = 512, textureHeight: number = 512): Promise<egret.Texture> {
        return Application.instance.egretProUtil.execute("getTextureFromScene", scenePath, textureWidth, textureHeight);
    }

    /**
     * 执行方法
     * 通过传入命令的字符串，获取已注册的方法并执行，参数为可变参数
     * 执行方法可获取到方法的返回值
     * 若找到注册该方法，会报出警告并返回 null
     * @param command 
     * @param thisObject 
     * @param args 
     */
    export function execute(command: string, ...args: any[]): any {
        return Application.instance.egretProUtil.execute(command, ...args);
    }

    /**
     * 注册方法
     * 根据传入字符串名称，注册方法
     * 同一个名称的方法只能注册一次，相同名称会报出警告
     * @param command 
     * @param func 
     * @param thisObject 
     */
    export function register(command: string, func: (...args: any[]) => any, thisObject: any) {
        return Application.instance.egretProUtil.register(command, func, thisObject);
    }

    /**
     * 注册事件
     * @param eventType 
     * @param func 
     * @param thisObject 
     */
    export function addEventListener(eventType: string, func: (...args: any[]) => void, thisObject: any): void {
        return Application.instance.egretProUtil.addEventListener(eventType, func, thisObject);
    }

    /**
     * 移除事件
     * @param eventType 
     * @param func 
     * @param thisObject 
     */
    export function removeEventListener(eventType: string, func: (...args: any[]) => void, thisObject: any): void {
        return Application.instance.egretProUtil.removeEventListener(eventType, func, thisObject);
    }

    /**
     * 派发事件
     * @param command 
     * @param thisObject 
     * @param args 
     */
    export function dispatch(command: string, thisObject: any, ...args: any[]): void {
        return Application.instance.egretProUtil.dispatch(command, thisObject, ...args);
    }
}