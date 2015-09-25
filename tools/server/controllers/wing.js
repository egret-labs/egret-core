/// <reference path="../../lib/types.d.ts" />
var url = require('url');
var file = require('../../lib/FileUtil');
var self = this;
var projs = {};
var projId = 0;
var tempUrlMark = "_/";
var exportObject = {
    WingTempProjDir: '',
    install: install
};
function install() {
    framework.route(tempUrlMark + 'add/', addProject);
    framework.file('static files', projectFiles);
}
function addProject() {
    var uri = url.parse(this.req.url, true);
    projId++;
    var projKey = 'proj' + projId;
    projs[projKey] = {
        path: uri.query['path']
    };
    this.res.send(200, tempUrlMark + projKey + "/");
}
function projectFiles(req, res, isValidation) {
    if (isValidation) {
        if (req.url.indexOf(tempUrlMark) <= 0)
            return false;
        var path = getUserProjectContentFullName(req);
        return file.exists(path);
    }
    var path = getUserProjectContentFullName(req);
    framework.responseFile(req, res, path);
}
function getUserProjectContentFullName(req) {
    var uri = url.parse(req.url);
    var paths = uri.pathname.split(/[\/]/).filter(function (f) { return !!f && f != "_"; });
    var proj = paths.shift();
    var filepath = paths.join('/');
    var projectPath = projs[proj].path;
    var wingTempPath = utils.combine('~', exportObject.WingTempProjDir, filepath);
    if (file.exists(wingTempPath))
        return wingTempPath;
    var fullpath = utils.combine('~', projectPath, filepath);
    if (file.exists(fullpath))
        return fullpath;
    return fullpath;
}
module.exports = exportObject;

//# sourceMappingURL=../../server/controllers/wing.js.map