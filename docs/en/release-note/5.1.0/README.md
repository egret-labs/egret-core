# Egret Engine 5.1 Release Notes


---

The Egret Engine v5.0 was released in May 2017, after 14 iterations iterative, and gradually provide developers with the following features:

* WebAssembly renderer beta, significantly improve the efficiency of the game rendering
* Text and vector rendering optimization, significantly improve the large-screen mobile phone text and vector rendering clarity
* Dramatically improve the performance of DragonBones skeletal animation
* Improve the compilation speed of EUI projects
* Fix some iOS device users rendering exceptions after activating input text


Currently, all the above functions were stable. The Egret Engine will be followed by a two setp version iteration strategy. On the one hand, we constantly improve version 5.0.x without introducing any new features, focusing on stability improvements, bug fixes and minor performance optimizations that do not undermine the overall architecture. On the other hand, Version 5.1 will be released with new features.


For game developers, we recommend using the stable version if your game has been released or is coming soon. If you are just starting a new project using the Egret Engine or you are in urgent need of some new features, you should use version 5.1 . Our development team will be based on the feedback collected developers to improve version 5.1. If you are experiencing any problems or suggestions on using version 5.1, feel free to contact the Egret Engine team for the first time to help you solve problems.

When the v5.1 is gradual stability, the Egret Engine will provide a official guides about upgrade from 5.0.x to 5.1.x.


As the HTML5 game are more and more heavy, the Egret Engine have done a lot of targeted improvements to enhance the development of serious game experience in recent months. We believe that the development of a heavy H5 game, there are still several following pain points need to be resolved:

* The build speed of the Heavy game is too slow
* Building workflow is not easy to expand
* The game performance needs to be further improved


Next, We will show you the new features of the Egret Engine version 5.1.





# Optimize rendering performance, the overall game frame rate increase of 10%

The egret engine include the WebAssembly renderer in version 5.0, dramatically improving the rendering performance of the game. During this process, the Egret team also summarized more HTML5 game rendering optimization strategies and applied these strategies to existing JavaScript rendering modules. In short, the Egret engine 5.1 version of the JavaScript renderer got further performance improvements, especially on a specific Benchmark, boosting more than three times
![](c2.png)


In a real game project, since the game's rendering list is far more complex than a particular benchmark and the business logic overhead of the game can be quite a bit of a hit, our actual game in-game tests lead us to deduce that this change will have an impact on your overall game performance Will bring about 10% performance increase.

![](c1.png)





# New compiler architecture, more convenient customize workflow

The Egret Engine 5.1 introduced a new command line architecture that focused on```egret build```and```egret publish```commands and renamed the command line to the egret compiler.

In previous versions, the Egret Engine build and release command was a black box for developers, and developers only knew that when you executed```egret build```and```egret publish```, After that, after a brief (or long) wait, your source code and resources are magically generated into specific locations. When developers need to extend an engine's publishing, you can not customize the engine's publishing process. Instead, write your own scripts and include the egress engine's publishing process as part of your written script.


In the new version, all the behaviors of the Egret compiler builds into as plug-ins and show the execution order of the plug-ins directly to you, as follows:

The project structure includes the following modifications

```
egret-project
    |-- src
    |-- resource
    |-- scripts
        |-- api.d.ts // document
        |-- config.ts // build script entry
```

The```config.ts```contains the following code:

```
export const config = {

    buildConfig: (params) => {
        return {
                outputDir,
                commands: [
                    new ExmlPlugin(),
                    new CompilePlugin(),
                    new UglifyPlugin()
                ]
        }
    }
} 

```

Through the above code, we can clearly see that the engine conference has implemented EXML build, source code compilation, code obfuscation of these three steps. On the one hand, you can see exactly what is being done on the command line and on the other hand, you can easily adapt these configurations.

In the next small version, we will allow developers to add your own plug-ins to extend the entire publishing process.

# Refactoring and optimizing the build logic to speed up the build process

In the new compiler development process, we optimized the internal logic of the compiler to solve the problem of slow compilation of large projects. With the introduction of the virtual file system as a compiler abstraction of underlying hard disk data, the new compiler gets about a 10% faster build speed for incremental compilation, and is more pronounced on mechanical hard disks.

In addition, due to the use of stream-based file processing mechanism, the engine release speed has been greatly improved, through a technical cooperation between the Egret engine and a heavy game as an example, the project contains more than 11,000 files, 500 Mega resources, released a native version of the release rate from 150 seconds to 50 seconds.

The v5.1 is just the first step toward optimizing your build speed, and then we will gradually improve the build speed of the engine.


# Item configuration files combing, more understandable product experience

Each egret engine project contains a```egretProperties.json```file that previously contained a field named```egret_version```that specifies which version of the egret engine to use for compilation .


In v5.1, we introduced two new fields,```compilerVersion```and```engineVersion```, which respectively represent the engine compiler version and the engine runtime library version. The original```egret_version```field will be deprecated in the new version.

This change is to more clearly express "compiler" and "engine" are two different concepts. The compiler refers to the commands needed by developers such as egret build / egret publish, and the engine refers to the JavaScript needed by the game such as egret.js / eui.js. The previous "egret_version" can not clearly express this concept.


Starting from v5.1, we recommend that developers use the latest compiler versions, as well as relatively stable engine versions. Since the compiler independence, egrets can provide developers with more valuable features, so developers do not need to worry about the inability of your existing projects to use the new compiler architecture.




# More features coming soon

The Egret Engine version 5.1 will release some exciting new features over the next month, including:

* Switch the built-in resource load module to the Egret ResourceManager
* Improve EUI loading speed and resource size
* Dramatically improve native App performance
* More platform support
* Faster build speed


At the same time, we will continue to improve version 5.0.x to further improve the stability of your existing projects.