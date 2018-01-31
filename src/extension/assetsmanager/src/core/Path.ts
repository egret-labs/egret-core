namespace RES {
    export namespace path {
        export const normalize = function (filename: string) {
            const arr = filename.split("/");
            return arr.filter((value, index) => !!value || index == arr.length - 1).join("/");
        }

        export const basename = function (filename: string) {
            return filename.substr(filename.lastIndexOf("/") + 1);
        }

        export const dirname = function (path: string) {
            return path.substr(0, path.lastIndexOf("/"));
        }
    }
}