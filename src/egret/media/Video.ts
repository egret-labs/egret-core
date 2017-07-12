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
     * The Video class lets you work with video in an application.
     * The Video class lets you create a Video object, load and play an external video file into that object.
     * Note: On most mobile device, the video is playback in the full screen mode.<br/>
     *
     * @param url URL of the media to play, Video will start to load if the url is not empty
     *
     * @event egret.Event.COMPLETE Dispatch when the video resource is loaded and ready to play
     * @event egret.Event.ENDED Dispatch when the video playback ended
     * @event egret.IOErrorEvent.IO_ERROR when the video is failed to load
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/media/Video.ts
     * @language en_US
     */
    /**
     * Video 允许您在应用程序中使用视频。使用 Video 类可以创建 Video 对象、将外部视频文件加载到该对象并播放该文件。<br/>
     * 注意: 在大多数移动设备中，视频是强制全屏播放的，所以你可以直接调用 play() 方法全屏播放视频，不用将它绘制在Stage中。
     * @see http://edn.egret.com/cn/docs/page/657 视频系统
     *
     * @param url 要播放的视频的URL，如果url不为空，Video会立即加载这个视频
     *
     * @event egret.Event.COMPLETE 视频加载完成时抛出
     * @event egret.Event.ENDED 视频播放完成时抛出
     * @event egret.IOErrorEvent.IO_ERROR 视频加载失败时触发
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/media/Video.ts
     * @language zh_CN
     */
    export interface Video extends DisplayObject {
        /**
         * Initiates loading of an external video file from the specified URL.
         * @param url Audio file URL
         * * @param cache Should cache the video，only  used in Native
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 启动从指定 URL 加载外部视频文件的过程。
         * @param url 需要加载的视频文件URL
         * @param cache 是否需要缓存到本地，只在 Native 上使用
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        load(url:string,cache?:boolean): void;

        /**
         * Play back the video.
         * @param startTime The initial position in seconds at which playback should start, (default = 0)
         * @param loop Defines should play the video again when the video is ended. (default = false)
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 播放该视频
         * @param startTime 应开始播放的初始位置（以秒为单位），默认值是视频上次结束的位置
         * @param loop 是否需要循环播放，默认值是 false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        play(startTime?:number, loop?:boolean);

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
         * The URL of the video you want to play.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 想要播放的视频的URL
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        src: string;

        /**
         * The URL of an image you want to display before the video is loaded or video cannot been draw on the canvas on some mobile device.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 视频加载前，或者在不支持将 video 画在 canvas 的设备上，想要显示的视频截图地址。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        poster: string;

        /**
         * Should play the video in fullscreen mode (default = true).
         * Currently only supports full-screen mobile terminal web.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 是否全屏播放这个视频（默认值是 true）。
         * 目前移动端 web 只支持全屏。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        fullscreen: boolean;
        /**
         * The volume, ranging from 0 (silent) to 1 (full volume).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音量范围从 0（静音）至 1（最大音量）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        volume: number;

        /**
         * When the video is playing, the position property indicates
         * in seconds the current point that is being played in the video file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当播放视频时，position 属性表示视频文件中当前播放的位置（以秒为单位）
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        position: number;

        /**
         * Pause the video playing.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 暂停播放。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        pause(): void;

        /**
         * Get bitmapData of the video file, you can use the video as bitmapData on the stage.
         * Note: On most mobile device, the video is playback in the full screen mode.
         * So you can just use the play() method instead of draw it on the Stage
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         *  获取视频的 bitmapData, 你可以将视频绘制到舞台上。
         * 注意： 在大多数移动设备中，视频是全屏播放的，所以你可以直接调用 play() 方法全屏播放视频，不用将它绘制在Stage中。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        bitmapData?: BitmapData;

        /**
         * Whether current video is paused.
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language en_US
         */
        /**
         * 当前视频是否在暂停状态。
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language zh_CN
         */
        paused:boolean;
        /**
         * Length of the current video (in seconds).
         * @version Egret 3.0.8
         * @platform Web,Native
         * @readOnly
         * @language en_US
         */
        /**
         * 当前视频的长度（以秒为单位）。
         * @version Egret 3.0.8
         * @platform Web,Native
         * @readOnly
         * @language zh_CN
         */
        length:number;
    }
    /**
     * @copy egret.Video
     */
    export let Video:{
        new (url?:string,cache?:boolean): Video
    };
}