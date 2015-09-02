module egret {

    $locale_strings = $locale_strings || {};
    $locale_strings["zh_CN"] = $locale_strings["zh_CN"] || {};
    var locale_strings = $locale_strings["zh_CN"];

    //RES
    locale_strings[2000] = "RES.createGroup()传入了配置中不存在的键值: {0}";
    locale_strings[2001] = "RES加载了不存在或空的资源组:\"{0}\"";
    locale_strings[2002] = "请不要使用不同的类型方式来加载同一个素材！";
    locale_strings[2003] = "找不到指定文件类型的解析器:{0}。 请先在项目初始化里注册指定文件类型的解析器，再启动资源加载。";
}