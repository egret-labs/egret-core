/// <reference path="../components/Button.ts"/>
/// <reference path="../../egret.d.ts"/>

module code.skins{
	export class Panel extends egret.Skin{
		public __10:egret.CheckBox;
		public __9:egret.Button;
		public checkBox:egret.ToggleButton;
		public dp:egret.ArrayCollection;
		public dropDownList:egret.DropDownList;
		public label:egret.Label;
		public progressBar:egret.ProgressBar;
		public radioButton:egret.RadioButton;
		public titleWindow:egret.TitleWindow;

		public constructor(){
			super();
			
			this.height = 402;
			this.width = 628;
			this.dp_i();
			this.elementsContent = [this.titleWindow_i()];
			this.__9_i();
			this.__10_i();
			
			
			this.states = [
				new egret.State ("normal",
					[
						new egret.AddItems("__9","titleWindow","first",""),
						new egret.AddItems("__10","titleWindow","before","dropDownList")
					])
				,
				new egret.State ("disabled",
					[
					])
			];
		}

		private  __10_i():egret.CheckBox{
			var t:egret.CheckBox = new egret.CheckBox();
			this.__10 = t;
			t.label = "复选框";
			t.x = 105;
			t.y = 11;
			return t;
		}
		private  __11_i():egret.VSlider{
			var t:egret.VSlider = new egret.VSlider();
			t.height = 124;
			t.value = 0.5;
			t.x = 169;
			t.y = 65;
			return t;
		}
		private  __12_i():ns_project.Button{
			var t:ns_project.Button = new ns_project.Button();
			t.label = "按钮";
			t.x = "100";
			t.y = "37";
			return t;
		}
		private  __9_i():egret.Button{
			var t:egret.Button = new egret.Button();
			this.__9 = t;
			t.label = "按钮";
			t.x = 54;
			t.y = 11;
			return t;
		}
		private  checkBox_i():egret.ToggleButton{
			var t:egret.ToggleButton = new egret.ToggleButton();
			this.checkBox = t;
			t.label = "切换按钮";
			t.width = 69;
			t.x = 163;
			t.y = 10;
			return t;
		}
		private  dp_i():egret.ArrayCollection{
			var t:egret.ArrayCollection = new egret.ArrayCollection();
			this.dp = t;
			t.source = ["ComboBox","DropDownList"];
			return t;
		}
		private  dropDownList_i():egret.DropDownList{
			var t:egret.DropDownList = new egret.DropDownList();
			this.dropDownList = t;
			t.dataProvider = this.dp;
			t.prompt = "下拉列表";
			t.width = 85;
			t.x = 232;
			t.y = 64;
			return t;
		}
		private  label_i():egret.Label{
			var t:egret.Label = new egret.Label();
			this.label = t;
			t.text = "标签";
			t.x = 15;
			t.y = 14;
			return t;
		}
		private  progressBar_i():egret.ProgressBar{
			var t:egret.ProgressBar = new egret.ProgressBar();
			this.progressBar = t;
			t.value = 50;
			t.width = 304;
			t.x = 14;
			t.y = 214;
			return t;
		}
		private  radioButton_i():egret.RadioButton{
			var t:egret.RadioButton = new egret.RadioButton();
			this.radioButton = t;
			t.label = "单选按钮";
			t.selected = true;
			t.x = 251;
			t.y = 11;
			return t;
		}
		private  titleWindow_i():egret.TitleWindow{
			var t:egret.TitleWindow = new egret.TitleWindow();
			this.titleWindow = t;
			t.height = 287;
			t.title = "TitleWindow";
			t.width = 336;
			t.x = 161;
			t.y = 60;
			t.elementsContent = [this.__9_i(),this.__10_i(),this.dropDownList_i(),this.checkBox_i(),this.__11_i(),this.progressBar_i(),this.label_i(),this.radioButton_i(),this.__12_i()];
			return t;
		}
	}
}