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


namespace egret.sys {

    export let usingChannel: Array<SoundChannel> = [];

    /**
     * @private
     * @param channel
     */
    export function $pushSoundChannel(channel: SoundChannel): void {
        if (usingChannel.indexOf(channel) < 0) {
            usingChannel.push(channel);
        }
    }

    /**
     * @private
     * @param channel
     */
    export function $popSoundChannel(channel: SoundChannel): boolean {
        let index: number = usingChannel.indexOf(channel);
        if (index >= 0) {
            usingChannel.splice(index, 1);
            return true;
        }
        return false;
    }
}

namespace egret {

    /**
     * The Sound class lets you work with sound in an application.
     * The Sound class lets you create a Sound object, load and play an external audio file into that object.
     * More detailed control of the sound is performed through the SoundChannel
     *
     * @event egret.Event.COMPLETE Dispatch when the audio resource is loaded and ready to play
     * @event egret.IOErrorEvent.IO_ERROR Dispatch when the audio resource is failed to load
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     * @language en_US
     */
    /**
     * Sound 允许您在应用程序中使用声音。使用 Sound 类可以创建 Sound 对象、将外部音频文件加载到该对象并播放该文件。
     * 可通过 SoundChannel 对声音执行更精细的控制，如控制音量和监控播放进度。
     * @see http://edn.egret.com/cn/docs/page/156 音频系统
     *
     * @event egret.Event.COMPLETE 音频加载完成时抛出
     * @event egret.IOErrorEvent.IO_ERROR 音频加载失败时抛出
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     * @language zh_CN
     */
    export interface Sound extends EventDispatcher {

        /**
         * Initiates loading of an external audio file from the specified URL.
         * @param url Audio file URL
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 启动从指定 URL 加载外部音频文件的过程。
         * @param url 需要加载的音频文件URL
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        load(url: string): void;

        /**
         * Generates a new SoundChannel object to play back the sound.
         * @param startTime The initial position in seconds at which playback should start, (default = 0)
         * @param loops Plays, the default value is 0. Greater than 0 to the number of plays, such as 1 to play 1, less than or equal to 0, to loop.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 生成一个新的 SoundChannel 对象来播放该声音。此方法返回 SoundChannel 对象，访问该对象可停止声音调整音量。
         * @param startTime 应开始播放的初始位置（以秒为单位），默认值是 0
         * @param loops 播放次数，默认值是 0，循环播放。 大于 0 为播放次数，如 1 为播放 1 次；小于等于 0，为循环播放。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        play(startTime?: number, loops?: number): SoundChannel;

        /**
         * Closes the stream, causing any download of data to cease
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 关闭该流，从而停止所有数据的下载。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        close(): void;

        /**
         * Type, default is egret.Sound.EFFECT.
         * In the native and runtime environment, while only play a background music, sound length so as not to be too long.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 类型，默认为 egret.Sound.EFFECT。
         * 在 native 和 runtime 环境下，背景音乐同时只能播放一个，音效长度尽量不要太长。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        type: string;

        /**
         * Length of the current sound (in seconds).
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language en_US
         */
        /**
         * 当前声音的长度（以秒为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language zh_CN
         */
        length: number;
    }


    /**
     * @copy egret.Sound
     */
    export let Sound: {

        /**
         * Create Sound object, load an external audio file and play
         * @param url Audio file URL, Sound will start to load the media if url is not empty
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建 Sound 对象、将外部音频文件加载到该对象并播放该文件
         * @param url 需要加载的音频文件URL,如果指定了 url, Sound会立即开始加载指定的媒体文件
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        new(): Sound;

        /**
         * Background music
         * @default "music"
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @default "music"
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        MUSIC: string;

        /**
         * EFFECT
         * @default "effect"
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @default "effect"
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        EFFECT: string;
    };
}
