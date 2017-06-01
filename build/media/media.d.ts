declare namespace egret.sys {
    /**
     * @private
     * @param channel
     */
    function $pushSoundChannel(channel: SoundChannel): void;
    /**
     * @private
     * @param channel
     */
    function $popSoundChannel(channel: SoundChannel): boolean;
}
declare namespace egret {
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
    interface Sound extends EventDispatcher {
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
    let Sound: {
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
        new (): Sound;
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
declare namespace egret {
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
    interface Video extends DisplayObject {
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
        load(url: string, cache?: boolean): void;
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
        play(startTime?: number, loop?: boolean): any;
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
        paused: boolean;
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
        length: number;
    }
    /**
     * @copy egret.Video
     */
    let Video: {
        new (url?: string, cache?: boolean): Video;
    };
}
declare namespace egret {
    /**
     * The SoundChannel class controls a sound in an application.
     * Every sound is assigned to a sound channel, and the application
     * can have multiple sound channels that are mixed together.
     * The SoundChannel class contains a stop() method, properties for
     * set the volume of the channel
     *
     * @event egret.Event.SOUND_COMPLETE Dispatch when a sound has finished playing at last time
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
     * @language en_US
     */
    /**
     * SoundChannel 类控制应用程序中的声音。每个声音均分配给一个声道，而且应用程序可以具有混合在一起的多个声道。
     * SoundChannel 类包含 stop() 方法、用于设置音量和监视播放进度的属性。
     *
     * @event egret.Event.SOUND_COMPLETE 音频最后一次播放完成时抛出
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/media/Sound.ts
    * @language zh_CN
    */
    interface SoundChannel extends IEventDispatcher {
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
         *  When the sound is playing, the position property indicates
         * in seconds the current point that is being played in the sound file.
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language en_US
         */
        /**
         * 当播放声音时，position 属性表示声音文件中当前播放的位置（以秒为单位）
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language zh_CN
         */
        position: number;
        /**
         * Stops the sound playing in the channel.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 停止在该声道中播放声音。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        stop(): void;
    }
}
declare namespace egret.web {
    /**
     * @private
     * @inheritDoc
     */
    class HtmlSound extends egret.EventDispatcher implements egret.Sound {
        /**
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static MUSIC: string;
        /**
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static EFFECT: string;
        /**
         * @private
         */
        type: string;
        /**
         * @private
         */
        private url;
        /**
         * @private
         */
        private originAudio;
        /**
         * @private
         */
        private loaded;
        /**
         * @private
         * @inheritDoc
         */
        constructor();
        readonly length: number;
        /**
         * @inheritDoc
         */
        load(url: string): void;
        /**
         * @inheritDoc
         */
        play(startTime?: number, loops?: number): SoundChannel;
        /**
         * @inheritDoc
         */
        close(): void;
        /**
         * @private
         */
        private static audios;
        private static clearAudios;
        static $clear(url: string): void;
        static $pop(url: string): HTMLAudioElement;
        static $recycle(url: string, audio: HTMLAudioElement): void;
    }
}
declare namespace egret.web {
    /**
     * @private
     * @inheritDoc
     */
    class HtmlSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {
        /**
         * @private
         */
        $url: string;
        /**
         * @private
         */
        $loops: number;
        /**
         * @private
         */
        $startTime: number;
        /**
         * @private
         */
        private audio;
        private isStopped;
        /**
         * @private
         */
        constructor(audio: HTMLAudioElement);
        private canPlay;
        $play(): void;
        /**
         * @private
         */
        private onPlayEnd;
        /**
         * @private
         * @inheritDoc
         */
        stop(): void;
        /**
         * @private
         */
        private _volume;
        /**
         * @private
         * @inheritDoc
         */
        /**
         * @inheritDoc
         */
        volume: number;
        /**
         * @private
         * @inheritDoc
         */
        readonly position: number;
    }
}
/**
 * @private
 */
interface AudioBufferSourceNodeEgret {
    buffer: any;
    context: any;
    onended: Function;
    stop(when?: number): void;
    noteOff(when?: number): void;
    addEventListener(type: string, listener: Function, useCapture?: boolean): any;
    removeEventListener(type: string, listener: Function, useCapture?: boolean): any;
    disconnect(): any;
}
declare namespace egret.web {
    /**
     * @private
     */
    class WebAudioDecode {
        /**
         * @private
         */
        static canUseWebAudio: any;
        /**
         * @private
         */
        static ctx: any;
        /**
         * @private
         */
        static decodeArr: any[];
        /**
         * @private
         */
        private static isDecoding;
        /**
         * @private
         *
         */
        static decodeAudios(): void;
    }
    /**
     * @private
     * @inheritDoc
     */
    class WebAudioSound extends egret.EventDispatcher implements egret.Sound {
        /**
         * Background music
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static MUSIC: string;
        /**
         * EFFECT
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static EFFECT: string;
        /**
         * @private
         */
        type: string;
        /**
         * @private
         */
        private url;
        /**
         * @private
         */
        private loaded;
        /**
         * @private
         * @inheritDoc
         */
        constructor();
        /**
         * @private
         */
        private audioBuffer;
        readonly length: number;
        /**
         * @inheritDoc
         */
        load(url: string): void;
        /**
         * @inheritDoc
         */
        play(startTime?: number, loops?: number): SoundChannel;
        /**
         * @inheritDoc
         */
        close(): void;
    }
}
declare namespace egret.web {
    /**
     * @private
     * @inheritDoc
     */
    class WebAudioSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {
        /**
         * @private
         */
        $url: string;
        /**
         * @private
         */
        $loops: number;
        /**
         * @private
         */
        $startTime: number;
        /**
         * @private
         * audio音频对象
         * @member {any} egret.Sound#audio
         */
        $audioBuffer: AudioBuffer;
        /**
         * @private
         */
        private gain;
        /**
         * @private
         */
        private bufferSource;
        /**
         * @private
         */
        private context;
        private isStopped;
        /**
         * @private
         */
        constructor();
        /**
         * @private
         */
        private _currentTime;
        /**
         * @private
         */
        private _volume;
        $play(): void;
        stop(): void;
        /**
         * @private
         */
        private onPlayEnd;
        /**
         * @private
         * @inheritDoc
         */
        /**
         * @inheritDoc
         */
        volume: number;
        /**
         * @private
         */
        private _startTime;
        /**
         * @private
         * @inheritDoc
         */
        readonly position: number;
    }
}
declare namespace egret.web {
    /**
     * @private
     * @inheritDoc
     */
    class WebVideo extends egret.DisplayObject implements egret.Video {
        /**
         * @inheritDoc
         */
        src: string;
        /**
         * @inheritDoc
         */
        poster: string;
        /**
         * @private
         */
        private posterData;
        /**
         * @private
         */
        private video;
        /**
         * @private
         */
        private loaded;
        /**
         * @private
         */
        private closed;
        /**
         * @private
         */
        private heightSet;
        /**
         * @private
         */
        private widthSet;
        /**
         * @inheritDoc
         */
        constructor(url?: string, cache?: boolean);
        /**
         * @inheritDoc
         */
        load(url?: string, cache?: boolean): void;
        private isPlayed;
        /**
         * @inheritDoc
         */
        play(startTime?: number, loop?: boolean): void;
        private checkFullScreen(playFullScreen);
        private goFullscreen();
        private setFullScreenMonitor(use);
        private screenError();
        private screenChanged;
        private exitFullscreen();
        /**
         * @private
         *
         */
        private onVideoEnded();
        /**
         * @private
         *
         */
        private onVideoError();
        /**
         * @inheritDoc
         */
        close(): void;
        /**
         * @inheritDoc
         */
        pause(): void;
        /**
         * @inheritDoc
         */
        /**
         * @inheritDoc
         */
        volume: number;
        /**
         * @inheritDoc
         */
        /**
         * @inheritDoc
         */
        position: number;
        private _fullscreen;
        /**
         * @inheritDoc
         */
        /**
         * @inheritDoc
         */
        fullscreen: boolean;
        private _bitmapData;
        /**
         * @inheritDoc
         */
        readonly bitmapData: BitmapData;
        private loadPoster();
        /**
         * @private
         *
         */
        private onVideoLoaded;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        private getPlayWidth();
        private getPlayHeight();
        private markDirty();
        /**
         * @private
         * 设置显示高度
         */
        $setHeight(value: number): void;
        /**
         * @private
         * 设置显示宽度
         */
        $setWidth(value: number): void;
        readonly paused: boolean;
        /**
         * @inheritDoc
         */
        readonly length: number;
    }
}
