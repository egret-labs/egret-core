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

/**
 *  GUI 组件示例
 *  逻辑类:    src/scene/Showcase.ts
 *  皮肤:      src/skins/scene/ShowcaseSkin.exml
 *
 *  GUI component showcase
 *  Logic class:    src/scene/Showcase.ts
 *  Skin:           src/skins/scene/ShowcaseSkin.exml
 */
class Showcase extends egret.gui.SkinnableComponent {

    public constructor() {
        super();

        //  指定当前类的皮肤名称
        //  Assign the skin name used by this Component
        this.skinName = "skins.scene.ShowcaseSkin";
        this.initListData();
    }


    /*
     在皮肤中（skins/scene/ShowcaseSkin.exml），如果组件有 id 属性，
     那么皮肤中的这个组件会被赋值给逻辑类（Showcase）中与这个 id 同名
     的属性（皮肤部件）。
     由于皮肤绑定的过程是延迟处理的，在构造函数并不能访问这些属性。
     你可以在 "childrenCreated" 方法中使用这些组件。

     Components in the skin（skins/scene/ShowcaseSkin.exml） with "id"
     will be assigned to the properties with the same name （aka Skin Parts）
     in the logic class（Showcase）.
     As the skin is created after the constructor, you should not use
     them in the constructor. You can use these components in the
     "childrenCreated" method.
     */

    /**
     * [SkinPart]
     *  点击显示 list 中选择的数据
     *  A button, click to show the selection of the list
     *
     *      "ShowcaseSkin.exml" :
     *      <e:Button id="btnShowMessage" label="click" y="539" horizontalCenter="0"/>
     */
    public btnShowMessage:egret.gui.Button;


    /**
     * [SkinPart]
     *  List 组件
     *  A list to show some data
     *
     *      "ShowcaseSkin.exml" :
     *      <e:List id="list"  height="255"  skinName="skins.simple.ListSkin" y="141" ...
     */
    public list:egret.gui.List;


    private dataSource:Array<any> = [];

    private initListData():void {
        for (var i:number = 1; i < 50; i++) {
            this.dataSource.push({label: "List Item " + i});
        }
    }


    /**
     所有子项和皮肤中的组件都已经创建完毕并完成测量，可以使用

     All the components in the children and skin have been
     created and measured, you can use them now.
     */
    public childrenCreated() {
        this.btnShowMessage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);
        this.list.addEventListener(egret.gui.IndexChangeEvent.CHANGE, this.onListSelectionChange, this);
    }

    /**
     partAdded 是皮肤部件赋值到逻辑类的入口，你可以在这里进行
     必要的初始化操作。比如需要随屏幕改变组件的尺寸，写在这里
     可以避免写在 childrenCreated 中修改造成的多次测量。


     The method "partAdded" will be called just after the
     skin parts is assigned to the property. You can make
     changes will effect to the layout or other components.
     */
    public partAdded(partName:string, instance:any):void {
        super.partAdded(partName, instance);
        if (instance == this.list) {
            this.list.height = this.stage.stageHeight - 300;
            this.list.dataProvider = new egret.gui.ArrayCollection(this.dataSource);
        }
    }

    private onButtonClick(event:egret.TouchEvent):void {
        var selection = this.list.selectedItem ? this.list.selectedItem.label : "nothing";
        egret.gui.Alert.show("You have selected " + selection, "Title");
    }

    private onListSelectionChange(event:egret.gui.IndexChangeEvent):void {
        console.log("You have selected " + this.list.selectedItem.label);
    }
}