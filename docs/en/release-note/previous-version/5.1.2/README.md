# Egret Engine 5.1.2 Release Notes


---

Egret engine was officially released in December 2017 version 5.1. This version is a functional iteration of the 5.1 version, the main goal is to add support for WeChat mini game and add AssetsManager Explorer.



## WeChat mini game

Egret engine has been added in the 5.1.1 version of WeChat mini game support, this feature is currently a lot of developers to actively use and feedback, we collected a lot of developer feedback, and added the following features:

* Create WeChat mini game project can not be passed into the appid, Egret engine for developers to set a WeChat for developers to provide the default value
* Added the current release target function, developers can set the current release target. For example, if you set the publishing target to wxgame, the developer will have to go egret build / egret publish / egret run without adding the --target wxgame field.
* WeChat mini game support package updated to version 1.0.4, the new project template adds a WeChat mini game API can be directly called the Demo, and add manually modify the screen size of the API
* Egret engine project template upgrade, developers do not need to manually modify the `` `scripts / config.ts``` can automatically generate a small game project
* Add `` `egret run --target wxgame``` command, developers can start this app by directly launching WeChat web developer tool to preview the game.




Due to the addition of these features, we strongly encourage developers to use Wechat Engine version 5.1.2 for the development of WeChat mini games instead of the 5.1.1 version released two weeks ago.


## Resource Manager AssetsManager


The Egret Engine introduced a Resource Manager named ResourceManager as an alternative to the RES module in version 4.0. After a year of user feedback gathering and functional iteration, we formally adopted ResourceManager as the default module for creating new projects in version 5.1.2, replacing the RES module completely and officially changing it to the AssetsManager.


The previous ResourceManager module has exactly 90% of the APIs of the RES module, and the AssetsManager inherits this. At the same time, the AssetsManager fully supports the configuration of the RES module like `` `default.res.json``` File to ensure that as much as possible to ensure that developers continue to use their familiar workflow and a gradual migration.


While updating AssetsManager, we also added two very useful build pipeline plug-ins for the resource management module, namely:

* Resource configuration file automatically generated plug-in, developers can use this plug-in `` `default.res.json`` configuration file automatically generated
* Texture set automatically merge plug-ins, developers can use this plugin to automatically merge textures in egret publish``

When using the AssetsManager instead of the RES module, the following incompatibilities exist:

* RES.Analyzer API is no longer supported, instead RES.Processor API is used instead
* If you try to get a configuration that does not exist in the resource configuration file, an exception is currently thrown instead of returning null

Although we advise developers to use the AssetManager module, the Egret engine still allows developers to continue using the RES module. Instead, the developer only needs to modify the `` assetsmanager`` in the `` `egretProperties.json``` configuration file to `` `res``` and execute` `` egret clean``` can.


## BUG fix

* Fixed bug where release mode was set to commonjs if developer used custom namespace on className property of exml file,
* Fixed exml file generated exml.e.d.ts file, the skin file does not inherit the problem of eui.Skin correctly
* Modified egret publish's default publishing path to fix conflicts that Egret Wing has posted while merging textures
* Fixed bug where eui layout was abnormal under certain circumstances
* Fixed an irregular mask drawing position offset problem
* Fixed an issue with using filters that caused the drawing position to shift



# More features stay tuned

In the egret engine 5.1 update log, we mentioned that version 5.1 will provide developers with the following features step by step:

* Switch the built-in resource load module to the Egret ResourceManager
* Improve EUI loading speed and resource size
* Dramatically improve native App performance
* More release platform support
* Faster build speed

Currently, we have completed the support of the built-in resource loading module migration ResourceManager (renamed AssetsManager) and the WeChat mini game publishing platform, and initially improved the loading speed and resource size of the EUI. We will provide the following functions as soon as possible Ensure that version 5.1 stable

* Further improve EUI's loading speed and resource size
* Dramatically improve native App performance
* WeChat gaming platform better support
* Faster build speed
