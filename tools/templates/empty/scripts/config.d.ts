
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
    buildConfig: (param: { command: string, target: string, projectName: string }) => UserConfig,
    /**
     * 设置资源类型
     */
    typeSelector: (path: string) => (string | null)
    /**
     * 设置资源的合并策略
     */
    mergeSelector?: (path: string) => (string | null),
    /**
     * 设置资源的命名策略
     * beta 功能，请勿随意使用
     */
    nameSelector?: (path: string) => (string | null)
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
    commands: string[]
}
