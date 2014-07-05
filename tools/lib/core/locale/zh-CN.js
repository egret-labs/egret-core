/**
 * Created by apple on 14-4-28.
 */

exports.error_code = {

    0:"执行成功",
    1:"请先设置环境变量 {color_green}EGRET_PATH{color_normal}。您可以访问 {color_underline}https://github.com/egret-team/egret/wiki/Setting-environment-variables{color_normal} 获取更多细节",
    2:"TypeScript编译器尚未安装，请执行 {color_green}npm install -g typescript{color_normal} 进行安装",
    1001:"请输入项目名称。例: {color_green}egret create [project_name]{color_normal}",
    1101:"请输入项目名称。例:{color_green}egret build [project_name]{color_normal}",
    1102:"指定項目中不存在 bin-debug 文件夾，请执行 {color_green}egret build [project_name] -e {color_normal} 初始化引擎",
    1103:"{0}: error 类文件之间存在循环依赖，请检查类的继承关系或静态变量的初始化引用。",
    1301:"在编译路径 {0} 下找不到 egret_file_list.js 或 game_file_list.js，请检查编译路径是否正确",
    1302:"请输入编译路径。例:{color_green}egret compile --source [your_typescript_source_dir] --output [your_output_dir]{color_normal}",
    1303:"编译失败",
    1304:"解析manifest.json文件失败，请检查文件是否为正确的JSON格式:\n{0}",
    1401:"找不到java或java版本过低（最低需求为 java 7 ),请安装java并执行 java -version 命令确认",
    1501:"无法启动服务器，请检查权限或端口是否被占用",
    1601:"请输入项目名称和h5游戏目录。例: {color_green}egret create_app [app_name] -f [h5_game_path] -n [native_path]{color_normal}",
    1602:"请从http://TODO下载app模块库，再次运行命令",
    9999:"未知错误:{0}",
    8001:"请输入命令行选项{color_green} {0} {color_normal}的参数,并确认是以下值之一: {color_green}[{1}]{color_normal}",
    8002:"{color_red}请选对正确的egret项目目录！{color_normal}\n\tEgret_Project\t\t{color_gray}//项目目录{color_normal}\n\t\t--launcher\t{color_gray}//启动目录{color_normal}\n\t\t--src\t\t{color_gray}//源代码目录{color_normal}",
    8003:"配置文件{0}不存在",
    2001:"{0}: error 找不到EXML文件",
    2002:"{0}: error 不是有效的XML文件",
    2003:"{0}: error 无法找到节点所对应的类定义\n{1}",
    2004:"{0}: error 节点不能含有同名的id属性\n{1}",
    2005:"{0}: error 节点上不存在名为'{1}'的属性:\n{2}",
    2006:"{0}: error 未定义的视图状态名称:'{1}'\n{2}",
    2007:"{0}: error 只有处于容器内的egret.IVisualElement对象可以使用includeIn和excludeFrom属性\n{1}",
    2008:"{0}: error 无法将'{1}'类型的值赋给属性:'{2}'\n{3}",
    2009:"{0}: error 在节点属性值的‘{}’标签内只能引用一个ID，不允许使用复杂表达式\n{1}",
    2010:"{0}: error 属性:'{1}'所引用的ID: '{2}'不存在\n{3}",
    2011:"{0}: error 无法将多个子节点赋值给同一个属性:'{1}'\n{2}",
    2012:"{0}: error 节点上不存在默认属性，必须显式声明子节点要赋值到的属性名\n{1}",
    2013:"{0}: error 类型为Array的属性节点上不允许使用视图状态语法\n{1}",
    2014:"{0}: error 不允许将皮肤类自身赋值给节点属性\n{1}",
    2101:"{0}: warning 在w:Declarations内的子节点，不允许使用includeIn和excludeFrom属性\n{1}",
    2102:"{0}: warning 在属性节点上找不到任何子节点\n{1}",
    2103:"{0}: warning 节点上的同一个属性'{1}'被多次赋值\n{2}"
};