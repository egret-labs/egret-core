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
function getResourceList(){
    return ["blocks.png"];
}

function getDescription(){
    return "这个项目展示了box2d，如果运行这个项目，请确定加载box2d.js文件";
}

function createExample(){
    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);
ns_egret.Profiler.getInstance().run();
    var b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2World = Box2D.Dynamics.b2World
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    world = new b2World(new b2Vec2(0, 10), true);
    world.SetContinuousPhysics(true);

    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    var bodyDef = new b2BodyDef;

    bodyDef.type = b2Body.b2_staticBody;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(20, 2);
    // upper
    bodyDef.position.Set(10,300 / PTM_RATIO + 1.8);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    // bottom
    bodyDef.position.Set(10, -1.8);
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    fixDef.shape.SetAsBox(2, 14);
    // left
    bodyDef.position.Set(-1.8, 13);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    // right
    bodyDef.position.Set(26.8, 13);
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    rectContainer = new ns_egret.DisplayObjectContainer();
    container.addChild(rectContainer);

    addNewSpriteWithCoords(400 / 2, 300 / 2);

    var label = new ns_egret.TextField();
    label.size = 32;
    label.text = "Click";
    label.x = 400 / 2 - 40;
    label.y = 40;
    container.addChild(label);
    ns_egret.Ticker.getInstance().register(box2dUpdate,this);
    context.stage.addEventListener(ns_egret.TouchEvent.TOUCH_END,onBox2dTouch,this);
}

function box2dUpdate(dt){
    var velocityIterations = 8;
    var positionIterations = 1;

    world.Step(dt / 1000, velocityIterations, positionIterations);

    for (var b = world.GetBodyList(); b; b = b.GetNext()) {
        if (b.GetUserData() != null) {
            var myActor = b.GetUserData();
            myActor.x = b.GetPosition().x * PTM_RATIO;
            myActor.y = b.GetPosition().y * PTM_RATIO;
            myActor.rotation = 1 * b.GetAngle() * 180 / Math.PI;
        }
    }
}

function addNewSpriteWithCoords (x,y) {
    var idx = (Math.random() > .5 ? 0 : 1);
    var idy = (Math.random() > .5 ? 0 : 1);

    var bitmap = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("blocks.png"));
    var spriteFrame = new ns_egret.SpriteSheetFrame();
    spriteFrame.x = PTM_RATIO * idx;
    spriteFrame.y = PTM_RATIO * idy;
    spriteFrame.w = PTM_RATIO;
    spriteFrame.h = PTM_RATIO;
    bitmap.spriteFrame = spriteFrame;
    bitmap.pivotOffsetX = PTM_RATIO / 2;
    bitmap.pivotOffsetY = PTM_RATIO / 2;
    rectContainer.addChild(bitmap);

    bitmap.x = x;
    bitmap.y = y;

    var b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.Set(x / PTM_RATIO, y / PTM_RATIO);
    bodyDef.userData = bitmap;
    var body = this.world.CreateBody(bodyDef);

    var dynamicBox = new b2PolygonShape();
    dynamicBox.SetAsBox(0.5, 0.5);

    var fixtureDef = new b2FixtureDef();
    fixtureDef.shape = dynamicBox;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.3;
    body.CreateFixture(fixtureDef);
}

function onBox2dTouch(touch){
    this.addNewSpriteWithCoords(touch.stageX, touch.stageY);
}

var PTM_RATIO = 32;