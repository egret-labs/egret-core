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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 *  GUI 组件示例
 *  逻辑类:    src/scene/Showcase.ts
 *  皮肤:      src/skins/scene/ShowcaseSkin.exml
 *
 *  GUI component showcase
 *  Logic class:    src/scene/Showcase.ts
 *  Skin:           src/skins/scene/ShowcaseSkin.exml
 */
var Showcase = (function (_super) {
    __extends(Showcase, _super);
    function Showcase() {
        _super.call(this);
        this.dataSource = [];
        //  指定当前类的皮肤名称
        //  Assign the skin name used by this Component
        this.skinName = "skins.scene.ShowcaseSkin";
        this.initListData();
    }
    Showcase.prototype.initListData = function () {
        for (var i = 1; i < 50; i++) {
            this.dataSource.push({ label: "List Item " + i });
        }
    };
    /**
     所有子项和皮肤中的组件都已经创建完毕并完成测量，可以使用

     All the components in the children and skin have been
     created and measured, you can use them now.
     */
    Showcase.prototype.childrenCreated = function () {
        this.btnShowMessage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        this.list.addEventListener(egret.gui.IndexChangeEvent.CHANGE, this.onListSelectionChange, this);
    };
    /**
     partAdded 是皮肤部件赋值到逻辑类的入口，你可以在这里进行
     必要的初始化操作。比如需要随屏幕改变组件的尺寸，写在这里
     可以避免写在 childrenCreated 中修改造成的多次测量。


     The method "partAdded" will be called just after the
     skin parts is assigned to the property. You can make
     changes will effect to the layout or other components.
     */
    Showcase.prototype.partAdded = function (partName, instance) {
        _super.partAdded.call(this, partName, instance);
        if (instance == this.list) {
            this.list.height = this.stage.stageHeight - 300;
            this.list.dataProvider = new egret.gui.ArrayCollection(this.dataSource);
        }
    };
    Showcase.prototype.onButtonClick = function (event) {
        var selection = this.list.selectedItem ? this.list.selectedItem.label : "nothing";
        egret.gui.Alert.show("You have selected " + selection, "Title");
    };
    Showcase.prototype.onListSelectionChange = function (event) {
        console.log("You have selected " + this.list.selectedItem.label);
    };
    return Showcase;
})(egret.gui.SkinnableComponent);
//# sourceMappingURL=Showcase.js.map