/**
 * Created by jackyanjiaqi on 17/3/8.
 */
import * as config from './native/config';
import * as create from "./native/create";
import * as deploy from "./native/deploy";
import * as release from "./native/release";

class EgretNative implements egret.Command {
    execute():number|PromiseLike<number> {
        let commands = egret.args.commands;
        if(commands[1]){
            console.log("projectDir:",egret.args.projectDir);
            console.log("egret.args:",egret.args);
            if(!egret.args.projectDir){
                globals.exit(13000);
            }else{
                try{
                    let subCommander = commands[1];
                    let runner = require("./native/"+subCommander);
                    config.initConfig(egret.args.projectDir);
                    runner.run(egret.args);
                }catch(err){
                    console.error(err);
                    console.log(commands);
                }
            }
        }
        return DontExitCode;
    }
}
/**
 * 解析子命令的参数(与原命令行的全局参数不同,只在子命令中设置并起作用)
 * @param args
 * @returns {{}}
 */
// function parseArgs(args:string[]){
//     console.log("beforeParseArgs",args);
//     let ret = {};
//     while(args.length >=2 && args[0].indexOf("-")!==-1){
//         switch(args[0]){
//             case "--androidProjectPath":
//                 ret["androidProjectPath"] = args[1];
//                 args.splice(0,2);
//                 break;
//             case "--sdk":
//                 ret["sdk"] = args[1];
//                 args.splice(0,2);
//                 break;
//         }
//     }
//     console.log("afterParseArgs",ret);
//     return ret;
// }

export = EgretNative;