exports.help_dict = {
    "common_proj_name":"项目名称，按照操作系统的命名规范命名"
   ,"common_app_name":"移动应用项目名称，按照操作系统的命名规范命名"

   , "form" : "用法"
   , "desc" : "描述"
   , "detail" : "参数说明"

   , "info0" : "当前Egret版本，以及安装路径"

   , "upgrade0" : "跟随Egret引擎的升级，对项目进行升级"

   , "ss0" : "启动Egret内置的服务器，并可立即在浏览器中运行项目"
   , "ss1" : "指定端口号"
   , "ss2" : "是否使用本机IP"
   , "ss3" : "是否只运行服务器"

   , "create_manifest0" : "在工程目录下生成manifest.json清单文件"
   , "create_manifest1" : "生成所有文件的清单,若不指定则只生成文档类有引用到的类清单"

   , "create_app1":"app项目所对应h5项目的路径"
   , "create_app2":"模板路径"

   ,"pub1":"发布项目，使用GoogleClosureCompiler压缩代码"
   ,"pub3":"设置发布之后的版本号，可以不设置"
   ,"pub4":"设置发布方式为 html5 或者是 native方式，默认值为html5"
   ,"pub5":"设置发布后js文件是否需要压缩，通常用于原生打包同步过程"
   ,"pub6":"设置发布zip文件的解压密码"

   ,"create1":"创建新项目"
   ,"create2":"要创建的项目类型 core或gui，默认值为core"

   ,"build0":"构建指定项目,编译指定项目的 TypeScript 文件"
   ,"build1":"编译指定项目的同时编译引擎目录"
   ,"build2":"清除libs以及bin-debug文件夹，只有在-e的前提下才会生效"
   //,"build3":"只编译引擎中指定的部分模块，不编译项目；不填则编译全部模块"
   ,"build4":"编译EXML文件时保留生成的TS文件"
   ,"build5":"如果有native工程，则会将文件拷贝到工程里"
   //,"build6":"编译游戏时，根据game_file_list获取编译列表"
   ,"build7":"显示执行过程"

    //titles
   ,"title_build":"构建指定项目,编译指定项目的 TypeScript 文件"
   ,"title_create":"创建新项目"
   ,"title_create_app":"从h5游戏生成app"
   ,"title_create_manifest":"在工程目录下生成manifest.json清单文件"
   ,"title_info":"获得Egret信息"
   ,"title_publish":"发布项目，使用GoogleClosureCompiler压缩代码"
   ,"title_startserver":"启动HttpServer,并在默认浏览器中打开指定项目"
   ,"title_upgrade":"升级项目代码"
};

exports.error_code = {

    0:"执行成功",
    1:"请先设置环境变量 {color_green}EGRET_PATH{color_normal}。您可以访问 {color_underline}https://github.com/egret-team/egret/wiki/Setting-environment-variables{color_normal} 获取更多细节",
    2:"TypeScript编译器尚未安装，请执行 {color_green}npm install -g typescript{color_normal} 进行安装",
    3:"耗时：{0}秒",
    4:"脚本执行失败",
    5:"请确定执行路径",
    6:"manifest.json生成成功",
    7:"native拷贝共计耗时：{0}秒",
    //create
    1001:"请输入项目名称。例: {color_green}egret create [project_name]{color_normal}",
    1002:"该项目已存在",
    1003:"正在创建新项目文件夹...",
    1004:"正在编译项目...",
    1005:"创建成功",
    //build
    1101:"请输入项目名称。例:{color_green}egret build [project_name]{color_normal}",
    1102:"指定項目中不存在 bin-debug 文件夾，请执行 {color_green}egret build [project_name] -e {color_normal} 初始化引擎",
    1103:"{0}: error 类文件之间存在循环依赖，请检查类的继承关系或静态变量的初始化引用。",
    1104:"构建成功",
    1105:"编译项目：",
    1106:"扫描项目列表",
    1107:"扫描耗时：{0}秒",
    1108:"项目共计编译耗时：{0}秒",
    1109:"执行tsc编译",
    1110:"tsc编译耗时：{0}秒",
    1111:"{0} tsc编译生成js文件",
    1112:"{0}耗时：{1}秒",
    1113:"{0} tsc编译生成 '.d.ts'",
    1114:"{0} 拷贝其他文件",
    1115:"第三方库共计耗时：{0}秒",
    //compile
    1301:"在编译路径 {0} 下找不到 egret_file_list.js 或 game_file_list.js，请检查编译路径是否正确",
    1302:"请输入编译路径。例:{color_green}egret compile --source [your_typescript_source_dir] --output [your_output_dir]{color_normal}",
    1303:"编译失败",
    1304:"解析manifest.json文件失败，请检查文件是否为正确的JSON格式:\n{0}",
    1305:"读取launcher/{0}.html失败，请检查编译路径是否正确",
    1306:"在launcher/{0}内找不到文档类'document_class'的变量定义，请检查文件内容是否正确",
    1307:"模块 {0} 中不存在任何 .ts 或 .d.ts 文件，无法编译，请在模块的 file_list 字段中填写 .ts 或 .d.ts ",
    1308:"类或接口名冲突：‘{0}’同时存在于以下两个文件内：\n{1}\n{2}",
    1309:"编译成功",
    //publish
    1401:"找不到java或java版本过低（最低需求为 java 7 ),请安装java并执行 egret publish -testJava 命令进行测试",
    1402:"开始发布{0}版本：{1}",
    1403:"开始压缩js文件",
    1404:"压缩js文件耗时：{0}秒",
    1405:"未压缩js文件，拷贝js文件",
    1406:"拷贝js文件耗时：{0}秒",
    1407:"扫描版本控制文件",
    1408:"生成版本控制文件耗时：{0}秒",
    1409:"拷贝文件到release耗时：{0}秒",
    1410:"开始打zip包",
    1411:"打zip包耗时：{0}秒",
    1412:"native拷贝共计耗时：{0}秒",
    1413:"发布完成共计耗时：{0}秒",
    1414:"未打zip包，拷贝文件到release",
    1415:"正在执行检测命令:{0}",
    1416:"您可以修改 JAVA_HOME 环境变量来修改 JAVA 路径",
    1417:"检测成功",
    1418:"WebP格式转换失败 : {0}",
    1419:"转换WebP格式 : {0} / {1}",
    //startserver
    1501:"无法启动服务器，请检查权限或端口是否被占用",
    //create_app
    1601:"请输入项目名称, h5游戏目录以及手机平台支持库。例: {color_green}egret create_app [app_name] -f [h5_game_path] -t [template_path] {color_normal} \n如没有安装最新手机平台支持库，请从以下地址下载：\nAndroid: http://www.egret-labs.org/download/egret-android-packager-download.html, \niOS:http://www.egret-labs.org/download/egret-ios-packager-download.html",
    1602:"缺少egretProperties.json或格式不正确。 \n请从http://www.egret-labs.org/download/egret-download.html升级egret-core到最新版",
    1603:"缺少create_app.json。\n请从以下地址下载最新手机平台支持库\nAndroid: http://www.egret-labs.org/download/egret-android-packager-download.html, \n\tiOS: http://www.egret-labs.org/download/egret-ios-packager-download.html",
    1604:"执行egret build命令失败",
    1605:"移动平台项目目录不能与html5项目目录为同一目录，请修改移动平台项目目录。",
    1606:"创建完毕，共计耗时：{0}秒",
    1607:"> copy from project template ...",
    1608:"> replace all configure elements ...",
    1609:"> rename project name ...",
    //upgrade
    1701:"项目版本低于 egret 版本，请执行 egret upgrade {your_project} 命令升级您的项目，\n命令中请不要加上大括号{}",
    1702:"项目升级后，请执行一次 egret build {your_project} {color_green}-e{color_normal} 编译引擎，\n命令中请不要加上大括号{}",
    1703:"\n升级第一步完成，{color_red}请按 {color_underline}https://github.com/egret-labs/egret-core/wiki/Egret_Upgrade/upgrade/index.html{color_red} 完成剩余升级步骤{color_normal}\n",
    1704:"正在更新到{0}",
    //info
    1801:"当前Egret版本：{0}",
    1802:"Egret安装路径：{0}",
    //help
    1901:"无法找到{0}命令的帮助文档",
    1902:"用法: {0}",
    1903:"用法: egret <command> [-v]",
    1904:"command 列表:",
    1905:"参数列表:",
    1906:"{0}打印详细日志",
    1907:"使用 egret help <command> 了解各个 command 的细节",
    9999:"未知错误:{0}",
    8001:"请输入命令行选项{color_green} {0} {color_normal}的参数,并确认是以下值之一: {color_green}[{1}]{color_normal}",
    8002:"{color_red}请选对正确的egret项目目录！{color_normal}\n\tEgret_Project\t\t{color_gray}//项目目录{color_normal}\n\t\t--launcher\t{color_gray}//启动目录{color_normal}\n\t\t--src\t\t{color_gray}//源代码目录{color_normal}",
    8003:"配置文件{0}不存在",
    8004:"{color_red}请先创建Native项目再执行 --runtime native{color_normal}",
    2001:"{0}: error 找不到EXML文件",
    2002:"{0}: error 不是有效的XML文件",
    2003:"{0}: error 无法找到节点所对应的类定义\n{1}",
    2004:"{0}: error 节点不能含有同名的id属性\n{1}",
    2005:"{0}: error 节点上不存在名为'{1}'的属性或样式名:\n{2}",
    2006:"{0}: error 未定义的视图状态名称:'{1}'\n{2}",
    2007:"{0}: error 只有处于容器内的egret.IVisualElement对象可以使用includeIn和excludeFrom属性\n{1}",
    2008:"{0}: error 无法将'{1}'类型的值赋给属性:'{2}'\n{3}",
    2009:"{0}: error 在节点属性值的‘{}’标签内只能引用一个ID，不允许使用复杂表达式\n{1}",
    2010:"{0}: error 属性:'{1}'所引用的ID: '{2}'不存在\n{3}",
    2011:"{0}: error 无法将多个子节点赋值给同一个属性:'{1}'\n{2}",
    2012:"{0}: error 节点上不存在默认属性，必须显式声明子节点要赋值到的属性名\n{1}",
    2013:"{0}: error 类型为Array的属性节点上不允许使用视图状态语法\n{1}",
    2014:"{0}: error 不允许将皮肤类自身赋值给节点属性\n{1}",
    2015:"{0}: error 节点引用的类定义:{1}不存在\n{2}",
    2016:"{0}: error 节点上'scale9Grid'属性值的格式错误:{1}",
    2017:"{0}: error 节点上缺少命名空间前缀:{1}",
    2018:"{0}: error 节点上'skinName'属性值的格式错误:{1}",
    2019:"{0}: error 容器的子项必须是可视节点:{1}",
    2020:"{0}: error 在w:Declarations内的子节点，不允许使用includeIn和excludeFrom属性\n{1}",
    2102:"{0}: warning 在属性节点上找不到任何子节点\n{1}",
    2103:"{0}: warning 节点上的同一个属性'{1}'被多次赋值\n{2}"
};