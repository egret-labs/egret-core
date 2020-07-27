import * as cp from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';


export function installDependencies(dependencies: string[]) {

    install("./scripts/plugins", dependencies)
}

export function installFromLauncher(packageNames: string[]) {
    for (const packageName of packageNames) {
        const launcherRoot = getEgretCompilerPath();
        installFromCustomPath(launcherRoot, packageName)
    }
}

export function installFromCustomPath(root: string, packageName: string) {
    const orgName = packageName.indexOf('@') == 0 ? packageName.split("/")[0] : '';
    const packageShortName = orgName ? packageName.split("/")[1] : packageName;
    const node_modules_dir = path.join(__dirname, 'node_modules')
    if (!fs.existsSync(node_modules_dir)) {
        fs.mkdirSync(node_modules_dir)
    }
    let target_root = node_modules_dir;
    if (orgName) {
        const node_modules_orgs_dir = path.join(node_modules_dir, orgName);
        if (!fs.existsSync(node_modules_orgs_dir)) {
            fs.mkdirSync(node_modules_orgs_dir);
        }
        target_root = node_modules_orgs_dir;
    }
    const target_forder = path.join(target_root, packageShortName)
    if (fs.existsSync(target_forder)) {
        return;
    }
    fs.symlinkSync(path.join(root, packageName), target_forder, 'junction')
}


function install(cwd: string, dependencies: string[]) {

    if (fs.existsSync(path.join(cwd, 'node_modules', dependencies[0]))) {
        return;
    }

    const cmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const args = [
        'install',
    ].concat(dependencies).concat([
        '--registry',
        'https://registry.npm.taobao.org'
    ]);
    console.log(`正在安装依赖'${cwd}`)
    console.log(`您也可以在${cwd}目录下手动执行 npm ${args.join(" ")}`)

    const result = cp.spawnSync(cmd, args, { cwd });
    if (result.error) {
        console.error('未找到 npm , 请安装最新版 NodeJS')
        process.exit();
    }
    if (result.stderr) {
        console.log(result.stderr.toString())
    }
    else {
        console.log(result.stdout.toString())
    }
}

function getAppDataPath(platform) {
    switch (platform) {
        case 'win32': return process.env['APPDATA'] || path.join(process.env.USERPROFILE!, 'AppData', 'Roaming');
        case 'darwin': return path.join(os.homedir(), 'Library', 'Application Support');
        case 'linux': return process.env['XDG_CONFIG_HOME'] || path.join(os.homedir(), '.config');
        default: throw new Error('Platform not supported');
    }
}

function getEgretCompilerPath() {
    const compilerFolder = path.join(getAppDataPath(process.platform), "EgretLauncher/download/EgretCompiler");

    if (!fs.existsSync(path.join(compilerFolder, "@egret"))) {
        const docsUrl = `https://docs.egret.com/engine/docs/build/install-and-upgrade`;
        throw new Error(`Egret Compiler 未安装,请访问 ${docsUrl} 了解更多`);
    }
    return compilerFolder
}