/**
 * Created by egret on 2015/2/12.
 */
//console.log( "help_def_set head:" );
var locale = require( "../locale/zh-CN.js" );
//console.log( "help_def_set after zh-CN:" );

exports.help_def = {};


exports.help_def.upgrade =
{
    "command" : "upgrade"

    ,"desc" : locale.help_dict.upgrade0

    ,"parameters" : [
    {
        "placeholder" : "project_name"
        ,"optional" : "true"
        ,"desc" : locale.help_dict.common_proj_name
    }
]

    , "configs" : [
]

}


exports.help_def.startserver =
{
    "command" : "startserver"

    ,"desc" : locale.help_dict.ss0

    ,"parameters" : [
    {
        "placeholder" : "project_name"
        ,"optional" : "true"
        ,"desc" : locale.help_dict.common_proj_name
    }
]

    , "configs" : [
    {
        "name" : "port"
        ,"prefix": "--"
        ,"desc" : locale.help_dict.ss1
        ,"optional" : "true"

        ,"config-paras" : [
        {
            "placeholder":"3000"
            , "type" : "string"
            , "optional" : "false"
        }
    ]
    }
    ,{
        "name" : "ip"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.ss2
        ,"optional" : "true"

        ,"config-paras" : [
    ]
    }
    ,{
        "name" : "serveronly"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.ss3
        ,"optional" : "true"

        ,"config-paras" : [
        ]
    }
]

}


exports.help_def.info =
{
    "command" : "info"

    ,"desc" : locale.help_dict.info0

    ,"parameters" : [
    ]

    , "configs": [

]

}


exports.help_def.create_manifest =
{
    "command" : "create_manifest"

    ,"desc" : locale.help_dict.create_manifest0

    ,"parameters" : [
    {
        "placeholder" : "app_name"
        ,"optional" : "true"
        ,"desc" : locale.help_dict.common_app_name
    }
]

    , "configs" : [
    {
        "name" : "all"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.create_manifest1
        ,"optional" : "true"

        ,"config-paras" : [
        ]
    }
]

}


exports.help_def.create_app =
{
    "command" : "create_app"

    ,"desc" : locale.help_dict.build0

    ,"parameters" : [
    {
        "placeholder" : "app_name"
        ,"optional" : "true"
        ,"desc" : locale.help_dict.common_app_name
    }
]

    , "configs" : [
    {
        "name" : "f"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.create_app1
        ,"optional" : "true"

        ,"config-paras" : [
            {
                "placeholder" : "h5_game_path"
                ,"type" : "string"
                ,"optional" : "true"
            }
        ]
    }
    ,{
        "name" : "t"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.create_app2
        ,"optional" : "true"

        ,"config-paras" : [
            {
                "placeholder" : "template_path"
                ,"type" : "string"
                ,"optional" : "true"
            }
        ]
    }
]

}


exports.help_def.build =
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
        "name" : "e"
        ,"prefix": "-"
        ,"desc" : locale.help_dict.build1
        ,"optional" : "true"

        ,"config-paras" : [
            {
                "placeholder" : "clean"
                ,"optional" : "true"
                ,"type" : "string"
                ,"prefix": "-"
                ,"desc" : locale.help_dict.build2
            }
        ]
    }
    ,{
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
                ,"type" : "string"
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
