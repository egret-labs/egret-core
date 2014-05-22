/**
 * Created with JetBrains WebStorm.
 * User: 林超捷
 * Date: 14-1-13
 * Time: 下午1:58
 * To change this template use File | Settings | File Templates.
 */

declare module ns_egret{
    export class Utils {
        static unzip();
        static unzipBase64AsArray(input, bytes);
        static uint8ArrayToUint32Array(uint8Arr);
    }
}

declare module ns_egret.Codec{
    export class Base64 {
        static decodeAsArray(input, bytes);
    }
}

declare class Zlib{

    static Inflate(obj):void;
}
