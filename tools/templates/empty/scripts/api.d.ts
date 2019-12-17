
/**
 * ResourceManager 配置文件
 */
type ResourceManagerConfig = {
    /**
     * 构建与发布配置
     */
    buildConfig: (param: BuildConfigParam) => UserConfig,
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

type BuildConfigParam = {


    /**
     * 当前命令，build 或者 command
     */
    readonly command: string;

    /**
     * 发布平台
     */
    readonly target: string;

    /**
     * 开发者指定的版本号
     */
    readonly version: string;

    /**
     * 项目名称
     */
    readonly projectName: string;

    /**
     * 项目路径
     */
    readonly projectRoot: string;

    /**
     * 项目配置
     */
    readonly projectConfig: ProjectConfig;
}

type ProjectConfig = {
    entryClassName: string;
    orientation: string;
    frameRate: number;
    scaleMode: string;
    contentWidth: number;
    contentHeight: number;
    showFPS: boolean;
    fpsStyles: string;
    showLog: boolean;
    maxTouches: number;
}
/**
   * 匹配机制，将满足 from 的文件输出为 to 格式的文件
   * from 采用 glob 表达式 , to 包含 [path][name][hash][ext]四个变量
   * 示例：{ from:"resource/**.*" , to:"[path][name]_[hash].[ext]" }
   */
type Matcher = {

    from: string,

    to: string

}


declare namespace plugins {

    interface CommandContext {

        /**
         * 可以用此接口进行文件创建
         */
        createFile(relativeFilePath: string, contents: Buffer);

        /**
         * 构建配置
         */
        buildConfig: BuildConfigParam;

        /** 
         * 项目绝对路径
         */
        projectRoot: string;

        /** 
         * 项目输出绝对路径
         */
        outputDir: string;

    }

    /**
     * 构建管线命令
     */
    interface Command {

        /**
         * 项目中的每个文件都会执行此函数，返回 file 表示保留此文件，返回 null 表示将此文件从构建管线中删除，即不会发布
         */
        onFile?(file: File): Promise<File | null>

        /**
         * 项目中所有文件均执行完后，最终会执行此函数。
         * 这个函数主要被用于创建新文件
         */
        onFinish?(pluginContext?: CommandContext): Promise<void>

        [options: string]: any;
    }

    interface File {

        /**
         * 文件内容的二进制流，如果开发者需要修改文件内容，请修改此属性
         */
        contents: Buffer;


        /**
         * 文件绝对路径，如果开发者需要对文件进行重命名，请修改此属性
         */
        path: string;

        /**
         * 文件所在的项目的项目路径
         */
        readonly base: string;

        /**
         * 文件的相对于 base 属性的相对路径
         */
        readonly relative: string;


        /**
         * 文件变更历史，history[0] 即 origin 属性
         */
        readonly history: ReadonlyArray<string>;


        /**
         * 文件所在的文件夹的绝对路径
         */
        readonly dirname: string;

        /**
         * 文件的文件名
         */
        readonly basename: string;


        /**
         * 文件的扩展名
         */
        readonly extname: string;

        /**
         * 文件的初始文件名
         */
        readonly origin: string;

        /**
         * 其他自定义属性
         */
        [customProperty: string]: any;

    }

}










declare module 'built-in' {

    /**
     * 混淆插件参数，设置源代码和目标代码
     */
    type UglifyPluginOption = { sources: string[], target: string };

    type UglifyPluginOptions = UglifyPluginOption[];

    /**
     * 混淆插件
     */
    export class UglifyPlugin implements plugins.Command {

        constructor(mergeSelector: UglifyPluginOptions);

    }


    type LibraryType = "debug" | "release";

    type CompilePluginOptions = { libraryType: LibraryType, defines?: any };
    /**
     * 编译命令
     */
    export class CompilePlugin implements plugins.Command {

        constructor(options: CompilePluginOptions);
    }

    /**
     * EXML 插件，用于发布 EXML 文件
     */
    export class ExmlPlugin implements plugins.Command {

        constructor(publishPolicy: EXML_Publish_Policy);

    }

    /**
     * 发布策略
     * * debug : 默认策略，用于开发环境
     * * contents : 将 EXML 的内容写入到主题文件中
     * * gjs : 将生成的JS文件写入到主题文件中
     * * commonjs : 将EXML合并为一个 CommonJS 风格的文件
     * * commonjs2 : 将EXML合并为一个含有解析方法和皮肤定义的文件，且皮肤抽离为一份配置
     * * json : 将每个EXML文件生成一份配置
     */
    type EXML_Publish_Policy = "debug" | "contents" | "gjs" | "commonjs" | "commonjs2" | "json"




    /**
     * 生成 manifest 文件，这个文件会被用于记录 JavaScript 文件的版本号
     */
    export class ManifestPlugin implements plugins.Command {
        constructor(options?: ManifestPluginOptions)
    }

    /**
     * 生成文件的文件名
     * 支持 json 与 js 两种格式
     */
    type ManifestPluginOptions = {

        output: string,

        hash?: "crc32",

        /**
         * 是否输出转换过程
         */
        verbose?: boolean,
        /**
         * 其他传递的消息参数
         */
        info?:any
        /**
         * use wechat engine plugin
         */
        useWxPlugin?: boolean
        /**
         * use QQgame engine plugin
         */
        qqPlugin?: { use: boolean, pluginList: string[] }
    }

    /** 
     * EmitResConfigFilePlugin 的参数
     * * output: 生成路径，可以指定生成为 *.res.js 文件或者 *.res.json 文件
     * * typeSelector: 根据文件路径决定文件类型
     * * nameSelector: 根据文件路径决定文件的资源名
     * * groupSelector: 根据文件路径决定资源所述的资源组 
     */
    type EmitResConfigFilePluginOptions = {
        output: string,
        typeSelector: (path: string) => string | null | undefined,
        nameSelector: (path: string) => string | null | undefined,
        groupSelector: (path: string) => string | null | undefined,
    }


    /** 
     * 生成 res.json 文件或者 res.js 文件
     */
    export class EmitResConfigFilePlugin implements plugins.Command {

        constructor(options: EmitResConfigFilePluginOptions)

    }

    export type ConvertResourceConfigPluginOption = {

        resourceConfigFiles: { filename: string, root: string }[];

        nameSelector: (url: string) => string;

        TM_Verbose: boolean;
    }

    export class ConvertResConfigFilePlugin implements plugins.Command {

        constructor(options: ConvertResourceConfigPluginOption);
    }


    /**
     * 增量编译
     * 这个插件生成的 JavaScript 代码不会被添加到构建管线中，后续其他插件无法获取生成的 js 文件
     * 这个功能将会在未来被 watch 模式代替掉
     */
    export class IncrementCompilePlugin implements plugins.Command {

    }

    type TextureMergerOptions = {
        textureMergerRoot: string[];
    }

    /**
     * 使用 TextureMerger 实现纹理自动合并，依赖 TextureMerger 1.7 以上的版本
     */
    export class TextureMergerPlugin implements plugins.Command {

        constructor(options: TextureMergerOptions);

    }

    type CleanPluginOptions = {

        matchers: string[]
    }


    export class CleanPlugin implements plugins.Command {
        constructor(options: CleanPluginOptions);
    }


    type RenamePluginOptions = {

        /**
         * 是否输出日志
         * Whether to output the log
         */
        verbose?: boolean

        /**
         * 采用何种 hash 算法，目前暂时只支持 crc32
         * What hash algorithm is used, currently only crc32 is supported
         */
        hash?: "crc32"


        /**
         * 设置匹配规则，将指定文件进行改名
         * 该参数是个数组，允许设置多个匹配规则
         * Set up matching rules to copy specified files to other folders
         * This parameter is an array that allows multiple matching rules to be set
         */
        matchers: Matcher[]

        /**
         * 回调函数，返回值里包括文件的一些信息
         * The callback function, return value includes some information about the file
         */
        callback?: Function
    }


    /**
     * 修改文件名插件
     */
    export class RenamePlugin implements plugins.Command {
        constructor(options: RenamePluginOptions);
    }

    type ResSplitPluginOptions = {

        /**
         * 是否输出日志
         * Whether to output the log
         */
        verbose?: boolean

        /**
         * 设置匹配规则，将指定文件拷贝至其他文件夹
         * 该参数是个数组，允许设置多个匹配规则
         * Set up matching rules to copy specified files to other folders
         * This parameter is an array that allows multiple matching rules to be set
         */
        matchers: Matcher[]
    }

    export class ResSplitPlugin implements plugins.Command {
        constructor(options: ResSplitPluginOptions);
    }


    type ZipPluginOptions = {

        mergeSelector: (p: string) => string
    }

    export class ZipPlugin implements plugins.Command {

        constructor(option: ZipPluginOptions);
    }

    type MergeEuiJsonPluginOptions = {

        mergeSelector?: (p: string) => string | null,

        createConfig?: boolean
    }
    export class MergeEuiJsonPlugin implements plugins.Command {

        constructor(option?: MergeEuiJsonPluginOptions);
    }
}
