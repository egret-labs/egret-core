import FS = require('fs');
import file = require('../lib/FileUtil');




export class DirectoryState {
    path: string;
    lastStates: Map<FileState>;
    init() {
        this.lastStates = updateMTime(this.path);
    }

    checkChanges():FileChanges {
        var lastStates = this.lastStates;
        var currentStates = updateMTime(this.path);
        var lastFiles = Object.keys(lastStates);
        var currentFiles = Object.keys(currentStates);

        var fileChanged: string[] = [];
        var fileAdded: string[] = [];
        var fileRemoved: string[] = [];
        currentFiles.forEach((path, index) => {
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

        lastFiles.forEach(path=> {
            if (!currentStates[path])
                fileRemoved.push(path);
        });
        this.lastStates = currentStates;
        return {
            added: fileAdded,
            removed: fileRemoved,
            modified: fileChanged
        };
    }
}






interface Map<T> {
    [key:string]:T
}

interface FileState {
    mtime: number;
}

export interface FileChanges {
    added: string[];
    removed: string[];
    modified: string[];
}

function updateMTime(filePath: string, states: Map<FileState> = {}) {
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
