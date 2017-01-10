namespace egret.native {
    export function pickPhoto(): Promise<ArrayBuffer> {
        return new Promise((resolve) => {
            var promise = egret.PromiseObject.create();
            promise.onSuccessFunc = (content) => {
                resolve(content);
            };
            egret_native.pickPhoto(promise);
        });
    }
}