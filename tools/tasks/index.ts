const res = require('../lib/resourcemanager');
export { ManifestPlugin } from './manifest';
export { ExmlPlugin } from './exml';
export { IncrementCompilePlugin } from './incrementCompile'
export { CompilePlugin, UglifyPlugin } from './compile';
export { TextureMergerPlugin } from './texturemerger';
export { EmitResConfigFilePlugin } from './resConfig';


export function run() {

}

export interface Plugin {
    onFile(file: File): Promise<File | null>;
    onFinish(param: PluginContext): (void | Promise<void>)

}

export type File = {

    origin: string,

    contents: Buffer;

    path: string;

    readonly relative: string;

    readonly base: string;

    readonly extname: string;
}


export type PluginContext = {
    projectRoot: string,
    resourceFolder: string,
    buildConfig: { command: "build" | "publish" },

    createFile: (relativePath: string, content: Buffer) => void
}