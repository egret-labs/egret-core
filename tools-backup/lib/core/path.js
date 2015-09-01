/**
 * Created by yjtx on 15-6-8.
 */

var path = require("path");

exports.join = function() {
    return changeToUnixpath(path.join.apply(null, arguments));
};

exports.relative = function() {
    return changeToUnixpath(path.relative.apply(null, arguments));
};


exports.resolve = function() {
    return changeToUnixpath(path.resolve.apply(null, arguments));
};


exports.normalize = function() {
    return changeToUnixpath(path.normalize.apply(null, arguments));
};


exports.dirname = function() {
    return changeToUnixpath(path.dirname.apply(null, arguments));
};


exports.basename = function() {
    return changeToUnixpath(path.basename.apply(null, arguments));
};


exports.extname = function() {
    return changeToUnixpath(path.extname.apply(null, arguments));
};

exports.existsSync = function() {
    return path.existsSync.apply(null, arguments);
};


function changeToUnixpath (path) {
    return path.replace(/\\\\|\\/g, "/");
}