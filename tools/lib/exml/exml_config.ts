/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/// <reference path="node.d.ts"/>

var file = require("../core/file.js");
var xml = require("../core/xml.js");
var param = require("../core/params_analyze.js");
var properties = require("./properties.json");
var CodeUtil = require("../core/code_util.js");
var create_manifest = require("../tools/create_manifest.js");

class EXMLConfig{

    /**
     * Egret命名空间
     */
    public static E:string = "http://ns.egret-labs.org/egret";
    /**
     * Wing命名空间
     */
    public static W:string = "http://ns.egret-labs.org/wing";
    /**
     * 构造函数
     */
    public constructor(){
        var exmlPath:string = param.getEgretPath()+"/tools/lib/exml/";
        exmlPath = exmlPath.split("\\").join("/");
        var str:string = file.read(exmlPath+"egret-manifest.xml");
        var manifest:any = xml.parse(str);
        this.parseManifest(manifest);
    }

    public srcPath:string;

    /**
     * 组件清单列表
     */
    public componentDic:any = {};
    /**
     * 解析框架清单文件
     */
    public parseManifest(manifest:any):void{

        var children:Array<any> = manifest.children;
        var length:number = children.length;
        for(var i:number=0;i<length;i++){
            var item:any = children[i];
            var component:Component = new Component(item);
            this.componentDic[component.className] = component;
        }
        for(var className in this.componentDic){
            var component:Component = this.componentDic[className];
            if(!component.defaultProp)
                this.findProp(component);
        }
    }
    /**
     * 递归查找默认属性
     */
    private findProp(component:Component):string{
        if(component.defaultProp)
            return component.defaultProp;
        var superComp:Component = this.componentDic[component.superClass];
        if(superComp){
            var prop:string = this.findProp(superComp);
            if(prop){
                component.defaultProp = prop;
            }
        }
        return component.defaultProp;
    }

    private classNameToPath:any;
    /**
     * @inheritDoc
     */
    public getClassNameById(id:string, ns:string):string{
        var name:string = "";
        if(this.basicTypes.indexOf(id)!=-1){
            return id;
        }
        if(ns==EXMLConfig.W){

        }
        else if(!ns||ns==EXMLConfig.E){
            name = "egret."+id;
            if(!this.componentDic[name]){
                name = "";
            }
        }
        else{
            name = ns.substring(0,ns.length-1)+id
            if(!this.classNameToPath){
                this.classNameToPath = create_manifest.getClassToPathInfo(this.srcPath);
            }
            if(!this.classNameToPath[name]){
                name = "";
            }
        }
        return name;
    }
    /**
     * 检查一个类名是否存在
     */
    public checkClassName(className:string):boolean{
        if(this.componentDic[className]){
            return true;
        }
        if(!this.classNameToPath){
            this.classNameToPath = create_manifest.getClassToPathInfo(this.srcPath);
        }
        if(this.classNameToPath[name]){
            return true;
        }
        return false;
    }
    /**
     * @inheritDoc
     */
    public getDefaultPropById(id:string, ns:string):string{
        var className:string = this.getClassNameById(id,ns);
        var component:Component = this.componentDic[className];
        if(!component&&className){
            component = this.findDefaultProp(className);
        }
        if(!component)
            return "";
        return component.defaultProp;
    }

    private findDefaultProp(className:string):Component{
        var classData:any = properties[className];
        if(!classData){
            var path:string = this.classNameToPath[className];
            var ext:string = file.getExtension(path).toLowerCase();
            var text:string = file.read(path);
            if(ext=="ts"){
                classData = this.getPropertiesFromTs(text,className);
            }
            else if(ext=="exml"){
                classData = this.getPropertiesFromExml(text);
            }
            if(classData){
                properties[className] = classData;
            }
            else{
                return null;
            }
        }
        var superClass:string = classData["super"];
        var component:Component = this.componentDic[superClass];
        if(!component){
            component = this.findDefaultProp(superClass);
        }
        return component;
    }

    /**
     * 获取指定类指定属性的类型
     */
    public getPropertyType(prop:string,className:string):string{
        if(className=="Object"){
            return "any";
        }
        var type:string = this.findType(className,prop);
        return type;
    }

    private findType(className:string,prop:string):string{
        var classData:any = properties[className];
        if(!classData){
            var path:string = this.classNameToPath[className];
            var ext:string = file.getExtension(path).toLowerCase();
            var text:string = file.read(path);
            if(ext=="ts"){
                classData = this.getPropertiesFromTs(text,className);
            }
            else if(ext=="exml"){
                classData = this.getPropertiesFromExml(text);
            }
            if(classData){
                properties[className] = classData;
            }
            else{
                return "";
            }
        }
        var type:string = classData[prop];
        if(!type){
            type = this.findType(classData["super"],prop);
        }
        return type;
    }

    /**
     * 读取一个exml文件引用的类列表
     */
    private getPropertiesFromExml(text:string):any{
        var exml:any = xml.parse(text);
        if(!exml){
            return null;
        }
        var superClass:string = this.getClassNameById(exml.localName,exml.namespace);
        if(superClass){
            var data:any = {};
            data["super"] = superClass;
            return data;
        }
        return null;
    }

    /**
     * 获取属性列表
     */
    private getPropertiesFromTs(text:string,className:string):any {
        index = className.lastIndexOf(".");
        var moduleName:string = "";
        if (index != -1) {
            moduleName = className.substring(0, index);
            className = className.substring(index+1);
        }
        var data:any;
        text = CodeUtil.removeComment(text);
        if(moduleName){
            while(text.length>0){
                var index:number = CodeUtil.getFirstVariableIndex("module",text);
                if(index==-1){
                    break;
                }
                text = text.substring(index+6);
                index = text.indexOf("{");
                if(index==-1){
                    continue;
                }
                var ns:string = text.substring(0,index).trim();
                if(ns==moduleName){
                    index = CodeUtil.getBracketEndIndex(text);
                    if(index!=-1){
                        var block:string = text.substring(0,index);
                        index = block.indexOf("{");
                        block = block.substring(index+1);
                        data = this.getPropFromBlock(block,className,moduleName);
                    }
                    break;
                }
            }
        }
        else{
            data = this.getPropFromBlock(text,className,"");
        }

        return data;
    }

    private getPropFromBlock(block:string,targetClassName:string,ns:string):any{
        var data:any;
        while(block.length>0){
            var index:number = CodeUtil.getFirstVariableIndex("class",block);
            if(index==-1){
                break;
            }
            block = block.substring(index+5);
            index = block.indexOf("{");
            var preStr:string = block.substring(0,index);
            block = block.substring(index);
            var className:string = CodeUtil.getFirstVariable(preStr);
            if(className!=targetClassName){
                continue;
            }
            data = {};
            preStr = CodeUtil.removeFirstVariable(preStr,className);
            var word:string = CodeUtil.getFirstVariable(preStr);
            if(word=="extends"){
                preStr = CodeUtil.removeFirstVariable(preStr);
                word = CodeUtil.getFirstWord(preStr);
                if(word){
                    if(ns&&word.indexOf(".")==-1){
                        word = ns+"."+word;
                    }
                    data["super"] = word;
                }
                preStr = CodeUtil.removeFirstWord(preStr);
                word = CodeUtil.getFirstVariable(preStr);
            }
            if(word=="implements"){
                preStr = CodeUtil.removeFirstVariable(preStr);
                var arr:Array<any> = preStr.split(",");
                for(var i:number = arr.length-1;i>=0;i--){
                    var inter:string = arr[i];
                    inter = inter.trim();
                    if(inter){
                        if(ns&&inter.indexOf(".")==-1){
                            inter = ns+"."+inter;
                        }
                        arr[i] = inter;
                    }
                    else{
                        arr.splice(i,1);
                    }
                }
                data["implements"] = arr;
            }
            index = CodeUtil.getBracketEndIndex(block);
            if(index==-1)
                break;
            var text:string = block.substring(0,index+1);
            this.readProps(text,data,ns);
            break;
        }
        return data;
    }

    private basicTypes:Array<any> = ["void","any","number","string","boolean","Object","Array","Function"];

    private readProps(text:string,data:any,ns:string):void{
        var lines:Array<any> = text.split("\n");
        var length:number = lines.length;
        for(var i:number=0;i<length;i++){
            var line:string = lines[i];
            var index:number = CodeUtil.getFirstVariableIndex("public",line);
            if(index==-1)
                continue;
            line = line.substring(index+7);
            var word:string = CodeUtil.getFirstVariable(line);
            if(!word||word.charAt(0)=="_")
                continue;
            if(word=="get"){
                continue;
            }
            else if(word=="set"){
                line = CodeUtil.removeFirstVariable(line);
                word = CodeUtil.getFirstVariable(line);
                if(!word||word.charAt(0)=="_"){
                    continue;
                }
                line = CodeUtil.removeFirstVariable(line);
                line = line.trim();
                if(line.charAt(0)=="("){
                    index = line.indexOf(":");
                    if(index!=-1){
                        line = line.substring(index+1);
                        index = line.indexOf(")");
                        type = line.substring(0,index);
                        index = type.indexOf("<");
                        if(index!=-1)
                        {
                            type = type.substring(0,index);
                        }
                        type = CodeUtil.trimVariable(type);
                        if(type.indexOf(".")==-1&&this.basicTypes.indexOf(type)==-1){
                            type = ns+"."+type;
                        }
                        data[word] = type;
                    }
                    else{
                        data[word] = "any";
                    }
                }
            }
            else{
                line = CodeUtil.removeFirstVariable(line);
                line = line.trim();
                var firstChar:string = line.charAt(0);
                if(firstChar==":"){
                    var type:string = CodeUtil.getFirstWord(line.substring(1));
                    index = type.indexOf("=");
                    if(index!=-1){
                        type = type.substring(0,index);
                    }
                    index = type.indexOf("<");
                    if(index!=-1)
                    {
                        type = type.substring(0,index);
                    }
                    type = CodeUtil.trimVariable(type);
                    if(type.indexOf(".")==-1&&this.basicTypes.indexOf(type)==-1){
                        type = ns+"."+type;
                    }
                    data[word] = type;
                }
                else if(!line||firstChar==";"||firstChar=="="){
                    data[word] = "any";
                }

            }
        }
    }
    /**
     * 检查classNameA是否是classNameB的子类或classNameA实现了接口classNameB
     */
    public isInstanceOf(classNameA:string,classNameB:string):boolean{
        if(classNameB=="any"){
            return true;
        }
        if(classNameA==classNameB){
            return true;
        }
        var dataA:any = properties[classNameA];
        if(!dataA){
            return false;
        }
        var list:Array<string> = dataA["implements"];
        if(list){
            var length:number = list.length;
            for(var i:number=0;i<length;i++){
                if(list[i]==classNameB){
                    return true;
                }
            }
        }
        return this.isInstanceOf(dataA["super"],classNameB);
    }

}

class Component{
    /**
     * 构造函数
     */
    public constructor(item?:any){
        if(item){
            this.id = item.$id;
            this.className = "egret."+this.id;
            if(item["$super"])
                this.superClass = "egret."+item.$super;
            if(item["$default"])
                this.defaultProp = item.$default;
        }
    }
    /**
     * 短名ID
     */
    public id:string;
    /**
     * 完整类名
     */
    public className:string;
    /**
     * 父级类名
     */
    public superClass:string = "";
    /**
     * 默认属性
     */
    public defaultProp:string = "";
}

exports.EXMLConfig = EXMLConfig;