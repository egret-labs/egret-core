const res = require('../lib/resourcemanager');
import manifest from './manifest';
import compile from './compile'


export function run() {
    res.createPlugin(manifest);
    res.createPlugin(compile);
}