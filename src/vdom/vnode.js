
export class VNode {

    constructor(tagname, attributes, children, text){

        this.tagname = tagname;
        this.attributes = attributes;
        this.children = children;
        this.el = undefined;
        this.isRoot = !!this.parent;
        this.text = text;
        this.bindToChildren()
    }

    bindToChildren(){
        if (!this.children) return;
        for (let child of this.children){
            child.parent = this;
            console.log("parent" ,child.parent)
        }
    }


}

export function createTextNode(text){
    return new VNode(undefined, undefined, undefined, text);
}