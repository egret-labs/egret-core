
function run(currDir, args, opts) {
    
    console.log("//创建一个新工程");
    console.log("egret c|create proj-name [-e engineUrl] [-u url]");
    console.log("//删除一个工程");
    console.log("egret r|remove proj-name [-u url]");
    console.log("//构建一个工程");
    console.log("egret b|build [-e|(-g [proj-name1, ...])] [-u url]");
    console.log("");
}

exports.run = run;