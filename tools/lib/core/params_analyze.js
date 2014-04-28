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


exports.getEnv = _getEnv;

exports.getEgretPath = function(){
    var obj = _getEnv();
    if (!obj.EGRET_PATH){
        console.log ("请先设置环境变量 EGRET_PATH");
        process.exit();
    }
    console.log(obj);
}




exports.getArgv = getArgv;