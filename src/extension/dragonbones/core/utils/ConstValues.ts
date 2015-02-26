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

	/**
	 * @class dragonBones.ConstValues
	 * @classdesc
	 *定义了常用的常量
	 */
	export class ConstValues{
		/**
		 * 角度转换为弧度
		 * @type {number}
		 */
		public static ANGLE_TO_RADIAN:number = Math.PI / 180;
		/**
		 * 弧度转换为角度
		 * @type {number}
		 */
		public static RADIAN_TO_ANGLE:number = 180 / Math.PI;
		/**
		 *龙骨
		 * @type {string}
		 */
		public static DRAGON_BONES:string = "dragonBones";
		/**
		 * 骨架
		 * @type {string}
		 */
		public static ARMATURE:string = "armature";
		/**
		 *皮肤
		 * @type {string}
		 */
		public static SKIN:string = "skin";
		/**
		 * 骨骼
		 * @type {string}
		 */
		public static BONE:string = "bone";
		/**
		 * 插槽
		 * @type {string}
		 */
		public static SLOT:string = "slot";
		/**
		 * 显示对象
		 * @type {string}
		 */
		public static DISPLAY:string = "display";
		/**
		 * 动画
		 * @type {string}
		 */
		public static ANIMATION:string = "animation";
		/**
		 * 时间轴
		 * @type {string}
		 */
		public static TIMELINE:string = "timeline";
		/**
		 * 帧
		 * @type {string}
		 */
		public static FRAME:string = "frame";
		/**
		 * 变换
		 * @type {string}
		 */
		public static TRANSFORM:string = "transform";
		/**
		 * 颜色变换
		 * @type {string}
		 */
		public static COLOR_TRANSFORM:string = "colorTransform";
		/**
		 * 矩形
		 * @type {string}
		 */
		public static RECTANGLE:string = "rectangle";
		/**
		 * 椭圆
		 * @type {string}
		 */
		public static ELLIPSE:string = "ellipse";
		/**
		 * 纹理集
		 * @type {string}
		 */
		public static TEXTURE_ATLAS:string = "TextureAtlas";
		/**
		 * 子纹理
		 * @type {string}
		 */
		public static SUB_TEXTURE:string = "SubTexture";
		/**
		 * 旋转
		 * @type {string}
		 */
		public static A_ROTATED:string = "rotated";
		/**
		 * 帧的x坐标
		 * @type {string}
		 */
		public static A_FRAME_X:string = "frameX";
		/**
		 * 帧的y坐标
		 * @type {string}
		 */
		public static A_FRAME_Y:string = "frameY";
		/**
		 * 帧的宽度
		 * @type {string}
		 */
		public static A_FRAME_WIDTH:string = "frameWidth";
		/**
		 * 帧的高度
		 * @type {string}
		 */
		public static A_FRAME_HEIGHT:string = "frameHeight";
		/**
		 * 版本
		 * @type {string}
		 */
		public static A_VERSION:string = "version";
		/**
		 * 图片路径
		 * @type {string}
		 */
		public static A_IMAGE_PATH:string = "imagePath";
		/**
		 * 帧速率
		 * @type {string}
		 */
		public static A_FRAME_RATE:string = "frameRate";
		/**
		 * 名字
		 * @type {string}
		 */
		public static A_NAME:string = "name";
		/**
		 * 是否是全局
		 * @type {string}
		 */
        public static A_IS_GLOBAL:string = "isGlobal";
		/**
		 * 父亲
		 * @type {string}
		 */
		public static A_PARENT:string = "parent";
		/**
		 * 长度
		 * @type {string}
		 */
		public static A_LENGTH:string = "length";
		/**
		 * 类型
		 * @type {string}
		 */
		public static A_TYPE:string = "type";
		/**
		 * 缓入事件
		 * @type {string}
		 */
		public static A_FADE_IN_TIME:string = "fadeInTime";
		/**
		 * 持续时长
		 * @type {string}
		 */
		public static A_DURATION:string = "duration";
		/**
		 * 缩放
		 * @type {string}
		 */
		public static A_SCALE:string = "scale";
		/**
		 * 偏移
		 * @type {string}
		 */
		public static A_OFFSET:string = "offset";
		/**
		 * 循环
		 * @type {string}
		 */
		public static A_LOOP:string = "loop";
		/**
		 * 事件
		 * @type {string}
		 */
		public static A_EVENT:string = "event";
		/**
		 * 事件参数
		 * @type {string}
		 */
		public static A_EVENT_PARAMETERS:string = "eventParameters";
		/**
		 * 声音
		 * @type {string}
		 */
		public static A_SOUND:string = "sound";
		/**
		 * 动作
		 * @type {string}
		 */
		public static A_ACTION:string = "action";
		/**
		 * 隐藏
		 * @type {string}
		 */
		public static A_HIDE:string = "hide";
		/**
		 * 自动补间
		 * @type {string}
		 */
		public static A_AUTO_TWEEN:string ="autoTween";
		/**
		 * 补间缓动
		 * @type {string}
		 */
		public static A_TWEEN_EASING:string = "tweenEasing";
		/**
		 * 补间旋转
		 * @type {string}
		 */
		public static A_TWEEN_ROTATE:string = "tweenRotate";
		/**
		 * 补间缩放
		 * @type {string}
		 */
		public static A_TWEEN_SCALE:string = "tweenScale";
		/**
		 * 显示对象序号
		 * @type {string}
		 */
		public static A_DISPLAY_INDEX:string = "displayIndex";
		/**
		 * z轴
		 * @type {string}
		 */
		public static A_Z_ORDER:string = "z";
		/**
		 * 混合模式
		 * @type {string}
		 */
        public static A_BLENDMODE:string = "blendMode";
		/**
		 * 宽度
		 * @type {string}
		 */
		public static A_WIDTH:string = "width";
		/**
		 * 高度
		 * @type {string}
		 */
		public static A_HEIGHT:string = "height";
		/**
		 * 继承缩放
		 * @type {string}
		 */
		public static A_INHERIT_SCALE:string = "inheritScale";
		/**
		 * 继承旋转
		 * @type {string}
		 */
		public static A_INHERIT_ROTATION:string = "inheritRotation";
		/**
		 * x轴
		 * @type {string}
		 */
		public static A_X:string = "x";
		/**
		 * y轴
		 * @type {string}
		 */
		public static A_Y:string = "y";
		/**
		 * x方向斜切
		 * @type {string}
		 */
		public static A_SKEW_X:string = "skX";
		/**
		 * y方向斜切
		 * @type {string}
		 */
		public static A_SKEW_Y:string = "skY";
		/**
		 * x方向缩放
		 * @type {string}
		 */
		public static A_SCALE_X:string = "scX";
		/**
		 * y方向缩放
		 * @type {string}
		 */
		public static A_SCALE_Y:string = "scY";
		/**
		 * 轴点的x坐标
		 * @type {string}
		 */
		public static A_PIVOT_X:string = "pX";
		/**
		 * 轴点的y坐标
		 * @type {string}
		 */
		public static A_PIVOT_Y:string = "pY";
		/**
		 * 透明度的偏移
		 * @type {string}
		 */
		public static A_ALPHA_OFFSET:string = "aO";
		/**
		 * 红色的偏移
		 * @type {string}
		 */
		public static A_RED_OFFSET:string = "rO";
		/**
		 * 绿色的偏移
		 * @type {string}
		 */
		public static A_GREEN_OFFSET:string = "gO";
		/**
		 * 蓝色的偏移
		 * @type {string}
		 */
		public static A_BLUE_OFFSET:string = "bO";
		/**
		 * 透明度的倍数
		 * @type {string}
		 */
		public static A_ALPHA_MULTIPLIER:string = "aM";
		/**
		 * 红色的倍数
		 * @type {string}
		 */
		public static A_RED_MULTIPLIER:string = "rM";
		/**
		 * 绿色的倍数
		 * @type {string}
		 */
		public static A_GREEN_MULTIPLIER:string = "gM";
		/**
		 * 蓝色的倍数
		 * @type {string}
		 */
		public static A_BLUE_MULTIPLIER:string = "bM";
		/**
		 * x方向缩放的偏移
		 * @type {string}
		 */
		public static A_SCALE_X_OFFSET:string = "scXOffset";
		/**
		 * y方向的偏移
		 * @type {string}
		 */
		public static A_SCALE_Y_OFFSET:string = "scYOffset";
		/**
		 * 缩放模式
		 * @type {string}
		 */
		public static A_SCALE_MODE:string = "scaleMode";
		/**
		 * 旋转修正
		 * @type {string}
		 */
		public static A_FIXED_ROTATION:string = "fixedRotation";
	}
}