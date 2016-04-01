// Type definitions for total.js
// Project: http://totaljs.com
// Definitions by: Lucien Zuercher <https://github.com/bigz94>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../node.d.ts" />
/// <reference path="./nosql.d.ts" />

/**
 * Total js module, containing all definitions
 */
declare module TotalJS {

    interface Framework {
        
        /**< Properties */

        /**
         * 
         */
        async: TotalJS.Async;

        /**
         * 
         */
        cache: TotalJS.Cache;

        /**
         * 
         */
        changes: any[];

        /**
         * 
         */
        config: Config;

        /**
         * 
         */
        connections: Object;

        /**
         * 
         */
        databases: Object;

        /**
         * 
         */
        errors: any[];

        /**
         * 
         */
        fs: TotalJS.FileSystem;

        /**
         * 
         */
        functions: Object;

        /**
         * 
         */
        global;

        /**
         * 
         */
        helpers;

        /**
         * 
         */
        id: number;

        /**
         * 
         */
        ip: string;

        /**
         * 
         */
        isCoffee: boolean;

        /**
         * 
         */
        isDebug: boolean;

        /**
         * 
         */
        isTest: boolean;

        /**
         * 
         */
        isWindows: boolean;

        /**
         * 
         */
        path: string;

        /**
         * 
         */
        port: number;

        /**
         * 
         */
        problems: any[];

        /**
         * 
         */
        resources: Object;

        /**
         * 
         */
        restrictions: TotalJS.Restrictions;

        /**
         * 
         */
        server: Object;

        /**
         * 
         */
        sources: Object;

        /**
         * 
         */
        stats: Stats;

        /**
         * 
         */
        temporary: Object;

        /**
         * 
         */
        version: number;

        /**
         * 
         */
        versionNode: number;

        /**
         * 
         */
        versions: Object;

        /**
         * 
         */
        wokers: Object;
        
        /**< Functions */

        accept(extension, contentType?): Framework;

        assert(name, fn): Framework;

        assert(name, url, callback, method?, data?, headers?, xhr?): Framework;

        change(message, name, uri?, ip?): Framework;

        /**
         * 
         */
        clear(): Framework;

        /**
         * 
         */
        configure(value, rewrite?): Framework;

        controller(name): Controller;
        controller<T>(name): T;

        database(name): NoSQLDatabase;

        decrypt(name, key, jsonConvert?): Framework;

        encrypt(value, key, isUnique?): Framework;

        error(err, name, uri?): Framework;

        eval(fn: Function): Framework;

        eval(url: string): Framework;

        file(name: string, fnExec: (req, res, isValidation: boolean) => void): Framework;

        file(
            name: string,
            fnValid: (req?: Object) => void,
            fnExec: (req?, res?, isValidation?: boolean) => void,
            middleware?: string[]
            ): Framework;

        hash(type, value, salt?): Framework;

        /**
         * Run the framework (HTTP).
         * @param mode Mode: debug, release, test, debug test or release test
         * @param options Custom options. (port, ip, config, https: { key, cert })
         * @return Totaljs Framework object
         */
        http(mode: string,
            options?: {
                port?: number;
                ip?: string;
                config?: Config;
                https?: { key: any; cert: any; };
            }): Framework;

        /**
         * Run the framework (HTTPS).
         * @param mode Mode: debug, release, test, debug test or release test
         * @param options Custom options. (port, ip, config, https: { key, cert })
         * @return Totaljs Framework object
         */
        https(mode: string,
            options?: {
                port?: number;
                ip?: string;
                config?: Config;
                https?: { key: any; cert: any; };
            }): Framework;

        install(type, declaration): Framework;

        install(type, name, declaration, options?, callback?): Framework;

        /**
         * Indicates whether the static file is processed internally. This function 
         * is bounded with framework.responseFile() or framework.responseImage().
         * @param filename Static filename.
         * @return Totaljs Framework object
         */
        isProcessed(filename: string): Framework;

        /**
         * Write to the log file.
         * @param params Dynamic parameter
         * @return Totaljs Framework object
         */
        log(...params: any[]): Framework;

        /**
         * Register a middleware. Middleware is executed before is executing a 
         * Request / Controller / Module. Middleware must be specified for use.
         * @param name Name of middleware.
         * @param fn Function to execute.
         * @return Totaljs Framework object
         */
        middleware(name: string, fn: (
            req,
            res,
            next: () => void,
            options?: Object,
            controller?: TotalJS.Controller) => void);

        model(name: string);
        model<T>(name: string): T;

        module(name): any;
        module<T>(name): T;

        noCache(req, res?): Framework;

        notModified(req, res, compare?, strict?): Framework;

        problem(message: string, name: string, uri?: Object, ip?: string): Framework;

        reconnect(): Framework;

        redirect(oldHost, newHost, copyPath?, permanent?): Framework;

        refresh(clear?: boolean): Framework;

        /**
         * Register a image resize route. Example:
         * <pre>
         * {@code
         * framework.resize('/img/medium/*.jpg', 200, 200, { grayscale: true, rotate: 40 }, '/img/');
         * framework.resize('/img/large/', 600, 400, null, '/img/', ['.jpg', '.png']);
         * framework.resize('/img/large/', 600, 400, { blur: true, grayscale: true, sepia: 80, flop: true, flip: true, rotate: 30, quality: 80 });
         * }
         * </pre>
         * @param url 
         * @param width New width. Supports percentage. default: NULL
         * @param height New height. Supports percentage. default: NULL
         * @param options Additional options. default: {}
         * @param path Only extension in asterix path. default: ['.jpg', '.png', '.gif']
         * @param extension Only extension in asterix path. default: ['.jpg', '.png', '.gif']
         * @return Totaljs Framework object
         */
        resize(url: string, width?: string, height?: string, options?: Object, path?: string[], extension?: string[]): Framework;

        resource(): Framework;

        resource(name: string, key: string): Framework;

        response401(req, res): Framework;

        response403(req, res): Framework;

        response404(req, res): Framework;

        response500(req, res): Framework;

        response501(req, res): Framework;

        responseContent(req: Object, res: Object, code: number, contentBody: string, contentType: string, compress?: boolean, heades?: Object): Framework;

        responseCustom(req, res): Framework;

        responseFile(req: Object, res: Object, filename: string, downloadName?: string, headers?: Object): Framework;

        responseImage(req: Object, res: Object, filename: string, fnProcess: (image: TotalJS.Image) => void, headers?: Object, useImageMagick?: boolean): Framework;

        responseImage(req: Object, res: Object, filename: NodeJS.ReadableStream, fnProcess: (image: TotalJS.Image) => void, headers?: Object, useImageMagick?: boolean): Framework;

        responseImageWithoutCache(req: Object, res: Object, filename: NodeJS.ReadableStream, fnProcess: (image: TotalJS.Image) => void, headers: Object, useImageMagick?: boolean): Framework;

        responseImageWithoutCache(req: Object, res: Object, filename: string, fnProcess: (image: TotalJS.Image) => void, headers: Object, useImageMagick?: boolean): Framework;

        responsePipe(req: Object, res: Object, url: string, headers?: Object, timeout?: number, callback?: Function): Framework;

        responseRedirect(req: Object, res: Object, url: string, permament?: boolean): Framework;

        responseStatic(req, res): Framework;

        responseStream(req: Object, res: Object, contentType: string, stream: Object, downloadName: string, headers?: Object): Framework;

        /**
         * Register a new HTTP/HTTPS route. This function must be executed in a controller/module file.
         * @param url The relative URL. You can create a dynamic param: /{param1}/{param2}/
         * @param fn Function to execute.
         * @return Totaljs Framework object
         */
        route(url: string, options?: Object): Framework;
        route(url: string, fn: (...params: any[]) => void, options?: Object): Framework;
        route(url: string, fn: (param1: any, ...params: any[]) => void, options?: Object): Framework;
        route(url: string, fn: (param1: any, param2: any, ...params: any[]) => void, options?: Object): Framework;
        route(url: string, fn: (param1: any, param2: any, param3: any, ...params: any[]) => void, options?: Object): Framework;
        route(url: string, fn: (param1: any, param2: any, param3: any, param4: any, ...params: any[]) => void, options?: Object): Framework;
        route(url: string, fn: (param1: any, param2: any, param3: any, param4: any, param5: any, ...params: any[]) => void, options?: Object): Framework;
        route(url: string, fn: (param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, ...params: any[]) => void, options?: Object): Framework;
        route(url: string, fn: (param1: any, param2: any, param3: any, param4: any, param5: any, param6: any, param7: any, ...params: any[]) => void, options?: Object): Framework;

        routeCSS(name: string): string;

        routeDownload(name: string): string;

        routeFont(name: string): string;

        routeImage(name: string): string;

        routeJS(name: string): string;

        routeStatic(name: string): string;

        routeVideo(name: string): string;

        /**
         * Set Etag header.
         * @param req HTTP request.
         * @param res HTTP response.
         * @param value Last-Modified
         * @return Totaljs Framework object
         */
        setModified(req: Object, res: Object, value: string): Framework;

        /**
         * Set last modified.
         * @param req HTTP request.
         * @param res HTTP response.
         * @param value Etag
         * @return Totaljs Framework object
         */
        setModified(req: Object, res: Object, value: Date): Framework;

        source(name: string, options?: Object): Object;

        stop(code?: number): Framework;

        test(stop: boolean, names: string[], callback?: Function): Framework;

        uninstall(type: string, name: string, options?: Object): Framework;

        unlink(list: string[], callback?: Function): Framework;

        /**
         * Returned string is the Markdown syntax and contains usage informations. 
         * Look at this: http://www.partialjs.com/usage/
         * @param detailed? Create a detailed information.
         * @return Markdown syntax and usage informations
         */
        usage(detailed?: boolean): string;

        websocket(url: string, fn: (controller: Object, framework: Object) => void, settings?: Array<any>): Framework;
        websocket(url: string, fn: (controller: Object) => void, settings?: Array<any>): Framework;
        websocket(url: string, fn: (controller: Object) => void, decode: Array<any>, blacklist: Array<any>, whitelist: Array<any>): Framework;

        /**
         * Create worker.
         * @param name Name of worker (workers/{name}.js).
         * @param id? Id of worker. According ID parameter you can get alive worker.
         * @param timeout? Worker timeout. default: any
         * @return ChildProcess
         */
        worker(name: string, id?: string, timeout?: number): any;

        /**< Delegates */

        /**
         * Authorization delegation for authenticating users. If user is logged then 
         * value in the callback must be a true or if is unlogged then must be a false. 
         * If is user authorized then is added 'logged' flag to the request flags otherwise 
         * 'unlogged'. If you forget call callback then is executed timeout.
         * @param req HTTP request
         * @param res HTTP response
         * @param flags Request current flags. Read more about routing flags in the controller documentation.
         * @param Callback
         * @return logged status
         */
        onAuthorization(req: Object, res: Object, flags: any[], callback: (isAuthorized: boolean, user: Object) => void): boolean;

        /**
         * This delegate replace an internal CSS compiler. For more information 
         * look up to the example. Delegate is not async.
         * @param filename File name of CSS file
         * @param content Content of CSS file
         * @return Rendered Content of CSS file
         *
         * @see https://github.com/totaljs/examples/tree/master/external-compile-sass
         */
        onCompileCSS(filename: string, content: string): string;

        /**
         * This delegate replace an internal JS compiler. For more information 
         * look up to the example. Delegate is not async.
         * @param filename File name of JS file
         * @param content Content of JS file
         * @return Rendered Content of JS file
         * 
         * @see https://github.com/totaljs/examples/tree/master/external-compile-uglifyjs
         */
        onCompileJS(filename: string, content: string): string;

        /**
         * If framework throws an error then execute this delegate.
         * @param err Error handling.
         * @param name Name of controller or module. Sometimes can be value null.
         * @param uri URI where framework throw error. Sometimes can be value null.
         */
        onError(err: Error, name: string, uri: Object): void;

        onLoad(framework: Object);

        onMail(address, subject, body, callback): Framework;

        /**
         * Render meta tags into the view.
         * @param title Meta title
         * @param description Meta description
         * @param keywords Meta keywords.
         * @param image URL to social image
         *
         * @see https://github.com/totaljs/examples/tree/master/views-meta
         */
        onMeta(title: string, description: string, keywords: string, image: string): string;

        onRequest(req, res): boolean;

        onRoute(req, res): boolean;

        onValidation(name, value): boolean;

        /**
         * This delegate adjusted file name of static file. Into the delegate are inserted 
         * all static files (e.g.: JavaScript, CSS, images from IMG tags, images from CSS, 
         * etc.). 
         * IMPORTANT: you must return {String} - new file name. For understand 
         * delegate click on the example.
         * @param name The realitve name of static file.
         * 
         * @see https://github.com/totaljs/examples/tree/master/static-version
         */
        onVersion(name: string): string;
        
        /**< Events */

        /**
         * Create event function
         * <pre>
         * {@code
         * framework.on('cache-expire', key, value)
         * framework.on('change', message, [name], [uri], [ip])
         * framework.on('clear', name, [value])
         * framework.on('configure', config)
         * framework.on('controller', controller, name)
         * framework.on('eval', [url])
         * framework.on('exit')
         * framework.on('install', type, name)
         * framework.on('load', framework)
         * framework.on('problem', message, [name], [uri], [ip])
         * framework.on('reconfigure')
         * framework.on('request', req, res)
         * framework.on('request-begin', req, res)
         * framework.on('request-end', req, res)
         * framework.on('route-add', type, route)
         * framework.on('service', count)
         * framework.on('uninstall', type, name)
         * framework.on('websocket', req, socket)
         * framework.on('websocket-begin', controller, client)
         * framework.on('websocket-end', controller, client)
         * }
         * </pre>
         * @param event Event name
         * @param fn Function run
         * @return Totaljs Framework object
         */
        on(event: string, ...params: any[]): Framework;

        setRoot(root: string);
    }

    /**
     * The framework is using this class for storing views, resources, etc..
     * <pre>
     * {@code
     * framework.cache.add('key', 'value', new Date().add('day', 1));
     * console.log(framework.read('key'));
     *  
     * // OR (is the same as)
     * 
     * controller.cache.add('key', { name: 'Peter Širka' }, new Date().add('minute', 10));
     * console.log(controller.read('key'));
     * }
     * </pre>
     */
    interface Cache {
        
        /**< Properties */

        /**
         * Count of cache recycle.
         */
        count: number;

        /**
         * All cached items.
         */
        items: Object;

        /**< Methods */

        /**
         * Add an item into the cache and return a value.
         * @param name Identificator name.
         * @param value Item value.
         * @param expire Item expiration.
         * @return Object added
         */
        add(name: string, value: Object, expire: Date): Object;

        /**
         * Clear cache items.
         * @return Cache Object reference
         */
        clear(): Cache;

        /**
         * Simply cache for storing output from some function.
         * @param name Identificator name.
         * @param fnCache Setting value.
         * > @param value This value will be stored in the cache.
         * > @param expire Item expiration
         * @param fnCallback? A callback after storing.
         * > @param value Stored value in the cache.
         * @return Cache-Object reference
         * 
         * @see https://github.com/totaljs/examples/tree/master/cache-partial
         */
        fn(name: string,
            fnCache: (value?: Object, expire?: Date) => void,
            fnCallback?: (value?: Object) => void): Cache;

        /**
         * Read value from the cache.
         * @param name Identificator name.
         * @return Cached value
         */
        read(name: string): Object;

        /**
         * Remove an item from the cache.
         * @param name Identificator name.
         * @return Cached value
         */
        remove(name: string): Object;

        /** 
         * Remove items from the cache.
         * @param search Search text in all cached keys.
         * @return Number removed items
         */
        removeAll(search: string): number;

        /**
         * Set item expiration.
         * @param name Identificator name.
         * @param expire A new item expiration.
         */
        setExpire(name: string, expire: Date): Cache;

    }
    

    /**
     * This class helps with creating files (CSS, JavaScript, views, etc.).
     */
    interface FileSystem {
        
        /**< Properties */

        /**
         * Create files
         */
        create: {
        
            /**< Methods */

            /**
             * Create a CSS file into the framework.config['directory-public'] 
             * + framework.config['static-url-css'].
             * @param name File name without path.
             * @param content A content of file or valid URL address (framework download content automatically).
             * @param rewrite? Rewrite an existing file. default: false
             * @param append? Append content into end of file (IMPORTANT: if content doesn't exist in this file). default: false
             * @return Status
             */
            css(name: string, content: string, rewrite?: boolean, append?: boolean): boolean;

            /**
             * Create a JS file into the framework.config['directory-public']
             *  + framework.config['static-url-js'].
             * @param name File name without path.
             * @param content A content of file or valid URL address (framework download content automatically).
             * @param rewrite? Rewrite an existing file. default: false
             * @param append? Append content into end of file (IMPORTANT: if content doesn't exist in this file). default: false
             * @return Status
             */
            js(name: string, content: string, rewrite?: boolean, append?: boolean): boolean;

            /**
             * Create a resource file into the framework.config['directory-resources'].
             * @param name File name without path.
             * @param content A content of file or valid URL address (framework download content automatically).
             * @param rewrite? Rewrite an existing file. default: false
             * @param append? Append content into end of file (IMPORTANT: if content doesn't exist in this file). default: false
             * @return Status
             */
            resource(name: string, content: string, rewrite?: boolean, append?: boolean): boolean;

            /**
             * Create a file into the framework.config['directory-temp'].
             * @param name File name without path.
             * @param stream Readable stream.
             * @param callback? Callback
             * > @param err? Error handling.
             * > @param filename? Filename with path.
             * @return Status
             */
            temporary(name: string, stream: NodeJS.ReadableStream, callback?: (err?: Error, filename?: string) => void): boolean;

            /**
             * Create a view file into the framework.config['directory-views'].
             * @param name File name without path.
             * @param content A content of file or valid URL address (framework download content automatically).
             * @param rewrite? Rewrite an existing file. default: false
             * @param append? Append content into end of file (IMPORTANT: if content doesn't exist in this file). default: false
             * @return Status
             */
            view(name: string, content: string, rewrite?: boolean, append?: boolean): boolean;

            /**
             * Create a worker file into the framework.config['directory-workers'].
             * @param name File name without path.
             * @param content A content of file or valid URL address (framework download content automatically).
             * @param rewrite? Rewrite an existing file. default: false
             * @param append? Append content into end of file (IMPORTANT: if content doesn't exist in this file). default: false
             * @return Status
             */
            worker(name: string, content: string, rewrite?: boolean, append?: boolean): boolean;


        };

        /**
         * Remove files
         */
        rm: {
        
            /**< Methods */

            /**
             * Delete a CSS file from framework.config['directory-public']
             *  + framework.config['static-url-css'].
             * @param name File name without path.
             * @return Status
             */
            css(name: string): boolean;

            /**
             * Delete a JS file from framework.config['directory-public']
             * + framework.config['static-url-js'].
             * @param name File name without path.
             * @return Status
             */
            js(name: string): boolean;

            /**
             * Delete a resource file from framework.config['directory-resources'].
             * @param name File name without path.
             * @return Status
             */
            resource(name: string): boolean;

            /**
             * Delete a temporary file from framework.config['directory-temp'].
             * @param name File name without path.
             * @return Status
             */
            temporary(name: string): boolean;

            /**
             * Delete a view file from framework.config['directory-views'].
             * @param name File name without path.
             * @return Status
             */
            view(name: string): boolean;

            /**
             * Delete a worker file from framework.config['directory-workers'].
             * @param name File name without path.
             * @return Status
             */
            worker(name: string): boolean;
        };
    }

    /**
     * This class helps with getting all framework paths. All paths 
     * reads from the framework configuration.
     */
    interface Path {
        
        /**< Methods */

        /**
         * Get the controllers path from framework.config['directory-controllers'].
         * @param name? File name without path.
         */
        controllers(name?: string);

        /**
         * Get the public path from framework.config['directory-databases'].
         * @param name? File name without path.
         */
        databases(name?);
        
        /**
         * Get the definitions path from framework.config['directory-definitions'].
         * @param name? File name without path.
         */
        definitions(name?);

        /**
         * Get the logs path from framework.config['directory-logs'].
         * @param name? File name without path.
         */
        logs(name?);

        /**
         * Get the public path from framework.config['directory-models'].
         * @param name? File name without path.
         */
        models(name?);

        /**
         * Get the modules path from framework.config['directory-modules'].
         * @param name? File name without path.
         */
        modules(name?);

        /**
         * Get the public path from framework.config['directory-public'].
         * @param name? File name without path.
         */
        public(name?);

        /**
         * Get the resources path from framework.config['directory-resources'].
         * @param name? File name without path.
         */
        resources(name?);

        /**
         * Get the root path.
         * @param name? File name without path.
         */
        root(name?);

        /**
         * Get the temp path from framework.config['directory-temp'].
         * @param name? File name without path.
         */
        temp(name?);

        /**
         * Get the tests path from framework.config['directory-tests'].
         * @param name? File name without path.
         */
        tests(name?);

        /**
         * Get the views path from framework.config['directory-views'].
         * @param name? File name without path.
         */
        views(name?);

        /**
         * Get the workers path from framework.config['directory-workers'].
         * @param name? File name without path.
         */
        workers(name?);

    }

    /** 
     * This class creates framework restrictions. You can allow/disallow IP or custom headers.
     */
    interface Restrictions {
        
        /**< Methods */

        /**
         * @param key Header name or IMPORTANT: IP address.
         * @param value Value for header value (otherwise framework compares IP address).
         *
         * @see https://github.com/totaljs/examples/tree/master/framework-restrictions
         */
        allow(key: string, value?: RegExp): Framework;

        /**
         * Clear all restrictions to headers.
         */
        clearHeaders(): Framework;

        /**
         * Clear all restrictions to IP.
         */
        clearIP(): Framework;

        /**
         * Set an disallowed restrictions. This is blacklist for IP address or custom headers.
         * @param key Header name or IMPORTANT: IP address.
         * @param value? Value for header testing (otherwise will compared IP address).
         * @return Totaljs Framework object
         *
         * @see https://github.com/totaljs/examples/tree/master/framework-restrictions
         */
        disallow(key: string, value?: RegExp): Framework;
    }

    /**
     * FrameworkController is created after is validate a route. The framework knows two types 
     * of controller: HTTP/HTTPS Controller and WebSocket Controller.
     *
     * IMPORTANT MARKUPS: http is for HTTP/HTTPS requests and WebSocket is for WebSocket connections. 
     * Some methods and properties support both options.
     * 
     * @see http://docs.totaljs.com/how-does-it-work/controllers/
     */
    class Controller {

        /**< Properties */

        /**
         * Return the current model in current view. IMPORTANT: only for helpers.
         */
        $model: Object;

        /**
         * Async class for async work.
         */
        async: Async;

        /**
         * Parsed data from a request body.
         */
        body: Object;

        /**
         * Return the framework cache object.
         */
        cache: Cache;

        /**
         * Return the framework config.
         */
        config: Config;

        /**
         * All connection of users.
         */
        connections: Object;

        /**
         * Last exception in controller.
         */
        exception: Error;

        /**
         * Parsed files from a request content.
         */
        files: HttpFile[];

        /**
         * Get all route flags.
         */
        flags: string[];

        /**
         * return file system for dynamic manipulating web application files.
         */
        fs: FileSystem;

        /**
         * Parsed data from URL query. Is alias for controller.query.
         */
        get: Object;

        /**
         * Get the framework global variables.
         */
        global: Object;

        /**
         * Current HTTP host address.
         */
        ip: string;

        /**
         * Is a request connected?
         */
        isConnected: boolean;

        /**
         * A helper property.
         */
        isController: boolean;

        /**
         * Is debug mode?
         */
        isDebug: boolean;

        /**
         * Is total.js proxy request?
         */
        isProxy: boolean;

        /**
         * Is secured request?
         */
        isSecure: boolean;

        /**
         * Is assertion testing of request?
         */
        isTest: boolean;

        /**
         * Is an internal transfer? Example: controller.transfer('/url/') -> controller.isTransfer = true
         */
        isTransfer: boolean;

        /**
         * Return request parsed HTTP header: accept-language.
         */
        language: string;

        /**
         * Return name of controller.
         */
        name: string;

        /**
         * Online user count (websocket).
         */
        online: number;

        /** 
         * Return path object for getting all framework paths.
         */
        path: Path;

        /**
         * Parsed data from a request body. Is alias for controller.body.
         */
        post: Object;

        /**
         * Parsed data from URL query.
         */
        query: Object;
        
        /**
         * Controller repository object for storing current request values.
         */
        repository: Object;

        /**
         * Current HTTP request.
         */
        req: Request;
        
        /**
         * Current HTTP response.
         */
        res: Response;
        
        /**
         * Current HTTP session.
         *
         * @see https://github.com/totaljs/modules/tree/master/session
         */
        session: Object;
        
        /**
         * Get lastEventID for Server Sent Events.
         */
        sseID: string;
        
        /**
         * Gets / Sets status code of response.
         */
        status: number;
        
        /**
         * Current subdomain.
         */
        subdomain: string[];
        
        /**
         * Current URI object.
         */ 
        uri: Object;
        
        /**
         * Current relative URL address without params and hash tags.
         */
        url: string;

        /**
         * Current HTTP user.
         */
        user: Object;

        /**
         * Check if request is XMLHttpRequest.
         */
        xhr: boolean;

        /**< Methods */
        
        /**
         *
         */
        all(fn);
        
        /**
         *
         */
        await(name, fn);
        
        /**
         *
         */
        baa(name?);
    
        /**
         *
         */
        binary(buffer, contentType);
        
        /**
         *
         */
        callback(view_name?);
    
        /**
         *
         */
        cancel();
        
        /**
         *
         */
        change(message);
        
        /**
         * Clear uploaded files. Important: for prevent auto clearing use controller.noClear().
         * @return Controller object
         */
        clear(): Controller;
        
        /**
         * Close a response (controller.mmr() or controller.sse() or by the custom response flushing). 
         * In the WebSocket close all connections or specific connection (by the names).
         * @param names Allowed in a websocket request. Name of websocket clients.
         * @return Controller object
         */
        close(names: string[]): Controller;

        /**
         * Run async functions.
         * @param callback Complete function.
         * @return Controller object
         */
        complete(callback: Function): Controller;

        /**
         * Return rendered string.
         * @param name Component name.
         * @param param..n Component parameter.
         * @return Controller object
         */
        component(name: string, ...param: Object[]): Controller;

        content(body: string, type?: string, headers?: Object): Controller;

        cors(allow: string[], method?: string[], header?: string[], credentials?: boolean): boolean;
        
        /**
         * Set current path to contents folder.
         * @param path New path.
         * @return Controller object
         */
        currentContent(path: string): Controller;
        
        /**
         * 
         * @param path New path.
         * @return Controller object
         */
        currentCSS(path: string): Controller;
        
        /**
         * Set current path to download folder.
         * @param path New path.
         * @return Controller object
         */
        currentDownload(path: string): Controller;
        
        /**
         * Set current path to image.
         * @param path New path.
         * @return Controller object
         */
        currentImage(path: string): Controller;
        
        /**
         * Set current path to JS.
         * @param path New path.
         * @return Controller object
         */
        currentJS(path: string): Controller;
        
        /**
         * Set current path to video.
         * @param path New path.
         * @return Controller object
         */
        currentVideo(path: string): Controller;

        /**
         * Set current path to views folder.
         * @param path New path.
         * @return Controller object
         */
        currentView(path: string): Controller;

        custom(): boolean;

        database(name: string): NoSQLDatabase;

        /**
         * Compare date with current date. This method can be used in views.
         * @param type Compare type ('<', '<=', '>', '>=', '=')
         * @param d2 Date 2 to compare.
         * @return Controller object
         */
        date(type: string, d2: Date): Controller;

        /**
         * Compare date with current date. This method can be used in views.
         * @param type Compare type ('<', '<=', '>', '>=', '=')
         * @param d2 Date 2 to compare.
         * @return Controller object
         */
        date(type: string, d2: string): Controller;

        /**
         * Compare dates. This method can be used in views.
         * @param type Compare type ('<', '<=', '>', '>=', '=')
         * @param d1 Date 1 to compare.
         * @param d2 Date 2 to compare.
         * @return Controller object
         */
        date(type: string, d1: Date, d2: Date): Controller;
        
        /**
         * Compare dates. This method can be used in views.
         * @param type Compare type ('<', '<=', '>', '>=', '=')
         * @param d1 Date 1 to compare.
         * @param d2 Date 2 to compare.
         * @return Controller object
         */
        date(type: string, d1: string, d2: string): Controller;

        /**
         * Set meta description.
         * @param value New meta description.
         * @return Controller object
         */
        description(value: string): Controller;

        destroy(): Controller;

        empty(headers?: Object): Controller;

        error(err: Error): Controller;

        /**
         * Response file. For load file from anywhere - file name must start with ~ char. 
         * @param filename? File in config['directory-public'] or by the rule ~.
         * @param downloadName? This value will added into Content-Disposition header.
         * @param headers? Additional headers.
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/download-file
         */
        file(filename: string, downloadName?: string, headers?: Object): Controller;

        /**
         * Response file (Async). For load file from anywhere - file name must start with ~ char. 
         * This method is called when all operation in async (controller.await(), controller.wait()) 
         * are completed.
         * @param filename File in config['directory-public'] or by the rule ~.
         * @param downloadName? This value will added into Content-Disposition header.
         * @param headers? Additional headers.
         * @return Controller object 
         */
        fileAsync(filename: string, downloadName?: string, headers?: Object): Controller;

        /**
         * Find client connection.
         * @param id Id of client or prepare function.
         * @return Client connection
         */
        find(id: string): WebSocketClient;
        
        /**
         * Find client connection.
         * @param id Id of client or prepare function.
         * @return Client connection
         */
        find(id: Function): WebSocketClient;

        // temporary uncommented
        // functions(name: string): Object;
        functions: any;

        head(value: string): string;

        header(name: string, value: string): Controller;

        helper(name: string, ...params: Object[]): Controller;

        /**
         * Get host name.
         * @param path? Additional relative path.
         * @return Host name
         */
        host(path?: string): string;

        image(filename: string, fnProcess: (image: TotalJS.Image) => void): Controller;

        image(filename: string, fnProcess: (image: TotalJS.Image) => void, headers: Object, useImageMagick: boolean): Controller;

        json(obj: Object, headers?: Object, beautify?: boolean, replacer?: Function): Controller;

        jsonAsync(obj: Object, headers?: Object): Controller;

        keywords(value: string): Controller;

        layout(name);

        /**
         * Append to log file.
         * @param param..n Dynamic parameter 
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/logs
         */
        log(...param: any[]): Controller;

        /**
         * Send e-mail from a view.
         * @param address To e-mail.
         * @param subject E-mail subject.
         * @param name Name of view.
         * @param model? Model into the view.
         * @param callback? Callback.
         * > @param err? Error handling.
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/controller-mail
         */
        mail(address: string, subject: string, name: string, model?: Object, callback?: (err?: Error) => void): Controller;
        
        /**
         * Send e-mail from a view.
         * @param address To e-mail.
         * @param subject E-mail subject.
         * @param name Name of view.
         * @param model? Model into the view.
         * @param callback? Callback.
         * > @param err? Error handling.
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/controller-mail
         */
        mail(address: Array<any>, subject: string, name: string, model?: Object, callback?: (err?: Error) => void): Controller;

        /**
         * Memorize output of controller.view() - layout is not cached (only view), 
         * controller.json() and controller.plain(). This function improves your 
         * response time. Data are saved into the memory.
         * @param key Cache key.
         * @param expiration Expiration.
         * @param fnTo Is executed when is cache empty.
         * @param fnFrom? Is executed when is content read from the cache.
         * @return Controller object 
         */
        memorize(key: string, expiration: Date, fnTo: Function, fnFrom?: Function ): Controller;
        
        /**
         * Memorize output of controller.view() - layout is not cached (only view), 
         * controller.json() and controller.plain(). This function improves your 
         * response time. Data are saved into the memory.
         * @param key Cache key.
         * @param expiration Expiration.
         * @param disabled Disable cache (e.g. for debug mode).
         * @param fnTo Is executed when is cache empty.
         * @param fnFrom? Is executed when is content read from the cache.
         * @return Controller object 
         */
        memorize(key: string, expiration: Date, disabled: boolean, fnTo: Function, fnFrom?: Function): Controller;
        
        meta(title: string, description?: string, keywords?: string, picture?: string): Controller;

        mmr(filename: string, stream: NodeJS.ReadableStream, cb?: Function): Controller;

        /**
         * Return a model object.
         * @param name Model name.
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/models
         */
        model(name: string): Controller;
        
        /**
         * Return a controller models.
         * @param name Controller name.
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/controller-sharing
         */
        models(name: string): Controller;

        /**
         * Return a module object.
         * @param name Module name.
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/framework-modules
         */
        module(name: string): Controller;

        noClear(enable?: boolean): Controller;

        /**
         * Check if ETag or Last Modified has modified. If @compare === {String} compare 
         * if-none-match .... if @compare === {Date} compare if-modified-since. This function 
         * automatically flush a response 304 (if not modified). If content is not modified 
         * then return true.
         * @param compare? Etag = string, Last-Modified = Date.
         * @param strict if strict (true) then use equal date else use great than date.Default: false
         * @return Content is not modified
         *
         * @see https://github.com/totaljs/examples/tree/master/cache-http
         */
        notModified(compare?: string, strict?: boolean): boolean;
        
        /**
         * Check if ETag or Last Modified has modified. If @compare === {String} compare 
         * if-none-match .... if @compare === {Date} compare if-modified-since. This function 
         * automatically flush a response 304 (if not modified). If content is not modified 
         * then return true.
         * @param compare? Etag = string, Last-Modified = Date.
         * @param strict if strict (true) then use equal date else use great than date.Default: false
         * @return Content is not modified
         *
         * @see https://github.com/totaljs/examples/tree/master/cache-http
         */
        notModified(compare?: Date, strict?: boolean): boolean;

        pipe(url: string): Controller;

        pipe(url: string, headers: Object, callback: Function): Controller;

        plain(contentBody: string, headers?: Object): Controller;

        problem(message: string): Controller;

        /**
         * Proxy request to other total.js website.
         * @param url URL address.
         * @param obj Request values.
         * @param fnCallback Completed callback.
         * @param err Error handling.
         * @param data Response data.
         * @param code HTTP status code.
         * @param headers Response headers.
         * @param timeout Request timeout in milliseconds.Default: 10000
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/controller-proxy
         */
        proxy(url: string,
            obj: Object,
            fnCallback: (
                err?: Error,
                data?: String,
                code?: number,
                headers?: Object) => void, 
            timeout?: number): Controller;

        /**
         * Proxy request to other total.js website.
         * @param url URL address.
         * @param fnCallback Completed callback.
         * @param err Error handling.
         * @param data Response data.
         * @param code HTTP status code.
         * @param headers Response headers.
         * @param timeout Request timeout in milliseconds.Default: 10000
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/controller-proxy
         */
        proxy(url: string,
            fnCallback: (
                err?: Error,
                data?: String,
                code?: number,
                headers?: Object) => void,
            timeout?: number): Controller;

        /**
         * Response redirect.
         * @param url URL to redirect.
         * @param permament? Move permament (302). default: false
         * @return Controller object 
         */
        redirect(url: string, permament?: boolean): Controller;
        
        /**
         * Response redirect (async). This method is called when all operation in async 
         * (controller.await(), controller.wait()) are completed.
         * @param url URL to redirect.
         * @param permament? Move permament (302). default: false
         * @return Controller object 
         */
        redirectAsync(url: string, permament?: boolean): Controller;

        /**
         * Read from resource file.
         * @return File content
         *
         * @see https://github.com/totaljs/examples/tree/master/localization-resources
         */
        resource(): string;
        
        /**
         * Read from resource file.
         * @param name Name of resource file.
         * @param key Key in the resource file.
         * @return File content
         *
         * @see https://github.com/totaljs/examples/tree/master/localization-resources
         */
        resource(name: string, key: string): string;
    
        /**
         * 
         * @param name File name.
         * @return string
         */
        routeCSS(name: string): string;
        
        /**
         * Route a font file by the config['static-url-font']. Returns relative URL address.
         * @param name File name.
         * @return string
         */
        routeFont(name: string): string;
        
        /**
         * Route a image file by the config['static-url-image']. Returns relative URL address.
         * @param name File name.
         * @return string
         */
        routeImage(name: string): string;
        
        /**
         * Route a JS file by the config['static-url-js']. Returns relative URL address.
         * @param name File name.
         * @return string
         */
        routeJS(name: string): string;
        
        /**
         * Route a static file by the config['static-url']. Returns relative URL address.
         * @param name File name.
         * @return string
         */
        routeStatic(name: string): string;
        
        /**
         * Route a upload file by the config['static-url-upload']. Returns relative URL address.
         * @param name File name.
         * @return string
         */
        routeUpload(name: string): string;
        
        /**
         * Route a video file by the config['static-url-video']. Returns relative URL address.
         * @param name File name.
         * @return string
         */
        routeVideo(name: string): string;

        /**
         * Run async functions. This function is same as controller.complete().
         * @param callback? Complete function.
         * @return Controller object 
         */
        run(callback?: Function): Controller;

        /** 
         * Send message via websocket to online users. Message will be sended to all connections 
         * or specific connection.
         * @param message Message to send.
         * @param id? Specify connection id.
         * @param blacklist? You can specify a client blacklist.
         * @return Controller object 
         *  
         * @see https://github.com/totaljs/examples/tree/master/websocket
         */
        send(message: string, id?: string[], blacklist?: string[]): Controller;
        /** 
         * Send message via websocket to online users. Message will be sended to all connections 
         * or specific connection.
         * @param message Message to send.
         * @param id Specify connection id.
         * @param blacklist You can specify a client blacklist.
         * @return Controller object 
         *  
         * @see https://github.com/totaljs/examples/tree/master/websocket
         */
        send(message: string, id?: string[], blacklist?: Function): Controller;
        /** 
         * Send message via websocket to online users. Message will be sended to all connections 
         * or specific connection.
         * @param message Message to send.
         * @param id Specify connection id.
         * @param blacklist You can specify a client blacklist.
         * @return Controller object 
         *  
         * @see https://github.com/totaljs/examples/tree/master/websocket
         */
        send(message: string, id?: Function, blacklist?: string[]): Controller;
        /** 
         * Send message via websocket to online users. Message will be sended to all connections 
         * or specific connection.
         * @param message Message to send.
         * @param id Specify connection id.
         * @param blacklist You can specify a client blacklist.
         * @return Controller object 
         *  
         * @see https://github.com/totaljs/examples/tree/master/websocket
         */
        send(message: string, id?: Function, blacklist?: Function): Controller;
        /** 
         * Send message via websocket to online users. Message will be sended to all connections 
         * or specific connection.
         * @param message Message to send.
         * @param id Specify connection id.
         * @param blacklist You can specify a client blacklist.
         * @return Controller object 
         *  
         * @see https://github.com/totaljs/examples/tree/master/websocket
         */
        send(message: Object, id?: string[], blacklist?: string[]): Controller;
        /** 
         * Send message via websocket to online users. Message will be sended to all connections 
         * or specific connection.
         * @param message Message to send.
         * @param id Specify connection id.
         * @param blacklist You can specify a client blacklist.
         * @return Controller object 
         *  
         * @see https://github.com/totaljs/examples/tree/master/websocket
         */
        send(message: Object, id?: string[], blacklist?: Function): Controller;
        /** 
         * Send message via websocket to online users. Message will be sended to all connections 
         * or specific connection.
         * @param message Message to send.
         * @param id Specify connection id.
         * @param blacklist You can specify a client blacklist.
         * @return Controller object 
         *  
         * @see https://github.com/totaljs/examples/tree/master/websocket
         */
        send(message: Object, id?: Function, blacklist?: string[]): Controller;
        /** 
         * Send message via websocket to online users. Message will be sended to all connections 
         * or specific connection.
         * @param message Message to send.
         * @param id Specify connection id.
         * @param blacklist You can specify a client blacklist.
         * @return Controller object
         *  
         * @see https://github.com/totaljs/examples/tree/master/websocket
         */
        send(message: Object, id?: Function, blacklist?: Function): Controller;

        /**
         * Set expires header
         * @param value Set date of expires header.
         * @return Controller object 
         */
        setExpires(value: Date): Controller;

        /**
         * Set Etag
         * @param value Etag
         * @return Controller object 
         * 
         * @see https://github.com/totaljs/examples/tree/master/cache-http
         */
        setModified(value: string): Controller;
        
        /**
         * Set last modified header
         * @param value Last-Modified
         * @return Controller object 
         * 
         * @see https://github.com/totaljs/examples/tree/master/cache-http
         */
        setModified(value: Date): Controller;

        /**
         * Create a custom setting for views.
         * @param param..n Dynamic parameter
         * @return Controller object 
         */
        settings(...param: any[]): Controller;

        /**
         * Add URL to sitemap. Sitemap is stored in: controller.repository.sitemap.
         * @param name Name of webpage.
         * @param url URL of webpage.
         * @param index? Sort index.
         * @return Controller object 
         */
        sitemap(name: string, url: string, index?: number): Controller;

        /**
         * Send data via [S]erver-[s]ent [e]vents.
         * @param data Data to send.
         * @param name? Event name. default: undefined
         * @param id? Current event id. default: undefined
         * @param retry? Reconnection in milliseconds. default: route.timeout
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/server-sent-events
         */
        sse(data: string, name?: string, id?: string, retry?: number): Controller;
        
        /**
         * Send data via [S]erver-[s]ent [e]vents.
         * @param data Data to send.
         * @param name? Event name. default: undefined
         * @param id? Current event id. default: undefined
         * @param retry? Reconnection in milliseconds. default: route.timeout
         * @return Controller object 
         *
         * @see https://github.com/totaljs/examples/tree/master/server-sent-events
         */
        sse(data: Object, name?: string, id?: string, retry?: number): Controller;

        /**
         * Response stream.
         * @param contentType Content type of stream.
         * @param stream Stream to response.
         * @param downloadName? This value will added into Content-Disposition header.
         * @param headers? Additional headers.
         * @return Controller object 
         */
        stream(contentType: string, stream: NodeJS.ReadableStream, downloadName?: string, headers?: Object): Controller;

        /**
         * Response 400 error - Bad request.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        throw400(problem?: string): Controller;

        /**
         * Response 401 error - Unauthorized.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        throw401(problem?: string): Controller;

        /**
         * Response 403 error - Forbidden.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        throw403(problem?: string): Controller;

        /**
         * Response 404 error - Not Found.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        throw404(problem?: string): Controller;

        /**
         * Response 500 error - Internal server error.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        throw500(problem?: string): Controller;

        /**
         * Response 501 error - Not Implemented.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        throw501(problem?: string): Controller;

        /**
         * Set meta title.
         * @param value New meta title.
         * @return Controller object
         */
        title(value: string): Controller;
        
        /**
         * Transfer current request to a new route.
         * @param url Relative URL address.
         * @param flags Route flags.
         * @return Status
         */
        transfer(url: string, flags?: string[]): boolean;
    
        /**
         * Validate an object model.
         * IMPORTANT: If 'properties' is string then properties read 
         * by the schema validation. Read more in Builders.SchemaBuilder.
         * @param model Object to validate.
         * @param properties Define properties for to validation.
         * @param prefix? Prefix for resource key. default: ''
         * @param name? A resource name. default: default
         * @return Status
         *
         * @see https://github.com/totaljs/examples/tree/master/validation
         */
        validate(model: Object, properties: string[], prefix?: string, name?: string): boolean;
    
        /**
         * Validate an object model.
         * IMPORTANT: If 'properties' is string then properties read 
         * by the schema validation. Read more in Builders.SchemaBuilder.
         * @param name Name of schema (SchemaBuilder)
         * @param model Model to validate
         * @param prefix? Prefix for resource key. default: ''
         * @param name2? A resource name. default: default
         * @return Status
         *
         * @see https://github.com/totaljs/examples/tree/master/validation
         */
        validate(name: string, model: Object, prefix?: string, name2?: string): boolean;
    
        /**
         * Response a view. 
         * IMPORTANT: view is loaded by the controller name. 
         * Example: my-controller-name.js set view path to /views/my-controller-name/some-view.html
         *  - except default.js of controller name. If your view name starts with ~ then will skipped 
         * a controller directory name.
         * @param name Name of view.
         * @param model? Model for this view.
         * @param headers? Additional headers.
         * @param isPartial? If true - then function return rendered HTML.Default: false
         * @return Controller object or string
         */
        view(name: string, model?: Object, headers?: Object, isPartial?: boolean): Controller;

        /**
         * Response 400 error - Bad request.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        view400(problem?: string): Controller;

        /**
         * Response 401 error - Unauthorized.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        view401(problem?: string): Controller;

        /**
         * Response 403 error - Forbidden.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        view403(problem?: string): Controller;

        /**
         * Response 404 error - Not Found.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        view404(problem?: string): Controller;

        /**
         * Response 500 error - Internal server error.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        view500(problem?: string): Controller;

        /**
         * Response 501 error - Not Implemented.
         * @param problem? Why is restriction created? Read more: #controller.problem
         * @return Controller object
         */
        view501(problem?: string): Controller;
        
        /**
         * Response a view. 
         * IMPORTANT: view is loaded by the controller name. 
         * Example: my-controller-name.js set view path to /views/my-controller-name/some-view.html
         *  - except default.js of controller name. If your view name starts with ~ then will skipped 
         * a controller directory name. This method is called when all operation in async 
         * (controller.await(), controller.wait()) are completed.
         * @param name Name of view.
         * @param model? Model for this view.
         * @param headers? Additional headers.
         * @return Controller object or string
         *
         * @see https://github.com/totaljs/examples/tree/master/views
         */
        viewAsync(name: string, model?: Object, headers?: Object): Controller;

        /**
         * Add a function to async waiting list.
         * @param name Name of task.
         * @return Controller object
         */
        wait(name: string);
        
        /**
         * Add a function to async waiting list.
         * @param name Name of task.
         * @param waitingFor Name of another task.
         * @param fn Name of task.
         * > @param next Completed function.
         * @return Controller object
         */
        wait(name: string, waitingFor: string, fn: (next: () => void) => void);

        /**< Delegates */

        /**
         * Delegate for capture each request into this controller.
         */
        request();

        /**
         * Controller monitoring.
         * @param detailed Framework wants detailed informations about usage.
         * @return 
         */
        usage(detailed: boolean): string;

        
        /**
         * Create event function
         * <pre>
         * {@code
         * controller.on('close', client)
         * controller.on('destroy', )
         * controller.on('error', err, client)
         * controller.on('message', client, message)
         * controller.on('open', client)
         * controller.on('send', message, id, blacklist)
         * }
         * </pre>
         * @param event Event name
         * @param fn Function run
         * @return Totaljs Framework object
         *
         * @see http://docs.totaljs.com/FrameworkController/#exports.request
         */
        on(event: string, ...params: any[]): Framework;
    }

    interface WebSocket {
        
        /**< Attributes */
        
        /**
         * List of all connections
         */
        connections: WebSocketClient[];
        
        /**
         * Identification value
         */
        id: string
        
        /**
         * Websocket identification name
         */
        name: string
        
        /**
         * Number clients connected
         */
        online: number;
        
        /**
         * 
         */
        repository: Object;
        
        /**
         * return if it is a controller
         */
        isController: boolean;
        
        /**
         * Url of the websocket connection
         */
        uri: string;
        
        /**< Methods */
        
        /**
         * Close connection
         * <pre>
         * {@code
         *   if (names === null || names === undefined)
         *	   close/disconnect all users
         * }
         * </pre>
         *
         * @names names? client.id, optional - default null
         */
        close(names?: string[]);
        
        /**
         * Destroy websocket
         */
        destroy();
        
        /**
         * Find a client
         * @param name Name of the client
         * return WebSocketClient
         */
        find(name: string): WebSocketClient;
        
        /**
         * Send message to all
         * <pre>
         * {@code
         *  if (names === null || names === undefined)
         * 		message send to all users
         * }
         * </pre>
         * @param value Message sent to client.
         * @param names? Ids of the client to send to, default null
         * @param blacklist? Ids of the clients to remove from list to send message to, default null
         */
        send(value: string, names?: string[], blacklist?: string[]);
        /**
         * Send message to all
         * <pre>
         * {@code
         *  if (names === null || names === undefined)
         * 		message send to all users
         * }
         * </pre>
         * @param value Message sent to client.
         * @param names? Ids of the client to send to, default null
         * @param blacklist? Ids of the clients to remove from list to send message to, default null
         */
        send(value: Object, names?: string[], blacklist?: string[]);
                 
        /**< Events */

        /**
         * Create event function
         * <pre>
         * {@code
         * mail.on('error', err, client)
         * mail.on('message', client, message)
         * mail.on('open', client)
         * mail.on('close', client)
         * }
         * </pre>
         * @param event Event name
         * @param fn Function run
         * @return Totaljs Framework object
         *
         * @see http://docs.totaljs.com/FrameworkMail/#mail.on('error')
         */
        on(event: string, ...params: any[]): Framework;
    }
    
    /**
     * 
     */
    interface WebSocketClient {

        /**< Properties */

        /**
         * Parsed data from URL params. Alias for: client.query.
         */
        get: Object;

        /**
         * ID of connection / client. You can change this id by yourself.
         */
        id: string

        /**
         * Current IP address.
         */
        ip: string;

        /**
         * Is connection closed?
         */
        isClosed: boolean;

        /**
         * Current protocol.
         */
        protocol: string[];

        /**
         * Parsed data from URL params.
         */
        query: Object;

        /**
         * HTTP request.
         */
        req: Object;

        /**
         * Current custom session object. default: null
         */
        session: Object;

        /**
         * node.js net.Socket
         * type: net.Socket;
         */
        socket: any;

        /**
         * Current URI address.
         * type: URI;
         */
        uri: any;

        /**
         * Current custom user object. default: null
         */
        user: Object;
        
        /**< Methods */

        /**
         * Close a connection.
         * @param message? Reason message.
         * @param code? Reason code. https://tools.ietf.org/html/rfc6455#section-7.4 default: 1000
         * @return WebSocketClient object
         */
        close(message?: string, code?: number): WebSocketClient;
    
        /**
         * Get cookie.
         * @param name Name of cookie.
         * @return cookie. default ''
         */
        cookie(name: string): string;

        /**
         * Send message via websocket to client.
         * @param message Message to send.
         * @return WebSocketClient object
         */
        send(message: string): WebSocketClient;
        
        /**
         * Send message via websocket to client.
         * @param message Message to send.
         * @return WebSocketClient object
         */
        send(message: Object): WebSocketClient;
    }

    /**
     * Views support simple conditions and custom helpers
     * @see http://docs.partialjs.com/how-does-it-work/views/
     */
    /* interface Views {


     } */

    /**
     * 
     */
    interface Utils {

        /**< Methods */

        /**  
         * Assign value into the object property by the path.
         * @param source Source object.
         * @param path Path to property. Example: 'users.name'.
         * @param fn Object can replace value and function too
         * @return Utils object
         */
        assign(source: Object, path: string, fn: Function): Utils;
        /**  
         * Assign value into the object property by the path.
         * @param source Source object.
         * @param path Path to property. Example: 'users.name'.
         * @param fn Object can replace value and function too
         * @return Utils object
         */
        assign(source: Object, path: string, fn: Object): Utils;

        /**
         * Combine paths.
         * @param param..n Paths
         * @return combined paths as string
         */
        combine(...param: string[]): string;

        /**
         * Copy values between objects. Function return target object.
         * @param source Source object.
         * @param target? Target object.
         * @return Target object
         */
        copy(source: Object, target?: Object): Object;

        /**
         * Get distance (KM) from two GPS coordinates.
         * @param lat1 Latitude.
         * @param lon1 Longitude.
         * @param lat2 Latitude.
         * @param lon2 Longitude.
         * @return Distanz
         */
        distance(lat1: number, lon1: number, lat2: number, lon2: number): number;

        /**
         * Download content or file from an url address.
         * @param url URL address.
         * @return Status
         */
        download(url: string): boolean;

        /**
         * Download content or file from an url address.
         * @param url URL address.
         * @param flags? Request flags.
         * @param data ObjectRequest data.
         * @param callback FunctionCallback.
         * > @param err Error handling.
         * > @param response Response stream - response.pipe(myWriteableStream).
         * @param cookies? Request cookies. default: {}
         * @return Status
         */
        download(
            url: string,
            flags: string[],
            data: Object,
            callback: (err?: Error, response?: Response) => void,
            cookies?: Object): boolean;

        /**
         * Download content or file from an url address.
         * @param url URL address.
         * @param flags? Request flags.
         * @param data ObjectRequest data.
         * @param callback FunctionCallback.
         * > @param err Error handling.
         * > @param response Response stream - response.pipe(myWriteableStream).
         * @param cookies? Request cookies. default: {}
         * @param headers? Additional / Custom headers. default: {}
         * @param encoding? Request encoding. default: 'utf8'
         * @param timeout? Request timeout - in milliseconds. default: 10000
         * @return Status
         */
        download(
            url: string,
            flags: string[],
            data: Object,
            callback: (err?: Error, response?: Response) => void,
            cookies: Object,
            headers: Object,
            encoding: string,
            timeout?: number): boolean;

        /**
         * Create ETag from a text.
         * @param text Text for generating ETag.
         * @param version? Additional version. 
         * @return ETag
         */
        etag(text: string, version?: string): string;

        /**
         * Extend object. Function return extended target object.
         * @param target Target object.
         * @param source Source object.
         * @param rewrite? Rewrite existing values.Default: false
         * @return Target object
         */
        extend(target: Object, source: Object, rewrite?: boolean): Object;

        /**
         * Get content type from file extension.
         * @param extension StringFile extension.
         * @return Content type
         */
        getContentType(extension: string): string;

        GUID(max: number): string;

        /**
         * Decode string from HTML safe characters.
         * @param str Text to decode.
         * @return Decoded string
         */
        htmlDecode(str: string): string;

        /**
         * Encode string to HTML safe characters.
         * @param str Text to encode
         * @return Encoded string
         */
        htmlEncode(str: string): string;

        httpStatus(code: number, addCode?: boolean): string;

        isArray(value: Object): boolean;

        isDate(value: Object): boolean;

        isEmail(value: Object): boolean;

        isEmpty(obj: Object): boolean;

        isNullOrEmpty(str: string): boolean;

        isRelative(url: string): boolean;

        isURL(value: Object): boolean;

        /**
         * Lists the contents of a directory.
         * @param path Path.
         * @param callback Callback.
         * > @param files? List of files.
         * > @param directories? List of directories.
         * @param filter? Prepare function.
         * > @param path? Current path.
         * > @param isDirectory? Is current path a directory?
         */
        ls(path: string,
            callback: (files?: string, directories?: string[]) => void,
            filter?: (path?: string, isDirectory?: boolean) => boolean);

        noop();

        parseFloat(value: Object): number;

        parseInt(value: Object): number;

        parseXML(value: string): Object;

        path(url: string, delimiter?: string): string;

        random(max: number, min: number): number;

        /**
         * Reduce object properties by the array or object. This function is helpful for received model from a form.
         * @param source Source object.
         * @param prop Reduce an object properties by the array or object.
         * @return Reduced Object
         */
        reduce(source: Object, prop: string[]): Object;
        
        /**
         * Reduce object properties by the array or object. This function is helpful for received model from a form.
         * @param source Source object.
         * @param prop Reduce an object properties by the array or object.
         * @return Reduced Object
         */
        reduce(source: Object, prop: Object): Object;

        /**
         * Remove string diacritics.
         * @param value Remove diacritics from this value.
         * @return Clean string
         */
        removeDiacritics(value: string): string;

        /**
         * Create a request (GET/POST/DELETE/PUT) to URL address with custom params and headers.
         * @param url URL address.
         * @param flags? Request flags.
         * @param data Request data.
         * @param callback Completed callback.
         * > @param err? Error handling.Default: null
         * > @param data? JSON (by the content type) is deserialized to object.
         * > @param status? Response status code.Default: 0
         * > @param headers? Response headers.
         * @param cookies? Request cookies. default: {}
         * @param headers? Additional / Custom headers. default: {}
         * @param encoding? Request encoding. default: 'utf8'
         * @param timeout? Request timeout - in milliseconds. default: 10000
         * @return Success
         */
        request(
            url: string,
            data: Object,
            callback: (
                err?: Error,
                data?: Object,
                status?: number,
                headers?: Object
            ) => void,
            cookies?: Object,
            headers?: Object,
            encoding?: string,
            timeout?: number): boolean;

        /**
         * Create a request (GET/POST/DELETE/PUT) to URL address with custom params and headers.
         * @param url URL address.
         * @param flags? Request flags.
         * @param data Request data.
         * @param callback Completed callback.
         * > @param err? Error handling.Default: null
         * > @param data? JSON (by the content type) is deserialized to object.
         * > @param status? Response status code.Default: 0
         * > @param headers? Response headers.
         * @param cookies? Request cookies. default: {}
         * @param headers? Additional / Custom headers. default: {}
         * @param encoding? Request encoding. default: 'utf8'
         * @param timeout? Request timeout - in milliseconds. default: 10000
         * @return Success
         */
        request(
            url: string,
            flags: string,
            data: Object,
            callback: (
            err?: Error,
            data?: Object,
            status?: number,
            headers?: Object
            ) => void,
            cookies?: Object,
            headers?: Object,
            encoding?: string,
            timeout?: number): boolean;

        /**
         * Send file to an url address.
         * @param name Name of file with extension.
         * @param stream Stream or Filename (filename must exist).
         * @param url URL where send this this stream/file.
         * @param callback? Callback.
         * > @param err? Error handling.
         * > @param response? Response string.
         * @param headers? Additional headers.
         * @param method? Request method (POST or PUT).Default: 'POST'
         */
        send(
            name: string,
            stream: string,
            url: string,
            callback?: (
                err?: Error,
                response?: string
            ) => void, 
            headers?: Object, 
            method?: string);
        /**
         * Send stream to an url address.
         * @param name Name of file with extension.
         * @param stream Stream or Filename (filename must exist).
         * @param url URL where send this this stream/file.
         * @param callback? Callback.
         * > @param err? Error handling.
         * > @param response? Response string.
         * @param headers? Additional headers.
         * @param method? Request method (POST or PUT).Default: 'POST'
         */
        send(
            name: string,
            stream: NodeJS.ReadableStream,
            url: string,
            callback?: (
                err?: Error,
                response?: string
            ) => void,
            headers?: Object,
            method?: string);

        trim(obj: Object): Object;

        /**
         * Validate an object model.
         * IMPORTANT: If 'properties' is string then properties read by the schema validation. 
         * Read more in Builders.SchemaBuilder.
         * @param model ObjectObject to valid.
         * @param properties String ArrayDefine properties for to validation.
         * @param prepare Functionmust return BooleanThis function must return Boolean or utils.isValid().
         * > @param name? StringProperty name.
         * > @param value? ObjectProperty value.
         * > @param path? StringCurrent path in object.
         * > @param schema? StringSchema name.
         * @param builder? ErrorBuilderoptionalError builder for storing error collection.
         * @param resource? Functionoptionalmust return StringResource function.
         * > @param key? StringProperty name.
         *
         * @see https://github.com/totaljs/examples/tree/master/validation-custom
         */
        validate(
            model: Object,
            properties: string,
            prepare: (
                name?: string,
                value?: Object,
                path?: string,
                schema?: string
            ) => boolean, 
            builder?: ErrorBuilder, 
            resource?: (
                key?: string
            ) => void);

    }

    /**
     * This class supports sending e-mails via SMTP protocol. FrameworkMail supports TLS.
     */
    interface Mail {

        /**< Properties */

        /**
         * Body of e-mail. Body can be HTML.
         */
        body: string;

        /**
         * Subject of e-mail.
         */
        subject: string;

        /**< Methods */

        attachment(filename: string, name?: string): Mail;

        /**
         * Add a BCC e-mail address.
         * @param address A valid e-mail address.
         * @return Mail object.
         */
        bcc(address: string): Mail;

        /**
         * Add a CC e-mail address.
         * @param address A valid e-mail address.
         * @return Mail object.
         */
        cc(address: string): Mail;

        /**
         * Set sender of mail.
         * @param address A valid e-mail address.
         * @param name Name of sender. Example: total.js
         * @return Mail object.
         */
        from(address: string, name: string): Mail;

        /**
         * Add a reply e-mail address.
         * @param address A valid e-mail address.
         * @return Mail object.
         */
        reply(address: string): Mail;

        /**
         *
         * @param smtp SMTP server - host address.
         * @param options? SMTP options.
         * > @param secure? Is a secure connection? (HTTPS/TLS) default: false
         * > @param port? Port number. default: 25
         * > @param user? SMTP user name. default: ''
         * > @param password? SMTP password. default: ''
         * > @param timeout? Connection timeout in milliseconds. default: 10000
         * @param callback? Callback.
         */
        send(
            smtp: string,
            options?: {
                secure?: boolean;
                port?: number;
                password?: string;
                timeout?: number;
            },
            callback?: () => void);

        /**
         * Add a to e-mail address.
         * @param address A valid e-mail address.
         * @return Mail object.
         */
        to(address: string): Mail;
        
        /**< Events */

        /**
         * Create event function
         * <pre>
         * {@code
         * mail.on('error', err, message)
         * mail.on('sending', message)
         * mail.on('success', message)
         * }
         * </pre>
         * @param event Event name
         * @param fn Function run
         * @return Totaljs Framework object
         *
         * @see http://docs.totaljs.com/FrameworkMail/#mail.on('error')
         */
        on(event: string, ...params: any[]): Framework;

    }

    /**
     * This class contains functions for manipulation of images. For using of FrameworkImage 
     * you must have on server installed ImageMagick or GraphicsMagick plugin.
     *
     * Example:
     * <pre>
     * {@code
     * var Image = require('total.js/image');
     * var image = Image.load('filename', [imageMagick]);
     *  
     * // OR 
     *  
     * var image = Image.load(fs.createReadStream('/users/petersirka/desktop/header.jpg'));
     *  
     * image.resizeCenter(200, 200);
     * image.grayscale();
     * image.save('filename');
     * }
     * </pre>
     */
    interface Image {

        /**
         * Set align of image.
         * @param type Types: left top right bottom center. You can use multiple types.
         * @return Image object
         */
        align(type: string): Image;

        background(color: string): Image;

        bitdepth(value: number): Image;

        blur(radius: number): Image;

        colors(value: number): Image;

        command(arg: string, priority?: number): Image;

        crop(width: string, height: string, x: number, y: number): Image;

        flip(): Image;

        flop(): Image;

        grayscale(): Image;

        identify(callback: (err?: Error, indo?: Object) => void): Image;

        measure(callback: (err?: Error, size?: Object) => void): Image;

        minify(): Image;

        normalize(): Image;

        output(type: string): Image;

        pipe(stream: NodeJS.WritableStream, type?: string, options?: Object): Image;

        quality(percentage: number): Image;

        resize(width: string, height: string, options?: Object): Image;
        resize(both: string);

        resizeCenter(width: string, height: string): Image;

        rotate(deg: number): Image;

        save(filename: string, callback?: (err?: Error, filename?: string) => void);

        scale(width: string, height: string, options: Object): Image;

        /**
         * Sepia of image.
         * @return Image object
         */
        sepia(): Image;

        stream(type?: string): Image;

    }

    /**< Builders */

    /**
     * Error builder is helpful for model error handling.
     *
     * <pre>
     * {@code
     * var builders = require('total.js/builders');
     * var builder = new builders.ErrorBuilder();
     * }
     * </pre>
     */
    interface ErrorBuilder {

        /**< Methods */

        add(name, errorMessage?);

        clear();

        hasError(name?);

        json(beautify?);

        read(name);

        remove(name);

        replace(search, newValue);

        resource(name, prefix?);

        /**
         * Create an instance.
         * @param onResource? Resource reader.
         * > @param key? Key for resource.
         */
        ErrorBuilder(onResource?: (key?: string) => void): ErrorBuilder;

    }

    /**
     * Pagination is helpful for datasource paging.
     *
     * <pre>
     * {@code
     * var builders = require('total.js/builders');
     * var builder = new builders.Pagination();
     * }
     * </pre>
     */
    interface Pagination {
        
        /**< Properties */

        count: number;
        format: string;
        isNext: boolean;
        isPrev: boolean;
        items: number;
        max: number;
        page: number;
        skip: number;
        take: number;
        visible: boolean;
        
        /**< Methods */

        next(format?: string): Object;
        prev(format?: string): Object;
        refresh(items: number, page: number, max: number): Pagination;
        render(max?: number, format?: string): Pagination;

    }
    
    /**
     * URL builder is helpful for dynamic creating URL address.
     *
     * <pre>
     * {@code
     * var builders = require('total.js/builders');
     * var builder = new builders.UrlBuilder();
     * }
     * </pre>
     */
    interface UrlBuilder {

        /**< Methods */

        add(name: string, value: Object): UrlBuilder;
        clear(): Pagination;
        hasValue(keys: string[]): boolean;
        read(name: string): string;
        remove(name: string): Pagination;
        toOne(keys: string[], delimiter?: string): string;
        toString(): string;

    }
    
    /**
     * Schema builder is helpful for model definitions.By the schema you can validate a model.
     *
     * <pre>
     * {@code
     * // Example:
     * Builders.schema('user', { firstname: 'string(40)', lastname: String, created: Date }, function (name) {
     *     if (name === 'created')
     *         return new Date();
     * });
     * 
     * // Why?
     * db.insert(Builders.prepare('user', controller.body));
     * }
     * </pre>
     */
    interface SchemaBuilder {

        /**< Methods */

        create(name: string): Object;
        defaults(name: string): Object;
        prepare(name: string, model: Object): Object;
        remove(name: string);

        schema(name: string,
            definition: Object,
                defaults?: (
                name: string,
                isDefault: boolean,
                schema: string
            ) => void,
            validator?: (
                name: string,
                value: Object,
                path: string,
                schema: string
            ) => void): Object;

        validate(name: string, model: Object): ErrorBuilder;
        validation(name: string, validator?: (name: string, value: Object, path: string, schema: string) => void): Object
        validation(name: string, definition: string[]): Object;

    }

    /**< Additional */

    /** 
     * This stats are filled automatically. You can change/resets stats any time.
     */
    interface Stats {
        
        /**< Properties */

        request: {
            
            /**< Properties */

            blocked: number;
            file: number;
            get: number;
            pending: number;
            post: number;
            put: number;
            timeout: number;
            upload: number;
            web: number;
            websocket: number;
            xhr: number;
            xss: number;

            'delete': number
        };

        response: {
            
            /**< Properties */

            binary: number;
            custom: number;
            destroy: number;
            empty: number;
            error400: number;
            error401: number;
            error403: number;
            error404: number;
            error408: number;
            error431: number;
            error500: number;
            error501: number;
            file: number;
            forwarding: number;
            json: number;
            mmr: number;
            notModified: number;
            plain: number;
            redirect: number;
            restriction: number;
            sse: number;
            stream: number;
            streaming: number;
            timeout: number;
            view: number;
            websocket: number;
        }

    }

    /**
     * This class is created after is uploaded a file on the server. Usage: Controller.files.
     */
    interface HttpFile {

        /**< Properties */

        contentType: string;
        filename: string;
        height: number;
        length: number;
        name: string;
        path: string;
        width: number;

        /**< Methods */

        copy(filename: string, callback?: Function): HttpFile;
        image(imageMagick?: boolean): Image;
        isAudio(): boolean;
        isImage(): boolean;
        isVideo(): boolean;
        md5(callback: (err?: Error, hash?: string) => void): HttpFile;
        pipe(stream: NodeJS.WritableStream, options?: Object): HttpFile;
        read(callback: (err?: Error, data?: NodeBuffer) => void): HttpFile;
        readSync(): NodeBuffer;
        stream(options?: Object): HttpFile;

    }

    interface HttpRouteOptions {
        
        /**< Properties */

        flags?: string[];
        length?: number;
        middleware?: string[]
        options?: Object;
        origin?: string[];
        protocols?: string[];
        timeout?: number;

    }

    interface Async {

        /**< Properties */

        count: number;
        percentage: number;

        /**< Methods */

        await(): Async;
        await(name: string, fn: () => void, cb?: () => void): Async;
        cancel(): Async;
        cancel(name?: string): Async
        complete(callback?: Function): Async;
        isPending(name: string): boolean;
        isRunning(name?: string): boolean;
        isWaiting(name: string): boolean;
        run(callback?: Function): Async;
        timeout(name: string, timeout?: number): Async;
        wait(name: string, fn: (next?: Function) => void, cb?: Function): Async;
        wait(name: string, waitingFor: string, fn: (next?: Function) => void, cb?: Function): Async;

    }
}

/**< Prototypes */

/**
 * Request prototype is available in each node.js / total.js script. This prototype is defined in Framework (index.js).
 */
interface Request {

    /**< Properties */

    body: Object;
    files: TotalJS.HttpFile[];
    flags: string[];
    host: string;
    ip: string
        isAuthorized: boolean;
    isProxy: boolean;
    isSecure: boolean;
    language: string;
    path: string[];
    prefix: string;
    query: Object;
    session: Object;
    subdomain: string;

    /**
     * Current URI object.
     * type: URI
     */
    uri: any;
    user: Object;
    xhr: boolean;

    /**< Methods */

    authorization(): Object;
    clear(): Request;
    cookie(name: string): string;
    hostname(path?: string): string;
    noCache(): Request;
    signature(key?: string): string;
}

/**
 * Response prototype is available in each node.js / total.js script. This prototype is defined in Framework (index.js).
 */
interface Response {

    /**< Properties */

    controller: TotalJS.Controller;
    req: Request;
    success: boolean;

    /**< Methods */

    continue(): Response;
    cookie(name: string, value: string, options?: Object): Response;
    file(filename: string, downloadName?: string, headers?: Object): Response;
    image(filename: string, fnProcess: (image?: TotalJS.Image) => void, headers?: Object): Response;
    json(body: Object): Response;
    noCache(): Response;
    send(code, body, type?: string): Response;
    send(): Response;
    stream(type: string, stream: NodeJS.ReadableStream, downloadName?: string, headers?: Object): Response;

}

/** 
 * String prototype is available in each node.js / total.js script. Prototypes are defined in 
 * FrameworkUtils (utils.js). FrameworkUtils is a global variable.
 */
interface String {

    /**< Methods */

    base64ContentType(): string;
    base64ToFile(filename: string, callback?: (err?: Error) => void): string;
    contains(value: string, mustAll?: boolean);
    contains(value: Array<any>, mustAll?: boolean);
    count(word: string): string;
    decode(): string;
    decrypt(key: string): string;
    encode(): string;
    encrypt(key: string, unique?: boolean): string;
    endsWith(value: string, ignoreCase?: boolean): string;
    format(...param: any[]): Object;
    fromUnicode(): string;
    hash(type?: string): string
    isBoolean(): boolean;
    isEmail(): boolean;
    isJSON(): boolean;
    isURL(): boolean;
    linker(max?: number): string
    max(maxLength: number, chars?: string): string;
    md5(salt: string): string
    padLeft(max: number, char?: string): string;
    padRight(max: number, char?: string): string;
    params(obj: Object): string;
    parseConfig(): Object;
    parseDate(): Date;
    parseDateExpire(): Date;
    parseFLoat(def?: Object): number;
    parseInt(def?: Object): number;
    pluralize(zero: string, one: string, few: string, other: string): string;
    removeDiacritics(): string;
    sha1(salt?: string): string;
    sha256(salt?: string): string;
    sha512(salt?: string): string;
    slug(max: number): string;
    startsWith(value: string, ignoreCase?: boolean): boolean;
    toUnicode(): string;
    urlDecode(): string;
    urlEncode(): string;
}

/**
 * Number prototype is available in each node.js / total.js script. Prototypes are defined in 
 * FrameworkUtils (utils.js). FrameworkUtils is a global variable.
 */
interface Number {

    /**< Methods */

    discount(percentage: number, decimals?: number): number;
    floor(decimals: number): number;
    format(format: string): string;
    hex(length: number): string;
    padLeft(max: number, char?: string): string;
    padRight(max: number, char?: string): string;
    parseDate(plus: number): number;
    pluralize(zero: string, one: string, few: string, other: string): string;
    VAT(percentage: number, decimals?: number, includedVAT?: boolean): number;

}

/**
 * Date prototype is available in each node.js / total.js script. Prototypes are defined in 
 * FrameworkUtils (utils.js). FrameworkUtils is a global variable.
 */
interface Date {

    /**< Methods */

    compare(d1: string, d2: string): number;
    compare(d1: Date, d2: string): number;
    compare(d1: string, d2: Date): number;
    compare(d1: Date, d2: Date): number;
    add(type: string, count: number): Date;
    compare(date: string): number;
    compare(date: Date): number;
    format(format: string): string;

}

interface Array<T> {

    /**< Methods */

    async(onComplete?: () => void): Array<T>;
    find(fn: (item?: T, index?: number) => void): T;
    orderBy(path: string, asc: boolean): Array<T>;
    random(): Object;
    randomize(): Array<T>;
    remove(fn: (item?: T, index?: number) => void): Array<T>;
    skip(count: number): Array<T>;
    take(count: number): Array<T>;
    trim(): Array<T>;
    wait(onItem: (item?: T, next?: Function) => void, onComplete?: () => void): Array<T>;
    where(fn: (item?: T, index?: number) => void): Array<T>;

}

/**
 * Define Config interfaces to be overriden by user
 */
interface Config {

}

/**< Declare */

declare module "total.js" {
    export = framework;
}

declare module "total.js/image" {
    
    /**
     * Create an Image instance.
     * @param filename filenamereadable stream.
     * @param imagemagick? Use ImageMagick (true) or GraphicsMagick (false)?Default: false
     * @return Image object
     */
    export function load(filename: string, imagemagick?: boolean): TotalJS.Image;
    /**
     * Create an Image instance.
     * @param filename Image readable stream.
     * @param imagemagick? Use ImageMagick (true) or GraphicsMagick (false)?Default: false
     * @return Image object
     */
    export function load(filename: NodeJS.ReadableStream, imagemagick?: boolean): TotalJS.Image;

}

declare module "total.js/controller" {

    var controller: TotalJS.Controller;

    /**
     * export class controller
     */
    export = controller;
}

declare module "total.js/builders" {
    export = builders;
}


/**
 * global objects or functions.
 */

/**
 * Get Framework
 */
declare var framework: TotalJS.Framework;

/**
 * Get FrameworkUtils.
 */
declare var utils: TotalJS.Utils;

/**
 * Get FrameworkMail.
 */
declare var mail: TotalJS.Mail;

/**
 * Get Builders (schema, error, pagination, etc.).
 */
declare module builders {

    /**
     * Create ErrorBuilder instance.
     */
    export interface ErrorBuilder extends TotalJS.ErrorBuilder { }

    /**
     * Create UrlBuilder instance.
     */
    export interface UrlBuilder extends TotalJS.UrlBuilder { }

    /** 
     * Constructor. Create an instance.
     * @param items Items count.
     * @param page Current page - (from 1).
     * @param max Max items to page.
     * @param format? Format for build URL.Default: '?page={0}'
     * @return Created Instance
     */
    export function Pagination(items: number, page: number, max: number, format?: string): TotalJS.Pagination;
}

/**
 * Global Methods
 */

declare function CONFIG(key: string): Object;
declare function CONFIG<T>(key: string): T;

declare function CONTROLLER(name: string): TotalJS.Controller;
declare function CONTROLLER<T>(name: string): T;

declare function DATABASE(): TotalJS.NoSQLDatabase;

declare function FUNCTION(name: string): TotalJS.Framework;

declare function INCLUDE(name: string, options?: Object): Object;
declare function INCLUDE<T>(name: string, options?: Object): T;

declare function INSTALL(type: string, declaration: string, options?: Object, callback?: (err: Error) => void);
declare function INSTALL(type: string, declaration: Function, options?: Object, callback?: (err: Error) => void);
declare function INSTALL(type: string, name: string, declaration: string, options?: Object, callback?: (err: Error) => void);
declare function INSTALL(type: string, name: string, declaration: Function, options?: Object, callback?: (err: Error) => void);

declare function LOG(): TotalJS.Framework;

declare function MODEL(name: string): Object;
declare function MODEL<T>(name: string): T;

declare function MODULE(name: string): Object;
declare function MODULE<T>(name: string): T;

declare function RESOURCE(name: string, key?: string): Object;
declare function RESOURCE<T>(name: string, key?: string): T;

declare function SOURCE(name: string, options?: Object): Object;
declare function SOURCE<T>(name: string, options?: Object): T;

declare function UNINSTALL(type: string, name: string, options?: Object): TotalJS.Framework;