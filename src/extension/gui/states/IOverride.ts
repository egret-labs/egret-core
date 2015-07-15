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


module egret.gui {

	/**
	 * @class egret.gui.IOverride
	 * @interface
	 * @classdesc
	 * IOverride 接口用于视图状态覆盖。State 类 overrides 属性数组中的所有条目均必须实现此接口。
	 */	
	export interface IOverride{
		/**
		 * 初始化覆盖。在第一次调用 apply() 方法之前调用此方法，因此将覆盖的一次性初始化代码放在此方法中。 
		 * @method egret.gui.IOverride#initialize
		 * @param parent {IStateClient} 
		 */		 
		initialize(parent:IStateClient):void;
		/**
		 * 应用覆盖。将保留原始值，以便以后可以在 remove() 方法中恢复该值。 
		 * @method egret.gui.IOverride#apply
		 * @param parent {IContainer} 
		 */			
		apply(parent:IContainer):void;
		/**
		 * 删除覆盖。在 apply() 方法中记住的值将被恢复。 
		 * @method egret.gui.IOverride#remove
		 * @param parent {IContainer} 
		 */		
		remove(parent:IContainer):void;
	}
}