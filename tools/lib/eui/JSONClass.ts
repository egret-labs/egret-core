class JSONClass {
    private json = {};
    public clear() {
        this.json = {};
    }
    public toCode(): string {
        let str = JSON.stringify(this.json);
        str = str.replace(/\\\\n/g, "\\n");
        return str;
    }
    public addContent(value: any, path: string, name = "elementsContent") {
        let paths = path.split("/");
        let target = this.json;
        for (let p of paths) {
            let tempParent = target;
            target = target[p];
            if (target == undefined) {
                target = {};
                tempParent[p] = target;
            }
        }
        target[name] = value;
    }

    public hasClassName(className: string) {
        for (let name in this.json) {
            if (name == className)
                return true;
        }
        return false;
    }
}
export let jsonFactory = new JSONClass();