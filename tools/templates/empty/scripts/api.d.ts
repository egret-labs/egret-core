
/**
 * ResourceManager 配置文件
 */
type ResourceManagerConfig = {
    /**
     * 配置文件生成路径
     */
    configPath: string,
    /**
     * 资源根目录路径
     */
    resourceRoot: () => string,
    /**
     * 构建与发布配置
     */
    buildConfig: (param: {
        command: 'build' | 'publish',
        target: string,
        projectName: string,
        version: string
    }) => UserConfig,
    /**
     * 设置资源类型
     */
    typeSelector: (path: string) => (string | null | undefined)
    /**
     * 设置资源的合并策略
     */
    mergeSelector?: (path: string) => (string | null | undefined),
    /**
     * 设置资源的命名策略
     * beta 功能，请勿随意使用
     */
    nameSelector?: (path: string) => (string | null | undefined)
}
/**
 * 构建配置
 */
type UserConfig = {
    /**
     * 输出路径
     */
    outputDir: string,
    /**
     * 插件
     */
    commands: (string | plugins.Command)[]
}


declare namespace plugins {

    interface Command {

        onFile?(file: File): Promise<File | null>

        onFinish?(): Promise<any>

        [options: string]: any;
    }

    interface File {

        contents: Uint8Array | null;

        cwd: string;


        base: string;


        path: string;


        readonly history: ReadonlyArray<string>;

        relative: string;

        dirname: string;

        basename: string;


        extname: string;

        origin: string;

        [customProperty: string]: any;

    }

}










declare module 'built-in' {

    /**
     * 混淆插件参数，设置源代码和目标代码
     */
    type UglifyPluginParam = { sources: string[], target: string };

    type UglifyPluginParams = UglifyPluginParam[];

    /**
     * 混淆插件
     */
    export class UglifyPlugin implements plugins.Command {

        constructor(mergeSelector: UglifyPluginParams);

    }

    /**
     * 编译命令
     */
    export class CompilePlugin implements plugins.Command {

        constructor();
    }

    /**
     * EXML 插件，用于发布 EXML 文件
     */
    export class ExmlPlugin implements plugins.Command {

        constructor(publishPolicy: EXML_Publish_Policy);

    }

    /**
     * 发布策略
     * * default : 使用 egretProperties.json 中的 exmlPublishPolicy 中的策略
     * * debug : 默认策略，用于开发环境
     * * contents : 将 EXML 的内容写入到主题文件中
     * * gjs : 将生成的JS文件写入到主题文件中
     * * commonjs : 将EXML合并为一个 CommonJS 风格的文件(暂未开放)
     */
    type EXML_Publish_Policy = "default" | "debug" | "contents" | "gjs" | "commonjs"


    /**
     * 生成 manifest 文件，这个文件会被用于记录 JavaScript 文件的版本号
     */
    export class ManifestPlugin implements plugins.Command {

    }

    /**
     * 增量编译
     * 这个功能将会在未来被 watch 模式代替掉
     */
    export class IncrementCompilePlugin implements plugins.Command {

    }


    /**
     * 自动纹理合并，beta
     */
    export class SpriteSheetPlugin implements plugins.Command {

    }

}