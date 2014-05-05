module ns_egret {
    export class NumberUtils {
        public static isNumber(value:any):Boolean {
            return typeof(value) === "number" && !isNaN(value);
        }
    }
}
