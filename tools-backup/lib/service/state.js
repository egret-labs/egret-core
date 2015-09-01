var FS = require('fs');
var file = require('../lib/FileUtil');
var DirectoryState = (function () {
    function DirectoryState() {
    }
    DirectoryState.prototype.init = function () {
        this.lastStates = updateMTime(this.path);
    };
    DirectoryState.prototype.checkChanges = function () {
        var lastStates = this.lastStates;
        var currentStates = updateMTime(this.path);
        var lastFiles = Object.keys(lastStates);
        var currentFiles = Object.keys(currentStates);
        var fileChanged = [];
        var fileAdded = [];
        var fileRemoved = [];
        currentFiles.forEach(function (path, index) {
            var lastState = lastStates[path];
            if (lastState) {
                var currentState = currentStates[path];
                if (currentState.mtime > lastState.mtime)
                    fileChanged.push(path);
            }
            else {
                fileAdded.push(path);
            }
        });
        lastFiles.forEach(function (path) {
            if (!currentStates[path])
                fileRemoved.push(path);
        });
        this.lastStates = currentStates;
        return {
            added: fileAdded,
            removed: fileRemoved,
            modified: fileChanged
        };
    };
    return DirectoryState;
})();
exports.DirectoryState = DirectoryState;
function updateMTime(filePath, states) {
    if (states === void 0) { states = {}; }
    //console.log(filePath);
    var files = FS.readdirSync(filePath);
    var length = files.length;
    for (var i = 0; i < length; i++) {
        if (files[i].charAt(0) == ".") {
            continue;
        }
        if (files[i] == "bin-debug") {
            continue;
        }
        var path = file.joinPath(filePath, files[i]);
        var stat = FS.statSync(path);
        if (stat.isDirectory()) {
            updateMTime(path, states);
        }
        else {
            states[path] = {
                mtime: stat.mtime.getTime()
            };
        }
    }
    return states;
}
