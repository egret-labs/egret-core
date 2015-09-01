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
    locale_strings[11001] = "{0}: error 找不到EXML文件";
    locale_strings[11002] = "{0}: error 不是有效的XML文件";
    locale_strings[11003] = "{0}: error 无法找到节点所对应的类定义\n{1}";
    locale_strings[11004] = "{0}: error 节点不能含有同名的id属性\n{1}";
    locale_strings[11005] = "{0}: error 节点上不存在名为'{1}'的属性或样式名:\n{2}";
    locale_strings[11006] = "{0}: error 未定义的视图状态名称:'{1}'\n{2}";
    locale_strings[11007] = "{0}: error 只有处于容器内的egret.IVisualElement对象可以使用includeIn和excludeFrom属性\n{1}";
    locale_strings[11008] = "{0}: error 无法将'{1}'类型的值赋给属性:'{2}'\n{3}";
    locale_strings[11009] = "{0}: error 在节点属性值的‘{}’标签内只能引用一个ID，不允许使用复杂表达式\n{1}";
    locale_strings[11010] = "{0}: error 属性:'{1}'所引用的ID: '{2}'不存在\n{3}";
    locale_strings[11011] = "{0}: error 无法将多个子节点赋值给同一个属性:'{1}'\n{2}";
    locale_strings[11012] = "{0}: error 节点上不存在默认属性，必须显式声明子节点要赋值到的属性名\n{1}";
    locale_strings[11013] = "{0}: error 类型为Array的属性节点上不允许使用视图状态语法\n{1}";
    locale_strings[11014] = "{0}: error 不允许将皮肤类自身赋值给节点属性\n{1}";
    locale_strings[11015] = "{0}: error 节点引用的类定义:{1}不存在\n{2}";
    locale_strings[11016] = "{0}: error 节点上'scale9Grid'属性值的格式错误:{1}";
    locale_strings[11017] = "{0}: error 节点上缺少命名空间前缀:{1}";
    locale_strings[11018] = "{0}: error 节点上'skinName'属性值的格式错误:{1}";
    locale_strings[11019] = "{0}: error 容器的子项必须是可视节点:{1}";
    locale_strings[11101] = "{0}: warning 在w:Declarations内的子节点，不允许使用includeIn和excludeFrom属性\n{1}";
    locale_strings[11102] = "{0}: warning 在属性节点上找不到任何子节点\n{1}";
    locale_strings[11103] = "{0}: warning 节点上的同一个属性'{1}'被多次赋值\n{2}";
    locale_strings[12000] = "创建一个全新的 Egret 项目";
    locale_strings[12001] = "选择一个项目模板";
    locale_strings[12002] = "请输入默认的屏幕尺寸";
    locale_strings[12003] = "选择屏幕缩放模式";
    locale_strings[12004] = "选择扩展模块";
    locale_strings[12005] = "请选择希望发布的平台";
    locale_strings[1601] = "请输入项目名称, h5游戏目录以及手机平台支持库。例: {color_green}egret create_app [app_name] -f [h5_game_path] -t [template_path] {color_normal} \n如没有安装最新手机平台支持库，请从以下地址下载：\nAndroid: http://www.egret-labs.org/download/egret-android-packager-download.html, \niOS:http://www.egret-labs.org/download/egret-ios-packager-download.html";
    locale_strings[1602] = "缺少egretProperties.json或格式不正确。 \n请从http://www.egret-labs.org/download/egret-download.html升级egret-core到最新版";
    locale_strings[1603] = "缺少create_app.json。\n请从以下地址下载最新手机平台支持库\nAndroid: http://www.egret-labs.org/download/egret-android-packager-download.html, \n\tiOS: http://www.egret-labs.org/download/egret-ios-packager-download.html";
    locale_strings[1604] = "执行egret build命令失败";
    locale_strings[1605] = "移动平台项目目录不能与html5项目目录为同一目录，请修改移动平台项目目录。";
    locale_strings[1606] = "创建完毕，共计耗时：{0}秒";
    locale_strings[1607] = "> copy from project template ...";
    locale_strings[1608] = "> replace all configure elements ...";
    locale_strings[1609] = "> rename project name ...";
})(egret || (egret = {}));
//# sourceMappingURL=zh_CN.js.map