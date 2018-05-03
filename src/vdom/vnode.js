
export class VNode
{
    constructor(tagName, data, children, text)
    {
        this.tagName = tagName;
        this.data = data;
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
        }
    }


}

export function createTextNode(text)
{
    return new VNode(undefined, undefined, undefined, text);
}