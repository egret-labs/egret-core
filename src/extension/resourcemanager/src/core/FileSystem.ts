module RES {

    export interface File {

        url: string;

        type: string;

        name: string;

    }

    export interface Dictionary {

        [file: string]: File | Dictionary

    }

    export interface FileSystem {

        addFile(filename: string, type?: string);

        getFile(filename: string): File | null;

        profile(): void;

    }

    export class NewFileSystem {

        constructor(private data: Dictionary) {

        }

        profile() {
            console.log(this.data);
        }

        addFile(filename: string, type?: string) {
            if (!type) type = "";
            filename = this.normalize(filename);
            let basefilename = this.basename(filename);
            let folder = this.dirname(filename);
            if (!this.exists(folder)) {
                this.mkdir(folder);
            }
            let d = this.reslove(folder);
            d[basefilename] = { url: filename, type };
        }

        getFile(filename: string): File | null {
            let result = this.reslove(filename) as (File | null)
            if (result) {
                result.name = filename;
            }
            return result;
        }

        private basename(filename: string) {
            return filename.substr(filename.lastIndexOf("/") + 1);
        }

        private normalize(filename: string) {
            return filename.split("/").filter(d => !!d).join("/");
        }

        private dirname(path: string) {
            return path.substr(0, path.lastIndexOf("/"));
        }

        private reslove(dirpath: string) {
            if (dirpath == "") {
                return this.data;
            }
            dirpath = this.normalize(dirpath);
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
            dirpath = this.normalize(dirpath);
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
            dirpath = this.normalize(dirpath);
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

    export var fileSystem: FileSystem;

}


