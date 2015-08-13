class Main extends swan.Group {
    constructor() {
        super();
    }

    protected createChildren():void {
        super.createChildren();

        this.touchTheme();
    }

    private touchTheme():void {
        var skins = [
            "resource/components/blue/ListGroup.exml",
        ];

        Loader.load(skins, () => {
            Loader.load(["resource/components/MainGroup.exml"], () => this.loaded());
        });
    }

    loaded() {
        new swan.Theme("resource/theme/blue-theme.json", this.stage);
        this.removeChildren();
        var ui = new (egret.getDefinitionByName("components.MainGroup"))();

        ui.btnShowMessage.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.addPanel();
        }, this);
        this.addChild(ui);
    }

    private addPanel():void {
        var exml =
            `<s:Panel title="title panel" xmlns:s="http://ns.egret.com/swan">
                    <s:Skin>
                        <s:Image width="100%" height="100%" source="resource/assets/track.png" scale9Grid="1,1,4,4"/>
                        <s:Group id="moveArea" width="100%" height="40">
                            <s:Image width="100%" height="100%" source="resource/assets/thumb.png" scale9Grid="1,1,4,4"/>
                            <s:Label id="titleDisplay" text="标题" textColor="0" horizontalCenter="0" verticalCenter="0"/>
                        </s:Group>
                        <s:Button id="closeButton" right="-15" y="-15">
                            <s:Skin states="up,down,disabled">
                                <s:Image width="50" height="50" source="resource/assets/close.png" scaleX.up="1" scaleX.down="0.95" scaleY.up="1" scaleY.down="0.95"/>
                            </s:Skin>
                        </s:Button>
                    </s:Skin>
                </s:Panel>`;

        var clazz = EXML.parse(exml);
        var panel = new clazz();
        panel.width = 400;
        panel.height = 400;
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }
}

class Loader {
    static load(urls:string[], callback:() => void) {

        var total = urls.length;
        var got = 0;
        urls.forEach(url => {
            EXML.load(url, ()=> {
                got++;
                if (got == total)
                    callback();
            }, this)
        });
    }
}