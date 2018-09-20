module RES {
    /**
     * assetsManager underlying storage resource information
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * assetsManager底层存储资源信息
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export interface File {

        url: string;

        type: string;

        name: string;

        root: string;

    }
    /**
    * @internal
    */
    export interface Dictionary {

        [file: string]: File | Dictionary

    }
    /**
    * @private
    */
    export interface FileSystem {

        addFile(data: { name: string, type: string, url: string, root?: string, extra?: 1 | undefined });

        getFile(filename: string): File | null;

        profile(): void;

        removeFile(filename: string);
    }
    /**
    * @internal
    */
    export class NewFileSystem {

        constructor(private data: Dictionary) {

        }

        profile() {
            console.log(this.data);
        }

        addFile(filename: string, type?: string) {
            if (!type) type = "";
            filename = path.normalize(filename);
            let basefilename = path.basename(filename);
            let folder = path.dirname(filename);
            if (!this.exists(folder)) {
                this.mkdir(folder);
            }
            let d = this.resolve(folder);
            d[basefilename] = { url: filename, type };
        }

        getFile(filename: string): File | null {
            let result = this.resolve(filename) as (File | null)
            if (result) {
                result.name = filename;
            }
            return result;
        }

        private resolve(dirpath: string) {
            if (dirpath == "") {
                return this.data;
            }
            dirpath = path.normalize(dirpath);
            let list = dirpath.split("/");
            let current: File | Dictionary = this.data;
            for (let f of list) {
                if (current) {
                    current = current[f];
                }
                else {
                    return current;
                }
            }
            return current;
        }

        private mkdir(dirpath: string) {
            dirpath = path.normalize(dirpath);
            let list = dirpath.split("/");
            let current = this.data;
            for (let f of list) {
                if (!current[f]) {
                    current[f] = {};
                }
                current = current[f] as Dictionary;
            }
        }

        private exists(dirpath: string) {
            if (dirpath == "") return true;
            dirpath = path.normalize(dirpath);
            let list = dirpath.split("/");
            let current = this.data;
            for (let f of list) {
                if (!current[f]) {
                    return false;
                }
                current = current[f] as Dictionary;
            }
            return true;
        }
    }
}


