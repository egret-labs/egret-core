/**
 * Created with JetBrains WebStorm.
 * User: apple
 * Date: 14-1-9
 * Time: PM8:40
 * To change this template use File | Settings | File Templates.
 */
function init() {
    initData();
    image = new Image();
    image.onload = handleComplete;
    image.src = "assets/sprite_sheet.png";
}

function handleComplete() {
    var canvas = document.getElementById("testCanvas");
    var context = ns_egret.MainContext.instance;
    context.rendererContext = new ns_egret.HTML5CanvasRenderer(canvas);
    context.touchContext = new ns_egret.TouchContext(canvas);
    context.stage = new ns_egret.Stage();

    var bitmap1 = new ns_egret.Bitmap();
    var bitmap2 = new ns_egret.Bitmap();
    bitmap1.bitmapData = image;
    bitmap2.bitmapData = image;


    container = new ns_egret.DisplayObjectContainer();
    ns_egret.MixIn.active(bitmap1,ns_egret.Button);

    context.stage.addChild(container);
    context.stage.touchEnabled = true;

    container.addChild(bitmap1);


    container.x = 200;
    container.scaleX = container.scaleY = .7;
    container.alpha = 1;
    container.touchEnabled = false;
    bitmap1.x  = -125;
    bitmap1.touchEnabled = false;
//    bitmap2.x = 100;

    var arr = [1,2,3];
    arr.splice(0,0,4)

    spriteSheet = new ns_egret.SpriteSheet(sprite_frame_obj);
    frame = spriteSheet.getFrame("activity_1.png");
    bitmap1.spriteFrame = frame;
    bitmap1.scaleX = bitmap1.scaleY = 1.5;
    bitmap1.touchEnabled = true;
    bitmap1.rotation = 45;
//    bitmap2.spriteFrame = frame;


    context.run();

//    bitmap1.setBounds(0,0,100,100);
    console.log(container.getBounds());

    setInterval(function () {
//        container.y += 5;
//        container.visible = !container.visible;
//        bitmap1.y += 5;
    }, 200)
    ns_egret.Ticker.getInstance().register(function (){
        //container.y += 5;
    },window)
    return;
}

function initData() {
    sprite_frame_obj = {"frames": {

        "activity_1.png": {
            "frame": {"x": 235, "y": 159, "w": 75, "h": 75},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 75, "h": 75},
            "sourceSize": {"w": 75, "h": 75}
        },
        "activity_10.png": {
            "frame": {"x": 392, "y": 81, "w": 76, "h": 75},
            "rotated": false,
            "trimmed": true,
            "spriteSourceSize": {"x": 0, "y": 1, "w": 76, "h": 75},
            "sourceSize": {"w": 76, "h": 77}
        },
        "activity_11.png": {
            "frame": {"x": 161, "y": 2, "w": 76, "h": 77},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 77},
            "sourceSize": {"w": 76, "h": 77}
        },
        "activity_12.png": {
            "frame": {"x": 236, "y": 81, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_13.png": {
            "frame": {"x": 158, "y": 81, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_14.png": {
            "frame": {"x": 80, "y": 393, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_15.png": {
            "frame": {"x": 80, "y": 315, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_16.png": {
            "frame": {"x": 80, "y": 237, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_17.png": {
            "frame": {"x": 80, "y": 159, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_18.png": {
            "frame": {"x": 80, "y": 81, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_19.png": {
            "frame": {"x": 2, "y": 393, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_2.png": {
            "frame": {"x": 158, "y": 159, "w": 75, "h": 75},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 75, "h": 75},
            "sourceSize": {"w": 75, "h": 75}
        },
        "activity_20.png": {
            "frame": {"x": 2, "y": 315, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_23.png": {
            "frame": {"x": 2, "y": 237, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_24.png": {
            "frame": {"x": 2, "y": 159, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_25.png": {
            "frame": {"x": 2, "y": 81, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_3.png": {
            "frame": {"x": 392, "y": 158, "w": 75, "h": 75},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 75, "h": 75},
            "sourceSize": {"w": 75, "h": 75}
        },
        "activity_4.png": {
            "frame": {"x": 2, "y": 2, "w": 78, "h": 77},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 78, "h": 77},
            "sourceSize": {"w": 78, "h": 77}
        },
        "activity_5.png": {
            "frame": {"x": 82, "y": 2, "w": 77, "h": 77},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 77, "h": 77},
            "sourceSize": {"w": 77, "h": 77}
        },
        "activity_6.png": {
            "frame": {"x": 395, "y": 2, "w": 76, "h": 77},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 77},
            "sourceSize": {"w": 76, "h": 77}
        },
        "activity_7.png": {
            "frame": {"x": 314, "y": 81, "w": 76, "h": 76},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 76},
            "sourceSize": {"w": 76, "h": 76}
        },
        "activity_8.png": {
            "frame": {"x": 317, "y": 2, "w": 76, "h": 77},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 77},
            "sourceSize": {"w": 76, "h": 77}
        },
        "activity_9.png": {
            "frame": {"x": 239, "y": 2, "w": 76, "h": 77},
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {"x": 0, "y": 0, "w": 76, "h": 77},
            "sourceSize": {"w": 76, "h": 77}
        }},
        "meta": {
            "app": "http://www.texturepacker.com",
            "version": "1.0",
            "image": "sprite_sheet.png",
            "format": "RGBA8888",
            "size": {"w": 512, "h": 512},
            "scale": "1",
            "smartupdate": "$TexturePacker:SmartUpdate:7b69b987334f94aa1f7b7aa5feb2553a$"
        }
    }

}