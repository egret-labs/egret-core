
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
    commands: (string | BuildPlugin)[]
}


interface BuildPlugin {

    onFile?(file: any): Promise<any>

    onFinish?(): Promise<any>

    [options: string]: any;
}




declare module 'built-in' {

    export class UglifyPlugin implements BuildPlugin {

        constructor();

        match(source: string[], target: string);
    }

    /**
     * 编译命令
     */
    export class CompilePlugin implements BuildPlugin {

        constructor();
    }

    /**
     * EXML 插件，用于发布 EXML 文件
     */
    export class ExmlPlugin implements BuildPlugin {

        constructor(publishPolicy: EXML_Publish_Policy);

    }

    /**
     * 发布策略
     * * path : 默认策略，用于开发环境
     * * commonjs : 将EXML合并为一个 CommonJS 风格的文件
     * * commonjs-debug : 
     * * contents : 将 EXML 的内容写入到主题文件中
     * * gjs : 将生成的JS文件写入到主题文件中
     */
    type EXML_Publish_Policy = "path" | "commonjs" | "contents" | "gjs";


    /**
     * 生成 manifest 文件，这个文件会被用于记录 JavaScript 文件的版本号
     */
    export class ManifestPlugin implements BuildPlugin {

    }

    /**
     * 增量编译
     * 这个功能将会在未来被 watch 模式代替掉
     */
    export class IncrementCompilePlugin implements BuildPlugin {

    }

}