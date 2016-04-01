/// <reference path="../lib/types.d.ts" />


global.TotalJS = { Controller: {} };

import http = require('http');
import events = require('events');
import utils = require('../lib/utils');
import file = require('../lib/FileUtil');
import cp = require('child_process');
import Default = require('./controllers/default');
global.lark = global.lark || {};


export function startServer(options: egret.ToolArgs, startupUrl?:string) {

    var total: TotalJS.Framework = require('../lib/totaljs/');
    total.setRoot(__dirname);
    options.port = options.port || 3000;
    Default.UserProjectPath = options.projectDir;
    options.projectDir = options.projectDir || '/public/';


    egret.server = {
        options: options,
        console: new ServerConsole(),
        IPs: getLocalIPAddress()
    };

    var serverTmp = '~' + options.getTmpDir() + 'server/';

    framework.config['directory-temp'] = serverTmp;
    framework.config['directory-public'] = serverTmp;
    framework.config['directory-views'] = '~' + __dirname + '/views/';
    framework.config['directory-controllers'] = '~' + __dirname + '/controllers/';
    framework.config['default-websocket-encodedecode'] = false;
    framework.config['allow-compile-js'] = false;
    framework.config['allow-compile-html'] = false;
    framework.config['allow-compile-css'] = false;
    try {
        total.http('debug', { port: options.port, ip: '0.0.0.0' });
        if (!options.serverOnly)
            utils.open(startupUrl || options.manageUrl);
    }
    catch (e) {
        if (e.toString().indexOf('listen EADDRINUSE') !== -1) {
            if (!options.serverOnly)
                utils.open(startupUrl || options.manageUrl);
        }
    }
}


class ServerConsole extends events.EventEmitter {
    constructor() {
        super();
        this.attach();
    }
    attach() {

        if (console['override']) 
            return;


        console['override'] = true;
        ["log", "warn", "error"].forEach((method)=> {
            var oldMethod = console[method].bind(console);
            console['old_' + method] = oldMethod;
            console[method] = (...params: string[]) => {
                oldMethod.apply(console, params);
                if (!params || !params.length)
                    return;
                this.log(params);
            };
        });
    }

    dettach() {

        ["log", "warn", "error"].forEach(function (method) {
            console[method] = console['old_' + method];
        });
        console['override'] = false;
    }

    log(params:string[]) {
        this.emit('log', params);
    }
}



function getLocalIPAddress(): string[] {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ips = [ 'localhost', '127.0.0.1'];
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            ips.push(iface.address);
        });
    });

    return ips;
}