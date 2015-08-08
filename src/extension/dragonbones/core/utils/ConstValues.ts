//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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


module dragonBones {

	/**
	 * @class dragonBones.ConstValues
	 * @classdesc
	 *定义了常用的常量
	 */
	export class ConstValues{
		/**
		 * 角度转换为弧度
		 */
		public static ANGLE_TO_RADIAN:number = Math.PI / 180;
		/**
		 * 弧度转换为角度
		 */
		public static RADIAN_TO_ANGLE:number = 180 / Math.PI;
		/**
		 *龙骨
		 */
		public static DRAGON_BONES:string = "dragonBones";
		/**
		 * 骨架
		 */
		public static ARMATURE:string = "armature";
		/**
		 *皮肤
		 */
		public static SKIN:string = "skin";
		/**
		 * 骨骼
		 */
		public static BONE:string = "bone";
		/**
		 * 插槽
		 */
		public static SLOT:string = "slot";
		/**
		 * 显示对象
		 */
		public static DISPLAY:string = "display";
		/**
		 * 动画
		 */
		public static ANIMATION:string = "animation";
		/**
		 * 时间轴
		 */
		public static TIMELINE:string = "timeline";
		/**
		 * 帧
		 */
		public static FRAME:string = "frame";
		/**
		 * 变换
		 */
		public static TRANSFORM:string = "transform";
		/**
		 * 颜色变换
		 */
		public static COLOR_TRANSFORM:string = "colorTransform";
		public static COLOR:string = "color";
		/**
		 * 矩形
		 */
		public static RECTANGLE:string = "rectangle";
		/**
		 * 椭圆
		 */
		public static ELLIPSE:string = "ellipse";
		/**
		 * 纹理集
		 */
		public static TEXTURE_ATLAS:string = "TextureAtlas";
		/**
		 * 子纹理
		 */
		public static SUB_TEXTURE:string = "SubTexture";
		/**
		 * 旋转
		 */
		public static A_ROTATED:string = "rotated";
		/**
		 * 帧的x坐标
		 */
		public static A_FRAME_X:string = "frameX";
		/**
		 * 帧的y坐标
		 */
		public static A_FRAME_Y:string = "frameY";
		/**
		 * 帧的宽度
		 */
		public static A_FRAME_WIDTH:string = "frameWidth";
		/**
		 * 帧的高度
		 */
		public static A_FRAME_HEIGHT:string = "frameHeight";
		/**
		 * 版本
		 */
		public static A_VERSION:string = "version";
		/**
		 * 图片路径
		 */
		public static A_IMAGE_PATH:string = "imagePath";
		/**
		 * 帧速率
		 */
		public static A_FRAME_RATE:string = "frameRate";
		/**
		 * 名字
		 */
		public static A_NAME:string = "name";
		/**
		 * 是否是全局
		 */
        public static A_IS_GLOBAL:string = "isGlobal";
		/**
		 * 父亲
		 */
		public static A_PARENT:string = "parent";
		/**
		 * 长度
		 */
		public static A_LENGTH:string = "length";
		/**
		 * 类型
		 */
		public static A_TYPE:string = "type";
		/**
		 * 缓入事件
		 */
		public static A_FADE_IN_TIME:string = "fadeInTime";
		/**
		 * 持续时长
		 */
		public static A_DURATION:string = "duration";
		/**
		 * 缩放
		 */
		public static A_SCALE:string = "scale";
		/**
		 * 偏移
		 */
		public static A_OFFSET:string = "offset";
		/**
		 * 循环
		 */
		public static A_LOOP:string = "loop";
        public static A_PLAY_TIMES: string = "playTimes";
		/**
		 * 事件
		 */
		public static A_EVENT:string = "event";
		/**
		 * 事件参数
		 */
		public static A_EVENT_PARAMETERS:string = "eventParameters";
		/**
		 * 声音
		 */
		public static A_SOUND:string = "sound";
		/**
		 * 动作
		 */
		public static A_ACTION:string = "action";
		/**
		 * 隐藏
		 */
		public static A_HIDE:string = "hide";
		/**
		 * 自动补间
		 */
		public static A_AUTO_TWEEN:string ="autoTween";
		/**
		 * 补间缓动
		 */
		public static A_TWEEN_EASING:string = "tweenEasing";
		/**
		 * 补间旋转
		 */
		public static A_TWEEN_ROTATE:string = "tweenRotate";
		/**
		 * 补间缩放
		 */
		public static A_TWEEN_SCALE:string = "tweenScale";
		/**
		 * 显示对象序号
		 */
		public static A_DISPLAY_INDEX:string = "displayIndex";
		/**
		 * z轴
		 */
		public static A_Z_ORDER:string = "z";
		/**
		 * 混合模式
		 */
        public static A_BLENDMODE:string = "blendMode";
		/**
		 * 宽度
		 */
		public static A_WIDTH:string = "width";
		/**
		 * 高度
		 */
		public static A_HEIGHT:string = "height";
		/**
		 * 继承缩放
		 */
		public static A_INHERIT_SCALE:string = "inheritScale";
		/**
		 * 继承旋转
		 */
		public static A_INHERIT_ROTATION:string = "inheritRotation";
		/**
		 * x轴
		 */
		public static A_X:string = "x";
		/**
		 * y轴
		 */
		public static A_Y:string = "y";
		/**
		 * x方向斜切
		 */
		public static A_SKEW_X:string = "skX";
		/**
		 * y方向斜切
		 */
		public static A_SKEW_Y:string = "skY";
		/**
		 * x方向缩放
		 */
		public static A_SCALE_X:string = "scX";
		/**
		 * y方向缩放
		 */
		public static A_SCALE_Y:string = "scY";
		/**
		 * 轴点的x坐标
		 */
		public static A_PIVOT_X:string = "pX";
		/**
		 * 轴点的y坐标
		 */
		public static A_PIVOT_Y:string = "pY";
		/**
		 * 透明度的偏移
		 */
		public static A_ALPHA_OFFSET:string = "aO";
		/**
		 * 红色的偏移
		 */
		public static A_RED_OFFSET:string = "rO";
		/**
		 * 绿色的偏移
		 */
		public static A_GREEN_OFFSET:string = "gO";
		/**
		 * 蓝色的偏移
		 */
		public static A_BLUE_OFFSET:string = "bO";
		/**
		 * 透明度的倍数
		 */
		public static A_ALPHA_MULTIPLIER:string = "aM";
		/**
		 * 红色的倍数
		 */
		public static A_RED_MULTIPLIER:string = "rM";
		/**
		 * 绿色的倍数
		 */
		public static A_GREEN_MULTIPLIER:string = "gM";
		/**
		 * 蓝色的倍数
		 */
		public static A_BLUE_MULTIPLIER:string = "bM";
		/**
		 * 动画曲线
		 */
		 public static A_CURVE:string = "curve";
		/**
		 * x方向缩放的偏移
		 */
		public static A_SCALE_X_OFFSET:string = "scXOffset";
		/**
		 * y方向的偏移
		 */
		public static A_SCALE_Y_OFFSET:string = "scYOffset";
		/**
		 * 缩放模式
		 */
		public static A_SCALE_MODE:string = "scaleMode";
		/**
		 * 旋转修正
		 */
		public static A_FIXED_ROTATION:string = "fixedRotation";
	}
}