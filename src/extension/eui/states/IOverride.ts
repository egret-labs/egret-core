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


module eui {

	/**
	 * @language en_US
	 * The IOverride interface is used for view state overrides.
	 * All entries in the State class <code>overrides</code>
	 * property array must implement this interface.
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	/**
	 * @language zh_CN
	 * IOverride 接口定义视图状态的覆盖操作。State 类 overrides 属性数组中的所有条目均必须实现此接口。
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	export interface IOverride{
		/**
		 * @language en_US
		 * Applies the override. Retains the original value, so that it can
		 * restore the value later in the <code>remove()</code> method.<p/>
		 *
		 * This method is called automatically when the state is entered.
		 * It should not be called directly.
		 *
		 * @param host A component that contains view states.
		 * @param parent The parent that a sub element be added.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 应用覆盖。将保留原始值，以便以后可以在 remove() 方法中恢复该值。<p/>
		 *
		 * 该方法是当进入状态的时候自动调用的，请不要直接调用此方法。
		 * @param host 含有视图状态的组件。
		 * @param parent 子项添加到的父级容器。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		apply(host:any,parent:egret.DisplayObjectContainer):void;
		/**
		 * @language en_US
		 * Removes the override. The value remembered in the <code>apply()</code>
		 * method is restored. </p>
		 *
		 * This method is called automatically when the state is entered.
		 * It should not be called directly.
		 * @param host A component that contains view states.
		 * @param parent The parent that a sub element be added.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 删除覆盖。在 apply() 方法中记住的值将被恢复。
		 * @param host 含有视图状态的组件。
		 * @param parent 子项添加到的父级容器。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		remove(host:any,parent:egret.DisplayObjectContainer):void;
	}
}