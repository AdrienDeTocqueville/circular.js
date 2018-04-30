
class VNode {

    constructor(tagname, attributes, children, text){

        this.tagname = tagname;
        this.attributes = attributes;
        this.children = children;
        this.el = undefined;
        this.isRoot = false;
        this.parent;
        this.text = text;
    }
}

function createTextNode(text){
    return new VNode(undefined, undefined, undefined, text);
}