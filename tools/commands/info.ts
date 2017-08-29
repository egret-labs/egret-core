/// <reference path="../lib/types.d.ts" />

class info implements egret.Command {
    execute(): number {
        globals.log(1801, egret.version);
        globals.log(1802, egret.root);
        return 0;
    }
}

function getEnvLocale(env) {
	env = env || process.env;
	return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
}

export = info;