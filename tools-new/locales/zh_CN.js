//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
/// <reference path="../lib/types.d.ts" />
var egret;
(function (egret) {
    global["$locale_strings"] = global["$locale_strings"] || {};
    var locale_strings = global["$locale_strings"];
    locale_strings[10001] = "编译参数 {0} 需要一个参数";
    locale_strings[10002] = "未知的编译参数 {0}";
    locale_strings[10003] = "编译错误，错误码是: {0}";
    locale_strings[10004] = "没有指定输出文件的文件名";
    locale_strings[10006] = "manifest.json 生成成功";
    locale_strings[10008] = "类或接口名冲突：‘{0}’同时存在于以下两个文件内：\n{1}\n{2}";
    locale_strings[10009] = "Egret manifest.json 文件不是标准的json文件请尝试重新安装Egret";
    locale_strings[10010] = "自动编译正在监视项目文件...";
    locale_strings[10011] = "自动编译完成.";
    locale_strings[10012] = "如果您没有设置 IDE 保存自动编译，可以添加参数 -a 来启动自动编译";
    locale_strings[10013] = "Egret 服务器已经启动, 您可以通过以下URL访问: {0}";
    locale_strings[10014] = "自动编译失败，请参考下面的错误信息：";
    locale_strings[10015] = "\"{0}\" 不是一个有效的 Egret 项目目录";
    locale_strings[10016] = "如果浏览器没有启动，请手动打开URL: {0}";
    locale_strings[10017] = "项目创建成功，您可以执行 egret run 来运行刚刚创建的应用";
    locale_strings[10018] = "试图进行文件加载顺序排序时发现循环依赖，比如类的 static 属性直接实例化了一个继承自当前类的类，"
        + "或者当前文件中有立即执行的代码使用了依赖于当前文件的类。";
    locale_strings[10019] = "没有找到打包 App 所需要的项目文件，这些文件没有包含在 Github 中，请前往 http://www.egret.com 下载 Egret 安装包，如果您已经安装 Egret 安装包，请联系我们的工作人员";
    locale_strings[12000] = "创建一个全新的 Egret 项目";
    locale_strings[12001] = "选择一个项目模板";
    locale_strings[12002] = "请输入默认的屏幕尺寸";
    locale_strings[12003] = "选择屏幕缩放模式";
    locale_strings[12004] = "选择扩展模块";
    locale_strings[12005] = "请选择希望发布的平台";
})(egret || (egret = {}));
