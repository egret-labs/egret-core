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






global["$locale_strings"] = global["$locale_strings"] || {};
var locale_strings = global["$locale_strings"];
locale_strings[0] = "Successful implementation";
locale_strings[1] = "Compilation fails";
locale_strings[3] = "Time: {0} second";
locale_strings[4] = "Script execution failed";
locale_strings[5] = "Compile failed";
locale_strings[6] = "manifest.json generated successfully";
locale_strings[7] = "Total time for native copy: {0} second";
locale_strings[8] = "Project modules can not use both gui and eui, and the eui module is recommended";

locale_strings[1050] = 'Could not find module at ${0}'
//create
locale_strings[1001] = "Enter a project name. Example:  {color_green}egret create [project_name]{color_normal}";
locale_strings[1002] = "The project already exists";
locale_strings[1003] = "Creating a new project folder ...";
locale_strings[1004] = "Compiling the project ...";
locale_strings[1005] = "Create successfully";
//build
locale_strings[1101] = "Enter a project name. Example: {color_green}egret build [project_name]{color_normal}";
locale_strings[1102] = "bin-debug folder is not contained in the specified project, please implement {color_green} egret build [project_name] -e {color_normal} to initialize the engine";
locale_strings[1103] = "There is a circular dependency among the {0}: error files, please check the class inheritance or static variable initialization references.";
locale_strings[1104] = "Build successfully ";
locale_strings[1105] = "Compile the project:";
locale_strings[1106] = "Scan the project list";
locale_strings[1107] = "Time for scanning: {0} second";
locale_strings[1108] = "Total project compiling time: {0} second";
locale_strings[1109] = "Implement tsc compilation ";
locale_strings[1110] = "Time for tsc compiling: {0} second";
locale_strings[1111] = "{0} tsc compiles and generates js file";
locale_strings[1112] = "{0} uses time: {1} seconds";
locale_strings[1113] = "{0} tsc compiles and generates '.d.ts'";
locale_strings[1114] = "{0} Copy other documents";
locale_strings[1115] = "The total elapsed time of the 3rd party libraries: {0} secs";
locale_strings[1116] = "Not support the compiler option: '{0}' in tsconfig.json.";
locale_strings[1117] = "Warning! The tsconfig.json is not a valid json.";
locale_strings[1118] = "The {0} version of the engine was not found and will be replaced with the default version of the engine. Please install the corresponding version engine in EgretEngine.";
locale_strings[1119] = "Third party library compilation error, you can visit {color_underline} http://developer.egret.com/cn/github/egret-docs/Engine2D/projectConfig/libraryProject/index.html {color_normal} Learn more ";
locale_strings[1120] = "Egret engine 4.1 use the new structure for third-party library upgrades, please upgrade your third-party library first";
locale_strings[1121] = "Your module package.json does not contain the 'typings' attribute, which causes the exported module to not have a TypeScript Definition file (.d.ts), and can not contain smart syntax prompts in TypeScript"
locale_strings[1122] = "Third-party library tsconfig.json must include outFile this attribute";
locale_strings[1123] = "{0} will be adjusted to '{1}'";
//compile
locale_strings[1301] = "Cannot find egret_file_list.js or game_file_list.js compiled under the path {0}, please check whether the compile path is correct";
locale_strings[1302] = "Please enter the compile path. Example: {color_green}egret compile --source [your_typescript_source_dir] --output [your_output_dir]{color_normal}";
locale_strings[1303] = "Compilation fails";
locale_strings[1304] = "Parsing manifest.json file fails, check whether the file is in the correct JSON format: \n{0}";
locale_strings[1305] = "Reading launcher / {0} .html  fails, check whether the compile path is correct";
locale_strings[1306] = "Fail to  find variable definition of the document class 'document_class' in launcher /{0}, please check whether the contents of the file are correct";
locale_strings[1307] = ".ts or .d.ts file {0} does not exist in the module, and cannot be compiled, so please fill.ts or .d.ts in file_list field of the module ";
locale_strings[1308] = "Class or interface name conflict: '{0}' exists in both of the following two files: \n {1} \n {2}";
locale_strings[1309] = "Compile successfully";
locale_strings[1310] = "Scan into changed file list:";
//publish
locale_strings[1401] = "java can't be found or java version is too old (at least java 7), please install the java and execute egret publish -testJava command for test";
locale_strings[1402] = "Start to publish {0} version: {1}";
locale_strings[1403] = "Start to compress js file";
locale_strings[1404] = "Js file compression time: {0} second";
locale_strings[1405] = "Uncompressed js file, and copy js file";
locale_strings[1406] = "Js file copy time: {0} second";
locale_strings[1407] = "Scan version control file";
locale_strings[1408] = "Time to generate version control file: {0} second";
locale_strings[1409] = "Time to copy files to release: {0} second";
locale_strings[1410] = "Start to generate zip package";
locale_strings[1411] = "Time to generate zip package: {0} second";
locale_strings[1412] = "Total time for native copy: {0} seconds";
locale_strings[1413] = "Total to complete the release: {0} second";
locale_strings[1414] = "Fail to generate a zip package, and copy the file to the release";
locale_strings[1415] = "Executing the detection command: {0}";
locale_strings[1416] = "You can modify the JAVA_HOME environment variable to modify JAVA path";
locale_strings[1417] = "Successful detection ";
locale_strings[1418] = "WebP format fail : {0}";
locale_strings[1419] = "Format WebP : {0} / {1}";
locale_strings[1420] = "Zip package failed, there may be special characters in the path";
locale_strings[1421] = "Playing zip package exception!";
//startserver
locale_strings[1501] = "Unable to start the server, please check the authority or whether the port is occupied";
//create_app
locale_strings[1601] = "Please enter a h5 game project name, and mobile platform support library.Example: {color_green}egret create_app [app_name] -f [h5_game_path] -t [template_path] {color_normal} \n If you do not install the latest mobile platform support library,please download from the following address：\nAndroid: http://www.egret-labs.org/download/egret-android-packager-download.html, \niOS:http://www.egret-labs.org/download/egret-ios-packager-download.html";
locale_strings[1602] = "EgretProperties.json missing or incorrectly formatted.  \n Please upgrade egret-core to the latest version from http://www.egret-labs.org/download/egret-download.html";
locale_strings[1603] = "create_app.json is missing in {color_red}{0}{color_normal}.\nPlease download the latest mobile platform support library from the following address \nAndroid:  http://www.egret-labs.org/download/egret-android-packager-download.html\niOS:  http://www.egret-labs.org/download/egret-ios-packager-download.html";
locale_strings[1604] = "Egret Build command failed";
locale_strings[1605] = "Mobile platform project directory cannot be the same one with html5 project directory, please modify the mobile platform project directory.";
locale_strings[1606] = "Created, total time: {0} second";
locale_strings[1607] = "> copy from project template ...";
locale_strings[1608] = "> replace all configure elements ...";
locale_strings[1609] = "> rename project name ...";
locale_strings[1610] = "Project name is missing. Example:{color_green}egret create_app [app_name] -f [h5_game_path] -t [template_path] {color_normal}";
locale_strings[1611] = "The project is exist, please use another name.Example:{color_green}egret create_app [app_name] -f [h5_game_path] -t [template_path] {color_normal}";
locale_strings[1612] = "The first letter of the project name must be a-z";
locale_strings[1613] = "unzip exception!";
locale_strings[1614] = "The project.properties file could not be found. app_path: {0}";
locale_strings[1615] = "The build.gradle file could not be found. app_path: {0}";
locale_strings[1616] = "The platforms folder could not be found. android_home: {0}";
locale_strings[1617] = "The source.properties file could not be found. platformDir: {0}";
locale_strings[1618] = "The build_tools folder could not be found. android_home: {0}";
locale_strings[1619] = "The source.properties file could not be found. buildToolDir: {0}";

//upgrade
locale_strings[1701] = "Project version is lower than egret version, please implement egret upgrade {your_project} command to upgrade your project, \n do not add braces {} in the commands";
locale_strings[1702] = "Upgrade successfully";
locale_strings[1703] = "Upgrade script completed . Please check {color_underline}{0}{color_normal} for details";
locale_strings[1704] = "Updating to {0}";
locale_strings[1705] = "Update error，pleaet try again after reset engine";
locale_strings[1706] = "Total {color_red}{0}{color_normal} API conflicts,please edit your project then rerun build command";
locale_strings[1707] = "Copy files from {0} to {1} ..";
locale_strings[1711] = "The project directory has been changed,please use the new directory{color_red} '{0}' {color_normal},and use the command {color_red} egret apitest {your-project} {color_normal} testing the difference between the APIs";
locale_strings[1712] = "The testing result was writing in'{0}'";
locale_strings[1713] = "{color_green}Egret QQ group 481169576 {color_normal}";
locale_strings[1714] = "Updating the egretProperties.json";
locale_strings[1715] = "Project testing sucessfully";
locale_strings[1716] = "You use the old 3rd part library {0}.Please make sure these files not used the removed API or use the compatible 3rd party library {1}";
locale_strings[1717] = "upgrade interruption, for the following reasons";
locale_strings[1718] = "5.0.8 later version will delete template/debug/index.html template file, use index.html directly";
//info
locale_strings[1801] = "Egret version：{0}";
locale_strings[1802] = "Egret installation path:{0}";
//help
locale_strings[1901] = "The help file for {0} command can't be found ";
locale_strings[1902] = "How to use: {0}";
locale_strings[1903] = "How to use: egret <command> [-v]";
locale_strings[1904] = "command list:";
locale_strings[1905] = "Parameter list:";
locale_strings[1906] = "{0} print a detailed log";
locale_strings[1907] = "Use egret help <command> to understand details of each command";
//exml
locale_strings[2001] = "{0}: error EXML file can't be found ";
locale_strings[2002] = "{0}: error XML file error {1}";
locale_strings[2003] = "{0}: error the class definitions corresponding to nodes can't be found  \n {1}";
locale_strings[2004] = "{0}: error nodes cannot contain id property with the same name \n {1}";
locale_strings[2005] = "{0}: error property with the name of '{1}' or style name does not exist on the node: \n {2}";
locale_strings[2006] = "{0}: error undefined view state name: '{1}' \n {2}";
locale_strings[2007] = "{0}: error only egret.IVisualElement objects within the container can use the includeIn and excludeFrom properties\n {1}";
locale_strings[2008] = "{0}: error fail to assign values of '{1}' class to property: '{2}' \n {3}";
locale_strings[2009] = "{0}: error only one ID can be referenced in the node property value '{}' label, and complex expression is not allowed to use \n {1}";
locale_strings[2010] = "{0}: error ID referenced by property: '{1}':  '{2}' does not exist \n {3}";
locale_strings[2011] = "{0}: error fail to assign more than one child nodes to the same property: '{1}' \n {2}";
locale_strings[2012] = "{0}: error no default property exists on the node, and you must explicitly declare the property name that the child node is assigned to \n {1}";
locale_strings[2013] = "{0}: error view state grammar is not allowed to use on property nodes of Array class \n {1} ";
locale_strings[2014] = "{0}: error assigning the skin class itself to the node property is not allowed \n {1}";
locale_strings[2015] = "{0}: error class definition referenced by node: {1} does not exist \n {2}";
locale_strings[2016] = "{0}: error format error of 'scale9Grid' property value on the node: {1}";
locale_strings[2017] = "{0}: error namespace prefix missing on the node: {1}";
locale_strings[2018] = "{0}: error format error of 'skinName' property value on the node: {1}";
locale_strings[2019] = "{0}: error the container’s child item must be visible nodes: {1}";
locale_strings[2020] = "{0}: error error for child nodes in w: Declarations, the includeIn and excludeFrom properties are not allowed to use \n {1}";
locale_strings[2102] = "{0}: warning no child node can be found on the property code \n {1}";
locale_strings[2103] = "{0}: warning the same property '{1}' on the node is assigned multiple times \n {2}";

// android sdk install
locale_strings[2201] = "{0} file(s) will be downloaded!";
locale_strings[2202] = "The total size is {0}MB";
locale_strings[2203] = "Start to download!";
locale_strings[2204] = "{0} downloaded successfully!";
locale_strings[2205] = "This file size is {0}MB";
locale_strings[2206] = "All files are downloaded successfully!";
locale_strings[2207] = "{0} file(s) will be unzipped and installed!";
locale_strings[2208] = "Start to unzip and install!";
locale_strings[2209] = "{0} unzipped and installed successfully!";
locale_strings[2210] = "All files are unzipped and installed successfully!";
locale_strings[2211] = "Android SDK installed successfully!";

locale_strings[8001] = "please input value of the command option {color_green} {0} {color_normal},and it must be one of these: {color_green}[{1}]{color_normal}";
locale_strings[8002] = "{color_red}Please choose the Egret project folder{color_normal}\n\tEgret_Project\t\t{color_gray}//project folder{color_normal}\n\t\t--launcher\t{color_gray}//launcher folder{color_normal}\n\t\t--src\t\t{color_gray}//source code folder{color_normal}";
locale_strings[8003] = "The configuration file {0} not exist";
locale_strings[8004] = "{color_red}Create Native project first and use command --runtime native{color_normal}";

locale_strings[9999] = "unknown error:{0}";

locale_strings[10001] = "Compiler option {0} expects an argument";
locale_strings[10002] = "Unknown Compiler option {0}";
locale_strings[10003] = "TSC is trying to exit, exit code is: {0}";
locale_strings[10004] = "No output file name when minify flag is true";
locale_strings[10006] = "manifest.json has been generated";
locale_strings[10008] = "Duplicate interface or class name：‘{0}’ is defined both in these files ：\n{1}\n{2}";
locale_strings[10009] = "{0} is not in the right format, you may need to reinstall Egret.";
locale_strings[10010] = "Auto compile service is running...";
locale_strings[10011] = "Auto compile is done.";
locale_strings[10012] = 'If you are not using auto compile file save, you can enable auto compile by adding "-a" after the "run" command';
locale_strings[10013] = "Egret server is running, you can access by URL: {0}";
locale_strings[10014] = "Error occurred while compiling your code：";
locale_strings[10015] = "{color_red}\"{0}\" is not a valid Egret project folder{color_normal}" +
    "\n\tEgret_Project\t\t\t//project folder" +
    "\n\t\t--template\t\t//template folder" +
    "\n\t\t--libs\t\t\t//library folder" +
    "\n\t\t--resource\t\t//resource folder" +
    "\n\t\t--src\t\t\t//source code folder" +
    "\n\t\t--egretProperties.json\t//project configuration file" +
    "\n\t\t--index.html\t\t//launcher file"
    ;
locale_strings[10016] = "Please visit {0} if the browser didn't open it automatically";
locale_strings[10017] = "Egret project is created, you can execute \"Egret run\" to run the project";
locale_strings[10018] = "Found circular dependency when try to sort the TypeScript files. "
    + "Maybe you are create an instance of a subclass and assign it to a static member, "
    + "or using a subclass in immediately executing codes";
locale_strings[10019] = "Cannot find the projects used to build native apps. These projects are not include on the Github."
    + "Please visit http://www.egret.com to download the Egret Installer. If you have install Egret, please contact us.";
locale_strings[10020] = "Compile service is exit unexpectedly";
locale_strings[10021] = "Error with the folders, Please note the following items: 1. Please check  template/runtime/native_require.js, if it’s void, please recreate a new project and replace it.\n 2.Don’t create native project on the desktop, put all the files into a same place like E disk partition.\n  Please don’t execute the script immediately after configuration because of operation system refresh. If still doesn’t work after try several times, please send email to XX contact us.";

locale_strings[12000] = "Create a new Egret Project";
locale_strings[12001] = "Please select a template";
locale_strings[12002] = "Please set the default screen size";
locale_strings[12003] = "Please select the Scale Mode";
locale_strings[12004] = "Please select modules";
locale_strings[12005] = "Please select the platform";

module helpModule {
    export var help_dict = {
        "lib_name": "The third pard library name, use the os file-naming conventions",
        "common_proj_name": "The project name, use the os file-naming conventions",
        "common_app_name": "The mobile application name, use the os file-naming conventions",
        "form": "Directions",
        "desc": "Description",
        "detail": "Detailed parameters",
        "info0": "The Egret version, and install path",
        "upgrade0": "Upgrade you project when the Egret engine is update",
        "ss0": "Start the Egret server, and run your project in browser",
        "ss1": "Set the port number",
        "ss2": "Whether to use the local IP",
        "ss3": "Whether only run the server",
        "create_manifest0": "Make a file list manifest.json in the project folder",
        "create_manifest1": "Make a file list for all of files in project, if not assigned, only for used files",
        "create_app1": "The path of a app project corresponding a H5 project",
        "create_app2": "The path of the template",
        "pub1": "Publish your project,ues GoogleClosureCompiler to compress the code",
        "pub3": "The version after publish, not must be set",
        "pub4": "Release to html5 or native, html5 is the default type",
        "pub5": "Whether to compress the js code after publish",
        "pub6": "Set a password when release to a zip file",
        "create1": "Create a new project",
        "create2": "The type of the new project, core or eui, core is the default type.",
        "create_lib1": "Create a new third part library",
        "build0": "Compile the TypeScript files in project.",
        "build1": "Compile the TypeScript files in project and copy the Egret engine code",
        "build2": "Clean the libs and bin-debug files, it works when use the -e parameter",
        //,"build3":"只编译引擎中指定的部分模块，不编译项目；不填则编译全部模块",
        "build4": "Compile the exml files and create the ts files",
        "build5": "If the native project is exist, it will also be copy to the native project",
        //,"build6":"编译游戏时，根据game_file_list获取编译列表",
        "build7": "Show the execuing procedure",
        "clean": "Clean the code in libs folder, copy these files again, and compile the project"
    };

    export var help_title = {
        //titles,
        "create": "Create a new project",
        "build": "Compile the TypeScript files in project",
        "publish": "Publish the project, ues GoogleClosureCompiler to compress the code",
        "startserver": "Start HttpServer, run the project in you browser",
        "clean": "Reset the Egret engin code in the project",
        "create_lib": "Create a new third part library",
        "create_app": "Create a native app form Html5",
        "upgrade": "Upgrade the project code",
        "make": "Rebuild the Egret engine source code",
        "info": "Get information of the Egret engine",
        "apitest": "Check the api was replaced or not after upgrade engine. Only for the 2.4(or before) upgrade to 2.5(or later).Use this command in 2.5(or later) project"
    };

    global["helpModule"] = global["helpModule"] || helpModule;
    //global["helpModule"]["help_dict"] = help_dict;
}
