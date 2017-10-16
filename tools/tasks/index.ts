const res = require('../lib/resourcemanager');
import manifest from './manifest';
import compile from './compile'
import incrementCompile from './incrementCompile';


export function run() {
    res.createPlugin(manifest);
    res.createPlugin(compile);
    res.createPlugin(incrementCompile);
}