declare module nid {
    /**
     * @private
     * LZMA Decoder
     * @author Nidin Vinayakan | nidinthb@gmail.com
     */
    class LZMAConfig {
        static LZMA_DIC_MIN: number;
        static LZMA_RES_ERROR: number;
        static LZMA_RES_FINISHED_WITH_MARKER: number;
        static LZMA_RES_FINISHED_WITHOUT_MARKER: number;
        static kNumBitModelTotalBits: number;
        static kNumMoveBits: number;
        static PROB_INIT_VAL: number;
        static kNumPosBitsMax: number;
        static kNumStates: number;
        static kNumLenToPosStates: number;
        static kNumAlignBits: number;
        static kStartPosModelIndex: number;
        static kEndPosModelIndex: number;
        static kNumFullDistances: number;
        static kMatchMinLen: number;
        static INIT_PROBS(p: Uint16Array): void;
        static BitTreeReverseDecode(probs: any, numBits: number, rc: RangeDecoder, offset?: number): number;
    }
}
declare module egret3d {
    /**
     * @language en_US
     * The Endian class contains values that denote the byte order used to represent multibyte numbers.
     * The byte order is either bigEndian (most significant byte first) or littleEndian (least significant byte first).
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    class Endian {
        /**
         * @language en_US
         * Indicates the least significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte). The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static LITTLE_ENDIAN: string;
        /**
         * @language en_US
         * Indicates the most significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte).  The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static BIG_ENDIAN: string;
    }
    /**
     * @language en_US
     * The ByteArray class provides methods and attributes for optimized reading and writing as well as dealing with binary data.
     * Note: The ByteArray class is applied to the advanced developers who need to access data at the byte layer.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    /**
     * @language zh_CN
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    class ByteArray {
        /**
         * @private
         */
        private static SIZE_OF_BOOLEAN;
        /**
         * @private
         */
        private static SIZE_OF_INT8;
        /**
         * @private
         */
        private static SIZE_OF_INT16;
        /**
         * @private
         */
        private static SIZE_OF_INT32;
        /**
         * @private
         */
        private static SIZE_OF_UINT8;
        /**
         * @private
         */
        private static SIZE_OF_UINT16;
        /**
         * @private
         */
        private static SIZE_OF_UINT32;
        /**
         * @private
         */
        private static SIZE_OF_FLOAT32;
        /**
         * @private
         */
        private static SIZE_OF_FLOAT64;
        /**
         * @private
         */
        private BUFFER_EXT_SIZE;
        private data;
        /**
         * @private
         */
        private _position;
        /**
         * @private
         */
        private write_position;
        /**
         * @language en_US
         * Changes or reads the byte order; egret.Endian.BIG_ENDIAN or egret.Endian.LITTLE_ENDIAN.
         * @default egret.Endian.BIG_ENDIAN
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 更改或读取数据的字节顺序；egret.Endian.BIG_ENDIAN 或 egret.Endian.LITTLE_ENDIAN。
         * @default egret.Endian.BIG_ENDIAN
         * @version Egret 2.4
         * @platform Web,Native
         */
        endian: string;
        /**
         * 构造函数
         * @param buffer {ArrayBuffer} 二进制数据,可以为空
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(buffer?: ArrayBuffer);
        /**
         * @private
         * @param buffer
         */
        private _setArrayBuffer(buffer);
        /**
         * @private
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        setArrayBuffer(buffer: ArrayBuffer): void;
        /**
         * 获取buffer
         * @returns {ArrayBuffer} 二进制数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
          * 设置buffer
          * @param value {ArrayBuffer} 二进制数据
          * @version Egret 2.4
          * @platform Web,Native
          */
        buffer: ArrayBuffer;
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @private
         */
        dataView: DataView;
        /**
         * @private
         */
        bufferOffset: number;
        /**
         * @language en_US
         * The current position of the file pointer (in bytes) to move or return to the ByteArray object. The next time you start reading reading method call in this position, or will start writing in this position next time call a write method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取当前文件指针位置
         * @returns {number} 以字节为单位的位置信息
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置当前文件指针位置
         * @param value {number} 以字节为单位的位置信息
         * @version Egret 2.4
         * @platform Web,Native
         */
        position: number;
        /**
         * @language en_US
         * The length of the ByteArray object (in bytes).
                  * If the length is set to be larger than the current length, the right-side zero padding byte array.
                  * If the length is set smaller than the current length, the byte array is truncated.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
        * @language zh_CN
        * 获取 ByteArray 对象的长度。
        * @returns {number} 以字节为单位的长度信息
        * @version Egret 2.4
        * @platform Web,Native
        */
        /**
       * @language zh_CN
       * 设置 ByteArray 对象的长度。
       * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
       * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
       * @param value {number} 以字节为单位的长度信息
       * @version Egret 2.4
       * @platform Web,Native
       */
        length: number;
        /**
         * @language en_US
         * The number of bytes that can be read from the current position of the byte array to the end of the array data.
         * When you access a ByteArray object, the bytesAvailable property in conjunction with the read methods each use to make sure you are reading valid data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
         * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
         * @param value {number} 以字节为单位的长度信息
         * @version Egret 2.4
         * @platform Web,Native
         */
        bytesAvailable: number;
        /**
         * @language en_US
         * Clears the contents of the byte array and resets the length and position properties to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。
         * @version Egret 2.4
         * @platform Web,Native
         */
        clear(): void;
        /**
         * @language en_US
         * Read a Boolean value from the byte stream. Read a simple byte. If the byte is non-zero, it returns true; otherwise, it returns false.
         * @return If the byte is non-zero, it returns true; otherwise, it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @returns 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         */
        readBoolean(): boolean;
        /**
         * @language en_US
         * Read signed bytes from the byte stream.
         * @return An integer ranging from -128 to 127
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取带符号的字节
         * @returns {number} 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readByte(): number;
        /**
         * @language en_US
         * Read data byte number specified by the length parameter from the byte stream. Starting from the position specified by offset, read bytes into the ByteArray object specified by the bytes parameter, and write bytes into the target ByteArray
         * @param bytes ByteArray object that data is read into
         * @param offset Offset (position) in bytes. Read data should be written from this position
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes {ByteArray} 要将数据读入的 ByteArray 对象
         * @param offset {number} bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length {number} 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * @language en_US
         * Read an IEEE 754 double-precision (64 bit) floating point number from the byte stream
         * @return Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @returns {number} 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readDouble(): number;
        /**
        * @language zh_CN
        * 解压 压缩字节流 按类型划分
        * @version Egret 2.4
        * @platform Web,Native
        */
        uncompress(type?: string): void;
        /**
        * @language zh_CN
        * 按7z的方式压缩字节
        * @version Egret 2.4
        * @platform Web,Native
        */
        compress(type?: string): void;
        /**
         * @language en_US
         * Read an IEEE 754 single-precision (32 bit) floating point number from the byte stream
         * @return Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @returns {number} 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readFloat(): number;
        /**
         * @language en_US
         * Read a 32-bit signed integer from the byte stream.
         * @returns A 32-bit signed integer ranging from -2147483648 to 2147483647
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 32 位整数
         * @returns {number} 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readInt(): number;
        /**
         * @language en_US
         * Read a 16-bit signed integer from the byte stream.
         * @returns A 16-bit signed integer ranging from -32768 to 32767
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 16 位整数
         * @returns {number} 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readShort(): number;
        /**
         * @language en_US
         * Read unsigned bytes from the byte stream.
         * @returns A 32-bit unsigned integer ranging from 0 to 255
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取无符号的字节
         * @returns {number} 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUnsignedByte(): number;
        /**
         * @language en_US
         * Read a 32-bit unsigned integer from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 4294967295
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 32 位整数
         * @returns {number} 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUnsignedInt(): number;
        /**
         * @language en_US
         * Read a 16-bit unsigned integer from the byte stream.
         * @return A 16-bit unsigned integer ranging from 0 to 65535
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 16 位整数
         * @returns {number} 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUnsignedShort(): number;
        /**
         * @language en_US
         * Read a UTF-8 character string from the byte stream Assume that the prefix of the character string is a short unsigned integer (use byte to express length)
         * @return UTF-8 character string
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @returns {string} UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUTF(): string;
        /**
         * @language en_US
         * Read a UTF-8 byte sequence specified by the length parameter from the byte stream, and then return a character string
         * @param Specify a short unsigned integer of the UTF-8 byte length
         * @return A character string consists of UTF-8 bytes of the specified length
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length {number} 指明 UTF-8 字节长度的无符号短整型数
         * @returns {number} 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        readUTFBytes(length: number): string;
        /**
         * @language en_US
         * Write a Boolean value. A single byte is written according to the value parameter. If the value is true, write 1; if the value is false, write 0.
         * @param value A Boolean value determining which byte is written. If the value is true, write 1; if the value is false, write 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value {boolean} 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeBoolean(value: boolean): void;
        /**
         * @language en_US
         * Write a byte into the byte stream
         * The low 8 bits of the parameter are used. The high 24 bits are ignored.
         * @param value A 32-bit integer. The low 8 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value {number} 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeByte(value: number): void;
        /**
         * @language zh_CN
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value {number} 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUnsignedByte(value: number): void;
        /**
         * @language en_US
         * Write the byte sequence that includes length bytes in the specified byte array, bytes, (starting at the byte specified by offset, using a zero-based index), into the byte stream
         * If the length parameter is omitted, the default length value 0 is used and the entire buffer starting at offset is written. If the offset parameter is also omitted, the entire buffer is written
         * If the offset or length parameter is out of range, they are clamped to the beginning and end of the bytes array.
         * @param bytes ByteArray Object
         * @param offset A zero-based index specifying the position into the array to begin writing
         * @param length An unsigned integer specifying how far into the buffer to write
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes {ByteArray} ByteArray 对象
         * @param offset {number} 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length {number} 一个无符号整数，表示在缓冲区中的写入范围
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * @language en_US
         * Write an IEEE 754 double-precision (64 bit) floating point number into the byte stream
         * @param value Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value {number} 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeDouble(value: number): void;
        /**
         * @language en_US
         * Write an IEEE 754 single-precision (32 bit) floating point number into the byte stream
         * @param value Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value {number} 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeFloat(value: number): void;
        /**
         * @language en_US
         * Write a 32-bit signed integer into the byte stream
         * @param value An integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个带符号的 32 位整数
         * @param value {number} 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeInt(value: number): void;
        /**
         * @language en_US
         * Write a 16-bit integer into the byte stream. The low 16 bits of the parameter are used. The high 16 bits are ignored.
         * @param value A 32-bit integer. Its low 16 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value {number} 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeShort(value: number): void;
        /**
         * @language en_US
         * Write a 32-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 32 位整数
         * @param value {number} 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUnsignedInt(value: number): void;
        /**
         * @language en_US
         * Write a 16-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 16 位整数
         * @param value {number} 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         */
        writeUnsignedShort(value: number): void;
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. The length of the UTF-8 string in bytes is written first, as a 16-bit integer, followed by the bytes representing the characters of the string
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value {string} 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUTF(value: string): void;
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. Similar to the writeUTF() method, but the writeUTFBytes() method does not prefix the string with a 16-bit length word
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value {string} 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        writeUTFBytes(value: string): void;
        /**
         * 返回格式化字符串信息，包含ByteArray的长度信息和bytesAvailable信息
         * @returns {string} 格式化字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        toString(): string;
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes {Uint8Array} 要写入的Uint8Array
         * @param validateBuffer
         */
        _writeUint8Array(bytes: Uint8Array, validateBuffer?: boolean): void;
        /**
         * @private
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        validate(len: number): boolean;
        /**********************/
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        private validateBuffer(len, needReplace?);
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        private encodeUTF8(str);
        /**
         * @private
         *
         * @param data
         * @returns
         */
        private decodeUTF8(data);
        /**
         * @private
         *
         * @param code_point
         */
        private encoderError(code_point);
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        private decoderError(fatal, opt_code_point?);
        /**
         * @private
         */
        private EOF_byte;
        /**
         * @private
         */
        private EOF_code_point;
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        private inRange(a, min, max);
        /**
         * @private
         *
         * @param n
         * @param d
         */
        private div(n, d);
        /**
         * @private
         *
         * @param string
         */
        private stringToCodePoints(string);
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.BooleanArray
    * @classdesc
    * 合并24个bool到一个float32中
    * @version Egret 3.0
    * @platform Web,Native
    */
    class BooleanArray {
        static FLAG_0: number;
        static FLAG_1: number;
        static FLAG_2: number;
        static FLAG_3: number;
        static FLAG_4: number;
        static FLAG_5: number;
        static FLAG_6: number;
        static FLAG_7: number;
        static FLAG_8: number;
        static FLAG_9: number;
        static FLAG_10: number;
        private _dirty;
        private _makeResult;
        private static MAX_COUNT;
        /**
        * @language zh_CN
        * 值队列
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _values;
        /**
        * @language zh_CN
        * constructor
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
       * @language zh_CN
       * 在指定的位置s设置bool值
       * @param index 指定下标
       * @param value 需要设置的bool值
       * @version Egret 3.0
       * @platform Web,Native
       */
        setBoolean(index: number, value: boolean): void;
        /**
        * @language zh_CN
        * 在指定的位置获取bool值
        * @param index 指定下标
        * @returns bool值
        * @version Egret 3.0
        * @platform Web,Native
        */
        getBoolean(index: number): boolean;
        /**
        * @language zh_CN
        * 是否需要重新计算
        * @returns bool值
        * @version Egret 3.0
        * @platform Web,Native
        */
        dirty: boolean;
        /**
        * @language zh_CN
        * 强制设置需要计算
        * @version Egret 3.0
        * @platform Web,Native
        */
        forceDirty(): void;
        /**
        * @language zh_CN
        * 获取压缩后的值
        * @returns number 压缩的结果
        * @version Egret 3.0
        * @platform Web,Native
        */
        makeResult: number;
        private make();
        /**
        * @language zh_CN
        * 重置该列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        clear(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.Debug
    * @classdesc
    * 调试面板
    */
    class Debug {
        private _console;
        isDebug: boolean;
        /**
         * @language zh_CN
         * 构造
         */
        constructor();
        /**
         * @language zh_CN
         * 输出调试信息
         * @param parameters
         */
        trace(...parameters: string[]): void;
        /**
         * @language zh_CN
         * 重置显示数据
         */
        reset(): void;
        private static _instance;
        /**
         * @language zh_CN
         * 取到当前Debug单例对象
         */
        static instance: Debug;
    }
}
declare module egret3d {
    /**
     * @private
     * @class egret3d.StringUtil
     * @classdesc
     * 字符串处理工具类
     */
    class StringUtil {
        /**
         * @language zh_CN
         * @private
         */
        private static _filterChar;
        /**
         * @language zh_CN
         * @private
         * 解析文件内容(按行解析)
         * @param file
         * @returns 行列表
         */
        static parseContent(file: string): Array<string>;
        /**
         * @language zh_CN
         * 解析一行的内容 有多少个成员
         * @param line 源内容
         * @returns 成员列表
         */
        static parseLines(line: string): Array<string>;
        /**
         * @language zh_CN
         * 是否存在此字符串
         * @param fields 被检测的列表
         * @param str 比较字符串
         * @returns 成功返回true
         */
        static hasString(fields: Array<string>, str: string): number;
        /**
         * @language zh_CN
         * 得到值的内容
         * @param fields 成员列表
         * @returns 值
         */
        static getVarName(fields: Array<string>): string;
        /**
         * @language zh_CN
         * 返回变量的值
         * @param fields 变量数据列表
         * @returns 变量的值
         */
        static getVarValue(fields: Array<string>): string;
        /**
         * @language zh_CN
         * 返回变量类型
         * @param fields 变量数据列表
         * @returns 变量类型
         */
        static getVarType(fields: Array<string>): string;
        /**
         * @language zh_CN
         * 返回变量属性
         * @param fields 变量数据列表
         * @returns 变量属性
         */
        static getVarKey(fields: Array<string>): string;
        /**
         * @language zh_CN
         * @private
         * 筛选文件中的指定字符去掉
         * @param file xxx
         * @returns 筛选后的字符
         */
        static processShaderFile(file: string): string;
        /**
         * @language zh_CN
         * 解析字符颜色值
         * @param color
         * @returns
         */
        static colorRgb(color: string): string;
        /**
         * @language zh_CN
         * @private
         * @returns
         */
        static getLineType(line: string): string;
        /**
         * @language zh_CN
         * @private
         * @returns
         */
        static processStruct(name: string, structStr: string, content: GLSL.ShaderContent): void;
        /**
         * @language zh_CN
         * @private
         * @returns
         */
        static getAttribute(shaderLine: string): GLSL.Attribute;
        /**
        * @language zh_CN
        * @private
        * @returns
        */
        static getTemper(shaderLine: string): GLSL.TmpVar;
        /**
        * @language zh_CN
        * @private
        * @returns
        */
        static getVarying(shaderLine: string): GLSL.Varying;
        /**
        * @language zh_CN
        * @private
        * @returns
        */
        static getUniform(shaderLine: string): GLSL.Uniform;
        /**
        * @language zh_CN
        * @private
        * @returns
        */
        static getConst(shaderLine: string): GLSL.ConstVar;
        static getExtension(shaderLine: string): GLSL.Extension;
        static getDefine(shaderLine: string): GLSL.DefineVar;
        /**
        * @language zh_CN
        * @private
        * @returns
        */
        static getSampler2D(shaderLine: string): GLSL.Sampler2D;
        /**
        * @language zh_CN
        * @private
        * @returns
        */
        static getSampler3D(shaderLine: string): GLSL.Sampler3D;
        /**
        * @language zh_CN
        * @private
        * @returns
        */
        static filterCharacter(name: string): string;
        static replaceCharacter(src: string, searchValue: Array<string>, replaceValue: string): string;
        static getURLName(url: string): string;
        static getFileFormat(url: string): string;
        static getPath(url: string): string;
        static ab2str(byte: ByteArray, block?: number): string;
        static str2ab(str: string): ByteArray;
    }
}
declare module nid {
    class MEMORY {
        static u8Index: number;
        static u16Index: number;
        static u32Index: number;
        static u8: Uint32Array;
        static u16: Uint32Array;
        static u32: Uint32Array;
        static allocateUint8(len: number): void;
        static allocateUint16(len: number): void;
        static allocateUint32(len: number): void;
        static reset(): void;
        static getUint8(): number;
        static getUint16(): number;
        static getUint32(): number;
    }
}
declare module nid {
    /**
     * @private
     * LZMA Decoder
     * @author Nidin Vinayakan | nidinthb@gmail.com
     */
    class LzmaDecoder {
        markerIsMandatory: boolean;
        rangeDec: RangeDecoder;
        outWindow: OutWindow;
        lc: number;
        pb: number;
        lp: number;
        dictSize: number;
        dictSizeInProperties: number;
        private litProbs;
        private posSlotDecoder;
        private alignDecoder;
        private posDecoders;
        private isMatch;
        private isRep;
        private isRepG0;
        private isRepG1;
        private isRepG2;
        private isRep0Long;
        private lenDecoder;
        private repLenDecoder;
        private loc1;
        private loc2;
        private matchBitI;
        private matchByteI;
        private bitI;
        private symbolI;
        private prevByteI;
        private litStateI;
        constructor();
        init(): void;
        create(): void;
        private createLiterals();
        private initLiterals();
        private decodeLiteral(state, rep0);
        private decodeDistance(len);
        private initDist();
        decodeProperties(properties: Uint8Array): void;
        private updateState_Literal(state);
        private updateState_ShortRep(state);
        private updateState_Rep(state);
        private updateState_Match(state);
        decode(unpackSizeDefined: boolean, unpackSize: number): number;
    }
}
declare module nid {
    /**
     * @private
     * LZMA Decoder
     * @author Nidin Vinayakan | nidinthb@gmail.com
     */
    class LZMA {
        decoder: LzmaDecoder;
        data: Uint8Array;
        constructor();
        decode(data: Uint8Array): Uint8Array;
    }
}
declare module nid {
    /**
     * @private
     * LZMA Decoder
     * @author Nidin Vinayakan | nidinthb@gmail.com
     */
    class OutWindow {
        totalPos: number;
        outStream: Uint8Array;
        private buf;
        private pos;
        out_pos: number;
        private size;
        private isFull;
        constructor();
        create(dictSize: number): void;
        putByte(b: any): void;
        getByte(dist: number): number;
        copyMatch(dist: any, len: any): void;
        checkDistance(dist: any): boolean;
        isEmpty(): boolean;
    }
}
declare module nid {
    /**
     * @private
     * LZMA Decoder
     * @author Nidin Vinayakan | nidinthb@gmail.com
     */
    class RangeDecoder {
        static kTopValue: number;
        inStream: Uint8Array;
        corrupted: boolean;
        in_pos: number;
        private range;
        private code;
        private rangeI;
        private codeI;
        private loc1;
        private loc2;
        private U32;
        private U16;
        constructor();
        isFinishedOK(): boolean;
        init(): void;
        normalize(): void;
        decodeDirectBits(numBits: number): number;
        decodeBit(prob: Uint16Array, index: number): number;
    }
}
declare module nid {
    /**
    * @private
     * LZMA Decoder
     * @author Nidin Vinayakan | nidinthb@gmail.com
     */
    class BitTreeDecoder {
        probs: Uint16Array;
        private numBits;
        constructor(numBits: any);
        init(): void;
        decode(rc: RangeDecoder): number;
        reverseDecode(rc: RangeDecoder): number;
        static constructArray(numBits: number, len: number): Array<BitTreeDecoder>;
    }
}
declare module nid {
    /**
     * @private
     * LZMA Decoder
     * @author Nidin Vinayakan | nidinthb@gmail.com
     */
    class LenDecoder {
        private choice;
        private lowCoder;
        private midCoder;
        private highCoder;
        constructor();
        init(): void;
        decode(rc: RangeDecoder, posState: number): number;
    }
}
declare module nid {
    class LZMAWorker {
        static ENCODE: number;
        static DECODE: number;
        private decoder;
        private command;
        private time;
        constructor();
        private decode(data);
    }
}
declare module nid {
    class LZMAHelper {
        static decoder: LZMA;
        static callback: Function;
        static ENCODE: number;
        static DECODE: number;
        static init(): void;
        static encode(data: ArrayBuffer): ArrayBuffer;
        static decode(data: ArrayBuffer): ArrayBuffer;
        static encodeAsync(data: ArrayBuffer, _callback: Function): void;
        static decodeAsync(data: ArrayBuffer, _callback: Function): void;
    }
}
declare module egret3d {
    class Egret3DLog {
        static outError(message: any): void;
        static outWarn(message: any): void;
        static outDebug(message: any): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    enum TextureMethodType {
        diffuse = 0,
        normal = 1,
        specular = 2,
        color = 3,
        shadow = 4,
    }
    /**
    * @private
    */
    enum ShaderPhaseType {
        utils_vertex = 0,
        base_vertex = 1,
        start_vertex = 2,
        local_vertex = 3,
        global_vertex = 4,
        end_vertex = 5,
        utils_fragment = 6,
        base_fragment = 7,
        start_fragment = 8,
        materialsource_fragment = 9,
        diffuse_fragment = 10,
        normal_fragment = 11,
        matCap_fragment = 12,
        specular_fragment = 13,
        shadow_fragment = 14,
        lighting_fragment = 15,
        multi_end_fragment = 16,
        end_fragment = 17,
    }
}
declare module egret3d {
    /**
* @private
*/
    enum UniformType {
        uniform1f = 0,
        uniform1fv = 1,
        uniform1i = 2,
        uniform1iv = 3,
        uniform2f = 4,
        uniform2fv = 5,
        uniform2i = 6,
        uniform2iv = 7,
        uniform3f = 8,
        uniform3fv = 9,
        uniform3i = 10,
        uniform3iv = 11,
        uniform4f = 12,
        uniform4fv = 13,
        uniform4i = 14,
        uniform4iv = 15,
        uniformMatrix2fv = 16,
        uniformMatrix3fv = 17,
        uniformMatrix4fv = 18,
    }
    /**
    * @private
    */
    enum InternalFormat {
        PixelArray = 0,
        CompressData = 1,
        ImageData = 2,
    }
    /**
    * @private
    */
    /**
    * @private
    */
    enum FrameBufferType {
        shadowFrameBufrfer = 0,
        defaultFrameBuffer = 1,
        positionFrameBuffer = 2,
        normalFrameBuffer = 3,
        specularFrameBuffer = 4,
        leftEyeFrameBuffer = 5,
        rightEyeFrameBuffer = 6,
        nextFrameBuffer = 7,
    }
    /**
    * @private
    */
    enum FrameBufferFormat {
        FLOAT_RGB = 0,
        FLOAT_RGBA = 1,
        UNSIGNED_BYTE_RGB = 2,
        UNSIGNED_BYTE_RGBA = 3,
    }
    /**
    * @language zh_CN
    * 渲染混合模式</p>
    * BlendMode 类中的一个值，用于指定要使用的混合模式。 内部绘制位图的方法有两种。</p>
    * 如果启用了混合模式或外部剪辑遮罩，则将通过向矢量渲染器添加有位图填充的正方形来绘制位图。</p>
    * 如果尝试将此属性设置为无效值，运行时会将此值设置为 BlendMode.NORMAL。</p>
    * blendMode 属性影响显示对象的每个像素。</p>
    * 每个像素都由三种原色（红色、绿色和蓝色）组成，每种原色的值介于 0x00 和 0xFF 之间。</p>
    * 将影片剪辑中一个像素的每种原色与背景中像素的对应颜色进行比较。</p>
    * 下表将对 blendMode 设置进行说明。BlendMode 类定义可使用的字符串值。</p>
    * 表中的插图显示应用于交叠于显示对象</p>
    * (1) 之上的圆形显示对象 (2) 的 blendMode 值。</p>
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum BlendMode {
        /**
        * @language zh_CN
        * 将显示对象的每个像素的 Alpha 值应用于背景。
        * @version Egret 3.0
        * @platform Web,Native
        */
        ALPHA = 0,
        /**
        * @language zh_CN
        * 强制为该显示对象创建一个透明度组。
        * @version Egret 3.0
        * @platform Web,Native
        */
        LAYER = 1,
        /**
        * @language zh_CN
        * 该显示对象出现在背景前面。
        * @version Egret 3.0
        * @platform Web,Native
        */
        NORMAL = 2,
        /**
        * @language zh_CN
        * 将显示对象的原色值与背景颜色的原色值相乘，然后除以 0xFF 进行标准化，从而得到较暗的颜色。
        * @version Egret 3.0
        * @platform Web,Native
        */
        MULTIPLY = 3,
        /**
        * @language zh_CN
        * 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。
        * @version Egret 3.0
        * @platform Web,Native
        */
        ADD = 4,
        /**
        * @language zh_CN
        * 从背景颜色的值中减去显示对象原色的值，下限值为 0。
        * @version Egret 3.0
        * @platform Web,Native
        */
        SUB = 5,
        /**
        * @language zh_CN
        * 将显示对象颜色的补色（反色）与背景颜色的补色相除。
        * @version Egret 3.0
        * @platform Web,Native
        */
        DIV = 6,
        /**
        * @language zh_CN
        * 将显示对象颜色的补色（反色）与背景颜色的补色相乘，会产生漂白效果。
        * @version Egret 3.0
        * @platform Web,Native
        */
        SCREEN = 7,
        /**
        * @language zh_CN
        * 将显示对象的原色值添加到它的背景颜色中(较ADD稍微暗一些)，上限值为 0xFF。
        * @version Egret 3.0
        * @platform Web,Native
        */
        SOFT_ADD = 8,
    }
    /**
    * @private
    * @class egret3d.ContextSamplerType
    * @classdesc
    * 贴图采样类型
    */
    class ContextSamplerType {
        /**
        * @language zh_CN
        * 纹理0数据
        */
        static TEXTURE_0: any;
        /**
        * @language zh_CN
        * 纹理1数据
        */
        static TEXTURE_1: any;
        /**
        * @language zh_CN
        * 纹理2数据
        */
        static TEXTURE_2: any;
        /**
        * @language zh_CN
        * 纹理3数据
        */
        static TEXTURE_3: any;
        /**
        * @language zh_CN
        * 纹理4数据
        */
        static TEXTURE_4: any;
        /**
        * @language zh_CN
        * 纹理5数据
        */
        static TEXTURE_5: any;
        /**
        * @language zh_CN
        * 纹理6数据
        */
        static TEXTURE_6: any;
        /**
        * @language zh_CN
        * 纹理7数据
        */
        static TEXTURE_7: any;
        /**
        * @language zh_CN
        * 纹理8数据
        */
        static TEXTURE_8: any;
        /**
        * @language zh_CN
        * 重复 0~1 的纹理坐标 例如：5.2 % 1 = 0.2
        */
        static REPEAT: number;
        /**
        * @language zh_CN
        * 重复 0~1 的纹理坐标 例如：5.2 % 1 = 0.2
        */
        static NEAREST: number;
        /**
        * @language zh_CN
        * 重复 0~1 的纹理坐标 例如：5.2 % 1 = 0.2
        */
        static LINEAR: number;
    }
    /**
    * @class egret3d.DrawMode
    * @classdesc
    * 渲染模式。
    * LINES 线框显示模式。
    * POINTS 点显示模式。
    * TRIANGLES 三角形显示模式。
    * LINE_STRIP 连接线显示模式。
    * @version Egret 3.0
    * @platform Web,Native
    */
    class DrawMode {
        /**
        * @language zh_CN
        * 线框显示模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        static LINES: number;
        /**
        * @language zh_CN
        * 点显示模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        static POINTS: number;
        /**
        * @language zh_CN
        * 三角形显示模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TRIANGLES: number;
        /**
        * @language zh_CN
        * 连接线显示模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        static LINE_STRIP: number;
    }
    /**
    * @class egret3d.ContextConfig
    * @classdesc
    *
    * 一些渲染状态，裁剪模式和数据类型的一些常量值。
    * 对应WebGLRenderingContext中的常量值。
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ContextConfig {
        /**
        * @private
        */
        static Direct3D_Opengl_Auto: string;
        /**
        * @private
        */
        static Direct3D_9_0: string;
        /**
        * @private
        */
        static Direct3D_10_0: string;
        /**
        * @private
        */
        static Direct3D_11_0: string;
        /**
        * @private
        */
        static OpenGLES_2_0: string;
        /**
        * @private
        */
        static OpenGLES_3_0: string;
        /**
        * @private
        */
        static OpenGL: string;
        /**
        * @private
        */
        static canvas: HTMLCanvasElement;
        /**
        * @private
        */
        static VERTEX_SHADER: number;
        /**
        * @private
        */
        static FRAGMENT_SHADER: number;
        /**
        * @private
        */
        static BLEND: number;
        /**
        * @language zh_CN
        * UNSIGNED_BYTE 数据类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static UNSIGNED_BYTE: number;
        /**
        * @language zh_CN
        * FLOAT 数据类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static FLOAT: number;
        /**
        * @private
        */
        static CULL_FACE: number;
        /**
        * @language zh_CN
        * 裁剪正面进行反面渲染
        * @version Egret 3.0
        * @platform Web,Native
        */
        static FRONT: number;
        /**
        * @language zh_CN
        * 裁剪反面进行正面渲染
        * @version Egret 3.0
        * @platform Web,Native
        */
        static BACK: number;
        /**
        * @language zh_CN
        * 裁剪正面和反面
        * @version Egret 3.0
        * @platform Web,Native
        */
        static FRONT_AND_BACK: number;
        /**
        * @language zh_CN
        * 深度测试
        * @version Egret 3.0
        * @platform Web,Native
        */
        static DEPTH_TEST: number;
        /**
        * @language zh_CN
        * 深度缓冲值
        * @version Egret 3.0
        * @platform Web,Native
        */
        static DEPTH_BUFFER_BIT: number;
        /**
        * @private
        */
        static ELEMENT_ARRAY_BUFFER: number;
        /**
        * @private
        */
        static UNSIGNED_SHORT: number;
        /**
        * @private
        */
        static NEAREST: number;
        /**
        * @private
        */
        static REPEAT: number;
        /**
        * @private
        */
        static ONE: number;
        /**
        * @private
        */
        static ZERO: number;
        /**
        * @private
        */
        static SRC_ALPHA: number;
        /**
        * @private
        */
        static ONE_MINUS_SRC_ALPHA: number;
        /**
        * @private
        */
        static SRC_COLOR: number;
        /**
        * @private
        */
        static ONE_MINUS_SRC_COLOR: number;
        /**
        * @private
        */
        static ColorFormat_RGB565: number;
        /**
        * @private
        */
        static ColorFormat_RGBA5551: number;
        /**
        * @private
        */
        static ColorFormat_RGBA4444: number;
        /**
        * @private
        */
        static ColorFormat_RGBA8888: number;
        /**
        * @private
        */
        static ColorFormat_RGB888: number;
        /**
        * @private
        */
        static ColorFormat_DXT1_RGB: number;
        /**
        * @private
        */
        static ColorFormat_DXT1_RGBA: number;
        /**
        * @private
        */
        static ColorFormat_DXT3_RGBA: number;
        /**
        * @private
        */
        static ColorFormat_DXT5_RGBA: number;
        /**
        * @private
        * canvas窗口矩形
        */
        static canvasRectangle: Rectangle;
        /**
        * @private
        * 用户窗口矩形
        */
        static clientRect: ClientRect;
        /**
        * @private
        */
        static LEQUAL: number;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.UV
     * @classdesc
     * UV类，用来存储模型顶点uv数据
     *
     * @see egret3d.GeometryData
     *
     * @version Egret 3.0
     * @platform Web,Native
     */
    class UV {
        /**
        * @language zh_CN
        * u
        */
        u: number;
        /**
        * @language zh_CN
        * v
        */
        v: number;
        /**
        * @language zh_CN
        * constructor
        */
        constructor(u?: number, v?: number);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Point
    * @classdesc
    * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
    * @includeExample geom/Point.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Point {
        /**
         * @language en_US
         * The horizontal coordinate of the point. The default value is 0.
         */
        /**
        * @language zh_CN
        * x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        x: number;
        /**
         * @language en_US
         * The vertical coordinate of the point. The default value is 0.
         */
        /**
        * @language zh_CN
        * y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        y: number;
        /**
         * @language en_US
         * The length of the line segment from(0,0) to this point.
         * @returns length
                * @version Egret 3.0
        * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回从(0, 0)到(x, y)的距离
         * @returns number 当前2维向量的长度
         * @version Egret 3.0
         * @platform Web,Native
         */
        length: number;
        /**
         * @language en_US
         * Creates a new point. If you pass no parameters to this method, a point is
         * created at(0,0).
         *
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         */
        /**
         * @language zh_CN
         * 创建一个Point实例
         * @param x x坐标 默认为0
         * @param y y坐标 默认为0
         * @version Egret 3.0
         * @platform Web,Native
         */
        constructor(x?: number, y?: number);
        /**
         * @language en_US
         * Adds the coordinates of another point to the coordinates of this point to
         * create a new point.
         *
         * @param v The point to be added.
         * @returns The new point.
         */
        /**
         * @language zh_CN
         * 当前Point加上v Point，结果返回新的实例
         * @param v
         * @version Egret 3.0
         * @platform Web,Native
         */
        add(v: Point): Point;
        /**
        * @language zh_CN
        * 当前Point自生加上v Point
        * @param v
        * @version Egret 3.0
        * @platform Web,Native
        */
        incrementBy(v: Point): void;
        /**
        * @language zh_CN
        * 重新赋值Point实例
        * @param x x坐标 默认为0
        * @param y y坐标 默认为0
        * @version Egret 3.0
        * @platform Web,Native
        */
        setTo(x?: number, y?: number): void;
        /**
         * @language en_US
         * Creates a copy of this Point object.
         *
         * @returns The new Point object.
         */
        /**
         * @language zh_CN
         * 克隆Point
         * @returns  Point 返回克隆后的Point
         * @version Egret 3.0
         * @platform Web,Native
         */
        clone(): Point;
        /**
         * @language zh_CN
         * 复制源Point的值
         * @param sourcePoint 数据源
         * @version Egret 3.0
         * @platform Web,Native
         */
        copyFrom(sourcePoint: Point): void;
        /**
         * @language en_US
         * Determines whether two points are equal. Two points are equal if they have
         * the same <i>x</i> and <i>y</i> values.
         *
         * @param toCompare The point to be compared.
         * @returns A value of <code>true</code> if the object is equal to this Point
         *         object; <code>false</code> if it is not equal.
         */
        /**
         * @language zh_CN
         * 比较两个Point是否全等
         * @param toCompare 被比较的Point
         * @returns boolean 全等返回true
         * @version Egret 3.0
         * @platform Web,Native
         */
        equals(toCompare: Point): boolean;
        /**
         * @language en_US
         * Scales the line segment between(0,0) and the current point to a set
         * length.
         *
         * @param thickness The scaling value. For example, if the current point is
         *                 (0,5), and you normalize it to 1, the point returned is
         *                  at(0,1).
         */
        /**
         * @language zh_CN
         * 当前Point标准化
         * @param thickness 默认参数为1，使当前Point的长度为thickness 原点(0, 0)到(x, y)的距离
         * @version Egret 3.0
         * @platform Web,Native
         */
        normalize(thickness?: number): void;
        /**
         * @language en_US
         * Offsets the Point object by the specified amount. The value of
         * <code>dx</code> is added to the original value of <i>x</i> to create the
         * new <i>x</i> value. The value of <code>dy</code> is added to the original
         * value of <i>y</i> to create the new <i>y</i> value.
         *
         * @param dx The amount by which to offset the horizontal coordinate,
         *           <i>x</i>.
         * @param dy The amount by which to offset the vertical coordinate, <i>y</i>.
         */
        /**
         * @language zh_CN
         * 当前Point偏移位置
         * @param dx 偏移的x坐标
         * @param dx 偏移的y坐标
         * @version Egret 3.0
         * @platform Web,Native
         */
        offset(dx: number, dy: number): void;
        /**
         * @language en_US
         * Subtracts the coordinates of another point from the coordinates of this
         * point to create a new point.
         *
         * @param v The point to be subtracted.
         * @returns The new point.
         */
        /**
         * @language zh_CN
         * 当前Point减去v Point,结果返回一个新实例
         * @param v
         * @returns Point 结果返回
         * @version Egret 3.0
         * @platform Web,Native
         */
        subtract(v: Point): Point;
        /**
         * @language en_US
         * Returns a string that contains the values of the <i>x</i> and <i>y</i>
         * coordinates. The string has the form <code>"(x=<i>x</i>,
         * y=<i>y</i>)"</code>, so calling the <code>toString()</code> method for a
         * point at 23,17 would return <code>"(x=23, y=17)"</code>.
         *
         * @returns The string representation of the coordinates.
         */
        /**
        * @language zh_CN
        * 当前Point以字符串形式返回
        * @returns string
         * @version Egret 3.0
         * @platform Web,Native
        */
        toString(): string;
        /**
         * @language en_US
         * Returns the distance between <code>pt1</code> and <code>pt2</code>.
         *
         * @param pt1 The first point.
         * @param pt2 The second point.
         * @returns The distance between the first and second points.
         */
        /**
        * @language zh_CN
        * 计算两个Point之间的距离
        * @returns number 返回两个Point之间的距离
         * @version Egret 3.0
         * @platform Web,Native
        */
        static distance(pt1: Point, pt2: Point): number;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.PointUtils
    * @classdesc
    * 这个类里面封装了一个用于判定一个2d点是否在另外3个2d点的三角形内部的方法。
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PointUtils {
        /**
        * @language zh_CN
        * @private
        * 静态变量2d点
        * @version Egret 3.0
        * @platform Web,Native
        */
        private static p1;
        /**
        * @language zh_CN
        * @private
        * 静态变量2d点
        * @version Egret 3.0
        * @platform Web,Native
        */
        private static p2;
        /**
        * @language zh_CN
        * @private
        * 静态变量2d点
        * @version Egret 3.0
        * @platform Web,Native
        */
        private static p3;
        /**
        * @language zh_CN
        * @private
        * 静态变量2d点
        * @version Egret 3.0
        * @platform Web,Native
        */
        private static pp;
        /**
       * @language zh_CN
       * 判定2d点是否在一个2d的三角形内
       * @param pt0        被判定的点
       * @param pt1        三角形的顶点1
       * @param pt2        三角形的顶点2
       * @param pt3        三角形的顶点3
       * @returns boolean 是否处于三角形内
       * @version Egret 3.0
       * @platform Web,Native
       */
        static pointInsideTriangle(pt: Vector3D, pt0: Vector3D, pt1: Vector3D, pt2: Vector3D): boolean;
        /**
        * @language zh_CN
        * @private
        * @returns boolean 判定2d点是否在一个2d的三角形内
        * @version Egret 3.0
        * @platform Web,Native
        */
        private static pointInsideTriangle2d();
        /**
        * @language zh_CN
        * 叉乘计算
        * @param pt1        点1
        * @param pt2        点2
        * @param pt3        点3
        * @returns number 结果值
        * @version Egret 3.0
        * @platform Web,Native
        */
        private static product2d(p1, p2, p3);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Vector3D
    * @classdesc
    * 用 Vector3D 表示三维空间中的位置,也可以做4维向量,当为3维向量时w始终为0。</p>
    * 定义了一个三元的浮点向量。</p>
    * 当使用一个向量表示一个表面法线时，向量应该是标准化的。</p>
    * 其他用途的定向矢量的大小不变。当用作一个点，元素的矢量表示在三维空间中的位置。</p>
    * @includeExample geom/Vector3D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Vector3D {
        /**
        * @language en_US
        * The x axis defined as a Vector3D object with coordinates (1,0,0).
        */
        /**
        * @language zh_CN
        * X轴坐标 (1,0,0).
        * @version Egret 3.0
        * @platform Web,Native
        */
        static X_AXIS: Vector3D;
        /**
        * @language en_US
        * The y axis defined as a Vector3D object with coordinates (0,1,0).
        */
        /**
        * @language zh_CN
        * Y轴坐标 (0,1,0).
        * @version Egret 3.0
        * @platform Web,Native
        */
        static Y_AXIS: Vector3D;
        /**
        * @language en_US
        * The z axis defined as a Vector3D object with coordinates (0,0,1).
        */
        /**
        * @language zh_CN
        * Z轴坐标 (0,0,1).
        * @version Egret 3.0
        * @platform Web,Native
        */
        static Z_AXIS: Vector3D;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static HELP_0: Vector3D;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static HELP_1: Vector3D;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static HELP_2: Vector3D;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static HELP_3: Vector3D;
        /**
        * @language en_US
        * The first element of a Vector3D object, such as the x coordinate of
        * a point in the three-dimensional space. The default value is 0.
        */
        /**
        * @language zh_CN
        * 在三维空间中x坐标，默认值是0
        * @version Egret 3.0
        * @platform Web,Native
        */
        x: number;
        /**
        * @language en_US
        * The second element of a Vector3D object, such as the y coordinate of
        * a point in the three-dimensional space. The default value is 0.
        */
        /**
        * @language zh_CN
        * 在三维空间中y坐标，默认值是0
        * @version Egret 3.0
        * @platform Web,Native
        */
        y: number;
        /**
        * @language en_US
        * The third element of a Vector3D object, such as the y coordinate of
        * a point in the three-dimensional space. The default value is 0.
        */
        /**
        * @language zh_CN
        * 在三维空间中z坐标，默认值是0
        * @version Egret 3.0
        * @platform Web,Native
        */
        z: number;
        /**
        * @language zh_CN
        * 可作为一种透视投影的三维位置或投影
        * 也可以做四元数中的w
        * @version Egret 3.0
        * @platform Web,Native
        */
        w: number;
        /**
        * @language en_US
        *  得到w分量
        * @returns 获得w的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language en_US
        *  设置w分量
        * @param value 设置给w的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        a: number;
        /**
        * @language en_US
        *  得到x分量
        * @returns 获得x的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language en_US
        *  设置x分量
        * @param value 设置给x的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        r: number;
        /**
        * @language en_US
        *  得到y分量
        * @returns 获得y的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language en_US
        *  设置y分量
        * @param value 设置给y的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        g: number;
        /**
        * @language en_US
        *  得到z分量
        * @returns 获得z的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language en_US
        *  设置z分量
        * @param value 设置给z的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        b: number;
        /**
        * @language en_US
        * The length, magnitude, of the current Vector3D object from the
        * origin (0,0,0) to the object's x, y, and z coordinates. The w
        * property is ignored. A unit vector has a length or magnitude of
        * one.
        */
        /**
        * @language zh_CN
        * 向量的长度，原点(0, 0, 0)到(x, y, z)的距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        length: number;
        /**
        * @language en_US
        * The square of the length of the current Vector3D object, calculated。
        * using the x, y, and z properties. The w property is ignored. Use the
        * <code>lengthSquared()</code> method whenever possible instead of the
        * slower <code>Math.sqrt()</code> method call of the
        * <code>Vector3D.length()</code> method.
        */
        /**
        * @language zh_CN
        * 3维向量的坐标x的平方加 y的平方加 z的平方
        * @returns 获得长度的平方
        * @version Egret 3.0
        * @platform Web,Native
        */
        lengthSquared: number;
        /**
        * @language en_US
        * Creates an instance of a Vector3D object. If you do not specify a。
        * parameter for the constructor, a Vector3D object is created with
        * the elements (0,0,0,0).
        *
        * @param x The first element, such as the x coordinate.
        * @param y The second element, such as the y coordinate.
        * @param z The third element, such as the z coordinate.
        * @param w An optional element for additional data such as the angle
        *          of rotation.
        */
        /**
        * @language zh_CN
        * 创建一个对象实例，默认为(0, 0, 0, 0)
        * @param x x的值
        * @param y y的值
        * @param z z的值
        * @param w w的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(x?: number, y?: number, z?: number, w?: number);
        /**
        * @language en_US
        * Adds the value of the x, y, and z elements of the current Vector3D。
        * object to the values of the x, y, and z elements of another Vector3D
        * object. The <code>add()</code> method does not change the current
        * Vector3D object. Instead, it returns a new Vector3D object with
        * the new values.
        *
        * <p>The result of adding two vectors together is a resultant vector.
        * One way to visualize the result is by drawing a vector from the
        * origin or tail of the first vector to the end or head of the second
        * vector. The resultant vector is the distance between the origin
        * point of the first vector and the end point of the second vector.
        * </p>
        */
        /**
        * @language zh_CN
        * 向量相加，结果返回一个新实例
        * @param a Vector3D 加成的值
        * @param target Vector3D 默认为null
        * @returns Vector3D 结果返回
        * @version Egret 3.0
        * @platform Web,Native
        */
        add(a: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language en_US
        * Returns a new Vector3D object that is an exact copy of the current
        * Vector3D object.
        *
        * @returns A new Vector3D object that is a copy of the current
        * Vector3D object.
        */
        /**
        * @language zh_CN
        * 克隆一个Vector3D
        * @returns 返回克隆后的实例
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Vector3D;
        /**
        * @language en_US
        * Copies all of vector data from the source Vector3D object into the
        * calling Vector3D object.
        *
        * @param src The Vector3D object from which to copy the data.
        */
        /**
        * @language zh_CN
        * 复制Vector3D对象
        * @param src 数据源
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyFrom(src: Vector3D): void;
        /**
        * @language en_US
        * Returns a new Vector3D object that is perpendicular (at a right。
        * angle) to the current Vector3D and another Vector3D object. If the
        * returned Vector3D object's coordinates are (0,0,0), then the two
        * Vector3D objects are parallel to each other.
        *
        * <p>You can use the normalized cross product of two vertices of a
        * polygon surface with the normalized vector of the camera or eye
        * viewpoint to get a dot product. The value of the dot product can
        * identify whether a surface of a three-dimensional object is hidden
        * from the viewpoint.</p>
        *
        * @param a A second Vector3D object.
        * @returns A new Vector3D object that is perpendicular to the current
        *          Vector3D object and the Vector3D object specified as the
        *          parameter.
        */
        /**
        * @language zh_CN
        * 两个Vector3D进行叉乘 this 叉乘 a
        * 叉乘后的结果是这两条向量的垂直向量
        * @param a 求叉乘的另外一个向量
        * @returns Vector3D 返回叉乘结果向量
        * @version Egret 3.0
        * @platform Web,Native
        */
        crossProduct(a: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language en_US
        * Decrements the value of the x, y, and z elements of the current。
        * Vector3D object by the values of the x, y, and z elements of
        * specified Vector3D object. Unlike the
        * <code>Vector3D.subtract()</code> method, the
        * <code>decrementBy()</code> method changes the current Vector3D
        * object and does not return a new Vector3D object.
        *
        * @param a The Vector3D object containing the values to subtract from
        *          the current Vector3D object.
        */
        /**
        * @language zh_CN
        * 当前向量减去a向量，结果赋值给自己
        * @param a 减去的向量
        * @version Egret 3.0
        * @platform Web,Native
        */
        decrementBy(a: Vector3D): void;
        /**
        * @language en_US
        * Returns the distance between two Vector3D objects. The。
        * <code>distance()</code> method is a static method. You can use it
        * directly as a method of the Vector3D class to get the Euclidean
        * distance between two three-dimensional points.
        *
        * @param pt1 A Vector3D object as the first three-dimensional point.
        * @param pt2 A Vector3D object as the second three-dimensional point.
        * @returns The distance between two Vector3D objects.
        */
        /**
        * @language zh_CN
        * 计算两个Vector3D之间的距离
        * @param pt1 坐标1
        * @param pt2 坐标2
        * @returns number 两个Vector3D之间的距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        /**
        * @language en_US
        * If the current Vector3D object and the one specified as the。
        * parameter are unit vertices, this method returns the cosine of the
        * angle between the two vertices. Unit vertices are vertices that
        * point to the same direction but their length is one. They remove the
        * length of the vector as a factor in the result. You can use the
        * <code>normalize()</code> method to convert a vector to a unit
        * vector.
        *
        * <p>The <code>dotProduct()</code> method finds the angle between two
        * vertices. It is also used in backface culling or lighting
        * calculations. Backface culling is a procedure for determining which
        * surfaces are hidden from the viewpoint. You can use the normalized
        * vertices from the camera, or eye, viewpoint and the cross product of
        * the vertices of a polygon surface to get the dot product. If the dot
        * product is less than zero, then the surface is facing the camera or
        * the viewer. If the two unit vertices are perpendicular to each
        * other, they are orthogonal and the dot product is zero. If the two
        * vertices are parallel to each other, the dot product is one.</p>
        *
        * @param a The second Vector3D object.
        * @returns A scalar which is the dot product of the current Vector3D
        *          object and the specified Vector3D object.
        *
        */
        /**
        * @language zh_CN
        * 计算两个Vector3D的点积,返回两个Vector3D之间的夹角关系
        * @param a 另一个Vector3D
        * @returns number 返回两个Vector3D之间的夹角关系
        * @version Egret 3.0
        * @platform Web,Native
        */
        dotProduct(a: Vector3D): number;
        /**
        * @language en_US
        * @param toCompare The Vector3D object to be compared with the current
        *                  Vector3D object.
        * @param allFour   An optional parameter that specifies whether the w
        *                  property of the Vector3D objects is used in the
        *                  comparison.
        * @returns A value of true if the specified Vector3D object is equal
        *          to the current Vector3D object; false if it is not equal.
        */
        /**
        * @language zh_CN
        * 求两个Vector3D的值是否全等
        * @param toCompare 与些Vector3D进行比较
        * @param allFour 默认参数为1，是否比较w分量
        * @returns boolean 全等返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        equals(toCompare: Vector3D, allFour?: boolean): boolean;
        /**
        * @language en_US

        * Increments the value of the x, y, and z elements of the current
        * Vector3D object by the values of the x, y, and z elements of a
        * specified Vector3D object. Unlike the <code>Vector3D.add()</code>
        * method, the <code>incrementBy()</code> method changes the current
        * Vector3D object and does not return a new Vector3D object.
        *
        * @param a The Vector3D object to be added to the current Vector3D
        *          object.
        */
        /**
        * @language zh_CN
        * 当前Vector3D加等于a Vector3D，只加x y z 3个分量
        * @param a 加等a
        * @version Egret 3.0
        * @platform Web,Native
        */
        incrementBy(a: Vector3D): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromArray(d: Float32Array): void;
        /**
        * @language zh_CN
        * 当前Vector3D除分量 或者 除Vector3D
        * @param v 如果是number就是除分量 如果为Vector3D 就是除Vector3D
        * @returns Vector3D 返回自己，计算之后的结果
        * @version Egret 3.0
        * @platform Web,Native
        */
        divide(v: any): Vector3D;
        /**
        * @language en_US
        * Sets the current Vector3D object to its inverse. The inverse object
        * is also considered the opposite of the original object. The value of
        * the x, y, and z properties of the current Vector3D object is changed
        * to -x, -y, and -z.
        */
        /**
        * @language zh_CN
        * 当前Vector3D x y z 3个分量取反
        * @version Egret 3.0
        * @platform Web,Native
        */
        negate(): void;
        /**
        * @language en_US
        * Scales the line segment between(0,0) and the current point to a set
        * length.
        *
        * @param thickness The scaling value. For example, if the current
        * Vector3D object is (0,3,4), and you normalize it to
        * 1, the point returned is at(0,0.6,0.8).
        */
        /**
        * @language zh_CN
        * 当前Vector3D标准化
        * @param thickness 默认参数为1，使当前Vector3D的长度为thickness 原点(0, 0, 0)到(x, y, z)的距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        normalize(thickness?: number): void;
        /**
        * @language en_US
        * Scales the current Vector3D object by a scalar, a magnitude. The
        * Vector3D object's x, y, and z elements are multiplied by the scalar
        * number specified in the parameter. For example, if the vector is
        * scaled by ten, the result is a vector that is ten times longer. The
        * scalar can also change the direction of the vector. Multiplying the
        * vector by a negative number reverses its direction.
        *
        * @param s A multiplier (scalar) used to scale a Vector3D object.
        */
        /**
        * @language zh_CN
        * 当前Vector3D扩大s倍
        * @param s 扩大的倍数
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleBy(s: number): void;
        /**
        * @language en_US
        * Sets the members of Vector3D to the specified values
        *
        * @param xa The first element, such as the x coordinate.
        * @param ya The second element, such as the y coordinate.
        * @param za The third element, such as the z coordinate.
        */
        /**
        * @language zh_CN
        * 填充当前Vector3D的x, y, z
        * @param xa
        * @param yz
        * @param za
        * @param wz
        * @version Egret 3.0
        * @platform Web,Native
        */
        setTo(xa: number, ya: number, za: number, wa?: number): void;
        /**
        * @language en_US
        * Subtracts the value of the x, y, and z elements of the current
        * Vector3D object from the values of the x, y, and z elements of
        * another Vector3D object. The <code>subtract()</code> method does not
        * change the current Vector3D object. Instead, this method returns a
        * new Vector3D object with the new values.
        *
        * @param a The Vector3D object to be subtracted from the current
        *          Vector3D object.
        * @returns A new Vector3D object that is the difference between the
        *          current Vector3D and the specified Vector3D object.
        */
        /**
        * @language zh_CN
        * 当前Vector3D减去a Vector3D 结果返回新实例
        * @param a 减去的Vector3D
        * @param target 默认参数为null,如果当前参数为null那么就会new一个新的Vector3D返回
        * @returns Vector3D 结果返回
        * @version Egret 3.0
        * @platform Web,Native
        */
        subtract(a: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 当前Vector3D乘other Vector3D 结果返回新实例
        * @param a 相乘的Vector3D
        * @param target 如果当前参数为null那么就会new一个新的Vector3D返回
        * @returns Vector3D 结果返回
        * @version Egret 3.0
        * @platform Web,Native
        */
        multiply(other: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 当前Vector3D除以other Vector3D 结果返回新实例
        * @param a 相除的Vector3D
        * @param target 如果当前参数为null那么就会new一个新的Vector3D返回
        * @returns Vector3D 结果返回
        * @version Egret 3.0
        * @platform Web,Native
        */
        divided(other: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 计算两个Vector3D之间的线性插值，结果为当前对象
        * @param v0 Vector3D 1
        * @param v1 Vector3D 2
        * @param t 时刻
        * @version Egret 3.0
        * @platform Web,Native
        */
        lerp(v0: Vector3D, v1: Vector3D, t: number): void;
        private Dot(v0, v1);
        private OrthoNormalVectorFast(n, target);
        /**
       * @language zh_CN
       * 计算两个Vector3D之间的线性插值，结果为当前对象
       * @param lhs Vector3D 1
       * @param rhs Vector3D 2
       * @param t 时刻
       * @version Egret 3.0
       * @platform Web,Native
       */
        slerp(lhs: Vector3D, rhs: Vector3D, t: number): void;
        private Cross(lhs, rhs, target?);
        /**
        * @language zh_CN
        * 当前Vector3D以字符串形式返回
        * @returns string
        * @version Egret 3.0
        * @platform Web,Native
        */
        toString(): string;
        /**
        * @language zh_CN
        * 解析字符串为Vector3D
        * @param str 格式用空格间隔开，只解析为x,y,z
        * @version Egret 3.0
        * @platform Web,Native
        */
        parsing(str: string): void;
        /**
         * @language zh_CN
         * 是否相等
         * @param rectangle  比较的对象
         * @returns boolean 相等返回ture
         * @version Egret 3.0
         * @platform Web,Native
         */
        equal(other: Vector3D): boolean;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Rectangle
    * @classdesc
    * Rectangle 类 表示矩形
    *
    * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。
    *
    * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其它属性。
    *
    * 您可以使用 new Rectangle() 构造函数创建 Rectangle 对象。
    * @includeExample geom/Rectangle.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Rectangle {
        /**
        * @language zh_CN
        * 矩形左上角的 x 坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        x: number;
        /**
        * @language zh_CN
        * 矩形左上角的 y 坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        y: number;
        /**
        * @language zh_CN
        * 矩形的宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 矩形的高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
         * @language zh_CN
         * 创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度
         * @param height 矩形的高度
         * @version Egret 3.0
         * @platform Web,Native
         */
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
        * @language zh_CN
        * 从一个矩形拷贝数据
        * @param rect 拷贝的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyFrom(rect: Rectangle): void;
        /**
        * @language zh_CN
        * 拷贝数据到一个矩形
        * @param rect 拷贝到目标矩形
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyTo(rect: Rectangle): void;
        /**
         * @language zh_CN
         * 检测x y 是否在当前矩形内
         * @param x  x 坐标。
         * @param y  y 坐标。
         * @returns boolean 是否在当前矩形内
         * @version Egret 3.0
         * @platform Web,Native
         */
        inner(x: number, y: number): boolean;
        /**
         * @language zh_CN
         * 检测x y 是否在当前矩形内
         * @param x  x 坐标。
         * @param y  y 坐标。
         * @param lt_x  矩形左x坐标。
         * @param lt_y  矩形上y坐标。
         * @param rb_x  矩形右x坐标。
         * @param rb_y  矩形下y坐标。
         * @returns boolean 是否在当前矩形内
         * @version Egret 3.0
         * @platform Web,Native
         */
        static pointInRect(x: number, y: number, lt_x: number, lt_y: number, rb_x: number, rb_y: number): boolean;
        /**
         * @language zh_CN
         * 检测另外一个矩形是否和当前矩形等价
         * @param rectangle  比较的对象
         * @returns boolean 相等返回ture
         * @version Egret 3.0
         * @platform Web,Native
         */
        equal(rectangle: Rectangle): boolean;
        /**
         * @language zh_CN
         * 检测传入的数据构成的矩形是否和当前矩形等价
         * @param x  x坐标
         * @param y  y坐标
         * @param width  矩形宽度
         * @param height  矩形高度
         * @returns boolean 相等返回ture
         * @version Egret 3.0
         * @platform Web,Native
         */
        equalArea(x: number, y: number, width: number, height: number): boolean;
        private equalInnerArea(source, target);
        /**
        * @language zh_CN
        * 输入一个矩形和当前矩形做比较，获得交叉区域的矩形
        * @param source  比较区域
        * @param target  目标接参
        * @returns Rectangle 返回相交的区域
        * @version Egret 3.0
        * @platform Web,Native
        */
        innerArea(source: Rectangle, target: Rectangle): Rectangle;
        /**
        * @language zh_CN
        * 重置一个矩形数据
        * @param x  x坐标
        * @param y  y坐标
        * @param width  宽度
        * @param height  高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        setTo(x: number, y: number, width: number, height: number): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Quaternion
    * @classdesc
    * Quaternion类
    *
    * 定义了一个四元数表示物体在空间的旋转。
    * 四元数通常用作替代欧拉角和旋转矩阵的方式来实现平滑插值和避免万向节锁
    * 注意，这四元数类不自动保持四元数标准化。因此，在必要的时候，必须采取单位化的四元数，通过调用单位化方法
    * @includeExample geom/Quaternion.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Quaternion {
        /**
        * @language en_US
        * The x value of the quaternion.
        */
        /**
        * @language zh_CN
        * 四元数的x值.
        * @version Egret 3.0
        * @platform Web,Native
        */
        x: number;
        /**
        * @language en_US
        * The y value of the quaternion.
        */
        /**
        * @language zh_CN
        * 四元数的y值.
        * @version Egret 3.0
        * @platform Web,Native
        */
        y: number;
        /**
        * @language en_US
        * The z value of the quaternion.
        */
        /**
        * @language zh_CN
        * 四元数的z值.
        * @version Egret 3.0
        * @platform Web,Native
        */
        z: number;
        /**
        * @language en_US
        * The w value of the quaternion.
        */
        /**
        * @language zh_CN
        * 四元数的w值.
        * @version Egret 3.0
        * @platform Web,Native
        */
        w: number;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static HELP_0: Quaternion;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static HELP_1: Quaternion;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static HELP_2: Quaternion;
        /**
        * @language en_US
        * Creates a new Quaternion object.
        * @param x The x value of the quaternion.
        * @param y The y value of the quaternion.
        * @param z The z value of the quaternion.
        * @param w The w value of the quaternion.
        */
        /**
        * @language zh_CN
        * 创建一个四元数.
        * @param x
        * @param y
        * @param z
        * @param w
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(x?: number, y?: number, z?: number, w?: number);
        setTo(x?: number, y?: number, z?: number, w?: number): void;
        /**
        * @language en_US
        *
        * @returns the magnitude of the quaternion object.
        */
        /**
        * @language zh_CN
        *
        * 返回四元数的大小.
        * @param w
        * @returns number 四元数的大小.
        * @version Egret 3.0
        * @platform Web,Native
        */
        magnitude: number;
        /**
        * @private
        *
        * @returns the magnitude of the quaternion object.
        */
        fromArray(d: Float32Array): void;
        /**
        * @language en_US
        * Fills the quaternion object with the result from a multiplication of two quaternion objects.
        *
        * @param    qa    The first quaternion in the multiplication.
        * @param    qb    The second quaternion in the multiplication.
        */
        /**
        * @language zh_CN
        * 两个四元数相乘,然后结果给当调用者.
        * @param qa 第一个四元数
        * @param qb 第二个四元数
        * @version Egret 3.0
        * @platform Web,Native
        */
        multiply(qa: Quaternion, qb: Quaternion): void;
        /**
        * @language zh_CN
        * 四元数乘以一个3维向量，结果返回一个四元数
        * @param vector 相乘的向量
        * @param target 返回的结果，如果为null就会实例化一个四元数对象返回
        * @returns Quaternion 返回相乘后的结果
        * @version Egret 3.0
        * @platform Web,Native
        */
        multiplyVector(vector: Vector3D, target?: Quaternion): Quaternion;
        /**
        * @language en_US
        * Fills the quaternion object with values representing the given rotation around a vector.
        *
        * @param    axis    The axis around which to rotate
        * @param    angle    The angle in radians of the rotation.
        */
        /**
        * @language zh_CN
        * 创建一个以axis轴为中心旋转angle角度的四元数
        *
        * @param axis   旋转轴
        * @param angle  旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromAxisAngle(axis: Vector3D, angle: number): void;
        /**
        * @language zh_CN
        * 返回四元数绕轴心和角度
        *
        * @param axis 轴心
        * @returns 角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        toAxisAngle(axis: Vector3D): number;
        /**
        * @language en_US
        * Spherically interpolates between two quaternions, providing an interpolation between rotations with constant angle change rate.
        * @param qa The first quaternion to interpolate.
        * @param qb The second quaternion to interpolate.
        * @param t The interpolation weight, a value between 0 and 1.
        */
        /**
        * @language zh_CN
        * 两个四元数之间球形插值，插值之间提供旋转恒定角变化率。
        *
        * @param qa 四元数1
        * @param qb 四元数2
        * @param t 插值时刻
        * @version Egret 3.0
        * @platform Web,Native
        */
        slerp(qa: Quaternion, qb: Quaternion, t: number): void;
        /**
        * @language en_US
        * Linearly interpolates between two quaternions.
        * @param qa The first quaternion to interpolate.
        * @param qb The second quaternion to interpolate.
        * @param t The interpolation weight, a value between 0 and 1.
        */
        /**
        * @language zh_CN
        * 两个四元数之间的线性插值
        *
        * @param qa 四元数1
        * @param qb 四元数2
        * @param t 插值时刻
        * @version Egret 3.0
        * @platform Web,Native
        */
        lerp(qa: Quaternion, qb: Quaternion, t: number): void;
        /**
        * @language en_US
        * Fills the quaternion object with values representing the given euler rotation.
        *
        * @param    ax        The angle in radians of the rotation around the ax axis.
        * @param    ay        The angle in radians of the rotation around the ay axis.
        * @param    az        The angle in radians of the rotation around the az axis.
        */
        /**
        * @language zh_CN
        * 用数值表示给定的欧拉旋转填充四元数对象。
        *
        * @param ax x轴旋转角度
        * @param ay y轴旋转角度
        * @param az z轴旋转角度
        * @returns Quaternion 四元数对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromEulerAngles(ax: number, ay: number, az: number): Quaternion;
        /**
        * @language en_US
        * Fills a target Vector3D object with the Euler angles that form the rotation represented by this quaternion.
        * @param target An optional Vector3D object to contain the Euler angles. If not provided, a new object is created.
        * @returns The Vector3D containing the Euler angles.
        */
        /**
        * @language zh_CN
        * 把四元数转成欧拉角返回
        *
        * @param target 默认参数为null，转成的欧拉返回值，如果为null就新建一个对象返回
        * @retruns Vector3D 转成的欧拉返回值
        * @version Egret 3.0
        * @platform Web,Native
        */
        toEulerAngles(target?: Vector3D): Vector3D;
        /**
        * @language en_US
        * Normalises the quaternion object.
        */
        /**
        * @language zh_CN
        * 单位化四元数
        * param val 单位系数，默认为1
        * @version Egret 3.0
        * @platform Web,Native
        */
        normalize(val?: number): void;
        /**
        * @language en_US
        * Used to trace the values of a quaternion.
        *
        * @returns A string representation of the quaternion object.
        */
        /**
        * @language zh_CN
        * 以字符串形式返回四元数的值
        * @returns string
        * @version Egret 3.0
        * @platform Web,Native
        */
        toString(): string;
        /**
        * @language en_US
        * Converts the quaternion to a Matrix3D object representing an equivalent rotation.
        * @param target An optional Matrix3D container to store the transformation in. If not provided, a new object is created.
        * @returns A Matrix3D object representing an equivalent rotation.
        */
        /**
        * @language zh_CN
        * 把一个四元数转换成矩阵
        * @param target 返回转换后的矩阵，如果为null就新建一个对象返回
        * @returns  Matrix4_4 返回转换后的矩阵
        * @see egret3d.Matrix4_4
        * @version Egret 3.0
        * @platform Web,Native
        */
        toMatrix3D(target?: Matrix4_4): Matrix4_4;
        /**
        * @language en_US
        * Extracts a quaternion rotation matrix out of a given Matrix3D object.
        * @param matrix The Matrix3D out of which the rotation will be extracted.
        */
        /**
        * @language zh_CN
        * 用一个旋转矩阵生成四元数
        * @param matrix 旋转矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromMatrix(matrix: Matrix4_4): void;
        /**
        * @language zh_CN
        * 返回一个把当前四元数取逆后的四元数
        * @param target 默认参数为null,如果当前参数为null那么就会new一个新的四元数对象返回
        * @returns Quaternion 四元数
        * @version Egret 3.0
        * @platform Web,Native
        */
        inverse(target?: Quaternion): Quaternion;
        /**
        * @language en_US
        * Clones the quaternion.
        * @returns An exact duplicate of the current Quaternion.
        */
        /**
        * @language zh_CN
        * 克隆一个四元数
        * @returns Quaternion 当前四元数复制后返回新对象.
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Quaternion;
        /**
        * @language en_US
        * Rotates a point.
        * @param vector The Vector3D object to be rotated.
        * @param target An optional Vector3D object that will contain the rotated coordinates. If not provided, a new object will be created.
        * @returns A Vector3D object containing the rotated point.
        */
        /**
        * @language zh_CN
        * 旋转一个3量坐标点
        * @param vector 被旋转的对象
        * @param target 默认参数为null，旋转后的坐标对象。如果为null，将创建一个新的对象
        * @returns Vector3D 返回旋转后的坐标对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        transformVector(vector: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 计算出一个方向变换到另一个方向的四元数
        * @param fromDirection 初始方向
        * @param toDirection 变换后的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromToRotation(fromDirection: Vector3D, toDirection: Vector3D): void;
        /**
        * @language zh_CN
        * 计算出一个方向变换到另一个方向的四元数
        * @param fromDirection 初始方向
        * @param toDirection 变换后的方向
        * @param target 计算出的四元数 默认为null 结果会返回
        * @returns Quaternion 计算出的四元数 如果 target为null 就会创建新实例返回
        * @version Egret 3.0
        * @platform Web,Native
        */
        static fromToRotation(fromDirection: Vector3D, toDirection: Vector3D, target?: Quaternion): Quaternion;
        /**
        * @language en_US
        * Copies the data from a quaternion into this instance.
        * @param q The quaternion to copy from.
        */
        /**
        * @language zh_CN
        * 将数据从四元数复制到该实例
        * @param q 被复制的四元数对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyFrom(q: Quaternion): void;
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.Orientation3D
     * @classdesc
     * 定义 Orientation3D 常量。</p>
     * Matrix4_4.decompose 会分 axisAngle、eulerAngles、quaternion这3种类型进行分解。</p>
     * 比如:</p>
     <pre>
     matrix.decompose(Orientation3D.QUATERNION)
     </pre>
     *
     * @see egret3d.Matrix4_4
     * @see egret3d.Quaternion
     *
     * @version Egret 3.0
     * @platform Web,Native
     */
    class Orientation3D {
        /**
        * @language zh_CN
        * 按轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        static AXIS_ANGLE: string;
        /**
        * @language zh_CN
        * 按欧拉角旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        static EULER_ANGLES: string;
        /**
        * @language zh_CN
        * 四元数旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        static QUATERNION: string;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Plane3D
    * @classdesc
    * Plane3D 类 3D空间中的平面表示数据
    * 由a,b,c,d4个分量组成 在三维空间中定义了一个平面 Ax + By + Cz + D = 0
    * @includeExample geom/Plane3D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Plane3D {
        /**
         * @language en_US
         * The A coefficient of this plane. (Also the x dimension of the plane normal)
         */
        /**
        * @language zh_CN
        * 平面中的a分量
        * @version Egret 3.0
        * @platform Web,Native
        */
        a: number;
        /**
         * @language en_US
         * The B coefficient of this plane. (Also the y dimension of the plane normal)
         */
        /**
        * @language zh_CN
        * 平面中的b分量
        * @version Egret 3.0
        * @platform Web,Native
        */
        b: number;
        /**
         * @language en_US
         * The C coefficient of this plane. (Also the z dimension of the plane normal)
         */
        /**
        * @language zh_CN
        * 平面中的c分量
        * @version Egret 3.0
        * @platform Web,Native
        */
        c: number;
        /**
         * @language en_US
         * The D coefficient of this plane. (Also the inverse dot product between normal and point)
         */
        /**
        * @language zh_CN
        * 平面中的d分量
        * @version Egret 3.0
        * @platform Web,Native
        */
        d: number;
        /**
         * @private
         */
        static ALIGN_ANY: number;
        /**
         * @private
         */
        static ALIGN_XY_AXIS: number;
        /**
         * @private
         */
        static ALIGN_YZ_AXIS: number;
        /**
         * @private
         */
        static ALIGN_XZ_AXIS: number;
        /**
         * @language en_US
         * Create a Plane3D with ABCD coefficients
         */
        /**
        * @language zh_CN
        * 创建一个平面实例
        * @param a
        * @param b
        * @param c
        * @param d
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(a?: number, b?: number, c?: number, d?: number);
        /**
        * @language zh_CN
        * 填充平面的各分量的值
        * @param a
        * @param b
        * @param c
        * @param d
        * @version Egret 3.0
        * @platform Web,Native
        */
        setTo(a?: number, b?: number, c?: number, d?: number): void;
        /**
         * @language en_US
         * Fills this Plane3D with the coefficients from 3 points in 3d space.
         * @param p0 Vector3D
         * @param p1 Vector3D
         * @param p2 Vector3D
         */
        /**
        * @language zh_CN
        * 由3个坐标来创建一个3d平面
        * @param p0 Vector3D
        * @param p1 Vector3D
        * @param p2 Vector3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromPoints(p0: Vector3D, p1: Vector3D, p2: Vector3D): void;
        /**
         * @language en_US
         * Fills this Plane3D with the coefficients from the plane's normal and a point in 3d space.
         * @param normal Vector3D
         * @param point  Vector3D
         */
        /**
        * @language zh_CN
        * 由一条normal向量和一个坐标创建一个3d平面
        * @param normal Vector3D
        * @param point  Vector3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromNormalAndPoint(normal: Vector3D, point: Vector3D): void;
        /**
         * @language en_US
         * Normalize this Plane3D
         * @returns Plane3D This Plane3D.
         */
        /**
        * @language zh_CN
        * 单位化3d平面
        * @returns number 返回平面长度
        * @version Egret 3.0
        * @platform Web,Native
        */
        normalize(): number;
        /**
         * @language en_US
         * Returns the signed distance between this Plane3D and the point p.
         * @param p Vector3D
         * @returns Number
         */
        /**
        * @language zh_CN
        * 计算3d平面到点p的距离
        * @param p Vector3D
        * @returns number 返回计算后的距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        distance(p: Vector3D): number;
        /**
         * @language en_US
         * Classify a point against this Plane3D. (in front, back or intersecting)
         * @param p Vector3D
         * @param epsilon
         * @returns PlaneClassification.FRONT在平面正面
         * PlaneClassification.BACK在平面背面面
         * PlaneClassification.INTERSECT在平面上
         */
        /**
        * @language zh_CN
        * 计算3d平面和点p的空间关系
        * @param p Vector3D
        * @param epsilon 相对偏移值
        * @returns number int Plane3.FRONT or Plane3D.BACK or Plane3D.INTERSECT
        * @version Egret 3.0
        * @platform Web,Native
        */
        classifyPoint(p: Vector3D, epsilon?: number): number;
        /**
        * @language zh_CN
        * 当前Plane3D以字符串形式返回
        * @returns string
        * @version Egret 3.0
        * @platform Web,Native
        */
        toString(): string;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Matrix4_4
    * @classdesc
    *
    * Matrix4_4 类表示一个转换矩阵，该矩阵确定三维 (3D) 显示对象的位置和方向。
    * 该矩阵可以执行转换功能，包括平移（沿 x、y 和 z 轴重新定位）、旋转和缩放（调整大小）.
    * Matrix4_4 类还可以执行透视投影，这会将 3D 坐标空间中的点映射到二维 (2D) 视图.
    * 单一矩阵可以将多个转换组合在一起，并一次性对 3D 显示对象应用这些转换.
    * 例如，可以将一个矩阵应用于 3D 坐标，以便依次执行旋转和平移.
    *
    * @includeExample geom/Matrix4_4.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Matrix4_4 {
        /**
        * @private
        */
        static helpMatrix: Matrix4_4;
        static helpMatrix2: Matrix4_4;
        /**
        * @language zh_CN
        * 一个由 16 个数字组成的矢量，其中，每四个元素可以是 4x4 矩阵的一行或一列
        * @version Egret 3.0
        * @platform Web,Native
        */
        rawData: Float32Array;
        private length;
        private rowLength;
        /**
        * @language zh_CN
        * 构造
        * @param datas {number[16]}
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(datas?: Float32Array);
        /**
        * @language zh_CN
        * 生成一个注视目标的矩阵.
        * @param eye 眼睛的位置.
        * @param at 目标的位置.
        * @param up 向上的方向.
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAt(eye: Vector3D, at: Vector3D, up?: Vector3D): void;
        /**
        * @language zh_CN
        * 矩阵相乘.
        * @param mat4 相乘的矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        multiply(mat4: Matrix4_4): void;
        /**
        * @private
        * @language zh_CN
        */
        perspectiveB(fov: number, aspect: number, near: number, far: number): Matrix4_4;
        /**
        * @private
        * @language zh_CN
        */
        frustum(l: number, r: number, b: number, t: number, n: number, f: number): Matrix4_4;
        /**
        * @language zh_CN
        * 生成一个透视投影矩阵.
        * @param fovy 观察时y 轴方向的角度，就是观察范围夹角。
        * @param aspect 横纵比，在视空间宽度除以高度.
        * @param zn 近裁剪面位置Z值.
        * @param zf 远裁剪面位置Z值.
        * @version Egret 3.0
        * @platform Web,Native
        */
        perspective(fovy: number, aspect: number, zn: number, zf: number): void;
        /**
        * @language zh_CN
        * 生成一个透视投影矩阵.
        * @param w 屏幕的宽度。
        * @param h 屏幕的高度.
        * @param zn 近裁剪面位置Z值.
        * @param zf 远裁剪面位置Z值.
        * @version Egret 3.0
        * @platform Web,Native
        */
        ortho(w: number, h: number, zn: number, zf: number): void;
        /**
        * @language zh_CN
        * 生成一个透视投影矩阵.
        * @param l 观察时X轴最小值.
        * @param r 观察时X轴最大值.
        * @param b 观察时Y轴最小值。
        * @param t 观察时Y轴最大值.
        * @param zn 近裁剪面位置Z值.
        * @param zf 远裁剪面位置Z值.
        * @version Egret 3.0
        * @platform Web,Native
        */
        orthoOffCenter(l: number, r: number, b: number, t: number, zn: number, zf: number): void;
        /**
        * @language zh_CN
        * 计算出一个方向变换到另一个方向的旋转矩阵
        * @param fromDirection 初始方向
        * @param toDirection 变换后的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromToRotation(fromDirection: Vector3D, toDirection: Vector3D): void;
        /**
        * @language zh_CN
        * 计算出一个方向变换到另一个方向的旋转矩阵
        * @param fromDirection 初始方向
        * @param toDirection 变换后的方向
        * @param target 计算出的旋转矩阵 默认为null 结果会返回
        * @returns Matrix4_4 计算出的旋转矩阵 如果 target为null 就会创建新实例返回
        * @version Egret 3.0
        * @platform Web,Native
        */
        static fromToRotation(fromDirection: Vector3D, toDirection: Vector3D, target?: Matrix4_4): Matrix4_4;
        /**
        * @language zh_CN
        * 通过将当前 Matrix4_4 对象与另一个 Matrix4_4 对象相乘来前置一个矩阵
        * @param lhs 目标矩阵.
        * @version Egret 3.0
        * @platform Web,Native
        */
        append(lhs: Matrix4_4): void;
        /**
        * @language zh_CN
        * 矩阵相加.
        * @param lhs 目标矩阵.
        * @returns Matrix4_4 相加后的结果.
        * @version Egret 3.0
        * @platform Web,Native
        */
        add(lhs: Matrix4_4): Matrix4_4;
        /**
        * @language zh_CN
        * 矩阵相减.
        * @param lhs 目标矩阵.
        * @returns Matrix4_4 相加减的结果.
        * @version Egret 3.0
        * @platform Web,Native
        */
        sub(lhs: Matrix4_4): Matrix4_4;
        /**
        * @language zh_CN
        * 矩阵乘分量.
        * @param v 该矩阵会乘以这个值
        * @returns Matrix4_4 返回一个相乘后的结果 矩阵.
        * @version Egret 3.0
        * @platform Web,Native
        */
        mult(v: number): Matrix4_4;
        private static position_000;
        private static scale_111;
        /**
        * @language zh_CN
        * 创建一个欧拉旋转矩阵.
        * @param x 绕x轴旋转角度.
        * @param y 绕y轴旋转角度.
        * @param z 绕z轴旋转角度.
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotation(x: number, y: number, z: number): void;
        /**
       * @language zh_CN
       * 给当前矩阵追加一个方向角旋转 (按axis轴旋转degrees角度创建出来的矩阵)
       * @param degrees 旋转角度.
       * @param axis 绕axis轴旋转角度
       * @version Egret 3.0
       * @platform Web,Native
       */
        appendRotation(degrees: number, axis: Vector3D): void;
        /**
        * @language zh_CN
        * 根据坐标轴和旋转角，创建矩阵 (按axis轴旋转degrees角度创建出来的矩阵)
        * @param degrees 旋转角度.
        * @param axis 绕axis轴旋转角度.axis需要指定为x/y/z之间的一个轴的朝向
        * @version Egret 3.0
        * @platform Web,Native
        */
        createByRotation(degrees: number, axis: Vector3D): void;
        /**
        * @language zh_CN
        * 追加三轴缩放值
        * @param xScale x轴缩放
        * @param yScale y轴缩放
        * @param zScale z轴缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        appendScale(xScale: number, yScale: number, zScale: number): void;
        /**
        * @language zh_CN
        * 生成一个缩放矩阵，其他的属性会被重置
        * @param xScale x轴缩放
        * @param yScale y轴缩放
        * @param zScale z轴缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        createByScale(xScale: number, yScale: number, zScale: number): void;
        /**
        * @language zh_CN
        * 加上一个平移矩阵
        * @param x x轴坐标
        * @param y y轴坐标
        * @param z z轴坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        appendTranslation(x: number, y: number, z: number): void;
        /**
        * @language zh_CN
        * 返回一个当前矩阵的克隆矩阵
        * @returns Matrix4_4 克隆后的矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Matrix4_4;
        /**
        * @language zh_CN
        * 给当前矩阵其中一行赋值
        * @param row 拷贝的行
        * @param vector3D 拷贝的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyRowFrom(row: number, vector3D: Vector3D): void;
        /**
        * @language zh_CN
        * 拷贝矩阵中的其中一行 把值存在vector3D.
        * @param row 拷贝的行
        * @param vector3D 拷贝存值目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyRowTo(row: number, vector3D: Vector3D): void;
        /**
        * @language zh_CN
        * 把一个矩阵的值赋给当前矩阵.
        * @param sourceMatrix3D 源矩阵.
        * @returns 返回当前矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyFrom(sourceMatrix3D: Matrix4_4): Matrix4_4;
        /**
        * @language zh_CN
        * 把一个 float 数组赋值给当前矩阵.
        * @param vector 源数组.
        * @param index 从数组的index 开始copy.
        * @param transpose 是否转置当前矩阵.
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyRawDataFrom(vector: Float32Array, index?: number, transpose?: boolean): void;
        /**
        * @language zh_CN
        * 把当前矩阵的值拷贝给一个 float 数组.
        * @param vector 目标数组.
        * @param index 从数组的index 开始copy.
        * @param transpose 是否转置当前矩阵.
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyRawDataTo(vector: Float32Array, index?: number, transpose?: boolean): void;
        /**
        * @language zh_CN
        * 给当前矩阵的某一列 赋值
        * @param col 列
        * @param vector3D 值来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyColFrom(col: number, vector3D: Vector3D): void;
        /**
        * @language zh_CN
        * 拷贝当前矩阵的某一列
        * @param col 列
        * @param vector3D 拷贝目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyColTo(col: number, vector3D: Vector3D): void;
        /**
        * @language zh_CN
        * 拷贝当前矩阵
        * @param dest 拷贝目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyToMatrix3D(dest: Matrix4_4): void;
        private static prs;
        /**
        * @language zh_CN
        * 分解当前矩阵
        * @param orientationStyle 分解类型 默认为 Orientation3D.EULER_ANGLES
        * @see egret3d.Orientation3D.AXIS_ANGLE
        * @see egret3d.Orientation3D.EULER_ANGLES
        * @see egret3d.Orientation3D.QUATERNION
        * @returns Vector3D[3] pos rot scale
        * @version Egret 3.0
        * @platform Web,Native
        */
        decompose(orientationStyle?: string, target?: Vector3D[]): Vector3D[];
        /**
        * @language zh_CN
        * 当前矩阵变换一个向量
        * @param v 要变换的向量
        * @param target 默认为 null 如果当前参数为null那么就会new一个新的Vector3D返回
        * @returns Vector3D 变换后的向量
        * @version Egret 3.0
        * @platform Web,Native
        */
        deltaTransformVector(v: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 单位化当前矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        identity(): void;
        /**
        * @language zh_CN
        * 填充当前矩阵
        * @param value 填充的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        fill(value: number): void;
        /**
        * @language zh_CN
        * 当前矩阵求逆
        * @version Egret 3.0
        * @platform Web,Native
        */
        invers33(): void;
        /**
        * private
        */
        static transpose(matrix: Matrix4_4, result: Matrix4_4): Matrix4_4;
        /**
        * private
        */
        static inverse(matrix: Matrix4_4, result: Matrix4_4): Matrix4_4;
        /**
        * @language zh_CN
        * 当前矩阵求逆
        * @returns boolean 是否能求逆
        * @version Egret 3.0
        * @platform Web,Native
        */
        invert(): boolean;
        /**
        * @language zh_CN
        * 生成一个变换矩阵
        * @param pos  位移
        * @param scale 缩放
        * @param rot 旋转的四元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        makeTransform(pos: Vector3D, scale: Vector3D, rot: Quaternion): void;
        /**
        * @language zh_CN
        * 生成一个变换矩阵
        * @param components Vector3D[3] 位移 旋转 缩放
        * @returns boolean 生成是否成功
        * @version Egret 3.0
        * @platform Web,Native
        */
        recompose(components: Vector3D[]): boolean;
        /**
        * @language zh_CN
        * 用当前矩阵变换一个3D向量
        * @param v 变换的向量
        * @param target 如果当前参数为null那么就会new一个新的Vector3D返回
        * @returns Vector3D 变换后的向量
        * @version Egret 3.0
        * @platform Web,Native
        */
        transformVector(v: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 用当前矩阵变换一个3D向量
        * @param v 变换的向量  w 会进行计算
        * @param target 如果当前参数为null那么就会new一个新的Vector3D返回
        * @returns Vector3D 变换后的向量
        * @version Egret 3.0
        * @platform Web,Native
        */
        transformVector4(v: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 用当前矩阵变换一个3D向量 不处理位移
        * @param v 变换的向量
        * @param target 如果当前参数为null那么就会new一个新的Vector3D返回
        * @returns Vector3D 变换后的向量
        * @version Egret 3.0
        * @platform Web,Native
        */
        mat3TransformVector(v: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 用当前矩阵变换一个3D平面
        * @param plane 变换的平面
        * @returns Plane3D 变换后的平面
        * @version Egret 3.0
        * @platform Web,Native
        */
        transformPlane(plane: Plane3D): Plane3D;
        /**
        * @language zh_CN
        * 当前矩阵转置
        * @version Egret 3.0
        * @platform Web,Native
        */
        transpose(): void;
        /**
        * @language zh_CN
        * 生成一个(以x,y,z为中心轴旋转degrees角度)的矩阵
        * @param x 中心轴的x
        * @param y 中心轴的y
        * @param z 中心轴的z
        * @param degrees 旋转角度
        * @returns Matrix4_4 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static getAxisRotation(x: number, y: number, z: number, degrees: number): Matrix4_4;
        /**
        * @language zh_CN
        * 返回矩阵行列式
        * @returns number 行列式值
        * @version Egret 3.0
        * @platform Web,Native
        */
        determinant: number;
        /**
        * @language zh_CN
        * 返回矩阵位移
        *
        * @returns Vector3D 位移
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置矩阵位移
        *
        * @param value 位移
        * @version Egret 3.0
        * @platform Web,Native
        */
        position: Vector3D;
        /**
        * @language zh_CN
        * 返回矩阵缩放
        *
        * @returns Vector3D 缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        scale: Vector3D;
        /**
        * @language zh_CN
        * 以字符串返回矩阵的值
        *
        * @returns string 字符
        * @version Egret 3.0
        * @platform Web,Native
        */
        toString(): string;
        /**
        * @language zh_CN
        * 求两个矩阵之间的插值
        * @param m0 矩阵0
        * @param m1 矩阵1
        * @param t 时间差 0.0 - 1.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        lerp(m0: Matrix4_4, m1: Matrix4_4, t: number): void;
        /**
        * @language zh_CN
        * 求矩阵在各个轴上缩放的最大值
        * @version Egret 4.0
        * @platform Web,Native
        */
        getMaxScaleOnAxis(): number;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.PlaneClassification
     * @classdesc
     * 定义 PlaneClassification 常量
     * @version Egret 3.0
     * @platform Web,Native
     */
    class PlaneClassification {
        /**
        * @language zh_CN
        * 背面
        * @version Egret 3.0
        * @platform Web,Native
        */
        static BACK: number;
        /**
        * @language zh_CN
        * 正面
        * @version Egret 3.0
        * @platform Web,Native
        */
        static FRONT: number;
        /**
        * @language zh_CN
        * 在法线朝上的一面
        * @version Egret 3.0
        * @platform Web,Native
        */
        static IN: number;
        /**
        * @language zh_CN
        * 在法线朝下的一面
        * @version Egret 3.0
        * @platform Web,Native
        */
        static OUT: number;
        /**
        * @language zh_CN
        * 相交
        * @version Egret 3.0
        * @platform Web,Native
        */
        static INTERSECT: number;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.MathUtil
    * @classdesc
    * 可使用 MathUtil 类 进行3d矩阵的计算
    * @includeExample geom/MathUtil.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class MathUtil {
        /**
        * @language zh_CN
        * 1弧度为多少角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        static RADIANS_TO_DEGREES: number;
        /**
        * @language zh_CN
        * 1角度为多少弧度
        * @version Egret 3.0
        * @platform Web,Native
        */
        static DEGREES_TO_RADIANS: number;
        /**
        * @language zh_CN
        * 整型最大值
        * @version Egret 3.0
        * @platform Web,Native
        */
        static MAX_VALUE: number;
        /**
        * @language zh_CN
        * 整型最小值
        * @version Egret 3.0
        * @platform Web,Native
        */
        static MIN_VALUE: number;
        /**
        * @private
        * 1角度为多少弧度
        * @version Egret 3.0
        * @platform Web,Native
        */
        static RAW_DATA_CONTAINER: Float32Array;
        /**
        * @private
        */
        static CALCULATION_MATRIX: Matrix4_4;
        /**
        * @private
        */
        static CALCULATION_QUATERNION: Quaternion;
        /**
        * @private
        */
        static CALCULATION_VECTOR3D: Vector3D;
        /**
        * @private
        */
        static CALCULATION_VECTOR3D_0: Vector3D;
        /**
        * @private
        */
        static CALCULATION_VECTOR3D_1: Vector3D;
        /**
        * @private
        */
        static CALCULATION_VECTOR3D_2: Vector3D;
        /**
        * @private
        * @language zh_CN
        * 两个Float是否相等
        * @param f0 float
        * @param f1 float
        * @returns boolean 是否相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        static FloatEqual(f0: number, f1: number): boolean;
        /**
        * @private
        * @language zh_CN
        * 四元数转矩阵
        * @param quarternion 源四元数
        * @param m 目标矩阵 默认为null 如果为null将会new 一个Matrix4_4
        * @returns 返回转出矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static quaternion2matrix(quarternion: Quaternion, m?: Matrix4_4): Matrix4_4;
        /**
        * @private
        * @language zh_CN
        * 得到矩阵朝前的方向
        * @param m 源矩阵
        * @param v 返回的方向 可为null 如果为null将会new 一个Vector3D
        * @returns Vector3D 返回方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        static getForward(m: Matrix4_4, v?: Vector3D): Vector3D;
        /**
        * @private
        * @language zh_CN
        * 得到矩阵朝上的方向
        * @param m 源矩阵
        * @param v 返回的方向 可为null 如果为null将会new 一个Vector3D
        * @returns Vector3D 返回方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        static getUp(m: Matrix4_4, v?: Vector3D): Vector3D;
        /**
        * @private
        * @language zh_CN
        * 得到矩阵朝右的方向
        * @param m 源矩阵
        * @param v 返回的方向 可为null 如果为null将会new 一个Vector3D
        * @returns Vector3D 返回方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        static getRight(m: Matrix4_4, v?: Vector3D): Vector3D;
        /**
        * @private
        * @language zh_CN
        * 比较两个矩阵是否相同
        * @param m1 矩阵1
        * @param m2 矩阵2
        * @returns boolean 相同返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        static compare(m1: Matrix4_4, m2: Matrix4_4): boolean;
        /**
        * @private
        * @language zh_CN
        * 得到平面的反射矩阵
        * @param plane 反射的面
        * @param target 计算返回的矩阵 可为null 如果为null将会new 一个Matrix4_4
        * @returns Matrix4_4 返回计算的结果
        * @version Egret 3.0
        * @platform Web,Native
        */
        static reflection(plane: Plane3D, target?: Matrix4_4): Matrix4_4;
        /**
        * @private
        * @language zh_CN
        * 得到矩阵的平移
        * @param transform 计算的矩阵
        * @param result 计算返回平移坐标 可为null 如果为null将会new 一个Vector3D
        * @returns Vector3D 返回平移坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        static getTranslation(transform: Matrix4_4, result?: Vector3D): Vector3D;
        /**
        * @private
        * @language zh_CN
        * 把一个值固定在一个范围之内
        * @param value 当前判定的值
        * @param min_inclusive 最小取值
        * @param max_inclusive 最大取值
        * @returns number 计算后的结果
        * @version Egret 3.0
        * @platform Web,Native
        */
        static clampf(value: number, min_inclusive: number, max_inclusive: number): number;
        /**
        * @private
        */
        static ScreenToPosition(value: number, offset: number, max: number): number;
        /**
        * @private
        */
        static PositionToScreen(value: number, offset: number, max: number): number;
        /**
        * @private
        */
        static mix(value0: number, value1: number, t: number): number;
        private static _tempVector;
        /**
        * @private
        */
        static calcDegree(quat: Quaternion, angleVector: Vector3D): void;
        private static clampAngle(angle);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Ray
    * @classdesc
    * 射线是指直线上的一点和它一旁的部分所组成的直线，射线有且仅有一个端点，无法测量，由一个原点,和一个方向构成
    * 用于检测射线,也可用于鼠标拣选场景中的模型
    *
    * @see egret3d.Picker
    * @see egret3d.Vector3D
    *
    * @includeExample geom/Ray.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Ray {
        protected static v0: Vector3D;
        protected static v1: Vector3D;
        protected static v2: Vector3D;
        protected static v3: Vector3D;
        protected static v4: Vector3D;
        /**
        * @language zh_CN
        * 射线原点
        * @version Egret 3.0
        * @platform Web,Native
        */
        origin: Vector3D;
        /**
        * @language zh_CN
        * 射线方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        dir: Vector3D;
        /**
        * @language zh_CN
        * constructor
        * @origin 射线原点
        * @direction 射线方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(origin?: Vector3D, direction?: Vector3D);
        /**
        * @language zh_CN
        * 计算一个三角形和一个射线的交点
        * @param v0 三角形的第一个顶点
        * @param v1 三角形的第二个顶点
        * @param v2 三角形的第三个顶点
        * @param ret t(交点到射线起始点的距离) u(交点在v1-v0上的投影的位置) v(交点在v1-v2上的投影的位置, 交点为ret=v0+pU*(v1-v0)+pV*(v2-v0))
        * @returns boolean 相交返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        IntersectTriangle(v0: Vector3D, v1: Vector3D, v2: Vector3D, ret?: Array<number>): boolean;
        protected static transformCenter: Vector3D;
        /**
        * @language zh_CN
        * 计算射线是否和球相交
        * @param center 球中心点
        * @param radius 球的半径
        * @param ret 相交返回 数据
        * @param transform 是否要变换
        * @returns number[] 相交返回 数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        IntersectSphere(center: Vector3D, radius: number, ret?: number[], transform?: Matrix4_4): number[];
        /**
        * @language zh_CN
        * 检测射线相交包围盒
        * @param bound 检测的包围盒
        * @param result 相交数据 默认为null
        * @returns PickResult 相交返回PickResult 对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        IntersectBound(bound: Bound, result?: PickResult): PickResult;
        /**
        * @language zh_CN
        * 检测射线相交模型
        * @param renderItem 检测的模型
        * @param uv_offset 顶点uv数据偏移 可以为-1
        * @param result 数据返回
        * @returns boolean 相交返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        IntersectMeshEx(renderItem: IRender, uv_offset: number, result: PickResult): boolean;
        protected static modletriangle: Vector3D[];
        protected static uvarray: Vector3D[];
        protected static triangle: Vector3D[];
        protected static ret: number[];
        protected static pos: Vector3D;
        protected static uv: Point;
        /**
        * @language zh_CN
        * 检测射线相交模型
        * @param verticesData 检测的模型的顶点数据
        * @param indexData 检测的模型的索引数据
        * @param offset 每个顶点的大小
        * @param faces 模型面数
        * @param uv_offset 顶点uv数据偏移 可以为-1
        * @param mMat 顶点的世界变换矩阵
        * @param result 数据返回
        * @returns boolean 相交返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        IntersectMesh(verticesData: Float32Array, indexData: Uint16Array, offset: number, faces: number, uv_offset: number, mMat: Matrix4_4, result: PickResult): boolean;
        private invViewMat;
        /**
        * @language zh_CN
        * 计算摄像机的射线
        * @param width 视口宽
        * @param height 视口高
        * @param modelMtx 相机世界矩阵
        * @param projMtx 相机投影矩阵
        * @param x 鼠标x
        * @param y 鼠标y
        * @version Egret 3.0
        * @platform Web,Native
        */
        CalculateAndTransformRay(width: number, height: number, modelMtx: Matrix4_4, projMtx: Matrix4_4, x: number, y: number): void;
        /**
        * @language zh_CN
        * 射线重置
        * @version Egret 3.0
        * @platform Web,Native
        */
        reset(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Color
    * @classdesc
    * 可使用 Color 类调整显示对象的颜色值
    * 使用的时候需要区分当前的值是0-255之间，还是0-1之间
    * @includeExample geom/Color.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Color {
        /**
        * @language zh_CN
        * alpha
        * @version Egret 3.0
        * @platform Web,Native
        */
        a: number;
        /**
        * @language zh_CN
        * red
        * @version Egret 3.0
        * @platform Web,Native
        */
        r: number;
        /**
        * @language zh_CN
        * green
        * @version Egret 3.0
        * @platform Web,Native
        */
        g: number;
        /**
        * @language zh_CN
        * blue
        * @version Egret 3.0
        * @platform Web,Native
        */
        b: number;
        /**
        * @language zh_CN
        * 返回白色 new Color(255, 255, 255, 255)
        * @retruns Color 白色
        * @version Egret 3.0
        * @platform Web,Native
        */
        static white(): Color;
        /**
        * @language zh_CN
        * 返回黑色 new Color(0, 0, 0, 255)
        * @retrun Color 黑色
        * @version Egret 3.0
        * @platform Web,Native
        */
        static black(): Color;
        /**
        * @language zh_CN
        * 返回白色 new Color(255, 0, 0, 255)
        * @retrun 白色
        * @version Egret 3.0
        * @platform Web,Native
        */
        static red(): Color;
        /**
        * @language zh_CN
        * 返回绿色 new Color(0, 255, 0, 255)
        * @retrun 绿色
        * @version Egret 3.0
        * @platform Web,Native
        */
        static green(): Color;
        /**
        * @language zh_CN
        * 返回蓝色 new Color(0, 0, 255, 255)
        * @retruns 蓝色
        * @version Egret 3.0
        * @platform Web,Native
        */
        static blue(): Color;
        /**
        * @language zh_CN
        * 返回Vector3D格式的颜色数据
        * @param color 颜色数据
        * @param colorFormat 指定的颜色格式
        * @param target 传入的Vector3D对象，如果为null，会自动创建一个用于返回
        * @retruns 返回Vector3D格式的颜色数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        static getColor(color: number, colorFormat?: ContextConfig, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 将rgba四个通道，分离过的数据合并为一个颜色数据
        * @param r red通道
        * @param g green通道
        * @param b blue通道
        * @param a alpha通道
        * @retruns number 返回颜色数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        static RGBAToColor(r: number, g: number, b: number, a: number): number;
        /**
        * @language zh_CN
        * 创建一个Color对象
        * @param r red
        * @param g green
        * @param b blue
        * @param a alpha
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(r?: number, g?: number, b?: number, a?: number);
        /**
        * @language zh_CN
        * 以number值返加颜色
        * @param colorFormat 格式
        * @returns number 颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        getColor(colorFormat?: number): number;
        /**
        * @language zh_CN
        * 颜色取插值
        * @param c0 颜色1
        * @param c1 颜色2
        * @param t (0.0-1.0)
        * @version Egret 3.0
        * @platform Web,Native
        */
        lerp(c0: Color, c1: Color, t: number): void;
        /**
         * @language zh_CN
         * 拷贝颜色值
         * @param src Color 被拷贝对象颜色
         * @version Egret 3.0
         * @platform Web,Native
         */
        copyFrom(src: Color): void;
        /**
         * @language zh_CN
         * 设置颜色值
         * @param a Alpha
         * @param r Red
         * @param g Green
         * @param b Blue
         * @version Egret 3.0
         * @platform Web,Native
         */
        setTo(a?: number, r?: number, g?: number, b?: number): void;
        /**
         * @language zh_CN
         * 创建颜色值
         * @param argb 0xff00ff00格式
         * @returns color
         * @version Egret 3.0
         * @platform Web,Native
         */
        static createColor(argb: number): Color;
        /**
         * @language zh_CN
         * 设置颜色值
         * @param argb 0xff00ff00格式
         * @version Egret 3.0
         * @platform Web,Native
         */
        setColorARGB(argb: number): void;
        /**
         * @language zh_CN
         * 设置颜色值
         * @param rgb 0xffffff格式
         * @version Egret 3.0
         * @platform Web,Native
         */
        setColorRGB(rgb: number): void;
        /**
         * @language zh_CN
         * 在2个颜色之间取随机颜色
         * @param c1 第一个颜色
         * @param c2 第二个颜色
         * @param sameRandom 是否argb的随机种子使用同一个
         * @version Egret 3.0
         * @platform Web,Native
         */
        randomColor(c1: Color, c2: Color, sameRandom?: boolean): void;
        /**
         * @language zh_CN
         * 缩放当前颜色
         * @param value 缩放系数
         * @version Egret 3.0
         * @platform Web,Native
         */
        scaleBy(value: number): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.ColorGradients
    * @classdesc
    * 用于描述一个颜色渐变信息，由一个颜色数组和一个时间数组构成，并且数据一一对应。</p>
    * [clr1, clr2, clr3...], [t1, t2, t3...]含义为在t1时间点颜色值为clr1，t2时间点颜色值为clr2，以此类推。</p>
    * t1至t2之间的颜色信息渐变插值生成出来。该数据目前主要用于粒子在存活，颜色线性变化过渡过程。
    * @includeExample geom/ColorGradients.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ColorGradients {
        /**
        * @language zh_CN
        * 渐变色列表，对应时间列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        colors: Array<Color>;
        /**
        * @language zh_CN
        * 渐变色所处时间下标位置[0-1]，对应颜色列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        times: Array<number>;
        /**
        * @language zh_CN
        * 创建一个ColorGradients对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 渐变颜色取插值，根据时间线性插值获得。
        * @param t (0.0-1.0)
        * @returns Color，线性插值获得的颜色。
        * @version Egret 3.0
        * @platform Web,Native
        */
        lerpColor(t: number, dst?: Color): Color;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Bound
    * @classdesc
    * 可使用 Bound 类 取得包围盒的数据。</p>
    * 包含包围盒的各顶点信息，当包围盒要进行世界变换时，应当变换各顶点信息。</p>
    * 包围物体的顶点数据都是和绑定物体同一空间,变换信息也是用的共同的
    *
    * @includeExample geom/Bound.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Bound {
        /**
        * @language zh_CN
        * 顶点数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        vexData: Float32Array;
        /**
        * @language zh_CN
        * 索引数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        indexData: Uint16Array;
        /**
        * @language zh_CN
        * 顶点长度
        * @version Egret 3.0
        * @platform Web,Native
        */
        vexLength: number;
        /**
        * @language zh_CN
        * 子包围盒
        * @version Egret 3.0
        * @platform Web,Native
        */
        childBound: Bound;
        /**
        * @language zh_CN
        * 绑定的Object3D对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        owner: Object3D;
        protected _bound: Wireframe;
        protected initBound(): void;
        /**
        * @language zh_CN
        * 获取是否可见
        * @returns boolean 是否可见
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置是否可见
        * @version Egret 3.0
        * @platform Web,Native
        */
        visible: boolean;
        protected matrix: Matrix4_4;
        protected temp: Vector3D;
        /**
        * @language zh_CN
        * 创建一个包围对象
        * @prame owner 绑定的Object3D对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(owner: Object3D);
        /**
        * @language zh_CN
        * 得到变换矩阵，如果没有绑定Object3D对象返回本身的矩阵，否则返回父节点的模型矩阵
        * @returns 变换矩阵
        */
        transform: Matrix4_4;
        /**
        * @language zh_CN
        * 检测一个点是否包围盒内
        * @param pos 检测的点
        * @returns 成功返回true
        */
        pointIntersect(pos: Vector3D): boolean;
        /**
        * @language zh_CN
        * 检测两个包围对象是否相交
        * @param target 检测的目标
        * @param intersect 默认参数为null 相交的结果 可以为null
        * @returns  成功返回true
        */
        intersect(target: Bound, intersect?: Bound): boolean;
        /**
        * @language zh_CN
        * 克隆一个包围对象
        * @returns Bound 包圍對象
        */
        clone(): Bound;
        /**
        * @private
        */
        protected calculateTransform(): void;
        /**
        * @private
        */
        copyVertex(bound: Bound): void;
        /**
        * @private
        */
        protected createChild(): void;
        /**
        * @private
        * @language zh_CN
        */
        inBound(frustum: Frustum): boolean;
        protected updateAABB(): void;
        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    class HashMap {
        private data;
        private list;
        /**
        * @language zh_CN
        * 构造函数
        * @param useOrderList 是否使用外部传入的自定义数据列
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(useOrderList?: boolean);
        /**
        * @language zh_CN
        * 是否含有某个key为键的内容
        * @param key 指定的键
        * @returns boolean 返回布尔值
        * @version Egret 3.0
        * @platform Web,Native
        */
        isHas(key: string): boolean;
        /**
        * @language zh_CN
        * 根据输入的key，返回对应的value
        * @param key 指定的键
        * @returns any 返回该key对于的value
        * @version Egret 3.0
        * @platform Web,Native
        */
        getValue(key: string): any;
        /**
        * @language zh_CN
        * 获取所有值的列表
        * @returns Array<any> 返回值的列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        getList(): Array<any>;
        /**
        * @language zh_CN
        * 加入一个键值对
        * @param key 键
        * @param value 值
        * @version Egret 3.0
        * @platform Web,Native
        */
        add(key: string, value: any): void;
        /**
        * @language zh_CN
        * 输入一个key，删除对应的键值对
        * @param key 键
        * @version Egret 3.0
        * @platform Web,Native
        */
        remove(key: string): void;
        /**
        * @language zh_CN
        * 释放该对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.BoundBox
    * @classdesc
    * 可使用 Bound 类取得包围盒的数据。使用包围盒简化一个复杂模型的空间信息，执行碰撞检测和可视检测，这样可以大大提高计算效率。</p>
    * 包含包围盒的各顶点信息，当包围盒要进行世界变换时，应当变换各顶点信息。</p>
    * @see egret3d.Bound
    * @includeExample geom/BoundBox.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class BoundBox extends Bound {
        /**
        * @language zh_CN
        * 盒子最小点
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: Vector3D;
        /**
        * @language zh_CN
        * 盒子最大点
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: Vector3D;
        /**
        * @language zh_CN
        * 盒子宽
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 盒子高
        * @version Egret 3.0
        * @platform Web,Native
        */
        heigth: number;
        /**
        * @language zh_CN
        * 盒子长
        * @version Egret 3.0
        * @platform Web,Native
        */
        depth: number;
        /**
        * @language zh_CN
        * 盒子体积
        * @version Egret 3.0
        * @platform Web,Native
        */
        volume: number;
        /**
        * @language zh_CN
        * 盒子包围球中心点
        * @version Egret 3.0
        * @platform Web,Native
        */
        center: Vector3D;
        /**
        * @language zh_CN
        * 盒子包围球半径
        * @version Egret 3.0
        * @platform Web,Native
        */
        radius: number;
        private _box0;
        private _box1;
        /**
        * @language zh_CN
        * 创建一个包围
        * @param owner 绑定的Object3D对象
        * @param min 最小点
        * @param max 最大点
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(owner?: Object3D, min?: Vector3D, max?: Vector3D);
        /**
        * @language zh_CN
        * 拷贝一个包围盒
        * @param box 数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyFrom(box: BoundBox): void;
        /**
        * @language zh_CN
        * 填充当前包围盒
        * @param min 最小点
        * @param max 最大点
        * @version Egret 3.0
        * @platform Web,Native
        */
        fillBox(min: Vector3D, max: Vector3D): void;
        /**
        * @language zh_CN
        * 检测一个点是否包围盒内
        * @param pos 检测的点
        * @returns boolean 成功返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        pointIntersect(pos: Vector3D): boolean;
        /**
        * @language zh_CN
        * 检测两个包围盒是否相交
        * 功能和 intersect 一样 为版本兼容没有删除此API
        * @param box2 其中一个包围盒
        * @param boxIntersect  默认参数为null 相交的包围盒 可以为null
        * @returns boolean 成功返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        intersectAABBs(box2: BoundBox, boxIntersect?: BoundBox): boolean;
        /**
        * @language zh_CN
        * 检测两个包围对象是否相交
        * 注意：target 和 intersect 必须为BoundBox对象
        * @param target 检测的目标
        * @param intersect 默认参数为null 相交的结果 可以为null
        * @returns boolean 成功返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        intersect(target: Bound, intersect?: Bound): boolean;
        /**
        * @language zh_CN
        * 以字符串形式返回box的值
        * @returns string 字符串
        * @version Egret 3.0
        * @platform Web,Native
        */
        toString(): string;
        /**
        * @language zh_CN
        * 计算包围盒数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        calculateBox(): void;
        visible: boolean;
        /**
        * @language zh_CN
        * 检测一个盒子是否在视椎体内
        * @param frustum 视椎体
        * @returns boolean 在视椎内返回ture
        * @version Egret 3.0
        * @platform Web,Native
        */
        inBound(frustum: Frustum): boolean;
        protected updateAABB(): void;
        /**
        * @private
        */
        createChild(): void;
        /**
        * @language zh_CN
        * 克隆一個包圍對象
        * @returns Bound 包圍對象
        */
        clone(): Bound;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.BezierCurve
    * @classdesc
    * 贝塞尔曲线
    * @includeExample geom/BezierCurve.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class BezierCurve {
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 计算贝塞尔曲线在t值时候的y值
        * @param pos 贝塞尔曲线的坐标列表
        * @param t 时刻
        * @version Egret 3.0
        * @platform Web,Native
        */
        calcLineX(pos: Array<Point>, t: number): number;
        calcBezierY(pos: Array<Point>, ctrl: Array<Point>, t: number): number;
        calcBezierX(pos: Array<Point>, ctrl: Array<Point>, t: number): number;
        private cubic_bezier(p0, p1, p2, p3, t);
    }
    /**
    * @private
    * @language zh_CN
    * @class egret3d.BezierData
    * @classdesc
    * @version Egret 3.0
    * @platform Web,Native
    */
    class BezierData {
        private static SegCount;
        posPoints: Array<Point>;
        ctrlPoints: Array<Point>;
        lineMode: boolean;
        linePoints: Array<Point>;
        private static calc;
        constructor();
        calc(t: number): number;
        trySampler(): Float32Array;
        sampler(): Float32Array;
        private samplerLine();
        private samplerBezier();
        validate(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.ColorTransform
    * @classdesc
    * 可使用 ColorTransform 类调整显示对象的颜色值
    * @includeExample geom/ColorTransform.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ColorTransform {
        /**
        * @language zh_CN
        * 颜色变化矩阵(r,g,b)数据，a单独放在外面计算
        * @version Egret 3.0
        * @platform Web,Native
        */
        m44: Matrix4_4;
        /**
        * @language zh_CN
        * 透明度
        * @version Egret 3.0
        * @platform Web,Native
        */
        alpha: number;
        /**
        * @language zh_CN
        * @class egret3d.ColorTransform
        * @classdesc 创建一个颜色变化矩阵对象，用于偏色某个材质球
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 缩放颜色，对rgba进行对应比例的系数缩放
        * @param r red通道
        * @param g green通道
        * @param b blue通道
        * @param a alpha通道
        * @version Egret 3.0
        * @platform Web,Native
        */
        scale(r?: number, g?: number, b?: number, a?: number): void;
        /**
        * @language zh_CN
        * 偏移颜色，对rgba进行对应便宜
        * @param r red通道偏移值
        * @param g green通道偏移值
        * @param b blue通道偏移值
        * @param a alpha通道偏移值
        * @version Egret 3.0
        * @platform Web,Native
        */
        offset(r?: number, g?: number, b?: number, a?: number): void;
        /**
        * @language zh_CN
        * 灰度变换
        * @version Egret 3.0
        * @platform Web,Native
        */
        gray(): void;
        /**
        * @language zh_CN
        * 重置数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        reset(): void;
        /**
        * @language zh_CN
        * 颜色变换叠加
        * @param ctf 叠加的颜色变换的矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        multiply(ctf: ColorTransform): void;
        /**
        * @language zh_CN
        * 拷贝一个颜色变换数据
        * @param transform 被拷贝的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyFrom(transform: ColorTransform): void;
        /**
        * @language zh_CN
        * 拷贝该颜色变换数据
        * @param transform 拷贝至目标对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copyTo(transform: ColorTransform): void;
        /**
         * @language zh_CN
         * 设置颜色值
         * @param value rgb，0xffffff格式
         * @version Egret 3.0
         * @platform Web,Native
         */
        setColorRGB(value: number): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.PickResult
    * @classdesc
    * 鼠标拾取返回数据。</p>
    * 鼠标拾取模型上的交点 (本地坐标、世界坐标)。</p>
    * 鼠标拾取模型的uv。</p>
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PickResult {
        /**
        * @language zh_CN
        * 鼠标拾取模型上的交点 (本地坐标)。
        * @version Egret 3.0
        * @platform Web,Native
        */
        localPosition: Vector3D;
        /**
        * @language zh_CN
        * 鼠标拾取模型上的交点 (世界坐标)。
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalPosition: Vector3D;
        /**
        * @language zh_CN
        * 鼠标拾取模型的uv。
        * 只有对象的PickType为UVPick 并且模型有uv才会返回
        * @see egret3d.PickType
        * @version Egret 3.0
        * @platform Web,Native
        */
        uv: Vector3D;
        /**
        * @language zh_CN
        * 相交面的索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        faceIndex: number;
        /**
        * @language zh_CN
        * 相交面顶点0索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        v0: number;
        /**
        * @language zh_CN
        * 相交面顶点1索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        v1: number;
        /**
        * @language zh_CN
        * 相交面顶点2索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        v2: number;
        /**
        * @language zh_CN
        * 鼠标拣选到的所有物体
        * @version Egret 3.0
        * @platform Web,Native
        */
        pickList: any;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Event3D
    * @classdesc
    * Event3D 类作为创建 Event3D 对象的基类，当发生事件时，Event3D 对象将作为参数传递给事件侦听器。
    * Event3D 类的属性包含有关事件的基本信息，例如事件的类型。对于许多事件（如由 Event3D 类常量表示的事件），
    * 此基本信息就足够了。但其他事件可能需要更详细的信息。
    * 例如，与鼠标单击关联的事件需要包括有关单击事件的位置以及在单击事件期间是否按下了任何键的其他信息。
    * 您可以通过扩展 Event3D 类（MouseEvent 类执行的操作）将此类其他信息传递给事件侦听器。
    * @includeExample events/Event3D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Event3D {
        /**
        * @language zh_CN
        * COMPLETE 常量定义 相关完成事件。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * CHANGE_PROPERTY 常量定义 changeProperty 事件对象的 type 属性的值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * ENTER_FRAME 常量定义 每帧更新事件标识。
        * 可注册对象 : Egret3DCanvas类型。
        * 事件响应状态 : 每帧更新时响应一次。
        * 响应事件参数 : Event3D类型,其中Event3D.target的内容即为此次注册事件的Egret3DCanvas对象。
        * @see egret3d.Egret3DCanvas
        * @version Egret 3.0
        * @platform Web,Native
        */
        static ENTER_FRAME: string;
        /**
        * @language zh_CN
        * RESIZE 常量定义 窗体尺寸变换事件标识。
        * 可注册对象 : Input类型。
        * 事件响应状态 : 窗体尺寸变换时响应一次。
        * 响应事件参数 : Event3D类型,其中Event3D.target的内容即为此次注册事件的Input对象。
        * @see egret3d.Input
        * @version Egret 3.0
        * @platform Web,Native
        */
        static RESIZE: string;
        /**
        * @private
        * @language zh_CN
        * CHANGE 常量定义 change 事件对象的 type 属性值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        static CHANGE: string;
        /**
        * @language zh_CN
        * 事件目标。
        * 一般为注册事件的对象本身。 EventDispatcher
        * @see egret3d.EventDispatcher
        * @version Egret 3.0
        * @platform Web,Native
        */
        target: any;
        /**
        * @language zh_CN
        * 当前正在使用某个事件侦听器处理 Event3D 对象的对象
        * @see egret3d.EventListener
        * @version Egret 3.0
        * @platform Web,Native
        */
        currentTarget: EventListener;
        /**
        * @language zh_CN
        * 3D引擎中的事件的类型标识字符串
        * @version Egret 3.0
        * @platform Web,Native
        */
        eventType: string;
        /**
        * @language zh_CN
        * 附加数据。
        * 例如,保存QueueLoader加载后的原始数据,加载完毕后,作为参数传出。
        * @see egret3d.QueueLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        data: any;
        /**
        * @language zh_CN
        * 注册事件时传递的参数
        * @version Egret 3.0
        * @platform Web,Native
        */
        param: any;
        /**
        * @language zh_CN
        * 当前时间戳。
        * @see egret3d.Egret3DCanvas
        * @version Egret 3.0
        * @platform Web,Native
        */
        time: number;
        /**
        * @language zh_CN
        * 每帧间隔延时。
        * @see egret3d.Egret3DCanvas
        * @version Egret 3.0
        * @platform Web,Native
        */
        delay: number;
        private _stopImmediatePropagation;
        /**
        * @language zh_CN
        * 创建一个作为参数传递给事件侦听器的 Event3D 对象。
        * @param eventType {any} 事件类型
        * @param data {any} 附加数据(可选)
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(eventType?: string, data?: any);
        /**
        * @language zh_CN
        * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。
        * @version Egret 3.0
        * @platform Web,Native
        */
        stopImmediatePropagation(): void;
        /**
         * @private
       * @language zh_CN
       * 重置_stopImmediatePropagation等属性为默认值.引擎内部使用.不对外开放
       * @version Egret 3.0
       * @platform Web,Native
       */
        reset(): void;
        /**
        * @language zh_CN
        * (只读)是否调用过 stopImmediatePropagation() 方法.
        * @version Egret 3.0
        * @platform Web,Native
        */
        isStopImmediatePropagation: boolean;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.AnimationEvent3D
    * @classdesc
    * 在骨骼动画、粒子动画和属性动画播放时，会有触发动画播放完成事件和动画帧更改事件。
    * AnimationEvent3D内定义了这两种事件的标识符，发生事件时。
    * AnimationEvent3D 对象将作为参数传递给事件侦听器。
    * EVENT_PLAY_COMPLETE 粒子动画 骨骼动画 属性动画 都会触发。
    * EVENT_FRAME_CHANGE 骨骼动画会触发。
    *
    * @see egret3d.PropertyAnimController
    * @see egret3d.SkeletonAnimation
    * @see egret3d.ParticleAnimation
    * @see egret3d.Event3D
    * @see egret3d.EventDispatcher
    * @includeExample events/PropertyAnimEvent3D.ts
    * @includeExample events/SkeletonAnimationEvent3D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class AnimationEvent3D extends Event3D {
        /**
        * @language zh_CN
        * 动画属性是循环状态下触发
        * 动画一个周期结束后循环
        * 可注册对象 : SkeletonAnimation
        * 响应事件参数 : AnimationEvent3D类型。
        * @see egret3d.Event3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        static CYCLE: string;
        /**
        * @language zh_CN
        * 动画属性是非循环状态下触发
        * 动画在不循环的时候完成动画触发
        * 可注册对象 : SkeletonAnimation
        * 响应事件参数 : AnimationEvent3D类型。
        * @see egret3d.Event3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        static COMPLETE: string;
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * 鼠标键码
     * @version Egret 3.0
     * @platform Web,Native
     */
    enum MouseCode {
        /**
        * @language zh_CN
        * 鼠标左键
        * @version Egret 3.0
        * @platform Web,Native
        */
        Mouse_Left = 0,
        /**
        * @language zh_CN
        * 鼠标中键
        * @version Egret 3.0
        * @platform Web,Native
        */
        Mouse_Mid = 1,
        /**
        * @language zh_CN
        * 鼠标右键
        * @version Egret 3.0
        * @platform Web,Native
        */
        Mouse_Right = 2,
    }
    /**
    * @language zh_CN
    * @class egret3d.MouseEvent3D
    * @classdesc
    * MouseEvent3D 是所有引擎中可操作鼠标事件节点 的事件类型标记。
    * 只有Input.addEventListener 才会产生下类事件
    * @includeExample events/MouseEvent3D.ts
    * @see egret3d.Event3D
    * @see egret3d.EventDispatcher
    * @see egret3d.Input
    * @version Egret 3.0
    * @platform Web,Native
    */
    class MouseEvent3D extends Event3D {
        /**
         * @language zh_CN
         * MOUSE_CLICK 常量定义 鼠标点击事件标识。
         * 可注册对象 : Input类型。
         * 事件响应状态 : 鼠标点击后触发。
         * 响应事件参数 : MouseEvent3D类型,其中LoaderEvent3D.mouseCode的内容即为此次鼠标键码。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static MOUSE_CLICK: string;
        /**
         * @language zh_CN
         * MOUSE_DOWN 常量定义 鼠标按下事件标识。
         * 可注册对象 : Input类型。
         * 事件响应状态 : 鼠标按下后触发。
         * 响应事件参数 : MouseEvent3D类型,其中LoaderEvent3D.mouseCode的内容即为此次鼠标键码。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static MOUSE_DOWN: string;
        /**
         * @language zh_CN
         * MOUSE_UP 常量定义 鼠标弹回事件标识
         * 可注册对象 : Input类型。
         * 事件响应状态 : 鼠标弹回后触发。
         * 响应事件参数 : MouseEvent3D类型,其中LoaderEvent3D.mouseCode的内容即为此次鼠标键码。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static MOUSE_UP: string;
        /**
         * @language zh_CN
         * MOUSE_MOVE 常量定义 鼠标移动事件标识。
         * 可注册对象 : Input类型。
         * 事件响应状态 : 鼠标移动时触发。
         * 响应事件参数 : MouseEvent3D类型,其中LoaderEvent3D.mouseCode的内容即为此次鼠标键码。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static MOUSE_MOVE: string;
        /**
         * @language zh_CN
         * MOUSE_OVER 常量定义 鼠标穿过物体事件标识。
         * 可注册对象 : Input类型。
         * 事件响应状态 : 鼠标穿过物体时触发。
         * 响应事件参数 : MouseEvent3D类型,其中LoaderEvent3D.mouseCode的内容即为此次鼠标键码。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static MOUSE_OVER: string;
        /**
        * @language zh_CN
        * MOUSE_OVER 常量定义 鼠标离开物体事件标识。
        * 可注册对象 : Input类型。
        * 事件响应状态 : 鼠标离开物体时触发。
        * 响应事件参数 : MouseEvent3D类型,其中LoaderEvent3D.mouseCode的内容即为此次鼠标键码。
        * @see egret3d.Input
        * @version Egret 3.0
        * @platform Web,Native
        */
        static MOUSE_OUT: string;
        /**
         * @language zh_CN
         * MOUSE_WHEEL 常量定义 滚轮事件标识。
         * 可注册对象 : Input类型。
         * 事件响应状态 : 鼠标滚轮滚动时触发。
         * 响应事件参数 : MouseEvent3D类型。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static MOUSE_WHEEL: string;
        /**
           * @language zh_CN
           * 鼠标code值,枚举值可以参考egret3d.MouseCode
           * @see egret3d.MouseCode
           * @version Egret 3.0
           * @platform Web,Native
           */
        mouseCode: number;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.TouchEvent3D
    * @classdesc
    * TouchEvent3D 是所有引擎中可操作触摸事件节点 的事件类型标记。
    * 只有Input.addEventListener 才会产生下类事件
    * @includeExample events/TouchEvent3D.ts
    * @see egret3d.Event3D
    * @see egret3d.EventDispatcher
    * @see egret3d.Input
    * @version Egret 3.0
    * @platform Web,Native
    */
    class TouchEvent3D extends Event3D {
        /**
         * @language zh_CN
         * TOUCH_MOVE 常量定义 触摸滑动事件标识。
         * 可注册对象 : Input类型。
         * 事件响应状态 : 触摸滑动时触发。
         * 响应事件参数 : TouchEvent3D类型,其中TouchEvent3D.targetTouches的内容即为此次触摸列表。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static TOUCH_MOVE: string;
        /**
        * @language zh_CN
        * TOUCH_END 常量定义 触摸开始事件标识。
        * 可注册对象 : Input类型。
        * 事件响应状态 : 触摸开始触发。
        * 响应事件参数 : TouchEvent3D类型,其中TouchEvent3D.targetTouches的内容即为此次触摸列表。
        * @see egret3d.Input
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TOUCH_START: string;
        /**
        * @language zh_CN
        * TOUCH_START 常量定义 触摸结束事件标识。
        * 可注册对象 : Input类型。
        * 事件响应状态 : 触摸结束触发。
        * 响应事件参数 : TouchEvent3D类型,其中TouchEvent3D.targetTouches的内容即为此次触摸列表。
        * @see egret3d.Input
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TOUCH_END: string;
        /**
        * @language zh_CN
        * touch列表
        * @version Egret 3.0
        * @see egret3d.TouchData
        * @platform Web,Native
        */
        targetTouches: Array<TouchData>;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.PickEvent3D
    * @classdesc
    * PickEvent3D 是所有引擎中可操作物体拣选事件的事件类型标记。
    * 当IRender对象开启了 enablePick ，并且监听了PickEvent3D事件后，
    * 鼠标或触摸对IRender对象进行操作后会产生一些对应的事件进行影响。
    * 只有Object3D对象调用addEventListener 才会产生下类事件
    * @includeExample events/PickEvent3D.ts
    * @see egret3d.Event3D
    * @see egret3d.EventDispatcher
    * @see egret3d.Object3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PickEvent3D extends Event3D {
        /**
         * @language zh_CN
         * PICK_CLICK 点击拣选事件标识
         * 可注册对象 : Object3D类型。
         * 事件响应状态 : 点击拣选时触发，手机上不触发此事件。
         * 响应事件参数 : PickEvent3D类型,其中PickEvent3D.pickResult的内容即为此次拣选结果。
         * @version Egret 3.0
         * @platform Web,Native
         */
        static PICK_CLICK: string;
        /**
         * @language zh_CN
         * PICK_DOWN  按下拣选事件标识
         * 可注册对象 : Object3D类型。
         * 事件响应状态 : 按下拣选时触发。
         * 响应事件参数 : PickEvent3D类型,其中PickEvent3D.pickResult的内容即为此次拣选结果。
         * @version Egret 3.0
         * @platform Web,Native
         */
        static PICK_DOWN: string;
        /**
         * @language zh_CN
         * PICK_UP 弹起拣选事件标识
         * 可注册对象 : Object3D类型。
         * 事件响应状态 : 弹起拣选时触发。
         * 响应事件参数 : PickEvent3D类型,其中PickEvent3D.pickResult的内容即为此次拣选结果。
         * @version Egret 3.0
         * @platform Web,Native
         */
        static PICK_UP: string;
        /**
         * @language zh_CN
         * PICK_MOVE 光标移动拣选事件标识
         * 可注册对象 : Object3D类型。
         * 事件响应状态 : 光标移动拣选时触发。
         * 响应事件参数 : PickEvent3D类型,其中PickEvent3D.pickResult的内容即为此次拣选结果。
         * @version Egret 3.0
         * @platform Web,Native
         */
        static PICK_MOVE: string;
        /**
         * @language zh_CN
         * PICK_WHEEL 滚轮滚动拣选事件标识
         * 可注册对象 : Object3D类型。
         * 事件响应状态 : 滚轮滚动拣选时触发。
         * 响应事件参数 : PickEvent3D类型,其中PickEvent3D.pickResult的内容即为此次拣选结果。
         * @version Egret 3.0
         * @platform Web,Native
         */
        static PICK_WHEEL: string;
        /**
         * @language zh_CN
         * 拣选结果数据。
         * @see egret3d.PickResult
         * @version Egret 3.0
         * @platform Web,Native
         */
        pickResult: PickResult;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        pickTarget: any;
        /**
        * @language zh_CN
        * MouseEvent3D TouchEvent3D 事件对象 鼠标则返回MouseEvent3D  触摸 TouchEvent3D
        * @see egret3d.Event3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        targetEvent: Event3D;
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * 按键码
     * @version Egret 3.0
     * @platform Web,Native
     */
    enum KeyCode {
        Key_BackSpace = 8,
        Key_Tab = 9,
        Key_Clear = 12,
        Key_Enter = 13,
        Key_Shift_L = 16,
        Key_Control_L = 17,
        Key_Alt_L = 18,
        Key_Pause = 19,
        Key_CapsLock = 20,
        Key_Escape = 21,
        Key_Space = 32,
        Key_Prior = 33,
        Key_Next = 34,
        Key_End = 35,
        Key_Home = 36,
        Key_Left = 37,
        Key_Up = 38,
        Key_Right = 39,
        Key_Down = 40,
        Key_Select = 41,
        Key_Print = 42,
        Key_Execute = 43,
        Key_Insert = 45,
        Key_Delete = 46,
        Key_Help = 47,
        Key_0 = 48,
        Key_1 = 49,
        Key_2 = 50,
        Key_3 = 51,
        Key_4 = 52,
        Key_5 = 53,
        Key_6 = 54,
        Key_7 = 55,
        Key_8 = 56,
        Key_9 = 57,
        Key_A = 65,
        Key_B = 66,
        Key_C = 67,
        Key_D = 68,
        Key_E = 69,
        Key_F = 70,
        Key_G = 71,
        Key_H = 72,
        Key_I = 73,
        Key_J = 74,
        Key_K = 75,
        Key_L = 76,
        Key_M = 77,
        Key_N = 78,
        Key_O = 79,
        Key_P = 80,
        Key_Q = 81,
        Key_R = 82,
        Key_S = 83,
        Key_T = 84,
        Key_U = 85,
        Key_V = 86,
        Key_W = 87,
        Key_X = 88,
        Key_Y = 89,
        Key_Z = 90,
        Key_KP_0 = 96,
        Key_KP_1 = 97,
        Key_KP_2 = 98,
        Key_KP_3 = 99,
        Key_KP_4 = 100,
        Key_KP_5 = 101,
        Key_KP_6 = 102,
        Key_KP_7 = 103,
        Key_KP_8 = 104,
        Key_KP_9 = 105,
        Key_Multiply = 106,
        Key_Add = 107,
        Key_Separator = 108,
        Key_Subtract = 109,
        Key_Decimal = 110,
        Key_Divide = 111,
        Key_F1 = 112,
        Key_F2 = 113,
        Key_F3 = 114,
        Key_F4 = 115,
        Key_F5 = 116,
        Key_F6 = 117,
        Key_F7 = 118,
        Key_F8 = 119,
        Key_F9 = 120,
        Key_F10 = 121,
        Key_F11 = 122,
        Key_F12 = 123,
        Key_F13 = 124,
        Key_F14 = 125,
        Key_F15 = 126,
        Key_F16 = 127,
        Key_F17 = 128,
        Key_F18 = 129,
        Key_F19 = 130,
        Key_F20 = 131,
        Key_F21 = 132,
        Key_F22 = 133,
        Key_F23 = 134,
        Key_F24 = 135,
        Key_Num_Lock = 136,
        Key_Scroll_Lock = 137,
    }
    /**
    * @language zh_CN
    * @class egret3d.MouseEvent3D
    * @classdesc
    * KeyEvent3D 按键事件，
    * 只有Input.addEventListener 才会产生下类事件
    * @includeExample events/KeyEvent3D.ts
    * @see egret3d.Event3D
    * @see egret3d.EventDispatcher
    * @see egret3d.Input
    * @version Egret 3.0
    * @platform Web,Native
    */
    class KeyEvent3D extends Event3D {
        /**
        * @language zh_CN
        * KEY_DOWN 常量定义  按键按下事件标识。
        * 可注册对象 : Input类型。
        * 事件响应状态 : 按键每次按下时响应。
        * 响应事件参数 : KeyEvent3D类型,其中KeyEvent3D.keyCode的内容即为Key的值。
        * @see egret3d.Input
        * @default "onKeyDown"
        * @version Egret 3.0
        * @platform Web,Native
        */
        static KEY_DOWN: string;
        /**
        * @language zh_CN
        * KEY_UP 常量定义 按键回弹事件标识。
        * 可注册对象 : Input类型。
        * 事件响应状态 : 按键每次回弹时响应。
        * 响应事件参数 : KeyEvent3D类型,其中KeyEvent3D.keyCode的内容即为Key的值。
        * @see egret3d.Input
        * @default "onKeyUp"
        * @version Egret 3.0
        * @platform Web,Native
        */
        static KEY_UP: string;
        /**
        * @language zh_CN
        * 按键code值,枚举类型可以参考egret3d.KeyCode
        * @see egret3d.KeyCode
        * @default 0
        * @version Egret 3.0
        * @platform Web,Native
        */
        keyCode: number;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * 设备的方向(设备横向持有或纵向持有)。
     * @version Egret 3.0
     * @platform Web,Native
     */
    enum Orientation {
        /**
         * 设备纵向持有0°,即纵向主方向。
         * @version Egret 3.0
         * @platform Web,Native
         */
        Portrait_Primary = 0,
        /**
         * 设备纵向持有180°，即纵向次方向
         * @version Egret 3.0
         * @platform Web,Native
         */
        Portrait_Secondary = 180,
        /**
         * 设备横向持有-90°,即横向主方向。
         * @version Egret 3.0
         * @platform Web,Native
         */
        Landscape_Primary = -90,
        /**
        * 设备横向持有90°,即横向次方向。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Landscape_Secondary = 90,
    }
    /**
    * @language zh_CN
    * @class egret3d.MouseEvent3D
    * @classdesc
    * OrientationEvent3D 是所有引擎中可重力感应事件节点的事件类型标记。
    * 只有Input.addEventListener 才会产生下类事件
    * @see egret3d.Event3D
    * @see egret3d.EventDispatcher
    * @see egret3d.Input
    * @version Egret 3.0
    * @platform Web,Native
    * @includeExample events/OrientationEvent3D.ts
    */
    class OrientationEvent3D extends Event3D {
        /**
         * @language zh_CN
         * ORIENTATION_CHANGE 常量定义 屏幕方向改变事件标识。
         * 可注册对象 : Input类型。
         * 事件响应状态 : 屏幕方向改变事件时响应。
         * 响应事件参数 : OrientationEvent3D类型,其中OrientationEvent3D.Orientation的内容即为方向枚举值。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static ORIENTATION_CHANGE: string;
        /**
         * @language zh_CN
         * DEVICE_MOTION 常量定义 晃动事件标识
         * 可注册对象 : Input类型。
         * 事件响应状态 : 晃动时响应。
         * 响应事件参数 : OrientationEvent3D类型,其提供设备的加速信息，还提供了设备在坐标系中的自转速率。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DEVICE_MOTION: string;
        /**
         * @language zh_CN
         * DEVICE_ORIENTATION 常量定义 设备方向事件标识。
         * 可注册对象 : Input类型。
         * 事件响应状态 : 设备方向变化响应。
         * 响应事件参数 : OrientationEvent3D类型,其提供设备的物理方向信息，表示为一系列本地坐标系的旋角。
         * @see egret3d.Input
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DEVICE_ORIENTATION: string;
        private _orientation;
        /**
         * @language zh_CN
         * 获取设备的方向枚举值,枚举值为其对应角度
         * @returns {Orientation} 设备的方向枚举值
         * @see egret3d.Orientation
         * @version Egret 3.0
         * @platform Web,Native
         */
        orientation: Orientation;
        private _acceleration;
        /**
         * @language zh_CN
         * 获取排除重力影响的加速度
         * @returns {DeviceAcceleration} 加速度,单位是m/s2
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置排除重力影响的加速度
         * @param deviceAcceleration {DeviceAcceleration} 加速度,单位是m/s2。
         * @version Egret 3.0
         * @platform Web,Native
         */
        acceleration: DeviceAcceleration;
        private _accelerationIncludingGravity;
        /**
        * @language zh_CN
        * 获取受到重力影响的加速度
        * @returns {DeviceAcceleration} 加速度,单位是m/s2
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置受到重力影响的加速度
        * @param deviceAcceleration {DeviceAcceleration} 加速度,单位是m/s2。
        * @version Egret 3.0
        * @platform Web,Native
        */
        accelerationIncludingGravity: DeviceAcceleration;
        private _rotationRate;
        /**
         * @language zh_CN
         * 获取旋转角度的变化速率
         * @returns {DeviceAcceleration} 旋转速率,单位是deg/s。
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置旋转速率
         * @param deviceRotationRate {DeviceRotationRate} 旋转速率,单位是deg/s。
         * @version Egret 3.0
         * @platform Web,Native
         */
        rotationRate: DeviceRotationRate;
        private _absolute;
        /**
         * @language zh_CN
         * 获取是否是绝对旋转重力方向
         * @returns {boolean}。
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置是否是绝对旋转重力方向
         * @param value {boolean}。
         * @version Egret 3.0
         * @platform Web,Native
         */
        absolute: boolean;
        private _alpha;
        /**
         * @language zh_CN
         * 获取Alpha旋转，围绕Z轴旋转，即水平方向旋转
         * @returns {number} 旋转角度。
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置Alpha旋转，围绕Z轴旋转，即水平方向旋转
         * @param value {number} 旋转角度。
         * @version Egret 3.0
         * @platform Web,Native
         */
        alpha: number;
        private _beta;
        /**
         * @language zh_CN
         * 获取Beta旋转，围绕X轴旋转，即前后方向旋转
         * @returns {number} 旋转角度。
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置Beta旋转，围绕X轴旋转，即前后方向旋转
         * @param value {number} 旋转角度。
         * @version Egret 3.0
         * @platform Web,Native
         */
        beta: number;
        private _gamma;
        /**
         * @language zh_CN
         * 获取Gamma旋转，围绕Y轴旋转，即左右方向旋转
         * @returns {number} 旋转角度。
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置Gamma旋转，围绕Y轴旋转，即左右方向旋转
         * @param value {number} 旋转角度。
         * @version Egret 3.0
         * @platform Web,Native
         */
        gamma: number;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.LoaderEvent3D
    * @classdesc
    * LoaderEvent3D 使用URLLoader加载资源的事件返回对象
    * 只有URLLoader对象调用addEventListener 才会产生下类事件
    * @includeExample events/LoaderEvent3D.ts
    * @see egret3d.Event3D
    * @see egret3d.EventDispatcher
    @ @see egret3d.URLLoader
    * @version Egret 3.0
    * @platform Web,Native
    */
    class LoaderEvent3D extends Event3D {
        /**
        * @language zh_CN
        * LOADER_COMPLETE 常量定义 资源加载完成事件标识。
        * (3.2.5版本后请使用COMPLETE)
        * 可注册对象 : URLLoader类型。
        * 事件响应状态 : 加载完成后触发。
        * 响应事件参数 : LoaderEvent3D类型,其中LoaderEvent3D.data的内容即为此次加载的内容。
        * @see egret3d.URLLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        static LOADER_COMPLETE: string;
        /**
        * @language zh_CN
        * COMPLETE 常量定义 资源加载完成事件标识。
        * 可注册对象 : URLLoader类型。
        * 事件响应状态 : 加载完成后触发。
        * 响应事件参数 : LoaderEvent3D类型,其中LoaderEvent3D.data的内容即为此次加载的内容。
        * @see egret3d.URLLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        static COMPLETE: string;
        /**
        * @language zh_CN
        * LOADER_ONCE_COMPLETE 常量定义 资源加载一个文件完成事件标识。
        * (3.2.5版本后请使用ONCE_COMPLETE)
        * 可注册对象 : URLLoader类型。
        * 事件响应状态 : 加载一个文件完成触发。
        * 响应事件参数 : LoaderEvent3D类型,其中LoaderEvent3D.data的内容即为此次加载的内容。
        * @see egret3d.URLLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        static LOADER_ONCE_COMPLETE: string;
        /**
        * @language zh_CN
        * ONCE_COMPLETE 常量定义 资源加载一个文件完成事件标识。
        * 可注册对象 : URLLoader类型。
        * 事件响应状态 : 加载一个文件完成触发。
        * 响应事件参数 : LoaderEvent3D类型,其中LoaderEvent3D.data的内容即为此次加载的内容。
        * @see egret3d.URLLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        static ONCE_COMPLETE: string;
        /**
        * @language zh_CN
        * LOADER_PROGRESS 常量定义 加载进度事件标识。
        * (3.2.5版本后请使用PROGRESS)
        * 可注册对象 : URLLoader类型。
        * 事件响应状态 : 加载过程中事件响应。
        * 响应事件参数 : LoaderEvent3D类型,其中LoaderEvent3D.currentProgress的内容即为此次加载的进度。
        * @see egret3d.URLLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        static LOADER_PROGRESS: string;
        /**
        * @language zh_CN
        * PROGRESS 常量定义 加载进度事件标识。
        * 可注册对象 : URLLoader类型。
        * 事件响应状态 : 加载过程中事件响应。
        * 响应事件参数 : LoaderEvent3D类型,其中LoaderEvent3D.currentProgress的内容即为此次加载的进度。
        * @see egret3d.URLLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        static PROGRESS: string;
        /**
        * @language zh_CN
        * LOADER_ERROR 常量定义 加载出错事件标识。
        * (3.2.5版本后请使用ERROR)
        * 可注册对象 : URLLoader类型。
        * 事件响应状态 : 加载出错时事件响应。
        * 响应事件参数 : LoaderEvent3D类型,其中LoaderEvent3D.loader的内容即为出错的加载器。
        * @see egret3d.URLLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        static LOADER_ERROR: string;
        /**
        * @language zh_CN
        * LOADER_ERROR 常量定义 加载出错事件标识。
        * 可注册对象 : URLLoader类型。
        * 事件响应状态 : 加载出错时事件响应。
        * 响应事件参数 : LoaderEvent3D类型,其中LoaderEvent3D.loader的内容即为出错的加载器。
        * @see egret3d.URLLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        static ERROR: string;
        /**
        * @language zh_CN
        * 加载器对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        loader: ILoader;
        /**
      * @language zh_CN
      * 加载对象的总大小
      * @version Egret 3.0
      * @platform Web,Native
      */
        total: number;
        /**
        * @language zh_CN
        * 加载对象的当前的加载大小
        * @version Egret 3.0
        * @platform Web,Native
        */
        loaded: number;
        /**
        * @language zh_CN
        * 加载进度,0到1范围
        * @version Egret 3.0
        * @platform Web,Native
        */
        currentProgress: number;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.ParserEvent3D
    * @classdesc
    * ParserEvent3D 使用ParserUtils加载资源的事件返回对象
    * @see egret3d.Event3D
    * @see egret3d.EventDispatcher
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParserEvent3D extends Event3D {
        /**
         * @language zh_CN
         * PARSER_COMPLETE 常量定义 egret3d资源加载完成事件标识符。
         * 可注册对象 : ParserUtils类型。
         * 事件响应状态 : gret3d资源加载完成时触发。
         * 响应事件参数 : ParserEvent3D类型,其中ParserEvent3D.parser的内容即为此次解析对象。
         * @see egret3d.ParserUtils
         * @version Egret 3.0
         * @platform Web,Native
         */
        static PARSER_COMPLETE: string;
        /**
        * @language zh_CN
        * 解析对象
        * @see egret3d.ParserUtils
        * @version Egret 3.0
        * @platform Web,Native
        */
        parser: ParserUtils;
    }
}
declare module egret3d {
    /**
    *
    * @language zh_CN
    * @class egret3d.EventListener
    * @classdesc
    * EventListener类，用于添加或删除事件侦听器。
    * @version Egret 3.0
    * @platform Web,Native
    */
    class EventListener {
        type: string;
        thisObject: any;
        handler: Function;
        param: any;
        priority: number;
        /**
        * @private
        */
        static event_id_count: number;
        /**
        * @language zh_CN
        * @param type {string} 事件的类型。
        * @param thisObject {any} 注册的对象
        * @param handler {Function} 处理事件的侦听器函数
        * @param param {any} 注册事件时指定的参数，事件响应时传出
        * @param priority {number} 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
        * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(type?: string, thisObject?: any, handler?: Function, param?: any, priority?: number);
        /**
        * @language zh_CN
        * 比较两个事件是否是同一事件。
        * @param type {string} 事件的类型。
        * @param handler {Function} 处理事件的侦听器函数
        * @param thisObject {any} 注册的对象
        * @param param {any} 注册事件时指定的参数，事件响应时传出
        * @returns {boolean} 一致时返回true，反之为false
        * @version Egret 3.0
        * @platform Web,Native
        */
        equalCurrentListener(type: string, handler: Function, thisObject: any, param: any): boolean;
    }
    /**
    * @language zh_CN
    * @class egret3d.EventDispatcher
    * @classdesc
    * EventDispatcher 类是可调度事件的所有类的基类,包含了事件的注册,注销，分发和清理等功能实现。
    * @includeExample events/EventDispatcher.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class EventDispatcher {
        /**
         * @language zh_CN
         * @private
         */
        protected listeners: any;
        /**
         * @language zh_CN
         * 派发一个 Event3D 事件到所有注册了特定类型侦听器的对象中。
         * @param event3D {Event3D} 事件信息，其中Event3D.eventType为事件标识符，通过该标识进行派发。
         * @see egret3d.Event3D
         * @version Egret 3.0
         * @platform Web,Native
         */
        dispatchEvent(event3D: Event3D): void;
        /**
        * @language zh_CN
        * 释放所有数据。
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
        /**
        * @language zh_CN
        * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知。可以为特定类型的事件和优先级注册事件侦听器。成功注册一个事件侦听器后，无法通过额外调用 addEventListener() 来更改其优先级。要更改侦听器的优先级，必须首先调用 removeEventListener()。然后，可以使用新的优先级再次注册该侦听器。
        * @param type {string} 事件的类型标识符。
        * @param callback {Function} 处理事件的侦听器函数。此函数必须接受 Event3D 对象作为其唯一的参数，并且不能返回任何结果，
        * 如下面的示例所示： function(evt:Event3D):void 函数可以有任何名称。
        * @param thisObject {any} 当前注册对象。
        * @param param {any} 事件携带参数，默认为空。
        * @param priority {number} 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
        * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
        * @returns {number} 注册事件位置标识id
         * @version Egret 3.0
         * @platform Web,Native
        */
        addEventListener(type: string, callback: Function, thisObject: any, param?: any, priority?: number): number;
        /**
         * @language zh_CN
         * 移除事件侦听器。
         * @param type {string} 事件名。
         * @param callback {Function} 侦听函数。
         * @param thisObject {any} 当前注册对象。
         * @version Egret 3.0
         * @platform Web,Native
         */
        removeEventListener(type: string, callback: Function, thisObject: any): void;
        /**
         * @language zh_CN
         * 移除事件侦听器。
         * @param id  事件id,调用addEventListener的返回值即为事件id.
         * @version Egret 3.0
         * @platform Web,Native
         */
        removeEventListenerAt(id: number): void;
        /**
         * @language zh_CN
         * 移除所有事件侦听器。
         * @version Egret 3.0
         * @platform Web,Native
         */
        clearEventListener(): void;
        /**
        * @language zh_CN
        * 检测是否存在监听器。
        * @param type {string} 事件类型标识符
        * @returns {boolean} 是否存在该类型监视器，true为存在，反之不存在。
         * @version Egret 3.0
         * @platform Web,Native
        */
        containEventListener(type: string): boolean;
        /**
        * @language zh_CN
        * 检测是否存在监听器。
        * @param type {string} 事件名
        * @param callback {Function} 处理事件的侦听器函数
        * @param thisObject {any} 注册对象。
        * @returns {boolean} 是否存在该事件，true为存在，反之不存在。
        * @version Egret 3.0
        * @platform Web,Native
        */
        hasEventListener(type: string, callback?: Function, thisObject?: any): boolean;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.EventManager
    * @classdesc
    * 事件管理。
    * @version Egret 3.0
    * @platform Web,Native
    */
    class EventManager {
        private _canvas;
        private _pickEvent3d;
        private _retRenderList;
        protected _ray: Ray;
        private _view3ds;
        /**
        * @language zh_CN
        * 构造函数
        * @param canvas 画布
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(canvas: Egret3DCanvas);
        /**
        * @language zh_CN
        * 清理EventManager
        * @version Egret 3.0
        * @platform Web,Native
        */
        onClear(): void;
        /**
        * @language zh_CN
        * 清除绑定关系。
        * @version Egret 3.0
        * @platform Web,Native
        */
        onClearListeners(): void;
        /**
         * @language zh_CN
         * 分发事件。
         * @param e {any} 事件参数
         * @param typeStr {string} 事件类型
         * @version Egret 3.0
         * @platform Web,Native
         */
        private sendEvent(e, typeStr, func);
        private initPickEvent3D(typeStr, e, render);
        private clearEvent();
        private onTouchMove(e);
        private onTouchUp(e);
        private onTouchDown(e);
        private onMouseClick(e);
        private onMouseDown(e);
        private onMouseUp(e);
        private onMouseMove(e);
        private onMouseWheel(e);
    }
}
declare module egret3d {
    /**
    * @private
    * @private
    * @class egret3d.ShaderBase
    * @classdesc
    * shader 基类
    */
    class ShaderBase {
        protected index: number;
        protected shadersName: Array<string>;
        protected endShadername: string;
        protected stateChange: boolean;
        /**
        * @language zh_CN
        *
        */
        maxBone: number;
        shaderType: number;
        shader: Shader;
        /**
        * @language zh_CN
        * constructor
        * @param materialData
        * @param usage
        */
        constructor(type: number);
        /**
        * @language zh_CN
        *
        * @param shaderName xxx
        */
        addUseShaderName(shaderName: string): void;
        /**
        * @language zh_CN
        *
        * @param shaderName xxx
        */
        addEndShaderName(shaderName: string): void;
        /**
        * @language zh_CN
        *
        * @returns string
        */
        getShader(passUsage: PassUsage): Shader;
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.VarRegister
    * @classdesc
    * shader 变量 基类
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class VarRegister {
        /**
        * @language zh_CN
        * 值名字
        */
        varName: string;
        /**
        * @language zh_CN
        * 变量名
        */
        name: string;
        /**
        * @language zh_CN
        * 变量属性类型
        */
        key: string;
        /**
        * @language zh_CN
        * 变量类型
        */
        valueType: string;
        /**
        * @language zh_CN
        * 变量值
        */
        value: any;
        /**
        * @language zh_CN
        * usage use
        */
        data: any;
        /**
        * @language zh_CN
        * texture
        */
        texture: ITexture;
        /**
        * @language zh_CN
        * uniform Index
        */
        uniformIndex: any;
        /**
        * @language zh_CN
        * active Texture Index
        */
        activeTextureIndex: number;
        /**
        * @language zh_CN
        * index
        */
        index: number;
        /**
        * @language zh_CN
        * level
        */
        level: string;
        size: number;
        dataType: number;
        normalized: boolean;
        stride: number;
        offset: number;
        offsetIndex: number;
        offsetBytes: number;
        /**
        * @language zh_CN
        * 得到组合后的字符串
        * @param compoments
        */
        var(compoments: string): string;
        /**
        * @language zh_CN
        *
        * @param compoments
        */
        use(compoments?: string): string;
        /**
        * @language zh_CN
        *
        * @returns VarRegister
        */
        clone(): VarRegister;
        protected computeVarName(): void;
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.Attribute
    * @classdesc
    * 变量属性
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Attribute extends VarRegister {
        /**
        * @language zh_CN
        * constructor
        * @param name
        * @param valueType
        */
        constructor(name: string, valueType: string);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.AttributeType
    * @classdesc
    *
    * shader中的变量属性类型
    * @version Egret 3.0
    * @platform Web,Native
    */
    class AttributeType {
        /**
        * shader int类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static int: string;
        /**
        * shader float类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static float: string;
        /**
        * shader vec2类型 两个 float 组成
        * @version Egret 3.0
        * @platform Web,Native
        */
        static vec2: string;
        /**
        * shader vec3类型 三个 float 组成
        * @version Egret 3.0
        * @platform Web,Native
        */
        static vec3: string;
        /**
        * shader vec4类型 四个 float 组成
        * @version Egret 3.0
        * @platform Web,Native
        */
        static vec4: string;
        /**
        * shader 2x2 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mat2: string;
        /**
        * shader 3x3 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mat3: string;
        /**
        * shader 4x4 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mat4: string;
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.ConstVar
    * @classdesc
    * shader中常量类型变量的所有数据
    * 包含变量类型，变量名，变量的值
    *
    * @see egret3d.AttributeType
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ConstVar extends VarRegister {
        /**
        * @language zh_CN
        * 构造
        * @param name 常量名
        * @param valueType 常量类型
        * @param value 常量的值
        */
        constructor(name: string, valueType: string, value: string);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.Sampler2D
    * @classdesc
    *
    * shader中sampler2D类型变量的所有数据
    * 包含变量类型，变量名，变量的值
    *
    * @see egret3d.AttributeType
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Sampler2D extends VarRegister {
        /**
        * @language zh_CN
        * 构造
        * @param name 变量名
        */
        constructor(name: string);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @private
    * @class egret3d.Sampler3D
    * @classdesc
    *
    * shader中samplerCube类型变量的所有数据
    * 包含变量类型，变量名，变量的值
    *
    * @see egret3d.AttributeType
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Sampler3D extends VarRegister {
        /**
        * @language zh_CN
        * 构造
        * @param name 变量名
        */
        constructor(name: string);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.TmpVar
    * @classdesc
    *
    * shader中临时变量类型的所有数据
    * 包含变量类型，变量名，变量的值
    *
    * @see egret3d.AttributeType
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class TmpVar extends VarRegister {
        /**
        * @language zh_CN
        * 构造
        * @param name 变量名
        * @param valueType 变量类型
        */
        constructor(name: string, valueType: string);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.Uniform
    * @classdesc
    *
    * shader中uniform类型的所有数据
    * 包含变量类型，变量名，变量的值
    *
    * @see egret3d.AttributeType
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Uniform extends VarRegister {
        /**
        * @language zh_CN
        * 创建一个Uniform对象
        * @param name 变量名
        * @param valueType 变量类型
        */
        constructor(name: string, valueType: string);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.UniformType
    * @classdesc
    * shader Uniform 变量的类型
    */
    class UniformType {
        /**
        * shader bool类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static bool: string;
        /**
        * shader int类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static int: string;
        /**
        * shader float类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static float: string;
        /**
        * shader vec2类型 两个 float 组成
        * @version Egret 3.0
        * @platform Web,Native
        */
        static vec2: string;
        /**
        * shader vec3类型 三个 float 组成
        * @version Egret 3.0
        * @platform Web,Native
        */
        static vec3: string;
        /**
        * shader vec4类型 四个 float 组成
        * @version Egret 3.0
        * @platform Web,Native
        */
        static vec4: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static bvec2: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static bvec3: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static bvec4: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static ivec2: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static ivec3: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static ivec4: string;
        /**
        * shader 2x2 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mat2: string;
        /**
        * shader 3x3 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mat3: string;
        /**
        * shader 4x4 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mat4: string;
        /**
        * shader 贴图对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        static sampler2D: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static sampleCube: string;
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.VarConstName
    * @classdesc
    * shader 变量 名字定义
    * 用户在写自定义shader时，按照引擎中已经列取出来的变量名进行命名
    */
    class VarConstName {
        static attribute_position: string;
        static attribute_normal: string;
        static attribute_tangent: string;
        static attribute_vertexColor: string;
        static attribute_uv0: string;
        static attribute_uv1: string;
        static varying_pos: string;
        static varying_normal: string;
        static varying_tangent: string;
        static varying_color: string;
        static varying_uv0: string;
        static varying_uv1: string;
        static varying_globalPos: string;
        static varying_lightDir: string;
        static varying_eye: string;
        static uniform_floatv_0: string;
        static uniform_floatv_1: string;
        static uniform_floatv_2: string;
        static uniform_iv_0: string;
        static uniform_iv_1: string;
        static uniform_iv_2: string;
        static uniform_bv_0: string;
        static uniform_bv_1: string;
        static uniform_bv_2: string;
        static uniform_vec2fv_0: string;
        static uniform_vec2fv_1: string;
        static uniform_vec2fv_2: string;
        static uniform_vec3fv_0: string;
        static uniform_vec3fv_1: string;
        static uniform_vec3fv_2: string;
        static uniform_vec4fv_0: string;
        static uniform_vec4fv_1: string;
        static uniform_vec4fv_2: string;
        static uniform_vec2iv_0: string;
        static uniform_vec2iv_1: string;
        static uniform_vec2iv_2: string;
        static uniform_vec3iv_0: string;
        static uniform_vec3iv_1: string;
        static uniform_vec3iv_2: string;
        static uniform_vec4iv_0: string;
        static uniform_vec4iv_1: string;
        static uniform_vec4iv_2: string;
        static uniform_vec2bv_0: string;
        static uniform_vec2bv_1: string;
        static uniform_vec2bv_2: string;
        static uniform_vec3bv_0: string;
        static uniform_vec3bv_1: string;
        static uniform_vec3bv_2: string;
        static uniform_vec4bv_0: string;
        static uniform_vec4bv_1: string;
        static uniform_vec4bv_2: string;
        static uniform_modelMatrix: string;
        static uniform_projectionMatrix: string;
        static uniform_normalMatrix: string;
        static uniform_eye: string;
        static uniform_lightDir: string;
        static texture2D_0: string;
        static texture2D_1: string;
        static texture2D_2: string;
        static texture2D_3: string;
        static texture2D_4: string;
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.Varying
    * @classdesc
    *
    * shader中varying类型的所有数据
    * 包含变量类型，变量名，变量的值
    *
    * @see egret3d.AttributeType
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Varying extends VarRegister {
        /**
        * @language zh_CN
        * 构造函数
        * @param name 变量名
        * @param valueType 变量类型
        */
        constructor(name: string, valueType: string);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.Extension
    * @classdesc
    * 变量属性
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Extension extends VarRegister {
        /**
        * @language zh_CN
        * constructor
        * @param name
        * @param valueType
        */
        constructor(name: string);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.ConstVar
    * @classdesc
    * shader中常量类型变量的所有数据
    * 包含变量类型，变量名，变量的值
    *
    * @see egret3d.DefineVar
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class DefineVar extends VarRegister {
        /**
        * @language zh_CN
        * 构造
        * @param name 常量名
        * @param value 常量的值
        */
        constructor(name: string, value: string);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.VaryingType
    * @classdesc
    * shader中varying 变量 类型
    * @version Egret 3.0
    * @platform Web,Native
    */
    class VaryingType {
        /**
        * shader bool类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static bool: string;
        /**
        * shader int类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static int: string;
        /**
        * shader float类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static float: string;
        /**
        * shader vec2类型 两个 float 组成
        * @version Egret 3.0
        * @platform Web,Native
        */
        static vec2: string;
        /**
        * shader vec3类型 三个 float 组成
        * @version Egret 3.0
        * @platform Web,Native
        */
        static vec3: string;
        /**
        * shader vec4类型 四个 float 组成
        * @version Egret 3.0
        * @platform Web,Native
        */
        static vec4: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static bvec2: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static bvec3: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static bvec4: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static ivec2: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static ivec3: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static ivec4: string;
        /**
        * shader 2x2 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mat2: string;
        /**
        * shader 3x3 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mat3: string;
        /**
        * shader 4x4 矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mat4: string;
        /**
        * shader 贴图对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        static sampler2D: string;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static sampleCube: string;
    }
}
declare module egret3d {
    class ShaderLib {
        static lib: {
            [key: string]: string;
        };
    }
}
declare module egret3d {
    /**
    * @private
    */
    class ShaderPool {
        static programlib: HashMap;
        static vsShaderHashMap: HashMap;
        static fsShaderHashMap: HashMap;
        private static context;
        constructor();
        static register(context: Context3DProxy): void;
        static getGPUShader(shaderType: number, shaderID: string, source: string): Shader;
        static getProgram(vs_shaderID: string, fs_shaderID: string): Program3D;
        private static unRegisterShader(list);
        private static registerProgram(vsShader, fsShader);
        private static unRegisterProgram(vsKey, fsKey);
    }
}
declare module egret3d.GLSL {
    /**
    * @private
    * @class egret3d.ShaderContent
    * @classdesc
    * shader文件解析后的数据内容
    * 每种变量类型都进行了规类
    * 用相应的列表进行存储，这样可以便于shader文件进行合并
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ShaderContent {
        /**
        * @private
        * shader文件名
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        source: string;
        funcNames: Array<string>;
        funcDict: any;
        /**
        * @private
        * 结构体列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        structDict: any;
        structNames: Array<string>;
        /**
        * @private
        * attribute列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        attributeList: Array<Attribute>;
        /**
        * @private
        * varying列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        varyingList: Array<Varying>;
        /**
        * @private
        * uniform列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniformList: Array<Uniform>;
        /**
        * @private
        * const列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        constList: Array<ConstVar>;
        /**
        * @private
        * 临时变量列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        tempList: Array<TmpVar>;
        /**
        * @private
        * sampler2D列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        sampler2DList: Array<Sampler2D>;
        /**
        * @private
        * sampler3D列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        sampler3DList: Array<Sampler3D>;
        extensionList: Array<Extension>;
        defineList: Array<DefineVar>;
        /**
        * @private
        * 增加一个变量对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addVar(sVar: VarRegister): void;
        /**
        * @private
        * 增加一个函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        addFunc(name: string, func: string): void;
        /**
        * @private
        * 增加一个结构体
        * @version Egret 3.0
        * @platform Web,Native
        */
        addStruct(name: string, structStr: string): void;
        /**
        * @private
        * 合并一个shader内容
        * @version Egret 3.0
        * @platform Web,Native
        */
        addContent(otherContent: ShaderContent): void;
        private mergeMainFunc(func1, func2);
        clone(): ShaderContent;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.FuncData
    * @classdesc
    * shader系统工具类，管理所有要用到的shader文件
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ShaderUtil {
        private static _shaderLibs;
        private static _methodLibs;
        private _shaderContentDict;
        private static _instance;
        private vs_begin;
        private vs_end;
        private fs_begin;
        private fs_end;
        /**
        * @language zh_CN
        *
        * 单例
        */
        static instance: ShaderUtil;
        /**
        * @language zh_CN
        * @private
        * 加载shader文件
        */
        load(): void;
        private readShader(str);
        /**
        * @language zh_CN
        * 返回组合shader后的内容
        * @param shaderNameList 要组合的shader名字列表
        * @param usage
        * @returns shader 内容
        */
        fillShaderContent(shaderBase: ShaderBase, shaderNameList: Array<string>, usage: PassUsage): Shader;
        private synthesisShader(content, shaderBase);
        /**
        * @language zh_CN
        *
        * @param att
        */
        static connectAtt(att: GLSL.Attribute): string;
        /**
        * @language zh_CN
        *
        * @param tempVar
        */
        private static connectTemp(tempVar);
        /**
        * @language zh_CN
        *
        * @param struct
        */
        private static connectStruct(struct);
        /**
        * @language zh_CN
        *
        * @param constVar
        */
        private static connectConst(constVar);
        /**
        * @language zh_CN
        *
        * @param varying
        */
        private static connectVarying(varying);
        /**
        * @language zh_CN
        *
        * @param unifrom
        */
        private static connectUniform(unifrom);
        /**
        * @language zh_CN
        *
        * @param sampler
        */
        private static connectSampler(sampler);
        private static connectSampler3D(sampler);
        private static connectExtension(extension);
        private static connectDefine(def);
        private static getTexture2DIndex(i);
    }
}
declare module egret3d {
    class KDData {
        location: number[];
        data: any;
        constructor(location: number[], data?: any);
    }
    class KDTree {
        root: KDNode;
        constructor();
        buildTree(data: KDData[]): void;
        private treeify(points, depth);
    }
    class KDNode {
        private location;
        private axis;
        private subnodes;
        private datum;
        constructor(location: number[], axis: any, subnodes: any, datum: KDData);
        find(target: number[], count: number): any;
        static distance(p0: number[], p1: number[]): number;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.AnimationNode
    * @classdesc
    * 动画效果节点
    * @version Egret 3.0
    * @platform Web,Native
    */
    class AnimationNode {
        /**
        * @language zh_CN
        * 效果节点名
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        /**
        * @language zh_CN
        * 顶点着色器文件名
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertex_ShaderName: {
            [shaderPhase: number]: string[];
        };
        /**
        * @language zh_CN
        * 片断着色器文件名
        * @version Egret 3.0
        * @platform Web,Native
        */
        fragment_ShaderName: {
            [shaderPhase: number]: string[];
        };
        /**
        * @language zh_CN
        * shader attribute 变量列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        attributes: Array<GLSL.VarRegister>;
        /**
        * @language zh_CN
        * 动画状态
        * @version Egret 3.0
        * @platform Web,Native
        */
        state: IAnimationState;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 强制更新了时间之后，follow数据需要更新
        */
        onAnimTimeChange(): void;
        /**
        * @private
        * 导入需要用到的glsl
        */
        protected importShader(isVertex: boolean, phase: number, name: string): void;
        /**
        * @private
        */
        afterBuild(): void;
        /**
        * @private
        */
        initNode(data: ParticleDataNode, arg: any): void;
        /**
        * @private
        */
        update(animTime: number, delay: number, geometry: Geometry): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        upload(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.AnimationCurve
    * @classdesc
    * 具有单一属性的 关键帧动画
    * 通过预计算后，动画信息将会缓存
    * @version Egret 3.0
    * @platform Web,Native
    */
    class AnimationCurve {
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.IAnimationState
    * @classdesc
    * 动画状态机
    * 为粒子系统时,会保存相应的粒子功能节点
    * @version Egret 3.0
    * @platform Web,Native
    */
    interface IAnimationState {
        /**
        * @language zh_CN
        * 动画状态机名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        /**
        * @language zh_CN
        * 动画状态机顶点着色器文件名列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertex_shaders?: {
            [shaderPhaseType: number]: string[];
        };
        /**
        * @language zh_CN
        * 动画状态机片段着色器文件名列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        fragment_shaders?: {
            [shaderPhaseType: number]: string[];
        };
        /**
        * @language zh_CN
        * 新增顶点个数总量
        * @version Egret 3.0
        * @platform Web,Native
        */
        numberOfVertices?: number;
        /**
        * @language zh_CN
        * 新增顶点的长度
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertexSizeInBytes?: number;
        /**
        * @language zh_CN
        * 动画效果节点列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        animNodes?: AnimationNode[];
        /**
        * @language zh_CN
        * 动画关键帧列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        keyFrames?: AnimationCurve[];
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.IAnimation
     * @classdesc
     * 动画接口
     * 动画控制器的基类
     * @version Egret 3.0
     * @platform Web,Native
     */
    interface IAnimation {
        /**
        * @language zh_CN
        * 骨骼动画控制器对象
        * 只有骨骼动画对象才有此接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        skeletonAnimationController?: SkeletonAnimation;
        /**
        * @language zh_CN
        * 粒子动画控制器对象。
        * 只有粒子动画对象才有此接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        particleAnimationController?: ParticleAnimation;
        /**
        * @language zh_CN
        * 属性动画控制器对象。
        * 只有属性动画对象才有此接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        propertyAnimController?: PropertyAnimController;
        /**
        * @language zh_CN
        * 一个完整的动画播放时间周期
        * @version Egret 3.0
        * @platform Web,Native
        */
        loopTime: number;
        /**
        * @language zh_CN
        * 是否为一个循环播放的动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        isLoop: boolean;
        /**
        * @language zh_CN
        * 总时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        animTime: number;
        /**
        * @language zh_CN
        * 帧间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        delay: number;
        /**
        * @language zh_CN
        * 动画播放速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        speed: number;
        /**
        * @private
        * @language zh_CN
        * 更新调度
        * @param time 总时间
        * @param delay 帧间隔时间
        * @param geometry 几何数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, geometry: Geometry): void;
        /**
        * @private
        * @language zh_CN
        * GPU传值调度
        * @version Egret 3.0
        * @platform Web,Native
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): any;
        /**
        * @language zh_CN
        * 播放动画
        * @param animName 动画名称
        * @param speed 播放速度（默认为1）
        * @param reset 是否从头播放
        * @param prewarm 是否预热
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(animName?: string, speed?: number, reset?: boolean, prewarm?: boolean): void;
        /**
        * @language zh_CN
        * 停止动画播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 是否正在播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        isPlay(): boolean;
        /**
        * @language zh_CN
        * 获取动画列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        animStateNames: string[];
        /**
        * @language zh_CN
        * 获取动画节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        animStates: IAnimationState[];
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        addAnimState(animState: IAnimationState): any;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeAnimState(animState: IAnimationState): any;
        /**
        * @language zh_CN
        * 克隆新的IAnimation对象
        * @returns IAnimation 新的IAnimation对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): IAnimation;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class TimerAxis extends EventDispatcher {
        static TIME_EVENT: string;
        protected _timeEvent: Event3D;
        protected _times: Array<number>;
        protected _processTimes: Array<number>;
        protected _timer: number;
        protected _start: boolean;
        constructor();
        start(): void;
        addTimerAxis(time: number): void;
        clearTimerAxis(): void;
        reset(): void;
        update(delay: number, time: number): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.CurveType
    * @classdesc
    * 曲线的类型
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum CurveType {
        /**
        * @language zh_CN
        * 普通的线  直线
        * @version Egret 3.0
        * @platform Web,Native
        */
        Line = 0,
        /**
        * @language zh_CN
        * 贝塞尔曲线
        * @version Egret 3.0
        * @platform Web,Native
        */
        BesselCurve = 1,
    }
    /**
    * @language zh_CN
    * @class egret3d.AnimCurve
    * @classdesc
    * AnimCurve 类为动画曲线，其中包含该曲线的类型，起始结束时刻以及参数
    *
    * @includeExample anim/PropertyAnimation/AnimCurve.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class AnimCurve {
        /**
        * @language zh_CN
        * start.x - end.x 之间 插值y值 使用哪种类型
        * @see egret3d.CurveType
        * @see egret3d.AnimCurve.start
        * @see egret3d.AnimCurve.end
        *
        * @see egret3d.Point
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: CurveType;
        frame: number;
        value: number;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.PropertyAnim
    * @classdesc
    * PropertyAnim 类为曲线动画驱动器，类中保存了各个属性对应的数值曲线数据，通过时间计算某个属性在某时刻的属性数值
    *
    * @includeExample anim/PropertyAnimation/PropertyAnim.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PropertyAnim {
        frameRate: number;
        /**
        * @language zh_CN
        * 播放速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        speed: number;
        /**
        * @language zh_CN
        * 是否循环
        * @version Egret 3.0
        * @platform Web,Native
        */
        isLoop: boolean;
        /**
        * @language zh_CN
        * 动画控制器
        * @version Egret 3.0
        * @platform Web,Native
        */
        proAnimController: PropertyAnimController;
        /**
        * @language zh_CN
        * 动画名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        private _propertyArray;
        private _play;
        private _target;
        private _totalTime;
        private _changeFrameTime;
        private _oldFrameIndex;
        totalTime: number;
        /**
        * @language zh_CN
        * 是否存在某个属性的曲线动画
        * @returns boolean 是否存在
        * @version Egret 3.0
        * @platform Web,Native
        */
        IsExist(property: string): boolean;
        /**
        * @language zh_CN
        * 添加曲线动画数据
        * @param property 属性名  控制 Object3D对象的属性
        * @param keyFrames 曲线动画帧
        * @returns boolean 是否成功
        * @see egret3d.Object3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        addAnimCurve(property: string, keyFrames: AnimCurve[]): boolean;
        /**
        * @language zh_CN
        * 移除曲线动画数据
        * @param property 属性名
        * @returns AnimCurve[] 曲线动画帧
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeAnimCurve(property: string): AnimCurve[];
        /**
        * @language zh_CN
        * 设置属性是否循环播放
        * @param property 属性名
        * @param isLoop 是否循环播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        setPropertyLoop(property: string, isLoop: boolean): void;
        /**
        * @language zh_CN
        * 绑定需要驱动的Object3D对象
        * @param target Object3D对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        bindObject3D(target: Object3D): void;
        private updateBindData(propertyData);
        /**
        * @language zh_CN
        * 播放属性动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(speed: number, reset: boolean): void;
        /**
        * @language zh_CN
        * 停止播放属性动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 设置时间位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取时间位置
        * @returns number 当前时间
        * @version Egret 3.0
        * @platform Web,Native
        //*/
        /**
        * @language zh_CN
        * 更新动画数据
        * @param delay 延迟时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(delay: number): void;
        /**
        * @language zh_CN
        * 克隆属性动画对象
        * @returns PropertyAnim 新的属性动画对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): PropertyAnim;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.PropertyAnimController
    * @classdesc
    * 属性动画控制器 管理 多个 PropertyAnim
    * @see egret3d.PropertyAnim
    * @see egret3d.EventDispatcher
    * @see egret3d.IAnimation
    *
    * @includeExample anim/PropertyAnimation/PropertyAnim.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PropertyAnimController extends EventDispatcher implements IAnimation {
        protected _animTime: number;
        skeletonAnimationController: SkeletonAnimation;
        particleAnimationController: ParticleAnimation;
        /**
        * @language zh_CN
        * 帧间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        delay: number;
        /**
        * @language zh_CN
        * 播放速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        speed: number;
        /**
        * @language zh_CN
        * 一个完整的动画播放时间周期
        * @version Egret 3.0
        * @platform Web,Native
        */
        loopTime: number;
        /**
        * @language zh_CN
        * 是否为一个循环播放的动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        isLoop: boolean;
        /**
        * @language zh_CN
        * 当前动画名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        currentAnimName: string;
        protected _target: Object3D;
        /**
        * @language zh_CN
        * 动画时间
        * @param value 动画时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        *  绑定目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        *  绑定目标
        * @param tar 目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        target: Object3D;
        /**
        * @language zh_CN
        * 动画时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        animTime: number;
        /**
        * @language zh_CN
        *  当前播放动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected current: PropertyAnim;
        protected _proAnimDict: any;
        protected _event3D: AnimationEvent3D;
        /**
        * @language zh_CN
        * 构造函数，创建一个属性动画控制器
        * @param target 控制器的目标对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(target?: Object3D);
        /**
        * @language zh_CN
        * 只有属性动画对象才有此接口
        * @returns PropertyAnimController 动画控制器
        * @version Egret 3.0
        * @platform Web,Native
        */
        propertyAnimController: PropertyAnimController;
        /**
        * @language zh_CN
        * 是否正在播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        isPlay(): boolean;
        /**
        * @language zh_CN
        * 播放骨骼动画
        * @param animName 动画名称
        * @param speed 播放速度
        * @param reset 是否重置
        * @param prewarm 是否预热
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(animName?: string, speed?: number, reset?: boolean, prewarm?: boolean): void;
        /**
        * @language zh_CN
        * 停止骨骼动画播放（停留在第一帧）
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 更新骨骼动画
        * @param time 总时间
        * @param delay 延迟时间
        * @param geometry 该值无效
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, geometry: Geometry): void;
        /**
        * @private
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @language zh_CN
        * 克隆骨骼动画对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): PropertyAnimController;
        /**
        * @language zh_CN
        * 动画名列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        animStateNames: string[];
        /**
        * @language zh_CN
        * 动画状态对象列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        animStates: IAnimationState[];
        /**
        * @private
        */
        addAnimState(animState: IAnimationState): void;
        /**
        * @private
        */
        removeAnimState(animState: IAnimationState): void;
        /**
        * @language zh_CN
        * 添加动画属性对象
        * @param proAnim 动画属性对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addPropertyAnim(proAnim: PropertyAnim): void;
        /**
        * @language zh_CN
        * 移除动画属性对象
        * @param proAnim 动画对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removePropertyAnim(proAnim: PropertyAnim): void;
        /**
        * @private
        */
        doEvent(event: any, target: any): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Joint
    * @classdesc
    * Joint 类表示骨骼关节，属于骨架类的组成部分， Joint类属于骨架实现的内部类，无需直接实例化。
    *
    * @version Egret 3.0
    * @platform Web,Native
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Joint {
        /**
        * @language zh_CN
        * 骨骼名称
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        /**
        * @language zh_CN
        * 父骨骼名称
        * @version Egret 3.0
        * @platform Web,Native
        */
        parent: string;
        /**
        * @language zh_CN
        * 骨骼名称index
        * @version Egret 3.0
        * @platform Web,Native
        */
        index: number;
        /**
        * @language zh_CN
        * 父骨骼索引编号
        * @version Egret 3.0
        * @platform Web,Native
        */
        parentIndex: number;
        /**
        * @language zh_CN
        * 骨骼缩放量
        * @version Egret 3.0
        * @platform Web,Native
        */
        scale: Vector3D;
        /**
        * @language zh_CN
        * 骨骼旋转量
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientation: Quaternion;
        /**
        * @language zh_CN
        * 骨骼平移量
        * @version Egret 3.0
        * @platform Web,Native
        */
        translation: Vector3D;
        /**
        * @language zh_CN
        * 骨骼本地矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        localMatrix: Matrix4_4;
        /**
        * @language zh_CN
        * 骨骼逆矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        inverseMatrix: Matrix4_4;
        /**
        * @language zh_CN
        * 骨骼世界矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        worldMatrix: Matrix4_4;
        /**
        * @language zh_CN
        * 骨骼世界矩阵是否有效
        * @version Egret 3.0
        * @platform Web,Native
        */
        worldMatrixValid: boolean;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 构建骨骼本地矩阵
        * @param scale Vector3D 缩放值
        * @param rotation Vector3D或者Quaternion，旋转数据
        * @param translation Vector3D 位移对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        buildLocalMatrix(scale: Vector3D, rotation: Vector3D | Quaternion, translation: Vector3D): void;
        /**
        * @language zh_CN
        * 构建骨骼逆矩阵
        * @param scale Vector3D 缩放值
        * @param rotation Vector3D或者Quaternion，旋转数据
        * @param translation Vector3D 位移对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        buildInverseMatrix(scale: Vector3D, rotation: Vector3D | Quaternion, translation: Vector3D): void;
        /**
         * @language zh_CN
         * 将此骨骼的信息 赋值给目标
         * @param scale Vector3D 缩放值
         * @param rotation Vector3D或者Quaternion，旋转数据
         * @param translation Vector3D 位移对象
         * @version Egret 3.0
         * @platform Web,Native
         */
        copyTo(node: Object3D, type?: BindAnimType): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Skeleton
    * @classdesc
    * Skeleton 类表示骨架类，其中包含若干个 Joint（骨骼关节） 对象。
    *
    * @version Egret 3.0
    * @platform Web,Native
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Skeleton {
        /**
        * @language zh_CN
        * 骨架包含的骨骼
        * @version Egret 3.0
        * @platform Web,Native
        */
        joints: Array<Joint>;
        /**
        * @language zh_CN
        * 构造函数，创建一套骨骼
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 骨骼数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        jointNum: number;
        /**
        * @language zh_CN
        * 通过名称查找指定骨骼
        * @param name 骨骼名称
        * @returns 骨骼对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        findJoint(name: string): Joint;
        /**
        * @language zh_CN
        * 通过名称查找骨骼索引编号
        * @param name 骨骼名称
        * @returns number 骨骼索引编号
        * @version Egret 3.0
        * @platform Web,Native
        */
        findJointIndex(name: string): number;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.SkeletonPose
    * @classdesc
    * SkeletonPose 类为单帧骨架动画数据，若干个SkeletonPose组合成SkeletonAnimationClip， 做为骨骼骨架序列数据
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class SkeletonPose {
        /**
        * @language zh_CN
        * 骨架包含的骨骼
        * @version Egret 3.0
        * @platform Web,Native
        */
        joints: Array<Joint>;
        /**
        * @language zh_CN
        * 骨骼名字列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        boneNameArray: Array<string>;
        /**
         * @language zh_CN
         * 动画pose里的节点引用字典
         * @version Egret 3.0
         * @platform Web,Native
         */
        jointsDictionary: {
            [boneName: string]: Joint;
        };
        /**
        * @language zh_CN
        * 当前骨架的帧时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        frameTime: number;
        /**
        * @language zh_CN
        * 帧数
        * @version Egret 3.0
        * @platform Web,Native
        */
        frame: number;
        private static _temp_jointMatrix;
        private static _temp_matrixDecomposeA;
        /**
        * @language zh_CN
        * @private
        * 计算当前骨架内所有骨骼的世界矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        calculateJointWorldMatrix(): void;
        private calculateAbsoluteMatrix(joint, joints);
        /**
        * @language zh_CN
        * @private
        * 更新GPU所需的骨骼缓存数据
        * @param skeleton 蒙皮骨骼骨架
        * @returns Float32Array 缓存数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        updateGPUData(skeleton: Skeleton, skeletonMatrixData: Float32Array, offset: Vector3D): Float32Array;
        /**
        * @language zh_CN
        * 通过名称查找指定骨骼
        * @param name 骨骼名称
        * @returns Joint 骨骼对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        findJoint(name: string): Joint;
        /**
        * @language zh_CN
        * 通过名称查找骨骼索引编号
        * @param name 骨骼名称
        * @returns number 骨骼索引编号
        * @version Egret 3.0
        * @platform Web,Native
        */
        findJointIndex(name: string): number;
        /**
        * @language zh_CN
        * @private
        * 重置骨骼世界矩阵;
        * @param name 骨骼名称
        * @returns number 骨骼索引编号
        * @version Egret 3.0
        * @platform Web,Native
        */
        resetWorldMatrix(): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        getLerpSkeletonPose(frame: number, nextFrame: number, weight: number, clip: SkeletonAnimationClip, skeltonPose: SkeletonPose): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        mixAnim(a: SkeletonPose, b: SkeletonPose, weight: number, targetPos: SkeletonPose): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        copySkeletonPose(source: SkeletonPose, targetPos: SkeletonPose): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        initSkeletonPose(a: SkeletonPose, target: SkeletonPose): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.SkeletonAnimationClip
    * @classdesc
    * 骨骼动画剪辑
    * 每个骨骼动画的数据
    * @version Egret 3.0
    * @platform Web,Native
    */
    class SkeletonAnimationClip {
        /**
        * @language zh_CN
        * 每帧的SkeletonPose
        * @version Egret 3.0
        * @platform Web,Native
        */
        poseArray: Array<SkeletonPose>;
        /**
        * @language zh_CN
        * 骨骼名字列表，
        * 可以根据名字列表得到骨骼索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        boneNameArray: Array<string>;
        /**
        * @language zh_CN
        * 动画名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        animationName: string;
        /**
        * @language zh_CN
        * 是否循环
        * @version Egret 3.0
        * @platform Web,Native
        */
        isLoop: boolean;
        /**
        * @language zh_CN
        * @private
        * 流数据解析测试;
        * @version Egret 3.0
        * @platform Web,Native
        */
        sampling: number;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        boneCount: number;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        frameDataOffset: number;
        totalFrame: number;
        totalTime: number;
        frameRate: number;
        loopPose: boolean;
        cycleOffset: number;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        sourceData: ByteArray;
        private _skeletonPose;
        private _temp_scale;
        private _temp_translation;
        private _temp_orientation;
        private _cacheAnimationClip;
        /**
        * @language zh_CN
        * 获取当前播放帧的Pose数据
        * @returns SkeletonPose 当前播放帧的Pose数据
        * @see egret3d.SkeletonPose
        * @version Egret 3.0
        * @platform Web,Native
        */
        currentSkeletonPose: SkeletonPose;
        /**
        * @language zh_CN
        * 用骨头名字查找骨头索引
        * @param name 骨头名字
        * @returns number 骨头索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        findJointIndex(name: string): number;
        /**
        * @language zh_CN
        * @private
        * 增加Pose
        * @param skeletonPose Pose
        * @version Egret 3.0
        * @platform Web,Native
        */
        addSkeletonPose(skeletonPose: SkeletonPose): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        buildInitialSkeleton(boneNameArray: string[], parentBoneNameArray: string[], frameCount: number): void;
        /**
        * @language zh_CN
        * @private
        * 获取骨骼Pose帧
        * @param index 帧索引
        * @returns SkeletonPose 骨骼Pose帧
        * @version Egret 3.0
        * @platform Web,Native
        */
        getSkeletonPose(index: number): SkeletonPose;
        private readSkeletonPose(index, skeletonPose);
        /**
        * @language zh_CN
        * 骨骼数量
        * @returns number 骨骼数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        jointNum: number;
    }
}
declare module egret3d {
    class AnimClipState {
        time: number;
        offset: number;
        totalTime: number;
        totalFrame: number;
        speed: number;
        loop: boolean;
        animation: SkeletonAnimation;
        clip: SkeletonAnimationClip;
        private _frameTime;
        private _frame;
        private _time;
        private _nextframe;
        private _lastframe;
        private _weight;
        private _reStart;
        private _end;
        constructor(clip: SkeletonAnimationClip);
        reset(time: number): void;
        reStart(): void;
        update(delay: number, pose: SkeletonPose): void;
        private cycleTime;
    }
}
declare module egret3d {
    class CrossFadeNode {
        nextName: string;
        crossA: string;
        crossB: string;
        blend_startFrame: number;
        blend_endFrame: number;
        crossB_startFrame: number;
        blendTime: number;
        blendStartTime: number;
        crossA_state: AnimClipState;
        crossB_state: AnimClipState;
        totalTime: number;
    }
    class CrossFade {
        private _crossFades;
        private _currentCrossFadeNode;
        private _lerpAPose;
        private _lerpBPose;
        constructor();
        addCrossFadeNode(fade: CrossFadeNode): void;
        getNextAnim(): string;
        checkCrossFade(currentName: string, lastName: string, anim: {
            [key: string]: AnimClipState;
        }): CrossFadeNode;
        private _frameTime;
        private _frame;
        private _nextFrame;
        private _weight;
        private _offset;
        private _time;
        update(time: number): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.SkeletonAnimationState
    * @classdesc
    * 骨骼动画状态机对象
    * 处理骨骼动画的状态切换
    * @see egret3d.IAnimationState
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class SkeletonAnimationState {
        private _animState;
        private _canTransitionToSelf;
        private _atomic;
        private _crossFade;
        private _time;
        private _weight;
        private _currentCrossFadeNode;
        private _currentState;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        gpuSkeletonPose: SkeletonPose;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        currentAnimName: string;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        nextAnimName: string;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        bindList: {
            [nodeName: string]: {
                type: BindAnimType;
                node: Object3D;
            };
        };
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        animation: SkeletonAnimation;
        /**
        * @language zh_CN
        * 构造函数
        * 创建一个骨骼动画状态机对象
        * @param name 状态名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        addCrossFadeNode(fade: CrossFadeNode): void;
        /**
        * @language zh_CN
        * 添加 SkeletonAnimationClip 对象
        * @param animationClip 添加的动画剪辑对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addAnimClip(clip: SkeletonAnimationClip): void;
        animClip: {
            [key: string]: AnimClipState;
        };
        getCurrentState(): AnimClipState;
        private _reset;
        private _offset;
        private _defaultFade;
        /**
        * @language zh_CN
        * 播放骨骼动画
        * @param name 动画名称
        * @param speed 播放速度
        * @param reset 是否重置
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(name: string, speed?: number, reset?: boolean): void;
        update(time: number, delay: number): void;
        private _lerpAPose;
        private _lerpBPose;
        private mixUpdate(time, delay);
        clone(): SkeletonAnimationState;
    }
}
declare module egret3d {
    enum BindAnimType {
        translate = 0,
        rotation = 1,
        scale = 2,
        translate_rotation = 3,
        translate_scale = 4,
        all = 5,
    }
    /**
    * @language zh_CN
    * @class egret3d.SkeletonAnimation
    * @classdesc
    * SkeletonAnimation 类表示骨骼动画控制类
    *
    * 骨骼动画控制类中管理若干个 SkeletonAnimationClip（骨骼动画） 对象，每个SkeletonAnimationClip对象，都是对*.eam 文件的实例。
    * 此对象会触发 SkeletonAnimationEvent3D 事件
    * @see egret3d.SkeletonAnimationClip
    * @see egret3d.EventDispatcher
    * @see egret3d.IAnimation
    * @see egret3d.SkeletonAnimationEvent3D
    * @includeExample anim/skeletonAnimation/SkeletonAnimation.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class SkeletonAnimation extends EventDispatcher implements IAnimation {
        /**
        * @language zh_CN
        * 一个完整的动画播放时间周期
        * @version Egret 3.0
        * @platform Web,Native
        */
        loopTime: number;
        /**
        * @language zh_CN
        * 总时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        animTime: number;
        /**
        * @language zh_CN
        * 动画速率
        * @version Egret 3.0
        * @platform Web,Native
        */
        static fps: number;
        /**
        * @language zh_CN
        * 播放速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        speed: number;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        event3D: Event3D;
        /**
        * @language zh_CN
        * 是否循环
        * @version Egret 3.0
        * @platform Web,Native
        */
        isLoop: boolean;
        /**
        * @language zh_CN
        * 帧间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        delay: number;
        /**
        * @private
        * @language zh_CN
        * 一个完整的动画播放时间周期
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _loopTime;
        private _skeletonAnimationState;
        private _isPlay;
        private _time;
        private _cacheTime;
        private _movePosition;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(state?: SkeletonAnimationState);
        /**
        * @language zh_CN
        * 骨骼动画对象
        * @returns SkeletonAnimation  骨骼动画对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        skeletonAnimationController: SkeletonAnimation;
        /**
        * @language zh_CN
        * 骨骼动画状态
        * @returns SkeletonAnimationState  骨骼动画状态
        * @version Egret 3.0
        * @platform Web,Native
        */
        state: SkeletonAnimationState;
        /**
        * @language zh_CN
        * 挂载 基于 Object3D 的物体到指定的骨骼或虚拟提上
        * @param nodeName 节点的名字
        * @param type egret3d.BindAnimType
        * @version Egret 3.0
        * @platform Web,Native
        */
        bindToJointPose(nodeName: string, node: Object3D, type?: BindAnimType): void;
        /**
        * @language zh_CN
        * 播放骨骼动画
        * @param animName 动画名称
        * @param speed 播放速度
        * @param reset 是否重置
        * @param prewarm 是否预热
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(animName?: string, speed?: number, reset?: boolean, prewarm?: boolean): boolean;
        /**
        * @language zh_CN
        * 暂停骨骼动画播放（停留在当前帧）
        * @version Egret 3.0
        * @platform Web,Native
        */
        pause(): void;
        /**
        * @language zh_CN
        * 停止骨骼动画播放（停留在第一帧）
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 更新骨骼动画
        * @param time 总时间
        * @param delay 延迟时间
        * @param geometry 该值无效
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, geometry: Geometry): void;
        time: number;
        /**
        * @private
        * @language zh_CN
        * 将骨骼信息更新给GPU
        * @param time 当前时间
        * @param delay 当前帧时间
        * @param usage PassUsage
        * @param geometry 子几何信息
        * @param context3DProxy 上下文信息
        * @param modeltransform 模型矩阵
        * @param camera3D 相机
        * @version Egret 3.0
        * @platform Web,Native
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @language zh_CN
        * 骨架骨骼数量
        * @returns number 骨架骨骼数量，当前默认为48
        * @version Egret 3.0
        * @platform Web,Native
        */
        jointNum: number;
        /**
        * @language zh_CN
        * 当前动画是否正在播放
        * @returns 是否在播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        isPlay(): boolean;
        /**
        * @language zh_CN
        * 克隆当前骨骼动画
        * @returns IAnimation 骨骼动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): IAnimation;
        /**
        * @language zh_CN
        * 添加 SkeletonAnimationClip 对象
        * @param animationClip 添加的动画剪辑对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addSkeletonAnimationClip(clip: SkeletonAnimationClip): void;
        animStateNames: string[];
        animStates: IAnimationState[];
        addAnimState(animState: IAnimationState): void;
        removeAnimState(animState: IAnimationState): void;
        addAnim(clip: SkeletonAnimationClip): void;
        private _cycleEvent;
        private _completeEvent;
        dispatchCycle(): void;
        dispatchComplete(): void;
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.Channel
     * @classdesc
     * Channel 类控制应用程序中的声音，对声音执行更精细的控制。每个声音均分配给一个声道，而且应用程序可以具有混合在一起的多个声道。
     * @version Egret 3.0
     * @platform Web,Native
     */
    class Channel {
        /**
        * @language zh_CN
        * 音量，范围从 0（静音）至 1（最大幅度）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        volume: number;
        /**
        * @language zh_CN
        * 是否循环播放 使声音播放结束时重新开始播放。
        * @version Egret 3.0
        * @platform Web,Native
        */
        loop: boolean;
        /**
        * @language zh_CN
        * 当前播放速度。1.0 正常速度。0.5 半速（更慢）。2.0 倍速（更快）。-1.0 向后。正常速度。-0.5 向后，半速。
        * @version Egret 3.0
        * @platform Web,Native
        */
        pitch: number;
        protected context: any;
        protected sound: Sound;
        private paused;
        private startTime;
        private startOffset;
        protected gain: any;
        protected source: any;
        /**
        * @language zh_CN
        * 创建一个新的 Channel 对象。
        * @param sound {Sound} Sound 对象 音频的数据源。
        * @param {Object} options {any} ["volume":1,"loop":true volume] 回放音量, 0 到 1 ， loop 是否循环播放。
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(sound: Sound, options: any);
        /**
        * @language zh_CN
        * 开始在该声道中播放声音。
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(): void;
        /**
        * @language zh_CN
        * 暂停在该声道中播放声音。
        * @version Egret 3.0
        * @platform Web,Native
        */
        pause(): void;
        /**
        * @language zh_CN
        * 从暂停的位置继续在该声道中播放声音。
        * @version Egret 3.0
        * @platform Web,Native
        */
        unpause(): void;
        /**
        * @language zh_CN
        * 停止在该声道中播放声音。
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        private setLoop(value);
        private setVolume(value);
        private setPitch(value);
        /**
        * @language zh_CN
        * 是否正在播放。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        isPlaying(): boolean;
        /**
        * @language zh_CN
        * 获取音频持续时间。
        * @returns {number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        getDuration(): number;
        protected createSource(): void;
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.Channel3d
     * @classdesc
     * Channel3d 类控制应用程序中 在三维空间中播放的声音。每个声音均分配给一个声道，而且应用程序可以具有混合在一起的多个声道。
     * @version Egret 3.0
     * @platform Web,Native
     */
    class Channel3d extends Channel {
        private _panner;
        private _listener;
        /**
        * @language zh_CN
        * 返回监听者位置。
        * @returns Vector3D 监听者位置。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置监听者位置。
        * @param value Vector3D监听者位置。
        * @version Egret 3.0
        * @platform Web,Native
        */
        listener: Vector3D;
        /**
        * @language zh_CN
        * 构造函数
        * 创建一个新的 Channel3d 对象。
        * @param sound {Sound} Sound 对象 音频的数据源。
        * @param {Object} options {any} ["volume":1,"loop":true volume] 回放音量, 0 到 1 ， loop 是否循环播放。
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(sound: Sound, options: any);
        private _position;
        /**
        * @language zh_CN
        * 三维空间中的位置。
        * @returns {Vector3D}
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 三维空间中的位置。
        * @param opsition {Vector3D}
        * @version Egret 3.0
        * @platform Web,Native
        */
        position: Vector3D;
        private _velocity;
        /**
        * @language zh_CN
        * 传播方向。
        * @returns {Vector3D}
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 传播方向。
        * @param velocity {Vector3D}
        * @version Egret 3.0
        * @platform Web,Native
        */
        velocity: Vector3D;
        private _maxDistance;
        /**
        * @language zh_CN
        * 最大距离。
        * @returns {Vector3D}
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 最大距离，超出这个距离会听不见声音
        * @param max{Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        maxDistance: number;
        private _minDistance;
        /**
        * @language zh_CN
        * 最小距离。
        * @returns {Vector3D}
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 最小距离。
        * @param min{Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        minDistance: number;
        private _rollOffFactor;
        /**
        * @language zh_CN
        * rollOff 系数。
        * @returns {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * rollOff 系数。
        * @param factor {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        rollOffFactor: number;
        protected createSource(): void;
        private fallOff(posOne, posTwo, refDistance, maxDistance, rolloffFactor);
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.Sound
     * @classdesc
     * Sound 类允许您在应用程序中使用声音。</p>
     * 使用 Sound 类可以创建 Sound 对象、将外部 MP3 文件加载到该对象并播放该文件、关闭声音流，以及访问有关声音的数据，如有关流中字节数和 ID3 元数据的信息。</p>
     * 可通过以下项对声音执行更精细的控制：声音源（声音的 Channel 和 Channel3d）用于控制向计算机扬声器输出声音的属性。  </p>
     * @see egret3d.EventDispatcher
     * @version Egret 3.0
     * @platform Web,Native
     */
    class Sound extends EventDispatcher {
        /**
        * @language zh_CN
        * Sound 加載成功事件
        * @version Egret 3.0
        * @platform Web,Native
        */
        static SOUND_SUCCESS: string;
        /**
        * @language zh_CN
        * Sound 加載失敗事件
        * @version Egret 3.0
        * @platform Web,Native
        */
        static SOUND_ERROR: string;
        private isLoaded;
        /**
        * @language zh_CN
        * HTML音频 数据源。
        * @version Egret 3.0
        * @platform Web,Native
        */
        audio: HTMLAudioElement;
        private _buffer;
        /**
        * @language zh_CN
        * Web音频 数据源。
        * @returns {AudioBuffer}
        * @version Egret 3.0
        * @platform Web,Native
        */
        buffer: any;
        private _success;
        private _error;
        private _event;
        /**
        * @language zh_CN
        * 创建一个新的 Sound 对象。一旦某个 Sound 对象加载完成声音文件，就不能再将另一个声音文件加载到该 Sound 对象中。要加载另一个声音文件，请创建新的 Sound 对象。
        * @param {String}   指向外部音频文件的 URL。
        * @param {Function} 一个可选的音频文件加载成功的事件处理函数。
        * @param {Function} 一个可选的音频文件加载失败的事件处理函数。
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(url: string, success?: Function, error?: Function);
        private xhr;
        private loadAudioFile(url);
        private audioLoadend(e);
        private decodeSuccessCallback(buffer);
        private onended(ev);
        private oncanplaythrough(ev);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.AudioManager
    * @classdesc
    * AudioManager 类允许您在应用程序中 播放 HTML5 Audio 和 Web Audio。
    * @includeExample audio/AudioManager.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class AudioManager {
        /**
         * @language zh_CN
         * AudioContext 上下文。
         * @version Egret 3.0
         * @platform Web,Native
         */
        context: any;
        /**
        * @language zh_CN
        * 音量，范围从 0（静音）至 1（最大幅度）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        volume: number;
        /**
        * @language zh_CN
        * 创建一个新的 AudioManager 对象。
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 是否支持 HTML5 Audio tag API。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        hasAudio(): boolean;
        /**
        * @language zh_CN
        * 是否支持 Web Audio API。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        hasAudioContext(): boolean;
        private codecs;
        /**
        * @language zh_CN
        * 浏览器是否可以播放这种音频类型。
        * @param url 指向外部音频文件的 URL。
        * @param audio {HTMLAudioElement} HTMLAudio元素
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        isSupported(url: string, audio: HTMLAudioElement): boolean;
        /**
        * @language zh_CN
        * 生成一个新的 Sound 对象 ，将声音数据加载到 Sound 对象中。
        * @param url {String}   指向外部音频文件的 URL。
        * @param success {Function} 一个可选的音频文件加载成功的事件处理函数。
        * @param error {Function} 一个可选的音频文件加载失败的事件处理函数。
        * @returns {Sound}
        * @version Egret 3.0
        * @platform Web,Native
        */
        createSound(url: string, success?: Function, error?: Function): Sound;
        /**
        * @language zh_CN
        * 生成一个新的 Channel 对象来播放该声音。此方法返回 Channel 对象，访问该对象可停止声音并监控音量。
        * @param sound{Sound} 要播放的声音数据。
        * @param options{any}   ["volume":1,"loop":true volume] 回放音量, 0 到 1 ， loop 是否循环播放。
        * @returns {Channel}
        * @version Egret 3.0
        * @platform Web,Native
        */
        playSound(sound: Sound, options: any): Channel;
        /**
        * @language zh_CN
        * 生成一个新的 Channel3d 对象来播放该声音。此方法返回 Channel3d 对象，访问该对象可停止声音并监控音量。
        * @param sound {Sound}  要播放的声音数据。
        * @param position {Vector3D} 在三维空间中播放的位置。
        * @param options {any} ["volume":1,"loop":true volume] 回放音量, 0 到 1 ， loop 是否循环播放。
        * @returns {Channel}
        * @version Egret 3.0
        * @platform Web,Native
        */
        playSound3d(sound: Sound, position: Vector3D, options: any): Channel3d;
        private static _instance;
        /**
        * @language zh_CN
        * AudioManager类的单例模式，返回一个 AudioManager 对象。
        * @returns AudioManager
        * @version Egret 3.0
        * @platform Web,Native
        */
        static instance: AudioManager;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.ControllerBase
    * @classdesc
    * 控制器 基类, 抽象控制器的一些数据
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ControllerBase {
        protected _autoUpdate: boolean;
        protected _target: Object3D;
        protected _lookAtObject: Object3D;
        protected _origin: Vector3D;
        protected _speed: number;
        /**
        * @language zh_CN
        * 构造函数
        * @param targetObject 控制的目标
        * @param lookAtObject 观察的目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(targetObject?: Object3D, lookAtObject?: Object3D);
        /**
        * @language zh_CN
        * 获取当前的目标
        * @returns Object3D 返回当前的目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置当前的目标
        * @param val 当前的目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        target: Object3D;
        /**
        * @language zh_CN
        * 设置获取当前的观察目标
        * @returns Object3D 观察目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取当前的观察目标
        * @param val 观察目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAtObject: Object3D;
        /**
        * @language zh_CN
        * 获取移动速度
        * @returns number 移动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置移动速度
        * @param val 移动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        speed: number;
        /**
        * @language zh_CN
        * 数据更新
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.LookAtController
    * @classdesc
    * look at 摄像机控制器 。</p>
    * 指定摄像机看向的目标对象。</p>
    * 1.按下鼠标左键并移动鼠标可以使摄像机绕着目标进行旋转。</p>
    * 2.按下键盘的(w s a d) 可以摄像机(上 下 左 右)移动。</p>
    * 3.滑动鼠标滚轮可以控制摄像机的视距。</p>
    *
    * @includeExample controller/ctl/LookAtController.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class LookAtController extends ControllerBase {
        protected _lookAtObject: Object3D;
        protected _origin: Vector3D;
        protected _lookAtPosition: Vector3D;
        private _eyesPos;
        private _up;
        private _eyesLength;
        private _rotaEyesLine;
        private _rotaAngle;
        private _matRot;
        private _quaRot;
        private _tempVec;
        private _matTemp;
        private _mouseDown;
        private _mouseRightDown;
        private _screenMoveStartDetail;
        private _screenMoveDelay;
        private _isUpdate;
        private _elapsed;
        private _xAngle;
        private _ctl;
        private _alt;
        private _shift;
        private _needctl;
        private _needalt;
        private _needshift;
        private _keyArray;
        /**
        * @language zh_CN
        * 目标点偏移
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAtOffset: Vector3D;
        /**
        * @language zh_CN
        * 是否第一人称相机
        * @version Egret 3.0
        * @platform Web,Native
        */
        firstCamera: boolean;
        /**
        * @language zh_CN
        * 控制的目标相机，目标对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(targetObject?: Object3D, lookAtObject?: Object3D, needCtl?: boolean, needAlt?: boolean);
        private mouseMove(m);
        private mouseWheel(m);
        private mouseUp(m);
        private mouseDown(m);
        private touchMove(t);
        private touchUp(m);
        private touchDown(m);
        private keyDown(key);
        private keyUp(key);
        /**
        * @language zh_CN
        * 返回目标的位置
        *
        * @returns 目标的位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置目标坐标
        *
        * @param val 摄像机看向的目标点
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAtPosition: Vector3D;
        /**
        * @language zh_CN
        * 得到目标和相机的距离
        * @returns number 距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置目标和相机的距离
        * @param length 距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        distance: number;
        /**
        * @language zh_CN
        * 得到相机x轴旋转
        * @returns x 旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机x轴旋转
        * @param x 旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationX: number;
        /**
        * @language zh_CN
        * 得到相机x轴旋转
        * @returns y 旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机y轴旋转
        * @param y 旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationY: number;
        /**
        * @language zh_CN
        * 得到相机x轴旋转
        * @returns z 旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机z轴旋转
        * @param z 旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationZ: number;
        /**
        * @language zh_CN
        * 控制器数据更新
        * @param delay 帧间隔
        * @param time 当前时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(delay?: number, time?: number): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.HoverController
    * @classdesc
    * 摄像机控制器 ,实现摄像机平滑移动
    * 指定摄像机看向的目标对象
    * 1.按下鼠标左键并移动鼠标(或手机手指滑动)可以使摄像机绕着目标进行旋转.
    * 2.滑动鼠标滚轮(或双指滑动)可以控制摄像机的视距.
    *
    * 示例:
    * @includeExample controller/ctl/HoverController.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class HoverController extends ControllerBase {
        private _currentPanAngle;
        private _currentTiltAngle;
        private _panAngle;
        private _tiltAngle;
        private _distance;
        private _minPanAngle;
        private _maxPanAngle;
        private _minTiltAngle;
        private _maxTiltAngle;
        private _maxDistance;
        private _minDistance;
        private _steps;
        private _yFactor;
        private _wrapPanAngle;
        private _lookAtPosition;
        private _mouseDown;
        private _mouseRightDown;
        private _keyArray;
        /**
        * @language zh_CN
        * @param targetObject 控制的目标相机，目标对象
        * @param lookAtObject 相机看向的对象
        * @param panAngle y轴旋转
        * @param tiltAngle x轴旋转
        * @param distance 相机距离
        * @param minTiltAngle 最小x轴旋转
        * @param maxTiltAngle 最大x轴旋转
        * @param minPanAngle 最小y轴旋转
        * @param maxPanAngle 最大y轴旋转
        * @param steps 平滑时分为几步
        * @param yFactor 旋转时Y轴的一个相对变化值
        * @param wrapPanAngle 是否开启 PanAngle 角度限制
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(targetObject?: Object3D, lookAtObject?: Object3D, panAngle?: number, tiltAngle?: number, distance?: number, minTiltAngle?: number, maxTiltAngle?: number, minPanAngle?: number, maxPanAngle?: number, steps?: number, yFactor?: number, wrapPanAngle?: boolean);
        private mouseMove(m);
        private mouseWheel(m);
        private mouseUp(m);
        private mouseDown(m);
        private touchMove(t);
        private touchUp(m);
        private touchDown(m);
        private keyDown(key);
        private keyUp(key);
        /**
        * @language zh_CN
        * 返回目标的位置
        *
        * @returns 目标的位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置目标坐标
        *
        * @param val 摄像机看向的目标点
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAtPosition: Vector3D;
        /**
        * @private
        */
        /**
        * @private
        */
        steps: number;
        /**
        * @language zh_CN
        * 得到相机y轴旋转角度
        * @returns 相机y轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机y轴旋转
        * @param val 旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        panAngle: number;
        /**
        * @language zh_CN
        * 得到相机x轴旋转角度
        * @returns 相机x轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机x轴旋转
        * @param val 旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        tiltAngle: number;
        /**
        * @language zh_CN
        * 得到目标和相机的距离
        * @returns 目标和相机的距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置目标和相机的距离
        * @param val 距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        distance: number;
        /**
        * @language zh_CN
        * 得到相机最小y轴旋转角度
        * @returns 相机最小x轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机最小y轴旋转角度
        * @param val 相机最小x轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        minPanAngle: number;
        /**
        * @language zh_CN
        * 得到相机最大y轴旋转角度
        * @returns 相机最大y轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机最大y轴旋转角度
        * @param val 相机最大y轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        maxPanAngle: number;
        /**
        * @language zh_CN
        * 得到相机最小x轴旋转角度
        * @returns 相机最小x轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机最小x轴旋转角度
        * @param val 相机最小x轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        minTiltAngle: number;
        /**
        * @language zh_CN
        * 得到相机最大x轴旋转角度
        * @returns 相机最大x轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机最大x轴旋转角度
        * @param val 相机最大x轴旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        maxTiltAngle: number;
        /**
        * @language zh_CN
        * 得到相机和目标最大的距离
        * @returns 相机和目标最大的距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机和目标最大的距离
        * @param val 相机和目标最大的距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        maxDistance: number;
        /**
        * @language zh_CN
        * 得到相机和目标最小的距离
        * @returns 相机和目标最小的距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机和目标最小的距离
        * @param val 相机和目标最小的距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        minDistance: number;
        /**
        * @private
        */
        /**
        * @private
        */
        yFactor: number;
        /**
        * @private
        */
        /**
        * @private
        */
        wrapPanAngle: boolean;
        /**
        * @language zh_CN
        * 控制器数据更新
        * @param interpolate
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(interpolate?: boolean): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.LookAtController
    * @classdesc
    * 自由 摄像机控制器 。</p>
    * 指定摄像机看向的目标对象。</p>
    * 1.按下鼠标左键并移动鼠标可以使摄像机绕着目标进行旋转。</p>
    * 2.按下键盘的(w s a d) 可以摄像机(上 下 左 右)移动。</p>
    * 3.滑动鼠标滚轮可以控制摄像机的视距。</p>
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class FreeController extends ControllerBase {
        protected dir: Vector3D;
        protected static v0: Vector3D;
        constructor(target?: Object3D);
        protected touchMove(t: TouchEvent3D): void;
        protected mouseWheel(m: MouseEvent3D): void;
        protected mouseMove(m: egret3d.MouseEvent3D): void;
        /**
        * @language zh_CN
        * 控制器数据更新
        * @param delay 帧间隔
        * @param time 当前时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(delay?: number, time?: number): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.HoverController
    * @classdesc
    * 摄像机控制器 ,实现摄像机平滑移动
    * 指定摄像机看向的目标对象
    * 1.按下鼠标左键并移动鼠标(或手机手指滑动)可以使摄像机绕着目标进行旋转.
    * 2.滑动鼠标滚轮(或双指滑动)可以控制摄像机的视距.
    *
    * 示例:
    * @includeExample controller/ctl/HoverController.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PanController extends ControllerBase {
        private _view;
        private _step;
        private _panAngle;
        private _down;
        private _startVec3D;
        private _endVec3D;
        private _currentVec3D;
        private _fixinterpolate;
        private _fix;
        private _final;
        private _rotaAngle;
        private _looat;
        private _dir;
        private _up;
        private _pos;
        private _maxFov;
        private _minFov;
        private _calQua;
        private _useCompass;
        private _gyroCtrlloer;
        /**
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(view: View3D, targe: Object3D);
        private mouseDown(e);
        private mouseUp(e);
        private mouseMove(e);
        private touchDown(e);
        private touchUp(e);
        private touchMove(e);
        private mouseWheel(e);
        useCompass(flag: boolean): void;
        /**
        * @language zh_CN
        * 控制器数据更新
        * @param interpolate
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(interpolate?: boolean): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.CameraAnimationController
    * @classdesc
    * 摄像机动画控制器。
    * 每个摄像机动画绑定一个摄像机，控制摄像机的行为
    * 可以更换绑定的摄像机
    * @see egret3d.Camera3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class CameraAnimationController {
        /**
        * @language zh_CN
        * 动画播放完一个周期的事件
        */
        static EVENT_CAMERA_COMPLETE: string;
        /**
        * @language zh_CN
        * 相机动画每帧数据列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        cameraAnimationFrames: Array<CameraAnimationFrame>;
        /**
        * @language zh_CN
        * 相机动画名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        private _camera;
        private _playing;
        private _playTime;
        private _currentFrameIndex;
        private _loop;
        private _smooth;
        private _cameraAnimationFrame;
        private _event;
        private _quatCurrentFrame;
        private _quatnNextFrame;
        private _quatn;
        /**
        * @language zh_CN
        * 构造函数
        * @param camera 需要一个摄像机对象来创建摄像机动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(camera?: Camera3D);
        /**
        * @language zh_CN
        * 绑定动画控制的相机
        * @param camera
        * @version Egret 3.0
        * @platform Web,Native
        */
        bindCamera(camera: Camera3D): void;
        /**
        * @language zh_CN
        * 播放相机动画 是否循环
        * @param isLoop 是否循环播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(isLoop: boolean): void;
        /**
        * @language zh_CN
        * 停止播放相机动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @private
        * @language zh_CN
        * 数据更新
        * @param time 当前时间
        * @param delay 每帧间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number): void;
    }
    /**
    * @class egret3d.CameraAnimationFrame
    * @private
    * @classdesc
    * 摄像机动画每帧数据
    * @version Egret 3.0
    * @platform Web,Native
    */
    class CameraAnimationFrame {
        /**
        * @language zh_CN
        * 帧时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        time: number;
        /**
        * @language zh_CN
        * 观察时y 轴方向的角度，就是观察范围夹角。
        * @version Egret 3.0
        * @platform Web,Native
        */
        fov: number;
        /**
        * @language zh_CN
        * 旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotation: Vector3D;
        /**
        * @language zh_CN
        * 平移
        * @version Egret 3.0
        * @platform Web,Native
        */
        translation: Vector3D;
        /**
        * @private
        * @language zh_CN
        * 计算时用的矩阵
        */
        matrix: Matrix4_4;
    }
}
declare module egret3d {
    class Reference {
        protected count: number;
        constructor();
        incRef(): void;
        decRef(): void;
        isDispose: boolean;
    }
}
declare module egret3d {
    /**
    * @class egret3d.Context3DProxy
    * @classdesc
    * Context3DProxy 类提供了用于呈现几何定义图形的上下文。</p>
    *
    * 渲染上下文包括一个绘图表面及其关联的资源和状态。</p>
    * Context3DProxy 渲染上下文是一个可编程的管道，基于OpenGL ES 2.0规范。</p>
    * 您可以通过提供适当的顶点和像素片段程序来创建 2D/3D渲染器，不同的平台有不同的硬件限制，对于移动端限制要求比较大。</p>
    * 一个canvas 只能申请一个Context3DProxy。</p>
    *
    * @see egret3d.Program3D
    * @see egret3d.IndexBuffer3D
    * @see egret3d.VertexBuffer3D
    * @see egret3d.Texture2D
    * @see egret3d.Shader
    * @see egret3d.CubeTexture
    * @includeExample core/context/Context3DProxy.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Context3DProxy {
        /**
        * @language zh_CN
        * @private
        * WebGLRenderingContext 的引用
        */
        static gl: WebGLRenderingContext;
        /**
        * @language zh_CN
        * @private
        */
        version: string;
        /**
        * @language zh_CN
        * @private
        * 渲染3D 的驱动设备是否存在，或者丢失。
        * 一般情况下，当切换程序的时候，设备将会丢失，
        * 这个时候就需要快速重新申请设备，并将相应的资源buffer，texture重新提交至显卡
        */
        isLost: boolean;
        private DEPTH_TEST;
        private CULL_FACE;
        private BLEND;
        private blend_Factors_src;
        private blend_Factors_dst;
        private cullingMode;
        private depthCompareMode;
        private program;
        private programChange;
        private cacheVertexPoint;
        private cacheVertexFormat;
        /**
        * @private
        * @language zh_CN
        * reset
        * 重置缓存的状态
        */
        reset(): void;
        /**
        * @private
        * @language zh_CN
        * get GPU Context3DProxy
        * 注册并初始化相关 GPU 参数配置信息
        * 用于设置显卡的相关参数
        */
        register(): void;
        /**
        * @language zh_CN
        * 视口设置定义，用来确定我们定义的视口在canvas中的所在位置
        * @param x 屏幕坐标 X
        * @param y 屏幕坐标 Y
        * @param width  宽度
        * @param height 高度
        * @see egret3d.Egret3DCanvas
        * @version Egret 3.0
        * @platform Web,Native
        */
        viewPort(x: number, y: number, width: number, height: number): void;
        /**
        * @language zh_CN
        * 创建 显卡程序
        * @param vsShader
        * @param fsShader
        * @returns Program3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        creatProgram(vsShader: Shader, fsShader: Shader): Program3D;
        /**
        * @language zh_CN
        * 创建 顶点索引流
        * @param indexData
        * @version Egret 3.0
        * @platform Web,Native
        */
        creatIndexBuffer(indexData: Int16Array): IndexBuffer3D;
        /**
        * @language zh_CN
        * 提交索引数据
        * @param indexBuffer3D 索引buffer
        * @version Egret 3.0
        * @platform Web,Native
        */
        uploadIndexBuffer(indexBuffer3D: IndexBuffer3D): void;
        /**
        * @language zh_CN
        * 创建 顶点数据流
        * @param vertexData
        * @version Egret 3.0
        * @platform Web,Native
        */
        creatVertexBuffer(vertexData: Float32Array, dawType?: number): VertexBuffer3D;
        /**
        * @language zh_CN
        * 提交顶点数据
        * @param vertexBuffer3D 顶点buffer
        * @version Egret 3.0
        * @platform Web,Native
        */
        uploadVertexBuffer(vertexBuffer3D: VertexBuffer3D): void;
        /**
        * @language zh_CN
        * 设置2D纹理状态 来确定贴图的采样方式
        * @param target 指定活动纹理单元的目标纹理
        * @param pname 指定单值纹理参数的标记名
        * @param param 指定 pname 的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        texParameteri(target: number, pname: number, param: number): void;
        /**
        * @language zh_CN
        * 提交2D纹理
        * @param mipLevel
        * @param texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        upLoadTextureData(mipLevel: number, texture: ITexture): void;
        /**
        * @language zh_CN
        * 提交2D压缩纹理，用硬件来解析dds贴图
        * @param mipLevel
        * @param texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        upLoadCompressedTexture2D(mipLevel: number, texture: ContextTexture2D): void;
        /**
        * @language zh_CN
        * 创建 2维贴图 向显卡提交buffer申请 并创建Texture2D对象
        * @returns 创建的Texture2D对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        creatTexture(): WebGLTexture;
        /**
        * @language zh_CN
        * @private
        * @param tex
        * @version Egret 3.0
        * @platform Web,Native
        */
        uploadCubetexture(tex: ContextTexture3D): void;
        /**
        * @language zh_CN
        * @private
        * @param width
        * @param height
        * @param format
        * @version Egret 3.0
        * @platform Web,Native
        */
        createFramebuffer(width: number, height: number, format: FrameBufferFormat, needDepth?: boolean): ContextTexture2D;
        /**
        * @language zh_CN
        * @private
        * @param texture
        * @param enableDepthAndStencil
        * @param surfaceSelector
        * @version Egret 3.0
        * @platform Web,Native
        */
        setRenderToTexture(texture: ContextTexture2D, clean?: boolean, enableDepthAndStencil?: Boolean, surfaceSelector?: number): void;
        /**
        * @language zh_CN
        * 设置渲染缓冲为屏幕
        * @version Egret 3.0
        * @platform Web,Native
        */
        setRenderToBackBuffer(): void;
        /**
        * @language zh_CN
        * 向显卡请求创建顶点shader对象
        * @param source shader代码内容
        * @returns Shader shader对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        creatVertexShader(source: string): Shader;
        /**
        * @language zh_CN
        * 向显卡请求创建片段shader对象
        * @param source shader代码内容
        * @returns Shader shader对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        creatFragmentShader(source: string): Shader;
        /**
        * @language zh_CN
        * 清除渲染buffer
        * @param BUFFER_BIT
        * @version Egret 3.0
        * @platform Web,Native
        */
        clear(BUFFER_BIT: number): void;
        /**
        * @language zh_CN
        * 清除渲染区域的颜色 深度
        * @param r 红色值
        * @param g 绿色值
        * @param b 蓝色值
        * @param a alpha值
        * @version Egret 3.0
        * @platform Web,Native
        */
        clearColor(r: number, g: number, b: number, a: number): void;
        /**
        * @language zh_CN
        * 清除渲染区域的 模板
        * @param stencil 模板值
        * @version Egret 3.0
        * @platform Web,Native
        */
        clearStencil(stencil: number): void;
        /**
        * @language zh_CN
        * 使用显卡着色器
        * @param program 设置当学显卡当前渲染程序
        * @version Egret 3.0
        * @platform Web,Native
        */
        setProgram(program: Program3D): void;
        /**
        * @language zh_CN
        * 获取矩阵变量ID
        * @param program
        * @param name
        * @version Egret 3.0
        * @platform Web,Native
        */
        getUniformLocation(programe3D: Program3D, name: string): any;
        /**
        * @language zh_CN
        * 传值给shader一个float
        * @param location 指明要更改的uniform变量
        * @param x  uniform变量变量值
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform1f(location: any, x: number): void;
        /**
        * @language zh_CN
        * 传值给shader 一个vec3(float, float, float) 也可以是一个vec3数组
        * @param location 指明要更改的uniform变量
        * @param v uniform变量变量值Float32Array[3]
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform1fv(location: any, v: any): void;
        /**
        * @language zh_CN
        * 传值给shader一个int
        * @param location 指明要更改的uniform变量
        * @param x uniform变量变量值
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform1i(location: any, x: number): void;
        /**
        * @language zh_CN
        * 传值给shader一个int数组
        * @param location 指明要更改的uniform变量
        * @param v int数组的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform1iv(location: any, v: Int32Array): void;
        /**
        * @language zh_CN
        * 传值给shader两个float
        * @param location 指明要更改的uniform变量
        * @param x float x 的值
        * @param y float y 的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform2f(location: any, x: number, y: number): void;
        /**
        * @language zh_CN
        * 传值给shader vec(float, float)
        * @param location 指明要更改的uniform变量
        * @param v Float32Array[2]
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform2fv(location: any, v: any): void;
        /**
        * @language zh_CN
        * 传值给shader 两个int值
        * @param location 指明要更改的uniform变量
        * @param x number x 的值
        * @param y number y 的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform2i(location: any, x: number, y: number): void;
        /**
        * @language zh_CN
        * 传值给shader
        * @param location 指明要更改的uniform变量
        * @param v
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform2iv(location: any, v: Int32Array): void;
        /**
        * @language zh_CN
        * 传值给shader 3个float
        * @param location 指明要更改的uniform变量
        * @param x
        * @param y
        * @param z
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform3f(location: any, x: number, y: number, z: number): void;
        /**
        * @language zh_CN
        * 传值给shader vec3(float, float, float)
        * @param location 指明要更改的uniform变量
        * @param v Float32Array[3]
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform3fv(location: any, v: any): void;
        /**
        * @language zh_CN
        * 传值给shader 3个int
        * @param location 指明要更改的uniform变量
        * @param x
        * @param y
        * @param z
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform3i(location: any, x: number, y: number, z: number): void;
        /**
        * @language zh_CN
        * 传值给shader vec3(int, int, int)
        * @param location 指明要更改的uniform变量
        * @param v Int32Array[3]
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform3iv(location: any, v: Int32Array): void;
        /**
        * @language zh_CN
        * 传值给shader 4个float值
        * @param location 指明要更改的uniform变量
        * @param x
        * @param y
        * @param z
        * @param w
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform4f(location: any, x: number, y: number, z: number, w: number): void;
        /**
        * @language zh_CN
        * 传值给shader vec(float, float, float, float)
        * @param location 指明要更改的uniform变量
        * @param v Float32Array[4]
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform4fv(location: any, v: any): void;
        /**
        * @language zh_CN
        * 传值给shader 4个int值
        * @param location 指明要更改的uniform变量
        * @param x
        * @param y
        * @param z
        * @param w
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniform4i(location: any, x: number, y: number, z: number, w: number): void;
        /**
        * @language zh_CN
        * 传值给shader vec4(int, int, int, int)
        * @param location 指明要更改的uniform变量
        * @param v Int32Array[4]
        */
        uniform4iv(location: any, v: Int32Array): void;
        /**
        * @language zh_CN
        * 传值给shader 2 * 2矩阵
        * @param location 指明要更改的uniform变量
        * @param transpose 是否转置
        * @param value 矩阵值 Float32Array[4]
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniformMatrix2fv(location: any, transpose: boolean, value: any): void;
        /**
        * @language zh_CN
        * 传值给shader 3 * 3矩阵
        * @param location 指明要更改的uniform变量
        * @param transpose 是否转置
        * @param value 矩阵值 Float32Array[9]
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniformMatrix3fv(location: any, transpose: boolean, value: any): void;
        /**
        * @language zh_CN
        * 传值给shader 4 * 4矩阵
        * @param location 指明要更改的uniform变量
        * @param transpose 是否转置
        * @param value 矩阵值 Float32Array[16]
        * @version Egret 3.0
        * @platform Web,Native
        */
        uniformMatrix4fv(location: any, transpose: boolean, value: any): void;
        /**
        * @language zh_CN
        * 设置 绘制混合模式
        * @param src
        * @param dst
        * @version Egret 3.0
        * @platform Web,Native
        */
        setBlendFactors(src: number, dst: number): void;
        /**
        * @language zh_CN
        * 设置 绘制剔除模式
        * @param mode
        * @see egret3d.ContextConfig.FRONT
        * @see egret3d.ContextConfig.BACK
        * @version Egret 3.0
        * @platform Web,Native
        */
        setCulling(mode: number): void;
        /**
        * @language zh_CN
        * 开启 深度测试模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        enableDepth(): void;
        /**
        * @language zh_CN
        * 关闭 深度测试模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        disableDepth(): void;
        /**
        * @language zh_CN
        * 开启 剔除面模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        enableCullFace(): void;
        /**
        * @language zh_CN
        * 关闭 剔除面模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        disableCullFace(): void;
        /**
        * @language zh_CN
        * 开启 混合模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        enableBlend(): void;
        /**
        * @language zh_CN
        * 关闭 混合模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        disableBlend(): void;
        /**
        * @language zh_CN
        * 开启 深度模式 及 深度测试比较模式
        * @param flag
        * @param compareMode
        * @version Egret 3.0
        * @platform Web,Native
        */
        depthFunc(compareMode?: number): void;
        /**
        * @language zh_CN
        * 开启 深度模式 及 深度测试比较模式
        * @param flag
        * @param compareMode
        * @version Egret 3.0
        * @platform Web,Native
        */
        enableDepthTest(flag: boolean, compareMode?: number): void;
        /**
        * @language zh_CN
        * 获取顶点着色器变量 索引
        * @param programe
        * @param attribName
        * @returns 着色器变量
        * @version Egret 3.0
        * @platform Web,Native
        */
        getShaderAttribLocation(programe: Program3D, attribName: string): any;
        /**
        * @language zh_CN
        * 指定顶点着色器变量索引及结构
        * @param index 变量索引
        * @param size  数据个数
        * @param dataType  数据类型
        * @param normalized 是否单位化
        * @param stride 字节数
        * @param offset 当前变量字节偏移
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertexAttribPointer(index: number, size: number, dataType: number, normalized: boolean, stride: number, offset: number): void;
        /**
        * @language zh_CN
        * 要激活着色器上的顶点信息
        * @param vertexFormat 顶点格式
        * @param formatLen 顶点要激活的长度
        * @version Egret 3.0
        * @platform Web,Native
        */
        activeAttribPointer(vertexFormat: number, formatLen: number): boolean;
        disAttribPointer(): void;
        /**
        * @language zh_CN
        * @private
        * 实时传入显卡顶点着色器变量数组数据
        * @param floats
        * @param offest
        * @param numLen
        * @version Egret 3.0
        * @platform Web,Native
        */
        setVertexShaderConstData(floats: Float32Array, offest: number, numLen: number): void;
        /**
        * @language zh_CN
        * @private
        * 实时传入显卡片段着色器变量数组数据
        * @param floats
        * @param offest
        * @param numLen
        * @version Egret 3.0
        * @platform Web,Native
        */
        setFragmentShaderConstData(floats: Float32Array, offest: number, numLen: number): void;
        /**
        * @language zh_CN
        * 设置贴图采样 第一个参数并不是类型
        * @param samplerIndex  ContextSamplerType
        * @param uniLocation
        * @param index
        * @param texture
        * @see egret3d.ContextSamplerType
        * @version Egret 3.0
        * @platform Web,Native
        */
        setTexture2DAt(samplerIndex: number, uniLocation: any, index: number, texture: ContextTexture2D): void;
        disableTexture2DAt(samplerIndex: number, uniLocation: number, index: number): void;
        /**
        * @language zh_CN
        * 设置贴图采样 第一个参数并不是类型
        * @param samplerIndex  ContextSamplerType
        * @param uniLocation
        * @param index
        * @param texture
        * @see egret3d.ContextSamplerType
        * @version Egret 3.0
        * @platform Web,Native
        */
        setCubeTextureAt(samplerIndex: number, uniLocation: number, index: number, texture: ContextTexture3D): void;
        /**
        * @language zh_CN
        * @private
        * 设置矩形裁切区域
        * @param rectangle
        * @version Egret 3.0
        * @platform Web,Native
        */
        setScissorRectangle(x: number, y: number, width: number, height: number): void;
        /**
        * @language zh_CN
        * @private
        * 设置模板测试
        * @version Egret 3.0
        * @platform Web,Native
        */
        setStencilReferenceValue(): void;
        /**
        * @language zh_CN
        * @private
        * 设置模板测试
        * @version Egret 3.0
        * @platform Web,Native
        */
        setStencilActions(triangleFace: string, compareMode: string, actionOnBothPass: string, actionOnDepthFail: string, actionOnDepthPassStencilFail: string): void;
        /**
        * @language zh_CN
        * 绑定顶点Buffer
        * @param vertexBuffer
        * @version Egret 3.0
        * @platform Web,Native
        */
        bindVertexBuffer(vertexBuffer: VertexBuffer3D): void;
        /**
       * @language zh_CN
       * 绑定顶点索引Buffer
       * @param vertexBuffer
       * @version Egret 3.0
       * @platform Web,Native
       */
        bindIndexBuffer(indexBuffer: IndexBuffer3D): void;
        /**
        * @language zh_CN
        * 绘制模型元素
        * @param type 图元类型
        * @param first 第一个顶点索引
        * @param length 顶点个数
        * @version Egret 3.0
        * @platform Web,Native
        */
        drawArrays(type: number, first: number, length: number): void;
        /**
        * @language zh_CN
        * 绘制模型元素
        * @param type 图元类型
        * @param indexBuffer 索引数据
        * @param offset 顶点索引偏移 (字节数)
        * @param length 顶点个数
        * @version Egret 3.0
        * @platform Web,Native
        */
        drawElement(type: number, offset: number, length: number): void;
        /**
        * @language zh_CN
        * @private
        * 绘制提交
        * @version Egret 3.0
        * @platform Web,Native
        */
        flush(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.FrameBuffer
    * @classdesc
    * FrameBuffer 类提供了用于呈现几何定义图形的上下文的帧缓冲对象。</p>
    *
    * 渲染上下文包括一个绘图表面及其关联的资源帧缓冲对象。</p>
    * 通过context creatFrameBuffer 来创建，不能直接使用 new 的方式实例化。</p>
    * @see egret3d.Program3D
    * @see egret3d.IndexBuffer3D
    * @see egret3d.VertexBuffer3D
    * @see egret3d.Texture2D
    * @see egret3d.Shader
    * @see egret3d.CubeTexture
    * @version Egret 3.0
    * @platform Web,Native
    */
    class FrameBuffer {
        /**
        * @language zh_CN
        * @private
        * frame buferr 的buffer 名字
        */
        frameBufferName: number;
        /**
        * @language zh_CN
        * @private
        * frame buferr 的 像素宽度
        */
        width: number;
        /**
        * @language zh_CN
        * @private
        * frame buferr 的 像素高度
        */
        height: number;
        /**
        * @language zh_CN
        * @private
        * RenderTexture 的引用
        */
        texture: ContextTexture2D;
    }
}
declare module egret3d {
    /**
    * @class egret3d.IndexBuffer3D
    * @classdesc
    * IndexBuffer3D 用于表示顶点索引列表，由图形子系统保留的图形元素构成。</p>
    *
    * 定义一个立方图纹理，以便在渲染期间使用。立方体贴图可用于多种渲染技术，例如环境图、skyboxes 和 skylight 光照。</p>
    * 不能直接创建 CubeTexture 对象，而应使用 Context3DProxy createCubeTexture()。</p>
    *
    * 由 IndexBuffer3D 对象管理的索引可用于从顶点流中选择顶点。索引为 16 位无符号整数。所允许的最大索引值为 65535 (0xffff)。图形子系统不会保留对提供给此对象的顶点的引用。修改或丢弃上载到此对象中的数据不会影响已存储的值。</p>

    * 无法直接实例化 IndexBuffer3D。使用 Context3DProxy.CreateIndexBuffer() 可创建实例。</p>
    * @see egret3d.Context3DProxy
    * @see egret3d.CubeTexture
    * @version Egret 3.0
    * @platform Web,Native
    */
    class IndexBuffer3D {
        /**
        * @language zh_CN
        * @private
        * WebGLBuffer 的引用
        * @version Egret 3.0
        * @platform Web,Native
        */
        buffer: WebGLBuffer;
        /**
        * @language zh_CN
        * @private
        * buffer
        * @version Egret 3.0
        * @platform Web,Native
        */
        arrayBuffer: Uint16Array;
        /**
        * @language zh_CN
        * 构造
        * @param buffer webglbuffer
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(buffer: WebGLBuffer);
        /**
        * @language zh_CN
        * 释放接口
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.IndexBuffer3D
    * @classdesc
    * IndexBuffer3D 用于表示顶点索引列表，由图形子系统保留的图形元素构成。</p>
    * VertexBuffer3D 类表示上载到渲染上下文的一组顶点数据。</p>
    * 使用 VertexBuffer3D 对象定义与一组顶点中每个点相关联的数据。</p>
    * 您可以从 Vector 数组或 ByteArray 上载顶点数据。（上载完成后，将不再引用原始数组中的数据；更改或放弃源数组不会更改顶点数据。）</p>
    * 与每个顶点相关联的数据采用应用程序定义的格式，并用作顶点着色器程序的输入。</p>
    * 使用 Context3DProxy.vertexAttribPointer  函数标识哪些值属于哪个顶点程序输入。</p>
    * 一个顶点程序最多可以使用 8 个输入（也称为顶点属性寄存器）。</p>
    * 每个输入可能需要 1 到 4 个 32 位值。</p>
    * 例如，一个顶点的 [x,y,z] 位置坐标可以作为包含 3 个 32 位值的矢量传递到顶点程序。</p>
    * 您最多可以为每个点提供 64 个 32 位值（256 字节）数据（但在这种情况下，单个顶点着色器无法使用所有数据）。</p>
    * 注意：由于现在索引是Uint16 所以顶点个数不能超过65535
    * @see egret3d.Context3DProxy
    * @see egret3d.CubeTexture
    * @see egret3d.IndexBuffer3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class VertexBuffer3D {
        /**
        *
        * @language zh_CN
        * @private
        * WebGLBuffer的引用
        * @version Egret 3.0
        * @platform Web,Native
        */
        buffer: WebGLBuffer;
        /**
        * @language zh_CN
        * @private
        */
        arrayBuffer: Float32Array;
        /**
        * @language zh_CN
        * 构造
        * @param buffer WebGLBuffer
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(buffer: WebGLBuffer);
        /**
        * @language zh_CN
        * 释放接口
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.MipmapData
    * @classdesc
    * 一个贴图的不同LOD层级数据。</p>
    * 生成 mipmap 可以使用 TextureUtil.generateMipMaps() 来制作lod mipmapdata。</p>
    *
    *
    * @see egret3d.openGLES.Program3D
    * @see egret3d.openGLES.IndexBuffer3D
    * @see egret3d.openGLES.VertexBuffer3D
    * @see egret3d.openGLES.Texture2D
    * @see egret3d.openGLES.Shader
    * @see egret3d.openGLES.CubeTexture
    * @version Egret 3.0
    * @platform Web,Native
    */
    class MipmapData {
        /**
        *
        * @language zh_CN
        *
        * array buffer类型的 像素值信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        data: Uint8Array;
        /**
        *
        * @language zh_CN
        *
        * 此mipmap的大小宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        *
        * @language zh_CN
        *
        * 此mipmap的大小高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @language zh_CN
        * 创建一个MipmapData 对象
        * @param data 数据内容
        * @param width 宽度
        * @param height 高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(data: Uint8Array, width: number, height: number);
    }
}
declare module egret3d {
    /**
    * @class egret3d.Program3D
    * @classdesc
    * Program3D 类表示上载到渲染上下文的一对渲染程序（也称为“编译后的着色器”）。</p>
    *
    * 由 Program3D 对象管理的程序控制 drawTriangles 调用期间的整个三角形渲染。使用 upload 方法将二进制字节码上载到渲染上下文。（上载完成后，将不再引用原始字节数组中的数据；更改或放弃源字节数组不会更改该程序。）。</p>
    * 这些程序始终由两个相互关联的部分组成：顶点程序和片段程序。</p>
    * 顶点程序会操作 VertexBuffer3D 中定义的数据，负责将顶点投影到剪辑空间，并将任何所需的顶点数据（例如颜色）传递到片段着色器。</p>
    * 片段着色器会操作顶点程序传递给它的属性，并为三角形的每个栅格化片段生成颜色，最终形成像素颜色。请注意，片段程序在 3D 编程文献中具有多个名称，包括片段着色器和像素着色器。</p>
    * 通过将相应 Program3D 实例传递到 Context3DProxy setProgram() 方法，指定后续渲染操作要使用的程序对。</p>
    * 您无法直接创建 Program3D 对象；请改用 Context3DProxy createProgram() 方法。</p>
    *
    * @see egret3d.Program3D
    * @see egret3d.IndexBuffer3D
    * @see egret3d.VertexBuffer3D
    * @see egret3d.Texture2D
    * @see egret3d.Shader
    * @see egret3d.CubeTexture
    * @includeExample core/context/Program3D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Program3D {
        /**
        * @language zh_CN
        * @private
        * WebGLBuffer 的引用
        */
        /**
        * @language zh_CN
        * WebGLProgram 的引用
        * @version Egret 3.0
        * @platform Web,Native
        */
        program: WebGLProgram;
        /**
        * @language zh_CN
        * 构造函数
        * @param pg3D WebGLProgram对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(pg3D: WebGLProgram);
        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.Shader
    * @classdesc
    * Shader 类表示上载到渲染上下文的一对渲染程序中的 顶点找色shader，或片段着色的shader 。</p>
    *
    * shader 是基于 opengl es 2.0 标准 也就是webgl版本的shader着色器。</p>
    *
    * @see egret3d.Program3D
    * @see egret3d.IndexBuffer3D
    * @see egret3d.VertexBuffer3D
    * @see egret3d.Texture2D
    * @see egret3d.Shader
    * @see egret3d.CubeTexture
    * @includeExample core/context/Shader.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Shader {
        /**
        * @language zh_CN
        * @private
        * 声明 shader 为顶点 类型
        * @see egret3d.ShaderPool
        */
        static vertex: number;
        /**
        * @language zh_CN
        * @private
        * 声明 shader 为片段 类型
        * @see egret3d.ShaderPool
        */
        static fragment: number;
        /**
       * @language zh_CN
       * @private
       * 获取已经有的shader 的ID
       */
        static ID_COUNT: number;
        /**
        * @pirvate
        * @language zh_CN
        *
        * 获取已经有的shader 的ID
        */
        id: string;
        /**
        * @language zh_CN
        * @private
        * WebGLShader 的引用
        */
        private _shader;
        /**
        * @language zh_CN
        * 构造
        * @param shader WebGLShader对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(shader: WebGLShader);
        /**
        * @language zh_CN
        * @private
        * WebGLShader 的引用
        */
        shader: WebGLShader;
        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.ContextTexture2D
    * @classdesc
    * Texture 类表示上载到渲染上下文的二维纹理。</p>
    *
    * 定义一个 2D 纹理，以便在渲染期间使用。</p>
    * 无法直接实例化 Texture。使用 Context3DProxy createTexture() 方法创建实例。</p>
    * @see egret3d.Program3D
    * @see egret3d.IndexBuffer3D
    * @see egret3d.VertexBuffer3D
    * @see egret3d.Shader
    * @see egret3d.CubeTexture
    * @see egret3d.Context3DProxy
    * @includeExample core/context/ContextTexture2D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ContextTexture2D {
        /**
       * @language zh_CN
       * @private
       * 提交显卡的 index
       */
        index: number;
        /**
        * @language zh_CN
        * @private
        * 显卡中上传使用的 border 边框像素大小
        */
        border: number;
        /**
        * @language zh_CN
        * @private
        * 纹理贴图的颜色模式
        */
        colorFormat: number;
        /**
        * @language zh_CN
        * @private
        */
        dataFormat: number;
        /**
        * @language zh_CN
        * @private
        * 纹理贴图标准的格式
        */
        internalFormat: InternalFormat;
        /**
        * @language zh_CN
        * @private
        * context.creatTexture()接口生成的GPU纹理
        */
        textureBuffer: WebGLTexture;
        depthBuffer: WebGLTexture;
        /**
         * @language zh_CN
         * 贴图元素对象
        * @version Egret 3.0
        * @platform Web,Native
         */
        imageData: HTMLImageElement;
        /**
        * @language zh_CN
        * mipmap数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        mimapData: Array<MipmapData>;
        /**
         * @private
        */
        frameBuffer: WebGLFramebuffer;
        /**
        * @private
        */
        renderbuffer: WebGLRenderbuffer;
        /**
        * @language zh_CN
        * 提交给显卡的贴图尺寸大小 贴图宽度
        * <p>当作为renderTexture使用时一定要传入真实尺寸
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 提交给显卡的贴图尺寸大小 贴图高度
        * <p>当作为renderTexture使用时一定要传入真实尺寸
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.ContextTexture3D
    * @classdesc
    * 由6加Texture2D 组成
    * 可以使一个6面体上贴出不同的贴图
    * @see egret3d.Program3D
    * @see egret3d.IndexBuffer3D
    * @see egret3d.VertexBuffer3D
    * @see egret3d.ContextTexture2D
    * @see egret3d.Shader
    * @see egret3d.CubeTexture
    * @includeExample core/context/ContextTexture3D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ContextTexture3D {
        /**
       * @language zh_CN
       * @private
       * 提交显卡的 index
        * @version Egret 3.0
        * @platform Web,Native
       */
        index: number;
        /**
        * @language zh_CN
        * @private
        * 显卡中上传使用的 border 边框像素大小
        * @version Egret 3.0
        * @platform Web,Native
        */
        border: number;
        /**
        * @language zh_CN
        * @private
        * 纹理贴图的颜色模式
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorformat: number;
        /**
        * @language zh_CN
        * @private
        * 纹理贴图标准的格式
        * @version Egret 3.0
        * @platform Web,Native
        */
        internalformat: InternalFormat;
        /**
        * @language zh_CN
        * @private
        * context.creatTexture()接口生成的GPU纹理
        * @version Egret 3.0
        * @platform Web,Native
        */
        texture: WebGLTexture;
        /**
        * @language zh_CN
        * 是否使用mipmap
        * @version Egret 3.0
        * @platform Web,Native
        */
        useMipmap: boolean;
        /**
        * @language zh_CN
        * mipmap数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        mimapData: Array<MipmapData>;
        /**
        * @language zh_CN
        * 正面位置的贴图数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_front: ContextTexture2D;
        /**
       * @language zh_CN
       * 背部位置的贴图数据
       * @version Egret 3.0
       * @platform Web,Native
       */
        image_back: ContextTexture2D;
        /**
        * @language zh_CN
        * 左方位置的贴图数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_left: ContextTexture2D;
        /**
        * @language zh_CN
        * 右方位置的贴图数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_right: ContextTexture2D;
        /**
        * @language zh_CN
        * 顶部位置的贴图数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_up: ContextTexture2D;
        /**
        * @language zh_CN
        * 底部位置的贴图数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_down: ContextTexture2D;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Object3D
    * @classdesc
    * 拣选类型，拣选时可以分为，包围盒拣选、模型拣选返回模型拣选到的位置、模型拣选返回模型拣选到的UV坐标
    * 这几种拣选方式
    * 设置鼠标拣选的类型，鼠标拣选不同的类型有不同的效果作用，还有性能
    * 需要的拣选精度越高，性能要求就越高，反之亦然
    *
    * @see egret3d.Picker
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum PickType {
        /**
        * @language zh_CN
        * 包围盒拣选
        * @version Egret 3.0
        * @platform Web,Native
        */
        BoundPick = 0,
        /**
        * @language zh_CN
        * 模型拣选返回模型拣选到的位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        PositionPick = 1,
        /**
        * @language zh_CN
        * 模型拣选返回模型拣选到的UV坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        UVPick = 2,
    }
    /**
    * @language zh_CN
    * @private
    * @class egret3d.BillboardType
    * @classdesc
    * billboard类型
    * @see egret3d.Camera3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum BillboardType {
        /**
        * @language zh_CN
        * 非billboard类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        DISABLE = 0,
        /**
        * @language zh_CN
        * 只允许绕x轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        X_AXIS = 1,
        /**
        * @language zh_CN
        * 只允许绕y轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        Y_AXIS = 2,
        /**
        * @language zh_CN
        * 只允许绕z轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        Z_AXIS = 3,
        /**
        * @language zh_CN
        * 标准的billboard
        * @version Egret 3.0
        * @platform Web,Native
        */
        STANDARD = 4,
    }
    /**
    * @language zh_CN
    * @class egret3d.Object3D
    * @classdesc
    * 3d空间中的实体对象。
    * 场景图中的Object3D对象是一个树型结构，对象中包含了变换信息.
    * 这些变换信息应用于所有的子对象,子对象也有自己的变换信息,最终
    * 的变换信息要结合父对象的变换信息
    * 每个Object3D对象在生成时会创建一个包围盒
    *
    * @see egret3d.Vector3D
    * @see egret3d.Matrix4_4
    * @see egret3d.Quaternion
    * @see egret3d.Bound
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Object3D extends EventDispatcher {
        /**
        * @private
        * @language zh_CN
        * 当前对象名
        * @version Egret 3.0
        * @platform Web,Native
        */
        static s_id: number;
        protected _modelMatrix3D: Matrix4_4;
        protected _localMatrix3D: Matrix4_4;
        protected _transformChange: boolean;
        protected _pos: Vector3D;
        protected _rot: Vector3D;
        protected _sca: Vector3D;
        protected _orientation: Quaternion;
        protected _axis: Vector3D;
        protected _angle: number;
        protected _globalPos: Vector3D;
        protected _globalRot: Vector3D;
        protected _globalSca: Vector3D;
        protected _globalOrientation: Quaternion;
        protected _qut: Quaternion;
        protected _vec: Vector3D;
        protected _active: boolean;
        protected _isRoot: boolean;
        protected _bound: Bound;
        inFrustum: boolean;
        protected static qua0: Quaternion;
        protected static mat0: Matrix4_4;
        protected static v0: Vector3D;
        protected static v1: Vector3D;
        protected static v2: Vector3D;
        protected _displayList: DisplayObject[];
        protected _proAnimation: IAnimation;
        /**
        * @language zh_CN
        * @private
        * 该对象所使用的面向相机模式，默认为关闭状态
        * @see egret3d.BillboardType
        * @version Egret 3.0
        * @platform Web,Native
        */
        billboard: number;
        /**
        * @language zh_CN
        * 属性动画对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 属性动画对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        proAnimation: IAnimation;
        protected setProAnimation(animation: IAnimation): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        renderLayer: number;
        /**
        * @language zh_CN
        * 当前对象名
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        /**
        * @language zh_CN
        * 当前对象id
        * @version Egret 3.0
        * @platform Web,Native
        */
        id: number;
        /**
        * @language zh_CN
        * 渲染层级 。</p>
        * 渲染时分组进行依次渲染 前16位表示tag,后16位表示layer。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        layer: number;
        /**
        * @language zh_CN
        * 渲染层级分类标签
        * @version Egret 3.0
        * @platform Web,Native
        */
        tag: Tag;
        /**
        * @language zh_CN
        * 父亲节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        parent: Object3D;
        /**
        * @language zh_CN
        * 子对象列表。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        childs: Array<Object3D>;
        /**
        * @language zh_CN
        * 是否控制，当摄像机被绑定摄像机动画时，这个值为false.
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        isController: boolean;
        /**
        * @language zh_CN
        * 是否可见
        * @version Egret 3.0
        * @platform Web,Native
        */
        visible: boolean;
        /**
        * @language zh_CN
        * 鼠标拣选类型。</p>
        * 设置鼠标的拣选类型，可通过 PickType来进行设置。</p>
        * 快速拣选默认使用 正方形包围盒子。</p>
        * 高精度型需要 PositionPick ， uv pick 等。</p>
        * @see egret3d.PickType
        * @version Egret 3.0
        * @platform Web,Native
        */
        pickType: PickType;
        /**
        * @language zh_CN
        * 獲取对象模型包围盒。</p>
        * 每个场景物件都需要有的 包围盒子，可以自定义包围盒形状大小，也可以根据模型本身生成。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 設置对象模型包围盒。</p>
        * 每个场景物件都需要有的 包围盒子，可以自定义包围盒形状大小，也可以根据模型本身生成。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        bound: Bound;
        /**
        * @language zh_CN
        * 对象模型当前使用包围盒。
        * @see mouseChilder 根据这个值取不同的包围盒为true取大包围盒 false取子包围盒
        *
        * @version Egret 3.0
        * @platform Web,Native
        */
        currentBound: Bound;
        /**
        * @language zh_CN
        * 鼠标检测数据
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        pickResult: PickResult;
        /**
        * @language zh_CN
        * 是否开启拣选检测。</p>
        * 设定这个物件是否具有 鼠标交互能力的开关。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        enablePick: boolean;
        /**
        * @language zh_CN
        * 是否开启检测LOD盒子，每个物体的碰撞盒子中有一个小的盒子，当开启这个盒子后，
        * 鼠标检测就是用的这个小盒子来进行检测
        * @version Egret 3.0
        * @platform Web,Native
        */
        mouseChildren: boolean;
        /**
        * @language zh_CN
        * 是否开启相机视锥裁剪 默认为true
        * 设定这个物件是否具有 视锥体裁剪功能，为否的话，将永远不参加场景渲染剔除树，无论是否在显示范围内都会进行相关的渲染逻辑运算。</p>
        * @default true
        * @version Egret 3.0
        * @platform Web,Native
        */
        enableCulling: boolean;
        /**
        * @language zh_CN
        * 如果直接实例化这个类，就会生成一个空的3D容器，可以往里添加3D显示对象，作为对象的父级，但是本身没有渲染属性。
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 返回位移。</p> （本地）
        * 获取容器的坐标位置，基于父节点的位置坐标。</p>
        * @returns 位移
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置位移。</p> （本地）
        * 设置基于父节点的位置坐标，当父容器发生变化时，子节点也会变化。</p>
        * @param vec 位移
        * @version Egret 3.0
        * @platform Web,Native
        */
        position: Vector3D;
        /**
        * @language zh_CN
        * 返回旋转。</p> （本地）
        * 获取容器的旋转信息，基于父节点的旋转信息 欧拉角信息。</p>
        * @returns 旋转 欧拉角信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置旋转 。</p> （本地）
        * 设置基于父节点的旋转信息 欧拉角信息，当父容器发生变化时，子节点也会变化。</p>
        * @param vec 旋转 欧拉角信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotation: Vector3D;
        /**
        * @language zh_CN
        * 返回旋转。</p> （本地）
        * 返回 基于四元素的旋转信息。</p>
        * @returns 旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置旋转。</p> （本地）
        * 设置旋转 基于四元素 旋转信息，当父容器发生变化时，子节点也会变化。</p>
        * @param value 旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientation: Quaternion;
        /**
        * @language zh_CN
        * 设置旋转 分量x （本地）
        * @param value 分量x
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientationX: number;
        /**
        * @language zh_CN
        * 设置旋转 分量y （本地）
        * @param value 分量y
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientationY: number;
        /**
        * @language zh_CN
        * 设置旋转 分量z （本地）
        * @param value 分量z
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientationZ: number;
        /**
        * @language zh_CN
        * 设置旋转 分量w （本地）
        * @param value 分量w
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientationW: number;
        /**
        * @language zh_CN
        * 返回缩放。</p> （本地）
        * 返回基于父容器的缩放信息。</p>
        * @returns 缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置缩放。</p> （本地）
        * 设置基于父容器的缩放信息，当父容器发生变化时，子节点也会变化。</p>
        * @param vec 缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        scale: Vector3D;
        /**
        * @language zh_CN
        * 返回x坐标 （本地）
        * 返回基于父容器的位置坐标信息值
        * @returns x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置x坐标。</p> （本地）
        * 设置基于父容器的位置信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        x: number;
        /**
        * @language zh_CN
        * 返回y坐标 （本地）
        *
        * 返回基于父容器的位置坐标信息值
        * @returns y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置y坐标。</p> （本地）
        * 设置基于父容器的位置信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        y: number;
        /**
        * @language zh_CN
        * 返回z坐标 （本地）
        *
        * 返回基于父容器的位置坐标信息值
        * @returns z坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置z坐标。</p> （本地）
        * 设置基于父容器的位置信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value z坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        z: number;
        /**
        * @language zh_CN
        * 返回x旋转 （本地）
        *
        * 返回基于父容器的位置旋转信息值
        * @returns x旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置x轴旋转。</p> （本地）
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value x轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationX: number;
        /**
        * @language zh_CN
        * 返回y旋转 （本地）
        *
        * 返回基于父容器的位置旋转信息值
        * @returns y旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置y轴旋转。</p> （本地）
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value y轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationY: number;
        /**
        * @language zh_CN
        * 返回z旋转 （本地）
        *
        * 返回基于父容器的位置旋转信息值
        * @returns z旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置z轴旋转。</p> （本地）
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value z轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationZ: number;
        /**
        * @language zh_CN
        * 返回x缩放 （本地）
        * 返回基于父容器的缩放信息值
        * @returns x缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置x轴缩放。</p> （本地）
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变
        * @param value x轴缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleX: number;
        /**
        * @language zh_CN
        * 返回y缩放 （本地）
        * 返回基于父容器的缩放信息值
        * @returns y缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置y轴缩放 （本地）
        *
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变
        * @param value y轴缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleY: number;
        /**
        * @language zh_CN
        * 返回z缩放 （本地）
        * 返回基于父容器的缩放信息值
        * @returns z缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置z轴缩放 （本地）
        *
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变
        * @param value z轴缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleZ: number;
        /**
        * @language zh_CN
        * 以axis轴为中心进行旋转
        * 设置基于父容器的旋转信息，数值通过axis的角度进行设置。当父容器发生变化时，子节点也会变化，值不变
        * @param axis 中心轴
        * @param angle 旋转的角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        setRotationFromAxisAngle(axis: Vector3D, angle: number): void;
        /**
        * @language zh_CN
        * 返回 object在世界中的渲染矩阵 （全局）
        * @returns Matrix4_4 世界渲染矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object在世界中的渲染矩阵 （全局）
        * @param matrix 世界矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        modelMatrix: Matrix4_4;
        /**
        * @language zh_CN
        * 返回 object在本地空间中的矩阵 （本地）
        * @returns Matrix4_4 本地空间矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object在本地空间中的矩阵 （本地）
        * @param matrix 本地空间矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        localMatrix: Matrix4_4;
        /**
        * @language zh_CN
        * @private
        * @platform Web,Native
        */
        protected updateModelMatrix(): void;
        protected onUpdateTransform(): void;
        protected onMakeTransform(): void;
        /**
        * @language zh_CN
        * 返回 object 世界位置 x (全局)
        * @returns object 世界位置x
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界位置 x (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalX: number;
        /**
        * @language zh_CN
        * 返回 object 世界位置 y (全局)
        * @returns object 世界位置 y
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界位置 y (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalY: number;
        /**
        * @language zh_CN
        * 返回 object 世界位置 z (全局)
        * @returns object 世界位置 z
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界位置 z (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalZ: number;
        /**
        * @language zh_CN
        * 返回 object 世界位置 （全局）
        * 返回世界坐标系的 全局位置坐标
        * @returns object 世界位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界位置 （全局）
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalPosition: Vector3D;
        /**
        * @language zh_CN
        * 返回 object 世界旋转x (全局)
        * @returns object 世界旋转x
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界旋转 x (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalRotationX: number;
        /**
        * @language zh_CN
        * 返回 object 世界旋转y (全局)
        * @returns object 世界旋转y
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界旋转 y (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalRotationY: number;
        /**
        * @language zh_CN
        * 返回 object 世界旋转z (全局)
        * @returns object 世界旋转z
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界旋转 z (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalRotationZ: number;
        /**
        * @language zh_CN
        * 返回 object 世界旋转 (全局)
        * 返回世界坐标系的 全局旋转信息
        * @returns object 世界旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界旋转 (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalRotation: Vector3D;
        /**
        * @language zh_CN
        * 返回 object 世界缩放 (全局)
        * 返回世界坐标系的 全局缩放信息
        * @returns object 世界缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界缩放 (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalScale: Vector3D;
        /**
        * @language zh_CN
        * 获取 object 世界缩放 x (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界缩放 x (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalScaleX: number;
        /**
        * @language zh_CN
        * 获取 object 世界缩放 y (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界缩放 y (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalScaleY: number;
        /**
        * @language zh_CN
        * 获取 object 世界缩放 z (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界缩放 z (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalScaleZ: number;
        /**
        * @language zh_CN
        * 返回 object 世界旋转 四元数 (全局)
        * 返回世界坐标系的 全局旋转信息，数据类型是 四元数
        * @returns object 世界旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 object 世界旋转 四元数 (全局)
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalOrientation: Quaternion;
        /**
        * @language zh_CN
        * 增加一个子对象,并返回当前子对象。
        * 如果child 本身有父节点 会先进行移除父节点。
        * 在容器中添加子对象，如果有显示接口的，将会放到场景显示树种进行渲染逻辑运算，及渲染
        * @param child 增加的子对象
        * @returns 子对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addChild(child: Object3D): Object3D;
        /**
        * @language zh_CN
        * 增加一个子对象,并返回当前子对象
        * 在容器中添加子对象，如果有显示接口的，将会放到场景显示树种进行渲染逻辑运算，及渲染
        * @param child 增加的子对象
        * @param index 子对象的下标
        * @returns 子对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addChildAt(child: Object3D, index: number): Object3D;
        /**
        * @language zh_CN
        * 返回下标为index的子对象
        * @param index 子对象下标
        * @returns 如果有就返回子对象,否则就返回null.
        * @version Egret 3.0
        * @platform Web,Native
        */
        getChildAt(index: number): Object3D;
        /**
        * @language zh_CN
        * 将一个2D GPU UI对象位置与该3d对象在屏幕位置投射位置相绑定
        * @param ui 需要绑定的2d对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addFollowUI(ui: DisplayObject): void;
        /**
        * @language zh_CN
        * 解除一个2D GPU UI对象位置与该3d对象在屏幕位置投射位置相绑定
        * @param ui 需要解除绑定的2d对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeFollowUI(ui: DisplayObject): void;
        /**
        * @language zh_CN
        * 返回子对象child的下标
        * @param child 子对象
        * @returns 如果有就返回子对象的下标,否则就返回-1.
        * @version Egret 3.0
        * @platform Web,Native
        */
        getChildIndex(child: Object3D): number;
        /**
        * @language zh_CN
        * 返回子对象
        * @param index 索引
        * @returns Object3D 子对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        getChild(index: number): Object3D;
        /**
        * @language zh_CN
        * 移除child子对象 并返回
        * 移除显示列表中的指定对象，如果为空将会返回
        * @param child 子对象
        * @returns Object3D 如果成功就返回child,否则返回null
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeChild(child: Object3D): Object3D;
        /**
        * @language zh_CN
        * 移除下标为index的子对象 并返回
        * @param index 子对象的下标
        * @returns 如果成功就返回child,否则返回null
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeChildAt(index: number): Object3D;
        /**
        * @language zh_CN
        * 移除全部child子对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeAllChild(): void;
        /**
        * @language zh_CN
        * 设置子对象的下标
        * @private
        * @param child 子对象
        * @param index 子对象的下标
        * @version Egret 3.0
        * @platform Web,Native
        */
        setChildIndex(child: Object3D, index: number): void;
        /**
        * @language zh_CN
        * @private
        * 交换对象
        * @param other 交换中的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        swapObject(other: Object3D): void;
        /**
        * @language zh_CN
        * @private
        * 交换对象 包括子节点
        * @param other 交换中的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        swapObjectAndChilds(other: Object3D): void;
        /**
        * @language zh_CN
        * @private
        * 交换子对象的位置
        * @param child1 子对象1
        * @param child2 子对象2
        * @version Egret 3.0
        * @platform Web,Native
        */
        swapChildren(child1: Object3D, child2: Object3D): void;
        /**
        * @language zh_CN
        * @private
        * 交换子对象的位置
        * @param index1 子对象1下标
        * @param index2 子对象2下标
        * @version Egret 3.0
        * @platform Web,Native
        */
        swapChildrenAt(index1: number, index2: number): void;
        /**
        * @language zh_CN
        * 当前对象对视位置 （全局） (修改的是自身的全局变换)
        * @param pos 自身的位置 （全局）
        * @param target 目标的位置 （全局）
        * @param up 向上的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAt(pos: Vector3D, target: Vector3D, up?: Vector3D): void;
        /**
        * @language zh_CN
        * 当前对象对视位置 （本地） (修改的是自身的本地变换)
        * @param pos 自身的位置 （本地）
        * @param target 目标的位置 （本地）
        * @param up 向上的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAtLocal(pos: Vector3D, target: Vector3D, up?: Vector3D): void;
        /**
        * @language zh_CN
        * 看向目标  (会根据目标对象的全局坐标进行改变) (修改的是自身的全局变换)
        * @param target 目标对象 (会根据目标对象的全局坐标进行改变)
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAtTarget(target: Object3D): void;
        /**
        * @language zh_CN
        * 看向目标 (会根据目标对象的本地坐标进行改变) (修改的是自身的本地变换)
        * @param target 目标对象 (会根据目标对象的本地坐标进行改变)
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAtTargetLocal(target: Object3D): void;
        /**
        * @language zh_CN
        * 以Object3D name 来查找Object3D
        * @param name Object3D名字
        * @returns Object3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        findObject3D(name: string): Object3D;
        /**
        * @language zh_CN
        * 以Object3D id 来查找Object3D
        * @param id Object3D id
        * @returns Object3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        findObject3DToID(id: number): Object3D;
        protected updateTransformChange(change: boolean): void;
        /**
        * @language zh_CN
        * 当前对象数据更新
        * @private
        * @param camera 当前渲染的摄相机
        * @param time 当前时间
        * @param delay 每帧时间间隔
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, camera: Camera3D): void;
        /**
        * @language zh_CN
        * 释放所有数据
        * 是否内存中的相关数据连接引用，移除逻辑运算，从主渲染刘表中挪出
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
        /**
        * @language zh_CN
        * 获取当前节点的根节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        root: Object3D;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        copy(other: Object3D): void;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Object3D;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        deepClone(): Object3D;
    }
}
declare module egret3d {
    /**
    * @class egret3d.IRender
    * @classdesc
    * 场景中的可见物体，可渲染的对象。
    * 在渲染之前会将渲染树中对象进行筛选.
    * 只有IRender对象才会进入渲染管线
    * @see egret3d.Object3D
    * @see egret3d.Geometry
    * @version Egret 3.0
    * @platform Web,Native
    */
    class IRender extends Object3D {
        /**
        * @language zh_CN
        * IRender Mesh 类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TYPE_MESH: string;
        /**
        * @language zh_CN
        * IRender Particle 类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TYPE_PARTICLE_EMIT: string;
        /**
        * @language zh_CN
        * IRender Wireframe 类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TYPE_WIREFRAME: string;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        zIndex: number;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 网格信息。</p>
        * geometry 为渲染对象的网格信息 ，渲染对象需要 vertexBuffer  和 indexBuffer 信息 及顶点着色器shade。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected _geometry: Geometry;
        /**
        * @language zh_CN
        * 获取网格信息。</p>
        * geometry 为渲染对象的网格信息 ，渲染对象需要 vertexBuffer  和 indexBuffer 信息 及顶点着色器shade。</p>
        * @returns Geometry 网格信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置网格信息。</p>
        * @param value 网格信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        geometry: Geometry;
        /**
        * @language zh_CN
        * 对象类型。</p>
        * @see egret3d.IRender.TYPE_MESH
        * @see egret3d.IRender.TYPE_PARTICLE_EMIT
        * @see egret3d.IRender.TYPE_WIREFRAME
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: string;
        /**
        * @language zh_CN
        * 渲染排序的参数，数值越大，先渲染</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        drawOrder: number;
        /**
        * @language zh_CN
        * 材质信息。</p>
        * 赋予对象节点可供渲染的材质球属性，让对象加入可渲染实体列表，及渲染对象与对象之间的混合，排序。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected _material: MaterialBase;
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected _multiMaterial: {
            [matID: number]: MaterialBase;
        };
        /**
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected _materialCount: number;
        /**
        * @language zh_CN
        * 动作对象，控制骨骼动画/特效动画等。</p>
        * 可拓展的动画功能属性，动画功能的驱动类总接口。</p>
        * @see egret3d.IAnimation
        * @version Egret 3.0
        * @platform Web,Native
        */
        animation: IAnimation;
        /**
        * @language zh_CN
        * 材质球收到光照影响的灯光组，如果需要动态添加删除灯光的，一定要注意时实性
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected _lightGroup: LightGroup;
        /**
        * @language zh_CN
        * 获取材质 lightGroup 。
        * @returns LightGroup 灯光组
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置材质 lightGroup 。
        * 设置材质球接受的灯光组。
        * @param lightGroup LightGroup
        * @version Egret 3.0
        * @platform Web,Native
        */
        lightGroup: LightGroup;
        /**
        * @language zh_CN
        * 增加一个材质
        * @param id 材质id
        * @param material 模型材质
        * @version Egret 3.0
        * @platform Web,Native
        */
        addSubMaterial(id: number, material: MaterialBase): void;
        /**
        * @language zh_CN
        * 设置材质
        * @param id 材质id
        * @param material 模型材质
        * @version Egret 3.0
        * @platform Web,Native
        */
        setSubMaterial(id: number, material: MaterialBase): void;
        /**
        * @language zh_CN
        * 删除一个材质
        * @param id 材质id
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeSubMaterial(id: number): void;
        /**
        * @language zh_CN
        * 根据id获取对应的材质
        * @param id 材质id
        * @returns MaterialBase 材质信息对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        getMaterial(id: number): MaterialBase;
        /**
        * @language zh_CN
        * 得到所有材质的个数
        * @returns number 个数
        * @version Egret 3.0
        * @platform Web,Native
        */
        materialCount: number;
        /**
        * @language zh_CN
        * 获取材质
        * @returns MaterialBase 材质
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置材质
        * @param mat 材质
        * @version Egret 3.0
        * @platform Web,Native
        */
        material: MaterialBase;
        /**
        * @language zh_CN
        * 获取多材质
        * @returns { [matID: number]: MaterialBase } 多个材质
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置多材质
        * @param multiMat 多个材质
        * @version Egret 3.0
        * @platform Web,Native
        */
        multiMaterial: {
            [matID: number]: MaterialBase;
        };
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, camera: Camera3D): void;
        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.Entity
    * @classdesc
    * 3d空间中的实体对象 extends Object3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Entity extends Object3D {
        bound: any;
        renderLayer: number;
        /**
        * @language zh_CN
        * constructor
        */
        constructor();
    }
}
declare module egret3d {
    /**
    * @class egret3d.Mesh
    * @classdesc
    * 3d模型网格 生成渲染模型
    * 创建一个Mesh网格数据和材质数据是必需的，如果是动态模型就加上动画数据
    * 继承Object3D对象，场景中实体渲染对象
    *
    * @see egret3d.Object3D
    * @see egret3d.Geometry
    * @see egret3d.MaterialBase
    * @see egret3d.IAnimation
    * @see egret3d.SkeletonAnimation
    *
    * 示例:
    * @includeExample core/node/Mesh.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Mesh extends IRender implements IQuadNode {
        protected _aabbBox: QuadAABB;
        /**
        * @language zh_CN
        * 构建一个Mesh对象
        * @param geometry 模型数据
        * @param material 模型材质 默认为null 为null做自动创建一个TextureMaterial
        * @param animation 模型动画 默认为null 没有动画可以不指定
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(geometry: Geometry, material?: MaterialBase, animation?: IAnimation);
        /**
        * @private
        */
        aabb: QuadAABB;
        /**
        * @private
        */
        initAABB(): void;
        private static AABB_TL_1;
        private static AABB_TR_1;
        private static AABB_BL_1;
        private static AABB_BR_1;
        private static AABB_TL_2;
        private static AABB_TR_2;
        private static AABB_BL_2;
        private static AABB_BR_2;
        /**
        * @private
        * 更新绑定盒的全局数据，适用于静态物体
        */
        calcGlobalQuadAABB(): void;
        /**
        * @private
        */
        isTriangle: boolean;
        protected onUpdateTransform(): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        copy(other: Mesh): void;
        /**
        * @language zh_CN
        * 克隆一个模型
        * @returns 克隆后的模型
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Mesh;
        /**
        * @language zh_CN
        * @private
        * 生成包围盒
        */
        protected buildBoundBox(): Bound;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Billboard
    * @classdesc
    * 公告板渲染对象 始终面朝摄像机的面板
    * @includeExample core/node/BilllBoard.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Billboard extends Mesh {
        /**
        * @language zh_CN
        * 构造时传入宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 构造时传入高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @language zh_CN
        * 指定材质，和公告板宽、高，构建一个公告板
        * @param material 渲染材质
        * @param geometry 几何数据，默认参数为null 为null会在内部创建一个PlaneGeometry  自定义PlaneGeometry的时候 请注意创建面的朝向
        * @param width 公告板宽度 默认参数为 100
        * @param height 公告板高度 默认参数为 100
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(material: MaterialBase, geometry?: Geometry, width?: number, height?: number);
        /**
        * @private
        * @language zh_CN
        * 数据更新，不前对象的旋转和摄像机的旋转一致
        * @param camera 当前渲染的摄相机
        * @param time 当前时间
        * @param delay 间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, camera: Camera3D): void;
        /**
        * @language zh_CN
        * @private
        * @param other copy对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copy(other: Billboard): void;
        /**
        * @language zh_CN
        * 克隆当前公告板
        * @returns Billboard 克隆后的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Billboard;
    }
}
declare module egret3d {
    /**
    * @class egret3d.Sky
    * @classdesc
    * 天空可由任意几何图形构成天空。
    * 场景中天空。
    * 可以是6面体cube，以6张无缝结合的贴图构成.
    *
    * @see egret3d.CubeTexture
    * @see egret3d.CubeTextureMaterial
    *
    * 示例:
    * @version Egret 3.0
    * @platform Web,Native
    * @includeExample core/node/Sky.ts
    */
    class Sky extends Mesh {
        /**
        * @language zh_CN
        * 天空的摄像机
        * 天空模型坐标会跟随此摄像机
        * @version Egret 3.0
        * @platform Web,Native
        */
        camera: Camera3D;
        /**
        * @language zh_CN
        * 构建一个天空盒子对象
        * @param geometry 天空模型数据
        * @param material 天空材质
        * @param camera 天空渲染相机
        * @default null
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(geometry: Geometry, material: MaterialBase, camera?: Camera3D);
        /**
        * @language zh_CN
        * 当前对象数据更新，只有在视锥内的对象才会执行此更新
        * @param camera 当前渲染的摄相机
        * @param time 当前时间
        * @param delay 每帧时间间隔
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, camera: Camera3D): void;
        /**
        * @language zh_CN
        * @private
        * @param other copy对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copy(other: Sky): void;
        /**
        * @language zh_CN
        * 克隆当前Sky
        * @returns Sky 克隆后的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Sky;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Wireframe
    * @classdesc
    * 渲染线框 以线的形式渲染顶点。
    * 使用LINES的模式进行渲染。
    * 会使用两个索引来进行渲染一个线段。
    * 实例化一个Wireframe对象之后需要把geometry顶点数据和索引数据填充
    * @see egret3d.Geometry.setVerticesForIndex
    * @see egret3d.Geometry.indexData
    * @see egret3d.Geometry
    * @includeExample core/node/Wireframe.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Wireframe extends IRender {
        /**
        * @language zh_CN
        * 构造函数，输入一个模型，拷贝这个模型的顶点数据，创建一个只绘制边框的渲染对象
        * @param src  画线顶点数据列表 默认为null 没有设置数据 可以调用 this.fromVertexs 或 this.fromGeometry设置数据
        * @param vf 画线顶点数据格式 默认为 VertexFormat.VF_POSITION (x, y, z) 可以加上颜色 VertexFormat.VF_COLOR (r, g, b, a)
        * 每个顶点数据格式必须统一
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(src?: any, vf?: VertexFormat);
        /**
        * @language zh_CN
        * 设置画线顶点数据 规则是把传入的所有点依次连接
        * @param src  画线顶点数据列表
        * @param vf 画线顶点数据格式 默认为 VertexFormat.VF_POSITION (x, y, z) 可以加上颜色 VertexFormat.VF_COLOR (r, g, b, a)
        * 每个顶点数据格式必须统一
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromVertexs(src: any, vf?: VertexFormat): void;
        /**
       * @language zh_CN
       * 设置画线顶点数据 规则是把传入的点两两相连
       * @param src  画线顶点数据列表
       * @param vf 画线顶点数据格式 默认为 VertexFormat.VF_POSITION (x, y, z) 可以加上颜色 VertexFormat.VF_COLOR (r, g, b, a)
       * 每个顶点数据格式必须统一
       * @version Egret 3.0
       * @platform Web,Native
       */
        fromVertexsEx(src: any, vf?: VertexFormat): void;
        /**
        * @language zh_CN
        * 设置画线顶点数据来源为Geometry 规则是按面连接
        * @param geo  画线顶点数据来源 只会用到Geometry 和坐标数据和颜色数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        fromGeometry(geo: Geometry): void;
        /**
        * @language zh_CN
        * @private
        * @param other copy对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copy(other: Wireframe): void;
        /**
        * @language zh_CN
        * @private
        * 克隆当前Wireframe
        * @returns Wireframe 克隆后的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Wireframe;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.Wireframe
    * @classdesc
    * 使用该类实现指定路径画3D线条。
    * 颜色会在起点和终点之间进行平滑插值
    * @see egret3d.Wireframe
    * @includeExample core/node/WireframeLine.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class WireframeLine extends Wireframe {
        private _vb;
        private _ib;
        private _start;
        private _end;
        private _startColor;
        private _endColor;
        /**
        * @language zh_CN
        * 输入起点和终点，创建一个绘制线段的渲染对象
        * @param start 设置线条的起点
        * @param end 设置线条的终点
        * @startColor 设置起始颜色
        * @endColor 设置终点颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(start: Vector3D, end: Vector3D, startColor?: number, endColor?: number);
        /**
        * @language zh_CN
        * 设置线段的起点/终点坐标
        * @param start 设置线条的起点
        * @param end 设置线条的终点
        * @version Egret 3.0
        * @platform Web,Native
        */
        setStartAndEndPosition(start: Vector3D, end: Vector3D): void;
        /**
        * @language zh_CN
        * 设置线段的起点/终点的颜色

        * @startColor 设置线条的起始颜色
        * @endColor 设置终点的颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        setStartAndEndColor(startColor: number, endColor: number): void;
        private updateLine();
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.LODNode
    * @classdesc
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class LODNode {
        lt: number;
        rt: number;
        lb: number;
        rb: number;
        tc: number;
        bc: number;
        lc: number;
        rc: number;
        oc: number;
        center: Vector3D;
        center_0: Vector3D;
        radius: number;
        dh0: number;
        dh1: number;
        dh2: number;
        dh3: number;
        dh4: number;
        dh5: number;
        minDH: number;
        maxDH: number;
        d: number;
        childs: LODNode[];
        parent: LODNode;
        level: number;
        isRender: boolean;
        lodQuadTree: LODQuadTree;
        static v0: any;
        static v1: any;
        static v2: any;
        static v3: any;
        static v4: any;
        static v5: any;
        static v6: any;
        static v7: any;
        static v8: any;
        constructor(parent?: LODNode, lodQuadTree?: LODQuadTree, x?: number, z?: number);
        calculateHeightDiff(): void;
        createNode(lt: number, rt: number, lb: number, rb: number): void;
        protected createBoundSphere(): void;
        static getVertex(index: number, data: any, vertexDatas: any): void;
        protected isNeighbour(lt: number, rt: number, lb: number, rb: number): any;
        protected findNeighbour(root: LODNode, x: number, z: number): void;
        isDivide(camera: Camera3D, lod: number): boolean;
        setIsRender(value: boolean): void;
    }
    /**
    * @private
    * @class egret3d.LODNode
    * @classdesc
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class LODQuadTree {
        /**
        * @language zh_CN
        * lod微调值
        * @version Egret 3.0
        * @platform Web,Native
        */
        lodValue: number;
        /**
        * @language zh_CN
        * 每个节点的包围球半径偏移
        * @version Egret 3.0
        * @platform Web,Native
        */
        offset: number;
        /**
        * @language zh_CN
        * 每个节点的层级
        * @version Egret 3.0
        * @platform Web,Native
        */
        level: number;
        /**
        * @language zh_CN
        * 格子行数
        * @version Egret 3.0
        * @platform Web,Native
        */
        row: number;
        /**
        * @language zh_CN
        * 格子列数
        * @version Egret 3.0
        * @platform Web,Native
        */
        col: number;
        /**
        * @language zh_CN
        * 根节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        root: LODNode;
        enable: boolean;
        private currentNodes;
        private nextNodes;
        private v0;
        private v1;
        vertexDatas: any;
        vertexDatas_0: any;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        static getOrder(size: number): number;
        /**
        * @language zh_CN
        * 构造
        * @param vertex 地形顶点列表
        * @param size 地形格子 行列格子
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(vertex: any, size: number);
        build(index: number, indexBuffer: Uint16Array, camera: Camera3D): number;
        protected mendCracks(index: number, indexBuffer: Uint16Array, node: LODNode, node_0: LODNode, dir: number): number;
        onUpdate(modle: Matrix4_4): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.Terrain
    * @classdesc
    * 地形网格创建
    * 使用地形高度图,生成地形。
    * 通过读取草数据，主要有草密度/宽度/高度/颜色/使用贴图等属性，结合高度图组装成一片草。
    * @see egret3d.ElevationGeometry
    * @see egret3d.ImageTexture
    * @see egret3d.Mesh
    * @includeExample core/node/terrain/Terrain.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Terrain extends Mesh {
        /**
        * @language zh_CN
        * @private
        * lod处理对象
        * @see egret3d.LODQuadTree
        * @version Egret 3.0
        * @platform Web,Native
        */
        lodQuadTree: LODQuadTree;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        cullCamrea: Camera3D;
        private vertex;
        private useLod;
        /**
        * @language zh_CN
        * @private
        * @param other copy对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copy(other: Terrain): void;
        /**
        * @private
        * @language zh_CN
        * 克隆当前地形
        * @returns Terrain 克隆后的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Terrain;
        /**
        * @language zh_CN
        * 构造函数
        * @param heightmap 高度图
        * @param width 地形宽度 默认1000
        * @param height 地形主度 默认100
        * @param depth 地形长度 默认1000
        * @param segmentsW 格子列 默认128
        * @param segmentsH 格子行 默认128
        * @param useLod 是否使用lod  如果使用lod segmentsW和segmentsH必须相等并且是2的n次方
        * @param mat 材质 默认为null
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(heightmap: ImageTexture, width?: number, height?: number, depth?: number, segmentsW?: number, segmentsH?: number, useLod?: boolean, mat?: MaterialBase);
        /**
        * @language zh_CN
        * 返回地形的ElevationGeometry
        * @see egret3d.ElevationGeometry
        * @returns ElevationGeometry 地形网格
        * @version Egret 3.0
        * @platform Web,Native
        */
        terrainGeometry: ElevationGeometry;
        protected onUpdateTransform(): void;
        /**
        * @language zh_CN
        * 开启或关闭LOD
        * @param useLod 开启或关闭
        * @version Egret 3.0
        * @platform Web,Native
        */
        startLOD(useLod: boolean): void;
        /**
        * @language zh_CN
        * @private
        */
        update(time: number, delay: number, camera: Camera3D): void;
    }
}
declare module egret3d.gui {
    /**
    * @private
    */
    class BitmapFont {
        private static _fontTextures;
        constructor();
        /**
        * @private
        */
        static load(data: any): void;
        /**
        * @private
        */
        static getTexture(unicode: number): Texture;
    }
}
declare module egret3d {
    /**
    * @class egret3d.gui.DisplayObject
    * @classdesc 2D显示对象基础类,封装有坐标/尺寸/旋转/缩放/颜色/是否可见/遮罩信息；</p>
    * GUI中鼠标事件的捕获最底层对象。</p>
    * GUI树形结构的封装对象。
    * @includeExample gui/DisplayObject.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class DisplayObject extends EventDispatcher {
        /**
        * @language zh_CN
        * 该对象的属性标记
        */
        id: number;
        /**
        * @language zh_CN
        * 该对象的名字
        */
        name: string;
        /**
        * @private
        * 鼠标检测用的包围盒，不开放使用
        */
        aabb: Rectangle;
        /**
        * @language zh_CN
        * 是否响应鼠标检测
        */
        mouseEnable: boolean;
        /**
        * @language zh_CN
        * 孩子节点是否响应鼠标检测
        */
        mouseChildren: boolean;
        protected _renderText: boolean;
        private _parent;
        private _stage;
        private _childs;
        private _child3Ds;
        protected _rgbNumber: number;
        protected _alphaNumber: number;
        protected _color: ColorTransform;
        protected _pivot: Vector3D;
        protected _pos: Point;
        protected _rot: Vector3D;
        protected _sca: Vector3D;
        protected _globalColor: ColorTransform;
        protected _globalPos: Point;
        protected _globalRot: Vector3D;
        protected _globalSca: Vector3D;
        protected _localMaskRect: Rectangle;
        protected _globalMaskRect: Rectangle;
        protected _orientation: Quaternion;
        protected _globalOrientation: Quaternion;
        protected _localVisible: boolean;
        protected _globalVisible: boolean;
        protected _visibleChange: boolean;
        protected _colorChange: boolean;
        protected _transformChange: boolean;
        protected _maskRectChange: boolean;
        protected _transformInvalid: boolean;
        protected _renderTextInvalid: boolean;
        protected _maskRectInvalid: boolean;
        protected _colorInvalid: boolean;
        protected _textureInvalid: boolean;
        protected _visibleInvalid: boolean;
        private static ThisVector;
        private static ThisPos;
        private static TargetPos;
        /**
        * @private
        * 是否父节点为stage对象，不对外开放
        */
        parentIsStage: boolean;
        constructor();
        /**
        * @language zh_CN
        * 获取鼠标在该显示对象的相对位置X
        * @returns 鼠标x方向位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        mouseX: number;
        /**
        * @language zh_CN
        * 获取鼠标在该显示对象的相对位置Y
        * @returns 鼠标Y方向位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        mouseY: number;
        /**
        * @language zh_CN
        * 获得当前舞台引用
        * @returns 所在舞台对象，有可能为null
        * @version Egret 3.0
        * @platform Web,Native
        */
        stage: QuadStage;
        /**
        * @language zh_CN
        * 获得子节点列表的引用
        * @returns DisplayObject的列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        childs: DisplayObject[];
        /**
        * @language zh_CN
        * 获得父亲节点，有可能为null
        * @returns DisplayObject 2d显示对象引用
        * @version Egret 3.0
        * @platform Web,Native
        */
        parent: DisplayObject;
        /**
        * @language zh_CN
        * 设定渲染类型，指定当前quad是否为textfield
        * @param value 渲染类型，true表示为文本
        * @version Egret 3.0
        * @platform Web,Native
        */
        renderText: boolean;
        /**
        * @language zh_CN
        * @returns 获取显示对象宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设定宽度
        * @param value 宽度的数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 获得像素高度数据
        * @returns 像素高度数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设定像素高度数据
        * @param value 高度数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @language zh_CN
        * 获得注册点x位置
        * @returns 注册点x坐标数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设定注册点x位置
        * @param value 注册点x坐标数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        pivotX: number;
        /**
        * @language zh_CN
        * 获得注册点y位置
        * @returns 注册点y坐标数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设定注册点y位置
        * @param value 注册点y坐标数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        pivotY: number;
        /**
        * @private
        */
        /**
        * @language zh_CN
        * 设定注册点z位置
        * @param value 注册点z坐标数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        pivotZ: number;
        /**
       * @language zh_CN
       * 获得遮罩信息
       * @returns Rectangle 遮罩信息
       * @version Egret 3.0
       * @platform Web,Native
       */
        /**
        * @language zh_CN
        * 设定遮罩范围
        * @param value 遮罩范围，数据将被拷贝进来
        * @version Egret 3.0
        * @platform Web,Native
        */
        mask: Rectangle;
        protected calculateTransform(): void;
        private calculateMask();
        protected onUpdateTransform(): void;
        /**
        * @language zh_CN
        * 添加孩子节点
        * @param object 被添加的孩子节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        addChild(object: DisplayObject): DisplayObject;
        private addObject3D(obj);
        /**
        * @language zh_CN
        * 添加孩子节点至某个index位置
        * @param object 被添加的孩子节点
        * @param index 指定的层级关系index
        * @returns DisplayObject 如果添加成功，返回当前object对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addChildAt(object: DisplayObject, index: number): DisplayObject;
        private doAddChildAt(object, index);
        /**
        * @language zh_CN
        * 移除某个孩子节点
        * @param object 被移除的孩子节点
        * @returns DisplayObject 如果移除成功，返回当前object对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeChild(object: DisplayObject): DisplayObject;
        /**
        * @language zh_CN
        * 移除指定层级的孩子节点
        * @param index 指定的层级
        * @returns DisplayObject 如果移除成功，返回当前object对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeChildAt(index: number): DisplayObject;
        private doRemoveChild(object);
        /**
        * @language zh_CN
        * 交换孩子节点至指定的层级（未实现）
        * @param object 外部传入的将要交换的节点
        * @param index 指定的层级
        * @version Egret 3.0
        * @platform Web,Native
        */
        swapChildIndex(object: DisplayObject, index: number): void;
        /**
        * @language zh_CN、
        * @private
        * 变更舞台信息，从舞台移除或者添加到舞台后触发（不予开发者使用）
        * @param stage 最新的舞台数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        activeStage(stage: QuadStage): void;
        protected onActiveStage(): void;
        /**
        * @language zh_CN
        * 获取某个孩子节点的下标
        * @param object 显示对象
        * @returns number 下标数值，-1代表不含有这个显示对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        hasChild(object: DisplayObject): number;
        /**
        * @language zh_CN
        * 根据下标获取孩子节点
        * @param index 下标
        * @returns DisplayObject 孩子节点，有可能为null
        * @version Egret 3.0
        * @platform Web,Native
        */
        getChildByIndex(index: number): DisplayObject;
        /**
        * @language zh_CN
        * 根据名字获取孩子节点
        * @param name 孩子节点的名字
        * @returns DisplayObject 孩子节点，有可能为null
        * @version Egret 3.0
        * @platform Web,Native
        */
        getChildByName(name: string): DisplayObject;
        /**
        * @language zh_CN
        * 在渲染之前逻辑更新，每帧执行一次
        * @param time 当前运行的总时间
        * @param delay 振间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number): void;
        protected updateMouseAABB(): void;
        protected updateMaskChange(change: boolean): void;
        /**
        * @language zh_CN
        * 设置缩放/旋转/位移信息状态
        * @param change 是否有更新
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected updateTransformChange(change: boolean): void;
        protected updateVisibleChange(change: boolean): void;
        /**
        * @private
        */
        globalVisible: boolean;
        /**
        * @language zh_CN
        * 获取是否可见
        * @returns boolean 是否可见
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置可见信息
        * @param value 是否可见
        * @version Egret 3.0
        * @platform Web,Native
        */
        visible: boolean;
        /**
        * @language zh_CN
        * 设置颜色变换信息状态
        * @param change 是否有更新
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected updateColorChange(change: boolean): void;
        /**
        * @private
        */
        globalX: number;
        /**
        * @private
        * @language zh_CN
        * 返回 object 世界位置 y
        * @returns object 世界位置 y
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalY: number;
        /**
        * @language zh_CN
        * 返回 object 世界位置
        * 返回世界坐标系的 全局位置坐标
        * @returns object 世界位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalPosition: Point;
        /**
        * @private
        * @language zh_CN
        * 设置 object 世界位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @private
        * @language zh_CN
        * 返回 object 世界旋转x
        * @returns object 世界旋转x
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalRotationX: number;
        /**
        * @private
        * @language zh_CN
        * 返回 object 世界旋转y
        * @returns object 世界旋转y
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalRotationY: number;
        /**
        * @private
        * @language zh_CN
        * 返回 object 世界旋转z
        * @returns object 世界旋转z
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalRotationZ: number;
        /**
        * @private
        * @language zh_CN
        * 返回 object 世界旋转
        * 返回世界坐标系的 全局旋转信息
        * @returns object 世界旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalRotation: Vector3D;
        /**
        * @private
        * @language zh_CN
        * 设置 object 世界旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @private
        * @language zh_CN
        * 返回 object 世界缩放
        * 返回世界坐标系的 全局缩放信息
        * @returns object 世界缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalScale: Vector3D;
        /**
        * @private
        * @language zh_CN
        * 获取 object 世界缩放 x
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalScaleX: number;
        /**
        * @private
        * @language zh_CN
        * 获取 object 世界缩放 y
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalScaleY: number;
        /**
        * @private
        * @language zh_CN
        * 获取 object 世界缩放 z
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalScaleZ: number;
        /**
        * @private
        * @language zh_CN
        * 返回 object 世界旋转 四元数
        * 返回世界坐标系的 全局旋转信息，数据类型是 四元素
        * @returns object 世界旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalOrientation: Quaternion;
        /**
        * @private
        */
        globalMask: Rectangle;
        /**
        * @language zh_CN
        * 返回位移。</p>
        * 获取容器的坐标位置，基于父节点的位置坐标。</p>
        * @returns 位移
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置位移。</p>
        * 设置基于父节点的位置坐标，当父容器发生变化时，子节点也会变化。</p>
        * @param vec 位移
        * @version Egret 3.0
        * @platform Web,Native
        */
        position: Point;
        /**
        * @language zh_CN
        * 返回旋转。</p>
        * 获取容器的旋转信息，基于父节点的旋转信息 欧拉角信息。</p>
        * @returns 旋转 欧拉角信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置旋转 。</p>
        * 设置基于父节点的旋转信息 欧拉角信息，当父容器发生变化时，子节点也会变化。</p>
        * @param vec 旋转 欧拉角信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotation: Vector3D;
        /**
        * @language zh_CN
        * 返回旋转。</p>
        * 返回 基于四元素的旋转信息。</p>
        * @returns 旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置旋转。</p>
        * 设置旋转 基于四元素 旋转信息，当父容器发生变化时，子节点也会变化。</p>
        * @param value 旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientation: Quaternion;
        /**
        * @language zh_CN
        * 设置旋转 分量x
        * @param value 分量x
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientationX: number;
        /**
        * @language zh_CN
        * 设置旋转 分量y
        * @param value 分量y
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientationY: number;
        /**
        * @language zh_CN
        * 设置旋转 分量z
        * @param value 分量z
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientationZ: number;
        /**
        * @language zh_CN
        * 设置旋转 分量w
        * @param value 分量w
        * @version Egret 3.0
        * @platform Web,Native
        */
        orientationW: number;
        /**
        * @language zh_CN
        * 返回缩放。</p>
        * 返回基于父容器的缩放信息。</p>
        * @returns 缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置缩放。</p>
        * 设置基于父容器的缩放信息，当父容器发生变化时，子节点也会变化。</p>
        * @param vec 缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        scale: Vector3D;
        /**
        * @language zh_CN
        * 返回x坐标
        * 返回基于父容器的位置坐标信息值
        * @returns x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置x坐标。</p>
        * 设置基于父容器的位置信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        x: number;
        /**
        * @language zh_CN
        * 返回y坐标
        *
        * 返回基于父容器的位置坐标信息值
        * @returns y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置y坐标。</p>
        * 设置基于父容器的位置信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        y: number;
        /**
        * @language zh_CN
        * 返回x旋转
        *
        * 返回基于父容器的位置旋转信息值
        * @returns x旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置x轴旋转。</p>
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value x轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationX: number;
        /**
        * @language zh_CN
        * 返回y旋转
        *
        * 返回基于父容器的位置旋转信息值
        * @returns y旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置y轴旋转。</p>
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value y轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationY: number;
        /**
        * @language zh_CN
        * 返回z旋转
        *
        * 返回基于父容器的位置旋转信息值
        * @returns z旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置z轴旋转。</p>
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变。</p>
        * @param value z轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationZ: number;
        /**
        * @language zh_CN
        * 返回x缩放
        * 返回基于父容器的缩放信息值
        * @returns x缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置x轴缩放。</p>
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变
        * @param value x轴缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleX: number;
        /**
        * @language zh_CN
        * 返回y缩放
        * 返回基于父容器的缩放信息值
        * @returns y缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置y轴缩放
        *
        * 设置基于父容器的旋转信息，当父容器发生变化时，子节点也会变化，值不变
        * @param value y轴缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleY: number;
        /**
        * private
        */
        globalColor: ColorTransform;
        /**
        * @language zh_CN
        * 返回颜色值 0xffffff格式
        * @returns color
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置颜色 0xffffff格式
        * @version Egret 3.0
        * @platform Web,Native
        */
        color: number;
        /**
        * @language zh_CN
        * 获得alpha值，[0,1]之间的一个数
        * @returns number alpha
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置alpha值[0,1]之间的一个数
        * @version Egret 3.0
        * @platform Web,Native
        */
        alpha: number;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class QuadData {
        static singleQuadData: Array<number>;
        static vertexLen: number;
        static posOffest: number;
        static posSize: number;
        static originalOffset: number;
        static originalSize: number;
        static uvRectangleOffest: number;
        static uvRectangleSize: number;
        static rotationOffest: number;
        static rotationSize: number;
        static maskOffset: number;
        static maskSize: number;
        static colorOffest: number;
        static colorSize: number;
        static singleQuadIndex: Array<number>;
        static vertexBytes: number;
        static quadVertexLen: number;
        static buildGeometry(geometry: Geometry, start: number, numberQuad: number): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.Quad
    * @classdesc
    * gui中基础显示单元</p>
    * 在这个class中，主要完成更新顶点数据，更新贴图。</p>
    * @see egret3d.DisplayObject
    * @includeExample gui/Quad.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Quad extends DisplayObject {
        private static FLAG_VALLID_QUAD;
        private static FLAG_IS_VISIBLE;
        private static FLAG_HAS_MASK;
        private static FLAG_HAS_TEXTURE;
        private static FLAG_IS_TEXTFIELD;
        protected _texture: Texture;
        protected _globalIndex: number;
        protected _boolArray: BooleanArray;
        private static IdentityVector;
        private static TempVector;
        private static DefaultUVRect;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * Quad对象中的Texture
        * @returns Quad对象中的Texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * Quad对象中的Texture
        * @param value Quad对象中的Texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        texture: any;
        private setTexture(value);
        /**
        * @language zh_CN
        * 在渲染之前逻辑更新顶点数据，只有发生数据变化才需要更新顶点
        * @param zIndex 在geometry中下标
        * @param geometry 当前quad所在geometry
        * @param globalIndex 全局下标
        * @version Egret 3.0
        * @platform Web,Native
        */
        updateVertices(zIndex: number, geometry: Geometry, globalIndex: number): void;
        protected onActiveStage(): void;
        /**
        * @private
        * @language zh_CN
        * 在渲染之前清理某个下标位置的顶点数据，标记为null状态
        * @param zIndex 在geometry中下标
        * @param geometry 当前quad所在geometry
        * @version Egret 3.0
        * @platform Web,Native
        */
        static clear(zIndex: number, geometry: Geometry): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class GUIEventFire {
        private _finalist;
        private _mouseList;
        private _lastMouseList;
        private _quadStage;
        constructor(quadStage: QuadStage);
        private dispatchMouseEvent(e);
        private onTouchStart(e);
        private onTouchEnd(e);
        private onTouchMove(e);
        private mouseOut(e);
        private mouseDown(e);
        private mouseUp(e);
        private mouseOver(e);
        private mouseMove(e);
        private mouseClick(e);
        fire(): void;
        private getGlobalRect(dis);
        private getMousePickList();
    }
}
declare module egret3d {
    /**
    * @private
    */
    class QuadMesh extends Mesh {
        startQuad: number;
        numberQuad: number;
        id: number;
        quadList: Quad[];
        finalList: Quad[];
        uiMaterial: TextureMaterial;
        guiMethod: GUIMethod;
        constructor(start: number);
        setTexture(index: number, texture: ITexture): void;
    }
    class GUIRootContainer extends Object3D {
        constructor();
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class GUITextureGroup {
        private _textures;
        private _nextIndex;
        static MAX_COUNT: Number;
        constructor();
        /**
        * @language zh_CN
        * @private
        * 注册一张UI贴图，最多支持7张
        * @param texture 将要注册的贴图
        * @returns boolean 是否注册成功
        * @version Egret 3.0
        * @platform Web,Native
        */
        register(texture: Texture): boolean;
        /**
        * @language zh_CN
        * @private
        * 替换一张UI贴图至指定下标位置
        * @param texture 将要注册的贴图
        * @param index 指定下标位置
        * @returns boolean 是否注册成功
        * @version Egret 3.0
        * @platform Web,Native
        */
        replace(texture: Texture, index: number): Texture;
        /**
        * @language zh_CN
        * @private
        * 渲染之前，将贴图信息绑定至mesh中
        * @param mesh 绑定至目标mesh对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        activeTexture(mesh: QuadMesh): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.QuadStage
    * @classdesc
    * GUI的舞台对象，引擎会自动创建该对象
    * @see egret3d.QuadStage
    * @version Egret 3.0
    * @platform Web,Native
    */
    class QuadStage extends EventDispatcher {
        static moreQuad: number;
        private _childList;
        private _quadMeshs;
        private _quadCurHistory;
        private _quadLastHistory;
        private _textureGroup;
        private _view3D;
        private _guiEventFire;
        private _renderListInvalid;
        private _guiContainer;
        x: number;
        y: number;
        width: number;
        height: number;
        quadList: Quad[];
        /**
        * @private
        * @constructor
        * @classdesc
        * gui中基础的2d显示单元</p>
        * 在这个class中，主要完成更新顶点数据。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(view3D: View3D);
        /**
        * @private
        * @language zh_CN
        * 注册ui用到的贴图素材源，最多7张。
        * @param texture gui所用到的贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        registerTexture(texture: Texture): boolean;
        changeCamera(): void;
        private creatQuadMesh();
        private getChildQuads(displayObject, quadChilds);
        /**
        * @private
        * @language zh_CN
        * 添加孩子到舞台上
        * @param object 添加的2d显示对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addChild(object: DisplayObject): void;
        /**
        * @private
        * @language zh_CN
        * 标记当前渲染队列需要重新计算
        * @version Egret 3.0
        * @platform Web,Native
        */
        setRenderListInvalid(): void;
        private updateRenderList();
        /**
        * @private
        * @language zh_CN
        * 从舞台上移除某个孩子节点
        * @param object 添加的2d显示对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeChild(object: DisplayObject): void;
        /**
        * @private
        * @language zh_CN
        * 在渲染之前逻辑更新，每帧执行一次
        * @param time 当前运行的总时间
        * @param delay 振间隔时间
        * @param context3DProxy 上下文引用
        * @param view3D 视图引用
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, context3DProxy: Context3DProxy, view3D: View3D): void;
        private clearInvalidVertices(count);
    }
}
declare module egret3d.gui {
    /**
    * @private
    * @class egret3d.GUISkinManager
    * @classdesc
    * gui的默认皮肤管理器
    * @see egret3d.TextureResourceManager
    * @version Egret 3.0
    * @platform Web,Native
    */
    class GUISkinManager {
        private static _instance;
        private _defaultSkinTexture;
        constructor();
        /**
        * @private
        * 获取默认贴图
        * @param skinName 根据皮肤名称获取默认的Texture
        * @returns Texture 获取到的默认贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        getDefaultSkin(skinName: string): Texture;
        /**
        * @private
        * 初始化该管理器
        * @version Egret 3.0
        * @platform Web,Native
        */
        initDefaultSkin(): void;
        /**
        * @private
        * 设置默认皮肤对应的贴图
        * @param skinName 默认的皮肤名
        * @param texture 默认皮肤对应的贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        setDefaultSkin(skinName: string, texture: any): void;
        /**
        * @private
        * 获取单例
        * @param skinName 默认的皮肤名
        * @returns SkinManager 管理器的蛋例
        * @version Egret 3.0
        * @platform Web,Native
        */
        static instance: GUISkinManager;
    }
    /**
    * @private
    */
    class DefaultSkinName {
        static DEFAULT_BUTTON_UP: string;
        static DEFAULT_BUTTON_DOWN: string;
        static DEFAULT_BUTTON_OVER: string;
        static DEFAULT_BUTTON_DISABLE: String;
        static DEFAULT_LABEL_BUTTON_UP: string;
        static DEFAULT_LABE_BUTTON_DOWN: string;
        static DEFAULT_LABE_BUTTON_DISABLE: String;
        static DEFAULT_CHECK_BOX_UP: string;
        static DEFAULT_CHECK_BOX_DOWN: string;
        static DEFAULT_CHECK_BOX_SELECTED_UP: string;
        static DEFAULT_CHECK_BOX_SELECTED_DOWN: string;
        static DEFAULT_CHECK_BOX_DISABLE: string;
        static DEFAULT_PROGRESS_BAR: string;
        static DEFAULT_PROGRESS_BAR_BACKGROUND: string;
        static DEFAULT_RADIO_BUTTON_UP: string;
        static DEFAULT_RADIO_BUTTON_DOWN: string;
        static DEFAULT_RADIO_BUTTON_SELECTED_UP: string;
        static DEFAULT_RADIO_BUTTON_SELECTED_DOWN: string;
        static DEFAULT_RADIO_BUTTON_DISABLE: string;
        static DEFAULT_SLIDER_BAR: string;
        static DEFAULT_SLIDER_BACKGROUND: string;
        static DEFAULT_PANEL_BACKGROUND: string;
    }
}
declare module egret3d.gui {
    /**
* @private
* @class egret3d.gui.UILayout
* @classdesc
* @version Egret 3.0
* @platform Web,Native
*/
    class UILayout extends DisplayObject {
        protected onRender(): void;
        protected onUpdate(): void;
        protected onEvent(): void;
    }
}
declare module egret3d.gui {
    /**
    * @class egret3d.gui.UIElement
    * @classdesc
    * 所有可视组件的基类</p>.
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UIElement extends DisplayObject {
        /**
        * @private
        */
        protected instanceStyles: Object;
        private static defaultStyles;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @private
        */
        protected onRender(): void;
        /**
        * @private
        */
        protected onUpdate(): void;
        /**
        * @private
        */
        protected onEvent(): void;
        /**
        * @language zh_CN
        * 对此组件实例设置样式属性。
        * @param style 样式属性的名称。
        * @param value  样式的值。可由Texture或string, string的值由texturepacker出的配置文件内的文件名得来.
        * @version Egret 3.0
        * @platform Web,Native
        */
        setStyle(style: string, value: any): void;
        /**
      * @language zh_CN
      * 检索组件的样式查找链中设置的样式属性。
      * @param style 样式属性的名称。
      * @version Egret 3.0
      * @platform Web,Native
      */
        getStyle(style: string): Texture;
        /**
        * @private
        */
        private getDefaultStyle(style);
        /**
         * @private
         * 用于子类重写
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected getDefaultStyleNameByStyleName(styleName: string): string;
        /**
        * @private
       * @version Egret 3.0
       * @platform Web,Native
       */
        static mergeStyles(...list: any[]): Object;
    }
}
declare module egret3d.gui {
    /**
    * @class egret3d.gui.UIButton
    * @classdesc
    * 常用的矩形按钮组件.</p>
    * 仅包含图片皮肤.如果要使用文本.请使用UILabelButton组件.</p>
    * 可响应鼠标事件;
    * @see egret3d.MouseEvent3D
    * @see egret3d.gui.UILabelButton
    * 示例:
    * @includeExample gui/component/UIButton.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UIButton extends UIElement {
        protected _skin: Quad;
        private _enable;
        protected _state: string;
        protected _isDowning: boolean;
        static STATE_DOWN: string;
        static STATE_UP: string;
        static STATE_OVER: string;
        static STATE_DISABLE: string;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
       * @private
       */
        protected getDefaultStyleNameByStyleName(styleName: string): string;
        /**
        * @language zh_CN
        * 获取或设置组件的宽度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的宽度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
       * @language zh_CN
       * 设置皮肤
       * @param style 皮肤名称, 可选值:down, up, over, disable.
       * @param value 皮肤贴图
       * @version Egret 3.0
       * @platform Web,Native
       */
        setStyle(style: string, value: any): void;
        /**
       * @private
       */
        protected mouseEventHandler(event: MouseEvent3D): void;
        /**
       * @private
       */
        protected mouseOut(): void;
        /**
       * @private
       */
        protected mouseOver(): void;
        /**
       * @private
       */
        protected startPress(): void;
        /**
       * @private
       */
        protected onStageEnd(event: MouseEvent3D): void;
        /**
       * @private
       */
        protected endPress(): void;
        /**
       * @language zh_CN
       * 是否可用.默认为true. 当设置为false时.将不响应鼠标输入事件
       * @version Egret 3.0
       * @platform Web,Native
       */
        enable: boolean;
        /**
       * @private
       */
        setMouseState(state: string): void;
        /**
       * @private
       */
        protected onRender(): void;
        /**
       * @private
       */
        protected drawBackground(): void;
    }
}
declare module egret3d.gui {
    /**
    * @class egret3d.gui.UITextFieldAutoSize
    * @classdesc
    * 设置 UITextField 类的 autoSize 属性时使用的常量值的枚举
    * @see egret3d.gui.UITextField
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum UITextFieldAutoSize {
        /**
        * @language zh_CN
        * 指定不调整大小。
        * @version Egret 3.0
        * @platform Web,Native
        */
        NONE = 0,
        /**
        * @language zh_CN
        * 指定将文本视为左对齐文本，即文本字段的左侧固定不变，只在右侧调整单行的大小。
        * @version Egret 3.0
        * @platform Web,Native
        */
        LEFT = 1,
        /**
        * @language zh_CN
        * 指定将文本视为右对齐文本，即文本字段的右侧固定不变，只在左侧调整单行的大小
        * @version Egret 3.0
        * @platform Web,Native
        */
        RIGHT = 2,
        /**
        * @language zh_CN
        * 指定将文本视为居中对齐文本。
        * @version Egret 3.0
        * @platform Web,Native
        */
        CENTER = 3,
    }
    /**
   * @class egret3d.gui.UITextFieldType
   * @classdesc
   * 设置 UITextField 类的 type 属性时使用的常量值的枚举
   * @see egret3d.gui.UITextField
   * @version Egret 3.0
   * @platform Web,Native
   */
    enum UITextFieldType {
        /**
        * @language zh_CN
        * 用户无法编辑的动态文本字段
        * @version Egret 3.0
        * @platform Web,Native
        */
        DYNAMIC = 0,
        /**
        * @language zh_CN
        * 用户可以编辑的输入文本字段。
        * @version Egret 3.0
        * @platform Web,Native
        */
        INPUT = 1,
    }
    /**
    * @private
    * @class egret3d.gui.UITextFormatAlign
    * @classdesc
    * UITextFormatAlign 类为 UITextFormat 类中的文本对齐方式提供值。
    * @see egret3d.gui.UITextFormat
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum UITextFormatAlign {
        /**
        * @language zh_CN
        * 在文本字段内将文本居中对齐。
        * @version Egret 3.0
        * @platform Web,Native
        */
        CENTER = 0,
        /**
        * @language zh_CN
        * 在文本字段内将文本两端对齐。
        * @version Egret 3.0
        * @platform Web,Native
        */
        JUSTIFY = 1,
        /**
        * @language zh_CN
        * 在文本字段内将文本左对齐。
        * @version Egret 3.0
        * @platform Web,Native
        */
        LEFT = 2,
        /**
        * @language zh_CN
        * 在文本字段内将文本右对齐。
        * @version Egret 3.0
        * @platform Web,Native
        */
        RIGHT = 3,
    }
    /**
* @private
* @class egret3d.gui.UITextFormat
* @classdesc
* @version Egret 3.0
* @platform Web,Native
*/
    class UITextFormat {
    }
    /**
* @private
* @class egret3d.gui.UITextField
* @classdesc
* @version Egret 3.0
* @platform Web,Native
*/
    class UITextField extends DisplayObject {
        private static sharedHTMLInputElement;
        private static sharedHTMLTextAreaElement;
        private _displayAsPassword;
        private _maxChars;
        private _multiline;
        private _restrict;
        private _selectable;
        private _selectionBeginIndex;
        private _selectionEndIndex;
        private _type;
        private _textColor;
        private _textWidth;
        private _textHeight;
        private _text;
        private _textLine;
        private _fontQuadLine;
        private _quadPool;
        private _blankQuad;
        private _autoSize;
        private _textLineInfo;
        private _bgQuad;
        private _fontQuadPanel;
        /**
        * @language zh_CN
        * 构造函数
        * @param textFieldType 文本类型，参照egret3d.UITextFieldType
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(textFieldType?: UITextFieldType);
        /**
        * @private
        */
        protected onShowInputAgent(e: Event3D): void;
        /**
        * @private
        */
        private onSharedHTMLTextLoseFocus(ev);
        /**
        * @language zh_CN
        * 获取或设置组件的宽度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的宽度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
       * @language zh_CN
       * 指定文本字段是否是密码文本字段。
       * @param displayAsPassword  是否为密码文本字段
       * @version Egret 3.0
       * @platform Web,Native
       */
        /**
        * @language zh_CN
        * 指定文本字段是否是密码文本字段。
        * @param displayAsPassword  是否为密码文本字段
        * @version Egret 3.0
        * @platform Web,Native
        */
        displayAsPassword: boolean;
        /**
        * @language zh_CN
        * (只读)文本字段中的字符数。
        * @version Egret 3.0
        * @platform Web,Native
        */
        length: number;
        /**
        * @language zh_CN
        * 文本字段中最多可包含的字符数（即用户输入的字符数）。
        * @param maxChars  最大字符数
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 文本字段中最多可包含的字符数（即用户输入的字符数）。
        * @param maxChars  最大字符数
        * @version Egret 3.0
        * @platform Web,Native
        */
        maxChars: number;
        /**
        * @language zh_CN
        * 指示字段是否为多行文本字段。
        * @param multiline  是否多行
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 指示字段是否为多行文本字段。
        * @param multiline  是否多行
        * @version Egret 3.0
        * @platform Web,Native
        */
        multiline: boolean;
        /**
        * @language zh_CN
        * 指示用户可输入到文本字段中的字符集。
        * @param restrict  字符集
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 指示用户可输入到文本字段中的字符集。
        * @param restrict  字符集
        * @version Egret 3.0
        * @platform Web,Native
        */
        restrict: string;
        /**
        * @language zh_CN
        * 一个布尔值，指示文本字段是否可选。
        * @param selectable  是否可选
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 一个布尔值，指示文本字段是否可选。
        * @param selectable  是否可选
        * @version Egret 3.0
        * @platform Web,Native
        */
        selectable: boolean;
        /**
        * @language zh_CN
        * (只读)当前所选内容中第一个字符从零开始的字符索引值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        selectionBeginIndex: number;
        /**
        * @language zh_CN
        * (只读)当前所选内容中最后一个字符从零开始的字符索引值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        selectionEndIndex: number;
        /**
        * @language zh_CN
        * 该文本字段的类型。
        * @param type  文本字段的类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 该文本字段的类型。
        * @param type  文本字段的类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: UITextFieldType;
        /**
        * @language zh_CN
        * 文本字段中文本的颜色（采用十六进制格式）。
        * @param textColor  文本颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 文本字段中文本的颜色（采用十六进制格式）。
        * @param textColor  文本颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        textColor: number;
        /**
        * @language zh_CN
        * （只读）文本的宽度，以像素为单位。
        * @version Egret 3.0
        * @platform Web,Native
        */
        textWidth: number;
        /**
        * @language zh_CN
        * （只读）文本的高度，以像素为单位。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @private
         */
        textHeight: number;
        /**
        * @language zh_CN
        * 当前文本字段中当前文本的字符串。
        * @param text  文本字符串
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 当前文本字段中当前文本的字符串。
        * @param text  文本字符串
        * @version Egret 3.0
        * @platform Web,Native
        */
        text: string;
        /**
        * @private
        */
        private clearText();
        /**
        * @language zh_CN
        * @param text  文本字符串
        * 控制文本字段的自动大小调整和对齐。
        * 如果 autoSize 设置为 UITextFieldAutoSize.NONE（默认值），则不会进行调整。</p>
        * 如果 autoSize 设置为 UITextFieldAutoSize.LEFT，会将文本视为左对齐文本，这意味着该文本字段的左边距保持固定，在右边可调整单个文本字段行。 如果文本中包括换行符（例如 "\n" 或 "\r"），则会另外调整底边来适合文本的下一行。
        * 如果 autoSize 设置为 UITextFieldAutoSize.RIGHT，会将文本视为右对齐文本，这意味着该文本字段的右边距保持固定，可在左边调整单个文本字段行。 如果文本中包括换行符（例如 "\n" or "\r")），则会另外调整底边来适合文本的下一行。
        * 如果 autoSize 设置为 UITextFieldAutoSize.CENTER，会将文本视为居中对齐文本，这意味着对单个文本字段行的调整将使其在左右边距间均衡分布。 如果文本中包括换行符（例如 "\n" 或 "\r"），则会另外调整底边来适合文本的下一行。
        * @see egret3d.gui.UITextFieldAutoSize
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * @param text  文本字符串
        * 控制文本字段的自动大小调整和对齐。
        * 如果 autoSize 设置为 UITextFieldAutoSize.NONE（默认值），则不会进行调整。</p>
        * 如果 autoSize 设置为 UITextFieldAutoSize.LEFT，会将文本视为左对齐文本，这意味着该文本字段的左边距保持固定，在右边可调整单个文本字段行。 如果文本中包括换行符（例如 "\n" 或 "\r"），则会另外调整底边来适合文本的下一行。
        * 如果 autoSize 设置为 UITextFieldAutoSize.RIGHT，会将文本视为右对齐文本，这意味着该文本字段的右边距保持固定，可在左边调整单个文本字段行。 如果文本中包括换行符（例如 "\n" or "\r")），则会另外调整底边来适合文本的下一行。
        * 如果 autoSize 设置为 UITextFieldAutoSize.CENTER，会将文本视为居中对齐文本，这意味着对单个文本字段行的调整将使其在左右边距间均衡分布。 如果文本中包括换行符（例如 "\n" 或 "\r"），则会另外调整底边来适合文本的下一行。
        * @see egret3d.gui.UITextFieldAutoSize
        * @version Egret 3.0
        * @platform Web,Native
        */
        autoSize: UITextFieldAutoSize;
        /**
        * @private
        */
        private refreshAlign();
        /**
        * @private
        */
        private buildTextLineInfo(text);
        /**
        * @language zh_CN
        * 将 newText 参数指定的字符串追加到文本字段的文本的末尾。
        * @param newText 新字符串
        * @version Egret 3.0
        * @platform Web,Native
        */
        appendText(newText: string): void;
        /**
        * @language zh_CN
        * 返回一个矩形，该矩形是字符的边框。
        * @param charIndex 字符索引值
        * @version Egret 3.0
        * @platform Web,Native
        */
        getCharBoundaries(charIndex: number): Rectangle;
        /**
        * @language zh_CN
        * 在 x 和 y 参数指定的位置返回从零开始的字符索引值。
        * @param x x坐标位置
        * @param y y坐标位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        getCharIndexAtPoint(x: number, y: number): number;
        /**
        * @language zh_CN
        * 使用 value 参数的内容替换当前所选内容。
        * @param value 新字符串
        * @version Egret 3.0
        * @platform Web,Native
        */
        replaceSelectedText(value: string): void;
        /**
        * @language zh_CN
        * 使用 newText 参数的内容替换 beginIndex 和 endIndex 参数指定的字符范围。
        * @param beginIndex 起始位置索引
        * @param endIndex 结束位置索引
        * @param newText 新字符串
        * @version Egret 3.0
        * @platform Web,Native
        */
        replaceText(beginIndex: number, endIndex: number, newText: string): void;
        /**
        * @language zh_CN
        * 将第一个字符和最后一个字符的索引值（使用 beginIndex 和 endIndex 参数指定）指定的文本设置为所选内容。
        * @param beginIndex 起始位置索引
        * @param endIndex 结束位置索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        setSelection(beginIndex: number, endIndex: number): void;
        /**
        * @private
        */
        private createFontQuad(unicode, isAddChild?);
        /**
        * @private
        */
        private deleteFontQuad(fontQuad);
    }
}
declare module egret3d.gui {
    /**
* @class egret3d.gui.UILabelButton
* @classdesc
* 含文本组件的按钮, 用于在按钮上显示文字
* @see egret3d.MouseEvent3D
* @see egret3d.gui.UIButton
* @version Egret 3.0
* @platform Web,Native
*/
    class UILabelButton extends UIButton {
        protected _label: string;
        private _textField;
        private _textWidth;
        private _textHeight;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
       * @private
       */
        protected getDefaultStyleNameByStyleName(styleName: string): string;
        /**
       * @private
       */
        /**
       * @private
       */
        textHeight: number;
        /**
       * @private
       */
        /**
       * @private
       */
        textWidth: number;
        /**
       * @language zh_CN
       * 获取按钮内的文本组件。
       * @version Egret 3.0
       * @platform Web,Native
       */
        textField: UITextField;
        /**
       * @language zh_CN
       * 获取或设置组件的文本标签。
       * @version Egret 3.0
       * @platform Web,Native
       */
        /**
        * @language zh_CN
        * 获取或设置组件的文本标签。
        * @version Egret 3.0
        * @platform Web,Native
        */
        label: string;
        /**
        * @private
        */
        protected onRender(): void;
    }
}
declare module egret3d.gui {
    /**
    * @class egret3d.gui.UIToggleButtonBase
    * @classdesc
    * UIToggleButtonBase 组件是支持 selected 属性的按钮组件的基类.</p>
    * UICheckBox 和 UIRadioButton 是 UIToggleButtonBase 的子类.</p>
    * @see egret3d.gui.UIRadioButton.
    * @see egret3d.gui.UICheckBox.
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UIToggleButtonBase extends UILabelButton {
        private _selected;
        protected static STATE_DOWN_AND_SELECTED: string;
        protected static STATE_UP_AND_SELECTED: string;
        private _textPadding;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
       * @language zh_CN
       * (只读)获取按钮和文本宽度之和
       * @version Egret 3.0
       * @platform Web,Native
       */
        buttonAndLabelWidth: number;
        /**
       * @language zh_CN
       * 获取或设置按钮和文本的间隔（以像素为单位）。
       * @version Egret 3.0
       * @platform Web,Native
       */
        /**
        * @language zh_CN
        * 获取或设置按钮和文本的间隔（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        textPadding: number;
        /**
        * @private
        */
        protected onRender(): void;
        /**
        * @language zh_CN
        * 获取或设置一个布尔值，指示切换按钮是否已切换至打开或关闭位置。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置一个布尔值，指示切换按钮是否已切换至打开或关闭位置。
        * @version Egret 3.0
        * @platform Web,Native
        */
        selected: boolean;
        /**
        * @private
        */
        setMouseState(state: string): void;
        /**
        * @private
        */
        protected startPress(): void;
        /**
        * @private
        */
        protected endPress(): void;
    }
}
declare module egret3d.gui {
    /**
* @class egret3d.gui.UIPanel
* @classdesc
* 基础的面板组件. 内含背景图片,以及矩形显示区域限制
* @version Egret 3.0
* @platform Web,Native
*/
    class UIPanel extends UIElement {
        protected _background: Quad;
        protected _container: UIElement;
        private _w;
        private _h;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @private
        */
        private updateMask();
        /**
        * @private
        */
        background: Quad;
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @private
        */
        onRender(): void;
        /**
        * @private
        */
        protected getDefaultStyleNameByStyleName(styleName: string): string;
        /**
        * @private
        */
        private drawBackground();
        /**
       * @language zh_CN
       * 检索组件的样式查找链中设置的样式属性。
       * @param style 样式属性的名称。 可选值:background.
       * @version Egret 3.0
       * @platform Web,Native
       */
        setStyle(style: string, value: any): void;
        /**
        * @private
        */
        addChild(display: DisplayObject): DisplayObject;
        /**
        * @private
        */
        addChildAt(display: DisplayObject, index: number): DisplayObject;
        /**
        * @private
        */
        removeChild(display: DisplayObject): DisplayObject;
        /**
        * @private
        */
        removeChildAt(index: number): DisplayObject;
        /**
        * @private
        */
        swapChildIndex(display: DisplayObject, index: number): void;
        /**
        * @private
        */
        hasChild(display: DisplayObject): number;
        /**
        * @private
        */
        getChildByIndex(index: number): DisplayObject;
        /**
        * @private
        */
        getChildByName(name: string): DisplayObject;
    }
}
declare module egret3d.gui {
    /**
   * @class egret3d.gui.UIList
   * @classdesc
   * 基础的列表组件. 实现了滚动交互</p>
   * 鼠标按下拖动时, 将能够拖动内部的显示区域
   * @version Egret 3.0
   * @platform Web,Native
   */
    class UIList extends egret3d.gui.UIPanel {
        private _selectedIndex;
        private _selectedItem;
        private _items;
        private _gap;
        private _startDrag;
        private _containerHeight;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @private
        */
        private onMouseDown(event);
        /**
        * @private
        */
        private onMouseUp(event);
        /**
        * @private
        */
        private onMouseMove(event);
        /**
        * @private
        */
        protected updateView(): void;
        /**
       * @language zh_CN
       * 组件内对象的间隔距离
       * @version Egret 3.0
       * @platform Web,Native
       */
        /**
     * @language zh_CN
     * 组件内对象的间隔距离
     * @version Egret 3.0
     * @platform Web,Native
     */
        gap: number;
        /**
       * @language zh_CN
       * 向组件里添加一项, 添加在组件尾部
       * @param item 需要添加的项
       * @version Egret 3.0
       * @platform Web,Native
       */
        addItem(item: DisplayObject): void;
        /**
       * @language zh_CN
       * 移除组件内部的一项
       * @param item 需要移除的项
       * @version Egret 3.0
       * @platform Web,Native
       */
        removeItem(item: DisplayObject): void;
    }
}
declare module egret3d.gui {
    /**
* @class egret3d.gui.UICheckBox
* @classdesc
* 组件显示一个小方框，该方框内可以有选中标记。 </p>
* UICheckBox 组件还可以显示可选的文本标签。
* @see egret3d.gui.UIToggleButtonBase
* @see egret3d.MouseEvent3D
* @version Egret 3.0
* @platform Web,Native
*/
    class UICheckBox extends UIToggleButtonBase {
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @private
        */
        protected getDefaultStyleNameByStyleName(styleName: string): string;
    }
}
declare module egret3d.gui {
    /**
* @class egret3d.gui.UIRadioButton
* @classdesc
* 圆形的单选框按钮组件.</p>
* 配合UIRadioButtonGroup可实现在任何给定的时刻，都只有一个组成员被选中.</p>
* 当状态发生变化时调度Event3D.CHANGE.</p>
* @see egret3d.gui.UIToggleButtonBase
* @see egret3d.Event3D
* @version Egret 3.0
* @platform Web,Native
*/
    class UIRadioButton extends gui.UIToggleButtonBase {
        private _group;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * @param group 此 UIRadioButton 所属的 UIRadioButtonGroup 对象。
        * @version Egret 3.0
        * @platform Web,Native
        */
        group: UIRadioButtonGroup;
        /**
        * @private
        */
        protected getDefaultStyleNameByStyleName(styleName: string): string;
    }
}
declare module egret3d.gui {
    /**
    * @class egret3d.gui.UIRadioButtonGroup
    * @classdesc
    * RadioButtonGroup 类将一组 RadioButton 组件定义为单个组件。 选中一个单选按钮后，不能再选中同一组中的其它单选按钮
    * 当组内的选定 RadioButton 实例发生变化时调度Event3D.CHANGE.</p>
    * @see egret3d.Event3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UIRadioButtonGroup extends EventDispatcher {
        private _enable;
        private _selection;
        private _items;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 组件是否可用
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 组件是否可用
        * @version Egret 3.0
        * @platform Web,Native
        */
        enable: boolean;
        /**
        * @language zh_CN
        * (只读)获取当前选中的项
        * @version Egret 3.0
        * @platform Web,Native
        */
        selection: UIRadioButton;
        /**
        * @language zh_CN
        * 获取或设置当前选中项的索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置当前选中项的索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        selectedIndex: number;
        /**
       * @language zh_CN
       * 添加一个UIRadioButton到组件中
       * @param item 要添加的UIRadioButton组件
       * @version Egret 3.0
       * @platform Web,Native
       */
        addItem(item: UIRadioButton): void;
        /**
        * @language zh_CN
        * 移除一个UIRadioButton组件
        * @param item 要移除的UIRadioButton组件
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeItem(item: UIRadioButton): void;
        /**
        * @private
        */
        getRadioButtonAt(index: number): UIRadioButton;
        /**
        * @private
        */
        private onItemChange(event);
        /**
       * @private
       */
        private changeSelectedItem(item);
    }
}
declare module egret3d.gui {
    /**
* @class egret3d.gui.UIProgressBar
* @classdesc
* 基础的进度条组件.</p>
* 由底部背景条以及顶部的进度条组成.</p>
* 组件样式名为background以及 bar 分别用来设置底部背景条以及顶部进度条的样式
* @version Egret 3.0
* @platform Web,Native
*/
    class UIProgressBar extends UIElement {
        private _background;
        private _bar;
        private _ratio;
        private _mask;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
       * @language zh_CN
       * 进度条的比例.</p>
       * 取值范围为0-1,即进度条由空到填满</p>
       * 小于0 取0, 大于1 取1
       * @version Egret 3.0
       * @platform Web,Native
       */
        /**
       * @language zh_CN
       * 进度条的比例.</p>
       * 取值范围为0-1,即进度条由空到填满</p>
       * 小于0 取0, 大于1 取1
       * @version Egret 3.0
       * @platform Web,Native
       */
        ratio: number;
        /**
        * @language zh_CN
        * 获取或设置组件的宽度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的宽度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @private
        */
        private setBarRect(x, y, w, h);
        /**
        * @language zh_CN
        * 获取进度条的显示对象.
        * @version Egret 3.0
        * @platform Web,Native
        */
        bar: DisplayObject;
        /**
        * @language zh_CN
        * 获取背景的显示对象.
        * @version Egret 3.0
        * @platform Web,Native
        */
        background: DisplayObject;
        /**
        * @private
        */
        private updateBar();
        /**
       * @language zh_CN
       * 检索组件的样式查找链中设置的样式属性。
       * @param style 样式属性的名称。 可选值:bar, background.
       * @version Egret 3.0
       * @platform Web,Native
       */
        setStyle(style: string, value: any): void;
        /**
        * @private
        */
        protected getDefaultStyleNameByStyleName(styleName: string): string;
        /**
        * @private
        */
        private updateStyle();
    }
}
declare module egret3d.gui {
    /**
    * @class egret3d.gui.UISlider
    * @classdesc
    * 通过使用 Slider 组件，用户可以在滑块轨道的端点之间移动滑块来选择值。 </p>
    * Slider 组件的当前值由滑块端点之间滑块的相对位置确定，端点对应于 Slider 组件的 minimum 和 maximum 值。
    * 组件样式名为background以及 bar 分别用来设置底部背景条以及顶部的样式
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UISlider extends gui.UIElement {
        private _background;
        private _bar;
        private _maximum;
        private _minimum;
        private _value;
        private _snapInterval;
        private _text;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 设置皮肤
        * @param style 皮肤名称, 可选值: background, bar.
        * @param value 皮肤贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        setStyle(style: string, value: any): void;
        /**
        * @private
        */
        private drawTexture();
        /**
        * @private
        */
        protected getDefaultStyleNameByStyleName(styleName: string): string;
        /**
        * @private
        */
        private onMouseUp(event);
        /**
        * @private
        */
        private onMouseDown(event);
        /**
        * @private
        */
        private updateBar();
        /**
        * @language zh_CN
        * 获取或设置用户移动滑块时值增加或减小的量。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
      * @language zh_CN
      * 获取或设置用户移动滑块时值增加或减小的量。
      * @version Egret 3.0
      * @platform Web,Native
      */
        snapInterval: number;
        /**
        * @language zh_CN
        * 获取或设置 Slider 组件的当前值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置 Slider 组件的当前值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        value: number;
        /**
        * @private
        */
        private onMouseMove(event);
        /**
       * @language zh_CN
       * Slider 组件实例所允许的最大值。
       * @version Egret 3.0
       * @platform Web,Native
       */
        /**
        * @language zh_CN
        * Slider 组件实例所允许的最大值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        maximum: number;
        /**
        * @language zh_CN
        * Slider 组件实例所允许的最小值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * Slider 组件实例所允许的最小值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        minimum: number;
        /**
        * @language zh_CN
        * 获取或设置组件的宽度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的宽度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 获取或设置组件的高度（以像素为单位）。
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
    }
}
declare module egret3d {
    /**
    *@language zh_CN
    * @class egret3d.LightType
    * 灯光类型
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum LightType {
        /**
        *@language zh_CN
        * 点光源
        * @version Egret 3.0
        * @platform Web,Native
        */
        pointlight = 0,
        /**
        *@language zh_CN
        * 平行光
        * @version Egret 3.0
        * @platform Web,Native
        */
        directlight = 1,
        /**
        *@language zh_CN
        * 聚光灯
        * @version Egret 3.0
        * @platform Web,Native
        */
        spotLightlight = 2,
    }
    /**
    * @class egret3d.DirectLight
    * @classdesc
    * 灯光的基础类型。</p>
    * 所有的灯光基本要素 灯光的颜色，强度，位置，方向。</p>
    * 颜色的色值均是16进制 red:0xffff0000 argb的定义模式。</p>
    * 每个材质球所能最大使用的灯光建议别太多，能省则省，尤其是移动端，能用灯光缓存图 lightmap 最好。</p>
    * @see egret3d.Object3D
    * @see egret3d.LightGroup
    * @see egret3d.LightBase
    * @see egret3d.PointLight
    * @see egret3d.SpotLight
    * @version Egret 3.0
    * @platform Web,Native
    */
    class LightBase extends Object3D {
        /**
        *@language zh_CN
        * 灯光在配置表中的id，用于和贴图建立绑定关系
        * @version Egret 3.0
        * @platform Web,Native
        */
        lightId: Number;
        /**
        *@language zh_CN
        * 灯光类型
        * @see egret3d.LightType
        * @version Egret 3.0
        * @platform Web,Native
        */
        lightType: number;
        /**
        * @language zh_CN
        * @private
        * 环境颜色
        */
        protected _ambient: Vector3D;
        /**
        * @language zh_CN
        * @private
        * 漫反射
        */
        protected _diffuse: Vector3D;
        /**
         * @language zh_CN
         *@private
         * 镜面反射
         */
        protected _specular: Vector3D;
        /**
         * @language zh_CN
         *@private
         */
        protected _halfVector: Vector3D;
        /**
         * @language zh_CN
         *@private
         * @param value 强度
         */
        protected _intensity: number;
        protected _radius: number;
        protected _cutoff: number;
        /**
        *@language zh_CN
        *@private
        * @param value 背光强度
        */
        protected _halfIntensity: number;
        /**
         * @language zh_CN
         *@private
         */
        protected _spotExponent: number;
        /**
         * @language zh_CN
         *@private
         */
        protected _spotCutoff: number;
        /**
         * @language zh_CN
         *@private
         */
        protected _spotCosCutoff: number;
        /**
         * @language zh_CN
         *@private
         */
        protected _constantAttenuation: number;
        /**
         * @language zh_CN
         *@private
         */
        protected _linearAttenuation: number;
        /**
         * @language zh_CN
         *@private
         */
        protected _quadraticAttenuation: number;
        /**
         * @language zh_CN
         *@private
         */
        _lightIndex: number;
        /**
         * @language zh_CN
         *@private
         */
        protected len: number;
        /**
         * @language zh_CN
         *@private
         */
        protected _change: boolean;
        /**
         * @language zh_CN
         *@private
         */
        protected lightViewPos: Vector3D;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 得到灯光强度。</p>
        * 影响灯光的强弱显示，值的范围0~没有上限，但是值过大会导致画面过度曝光。</p>
        * @returns number 灯光强度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置灯光强度。</p>
        * 影响灯光的强弱显示，值的范围0~没有上限，但是值过大会导致画面过度曝光。</p>
        * @param value 强度数值
        * @version Egret 3.0
        * @platform Web,Native
        */
        intensity: number;
        /**
        * @language zh_CN
        * 得到背光灯光强度。</p>
        * 影响背光灯光的强弱显示，值的范围0~没有上限，但是值过大会导致画面过度曝光。</p>
        * @returns number 背光灯光的强弱
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置背光灯光强度。</p>
        * 影响背光灯光的强弱显示，值的范围0~没有上限，但是值过大会导致画面过度曝光。</p>
        * @param value 背光灯光强度
        * @version Egret 3.0
        * @platform Web,Native
        */
        halfIntensity: number;
        /**
        * @language zh_CN
        * 获取 灯光环境颜色。</p>
        * 物体在未受到光的直接照射的地方 模拟间接环境光颜色，会影响背光面的颜色。</p>
        * @returns number ambient  灯光环境颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置灯光环境颜色。</p>
        * 物体在未受到光的直接照射的地方 模拟间接环境光颜色，会影响背光面的颜色。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        ambient: number;
        /**
        * @language zh_CN
        * 设置灯光漫反射颜色。</p>
        * 直接影响最终灯光的颜色色值 16进制的颜色 例如 red：0xffff0000。</p>
        * 也可以通过 diffusePower 来改变这个值的总体强弱。</p>
        * @returns number diffuse
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置灯光漫反射颜色。</p>
        * 直接影响最终灯光的颜色色值 16进制的颜色, 例如 red：0xffff0000。</p>
        * 也可以通过 diffusePower 来改变这个值的总体强弱
        * @param color 颜色值，0xffffffff格式
        * @version Egret 3.0
        * @platform Web,Native
        */
        diffuse: number;
        /**
        * @language zh_CN
        * 在灯光方向与物体和相机成一个反光角度的时候，就会产生反光，高光，而不同的物体会有不同的颜色色值，尤其是金属。</p>
        * 16进制的颜色 例如 red：0xffff0000。</p>
        * 也可以通过 specularPower 来改变这个值的总体强弱。</p>
        * @returns number  灯光镜面高光反射颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置灯光镜面高光反射颜色。</p>
        * 在灯光方向与物体和相机成一个反光角度的时候，就会产生反光，高光，而不同的物体会有不同的颜色色值，尤其是金属。</p>
        * 16进制的颜色 例如 red：0xffff0000。</p>
        * 也可以通过 specularPower 来改变这个值的总体强弱。</p>
        * @param color 颜色值，0xffffffff格式
        * @version Egret 3.0
        * @platform Web,Native
        */
        specular: number;
        private init();
        /**
        * @language zh_CN
        * @private
        * 更新灯光数据
        * @param index 灯光ID
        * @param lightData 灯光数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.DirectLight
    * @classdesc
    *
    * 点光源
    * 所有的灯光基本要素 灯光的颜色，强度，位置，方向
    * 颜色的色值均是16进制 red:0xffff0000 argb的定义模式
    * 每个材质球所能最大使用的灯光建议别太多，能省则省，尤其是移动端，能用灯光缓存图 lightmap 最好
    * 点光源是游戏中常常用到的动态光源，实时渲染中，灯光的数量会直接影响渲染性能
    * @see egret3d.Object3D
    * @see egret3d.LightGroup
    * @see egret3d.LightBase
    * @includeExample lights/PointLight.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PointLight extends LightBase {
        private scenePosMat;
        private static scenePos;
        /**
         * @language zh_CN
         * @private
         * 点光源的数据长度
         */
        static stride: number;
        /**
        * @language zh_CN
        * 创建一个点光源
        * @param color 灯光颜色值
        * @default 0xffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(color?: number);
        /**
        * @language zh_CN
        * 获取灯光半径
        * @returns number 灯光半径
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置灯光半径
        * @param value 灯光半径
        * @version Egret 3.0
        * @platform Web,Native
        */
        radius: number;
        /**
        * @language zh_CN
        * 获取灯光衰减度
        * @returns number 灯光衰减度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置灯光衰减度
        * @param value 灯光衰减度
        * @version Egret 3.0
        * @platform Web,Native
        */
        cutoff: number;
        /**
          * @language zh_CN
          *
          * 背光颜色
          * 模拟间接光照而开发的背光，而不用去同时打两盏不同方向的组合灯光，可以优化显示效果
          * @param color 背光颜色色值
          * @version Egret 3.0
          * @platform Web,Native
          */
        ambient: number;
        /**
        * @language zh_CN
        * @private
        * 更新灯光数据
        * @param index 灯光ID
        * @param lightData 灯光数据
        */
        updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.SpotLight
    * @classdesc
    * spot 的灯光 也就是筒灯
    * 所有的灯光基本要素 灯光的颜色，强度，位置，方向
    * 颜色的色值均是16进制 red:0xffff0000 argb的定义模式
    * 每个材质球所能最大使用的灯光建议别太多，能省则省，尤其是移动端，能用灯光缓存图 lightmap 最好
    * spot light 可以直接想象为点光源照了个罩子，有方向且有范围的灯光
    * @see egret3d.Object3D
    * @see egret3d.LightGroup
    * @see egret3d.LightBase
    * @see egret3d.PointLight
    * @see egret3d.SpotLight
    * @version Egret 3.0
    * @platform Web,Native
    */
    class SpotLight extends LightBase {
        /**
         * @language zh_CN
         * @priavete
         */
        static stride: number;
        /**
        * @language zh_CN
        * 创建一个聚光源
        * @param color 灯光颜色值
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(color: number);
        /**
        * @language zh_CN
        *
        * spot 的 裁切范围
        * spot light 照射范围的大小指数
        * @returns number Cutoff -spot 的 裁切范围
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        *
        * spot 的 裁切范围
        * spot light 照射范围的大小指数
        * @param value Cutoff
        * @version Egret 3.0
        * @platform Web,Native
        */
        spotCosCutoff: number;
        /**
        * @language zh_CN
        *
        * spot 的 灯光强弱
        * spot light 灯光圆形范围内随半径大小改变发生的灯光强弱指数
        * @returns number 灯光强弱指数
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * spot 的 灯光强弱
        * spot light 灯光圆形范围内随半径大小改变发生的灯光强弱指数
        *
        * @param value 灯光强弱指数
        * @version Egret 3.0
        * @platform Web,Native
        */
        spotExponent: number;
        /**
        * @language zh_CN
        * spot 的 灯光衰减
        * spot light 灯光圆形范围内随半径大小改变发生的灯光衰减常数指数
        * @returns number 持续衰减
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        *
        * spot 的 灯光衰减
        * spot light 灯光圆形范围内随半径大小改变发生的灯光衰减常数指数
        * @param value 持续衰减
        * @version Egret 3.0
        * @platform Web,Native
        */
        constantAttenuation: number;
        /**
        * @language zh_CN
        *
        * spot 的 灯光线性衰减
        * spot light 灯光圆形范围内随半径大小改变发生的灯光线性衰减
        * @returns number 线性衰减
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        *
        * spot 的 灯光线性衰减
        * spot light 灯光圆形范围内随半径大小改变发生的灯光线性衰减
        * @param value 线性衰减
        * @version Egret 3.0
        * @platform Web,Native
        */
        linearAttenuation: number;
        /**
        * @language zh_CN
        *
        * spot 的 灯光线性2次衰减
        * spot light 灯光圆形范围内随半径大小改变发生的灯光线性2次衰减
        * @returns number 返回2次衰减
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        *
        * spot 的 灯光线性2次衰减
        * spot light 灯光圆形范围内随半径大小改变发生的灯光线性2次衰减
        * @param value 2次衰减
        * @version Egret 3.0
        * @platform Web,Native
        */
        quadraticAttenuation: number;
        /**
         * @language zh_CN
         * @private
         * 更新灯光数据
         * @param index 灯光ID
         * @param lightData 灯光数据
         */
        updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.DirectLight
    * @classdesc
    * 平行灯光</p>
    * 平行光是一种只有方向，强弱度，没有大小范围的灯光，一般情况下，directlight 可以产生阴影;</p>
    * 如果要产生阴影 需要设置 egret3d.ShadowRender.castShadowLight = directLight; 及其他相关模型的设置.</p>
    *
    * @see egret3d.LightGroup
    * @see egret3d.LightBase
    * @see egret3d.ShadowRender
    * @includeExample lights/DirectLight.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class DirectLight extends LightBase {
        protected static q0: Quaternion;
        /**
        * @language zh_CN
        * @private
        * 光源数据结构长度
        */
        static stride: number;
        /**
        * @language zh_CN
        * 创建一个平行光对象
        * @param dir 光线的方向
        * @default Vector3D(0, 0, 1)
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(dir?: Vector3D);
        private _dir;
        /**
        * @language zh_CN
        *
        * 背光颜色
        * 模拟间接光照而开发的背光，而不用去同时打两盏不同方向的组合灯光，可以优化显示效果
        * @param color 背光颜色色值，格式0xffffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        ambient: number;
        /**
        * @language zh_CN
        * 光线的方向
        * @returns dir 光线的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 光线的方向
        * @param dir 光线的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        dir: Vector3D;
        protected onUpdateTransform(): void;
        /**
         * @language zh_CN
         *
         * 是否产生阴影
         * 模拟间接光照而开发的背光，而不用去同时打两盏不同方向的组合灯光，可以优化显示效果
         * @param color 背光颜色色值
         */
        /**
        * @language zh_CN
        * @private
        * 更新灯光数据
        * @param camera 灯光ID
        * @param index 灯光数据
        * @param lightData 灯光数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        updateLightData(camera: Camera3D, index: number, lightData: Float32Array): void;
    }
}
declare module egret3d {
    /**
   * @class egret3d.DirectLight
   * @classdesc
   *
   * 灯光组。</p>
   * 把需要使用的灯光，放入一个组里面，然后给材质进行渲染。
   * @see egret3d.Object3D
   * @see egret3d.LightBase
   * @see egret3d.PointLight
   * @see egret3d.SpotLight
   * @see egret3d.EventDispatcher
   * @version Egret 3.0
   * @platform Web,Native
   */
    class LightGroup extends EventDispatcher {
        /**
        * @language zh_CN
        * 灯光个数
        * @version Egret 3.0
        * @platform Web,Native
        */
        lightNum: number;
        /**
        * @language zh_CN
        * 方向光列表
        * @see egret3d.DirectLight
        * @version Egret 3.0
        * @platform Web,Native
        */
        directLightList: Array<DirectLight>;
        /**
        * @private
        * @language zh_CN
        * 聚光灯列表
        * @see egret3d.SpotLight
        * @version Egret 3.0
        * @platform Web,Native
        */
        spotLightList: Array<SpotLight>;
        /**
        * @language zh_CN
        * 点光源列表
        * @see egret3d.PointLight
        * @version Egret 3.0
        * @platform Web,Native
        */
        pointLightList: Array<PointLight>;
        protected event: Event3D;
        /**
        * @private
        */
        static EVENT_LIGHT_RESET: string;
        /**
        * @language zh_CN
        * 创建一个灯光组
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 为灯光组,添加一个灯光
        * @param light 灯光实例对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addLight(light: LightBase): void;
        /**
        * @language zh_CN
        * 移除某个灯光
        * @param light 灯光实例对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeLight(light: LightBase): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum SpecialCast {
        Shadow = 0,
        Pick = 1,
    }
    /**
    * @private
    * @class egret3d.EntityCollect
    * @classdesc
    * Object3D 渲染对象收集器,把渲染对象进行可视筛选，
    * 并且划分渲染层级，依次排序到加入列表.
    *
    * @see egret3d.Scene3D
    * @see egret3d.View3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class EntityCollect {
        numberVertex: number;
        numberFace: number;
        numberDraw: number;
        numberSkin: number;
        numberAnimation: number;
        numberParticle: number;
        numberCastShadow: number;
        numberAcceptShadow: number;
        numberPick: number;
        softLayerRenderItems: {
            [key: string]: IRender[];
        };
        specialCastItem: {
            [key: string]: IRender[];
        };
        rootScene: Scene3D;
        /**
        * @private
        * @language zh_CN
        * 可渲染对象列表
        */
        renderList: Array<IRender>;
        /**
        * @language zh_CN
        * constructor
        * @param root 渲染根节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        root: Scene3D;
        /**
        * @language zh_CN
        * 尝试添加节点
        * @version Egret 3.0
        * @param child   尝试添加的节点
        * @param camera     相机
        * @platform Web,Native
        */
        private applyRender(child, camera);
        /**
        * @language zh_CN
        * 尝试添加四叉树列表
        * @version Egret 3.0
        * @param quadList   需要被判定是否在视锥体里的节点列表
        * @param camera     相机
        * @platform Web,Native
        */
        private appendQuadList(quadList, camera);
        /**
        * @language zh_CN
        * 尝试将一个渲染对象，进行视锥体裁剪，放入到渲染队列中
        * @param root 渲染根节点
        * @param cameraCulling 是否使用相机裁剪
        * @version Egret 3.0
        * @platform Web,Native
        */
        private addRenderItem(renderItem, camera, cameraCulling?);
        /**
        * @language zh_CN
        * 数据更新 处理需要渲染的对象
        * @param camera 当前摄像机
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(camera: Camera3D): void;
        protected clear(): void;
        /**
        * @language zh_CN
        * 查找一个对象在渲染列表的下标
        * @param obj 要查找的对象
        * @returns 返回对象在渲染列表的下标
        */
        findRenderObject(obj: IRender): number;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.Frustum
    * @classdesc
    * 摄像机视椎体,计算出摄像机的可视范围.
    *
    * @see egret3d.Camera3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Frustum {
        box: BoundBox;
        private _vtxNum;
        private _planeNum;
        private _vertex;
        private _tempVertices;
        private _pos;
        private _plane;
        private _frustum;
        private camera;
        private nearCenter;
        private farCenter;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertices: Vector3D[];
        /**
        * @language zh_CN
        * 摄像机渲染线框
        * @version Egret 3.0
        * @platform Web,Native
        */
        wireframe: Wireframe;
        /**
        * @language zh_CN
        * 视椎体中心点
        * @version Egret 3.0
        * @platform Web,Native
        */
        center: Vector3D;
        private _curVer;
        /**
        * @language zh_CN
        * 构造
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(camera?: Camera3D);
        protected initFrustum(): void;
        /**
        * @language zh_CN
        * 是否可见
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 是否可见
        * @version Egret 3.0
        * @platform Web,Native
        */
        visible: boolean;
        /**
        * @language zh_CN
        * @private
        * 生成一个视椎体
        * @param fovY 观察时y 轴方向的角度，就是观察范围夹角。
        * @param aspectRatio 纵横比，在视空间宽度除以高度.
        * @param nearPlane 近裁剪面位置Z值.
        * @param farPlane 远裁剪面位置Z值.
        * @version Egret 3.0
        * @platform Web,Native
        */
        makeFrustum(fovY: number, aspectRatio: number, nearPlane: number, farPlane: number): void;
        protected makeOrthoFrustum(w: number, h: number, zn: number, zf: number): void;
        protected makeOrthoToCenterFrustum(l: number, r: number, b: number, t: number, zn: number, zf: number): void;
        /**
        * @language zh_CN
        * 数据更新.
        * @param camera 视椎的摄像机.
        * @version Egret 3.0
        * @platform Web,Native
        */
        updateFrustum(): void;
        /**
        * @language zh_CN
        * 数据更新.
        * @param camera 视椎的摄像机.
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(): void;
        /**
        * @language zh_CN
        * 检测一个坐标点是否在视椎体内
        * @param pos 检测的坐标
        * @returns 在视椎内返回ture
        * @version Egret 3.0
        * @platform Web,Native
        */
        inPoint(pos: Vector3D): boolean;
        /**
        * @language zh_CN
        * 检测一个球是否在视椎体内
        * @param center 球的坐标
        * @param radius 球的半径
        * @returns 在视椎内返回ture
        * @version Egret 3.0
        * @platform Web,Native
        */
        inSphere(center: Vector3D, radius: number): boolean;
        /**
        * @private
        **/
        private _tempVector;
        /**
        * @language zh_CN
        * 检测一个盒子是否在视椎体内
        * @param box 盒子
        * @returns 在视椎内返回ture
        * @version Egret 3.0
        * @platform Web,Native
        */
        inBox(box: BoundBox): boolean;
        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.Layer
    * @classdesc
    * Object3D 渲染Layer
    * 每个Layer分两个渲染列表，一个是有alpha的对象列表，另一个是没有alpha的对象列表
    * 不同的Layer层级可以使用不同的渲染方式，来达到各组不同的渲染效果.
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Layer {
        /**
        * @language zh_CN
        * 普通对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TAG_NAME_NORMAL_OBJECT: string;
        /**
        * @language zh_CN
        * 带alpha的普通对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TAG_NAME_NORMAL_ALPHA_OBJECT: string;
        /**
        * @language zh_CN
        * 带alpha对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TAG_NAME_ALPHA_OBJECT: string;
        /**
        * @language zh_CN
        * 贴花对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TAG_NAME_DECAL: string;
        /**
        * @language zh_CN
        * 特效对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TAG_NAME_EFFECT: string;
        /**
        * @language zh_CN
        * GUI对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        static TAG_NAME_GUI: string;
        /**
        * @language zh_CN
        * 渲染类型
        * 渲染顺序按照此列表的顺序
        * @version Egret 3.0
        * @platform Web,Native
        */
        static layerType: string[];
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        static layerTypeThan: number[];
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        static layerNumber: number;
    }
}
declare module egret3d {
    /**
    * @class egret3d.Tag
    * @classdesc
    * Object3D 渲染tag
    * 图形属性标签页的属性，由layer列表组成，共用深度信息
    * 渲染每个tag他们的深度信息是不清理的
    * 渲染顺序会根据 Tag.name来进行渲染
    * 渲染顺序按照
    * @see egret3d.Layer
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Tag {
        /**
        * @language zh_CN
        * 根据类型进行渲染排序
        * @see egret3d.Layer
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        clearDepth: boolean;
    }
}
declare module egret3d {
    /**
    * @class egret3d.Picker
    * @classdesc
    * 射线对场景中的实体对像进行检测。</p>
    * 以摄像机向场景中产生的一条射线对所有场景中的对象进行拾取。</p>
    * 根据性能的需要分为几种拣选类型。</p>
    * 1.包围盒拣选。</p>
    * 2.模型拣选返回模型拣选到的位置。</p>
    * 3.模型拣选返回模型拣选到的UV坐标。</p>
    * PickType通过 Object3D.pickType 进行修改
    * @see egret3d.Ray
    * @see egret3d.PickType
    *
    * @includeExample core/traverse/Picker.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Picker {
        protected static ray: Ray;
        /**
        * @language zh_CN
        * 根据View创建在当前view中光标射线
        * @param view 当前检测view
        * @returns Rya 光标射线
        * @version Egret 3.0
        * @platform Web,Native
        */
        static createRayToView(view: View3D, ray?: Ray): Ray;
        /**
        * @language zh_CN
        * 返回鼠标拾取对象得到的所有对象,调用之前到设置被拣选对象的pickType.
        * 会检测对象的所有子节点,然后把检测的对象进行返回
        * @param view 当前检测view
        * @param object 检测的对象
        * @param target 将结果放入到该列表
        * @returns 拾取的object列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        static pickObject3D(view: View3D, object: Object3D, target?: Object3D[]): Object3D[];
        /**
        * @language zh_CN
        * 返回射线检测对象得到的所有对象,调用之前到设置被拣选对象的pickType.
        * 会检测对象的所有子节点,然后把检测的对象进行返回
        * @param ray 当前检测射线
        * @param object 检测的对象
        * @param target 将结果放入到该列表
        * @returns 拾取的object列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        static pickObject(ray: Ray, object: Object3D, target?: Object3D[]): Object3D[];
        /**
        * @language zh_CN
        * 返回射线检测对象是否成功,调用之前到设置被拣选对象的pickType.
        * @param ray 当前检测射线
        * @param object 检测的对象
        * @returns boolean 成功返回true
        * @version Egret 3.0
        * @platform Web,Native
        */
        static doPickerObject(ray: Ray, object: Object3D): boolean;
        /**
        * @language zh_CN
        * 返回鼠标拾取对象得到的所有对象,调用之前到设置被拣选对象的pickType.
        * @param view 当前检测view
        * @param objects 检测的对象列表
        * @param target 将结果放入到该列表
        * @returns 拾取的object列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        static pickObject3DList(view: View3D, objects: IRender[], target?: IRender[]): IRender[];
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.VertexFormat
    * @classdesc
    * 顶点数据格式类型 是由2进制组成 一个顶点可以由多个类型组成
    * 创建顶点数据的顺序必需按照下面枚举定义的顺序进行赋值
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum VertexFormat {
        /**
        * @language zh_CN
        * 顶点坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        VF_POSITION = 1,
        /**
        * @language zh_CN
        * 顶点法线
        * @version Egret 3.0
        * @platform Web,Native
        */
        VF_NORMAL = 2,
        /**
        * @language zh_CN
        * 顶点切线
        * @version Egret 3.0
        * @platform Web,Native
        */
        VF_TANGENT = 4,
        /**
        * @language zh_CN
        * 顶点颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        VF_COLOR = 8,
        /**
        * @language zh_CN
        * 顶点uv
        * @version Egret 3.0
        * @platform Web,Native
        */
        VF_UV0 = 16,
        /**
        * @language zh_CN
        * 顶点第二uv
        * @version Egret 3.0
        * @platform Web,Native
        */
        VF_UV1 = 32,
        /**
        * @language zh_CN
        * 顶点蒙皮信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        VF_SKIN = 64,
        /**
          * @private
          * @language zh_CN
          * quad uv rectangle
          * @version Egret 3.0
          * @platform Web,Native
          */
        VF_QUAD_UVREC = 128,
        /**
     * @private
     * @language zh_CN
     * quad uv rectangle
     * @version Egret 3.0
     * @platform Web,Native
     */
        VF_QUAD_ROTATION = 256,
        /**
     * @private
     * @language zh_CN
     * quad uv rectangle
     * @version Egret 3.0
     * @platform Web,Native
     */
        VF_QUAD_MASK = 1024,
        /**
        * @private
        * @language zh_CN
        * quad uv rectangle
        * @version Egret 3.0
        * @platform Web,Native
        */
        VF_QUAD_POS = 2048,
        /**
        * @private
        * @language zh_CN
        * quad uv rectangle
        * @version Egret 3.0
        * @platform Web,Native
        */
        VF_QUAD_ORIGN = 4096,
        /**
         * @private
         * @language zh_CN
         * quad uv rectangle
         * @version Egret 3.0
         * @platform Web,Native
         */
        VF_QUAD_COLOR = 8192,
    }
    /**
    * @language zh_CN
    * @class egret3d.Geometry
    * @classdesc
    * 注意:当使用vertexArray 或 indexArray 必须先设置 vertexCount 或 indexCount
    * 表示几何形状 子集
    * @see egret3d.VertexBuffer3D
    * @see egret3d.IndexBuffer3D
    * @see egret3d.SubGeometry
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Geometry extends Reference {
        /**
        * @private
        * @language zh_CN
        * 顶点格式
        * @version Egret 3.0
        * @platform Web,Native
        */
        drawType: number;
        /**
        * @language zh_CN
        * 顶点格式
        * @default 0
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _vertexFormat;
        /**
        * @language zh_CN
        * 顶点属性长度
        * @default 0
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertexAttLength: number;
        /**
        * @language zh_CN
        * 顶点数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertexArray: Float32Array;
        /**
        * @language zh_CN
        * 索引数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        indexArray: Uint16Array;
        /**
        * @language zh_CN
        * shader buffer
        * @version Egret 3.0
        * @platform Web,Native
        */
        sharedVertexBuffer: VertexBuffer3D;
        /**
        * @language zh_CN
        * shader index
        * @version Egret 3.0
        * @platform Web,Native
        */
        sharedIndexBuffer: IndexBuffer3D;
        /**
        * @private
        */
        private _skeleton;
        /**
        * @private
        */
        skeletonGPUData: Float32Array;
        /**
        * @language zh_CN
        * 顶点字节数
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertexSizeInBytes: number;
        /**
        * @language zh_CN
        * 面翻转，仅对系统 geometry 有效
        * @version Egret 3.0
        * @platform Web,Native
        */
        faceOrBack: boolean;
        /**
        * @language zh_CN
        * 顶点坐标大小
        * @default 3
        * @version Egret 3.0
        * @platform Web,Native
        */
        static positionSize: number;
        /**
        * @language zh_CN
        * 顶点法线大小
        * @default 3
        * @version Egret 3.0
        * @platform Web,Native
        */
        static normalSize: number;
        /**
        * @language zh_CN
        * 顶点切线大小
        * @default 3
        * @version Egret 3.0
        * @platform Web,Native
        */
        static tangentSize: number;
        /**
        * @language zh_CN
        * 顶点色大小
        * @default 4
        * @version Egret 3.0
        * @platform Web,Native
        */
        static colorSize: number;
        /**
        * @language zh_CN
        * 顶点uv大小
        * @default 2
        * @version Egret 3.0
        * @platform Web,Native
        */
        static uvSize: number;
        /**
        * @language zh_CN
        * 顶点uv2大小
        * @default 2
        * @version Egret 3.0
        * @platform Web,Native
        */
        static uv2Size: number;
        /**
        * @language zh_CN
        * 顶点uv2大小
        * @default 8
        * @version Egret 3.0
        * @platform Web,Native
        */
        static skinSize: number;
        /**
        * @language zh_CN
        * geometry子集
        * @version Egret 3.0
        * @platform Web,Native
        */
        subGeometrys: Array<SubGeometry>;
        /**
        * @language zh_CN
        * @private
        * buffer 需要重新提交的时候
        */
        private _bufferDiry;
        /**
        * @language zh_CN
        * 是否重新提交数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 是否重新提交数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        bufferDiry: boolean;
        /**
        * @language zh_CN
        * 顶点的数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _vertexCount;
        /**
        * @language zh_CN
        * 索引数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _indexCount;
        private _totalIndexCount;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        skeleton: Skeleton;
        /**
        * @language zh_CN
        * 顶点的数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置顶点的数量，同时 this.vertexArray = new Float32Array(this.vertexAttLength * this.vertexCount);
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertexCount: number;
        /**
        * @language zh_CN
        * 索引的数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置索引的数量，同时 this.indexArray = new Uint16Array(this._indexCount);
        * @version Egret 3.0
        * @platform Web,Native
        */
        indexCount: number;
        _faceCount: number;
        /**
        * @language zh_CN
        * 模型面数
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 模型面数
        * @version Egret 3.0
        * @platform Web,Native
        */
        faceCount: number;
        /**
        * @language zh_CN
        * @private
        */
        buildDefaultSubGeometry(): void;
        /**
        * @language zh_CN
        * 获取顶点格式
        * @returns number 顶点格式
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 使用和定义顶点的数据结构
        *<p>例如 vertexFormat( VertexFormat.VF_POSITION )
        *设置这样的定义后,就会增加这样的数据顶点数据结构，
        *如果源文件中没有这样的数据结构，
        *就会通过计算的方式计算补全，
        *不能计算的就默认为0
        *@param vertexFormat 需要定义的顶点格式类型 VertexFormat.VF_COLOR | VertexFormat.VF_UV1
        * this.useVertexFormat( VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_COLOR |  VertexFormat.VF_UV0 | VertexFormat.VF_UV1 );//定义了一个完整的数据结构
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertexFormat: number;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        activeState(time: number, delay: number, context3DProxy: Context3DProxy, camera3D: Camera3D): void;
        /**
        * @language zh_CN
        * @private
        * 提交顶点数据 如果顶点数据有变化的话,需要调用此函数重新提交
        * @param context3DProxy 上下文设备
        * @version Egret 3.0
        * @platform Web,Native
        */
        upload(context3DProxy: Context3DProxy, drawType?: number): void;
        /**
        * @language zh_CN
        * 由顶点索引根据格式拿到顶点数据
        * @param index 顶点索引
        * @param vf 得到顶点的需要的数据格式
        * @param target 得到数据返回目标可以为null
        * @param count 得到顶点个数 默认一个
        * @version Egret 3.0
        * @platform Web,Native
        */
        getVertexForIndex(index: number, vf: VertexFormat, target?: Array<number>, count?: number): Array<number>;
        /**
        * @language zh_CN
        * 由顶点索引根据格式设置顶点数据
        * @param index 顶点索引
        * @param vf 设置顶点的需要的数据格式
        * @param src 设置的数据
        * @param vertexCount 设置的顶点数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        setVerticesForIndex(index: number, vf: VertexFormat, src: Array<number>, vertexCount?: number): void;
        /**
        * @language zh_CN
        * 获取顶点索引数据
        * @param start 数据开始位置
        * @param count 需要的索引数据，默认参数为-1，如果为-1那么取从start后面的所有索引数据
        * @param target 取到之后的数据，默认参数为null，如果为null那么就会new Array<number>进行返回
        * @returns Array<number> 索引数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        getVertexIndices(start: number, count?: number, target?: Array<number>): Array<number>;
        /**
        * @language zh_CN
        * 设置顶点索引数据
        * @param start 数据开始位置
        * @param indices 数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        setVertexIndices(start: number, indices: Array<number>): void;
        cloneMirror(x: boolean, y: boolean, z: boolean): Geometry;
        copy(other: Geometry): void;
        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.GeometryData
     * @classdesc
     * GeometryData类 表示几何形状数据
     *
     * @version Egret 3.0
     * @platform Web,Native
     * @includeExample geometry/GeometryData.ts
     */
    class GeometryData {
        /**
        * @language zh_CN
        * 顶点属性长度
        */
        vertexAttLength: number;
        /**
        * @language zh_CN
        * 数据长度
        */
        length: number;
        /**
        * @language zh_CN
        * 顶点长度
        */
        vertLen: number;
        /**
        * @language zh_CN
        * 面数
        */
        faces: number;
        /**
        * @language zh_CN
        * 索引数据
        */
        source_indexData: Array<number>;
        /**
        * @language zh_CN
        * 顶点数据
        */
        source_vertexData: Array<number>;
        /**
        * @language zh_CN
        * 顶点色数据
        */
        source_vertexColorData: Array<number>;
        /**
        * @language zh_CN
        * 顶点法线
        */
        source_normalData: Array<number>;
        /**
        * @language zh_CN
        * 顶点切线数据
        */
        source_tangtData: Array<number>;
        /**
        * @language zh_CN
        * 顶点uv数据
        */
        source_uvData: Array<number>;
        /**
        * @language zh_CN
        * 顶点uv2数据
        */
        source_uv2Data: Array<number>;
        /**
        * @language zh_CN
        * 蒙皮数据
        */
        source_skinData: Array<number>;
        /**
        * @language zh_CN
        * 顶点索引
        */
        vertexIndex: number;
        /**
        * @language zh_CN
        * 索引数据数组
        */
        indices: Array<number>;
        /**
        * @language zh_CN
        * 顶点数据数组(x、y、z)三个number为一个顶点数据
        */
        vertices: Array<number>;
        /**
        * @language zh_CN
        * 法线数据数组(x、y、z)三个number为一个法线数据
        */
        normals: Array<number>;
        /**
        * @language zh_CN
        * 切线数据数组(x、y、z)三个number为一个切线数据
        */
        tangts: Array<number>;
        /**
        * @language zh_CN
        * 顶点颜色数据数组
        */
        verticesColor: Array<number>;
        /**
        * @language zh_CN
        * 第一套UV数据数组
        */
        uvs: Array<number>;
        /**
        * @language zh_CN
        * 第二套UV数据数组
        */
        uv2s: Array<number>;
        /**
        * @language zh_CN
        * 蒙皮数据数组
        */
        skinMesh: Array<number>;
        /**
        * @language zh_CN
        * 面法线数据数组
        */
        faceNormals: Array<number>;
        /**
        * @language zh_CN
        * 面权重数据数组
        */
        faceWeights: Array<number>;
        /**
          * @language zh_CN
          * 顶点索引数据
          */
        vertexIndices: Array<number>;
        /**
        * @language zh_CN
        * uv索引数据
        */
        uvIndices: Array<number>;
        /**
        * @language zh_CN
        * uv2索引数据
        */
        uv2Indices: Array<number>;
        /**
        * @language zh_CN
        * 法线索引数据
        */
        normalIndices: Array<number>;
        /**
        * @language zh_CN
        * 顶点色索引数据
        */
        colorIndices: Array<number>;
        /**
        * @language zh_CN
        * 索引数据数组
        */
        indexIds: Array<any>;
        skeleton: Skeleton;
        /**
        * @language zh_CN
        * 顶点数据数组
        */
        vertexDatas: Array<number>;
        matCount: number;
        material: any;
        /**
        * @language zh_CN
        *
        * 构建顶点数据数组
        * @param source 未组合顶点数据的GeometryData对象
        * @param vertexFormat 生成顶点格式
        * @returns 经过组合并生成顶点数据数组的新GeometryData对象
        */
        static buildGeomtry(source: GeometryData, vertexFormat: number): Geometry;
        /**
        * 4 pos
        * 3 normal
        * 4 color
        * 2 uv
        * 2 uv2s
        * length 15
        */
        private static combinGeomtryData(geomtrtData, needTangent?);
        /**
         * @private
         * Updates the normals for each face.
         */
        static updateFaceNormals(geomtrtData: GeometryData): void;
        /**
         * Updates the vertex normals based on the geometry.
         */
        private static updateVertexNormals(geomtrtData);
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.SubGeometry
     * @classdesc
     * 表示几何形状 子集 不同的子集渲染时使用的材质会不同。
     * 这样就可以用不同的材质来共用相同的geometry buffer
     *
     * @see egret3d.Geometry
     * @version Egret 3.0
     * @platform Web,Native
     */
    class SubGeometry {
        private useVertexAttributeList;
        /**
         * @language zh_CN
         * 顶点索引
         * @version Egret 3.0
         * @platform Web,Native
         */
        protected _start: number;
        /**
        * @language zh_CN
        * 顶点索引中的索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 顶点索引中的索引
        * @version Egret 3.0
        * @platform Web,Native
        */
        start: number;
        /**
        * @language zh_CN
        * 顶点索引数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        count: number;
        /**
        * @language zh_CN
        * 材质ID 对应 IRender.getMaterial(this.matID)
        * @see egret3d.IRender
        * @version Egret 3.0
        * @platform Web,Native
        */
        matID: number;
        /**
        * @language zh_CN
        * 对应的网格数据对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        geometry: Geometry;
        /**
        * @language zh_CN
        * 材质球的漫反射贴图。
        * @version Egret 3.0
        * @platform Web,Native
        */
        textureDiffuse: string;
        /**
         * @language zh_CN
         * 材质球的凹凸法线贴图。
        * @version Egret 3.0
        * @platform Web,Native
         */
        textureNormal: string;
        /**
        * @language zh_CN
        * 材质球的高光贴图。
        * @version Egret 3.0
        * @platform Web,Native
        */
        textureSpecular: string;
        /**
        * @language zh_CN
        * @private
        */
        preAttList: Array<GLSL.Attribute>;
        /**
        * @private
        * @language zh_CN
        */
        upload(passUsage: PassUsage, contextPorxy: Context3DProxy): void;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        static use: boolean;
        /**
       * @private
       * @language zh_CN
       * @version Egret 3.0
       * @platform Web,Native
       */
        private localActive;
        /**
       * @private
       * @language zh_CN
       * @version Egret 3.0
       * @platform Web,Native
       */
        activeState(time: number, delay: number, passUsage: PassUsage, contextProxy: Context3DProxy): void;
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.CubeGeometry
     * @classdesc
     * CubeGeometry类 表示立方体</p>
     *
     * 示例：</p>
     * 用 CubeGeometry 对象创建一个mesh，并给予默认纹理材质TextureMaterial（默认为棋盘格纹理）; </p>
     <pre>
      var box: egret3d.Mesh = new egret3d.Mesh( new egret3d.CubeGeometry(), new egret3d.TextureMaterial() );
     </pre>
     *
     * @see egret3d.Geometry
     * @see egret3d.Mesh
     * @version Egret 3.0
     * @platform Web,Native
     * @includeExample geometry/CubeGeometry.ts
     */
    class CubeGeometry extends Geometry {
        private _width;
        /**
        * @language zh_CN
        * Cube宽度
        * @returns {number} 宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        private _height;
        /**
        * @language zh_CN
        * Cube高度
        * @returns {number} 高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        private _depth;
        /**
        * @language zh_CN
        * Cube深度
        * @returns {number} 高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        depth: number;
        /**
        * @language zh_CN
        * 构造函数
        * @param width {number} 宽度 默认为80
        * @param height {number} 高度 默认为80
        * @param depth {number} 深度 默认为80
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(width?: number, height?: number, depth?: number);
        /**
        * @private
        * @language zh_CN
        * 生成网格
        * @version Egret 3.0
        * @platform Web,Native
        */
        buildGeomtry(front: boolean): void;
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.CylinderGeometry
     * @classdesc
     * CylinderGeometry类 表示圆柱体</p>
     *
     * 示例：</p>
     * 用 CylinderGeometry 对象创建一个mesh，并给予默认纹理材质TextureMaterial（默认为棋盘格纹理)</p>
     <pre>
     var box: egret3d.Mesh = new egret3d.Mesh( new egret3d.CylinderGeometry(), new egret3d.TextureMaterial() );
     </pre>
     * @includeExample geometry/CubeGeometry.ts
     * @see egret3d.Geometry
     * @version Egret 3.0
     * @platform Web,Native
     */
    class CylinderGeometry extends Geometry {
        private _height;
        /**
        * @language zh_CN
        * 圆柱体高度
        * @returns {number} 高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        private _radius;
        /**
        * @language zh_CN
        * 圆柱体半径
        * @returns {number} 半径
        * @version Egret 3.0
        * @platform Web,Native
        */
        radius: number;
        /**
        * @language zh_CN
        * 构造函数
        * @param height {number} 宽度 默认为100
        * @param radius {number} 半径 默认为200
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(height?: number, radius?: number);
        /**
        * @private
        * @language zh_CN
        * 生成网格
        */
        buildGeomtry(): void;
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.PlaneGeometry
     * @classdesc
     * PlaneGeometry类 表示面板几何体
     *
     * 示例：
     * //用 PlaneGeometry 对象创建一个mesh，并给予默认纹理材质TextureMaterial（默认为棋盘格纹理）;
     * var box: egret3d.Mesh = new egret3d.Mesh( new egret3d.PlaneGeometry(), new egret3d.TextureMaterial() );
     *
     * @version Egret 3.0
     * @platform Web,Native
     * @includeExample geometry/CubeGeometry.ts
     */
    class PlaneGeometry extends Geometry {
        /**
        * @private
        */
        private _wCenter;
        /**
        * @private
        */
        private _hCenter;
        private _segmentsW;
        /**
        * @language zh_CN
        * 宽度分段数
        * @returns {number} 宽度分段数
        * @version Egret 3.0
        * @platform Web,Native
        */
        segmentsW: number;
        private _segmentsH;
        /**
        * @language zh_CN
        * 高度分段数
        * @returns {number} 高度分段数
        * @version Egret 3.0
        * @platform Web,Native
        */
        segmentsH: number;
        private _width;
        /**
        * @language zh_CN
        * 宽度
        * @returns {number} 宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        private _height;
        /**
        * @language zh_CN
        * 高度
        * @returns {number} 高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        private _scaleU;
        /**
        * @language zh_CN
        * U缩放
        * @returns {number} 缩放值
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleU: number;
        private _scaleV;
        /**
        * @language zh_CN
        * U缩放
        * @returns {number} 缩放值
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleV: number;
        /**
        * @language zh_CN
        * 构造函数
        * @param width {number} 宽度
        * @param height {number} 高度
        * @param segmentsW {number} 宽度分段数
        * @param segmentsH {number} 高度分段数
        * @param uScale {number} U缩放
        * @param vScale {number} V缩放
        * @param aixs {Vector3D} 平面的朝向 默认参数为Vector3D.Y_AXIS
        * @param wCenter {boolean} 是否width以中心位置为(0,0)点
        * @param hCenter {boolean} 是否height以中心位置为(0,0)点
        */
        constructor(width?: number, height?: number, segmentsW?: number, segmentsH?: number, uScale?: number, vScale?: number, aixs?: Vector3D, wCenter?: boolean, hCenter?: boolean);
        private buildGeometry(aixs);
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.SphereGeometry
     * @classdesc
     * SphereGeometry类 表示球体
     *
     * 示例：
     * //用 SphereGeometry 对象创建一个mesh，并给予默认纹理材质TextureMaterial（默认为棋盘格纹理）;
     * var box: egret3d.Mesh = new egret3d.Mesh( new egret3d.SphereGeometry(), new egret3d.TextureMaterial() );
     *
     * @version Egret 3.0
     * @platform Web,Native
     * @includeExample geometry/CubeGeometry.ts
     */
    class SphereGeometry extends Geometry {
        private _segmentsW;
        /**
        * @language zh_CN
        * 宽度分段数
        * @returns {number} 宽度分段数
        * @version Egret 3.0
        * @platform Web,Native
        */
        segmentsW: number;
        private _segmentsH;
        /**
        * @language zh_CN
        * 高度分段数
        * @returns {number} 高度分段数
        * @version Egret 3.0
        * @platform Web,Native
        */
        segmentsH: number;
        private _radius;
        /**
        * @language zh_CN
        * 半径
        * @returns {number} 半径
        * @version Egret 3.0
        * @platform Web,Native
        */
        radius: number;
        /**
        * @language zh_CN
        * 构造函数
        * @param r {number} 半径 默认值 100
        * @param segmentsW {number} 宽度分段数 默认值 15
        * @param segmentsH {number} 高度分段数 默认值 15
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(r?: number, segmentsW?: number, segmentsH?: number);
        private buildSphere(front?);
    }
}
declare module egret3d {
    /**
     * @private
     * @class egret3d.OctahedronSphereGeometry
     * @classdesc
     * 六面体球形Geometry
     * @version Egret 3.0
     * @platform Web,Native
     * @includeExample geometry/CubeGeometry.ts
     */
    class OctahedronSphereGeometry extends Geometry {
        private _subdivisions;
        private _radius;
        private vector3_Down;
        private vector3_Forward;
        private vector3_Up;
        private directions;
        /**
        * @language zh_CN
        * 构造函数
        * @returns {number} 宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(subdivisions: number, radius: number, isHemisphere?: boolean);
        buildGeomtry(front: boolean, isHemisphere: boolean): void;
        private CreateOctahedron(vertices, triangles, resolution, isHemisphere);
        private CreateLowerStrip(steps, vTop, vBottom, t, triangles);
        private CreateVertexLine(_from, _to, steps, v, vertices);
        private CreateUpperStrip(steps, vTop, vBottom, t, triangles);
        private Normalize(vertices, normals, front);
        private CreateUV(vertices, uv);
        private CreateTangents(vertices, tangents);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.GeometryUtil
    * @classdesc
    * 创建Geometry的功能类,
    * 可以创建引擎内部默认顶点数据类型的 Geometry
    * @see egret3d.Geometry
    * @version Egret 3.0
    * @platform Web,Native
    */
    class GeometryUtil {
        /**
        * @language zh_CN
        * 创建一个Geometry对象，指定了顶点的数据结构，但是顶点数据需要额外填充
        * @param vertexFromat {VertexFormat} 顶点数据格式，默认参数为 VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_TANGENT | VertexFormat.VF_COLOR | VertexFormat.VF_UV0 | VertexFormat.VF_UV1
        * @default VertexFormat.VF_POSITION | VertexFormat.VF_NORMAL | VertexFormat.VF_TANGENT | VertexFormat.VF_COLOR | VertexFormat.VF_UV0 | VertexFormat.VF_UV1
        * @returns {Geometry} Geometry对象
        * @see egret3d.VertexFormat
        * @version Egret 3.0
        * @platform Web,Native
        */
        static createGeometry(vertexFromat?: VertexFormat): Geometry;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        static createGemetryForType(type: string, gemetry: any): Geometry;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        static fromVertexFormatToLength(vf: VertexFormat): number;
    }
}
declare module egret3d {
    /**
    * @class egret3d.ElevationGeometry
    * @classdesc
    * 使用高度图创建Geometry
    * 高度图的一个任意一个通道 算出0.0 - 1.0 值  然后乘以 height 就是当前顶点高度值
    * @version Egret 3.0
    * @platform Web,Native
    * @includeExample geometry/CubeGeometry.ts
    */
    class ElevationGeometry extends Geometry {
        private _width;
        private _height;
        private _segmentsW;
        private _segmentsH;
        private _depth;
        private _minElevation;
        private _maxElevation;
        private _heightmap;
        private _scaleU;
        private _scaleV;
        private _imageData;
        private _positionXYZ;
        /**
        * @language zh_CN
        * 得到宽度
        * @returns {ImageTexture} 宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 得到高度
        * @returns {ImageTexture} 高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @language zh_CN
        * 得到深度
        * @returns {ImageTexture} 深度
        * @version Egret 3.0
        * @platform Web,Native
        */
        depth: number;
        /**
        * @language zh_CN
        * 得到高度图
        * @returns {ImageTexture} 高度图
        * @version Egret 3.0
        * @platform Web,Native
        */
        heightmap: ImageTexture;
        /**
        * @language zh_CN
        * 得到格子列数
        * @returns {number} 格子列数
        * @version Egret 3.0
        * @platform Web,Native
        */
        segmentsW: number;
        /**
        * @language zh_CN
        * 得到格子行数
        * @returns {number} 格子行数
        * @version Egret 3.0
        * @platform Web,Native
        */
        segmentsH: number;
        /**
        * @language zh_CN
        * 构造函数
       
        * @param heightmap {ImageTexture} 高度图
        * @param width {number} 地形宽度 默认1000
        * @param height {number} 地形主度 默认100
        * @param depth {number} 地形长度 默认1000
        * @param segmentsW {number} 格子列 默认30
        * @param segmentsH {number} 格子行 默认30
        * @param maxElevation {number} 高度最大值 默认255
        * @param minElevation {number} 高度最小值 默认0
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(heightmap: ImageTexture, width?: number, height?: number, depth?: number, segmentsW?: number, segmentsH?: number, maxElevation?: number, minElevation?: number);
        /**
       * @private
       * @language zh_CN
       * 生成网格
       * @version Egret 3.0
       * @platform Web,Native
       */
        buildGeomtry(front: boolean): void;
        /**
       * @language zh_CN
       * @private
       * 根据像素点获取高度
     
       * @param intX {number} 像素整形位置X
       * @param intZ {number} 像素整形位置Z
       * @returns {number} 指定位置的高度
       * @version Egret 3.0
       * @platform Web,Native
       */
        private getHeightByPixel(intX, intZ);
        /**
        * @language zh_CN
        * @private
        * 获取像素点颜色
        * @param intX {number} 像素浮点位置X
        * @param intZ {number} 像素浮点位置Z
        * @returns {number} 颜色值
        * @version Egret 3.0
        * @platform Web,Native
        */
        private getPixelColor(intX, intZ);
        /**
        * @language zh_CN
        * 根据像素浮点位置获取3D场景的位置(需要插值计算)
        * @param floatX {number} 像素浮点位置X
        * @param floatZ {number} 像素浮点位置Z
        * @param imageWidth {number} 所在图片的宽度
        * @param imageHeight {number} 所在图片的高度
        * @returns {Vector3D} 场景中的3D坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        get3DCoordAtPixel(floatX: number, floatZ: number, imageWidth: number, imageHeight: number, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 根据3D场景中的浮点位置X和Z获取高度Y
        * @param floatX {number} 像素浮点位置X
        * @param floatZ {number} 像素浮点位置Z
        * @return {number} 指定位置的高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        getHeightBySceneCoord(floatX: number, floatZ: number): number;
        private updateFaceNormals();
    }
}
declare module egret3d {
    class Face {
        v_0: Vector3D;
        v_1: Vector3D;
        v_2: Vector3D;
        min: Vector3D;
        max: Vector3D;
        centre: Vector3D;
        constructor();
    }
    class TerrainCollision {
        mesh: Mesh;
        private _geometry;
        private _kdTree;
        private _offsetPos;
        constructor(mesh: Mesh);
        private buildFace();
        private height;
        selectFaces: Face[];
        getTerrainCollisionHeight(sceneX: number, sceneZ: number): number;
        checkPointInTriangle(x: number, y: number, face: Face): boolean;
        private getHeightInTriangle(x, y, face);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Input
    * @classdesc
    * 触摸事件信息参数。
    * 作为触摸事件基本参数保存于TouchEvent3D，
    * @see egret3d.TouchEvent3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class TouchData {
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(touch: Touch);
        /**
       * @language zh_CN
       * 相对于Egret3DCanvas左上角位置的水平偏移量。
       * 基于 Egret3DCanvas 的x坐标
       * @see egret3d.Egret3DCanvas
       * @version Egret 3.0
       * @platform Web,Native
       */
        canvasX: number;
        /**
        * @language zh_CN
        * 相对于Egret3DCanvas左上角位置的垂直偏移量。
        * 基于 Egret3DCanvas 的y坐标
        * @see egret3d.Egret3DCanvas
        * @version Egret 3.0
        * @platform Web,Native
        */
        canvasY: number;
        /**
        * @language zh_CN
        * touch id
        * @version Egret 3.0
        * @platform Web,Native
        */
        identifier: number;
        /**
       * @language zh_CN
       * 相对于浏览器内容区域左上角位置的水平偏移量，该参照点会随之滚动条的移动而移动。
       * @version Egret 3.0
       * @platform Web,Native
       */
        clientX: number;
        /**
        * @language zh_CN
        * 相对于浏览器内容区域左上角位置的垂直偏移量，该参照点会随之滚动条的移动而移动。
        * @version Egret 3.0
        * @platform Web,Native
        */
        clientY: number;
        /**
      * @language zh_CN
      * 相对于浏览器内容区域左上角位置的水平偏移量，该参照点不会随之滚动条的移动而移动。
      * @version Egret 3.0
      * @platform Web,Native
      */
        pageX: number;
        /**
        * @language zh_CN
        * 相对于浏览器内容区域左上角位置的垂直偏移量，该参照点不会随之滚动条的移动而移动。
        * @version Egret 3.0
        * @platform Web,Native
        */
        pageY: number;
        /**
     * @language zh_CN
     * 相对于用户屏幕左上角位置的水平偏移量。
     * @version Egret 3.0
     * @platform Web,Native
     */
        screenX: number;
        /**
      * @language zh_CN
      * 相对于用户屏幕左上角位置的垂直偏移量。
      * @version Egret 3.0
      * @platform Web,Native
      */
        screenY: number;
    }
    /**
     * @language zh_CN
     * @class egret3d.Input
     * @classdesc
     * 处理输入设备,鼠标.键盘.触摸。
     * 当点事件产生时如果没有点击到任何的View3D内，
     * 当前事件将不用派发.
     * @includeExample input/Input.ts
     * @see egret3d.EventDispatcher
     *
     * @version Egret 3.0
     * @platform Web,Native
     */
    class Input extends EventDispatcher {
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        static canvas: Egret3DCanvas;
        static scaleX: number;
        static scaleY: number;
        static getX(value: number): number;
        static getY(value: number): number;
        /**
        * @language zh_CN
        * 当前鼠标X坐标。
        * 基于 Egret3DCanvas 的x坐标
        * @see egret3d.Egret3DCanvas
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mouseX: number;
        /**
        * @language zh_CN
        * 当前鼠标Y坐标。
        * 基于 Egret3DCanvas 的y坐标
        * @see egret3d.Egret3DCanvas
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mouseY: number;
        /**
        * @language zh_CN
        * 鼠标滚轮增量值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        static wheelDelta: number;
        /**
        * @language zh_CN
        * 鼠标X坐标的偏移值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mouseOffsetX: number;
        /**
        * @language zh_CN
        * 鼠标Y坐标的偏移值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mouseOffsetY: number;
        /**
        * @language zh_CN
        * 上一次鼠标X坐标。
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mouseLastX: number;
        /**
        * @language zh_CN
        * 上一次鼠标Y坐标。
        * @version Egret 3.0
        * @platform Web,Native
        */
        static mouseLastY: number;
        private _time;
        private _keyStatus;
        private _mouseStatus;
        private _isTouchStart;
        protected _mouseEvent3d: MouseEvent3D;
        protected _keyEvent3d: KeyEvent3D;
        protected _touchEvent3d: TouchEvent3D;
        protected _windowsEvent3d: Event3D;
        protected _orientationEvent3d: OrientationEvent3D;
        /**
        * @language zh_CN
        * 游戏手柄Stick1事件侦听函数。
        * @version Egret 3.0
        * @platform Web,Native
        */
        private onGamepadStick1;
        /**
        * @language zh_CN
        * 游戏手柄Stick2事件侦听函数。
        * @version Egret 3.0
        * @platform Web,Native
        */
        private onGamepadStick2;
        private static _instance;
        /**
        * @language zh_CN
        * 获取Input类对象的单例。
        * @returns Input
        * @version Egret 3.0
        * @platform Web,Native
        */
        private static instance;
        /**
        * @language zh_CN
        * 创建一个新的 Input 对象。
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        private disableWindowTouch;
        init(canvas: HTMLCanvasElement): void;
        /**
        * @language zh_CN
        * 对象注册事件侦听器对象，以使侦听器能够接收事件通知。可以为特定类型的事件和优先级注册事件侦听器。
        * 成功注册一个事件侦听器后，不使用后 需要removeEventListenerAt().
        * @param type {string} 事件的类型。
        * @param callback {Function} 处理事件的侦听器函数。此函数必须接受 Event3D 对象作为其唯一的参数，并且不能返回任何结果，
        * 如下面的示例所示： function(evt:Event3D):void 函数可以有任何名称。
        * @param param 事件携带参数
        * @param  priority {number} 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
        * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
        * @returns 事件ID 返回值 removeEventListenerAt 时会用到
         * @version Egret 3.0
         * @platform Web,Native
        */
        static addEventListener(type: string, callback: Function, thisObject: any, param?: any, priolity?: number): number;
        addEventListener(type: string, callback: Function, thisObject: any, param?: any, priority?: number): number;
        /**
         * @language zh_CN
         * 根据addEventListener传入的事件数据信息,移除事件侦听器。
         * @param type {string} 事件名。
         * @param callback {Function} 侦听函数。
         * @version Egret 3.0
         * @platform Web,Native
         */
        static removeEventListener(type: string, callback: Function, thisObject: any): void;
        /**
         * @language zh_CN
         * 根据addEventListener 的返回值,移除事件侦听器。
         * @param id  事件id, addEventListener 的返回值.
         * @version Egret 3.0
         * @platform Web,Native
         */
        static removeEventListenerAt(id: number): void;
        /**
        * @private
        * @language zh_CN
        * 获取按键是否压下
        * @param code
        * @version Egret 3.0
        * @platform Web,Native
        */
        static getKeyPress(code: KeyCode): boolean;
        /**
        * @private
        * @language zh_CN
        * 获取鼠标是否压下
        * @param code
        * @version Egret 3.0
        * @platform Web,Native
        */
        static getMousePress(code: MouseCode): boolean;
        private _gp;
        private ongamepaddisconnected(e);
        private ongamepadconnected(e);
        /**
        * @language zh_CN
        * 游戏手柄按钮是否按下。
        * @version Egret 3.0
        * @platform Web,Native
        * @param index {number}
        * @returns {boolean}
        */
        private getGamepadButtonState(index);
        /**
        * @language zh_CN
        * 游戏手柄摇杆方向 Stick1 。
        * @version Egret 3.0
        * @platform Web,Native
        * @returns {Vector3D}
        */
        private getGamepadStick1();
        /**
        * @language zh_CN
        * 游戏手柄摇杆方向 Stick2 。
        * @version Egret 3.0
        * @platform Web,Native
        * @returns {Vector3D}
        */
        private getGamepadStick2();
        private canGame();
        /**
        * @private
        * @language zh_CN
        * 更新游戏手柄信息。
        * @version Egret 3.0
        * @platform Web,Native
        */
        static reportOnGamepad(): void;
        private printout();
        private onPinch(x, y, x1, y1);
        private onSwipe(x, y);
        private touchStart(e);
        private _oldPosition1;
        private _oldPosition2;
        private touchEnd(e);
        private touchMove(e);
        private GetTargetTouches(targetTouches);
        private mouseClick(e);
        private mouseEnd(e);
        protected deliverMessage(): boolean;
        private mouseStart(e);
        private mouseMove(e);
        private mouseOver(e);
        private mouseWheel(e);
        private keyDown(e);
        private keyUp(e);
        private onWindowsResize(e);
        private onOrientationChange(e);
        private onDeviceMotion(e);
        private onDeviceOrientation(e);
        private GetSlideAngle(dx, dy);
        /**
        * @language zh_CN
        * 根据起点和终点返回方向
        * @param  startX {Number} 起点X坐标
        * @param  startY {Number} 起点Y坐标
        * @param  endX   {Number} 终点X坐标
        * @param  endY   {Number} 终点Y坐标
        * @returns result {number} 1：向上，2：向下，3：向左，4：向右,0：未滑动
        */
        GetSlideDirection(startX: number, startY: number, endX: number, endY: number): number;
        private isEnlarge(op1, op2, np1, np2);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3D.OrientationControler
    * @classdesc
    * 陀螺仪控制器
    * 当前控制器使用后直接控制 view3D.camera3D 的本地旋转
    * @see egret3d.View3D
    * @see egret3d.Camera3D
    * @includeExample input/OrientationControler.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class OrientationController {
        private acc;
        private accGravity;
        private rotationRate;
        private orientation;
        private screenOrientation;
        private openDebug;
        private accDiv;
        private accGravityDiv;
        private rotationRateDiv;
        private orientationRateDiv;
        private stateDiv;
        /**
        * @language zh_CN
        * 偏移旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        offsetRotation: Vector3D;
        /**
        * @language zh_CN
        * 构造函数，构建一个陀螺仪控制器
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 开始陀螺仪控制
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(): void;
        /**
        * @language zh_CN
        * 释放陀螺仪控制
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        */
        protected orientationchangeHandler(): void;
        /**
        * @language zh_CN
        *
        * @param event
        */
        protected motionHandler(event: DeviceMotionEvent): void;
        /**
        * @language zh_CN
        *
        * @param event
        * @returns
        */
        protected orientationHandler(event: DeviceOrientationEvent): void;
        /**
        * @private
        * @language zh_CN
        * 陀螺仪当前旋转角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        fixOritation: Vector3D;
        private state;
        private debug();
        /**
        * @private
        * @language zh_CN
        *
        * @returns number
        * @version Egret 3.0
        * @platform Web,Native
        */
        getOrientation(): number;
        private degtorad;
        private q;
        private q1;
        private outQ;
        /**
        * @private
        * @language zh_CN
        * 由陀螺仪的角度值计算出旋转四元数
        * @param alpha
        * @param beta
        * @param gamma
        * @returns 旋转四元数
        * @version Egret 3.0
        * @platform Web,Native
        */
        getQuaternion(alpha: number, beta: number, gamma: number): Quaternion;
        private fix;
        private fixinterpolate;
        private fixAxis;
        private caheFixAxis;
        private steps;
        private interpolate;
        /**
        * @language zh_CN
        * 数据更新
        * 陀螺仪会直接控制view3D.camera3D的旋转
        * @param view3D 当前控制view3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(view3D: View3D): void;
        private getBaseQuaternion(alpha, beta, gamma);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.ILoader
    * @classdesc
    * 加载器基类,
    * 加载完成后会返回相应的数据对象
    * @see egret3d.EventDispatcher
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ILoader extends EventDispatcher {
        /**
         * @language zh_CN
         * 以二进制方式接收加载的数据
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_BINARY: string;
        /**
         * @language zh_CN
         * 以文本的方式接收加载的数据
         * 默认方式
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_TEXT: string;
        /**
         * @language zh_CN
         * 以音频的方式接收加载的数据
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_SOUND: string;
        /**
         * @language zh_CN
         * 以图像的方式接收加载的数据
         * 支持jpg.png.等格式
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_BITMAP: string;
        /**
         * @language zh_CN
         * 以DDS的方式接收加载的数据
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_DDS: string;
        /**
         * @language zh_CN
         * 以TGA的方式接收加载的数据
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_TGA: string;
        /**
         * @language zh_CN
         * 以ESM格式接收加载的数据
         * Egret3D独有的格式 模型+蒙皮
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_ESM: string;
        /**
         * @language zh_CN
         * 以EAM格式接收加载的数据
         * Egret3D独有的格式 动作文件
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_EAM: string;
        /**
       * @language zh_CN
       * 以ERM格式接收加载的数据
       * Egret3D独有的格式 整个场景资源
       * @version Egret 3.0
       * @platform Web,Native
       */
        static DATAFORMAT_E3DPACK: string;
        /**
        * @language zh_CN
        * 以EUM格式接收加载的数据
        * Egret3D独有的格式 导出场景地第二UV信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        static DATAFORMAT_EUM: string;
        /**
         * @language zh_CN
         * 以ECA格式接收加载的数据
         * Egret3D独有的格式 相机动画文件
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_ECA: string;
        /**
         * @language zh_CN
         * 以EPA格式接收加载的数据
         * Egret3D独有的格式 属性动画文件
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_EPA: string;
        /**
         * @private
         * @language zh_CN
         * 以pvr格式接收加载的数据
         * @version Egret 3.0
         * @platform Web,Native
         */
        static DATAFORMAT_PVR: string;
        /**
        * @private
        * @language zh_CN
        * 以pvr格式接收加载的数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        static DATAFORMAT_HDR: string;
        /**
        * @private
        * @language zh_CN
        * 以json格式接收加载的数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        static DATAFORMAT_JSON: string;
        /**
        * @private
        * @language zh_CN
        * 以xml格式接收加载的数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        static DATAFORMAT_XML: string;
        /**
        * @language zh_CN
        * 加载的地址
        * @version Egret 3.0
        * @platform Web,Native
        */
        url: string;
        /**
        * @language zh_CN
        * 控制以哪种方式接收加载的数据.
        * 如果未赋值则通过加载文件的后缀名来判断加载的类型以解析.
        * 如果未赋值且加载的类型并非为内置支持的文件类型.将以文本格式进行加载
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected _dataformat: string;
        /**
        * @language zh_CN
        * 加载完成后的数据。</p>
        * 加载完成之后对应的数据类型。</p>
        * *.text|*.txt|*.xml|*.json 文本类型          ----- <string>转换 </p>
        * *MapConfig.json 加载的 由unity3d插件导出文件 ----- <Object3D>  根据导出类型 Scene3D Role EffectGroup </p>
        * *.png|*.jpg                                 ----- <ImageTexture>转换 </p>
        * *.dds|*.hdr|*.tga                           ----- <Texture>转换 </p>
        * *.esm                                       ----- <Geometry>转换 </p>
        * *.eam                                       ----- <SkeletonAnimationClip>转换 </p>
        * *.epa                                       ----- <PropertyAnim>转换 </p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        data: any;
        /**
        * @language zh_CN
        * 任务总数
        * @version Egret 3.0
        * @platform Web,Native
        */
        taskTotal: number;
        /**
        * @language zh_CN
        * 当前完成的任务个数
        * @version Egret 3.0
        * @platform Web,Native
        */
        taskCurrent: number;
        /**
        * @language zh_CN
        * 当前进度
        * @version Egret 3.0
        * @platform Web,Native
        */
        currentProgress: number;
        /**
        * @language zh_CN
        * @private
        * 附带参数
        * @version Egret 3.0
        * @platform Web,Native
        */
        param: any;
        /**
         * @language zh_CN
         * 控制以哪种方式接收加载的数据.
         * 如果未赋值则通过加载文件的后缀名来判断加载的类型以解析.
         * 如果未赋值且加载的类型并非为内置支持的文件类型.将以文本格式进行加载
         * @returns string
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 控制以哪种方式接收加载的数据.
         * 如果未赋值则通过加载文件的后缀名来判断加载的类型以解析.
         * 如果未赋值且加载的类型并非为内置支持的文件类型.将以文本格式进行加载
         * @param value
         * @version Egret 3.0
         * @platform Web,Native
         */
        dataformat: string;
        /**
        * @language zh_CN
        * 当前加载资源的名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        resourceName: string;
        /**
        * @language zh_CN
        * 构造
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
        protected processFileFormat(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.URLLoader
    * @classdesc
    * URLLoader类
    * 用于加载和解析各类3d资源.  加载完成后数据存在 data 中
    * DDS, TGA, jpg, png, hdr等格式的贴图文件. 加载完成后返回 ITexture对象
    * ESM, EAM, ECA, EPA 等egret3d独有的模型文件,动作文件,相机动画文件, 属性动画文件
    * ESM: Geometry
    * EAM: SkeletonAnimationClip
    * EPA: PropertyAnim
    * @see egret3d.ILoader
    * @see egret3d.LoaderEvent3D
    *
    * @includeExample loader/URLLoader.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class URLLoader extends ILoader {
        private _xhr;
        private _event;
        private _progressEvent;
        private progress;
        private readystatechange;
        private error;
        /**
         * @language zh_CN
         * 构造函数
         * @param url 加载数据的地址.如果参数不为空的话.将直接开始加载
         * @param dataformat 以什么方式进行加载.如果为空的话.将通过目标文件的后缀名判断,
         * 如果为空且文件后缀不为内置支持的集中文件类型的话.将以文本格式进行加载解析
         * @version Egret 3.0
         * @platform Web,Native
         */
        constructor(url?: string, dataformat?: string);
        /**
         * @language en_US
         */
        /**
         * @language zh_CN
         * 加载目标地址的数据
         * @param url 数据地址
         * @param dataformat 以什么方式进行加载.如果为空的话.将通过目标文件的后缀名判断,
         * 如果为空且文件后缀不为内置支持的集中文件类型的话.将以文本格式进行加载解析
         * @version Egret 3.0
         * @platform Web,Native
         */
        load(url: string, dataformat?: string): void;
        /**
        * @language zh_CN
        * 加载的地址的上级目录，为了方便获取资源
        * @version Egret 3.0
        * @platform Web,Native
        */
        parentUrl: string;
        /**
        * @language zh_CN
        * 加载load 的临时资源，用户可自行配置的容器，大方便好用
        * @version Egret 3.0
        * @platform Web,Native
        */
        tempData: any;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        unitNodeData: UnitNodeData;
        /**
        * @language zh_CN
        * 已经获取到的字节数
        * @version Egret 3.0
        * @platform Web,Native
        */
        bytesLoaded: number;
        /**
        * @language zh_CN
        * 需要获取的总字节数
        * @version Egret 3.0
        * @platform Web,Native
        */
        bytesTotal: number;
        private onReadyStateChange(event);
        private loadComplete();
        private onProgress(event);
        private onError(event);
        private getXHR();
        protected onLoad(img: HTMLImageElement): void;
        protected checkTexture(texture: ITexture): void;
        protected doLoadComplete(): void;
        private disposeXhrEventListener();
        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.BinaryLoader
    * @classdesc
    * @see egret3d.ILoader
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class BinaryLoader extends ILoader {
        private _event;
        constructor(url?: string);
        load(url: string): void;
        protected loadComplete(): void;
        protected onLoad(img: HTMLImageElement): void;
        protected checkTexture(texture: ITexture): void;
        protected doLoadComplete(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.AssetManager
    * @classdesc
    * 资源加载统一管理类
    * @see egret3d.URLLoader
    * @version Egret 3.0
    * @platform Web,Native
    */
    class AssetManager {
        private _loaderDict;
        private _queueLoader;
        private _currentLoader;
        private _loaderEvent;
        private _binaryDict;
        private _binaryUrlDict;
        /**
        * @language zh_CN
        * 加载资源接口
        * @param url 资源路径
        * @param callback 加载完成后的回调
        * @param thisObject 回调函数的this对象
        * @param param 附带参数
        * @returns URLLoader 反回当前加载的URLLoader对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        loadAsset(url: string, callback: Function, thisObject: any, param?: any): URLLoader;
        /**
        * @language zh_CN
        * 加载资源接口 并监听事件接口
        * @param url 资源路径
        * @param type 事件类型
        * @param callback 加载完成后的回调
        * @param thisObject 回调函数的this对象
        * @param param 附带参数
        * @returns URLLoader 反回当前加载的URLLoader对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addEventListener(url: string, type: string, callback: Function, thisObject: any, param?: any): URLLoader;
        /**
        * @language zh_CN
        * 查找资源数据
        * @param url 资源路径
        * @param thisObject 资源引用对象 默认为null
        * @returns URLLoader  加载对象
        * @see egret3d.URLLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        findAsset(url: string, thisObject?: any): URLLoader;
        /**
        * @language zh_CN
        * 释放资源引用 没有引用的资源将会被进行释放
        * @param object 对象使用的资源的引用进行释放
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(object: any): void;
        protected onComplete(e: LoaderEvent3D): void;
        addByteArray(url: string, byte: ByteArray, parentUrl: string): void;
        removeByteArray(parentUrl: string): void;
        getByteArray(url: string): ByteArray;
    }
    /**
    * @private
    * @language zh_CN
    * 资源管理对象 内部资源管理直接使用此对象
    * @version Egret 3.0
    * @platform Web,Native
    */
    var assetMgr: AssetManager;
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.gui.TextureResourceManager
    * @classdesc
    * gui贴图资源加载管理器,</p>
    * 用于加载由TexturePacker生成的贴图资源</p>
    * @version Egret 3.0
    * @platform Web,Native
    */
    class TextureResourceManager extends egret3d.EventDispatcher {
        private _textureDic;
        private _count;
        private _totalCount;
        private _loadedCount;
        private _guiStage;
        private _urlTextureDic;
        private _bigTextureDic;
        constructor();
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        guiStage: QuadStage;
        private resetCount();
        /**
       * @language zh_CN
       * 获取当前总的加载数量
       * @version Egret 3.0
       * @platform Web,Native
       */
        totalCount: number;
        /**
     * @language zh_CN
     * 获取当前已加载完成的数量
     * @version Egret 3.0
     * @platform Web,Native
     */
        loadedCount: number;
        /**
         * @private
        * @language zh_CN
        * 加载由texturePack生成的资源文件.</p>
        * 连续调用时. 将会队列加载文件.
        * 全部加载完成时会抛出LoaderEvent3D.LOADER_COMPLETE事件.
        * 单个加载完成会抛出LoaderEvent3D.LOADER_PROGRESS事件
        * @param jsonUrl 由TexturePack生成的json配置文件
        * @param bitmapUrl 由TexturePack生成的png图片文件
        * @param gui view3d中的quadStage对象.一般不用传, 在调用View3d.openGUI时就已经初始化了.
        * @version Egret 3.0
        * @platform Web,Native
        */
        private loadTexture(jsonUrl, bitmapUrl);
        /**
         *
         * @private
         * @returns {}
         */
        getTextureDic(): Object;
        /**
               * @language zh_CN
               * 获取贴图
               * @param name 贴图名,由json中的名字获得
               *
               * @version Egret 3.0
               * @platform Web,Native
               */
        getTexture(name: string): Texture;
        addTexture(url: string, json: any, texture: ITexture): void;
        removeTexture(url: string): void;
    }
    var textureResMgr: TextureResourceManager;
}
declare module egret3d {
    /**
     * @private
     * dds / st3c compressed texture formats
     */
    enum DDSFormat {
        RGB_S3TC_DXT1_FORMAT = 2001,
        RGBA_S3TC_DXT1_FORMAT = 2002,
        RGBA_S3TC_DXT3_FORMAT = 2003,
        RGBA_S3TC_DXT5_FORMAT = 2003,
    }
    /**
     * @private
     * @language zh_CN
     * @class egret3d.DDSParser
     * @classdesc
     * 用 DDSParser 类 解析.dds 文件
     */
    class DDSParser {
        /**
        * @language zh_CN
        * constructor
        */
        constructor();
        /**
         * @language zh_CN
         * @param buffer 二进制
         * @param loadMipmaps 是否加载mipmaps
         * @returns DDSTexture
         */
        static parse(buffer: ArrayBuffer, loadMipmaps?: boolean): Texture;
        private static loadARGBMip(buffer, dataOffset, width, height);
        private static fourCCToInt32(value);
        private static int32ToFourCC(value);
        private static softSolutionDXT(width, height, format, byteArray);
    }
}
declare module egret3d {
    /**
    * @private
    */
    enum PVRFormat {
        RGB_PVRTC_4BPPV1_Format = 2100,
        RGB_PVRTC_2BPPV1_Format = 2101,
        RGBA_PVRTC_4BPPV1_Format = 2102,
        RGBA_PVRTC_2BPPV1_Format = 2103,
    }
    /**
     * @private
     * @language zh_CN
     * @class egret3d.PVRParser
     * @classdesc
     * �� PVRParser �� ����.pvr �ļ�
     */
    class PVRParser {
        constructor();
        /**
         * @language zh_CN
         * @param buffer
         */
        static parse(buffer: ArrayBuffer): Texture;
        private static _parseV2(pvrDatas);
        private static _parseV3(pvrDatas);
        private static _extract(pvrDatas);
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.TGAParser
     * @classdesc
     * 用 TGAParser 类 解析.tga 文件
     */
    class TGAParser {
        /**
        * @language zh_CN
        * constructor
        */
        constructor();
        /**
         * @language zh_CN
         * @param buffer 二进制流
         * @returns MimapTexture
         */
        static parse(buffer: ArrayBuffer): Texture;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class HDRParser {
        private static radiancePattern;
        private static commentPattern;
        private static gammaPattern;
        private static exposurePattern;
        private static formatPattern;
        private static widthHeightPattern;
        private static ldexp(mantissa, exponent);
        private static readPixelsRawRLE(buffer, data, offset, fileOffset, scanline_width, num_scanlines);
        static parse(buffer: any): Texture;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.EAMParser
     * @classdesc
     * 用 EAMParser 类 解析.eam 文件
     */
    class EAMParser {
        /**
         * @language zh_CN
         * @param datas 加载的二进制流
         * @returns SkeletonAnimationClip
         */
        static parse(datas: ArrayBuffer): SkeletonAnimationClip;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.EAMVersion
     * @classdesc
     *
     */
    class EAMVersion {
        static versionDictionary: any;
        static findNameIndex(nameArray: string[], name: string): number;
        static parserVersion_1(bytes: ByteArray): SkeletonAnimationClip;
        static parserVersion_2(bytes: ByteArray): SkeletonAnimationClip;
        static parserVersion_3(bytes: ByteArray): SkeletonAnimationClip;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.ECAParser
     * @classdesc
     * 用 EAMParser 类 解析.eca 文件
     */
    class ECAParser {
        /**
         * @language zh_CN
         * @param datas 加载的二进制流
         * @returns CameraAnimationController
         */
        static parse(datas: ArrayBuffer): CameraAnimationController;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.ECAVersion
     * @classdesc
     */
    class ECAVersion {
        static versionDictionary: any;
        static parserVersion_1(bytes: ByteArray): CameraAnimationController;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.ESMParser
     * @classdesc
     * 用 ESMParser 类 解析.esm 文件
     */
    class ESMParser {
        /**
          * @language zh_CN
          * 从二进制流中解析出模型Geometry信息
          * @param datas 加载的二进制流
          * @returns Geometry
          */
        static parse(datas: ArrayBuffer, param?: any): Geometry;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.ESMVersion
     * @classdesc
     *
     */
    class ESMVersion {
        static versionDictionary: any;
        static parserVersion_1(bytes: ByteArray, geomtry: GeometryData, param: any): void;
        static parserVersion_2(bytes: ByteArray, geomtry: GeometryData, param: any): void;
        static parserVersion_3(bytes: ByteArray, geomtry: GeometryData, param: any): void;
        static parserVersion_4(bytes: ByteArray, geomtry: GeometryData, param: any): void;
        static parserVersion_5(bytes: ByteArray, geomtry: GeometryData, param: any): void;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.ERMParser
     * @classdesc
     * 用 EPMParser 类 解析.erm 文件
     */
    class E3dPackParser {
        /**
         * @language zh_CN
         * @param datas 加载的二进制流
         * @returns PropertyAnim
         */
        static parse(datas: ArrayBuffer, url: string): {
            [key: string]: ByteArray;
        };
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.ERMVersion
     * @classdesc
     */
    class E3dPackVersion {
        static versionDictionary: any;
        static parserVersion_1(bytes: ByteArray, url: string): {
            [key: string]: ByteArray;
        };
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.EPAParser
     * @classdesc
     * 用 EPMParser 类 解析.epa 文件
     */
    class EPAParser {
        /**
         * @language zh_CN
         * @param datas 加载的二进制流
         * @returns PropertyAnim
         */
        static parse(datas: ArrayBuffer): PropertyAnim;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.EPAVersion
     * @classdesc
     */
    class EPAVersion {
        static versionDictionary: any;
        static VALUE_TYPE_UINT: number;
        static parserVersion_1(bytes: ByteArray): PropertyAnim;
        static parserVersion_2(bytes: ByteArray): PropertyAnim;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.EUMParser
     * @classdesc
     * 用 EUMParser 类 解析.eum 文件
     */
    class EUMParser {
        /**
         * @language zh_CN
         * @param datas 加载的二进制流
         * @returns { [key: number]: ByteArray }
         */
        static parse(datas: ArrayBuffer): {
            [key: number]: ByteArray;
        };
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.EUMVersion
     * @classdesc
     */
    class EUMVersion {
        static versionDictionary: any;
        static versionValue: number;
        private static parserVersion_1(bytes);
        private static parserVersion_2(bytes);
        static fillGeometryUv2(id: number, uv2Dict: {
            [key: number]: ByteArray;
        }, geo: Geometry): void;
        private static fillGeometryUv2_1(id, uv2Dict, geo);
        private static fillGeometryUv2_2(id, uv2Dict, geo);
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.XMLParser
    * @classdesc
    * 解析XML文件格式
    * @version Egret 3.0
    * @platform Web,Native
    */
    class XMLParser {
        /**
        * @language zh_CN
        *
        * @param xml xml文件
        * @returns any
        */
        static parse(xml: string): any;
        /**
        * @private
        * @language zh_CN
        * 解析node节点的属性值
        * @version Egret 3.0
        * @platform Web,Native
        */
        static eachXmlAttr(item: Node, fun: Function): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitParserUtils {
        static parserType(data: any, type: string): string;
        static parserConfig(dataConfig: any, type: string): IConfigParser;
        static mapParser(type: string, data: any, mapConfigParser: UnitConfigParser): void;
        static particleParser(type: string, text: string): ParticleData;
        static jsonVersion(version: number, data: any, mapConfigParser: UnitConfigParser): UnitJsonParser;
        static xmlVersion(version: number, data: any, mapConfigParser: UnitConfigParser): UnitXmlParser;
        static binVersion(version: number, data: any, mapConfigParser: UnitConfigParser): UnitBinParser;
    }
}
declare module egret3d {
    class MethodUtils {
        static doMethod(material: MaterialBase, method: UnitMatMethodData, loader: UnitLoader): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitParser {
        protected _mapConfigParser: UnitConfigParser;
        protected _data: any;
        protected _versionParser: UnitParser;
        constructor(data: any, mapConfigParser: UnitConfigParser);
        parser(): void;
        parseTexture(node: any): void;
        parseMethod(node: any): UnitMatMethodData[];
        parseMat(node: any): UnitMatSphereData;
        parseNode(node: any): UnitNodeData;
        parseEnvironment(environment: any): void;
        parseHud(node: any): UnitHUDData;
        parseLight(node: any): UnitLightData;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitBinParser extends UnitParser {
        constructor(data: any, mapConfigParser: UnitConfigParser);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitJsonParser extends UnitParser {
        constructor(data: any, mapConfigParser: UnitConfigParser);
        parser(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitJsonParser_1 extends UnitJsonParser {
        parseMethod(node: any): UnitMatMethodData[];
        parseMat(node: any): UnitMatSphereData;
        parseNode(node: any): UnitNodeData;
        parseEnvironment(environment: any): void;
        parseHud(node: any): UnitHUDData;
        parseTexture(node: any): void;
        parseLight(node: any): UnitLightData;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitXmlParser extends UnitParser {
        constructor(data: any, mapConfigParser: UnitConfigParser);
        parser(): void;
        protected nodeFilter(node: Node): boolean;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitXmlParser_1 extends UnitXmlParser {
        parseTexture(node: Node): any;
        parseMethod(node: Node): UnitMatMethodData[];
        parseMat(node: Node): UnitMatSphereData;
        parseNode(node: Node): UnitNodeData;
        parseEnvironment(environment: NodeList): void;
        parseHud(node: Node): UnitHUDData;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.UnitLoader
    * @classdesc
    * 单个资源 加载器</p>
    * 主要封装了esm/jpg/png/eam/epa/uinty3d导出的配置文件/的加载和组装</p>
    * 以及mesh的render method相关信息，和灯光数据的生效.</p>
    * 加载完毕后，会派发事件</p>
    * 1.LoaderEvent3D.LOADER_COMPLETE 加载完成后事件响应</p>
    * 1.LoaderEvent3D.LOADER_PROGRESS 加载过程中事件响应</p>
    *
    * @see egret3d.ILoader
    * @see egret3d.LoaderEvent3D
    *
    * @includeExample loader/UnitLoader.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitLoader extends ILoader {
        /**
        * @language zh_CN
        * Object3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        static NODE_TYPE_Object3D: string;
        /**
        * @language zh_CN
        * Camera3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        static NODE_TYPE_Camera3D: string;
        /**
        * @language zh_CN
        * @private
        * CubeSky
        * @version Egret 3.0
        * @platform Web,Native
        */
        static NODE_TYPE_CubeSky: string;
        /**
        * @language zh_CN
        * @private
        * SphereSky
        * @version Egret 3.0
        * @platform Web,Native
        */
        static NODE_TYPE_SphereSky: string;
        /**
        * @language zh_CN
        * Mesh
        * @version Egret 3.0
        * @platform Web,Native
        */
        static NODE_TYPE_MESH: string;
        /**
        * @language zh_CN
        * Terrain
        * @version Egret 3.0
        * @platform Web,Native
        */
        static NODE_TYPE_Terrain: string;
        /**
        * @language zh_CN
        * ParticleEmitter
        * @version Egret 3.0
        * @platform Web,Native
        */
        static NODE_TYPE_ParticleEmitter: string;
        /**
        * @language zh_CN
        * EffectGroup
        * @version Egret 3.0
        * @platform Web,Native
        */
        static NODE_TYPE_EffectGroup: string;
        /**
        * @language zh_CN
        * 场景对象的所有根节点.
        * 如果是配置文件，加载完后将后有值
        * @version Egret 3.0
        * @platform Web,Native
        */
        container: Object3D;
        /**
        * @private
        * @language zh_CN
        * 加载资源的URLLoader对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        loader: URLLoader;
        /**
        * @language zh_CN
        * 是否自动播放动画  默认不自动播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        autoPlayAnimation: boolean;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        configParser: IConfigParser;
        /**
        * @language zh_CN
        * 获取根目录
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置根目录
        * @version Egret 3.0
        * @platform Web,Native
        */
        pathRoot: string;
        private _pathRoot;
        private _configParser;
        private _mapParser;
        private _particleParser;
        private _texturePackerParser;
        private _taskCount;
        private _event;
        private _type;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        view3d: View3D;
        private _taskDict;
        private _textures;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        skinClipDict: any;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        proAnimDict: any;
        protected unitLoaderList: UnitLoader[];
        protected _dictUnitLoader: {
            [url: string]: {
                pathRoot: string;
                loader: UnitLoader;
            };
        };
        protected _unitQueue: string[];
        protected _currentUnitLoader: UnitLoader;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        huds: HUD[];
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        lightDict: any;
        protected texturePackerUrl: string;
        protected autoAnimationList: any[];
        protected continueProgressEvent: string[];
        addAutoAnimation(animation: any, speed?: number, reset?: boolean, prewarm?: boolean, name?: string): void;
        /**
        * @language zh_CN
        * uv2 数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected uv2Dict: {
            [key: number]: ByteArray;
        };
        /**
        * @language zh_CN
        * 加载配置文件 .json 或 .xml,
        * 如果是配置文件 暂时只能支持.json (Unity3d 中的egret3d插件可以直接导出)
        * @param url 默认参数为null  文件路径
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(url?: string);
        /**
        * @language zh_CN
        * 获取每个资源的URLLoader对象
        * 如果获取的是配置文件会返回配置文件的源数据，而不是解释后的数据
        * @param url 文件路径
        * @returns URLLoader  URLLoader对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        getAssetURLLoader(url: string): URLLoader;
        protected createObject(): Object3D;
        /**
        * @language zh_CN
        * 查找贴图
        * @param name 贴图名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        findTexture(name: string): ITexture;
        /**
        * @language zh_CN
        * 加载文件
        * @param url 文件路径
        * @version Egret 3.0
        * @platform Web,Native
        */
        load(url: string): void;
        protected onE3dPack(e: LoaderEvent3D): void;
        protected processUrlContinue(url: string): void;
        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
        protected onProgress(e: LoaderEvent3D): void;
        private reset();
        private parseParticle();
        private parseUnit();
        protected onCompleteUv2(e: LoaderEvent3D): void;
        protected onProcessNodeLoad(): void;
        private parseTexturePacker();
        private onTexturePackerLoad(e);
        private parseConfig(dataConfig, type);
        private processParticle(particleData, nodeData);
        private processParticleGeometry(particleData, nodeData);
        private processObject3d(nodeData, object3d);
        private onConfigLoad(e);
        private onHeightImg(e);
        private doAssetLoader(url, callback, param?);
        private doUnitLoader(url, callback, param?);
        private onUnitComplete(e);
        private onTexture(e);
        private onHudTexture(e);
        private onMaterialTexture(e);
        private onMethodTexture(e);
        protected onGrassDetailTexture(e: LoaderEvent3D): void;
        private getGrassPositions(terrain, texture);
        protected onGrassDiffuseTexture(e: LoaderEvent3D): void;
        private doLoadEpa(mapNodeData);
        private processEpa(mapNodeData, pro);
        private processHeightMesh(mapNodeData, mesh);
        private processMesh(mapNodeData, geometry);
        private onEsmLoad(e);
        private onParticleEsmLoad(e);
        private onParticleEsmLoad1(e);
        private onEamLoad(e);
        private onSkinClip(e);
        private onProAnim(e);
        private onEpaLoad(e);
        private addTask();
        protected calculateProgress(): number;
        private processTaskCurrent(load);
        private processTask(load);
        protected onLoaderComplete(): void;
        private addImaTask(name, type, matID, mapNodeData, material);
        addMethodImgTask(name: string, method: MethodBase, textureName: string): URLLoader;
        private processMat(mapNodeData);
        private processMethod(material, matData);
        protected processNode(): void;
        private processSkinClip();
        private processProAnim();
        private createLight();
        protected onUnitLoader(e: LoaderEvent3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.UnitNodeData
    * @classdesc
    * 节点数据
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitNodeData {
        type: string;
        insID: number;
        parent: number;
        name: string;
        staticType: string;
        path: string;
        fov: number;
        clipNear: number;
        clipFar: number;
        tagName: string;
        /**
         * @language zh_CN
         * 对应的材质球id
         * @version Egret 3.0
         * @platform Web,Native
         */
        materialIDs: Array<any>;
        /**
         * @language zh_CN
         * 拥有的动画剪辑名的列表
         * @version Egret 3.0
         * @platform Web,Native
         */
        skinClips: Array<any>;
        /**
         * @language zh_CN
         * 拥有的动画剪辑名的列表
         * @version Egret 3.0
         * @platform Web,Native
         */
        propertyAnims: Array<any>;
        /**
         * @language zh_CN
         * 是否启用公告板模式
         * @version Egret 3.0
         * @platform Web,Native
         */
        billboard: boolean;
        visible: boolean;
        /**
         * @language zh_CN
         * 坐标x
         * @version Egret 3.0
         * @platform Web,Native
         */
        x: number;
        /**
         * @language zh_CN
         * 坐标y
         * @version Egret 3.0
         * @platform Web,Native
         */
        y: number;
        /**
         * @language zh_CN
         * 坐标z
         * @version Egret 3.0
         * @platform Web,Native
         */
        z: number;
        /**
         * @language zh_CN
         * 旋转x分量
         * @version Egret 3.0
         * @platform Web,Native
         */
        rx: number;
        /**
         * @language zh_CN
         * 旋转y分量
         * @version Egret 3.0
         * @platform Web,Native
         */
        ry: number;
        /**
         * @language zh_CN
         * 旋转z分量
         * @version Egret 3.0
         * @platform Web,Native
         */
        rz: number;
        /**
         * @language zh_CN
         * 旋转w分量
         * @version Egret 3.0
         * @platform Web,Native
         */
        rw: number;
        /**
         * @language zh_CN
         * x轴缩放
         * @version Egret 3.0
         * @platform Web,Native
         */
        sx: number;
        /**
         * @language zh_CN
         * y轴缩放
         * @version Egret 3.0
         * @platform Web,Native
         */
        sy: number;
        /**
         * @language zh_CN
         * z轴缩放
         * @version Egret 3.0
         * @platform Web,Native
         */
        sz: number;
        skeletonAnimation: number;
        propertyAnimsId: number;
        geometry: any;
        grass: any;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        object3d: Object3D;
        childs: Array<any>;
        boneBind: any;
        lightData: UnitLightData;
        lightIds: any[];
        auto: boolean;
        loop: boolean;
        uv2Id: number;
    }
}
declare module egret3d {
    class IConfigParser {
        static TYPE_SCENE: string;
        static TYPE_SKIN_MESH: string;
        static TYPE_EFFECT_GROUP: string;
        static TYPE_PARTICLE: string;
        static TYPE_TEXTUREPACKER: string;
        /**
        * @language zh_CN
        * 引擎的版本号
        * @version Egret 3.0
        * @platform Web,Native
        */
        engineVersion: string;
        /**
        * @language zh_CN
        * 文件的版本号
        * @version Egret 3.0
        * @platform Web,Native
        */
        version: number;
        /**
        * @language zh_CN
        * 文件类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: string;
        /**
        * @language zh_CN
        * 资源列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        taskDict: any;
        constructor(type: string);
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitConfigParser extends IConfigParser {
        /**
         * @language zh_CN
         * 节点列表
         * @version Egret 3.0
         * @platform Web,Native
         */
        nodeList: Array<UnitNodeData>;
        hudList: Array<UnitHUDData>;
        auto: boolean;
        loop: boolean;
        matDict: any;
        lightDict: any;
        skeletonAnimationDict: any;
        proAnimationDict: any;
        directLight: boolean;
        pointLight: boolean;
        isFogOpen: boolean;
        fogColor: number;
        fogMode: string;
        fogDensity: number;
        linearFogStart: number;
        linearFogEnd: number;
        textures: any;
        uv2: string;
        constructor(data: any, type: string, fileType: string);
        calculateTask(): void;
        calculateProAnimationTask(data: any): void;
        calculateSkeletonAnimationTask(data: any): void;
        calculateMatTask(data: UnitMatSphereData): void;
        calculateNodeTask(data: UnitNodeData): void;
        calculateHudTask(data: UnitHUDData): void;
        calculateTextureTask(data: any): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.MaterialMethodData
    * @classdesc
    * 材质球的特效数据
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitMatMethodData {
        static methodType: any;
        /**
         * @language zh_CN
         * 特效的类型
         * @version Egret 3.0
         * @platform Web,Native
         */
        type: string;
        /**
         * @language zh_CN
         * 是否增强specular的强度
         * @version Egret 3.0
         * @platform Web,Native
         */
        usePower: boolean;
        /**
         * @language zh_CN
         * 贴图索引数据（name）
         * @version Egret 3.0
         * @platform Web,Native
         */
        texturesData: any;
        /**
         * @language zh_CN
         * u的滚动速度
         * @version Egret 3.0
         * @platform Web,Native
         */
        uSpeed: number;
        /**
         * @language zh_CN
         * v的滚动速度
         * @version Egret 3.0
         * @platform Web,Native
         */
        vSpeed: number;
        play: boolean;
        loop: boolean;
        frameNum: number;
        row: number;
        col: number;
        delayTime: number;
        totalTime: number;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.UnitMatSphereData
    * @classdesc
    * 材质球的特效数据
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitMatSphereData {
        /**
         * @language zh_CN
         * diffuse贴图的索引（name）
         * @version Egret 3.0
         * @platform Web,Native
         */
        id: number;
        /**
         * @language zh_CN
         * diffuse贴图的索引（name）
         * @version Egret 3.0
         * @platform Web,Native
         */
        diffuseTextureName: string;
        /**
         * @language zh_CN
         * normal贴图的索引（name）
         * @version Egret 3.0
         * @platform Web,Native
         */
        normalTextureName: string;
        /**
         * @language zh_CN
         * specular贴图的索引（name）
         * @version Egret 3.0
         * @platform Web,Native
         */
        specularTextureName: string;
        /**
        * @language zh_CN
        * matcap贴图的索引（name）
        * @version Egret 3.0
        * @platform Web,Native
        */
        matcapTextureName: string;
        /**
         * @language zh_CN
         * diffuse的颜色，0xffffff格式
         * @version Egret 3.0
         * @platform Web,Native
         */
        diffuseColor: number;
        /**
         * @language zh_CN
         * ambient的颜色，0xffffff格式
         * @version Egret 3.0
         * @platform Web,Native
         */
        ambientColor: number;
        /**
         * @language zh_CN
         * specular的颜色，0xffffff格式
         * @version Egret 3.0
         * @platform Web,Native
         */
        specularColor: number;
        /**
         * @language zh_CN
         * tintColor的颜色，0xaarrggbb格式
         * @version Egret 3.0
         * @platform Web,Native
         */
        tintColor: number;
        /**
         * @language zh_CN
         * 透明度
         * @version Egret 3.0
         * @platform Web,Native
         */
        alpha: number;
        /**
         * @language zh_CN
         * specular增强等级
         * @version Egret 3.0
         * @platform Web,Native
         */
        specularLevel: number;
        /**
         * @language zh_CN
         * 光泽系数
         * @version Egret 3.0
         * @platform Web,Native
         */
        gloss: number;
        gamma: number;
        refraction: number;
        refractionintensity: number;
        /**
         * @language zh_CN
         * ambient的强度
         * @version Egret 3.0
         * @platform Web,Native
         */
        ambientPower: number;
        /**
         * @language zh_CN
         * diffuse的强度
         * @version Egret 3.0
         * @platform Web,Native
         */
        diffusePower: number;
        /**
         * @language zh_CN
         * normal的强度
         * @version Egret 3.0
         * @platform Web,Native
         */
        normalPower: number;
        /**
         * @language zh_CN
         * 是否产生阴影
         * @version Egret 3.0
         * @platform Web,Native
         */
        castShadow: boolean;
        /**
         * @language zh_CN
         * 是否接受阴影
         * @version Egret 3.0
         * @platform Web,Native
         */
        acceptShadow: boolean;
        /**
         * @language zh_CN
         * 是否平滑采样贴图
         * @version Egret 3.0
         * @platform Web,Native
         */
        smooth: boolean;
        /**
         * @language zh_CN
         * 采样贴图的边缘是否重复
         * @version Egret 3.0
         * @platform Web,Native
         */
        repeat: boolean;
        /**
         * @language zh_CN
         * 是否开启双面渲染
         * @version Egret 3.0
         * @platform Web,Native
         */
        bothside: boolean;
        /**
         * @language zh_CN
         * 绘制模式设定
         * @version Egret 3.0
         * @platform Web,Native
         */
        drawMode: number;
        /**
         * @language zh_CN
         * 剔除模式设定
         * @version Egret 3.0
         * @platform Web,Native
         */
        cullMode: number;
        /**
         * @language zh_CN
         * 叠加模式
         * @version Egret 3.0
         * @platform Web,Native
         */
        blendMode: number;
        /**
         * @language zh_CN
         * alpha裁切值
         * @version Egret 3.0
         * @platform Web,Native
         */
        cutAlpha: number;
        /**
         * @language zh_CN
         * 材质球拥有的特效
         * @version Egret 3.0
         * @platform Web,Native
         */
        methods: UnitMatMethodData[];
        lightIds: Array<number>;
        /**
         * @language zh_CN
         * 材质球uv区域
         * @version Egret 3.0
         * @platform Web,Native
         */
        uvRectangle: Rectangle;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.UnitLightData
    * @classdesc
    * 顶光数据
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UnitLightData {
        id: number;
        /**
         * @language zh_CN
         * 灯光类型
         * @version Egret 3.0
         * @platform Web,Native
         */
        type: number;
        /**
         * @language zh_CN
         * diffuseColor
         * @version Egret 3.0
         * @platform Web,Native
         */
        diffuseColor: number;
        /**
         * @language zh_CN
         * ambientColor
         * @version Egret 3.0
         * @platform Web,Native
         */
        ambientColor: number;
        /**
         * @language zh_CN
         * 强度
         * @version Egret 3.0
         * @platform Web,Native
         */
        intensity: number;
        /**
         * @language zh_CN
         * 强度的一半
         * @version Egret 3.0
         * @platform Web,Native
         */
        halfIntensity: number;
        direction: Vector3D;
        position: Vector3D;
        /**
         * @language zh_CN
         * 衰减值
         * @version Egret 3.0
         * @platform Web,Native
         */
        falloff: number;
        /**
         * @language zh_CN
         * 半径数据
         * @version Egret 3.0
         * @platform Web,Native
         */
        radius: number;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class UnitHUDData {
        name: string;
        texture: string;
        bothside: boolean;
        x: number;
        y: number;
        rx: number;
        ry: number;
        rz: number;
        width: number;
        height: number;
        hud: HUD;
        vs: string;
        fs: string;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.MapLoader
    * @classdesc
    * 注意：当前还能使用 但是之后版本会被弃用 会直接使用 UnitLoader 来替换这个类的功能
    * 加载egret地图类
    * 用于加载和解析egret地图文件的类，加载完毕后，mesh内容已经添加到了container中.
    * 主要封装了esm/eca/png/eam的加载和组装，以及mesh的render method相关信息，和灯光数据的生效.
    * 加载完毕后，会派发事件LoaderEvent3D.LOADER_COMPLETE
    * @see egret3d.UnitLoader
    *
    * @includeExample loader/parser/map/MapLoader.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class MapLoader extends UnitLoader {
        /**
        * @language zh_CN
        * 场景根节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        scene: Scene3D;
        /**
        * @language zh_CN
        * 加载场景配置文件 .json 或 .xml
        * @param url 默认参数为null  场景文件路径
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(url?: string);
        protected createObject(): Object3D;
        protected onLoaderComplete(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.Role
    * @classdesc
    * 角色对象多个Mesh可能共用这个SkeletonAnimation
    * @see egret3d.Object3D
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Role extends Object3D {
        /**
        * @language zh_CN
        * 骨骼动画对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        skeletonAnimation: SkeletonAnimation;
        /**
        * @language zh_CN
        * 骨骼动画 avatar
        * @version Egret 3.0
        * @platform Web,Native
        */
        avatar: {
            [name: string]: Mesh;
        };
        /**
        * @language zh_CN
        * 构造对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * @private
        * 设置 avatar
        * @param part
        * @param mesh
        * @version Egret 3.0
        * @platform Web,Native
        */
        setAvatar(part: string, mesh: Mesh): void;
        /**
        * @language zh_CN
        * @private
        * 删除 avatar
        * @param part
        * @version Egret 3.0
        * @platform Web,Native
        */
        delAvatar(part: string): void;
        play(anim: string, speed: number, reset: boolean): void;
        /**
        * @language zh_CN
        * @param child
        * @returns Object3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        addChild(child: Object3D): Object3D;
        /**
        * @language zh_CN
        * 增加一个子对象,并返回当前子对象
        * 在容器中添加子对象，如果有显示接口的，将会放到场景显示树种进行渲染逻辑运算，及渲染
        * @param child 增加的子对象
        * @param index 子对象的下标
        * @returns 子对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addChildAt(child: Object3D, index: number): Object3D;
        /**
        * @language zh_CN
        * 移除child子对象 并返回
        * 移除显示列表中的指定对象，如果为空将会返回
        * @param child 子对象
        * @returns Object3D 如果成功就返回child,否则返回null
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeChild(child: Object3D): Object3D;
        /**
        * @language zh_CN
        * 移除下标为index的子对象 并返回
        * @param index 子对象的下标
        * @returns 如果成功就返回child,否则返回null
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeChildAt(index: number): Object3D;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number): void;
        /**
        * @language zh_CN
        * @private
        * @param other copy对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copy(other: Role): void;
        /**
        * @language zh_CN
        * @private
        * 克隆当前Role
        * @returns Role 克隆后的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Role;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.RoleLoader
    * @classdesc
    * 加载角色
    * @see egret3d.UnitLoader
    * @version Egret 3.0
    * @platform Web,Native
    */
    class RoleLoader extends UnitLoader {
        /**
        * @language zh_CN
        * 角色根节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        role: Role;
        /**
        * @language zh_CN
        * 构造
        * @param url 角色文件路径
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(url?: string);
        protected createObject(): Object3D;
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.ParticleXmlParser
     * @classdesc
     * 用 ParticleXmlParser 解析粒子文件
     */
    class ParticleXmlParser {
        /**
         * @language zh_CN
         * 粒子的版本号
         * @version Egret 3.0
         * @platform Web,Native
         */
        version: string;
        private _particleData;
        /**
        * @language zh_CN
        * constructor
        */
        constructor();
        /**
         * @language zh_CN
         * @param xml 粒子特效的数据解析
         * @returns ParticleData
         */
        parse(xml: any, data: ParticleData): void;
        /**
         * @private
         * 解析基础属性
         */
        private parseProperty(node);
        /**
         * @private
         * 解析颜色属性
         */
        private parseColorProperty(property, c1, c2, cg1, cg2);
        /**
         * @private
         * 解析发射器数据
         */
        private parseEmission(node);
        /**
         * @private
         * 解析生命周期相关数据
         */
        private parseLife(node);
        /**
         * @private
         * 解析发射器的范围类型
         */
        private parseShape(node);
        /**
         * @private
         * 解析粒子出生的旋转信息
         */
        private parseRotationBirth(node);
        /**
         * @private
         * 解析粒子出生的缩放信息
         */
        private parseScaleBirth(node);
        /**
         * @private
         * 解析粒子的几何形状
         */
        private parseGeometry(node);
        /**
         * @private
         * 解析粒子速度相关信息
         */
        private parseMoveSpeed(node);
        /**
         * @private
         * 解析全局位置or本地位置类型
         */
        private parseFollowTarget(node);
        /**
         * @private
         * 解析粒子生命过程中缩放变化信息
         */
        private parseScaleBeizer(node);
        /**
        * @private
        * 解析粒子旋转角速度
        */
        private parseRotationSpeed(node);
        /**
        * @private
        * 解析粒子生命过程中颜色渐变信息
        */
        private parseColorOffset(node);
        /**
        * @private
        * 解析材质球
        */
        private parseTextureSheet(node);
        /**
        * @private
        * 解析渐变数据
        */
        private parseGradientsColor(itemList, dst);
        /**
        * @private
        * 解析一条贝塞尔曲线数据
        */
        private parseBezierData(node);
        /**
        * @private
        * 解析一个vector3D数据
        */
        private parseVector3D(node, vector);
        /**
        * @private
        * 在obj中，获取name的元素，第一个
        */
        private getNode(obj, name);
        /**
         * @private
         * 在obj中，获取name的元素列表
         */
        private getNodeList(obj, name);
        private eachAttr(item, fun);
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.ParticleJsonParser
     * @classdesc
     * 用 ParticleJsonParser 解析粒子文件
     */
    class ParticleJsonParser {
        /**
        * @language zh_CN
        * 引擎的版本号
        * @version Egret 3.0
        * @platform Web,Native
        */
        engineVersion: string;
        /**
         * @language zh_CN
         * 粒子的版本号
         * @version Egret 3.0
         * @platform Web,Native
         */
        version: string;
        private _particleData;
        /**
         * @language zh_CN
         * @param json 粒子特效的数据解析
         * @returns ParticleData
         */
        parse(json: any, data: ParticleData): void;
        /**
         * @private
         * 解析基础属性
         */
        private parseProperty(node);
        /**
         * @private
         * 解析颜色属性
         */
        private parseColorProperty(property, c1, c2, cg1, cg2);
        /**
         * @private
         * 解析发射器数据
         */
        private parseEmission(node);
        /**
         * @private
         * 解析生命周期相关数据
         */
        private parseLife(node);
        /**
         * @private
         * 解析发射器的范围类型
         */
        private parseShape(node);
        /**
         * @private
         * 解析粒子出生的旋转信息
         */
        private parseRotationBirth(node);
        /**
         * @private
         * 解析粒子出生的缩放信息
         */
        private parseScaleBirth(node);
        /**
         * @private
         * 解析粒子的几何形状
         */
        private parseGeometry(node);
        /**
         * @private
         * 解析粒子速度相关信息
         */
        private parseMoveSpeed(node);
        /**
         * @private
         * 解析全局位置or本地位置类型
         */
        private parseFollowTarget(node);
        /**
         * @private
         * 解析粒子生命过程中缩放变化信息(早期版本，只支持一个贝塞尔曲线形势)
         */
        private parseScaleBeizer(node);
        /**
         * @private
         * 解析粒子生命过程中缩放变化信息
         */
        private parseScaleSize(node);
        /**
        * @private
        * 解析粒子旋转角速度
        */
        private parseRotationSpeed(node);
        /**
        * @private
        * 解析粒子生命过程中颜色渐变信息
        */
        private parseColorOffset(node);
        /**
        * @private
        * 解析材质球
        */
        private parseTextureSheet(node);
        /**
        * @private
        * 解析渐变数据
        */
        private parseGradientsColor(itemList, dst);
        /**
        * @private
        * 解析一条贝塞尔曲线数据
        */
        private parseBezierData(node);
        /**
        * @private
        * 解析一条折线数据
        */
        private parseFoldLine(node);
        /**
        * @private
        * 解析一个vector3D数据
        */
        private parseVector3D(node, vector);
    }
}
declare module egret3d {
    /**
     * @private
     * @language zh_CN
     * @class egret3d.ParticleParser
     * @classdesc
     * 用 ParticleParser 解析粒子文件
     */
    class ParticleParser extends IConfigParser {
        constructor(data: any, type: string, fileType?: string);
        data: ParticleData;
        /**
         * @language zh_CN
         * @param xml 粒子特效的数据解析
         * @returns ParticleData
         */
        parseJson(text: any): ParticleData;
        parseXml(text: any): ParticleData;
    }
}
declare module egret3d {
    class TexturePackerParser extends IConfigParser {
        data: any;
        constructor(data: any, type: string, fileType: string);
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.ParserUtils
    * @classdesc
    * 用 ParserUtils 类 解析所有egret自定义 文件
    * @see egret3d.EventDispatcher
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParserUtils extends EventDispatcher {
        /**
        * @language zh_CN
        * 解析出的文件对象
        */
        datas: any;
        /**
        * @language zh_CN
        * 文件格式
        */
        dataFormat: string;
        private _event;
        /**
        * @language zh_CN
        * 传入数据流对象，解析出相应的数据对象.
        * 解析dds tga jpg png esm eam eca
        * @param buffer 需要解析的数据流
        * @returns 是否解析成功
        */
        parser(buffer: ArrayBuffer): boolean;
        protected onLoad(img: HTMLImageElement): void;
        protected doLoadComplete(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.QueueLoader
    * @classdesc
    * 队列加载器。</p>
    * 每个加载对象都是一个 UnitLoader。</p>
    * 可以进行多个资源形成队列加载。</p>
    * 可加载文件。</p>
    * *.text|*.txt|*.xml|*.json 文本类型          ----- <string>转换 </p>
    * * MapConfig.json 加载的 由unity3d插件导出文件 ----- <Object3D></p>
    * *.png|*.jpg                                 ----- <ImageTexture>转换 </p>
    * *.dds|*.hdr|*.tga                           ----- <Texture>转换 </p>
    * *.esm                                       ----- <Geometry>转换 </p>
    * *.eam                                       ----- <SkeletonAnimationClip>转换 </p>
    * *.epa                                       ----- <PropertyAnim>转换 </p>
    * 加载后会触发事件。</p>
    * @see egret3d.EventDispatcher
    * @see egret3d.UnitLoader
    * @see egret3d.ILoader
    * @see egret3d.LoaderEvent3D
    *
    * @includeExample loader/QueueLoader.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class QueueLoader extends EventDispatcher {
        protected dictLoader: any;
        protected currentLoader: UnitLoader;
        protected dictProgress: any;
        protected queueLoader: string[];
        protected _event: LoaderEvent3D;
        /**
        * @language zh_CN
        * 任务总数
        * @version Egret 3.0
        * @platform Web,Native
        */
        taskTotal: number;
        /**
        * @language zh_CN
        * 当前完成的任务个数
        * @version Egret 3.0
        * @platform Web,Native
        */
        taskCurrent: number;
        /**
        * @language zh_CN
        * 当前进度
        * @version Egret 3.0
        * @platform Web,Native
        */
        currentProgress: number;
        protected lastProgress: number;
        /**
        * @language zh_CN
        * 加载文件  可以为任意文件
        * @param url 默认参数为null  文件路径
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(url?: string);
        /**
        * @language zh_CN
        * 加载文件
        * 多次调用 代表加载多个资源文件
        * @param url 文件路径
        * @returns UnitLoader
        * @version Egret 3.0
        * @platform Web,Native
        */
        load(url: string): UnitLoader;
        /**
        * @language zh_CN
        * @private
        * 对某个文件进行事件侦听
        * @param url {string} 文件路径。
        * @param type {string} 事件的类型标识符。
        * @param callback {Function} 处理事件的侦听器函数。此函数必须接受 Event3D 对象作为其唯一的参数，并且不能返回任何结果，
        * @param thisObject {any} 当前注册对象。
        * @param param {any} 事件携带参数，默认为空。
        * @param priority {number} 事件侦听器的优先级。
        * @returns {number} 注册事件位置标识id
        * @version Egret 3.0
        * @platform Web,Native
        */
        addAssetEventListener(url: string, type: string, callback: Function, thisObject: any, param?: any, priority?: number): number;
        /**
        * @language zh_CN
        * @private
        * 对文件进行移除事件侦听器。
        * @param url {string} 文件路径。
        * @param type {string} 事件名。
        * @param callback {Function} 侦听函数。
        * @param thisObject {any} 当前注册对象。
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeAssetEventListener(url: string, type: string, callback: Function, thisObject: any, param?: any, priority?: number): void;
        /**
        * @language zh_CN
        * 获取资源数据</p>
        * *.text|*.txt|*.xml|*.json 文本类型          ----- <string>转换 </p>
        * *MapConfig.json 加载的 由unity3d插件导出文件 ----- <Object3D>   根据导出类型 Scene3D Role EffectGroup </p>
        * *.png|*.jpg                                 ----- <ImageTexture>转换 </p>
        * *.dds|*.hdr|*.tga                           ----- <Texture>转换 </p>
        * *.esm                                       ----- <Geometry>转换 </p>
        * *.eam                                       ----- <SkeletonAnimationClip>转换 </p>
        * *.epa                                       ----- <PropertyAnim>转换 </p>
        * @param url 文件路径
        * @returns any 加载完成后对应的数据
        * @see egret3d.ILoader.data
        * @version Egret 3.0
        * @platform Web,Native
        */
        getAsset(url: string): any;
        /**
         * @language zh_CN
         * 获取安装配置好的动画，通过插件导出的数据 </p>
         * @param url 文件路径
         * @returns Mesh 配置好的动画
         * @see egret3d.ILoader.data
         * @version Egret 3.0
         * @platform Web,Native
         */
        getAnim(url: string): Mesh;
        /**
         * @language zh_CN
         * 获取加载的贴图纹理 *.png|*.jpg|*.dds|*.hdr|*.tga  </p>
         * @param url 文件路径
         * @returns ITexture *.png|*.jpg|*.dds|*.hdr|*.tga 贴图纹理
         * @see egret3d.ILoader.data
         * @version Egret 3.0
         * @platform Web,Native
         */
        getTexture(url: string): ITexture;
        /**
       * @language zh_CN
       * 获取加载的场景 对应 MapConfig.json 场景容器</p>
       * @param url 文件路径
       * @returns Object3D 场景容器
       * @see egret3d.ILoader.data
       * @version Egret 3.0
       * @platform Web,Native
       */
        getScene(url: string): Object3D;
        /**
        * @language zh_CN
        * 获取加载的动画 对应 *.text|*.txt|*.xml|*.json 文本类型</p>
        * @param url 文件路径
        * @returns string *.text|*.txt|*.xml|*.json 文本类型
        * @see egret3d.ILoader.data
        * @version Egret 3.0
        * @platform Web,Native
        */
        getText(url: string): string;
        /**
         * @language zh_CN
         * 获取加载的模型，对应 *.esm 文件</p>
         * @param url 文件路径
         * @returns Geometry 获取加载的模型
         * @see egret3d.ILoader.data
         * @version Egret 3.0
         * @platform Web,Native
         */
        getGeometry(url: string): Geometry;
        /**
       * @language zh_CN
       * 获取加载的动画 对应 *.eam </p>
       * @param url 文件路径
       * @returns SkeletonAnimationClip 获取加载的模型
       * @see egret3d.ILoader.data
       * @version Egret 3.0
       * @platform Web,Native
       */
        getAnimClip(url: string): SkeletonAnimationClip;
        /**
        * @language zh_CN
        * 获取每个资源的URLLoader对象
        * 如果获取的是配置文件会返回配置文件的源数据，而不是解释后的数据
        * @param url 文件路径
        * @returns URLLoader  URLLoader对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        getAssetURLLoader(url: string): URLLoader;
        /**
        * @language zh_CN
        * 获取每个资源的UnitLoader对象
        * @param url 文件路径
        * @returns UnitLoader  UnitLoader对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        getUnitLoader(url: string): UnitLoader;
        protected onComplete(e: LoaderEvent3D): void;
        protected onProgress(e: LoaderEvent3D): void;
        /**
        * @language zh_CN
        * 加载默认的GUI皮肤
        * @version Egret 3.0
        * @platform Web,Native
        */
        loadDefaultGUISkin(): void;
        private guiComplete();
        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
        /**
        * @language zh_CN
        * 释放UnitLoader
        * @prame url 资源路径
        * @version Egret 3.0
        * @platform Web,Native
        */
        disposeUnitLoader(url: string): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    interface MethodData {
        name: string;
        uniform: any;
        format: number;
        data: Float32Array;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.MethodBase
    * @classdesc
    * 增加多种渲染效果的方法基类

    * @version Egret 3.0
    * @platform Web,Native
    */
    class MethodBase {
        /**
        * @private
        * @language zh_CN
        */
        vsShaderList: {
            [shaderPhaseType: number]: string[];
        };
        /**
        * @private
        * @language zh_CN
        */
        fsShaderList: {
            [shaderPhaseType: number]: string[];
        };
        /**
        * @private
        * @language zh_CN
        */
        materialData: MaterialData;
        /**
        * @private
        * @language zh_CN
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D, renderQuen: RenderQuen): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D, renderQuen: RenderQuen): void;
        /**
        * @private
        * @language zh_CN
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.AlphaMaskMethod
    * @classdesc
    * 实现alpha遮罩渲染方法。
    * 该贴图的r通道被用于赋值到diffuse数据的alpha上面。
     * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/GUIMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class GUIMethod extends MethodBase {
        /**
        * @language zh_CN
        * 创建一个AlphaMaskMethod对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 设置lightmap贴图
        * @param texture lightmap贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        setTextures(index: number, texture: ITexture): void;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.TerrainARGBMethod
    * @classdesc
    * 地形贴图混合渲染方法。
    * 使用一张贴图中的ARGB色来进行4张贴图进行混合。
    * 总的需要5张纹理贴图，4张地表纹理，一张融合图
    * 地表最大支持4张地表纹理混合，后期如果需要更多，还可以增加额外的Pass来增加融合地表的纹理数量。
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/TerrainARGBMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class TerrainARGBMethod extends MethodBase {
        private controlTex;
        private splat_0;
        private splat_1;
        private splat_2;
        private splat_3;
        private uvs;
        /**
        * @language zh_CN
        * 创建地形贴图混合渲染方法
        * @param controlTex 混合贴图
        * @param splat_0 第一张贴图
        * @param splat_1 第二张贴图
        * @param splat_2 第三张贴图
        * @param splat_3 第四张贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(controlTex?: ITexture, splat_0?: ITexture, splat_1?: ITexture, splat_2?: ITexture, splat_3?: ITexture);
        /**
        * @language zh_CN
        * 设置 UVTitling。
        * @param index {Number} 图层索引
        * @param x {Number} u 的重复次数
        * @param y {Number} v 的重复次数
        * @version Egret 3.0
        * @platform Web,Native
        */
        setUVTitling(index: number, x: number, y: number): void;
        /**
        * @language zh_CN
        * 设置第一张贴图
        * @param texture 贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        splat_0_Texture: ITexture;
        /**
        * @language zh_CN
        * 设置第二张贴图
        * @param texture 贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        splat_1_Texture: ITexture;
        /**
        * @language zh_CN
        * 设置第三张贴图
        * @version Egret 3.0
        * @platform Web,Native
        * @param texture 贴图
        */
        splat_2_Texture: ITexture;
        /**
        * @language zh_CN
        * 设置第四张贴图
        * @param texture 贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        splat_3_Texture: ITexture;
        /**
        * @language zh_CN
        * 设置混合贴图
        * @param texture 贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        controlTexture: ITexture;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @language zh_CN
        * @private
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @language zh_CN
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.FogMethod
    * @classdesc
    * 继承自 MethodBase,为材质球附加特效的共有基类.
    * 3D物体雾化模式,继续像素的顶点雾化模式 提供几种显示方式
    * 如果要给场景添加雾化,务必需要将此方法赋予场景中的所有材质中
    * Exponential Height Fog渲染方法。
    * 实现3种fog类型： line、exp、exp height
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/FogMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class FogMethod extends MethodBase {
        private uniform_globalFog;
        private _fogColor;
        private _globalDensity;
        private _fogStartDistance;
        private _fogDistanceScale;
        private _height;
        private _fogAlpha;
        /**
        * @language zh_CN
        * 创建一个雾的渲染方法
        * @param fogType 雾的类型 line/exp/expHeightFog
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(fogType?: string);
        /**
        * @language zh_CN
        * 获取雾颜色
        * @returns 雾颜色 rgb  0xffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置雾颜色
        * @param value 雾颜色 rgb  0xffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        fogColor: number;
        /**
        * @language zh_CN
        * 获取雾的全局浓度
        * @returns number 雾的全局浓度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置雾的全局浓度
        * @param value 雾的全局浓度
        * @version Egret 3.0
        * @platform Web,Native
        */
        globalDensity: number;
        /**
        * @language zh_CN
        * 获取雾的开始距离
        * @returns number 雾的开始距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置雾的开始距离
        * @param value 雾的开始距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        fogStartDistance: number;
        /**
        * @language zh_CN
        * 获取雾的高度值
        * @returns number 雾的高度值
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置雾的高度值
        * @param value 雾的高度值
        * @version Egret 3.0
        * @platform Web,Native
        */
        fogHeight: number;
        /**
        * @language zh_CN
        * 获取雾的Alpha值
        * @returns number 雾的Alpha值
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置雾的Alpha值
        * @param value 雾的Alpha值
        * @version Egret 3.0
        * @platform Web,Native
        */
        fogAlpha: number;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
         * @language zh_CN
         * @private
         */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
         * @language zh_CN
         * @private
         */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.FogMethod
    * @classdesc
    * Exponential Height Fog渲染方法。
    * 实现3种fog类型： line、exp、exp height
     * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/LineFogMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class LineFogMethod extends MethodBase {
        private uniform_globalFog;
        private _fogColor;
        private _fogStartDistance;
        private _fogFarDistance;
        private _fogAlpha;
        /**
        * @language zh_CN
        * 创建一个雾的渲染方法
        * @param fogType 雾的类型 line/exp/expHeightFog
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 获取雾颜色
        * @returns 雾颜色 rgb  0xffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置雾颜色
        * @param value 雾颜色 rgb  0xffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        fogColor: number;
        /**
        * @language zh_CN
        * 获取雾的开始距离
        * @returns number 雾的开始距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置雾的开始距离
        * @param value 雾的开始距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        fogStartDistance: number;
        /**
        * @language zh_CN
        * 获取雾的结束距离
        * @returns number 雾的结束距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置雾的结束距离
        * @param value 雾的结束距离
        * @version Egret 3.0
        * @platform Web,Native
        */
        fogFarDistance: number;
        /**
        * @language zh_CN
        * 获取雾的Alpha值
        * @returns number 雾的Alpha值
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置雾的Alpha值
        * @param value 雾的Alpha值
        * @version Egret 3.0
        * @platform Web,Native
        */
        fogAlpha: number;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
         * @language zh_CN
         * @private
         */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
         * @language zh_CN
         * @private
         */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.UVRollMethod
    * @classdesc
    * 用来实现UV滚动效果的渲染方法。
    * 可实现地图滚轴动画。
    * 可实现水流动画。
    * 可实现流动的岩浆特效。
    * 可实现扩散波纹特效。
    * 可实现吸血特效。
    * 根据美术的特效风格使用情况利用 uv roll 动画特效方法
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/UVRollMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UVRollMethod extends MethodBase {
        private _uvRoll;
        private _speedU;
        private _speedV;
        private _time;
        private _start;
        /**
        * @private
        * @language zh_CN
        */
        constructor();
        /**
        * @language zh_CN
        * 获取UV u的滚动速度
        * @returns number u的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 用来UV u的滚动速度
        * @param value u的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        speedU: number;
        /**
        * @language zh_CN
        * 获取UV v的滚动速度
        * @returns number v的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 用来UV v的滚动速度
        * @param value v的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        speedV: number;
        /**
        * @language zh_CN
        * 开始播放uv动画
        * @param rest 如果为ture就是重置播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(rest?: boolean): void;
        /**
        * @language zh_CN
        * 停止播放uv动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.UVRollMethod
    * @classdesc
    * 用来实现多UV滚动效果的渲染方法
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/MulUVRollMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class MulUVRollMethod extends MethodBase {
        private _uvRoll;
        private _uvSpeed;
        private _time;
        private _start;
        private _diffuseTexture1;
        /**
        * @private
        * @language zh_CN
        */
        constructor();
        /**
        * @language zh_CN
        * 用来设置UV u的滚动速度
        * @param index 下标
        * @param value u的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        setSpeedU(index: number, value: number): void;
        /**
        * @language zh_CN
        * 获取UV u的滚动速度
        * @param index 下标
        * @returns number u的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        getSpeedU(index: number): number;
        /**
        * @language zh_CN
        * 用来设置UV v的滚动速度
        * @param index 下标
        * @param value v的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        setSpeedV(index: number, value: number): void;
        /**
        * @language zh_CN
        * 获取UV v的滚动速度
        * @param index 下标
        * @returns number v的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        getSpeedV(index: number): number;
        /**
        * @language zh_CN
        * 开始播放uv动画
        * @param rest 如果为ture就是重置播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(rest?: boolean): void;
        /**
        * @language zh_CN
        * 停止播放uv动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 获取流动贴图
        * @returns ITexture 流动贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置流动贴图
        * @param tex 流动贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        diffuseTexture1: ITexture;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.LightmapMethod
    * @classdesc
    * 实现lightmap渲染方法。
    * 在三维软件里实现打好光，然后渲染把场景各表面的光照输出到贴图上。
    * 然后使用模型的第2UV，渲染出Lightmap效果，lightmap贴图需要自己烘焙。
     * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/MultiUVSpriteMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class MultiUVSpriteMethod extends MethodBase {
        private _isRandom;
        private _multiData;
        row: number;
        column: number;
        sum: number;
        /**
        * @language zh_CN
        * 创建一个MultiUVSpriteMethod对象
        * 构造函数
        * @param row 行数
        * @param column 列数
        * @param sum 序列帧的总数
        * @param isRandom 是否随机序列帧
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(row: number, column: number, sum: number, isRandom?: boolean);
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.UVSpriteSheetMethod
    * @classdesc
    * 用来实现UV精灵动画的渲染方法 。
    * 一整张贴图中用行列来分割帧动画，然后实现每帧播放。
    * row * col 是总帧数， frameNum是只播放的帧数.
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/UVSpriteSheetMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class UVSpriteSheetMethod extends MethodBase {
        private _uvSpriteSheet;
        private _uvRectangle;
        private _speed;
        private _time;
        private _numTime;
        private _start;
        private _frameNum;
        private _row;
        private _column;
        private _currentFrame;
        private frameList;
        private _change;
        private _delayTime;
        private _isLoop;
        private _currentDelay;
        /**
        * @language zh_CN
        * 创建一个UV精灵动画的渲染方法对象
        * @param frameNum  帧数量
        * @param row 行数
        * @param column 列数
        * @param numTime 播放总时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(frameNum: number, row: number, column: number, numTime: number);
        private caculate();
        /**
        * @language zh_CN
        * 获取动画播放总时间
        * @returns number 播放总时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置动画播放总时间
        * @param value 播放总时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        numTime: number;
        /**
        * @language zh_CN
        * 获取动画帧数
        * @returns number  动画帧数
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置动画帧数
        * @param value 动画帧数
        * @version Egret 3.0
        * @platform Web,Native
        */
        frameNum: number;
        /**
        * @language zh_CN
        * 获取动画行数
        * @returns number  动画行数
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置动画行数
        * @param value 动画行数
        * @version Egret 3.0
        * @platform Web,Native
        */
        row: number;
        /**
        * @language zh_CN
        * 获取动画列数
        * @returns number  动画列数
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置动画列数
        * @param value 动画列数
        * @version Egret 3.0
        * @platform Web,Native
        */
        column: number;
        /**
        * @language zh_CN
        * 开始播放uv精灵动画
        * @param rest 如果为ture就是重置播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(rest?: boolean): void;
        /**
        * @language zh_CN
        * 停止播放uv精灵动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 获取播放延时时间
        * @returns number 时间 秒
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置播放延时时间
        * @param value 时间 秒
        * @version Egret 3.0
        * @platform Web,Native
        */
        delayTime: number;
        /**
        * @language zh_CN
        * 获取是否循环播放
        * @returns boolean 是否循环
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置是否循环播放
        * @param value 是否循环
        * @version Egret 3.0
        * @platform Web,Native
        */
        isLoop: boolean;
        /**
        * @language zh_CN
        * 获取当前帧
        * @param value currentFrame
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置当前帧
        * @param value 0 - frameNum
        * @version Egret 3.0
        * @platform Web,Native
        */
        currentFrame: number;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.LightmapMethod
    * @classdesc
    * 实现lightmap渲染方法。
    * 在三维软件里实现打好光，然后渲染把场景各表面的光照输出到贴图上。
    * 然后使用模型的第2UV，渲染出Lightmap效果，lightmap贴图需要自己烘焙。
     * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/LightmapMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class LightmapMethod extends MethodBase {
        private texture;
        private _globalColorData;
        /**
        * @language zh_CN
        * 创建一个LightmapMethod对象
        * @param useSpecularPower 是否使用高功率，默认参数为true
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(useSpecularPower?: boolean);
        /**
        * @language zh_CN
        * 设置lightmap贴图
        * @param texture lightmap贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        lightTexture: ITexture;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.UVRollMethod
    * @classdesc
    * 植物模拟自然风吹摇动特效方法
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/PlantDistortedMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PlantDistortedMethod extends MethodBase {
        private _speed;
        private _time;
        private _windData;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 设置风的方向，Vector3D的长度代表其速度
        * @param dirAndStr 风向和风的强度数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        windDirAndSpeed: Vector3D;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, moodeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.AlphaMaskMethod
    * @classdesc
    * 继承自 MethodBase,为材质球附加特效的共有基类.</p>
    * 实现alpha遮罩特效渲染方法。</p>
    * 该贴图的r通道被用于赋值到diffuse数据的alpha上面,实现 细节后期处理透明效果,目前可直接使用 png texture直接实现透明细节</p>
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法</p>
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/AlphaMaskMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class AlphaMaskMethod extends MethodBase {
        private texture;
        /**
        * @language zh_CN
        * 创建一个AlphaMaskMethod对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 设置maskTexture贴图
        * @param texture maskTexture贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        maskTexture: ITexture;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.AOMapMethod
    * @classdesc
    * 继承自 MethodBase,为材质球附加特效的共有基类.
    * AO贴图渲染方法,Ambient Occlusion texture 的简称.
    * 使用第三方软件渲染好的3D模型AO贴图进行mapping,模拟自然环境遮挡效果.增强真实感.
    * 推荐3Dmax Ambient Occlusion 渲染到贴图的功能,将模型的 AO 渲染成为一张贴图,赋给模型使用,前提需要保证模型第二UV要保证一致
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/AOMapMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class AOMapMethod extends MethodBase {
        private aoPower;
        private texture;
        /**
        * @language zh_CN
        * 创建AO贴图方法
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 设置AO贴图
        * @param texture AO贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        lightTexture: ITexture;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @language zh_CN
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.ColorTransformMethod
    * @classdesc
    * 继承自 MethodBase,为材质球附加特效的共有基类.
    * 实现偏色渲染方法。
    * 将最终渲染的argb值按照这个transform进行修正。
    * 也可以用来做颜色的变化特效,实时修改颜色变化,闪烁
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/ColorTransformMethod.ts
    * @see egret3d.texture.ColorTransform
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ColorTransformMethod extends MethodBase {
        /**
        * @language zh_CN
        * 创建一个ColorTransformMethod对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 返回ColorTransform数据
        * @param trasform ColorTransform
        * @see egret3d.texture.ColorTransform
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置ColorTransform数据
        * @param trasform ColorTransform
        * @see egret3d.texture.ColorTransform
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorTransform: ColorTransform;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.ColorGradientsMethod
    * @classdesc
    * 实现颜色渐变叠加
    * @see egret3d.MethodBase
    * @includeExample material/method/ColorGradientsMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ColorGradientsMethod extends MethodBase {
        private _posStart;
        private _posEnd;
        private _color;
        /**
        * @language zh_CN
        * 创建一个ColorGradientsMethod对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 设置颜色渐变数据
        * @param posStart number 起始位置，相对小的y值
        * @param posEnd number 结束为止，相对大的y值
        * @param color Color
        * @version Egret 3.0
        * @platform Web,Native
        */
        setStartData(posStart: number, posEnd: number, color: Color): void;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.UVRollMethod
    * @classdesc
    * 用来实现UV流光滚动效果的渲染方法
    * 在3D游戏中用来制作物体装备流光的特效显示，比如《奇迹》中的装备流光
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/StreamerMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class StreamerMethod extends MethodBase {
        private _uvRoll;
        private _speedU;
        private _speedV;
        private _intensity;
        private _time;
        private _start;
        private _steamerTexture;
        /**
        * @private
        * @language zh_CN
        */
        constructor();
        /**
        * @language zh_CN
        * 获取UV u的滚动速度
        * @returns number u的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 用来UV u的滚动速度
        * @param value u的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        speedU: number;
        /**
        * @language zh_CN
        * 获取UV v的滚动速度
        * @returns number v的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 用来UV v的滚动速度
        * @param value v的滚动速度
        * @version Egret 3.0
        * @platform Web,Native
        */
        speedV: number;
        /**
        * @language zh_CN
        * 获取流动贴图
        * @returns ITexture 流动贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置流动贴图
        * @param tex 流动贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        steamerTexture: ITexture;
        /**
        * @language zh_CN
        * 开始播放uv动画
        * @param rest 如果为ture就是重置播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(rest?: boolean): void;
        /**
        * @language zh_CN
        * 停止播放uv动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.AlphaMaskMethod
    * @classdesc
    * 实现实时阴影渲染方法
    * @see egret3d.MethodBase
    * @includeExample material/method/ShadowMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ShadowMethod extends MethodBase {
        constructor(matData?: MaterialData);
        /**
        * @language zh_CN
        * 获取阴影贴图
        * @returns ITexture 阴影贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置阴影贴图
        * @param texture 阴影贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        shadowMapTexture: ITexture;
        /**
        * @private
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D, renderQuen: RenderQuen): void;
        /**
        * @private
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D, renderQuen: RenderQuen): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.CubeMethod
    * @classdesc
    * @see egret3d.MethodBase
    * @version Egret 3.0
    * @platform Web,Native
    */
    class CubeMethod extends MethodBase {
        private texture;
        /**
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @private
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.ColorMethod
    * @classdesc
    * 继承自 MethodBase,为材质球附加特效的共有基类.
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/ColorMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ColorMethod extends MethodBase {
        /**
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @private
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.WaterWaveMethod
    * @classdesc
    * 水面模拟特效，用来实现水面顶点波动效果
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/WaterWaveMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class WaterWaveMethod extends MethodBase {
        private _waveVSData;
        private _waveFSData;
        private _time;
        private _start;
        private _wave_xyz_intensity_0;
        private _wave_xyz_intensity_1;
        private _wave_xyz_speed_0;
        private _wave_xyz_speed_1;
        private _waveTexture;
        /**
        * @private
        * @language zh_CN
        */
        constructor();
        /**
        * @language zh_CN
        * 获取深水颜色
        * @param color 颜色 a r b g
        */
        /**
        * @language zh_CN
        * 设置深水颜色
        * @param color 颜色 a r b g
        */
        deepWaterColor: number;
        /**
        * @language zh_CN
        * 获取浅水颜色
        * @param color 颜色 a r b g
        */
        /**
        * @language zh_CN
        * 设置浅水颜色
        * @param color 颜色
        */
        shallowWaterColor: number;
        /**
        * @language zh_CN
        * 水贴图
        * @param texture  水贴图
        */
        waveTexture: ITexture;
        /**
        * @language zh_CN
        * 开始播放uv动画
        * @param rest 如果为ture就是重置播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(rest?: boolean): void;
        /**
        * @language zh_CN
        * 停止播放uv动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.WaterNormalMethod
    * @classdesc
    * 材质中赋予灯光后，可以添加此方法，灯光和法线的变化而产生水面波光粼粼的效果
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/WaterNormalMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class WaterNormalMethod extends MethodBase {
        private _uvData;
        private _time;
        private _start;
        private _speedU_0;
        private _speedU_1;
        private _distion_intensity;
        private _normalTexture_0;
        private _normalTexture_1;
        private _normal_0_UVScale;
        private _normal_1_UVScale;
        /**
        * @private
        * @language zh_CN
        */
        constructor();
        /**
        * @language zh_CN
        * 开始播放uv动画
        * @param rest 如果为ture就是重置播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(rest?: boolean): void;
        /**
        * @language zh_CN
        * 停止播放uv动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 设置UV 速度
        * @param index 0 或 1
        * @param u
        * @param v
        * @version Egret 3.0
        * @platform Web,Native
        */
        setUvSpeed(index: number, u: number, v: number): void;
        /**
        * @language zh_CN
        * 设置UV repat次数
        * @param u
        * @param v
        * @version Egret 3.0
        * @platform Web,Native
        */
        setUvScale(first: number, second: number): void;
        /**
         * @language zh_CN
         * 设置lightmap贴图
         * @param texture lightmap贴图
         * @version Egret 3.0
         * @platform Web,Native
         */
        normalTextureA: ITexture;
        /**
         * @language zh_CN
         * 设置lightmap贴图
         * @param texture lightmap贴图
         * @version Egret 3.0
         * @platform Web,Native
         */
        normalTextureB: ITexture;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.UVRollMethod
    * @classdesc
    * 继承自 MethodBase,为材质球附加特效的共有基类.
    * 环境映射是一种用来模拟光滑表面对周围环境的反射的技术，常见的如镜子、光亮漆面的金属等等。
    * 这种技术的实现主要通过将一张带有周围环境的贴图附在所需要表现的多边形表面来实现的。目前在实时3D游戏画面渲染中经常使用的有两种环境映射。
    * 球形环境映射是模拟在球体表面产生环境映射的技术，通过对普通贴图的UV坐标进行调整计算来产生在球体表面应产生的扭曲。
    * UV的计算利用球体表面的法线来计算。
    * 计算公式中的Nx和Ny是表面法线的x和y分量，除以2将区间限制在[-0.5,0.5]，+0.5将区间调整至UV坐标应在的[0,1]区间。在这个公式的计算下，当球体正中表面法线正对摄像机的地方，坐标不会有任何扭曲；周围点依次随着Nx和Ny分量的增大而产生扭曲。
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/EnvironmentMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class EnvironmentMethod extends MethodBase {
        private texture;
        private reflectValue;
        /**
        * @private
        * @language zh_CN
        */
        constructor();
        /**
         * @public
         * 返回环境的强弱度
         * @returns number 环境的强弱度
         */
        /**
         * @public
         * 设置反射 环境的强弱度,值区间在[0~1]
         * @param value 强弱度
         * @version Egret 3.0
         * @platform Web,Native
         */
        reflect: number;
        /**
         * @language zh_CN
         * @public
         * 设置环境纹理,一张 cubemap,可配合天空纹理使用增强环境渲染效果
         * @see egret3d.MethodBase
         * @see egret3d.texture.CubeTexture
         * @param texture
         */
        environmentTexture: ITexture;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.UVRollMethod
    * @classdesc
    * 边缘光特效方法
    * 利用屏幕空间法线与摄像机方向射线的夹角 进行pow ，越是物体的边缘，效果越强。
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/RimlightMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class RimlightMethod extends MethodBase {
        uniform_rimData: Float32Array;
        constructor();
        /**
        * @language zh_CN
        * 获取边缘光特效的颜色。
        * @param  val 获取边缘光特效的颜色。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置边缘光特效的颜色 alpha值为特效的亮度,其他为颜色。
        * @param  val 设置边缘光特效的颜色 alpha值为特效的亮度,其他为颜色。
        * @version Egret 3.0
        * @platform Web,Native
        */
        rimColor: number;
        /**
        * @language zh_CN
        * 设置边缘光特效的pow值,值越大,边缘越窄,值越小,边缘越宽.
        * @param  size 设置边缘光特效的pow值,值越大,边缘越窄,值越小,边缘越宽.
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置边缘光特效的pow值,值越大,边缘越窄,值越小,边缘越宽.
        * @param  size 设置边缘光特效的pow值,值越大,边缘越窄,值越小,边缘越宽.
        * @version Egret 3.0
        * @platform Web,Native
        */
        rimPow: number;
        /**
        * @language zh_CN
        * 设置边缘光特效的强度值
        * @param  size 设置边缘光特效的强度值
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置边缘光特效的强度值
        * @param  size 设置边缘光特效的强度值
        * @version Egret 3.0
        * @platform Web,Native
        */
        strength: number;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
         * @language zh_CN
         * @private
         */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
         * @language zh_CN
         * @private
         */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.GrassMesh
    * @classdesc
    * 实现风吹草动，并且实现了单个角色在草丛中，挤压草的效果
    * @see egret3d.plant.GrassMethod.ts
    * @includeExample plant/GrassMesh.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class GrassMesh extends Mesh {
        private _attrPosition;
        private _attrAngleY;
        private _plantShape;
        private _count;
        private _method;
        private _data;
        private _birthPoints;
        /**
        * @language zh_CN
        * 构造函数
        * @param birthPoints 草的出生位置列表
        * @param material 材质
        * @param data 草的属性
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(birthPoints: Vector3D[], material: MaterialBase, data: GrassData);
        /**
        * @language zh_CN
        * 获取GrassMethod
        * @returns 草的Method，用于外部控制
        */
        method: GrassMethod;
        /**
        * @private
        */
        protected initialize(): void;
        /**
        * @language zh_CN
        * 计算节点
        * @private
        */
        private initGeometryAttr(geometry);
        /**
        * @language zh_CN
        * @private
        * 构建包围盒
        * @version Egret 3.0
        * @platform Web,Native
        */
        private initBoudBox(vector);
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, camera: Camera3D): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        private initPostionData(geometry, count);
        /**
        * @language zh_CN
        * 克隆该风吹草动
        * @returns 克隆后的草
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): GrassMesh;
        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.GrassMethod
    * @classdesc
    * 构造函数，用于设置草的属性
    * @version Egret 3.0
    * @platform Web,Native
    */
    class GrassData {
        /**
        * @language zh_CN
        * 面片的最小宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        minWidth: number;
        /**
        * @language zh_CN
        * 面片的最大宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        maxWidth: number;
        /**
        * @language zh_CN
        * 面片的最小高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        minHeight: number;
        /**
        * @language zh_CN
        * 面片的最大高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        maxHeight: number;
        /**
        * @language zh_CN
        * 草的噪波产生簇大小。越低的值意味着噪波越低。
        * @version Egret 3.0
        * @platform Web,Native
        */
        noiseSpread: number;
        /**
        * @language zh_CN
        * 健康颜色的草，在噪波中心非常显著
        * @version Egret 3.0
        * @platform Web,Native
        */
        healthyColor: string;
        /**
        * @language zh_CN
        * 干燥的草的颜色，在噪波边缘非常显著
        * @version Egret 3.0
        * @platform Web,Native
        */
        dryColor: string;
        /**
        * @language zh_CN
        * 如果选中，草将随着摄像机一起转动，面朝主摄像机
        * @version Egret 3.0
        * @platform Web,Native
        */
        billboard: boolean;
        /**
        * @language zh_CN
        * 草的分布图
        * @version Egret 3.0
        * @platform Web,Native
        */
        detailTexture: string;
        /**
        * @language zh_CN
        * 草的贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        grassTexture: string;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.GrassMethod
    * @classdesc
    * 草的飘动动画实现部分,不建议单独使用，而是封装在GrassMesh中被动生成。
    * @see egret3d.GrassMesh
    * @includeExample plant/GrassMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class GrassMethod extends MethodBase {
        private _start;
        private _time;
        private _windSpeed;
        private _windStrength;
        private _shakeScale;
        private _windDirection;
        private _windSpace;
        private _windData;
        private _squeezeData;
        private _lightMapData;
        private _data;
        private _lightMapTexture;
        private _lightMapRect;
        /**
        * @language zh_CN
        * @构造函数
        * 创建一个GrassMethod对象
        * @param data GrassData 创建该method需要用到的数据源
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(data: GrassData);
        /**
        * @language zh_CN
        * 设置草用到的灯光图和数据
        * @param lightMap 灯光贴图
        * @param lightMapRect 用于计算UV的数据xy代表偏移，width/height为用于和场景xz的缩放系数
        * @version Egret 3.0
        * @platform Web,Native
        */
        setLightMapData(lightMap?: ITexture, lightMapRect?: Rectangle): void;
        private updateLightMapData();
        /**
        * @language zh_CN
        * 更新风的参数
        * @param direction 单位向量，xz为有效值，表示风的方向
        * @param space 一团风的体积，xz为有效值，每个朝向在单位体积内实现了一个正弦抖动循环
        * @param speed 风的移动速度，代表1秒内，风移动的单位
        * @param windStrength 风的强度，这个值用于加成到草的倾斜上面
        * @param shakeScale 草自身来回摇摆缩放系数，这个值用于加成到草的倾斜上面
        * @version Egret 3.0
        * @platform Web,Native
        */
        setWind(direction: Vector3D, space: Vector3D, speed?: number, windStrength?: number, shakeScale?: number): void;
        /**
        * @language zh_CN
        * 更新草受到挤压的数据
        * @param position 挤压开始的位置
        * @param enable 是否开启挤压
        * @param radius 挤压的半价
        * @param strength 挤压的强度，会修改草倾斜的力度
        * @version Egret 3.0
        * @platform Web,Native
        */
        updateSqueezeData(position: Vector3D, enable: boolean, radius?: number, strength?: number): void;
        private fillGrassData();
        /**
        * @language zh_CN
        * 开始播放动画
        * @param rest 如果为ture就是重置播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(rest?: boolean): void;
        /**
        * @language zh_CN
        * 停止播放uv动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.WaterBumpMethod
    * @classdesc
    * 材质中赋予灯光后，可以添加此方法，灯光和法线的变化而产生水面波光粼粼的效果
    * 使用方法 需要使用 $mesh.material.diffusePass.addMethod( this ) 向材质中添加效果方法
    * @see egret3d.MethodBase
    * @see egret3d.MaterialPass
    * @includeExample material/method/WaterBumpMethod.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class WaterBumpMethod extends MethodBase {
        private _uvData;
        private _horizonColor;
        private _time;
        private _start;
        private _bumpTexture;
        private _colorControlTexture;
        private _distion_intensity;
        /**
        * @private
        * @language zh_CN
        */
        constructor();
        /**
        * @language zh_CN
        * 开始播放uv动画
        * @param rest 如果为ture就是重置播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(rest?: boolean): void;
        /**
        * @language zh_CN
        * 停止播放uv动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 设置UV 速度
        * @param index 0 或 1
        * @param u
        * @param v
        * @version Egret 3.0
        * @platform Web,Native
        */
        setUvSpeed(index: number, u: number, v: number): void;
        /**
        * @language zh_CN
        * 设置UV repat次数
        * @param u
        * @param v
        * @version Egret 3.0
        * @platform Web,Native
        */
        setUvScale(first: number, second: number): void;
        /**
         * @language zh_CN
         * 设置lightmap贴图
         * @param texture lightmap贴图
         * @version Egret 3.0
         * @platform Web,Native
         */
        bumpTexture: ITexture;
        /**
         * @language zh_CN
         * 设置lightmap贴图
         * @param texture lightmap贴图
         * @version Egret 3.0
         * @platform Web,Native
         */
        colorTexture: ITexture;
        /**
        * @private
        * @language zh_CN
        * @param time
        * @param delay
        * @param usage
        * @param materialData
        * @param geometry
        * @param context3DProxy
        * @param modeltransform
        * @param modeltransform
        * @param camera3D
        */
        upload(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.MethodUsageData
    * @classdesc
    * 方法中需要用到的数据。
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PassUsage {
        /**
         * @language zh_CN
         */
        uniform_1ivs: Array<GLSL.Uniform>;
        /**
         * @language zh_CN
         */
        uniform_1fvs: Array<GLSL.Uniform>;
        /**
         * @language zh_CN
         */
        uniform_2ivs: Array<GLSL.Uniform>;
        /**
         * @language zh_CN
         */
        uniform_2fvs: Array<GLSL.Uniform>;
        /**
         * @language zh_CN
         */
        uniform_3ivs: Array<GLSL.Uniform>;
        /**
         * @language zh_CN
         */
        uniform_3fvs: Array<GLSL.Uniform>;
        /**
         * @language zh_CN
         */
        uniform_4ivs: Array<GLSL.Uniform>;
        /**
         * @language zh_CN
         */
        uniform_4fvs: Array<GLSL.Uniform>;
        /**
         * @language zh_CN
         */
        attribute_position: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_normal: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_tangent: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_color: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_uv0: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_uv1: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_boneIndex: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_boneWeight: GLSL.Attribute;
        /**
       * @language zh_CN
       */
        attribute_shapePosition: GLSL.Attribute;
        /**
          * @language zh_CN
          */
        attribute_uvRec: GLSL.Attribute;
        /**
          * @language zh_CN
          */
        /**
          * @language zh_CN
          */
        attribute_size: GLSL.Attribute;
        /**
     * @language zh_CN
     */
        attribute_quad_color: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_offset: GLSL.Attribute;
        attribute_billboardXYZ: GLSL.Attribute;
        attribute_lifecycle: GLSL.Attribute;
        attribute_direction: GLSL.Attribute;
        attribute_speed: GLSL.Attribute;
        attribute_startScale: GLSL.Attribute;
        attribute_endScale: GLSL.Attribute;
        attribute_startColor: GLSL.Attribute;
        attribute_endColor: GLSL.Attribute;
        attribute_rotate: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_acceleRotate: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_maskRectangle: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        attribute_acceleScale: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        /**
         * @language zh_CN
         */
        attribute_startSpaceLifeTime: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        varying_pos: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        varying_normal: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        varying_tangent: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        varying_color: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        varying_uv0: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        varying_uv1: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        varying_eyeNormal: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        varying_eyedir: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        TBN: GLSL.Attribute;
        /**
         * @language zh_CN
         */
        uniform_ModelMatrix: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_ProjectionMatrix: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_ViewProjectionMatrix: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_ViewMatrix: GLSL.Uniform;
        /**
        * @language zh_CN
        */
        uniform_ModelViewMatrix: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_orthProjectMatrix: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_ShadowMatrix: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_eyepos: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_PoseMatrix: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_sceneWidth: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_sceneHeight: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_time: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_cameraMatrix: GLSL.Uniform;
        uniform_enableBillboardXYZ: GLSL.Uniform;
        uniform_startColor: GLSL.Uniform;
        uniform_endColor: GLSL.Uniform;
        uniform_startScale: GLSL.Uniform;
        uniform_endScale: GLSL.Uniform;
        uniform_startRot: GLSL.Uniform;
        uniform_endRot: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        sampler2DList: Array<GLSL.Sampler2D>;
        /**
         * @language zh_CN
         */
        sampler3DList: Array<GLSL.Sampler3D>;
        /**
         * @language zh_CN
         */
        uniform_materialSource: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_LightSource: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_lightModelSource: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_directLightSource: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_sportLightSource: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_pointLightSource: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        uniform_skyLightSource: GLSL.Uniform;
        uniform_ShadowColor: GLSL.Uniform;
        /**
         * @language zh_CN
         */
        program3D: Program3D;
        /**
         * @language zh_CN
         */
        vs_shader: Shader;
        /**
         * @language zh_CN
         */
        fs_shader: Shader;
        vertexShader: ShaderBase;
        fragmentShader: ShaderBase;
        maxDirectLight: number;
        maxSpotLight: number;
        maxPointLight: number;
        maxBone: number;
        directLightData: Float32Array;
        spotLightData: Float32Array;
        pointLightData: Float32Array;
        attributeDiry: boolean;
        /**
         * @language zh_CN
         */
        dispose(): void;
    }
}
declare module egret3d {
    /**
     * @private
     * @class egret3d.MaterialData
     */
    class MaterialData extends Object {
        /**
        * @private
        * @language zh_CN
        * 材质类型数组。
        * @每个材质球可能会有很多种贴图方法，而这个是做为默认支持的材质方法的添加通道。要使用的方法
        * @default MaterialType.DIFFUSE
        * @version Egret 3.0
        * @platform Web,Native
        */
        shaderPhaseTypes: {
            [passID: number]: ShaderPhaseType[];
        };
        /**
        * @language zh_CN
        * 深度 pass usage data。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 法线 pass usage 数据。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * position pass usage 数据。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * post pass usage 数据。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 灯光 pass usage 数据。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 阴影 pass usage 数据。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 材质球ID。
        * <p> 一个合成材质球，可以多维合成，用于标记 subGeometry 所用的材质方法
        * @version Egret 3.0
        * @platform Web,Native
        */
        matID: number;
        /**
        * @language zh_CN
        * 渲染模式。
        * @default DrawMode.TRIANGLES
        * @version Egret 3.0
        * @platform Web,Native
        */
        drawMode: number;
        /**
        * @language zh_CN
        * 渲染模式。
        * @default DrawMode.TRIANGLES
        * @version Egret 3.0
        * @platform Web,Native
        */
        useMipmap: boolean;
        /**
        * @language zh_CN
        * 阴影贴图。
        * @version Egret 3.0
        * @platform Web,Native
        */
        shadowMapTexture: ITexture;
        /**
        * @language zh_CN
        * 漫反射贴图。
        * @version Egret 3.0
        * @platform Web,Native
        */
        diffuseTexture: ITexture;
        /**
        * @language zh_CN
        * 法线贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        normalTexture: ITexture;
        /**
        * @language zh_CN
        * matCapTexture。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        matcapTexture: ITexture;
        /**
        * @language zh_CN
        * 特效贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        specularTexture: ITexture;
        /**
        * @language zh_CN
        * 灯光贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        lightTexture: ITexture;
        /**
        * @language zh_CN
        * 遮罩贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        maskTexture: ITexture;
        /**
        * @language zh_CN
        * ao 贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        aoTexture: ITexture;
        /**
        * @language zh_CN
        * 环境贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        environmentTexture: ITexture;
        /**
        * @language zh_CN
        * mask 贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        blendMaskTexture: ITexture;
        /**
        * @language zh_CN
        * splat_0 贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        splat_0Tex: ITexture;
        /**
        * @language zh_CN
        * splat_1 贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        splat_1Tex: ITexture;
        /**
        * @language zh_CN
        * splat_2 贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        splat_2Tex: ITexture;
        /**
        * @language zh_CN
        * splat_3 贴图。
        * @default CheckerboardTexture.texture
        * @version Egret 3.0
        * @platform Web,Native
        */
        splat_3Tex: ITexture;
        /**
        * @language zh_CN
        * layer。
        * @default 0
        * @version Egret 3.0
        * @platform Web,Native
        */
        layer: number;
        /**
        * @language zh_CN
        * 投射阴影 。
        * @default false
        * @version Egret 3.0
        * @platform Web,Native
        */
        castShadow: boolean;
        /**
        * @language zh_CN
        * 接受阴影。
        * @default true
        * @version Egret 3.0
        * @platform Web,Native
        */
        acceptShadow: boolean;
        /**
        * @language zh_CN
        * 阴影颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        shadowColor: Float32Array;
        /**
        * @language zh_CN
        * 深度测试 。
        * @default true
        * @version Egret 3.0
        * @platform Web,Native
        */
        depthTest: boolean;
        /**
        * @language zh_CN
        * 深度写入 。
        * @default true
        * @version Egret 4.0
        * @platform Web,Native
        */
        depthWrite: boolean;
        /**
        * @language zh_CN
        * 深度测试模式
        * @default true
        * @version Egret 3.0
        * @platform Web,Native
        */
        depthMode: number;
        /**
        * @language zh_CN
        * 混合模式 。
        * @default BlendMode.NORMAL
        * @version Egret 3.0
        * @platform Web,Native
        */
        blendMode: BlendMode;
        /**
        * @language zh_CN
        * blend_src 值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        blend_src: number;
        /**
        * @language zh_CN
        * blend_dest 值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        blend_dest: number;
        /**
        * @language zh_CN
        * alphaBlending。
        * @default false
        * @version Egret 3.0
        * @platform Web,Native
        */
        alphaBlending: boolean;
        /**
        * @language zh_CN
        * ambientColor 值。
        * @default 0x0
        * @version Egret 3.0
        * @platform Web,Native
        */
        ambientColor: number;
        /**
        * @language zh_CN
        * diffuseColor 值。
        * @default 0xffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        diffuseColor: number;
        /**
        * @language zh_CN
        * specularColor 值。
        * @default 0xffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        specularColor: number;
        /**
        * @language zh_CN
        * 色相。
        * @default 8.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        tintColor: number;
        /**
        * @language zh_CN
        * 材质球的高光强度。
        * @default 8.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        specularLevel: number;
        /**
        * @language zh_CN
        * gama 矫正。
        * @default 8.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        gamma: number;
        refraction: number;
        refractionintensity: number;
        /**
        * @language zh_CN
        * 材质球的光滑度。
        * @default 8.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        gloss: number;
        /**
        * @language zh_CN
        * cutAlpha 值。
        * @default 0.7
        * @version Egret 3.0
        * @platform Web,Native
        */
        cutAlpha: number;
        /**
        * @language zh_CN
        * 是否重复。
        * @default false
        * @version Egret 3.0
        * @platform Web,Native
        */
        repeat: boolean;
        /**
        * @language zh_CN
        * bothside 值。
        * @default false
        * @version Egret 3.0
        * @platform Web,Native
        */
        bothside: boolean;
        /**
        * @language zh_CN
        * alpha 值。
        * @default 1.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        alpha: number;
        /**
        * @language zh_CN
        * 光照光滑程度，会影响反光的面积，强度。
        * @default 1.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 反射颜色的强度值，出射光照的出射率。
         * @default 1.0
         * @version Egret 3.0
         * @platform Web,Native
         */
        albedo: number;
        /**
        * @language zh_CN
        * 法线贴图的Y轴朝向
        * @default 1.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        normalDir: number;
        /**
        * @language zh_CN
        * uv 在贴图上的映射区域，值的范围限制在0.0~1.0之间。
        * @default 1.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        uvRectangle: Rectangle;
        /**
        * @language zh_CN
        * ambientPower 值。
        * @default 1.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * diffusePower。
        * @default 1.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * normalPower 值。
        * @default 1.0
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 材质数据需要变化。
        * @default true
        * @version Egret 3.0
        * @platform Web,Native
        */
        materialDataNeedChange: boolean;
        /**
        * @language zh_CN
        * 纹理变化。
        * @default false
        * @version Egret 3.0
        * @platform Web,Native
        */
        textureChange: boolean;
        /**
        * @language zh_CN
        * 纹理状态需要更新。
        * @default false
        * @version Egret 3.0
        * @platform Web,Native
        */
        textureStateChage: boolean;
        /**
        * @language zh_CN
        * cullFrontOrBack。
        * @default Egret3DDrive.BACK
        * @version Egret 3.0
        * @platform Web,Native
        */
        cullFrontOrBack: number;
        /**
         * @language zh_CN
         */
        materialSourceData: Float32Array;
        /**
         * @language zh_CN
         */
        colorGradientsSource: Float32Array;
        /**
        * @language zh_CN
        * 颜色变化信息。
        * @default false
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorTransform: ColorTransform;
        /**
         * @language zh_CN
         */
        directLightData: Float32Array;
        /**
         * @language zh_CN
         */
        sportLightData: Float32Array;
        /**
         * @language zh_CN
         */
        pointLightData: Float32Array;
        /**
        * @language zh_CN
        * 克隆方法。
        * @returns {MaterialData}
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): MaterialData;
        /**
        * @language zh_CN
        * 销毁。
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.MaterialPass
    * @classdesc
    * 材质渲染pass 根据Mesh数据、模型的材质还有灯光数据的不同。
    * 以不同的渲染方法，会组成相应的shader内容，然后渲染出不同的效果。
    * 阶段 shader 灵活动态的 特效组合
    * @see egret3d.Mesh
    * @version Egret 3.0
    * @platform Web,Native
    */
    class MaterialPass {
        /**
       * @private
       */
        _passID: number;
        /**
       * @private
       */
        _passUsage: PassUsage;
        /**
       * @private
       */
        _materialData: MaterialData;
        /**
       * @private
       */
        _passChange: boolean;
        /**
       * @private
       */
        _vs_shader_methods: {
            [phaseType: number]: string[];
        };
        /**
       * @private
       */
        _fs_shader_methods: {
            [phaseType: number]: string[];
        };
        /**
        * @private
        */
        methodList: Array<MethodBase>;
        /**
        * @private
        */
        methodDatas: Array<MethodData>;
        /**
        * @private
        */
        vsShaderNames: Array<string>;
        /**
        * @private
        */
        fsShaderNames: Array<string>;
        /**
        * @private
        */
        protected _lightGroup: LightGroup;
        /**
        * @private
        */
        /**
        * @private
        */
        lightGroup: LightGroup;
        private _shadowMethod;
        /**
          * @public
          * @language zh_CN
          * pass渲染是否开启使用
          * @param method 渲染方法
          * @version Egret 3.0
          * @platform Web,Native
          */
        enable: boolean;
        /**
        * @private
        */
        constructor(data?: MaterialData);
        protected onLightReset(e: Event3D): void;
        /**
        * @private
        */
        materialData: MaterialData;
        /**
        * @language zh_CN
        * 增加渲染方法
        * @param method 渲染方法
        * @version Egret 3.0
        * @platform Web,Native
        */
        addMethod(method: MethodBase): void;
        /**
        * @language zh_CN
        * 移除渲染方法
        * @param method 渲染方法
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeMethod(method: MethodBase): void;
        /**
        * @language zh_CN
        * 使用类型拿到 MethodBase  getMethod(UVSpriteSheetMethod)
        * @param type 类型  比如:UVSpriteSheetMethod
        * @version Egret 3.0
        * @platform Web,Native
        */
        getMethod(type: any): MethodBase;
        addShadowMethod(): void;
        removShadowMethod(): void;
        protected materialDataChange(): void;
        /**
        * @private
        */
        passInvalid(): void;
        /**
       * @language zh_CN
       * 重置纹理。
       * @version Egret 3.0
       * @platform Web,Native
       */
        protected resetTexture(context3DProxy: Context3DProxy): void;
        /**
        * @language zh_CN
        * @private
        * 指定shader 添加shader 片段。
        * @version Egret 3.0
        * @platform Web,Native
        */
        protected addMethodShaders(shaderBase: ShaderBase, shaders: string[]): void;
        protected addShaderPhase(passType: number, sourcePhase: {
            [shaderPhase: number]: string[];
        }, targetPhase: {
            [shaderPhase: number]: string[];
        }): void;
        protected initOthreMethods(): void;
        /**
        * @language zh_CN
        * @private
        * 初始化 UseMethod。
        * @version Egret 3.0
        * @platform Web,Native
        */
        initUseMethod(animation: IAnimation, geom: Geometry): void;
        protected phaseEnd(animation: IAnimation): void;
        /**
        * @private
        */
        upload(time: number, delay: number, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D, animation: IAnimation, geometry: Geometry, renderQuen: RenderQuen): void;
        /**
        * @private
        */
        draw(time: number, delay: number, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D, subGeometry: SubGeometry, render: IRender, renderQuen: RenderQuen): void;
        deactiveState(passUsage: PassUsage, context3DProxy: Context3DProxy): void;
        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class ColorPass extends MaterialPass {
        constructor(materialData: MaterialData);
        /**
       * @language zh_CN
       * @private
       * 初始化 UseMethod。
       * @version Egret 3.0
       * @platform Web,Native
       */
        initUseMethod(animation: IAnimation, geom: Geometry): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class DiffusePass extends MaterialPass {
        constructor(materialData: MaterialData);
        /**
        * @language zh_CN
        * @private
        * 初始化 UseMethod。
        * @version Egret 3.0
        * @platform Web,Native
        */
        initUseMethod(animation: IAnimation, geom: Geometry): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class FakePBRPass extends MaterialPass {
        constructor(materialData: MaterialData);
        setTexture(name: string, texture: Texture): void;
        /**
        * @language zh_CN
        * @private
        * 初始化 UseMethod。
        * @version Egret 3.0
        * @platform Web,Native
        */
        initUseMethod(animation: IAnimation, geom: Geometry): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class ShadowPass extends MaterialPass {
        constructor(materialData: MaterialData);
        /**
        * @language zh_CN
        * @private
        * 初始化 UseMethod。
        * @version Egret 3.0
        * @platform Web,Native
        */
        initUseMethod(animation: IAnimation, geom: Geometry): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class NormalPass extends MaterialPass {
        constructor(materialData: MaterialData);
        /**
        * @language zh_CN
        * @private
        * 初始化 UseMethod。
        * @version Egret 3.0
        * @platform Web,Native
        */
        initUseMethod(animation: IAnimation, geom: Geometry): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class PositionPass extends MaterialPass {
        constructor(materialData: MaterialData);
        /**
        * @language zh_CN
        * @private
        * 初始化 UseMethod。
        * @version Egret 3.0
        * @platform Web,Native
        */
        initUseMethod(animation: IAnimation, geom: Geometry): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class GbufferPass extends MaterialPass {
        constructor(materialData: MaterialData);
        /**
        * @language zh_CN
        * @private
        * 初始化 UseMethod。
        * @version Egret 3.0
        * @platform Web,Native
        */
        initUseMethod(animation: IAnimation, geom: Geometry): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.OutLinePass
    * @classdesc
    * 材质球描边特效
    * @version Egret 3.0
    * @platform Web,Native
    */
    class OutLinePass extends MaterialPass {
        private outline;
        constructor();
        /**
        * @language zh_CN
        * @public
        * @param  val 获取描边线框的现实颜色。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * @public
        * @param  val 设置描边线框的现实颜色。
        * @version Egret 3.0
        * @platform Web,Native
        */
        outLineColor: number;
        /**
        * @language zh_CN
        * @public
        * @param  size 获取描边线框的尺寸大小 从0开始的数值，可以无限大，一般在0~1之间会有意义。
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * @public
        * @param  size 设置描边线框的尺寸大小 从0开始的数值，可以无限大，一般在0~1之间会有意义。
        * @version Egret 3.0
        * @platform Web,Native
        */
        outLineSize: number;
        /**
       * @language zh_CN
       * @private
       * 初始化 UseMethod。
       * @version Egret 3.0
       * @platform Web,Native
       */
        initUseMethod(animation: IAnimation, geom: Geometry): void;
        /**
        * @private
        */
        upload(time: number, delay: number, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D, animation: IAnimation, geometry: Geometry, renderQuen: RenderQuen): void;
        /**
        * @private
        */
        /**
      * @private
      */
        draw(time: number, delay: number, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D, subGeometry: SubGeometry, render: IRender, renderQuen: RenderQuen): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class PickPass extends MaterialPass {
        constructor(materialData: MaterialData);
        initUseMethod(animation: IAnimation, geom: Geometry): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    enum PassType {
        diffusePass = 0,
        colorPass = 1,
        normalPass = 2,
        shadowPass = 3,
        lightPass = 4,
        matCapPass = 5,
        depthPass_8 = 6,
        depthPass_32 = 7,
        CubePass = 8,
        Gbuffer = 9,
        PickPass = 10,
        OutLinePass = 11,
        position = 12,
    }
    /**
    * @private
    */
    class PassUtil {
        static PassAuto: boolean[];
        static CreatPass(pass: PassType, materialData: MaterialData): MaterialPass[];
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.MaterialBase
    * @classdesc
    * 材质球共有的基础类型，封装了材质球共有的基础数据设置方法。</p>
    * 提供控制模型渲染的效果
    * 比如：
    * 默认贴图、法线贴图、高光贴图、
    * 裁剪模式、渲染方式等内容
    * 不同的渲染通道pass。</p>
    * @version Egret 3.0
    * @platform Web,Native
    */
    class MaterialBase {
        /**
         * @language zh_CN
         * @private
         * @version Egret 3.0
         * @platform Web,Native
         */
        passes: {
            [pass: number]: MaterialPass[];
        };
        /**
         * @language zh_CN
         * @private
         * @version Egret 3.0
         * @platform Web,Native
         */
        materialData: MaterialData;
        private _lightGroup;
        /**
        * @language zh_CN
        * @class egret3d.MaterialBase
        * @classdesc
        * TerrainMaterial,TextureMaterial 的基类。</p>
        * 材质球共有的基础类型，封装了材质球共有的基础数据设置方法。</p>
        * 不同的渲染通道pass。</p>
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(materialData?: MaterialData);
        /**
         * @language zh_CN
         * @private
         * @version Egret 3.0
         * @platform Web,Native
         */
        setData(data: MaterialData): void;
        /**
         * @language zh_CN
         * @private
         * @version Egret 3.0
         * @platform Web,Native
         */
        getData(): MaterialData;
        protected initPass(): void;
        /**
         * @language zh_CN
         * 获取材质球接受的灯光组。
         * @returns LightGroup 灯光组
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置材质 lightGroup 。
         * 设置材质球接受的灯光组。
         * @param lightGroup LightGroup
         * @version Egret 3.0
         * @platform Web,Native
         */
        lightGroup: LightGroup;
        /**
        * @language zh_CN
        * 返回深度测试
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 设置材质 shadowMapTexture 。
         * 设置材质球的阴影贴图。
         * @param texture ITexture
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
        * @language zh_CN
        * 返回材质 shadowMapTexture。
        * 返回材质球的阴影贴图。
        * @returns ITexture 阴影贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 设置是否开启深度测试
         * @param bool 是否开启深度测试
         * @version Egret 3.0
         * @platform Web,Native
         */
        depth: boolean;
        /**
        * @language zh_CN
        * 返回深度写入开关
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置深度写入开关
        * @version Egret 3.0
        * @platform Web,Native
        */
        depthWrite: boolean;
        /**
        * @language zh_CN
        * 返回深度测试方式
        * @param texture ITexture
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 设置是否开启深度测试方式
         * @param v 模式
         * @version Egret 3.0
         * @platform Web,Native
         */
        depthMode: number;
        /**
        * @language zh_CN
        * 返回材质 diffuseTexture。
        * 返回材质球的漫反射贴图。
        * @returns ITexture 漫反射贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 设置材质 diffuseTexture 。
         * 设置材质球的漫反射贴图。
         * @param texture ITexture
         * @version Egret 3.0
         * @platform Web,Native
         */
        diffuseTexture: ITexture;
        /**
        * @language zh_CN
        * 返回材质 diffuseTexture3D
        * @returns CubeTexture 漫反射贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置材质 diffuseTexture3D
        * @param texture CubeTexutre
        * @version Egret 3.0
        * @platform Web,Native
        */
        diffuseTexture3D: CubeTexture;
        /**
         * @language zh_CN
         * 得到材质球的凹凸法线贴图。
         * @returns ITexture
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置材质 normalTexture 。
         * 设置材质球的凹凸法线贴图。
         * @param texture {TextureBase}
         * @version Egret 3.0
         * @platform Web,Native
         */
        normalTexture: ITexture;
        protected passInvalid(passType: PassType): void;
        /**
        * @language zh_CN
        * 得到材质球特殊光效贴图。
        * @returns ITexture
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
          * @language zh_CN
          * 设置材质 matcapTexture 。
          * 设置材质球特殊光效算法。
          * @param texture {TextureBase}
          * @version Egret 3.0
          * @platform Web,Native
          */
        matcapTexture: ITexture;
        /**
         * @language zh_CN
         * 得到材质球的高光贴图。
         * @returns ITexture
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置材质 specularTexture 。
         * 设置材质球的高光贴图。
         * @param texture {TextureBase}
         * @version Egret 3.0
         * @platform Web,Native
         */
        specularTexture: ITexture;
        /**
        * @language zh_CN
        * 设置模型渲染模式。模型可以以顶点的方式渲染，线框渲染（会需要特定模型），三角形渲染
        * DrawMode.POINTS
        * DrawMode.LINES
        * DrawMode.TRIANGLES
        * @default DrawMode.TRIANGLES
        * @see egret3d.DrawMode
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置模型渲染模式。模型可以以顶点的方式渲染，线框渲染（会需要特定模型），三角形渲染
        * DrawMode.POINTS
        * rawMode.LINES
        * DrawMode.TRIANGLES
        * @default DrawMode.TRIANGLES
        * @version Egret 3.0
        * @platform Web,Native
        */
        drawMode: number;
        /**
        * @language zh_CN
        * 获取模型渲染模式。模型渲染中，带透明贴图的 去除不渲染透明透明部分的阀值
        * 取值范围 0 - 1
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置模型渲染模式。模型渲染中，带透明贴图的 去除不渲染透明透明部分的阀值
        * 取值范围 0 - 1
        * @version Egret 3.0
        * @platform Web,Native
        */
        cutAlpha: number;
        /**
        * @language zh_CN
        * 获取材质 diffuseColor
        * @returns number 材质 diffuseColor
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置材质 diffuseColor。
        * 设置 16 进制的漫反射颜色
        * @param color {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        diffuseColor: number;
        /**
        * @language zh_CN
        * 获取材质 ambientColor
        * @returns number 材质 ambientColor
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置材质 ambientColor。
        * 设置 16 进制的环境光颜色
        * @param color {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        ambientColor: number;
        /**
        * @language zh_CN
        * 获取材质 specularColor
        * @returns number 材质 specularColor
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置材质 specularColor。
        * 设置 16 进制的镜面光反射颜色
        * @param color {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        specularColor: number;
        /**
        * @language zh_CN
        * 获取材质 tintColor
        * @returns number 材质 tintColor
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置材质色相。
        * 设置 16 进制的色相颜色
        * @param color {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        tintColor: number;
        /**
         * @language zh_CN
         * 返回材质 alpha 值。
         * 返回 alpha 颜色
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置材质 alpha 值。
         * 设置 材质球的透明度，如果透明度小于1会自动启用 alphablending
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        alpha: number;
        /**
         * @language zh_CN
         * 返回 alphaBlending 颜色
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
       * @language zh_CN
       * 设置材质 的alphaBlending 值。
       * 设置 材质球的的alpha是否进行深度排序
       * @param value {Number}
       * @version Egret 3.0
       * @platform Web,Native
       */
        alphaBlending: boolean;
        /**
         * @language zh_CN
         * 返回材质 specularLevel 值。
         * 返回材质 材质球的高光强度
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置材质 specularLevel 值。
         * 设置材质球的材质球的高光强度
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        specularLevel: number;
        /**
         * @language zh_CN
         * 返回材质球的镜面平滑程度值。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置材质 gloss 值。
         * 设置材质 镜面平滑程度值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        gloss: number;
        /**
* @language zh_CN
* 设置材质法线贴图的Y轴朝向
* 美术的规范各不统一，轴向不一样，需要调整
* @param value {Number}
* @version Egret 3.0
* @platform Web,Native
*/
        /**
        * @language zh_CN
        * 设置材质法线贴图的Y轴朝向
        * 美术的规范各不统一，轴向不一样，需要调整
        * @param value {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        normalDir: number;
        /**
         * @language zh_CN
         * 返回材质的gamma值。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
       * @language zh_CN
       * 矫正材质的gamma值。
       * 调整颜色的饱和对比度。
       * @param value {Number}
       * @version Egret 3.0
       * @platform Web,Native
       */
        gamma: number;
        refraction: number;
        refractionintensity: number;
        /**
        * @language zh_CN
        * 获取映射贴图UV坐标，区域，用uvRectangle 的方式映射
        * @returns rect Rectangle
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 映射贴图UV坐标，设置此材质要显示使用贴图的区域，用uvRectangle 的方式映射
        * @param rect Rectangle
        * @version Egret 3.0
        * @platform Web,Native
        */
        uvRectangle: Rectangle;
        /**
         * @private
         * @language zh_CN
         * 设置材质 ambientPower 值。
         * 设置材质 环境光颜色的强度 值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        diffusePass: DiffusePass;
        /**
         * @language zh_CN
         * 设置材质 ambientPower 值。
         * 设置材质 环境光颜色的强度 值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回材质 ambientPower 值。
         * 返回材质 环境光颜色的强度 值。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置材质 diffusePower 值。
         * 设置材质 漫反射颜色的强度 值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回材质 diffusePower 值。
         * 返回材质 漫反射颜色的强度 值。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置材质 normalPower 值。
         * 设置材质 法线的强度 值。
         * @param value {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回材质 normalPower 值。
         * 返回材质 法线的强度 值。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /** m
        * @language zh_CN
        * 引擎内部生成pass渲染通道
        * 返回材质 法线的强度 值。
        * @returns {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        creatPass(pass: PassType): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        addDiffuseChilderPass(pass: MaterialPass): void;
        /**
        * @language zh_CN
        * 使用阴影详细请看 ShadowCast
        * @see egret3d.ShadowCast
        * 返回材质 是否产生阴影 值。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 使用阴影详细请看 ShadowCast
        * @see egret3d.ShadowCast
        * 设置材质 castShadow 值。
        * 设置材质是否接受阴影，设置了之后必须要给 shadowmaping 的方法。
        * @param value {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        castShadow: boolean;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        castPick: boolean;
        /**
        * @language zh_CN
        * 使用阴影详细请看 ShadowCast
        * @see egret3d.ShadowCast
        * 返回材质 acceptShadow 值。
        * 返回材质是否接受阴影，设置了之后必须要给 shadowmaping 的方法。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 使用阴影详细请看 ShadowCast
        * @see egret3d.ShadowCast
        * 设置材质是否是否产生阴影，设置了之后必须要给 shadowmaping 的方法。
        * @param value {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        acceptShadow: boolean;
        /**
        * @language zh_CN
        * 返回材质 阴影颜色
        * @returns number 阴影颜色
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 阴影颜色
        * @param color 0xffffff
        * @version Egret 3.0
        * @platform Web,Native
        */
        shadowColor: number;
        /**
        * @language zh_CN
        * @private
        * 返回材质 阴影offset
        * @returns number 阴影offset
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * @private
        * 设置 阴影offset
        * @param offset
        * @version Egret 3.0
        * @platform Web,Native
        */
        shadowOffset: number;
        /**
        * @language zh_CN
        * 返回材质 repeat 值。
        * 返回材质 是否进行纹理重复采样的方式开关。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 设置材质 repeat 值。
         * 设置材质 是否进行纹理重复采样的方式开关。
         * @param value {boolean}
         * @version Egret 3.0
         * @platform Web,Native
         */
        repeat: boolean;
        /**
        * @language zh_CN
        * 返回材质 bothside 值。
        * 返回是否显示双面的开关。
        * @returns {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置材质 bothside 值。
        * 设置材质是否显示双面的开关。
        * @param value {boolean}
        * @version Egret 3.0
        * @platform Web,Native
        */
        bothside: boolean;
        /**
         * @language zh_CN
         * 返回 cull 模式。
         * @returns {Number}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
        * @language zh_CN
        * 设置 cull 模式 正面渲染三角形或者背面渲染三角形。
        * @see egret3d.ContextConfig.BACK 裁剪反面进行正面渲染
        * @see egret3d.ContextConfig.FRONT 裁剪正面进行反面渲染
        * @param value {Number}
        * @version Egret 3.0
        * @platform Web,Native
        */
        cullMode: number;
        /**
        * @language zh_CN
        * 设置材质 blendMode 值。
        * 设置材质球的 混合模式可以参照 blendmode 中的值
        * @see egret3d.BlendMode
        * @param value {BlendMode}
        * @version Egret 3.0
        * @platform Web,Native
        */
        blendMode: BlendMode;
        /**
        * @language zh_CN
        * 获取点的大小
        * @returns number  点的大小
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置点的大小
        * 只有 DrawMode.POINTS 渲染模式才能有作用
        * @param value  点的大小
        * @version Egret 3.0
        * @platform Web,Native
        */
        pointSize: number;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        disposePass(passType: PassType): void;
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        renderXRayPass(): void;
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        renderOutlinePass(): void;
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        renderNormalPass(): void;
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        renderDepthPass(): void;
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        renderPositionPass(): void;
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        renderUVPass(): void;
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        renderScendUVPass(): void;
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        renderVertexColorPass(): void;
        /**
         * @language zh_CN
         * @private
         * @param value {BlendMode}
         * @version Egret 3.0
         * @platform Web,Native
         */
        renderLightingPass(): void;
        /**
        * @private
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class ColorMaterial extends MaterialBase {
        constructor(color?: number);
        protected initMatPass(): void;
        color: number;
        alpha: number;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.TextureMaterial
    * @classdesc
    * 纹理材质。
    * 标准的贴图材质球，可以设置三种贴图， diffuse ， normal ， speclar 贴图
    * 材质球中默认不设置纹理，显示的黑白棋盘格
    * @version Egret 3.0
    * @platform Web,Native
    */
    class TextureMaterial extends MaterialBase {
        /**
        * @language zh_CN
        * 创建一个新的 TextureMaterial 对象。
        * @param texture 用来渲染的贴图，默认会给出一张棋盘格贴图
        * @param materialData 材质数据信息，可以不指定
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(texture?: ITexture, materialData?: MaterialData);
        protected initMatPass(): void;
        /**
         * @language zh_CN
         * 克隆方法。
         * 将材质球克隆一份，公用shader着色器和贴图，不公用参数
         * @returns {TextureMaterial}
         * @version Egret 3.0
         * @platform Web,Native
         */
        clone(): TextureMaterial;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.TextureMaterial
    * @classdesc
    * 纹理材质。
    * 标准的贴图材质球，可以设置三种贴图， diffuse ， normal ， speclar 贴图
    * 材质球中默认不设置纹理，显示的黑白棋盘格
    * @version Egret 3.0
    * @platform Web,Native
    */
    class FakePBRMaterial extends MaterialBase {
        private _fakePBR;
        /**
         * @language zh_CN
         * 创建一个新的 TextureMaterial 对象。
         * @param texture 用来渲染的贴图，默认会给出一张棋盘格贴图
         * @param materialData 材质数据信息，可以不指定
         * @version Egret 3.0
         * @platform Web,Native
         */
        constructor(texture?: ITexture, materialData?: MaterialData);
        protected initMatPass(): void;
        /**
        * @language zh_CN
        * 设置albedo贴图
        * @param tex 指定的贴图对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        albedoTexture: ITexture;
        /**
        * @language zh_CN
        * 设置normal贴图
        * @param tex 指定的贴图对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        normalTexture: ITexture;
        /**
        * @language zh_CN
        * 设置gloss贴图
        * @param tex 指定的贴图对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        glossTexture: ITexture;
        /**
        * @language zh_CN
        * 设置specular贴图
        * @param tex 指定的贴图对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        specularTexture: ITexture;
        /**
        * @language zh_CN
        * 设置opacity贴图
        * @param tex 指定的贴图对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        opacityTexture: ITexture;
        /**
        * @language zh_CN
        * 设置reflection贴图
        * @param tex 指定的贴图对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        reflectionTexture: ITexture;
        /**
        * @language zh_CN
        * 克隆方法。
        * 将材质球克隆一份，公用shader着色器和贴图，不公用参数
        * @returns {TextureMaterial}
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): TextureMaterial;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.CubeTextureMaterial
    * @classdesc
    * cube纹理材质。
    * 6张无缝连接的贴图，使一个cube的6个面贴上不同的贴图。
    *
    * @version Egret 3.0
    * @platform Web,Native
    */
    class CubeTextureMaterial extends MaterialBase {
        /**
         * @language zh_CN
         * 创建一个新的 CubeTextureMaterial 对象。
         * @param texture {CubeTexture}
         * @param materialData {MaterialData}
         * @version Egret 3.0
         * @platform Web,Native
         */
        constructor(texture?: CubeTexture, materialData?: MaterialData);
        protected initMatPass(): void;
        /**
         * @language zh_CN
         * 克隆方法。
         * 将材质球克隆一份，公用shader着色器和贴图，不公用参数
         * @returns {TextureMaterial}
         * @version Egret 3.0
         * @platform Web,Native
         */
        clone(): CubeTextureMaterial;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.RenderBase
    * @classdesc
    * 渲染器基类
    */
    class RenderBase {
        /**
        * @language zh_CN
        * 渲染器名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        /**
        * @language zh_CN
        * 是否启用当前渲染器，善用当前开关，可以优化渲染性能
        * @version Egret 3.0
        * @platform Web,Native
        */
        enabled: boolean;
        /**
        * @language zh_CN
        * 渲染器使用的相机
        * @version Egret 3.0
        * @platform Web,Native
        */
        camera: Camera3D;
        /**
        * @language zh_CN
        * 渲染器使用的相机
        * @version Egret 3.0
        * @platform Web,Native
        */
        viewPort: Rectangle;
        /**
        * @language zh_CN
        * 如果设置了当前渲染的视图，需要渲染到贴图，此变量才会有值
        * @version Egret 3.0
        * @platform Web,Native
        */
        renderTexture: RenderTexture;
        depthTexture: RenderTexture;
        /**
        * @private
        * @language zh_CN
        */
        protected _pass: number;
        /**
        * @language zh_CN
        * constructor
        */
        constructor();
        /**
        * @public
        * @language zh_CN
        * 渲染器渲染的通道名
        * @classdesc
        */
        /**
        * @public
        * @language zh_CN
        * 渲染器渲染的通道名
        * @classdesc
        */
        pass: PassType;
        setRenderToTexture(width: number, height: number, format?: FrameBufferFormat): void;
        /**
        * @language zh_CN
        * 每帧渲染
        * @param time 当前时间
        * @param delay 每帧间隔时间
        * @param context3D 设备上下文
        * @param collect 渲染对象收集器
        * @param camera 渲染时的相机
        */
        draw(time: number, delay: number, context3D: Context3DProxy, collect: EntityCollect, backViewPort: Rectangle, renderQuen: RenderQuen, posList?: any): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.MultiRender
    * @classdesc
    * default render
    * 把所有需要渲染的对象，依次进行渲染
    * @version Egret 3.0
    * @platform Web,Native
    */
    class MultiRender extends RenderBase {
        /**
        * @language zh_CN
        * constructor
        */
        constructor(pass?: number);
        /**
        * @language zh_CN
        * 把所有需要渲染的对象，依次进行渲染
        * @param time 当前时间
        * @param delay 每帧间隔时间
        * @param context3D 设备上下文
        * @param collect 渲染对象收集器
        * @param camera 渲染时的相机
        */
        draw(time: number, delay: number, context3D: Context3DProxy, collect: EntityCollect, backViewPort: Rectangle, renderQuen: RenderQuen, posList?: any): void;
    }
}
declare module egret3d {
    class RenderQuen {
        mainRender: RenderBase;
        renderDictionary: RenderBase[];
        private renderArray;
        constructor();
        setMainRender(render: RenderBase): void;
        addRender(render: RenderBase, index?: number): void;
        removeRender(render: RenderBase): void;
        draw(time: number, delay: number, context3D: Context3DProxy, collect: EntityCollect, backViewPort: Rectangle, posList?: any): void;
    }
}
declare module egret3d {
    class PostRender extends RenderBase {
        hud: HUD;
        needClean: boolean;
        constructor(vs: string, fs: string);
        setRenderToTexture(width: number, height: number, format?: FrameBufferFormat): void;
        draw(time: number, delay: number, context3D: Context3DProxy, collect: EntityCollect, backViewPort: Rectangle, posList: any): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    enum ValueType {
        float = 0,
        vec2 = 1,
        vec3 = 2,
        vec4 = 3,
    }
    /**
    * @private
    */
    class ValueShape {
        valueType: ValueType;
        calculate(num: number, valueShape?: ValueShape): any;
        dispose(): void;
    }
    /**
    * @private
    */
    class ConstValueShape extends ValueShape {
        valueType: ValueType;
        value: number;
        calculate(num: number): any;
    }
    /**
    * @private
    */
    class ConstRandomValueShape extends ValueShape {
        valueType: ValueType;
        min: number;
        max: number;
        calculate(num: number): any;
    }
    /**
    * @private
    */
    class Vec2ConstValueShape extends ValueShape {
        valueType: ValueType;
        minX: number;
        minY: number;
        calculate(num: number): any;
    }
    /**
    * @private
    */
    class Vec2ConstRandomValueShape extends ValueShape {
        valueType: ValueType;
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        calculate(num: number): any;
    }
    /**
    * @private
    */
    class Vec3ConstValueShape extends ValueShape {
        valueType: ValueType;
        minX: number;
        minY: number;
        minZ: number;
        calculate(num: number): any;
    }
    /**
    * @private
    */
    class Vec3ConstRandomValueShape extends ValueShape {
        valueType: ValueType;
        minX: number;
        minY: number;
        minZ: number;
        maxX: number;
        maxY: number;
        maxZ: number;
        calculate(num: number): any;
    }
    /**
    * @private
    */
    class CubeVector3DValueShape extends ValueShape {
        valueType: ValueType;
        width: number;
        height: number;
        depth: number;
        /**
        * @language zh_CN
        * @param num
        * @param parameters [width, height, depth]
        * @returns Vector3D[]
        */
        calculate(num: number): any;
    }
    /**
    * @private
    */
    class PlaneValueShape extends ValueShape {
        valueType: ValueType;
        width: number;
        height: number;
        calculate(num: number): any;
    }
    /**
    * @private
    * 圆锥体
    */
    class ConeValueShape extends ValueShape {
        valueType: ValueType;
        radius: number;
        angle: number;
        length: number;
        coneType: number;
        origPoint: Vector3D;
        directions: Vector3D[];
        dispose(): void;
        calculate(count: number): any;
        private calculateBase(count);
        private calculateBaseShell(count);
        private calculateVolume(count);
        private calculateVolumeShell(count);
        private static randomPosTop;
        private randomPosAtTop();
        randomDirectionToTop(result: Vector3D): void;
    }
    /**
    * @private
    * 球内分布
    */
    class BallValueShape extends ValueShape {
        valueType: ValueType;
        r: number;
        fromShell: boolean;
        calculate(num: number): any;
        private getPoints1(num, r);
    }
    /**
    * @private
    * 半球内分布
    */
    class HemiBallValueShape extends ValueShape {
        valueType: ValueType;
        r: number;
        fromShell: boolean;
        calculate(num: number): any;
        private getPoints(num, r);
    }
    /**
     * @private
     */
    class Mesh3DValueShape extends ValueShape {
        private static vct1;
        private static vct2;
        private static vct3;
        valueType: ValueType;
        normalList: Vector3D[];
        geometry: Geometry;
        type: number;
        scale: number;
        /**
        * @language zh_CN
        * @param num
        * @param parameters [width, height, depth]
        * @returns Vector3D[]
        */
        calculate(num: number): any;
        private edgePosition(values, num);
        private trianglePosition(values, num);
        private vertexPosition(values, num);
        private static crsVector1;
        private static crsVector2;
        private normal;
        private calcNormal(pt0, pt1, pt2);
    }
    /**
   * @private
   * 外部指定的位置
   */
    class ValueShapeExternal extends ValueShape {
        valueType: ValueType;
        positionList: Vector3D[];
        calculate(num: number, ...parameters: any[]): any;
    }
    /**
    * @private
    */
    class Value {
        private emitter;
        private static _instance;
        constructor();
        static calculate(count: number, valueShape: ValueShape): Array<any>;
        static getValues(count: number, valueType: ValueType, parameters: any): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class ParticleEndNode extends AnimationNode {
        constructor();
        build(geometry: Geometry, count: number): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class ParticleLifeGenerator {
        private _node;
        private _data;
        private _burstsClone;
        planes: Point[];
        loopTime: number;
        circleTime: number;
        private _inputCount;
        private _tiny;
        constructor();
        /**
        * 根据粒子的数据生成生命周期数据。
        * @private
        */
        generator(data: ParticleData): void;
        private burstPlanes(now, next);
        private generatorConst();
        private generatorBezier();
        private tryCreatePlane(now);
        private getLifeTime(time);
        /**
        * 销毁
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    */
    class ParticleTime extends AnimationNode {
        /**
        * 所有单位粒子的生命周期
        */
        private attribute_time;
        private _animationState;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子生命周期数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
       * @language zh_CN
       * 获取时间节点在geometry的顶点数据中偏移量
       * @returns number
       * @version Egret 3.0
       * @platform Web,Native
       */
        offsetIndex: number;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticlePosition
    * @classdesc
    * 粒子位置效果节点，刚出生相对于(0,0,0)位置的偏移量
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticlePosition extends AnimationNode {
        /**
        * @private
        */
        private _positions;
        private _node;
        private _animationState;
        private attribute_offsetPosition;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子发射器形状数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode, arg: any): void;
        /**
        * @language zh_CN
        * 获取位置节点在geometry的顶点数据中偏移量
        * @returns number
        * @version Egret 3.0
        * @platform Web,Native
        */
        offsetIndex: number;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleRotation
    * @classdesc
    * 粒子旋转效果节点(初始角度，直接加成到了顶点位置上，不会在shader上反映出)
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleRotation extends AnimationNode {
        /**
        * @private
        */
        private _animationState;
        private _node;
        private _rotations;
        private attribute_rotationBirth;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子初始旋转数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleScale
    * @classdesc
    * 粒子初始化的尺寸大小
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleScale extends AnimationNode {
        private _scaleValue;
        private _animationState;
        private _node;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子尺寸缩放数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleStartColor
    * @classdesc
    * 粒子起始颜色，用顶点色实现
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleStartColor extends AnimationNode {
        /**
        * @private
        */
        private _node;
        private _animationState;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子发射器起始颜色
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        private bornTime;
        private life;
        private id;
        private timeIndex;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 根据每种出生颜色数据，相应获得一个颜色
        */
        private lerpBirthColor(c1, c2, t);
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleFollowNode
    * @classdesc
    * 粒子跟随效果节点
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleFollowNode extends AnimationNode {
        /**
        * @language zh_CN
        * 跟随目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        private attribute_followPosition;
        private attribute_followRotation;
        private attribute_followScale;
        private _count;
        private _animationState;
        private _lifeCircles;
        private _followRotation;
        private _followScale;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子跟随属性
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @private
        * 强制更新了时间之后，follow数据需要更新
        */
        onAnimTimeChange(): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        private resetCircleData();
        private bornTime;
        private life;
        private id;
        private timeIndex;
        /**
        * @language zh_CN
        * 顶点数据是否需要重新upload
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _verticesDataDirty;
        /**
        * @language zh_CN
        * @param animTime 动画当前时间（单位为ms）
        * @param delay  这一帧的时间跨度
        * @param geometry 几何对象
        * 顶点数据是否需要重新upload
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(animTime: number, delay: number, geometry: Geometry): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityNode
    * @classdesc
    * 粒子速度节点(根据粒子的出生相对位置，以及是否随机方向获得一个三维向量)
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityNode extends AnimationNode {
        private _constValue;
        private attribute_velocity;
        private _node;
        private _animationState;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子移动速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleColorGlobalNode
    * @classdesc
    * 颜色渐变
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleColorGlobalNode extends AnimationNode {
        /**
        * @private
        * 最大支持的颜色变化数量
        */
        private static MaxColor;
        private _colorSegment;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子颜色变化数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * 压缩一个颜色值到一个float中
        */
        private getGpuColor(r, g, b);
        /**
        * @private
        * 将一个颜色通道规范到0-255之间
        */
        private normalizeChannel(value);
        /**
        * @private
        * 将时间规范到0和0.9999之间
        */
        private normalizeTime(value);
        /**
        * @private
        * 合并alpha和time到一个float中
        */
        private getTimeAndAlpha(time, a);
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleSizeGlobalNode
    * @classdesc
    * 粒子缩放变化
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleSizeGlobalNode extends AnimationNode {
        private _node;
        private _floatCompressData1;
        private _floatCompressData2;
        private _sizeScale;
        private attribute_bezierRandomSeed;
        private attribute_scaleSizeConst;
        private _scaleResult;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子初始缩放数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityOverConstNode
    * @classdesc
    * 粒子速度节点叠加(常量的影响方式)
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityOverConstNode extends AnimationNode {
        private _overValue;
        private attribute_velocityOver;
        private _animationState;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子移动速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityOverOneBezierNode
    * @classdesc
    * 粒子速度叠加节点,贝塞尔曲线获得
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityOverOneBezierNode extends AnimationNode {
        private _floatCompressDataX;
        private _floatCompressDataY;
        private _floatCompressDataZ;
        private _node;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子移动速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityOverTwoBezierNode
    * @classdesc
    * 粒子速度叠加节点,双贝塞尔曲线获得
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityOverTwoBezierNode extends AnimationNode {
        private _node;
        private attribute_randomSeed;
        private _floatCompressDataX1;
        private _floatCompressDataY1;
        private _floatCompressDataZ1;
        private _floatCompressDataX2;
        private _floatCompressDataY2;
        private _floatCompressDataZ2;
        private _animationState;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子移动速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityForceConstNode(常量部分)
    * @classdesc
    * 粒子加速度效果节点
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityForceConstNode extends AnimationNode {
        /**
        * @private
        */
        private _node;
        private _forceValue;
        private attribute_accelerationSpeed;
        constructor();
        /**
       * @language zh_CN
       * 填充粒子加速度数据
       * @param data ParticleDataNode 粒子数据来源
       * @version Egret 3.0
       * @platform Web,Native
       */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityForceOneBezierNode
    * @classdesc
    * 粒子加速度叠加节点,贝塞尔曲线获得
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityForceOneBezierNode extends AnimationNode {
        private _floatCompressDataX;
        private _floatCompressDataY;
        private _floatCompressDataZ;
        private _node;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子加速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityForceTwoBezierNode
    * @classdesc
    * 粒子加速度叠加节点,双贝塞尔曲线获得
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityForceTwoBezierNode extends AnimationNode {
        private _node;
        private attribute_randomSeed;
        private _floatCompressDataX1;
        private _floatCompressDataY1;
        private _floatCompressDataZ1;
        private _floatCompressDataX2;
        private _floatCompressDataY2;
        private _floatCompressDataZ2;
        private _animationState;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子加速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityLimitConstNode
    * @classdesc
    * 粒子速度节点限制(常量的影响方式)
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityLimitConstNode extends AnimationNode {
        private attribute_velocityLimit;
        private _animationState;
        private _limitValue;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子移动速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityLimitOneBezierNode
    * @classdesc
    * 粒子速度限制,贝塞尔曲线获得
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityLimitOneBezierNode extends AnimationNode {
        private _floatCompressData;
        private _node;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子移动速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleVelocityLimitTwoBezierNode
    * @classdesc
    * 粒子速度限制,贝塞尔曲线获得
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleVelocityLimitTwoBezierNode extends AnimationNode {
        private _floatCompressData;
        private _floatCompressData2;
        private _node;
        private attribute_randomSeed;
        private _animationState;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子移动速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleRotationConstNode
    * @classdesc
    * 粒子的旋转角速度，当前实现为Z轴的速度（todo：模型粒子或许需要同时有x/y/z三个方向的角速度）    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleRotationConstNode extends AnimationNode {
        private _rotation;
        private attribute_Rotation;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子过程旋转数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleRotationTwoBezierNode
    * @classdesc
    * 粒子的旋转角速度，当前实现为XYZ轴的速度
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleRotationXYZConstNode extends AnimationNode {
        private _rotationSpeed;
        private attribute_rotSpeedXYZ;
        private attribute_rotBirthXYZ;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子过程旋转数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleRotationOneBezierNode
    * @classdesc
    * 粒子z轴旋转角速度（bezier曲线）
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleRotationOneBezierNode extends AnimationNode {
        private _floatCompressData;
        private _node;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子旋转角速度
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleRotationTwoBezierNode
    * @classdesc
    * 粒子z轴旋转角速度（双bezier曲线）
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleRotationTwoBezierNode extends AnimationNode {
        private _floatCompressData;
        private _floatCompressData2;
        private _node;
        private attribute_randomSeed;
        private _animationState;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子移动速度数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleTextureSheetNode
    * @classdesc
    * uv序列帧
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleTextureSheetNode extends AnimationNode {
        /**
        * @private
        * 最大支持的颜色变化数量
        */
        private _sheetData;
        private _animationState;
        private _sheetFloatData;
        private attribute_textureSheetData;
        private _floatCompressData1;
        private _floatCompressData2;
        constructor();
        /**
        * @language zh_CN
        * 填充UV滚动
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode, args: any): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleUVRollNode
    * @classdesc
    * uv滚动
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleUVRollNode extends AnimationNode {
        /**
        * @private
        * 最大支持的颜色变化数量
        */
        private _methodData;
        private _animationState;
        private _uvRollData;
        constructor();
        /**
        * @language zh_CN
        * 填充UV滚动
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode, args: any): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleSubEmitterNode
    * @classdesc
    * 粒子子发射器
    * @see egret3d.AnimationNode
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleSubEmitterNode extends AnimationNode {
        /**
        * @language zh_CN
        * 子发射器
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _animationState;
        private _lifeCircles;
        private _birthPhase;
        private _collisionPhase;
        private _deathPhase;
        private _parent;
        private _empty;
        constructor();
        /**
        * @language zh_CN
        * 填充粒子属性
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode, parent?: any): void;
        /**
        * @language zh_CN
        * 导入新的子粒子发射
        * @param subEmitter ParticleEmitter 子发射器
        * @version Egret 3.0
        * @platform Web,Native
        */
        importSubEmitter(phase: number, subEmitter: ParticleEmitter): void;
        /**
        * @language zh_CN
        * 获取子粒子
        * @param phase 某个阶段的子粒子
        * @returns ParticleEmitter列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        getSubEmitters(phase: number): ParticleEmitter[];
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        private resetCircleData();
        private bornTime;
        private life;
        private id;
        private timeIndex;
        private count;
        private position;
        private ignoreEmit;
        /**
        * @language zh_CN
        * @param animTime 动画当前时间（单位为ms）
        * @param delay  这一帧的时间跨度
        * @param geometry 几何对象
        * 判定是否需要发射子粒子
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(animTime: number, delay: number, geometry: Geometry): void;
        private _added;
        private _orientation;
        private emitParticleAtPhase(phase, pos);
        private recycleParticle();
        private recycleParticleAtPhase(phaseNode);
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @private
        */
        dispose(): void;
    }
    /**
    * @language zh_CN
    * @private
    * @class egret3d.ParticleSubEmitterNodePhase
    * @classdesc
    * 用于子粒子的回收
    * @see egret3d.DoubleArray
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleSubEmitterNodePhase {
        /**
        * @private
        */
        private _phase;
        playing: DoubleArray;
        recycle: DoubleArray;
        constructor(phase: number);
        /**
        * @private
        */
        importSubEmitter(subEmitter: ParticleEmitter): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * 追踪某个固定位置
    */
    class ParticleTrackPositionNode extends AnimationNode {
        private _trackPosition;
        private _toCoords;
        private attribute_trackPosition;
        private _animationState;
        private _count;
        private _verticesDataDirty;
        constructor();
        endCoords: Vector3D[];
        /**
        * @language zh_CN
        * 将粒子的出生位置设置为原结束为止，然后重新设置结束位置
        * @param fromCoords 粒子出生位置列表
        * @param endCoords 粒子目标位置列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        trackPosition(fromCoords: Vector3D[], endCoords: Vector3D[]): void;
        /**
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy): void;
        /**
        * @language zh_CN
        * 填充粒子过程旋转数据
        * @param data ParticleDataNode 粒子数据来源
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNode(data: ParticleDataNode): void;
        /**
        * @language zh_CN
        * 填充顶点数据
        * @param geometry 网格数据
        * @param count 粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        build(geometry: Geometry, count: number): void;
        /**
        * @private
        * 构建结束后需要清理掉临时数据
        */
        afterBuild(): void;
        /**
        * @private
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.ParticleAnimationState
     * @classdesc
     * 粒子动画状态机，继承自IAnimationState。ParticleEmitter会自动创建该对象，不建议使用者在外部自行创建该对象。
     * 该类主要用于维护粒子的顶点数据/shader拼装/辅助初始化Geometry对象；负责在每次update时更新每个节点，和绘制前的基础数据上传工作。
     * @see egret3d.IAnimationState
     * @see egret3d.AnimationNode
     * @see egret3d.Geometry
     * @see egret3d.ParticleData
     * @see egret3d.ParticleAnimation
     * @version Egret 3.0
     * @platform Web,Native
     */
    class ParticleAnimationState implements IAnimationState {
        /**
        * @language zh_CN
        * 动画状态机名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        /**
        * @language zh_CN
        * 动画效果节点列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        animNodes: AnimationNode[];
        /**
        * @private
        * @language zh_CN
        * 动画关键帧列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        keyFrames: AnimationCurve[];
        /**
        * @language zh_CN
        * 新增顶点个数总量
        * @version Egret 3.0
        * @platform Web,Native
        */
        numberOfVertices: number;
        /**
        * @language zh_CN
        * 新增顶点的长度
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertexSizeInBytes: number;
        /**
        * @language zh_CN
        * 动画状态机顶点着色器文件名列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        vertex_shaders: {
            [shaderPhaseType: number]: string[];
        };
        /**
        * @language zh_CN
        * 动画状态机片段着色器文件名列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        fragment_shaders: {
            [shaderPhaseType: number]: string[];
        };
        /**
        * @language zh_CN
        * 对于每个面片而言周期时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        modTime: number;
        /**
        * @language zh_CN
        * 是否反转 1.0是反转 0.0是不反转
        * @version Egret 3.0
        * @platform Web,Native
        */
        reverse: number;
        /**
        * @language zh_CN
        * 跟随的目标，在被使用的情况下，新出生的粒子会使用这个对象的旋转和位置信息。
        * @version Egret 3.0
        * @platform Web,Native
        */
        followTarget: Object3D;
        /**
        * @private
        */
        directionArray: Array<Vector3D>;
        /**
        * @private
        */
        scaleBirthArray: number[];
        /**
        * @private
        */
        private _emitter;
        /**
        * @language zh_CN
        * 构造函数，随着ParticleEmitter的初始化，会创建该ParticleAnimationState对象
        * @param name 粒子动画状态名
        * @param emitter 当前粒子动画主体部分
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(name: string, emitter: ParticleEmitter);
        /**
       * @language zh_CN
       * 获取发射器
       * @returns ParticleEmitter
       * @version Egret 3.0
       * @platform Web,Native
       */
        emitter: ParticleEmitter;
        /**
        * @language zh_CN
        * 添加动画功能节点
        * 添加继承 animNodeBase 功能节点 例如粒子的 加速度功能节点，匀速功能节点
        * @param node 节点对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addNode(node: AnimationNode): void;
        /**
        * @language zh_CN
        * 移除动画功能节点
        * 删除指定的动画功能节点，但是不能动态删除，需要进行 功能重置
        * @param node 节点对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeNode(node: AnimationNode): void;
        /**
        * @private
        * 强制更新了时间之后，follow数据需要更新
        */
        onAnimTimeChange(): void;
        /**
       * @language zh_CN
       * 清空分配好的动画节点
       * @version Egret 3.0
       * @platform Web,Native
       */
        clean(): void;
        private addShaderPhase(sourcePhase, targetPhase);
        /**
        * @private
        * @language zh_CN
        * 计算节点
        */
        calculate(geometry: Geometry): void;
        /**
        * @private
        * @language zh_CN
        */
        fill(geometry: Geometry, maxParticle: number): void;
        /**
        * @private
        * @language zh_CN
        */
        update(animTime: number, delay: number, geometry: Geometry): void;
        private _particleProperty;
        /**
        * @language zh_CN
        * @private
        */
        activeState(time: number, animTime: number, delay: number, animDelay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, camera3D: Camera3D): void;
        /**
        * @language zh_CN
        * 释放所有数据，销毁该对象的内部属性
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @classdesc
    * 粒子动画的实现IAnimation的部分，ParticleEmitter会自动创建该对象，不建议使用者在外部自行创建该对象。
    * 主要用于控制粒子的播放/暂停/更改播放速度/粒子的帧刷新，控制当前粒子所有节点的数据更新等。
    * @see egret3d.IAnimation
    * @see egret3d.EventDispatcher
    * @see egret3d.ParticleData
    * @see egret3d.ParticleAnimationState
    * @class egret3d.ParticleAnimation
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleAnimation extends EventDispatcher implements IAnimation {
        /**
        * @language zh_CN
        * 当前粒子的实例引用，通过该引用可获取对应的ParticleData数据和ParticleEmitter中的geometry数据等
        * @version Egret 3.0
        * @platform Web,Native
        */
        emit: ParticleEmitter;
        /**
        * @language zh_CN
        * 粒子动画状态机
        * @version Egret 3.0
        * @platform Web,Native
        */
        particleAnimationState: ParticleAnimationState;
        /**
        * @language zh_CN
        * 总时间，加成过特效播放速度后的时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        animTime: number;
        private _event3D;
        private _lastAnimTime;
        /**
        * @language zh_CN
        * 帧间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        delay: number;
        /**
        * @language zh_CN
        * 一个完整的动画播放时间周期
        * @version Egret 3.0
        * @platform Web,Native
        */
        loopTime: number;
        /**
        * @language zh_CN
        * 是否为一个循环播放的动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        isLoop: boolean;
        /**
        * @language zh_CN
        * 播放速度，注意0的情况（x/0=?）
        * @version Egret 3.0
        * @platform Web,Native
        */
        speed: number;
        /**
        * @language zh_CN
        * 获取动画列表
        * @returns 动画名称数组
        * @version Egret 3.0
        * @platform Web,Native
        */
        animStateNames: string[];
        /**
        * @language zh_CN
        * 获取动画节点
        * @returns 动画节点数组
        * @version Egret 3.0
        * @platform Web,Native
        */
        animStates: IAnimationState[];
        /**
        * @language zh_CN
        * 是否在播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _play;
        /**
        * @language zh_CN
        * 构造函数，创建一个ParticleAnimation对象
        * @param emitter 该动画对应粒子发射器对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(emitter: ParticleEmitter);
        static Reset: boolean;
        /**
        * @private
        * @language zh_CN
        * 更新调度
        * @param time 总时间
        * @param delay 帧间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, geometry: Geometry): void;
        /**
       * @private
       * @language zh_CN
       * 将粒子信息更新给GPU
       * @param time 当前时间
       * @param delay 当前帧时间
       * @param usage PassUsage
       * @param geometry 子几何信息
       * @param context3DProxy 上下文信息
       * @param modeltransform 模型矩阵
       * @param camera3D 相机
       * @version Egret 3.0
       * @platform Web,Native
       */
        activeState(time: number, delay: number, usage: PassUsage, geometry: SubGeometry, context3DProxy: Context3DProxy, modeltransform: Matrix4_4, camera3D: Camera3D): void;
        /**
        * @language zh_CN
        * 播放该粒子动画，你可以使用stop函数暂停该粒子的播放
        * @param animName 动画名称
        * @param speed 播放速度（默认为1）
        * @param reset 是否从头播放
        * @param prewarm 是否预热
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(animName?: string, speed?: number, reset?: boolean, prewarm?: boolean): void;
        /**
        * @language zh_CN
        * 暂停播放该粒子，你可以在之后使用play函数继续播放该动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 获取当前粒子是否正在播放
        * @returns 是否播放中
        * @version Egret 3.0
        * @platform Web,Native
        */
        isPlay(): boolean;
        /**
        * @language zh_CN
        * 添加动画状态
        * @param animState IAnimationState给改动画添加一个控制器，应该为ParticleAnimationState的实例。
        * @version Egret 3.0
        * @platform Web,Native
        */
        addAnimState(animState: IAnimationState): void;
        /**
        * @language zh_CN
        * 移除一个动画状态机
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeAnimState(animState: IAnimationState): void;
        /**
        * @private
        * @language zh_CN
        * 获取动画列表
        * @returns 动画名称列表
        */
        getAnimList(): string[];
        /**
        * @private
        * @language zh_CN
        * 获取动画节点
        * @returns 动画节点数组
        */
        getAnimNode(): AnimationNode[];
        /**
        * @private
        * @language zh_CN
        * 克隆新的ParticleAnimation对象;
        * @returns 新的ParticleAnimation对象
        */
        clone(): IAnimation;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @private
    * 粒子数据节点类型，加载自粒子数据配置文件后，创建生成
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum ParticleDataNodeType {
        Property = 0,
        Emission = 1,
        Life = 2,
        Shape = 3,
        RotationBirth = 4,
        ScaleBirth = 5,
        Geometry = 6,
        MoveSpeed = 7,
        FollowTarget = 8,
        ScaleSize = 9,
        RotationSpeed = 10,
        ColorOffset = 11,
        TextureSheet = 12,
    }
    /**
    * @language zh_CN
    * 子发射器阶段，枚举出子粒子会在哪个阶段触发创建规则
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum ParticleDataSubEmitterPhase {
        /**
        * @language zh_CN
        * 出生阶段，子粒子会在母粒子的某个单元出生的同时创建，并绑定该粒子单元的位置和旋转信息
        * @version Egret 3.0
        * @platform Web,Native
        */
        BIRTH = 0,
        /**
        * @language zh_CN
        * 碰撞阶段，子粒子会在母粒子的某个单元触发碰撞的同时创建，并绑定该粒子单元的位置和旋转信息（待实现）
        * @version Egret 3.0
        * @platform Web,Native
        */
        COLLISION = 1,
        /**
        * @language zh_CN
        * 死亡阶段，子粒子会在母粒子的某个单元消失的同时创建，并绑定该粒子单元的位置和旋转信息（待实现）
        * @version Egret 3.0
        * @platform Web,Native
        */
        DEATH = 2,
    }
    /**
    * @language zh_CN
    * 粒子数据中，大部分的节点数据都需要指定类型。可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，一共四种。
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum ParticleValueType {
        /**
        * @language zh_CN
        * 常量形式，粒子单元的属性都使用固定的某个数值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Const = 0,
        /**
        * @language zh_CN
        * 两个常量之间随机，粒子单元的属性在指定的两个值之间随机取值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        RandomConst = 1,
        /**
        * @language zh_CN
        * 单贝塞尔曲线，粒子单元的属性在按照一个贝塞尔曲线描述的规律下进行取值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        OneBezier = 2,
        /**
        * @language zh_CN
        * 双贝塞尔曲线，粒子单元的属性在贝塞尔曲线a和贝塞尔曲线b之间取完值va和vb之后，于va和vb之间随机取值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        TwoBezier = 3,
    }
    /**
    * @language zh_CN
    * 枚举出粒子的面向相机模式，粒子的每个单元渲染时候用到的相机对准方式。
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum ParticleRenderModeType {
        /**
        * @language zh_CN
        * 公告板形式：粒子的单元会始终面向相机。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Billboard = 0,
        /**
        * @language zh_CN
        * 指向运动方向的公告板：粒子单元在面向相机的同时，根据自身的运动方向旋转Z轴，使其Z轴旋转指向运动方向。
        * @version Egret 3.0
        * @platform Web,Native
        */
        StretchedBillboard = 1,
        /**
        * @language zh_CN
        * 横向公告板：粒子单元会在X轴方向翻转至水平之后，保持Y方向始终面向相机。
        * @version Egret 3.0
        * @platform Web,Native
        */
        HorizontalBillboard = 2,
        /**
        * @language zh_CN
        * 纵向公告板：粒子单元会在X轴方向翻转至竖直之后，保持Y方向始终面向相机。
        * @version Egret 3.0
        * @platform Web,Native
        */
        VerticalBillboard = 3,
        /**
        * @language zh_CN
        * 模型形式，不接受相机的朝向做任何transform的变换，保持自身的modelMatrix变换。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Mesh = 4,
    }
    /**
    * @language zh_CN
    * 枚举出粒子单元，其出生时候的初始颜色数据源的类型。
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum ParticleBirthColorType {
        /**
        * @language zh_CN
        * 常量形式，所有的粒子单元都使用固定的某个数值。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Const = 0,
        /**
        * @language zh_CN
        * 两个颜色之间随机：粒子单元的某个属性值在指定的两个颜色之间随机采样，作为一个常量使用。
        * @version Egret 3.0
        * @platform Web,Native
        */
        RandomConst = 1,
        /**
        * @language zh_CN
        * 单渐变色，使用一个渐变颜色带控制颜色的变化。
        * @version Egret 3.0
        * @platform Web,Native
        */
        OneGradients = 2,
        /**
        * @language zh_CN
        * 双渐变色，使用两个渐变颜色带，分别去除颜色a和颜色b之后，计算一个a到b之间的随机插值作为最终数据。
        * @version Egret 3.0
        * @platform Web,Native
        */
        TwoGradients = 3,
    }
    /**
    * @language zh_CN
    * 发射器形状，控制粒子单元的出生位置区域。通过这个出生位置，可以相应计算出之后的运动方向。
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum ParticleDataShapeType {
        /**
        * @language zh_CN
        * 点状发射器，所有的粒子单元都从一个固定的点作为出生位置。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Point = 0,
        /**
        * @language zh_CN
        * 立方体状发射器，粒子单元会在这个立方体的表面或者体内随机一个位置出生。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Cube = 1,
        /**
        * @language zh_CN
        * 球形发射器，粒子单元会在这个球体的表面或者体内随机一个位置出生。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Sphere = 2,
        /**
        * @language zh_CN
        * 半球形发射器，粒子单元会在这个半球体的表面或者体内随机一个位置出生。
        * @version Egret 3.0
        * @platform Web,Native
        */
        HemiSphere = 3,
        /**
        * @language zh_CN
        * 筒状发射器，粒子单元会在这个筒状集合体的表面或者体内随机一个位置出生。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Cone = 4,
        /**
        * @language zh_CN
        * 从外部模型获得发射范围，粒子单元会以这个模型为基准，从它的三角面随机一个点，或者随机边上面获取一个随机点，或者随机一个顶点的作为位置出生。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Mesh = 5,
        /**
        * @language zh_CN
        * 外部传入的位置作为粒子发射的范围，粒子单元会从传入的点的列表中，随机取一个位置作为位置出生。
        * @version Egret 3.0
        * @platform Web,Native
        */
        External = 6,
    }
    /**
    * @language zh_CN
    * 外置模型发射器类型，当发射器类型为ParticleDataShapeType.Mesh类型时，需要指定具体使用哪种规则采样出生位置。
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum ParticleMeshShapeType {
        /**
        * @language zh_CN
        * 顶点发射，粒子单元从几何体的顶点上随机一个位置出生。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Vertex = 0,
        /**
        * @language zh_CN
        * 从三角面上获得发射位置，粒子单元从几何体的三角面内随机一个位置出生。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Triangle = 1,
        /**
        * @language zh_CN
        * 从三角形的边上获得发射位置，粒子单元从几何体的一条随机边上，随机一个点作为位置出生。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Edge = 2,
    }
    /**
    * @language zh_CN
    * 发射器类型为圆筒发射器类型：ParticleDataShapeType.Cone，此时对应的在圆筒内具体部位
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum ParticleConeShapeType {
        /**
        * @language zh_CN
        * 底部发射，指定为圆筒发射器的底部圆。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Base = 0,
        /**
        * @language zh_CN
        * 底部边缘发射，指定为圆筒发射器的底部圆的边缘。
        * @version Egret 3.0
        * @platform Web,Native
        */
        BaseShell = 1,
        /**
        * @language zh_CN
        * 体内发射，指定为圆筒发射器的体内。
        * @version Egret 3.0
        * @platform Web,Native
        */
        Volume = 2,
        /**
        * @language zh_CN
        * 体内的边缘发射，指定为圆筒发射器的圆筒的边缘曲面。
        * @version Egret 3.0
        * @platform Web,Native
        */
        VolumeShell = 3,
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleData
    * @classdesc
    * 创建一个粒子，所用到的数据对象，通过UnitLoader加载粒子的配置表，解析之后会自动生成该对象。
    * 或者您可以自己主动创建一个该对象，描述粒子如何生成/变化/消失。
    * @see egret3d.ParticeEmitter
    * @see egret3d.IAnimation
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleData {
        /**
        * @language zh_CN
        * 记录粒子文件的url
        * @version Egret 3.0
        * @platform Web,Native
        */
        fileUrl: string;
        /**
        * @language zh_CN
        * 记录了粒子文件的名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        fileName: string;
        /**
        * @language zh_CN
        * 粒子的基础属性部分数据，如颜色/最大数量限制/是否自启动等。
        * @version Egret 3.0
        * @platform Web,Native
        */
        property: ParticleDataProperty;
        /**
        * @language zh_CN
        * 发射速率相关数据，指定了粒子单元出现的规则，例如1秒内发射的个数和在某个时间点爆发的个数等。
        * @version Egret 3.0
        * @platform Web,Native
        */
        emission: ParticleDataEmission;
        /**
        * @language zh_CN
        * 生命周期相关数据，指定了粒子单元的出生时间和存活时间的分布规则。
        * @version Egret 3.0
        * @platform Web,Native
        */
        life: ParticleDataLife;
        /**
        * @language zh_CN
        * 发射器相关数据，指定了粒子单元如何获得初始位置和运动方向信息。
        * @version Egret 3.0
        * @platform Web,Native
        */
        shape: ParticleDataShape;
        /**
        * @language zh_CN
        * 出生时候的旋转角度数据，指定粒子单元的初始缩放数据，后期会按照一定的规则迭代修改
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationBirth: ParticleDataRotationBirth;
        /**
        * @language zh_CN
        * 出生时候的缩放数据，指定粒子单元的初始缩放数据，后期会按照一定的规则迭代修改
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleBirth: ParticleDataScaleBirth;
        /**
        * @language zh_CN
        * 所采用的模型数据，如果粒子的单元为面片，该数据指定了面片的宽度和高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        geometry: ParticleDataGeometry;
        /**
        * @language zh_CN
        * 运动数据，描述了粒子单元在存活期间内的运动规则。
        * @version Egret 3.0
        * @platform Web,Native
        */
        moveSpeed: ParticleDataMoveSpeed;
        /**
        * @language zh_CN
        * 是否使用局部坐标，如果粒子为全局的粒子，则应该赋予其一个跟随目标，新出生的粒子单元会使用该目标的旋转和位置信息作为出生点。
        * @version Egret 3.0
        * @platform Web,Native
        */
        followTarget: ParticleDataFollowTarget;
        /**
        * @language zh_CN
        * 生命周期内的缩放数据，描述了粒子单元在存活期间的缩放规则
        * @version Egret 3.0
        * @platform Web,Native
        */
        scaleSize: ParticleDataScaleSize;
        /**
        * @language zh_CN
        * 生命周期内的旋转变化信息，描述了粒子单元在存活期间的旋转变化规则
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationSpeed: ParticleDataRotationSpeed;
        /**
        * @language zh_CN
        * 生命周期内的颜色变化数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorOffset: ParticleDataColorOffset;
        /**
        * @language zh_CN
        * uv序列帧数据，描述了粒子单元用到的贴图按照指定的序列帧播放规则进行播放。
        * @version Egret 3.0
        * @platform Web,Native
        */
        textureSheet: ParticleDataTextureSheet;
        /**
        * @language zh_CN
        * 材质球数据，该粒子使用到的材质对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        materialData: UnitMatSphereData;
        /**
        * @language zh_CN
        * 构造函数，该数据一般由粒子的loader加载完文件后创建；您也可以自己手动编码生成，然后使用
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 数据内部进行合法矫正（例如你的粒子的delay为负数，该函数会主动修改delay为0）
        * @version Egret 3.0
        * @platform Web,Native
        */
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataNode
    * @classdesc
    * 粒子节点的基类，描述粒子属性的节点都继承于此类。
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataNode {
        protected _nodeType: number;
        /**
        * @language zh_CN
        * 构造函数，创建一个粒子节点
        * @param node 节点的类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(node: number);
        nodeType: number;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataProperty
    * @classdesc
    * 粒子的基础属性，粒子的必备属性
    * @see egret3d.ColorGradients
    * @see egret3d.ParticleRenderModeType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataProperty extends ParticleDataNode {
        /**
        * @language zh_CN
        * 粒子数量，用于限制同一个时间内允许共存的最大粒子单元数量。
        * @version Egret 3.0
        * @platform Web,Native
        */
        particleCount: number;
        /**
        * @language zh_CN
        * 包围盒数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        bounds: Vector3D;
        /**
        * @language zh_CN
        * 初始颜色属性，有常量/随机常量/单贝塞尔曲线/双贝塞尔曲线四种选择
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorType: number;
        /**
        * @language zh_CN
        * 常量颜色（一），初始颜色为单常量的情况下，使用该数据作为最终数据；<p/>
        * 如果初始颜色类型为随机常量，用colorConst1和colorConst2作为样本，随机插值作为最终数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorConst1: Color;
        /**
        * @language zh_CN
        * 常量颜色（二），如果初始颜色类型为随机常量，用colorConst1和colorConst2作为样本，随机插值作为最终数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorConst2: Color;
        /**
        * @language zh_CN
        * 渐变颜色（一）如果初始颜色类型为单贝塞尔曲线，使用该数据作为取值数据源
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorGradients1: ColorGradients;
        /**
        * @language zh_CN
        * 渐变颜色（二）如果初始颜色类型为双贝塞尔曲线，使用colorGradients1和colorGradients2，随机插值作为取值数据源
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorGradients2: ColorGradients;
        /**
        * @language zh_CN
        * 重力，粒子单元受重力的影响自由落体运动。
        * @version Egret 3.0
        * @platform Web,Native
        */
        gravity: number;
        /**
        * @language zh_CN
        * 是否预热，预热的粒子，在刚开始播放的时候，系统自动分配一个逝去时间，让该粒子看上去已经播放过一阵子，跳过启动播放的开头部分
        * @version Egret 3.0
        * @platform Web,Native
        */
        prewarm: boolean;
        /**
        * @language zh_CN
        * 是否自启动，粒子一旦放入到场景节点中，自动播放该粒子特效
        * @version Egret 3.0
        * @platform Web,Native
        */
        playOnAwake: boolean;
        /**
        * @language zh_CN
        * 旋转信息，粒子模型的旋转数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotation: Vector3D;
        /**
        * @language zh_CN
        * 缩放信息，粒子模型的缩放数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        scale: Vector3D;
        /**
        * @language zh_CN
        * 位置信息，粒子模型的位置数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        position: Vector3D;
        /**
        * @language zh_CN
        * 渲染排序参数，修改这个属性会导致粒子渲染的先后顺序，数据越大，越优先渲染
        * @version Egret 3.0
        * @platform Web,Native
        */
        sortingFudge: number;
        /**
        * @language zh_CN
        * 粒子的每个单元渲染时候用到的相机对准方式，默认为公告板模式，请参照ParticleRenderModeType的其他枚举类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        renderMode: number;
        /**
        * @private
        * @language zh_CN
        * cameraScale
        * @version Egret 3.0
        * @platform Web,Native
        */
        cameraScale: number;
        /**
       * @language zh_CN
       * 运动加成缩放，速度越大，当前拉长的系数会越大
       * @version Egret 3.0
       * @platform Web,Native
       */
        speedScale: number;
        /**
        * @language zh_CN
        * 长度缩放，数值越大，粒子被拉长的尺度越大
        * @version Egret 3.0
        * @platform Web,Native
        */
        lengthScale: number;
        /**
        * @language zh_CN
        * 用到的外部模型文件
        * @version Egret 3.0
        * @platform Web,Native
        */
        meshFile: string;
        /**
        * @language zh_CN
        * 用到的外部模型解析后的数据对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        geometry: Geometry;
        /**
        * @language zh_CN
        * 最后停留在最大生命值的位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        stayAtEnd: boolean;
        /**
        * @language zh_CN
        * 是否为跟踪目标位置的粒子，跟踪的粒子单元，在出生的时候，会使用其绑定跟踪目标的位置和旋转数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        trackPosition: boolean;
        /**
       * @language zh_CN
       * 构造函数，创建一个ParticleDataProperty
       * @version Egret 3.0
       * @platform Web,Native
       */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataEmission
    * @classdesc
    * 发射速率相关数据，指定了粒子单元出现的规则，例如1秒内发射的个数和在某个时间点爆发的个数等。
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataEmission extends ParticleDataNode {
        /**
        * @language zh_CN
        * 指定粒子单元按照每秒发射的出来的速度，如果是0，则不会发射粒子
        * 两外，bursts里面也可以设定发射粒子请参照egret3d.ParticleDataEmission.bursts;
        * @version Egret 3.0
        * @platform Web,Native
        */
        rate: number;
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 粒子爆发的数据，[(1,10),(2,5)...]代表在1s的时候爆发10个，在2s的时候爆发5个，以此类推
        * @version Egret 3.0
        * @platform Web,Native
        */
        bursts: Array<Point>;
        /**
        * @language zh_CN
        * 发射速率指定为单贝塞尔曲线时候，用到的贝塞尔曲线数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier: BezierData;
        /**
       * @language zh_CN
       * 构造函数，创建一个ParticleDataEmission对象
       * @version Egret 3.0
       * @platform Web,Native
       */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataLife
    * @classdesc
    * 粒子生命周期数据，指定粒子单元出生后的存活时间，以及每个粒子单元存活时间各自不同的规则
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataLife extends ParticleDataNode {
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最大值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最小值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: number;
        /**
        * @language zh_CN
        * 粒子单元指定为单贝塞尔曲线/双贝塞尔曲线用到时，用到的曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier1: BezierData;
        /**
        * @language zh_CN
        * 粒子单元指定双贝塞尔曲线用到时，用到的曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier2: BezierData;
        /**
        * @language zh_CN
        * 发射器存活时间，如果是loop粒子，该参数不一定生效
        * @version Egret 3.0
        * @platform Web,Native
        */
        duration: number;
        /**
        * @language zh_CN
        * 粒子发射前的等待时间，在0-delay时间内，不会有粒子单元出生
        * @version Egret 3.0
        * @platform Web,Native
        */
        delay: number;
        /**
        * @language zh_CN
        * 是否循环，循环的粒子会在播放了一段时间之后，自动重复播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        loop: boolean;
        /**
       * @language zh_CN
       * 构造函数，创建一个ParticleDataLife
       * @version Egret 3.0
       * @platform Web,Native
       */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataShape
    * @classdesc
    * 粒子发射器形状，指定粒子的每个单元出生的范围。
    * 一旦确定了某粒子单元的出生点之后，根据各自不同的发射器形状，便能够获取到他的默认运动方向。
    * @see egret3d.ParticleDataShapeType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataShape extends ParticleDataNode {
        /**
        * @language zh_CN
        * 粒子发射器形状类型，请参照egret3d.ParticleDataShapeType
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 是否随机方向发射，制定为随机发射方向的粒子，会自动获取一个在xyz三轴随机取值方向作为默认运动方向。
        * @version Egret 3.0
        * @platform Web,Native
        */
        randomDirection: boolean;
        /**
        * @language zh_CN
        * 粒子单元是否仅仅在发射器的壳位置发射
        * @version Egret 3.0
        * @platform Web,Native
        */
        emitFromShell: boolean;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.Cube类型时，正方体发射器的宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        cubeW: number;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.Cube类型时，正方体发射器的高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        cubeH: number;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.Cube类型时，正方体发射器的深度
        * @version Egret 3.0
        * @platform Web,Native
        */
        cubeD: number;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.Sphere类型时，球型发射器的半径
        * @version Egret 3.0
        * @platform Web,Native
        */
        sphereRadius: number;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.HemiSphere类型时，半球型发射器的半径
        * @version Egret 3.0
        * @platform Web,Native
        */
        hemiSphereRadius: number;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.Cone类型时，具体指定粒子出生的区域，详细请参考egret3d.ParticleConeShapeType
        * @version Egret 3.0
        * @platform Web,Native
        */
        coneType: number;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.Cone类型时，圆筒的长度
        * @version Egret 3.0
        * @platform Web,Native
        */
        coneLength: number;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.Cone类型时，圆筒的底部半径
        * @version Egret 3.0
        * @platform Web,Native
        */
        coneRadius: number;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.Cone类型时，圆筒的角度
        * @version Egret 3.0
        * @platform Web,Native
        */
        coneAngle: number;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.Mesh类型时，mesh类型发射器的子类型，具体请参照egret3d.ParticleMeshShapeType
        * @version Egret 3.0
        * @platform Web,Native
        */
        meshType: number;
        /**
        * @language zh_CN
        * 粒子用到的模型文件url，指定于粒子文件配置表中
        * @version Egret 3.0
        * @platform Web,Native
        */
        meshFile: string;
        /**
        * @language zh_CN
        * 从egret3d.ParticleDataShape.meshFile加载到的文件，取值到的Geometry数据，为mesh类型发射器的模型
        * @version Egret 3.0
        * @platform Web,Native
        */
        geometry: Geometry;
        /**
        * @language zh_CN
        * 指定为ParticleDataShapeType.External类型时，外部指定的发射位置列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        externalPositionList: Vector3D[];
        /**
        * @language zh_CN
        * 构造函数，创建一个ParticleDataShape实例
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataRotationBirth
    * @classdesc
    * 出生时候的旋转角度数据，指定粒子单元的初始缩放数据，后期会按照一定的规则迭代修改
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataRotationBirth extends ParticleDataNode {
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最大值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最小值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: number;
        /**
        * @language zh_CN
        * 类型为单贝塞尔曲线或者双贝塞尔曲线时，用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier1: BezierData;
        /**
        * @language zh_CN
        * 类型为双贝塞尔曲线时，用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier2: BezierData;
        /**
       * @language zh_CN
       * 构造函数，创建一个ParticleDataRotationBirth对象
       * @version Egret 3.0
       * @platform Web,Native
       */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataScaleBirth
    * @classdesc
    * 粒子初始缩放值，指定粒子单元出生时候的默认缩放值，以及在每个粒子之间默认缩放值的变化规律
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataScaleBirth extends ParticleDataNode {
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最大值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最小值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: number;
        /**
        * @language zh_CN
        * 类型为单贝塞尔曲线或者双贝塞尔曲线时，用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier1: BezierData;
        /**
        * @language zh_CN
        * 类型为双贝塞尔曲线时，用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier2: BezierData;
        /**
       * @language zh_CN
       * 构造函数，创建一个ParticleDataScaleBirth对象
       * @version Egret 3.0
       * @platform Web,Native
       */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataGeometry
    * @classdesc
    * 粒子模型，指定粒子单元出生时候的宽度和高度，如果粒子单元的模型为外部模型，该值不生效
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataGeometry extends ParticleDataNode {
        /**
        * @language zh_CN
        * 指定面片的宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        planeW: number;
        /**
        * @language zh_CN
        * 指定面片的高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        planeH: number;
        /**
       * @language zh_CN
       * 构造函数，创建一个ParticleDataGeometry对象
       * @version Egret 3.0
       * @platform Web,Native
       */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataMoveSpeed
    * @classdesc
    * 粒子移动速度，指定粒子单元在存活期内的移动速度变化规律，粒子的运动会叠加有：
    * 1，默认朝向下的默认速度
    * 2，重力
    * 3，速度叠加
    * 4，速度限制
    * 5，外部推力
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataMoveSpeed extends ParticleDataNode {
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最大值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最小值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: number;
        /**
        * @language zh_CN
        * 类型为单贝塞尔曲线或者双贝塞尔曲线时，用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier1: BezierData;
        /**
        * @language zh_CN
        * 类型为双贝塞尔曲线时，用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier2: BezierData;
        /**
        * @language zh_CN
        * 粒子单元受叠加速度数据影响，该数据可能没有
        * @version Egret 3.0
        * @platform Web,Native
        */
        velocityOver: VelocityOverLifeTimeData;
        /**
        * @language zh_CN
        * 粒子单元受速度限制数据影响，该数据可能没有
        * @version Egret 3.0
        * @platform Web,Native
        */
        velocityLimit: VelocityLimitLifeTimeData;
        /**
        * @language zh_CN
        * 粒子单元受外部推力影响，该数据可能没有
        * @version Egret 3.0
        * @platform Web,Native
        */
        velocityForce: VelocityForceLifeTimeData;
        /**
       * @language zh_CN
       * 构造函数，创建一个ParticleDataMoveSpeed对象
       * @version Egret 3.0
       * @platform Web,Native
       */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.VelocityLimitLifeTimeData
    * @classdesc
    * 粒子限速数据，粒子在存活时间内，运动的时候设定一个速度范围
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class VelocityLimitLifeTimeData {
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最大值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最小值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: number;
        /**
        * @language zh_CN
        * 限速抑制值，该值越大，受限制的影响越明显
        * @version Egret 3.0
        * @platform Web,Native
        */
        dampen: number;
        /**
        * @language zh_CN
        * 类型为单贝塞尔曲线或者双贝塞尔曲线时，用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier1: BezierData;
        /**
        * @language zh_CN
        * 类型为双贝塞尔曲线时，用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier2: BezierData;
        /**
        * @language zh_CN
        * 构造函数，创建一个VelocityLimitLifeTimeData对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.VelocityOverLifeTimeData
    * @classdesc
    * 粒子速度叠加，指定粒子单元的运动受到一个叠加速度影响，该叠加速度可以是世界坐标系方向或者本地坐标系两种类型。
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class VelocityOverLifeTimeData {
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 速度叠加范围上限，xyz分别为坐标系的3个朝向，w无效
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: Vector3D;
        /**
        * @language zh_CN
        * 速度叠加范围下限，xyz分别为坐标系的3个朝向，w无效
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: Vector3D;
        /**
        * @language zh_CN
        * 指定叠加速度是世界坐标系方向或者本地坐标系：true为世界坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        worldSpace: boolean;
        /**
        * @language zh_CN
        * 当数据类型为单贝塞尔曲线或者双贝塞尔曲线时，x轴用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        xBezier1: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为单贝塞尔曲线或者双贝塞尔曲线时，y轴用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        yBezier1: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为单贝塞尔曲线或者双贝塞尔曲线时，z轴用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        zBezier1: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为双贝塞尔曲线时，x轴用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        xBezier2: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为双贝塞尔曲线时，y轴用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        yBezier2: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为双贝塞尔曲线时，z轴用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        zBezier2: BezierData;
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.VelocityForceLifeTimeData
    * @classdesc
    * 给予粒子一个作用力，指定粒子单元的运动受到一个外部力影响，该力的作用会持续影响粒子的运动，可以是世界坐标系方向或者本地坐标系两种类型。
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class VelocityForceLifeTimeData {
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 受力范围上限，xyz分别为坐标系的3个朝向，w无效
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: Vector3D;
        /**
        * @language zh_CN
        * 受力范围下限，xyz分别为坐标系的3个朝向，w无效
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: Vector3D;
        /**
        * @language zh_CN
        * 指定外部力是世界坐标系方向或者本地坐标系：true为世界坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        worldSpace: boolean;
        /**
        * @language zh_CN
        * 当数据类型为单贝塞尔曲线或者双贝塞尔曲线时，x轴用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        xBezier1: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为单贝塞尔曲线或者双贝塞尔曲线时，y轴用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        yBezier1: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为单贝塞尔曲线或者双贝塞尔曲线时，z轴用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        zBezier1: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为双贝塞尔曲线时，x轴用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        xBezier2: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为双贝塞尔曲线时，y轴用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        yBezier2: BezierData;
        /**
        * @language zh_CN
        * 当数据类型为双贝塞尔曲线时，z轴用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        zBezier2: BezierData;
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataScaleSize
    * @classdesc
    * 粒子缩放贝塞尔曲线，指定粒子单元的在存活期内，其宽度和高度按照这个贝塞尔曲线的指定的规则变化
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataScaleSize extends ParticleDataNode {
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最大值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最小值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: number;
        /**
        * @language zh_CN
        * 类型为单贝塞尔曲线或者双贝塞尔曲线时，用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier1: BezierData;
        /**
        * @language zh_CN
        * 类型为双贝塞尔曲线时，用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier2: BezierData;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataRotationSpeed
    * @classdesc
    * 粒子角速度，指定粒子单元的在存活期内，按照一定的规则持续旋转
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataRotationSpeed extends ParticleDataNode {
        /**
        * @language zh_CN
        * 角速度上限，xyz分别为坐标系的3个朝向，w无效
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: Vector3D;
        /**
        * @language zh_CN
        * 角速度下限，xyz分别为坐标系的3个朝向，w无效
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: Vector3D;
        /**
        * @language zh_CN
        * 指定数据类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        type: number;
        /**
        * @language zh_CN
        * 类型为单贝塞尔曲线或者双贝塞尔曲线时，用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier1: BezierData;
        /**
        * @language zh_CN
        * 类型为双贝塞尔曲线时，用到的贝塞尔曲线二
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier2: BezierData;
        /**
        * @language zh_CN
        * 是否三轴同时旋转，通常条件下，粒子只有在围绕Z轴做旋转运动
        * @version Egret 3.0
        * @platform Web,Native
        */
        rot3Axis: boolean;
        /**
        * @language zh_CN
        * 构造函数，创建一个ParticleDataRotationSpeed
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataColorOffset
    * @classdesc
    * 粒子颜色变化渐变数据，指定粒子单元的在存活期内，其颜色变化规则所采用的渐变数据源
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataColorOffset extends ParticleDataNode {
        /**
        * @language zh_CN
        * 颜色渐变数据，数据格式为0-1时间范围内，rgba四个通道叠加上对应的颜色。
        * @version Egret 3.0
        * @platform Web,Native
        */
        data: ColorGradients;
        /**
       * @language zh_CN
       * 构造函数
       * @version Egret 3.0
       * @platform Web,Native
       */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataFollowTarget
    * @classdesc
    * 粒子跟随信息，如果绑定有跟随对象，该数据描述了跟随的详细情况，如是否跟随旋转/跟随缩放（位置为默认跟随）
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataFollowTarget extends ParticleDataNode {
        /**
        * @language zh_CN
        * 是否跟随目标的旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        followRotation: boolean;
        /**
        * @language zh_CN
        * 是否跟随目标的缩放
        * @version Egret 3.0
        * @platform Web,Native
        */
        followScale: boolean;
        /**
        * @language zh_CN
        * 构造函数，创建一个ParticleDataFollowTarget实例
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        validate(): void;
    }
    /**
    * @language zh_CN
    * @class egret3d.ParticleDataTextureSheet
    * @classdesc
    * 粒子材质序列帧数据，指定粒子单元的在存活期内，采样贴图时，按照这个数据所指定的规则，进行uv更新变换。
    * @see egret3d.ParticleValueType
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleDataTextureSheet extends ParticleDataNode {
        /**
        * @language zh_CN
        * tileX 序列帧划分为多少列
        * @version Egret 3.0
        * @platform Web,Native
        */
        tileX: number;
        /**
        * @language zh_CN
        * tileY 序列帧划分为多少行
        * @version Egret 3.0
        * @platform Web,Native
        */
        tileY: number;
        /**
        * @language zh_CN
        * whole 范围是否为全部帧
        * @version Egret 3.0
        * @platform Web,Native
        */
        whole: boolean;
        /**
        * @language zh_CN
        * frameType 帧控制类型，可以有单常量/限定范围取值常量/单贝塞尔曲线/双贝塞尔曲线，四种类型。
        * @version Egret 3.0
        * @platform Web,Native
        */
        frameType: number;
        /**
        * @language zh_CN
        * randomRow 是否随机单行，如果为随机单行，则粒子单元会先使用随机取值到一个固定的行号，然后以这个行号作为范围，继续采样序列帧数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        randomRow: boolean;
        /**
        * @language zh_CN
        * row 指定锁定第几行播放，指定单行的条件下，uv序列帧只会在这个指定行内取值，采样序列帧数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        row: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最小值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        min: number;
        /**
        * @language zh_CN
        * 类型为随机常量时，指定的最大值；如果类型为常量时，max和min相等
        * @version Egret 3.0
        * @platform Web,Native
        */
        max: number;
        /**
        * @language zh_CN
        * circles 循环播放次数，最小值为1。该数值越大，会导致uv序列帧跳动越快
        * @version Egret 3.0
        * @platform Web,Native
        */
        circles: number;
        /**
        * @language zh_CN
        * 类型为单贝塞尔曲线或者双贝塞尔曲线时，用到的贝塞尔曲线一
        * @version Egret 3.0
        * @platform Web,Native
        */
        bezier1: BezierData;
        /**
        * @language zh_CN
        * 类型为双贝塞尔曲线时，用到的贝塞尔曲线二
        */
        bezier2: BezierData;
        /**
       * @language zh_CN
       * 构造函数，创建一个ParticleDataTextureSheet对象
       * @version Egret 3.0
       * @platform Web,Native
       */
        constructor();
        validate(): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.ParticleEmitter
    * @classdesc
    * 粒子发射器的主体，继承自Mesh，封装有粒子的各种动画节点在内。<p/>
    * 根据ParticleData中的包含的每个数据节点，初始化对应的AnimationNode，然后填充Geometry数据和拼装shader。<p/>
    * Egret3D的粒子是基于GPU的粒子，初始化完毕之后，不再使用CPU计算每个粒子的相关数据，如位置变化和颜色变化等。<p/>
    * 通过释放CPU的负担获得更高的运行效率，让你的程序有更多的可能性。
    * 在需要大量使用粒子的环境下，你需要考虑到的是渲染面积和drawcall的数量，从这2方面着手来优化你的程序。
    * @see egret3d.Mesh
    * @see egret3d.Geometry
    * @see egret3d.AnimationNode
    * @see egret3d.ParticleAnimation
    * @see egret3d.ParticleAnimationState
    * @includeExample particle/ParticleEmitter.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ParticleEmitter extends Mesh {
        private _timeNode;
        private _positionNode;
        private _geometryShape;
        private _particleAnimation;
        private _particleState;
        private _subEmitterNode;
        private _trackPositionNode;
        private _isEmitterDirty;
        private _userNodes;
        private _data;
        private _externalGeometry;
        private _generator;
        /**
        * @language zh_CN
        * 构造函数，创建一个粒子对象，然后添加至场景中后，使用play函数即可。
        * @param data ParticleData 生成粒子的数据来源，该对象描述了该粒子的大部分信息。
        * @param material 粒子用到的材质球数据。
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(data: ParticleData, material?: MaterialBase);
        /**
        * @language zh_CN
        * 将每个粒子单元的出生位置设置为原结束位置。然后重新设置结束位置，以衔接更新追踪到一个新的目标位置。
        * @param fromCoords 粒子出生位置列表
        * @param endCoords 粒子目标位置列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        trackPosition(fromCoords: Vector3D[], endCoords: Vector3D[]): void;
        /**
        * @language zh_CN
        * 返回上一次跟踪目标点的列表
        * @returns 粒子目标位置列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        trackEndCoords: Vector3D[];
        /**
        * @private
        */
        generator: ParticleLifeGenerator;
        /**
        * @language zh_CN
        * 渲染排序的参数，数值越大，先渲染。<p/>
        * 例如一个火焰的特效可能同时含有高亮部分和灰色烟雾部分，你可以通过修改它们这个数据强制让灰色烟雾部分获得优先绘制权。
        * @version Egret 3.0
        * @platform Web,Native
        */
        drawOrder: number;
        /**
        * @private
        * 添加子发射器
        */
        addSubEmitter(phase: number, subEmitter: ParticleEmitter): void;
        /**
        * @language zh_CN
        * @private
        * 重新构建这个粒子
        * @param geo Geometry 几何数据
        * @param data ParticleData 生成粒子的数据来源
        * @param material 粒子的材质
        * @version Egret 3.0
        * @platform Web,Native
        */
        private buildParticle();
        /**
        * @language zh_CN
        * 根据粒子的配置信息，生成geometry
        * @returns Geometry
        * @version Egret 3.0
        * @platform Web,Native
        */
        private createPlane();
        /**
        * @language zh_CN
        * 获取该粒子的描述数据
        * @returns ParticleData 初始化该粒子用到的数据。
        * @version Egret 3.0
        * @platform Web,Native
        */
        data: ParticleData;
        /**
        * @language zh_CN
        * 获取时间节点
        * @returns ParticleTime 时间节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        timeNode: ParticleTime;
        /**
        * @language zh_CN
        * 获取位置节点，该节点控制每个粒子单元的出生位置，并将数据写入顶点数据中。
        * @returns ParticlePosition 创建粒子单元出生位置的节点。
        * @version Egret 3.0
        * @platform Web,Native
        */
        positionNode: ParticlePosition;
        /**
        * @language zh_CN
        * 获取跟随的目标，全局粒子可能会绑定有一个跟随的目标，获得该目标对象
        * @returns Object3D 跟随的目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置跟随的目标，如果设置了，粒子发射器会跟随目标
        * @param o 粒子发射器会跟随目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        followTarget: Object3D;
        /**
        * @language zh_CN
        * 给粒子发射器添加 粒子效果节点
        * @param node 粒子效果节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        private addAnimNode(node);
        /**
        * @language zh_CN
        * 移除粒子发射器上的效果节点
        * @param node 粒子效果节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        private removeAnimNode(node);
        /**
        * @language zh_CN
        * 播放粒子，你可以之后使用stop函数暂停该特效的动画播放
        * @param speed 粒子播放速度
        * @param reset 是否重置到0位置
        * @param prewarm 是否预热
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(speed?: number, reset?: boolean, prewarm?: boolean): void;
        /**
        * @language zh_CN
        * 暂停播放粒子，你可以再次使用play函数继续该粒子特效播放。
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @private
        */
        protected initialize(): void;
        /**
        * @private
        * 根据ParticleData中的数据初始化
        */
        private initMainAnimNode();
        private initUserAnimNode();
        private initEndNode();
        /**
        * @language zh_CN
        * @private
        * 构建包围盒
        * @version Egret 3.0
        * @platform Web,Native
        */
        private initBoudBox(vector);
        /**
        * @language zh_CN
        * 循环完毕的次数，用于检测是否单个循环结束
        * @returns number 获得这个粒子播放的进度，0-1之间。如果该粒子有循环播放属性，获得的数据无效。
        * @version Egret 3.0
        * @platform Web,Native
        */
        loopProgress: number;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, camera: Camera3D): void;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        copy(other: ParticleEmitter): void;
        /**
        * @language zh_CN
        * 克隆该粒子个粒子，播放信息需要外部去设置（Geometry为全新创建的，ParticleData和MaterialBase数据共享。）
        * @returns ParticleEmitter 克隆后的粒子特效
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): ParticleEmitter;
        /**
        * @language zh_CN
        * 释放所有数据（ParticleData和MaterialBase数据在这个释放过程中，仅仅是移除引用）
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.EffectGroup
    * @classdesc
    * 特效组，可以是粒子也可以是其他动画，如uv滚动等。通过加载特效配置文件，自动创建该对象。用于外部统一控制播放/暂停/以及速度控制。
    * @see egret3d.UnitLoader
    * @includeExample particle/EffectGroup.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class EffectGroup extends Object3D {
        private _animations;
        private _proAnimations;
        private _timeOffset;
        private _isPlay;
        private _animCount;
        private _loop;
        private _loopTime;
        private _animTime;
        private _speed;
        private _prewarm;
        private _noLoopAnims;
        liveTime: number;
        isOriginal: boolean;
        private _event3D;
        private _lastAnimTime;
        /**
        * @language zh_CN
        * 初始化所有动画
        * 初始化之后才能调用播放
        * @param isLoop 是否需要自动循环播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        init(isLoop?: boolean): void;
        private collectAnimations(object, animations);
        /**
        * @language zh_CN
        * 播放动画
        * @param speed 播放速度（默认为1）
        * @param reset 是否从头播放 默认为false
        * @param prewarm 是否预热  默认为false
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(speed?: number, reset?: boolean, prewarm?: boolean): void;
        /**
        * @language zh_CN
        * 设置动画当前的时间
        * @param offset
        * @version Egret 3.0
        * @platform Web,Native
        */
        resetTime(offset?: number): void;
        /**
        * @language zh_CN
        * 设置动画当前的播放速度
        * @return 播放速度值，不能小于等于0
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置动画当前的播放速度
        * @param value 播放速度值，不能小于等于0
        * @version Egret 3.0
        * @platform Web,Native
        */
        speed: number;
        /**
        * @language zh_CN
        * 停止动画播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * 是否正在播放
        * @version Egret 3.0
        * @platform Web,Native
        */
        isPlay(): boolean;
        /**
        * @language zh_CN
        * 当前对象数据更新
        * @private
        * @param camera 当前渲染的摄相机
        * @param time 当前时间
        * @param delay 每帧时间间隔
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, camera: Camera3D): void;
        /**
        * @language zh_CN
        * 销毁
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
        /**
        * @language zh_CN
        * @private
        * @param other copy对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        copy(other: EffectGroup): void;
        /**
        * @language zh_CN
        * @private
        * 克隆当前EffectGroup
        * @returns EffectGroup 克隆后的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): EffectGroup;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        deepClone(): Object3D;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @version Egret 3.0
    * @platform Web,Native
    */
    class PickSystem {
        private static _instance;
        /**
        * @language zh_CN
        *
        * @version Egret 3.0
        * @platform Web,Native
        */
        pickRender: MultiRender;
        piexs: Uint8Array;
        /**
        * @language zh_CN
        * 单例
        * @returns PickSystem 实例返回
        * @version Egret 3.0
        * @platform Web,Native
        */
        static instance: PickSystem;
        enablePick: boolean;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(entityCollect: EntityCollect, camera: Camera3D, time: number, delay: number, viewPort: Rectangle): void;
        private drawOver(entityCollect, camera, time, delay, viewPort);
        getObjectId(x: number, y: number, cavans: Egret3DCanvas, view: View3D): number;
    }
    /**
    * @private
    * @language zh_CN
    * @version Egret 3.0
    * @platform Web,Native
    */
    class EyePick extends EventDispatcher {
        static PICK_PROGRESS: string;
        static PICK_SURE: string;
        static PICK_CANCLE: string;
        useDelay: number;
        private _sceneRay;
        private _selection;
        private _select;
        private _selectSure;
        private _count;
        private _pickProgressEvent;
        private _pickSureEvent;
        private _pickCancleEvent;
        constructor();
        update(view: View3D, time: number, delay: number): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.Scene3D
    * @classdesc
    * 场景的根节点对象
    * 创建场景后会将场景树中的静态物体进行四叉树空间划分
    * 然后会根据 划分好的的空间进行裁剪
    * 在View3D 中的场景节点为 Scene3D
    * @see egret3d.Object3D
    * @see egret3d.Scene3D
    * @includeExample scene/Scene3D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Scene3D extends Object3D {
        private _tree;
        /**
        * @language zh_CN
        * 四叉树根对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _quad;
        constructor();
        /**
        * @language zh_CN
        * 返回剖分场景四叉树根信息
        * @returns QuadRoot
        * @version Egret 3.0
        * @platform Web,Native
        */
        quad: QuadRoot;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        infrustumList(camera: Camera3D): Object3D[];
        /**
        * @private
        * @language zh_CN
        * 根据当前场景的节点分布情况，生成四叉树
        * @version Egret 3.0
        * @platform Web,Native
        */
        createQuadTree(): void;
        /**
        * @private
        * @language zh_CN
        * 遍历一个Object3D及其child节点，如果能够进入视锥体，则放入返回的列表中
        * @param  nodes 用于返回Quad元素结果
        * @param  obj   待遍历的对象
        * @returns Array<IQuadNode>
        * @version Egret 3.0
        * @platform Web,Native
        */
        private collectQuadList(nodes, obj);
        /**
        * @language zh_CN
        * 克隆当前Role
        * @returns Role 克隆后的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Scene3D;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.TreeBase
    * @classdesc
    * @version Egret 3.0
    * @platform Web,Native
    */
    class TreeBase {
        private _root;
        private _searchList;
        constructor(object3D: Object3D);
        infrustumList(camera: Camera3D): Object3D[];
    }
}
declare module egret3d {
    /**
    * @class egret3d.ITexture
    * @classdesc
    * 贴图的接口、
    * 贴图的基类对象 包括各类贴图的公共数据
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ITexture {
        /**
        * @language zh_CN
        * 贴图是否使用 mipmap , mipmap为一个贴图的LOD层级贴图。例如（1024*1024的贴图，往下就会自动生成 512* 512,256*256,128*128,64*64,32*32,16*16,8*8,4*4,2*2,1*1）
        * @version Egret 3.0
        * @platform Web,Native
        */
        useMipmap: boolean;
        /**
        * @language zh_CN
        * 是否平滑插值
        * @version Egret 3.0
        * @platform Web,Native
        */
        smooth: boolean;
        /**
        * @language zh_CN
        * 贴图采样重复方式
        * @version Egret 3.0
        * @platform Web,Native
        */
        repeat: boolean;
        /**
        * @language zh_CN
        * 贴图的宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 贴图的高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @language zh_CN
        * 保存贴图的数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        texture2D: ContextTexture2D;
        /**
        * @language zh_CN
        * 保存贴图的数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        texture3D: ContextTexture3D;
        /**
        * @language zh_CN
        * 是否预乘alpha
        * @version Egret 3.0
        * @platform Web,Native
        */
        premultiply_alpha: number;
        /**
        * @language zh_CN
        * min_filter
        * Context3DProxy.gl.LINEAR
        * Context3DProxy.gl.NEAREST
        * Context3DProxy.gl.LINEAR_MIPMAP_LINEAR
        * Context3DProxy.gl.LINEAR_MIPMAP_NEAREST
        * Context3DProxy.gl.NEAREST_MIPMAP_LINEAR
        * Context3DProxy.gl.NEAREST_MIPMAP_NEAREST
        * @version Egret 3.0
        * @platform Web,Native
        */
        min_filter: number;
        /**
        * @language zh_CN
        * Context3DProxy.gl.LINEAR
        * Context3DProxy.gl.NEAREST
        * Context3DProxy.gl.LINEAR_MIPMAP_LINEAR
        * Context3DProxy.gl.LINEAR_MIPMAP_NEAREST
        * Context3DProxy.gl.NEAREST_MIPMAP_LINEAR
        * Context3DProxy.gl.NEAREST_MIPMAP_NEAREST
        * mag_filter
        * @version Egret 3.0
        * @platform Web,Native
        */
        mag_filter: number;
        /**
        * @language zh_CN
        * Context3DProxy.gl.REPEAT
        * Context3DProxy.gl.MIRRORED_REPEAT
        * Context3DProxy.gl.CLAMP_TO_EDGE
        * wrap_u_filter
        * @version Egret 3.0
        * @platform Web,Native
        */
        wrap_u_filter: number;
        /**
        * @language zh_CN
        * filp_y
        * Context3DProxy.gl.filp_y
        * @version Egret 3.0
        * @platform Web,Native
        */
        filp_y: number;
        /**
        * @language zh_CN
        * wrap_v_filter
        * Context3DProxy.gl.REPEAT
        * Context3DProxy.gl.MIRRORED_REPEAT
        * Context3DProxy.gl.CLAMP_TO_EDGE
        * @version Egret 3.0
        * @platform Web,Native
        */
        wrap_v_filter: number;
        /**
        * @language zh_CN
        * 在gui中的的下标
        * @version Egret 3.0
        * @platform Web,Native
        */
        guiIndex: number;
        /**
        * @language zh_CN
        * uv信息，st坐标和缩放数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        uvRectangle: Rectangle;
        /**
        * @language zh_CN
        * 所属父级贴图，表示当前贴图隶属于某个贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        parentTexture: ITexture;
        /**
       * @language zh_CN
       * 从父级贴图对象中，拷贝一个贴图对象出来
       * @param texture 父级贴图对象
       * @param x 贴图在父级贴图中的x坐标偏移值
       * @param y 贴图在父级贴图中的y坐标偏移值
       * @param width 贴图宽度
       * @param height 贴图高度
       * @version Egret 3.0
       * @platform Web,Native
       */
        copyFromTexture(texture: ITexture, x: number, y: number, width: number, height: number): void;
        /**
        * @language zh_CN
        * 上传贴图数据给GPU
        * @param context3D 图形绘制上下文
        * @version Egret 3.0
        * @platform Web,Native
        */
        upload(context3D: Context3DProxy): void;
        /**
        * @private
        * @language zh_CN
        * 上传贴图数据给GPU
        * @param context3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        hasMipmap: boolean;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        internalFormat: InternalFormat;
        /**
        * @language zh_CN
        * 贴图颜色格式
        * @version Egret 3.0
        * @platform Web,Native
        */
        colorFormat: number;
        /**
        * @language zh_CN
        * 贴图mipmap data
        * @version Egret 3.0
        * @platform Web,Native
        */
        mimapData: Array<MipmapData>;
        /**
        * @language zh_CN
        * 贴图 是否需要按照U的方向镜像
        * @version Egret 3.0
        * @platform Web,Native
        */
        mirroredU: boolean;
        /**
        * @language zh_CN
        * 贴图 是否需要按照V的方向镜像
        * @version Egret 3.0
        * @platform Web,Native
        */
        mirroredV: boolean;
        /**
        * @private
        * @language zh_CN
        * 强制上传贴图数据给GPU，强制要求贴图更新。
        * 在video 贴图类型需要立即改变显卡中的贴图内存
        * @param context3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        uploadForcing(context3D: Context3DProxy): void;
        private ready;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        activeState(context3D: Context3DProxy): void;
        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        readPixels(x: number, y: number, width: number, height: number, format?: number, type?: number, pixels?: ArrayBufferView): any;
    }
}
declare module egret3d {
    /**
    * @class egret3d.ImageTexture
    * @classdesc
    * ImageTexture 类为 图像贴图
    * 加载png、jpg 会返回此对象
    *
    * 图像贴图用于封装 HTMLImageElement（网页图像元素）到引擎内部可使用的Texture2D对象, </p>
    * HTMLImageElement 可通过内嵌HTML文件中获取。</p>
    *
    *
    * 示例：
    * 假设html中已有 &lt;img id="t1" src="xxx.png" /&gt;
    * <pre>
    * var img: HTMLImageElement = <HTMLImageElement>document.getElementById("t1");
    * var imageTexture: egret3d.ImageTexture = new egret3d.ImageTexture(img);
    * </pre>
    * @includeExample texture/ImageTexture.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ImageTexture extends ITexture {
        /**
        * @language zh_CN
        * 贴图数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        imageData: HTMLImageElement;
        /**
        * @language zh_CN
        * 构造函数
        * @param img HTMLImageElement（网页图像元素）
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(img: HTMLImageElement);
        /**
        * @language zh_CN
        * 获取贴图像素宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
       * @language zh_CN
       * 获取贴图像素高度
       * @version Egret 3.0
       * @platform Web,Native
       */
        height: number;
        /**
        * @language zh_CN
        * 上传贴图数据给GPU
        * @param context3D 呈现几何定义图形的上下文
        * @version Egret 3.0
        * @platform Web,Native
        */
        upload(context3D: Context3DProxy): void;
        /**
        * @private
        * @language zh_CN
        * 强制上传贴图数据给GPU，强制要求贴图更新。
        * 在video 贴图类型需要立即改变显卡中的贴图内存
        * @param context3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        uploadForcing(context3D: Context3DProxy): void;
        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
        /**
        * @private
        * @language zh_CN
        * 读取image的byteArray数据
        * @param x 读取的x偏移值
        * @param y 读取的y偏移值
        * @param width  读取的宽度
        * @param height 读取的高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        readPixels(x: number, y: number, width: number, height: number, format?: number, type?: number, pixels?: ArrayBufferView): any;
    }
}
declare module egret3d {
    /**
    * @class egret3d.MimapTexture
    * @classdesc
    * Texture 贴图对象
    * dds tga hdr 几种贴图的格式加载后会生成的对象
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Texture extends ITexture {
        /**
        * @language zh_CN
        * 构造函数
        * 默认是平滑采样
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        upload(context3D: Context3DProxy): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        uploadForcing(context3D: Context3DProxy): void;
    }
}
declare module egret3d {
    /**
    * @class egret3d.CubeTexture
    * @classdesc
    * CubeTexture 类为天空贴图
    *
    * 天空贴图用于Sky类使用，其内部是将6张HTMLImageElement（网页图片元素）封装到CubeTexture对象，CubeTexture为引擎内部使用对象。</p>
    *
    * 示例：</p>
    * 假设html中已有</p>
    <pre>
    <img id="t1" src="image_front.png" />
    <img id="t2" src="image_back.png" />
    <img id="t3" src="image_left.png" />
    <img id="t4" src="image_right.png" />
    <img id="t5" src="image_up.png" />
    <img id="t6" src="image_down.png" />
    </pre>
    使用示例：</p>
    <pre>
    var cubeTexture: CubeTexture = CubeTexture.createCubeTexture(
    <HTMLImageElement>document.getElementById("t1"),
    <HTMLImageElement>document.getElementById("t2"),
    <HTMLImageElement>document.getElementById("t3"),
    <HTMLImageElement>document.getElementById("t4"),
    <HTMLImageElement>document.getElementById("t5"),
    <HTMLImageElement>document.getElementById("t6")
    );
    </pre>
    * @see egret3d.Sky
    * @includeExample texture/CubeTexture.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class CubeTexture extends ITexture {
        /**
        * @language zh_CN
        * image_front 前部ITexture图片元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_front: ContextTexture2D;
        /**
        * @language zh_CN
        * image_back 背部ITexture图片元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_back: ContextTexture2D;
        /**
        * @language zh_CN
        * image_left 左部ITexture图片元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_left: ContextTexture2D;
        /**
        * @language zh_CN
        * image_right 右部ITexture图片元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_right: ContextTexture2D;
        /**
        * @language zh_CN
        * image_up 顶部ITexture图片元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_up: ContextTexture2D;
        /**
        * @language zh_CN
        * image_down 底部ITexture图片元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        image_down: ContextTexture2D;
        /**
        * @language zh_CN
        * 构造函数
        * @param image_front 默认参为null 前部HTMLImageElement图片元素
        * @param image_back 默认参为null 背部HTMLImageElement图片元素
        * @param image_left 默认参为null 左部HTMLImageElement图片元素
        * @param image_right 默认参为null 右部HTMLImageElement图片元素
        * @param image_up 默认参为null 顶部HTMLImageElement图片元素
        * @param image_down 默认参为null 底部HTMLImageElement图片元素
        */
        constructor(image_front?: ContextTexture2D, image_back?: ContextTexture2D, image_left?: ContextTexture2D, image_right?: ContextTexture2D, image_up?: ContextTexture2D, image_down?: ContextTexture2D);
        /**
        * @language zh_CN
        * 创建CubuTexture
        * @param image_front 前部HTMLImageElement图片元素
        * @param image_back 背部HTMLImageElement图片元素
        * @param image_left 左部HTMLImageElement图片元素
        * @param image_right 右部HTMLImageElement图片元素
        * @param image_up 顶部HTMLImageElement图片元素
        * @param image_down 底部HTMLImageElement图片元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        static createCubeTexture(image_front: HTMLImageElement, image_back: HTMLImageElement, image_left: HTMLImageElement, image_right: HTMLImageElement, image_up: HTMLImageElement, image_down: HTMLImageElement): CubeTexture;
        /**
        * @language zh_CN
        * 创建CubuTexture
        * @param image_front 前部ITexture图片元素
        * @param image_back 背部ITexture图片元素
        * @param image_left 左部ITexture图片元素
        * @param image_right 右部ITexture图片元素
        * @param image_up 顶部ITexture图片元素
        * @param image_down 底部ITexture图片元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        static createCubeTextureByImageTexture(image_front: ITexture, image_back: ITexture, image_left: ITexture, image_right: ITexture, image_up: ITexture, image_down: ITexture): CubeTexture;
        /**
        * @language zh_CN
        * 设置CubuTexture
        * @param cubeTexture 源CubuTexture
        * @param image_front 前部ITexture图片元素
        * @param image_back 背部ITexture图片元素
        * @param image_left 左部ITexture图片元素
        * @param image_right 右部ITexture图片元素
        * @param image_up 顶部ITexture图片元素
        * @param image_down 底部ITexture图片元素
        * @version Egret 3.0
        * @platform Web,Native
        */
        static setCubeTexture(cubeTexture: CubeTexture, image_front: ITexture, image_back: ITexture, image_left: ITexture, image_right: ITexture, image_up: ITexture, image_down: ITexture): void;
        /**
        * @private
        * @language zh_CN
        * 上传贴图数据给GPU
        * 更新上传 cube 贴图纹理到GPU 现存中缓存起来
        * @param context3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        upload(context3D: Context3DProxy): void;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        uploadForcing(context3D: Context3DProxy): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.CheckerboardTexture
    * @classdesc
    * CheckerboardTexture 类为 棋盘格纹理类</p>
    *
    * 棋盘格纹理为黑白间隔色块组成的一张纹理，主要用于判别模型UV的正确性，若某模型UV值不正确，其纹理表现必定乱序不规整。</p>
    * 使用示例:</p>
    <pre>
    var material: egret3d.TextureMaterial = new egret3d.TextureMaterial(egret3d.CheckerboardTexture.texture );
    var mesh: egret3d.Mesh = new egret3d.Mesh(new egret3d.CubeGeometry(), material);
    </pre>
    *
    * @includeExample texture/CheckerboardTexture.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class CheckerboardTexture extends ITexture {
        /**
        * @language zh_CN
        * 公用棋盘格实例对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        static texture: CheckerboardTexture;
        private _pixelArray;
        /**
        * @language zh_CN
        * 构造函数
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 上传贴图数据给GPU
        * @param context3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        upload(context3D: Context3DProxy): void;
        private buildCheckerboard();
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        uploadForcing(context3D: Context3DProxy): void;
        /**
        * @language zh_CN
        * 释放接口
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
    }
}
declare module egret3d {
    /**
     * @class egret3d.VideoTexture
     * @classdesc
     * VideoTexture 使用 Video 标签采集 video 视频 </p>
     * VideoTexture 仅且暂时只能在pc上正常使用，移动端需要直接与用户交互才可正常生成播放</p>
     * 需要设置贴图的宽度和高度。必须为2的N次</p>
     * @version Egret 3.0
     * @platform Web,Native
     */
    class VideoTexture extends ITexture {
        private video;
        private canUpdataTexture;
        private context;
        private tmpCanvas;
        /**
        * @language zh_CN
        * 构造函数
        * @param width 贴图宽度 默认参数 256
        * @param height 贴图高度 默认参数 256
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(width?: number, height?: number);
        private loadReady();
        /**
        * @language zh_CN
        * 返回 视频链接
        * 视频的链接地址，只要是h5 支持的格式都支持， 例如:ogv,mp4,avi
        * warning chrom need use url = http://127.0.0.1/resource/video/xxx.mp4
        * @version Egret 3.0
        * @platform Web,Native
        */
        source: string;
        /**
        * @language zh_CN
        * 播放视频
        * 当视频缓冲好之后才能正常播放视频
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(): void;
        /**
        * @language zh_CN
        * 暂停视频
        * 控制视频的播放暂停状态
        * @version Egret 3.0
        * @platform Web,Native
        */
        pause(): void;
        /**
        * @private
        * @language zh_CN
        * 上传贴图数据给GPU
        * 将video的视频数据实时传输到GPU上
        * @param context3D
        */
        upload(context3D: Context3DProxy): void;
        /**
        * @private
        */
        uploadForcing(context3D: Context3DProxy): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.RenderTexture
    * @classdesc
    * 渲染目标贴图
    * @see egret3d.ITexture
    * @version Egret 3.0
    * @platform Web,Native
    */
    class RenderTexture extends ITexture {
        /**
        * @language zh_CN
        * 帧buffer的格式
        * @version Egret 3.0
        * @platform Web,Native
        */
        frameBufferFormat: FrameBufferFormat;
        /**
        * @language zh_CN
        * 构造函数
        * @param width  贴图的宽度 默认参数 默认为512
        * @param height 贴图的高度 默认参数 默认为512
        * @param frameBufferFormat 帧buffer的格式 默认参数 FrameBufferFormat.UNSIGNED_BYTE_RGB
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(width?: number, height?: number, frameBufferFormat?: FrameBufferFormat);
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        upload(context3D: Context3DProxy): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        uploadForcing(context3D: Context3DProxy): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        fillPixels(): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        readPixels(x: number, y: number, width: number, height: number, format?: number, type?: number, pixels?: ArrayBufferView): any;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * 实时阴影渲染需要提供的数据接口。
    * 基于shadow mapping 的阴影算法,
    * 当前阴影只支持方向光,
    * 默认灯光方向是 Vector3D(1, -1, 0), 阴影摄像机为此灯光的子节点,
    * 阴影渲染摄像机的位置为Vector3D(-707, 707, 0),
    * 摄像机 near 1 far 3000  width 2048 height 2048 ,
    * 当渲染阴影的物体超出阴影摄像机的范围阴影将不会渲染阴影,
    * 可以进行调节阴影摄像机的 位置 和 其它参数来进行处理,
    * this.directLight 当前渲染阴影的灯光,
    * this.shadowCamera 当前渲染阴影的摄像机
    * @includeExample shadow/Shadow.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class ShadowCast {
        private _boundBox;
        /**
        * @language zh_CN
        * 开启阴影渲染
        * @version Egret 3.0
        * @platform Web,Native
        */
        enableShadow: boolean;
        /**
        * @language zh_CN
        * @private
        * 阴影贴图的宽
        * @version Egret 3.0
        * @platform Web,Native
        */
        textureSizeWidth: number;
        /**
        * @language zh_CN
        * @private
        * 阴影贴图的高
        * @version Egret 3.0
        * @platform Web,Native
        */
        textureSizeHeight: number;
        /**
        * @language zh_CN
        * 渲染阴影的摄像机
        * @version Egret 3.0
        * @platform Web,Native
        */
        shadowCamera: Camera3D;
        /**
        * @language zh_CN
        * 阴影渲染器
        * @version Egret 3.0
        * @platform Web,Native
        */
        shadowRender: MultiRender;
        /**
        * @language zh_CN
        * 投射阴影的平行光对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        directLight: DirectLight;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(view: View3D);
        /**
        * @language zh_CN
        * 设置阴影贴图的宽度和高度
        * @param width 宽度
        * @param height 高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        setTextureSize(width: number, height: number): void;
        /**
        * @language zh_CN
        * 如需要渲染阴影必须先设置当前阴影灯光，暂支持方向光
        * 灯光中的变换会用于阴影像机的变换
        * 注意:在阴影摄像机视锥中的物体,阴影才会渲染.
        * @param light 阴影灯光
        * @version Egret 3.0
        * @platform Web,Native
        */
        castShadowLight(light: DirectLight): void;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(entityCollect: EntityCollect, time: number, delay: number): void;
        private calculateBoundBox(entityCollect);
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.CameraAnimationManager
    * @classdesc
    * 摄像机管理器
    * 管理所有摄像机动画
    * @see egret3d.Camera3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class CameraManager {
        static instance: CameraManager;
        cameras: Array<Camera3D>;
        /**
        * @language zh_CN
        * 构建一个摄像机管理对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        addCamera(camera: Camera3D): void;
        removeCamera(camera: Camera3D): void;
        /**
        * @language zh_CN
        * 更新所有的摄像机
        * @param time 当前时间
        * @param delay 每帧间隔时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number): void;
    }
}
declare module egret3d {
    /**
    * @language zh_CN
    * @class egret3d.CameraType
    * @classdesc
    * 摄像机类型</p>
    * 不同的摄像机类型，会产生不同的渲染视觉效果。</p>
    * 透视投影 是从某个投射中心将物体投射到单一投影面上所得到的图形。</p>
    * 正交投影 投影线垂直于投影面的投影。</p>
    * orthogonal 和 orthogonalToCenter都是正交投影，只是使用不同的方式创建</p>
    * @version Egret 3.0
    * @platform Web,Native
    */
    enum CameraType {
        /**
        * @language zh_CN
        * 透视投影
        * @version Egret 3.0
        * @platform Web,Native
        */
        perspective = 0,
        /**
        * @language zh_CN
        * 正交投影
        * @see egret3d.Matrix4_4.ortho
        * @version Egret 3.0
        * @platform Web,Native
        */
        orthogonal = 1,
        /**
        * @language zh_CN
        * 正交投影
        * @see egret3d.Matrix4_4.orthoOffCenter
        * @version Egret 3.0
        * @platform Web,Native
        */
        orthogonalToCenter = 2,
    }
    /**
    * @class egret3d.Camera3D
    * @classdesc
    * 相机数据处理，生成3D摄相机。</p>
    * 渲染场景从摄像机视点到缓冲区。</p>
    * 相机分为透视摄像机、正交摄像机。</p>
    * 默认相机朝向是(0, 0, 1) 头朝向是(0, 1, 0)
    *
    * @see egret3d.Matrix4_4
    * @see egret3d.Object3D
    *
    * @includeExample camera/Camera3D.ts
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Camera3D extends Object3D {
        /**
        * @language zh_CN
        * 相机投影矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        projectMatrix: Matrix4_4;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _orthProjectMatrix;
        /**
        * @private
        * @language zh_CN
        * 眼睛矩阵(左，右眼) 实现VR时会用到
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 相机的视椎体，用来检测是否在当前相机可视范围内
         * @version Egret 3.0
         * @platform Web,Native
         */
        frustum: Frustum;
        private _viewPort;
        private _scissorRect;
        private _aspectRatio;
        private _fovY;
        private _near;
        private _far;
        private temp;
        private _lookAtPosition;
        private _up;
        private _cameraType;
        private _cameraMatrixChange;
        private _viewMatrix;
        private _tempQuat;
        private _normalMatrix;
        private _unprojection;
        protected _animation: any;
        protected orthProjectChange: boolean;
        protected _mat: Matrix4_4;
        protected _maxBest: boolean;
        protected _maxBestPoint: Point;
        private _angleVector;
        billboardX: Matrix4_4;
        billboardY: Matrix4_4;
        billboardZ: Matrix4_4;
        billboardXYZ: Matrix4_4;
        /**
        * @language zh_CN
        * constructor
        * @param cameraType 相机类型 默认为 CameraType.perspective 透视相机
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(cameraType?: CameraType);
        /**
        * @language zh_CN
        * 获取相机类型
        * @returns CameraType 相机类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 设置相机类型
         * @param cameraType 相机类型
         * @version Egret 3.0
         * @platform Web,Native
         */
        cameraType: CameraType;
        maxWidthAndHeight: Point;
        /**
        * @language zh_CN
        * 返回相机横纵比
        *
        * @returns number 横纵比
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @private
        * @language zh_CN
        * 打开VR相机
        * @param cameraType 相机类型
        * @param vrType VR类型
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机横纵比
        *
        * @param value 横纵比
        * @version Egret 3.0
        * @platform Web,Native
        */
        aspectRatio: number;
        /**
        * @language zh_CN
        * 返回相机fovY
        *
        * @returns number fovY
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机fovY
        *
        * @param value fovY
        * @version Egret 3.0
        * @platform Web,Native
        */
        fieldOfView: number;
        /**
        * @language zh_CN
        * 返回相机近截面
        *
        * @returns 近截面
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机近截面
        *
        * @param value 近截面
        * @version Egret 3.0
        * @platform Web,Native
        */
        near: number;
        /**
        * @language zh_CN
        * 返回相机远截面
        *
        * @returns 远截面
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置相机远截面
        *
        * @param value 远截面
        * @version Egret 3.0
        * @platform Web,Native
        */
        far: number;
        /**
        * @language zh_CN
        * 返回viewPort
        *
        * @returns Rectangle
        * @version Egret 3.0
        * @platform Web,Native
        */
        viewPort: Rectangle;
        /**
        * @language zh_CN
        * 返回相机视图投影矩阵
        *
        * @returns 视图投影矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        viewProjectionMatrix: Matrix4_4;
        orthProjectionMatrix: Matrix4_4;
        /**
         * @private
         * @language zh_CN
         * @param x number
         * @param y number
         * @param width number
         * @param height number
         * @version Egret 3.0
         * @platform Web,Native
         */
        updateScissorRect(x: number, y: number, width: number, height: number): void;
        /**
        * @language zh_CN
        * 更新视口
        * @param x number
        * @param y number
        * @param width number
        * @param height number
        * @version Egret 3.0
        * @platform Web,Native
        */
        updateViewport(x: number, y: number, width: number, height: number): void;
        /**
        * @language zh_CN
        * 当前对象对视位置 (全局坐标) (修改的是自身的全局变换)
        * @param pos 相机的位置     (全局坐标)
        * @param target 目标的位置  (全局坐标)
        * @param up 向上的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAt(pos: Vector3D, target: Vector3D, up?: Vector3D): void;
        /**
        * @language zh_CN
        * 当前对象对视位置 (本地坐标) (修改的是自身的本地变换)
        * @param pos 相机的位置     (本地坐标)
        * @param target 目标的位置  (本地坐标)
        * @param up 向上的方向
        * @version Egret 3.0
        * @platform Web,Native
        */
        lookAtLocal(pos: Vector3D, target: Vector3D, up?: Vector3D): void;
        protected onMakeTransform(): void;
        protected onUpdateTransform(): void;
        /**
         * @language zh_CN
         *
         * 相机视图矩阵
         * @version Egret 3.0
         * @platform Web,Native
         */
        viewMatrix: Matrix4_4;
        /**
         * @language zh_CN
         *
         * 相机目标点
         * @version Egret 3.0
         * @platform Web,Native
         */
        lookAtPosition: Vector3D;
        private raw;
        /**
        * @private
        * @language zh_CN
        * 更新正交矩阵
        * @version Egret 3.0
        * @platform Web,Native
        */
        updataOrth(target: Matrix4_4): void;
        /**
         * @language zh_CN
         * 检测对象是否在相机视椎体内
         * @param renderItem 需要体测的对象
         * @returns 成功返回true
         * @version Egret 3.0
         * @platform Web,Native
         */
        isVisibleToCamera(renderItem: IRender): boolean;
        /**
        * @private
        * @language zh_CN
        * 增加相机动画
        * @param name 相机动画名字
        * @param ani 相机动画
        * @version Egret 3.0
        * @platform Web,Native
        */
        addAnimation(name: string, ani: CameraAnimationController): void;
        /**
        * @private
        * @language zh_CN
        * 播放某个动画
        * 根据动画名字来播放，指定摄像机，并且控制动画是否循环播放
        * @param name 动画名
        * @param isLoop 是否循环
        * @version Egret 3.0
        * @platform Web,Native
        */
        play(name: string, isLoop?: boolean): void;
        /**
        * @private
        * @language zh_CN
        * 当前对象数据更新
        * @param time 当前时间
        * @param delay 每帧时间间隔
        * @param camera 当前渲染的摄相机
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number, camera: Camera3D): void;
        private _halfw;
        private _halfh;
        /**
        * @language zh_CN
        * 3维坐标转2维屏幕坐标
        * @param n 3维坐标
        * @param target 2维屏幕坐标 默认为null 为null会返回一个新的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        object3DToScreenRay(n: Vector3D, target?: Vector3D): Vector3D;
        /**
        * @language zh_CN
        * 2维屏幕坐标转3维坐标
        * @param n 2维屏幕坐标
        * @param target 3维坐标 默认为null 为null会返回一个新的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        ScreenRayToObject3D(n: Vector3D, target?: Vector3D): Vector3D;
        private v;
        private p;
        private unproject(nX, nY, sZ, target);
        private project(n, target);
        /**
        * @language zh_CN
        * 释放所有数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        dispose(): void;
        /**
        * @language zh_CN
        * 克隆当前Camera3D
        * @returns Camera3D 克隆后的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): Camera3D;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.IQuadNode
    * @classdesc
    * �Ĳ�����һ���ڵ��Ľӿ�
    * @version Egret 3.0
    * @platform Web,Native
    */
    interface IQuadNode {
        /**
        * @language zh_CN
        * ��ʼ����Χ��
        * @version Egret 3.0
        * @platform Web,Native
        */
        initAABB(): void;
        /**
        * @language zh_CN
        * �Ƿ��ýڵ���������
        * @version Egret 3.0
        * @platform Web,Native
        */
        isTriangle: boolean;
        /**
        * @language zh_CN
        * ��Χ������
        * @version Egret 3.0
        * @platform Web,Native
        */
        aabb: QuadAABB;
        /**
        * @language zh_CN
        * ����ȫ�ֵ�quadtree������
        * @version Egret 3.0
        * @platform Web,Native
        */
        calcGlobalQuadAABB(): void;
        /**
        * @language zh_CN
        * ������������ֻ����ͨ��һ�������棬���п��ܴ�����������
        * @version Egret 3.0
        * @platform Web,Native
        */
        plane?: Plane3D;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.QuadAABB
    * @classdesc
    * 用于四叉树的包围盒抽象
    * @version Egret 3.0
    * @platform Web,Native
    */
    class QuadAABB {
        /**
        * @language zh_CN
        * 最小x位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        minPosX: number;
        /**
        * @language zh_CN
        * 最小y位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        minPosY: number;
        /**
        * @language zh_CN
        * 最大x位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        maxPosX: number;
        /**
        * @language zh_CN
        * 最大y位置
        * @version Egret 3.0
        * @platform Web,Native
        */
        maxPosY: number;
        /**
        * @language zh_CN
        * 用于记录quad框选批次
        * @version Egret 3.0
        * @platform Web,Native
        */
        testID: number;
        /**
        * @language zh_CN
        * 所有内部点列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        points: Array<Vector3D>;
        /**
        * @language zh_CN
        * @private
        * 记录该包围盒的全局位移偏移量
        * @version Egret 3.0
        * @platform Web,Native
        */
        private offsetPosition;
        /**
        * @language zh_CN
        * @private
        * 设定一个微小的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        private static TINY;
        /**
        * @language zh_CN
        * constructor
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 将该包围盒设定到以中心点(cx,cy)，纵横距离(sideY,sidex)的范围内
        * @param cx         中心x
        * @param cy         中心y
        * @param sidex      横向范围
        * @param sidey      纵向范围
        * @version Egret 3.0
        * @platform Web,Native
        */
        setAABox(cx: number, cy: number, sideX: number, sideY: number): void;
        /**
        * @language zh_CN
        * 设置偏移量
        * @param vec        偏移坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        setOffset(vec: Vector3D): void;
        /**
        * @language zh_CN
        * 设定包含某个范围
        * @param minX         中心x
        * @param minY         中心y
        * @param maxX      横向范围
        * @param maxY      纵向范围
        * @version Egret 3.0
        * @platform Web,Native
        */
        setContainRect(minX: number, minY: number, maxX: number, maxY: number): void;
        /**
        * @language zh_CN
        * 重置包围盒
        * @version Egret 3.0
        * @platform Web,Native
        */
        clear(): void;
        /**
        * @language zh_CN
        * 添加一个点
        * @param pos         点坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        addPoint(pos: Vector3D): void;
        /**
        * @language zh_CN
        * 获得该对象克隆
        * @version Egret 3.0
        * @platform Web,Native
        */
        clone(): QuadAABB;
        /**
        * @language zh_CN
        * 获得对角线长
        * @version Egret 3.0
        * @platform Web,Native
        */
        radius: number;
        /**
        * @language zh_CN
        * 获得宽
        * @version Egret 3.0
        * @platform Web,Native
        */
        sideX: number;
        /**
        * @language zh_CN
        * 获得高
        * @version Egret 3.0
        * @platform Web,Native
        */
        sideY: number;
        /**
        * @language zh_CN
        * 获得中心点x
        * @version Egret 3.0
        * @platform Web,Native
        */
        centreX: number;
        /**
        * @language zh_CN
        * 获得中心点y
        * @version Egret 3.0
        * @platform Web,Native
        */
        centreY: number;
        /**
        * @language zh_CN
        * 与另外一个包围盒碰撞测试
        * @param box        测试的碰撞对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        overlapTest(box: QuadAABB): boolean;
        /**
        * @language zh_CN
        * 判定某个点在包围盒内
        * @param box        测试的点
        * @version Egret 3.0
        * @platform Web,Native
        */
        isPointInside(pos: Vector3D): boolean;
        /**
        * @language zh_CN
        * 与一条线段碰撞测试
        * @param p1x        线段起点x
        * @param p1y        线段起点y
        * @param p2x        线段终点x
        * @param p2y        线段终点y
        * @version Egret 3.0
        * @platform Web,Native
        */
        isIntersectLineSegment(p1x: number, p1y: number, p2x: number, p2y: number): boolean;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.QuadTree
    * @classdesc
    * 四叉树
    * @version Egret 3.0
    * @platform Web,Native
    */
    class QuadTree {
        /**
        * @language zh_CN
        * 所有节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _cells;
        /**
        * @language zh_CN
        * 根节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _rootCell;
        /**
        * @language zh_CN
        * 节点列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _quadNodes;
        /**
        * @language zh_CN
        * 当前tree的包围盒
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _aabb;
        /**
        * @language zh_CN
        * 碰撞检测用数组
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _cellsToTest;
        /**
        * @language zh_CN
        * 碰撞检测用批次
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _testID;
        /**
        * @language zh_CN
        * constructor
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 根据下标获取node对象
        * @param    idx     下标
        * @version Egret 3.0
        * @platform Web,Native
        */
        getQuadNode(idx: number): IQuadNode;
        /**
        * @language zh_CN
        * 清理
        * @version Egret 3.0
        * @platform Web,Native
        */
        clear(): void;
        /**
        * @language zh_CN
        * 插入一系列node到树中,不build
        * @param    nodes     待初始化的节点列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        initNodes(nodes: Array<IQuadNode>): void;
        /**
        * @language zh_CN
        * 构建四叉树
        * @param    maxNodesPerCell     一个Cell中最多几个三角
        * @param    minCellSize         一个cell单元最小划分到多小
        * @version Egret 3.0
        * @platform Web,Native
        */
        buildQuadTree(maxNodesPerCell: number, minCellSize: number): void;
        /**
        * @language zh_CN
        * 创建子节点的AABox
        * @param    aabb     包围盒
        * @param    id      象限
        * @version Egret 3.0
        * @platform Web,Native
        */
        private createAABox(aabb, id);
        /**
        * @language zh_CN
        * 如果三角型和Cell相交,返回True
        * @param    node     节点
        * @param    cell     四叉树叶子
        * @version Egret 3.0
        * @platform Web,Native
        */
        private doesNodeIntersectCell(node, cell);
        /**
        * @language zh_CN
        * 寻找在某位置上的三角面
        * @param    result     存储节点的数组
        * @param    aabb       包围盒
        * @version Egret 3.0
        * @platform Web,Native
        */
        getNodesIntersectingtAABox(result: Array<number>, aabb: QuadAABB): number;
        /**
        * @language zh_CN
        * 判断点在三角型中
        * @param    x           指定点坐标x
        * @param    y           指定点坐标y
        * @param    triPi1      三角形顶点1
        * @param    triPi2      三角形顶点2
        * @param    triPi3      三角形顶点3
        * @returns  是否包含
        * @version Egret 3.0
        * @platform Web,Native
        */
        private pointInTriangle(x, y, triP1, triP2, triP3);
        /**
        * @language zh_CN
        * 递增批次
        * @version Egret 3.0
        * @platform Web,Native
        */
        private incrementTestCounter();
        /**
        * @language zh_CN
        * 显示quadtree结构
        * @version Egret 3.0
        * @platform Web,Native
        */
        private logDeep;
        private logTree(cellIndex);
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.QuadRoot
    * @classdesc
    * 创建四叉树的根对象。当前只能用于管理场景中静态的Object，
    * @version Egret 3.0
    * @platform Web,Native
    */
    class QuadRoot {
        /**
        * @language zh_CN
        * 一个Cell中最多几个三角
        */
        private _maxNodesPerCell;
        /**
         * @language zh_CN
         * 一个cell单元最小划分到多小
         */
        private _minCellSize;
        /**
         * @language zh_CN
         * 四叉树
         */
        private _quadTree;
        /**
         * @language zh_CN
         * 碰撞到的三角
         */
        private _collisionNodesIdx;
        /**
         * @language zh_CN
         * 碰撞检测用aabb
         */
        private _segBox;
        /**
         * @language zh_CN
         * 存放检测的nodes结果
         */
        private _collisionNodes;
        /**
        * @language zh_CN
        * constructor
        * @param maxNodesPerCell 一个Cell中最多几个节点
        * @param minCellSize 一个cell单元最小划分到多小
        */
        constructor(maxNodesPerCell?: number, minCellSize?: number);
        /**
        * @language zh_CN
        * 创建并构造四叉树
        * @param nodes 需要插入到四叉树中的节点列表
        */
        createQuadTree(nodes: Array<IQuadNode>): void;
        /**
        * @language zh_CN
        * 在设定范围内，框选出一批节点
        * @param minX 框选范围最小x值
        * @param minY 框选范围最小y值
        * @param maxX 框选范围最大x值
        * @param maxY 框选范围最大y值
        * @returns Array<IQuadNode>
        */
        getNodesByAABB(minX: number, minY: number, maxX: number, maxY: number): Array<IQuadNode>;
        /**
        * @language zh_CN
        * 给定一个三维坐标点，获取节点中最为接近的一个三角形
        * @param point 给定的点
        * @param threshold 设定的阈值，超出这个距离则视为放弃
        * @returns IQuadNode
        */
        getTriangleAtPoint(point: Vector3D, threshold?: number): IQuadNode;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.QuadTreeCell
    * @classdesc
    * 四叉树叶子节点
    * @version Egret 3.0
    * @platform Web,Native
    */
    class QuadTreeCell {
        /**
        * @language zh_CN
        * 一个叶子单元最多包含子叶子树4个
        * @version Egret 3.0
        * @platform Web,Native
        */
        static NUM_CHILDREN: number;
        /**
        * @language zh_CN
        * (如果不是leaf)子节点的index, -1表示无子节点
        * @version Egret 3.0
        * @platform Web,Native
        */
        childCellIndices: Array<number>;
        /**
        * @language zh_CN
        * (如果是leaf) 三角面的index
        * @version Egret 3.0
        * @platform Web,Native
        */
        nodeIndices: Array<number>;
        /**
        * @language zh_CN
        * 该节点的包围框
        * @version Egret 3.0
        * @platform Web,Native
        */
        aabb: QuadAABB;
        /**
         * @language zh_CN
         * 该叶子里面含有的顶点信息
         * @version Egret 3.0
         * @platform Web,Native
         */
        points: Array<Vector3D>;
        /**
        * @language zh_CN
        * constructor
        * @param aabox 该叶子的包围盒
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(aabox: QuadAABB);
        /**
        * @language zh_CN
        * Indicates if we contain triangles (if not then we should/might have children)
        * @version Egret 3.0
        * @platform Web,Native
        */
        isLeaf(): boolean;
        /**
        * @language zh_CN
        * 重置该叶子
        * @version Egret 3.0
        * @platform Web,Native
        */
        clear(): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * @class egret3d.DoubleArray
    * @classdesc
    * 利用2个数组实现键值对的数组
    * @version Egret 3.0
    * @platform Web,Native
    */
    class DoubleArray {
        /**
        * @language zh_CN
        * 键队列
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _keys;
        /**
        * @language zh_CN
        * 值队列
        * @version Egret 3.0
        * @platform Web,Native
        */
        private _values;
        /**
        * @language zh_CN
        * constructor
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor();
        /**
        * @language zh_CN
        * 根据键获得下标
        * @param  key（键）
        * @returns 下标
        * @version Egret 3.0
        * @platform Web,Native
        */
        getIndexByKey(key: any): number;
        /**
        * @language zh_CN
        * 根据键获得值
        * @param    key（键）
        * @returns 值
        * @version Egret 3.0
        * @platform Web,Native
        */
        getValueByKey(key: any): any;
        /**
        * @language zh_CN
        * 放入一个键值对
        * @param    key     键
        * @param    value   值
        * @returns           原来的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        put(key: any, value: any): any;
        /**
        * @language zh_CN
        * 移除一个键值对
        * @param    key     键
        * @returns          移除的值
        * @version Egret 3.0
        * @platform Web,Native
        */
        remove(key: any): any;
        /**
        * @language zh_CN
        * 获取值的队列
        * @returns          值的队列
        * @version Egret 3.0
        * @platform Web,Native
        */
        getValues(): Array<any>;
        /**
        * @language zh_CN
        * 获取键的队列
        * @returns          键的队列
        * @version Egret 3.0
        * @platform Web,Native
        */
        getKeys(): Array<any>;
        /**
        * @language zh_CN
        * 重置该哈希表
        * @version Egret 3.0
        * @platform Web,Native
        */
        clear(): void;
    }
}
declare module egret3d {
    class StaticMergeUtil {
        static bacthingMesh(configPasser: UnitConfigParser): Mesh[];
        private static checkMaxBacthing(matID, preNodes);
        private static collectStaticMesh(nodes);
        private static sortByZ(a, b);
        private static batching(matID, nodes);
    }
}
declare module egret3d {
    /**
    * @private
    * @class egret3d.HUD
    * @classdesc
    * HUD直接渲染在屏幕上的一张贴图</p>
    * 可直接指定2维坐标，贴图的宽度和高度。</p>
    * 其底层渲染也是由4个顶点构成，顶点数据结构有位置信息和uv信息。</p>
    * 其所有的HUD对象的顶点信息数据都是共用的。</p>
    * @version Egret 3.0
    * @platform Web,Native
    */
    class HUD {
        private static singleQuadData;
        private static singleQuadIndex;
        private static vertexBytes;
        protected _diffuseTexture: ITexture;
        protected _viewPort: Rectangle;
        protected _rectangle: Rectangle;
        protected _transformMatrix: Matrix4_4;
        protected _change: boolean;
        protected _rotation: Vector3D;
        protected _scale: Vector3D;
        protected _position: Vector3D;
        protected _transformComponents: Vector3D[];
        private _indexBuffer3D;
        private _vertexBuffer3D;
        private _changeTexture;
        private _textureStage;
        private _vertexFormat;
        private _uv_scale;
        /**
        * @language zh_CN
        * 名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        name: string;
        /**
        * @language zh_CN
        * 显示双面的开关。
        * @version Egret 3.0
        * @platform Web,Native
        */
        bothside: boolean;
        /**
        * @language zh_CN
        * cull模式。 正面可见ContextConfig.BACK 背面可见ContextConfig.FRONT
        * @version Egret 3.0
        * @platform Web,Native
        */
        cullMode: number;
        /**
        * @language zh_CN
        * 是否可见
        * @version Egret 3.0
        * @platform Web,Native
        */
        visible: boolean;
        vsShader: string;
        fsShader: string;
        protected _passUsage: PassUsage;
        protected _attList: Array<GLSL.Attribute>;
        uniformData: {
            [key: string]: {
                uniformIndex: any;
                type: number;
                data: number[];
            };
        };
        /**
        * @language zh_CN
        * 创建一个HUD对象
        * @param x 屏幕x坐标 默认值 0
        * @param y 屏幕y坐标 默认值 0
        * @param width hud宽度 默认值 100
        * @param height hud高度 默认值 100
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
        * @language zh_CN
        * 返回HUD的漫反射贴图。
        * @returns ITexture 漫反射贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
         * @language zh_CN
         * 设置HUD的漫反射贴图。
         * @param texture ITexture
         * @version Egret 3.0
         * @platform Web,Native
         */
        diffuseTexture: ITexture;
        /**
        * @language zh_CN
        * 得到x坐标
        * @returns number x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置x坐标
        * @param value x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        x: number;
        /**
        * @language zh_CN
        * 得到y坐标
        * @returns number y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置y坐标
        * @param value y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        y: number;
        /**
        * @language zh_CN
        *  得到HUD的宽度
        * @returns number HUD的宽度宽
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置HUD的宽度
        * @param value HUD宽
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 得到HUD的高度
        * @returns number HUD的高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置HUD的高度
        * @param value HUD高
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @language zh_CN
        * 返回x旋转
        * @returns x旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置x轴旋转。</p>
        * @param value x轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationX: number;
        /**
        * @language zh_CN
        * 返回y旋转
        * @returns y旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置y轴旋转。</p>
        * @param value y轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationY: number;
        /**
        * @language zh_CN
        * 返回z旋转
        * @returns z旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置z轴旋转。</p>
        * @param value z轴旋转
        * @version Egret 3.0
        * @platform Web,Native
        */
        rotationZ: number;
        /**
        * @private
        */
        viewPort: Rectangle;
        /**
        * @private
        */
        /**
        * @private
        */
        uScale: number;
        /**
        * @private
        */
        /**
        * @private
        */
        vScale: number;
        /**
        * @private
        */
        transformMatrix: Matrix4_4;
        protected updateTexture(context: Context3DProxy): void;
        /**
        * @private
        */
        upload(context: Context3DProxy): void;
        /**
        * @private
        */
        draw(contextProxy: Context3DProxy, camera?: Camera3D): void;
    }
}
declare module egret3d {
    /**
     * @private
     */
    class Egret3DPerformance {
        private _entities;
        enable: boolean;
        prefix: string;
        constructor();
        entities: any;
        getFps(): number;
        updateFps(): void;
        getNow(): number;
        getEntity(key: string): any;
        startCounter(key: any, averageRange: any): void;
        endCounter(key: any): void;
    }
}
declare module egret3d {
    class Egret3DInspector {
        updateTime: number;
        private time;
        private performancePanel;
        private collectionPanel;
        constructor();
        show(delay: number, performance: Egret3DPerformance, canvas: Egret3DCanvas): void;
        private _createPerformancePanel();
        private _createCollectionPanel();
        private showPerformancePanel(performance);
        private showCollectionPanel(canvas);
    }
}
declare module egret3d {
    /**
     * @class egret3d.View3D
     * @classdesc
     * 渲染视图。</p>
     * view3D 是整个3D引擎的渲染视口，可以控制渲染窗口的大小，渲染的方式。</p>
     * 可以设置不同的相机 Camera3D。</p>
     * 交换不同的场景元素 Scene3D 。</p>
     * 当前的View3D中会有一个Scene3D的节点和一个Camera3D来进行场景中的渲染。
     * 整个渲染的主循环通过 update  。</p>
     * Engre3DCanvas 中的View3D列表会主动调用View3D的update,加入了Engre3DCanvas中的View3D列表后不需要使用者update
     * @includeExample View3D.ts
     * @see egret3d.Camera3D
     * @see egret3d.Scene3D
     * @see egret3d.Egret3DCanvas
     * @version Egret 3.0
     * @platform Web,Native
     */
    class View3D {
        scissorRect: Rectangle;
        protected _viewPort: Rectangle;
        protected _backColor: Vector3D;
        protected _cleanParmerts: number;
        protected _camera: Camera3D;
        protected _scene: Scene3D;
        protected _entityCollect: EntityCollect;
        protected _backImg: HUD;
        protected _huds: Array<HUD>;
        protected _postList: IPost[];
        protected _postHUD: HUD;
        protected _postProcessing: PostProcessing;
        protected _renderQuen: RenderQuen;
        protected _quadStage: QuadStage;
        protected _shadowCast: ShadowCast;
        sunLight: DirectLight;
        /**
        * @language zh_CN
        * 构建一个view3d对象 如果不给摄像机 内部会创建一个默认的摄像机
        * @param x 视口的屏幕x坐标
        * @param y 视口的屏幕y坐标
        * @param width 视口的屏幕宽度
        * @param height 视口的屏幕高度
        * @param camera 摄像机 默认参数为null，会在内部新建一个CameraType.perspective 类型的Camera3D
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(x: number, y: number, width: number, height: number, camera?: Camera3D);
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        renderQuen: RenderQuen;
        /**
        * @language zh_CN
        * 获取控制阴影实例对象
        * @returns ShadowCast 控制阴影实例对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        shadowCast: ShadowCast;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        post: any[];
        /**
        * @language zh_CN
        * 设置是否清除背景缓冲颜色 和 深度
        * @param cleanColor 是否清除背景缓冲颜色
        * @param cleanDepth 是否清除背景缓冲深度
        * @version Egret 3.0
        * @platform Web,Native
        */
        blender(cleanColor: boolean, cleanDepth: boolean): void;
        /**
        * @language zh_CN
        * 获取view3d背景颜色
        * @returns number 颜色值 a r g b
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置view3d背景颜色
        * @param value  颜色值 a r g b
        * @version Egret 3.0
        * @platform Web,Native
        */
        backColor: number;
        /**
        * @language zh_CN
        * 获取view3d背景贴图
        * @returns ITexture 背景贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置view3d背景贴图
        * @param tex 背景贴图
        * @version Egret 3.0
        * @platform Web,Native
        */
        backImage: ITexture;
        /**
        * @language zh_CN
        * 获取View3d中的渲染摄像机
        * @returns Camera3D 当前View3D的摄像机
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置View3d中的渲染摄像机
        * @param value 当前View3D的摄像机
        * @version Egret 3.0
        * @platform Web,Native
        */
        camera3D: Camera3D;
        /**
        * @language zh_CN
        * 获取View3d中的场景对象
        * @returns Scene3D 场景对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置View3d中的场景对象
        * 当前scene 会被替换  你需要你原来的主摄像机加入当前场景中
        * @param sc 当前View3D的场景对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        scene: Scene3D;
        /**
        * @language zh_CN
        * 获得当前视口的屏幕x坐标
        * @returns number 视口的屏幕x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置当前视口的屏幕x坐标
        * @param x 视口的屏幕x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        x: number;
        /**
        * @language zh_CN
        * 获得当前视口的屏幕y坐标
        * @returns number 视口的屏幕y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置当前视口的屏幕y坐标
        * @param y 视口的屏幕y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        y: number;
        /**
        * @language zh_CN
        * 获取视口的屏幕宽度
        * @returns number 视口的屏幕宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置视口的屏幕宽度
        * @param width 视口的屏幕宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 获取视口的屏幕高度
        * @returns number 视口的屏幕高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置视口的屏幕高度
        * @param width 视口的屏幕高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @language zh_CN
        * 获取视口数据 x y width height
        * @returns Rectangle 视口数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        viewPort: Rectangle;
        /**
        * @private
        * @language zh_CN
        * 获取View3D的数据收集对象
        * @returns EntityCollect 数据收集对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        entityCollect: EntityCollect;
        /**
        * @private
        * @language zh_CN
        * 获取gui stage
        * @returns QuadStage
        * @version Egret 3.0
        * @platform Web,Native
        */
        getGUIStage(): QuadStage;
        /**
        * @language zh_CN
        * 添加一个gui对象
        * @param displayObject displayObject显示对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addGUI(displayObject: DisplayObject): void;
        /**
        * @language zh_CN
        * 从场景根节点中移除一个gui quad对象
        * @param displayObject displayObject显示对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeGUI(displayObject: DisplayObject): void;
        /**
        * @language zh_CN
        * 添加一个Object3D对象进场景根节点
        * @param child3d Object3D需要添加的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        addChild3D(child3d: Object3D): void;
        /**
        * @language zh_CN
        * 从场景根节点中移除一个Object3D对象
        * @param child3d 需要移除的Object3D对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeChild3D(child3d: Object3D): void;
        /**
        * @language zh_CN
        * 检测x y 是否在当前视口内
        * @param x  x 坐标。
        * @param y  y 坐标。
        */
        inView3D(x: number, y: number): boolean;
        /**
        * @language zh_CN
        * 添加 HUD 到渲染列表中
        * @param hud 需要增加的HUD
        * @version Egret 3.0
        * @platform Web,Native
        */
        addHUD(hud: HUD): void;
        /**
        * @language zh_CN
        * 查找HUD
        * @param name hud 名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        findHud(name: string): HUD;
        /**
        * @language zh_CN
        * 在渲染列表中删除一个HUD
        * @param hud 需要删除的HUD
        * @version Egret 3.0
        * @platform Web,Native
        */
        delHUD(hud: HUD): void;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number): void;
        private updateObject3D(object3d, time, delay);
    }
}
declare module egret3d {
    /**
    * @private
    */
    class EyesCamera {
        leftCamera: Camera3D;
        rightCamera: Camera3D;
        mainCamera: Camera3D;
        eyeCross: number;
        eyeRay: Vector3D;
        dir: Vector3D;
        constructor(camera: Camera3D, fov?: number, eyeCross?: number);
        update(): void;
    }
    /**
    * @class egret3d.View3D
    * @classdesc
    * VRView3D 会把场景渲染成两个视口。
    * 两个视口是由不同的摄像机渲染出来的结果，也相当由左右眼。
    * @see egret3d.Camera3D
    * @see egret3d.Scene3D
    * @see egret3d.Egret3DCanvas
    * @version Egret 3.0
    * @platform Web,Native
    */
    class VRView3D extends View3D {
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        eyesCamera: EyesCamera;
        private _leftHUD;
        private _rightHUD;
        protected leftRender: MultiRender;
        protected rightRender: MultiRender;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        w: number;
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        h: number;
        /**
        * @language zh_CN
        * 构建一个view3d对象
        * @param x 视口的屏幕x坐标
        * @param y 视口的屏幕y坐标
        * @param width 视口的屏幕宽度
        * @param height 视口的屏幕高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(x: number, y: number, width: number, height: number);
        private init();
        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(time: number, delay: number): void;
    }
}
declare module egret3d {
    /**
    * @private
    * @language zh_CN
    * 注册GUI使用的Texture
    * GUI 使用的贴图只能是公用型的材质,为了提高渲染效率，减少提交次数，gui使用的材质均需要pack起来进行注册
    * @version Egret 3.0
    * @platform Web,Native
    */
    var registGUITexture: (texture: Texture) => void;
    /**
    * @class egret3d.Egret3DCanvas
    * @classdesc
    * 3dCanvas 是一个3d渲染画布 它继承EventDispatcher 可以监听部分事件。
    * 如：Event3D.ENTER_FRAME 每帧响应回调事件
    * 一个3d渲染画布里面有多个view3d ，
    * 多个view3d进行渲染
    * @includeExample Egret3DCanvas.ts
    * @see egret3d.EventDispatcher
    * @see egret3d.View3D
    * @version Egret 3.0
    * @platform Web,Native
    */
    class Egret3DCanvas extends EventDispatcher {
        /**
        * @private
        */
        static _instance: Egret3DCanvas;
        /**
        * @private
        */
        static context3DProxy: Context3DProxy;
        /**
        * @private
        */
        private canvas3DRectangle;
        private canvas;
        private _view3DS;
        private sizeDiry;
        private _enterFrameEvent3D;
        protected _time: number;
        protected _delay: number;
        protected _renderer: number;
        protected _envetManager: EventManager;
        protected static _canvas2D: HTMLCanvasElement;
        protected static _ctx2D: CanvasRenderingContext2D;
        /**
        * @language zh_CN
        * Egret3DCanvas X 偏移
        * @version Egret 3.0
        * @platform Web,Native
        */
        offsetX: number;
        /**
        * @language zh_CN
        * Egret3DCanvas Y 偏移
        * @version Egret 3.0
        * @platform Web,Native
        */
        offsetY: number;
        /**
        * @language zh_CN
        * 渲染之后的回调
        * @version Egret 3.0
        * @platform Web,Native
        */
        afterRender: Function;
        protected _start: boolean;
        protected blend2D: boolean;
        protected stage2D: any;
        /**
        * @language zh_CN
        * 构造一个Egret3DCanvas对象
        * @param stage2D 从外部注入stage2D，可选
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(stage2D?: any);
        private getExtension(name);
        private initEvent();
        private create2dContext();
        /**
       * @language zh_CN
       * 获得一张图片的像素值
       * @param imageElement图片数据
       * @param offsetX x方向偏移
       * @param offsetY y方向偏移
       * @param width 获取像素宽度
       * @param height 获取像素高度
       * @version Egret 3.0
       * @platform Web,Native
       */
        static draw2DImage(imageElement: HTMLImageElement, offsetX?: number, offsetY?: number, width?: number, height?: number): ImageData;
        /**
        * @language zh_CN
        * 获取 Egret3DCanvas 的x坐标
        * @returns number 返回x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 Egret3DCanvas 的x坐标
        * @param x x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        x: number;
        /**
        * @language zh_CN
        * 获取 Egret3DCanvas 的y坐标
        * @returns number 返回y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 Egret3DCanvas 的y坐标
        * @param y y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        y: number;
        /**
        * @language zh_CN
        * 获取 Egret3DCanvas 的宽度
        * @returns number 返回Egret3DCanvas 的宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 Egret3DCanvas 的宽度
        * @param value Egret3DCanvas 的宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        width: number;
        /**
        * @language zh_CN
        * 获取 Egret3DCanvas 的高度
        * @returns number 返回Egret3DCanvas 的高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        /**
        * @language zh_CN
        * 设置 Egret3DCanvas 的高度
        * @param value Egret3DCanvas 的高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        height: number;
        /**
        * @language zh_CN
        * 获取 Egret3DCanvas 所有的view3d
        * @returns Array<View3D> 返回Egret3DCanvas view3ds列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        view3Ds: Array<View3D>;
        /**
        * @language zh_CN
        * Egret3DCanvas 中 增加一个view3d
        * @param view3D 增加的渲染视口
        * @version Egret 3.0
        * @platform Web,Native
        */
        addView3D(view3D: View3D): void;
        /**
        * @language zh_CN
        * Egret3DCanvas 中 移除一个view3d
        * @param view3D 移除的渲染视口
        * @version Egret 3.0
        * @platform Web,Native
        */
        removeView3D(view3D: View3D): void;
        private $render();
        /**
         * @language zh_CN
         * Egret3DCanvas 调用一次渲染
         * @version Egret 4.0
         * @platform Web,Native
         */
        render(): void;
        resizeBlend2D(): void;
        /**
        * @language zh_CN
        * Egret3DCanvas 开始启动
        * @version Egret 3.0
        * @platform Web,Native
        */
        start(): void;
        /**
        * @language zh_CN
        * Egret3DCanvas 停止启动
        * @version Egret 3.0
        * @platform Web,Native
        */
        stop(): void;
        /**
        * @language zh_CN
        * @private
        * @version Egret 3.0
        * @platform Web,Native
        */
        update(delay: number): void;
        /**
        * @language zh_CN
        * 初始化,并创建显示区域的后台缓冲大小。
        * @param GPU_CONFIG
        * @param canvasRec
        * @event call
        */
        resize(x: number, y: number, width: number, height: number): void;
        onStart(egret2dContext: any): void;
        onRender(egret2dContext: any): void;
        onStop(): void;
        onResize(): void;
    }
    interface Stage3D extends Egret3DCanvas {
    }
    let Stage3D: typeof Egret3DCanvas;
}
declare module egret3d {
    /**
     * @private
     * @class egret3D.Egret3DPolicy
     * @classdesc
     */
    class Egret3DPolicy {
        static engineVersion: string;
        static exportToolsVersion: string[];
        static useParticle: boolean;
        static useAnimEffect: boolean;
        static useEffect: boolean;
        static useRibbon: boolean;
        static useAnimPoseInterpolation: boolean;
        static useAnimMixInterpolation: boolean;
        static useAnimCache: boolean;
        static useLowLoop: boolean;
        static useLight: boolean;
        static usePost: boolean;
        static useCompress: boolean;
        static useLowLOD: boolean;
    }
    /**
    * @private
    * @language zh_CN
    * 请求全屏
    */
    function requestFullScreen(): void;
    /**
    * @private
    * @language zh_CN
    * 退出全屏
    */
    function exitFullscreen(): void;
    /**
    * @private
    * @language zh_CN
    */
    function setObjectSrceenPos(x: number, y: number, target: Object3D, camera: Camera3D): void;
    /**
     * @private
     * @class egret3D.Egret3DEngine
     * @classdesc
     * 引擎库文件加载
     * 引擎库前期加载设置，开发中加载未压缩的编译引擎
     */
    class Egret3DEngine {
        static instance: Egret3DEngine;
        /**
         * @private
         **/
        performance: Egret3DPerformance;
        /**
         * @private
         **/
        inspector: Egret3DInspector;
        version: string;
        jsPath: string;
        onTsconfig: Function;
        debug: boolean;
        private _tsconfigs;
        private _currentConfig;
        private _xhr;
        private importList;
        private _complete;
        private _thisObject;
        private static getXHR();
        constructor();
        useDevicePOLICY(lv?: number): void;
        private isWeiXin();
        private isAndroid();
        addTsconfig(path: string): void;
        setTsconfig(index: number, path: string): void;
        clearTsconfig(): void;
        preload(complete: Function, thisObject?: any): void;
        addImportScript(path: string): void;
        private doLoader(path);
        private onProgress(event);
        private onReadyStateChange(event);
        private onLoadComplete(source);
        private onError(event);
        private onAllLoadTsconfigComplete();
        private onAllLoadComplete();
        private startLoadScript(e);
        private loadScriptError(e);
    }
}
declare module egret3d {
    interface IPost {
        renderQuen: RenderQuen;
        drawRectangle: Rectangle;
        setRenderTexture(width: number, height: number, change?: boolean): any;
        draw(time: number, delay: number, context3D: Context3DProxy, collect: EntityCollect, camera: Camera3D, backViewPort: Rectangle, posList: any): any;
    }
}
declare module egret3d {
    class GaussPost implements IPost {
        renderQuen: RenderQuen;
        drawRectangle: Rectangle;
        sourceTexture: Texture;
        private _h_postRender;
        private _v_postRender;
        private _debugHud;
        constructor();
        setRenderTexture(width: number, height: number): void;
        draw(time: number, delay: number, context3D: Context3DProxy, collect: EntityCollect, camera: Camera3D, backViewPort: Rectangle, posList: any): void;
    }
}
declare module egret3d {
    class BloomPost implements IPost {
        renderQuen: RenderQuen;
        drawRectangle: Rectangle;
        private postRender;
        private _debugHud;
        bloom_amount: number;
        constructor(bloom_amount?: number);
        setRenderTexture(width: number, height: number, change?: boolean): void;
        draw(time: number, delay: number, context3D: Context3DProxy, collect: EntityCollect, camera: Camera3D, backViewPort: Rectangle, posList: any): void;
    }
}
declare module egret3d {
    class Gbuffer implements IPost {
        renderQuen: RenderQuen;
        drawRectangle: Rectangle;
        private postRender;
        private _debugHud;
        constructor();
        setRenderTexture(width: number, height: number): void;
        draw(time: number, delay: number, context3D: Context3DProxy, collect: EntityCollect, camera: Camera3D, backViewPort: Rectangle, posList: any): void;
    }
}
declare module egret3d {
    class SizeUtil {
        private static MAX_SIZE;
        isDimensionValid(d: number): boolean;
        isPowerOfTwo(value: number): boolean;
        getBestPowerOf2(value: number): number;
    }
    var sizeUtil: SizeUtil;
    class PostProcessing {
        postArray: IPost[];
        posTex: any;
        finalTexture: ITexture;
        hud: HUD;
        private _renderQuen;
        private _sizeChange;
        constructor(renderQuen: RenderQuen);
        draw(time: number, delay: number, contextProxy: Context3DProxy, collect: EntityCollect, camera: Camera3D, backViewPort: Rectangle): void;
    }
}
declare module egret3d {
    class ColorCorrectionPost implements IPost {
        renderQuen: RenderQuen;
        drawRectangle: Rectangle;
        private postRender;
        private _lutTexture;
        constructor();
        setRenderTexture(width: number, height: number): void;
        lutTexture: Texture;
        draw(time: number, delay: number, context3D: Context3DProxy, collect: EntityCollect, camera: Camera3D, backViewPort: Rectangle, posList: any): void;
    }
}
