
module egret.gui {

	export class TextInput extends SkinnableTextBase{
		/**
		 * 构造函数
		 */		
		public constructor(){
            super();
            this.hostComponentKey = "egret.gui.TextInput";
		}
		
		/**
		 * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
		 */		
		public get widthInChars():number{
            return super._getWidthInChars();
		}
		
		public set widthInChars(value:number){
            super._setWidthInChars(value);
		}
		
		/**
		 * @inheritDoc
		 */
		public set text(value:string){
            super._setText(value);
			this.dispatchEvent(new Event(Event.CHANGE));
        }
        /**
         * @inheritDoc
         */
        public get text() {
            return this._getText();
        }
		
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.textDisplay){
				this.textDisplay.multiline = false;
				//if(this.textDisplay is IViewport)
				//	(<IViewport><any> (this.textDisplay)).clipAndEnableScrolling = false;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public createSkinParts():void{
			this.textDisplay = new EditableText();
			this.textDisplay.widthInChars = 10;
			this.textDisplay.left = 1;
			this.textDisplay.right = 1;
			this.textDisplay.top = 1;
			this.textDisplay.bottom = 1;
			this._addToDisplayList(<DisplayObject><any> (this.textDisplay));
			this.partAdded("textDisplay",this.textDisplay);
		}
	}
}