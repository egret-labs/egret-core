/// <reference path="../../lib/types.d.ts" />

import url = require('url');
import file = require('../../lib/FileUtil');
import Entry = require('../../Entry');
import CompileOptions = require('../../parser/CompileOptions');

var self = this;
var projs: any = {};
var projId = 0;
var tempUrlMark = "_/";

var exportObject = {
    WingTempProjDir: '',
    install: install
};

export = exportObject;


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
    var paths = uri.pathname.split(/[\/]/).filter(f=> !!f && f != "_");
    var proj = paths.shift();
    var filepath = paths.join('/');
    var projectPath = projs[proj].path;

    var wingTempPath = utils.combine('~', exportObject.WingTempProjDir, filepath);
    if (file.exists(wingTempPath))
        return wingTempPath;

    var fullpath = utils.combine('~', projectPath, filepath);
    if(file.exists(fullpath))
        return fullpath;

    return fullpath;
}