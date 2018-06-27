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

namespace egret.web {

    function loadShader(gl:WebGLRenderingContext, type:number, source:string):WebGLShader {
        let shader = gl.createShader(type);

        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(!compiled) {
            console.log("shader not compiled!");
            console.log(gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    function createWebGLProgram(gl:WebGLRenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader):WebGLProgram {
        let program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        gl.linkProgram(program);

        return program;
    }

    function extractAttributes(gl:WebGLRenderingContext, program:WebGLProgram):Attributes {
        let attributes:Attributes = {};

        let totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < totalAttributes; i++) {
            let attribData = gl.getActiveAttrib(program, i);
            let name = attribData.name;
            let attribute = new EgretWebGLAttribute(gl, program, attribData);
            attributes[name] = attribute;
        }

        return attributes;
    }

    function extractUniforms(gl:WebGLRenderingContext, program:WebGLProgram):Uniforms {
        let uniforms:Uniforms = {};

        let totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for(let i = 0; i < totalUniforms; i++) {
            let uniformData = gl.getActiveUniform(program, i);
            let name = uniformData.name;
            let uniform = new EgretWebGLUniform(gl, program, uniformData);
            uniforms[name] = uniform;
        }

        return uniforms;
    }

    /**
     * @private
     */
    export type ProgramCache = {[index:string]:EgretWebGLProgram};

    /**
     * @private
     */
    export type Uniforms = {[index:string]:EgretWebGLUniform};

    /**
     * @private
     */
    export type Attributes = {[index:string]:EgretWebGLAttribute};

    /**
     * @private
     */
    export class EgretWebGLProgram {

        private static programCache:ProgramCache = {};

        /**
         * 获取所需的WebGL Program
         * @param key {string} 对于唯一的program程序，对应唯一的key 
         */
        public static getProgram(gl:WebGLRenderingContext, vertSource:string, fragSource:string, key:string):EgretWebGLProgram {

            if(!this.programCache[key]) {
                this.programCache[key] = new EgretWebGLProgram(gl, vertSource, fragSource);
            }

            return this.programCache[key];
        }

        public static deleteProgram(gl:WebGLRenderingContext, vertSource:string, fragSource:string, key:string):void {
            // TODO delete
        }
 
        private vshaderSource:string;
        private fshaderSource:string;
        private vertexShader:WebGLShader;
        private fragmentShader:WebGLShader;

        public id:WebGLProgram;
        public attributes:Attributes;
        public uniforms:Uniforms;

        private constructor(gl:WebGLRenderingContext, vertSource:string, fragSource:string) {
            this.vshaderSource = vertSource;

            this.fshaderSource = fragSource;

            this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);

            this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);

            this.id = createWebGLProgram(gl, this.vertexShader, this.fragmentShader);

            this.uniforms = extractUniforms(gl, this.id);

            this.attributes = extractAttributes(gl, this.id);
        }
    }
}