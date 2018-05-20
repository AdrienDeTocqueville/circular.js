import { defProp } from "../utils/index.js";

export class VNode
{
    constructor(tagName, model, listeners, attributes, children, component)
    {
        this.tagName = tagName;

        this.model = model;
        this.listeners = listeners;
        this.attributes = attributes;

        this.children = children;
        
        this.component = component;
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
            this.el = this.factory.create(this.parent).$vroot.el;
        }
        else {
            this.el = document.createElement(this.tagName);
          
            this.setAttributes();
            this.setEventListeners();
            this.setModel();
            
            this.children.forEach(child => {
                child.createElement();
                this.el.appendChild(child.el);
            });
        }
    }

    setAttributes()
    {
        for (let attribute in this.attributes) {
            this.el.setAttribute(attribute, this.attributes[attribute]);
        }
    }
    
    setEventListeners()
    {
        for (let event in this.listeners) {
            this.el.addEventListener(event, this.listeners[event]);
        }
    }

    setModel()
    {
        if (this.model)
        {
            var input = this.el;
            const p = Object.getOwnPropertyDescriptor(this.component, this.model.var);

            this.el.addEventListener(this.model.on, function(){p.set(this.value)}); // use old setter to avoid view - model - view update
            defProp(this.component, this.model.var, function(){input.value=p.get()}, false);

            input.value = p.get(); // initialize view
        }
    }
}

export function createComponent(factory, parent)
{
    let vnode = new VNode(undefined, undefined, undefined);
    vnode.factory = factory;
    vnode.parent = parent;

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