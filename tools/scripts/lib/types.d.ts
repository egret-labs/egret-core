/// <reference path="node.d.ts" />
/// <reference path="totaljs/totaljs.d.ts" />



declare module egret {

    export interface Command {
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
    export interface LarkToolArgs {
        action: string;
        projectDir: string;
        getTmpDir(): string;
        srcDir: string;
        projManifest: any;
        larkPropertiesFile: string;
        debugDir: string;
        releaseDir: string;
        templateDir: string;
        out: string;
        outDir: string;
        egretRoot?: string;
        port: number;
        host: string;
        websocketUrl: string;
        manageUrl: string;
        startUrl: string;
        debug?: boolean;

        publish?: boolean;
        includeLark?: boolean;
        minify?: boolean;
        sourceMap?: boolean;
        removeComments?: boolean;
        esTarget?: string;
        serverOnly?: boolean;
        declaration?: boolean;
        autoCompile?: boolean;
        fileName?:string;

        toJSON: () => any;
        getProject(empty?:boolean): egret.ILarkProject;
        //工具用
    }

    export interface ILarkProject {
        modules?: LarkModule[];
        platforms?: LarkPlatform[];
        port?: number;
        scaleMode?: string;
        contentWidth?: number;
        contentHeight?: number;
        template?: string;
        toJSON?(): ILarkProject;
        save?(path?: string);
        orientationMode?: string;
        frameRate?: number;
        background?: string;
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
    }

    export interface ServiceBuildCommand extends ServiceCommand {
        changes: string[];
    }
    export interface ServiceCommandResult extends ServiceCommand {
        exitCode: number;
        messages: string[];
    }

    export var options: LarkToolArgs;

    module server {
        export var options: LarkToolArgs;
        export interface ViewModel {
            options: LarkToolArgs;
        }
        export var console: {
            on(event: string, listener: Function): any;
            removeListener(event: string, listener: Function): any;
        };
        export var IPs: string[];
    }

    export var manifest: egret.LarkManifest;
    export interface LarkManifest {
        version: string;
        modules: LarkModule[];
        platforms: LarkPlatform[];
        configurations: CompileConfiguration[];
        scaleModes: LarkScaleMode[];
        orientationModes: LarkOrientationMode[];
    }

    export interface LarkScaleMode {
        name: string;
        description: string;
    }
    export interface LarkOrientationMode {
        name: string;
        description: string;
    }

    
    
    export interface LarkModule {
        name: string;
        description?: string;
        files?: Array<string|LarkSourceFile>;
        dependencies?: string[];
        root?: string;
        noOtherTs?: boolean;
    }

    export interface LarkSourceFile {
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

    export interface LarkPlatform {
        name: string;
        description?: string;
        declaration?: boolean;
    }
}

