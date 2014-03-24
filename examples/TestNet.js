/**
 *Copyright (c) 2013-2014 egret team
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
    ns_egret.NetContext.getInstance().send(request);
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
    ns_egret.NetContext.getInstance().send(request);

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