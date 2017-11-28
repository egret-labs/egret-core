
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
        command: 'build' | 'publish', target: string, projectName: string
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
    commands: (string | Plugin)[]
}


interface Plugin {

    onFile?(file: any): Promise<any>

    onFinish?(): Promise<any>
}




declare module 'built-in' {

    export class UglifyPlugin implements Plugin {


    }

    export class CompilePlugin implements Plugin {

        constructor();
    }

    export class IncrementCompilePlugin implements Plugin {

        constructor();
    }

    /**
     * EXML 插件，用于发布 EXML 文件
     */
    export class ExmlPlugin implements Plugin {

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

}