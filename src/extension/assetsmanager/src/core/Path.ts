namespace RES {
    /**
     * Print the memory occupied by the picture.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 对文件路径的一些操作，针对的是 C:/A/B/C/D/example.ts这种格式
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export namespace path {
        /**
         * Format the file path,"C:/A/B//C//D//example.ts"=>"C:/A/B/C/D/example.ts"
         * @param filename Incoming file path
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 格式化文件路径，"C:/A/B//C//D//example.ts"=>"C:/A/B/C/D/example.ts"
         * @param filename 传入的文件路径
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        export function normalize(filename: string): string {
            const arr = filename.split("/");
            return arr.filter((value, index) => !!value || index == arr.length - 1).join("/");
        }
        /**
         * Get the file name according to the file path, "C:/A/B/example.ts"=>"example.ts"
         * @param filename Incoming file path 
         * @return File name
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 根据文件路径得到文件名字，"C:/A/B/example.ts"=>"example.ts"
         * @param filename 传入的文件路径 
         * @return 文件的名字
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        export function basename(filename: string): string {
            return filename.substr(filename.lastIndexOf("/") + 1);
        }
        /**
         * The path to the folder where the file is located,"C:/A/B/example.ts"=>"C:/A/B"
         * @param filename Incoming file path 
         * @return The address of the folder where the file is located
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文件所在文件夹路径，"C:/A/B/example.ts"=>"C:/A/B"
         * @param filename 传入的文件路径
         * @return 文件所在文件夹的地址
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        export function dirname(path: string): string {
            return path.substr(0, path.lastIndexOf("/"));
        }
    }
}