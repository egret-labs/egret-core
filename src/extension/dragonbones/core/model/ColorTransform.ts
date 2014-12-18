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
module dragonBones {
    export class ColorTransform {
        /*
        public static ORIGIN_COLOR_TRANSFORM:ColorTransform = new ColorTransform();
        private static tempColorTransform:ColorTransform = new ColorTransform();
        public static createTempColorTransform(
            aMultiplier:number = 0, rMultiplier:number = 0, gMultiplier:number = 0, bMultiplier:number = 0,
            aOffset:number = 0, rOffset:number = 0, gOffset:number = 0, bOffset:number = 0):ColorTransform
        {
            ColorTransform.tempColorTransform.alphaMultiplier = aMultiplier;
            ColorTransform.tempColorTransform.redMultiplier = rMultiplier;
            ColorTransform.tempColorTransform.greenMultiplier = gMultiplier;
            ColorTransform.tempColorTransform.blueMultiplier = bMultiplier;
            ColorTransform.tempColorTransform.alphaOffset = aOffset;
            ColorTransform.tempColorTransform.redOffset = rOffset;
            ColorTransform.tempColorTransform.greenOffset = gOffset;
            ColorTransform.tempColorTransform.blueOffset = bOffset;

            return ColorTransform.tempColorTransform;
        }
*/
        public alphaMultiplier:number;
        public alphaOffset:number;
        public blueMultiplier:number;
        public blueOffset:number;
        public greenMultiplier:number;
        public greenOffset:number;
        public redMultiplier:number;
        public redOffset:number;

        constructor() {
            this.alphaMultiplier = 1;
            this.alphaOffset = 0;
            this.blueMultiplier = 1;
            this.blueOffset = 0;
            this.greenMultiplier = 1;
            this.greenOffset = 0;
            this.redMultiplier = 1;
            this.redOffset = 0;
        }
    }
}
