/// <reference path="../../../lib/types.d.ts" />
/// <reference path="libs/angular.d.ts" />
/// <reference path="utils.ts" />

module egret {
    export interface EgretModule{
        checked?: boolean;
        readonly?: boolean;
    }
    export interface TargetPlatform {
        checked?: boolean;
    }
}

module egret.portal {

    export var project: egret.ILarkProject;

    export class Project {
        larkManifest = egret.manifest;
        scaleModes = egret.manifest.scaleModes;
        orientationModes = egret.manifest.orientationModes;
        modules: egret.EgretModule[] = [];
        platform: string = "web";
        scaleMode: string = 'showAll';
        orientationMode: string = 'auto'; 
        contentWidth: number = 480;
        contentHeight: number = 800;
        showPaintRects: boolean = false;
        type: string = "empty";
        port: number = 3000;
        isConfig = location.pathname.indexOf("/$/config") >= 0;
        isConfirmed = true;
        isLoadingShow = false;
        isCreated = false;
        background = "#888888";
        frameRate = 30;

        constructor() {
            this.larkManifest.modules.forEach(lm=> {
                if (lm.name == 'egret')
                    lm.checked = true;
                this.modules.forEach(m=> {
                    if (lm.name == m.name)
                        lm.checked = true;
                });
            });
            this.larkManifest.platforms.forEach(lm=> {
                if (lm.name == this.platform)
                    lm.checked = true;
            });
            this.selectTemplate(this.type);
            var port = parseInt(location.port || "80");
            this.port = port;
            var exist = location.search && location.search.indexOf("exist=true") >= 0;
            if (exist)
                this.isConfirmed = false;
        }

        finish() {
            var manifest = this.larkManifest;
            this.modules = manifest.modules.filter(m=> m.checked).map(m=> { return { name: m.name }; });
            //this.platform = manifest.platforms.filter(p=> p.checked)[0].name;
            this.larkManifest = undefined;
            var modes = this.scaleModes;
            this.scaleModes = undefined;
            var omodes = this.orientationModes;
            this.orientationModes = undefined;
            var json = JSON.stringify(this);
            console.log(json);

            $.get('', { proj: json },  ()=> {
                this.isCreated = true;
                this.isLoadingShow = false;
                $("#createdMask").show();
                $("#loadingMask").hide();
                $("#loading").remove();
            });
            this.scaleModes = modes;
            this.orientationModes = omodes;

            this.larkManifest = manifest;
            this.isLoadingShow = true;
            showLoading();
        }
        cancel() {
            $.get('', { cancel: true }, function () {});
            setTimeout(() => window.close(), 20);
        }

        close() {
            window.close();
        }

        switchSize() {
            var n = this.contentHeight;
            this.contentHeight = this.contentWidth;
            this.contentWidth = n;
        }
        selectTemplate(name: string) {
            this.type = name;
            var templates = this.larkManifest.templates;
            for (var i = 0; i < templates.length; i++) {
                if (templates[i].name == name) {
                    var modules = templates[i].modules;

                    this.larkManifest.modules.forEach(lm=> {

                        if (modules.indexOf(lm.name)>=0) {
                            lm.checked = true;
                            lm.readonly = true;
                        }
                        else
                            lm.readonly = false;
                    });
                    break;
                }
            }
        }
    }
}


egret.app.controller('ProjectController', egret.portal.Project);


function showLoading() {
    $("#loadingMask").show();
    var elem = $("#loading");
    elem.show();

    $({ deg: 0 }).animate({ deg: 360 }, {
        duration: 2000,
        step: function (now) {
            elem.css({
                'transform': 'rotate(' + now + 'deg)'
            });
        },
        easing:'linear',
        complete: showLoading
    });
}
