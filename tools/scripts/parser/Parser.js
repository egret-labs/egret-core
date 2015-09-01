/// <reference path="../lib/types.d.ts" />
var utils = require('../lib/utils');
var file = require('../lib/FileUtil');
var CompileOptions = require("./CompileOptions");
exports.optionDeclarations = [
    {
        name: "action",
        type: "string"
    }, {
        name: "includeEgret",
        type: "boolean",
        shortName: "e"
    }, {
        name: "sourceMap",
        type: "boolean"
    }, {
        name: 'serverOnly',
        type: "boolean"
    }, {
        name: 'autoCompile',
        type: 'boolean',
        shortName: "a"
    }, {
        name: 'fileName',
        type: 'string',
        shortName: 'f'
    }, {
        name: 'port',
        type: 'number'
    }
];
var shortOptionNames = {};
var optionNameMap = {};
exports.optionDeclarations.forEach(function (option) {
    optionNameMap[option.name.toLowerCase()] = option;
    if (option.shortName) {
        shortOptionNames[option.shortName] = option.name;
    }
});
function parseCommandLine(commandLine) {
    // Set default compiler option values
    var options = new CompileOptions();
    var filenames = [];
    var errors = [];
    options.egretRoot = utils.getEgretRoot();
    parseStrings(commandLine);
    return options;
    function parseStrings(args) {
        var i = 0;
        while (i < args.length) {
            var s = args[i++];
            if (s.charAt(0) === '-') {
                s = s.slice(s.charAt(1) === '-' ? 2 : 1).toLowerCase();
                // Try to translate short option names to their full equivalents.
                if (s in shortOptionNames) {
                    s = shortOptionNames[s].toLowerCase();
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
                    }
                }
                else {
                    //Unknown option
                    errors.push(utils.tr(10002, s));
                }
            }
            else {
                if (options.action == null)
                    options.action = s;
                else if (options.projectDir == null)
                    options.projectDir = s;
                else
                    filenames.push(s);
            }
        }
        if (options.projectDir == null)
            options.projectDir = process.cwd();
        else {
            var absPath = file.joinPath(process.cwd(), options.projectDir);
            if (file.isDirectory(absPath)) {
                options.projectDir = absPath;
                process.chdir(absPath);
            }
            else if (file.isDirectory(options.projectDir)) {
                process.chdir(options.projectDir);
            }
        }
        options.projectDir = file.joinPath(options.projectDir, "/");
    }
}
exports.parseCommandLine = parseCommandLine;
//# sourceMappingURL=Parser.js.map