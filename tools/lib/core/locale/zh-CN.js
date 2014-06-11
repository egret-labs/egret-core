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
    1301:"在编译路径 {0} 下找不到 egret_file_list.js 或 game_file_list.js，请检查编译路径是否正确",
    1302:"请输入编译路径。例:{color_green}egret compile --source [your_typescript_source_dir] --output [your_output_dir]{color_normal}",
    1303:"编译失败",
    1401:"找不到java或java版本过低（最低需求为 java 7 ),请安装java并执行 java -version 命令确认",
    9999:"未知错误:{0}",
    8001:"请输入命令行选项{color_green} {0} {color_normal}的参数,并确认是以下值之一: {color_green}[{1}]{color_normal}",
    8002:"{color_red}请选对正确的egret项目目录！{color_normal}\n\tEgret_Project\t\t{color_gray}//项目目录{color_normal}\n\t\t--launcher\t{color_gray}//起始目录{color_normal}\n\t\t--src\t\t{color_gray}//源代码目录{color_normal}",
    8003:"配置文件{0}不存在",
    2001:"{0}: error 找不到EXML文件",
    2002:"{0}: error 不是有效的XML文件",
    2003:"{0}: error 无法找到节点所对应的类定义:\n{1}",
    2101:"{0}: warning 在w:Declarations内的子节点，不允许使用includeIn和excludeFrom等属性:\n{1}"
}