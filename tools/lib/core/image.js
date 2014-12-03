/**
 * Created by huanghaiying on 14/11/12.
 */
function readUInt32(buffer, offset, bigEndian) {
    if (buffer.readUInt32) {
        return buffer.readUInt32(offset, bigEndian);
    }

    var value;
    if (bigEndian) {
        if (buffer.readUInt32BE) {
            return buffer.readUInt32BE(offset);
        }
        value = (buffer[offset] << 24) + (buffer[offset+1] << 16) + (buffer[offset+2] << 8) + buffer[offset+3];
    }
    else {
        if (buffer.readUInt32LE) {
            return buffer.readUInt32LE(offset);
        }
        value = buffer[offset] + (buffer[offset+1] << 8) + (buffer[offset+2] << 16) + (buffer[offset+3] << 24);
    }
    return value;
}

function readUInt16(buffer, offset, bigEndian) {
    if (buffer.readUInt16) {
        return buffer.readUInt16(offset, bigEndian);
    }

    var value;
    if (bigEndian) {
        if (buffer.readUInt16BE) {
            return buffer.readUInt16BE(offset);
        }
        value = (buffer[offset] << 8) + buffer[offset+1];
    }
    else {
        if (buffer.readUInt16LE) {
            return buffer.readUInt16LE(offset);
        }
        value = buffer[offset] + (buffer[offset+1] << 8);
    }
    return value;
}

function readBit(buffer, offset, bitOffset) {
    if (bitOffset > 7) {
        offset += Math.floor(bitOffset / 8);
        bitOffset = bitOffset % 8;
    }

    var b = buffer[offset];
    if (bitOffset < 7) {
        b >>>= (7 - bitOffset);
    }

    var val = b & 0x01;
    return val;
}

function readBits(buffer, offset, bitOffset, bitLen, signed) {
    var val = 0;

    var neg = false;
    if (signed) {
        if (readBit(buffer, offset, bitOffset) > 0) {
            neg = true;
        }
        bitLen--;
        bitOffset++;
    }

    var bytes = [];
    for (var i = 0; i < bitLen; i++) {
        var b = readBit(buffer, offset, bitOffset + i);
        if (i>0 && (bitLen - i) % 8 == 0) {
            bytes.push(val);
            val = 0;
        }
        val <<= 1;
        val |= b;
    }
    bytes.push(val);

    val = new Buffer(bytes);
    val.negative = neg?true:false;
    return val;
}

function imageInfoPng(buffer) {
    var imageHeader = [0x49, 0x48, 0x44, 0x52],
        pos = 12;

    if (!checkSig(buffer, pos, imageHeader)) {
        return false;
    }

    pos += 4;
    return {
        type: 'image',
        format: 'PNG',
        mimeType: 'image/png',
        width: readUInt32(buffer, pos, true),
        height: readUInt32(buffer, pos+4, true),
    };
}

function imageInfoJpg(buffer) {
    var pos = 2,
        len = buffer.length,
        sizeSig = [0xff, [0xc0, 0xc2]];

    while (pos < len) {
        if (checkSig(buffer, pos, sizeSig)) {
            pos += 5;
            return {
                type: 'image',
                format: 'JPG',
                mimeType: 'image/jpeg',
                width: readUInt16(buffer, pos+2, true),
                height: readUInt16(buffer, pos, true),
            };
        }

        pos += 2;
        var size = readUInt16(buffer, pos, true);
        pos += size;
    }
}

function imageInfoGif(buffer) {
    var pos = 6;

    return {
        type: 'image',
        format: 'GIF',
        mimeType: 'image/gif',
        width: readUInt16(buffer, pos, false),
        height: readUInt16(buffer, pos+2, false),
    };
}

function imageInfoSwf(buffer) {
    var pos = 8,
        bitPos = 0,
        val;

    if (buffer[0] === 0x43) {
        try {
            // If you have zlib available ( npm install zlib ) then we can read compressed flash files
            buffer = require('zlib').inflate(buffer.slice(8, 100));
            pos = 0;
        }
        catch (ex) {
            // Can't get width/height of compressed flash files... yet (need zlib)
            return {
                type: 'flash',
                format: 'SWF',
                mimeType: 'application/x-shockwave-flash',
                width: null,
                height: null,
            }
        }
    }

    var numBits = readBits(buffer, pos, bitPos, 5)[0];
    bitPos += 5;

    val = readBits(buffer, pos, bitPos, numBits, true);
    var xMin = (numBits > 9 ? readUInt16(val, 0, true) : val[0]) * (val.negative ? -1 : 1);
    bitPos += numBits;

    val = readBits(buffer, pos, bitPos, numBits, true);
    var xMax = (numBits > 9 ? readUInt16(val, 0, true) : val[0]) * (val.negative ? -1 : 1);
    bitPos += numBits;

    val = readBits(buffer, pos, bitPos, numBits, true);
    var yMin = (numBits > 9 ? readUInt16(val, 0, true) : val[0]) * (val.negative ? -1 : 1);
    bitPos += numBits;

    val = readBits(buffer, pos, bitPos, numBits, true);
    var yMax = (numBits > 9 ? readUInt16(val, 0, true) : val[0]) * (val.negative ? -1 : 1);

    return {
        type: 'flash',
        format: 'SWF',
        mimeType: 'application/x-shockwave-flash',
        width: Math.ceil((xMax - xMin) / 20),
        height: Math.ceil((yMax - yMin) / 20),
    };
}

function checkSig(buffer, offset, sig) {
    var len = sig.length;
    for (var i = 0; i < len; i++) {
        var b = buffer[i+offset],
            s = sig[i],
            m = false;

        if ('number' == typeof s) {
            m = s === b;
        }
        else {
            for (var k in s) {
                var o = s[k];
                if (o === b) {
                    m = true;
                }
            }
        }

        if (!m) {
            return false;
        }
    }

    return true;
}

function getInfo(buffer, path) {
    var pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    var jpgSig = [0xff, 0xd8, 0xff];
    var gifSig = [0x47, 0x49, 0x46, 0x38, [0x37, 0x39], 0x61];
    var swfSig = [[0x46, 0x43], 0x57, 0x53];

    if (checkSig(buffer, 0, pngSig)) return imageInfoPng(buffer);
    if (checkSig(buffer, 0, jpgSig)) return imageInfoJpg(buffer);
    if (checkSig(buffer, 0, gifSig)) return imageInfoGif(buffer);
    if (checkSig(buffer, 0, swfSig)) return imageInfoSwf(buffer);

    return false;
}

exports.getInfo = getInfo;