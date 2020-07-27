namespace egret.pro {
    export let egret2dDriveMode: boolean = false;
    export let mainCanvas: HTMLCanvasElement;

    /**
     * 根据场景地址获取场景，并将主摄像机Main Camera渲染为2d贴图并返回
     * 只能在场景中只有一个相机（Main Camera）时使用
     * @param scenePath 场景路径（相对与3d项目resource文件夹）
     * @param textureWidth 贴图宽度 ，默认为512
     * @param textureHeight 贴图高度 ，默认为512
     * @param scaleFactor 贴图质量。系数越大，贴图越清晰
     */
    export function createTextureFrom3dScene(scenePath: string, textureWidth: number = 512, textureHeight: number = 512, scaleFactor: number = 1): Promise<egret.Texture> {
        return Application.instance.egretProUtil.execute("createTextureFrom3dScene", scenePath, textureWidth, textureHeight, scaleFactor);
    }


    /**
     * 根据场景地址获取场景，并根据过滤器，获取所有符合条件的相机，渲染为2d贴图并返回
     * 单一场景需要用到多个摄像机时可使用此方法
     * 被filter过滤掉的Camera组件会将enable设为false
     * @param scenePath 
     * @param filter 判断该树节点的相机组件是否需要作为egret.Texture返回
     * @param textureWidth 
     * @param textureHeight 
     * @param scaleFactor 
     */
    export function createTextureForCameras(scenePath: string, filter: (child: TreeNode) => boolean, textureWidth: number = 512, textureHeight: number = 512, scaleFactor: number = 1): Promise<{
        [key: string]: egret.Texture;
    }> {
        return Application.instance.egretProUtil.execute("createTextureForCameras", scenePath, filter, textureWidth, textureHeight, scaleFactor);
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
     * @param target 
     * @param func 
     * @param thisObject 
     */
    export function addEventListener(eventType: string, target: any, func: (...args: any[]) => void, thisObject: any): void {
        return Application.instance.egretProUtil.addEventListener(eventType, target, func, thisObject);
    }

    /**
     * 移除事件
     * @param eventType 
     * @param target 
     * @param func 
     */
    export function removeEventListener(eventType: string, target: any, func: (...args: any[]) => void): void {
        return Application.instance.egretProUtil.removeEventListener(eventType, target, func);
    }

    /**
     * 派发事件
     * @param command 
     * @param target 
     * @param args 
     */
    export function dispatch(command: string, target: any, ...args: any[]): void {
        return Application.instance.egretProUtil.dispatch(command, target, ...args);
    }

    /**
     * egret Pro中TreeNode部分对外属性
     */
    export type TreeNode = {
        name: string,
        tag: string,
        layer: number,
        path: string,
        childCount: number
    }
}


