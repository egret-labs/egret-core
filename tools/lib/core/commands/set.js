/**
 * Created by egret on 2015/2/12.
 */
//console.log( "help_def_set head:" );
var locale = require( "../locale/zh-CN.js" );
//console.log( "help_def_set after zh-CN:" );

exports.help_def = {};


exports.help_def.build_doing =
{
    "command" : "build"

    ,"desc" : locale.help_dict.build0

    ,"parameters" : [
    {
        "placeholder" : "project_name"
        ,"optional" : "true"
        ,"desc" : locale.help_dict.common_proj_name
    }
]

    , "configs" : [
    {
        "name" : "k"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.build4
        ,"optional" : "true"

        ,"config-paras" : [
    ]
    }
    ,{
        "name" : "runtime"
        ,"prefix": "--"
        ,"desc" : locale.help_dict.build5
        ,"optional" : "true"

        ,"config-paras" : [
            {
                "enum-list" : ["native" ]
                ,"type" : "enum"
                ,"optional" : "false"
            }
        ]
    }
    ,{
        "name" : "noscan"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.build6
        ,"optional" : "true"

        ,"config-paras" : [
        ]
    }
    ,{
        "name" : "log"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.build7
        ,"optional" : "true"

        ,"config-paras" : [
        ]
    }
]

}


exports.help_def.create =
{
   "command" : "create"

   ,"desc" : locale.help_dict.create1

   ,"parameters" : [
   {
      "placeholder" : "project_name"
      ,"optional" : "true"
      ,"desc" : locale.help_dict.common_proj_name
   }
]

   ,"configs" : [
       {
          "name" : "type"
          ,"prefix": "--"
          ,"desc" : locale.help_dict.create2
          ,"optional" : "true"

          ,"config-paras" : [
             {
                "enum-list" : [ "empty", "core" ,"gui" ]
                ,"type" : "enum"
                ,"optional" : "false"
             }
          ]
       }
    ]

}


exports.help_def.publish =
{
    "command" : "publish"

    ,"desc" : locale.help_dict.pub1

    ,"parameters" : [
    {
        "placeholder" : "project_name"
        ,"optional" : "true"
        ,"desc" : locale.help_dict.common_proj_name
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
