var libs = require("./normal_libs.js");



getArgv = function(){
    var arr = process.argv.slice(2);

    var args = [];
    var i = 1, li = arr.length;
    for(; i < li; i++){
        var itemi = arr[i];
        if(itemi.search(/-(\w*)/) == 0) break;
        args.push(itemi);
    }

    var opts = {};
    var values4Opt = [];
    var name = null;
    for(; i < li; i++){
        var itemi = arr[i];
        if(itemi.search(/-(\w*)/) == 0){
            if(!name) name = itemi;
            else{
                opts[name] = values4Opt;
                name = itemi;
                values4Opt = [];
            }
        }else{
            values4Opt.push(itemi);
        }
    }

    if(name) opts[name] = values4Opt;

    var result = {
        name : arr[0],
        currDir : process.cwd(),
        args : args,
        opts : opts
    }

    return result;
};

function _getEnv(){
    return process.env;
}

function getOption(option,key,enumList){
    if (!option[key]){
        return enumList[0];
    }

    var value = option[key][0]
    if (!value || enumList.indexOf(value) == -1){
        libs.exit(8001,key,enumList);
    }
    return value;
}


exports.getEnv = _getEnv;

exports.getEgretPath = function(){
    var path = require("path");
    var obj = _getEnv();
    var egret_path = _getEnv().EGRET_PATH;
    if (!egret_path){
        egret_path = path.join(process.argv[1],"../../../");
    }
    return egret_path;
}




exports.getArgv = getArgv;

exports.getOption = getOption;