export class JSONClass {
    private json = {};
    public get Json() {
        return this.json;
    }
    public addContent(value: any, path: string, name = "elementsContent") {
        let paths = path.split(".");
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
} 