
class VNode {

    constructor(tagname,attibutes, children, text){

        this.tagname = tagname;
        this.attributes = attibutes;
        this.children=children;
        this.el = undefined;
        this.isRoot = false;
    }
}