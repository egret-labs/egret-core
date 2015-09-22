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
        var fileChanges = [];
        currentFiles.forEach(function (path, index) {
            var lastState = lastStates[path];
            if (lastState) {
                var currentState = currentStates[path];
                if (currentState.mtime != lastState.mtime || currentState.size != lastState.size) {
                    fileChanges.push({
                        fileName: path,
                        type: "modified"
                    });
                }
            }
            else {
                fileChanges.push({
                    fileName: path,
                    type: "added"
                });
            }
        });
        lastFiles.forEach(function (path) {
            if (!currentStates[path]) {
                fileChanges.push({
                    fileName: path,
                    type: "removed"
                });
            }
        });
        this.lastStates = currentStates;
        console.log("扫描到的文件变化列表:");
        console.log(fileChanges);
        return fileChanges;
    };
    return DirectoryState;
})();
exports.DirectoryState = DirectoryState;
function updateMTime(filePath, states) {
    if (states === void 0) { states = {}; }
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
                mtime: stat.mtime.getTime(),
                size: stat.size
            };
        }
    }
    return states;
}

//# sourceMappingURL=../lib/DirectoryState.js.map