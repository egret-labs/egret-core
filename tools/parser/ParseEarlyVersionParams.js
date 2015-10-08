/// <reference path="../lib/types.d.ts" />
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
    if (args['buildEngine'])
        args.command = 'clean';
}

//# sourceMappingURL=../parser/ParseEarlyVersionParams.js.map