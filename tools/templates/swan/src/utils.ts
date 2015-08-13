/**
 * Created by yjtx on 15-8-10.
 */
module utils {
    export function createClass(className):any {
        return new (egret.getDefinitionByName(className))();
    }
}