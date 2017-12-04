const res = require('../lib/resourcemanager');
export { ManifestPlugin } from './manifest';
export { ExmlPlugin } from './exml';
export { IncrementCompilePlugin } from './incrementCompile'
export { CompilePlugin, UglifyPlugin } from './compile';


export function run() {

}

export type Plugin = {

    name: string;

    onFile: (file: any) => Promise<any | null>;

    onFinish: (param: PluginContext) => void | Promise<void>
}

export type PluginContext = {
    projectRoot: string,
    resourceFolder: string,
    buildConfig: { command: "build" | "publish" },

    createFile: (relativePath: string, content: Buffer) => void
}