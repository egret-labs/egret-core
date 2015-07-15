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
	 * @class egret.gui.IEditableText
	 * @interface
	 * @classdesc
	 * 可编辑文本控件接口
	 * @extends egret.gui.IDisplayText
	 */	
	export interface IEditableText extends IDisplayText{ 
        /**
         * 文本颜色。
         * @member egret.gui.IEditableText#textColor
         */
        textColor: number;
        /**
         * 指定文本字段是否是密码文本字段。如果此属性的值为 true，则文本字段被视为密码文本字段，
         * 并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
         * 启用密码模式时，“剪切”和“复制”命令及其对应的键盘快捷键将不起作用。
         * 此安全机制可防止不良用户使用快捷键在无人看管的计算机上破译密码。
         * @member egret.gui.IEditableText#displayAsPassword
         */
        displayAsPassword: boolean;

        /**
         * 文本是否可编辑的标志。
         * @member egret.gui.IEditableText#editable
         */
        editable: boolean;

        /**
         * 文本字段中最多可包含的字符数（即用户输入的字符数）。
         * 脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。
         * 如果此属性的值为 0，则用户可以输入无限数量的文本。
         * @member egret.gui.IEditableText#maxChars
         */
        maxChars: number;

        /**
         * 表示字段是否为多行文本字段。如果值为 true，则文本字段为多行文本字段；
         * 如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，
         * multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。
         * 如果将文本粘贴到其 multiline 值为 false 的 TextField 中，则文本中将除去新行。
         * @member egret.gui.IEditableText#multiline
         */
        multiline: boolean;

        /**
         * 表示用户可输入到文本字段中的字符集。如果 restrict 属性的值为 null，则可以输入任何字符。
         * 如果 restrict 属性的值为空字符串，则不能输入任何字符。如果 restrict 属性的值为一串字符，
         * 则只能在文本字段中输入该字符串中的字符。从左向右扫描该字符串。可以使用连字符 (-) 指定一个范围。
         * 只限制用户交互；脚本可将任何文本放入文本字段中。此属性不与属性检查器中的“嵌入字体”选项同步。 <p/>
         * 如果字符串以尖号 (ˆ) 开头，则先接受所有字符，然后从接受字符集中排除字符串中 ˆ 之后的字符。
         * 如果字符串不以尖号 (ˆ) 开头，则最初不接受任何字符，然后将字符串中的字符包括在接受字符集中。
         * @member egret.gui.IEditableText#restrict
         */
        restrict: string;

        /**
         * 一个布尔值，表示文本字段是否可选。值 true 表示文本可选。selectable 属性控制文本字段是否可选，
         * 而不控制文本字段是否可编辑。动态文本字段即使不可编辑，它也可能是可选的。
         * 如果动态文本字段是不可选的，则用户不能选择其中的文本。 <p/>
         * 如果 selectable 设置为 false，则文本字段中的文本不响应来自鼠标或键盘的选择命令，
         * 并且不能使用“复制”命令复制文本。如果 selectable 设置为 true，则可以使用鼠标或键盘选择文本字段中的文本，
         * 并且可以使用“复制”命令复制文本。即使文本字段是动态文本字段而不是输入文本字段，您也可以用这种方式选择文本。 
         * @member egret.gui.IEditableText#selectable
         */
        selectable: boolean;

        /**
         * 当前所选内容中第一个字符从零开始的字符索引值。例如，第一个字符的索引值是 0，第二个字符的索引值是 1，
         * 依此类推。如果未选定任何文本，此属性为 caretIndex 的值。
         * @member egret.gui.IEditableText#selectionBeginIndex
         */
        selectionBeginIndex: number;

        /**
         * 当前所选内容中最后一个字符从零开始的字符索引值。例如，第一个字符的索引值是 0，第二个字符的索引值是 1，
         * 依此类推。如果未选定任何文本，此属性为 caretIndex 的值。
         * @member egret.gui.IEditableText#selectionEndIndex
         */
        selectionEndIndex: number;

        /**
         * 插入点（尖号）位置的索引。如果没有显示任何插入点，则在将焦点恢复到字段时，
         * 值将为插入点所在的位置（通常为插入点上次所在的位置，如果字段不曾具有焦点，则为 0）。<p/>
         * 选择范围索引是从零开始的（例如，第一个位置为 0、第二个位置为 1，依此类推）。
         * @member egret.gui.IEditableText#caretIndex
         */
        caretIndex: number;

        /**
         * 将第一个字符和最后一个字符的索引值（使用 beginIndex 和 endIndex 参数指定）指定的文本设置为所选内容。
         * 如果两个参数值相同，则此方法会设置插入点，就如同设置 caretIndex 属性一样。
         * @method egret.gui.IEditableText#setSelection
         * @param beginIndex {number} 所选内容中第一个字符从零开始的索引值（例如，第一个字符的索引值是 0，第二个字符的索引值是 1，依此类推）。
         * @param endIndex {number} 所选内容中最后一个字符从零开始的索引值。
         */
        setSelection(beginIndex: number, endIndex: number): void;

        /**
         * 选中所有文本。
         * @method egret.gui.IEditableText#selectAll
         */
        selectAll(): void;

        /**
         * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
         * @member egret.gui.IEditableText#widthInChars
         */
        widthInChars: number;

        /**
         * 控件的默认高度（以行为单位测量）。 若设置了multiline属性为false，则忽略此属性。
         * @member egret.gui.IEditableText#heightInLines
         */
        heightInLines: number;

        setFocus(): void;
	}
}