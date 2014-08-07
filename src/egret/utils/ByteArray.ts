/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



module egret
{

    export class Endian {


        static LITTLE_ENDIAN:string = "LITTLE_ENDIAN";

        static BIG_ENDIAN:string = "BIG_ENDIAN";

    }


    export class ByteArray
    {
        public position:number = 0;
        public length:number = 0;
        public _mode:string = "";
        public maxlength:number = 0;
        public arraybytes; //ArrayBuffer
        public unalignedarraybytestemp; //ArrayBuffer
        private _endian:string =  Endian.LITTLE_ENDIAN;
        private isLittleEndian:boolean = false;
        public static DEFAULT_ENDIAN:string = Endian.BIG_ENDIAN;

        constructor()
        {
            this._mode = "Typed array";
            this.maxlength = 4;
            this.arraybytes = new ArrayBuffer(this.maxlength);
            this.unalignedarraybytestemp = new ArrayBuffer(16);
            this.endian = ByteArray.DEFAULT_ENDIAN;
        }

        public get endian():string{
            return this._endian;
        }

        public set endian(value:string){
            this._endian = value;
            this.isLittleEndian = value == Endian.LITTLE_ENDIAN;
        }

        public ensureWriteableSpace(n:number)
        {
            this.ensureSpace(n + this.position);
        }

        public setArrayBuffer(aBuffer:ArrayBuffer):void
        {

            this.ensureSpace(aBuffer.byteLength);

            this.length = aBuffer.byteLength;

            var inInt8AView:Int8Array = new Int8Array(aBuffer);
            var localInt8View:Int8Array = new Int8Array(this.arraybytes, 0, this.length);

            localInt8View.set(inInt8AView);

            this.position = 0;

        }

        public getBytesAvailable():number
        {
            return ( this.length ) - ( this.position );
        }

        public ensureSpace(n:number)
        {
            if (n > this.maxlength) {
                var newmaxlength:number = (n + 255) & (~255);
                var newarraybuffer = new ArrayBuffer(newmaxlength);
                var view = new Uint8Array(this.arraybytes, 0, this.length);
                var newview = new Uint8Array(newarraybuffer, 0, this.length);
                newview.set(view);      // memcpy
                this.arraybytes = newarraybuffer;
                this.maxlength = newmaxlength;
            }
        }

        public writeByte(b:number)
        {
            this.ensureWriteableSpace(1);
            var view = new Int8Array(this.arraybytes);
            view[ this.position++ ] = (~~b); // ~~ is cast to int in js...
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

        public readByte()
        {
            if (this.position >= this.length) {
                throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
            }
            var view = new Int8Array(this.arraybytes);

            return view[ this.position++ ];
        }

        public readBytes(bytes:ByteArray, offset:number = 0, length:number = 0)
        {

            if (length == null) {
                length = bytes.length;
            }

            bytes.ensureWriteableSpace(offset + length);

            var byteView:Int8Array = new Int8Array(bytes.arraybytes);
            var localByteView:Int8Array = new Int8Array(this.arraybytes);

            byteView.set(localByteView.subarray(this.position, this.position + length), offset);

            this.position += length;

            if (length + offset > bytes.length) {
                bytes.length += ( length + offset ) - bytes.length;
            }

        }

        public writeUnsignedByte(b:number)
        {
            this.ensureWriteableSpace(1);
            var view = new Uint8Array(this.arraybytes);
            view[this.position++] = (~~b) & 0xff; // ~~ is cast to int in js...
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

        public readUnsignedByte()
        {
            if (this.position >= this.length) {
                throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
            }
            var view = new Uint8Array(this.arraybytes);
            return view[this.position++];
        }

        public writeUnsignedShort(b:number)
        {
            this.ensureWriteableSpace(2);
            if (( this.position & 1 ) == 0) {
                var view = new Uint16Array(this.arraybytes);
                view[ this.position >> 1 ] = (~~b) & 0xffff; // ~~ is cast to int in js...
            } else {
                var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
                view[0] = (~~b) & 0xffff;
                var view2 = new Uint8Array(this.arraybytes, this.position, 2);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
                view2.set(view3);
            }
            this.position += 2;
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

        public readUTFBytes(len:number):string
        {

            var value:string = "";
            var max:number = this.position + len;
            var data:DataView = new DataView(this.arraybytes);

            // utf8-encode
            while (this.position < max) {

                var c:number = data.getUint8(this.position++);

                if (c < 0x80) {

                    if (c == 0) break;
                    value += String.fromCharCode(c);

                } else if (c < 0xE0) {

                    value += String.fromCharCode(((c & 0x3F) << 6) | (data.getUint8(this.position++) & 0x7F));

                } else if (c < 0xF0) {

                    var c2 = data.getUint8(this.position++);
                    value += String.fromCharCode(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (data.getUint8(this.position++) & 0x7F));

                } else {

                    var c2 = data.getUint8(this.position++);
                    var c3 = data.getUint8(this.position++);

                    value += String.fromCharCode(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (data.getUint8(this.position++) & 0x7F));

                }

            }

            return value;

        }

        public readInt():number
        {

            var data:DataView = new DataView(this.arraybytes);
            var int:number = data.getInt32(this.position, this.isLittleEndian);

            this.position += 4;

            return int;

        }

        public readShort():number
        {

            var data:DataView = new DataView(this.arraybytes);
            var short:number = data.getInt16(this.position, this.isLittleEndian);

            this.position += 2;
            return short;

        }

        public readDouble():number
        {
            var data:DataView = new DataView(this.arraybytes);
            var double:number = data.getFloat64(this.position, this.isLittleEndian);

            this.position += 8;
            return double;

        }

        public readUnsignedShort()
        {
            if (this.position > this.length + 2) {
                throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
            }
            if (( this.position & 1 ) == 0) {
                var view = new Uint16Array(this.arraybytes);
                var pa:number = this.position >> 1;
                this.position += 2;
                return view[ pa ];
            } else {
                var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
                var view2 = new Uint8Array(this.arraybytes, this.position, 2);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
                view3.set(view2);
                this.position += 2;
                return view[0];
            }
        }

        public writeUnsignedInt(b:number)
        {
            this.ensureWriteableSpace(4);
            if (( this.position & 3 ) == 0) {
                var view = new Uint32Array(this.arraybytes);
                view[ this.position >> 2 ] = (~~b) & 0xffffffff; // ~~ is cast to int in js...
            } else {
                var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
                view[0] = (~~b) & 0xffffffff;
                var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                view2.set(view3);
            }
            this.position += 4;
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

        public readUnsignedInt()
        {

            if (this.position > this.length + 4) {
                throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
            }
            if (( this.position & 3 ) == 0) {
                var view = new Uint32Array(this.arraybytes);
                var pa:number = this.position >> 2;
                this.position += 4;
                return view[ pa ];
            } else {
                var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
                var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                view3.set(view2);
                this.position += 4;
                return view[0];
            }
        }

        public writeFloat(b:number)
        {
            this.ensureWriteableSpace(4);
            if (( this.position & 3 ) == 0) {
                var view = new Float32Array(this.arraybytes);
                view[ this.position >> 2 ] = b;
            } else {
                var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
                view[0] = b;
                var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                view2.set(view3);
            }
            this.position += 4;
            if (this.position > this.length) {
                this.length = this.position;
            }
        }

        public readFloat()
        {
            if (this.position > this.length + 4) {
                throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
            }
            if ((this.position & 3) == 0) {
                var view = new Float32Array(this.arraybytes);
                var pa = this.position >> 2;
                this.position += 4;
                return view[pa];
            } else {
                var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
                var view2 = new Uint8Array(this.arraybytes, this.position, 4);
                var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
                view3.set(view2);
                this.position += 4;
                return view[ 0 ];
            }
        }
    }
}