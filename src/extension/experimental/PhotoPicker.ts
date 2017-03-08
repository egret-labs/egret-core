namespace egret.experimental {
    /**
    * @language en_US
    * The pickPhoto method provides ability for picking a photo.
    * @version Egret 4.0
    * @platform Web
    */
    /**
     * @language zh_CN
     * pickPhoto API提供用于选取照片的方法。
     * @version Egret 4.0
     * @platform Web
     */
    export function pickPhoto(): Promise<string> {
        return new Promise((resolve, reject) => {
            let fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.style.display = "none";
            document.body.insertBefore(fileInput, document.body.firstChild);
            fileInput.addEventListener("change", function (evt) {
                let mime = { "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "bmp": "image/bmp" };
                let file = (evt.target as any).files[0];
                let type = file.type;
                if (!type) {
                    type = mime[file.name.match(/\.([^\.]+)$/i)[1]];
                }
                let ret = "";
                if (window.URL) {
                    ret = window["URL"]["createObjectURL"](file);
                }
                else {
                    ret = window["webkitURL"]["createObjectURL"](file);
                }
                let xhr = new XMLHttpRequest();
                xhr.open("GET", ret, true);
                xhr.responseType = "blob";
                xhr.onload = function (e) {
                    if (this["status"] == 200) {
                        let myBlob = this["response"];
                        let arrayBuffer = null;
                        let fileReader = new FileReader();
                        fileReader.onload = function () {
                            arrayBuffer = this.result;
                            let exif = EXIF.readFromBinaryFile(arrayBuffer);
                            let orientation = -1;
                            if (exif) {
                                orientation = exif["Orientation"];
                            }
                            let image = new Image();
                            image.onload = function () {
                                let canvas = document.createElement("canvas");
                                let ctx = canvas.getContext("2d");
                                canvas.width = image.width;
                                canvas.height = image.height;
                                if (orientation > 4) {
                                    canvas.width = image.height;
                                    canvas.height = image.width;
                                }
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                switch (orientation) {
                                    case 2:
                                        // horizontal flip
                                        ctx.translate(canvas.width, 0);
                                        ctx.scale(-1, 1);
                                        break;
                                    case 3:
                                        // 180° rotate left
                                        ctx.translate(canvas.width, canvas.height);
                                        ctx.rotate(Math.PI);
                                        break;
                                    case 4:
                                        ctx.translate(0, canvas.height);
                                        ctx.scale(1, -1);
                                        break;
                                    case 5:
                                        ctx.rotate(0.5 * Math.PI);
                                        ctx.scale(1, -1);
                                        break;
                                    case 6:
                                        ctx.rotate(0.5 * Math.PI);
                                        ctx.translate(0, -image.height);
                                        break;
                                    case 7:
                                        ctx.rotate(0.5 * Math.PI);
                                        ctx.translate(canvas.width, -canvas.height);
                                        ctx.scale(-1, 1);
                                        break;
                                    case 8:
                                        ctx.rotate(-0.5 * Math.PI);
                                        ctx.translate(-canvas.height, 0);
                                        break;
                                    default: ctx.transform(1, 0, 0, 1, 0, 0);
                                }
                                ctx.drawImage(image, 0, 0);
                                let imagetype = "png";
                                if (orientation !== -1) {
                                    imagetype = "jpeg";
                                }
                                let resultURL = "";
                                if (imagetype === "jpg" || imagetype === "jpeg") {
                                    resultURL = canvas.toDataURL("image/" + imagetype);
                                } else {
                                    resultURL = canvas.toDataURL("image/" + imagetype);
                                }
                                resolve(resultURL);
                                image.parentNode.removeChild(image);
                                fileInput.parentNode.removeChild(fileInput);
                            };
                            image.src = ret;
                            image.style.display = "none";
                            document.body.appendChild(image);
                            fileInput.value = "";
                        };
                        fileReader.readAsArrayBuffer(myBlob);
                    }
                };
                xhr.send();
            }, false);
            fileInput.click();
        }
        );
    }
}