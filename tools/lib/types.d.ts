/// <reference path="node.d.ts" />
/// <reference path="totaljs/totaljs.d.ts" />
/// <reference path="xml/xml.ts" />
/// <reference path="../globals.ts" />



declare module egret {

    export interface Command {
        isAsync?:boolean;
        execute():number;
    }

    export interface Action {

    }

    export interface Map<T> {
        [index: string]: T;
    }

    export interface DiagnosticMessage {
        key: string;
        category: DiagnosticCategory;
        code: number;
        isEarly?: boolean;
    }

    export enum DiagnosticCategory {
        Warning,
        Error,
        Message,
    }
    export interface ToolArgs {
        command: string;
        action?: string;
        commands?: string[];
        platform?: string;

        type?: string;
        native?: boolean;
        runtime?: string;
        version?: string;
        compile?: boolean;
        password?: string;
        keepEXMLTS: boolean;
        exmlGenJs:boolean;
        log: boolean;
        nativeTemplatePath: string;
        all: boolean;
        projectDir: string;
        libsDir: string;
        getTmpDir(): string;
        srcDir: string;
        larkPropertiesFile: string;
        debugDir: string;
        releaseDir: string;
        releaseRootDir: string;
        templateDir: string;
        out: string;
        outDir: string;
        /** 用户命令行指定的引擎版本 */
        egretVersion?: string;
        port: number;
        host: string;
        websocketUrl: string;
        manageUrl: string;
        startUrl: string;
        debug?: boolean;
        getStartURL(address: string): string;
        template?: string;
        /**
        * egretProperties.json 信息
        */
        properties: EgretPropertiesClass;


        publish?: boolean;
        minify?: boolean;
        sourceMap?: boolean;
        removeComments?: boolean;
        esTarget?: string;
        serverOnly?: boolean;
        declaration?: boolean;
        autoCompile?: boolean;
        fileName?: string;
        added: string[];
        removed: string[];
        modified: string[];

        toJSON: () => any;
        getProject(empty?:boolean): egret.ILarkProject;
        //工具用
    }

    export interface ILarkTheme {
        skins?: { [host: string]: string };
        exmls?: Array<any>;
        autoGenerateExmlsList?: boolean;
    }

    export interface EgretProperties {
        document_class?: string;
        modules?: EgretModule[];
        native?: any;
        egret_version?: string;
    }
    export interface EgretPropertiesClass {
        properties: Object;
        modulesConfig: Object;
        init(projectRoot: string);
        reload();
        /**
         * 是否有swan
         */
        hasEUI(): boolean;

        /**
         * 获取项目的根路径
         * @returns {*}
         */
        getProjectRoot(): string

        /**
         * 获取项目使用的egret版本号
         * @returns {any}
         */
        getVersion(): string

        /**
         * 发布路径的根目录
         * @returns {string}
         */
        getReleaseRoot(): string

        /**
         * 获取已经生成的js文件列表
         * @param runtime
         * @returns {string[]|T[]}
         */
        getAllFileList(runtime): Array <any>

        getVersionCode(runtime)

        getIgnorePath(): Array <any>

        getNativePath(platform)

        getModulePath(moduleName)

        getModuleConfig(moduleName)

        //绝对路径
        getModuleOutput(moduleName)

        getModuleFileList(moduleName)
        getModuleFileListWithAbsolutePath(moduleName)

        getModulePrefixPath(moduleName)

        getModuleSourcePath(moduleName)

        getModuleDependenceList(moduleName)

        getAllModuleNames()

        getModuleDecouple(moduleName)

        //获取项目需要的所有模块的.d.ts文件
        getModulesDts()

        getModuleReferenceInfo()

        getResourceName()

        getPublishType(runtime:string):number;
        getResources():Array<string>;
    }

    export interface ILarkProject {
        modules?: EgretModule[];
        platform?: string;
        port?: number;
        scaleMode?: string;
        contentWidth?: number;
        contentHeight?: number;
        type?: string;
        toJSON?(): ILarkProject;
        save?(path?: string);
        orientationMode?: string;
        frameRate?: number;
        background?: string;
        entryClass?: string;
        moduleScripts?: string[];
        scripts?: string[];
        nativeScripts?: string[];
        resolutionMode?: string;
        showFPS?: boolean;
        showPaintRect?: boolean;
        fpsStyles?: string;
        showLog?: boolean;
        logFilter?: string;
        maxTouches?: number;
        textureScaleFactor?: number;
        [others: string]: any;
    }

    export interface CommandLineOption {
        name: string;
        type: string | Map<number>;         // "string", "number", "boolean", or an object literal mapping named values to actual values
        shortName?: string;                 // A short mnemonic for convenience - for instance, 'h' can be used in place of 'help'.
        description?: DiagnosticMessage;    // The message describing what the command line switch does
        paramType?: DiagnosticMessage;      // The name to be used for a non-boolean option's parameter.
        error?: DiagnosticMessage;          // The error given when the argument does not fit a customized 'type'.
    }

    export interface ServiceCommand {
        command: string;
        path?: string;
        version?: string;
        option: ToolArgs;
        [others: string]: any;
    }

    export interface TaskResult {
        exitCode: number;
        messages: string[];
    }

    export interface ServiceBuildCommand extends ServiceCommand {
        changes: FileChanges;
    }
    export interface ServiceCommandResult extends ServiceCommand {
        exitCode: number;
        messages: string[];
    }

    export var args: ToolArgs;
    /** 当前引擎版本 */
    export var version: string;
    export var root: string;

    module server {
        export var options: ToolArgs;
        export interface ViewModel {
            options: ToolArgs;
            [other:string]:any;
        }
        export var console: {
            on(event: string, listener: Function): any;
            removeListener(event: string, listener: Function): any;
        };
        export var IPs: string[];
    }

    export var manifest: egret.Manifest;
    export interface Manifest {
        registerClass:string;
        modules: EgretModule[];
        platforms: TargetPlatform[];
        configurations: CompileConfiguration[];
        scaleModes: ScaleMode[];
        orientationModes: OrientationMode[];
        templates: ProjectTemplate[]
    }

    export interface ScaleMode {
        name: string;
        description: string;
    }
    export interface OrientationMode {
        name: string;
        description: string;
    }
    export interface ProjectTemplate {
        name: string;
        description: string;
        modules: string[];
    }


    export interface EgretModule {
        name: string;
        description?: string;
        files?: Array<string|ManifestSourceFile>;
        dependencies?: string[];
        sourceRoot?: string;
        root?: string;
        outFile?: string;
        noOtherTs?: boolean;
    }

    export interface ManifestSourceFile {
        platform?: string;
        debug?: boolean;
        path:string
    }

    export interface CompileConfiguration {
        name: string;
        description?: string;
        minify?: boolean;
        declaration?: boolean;
    }

    export interface TargetPlatform {
        name: string;
        description?: string;
        declaration?: boolean;
    }

    export interface IEXMLHandler {
        compile(): number;
        compileSingle(path: string): number;
    }

    export type FileChanges = Array<FileChange>;

    export interface FileChange {
        fileName: string;
        type: string;
    }
}

declare var DEBUG: boolean;
declare var DontExitCode: number;
