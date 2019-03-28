/// <reference path="xml/xml.ts" />
/// <reference path="../globals.ts" />
/// <reference path="./typescript-plus/lib/typescriptServices.d.ts" />

declare module egret {

    export namespace target {

        export type Type = "web" | "native" | "wxgame" | "baidugame" | "qgame" | 'bricks' | 'ios' | 'android' | "any" | "none"

        export interface Info {
            name: Type;
            description?: string;
            declaration?: boolean;
        }
    }

    export interface Command {
        execute(): number | Promise<number>
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
        //子命令
        subCommand?: string;
        commands?: string[];

        type?: string;
        target?: egret.target.Type;
        version?: string;
        compile?: boolean;
        password?: string;
        keepEXMLTS: boolean;
        ide: string;
        exmlGenJs: boolean;
        log: boolean;
        templatePath: string;
        all: boolean;
        projectDir: string;
        getTmpDir(): string;
        srcDir: string;
        debugDir: string;
        releaseDir: string;
        releaseRootDir: string;
        templateDir: string;
        port: number;
        host: string | null;
        websocketUrl: string;
        startUrl: string;
        debug?: boolean;
        getStartURL(address: string): string;
        template?: string;
        publish?: boolean;
        minify?: boolean;
        sourceMap?: boolean;
        removeComments?: boolean;
        esTarget?: string;
        serverOnly?: boolean;
        declaration?: boolean;
        autoCompile?: boolean;
        experimental?: boolean;
        fileName?: string;
        added: string[];
        removed: string[];
        modified: string[];
        tsconfigError: string[];//tsconfig 配置文件的错误信息

        toJSON: () => any;
        getProject(empty?: boolean): egret.EgretProjectConfig;
        //工具用
    }

    export interface EgretEUIThemeConfig {
        path: string;
        skins?: { [host: string]: string };
        exmls?: Array<any>;
        autoGenerateExmlsList?: boolean;
        styles?: any;
    }

    export type EgretPropertyModule = {
        name: string,
        version?: string,
        path?: string;
    }


    export type EgretProperty = {
        "engineVersion"?: string,
        "compilerVersion"?: string,
        "modules": EgretPropertyModule[],
        "target"?: {
            "current": string
        }
        "template"?: {

        },
        "wasm"?: {

        },
        "native"?: {
            "path_ignore"?: string[];
        },
        "publish"?: {
            "web": number,
            "native": number,
            "path": string;
        },
        "egret_version"?: string;
    }

    export interface EgretProjectConfig {
        modules?: EgretModule[];
        platform?: string;
        port?: number;
        scaleMode?: string;
        contentWidth?: number;
        contentHeight?: number;
        type?: string;
        toJSON?(): EgretProjectConfig;
        save?(path?: string);
        orientationMode?: string;
        frameRate?: number;
        background?: string;
        entryClass?: string;
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
        alias?: string;                 // A short mnemonic for convenience - for instance, 'h' can be used in place of 'help'.
        description?: DiagnosticMessage;    // The message describing what the command line switch does
        paramType?: DiagnosticMessage;      // The name to be used for a non-boolean option's parameter.
        error?: DiagnosticMessage;          // The error given when the argument does not fit a customized 'type'.
    }

    export interface ServiceCommand {
        command: "build" | "shutdown" | "buildResult" | "status" | "buildResult" | "init";
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
            [other: string]: any;
        }
        export var console: {
            on(event: string, listener: Function): any;
            removeListener(event: string, listener: Function): any;
        };
        export var IPs: string[];
    }

    export var manifest: egret.Manifest;
    export interface Manifest {
        registerClass: string;
        modules: EgretModule[];
        platforms: target.Info[];
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
        files?: Array<string | ManifestSourceFile>;
        dependencies?: string[];
        sourceRoot?: string;
        root?: string;
        outFile?: string;
        noOtherTs?: boolean;
    }

    export interface ManifestSourceFile {
        platform?: string;
        debug?: boolean;
        path: string
    }

    export interface CompileConfiguration {
        name: string;
        description?: string;
        minify?: boolean;
        declaration?: boolean;
    }



    export interface IEXMLHandler {
        compile(): number;
        compileSingle(path: string): number;
    }

    export type FileChanges = FileChange[];

    export interface FileChange {
        fileName: string;
        type: 'added' | 'removed' | 'modified';
    }

}

declare var DEBUG: boolean;
declare var DontExitCode: number;
