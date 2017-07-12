Egret Engine 4.1.0 Release Note
===============================


Last Updated：22 May, 2017


Welcome to use Egret Engine !


## Updated Items:

* Egret CLI Tools
    * The engine provides a modular update mechanism, and developers do not have to worry about engine upgrades that cause other problems without upgrading the engine version. For details, see [Documentation] (http://developer.egret.com/cn/github/egret-docs/Engine2D/projectConfig/configFile/index.html)
	* Introduce a new third-party library building mechanism to standardize library projects. For details, please refer to [Documentation] (http://developer.egret.com/cn/github/egret-docs/Engine2D/projectConfig/libraryProject/index.html)

* Egret engine rendering core
    * Optimize the rendering structure, allowing developers to set the parameters, so that the font rendering in the high-resolution screen is more clear and sharp.
	* WebGL mode supports smoothing attributes.
	* Fix the TypeScript compiler to compile the results incorrectly.
	* Repair filter is not correct.
	* Repair URLLoader in the native environment error.

* ResourceManager
    * Built-in file content changes based on the difference update mechanism, significantly reduce the game in the updated version of the flow overhead, thereby reducing the user's traffic consumption.
	* Fix several BUGs when the resource management framework is running.