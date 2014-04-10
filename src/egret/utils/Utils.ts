/**
 * Created by apple on 14-4-10.
 */
module ns_egret{

    /**
     * 返回一个对象的完全限定名
     * @param value 需要完全限定类名称的对象，可以将任何 TypeScript / JavaScript值传递给此方法，包括所有可用的TypeScript / JavaScript类型、对象实例、原始类型（如number）和类对象
     * @returns {string} 包含完全限定类名称的字符串
     * @example
     *  ns_egret.getQualifiedClassName(ns_egret.DisplayObject) //返回 DisplayObject
     *  ns_egret.getQualifiedClassName(new ns_egret.DisplayObject()) //返回 DisplayObject
     *  ns_egret.getQualifiedClassName(19910901) //返回 Number
     *  ns_egret.getQualifiedClassName("Hello,Egret") //返回 String
     */
    export function getQualifiedClassName(value:any){
        var constructorString:string;
        if (value.prototype){
            constructorString = value.prototype.constructor.toString();
        }
        else{
            constructorString = value.__proto__.constructor.toString();

        }
        var index:number = constructorString.indexOf("(");
        var result:string = constructorString.substring(9,index);
        return result;
    }


}