/** Created with JetBrains WebStorm.
 * User: yjtx
 * Date: 14-10-8
 * Time: 下午3:44
 * Class: FieldInput
 * Summary:
 */

module egret {
    /**
     * @class egret.TextInput
     * @classdesc
     * TextInput 已废弃，请使用TextField代替，并设置type为TextFieldType.INPUT
     * @extends egret.TextField
     * @deprecated
     */
    export class TextInput extends TextField {

        constructor() {
            super();

            Logger.warning("TextInput 已废弃，请使用TextField代替，并设置type为TextFieldType.INPUT");
            this.type = TextFieldType.INPUT;
        }

        /**
         * 请使用TextField.text设置
         * @deprecated
         * @param value
         */
        public setText(value:string):void {
            Logger.warning("TextField.setText()已废弃，请使用TextInput.text设置");
            this.text = value;
        }

        /**
         * 请使用TextInput.text获取
         * @deprecated
         * @returns {string}
         */
        public getText():string {
            Logger.warning("TextField.getText()已废弃，请使用TextInput.text获取");
            return this.text;
        }

        /**
         * 请使用TextInput.text获取
         * @deprecated
         * @param value
         */
        public setTextType(type:string):void {
            Logger.warning("TextField.setTextType()已废弃，请使用TextInput.type设置");
            this.type = type;
        }

        /**
         * 请使用TextInput.type
         * @deprecated
         * @returns {string}
         */
        public getTextType():string {
            Logger.warning("TextField.getTextType()已废弃，请使用TextInput.type获取");
            return this.type;
        }

    }

}