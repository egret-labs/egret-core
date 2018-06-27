# Egret Engine 5.1.1 Release Notes


---

Egret engine was officially released in December 2017 version 5.1. This version is a functional iteration of 5.1, the main goal is to provide new improvements, as well as some bug fixes for 5.1.0.



## compiler build pipeline to introduce custom plug-in mechanism

The Egret engine introduced a new compiler build pipeline in version 5.1 to make it easier for developers to understand the underlying principles of the compiler. This time, developers introduced an important improvement that allows developers to customize the build pipeline for the ego compiler , Developers can easily write some plug-ins, such as:

* Ignore specific files, do not publish it to the target directory.
* Merge the configuration files
* Upload FTP

## egret target command

An egret target command was introduced that provides the underlying foundation for future egrets to be released to more platforms.




## EUI released size optimization

Through the combing and refactoring of the EXML Builder, we optimized the volume of the default.thm.json file (gjs mode) after the release of EXML by about 10% and slightly increased the release speed in this release. Large projects (over 200 EXML files) about 5s or so.

At the same time we have introduced a new commonjs mode, his generated code will be exactly the same with the gjs mode, but the resolution is faster, it is recommended that all developers using gjs mode switch to commonjs mode

|Strategy Mode | Operation Theory | Benefits | Disadvantages | Applicable Scenarios
|:---:|:---:|:----:|:---:|:---:|
| debug / path | Stores only paths, loading and parsing exml files and skinning at runtime | No compilation required | Slow loading speed | Debugging mode |
| content | Store exml content, parse and generate skin dynamically at runtime according to xml content in content | Overall file size is small | Runtime needs to parse exml as the subject skin, heavy game parsing speed will be slow | Mild game usage
| gjs | store exml compiled js code | resolution speed | size larger, is gradually optimized | recommended to use commonjs instead
| commonjs | Stores compiled JS code directly, runs directly in JS mode | Resolution fastest | Bigger size, optimizing step by step | Severe game usage

This is our initial work on EUI size optimization. The follow-up version will steadily advance as the 5.1 roadmap. We hope to eventually reduce the size of the skin files by more than half.