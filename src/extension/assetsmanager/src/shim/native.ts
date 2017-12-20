namespace RES {


    interface R {
        v: string,
        s: number
    }

    var versionInfo: { [url: string]: R };

    /**
     * @internal
     */
    export function native_init() {
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            versionInfo = getLocalData("all.manifest");
        }
    }

    /**
     * @internal
     */
    export function getRealURL(url: string) {

        if (versionInfo && versionInfo[url]) {
            return "resource/" + versionInfo[url].v.substring(0, 2) + "/" + versionInfo[url].v + "_" + versionInfo[url].s + "." + url.substring(url.lastIndexOf(".") + 1);
        }
        else {
            return url;
        }
    }

    function getLocalData(filePath): any {
        if (egret_native.readUpdateFileSync && egret_native.readResourceFileSync) {
            //先取更新目录
            var content: string = egret_native.readUpdateFileSync(filePath);
            if (content != null) {
                return JSON.parse(content);
            }

            //再取资源目录
            content = egret_native.readResourceFileSync(filePath);
            if (content != null) {
                return JSON.parse(content);
            }
        }
        return null;
    }
}

