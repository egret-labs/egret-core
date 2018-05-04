//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
    locale_strings[0] = "执行成功";
    locale_strings[1] = "编译项目失败";
    locale_strings[3] = "耗时：{0}秒";
    locale_strings[4] = "脚本执行失败";
    locale_strings[5] = "编译错误";
    locale_strings[6] = "manifest.json生成成功";
    locale_strings[7] = "native拷贝共计耗时：{0}秒";
    locale_strings[8] = "项目模块不能同时使用 gui 和 eui ，推荐使用 eui 模块";
    locale_strings[1050] = "在指定位置找不到模块:{0}";
    //create
    locale_strings[1001] = "请输入项目名称。例: {color_green}egret create [project_name]{color_normal}";
    locale_strings[1002] = "该项目已存在";
    locale_strings[1003] = "正在创建新项目文件夹...";
    locale_strings[1004] = "正在编译项目...";
    locale_strings[1005] = "创建成功";
    //build
    locale_strings[1101] = "请输入项目名称。例:{color_green}egret build [project_name]{color_normal}";
    locale_strings[1102] = "指定項目中不存在 bin-debug 文件夾，请执行 {color_green}egret build [project_name] -e {color_normal} 初始化引擎";
    locale_strings[1103] = "{0}: error 类文件之间存在循环依赖，请检查类的继承关系或静态变量的初始化引用。";
    locale_strings[1104] = "构建成功";
    locale_strings[1105] = "编译项目：";
    locale_strings[1106] = "扫描项目列表";
    locale_strings[1107] = "扫描耗时：{0}秒";
    locale_strings[1108] = "项目共计编译耗时：{0}秒";
    locale_strings[1109] = "执行tsc编译";
    locale_strings[1110] = "tsc编译耗时：{0}秒";
    locale_strings[1111] = "{0} tsc编译生成js文件";
    locale_strings[1112] = "{0}耗时：{1}秒";
    locale_strings[1113] = "{0} tsc编译生成 '.d.ts'";
    locale_strings[1114] = "{0} 拷贝其他文件";
    locale_strings[1115] = "第三方库共计耗时：{0}秒";
    locale_strings[1116] = "目前不支持修改 tsconfig.json 中的编译选项: '{0}'.";
    locale_strings[1117] = "警告! tsconfig.json 不是有效的 json 文件";
    locale_strings[1118] = "未找到 {0} 版本引擎，将使用默认版本引擎替换，请在一键安装包中安装对应版本引擎";
    locale_strings[1119] = "第三方库编译报错，您可以访问{color_underline} http://developer.egret.com/cn/github/egret-docs/Engine2D/projectConfig/libraryProject/index.html {color_normal}了解详情";
    locale_strings[1120] = "白鹭引擎 4.1 使用新结构进行第三方库升级，请先升级您的第三方库";
    locale_strings[1121] = "您的模块 package.json 中不包含 typings 属性，这会导致导出的模块不存在 TypeScript Definition 文件 ( .d.ts )，近而无法在 TypeScript 中包含智能语法提示";
    locale_strings[1122] = "第三方库的 tsconfig.json 中必须包含 outFile 这一属性";
    locale_strings[1123] = "{0} 将被调整为'{1}'";
    //compile
    locale_strings[1301] = "在编译路径 {0} 下找不到 egret_file_list.js 或 game_file_list.js，请检查编译路径是否正确";
    locale_strings[1302] = "请输入编译路径。例:{color_green}egret compile --source [your_typescript_source_dir] --output [your_output_dir]{color_normal}";
    locale_strings[1303] = "编译失败";
    locale_strings[1304] = "解析manifest.json文件失败，请检查文件是否为正确的JSON格式:\n{0}";
    locale_strings[1305] = "读取launcher/{0}.html失败，请检查编译路径是否正确";
    locale_strings[1306] = "在launcher/{0}内找不到文档类'document_class'的变量定义，请检查文件内容是否正确";
    locale_strings[1307] = "模块 {0} 中不存在任何 .ts 或 .d.ts 文件，无法编译，请在模块的 file_list 字段中填写 .ts 或 .d.ts ";
    locale_strings[1308] = "类或接口名冲突：‘{0}’同时存在于以下两个文件内：\n{1}\n{2}";
    locale_strings[1309] = "编译成功";
    locale_strings[1310] = "扫描到的文件变化列表:";
    //publish
    locale_strings[1401] = "找不到java或java版本过低（最低需求为 java 7 ),请安装java并执行 egret publish -testJava 命令进行测试";
    locale_strings[1402] = "开始发布 {0} 版本：{1}";
    locale_strings[1403] = "开始压缩js文件";
    locale_strings[1404] = "压缩js文件耗时：{0}秒";
    locale_strings[1405] = "未压缩js文件，拷贝js文件";
    locale_strings[1406] = "拷贝js文件耗时：{0}秒";
    locale_strings[1407] = "扫描版本控制文件";
    locale_strings[1408] = "生成版本控制文件耗时：{0}秒";
    locale_strings[1409] = "拷贝文件到release耗时：{0}秒";
    locale_strings[1410] = "开始打zip包";
    locale_strings[1411] = "打zip包耗时：{0}秒";
    locale_strings[1412] = "native拷贝共计耗时：{0}秒";
    locale_strings[1413] = "发布完成共计耗时：{0}秒";
    locale_strings[1414] = "未打zip包，拷贝文件到release";
    locale_strings[1415] = "正在执行检测命令:{0}";
    locale_strings[1416] = "您可以修改 JAVA_HOME 环境变量来修改 JAVA 路径";
    locale_strings[1417] = "检测成功";
    locale_strings[1418] = "WebP格式转换失败 : {0}";
    locale_strings[1419] = "转换WebP格式 : {0} / {1}";
    locale_strings[1420] = "打包失败，请检查路径中是否有中文或特殊的字符";
    locale_strings[1421] = "打zip包出现异常！";
    //run
    locale_strings[1501] = "无法启动服务器，请检查权限或端口是否被占用";
    //create_app
    locale_strings[1601] = "请输入h5游戏目录以及手机平台支持库。例: {color_green}egret create_app [app_name] -f [h5_game_path] -t [template_path] {color_normal} \n如没有安装最新手机平台支持库，请从以下地址下载：\nAndroid: https://www.egret.com/downloads/android.html, \niOS:https://www.egret.com/downloads/ios.html";
    locale_strings[1602] = "不是h5游戏目录(缺少egretProperties.json或格式不正确) \n请从 https://www.egret.com/products/engine.html 升级引擎到最新版";
    locale_strings[1603] = "{color_red}{0}{color_normal}中不存在create_app.json，请检查支持库路径是否正确。\n请从以下地址下载最新手机平台支持库\nAndroid: https://www.egret.com/downloads/android.html\niOS: https://www.egret.com/downloads/ios.html";
    locale_strings[1604] = "执行egret build命令失败";
    locale_strings[1605] = "移动平台项目目录不能与html5项目目录为同一目录，请修改移动平台项目目录。";
    locale_strings[1606] = "创建完毕，共计耗时：{0}秒";
    locale_strings[1607] = "> copy from project template ...";
    locale_strings[1608] = "> replace all configure elements ...";
    locale_strings[1609] = "> rename project name ...";
    locale_strings[1610] = "缺少项目名称 例:{color_green}egret create_app [app_name] -f [h5_game_path] -t [template_path] {color_normal}";
    locale_strings[1611] = "项目已存在,请重新输入 例:{color_green}egret create_app [app_name] -f [h5_game_path] -t [template_path] {color_normal}";
    locale_strings[1612] = "项目名称必须以字母为开头";
    locale_strings[1613] = "unzip出现异常！";
    locale_strings[1614] = "找不到 project.properties 文件。app_path ： {0}";
    locale_strings[1615] = "找不到 build.gradle 文件。app_path ： {0}";
    locale_strings[1616] = "找不到 platforms 文件夹。android_home ： {0}";
    locale_strings[1617] = "找不到 source.properties 文件。platformDir ： {0}";
    locale_strings[1618] = "找不到 build_tools 文件夹。android_home ： {0}";
    locale_strings[1619] = "找不到 source.properties 文件。buildToolDir ： {0}";
    //upgrade
    locale_strings[1701] = "项目版本低于 egret 版本，请执行 egret upgrade {your_project} 命令升级您的项目，\n命令中请不要加上大括号{}";
    locale_strings[1702] = "项目升级成功";
    locale_strings[1703] = "升级脚本运行完成，请查看 {color_underline}{0}{color_normal} 了解详情";
    locale_strings[1704] = "正在更新到{0}";
    locale_strings[1705] = "升级错误，请重置引擎后重试";
    locale_strings[1706] = "共计 {color_red}{0}{color_normal} 处API冲突,请用户解决所有冲突后运行build命令";
    locale_strings[1707] = "正在从{0},拷贝到{1} ..";
    locale_strings[1711] = "工程目录已变更,请使用新目录{color_red} '{0}' {color_normal}执行 {color_red} egret apitest {your-project} {color_normal}进行API检测";
    locale_strings[1712] = "检测结果已写入'{0}'";
    locale_strings[1713] = "{color_green}Egret 新特性体验群 481169576 {color_normal}";
    locale_strings[1714] = "正在更新配置文件..";
    locale_strings[1715] = "项目检测成功";
    locale_strings[1716] = "检测到你使用了旧的第三方库{0},建议手动检查这些库文件是否使用了废弃的API或使用与{1}兼容的第三方库";
    locale_strings[1717] = "升级中断，具体原因如下";
    locale_strings[1718] = "5.0.8以后版本将删除 template/debug/index.html 模板文件，直接使用 index.html";
    locale_strings[1719] = "5.1为新功能体验版，只能创建新项目，老项目无法升级";
    //info
    locale_strings[1801] = "当前Egret版本：{0}";
    locale_strings[1802] = "Egret安装路径：{0}";
    //help
    locale_strings[1901] = "无法找到{0}命令的帮助文档";
    locale_strings[1902] = "用法: {0}";
    locale_strings[1903] = "用法: egret <command> [-v]";
    locale_strings[1904] = "command 列表:";
    locale_strings[1905] = "参数列表:";
    locale_strings[1906] = "{0}打印详细日志";
    locale_strings[1907] = "使用 egret help <command> 了解各个 command 的细节";
    //exml
    locale_strings[2001] = "{0}: error 找不到EXML文件";
    locale_strings[2002] = "{0}: error XML文件格式有误 {1}";
    locale_strings[2003] = "{0}: error 无法找到节点所对应的类定义\n{1}";
    locale_strings[2004] = "{0}: error 节点不能含有同名的id属性\n{1}";
    locale_strings[2005] = "{0}: error 节点上不存在名为'{1}'的属性或样式名:\n{2}";
    locale_strings[2006] = "{0}: error 未定义的视图状态名称:'{1}'\n{2}";
    locale_strings[2007] = "{0}: error 只有处于容器内的egret.IVisualElement对象可以使用includeIn和excludeFrom属性\n{1}";
    locale_strings[2008] = "{0}: error 无法将'{1}'类型的值赋给属性:'{2}'\n{3}";
    locale_strings[2009] = "{0}: error 在节点属性值的‘{}’标签内只能引用一个ID，不允许使用复杂表达式\n{1}";
    locale_strings[2010] = "{0}: error 属性:'{1}'所引用的ID: '{2}'不存在\n{3}";
    locale_strings[2011] = "{0}: error 无法将多个子节点赋值给同一个属性:'{1}'\n{2}";
    locale_strings[2012] = "{0}: error 节点上不存在默认属性，必须显式声明子节点要赋值到的属性名\n{1}";
    locale_strings[2013] = "{0}: error 类型为Array的属性节点上不允许使用视图状态语法\n{1}";
    locale_strings[2014] = "{0}: error 不允许将皮肤类自身赋值给节点属性\n{1}";
    locale_strings[2015] = "{0}: error 节点引用的类定义:{1}不存在\n{2}";
    locale_strings[2016] = "{0}: error 节点上'scale9Grid'属性值的格式错误:{1}";
    locale_strings[2017] = "{0}: error 节点上缺少命名空间前缀:{1}";
    locale_strings[2018] = "{0}: error 节点上'skinName'属性值的格式错误:{1}";
    locale_strings[2019] = "{0}: error 容器的子项必须是可视节点:{1}";
    locale_strings[2020] = "{0}: error 在w:Declarations内的子节点，不允许使用includeIn和excludeFrom属性\n{1}";
    locale_strings[2102] = "{0}: warning 在属性节点上找不到任何子节点\n{1}";
    locale_strings[2103] = "{0}: warning 节点上的同一个属性'{1}'被多次赋值\n{2}";
    // android sdk install
    locale_strings[2201] = "{0}个文件需要下载！";
    locale_strings[2202] = "文件总大小为{0}MB";
    locale_strings[2203] = "开始下载！";
    locale_strings[2204] = "{0} 下载成功！";
    locale_strings[2205] = "文件大小为{0}MB";
    locale_strings[2206] = "所有文件下载成功！";
    locale_strings[2207] = "{0}个文件需要解压安装！";
    locale_strings[2208] = "开始解压安装！";
    locale_strings[2209] = "{0} 解压安装成功！";
    locale_strings[2210] = "所有文件解压安装成功！";
    locale_strings[2211] = "Android SDK安装成功！";
    locale_strings[8001] = "请输入命令行选项{color_green} {0} {color_normal}的参数,并确认是以下值之一: {color_green}[{1}]{color_normal}";
    locale_strings[8002] = "{color_red}请选对正确的egret项目目录！{color_normal}\n\tEgret_Project\t\t{color_gray}//项目目录{color_normal}\n\t\t--launcher\t{color_gray}//启动目录{color_normal}\n\t\t--src\t\t{color_gray}//源代码目录{color_normal}";
    locale_strings[8003] = "配置文件{0}不存在";
    locale_strings[8004] = "{color_red}请先创建Native项目再执行 --runtime native{color_normal}";
    locale_strings[9999] = "未知错误:{0}";
    locale_strings[10001] = "编译参数 {0} 需要一个参数";
    locale_strings[10002] = "未知的编译参数 {0}";
    locale_strings[10003] = "编译错误，错误码是: {0}";
    locale_strings[10004] = "没有指定输出文件的文件名";
    locale_strings[10006] = "manifest.json 生成成功";
    locale_strings[10008] = "类或接口名冲突：‘{0}’同时存在于以下两个文件内：\n{1}\n{2}";
    locale_strings[10009] = "{0} 不是标准的json文件请尝试重新安装Egret";
    locale_strings[10010] = "自动编译正在监视项目文件...";
    locale_strings[10011] = "自动编译完成.";
    locale_strings[10012] = "如果您没有设置 IDE 保存自动编译，可以添加参数 -a 来启动自动编译";
    locale_strings[10013] = "Egret 服务器已经启动, 您可以通过以下URL访问: {0}";
    locale_strings[10014] = "自动编译失败，请参考下面的错误信息：";
    locale_strings[10015] = "{color_red}\"{0}\" 不是一个有效的 Egret 项目目录{color_normal}" +
        "\n\tEgret_Project\t\t\t//项目目录" +
        "\n\t\t--template\t\t//模板配置目录" +
        "\n\t\t--libs\t\t\t//引擎库目录" +
        "\n\t\t--resource\t\t//资源目录" +
        "\n\t\t--src\t\t\t//源代码目录" +
        "\n\t\t--egretProperties.json\t//项目配置文件" +
        "\n\t\t--index.html\t\t//启动文件";
    locale_strings[10016] = "如果浏览器没有启动，请手动打开URL: {0}";
    locale_strings[10017] = "项目创建成功，您可以执行 egret run 来运行刚刚创建的应用";
    locale_strings[10018] = "试图进行文件加载顺序排序时发现循环依赖，比如类的 static 属性直接实例化了一个继承自当前类的类，"
        + "或者当前文件中有立即执行的代码使用了依赖于当前文件的类。";
    locale_strings[10019] = "没有找到打包 App 所需要的项目文件，这些文件没有包含在 Github 中，请前往 http://www.egret.com 下载 Egret 安装包，如果您已经安装 Egret 安装包，请联系我们的工作人员";
    locale_strings[10020] = "编译服务异常退出";
    locale_strings[10021] = "文件夹操作出现问题，请注意以下事项:\n1、请查看 template/runtime/native_require.js 是否为空，若为空请重新创建一个新的项目并将文件替换掉。\n2、不要在桌面创建native工程，都放到同一个其他盘去，比如 e 盘。\n由于操作系统刷新问题，请勿在操作文件后立马执行脚本。请重新执行命令，如果多次重试还不能解决，请联系我们，QQ群：{color_green}481169576{color_normal}";
    locale_strings[12000] = "创建一个全新的 Egret 项目";
    locale_strings[12001] = "选择一个项目模板";
    locale_strings[12002] = "请输入默认的屏幕尺寸";
    locale_strings[12003] = "选择屏幕缩放模式";
    locale_strings[12004] = "选择扩展模块";
    locale_strings[12005] = "请选择希望发布的平台";
})(egret || (egret = {}));
var helpModule;
(function (helpModule) {
    helpModule.help_dict = {
        "lib_name": "第三方库名称，按照操作系统的命名规范命名",
        "common_proj_name": "项目名称，按照操作系统的命名规范命名",
        "common_app_name": "移动应用项目名称，按照操作系统的命名规范命名",
        "form": "用法",
        "desc": "描述",
        "detail": "参数说明",
        "info0": "当前Egret版本，以及安装路径",
        "upgrade0": "跟随Egret引擎的升级，对项目进行升级",
        "ss0": "启动Egret内置的服务器，并可立即在浏览器中运行项目",
        "ss1": "指定端口号",
        "ss2": "是否使用本机IP",
        "ss3": "是否只运行服务器",
        "create_manifest0": "在工程目录下生成manifest.json清单文件",
        "create_manifest1": "生成所有文件的清单,若不指定则只生成文档类有引用到的类清单",
        "create_app1": "app项目所对应h5项目的路径",
        "create_app2": "模板路径",
        "pub1": "发布项目，使用GoogleClosureCompiler压缩代码",
        "pub3": "设置发布之后的版本号，可以不设置",
        "pub4": "设置发布方式为 html5 或者是 native方式，默认值为html5",
        "pub5": "设置发布后js文件是否需要压缩，通常用于原生打包同步过程",
        "pub6": "设置发布zip文件的解压密码",
        "create1": "创建新项目",
        "create2": "要创建的项目类型 core或eui，默认值为core",
        "create_lib1": "创建新第三方库",
        "build0": "构建指定项目,编译指定项目的 TypeScript 文件",
        "build1": "编译指定项目的同时拷贝引擎代码",
        "build2": "清除libs以及bin-debug文件夹，只有在-e的前提下才会生效",
        //,"build3":"只编译引擎中指定的部分模块，不编译项目；不填则编译全部模块",
        "build4": "编译EXML文件时保留生成的TS文件",
        "build5": "如果有native工程，则会将文件拷贝到工程里",
        //,"build6":"编译游戏时，根据game_file_list获取编译列表",
        "build7": "显示执行过程",
        "clean": "清除libs文件夹内的引擎代码，然后再重新拷贝，编译指定项目"
    };
    helpModule.help_title = {
        //titles,
        "create": "创建新项目",
        "build": "构建指定项目,编译指定项目的 TypeScript 文件",
        "publish": "发布项目，使用GoogleClosureCompiler压缩代码",
        "run": "启动HttpServer,并在默认浏览器中打开指定项目",
        "clean": "重置项目中的引擎代码",
        "create_lib": "创建新第三方库项目",
        "create_app": "从h5游戏生成app",
        "upgrade": "升级项目代码",
        "make": "编译引擎源码",
        "info": "获得Egret信息"
    };
    global["helpModule"] = global["helpModule"] || helpModule;
    //global["helpModule"]["help_dict"] = help_dict;
})(helpModule || (helpModule = {}));
