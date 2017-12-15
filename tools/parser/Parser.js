/// <reference path="../lib/types.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("../lib/utils");
var file = require("../lib/FileUtil");
var CompileOptions = require("./CompileOptions");
var project = require("../project");
var path = require("path");
var EngineData_1 = require("../EngineData");
exports.optionDeclarations = [
    {
        name: "action",
        type: "string"
    }, {
        name: "sourceMap",
        type: "boolean"
    }, {
        name: 'serverOnly',
        type: "boolean"
    }, {
        name: 'autoCompile',
        type: 'boolean',
        alias: "a"
    }, {
        name: 'fileName',
        type: 'string',
        alias: 'f'
    }, {
        name: 'port',
        type: 'number'
    }, {
        name: 'contentWidth',
        type: 'number'
    }, {
        name: 'contentHeight',
        type: 'number'
    }, {
        name: 'scaleMode',
        type: 'string'
    }, {
        name: 'modules',
        type: 'array'
    }, {
        name: 'platforms',
        type: 'array'
    }, {
        name: 'background',
        type: 'string'
    }, {
        name: 'orientation',
        type: 'string'
    }, {
        name: 'debug',
        type: 'boolean'
    }, {
        name: 'added',
        type: 'array'
    }, {
        name: 'removed',
        type: 'array'
    }, {
        name: 'modified',
        type: 'array'
    }, {
        name: 'manifest',
        type: 'string'
    }, {
        name: 'type',
        type: 'string'
    }, {
        name: 'target',
        type: 'string',
        alias: 'runtime'
    }, {
        name: 'version',
        type: 'string'
    }, {
        name: 'compile',
        type: 'boolean'
    }, {
        name: 'password',
        type: 'string'
    }, {
        name: 'keepEXMLTS',
        type: 'boolean',
        alias: "k"
    }, {
        name: 'log',
        type: 'boolean'
    }, {
        name: 'platform',
        type: 'string'
    }, {
        name: 'templatePath',
        type: 'string',
        alias: "t"
    }, {
        name: 'all',
        type: 'boolean'
    }, {
        name: 'buildEngine',
        type: 'boolean',
        alias: "e"
    }, {
        name: 'experimental',
        type: 'boolean',
        alias: "exp"
    }, {
        name: 'ide',
        type: 'string'
    }, {
        name: 'exmlGenJs',
        type: 'boolean',
        alias: 'gjs'
    }, {
        name: 'androidProjectPath',
        type: 'string',
        alias: 'p'
    }, {
        name: 'sdk',
        type: 'string',
        alias: 's'
    }
];
var aliasNames = {};
var optionNameMap = {};
exports.optionDeclarations.forEach(function (option) {
    optionNameMap[option.name.toLowerCase()] = option;
    if (option.alias) {
        aliasNames[option.alias] = option.name;
    }
});
function parseCommandLine(commandLine) {
    // Set default compiler option values
    var options = new CompileOptions();
    var filenames = [];
    var errors = [];
    egret.root = utils.getEgretRoot();
    parseStrings(commandLine);
    if (options.target === 'html5') {
        options.target = 'web';
    }
    return options;
    function parseStrings(args) {
        var i = 0;
        var commands = [];
        while (i < args.length) {
            var s = args[i++];
            if (s.charAt(0) === '-') {
                s = s.slice(s.charAt(1) === '-' ? 2 : 1).toLowerCase();
                // Try to translate short option names to their full equivalents.
                if (s in aliasNames) {
                    s = aliasNames[s].toLowerCase();
                }
                if (s in optionNameMap) {
                    var opt = optionNameMap[s];
                    // Check to see if no argument was provided (e.g. "--locale" is the last command-line argument).
                    if (!args[i] && opt.type !== "boolean") {
                        errors.push(utils.tr(10001, opt.name));
                    }
                    switch (opt.type) {
                        case "number":
                            options[opt.name] = parseInt(args[i++]);
                            break;
                        case "boolean":
                            options[opt.name] = true;
                            break;
                        case "string":
                            options[opt.name] = args[i++] || "";
                            break;
                        case "array":
                            options[opt.name] = (args[i++] || "").split(',').map(function (p) { return decodeURIComponent(p); });
                    }
                }
                else {
                    //Unknown option
                    errors.push(utils.tr(10002, s));
                }
            }
            else {
                commands.push(s);
            }
        }
        if (commands.length > 0) {
            options.commands = commands.concat();
            options.command = commands[0];
            if (file.isDirectory(commands[1]) || options.command == "create"
                || options.command == "create_app"
                || options.command == "create_lib"
                || options.command == "apitest") {
                options.projectDir = commands[1];
                commands.splice(1, 1);
            }
            else if (options.command == "native" &&
                options.commands[1] &&
                options.commands[2]) {
                options.projectDir = commands[2];
                commands.splice(2, 1);
            }
        }
        //create_app命令不强制设置projectDir属性
        if (options.projectDir == null && options.command == "create_app") {
        }
        else {
            if (!options.projectDir)
                options.projectDir = process.cwd();
            else {
                var absPath = path.resolve(process.cwd(), options.projectDir);
                if (file.isDirectory(absPath)) {
                    options.projectDir = absPath;
                }
            }
            options.projectDir = file.joinPath(options.projectDir, "/");
            project.projectData.init(options.projectDir);
        }
        EngineData_1.data.init();
        var packagePath = file.joinPath(egret.root, "package.json");
        var content = file.read(packagePath);
        var manifest;
        try {
            manifest = JSON.parse(content);
        }
        catch (e) {
            utils.exit(10009, packagePath);
        }
        egret.manifest = manifest["egret"];
        egret.version = manifest["version"];
    }
}
exports.parseCommandLine = parseCommandLine;
function parseJSON(json) {
    var options = new CompileOptions();
    var filenames = [];
    var errors = [];
    options.projectDir = json.projectDir || process.cwd();
    options.command = json.command;
    options.autoCompile = json.autoCompile;
    options.debug = json.debug;
    options.esTarget = json.esTarget;
    options.fileName = json.fileName;
    options.port = json.port;
    options.publish = json.publish;
    options.serverOnly = json.serverOnly;
    options.sourceMap = json.sourceMap;
    options.added = json.added;
    options.modified = json.modified;
    options.removed = json.removed;
    options.experimental = json.experimental;
    return options;
}
exports.parseJSON = parseJSON;
