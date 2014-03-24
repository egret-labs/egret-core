ns_egret.Codec = {name:'Jacob__Codec'};
ns_egret.Utils = {};
/**
 * Unpack a gzipped byte array
 * @param {Array} input Byte array
 * @returns {String} Unpacked byte string
 */
ns_egret.Utils.unzip = function () {
    return ns_egret.Codec.GZip.gunzip.apply(ns_egret.Codec.GZip, arguments);
};

/**
 * Unpack a gzipped byte string encoded as base64
 * @param {String} input Byte string encoded as base64
 * @returns {String} Unpacked byte string
 */
ns_egret.Utils.unzipBase64 = function () {
    var tmpInput = ns_egret.Codec.Base64.decode.apply(ns_egret.Codec.Base64, arguments);
    return   ns_egret.Codec.GZip.gunzip.apply(ns_egret.Codec.GZip, [tmpInput]);
};

/**
 * Unpack a gzipped byte string encoded as base64
 * @param {String} input Byte string encoded as base64
 * @param {Number} bytes Bytes per array item
 * @returns {Array} Unpacked byte array
 */
ns_egret.Utils.unzipBase64AsArray = function (input, bytes) {
    bytes = bytes || 1;

    var dec = this.unzipBase64(input),
        ar = [], i, j, len;
    for (i = 0, len = dec.length / bytes; i < len; i++) {
        ar[i] = 0;
        for (j = bytes - 1; j >= 0; --j) {
            ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
        }
    }
    return ar;
};

/**
 * Unpack a gzipped byte array
 * @param {Array} input Byte array
 * @param {Number} bytes Bytes per array item
 * @returns {Array} Unpacked byte array
 */
ns_egret.Utils.unzipAsArray = function (input, bytes) {
    bytes = bytes || 1;

    var dec = this.unzip(input),
        ar = [], i, j, len;
    for (i = 0, len = dec.length / bytes; i < len; i++) {
        ar[i] = 0;
        for (j = bytes - 1; j >= 0; --j) {
            ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
        }
    }
    return ar;
};

/**
 * string to array
 * @param {String} input
 * @returns {Array} array
 */
ns_egret.Utils.StringToArray = function (input) {
    var tmp = input.split(","), ar = [], i;
    for (i = 0; i < tmp.length; i++) {
        ar.push(parseInt(tmp[i]));
    }
    return ar;
};
