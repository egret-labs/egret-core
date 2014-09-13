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


class AssetAdapter implements egret.gui.IAssetAdapter{

    /**
     * 解析素材
     * @method egret.gui.DefaultAssetAdapter#getAsset
     * @param source {any} 待解析的新素材标识符
     * @param compFunc {Function} 解析完成回调函数，示例：compFunc(content:any,source:any):void;
     * 回调参数content接受两种类型：DisplayObject或Texture。
     * @param thisObject {any} compFunc的this引用
     * @param oldContent any 旧的内容对象,传入值有可能为null。
     * 对于某些类型素材，例如MovieClip，可以重用传入的显示对象,只修改其数据再返回。
     */
    public getAsset(source:any,compFunc:Function,thisObject:any,oldContent:any):void{

        function onGetRes(data:any):void{
            compFunc.call(thisObject,data,source);
        }

        var content:any = source;
        if(source.prototype){
            content = new source();
        }
        if(content instanceof egret.DisplayObject||content instanceof egret.Texture){
            compFunc.call(thisObject,content,source);
        }
        else if(typeof(source)=="string"){
            if(RES.hasRes(source)){
                RES.getResAsync(source,onGetRes,this);
            }
            else{
               RES.getResByUrl(source,onGetRes,this);
            }


        }
        else{
            compFunc.call(thisObject,content,source);
        }
    }


}