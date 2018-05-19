export class VNode
{
    constructor(tagName, data, children)
    {
        this.tagName = tagName;
        this.data = data;
        this.children = children;
        
        this.el = undefined;
    }

    createElement()
    {
        if (this.text || this.text === '') {
            this.el = document.createTextNode(this.text);
        }
        else if (this.isEmpty) {
            this.el = document.createComment("v-if node");
        }
        else if (this.factory) {
            this.el = this.factory.create().$vroot.el;
        }
        else {
            this.el = document.createElement(this.tagName);
          
            this.setAttributes();
            this.setEventListeners();
            
            this.children.forEach(child => {
                child.createElement();
                this.el.appendChild(child.el);
            });
        }
    }

    setAttributes()
    {
        for (let attribute in this.data.attributes) {
            this.el.setAttribute(attribute, this.data.attributes[attribute]);
        }
    }
    
    setEventListeners()
    {
        for (let event in this.data.listeners) {
            this.el.addEventListener(event, this.data.listeners[event]);
        }
    }
}

export function createComponent(factory)
{
    let vnode = new VNode(undefined, undefined, undefined);
    vnode.factory = factory;

    return vnode;
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