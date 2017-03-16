import * as xml2js from 'xml2js';
import * as fs from '../../lib/FileUtil';
import * as path from 'path';
// import * as utils from 'egret-node-utils';

export async function changeInheritActivity(filePath, libPackageName) {
    let fileContent:string = await fs.readFileAsync(filePath, "utf-8");
    fileContent = fileContent.replace(/com.egret.androidsupport.GameActivity/, `${libPackageName}.GameActivity`);
    await fs.writeFileAsync(filePath, fileContent, "utf-8");
}

export async function modifyAndroidSDKProject(sdkName, sdkProjectPath, sdkPackageName) {
    let prevPackagePath = `src/com/egret/androidsupport${path.sep}${sdkName}`;
    let replaceRex = new RegExp(`com.egret.androidsupport.${sdkName}`, "gi");
    changeProjectPackageName(sdkProjectPath, prevPackagePath, sdkPackageName, replaceRex);
}

export async function modifyAndroidProject(projectPath, packageName) {
    let prevPackagePath = "src/com/egret/androidsupport";
    let replaceRex = /com.egret.androidsupport/gi;
    changeProjectPackageName(projectPath, prevPackagePath, packageName, replaceRex);
}

export async function addAndroidProjectLib(hostProjectPath, addLibPath, index) {
    let propertiesFilePath = path.join(hostProjectPath, "project.properties");
    var fileContent = await fs.readFileAsync(propertiesFilePath, "utf-8");
    fileContent += `\nandroid.library.reference.${index}=${path.relative(hostProjectPath, addLibPath)}`;
    await fs.writeFileAsync(propertiesFilePath, fileContent, "utf-8");
}

export async function markAndroidProjectAsLib(projectPath) {
    let propertiesFilePath = path.join(projectPath, "project.properties");
    var fileContent = await fs.readFileAsync(propertiesFilePath, "utf-8");
    fileContent += '\nandroid.library=true';
    await fs.writeFileAsync(propertiesFilePath, fileContent, "utf-8");
}

async function changeProjectPackageName(projectPath, prevPackagePath, packageName, replaceRex) {

    let manifestPath = path.join(projectPath, "AndroidManifest.xml");
    let content = await fs.readFileAsync(manifestPath, "utf-8");
    let obj = await parseXML(content);
    await modifyPackageName(projectPath, obj, packageName, prevPackagePath, replaceRex);
    content = await stringifyXML(obj);
    content = content.replace(replaceRex, packageName);
    await fs.writeFileAsync(manifestPath, content, "utf-8");
    await modifyProjectConfig(projectPath);

}


let stringifyXML = async (obj) => {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    return xml;
}

let parseXML = async (content: string) => {
    return new Promise<any>((reslove, reject) => {
        xml2js.parseString(content, function (err, result) {
            reslove(result);
        });
    })
}

let modifyFile = async (path, packageName, replaceRex) => {
    var fileContent = await fs.readFileAsync(path, "utf-8");
    fileContent = fileContent.replace(replaceRex, packageName);
    await fs.writeFileAsync(path, fileContent, "utf-8");
}

async function modifyProjectConfig(projectPath) {
    let profileConfigPath = path.join(projectPath, ".project");
    let content = await fs.readFileAsync(profileConfigPath, "utf-8");
    let obj = await parseXML(content);
    obj.projectDescription.name = path.basename(projectPath, "");
    content = await stringifyXML(obj);
    await fs.writeFileAsync(profileConfigPath, content, "utf-8");
}

let modifyPackageName = async (projectPath, obj, packageName: string, prevPackagePath, replaceRex) => {
    let sourceDir = prevPackagePath;
    let targetDir = path.join("src", packageName.split(".").join(path.sep));

    let androidSrcDir = path.join(projectPath, "src");
    let javaFileList = fs.search(androidSrcDir,"java");
    // let allFileList = await utils.walk(path.join(projectPath, "src"), (p) => fs.statSync(p).isFile());
    // let javaFileList = allFileList.filter((path) => path.indexOf(".java") >= 0);
    let mapper = (item, index, arrayIndex) => modifyFile(item, packageName, replaceRex);
    await Promise.all(javaFileList.map(mapper));
    await fs.moveAsync(path.join(projectPath, sourceDir), path.join(projectPath, targetDir));
    obj.manifest.$.package = packageName;
}