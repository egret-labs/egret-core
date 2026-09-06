<p align="center">
    <img src="./docs/img/egret_logo.jpg"
         height="130">
</p>
<p align="center">
    <a href="https://github.com/egret-labs/egret-core/network">
        <img src="https://img.shields.io/github/forks/egret-labs/egret-core.svg"
             alt="forks">
    </a>
    <a href="https://github.com/egret-labs/egret-core/stargazers">
        <img src="https://img.shields.io/github/stars/egret-labs/egret-core.svg"
             alt="stars">
    </a>
    <a href="https://github.com/egret-labs/egret-core">
        <img src="https://img.shields.io/badge/version-5.4.1-green.svg"
             alt="version">
    </a>
    <a href="./LICENSE.md">
        <img src="https://img.shields.io/badge/license-New%20BSD-blue.svg"
             alt="license">
    </a>
</p>

[EN](README.md) / [CN](README_CN.md)

# Egret Engine

The Egret Engine is a HTML5 game engine. It provides modules to handle common game development tasks such as 2D and 3D rendering, GUI systems, and audio and resource management. The Egret engine is flexible and suitable for 2D or 3D projects. It allows developers to work without worrying about low-level browser impelementation, HTML5 performance, or fragmentation issues.

## Platform Coverage 

### Mobile

![](https://img.shields.io/badge/iOS-8.0%2B-lightgrey.svg)
![](https://img.shields.io/badge/Android-4.0%2B-brightgreen.svg)
![](https://img.shields.io/badge/Windows%20Phone-8-orange.svg)

### PC

![](https://img.shields.io/badge/Chrome--brightgreen.svg)
![](https://img.shields.io/badge/Safari--yellow.svg)
![](https://img.shields.io/badge/FireFox--orange.svg)
![](https://img.shields.io/badge/Edge--red.svg)
![](https://img.shields.io/badge/IE-9+-blue.svg)

# Installation

To Install the Egret Engine:

* [Download](https://egret.com/products) the Egret Engine Manager.

* Then, follow the [installation and deployment instructions](http://developer.egret.com/cn/github/egret-docs/Engine2D/projectConfig/installation/index.html) 

Once installation is complete, Egret's engine and tools are easy to manage.

# Getting Started

#### TypeScript

Egret projects are developed using TypeScript, which is a superset of JavaScript. Please refer to the TypeScript manual for more information. The Egret API and ActionScript3 (AS3) are very similar. It will be easy to get started with Egret if you are familiar with AS3.

#### Create a project by command line

Use following command to create a default game object:

    egret create HelloWorld

You may also add parameters if required: Use `empty` | `game` | `gui` | `eui` to specify different projects. 

After running this command, you should now see a folder called 'HelloWorld'.

#### Write your first line of code

By default, the entry point for an Egret game projects is src / Main.ts. To make write the first line of code for your project, find the createGameScene () function, and add console.log ("Hello World");

After making your changes, the code should now look like this:

    private createGameScene():void {
            // log
            console.log("Hello World");
            var sky:egret.Bitmap = this.createBitmapByName("bgImage");
            this.addChild(sky);
            var stageW:number = this.stage.stageWidth;
            var stageH:number = this.stage.stageHeight;
            sky.width = stageW;
            sky.height = stageH;
            //...
        }

Here, we've called `console.log("log content that we'd like to display")`. This will display our log message in the browser's developer tool.

    We recommend using Chrome to debug the Egret project.

Use the following command to build Egret projects:

    egret build

Use the following command to run Egret projects:

    egret startserver

![](./docs/img/console.png)

For more information, please refer to the Learning Module documentation.

# Demos

Tower Defence Demo
![](./docs/img/3d_demo_1.png)
Click [here](http://developer.egret.com/cn/article/index/id/1074) for online experience.<br/>

Click [here](http://developer.egret.com/cn/list/example/id/190) for more 2D/3D demos.<br/>

# Show Case

Click here to see [Show Case](https://egret.com/case)<br/>

# Learn

* Access [Doc](http://developer.egret.com/cn/github/egret-docs/Engine2D/index.html?home=1) to get Engine document
* Access [Example](http://developer.egret.com/cn/example/egret2d/index.html#010-disp-basic) to learn demo source code
* Access [API](http://developer.egret.com/cn/apidoc/) to get API document
* Access [Video](http://developer.egret.com/cn/list/video/) to get videos
* Access [Community](http://bbs.egret.com/portal.php) to communicate with other developers

# Tools

* Access [Egret Engine](http://www.egret.com/products/engine.html) to get Egret Engine launcher
* Access [Egret Wing](http://www.egret.com/products/wing.html) to get Egret IDE
* Access [Dragonbones Pro](http://dragonbones.com/cn/index.html) to get DragonBones
* Access [Moew Tools](http://www.egret.com/products)

# Third Party Library

* Use [base64texture](https://github.com/egret-labs/egret-game-library/tree/master/base64texture) to convert base64 String to egert Texture
* Use [dcagent](https://github.com/egret-labs/egret-game-library/tree/master/dcagent) DataEye SDK for Egret
* Use [ecs](https://github.com/egret-labs/egret-game-library/tree/master/ecs) component system
* Use [euiextension](https://github.com/egret-labs/egret-game-library/tree/master/euiextension) EUI extension
* Use [gesture](https://github.com/egret-labs/egret-game-library/tree/master/gesture) Gesture library
* Use [keyboard](https://github.com/egret-labs/egret-game-library/tree/master/keyboard) Keyboard event listener
* Use [Greensock](https://github.com/egret-labs/egret-game-library/tree/master/greensock) Greensock animation library
* Use [jszip](https://github.com/egret-labs/egret-game-library/tree/master/jszip) jszip Compression library
* Use [md5](https://github.com/egret-labs/egret-game-library/tree/master/md5) A simple MD5 Library
* Use [mouse](https://github.com/egret-labs/egret-game-library/tree/master/mouse) PC mouse support library
* Use [particle](https://github.com/egret-labs/egret-game-library/tree/master/particle) particle system
* Use [physics](https://github.com/egret-labs/egret-game-library/tree/master/physics) p2Physics engine，current version 0.7.0
* Use [socket](https://github.com/egret-labs/egret-game-library/tree/master/socket.io) socket.io
* Use [tiled](https://github.com/egret-labs/egret-game-library/tree/master/tiled) tiledmap support library
* Use [weixinapi](https://github.com/egret-labs/egret-game-library/tree/master/weixinapi) WeChat API
* More third party libraries please visit [here](https://github.com/egret-labs/egret-game-library) 

# Contributing

Asking a question is the first step to participating in an open-source community. You can report Egret issues [here](https://github.com/egret-labs/egret-core/issues).
It is recommended that issues be discussed in the [official community portal](http://bbs.egret.com/portal.php), as it can help with solving problems efficiently.

# License

This content is released under the (https://opensource.org/licenses/BSD-2-Clause) BSD License.

![](https://img.shields.io/badge/license-New%20BSD-blue.svg)


## 🌐 Web Resources & Interactive Index
- [COUNTRY LIFE MEADOWS](https://ptskillcrafts.pages.dev/country-life-meadows.html)
- [GYM SIMULATOR TYCOON](https://thequizzone.pages.dev/gym-simulator-tycoon.html)
- [PLAYGROUND PARKOUR](https://iskillquest.pages.dev/playground-parkour.html)
- [TERMS](https://themindplay.pages.dev/terms.html)
- [ECHOLOCATION SHOOTER](https://iskillquest.pages.dev/echolocation-shooter.html)
- [CATEGORY DEFENSE](https://iskillquest.pages.dev/category-defense.html)
- [IBIZA FOAM PARTY](https://iskillquest.pages.dev/ibiza-foam-party.html)
- [CODE RUNNER BINARY CONFUSION](https://thequizzone.pages.dev/code-runner-binary-confusion.html)
- [JUMP IN TO THE PLANE](https://iskillquest.pages.dev/jump-in-to-the-plane.html)
- [CATEGORY TANK](https://theskillquest.pages.dev/category-tank.html)
- [SPACE SHIFT](https://themindzone.pages.dev/space-shift.html)
- [NUMBER TUBES](https://themindzone.pages.dev/number-tubes.html)
- [CATEGORY MATCH 3 2](https://themindplay.github.io/category-match-3-2.html)
- [HIDE AND SEEK BLUE MONSTER](https://iskillquest.pages.dev/hide-and-seek-blue-monster.html)
- [DYNAMONS 12](https://thelearnquesters.pages.dev/dynamons-12.html)
- [CATEGORY CONTROLLER 2](https://themindplay.github.io/category-controller-2.html)
- [GEOMETRY STARS](https://iskillquest.pages.dev/geometry-stars.html)
- [MR DRIFTER CAR CHASE SIMULATOR](https://iskillquest.pages.dev/mr-drifter-car-chase-simulator.html)
- [NUBIK CREATE YOUR PLACE](https://iskillquest.pages.dev/nubik-create-your-place.html)
- [CATEGORY DESTROY254](https://themindplay.pages.dev/category-destroy254.html)
- [SKINFLUENCER BEAUTY ROUTINE](https://iskillquest.pages.dev/skinfluencer-beauty-routine.html)
- [SCHOOL LOVE STORY 1](https://themindplays.pages.dev/school-love-story-1.html)
- [CATEGORY CASUAL 4](https://iskillquest.pages.dev/category-casual-4.html)
- [CATEGORY PUZZLE 5](https://skillplay.github.io/category-puzzle-5.html)
- [BUBBLE SHOOTER LEGEND](https://themindplaying.web.app/bubble-shooter-legend.html)
- [WINTER COSMOFEST](https://thelearnquesters.pages.dev/winter-cosmofest.html)
- [CATEGORY MAHJONG GAMES](https://thelearnquesters.pages.dev/category-mahjong-games.html)
- [CATEGORY LOVE12](https://thequizzone.pages.dev/category-love12.html)
- [THE BIG HIT RUN](https://thelearnquesters.pages.dev/the-big-hit-run.html)
- [CATEGORY MAHJONG CONNECT 2](https://thequizzone.pages.dev/category-mahjong-connect-2.html)
- [CATEGORY GROW99](https://thequizzone.pages.dev/category-grow99.html)
- [MAHJONG EARTH](https://thequizzone.pages.dev/mahjong-earth.html)
- [CATEGORY BATTLE524](https://theskillquest.pages.dev/category-battle524.html)
- [CATEGORY MINECRAFT](https://themindplay.pages.dev/category-minecraft.html)
- [CATEGORY NETSUPPORT](https://thequizzone.pages.dev/category-netsupport.html)
- [CATEGORY MERGE TITLES](https://themindplay.pages.dev/category-merge-titles.html)
- [CATEGORY PUZZLE 3](https://themindplay.github.io/category-puzzle-3.html)
- [2248 MUSICAL](https://themindplay.github.io/2248-musical.html)
- [DINO GAME](https://theskillquest.pages.dev/dino-game.html)
- [SUBMARINE ATTACK](https://thequizzone.pages.dev/submarine-attack.html)
- [FORCE MASTER 3D](https://themindplays.pages.dev/force-master-3d.html)
- [CATEGORY MISSION207](https://themindplay.pages.dev/category-mission207.html)
- [INDEX3](https://skillplay.github.io/index3.html)
- [CATEGORY PUZZLE 11](https://themindzone.pages.dev/category-puzzle-11.html)
- [SHIP CONTROL 3D](https://themindplays.pages.dev/ship-control-3d.html)
- [PIRATE PARADISE](https://thelearnquesters.pages.dev/pirate-paradise.html)
- [ANIMATION COLORING ALPHABET LORE](https://thequizzone.pages.dev/animation-coloring-alphabet-lore.html)
- [SNIPER FOR BRAINROT](https://themindzone.pages.dev/sniper-for-brainrot.html)
- [CATEGORY SKILL256](https://skillplay.github.io/category-skill256.html)
- [CATEGORY DIFFICULT81](https://themindplay.github.io/category-difficult81.html)
- [ITALIAN BRAINROT IN GEOMETRY DASH](https://thelearnquesters.pages.dev/italian-brainrot-in-geometry-dash.html)
- [CATEGORY IDLE](https://themindplays.pages.dev/category-idle.html)
- [PIPE CONNECT](https://themindzone.pages.dev/pipe-connect.html)
- [GRANNY 2 ASYLUM HORROR HOUSE](https://themindzone.pages.dev/granny-2-asylum-horror-house.html)
- [CATEGORY ADVENTURE 2](https://thequizzone.pages.dev/category-adventure-2.html)
- [CLASSIC MINE SWEEPER](https://thelearnquesters.pages.dev/classic-mine-sweeper.html)
- [CAT PANCAKE DINER](https://theskillquest.pages.dev/cat-pancake-diner.html)
- [DIY MAKEUP SALON SPA MAKEOVER STUDIO](https://themindzone.pages.dev/diy-makeup-salon-spa-makeover-studio.html)
- [HOLE DEFENSE](https://thequizzone.pages.dev/hole-defense.html)
- [CATEGORY CASUAL971](https://themindplaying.web.app/category-casual971.html)
- [FIND THE GHOST CAT](https://iskillquest.pages.dev/find-the-ghost-cat.html)
- [BOOM LAND LITE](https://thelearnquesters.pages.dev/boom-land-lite.html)
- [IDLE PET](https://thelearnquesters.pages.dev/idle-pet.html)
- [DIRTY MONEY THE RICH GET RICH](https://thequizzone.pages.dev/dirty-money-the-rich-get-rich.html)
- [CATEGORY BUBBLE SHOOTER27](https://themindplays.pages.dev/category-bubble-shooter27.html)
- [COUNT MASTERS SUPERHERO](https://theskillquest.pages.dev/count-masters-superhero.html)
- [CATEGORY CASUAL 4](https://skillplay.github.io/category-casual-4.html)
- [CATEGORY EDUCATIONAL](https://thequizzone.pages.dev/category-educational.html)
- [ONE HERO](https://themindzone.pages.dev/one-hero.html)
- [THE NOOB AVENTURES](https://themindplaying.web.app/the-noob-aventures.html)
- [CATEGORY CANNON22](https://themindplaying.web.app/category-cannon22.html)
- [FLOWER BLOCK](https://theskillquest.pages.dev/flower-block.html)
- [ANGRY FLAPPY](https://themindplays.pages.dev/angry-flappy.html)
- [COLOR WATER PUZZLE](https://themindzone.pages.dev/color-water-puzzle.html)
- [CATEGORY STICKMAN 3](https://theskillquest.pages.dev/category-stickman-3.html)
- [CATEGORY AVOID295](https://themindplaying.web.app/category-avoid295.html)
- [CATEGORY SANDBOX40](https://thequizzone.pages.dev/category-sandbox40.html)
- [PRINXY WINTERELLA](https://thelearnquesters.pages.dev/prinxy-winterella.html)
- [CATEGORY SURVIVAL365](https://theskillquest.pages.dev/category-survival365.html)
- [BUILD AN AQUAPARK](https://thequizzone.pages.dev/build-an-aquapark.html)
- [WORM HUNT](https://learnquester.pages.dev/worm-hunt.html)
- [ELLIE AND BEN CHRISTMAS EVE](https://quizverses.github.io/ellie-and-ben-christmas-eve.html)
- [STARRY STYLE DORAMA OF DREAM](https://thequizzone.pages.dev/starry-style-dorama-of-dream.html)
- [FORMULA RACERS](https://thequizzone.pages.dev/formula-racers.html)
- [PUZZLE BLOCKS FILL IT COMPLETELY](https://themindplaying.web.app/puzzle-blocks-fill-it-completely.html)
- [STACK N SORT](https://studyquests.github.io/stack-n-sort.html)
- [STICKMAN ESCAPES FROM PRISON](https://quizverses.pages.dev/stickman-escapes-from-prison.html)
- [INDEX6](https://quizverses-9d2f2.web.app/index6.html)
- [MY LITTLE CAR WASH](https://themindzone.pages.dev/my-little-car-wash.html)
- [UFO ATTACK](https://quizverses-9d2f2.web.app/ufo-attack.html)
- [CUTE CRAFT LAB](https://themindplay.pages.dev/cute-craft-lab.html)
- [CATEGORY CAR](https://themindplaying.web.app/category-car.html)
- [CATEGORY BRAIN](https://themindplaying.web.app/category-brain.html)
- [MERGE FRUIT](https://quizverses.pages.dev/merge-fruit.html)
- [LOVE TILE TRIO](https://themindplays.pages.dev/love-tile-trio.html)
- [CATEGORY 1 PLAYER139](https://quizverses-9d2f2.web.app/category-1-player139.html)
- [CATEGORY BIKE 3](https://iskillquest.pages.dev/category-bike-3.html)
- [SOLITAIRE MATCH](https://themindzone.pages.dev/solitaire-match.html)
- [CASTLE CRAFT](https://theskillquest.pages.dev/castle-craft.html)
- [ITALIAN BRAINROT SURVIVE PARKOUR](https://theskillquest.pages.dev/italian-brainrot-survive-parkour.html)
- [POP PUZZLE](https://skillplay.github.io/pop-puzzle.html)
- [K POP HUNTER HALLOWEEN FASHION](https://quizverses.github.io/k-pop-hunter-halloween-fashion.html)
- [HEAT INCREMENTAL](https://themindplays.pages.dev/heat-incremental.html)
- [CATEGORY STICKMAN](https://quizverses-9d2f2.web.app/category-stickman.html)
- [BRICK MATCH](https://quizverses.pages.dev/brick-match.html)
- [PET RUNNER](https://quizverses.github.io/pet-runner.html)
- [CATEGORY DESTROY256](https://quizverses.pages.dev/category-destroy256.html)
- [SCARY BABY YELLOW GAME](https://thelearnquesters.pages.dev/scary-baby-yellow-game.html)
- [FNF 2 PLAYER](https://theskillquest.pages.dev/fnf-2-player.html)
- [SUPERMARKET SIMULATOR DREAM STORE](https://themindplay.pages.dev/supermarket-simulator-dream-store.html)
- [MINI SHOOTERS](https://quizverses.github.io/mini-shooters.html)
- [HAWAII MATCH 6](https://theskillquest.pages.dev/hawaii-match-6.html)
- [BUBBLE SHOOTER TEMPLE JEWELS](https://themindplay.pages.dev/bubble-shooter-temple-jewels.html)
- [TIED UP](https://thequizzone.pages.dev/tied-up.html)
- [MERGE CUBES 2048 3D](https://quizverses.github.io/merge-cubes-2048-3d.html)
- [CATEGORY BRAIN](https://quizverses.pages.dev/category-brain.html)
- [WORD RUSH](https://themindplays.pages.dev/word-rush.html)
- [PARKOUR OBBY](https://theskillquest.pages.dev/parkour-obby.html)
- [UNICORN PRINCESS DRESS UP](https://quizverses-9d2f2.web.app/unicorn-princess-dress-up.html)
- [SOFT GIRLS WINTER AESTHETICS](https://quizverses.pages.dev/soft-girls-winter-aesthetics.html)
- [BUSY BEE HIVE](https://quizverses-9d2f2.web.app/busy-bee-hive.html)
- [STREET BALL JAM](https://themindplay.github.io/street-ball-jam.html)
- [GUIVOIO](https://quizverses-9d2f2.web.app/guivoio.html)
- [VEX HYPER DASH](https://quizverses.github.io/vex-hyper-dash.html)
- [GRANDMA RECIPE RAMEN](https://themindplays.pages.dev/grandma-recipe-ramen.html)
- [ONLINE PORTAL](https://quizverses.github.io/)
- [BRAT GIRL SUMMER](https://quizverses.github.io/brat-girl-summer.html)
- [CATEGORY CARDS](https://quizverses-9d2f2.web.app/category-cards.html)
- [CATEGORY PUZZLE 4](https://quizverses.pages.dev/category-puzzle-4.html)
- [CATEGORY CASUAL 8](https://quizverses-9d2f2.web.app/category-casual-8.html)
