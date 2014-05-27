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

/// <reference path="../MainContext.ts"/>
/// <reference path="../../utils/HashObject.ts"/>

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