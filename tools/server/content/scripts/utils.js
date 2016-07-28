/// <reference path="libs/angular.d.ts" />
/// <reference path="../../../lib/types.d.ts" />
var egret;
(function (egret) {
    egret.app = angular.module('lark', []);
    var server;
    (function (server) {
        server.options = null;
    })(server = egret.server || (egret.server = {}));
    var portal;
    (function (portal) {
        function get(url, data, callback, error) {
            var http = new Http().request({
                url: url,
                data: data,
                success: callback,
                error: error
            });
        }
        portal.get = get;
        function post(url, data, callback, error) {
            var http = new Http().request({
                url: url,
                method: 'POST',
                data: data,
                success: callback,
                error: error
            });
        }
        portal.post = post;
        var Http = (function () {
            function Http() {
            }
            Http.prototype.request = function (options) {
                //todo: post
                var request = new XMLHttpRequest();
                var data = this.encode(options.data);
                var url = options.url;
                var isget = options.method && options.method.toLowerCase() == 'get';
                if (isget)
                    url += '?' + data;
                request.open(options.method || "GET", options.url, true);
                request.responseType = options.contentType;
                var success = options.success;
                var error = options.error;
                if (success)
                    request.onload = function (e) { return success(request.response); };
                if (error)
                    request.onerror = function (e) { return error(e['error']); };
                var postdata = isget ? null : data;
                request.send(postdata);
            };
            /**
             * 以 MIME 内容编码格式 application/x-www-form-urlencoded 返回包含所有可枚举变量的字符串。
             * @method egret.URLVariables#toString
             */
            Http.prototype.encode = function (variables) {
                if (!variables) {
                    return "";
                }
                var variables = variables;
                var stringArray = [];
                for (var key in variables) {
                    stringArray.push(this.encodeValue(key, variables[key]));
                }
                return stringArray.join("&");
            };
            Http.prototype.encodeValue = function (key, value) {
                if (value instanceof Array) {
                    return this.encodeArray(key, value);
                }
                else {
                    return encodeURIComponent(key) + "=" + encodeURIComponent(value);
                }
            };
            Http.prototype.encodeArray = function (key, value) {
                if (!key)
                    return "";
                if (value.length == 0) {
                    return encodeURIComponent(key) + "=";
                }
                return value.map(function (v) { return encodeURIComponent(key) + "=" + encodeURIComponent(v); }).join("&");
            };
            return Http;
        })();
        portal.Http = Http;
    })(portal = egret.portal || (egret.portal = {}));
})(egret || (egret = {}));

//# sourceMappingURL=../../../server/content/scripts/utils.js.map