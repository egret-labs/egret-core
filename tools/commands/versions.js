/// <reference path="../lib/types.d.ts" />
var version = require("../parser/Version");
var versions = (function () {
    function versions() {
    }
    versions.prototype.execute = function () {
        var versions = version.getEngineVersions();
        versions.forEach(function (engine) {
            console.log(("Egret Engine " + engine.version + "  ") + engine.root);
        });
        return 0;
    };
    return versions;
})();
module.exports = versions;

//# sourceMappingURL=../commands/versions.js.map