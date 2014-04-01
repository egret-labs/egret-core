/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module ns_egret{
    export class TMX {
        static TILE_HORIZONTAL_FLAG = 0x80000000;
        static TILE_VERTICAL_FLAG = 0x40000000;
        static TILE_DIAGONAL_FLAG = 0x20000000;
        static TILE_FLIPPED_ALL = (TMX.TILE_HORIZONTAL_FLAG | TMX.TILE_VERTICAL_FLAG | TMX.TILE_DIAGONAL_FLAG) >>> 0;
        static TILE_FLIPPED_MASK = (~(TMX.TILE_FLIPPED_ALL)) >>> 0;

        static LAYER_ATTRIB_NONE = 1 << 0;
        static LAYER_ATTRIB_BASE64 = 1 << 1;
        static LAYER_ATTRIB_GZIP = 1 << 2;
        static LAYER_ATTRIB_ZLIB = 1 << 3;

        static PROPERTY_NONE = 0;
        static PROPERTY_MAP = 1;
        static PROPERTY_LAYER = 2;
        static PROPERTY_OBJECTGROUP = 3;
        static PROPERTY_OBJECT = 4;
        static PROPERTY_TILE = 5;

        static ORIENTATION_ORTHO = 0;
        static ORIENTATION_HEX = 1;
        static ORIENTATION_ISO = 2;
    }
}