/// <reference path="libs/angular.d.ts" />
/// <reference path="../../../lib/types.d.ts" />


module egret {
    export var app:ng.IModule = angular.module('lark', []);

    export module server {
        export var options:ToolArgs = null;
    }

    export module portal {
        export interface IHttpRequestOptions {
            method?: string;
            url: string;
            data?: any;
            success?: (response: any) => void;
            error?: (response: any) => void;
            contentType?: string;
        }


        export function get(url, data?, callback?, error?) {
            var http = new Http().request({
                url: url,
                data: data,
                success: callback,
                error: error
            });
        }
        export function post(url, data, callback, error) {
            var http = new Http().request({
                url: url,
                method: 'POST',
                data: data,
                success: callback,
                error: error
            });
        }
        export class Http {

            public request(options: IHttpRequestOptions) {
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
                    request.onload = e=> success(request.response);
                if (error)
                    request.onerror = e => error(e['error']);

                var postdata = isget ? null : data;

                request.send(postdata);
            }

            /**
             * 以 MIME 内容编码格式 application/x-www-form-urlencoded 返回包含所有可枚举变量的字符串。
             * @method egret.URLVariables#toString
             */
            public encode(variables): string {
                if (!variables) {
                    return "";
                }
                var variables: any = variables;
                var stringArray: string[] = [];
                for (var key in variables) {
                    stringArray.push(this.encodeValue(key, variables[key]));
                }
                return stringArray.join("&");
            }

            private encodeValue(key: string, value: any) {
                if (value instanceof Array) {
                    return this.encodeArray(key, value);
                }
                else {
                    return encodeURIComponent(key) + "=" + encodeURIComponent(value);
                }
            }

            private encodeArray(key: string, value: string[]) {
                if (!key)
                    return "";
                if (value.length == 0) {
                    return encodeURIComponent(key) + "=";
                }
                return value.map(v=> encodeURIComponent(key) + "=" + encodeURIComponent(v)).join("&");
            }

        }
    }

}