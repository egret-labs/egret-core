//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {
    public static menu: Menu;
    private static _that: egret.DisplayObjectContainer;
    private rewardedVideo: any;
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //初始化Facebook SDK，在回调方法里获取相关信息
        egretfb.EgretFBInstant.initializeAsync().then(function () {
            egret.log("player.getID", egretfb.EgretFBInstant.player.getID());
            try {
                egretfb.EgretFBInstant.player.getSignedPlayerInfoAsync('egret').then((result) => {
                    try {
                        egret.log('result.playerID', result.getPlayerID())
                        egret.log('result.getSignature.length', result.getSignature().length)
                    } catch (err) {
                        egret.log('SignedPlayerInfoAsync.err2', err)
                    }
                })
            } catch (err) {
                egret.log('SignedPlayerInfoAsync.err1', err)
            }
            egret.log("player.getID", egretfb.EgretFBInstant.player.getID());
            egret.log("player.getName", egretfb.EgretFBInstant.player.getName());
            egret.log("player.getPhoto.length", egretfb.EgretFBInstant.player.getPhoto().length);

            egret.log("getLocale:", egretfb.EgretFBInstant.getLocale());
            egret.log("getPlatform:", egretfb.EgretFBInstant.getPlatform());
            egret.log("getSDKVersion", egretfb.EgretFBInstant.getSDKVersion());
            egret.log("num getSupportedAPIs", egretfb.EgretFBInstant.getSupportedAPIs().length);
            egret.log('getEntryPointData', egretfb.EgretFBInstant.getEntryPointData())
        })
        this.createScence();
        setTimeout(() => {
            egretfb.EgretFBInstant.setLoadingProgress(100);
            egretfb.EgretFBInstant.startGameAsync().then(() => {
                this.showScence();
            })
        }, 1000)
    }

    private createScence() {
        Main._that = this;
        Context.init(this.stage);
        Main.menu = new Menu("Egret Facebook SDK Test")
        this.addChild(Main.menu);
        Main.menu.addTestFunc("context", this.contextInfo, this);
        Main.menu.addTestFunc("setDataAsync", this.setDataAsync, this);
        Main.menu.addTestFunc("getDataAsync", this.getDataAsync, this);
        Main.menu.addTestFunc("flushDataAsync", this.flushDataAsync, this);

        Main.menu.addTestFunc("setStatsAsync", this.setStatsAsync, this);
        Main.menu.addTestFunc("getStatsAsync", this.getStatsAsync, this);
        Main.menu.addTestFunc("incrementStatsAsync", this.incrementStatsAsync, this);

        Main.menu.addTestFunc("getInterstitialAdAsync", this.getInterstitialAdAsync, this);
        Main.menu.addTestFunc("显示视频广告", this.playRewardedVideo, this);


        Main.menu.addTestFunc("getConnectedPlayersAsync", this.getConnectedPlayersAsync, this);
        Main.menu.addTestFunc("switchAsync", this.switchAsync, this);
        Main.menu.addTestFunc("chooseAsync", this.chooseAsync, this);
        Main.menu.addTestFunc("createAsync", this.createAsync, this);
        Main.menu.addTestFunc("getPlayersAsync", this.getPlayersAsync, this);
        Main.menu.addTestFunc("setSessionData", this.setSessionData, this);
        Main.menu.addTestFunc("shareAsync", this.shareAsync, this);
        Main.menu.addTestFunc("updateAsync", this.updateAsync, this);
        Main.menu.addTestFunc("logEvent", this.logEvent, this);
        Main.menu.addTestFunc("quit", this.quit, this);

    }

    public static backMenu(): void {
        Main._that.removeChildren();
        Main._that.addChild(Main.menu);
    }
    private showScence() {
        egret.log('showScence')
        this.loadRewardedVideo();
        egretfb.EgretFBInstant.onPause(() => {
            egret.log('onPause');
        });
    }
    private loadRewardedVideo() {
        egretfb.EgretFBInstant.getRewardedVideoAsync('380072779038584_503394323373095')
            .then((rewardedVideo) => {
                this.rewardedVideo = rewardedVideo;
                egret.log('开始加载视频广告，翻墙网络慢,请稍等..', JSON.stringify(rewardedVideo))
                return this.rewardedVideo.loadAsync();
            }).then(() => {
                egret.log('视频广告加载结束,可以播放 ')
            }, (err) => {
                egret.log('视频广告加载错误', JSON.stringify(err));
            })
    }
    async playRewardedVideo() {
        await this.rewardedVideo.showAsync();
        this.loadRewardedVideo();
    }
    private contextInfo() {
        egret.log('context.getID', egretfb.EgretFBInstant.context.getID());
        egret.log('context.getType', egretfb.EgretFBInstant.context.getType());
        egret.log('context.isSizeBetween0-10', JSON.stringify(egretfb.EgretFBInstant.context.isSizeBetween(0, 10)));
    }
    private setDataAsync() {
        var saveData = { score: 123, value: Math.floor(Math.random() * 100) }
        egretfb.EgretFBInstant.player.setDataAsync(saveData).then(() => {
            egret.log('data is set');
        })
        egret.log('setDataAsync', JSON.stringify(saveData));
    }
    private getDataAsync() {
        egretfb.EgretFBInstant.player.getDataAsync(['score', 'value']).then((data) => {
            egret.log('getDataAsync', data['score'], data['value'])
        })
    }
    private flushDataAsync() {
        var saveData = { score: 778, value: Math.floor(Math.random() * 100) }
        egret.log('flushDataAsync', JSON.stringify(saveData));
        egretfb.EgretFBInstant.player.setDataAsync(saveData)
            .then(egretfb.EgretFBInstant.player.flushDataAsync)
            .then(() => {
                egret.log('flushDataAsync succ');
            })
    }
    private setStatsAsync() {
        var saveState = { level: 68, money: Math.floor(Math.random() * 100) }
        egretfb.EgretFBInstant.player
            .setStatsAsync(saveState)
            .then(function () {
                egret.log('data is set');
            });
    }
    private getStatsAsync() {
        egretfb.EgretFBInstant.player
            .getStatsAsync(['level', 'money'])
            .then(function (stats) {
                egret.log('getStatsAsync', JSON.stringify(stats))
            });
    }
    private incrementStatsAsync() {
        var saveState = { level: 15, money: 1276, life: 9 }
        egretfb.EgretFBInstant.player
            .incrementStatsAsync(saveState)
            .then(function (stats) {
                egret.log('incrementStatsAsync', JSON.stringify(stats));
            });
    }
    private getInterstitialAdAsync() {
        var ad = null;
        egretfb.EgretFBInstant.getInterstitialAdAsync('380072779038584_502979883414539')
            .then((interstitial) => {
                ad = interstitial;
                egret.log('interstitial', JSON.stringify(interstitial))
                egret.log('getPlacementID', ad.getPlacementID())
                return ad.loadAsync();
            }).then(() => {
                egret.log('ad loaded');
                // return ad.showAsync();
            }, (err) => {
                egret.log('err', JSON.stringify(err));
            }).then(() => {
                egret.log('watch ad');
            });
    }

    private getConnectedPlayersAsync() {
        egretfb.EgretFBInstant.player.getConnectedPlayersAsync().then((players) => {
            egret.log('getConnectedPlayersAsync.length', players.length)
            players.map((player) => {//好友很多的话，请注释此方法
                egret.log('id', player.getID());
                egret.log('name', player.getName());
            })
        })
    }
    private switchAsync() {
        egret.log('context.id now:', egretfb.EgretFBInstant.context.getID())
        egretfb.EgretFBInstant.context.switchAsync('12345678').then(() => {
            egret.log('context.id switch:', egretfb.EgretFBInstant.context.getID())
        }, (err) => {
            egret.log('switchAsync error', JSON.stringify(err));
        })
    }
    private chooseAsync() {
        egret.log('context.id now:', egretfb.EgretFBInstant.context.getID())
        egretfb.EgretFBInstant.context.chooseAsync().then(() => {
            egret.log('context.id chooseAsync:', egretfb.EgretFBInstant.context.getID())
        }, (err) => {
            egret.log('chooseAsync error', JSON.stringify(err));
        })
    }
    private createAsync() {
        egretfb.EgretFBInstant.context.createAsync('123456').then(() => {
            egret.log('context.id chooseAsync:', egretfb.EgretFBInstant.context.getID())
        }, (err) => {
            egret.log('chooseAsync error', JSON.stringify(err));
        })
    }
    private getPlayersAsync() {
        egretfb.EgretFBInstant.context.getPlayersAsync().then((players) => {
            egret.log('getPlayersAsync:', JSON.stringify(players));
        }, (err) => {
            egret.log('getPlayersAsync error', JSON.stringify(err));
        })
    }
    private setSessionData() {
        egretfb.EgretFBInstant.setSessionData({ coinsEarned: 10, eventsSeen: ['start', 'zhangyu'] })
    }
    private shareAsync() {
        var shareObj:egretfb.EgretSharePayload = { intent: 'REQUEST', image: '', text: 'zhangyu is asking for your help!', data: { myReplayData: '...' } };
        egretfb.EgretFBInstant.shareAsync(shareObj).then(function () {
            egret.log('share end! continue game')
        });
    }
    private updateAsync() {
        egretfb.EgretFBInstant.updateAsync({
            action: 'CUSTOM',
            cta: 'Join The Fight',
            template: 'join_fight',
            image: '',
            text: 'zhangyu just invaded Y\'s village!',
            data: { myReplayData: 'good' },
            strategy: 'IMMEDIATE',
            notification: 'NO_PUSH',
        }).then(function () {
            //当消息发送后，关闭游戏
            egretfb.EgretFBInstant.quit();
        });
    }
    private logEvent() {
        var logged = egretfb.EgretFBInstant.logEvent(
            'my_custom_event',
            42,
            { custom_property: 'custom_value' },
        );
        egret.log('logEvent', logged);
    }
    private quit() {
        egretfb.EgretFBInstant.quit();
    }
}


