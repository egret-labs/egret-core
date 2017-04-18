var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fetch = function (url) {
    return new Promise(function (reslove, reject) {
        var http = new XMLHttpRequest();
        http.open("GET", url);
        http.onload = function () {
            var json = JSON.parse(http.responseText);
            reslove(json);
        };
        http.send();
    });
};
function run() {
    return __awaiter(this, void 0, void 0, function () {
        function updateState(port, div) {
            return new Promise(function (reslove, reject) {
                fetch("http://localhost:" + port + "/index.html").then(function (response) {
                    div.innerText = response.output;
                    reslove(response);
                });
            });
        }
        var app, iframe, dashboard, sub_process, intervalKey;
        return __generator(this, function (_a) {
            app = document.getElementById("app");
            iframe = document.createElement("iframe");
            dashboard = document.createElement("div");
            iframe.width = '480px';
            iframe.height = '800px';
            app.appendChild(dashboard);
            app.appendChild(iframe);
            sub_process = [
                { port: 4000 },
            ].map(function (s) {
                var container = document.createElement("div");
                dashboard.appendChild(container);
                return {
                    container: container,
                    port: s.port
                };
            });
            intervalKey = setInterval(function () {
                var current = 0;
                sub_process.forEach(function (card) {
                    updateState(card.port, card.container).then(function (response) {
                        if (response.code == 1) {
                            current++;
                        }
                        if (response.code == 2) {
                            clearInterval(intervalKey);
                        }
                        if (current == sub_process.length) {
                            if (!iframe.src) {
                                dashboard.hidden = true;
                                iframe.src = 'http://localhost:3005/index.html';
                                clearInterval(intervalKey);
                            }
                        }
                        else {
                            dashboard.hidden = false;
                        }
                    });
                });
            }, 1000);
            return [2 /*return*/];
        });
    });
}
;
run();
