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

/// <reference path="../lib/node.d.ts" />


global["$locale_strings"] = global["$locale_strings"] ||{};
var locale_strings = global["$locale_strings"];

locale_strings[10001] = "Compiler option {0} expects an argument";
locale_strings[10002] = "Unknown Compiler option {0}";
locale_strings[10003] = "TSC is trying to exit, exit code is: {0}";
locale_strings[10004] = "No output file name when minify flag is true";
locale_strings[10006] = "manifest.json has been generated";
locale_strings[10008] = "Duplicate interface or class name：‘{0}’ is defined both in these files ：\n{1}\n{2}";
locale_strings[10009] = "{0} is not in the right format, you may need to reinstall Egret.";
locale_strings[10010] = "Auto compile service is running...";
locale_strings[10011] = "Auto compile is done.";
locale_strings[10012] = 'If you are not using auto compile on file save, you can enable auto compile by adding "-a" after the "run" command';
locale_strings[10013] = "Egret server is running, you can access by URL: {0}";
locale_strings[10014] = "Error occurred while compiling your code：";
locale_strings[10015] = "\"{0}\" is not a valid Egret project folder";
locale_strings[10016] = "Please visit {0} if no browser open it automatically";
locale_strings[10017] = "Egret project is created, you can execute \"Egret run\" to run the project";
locale_strings[10018] = "Found circular dependency when try to sort the TypeScript files. "
                      + "Maybe you are create an instance of a subclass and assign it to a static member, "
                      + "or using a subclass in immediately executing codes";
locale_strings[10019] = "Cannot find the projects used to build native apps. These projects are not include on the Github."
                      + "Please visit http://www.egret.com to download the Egret Installer. If you have install Egret, please contact us.";
locale_strings[10020] = "Compile service is exit unexpectedly";


locale_strings[12000] = "Create Egret Project";
locale_strings[12001] = "Please select a template";
locale_strings[12002] = "Please set the default screen size";
locale_strings[12003] = "Please select the Scale Mode";
locale_strings[12004] = "Please select modules";
locale_strings[12005] = "Please select the platform";

locale_strings[1705] = "upgrade files damaged,please check engine files and rerun";
locale_strings[1706] = "total {0} API conflicts,please edit your project then rerun command command";
//info
locale_strings[1] = "Error when compile project";