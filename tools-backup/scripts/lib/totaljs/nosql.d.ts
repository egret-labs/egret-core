/**
 * node.js NoSQL embedded database
 * Version: 2.0.7
 * Date: 12.09.2014
 *
 * This file only contains the nodejs nosql typescript definition, run:
$ sudo npm install -g nosql
// or
$ npm install nosql
 * this will download the javascript file.
 * Example code and exact description can be found on the github page:
 *
 * Source: https://github.com/petersirka/nosql
 */

declare module TotalJS {

    interface NoSQLStatic {

        /**
         * load table
         * @param database Location of the database
         * @param binarylocation Location in where to save the binary files
         * @return Database reference
         */
        load(database: string, binarylocation?: string): NoSQLDatabase;
    }

    // READ DOCUMENTS
    // nosql.all(fnMap, fnCallback, [itemSkip], [itemTake]);
    // nosql.one(fnMap, fnCallback);
    // nosql.top(max, fnMap, fnCallback);
    // nosql.each(fnCallback);
    // ============================================================================
    interface NoSQLReadDoc {

        /**
         * 
         */
        all(fnMap: (doc: any) => any, fnCallback: Function, itemSkip?: any, itemTake?: any);

        all<T>(fnMap: (doc: T) => T, fnCallback: Function, itemSkip?: any, itemTake?: any);

        /**
         * 
         */
        one(fnMap: any, fnCallback: Function);

        /**
         * 
         */
        top(max: number, fnMap: any, fnCallback: Function);

        /**
         * 
         */
        each(fnCallback: Function);

    }

    // VIEWS
    // nosql.view.all(name, fnCallback, [itemSkip], [itemTake], [fnMap]);
    // nosql.view.one(name, [fnMap], fnCallback);
    // nosql.view.top(name, top, fnCallback, [fnMap]);
    // nosql.view.create(name, fnMap, fnSort, [fnCallback], [fnUpdate], [changes]);
    // nosql.view.drop(name, [fnCallback], [changes]);
    // ============================================================================
    interface NoSQLView extends NoSQLReadDoc {

        /**
         * create a new view
         * @T type
         * @param name unique function name
         * @param fnMap 
         * @param fnSort 
         * @param fnCallback run when creation finished
         * @param fnUpdate 
         * @param changes? set changelog message
         */
        create<T>(name: string, fnMap: (doc: T) => T, fnSort: (a: T, b: T) => number, fnCallback?: () => void, fnUpdate?: () => void, changes?: string);

        /**
         * create a new view
         * @param name unique function name
         * @param fnMap Map inserted values
         * @param fnSort Sorting values
         * @param fnCallback run when creation finished
         * @param fnUpdate 
         * @param changes? set changelog message
         */
        create(name: string, fnMap: (doc: any) => any, fnSort: (a: any, b: any) => number, fnCallback?: () => void, fnUpdate?: () => void, changes?: string);

        /**
         * remove view
         * @param name unique function name
         * @param fnCallback run when creation finished
         * @param changes? set changelog message
         */
        drop(name: string, fnCallback?: () => void, changes?: string);

    }

    interface NoSQLBinaryHeader {

        /**
         * file name
         */
        name: string;

        /**
         * file size
         */
        size: number;

        /**
         * content type
         */
        type: string;

        /**
         * image width
         */
        width: number;

        /**
         * image height
         */
        height: number;
    }

    interface NoSQLStore {

        /**
         * Create a new stored function
         * @param name unique function name
         * @param fn Function to save
         * @param fnCallback run when creation finished
         * @param changes? set changelog message
         */
        create(name: string,
            fn: (nosql?: NoSQLDatabase, next?: Function, params?: any[]) => void,
            fnCallback?: () => void,
            changes?: string);

        /**
         * Remove a stored function
         * @param name unique function name
         * @param fnCallback run when function removed
         * @param changes? set changelog message
         */
        remove(name: string, fnCallback?: () => void, changes?: string);

        /**
         * Remove all stored functions
         * @param fnCallback run when all functions cleared
         */
        clear(fnCallback?: () => void);

        /**
         * Execute a stored function
         * @param name Unique function name
         * @param params? Parameters for the called function
         * @param fnCallback? run when all functions cleared
         * @param changes? set changelog message
         */
        execute(name: string, params?: any[], fnCallback?: () => void, changes?: string);

        /**
         * Execute a stored function
         * @param name Unique function name
         * @param fnCallback? run when all functions cleared
         * @param changes? set changelog message
         */
        execute(name: string, fnCallback?: () => void, changes?: string);

    }

    // BINARY FILES
    // nosql.binary.insert(name, contentType, buffer/base64, [callback], [chnages]); - return file ID
    // nosql.binary.update(id, name, contentType, buffer/base64, [callback], [changes]); - return file ID
    // nosql.binary.read(id, fnCallback);
    // nosql.binary.remove(id, [fnCallback], [changes]);
    // ============================================================================
    interface NoSQLBinary {

        /**
         * insert a binary file
         * @param name unique file name
         * @param contentType Filetype
         * @param buffer databuffer
         * @param fnCallback? run after function finsihed
         * @param changes?
         * @return file ID
         */
        insert(name: string,
            contentType: string,
            buffer: any,
            fnCallback?: (err?: any, data?: any) => void,
            changes?: string): number;

        /**
         * updated binary file
         * @param file ID
         * @param name unique file name
         * @param contentType Filetype
         * @param buffer databuffer
         * @param fnCallback? run after function finsihed
         * @param changes?
         * @return file ID
         */
        update(id: number,
            name: string,
            contentType: string,
            buffer: any, fnCallback?: (err?: any, data?: any, header?: NoSQLBinaryHeader) => void,
            changes?: string): number;

        /**
         * read binary file
         * @param name unique file name
         * @param callback? callback after function called
         */
        read(id: number, fnCallback: (err?: any, stream?: NodeJS.ReadWriteStream, header?: NoSQLBinaryHeader) => void);

        /**
         * read binary file
         * @param id file ID
         * @param callback? callback after function called
         * @param changes?
         */
        remove(id: number, fnCallback: (isRemoved?: boolean) => void, changes?: string);

    }

    interface NoSQLChangelog {

        /**
         * insert a change
         * @param change message
         */
        insert(change: string);

        /**
         * insert multiple changea
         * @param changes messages as array
         */
        insert(changes: string[]);

        /**
         * Clear the changelog
         * @param fnCallback? run after function finished
         */
        clear(fnCallback?: () => void);

        /**
         * read the changelog
         * @param fnCallback? run to read the changelog
         */
        read(fnCallback: (lines: string[]) => void);
    }

    interface NoSQLDatabase extends NoSQLReadDoc {

        /** 
         * Database date created
         */
        created: Date;

        /**
         * Check if database is loaded
         */
        isReady: boolean;

        /**
         * access nosql database views
         */
        views: NoSQLView;

        /**
         * access nosql changelog
         */
        changelog: NoSQLChangelog;

        /**
         * access nosql function store
         */
        store: NoSQLStore;

        /**
         * get/ set Database description
         * @param description set DB description
         * @return get DB description
         */
        description(description?: string): string;

        /**
         * get/ set custom Database object
         * @param customobject new custom object
         * @return get custom database object
         */
        custom(customobject?: any): any;

        /**
         * Pause database operations
         */
        pause();

        /**
         * Resume database operations
         */
        resume();

        /**
         * Drop the database
         */
        drop(fnCallback: Function);

        /**
         * Clear / Truncate database 
         */
        clear(fnCallback: Function);

        // INSERT DOCUMENT
        // nosql.insert(doc, [fnCallback], [changes]);
        // ============================================================================

        /**
         * Insert an object into the database
         */
        insert<T>(doc: T, fnCallback?: (count: number) => void, changes?: string);

        /**
         * Insert an object into the database
         */
        insert(doc: any, fnCallback?: (count: number) => void, changes?: string);

        // BULK INSERT DOCUMENTS
        // nosql.insert(array, fnCallback);
        // ============================================================================

        /**
         * insert array of objects
         */
        insert(array: Array<any>, fnCallback: (count: number) => void);

        /**
         * insert array of objects
         */
        insert<T>(array: Array<T>, fnCallback: (count: number) => void);

        // MULTIPLE UPDATE DOCUMENTS
        // nosql.prepare(fnUpdate, [fnCallback], [changes]);
        // nosql.update();
        // ============================================================================

        /**
         * 
         */
        prepare(fnUpdate: Function, fnCallback?: Function, changes?: any);

        /**
         * 
         */
        update();

        // READ DOCUMENTS
        // nosql.all(fnMap, fnCallback, [itemSkip], [itemTake]);
        // nosql.one(fnMap, fnCallback);
        // nosql.top(max, fnMap, fnCallback);
        // nosql.each(fnCallback);
        // ----------------------------------------------------------------------------
        // IMPORTANT: SLOWLY AND RAM KILLER, USE VIEWS
        // nosql.sort(fnMap, fnSort, fnCallback, [itemSkip], [itemTake]);
        // ============================================================================

        /**
         * 
         */
        sort(fnMap: any, fnSort: any, fnCallback: Function, itemSkip?: any, itemTake?: any);

        // EVENTS
        // ----------------------------------------------------------------------------
        // nosql.on('load', function() {});
        // nosql.on('error', function (err, source) { });
        // nosql.on('pause/resume', function (pause) { });
        // nosql.on('insert', function (begin, count) { });
        // nosql.on('update/remove', function (countUpdate, countRemove) { });
        // nosql.on('all', function (begin, count) { });
        // nosql.on('one', function (begin, count) { });
        // nosql.on('top', function (begin, count) { });
        // nosql.on('each', function (begin, count) { });
        // nosql.on('view', function (begin, name, count) { });
        // nosql.on('view/create', function (begin, name, count) { });
        // nosql.on('view/drop', function (begin, name) { });
        // nosql.on('view/refresh', function (begin, name, count) { });
        // nosql.on('clear', function (begin, success) { });
        // nosql.on('drop', function (begin, success) { });
        // nosql.on('complete', function (old_status) { });
        // nosql.on('change', function (description) { });
        // nosql.on('stored', function (name) { });
        // nosql.on('stored/load', function () { });
        // nosql.on('stored/clear', function () { });
        // nosql.on('stored/save', function (name) { });
        // ============================================================================

        /**
         * set event function
         * @param event name
         * @param fnCallback Callback function
         */
        on(event: string, fnCallback: Function);
    }
}


declare module "nosql" {
    var NoSQL: TotalJS.NoSQLStatic;

    export = NoSQL;
}