/// <reference path="../lib/types.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
function parse(args, rawArgs) {
    var commandMap = {
        "c": convertCreate,
        "create": convertCreate,
        "b": convertBuild,
        "build": convertBuild,
        "startserver": convertStartServer
    };
    var convertor = commandMap[args.command];
    if (convertor)
        convertor(args, rawArgs);
}
exports.parse = parse;
function convertStartServer(args, rawArgs) {
    args.command = "run";
}
function convertCreate(args, rawArgs) {
    args.command = "create";
    args.type = args.type || args.template;
}
function convertBuild(args, rawArgs) {
    args.command = "build";
    if (args['buildEngine']) {
        // console.log('egret build -e 已经废弃，请使用 egret clean 代替')
        args.command = 'clean';
    }
}
