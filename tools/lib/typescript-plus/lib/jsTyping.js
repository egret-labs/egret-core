"use strict";
var ts;
(function (ts) {
    var server;
    (function (server) {
        /* @internal */
        server.ActionSet = "action::set";
        /* @internal */
        server.ActionInvalidate = "action::invalidate";
        /* @internal */
        server.ActionPackageInstalled = "action::packageInstalled";
        /* @internal */
        server.EventTypesRegistry = "event::typesRegistry";
        /* @internal */
        server.EventBeginInstallTypes = "event::beginInstallTypes";
        /* @internal */
        server.EventEndInstallTypes = "event::endInstallTypes";
        /* @internal */
        server.EventInitializationFailed = "event::initializationFailed";
        /* @internal */
        var Arguments;
        (function (Arguments) {
            Arguments.GlobalCacheLocation = "--globalTypingsCacheLocation";
            Arguments.LogFile = "--logFile";
            Arguments.EnableTelemetry = "--enableTelemetry";
            Arguments.TypingSafeListLocation = "--typingSafeListLocation";
            Arguments.TypesMapLocation = "--typesMapLocation";
            /**
             * This argument specifies the location of the NPM executable.
             * typingsInstaller will run the command with `${npmLocation} install ...`.
             */
            Arguments.NpmLocation = "--npmLocation";
            /**
             * Flag indicating that the typings installer should try to validate the default npm location.
             * If the default npm is not found when this flag is enabled, fallback to `npm install`
             */
            Arguments.ValidateDefaultNpmLocation = "--validateDefaultNpmLocation";
        })(Arguments = server.Arguments || (server.Arguments = {}));
        /* @internal */
        function hasArgument(argumentName) {
            return ts.sys.args.indexOf(argumentName) >= 0;
        }
        server.hasArgument = hasArgument;
        /* @internal */
        function findArgument(argumentName) {
            var index = ts.sys.args.indexOf(argumentName);
            return index >= 0 && index < ts.sys.args.length - 1
                ? ts.sys.args[index + 1]
                : undefined;
        }
        server.findArgument = findArgument;
        /* @internal */
        function nowString() {
            // E.g. "12:34:56.789"
            var d = new Date();
            return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
        }
        server.nowString = nowString;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
/* @internal */
var ts;
(function (ts) {
    var JsTyping;
    (function (JsTyping) {
        function isTypingUpToDate(cachedTyping, availableTypingVersions) {
            var availableVersion = new ts.Version(ts.getProperty(availableTypingVersions, "ts" + ts.versionMajorMinor) || ts.getProperty(availableTypingVersions, "latest"));
            return availableVersion.compareTo(cachedTyping.version) <= 0;
        }
        JsTyping.isTypingUpToDate = isTypingUpToDate;
        JsTyping.nodeCoreModuleList = [
            "assert",
            "async_hooks",
            "buffer",
            "child_process",
            "cluster",
            "console",
            "constants",
            "crypto",
            "dgram",
            "dns",
            "domain",
            "events",
            "fs",
            "http",
            "https",
            "http2",
            "inspector",
            "net",
            "os",
            "path",
            "perf_hooks",
            "process",
            "punycode",
            "querystring",
            "readline",
            "repl",
            "stream",
            "string_decoder",
            "timers",
            "tls",
            "tty",
            "url",
            "util",
            "v8",
            "vm",
            "zlib"
        ];
        JsTyping.nodeCoreModules = new ts.Set(JsTyping.nodeCoreModuleList);
        function nonRelativeModuleNameForTypingCache(moduleName) {
            return JsTyping.nodeCoreModules.has(moduleName) ? "node" : moduleName;
        }
        JsTyping.nonRelativeModuleNameForTypingCache = nonRelativeModuleNameForTypingCache;
        function loadSafeList(host, safeListPath) {
            var result = ts.readConfigFile(safeListPath, function (path) { return host.readFile(path); });
            return new ts.Map(ts.getEntries(result.config));
        }
        JsTyping.loadSafeList = loadSafeList;
        function loadTypesMap(host, typesMapPath) {
            var result = ts.readConfigFile(typesMapPath, function (path) { return host.readFile(path); });
            if (result.config) {
                return new ts.Map(ts.getEntries(result.config.simpleMap));
            }
            return undefined;
        }
        JsTyping.loadTypesMap = loadTypesMap;
        /**
         * @param host is the object providing I/O related operations.
         * @param fileNames are the file names that belong to the same project
         * @param projectRootPath is the path to the project root directory
         * @param safeListPath is the path used to retrieve the safe list
         * @param packageNameToTypingLocation is the map of package names to their cached typing locations and installed versions
         * @param typeAcquisition is used to customize the typing acquisition process
         * @param compilerOptions are used as a source for typing inference
         */
        function discoverTypings(host, log, fileNames, projectRootPath, safeList, packageNameToTypingLocation, typeAcquisition, unresolvedImports, typesRegistry) {
            if (!typeAcquisition || !typeAcquisition.enable) {
                return { cachedTypingPaths: [], newTypingNames: [], filesToWatch: [] };
            }
            // A typing name to typing file path mapping
            var inferredTypings = new ts.Map();
            // Only infer typings for .js and .jsx files
            fileNames = ts.mapDefined(fileNames, function (fileName) {
                var path = ts.normalizePath(fileName);
                if (ts.hasJSFileExtension(path)) {
                    return path;
                }
            });
            var filesToWatch = [];
            if (typeAcquisition.include)
                addInferredTypings(typeAcquisition.include, "Explicitly included types");
            var exclude = typeAcquisition.exclude || [];
            // Directories to search for package.json, bower.json and other typing information
            var possibleSearchDirs = new ts.Set(fileNames.map(ts.getDirectoryPath));
            possibleSearchDirs.add(projectRootPath);
            possibleSearchDirs.forEach(function (searchDir) {
                var packageJsonPath = ts.combinePaths(searchDir, "package.json");
                getTypingNamesFromJson(packageJsonPath, filesToWatch);
                var bowerJsonPath = ts.combinePaths(searchDir, "bower.json");
                getTypingNamesFromJson(bowerJsonPath, filesToWatch);
                var bowerComponentsPath = ts.combinePaths(searchDir, "bower_components");
                getTypingNamesFromPackagesFolder(bowerComponentsPath, filesToWatch);
                var nodeModulesPath = ts.combinePaths(searchDir, "node_modules");
                getTypingNamesFromPackagesFolder(nodeModulesPath, filesToWatch);
            });
            getTypingNamesFromSourceFileNames(fileNames);
            // add typings for unresolved imports
            if (unresolvedImports) {
                var module_1 = ts.deduplicate(unresolvedImports.map(nonRelativeModuleNameForTypingCache), ts.equateStringsCaseSensitive, ts.compareStringsCaseSensitive);
                addInferredTypings(module_1, "Inferred typings from unresolved imports");
            }
            // Add the cached typing locations for inferred typings that are already installed
            packageNameToTypingLocation.forEach(function (typing, name) {
                var registryEntry = typesRegistry.get(name);
                if (inferredTypings.has(name) && inferredTypings.get(name) === undefined && registryEntry !== undefined && isTypingUpToDate(typing, registryEntry)) {
                    inferredTypings.set(name, typing.typingLocation);
                }
            });
            // Remove typings that the user has added to the exclude list
            for (var _i = 0, exclude_1 = exclude; _i < exclude_1.length; _i++) {
                var excludeTypingName = exclude_1[_i];
                var didDelete = inferredTypings.delete(excludeTypingName);
                if (didDelete && log)
                    log("Typing for " + excludeTypingName + " is in exclude list, will be ignored.");
            }
            var newTypingNames = [];
            var cachedTypingPaths = [];
            inferredTypings.forEach(function (inferred, typing) {
                if (inferred !== undefined) {
                    cachedTypingPaths.push(inferred);
                }
                else {
                    newTypingNames.push(typing);
                }
            });
            var result = { cachedTypingPaths: cachedTypingPaths, newTypingNames: newTypingNames, filesToWatch: filesToWatch };
            if (log)
                log("Result: " + JSON.stringify(result));
            return result;
            function addInferredTyping(typingName) {
                if (!inferredTypings.has(typingName)) {
                    inferredTypings.set(typingName, undefined); // TODO: GH#18217
                }
            }
            function addInferredTypings(typingNames, message) {
                if (log)
                    log(message + ": " + JSON.stringify(typingNames));
                ts.forEach(typingNames, addInferredTyping);
            }
            /**
             * Get the typing info from common package manager json files like package.json or bower.json
             */
            function getTypingNamesFromJson(jsonPath, filesToWatch) {
                if (!host.fileExists(jsonPath)) {
                    return;
                }
                filesToWatch.push(jsonPath);
                var jsonConfig = ts.readConfigFile(jsonPath, function (path) { return host.readFile(path); }).config;
                var jsonTypingNames = ts.flatMap([jsonConfig.dependencies, jsonConfig.devDependencies, jsonConfig.optionalDependencies, jsonConfig.peerDependencies], ts.getOwnKeys);
                addInferredTypings(jsonTypingNames, "Typing names in '" + jsonPath + "' dependencies");
            }
            /**
             * Infer typing names from given file names. For example, the file name "jquery-min.2.3.4.js"
             * should be inferred to the 'jquery' typing name; and "angular-route.1.2.3.js" should be inferred
             * to the 'angular-route' typing name.
             * @param fileNames are the names for source files in the project
             */
            function getTypingNamesFromSourceFileNames(fileNames) {
                var fromFileNames = ts.mapDefined(fileNames, function (j) {
                    if (!ts.hasJSFileExtension(j))
                        return undefined;
                    var inferredTypingName = ts.removeFileExtension(ts.getBaseFileName(j.toLowerCase()));
                    var cleanedTypingName = ts.removeMinAndVersionNumbers(inferredTypingName);
                    return safeList.get(cleanedTypingName);
                });
                if (fromFileNames.length) {
                    addInferredTypings(fromFileNames, "Inferred typings from file names");
                }
                var hasJsxFile = ts.some(fileNames, function (f) { return ts.fileExtensionIs(f, ".jsx" /* Jsx */); });
                if (hasJsxFile) {
                    if (log)
                        log("Inferred 'react' typings due to presence of '.jsx' extension");
                    addInferredTyping("react");
                }
            }
            /**
             * Infer typing names from packages folder (ex: node_module, bower_components)
             * @param packagesFolderPath is the path to the packages folder
             */
            function getTypingNamesFromPackagesFolder(packagesFolderPath, filesToWatch) {
                filesToWatch.push(packagesFolderPath);
                // Todo: add support for ModuleResolutionHost too
                if (!host.directoryExists(packagesFolderPath)) {
                    return;
                }
                // depth of 2, so we access `node_modules/foo` but not `node_modules/foo/bar`
                var fileNames = host.readDirectory(packagesFolderPath, [".json" /* Json */], /*excludes*/ undefined, /*includes*/ undefined, /*depth*/ 2);
                if (log)
                    log("Searching for typing names in " + packagesFolderPath + "; all files: " + JSON.stringify(fileNames));
                var packageNames = [];
                for (var _i = 0, fileNames_1 = fileNames; _i < fileNames_1.length; _i++) {
                    var fileName = fileNames_1[_i];
                    var normalizedFileName = ts.normalizePath(fileName);
                    var baseFileName = ts.getBaseFileName(normalizedFileName);
                    if (baseFileName !== "package.json" && baseFileName !== "bower.json") {
                        continue;
                    }
                    var result_1 = ts.readConfigFile(normalizedFileName, function (path) { return host.readFile(path); });
                    var packageJson = result_1.config;
                    // npm 3's package.json contains a "_requiredBy" field
                    // we should include all the top level module names for npm 2, and only module names whose
                    // "_requiredBy" field starts with "#" or equals "/" for npm 3.
                    if (baseFileName === "package.json" && packageJson._requiredBy &&
                        ts.filter(packageJson._requiredBy, function (r) { return r[0] === "#" || r === "/"; }).length === 0) {
                        continue;
                    }
                    // If the package has its own d.ts typings, those will take precedence. Otherwise the package name will be used
                    // to download d.ts files from DefinitelyTyped
                    if (!packageJson.name) {
                        continue;
                    }
                    var ownTypes = packageJson.types || packageJson.typings;
                    if (ownTypes) {
                        var absolutePath = ts.getNormalizedAbsolutePath(ownTypes, ts.getDirectoryPath(normalizedFileName));
                        if (log)
                            log("    Package '" + packageJson.name + "' provides its own types.");
                        inferredTypings.set(packageJson.name, absolutePath);
                    }
                    else {
                        packageNames.push(packageJson.name);
                    }
                }
                addInferredTypings(packageNames, "    Found package names");
            }
        }
        JsTyping.discoverTypings = discoverTypings;
        var NameValidationResult;
        (function (NameValidationResult) {
            NameValidationResult[NameValidationResult["Ok"] = 0] = "Ok";
            NameValidationResult[NameValidationResult["EmptyName"] = 1] = "EmptyName";
            NameValidationResult[NameValidationResult["NameTooLong"] = 2] = "NameTooLong";
            NameValidationResult[NameValidationResult["NameStartsWithDot"] = 3] = "NameStartsWithDot";
            NameValidationResult[NameValidationResult["NameStartsWithUnderscore"] = 4] = "NameStartsWithUnderscore";
            NameValidationResult[NameValidationResult["NameContainsNonURISafeCharacters"] = 5] = "NameContainsNonURISafeCharacters";
        })(NameValidationResult = JsTyping.NameValidationResult || (JsTyping.NameValidationResult = {}));
        var maxPackageNameLength = 214;
        /**
         * Validates package name using rules defined at https://docs.npmjs.com/files/package.json
         */
        function validatePackageName(packageName) {
            return validatePackageNameWorker(packageName, /*supportScopedPackage*/ true);
        }
        JsTyping.validatePackageName = validatePackageName;
        function validatePackageNameWorker(packageName, supportScopedPackage) {
            if (!packageName) {
                return 1 /* EmptyName */;
            }
            if (packageName.length > maxPackageNameLength) {
                return 2 /* NameTooLong */;
            }
            if (packageName.charCodeAt(0) === 46 /* dot */) {
                return 3 /* NameStartsWithDot */;
            }
            if (packageName.charCodeAt(0) === 95 /* _ */) {
                return 4 /* NameStartsWithUnderscore */;
            }
            // check if name is scope package like: starts with @ and has one '/' in the middle
            // scoped packages are not currently supported
            if (supportScopedPackage) {
                var matches = /^@([^/]+)\/([^/]+)$/.exec(packageName);
                if (matches) {
                    var scopeResult = validatePackageNameWorker(matches[1], /*supportScopedPackage*/ false);
                    if (scopeResult !== 0 /* Ok */) {
                        return { name: matches[1], isScopeName: true, result: scopeResult };
                    }
                    var packageResult = validatePackageNameWorker(matches[2], /*supportScopedPackage*/ false);
                    if (packageResult !== 0 /* Ok */) {
                        return { name: matches[2], isScopeName: false, result: packageResult };
                    }
                    return 0 /* Ok */;
                }
            }
            if (encodeURIComponent(packageName) !== packageName) {
                return 5 /* NameContainsNonURISafeCharacters */;
            }
            return 0 /* Ok */;
        }
        function renderPackageNameValidationFailure(result, typing) {
            return typeof result === "object" ?
                renderPackageNameValidationFailureWorker(typing, result.result, result.name, result.isScopeName) :
                renderPackageNameValidationFailureWorker(typing, result, typing, /*isScopeName*/ false);
        }
        JsTyping.renderPackageNameValidationFailure = renderPackageNameValidationFailure;
        function renderPackageNameValidationFailureWorker(typing, result, name, isScopeName) {
            var kind = isScopeName ? "Scope" : "Package";
            switch (result) {
                case 1 /* EmptyName */:
                    return "'" + typing + "':: " + kind + " name '" + name + "' cannot be empty";
                case 2 /* NameTooLong */:
                    return "'" + typing + "':: " + kind + " name '" + name + "' should be less than " + maxPackageNameLength + " characters";
                case 3 /* NameStartsWithDot */:
                    return "'" + typing + "':: " + kind + " name '" + name + "' cannot start with '.'";
                case 4 /* NameStartsWithUnderscore */:
                    return "'" + typing + "':: " + kind + " name '" + name + "' cannot start with '_'";
                case 5 /* NameContainsNonURISafeCharacters */:
                    return "'" + typing + "':: " + kind + " name '" + name + "' contains non URI safe characters";
                case 0 /* Ok */:
                    return ts.Debug.fail(); // Shouldn't have called this.
                default:
                    throw ts.Debug.assertNever(result);
            }
        }
    })(JsTyping = ts.JsTyping || (ts.JsTyping = {}));
})(ts || (ts = {}));
//# sourceMappingURL=jsTyping.js.map