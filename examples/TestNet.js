/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function getResourceList() {
    return ["blocks.png"];
}

function getDescription() {
    return "这个项目展示了XMLHttpRequest";
}

function createExample() {
    this.sendGetRequest();
    this.sendPostRequest();
}

function sendGetRequest() {
    var statusGetLabel = new ns_egret.TextField();
    statusGetLabel.text = "正在向httpbin.org发送GET请求";
    context.stage.addChild(statusGetLabel);
    statusGetLabel.x = 50;
    statusGetLabel.y = 10;

    var request = new ns_egret.URLRequest("http://httpbin.org/get", onLoadComplete, this);
    ns_egret.MainContext.instance.netContext.send(request);
    function onLoadComplete(xhr){
        var httpStatus = xhr.statusText;
        var response = xhr.responseText.substring(0, 50) + "...";
        var responseLabel = new ns_egret.TextField();
        responseLabel.text = "GET响应: \n" + response;
        context.stage.addChild(responseLabel);
        responseLabel.x = 50;
        responseLabel.y = 70;
        statusGetLabel.text = "获得GET响应! " + httpStatus;
    }
}

function sendPostRequest() {
    var statusPostLabel = new ns_egret.TextField();
    context.stage.addChild(statusPostLabel);
    statusPostLabel.x = 50;
    statusPostLabel.y = 40;
    statusPostLabel.text = "正在向httpbin.org发送POST请求";

    var request = new ns_egret.URLRequest("http://httpbin.org/post", onLoadComplete, this, ns_egret.NetContext.POST, "test=ok");
    ns_egret.MainContext.instance.netContext.send(request);

    function onLoadComplete(xhr){
        var httpStatus = xhr.statusText;
        var response = xhr.responseText.substring(0, 50) + "...";
        var responseLabel = new ns_egret.TextField();
        responseLabel.text = "POST响应:  \n" + response;
        context.stage.addChild(responseLabel);

        responseLabel.x = 50;
        responseLabel.y = 230;
        statusPostLabel.text = "获得POST响应! " + httpStatus;
    }
}