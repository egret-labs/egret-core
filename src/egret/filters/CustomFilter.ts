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

    const SOURCE_KEY_MAP = {};

    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
    let uuid = new Array( 36 );
    let rnd = 0, r;

    /**
     * generate uuid
     * http://www.broofa.com/Tools/Math.uuid.htm
     */
    let generateUUID = function () {
        for ( let i = 0; i < 36; i ++ ) {

            if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

                uuid[ i ] = '-';

            } else if ( i === 14 ) {

                uuid[ i ] = '4';

            } else {

                if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

            }

        }

        return uuid.join( '' );
	};

    /**
     * custom filter, now support WebGL mode only.
     * @version Egret 4.1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 自定义滤镜，目前仅支持WebGL模式
     * @version Egret 4.1.0
     * @platform Web
     * @language zh_CN
     */
    export class CustomFilter extends Filter {

        /**
         * @private  
         */
        public $vertexSrc:string;

        /**
         * @private  
         */
        public $fragmentSrc:string;

        /**
         * @private  
         */
        public $shaderKey:string;

        /**
         * @private  
         */
        public type:string;
        
        private $padding:number = 0;

        /**
         * The inner margin of the filter.
         * If the desired area of the custom filter is larger than the original area (stroke, etc.), you need to set it manually.
         * @version Egret 4.1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 滤镜的内边距
         * 如果自定义滤镜所需区域比原区域大（描边等），需要手动设置
         * @version Egret 4.1.0
         * @platform Web
         * @language zh_CN
         */
        public get padding(): number {
            return this.$padding;
        }

        public set padding(value: number) {
            let self = this;
            if (self.$padding == value) {
                return;
            }
            self.$padding = value;
            self.onPropertyChange();
        }

        /**
         * The initial value of the uniform in the shader (key, value one-to-one correspondence), currently only supports numbers and arrays.
         * @version Egret 4.1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 着色器中uniform的初始值（key，value一一对应），目前仅支持数字和数组。
         * @version Egret 4.1.0
         * @platform Web
         * @language zh_CN
         */
        public get uniforms():any {
            return this.$uniforms;
        }

        /**
         * Initialize the CustomFilter object.
         * @param vertexSrc Custom vertex shader program.
         * @param fragmentSrc Custom fragment shader program.
         * @param uniforms The initial value of the uniform in the shader (key, value one-to-one correspondence), currently only supports numbers and arrays.
         * @version Egret 4.1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 初始化 CustomFilter 对象
         * @param vertexSrc 自定义的顶点着色器程序。
         * @param fragmentSrc 自定义的片段着色器程序。
         * @param uniforms 着色器中uniform的初始值（key，value一一对应），目前仅支持数字和数组。
         * @version Egret 4.1.0
         * @platform Web
         * @language zh_CN
         */
        constructor(vertexSrc:string, fragmentSrc:string, uniforms:any = {}) {
            super();

            this.$vertexSrc = vertexSrc;

            this.$fragmentSrc = fragmentSrc;

            let tempKey = vertexSrc + fragmentSrc;

            if(!SOURCE_KEY_MAP[tempKey]) {
                SOURCE_KEY_MAP[tempKey] = generateUUID();
            }

            this.$shaderKey = SOURCE_KEY_MAP[tempKey];

            this.$uniforms = uniforms;

            this.type = "custom";
        }

        public onPropertyChange(): void {
            if (egret.nativeRender) {
                let self = this;
                egret_native.NativeDisplayObject.setFilterPadding(self.$id, self.$padding, self.$padding, self.$padding, self.$padding);
                egret_native.NativeDisplayObject.setDataToFilter(self);
            }
        }
    }
}