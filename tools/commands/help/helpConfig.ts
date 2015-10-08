/**
 * Created by yjtx on 15-9-18.
 */
module helpModule1 {
    var help_dict = global["helpModule"]["help_dict"];
    export var upgrade = {
        "command": "upgrade",
        "desc": help_dict.upgrade0,
        "parameters": [
            {
                "placeholder": "project_name",
                "optional": "true",
                "desc": help_dict.common_proj_name
            }
        ],
        "configs": []

    };

    export var startserver =
    {
        "command": "startserver",
        "desc": help_dict.ss0,
        "parameters": [
            {
                "placeholder": "project_name",
                "optional": "true",
                "desc": help_dict.common_proj_name
            }
        ],
        "configs": [
            {
                "name": "port",
                "prefix": "--",
                "desc": help_dict.ss1,
                "optional": "true",
                "config-paras": [
                    {
                        "placeholder": "3000",
                        "type": "string",
                        "optional": "false"
                    }
                ]
            },
            {
                "name": "ip",
                "prefix": "-",
                "desc": help_dict.ss2,
                "optional": "true",
                "config-paras": []
            },
            {
                "name": "serveronly",
                "prefix": "-",
                "desc": help_dict.ss3,
                "optional": "true",
                "config-paras": []
            }
        ]

    };


    export var info =
    {
        "command": "info",
        "desc": help_dict.info0,
        "parameters": [],
        "configs": []

    };

    export var create_app =
    {
        "command": "create_app",
        "desc": help_dict.build0,
        "parameters": [
            {
                "placeholder": "app_name",
                "optional": "false",
                "desc": help_dict.common_app_name
            }
        ],
        "configs": [
            {
                "name": "f",
                "prefix": "-",
                "desc": help_dict.create_app1,
                "optional": "false",
                "config-paras": [
                    {
                        "placeholder": "h5_game_path",
                        "type": "string",
                        "optional": "false"
                    }
                ]
            },
            {
                "name": "t",
                "prefix": "-",
                "desc": help_dict.create_app2,
                "optional": "false",
                "config-paras": [
                    {
                        "placeholder": "template_path",
                        "type": "string",
                        "optional": "false"
                    }
                ]
            }
        ]

    };


    export var build =
    {
        "command": "build",
        "desc": help_dict.build0,
        "parameters": [
            {
                "placeholder": "project_name",
                "optional": "true",
                "desc": help_dict.common_proj_name
            }
        ],
        "configs": [
            {
                "name": "e",
                "prefix": "-",
                "desc": help_dict.build1,
                "optional": "true",
                "config-paras": [
                ]
            },
            {
                "name": "runtime",
                "prefix": "--",
                "desc": help_dict.build5,
                "optional": "true",
                "config-paras": [
                    {
                        "enum-list": ["native"],
                        "type": "enum",
                        "optional": "false"
                    }
                ]
            }
        ]

    };


    export var create =
    {
        "command": "create",
        "desc": help_dict.create1,
        "parameters": [
            {
                "placeholder": "project_name",
                "optional": "false",
                "desc": help_dict.common_proj_name
            }
        ],
        "configs": [
            {
                "name": "type",
                "prefix": "--",
                "desc": help_dict.create2,
                "optional": "true",
                "config-paras": [
                    {
                        "enum-list": ["empty", "game", "gui", "eui"],
                        "type": "enum",
                        "optional": "false"
                    }
                ]
            }
        ]

    };

    export var create_lib =
    {
        "command": "create_lib",
        "desc": help_dict.create_lib1,
        "parameters": [
            {
                "placeholder": "lib_name",
                "optional": "false",
                "desc": help_dict.lib_name
            }
        ],
        "configs": [
        ]

    };


    export var publish =
    {
        "command": "publish",
        "desc": help_dict.pub1,
        "parameters": [
            {
                "placeholder": "project_name",
                "optional": "true",
                "desc": help_dict.common_proj_name
            }
        ],
        "configs": [
            {
                "name": "version",
                "prefix": "--",
                "desc": help_dict.pub3,
                "optional": "true",
                "config-paras": [
                    {
                        "placeholder": "version",
                        "type": "string",
                        "optional": "true"
                    }
                ]

            },
            {
                "name": "runtime",
                "prefix": "--",
                "desc": help_dict.pub4,
                "optional": "true",
                "config-paras": [
                    {
                        "enum-list": ["html5", "native"],
                        "type": "enum",
                        "optional": "false"
                    }
                ]
            },
            {
                "name": "password",
                "prefix": "--",
                "desc": help_dict.pub6,
                "optional": "true",
                "config-paras": []
            }
        ]

    };

    export var apitest =
    {
        "command": "apitest",
        "desc": help_dict.create_lib1,
        "parameters": [
            {
                "placeholder": "project_name",
                "optional": "true",
                "desc": help_dict.common_proj_name
            }
        ],
        "configs": [
        ]

    };

}

export = helpModule1;

