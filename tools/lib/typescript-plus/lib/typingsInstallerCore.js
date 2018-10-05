"use strict";
var ts;
(function (ts) {
    var server;
    (function (server) {
        var typingsInstaller;
        (function (typingsInstaller) {
            var nullLog = {
                isEnabled: function () { return false; },
                writeLine: ts.noop
            };
            function typingToFileName(cachePath, packageName, installTypingHost, log) {
                try {
                    var result = ts.resolveModuleName(packageName, ts.combinePaths(cachePath, "index.d.ts"), { moduleResolution: ts.ModuleResolutionKind.NodeJs }, installTypingHost);
                    return result.resolvedModule && result.resolvedModule.resolvedFileName;
                }
                catch (e) {
                    if (log.isEnabled()) {
                        log.writeLine("Failed to resolve " + packageName + " in folder '" + cachePath + "': " + e.message);
                    }
                    return undefined;
                }
            }
            /*@internal*/
            function installNpmPackages(npmPath, tsVersion, packageNames, install) {
                var hasError = false;
                for (var remaining = packageNames.length; remaining > 0;) {
                    var result = getNpmCommandForInstallation(npmPath, tsVersion, packageNames, remaining);
                    remaining = result.remaining;
                    hasError = install(result.command) || hasError;
                }
                return hasError;
            }
            typingsInstaller.installNpmPackages = installNpmPackages;
            /*@internal*/
            function getNpmCommandForInstallation(npmPath, tsVersion, packageNames, remaining) {
                var sliceStart = packageNames.length - remaining;
                var command, toSlice = remaining;
                while (true) {
                    command = npmPath + " install --ignore-scripts " + (toSlice === packageNames.length ? packageNames : packageNames.slice(sliceStart, sliceStart + toSlice)).join(" ") + " --save-dev --user-agent=\"typesInstaller/" + tsVersion + "\"";
                    if (command.length < 8000) {
                        break;
                    }
                    toSlice = toSlice - Math.floor(toSlice / 2);
                }
                return { command: command, remaining: remaining - toSlice };
            }
            typingsInstaller.getNpmCommandForInstallation = getNpmCommandForInstallation;
            function endsWith(str, suffix, caseSensitive) {
                var expectedPos = str.length - suffix.length;
                return expectedPos >= 0 &&
                    (str.indexOf(suffix, expectedPos) === expectedPos ||
                        (!caseSensitive && ts.compareStringsCaseInsensitive(str.substr(expectedPos), suffix) === 0 /* EqualTo */));
            }
            function isPackageOrBowerJson(fileName, caseSensitive) {
                return endsWith(fileName, "/package.json", caseSensitive) || endsWith(fileName, "/bower.json", caseSensitive);
            }
            function sameFiles(a, b, caseSensitive) {
                return a === b || (!caseSensitive && ts.compareStringsCaseInsensitive(a, b) === 0 /* EqualTo */);
            }
            var ProjectWatcherType;
            (function (ProjectWatcherType) {
                ProjectWatcherType["FileWatcher"] = "FileWatcher";
                ProjectWatcherType["DirectoryWatcher"] = "DirectoryWatcher";
            })(ProjectWatcherType || (ProjectWatcherType = {}));
            var TypingsInstaller = /** @class */ (function () {
                function TypingsInstaller(installTypingHost, globalCachePath, safeListPath, typesMapLocation, throttleLimit, log) {
                    if (log === void 0) { log = nullLog; }
                    this.installTypingHost = installTypingHost;
                    this.globalCachePath = globalCachePath;
                    this.safeListPath = safeListPath;
                    this.typesMapLocation = typesMapLocation;
                    this.throttleLimit = throttleLimit;
                    this.log = log;
                    this.packageNameToTypingLocation = ts.createMap();
                    this.missingTypingsSet = ts.createMap();
                    this.knownCachesSet = ts.createMap();
                    this.projectWatchers = ts.createMap();
                    this.pendingRunRequests = [];
                    this.installRunCount = 1;
                    this.inFlightRequestCount = 0;
                    this.latestDistTag = "latest";
                    this.toCanonicalFileName = ts.createGetCanonicalFileName(installTypingHost.useCaseSensitiveFileNames);
                    this.globalCachePackageJsonPath = ts.combinePaths(globalCachePath, "package.json");
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Global cache location '" + globalCachePath + "', safe file path '" + safeListPath + "', types map path " + typesMapLocation);
                    }
                    this.processCacheLocation(this.globalCachePath);
                }
                TypingsInstaller.prototype.closeProject = function (req) {
                    this.closeWatchers(req.projectName);
                };
                TypingsInstaller.prototype.closeWatchers = function (projectName) {
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Closing file watchers for project '" + projectName + "'");
                    }
                    var watchers = this.projectWatchers.get(projectName);
                    if (!watchers) {
                        if (this.log.isEnabled()) {
                            this.log.writeLine("No watchers are registered for project '" + projectName + "'");
                        }
                        return;
                    }
                    ts.clearMap(watchers, ts.closeFileWatcher);
                    this.projectWatchers.delete(projectName);
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Closing file watchers for project '" + projectName + "' - done.");
                    }
                };
                TypingsInstaller.prototype.install = function (req) {
                    var _this = this;
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Got install request " + JSON.stringify(req));
                    }
                    // load existing typing information from the cache
                    if (req.cachePath) {
                        if (this.log.isEnabled()) {
                            this.log.writeLine("Request specifies cache path '" + req.cachePath + "', loading cached information...");
                        }
                        this.processCacheLocation(req.cachePath);
                    }
                    if (this.safeList === undefined) {
                        this.initializeSafeList();
                    }
                    var discoverTypingsResult = ts.JsTyping.discoverTypings(this.installTypingHost, this.log.isEnabled() ? (function (s) { return _this.log.writeLine(s); }) : undefined, req.fileNames, req.projectRootPath, this.safeList, this.packageNameToTypingLocation, req.typeAcquisition, req.unresolvedImports, this.typesRegistry);
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Finished typings discovery: " + JSON.stringify(discoverTypingsResult));
                    }
                    // start watching files
                    this.watchFiles(req.projectName, discoverTypingsResult.filesToWatch, req.projectRootPath);
                    // install typings
                    if (discoverTypingsResult.newTypingNames.length) {
                        this.installTypings(req, req.cachePath || this.globalCachePath, discoverTypingsResult.cachedTypingPaths, discoverTypingsResult.newTypingNames);
                    }
                    else {
                        this.sendResponse(this.createSetTypings(req, discoverTypingsResult.cachedTypingPaths));
                        if (this.log.isEnabled()) {
                            this.log.writeLine("No new typings were requested as a result of typings discovery");
                        }
                    }
                };
                TypingsInstaller.prototype.initializeSafeList = function () {
                    // Prefer the safe list from the types map if it exists
                    if (this.typesMapLocation) {
                        var safeListFromMap = ts.JsTyping.loadTypesMap(this.installTypingHost, this.typesMapLocation);
                        if (safeListFromMap) {
                            this.log.writeLine("Loaded safelist from types map file '" + this.typesMapLocation + "'");
                            this.safeList = safeListFromMap;
                            return;
                        }
                        this.log.writeLine("Failed to load safelist from types map file '" + this.typesMapLocation + "'");
                    }
                    this.safeList = ts.JsTyping.loadSafeList(this.installTypingHost, this.safeListPath);
                };
                TypingsInstaller.prototype.processCacheLocation = function (cacheLocation) {
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Processing cache location '" + cacheLocation + "'");
                    }
                    if (this.knownCachesSet.has(cacheLocation)) {
                        if (this.log.isEnabled()) {
                            this.log.writeLine("Cache location was already processed...");
                        }
                        return;
                    }
                    var packageJson = ts.combinePaths(cacheLocation, "package.json");
                    var packageLockJson = ts.combinePaths(cacheLocation, "package-lock.json");
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Trying to find '" + packageJson + "'...");
                    }
                    if (this.installTypingHost.fileExists(packageJson) && this.installTypingHost.fileExists(packageLockJson)) {
                        var npmConfig = JSON.parse(this.installTypingHost.readFile(packageJson)); // TODO: GH#18217
                        var npmLock = JSON.parse(this.installTypingHost.readFile(packageLockJson)); // TODO: GH#18217
                        if (this.log.isEnabled()) {
                            this.log.writeLine("Loaded content of '" + packageJson + "': " + JSON.stringify(npmConfig));
                            this.log.writeLine("Loaded content of '" + packageLockJson + "'");
                        }
                        if (npmConfig.devDependencies && npmLock.dependencies) {
                            for (var key in npmConfig.devDependencies) {
                                if (!ts.hasProperty(npmLock.dependencies, key)) {
                                    // if package in package.json but not package-lock.json, skip adding to cache so it is reinstalled on next use
                                    continue;
                                }
                                // key is @types/<package name>
                                var packageName = ts.getBaseFileName(key);
                                if (!packageName) {
                                    continue;
                                }
                                var typingFile = typingToFileName(cacheLocation, packageName, this.installTypingHost, this.log);
                                if (!typingFile) {
                                    this.missingTypingsSet.set(packageName, true);
                                    continue;
                                }
                                var existingTypingFile = this.packageNameToTypingLocation.get(packageName);
                                if (existingTypingFile) {
                                    if (existingTypingFile.typingLocation === typingFile) {
                                        continue;
                                    }
                                    if (this.log.isEnabled()) {
                                        this.log.writeLine("New typing for package " + packageName + " from '" + typingFile + "' conflicts with existing typing file '" + existingTypingFile + "'");
                                    }
                                }
                                if (this.log.isEnabled()) {
                                    this.log.writeLine("Adding entry into typings cache: '" + packageName + "' => '" + typingFile + "'");
                                }
                                var info = ts.getProperty(npmLock.dependencies, key);
                                var version_1 = info && info.version;
                                if (!version_1) {
                                    continue;
                                }
                                var newTyping = { typingLocation: typingFile, version: new ts.Version(version_1) };
                                this.packageNameToTypingLocation.set(packageName, newTyping);
                            }
                        }
                    }
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Finished processing cache location '" + cacheLocation + "'");
                    }
                    this.knownCachesSet.set(cacheLocation, true);
                };
                TypingsInstaller.prototype.filterTypings = function (typingsToInstall) {
                    var _this = this;
                    return typingsToInstall.filter(function (typing) {
                        if (_this.missingTypingsSet.get(typing)) {
                            if (_this.log.isEnabled())
                                _this.log.writeLine("'" + typing + "' is in missingTypingsSet - skipping...");
                            return false;
                        }
                        var validationResult = ts.JsTyping.validatePackageName(typing);
                        if (validationResult !== 0 /* Ok */) {
                            // add typing name to missing set so we won't process it again
                            _this.missingTypingsSet.set(typing, true);
                            if (_this.log.isEnabled())
                                _this.log.writeLine(ts.JsTyping.renderPackageNameValidationFailure(validationResult, typing));
                            return false;
                        }
                        if (!_this.typesRegistry.has(typing)) {
                            if (_this.log.isEnabled())
                                _this.log.writeLine("Entry for package '" + typing + "' does not exist in local types registry - skipping...");
                            return false;
                        }
                        if (_this.packageNameToTypingLocation.get(typing) && ts.JsTyping.isTypingUpToDate(_this.packageNameToTypingLocation.get(typing), _this.typesRegistry.get(typing))) {
                            if (_this.log.isEnabled())
                                _this.log.writeLine("'" + typing + "' already has an up-to-date typing - skipping...");
                            return false;
                        }
                        return true;
                    });
                };
                TypingsInstaller.prototype.ensurePackageDirectoryExists = function (directory) {
                    var npmConfigPath = ts.combinePaths(directory, "package.json");
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Npm config file: " + npmConfigPath);
                    }
                    if (!this.installTypingHost.fileExists(npmConfigPath)) {
                        if (this.log.isEnabled()) {
                            this.log.writeLine("Npm config file: '" + npmConfigPath + "' is missing, creating new one...");
                        }
                        this.ensureDirectoryExists(directory, this.installTypingHost);
                        this.installTypingHost.writeFile(npmConfigPath, '{ "private": true }');
                    }
                };
                TypingsInstaller.prototype.installTypings = function (req, cachePath, currentlyCachedTypings, typingsToInstall) {
                    var _this = this;
                    if (this.log.isEnabled()) {
                        this.log.writeLine("Installing typings " + JSON.stringify(typingsToInstall));
                    }
                    var filteredTypings = this.filterTypings(typingsToInstall);
                    if (filteredTypings.length === 0) {
                        if (this.log.isEnabled()) {
                            this.log.writeLine("All typings are known to be missing or invalid - no need to install more typings");
                        }
                        this.sendResponse(this.createSetTypings(req, currentlyCachedTypings));
                        return;
                    }
                    this.ensurePackageDirectoryExists(cachePath);
                    var requestId = this.installRunCount;
                    this.installRunCount++;
                    // send progress event
                    this.sendResponse({
                        kind: server.EventBeginInstallTypes,
                        eventId: requestId,
                        typingsInstallerVersion: ts.version,
                        projectName: req.projectName
                    });
                    var scopedTypings = filteredTypings.map(typingsName);
                    this.installTypingsAsync(requestId, scopedTypings, cachePath, function (ok) {
                        try {
                            if (!ok) {
                                if (_this.log.isEnabled()) {
                                    _this.log.writeLine("install request failed, marking packages as missing to prevent repeated requests: " + JSON.stringify(filteredTypings));
                                }
                                for (var _i = 0, filteredTypings_1 = filteredTypings; _i < filteredTypings_1.length; _i++) {
                                    var typing = filteredTypings_1[_i];
                                    _this.missingTypingsSet.set(typing, true);
                                }
                                return;
                            }
                            // TODO: watch project directory
                            if (_this.log.isEnabled()) {
                                _this.log.writeLine("Installed typings " + JSON.stringify(scopedTypings));
                            }
                            var installedTypingFiles = [];
                            for (var _a = 0, filteredTypings_2 = filteredTypings; _a < filteredTypings_2.length; _a++) {
                                var packageName = filteredTypings_2[_a];
                                var typingFile = typingToFileName(cachePath, packageName, _this.installTypingHost, _this.log);
                                if (!typingFile) {
                                    _this.missingTypingsSet.set(packageName, true);
                                    continue;
                                }
                                // packageName is guaranteed to exist in typesRegistry by filterTypings
                                var distTags = _this.typesRegistry.get(packageName);
                                var newVersion = new ts.Version(distTags["ts" + ts.versionMajorMinor] || distTags[_this.latestDistTag]);
                                var newTyping = { typingLocation: typingFile, version: newVersion };
                                _this.packageNameToTypingLocation.set(packageName, newTyping);
                                installedTypingFiles.push(typingFile);
                            }
                            if (_this.log.isEnabled()) {
                                _this.log.writeLine("Installed typing files " + JSON.stringify(installedTypingFiles));
                            }
                            _this.sendResponse(_this.createSetTypings(req, currentlyCachedTypings.concat(installedTypingFiles)));
                        }
                        finally {
                            var response = {
                                kind: server.EventEndInstallTypes,
                                eventId: requestId,
                                projectName: req.projectName,
                                packagesToInstall: scopedTypings,
                                installSuccess: ok,
                                typingsInstallerVersion: ts.version // tslint:disable-line no-unnecessary-qualifier (qualified explicitly to prevent occasional shadowing)
                            };
                            _this.sendResponse(response);
                        }
                    });
                };
                TypingsInstaller.prototype.ensureDirectoryExists = function (directory, host) {
                    var directoryName = ts.getDirectoryPath(directory);
                    if (!host.directoryExists(directoryName)) {
                        this.ensureDirectoryExists(directoryName, host);
                    }
                    if (!host.directoryExists(directory)) {
                        host.createDirectory(directory);
                    }
                };
                TypingsInstaller.prototype.watchFiles = function (projectName, files, projectRootPath) {
                    var _this = this;
                    if (!files.length) {
                        // shut down existing watchers
                        this.closeWatchers(projectName);
                        return;
                    }
                    var watchers = this.projectWatchers.get(projectName);
                    var toRemove = ts.createMap();
                    if (!watchers) {
                        watchers = ts.createMap();
                        this.projectWatchers.set(projectName, watchers);
                    }
                    else {
                        ts.copyEntries(watchers, toRemove);
                    }
                    // handler should be invoked once for the entire set of files since it will trigger full rediscovery of typings
                    watchers.isInvoked = false;
                    var isLoggingEnabled = this.log.isEnabled();
                    var createProjectWatcher = function (path, projectWatcherType) {
                        var canonicalPath = _this.toCanonicalFileName(path);
                        toRemove.delete(canonicalPath);
                        if (watchers.has(canonicalPath)) {
                            return;
                        }
                        if (isLoggingEnabled) {
                            _this.log.writeLine(projectWatcherType + ":: Added:: WatchInfo: " + path);
                        }
                        var watcher = projectWatcherType === "FileWatcher" /* FileWatcher */ ?
                            _this.installTypingHost.watchFile(path, function (f, eventKind) {
                                if (isLoggingEnabled) {
                                    _this.log.writeLine("FileWatcher:: Triggered with " + f + " eventKind: " + ts.FileWatcherEventKind[eventKind] + ":: WatchInfo: " + path + ":: handler is already invoked '" + watchers.isInvoked + "'");
                                }
                                if (!watchers.isInvoked) {
                                    watchers.isInvoked = true;
                                    _this.sendResponse({ projectName: projectName, kind: server.ActionInvalidate });
                                }
                            }, /*pollingInterval*/ 2000) :
                            _this.installTypingHost.watchDirectory(path, function (f) {
                                if (isLoggingEnabled) {
                                    _this.log.writeLine("DirectoryWatcher:: Triggered with " + f + " :: WatchInfo: " + path + " recursive :: handler is already invoked '" + watchers.isInvoked + "'");
                                }
                                if (watchers.isInvoked || !ts.fileExtensionIs(f, ".json" /* Json */)) {
                                    return;
                                }
                                if (isPackageOrBowerJson(f, _this.installTypingHost.useCaseSensitiveFileNames) &&
                                    !sameFiles(f, _this.globalCachePackageJsonPath, _this.installTypingHost.useCaseSensitiveFileNames)) {
                                    watchers.isInvoked = true;
                                    _this.sendResponse({ projectName: projectName, kind: server.ActionInvalidate });
                                }
                            }, /*recursive*/ true);
                        watchers.set(canonicalPath, isLoggingEnabled ? {
                            close: function () {
                                _this.log.writeLine(projectWatcherType + ":: Closed:: WatchInfo: " + path);
                                watcher.close();
                            }
                        } : watcher);
                    };
                    // Create watches from list of files
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var file = files_1[_i];
                        if (file.endsWith("/package.json") || file.endsWith("/bower.json")) {
                            // package.json or bower.json exists, watch the file to detect changes and update typings
                            createProjectWatcher(file, "FileWatcher" /* FileWatcher */);
                            continue;
                        }
                        // path in projectRoot, watch project root
                        if (ts.containsPath(projectRootPath, file, projectRootPath, !this.installTypingHost.useCaseSensitiveFileNames)) {
                            var subDirectory = file.indexOf(ts.directorySeparator, projectRootPath.length + 1);
                            if (subDirectory !== -1) {
                                // Watch subDirectory
                                createProjectWatcher(file.substr(0, subDirectory), "DirectoryWatcher" /* DirectoryWatcher */);
                            }
                            else {
                                // Watch the directory itself
                                createProjectWatcher(file, "DirectoryWatcher" /* DirectoryWatcher */);
                            }
                            continue;
                        }
                        // path in global cache, watch global cache
                        if (ts.containsPath(this.globalCachePath, file, projectRootPath, !this.installTypingHost.useCaseSensitiveFileNames)) {
                            createProjectWatcher(this.globalCachePath, "DirectoryWatcher" /* DirectoryWatcher */);
                            continue;
                        }
                        // watch node_modules or bower_components
                        createProjectWatcher(file, "DirectoryWatcher" /* DirectoryWatcher */);
                    }
                    // Remove unused watches
                    toRemove.forEach(function (watch, path) {
                        watch.close();
                        watchers.delete(path);
                    });
                };
                TypingsInstaller.prototype.createSetTypings = function (request, typings) {
                    return {
                        projectName: request.projectName,
                        typeAcquisition: request.typeAcquisition,
                        compilerOptions: request.compilerOptions,
                        typings: typings,
                        unresolvedImports: request.unresolvedImports,
                        kind: server.ActionSet
                    };
                };
                TypingsInstaller.prototype.installTypingsAsync = function (requestId, packageNames, cwd, onRequestCompleted) {
                    this.pendingRunRequests.unshift({ requestId: requestId, packageNames: packageNames, cwd: cwd, onRequestCompleted: onRequestCompleted });
                    this.executeWithThrottling();
                };
                TypingsInstaller.prototype.executeWithThrottling = function () {
                    var _this = this;
                    var _loop_1 = function () {
                        this_1.inFlightRequestCount++;
                        var request = this_1.pendingRunRequests.pop();
                        this_1.installWorker(request.requestId, request.packageNames, request.cwd, function (ok) {
                            _this.inFlightRequestCount--;
                            request.onRequestCompleted(ok);
                            _this.executeWithThrottling();
                        });
                    };
                    var this_1 = this;
                    while (this.inFlightRequestCount < this.throttleLimit && this.pendingRunRequests.length) {
                        _loop_1();
                    }
                };
                return TypingsInstaller;
            }());
            typingsInstaller.TypingsInstaller = TypingsInstaller;
            /* @internal */
            function typingsName(packageName) {
                return "@types/" + packageName + "@ts" + ts.versionMajorMinor;
            }
            typingsInstaller.typingsName = typingsName;
        })(typingsInstaller = server.typingsInstaller || (server.typingsInstaller = {}));
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
//# sourceMappingURL=typingsInstallerCore.js.map