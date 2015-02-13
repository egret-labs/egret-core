/**
 * Created by egret on 2015/2/12.
 */
//console.log( "help_def_set head:" );
var locale = require( "../locale/zh-CN.js" );
//console.log( "help_def_set after zh-CN:" );

exports.help_def = {};

exports.help_def.publish =
{
    "command" : "publish"

    ,"desc" : locale.help_dict.pub1

    ,"parameters" : [
    {
        "placeholder" : "project_name"
        ,"optional" : "true"
        ,"desc" : locale.help_dict.pub2
    }
]

    ,"configs" : [
    {
        "name" : "version"
        ,"prefix": "--"
        ,"desc" : locale.help_dict.pub3
        ,"optional" : "true"

        ,"config-paras" : [
        {
            "placeholder" : "version"
            ,"type" : "num"
            ,"optional" : "true"
        }
    ]

    }
    ,{
        "name" : "runtime"
        ,"prefix": "--"
        ,"desc" : locale.help_dict.pub4
        ,"optional" : "true"

        ,"config-paras" : [
            {
                "enum-list" : [ "html5" ,"native" ]
                ,"type" : "enum"
                ,"optional" : "false"
            }
        ]
    }
    ,{
        "name" : "zip"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.pub5
        ,"optional" : "true"

        ,"config-paras" : [ ]
    }
    ,{
        "name" : "password"
        ,"prefix": "--"
        ,"desc" : locale.help_dict.pub6
        ,"optional" : "true"

        ,"config-paras" : [ ]
    }
]

}