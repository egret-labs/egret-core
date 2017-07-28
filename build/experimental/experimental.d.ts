declare namespace egret.experimental {
    /**
     * @private
     */
    let debug: boolean;
    const ExifTags: {
        0x9000: string;
        0xA000: string;
        0xA001: string;
        0xA002: string;
        0xA003: string;
        0x9101: string;
        0x9102: string;
        0x927C: string;
        0x9286: string;
        0xA004: string;
        0x9003: string;
        0x9004: string;
        0x9290: string;
        0x9291: string;
        0x9292: string;
        0x829A: string;
        0x829D: string;
        0x8822: string;
        0x8824: string;
        0x8827: string;
        0x8828: string;
        0x9201: string;
        0x9202: string;
        0x9203: string;
        0x9204: string;
        0x9205: string;
        0x9206: string;
        0x9207: string;
        0x9208: string;
        0x9209: string;
        0x9214: string;
        0x920A: string;
        0xA20B: string;
        0xA20C: string;
        0xA20E: string;
        0xA20F: string;
        0xA210: string;
        0xA214: string;
        0xA215: string;
        0xA217: string;
        0xA300: string;
        0xA301: string;
        0xA302: string;
        0xA401: string;
        0xA402: string;
        0xA403: string;
        0xA404: string;
        0xA405: string;
        0xA406: string;
        0xA407: string;
        0xA408: string;
        0xA409: string;
        0xA40A: string;
        0xA40B: string;
        0xA40C: string;
        0xA005: string;
        0xA420: string;
    };
    const TiffTags: {
        0x0100: string;
        0x0101: string;
        0x8769: string;
        0x8825: string;
        0xA005: string;
        0x0102: string;
        0x0103: string;
        0x0106: string;
        0x0112: string;
        0x0115: string;
        0x011C: string;
        0x0212: string;
        0x0213: string;
        0x011A: string;
        0x011B: string;
        0x0128: string;
        0x0111: string;
        0x0116: string;
        0x0117: string;
        0x0201: string;
        0x0202: string;
        0x012D: string;
        0x013E: string;
        0x013F: string;
        0x0211: string;
        0x0214: string;
        0x0132: string;
        0x010E: string;
        0x010F: string;
        0x0110: string;
        0x0131: string;
        0x013B: string;
        0x8298: string;
    };
    const GPSTags: {
        0x0000: string;
        0x0001: string;
        0x0002: string;
        0x0003: string;
        0x0004: string;
        0x0005: string;
        0x0006: string;
        0x0007: string;
        0x0008: string;
        0x0009: string;
        0x000A: string;
        0x000B: string;
        0x000C: string;
        0x000D: string;
        0x000E: string;
        0x000F: string;
        0x0010: string;
        0x0011: string;
        0x0012: string;
        0x0013: string;
        0x0014: string;
        0x0015: string;
        0x0016: string;
        0x0017: string;
        0x0018: string;
        0x0019: string;
        0x001A: string;
        0x001B: string;
        0x001C: string;
        0x001D: string;
        0x001E: string;
    };
    const StringValues: {
        ExposureProgram: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            6: string;
            7: string;
            8: string;
        };
        MeteringMode: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            6: string;
            255: string;
        };
        LightSource: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            9: string;
            10: string;
            11: string;
            12: string;
            13: string;
            14: string;
            15: string;
            17: string;
            18: string;
            19: string;
            20: string;
            21: string;
            22: string;
            23: string;
            24: string;
            255: string;
        };
        Flash: {
            0x0000: string;
            0x0001: string;
            0x0005: string;
            0x0007: string;
            0x0009: string;
            0x000D: string;
            0x000F: string;
            0x0010: string;
            0x0018: string;
            0x0019: string;
            0x001D: string;
            0x001F: string;
            0x0020: string;
            0x0041: string;
            0x0045: string;
            0x0047: string;
            0x0049: string;
            0x004D: string;
            0x004F: string;
            0x0059: string;
            0x005D: string;
            0x005F: string;
        };
        SensingMethod: {
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            7: string;
            8: string;
        };
        SceneCaptureType: {
            0: string;
            1: string;
            2: string;
            3: string;
        };
        SceneType: {
            1: string;
        };
        CustomRendered: {
            0: string;
            1: string;
        };
        WhiteBalance: {
            0: string;
            1: string;
        };
        GainControl: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
        };
        Contrast: {
            0: string;
            1: string;
            2: string;
        };
        Saturation: {
            0: string;
            1: string;
            2: string;
        };
        Sharpness: {
            0: string;
            1: string;
            2: string;
        };
        SubjectDistanceRange: {
            0: string;
            1: string;
            2: string;
            3: string;
        };
        FileSource: {
            3: string;
        };
        Components: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
            5: string;
            6: string;
        };
    };
    class EXIF {
        static getData(img: any, callback: any): boolean;
        static getTag(img: any, tag: any): any;
        static getIptcTag(img: any, tag: any): any;
        static getAllTags(img: any): {};
        static getAllIptcTags(img: any): {};
        static pretty(img: any): string;
        static readFromBinaryFile(file: any): any;
    }
}
declare namespace egret.experimental {
    /**
    * @language en_US
    * The pickPhoto method provides ability for picking a photo.
    * @version Egret 4.0
    * @platform Web
    */
    /**
     * @language zh_CN
     * pickPhoto API提供用于选取照片的方法。
     * @version Egret 4.0
     * @platform Web
     */
    function pickPhoto(): Promise<string>;
}
