export class VNode
{
    constructor(tagName, data, children)
    {
        this.tagName = tagName;
        this.data = data;
        this.children = children;
        this.el = undefined;
        this.isRoot = !!this.parent;
        this.bindToChildren();
       
    }

    bindToChildren(){
        if (!this.children) return;
        for (let child of this.children){
            child.parent = this;
        }
    }
}

export function createEmptyNode()
{
    let vnode = new VNode(undefined, undefined, undefined);
    vnode.isEmpty = true;

    return vnode;
}

export function createTextNode(text)
{
    let vnode = new VNode(undefined, undefined, undefined);
    vnode.text = text;

    return vnode;
}