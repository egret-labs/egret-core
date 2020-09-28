declare namespace ts.server {
    type ActionSet = "action::set";
    type ActionInvalidate = "action::invalidate";
    type ActionPackageInstalled = "action::packageInstalled";
    type EventTypesRegistry = "event::typesRegistry";
    type EventBeginInstallTypes = "event::beginInstallTypes";
    type EventEndInstallTypes = "event::endInstallTypes";
    type EventInitializationFailed = "event::initializationFailed";
    const ActionSet: ActionSet;
    const ActionInvalidate: ActionInvalidate;
    const ActionPackageInstalled: ActionPackageInstalled;
    const EventTypesRegistry: EventTypesRegistry;
    const EventBeginInstallTypes: EventBeginInstallTypes;
    const EventEndInstallTypes: EventEndInstallTypes;
    const EventInitializationFailed: EventInitializationFailed;
    namespace Arguments {
        const GlobalCacheLocation = "--globalTypingsCacheLocation";
        const LogFile = "--logFile";
        const EnableTelemetry = "--enableTelemetry";
        const TypingSafeListLocation = "--typingSafeListLocation";
        const TypesMapLocation = "--typesMapLocation";
        /**
         * This argument specifies the location of the NPM executable.
         * typingsInstaller will run the command with `${npmLocation} install ...`.
         */
        const NpmLocation = "--npmLocation";
        /**
         * Flag indicating that the typings installer should try to validate the default npm location.
         * If the default npm is not found when this flag is enabled, fallback to `npm install`
         */
        const ValidateDefaultNpmLocation = "--validateDefaultNpmLocation";
    }
    function hasArgument(argumentName: string): boolean;
    function findArgument(argumentName: string): string | undefined;
    function nowString(): string;
}
declare namespace ts.server {
    interface TypingInstallerResponse {
        readonly kind: ActionSet | ActionInvalidate | EventTypesRegistry | ActionPackageInstalled | EventBeginInstallTypes | EventEndInstallTypes | EventInitializationFailed;
    }
    interface TypingInstallerRequestWithProjectName {
        readonly projectName: string;
    }
    type TypingInstallerRequestUnion = DiscoverTypings | CloseProject | TypesRegistryRequest | InstallPackageRequest;
    interface DiscoverTypings extends TypingInstallerRequestWithProjectName {
        readonly fileNames: string[];
        readonly projectRootPath: Path;
        readonly compilerOptions: CompilerOptions;
        readonly watchOptions?: WatchOptions;
        readonly typeAcquisition: TypeAcquisition;
        readonly unresolvedImports: SortedReadonlyArray<string>;
        readonly cachePath?: string;
        readonly kind: "discover";
    }
    interface CloseProject extends TypingInstallerRequestWithProjectName {
        readonly kind: "closeProject";
    }
    interface TypesRegistryRequest {
        readonly kind: "typesRegistry";
    }
    interface InstallPackageRequest extends TypingInstallerRequestWithProjectName {
        readonly kind: "installPackage";
        readonly fileName: Path;
        readonly packageName: string;
        readonly projectRootPath: Path;
    }
    interface TypesRegistryResponse extends TypingInstallerResponse {
        readonly kind: EventTypesRegistry;
        readonly typesRegistry: MapLike<MapLike<string>>;
    }
    interface PackageInstalledResponse extends ProjectResponse {
        readonly kind: ActionPackageInstalled;
        readonly success: boolean;
        readonly message: string;
    }
    interface InitializationFailedResponse extends TypingInstallerResponse {
        readonly kind: EventInitializationFailed;
        readonly message: string;
        readonly stack?: string;
    }
    interface ProjectResponse extends TypingInstallerResponse {
        readonly projectName: string;
    }
    interface InvalidateCachedTypings extends ProjectResponse {
        readonly kind: ActionInvalidate;
    }
    interface InstallTypes extends ProjectResponse {
        readonly kind: EventBeginInstallTypes | EventEndInstallTypes;
        readonly eventId: number;
        readonly typingsInstallerVersion: string;
        readonly packagesToInstall: readonly string[];
    }
    interface BeginInstallTypes extends InstallTypes {
        readonly kind: EventBeginInstallTypes;
    }
    interface EndInstallTypes extends InstallTypes {
        readonly kind: EventEndInstallTypes;
        readonly installSuccess: boolean;
    }
    interface InstallTypingHost extends JsTyping.TypingResolutionHost {
        useCaseSensitiveFileNames: boolean;
        writeFile(path: string, content: string): void;
        createDirectory(path: string): void;
        watchFile?(path: string, callback: FileWatcherCallback, pollingInterval?: number, options?: CompilerOptions): FileWatcher;
        watchDirectory?(path: string, callback: DirectoryWatcherCallback, recursive?: boolean, options?: CompilerOptions): FileWatcher;
    }
    interface SetTypings extends ProjectResponse {
        readonly typeAcquisition: TypeAcquisition;
        readonly compilerOptions: CompilerOptions;
        readonly typings: string[];
        readonly unresolvedImports: SortedReadonlyArray<string>;
        readonly kind: ActionSet;
    }
    type TypingInstallerResponseUnion = SetTypings | InvalidateCachedTypings | TypesRegistryResponse | PackageInstalledResponse | InstallTypes | InitializationFailedResponse;
}
declare namespace ts.JsTyping {
    interface TypingResolutionHost {
        directoryExists(path: string): boolean;
        fileExists(fileName: string): boolean;
        readFile(path: string, encoding?: string): string | undefined;
        readDirectory(rootDir: string, extensions: readonly string[], excludes: readonly string[] | undefined, includes: readonly string[] | undefined, depth?: number): string[];
    }
    interface CachedTyping {
        typingLocation: string;
        version: Version;
    }
    function isTypingUpToDate(cachedTyping: CachedTyping, availableTypingVersions: MapLike<string>): boolean;
    const nodeCoreModuleList: readonly string[];
    const nodeCoreModules: Set<string>;
    function nonRelativeModuleNameForTypingCache(moduleName: string): string;
    /**
     * A map of loose file names to library names that we are confident require typings
     */
    type SafeList = ReadonlyESMap<string, string>;
    function loadSafeList(host: TypingResolutionHost, safeListPath: Path): SafeList;
    function loadTypesMap(host: TypingResolutionHost, typesMapPath: Path): SafeList | undefined;
    /**
     * @param host is the object providing I/O related operations.
     * @param fileNames are the file names that belong to the same project
     * @param projectRootPath is the path to the project root directory
     * @param safeListPath is the path used to retrieve the safe list
     * @param packageNameToTypingLocation is the map of package names to their cached typing locations and installed versions
     * @param typeAcquisition is used to customize the typing acquisition process
     * @param compilerOptions are used as a source for typing inference
     */
    function discoverTypings(host: TypingResolutionHost, log: ((message: string) => void) | undefined, fileNames: string[], projectRootPath: Path, safeList: SafeList, packageNameToTypingLocation: ReadonlyESMap<string, CachedTyping>, typeAcquisition: TypeAcquisition, unresolvedImports: readonly string[], typesRegistry: ReadonlyESMap<string, MapLike<string>>): {
        cachedTypingPaths: string[];
        newTypingNames: string[];
        filesToWatch: string[];
    };
    const enum NameValidationResult {
        Ok = 0,
        EmptyName = 1,
        NameTooLong = 2,
        NameStartsWithDot = 3,
        NameStartsWithUnderscore = 4,
        NameContainsNonURISafeCharacters = 5
    }
    interface ScopedPackageNameValidationResult {
        name: string;
        isScopeName: boolean;
        result: NameValidationResult;
    }
    type PackageNameValidationResult = NameValidationResult | ScopedPackageNameValidationResult;
    /**
     * Validates package name using rules defined at https://docs.npmjs.com/files/package.json
     */
    function validatePackageName(packageName: string): PackageNameValidationResult;
    function renderPackageNameValidationFailure(result: PackageNameValidationResult, typing: string): string;
}
//# sourceMappingURL=jsTyping.d.ts.map