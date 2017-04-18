namespace egret {

    /**
     * @private
     */
    export interface MapLike<T> {

        [key: string]: T

        [key: number]: T

    }

    /**
     * @private
     */
    export function createMap<T>(): MapLike<T> {

        let obj: any = Object.create(null);
        obj.__v8__ = undefined;
        delete obj.__v8__;
        return obj;

    }

}