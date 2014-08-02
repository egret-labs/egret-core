var CodeUtil = require("../core/code_util.js");
var file = require("../core/file.js");

//var path = "D:/Program/HTML5/Hello/bin-debug/lib/extension/dragonbones/dragonBones.js";
//var text = file.read(path);
//text = analyze(text);
//file.save(path,text);

function analyze(text,ns){
    if(!text)
        return "";
    var jsText = "";
    while(text){
        var index = text.lastIndexOf(" = {}));");
        if(index==-1){
            text = addClassName(text,ns);
            jsText = text+jsText;
            break;
        }
        jsText = addClassName(text.substring(index),ns)+jsText;
        text = text.substring(0,index);
        var moduleName = CodeUtil.getLastWord(text);
        moduleName = CodeUtil.trimVariable(moduleName);
        index = moduleName.lastIndexOf(".");
        var lastName = index==-1?moduleName:moduleName.substring(index+1);
        if(!moduleName||!ns&&index!=-1){
            jsText = text+jsText;
            break;
        }
        var key = "})("+moduleName+" || ("+moduleName;
        if(text.substring(text.length-key.length)!=key){
            continue;
        }

        key = "(function ("+lastName+") {";
        index = text.lastIndexOf(key);
        if(index==-1){
            jsText = text+jsText;
            break;
        }
        var block = text.substring(index);
        text = text.substring(0,index);
        if(ns&&index==-1){
            jsText = block+jsText;
        }
        else{
            if(ns){
                lastName = ns+"."+lastName;
            }
            jsText = analyze(block,lastName)+jsText;
        }
    }
    return jsText;
}

function addClassName(text,ns){
    if(!ns){
        return text;
    }
    var index = ns.lastIndexOf(".");
    var moduleName = ns.substring(index+1);
    var jsText = "";
    while(text){
        index = text.lastIndexOf("})(");
        if(index==-1){
            jsText = text + jsText;
            break;
        }
        var tailStr = text.substring(index);
        text = text.substring(0,index);
        index = tailStr.indexOf("\n");
        if(index==-1){
            jsText = tailStr+jsText;
            continue;
        }
        var preStr = tailStr.substring(0,index+1);
        tailStr = tailStr.substring(index+1);
        var word = CodeUtil.getFirstVariable(tailStr);
        if(word!=moduleName){
            jsText = preStr+tailStr+jsText;
            continue;
        }
        index = tailStr.indexOf(word);
        var indent = tailStr.substring(0,index);
        preStr += tailStr.substring(0,index+word.length+1);
        tailStr = tailStr.substring(index+word.length+1);
        index = tailStr.indexOf(";");
        if(index==-1){
            jsText = preStr+tailStr+jsText;
            continue;
        }
        var asignment = tailStr.substring(0,index);
        tailStr = tailStr.substring(index+1);
        var arr = asignment.split(" = ");
        if(arr.length!=2||arr[0]!=arr[1]){
            jsText = preStr+asignment+";"+tailStr+jsText;
            continue;
        }
        var classStr = indent+arr[0]+".prototype.__class__ = \""+ns+"."+arr[0]+"\";";
        jsText = preStr+asignment+";\n"+classStr+tailStr+jsText;
    }
    return jsText;
}

exports.analyze = analyze;