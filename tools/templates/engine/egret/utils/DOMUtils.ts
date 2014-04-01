/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/// <reference path="../core/Logger.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="../core/StageDelegate.ts"/>
/// <reference path="FrameworkUtils.ts"/>
module ns_egret{
    export class DOM {

        public static convert(nodeObject) {
            if (arguments.length > 1) {
                ns_egret.DOM.convert(arguments);
                return;
            } else if (arguments.length == 1 && !arguments[0].length) {
                ns_egret.DOM.convert([arguments[0]]);
                return;
            }
            var args = arguments[0];
            for (var i = 0; i < args.length; i++) {
                if (args[i] instanceof DisplayObjectContainer) {
                    if (!args[i].dom)
                        ns_egret.DOM.forSprite(args[i]);
                } else {
                    ns_egret.Logger.info('DOM转换器只支持DisplayObjectContainer');
                }
                args[i].visit = function () {
                };
                args[i].transform = function () {
                };
                ns_egret.DOM.setTransform(args[i]);
                args[i].visible = args[i].visible;
            }
        }

        public static forSprite(x) {
            x.dom = ns_egret.Browser.getInstance().$new('div');
            x.canvas = ns_egret.Browser.getInstance().$new('canvas');
            x.canvas.width = x.width;
            x.canvas.height = x.height;
            x.dom.style.position = 'absolute';
            x.ctx = x.canvas.getContext('2d');
            x.dom.appendChild(x.canvas);
            if (x.parent) {
                ns_egret.DOM.parentDOM(x);
            }
            x.isSprite = true;
        }

        public static parentDOM(x) {
            var p = x.parent;
            if (!p || !x.dom)
                return false;
            if (!p.dom) {
                ns_egret.DOM.placeHolder(p);
            }
            x.dom.appendTo(p.dom);
            if (p.parent) {
                ns_egret.DOM.parentDOM(p);
            } else {
                var stageDelegateDiv = ns_egret.Browser.getInstance().$("#StageDelegateDiv");
                if (stageDelegateDiv) {
                    p.dom.appendTo(stageDelegateDiv);
                } else {
                    stageDelegateDiv = ns_egret.Browser.getInstance().$new("div");
                    stageDelegateDiv.id = "StageDelegateDiv";

                    var stageDelegate:StageDelegate = StageDelegate.getInstance();
                    var screenWidth = stageDelegate.getFrameWidth();
                    var screenHeight = stageDelegate.getFrameHeight();
                    var designSizeWidth = stageDelegate.getDesignWidth(), designSizeHeight = stageDelegate.getDesignHeight();
                    if ((designSizeWidth === 0) && (designSizeHeight === 0)) {
                        designSizeWidth = screenWidth;
                        designSizeHeight = screenHeight;
                    }

//                    var viewPortWidth = stageDelegate.getViewPortWidth(), viewPortHeight = stageDelegate.getViewPortHeight();
//                    if ((viewPortWidth === 0) && (viewPortHeight === 0)) {
//                        viewPortWidth = screenWidth;
//                        viewPortHeight = screenHeight;
//                    }

                    stageDelegateDiv.style.position = 'absolute';
                    stageDelegateDiv.style.width = designSizeWidth + "px";
                    stageDelegateDiv.style.maxHeight = designSizeHeight + "px";
                    stageDelegateDiv.style.margin = 0;

                    stageDelegateDiv.resize(stageDelegate.getScaleX(), stageDelegate.getScaleY());

//                    if (viewPortWidth < screenWidth) {
//                        stageDelegateDiv.style.left = ((viewPortWidth - designSizeWidth) / 2
//                            + (screenWidth - viewPortWidth ) / 2) + "px";
//                    } else {
//                        stageDelegateDiv.style.left = (viewPortWidth - designSizeWidth) / 2 + "px";
//                    }

//                    if (viewPortHeight < screenHeight) {
//                        stageDelegateDiv.style.bottom = ((screenHeight - viewPortHeight ) / 2) + "px";
//                    } else {
//                        stageDelegateDiv.style.bottom = "0px";
//                    }

                    p.dom.appendTo(stageDelegateDiv);
                    stageDelegateDiv.appendTo(document.getElementById(StageDelegate.canvas_div_name));
                }
            }
            return true;
        }

        public static placeHolder(x) {
            x.dom = ns_egret.Browser.getInstance().$new('div');
            x.placeholder = true;
            x.dom.style.position = 'absolute';
            //x.dom.style.display='block';
            x.dom.style.width = (x.width || MainContext.instance.stage.stageWidth) + "px";
            x.dom.style.maxHeight = (x.height || MainContext.instance.stage.stageHeight) + "px";
            x.dom.style.margin = 0;
            ns_egret.DOM.setTransform(x);
            x.dom.transforms();
        }

        public static setTransform(x) {
            if (x.dom) {
                x.dom.position.x = x.x;
                x.dom.position.y = x.y;
                x.dom.rotation = x.rotation;
                x.dom.scale = {x: x.scaleX, y: x.scaleY};
                x.dom.skew = {x: x.skewX, y: x.skewX};
                x.dom.transforms();
            }

        }
    }
}
