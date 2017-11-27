const res = require('../lib/resourcemanager');
import manifest from './manifest';
import compile from './compile'
import incrementCompile from './incrementCompile';
import EXML from './exml';


export function run() {
    res.createPlugin(manifest);
    res.createPlugin(compile);
    res.createPlugin(incrementCompile);

    const debug = new EXML('path');
    debug.name = 'exml-debug';

    const publish = new EXML('commonjs');
    publish.name = 'exml';

    res.createPlugin(debug);
    res.createPlugin(publish);
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