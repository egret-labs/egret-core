module ns_egret {
    export class NumberUtils {
        public static isNumber(value:any):Boolean {
            return true;
            return typeof(value) === "number" && !isNaN(value);
        }
    }
}
