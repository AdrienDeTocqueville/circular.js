
export class VNode
{
    constructor(tagName, attributes, children, text)
    {
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = children;
        this.el = undefined;
        this.isRoot = false;
        this.parent;
        this.text = text;
    }
}

export function createTextNode(text)
{
    return new VNode(undefined, undefined, undefined, text);
}