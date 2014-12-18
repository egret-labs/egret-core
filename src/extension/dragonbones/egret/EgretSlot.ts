/**
 * Created by Chenguang on 2014/12/4.
 */
module dragonBones {
    export class EgretSlot extends Slot {
        private _egretDisplay:egret.DisplayObject;

        public constructor(){
            super(this);

            this._egretDisplay = null;
        }

        public dispose():void{
            var length:number = this._displayList.length;
            for(var i:number = 0;i < length;i++){
                var content:any = this._displayList[i];
                if(content instanceof Armature){
                    (<Armature><any> content).dispose();
                }
            }
            super.dispose();

            this._egretDisplay = null;
        }

        /** @private */
        public _updateDisplay(value:any):void{
            this._egretDisplay = <egret.DisplayObject><any> value;
        }

        //Abstract method

        /** @private */
        public _getDisplayIndex():number{
            if(this._egretDisplay && this._egretDisplay.parent){
                return this._egretDisplay.parent.getChildIndex(this._egretDisplay);
            }
            return -1;
        }

        /** @private */
        public _addDisplayToContainer(container:any, index:number = -1):void{
            var egretContainer:egret.DisplayObjectContainer = <egret.DisplayObjectContainer><any> container;
            if(this._egretDisplay && egretContainer){
                if (index < 0){
                    egretContainer.addChild(this._egretDisplay);
                }
                else{
                    egretContainer.addChildAt(this._egretDisplay, Math.min(index, egretContainer.numChildren));
                }
            }
        }

        /** @private */
        public _removeDisplayFromContainer():void{
            if(this._egretDisplay && this._egretDisplay.parent){
                this._egretDisplay.parent.removeChild(this._egretDisplay);
            }
        }

        /** @private */
        public _updateTransform():void{
            if(this._egretDisplay)
            {
                this._egretDisplay.__hack_local_matrix = this._globalTransformMatrix;
            }
        }

        /** @private */
        public _updateDisplayVisible(value:boolean):void{
            if(this._egretDisplay && this._parent){
                this._egretDisplay.visible = this._parent._visible && this._visible && value;
            }
        }

        /** @private */
        public _updateDisplayColor(
            aOffset:number,
            rOffset:number,
            gOffset:number,
            bOffset:number,
            aMultiplier:number,
            rMultiplier:number,
            gMultiplier:number,
            bMultiplier:number):void{
            super._updateDisplayColor(aOffset, rOffset, gOffset, bOffset, aMultiplier, rMultiplier, gMultiplier, bMultiplier);
            if(this._egretDisplay)
            {
                this._egretDisplay.alpha = aMultiplier;
                //todo apply colorTransform after engine support it.
            }
        }

        /** @private */
        public _updateDisplayBlendMode(value:string):void{
            if(this._egretDisplay && value)
            {
                this._egretDisplay.blendMode = value;
            }
        }
    }
}