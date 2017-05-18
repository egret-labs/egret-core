//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret {

    /**
     * The Endian class contains values that denote the byte order used to represent multibyte numbers.
     * The byte order is either bigEndian (most significant byte first) or littleEndian (least significant byte first).
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export class Endian {
        /**
         * Indicates the least significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte). The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static LITTLE_ENDIAN: string = "littleEndian";

        /**
         * Indicates the most significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte).  The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static BIG_ENDIAN: string = "bigEndian";

    }

    export const enum EndianConst {
        LITTLE_ENDIAN = 0,
        BIG_ENDIAN = 1
    }

    const enum ByteArraySize {

        SIZE_OF_BOOLEAN = 1,

        SIZE_OF_INT8 = 1,

        SIZE_OF_INT16 = 2,

        SIZE_OF_INT32 = 4,

        SIZE_OF_UINT8 = 1,

        SIZE_OF_UINT16 = 2,

        SIZE_OF_UINT32 = 4,

        SIZE_OF_FLOAT32 = 4,

        SIZE_OF_FLOAT64 = 8
    }
    /**
     * The ByteArray class provides methods and attributes for optimized reading and writing as well as dealing with binary data.
     * Note: The ByteArray class is applied to the advanced developers who need to access data at the byte layer.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     * @language en_US
     */
    /**
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     * @language zh_CN
     */
    export class ByteArray {

        /**
         * @private
         */
        protected bufferExtSize = 256;//Buffer expansion size

        protected data: DataView;

        protected _bytes: Uint8Array;
        /**
         * @private
         */
        protected _position: number;

        /**
         * 
         * 已经使用的字节偏移量
         * @protected
         * @type {number}
         * @memberOf ByteArray
         */
        protected write_position: number;

        /**
         * Changes or reads the byte order; egret.EndianConst.BIG_ENDIAN or egret.EndianConst.LITTLE_EndianConst.
         * @default egret.EndianConst.BIG_ENDIAN
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 更改或读取数据的字节顺序；egret.EndianConst.BIG_ENDIAN 或 egret.EndianConst.LITTLE_ENDIAN。
         * @default egret.EndianConst.BIG_ENDIAN
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get endian() {
            return this.$endian == EndianConst.LITTLE_ENDIAN ? Endian.LITTLE_ENDIAN : Endian.BIG_ENDIAN;
        }

        public set endian(value: string) {
            this.$endian = value == Endian.LITTLE_ENDIAN ? EndianConst.LITTLE_ENDIAN : EndianConst.BIG_ENDIAN;
        }

        protected $endian: EndianConst;

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(buffer?: ArrayBuffer | Uint8Array, bufferExtSize = 256) {
            if (bufferExtSize < 0) {
                bufferExtSize = 256;
            }
            this.bufferExtSize = bufferExtSize;
            let bytes: Uint8Array, wpos = 0;
            if (buffer) {//有数据，则可写字节数从字节尾开始
                let uint8: Uint8Array;
                if (buffer instanceof Uint8Array) {
                    uint8 = buffer;
                    wpos = buffer.length;
                } else {
                    wpos = buffer.byteLength;
                    uint8 = new Uint8Array(buffer);
                }
                let multi = (wpos / bufferExtSize | 0) + 1;
                bytes = new Uint8Array(multi * bufferExtSize);
                bytes.set(uint8);
            } else {
                bytes = new Uint8Array(bufferExtSize);
            }
            this.write_position = wpos;
            this._position = 0;
            this._bytes = bytes;
            this.data = new DataView(bytes.buffer);
            this.endian = Endian.BIG_ENDIAN;
        }


        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setArrayBuffer(buffer: ArrayBuffer): void {

        }

        /**
         * 可读的剩余字节数
         * 
         * @returns 
         * 
         * @memberOf ByteArray
         */
        public get readAvailable() {
            return this.write_position - this._position;
        }

        public get buffer(): ArrayBuffer {
            return this.data.buffer.slice(0, this.write_position);
        }

        public get rawBuffer(): ArrayBuffer {
            return this.data.buffer;
        }

        /**
         * @private
         */
        public set buffer(value: ArrayBuffer) {
            let wpos = value.byteLength;
            let uint8 = new Uint8Array(value);
            let bufferExtSize = this.bufferExtSize;
            let multi = (wpos / bufferExtSize | 0) + 1;
            let bytes = new Uint8Array(multi * bufferExtSize);
            bytes.set(uint8);
            this.write_position = wpos;
            this._bytes = bytes;
            this.data = new DataView(bytes.buffer);
        }

        public get bytes(): Uint8Array {
            return this._bytes;
        }

        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get dataView(): DataView {
            return this.data;
        }

        /**
         * @private
         */
        public set dataView(value: DataView) {
            this.buffer = value.buffer;
        }

        /**
         * @private
         */
        public get bufferOffset(): number {
            return this.data.byteOffset;
        }

        /**
         * The current position of the file pointer (in bytes) to move or return to the ByteArray object. The next time you start reading reading method call in this position, or will start writing in this position next time call a write method.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get position(): number {
            return this._position;
        }

        public set position(value: number) {
            this._position = value;
            if (value > this.write_position) {
                this.write_position = value;
            }
        }

        /**
         * The length of the ByteArray object (in bytes).
                  * If the length is set to be larger than the current length, the right-side zero padding byte array.
                  * If the length is set smaller than the current length, the byte array is truncated.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * ByteArray 对象的长度（以字节为单位）。
         * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
         * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get length(): number {
            return this.write_position;
        }

        public set length(value: number) {
            this.write_position = value;
            if (this.data.byteLength > value) {
                this._position = value;
            }
            this._validateBuffer(value);
        }

        protected _validateBuffer(value: number) {
            if (this.data.byteLength < value) {
                let be = this.bufferExtSize;
                let nLen = ((value / be >> 0) + 1) * be;
                let tmp: Uint8Array = new Uint8Array(nLen);
                tmp.set(this._bytes);
                this._bytes = tmp;
                this.data = new DataView(tmp.buffer);
            }
        }

        /**
         * The number of bytes that can be read from the current position of the byte array to the end of the array data.
         * When you access a ByteArray object, the bytesAvailable property in conjunction with the read methods each use to make sure you are reading valid data.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
         * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get bytesAvailable(): number {
            return this.data.byteLength - this._position;
        }

        /**
         * Clears the contents of the byte array and resets the length and position properties to 0.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public clear(): void {
            let buffer = this.data.buffer.slice(0, this.bufferExtSize);
            this.data = new DataView(buffer);
            this._bytes = new Uint8Array(buffer);
            this._position = 0;
            this.write_position = 0;
        }

        /**
         * Read a Boolean value from the byte stream. Read a simple byte. If the byte is non-zero, it returns true; otherwise, it returns false.
         * @return If the byte is non-zero, it returns true; otherwise, it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readBoolean(): boolean {
            if (this.validate(ByteArraySize.SIZE_OF_BOOLEAN)) return !!this._bytes[this.position++];
        }

        /**
         * Read signed bytes from the byte stream.
         * @return An integer ranging from -128 to 127
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readByte(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT8)) return this.data.getInt8(this.position++);
        }

        /**
         * Read data byte number specified by the length parameter from the byte stream. Starting from the position specified by offset, read bytes into the ByteArray object specified by the bytes parameter, and write bytes into the target ByteArray
         * @param bytes ByteArray object that data is read into
         * @param offset Offset (position) in bytes. Read data should be written from this position
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
            if (!bytes) {//由于bytes不返回，所以new新的无意义
                return
            }
            let pos = this._position;
            let available = this.write_position - pos;
            if (available < 0) {
                egret.$error(1025);
                return
            }
            if (length == 0) {
                length = available;
            }
            else if (length > available) {
                egret.$error(1025);
                return
            }
            bytes.validateBuffer(offset + length);
            bytes._bytes.set(this._bytes.subarray(pos, pos + length), offset);
        }

        /**
         * Read an IEEE 754 double-precision (64 bit) floating point number from the byte stream
         * @return Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readDouble(): number {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT64)) {
                let value = this.data.getFloat64(this._position, this.$endian == EndianConst.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_FLOAT64;
                return value;
            }
        }

        /**
         * Read an IEEE 754 single-precision (32 bit) floating point number from the byte stream
         * @return Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readFloat(): number {
            if (this.validate(ByteArraySize.SIZE_OF_FLOAT32)) {
                let value = this.data.getFloat32(this._position, this.$endian == EndianConst.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_FLOAT32;
                return value;
            }
        }

        /**
         * Read a 32-bit signed integer from the byte stream.
         * @return A 32-bit signed integer ranging from -2147483648 to 2147483647
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readInt(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT32)) {
                let value = this.data.getInt32(this._position, this.$endian == EndianConst.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_INT32;
                return value;
            }
        }

        /**
         * Read a 16-bit signed integer from the byte stream.
         * @return A 16-bit signed integer ranging from -32768 to 32767
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readShort(): number {
            if (this.validate(ByteArraySize.SIZE_OF_INT16)) {
                let value = this.data.getInt16(this._position, this.$endian == EndianConst.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_INT16;
                return value;
            }
        }

        /**
         * Read unsigned bytes from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 255
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUnsignedByte(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT8)) return this._bytes[this.position++];
        }

        /**
         * Read a 32-bit unsigned integer from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 4294967295
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUnsignedInt(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT32)) {
                let value = this.data.getUint32(this._position, this.$endian == EndianConst.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_UINT32;
                return value;
            }
        }

        /**
         * Read a 16-bit unsigned integer from the byte stream.
         * @return A 16-bit unsigned integer ranging from 0 to 65535
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUnsignedShort(): number {
            if (this.validate(ByteArraySize.SIZE_OF_UINT16)) {
                let value = this.data.getUint16(this._position, this.$endian == EndianConst.LITTLE_ENDIAN);
                this.position += ByteArraySize.SIZE_OF_UINT16;
                return value;
            }
        }

        /**
         * Read a UTF-8 character string from the byte stream Assume that the prefix of the character string is a short unsigned integer (use byte to express length)
         * @return UTF-8 character string
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUTF(): string {
            let length = this.readUnsignedShort();
            if (length > 0) {
                return this.readUTFBytes(length);
            } else {
                return "";
            }
        }

        /**
         * Read a UTF-8 byte sequence specified by the length parameter from the byte stream, and then return a character string
         * @param Specify a short unsigned integer of the UTF-8 byte length
         * @return A character string consists of UTF-8 bytes of the specified length
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public readUTFBytes(length: number): string {
            if (!this.validate(length)) return;
            let bytes = new Uint8Array(this.buffer, this.bufferOffset + this._position, length);
            this.position += length;
            return this.decodeUTF8(bytes);
        }

        /**
         * Write a Boolean value. A single byte is written according to the value parameter. If the value is true, write 1; if the value is false, write 0.
         * @param value A Boolean value determining which byte is written. If the value is true, write 1; if the value is false, write 0.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeBoolean(value: boolean): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_BOOLEAN);
            this._bytes[this.position++] = +value;
        }

        /**
         * Write a byte into the byte stream
         * The low 8 bits of the parameter are used. The high 24 bits are ignored.
         * @param value A 32-bit integer. The low 8 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeByte(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_INT8);
            this._bytes[this.position++] = value & 0xff;
        }

        /**
         * Write the byte sequence that includes length bytes in the specified byte array, bytes, (starting at the byte specified by offset, using a zero-based index), into the byte stream
         * If the length parameter is omitted, the default length value 0 is used and the entire buffer starting at offset is written. If the offset parameter is also omitted, the entire buffer is written
         * If the offset or length parameter is out of range, they are clamped to the beginning and end of the bytes array.
         * @param bytes ByteArray Object
         * @param offset A zero-based index specifying the position into the array to begin writing
         * @param length An unsigned integer specifying how far into the buffer to write
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes ByteArray 对象
         * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length 一个无符号整数，表示在缓冲区中的写入范围
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
            let writeLength: number;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            } else if (length == 0) {
                writeLength = bytes.length - offset;
            } else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer(writeLength);
                this._bytes.set(bytes._bytes.subarray(offset, offset + writeLength), this._position);
                this.position = this._position + writeLength;
            }
        }

        /**
         * Write an IEEE 754 double-precision (64 bit) floating point number into the byte stream
         * @param value Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeDouble(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_FLOAT64);
            this.data.setFloat64(this._position, value, this.$endian == EndianConst.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_FLOAT64;
        }

        /**
         * Write an IEEE 754 single-precision (32 bit) floating point number into the byte stream
         * @param value Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeFloat(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_FLOAT32);
            this.data.setFloat32(this._position, value, this.$endian == EndianConst.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_FLOAT32;
        }

        /**
         * Write a 32-bit signed integer into the byte stream
         * @param value An integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeInt(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_INT32);
            this.data.setInt32(this._position, value, this.$endian == EndianConst.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_INT32;
        }

        /**
         * Write a 16-bit integer into the byte stream. The low 16 bits of the parameter are used. The high 16 bits are ignored.
         * @param value A 32-bit integer. Its low 16 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeShort(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_INT16);
            this.data.setInt16(this._position, value, this.$endian == EndianConst.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_INT16;
        }

        /**
         * Write a 32-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeUnsignedInt(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_UINT32);
            this.data.setUint32(this._position, value, this.$endian == EndianConst.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_UINT32;
        }

        /**
         * Write a 16-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在字节流中写入一个无符号的 16 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         * @language zh_CN
         */
        public writeUnsignedShort(value: number): void {
            this.validateBuffer(ByteArraySize.SIZE_OF_UINT16);
            this.data.setUint16(this._position, value, this.$endian == EndianConst.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_UINT16;
        }

        /**
         * Write a UTF-8 string into the byte stream. The length of the UTF-8 string in bytes is written first, as a 16-bit integer, followed by the bytes representing the characters of the string
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeUTF(value: string): void {
            let utf8bytes: ArrayLike<number> = this.encodeUTF8(value);
            let length: number = utf8bytes.length;
            this.validateBuffer(ByteArraySize.SIZE_OF_UINT16 + length);
            this.data.setUint16(this._position, length, this.$endian == EndianConst.LITTLE_ENDIAN);
            this.position += ByteArraySize.SIZE_OF_UINT16;
            this._writeUint8Array(utf8bytes, false);
        }

        /**
         * Write a UTF-8 string into the byte stream. Similar to the writeUTF() method, but the writeUTFBytes() method does not prefix the string with a 16-bit length word
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public writeUTFBytes(value: string): void {
            this._writeUint8Array(this.encodeUTF8(value));
        }


        /**
         *
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        public toString(): string {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        }

        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        public _writeUint8Array(bytes: Uint8Array | ArrayLike<number>, validateBuffer: boolean = true): void {
            let pos = this._position;
            let npos = pos + bytes.length;
            if (validateBuffer) {
                this.validateBuffer(npos);
            }
            this.bytes.set(bytes, pos);
            this.position = npos;
        }

        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        public validate(len: number): boolean {
            let bl = this._bytes.length;
            if (bl > 0 && this._position + len <= bl) {
                return true;
            } else {
                egret.$error(1025);
            }
        }

        /**********************/
        /*  PRIVATE METHODS   */
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        protected validateBuffer(len: number): void {
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this._position;
            this._validateBuffer(len);
        }

        // /**
        //  * @private
        //  *
        //  * @param code_point
        //  */
        // private encoderError(code_point) {
        //     egret.$error(1026, code_point);
        // }

        // /**
        //  * @private
        //  *
        //  * @param fatal
        //  * @param opt_code_point
        //  * @returns
        //  */
        // private decoderError(fatal, opt_code_point?): number {
        //     if (fatal) {
        //         egret.$error(1027);
        //     }
        //     return opt_code_point || 0xFFFD;
        // }

        /**
         * 获取字符串使用Utf8编码的字节长度
         * 
         * 参考 https://github.com/dcodeIO/protobuf.js/tree/master/lib/utf8
         * @static
         * @param {string} string 
         * @returns 
         * 
         * @memberOf ByteArray
         */
        public static utf8ByteLength(string: string) {
            let len = 0,
                c = 0;
            for (let i = 0; i < string.length; ++i) {
                c = string.charCodeAt(i);
                if (c < 128)
                    len += 1;
                else if (c < 2048)
                    len += 2;
                else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
                    ++i;
                    len += 4;
                } else
                    len += 3;
            }
            return len;
        }

        /**
         * 接续utf8字符串
         * 
         * 参考 https://github.com/dcodeIO/protobuf.js/tree/master/lib/utf8
         * @param {string} string 
         * @returns 
         * @protected
         * @memberOf ByteArray
         */
        encodeUTF8(string: string) {
            let offset = 0,
                c1: number, // character 1
                c2: number; // character 2
            let buffer: number[] = [];//new Uint8Array(ByteArray.utf8ByteLength(string));
            for (var i = 0; i < string.length; ++i) {
                c1 = string.charCodeAt(i);
                if (c1 < 128) {
                    buffer[offset++] = c1;
                } else if (c1 < 2048) {
                    buffer[offset++] = c1 >> 6 | 192;
                    buffer[offset++] = c1 & 63 | 128;
                } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
                    c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
                    ++i;
                    buffer[offset++] = c1 >> 18 | 240;
                    buffer[offset++] = c1 >> 12 & 63 | 128;
                    buffer[offset++] = c1 >> 6 & 63 | 128;
                    buffer[offset++] = c1 & 63 | 128;
                } else {
                    buffer[offset++] = c1 >> 12 | 224;
                    buffer[offset++] = c1 >> 6 & 63 | 128;
                    buffer[offset++] = c1 & 63 | 128;
                }
            }
            return buffer;
        }

        /**
         * 从字节数组中读取utf8字符串
         * 
         * 参考 https://github.com/dcodeIO/protobuf.js/tree/master/lib/utf8
         * @param {(Uint8Array | ArrayLike<number>)} buffer 
         * @returns 
         * 
         * @memberOf ByteArray
         */
        decodeUTF8(buffer: Uint8Array | ArrayLike<number>) {
            var len = buffer.length;
            if (len < 1)
                return "";
            var parts = null,
                chunk = [],
                start = 0,
                i = 0, // char offset
                t;     // temporary
            while (start < len) {
                t = buffer[start++];
                if (t < 128)
                    chunk[i++] = t;
                else if (t > 191 && t < 224)
                    chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
                else if (t > 239 && t < 365) {
                    t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
                    chunk[i++] = 0xD800 + (t >> 10);
                    chunk[i++] = 0xDC00 + (t & 1023);
                } else
                    chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
                if (i > 8191) {
                    (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                    i = 0;
                }
            }
            if (parts) {
                if (i)
                    parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
                return parts.join("");
            }
            return String.fromCharCode.apply(String, chunk.slice(0, i));
        }
    }
    let pt = ByteArray.prototype;
    if (typeof TextDecoder === "function") {//如果有原生的文本编码解析类  浏览器支持状况： http://caniuse.com/#feat=textencoder
        let td = new TextDecoder();
        pt.decodeUTF8 = td.decode.bind(td);
        let te = new TextEncoder();
        pt.encodeUTF8 = te.encode.bind(te);
    }
    interface TextDecoder {
        decode(buffer: ArrayBufferView, options?: { stream: boolean });
    }
    interface TextDecoderConstructor {
        new (): TextDecoder;
    }
    declare var TextDecoder: TextDecoderConstructor;
    interface TextEncoder {
        encode(buffer: string, options?: { stream: boolean });
    }
    interface TextEncoderConstructor {
        new (): TextEncoder;
    }
    declare var TextEncoder: TextEncoderConstructor;
}
