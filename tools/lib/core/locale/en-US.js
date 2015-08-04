exports.help_dict = {
    "common_proj_name":"Project name, which is named in accordance with the naming conventions of the operating system"
   ,"common_app_name":"Mobile application project name, which is named in accordance with the naming conventions of the operating system"

   , "form" : "How to use"
   , "desc" : "Description"
   , "detail" : "Parameter description"

   , "info0" : "Current Egret version, and the installation path"

   , "upgrade0" : " Upgrade projects following the upgrade of Egret engine"

   , "ss0" : "Start Egret’s built-in server, and allow immediately running  projects in the browser."
   , "ss1" : "Specify the port number. "
   , "ss2" : "Whether to use the computer’s IP "
   , "ss3" : "Whether to run the server only"

   , "create_manifest0" : "Generate  the manifest file (manifest.json) under the project directory."
   , "create_manifest1" : "Generate the list of all  files,  if  not specified, only a class list referenced by the document class is generated. "

   , "create_app1":"The path of h5 project corresponding to an app project"
   , "create_app2":"Template path"

   ,"pub1":"After publishing the project, use GoogleClosureCompiler compression code"
   ,"pub3":"Set the version number after the publishing, and you may also not set it"
   ,"pub4":"Set the publish mode to html5 or native mode, and the default value is html5"
   ,"pub5":"Set the zip file of launcher folder generated after the publishing."
   ,"pub6":"Set the unzip password for the published zip file"

   ,"create1":"Create a new project."
   ,"create2":"The project type core or gui to be created, and the default value is core"

   ,"build0":"Build the designated project, and compile the designated project’s TypeScript file"
   ,"build1":"Compile the engine directory while compiling the specified project"
   ,"build2":"Clear libs and bin-debug folders, which only takes effect under the premise of -e"
   //,"build3":"Compile only part of the modules specified in the engine, and do not  compile the project; compile all of the modules if it is not filled"
   ,"build4":"Retain the generated TS file while compiling EXML file"
   ,"build5":"If there is a native project, files will be copied to the project."
   //,"build6":"When compiling the game, you will get compiling lists according to game_file_list"
   ,"build7":"Show the execution procedure"

    //titles
   ,"title_build":"Build the designated project, and compile the designated project’s TypeScript file"
   ,"title_create":"Create a new project."
   ,"title_create_app":"Generate an app based on h5 game"
   ,"title_create_manifest":"Generate  the manifest file (manifest.json) under the project directory."
   ,"title_info":"Get Egret information"
   ,"title_publish":"After publishing the project, use GoogleClosureCompiler compression code"
   ,"title_startserver":"Start HttpServer, and open the specified project in the default browser."
   ,"title_upgrade":"Upgrade project code"
};

exports.error_code = {

    0:"Successful implementation",
    1:"Please first set the environment variable {color_green} EGRET_PATH {color_normal}. For more details, you can get access to{color_underline}https://github.com/egret-team/egret/wiki/Setting-environment-variables{color_normal}  ",
    2:"TypeScript compiler has not been installed, please implement {color_green} npm install -g typescript {color_normal} for installation",
    3:"Time: {0} second",
    4:"Script execution failed",
    5:"Confirm the execution path",
    6:"manifest.json generated successfully",
    7:"Total time for native copy: {0} second",
    //create
    1001:"Enter a project name. Example:  {color_green}egret create [project_name]{color_normal}",
    1002:"The project already exists",
    1003:"Creating a new project folder ...",
    1004:"Compiling the project ...",
    1005:"Created successfully ",
    //build
    1101:"Enter a project name. Example: {color_green}egret build [project_name]{color_normal}",
    1102:"bin-debug folder is not contained in the specified project, please implement {color_green} egret build [project_name] -e {color_normal} to initialize the engine",
    1103:"There is a circular dependency amongthe {0}: error files, please check the class inheritance or static variable initialization references.",
    1104:"Build successfully ",
    1105:"Compile the project:",
    1106:"Scan the project list",
    1107:"Time for scanning: {0} second",
    1108:"Total project compiling time: {0} second",
    1109:"Implement tsc compilation ",
    1110:"tsc compiling time: {0} second",
    1111:"{0} tsc compiles and generates js file",
    1112:"{0} uses time: {1} seconds",
    1113:"{0} tsc compiles and generates '.d.ts'",
    1114:"{0} Copy other documents",
    1115:"The total elapsed time of the 3rd party libraries: {0} secs",
    //compile
    1301:"Cannot find egret_file_list.js or game_file_list.js compiled under the path {0}, please check whether the compile path is correct",
    1302:"Please enter the compile path. Example: {color_green}egret compile --source [your_typescript_source_dir] --output [your_output_dir]{color_normal}",
    1303:"Compilation fails",
    1304:"Parsing manifest.json file parsing fails, check whether the file is in the correct JSON format: \n{0}",
    1305:"Reading launcher / {0} .html  fails, check whether the compile path is correct",
    1306:"Fail to  find variable definition of the document class 'document_class' in launcher /{0}, please check whether the contents of the file are correct",
    1307:".ts or .d.ts file {0} does not exist in the module, and cannot be compiled, so please fill.ts or .d.ts in file_list field of the module ",
    1308:"Class or interface name conflict: '{0}' exists in both of the following two files: \n {1} \n {2}",
    1309:"Compile successfully",
    //publish
    1401:" java can't be found or java version is too old (at least java 7), please install the java and execute egret publish -testJava command for test",
    1402:"Start to publish {0} version: {1}",
    1403:"Start to compress js file",
    1404:"Js file compression time: {0} second",
    1405:"Uncompressed js file, and js file copy",
    1406:"Js file copy time: {0} second",
    1407:"Scan version control file",
    1408:"Time to generate version control file: {0} second",
    1409:"Time to copy files to release: {0} second",
    1410:"Start to generate zip package",
    1411:"Time to generate zip package: {0} second",
    1412:"Total time for native copy: {0} seconds",
    1413:"Total to complete the release: {0} second",
    1414:"Fail to generate a zip package, and copy the file to the release",
    1415:"Executing the detection command: {0}",
    1416:"You can modify the JAVA_HOME environment variable to modify JAVA path",
    1417:"Successful detection ",
    1418:"WebP format fail : {0}",
    1419:"Format WebP : {0} / {1}",
    //startserver
    1501:"Unable to start the server, please check the authority or whether the port is occupied",
    //create_app
    1601:"Please enter a project name, h5 game directory and mobile platform support library. Example:  {color_green}egret create_app [app_name] -f [h5_game_path] -t [template_path] {color_normal} \n If the latest mobile platform support library is not installed, please download it from the following address: \nAndroid:  http://www.egret-labs.org/download/egret-android-packager-download.html, \niOS:http://www.egret-labs.org/download/egret-ios-packager-download.html",
    1602:"EgretProperties.json missing or incorrectly formatted.  \n Please upgrade egret-core to the latest version from http://www.egret-labs.org/download/egret-download.html",
    1603:" create_app.json is missing.\n Please download the latest mobile platform support library from the following address \n Android:  http://www.egret-labs.org/download/egret-android-packager-download.html, \n\tiOS:  http://www.egret-labs.org/download/egret-ios-packager-download.html",
    1604:"Egret build command execution fails",
    1605:"Mobile platform project directory cannot be the same one with html5 project directory, please modify the mobile platform project directory.",
    1606:"Created, total time: {0} second",
    1607:"> copy from project template ...",
    1608:"> replace all configure elements ...",
    1609:"> rename project name ...",
    //upgrade
    1701:"Project version is lower than egret version, please implement egret upgrade {your_project} command to upgrade your project, \n do not add braces {} in the commands",
    1702:"After the project upgrade, please implement egret build {your_project} {color_green} -e {color_normal} to compile the engine, \n Do not add braces {} in the commands",
    1703:"\n After the first step to upgrade is completed, {color_red} press {color_underline}https://github.com/egret-labs/egret-core/wiki/Egret_Upgrade/upgrade/index.html{color_red} to complete the remaining steps to upgrade {color_normal}\n",
    1704:"Updating to {0}",
    //info
    1801:"Current Egret version: {0}",
    1802:"Egret installation path: {0}",
    //help
    1901:" The help file for {0} command can't be found ",
    1902:"How to use:  {0}",
    1903:"How to use:  egret <command> [-v]",
    1904:"command list:",
    1905:"Parameter list:",
    1906:"{0} print a detailed log",
    1907:"Use egret help <command> to understand details of each command",
    9999:"An unknown error: {0}",
    8001:"Please enter parameters for command line options {color_green} {0} {color_normal}, and make sure it is one of the following values:  {color_green}[{1}]{color_normal}",
    8002:"{color_red} Please select the correct egret project directory! {color_normal}\n\tEgret_Project\t\t{color_gray}//Project directory{color_normal}\n\t\t--launcher\t{color_gray}//startup directory{color_normal}\n\t\t--src\t\t{color_gray}//source code directory{color_normal}",
    8003:"Configuration file {0} does not exist",
    8004:"{color_red} Please first create Native project and then perform --runtime native {color_normal}",
    2001:"{0}: error  EXML file can't be found ",
    2002:"{0}: error  invalid XML file",
    2003:"{0}: error  the class definitions corresponding to nodes can't be found  \n {1}",
    2004:"{0}: error nodes cannot contain id property with the same name \n {1}",
    2005:"{0}: error property with the name of '{1}' or style name does not exist on the node: \n {2}",
    2006:"{0}: error undefined view state name: '{1}' \n {2}",
    2007:"{0}: error only egret.IVisualElement objects within the container can use the includeIn and excludeFrom properties\n {1}",
    2008:"{0}: error  fail to assign values of '{1}' class to property: '{2}' \n {3}",
    2009:"{0}: error only one ID can be referenced in the node property value '{}' label, and complex expression is not allowed to use \n {1}",
    2010:"{0}: error ID referenced by property: '{1}':  '{2}' does not exist \n {3}",
    2011:"{0}: error  fail to assign more than one child nodes to the same property: '{1}' \n {2}",
    2012:"{0}: error no default property exists on the node, and you must explicitly declare the property name that the child node  is assigned to \n {1}",
    2013:"{0}: error view state grammar is not allowed to use on property nodes of Array class \n {1} ",
    2014:"{0}: error assigning the skin class itself to the node property is not allowed \n {1}",
    2015:"{0}: error class definition referenced by node: {1} does not exist \n {2}",
    2016:"{0}: error format error of 'scale9Grid' property value on the node: {1}",
    2017:"{0}: error namespace prefix missing on the node: {1}",
    2018:"{0}: error format error of 'skinName' property value on the node: {1}",
    2019:"{0}: error the container’s child item must be visible nodes: {1}",
    2020:"{0}: error for child nodes in w: Declarations, the includeIn and excludeFrom properties are not allowed to use \n {1}",
    2102:"{0}: warning no child node can be found on the property code \n {1}",
    2103:"{0}: warning the same property '{1}' on the node is assigned multiple times \n {2}"
};