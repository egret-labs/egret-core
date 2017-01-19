namespace egret {
    /**
     * 打开照片选择窗口，返回Promise对象，resolve参数为ArrayBuffer类型的照片数据,可以使用BitmapData的create方法将ArrayBuffer构造为BitmapData实例
     */
    export function pickPhoto(): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            if (egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
                let promise = egret.PromiseObject.create();
                promise.onSuccessFunc = (content) => {
                    resolve(content);
                };
                egret_native.pickPhoto(promise);
            }
            else {
                let input = document.createElement<"input">("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (event) => {
                    let fileInput = (event.currentTarget as HTMLInputElement).files;
                    let photoURL = window.URL.createObjectURL(fileInput[0]);
                    let img = new Image();
                    let xhr = new XMLHttpRequest();
                    xhr.open("GET", photoURL, true);
                    xhr.responseType = "blob";
                    xhr.onload = response;
                    xhr.send();
                    function response(e) {
                        if (Number(this.status) === 200) {
                            let blob = this.response;
                            let fileReader = new FileReader();
                            fileReader.onload = function () {
                                resolve(this.result);
                            };
                            fileReader.readAsArrayBuffer(blob);
                        }
                        else if (Number(this.status) >= 400) {
                            reject("faild with status" + this.status);
                        }
                    }
                };
                let event = document.createEvent("MouseEvents");
                event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                input.dispatchEvent(event);
            }
        });
    }
}