const res = require('../lib/resourcemanager');
export { ManifestPlugin } from './manifest';
export { ExmlPlugin } from './exml';
export { IncrementCompilePlugin } from './incrementCompile'
export { CompilePlugin, UglifyPlugin } from './compile';
export { TextureMergerPlugin } from './texturemerger';
export { EmitResConfigFilePlugin, ConvertResConfigFilePlugin } from './resConfig';
export { CleanPlugin } from './clean';
export { RenamePlugin } from './rename';
export { ResSplitPlugin } from './resSplit';
export { ZipPlugin, MergeEuiJsonPlugin } from './merge';
export { StartServerPlugin } from './start-server-plugin';


export function run() {
    global.exitCode = 0;
}

export interface Plugin {
    onFile(file: File): Promise<File | null>;
    onFinish(param: PluginContext): (void | Promise<void>)

}


export type FileOptions = {
    outputDir?: string,
    type?: string,
    subkeys?: string[] | string
};

export type File = {

    origin: string,

    contents: Buffer;

    path: string;

    options: FileOptions

    outputDir?: string

    readonly relative: string;

    readonly base: string;

    readonly extname: string;
}


export type PluginContext = {
    projectRoot: string,
    resourceFolder: string,
    buildConfig: { command: "build" | "publish" },
    outputDir: string,
    createFile: (relativePath: string, content: Buffer, options?: FileOptions) => void
}