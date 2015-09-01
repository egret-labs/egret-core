/// <reference path="../lib/types.d.ts" />

export function parse(args: egret.ToolArgs, rawArgs: string[]) {
    var commandMap = {
        "c": convertCreate,
        "create": convertCreate,
        "b": convertBuild,
        "build": convertBuild,
        "startserver": convertStartServer
    }

    var convertor = commandMap[args.command];
    if (convertor)
        convertor(args, rawArgs);
}

function convertStartServer(args: egret.ToolArgs, rawArgs: string[]) {
    args.command = "run";
}

function convertCreate(args: egret.ToolArgs, rawArgs: string[]) {
    args.command = "create";
    args.type = args.type || args.template;
}

function convertBuild(args: egret.ToolArgs, rawArgs: string[]) {
    args.command = "build";
    if (args['buildEngine'])
        args.command = 'clean';
}