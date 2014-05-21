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

/// <reference path="../../core/HashObject.ts"/>
/// <reference path="../../core/MainContext.ts"/>

module ns_egret{
	/**
	 * @class ns_egret.SoundContext
	 * @classdesc
	 * @extends ns_egret.HashObject
	 */
    export class SoundContext extends HashObject{
		/**
		 * @method ns_egret.SoundContext.getInstance
		 * @returns {SoundContext}
		 */
        public static getInstance():SoundContext {
            return ns_egret.MainContext.instance.soundContext;
        }

		/**
		 * @member ns_egret.SoundContext.isMusicPlaying
		 */
        public static isMusicPlaying:boolean = false;

		/**
		 * @method ns_egret.SoundContext#constructor
		 */
        public constructor() {
            super();
        }

		/**
		 * @method ns_egret.SoundContext#preloadSound
		 * @param pat {any} 
		 */
        public preloadSound(path) {

        }

		/**
		 * @method ns_egret.SoundContext#playMusic
		 * @param path {any} 
		 * @param loop {any} 
		 */
        public playMusic(path, loop = true) {
        }

		/**
		 * @method ns_egret.SoundContext#stopMusic
		 * @param releaseDat {any} 
		 */
        public stopMusic(releaseData) {
        }
    }
}