Object.defineProperty(exports, "__esModule", { value: true });
var JSONClass = /** @class */ (function () {
    function JSONClass() {
        this.json = {};
    }
    JSONClass.prototype.clear = function () {
        this.json = {};
    };
    JSONClass.prototype.toCode = function () {
        var str = JSON.stringify(this.json);
        str = str.replace(/\\\\n/g, "\\n");
        return str;
    };
    JSONClass.prototype.addContent = function (value, path, name) {
        if (name === void 0) { name = "elementsContent"; }
        var paths = path.split("/");
        var target = this.json;
        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
            var p = paths_1[_i];
            var tempParent = target;
            target = target[p];
            if (target == undefined) {
                target = {};
                tempParent[p] = target;
            }
        }
        target[name] = value;
    };
    JSONClass.prototype.hasClassName = function (className) {
        for (var name in this.json) {
            if (name == className)
                return true;
        }
        return false;
    };
    return JSONClass;
}());
exports.jsonFactory = new JSONClass();
