const res = require('../lib/resourcemanager');
export { ManifestPlugin } from './manifest';
export { ExmlPlugin } from './exml';
export { IncrementCompilePlugin } from './incrementCompile'
export { CompilePlugin, UglifyPlugin } from './compile';
export { SpriteSheetPlugin } from './spritesheet';


export function run() {

}

export interface Plugin {
    onFile(file: File): Promise<File | null>;
    onFinish(param: PluginContext): (void | Promise<void>)

}

export type File = {

    original_relative: string,

    contents: Buffer;
}


export type PluginContext = {
    projectRoot: string,
    resourceFolder: string,
    buildConfig: { command: "build" | "publish" },

    createFile: (relativePath: string, content: Buffer) => void
}