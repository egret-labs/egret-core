class Main extends eui.UILayer {

    protected createChildren(): void {
        super.createChildren();
        
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        
        var button = new eui.Button();
        button.label = "Click!";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onButtonClick,this);
    }
    
    private onButtonClick(e:egret.TouchEvent) { 
        var panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }
}

