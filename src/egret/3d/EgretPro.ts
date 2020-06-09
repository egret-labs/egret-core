namespace egret.pro {
    export let egret2dDriveMode: boolean = false;
    export let mainCanvas: HTMLCanvasElement;
    export function getTextureFrom3dScene(scenePath: string, textureWidth: number = 512, textureHeight: number = 512): Promise<egret.Texture> {
        return Application.instance.egretProUtil.getTextureFromScene(scenePath, textureWidth, textureHeight);
    }

}

declare class Application {
    static instance: Application;
    egretProUtil: {
        getTextureFromScene(scenePath: string, textureWidth?: number, textureHeight?: number): Promise<egret.Texture>
    }
}