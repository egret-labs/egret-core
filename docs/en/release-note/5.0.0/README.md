Egret Engine 5.0.0 Release Note
===============================
Latest update: June 1, 2017

Welcome to use Egret Engine !

## Overview
The egret engine contains the HTML5 standard game engine developed by the egret era. He includes 2D / 3D rendering core, GUI system, audio management, resource management, and other common modules of the game engine.
By using the egret engine, developers can do as much as possible without paying attention to the underlying implementation of the browser, to solve the HTML5 game performance problems and fragmentation problems, and flexibly meet the needs of developers to develop 2D or 3D games.
This update is the first release of the egret engine 5, bringing about a new WebAssembly based rendering architecture.
In this update, in addition to engine running code, the egret engine provides a whole new engine code library manager. With the support of the new code base manager, the version of the egret engine will be more flexible.

## Updates
* command line tools
    * the compression and decompression commands built into the engine are adjusted from calling java to calling node + asm.js, so the developer does not need to pre install the Java environment
* egret engine 2D rendering - WebAssembly
    * introducing new WebAssembly modules to dramatically increase rendering speed
    * rollback to asm.js mode on devices that do not support WebAssembly, ensuring that they are still running smoothly
    * WebAssembly follow up road map
        * design and implement high performance API
        * built in animation, physics, and particle systems
        * multi thread off screen rendering technology
        * single instruction set multiple data (SIMD)
        * open source C++ code
    * egret engine 2D rendering - JavaScript
        * keep existing JavaScript rendering logic, and developers can decide to use the new WebAssembly schema or the existing JavaScript schema
        * the JavaScript model based on the egret engine 4.x will be maintained for long periods of time to ensure that existing developers can continue to use it

## Known Issues
    * developers using WebAssembly renderer will now create object times errors at the class's static variable declarations
    * WebAssembly rendering does not support EUI modules and DragonBones modules for the time being