/**
 * This a MemoryStream like structure for node.js based on an internal Buffer.
 * It's currently written to be write heavy, read once.
 *
 * Authors:
 *      Jan Jongboom <janjongboom@gmail.com>
 */
function RollingBuffer (arg0, arg1, arg2) {
    // current offset
    var offset = 0x00;

    // internal buffer
    this.buf = new Buffer(arg0, arg1, arg2); // make this nice :)
    this.length = this.buf.length;

    // write a string
    this.write = function (str, encoding) {
        var written = this.buf.write(str, offset, encoding);
        offset += written;
    };

    // write another buffer
    this.appendBuffer = function (newBuffer) {
        if (newBuffer instanceof Buffer) {
            newBuffer.copy(this.buf, offset);
            offset += newBuffer.length;
        }
        else if (newBuffer instanceof RollingBuffer) {
            newBuffer.buf.copy(this.buf, offset);
            offset += newBuffer.buf.length;
        }
    };

    // write buffer to string
    this.toString = function (encoding) {
        return this.buf.toString(encoding);
    };

    // write 1 byte
    this.writeInt8 = function (data) {
        this.buf[offset] = data;
        offset += 1;
    };

    // write 2 bytes
    this.writeInt16 = function (data) {
        this.buf[offset] = data & 0xff;
        this.buf[offset + 1] = (data & 0xff00) >> 8;

        offset += 2;
    };

    // write 4 bytes
    this.writeInt32 = function (data) {
        this.buf[offset] = data & 0xff;
        this.buf[offset + 1] = (data & 0xff00) >> 0x08;
        this.buf[offset + 2] = (data & 0xff0000) >> 0x10;
        this.buf[offset + 3] = (data & 0xff000000) >> 0x18;

        offset += 4;
    };

    // return inner buffer
    this.getInternalBuffer = function () {
        return this.buf;
    };
}

module.exports = RollingBuffer;